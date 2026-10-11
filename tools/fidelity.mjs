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
  check(Math.abs(me.store - 25) < 1, 'W: a quarter of the damage taken is kept as grey spin');
  const s0 = me.spin; run(1);
  check(me.spin < s0 && me.store > 24, 'W: no recovery while not hasted');
  w.cast(me, 'W', me.x, me.z);
  check(me.haste > 4.9, 'W: 5 seconds of haste (no camouflage, by agreement)');
  const s1 = me.spin; run(1);
  check(me.store < 1 && me.spin > s1 + 10, 'W: grey spin returns while hasted');
  ({ w, me, foe, run, saw } = setup('reaper', 20));
  w.hurt(me, 100, foe, 'clash'); run(1);
  check(me.store > 24, 'W: grey spin does not return just for being far away');

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

console.log('SNARE (all blades)');
{
  const { w, me } = setup('azure', 8);
  w.snare(me, 1);
  check(!w.issueMove(me, 5, 5) && me.snare > 0, 'snare: no moving');
  check(w.blocked(me, 'E') === '束縛中', 'snare: no dashing');
  check(w.canCast(me, 'Q'), 'snare: skills that do not move the top still work');
}

console.log('BROKEN EDGE (Riven)');
{
  let { w, me, foe, run, saw } = setup('edge', 12);
  const z0 = me.z;
  w.cast(me, 'Q', foe.x, foe.z); setup.last.drift(0.1);
  check(Math.abs(z0 - me.z - 2.75) < 0.6 && me.re.Q > 3.5 && me.cd.Q > 12, 'Q: a 2.75 step, live again for 4 seconds, cooldown already running');
  w.cast(me, 'Q', foe.x, foe.z); setup.last.drift(0.2);
  foe.x = me.x; foe.z = me.z - 5.2;
  w.cast(me, 'Q', foe.x, foe.z); setup.last.drift(0.25, foe.x, foe.z);
  check(saw('blast') && me.re.Q === 0, 'Q: the third use ends in a slam and closes the window');
  ({ w, me, foe, run, saw } = setup('edge', 3));
  w.cast(me, 'W', me.x, me.z);
  check(Math.abs(foe.stun - 0.45) < 0.01, 'W: stuns for 0.45 seconds');
  ({ w, me, foe, run, saw } = setup('edge', 22));
  w.cast(me, 'E', foe.x, foe.z);
  check(me.shield === 80 && Math.abs(me.shieldT - 1.5) < 0.01, 'E: a shield for 1.5 seconds');
  setup.last.drift(0.3);
  w.cast(me, 'R', me.x, me.z);
  check(me.buff > 9.9 && me.re.R > 9.9, 'R: 10 seconds of power, and the key stays live');
  setup.last.drift(0.3);
  w.cast(me, 'R', foe.x, foe.z);
  check(w.projectiles.length === 3 && me.re.R === 0, 'R again: a fan of three, once');
}

console.log('GUILLOTINE LORD (Darius)');
{
  let { w, me, foe, run, saw } = setup('guillo', 4.2);
  me.spin = 600; w.cast(me, 'Q', me.x, me.z); run(0.7);
  check(!!me.charge, 'Q: winds up for 0.75 seconds');
  const s0 = me.spin, f0 = foe.spin; run(0.1);
  const outer = f0 - foe.spin;
  check(outer > 30 && me.spin > s0 + 40 && foe.bleed === 1, 'Q: the blade (outer ring) hits hard, heals 17% of missing spin, and bleeds');
  ({ w, me, foe, run, saw } = setup('guillo', 2.8));
  w.cast(me, 'Q', me.x, me.z); const f1 = foe.spin; run(0.8);
  check((f1 - foe.spin) < outer * 0.5, 'Q: the handle (inside) does 65% less');
  ({ w, me, foe, run, saw } = setup('guillo', 2.6));
  w.cast(me, 'W', me.x, me.z); me.vz = -8; for (let i = 0; i < 30; i++) w.step(DT);
  check(foe.slowK === 0.9 && foe.bleed === 1, 'W: the next body hit slows by 90% and bleeds');
  const hit = (bleed) => { const s = setup('guillo', 6); s.foe.bleed = bleed; s.foe.bleedT = 5; s.w.cast(s.me, 'R', s.foe.x, s.foe.z); const f = s.foe.spin; for (let i = 0; i < 40; i++) s.w.step(DT); return f - s.foe.spin; };
  const r0 = hit(0), r5 = hit(5);
  check(r5 > r0 * 1.5, `R: each bleed stack adds 20% (${r0.toFixed(0)} -> ${r5.toFixed(0)} at 5)`);
}

console.log('VENOM TRAIL (Singed)');
{
  let { w, me, foe, run, saw } = setup('venom', 8);
  const free = setup('venom', 8); free.run(1);
  w.cast(me, 'Q', me.x, me.z); run(1);
  check(me.toggle && Math.abs(me.spin - free.me.spin) < 0.5, 'Q: the trail costs no spin');
  w.cast(me, 'W', foe.x, foe.z); run(0.1);
  check(foe.slowK === 0.7 && foe.ground > 0, 'W: 70% slow and no dashing on the adhesive');
  run(3);
  check(!w.zones.some((z) => z.kind === 'glue'), 'W: lasts 3 seconds');
  ({ w, me, foe, run, saw } = setup('venom', 3));
  w.cast(me, 'W', me.x, me.z + 5.5); w.cast(me, 'E', me.x, me.z);
  for (let i = 0; i < 80; i++) w.step(DT);
  check(foe.snare > 0 && foe.z > me.z, 'E: thrown over the shoulder into the adhesive, the target is rooted');
}

console.log('ARCANE SHOOTER (Ezreal)');
{
  let { w, me, foe, run, saw } = setup('arcane', 6);
  me.cd.W = 8; me.cd.E = 14;
  w.cast(me, 'Q', foe.x, foe.z); run(0.2);
  check(Math.abs(me.cd.W - 6.3) < 0.1 && Math.abs(me.cd.E - 12.3) < 0.1, 'Q: landing it takes 1.5 seconds off every cooldown');
  ({ w, me, foe, run, saw } = setup('arcane', 6));
  w.cast(me, 'W', foe.x, foe.z); run(0.3);
  check(foe.mark > 3, 'W: marks the target for 4 seconds');
  me.x = foe.x; me.z = foe.z + 2.4; me.vz = -6; for (let i = 0; i < 20; i++) w.step(DT);
  check(foe.mark > 0, 'W: a body hit does not set the mark off');
  me.x = 0; me.z = 3; foe.x = 0; foe.z = -3; foe.vx = foe.vz = me.vx = me.vz = 0; me.tumble = 0; me.cd.Q = 0;
  const f0 = foe.spin; w.cast(me, 'Q', foe.x, foe.z); for (let i = 0; i < 30; i++) w.step(DT);
  check(foe.mark === 0 && f0 - foe.spin > 70, 'W: a skill does');
  ({ w, me, foe, run, saw } = setup('arcane', 3));
  w.cast(me, 'E', foe.x, foe.z - 3); for (let i = 0; i < 60 && (me.blink || i < 2); i++) w.step(DT);
  check(me.z < foe.z && Math.hypot(me.vx, me.vz) < 2, 'E: passes through the target and arrives standing still');
  ({ w, me, foe, run, saw } = setup('arcane', 10));
  w.cast(me, 'R', foe.x, foe.z); run(0.9);
  check(!!me.charge && w.projectiles.length === 0, 'R: a full second of lining up first');
  run(0.2);
  check(w.projectiles.length === 1, 'R: then the shot goes');
}

console.log('DARK SORCERER (Veigar)');
{
  let { w, me, foe, run, saw } = setup('hex', 6);
  w.cast(me, 'Q', foe.x, foe.z); run(0.3);
  check(me.perm === 1, 'Q: landing it adds one stack');
  w.resetRound();
  check(me.perm === 1, 'Q: stacks carry over to the next round');
  ({ w, me, foe, run, saw } = setup('hex', 4));
  w.cast(me, 'E', foe.x + 4.25, foe.z); run(0.4);
  check(foe.stun === 0, 'E: nothing for the first half second');
  run(0.15);
  check(foe.stun > 1.3 && foe.stun <= 1.5, 'E: touching the rim stuns for 1.5 seconds');
  const at = (ratio) => { const s = setup('hex', 6); s.foe.spin = s.foe.spinMax * ratio; s.w.cast(s.me, 'R', s.me.x, s.me.z); return s.foe.spinMax * ratio - s.foe.spin; };
  const full = at(1), third = at(0.333), tenth = at(0.1);
  check(third > full * 1.9 && Math.abs(tenth - third) < 1, `R: up to double against a weakened target, capped at two thirds missing (${full.toFixed(0)} / ${third.toFixed(0)} / ${tenth.toFixed(0)})`);
}

