// End-to-end check of online play: opens a host tab and a guest tab in one
// headless Edge, lets them find each other through the real PeerJS broker and
// plays a bot-vs-bot match over WebRTC.
//   node tools/nettest.mjs [outDir] [baseUrl]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const outDir = process.argv[2] || 'screenshots';
const base = process.argv[3] || 'http://127.0.0.1:4181/';
// Extra URL flags for both tabs, e.g. "norender&lag=100&jitter=20&loss=5".
const extra = process.argv[4] ? '&' + process.argv[4] : '';
fs.mkdirSync(outDir, { recursive: true });
const edge = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// One browser per player: a tab that is not in front gets its frames
// throttled, which would make one side of the match crawl.
const browsers = [];
function launch() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'gc-net-'));
  const port = 9400 + Math.floor(Math.random() * 500);
  const proc = spawn(edge, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--window-size=960,540', '--mute-audio', '--no-first-run',
    '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', 'about:blank'], { stdio: 'ignore' });
  const b = { profile, port, proc };
  browsers.push(b);
  return b;
}

async function api(port, pathname, method = 'GET') {
  for (let i = 0; i < 50; i++) {
    try { return await (await fetch(`http://127.0.0.1:${port}${pathname}`, { method })).json(); } catch { await sleep(200); }
  }
  throw new Error('Edge did not start');
}

async function openTab(url, name) {
  const { port } = launch();
  const t = await api(port, '/json/new?' + encodeURIComponent(url), 'PUT');
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  const pending = new Map();
  const logs = [];
  let id = 0;
  const opened = new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
    else if (d.method === 'Runtime.exceptionThrown') logs.push('EXCEPTION ' + (d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text));
    else if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') logs.push('error ' + d.params.args.map((a) => a.value ?? a.description).join(' '));
  };
  await opened;
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 960, height: 540, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setFocusEmulationEnabled', { enabled: true });
  return {
    name, logs,
    eval: async (expression) => { const r = await send('Runtime.evaluate', { expression, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description; },
    shot: async (file) => { const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 }); fs.writeFileSync(path.join(outDir, file + '.jpg'), Buffer.from(r.result.data, 'base64')); },
    front: () => send('Page.bringToFront'),
    close: () => ws.close(),
  };
}

const STATE = `(() => { const g = __gc.game, n = g.net, w = g.world; return JSON.stringify({ state: g.state, mode: g.mode, lobby: g.lobby.status, url: g.lobby.url, err: g.lobby.error,
  peer: g.lobby.peer, conn: !!(n && n.connected), fast: !!(n && n.fast), rtt: n ? Math.round(n.rtt * 1000) : null, round: g.round, score: g.score, left: Math.round(g.timeLeft),
  err: { avg: +(g.errSum / Math.max(1, g.corrections)).toFixed(3), max: +g.errMax.toFixed(2) }, tops: w ? w.tops.map((t) => [+t.x.toFixed(2), +t.z.toFixed(2), Math.round(t.spin)]) : null, corrections: g.corrections, frames: g.frames,
  stats: n ? { out: n.stats.out, in: n.stats.in, lost: n.stats.lost, bpsOut: Math.round(n.stats.rateOut), bpsIn: Math.round(n.stats.rateIn) } : null }); })()`;

// The page may still be loading: until the game is up this yields a neutral state.
const read = async (tab) => { try { return JSON.parse(await tab.eval(STATE)); } catch { return { state: 'loading', lobby: 'loading' }; } };

let fail = null;
try {
  const host = await openTab(base + '?host&auto&quick' + extra, 'host');
  let hs;
  for (let i = 0; i < 60; i++) { hs = await read(host); if (hs.url || hs.lobby === 'failed') break; await sleep(250); }
  console.log('host lobby:', hs.lobby, hs.url, hs.err || '');
  if (!hs.url) throw new Error('host never got a room: ' + hs.err);
  const code = new URL(hs.url).searchParams.get('room');
  const guest = await openTab(base + '?room=' + code + '&auto&quick' + extra, 'guest');
  let gs;
  for (let i = 0; i < 100; i++) {
    gs = await read(guest); hs = await read(host);
    if ((gs.conn && hs.conn && gs.peer && hs.peer) || gs.lobby === 'failed') break;
    await sleep(250);
  }
  console.log('connected:', hs.conn, gs.conn, 'fast channel:', hs.fast, gs.fast, 'guest lobby:', gs.lobby, gs.err || '');
  if (!gs.conn) throw new Error('guest could not connect');
  await host.shot('net-lobby-host'); await guest.front(); await guest.shot('net-lobby-guest');

  await host.eval(`document.querySelector('.lb-blade[data-id=gaia]').click(); document.getElementById('lb-ready').click()`);
  await guest.eval(`document.querySelector('.lb-blade[data-id=sol]').click(); document.getElementById('lb-ready').click()`);
  let shots = 0, maxDiff = 0, sumDiff = 0, samples = 0;
  const t0 = Date.now();
  while (Date.now() - t0 < 300000) {
    await sleep(500);
    [hs, gs] = await Promise.all([read(host), read(guest)]);
    if (hs.state === 'fight' && gs.state === 'fight' && hs.tops && gs.tops) {
      // The two tabs are sampled a few ms apart, so some difference is expected.
      for (let i = 0; i < 2; i++) { const d = Math.hypot(hs.tops[i][0] - gs.tops[i][0], hs.tops[i][1] - gs.tops[i][1]); maxDiff = Math.max(maxDiff, d); sumDiff += d; samples++; }
      if (shots < 2 && hs.left < 72 - shots * 6) { shots++; await host.front(); await host.shot('net-fight-host-' + shots); await guest.front(); await guest.shot('net-fight-guest-' + shots); }
    }
    if (hs.state === 'result' && gs.state === 'result') break;
  }
  console.log('host :', JSON.stringify(hs));
  console.log('guest:', JSON.stringify(gs));
  console.log(`position difference host vs guest: avg ${(sumDiff / Math.max(1, samples)).toFixed(2)}  max ${maxDiff.toFixed(2)}  (${samples} samples)`);
  if (hs.state !== 'result' || gs.state !== 'result') throw new Error('match did not finish on both sides');
  if (hs.score.join() !== gs.score.join()) throw new Error('scores differ');
  await host.front(); await host.shot('net-result-host'); await guest.front(); await guest.shot('net-result-guest');

  // Rematch through the lobby, then the guest leaves mid-match.
  await host.eval(`document.getElementById('btn-again').click()`);
  await guest.eval(`document.getElementById('btn-again').click()`);
  for (let i = 0; i < 40; i++) { await sleep(250); gs = await read(guest); if (gs.state === 'fight') break; }
  console.log('rematch started:', gs.state === 'fight', 'round', gs.round);
  await guest.eval(`document.getElementById('btn-quit').click()`);
  for (let i = 0; i < 40; i++) { await sleep(250); hs = await read(host); if (hs.state === 'lobby') break; }
  console.log('after guest left, host is in:', hs.state, '/', hs.lobby);
  for (const t of [host, guest]) if (t.logs.length) console.log(t.name, 'LOGS:\n' + t.logs.slice(0, 10).join('\n'));
  host.close(); guest.close();
} catch (e) {
  fail = e;
} finally {
  for (const b of browsers) b.proc.kill();
  await sleep(500);
  for (const b of browsers) { try { fs.rmSync(b.profile, { recursive: true, force: true }); } catch { /* still locked */ } }
}
if (fail) { console.error('FAILED:', fail.message); process.exit(1); }
console.log('OK');
