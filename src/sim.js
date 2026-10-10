// Battle simulation. No rendering in here: the world steps the two tops and
// pushes events that the renderer, audio and HUD react to.
import { ARENA, SKILLS, KEYS, skillOf } from './config.js';

export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEEK = 4;
const LUNGE_RATE = 1.25;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function makeTop(side, blade) {
  return {
    side, blade,
    x: 0, z: 0, vx: 0, vz: 0,
    spin: blade.spinMax, spinMax: blade.spinMax, dir: 1,
    radius: 1.25, mass: blade.mass,
    cmd: null, cast: null, dash: null, air: null, out: null,
    blink: null, charge: null, orbs: null, tether: null, empower: 0,
    projN: 0, // shots fired so far; makes projectile ids agree on both ends of a network match
    phase: side * 2.1, tumble: 0, launch: 0, guard: 0, slow: 0, hitCd: 0,
    cd: { Q: 0, W: 0, E: 0, R: 0 },
    windup: { Q: 0, W: 0, E: 0, R: 0 },
    ult: 0, lastHit: null,
    stats: { dealt: 0, taken: 0, clashes: 0, skillHits: 0, parries: 0, maxHit: 0 },
  };
}

export const targetable = (t) => !t.air && !t.out && !t.blink;
export const spinRatio = (t) => Math.max(0, t.spin / t.spinMax);
// Tops with little spin left are thrown further.
export const kbMul = (t) => 1 + 0.85 * (1 - spinRatio(t));

// Free movement of one top: bowl pull, self-propulsion, move order or dash.
// Also used on copies for prediction, so it must not touch anything but `t`.
export function moveTop(t, dt, opp) {
  if (t.dash || t.blink) {
    const d = t.dash || t.blink;
    t.vx = d.dx * d.speed; t.vz = d.dz * d.speed;
    d.t -= dt;
    if (d.t <= 0) {
      const keep = t.blade.speed * 0.8;
      t.vx = d.dx * keep; t.vz = d.dz * keep;
      t.dash = t.blink = null;
    }
    t.x += t.vx * dt; t.z += t.vz * dt;
    return;
  }
  const sr = spinRatio(t);
  const slow = t.slow > 0 ? 0.6 : 1;
  // Steeper near the middle than a plain bowl, so orbits of different size drift out of step.
  const well = ARENA.K * (0.55 + 3.2 / (Math.hypot(t.x, t.z) + 1.5));
  let ax = -well * t.x, az = -well * t.z;
  let drag = 0.15;
  if (t.spin <= 0) {
    drag = 2.2;
  } else if (t.charge) {
    drag = 9; // rooted while charging
  } else if (t.tumble > 0) {
    drag = 0.55;
  } else if (t.cmd) {
    const c = t.cmd;
    const dx = c.x - t.x, dz = c.z - t.z;
    const d = Math.hypot(dx, dz);
    c.t -= dt;
    if (d < 0.9 || c.t <= 0) {
      t.cmd = null;
    } else {
      const sp = t.blade.speed * 1.2 * (0.55 + 0.45 * sr) * slow;
      let sx = ((dx / d) * sp - t.vx) * 9, sz = ((dz / d) * sp - t.vz) * 9;
      const sm = Math.hypot(sx, sz);
      if (sm > 70) { sx *= 70 / sm; sz *= 70 / sm; }
      ax = sx; az = sz;
    }
  }
  if (t.spin > 0 && t.tumble <= 0 && !t.cmd && !t.charge) {
    const sp = Math.hypot(t.vx, t.vz);
    const cruise = t.blade.speed * (0.3 + 0.7 * sr) * slow;
    t.phase += dt;
    if (sp > 0.05) {
      const g = clamp((cruise - sp) * 1.6, -8, 12);
      // The tip grips and curves; the uneven wobble keeps orbits from repeating.
      const curl = (2.2 + 2.6 * Math.sin(t.phase * 1.3) * Math.sin(t.phase * 0.47 + 1)) * sr * t.dir;
      ax += (t.vx / sp) * g - (t.vz / sp) * curl;
      az += (t.vz / sp) * g + (t.vx / sp) * curl;
    } else {
      ax += Math.cos(t.phase * 3) * 5; az += Math.sin(t.phase * 3) * 5;
    }
    if (opp && targetable(opp)) {
      const dx = opp.x - t.x, dz = opp.z - t.z;
      const d = Math.hypot(dx, dz) || 1;
      // Every few seconds it turns in and charges instead of just circling.
      const lunge = Math.sin(t.phase * LUNGE_RATE + 0.5);
      if (lunge > 0.55) {
        const k = 3.2 * sr;
        ax += ((dx / d) * cruise * 1.15 - t.vx) * k; az += ((dz / d) * cruise * 1.15 - t.vz) * k;
      }
      const seek = SEEK * (0.35 + 0.65 * sr);
      ax += (dx / d) * seek; az += (dz / d) * seek;
    }
  }
  t.vx += ax * dt; t.vz += az * dt;
  const f = Math.exp(-drag * dt);
  t.vx *= f; t.vz *= f;
  t.x += t.vx * dt; t.z += t.vz * dt;
}

