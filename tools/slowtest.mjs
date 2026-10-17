import assert from 'node:assert/strict';
import { BLADES } from '../src/config.js';
import { makeTop, moveTop, spinRatio, World } from '../src/sim.js';
const dt = 1 / 120;
function top(manual = false, pct = 0.5) {
  const t = makeTop(0, BLADES.iron);
  Object.assign(t, { x: -6, z: 0, vx: 16, vz: 12, slow: 2, slowK: pct });
  if (manual) t.cmd = { x: 8, z: 8, t: 2 };
  return t;
}
const speed = t => Math.hypot(t.vx, t.vz);
for (const manual of [false, true]) for (const pct of [0.2, 0.5, 0.8, 0.99]) {
  const t = top(manual, pct);
  const limit = t.blade.speed * (manual ? 1.2 : 1) * (1 - pct);
  moveTop(t, dt, null);
  assert(Math.abs(speed(t) - limit) < 1e-9, 'Immediate cap at stated slow rate');
  for (let i = 0; i < 40; i++) {
    moveTop(t, dt, null);
    assert(speed(t) <= limit + 1e-9, 'Movement stays capped without repeatedly multiplying velocity');
  }
  t.slow = t.slowK = 0;
  for (let i = 0; i < 30; i++) moveTop(t, dt, null);
  assert(speed(t) > limit, 'Normal acceleration resumes after slow');
}
// Compare with the same steering calculation exempted from the final cap.
{
  const a = top(), b = top(); b.drag = 0.1;
  moveTop(a, dt, null); moveTop(b, dt, null);
  assert(Math.abs(a.vx * b.vz - a.vz * b.vx) < 1e-9, 'Cap preserves direction');
}
for (const field of ['tumble', 'drag', 'launch']) {
  const t = top(); t[field] = 0.5;
  moveTop(t, dt, null);
  assert(speed(t) > 15, field + ' is exempt from cap');
  t[field] = 0;
  moveTop(t, dt, null);
  assert(speed(t) <= 6.25 + 1e-9, 'Cap starts after forced movement ends');
}
for (const field of ['dash', 'blink']) {
  const a = top(), b = top(); b.slow = 0;
  for (const t of [a, b]) t[field] = { dx: 1, dz: 0, speed: 30, t: 0.3, skill: {} };
  moveTop(a, dt, null); moveTop(b, dt, null);
  assert.deepEqual([a.x, a.z, a.vx, a.vz], [b.x, b.z, b.vx, b.vz], 'Special movement unaffected');
}
{
  const t = top(true); t.spin = t.spinMax / 2; t.haste = 1;
  moveTop(t, dt, null);
  const limit = t.blade.speed * 1.2 * (0.55 + 0.45 * spinRatio(t)) * 0.5 * 1.3;
  assert(Math.abs(speed(t) - limit) < 1e-9, 'Cap respects spin and haste');
}
console.log('Slow speed caps OK: manual/automatic, rates, direction, expiry, forced movement, dash/blink, spin and haste');

const w = new World(BLADES.iron, BLADES.gaia, 7);
{
  const t = top(); t.slow = 0; t.vx = 4; t.vz = 2;
  w.slowBy(t, 1, 0.5);
  assert.deepEqual([t.vx, t.vz], [2, 1], 'Slow onset reduces velocity even below cap');
  for (let i = 0; i < 60; i++) w.slowBy(t, 1, 0.5);
  assert.deepEqual([t.vx, t.vz], [2, 1], 'Refresh does not compound');
  w.slowBy(t, 2, 0.3);
  assert.deepEqual([t.vx, t.vz], [2, 1], 'Weaker slow does not brake again');
  w.slowBy(t, 1, 0.8);
  assert(Math.abs(t.vx - 0.8) < 1e-9 && Math.abs(t.vz - 0.4) < 1e-9, 'Stronger slow uses multiplier ratio');
  t.slow = 0; w.slowBy(t, 1, 0.5);
  assert(Math.abs(t.vx - 0.4) < 1e-9, 'A new slow after expiry brakes again');
  w.slowBy(t, 1, 1); w.slowBy(t, 1, 1);
  assert.equal(speed(t), 0, 'Full slow and refresh remain finite');
}
for (const field of ['tumble', 'drag', 'launch', 'dash', 'blink', 'air', 'out']) {
  const t = top(); t.slow = 0;
  t[field] = ['tumble', 'drag', 'launch'].includes(field) ? 0.5 : { skill: {} };
  w.slowBy(t, 1, 0.5);
  assert.deepEqual([t.vx, t.vz], [16, 12], field + ' is exempt from initial braking');
  assert.equal(t.slowK, 0.5, 'Slow still recorded during special movement');
}
console.log('Slow onset OK: below-cap velocity, refreshes, stronger/weaker effects, expiry, full slow, forced movement exemptions');

