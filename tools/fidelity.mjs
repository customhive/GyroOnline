// Checks blades against the behaviour agreed for them, one line of the
// agreed table per check. Add a section here whenever a blade is reworked.
//   node tools/fidelity.mjs
import { BLADES, SKILLS } from '../src/config.js';
import { World, spinRatio } from '../src/sim.js';

const DT = 1 / 120;
let bad = 0, n = 0;
const check = (ok, what) => { n++; if (!ok) bad++; console.log((ok ? '  ok   ' : '  FAIL ') + what); };

// A fresh fight with both tops parked: `me` at the origin side, `foe` d away.
function setup(blade, d = 6, foeBlade = 'gaia') {
  const w = new World(BLADES[blade], BLADES[foeBlade], 7);
  const [me, foe] = w.tops;
  for (const k of 'QWER') { me.cd[k] = 0; foe.cd[k] = 99; }
  me.ult = 100;
  const park = (dd = d) => { me.x = 0; me.z = dd / 2; foe.x = 0; foe.z = -dd / 2; me.vx = me.vz = foe.vx = foe.vz = 0; me.cmd = foe.cmd = null; me.tumble = foe.tumble = 0; };
  park();
  const seen = [];
  // Steps the fight. With `hold`, the tops are pinned in place so only the skill moves things.
  const run = (sec, hold = true) => {
    for (let i = 0; i < Math.round(sec / DT); i++) {
      const p = hold ? [me.x, me.z, foe.x, foe.z] : null;
      w.step(DT);
      seen.push(...w.events.splice(0));
      if (hold && !me.dash && !me.air && !me.blink && !foe.air) { if (foe.tumble <= 0 && foe.up <= 0) { foe.x = p[2]; foe.z = p[3]; foe.vx = foe.vz = 0; } me.x = p[0]; me.z = p[1]; me.vx = me.vz = 0; }
    }
  };
  const out = {};
  setup.last = out;
  const saw = (type, f = () => true) => seen.some((e) => e.type === type && f(e));
  // Steps with only the other top pinned, so this one's own movement shows.
  const drift = (sec, x = foe.x, z = foe.z) => { for (let i = 0; i < Math.round(sec / DT); i++) { w.step(DT); seen.push(...w.events.splice(0)); if (foe.tumble <= 0) { foe.x = x; foe.z = z; foe.vx = foe.vz = 0; } } };
  // True if nothing has struck the other top so far.
  const untouched = () => !seen.some((e) => ['projHit', 'strike', 'clash'].includes(e.type) || (e.type === 'blast' && e.hit));
  return Object.assign(out, { w, me, foe, park, run, drift, untouched, seen, saw });
}

console.log('CHRONO REWIND (Ekko)');
{
  let { w, me, foe, run, saw } = setup('chrono', 3);
  ({ w, me, foe, run, saw } = setup('chrono', 6));
  w.cast(me, 'Q', foe.x, foe.z);
  run(0.3);
  const p = w.projectiles[0];
  check(p && p.crawl && p.speed === SKILLS.timewinder.crawl, 'Q: turns into a slow-moving field on hitting the target');
  check(foe.slow > 0 && foe.slowK === 0.6, 'Q: the field slows by 60%');
  const s1 = foe.spin;
  run(2.2);
  check(w.projectiles.length === 0 && s1 - foe.spin > 20, 'Q: returns to Ekko and hits again on the way back');

  ({ w, me, foe, run, saw } = setup('chrono', 12));
  const far = SKILLS.timewinder.range;
  w.cast(me, 'Q', foe.x, foe.z);
  run(far / SKILLS.timewinder.speed + 0.1);
  check(w.projectiles[0] && w.projectiles[0].crawl, 'Q: also turns into the field at the end of its range');

  ({ w, me, foe, run, saw } = setup('chrono', 8));
  w.cast(me, 'W', foe.x, foe.z);
  run(2.9);
  check(w.zones.length === 1 && foe.slow === 0, 'W: nothing happens for the first 3 seconds');
  run(0.3);
  check(foe.slow > 0, 'W: once formed, the field slows the target inside');
  check(saw('formed'), 'W: forming is announced');
  run(1.0);
  check(w.zones.length === 1, 'W: the field is still there 1.3 seconds after forming');
  me.x = foe.x; me.z = foe.z + 2.6; run(0.05);
  check(w.zones.length === 0 && foe.stun > 1.2 && me.shield > 0, 'W: stepping in detonates it: stun and a shield');
  ({ w, me, foe, run, saw } = setup('chrono', 8));
  w.cast(me, 'W', foe.x, foe.z); run(4.6);
  check(w.zones.length === 0 && foe.stun === 0, 'W: gone 1.5 seconds after forming if nobody steps in');

  ({ w, me, foe, run, saw } = setup('chrono', 8));
  w.cast(me, 'E', foe.x, foe.z);
  setup.last.drift(0.15);
  check(Math.abs(me.z - (4 - SKILLS.phasedive.dist)) < 0.8 && me.re.E > 0, 'E: a short leap, and the key stays live for 3 seconds');
  const s2 = foe.spin;
  check(w.cast(me, 'E', me.x, me.z) && Math.hypot(me.x - foe.x, me.z - foe.z) < 3 && s2 - foe.spin > 25, 'E again: warps to the target and strikes');
  ({ w, me, foe, run, saw } = setup('chrono', 16));
  w.cast(me, 'E', foe.x, foe.z); setup.last.drift(0.15);
  check(!w.cast(me, 'E', me.x, me.z) && w.blocked(me, 'E') === '射程外', 'E again: refused when the target is out of reach');

  ({ w, me, foe, run, saw } = setup('chrono', 20));
  run(1); const home = { x: me.x, z: me.z };
  check(me.hist.length > 0, 'R passive: a hologram trails 4 seconds behind');
  me.x = 3; me.z = -6; foe.x = home.x + 3; foe.z = home.z; foe.vx = foe.vz = 0; me.spin -= 300; const s3 = me.spin, f3 = foe.spin;
  w.cast(me, 'R', me.x, me.z);
  check(!!me.air, 'R: untouchable while it travels back');
  let landed = null;
  for (let i = 0; i < 60; i++) { w.step(DT); foe.x = home.x + 3; foe.z = home.z; if (!me.air && !landed) landed = { x: me.x, z: me.z }; }
  check(landed && Math.hypot(landed.x - home.x, landed.z - home.z) < 0.2, 'R: returns to where the hologram stood');
  check(f3 - foe.spin > 100, 'R: damages what stands at the arrival point');
  check(me.spin - s3 > 100, 'R: heals more for the spin lost in those 4 seconds');
}

