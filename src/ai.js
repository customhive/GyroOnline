// CPU opponent. Thinks at a fixed cadence set by the difficulty, then issues
// the same move orders and skill casts a player can. It works from whatever
// kit its blade has, so every skill needs an entry in `offence` or `defence`.
import { ARENA, KEYS, SKILLS, skillOf } from './config.js';
import { intercept, predictAt, targetable, spinRatio } from './sim.js';

export class CpuBrain {
  constructor(world, me, level) {
    this.world = world;
    this.me = me;
    this.foe = world.other(me);
    this.level = level;
    this.t = 0.6 + world.rng() * 0.4;
    this.dodged = new Set();
    this.keyOf = {};
    for (const k of KEYS) this.keyOf[skillOf(me, k).id] = k;
  }

  jitter(p, scale = 1) {
    const r = this.world.rng, e = this.level.aimErr * scale;
    return { x: p.x + (r() * 2 - 1) * e, z: p.z + (r() * 2 - 1) * e };
  }

  has(id) { const k = this.keyOf[id]; return k && this.world.canCast(this.me, k); }
  use(id, x = this.me.x, z = this.me.z) { return this.world.cast(this.me, this.keyOf[id], x, z); }

  // Get out of a circle on the floor: guard, blink or dash if it is about to
  // land, otherwise just steer away.
  escape(cx, cz, radius, timeLeft) {
    const { world: w, me, level: L } = this;
    let mx = me.x - cx, mz = me.z - cz;
    const md = Math.hypot(mx, mz);
    if (md > radius + 1.5 || w.rng() > L.dodge + 0.1) return false;
    if (md < 0.1) { mx = -me.x || 1; mz = -me.z; } // dead centre: head for the middle
    const n = Math.hypot(mx, mz) || 1;
    mx /= n; mz /= n;
    if (timeLeft < 0.3 && this.has('aegis')) return this.use('aegis');
    if (timeLeft < 0.6 && this.has('phantom')) return this.use('phantom', me.x + mx * 6, me.z + mz * 6);
    if (timeLeft < 0.7 && this.has('blitz')) return this.use('blitz', me.x + mx * 9, me.z + mz * 9);
    w.issueMove(me, cx + mx * (radius + 4), cz + mz * (radius + 4));
    return true;
  }

  defence(d) {
    const { world: w, me, foe, level: L } = this;
    const r = w.rng;
    for (const p of w.projectiles) {
      if (p.owner === me || this.dodged.has(p.id)) continue;
      const rx = me.x - p.x, rz = me.z - p.z;
      const along = rx * p.dx + rz * p.dz;
      const side = rx * -p.dz + rz * p.dx;
      if (along < 0 || along > p.left || Math.abs(side) > 2.6) continue;
      this.dodged.add(p.id);
      if (r() > L.dodge) continue;
      const s = side >= 0 ? 1 : -1;
      if (along / p.speed < 0.28 && this.has('aegis')) return this.use('aegis');
      if (along / p.speed < 0.3 && this.has('phantom')) return this.use('phantom', me.x - p.dz * s * 6, me.z + p.dx * s * 6);
      w.issueMove(me, me.x - p.dz * s * 4.5, me.z + p.dx * s * 4.5);
      return true;
    }
    for (const z of w.zones) {
      if (z.owner !== me && z.kind === 'quake' && this.escape(z.x, z.z, z.r, z.T - z.t)) return true;
    }
    if (foe.air && this.escape(foe.air.tx, foe.air.tz, SKILLS.meteor.aoe, foe.air.T - foe.air.t)) return true;
    if (foe.charge && this.escape(foe.x, foe.z, SKILLS.nova.aoe, foe.charge.T - foe.charge.t)) return true;
    // Being drained: break the link by getting away.
    if (foe.tether && r() < L.dodge) {
      const k = d || 1;
      const ax = me.x - ((foe.x - me.x) / k) * 9, az = me.z - ((foe.z - me.z) / k) * 9;
      if (this.has('blitz')) return this.use('blitz', ax, az);
      if (this.has('phantom')) return this.use('phantom', ax, az);
      w.issueMove(me, ax, az);
      return true;
    }
    if (this.has('aegis') && d < 7 && r() < L.dodge && (foe.dash || foe.empower > 0 && d < 4)) return this.use('aegis');
    if (this.has('aegis') && foe.cast && foe.cast.skill.id === 'blitz' && d < 8 && r() < L.dodge * 0.7) return this.use('aegis');
    return false;
  }