console.log('BARREL BRUISER (Gragas)');
{
  const pop = (wait) => { const s = setup('barrel', 6); s.w.cast(s.me, 'Q', s.foe.x, s.foe.z); s.run(wait); const f = s.foe.spin; s.w.cast(s.me, 'Q', s.me.x, s.me.z); s.run(0.05); return { dmg: f - s.foe.spin, slow: s.foe.slowK }; };
  const early = pop(0.1), ripe = pop(2.2);
  check(ripe.dmg > early.dmg * 1.35 && early.slow < 0.65 && ripe.slow === 0.9, `Q: left to ripen for 2 seconds it hits half as hard again and slows 90% (${early.dmg.toFixed(0)} -> ${ripe.dmg.toFixed(0)})`);
  let { w, me, foe, run, saw } = setup('barrel', 6);
  w.cast(me, 'Q', foe.x, foe.z); const f0 = foe.spin; run(4.1);
  check(f0 - foe.spin > 40 && !w.zones.length, 'Q: goes off by itself after 4 seconds');
  ({ w, me, foe, run, saw } = setup('barrel', 5));
  w.cast(me, 'W', me.x, me.z);
  const a = w.hurt(me, 100, foe, 'x'); me.buff = 0; const b = w.hurt(me, 100, foe, 'x');
  check(a < b * 0.85 && me.empower > 4, 'W: takes less damage for a while, and the next body hit is empowered');
  ({ w, me, foe, run, saw } = setup('barrel', 5));
  w.cast(me, 'E', foe.x, foe.z); for (let i = 0; i < 30; i++) w.step(DT);
  check(foe.stun > 0 && me.cd.E < 12 * 0.62, 'E: stuns, and hands back 40% of its cooldown on a hit');
}

console.log('NINE TAIL CHARM (Ahri)');
{
  let { w, me, foe, run, saw } = setup('fox', 5);
  w.cast(me, 'Q', foe.x, foe.z);
  let out = 0, back = 0; const f0 = foe.spin;
  for (let i = 0; i < 200 && w.projectiles.length; i++) { const f = foe.spin; w.step(DT); const d = f - foe.spin; if (d > 5) { if (w.projectiles[0] && w.projectiles[0].back) back = d; else if (!out) out = d; } foe.x = 0; foe.z = -2.5; foe.vx = foe.vz = 0; me.x = 0; me.z = 2.5; me.vx = me.vz = 0; }
  check(out > 0 && back > out * 1.15, `Q: hits on the way out and, ignoring defence, on the way back (${out.toFixed(0)} / ${back.toFixed(0)})`);
  ({ w, me, foe, run, saw } = setup('fox', 20));
  w.cast(me, 'W', me.x, me.z); run(0.5);
  check(me.orbs && me.orbs.n === 3 && me.haste > 0 && !w.projectiles.length, 'W: three flames circle, with haste, while nothing is near');
  foe.x = me.x; foe.z = me.z - 6; run(0.1);
  check(!me.orbs && w.projectiles.length === 3, 'W: they fly at a target that comes near');
  ({ w, me, foe, run, saw } = setup('fox', 6));
  foe.dash = { dx: 1, dz: 0, speed: 30, t: 0.5, skill: SKILLS.blitz, hit: false };
  w.cast(me, 'E', foe.x, foe.z); run(0.3);
  check(foe.charm > 0.8 && foe.slowK === 0.65 && !foe.dash, 'E: charms for 1.1 seconds, slows 65%, and stops a dash');
  ({ w, me, foe, run, saw } = setup('fox', 20));
  let uses = 0; for (let i = 0; i < 4; i++) { if (w.cast(me, 'R', 0, 0)) uses++; for (let k = 0; k < 40; k++) w.step(DT); }
  check(uses === 3, 'R: three leaps on one charge');
}

console.log('FROST PHOENIX (Anivia)');
{
  let { w, me, foe, run, saw } = setup('frost', 5);
  const cold = (() => { const s = setup('frost', 5); s.w.cast(s.me, 'E', s.foe.x, s.foe.z); const f = s.foe.spin; s.run(0.3); return f - s.foe.spin; })();
  w.cast(me, 'Q', foe.x, foe.z); run(0.45);
  check(foe.frost > 2 && foe.slowK === 0.3, 'Q: touching the ice slows and ices the target over');
  w.cast(me, 'Q', me.x, me.z); run(0.05);
  check(foe.stun > 0.8 && !w.projectiles.length, 'Q again: it shatters on the spot and stuns for 0.9 seconds');
  me.cd.E = 0; w.cast(me, 'E', foe.x, foe.z); const f1 = foe.spin; run(0.3);
  check(f1 - foe.spin > cold * 1.8, `E: twice the damage on an iced target (${cold.toFixed(0)} -> ${(f1 - foe.spin).toFixed(0)})`);
  ({ w, me, foe, run, saw } = setup('frost', 5));
  foe.slow = 2; w.cast(me, 'E', foe.x, foe.z); const f2 = foe.spin; run(0.3);
  check(f2 - foe.spin < cold * 1.2, 'E: a plain slow is not enough to double it');
  ({ w, me, foe, run, saw } = setup('frost', 6));
  w.cast(me, 'R', foe.x, foe.z); run(1.0);
  check(foe.frost === 0 && foe.slowK === 0.4, 'R: while it grows, a 40% slow and no ice');
  const fa = foe.spin; run(0.4); const early = fa - foe.spin; run(0.5); const fb = foe.spin; run(0.4);
  check(foe.frost > 0 && foe.slowK === 0.6 && fb - foe.spin > early * 2, 'R: fully grown it ices, slows 60% and cuts three times as deep');
}

console.log('MIRAGE TRICK (LeBlanc)');
{
  let { w, me, foe, run, saw } = setup('mirage', 12);
  const home = { x: me.x, z: me.z };
  w.cast(me, 'W', foe.x, foe.z); setup.last.drift(0.25);
  check(Math.abs(home.z - me.z - 6) < 1.5 && me.ret && me.re.W > 3.5, 'W: a 6 leap, leaving a way back for 4 seconds');
  w.cast(me, 'W', me.x, me.z);
  check(Math.hypot(me.x - home.x, me.z - home.z) < 0.01 && !me.ret, 'W again: back to where the image was left');
  ({ w, me, foe, run, saw } = setup('mirage', 22));
  w.cast(me, 'W', foe.x, foe.z); setup.last.drift(0.25);
  const mid = { x: me.x, z: me.z };
  w.cast(me, 'R', foe.x, foe.z); setup.last.drift(0.25);
  check(me.ret && me.ret2 && me.re.R > 3.5, 'R after W: a second jump with its own way back');
  w.cast(me, 'R', me.x, me.z);
  check(Math.hypot(me.x - mid.x, me.z - mid.z) < 0.01 && me.ret, 'R again: back to the second image, the first still standing');
  ({ w, me, foe, run, saw } = setup('mirage', 7));
  w.cast(me, 'E', foe.x, foe.z); run(0.3);
  check(!!me.tether, 'E: the chain connects');
  run(1.5);
  check(foe.snare > 0.5 && foe.stun === 0, 'E: held for 1.5 seconds, it roots the target (a snare, not a stun)');
}

console.log('PRISM RADIANCE (Lux)');
{
  let { w, me, foe, run, saw } = setup('prism', 7);
  w.cast(me, 'Q', foe.x, foe.z); run(0.3);
  check(foe.snare > 0.9 && foe.snare <= 1.2 && foe.stun === 0, 'Q: roots for 1.2 seconds');
  ({ w, me, foe, run, saw } = setup('prism', 20));
  w.cast(me, 'W', foe.x, foe.z);
  check(me.shield === 50, 'W: a shield as the wand leaves');
  run(1.6);
  check(me.shield === 100 && !w.projectiles.length && setup.last.untouched(), 'W: a second layer when the wand comes back; it harms nobody');
  ({ w, me, foe, run, saw } = setup('prism', 7));
  w.cast(me, 'E', foe.x, foe.z); run(0.3);
  check(foe.slowK === 0.45 && me.re.E > 4, 'E: a 45% slow inside, and it waits');
  const f0 = foe.spin; w.cast(me, 'E', me.x, me.z); run(0.05);
  check(f0 - foe.spin > 40 && !w.zones.length, 'E again: it goes off at once');
  const beam = (lit) => { const s = setup('prism', 9); if (lit) s.w.hurt(s.foe, 1, s.me, 'x'); const f = s.foe.spin; s.w.cast(s.me, 'R', s.foe.x, s.foe.z); s.run(1.05); return f - s.foe.spin; };
  const plain = beam(false), lit = beam(true);
  check(lit > plain * 1.2, `R: a second of lining up, then harder on a target just hit by a skill (${plain.toFixed(0)} -> ${lit.toFixed(0)})`);
}