console.log('HARBOR REAPER (Pyke)');
{
  let { w, me, foe, run, saw } = setup('reaper', 3);
  w.hurt(me, 100, foe, 'clash');
  check(Math.abs(me.store - 25) < 1, 'P: a quarter of the damage taken is kept as grey spin');
  const s0 = me.spin; run(1);
  check(me.spin < s0 && me.store > 24, 'P: no recovery while close and not hasted');
  w.cast(me, 'W', me.x, me.z);
  check(me.haste > 4.9, 'W: 5 seconds of haste (no camouflage, by agreement)');
  const s1 = me.spin; run(1);
  check(me.store < 1 && me.spin > s1 + 10, 'P: grey spin returns while hasted');
  ({ w, me, foe, run, saw } = setup('reaper', 20));
  w.hurt(me, 100, foe, 'clash'); const s2 = me.spin; run(1);
  check(me.spin > s2 + 10, 'P: grey spin also returns at distance 10 or more');

  ({ w, me, foe, run, saw } = setup('reaper', 7));
  w.hold(me, 'Q'); w.cast(me, 'Q', foe.x, foe.z);
  check(w.projectiles[0].skill.id === 'bonestab' && w.projectiles[0].left <= 2, 'Q tapped: a short-range stab');
  run(0.3);
  check(setup.last.untouched(), 'Q tapped: does not reach a target 7 away');
  ({ w, me, foe, run, saw } = setup('reaper', 3.2));
  w.hold(me, 'Q'); w.cast(me, 'Q', foe.x, foe.z); run(0.2);
  check(foe.spin < foe.spinMax && foe.slow > 0 && foe.slowK === 0.9, 'Q tapped: hits and slows by 90% up close');

  ({ w, me, foe, run, saw } = setup('reaper', 10));
  w.hold(me, 'Q');
  check(!!me.hold, 'Q held: winding up');
  const r0 = w.holdRange(me, 'Q'); run(0.6); const r1 = w.holdRange(me, 'Q'); run(0.6); const r2 = w.holdRange(me, 'Q');
  check(r0 === 2 && r1 > 3.7 && r1 < 9.3 && r2 === 9.3, `Q held: reach grows with the hold (${r0} -> ${r1.toFixed(1)} -> ${r2})`);
  check(!w.cast(me, 'W', me.x, me.z), 'Q held: no other skill while winding up');
  w.cast(me, 'Q', foe.x, foe.z);
  check(w.projectiles[0].skill.id === 'bonehook' && Math.abs(w.projectiles[0].left - 9.3) < 0.01 && me.cd.Q > 7, 'Q released: a harpoon with the reach wound up');
  // From where it was struck to where the stagger lets go of it.
  let from = null, to = null;
  for (let i = 0; i < 110; i++) {
    w.step(DT); setup.last.seen.push(...w.events.splice(0)); me.x = 0; me.z = 5; me.vx = me.vz = 0;
    if (foe.tumble > 0 && from === null) from = foe.z;
    if (from !== null && to === null && foe.tumble <= 0) to = foe.z;
  }
  const moved = from - to;
  check(setup.last.saw('projHit'), 'Q released: hits at range 10');
  check(moved < -4.5 && moved > -6.5, `Q released: drags the target a set distance toward Pyke (${(-moved).toFixed(1)})`);

  ({ w, me, foe, run, saw } = setup('reaper', 20));
  w.hold(me, 'Q'); run(4.1);
  check(!me.hold && me.cd.Q > 3 && saw('say', (e) => e.text === 'CANCEL'), 'Q held 4 seconds: cancelled, and on cooldown');
  ({ w, me, foe, run, saw } = setup('reaper', 20));
  const free = setup('reaper', 20);
  free.w.issueMove(free.me, 9, 0); for (let i = 0; i < 120; i++) free.w.step(DT);
  w.hold(me, 'Q'); w.issueMove(me, 9, 0); for (let i = 0; i < 120; i++) { w.step(DT); w.issueMove(me, 9, 0); }
  check(me.hold && Math.abs(me.x) < Math.abs(free.me.x) - 0.5, 'Q held: Pyke moves slower while winding up');

  ({ w, me, foe, run, saw } = setup('reaper', 4));
  const start = { x: me.x, z: me.z };
  w.cast(me, 'E', foe.x, foe.z);
  setup.last.drift(0.4);
  check(me.z < foe.z && setup.last.untouched(), 'E: leaps through the target without hitting it');
  check(w.zones.some((z) => z.kind === 'undertowz' && Math.abs(z.z - start.z) < 0.01) && w.projectiles.length === 0, 'E: the phantom waits at the starting point');
  foe.x = 0; foe.z = (start.z + me.z) / 2; foe.vx = foe.vz = 0;
  for (let i = 0; i < 110; i++) { w.step(DT); if (foe.tumble <= 0) { foe.x = 0; foe.z = (start.z + me.z) / 2; foe.vx = foe.vz = 0; } }
  check(foe.spin < foe.spinMax && foe.stun > 0, 'E: after 1 second it flies to Pyke, stunning what is in between');

  ({ w, me, foe, run, saw } = setup('reaper', 6));
  w.cast(me, 'R', foe.x, foe.z); setup.last.drift(0.6);
  check(foe.spin < foe.spinMax - 80 && Math.hypot(me.x - 0, me.z + 3) < 3 && setup.last.saw('warp'), 'R: target in the X takes damage and Pyke arrives there');
  ({ w, me, foe, run, saw } = setup('reaper', 6));
  // Straight along the aim from the centre lies between the arms of the X.
  w.cast(me, 'R', foe.x, foe.z + 2.6); run(0.6);
  check(setup.last.untouched() && !setup.last.saw('warp'), 'R: a target between the arms of the X is missed, and Pyke stays put');
  ({ w, me, foe, run, saw } = setup('reaper', 6));
  foe.spin = foe.spinMax * 0.19;
  w.cast(me, 'R', foe.x, foe.z); run(0.6);
  check(w.result && w.result.winner === me, 'R: a marked target (under 20% spin) is executed outright');
  ({ w, me, foe, run, saw } = setup('reaper', 6));
  foe.spin = foe.spinMax * 0.5;
  w.cast(me, 'R', foe.x, foe.z); run(0.6);
  check(!w.result && spinRatio(foe) < 0.45, 'R: above the line it is ordinary damage');
}