  offence(d) {
    const { world: w, me, foe, level: L } = this;
    const r = w.rng;
    if (!targetable(foe)) return false;
    const want = (bonus = 0) => r() < L.cast + bonus;
    const guarded = foe.guard > 0;

    // Ultimates first.
    if (this.has('meteor') && !guarded && d < SKILLS.meteor.range + 2 && want(foe.tumble > 0 ? 0.3 : 0)) {
      const p = this.jitter(predictAt(foe, me, SKILLS.meteor.air * 0.85), 0.8);
      return this.use('meteor', p.x, p.z);
    }
    if (this.has('nova') && d < SKILLS.nova.aoe - 1.6 && want(foe.tumble > 0 ? 0.4 : 0)) return this.use('nova');
    if (this.has('eclipse') && d < SKILLS.eclipse.range - 2 && want(0.1)) return this.use('eclipse');
    if (guarded) return false;

    if (this.has('blitz') && d > 3 && d < SKILLS.blitz.dist + 1 && want()) {
      const p = this.jitter(intercept(me.x, me.z, foe, me, SKILLS.blitz.speed, me.windup[this.keyOf.blitz]), 0.6);
      return this.use('blitz', p.x, p.z);
    }
    if (this.has('sonic') && d < SKILLS.sonic.range - 1 && want()) {
      const p = this.jitter(intercept(me.x, me.z, foe, me, SKILLS.sonic.speed, me.windup[this.keyOf.sonic]));
      return this.use('sonic', p.x, p.z);
    }
    // Step in close, so the empowered hit that follows actually connects.
    if (this.has('phantom') && d > 3.5 && d < SKILLS.phantom.range + 2.5 && want(-0.15)) {
      const p = predictAt(foe, me, 0.25);
      const k = Math.hypot(p.x - me.x, p.z - me.z) || 1;
      return this.use('phantom', me.x + ((p.x - me.x) / k) * (k - 2.2), me.z + ((p.z - me.z) / k) * (k - 2.2));
    }
    if (this.has('anchor') && d > 4.5 && d < SKILLS.anchor.range - 1 && want()) {
      const p = this.jitter(intercept(me.x, me.z, foe, me, SKILLS.anchor.speed, me.windup[this.keyOf.anchor]));
      return this.use('anchor', p.x, p.z);
    }
    if (this.has('quake') && d < SKILLS.quake.range + 1 && want(foe.tumble > 0.3 || foe.slow > 0.5 ? 0.3 : 0)) {
      const p = this.jitter(predictAt(foe, me, SKILLS.quake.delay + me.windup[this.keyOf.quake]), 0.7);
      return this.use('quake', p.x, p.z);
    }
    if (this.has('flare') && d < SKILLS.flare.range - 0.8 && want(0.15)) {
      const p = this.jitter(predictAt(foe, me, 0.08 + me.windup[this.keyOf.flare]), 0.5);
      return this.use('flare', p.x, p.z);
    }
    if (this.has('satellite') && d < 9 && want()) return this.use('satellite');
    if (this.has('sanctuary') && spinRatio(me) < 0.82 && want(-0.1)) return this.use('sanctuary');
    if (this.has('aegis') && d < 3.4 && r() < L.cast * 0.25) return this.use('aegis');
    return false;
  }

  update(dt) {
    const { world: w, me, foe, level: L } = this;
    if (w.result || me.out || me.air || me.blink || me.charge || me.spin <= 0) return;
    this.t -= dt;
    if (this.t > 0) return;
    this.t = L.think * (0.7 + w.rng() * 0.6);
    const r = w.rng;
    const dx = foe.x - me.x, dz = foe.z - me.z;
    const d = Math.hypot(dx, dz);

    if (this.defence(d)) return;
    if (this.offence(d)) return;

    // --- movement ----------------------------------------------------------
    if (me.tumble > 0 || me.dash || me.cast) return;
    const rr = Math.hypot(me.x, me.z);
    if (me.launch > 0 && rr > ARENA.R - 4) { w.issueMove(me, me.x * 0.3, me.z * 0.3); return; }
    if (foe.guard > 0 && d < 6) { w.issueMove(me, me.x - (dx / d) * 5, me.z - (dz / d) * 5); return; }
    // Stay on the healing ground while it lasts, unless the fight is elsewhere.
    const own = w.zones.find((z) => z.owner === me && z.kind === 'sanctuary');
    if (own && spinRatio(me) < 0.95 && r() < 0.7) {
      if (Math.hypot(me.x - own.x, me.z - own.z) > own.r * 0.6) w.issueMove(me, own.x, own.z);
      return;
    }
    // Do not walk into the other side's sanctuary just to be slowed.
    const theirs = w.zones.find((z) => z.owner === foe && z.kind === 'sanctuary');
    if (theirs && Math.hypot(foe.x - theirs.x, foe.z - theirs.z) < theirs.r && r() < L.dodge * 0.6) return;
    if (!targetable(foe)) return;
    // Press when behind; when the spin lead is ours anyway, let the clock work.
    const lead = spinRatio(me) - spinRatio(foe);
    const chase = L.chase + (lead < -0.1 ? 0.15 : 0) + (me.empower > 0 || me.orbs ? 0.35 : 0) + (me.tether ? 0.3 : 0);
    if (r() < chase) {
      const p = predictAt(foe, me, Math.min(0.5, d / 20));
      w.issueMove(me, p.x, p.z);
    }
  }
}
