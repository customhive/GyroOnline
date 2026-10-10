import { BLADES, DIFFICULTY } from '../src/config.js';
import { World } from '../src/sim.js';
import { CpuBrain } from '../src/ai.js';
const ai = process.argv[2] === 'ai';
const w = new World(BLADES.azure, BLADES.gaia, 5);
const br = ai ? w.tops.map(t => new CpuBrain(w, t, DIFFICULTY[1])) : [];
for (const t of w.tops) { t.windup.Q = 0.4; t.windup.E = 0.45; }
const T = Number(process.argv[3] || 12);
let n = 0;
while (w.time < T && !w.result) {
  for (const b of br) b.update(1/120);
  w.step(1/120);
  for (const e of w.events) {
    const f = v => typeof v === 'number' ? v.toFixed(1) : (v && v.side !== undefined ? 'top' + v.side : undefined);
    console.log(w.time.toFixed(2), e.type, Object.entries(e).filter(([k]) => k !== 'type' && k !== 'proj').map(([k, v]) => k + '=' + (f(v) ?? v)).join(' '));
  }
  w.events.length = 0;
  if (!ai && n++ % 30 === 0) { const [a, b] = w.tops; console.log(w.time.toFixed(2), 'A', a.x.toFixed(1), a.z.toFixed(1), 'v', Math.hypot(a.vx, a.vz).toFixed(1), 'B', b.x.toFixed(1), b.z.toFixed(1), 'v', Math.hypot(b.vx, b.vz).toFixed(1), 'd', Math.hypot(a.x - b.x, a.z - b.z).toFixed(1)); }
}
console.log(w.result && w.result.kind, w.tops.map(t => t.spin.toFixed(0)));
