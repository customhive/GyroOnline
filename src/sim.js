// Battle simulation. No rendering in here: the world steps the two tops and
// pushes events that the renderer, audio and HUD react to.
import { ARENA, SKILLS, KEYS, BLEED, skillOf } from './config.js';

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
const SCAR = 2.5;      // seconds a top counts as "recently hit"
const WALL_HALF = 0.35; // half thickness of a solid wall
const MOBILE = new Set(['dash', 'blink', 'leap']);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function makeTop(side, blade) {
  return {
    side, blade,
    x: 0, z: 0, vx: 0, vz: 0,
    spin: blade.spinMax, spinMax: blade.spinMax, dir: 1,
    radius: 1.25, mass: blade.mass,
    cmd: null, cast: null, dash: null, air: null, out: null,
    blink: null, charge: null, orbs: null, tether: null, chan: null, ret: null, empower: 0,
    // Counters that make projectile and zone ids agree on both ends of a network match.
    projN: 0, zoneN: 0,
    phase: side * 2.1, tumble: 0, launch: 0, guard: 0, slow: 0, hitCd: 0,
    up: 0,                 // knocked into the air: helpless until it runs out
    ground: 0,             // stuck in adhesive: slower still, no dashes
    mark: 0, scar: 0, poison: 0, bleed: 0, bleedT: 0,
    shield: 0, shieldT: 0, buff: 0,
    stack: 0, stackT: 0,   // per-blade counter: wind stacks, shots fired, dashes chained
    last: 0,               // key index of the last basic skill used (for MIMIC)
    toggle: false,
    dmark: 0, dacc: 0,     // death mark: time left and damage stored
    egg: 0, eggHp: 0, eggUsed: false,
    dot: 0, dotT: 0, drop: 0, // bookkeeping only; not sent over the network
    cd: { Q: 0, W: 0, E: 0, R: 0 },
    re: { Q: 0, W: 0, E: 0, R: 0 }, // recast windows
    windup: { Q: 0, W: 0, E: 0, R: 0 },
    ult: 0, lastHit: null,
    stats: { dealt: 0, taken: 0, clashes: 0, skillHits: 0, parries: 0, maxHit: 0 },
  };
}

