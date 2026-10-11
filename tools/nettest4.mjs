// End-to-end check of online play with more than two: a host, two guests and
// a CPU in one room, found through the real PeerJS broker, playing a
// bot-driven four-way match over WebRTC. One guest then leaves mid-match.
//   node tools/nettest4.mjs [outDir] [baseUrl] [extraFlags]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const outDir = process.argv[2] || 'screenshots';
const base = process.argv[3] || 'http://127.0.0.1:4181/';
// Extra URL flags for both tabs, e.g. "norender&lag=100&jitter=20&loss=5".
const extra = process.argv[4] ? '&' + process.argv[4] : '';
const [hostBlade, guestBlade] = (process.argv[5] || 'gaia,sol').split(',');
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
  peer: (() => { const p = g.lobby.slots[g.lobby.role === 'guest' ? 0 : 1]; return p && p.kind !== 'open' ? p : null; })(), conn: !!(n && n.connected), fast: !!(n && n.fast), rtt: n ? Math.round(n.rtt * 1000) : null, round: g.round, score: g.score, left: Math.round(g.timeLeft),
  err: { avg: +(g.errSum / Math.max(1, g.corrections)).toFixed(3), max: +g.errMax.toFixed(2) }, tops: w ? w.tops.map((t) => [+t.x.toFixed(2), +t.z.toFixed(2), Math.round(t.spin)]) : null, corrections: g.corrections, frames: g.frames,
  stats: n ? { out: n.stats.out, in: n.stats.in, lost: n.stats.lost, bpsOut: Math.round(n.stats.rateOut), bpsIn: Math.round(n.stats.rateIn) } : null }); })()`;

// The page may still be loading: until the game is up this yields a neutral state.
const read = async (tab) => { try { return JSON.parse(await tab.eval(STATE)); } catch { return { state: 'loading', lobby: 'loading' }; } };

const SEATS = `JSON.stringify(__gc.game.lobby.slots.map((p) => p.kind + (p.ready ? '*' : '')))`;
let fail = null;
try {
  const host = await openTab(base + '?host&auto&quick' + extra, 'host');
  let hs;
  for (let i = 0; i < 60; i++) { hs = await read(host); if (hs.url || hs.lobby === 'failed') break; await sleep(250); }
  if (!hs.url) throw new Error('host never got a room: ' + hs.err);
  const code = new URL(hs.url).searchParams.get('room');
  // Seats: host, a person, a person, a CPU.
  await host.eval(`(() => { const seat = (i) => [...document.querySelectorAll('.seat')][i]; seat(2).querySelectorAll('.lb-seg button')[0].click(); })()`);
  await host.eval(`(() => { const seat = (i) => [...document.querySelectorAll('.seat')][i]; seat(3).querySelectorAll('.lb-seg button')[1].click(); })()`);
  // With "team" as the fourth argument the match is two against two.
  const team = process.argv[5] === 'team';
  if (team) await host.eval(`[...document.querySelectorAll('#lb-mode button')][1].click()`);
  console.log('host seats:', await host.eval(SEATS));
  const g1 = await openTab(base + '?room=' + code + '&auto&quick' + extra, 'guest1');
  const g2 = await openTab(base + '?room=' + code + '&auto&quick' + extra, 'guest2');
  let a, b;
  for (let i = 0; i < 100; i++) {
    [a, b] = await Promise.all([read(g1), read(g2)]);
    if (a.conn && b.conn) break;
    await sleep(250);
  }
  if (!a.conn || !b.conn) throw new Error('a guest could not connect: ' + a.lobby + ' / ' + b.lobby);
  await sleep(1200);
  const me1 = await g1.eval(`__gc.game.lobby.me`), me2 = await g2.eval(`__gc.game.lobby.me`);
  console.log('host seats:', await host.eval(SEATS), '| guests sit at', me1, me2);
  if (new Set([me1, me2]).size !== 2 || ![1, 2].includes(me1) || ![1, 2].includes(me2)) throw new Error('the guests should have the two open seats');
  console.log('guest1 sees:', await g1.eval(SEATS));

  await host.eval(`document.getElementById('lb-ready').click(); document.getElementById('lb-start').click()`);
  await g1.eval(`document.getElementById('lb-ready').click()`);
  await sleep(600);
  if ((await read(host)).state !== 'lobby') throw new Error('must not start before everyone is ready');
  await g2.eval(`document.getElementById('lb-ready').click()`);
  await sleep(800);
  await host.eval(`document.getElementById('lb-start').click()`);
  const tabs = [host, g1, g2];
  let st, maxDiff = 0, sum = 0, n = 0, shot = false;
  const t0 = Date.now();
  while (Date.now() - t0 < 400000) {
    await sleep(500);
    st = await Promise.all(tabs.map(read));
    if (st.every((s) => s.state === 'fight' && s.tops)) {
      if (st[0].tops.length !== 4) throw new Error('four tops expected, got ' + st[0].tops.length);
      for (const g of [st[1], st[2]]) for (let i = 0; i < 4; i++) { const d = Math.hypot(st[0].tops[i][0] - g.tops[i][0], st[0].tops[i][1] - g.tops[i][1]); if (d < 30) { maxDiff = Math.max(maxDiff, d); sum += d; n++; } }
      if (!shot && st[0].left < 68) { shot = true; await host.front(); await host.shot('net4-host'); await g1.front(); await g1.shot('net4-guest1'); await g2.front(); await g2.shot('net4-guest2'); }
    }
    if (st.every((s) => s.state === 'result')) break;
  }
  console.log('sides:', await host.eval(`__gc.game.side`), await g1.eval(`__gc.game.side`), await g2.eval(`__gc.game.side`));
  const TEAMS = `JSON.stringify([__gc.game.world.tops.map((t) => t.team), __gc.game.world.ff])`;
  const tm = [await host.eval(TEAMS), await g1.eval(TEAMS), await g2.eval(TEAMS)];
  console.log('teams:', tm.join(' | '));
  if (new Set(tm).size !== 1) throw new Error('teams differ between the tabs');
  if (team && tm[0] !== '[[0,1,0,1],false]') throw new Error('expected two teams of two');
  if (team && !(st[0].score[0] === st[0].score[2] && st[0].score[1] === st[0].score[3])) throw new Error('team mates should share a score');
  for (const [i, s] of st.entries()) console.log(tabs[i].name, s.state, 'score', JSON.stringify(s.score), 'round', s.round, 'corrections', s.corrections, 'err', JSON.stringify(s.err));
  console.log(`position difference host vs guests: avg ${(sum / Math.max(1, n)).toFixed(2)}  max ${maxDiff.toFixed(2)}  (${n} samples)`);
  if (!st.every((s) => s.state === 'result')) throw new Error('the match did not finish everywhere');
  if (new Set(st.map((s) => s.score.join())).size !== 1) throw new Error('scores differ');

  // Everyone back, a rematch, and one guest walks out in the middle of it.
  await host.eval(`document.getElementById('btn-lobby').click()`);
  await g1.eval(`document.getElementById('btn-again').click()`);
  await g2.eval(`document.getElementById('btn-again').click()`);
  await sleep(2500);
  console.log('back in the room:', await host.eval(SEATS));
  await host.eval(`document.getElementById('lb-ready').click()`);
  await sleep(500);
  await host.eval(`document.getElementById('lb-start').click()`);
  for (let i = 0; i < 60; i++) { await sleep(250); st = await Promise.all(tabs.map(read)); if (st.every((s) => s.state === 'fight')) break; }
  if (!st.every((s) => s.state === 'fight')) throw new Error('rematch did not start: ' + st.map((s) => s.state));
  await sleep(1500);
  await g2.eval(`document.getElementById('btn-quit').click()`);
  await sleep(2500);
  st = await Promise.all([read(host), read(g1)]);
  const brains = await host.eval(`__gc.game.brains.length`);
  console.log('after guest2 left mid-match: host', st[0].state, '| guest1', st[1].state, '| CPUs on the host', brains, '| seats', await host.eval(SEATS));
  if (!['fight', 'countdown', 'finish'].includes(st[0].state) || !['fight', 'countdown', 'finish'].includes(st[1].state)) throw new Error('the match should go on for those who stayed');
  if (brains !== 2) throw new Error('a CPU should have taken over the top that was left');
  for (const t of tabs) if (t.logs.length) console.log(t.name, 'LOGS:\n' + t.logs.slice(0, 10).join('\n'));
  if (tabs.some((t) => t.logs.some((l) => l.startsWith('EXCEPTION')))) throw new Error('exceptions in a tab');
  for (const t of tabs) t.close();
} catch (e) {
  fail = e;
} finally {
  for (const b of browsers) b.proc.kill();
  await sleep(500);
  for (const b of browsers) { try { fs.rmSync(b.profile, { recursive: true, force: true }); } catch { /* still locked */ } }
}
if (fail) { console.error('FAILED:', fail.message); process.exit(1); }
console.log('OK');
