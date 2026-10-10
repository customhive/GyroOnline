// CPU opponent. Thinks at a fixed cadence set by the difficulty, then issues
// the same move orders and skill casts a player can. It works from whatever
// kit its blade has, so every skill needs an entry in `offence`, `defence`
// or `reflex`.
import { ARENA, KEYS, SKILLS, skillOf } from './config.js';
import { intercept, predictAt, targetable, spinRatio, rooted, wallOf } from './sim.js';

// Blades that fight from range back off when the other top gets this close.
const KEEP_AWAY = { curtain: 7.5, gear: 6.5, frost: 5.5, sand: 5, prism: 7, canvas: 6.5, star: 7, lunar: 7.5, arcane: 7, hex: 6.5, cosmos: 5.5, pirate: 5, spark: 5.5, fox: 5 };

export class CpuBrain {
  constructor(world, me, level) {
    this.world = world;
    this.me = me;
    this.foe = world.other(me);
    this.level = level;
    this.t = 0.6 + world.rng() * 0.4;
    this.quick = 0;
    this.dodged = new Set();
    this.keyOf = {};
    for (const k of KEYS) this.keyOf[skillOf(me, k).id] = k;
  }

  jitter(p, scale = 1) {
    const r = this.world.rng, e = this.level.aimErr * scale;
    return { x: p.x + (r() * 2 - 1) * e, z: p.z + (r() * 2 - 1) * e };
  }

  has(id) { const k = this.keyOf[id]; return k && this.world.canCast(this.me, k); }
  // The skill's recast window is open (so `use` would fire its second stage).
  again(id) { const k = this.keyOf[id]; return !!k && this.me.re[k] > 0; }
  use(id, x = this.me.x, z = this.me.z) { return this.world.cast(this.me, this.keyOf[id], x, z); }