console.log('STUN AND SLOW (all blades)');
{
  const { w, me, foe, run } = setup('azure', 8);
  foe.vx = 9; foe.vz = 0;
  w.stun(foe, 1);
  const at = { x: foe.x, z: foe.z };
  for (let i = 0; i < 60; i++) w.step(DT);
  check(Math.hypot(foe.x - at.x, foe.z - at.z) < 0.3, 'stun: the top stops where it stands');
  check(!w.issueMove(foe, 5, 5) && !w.canCast(foe, 'Q'), 'stun: no moving, no skills');
  w.knock(foe, 1, 0, 10, 0.3, 0);
  for (let i = 0; i < 40; i++) w.step(DT);
  check(foe.x - at.x > 1.5, 'stun: a hit still knocks it away');
  const a = setup('azure', 20), b = setup('azure', 20), c = setup('azure', 20);
  b.w.slowBy(b.me, 3); c.w.slowBy(c.me, 3, 0.9);
  for (const s of [a, b, c]) for (let i = 0; i < 50; i++) { s.w.issueMove(s.me, 9, 10); s.w.step(DT); }
  check(a.me.x > b.me.x + 0.5 && b.me.x > c.me.x + 1, `slow: a 90% slow holds a top back more than the usual 40% (${a.me.x.toFixed(1)} / ${b.me.x.toFixed(1)} / ${c.me.x.toFixed(1)})`);
}

console.log(bad ? `\n${bad} of ${n} checks failed` : `\nall ${n} checks passed`);
process.exit(bad ? 1 : 0);
