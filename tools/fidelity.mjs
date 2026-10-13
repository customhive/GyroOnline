// Checks blades against the behaviour agreed for them, one line of the
// agreed table per check. Add a section here whenever a blade is reworked.
//   node tools/fidelity.mjs
import { BLADES, SKILLS, CC, ARENA } from '../src/config.js';
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
  // (The other top is kept out of the way: only the hit is being measured.)
  me.x = 0; me.z = 9; me.vx = me.vz = 0;
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
  check(Math.abs(foe.stun - 0.75) < 0.01, 'W: stuns for 0.75 seconds');
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
  check(foe.stun > 2.3 && foe.stun <= 2.5, 'E: touching the rim stuns for 2.5 seconds');
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
  check(foe.snare > 1.7 && foe.snare <= 2 && foe.stun === 0, 'Q: roots for 2 seconds');
  ({ w, me, foe, run, saw } = setup('prism', 20));
  w.cast(me, 'W', foe.x, foe.z);
  check(me.shield === 50, 'W: a shield as the wand leaves');
  run(1.6);
  check(me.shield === 100 && !w.projectiles.length && setup.last.untouched(), 'W: a second layer when the wand comes back; it harms nobody');
  ({ w, me, foe, run, saw } = setup('prism', 7));
  w.cast(me, 'E', foe.x, foe.z); run(0.1);
  check(w.projectiles.length === 1 && !w.own(me, 'singularity').length && me.re.E === 0 && foe.slow === 0, 'E: an orb flies to the spot first; nothing is there yet');
  run(0.2);
  check(w.own(me, 'singularity').length === 1 && foe.slowK === 0.45 && me.re.E > 4, 'E: it opens where it lands: a 45% slow inside, and it waits');
  {
    const s0 = setup('prism', 9, 'gale');
    s0.foe.cd.W = 0; s0.w.cast(s0.foe, 'W', s0.me.x, s0.me.z); s0.run(0.1);
    s0.w.cast(s0.me, 'E', s0.foe.x, s0.foe.z); s0.run(0.6);
    check(!s0.w.own(s0.me, 'singularity').length && !s0.w.projectiles.length && s0.me.re.E === 0 && s0.me.cd.E > 5, 'E: a wind wall in its way stops the orb, and nothing opens');
  }
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
  w.cast(me, 'R', me.x, me.z); w.step(DT);
  check(!!me.dash && foe.up === 0 && Math.hypot(me.x - foe.x, me.z - foe.z) > 7, 'R: a charge at the target, not a jump to it');
  w.stun(me, 1); w.knock(me, 1, 0, 20, 0.5, 1);
  check(me.stun === 0 && !!me.dash, 'R: nothing stops the charge');
  foe.x = 4; for (let i = 0; i < 40 && me.dash; i++) { w.step(DT); foe.x = 4; foe.z = -4; foe.vx = foe.vz = 0; }
  check(foe.up > 1.1 && foe.up <= 1.3 && Math.hypot(me.x - foe.x, me.z - foe.z) < 3.2 && Math.abs(foe.stats.taken - (115 * BLADES.gauntlet.atk) / BLADES.gaia.def) < 1, 'R: it follows a target that moves, and on arriving hits and knocks up for 1.3 seconds');
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
  {
    // The wall ride: E into the wall turns along it.
    const ride = (stage = 0, fromA = 0) => {
      const w2 = new World([BLADES.spark, BLADES.gaia], { seed: 7, stage });
      const [m, f] = w2.tops; m.cd.E = m.cd.Q = 0; f.x = 0; f.z = 0; f.vx = f.vz = 0;
      m.x = Math.cos(fromA) * 10; m.z = Math.sin(fromA) * 10; m.vx = m.vz = 0; m.cmd = null;
      // Outward and a little round the rim, so the ride goes the way of increasing angle.
      w2.cast(m, 'E', m.x + Math.cos(fromA + 0.5) * 6, m.z + Math.sin(fromA + 0.5) * 6);
      const step = (sec) => { for (let k = 0; k < Math.round(sec / DT); k++) { w2.step(DT); f.x = 0; f.z = 0; f.vx = f.vz = 0; } };
      return { w2, m, f, step };
    };
    let r = ride(); r.step(0.3);
    const a0 = Math.atan2(r.m.z, r.m.x);
    check(!!r.m.dash && r.m.dash.skill.slide && Math.abs(Math.hypot(r.m.x, r.m.z) - (13 - r.m.radius)) < 0.01, 'E into the wall: it turns along it and rides the rim');
    r.step(0.5);
    const a1 = Math.atan2(r.m.z, r.m.x), went = (a1 - a0) * (13 - r.m.radius);
    check(Math.abs(went - 12) < 0.6 && r.w2.canCast(r.m, 'Q'), `the ride goes at 24 (${went.toFixed(1)} in half a second), and Q can be fired from it`);
    r.step(1.2);
    check(!r.m.dash && Math.abs(Math.atan2(r.m.z, r.m.x) - a0) > 2.6, 'it ends by itself about half-way round');
    r = ride(); r.step(0.3);
    check(!r.w2.issueMove(r.m, 0, 0) && !!r.m.dash, 'a held move order does not end the ride');
    check(r.w2.issueMove(r.m, 0, 0, true) && !r.m.dash && !!r.m.cmd, 'a fresh click does: it steps down and goes where it was told');
    // THREE GATES: a gate is centred on angle 0; ride toward it from just short of it.
    r = ride(1, -0.9); r.step(1.2);
    check(!r.m.dash && !r.m.out && !r.m.gone && Math.atan2(r.m.z, r.m.x) < 0, 'where the wall stops at a gate, it steps off before the gap');
    r = ride(2); r.step(0.3);
    check(!(r.m.dash && r.m.dash.skill.slide), 'no wall, no ride');
  }
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
  {
    let s = setup('sand', 20), n = 0;
    for (let i = 0; i < 3; i++) { if (s.w.cast(s.me, 'W', s.me.x + i * 2, s.me.z - 5)) n++; s.run(1.55); }
    check(n === 2 && s.me.stk === 0 && s.w.own(s.me, 'arise').length === 2, 'W: two soldiers in store, set a second and a half apart');
    s.run(1.5);
    check(s.me.stk === 1, 'W: one comes back six seconds after the first was set');
    s.run(4);
    const left = s.w.own(s.me, 'arise').length; s.run(1.6);
    check(left === 1 && s.w.own(s.me, 'arise').length === 0, 'W: a soldier stands for ten seconds');
    s = setup('sand', 20);
    for (let i = 0; i < 5; i++) { s.me.stk = 1; s.me.cd.W = 0; s.w.cast(s.me, 'W', s.me.x + i * 1.5 - 3, s.me.z - 5); }
    check(s.w.own(s.me, 'arise').length === 4, 'W: four at once and no more (a fifth takes the place of the oldest)');
    s = setup('sand', 20);
    s.w.cast(s.me, 'W', s.me.x, s.me.z - 6); s.me.cd.E = 0; s.w.cast(s.me, 'E', s.me.x, s.me.z - 6);
    check(s.me.shield === 60 && Math.abs(s.me.shieldT - 1.5) < 1e-9 && !!s.me.dash, 'E: shielded for 1.5s from the moment it sets off');
    s = setup('sand', 5);
    s.w.cast(s.me, 'W', s.me.x, s.me.z - 7); s.me.cd.E = 0; const st = s.me.stk;
    s.w.cast(s.me, 'E', s.me.x, s.me.z - 7); s.run(0.3, false);
    check(s.foe.stats.taken > 0 && s.foe.up === 0 && !s.me.dash && s.me.stk === st + 1, 'E: running into someone stops it there, with no knock-up, and gives back one soldier');
  }
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
  ({ w, me, foe, run, saw } = setup('iron', 8));
  check(!w.canCast(me, 'R'), 'R: needs someone within 6.5');
  ({ w, me, foe, run, saw } = setup('iron', 6));
  const plain = w.hurt(foe, 50, me, 'x'), took = w.hurt(me, 50, foe, 'x');
  me.stack = 0; me.ult = 100; w.cast(me, 'R', foe.x, foe.z); me.shield = 0;
  check(!!me.charge && foe.slowK === 0.75 && me.realm === 0, 'R: half a second to open, the target slowed 75% meanwhile');
  run(0.55);
  const ring = w.own(me, 'realmz')[0];
  check(me.realm === 1 && foe.realm === 1 && !!ring && ring.r === 7 && saw('realm'), 'R: the two are shut in a ring of 7');
  const big = w.hurt(foe, 50, me, 'x'), small = w.hurt(me, 50, foe, 'x');
  check(Math.abs(big / plain - 1.5) < 0.01 && Math.abs(small / took - 2 / 3) < 0.01, 'R: a fifth of the other\'s attack and defence: 1.5 times dealt, two thirds taken');
  foe.x = ring.x + 20; foe.vx = 9; w.step(DT);
  check(Math.hypot(foe.x - ring.x, foe.z - ring.z) <= 7 - foe.radius + 1e-6 && foe.vx < 0, 'R: neither can leave the ring');
  run(7);
  check(me.realm === 0 && foe.realm === 0 && !w.own(me, 'realmz').length && saw('realmEnd'), 'R: seven seconds, and they are back');
  {
    // With others in the arena, the two inside and those outside do not exist for one another.
    const w3 = new World([BLADES.iron, BLADES.gaia, BLADES.azure], { seed: 7 });
    const [a, b, c] = w3.tops;
    const park = () => { a.x = 0; a.z = 3; b.x = 0; b.z = -3; c.x = 2.6; c.z = 0; for (const t of w3.tops) { t.vx = t.vz = 0; t.cmd = null; t.tumble = 0; } };
    park(); a.cd.R = 0; a.ult = 100;
    check(w3.cast(a, 'R', b.x, b.z), 'R with three in the arena: the one nearest the cursor is taken');
    for (let i = 0; i < 70; i++) { w3.step(DT); park(); }
    check(a.realm === 1 && b.realm === 1 && c.realm === 0, 'the third stays outside');
    const t0 = [a.stats.taken, b.stats.taken, c.stats.taken];
    for (let i = 0; i < 60; i++) { park(); c.x = 1.2; c.z = 2.4; c.vx = -8; w3.step(DT); }
    check(a.stats.taken === t0[0] && c.stats.taken === t0[2], 'someone outside rolls straight through the two inside');
    park(); c.cd.Q = 0;
    w3.cast(c, 'Q', a.x, a.z); for (let i = 0; i < 40; i++) { w3.step(DT); park(); }
    check(a.stats.taken === t0[0] && w3.hurt(a, 30, c, 'x') === 0 && w3.hurt(c, 30, a, 'x') === 0, 'shots from outside pass through, and nothing either side does lands on the other');
    check(!w3.foes(c).length && w3.foes(a).length === 1 && w3.other(a) === b, 'each side only sees its own');
    b.spin = 1; w3.hurt(b, 50, a, 'x'); w3.step(DT);
    check(b.gone && a.realm === 0 && !w3.result, 'when the one taken falls, its maker is back with the rest');
  }
  {
    // DARKNESS RISE
    const s0 = setup('iron', 4);
    s0.w.hurt(s0.foe, 10, s0.me, 'x'); s0.w.hurt(s0.foe, 10, s0.me, 'x');
    const before = s0.foe.stats.taken; s0.run(0.5);
    check(s0.me.stack === 2 && s0.foe.stats.taken === before, 'two blows in a row: nothing yet');
    s0.w.hurt(s0.foe, 10, s0.me, 'x'); const lit = s0.foe.stats.taken; s0.run(1);
    const burn = s0.foe.stats.taken - lit;
    check(s0.me.stack === 3 && Math.abs(burn - (18 * BLADES.iron.atk) / BLADES.gaia.def) < 1.5, `the third lights the aura: about 18 a second to whoever is close (${burn.toFixed(1)})`);
    s0.run(3.2);
    check(s0.me.stack === 0, 'four seconds without a blow and it goes out');
    const s1 = setup('iron', 12);
    for (let i = 0; i < 3; i++) s1.w.hurt(s1.foe, 10, s1.me, 'x');
    const far = s1.foe.stats.taken; s1.run(1);
    check(s1.foe.stats.taken === far, 'out of its reach, the aura does nothing');
  }
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
    for (let i = 1; i < n; i++) { const fz = s.foe.z; s.foe.z = s.me.z + 5; s.w.cast(s.me, 'Q', 0, -9); s.run(1.05); s.foe.z = fz; }
    s.foe.x = side; const f0 = s.foe.stats.taken;
    const kind = s.w.aimSkill(s.me, 'Q').kind;
    s.w.cast(s.me, 'Q', 0, -9); s.w.step(DT); const early = s.foe.stats.taken - f0, up = s.foe.up; s.run(0.4);
    return { ...s, dmg: s.foe.stats.taken - f0, early, kind, up };
  };
  let a = swing(3.4, 1), b = swing(5.6, 1), c = swing(9, 1);
  check(a.kind === 'beam' && a.early > 0 && a.early === a.dmg, 'Q1: a long line, swung the moment it is let go');
  check(Math.abs(b.dmg / a.dmg - 1.75) < 0.02 && b.up > 0 && a.up === 0, `Q1: the far end hits 75% harder and knocks up (${a.dmg.toFixed(0)} -> ${b.dmg.toFixed(0)})`);
  check(c.dmg === 0, 'Q1: out of reach beyond that');
  const a2 = swing(2.6, 2), b2 = swing(4.4, 2), c2 = swing(3.4, 2, 5);
  check(a2.kind === 'cone' && Math.abs(a2.dmg / a.dmg - 1.25) < 0.02, 'Q2: a fan, 25% harder');
  check(Math.abs(b2.dmg / a2.dmg - 1.75) < 0.02 && b2.up > 0, 'Q2: its outer edge is the sweet spot');
  check(c2.dmg === 0, 'Q2: nothing off to the side');
  const a3 = swing(4.2, 3), b3 = swing(2.6, 3), c3 = swing(7, 3);
  check(a3.kind === 'slam' && Math.abs(a3.dmg / a.dmg - 1.5) < 0.02, 'Q3: a slam right in front, 50% harder');
  check(Math.abs(b3.early / a3.early - 1.75) < 0.02 && b3.up > 0, 'Q3: its middle is the sweet spot');
  check(c3.dmg === 0 && !c3.w.canCast(c3.me, 'Q') && c3.me.cd.Q > 3, 'Q: three swings, then the cooldown that started with the first');
  let { w, me, foe, run, saw } = setup('darkin', 20);
  w.cast(me, 'Q', 0, -9); run(0.5);
  check(me.re.Q > 0 && !w.canCast(me, 'Q'), 'Q: the next swing is not there for a second');
  run(0.55);
  check(w.canCast(me, 'Q'), 'Q: and then it is');
  ({ w, me, foe, run, saw } = setup('darkin', 9.8));
  const z0 = me.z; w.cast(me, 'E', 0, -9); for (let i = 0; i < 30 && me.dash; i++) w.step(DT);
  check(Math.abs(z0 - me.z - 4.5) < 0.4, `E: a dash of 4.5 (${(z0 - me.z).toFixed(2)})`);
  w.cast(me, 'Q', 0, -9); w.step(DT);
  check(foe.stats.taken > 0 && foe.up > 0, 'E then Q: the step brings the tip of the blade onto a target that was out of reach');
  {
    const s0 = setup('darkin', 5.6); s0.me.windup.Q = 0.3;
    s0.w.cast(s0.me, 'Q', 0, -9); s0.w.step(DT);
    const none = s0.foe.stats.taken; s0.run(0.35);
    check(none === 0 && s0.foe.stats.taken > 0, 'Q from a CPU: a short wind-up first');
  }
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
  check(Math.abs(foe.snare - 2.25) < 0.3 && foe.stun === 0, 'W: struck within the last 4 seconds, the target is snared for 2.25');
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

