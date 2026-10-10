// Drives the game in headless Edge over the DevTools protocol and saves screenshots.
// node tools/shot.mjs <scenario.json> <outDir>
// scenario: { url, width, height, steps: [{ js, shot }] }  (frames are stepped by hand via __gc.frame)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const [scenarioPath, outDir] = process.argv.slice(2);
const sc = JSON.parse(fs.readFileSync(scenarioPath, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });
const edge = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'gc-edge-'));
const port = 9333 + Math.floor(Math.random() * 500);
const proc = spawn(edge, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, `--window-size=${sc.width || 1920},${sc.height || 1080}`,
  '--hide-scrollbars', '--mute-audio', '--no-first-run', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function target() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error('Edge did not start');
}

try {
  const url = await target();
  const ws = new WebSocket(url);
  const pending = new Map();
  let id = 0;
  const opened = new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  const logs = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
    else if (d.method === 'Runtime.exceptionThrown') logs.push('EXCEPTION ' + (d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text));
    else if (d.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(d.params.type)) logs.push(d.params.type + ' ' + d.params.args.map((a) => a.value ?? a.description).join(' '));
  };
  await opened;
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: sc.width || 1920, height: sc.height || 1080, deviceScaleFactor: 1, mobile: false });
  // Freeze the page's own loop so only our hand-stepped frames advance the game.
  await send('Page.addScriptToEvaluateOnNewDocument', { source: 'window.requestAnimationFrame = () => 0;' });
  await send('Page.navigate', { url: sc.url });
  // Wait for the game itself, not a fixed time: a cold browser can be slow to load.
  for (let i = 0; i < 100; i++) {
    await sleep(200);
    const r = await send('Runtime.evaluate', { expression: 'typeof __gc', returnByValue: true });
    if (r.result?.result?.value === 'object') break;
  }
  const helpers = `window.seen=[];(()=>{const oh=__gc.view.handle.bind(__gc.view);__gc.view.handle=(e)=>{seen.push(e.type+(e.kind?':'+e.kind:''));oh(e)};})();
    window.run=(s)=>{const n=Math.round(s*60);for(let i=0;i<n;i++)__gc.frame(1/60);const g=__gc.game;return JSON.stringify({state:g.state,t:g.world&&+g.world.time.toFixed(2),spins:g.world&&g.world.tops.map(t=>Math.round(t.spin)),ult:g.world&&g.world.tops.map(t=>Math.round(t.ult)),score:g.score,seen:seen.splice(0).join(' ')})};
    window.until=(type,max=60,extra=4)=>{let n=0;while(n<max*60){__gc.frame(1/60);n++;if(seen.some(s=>s.startsWith(type)))break}for(let i=0;i<extra;i++)__gc.frame(1/60);return run(0)};'ok'`;
  await send('Runtime.evaluate', { expression: helpers });
  for (const st of sc.steps) {
    if (st.js) {
      const r = await send('Runtime.evaluate', { expression: st.js, returnByValue: true });
      console.log('>', st.js.slice(0, 70), '=>', r.result?.result?.value ?? JSON.stringify(r.result?.exceptionDetails?.exception?.description || r.result));
    }
    if (st.shot) {
      await sleep(120);
      const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 88 });
      fs.writeFileSync(path.join(outDir, st.shot + '.jpg'), Buffer.from(r.result.data, 'base64'));
      console.log('  shot', st.shot);
    }
  }
  if (logs.length) console.log('PAGE LOGS:\n' + logs.slice(0, 20).join('\n'));
  ws.close();
} finally {
  proc.kill();
  await sleep(300);
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
}