// Pushes the top back inside the wall. Returns the contact if it was touching.
export function wallContact(t) {
  const lim = ARENA.R - t.radius;
  const r = Math.hypot(t.x, t.z);
  if (r <= lim) return null;
  const nx = t.x / r, nz = t.z / r;
  t.x = nx * lim; t.z = nz * lim;
  return { nx, nz, vn: t.vx * nx + t.vz * nz };
}

export function bounce(t, c) {
  const j = (1 + ARENA.wallE) * c.vn;
  t.vx -= j * c.nx; t.vz -= j * c.nz;
}

function ghost(t) {
  return {
    blade: t.blade, x: t.x, z: t.z, vx: t.vx, vz: t.vz, spin: t.spin, spinMax: t.spinMax,
    dir: t.dir, radius: t.radius, tumble: t.tumble, slow: t.slow, phase: t.phase,
    cmd: t.cmd ? { ...t.cmd } : null, dash: t.dash ? { ...t.dash } : null,
    blink: t.blink ? { ...t.blink } : null, charge: t.charge,
  };
}

// Where a top will be over the next `T` seconds if nothing hits it.
export function predictPath(t, opp, T, n) {
  const pts = [];
  if (t.air) {
    for (let i = 0; i < n; i++) pts.push({ x: t.air.tx, z: t.air.tz });
    return pts;
  }
  const g = ghost(t);
  const dt = T / n;
  const sub = Math.max(1, Math.ceil(dt * 40));
  for (let i = 0; i < n; i++) {
    for (let s = 0; s < sub; s++) {
      const h = dt / sub;
      moveTop(g, h, opp);
      g.tumble = Math.max(0, g.tumble - h);
      g.slow = Math.max(0, g.slow - h);
      const c = wallContact(g);
      if (c && c.vn > 0) { bounce(g, c); g.dash = null; }
    }
    pts.push({ x: g.x, z: g.z });
  }
  return pts;
}

export function predictAt(t, opp, T) {
  if (T <= 0.001) return { x: t.x, z: t.z };
  const p = predictPath(t, opp, T, Math.max(1, Math.ceil(T * 20)));
  return p[p.length - 1];
}

// Where to aim something travelling at `speed` from (sx, sz) to meet `target`.
export function intercept(sx, sz, target, opp, speed, delay = 0) {
  let p = { x: target.x, z: target.z }, time = 0;
  for (let i = 0; i < 3; i++) {
    time = delay + Math.hypot(p.x - sx, p.z - sz) / speed;
    p = predictAt(target, opp, time);
  }
  return { x: p.x, z: p.z, t: time };
}

export class World {
  constructor(bladeA, bladeB, seed = 1) {
    this.rng = mulberry32(seed);
    this.tops = [makeTop(0, bladeA), makeTop(1, bladeB)];
    this.projectiles = [];
    this.zones = [];
    this.events = [];
    this.time = 0;
    this.result = null;
    this.projId = 0;
    this.resetRound();
  }

  other(t) { return this.tops[1 - t.side]; }
  emit(type, data) { this.events.push({ type, ...data }); }

  resetRound() {
    this.projectiles.length = 0;
    this.zones.length = 0;
    this.result = null;
    this.time = 0;
    for (const t of this.tops) {
      const s = t.side === 0 ? 1 : -1;
      t.x = 0; t.z = 7.5 * s;
      t.vx = t.blade.speed * 0.75 * s; t.vz = 0;
      t.spin = t.spinMax;
      t.cmd = t.cast = t.dash = t.air = t.out = t.blink = t.charge = t.orbs = t.tether = null;
      t.tumble = t.launch = t.guard = t.slow = t.hitCd = t.empower = 0;
      t.lastHit = null;
      for (const k of KEYS) t.cd[k] = k === 'R' ? 0 : 1.2;
    }
  }