console.log('DRAGON STRIKER (Lee Sin)');
{
  let { w, me, foe, run, saw } = setup('dragon', 8);
  w.cast(me, 'Q', foe.x, foe.z); run(0.3);
  check(me.re.Q > 2.5, 'Q: a hit opens the second strike for 3 seconds');
  w.cast(me, 'Q', me.x, me.z);
  check(Math.hypot(me.x - foe.x, me.z - foe.z) < 3, 'Q again: Lee arrives beside the target');
  ({ w, me, foe, run, saw } = setup('dragon', 8));
  w.cast(me, 'W', me.x, me.z);
  check(me.shield === 70 && me.re.W > 2.9, 'W: a 2-second shield, and a follow-up for 3 seconds');
  w.cast(me, 'W', me.x, me.z); me.spin = 500; w.hurt(foe, 100, me, 'x');
  check(me.buff > 3.9 && me.spin > 520, 'W again: 26% of damage dealt comes back for 4 seconds');
  ({ w, me, foe, run, saw } = setup('dragon', 4));
  w.cast(me, 'E', me.x, me.z);
  check(me.re.E > 2.9 && foe.slow === 0, 'E: the blast opens the cripple, and does not slow by itself');
  w.cast(me, 'E', me.x, me.z);
  check(foe.slowK === 0.75 && foe.slow > 3.9, 'E again: a 75% slow for 4 seconds');
  ({ w, me, foe, run, saw } = setup('dragon', 3));
  me.x = 2.6; me.z = foe.z; foe.x = 0;
  w.cast(me, 'R', 99, 99);
  check(foe.vx < -8 && Math.abs(foe.vz) < 1, 'R: kicks straight away from Lee, whatever the cursor says');
}

console.log('MIRAGE TRICK: mimicked sigil');
{
  const pop = (viaR) => { const s = setup('mirage', 5); if (viaR) { s.me.last = 0; s.w.cast(s.me, 'R', s.foe.x, s.foe.z); s.me.buff = 0; } else s.w.cast(s.me, 'Q', s.foe.x, s.foe.z); s.run(0.3); const f = s.foe.spin; s.w.affect(s.me, s.foe, {}, 0, 0); return f - s.foe.spin; };
  const one = pop(false), two = pop(true);
  check(Math.abs(two - one * 2) < 2, `R on Q: the mark goes off twice as hard (${one.toFixed(0)} -> ${two.toFixed(0)})`);
}

console.log('IRON HAMMER (Poppy)');
{
  let { w, me, foe, run, saw } = setup('hammer', 5);
  w.cast(me, 'Q', foe.x, foe.z);
  const f0 = foe.spin; run(0.05);
  check(foe.slowK === 0.32, 'Q: the first blow lands at once and slows 32%');
  const f1 = foe.spin; run(0.9); const quiet = f1 - foe.spin; run(0.15);
  check(quiet < 12 && f1 - foe.spin > 30, 'Q: the same ground bursts again a second later');
  ({ w, me, foe, run, saw } = setup('hammer', 6));
  w.cast(me, 'W', me.x, me.z);
  foe.dash = { dx: 0, dz: 1, speed: 30, t: 0.5, skill: SKILLS.blitz, hit: false, len: 9 };
  for (let i = 0; i < 20; i++) w.step(DT);
  check(!foe.dash && foe.ground > 1.5 && foe.slowK === 0.25, 'W: a dash into the ward is stopped, grounded for 2 seconds and slowed 25%');
  ({ w, me, foe, run, saw } = setup('hammer', 4));
  foe.x = 0; foe.z = -10.3; me.x = 0; me.z = -6.5;
  w.cast(me, 'E', foe.x, foe.z); for (let i = 0; i < 60; i++) w.step(DT);
  check(foe.stun > 0, 'E: driven into the wall, the target is stunned');
  ({ w, me, foe, run, saw } = setup('hammer', 6));
  w.hold(me, 'R'); run(0.2); w.cast(me, 'R', foe.x, foe.z);
  check(!w.projectiles.length && me.ult === 0, 'R tapped: no wave, and the charge is spent');
  ({ w, me, foe, run, saw } = setup('hammer', 4.4));
  w.hold(me, 'R'); run(0.2); w.cast(me, 'R', foe.x, foe.z);
  check(foe.up > 0.5, 'R tapped: knocks up what is right in front');
  ({ w, me, foe, run, saw } = setup('hammer', 10));
  w.hold(me, 'R'); run(1.1); w.cast(me, 'R', foe.x, foe.z);
  check(w.projectiles.length === 1 && Math.abs(w.projectiles[0].left - 9.5) < 0.01, 'R held: a wave with the reach wound up');
  for (let i = 0; i < 200 && !w.result; i++) w.step(DT);
  check(w.result && w.result.kind === 'over' && w.result.winner === me, 'R held: the target is thrown out of the ring');
  ({ w, me, foe, run, saw } = setup('hammer', 20));
  w.hold(me, 'R'); run(4.1);
  check(!me.hold && me.ult >= 50 && me.ult < 51, 'R held 4 seconds: wasted, at the cost of half the charge');
}

console.log('BRAWLER KING (Sett)');
{
  let { w, me, foe, run, saw } = setup('boss', 2.6);
  w.cast(me, 'Q', me.x, me.z);
  check(me.empN === 2 && me.haste > 0, 'Q: two empowered hits, and haste');
  me.vz = -8; for (let i = 0; i < 30; i++) w.step(DT);
  check(me.empN === 1 && me.empower > 0, 'Q: the first hit leaves one more');
  ({ w, me, foe, run, saw } = setup('boss', 6));
  w.hurt(me, 80, foe, 'x');
  check(Math.abs(me.store - 80) < 1, 'W: all damage taken is banked as grit');
  w.cast(me, 'W', foe.x, foe.z); run(0.7);
  check(!!me.charge, 'W: 0.75 seconds of wind-up');
  const f0 = foe.spin; run(0.1);
  const centre = f0 - foe.spin;
  check(centre > 85 && me.shield > 70 && me.store === 0, 'W: the grit goes out with the punch and comes back as a shield');
  ({ w, me, foe, run, saw } = setup('boss', 6));
  w.hurt(me, 80, foe, 'x'); w.cast(me, 'W', foe.x + 1.2, foe.z); const f1 = foe.spin; run(0.8);
  check(f1 - foe.spin > 20 && f1 - foe.spin < centre * 0.9, `W: off the centre line the target's defence still counts (${centre.toFixed(0)} vs ${(f1 - foe.spin).toFixed(0)})`);
  ({ w, me, foe, run, saw } = setup('boss', 5));
  w.cast(me, 'E', me.x, me.z);
  check(foe.slowK === 0.7 && foe.stun === 0 && foe.vz > 3, 'E: pulled in and slowed 70%, but not stunned one on one');
  ({ w, me, foe, run, saw } = setup('boss', 3));
  w.cast(me, 'R', 99, 99);
  check(foe.air && foe.air.tz < foe.z - 3, 'R: the target is carried on past where it stood');
  for (let i = 0; i < 100; i++) w.step(DT);
  check(foe.slowK === 0.99 || foe.spin < foe.spinMax - 80, 'R: slammed down, hurt and barely able to move');
}

console.log('ASHEN EXORCIST (Locke)');
{
  let { w, me, foe, run, saw } = setup('ash', 6);
  w.cast(me, 'Q', foe.x, foe.z); run(0.25);
  check(foe.tag === 1 && foe.slowK === 0.25 && me.re.Q > 3, 'Q: one nail, a light slow, and two more to throw');
  w.cast(me, 'Q', foe.x, foe.z); run(0.25);
  check(foe.tag === 2 && foe.slowK === 0.6, 'Q: with two nails in, the slow is 60%');
  ({ w, me, foe, run, saw } = setup('ash', 20));
  w.cast(me, 'Q', foe.x, foe.z); const cd0 = me.cd.Q; run(4.1);
  check(Math.abs(me.cd.Q - (cd0 - 4.1) * 0.6) < 0.2, 'Q: two nails left unthrown give back 40% of the cooldown');
  ({ w, me, foe, run, saw } = setup('ash', 2.6));
  foe.tag = 3; foe.tagT = 4; const f0 = foe.spin; me.vz = -8; for (let i = 0; i < 30; i++) w.step(DT);
  check(foe.tag === 0 && f0 - foe.spin > 70, 'Q: a body hit tears the nails out for extra damage');
  ({ w, me, foe, run, saw } = setup('ash', 20));
  me.spin = 800; w.cast(me, 'W', me.x, me.z); run(1);
  const paid = me.store; w.hurt(me, 50, foe, 'x');
  check(paid > 10 && me.haste > 0 && Math.abs(me.store - paid - 50) < 1, 'W: spin is burned and banked, and so is damage taken');
  const s0 = me.spin; w.cast(me, 'W', me.x, me.z);
  check(me.buff === 0 && me.store === 0 && me.spin > s0 + paid + 50, 'W again: it ends and everything banked comes back, and more');
  ({ w, me, foe, run, saw } = setup('ash', 10));
  w.cast(me, 'E', foe.x, foe.z); for (let i = 0; i < 60 && (me.blink || i < 2); i++) w.step(DT);
  check(me.re.E > 3 && Math.hypot(me.vx, me.vz) < 2, 'E: a warp that arrives standing still, with a follow-up for 4 seconds');
  ({ w, me, foe, run, saw } = setup('ash', 6));
  w.cast(me, 'R', foe.x, foe.z); run(0.7);
  check(foe.doom === 0, 'R: nothing for the first three quarters of a second');
  run(0.1);
  check(foe.doom > 4.5 && foe.slowK === 0.99, 'R: then damage, a near-total slow and a 5-second mark');
  foe.x = 9; foe.z = 6; foe.spin = foe.spinMax * 0.11; run(0.05);
  check(w.result && w.result.winner === me && me.perm === 1, 'R: marked and under 12%, it is executed wherever it is, and the line rises');
  w.resetRound();
  check(me.perm === 1, 'R: the raised line carries into the next round');
}

