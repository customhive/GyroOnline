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
    hold: null,            // a skill being wound up: { key, t }
    // Counters that make projectile and zone ids agree on both ends of a network match.
    projN: 0, zoneN: 0,
    phase: side * 2.1, tumble: 0, launch: 0, guard: 0, slow: 0, hitCd: 0,
    up: 0,                 // knocked into the air: helpless until it runs out
    stun: 0,               // held where it stands, unable to act; a hit still shoves it
    snare: 0,              // held where it stands, but still able to use skills that do not move it
    slowK: 0,              // how much of its speed a slow takes (0 = the usual 40%)
    ground: 0,             // stuck in adhesive: slower still, no dashes
    mark: 0, scar: 0, poison: 0, bleed: 0, bleedT: 0,
    frost: 0,              // iced over: FROSTBITE bites twice as deep
    doom: 0,               // marked for execution the moment its spin drops below the line
    shred: 0,              // dented: takes more damage for a while
    stk: 0, stkT: 0,       // uses stored up for the blade's stocked skill, and time to the next
    streamT: 0,            // a held stream of fire: time left before it counts as let go
    markK: 1,              // how hard the mark on this top goes off
    empN: 0, empS: null,   // empowered body hits left, and the skill that empowered them
    ret2: null,            // a second place to return to, left by a mimicked jump
    shield: 0, shieldT: 0, buff: 0,
    stack: 0, stackT: 0,   // per-blade counter: wind stacks, shots fired, dashes chained
    last: 0,               // key index of the last basic skill used (for MIMIC)
    toggle: false,
    dmark: 0, dacc: 0,     // death mark: time left and damage stored
    egg: 0, eggHp: 0, eggUsed: false,
    haste: 0,              // moving faster for a while
    charm: 0, charmDir: 1, // walking helplessly toward (1) or away from (-1) the other top
    pin: 0,                // shoved hard: hitting the wall now stuns
    store: 0,              // damage banked by blades that turn it into a shield
    tag: 0, tagT: 0,       // nails stuck in this top
    perm: 0,               // growth that lasts the whole match, not just the round
    dot: 0, dotT: 0, drop: 0, hist: [], histT: 0, // bookkeeping only; not sent over the network
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
  const eased = t.slow > 0 ? 1 - (t.slowK || 0.4) : 1;
  const slow = (t.ground > 0 ? Math.min(0.4, eased) : eased) * ((B && B.speed) || 1) * (t.haste > 0 ? 1.3 : 1) * (t.hold ? 0.8 : 1);
  // Stunned tops stay put too, except while a hit is still carrying them.
  const held = rooted(t) || ((t.stun > 0 || t.snare > 0) && t.tumble <= 0);
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
    ground: t.ground, buff: t.buff, haste: t.haste, up: t.up, egg: t.egg, chan: t.chan, hold: t.hold, stun: t.stun, snare: t.snare, slowK: t.slowK,
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
      g.stun = Math.max(0, g.stun - h);
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
  if (S.star) z.r *= 1 + z.c * 0.005;
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
      t.cmd = t.cast = t.dash = t.air = t.out = t.blink = t.charge = t.orbs = t.tether = t.chan = t.ret = t.hold = null;
      t.tumble = t.launch = t.guard = t.slow = t.hitCd = t.empower = 0;
      t.up = t.ground = t.mark = t.scar = t.poison = t.bleed = t.bleedT = t.shield = t.shieldT = t.buff = t.frost = t.doom = t.empN = t.shred = t.stkT = t.streamT = 0;
      const stocked = KEYS.map((k) => skillOf(t, k)).find((S) => S.stock);
      t.stk = stocked ? stocked.stock.max : 0;
      t.markK = 1;
      t.ret2 = t.empS = null;
      t.stack = t.stackT = t.last = t.dmark = t.dacc = t.egg = t.eggHp = t.dot = t.dotT = t.drop = 0;
      t.haste = t.charm = t.pin = t.store = t.tag = t.tagT = t.histT = t.stun = t.snare = t.slowK = 0;
      t.hist = [];
      t.toggle = t.eggUsed = false;
      t.lastHit = null;
      for (const k of KEYS) { t.cd[k] = k === 'R' ? 0 : 1.2; t.re[k] = 0; }
    }
  }

  issueMove(t, x, z) {
    if (this.result || t.air || t.out || t.dash || t.blink || rooted(t) || t.stun > 0 || t.snare > 0 || !Number.isFinite(x + z)) return false;
    const lim = ARENA.R - t.radius - 0.2;
    const r = Math.hypot(x, z);
    if (r > lim) { x *= lim / r; z *= lim / r; }
    t.cmd = { x, z, t: 2.2 };
    return true;
  }

  // States that block every skill, whatever its cooldown.
  busy(t) {
    // A top in flight is dashing, but free to use its skills.
    return !!(this.result || t.spin <= 0 || t.air || t.out || t.cast || (t.dash && !t.dash.skill.fly) || t.blink || t.charge || t.chan || t.up > 0 || t.stun > 0 || t.egg > 0);
  }

  // The skill a key would cast right now: its second stage while the recast
  // window is open, the tornado once the wind is stacked, the copy for MIMIC.
  aimSkill(t, key) {
    const S = skillOf(t, key);
    if (S.re && t.re[key] > 0) return SKILLS[S.re];
    // Another skill of the kit can change what this key fires for a while.
    if (S.alt && t.re[S.altKey] > 0) return SKILLS[S.alt];
    if (S.id === 'mimic' && t.re[key] > 0) return SKILLS.recall;
    if (S.id === 'mimic') return SKILLS[t.blade.kit[KEYS[t.last]]];
    if (S.id === 'galeq' && t.stack >= S.stacks) return SKILLS.tornado;
    return S;
  }

  // Off cooldown (within `slack` seconds) and, for an ultimate, charged.
  ready(t, key, slack = 0) {
    const S = skillOf(t, key);
    if ((S.re || S.id === 'mimic') && t.re[key] > 0) return true;
    return t.cd[key] <= slack && (!S.ult || t.ult >= 100);
  }

  // Why a skill that is otherwise ready cannot be used here and now, as a
  // short label for the player; null when nothing stands in the way.
  blocked(t, key) {
    const S = this.aimSkill(t, key), o = this.other(t);
    const d = Math.hypot(o.x - t.x, o.z - t.z);
    if (S.need === 'range' && !(targetable(o) && d <= (S.grab ?? S.range) && !((S.id === 'fling' || S.kind === 'throw') && o.egg > 0))) return '射程外';
    if (S.need === 'up' && !(targetable(o) && o.up > 0 && d <= S.range)) return '打ち上げ中のみ';
    if (S.need === 'soldier' && !this.own(t, 'arise').length) return '砂兵がいない';
    if ((t.ground > 0 || t.snare > 0) && (MOBILE.has(S.aim) || S.id === 'shift' || S.tp)) return t.snare > 0 ? '束縛中' : '粘着中';
    return null;
  }

  // Starts winding up a skill that is charged by holding its key. The time
  // is kept here, in the simulation, so both ends of a match agree on it.
  hold(t, key) {
    if (!this.canCast(t, key) || !this.aimSkill(t, key).wind) return false;
    t.hold = { key, t: 0 };
    this.emit('hold', { top: t, key });
    return true;
  }

  // How far a wound-up skill reaches right now.
  // `thrown` asks what the long form would reach, even while a release
  // would still give the short one.
  holdRange(t, key, thrown = false) {
    const S = this.aimSkill(t, key), W = S.wind;
    if (!W) return S.range;
    const h = t.hold && t.hold.key === key ? t.hold.t : 0;
    if (h < W.min && S.tap && !thrown) return SKILLS[S.tap].range;
    return S.near + (S.range - S.near) * clamp(h / W.full, 0, 1);
  }

  canCast(t, key) {
    if (this.busy(t) || !this.ready(t, key)) return false;
    const base = skillOf(t, key);
    if (base.passive || (base.stock && t.stk <= 0)) return false;
    if (t.dash && this.aimSkill(t, key).aim === 'dash') return false;
    if (t.hold && t.hold.key !== key) return false;
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

  // `wound` is only for callers that do not hold keys (the CPU): seconds of
  // wind-up to assume. A real hold is timed by the simulation itself.
  cast(t, key, ax, az, wound = 0) {
    if (!this.canCast(t, key)) return false;
    const base = skillOf(t, key), S = this.aimSkill(t, key);
    const held = t.hold && t.hold.key === key ? t.hold.t : wound;
    const reach = this.holdRange(t, key);
    t.hold = null;
    const re = !!((base.re || base.id === 'mimic') && t.re[key] > 0);
    if (re) {
      t.re[key] = 0;
    } else {
      t.cd[key] = base.cd * t.blade.cdMul;
      if (base.stock) t.stk--;
      // A stream: the first shot opens its window, every shot keeps it alive.
      if (base.stream) { if (t.streamT <= 0) t.re[key] = base.stream.max; t.streamT = base.stream.gap; }
      if (base.ult) t.ult = 0; else t.last = KEYS.indexOf(key);
      if (base.id === 'mimic') t.buff = base.dur;
    }
    let dx = ax - t.x, dz = az - t.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.01) { dx = 0; dz = t.side === 0 ? -1 : 1; } else { dx /= d; dz /= d; }
    const wind = re ? 0 : t.windup[key];
    const c = { key, skill: S, re, t: wind, T: wind, dx, dz, ax, az, dist: d, held, reach: t.windup[key] > 0 || wound ? S.range : reach };
    if (S.aim === 'ground' || S.aim === 'leap') { const m = this.groundTarget(t, S, ax, az); c.ax = m.x; c.az = m.z; }
    this.emit('cast', { top: t, key, skill: S, base, ult: !!base.ult && !re, windup: c.T, dx, dz, ax: c.ax, az: c.az });
    if (c.t <= 0) this.execute(t, c); else t.cast = c;
    return true;
  }

  fire(t, S, dx, dz, o = {}) {
    const p = {
      id: t.side * 30000 + (t.projN = (t.projN + 1) % 30000), skill: S, owner: t,
      x: (o.x ?? t.x) + dx * 0.9, z: (o.z ?? t.z) + dz * 0.9, dx, dz,
      speed: S.speed, left: o.left ?? S.range, r: S.radius, dmg: (o.dmg ?? S.dmg) * t.blade.atk, hit: false, back: false, crawl: false, dead: false, x2: !!o.x2,
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

  // The key that holds one of `t`'s skills.
  keyOf(t, id) { return KEYS.find((k) => skillOf(t, k).id === id); }

  // Shots that find their own aim: at where the other top is heading.
  bolts(t, S, n) {
    const opp = this.other(t);
    const lead = Math.hypot(opp.x - t.x, opp.z - t.z) / S.speed;
    const a = targetable(opp) ? Math.atan2(opp.z + opp.vz * lead - t.z, opp.x + opp.vx * lead - t.x) : Math.atan2(t.vz, t.vx);
    for (let i = 0; i < n; i++) this.fire(t, S, Math.cos(a + (i - (n - 1) / 2) * 0.14), Math.sin(a + (i - (n - 1) / 2) * 0.14), { quiet: i > 0 });
  }

  // Ends the round for `v` on the spot.
  slay(v, from) {
    v.shield = 0;
    this.emit('say', { top: v, text: 'EXECUTE', tone: 'red' });
    this.hurt(v, v.egg > 0 ? 9999 : v.spin + 60, from, 'execute');
  }

  startDash(t, S, dx, dz, dist) {
    t.dash = { dx, dz, speed: S.speed, t: dist / S.speed, skill: S, hit: false, len: dist };
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
    if (S.bolt) this.bolts(t, SKILLS[S.bolt], S.n || 1);
    if (S.land) {
      // A slice around the landing spot whose edge cuts deepest.
      const opp = this.other(t), far = Math.hypot(opp.x - t.x, opp.z - t.z) >= (S.inner || 0);
      this.burst(t, S, t.x, t.z, S.aoe, { dmg: far ? S.land : S.weak });
    }
    // An echo that follows the same path a moment later.
    if (S.phantom) { const L = d.len ?? S.dist; this.fire(t, SKILLS[S.phantom], d.dx, d.dz, { x: t.x - d.dx * L, z: t.z - d.dz * L, left: L + 1.5 }); }
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
        // A mimicked sigil leaves a mark that goes off twice as hard.
        this.fire(t, S, c.dx, c.dz, { x2: skillOf(t, c.key).id === 'mimic' });
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
        // A mimicked jump keeps its own way back, apart from the real one's.
        if (skillOf(t, c.key).id === 'mimic') t.ret2 = { x: t.x, z: t.z }; else t.ret = { x: t.x, z: t.z };
        t.re[c.key] = S.window;
        this.startDash(t, S, c.dx, c.dz, clamp(c.dist, S.minDist, S.dist));
        break;
      case 'recall': {
        const two = skillOf(t, c.key).id === 'mimic', back = two ? t.ret2 : t.ret;
        if (back) {
          const fx = t.x, fz = t.z;
          t.x = back.x; t.z = back.z; t.vx = t.vz = 0; t.cmd = null;
          if (two) t.ret2 = null; else t.ret = null;
          this.emit('warp', { top: t, fx, fz });
        }
        break;
      }
      case 'shift': {
        let best = null, bd = 1e9;
        for (const q of this.own(t, 'arise')) { const d = Math.hypot(q.x - t.x, q.z - t.z); if (d < bd) { bd = d; best = q; } }
        if (best && bd > 0.5) { this.startDash(t, S, (best.x - t.x) / bd, (best.z - t.z) / bd, bd); t.dash.to = best.id; }
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
        // Ordered mid-dash, the soldier it is flying to moves on, and it follows: the emperor's shuffle.
        if (t.dash && t.dash.to !== undefined) t.dash.chase = t.dash.to;
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
      case 'foxfire':
        t.orbs = { n: S.count, alive: (1 << S.count) - 1, t: S.dur, ang: 0, cd: 0, skill: S };
        t.haste = S.haste;
        this.emit('orbs', { top: t });
        break;
      case 'realm':
        t.tether = { t: 0, T: S.dur, skill: S, acc: 0, tick: 0 };
        t.buff = S.dur;
        this.emit('tether', { top: t, target: opp });
        break;
      case 'rewind': {
        // Back to where it stood a few seconds ago, with part of the spin lost since.
        const old = t.hist[0] || { x: t.x, z: t.z, spin: t.spin };
        // The more was lost in those seconds, the more comes back.
        this.mend(t, S.base * (1 + 3 * clamp((old.spin - t.spin) / t.spinMax, 0, 1)));
        // Passing through its own trap on the way sets it off.
        const px = old.x - t.x, pz = old.z - t.z, pl = px * px + pz * pz || 1;
        for (const q of this.own(t, 'parallel')) {
          const k = clamp(((q.x - t.x) * px + (q.z - t.z) * pz) / pl, 0, 1);
          if (q.t >= q.skill.arm && Math.hypot(t.x + px * k - q.x, t.z + pz * k - q.z) < q.r) this.spring(q);
        }
        // Out of reach of everything while it travels.
        t.air = { t: 0, T: S.air, sx: t.x, sz: t.z, tx: old.x, tz: old.z, skill: S, by: t.side };
        t.cmd = null; t.vx = t.vz = 0; t.tumble = 0;
        this.emit('leap', { top: t, tx: old.x, tz: old.z, T: S.air, skill: S });
        break;
      }
      case 'caskpop': case 'lightpop': {
        const q = this.own(t, S.pops)[0];
        if (q) q.T = q.t; // goes off now, with whatever it has ripened to
        break;
      }
      case 'keg': case 'parallel':
        this.zone(t, S, c.ax, c.az);
        break;
      case 'hshock':
        // The ground is struck now, and bursts again along the same line a second later.
        this.lineHit(t, S, t.x, t.z, c.dx, c.dz);
        this.zone(t, S, t.x, t.z, { dx: c.dx, dz: c.dz });
        break;
      case 'verdict':
        // A tap swings the hammer up; a hold sends a wave that hurls the target away.
        if (c.held < S.wind.min) this.coneHit(t, SKILLS[S.tap], c.dx, c.dz);
        else this.fire(t, SKILLS.verdictwave, c.dx, c.dz, { left: c.reach });
        break;
      case 'flightstop':
        this.stopDash(t);
        break;
      case 'soulrelease':
        t.buff = 0;
        this.release(t);
        break;
      case 'deathbelow':
        this.zone(t, S, c.ax, c.az, { dx: c.dx, dz: c.dz });
        break;
      case 'bladecaller': {
        // Every feather on the floor flies home, cutting what stands in between.
        t.stack = 0;
        for (const q of this.own(t, 'feather')) {
          const dx = t.x - q.x, dz = t.z - q.z, d = Math.hypot(dx, dz);
          if (d > 1) this.fire(t, SKILLS.quill, dx / d, dz / d, { x: q.x, z: q.z, left: d, quiet: true });
          q.dead = true;
        }
        this.emit('buff', { top: t, skill: S });
        break;
      }
      default:
        this.generic(t, c, S, opp);
    }
  }

  // Skills described entirely by their fields: `kind` says what they do.
  generic(t, c, S, opp) {
    if (S.casts) {
      t.stack = c.re ? t.stack + 1 : 1;
      t.stackT = S.window + 1;
      if (t.stack < S.casts) t.re[c.key] = S.window;
    }
    if (S.cost) t.spin = Math.max(1, t.spin - S.cost);
    if (S.haste) t.haste = S.haste;
    if (S.buff) t.buff = S.buff;
    if (S.shield) { t.shield = S.shield; t.shieldT = S.hold; }
    if (S.shieldAdd) this.shieldUp(t, S);
    switch (S.kind) {
      case 'shot':
        // Some shots are let go only after standing still to line them up.
        if (S.charge) { t.charge = { t: 0, T: S.charge, skill: S, dx: c.dx, dz: c.dz }; t.cmd = null; this.emit('charge', { top: t, T: S.charge, skill: S }); }
        else if (S.fan) this.fan(t, S, c.dx, c.dz, S.fan);
        // Wound up: a quick tap is a different, shorter strike; a hold reaches further.
        else if (S.wind) { if (c.held < S.wind.min && S.tap) this.fire(t, SKILLS[S.tap], c.dx, c.dz); else this.fire(t, S, c.dx, c.dz, { left: c.reach }); }
        else this.fire(t, S, c.dx, c.dz);
        break;
      case 'bolts':
        this.bolts(t, SKILLS[S.bolt], S.n);
        this.emit('buff', { top: t, skill: S });
        break;
      case 'dash':
        if (S.echo) this.zone(t, SKILLS[S.echo], t.x, t.z);
        if (S.re && !S.casts) t.re[c.key] = S.window;
        // Wound up: the longer the hold, the further and the harder.
        if (S.wind) { this.startDash(t, S, c.dx, c.dz, c.reach); t.dash.pow = 1 + S.powMul * clamp(c.held / S.wind.full, 0, 1); }
        else this.startDash(t, S, c.dx, c.dz, clamp(c.dist, S.minDist, S.dist));
        if (S.linger) t.re[c.key] = S.linger;
        if (S.empower) t.empower = S.empower;
        if (S.heal) this.mend(t, S.heal * (t.spinMax - t.spin));
        break;
      case 'blink': {
        const dist = clamp(c.dist, 2, S.range);
        if (S.re) { if (S.re === 'recall') t.ret = { x: t.x, z: t.z }; t.re[c.key] = S.window; }
        t.blink = { dx: c.dx, dz: c.dz, speed: S.speed, t: dist / S.speed, skill: S };
        t.cmd = null; t.tumble = 0;
        this.emit('blink', { top: t, dx: c.dx, dz: c.dz, dist });
        break;
      }
      case 'blast': case 'field':
        if (S.star) {
          // Sized by the stardust gathered so far; with enough of it, the star is a greater one.
          const Z = S.evolve && t.perm >= S.evolveAt ? SKILLS[S.evolve] : S;
          this.zone(t, Z, c.ax, c.az, { c: Math.min(255, t.perm) });
        } else if (S.aim === 'self') this.zone(t, S, t.x, t.z); else this.zone(t, S, c.ax, c.az);
        if (S.re && !S.casts) t.re[c.key] = S.dur;
        if (S.dmg0) this.burst(t, S, t.x, t.z, S.aoe, { dmg: S.dmg0 });
        break;
      case 'burst': {
        const hit = this.burst(t, S, t.x, t.z, S.aoe);
        if (hit && S.pullIn && opp.guard <= 0) this.pull(opp, t, S.pullIn);
        if (hit && S.reHit) t.re[c.key] = S.reHit;
        if (hit && S.buffHit) t.buff = S.buffHit;
        break;
      }
      case 'cone':
        // Some are thrown only after a wind-up.
        if (S.charge) { t.charge = { t: 0, T: S.charge, skill: S, dx: c.dx, dz: c.dz }; this.emit('charge', { top: t, T: S.charge, skill: S }); }
        else this.coneHit(t, S, c.dx, c.dz);
        break;
      case 'buff':
        if (S.re && !S.bonus) t.re[c.key] = S.window;
        if (S.dur) t.buff = S.dur;
        if (S.empower) { t.empower = S.empower; t.empN = S.empN || 1; t.empS = S.bonus ? S : null; }
        if (S.heal) this.mend(t, S.heal * (t.spinMax - t.spin) + (S.flat || 0));
        if (S.healMax) this.mend(t, S.healMax * t.spinMax);
        if (S.cleanse) t.slow = t.ground = t.poison = t.bleed = t.bleedT = t.mark = t.tag = t.tagT = t.charm = 0;
        if (S.storeShield) { t.shield = clamp(t.store, S.min, S.max); t.shieldT = S.hold; t.store = 0; }
        this.emit('buff', { top: t, skill: S });
        break;
      case 'leap':
        t.air = { t: 0, T: S.air, sx: t.x, sz: t.z, tx: c.ax, tz: c.az, skill: S, by: t.side };
        t.cmd = null; t.vx = t.vz = 0;
        // Thrown wider than the same shot is on the ground.
        if (S.shot) this.fan(t, { ...SKILLS[S.shot], half: S.half }, c.dx, c.dz, S.fan);
        this.emit('leap', { top: t, tx: c.ax, tz: c.az, T: S.air, skill: S });
        break;
      case 'beam':
        t.charge = { t: 0, T: S.charge, skill: S, dx: c.dx, dz: c.dz };
        t.cmd = null;
        this.emit('charge', { top: t, T: S.charge, skill: S });
        break;
      case 'kick': {
        // Straight away from the kicker: where it stands decides where the target goes.
        const kx = opp.x - t.x, kz = opp.z - t.z, kd = Math.hypot(kx, kz) || 1;
        const dmg = this.hurt(opp, (S.dmg * (opp.guard > 0 ? 0.4 : 1) * t.blade.atk) / opp.blade.def, t, S.id);
        this.knock(opp, kx / kd, kz / kd, S.kb, 0.7, S.launch);
        t.stats.skillHits++;
        this.emit('strike', { top: opp, src: t, skill: S, x: opp.x, z: opp.z, dmg, big: true });
        break;
      }
      case 'strike': {
        if (S.tp) {
          // Arrive beside the target, on the side it was approached from.
          const fx = t.x, fz = t.z, dx = opp.x - t.x, dz = opp.z - t.z, d = Math.hypot(dx, dz) || 1;
          t.x = opp.x - (dx / d) * 2.6; t.z = opp.z - (dz / d) * 2.6; t.vx = t.vz = 0; t.cmd = null;
          this.emit('warp', { top: t, fx, fz });
        }
        const k = S.exec ? 1 + S.exec * Math.min(1, (1 - spinRatio(opp)) / (S.execCap || 1)) : 1;
        const dmg = this.hurt(opp, ((S.dmg + (S.perTag || 0) * opp.tag) * k * t.blade.atk) / opp.blade.def, t, S.id);
        if (S.perTag) opp.tag = opp.tagT = 0;
        this.affect(t, opp, S, 0, 0);
        t.stats.skillHits++;
        this.emit('strike', { top: opp, src: t, skill: S, x: opp.x, z: opp.z, dmg, big: !!S.ult });
        break;
      }
      case 'throw': {
        // With no aim of its own, the target is carried on past where it stood.
        if (S.aim === 'self') {
          const dx = opp.x - t.x, dz = opp.z - t.z, d = Math.hypot(dx, dz) || 1;
          let x = opp.x + (dx / d) * S.carry, z = opp.z + (dz / d) * S.carry;
          const lim = ARENA.R - 1.6, r = Math.hypot(x, z);
          if (r > lim) { x *= lim / r; z *= lim / r; }
          c.ax = x; c.az = z;
        }
        opp.air = { t: 0, T: S.air, sx: opp.x, sz: opp.z, tx: c.ax, tz: c.az, skill: S, by: t.side };
        opp.cmd = opp.dash = opp.cast = opp.chan = opp.charge = null; opp.vx = opp.vz = 0; opp.up = 0;
        this.emit('fling', { top: t, target: opp, tx: c.ax, tz: c.az });
        break;
      }
    }
  }

  // The end of SOUL IGNITION: everything banked comes back, and a little more.
  release(t) {
    this.mend(t, t.store + t.blade.ignite.bonus);
    t.store = 0;
  }

  // Everything standing in a strip from (x, z) along (dx, dz) is hit at once.
  lineHit(t, S, x, z, dx, dz, mul = 1) {
    const opp = this.other(t);
    let hit = 0;
    const rx = opp.x - x, rz = opp.z - z, along = rx * dx + rz * dz, side = Math.abs(-rx * dz + rz * dx);
    if (targetable(opp) && !this.result && along > -1 && along < S.range + opp.radius && side < S.radius + opp.radius * 0.6) {
      const g = opp.guard > 0 ? 0.3 : 1;
      hit = this.hurt(opp, (S.dmg * mul * g * t.blade.atk) / opp.blade.def, t, S.id);
      if (g === 1) this.affect(t, opp, S, dx, dz);
      t.stats.skillHits++;
    }
    this.emit('beam', { top: t, skill: S, x, z, dx, dz, hit, target: hit ? opp : null });
    return hit;
  }

  // A cone from the top. Some carry banked damage, and some cut through
  // defence along their centre line.
  coneHit(t, S, dx, dz) {
    const opp = this.other(t);
    let hit = 0;
    if (this.inCone(t, opp, dx, dz, S)) {
      const g = opp.guard > 0 ? 0.3 : 1;
      const extra = S.storeHit ? t.store * S.storeHit : 0;
      const ox = opp.x - t.x, oz = opp.z - t.z, od = Math.hypot(ox, oz) || 1;
      const core = S.core && Math.acos(clamp((ox * dx + oz * dz) / od, -1, 1)) < S.half * S.core;
      hit = this.hurt(opp, ((S.dmg * t.blade.atk + extra) * g) / (core ? 1 : opp.blade.def), t, S.id);
      if (g === 1) { if (S.pull) this.pull(opp, t, S.pull); this.affect(t, opp, S, dx, dz); }
      // A breath held on one target flares up every so many ticks.
      if (S.tick) {
        t.stack++; t.stackT = 0.4;
        if (t.stack >= S.tick.n) { t.stack = 0; hit += this.hurt(opp, (S.tick.dmg * t.blade.atk) / opp.blade.def, t, S.id); t.perm = Math.min(255, t.perm + S.tick.gain); }
      }
      t.stats.skillHits++;
    }
    // Banked damage goes out with the punch and comes back as a shield.
    if (S.storeHit) { t.shield = t.store; t.shieldT = S.hold; t.store = 0; }
    this.emit('cone', { top: t, skill: S, dx, dz, hit, target: hit ? opp : null });
    return hit;
  }

  // Gives spin back and says so.
  mend(t, amount) {
    const h = Math.min(amount, t.spinMax - t.spin);
    if (h <= 0) return;
    t.spin += h;
    if (h >= 1) this.emit('heal', { top: t, amount: h });
  }

  hurt(t, dmg, from, kind) {
    if (this.result || dmg <= 0) return 0;
    const foe = from && from !== t;
    if (foe && t.shred > 0) dmg *= from.blade.dent ? from.blade.dent.shred : 1;
    if (foe && kind !== 'dot' && kind !== 'wall') {
      const B = from.buff > 0 && from.blade.buff;
      if (B && B.atk) dmg *= B.atk;
      if (from.blade.might && t.bleed >= BLEED.max) dmg *= from.blade.might;
      // Growth: within the round (ramp) or for the whole match (perm).
      const R = from.blade.ramp;
      if (R) {
        dmg *= 1 + R.per * from.stack * (from.stack >= R.max ? 2 : 1);
        if (kind !== 'clash' && dmg >= 8) { from.stack = Math.min(R.max, from.stack + 1); if (R.expire) from.stackT = R.expire; }
      }
      if (from.blade.permDmg) dmg *= 1 + from.blade.permDmg * from.perm;
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
    if (t.blade.store && (!t.blade.store.whileBuff || t.buff > 0)) t.store = Math.min(t.blade.store.max, t.store + dmg * t.blade.store.taken);
    if (foe && from.blade.store) from.store = Math.min(from.blade.store.max, from.store + dmg * from.blade.store.dealt);
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
    // DENTING BLOWS: every third hit dents the target.
    const DB = foe && from.blade.dent;
    if (DB && kind !== 'wall' && kind !== 'dent') {
      t.tag = Math.min(3, t.tag + 1); t.tagT = DB.window;
      if (t.tag >= 3) {
        t.tag = t.tagT = 0; t.shred = DB.dur;
        const extra = this.hurt(t, (DB.dmg * from.blade.atk) / t.blade.def, from, 'dent');
        this.emit('strike', { top: t, src: from, skill: SKILLS.denting, x: t.x, z: t.z, dmg: extra });
      }
    }
    const L = foe && from.buff > 0 && from.blade.buff && from.blade.buff.leech;
    if (L) from.spin = Math.min(from.spinMax, from.spin + dmg * L);
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
    v.cmd = null; v.dash = null; v.cast = null; v.chan = null; v.hold = null;
  }

  // A light shove that interrupts nothing.
  push(v, dx, dz, speed) {
    if (fixed(v)) return;
    const k = (speed * kbMul(v)) / Math.sqrt(v.mass);
    v.vx += dx * k; v.vz += dz * k;
  }

  // Dragged toward `to`, never far enough to overshoot.
  pull(v, to, speed, far = 99) {
    if (fixed(v)) return;
    const dx = to.x - v.x, dz = to.z - v.z, d = Math.hypot(dx, dz) || 1;
    // 2.3: what it takes to cover `far` before the stagger wears off.
    const sp = Math.min(speed, d * 3.2, far * 2.3);
    v.vx = (dx / d) * sp; v.vz = (dz / d) * sp;
    v.tumble = Math.max(v.tumble, 0.5); v.cmd = null; v.dash = null; v.cast = null; v.chan = null; v.hold = null;
  }

  // Slows `v` for `T` seconds, taking `pct` of its speed (40% unless said).
  // A weaker slow never replaces a stronger one that is still running.
  slowBy(v, T, pct = 0.4) {
    v.slowK = v.slow > 0 ? Math.max(v.slowK || 0.4, pct) : pct;
    v.slow = Math.max(v.slow, T);
  }

  stun(v, T) {
    if (fixed(v)) return;
    v.stun = Math.max(v.stun, T);
    v.vx = v.vz = 0;
    v.cmd = null; v.dash = null; v.cast = null; v.chan = null; v.hold = null;
    this.emit('say', { top: v, text: 'STUN', tone: 'red' });
  }

  // Adds to a shield that builds up in steps.
  shieldUp(t, S) {
    t.shield = Math.min(S.shieldMax, t.shield + S.shieldAdd);
    t.shieldT = S.hold;
    this.emit('buff', { top: t, skill: S });
  }

  // Rooted to the spot: no moving and no dashing, but skills still work.
  snare(v, T) {
    if (fixed(v)) return;
    v.snare = Math.max(v.snare, T);
    v.vx = v.vz = 0;
    v.cmd = null; v.dash = null;
    this.emit('say', { top: v, text: 'SNARE', tone: 'red' });
  }

  // Knocked into the air: it hangs where it is and can do nothing.
  lift(v, T) {
    if (fixed(v)) return;
    v.up = Math.max(v.up, T);
    v.vx = v.vz = 0;
    v.cmd = null; v.dash = null; v.cast = null; v.chan = null; v.hold = null;
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
      const dmg = this.hurt(v, (SKILLS.sigil.pop * v.markK * s.blade.atk) / v.blade.def, s, 'sigil');
      this.emit('strike', { top: v, src: s, skill: SKILLS.sigil, x: v.x, z: v.z, dmg });
    }
    if (S.mark) { v.mark = S.mark; v.markK = s.x2 ? 2 : 1; }
    // Stun first: it stops the top dead, and the knockback then carries it off.
    if (S.stun) this.stun(v, S.stun);
    if (S.kb && shove) {
      if (S.tumble === 0) this.push(v, dx, dz, S.kb);
      else this.knock(v, dx, dz, S.kb, S.tumble ?? 0.35, S.launch ?? 1.5);
    }
    if (S.snare) this.snare(v, S.snare);
    if (S.frost) v.frost = Math.max(v.frost, S.frost);
    if (S.up) this.lift(v, S.up);
    if (S.slow) this.slowBy(v, S.slow, S.slowPct);
    if (S.bleed) this.bleed(v, S.bleed);
    if ((S.charm || S.fear) && !fixed(v)) {
      v.charm = S.charm || S.fear; v.charmDir = S.charm ? 1 : -1;
      v.cmd = null; v.dash = null; v.cast = null; v.chan = null; v.hold = null;
      this.emit('say', { top: v, text: S.charm ? 'CHARM' : 'FEAR', tone: 'red' });
    }
    // Nails: one slows a little, two or more slow hard.
    if (S.nail) { v.tag = Math.min(3, v.tag + 1); v.tagT = 4; if (v.tag >= 2) this.slowBy(v, 2, 0.6); else this.slowBy(v, 1, 0.25); }
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
        if (t.blade.egg && !t.eggUsed && t.stack >= (t.blade.egg.needStack || 0)) { this.layEgg(t); continue; }
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
    for (const k of KEYS) {
      t.cd[k] = Math.max(0, t.cd[k] - dt);
      if (t.re[k] <= 0) continue;
      t.re[k] = Math.max(0, t.re[k] - dt);
      // A window that closes with uses left over gives some of the cooldown back.
      const S = skillOf(t, k);
      if (t.re[k] <= 0 && S.refundUnused && t.stack < S.casts) t.cd[k] *= 1 - S.refundUnused * (S.casts - t.stack);
    }
    t.tumble = Math.max(0, t.tumble - dt);
    t.launch = Math.max(0, t.launch - dt);
    t.slow = Math.max(0, t.slow - dt);
    if (t.slow <= 0) t.slowK = 0;
    t.stun = Math.max(0, t.stun - dt);
    t.frost = Math.max(0, t.frost - dt);
    t.shred = Math.max(0, t.shred - dt);
    for (const k of KEYS) {
      const S = skillOf(t, k);
      // Stocked skills refill one use at a time.
      if (S.stock && t.stk < S.stock.max) { t.stkT += dt; if (t.stkT >= S.stock.every) { t.stkT = 0; t.stk++; } }
      // A stream that is let go, or has run its course, goes on cooldown.
      if (S.stream && t.streamT > 0) {
        const flying = t.dash && t.dash.skill.fly;
        t.streamT -= dt;
        if (flying) t.re[k] = Math.max(t.re[k], 0.2);
        if ((t.streamT <= 0 || t.re[k] <= 0) && !flying) { t.streamT = 0; t.re[k] = 0; t.cd[k] = S.stream.cd * t.blade.cdMul; }
      }
    }
    t.snare = Math.max(0, t.snare - dt);
    t.hitCd = Math.max(0, t.hitCd - dt);
    t.empower = Math.max(0, t.empower - dt);
    t.up = Math.max(0, t.up - dt);
    t.ground = Math.max(0, t.ground - dt);
    t.mark = Math.max(0, t.mark - dt);
    t.scar = Math.max(0, t.scar - dt);
    t.poison = Math.max(0, t.poison - dt);
    const lit = t.buff > 0;
    t.buff = Math.max(0, t.buff - dt);
    const I = t.blade.ignite;
    if (I && !this.result && t.spin > 1) {
      // SOUL IGNITION: spin is burned while it lasts and handed back, with what was taken, when it ends.
      if (t.buff > 0) { const pay = Math.min(t.spin - 1, t.spin * I.pay * dt); t.spin -= pay; t.store = Math.min(t.blade.store.max, t.store + pay); }
      else if (lit) this.release(t);
    }
    if (t.doom > 0) {
      t.doom -= dt;
      const D = opp.blade.doom;
      if (D && !this.result && !t.out && t.egg <= 0 && spinRatio(t) < D.line + D.per * opp.perm) {
        // PURGATORY: wherever it is, a marked top that drops below the line is finished.
        t.doom = 0;
        if (opp.perm < D.max) opp.perm++;
        this.emit('strike', { top: t, src: opp, skill: SKILLS.purgatory, x: t.x, z: t.z, dmg: 0, big: true });
        this.slay(t, opp);
      }
    }
    t.haste = Math.max(0, t.haste - dt);
    t.charm = Math.max(0, t.charm - dt);
    t.pin = Math.max(0, t.pin - dt);
    if (t.tagT > 0) { t.tagT -= dt; if (t.tagT <= 0) { t.tagT = 0; t.tag = 0; } }
    if (t.blade.store) t.store = Math.max(0, t.store - t.blade.store.fade * dt);
    const G = t.blade.grey;
    if (G && t.store > 0 && !this.result && t.spin > 0 && t.haste > 0) {
      // Grey spin flows back while it is hasted.
      const h = Math.min(G.rate * dt, t.store, t.spinMax - t.spin);
      t.spin += h; t.store -= h;
    }
    if (t.hold) {
      const S = skillOf(t, t.hold.key);
      t.hold.t += dt;
      // Held too long, or no longer able to throw: the wind-up is wasted.
      if (t.hold.t >= S.wind.max || this.result || t.spin <= 0 || t.out || t.air || t.egg > 0 || t.up > 0) {
        t.cd[t.hold.key] = (S.wind.cancelCd ?? S.cd) * t.blade.cdMul;
        if (S.ult) t.ult = Math.min(t.ult, 50);
        t.hold = null;
        this.emit('say', { top: t, text: 'CANCEL', tone: 'dim' });
      }
    }
    if (t.blade.rewind) {
      // A short trail of where it has been, for REWIND.
      t.histT -= dt;
      if (t.histT <= 0) { t.histT = 0.1; t.hist.push({ x: t.x, z: t.z, spin: t.spin }); if (t.hist.length > t.blade.rewind * 10) t.hist.shift(); }
    }
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
    if (t.dash && t.dash.chase !== undefined) {
      const q = this.zones.find((z) => z.id === t.dash.chase && !z.dead);
      if (q) {
        const dx = q.x - t.x, dz = q.z - t.z, d = Math.hypot(dx, dz);
        if (d > 0.7) { t.dash.dx = dx / d; t.dash.dz = dz / d; t.dash.t = d / t.dash.speed; } else t.dash.t = 0;
      }
    }
    const blink = t.blink, dash = t.dash;
    if (t.charm > 0 && !fixed(t)) {
      // Not its own master: it drifts toward (or away from) the other top.
      const dx = opp.x - t.x, dz = opp.z - t.z, d = Math.hypot(dx, dz) || 1;
      t.vx = (dx / d) * 4.5 * t.charmDir; t.vz = (dz / d) * 4.5 * t.charmDir;
      t.tumble = Math.max(t.tumble, 0.05); t.cmd = null;
    }
    moveTop(t, dt, opp);
    if (blink && !t.blink) {
      const S = blink.skill;
      if (S.empower) t.empower = S.empower;
      this.emit('blinkEnd', { top: t });
      // Arriving with a cut; nails already in the target are torn out for more.
      // A warp arrives standing still; it is not a charge.
      if (S.still) t.vx = t.vz = 0;
      if (S.dmg && S.aoe && this.burst(t, S, t.x, t.z, S.aoe, { dmg: S.dmg + (S.perTag || 0) * opp.tag }) && S.perTag) opp.tag = opp.tagT = 0;
      if (S.bolt) this.bolts(t, SKILLS[S.bolt], S.n || 1);
    }
    if (dash && !t.dash) this.dashDone(t, dash);
  }

  land(t, opp) {
    const a = t.air, S = a.skill, x = a.tx, z = a.tz;
    t.air = null; t.x = x; t.z = z; t.vx = t.vz = 0;
    if (a.by !== t.side) {
      // Thrown by the other top. Heavier tops come down harder.
      const by = this.tops[a.by];
      t.tumble = Math.max(t.tumble, 0.3);
      const hit = this.hurt(t, (S.dmg * (1 + (S.massMul || 0) * (t.mass - 1)) * by.blade.atk) / t.blade.def, by, S.id);
      if (S.id === 'fling') { if (this.own(by, 'glue').some((q) => Math.hypot(q.x - x, q.z - z) < q.r)) this.snare(t, S.snare); } else if (S.stun) this.stun(t, S.stun);
      if (S.slow) this.slowBy(t, S.slow, S.slowPct);
      by.stats.skillHits++;
      this.emit('blast', { top: by, skill: S, x, z, r: S.aoe || 2.2, hit, target: t });
      return;
    }
    if (S.id !== 'meteor') {
      t.tumble = 0.1;
      if (!S.dmg) { this.emit('blast', { top: t, skill: S, x, z, r: 1.6, hit: 0, target: null }); return; }
      const hit = this.burst(t, S, x, z, S.aoe);
      if (hit && S.healHit) this.mend(t, hit * S.healHit);
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
    if (S.kind === 'shot') { const { dx, dz } = t.charge; t.charge = null; this.fire(t, S, dx, dz); return; }
    if (S.kind === 'cone') { const { dx, dz } = t.charge; t.charge = null; this.coneHit(t, S, dx, dz); return; }
    if (S.kind === 'beam') {
      // Everything along the line is hit at once.
      const { dx, dz } = t.charge;
      t.charge = null;
      let hit = 0;
      const rx = opp.x - t.x, rz = opp.z - t.z, along = rx * dx + rz * dz, side = Math.abs(-rx * dz + rz * dx);
      if (targetable(opp) && along > -1 && along < S.range && side < S.radius + opp.radius * 0.6) {
        const g = opp.guard > 0 ? 0.3 : 1;
        hit = this.hurt(opp, (S.dmg * (S.litBonus && opp.scar > 0 ? 1 + S.litBonus : 1) * g * t.blade.atk) / opp.blade.def, t, S.id);
        if (g === 1) this.affect(t, opp, S, dx, dz);
        t.stats.skillHits++;
      }
      this.emit('beam', { top: t, skill: S, x: t.x, z: t.z, dx, dz, hit, target: hit ? opp : null });
      return;
    }
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
    if (S.seek) {
      // FOX-FIRE: the flames circle until something comes near, then go for it.
      o.t -= dt; o.ang += 4.2 * dt;
      const near = targetable(opp) && Math.hypot(opp.x - t.x, opp.z - t.z) < S.seek && o.t < S.dur - S.wait;
      if (near) this.bolts(t, SKILLS[S.bolt], o.n);
      if (near || o.t <= 0) { t.orbs = null; this.emit('orbsEnd', { top: t }); }
      return;
    }
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
    if (S.tie) {
      // Nothing happens while the chain holds; it pays off only if it lasts.
      if (!gone && th.t < th.T) return;
      t.tether = null;
      if (!gone) {
        const dmg = this.hurt(opp, (S.pop * t.blade.atk) / opp.blade.def, t, S.id);
        if (S.root) this.stun(opp, S.root);
        if (S.snareT) this.snare(opp, S.snareT);
        if (S.yank) this.pull(opp, t, S.yank);
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
            if (g === 1) { this.stun(opp, S.stun); this.knock(opp, dx, dz, S.kb, 0.25, 0); }
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
            // Fully grown it cuts three times as deep, slows harder and ices over.
            const full = z.t >= S.grow;
            this.slowBy(opp, full ? 1.5 : 1, full ? 0.6 : 0.4);
            if (full) opp.frost = Math.max(opp.frost, S.frost);
            this.dot(opp, (S.dps * (full ? 3 : 1) * dt * t.blade.atk) / opp.blade.def, t);
          }
          break;
        case 'poison':
          if (z.t >= z.T) { z.dead = true; break; }
          if (live && d < z.r + opp.radius * 0.3) opp.poison = S.linger;
          break;
        case 'glue':
          if (z.t >= z.T) { this.endZone(z); break; }
          if (live && d < z.r) { opp.ground = 0.25; this.slowBy(opp, 0.25, S.slowPct); }
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
        case 'keg':
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          // The other top can roll over one to defuse it; its owner sets it off by ramming it.
          if (live && d < z.r * 0.3 + opp.radius) { this.endZone(z); break; }
          if (z.t > 0.5 && targetable(t) && Math.hypot(t.x - z.x, t.z - z.z) < 0.9 + t.radius) this.blowKeg(z);
          break;
        case 'feather':
          if (z.t >= z.T || this.result) z.dead = true;
          break;
        case 'hshock':
          if (z.t < z.T) break;
          z.dead = true;
          if (!this.result) this.lineHit(t, S, z.x, z.z, z.dx, z.dz);
          break;
        case 'undertowz': {
          if (z.t < z.T) break;
          // The phantom left behind sets off after its master, wherever that is now.
          z.dead = true;
          const dx = t.x - z.x, dz = t.z - z.z, n = Math.hypot(dx, dz);
          if (n > 1.5 && !t.out && !this.result) {
            const p = this.fire(t, SKILLS.wraith, dx / n, dz / n, { x: z.x, z: z.z, left: 60 });
            p.back = true; p.speed *= 1.3;
          }
          break;
        }
        case 'parallel':
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          if (z.t < S.arm) break;
          // c: it has formed, and said so
          if (!z.c) { z.c = 1; this.emit('formed', { zone: z, top: t }); }
          if (live && d < z.r) opp.slow = Math.max(opp.slow, 0.3);
          if (targetable(t) && Math.hypot(t.x - z.x, t.z - z.z) < z.r) this.spring(z);
          break;
        case 'deathbelow': {
          if (z.t < z.T) break;
          z.dead = true;
          // The X: two bars crossing at the spot, turned 45 degrees from the aim.
          const rx = opp.x - z.x, rz = opp.z - z.z, s = Math.SQRT1_2;
          const u = (rx * (z.dx - z.dz) + rz * (z.dz + z.dx)) * s, w = (rx * (z.dx + z.dz) + rz * (z.dz - z.dx)) * s;
          const pad = opp.radius * 0.5, inX = live && ((Math.abs(u) < S.arm + pad && Math.abs(w) < S.width + pad) || (Math.abs(w) < S.arm + pad && Math.abs(u) < S.width + pad));
          let hit = 0;
          if (inX) {
            const fx = t.x, fz = t.z;
            t.x = z.x; t.z = z.z; t.vx = t.vz = 0; t.cmd = null; t.dash = null;
            this.emit('warp', { top: t, fx, fz });
            t.stats.skillHits++;
            if (opp.egg <= 0 && spinRatio(opp) < S.line) { this.emit('blast', { top: t, skill: S, x: z.x, z: z.z, r: z.r, hit: 0, target: null }); this.slay(opp, t); break; }
            hit = this.hurt(opp, (S.dmg * (opp.guard > 0 ? 0.3 : 1) * t.blade.atk) / opp.blade.def, t, S.id);
          }
          this.emit('blast', { top: t, skill: S, x: z.x, z: z.z, r: z.r, hit, target: hit ? opp : null });
          break;
        }
        default:
          this.genericZone(z, t, opp, S, live, dt);
      }
    }
    if (this.zones.some((z) => z.dead)) this.zones = this.zones.filter((z) => !z.dead);
  }

  // Zones described by their skill's fields: a delayed blast, or a field
  // that does something to whoever stands in it. Anything else just expires.
  genericZone(z, t, opp, S, live, dt) {
    if (S.follow && !t.out) { z.x = t.x; z.z = t.z; }
    if (S.grow) initZone(z);
    const d = Math.hypot(opp.x - z.x, opp.z - z.z);
    if (S.kind === 'blast') {
      // c: the first of two blasts has gone off, a: when the second is due
      if (z.t < (S.twice && z.c ? z.a : z.T)) return;
      if (S.twice && !z.c) { z.c = 1; z.a = z.t + S.twice; } else z.dead = true;
      if (S.line && live && d < z.r + opp.radius * 0.5 && opp.egg <= 0 && spinRatio(opp) < S.line) {
        this.emit('blast', { top: t, skill: S, x: z.x, z: z.z, r: z.r, hit: 0, target: null });
        this.slay(opp, t);
        return;
      }
      const struck = this.burst(t, S, z.x, z.z, z.r);
      if (struck && S.doom) opp.doom = S.doom;
      if (struck && S.gain) t.perm = Math.min(255, t.perm + S.gain);
      return;
    }
    if (z.t >= z.T || this.result) {
      if (S.endDmg && !this.result) {
        // One that ripens hits harder, and slows more, the longer it was left.
        const ripe = S.ripen ? Math.min(1, z.t / S.ripen) : 0;
        const hit = this.burst(t, S, z.x, z.z, z.r, { dmg: S.endDmg * (1 + (S.ripeMul || 0) * ripe), as: { stun: S.endStun, slow: S.endSlow, slowPct: S.ripen ? S.endSlowPct + (S.ripeSlowPct - S.endSlowPct) * ripe : S.endSlowPct, kb: S.endKb } });
        // Its owner standing inside when it goes off is shielded instead.
        if (S.endShield && Math.hypot(t.x - z.x, t.z - z.z) < z.r) { t.shield = S.endShield; t.shieldT = 2.5; }
        void hit;
      }
      this.endZone(z);
      return;
    }
    if (S.kind !== 'field') return;
    const inside = live && d < z.r + opp.radius * 0.3;
    if (inside && S.gain) { z.b += dt; if (z.b >= 1) { z.b -= 1; t.perm = Math.min(255, t.perm + S.gain); } }
    // At the very centre of a singularity, a top with almost nothing left is crushed.
    if (inside && S.core && d < S.core && opp.egg <= 0 && spinRatio(opp) < S.line + S.perLine * z.c) { this.endZone(z); this.slay(opp, t); return; }
    if (S.cage) {
      // Only the rim matters: touching it stuns, once.
      if (!z.c && z.t > S.arm && live && Math.abs(d - z.r) < 0.5) { z.c = 1; this.stun(opp, S.cage); this.hurt(opp, (S.dmg * t.blade.atk) / opp.blade.def, t, S.id); }
      return;
    }
    if (inside) {
      if (S.slowIn) this.slowBy(opp, 0.3, S.slowPct);
      if (S.dps) this.dot(opp, (S.dps * dt * t.blade.atk) / opp.blade.def, t);
      if (S.pullIn && d > 0.3) this.push(opp, (z.x - opp.x) / d, (z.z - opp.z) / d, S.pullIn * dt);
      // No dashing through a planted guard.
      if (S.block && (opp.dash || opp.blink)) {
        opp.dash = opp.blink = null;
        const dmg = this.hurt(opp, (S.dmg * t.blade.atk) / opp.blade.def, t, S.id);
        this.lift(opp, S.blockUp);
        opp.ground = Math.max(opp.ground, S.groundT);
        this.slowBy(opp, S.groundT, S.slowPct);
        this.emit('strike', { top: opp, src: t, skill: S, x: opp.x, z: opp.z, dmg });
      }
    }
    if (!t.out && !t.air && t.spin > 0 && Math.hypot(t.x - z.x, t.z - z.z) < z.r) {
      if (S.regen) { const h = Math.min(S.regen * dt, t.spinMax - t.spin); t.spin += h; z.a += h; z.b += dt; if (z.b >= 1) { if (z.a >= 1) this.emit('heal', { top: t, amount: z.a }); z.a = 0; z.b = 0; } }
      if (S.hasteIn) t.haste = Math.max(t.haste, 0.3);
    }
  }

  // PARALLEL CONVERGENCE going off because its owner stepped into it.
  spring(z) {
    if (z.dead) return;
    const t = z.owner, opp = this.other(t), S = z.skill;
    this.endZone(z);
    if (targetable(opp) && !this.result && Math.hypot(opp.x - z.x, opp.z - z.z) < z.r + opp.radius * 0.3 && opp.guard <= 0) { this.stun(opp, S.stun); t.stats.skillHits++; }
    t.shield = S.shield; t.shieldT = 2;
    this.emit('blast', { top: t, skill: S, x: z.x, z: z.z, r: z.r, hit: 0, target: null });
  }

  // A powder keg going off, and setting off its neighbours.
  blowKeg(z) {
    if (z.dead) return;
    const t = z.owner, S = z.skill;
    this.endZone(z);
    this.burst(t, S, z.x, z.z, S.aoe);
    for (const q of this.own(t, 'keg')) if (Math.hypot(q.x - z.x, q.z - z.z) < S.aoe + 2) this.blowKeg(q);
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
    // A dash that carries no blow of its own just stops on contact: its
    // speed is for getting somewhere, not for ramming.
    for (const s of [a, b]) {
      const h = s.dash;
      if (h && !h.skill.dmg) { this.stopDash(s); s.vx = h.dx * 6; s.vz = h.dz * 6; }
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
    const bonus = (s, v, amount, keep, pierce = false) => {
      const add = (amount * s.blade.atk) / (pierce ? 1 : v.blade.def);
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
      const s = a.dash ? a : b, v = this.other(s), h = s.dash, D = h.skill;
      kind = 'dash'; power += 14;
      bonus(s, v, D.dmg * (h.pow || 1) * (D.perBleed ? 1 + D.perBleed * v.bleed : 1), D.keep ?? 1, !!D.trueDmg);
      // Landing it hands back part of what is left of its cooldown.
      if (D.refundHit) { const k = this.keyOf(s, D.id); if (k) s.cd[k] *= 1 - D.refundHit; }
      thrown(s, v, D.kb, 0.55);
      s.stats.skillHits++;
      this.affect(s, v, D, 0, 0, false);
      // SHIFTING SANDS: the emperor arrives behind a shield, the target goes up.
      if (D.liftUp) { this.lift(v, D.liftUp); s.shield = D.shield; s.shieldT = D.hold; }
      // Carried along the line of the charge, toward whatever wall is there.
      if (D.carry && !fixed(v)) { const k = Math.hypot(v.vx, v.vz); v.vx = h.dx * k; v.vz = h.dz * k; v.pin = D.carry; v.launch = Math.max(v.launch, 1); }
    } else if (a.empower > 0 !== b.empower > 0 && ((a.empower > 0 ? a : b).empS || (a.empower > 0 ? a : b).blade.emp)) {
      const s = a.empower > 0 ? a : b, v = this.other(s), E = s.empS || s.blade.emp;
      kind = 'empower'; power += 10;
      thrown(s, v, E.kb, 0.45);
      // Some skills empower more than one hit.
      if (s.empN > 1) s.empN--; else { s.empower = 0; s.empN = 0; }
      s.stats.skillHits++;
      bonus(s, v, E.bonus, 1);
      this.affect(s, v, E, 0, 0, false);
      if (E.hitHeal) this.mend(s, E.hitHeal * s.spinMax);
      // Landing it opens the follow-up on the same key.
      if (E.re) { const k = this.keyOf(s, E.id); if (k) s.re[k] = E.window; }
      // A shockwave fans out behind the target. One on one there is nobody there;
      // with more tops in the ring, this is where they would be hit.
      if (E.wave) { const dx = v.x - s.x, dz = v.z - s.z, d2 = Math.hypot(dx, dz) || 1; this.emit('cone', { top: s, skill: SKILLS[E.wave], x: v.x, z: v.z, dx: dx / d2, dz: dz / d2, hit: 0, target: null }); }
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
      // A stunned top is carried by the blow instead of holding its ground.
      if (a.stun > 0) a.tumble = Math.max(a.tumble, 0.22);
      if (b.stun > 0) b.tumble = Math.max(b.tumble, 0.22);
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
    for (const [s, v] of [[a, b], [b, a]]) {
      const N = s.blade.nailPop;
      if (N && v.tag > 0 && !this.result) { const d2 = this.hurt(v, (N[v.tag - 1] * s.blade.atk) / v.blade.def, s, 'nails'); v.tag = v.tagT = 0; this.emit('strike', { top: v, src: s, skill: SKILLS.nails, x: v.x, z: v.z, dmg: d2 }); }
    }
    // A mark that a body hit sets off as well as a skill.
    for (const [s, v] of [[a, b], [b, a]]) {
      if (v.mark > 0 && s.blade.markOnClash) { v.mark = 0; const d2 = this.hurt(v, (SKILLS.sigil.pop * s.blade.atk) / v.blade.def, s, 'sigil'); this.emit('strike', { top: v, src: s, skill: SKILLS.sigil, x: v.x, z: v.z, dmg: d2 }); }
    }
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
    if (t.pin > 0 && c.vn > 3) {
      const by = this.other(t), P = by.blade.pin;
      t.pin = 0;
      if (P) { this.hurt(t, (P.dmg * by.blade.atk) / t.blade.def, by, 'pin'); this.stun(t, P.stun); }
    }
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
      if (z.dead) continue;
      // A whirl of blades cuts down whatever flies into it.
      if (z.skill.eat && z.owner !== p.owner && Math.hypot(p.x - z.x, p.z - z.z) < z.r) return true;
      if (!(z.kind === 'icewall' || (z.kind === 'windwall' && z.owner !== p.owner))) continue;
      const rx = p.x - z.x, rz = p.z - z.z;
      if (Math.abs(rx * z.dx + rz * z.dz) < 0.6 && Math.abs(-rx * z.dz + rz * z.dx) < z.skill.wall + p.r * 0.5) return true;
    }
    return false;
  }

  projHit(p, v) {
    const o = p.owner, S = p.skill;
    let k = 1;
    if (S.frostMul && v.frost > 0) k = S.frostMul;
    // Finishers bite harder the less spin the target has left.
    if (S.exec) k *= 1 + S.exec * (1 - spinRatio(v));
    if (S.far) k *= 1 + S.far * clamp((S.range - p.left) / S.range, 0, 1);
    if (p.back && S.backMul) k *= S.backMul;
    if (p.back && S.backTrue) k *= v.blade.def; // the way back ignores defence
    const scarred = v.scar > 0;
    const dmg = this.hurt(v, (p.dmg * k) / v.blade.def, o, S.id);
    if (S.chain) this.pull(v, o, S.pull, S.pullDist);
    // TIMEWINDER stops where it hits and hangs there as a slowing field.
    if (S.crawl && !p.back && !p.crawl) { p.crawl = true; p.speed = S.crawl; p.left = S.crawl * S.linger; }
    o.x2 = !!p.x2;
    this.affect(o, v, S, p.dx, p.dz);
    o.x2 = false;
    if (S.id === 'galeq') { o.stack = Math.min(S.stacks, o.stack + 1); o.stackT = S.keep; }
    if (S.id === 'flourish' && scarred) this.stun(v, S.root);
    if (S.tie) {
      o.tether = { t: 0, T: S.dur, skill: S, acc: 0, tick: 0 };
      this.emit('say', { top: v, text: S.tie, tone: '' });
    }
    if (S.refund) for (const k of KEYS) o.cd[k] = Math.max(0, o.cd[k] - S.refund);
    if (S.refundKey) for (const k in S.refundKey) o.cd[k] = Math.max(0, o.cd[k] - S.refundKey[k]);
    // An overcharge is kept going by landing shots.
    if (o.buff > 0 && o.blade.buff && o.blade.buff.extendTo) o.buff = o.blade.buff.extendTo;
    if (S.reOnHit) { const k = this.keyOf(o, S.id); if (k) o.re[k] = S.reOnHit; }
    if (S.permHit && o.perm < S.permHit) { o.perm++; this.emit('say', { top: o, text: '+' + o.perm, tone: 'gold' }); }
    if (S.spawn) this.zone(o, SKILLS[S.spawn], v.x, v.z);
    if (S.splash) this.burst(o, S, p.x, p.z, S.splash, { dmg: S.splashDmg, as: {} });
    // The third quill to land pins the target.
    if (S.id === 'quill') { o.stack++; o.stackT = 1.5; if (o.stack === 3) this.stun(v, S.root); }
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
      if (p.back) {
        // On its way home: it steers at its owner and is caught on arrival.
        const o = p.owner, hx = o.x - p.x, hz = o.z - p.z, hd = Math.hypot(hx, hz);
        if (hd < 1.3 || o.out) { p.dead = true; if (S.shieldAdd && !o.out) this.shieldUp(o, S); continue; }
        p.dx = hx / hd; p.dz = hz / hd;
      }
      p.x += p.dx * st; p.z += p.dz * st; p.left -= st;
      const v = this.other(p.owner);
      if (p.crawl && targetable(v) && Math.hypot(v.x - p.x, v.z - p.z) < S.field) this.slowBy(v, 0.3, S.fieldPct);
      const keg = this.own(p.owner, 'keg').find((q) => Math.hypot(q.x - p.x, q.z - p.z) < 1.2 + p.r);
      if (keg) { p.dead = true; this.blowKeg(keg); continue; }
      if (this.stopped(p)) {
        p.dead = true;
        if (S.re) this.unre(p.owner, S.id);
        this.emit('projEnd', { proj: p, x: p.x, z: p.z });
      } else if (!this.result && !p.hit && !S.friendly && targetable(v) && Math.hypot(v.x - p.x, v.z - p.z) < p.r + v.radius) {
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
        else if (S.crawl && !p.crawl && !p.back) { p.crawl = true; p.speed = S.crawl; p.left = S.crawl * S.linger; }
        else if (S.ret && !p.back) { p.back = true; p.crawl = false; p.hit = false; p.left = 60; p.speed = S.speed * 1.3; }
        else {
          p.dead = true;
          if (S.feather && Math.hypot(p.x, p.z) < ARENA.R) this.zone(p.owner, SKILLS.feather, p.x, p.z, null, true);
          if (S.splash) this.burst(p.owner, S, p.x, p.z, S.splash, { dmg: S.splashDmg, as: {} });
          this.emit('projEnd', { proj: p, x: p.x, z: p.z });
        }
      }
    }
    if (this.projectiles.some((p) => p.dead)) this.projectiles = this.projectiles.filter((p) => !p.dead);
  }
}