  issueMove(t, x, z) {
    if (this.result || t.air || t.out || t.dash || t.blink || t.charge) return false;
    const lim = ARENA.R - t.radius - 0.2;
    const r = Math.hypot(x, z);
    if (r > lim) { x *= lim / r; z *= lim / r; }
    t.cmd = { x, z, t: 2.2 };
    return true;
  }

  // States that block every skill, whatever its cooldown.
  busy(t) { return !!(this.result || t.spin <= 0 || t.air || t.out || t.cast || t.dash || t.blink || t.charge); }

  canCast(t, key) {
    if (this.busy(t) || t.cd[key] > 0) return false;
    const S = skillOf(t, key);
    if (S.ult && t.ult < 100) return false;
    if (S.id !== 'aegis' && t.tumble > 0) return false;
    if (S.id === 'eclipse') {
      const o = this.other(t);
      if (!targetable(o) || Math.hypot(o.x - t.x, o.z - t.z) > S.range) return false;
    }
    return true;
  }

  // Clamps a floor target to the skill's range and to the arena.
  groundTarget(t, S, ax, az) {
    let dx = ax - t.x, dz = az - t.z;
    const d = Math.hypot(dx, dz);
    if (d > S.range) { dx *= S.range / d; dz *= S.range / d; }
    let x = t.x + dx, z = t.z + dz;
    const lim = ARENA.R - (S.aim === 'leap' ? 1.6 : 0.6), r = Math.hypot(x, z);
    if (r > lim) { x *= lim / r; z *= lim / r; }
    return { x, z };
  }