console.log('UNSUNDERED GLAIVE (Zaahen)');
{
  let { w, me, foe, run, saw } = setup('glaive', 2.6);
  me.spin = 500; w.cast(me, 'Q', me.x, me.z); me.vz = -8; for (let i = 0; i < 30; i++) w.step(DT);
  check(me.spin > 550 && me.re.Q > 3 && foe.up === 0, 'Q: the hit heals 9% and opens the follow-up');
  me.x = 0; me.z = 1.3; foe.x = 0; foe.z = -1.3; me.vx = me.vz = foe.vx = foe.vz = 0; me.tumble = 0; me.hitCd = foe.hitCd = 0;
  w.cast(me, 'Q', me.x, me.z); me.vz = -8; for (let i = 0; i < 30; i++) w.step(DT);
  check(foe.up > 0 || saw('say', (e) => e.text === 'KNOCK UP'), 'Q again: the next hit knocks up');
  ({ w, me, foe, run, saw } = setup('glaive', 6));
  w.cast(me, 'W', foe.x, foe.z); run(0.45);
  check(!!me.charge && !w.projectiles.length, 'W: half a second of wind-up');
  run(0.3);
  check(foe.vz > 3 || saw('projHit'), 'W: then the thrust, which drags the target in');
  ({ w, me, foe, run, saw } = setup('glaive', 3));
  for (let i = 0; i < 12; i++) w.hurt(foe, 10, me, 'x');
  check(me.stack === 12, 'growth: twelve hits is the peak');
  const a = w.hurt(foe, 100, me, 'y');
  check(a > 100 * 1.15, `growth: at the peak the bonus is doubled (${a.toFixed(0)} for 100)`);
  me.spin = 5; w.hurt(me, 50, foe, 'x'); w.step(DT);
  check(me.egg > 0 && !w.result, 'at the peak, running out of spin is not the end');
  for (let i = 0; i < 380; i++) { w.step(DT); foe.x = 0; foe.z = -10; }
  check(me.egg === 0 && me.spin > 400 && !w.result, 'it comes back with half its spin');
  ({ w, me, foe, run, saw } = setup('glaive', 3));
  me.spin = 5; w.hurt(me, 50, foe, 'x'); w.step(DT);
  check(w.result && w.result.winner === foe, 'without the stacks there is no second life');
}

console.log('VAULT BREAKER (Vi)');
{
  let { w, me, foe, run, saw } = setup('gauntlet', 20);
  w.hold(me, 'Q');
  const r0 = w.holdRange(me, 'Q'); run(0.6); const r1 = w.holdRange(me, 'Q'); run(0.7); const r2 = w.holdRange(me, 'Q');
  check(r0 === 2.5 && r1 > 4 && r1 < 6 && r2 === 7.25, `Q held: the dash grows from 2.5 to 7.25 over 1.25 seconds (${r0} -> ${r1.toFixed(1)} -> ${r2})`);
  const z0 = me.z; w.cast(me, 'Q', foe.x, foe.z); for (let i = 0; i < 22; i++) w.step(DT);
  check(Math.abs(z0 - me.z - 7.25) < 0.8, 'Q released: it covers the distance wound up');
  const hit = (hold) => { const s = setup('gauntlet', 4.5); s.w.hold(s.me, 'Q'); s.run(hold); const f = s.foe.spin; s.w.cast(s.me, 'Q', s.foe.x, s.foe.z); for (let i = 0; i < 40; i++) s.w.step(DT); return f - s.foe.spin; };
  const weak = hit(0.05), strong = hit(1.3);
  check(strong > weak * 1.3, `Q: a full wind-up hits much harder (${weak.toFixed(0)} -> ${strong.toFixed(0)})`);
  ({ w, me, foe, run, saw } = setup('gauntlet', 20));
  w.hold(me, 'Q'); run(4.1);
  check(!me.hold && me.cd.Q > 2 && me.cd.Q <= 3, 'Q held 4 seconds: wasted, on a 3-second cooldown');
  ({ w, me, foe, run, saw } = setup('gauntlet', 6));
  check(!w.canCast(me, 'W'), 'W: always on, the key does nothing');
  w.hurt(foe, 10, me, 'clash'); w.hurt(foe, 10, me, 'clash'); const f0 = foe.spin; w.hurt(foe, 10, me, 'clash');
  check(foe.shred > 3.9 && f0 - foe.spin > 20 && foe.tag === 0, 'W: the third hit dents: extra damage and 4 seconds of weakness');
  const a1 = w.hurt(foe, 100, me, 'x'); foe.shred = 0; foe.tag = 0; const b1 = w.hurt(foe, 100, me, 'x');
  check(Math.abs(a1 / b1 - 1.2) < 0.01, 'W: a dented target takes 20% more');
  ({ w, me, foe, run, saw } = setup('gauntlet', 20));
  check(me.stk === 2 && w.cast(me, 'E', me.x, me.z), 'E: starts with two uses');
  run(1.05);
  check(w.cast(me, 'E', me.x, me.z) && me.stk === 0, 'E: the second a second later');
  run(1.05);
  check(!w.canCast(me, 'E'), 'E: none left');
  run(6);
  check(me.stk === 1 && w.canCast(me, 'E'), 'E: one comes back after 8 seconds');
  ({ w, me, foe, run, saw } = setup('gauntlet', 8));
  w.cast(me, 'R', me.x, me.z);
  check(Math.abs(foe.up - 0.8) < 0.01 && Math.hypot(me.x - foe.x, me.z - foe.z) < 3, 'R: closes in and knocks up for 0.8 seconds');
}

console.log('SPARK SURGE (Zeri)');
{
  let { w, me, foe, run, saw } = setup('spark', 5);
  let shots = 0; for (let i = 0; i < 120; i++) { if (w.cast(me, 'Q', foe.x, foe.z)) shots++; w.step(DT); foe.x = 0; foe.z = -2.5; me.x = 0; me.z = 2.5; me.vx = me.vz = foe.vx = foe.vz = 0; }
  check(shots >= 7 && shots <= 8, `Q held: about 7.5 shots a second (${shots})`);
  check(foe.spinMax - foe.spin < shots * 12, 'Q: each shot is small');
  ({ w, me, foe, run, saw } = setup('spark', 5));
  me.cd.E = 10; w.cast(me, 'Q', foe.x, foe.z); run(0.2);
  check(Math.abs(me.cd.E - 9.3) < 0.05, 'Q: a hit takes half a second off E');
  ({ w, me, foe, run, saw } = setup('spark', 12));
  w.cast(me, 'E', foe.x, foe.z); setup.last.drift(0.2);
  check(w.aimSkill(me, 'Q').id === 'burstfire2' && w.aimSkill(me, 'Q').pierce, 'E: for 5 seconds after, Q pierces');
  setup.last.drift(5);
  check(w.aimSkill(me, 'Q').id === 'burstfire', 'E: then Q is back to normal');
  ({ w, me, foe, run, saw } = setup('spark', 20));
  w.cast(me, 'R', me.x, me.z);
  check(me.buff === 0, 'R: a miss means no overcharge');
  ({ w, me, foe, run, saw } = setup('spark', 5));
  w.cast(me, 'R', me.x, me.z);
  check(me.buff === 5, 'R: a hit starts 5 seconds of overcharge');
  run(3); me.cd.Q = 0; w.cast(me, 'Q', foe.x, foe.z); run(0.2);
  check(me.buff > 4.7, 'R: landing shots keeps it going');
}

