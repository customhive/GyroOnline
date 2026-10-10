// Headless balance check: CPU vs CPU rounds for every blade pairing.
// node tools/simtest.mjs [rounds per pairing]
import { BLADES, DIFFICULTY, ROUND_TIME } from '../src/config.js';
import { World } from '../src/sim.js';
import { CpuBrain } from '../src/ai.js';

const N = Number(process.argv[2] || 40);
const ids = Object.keys(BLADES);
const DT = 1 / 120;

function round(a, b, seed, la, lb) {
  const w = new World(BLADES[a], BLADES[b], seed);
  const brains = [la && new CpuBrain(w, w.tops[0], la), lb && new CpuBrain(w, w.tops[1], lb)];
  for (const t of w.tops) { for (const k of 'QWER') { const S = t.blade.kit[k]; t.windup[k] = { sonic: 0.42, anchor: 0.45, blitz: 0.48, flare: 0.35, quake: 0.2 }[S] || 0; } t.ult = 0; }
  let ults = 0;
  while (!w.result && w.time < ROUND_TIME) {
    for (const br of brains) if (br) br.update(DT);
    w.step(DT);
    for (const e of w.events) if (e.type === 'leap' || e.type === 'charge' || e.type === 'tether') ults++;
    w.events.length = 0;
    for (const t of w.tops) if (!Number.isFinite(t.x + t.z + t.vx + t.vz + t.spin)) throw new Error('NaN in sim, seed ' + seed);
  }
  if (!w.result) w.timeUp();
  return { win: w.result.winner.side, kind: w.result.kind, time: w.time, ults, clashes: w.tops[0].stats.clashes };
}

function report(label, la, lb) {
  console.log('\n== ' + label);
  for (const a of ids) for (const b of ids) {
    const kinds = {}; let wins = 0, time = 0, ults = 0, clashes = 0;
    for (let i = 0; i < N; i++) {
      const r = round(a, b, 1000 + i * 7919, la, lb);
      kinds[r.kind] = (kinds[r.kind] || 0) + 1;
      wins += r.win === 0 ? 1 : 0; time += r.time; ults += r.ults; clashes += r.clashes;
    }
    console.log(`${a.padEnd(6)} vs ${b.padEnd(6)} winA ${(wins / N * 100).toFixed(0).padStart(3)}%  avg ${(time / N).toFixed(1)}s  ults ${(ults / N).toFixed(1)}  clashes ${(clashes / N).toFixed(0)}  ${JSON.stringify(kinds)}`);
  }
}

report('no input (pure physics)', null, null);
report('normal vs normal', DIFFICULTY[1], DIFFICULTY[1]);
report('hard (A) vs easy (B)', DIFFICULTY[2], DIFFICULTY[0]);
