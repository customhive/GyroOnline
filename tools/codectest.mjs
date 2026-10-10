// Round-trips match states through the snapshot codec and checks that the
// values a skill check depends on survive exactly.
import { BLADES } from '../src/config.js';
import { World } from '../src/sim.js';
import { encodeSnapshot, applySnapshot } from '../src/netcode.js';

let bad = 0;
const check = (ok, msg) => { if (!ok) { bad++; console.log('FAIL', msg); } };
const a = new World(BLADES.azure, BLADES.sol, 1), b = new World(BLADES.azure, BLADES.sol, 1);
for (let u = 0; u <= 100; u += 0.25) {
  a.tops[0].ult = u; a.tops[1].ult = 100 - u;
  applySnapshot(b, encodeSnapshot(a, { seq: 1, ack: 0, timeLeft: 60 }));
  for (const i of [0, 1]) {
    const src = a.tops[i].ult, got = b.tops[i].ult;
    check((src >= 100) === (got >= 100), `ult ${src} arrived as ${got}: "full" must match`);
    check(Math.abs(src - got) < 0.5, `ult ${src} arrived as ${got}`);
  }
}
for (const t of a.tops) { t.ult = 100; t.cd.Q = 0; t.cd.R = 0; t.tumble = 0; t.x = 1; t.z = 2 * (t.side ? -1 : 1); }
applySnapshot(b, encodeSnapshot(a, { seq: 2, ack: 0, timeLeft: 60 }));
for (const k of ['Q', 'W', 'E', 'R']) for (const i of [0, 1]) check(a.canCast(a.tops[i], k) === b.canCast(b.tops[i], k), `canCast ${k} differs for top ${i}`);
console.log(bad ? `${bad} problem(s)` : 'codec OK');
process.exit(bad ? 1 : 0);