console.log('STAR FORGER (Aurelion Sol)');
{
  let { w, me, foe, run, saw } = setup('cosmos', 5);
  let ticks = 0, burst = 0; const f0 = foe.spin;
  for (let i = 0; i < 480; i++) { const f = foe.spin; if (w.cast(me, 'Q', foe.x, foe.z)) ticks++; if (f - foe.spin > 15) burst++; w.step(DT); foe.x = 0; foe.z = -2.5; me.x = 0; me.z = 2.5; me.vx = me.vz = foe.vx = foe.vz = 0; }
  check(ticks >= 24 && ticks <= 27, `Q held: it breathes for 3.25 seconds and then stops (${ticks} ticks in 4 seconds)`);
  check(burst === 3 && me.perm === 6, `Q: a flare-up for every second on the same target, two stardust each (${burst} flare-ups, ${me.perm} stardust)`);
  check(me.cd.Q > 2 && me.cd.Q <= 3, 'Q: a 3-second cooldown once it runs out');
  ({ w, me, foe, run, saw } = setup('cosmos', 5));
  for (let i = 0; i < 60; i++) { w.cast(me, 'Q', foe.x, foe.z); w.step(DT); }
  for (let i = 0; i < 48; i++) w.step(DT);
  check(me.cd.Q > 2.4, 'Q let go early: the cooldown starts a moment later');
  ({ w, me, foe, run, saw } = setup('cosmos', 22));
  w.cast(me, 'W', me.x, me.z - 30);
  for (let i = 0; i < 30; i++) w.step(DT);
  check(!!me.dash && w.cast(me, 'Q', foe.x, foe.z), 'W: flying, and still able to breathe');
  ({ w, me, foe, run, saw } = setup('cosmos', 6));
  w.cast(me, 'E', foe.x, foe.z); const small = w.zones[0].r; run(2.05);
  check(me.perm === 2 && foe.slow > 0, 'E: a stardust for every second the target spends inside');
  ({ w, me, foe, run, saw } = setup('cosmos', 6));
  me.perm = 60; w.cast(me, 'E', foe.x, foe.z);
  check(Math.abs(w.zones[0].r / small - 1.3) < 0.01, 'E: 60 stardust makes it 30% wider');
  foe.spin = foe.spinMax * 0.04; run(0.05);
  check(w.result && w.result.winner === me, 'E: at the centre, under 5% spin, the target is crushed');
  ({ w, me, foe, run, saw } = setup('cosmos', 6));
  w.cast(me, 'R', foe.x, foe.z); run(1);
  check(me.perm === 5 && foe.stun > 0 && foe.up === 0, 'R: a stun, and five stardust for the hit');
  w.resetRound();
  check(me.perm === 5, 'stardust carries into the next round');
  ({ w, me, foe, run, saw } = setup('cosmos', 6));
  me.perm = 75; w.cast(me, 'R', foe.x, foe.z);
  check(w.zones[0].kind === 'skies', 'R at 75 stardust: The Skies Descend');
  run(1);
  check(foe.up > 0 && foe.slowK === 0.5, 'R at 75: a knock-up and a 50% slow instead');
}

console.log('SAND EMPEROR (Azir): the shuffle');
{
  const { w, me, foe } = setup('sand', 20);
  w.cast(me, 'W', me.x, me.z - 7);
  me.cd.E = 0; w.cast(me, 'E', me.x, me.z);
  for (let i = 0; i < 6; i++) w.step(DT);
  check(!!me.dash && w.canCast(me, 'Q'), 'E: mid-dash, Q can still be given');
  me.cd.Q = 0; w.cast(me, 'Q', me.x + 7, me.z - 4);
  const goal = { x: w.zones[0].dx, z: w.zones[0].dz };
  let end = null;
  for (let i = 0; i < 120 && !end; i++) { w.step(DT); if (!me.dash) end = { x: me.x, z: me.z }; }
  check(end && Math.hypot(end.x - goal.x, end.z - goal.z) < 2.5, 'E then Q: the emperor follows the soldier to where it was sent');
}

console.log('STAR FORGER: flight and gravity');
{
  let { w, me, foe, run } = setup('cosmos', 22);
  const z0 = me.z;
  w.cast(me, 'W', me.x, me.z - 40);
  for (let i = 0; i < 240 && me.dash; i++) w.step(DT);
  check(z0 - me.z > 18, `W: a long flight across the arena (${(z0 - me.z).toFixed(1)})`);
  ({ w, me, foe, run } = setup('cosmos', 22));
  w.cast(me, 'W', me.x, me.z - 40);
  for (let i = 0; i < 40; i++) w.step(DT);
  const mid = me.z;
  check(w.cast(me, 'W', me.x, me.z) && !me.dash, 'W again: it lands on the spot');
  for (let i = 0; i < 10; i++) w.step(DT);
  check(Math.abs(me.z - mid) < 2, 'W again: and stays there');
  ({ w, me, foe, run } = setup('cosmos', 22));
  for (let i = 0; i < 30; i++) { w.cast(me, 'Q', foe.x, foe.z); w.step(DT); }
  w.cast(me, 'W', me.x + 30, me.z);
  let ticks = 0; for (let i = 0; i < 60; i++) { if (w.cast(me, 'Q', foe.x, foe.z)) ticks++; w.step(DT); }
  check(!!me.dash || ticks >= 3, 'W during Q: the breath goes on');
  check(ticks >= 3, `W during Q: it keeps ticking in flight (${ticks})`);
  ({ w, me, foe, run } = setup('cosmos', 6));
  foe.x = 3; foe.z = -3;
  w.cast(me, 'E', 0, -3);
  for (let i = 0; i < 120; i++) { w.step(DT); w.issueMove(foe, 12, -3); }
  check(foe.x < 6.5, `E: a top trying to walk out is held back hard (${foe.x.toFixed(1)} after a second of walking away)`);
}

console.log('SPARK SURGE: the laser');
{
  const { w, me, foe, run } = setup('spark', 12);
  w.cast(me, 'W', foe.x, foe.z); run(0.3);
  check(!!me.charge && foe.slow === 0, 'W: a moment of lining up');
  run(0.2);
  check(foe.slowK === 0.5 && foe.spin < foe.spinMax - 30 && !w.projectiles.length, 'W: then a laser that lands at once and slows 50%');
}

console.log('VAULT BREAKER: the shockwave');
{
  const { w, me, foe, saw } = setup('gauntlet', 2.6);
  w.cast(me, 'E', me.x, me.z); me.vz = -8; for (let i = 0; i < 30; i++) w.step(DT);
  setup.last.seen.push(...w.events.splice(0));
  check(setup.last.seen.some((e) => e.type === 'cone' && e.skill.id === 'relentwave' && e.dz < -0.9), 'E: a shockwave fans out behind the target');
}

console.log('IRON REVENANT (Mordekaiser)');
{
  let { w, me, foe, run, saw } = setup('iron', 5);
  w.cast(me, 'Q', foe.x, foe.z); run(0.4);
  check(!!me.charge && foe.stats.taken === 0, 'Q: half a second of winding up');
  run(0.3);
  check(foe.spin < foe.spinMax - 40 && !w.zones.length, 'Q: then a slam straight ahead');
  ({ w, me, foe, run, saw } = setup('iron', 5));
  w.cast(me, 'Q', me.x + 5, me.z); run(0.7);
  check(foe.stats.taken === 0, 'Q: aimed elsewhere, it misses');
  ({ w, me, foe, run, saw } = setup('iron', 5));
  w.hurt(foe, 100, me, 'x'); const s1 = me.store; w.hurt(me, 100, foe, 'x');
  check(Math.abs(s1 - 45) < 3 && Math.abs(me.store - s1 - 15) < 3, `W: banks 45% of damage dealt and 15% of damage taken (${s1.toFixed(0)}, ${(me.store - s1).toFixed(0)})`);
  me.store = 100; me.spin = 500; w.cast(me, 'W', me.x, me.z);
  check(me.shield === 100 && me.re.W > 0, 'W: the bank becomes a shield, and the key can be pressed again');
  w.cast(me, 'W', me.x, me.z);
  check(me.shield === 0 && Math.abs(me.spin - 545) < 1, 'W again: 45% of what is left of the shield becomes spin');
  ({ w, me, foe, run, saw } = setup('iron', 6));
  const d0 = Math.hypot(me.x - foe.x, me.z - foe.z);
  w.cast(me, 'E', foe.x, foe.z); run(0.35);
  check(foe.stats.taken === 0, 'E: nothing for half a second');
  run(0.6);
  check(Math.hypot(me.x - foe.x, me.z - foe.z) < d0 - 1.5, 'E: then whoever stands there is dragged toward the caster');
  ({ w, me, foe, run, saw } = setup('iron', 6));
  const plain = w.hurt(foe, 50, me, 'x'), took = w.hurt(me, 50, foe, 'x');
  me.ult = 100; w.cast(me, 'R', me.x, me.z); me.shield = 0;
  check(me.buff === 5 && !me.tether, 'R: five seconds, and no leash');
  const big = w.hurt(foe, 50, me, 'x'), small = w.hurt(me, 50, foe, 'x');
  check(Math.abs(big / plain - 2) < 0.01 && Math.abs(small / took - 0.5) < 0.01, 'R: damage dealt doubled, damage taken halved');
}