export const targetable = (t) => !t.air && !t.out && !t.blink;
export const spinRatio = (t) => Math.max(0, t.spin / t.spinMax);
// Tops with little spin left are thrown further.
export const kbMul = (t) => 1 + 0.85 * (1 - spinRatio(t));
// Nothing moves it: braced for a blast, or inside the egg.
const fixed = (t) => !!((t.charge && t.charge.skill.root) || t.egg > 0);
// Held in place for now, though a hit may still throw it.
export const rooted = (t) => fixed(t) || !!t.chan || t.up > 0;

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
  const B = t.buff > 0 && t.blade.buff;
  const slow = (t.ground > 0 ? 0.4 : t.slow > 0 ? 0.6 : 1) * ((B && B.speed) || 1);
  const held = rooted(t);
  // Steeper near the middle than a plain bowl, so orbits of different size drift out of step.
  const well = ARENA.K * (0.55 + 3.2 / (Math.hypot(t.x, t.z) + 1.5));
  let ax = -well * t.x, az = -well * t.z;
  let drag = 0.15;
  if (t.spin <= 0) {
    drag = 2.2;
  } else if (held) {
    drag = 9;
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
  if (t.spin > 0 && t.tumble <= 0 && !t.cmd && !held) {
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
    ground: t.ground, buff: t.buff, up: t.up, egg: t.egg, chan: t.chan,
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
      g.up = Math.max(0, g.up - h);
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

// Fills in what a zone's kind implies. Also used when one arrives over the network.
export function initZone(z) {
  const S = (z.skill = SKILLS[z.kind]);
  z.r = (z.c && S.bigAoe) || S.aoe || S.radius || 1;
  z.T = z.kind === 'divide' ? S.travel / S.speed + S.hold : (z.c && S.bigDur) || S.dur || S.delay || 1;
  if (S.grow) z.r = Math.min(S.aoe, S.r0 + ((S.aoe - S.r0) * z.t) / S.grow); // a storm that is still spreading
  return z;
}

// A wall zone as a line: its middle, its facing (nx, nz) and whether it is
// still on the move. The wall itself runs across the facing.
export function wallOf(z) {
  if (z.kind !== 'divide') return { x: z.x, z: z.z, nx: z.dx, nz: z.dz, moving: false };
  const S = z.skill, adv = Math.min(z.t * S.speed, S.travel);
  return { x: z.x + z.dx * adv, z: z.z + z.dz * adv, nx: z.dx, nz: z.dz, moving: adv < S.travel };
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
  // Live zones of one kind placed by `t`.
  own(t, kind) { return this.zones.filter((q) => q.owner === t && q.kind === kind && !q.dead); }

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
      t.cmd = t.cast = t.dash = t.air = t.out = t.blink = t.charge = t.orbs = t.tether = t.chan = t.ret = null;
      t.tumble = t.launch = t.guard = t.slow = t.hitCd = t.empower = 0;
      t.up = t.ground = t.mark = t.scar = t.poison = t.bleed = t.bleedT = t.shield = t.shieldT = t.buff = 0;
      t.stack = t.stackT = t.last = t.dmark = t.dacc = t.egg = t.eggHp = t.dot = t.dotT = t.drop = 0;
      t.toggle = t.eggUsed = false;
      t.lastHit = null;
      for (const k of KEYS) { t.cd[k] = k === 'R' ? 0 : 1.2; t.re[k] = 0; }
    }
  }

  issueMove(t, x, z) {
    if (this.result || t.air || t.out || t.dash || t.blink || rooted(t)) return false;
    const lim = ARENA.R - t.radius - 0.2;
    const r = Math.hypot(x, z);
    if (r > lim) { x *= lim / r; z *= lim / r; }
    t.cmd = { x, z, t: 2.2 };
    return true;
  }

  // States that block every skill, whatever its cooldown.
  busy(t) {
    return !!(this.result || t.spin <= 0 || t.air || t.out || t.cast || t.dash || t.blink || t.charge || t.chan || t.up > 0 || t.egg > 0);
  }

  // The skill a key would cast right now: its second stage while the recast
  // window is open, the tornado once the wind is stacked, the copy for MIMIC.
  aimSkill(t, key) {
    const S = skillOf(t, key);
    if (S.re && t.re[key] > 0) return SKILLS[S.re];
    if (S.id === 'mimic') return SKILLS[t.blade.kit[KEYS[t.last]]];
    if (S.id === 'galeq' && t.stack >= S.stacks) return SKILLS.tornado;
    return S;
  }

  // Off cooldown (within `slack` seconds) and, for an ultimate, charged.
  ready(t, key, slack = 0) {
    const S = skillOf(t, key);
    if (S.re && t.re[key] > 0) return true;
    return t.cd[key] <= slack && (!S.ult || t.ult >= 100);
  }

  // Why a skill that is otherwise ready cannot be used here and now, as a
  // short label for the player; null when nothing stands in the way.
  blocked(t, key) {
    const S = this.aimSkill(t, key), o = this.other(t);
    const d = Math.hypot(o.x - t.x, o.z - t.z);
    if (S.need === 'range' && !(targetable(o) && d <= S.range && !(S.id === 'fling' && o.egg > 0))) return '射程外';
    if (S.need === 'up' && !(targetable(o) && o.up > 0 && d <= S.range)) return '打ち上げ中のみ';
    if (S.need === 'soldier' && !this.own(t, 'arise').length) return '砂兵がいない';
    if (t.ground > 0 && (MOBILE.has(S.aim) || S.id === 'shift')) return '粘着中';
    return null;
  }

  canCast(t, key) {
    if (this.busy(t) || !this.ready(t, key)) return false;
    if (skillOf(t, key).id !== 'aegis' && t.tumble > 0) return false;
    return !this.blocked(t, key);
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
    const base = skillOf(t, key), S = this.aimSkill(t, key);
    const re = !!(base.re && t.re[key] > 0);
    if (re) {
      t.re[key] = 0;
    } else {
      t.cd[key] = base.cd * t.blade.cdMul;
      if (base.ult) t.ult = 0; else t.last = KEYS.indexOf(key);
      if (base.id === 'mimic') t.buff = base.dur;
    }
    let dx = ax - t.x, dz = az - t.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.01) { dx = 0; dz = t.side === 0 ? -1 : 1; } else { dx /= d; dz /= d; }
    const wind = re ? 0 : t.windup[key];
    const c = { key, skill: S, re, t: wind, T: wind, dx, dz, ax, az, dist: d };
    if (S.aim === 'ground' || S.aim === 'leap') { const m = this.groundTarget(t, S, ax, az); c.ax = m.x; c.az = m.z; }
    this.emit('cast', { top: t, key, skill: S, base, ult: !!base.ult && !re, windup: c.T, dx, dz, ax: c.ax, az: c.az });
    if (c.t <= 0) this.execute(t, c); else t.cast = c;
    return true;
  }

  fire(t, S, dx, dz, o = {}) {
    const p = {
      id: t.side * 30000 + (t.projN = (t.projN + 1) % 30000), skill: S, owner: t,
      x: (o.x ?? t.x) + dx * 0.9, z: (o.z ?? t.z) + dz * 0.9, dx, dz,
      speed: S.speed, left: S.range, r: S.radius, dmg: (o.dmg ?? S.dmg) * t.blade.atk, hit: false, dead: false,
    };
    this.projectiles.push(p);
    if (!o.quiet) this.emit('shoot', { top: t, proj: p });
    return p;
  }

  // Several shots spread evenly across the skill's cone.
  fan(t, S, dx, dz, n, o = {}) {
    const a0 = Math.atan2(dz, dx);
    for (let i = 0; i < n; i++) {
      const a = a0 + (n > 1 ? ((i / (n - 1)) * 2 - 1) * S.half : 0);
      this.fire(t, S, Math.cos(a), Math.sin(a), { ...o, quiet: i > 0 });
    }
  }

  zone(t, S, x, z, o, quiet) {
    if (S.max) {
      const mine = this.own(t, S.id);
      while (mine.length >= S.max) this.endZone(mine.shift());
    }
    const q = initZone({ id: t.side * 30000 + (t.zoneN = (t.zoneN + 1) % 30000), kind: S.id, owner: t, x, z, dx: 0, dz: 0, t: 0, a: 0, b: 0, c: 0, ...o });
    this.zones.push(q);
    if (!quiet) this.emit('zone', { zone: q, top: t });
    return q;
  }

  endZone(q) {
    if (q.dead) return;
    q.dead = true;
    this.emit('zoneEnd', { zone: q });
  }

  startDash(t, S, dx, dz, dist) {
    t.dash = { dx, dz, speed: S.speed, t: dist / S.speed, skill: S, hit: false };
    t.cmd = null;
    this.emit('dash', { top: t, dx, dz, dist });
  }

  stopDash(t) {
    const d = t.dash;
    if (!d) return;
    t.dash = null;
    this.dashDone(t, d);
  }

  // What a dash does when it stops, however it stopped.
  dashDone(t, d) {
    const S = d.skill;
    if (S.id === 'brokenwings' && t.stack >= 3) {
      t.stack = 0;
      this.burst(t, S, t.x, t.z, S.aoe, { dmg: S.slam, as: { up: S.slamUp } });
    } else if (S.id === 'distort') {
      this.burst(t, S, t.x, t.z, S.aoe);
    }
  }

  // Closes the recast window of one of `t`'s skills.
  unre(t, id) {
    for (const k of KEYS) if (skillOf(t, k).id === id) t.re[k] = 0;
  }

  // True if `opp` stands in the cone from `t` along (dx, dz).
  inCone(t, opp, dx, dz, S) {
    if (!targetable(opp)) return false;
    const ox = opp.x - t.x, oz = opp.z - t.z, d = Math.hypot(ox, oz);
    // The cone is widened by the target's own size so grazing hits count.
    const ang = Math.acos(clamp((ox * dx + oz * dz) / (d || 1), -1, 1));
    const pad = Math.atan2(opp.radius * 0.8, Math.max(d, 0.5));
    return d < S.range + opp.radius * 0.6 && ang < S.half + pad;
  }

  // Hits the other top if it stands within `r` of (x, z). Returns the damage.
  burst(t, S, x, z, r, o = {}) {
    const opp = this.other(t);
    let hit = 0;
    if (targetable(opp) && !this.result) {
      let dx = opp.x - x, dz = opp.z - z;
      const d = Math.hypot(dx, dz);
      if (d < r + opp.radius * 0.5) {
        if (d < 0.05) { dx = 1; dz = 0; } else { dx /= d; dz /= d; }
        const g = opp.guard > 0 ? 0.3 : 1;
        hit = this.hurt(opp, ((o.dmg ?? S.dmg) * g * t.blade.atk) / opp.blade.def, t, S.id);
        if (g === 1) this.affect(t, opp, o.as || S, dx, dz);
        t.stats.skillHits++;
      }
    }
    this.emit('blast', { top: t, skill: S, x, z, r, hit, target: hit ? opp : null });
    return hit;
  }

  execute(t, c) {
    const S = c.skill, opp = this.other(t);
    // TURRET ENGINEER's ultimate upgrades the next basic skill.
    const big = !!(S.big && t.blade.id === 'gear' && t.buff > 0);
    if (big) t.buff = 0;
    switch (S.id) {
      case 'sonic': case 'anchor': case 'galeq': case 'frostbite': case 'sigil': case 'ethereal': case 'flourish':
        this.fire(t, S, c.dx, c.dz);
        break;
      case 'tornado':
        t.stack = 0;
        this.fire(t, S, c.dx, c.dz);
        break;
      case 'shuriken':
        this.fire(t, S, c.dx, c.dz);
        // Every shadow throws at the same spot.
        for (const q of this.own(t, 'shadow')) {
          const dx = c.ax - q.x, dz = c.az - q.z, d = Math.hypot(dx, dz);
          if (d > 0.5) this.fire(t, S, dx / d, dz / d, { x: q.x, z: q.z, quiet: true });
        }
        break;
      case 'fourshot':
        t.stack++;
        if (t.stack >= S.shots) {
          t.stack = 0;
          t.cd[c.key] = S.reload * t.blade.cdMul;
          this.fire(t, SKILLS.fourth, c.dx, c.dz);
        } else this.fire(t, S, c.dx, c.dz);
        break;
      case 'flashfrost': {
        const p = this.fire(t, S, c.dx, c.dz);
        t.re[c.key] = p.left / p.speed + 0.2;
        break;
      }
      case 'shatter': {
        const p = this.projectiles.find((q) => q.owner === t && q.skill.id === 'flashfrost' && !q.dead);
        if (p) this.shatter(p);
        break;
      }
      case 'rockets':
        this.fan(t, S, c.dx, c.dz, big ? S.bigFan : S.fan);
        break;
      case 'windslash':
        this.fan(t, S, c.dx, c.dz, S.fan);
        break;
      case 'blitz': case 'sweep': case 'guillotine':
        this.startDash(t, S, c.dx, c.dz, clamp(c.dist, S.minDist, S.dist));
        break;
      case 'brokenwings':
        t.stack = c.re ? t.stack + 1 : 1;
        t.stackT = S.window + 1;
        if (t.stack < 3) t.re[c.key] = S.window;
        this.startDash(t, S, c.dx, c.dz, clamp(c.dist, S.minDist, S.dist));
        break;
      case 'valor':
        t.shield = S.shield; t.shieldT = S.hold;
        this.startDash(t, S, c.dx, c.dz, clamp(c.dist, S.minDist, S.dist));
        this.emit('buff', { top: t, skill: S });
        break;
      case 'distort':
        t.ret = { x: t.x, z: t.z };
        t.re[c.key] = S.window;
        this.startDash(t, S, c.dx, c.dz, clamp(c.dist, S.minDist, S.dist));
        break;
      case 'recall':
        if (t.ret) {
          const fx = t.x, fz = t.z;
          t.x = t.ret.x; t.z = t.ret.z; t.vx = t.vz = 0; t.cmd = null; t.ret = null;
          this.emit('warp', { top: t, fx, fz });
        }
        break;
      case 'shift': {
        let best = null, bd = 1e9;
        for (const q of this.own(t, 'arise')) { const d = Math.hypot(q.x - t.x, q.z - t.z); if (d < bd) { bd = d; best = q; } }
        if (best && bd > 0.5) this.startDash(t, S, (best.x - t.x) / bd, (best.z - t.z) / bd, bd);
        break;
      }
      case 'phantom': {
        const dist = clamp(c.dist, 2, S.range);
        t.blink = { dx: c.dx, dz: c.dz, speed: S.speed, t: dist / S.speed, skill: S };
        t.cmd = null; t.tumble = 0;
        this.emit('blink', { top: t, dx: c.dx, dz: c.dz, dist });
        break;
      }
      case 'meteor':
        t.air = { t: 0, T: S.air, sx: t.x, sz: t.z, tx: c.ax, tz: c.az, skill: S, by: t.side };
        t.cmd = null; t.vx = t.vz = 0;
        this.emit('leap', { top: t, tx: c.ax, tz: c.az, T: S.air });
        break;
      case 'quake': case 'glue': case 'blizzard': case 'lotus':
        this.zone(t, S, c.ax, c.az);
        break;
      case 'grenade':
        this.zone(t, S, c.ax, c.az, { c: big ? 1 : 0 });
        break;
      case 'turret':
        this.zone(t, S, c.ax, c.az, { c: big ? 1 : 0, b: 0.5 });
        break;
      case 'arise':
        this.zone(t, S, c.ax, c.az, { b: 0.4 });
        break;
      case 'shadow':
        // c marks the shadow the recast swaps with.
        for (const q of this.own(t, 'shadow')) q.c = 0;
        this.zone(t, S, c.ax, c.az, { c: 1 });
        t.re[c.key] = S.dur;
        break;
      case 'swap': {
        const q = this.own(t, 'shadow').find((s) => s.c) || this.own(t, 'shadow')[0];
        if (q) {
          const fx = t.x, fz = t.z;
          t.x = q.x; t.z = q.z; q.x = fx; q.z = fz; t.cmd = null;
          this.emit('warp', { top: t, fx, fz });
        }
        break;
      }
      case 'icewall':
        this.zone(t, S, c.ax, c.az, { dx: c.dx, dz: c.dz });
        break;
      case 'windwall':
        this.zone(t, S, t.x + c.dx * S.ahead, t.z + c.dz * S.ahead, { dx: c.dx, dz: c.dz });
        break;
      case 'divide':
        this.zone(t, S, t.x - c.dx * S.back, t.z - c.dz * S.back, { dx: c.dx, dz: c.dz });
        break;
      case 'conquer': {
        const own = this.own(t, 'arise');
        // Side by side, so two soldiers do not end up on one spot.
        own.forEach((q, i) => {
          const off = (i - (own.length - 1) / 2) * 1.6;
          q.dx = c.ax - c.dz * off; q.dz = c.az + c.dx * off; q.c = 1;
        });
        this.emit('buff', { top: t, skill: S });
        break;
      }
      case 'slash': {
        const spots = [{ x: t.x, z: t.z, sh: false }, ...this.own(t, 'shadow').map((q) => ({ x: q.x, z: q.z, sh: true }))];
        let from = null, hit = 0;
        if (targetable(opp)) {
          for (const p of spots) if (Math.hypot(opp.x - p.x, opp.z - p.z) < S.aoe + opp.radius * 0.5 && (!from || p.sh)) from = p;
        }
        if (from) {
          const g = opp.guard > 0 ? 0.3 : 1;
          hit = this.hurt(opp, (S.dmg * g * t.blade.atk) / opp.blade.def, t, 'slash');
          if (g === 1) {
            const dx = opp.x - from.x, dz = opp.z - from.z, d = Math.hypot(dx, dz) || 1;
            this.affect(t, opp, S, dx / d, dz / d);
            if (from.sh) opp.slow = Math.max(opp.slow, S.shadowSlow);
          }
          t.stats.skillHits++;
        }
        for (const p of spots) this.emit('blast', { top: t, skill: S, x: p.x, z: p.z, r: S.aoe, hit: p === from ? hit : 0, target: p === from && hit ? opp : null });
        break;
      }
      case 'kiburst':
        this.burst(t, S, t.x, t.z, S.aoe);
        break;
      case 'deathmark': {
        const fx = t.x, fz = t.z;
        let dx = opp.x - t.x, dz = opp.z - t.z;
        const d = Math.hypot(dx, dz) || 1;
        dx /= d; dz /= d;
        this.zone(t, SKILLS.shadow, fx, fz);
        // Out the far side of the target, or as near to it as the wall allows.
        let x = opp.x + dx * S.gap, z = opp.z + dz * S.gap;
        const lim = ARENA.R - t.radius - 0.2, r = Math.hypot(x, z);
        if (r > lim) { x *= lim / r; z *= lim / r; }
        t.x = x; t.z = z; t.vx = t.vz = 0; t.cmd = null;
        t.dmark = S.dur; t.dacc = 0;
        this.emit('warp', { top: t, fx, fz });
        this.emit('say', { top: opp, text: 'DEATH MARK', tone: 'red' });
        break;
      }
      case 'lastbreath': {
        // Arrive on the centre side, so the slam throws the target at the wall.
        let nx = opp.x, nz = opp.z, n = Math.hypot(nx, nz);
        if (n < 0.5) { nx = opp.x - t.x; nz = opp.z - t.z; n = Math.hypot(nx, nz) || 1; }
        nx /= n; nz /= n;
        const fx = t.x, fz = t.z;
        t.x = opp.x - nx * S.gap; t.z = opp.z - nz * S.gap; t.vx = t.vz = 0; t.cmd = null;
        opp.up = 0;
        const hit = this.hurt(opp, (S.dmg * t.blade.atk) / opp.blade.def, t, 'lastbreath');
        this.knock(opp, nx, nz, S.kb, 0.6, 2);
        t.stats.skillHits++;
        this.emit('warp', { top: t, fx, fz });
        this.emit('blast', { top: t, skill: S, x: opp.x, z: opp.z, r: 4, hit, target: opp });
        break;
      }
      case 'curtaincall':
        t.chan = { t: 0, n: 0, dx: c.dx, dz: c.dz, skill: S };
        t.cmd = null;
        this.emit('chan', { top: t, dx: c.dx, dz: c.dz });
        break;
      case 'aegis':
        t.guard = S.dur * t.blade.guardMul;
        this.emit('guard', { top: t, dur: t.guard });
        break;
      case 'nova': case 'decimate':
        t.charge = { t: 0, T: S.charge, skill: S };
        if (S.root) t.cmd = null;
        this.emit('charge', { top: t, T: S.charge, skill: S });
        break;
      case 'cripple':
        t.empower = S.empower;
        this.emit('buff', { top: t, skill: S });
        break;
      case 'flare': {
        let hit = 0;
        if (this.inCone(t, opp, c.dx, c.dz, S)) {
          hit = this.hurt(opp, (S.dmg * t.blade.atk * (opp.guard > 0 ? 0.3 : 1)) / opp.blade.def, t, 'flare');
          t.spin = Math.min(t.spinMax, t.spin + hit * S.heal);
          if (opp.guard <= 0) this.knock(opp, c.dx, c.dz, S.kb, 0.25, 0.8);
          t.stats.skillHits++;
        }
        this.emit('flare', { top: t, dx: c.dx, dz: c.dz, hit, heal: hit * S.heal, target: opp });
        break;
      }
      case 'apprehend': {
        let hit = 0;
        if (this.inCone(t, opp, c.dx, c.dz, S)) {
          const g = opp.guard > 0 ? 0.3 : 1;
          hit = this.hurt(opp, (S.dmg * g * t.blade.atk) / opp.blade.def, t, 'apprehend');
          if (g === 1) { this.pull(opp, t, S.pull); this.affect(t, opp, S, 0, 0); }
          t.stats.skillHits++;
        }
        this.emit('cone', { top: t, skill: S, dx: c.dx, dz: c.dz, hit, target: hit ? opp : null });
        break;
      }
      case 'fling': {
        // Over the shoulder: the target lands on the far side of the thrower.
        let dx = t.x - opp.x, dz = t.z - opp.z;
        const d = Math.hypot(dx, dz) || 1;
        let x = t.x + (dx / d) * S.dist, z = t.z + (dz / d) * S.dist;
        const lim = ARENA.R - 1.6, r = Math.hypot(x, z);
        if (r > lim) { x *= lim / r; z *= lim / r; }
        opp.air = { t: 0, T: S.air, sx: opp.x, sz: opp.z, tx: x, tz: z, skill: S, by: t.side };
        opp.cmd = opp.dash = opp.cast = opp.chan = opp.charge = null; opp.vx = opp.vz = 0; opp.up = 0;
        this.emit('fling', { top: t, target: opp, tx: x, tz: z });
        break;
      }
      case 'poison':
        t.toggle = !t.toggle; t.drop = 0;
        this.emit('buff', { top: t, skill: S, off: !t.toggle });
        break;
      case 'insanity': case 'upgrade':
        t.buff = S.dur;
        this.emit('buff', { top: t, skill: S });
        break;
      case 'exile':
        t.buff = S.dur; t.re[c.key] = S.dur;
        this.emit('buff', { top: t, skill: S });
        break;
      case 'sanctuary':
        this.zone(t, S, t.x, t.z);
        break;
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
    const foe = from && from !== t;
    if (foe && kind !== 'dot' && kind !== 'wall') {
      const B = from.buff > 0 && from.blade.buff;
      if (B && B.atk) dmg *= B.atk;
      if (from.blade.might && t.bleed >= BLEED.max) dmg *= from.blade.might;
    }
    if (t.charge) dmg *= t.charge.skill.armor ?? 1;
    const B = t.buff > 0 && t.blade.buff;
    if (B && B.armor) dmg *= B.armor;
    if (t.shield > 0) {
      const s = Math.min(t.shield, dmg);
      t.shield -= s; dmg -= s;
      if (dmg <= 0) return 0;
    }
    if (t.egg > 0) {
      t.eggHp -= dmg;
      if (t.eggHp <= 0) { t.egg = 0; t.spin = 0; }
    } else t.spin -= dmg;
    t.stats.taken += dmg;
    t.ult = Math.min(100, t.ult + dmg * 0.06);
    if (from) {
      from.stats.dealt += dmg;
      from.stats.maxHit = Math.max(from.stats.maxHit, dmg);
      if (kind !== 'drain') from.ult = Math.min(100, from.ult + dmg * 0.085);
    }
    if (kind === 'dot') return dmg;
    if (foe) {
      t.scar = SCAR;
      if (from.dmark > 0 && kind !== 'deathmark') from.dacc += dmg;
    }
    t.lastHit = { dmg, time: this.time, kind };
    return dmg;
  }

  // Damage over time. It is reported in half-second chunks (see updateTop) so
  // the HUD shows a few readable numbers, not a blur.
  dot(v, dmg, from) { v.dot += this.hurt(v, dmg, from, 'dot'); }

  // Throws `v` along (dx, dz) and cancels whatever it was doing.
  knock(v, dx, dz, speed, tumble, launch) {
    if (fixed(v)) return;
    const k = (speed * kbMul(v)) / Math.sqrt(v.mass);
    v.vx = dx * k; v.vz = dz * k;
    v.tumble = Math.max(v.tumble, tumble);
    if (launch > 0) v.launch = Math.max(v.launch, launch);
    v.cmd = null; v.dash = null; v.cast = null; v.chan = null;
  }

  // A light shove that interrupts nothing.
  push(v, dx, dz, speed) {
    if (fixed(v)) return;
    const k = (speed * kbMul(v)) / Math.sqrt(v.mass);
    v.vx += dx * k; v.vz += dz * k;
  }

  // Dragged toward `to`, never far enough to overshoot.
  pull(v, to, speed) {
    if (fixed(v)) return;
    const dx = to.x - v.x, dz = to.z - v.z, d = Math.hypot(dx, dz) || 1;
    const sp = Math.min(speed, d * 3.2);
    v.vx = (dx / d) * sp; v.vz = (dz / d) * sp;
    v.tumble = Math.max(v.tumble, 0.5); v.cmd = null; v.dash = null; v.cast = null; v.chan = null;
  }

  stun(v, T) {
    if (fixed(v)) return;
    v.tumble = Math.max(v.tumble, T);
    v.cmd = null; v.dash = null; v.cast = null; v.chan = null;
    this.emit('say', { top: v, text: 'STUN', tone: 'red' });
  }

  // Knocked into the air: it hangs where it is and can do nothing.
  lift(v, T) {
    if (fixed(v)) return;
    v.up = Math.max(v.up, T);
    v.vx = v.vz = 0;
    v.cmd = null; v.dash = null; v.cast = null; v.chan = null;
    this.emit('say', { top: v, text: 'KNOCK UP', tone: 'red' });
  }

  bleed(v, n) {
    const was = v.bleed;
    v.bleed = Math.min(BLEED.max, v.bleed + n);
    v.bleedT = BLEED.dur;
    if (v.bleed === BLEED.max && was < BLEED.max) this.emit('say', { top: v, text: 'HEMORRHAGE', tone: 'red' });
  }

  // Everything a landed skill does besides its own damage. `shove` is off for
  // body hits, which throw the target themselves.
  affect(s, v, S, dx, dz, shove = true) {
    // A sigil goes off on the next skill that lands.
    if (v.mark > 0) {
      v.mark = 0;
      const dmg = this.hurt(v, (SKILLS.sigil.pop * s.blade.atk) / v.blade.def, s, 'sigil');
      this.emit('strike', { top: v, src: s, skill: SKILLS.sigil, x: v.x, z: v.z, dmg });
    }
    if (S.mark) v.mark = S.mark;
    if (S.kb && shove) {
      if (S.tumble === 0) this.push(v, dx, dz, S.kb);
      else this.knock(v, dx, dz, S.kb, S.tumble ?? 0.35, S.launch ?? 1.5);
    }
    if (S.stun) this.stun(v, S.stun);
    if (S.up) this.lift(v, S.up);
    if (S.slow) v.slow = Math.max(v.slow, S.slow);
    if (S.bleed) this.bleed(v, S.bleed);
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
    this.barriers(a);
    this.barriers(b);
    this.walls(a);
    this.walls(b);
    this.updateProjectiles(dt);
    this.updateZones(dt);
    if (!this.result) {
      for (const t of this.tops) {
        if (t.spin > 0 || t.out) continue;
        // FROST PHOENIX gets one second chance per round.
        if (t.blade.egg && !t.eggUsed) { this.layEgg(t); continue; }
        t.spin = 0;
        const h = t.lastHit;
        const burst = h && this.time - h.time < 0.35 && h.dmg >= 55;
        this.finish(this.other(t), t, burst ? 'burst' : 'spin');
        break;
      }
    }
  }

  layEgg(t) {
    const E = t.blade.egg;
    t.eggUsed = true; t.egg = E.dur; t.eggHp = E.hp; t.spin = 1;
    t.cmd = t.dash = t.cast = t.chan = t.charge = null;
    t.vx = t.vz = 0; t.up = 0; t.tumble = 0;
    this.emit('egg', { top: t });
  }

  updateTop(t, dt, opp) {
    for (const k of KEYS) { t.cd[k] = Math.max(0, t.cd[k] - dt); t.re[k] = Math.max(0, t.re[k] - dt); }
    t.tumble = Math.max(0, t.tumble - dt);
    t.launch = Math.max(0, t.launch - dt);
    t.slow = Math.max(0, t.slow - dt);
    t.hitCd = Math.max(0, t.hitCd - dt);
    t.empower = Math.max(0, t.empower - dt);
    t.up = Math.max(0, t.up - dt);
    t.ground = Math.max(0, t.ground - dt);
    t.mark = Math.max(0, t.mark - dt);
    t.scar = Math.max(0, t.scar - dt);
    t.poison = Math.max(0, t.poison - dt);
    t.buff = Math.max(0, t.buff - dt);
    if (t.shieldT > 0) { t.shieldT -= dt; if (t.shieldT <= 0) { t.shieldT = 0; t.shield = 0; } }
    if (t.bleedT > 0) { t.bleedT -= dt; if (t.bleedT <= 0) { t.bleedT = 0; t.bleed = 0; } }
    if (t.stackT > 0) { t.stackT -= dt; if (t.stackT <= 0) { t.stackT = 0; t.stack = 0; } }
    if (t.guard > 0) {
      t.guard -= dt;
      if (t.guard <= 0) { t.guard = 0; this.emit('guardEnd', { top: t }); }
    }
    if (t.egg > 0) {
      t.egg -= dt;
      if (t.egg <= 0 && !this.result) {
        t.egg = 0; t.spin = t.spinMax * t.blade.egg.back;
        this.emit('rebirth', { top: t });
      }
    } else if (!this.result && t.spin > 0) {
      t.spin -= t.blade.decay * dt;
      t.ult = Math.min(100, t.ult + 0.8 * dt);
      const B = t.buff > 0 && t.blade.buff;
      if (B && B.regen) t.spin = Math.min(t.spinMax, t.spin + B.regen * dt);
    }
    if (!this.result) {
      if (t.poison > 0) this.dot(t, (SKILLS.poison.dps * dt * opp.blade.atk) / t.blade.def, opp);
      if (t.bleed > 0) this.dot(t, (BLEED.dps * t.bleed * dt * opp.blade.atk) / t.blade.def, opp);
    }
    t.dotT += dt;
    if (t.dotT >= 0.5) {
      if (t.dot >= 1) this.emit('dot', { top: t, dmg: t.dot });
      t.dot = 0; t.dotT = 0;
    }
    if (t.dmark > 0) {
      t.dmark -= dt;
      if (t.dmark <= 0) {
        t.dmark = 0;
        const S = SKILLS.deathmark;
        if (!this.result && !opp.out) {
          const hit = this.hurt(opp, (S.pop * t.blade.atk) / opp.blade.def + t.dacc * S.share, t, 'deathmark');
          this.emit('blast', { top: t, skill: S, x: opp.x, z: opp.z, r: 3, hit, target: opp });
        }
        t.dacc = 0;
      }
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
      t.charge = t.tether = t.orbs = t.chan = null;
      t.toggle = false;
    }
    if (t.toggle) {
      // POISON TRAIL: paid for in spin, and it shuts itself off before that runs dry.
      const S = SKILLS.poison;
      if (t.spin <= S.cost * 3 || t.egg > 0) t.toggle = false;
      else {
        t.spin -= S.cost * dt;
        t.drop -= dt;
        if (t.drop <= 0) { t.drop = S.every; this.zone(t, S, t.x, t.z, null, true); }
      }
    }
    if (t.charge) {
      t.charge.t += dt;
      if (t.charge.t >= t.charge.T) this.chargeDone(t, opp);
    }
    if (t.chan) this.updateChan(t, opp, dt);
    if (t.orbs) this.updateOrbs(t, opp, dt);
    if (t.tether) this.updateTether(t, opp, dt);
    const blink = t.blink, dash = t.dash;
    moveTop(t, dt, opp);
    if (blink && !t.blink) {
      if (blink.skill.empower) t.empower = blink.skill.empower;
      this.emit('blinkEnd', { top: t });
    }
    if (dash && !t.dash) this.dashDone(t, dash);
  }

  land(t, opp) {
    const a = t.air, S = a.skill, x = a.tx, z = a.tz;
    t.air = null; t.x = x; t.z = z; t.vx = t.vz = 0;
    if (S.id === 'fling') {
      const by = this.tops[a.by];
      t.tumble = Math.max(t.tumble, 0.3);
      const hit = this.hurt(t, (S.dmg * by.blade.atk) / t.blade.def, by, 'fling');
      if (this.own(by, 'glue').some((q) => Math.hypot(q.x - x, q.z - z) < q.r)) this.stun(t, S.stun);
      by.stats.skillHits++;
      this.emit('blast', { top: by, skill: S, x, z, r: 2.2, hit, target: t });
      return;
    }
    t.tumble = 0.2;
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

  chargeDone(t, opp) {
    const S = t.charge.skill;
    if (S.id === 'nova') { this.novaBlast(t, opp); return; }
    t.charge = null;
    // DECIMATE: the edge of the axe is the outer ring.
    let hit = 0, heal = 0;
    if (targetable(opp)) {
      const d = Math.hypot(opp.x - t.x, opp.z - t.z);
      if (d < S.aoe + opp.radius * 0.5) {
        const outer = d >= S.inner, g = opp.guard > 0 ? 0.3 : 1;
        hit = this.hurt(opp, ((outer ? S.dmg : S.weak) * g * t.blade.atk) / opp.blade.def, t, 'decimate');
        if (g === 1) this.affect(t, opp, S, 0, 0);
        if (outer) { heal = S.heal * (t.spinMax - t.spin); t.spin += heal; }
        t.stats.skillHits++;
      }
    }
    this.emit('blast', { top: t, skill: S, x: t.x, z: t.z, r: S.aoe, hit, target: hit ? opp : null });
    if (heal >= 1) this.emit('heal', { top: t, amount: heal });
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

  // CURTAIN CALL: shots at a fixed beat, each turned toward the target as far
  // as the cone chosen at the start allows.
  updateChan(t, opp, dt) {
    const ch = t.chan, S = ch.skill;
    ch.t += dt;
    if (ch.t < S.first + ch.n * S.every) return;
    const shot = ch.n === S.shots - 1 ? SKILLS.curtainlast : SKILLS.curtainshot;
    let a = Math.atan2(ch.dz, ch.dx);
    if (targetable(opp)) {
      const lead = Math.hypot(opp.x - t.x, opp.z - t.z) / shot.speed;
      const want = Math.atan2(opp.z + opp.vz * lead - t.z, opp.x + opp.vx * lead - t.x);
      const off = Math.atan2(Math.sin(want - a), Math.cos(want - a));
      a += clamp(off, -S.half, S.half);
    }
    this.fire(t, shot, Math.cos(a), Math.sin(a));
    ch.n++;
    if (ch.n >= S.shots) { t.chan = null; this.emit('chanEnd', { top: t }); }
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
    const gone = !targetable(opp) || d > S.breakRange;
    if (S.id === 'ethereal') {
      // Nothing happens while the chain holds; it pays off only if it lasts.
      if (!gone && th.t < th.T) return;
      t.tether = null;
      if (!gone) {
        const dmg = this.hurt(opp, (S.pop * t.blade.atk) / opp.blade.def, t, 'ethereal');
        this.stun(opp, S.root);
        this.emit('strike', { top: opp, src: t, skill: S, x: opp.x, z: opp.z, dmg });
      }
      this.emit('tetherEnd', { top: t, broke: gone });
      return;
    }
    if (th.t >= th.T || gone) {
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
      if (z.dead) continue;
      z.t += dt;
      const t = z.owner, opp = this.other(t), S = z.skill;
      const live = targetable(opp) && !this.result;
      const d = Math.hypot(opp.x - z.x, opp.z - z.z);
      switch (z.kind) {
        case 'quake': {
          if (z.t < z.T) break;
          z.dead = true;
          let hit = 0;
          if (live && d < z.r + opp.radius * 0.5) {
            let dx = opp.x - z.x, dz = opp.z - z.z;
            if (d < 0.05) { dx = 0; dz = 1; } else { dx /= d; dz /= d; }
            const g = opp.guard > 0 ? 0.3 : 1;
            hit = this.hurt(opp, (S.dmg * g * t.blade.atk) / opp.blade.def, t, 'quake');
            if (g === 1) this.knock(opp, dx, dz, S.kb, S.stun, 0);
            t.stats.skillHits++;
          }
          this.emit('quake', { top: t, x: z.x, z: z.z, r: z.r, hit, target: hit ? opp : null });
          break;
        }
        case 'grenade': {
          if (z.t < z.T) break;
          z.dead = true;
          let hit = 0;
          if (live && d < z.r + opp.radius * 0.5) {
            const g = opp.guard > 0 ? 0.3 : 1;
            hit = this.hurt(opp, ((z.c ? S.bigDmg : S.dmg) * g * t.blade.atk) / opp.blade.def, t, 'grenade');
            if (g === 1) { if (z.c || d < S.core) this.stun(opp, S.stun); else opp.slow = Math.max(opp.slow, S.slow); }
            t.stats.skillHits++;
          }
          // Its own turrets caught in the blast overclock.
          for (const q of this.own(t, 'turret')) if (Math.hypot(q.x - z.x, q.z - z.z) < z.r) q.a = S.boost;
          this.emit('blast', { top: t, skill: S, x: z.x, z: z.z, r: z.r, hit, target: hit ? opp : null });
          break;
        }
        case 'sanctuary':
          // a: spin healed since the last report, b: time since then
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          if (!t.out && !t.air && t.spin > 0 && Math.hypot(t.x - z.x, t.z - z.z) < z.r) {
            const h = Math.min(S.regen * dt, t.spinMax - t.spin);
            t.spin += h; z.a += h; z.b += dt;
            if (z.b >= 1) { if (z.a >= 1) this.emit('heal', { top: t, amount: z.a }); z.a = 0; z.b = 0; }
          }
          if (live && d < z.r) opp.slow = Math.max(opp.slow, 0.2);
          break;
        case 'lotus':
          // c: sprung, a: when
          if (z.c) {
            if (z.t - z.a >= S.fuse) { z.dead = true; this.burst(t, S, z.x, z.z, z.r); }
          } else if (z.t >= z.T) this.endZone(z);
          else if (z.t >= S.arm && live && d < S.trig + opp.radius * 0.5) {
            z.c = 1; z.a = z.t;
            opp.slow = Math.max(opp.slow, S.slow);
            this.emit('say', { top: opp, text: 'TRAP!', tone: 'red' });
          }
          break;
        case 'blizzard':
          initZone(z); // keeps spreading
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          if (live && d < z.r + opp.radius * 0.3) {
            opp.slow = Math.max(opp.slow, 0.3);
            this.dot(opp, (S.dps * dt * t.blade.atk) / opp.blade.def, t);
          }
          break;
        case 'poison':
          if (z.t >= z.T) { z.dead = true; break; }
          if (live && d < z.r + opp.radius * 0.3) opp.poison = S.linger;
          break;
        case 'glue':
          if (z.t >= z.T) { this.endZone(z); break; }
          if (live && d < z.r) { opp.ground = 0.25; opp.slow = Math.max(opp.slow, 0.25); }
          break;
        case 'turret': {
          // a: overclock time left, b: time to the next shot, c: upgraded
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          if (live && d < z.r + opp.radius * 0.6) {
            this.endZone(z);
            this.emit('blast', { top: opp, skill: S, x: z.x, z: z.z, r: 1.6, hit: 0, target: null });
            break;
          }
          z.a = Math.max(0, z.a - dt); z.b -= dt;
          if (z.b <= 0 && live && d < S.reach) {
            const shot = SKILLS.turretshot, lead = d / shot.speed;
            const ax = opp.x + opp.vx * lead - z.x, az = opp.z + opp.vz * lead - z.z, n = Math.hypot(ax, az) || 1;
            this.fire(t, shot, ax / n, az / n, { x: z.x, z: z.z, dmg: z.c ? S.bigDmg : S.dmg });
            z.b = S.rate * (z.a > 0 ? 0.45 : 1) * (z.c ? 0.7 : 1);
          }
          break;
        }
        case 'arise': {
          // b: time to the next stab, c: 1 marching to (dx, dz), 2 already hit on this march
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          if (z.c & 1) {
            const C = SKILLS.conquer;
            const mx = z.dx - z.x, mz = z.dz - z.z, m = Math.hypot(mx, mz), st = C.speed * dt;
            if (m <= st) { z.x = z.dx; z.z = z.dz; z.c = 0; break; }
            z.x += (mx / m) * st; z.z += (mz / m) * st;
            if (!(z.c & 2) && live && Math.hypot(opp.x - z.x, opp.z - z.z) < C.aoe + opp.radius * 0.5) {
              for (const q of this.own(t, 'arise')) q.c |= 2;
              const dmg = this.hurt(opp, (C.dmg * (opp.guard > 0 ? 0.3 : 1) * t.blade.atk) / opp.blade.def, t, 'conquer');
              if (opp.guard <= 0) this.affect(t, opp, C, 0, 0);
              t.stats.skillHits++;
              this.emit('strike', { top: opp, src: t, skill: C, x: opp.x, z: opp.z, dmg });
            }
            break;
          }
          z.b -= dt;
          if (z.b <= 0 && live && d < S.reach + opp.radius * 0.4 && !t.out && Math.hypot(t.x - z.x, t.z - z.z) < S.leash) {
            const dmg = this.hurt(opp, (S.dmg * (opp.guard > 0 ? 0.3 : 1) * t.blade.atk) / opp.blade.def, t, 'arise');
            if (opp.guard <= 0) this.push(opp, (opp.x - z.x) / (d || 1), (opp.z - z.z) / (d || 1), S.kb);
            z.b = S.rate;
            this.emit('strike', { top: opp, src: t, skill: S, x: z.x, z: z.z, dmg });
          }
          break;
        }
        case 'divide': {
          // c: the advancing wall has already hit
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          const w = wallOf(z);
          if (!z.c && w.moving && live) {
            const rx = opp.x - w.x, rz = opp.z - w.z;
            const u = rx * w.nx + rz * w.nz, v = -rx * w.nz + rz * w.nx;
            if (Math.abs(v) < S.wall + opp.radius * 0.5 && u > -1.2 && u < opp.radius + 0.8) {
              z.c = 1;
              const g = opp.guard > 0 ? 0.3 : 1;
              const dmg = this.hurt(opp, (S.dmg * g * t.blade.atk) / opp.blade.def, t, 'divide');
              if (g === 1) this.knock(opp, w.nx, w.nz, S.kb, 0.6, 2);
              t.stats.skillHits++;
              this.emit('strike', { top: opp, src: t, skill: S, x: opp.x, z: opp.z, dmg, big: true });
            }
          }
          break;
        }
        default: // plain timed objects: walls, shadows
          if (z.t >= z.T || this.result) this.endZone(z);
      }
    }
    if (this.zones.some((z) => z.dead)) this.zones = this.zones.filter((z) => !z.dead);
  }

  collide(a, b) {
    if (!targetable(a) || !targetable(b)) return;
    let nx = b.x - a.x, nz = b.z - a.z;
    const d = Math.hypot(nx, nz), min = a.radius + b.radius;
    if (d >= min) return;
    // Some dashes go straight through, cutting once on the way.
    if (((a.dash && a.dash.skill.through) || (b.dash && b.dash.skill.through)) && a.guard <= 0 && b.guard <= 0) {
      for (const s of [a, b]) {
        const h = s.dash, v = this.other(s);
        if (!h || !h.skill.through || h.hit || !h.skill.pass || this.result) continue;
        h.hit = true;
        const dmg = this.hurt(v, (h.skill.pass * s.blade.atk) / v.blade.def, s, h.skill.id);
        this.affect(s, v, h.skill, h.dx, h.dz);
        s.stats.skillHits++;
        this.emit('strike', { top: v, src: s, skill: h.skill, x: v.x, z: v.z, dmg });
        // SWEEPING BLADE feeds the same wind as STEEL GALE.
        if (h.skill.id === 'sweep') { s.stack = Math.min(SKILLS.galeq.stacks, s.stack + 1); s.stackT = SKILLS.galeq.keep; }
      }
      return;
    }
    if (d > 1e-4) { nx /= d; nz /= d; } else { nx = 1; nz = 0; }
    const tm = a.mass + b.mass, ov = min - d;
    a.x -= nx * ov * (b.mass / tm); a.z -= nz * ov * (b.mass / tm);
    b.x += nx * ov * (a.mass / tm); b.z += nz * ov * (a.mass / tm);
    const vn = (a.vx - b.vx) * nx + (a.vz - b.vz) * nz;
    if (vn <= 0) return;
    const live = !this.result && a.hitCd <= 0 && b.hitCd <= 0;
    // A dash that starts in the moment after a hit just leans on the other top
    // until it can strike; it must not turn its whole speed into a free shove.
    if (!live && !this.result && (a.dash || b.dash)) return;

    const aIn = Math.max(0, a.vx * nx + a.vz * nz);
    const bIn = Math.max(0, -(b.vx * nx + b.vz * nz));
    const sa = spinRatio(a), sb = spinRatio(b);
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
      this.stopDash(s);
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
    } else if (!!a.dash !== !!b.dash && (a.dash || b.dash).skill.dmg) {
      const s = a.dash ? a : b, v = this.other(s), D = s.dash.skill;
      kind = 'dash'; power += 14;
      bonus(s, v, D.dmg * (D.perBleed ? 1 + D.perBleed * v.bleed : 1), D.keep ?? 1);
      thrown(s, v, D.kb, 0.55);
      s.stats.skillHits++;
      this.affect(s, v, D, 0, 0, false);
      // SHIFTING SANDS: the emperor arrives behind a shield, the target goes up.
      if (D.liftUp) { this.lift(v, D.liftUp); s.shield = D.shield; s.shieldT = D.hold; }
    } else if (a.empower > 0 !== b.empower > 0 && (a.empower > 0 ? a : b).blade.emp) {
      const s = a.empower > 0 ? a : b, v = this.other(s), E = s.blade.emp;
      kind = 'empower'; power += 10;
      thrown(s, v, E.kb, 0.45);
      s.empower = 0; s.stats.skillHits++;
      bonus(s, v, E.bonus, 1);
      this.affect(s, v, E, 0, 0, false);
    } else {
      special = false;
    }

    if (!special) {
      this.stopDash(a); this.stopDash(b);
      const j = (1.5 * vn) / (1 / a.mass + 1 / b.mass) + 2.5 + 1.5 * (sa + sb);
      const dva = (j / a.mass) * (1 + 0.35 * (1 - sa)) * (rooted(a) ? 0.1 : 1);
      const dvb = (j / b.mass) * (1 + 0.35 * (1 - sb)) * (rooted(b) ? 0.1 : 1);
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

  // Solid walls on the floor. Ice stops everyone; the emperor's line stops
  // only the other side, and shoves it along while it is still advancing.
  barriers(t) {
    if (t.air || t.out || t.blink) return;
    for (const z of this.zones) {
      const S = z.skill;
      if (z.dead || !S.solid || (z.kind === 'divide' && z.owner === t)) continue;
      const w = wallOf(z);
      const rx = t.x - w.x, rz = t.z - w.z;
      const u = rx * w.nx + rz * w.nz, v = -rx * w.nz + rz * w.nx;
      const th = WALL_HALF + t.radius;
      if (Math.abs(v) > S.wall + t.radius * 0.6 || Math.abs(u) >= th) continue;
      const s = w.moving || u >= 0 ? 1 : -1;
      t.x += w.nx * (th * s - u); t.z += w.nz * (th * s - u);
      const vn = (t.vx * w.nx + t.vz * w.nz) * s;
      if (w.moving && vn < S.speed && !fixed(t)) {
        t.vx += w.nx * (S.speed - vn); t.vz += w.nz * (S.speed - vn);
      } else if (vn < 0) {
        t.vx -= 1.4 * vn * s * w.nx; t.vz -= 1.4 * vn * s * w.nz;
        this.stopDash(t);
        if (vn < -5) this.emit('bump', { top: t, x: t.x - w.nx * s * t.radius, z: t.z - w.nz * s * t.radius, nx: w.nx * s, nz: w.nz * s, power: -vn });
      }
    }
  }

  walls(t) {
    if (t.air || t.out) return;
    const c = wallContact(t);
    if (!c || c.vn <= 0) return;
    if (t.blink) { t.blink.t = 0; return; }
    if (!this.result && t.launch > 0 && c.vn > ARENA.ringOutSpeed && !(t.egg > 0)) {
      if (t.tether) this.emit('tetherEnd', { top: t, broke: true });
      if (t.orbs) this.emit('orbsEnd', { top: t });
      t.out = { t: 0, y: 0, vy: 7 + c.vn * 0.35 };
      t.cmd = t.dash = t.cast = t.charge = t.tether = t.orbs = t.chan = null; t.guard = 0; t.toggle = false;
      this.emit('ringout', { top: t, x: t.x, z: t.z, nx: c.nx, nz: c.nz, power: c.vn });
      this.finish(this.other(t), t, 'over');
      return;
    }
    bounce(t, c);
    this.stopDash(t);
    let dmg = 0;
    if (c.vn > 4) {
      dmg = ((c.vn - 4) * (t.launch > 0 ? 2.2 : 1.0)) / t.blade.def;
      dmg = this.hurt(t, dmg, t.launch > 0 ? this.other(t) : null, 'wall');
    }
    if (c.vn > 2) this.emit('wall', { top: t, x: t.x + c.nx, z: t.z + c.nz, nx: c.nx, nz: c.nz, power: c.vn, dmg, slam: t.launch > 0 });
  }

  // FLASH FROST going off: on the recast, or by itself at the end of its path.
  shatter(p) {
    p.dead = true;
    this.unre(p.owner, 'flashfrost');
    this.burst(p.owner, SKILLS.shatter, p.x, p.z, SKILLS.shatter.aoe);
  }

  // True if a wall stands where the shot is: ice stops all of them, a wind
  // wall only the other side's.
  stopped(p) {
    for (const z of this.zones) {
      if (z.dead || !(z.kind === 'icewall' || (z.kind === 'windwall' && z.owner !== p.owner))) continue;
      const rx = p.x - z.x, rz = p.z - z.z;
      if (Math.abs(rx * z.dx + rz * z.dz) < 0.6 && Math.abs(-rx * z.dz + rz * z.dx) < z.skill.wall + p.r * 0.5) return true;
    }
    return false;
  }

  projHit(p, v) {
    const o = p.owner, S = p.skill;
    let k = 1;
    if (S.chill && (v.slow > 0 || v.tumble > 0 || v.up > 0)) k = S.chill;
    // Finishers bite harder the less spin the target has left.
    if (S.exec) k *= 1 + S.exec * (1 - spinRatio(v));
    const scarred = v.scar > 0;
    const dmg = this.hurt(v, (p.dmg * k) / v.blade.def, o, S.id);
    if (S.chain) this.pull(v, o, S.pull);
    this.affect(o, v, S, p.dx, p.dz);
    if (S.id === 'galeq') { o.stack = Math.min(S.stacks, o.stack + 1); o.stackT = S.keep; }
    if (S.id === 'flourish' && scarred) this.stun(v, S.root);
    if (S.id === 'ethereal') {
      o.tether = { t: 0, T: S.dur, skill: S, acc: 0, tick: 0 };
      this.emit('say', { top: v, text: 'CHAINED', tone: '' });
    }
    // Only one blade of a wind slash can land.
    if (S.id === 'windslash') for (const q of this.projectiles) if (q !== p && q.skill === S && q.owner === o) q.dead = true;
    o.stats.skillHits++;
    if (S.pierce) p.hit = true; else p.dead = true;
    this.emit('projHit', { proj: p, top: v, x: p.x, z: p.z, dx: p.dx, dz: p.dz, dmg });
  }

  updateProjectiles(dt) {
    for (const p of this.projectiles) {
      if (p.dead) continue;
      const st = p.speed * dt, S = p.skill;
      p.x += p.dx * st; p.z += p.dz * st; p.left -= st;
      const v = this.other(p.owner);
      if (this.stopped(p)) {
        p.dead = true;
        if (S.re) this.unre(p.owner, S.id);
        this.emit('projEnd', { proj: p, x: p.x, z: p.z });
      } else if (!this.result && !p.hit && targetable(v) && Math.hypot(v.x - p.x, v.z - p.z) < p.r + v.radius) {
        if (v.guard > 0) {
          // Guard sends it straight back.
          p.owner = v; p.dx = -p.dx; p.dz = -p.dz; p.left = S.range; p.dmg *= 1.2;
          v.stats.parries++;
          this.emit('reflect', { top: v, proj: p, x: p.x, z: p.z });
          continue;
        }
        this.projHit(p, v);
      } else if (p.left <= 0 || Math.hypot(p.x, p.z) > ARENA.R + 0.5) {
        if (S.id === 'flashfrost') this.shatter(p);
        else { p.dead = true; this.emit('projEnd', { proj: p, x: p.x, z: p.z }); }
      }
    }
    if (this.projectiles.some((p) => p.dead)) this.projectiles = this.projectiles.filter((p) => !p.dead);
  }
}