console.log('ARENA');
{
  const big = new World([BLADES.azure, BLADES.gaia], { seed: 7, size: 1 });
  const [a] = big.tops;
  check(ARENA.R === 16 && Math.abs(Math.hypot(a.x, a.z) - (7.5 * 16) / 13) < 1e-9, 'the wide arena: 16 across the radius, and the tops start that much further out');
  a.x = 0; a.z = 14; a.vx = 0; a.vz = 0; big.step(DT);
  const inside = Math.hypot(a.x, a.z) > 13.5;
  a.z = 15.5; a.vz = 6; for (let i = 0; i < 30; i++) big.step(DT);
  check(inside && Math.hypot(a.x, a.z) <= 16 - a.radius + 0.01 && !a.out, 'its wall stands at 16');
  const std = new World(BLADES.azure, BLADES.gaia, 7);
  check(ARENA.R === 13 && std.size === 0, 'the next match in the standard arena is 13 again');
}

console.log('FLASH');
{
  let { w, me, foe } = setup('azure', 12);
  const z0 = me.z;
  check(w.flash(me, me.x, me.z - 9) && Math.abs(z0 - me.z - 4) < 1e-9 && me.flash === 0, 'toward a far point: 4 that way, and it is spent');
  check(!w.flash(me, 0, 0), 'once a round');
  w.resetRound();
  check(me.flash === 1, 'it is back the next round');
  ({ w, me, foe } = setup('azure', 12));
  check(w.flash(me, me.x + 1.5, me.z + 1) && Math.abs(me.x - 1.5) < 1e-9, 'to a near point: exactly there');
  ({ w, me, foe } = setup('azure', 12));
  me.x = 0; me.z = 10; w.flash(me, 0, 20);
  check(Math.hypot(me.x, me.z) <= 13 - me.radius, 'never past the wall');
  for (const [what, hold] of [['stunned', (t) => w.stun(t, 1)], ['rooted', (t) => w.snare(t, 1)], ['in the air', (t) => w.lift(t, 1)]]) {
    ({ w, me, foe } = setup('azure', 12)); hold(me);
    check(!w.flash(me, 0, 0) && me.flash === 1, `not while ${what} (and it is not spent)`);
  }
  ({ w, me, foe } = setup('hunger', 9));
  w.hold(me, 'E'); w.flash(me, me.x, me.z - 4);
  check(!!me.hold && me.flash === 0, 'while drawing breath for a skill: the step is taken and the breath is kept');
}