console.log('FEATHER STORM (Xayah)');
{
  let { w, me, foe, run, saw } = setup('plume', 2.4);
  me.vz = -9; for (let i = 0; i < 20; i++) w.step(DT);
  check(!w.own(me, 'feather').length && !w.projectiles.length, 'without W, a body hit throws nothing');
  ({ w, me, foe, run, saw } = setup('plume', 2.4));
  w.cast(me, 'W', me.x, me.z); me.vz = -9; for (let i = 0; i < 40; i++) w.step(DT);
  const fs = w.own(me, 'feather');
  check(fs.length === 1 && fs[0].z < foe.z, 'W: a body hit throws one feather through the target, and it stays behind it');
  ({ w, me, foe, run, saw } = setup('plume', 6));
  const a1 = w.hurt(foe, 50, me, 'x'); w.cast(me, 'W', me.x, me.z); const a2 = w.hurt(foe, 50, me, 'x');
  check(a1 === a2, 'W: no flat damage bonus any more');
  ({ w, me, foe, run, saw } = setup('plume', 6));
  for (const k of [0, 1, 2]) w.zone(me, SKILLS.feather, 0, foe.z - 3 - k * 2, null, true);
  const f0 = foe.spin; w.cast(me, 'E', me.x, me.z);
  const hits = []; let last = foe.spin;
  for (let i = 0; i < 60; i++) { w.step(DT); foe.x = 0; foe.z = -3; foe.vx = foe.vz = 0; me.x = 0; me.z = 3; me.vx = me.vz = 0; if (foe.spin < last - 5) { hits.push(last - foe.spin); last = foe.spin; } }
  check(hits.length === 3 && foe.snare > 0 && foe.stun === 0, `E: three quills snare (${hits.map((h) => h.toFixed(1))})`);
  check(hits.length === 3 && hits[1] < hits[0] && hits[2] < hits[1], 'E: each quill after the first cuts 5% less');
  ({ w, me, foe, run, saw } = setup('plume', 6));
  me.ult = 100; w.cast(me, 'R', foe.x, foe.z); setup.last.drift(0.5);
  w.issueMove(me, me.x + 5, me.z); setup.last.drift(0.5);
  check(!!me.charge && me.x > 1, 'R: free to move for a second and a half');
  const before = me.spin; w.hurt(me, 0, foe, 'x'); foe.x = me.x; foe.z = me.z - 1; foe.vz = 8; setup.last.drift(0.2, me.x, me.z);
  check(me.spin >= before - 2, 'R: nothing can touch it meanwhile');
  foe.x = 0; foe.z = -12; setup.last.drift(0.35, 0, -12);
  check(!me.charge && w.projectiles.filter((q) => q.owner === me).length === 5, 'R: then five feathers in the direction aimed');
}

console.log('NOX SHADE (Zed)');
{
  let { w, me, foe, run, saw } = setup('nox', 5);
  w.cast(me, 'Q', foe.x, foe.z); run(0.15);
  check(foe.stats.taken > 0 && w.projectiles.length === 1, 'Q: the shuriken goes through its target');
  ({ w, me, foe, run, saw } = setup('nox', 16));
  w.cast(me, 'Q', foe.x, foe.z); run(1);
  check(foe.stats.taken === 0, 'Q: a short reach');
  ({ w, me, foe, run, saw } = setup('nox', 16));
  w.cast(me, 'W', me.x + 6, me.z);
  const sh = w.own(me, 'shadow')[0];
  check(Math.hypot(sh.x - me.x, sh.z - me.z) < 0.5, 'W: the shadow starts from the caster');
  run(0.1);
  check(sh.x > 1.5 && sh.x < 5, 'W: and flies out');
  run(0.4);
  check(Math.abs(sh.x - 6) < 0.1 && (sh.c & 2) === 0, 'W: to where it was sent, and stays');
  const mx = me.x; w.cast(me, 'W', me.x, me.z);
  check(Math.abs(me.x - 6) < 0.1 && Math.abs(sh.x - mx) < 0.1, 'W again: swaps places with it');
  ({ w, me, foe, run, saw } = setup('nox', 3));
  me.cd.W = 10; w.cast(me, 'E', me.x, me.z);
  check(Math.abs(me.cd.W - 7) < 0.05 && foe.slow === 0, 'E: a hit takes 3 seconds off W; its own cut does not slow');
  ({ w, me, foe, run, saw } = setup('nox', 7));
  w.cast(me, 'W', foe.x + 1, foe.z); run(0.6); w.cast(me, 'E', me.x, me.z);
  check(foe.slowK === 0.4 && Math.abs(foe.slow - 1.5) < 0.05, 'E from a shadow: a 40% slow for 1.5 seconds');
  ({ w, me, foe, run, saw } = setup('nox', 8));
  const home = { x: me.x, z: me.z };
  w.cast(me, 'R', me.x, me.z);
  check(!!me.air && me.dmark === 0 && w.own(me, 'shadow').some((q) => q.c & 4), 'R: out of reach for 0.75 seconds, a shadow left behind');
  check(!w.canCast(me, 'R'), 'R: no way back yet');
  setup.last.drift(0.8);
  check(!me.air && me.z < foe.z && me.dmark > 2 && me.dmark <= 3, 'R: up behind the target, which is marked for 3 seconds');
  check(w.canCast(me, 'R') && w.cast(me, 'R', me.x, me.z) && Math.hypot(me.x - home.x, me.z - home.z) < 0.2, 'R again: back to where it started');
}

console.log('GALE RONDO (Yasuo)');
{
  let { w, me, foe, run, saw } = setup('gale', 9);
  w.cast(me, 'Q', foe.x, foe.z); run(0.5);
  check(foe.stats.taken === 0, 'Q: a short thrust');
  ({ w, me, foe, run, saw } = setup('gale', 4));
  w.cast(me, 'E', foe.x, foe.z);
  check(!!me.dash && w.canCast(me, 'Q'), 'E: Q can be used in the middle of the dash');
  w.cast(me, 'Q', foe.x, foe.z);
  check(!w.projectiles.length, 'Q during E: no thrust');
  for (let i = 0; i < 30 && me.dash; i++) w.step(DT);
  setup.last.seen.push(...w.events.splice(0));
  check(saw('blast', (e) => e.skill.id === 'galeq' && e.hit > 0), 'Q during E: a ring around where the dash ends');
  check(me.stack === 2, 'Q during E: the dash and the ring each gather wind');
  check(me.re.E > 0 && me.cd.E > 5, 'E: cutting through opens one more, on a 6-second cooldown');
  me.x = 0; me.z = 2; foe.x = 0; foe.z = -2; foe.tumble = 0;
  me.cd.Q = 0; w.cast(me, 'E', foe.x, foe.z); w.cast(me, 'Q', foe.x, foe.z);
  for (let i = 0; i < 30 && me.dash; i++) w.step(DT);
  check(foe.up > 0, 'Q during E with the wind gathered: everything around goes up');
  check(me.re.E === 0 && !w.canCast(me, 'E'), 'E: only one extra dash');
  ({ w, me, foe, run, saw } = setup('gale', 4));
  w.cast(me, 'E', foe.x, foe.z); for (let i = 0; i < 30 && me.dash; i++) w.step(DT);
  const first = foe.stats.taken; me.x = 0; me.z = 2; foe.x = 0; foe.z = -2; foe.tumble = 0; foe.vx = foe.vz = 0;
  w.cast(me, 'E', foe.x, foe.z); for (let i = 0; i < 30 && me.dash; i++) w.step(DT);
  check(Math.abs((foe.stats.taken - first) / first - 1.25) < 0.03, 'E again: 25% harder');
  ({ w, me, foe, run, saw } = setup('gale', 4));
  w.cast(me, 'E', me.x + 5, me.z); run(0.5);
  check(me.re.E === 0, 'E: a miss opens nothing');
}

console.log('WORLD ENDER (Aatrox)');
{
  const swing = (d, n, side = 0) => {
    const s = setup('darkin', d);
    for (let i = 1; i < n; i++) { const fz = s.foe.z; s.foe.z = s.me.z + 5; s.w.cast(s.me, 'Q', 0, -9); s.run(0.65); s.foe.z = fz; }
    s.foe.x = side; const f0 = s.foe.stats.taken;
    const kind = s.w.aimSkill(s.me, 'Q').kind;
    s.w.cast(s.me, 'Q', 0, -9); s.run(0.3); const early = s.foe.stats.taken - f0; s.run(0.4);
    return { ...s, dmg: s.foe.stats.taken - f0, early, kind };
  };
  let a = swing(3.4, 1), b = swing(5.6, 1), c = swing(9, 1);
  check(a.kind === 'beam' && a.early === 0 && a.dmg > 0, 'Q1: a long line, after a wind-up');
  check(Math.abs(b.dmg / a.dmg - 1.75) < 0.02 && b.foe.up > 0 && a.foe.up === 0, `Q1: the far end hits 75% harder and knocks up (${a.dmg.toFixed(0)} -> ${b.dmg.toFixed(0)})`);
  check(c.dmg === 0, 'Q1: out of reach beyond that');
  const a2 = swing(2.6, 2), b2 = swing(4.4, 2), c2 = swing(3.4, 2, 5);
  check(a2.kind === 'cone' && Math.abs(a2.dmg / a.dmg - 1.25) < 0.02, 'Q2: a fan, 25% harder');
  check(Math.abs(b2.dmg / a2.dmg - 1.75) < 0.02 && b2.foe.up > 0, 'Q2: its outer edge is the sweet spot');
  check(c2.dmg === 0, 'Q2: nothing off to the side');
  const a3 = swing(4.2, 3), b3 = swing(2.6, 3), c3 = swing(7, 3);
  check(a3.kind === 'slam' && Math.abs(a3.dmg / a.dmg - 1.5) < 0.02, 'Q3: a slam right in front, 50% harder');
  check(Math.abs(b3.dmg / a3.dmg - 1.75) < 0.02 && b3.foe.up > 0, 'Q3: its middle is the sweet spot');
  check(c3.dmg === 0 && !c3.w.canCast(c3.me, 'Q') && c3.me.cd.Q > 3, 'Q: three swings, then the cooldown that started with the first');
  let { w, me, foe, run, saw } = setup('darkin', 8.4);
  w.cast(me, 'Q', 0, -9); run(0.2);
  check(!w.issueMove(me, 5, 5) && !w.canCast(me, 'W') && w.canCast(me, 'E'), 'Q: no walking or other skills while winding up, but E works');
  const z0 = me.z; w.cast(me, 'E', 0, -9); run(0.5);
  check(z0 - me.z > 2.5 && foe.stats.taken > 0 && foe.up > 0, 'E during Q: steps in, and the swing lands with its tip from the new spot');
  ({ w, me, foe, run, saw } = setup('darkin', 12));
  const e0 = me.z; w.cast(me, 'E', 0, -9); for (let i = 0; i < 30 && me.dash; i++) w.step(DT);
  check(Math.abs(e0 - me.z - 3) < 0.4, `E: a short dash of 3 (${(e0 - me.z).toFixed(2)})`);
  ({ w, me, foe, run, saw } = setup('darkin', 6));
  w.cast(me, 'W', foe.x, foe.z); run(0.3);
  check(foe.slowK === 0.35 && w.own(me, 'chainzone').length === 1 && !me.tether, 'W: a 35% slow, and a ring where it hit');
  const before = foe.stats.taken; run(1.4);
  check(foe.stats.taken > before, 'W: still inside after 1.5 seconds: dragged to the middle and hit again');
  ({ w, me, foe, run, saw } = setup('darkin', 6));
  w.cast(me, 'W', foe.x, foe.z); run(0.3);
  const b4 = foe.stats.taken; foe.x = 8; run(1.4);
  check(foe.stats.taken === b4, 'W: stepping out of the ring avoids it');
  ({ w, me, foe, run, saw } = setup('darkin', 6));
  const plain = w.hurt(foe, 50, me, 'x'); me.spin = 500; w.cast(me, 'R', me.x, me.z);
  const big = w.hurt(foe, 50, me, 'x');
  check(me.buff === 10 && Math.abs(big / plain - 1.3) < 0.01 && Math.abs(me.spin - 500 - big * 0.3) < 0.5, 'R: 10 seconds of more damage, part of it coming back as spin');
}