  // Fire a straight shot where the target will be.
  shoot(id, S = SKILLS[id], err = 1) {
    const { me, foe } = this;
    const p = this.jitter(intercept(me.x, me.z, foe, me, S.speed, me.windup[this.keyOf[id]]), err);
    return this.use(id, p.x, p.z);
  }

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
    for (const id of ['blitz', 'valor', 'sweep']) if (timeLeft < 0.7 && this.has(id)) return this.use(id, me.x + mx * 9, me.z + mz * 9);
    if (timeLeft < 0.7 && this.has('distort') && !this.again('distort')) return this.use('distort', me.x + mx * 8, me.z + mz * 8);
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
      if (along > 4 && this.has('windwall')) return this.use('windwall', p.x, p.z);
      if (along / p.speed < 0.3 && this.has('phantom')) return this.use('phantom', me.x - p.dz * s * 6, me.z + p.dx * s * 6);
      w.issueMove(me, me.x - p.dz * s * 4.5, me.z + p.dx * s * 4.5);
      return true;
    }
    for (const z of w.zones) {
      if (z.owner === me) continue;
      const S = z.skill;
      if ((z.kind === 'quake' || z.kind === 'grenade' || S.kind === 'blast') && this.escape(z.x, z.z, z.r, z.T - z.t)) return true;
      if (S.kind === 'field' && (S.dps || S.slowIn || S.endDmg) && Math.hypot(me.x - z.x, me.z - z.z) < z.r + 0.5 && this.escape(z.x, z.z, z.r, S.endDmg ? z.T - z.t : 9)) return true;
      if (z.kind === 'lotus' && z.c && this.escape(z.x, z.z, z.r, S.fuse - (z.t - z.a))) return true;
      // Ground that hurts or slows: walk out of it.
      if ((z.kind === 'blizzard' || z.kind === 'glue' || z.kind === 'poison') && Math.hypot(me.x - z.x, me.z - z.z) < z.r + 0.5 && this.escape(z.x, z.z, z.r, 9)) return true;
      if (z.kind === 'divide' && wallOf(z).moving && r() < L.dodge) {
        const wl = wallOf(z), side = -(me.x - wl.x) * wl.nz + (me.z - wl.z) * wl.nx;
        if (Math.abs(side) < S.wall + 1.5) { const s = side >= 0 ? 1 : -1; w.issueMove(me, me.x - wl.nz * s * 6, me.z + wl.nx * s * 6); return true; }
      }
    }
    if (foe.air && foe.air.skill.aoe && this.escape(foe.air.tx, foe.air.tz, foe.air.skill.aoe, foe.air.T - foe.air.t)) return true;
    if (foe.charge && foe.charge.skill.kind === 'beam') {
      // A beam is being lined up: step out of its lane.
      const c = foe.charge, side = -(me.x - foe.x) * c.dz + (me.z - foe.z) * c.dx;
      if (Math.abs(side) < c.skill.radius + 2 && r() < L.dodge) { const s = side >= 0 ? 1 : -1; w.issueMove(me, me.x - c.dz * s * 5, me.z + c.dx * s * 5); return true; }
    } else if (foe.charge && this.escape(foe.x, foe.z, foe.charge.skill.aoe, foe.charge.T - foe.charge.t)) return true;
    // Under fire from a channelled barrage: get out of the line.
    if (foe.chan && r() < L.dodge) {
      const s = (me.x - foe.x) * -foe.chan.dz + (me.z - foe.z) * foe.chan.dx >= 0 ? 1 : -1;
      w.issueMove(me, me.x - foe.chan.dz * s * 5, me.z + foe.chan.dx * s * 5);
      return true;
    }
    // Being drained or chained: break the link by getting away.
    if (foe.tether && r() < L.dodge) {
      const k = d || 1;
      const ax = me.x - ((foe.x - me.x) / k) * 9, az = me.z - ((foe.z - me.z) / k) * 9;
      if (this.has('blitz')) return this.use('blitz', ax, az);
      if (this.has('phantom')) return this.use('phantom', ax, az);
      w.issueMove(me, ax, az);
      return true;
    }
    if (this.has('aegis') && d < 7 && r() < L.dodge && (foe.dash || foe.empower > 0 && d < 4)) return this.use('aegis');
    if (this.has('aegis') && foe.cast && foe.cast.skill.aim === 'dash' && d < 8 && r() < L.dodge * 0.7) return this.use('aegis');
    if (this.has('icewall') && foe.dash && d > 3 && d < 9 && r() < L.dodge * 0.6) return this.use('icewall', (me.x + foe.x) / 2, (me.z + foe.z) / 2);
    if (this.has('valor') && foe.dash && d < 6 && r() < L.dodge * 0.5) return this.use('valor', me.x - (foe.x - me.x), me.z - (foe.z - me.z));
    return false;
  }

  // Second stages that depend on split-second timing. Checked every step
  // rather than at the thinking cadence, with a reaction delay of its own.
  reflex(dt) {
    const { world: w, me, foe, level: L } = this;
    this.quick -= dt;
    if (this.quick > 0 || w.busy(me) || !targetable(foe)) return false;
    this.quick = 0.08 + L.think * 0.25;
    const d = Math.hypot(foe.x - me.x, foe.z - me.z);
    if (this.again('flashfrost')) {
      const p = w.projectiles.find((q) => q.owner === me && q.skill.id === 'flashfrost');
      if (p && Math.hypot(foe.x - p.x, foe.z - p.z) < SKILLS.shatter.aoe - 0.6 && w.rng() < L.cast + 0.3) return this.use('flashfrost');
    }
    if (this.has('lastbreath') && w.rng() < L.cast + 0.3) return this.use('lastbreath');
    if (this.has('fling') && w.rng() < L.cast + 0.2) return this.use('fling');
    if (this.again('brokenwings') && d < 6.5 && this.has('brokenwings')) return this.use('brokenwings', foe.x, foe.z);
    return false;
  }

  offence(d) {
    const { world: w, me, foe, level: L } = this;
    const r = w.rng;
    if (!targetable(foe)) return false;
    const want = (bonus = 0) => r() < L.cast + bonus;
    const guarded = foe.guard > 0;
    const ahead = (T) => predictAt(foe, me, T);

    // Ultimates first.
    if (this.has('meteor') && !guarded && d < SKILLS.meteor.range + 2 && want(foe.tumble > 0 ? 0.3 : 0)) {
      const p = this.jitter(ahead(SKILLS.meteor.air * 0.85), 0.8);
      return this.use('meteor', p.x, p.z);
    }
    if (this.has('nova') && d < SKILLS.nova.aoe - 1.6 && want(foe.tumble > 0 ? 0.4 : 0)) return this.use('nova');
    if (this.has('eclipse') && d < SKILLS.eclipse.range - 2 && want(0.1)) return this.use('eclipse');
    if (this.has('deathmark') && d < SKILLS.deathmark.range - 1 && want(0.1)) return this.use('deathmark');
    if (this.has('curtaincall') && d > 5 && d < 22 && want()) return this.use('curtaincall', foe.x, foe.z);
    if (this.has('blizzard') && d < SKILLS.blizzard.range + 3 && want()) {
      const p = this.jitter(ahead(0.4), 0.6);
      return this.use('blizzard', p.x, p.z);
    }
    if (this.has('exile')) {
      if (this.again('exile')) {
        // Hold the slash for a weakened target, but never let it expire unused.
        if (d < SKILLS.windslash.range - 1 && (spinRatio(foe) < 0.5 || me.re[this.keyOf.exile] < 2.5) && want(0.2)) return this.shoot('exile', SKILLS.windslash, 0.6);
      } else if (d < 9 && want()) return this.use('exile');
    }
    if (this.has('mimic') && d < 11 && want()) return this.shoot('mimic', { speed: 34 }, 0.7);
    if (this.has('guillotine') && !guarded && d > 2.5 && d < SKILLS.guillotine.dist + 0.5 && want(foe.bleed * 0.08 - 0.1)) return this.shoot('guillotine', SKILLS.guillotine, 0.6);
    if (this.has('insanity') && (spinRatio(me) < 0.75 || d < 5) && want()) return this.use('insanity');
    if (this.has('upgrade') && d < 12 && want()) return this.use('upgrade');
    if (this.has('divide') && d < 6.5 && want(0.1)) return this.use('divide', foe.x, foe.z);
    if (this.described(d, want, ahead, guarded)) return true;
    if (guarded) return false;

    // Dashes that hit.
    if (this.has('blitz') && d > 3 && d < SKILLS.blitz.dist + 1 && want()) return this.shoot('blitz', SKILLS.blitz, 0.6);
    if (this.has('sweep') && d > 2.5 && d < SKILLS.sweep.dist + 1 && want(-0.1)) return this.use('sweep', foe.x, foe.z);
    if (this.has('brokenwings') && !this.again('brokenwings') && d > 2.5 && d < 7 && want()) return this.use('brokenwings', foe.x, foe.z);
    if (this.has('distort')) {
      if (this.again('distort')) { if (want(-0.2)) return this.use('distort'); }
      else if (d > 3 && d < SKILLS.distort.dist + 1 && want()) { const p = ahead(0.2); return this.use('distort', p.x, p.z); }
    }
    if (this.has('shift') && d > 4 && w.own(me, 'arise').some((q) => Math.hypot(q.x - foe.x, q.z - foe.z) < 4.5) && want(-0.1)) return this.use('shift');

    // Straight shots.
    for (const id of ['sonic', 'shuriken', 'fourshot', 'sigil', 'frostbite', 'flashfrost', 'flourish', 'ethereal', 'anchor', 'galeq']) {
      if (!this.has(id) || this.again(id)) continue;
      const S = w.aimSkill(me, this.keyOf[id]);
      let bonus = 0;
      if (id === 'anchor' && d < 4.5) continue;
      if (id === 'frostbite') bonus = foe.slow > 0 || foe.tumble > 0 ? 0.4 : -0.15;
      if (id === 'flourish') bonus = foe.scar > 0 ? 0.3 : -0.25;
      if (id === 'fourshot') bonus = 0.15;
      if (id === 'galeq') bonus = me.stack >= S.stacks || S.up ? 0.4 : 0.15; // the tornado is worth taking
      if (d < S.range - 1 && want(bonus)) return this.shoot(id, S);
    }
    // Step in close, so the empowered hit that follows actually connects.
    if (this.has('phantom') && d > 3.5 && d < SKILLS.phantom.range + 2.5 && want(-0.15)) {
      const p = ahead(0.25);
      const k = Math.hypot(p.x - me.x, p.z - me.z) || 1;
      return this.use('phantom', me.x + ((p.x - me.x) / k) * (k - 2.2), me.z + ((p.z - me.z) / k) * (k - 2.2));
    }

    // Blasts on the floor.
    for (const id of ['quake', 'grenade']) {
      const S = SKILLS[id];
      if (this.has(id) && d < S.range + 1 && want(foe.tumble > 0.3 || foe.slow > 0.5 ? 0.3 : 0)) {
        const p = this.jitter(ahead(S.delay + me.windup[this.keyOf[id]]), 0.7);
        return this.use(id, p.x, p.z);
      }
    }
    if (this.has('glue') && d < SKILLS.glue.range && want()) { const p = ahead(0.3); return this.use('glue', p.x, p.z); }
    if (this.has('lotus') && d < 12 && want(-0.2)) { const p = this.jitter(ahead(0.9), 0.6); return this.use('lotus', p.x, p.z); }

    // Cones.
    for (const id of ['flare', 'rockets', 'apprehend']) {
      const S = SKILLS[id];
      if (id === 'apprehend' && d < 3.5) continue;
      if (this.has(id) && d < S.range - 0.8 && want(0.15)) {
        const p = this.jitter(ahead(0.08 + me.windup[this.keyOf[id]]), 0.5);
        return this.use(id, p.x, p.z);
      }
    }

    // Around the top itself.
    if (this.has('kiburst') && d < SKILLS.kiburst.aoe - 0.2 && want(0.2)) return this.use('kiburst');
    if (this.has('slash') && want(0.1)) {
      const A = SKILLS.slash.aoe - 0.3;
      if (d < A || w.own(me, 'shadow').some((q) => Math.hypot(q.x - foe.x, q.z - foe.z) < A)) return this.use('slash');
    }
    if (this.has('decimate') && d > 2 && d < SKILLS.decimate.aoe + 0.4 && want(0.1)) return this.use('decimate');
    if (this.has('cripple') && d < 6 && want()) return this.use('cripple');
    if (this.has('satellite') && d < 9 && want()) return this.use('satellite');
    if (this.has('sanctuary') && spinRatio(me) < 0.82 && want(-0.1)) return this.use('sanctuary');
    if (this.has('aegis') && d < 3.4 && r() < L.cast * 0.25) return this.use('aegis');
    if (this.has('poison')) {
      // Leave a trail while the other top is close enough to walk into it.
      const on = d < 9 && spinRatio(me) > 0.3;
      if (me.toggle !== on && (on ? want() : true)) return this.use('poison');
    }

    // Things to set up.
    if (this.has('shadow')) {
      if (this.again('shadow')) {
        const q = w.own(me, 'shadow').find((s) => s.c);
        if (q && d > 5 && Math.hypot(q.x - foe.x, q.z - foe.z) < 3.5 && want(-0.2)) return this.use('shadow');
      } else if (d > 3.5 && d < 12 && want(-0.1)) { const p = this.jitter(ahead(0.2), 0.6); return this.use('shadow', p.x, p.z); }
    }
    if (this.has('turret') && d < 13 && want(-0.1)) {
      const k = d || 1;
      return this.use('turret', me.x + ((foe.x - me.x) / k) * 3 + (r() - 0.5) * 3, me.z + ((foe.z - me.z) / k) * 3 + (r() - 0.5) * 3);
    }
    if (this.has('arise') && d < 11 && want()) { const p = this.jitter(ahead(0.3), 0.6); return this.use('arise', p.x, p.z); }
    if (this.has('conquer') && d < 12 && !w.own(me, 'arise').some((q) => Math.hypot(q.x - foe.x, q.z - foe.z) < SKILLS.arise.reach) && want()) {
      const p = this.jitter(ahead(0.25), 0.6);
      return this.use('conquer', p.x, p.z);
    }
    if (this.has('icewall') && d > 4 && d < 8 && want(-0.35)) {
      // Dropped just behind the target, to cut off its way out.
      const k = d || 1;
      return this.use('icewall', foe.x + ((foe.x - me.x) / k) * 2, foe.z + ((foe.z - me.z) / k) * 2);
    }
    if (this.has('valor') && d > 5 && d < 9 && want(-0.3)) return this.use('valor', foe.x, foe.z);
    return false;
  }

  // Skills that say what they are (`kind` in config.js) are played from that
  // description alone, so a new blade needs no code here.
  described(d, want, ahead, guarded) {
    const { world: w, me, foe } = this;
    const r = w.rng;
    for (const k of KEYS) {
      const base = skillOf(me, k);
      if (!base.icon || !w.canCast(me, k)) continue;
      const S = w.aimSkill(me, k), again = me.re[k] > 0, wind = me.windup[k];
      const go = (x = me.x, z = me.z) => w.cast(me, k, x, z, S.wind ? S.wind.full : 0);
      const at = (p) => go(p.x, p.z);
      if (guarded && S.kind !== 'buff' && S.kind !== 'field') continue;
      switch (S.ai || S.kind || S.id) {
        case 'shot':
          if (d < S.range - 1 && want(again ? 0.3 : base.ult ? 0.1 : 0)) return at(this.jitter(intercept(me.x, me.z, foe, me, S.speed, wind)));
          break;
        case 'bolts':
          if (d < 9 && want()) return go();
          break;
        case 'dash':
          if (S.dmg || S.pass || S.land || S.bolt || S.phantom || S.empower) { if (d > 2.5 && d < S.dist + 1.5 && want(again ? 0.3 : 0)) return at(ahead(0.15)); }
          else if (d > 5 && d < 10 && want(-0.3)) return go(foe.x, foe.z);
          break;
        case 'blink':
          if (d > 3.5 && d < S.range + 3 && want(-0.1)) {
            // Onto the target if the arrival hurts, short of it otherwise.
            const p = ahead(0.15), n = Math.hypot(p.x - me.x, p.z - me.z) || 1, stop = S.dmg ? 1.5 : 4;
            return go(me.x + ((p.x - me.x) / n) * Math.max(2, n - stop), me.z + ((p.z - me.z) / n) * Math.max(2, n - stop));
          }
          break;
        case 'recall':
          if (want(-0.2)) return go();
          break;
        case 'blast':
          if (d < S.range + 1 && want(again ? 0.3 : foe.tumble > 0.3 || foe.slow > 0.5 ? 0.3 : 0)) return at(this.jitter(ahead(S.delay + wind), 0.7));
          break;
        case 'field':
          if (S.aim === 'self') { if ((S.regen ? spinRatio(me) < 0.85 : d < S.aoe + 0.5) && want()) return go(); }
          else if (d < S.range + 1 && want()) return at(this.jitter(ahead(0.3), 0.6));
          break;
        case 'ground':
          if (d < S.range + 1 && want(-0.1)) return at(this.jitter(ahead(0.3), 0.6));
          break;
        case 'burst':
          if (d < S.aoe - 0.3 && want(0.2)) return go();
          break;
        case 'cone':
          if (d < S.range - 0.8 && want(0.15)) return at(this.jitter(ahead(0.08 + wind), 0.5));
          break;
        case 'buff':
          if ((S.storeShield ? me.store > 50 : S.heal || S.healMax || S.cleanse ? spinRatio(me) < 0.8 : d < 8) && want()) return go();
          break;
        case 'leap':
          if (S.dmg) { if (d < S.range + 2 && want(foe.tumble > 0 ? 0.3 : 0)) return at(this.jitter(ahead(S.air * 0.85), 0.8)); }
          else if (S.shot) { if (d < 9 && want()) return go(foe.x, foe.z); }
          else if (d < 3.5 && r() < 0.25) return go(-me.x, -me.z); // only to get away
          break;
        case 'beam':
          if (d > 2.5 && d < S.range - 2 && want(foe.tumble > 0.3 ? 0.3 : 0)) return at(this.jitter(ahead(S.charge * 0.8 + wind), 0.6));
          break;
        case 'kick': {
          // Toward the nearest stretch of wall.
          const n = Math.hypot(foe.x, foe.z);
          if (want(0.3)) return n > 1 ? go(me.x + (foe.x / n) * 5, me.z + (foe.z / n) * 5) : go(foe.x, foe.z);
          break;
        }
        case 'throw': {
          const n = Math.hypot(foe.x, foe.z) || 1;
          if (want(0.3)) return go(me.x + (foe.x / n) * 8, me.z + (foe.z / n) * 8);
          break;
        }
        case 'strike': case 'realm':
          if (want(0.3)) return go();
          break;
        case 'rewind':
          if (me.hist.length && me.hist[0].spin - me.spin > 140 && want(0.2)) return go();
          break;
        case 'caskpop': {
          const q = w.own(me, 'cask')[0];
          if (q && Math.hypot(q.x - foe.x, q.z - foe.z) < q.r - 0.4) return go();
          break;
        }
        case 'feathers':
          if (w.own(me, 'feather').length >= 2 && want()) return go();
          break;
      }
    }
    return false;
  }

  update(dt) {
    const { world: w, me, foe, level: L } = this;
    if (w.result || me.out || me.air || me.blink || me.spin <= 0 || rooted(me) || me.stun > 0) return;
    if (this.reflex(dt)) return;
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
    // Its own trap is ready and the other top is on it: step in to set it off.
    const trap = w.own(me, 'parallel').find((z) => z.t >= z.skill.arm - 0.4 && Math.hypot(foe.x - z.x, foe.z - z.z) < z.r + 1);
    if (trap) { w.issueMove(me, trap.x, trap.z); return; }
    // Do not walk into the other side's sanctuary just to be slowed.
    const theirs = w.zones.find((z) => z.owner === foe && z.kind === 'sanctuary');
    if (theirs && Math.hypot(foe.x - theirs.x, foe.z - theirs.z) < theirs.r && r() < L.dodge * 0.6) return;
    if (!targetable(foe)) return;
    // Ranged blades give ground, sliding round the arena rather than into the wall.
    const keep = KEEP_AWAY[me.blade.id];
    if (keep && d < keep && !(foe.egg > 0) && r() < 0.75) {
      const k = d || 1;
      let ax = me.x - (dx / k) * 5 - (dz / k) * 3, az = me.z - (dz / k) * 5 + (dx / k) * 3;
      const lim = ARENA.R - 3, ar = Math.hypot(ax, az);
      if (ar > lim) { ax *= lim / ar; az *= lim / ar; }
      w.issueMove(me, ax, az);
      return;
    }
    // Press when behind; when the spin lead is ours anyway, let the clock work.
    const lead = spinRatio(me) - spinRatio(foe);
    const chase = L.chase + (lead < -0.1 ? 0.15 : 0) + (me.empower > 0 || me.orbs ? 0.35 : 0) + (me.tether ? 0.3 : 0) + (foe.egg > 0 || foe.up > 0 ? 0.4 : 0);
    if (keep && r() < 0.5) return;
    if (r() < chase) {
      const p = predictAt(foe, me, Math.min(0.5, d / 20));
      w.issueMove(me, p.x, p.z);
    }
  }
}