  cast(t, key, ax, az) {
    if (!this.canCast(t, key)) return false;
    const S = skillOf(t, key);
    t.cd[key] = S.cd * t.blade.cdMul;
    if (S.ult) t.ult = 0;
    let dx = ax - t.x, dz = az - t.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.01) { dx = 0; dz = t.side === 0 ? -1 : 1; } else { dx /= d; dz /= d; }
    const c = { key, skill: S, t: t.windup[key], T: t.windup[key], dx, dz, ax, az, dist: d };
    if (S.aim === 'ground' || S.aim === 'leap') { const m = this.groundTarget(t, S, ax, az); c.ax = m.x; c.az = m.z; }
    this.emit('cast', { top: t, key, skill: S, windup: c.T, dx, dz, ax: c.ax, az: c.az });
    if (c.t <= 0) this.execute(t, c); else t.cast = c;
    return true;
  }

  execute(t, c) {
    const S = c.skill, opp = this.other(t);
    switch (S.id) {
      case 'sonic': case 'anchor': {
        const p = {
          id: t.side * 30000 + (t.projN = (t.projN + 1) % 30000), skill: S, owner: t, x: t.x + c.dx * 0.9, z: t.z + c.dz * 0.9, dx: c.dx, dz: c.dz,
          speed: S.speed, left: S.range, r: S.radius, dmg: S.dmg * t.blade.atk, dead: false,
        };
        this.projectiles.push(p);
        this.emit('shoot', { top: t, proj: p });
        break;
      }
      case 'blitz': {
        const dist = clamp(c.dist, S.minDist, S.dist);
        t.dash = { dx: c.dx, dz: c.dz, speed: S.speed, t: dist / S.speed };
        t.cmd = null;
        this.emit('dash', { top: t, dx: c.dx, dz: c.dz, dist });
        break;
      }
      case 'phantom': {
        const dist = clamp(c.dist, 2, S.range);
        t.blink = { dx: c.dx, dz: c.dz, speed: S.speed, t: dist / S.speed };
        t.cmd = null; t.tumble = 0;
        this.emit('blink', { top: t, dx: c.dx, dz: c.dz, dist });
        break;
      }
      case 'meteor':
        t.air = { t: 0, T: S.air, sx: t.x, sz: t.z, tx: c.ax, tz: c.az };
        t.cmd = null; t.vx = t.vz = 0;
        this.emit('leap', { top: t, tx: c.ax, tz: c.az, T: S.air });
        break;
      case 'quake': {
        const z = { kind: 'quake', skill: S, owner: t, x: c.ax, z: c.az, r: S.aoe, t: 0, T: S.delay };
        this.zones.push(z);
        this.emit('zone', { zone: z, top: t });
        break;
      }
      case 'aegis':
        t.guard = S.dur * t.blade.guardMul;
        this.emit('guard', { top: t, dur: t.guard });
        break;
      case 'nova':
        t.charge = { t: 0, T: S.charge, skill: S };
        t.cmd = null;
        this.emit('charge', { top: t, T: S.charge });
        break;
      case 'flare': {
        let hit = 0;
        if (targetable(opp)) {
          const ox = opp.x - t.x, oz = opp.z - t.z, d = Math.hypot(ox, oz);
          // The cone is widened by the target's own size so grazing hits count.
          const ang = Math.acos(clamp((ox * c.dx + oz * c.dz) / (d || 1), -1, 1));
          const pad = Math.atan2(opp.radius * 0.8, Math.max(d, 0.5));
          if (d < S.range + opp.radius * 0.6 && ang < S.half + pad) {
            hit = this.hurt(opp, (S.dmg * t.blade.atk * (opp.guard > 0 ? 0.3 : 1)) / opp.blade.def, t, 'flare');
            t.spin = Math.min(t.spinMax, t.spin + hit * S.heal);
            if (opp.guard <= 0) {
              this.knock(opp, c.dx, c.dz, S.kb, 0.25, 0.8);
            }
            t.stats.skillHits++;
          }
        }
        this.emit('flare', { top: t, dx: c.dx, dz: c.dz, hit, heal: hit * S.heal, target: opp });
        break;
      }
      case 'sanctuary': {
        const z = { kind: 'sanctuary', skill: S, owner: t, x: t.x, z: t.z, r: S.radius, t: 0, T: S.dur, healed: 0, tick: 0 };
        this.zones.push(z);
        this.emit('zone', { zone: z, top: t });
        break;
      }
      case 'satellite':
        t.orbs = { n: S.count, alive: (1 << S.count) - 1, t: S.dur, ang: 0, cd: 0, skill: S };
        this.emit('orbs', { top: t });
        break;
      case 'eclipse':
        t.tether = { t: 0, T: S.dur, skill: S, acc: 0, tick: 0 };
        this.emit('tether', { top: t, target: opp });
        break;
    }
  }

  hurt(t, dmg, from, kind) {
    if (this.result || dmg <= 0) return 0;
    if (t.charge) dmg *= t.charge.skill.armor;
    t.spin -= dmg;
    t.stats.taken += dmg;
    t.ult = Math.min(100, t.ult + dmg * 0.06);
    if (from) {
      from.stats.dealt += dmg;
      from.stats.maxHit = Math.max(from.stats.maxHit, dmg);
      if (kind !== 'drain') from.ult = Math.min(100, from.ult + dmg * 0.085);
    }
    t.lastHit = { dmg, time: this.time, kind };
    return dmg;
  }

  // Throws `v` along (dx, dz) and cancels whatever it was doing.
  knock(v, dx, dz, speed, tumble, launch) {
    if (v.charge) return; // rooted
    const k = (speed * kbMul(v)) / Math.sqrt(v.mass);
    v.vx = dx * k; v.vz = dz * k;
    v.tumble = Math.max(v.tumble, tumble);
    if (launch > 0) v.launch = Math.max(v.launch, launch);
    v.cmd = null; v.dash = null; v.cast = null;
  }

  finish(winner, loser, kind) {
    if (this.result) return;
    this.result = { winner, loser, kind };
    this.emit('finish', { winner, loser, kind });
  }

  timeUp() {
    const [a, b] = this.tops;
    const w = spinRatio(a) >= spinRatio(b) ? a : b;
    this.finish(w, this.other(w), 'time');
  }

  step(dt) {
    this.time += dt;
    const [a, b] = this.tops;
    this.updateTop(a, dt, b);
    this.updateTop(b, dt, a);
    this.collide(a, b);
    this.walls(a);
    this.walls(b);
    this.updateProjectiles(dt);
    this.updateZones(dt);
    if (!this.result) {
      for (const t of this.tops) {
        if (t.spin > 0 || t.out) continue;
        t.spin = 0;
        const h = t.lastHit;
        const burst = h && this.time - h.time < 0.35 && h.dmg >= 55;
        this.finish(this.other(t), t, burst ? 'burst' : 'spin');
        break;
      }
    }
  }

  updateTop(t, dt, opp) {
    for (const k of KEYS) t.cd[k] = Math.max(0, t.cd[k] - dt);
    t.tumble = Math.max(0, t.tumble - dt);
    t.launch = Math.max(0, t.launch - dt);
    t.slow = Math.max(0, t.slow - dt);
    t.hitCd = Math.max(0, t.hitCd - dt);
    t.empower = Math.max(0, t.empower - dt);
    if (t.guard > 0) {
      t.guard -= dt;
      if (t.guard <= 0) { t.guard = 0; this.emit('guardEnd', { top: t }); }
    }
    if (!this.result && t.spin > 0) {
      t.spin -= t.blade.decay * dt;
      t.ult = Math.min(100, t.ult + 0.8 * dt);
    }
    if (t.out) {
      const o = t.out;
      o.t += dt; o.vy -= 26 * dt; o.y += o.vy * dt;
      t.x += t.vx * dt; t.z += t.vz * dt;
      return;
    }
    if (t.air) {
      const a = t.air;
      a.t += dt;
      const k = Math.min(1, a.t / a.T), e = k * k * (3 - 2 * k);
      t.x = a.sx + (a.tx - a.sx) * e; t.z = a.sz + (a.tz - a.sz) * e;
      if (k >= 1) this.land(t, opp);
      return;
    }
    if (t.cast) {
      t.cast.t -= dt;
      if (t.cast.t <= 0) {
        const c = t.cast; t.cast = null;
        if (!this.result && t.spin > 0) this.execute(t, c);
      }
    }
    // Ongoing effects stop with the round or with the top itself.
    if (this.result || t.spin <= 0) {
      if (t.tether) this.emit('tetherEnd', { top: t, broke: true });
      if (t.orbs) this.emit('orbsEnd', { top: t });
      t.charge = t.tether = t.orbs = null;
    }
    if (t.charge) {
      t.charge.t += dt;
      if (t.charge.t >= t.charge.T) this.novaBlast(t, opp);
    }
    if (t.orbs) this.updateOrbs(t, opp, dt);
    if (t.tether) this.updateTether(t, opp, dt);
    const was = t.blink;
    moveTop(t, dt, opp);
    if (was && !t.blink) {
      t.empower = SKILLS.phantom.empower;
      this.emit('blinkEnd', { top: t });
    }
  }

  land(t, opp) {
    const S = SKILLS.meteor;
    const x = t.air.tx, z = t.air.tz;
    t.air = null; t.x = x; t.z = z; t.vx = t.vz = 0; t.tumble = 0.2;
    let hit = 0;
    if (targetable(opp)) {
      let dx = opp.x - x, dz = opp.z - z;
      const d = Math.hypot(dx, dz);
      if (d < S.aoe + opp.radius * 0.5) {
        if (d < 0.05) { dx = 1; dz = 0; } else { dx /= d; dz /= d; }
        const f = d < 2 ? 1 : 1 - 0.45 * ((d - 2) / (S.aoe - 1.5));
        const g = opp.guard > 0 ? 0.4 : 1;
        hit = this.hurt(opp, (S.dmg * f * g * t.blade.atk) / opp.blade.def, t, 'meteor');
        this.knock(opp, dx, dz, S.kb * f * g, 0.8 * g, 2);
        // Keep the two from overlapping where it came down.
        if (d < 2.6) { opp.x = x + dx * 2.6; opp.z = z + dz * 2.6; }
        t.stats.skillHits++;
      }
    }
    this.emit('meteor', { top: t, x, z, hit, target: hit ? opp : null });
  }

  novaBlast(t, opp) {
    const S = t.charge.skill;
    t.charge = null;
    let hit = 0;
    if (targetable(opp)) {
      let dx = opp.x - t.x, dz = opp.z - t.z;
      const d = Math.hypot(dx, dz);
      if (d < S.aoe + opp.radius * 0.5) {
        if (d < 0.05) { dx = 1; dz = 0; } else { dx /= d; dz /= d; }
        const f = d < 3 ? 1 : 1 - 0.5 * ((d - 3) / (S.aoe - 2.5));
        hit = this.hurt(opp, (S.dmg * f * t.blade.atk) / opp.blade.def, t, 'nova');
        this.knock(opp, dx, dz, S.kb * f, 0.8, 2);
        t.stats.skillHits++;
      }
    }
    this.emit('nova', { top: t, x: t.x, z: t.z, hit, target: hit ? opp : null });
  }

  orbPos(t, i) {
    const o = t.orbs, a = o.ang + (i / o.skill.count) * Math.PI * 2;
    return { x: t.x + Math.cos(a) * o.skill.orbit, z: t.z + Math.sin(a) * o.skill.orbit };
  }

  updateOrbs(t, opp, dt) {
    const o = t.orbs, S = o.skill;
    o.t -= dt; o.ang += 4.2 * dt; o.cd = Math.max(0, o.cd - dt);
    if (o.cd <= 0 && targetable(opp)) {
      for (let i = 0; i < S.count; i++) {
        if (!(o.alive & (1 << i))) continue;
        const p = this.orbPos(t, i);
        if (Math.hypot(opp.x - p.x, opp.z - p.z) > S.size + opp.radius) continue;
        let dx = opp.x - t.x, dz = opp.z - t.z;
        const d = Math.hypot(dx, dz) || 1;
        dx /= d; dz /= d;
        const dmg = this.hurt(opp, (S.dmg * t.blade.atk * (opp.guard > 0 ? 0.3 : 1)) / opp.blade.def, t, 'orb');
        if (opp.guard <= 0) this.knock(opp, dx, dz, S.kb, 0.2, 1);
        o.alive &= ~(1 << i); o.n--; o.cd = 0.25;
        t.stats.skillHits++;
        this.emit('orbHit', { top: t, target: opp, x: p.x, z: p.z, dmg });
        break;
      }
    }
    if (o.t <= 0 || o.n <= 0) { t.orbs = null; this.emit('orbsEnd', { top: t }); }
  }

  updateTether(t, opp, dt) {
    const th = t.tether, S = th.skill;
    th.t += dt;
    const d = Math.hypot(opp.x - t.x, opp.z - t.z);
    if (th.t >= th.T || !targetable(opp) || d > S.breakRange) {
      if (th.acc > 0.5) this.emit('drain', { top: t, target: opp, dmg: th.acc, heal: th.acc * S.heal });
      t.tether = null;
      this.emit('tetherEnd', { top: t, broke: th.t < th.T });
      return;
    }
    const dmg = this.hurt(opp, (S.drain * dt * t.blade.atk) / opp.blade.def, t, 'drain');
    t.spin = Math.min(t.spinMax, t.spin + dmg * S.heal);
    opp.slow = Math.max(opp.slow, 0.15);
    th.acc += dmg; th.tick += dt;
    // Reported in chunks so the HUD shows a few readable numbers, not a blur.
    if (th.tick >= 0.5) {
      this.emit('drain', { top: t, target: opp, dmg: th.acc, heal: th.acc * S.heal });
      th.acc = 0; th.tick = 0;
    }
  }

  updateZones(dt) {
    for (const z of this.zones) {
      z.t += dt;
      const t = z.owner, opp = this.other(t), S = z.skill;
      if (z.kind === 'quake') {
        if (z.t < z.T) continue;
        z.dead = true;
        let hit = 0;
        if (targetable(opp) && !this.result) {
          let dx = opp.x - z.x, dz = opp.z - z.z;
          const d = Math.hypot(dx, dz);
          if (d < z.r + opp.radius * 0.5) {
            if (d < 0.05) { dx = 0; dz = 1; } else { dx /= d; dz /= d; }
            const g = opp.guard > 0 ? 0.3 : 1;
            hit = this.hurt(opp, (S.dmg * g * t.blade.atk) / opp.blade.def, t, 'quake');
            if (g === 1) this.knock(opp, dx, dz, S.kb, S.stun, 0);
            t.stats.skillHits++;
          }
        }
        this.emit('quake', { top: t, x: z.x, z: z.z, r: z.r, hit, target: hit ? opp : null });
      } else if (z.kind === 'sanctuary') {
        if (z.t >= z.T || this.result) { z.dead = true; this.emit('zoneEnd', { zone: z }); continue; }
        if (!t.out && !t.air && t.spin > 0 && Math.hypot(t.x - z.x, t.z - z.z) < z.r) {
          const h = Math.min(S.regen * dt, t.spinMax - t.spin);
          t.spin += h; z.healed += h; z.tick += dt;
          if (z.tick >= 1) { if (z.healed >= 1) this.emit('heal', { top: t, amount: z.healed }); z.healed = 0; z.tick = 0; }
        }
        if (targetable(opp) && Math.hypot(opp.x - z.x, opp.z - z.z) < z.r) opp.slow = Math.max(opp.slow, 0.2);
      }
    }
    if (this.zones.some((z) => z.dead)) this.zones = this.zones.filter((z) => !z.dead);
  }

  collide(a, b) {
    if (!targetable(a) || !targetable(b)) return;
    let nx = b.x - a.x, nz = b.z - a.z;
    const d = Math.hypot(nx, nz), min = a.radius + b.radius;
    if (d >= min) return;
    if (d > 1e-4) { nx /= d; nz /= d; } else { nx = 1; nz = 0; }
    const tm = a.mass + b.mass, ov = min - d;
    a.x -= nx * ov * (b.mass / tm); a.z -= nz * ov * (b.mass / tm);
    b.x += nx * ov * (a.mass / tm); b.z += nz * ov * (a.mass / tm);
    const vn = (a.vx - b.vx) * nx + (a.vz - b.vz) * nz;
    if (vn <= 0) return;

    const aIn = Math.max(0, a.vx * nx + a.vz * nz);
    const bIn = Math.max(0, -(b.vx * nx + b.vz * nz));
    const sa = spinRatio(a), sb = spinRatio(b);
    const live = !this.result && a.hitCd <= 0 && b.hitCd <= 0;
    const base = 2 + Math.min(vn, 24) * 1.0;
    const share = (aIn + 1) / (aIn + bIn + 2);
    let dmgA = (base * (0.3 + 0.9 * (1 - share)) * b.blade.atk) / a.blade.def;
    let dmgB = (base * (0.3 + 0.9 * share) * a.blade.atk) / b.blade.def;
    let power = Math.min(vn, 24), kind = 'clash', src = null;

    // `s` hits `v` with a skill: `v` is thrown along the contact normal and
    // `s` is left almost standing.
    const thrown = (s, v, speed, tumble) => {
      const sign = v === b ? 1 : -1;
      this.knock(v, sign * nx, sign * nz, speed, tumble, 1.6);
      s.vx = -sign * nx * 3; s.vz = -sign * nz * 3;
      s.dash = null;
      src = s;
    };
    const bonus = (s, v, amount, keep) => {
      const add = (amount * s.blade.atk) / v.blade.def;
      if (v === b) { dmgB = dmgB * keep + add; dmgA *= 0.2; } else { dmgA = dmgA * keep + add; dmgB *= 0.2; }
    };
    let special = true;
    if (!live) {
      special = false;
    } else if (a.guard > 0 !== b.guard > 0) {
      const g = a.guard > 0 ? a : b, v = this.other(g);
      kind = 'parry'; power += 10;
      thrown(g, v, 11.5, 0.65);
      g.guard = 0; g.stats.parries++;
      this.emit('guardEnd', { top: g });
      bonus(g, v, SKILLS.aegis.parryDmg, 0.5);
    } else if (!!a.dash !== !!b.dash) {
      const s = a.dash ? a : b, v = this.other(s);
      kind = 'dash'; power += 14;
      thrown(s, v, SKILLS.blitz.kb, 0.55);
      s.stats.skillHits++;
      bonus(s, v, SKILLS.blitz.dmg, 1);
    } else if (a.empower > 0 !== b.empower > 0) {
      const s = a.empower > 0 ? a : b, v = this.other(s);
      kind = 'empower'; power += 10;
      thrown(s, v, SKILLS.phantom.kb, 0.45);
      s.empower = 0; s.stats.skillHits++;
      bonus(s, v, SKILLS.phantom.bonus, 1);
    } else {
      special = false;
    }

    if (!special) {
      a.dash = null; b.dash = null;
      const j = (1.5 * vn) / (1 / a.mass + 1 / b.mass) + 2.5 + 1.5 * (sa + sb);
      const dva = (j / a.mass) * (1 + 0.35 * (1 - sa)) * (a.charge ? 0.1 : 1);
      const dvb = (j / b.mass) * (1 + 0.35 * (1 - sb)) * (b.charge ? 0.1 : 1);
      a.vx -= nx * dva; a.vz -= nz * dva;
      b.vx += nx * dvb; b.vz += nz * dvb;
      // Both spin the same way, so the rims scrub each other sideways.
      const tk = 0.22 * Math.min(vn, 24);
      a.vx += -nz * tk; a.vz += nx * tk;
      b.vx -= -nz * tk; b.vz -= nx * tk;
      // A plain clash only throws a top out once its spin is nearly gone.
      if (sa < 0.3 && dva > 12) a.launch = Math.max(a.launch, 1.2);
      if (sb < 0.3 && dvb > 12) b.launch = Math.max(b.launch, 1.2);
    }

    if (!live) return;
    a.hitCd = b.hitCd = 0.12;
    if (kind === 'clash' && vn > 9) { a.tumble = Math.max(a.tumble, 0.12); b.tumble = Math.max(b.tumble, 0.12); }
    a.stats.clashes++; b.stats.clashes++;
    dmgA = this.hurt(a, dmgA, b, kind);
    dmgB = this.hurt(b, dmgB, a, kind);
    this.emit('clash', {
      x: (a.x + b.x) / 2, z: (a.z + b.z) / 2, nx, nz, power, kind, src,
      a, b, dmgA, dmgB,
    });
  }

  walls(t) {
    if (t.air || t.out) return;
    const c = wallContact(t);
    if (!c || c.vn <= 0) return;
    if (t.blink) { t.blink.t = 0; return; }
    if (!this.result && t.launch > 0 && c.vn > ARENA.ringOutSpeed) {
      if (t.tether) this.emit('tetherEnd', { top: t, broke: true });
      if (t.orbs) this.emit('orbsEnd', { top: t });
      t.out = { t: 0, y: 0, vy: 7 + c.vn * 0.35 };
      t.cmd = t.dash = t.cast = t.charge = t.tether = t.orbs = null; t.guard = 0;
      this.emit('ringout', { top: t, x: t.x, z: t.z, nx: c.nx, nz: c.nz, power: c.vn });
      this.finish(this.other(t), t, 'over');
      return;
    }
    bounce(t, c);
    t.dash = null;
    let dmg = 0;
    if (c.vn > 4) {
      dmg = ((c.vn - 4) * (t.launch > 0 ? 2.2 : 1.0)) / t.blade.def;
      dmg = this.hurt(t, dmg, t.launch > 0 ? this.other(t) : null, 'wall');
    }
    if (c.vn > 2) this.emit('wall', { top: t, x: t.x + c.nx, z: t.z + c.nz, nx: c.nx, nz: c.nz, power: c.vn, dmg, slam: t.launch > 0 });
  }

  updateProjectiles(dt) {
    for (const p of this.projectiles) {
      const st = p.speed * dt, S = p.skill;
      p.x += p.dx * st; p.z += p.dz * st; p.left -= st;
      const v = this.other(p.owner);
      if (!this.result && targetable(v) && Math.hypot(v.x - p.x, v.z - p.z) < p.r + v.radius) {
        if (v.guard > 0) {
          // Guard sends it straight back.
          p.owner = v; p.dx = -p.dx; p.dz = -p.dz; p.left = S.range; p.dmg *= 1.2;
          v.stats.parries++;
          this.emit('reflect', { top: v, proj: p, x: p.x, z: p.z });
          continue;
        }
        const o = p.owner;
        const dmg = this.hurt(v, p.dmg / v.blade.def, o, S.id);
        if (S.chain) {
          // Dragged toward whoever threw the chain, never far enough to overshoot.
          const dx = o.x - v.x, dz = o.z - v.z, d = Math.hypot(dx, dz) || 1;
          if (!v.charge) {
            const sp = Math.min(S.pull, d * 3.2);
            v.vx = (dx / d) * sp; v.vz = (dz / d) * sp;
            v.tumble = Math.max(v.tumble, 0.5); v.cmd = null; v.dash = null; v.cast = null;
          }
        } else {
          this.knock(v, p.dx, p.dz, S.kb, 0.35, 1.5);
        }
        v.slow = S.slow;
        o.stats.skillHits++;
        p.dead = true;
        this.emit('projHit', { proj: p, top: v, x: p.x, z: p.z, dx: p.dx, dz: p.dz, dmg });
      } else if (p.left <= 0 || Math.hypot(p.x, p.z) > ARENA.R + 0.5) {
        p.dead = true;
        this.emit('projEnd', { proj: p, x: p.x, z: p.z });
      }
    }
    if (this.projectiles.some((p) => p.dead)) this.projectiles = this.projectiles.filter((p) => !p.dead);
  }
}