console.log('CURTAIN CALL (Jhin)');
{
  let { w, me, foe, run, saw } = setup('curtain', 22);
  w.cast(me, 'W', foe.x, foe.z); run(0.6);
  check(foe.stats.taken > 0 && foe.snare === 0 && foe.stun === 0, 'W: reaches across the arena; unmarked, it only hurts');
  ({ w, me, foe, run, saw } = setup('curtain', 10));
  w.hurt(foe, 10, me, 'x'); run(3); w.cast(me, 'W', foe.x, foe.z); run(0.4);
  check(Math.abs(foe.snare - 1.35) < 0.3 && foe.stun === 0, 'W: struck within the last 4 seconds, the target is snared for 1.35');
  ({ w, me, foe, run, saw } = setup('curtain', 10));
  w.hurt(foe, 10, me, 'x'); run(4.2); w.cast(me, 'W', foe.x, foe.z); run(0.4);
  check(foe.snare === 0, 'W: the mark is gone after 4 seconds');
  ({ w, me, foe, run, saw } = setup('curtain', 12));
  check(me.stk === 2 && w.cast(me, 'E', me.x + 3, me.z), 'E: two traps in store');
  run(2.1); w.cast(me, 'E', me.x - 3, me.z); run(2.1);
  check(me.stk === 0 && !w.canCast(me, 'E'), 'E: then none');
  run(10);
  check(me.stk === 1, 'E: one comes back after 14 seconds');
  ({ w, me, foe, run, saw } = setup('curtain', 7));
  w.cast(me, 'E', foe.x, foe.z); run(0.5);
  check(!w.zones[0].c, 'E: not armed for the first second');
  run(0.7);
  check(w.zones[0].c === 1 && foe.slowK === 0.35 && foe.stats.taken === 0, 'E: stepped on, it becomes a 35% slowing field');
  run(1.5); check(foe.stats.taken === 0, 'E: two seconds of fuse');
  run(0.6); check(foe.stats.taken > 0, 'E: then it blows');
  ({ w, me, foe, run, saw } = setup('curtain', 12));
  w.cast(me, 'R', foe.x, foe.z); run(0.3);
  check(!!me.chan && !w.projectiles.length && !w.canCast(me, 'R'), 'R: braced; nothing fires by itself');
  run(1.5);
  check(!w.projectiles.length && w.canCast(me, 'R'), 'R: it waits for the key');
  w.cast(me, 'R', foe.x, foe.z);
  check(w.projectiles.length === 1 && !w.canCast(me, 'R'), 'R pressed: one shot, then a beat before the next');
  run(0.5);
  check(foe.slowK === 0.8, 'R: a hit slows by 80%');
  let fired = 1; for (let i = 0; i < 3; i++) { run(0.75); if (w.cast(me, 'R', foe.x + 4, foe.z)) fired++; }
  check(fired === 4 && !me.chan && me.re.R === 0, 'R: four shots, and the stance ends');
  ({ w, me, foe, run, saw } = setup('curtain', 12));
  w.cast(me, 'R', foe.x, foe.z); run(0.6); w.cast(me, 'R', me.x, me.z + 9);
  const p = w.projectiles[0];
  check(p.dz > 0.99, 'R: it can fire in any direction, even straight behind');
  run(9.6);
  check(!me.chan && !w.canCast(me, 'R'), 'R: held 10 seconds at most; unfired shots are lost');
  const dmg = (ratio) => { const s = setup('curtain', 12); s.foe.spin = s.foe.spinMax * ratio; const f = s.foe.spin; s.w.cast(s.me, 'R', s.foe.x, s.foe.z); s.run(0.6); s.w.cast(s.me, 'R', s.foe.x, s.foe.z); s.run(0.5); return f - s.foe.spin; };
  const full = dmg(1), half = dmg(0.5);
  check(Math.abs(half / full - 2.5) < 0.3, `R: +3% for every 1% of spin the target is missing (${full.toFixed(0)} -> ${half.toFixed(0)} at half)`);
}

console.log('TURRET ENGINEER (Heimerdinger)');
{
  let { w, me, foe, run, saw } = setup('gear', 30);
  let n = 0; for (let i = 0; i < 4; i++) { if (w.cast(me, 'Q', me.x + i - 1.5, me.z + 2)) n++; run(1.1); }
  check(n === 3 && me.stk === 0 && w.own(me, 'turret').length === 3, 'Q: three turrets in store, three standing');
  run(10);
  check(me.stk === 1, 'Q: one comes back after 14 seconds');
  me.ult = 100; w.cast(me, 'R', me.x, me.z); w.cast(me, 'Q', me.x, me.z - 2);
  check(w.own(me, 'turret').length === 4 && w.own(me, 'turret').filter((q) => q.c).length === 1, 'R then Q: the big turret stands on top of the three');
  run(8.1);
  check(!w.own(me, 'turret').some((q) => q.c), 'R then Q: and takes itself apart after 8 seconds');
  ({ w, me, foe, run, saw } = setup('gear', 8));
  me.z = 9; foe.z = 4; w.cast(me, 'Q', me.x, me.z + 2); run(2.5);
  const shots = foe.stats.taken;
  check(shots > 0, 'Q: a turret shoots what comes in reach');
  me.x = 0; me.z = -9; foe.x = 6; foe.z = 6; run(7.5); const t1 = foe.stats.taken; run(1); const t2 = foe.stats.taken; run(2);
  check(t1 > shots && foe.stats.taken - t2 < 1, 'Q: left alone for 8 seconds, it shuts down');
  ({ w, me, foe, run, saw } = setup('gear', 9));
  w.cast(me, 'W', 0, 0);
  const ps = w.projectiles.slice();
  check(ps.length === 5 && Math.abs(ps[0].x - ps[4].x) > 2.5, 'W: five rockets, starting apart');
  for (let i = 0; i < Math.round(0.117 / DT); i++) w.step(DT);
  check(Math.abs(ps[0].x - ps[4].x) < 0.6, 'W: they come together at the point aimed at');
  run(0.5);
  const one = setup('gear', 9); one.w.cast(one.me, 'W', 0, 0); one.w.projectiles.length = 1; one.w.projectiles[0].dx = 0; one.w.projectiles[0].dz = -1; one.w.projectiles[0].x = 0; one.run(0.6);
  check(foe.stats.taken > one.foe.stats.taken && foe.stats.taken < one.foe.stats.taken * 1.9, `W: the first hit is the heavy one (${one.foe.stats.taken.toFixed(0)} alone, ${foe.stats.taken.toFixed(0)} for all five)`);
  ({ w, me, foe, run, saw } = setup('gear', 9));
  w.cast(me, 'Q', me.x + 2, me.z); const tz = w.own(me, 'turret')[0]; tz.b = 99;
  w.cast(me, 'W', 0, 0); run(0.6);
  check(setup.last.seen.filter((e) => e.type === 'beam' && e.skill.id === 'turretlaser').length === 1, 'W: every rocket that lands charges the laser by a fifth; five set it off');
  setup.last.seen.length = 0; tz.dz = 0; w.cast(me, 'E', foe.x, foe.z); run(0.7);
  check(saw('beam', (e) => e.skill.id === 'turretlaser' && e.hit > 0), 'E: a hit, and the turret fires its laser at once');
  check(Math.abs(foe.stun - 0.9) < 0.2 || foe.stun > 0, 'E: the middle stuns');
  ({ w, me, foe, run, saw } = setup('gear', 9));
  w.cast(me, 'E', foe.x + 2.4, foe.z); run(0.7);
  check(foe.stun === 0 && foe.slowK === 0.35, 'E: the outside slows by 35%');
  ({ w, me, foe, run, saw } = setup('gear', 14));
  me.ult = 100; w.cast(me, 'R', me.x, me.z); w.cast(me, 'E', me.x, me.z - 4); run(2.2);
  check(setup.last.seen.filter((e) => e.type === 'blast' && e.skill.id === 'grenade').length === 3, 'R then E: three blasts, hopping forward');
  ({ w, me, foe, run, saw } = setup('gear', 9));
  me.ult = 100; w.cast(me, 'R', me.x, me.z); w.cast(me, 'W', 0, 0);
  check(w.projectiles.length === 20, 'R then W: four volleys, twenty rockets');
}