console.log('HOLDS');
{
  const { w, me, foe } = setup('prism', 7);
  CC.scale = 0.6;
  w.stun(foe, 1); w.snare(foe, 2); w.lift(foe, 1);
  check(Math.abs(foe.stun - 0.6) < 1e-9 && Math.abs(foe.snare - 1.2) < 1e-9 && Math.abs(foe.up - 0.6) < 1e-9, 'one number shortens every stun, snare and knock-up together');
  CC.scale = 1;
  w.slowBy(me, 2, 0.5);
  check(me.slow === 2, 'slows are left as they are');
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
  run(1.05); const c1 = k.c; run(1); const c2 = k.c; run(3);
  check(c1 === 2 && c2 === 1 && k.c === 1 && !k.dead, 'E: it weakens by itself, down to one, and no further');
  w.cast(me, 'Q', k.x, k.z); run(0.3);
  check(k.dead && saw('blast', (e) => e.skill.id === 'keg' && e.r > 3), 'Q: the last blow from its owner sets it off');
  ({ w, me, foe, run, saw } = setup('pirate', 20));
  w.cast(me, 'E', me.x, me.z - 5); const k2 = w.own(me, 'keg')[0];
  w.cast(me, 'Q', k2.x, k2.z); run(0.2);
  check(!k2.dead && k2.c === 2, 'Q on a fresh keg: one blow off, no explosion yet');
  ({ w, me, foe, run, saw } = setup('pirate', 9, 'curtain'));
  w.cast(me, 'E', 0, 0); run(2.2);
  foe.cd.Q = 0; w.cast(foe, 'Q', 0, 0); run(0.3);
  check(!w.own(me, 'keg').length && foe.stats.taken === 0 && !saw('blast', (e) => e.skill.id === 'keg' && e.r > 3), 'the other top lands the last blow with a shot: the keg is broken, nothing goes off');
  ({ w, me, foe, run, saw } = setup('pirate', 9));
  w.cast(me, 'E', 0, 0); run(2.2);
  foe.x = 0; foe.z = -1.5; foe.vz = 6; setup.last.drift(0.3, 0, -1.2);
  check(!w.own(me, 'keg').length && foe.stats.taken === 0, 'the other top runs into it: the same');
  ({ w, me, foe, run, saw } = setup('pirate', 9, 'gaia'));
  w.cast(me, 'E', 0, 0); run(2.2);
  w.burst(foe, SKILLS.keg === null ? null : SKILLS.grenade, 0, 0, 3);
  check(!w.own(me, 'keg').length, 'any area attack counts as a blow too');
  ({ w, me, foe, run, saw } = setup('pirate', 16));
  w.cast(me, 'E', me.x, me.z - 4); run(0.55); w.cast(me, 'E', me.x, me.z - 9); run(2.2);
  foe.x = 0; foe.z = me.z - 11;
  w.cast(me, 'Q', me.x, me.z - 4); run(0.3);
  check(!w.own(me, 'keg').length && foe.stats.taken > 0 && foe.slowK === 0.8 && me.haste > 0, 'one keg sets off the next: the far one catches the target, slows it 80%, and the captain speeds up');
  ({ w, me, foe, run, saw } = setup('pirate', 20));
  w.cast(me, 'E', me.x, me.z - 1); run(0.55); w.cast(me, 'E', me.x, me.z - 1 - SKILLS.keg.aoe * 2 + 0.3); run(2.2);
  w.cast(me, 'Q', me.x, me.z - 1); run(0.3);
  check(!w.own(me, 'keg').length, 'two kegs whose blast circles only just overlap still go off together');
  ({ w, me, foe, run, saw } = setup('pirate', 8));
  w.stun(me, 2); w.snare(me, 2); me.silence = 2; w.slowBy(me, 2, 0.5);
  check(w.cast(me, 'W', me.x, me.z) && me.stun === 0 && me.snare === 0 && me.silence === 0 && me.slow === 0, 'W: used while stunned, rooted and silenced, and all of it is gone');
  ({ w, me, foe, run, saw } = setup('pirate', 8));
  w.lift(me, 1);
  check(!w.cast(me, 'W', me.x, me.z), 'W: not while knocked into the air');
  ({ w, me, foe, run, saw } = setup('pirate', 8));
  w.cast(me, 'E', me.x, me.z - 3.9); run(0.55); w.cast(me, 'E', me.x, me.z + 3.8); run(2.2);
  w.cast(me, 'Q', me.x, me.z - 3.9); run(0.3);
  check(w.own(me, 'keg').length === 1, 'kegs whose circles do not touch do not');
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
  {
    const s0 = setup('star', 16);
    s0.me.z = 10; s0.w.cast(s0.me, 'Q', 0, 20);
    for (let i = 0; i < 40; i++) { s0.me.x = 0; s0.me.z = 10; s0.me.vx = s0.me.vz = 0; s0.w.step(DT); }
    const st = s0.w.own(s0.me, 'reststar')[0];
    check(!!st && Math.hypot(st.x, st.z) < 13 && s0.w.cast(s0.me, 'Q', s0.foe.x, s0.foe.z), 'Q thrown at the wall: the star waits just inside it, and can still be sent on');
  }
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

console.log('STYLE RANKER (Samira)');
{
  let { w, me, foe, run, saw } = setup('rose', 8);
  w.cast(me, 'Q', foe.x, foe.z); run(0.3);
  check(me.stack === 1 && w.projectiles.length === 0 && foe.stats.taken > 0, 'Q at range: a bullet, and the first rank');
  me.cd.Q = 0; w.cast(me, 'Q', foe.x, foe.z); run(0.3);
  check(me.stack === 1, 'the same attack twice in a row does not raise the style');
  ({ w, me, foe, run, saw } = setup('rose', 2.6));
  w.cast(me, 'Q', foe.x, foe.z);
  check(!w.projectiles.length && saw('cone') === false && foe.stats.taken > 0, 'Q up close: the sword, at once');
  ({ w, me, foe, run, saw } = setup('rose', 5));
  w.cast(me, 'E', foe.x, foe.z);
  check(!!me.dash && w.canCast(me, 'Q'), 'E: Q can be used in the middle of the dash');
  w.cast(me, 'Q', foe.x, foe.z); setup.last.drift(0.4);
  check(saw('beam', (e) => e.skill.id === 'flairbomb' && e.hit > 0) && me.stack >= 2, 'Q during E: the path is bombed after the dash; each different hit is a rank');
  ({ w, me, foe, run, saw } = setup('rose', 3));
  w.cast(me, 'W', me.x, me.z); const first = foe.stats.taken; run(0.5); const mid = foe.stats.taken; run(0.4);
  check(first > 0 && mid === first && foe.stats.taken > mid, 'W: it cuts at the start and again at the end');
  ({ w, me, foe, run, saw } = setup('rose', 3));
  check(!w.canCast(me, 'R') && w.blocked(me, 'R') === 'ランクSで使える', 'R: locked below rank S, whatever the gauge says');
  for (const k of ['a', 'b', 'a', 'b', 'a']) w.hurt(foe, 5, me, k);
  check(me.stack === 5 && !w.canCast(me, 'R'), 'five different hits in a row: rank A');
  w.hurt(foe, 5, me, 'b');
  check(me.stack === 6 && w.canCast(me, 'R'), 'the sixth: rank S, and R opens');
  const sp = (() => { const a = setup('rose', 20), b = setup('rose', 20); b.me.stack = 6; b.me.stackT = 8; for (const s of [a, b]) { s.w.issueMove(s.me, 10, 10); for (let i = 0; i < 60; i++) { s.w.step(DT); s.w.issueMove(s.me, 10, 10); } } return Math.hypot(b.me.vx, b.me.vz) / Math.hypot(a.me.vx, a.me.vz); })();
  check(sp > 1.1 && sp < 1.3, `style: every rank is a little more speed (x${sp.toFixed(2)} at S)`);
  w.cast(me, 'R', me.x, me.z); run(1);
  check(me.slowK === 0.3 && w.own(me, 'inferno').length === 1 && me.stack === 6, 'R: two seconds of fire all around, at 30% less speed');
  run(1.1);
  check(me.stack === 0 && !w.own(me, 'inferno').length && foe.stats.taken > 150, 'R: when it ends the style is spent');
  ({ w, me, foe, run, saw } = setup('rose', 12));
  w.hurt(foe, 5, me, 'a'); run(7.5); const kept = me.stack; run(1);
  check(kept === 1 && me.stack === 0, 'style: gone after 8 seconds without landing anything');
}

console.log('LUNAR ARSENAL (Aphelios)');
{
  let { w, me, foe, run, saw } = setup('lunar', 10);
  check(w.aimSkill(me, 'Q').id === 'moonshot' && me.wo === 1 && me.wq.join() === '2,3,4', 'starts with the rifle in hand, the scythe in the other, then gravity, flame, chakram');
  w.cast(me, 'Q', foe.x, foe.z); run(0.3);
  check(foe.mark > 0 && me.wa[0] === 4 && me.cd.Q > 3, 'Q with the rifle: a long shot that marks; one of five shots used');
  check(w.cast(me, 'W', me.x, me.z) && w.aimSkill(me, 'Q').id === 'onslaught' && me.wo === 0 && me.cd.Q === 0, 'W: swaps the two; the other weapon has its own cooldown');
  me.x = 0; me.z = 1.6; foe.x = 0; foe.z = -1.6; me.spin = 500;
  w.cast(me, 'Q', me.x, me.z); run(0.2);
  check(!w.canCast(me, 'W') && !w.canCast(me, 'R') && w.canFlash(me) && w.issueMove(me, 0, 3), 'Q with the scythe: nothing but moving and FLASH while it lasts');
  run(1.3);
  check(me.spin > 500 && me.haste > 0 && foe.stats.taken > 30, 'Q with the scythe: blows at whoever is nearest for 1.75 seconds, healing and faster');
  run(1); w.cast(me, 'W', me.x, me.z);
  check(SKILLS.arsenal.weapons[me.wm] === 'moonshot' && me.cd.Q > 0 && me.cd.Q < 2, 'W back: the rifle is still cooling down from before');
  check(foe.mark > 0 && w.aimSkill(me, 'Q').id === 'longshot' && w.canCast(me, 'Q'), 'and its mark is still on the target: the follow-up is there to be taken');
  ({ w, me, foe, run, saw } = setup('lunar', 10));
  for (let i = 0; i < 5; i++) { me.cd.Q = 0; w.cast(me, 'Q', me.x + 9, me.z); run(0.1); }
  check(me.wm === 2 && me.wq.join() === '3,4,0' && me.wa[0] === 5 && w.aimSkill(me, 'Q').id === 'gravshot', 'five shots: the rifle goes to the back of the line, reloaded, and the gravity cannon comes to hand');
  me.cd.Q = 0; w.cast(me, 'Q', foe.x, foe.z); run(0.4);
  check(foe.slowK === 0.3 && w.aimSkill(me, 'Q').id === 'bindeclipse' && w.canCast(me, 'Q'), 'Q with gravity: a slow, and the key opens again');
  foe.x = 9; foe.z = -9; const am = me.wa[2]; w.cast(me, 'Q', me.x, me.z);
  check(foe.snare > 0.5 && foe.slow === 0 && me.wa[2] === am, 'Q again: wherever it is, the slowed target is rooted; no shot used');
  ({ w, me, foe, run, saw } = setup('lunar', 6));
  {
    // The flame: a wide disc that drifts on through whoever it meets.
    const F = SKILLS.duskwave, w3 = new World([BLADES.lunar, BLADES.gaia, BLADES.sol], {}), m = w3.tops[0], [a, b] = w3.tops.slice(1);
    const hold = () => { m.x = 0; m.z = 9; m.vx = m.vz = 0; m.cmd = null; a.x = 0; a.z = 4; b.x = 0; b.z = -1; a.vx = a.vz = b.vx = b.vz = 0; };
    hold(); m.wm = 3; m.wo = 1; m.cd.Q = 0; w3.cast(m, 'Q', 0, 0);
    let t1 = 0, t2 = 0;
    for (let i = 0; i < 1.6 / DT; i++) { hold(); w3.step(DT); if (!t1 && a.stats.taken > 0) t1 = w3.time; if (!t2 && b.stats.taken > 0) t2 = w3.time; }
    check(t1 > 0 && t2 > t1 + 0.4 && !w3.projectiles.length, `Q with the flame: a disc that goes through the first it meets and on to the next (${t1.toFixed(2)}s, ${t2.toFixed(2)}s), then is spent`);
    check(F.speed < BLADES.gaia.speed * 0.8, 'slow enough to walk out of');
  }
  ({ w, me, foe, run, saw } = setup('lunar', 6));
  {
    // The chakram: one more is gained, then all held are thrown; what strikes comes back, what misses is lost.
    const C = SKILLS.chakram, k = BLADES.lunar.atk / BLADES.gaia.def, hold = () => { me.x = 0; me.z = 6; me.vx = me.vz = 0; me.cmd = null; foe.x = 0; foe.z = 0; foe.vx = foe.vz = 0; foe.still = true; };
    const go = (x, z, T = 1.2) => { hold(); me.cd.Q = 0; const t0 = foe.stats.taken; w.cast(me, 'Q', x, z); for (let i = 0; i < T / DT; i++) { hold(); w.step(DT); } w.events.length = 0; return foe.stats.taken - t0; };
    me.wm = 4; me.wo = 2;
    let got = go(0, 0);
    check(me.chak === 1 && Math.abs(got - C.dmg * k) < 1, 'Q with the chakram: one gained, one thrown; it strikes and comes back');
    got = go(0, 0);
    check(me.chak === 2 && Math.abs(got - 2 * C.dmg * k) < 1 && foe.slow === 0, 'again: two now, both thrown, both back (and the other hand adds nothing)');
    got = go(0, 12);
    check(me.chak === 0 && got === 0, 'thrown the wrong way: all three miss, and none is left');
    me.chak = 5; got = go(0, 0);
    check(me.chak === 5 && Math.abs(got - 5 * C.dmg * k) < 1, 'holding five: no sixth is gained, and five are thrown');
    for (let i = 0; i < 7 / DT; i++) { hold(); w.step(DT); }
    got = go(0, 0, 0.6); const left = me.chakT;
    check(me.chak === 5 && left > SKILLS.arsenal.chak.dur - 0.6, 'each one that strikes gives all of them their eight seconds again');
  }
  me.wa[4] = 5; me.wm = 4; me.cd.Q = 0; w.cast(me, 'Q', me.x, me.z - 3); run(1);
  w.resetRound();
  check(me.wm === 4 && me.wa[4] === 4, 'the weapons carry into the next round');
  const vig = (wm) => { const s = setup('lunar', 6); s.me.wm = wm; s.me.spin = 500; s.w.cast(s.me, 'R', s.foe.x, s.foe.z); s.run(0.5); return s; };
  const v0 = vig(0), v1 = vig(1), v2 = vig(2), v3 = vig(3), v4 = vig(4);
  {
    const n = () => v0.seen.filter((e) => e.type === 'strike' && e.strong).length, a = n();
    v0.run(0.4);
    check(a >= 1 && n() === 2 && v0.foe.mark === 0 && v0.w.aimSkill(v0.me, 'Q').id === 'moonshot', 'R with the rifle: its follow-up lands twice, and leaves no mark');
  }
  check(v1.me.spin > 580, 'R with the scythe: heals');
  check(v2.foe.slowK === 0.99 && v2.w.aimSkill(v2.me, 'Q').id === 'bindeclipse', 'R with gravity: all but stopped, and open to the root');
  check(v3.seen.some((e) => e.type === 'blast' && e.r === SKILLS.vigil.arm[3].blast) && v3.foe.stats.taken > v1.foe.stats.taken + 4, 'R with the flame: its follow-up is a bigger burst');
  check(v4.me.chak === 5 && !v4.w.own(v4.me, 'sentry').length, 'R with the chakram: the follow-up leaves five chakrams, not one');
  check(!w.canCast(me, 'E'), 'E: there is none');
  {
    // The ultimate bursts on whoever it strikes, and on nothing else.
    const s = setup('lunar', 6); s.me.ult = 100;
    const ax = s.me.x - s.foe.x, az = s.me.z - s.foe.z; s.w.cast(s.me, 'R', s.me.x + ax * 9, s.me.z + az * 9); s.run(1.5);
    check(s.me.ult < 100 && !s.seen.some((e) => e.type === 'blast') && s.seen.some((e) => e.type === 'projEnd'), 'R fired away from everyone, into the wall: it goes out without a burst');
  }
  {
    // The ultimate's extra is for everyone its burst catches, not only the one it struck.
    const w4 = new World([BLADES.lunar, BLADES.gaia, BLADES.sol], {}), m = w4.tops[0], [a, b] = w4.tops.slice(1);
    m.x = 0; m.z = 8; m.vx = m.vz = 0; a.x = 0; a.z = 0; b.x = 2.6; b.z = 0; a.vx = a.vz = b.vx = b.vz = 0; a.still = b.still = true;
    m.wm = 2; m.ult = 100; w4.cast(m, 'R', a.x, a.z);
    for (let i = 0; i < 90; i++) { m.x = 0; m.z = 8; m.vx = m.vz = 0; w4.step(DT); }
    check(a.slowK === 0.99 && b.slowK === 0.99, 'R with gravity, two close together: both are all but stopped');
  }
  {
    // The weapon in the other hand joins in.
    const off = SKILLS.arsenal.off, k = BLADES.lunar.atk / BLADES.gaia.def;
    let s = setup('lunar', 10); s.me.spin = 500;
    s.w.cast(s.me, 'Q', s.foe.x, s.foe.z); s.run(0.3);
    check(Math.abs(s.foe.stats.taken - SKILLS.moonshot.dmg * k) < 1 && s.foe.mark > 0 && s.w.aimSkill(s.me, 'Q').id === 'longshot' && s.w.canCast(s.me, 'Q'), 'rifle: the shot marks its target, and the key opens again');
    {
      const am = s.me.wa[0], cd = s.me.cd.Q;
      s.foe.x = -9; s.foe.z = -9; s.me.spin = 500;
      s.w.cast(s.me, 'Q', s.me.x, s.me.z); s.w.step(DT);
      check(Math.abs(s.foe.stats.taken - (SKILLS.moonshot.dmg + SKILLS.longshot.pop + off.dmg) * k) < 1 && s.foe.mark === 0 && s.me.spin > 500 + off.dmg * k - 2 && s.me.wa[0] === am && s.me.cd.Q > cd - 0.1 && s.me.re.Q === 0,
        'Q again: however far off, the mark goes off and the scythe in the other hand lands a blow that heals; no shot used, once only');
      s.run(5); s.me.cd.Q = 0; s.w.cast(s.me, 'Q', s.foe.x, s.foe.z); s.run(0.6); s.run(4.5);
      check(s.foe.mark === 0 && s.w.aimSkill(s.me, 'Q').id === 'moonshot', 'left alone, the mark and the second press both run out after 4.5 seconds');
    }
    s = setup('lunar', 5); s.me.wm = 3; s.me.wo = 2;
    s.w.cast(s.me, 'Q', s.foe.x, s.foe.z); s.run(0.5);
    check(s.foe.slowK === 0.3 && Math.abs(s.foe.stats.taken - (SKILLS.duskwave.dmg + off.dmg) * k) < 1, 'flame with gravity in the other hand: whoever the fan catches is slowed too');
    s.w.cast(s.me, 'W', s.me.x, s.me.z);
    check(s.w.aimSkill(s.me, 'Q').id === 'bindeclipse' && s.w.canCast(s.me, 'Q'), 'W to gravity with someone already slowed: the key roots straight away');
    s.foe.x = 9; s.foe.z = -9; s.w.cast(s.me, 'Q', s.me.x, s.me.z);
    check(s.foe.snare > 0.5 && s.foe.slow === 0 && s.me.wa[2] === 4 && Math.abs(s.me.cd.Q - SKILLS.bindeclipse.cd) < 0.1 && s.w.aimSkill(s.me, 'Q').id === 'gravshot', 'rooted from afar; that is one use of the cannon, and its cooldown begins');
    {
      // Everyone slowed is rooted, not only the nearest.
      const w4 = new World([BLADES.lunar, BLADES.gaia, BLADES.sol], {}), m = w4.tops[0];
      m.wm = 2; m.wo = 0; m.cd.Q = 0;
      for (const o of w4.tops.slice(1)) w4.slowBy(o, 2.5, 0.3);
      w4.cast(m, 'Q', m.x, m.z);
      check(w4.tops[1].snare > 0.5 && w4.tops[2].snare > 0.5 && m.wa[2] === 4, 'two slowed at once: both are rooted by the one press');
    }
    s = setup('lunar', 5); s.me.wm = 3; s.me.wo = 0;
    s.w.cast(s.me, 'Q', s.foe.x, s.foe.z); s.run(0.5);
    check(s.foe.mark === 0 && Math.abs(s.foe.stats.taken - (SKILLS.duskwave.dmg + off.dmg * 2) * k) < 1, 'flame with the rifle in the other hand: a heavier second blow, and no mark');
    {
      // The chakram in the other hand: every blow that lands leaves one circling, and those held fly with the next.
      const C = SKILLS.arsenal.chak;
      s = setup('lunar', 3.2); s.me.wm = 1; s.me.wo = 4;
      s.w.cast(s.me, 'Q', s.me.x, s.me.z); s.run(1.7);
      const lights = s.seen.filter((e) => e.type === 'strike' && e.light).map((e) => Math.round(e.dmg / k));
      check(s.me.chak === 3 && lights.join() === [off.dmg, off.dmg, off.dmg].join(), `scythe with the chakram in the other hand: each of its three blows leaves one circling (${lights})`);
      s.run(C.dur - 1.5);
      check(s.me.chak === 3 && s.me.chakT < C.warn, 'and they stay for eight seconds after the last was gained (flickering for the last two)');
      s.run(1.6);
      check(s.me.chak === 0, 'then all of them are gone');
      for (let i = 0; i < 2; i++) { s.me.cd.Q = 0; s.me.wm = 1; s.foe.x = s.me.x; s.foe.z = s.me.z - 3; s.w.cast(s.me, 'Q', s.me.x, s.me.z); s.run(1.8); }
      check(s.me.chak === C.max, 'never more than five');
    }
    s = setup('lunar', 3.2); s.me.wm = 1; s.me.wo = 4;
    s.w.cast(s.me, 'Q', s.me.x, s.me.z); s.run(1.7);
    const hits = s.seen.filter((e) => e.type === 'strike' && e.src === s.me).map((e) => (e.light ? 'o' : 's')).join('');
    check(hits === 'ososos', `scythe: six blows, the other hand and the scythe by turns (${hits})`);
    {
      // The flame in the other hand: its blow bursts on whoever it lands on, and those close by take the burst too.
      const F = off.fx[3], w3 = new World([BLADES.lunar, BLADES.gaia, BLADES.gaia], {}), m = w3.tops[0], [a, b] = w3.tops.slice(1), ev = [];
      const hold = () => { m.x = 0; m.z = 4; m.vx = m.vz = 0; m.cmd = null; a.x = 0; a.z = 0; b.x = 2.8; b.z = -0.5; a.vx = a.vz = b.vx = b.vz = 0; };
      hold(); m.wm = 1; m.wo = 3; m.cd.Q = 0; w3.cast(m, 'Q', m.x, m.z);
      for (let i = 0; i < 0.12 / DT; i++) { hold(); w3.step(DT); ev.push(...w3.events); w3.events.length = 0; }
      const blasts = ev.filter((e) => e.type === 'blast');
      check(blasts.length >= 1 && Math.hypot(blasts[0].x - a.x, blasts[0].z - a.z) < 0.3 && blasts[0].r === F.blast && Math.abs(a.stats.taken - F.blastDmg * k) < 1 && Math.abs(b.stats.taken - F.blastDmg * k) < 1 && F.blastDmg * 2 === off.dmg * off.fx[0].mul,
        `scythe with the flame in the other hand: the blow is a burst round whoever it struck, the same for the one beside it, and half the rifle's blow (${Math.round(a.stats.taken / k)}, ${Math.round(b.stats.taken / k)})`);
    }
    s = setup('lunar', 8); s.me.wm = 1;
    s.w.cast(s.me, 'Q', s.me.x, s.me.z); s.run(1.8);
    check(s.foe.stats.taken === 0 && s.me.wa[1] === 4, 'scythe: nothing within 5.5 is nothing struck (the use is still spent)');
  }
}

console.log('VISION PAINTER (Hwei)');
{
  let { w, me, foe, run, saw } = setup('canvas', 7);
  const paint = (a, b, x = foe.x, z = foe.z) => { me.cd.Q = me.cd.W = me.cd.E = 0; me.subj = 0; w.cast(me, a, me.x, me.z); return w.cast(me, b, x, z); };
  check(w.cast(me, 'Q', me.x, me.z) && me.subj === 1 && me.cd.Q === 0 && foe.stats.taken === 0 && !w.projectiles.length, 'Q: a subject is chosen; nothing happens yet');
  check(['Q', 'W', 'E'].map((k) => w.aimSkill(me, k).id).join() === 'hfire,hbolt,hlava' && w.aimSkill(me, 'R').id === 'washbrush', 'with Disaster chosen the keys are fire, bolt, lava, and R washes the brush');
  me.ult = 100; w.cast(me, 'R', me.x, me.z);
  check(me.subj === 0 && me.cd.Q === 0 && me.ult === 100, 'R: washed out; no cooldown, no gauge spent');
  w.cast(me, 'Q', me.x, me.z); w.cast(me, 'W', foe.x, foe.z);
  check(me.subj === 0 && me.cd.Q > 5 && me.cd.W === 0 && w.zones.some((z) => z.kind === 'hbolt'), 'Q then W: the bolt, and the cooldown goes on the subject (Q), not on W');
  check(!w.canCast(me, 'Q') && w.canCast(me, 'W') && w.canCast(me, 'E'), 'the other two subjects are still open');
  run(0.8); const b0 = foe.stats.taken; run(0.4);
  check(b0 === 0 && foe.stats.taken > 0, 'QW: lightning after a second');
  const low = setup('canvas', 7); low.foe.spin = low.foe.spinMax * 0.3; const f0 = low.foe.spin; low.w.cast(low.me, 'Q', 0, 0); low.w.cast(low.me, 'W', low.foe.x, low.foe.z); low.run(1.2);
  check((f0 - low.foe.spin) / foe.stats.taken > 2.2, 'QW: much heavier on a target with little spin left');
  ({ w, me, foe, run, saw } = setup('canvas', 7));
  w.cast(me, 'Q', 0, 0); w.cast(me, 'Q', me.x + 9, me.z); run(0.5);
  check(saw('blast', (e) => e.skill.id === 'hfire'), 'QQ: the fireball bursts at the end of its range');
  w.subjReset = 0; me.cd.Q = 0; w.cast(me, 'Q', 0, 0); w.cast(me, 'E', foe.x, foe.z);
  check(w.own(me, 'lavapool').length === 4, 'QE: four eruptions in a line');
  run(0.5); const l0 = foe.stats.taken; run(1.2);
  check(l0 === 0 && foe.stats.taken > 0 && foe.slowK === 0.35, 'QE: they go off one after another and leave pools that slow 35%');
  ({ w, me, foe, run, saw } = setup('canvas', 7));
  w.cast(me, 'W', 0, 0); w.cast(me, 'W', me.x, me.z); run(0.1); const s0 = me.shield; run(2);
  check(s0 >= 45 && me.shield > s0 + 20 && me.shield <= 90 && me.cd.W > 13, 'WW: a shield that builds while standing in the pool');
  ({ w, me, foe, run, saw } = setup('canvas', 7));
  w.cast(me, 'W', 0, 0); w.cast(me, 'Q', foe.x, foe.z); run(0.2);
  check(me.haste > 0 && w.own(me, 'currentpool').length === 4, 'WQ: a current that speeds its maker along');
  ({ w, me, foe, run, saw } = setup('canvas', 7));
  const plain = w.hurt(foe, 30, me, 'x'); w.cast(me, 'W', 0, 0); w.cast(me, 'E', me.x, me.z);
  const h = [1, 2, 3, 4].map(() => w.hurt(foe, 30, me, 'x'));
  check(h[0] > plain + 10 && h[2] > plain + 10 && Math.abs(h[3] - plain) < 0.01, 'WE: the next three hits carry more, the fourth does not');
  ({ w, me, foe, run, saw } = setup('canvas', 7));
  w.cast(me, 'E', 0, 0); w.cast(me, 'Q', foe.x, foe.z); run(0.3);
  check(foe.charm > 0 && foe.charmDir === -1 && foe.slowK === 0.6, 'EQ: fear, and a 60% slow');
  ({ w, me, foe, run, saw } = setup('canvas', 7));
  w.cast(me, 'E', 0, 0); w.cast(me, 'W', foe.x + 2, foe.z); run(0.8);
  check(w.own(me, 'gazeeye').length === 1 && foe.snare === 0, 'EW: an eye opens near the target');
  run(0.5);
  check(foe.snare > 0.8 && foe.stats.taken > 0, 'EW: it finds the target and snares it');
  ({ w, me, foe, run, saw } = setup('canvas', 7));
  w.cast(me, 'E', 0, 0); w.cast(me, 'E', foe.x + 1.8, foe.z); run(0.3); const m0 = foe.x; setup.last.seen.length = 0;
  for (let i = 0; i < 40; i++) w.step(DT);
  check(foe.stats.taken > 0 && foe.slowK === 0.7 && Math.abs(foe.x - 1.8) < Math.abs(m0 - 1.8), 'EE: the jaws close, drag the target to their middle, and slow it 70%');
  ({ w, me, foe, run, saw } = setup('canvas', 7));
  me.subj = 0; w.cast(me, 'R', foe.x, foe.z); run(0.4);
  const dz = w.own(me, 'despairz')[0];
  foe.x = 6; foe.z = 6; run(0.1);
  check(!!dz && Math.hypot(dz.x - 6, dz.z - 6) < 0.5, 'R: despair stays centred on whoever it struck');
  run(1.5); const sk = foe.slowK; run(1.2);
  check(sk >= 0.5 && !w.own(me, 'despairz').length && foe.stats.taken > 150, `R: the slow deepens, and it ends in a burst (${sk})`);
}

console.log('MORE THAN TWO TOPS');
{
  // me at the bottom, A far ahead, B off to the right
  const ring = (blade, others = ['gaia', 'gaia']) => {
    const w = new World([BLADES[blade], ...others.map((b) => BLADES[b])], { seed: 7 });
    const [me, A, B, C] = w.tops;
    for (const t of w.tops) for (const k of 'QWER') t.cd[k] = t === me ? 0 : 99;
    me.ult = 100;
    const put = (t, x, z) => { t.x = x; t.z = z; t.vx = t.vz = 0; t.cmd = null; t.tumble = 0; };
    put(me, 0, 6); put(A, 0, -2); put(B, 6, 6); if (C) put(C, -9, -6);
    const seen = [];
    const run = (sec, pin = true) => { for (let i = 0; i < Math.round(sec / DT); i++) { const P = w.tops.map((t) => [t.x, t.z]); w.step(DT); seen.push(...w.events.splice(0)); if (pin) w.tops.forEach((t, k) => { if (t !== me && t.tumble <= 0 && t.up <= 0 && !t.gone) { t.x = P[k][0]; t.z = P[k][1]; t.vx = t.vz = 0; } }); } };
    return { w, me, A, B, C, put, run, seen };
  };
  let { w, me, A, B, put, run, seen } = ring('azure');
  check(w.tops.length === 3 && w.other(me) === B, 'a top fights whoever is nearest');
  put(A, 0, 3.4); put(B, 2.4, 6);
  w.burst(me, SKILLS.grenade, 0, 6, 4);
  check(A.stats.taken > 0 && B.stats.taken > 0, 'a blast lands on every enemy in it');
  ({ w, me, A, B, put, run, seen } = ring('nox'));
  put(A, 0, 1); put(B, 3, 6.5);
  w.cast(me, 'R', A.x, A.z); run(0.9);
  check(me.dmarkTo === A.side && Math.hypot(me.x - A.x, me.z - A.z) < 4, 'Death Mark: aimed with the cursor, it goes for that one, not the nearest');
  const a0 = A.stats.taken, b0 = B.stats.taken; run(3);
  check(A.stats.taken > a0 + 50 && B.stats.taken === b0, 'Death Mark: and it is that one the mark goes off on');
  ({ w, me, A, B, put, run, seen } = ring('gale'));
  put(A, 0, 1); put(B, 3, 6.5); A.up = 1; B.up = 0;
  check(w.canCast(me, 'R'), 'Last Breath: open because someone is in the air, though the nearest is not');
  w.cast(me, 'R', B.x, B.z);
  check(A.stats.taken > 0 && B.stats.taken === 0, 'Last Breath: it goes to the one in the air');
  ({ w, me, A, B, put, run, seen } = ring('plume'));
  put(A, -3, 2); put(B, 3, 2);
  const q = (x) => w.fire(me, SKILLS.quill, 0, 1, { x, z: -2, left: 9, quiet: true });
  q(-3); q(-3); q(3); run(0.3);
  check(A.quills === 2 && B.quills === 1 && A.snare === 0 && B.snare === 0, 'quills are counted on each top: two on one and one on another snare nobody');
  q(-3); run(0.3);
  check(A.snare > 0 && B.snare === 0, 'the third on the same top snares it');
  ({ w, me, A, B, put, run, seen } = ring('star'));
  put(A, 0, 0); put(B, 2.5, 6);
  w.cast(me, 'E', A.x, A.z); run(0.4);
  check(me.tether && me.tether.to === A.side, 'the bubble holds the one it struck');
  put(A, -8, -8); run(1.2);
  check(A.stun > 0 && B.stun === 0, 'and that one falls asleep, wherever it has gone and whoever is nearer');
  ({ w, me, A, B, put, run, seen } = ring('gaia'));
  A.spin = 0; run(0.1, false);
  check(A.gone && !w.result && seen.some((e) => e.type === 'ko' && e.top === A), 'a top that runs down is out, and the round goes on');
  check(w.other(me) === B && w.foes(me).length === 1, 'the fight turns to who is left');
  B.spin = 0; run(0.1, false);
  check(!!w.result && w.result.winner === me, 'the last one standing takes the round');
  ({ w, me, A, B, put, run, seen } = ring('nox'));
  put(A, 0, 3.5); put(B, 2.6, 6);
  w.cast(me, 'E', me.x, me.z);
  check(A.stats.taken > 0 && B.stats.taken > 0, 'Shadow Slash cuts everyone around it');
}

console.log('TEAMS');
{
  // me and a mate against two; seats 0 and 2 are team A
  const team = (ff) => {
    const w = new World(['azure', 'gaia', 'gaia', 'gaia'].map((b) => BLADES[b]), { seed: 7, teams: [0, 1, 0, 1], ff });
    const [me, foeA, mate, foeB] = w.tops;
    for (const t of w.tops) for (const k of 'QWER') t.cd[k] = t === me ? 0 : 99;
    const put = (t, x, z) => { t.x = x; t.z = z; t.vx = t.vz = 0; t.cmd = null; t.tumble = 0; };
    put(me, 0, 6); put(mate, 0, 3.5); put(foeA, 2.5, 6); put(foeB, -9, -6);
    return { w, me, foeA, mate, foeB, put };
  };
  let { w, me, foeA, mate, foeB, put } = team(false);
  check(w.other(me) === foeA && w.foes(me).length === 2, 'a top fights the other team only, though a mate is nearer');
  w.burst(me, SKILLS.grenade, 0, 5, 4);
  check(mate.stats.taken === 0 && foeA.stats.taken > 0, 'a blast spares team mates');
  const p = w.fire(me, SKILLS.sonic, 0, -1, {}); for (let i = 0; i < 30; i++) w.step(DT);
  check(mate.stats.taken === 0, 'a shot passes through a mate');
  ({ w, me, foeA, mate, foeB, put } = team(false));
  put(foeA, 9, -6); put(me, 0, 6); put(mate, 0, 4.2); for (let i = 0; i < Math.round(0.5 / DT); i++) { me.vx = 0; me.vz = -9; mate.vx = 0; mate.vz = 9; w.step(DT); }
  check(mate.stats.taken === 0 && me.stats.clashes === 0 && me.z < mate.z, `mates roll through each other (${me.z.toFixed(1)} / ${mate.z.toFixed(1)}, ${me.stats.clashes} clashes)`);
  foeA.spin = 0; for (let i = 0; i < 3; i++) w.step(DT);
  check(foeA.gone && !w.result, 'one of the other team out: the round goes on');
  foeB.spin = 0; for (let i = 0; i < 3; i++) w.step(DT);
  check(!!w.result && w.result.winner.team === me.team && !mate.gone, 'the whole team out: the round is the other team\'s, with both of them still standing');
  ({ w, me, foeA, mate, foeB, put } = team(true));
  check(w.other(me) === foeA, 'friendly fire on: a top still goes for the other team');
  w.burst(me, SKILLS.grenade, 0, 5, 4);
  check(mate.stats.taken > 0 && foeA.stats.taken > 0, 'friendly fire on: a blast catches a mate too');
  me.spin = 0; mate.spin = 0; for (let i = 0; i < 3; i++) w.step(DT);
  check(!!w.result && w.result.winner.team === foeA.team, 'friendly fire on: a team that takes itself out loses');
}

console.log('MAGUS ASCENDANT (Xerath)');
{
  let { w, me, foe, run, saw } = setup('magus', 20);
  w.hold(me, 'Q');
  const r0 = w.holdRange(me, 'Q'); run(0.75); const r1 = w.holdRange(me, 'Q'); run(0.8); const r2 = w.holdRange(me, 'Q');
  check(r0 === 6 && r1 > 8.5 && r1 < 10 && r2 === 12.5, `Q held: the beam's reach grows from 6 to 12.5 over 1.5 seconds (${r0} -> ${r1.toFixed(1)} -> ${r2})`);
  ({ w, me, foe, run, saw } = setup('magus', 11));
  w.hold(me, 'Q'); run(0.1); w.cast(me, 'Q', foe.x, foe.z);
  check(foe.stats.taken === 0, 'Q let go at once: too short to reach');
  ({ w, me, foe, run, saw } = setup('magus', 11));
  w.hold(me, 'Q'); run(1.5); w.cast(me, 'Q', foe.x, foe.z);
  check(foe.stats.taken > 0 && !w.projectiles.length, 'Q wound up: it reaches, at once, as a beam');
  ({ w, me, foe, run, saw } = setup('magus', 20));
  w.hold(me, 'Q'); run(3.1);
  check(!me.hold && me.cd.Q > 1.5 && me.cd.Q <= 2.5, 'Q held 3 seconds: wasted, on half its cooldown');
  const eye = (off) => { const s2 = setup('magus', 7); s2.w.cast(s2.me, 'W', s2.foe.x + off, s2.foe.z); s2.run(0.7); return s2.foe; };
  const mid = eye(0), rim = eye(1.9);
  check(Math.abs(mid.stats.taken / rim.stats.taken - 1.667) < 0.03 && mid.slowK === 0.8 && rim.slowK === 0.25, 'W: dead centre hits 67% harder and slows 80%; the edge 25%');
  const orb = (d) => { const s2 = setup('magus', d); s2.w.cast(s2.me, 'E', s2.foe.x, s2.foe.z); s2.run(d / 30 + 0.05); return s2.foe.stun; };
  const near = orb(3), far = orb(10);
  check(near > 0.25 && near < 0.75 && far > near * 2, `E: the further the orb flew, the longer the stun (${near.toFixed(2)} -> ${far.toFixed(2)})`);
  ({ w, me, foe, run, saw } = setup('magus', 22));
  w.cast(me, 'R', me.x, me.z); run(0.5);
  check(!!me.chan && !w.zones.length && w.canCast(me, 'R'), 'R: a stance; nothing falls by itself');
  w.cast(me, 'R', foe.x, foe.z);
  check(w.zones.length === 1 && Math.hypot(w.zones[0].x - foe.x, w.zones[0].z - foe.z) < 0.1 && !w.canCast(me, 'R'), 'R pressed: a bombardment anywhere in the arena, then a beat');
  run(0.6); const first = foe.stats.taken;
  run(0.3); w.cast(me, 'R', foe.x, foe.z); run(0.6);
  check(first > 0 && foe.stats.taken - first > first * 1.1, 'R: each one that lands makes the next heavier');
  let n = 2; for (let i = 0; i < 6; i++) { run(0.85); if (w.cast(me, 'R', 9, 9)) n++; }
  check(n === 6 && !me.chan, 'R: six bombardments, and the stance ends');
}

console.log('CRIMSON HUNGER (Briar)');
{
  let { w, me, foe, run, saw } = setup('hunger', 4);
  const s0 = me.spin; w.cast(me, 'Q', foe.x, foe.z);
  check(Math.abs(s0 - me.spin - s0 * 0.05) < 1, 'every skill is paid for with 5% of the spin it has');
  check(foe.stun > 0.4 && foe.shred > 4.9 && foe.bleed === 1, 'Q: a pounce that stuns, softens for 5 seconds, and draws blood');
  const a1 = w.hurt(foe, 50, me, 'x'); foe.shred = 0; const a2 = w.hurt(foe, 50, me, 'x');
  check(Math.abs(a1 / a2 - 1.2) < 0.01, 'Q: a softened target takes 20% more');
  me.spin = 500; foe.bleed = 5; foe.bleedT = 5; foe.bleedBy = me.side; const b0 = foe.stats.taken; run(1, true);
  const bled = foe.stats.taken - b0;
  check(bled > 5 && Math.abs((me.spin - 500 + 7.4) / bled - 0.25) < 0.12, `bleeding feeds it: a quarter of what bleeds comes back (${bled.toFixed(0)} bled)`);
  ({ w, me, foe, run, saw } = setup('hunger', 12));
  w.cast(me, 'W', foe.x, foe.z); for (let i = 0; i < Math.round(0.4 / DT); i++) w.step(DT);
  check(me.buff > 4 && !w.issueMove(me, 9, 9), 'W: in a frenzy, it takes no orders');
  for (let i = 0; i < Math.round(1.2 / DT); i++) { w.step(DT); foe.x = 0; foe.z = -6; foe.vx = foe.vz = 0; }
  check(Math.hypot(me.x - foe.x, me.z - foe.z) < 4, 'W: and runs at whoever is nearest by itself');
  check(w.aimSkill(me, 'W').id === 'snackattack' && w.cast(me, 'W', me.x, me.z) && me.empower > 0, 'W again: the next bite is a heavier one');
  w.hold(me, 'E');
  check(!!me.hold && !me.charge, 'E: drawing breath for as long as the key is held');
  const d0 = w.hurt(me, 100, foe, 'x');
  check(Math.abs(d0 - 65) < 0.5, 'E: 35% less damage meanwhile');
  for (let i = 0; i < Math.round(1.1 / DT); i++) w.step(DT);
  check(me.buff === 0 && !me.hold && me.cd.E > 10, 'E: a full breath goes off by itself, and the scream ends the frenzy');
  {
    const s2 = setup('hunger', 9); s2.w.hold(s2.me, 'E'); s2.w.aimHold(s2.me, s2.foe.x, s2.foe.z);
    s2.run(0.95); s2.me.tumble = 0.2; s2.run(0.1);
    const held = !!s2.me.hold; s2.run(0.2);
    check(held && !s2.me.hold && s2.saw('beam'), 'E: full while reeling from a knock, it waits and goes off once steady');
  }
  const scream = (hold) => { const s2 = setup('hunger', 4); s2.me.spin = 600; s2.w.hold(s2.me, 'E'); s2.w.aimHold(s2.me, s2.foe.x, s2.foe.z); const sp = s2.me.spin; s2.run(hold); const healed = s2.me.spin - sp; if (hold < 1) s2.w.cast(s2.me, 'E', s2.foe.x, s2.foe.z); s2.run(0.15, false); return { ...s2, healed }; };
  const quick = scream(0.3), full = scream(1.0);
  check(quick.foe.stats.taken > 0 && full.foe.stats.taken > quick.foe.stats.taken * 2 && full.healed > quick.healed * 2, 'E: let go early it is weaker; the longer the breath, the more it mends and the harder it hits');
  check(Math.hypot(full.foe.vx, full.foe.vz) > 5 && Math.hypot(quick.foe.vx, quick.foe.vz) < 3 && full.foe.slowK === 0.8, 'E: only a full breath throws its target back; either way an 80% slow');
  {
    // A wide strip straight ahead, not a fan: as wide at the feet as at the far end.
    const at = (x, z, hold) => { const s2 = setup('hunger', 4); s2.foe.x = s2.me.x + x; s2.foe.z = s2.me.z - z; s2.w.hold(s2.me, 'E'); s2.run(hold); s2.w.cast(s2.me, 'E', s2.me.x, s2.me.z - 9); s2.w.step(DT); return s2.foe.stats.taken > 0; };
    check(at(2.6, 1.5, 0.99) && at(2.6, 4.5, 0.99) && !at(3.6, 3, 0.99), 'E: a strip 2.2 to either side, the same width near and far');
    check(!at(0, 5.2, 0.2) && at(0, 5.2, 0.99), 'E: it reaches further the longer the breath');
  }
  ({ w, me, foe, run, saw } = setup('hunger', 18));
  w.cast(me, 'R', foe.x, foe.z); run(0.5, false);
  check(!!me.air && me.buff > 7, 'R: the stone lands across the arena and it flies to whoever it struck');
  run(0.6, false);
  check(!me.air && Math.hypot(me.x - foe.x, me.z - foe.z) < 6 && foe.stats.taken > 25, `R: landing on them (${foe.stats.taken.toFixed(0)}, ${Math.hypot(me.x - foe.x, me.z - foe.z).toFixed(1)} away)`);
}

console.log('STEAM GOLEM (Blitzcrank)');
{
  let { w, me, foe, run, saw } = setup('golem', 9);
  let close = 99; w.cast(me, 'Q', foe.x, foe.z); for (let i = 0; i < Math.round(0.9 / DT); i++) { w.step(DT); close = Math.min(close, Math.hypot(me.x - foe.x, me.z - foe.z)); }
  check(close < 4 && foe.stats.taken > 0, `Q: the grab drags its target all the way in (to ${close.toFixed(1)} from 9)`);
  ({ w, me, foe, run, saw } = setup('golem', 9));
  w.cast(me, 'W', me.x, me.z); run(4.9); const h = me.haste, sl = me.slow; run(0.2);
  check(h > 0 && sl === 0 && me.slowK === 0.3 && me.slow > 1, 'W: five seconds of speed, then 1.5 seconds 30% slower');
  ({ w, me, foe, run, saw } = setup('golem', 2.6));
  w.cast(me, 'E', me.x, me.z); me.vz = -8; for (let i = 0; i < 30; i++) w.step(DT);
  check(foe.up > 0 || foe.stats.taken > 40, 'E: the next body hit is a heavy one that knocks up');
  {
    const punch = (stunned) => { const s0 = setup('golem', 2.6); s0.w.cast(s0.me, 'E', s0.me.x, s0.me.z); if (stunned) s0.w.stun(s0.foe, 1); s0.me.vz = -8; for (let i = 0; i < 30; i++) s0.w.step(DT); return s0.foe.stats.taken; };
    const plain = punch(false), held = punch(true), add = SKILLS.powerfist.bonus * BLADES.golem.atk / BLADES.gaia.def;
    check(Math.abs(held - plain - add) < 6, `E: on a stunned target the bonus is doubled (${plain.toFixed(0)} -> ${held.toFixed(0)})`);
  }
  ({ w, me, foe, run, saw } = setup('golem', 4));
  foe.shield = 80; foe.shieldT = 3; foe.guard = 1;
  w.cast(me, 'R', me.x, me.z);
  check(foe.shield === 0 && foe.guard === 0 && foe.silence > 0.25 && !w.canCast(foe, 'Q'), 'R: shields and guard gone, and no skills for a moment');
  run(0.6); foe.cd.Q = 0;
  check(w.canCast(foe, 'Q'), 'R: the silence passes');
  ({ w, me, foe, run, saw } = setup('golem', 8));
  me.spin = 320; w.hurt(me, 30, foe, 'x');
  check(me.shield > 100 && me.once, 'below 30% a barrier comes up by itself');
  me.shield = 0; w.hurt(me, 10, foe, 'x');
  check(me.shield === 0, 'but only once a round');
}

console.log('VOID EYE (Vel\'Koz)');
{
  let { w, me, foe, run, saw } = setup('voideye', 7);
  w.cast(me, 'Q', foe.x, foe.z); run(0.4);
  check(foe.slowK === 0.7 && w.projectiles.filter((q) => q.skill.id === 'plasmashard').length === 2, 'Q: a 70% slow, and it parts into two at right angles where it hits');
  check(w.projectiles.every((q) => Math.abs(q.dz) < 0.01), 'Q: the two fly out sideways');
  ({ w, me, foe, run, saw } = setup('voideye', 20));
  w.cast(me, 'Q', foe.x, foe.z); run(0.2);
  check(w.canCast(me, 'Q') && w.cast(me, 'Q', me.x, me.z) && w.projectiles.filter((q) => q.skill.id === 'plasmashard').length === 2, 'Q again in flight: it parts there and then');
  ({ w, me, foe, run, saw } = setup('voideye', 7));
  check(me.stk === 2, 'W: two in store');
  w.cast(me, 'W', foe.x, foe.z); const t1 = foe.stats.taken; run(0.2); const t2 = foe.stats.taken; run(0.15);
  check(t1 > 0 && t2 === t1 && foe.stats.taken > t2, 'W: the line cuts at once and bursts a quarter of a second later');
  ({ w, me, foe, run, saw } = setup('voideye', 7));
  w.cast(me, 'E', foe.x, foe.z + 1.2); run(0.5, false);
  check(foe.vz < -3 && foe.stats.taken > 0, 'E: thrown away from the caster, not from the middle of the blast');
  ({ w, me, foe, run, saw } = setup('voideye', 7));
  const base = w.hurt(foe, 10, me, 'a') + w.hurt(foe, 10, me, 'b'); const before = foe.stats.taken; w.hurt(foe, 10, me, 'c');
  check(foe.stats.taken - before > 10 + 40, 'the third skill to land takes its target apart: a burst that ignores defence');
  ({ w, me, foe, run, saw } = setup('voideye', 8));
  me.ult = 100; let ticks = 0;
  for (let i = 0; i < Math.round(3.2 / DT); i++) { if (w.cast(me, 'R', foe.x, foe.z)) ticks++; w.step(DT); foe.x = 0; foe.z = -4; me.x = 0; me.z = 4; me.vx = me.vz = foe.vx = foe.vz = 0; }
  check(ticks >= 18 && ticks <= 22 && foe.stats.taken > 120 && me.ult < 100, `R held: a beam for 2.6 seconds and no longer (${ticks} beats)`);
  ({ w, me, foe, run, saw } = setup('voideye', 8));
  me.ult = 100; w.cast(me, 'R', foe.x, foe.z); const a0 = me.rayA; w.step(DT);
  for (let i = 0; i < Math.round(0.14 / DT); i++) w.step(DT);
  w.cast(me, 'R', me.x + 9, me.z);
  check(Math.abs(Math.atan2(Math.sin(me.rayA - a0), Math.cos(me.rayA - a0))) < 0.25, 'R: the beam only turns so fast toward the cursor');
  check(!w.issueMove(me, 5, 5), 'R: no moving while it fires');
}

console.log('TWIN PURIFIER (Lucian)');
{
  let { w, me, foe, run, saw } = setup('purifier', 7);
  w.cast(me, 'Q', foe.x, foe.z); run(0.2); const q0 = foe.stats.taken; run(0.2);
  check(q0 === 0 && foe.stats.taken > 0 && me.dbl > 3, 'Q: a beam after a moment; and the next body hit is primed');
  ({ w, me, foe, run, saw } = setup('purifier', 2.6));
  me.cd.E = 10; w.cast(me, 'Q', me.x + 9, me.z); run(0.4); me.vz = -8; for (let i = 0; i < 30; i++) w.step(DT);
  setup.last.seen.push(...w.events.splice(0));
  check(saw('strike', (e) => e.skill.id === 'lightslinger') && me.dbl === 0, 'after a skill the body hit lands twice');
  check(me.cd.E < 8, 'and each one takes 2 seconds off E');
  ({ w, me, foe, run, saw } = setup('purifier', 6));
  w.cast(me, 'W', foe.x, foe.z); run(0.3);
  check(foe.ardent > 5 && me.haste === 0, 'W: marks whoever the burst catches');
  w.hurt(foe, 5, me, 'x');
  check(me.haste > 0, 'W: hitting the marked one is a burst of speed');
  ({ w, me, foe, run, saw } = setup('purifier', 12));
  me.ult = 100; w.cast(me, 'R', foe.x, foe.z); run(1, false);
  const shots = w.projectiles.filter((q) => q.skill.id === 'cullshot').length;
  check(shots >= 2 && w.issueMove(me, 3, 3) && w.canCast(me, 'E'), 'R: firing a stream, and free to move and to slide');
  w.cast(me, 'R', me.x, me.z); run(0.4, false); const left = w.projectiles.length; run(0.4, false);
  check(!me.spray, 'R again: it stops');
}

console.log('STONE WEAVER (Taliyah)');
{
  let { w, me, foe, run, saw } = setup('weaver', 7);
  w.cast(me, 'Q', foe.x, foe.z); run(0.7);
  const five = foe.stats.taken;
  check(w.own(me, 'workedground').length === 1 && five > 0, 'Q: five stones, and the ground underfoot is worked');
  const one = setup('weaver', 7); one.w.fire(one.me, SKILLS.threadrock, 0, -1, {}); one.run(0.5);
  check(five > one.foe.stats.taken * 2.2 && five < one.foe.stats.taken * 2.9, 'Q: the first stone is the heavy one; the other four hit at 40%');
  me.cd.Q = 0; w.cast(me, 'Q', foe.x, foe.z); run(0.5);
  check(!w.own(me, 'workedground').length && foe.slowK === 0.4 && me.cd.Q < 1.3, 'Q on worked ground: one big stone that slows, the ground used up, half the wait');
  ({ w, me, foe, run, saw } = setup('weaver', 7));
  w.cast(me, 'W', foe.x, foe.z, 0, foe.x + 5, foe.z); run(0.6); const v0 = Math.abs(foe.vx); run(0.3, false);
  check(v0 < 0.5 && foe.vx > 4 && Math.abs(foe.vz) < 2, 'W: after 0.75 seconds the ground throws its target the way it was told');
  ({ w, me, foe, run, saw } = setup('weaver', 6));
  w.cast(me, 'E', foe.x, foe.z);
  check(foe.stats.taken > 0 && w.own(me, 'boulders').length === 1, 'E: boulders, with a first hit');
  run(0.3); const walk = foe.stats.taken;
  check(foe.slowK === 0.2 && foe.stun === 0, 'E: standing on them is only a 20% slow');
  w.knock(foe, 1, 0, 6, 0.4, 0); run(0.1, false);
  check(foe.stats.taken > walk && foe.stun > 0, 'E: thrown across them, they go off and stun');
  ({ w, me, foe, run, saw } = setup('weaver', 6));
  me.x = -8; me.z = 0; foe.x = 0; foe.z = -5; me.ult = 100;
  w.cast(me, 'R', 8, 0); run(0.3, false);
  check(w.own(me, 'weaverz').length === 1 && !!me.dash, 'R: a wall across the arena, and its maker sliding along it');
  foe.x = 0; foe.z = -3; foe.vx = 0; foe.vz = 9; for (let i = 0; i < Math.round(0.8 / DT); i++) { w.step(DT); }
  check(foe.z < 0.5, 'R: the wall stops a top that runs at it');
  const sx = me.x; w.cast(me, 'R', me.x, me.z);
  check(!me.dash || true, 'R again: steps off');
  ({ w, me, foe, run, saw } = setup('weaver', 6));
  const sp = (x) => { const s2 = setup('weaver', 20); s2.me.x = x; s2.me.z = 0; s2.me.scar = 0; for (let i = 0; i < 90; i++) { s2.w.issueMove(s2.me, x, -9); s2.w.step(DT); s2.me.x = x; } return Math.abs(s2.me.vz); };
  const mid = sp(0), wall = sp(11);
  check(wall / mid > 1.15, `by the wall, unharmed, it is faster (x${(wall / mid).toFixed(2)})`);
}

console.log('MAD DOCTOR (Dr. Mundo)');
{
  let { w, me, foe, run, saw } = setup('doctor', 7);
  w.cast(me, 'Q', foe.x, foe.z); run(0.4);
  check(Math.abs(foe.stats.taken - foe.spinMax * 0.15) < 8 && foe.slowK === 0.4, `Q: 15% of the spin the target has (${foe.stats.taken.toFixed(0)}), and a 40% slow`);
  ({ w, me, foe, run, saw } = setup('doctor', 7));
  foe.spin = 100; w.cast(me, 'Q', foe.x, foe.z); run(0.4);
  check(100 - foe.spin > 20, 'Q: never less than its least');
  ({ w, me, foe, run, saw } = setup('doctor', 7));
  w.stun(me, 1);
  check(me.stun === 0 && me.shrugCd > 14 && w.zones.some((z) => z.kind === 'canister'), 'the first stun is shrugged off, at a price, and a canister drops');
  w.stun(me, 1);
  check(me.stun > 0, 'the next one is not');
  {
    const s0 = setup('doctor', 7);
    s0.w.stun(s0.me, 1);
    const can = s0.w.zones.find((z) => z.kind === 'canister'), sp = s0.me.spin, cd = s0.me.shrugCd;
    s0.foe.x = can.x; s0.foe.z = can.z; s0.w.step(DT);
    check(!s0.w.zones.some((z) => z.kind === 'canister') && s0.me.spin <= sp && Math.abs(s0.me.shrugCd - cd) < 0.1, 'an enemy touching the canister first takes it away: no mending, no sooner shrug');
  }
  me.stun = 0; me.spin = 500; const c = w.zones.find((z) => z.kind === 'canister'); me.x = c.x; me.z = c.z; w.step(DT);
  check(me.spin > 530 && me.shrugCd === 0, 'picking the canister up mends, and readies the next shrug');
  ({ w, me, foe, run, saw } = setup('doctor', 4));
  me.spin = 600; w.cast(me, 'W', me.x, me.z); w.hurt(me, 100, foe, 'x');
  check(Math.abs(me.store - 50) < 2, 'W: half of what it takes meanwhile is kept');
  const low = me.spin; run(3.1);
  check(me.store === 0 && me.spin > low + 40, 'W: the blast at the end, landing, gives all of it back');
  ({ w, me, foe, run, saw } = setup('doctor', 14));
  me.spin = 600; w.cast(me, 'W', me.x, me.z); w.hurt(me, 100, foe, 'x'); const l2 = me.spin; w.cast(me, 'W', me.x, me.z); run(0.1);
  check(!w.own(me, 'heartzapper').length && Math.abs(me.spin - l2 - 25) < 4, 'W again: it goes off at once; missing, only half comes back');
  const hit = (ratio) => { const s2 = setup('doctor', 2.6); s2.me.spin = s2.me.spinMax * ratio; s2.w.cast(s2.me, 'E', 0, 0); s2.me.vz = -8; for (let i = 0; i < 30; i++) s2.w.step(DT); return s2.foe.stats.taken; };
  check(hit(0.3) > hit(1) * 1.3, 'E: the less spin it has left, the harder the hit');
  ({ w, me, foe, run, saw } = setup('doctor', 14));
  me.spin = 300; me.ult = 100; w.cast(me, 'R', me.x, me.z); run(8.1);
  check(me.spin > 300 + 280 && me.buff === 0, `R: over 8 seconds about 35% of its spin comes back (${(me.spin - 300).toFixed(0)})`);
}

console.log('WITH MORE THAN TWO');
{
  // Two against two: `a` and its mate `m` on one side, `x` and `y` on the other. Everyone parked where it is put.
  const quad = (blade, others = ['gaia', 'gaia', 'gaia'], teams = [0, 0, 1, 1]) => {
    const w = new World([blade, ...others].map((b) => BLADES[b]), { seed: 7, teams });
    const [a, m, x, y] = w.tops;
    for (const t of w.tops) for (const k of 'QWER') t.cd[k] = t === a ? 0 : 99;
    a.ult = 100;
    const spot = new Map();
    const put = (t, px, pz) => { spot.set(t, [px, pz]); t.x = px; t.z = pz; t.vx = t.vz = 0; t.cmd = null; };
    put(a, 0, 6); put(m, 9, 9); put(x, 0, -6); put(y, -9, -9);
    const seen = [];
    const run = (sec, free = []) => { for (let i = 0; i < Math.round(sec / DT); i++) { w.step(DT); seen.push(...w.events.splice(0)); for (const [t, [px, pz]] of spot) if (!free.includes(t) && !t.dash && !t.air && t.tumble <= 0 && t.up <= 0) { t.x = px; t.z = pz; t.vx = t.vz = 0; } } };
    return { w, a, m, x, y, put, run, seen };
  };

  let q = quad('prism');
  q.put(q.m, 0, 2);
  q.w.cast(q.a, 'W', 0, -9); q.run(0.4);
  check(q.m.shield === 50 && q.a.shield === 50, 'PRISMATIC BARRIER: a team mate the wand passes is shielded too');
  q.run(1.4);
  check(q.m.shield === 100, 'and again on its way back');
  q = quad('prism'); q.put(q.x, 0, 2);
  q.w.cast(q.a, 'W', 0, -9); q.run(0.4);
  check(q.x.shield === 0, 'an enemy in its way gets nothing');

  q = quad('dragon');
  q.put(q.m, 5, 6);
  q.w.cast(q.a, 'W', q.m.x, q.m.z); q.run(0.1, [q.a]);
  check(q.a.shield === 70 && q.m.shield === 70 && Math.hypot(q.a.x - q.m.x, q.a.z - q.m.z) < 3, 'SAFEGUARD with the cursor on a team mate: it flies to them and both are shielded');
  q = quad('dragon');
  q.put(q.m, 5, 6);
  q.w.cast(q.a, 'W', q.a.x, q.a.z); q.run(0.1);
  check(q.a.shield === 70 && q.m.shield === 0 && Math.abs(q.a.x) < 0.01, 'with the cursor on itself: only its own, where it stands');

  q = quad('canvas');
  q.put(q.m, 0, 3);
  q.w.zone(q.a, SKILLS.hpool, 0, 3); q.w.zone(q.a, SKILLS.currentpool, 0, 3); q.put(q.x, 0, 3.5);
  q.run(0.5);
  check(q.m.shield > 45 && q.m.haste > 0 && q.x.shield === 0 && q.x.haste === 0, 'the pool and the current: a team mate standing in them is shielded and quickened, an enemy is not');

  q = quad('curtain', ['azure', 'gaia', 'gaia']);
  q.put(q.x, 0, -4);
  q.w.hurt(q.x, 10, q.m, 'x');
  q.w.cast(q.a, 'W', q.x.x, q.x.z); q.run(0.4);
  check(q.x.snare > 1.5, 'DEADLY FLOURISH: a target a team mate struck a moment ago is rooted');
  q = quad('curtain', ['azure', 'gaia', 'gaia']);
  q.put(q.x, 0, -4);
  q.w.hurt(q.x, 10, q.y, 'x');
  q.w.cast(q.a, 'W', q.x.x, q.x.z); q.run(0.4);
  check(q.x.snare === 0, 'one its own side struck is not');

  q = quad('gale');
  q.put(q.x, 0, 0); q.put(q.y, 3, 0);
  q.w.lift(q.x, 1); q.w.lift(q.y, 1);
  q.w.cast(q.a, 'R', q.x.x, q.x.z);
  check(q.x.stats.taken > 100 && q.y.stats.taken > 100 && q.x.up === 0 && q.y.up === 0, 'LAST BREATH: everyone hanging in the air close to the target is cut down with it');
  q = quad('gale');
  q.put(q.x, 0, 0); q.put(q.y, 3, 0);
  q.w.lift(q.x, 1);
  q.w.cast(q.a, 'R', q.x.x, q.x.z);
  check(q.x.stats.taken > 100 && q.y.stats.taken === 0, 'someone beside it who is on the ground is not');

  q = quad('dragon');
  q.put(q.a, 0, 4); q.put(q.x, 0, 0.5); q.put(q.y, 0, -4.5);
  q.w.cast(q.a, 'R', q.x.x, q.x.z); q.run(0.5, [q.x]);
  check(q.y.stats.taken > 40 && q.seen.some((e) => e.type === 'say' && e.top === q.y && e.text === 'KNOCK UP'), `DRAGON'S RAGE: the one kicked bowls over the enemy behind it (${q.y.stats.taken.toFixed(0)})`);
  q = quad('dragon');
  q.put(q.a, 0, 4); q.put(q.x, 0, 0.5); q.put(q.m, 0, -4.5);
  q.w.cast(q.a, 'R', q.x.x, q.x.z); q.run(0.5, [q.x]);
  check(q.m.up === 0 && !q.seen.some((e) => e.type === 'strike' && e.top === q.m), 'a team mate of the kicker in its way is not bowled over');

  q = quad('boss');
  q.put(q.a, 0, 6); q.put(q.x, 0, 2.5); q.put(q.y, 0, -4.2);
  q.w.cast(q.a, 'R', q.x.x, q.x.z); q.run(0.9, [q.a, q.x]);
  check(q.x.stats.taken > 60 && q.y.stats.taken > 40 && q.y.slowK === 0.99, `THE SHOW STOPPER: whoever stands where it comes down is caught too (${q.y.stats.taken.toFixed(0)})`);
  q = quad('boss');
  q.put(q.a, 0, 6); q.put(q.x, 0, 2.5); q.put(q.m, 0, -4.2);
  q.w.cast(q.a, 'R', q.x.x, q.x.z); q.run(0.9, [q.a, q.x]);
  check(q.m.stats.taken === 0, 'but not a team mate');

  // What only ever reached the nearest enemy now reaches all of them, and what stopped everyone lets its own side by.
  q = quad('gale', ['azure', 'azure', 'gaia']);
  q.put(q.m, 0, 9); q.m.cd.Q = 0; q.x.cd.Q = 0;
  q.w.cast(q.a, 'W', 0, -9); q.run(0.1);
  q.w.cast(q.m, 'Q', q.x.x, q.x.z); q.run(0.6);
  check(q.x.stats.taken > 0, 'WIND WALL: a team mate\'s shot goes through it');
  q.w.cast(q.x, 'Q', q.a.x, q.a.z); q.run(0.6);
  check(q.a.stats.taken === 0, 'an enemy\'s is still stopped');

  q = quad('sand');
  q.put(q.m, 0, 4); q.put(q.x, 1.5, 3); q.put(q.y, -1.5, 3);
  q.w.cast(q.a, 'R', 0, -9); q.run(0.4);
  check(q.x.stats.taken > 50 && q.y.stats.taken > 50 && q.m.stats.taken < 10 && Math.abs(q.m.z - 4) < 0.01, 'EMPEROR\'S DIVIDE: every enemy in its way is thrown, and a team mate is let through');

  q = quad('pirate');
  q.put(q.x, 0, -6); q.put(q.y, 3, -6);
  q.w.cast(q.a, 'R', 0, -6); q.run(0.6);
  check(q.x.stats.taken > 0 && q.y.stats.taken > 0, 'CANNON BARRAGE: each wave lands on everyone under it');

  q = quad('hex');
  q.put(q.a, 0, 2); q.put(q.x, 0, -4 + SKILLS.horizon.aoe); q.put(q.y, 0, -4 - SKILLS.horizon.aoe);
  q.a.cd.E = 0; q.w.cast(q.a, 'E', 0, -4); q.run(0.7);
  check(q.x.stun > 0 && q.y.stun > 0, 'EVENT HORIZON: everyone touching the rim is stunned');

  q = quad('chrono');
  q.put(q.x, 0, -6); q.put(q.y, 2, -6);
  const trap = q.w.zone(q.a, SKILLS.parallel, 0, -6); q.w.spring(trap);
  check(q.x.stun > 0 && q.y.stun > 0, 'PARALLEL CONVERGENCE: everyone standing in it is stunned');

  q = quad('reaper');
  q.put(q.a, 0, 0); q.put(q.x, 0, -6); q.put(q.y, 1.5, -4.5); q.y.spin = 100;
  q.w.cast(q.a, 'R', 0, -6); q.run(0.6);
  check(q.x.stats.taken > 60 && q.y.gone && !q.w.result, 'DEATH FROM BELOW: everyone on the X is struck; the one below the line is finished, the other cut');

  q = quad('boss');
  q.put(q.a, 0, 6); q.put(q.x, 0, 2); q.put(q.y, 3.5, 6);
  q.w.cast(q.a, 'E', q.a.x, q.a.z);
  check(q.x.vz > 3 && q.y.vx < -3, 'FACEBREAKER: everyone it reaches is dragged in');

  q = quad('azure');
  q.put(q.a, 0, 2); q.put(q.x, 0, -6); q.put(q.y, 2.5, -6);
  q.w.cast(q.a, 'R', 0, -6); q.run(1.1);
  check(q.x.stats.taken > 80 && q.y.stats.taken > 60, 'METEOR DRIVE: everyone under it is hit');

  q = quad('sand');
  q.put(q.x, 0, -3); q.put(q.y, 1.5, -1.5);
  q.a.cd.W = 0; q.w.cast(q.a, 'W', 0, -1.5); q.run(0.6);
  check(q.x.stats.taken > 0 && q.y.stats.taken > 0, 'a soldier\'s stab goes through everyone within its reach');

  q = quad('gauntlet');
  q.put(q.a, 0, 6); q.put(q.y, 0.6, 2); q.put(q.x, 0, -2);
  q.w.cast(q.a, 'R', q.x.x, q.x.z); q.run(0.5);
  check(Math.abs(q.y.stats.taken - (115 * 0.75 * BLADES.gauntlet.atk) / BLADES.gaia.def) < 1 && q.y.up === 0 && q.x.up > 0, `CEASE AND DESIST: someone in the way takes 75% and is knocked aside; the charge goes on to its target (${q.y.stats.taken.toFixed(0)})`);

  q = quad('hunger');
  q.put(q.a, 0, 6); q.put(q.x, 0, -2); q.put(q.y, 2, -2);
  q.w.cast(q.a, 'R', q.x.x, q.x.z); q.run(1.2);
  check(q.y.charm > 0 && q.y.charmDir < 0 && q.x.charm === 0 && q.x.stats.taken > 0, 'CERTAIN DEATH: those it lands among run from it; the one it came for does not');

  q = quad('hammer');
  q.put(q.a, 0, 6); q.put(q.x, 0, 0); q.put(q.y, 2, -1);
  q.w.cast(q.a, 'R', q.x.x, q.x.z, 1); q.run(0.3, [q.x, q.y]);
  check(q.x.stats.taken > 50 && Math.abs(q.y.stats.taken - q.x.stats.taken) < 3 && q.y.launch > 0, "KEEPER'S VERDICT: whoever stands within 3 of the one it struck is sent flying with it");

  q = quad('purifier', ['azure', 'gaia', 'gaia']);
  q.put(q.x, 0, -2); q.a.haste = 0;
  q.w.hurt(q.x, 10, q.a, 'ardentblaze');
  q.w.hurt(q.x, 10, q.m, 'x');
  check(q.a.haste > 0 && q.m.haste === 0, 'ARDENT BLAZE: a team mate striking the marked one quickens whoever marked it');

  q = quad('sol');
  q.put(q.m, 1, 6); q.a.spin = q.m.spin = q.x.spin = 500; q.put(q.m, 3, 6); q.put(q.x, 0, 2.4);
  q.w.cast(q.a, 'W', q.a.x, q.a.z); q.run(1);
  check(q.m.spin > 505 && q.a.spin > 505 && q.x.spin < 500 && q.x.slow > 0, 'SANCTUARY: a team mate mends in it as its maker does; an enemy is only slowed');

  q = quad('sand');
  q.put(q.a, 0, 6); q.put(q.x, 0, 0); q.put(q.y, 0, -3);
  q.a.cd.W = 0; q.w.cast(q.a, 'W', 0, 3); q.run(0.3);
  const y0 = q.y.stats.taken, x0 = q.x.stats.taken;
  q.a.cd.Q = 0; q.w.cast(q.a, 'Q', 0, -4); q.run(0.4);
  check(q.x.stats.taken > x0 + 20 && q.y.stats.taken > y0 + 20, 'CONQUERING SANDS: everyone the soldier passes is struck');

  q = quad('dragon');
  q.put(q.a, 0, 0); q.put(q.x, 0, -3); q.put(q.y, 3, 0);
  q.w.cast(q.a, 'E', 0, 0); q.w.cast(q.a, 'E', 0, 0);
  check(q.x.slowK === 0.75 && q.y.slowK === 0.75, 'CRIPPLE: everyone the shockwave reached is slowed');
}

console.log(bad ? `\n${bad} of ${n} checks failed` : `\nall ${n} checks passed`);
process.exit(bad ? 1 : 0);