console.log('POWDER CAPTAIN (Gangplank)');
{
  let { w, me, foe, run, saw } = setup('pirate', 20);
  let n = 0; for (let i = 0; i < 4; i++) { if (w.cast(me, 'E', me.x + (i - 1.5) * 4, me.z - 6)) n++; run(0.55); }
  check(n === 3 && me.stk === 0, 'E: three kegs in store');
  run(6);
  check(me.stk === 1, 'E: one comes back after 8 seconds');
  ({ w, me, foe, run, saw } = setup('pirate', 20));
  w.cast(me, 'E', me.x, me.z - 5); const k = w.own(me, 'keg')[0];
  check(k.c === 3, 'E: a keg can take three blows');
  run(0.55); const c1 = k.c; run(0.5); const c2 = k.c; run(3);
  check(c1 === 2 && c2 === 1 && k.c === 1 && !k.dead, 'E: it weakens by itself, down to one, and no further');
  w.cast(me, 'Q', k.x, k.z); run(0.3);
  check(k.dead && saw('blast', (e) => e.skill.id === 'keg' && e.r > 3), 'Q: the last blow from its owner sets it off');
  ({ w, me, foe, run, saw } = setup('pirate', 20));
  w.cast(me, 'E', me.x, me.z - 5); const k2 = w.own(me, 'keg')[0];
  w.cast(me, 'Q', k2.x, k2.z); run(0.2);
  check(!k2.dead && k2.c === 2, 'Q on a fresh keg: one blow off, no explosion yet');
  ({ w, me, foe, run, saw } = setup('pirate', 9, 'curtain'));
  w.cast(me, 'E', 0, 0); run(1.2);
  foe.cd.Q = 0; w.cast(foe, 'Q', 0, 0); run(0.3);
  check(!w.own(me, 'keg').length && foe.stats.taken === 0 && !saw('blast', (e) => e.skill.id === 'keg' && e.r > 3), 'the other top lands the last blow with a shot: the keg is broken, nothing goes off');
  ({ w, me, foe, run, saw } = setup('pirate', 9));
  w.cast(me, 'E', 0, 0); run(1.2);
  foe.x = 0; foe.z = -1.5; foe.vz = 6; setup.last.drift(0.3, 0, -1.2);
  check(!w.own(me, 'keg').length && foe.stats.taken === 0, 'the other top runs into it: the same');
  ({ w, me, foe, run, saw } = setup('pirate', 9, 'gaia'));
  w.cast(me, 'E', 0, 0); run(1.2);
  w.burst(foe, SKILLS.keg === null ? null : SKILLS.grenade, 0, 0, 3);
  check(!w.own(me, 'keg').length, 'any area attack counts as a blow too');
  ({ w, me, foe, run, saw } = setup('pirate', 16));
  w.cast(me, 'E', me.x, me.z - 4); run(0.55); w.cast(me, 'E', me.x, me.z - 9); run(1.2);
  foe.x = 0; foe.z = me.z - 11;
  w.cast(me, 'Q', me.x, me.z - 4); run(0.3);
  check(!w.own(me, 'keg').length && foe.stats.taken > 0 && foe.slowK === 0.8 && me.haste > 0, 'one keg sets off the next: the far one catches the target, slows it 80%, and the captain speeds up');
  ({ w, me, foe, run, saw } = setup('pirate', 20));
  w.cast(me, 'R', foe.x, foe.z); run(0.5);
  const one = foe.stats.taken; run(7.4);
  check(one > 0 && Math.abs(foe.stats.taken / one - 4) < 0.1 && w.own(me, 'barrage').length === 1, 'R: anywhere in the arena, four waves two seconds apart');
  check(foe.slowK === 0.3, 'R: a 30% slow inside');
  run(0.3); check(!w.own(me, 'barrage').length, 'R: eight seconds');
}

console.log('SAND EMPEROR: which soldier');
{
  const { w, me, foe } = setup('sand', 20);
  w.zone(me, SKILLS.arise, me.x - 2, me.z, { b: 0.4 }); w.zone(me, SKILLS.arise, me.x + 6, me.z, { b: 0.4 });
  me.cd.E = 0; w.cast(me, 'E', me.x + 7, me.z);
  check(!!me.dash && me.dash.dx > 0.9, 'E: flies to the soldier nearest the cursor, not the nearest to itself');
}

console.log('TWILIGHT STAR (Zoe)');
{
  let { w, me, foe, run, saw } = setup('star', 20);
  w.cast(me, 'Q', me.x + 9, me.z); run(0.4);
  check(w.own(me, 'reststar').length === 1 && w.canCast(me, 'Q') && Math.abs(w.own(me, 'reststar')[0].x - 7.9) < 0.5, 'Q: meeting nothing, the star rests where it stopped');
  const rest = w.own(me, 'reststar')[0];
  w.cast(me, 'Q', foe.x, foe.z);
  const p = w.projectiles[0];
  check(!!p && Math.abs(p.x - rest.x) < 1.2 && p.dz < -0.5, 'Q again: it flies on from there, toward the point given');
  run(1);
  const far = foe.stats.taken;
  ({ w, me, foe, run, saw } = setup('star', 5));
  w.cast(me, 'Q', foe.x, foe.z); run(0.4);
  check(foe.stats.taken > 0 && far / foe.stats.taken > 1.8, `Q: a star sent on a long way hits much harder (${foe.stats.taken.toFixed(0)} -> ${far.toFixed(0)})`);
  check(!w.own(me, 'reststar').length && !w.canCast(me, 'Q'), 'Q: one that hits does not rest');
  ({ w, me, foe, run, saw } = setup('star', 20));
  w.cast(me, 'Q', me.x + 9, me.z); run(1.5);
  check(!w.own(me, 'reststar').length && !w.canCast(me, 'Q'), 'Q: it waits one second, no more');
  ({ w, me, foe, run, saw } = setup('star', 6));
  w.cast(me, 'E', foe.x, foe.z); run(0.3);
  check(foe.slowK === 0.3 && foe.stun === 0 && Math.abs(me.cd.E - 14 * 0.7) < 0.4, 'E: drowsy first (a 30% slow), and 30% of the cooldown back');
  run(1.3);
  check(foe.stun > 1 && foe.sleep > 1, 'E: asleep after 1.4 seconds');
  const b0 = foe.stats.taken, dealt = w.hurt(foe, 20, me, 'x');
  check(Math.abs(dealt - 40 * 1) < 14 && dealt > 30 && foe.stun === 0 && foe.sleep === 0, `E: the first blow on a sleeper lands twice over and wakes it (${dealt.toFixed(0)} for 20)`);
  ({ w, me, foe, run, saw } = setup('star', 20));
  w.cast(me, 'E', me.x + 9, me.z); run(0.5);
  check(w.own(me, 'bubbletrap').length === 1, 'E: a bubble that misses settles as a trap');
  const tr = w.own(me, 'bubbletrap')[0]; foe.x = tr.x; foe.z = tr.z; run(1);
  check(!!me.tether && foe.slow > 0, 'E: stepping on it is the same as being hit');
  ({ w, me, foe, run, saw } = setup('star', 8));
  check(BLADES.star.kit.R === 'portal' && !SKILLS.portal.ult, 'R: an ordinary skill, no gauge');
  me.ult = 0; const home = { x: me.x, z: me.z };
  check(w.cast(me, 'R', me.x + 9, me.z), 'R: usable with an empty gauge');
  setup.last.drift(0.4);
  check(Math.abs(me.x - 5) < 0.6 && !w.issueMove(me, 0, 0) && w.canCast(me, 'Q'), 'R: there, unable to walk, but able to cast');
  setup.last.drift(0.8);
  check(Math.hypot(me.x - home.x, me.z - home.z) < 0.3, 'R: back by itself after a second');
  check(me.cd.R > 3 && me.cd.R < 5, 'R: a 5-second cooldown');
}

console.log(bad ? `\n${bad} of ${n} checks failed` : `\nall ${n} checks passed`);
process.exit(bad ? 1 : 0);
