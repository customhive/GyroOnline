// Battle simulation. No rendering in here: the world steps the two tops and
// pushes events that the renderer, audio and HUD react to.
import { STAGES, ARENA, ARENA_SIZES, SKILLS, KEYS, BLEED, CC, FLASH, setArenaSize, skillOf } from './config.js';

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
    sleep: 0,              // asleep: the next blow hits harder and wakes it (host only)
    styleLast: '',         // STYLE: the kind of attack that landed last (host only)
    stk: 0, stkT: 0,       // uses stored up for the blade's stocked skill, and time to the next
    streamT: 0,            // a held stream of fire: time left before it counts as let go
    markK: 1,              // how hard the mark on this top goes off
    markHold: false,       // the mark waits for the follow-up that was promised it: no other skill sets it off
    chak: 0, chakT: 0,     // chakrams this top holds (those in flight still count until they miss), and how long before they all go
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
    silence: 0,            // cannot use skills
    // Host-only odds and ends for particular blades.
    shredK: 1,             // how much more a softened top takes
    bleedBy: -1,           // who made it bleed
    spray: null,           // a burst of shots being fired one after another: { skill, n, every, acc, dx, dz }
    echo: null,            // a follow-up that lands a second time a moment later: { t, wi, to: [sides] }
    grab: 0,               // BACK TOSS is waiting for a body hit: time left
    drag: 0,               // being pulled in: time left (no FLASH out of it)
    clawSlowDelay: 0,     // delayed slow after Death Grasp finishes pulling
    dragTo: null,          // and toward whom or what
    hema: false,           // the frenzy it is in is the ultimate's: stronger than the plain one
    trailZ: null,          // TOXIC LINE: the stretch of trail still being drawn out behind this top
    volley: null,          // blows landing one after another on whoever is nearest: { skill, n, every, acc, off }
    rayA: null,            // the bearing of a beam that turns to follow the cursor
    dbl: 0,                // the next body hit lands twice
    kickT: 0, kickBy: -1, kickHit: 0, // kicked away by DRAGON'S RAGE: time left in flight, by whom, and whom it has already bowled over
    once: false,           // the one-per-round shield has been used
    odT: 0,                // OVERDRIVE winding down
    deN: 0, deT: 0,        // deconstruction: skill hits taken lately
    ardent: 0, ardentBy: -1, // marked by ARDENT BLAZE
    shrugCd: 0,            // time until the next crowd control can be shrugged off
    rockT: 0,              // just set off boulders: not again for a moment
    prey: -1,              // the enemy this top last struck with a skill (its follow-ups go there)
    dmarkTo: -1,           // whom the death mark is on
    quills: 0, quillT: 0,  // quills that have struck this top lately (host only)
    gone: null,            // out of this round: how ('over', 'burst', 'spin'), or null while still in it
    team: side,            // tops on the same team do not fight each other
    perm: 0,               // growth that lasts the whole match, not just the round
    still: false,          // practice: a dummy that stays where it is put
    back: 0,               // practice: time until a top that went down is put back
    realm: 0,              // shut in a REALM OF DEATH: 1 + the side of whoever made it (0: in the ordinary world)
    flash: 1,              // FLASH: uses left this round
    // LUNAR ARSENAL: main and off-hand weapon, the ones waiting, shots left in each, each one's cooldown.
    // Like `perm`, the weapons carry over from round to round.
    subj: 0,               // VISION PAINTER: the subject chosen (1 Q, 2 W, 3 E), waiting for its spell
    lights: 0, lightsT: 0, // STIRRING LIGHTS: hits left that carry its bonus, and time left (host only)
    wm: 0, wo: 1, wq: [2, 3, 4], wa: [5, 5, 5, 5, 5], wcd: [0, 0, 0, 0, 0],
    dot: 0, dotT: 0, drop: 0, hist: [], histT: 0, // bookkeeping only; not sent over the network
    cd: { Q: 0, W: 0, E: 0, R: 0 },
    re: { Q: 0, W: 0, E: 0, R: 0 }, // recast windows
    windup: { Q: 0, W: 0, E: 0, R: 0 },
    ult: 0, lastHit: null,
    stats: { dealt: 0, taken: 0, clashes: 0, skillHits: 0, parries: 0, maxHit: 0 },
  };
}

// Tops shut in a REALM OF DEATH and tops outside it cannot touch one another.
// While the simulation works on behalf of one top (its own update, its shots,
// its zones, a skill it casts), SCOPE is the world that top is in and nothing
// outside it can be targeted. -1: no one in particular is acting (the HUD, a CPU thinking).
let SCOPE = -1;
export const targetable = (t) => !t.air && !t.out && !t.blink && !t.gone && !(t.charge && t.charge.skill.veil) && (SCOPE < 0 || t.realm === SCOPE);
export const spinRatio = (t) => Math.max(0, t.spin / t.spinMax);
// How fast a launched top must meet the wall to go over it: the more spin it has left, the faster.
export const ringOutAt = (t) => ARENA.ringOutSpeed + (ARENA.ringOutFull - ARENA.ringOutSpeed) * clamp((spinRatio(t) - ARENA.ringOutBelow) / (1 - ARENA.ringOutBelow), 0, 1);
// Tops with little spin left are thrown further.
export const kbMul = (t) => 1 + 0.85 * (1 - spinRatio(t));
// Nothing moves it: braced for a blast, or inside the egg.
const fixed = (t) => !!((t.charge && t.charge.skill.root) || t.egg > 0 || (t.dash && t.dash.skill.unstoppable));
// Held in place for now, though a hit may still throw it.
export const rooted = (t) => fixed(t) || !!t.chan || t.up > 0;

// Free movement of one top: bowl pull, self-propulsion, move order or dash.
// Also used on copies for prediction, so it must not touch anything but `t`.
export function moveTop(t, dt, opp) {
  if (t.dash && t.dash.skill.slide) {
    // Riding the wall: round the rim, not across the floor. Where the wall
    // stops (a gate), so does the ride.
    const d = t.dash, lim = ARENA.R - t.radius, a = Math.atan2(t.z, t.x);
    const s = -Math.sin(a) * d.dx + Math.cos(a) * d.dz >= 0 ? 1 : -1, a2 = a + (s * d.speed * dt) / lim;
    d.t -= dt;
    if (d.t <= 0 || rimOpen(Math.cos(a2) * lim, Math.sin(a2) * lim, t.radius * 0.8)) {
      // It steps off inward, slowly enough not to roll out through a gate.
      const keep = d.t <= 0 ? t.blade.speed * 0.8 : 0;
      t.vx = d.dx * keep - Math.cos(a) * 3; t.vz = d.dz * keep - Math.sin(a) * 3;
      t.dash = null;
      return;
    }
    t.x = Math.cos(a2) * lim; t.z = Math.sin(a2) * lim;
    d.dx = -Math.sin(a2) * s; d.dz = Math.cos(a2) * s;
    t.vx = d.dx * d.speed; t.vz = d.dz * d.speed;
    return;
  }
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
  const slow = (t.ground > 0 ? Math.min(0.4, eased) : eased) * ((B && ((t.hema && t.blade.buffUp && t.blade.buffUp.speed) || B.speed)) || 1) * (t.haste > 0 ? 1.3 : 1) * (t.hold ? skillOf(t, t.hold.key).holdSlow ?? 0.8 : 1) * (t.blade.style ? 1 + t.blade.style.speed * (t.stack || 0) : 1)
    * (t.blade.aura && t.stack >= t.blade.aura.hits ? t.blade.aura.speed : 1)
    // TOXIC LINE: quicker while the trail is being laid.
    * (t.toggle ? SKILLS.poison.speed : 1)
    * (t.blade.surf && t.scar <= 0 && Math.hypot(t.x, t.z) > ARENA.R - 3.4 && !rimOpen(t.x, t.z) ? t.blade.surf : 1);
  // Stunned tops stay put too, except while a hit is still carrying them.
  const held = rooted(t) || ((t.stun > 0 || t.snare > 0) && t.tumble <= 0);
  // Steeper near the middle than a plain bowl, so orbits of different size drift out of step.
  const well = ARENA.K * (0.55 + 3.2 / (Math.hypot(t.x, t.z) + 1.5));
  let ax = -well * t.x, az = -well * t.z;
  // Stunned or snared, it stays exactly where it is: the slope of the bowl does not carry it off.
  if ((t.stun > 0 || t.snare > 0) && t.tumble <= 0) ax = az = 0;
  let drag = 0.15;
  if (t.spin <= 0) {
    drag = 2.2;
  } else if (held) {
    drag = 9;
  } else if (t.still && t.tumble <= 0) {
    drag = 5;
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
  if (t.spin > 0 && t.tumble <= 0 && !t.cmd && !held && !t.still) {
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
  // Slow caps ordinary travel without changing its direction. Forced movement
  // keeps its momentum; dash/blink already returned above.
  if ((t.slow > 0 || t.ground > 0) && t.spin > 0 && !held && !t.still
      && t.tumble <= 0 && !(t.drag > 0) && !(t.launch > 0) && !t.air && !t.out) {
    const base = t.blade.speed * (t.cmd ? 1.2 * (0.55 + 0.45 * sr) : 0.3 + 0.7 * sr);
    const limit = Math.max(0, base * slow), speed = Math.hypot(t.vx, t.vz);
    if (speed > limit) { const k = limit / speed; t.vx *= k; t.vz *= k; }
  }
  t.x += t.vx * dt; t.z += t.vz * dt;
}

// The stage being played. There is one match at a time, so this is module
// state: the free functions that predict movement need it too.
let STAGE = STAGES[0];
export const setStage = (i) => { STAGE = STAGES[i] || STAGES[0]; };
export const stageNow = () => STAGE;
// Is the rim open at this point's bearing (a gap, or no wall at all)?
// `fit` narrows a gap by the room a top of that radius needs to pass.
export function rimOpen(x, z, fit = 0) {
  if (!STAGE.wall) return true;
  if (!STAGE.gaps.length) return false;
  const a = Math.atan2(-z, x), pad = fit / ARENA.R;
  for (const [c, h] of STAGE.gaps) {
    const d = Math.abs(Math.atan2(Math.sin(a - c), Math.cos(a - c)));
    if (d < h - pad) return true;
  }
  return false;
}

// How far it is from a point, along a direction, to the rim.
const toRim = (x, z, dx, dz) => { const b = x * dx + z * dz, c = x * x + z * z - ARENA.R * ARENA.R; return c >= 0 ? 0 : -b + Math.sqrt(b * b - c); };

// Pushes the top back inside the wall. Returns the contact if it was touching.
// Where there is no wall the top is left where it is and the contact says so.
export function wallContact(t) {
  const lim = ARENA.R - t.radius;
  const r = Math.hypot(t.x, t.z);
  if (r <= lim) return null;
  const nx = t.x / r, nz = t.z / r;
  if (rimOpen(t.x, t.z, t.radius * 0.8)) return { nx, nz, vn: t.vx * nx + t.vz * nz, open: true, r };
  // Past the wall line beside a gap: it went through, and stays out.
  if (r > ARENA.R + 0.2 && STAGE.gaps.length && rimOpen(t.x, t.z)) return { nx, nz, vn: t.vx * nx + t.vz * nz, open: true, r };
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
    dir: t.dir, radius: t.radius, tumble: t.tumble, drag: t.drag, launch: t.launch, slow: t.slow, phase: t.phase, stack: t.stack,
    ground: t.ground, buff: t.buff, haste: t.haste, up: t.up, egg: t.egg, chan: t.chan, hold: t.hold, stun: t.stun, snare: t.snare, slowK: t.slowK, still: t.still, toggle: t.toggle, hema: t.hema,
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
      if (c && !c.open && c.vn > 0) { bounce(g, c); g.dash = null; }
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
  // (A turret's c is two things: 1 for the upgraded one, and 2 for every blow it has taken.)
  const big = z.kind === 'turret' ? z.c & 1 : z.c;
  z.r = (big && S.bigAoe) || S.aoe || S.radius || 1;
  // A wall as long as it was made.
  if (S.grown) z.half = z.a;
  if (S.star) z.r *= 1 + z.c * 0.005;
  z.T = z.kind === 'divide' ? S.travel / S.speed + S.hold : (big && S.bigDur) || S.dur || S.delay || 1;
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
  // new World(bladeA, bladeB, seed, stage) for a duel, or
  // new World([blades...], { seed, stage, size, teams, ff, practice }) for two to four tops.
  constructor(bladeA, bladeB, seed = 1, stage = 0) {
    let blades = [bladeA, bladeB], teams = null;
    let ff = false, size = 0, practice = false;
    if (Array.isArray(bladeA)) { const o = bladeB || {}; blades = bladeA; seed = o.seed ?? 1; stage = o.stage ?? 0; size = o.size ?? 0; teams = o.teams || null; ff = !!o.ff; practice = !!o.practice; }
    // Practice: no round to win. Side 0 is the player, the rest are dummies; a top that goes down is put back.
    // `noCd` and `fullUlt` are the player's, `keep` says whose spin never falls (by side).
    this.practice = practice ? { noCd: false, fullUlt: false, keep: blades.map(() => false) } : null;
    // Friendly fire: with it on, a team's own attacks land on its own tops too.
    this.ff = ff;
    this.stage = stage;
    setStage(stage);
    // How wide the arena is. Like the stage, there is one match at a time and this is its arena.
    this.size = ARENA_SIZES[size] ? size : 0;
    setArenaSize(this.size);
    this.rng = mulberry32(seed);
    this.tops = blades.map((b, i) => makeTop(i, b));
    if (teams) this.tops.forEach((t, i) => { t.team = teams[i] ?? i; });
    this.projectiles = [];
    this.zones = [];
    this.events = [];
    this.time = 0;
    this.result = null;
    this.projId = 0;
    this.resetRound();
  }

  // Everyone still in the round that `t`'s attacks can land on: its enemies,
  // and its own team too when friendly fire is on.
  foes(t) { return this.tops.filter((o) => o !== t && !o.gone && o.realm === t.realm && (this.ff || o.team !== t.team)); }
  // Those on its own side still in the round (and in the same world as it).
  mates(t) { return this.tops.filter((o) => o !== t && !o.gone && !o.out && o.realm === t.realm && o.team === t.team); }
  // Only those it is actually fighting.
  enemies(t) { return this.tops.filter((o) => o !== t && !o.gone && o.realm === t.realm && o.team !== t.team); }
  // The one `t` is fighting right now: the nearest enemy still in the round.
  // In a duel that is simply the other top, in or out.
  other(t) { return this.near(t, t.x, t.z); }
  // The enemy of `t` nearest a point (one that can be hit, if any can).
  near(t, x, z) {
    let best = null, bd = Infinity;
    for (const o of this.tops) {
      if (o === t || o.team === t.team) continue;
      const d = Math.hypot(o.x - x, o.z - z) + (o.gone ? 1e6 : o.realm !== t.realm ? 1e5 : targetable(o) ? 0 : 1e3);
      if (d < bd) { bd = d; best = o; }
    }
    return best || this.tops.find((o) => o !== t);
  }
  // Whom a skill cast at a point is meant for: of the enemies it could be used
  // on, the one nearest that point (the cursor). A follow-up goes to whoever the
  // first part struck.
  pick(t, c, S) {
    if (c.re && t.prey >= 0) { const p = this.tops[t.prey]; if (p && !p.gone && p.team !== t.team) return p; }
    const reach = S.grab ?? S.range ?? Infinity;
    const ok = (o) => targetable(o) && (S.need !== 'up' || o.up > 0) && (!S.need || Math.hypot(o.x - t.x, o.z - t.z) <= reach);
    let best = null, bd = Infinity;
    for (const o of this.enemies(t)) {
      if (!ok(o)) continue;
      const d = Math.hypot(o.x - c.ax, o.z - c.az);
      if (d < bd) { bd = d; best = o; }
    }
    return best || this.near(t, c.ax, c.az);
  }
  // Enemies of `t` standing in a zone (its radius, plus `pad` of their own).
  inZone(z, t, pad = 0) { return this.result ? [] : this.foes(t).filter((o) => targetable(o) && Math.hypot(o.x - z.x, o.z - z.z) < z.r + o.radius * pad); }
  // Tops, or teams, still standing.
  sidesLeft() { return new Set(this.tops.filter((t) => !t.gone).map((t) => t.team)).size; }
  emit(type, data) { this.events.push({ type, ...data }); }
  // Whoever struck `t` last, if that was recent enough to be the reason it is flying.
  lastBy(t) { const h = t.lastHit; return h && h.by >= 0 && this.time - h.time < 4 ? this.tops[h.by] : null; }

  // Live zones of one kind placed by `t`.
  own(t, kind) { return this.zones.filter((q) => q.owner === t && q.kind === kind && !q.dead); }

  resetRound() {
    this.projectiles.length = 0;
    this.zones.length = 0;
    this.result = null;
    this.time = 0;
    for (const t of this.tops) this.resetTop(t);
  }

  // One top as it starts a round: where it stands, and nothing left over from before.
  resetTop(t) {
    // Evenly round the ring, each moving off along it. Two tops start near and far.
    const ph = (Math.PI * 2 * t.side) / this.tops.length, r0 = (7.5 * ARENA.R) / 13;
    t.x = r0 * Math.sin(ph); t.z = r0 * Math.cos(ph);
    t.vx = t.blade.speed * 0.75 * Math.cos(ph); t.vz = -t.blade.speed * 0.75 * Math.sin(ph);
    if (Math.abs(t.x) < 1e-9) t.x = 0;
    if (Math.abs(t.vz) < 1e-9) t.vz = 0;
    // Practice: the dummies wait in the middle.
    if (this.practice && t.side) { t.x = (t.side - 1) * 3; t.z = 0; t.vx = t.vz = 0; }
    t.back = 0;
    t.gone = null; t.prey = t.dmarkTo = -1; t.quills = t.quillT = 0; t.realm = 0; t.flash = 1;
    t.silence = t.dbl = t.odT = t.deN = t.deT = t.ardent = t.shrugCd = t.rockT = t.kickT = t.kickHit = 0; t.shredK = 1; t.bleedBy = t.ardentBy = -1; t.spray = null; t.volley = null; t.echo = null; t.drag = 0; t.clawSlowDelay = 0; t.dragTo = null; t.grab = 0; t.trailZ = null; t.hema = false; t.rayA = null; t.once = false;
    t.spin = t.spinMax;
    t.cmd = t.cast = t.dash = t.air = t.out = t.blink = t.charge = t.orbs = t.tether = t.chan = t.ret = t.hold = null;
    t.tumble = t.launch = t.guard = t.slow = t.hitCd = t.empower = 0;
    t.up = t.ground = t.mark = t.scar = t.poison = t.bleed = t.bleedT = t.shield = t.shieldT = t.buff = t.frost = t.doom = t.empN = t.shred = t.stkT = t.streamT = 0;
    const stocked = KEYS.map((k) => skillOf(t, k)).find((S) => S.stock);
    t.stk = stocked ? stocked.stock.max : 0;
    t.markK = 1; t.markHold = false; t.chak = t.chakT = 0;
    t.ret2 = t.empS = null;
    t.stack = t.stackT = t.last = t.dmark = t.dacc = t.egg = t.eggHp = t.dot = t.dotT = t.drop = 0;
    t.sleep = 0; t.styleLast = ''; t.subj = t.lights = t.lightsT = 0;
    t.wcd.fill(0);
    t.haste = t.charm = t.pin = t.store = t.tag = t.tagT = t.histT = t.stun = t.snare = t.slowK = 0;
    t.hist = [];
    t.toggle = t.eggUsed = false;
    t.lastHit = null;
    for (const k of KEYS) { t.cd[k] = k === 'R' ? 0 : 1.2; t.re[k] = 0; }
  }

  // `fresh`: a new click, not the repeat of a held button. Only that steps a top down off the wall.
  issueMove(t, x, z, fresh = false) {
    if (fresh && t.dash && t.dash.skill.slide && !this.result) { const a = Math.atan2(t.z, t.x); t.dash = null; t.vx = -Math.cos(a) * 3; t.vz = -Math.sin(a) * 3; }
    if (this.result || t.air || t.out || t.dash || t.blink || rooted(t) || (t.buff > 0 && t.blade.buff && t.blade.buff.frenzy) || (t.charge && t.charge.skill.still) || (t.ret && skillOf(t, 'R').autoRet) || t.stun > 0 || t.snare > 0 || !Number.isFinite(x + z)) return false;
    const lim = ARENA.R - t.radius - 0.2;
    const r = Math.hypot(x, z);
    if (r > lim) { x *= lim / r; z *= lim / r; }
    t.cmd = { x, z, t: 2.2 };
    return true;
  }

  // FLASH is there for anyone who can move of its own accord: not while held,
  // thrown or already in the middle of a dash or leap. Aiming, winding up or
  // drawing breath for a skill does not stop it.
  canFlash(t) {
    return !!(t.flash > 0 && !this.result && t.spin > 0 && !t.gone && !t.out && !t.air && !t.dash && !t.blink && t.up <= 0 && t.stun <= 0 && t.snare <= 0
      && t.charm <= 0 && t.ground <= 0 && t.egg <= 0 && !(t.tumble > 0 && t.launch > 0) && t.drag <= 0 && !(t.charge && t.charge.skill.veil));
  }

  // To the point given if it is within reach, else as far toward it as reach allows. Never past the wall.
  flash(t, x, z) {
    if (!this.canFlash(t) || !Number.isFinite(x + z)) return false;
    let dx = x - t.x, dz = z - t.z;
    const d = Math.hypot(dx, dz);
    if (d > FLASH.range) { dx *= FLASH.range / d; dz *= FLASH.range / d; }
    let nx = t.x + dx, nz = t.z + dz;
    const lim = ARENA.R - t.radius - 0.2, r = Math.hypot(nx, nz);
    if (r > lim) { nx *= lim / r; nz *= lim / r; }
    const fx = t.x, fz = t.z;
    // (A trail being laid does not stretch across the jump.)
    t.trailZ = null;
    t.flash--;
    t.x = nx; t.z = nz;
    this.emit('flash', { top: t, fx, fz });
    return true;
  }

  // States that block every skill, whatever its cooldown.
  // `free`: the skill is one that shakes off whatever holds its user, so being
  // stunned or silenced does not stop it (being in the air still does).
  busy(t, firing = false, free = false) {
    // A top in flight is dashing, but free to use its skills.
    if (t.chan && firing) return !!(this.result || t.spin <= 0 || t.up > 0 || t.stun > 0);
    return !!(this.result || t.spin <= 0 || t.air || t.out || t.cast || (t.dash && !t.dash.skill.fly) || t.blink || (t.charge && !t.charge.skill.loose) || t.chan || t.volley || t.up > 0 || (!free && (t.stun > 0 || t.silence > 0)) || t.egg > 0);
  }

  // The skill a key would cast right now: its second stage while the recast
  // window is open, the tornado once the wind is stacked, the copy for MIMIC.
  aimSkill(t, key) {
    const S = skillOf(t, key);
    // VISION PAINTER: with a subject chosen, Q/W/E are its three spells and R washes the brush.
    if (t.subj && t.blade.painter) return key === 'R' ? SKILLS.washbrush : SKILLS[skillOf(t, KEYS[t.subj - 1]).spells[key]];
    // THE DARKIN BLADE is three different swings on one key.
    if (S.id === 'darkinblade') return SKILLS['darkin' + (t.re[key] > 0 ? Math.min(3, t.stack + 1) : 1)];
    // LUNAR ARSENAL: what the key does a second time depends on the weapon in hand.
    if (S.weapons && t.re[key] > 0) return SKILLS[SKILLS[S.weapons[t.wm]].again || S.re];
    // GRAVITUM: with anyone slowed, however that came about, the key roots at once.
    if (S.weapons && SKILLS[S.weapons[t.wm]].eclipse && this.foes(t).some((o) => o.slow > 0 && targetable(o))) return SKILLS[S.re];
    if (S.re && t.re[key] > 0) return SKILLS[S.re];
    // LUNAR ARSENAL: the key fires whatever weapon is in the main hand.
    if (S.weapons) return SKILLS[S.weapons[t.wm]];
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
    if (t.subj && t.blade.painter) return true;
    // Some chains ask for a breath between one use and the next.
    if ((S.re || S.id === 'mimic') && t.re[key] > 0) return !(S.pause && t.re[key] > S.window - S.pause + slack);
    // A stream that costs the gauge runs on once it has started.
    if (S.stream && S.ult && t.re[key] > 0) return t.cd[key] <= slack;
    return t.cd[key] <= slack && (!S.ult || t.ult >= 100);
  }

  // Why a skill that is otherwise ready cannot be used here and now, as a
  // short label for the player; null when nothing stands in the way.
  blocked(t, key) {
    const S = this.aimSkill(t, key);
    const any = (f) => this.enemies(t).some((o) => targetable(o) && f(o, Math.hypot(o.x - t.x, o.z - t.z)));
    if (S.need === 'range' && !any((o, d) => d <= (S.grab ?? S.range) && !((S.id === 'fling' || S.kind === 'throw') && o.egg > 0))) return '射程外';
    if (S.need === 'up' && !any((o, d) => o.up > 0 && d <= S.range)) return '打ち上げ中のみ';
    if (S.need === 'soldier' && !this.own(t, 'arise').length) return '砂兵がいない';
    if (S.need === 'style' && t.stack < t.blade.style.max) return 'ランクSで使える';
    if ((t.ground > 0 || t.snare > 0) && (MOBILE.has(S.aim) || S.id === 'shift' || S.tp)) return t.snare > 0 ? '束縛中' : '粘着中';
    return null;
  }

  // Starts winding up a skill that is charged by holding its key. The time
  // is kept here, in the simulation, so both ends of a match agree on it.
  hold(t, key) {
    if (!this.canCast(t, key) || !this.aimSkill(t, key).wind) return false;
    t.hold = { key, t: 0, dx: 0, dz: 0 };
    if (skillOf(t, key).calm) this.calm(t);
    this.emit('hold', { top: t, key });
    return true;
  }

  // The frenzy is over.
  calm(t) {
    if (t.buff > 0 && t.blade.buff && t.blade.buff.frenzy) { t.buff = 0; t.hema = false; }
  }

  // Which way a skill being wound up is pointed. It changes nothing about the
  // throw (that is aimed when the key is let go); it is there so the other
  // side can see where the blow is going to come from.
  aimHold(t, x, z) {
    if (!t.hold) return false;
    const dx = x - t.x, dz = z - t.z, d = Math.hypot(dx, dz);
    if (d > 0.01) { t.hold.dx = dx / d; t.hold.dz = dz / d; }
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
    // CURTAIN CALL: braced, and each press of the key is one shot.
    const firing = !!this.aimSkill(t, key).fire;
    if (firing && (!t.chan || t.cd[key] > 0)) return false;
    const base = skillOf(t, key);
    if (this.busy(t, firing, !!base.cleanse) || !this.ready(t, key)) return false;
    if (base.passive || (base.stock && t.stk <= 0)) return false;
    if (t.dash && this.aimSkill(t, key).aim === 'dash') return false;
    // In the middle of a swing, only a dash to shift its footing.
    if (t.charge && this.aimSkill(t, key).kind !== 'dash') return false;
    if (t.hold && t.hold.key !== key) return false;
    if (base.id !== 'aegis' && !base.cleanse && t.tumble > 0) return false;
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
  // (bx, bz): a second point, for the few skills aimed with two (where, then which way).
  cast(t, key, ax, az, wound = 0, bx, bz) {
    const was = SCOPE;
    SCOPE = t.realm;
    try { return this.castNow(t, key, ax, az, wound, bx, bz); } finally { SCOPE = was; }
  }

  castNow(t, key, ax, az, wound, bx, bz) {
    // A point that is not a point (a cursor with nowhere to be) must never get into the world.
    if (!Number.isFinite(ax + az)) return false;
    if (!this.canCast(t, key)) return false;
    const base = skillOf(t, key), S = this.aimSkill(t, key);
    const held = t.hold && t.hold.key === key ? t.hold.t : wound;
    const reach = this.holdRange(t, key);
    t.hold = null;
    const re = !!((base.re || base.id === 'mimic') && t.re[key] > 0);
    // Only the opening shot of a continuous stream announces an ultimate.
    const streamFollowup = !!base.stream && t.streamT > 0;
    if (t.blade.painter && (base.spells || t.subj)) {
      // Two steps: a subject first (nothing happens yet), then one of its spells.
      if (!t.subj) { t.subj = KEYS.indexOf(key) + 1; this.emit('subject', { top: t, key }); return true; }
      const sk = KEYS[t.subj - 1];
      t.subj = 0;
      // Washed out: the subject is put down and nothing is spent.
      if (key === 'R') { this.emit('subject', { top: t, key: null }); return true; }
      t.cd[sk] = skillOf(t, sk).cd * t.blade.cdMul;
      t.last = KEYS.indexOf(sk);
    } else if (re) {
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
    // (A CPU winds up every swing of a chain that is fired on release, not only the first.)
    const wind = re && !base.pause ? 0 : t.windup[key];
    const c = { key, skill: S, re, t: wind, T: wind, dx, dz, ax, az, dist: d, held, reach: t.windup[key] > 0 || wound ? S.range : reach };
    if (Number.isFinite(bx + bz)) { c.bx = bx; c.bz = bz; }
    // The next body hit after a skill lands twice.
    if (t.blade.dbl && !re) t.dbl = t.blade.dbl.window;
    if (S.aim === 'ground' || S.aim === 'leap') { const m = this.groundTarget(t, S, ax, az); c.ax = m.x; c.az = m.z; }
    // Like the continuous ray, stop steering without granting knockback immunity.
    if (S.selfSnare) { t.cmd = null; t.snare = Math.max(t.snare, c.T + S.charge); }
    this.emit('cast', { top: t, key, skill: S, base, ult: !!base.ult && !re && !streamFollowup, windup: c.T, dx, dz, ax: c.ax, az: c.az });
    if (c.t <= 0) this.execute(t, c); else t.cast = c;
    return true;
  }

  fire(t, S, dx, dz, o = {}) {
    const p = {
      id: t.side * 16000 + (t.projN = (t.projN + 1) % 16000), skill: S, owner: t,
      x: (o.x ?? t.x) + dx * 0.9, z: (o.z ?? t.z) + dz * 0.9, dx, dz,
      speed: S.speed, left: o.left ?? S.range, r: S.radius, dmg: (o.dmg ?? S.dmg) * t.blade.atk, hit: 0, back: false, crawl: false, dead: false, x2: !!o.x2,
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
    const q = initZone({ id: t.side * 16000 + (t.zoneN = (t.zoneN + 1) % 16000), kind: S.id, owner: t, x, z, dx: 0, dz: 0, t: 0, a: 0, b: 0, c: 0, ...o });
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

  // A dash that reaches the wall turns along it and rides the rim.
  slideOn(t, d, nx, nz) {
    const S = SKILLS[d.skill.slides], lim = ARENA.R - t.radius, tx = -nz, tz = nx, s = d.dx * tx + d.dz * tz >= 0 ? 1 : -1;
    t.x = nx * lim; t.z = nz * lim;
    t.dash = { dx: tx * s, dz: tz * s, speed: S.speed, t: (S.arc * lim) / S.speed, skill: S, hit: false, len: S.arc * lim };
    t.cmd = null;
    this.emit('dash', { top: t, dx: t.dash.dx, dz: t.dash.dz, dist: 3 });
  }

  // What a dash does when it stops, however it stopped.
  dashDone(t, d) {
    const S = d.skill;
    // Ended just short of the wall while heading for it: near enough to catch hold.
    if (S.slides && !this.result && !t.dash && !t.out && t.stun <= 0 && t.snare <= 0 && t.up <= 0 && t.tumble <= 0) {
      const r = Math.hypot(t.x, t.z) || 1, nx = t.x / r, nz = t.z / r;
      if (r > ARENA.R - t.radius - S.grab && d.dx * nx + d.dz * nz > 0.2 && !rimOpen(t.x, t.z, t.radius * 0.8)) { this.slideOn(t, d, nx, nz); return; }
    }
    // A step, not a charge: it ends standing where it meant to.
    if (S.halt) t.vx = t.vz = 0;
    if (d.bomb) { const L = d.len ?? S.dist; this.lineHit(t, SKILLS.flairbomb, t.x - d.dx * L, t.z - d.dz * L, d.dx, d.dz); }
    if (d.spin) {
      const Q = d.spin, G = SKILLS.galeq;
      const hit = this.burst(t, Q, t.x, t.z, G.ring, { dmg: Q.dmg, as: Q.id === 'tornado' ? { up: Q.up } : {} });
      if (hit && Q.id === 'galeq') { t.stack = Math.min(G.stacks, t.stack + 1); t.stackT = G.keep; }
    }
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
    let hit = 0, target = null;
    for (const opp of this.foes(t)) {
      if (!targetable(opp) || this.result) continue;
      let dx = opp.x - x, dz = opp.z - z;
      const d = Math.hypot(dx, dz);
      if (d < r + opp.radius * 0.5) {
        if (d < 0.05) { dx = 1; dz = 0; } else { dx /= d; dz /= d; }
        const g = opp.guard > 0 ? 0.3 : 1;
        // Some blasts bite harder the less spin the target has left.
        const ex = S.exec && !o.as ? 1 + S.exec * (1 - spinRatio(opp)) : 1;
        // Dead centre is worth more, and slows harder.
        const core = !!S.coreR && !o.as && d < S.coreR;
        hit += this.hurt(opp, ((o.dmg ?? S.dmg) * ex * (core ? S.coreMul : 1) * g * t.blade.atk) / opp.blade.def, t, S.id);
        target = target || opp;
        // Thrown away from whoever cast it, not from the middle of the blast.
        if (S.away && !o.as) { const ax = opp.x - t.x, az = opp.z - t.z, ad = Math.hypot(ax, az) || 1; dx = ax / ad; dz = az / ad; }
        // A guard softens the blow but cannot keep what strips it.
        if (g === 1 || S.strip) this.affect(t, opp, o.as || S, dx, dz);
        if (g === 1 && core) this.slowBy(opp, S.slow, S.coreSlowPct);
        // Dragged from where it stood toward whoever reached for it.
        if (g === 1 && S.pull && !o.as) this.pull(opp, t, S.pull);
        t.stats.skillHits++;
      }
    }
    this.emit('blast', { top: t, skill: S, x, z, r, hit, target: hit ? target : null });
    this.hitKegs(t, S, (q) => Math.hypot(q.x - x, q.z - z) < r + 0.6);
    return hit;
  }

  // LUNAR ARSENAL: the main hand changes (swapped, or emptied and replaced).
  rearm(t) {
    const k = KEYS.find((q) => skillOf(t, q).weapons);
    t.cd[k] = t.wcd[t.wm]; t.re[k] = 0;
    // The rifle back in hand with its mark still on someone: the follow-up is there to be taken.
    if (SKILLS[skillOf(t, k).weapons[t.wm]].again) t.re[k] = Math.max(0, ...this.foes(t).map((o) => (o.markHold ? o.mark : 0)));
    this.emit('say', { top: t, text: SKILLS[skillOf(t, k).weapons[t.wm]].en, tone: '' });
  }

  execute(t, c) {
    const S = c.skill, opp = this.pick(t, c, S);
    // Some blades pay for every skill in spin.
    if (t.blade.costPct && !c.re && !S.free) t.spin = Math.max(1, t.spin * (1 - t.blade.costPct));
    // (The second press that follows a weapon's own shot is part of that use.)
    if (S.weapon !== undefined && !c.re) {
      // Each weapon keeps its own cooldown, and every use is one of its five shots.
      t.cd[c.key] = t.wcd[S.weapon] = S.cd * t.blade.cdMul;
      if (--t.wa[S.weapon] <= 0) {
        // Empty: it goes to the back of the line, reloaded, and the next one comes to hand.
        t.wa[S.weapon] = skillOf(t, c.key).ammo;
        t.wq.push(t.wm); t.wm = t.wq.shift();
        this.rearm(t);
      }
    }
    // STEEL GALE in the middle of SWEEPING BLADE: no thrust, a ring around where the dash ends.
    if ((S.id === 'galeq' || S.id === 'tornado') && t.dash && t.dash.skill.id === 'sweep') {
      if (S.id === 'tornado') t.stack = 0;
      t.dash.spin = S;
      return;
    }
    // TURRET ENGINEER's ultimate upgrades the next basic skill.
    const big = !!(S.big && t.blade.id === 'gear' && t.buff > 0);
    if (big) t.buff = 0;
    switch (S.id) {
      case 'sonic': case 'anchor': case 'galeq': case 'frostbite': case 'sigil': case 'ethereal': case 'flourish':
        // A mimicked sigil leaves a mark that goes off twice as hard.
        this.fire(t, S, c.dx, c.dz, { x2: skillOf(t, c.key).id === 'mimic' });
        break;
      case 'darkin1': case 'darkin2': case 'darkin3':
        t.stack = c.re ? t.stack + 1 : 1;
        t.stackT = S.window + 1;
        if (t.stack < 3) t.re[c.key] = S.window;
        // Swung the moment it is let go, unless the skill is given a wind-up of its own.
        if (!S.charge) { this.swing(t, S, c.dx, c.dz); break; }
        t.charge = { t: 0, T: S.charge, skill: S, dx: c.dx, dz: c.dz };
        t.cmd = null;
        this.emit('charge', { top: t, T: S.charge, skill: S });
        break;
      case 'realm':
        // Half a second to open it; the one it is opening for can barely move meanwhile.
        t.prey = opp.side;
        this.slowBy(opp, S.charge, S.castSlow);
        t.charge = { t: 0, T: S.charge, skill: S, dx: c.dx, dz: c.dz };
        t.cmd = null;
        this.emit('charge', { top: t, T: S.charge, skill: S });
        break;
      case 'safeguard': {
        // With a team mate near the cursor (nearer it than this top is): fly to them, and both are shielded.
        const d0 = Math.hypot(c.ax - t.x, c.az - t.z);
        let to = null, bd = d0;
        for (const o of this.mates(t)) { const d = Math.hypot(c.ax - o.x, c.az - o.z); if (d < bd && Math.hypot(o.x - t.x, o.z - t.z) <= S.reach) { bd = d; to = o; } }
        t.shield = S.shield; t.shieldT = S.hold;
        t.re[c.key] = S.window;
        if (to) {
          to.shield = Math.max(to.shield, S.shield); to.shieldT = Math.max(to.shieldT, S.hold);
          const dx = to.x - t.x, dz = to.z - t.z, d = Math.hypot(dx, dz);
          if (d > 2.8) this.startDash(t, S, dx / d, dz / d, d - 2.4);
          this.emit('buff', { top: to, skill: S });
        }
        this.emit('buff', { top: t, skill: S });
        break;
      }
      case 'cease': {
        // A charge that nothing stops, straight at its target wherever that goes.
        const dx = opp.x - t.x, dz = opp.z - t.z, d = Math.hypot(dx, dz) || 1;
        t.prey = opp.side;
        this.startDash(t, S, dx / d, dz / d, d);
        t.dash.home = opp.side; t.dash.age = 0; t.dash.bumped = 0;
        break;
      }
      case 'singularity': {
        // Thrown, not placed: the orb flies to the spot and only then opens, so a wall in its way stops it.
        const dx = c.ax - t.x, dz = c.az - t.z, d = Math.hypot(dx, dz);
        if (d < 1) { this.open({ skill: SKILLS.lightorb, owner: t, x: c.ax, z: c.az }); break; }
        this.fire(t, SKILLS.lightorb, dx / d, dz / d, { left: d - 0.9 });
        break;
      }
      case 'chillingscream': {
        // The longer the breath, the further it throws its targets; only a full one pins them to the wall.
        const pow = clamp(c.held / S.wind.full, 0, 1), full = pow >= 0.99;
        const hit = this.lineHit(t, { ...S, dmg: S.dmg * (0.1 + 0.9 * pow), kb: S.kb * pow, tumble: S.tumble * pow, pinT: full ? S.pinT : 0, range: c.reach }, t.x, t.z, c.dx, c.dz);
        // Only a shout that lands gives anything back, and the more the longer it was drawn.
        if (hit > 0) this.mend(t, S.hitHeal * pow * t.spinMax);
        // (A CPU does not hold the key: for it the frenzy ends here.)
        this.calm(t);
        break;
      }
      case 'paddle2': {
        // From where the star rests, toward the point given.
        const q = this.own(t, 'reststar')[0];
        if (!q) break;
        const dx = c.ax - q.x, dz = c.az - q.z, d = Math.hypot(dx, dz) || 1;
        q.dead = true;
        this.fire(t, S, dx / d, dz / d, { x: q.x - (dx / d) * 0.9, z: q.z - (dz / d) * 0.9 });
        break;
      }
      case 'flair':
        // In the middle of WILD RUSH: bombs along the path, once the dash is over.
        if (t.dash && t.dash.skill.id === 'wildrush') { t.dash.bomb = true; break; }
        // Something right in front: the sword instead of the gun.
        if (this.inCone(t, opp, c.dx, c.dz, SKILLS.flairslash)) this.coneHit(t, SKILLS.flairslash, c.dx, c.dz);
        else this.fire(t, S, c.dx, c.dz);
        break;
      case 'inferno':
        this.zone(t, S, t.x, t.z);
        this.slowBy(t, S.dur, S.selfSlow);
        // The style is spent when it ends.
        t.stackT = S.dur;
        break;
      case 'phase':
        [t.wm, t.wo] = [t.wo, t.wm];
        this.rearm(t);
        break;
      case 'bindeclipse': {
        // BINDING ECLIPSE: wherever they are, everyone under a slow is rooted.
        for (const o of this.foes(t)) {
          if (o.slow <= 0 || !targetable(o)) continue;
          const dmg = this.hurt(o, (S.dmg * t.blade.atk) / o.blade.def, t, S.id);
          this.snare(o, o.slowK >= 0.9 ? S.bigSnare : S.snareT);
          o.slow = 0;
          t.stats.skillHits++;
          this.emit('strike', { top: o, src: t, skill: S, x: o.x, z: o.z, dmg });
        }
        break;
      }
      case 'onslaught':
        // ONSLAUGHT: quicker on its feet, and nothing to do but move while the blows land.
        t.haste = S.haste;
        t.volley = { skill: S, n: S.shots, every: S.dur / S.shots, acc: S.dur / S.shots, off: t.wo };
        break;
      case 'chakram':
        // One more chakram, then every one it holds is thrown, one after another, the way it was aimed.
        this.gainChak(t, 1);
        t.spray = { skill: S, n: t.chak, every: S.every, acc: S.every, dx: c.dx, dz: c.dz, chak: true };
        break;
      case 'longshot': {
        // The rifle's follow-up: wherever the marked target is, the mark goes off and the other hand lands its blow.
        const v = opp.mark > 0 && targetable(opp) ? opp : this.enemies(t).find((o) => o.mark > 0 && targetable(o));
        if (!v) break;
        const k = v.markK;
        v.mark = 0;
        const dmg = this.hurt(v, (S.pop * k * t.blade.atk) / v.blade.def, t, 'sigil');
        t.stats.skillHits++;
        // The shot itself is the other hand's, and wears its colour.
        this.emit('strike', { top: v, src: t, skill: S, x: v.x, z: v.z, dmg, ...(v.guard > 0 ? { fx: t.x, fz: t.z } : {}) });
        this.offhand(t, v, t.wo, true);
        break;
      }
      case 'sentry':
        // An older sentry does not last long once a new one is set.
        for (const q of this.own(t, 'sentry')) if (!q.c) { q.c = 1; q.a = q.t + S.live; }
        // dx: 1 + the weapon mounted on it, the one that was in the other hand.
        this.zone(t, S, c.ax, c.az, { dx: t.wo + 1 });
        break;
      case 'hlava':
        // MOLTEN FISSURE: a line of eruptions, one after another, each leaving a pool.
        for (let i = 0; i < S.n; i++) this.zone(t, SKILLS.lavapool, t.x + c.dx * (S.first + i * S.gap), t.z + c.dz * (S.first + i * S.gap), { a: S.delay + i * S.every }, i > 0);
        break;
      case 'hcurrent':
        for (let i = 0; i < S.n; i++) this.zone(t, SKILLS.currentpool, t.x + c.dx * (S.first + i * S.gap), t.z + c.dz * (S.first + i * S.gap), null, i > 0);
        break;
      case 'hgaze':
        this.zone(t, SKILLS.gazeeye, c.ax, c.az);
        break;
      case 'hlights':
        t.lights = S.hits; t.lightsT = S.dur;
        this.emit('buff', { top: t, skill: S });
        break;
      case 'bloodfrenzy':
        // A leap, then the frenzy: it runs at whoever is nearest by itself.
        this.startDash(t, S, c.dx, c.dz, clamp(c.dist, S.minDist, S.dist));
        // (Within the ultimate's hunt it stays the ultimate's.)
        t.buff = Math.max(t.buff, S.frenzy);
        break;
      case 'certaindeath':
        this.fire(t, S, c.dx, c.dz);
        break;
      case 'overdrive':
        t.haste = S.haste; t.odT = S.haste;
        this.emit('buff', { top: t, skill: S });
        break;
      case 'staticfield': {
        const hit = this.burst(t, S, t.x, t.z, S.aoe);
        break;
      }
      case 'plasmafission':
        this.fire(t, S, c.dx, c.dz);
        t.re[c.key] = S.window;
        break;
      case 'fissionsplit': {
        const p = this.projectiles.find((q) => q.owner === t && q.skill.id === 'plasmafission' && !q.dead);
        if (p) { p.dead = true; this.splitPlasma(t, p.x, p.z, p.dx, p.dz, 0); this.emit('projEnd', { proj: p, x: p.x, z: p.z }); }
        break;
      }
      case 'deathgrasp':
        // The claw stays where it was placed; its owner is free to move.
        this.zone(t, S, t.x, t.z, { dx: c.dx, dz: c.dz });
        break;
      case 'voidrift':
        this.lineHit(t, S, t.x, t.z, c.dx, c.dz);
        this.zone(t, SKILLS.riftz, t.x, t.z, { dx: c.dx, dz: c.dz });
        break;
      case 'liferay': {
        // The beam turns toward the cursor only so fast.
        const want = Math.atan2(c.dz, c.dx);
        if (t.rayA === null || t.streamT <= 0.001 + S.stream.gap - 0.3) t.rayA = t.rayA === null ? want : t.rayA;
        const off = Math.atan2(Math.sin(want - t.rayA), Math.cos(want - t.rayA));
        t.rayA += clamp(off, -S.turn, S.turn);
        const dx = Math.cos(t.rayA), dz = Math.sin(t.rayA);
        t.snare = Math.max(t.snare, 0.3); t.cmd = null;
        t.stack = (t.stack + 1) % S.every; t.stackT = 1;
        const before = this.foes(t).map((o) => o.stats.taken);
        this.lineHit(t, S, t.x, t.z, dx, dz);
        // Every few beats it also takes its target a step further apart.
        if (t.stack === 0) this.foes(t).forEach((o, i) => { if (o.stats.taken > before[i]) this.decon(o, t); });
        break;
      }
      case 'culling':
        t.spray = { skill: SKILLS.cullshot, n: S.shots, every: S.dur / S.shots, acc: 0, dx: c.dx, dz: c.dz };
        t.re[c.key] = S.dur;
        this.emit('buff', { top: t, skill: S });
        break;
      case 'cullstop':
        t.spray = null;
        break;
      case 'threadedvolley': {
        // On ground it has already worked: one big stone, and the ground is used up.
        const g = this.own(t, 'workedground').find((q) => Math.hypot(q.x - t.x, q.z - t.z) < q.r);
        if (g) { this.endZone(g); this.fire(t, SKILLS.bigrock, c.dx, c.dz); t.cd[c.key] = S.cdOn * t.blade.cdMul; break; }
        t.stack = 0;
        t.spray = { skill: SKILLS.threadrock, n: S.shots, every: S.every, acc: S.every, dx: c.dx, dz: c.dz };
        this.zone(t, SKILLS.workedground, t.x, t.z, null, true);
        break;
      }
      case 'seismicshove': {
        // Where, and then which way: the second point gives the direction (away from the caster if there is none).
        let dx = c.bx !== undefined ? c.bx - c.ax : c.ax - t.x, dz = c.bz !== undefined ? c.bz - c.az : c.az - t.z;
        const d = Math.hypot(dx, dz);
        if (d < 0.3) { dx = c.dx; dz = c.dz; } else { dx /= d; dz /= d; }
        this.zone(t, SKILLS.shovez, c.ax, c.az, { dx, dz });
        break;
      }
      case 'unraveled':
        this.coneHit(t, S, c.dx, c.dz);
        this.zone(t, SKILLS.boulders, t.x, t.z, { dx: c.dx, dz: c.dz });
        break;
      case 'weaverwall': {
        // A wall runs out along the aim, and its maker slides along beside it.
        const L = Math.min(S.len, toRim(t.x, t.z, c.dx, c.dz) - 1.5);
        if (L < 3) break;
        this.zone(t, SKILLS.weaverz, t.x + c.dx * L / 2 - c.dz * S.side, t.z + c.dz * L / 2 + c.dx * S.side, { dx: -c.dz, dz: c.dx, a: L / 2 });
        this.startDash(t, S, c.dx, c.dz, L);
        t.re[c.key] = L / S.speed;
        break;
      }
      case 'wallstop':
        this.stopDash(t);
        break;
      case 'zapburst':
        // Let go early: the field ends now, and ends the way it always does.
        for (const q of this.own(t, 'heartzapper')) q.t = q.T;
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
      case 'rockets': {
        // Five rockets that close in on the point aimed at and fly on through it.
        // Upgraded, four volleys follow one another.
        const reach = Math.max(S.near, Math.min(c.dist, S.range)), tx = t.x + c.dx * reach, tz = t.z + c.dz * reach;
        t.stack = 0;
        for (let v = 0; v < (big ? S.volleys : 1); v++) {
          for (let i = 0; i < S.fan; i++) {
            const off = (i - (S.fan - 1) / 2) * S.spread;
            const ox = t.x - c.dz * off - c.dx * v * S.lag, oz = t.z + c.dx * off - c.dz * v * S.lag;
            const dx = tx - ox, dz = tz - oz, n = Math.hypot(dx, dz) || 1;
            this.fire(t, S, dx / n, dz / n, { x: ox, z: oz, left: S.range + v * S.lag, quiet: i > 0 || v > 0 });
          }
        }
        break;
      }
      case 'windslash':
        this.fan(t, S, c.dx, c.dz, S.fan);
        break;
      case 'blitz': case 'sweep': case 'guillotine':
        this.startDash(t, S, c.dx, c.dz, clamp(c.dist, S.minDist, S.dist));
        t.dash.again = c.re;
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
        // To the soldier nearest the point given (the cursor), not the nearest to itself.
        for (const q of this.own(t, 'arise')) { const d = Math.hypot(q.x - c.ax, q.z - c.az); if (d < bd) { bd = d; best = q; } }
        bd = best ? Math.hypot(best.x - t.x, best.z - t.z) : 0;
        // Shielded from the moment it sets off, whether or not it meets anyone on the way.
        t.shield = S.shield; t.shieldT = S.hold;
        this.emit('buff', { top: t, skill: S });
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
        this.zone(t, S, c.ax, c.az, { c: big ? 1 : 0, dx: c.dx, dz: c.dz });
        break;
      case 'turret': {
        // The upgraded one comes on top of the three; of the ordinary ones the oldest makes room.
        const plain = this.own(t, 'turret').filter((q) => !(q.c & 1));
        if (!big && plain.length >= S.cap) this.endZone(plain[0]);
        this.zone(t, S, c.ax, c.az, { c: big ? 1 : 0, b: 0.5 });
        break;
      }
      case 'arise':
        this.zone(t, S, c.ax, c.az, { b: 0.4 });
        break;
      case 'shadow':
        // c marks the shadow the recast swaps with.
        // c: 1 the shadow W swaps with, 2 still flying out to (dx, dz), 4 the one R left behind
        for (const q of this.own(t, 'shadow')) q.c &= ~1;
        this.zone(t, S, t.x, t.z, { c: 3, dx: c.ax, dz: c.az });
        t.re[c.key] = S.dur;
        break;
      case 'swap': case 'markswap': {
        const q = this.own(t, 'shadow').find((s) => s.c & (S.id === 'markswap' ? 4 : 1));
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
        // Every enemy within reach of the body or a shadow is cut once (by a shadow, if one reaches).
        const cut = new Map();
        for (const opp of this.foes(t)) {
          let from = null, hit = 0;
          if (!targetable(opp)) continue;
          for (const p of spots) if (Math.hypot(opp.x - p.x, opp.z - p.z) < S.aoe + opp.radius * 0.5 && (!from || p.sh)) from = p;
          if (!from) continue;
          const g = opp.guard > 0 ? 0.3 : 1;
          hit = this.hurt(opp, (S.dmg * g * t.blade.atk) / opp.blade.def, t, 'slash');
          if (g === 1) {
            const dx = opp.x - from.x, dz = opp.z - from.z, d = Math.hypot(dx, dz) || 1;
            this.affect(t, opp, S, dx / d, dz / d);
            if (from.sh) this.slowBy(opp, S.shadowSlow, S.slowPct);
          }
          // Every cut that lands brings the next shadow closer.
          const wk = this.keyOf(t, 'shadow');
          if (wk) t.cd[wk] = Math.max(0, t.cd[wk] - S.cut);
          t.stats.skillHits++;
          const was = cut.get(from);
          cut.set(from, { hit: hit + (was ? was.hit : 0), opp: was ? was.opp : opp });
        }
        for (const p of spots) { const h = cut.get(p); this.emit('blast', { top: t, skill: S, x: p.x, z: p.z, r: S.aoe, hit: h ? h.hit : 0, target: h && h.hit ? h.opp : null }); }
        break;
      }
      case 'kiburst':
        this.burst(t, S, t.x, t.z, S.aoe);
        break;
      case 'deathmark': {
        // It sinks into the floor, out of reach, and comes up behind the target.
        this.zone(t, SKILLS.shadow, t.x, t.z, { c: 4 });
        t.air = { t: 0, T: S.air, sx: t.x, sz: t.z, tx: opp.x, tz: opp.z, skill: S, by: t.side, to: opp.side };
        t.cmd = null; t.vx = t.vz = 0;
        this.emit('leap', { top: t, tx: opp.x, tz: opp.z, T: S.air, skill: S });
        break;
      }
      case 'lastbreath': {
        // Arrive on the centre side, so the slam throws the target at the wall.
        let nx = opp.x, nz = opp.z, n = Math.hypot(nx, nz);
        if (n < 0.5) { nx = opp.x - t.x; nz = opp.z - t.z; n = Math.hypot(nx, nz) || 1; }
        nx /= n; nz /= n;
        const fx = t.x, fz = t.z;
        t.x = opp.x - nx * S.gap; t.z = opp.z - nz * S.gap; t.vx = t.vz = 0; t.cmd = null;
        // Everyone else hanging in the air close by is cut down with it.
        const also = this.foes(t).filter((o) => o !== opp && o.up > 0 && targetable(o) && Math.hypot(o.x - opp.x, o.z - opp.z) < S.also);
        opp.up = 0;
        let hit = this.hurt(opp, (S.dmg * t.blade.atk) / opp.blade.def, t, 'lastbreath');
        this.knock(opp, nx, nz, S.kb, 0.6, 2);
        t.stats.skillHits++;
        for (const o of also) {
          o.up = 0;
          hit += this.hurt(o, (S.dmg * t.blade.atk) / o.blade.def, t, 'lastbreath');
          const ox = o.x - t.x, oz = o.z - t.z, od = Math.hypot(ox, oz) || 1;
          this.knock(o, ox / od, oz / od, S.kb, 0.6, 2);
          t.stats.skillHits++;
        }
        this.emit('warp', { top: t, fx, fz });
        this.emit('blast', { top: t, skill: S, x: opp.x, z: opp.z, r: 4, hit, target: opp });
        break;
      }
      case 'arcanerite':
        t.stack = 0;
        // falls through
      case 'curtaincall':
        t.chan = { t: 0, n: 0, dx: c.dx, dz: c.dz, skill: S };
        t.cmd = null;
        t.re[c.key] = S.window; t.cd[c.key] = S.first;
        this.emit('chan', { top: t, dx: c.dx, dz: c.dz });
        break;
      case 'arcanefire': {
        // One bombardment wherever it is aimed. Each one that lands makes the next heavier.
        const ch = t.chan, C = ch.skill, B = SKILLS.arcanebarrage;
        const lim = ARENA.R - 0.6, r = Math.hypot(c.ax, c.az) || 1, k = Math.min(1, lim / r);
        this.zone(t, B, c.ax * k, c.az * k, { c: t.stack });
        ch.n++;
        if (ch.n >= C.shots) { t.chan = null; this.emit('chanEnd', { top: t }); }
        else { t.re[c.key] = C.window - ch.t; t.cd[c.key] = C.every; }
        break;
      }
      case 'curtainfire': {
        // One shot where it is aimed, kept inside the fan that was set.
        const ch = t.chan, C = ch.skill, shot = ch.n === C.shots - 1 ? SKILLS.curtainlast : SKILLS.curtainshot;
        const a0 = Math.atan2(ch.dz, ch.dx), want = Math.atan2(c.dz, c.dx);
        const a = a0 + clamp(Math.atan2(Math.sin(want - a0), Math.cos(want - a0)), -C.half, C.half);
        this.fire(t, shot, Math.cos(a), Math.sin(a));
        ch.n++;
        if (ch.n >= C.shots) { t.chan = null; this.emit('chanEnd', { top: t }); }
        else { t.re[c.key] = C.window - ch.t; t.cd[c.key] = C.every; }
        break;
      }
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
        let hit = 0, tg = null;
        for (const o of this.foes(t)) {
          if (!this.inCone(t, o, c.dx, c.dz, S)) continue;
          const h = this.hurt(o, (S.dmg * t.blade.atk * (o.guard > 0 ? 0.3 : 1)) / o.blade.def, t, 'flare');
          hit += h;
          t.spin = Math.min(t.spinMax, t.spin + h * S.heal);
          if (o.guard <= 0) this.knock(o, c.dx, c.dz, S.kb, 0.25, 0.8);
          t.stats.skillHits++;
          tg = tg || o;
        }
        this.emit('flare', { top: t, dx: c.dx, dz: c.dz, hit, heal: hit * S.heal, target: tg || opp });
        break;
      }
      case 'apprehend': {
        let hit = 0, tg = null;
        for (const o of this.foes(t)) {
          if (!this.inCone(t, o, c.dx, c.dz, S)) continue;
          const g = o.guard > 0 ? 0.3 : 1;
          hit += this.hurt(o, (S.dmg * g * t.blade.atk) / o.blade.def, t, 'apprehend');
          if (g === 1) { this.pull(o, t, S.pull); this.affect(t, o, S, 0, 0); }
          t.stats.skillHits++;
          tg = tg || o;
        }
        this.emit('cone', { top: t, skill: S, dx: c.dx, dz: c.dz, hit, target: tg });
        break;
      }
      case 'fling':
        // Not a throw yet: the next body hit will be.
        t.grab = S.arm;
        this.emit('buff', { top: t, skill: S });
        break;
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
        t.tether = { t: 0, T: S.dur, skill: S, acc: 0, tick: 0, to: opp.side };
        this.emit('tether', { top: t, target: opp });
        break;
      case 'foxfire':
        t.orbs = { n: S.count, alive: (1 << S.count) - 1, t: S.dur, ang: 0, cd: 0, skill: S };
        t.haste = S.haste;
        this.emit('orbs', { top: t });
        break;
      case 'shieldheal':
        // What is left of the shield is traded for spin.
        this.mend(t, t.shield * S.heal);
        t.shield = t.shieldT = 0;
        this.emit('buff', { top: t, skill: S });
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
      case 'keg':
        this.zone(t, S, c.ax, c.az, { c: S.hp });
        break;
      case 'parallel':
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
        // Held where it lands (it can still cast) until it snaps back.
        if (S.autoRet) { t.ret = { x: t.x, z: t.z }; t.re[c.key] = S.autoRet + dist / S.speed; t.snare = Math.max(t.snare, t.re[c.key]); }
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
        // Everyone the burst reached is dragged in, not only the nearest.
        if (hit && S.pullIn) for (const o of this.foes(t)) if (targetable(o) && o.guard <= 0 && Math.hypot(o.x - t.x, o.z - t.z) < S.aoe + o.radius * 0.5) this.pull(o, t, S.pullIn);
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
        // Everything that holds or wears it down is gone, not only what slows it.
        if (S.cleanse) t.slow = t.slowK = t.ground = t.poison = t.bleed = t.bleedT = t.mark = t.tag = t.tagT = t.charm = t.stun = t.snare = t.silence = t.sleep = t.frost = 0;
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
        if (S.wind) { this.lineHit(t, { ...S, range: c.reach }, t.x, t.z, c.dx, c.dz); break; }
        t.charge = { t: 0, T: S.charge, skill: S, dx: c.dx, dz: c.dz };
        t.cmd = null;
        this.emit('charge', { top: t, T: S.charge, skill: S });
        break;
      case 'kick': {
        // A short thrust the way it was aimed. The first it meets is the one kicked; meeting nobody, it is wasted.
        let v = null, near = Infinity;
        for (const o of this.foes(t)) {
          const rx = o.x - t.x, rz = o.z - t.z, along = rx * c.dx + rz * c.dz, side = Math.abs(-rx * c.dz + rz * c.dx);
          if (targetable(o) && along > -1 && along < S.range + o.radius && side < S.radius + o.radius * 0.6 && along < near) { near = along; v = o; }
        }
        this.emit('beam', { top: t, skill: S, x: t.x, z: t.z, dx: c.dx, dz: c.dz, hit: 0, target: null });
        if (!v) { this.emit('say', { top: t, text: 'MISS', tone: 'dim' }); break; }
        // Straight away from the kicker: where it stands decides where the target goes.
        const kx = v.x - t.x, kz = v.z - t.z, kd = Math.hypot(kx, kz) || 1;
        const dmg = this.hurt(v, (S.dmg * (v.guard > 0 ? 0.4 : 1) * t.blade.atk) / v.blade.def, t, S.id);
        this.knock(v, kx / kd, kz / kd, S.kb, 0.7, S.launch);
        // In flight it bowls over whoever else of the kicker's enemies it runs into.
        if (S.pass) { v.kickT = S.passT; v.kickBy = t.side; v.kickHit = 0; }
        t.stats.skillHits++;
        this.emit('strike', { top: v, src: t, skill: S, x: v.x, z: v.z, dmg, big: true });
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
    let hit = 0, target = null;
    for (const opp of this.foes(t)) {
      const rx = opp.x - x, rz = opp.z - z, along = rx * dx + rz * dz, side = Math.abs(-rx * dz + rz * dx);
      if (!(targetable(opp) && !this.result && along > -1 && along < S.range + (S.id === 'deathgrasp' ? 0 : opp.radius) && side < S.radius + opp.radius * 0.6)) continue;
      const g = opp.guard > 0 ? 0.3 : 1;
      hit += this.hurt(opp, (S.dmg * mul * g * t.blade.atk) / opp.blade.def, t, S.id);
      if (g === 1) {
        if (S.pullDist) this.pull(opp, { x: opp.x - dx * S.pullDist, z: opp.z - dz * S.pullDist }, S.pull, S.pullDist, S.id === 'deathgrasp');
        this.affect(t, opp, S, dx, dz);
      }
      t.stats.skillHits++;
      target = target || opp;
    }
    this.emit('beam', { top: t, skill: S, x, z, dx, dz, hit, target: hit ? target : null });
    this.hitKegs(t, S, (q) => { const ax = q.x - x, az = q.z - z, al = ax * dx + az * dz; return al > -1 && al < S.range + 1 && Math.abs(az * dx - ax * dz) < S.radius + 0.7; });
    return hit;
  }

  // A cone from the top. Some carry banked damage, and some cut through
  // defence along their centre line.
  coneHit(t, S, dx, dz) {
    let hit = 0, target = null;
    for (const opp of this.foes(t)) {
      if (!this.inCone(t, opp, dx, dz, S)) continue;
      target = target || opp;
      const g = opp.guard > 0 ? 0.3 : 1;
      const extra = S.storeHit ? t.store * S.storeHit : 0;
      const ox = opp.x - t.x, oz = opp.z - t.z, od = Math.hypot(ox, oz) || 1;
      const core = S.core && Math.acos(clamp((ox * dx + oz * dz) / od, -1, 1)) < S.half * S.core;
      hit += this.hurt(opp, ((S.dmg * t.blade.atk + extra) * g) / (core ? 1 : opp.blade.def), t, S.id);
      if (g === 1) { if (S.pull) this.pull(opp, t, S.pull); this.affect(t, opp, S, dx, dz); }
      if (S.offhand) this.offhand(t, opp, t.wo, true);
      // A breath held on one target flares up every so many ticks.
      if (S.tick) {
        t.stack++; t.stackT = 0.4;
        if (t.stack >= S.tick.n) { t.stack = 0; hit += this.hurt(opp, (S.tick.dmg * t.blade.atk) / opp.blade.def, t, S.id); t.perm = Math.min(255, t.perm + S.tick.gain); }
      }
      t.stats.skillHits++;
    }
    // Banked damage goes out with the punch and comes back as a shield.
    if (S.storeHit) { t.shield = t.store; t.shieldT = S.hold; t.store = 0; }
    this.emit('cone', { top: t, skill: S, dx, dz, hit, target: hit ? target : null });
    this.hitKegs(t, S, (q) => this.inCone(t, { x: q.x, z: q.z, radius: 1 }, dx, dz, S));
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
    // Nothing crosses the edge of a realm.
    if (foe && from.realm !== t.realm) return 0;
    if (foe && t.realm) {
      // Inside, its maker fights with a share of the other's strength.
      const lord = this.tops[t.realm - 1], K = SKILLS.realm.steal;
      if (from === lord) dmg *= (1 + K) / (1 - K); else if (t === lord) dmg *= (1 - K) / (1 + K);
    }
    if (foe && t.shred > 0) dmg *= from.blade.dent ? from.blade.dent.shred : t.shredK || 1;
    if (foe && kind !== 'dot' && kind !== 'wall') {
      const B = from.buff > 0 && from.blade.buff;
      if (B && B.atk) dmg *= B.atk;
      if (from.blade.might && t.bleed >= BLEED.max) dmg *= from.blade.might;
      // Growth: within the round (ramp) or for the whole match (perm).
      const R = from.blade.ramp;
      if (R) {
        dmg *= 1 + R.per * from.stack * (from.stack >= R.max ? 2 : 1);
        if (dmg >= 8) { from.stack = Math.min(R.max, from.stack + 1); if (R.expire) from.stackT = R.expire; }
      }
      if (from.blade.permDmg) dmg *= 1 + from.blade.permDmg * from.perm;
    }
    // STIRRING LIGHTS: the next few hits carry a little more.
    if (foe && from.lights > 0 && kind !== 'dot' && kind !== 'wall') { dmg += (SKILLS.hlights.bonus * from.blade.atk) / t.blade.def; from.lights--; }
    if (t.charge) dmg *= t.charge.skill.armor ?? 1;
    // Braced while a breath is being drawn.
    if (t.hold) dmg *= skillOf(t, t.hold.key).armor ?? 1;
    // Asleep: the first blow lands twice over (up to a limit) and wakes it.
    if (foe && t.sleep > 0 && kind !== 'dot') { dmg += Math.min(dmg, (SKILLS.bubble.wake * from.blade.atk) / t.blade.def); t.sleep = 0; t.stun = 0; }
    const B = t.buff > 0 && t.blade.buff;
    if (B && B.armor) dmg *= B.armor;
    // The ultimate's frenzy shrugs off a part of every blow.
    if (B && t.hema && t.blade.buffUp && t.blade.buffUp.armor) dmg *= t.blade.buffUp.armor;
    const AU = foe && from.blade.aura;
    if (AU && kind !== 'wall' && kind !== 'dot') { from.stack = Math.min(AU.hits, from.stack + 1); from.stackT = from.stack >= AU.hits ? AU.dur : AU.keep; }
    if (t.shield > 0) {
      const s = Math.min(t.shield, dmg);
      t.shield -= s; dmg -= s;
      if (dmg <= 0) return 0;
    }
    if (t.egg > 0 && t.blade.egg.rise) return 0;
    if (t.egg > 0) {
      t.eggHp = Math.max(0, t.eggHp - dmg);
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
    // DARKNESS RISE: the third blow in a row lights the aura; every one after keeps it lit.

    if (foe) {
      t.scar = SCAR;
      if (from.dmark > 0 && kind !== 'deathmark' && (from.dmarkTo < 0 || from.dmarkTo === t.side)) from.dacc += dmg;
    }
    const ST = foe && from.blade.style;
    if (ST && kind !== 'wall' && !this.own(from, 'inferno').length) {
      const what = kind === 'clash' || kind === 'dash' || kind === 'empower' || kind === 'parry' ? 'body' : kind;
      if (from.stack === 0 || what !== from.styleLast) {
        from.stack = Math.min(ST.max, from.stack + 1);
        this.emit('say', { top: from, text: ST.ranks[from.stack - 1], tone: from.stack >= ST.max ? 'gold' : '' });
      }
      from.styleLast = what; from.stackT = ST.keep;
    }
    if (foe && kind !== 'clash' && kind !== 'wall' && kind !== 'parry') from.prey = t.side;
    if (foe && kind !== 'wall') {
      if (from.blade.bleedAll && kind !== 'decon') this.bleed(t, from.blade.bleedAll, from);
      // Hitting a top marked by ARDENT BLAZE quickens the one who marked it.
      if (kind === 'ardentblaze') { t.ardent = SKILLS.ardentblaze.markT; t.ardentBy = from.side; }
      else if (t.ardent > 0) {
        // Whoever of its side strikes the marked one, it is the one who marked it that is quickened.
        const mk = this.tops[t.ardentBy];
        if (mk && !mk.gone && mk.team === from.team) mk.haste = Math.max(mk.haste, SKILLS.ardentblaze.rush);
      }
      if (from.blade.decon && !['clash', 'dash', 'empower', 'parry', 'decon', 'liferay'].includes(kind)) this.decon(t, from);
    }
    // A shield that comes up by itself, once a round, when things look bad.
    const LS = t.blade.lowShield;
    if (LS && !t.once && t.spin > 0 && spinRatio(t) < LS.at) { t.once = true; t.shield = LS.amount; t.shieldT = LS.hold; this.emit('say', { top: t, text: 'BARRIER', tone: 'gold' }); }
    t.lastHit = { dmg, time: this.time, kind, by: foe && kind !== 'wall' ? from.side : -1 };
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
    const L = foe && from.buff > 0 && from.blade.buff && ((from.hema && from.blade.buffUp && from.blade.buffUp.leech) || from.blade.buff.leech);
    if (L) from.spin = Math.min(from.spinMax, from.spin + dmg * L);
    return dmg;
  }

  // Damage over time. It is reported in half-second chunks (see updateTop) so
  // the HUD shows a few readable numbers, not a blur.
  dot(v, dmg, from) { v.dot += this.hurt(v, dmg, from, 'dot'); }

  // Throws `v` along (dx, dz) and cancels whatever it was doing.
  knock(v, dx, dz, speed, tumble, launch) {
    if (fixed(v)) return;
    if (v.charge?.skill.selfSnare) v.charge = null;
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
  pull(v, to, speed, far = 99, claw = false) {
    if (fixed(v)) return;
    const dx = to.x - v.x, dz = to.z - v.z, d = Math.hypot(dx, dz) || 1;
    // 2.3: what it takes to cover `far` before the stagger wears off.
    const sp = Math.min(speed, d * 3.2, far * 2.3);
    v.vx = (dx / d) * sp; v.vz = (dz / d) * sp;
    v.tumble = Math.max(v.tumble, 0.5); v.drag = 0.5; v.clawSlowDelay = claw ? v.drag : 0; v.dragTo = to; v.cmd = null; v.dash = null; v.cast = null; v.chan = null; v.hold = null;
  }

  // Slows `v` for `T` seconds, taking `pct` of its speed (40% unless said).
  // A weaker slow never replaces a stronger one that is still running.
  slowBy(v, T, pct = 0.4) {
    if (T <= 0) return;
    const previous = v.slow > 0 ? v.slowK || 0.4 : 0;
    const next = Math.max(previous, clamp(pct, 0, 1));
    // Apply only the change in multiplier, once. Refreshes must not keep
    // halving velocity, and forced movement keeps its original momentum.
    if (next > previous && v.spin > 0 && !rooted(v) && !v.still
        && !v.dash && !v.blink && !v.air && !v.out
        && v.tumble <= 0 && !(v.drag > 0) && !(v.launch > 0)) {
      const ratio = (1 - next) / (1 - previous);
      v.vx *= ratio; v.vz *= ratio;
    }
    v.slowK = next;
    v.slow = Math.max(v.slow, T);
  }

  stun(v, T) {
    if (fixed(v) || this.shrug(v)) return;
    if (v.charge?.skill.selfSnare) v.charge = null;
    v.stun = Math.max(v.stun, T * CC.scale);
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
    if (this.shrug(v)) return;
    if (fixed(v)) return;
    v.snare = Math.max(v.snare, T * CC.scale);
    v.vx = v.vz = 0;
    v.cmd = null; v.dash = null;
    this.emit('say', { top: v, text: 'SNARE', tone: 'red' });
  }

  // Knocked into the air: it hangs where it is and can do nothing.
  lift(v, T) {
    if (fixed(v) || this.shrug(v)) return;
    v.up = Math.max(v.up, T * CC.scale);
    v.vx = v.vz = 0;
    v.cmd = null; v.dash = null; v.cast = null; v.chan = null; v.hold = null;
    this.emit('say', { top: v, text: 'KNOCK UP', tone: 'red' });
  }

  bleed(v, n, by) {
    const was = v.bleed;
    if (by) v.bleedBy = by.side;
    v.bleed = Math.min(BLEED.max, v.bleed + n);
    v.bleedT = BLEED.dur;
    if (v.bleed === BLEED.max && was < BLEED.max) this.emit('say', { top: v, text: 'HEMORRHAGE', tone: 'red' });
  }

  // Everything a landed skill does besides its own damage. `shove` is off for
  // body hits, which throw the target themselves.
  affect(s, v, S, dx, dz, shove = true) {
    if (s.realm !== v.realm) return;
    // A sigil goes off on the next skill that lands (unless it is waiting for a follow-up of its own).
    if (v.mark > 0 && !v.markHold) {
      v.mark = 0;
      const dmg = this.hurt(v, (SKILLS.sigil.pop * v.markK * s.blade.atk) / v.blade.def, s, 'sigil');
      this.emit('strike', { top: v, src: s, skill: SKILLS.sigil, x: v.x, z: v.z, dmg });
    }
    if (S.mark) { v.mark = S.mark; v.markK = s.x2 ? 2 : 1; v.markHold = !!S.again; }
    // Stun first: it stops the top dead, and the knockback then carries it off.
    if (S.stun) this.stun(v, S.stun);
    if (S.kb && shove) {
      if (S.tumble === 0) this.push(v, dx, dz, S.kb);
      else this.knock(v, dx, dz, S.kb, S.tumble ?? 0.35, S.launch ?? 1.5);
    }
    if (S.snare) this.snare(v, S.snare);
    if (S.shredT) { v.shred = Math.max(v.shred, S.shredT); v.shredK = S.shredK; }
    if (S.strip) { v.shield = v.shieldT = 0; if (v.guard > 0) { v.guard = 0; this.emit('guardEnd', { top: v }); } }
    if (S.silence) v.silence = Math.max(v.silence, S.silence * CC.scale);
    if (S.pinT) v.pin = S.pinT;
    if (S.frost) v.frost = Math.max(v.frost, S.frost);
    if (S.up) this.lift(v, S.up);
    if (S.slow) this.slowBy(v, S.slow, S.slowPct);
    if (S.bleed) this.bleed(v, S.bleed, s);
    if ((S.charm || S.fear) && !fixed(v) && !this.shrug(v)) {
      v.charm = (S.charm || S.fear) * CC.scale; v.charmDir = S.charm ? 1 : -1;
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

  // `t` is out of the round. The round itself ends when one top, or one team, is left.
  eliminate(t, kind, by) {
    if (this.result || t.gone) return;
    t.gone = kind;
    if (this.practice) t.back = 1;
    if (this.practice || this.sidesLeft() > 1) {
      t.cmd = t.dash = t.cast = t.charge = t.tether = t.orbs = t.chan = t.hold = null; t.guard = 0; t.toggle = false;
      this.emit('ko', { top: t, kind, by: by || null });
      return;
    }
    const left = this.tops.filter((o) => !o.gone);
    const winner = (by && !by.gone && by.team !== t.team ? by : null) || left[0] || this.tops.find((o) => o !== t);
    this.finish(winner, t, kind);
  }

  timeUp() {
    if (this.result) return;
    // Whoever has kept the most of its spin.
    const left = this.tops.filter((o) => !o.gone).sort((p, q) => spinRatio(q) - spinRatio(p) || p.side - q.side);
    const w = left[0];
    this.finish(w, left.find((o) => o.team !== w.team) || this.tops.find((o) => o !== w), 'time');
  }

  step(dt) {
    this.time += dt;
    const T = this.tops;
    for (const t of T) { SCOPE = t.realm; this.updateTop(t, dt, this.other(t)); }
    SCOPE = -1;
    for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) this.collide(T[i], T[j]);
    for (const t of T) if (t.kickT > 0) this.bowl(t, dt);
    for (const t of T) this.barriers(t);
    for (const t of T) this.walls(t);
    for (const t of T) this.confine(t);
    this.updateProjectiles(dt);
    this.updateZones(dt);
    SCOPE = -1;
    if (this.practice) this.drill(dt);
    if (!this.result) {
      for (const t of this.tops) {
        if (t.spin > 0 || t.out || t.gone) continue;
        // FROST PHOENIX gets one second chance per round.
        if (t.blade.egg && !t.eggUsed && t.stack >= (t.blade.egg.needStack || 0)) { this.layEgg(t); continue; }
        t.spin = 0;
        const h = t.lastHit;
        const burst = h && this.time - h.time < 0.35 && h.dmg >= 55;
        this.eliminate(t, burst ? 'burst' : 'spin', h && h.by >= 0 ? this.tops[h.by] : null);
        if (this.result) break;
      }
    }
  }

  // Practice: the switches on the panel, and tops that went down coming back.
  drill(dt) {
    const P = this.practice;
    for (const t of this.tops) {
      if (t.gone) { t.back -= dt; if (t.back <= 0) this.revive(t); continue; }
      if (P.keep[t.side] && !t.out && t.egg <= 0) t.spin = t.spinMax;
      if (t.side) continue;
      if (P.fullUlt) t.ult = 100;
      if (!P.noCd) continue;
      t.flash = 1;
      t.wcd.fill(0);
      for (const k of KEYS) {
        const S = skillOf(t, k);
        // What is fired by holding a key, or shot by shot, keeps its own pace.
        if (!S.rapid && !S.stream && !this.aimSkill(t, k).fire) t.cd[k] = 0;
        if (S.stock) t.stk = S.stock.max;
      }
    }
  }

  // Practice: back where it started, whole, with whatever it had put on the floor gone.
  revive(t) {
    for (const q of this.zones) if (q.owner === t) this.endZone(q);
    this.resetTop(t);
    this.emit('back', { top: t });
  }

  layEgg(t) {
    const E = t.blade.egg;
    t.eggUsed = true; t.egg = E.dur; t.eggHp = E.hp || 1; t.spin = 1;
    if (E.rise) { t.stun = t.snare = t.slow = t.charm = t.silence = t.ground = 0; t.launch = 0; }
    t.cmd = t.dash = t.cast = t.chan = t.charge = null;
    t.vx = t.vz = 0; t.up = 0; t.tumble = 0;
    this.emit('egg', { top: t });
  }

  updateTop(t, dt, opp) {
    for (let i = 0; i < t.wcd.length; i++) t.wcd[i] = Math.max(0, t.wcd[i] - dt);
    for (const k of KEYS) {
      t.cd[k] = Math.max(0, t.cd[k] - dt);
      if (t.re[k] <= 0) continue;
      t.re[k] = Math.max(0, t.re[k] - dt);
      // A window that closes with uses left over gives some of the cooldown back.
      const S = skillOf(t, k);
      // PORTAL JUMP snaps back by itself.
      if (t.re[k] <= 0 && S.autoRet && t.ret && !t.out && !this.result) {
        const fx = t.x, fz = t.z;
        t.x = t.ret.x; t.z = t.ret.z; t.vx = t.vz = 0; t.cmd = null; t.ret = null; t.dash = t.blink = null;
        this.emit('warp', { top: t, fx, fz });
      }
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
    t.grab = Math.max(0, t.grab - dt);
    t.drag = Math.max(0, t.drag - dt);
    // A pull sets its catch down beside whoever pulled, not into them: no clash to knock it away again.
    if (t.drag > 0 && t.dragTo && Math.hypot(t.dragTo.x - t.x, t.dragTo.z - t.z) < (t.dragTo.radius ? t.dragTo.radius + t.radius + 0.4 : 0.5)) { t.vx = 0; t.vz = 0; }
    if (t.drag <= 0) t.dragTo = null;
    if (t.clawSlowDelay > 0) {
      t.clawSlowDelay = Math.max(0, t.clawSlowDelay - dt);
      if (t.clawSlowDelay === 0) this.slowBy(t, SKILLS.deathgrasp.afterSlow, SKILLS.deathgrasp.afterSlowPct);
    }
    t.empower = Math.max(0, t.empower - dt);
    t.up = Math.max(0, t.up - dt);
    t.ground = Math.max(0, t.ground - dt);
    t.mark = Math.max(0, t.mark - dt);
    if (t.chak && (t.chakT -= dt) <= 0) t.chak = 0;
    t.scar = Math.max(0, t.scar - dt);
    t.poison = Math.max(0, t.poison - dt);
    const lit = t.buff > 0;
    t.buff = Math.max(0, t.buff - dt);
    if (t.buff <= 0) t.hema = false;
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
      // Drawing breath: it mends a little all the while.
      if (S.chargeHeal && !this.result && t.spin > 0) t.spin = Math.min(t.spinMax, t.spin + S.chargeHeal * t.spinMax * dt);
      // Some go off by themselves when they are full, the way they were last pointed.
      if (S.wind.auto && t.hold.t >= S.wind.max && !this.result) {
        let { dx, dz } = t.hold;
        if (!dx && !dz) { dx = opp.x - t.x; dz = opp.z - t.z; const d = Math.hypot(dx, dz) || 1; dx /= d; dz /= d; }
        this.cast(t, t.hold.key, t.x + dx * 6, t.z + dz * 6);
      }
    }
    if (t.hold) {
      const S = skillOf(t, t.hold.key);
      // Full, but reeling from a knock at that very moment: it goes off as soon as the top has steadied.
      const reeling = !!S.wind.auto && t.tumble > 0 && t.hold.t < S.wind.max + 1;
      // Held too long, or no longer able to throw: the wind-up is wasted.
      if ((t.hold.t >= S.wind.max && !reeling) || this.result || t.spin <= 0 || t.out || t.air || t.egg > 0 || t.up > 0) {
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
    if (t.sleep > 0) t.sleep = Math.max(0, t.sleep - dt);
    if (t.silence > 0) t.silence = Math.max(0, t.silence - dt);
    if (t.dbl > 0) t.dbl = Math.max(0, t.dbl - dt);
    if (t.deT > 0) { t.deT -= dt; if (t.deT <= 0) t.deN = t.deT = 0; }
    if (t.ardent > 0) t.ardent = Math.max(0, t.ardent - dt);
    if (t.shrugCd > 0) t.shrugCd = Math.max(0, t.shrugCd - dt);
    if (t.rockT > 0) t.rockT = Math.max(0, t.rockT - dt);
    if (t.streamT <= 0) t.rayA = null;
    // OVERDRIVE runs down into a slow.
    if (t.odT > 0) { t.odT -= dt; if (t.odT <= 0) { t.odT = 0; const O = SKILLS.overdrive; this.slowBy(t, O.after, O.afterPct); } }
    if (t.spray && !this.result && t.spin > 0 && !t.out && !t.gone) {
      const sp = t.spray;
      sp.acc += dt;
      while (sp.n > 0 && sp.acc >= sp.every) { sp.acc -= sp.every; sp.n--; if (t.stun <= 0 && t.up <= 0 && !t.air) { const p = this.fire(t, sp.skill, sp.dx, sp.dz, { quiet: sp.n % 3 !== 0 }); if (sp.chak) p.chakOf = t.side; } }
      if (sp.n <= 0) t.spray = null;
    } else if (t.spray) t.spray = null;
    if (t.echo && (t.echo.t -= dt) <= 0) {
      const E = t.echo;
      t.echo = null;
      if (!this.result && !t.gone && !t.out) for (const i of E.to) this.offhand(t, this.tops[i], E.wi, 2);
    }
    if (t.volley && !this.result && t.spin > 0 && !t.out && !t.gone) {
      const V = t.volley, S = V.skill;
      V.acc += dt;
      while (V.n > 0 && V.acc >= V.every) {
        V.acc -= V.every; V.n--;
        if (t.stun > 0 || t.up > 0 || t.air) continue;
        // Whoever is nearest, measured to its edge.
        let v = null, bd = S.range;
        for (const o of this.foes(t)) { const d = Math.hypot(o.x - t.x, o.z - t.z) - o.radius; if (targetable(o) && d <= bd) { bd = d; v = o; } }
        if (!v) continue;
        // The other hand first, then the scythe, which drinks what it cuts.
        if (V.n % 2) { this.offhand(t, v, V.off, true); continue; }
        const dmg = this.hurt(v, (S.dmg * (v.guard > 0 ? 0.3 : 1) * t.blade.atk) / v.blade.def, t, S.id);
        this.mend(t, dmg * S.leech);
        t.stats.skillHits++;
        this.emit('strike', { top: v, src: t, skill: S, x: v.x, z: v.z, dmg, fx: t.x, fz: t.z });
      }
      if (V.n <= 0) t.volley = null;
    } else if (t.volley) t.volley = null;
    // BLOOD FRENZY: it goes for whoever is nearest, whatever its owner wants.
    if (t.buff > 0 && t.blade.buff && t.blade.buff.frenzy && !this.result && !t.dash && !t.air && !t.out && t.stun <= 0 && t.snare <= 0 && !rooted(t)) {
      const o = (t.prey >= 0 && this.tops[t.prey] && !this.tops[t.prey].gone && t.blade.buff.hunt && this.tops[t.prey]) || opp;
      if (o && !o.gone) { const lim = ARENA.R - t.radius - 0.2, r = Math.hypot(o.x, o.z), k = r > lim ? lim / r : 1; t.cmd = { x: o.x * k, z: o.z * k, t: 0.5 }; }
    }
    // DARKNESS RISE: while it is lit, everything close by burns.
    const AU = t.blade.aura;
    if (AU && t.stack >= AU.hits && !this.result && t.spin > 0 && !t.out && !t.air) {
      for (const o of this.foes(t)) if (targetable(o) && Math.hypot(o.x - t.x, o.z - t.z) < AU.r + o.radius * 0.5) this.dot(o, (AU.dps * dt * t.blade.atk) / o.blade.def, t);
    }
    if (t.quillT > 0) { t.quillT -= dt; if (t.quillT <= 0) t.quills = t.quillT = 0; }
    if (t.lightsT > 0) { t.lightsT -= dt; if (t.lightsT <= 0) t.lights = t.lightsT = 0; }
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
        if (t.blade.egg.rise) t.stack = t.stackT = 0;
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
      if (t.bleed > 0) {
        const by = this.tops[t.bleedBy] || opp, amt = (BLEED.dps * t.bleed * dt * by.blade.atk) / t.blade.def;
        this.dot(t, amt, by);
        // Some drink what they make bleed.
        if (by.blade.bleedLeech && !by.gone) by.spin = Math.min(by.spinMax, by.spin + amt * by.blade.bleedLeech);
      }
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
        const S = SKILLS.deathmark, who = this.tops[t.dmarkTo] || opp;
        if (!this.result && !who.out && !who.gone) {
          const hit = this.hurt(who, (S.pop * t.blade.atk) / who.blade.def + t.dacc * S.share, t, 'deathmark');
          this.emit('blast', { top: t, skill: S, x: who.x, z: who.z, r: 3, hit, target: who });
        }
        t.dmarkTo = -1;
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
      if (a.skill.id === 'fling') {
        // The toss hits the rim at its current flight speed, like other knockbacks.
        const speed = 6 * k * (1 - k) / a.T;
        t.vx = (a.tx - a.sx) * speed; t.vz = (a.tz - a.sz) * speed;
        t.launch = Math.max(t.launch, dt);
        this.walls(t);
        if (!t.air || t.out) return;
      }
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
      // POISON TRAIL: paid for in spin, for as long as it is left on.
      const S = SKILLS.poison;
      if (t.egg > 0) t.toggle = false;
      else {
        t.spin -= S.cost * dt;
        t.drop -= dt;
        // The newest stretch follows the top; a new one is begun now and then, where the last one ends.
        let q = t.trailZ && !t.trailZ.dead && this.zones.includes(t.trailZ) ? t.trailZ : null;
        if (q) { const dx = t.x - q.x, dz = t.z - q.z; if (Math.hypot(dx, dz) > S.reach) q = null; else { q.dx = dx; q.dz = dz; } }
        if (!q || t.drop <= 0) { t.drop = S.every; t.trailZ = this.zone(t, S, t.x, t.z, null, true); }
      }
    } else t.trailZ = null;
    if (t.charge) {
      // Drawing breath: it mends a little all the while.
      if (t.charge.skill.chargeHeal) t.spin = Math.min(t.spinMax, t.spin + t.charge.skill.chargeHeal * t.spinMax * dt);
      t.charge.t += dt;
      if (t.charge.t >= t.charge.T) this.chargeDone(t, opp);
    }
    if (t.chan) this.updateChan(t, opp, dt);
    else if (t.re.R > 0 && skillOf(t, 'R').stance) t.re.R = 0;
    if (t.orbs) this.updateOrbs(t, opp, dt);
    if (t.tether) this.updateTether(t, opp, dt);
    if (t.dash && t.dash.skill.homing) {
      // It turns to follow its target for as long as the charge lasts, and gives up if the target is out of the world.
      const h = t.dash, o = this.tops[h.home ?? t.prey];
      h.age = (h.age || 0) + dt;
      if (!o || o.gone || o.out || o.realm !== t.realm || h.age > h.skill.maxT || this.result) { t.dash = null; t.vx = t.vz = 0; }
      else { const dx = o.x - t.x, dz = o.z - t.z, d = Math.hypot(dx, dz) || 1; h.dx = dx / d; h.dz = dz / d; h.t = d / h.speed + 0.1; }
    }
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

  land(t, near) {
    const a = t.air, S = a.skill;
    let x = a.tx, z = a.tz;
    const opp = (a.to !== undefined && this.tops[a.to] && !this.tops[a.to].gone && this.tops[a.to]) || near;
    // A pounce comes down beside its target wherever that has got to.
    if (S.track && a.to !== undefined && !opp.gone && !opp.out) { const dx = opp.x - a.sx, dz = opp.z - a.sz, d = Math.hypot(dx, dz) || 1; x = opp.x - (dx / d) * 2.2; z = opp.z - (dz / d) * 2.2; }
    t.air = null; t.x = x; t.z = z; t.vx = t.vz = 0;
    if (S.id === 'deathmark') {
      // Out the far side of where the target is now, or as near as the wall allows.
      let dx = opp.x - a.sx, dz = opp.z - a.sz;
      const d = Math.hypot(dx, dz) || 1;
      let px = opp.x + (dx / d) * S.gap, pz = opp.z + (dz / d) * S.gap;
      const lim = ARENA.R - t.radius - 0.2, r = Math.hypot(px, pz);
      if (r > lim) { px *= lim / r; pz *= lim / r; }
      t.x = px; t.z = pz;
      t.dmark = S.dur; t.dacc = 0; t.dmarkTo = opp.side;
      t.re[this.keyOf(t, S.id)] = S.window;
      this.emit('warp', { top: t, fx: a.sx, fz: a.sz });
      this.emit('say', { top: opp, text: 'DEATH MARK', tone: 'red' });
      return;
    }
    if (a.by !== t.side) {
      // Thrown by the other top. Heavier tops come down harder.
      const by = this.tops[a.by];
      t.tumble = Math.max(t.tumble, 0.3);
      const hit = this.hurt(t, (S.dmg * (1 + (S.massMul || 0) * (t.mass - 1)) * by.blade.atk) / t.blade.def, by, S.id);
      // BACK TOSS: down onto the thrower's own adhesive is a harder landing, and a stun.
      if (S.id === 'fling') { if (this.own(by, 'glue').some((q) => Math.hypot(q.x - x, q.z - z) < q.r)) { this.hurt(t, (S.glueDmg * by.blade.atk) / t.blade.def, by, S.id); this.stun(t, S.stun); } } else if (S.stun) this.stun(t, S.stun);
      if (S.slow) this.slowBy(t, S.slow, S.slowPct);
      by.stats.skillHits++;
      // THE SHOW STOPPER: whoever else of the thrower's enemies stands where it comes down is caught too.
      let more = 0;
      if (S.around) for (const o of this.foes(by)) {
        if (o === t || !targetable(o) || o.realm !== t.realm || Math.hypot(o.x - x, o.z - z) > S.aoe + o.radius * 0.5) continue;
        more += this.hurt(o, (S.dmg * S.around * (o.guard > 0 ? 0.3 : 1) * by.blade.atk) / o.blade.def, by, S.id);
        if (o.guard <= 0 && S.slow) this.slowBy(o, S.slow, S.slowPct);
        by.stats.skillHits++;
      }
      this.emit('blast', { top: by, skill: S, x, z, r: S.aoe || 2.2, hit: hit + more, target: t });
      return;
    }
    if (S.id !== 'meteor') {
      t.tumble = 0.1;
      if (!S.dmg) { this.emit('blast', { top: t, skill: S, x, z, r: 1.6, hit: 0, target: null }); return; }
      const hit = this.burst(t, S, x, z, S.aoe);
      if (hit && S.healHit) this.mend(t, hit * S.healHit);
      // CERTAIN DEATH: everyone it lands among but the one it came for runs from it.
      if (S.scare) for (const o of this.foes(t)) if (o.side !== a.to && targetable(o) && o.guard <= 0 && Math.hypot(o.x - x, o.z - z) < S.aoe + o.radius * 0.5) this.affect(t, o, { fear: S.scare }, 0, 0);
      return;
    }
    t.tumble = 0.2;
    // Everyone under it is hit and thrown outward, hardest at the middle.
    let hit = 0, tg = null;
    for (const o of this.foes(t)) {
      if (!targetable(o)) continue;
      let dx = o.x - x, dz = o.z - z;
      const d = Math.hypot(dx, dz);
      if (d >= S.aoe + o.radius * 0.5) continue;
      if (d < 0.05) { dx = 1; dz = 0; } else { dx /= d; dz /= d; }
      const f = d < 2 ? 1 : 1 - 0.45 * ((d - 2) / (S.aoe - 1.5));
      const g = o.guard > 0 ? 0.4 : 1;
      hit += this.hurt(o, (S.dmg * f * g * t.blade.atk) / o.blade.def, t, 'meteor');
      this.knock(o, dx, dz, S.kb * f * g, 0.8 * g, 2);
      // Keep the two from overlapping where it came down.
      if (d < 2.6) { o.x = x + dx * 2.6; o.z = z + dz * 2.6; }
      t.stats.skillHits++;
      tg = tg || o;
    }
    this.emit('meteor', { top: t, x, z, hit, target: hit ? tg : null });
  }

  chargeDone(t, opp) {
    const S = t.charge.skill;
    if (S.id === 'nova') { this.novaBlast(t, opp); return; }
    if (S.tip) { const { dx, dz } = t.charge; t.charge = null; this.swing(t, S, dx, dz); return; }
    if (S.id === 'realm') { t.charge = null; this.openRealm(t, this.tops[t.prey]); return; }
    if (S.kind === 'shot') { const { dx, dz } = t.charge; t.charge = null; if (S.fan) this.fan(t, S, dx, dz, S.fan); else this.fire(t, S, dx, dz); return; }
    if (S.kind === 'cone') {
      const { dx, dz } = t.charge;
      t.charge = null;
      this.coneHit(t, S, dx, dz);
      return;
    }
    if (S.kind === 'beam') {
      // Everything along the line is hit at once.
      const { dx, dz } = t.charge;
      t.charge = null;
      let hit = 0, tg = null;
      const victims = this.foes(t).filter((opp) => {
        const rx = opp.x - t.x, rz = opp.z - t.z, along = rx * dx + rz * dz, side = Math.abs(-rx * dz + rz * dx);
        return targetable(opp) && along > -1 && along < S.range && side < S.radius + opp.radius * 0.6;
      });
      for (const opp of victims) {
        const g = opp.guard > 0 ? 0.3 : 1;
        hit += this.hurt(opp, (S.dmg * (S.litBonus && opp.scar > 0 ? 1 + S.litBonus : 1) * g * t.blade.atk) / opp.blade.def, t, S.id);
        if (g === 1) {
          if (S.pull) this.pull(opp, { x: opp.x - dx * S.pullDist, z: opp.z - dz * S.pullDist }, S.pull, S.pullDist);
          this.affect(t, opp, S, dx, dz);
        }
        t.stats.skillHits++;
        tg = tg || opp;
      }
      this.emit('beam', { top: t, skill: S, x: t.x, z: t.z, dx, dz, hit, target: tg });
      return;
    }
    t.charge = null;
    // DECIMATE: the edge of the axe is the outer ring.
    let hit = 0, heal = 0, tg = null;
    for (const opp of this.foes(t)) {
      if (!targetable(opp)) continue;
      const d = Math.hypot(opp.x - t.x, opp.z - t.z);
      if (d >= S.aoe + opp.radius * 0.5) continue;
      const outer = d >= S.inner, g = opp.guard > 0 ? 0.3 : 1;
      hit += this.hurt(opp, ((outer ? S.dmg : S.weak) * g * t.blade.atk) / opp.blade.def, t, 'decimate');
      if (g === 1) this.affect(t, opp, S, 0, 0);
      // Every enemy the blade's edge catches heals a share of what is missing.
      if (outer) { const h = S.heal * (t.spinMax - t.spin); heal += h; t.spin += h; }
      t.stats.skillHits++;
      tg = tg || opp;
    }
    this.emit('blast', { top: t, skill: S, x: t.x, z: t.z, r: S.aoe, hit, target: tg });
    if (heal >= 1) this.emit('heal', { top: t, amount: heal });
  }

  // THE DARKIN BLADE: a line, then a fan, then a slam; the edge (or the middle of the slam) is the sweet spot.
  swing(t, S, dx, dz) {
    const cx = t.x + dx * (S.ahead || 0), cz = t.z + dz * (S.ahead || 0);
    let hit = 0, tg = null;
    for (const opp of this.foes(t)) {
      const rx = opp.x - t.x, rz = opp.z - t.z, d = Math.hypot(rx, rz), along = rx * dx + rz * dz, side = Math.abs(rz * dx - rx * dz);
      const m = Math.hypot(opp.x - cx, opp.z - cz);
      let inside, tip;
      if (S.kind === 'beam') { inside = along > -1 && along < S.range + opp.radius * 0.6 && side < S.radius + opp.radius * 0.6; tip = along >= S.tip; }
      else if (S.kind === 'cone') { inside = this.inCone(t, opp, dx, dz, S); tip = d >= S.tip; }
      else { inside = m < S.aoe + opp.radius * 0.5; tip = m < S.tip; }
      if (!(targetable(opp) && inside)) continue;
      const g = opp.guard > 0 ? 0.3 : 1;
      hit += this.hurt(opp, (S.dmg * (tip ? 1 + S.tipMul : 1) * g * t.blade.atk) / opp.blade.def, t, S.id);
      if (g === 1 && tip) this.lift(opp, S.tipUp);
      t.stats.skillHits++;
      tg = tg || opp;
    }
    if (S.kind === 'beam') this.emit('beam', { top: t, skill: S, x: t.x, z: t.z, dx, dz, hit, target: tg });
    else if (S.kind === 'cone') this.emit('cone', { top: t, skill: S, dx, dz, hit, target: tg });
    else this.emit('blast', { top: t, skill: S, x: cx, z: cz, r: S.aoe, hit, target: tg });
  }

  novaBlast(t, opp) {
    const S = t.charge.skill;
    t.charge = null;
    let hit = 0, tg = null;
    for (const o of this.foes(t)) {
      if (!targetable(o)) continue;
      let dx = o.x - t.x, dz = o.z - t.z;
      const d = Math.hypot(dx, dz);
      if (d >= S.aoe + o.radius * 0.5) continue;
      if (d < 0.05) { dx = 1; dz = 0; } else { dx /= d; dz /= d; }
      const f = d < 3 ? 1 : 1 - 0.5 * ((d - 3) / (S.aoe - 2.5));
      hit += this.hurt(o, (S.dmg * f * t.blade.atk) / o.blade.def, t, 'nova');
      this.knock(o, dx, dz, S.kb * f, 0.8, 2);
      t.stats.skillHits++;
      tg = tg || o;
    }
    this.emit('nova', { top: t, x: t.x, z: t.z, hit, target: tg });
  }

  // CURTAIN CALL: shots at a fixed beat, each turned toward the target as far
  // as the cone chosen at the start allows.
  updateChan(t, opp, dt) {
    const ch = t.chan, S = ch.skill;
    ch.t += dt;
    // The stance is held only so long; what was not fired is lost.
    if (ch.t >= S.window) { t.chan = null; this.emit('chanEnd', { top: t }); }
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

  updateTether(t, near, dt) {
    const th = t.tether, S = th.skill, opp = this.tops[th.to] || near;
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
        if (S.sleep) opp.sleep = S.root * CC.scale;
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
    this.slowBy(opp, 0.15);
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
      const t = z.owner, S = z.skill;
      SCOPE = t.realm;
      const opp = this.near(t, z.x, z.z);
      const live = targetable(opp) && !this.result;
      if (z.kind === 'shadow' && z.c & 2) {
        // A shadow thrown out: it flies to its spot and stays there.
        const mx = z.dx - z.x, mz = z.dz - z.z, m = Math.hypot(mx, mz), st = S.fly * dt;
        if (m <= st) { z.x = z.dx; z.z = z.dz; z.c &= ~2; } else { z.x += (mx / m) * st; z.z += (mz / m) * st; }
      }
      const d = Math.hypot(opp.x - z.x, opp.z - z.z);
      switch (z.kind) {
        case 'quake': {
          if (z.t < z.T) break;
          z.dead = true;
          let hit = 0, tg = null;
          for (const opp of this.inZone(z, t, 0.5)) {
            let dx = opp.x - z.x, dz = opp.z - z.z;
            const d = Math.hypot(dx, dz);
            if (d < 0.05) { dx = 0; dz = 1; } else { dx /= d; dz /= d; }
            const g = opp.guard > 0 ? 0.3 : 1;
            hit += this.hurt(opp, (S.dmg * g * t.blade.atk) / opp.blade.def, t, 'quake');
            if (g === 1) { this.stun(opp, S.stun); this.knock(opp, dx, dz, S.kb, 0.25, 0); }
            t.stats.skillHits++;
            tg = tg || opp;
          }
          this.emit('quake', { top: t, x: z.x, z: z.z, r: z.r, hit, target: tg });
          break;
        }
        case 'grenade': {
          if (z.t < z.T) break;
          z.dead = true;
          let hit = 0, tg = null;
          for (const opp of this.inZone(z, t, 0.5)) {
            const d = Math.hypot(opp.x - z.x, opp.z - z.z);
            const g = opp.guard > 0 ? 0.3 : 1;
            tg = tg || opp;
            hit += this.hurt(opp, ((z.c ? S.bigDmg : S.dmg) * g * t.blade.atk) / opp.blade.def, t, 'grenade');
            if (g === 1) { this.slowBy(opp, S.slow, z.c ? S.bigSlowPct : S.slowPct); if (d < (z.c ? S.bigCore : S.core)) this.stun(opp, S.stun); }
            t.stats.skillHits++;
            // A hit has every turret fire its laser at once.
            for (const q of this.own(t, 'turret')) q.dz = 1;
          }
          // Upgraded, it bounces on twice more.
          if (z.c && z.b < S.bounces - 1 && !this.result) this.zone(t, S, z.x + z.dx * S.hop, z.z + z.dz * S.hop, { c: 1, b: z.b + 1, dx: z.dx, dz: z.dz });
          this.emit('blast', { top: t, skill: S, x: z.x, z: z.z, r: z.r, hit, target: tg });
          break;
        }
        case 'sanctuary':
          // a: spin healed since the last report, b: time since then
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          // Its whole side mends in it. (heal: what each has been given since the last report; kept here only.)
          z.heal = z.heal || {};
          for (const o of [t, ...this.mates(t)]) {
            if (o.out || o.air || o.spin <= 0 || Math.hypot(o.x - z.x, o.z - z.z) >= z.r) continue;
            const h = Math.min(S.regen * dt, o.spinMax - o.spin);
            o.spin += h; z.heal[o.side] = (z.heal[o.side] || 0) + h;
          }
          z.b += dt;
          if (z.b >= 1) { for (const o of this.tops) if (z.heal[o.side] >= 1) this.emit('heal', { top: o, amount: z.heal[o.side] }); z.heal = {}; z.b = 0; }
          if (!this.result) for (const o of this.foes(t)) if (targetable(o) && Math.hypot(o.x - z.x, o.z - z.z) < z.r) this.slowBy(o, 0.2);
          break;
        case 'lotus':
          // c: sprung, a: when
          if (z.c) {
            // Sprung: a slowing field until it goes off.
            if (live && d < z.r + opp.radius * 0.3) this.slowBy(opp, 0.3, S.slowPct);
            if (z.t - z.a >= S.fuse) { z.dead = true; this.burst(t, S, z.x, z.z, z.r); }
          } else if (z.t >= z.T) this.endZone(z);
          else if (z.t >= S.arm && live && d < S.trig + opp.radius * 0.5) {
            z.c = 1; z.a = z.t;
            this.emit('say', { top: opp, text: 'TRAP!', tone: 'red' });
          }
          break;
        case 'blizzard':
          initZone(z); // keeps spreading
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          for (const opp of this.inZone(z, t, 0.3)) {
            // Fully grown it cuts three times as deep, slows harder and ices over.
            const full = z.t >= S.grow;
            this.slowBy(opp, full ? 1.5 : 1, full ? 0.6 : 0.4);
            if (full) opp.frost = Math.max(opp.frost, S.frost);
            this.dot(opp, (S.dps * (full ? 3 : 1) * dt * t.blade.atk) / opp.blade.def, t);
          }
          break;
        case 'poison':
          if (z.t >= z.T) { z.dead = true; break; }
          // A stretch of trail: from where it was begun (x, z) to where it ends (dx, dz further on).
          if (!this.result) for (const o of this.foes(t)) {
            if (!targetable(o)) continue;
            const L2 = z.dx * z.dx + z.dz * z.dz, u = L2 > 0 ? clamp(((o.x - z.x) * z.dx + (o.z - z.z) * z.dz) / L2, 0, 1) : 0;
            if (Math.hypot(o.x - z.x - z.dx * u, o.z - z.z - z.dz * u) < z.r + o.radius * 0.3) o.poison = S.linger;
          }
          break;
        case 'glue':
          if (z.t >= z.T) { this.endZone(z); break; }
          for (const o of this.inZone(z, t, 0)) { o.ground = 0.25; this.slowBy(o, 0.25, S.slowPct); }
          break;
        case 'turret': {
          // a: overclock time left, b: time to the next shot, c: 1 upgraded, +2 for each blow taken
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          // Whoever runs over it brings it one blow nearer to breaking. (Counted as they arrive: standing on it is
          // still one blow.)
          {
            const on = live && d < z.r + opp.radius * 0.6;
            if (on && !z.on) this.hitTurret(z, opp);
            z.on = on;
            if (z.dead) break;
          }
          z.a = Math.max(0, z.a - dt); z.b -= dt;
          // dx: how long its maker has been far away, dz: laser charge
          z.dx = Math.hypot(t.x - z.x, t.z - z.z) > S.leash ? z.dx + dt : 0;
          if (z.dx >= S.idle) break; // left alone too long, it shuts down
          z.dz = Math.min(1, z.dz + dt / S.laserEvery);
          if (z.dz >= 1 && live && d < SKILLS.turretlaser.range) {
            z.dz = 0;
            this.lineHit(t, z.c & 1 ? SKILLS.biglaser : SKILLS.turretlaser, z.x, z.z, (opp.x - z.x) / (d || 1), (opp.z - z.z) / (d || 1));
          }
          if (z.b <= 0 && live && d < S.reach) {
            const shot = z.c & 1 ? SKILLS.bigshot : SKILLS.turretshot, lead = d / shot.speed;
            const ax = opp.x + opp.vx * lead - z.x, az = opp.z + opp.vz * lead - z.z, n = Math.hypot(ax, az) || 1;
            this.fire(t, shot, ax / n, az / n, { x: z.x, z: z.z, dmg: z.c & 1 ? S.bigDmg : S.dmg });
            z.b = S.rate * (z.a > 0 ? 0.45 : 1) * (z.c & 1 ? 0.7 : 1);
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
            // Everyone in the way is struck, once a march however many soldiers pass (bit 4 << side: already struck).
            if (!this.result) for (const o of this.foes(t)) {
              const bit = 4 << o.side;
              if (z.c & bit || !targetable(o) || Math.hypot(o.x - z.x, o.z - z.z) >= C.aoe + o.radius * 0.5) continue;
              for (const q of this.own(t, 'arise')) q.c |= bit;
              const dmg = this.hurt(o, (C.dmg * (o.guard > 0 ? 0.3 : 1) * t.blade.atk) / o.blade.def, t, 'conquer');
              if (o.guard <= 0) this.affect(t, o, C, 0, 0);
              t.stats.skillHits++;
              this.emit('strike', { top: o, src: t, skill: C, x: o.x, z: o.z, dmg });
            }
            break;
          }
          z.b -= dt;
          if (z.b <= 0 && live && d < S.reach + opp.radius * 0.4 && !t.out && Math.hypot(t.x - z.x, t.z - z.z) < S.leash) {
            // It stabs at the nearest, and the spear goes through everyone else within its reach.
            for (const o of this.foes(t)) {
              const od = Math.hypot(o.x - z.x, o.z - z.z);
              if (!targetable(o) || od >= S.reach + o.radius * 0.4) continue;
              const dmg = this.hurt(o, (S.dmg * (o.guard > 0 ? 0.3 : 1) * t.blade.atk) / o.blade.def, t, 'arise');
              if (o.guard <= 0) this.push(o, (o.x - z.x) / (od || 1), (o.z - z.z) / (od || 1), S.kb);
              this.emit('strike', { top: o, src: t, skill: S, x: z.x, z: z.z, dmg });
            }
            z.b = S.rate;
          }
          break;
        }
        case 'divide': {
          // c: whom the advancing wall has already hit (one bit a side)
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          const w = wallOf(z);
          if (w.moving) for (const o of this.foes(t)) {
            if (z.c & (1 << o.side) || !targetable(o)) continue;
            const rx = o.x - w.x, rz = o.z - w.z;
            const u = rx * w.nx + rz * w.nz, v = -rx * w.nz + rz * w.nx;
            if (!(Math.abs(v) < S.wall + o.radius * 0.5 && u > -1.2 && u < o.radius + 0.8)) continue;
            z.c |= 1 << o.side;
            const g = o.guard > 0 ? 0.3 : 1;
            const dmg = this.hurt(o, (S.dmg * g * t.blade.atk) / o.blade.def, t, 'divide');
            if (g === 1) this.knock(o, w.nx, w.nz, S.kb, 0.6, 2);
            t.stats.skillHits++;
            this.emit('strike', { top: o, src: t, skill: S, x: o.x, z: o.z, dmg, big: true });
          }
          break;
        }
        case 'keg':
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          // c: hits it can still take, a: time since it last weakened by itself, b: pause before a body can strike it again
          z.a += dt;
          if (z.c > 1 && z.a >= S.decay) { z.a = 0; z.c--; }
          z.b = Math.max(0, z.b - dt);
          // Either top can strike it by running into it. Whoever lands the last blow decides what happens.
          if (z.b <= 0) for (const s of this.tops) {
            if (targetable(s) && s.spin > 0 && Math.hypot(s.x - z.x, s.z - z.z) < 0.9 + s.radius) { z.b = S.touch; this.hitKeg(z, s); break; }
          }
          break;
        case 'feather':
          if (z.t >= z.T || this.result) z.dead = true;
          break;
        case 'realmz': {
          // c: the side of the one shut in with its maker. It lasts until its time is up or either of them is gone.
          const v = this.tops[z.c];
          if (z.t >= z.T || this.result || !v || v.gone || t.gone || v.out || t.out || t.spin <= 0 || v.spin <= 0) {
            this.endZone(z);
            for (const o of this.tops) if (o.realm === t.side + 1) o.realm = 0;
            this.emit('realmEnd', { top: t, target: v, x: z.x, z: z.z });
          }
          break;
        }
        case 'deathgrasp':
        case 'riftz':
          if (z.t < z.T) break;
          z.dead = true;
          if (!this.result) this.lineHit(t, S, z.x, z.z, z.dx, z.dz);
          break;
        case 'workedground':
          if (z.t >= z.T || this.result) this.endZone(z);
          break;
        case 'canister':
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          if (!t.gone && !t.out && Math.hypot(t.x - z.x, t.z - z.z) < z.r + t.radius) { this.endZone(z); this.mend(t, S.heal * t.spinMax); t.shrugCd = Math.max(0, t.shrugCd - S.cut); break; }
          // An enemy that gets to it first simply takes it away: nothing for anyone.
          if (this.enemies(t).some((o) => targetable(o) && Math.hypot(o.x - z.x, o.z - z.z) < z.r + o.radius)) z.dead = true;
          break;
        case 'shovez':
          // SEISMIC SHOVE: the ground comes up and throws whoever is on it the way it was told.
          if (z.t < z.T) break;
          z.dead = true;
          for (const o of this.inZone(z, t, 0.5)) { if (o.guard > 0) continue; this.knock(o, z.dx, z.dz, S.kb, S.tumble, 0.6); t.stats.skillHits++; t.prey = o.side; }
          this.emit('blast', { top: t, skill: S, x: z.x, z: z.z, r: z.r, hit: 0, target: null });
          break;
        case 'boulders':
          // UNRAVELED EARTH: slow to cross on foot, and it goes off under anything thrown or dashing across.
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          for (const o of this.foes(t)) {
            if (!this.inCone({ x: z.x, z: z.z }, o, z.dx, z.dz, S)) continue;
            this.slowBy(o, 0.3, S.slowPct);
            if ((o.dash || o.tumble > 0.05 || o.launch > 0) && o.rockT <= 0 && o.guard <= 0) {
              o.rockT = S.again;
              const dmg = this.hurt(o, (S.dmg * t.blade.atk) / o.blade.def, t, S.id);
              o.dash = null;
              this.stun(o, S.stun);
              t.stats.skillHits++;
              this.emit('strike', { top: o, src: t, skill: S, x: o.x, z: o.z, dmg });
            }
          }
          break;
        case 'weaverz':
          if (z.t >= z.T || this.result) this.endZone(z);
          break;
        case 'lavapool':
          // a: when it erupts; after that it is a pool that burns and slows
          if (z.t >= z.a + S.dur || this.result) { this.endZone(z); break; }
          if (z.t < z.a) break;
          if (!z.c) { z.c = 1; this.burst(t, S, z.x, z.z, z.r); }
          for (const o of this.inZone(z, t, 0.3)) { this.slowBy(o, 0.3, S.slowPct); this.dot(o, (S.dps * dt * t.blade.atk) / o.blade.def, t); }
          break;
        case 'gazeeye':
          // GAZE OF THE ABYSS: it opens, finds whoever is nearest, and fires at them.
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          if (z.t >= S.arm && live && d < z.r + opp.radius * 0.3) {
            const shot = SKILLS.gazeshot;
            this.fire(t, shot, (opp.x - z.x) / (d || 1), (opp.z - z.z) / (d || 1), { x: z.x, z: z.z });
            this.endZone(z);
          }
          break;
        case 'sentry':
          // c: woken, a: when it then runs out, b: time to its next shot
          if (z.t >= z.T || (z.c && z.t >= z.a) || this.result) { this.endZone(z); break; }
          if (live && d < z.r * 0.4 + opp.radius) { this.endZone(z); break; } // run over
          if (!z.c) { if (live && d < S.reach) { z.c = 1; z.a = z.t + S.live; z.b = S.wake; } break; }
          z.b -= dt;
          if (z.b <= 0 && live && d < S.reach + 2) {
            const shot = SKILLS.sentryshot, lead = d / shot.speed;
            const ax = opp.x + opp.vx * lead - z.x, az = opp.z + opp.vz * lead - z.z, n = Math.hypot(ax, az) || 1;
            const p = this.fire(t, shot, ax / n, az / n, { x: z.x, z: z.z });
            if (z.dx >= 1) p.off = Math.round(z.dx) - 1;
            z.b = S.rate;
          }
          break;
        case 'bubbletrap':
          if (z.t >= z.T || this.result) { this.endZone(z); break; }
          if (z.t >= S.arm && live && d < z.r + opp.radius * 0.5 && opp.guard <= 0) {
            const B = SKILLS.bubble;
            this.endZone(z);
            const dmg = this.hurt(opp, (B.dmg * t.blade.atk) / opp.blade.def, t, B.id);
            this.slowBy(opp, B.slow, B.slowPct);
            t.tether = { t: 0, T: B.dur, skill: B, acc: 0, tick: 0, to: opp.side };
            this.emit('say', { top: opp, text: B.tie, tone: '' });
            this.emit('strike', { top: opp, src: t, skill: B, x: opp.x, z: opp.z, dmg });
          }
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
          if (live && d < z.r) this.slowBy(opp, 0.3);
          if (targetable(t) && Math.hypot(t.x - z.x, t.z - z.z) < z.r) this.spring(z);
          break;
        case 'deathbelow': {
          if (z.t < z.T) break;
          z.dead = true;
          // The X: two bars crossing at the spot, turned 45 degrees from the aim.
          const s = Math.SQRT1_2;
          // Everyone on the X is struck: those low enough are finished, the rest are cut.
          const caught = this.result ? [] : this.foes(t).filter((o) => {
            if (!targetable(o)) return false;
            const rx = o.x - z.x, rz = o.z - z.z, pad = o.radius * 0.5;
            const u = (rx * (z.dx - z.dz) + rz * (z.dz + z.dx)) * s, w = (rx * (z.dx + z.dz) + rz * (z.dz - z.dx)) * s;
            return (Math.abs(u) < S.arm + pad && Math.abs(w) < S.width + pad) || (Math.abs(w) < S.arm + pad && Math.abs(u) < S.width + pad);
          });
          let hit = 0, tg = null;
          if (caught.length) {
            const fx = t.x, fz = t.z;
            t.x = z.x; t.z = z.z; t.vx = t.vz = 0; t.cmd = null; t.dash = null;
            this.emit('warp', { top: t, fx, fz });
            for (const o of caught) {
              t.stats.skillHits++;
              if (this.result) break;
              if (o.egg <= 0 && spinRatio(o) < S.line) { this.slay(o, t); continue; }
              hit += this.hurt(o, (S.dmg * (o.guard > 0 ? 0.3 : 1) * t.blade.atk) / o.blade.def, t, S.id);
              tg = tg || o;
            }
          }
          this.emit('blast', { top: t, skill: S, x: z.x, z: z.z, r: z.r, hit, target: hit ? tg : null });
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
    // SPIRALING DESPAIR stays centred on whoever it struck.
    if (S.stick && targetable(opp)) { z.x = opp.x; z.z = opp.z; }
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
      const struck = this.burst(t, S, z.x, z.z, z.r, S.heavier ? { dmg: S.dmg + S.heavier * z.c } : {});
      if (struck && S.heavier) { t.stack++; t.stackT = 12; }
      // CRUSHING MAW drags what it catches to its middle.
      if (struck && S.pullMid && opp.guard <= 0) this.pull(opp, z, S.pullMid);
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
        // HEART ZAPPER: what was taken meanwhile comes back, all of it if the blast caught someone.
        if (S.storeHeal) { this.mend(t, t.store * (hit ? 1 : S.storeHeal)); t.store = 0; t.buff = 0; const k = this.keyOf(t, S.id); if (k) t.re[k] = 0; }
        // INFERNAL CHAINS: whoever is still inside is dragged to the middle.
        if (hit && S.endPull) this.pull(opp, z, S.endPull);
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
      // Only the rim matters: touching it stuns, once each (c: one bit a side for those it has caught).
      if (z.t > S.arm && !this.result) for (const o of this.foes(t)) {
        if (z.c & (1 << o.side) || !targetable(o) || Math.abs(Math.hypot(o.x - z.x, o.z - z.z) - z.r) >= 0.5) continue;
        z.c |= 1 << o.side;
        this.stun(o, S.cage);
        this.hurt(o, (S.dmg * t.blade.atk) / o.blade.def, t, S.id);
      }
      return;
    }
    // CANNON BARRAGE comes down in waves.
    if (S.wave && z.t >= S.wave.first + z.c * S.wave.every) {
      z.c++;
      // Every enemy under it is hit, not only the nearest.
      let hit = 0, tg = null;
      if (live) for (const o of this.foes(t)) {
        if (!targetable(o) || Math.hypot(o.x - z.x, o.z - z.z) >= z.r + o.radius * 0.3) continue;
        hit += this.hurt(o, (S.wave.dmg * (o.guard > 0 ? 0.3 : 1) * t.blade.atk) / o.blade.def, t, S.id);
        t.stats.skillHits++;
        tg = tg || o;
      }
      this.emit('blast', { top: t, skill: S, x: z.x, z: z.z, r: z.r, hit, target: hit ? tg : null });
      this.hitKegs(t, S, (q) => Math.hypot(q.x - z.x, q.z - z.z) < z.r);
    }
    // ONSLAUGHT: between the scythe's cuts, the other hand gets a blow in too.
    const beat = !!S.offEvery && (z.b += dt) >= S.offEvery;
    if (beat) z.b = 0;
    // What a field does to those inside it, it does to every enemy inside.
    for (const o of this.foes(t)) {
      if (o === opp ? !inside : !(live && targetable(o) && Math.hypot(o.x - z.x, o.z - z.z) < z.r + o.radius * 0.3)) continue;
      const d = Math.hypot(o.x - z.x, o.z - z.z);
      this.fieldOn(z, t, o, S, d, dt);
      if (beat) this.offhand(t, o);
    }
    if (!t.out && !t.air && t.spin > 0 && Math.hypot(t.x - z.x, t.z - z.z) < z.r) {
      if (S.regen) { const h = Math.min(S.regen * dt, t.spinMax - t.spin); t.spin += h; z.a += h; z.b += dt; if (z.b >= 1) { if (z.a >= 1) this.emit('heal', { top: t, amount: z.a }); z.a = 0; z.b = 0; } }
    }
    // The current and the pool are for its whole side, not only whoever painted them.
    if (S.hasteIn || S.shieldIn) for (const o of [t, ...this.mates(t)]) {
      if (o.out || o.air || o.spin <= 0 || Math.hypot(o.x - z.x, o.z - z.z) >= z.r) continue;
      if (S.hasteIn) o.haste = Math.max(o.haste, 0.3);
      // POOL OF REFLECTION: a shield that builds while standing in it.
      if (S.shieldIn) { o.shield = Math.min(S.shieldIn.max, Math.max(o.shield, S.shieldIn.first) + S.shieldIn.per * dt); o.shieldT = 0.5; }
    }
  }

  // One step of a field on one enemy standing in it, `d` from its centre.
  fieldOn(z, t, opp, S, d, dt) {
    // Despair deepens: the slow grows with every beat spent inside.
    if (S.slowGrow) this.slowBy(opp, 0.3, Math.min(S.slowMax, S.slowGrow * Math.floor(z.t / 0.25)));
    if (S.slowIn) this.slowBy(opp, 0.3, S.slowPct);
    if (S.dps) this.dot(opp, (S.dps * dt * t.blade.atk) / opp.blade.def, t);
    // SEVERUM drinks what it cuts.
    if (S.leechIn && !this.result) t.spin = Math.min(t.spinMax, t.spin + ((S.dps * dt * t.blade.atk) / opp.blade.def) * S.leechIn);
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

  // LUNAR ARSENAL: the weapon in the other hand (or `wi`, the one mounted on a
  // sentry) lands a light blow of its own on a target the main one has reached.
  // It leaves a sniper's mark where it is: that is for the next skill to set off.
  // `fly`: the blow is seen crossing from one to the other (2: the heavier one the ultimate sends).
  offhand(o, v, wi = o.wo, fly = false) {
    const A = SKILLS.arsenal, F = A.off.fx[wi];
    if (this.result || !F || !targetable(v) || v.guard > 0) return;
    // (The flame's blow is its burst and nothing else: half the rifle's, but for everyone it reaches.)
    const dmg = F.blast ? 0 : this.hurt(v, (A.off.dmg * (F.mul || 1) * o.blade.atk) / v.blade.def, o, 'offhand');
    // The chakram's blow leaves one more circling (the ultimate's, a handful).
    if (F.chak) this.gainChak(o, fly === 2 ? SKILLS.vigil.arm[wi].chak : F.chak);
    if (F.slow) this.slowBy(v, F.slow, F.slowPct);
    if (F.leech) this.mend(o, dmg * F.leech);
    // The flame's blow bursts where it lands: everyone near, the one it struck among them, takes the same.
    // (The ultimate's is a bigger burst.)
    if (F.blast) { const B = fly === 2 ? SKILLS.vigil.arm[wi] : F; this.burst(o, SKILLS[A.weapons[wi]], v.x, v.z, B.blast, { dmg: B.blastDmg, as: {} }); }
    this.emit('strike', { top: v, src: o, skill: SKILLS[A.weapons[wi]], x: v.x, z: v.z, dmg, light: fly !== 2, ...(fly ? { fx: o.x, fz: o.z } : {}), ...(fly === 2 ? { strong: 1 } : {}) });
  }

  // PLASMA FISSION parting: two bolts at right angles to the way it was going.
  splitPlasma(t, x, z, dx, dz, hit) {
    for (const s of [1, -1]) { const p = this.fire(t, SKILLS.plasmashard, -dz * s, dx * s, { x: x + dz * s * 0.9, z: z - dx * s * 0.9, quiet: s < 0 }); p.hit = hit; }
  }
  // ORGANIC DECONSTRUCTION: the third skill to land on a top takes it apart.
  decon(v, from) {
    const D = from.blade.decon;
    if (!D || this.result) return;
    v.deN = v.deT > 0 ? v.deN + 1 : 1; v.deT = D.keep;
    if (v.deN < D.n) return;
    v.deN = v.deT = 0;
    const dmg = this.hurt(v, D.dmg * from.blade.atk, from, 'decon');
    this.emit('strike', { top: v, src: from, skill: SKILLS.decon, x: v.x, z: v.z, dmg });
  }
  // A top that shrugs off the first thing that would hold it, every so often.
  shrug(v) {
    const G = v.blade.shrug;
    if (!G || v.shrugCd > 0 || this.result) return false;
    v.shrugCd = G.cd;
    v.spin = Math.max(1, v.spin * (1 - G.pay));
    // What it shook off lands nearby; picking it up gives some back.
    const a = this.rng() * Math.PI * 2, lim = ARENA.R - 2;
    let x = v.x + Math.cos(a) * G.far, z = v.z + Math.sin(a) * G.far;
    const r = Math.hypot(x, z); if (r > lim) { x *= lim / r; z *= lim / r; }
    this.zone(v, SKILLS.canister, x, z, null, true);
    this.emit('say', { top: v, text: 'IMMUNE', tone: 'gold' });
    return true;
  }

  // PARALLEL CONVERGENCE going off because its owner stepped into it.
  spring(z) {
    if (z.dead) return;
    const t = z.owner, S = z.skill;
    this.endZone(z);
    // Every enemy standing in it is stunned.
    if (!this.result) for (const o of this.foes(t)) if (targetable(o) && Math.hypot(o.x - z.x, o.z - z.z) < z.r + o.radius * 0.3 && o.guard <= 0) { this.stun(o, S.stun); t.stats.skillHits++; }
    t.shield = S.shield; t.shieldT = 2;
    this.emit('blast', { top: t, skill: S, x: z.x, z: z.z, r: z.r, hit: 0, target: null });
  }

  // Anything that does damage takes one point off a keg. Its owner's last blow
  // sets it off; anyone else's just breaks it.
  hitKeg(z, by) {
    if (z.dead) return;
    z.c--;
    if (z.c > 0) { this.emit('bump', { top: by, x: z.x, z: z.z, nx: 0, nz: 1, power: 6 }); return; }
    if (by === z.owner) { this.blowKeg(z); return; }
    this.endZone(z);
    this.emit('blast', { top: by, skill: z.skill, x: z.x, z: z.z, r: 1.4, hit: 0, target: null });
  }
  // Every keg an area of effect reaches.
  // An AUTO TURRET takes a blow: from a body, or from anything that would have hurt a top standing there.
  hitTurret(z, by) {
    if (z.dead) return;
    z.c += 2;
    const left = z.skill.hp - (z.c >> 1);
    this.emit('blast', { top: by, skill: z.skill, x: z.x, z: z.z, r: left > 0 ? 0.9 : 1.6, hit: 0, target: null });
    if (left <= 0) this.endZone(z);
  }

  hitKegs(by, S, inside) {
    // (The other side's turrets are struck by whatever sweeps over them, as the kegs are.)
    if (S.dmg || S.dps || S.land) for (const q of this.zones) if (q.kind === 'turret' && !q.dead && q.owner.team !== by.team && q.owner.realm === by.realm && inside(q)) this.hitTurret(q, by);
    if (S.id === 'keg') return;
    for (const q of this.zones) if (q.kind === 'keg' && !q.dead && inside(q)) this.hitKeg(q, by);
  }

  // A powder keg going off, and setting off its neighbours.
  blowKeg(z) {
    if (z.dead) return;
    const t = z.owner, S = z.skill;
    this.endZone(z);
    t.haste = Math.max(t.haste, S.blowHaste);
    this.burst(t, S, z.x, z.z, S.aoe);
    // Two kegs whose blasts overlap at all are close enough.
    for (const q of this.own(t, 'keg')) if (Math.hypot(q.x - z.x, q.z - z.z) < S.aoe * 2) this.blowKeg(q);
  }

  collide(a, b) {
    if (!targetable(a) || !targetable(b)) return;
    if (a.realm !== b.realm) return;
    // Team mates roll through each other, unless friendly fire is on.
    if (a.team === b.team && !this.ff) return;
    let nx = b.x - a.x, nz = b.z - a.z;
    const d = Math.hypot(nx, nz), min = a.radius + b.radius;
    if (d >= min) return;
    // BACK TOSS, waiting: this touch is the throw (not of a guard, nor of an egg).
    for (const [s, v] of [[a, b], [b, a]]) {
      if (!(s.grab > 0) || this.result || v.guard > 0 || v.egg > 0 || s.stun > 0 || s.up > 0) continue;
      s.grab = 0;
      this.toss(s, v);
      return;
    }
    // CEASE AND DESIST: anyone but its target is knocked aside, and the charge goes on.
    for (const [s, v] of [[a, b], [b, a]]) {
      const h = s.dash;
      if (!h || !h.skill.homing || this.result) continue;
      if (v.side === (h.home ?? s.prey)) continue;
      if (!(h.bumped & (1 << v.side))) {
        h.bumped |= 1 << v.side;
        const D = h.skill, g = v.guard > 0 ? 0.3 : 1, prey = s.prey;
        const dmg = this.hurt(v, (D.dmg * D.aside * g * s.blade.atk) / v.blade.def, s, D.id);
        s.prey = prey;
        // To whichever side of the charge they stood on.
        const side = (v.x - s.x) * -h.dz + (v.z - s.z) * h.dx >= 0 ? 1 : -1;
        if (g === 1) this.knock(v, -h.dz * side, h.dx * side, D.asideKb, 0.4, 0.6);
        s.stats.skillHits++;
        this.emit('strike', { top: v, src: s, skill: D, x: v.x, z: v.z, dmg });
      }
      return;
    }
    // Some dashes go straight through, cutting once on the way.
    if (((a.dash && a.dash.skill.through) || (b.dash && b.dash.skill.through)) && a.guard <= 0 && b.guard <= 0) {
      for (const s of [a, b]) {
        const h = s.dash, v = (s === a ? b : a);
        if (!h || !h.skill.through || h.hit || !h.skill.pass || this.result) continue;
        h.hit = true;
        const dmg = this.hurt(v, (h.skill.pass * (h.again ? h.skill.againMul || 1 : 1) * s.blade.atk) / v.blade.def, s, h.skill.id);
        this.affect(s, v, h.skill, h.dx, h.dz);
        // Cutting through opens one more dash.
        if (h.skill.reHit && !h.again) { const k = this.keyOf(s, h.skill.id); if (k) s.re[k] = h.skill.reHit; }
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
      const g = a.guard > 0 ? a : b, v = (g === a ? b : a);
      kind = 'parry'; power += 10;
      thrown(g, v, 11.5, 0.65);
      g.guard = 0; g.stats.parries++;
      this.emit('guardEnd', { top: g });
      bonus(g, v, SKILLS.aegis.parryDmg, 0.5);
    } else if (!!a.dash !== !!b.dash && (a.dash || b.dash).skill.dmg) {
      const s = a.dash ? a : b, v = (s === a ? b : a), h = s.dash, D = h.skill;
      kind = 'dash'; power += 14;
      bonus(s, v, D.dmg * (h.pow || 1) * (D.perBleed ? 1 + D.perBleed * v.bleed : 1), D.keep ?? 1, !!D.trueDmg);
      // Landing it hands back part of what is left of its cooldown.
      if (D.refundHit) { const k = this.keyOf(s, D.id); if (k) s.cd[k] *= 1 - D.refundHit; }
      thrown(s, v, D.kb, 0.55);
      s.stats.skillHits++;
      this.affect(s, v, D, 0, 0, false);
      // BITE RUSH: the bite feeds it.
      if (D.hitHeal) this.mend(s, D.hitHeal * s.spinMax);
      // SHIFTING SANDS: the emperor arrives behind a shield, the target goes up.
      // SHIFTING SANDS: running into someone hands the emperor one more soldier to set.
      if (D.stockHit) { const K = KEYS.map((k) => skillOf(s, k)).find((q) => q.stock); if (K) s.stk = Math.min(K.stock.max, s.stk + 1); }
      // Carried along the line of the charge, toward whatever wall is there.
      if (D.carry && !fixed(v)) { const k = Math.hypot(v.vx, v.vz); v.vx = h.dx * k; v.vz = h.dz * k; v.pin = D.carry; v.launch = Math.max(v.launch, 1); }
    } else if (a.empower > 0 !== b.empower > 0 && ((a.empower > 0 ? a : b).empS || (a.empower > 0 ? a : b).blade.emp)) {
      const s = a.empower > 0 ? a : b, v = (s === a ? b : a), E = s.empS || s.blade.emp;
      kind = 'empower'; power += 10;
      thrown(s, v, E.kb, 0.45);
      // Some skills empower more than one hit.
      if (s.empN > 1) s.empN--; else { s.empower = 0; s.empN = 0; }
      s.stats.skillHits++;
      // Some blows land harder on a target that is already held (stunned or in the air).
      const held = E.heldMul && (v.stun > 0 || v.up > 0) ? E.heldMul : 1;
      bonus(s, v, E.bonus * held + (E.missing || 0) * (1 - spinRatio(v)) + (E.selfMiss || 0) * Math.min(1, (1 - spinRatio(s)) / 0.7), 1);
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
    for (const [s, v, d0] of [[a, b, dmgB], [b, a, dmgA]]) {
      if (this.result) break;
      // LIGHTSLINGER: the hit after a skill lands a second time, lighter.
      if (s.dbl > 0 && s.blade.dbl) {
        s.dbl = 0;
        const d2 = this.hurt(v, d0 * s.blade.dbl.mul, s, 'clash');
        this.emit('strike', { top: v, src: s, skill: SKILLS.lightslinger, x: v.x, z: v.z, dmg: d2 });
        const ek = this.keyOf(s, s.blade.dbl.cuts);
        if (ek) s.cd[ek] = Math.max(0, s.cd[ek] - s.blade.dbl.cut);
      }
      // BLOOD FRENZY: its bites catch whoever else is close.
      const F = s.buff > 0 && s.blade.buff && s.blade.buff.frenzy;
      if (F) for (const o of this.foes(s)) if (o !== v && targetable(o) && Math.hypot(o.x - s.x, o.z - s.z) < F) this.hurt(o, (d0 * 0.6 * 1) , s, 'clash');
    }
    // DEADLY PLUMAGE: every body hit throws a feather straight through the target.
    for (const [s, v] of [[a, b], [b, a]]) {
      const P = s.buff > 0 && s.blade.plume;
      if (P && !this.result) { const sx = s === a ? nx : -nx, sz = s === a ? nz : -nz; this.fire(s, SKILLS[P], sx, sz, { x: v.x, z: v.z, quiet: true }); }
    }
    // A mark that a body hit sets off as well as a skill.
    for (const [s, v] of [[a, b], [b, a]]) {
      if (v.mark > 0 && !v.markHold && s.blade.markOnClash) { v.mark = 0; const d2 = this.hurt(v, (SKILLS.sigil.pop * s.blade.atk) / v.blade.def, s, 'sigil'); this.emit('strike', { top: v, src: s, skill: SKILLS.sigil, x: v.x, z: v.z, dmg: d2 }); }
    }
    this.emit('clash', {
      x: (a.x + b.x) / 2, z: (a.z + b.z) / 2, nx, nz, power, kind, src,
      a, b, dmgA, dmgB,
    });
  }

  // Solid walls on the floor. Ice stops everyone; the emperor's line stops
  // only the other side, and shoves it along while it is still advancing.
  barriers(t) {
    if (t.air || t.out || t.blink || (t.dash && t.dash.skill.unstoppable)) return;
    for (const z of this.zones) {
      const S = z.skill;
      // (The emperor's line lets its own side through, not only the emperor.)
      if (z.dead || !S.solid || z.owner.realm !== t.realm || (z.kind === 'divide' && z.owner.team === t.team)) continue;
      const w = wallOf(z);
      const rx = t.x - w.x, rz = t.z - w.z;
      const u = rx * w.nx + rz * w.nz, v = -rx * w.nz + rz * w.nx;
      const th = WALL_HALF + t.radius;
      if (Math.abs(v) > (z.half ?? S.wall) + t.radius * 0.6 || Math.abs(u) >= th) continue;
      if (S.grown && z.owner === t && t.dash) continue; // its maker slides along it
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

  // REALM OF DEATH opens round the two of them, as near the middle between
  // them as leaves the whole ring inside the arena (so nobody in it can be thrown out).
  openRealm(t, v) {
    const S = SKILLS.realm, Z = SKILLS.realmz;
    if (!v || v.gone || v.out || v.realm || t.realm || this.result) return;
    let x = (t.x + v.x) / 2, z = (t.z + v.z) / 2;
    const lim = Math.max(0, ARENA.R - Z.aoe), r = Math.hypot(x, z);
    if (r > lim) { x *= lim / r; z *= lim / r; }
    // A link either of them had with someone who is staying behind is cut.
    for (const o of this.tops) {
      const th = o.tether, pair = (o === t && th && th.to === v.side) || (o === v && th && th.to === t.side);
      if (th && !pair && (o === t || o === v || th.to === t.side || th.to === v.side)) { o.tether = null; this.emit('tetherEnd', { top: o, broke: true }); }
    }
    t.realm = v.realm = t.side + 1;
    const q = this.zone(t, Z, x, z, { c: v.side }, true);
    this.emit('realm', { top: t, target: v, x, z, r: q.r });
    this.emit('say', { top: v, text: S.en, tone: 'red' });
  }

  // DRAGON'S RAGE: the top that was kicked hits everything in its way. Team
  // mates pass through each other in the ordinary way, so this is checked apart
  // from collisions; the one it strikes is hurt and thrown into the air.
  bowl(t, dt) {
    t.kickT -= dt;
    const by = this.tops[t.kickBy], S = SKILLS.dragonrage;
    if (!by || this.result || t.out || t.gone || t.tumble <= 0) { t.kickT = 0; return; }
    for (const o of this.foes(by)) {
      if (o === t || t.kickHit & (1 << o.side) || !targetable(o) || o.realm !== t.realm || Math.hypot(o.x - t.x, o.z - t.z) > t.radius + o.radius) continue;
      t.kickHit |= 1 << o.side;
      const dmg = this.hurt(o, (S.pass * (o.guard > 0 ? 0.4 : 1) * by.blade.atk) / o.blade.def, by, S.id);
      if (o.guard <= 0) this.lift(o, S.passUp);
      by.stats.skillHits++;
      this.emit('strike', { top: o, src: by, skill: S, x: o.x, z: o.z, dmg });
    }
  }

  // The ring of a realm holds the two inside it.
  confine(t) {
    if (!t.realm || t.out) return;
    const q = this.zones.find((z) => z.kind === 'realmz' && !z.dead && z.owner.side === t.realm - 1);
    if (!q) { t.realm = 0; return; }
    const lim = q.r - t.radius;
    // A leap that would come down outside lands at the edge instead.
    if (t.air) { const a = t.air, d = Math.hypot(a.tx - q.x, a.tz - q.z); if (d > lim) { a.tx = q.x + ((a.tx - q.x) / d) * lim; a.tz = q.z + ((a.tz - q.z) / d) * lim; } return; }
    const dx = t.x - q.x, dz = t.z - q.z, d = Math.hypot(dx, dz);
    if (d <= lim) return;
    const nx = dx / d, nz = dz / d, vn = t.vx * nx + t.vz * nz;
    t.x = q.x + nx * lim; t.z = q.z + nz * lim;
    if (t.blink) { t.blink.t = 0; return; }
    if (vn <= 0) return;
    t.vx -= 1.5 * vn * nx; t.vz -= 1.5 * vn * nz;
    this.stopDash(t);
    if (vn > 5) this.emit('bump', { top: t, x: t.x + nx * t.radius, z: t.z + nz * t.radius, nx: -nx, nz: -nz, power: vn });
  }

  walls(t) {
    if (t.out) return;
    let c;
    if (t.air) {
      if (t.air.skill.id !== 'fling') return;
      const contact = wallContact(t);
      if (!contact || (contact.open ? contact.r <= ARENA.R + 0.15 : contact.vn <= 0)) return;
      // End the flight at contact, then use the ordinary wall / ring-out rules.
      const vx = t.vx, vz = t.vz;
      t.air.tx = t.x; t.air.tz = t.z;
      this.land(t, this.other(t));
      t.vx = vx; t.vz = vz;
      c = contact;
    }
    // Riding the rim: the ride itself keeps it on the wall.
    if (t.dash && t.dash.skill.slide) return;
    c = c || wallContact(t);
    if (c && c.open) {
      // No wall here. A warp stops at the edge; anything else that crosses it is out.
      if (t.blink) { const lim = ARENA.R - t.radius; t.x = c.nx * lim; t.z = c.nz * lim; t.blink.t = 0; return; }
      if (c.r > ARENA.R + 0.15 && !this.result && !(t.egg > 0)) {
        if (t.tether) this.emit('tetherEnd', { top: t, broke: true });
        if (t.orbs) this.emit('orbsEnd', { top: t });
        t.out = { t: 0, y: 0, vy: 2 + Math.max(0, c.vn) * 0.25 };
        t.cmd = t.dash = t.cast = t.charge = t.tether = t.orbs = t.chan = null; t.guard = 0; t.toggle = false;
        this.emit('ringout', { top: t, x: t.x, z: t.z, nx: c.nx, nz: c.nz, power: Math.max(6, c.vn) });
        this.eliminate(t, 'over', this.lastBy(t));
      } else if (t.egg > 0 && c.r > ARENA.R - t.radius) { const lim = ARENA.R - t.radius; t.x = c.nx * lim; t.z = c.nz * lim; }
      return;
    }
    if (!c || c.vn <= 0) return;
    if (t.blink) { t.blink.t = 0; return; }
    if (!this.result && t.launch > 0 && c.vn > ringOutAt(t) && !(t.egg > 0)) {
      if (t.tether) this.emit('tetherEnd', { top: t, broke: true });
      if (t.orbs) this.emit('orbsEnd', { top: t });
      t.out = { t: 0, y: 0, vy: 7 + c.vn * 0.35 };
      t.cmd = t.dash = t.cast = t.charge = t.tether = t.orbs = t.chan = null; t.guard = 0; t.toggle = false;
      this.emit('ringout', { top: t, x: t.x, z: t.z, nx: c.nx, nz: c.nz, power: c.vn });
      this.eliminate(t, 'over', this.lastBy(t));
      return;
    }
    if (t.dash && t.dash.skill.slides && t.launch <= 0) { this.slideOn(t, t.dash, c.nx, c.nz); return; }
    bounce(t, c);
    this.stopDash(t);
    if (t.pin > 0 && c.vn > 3) {
      const by = this.lastBy(t) || this.other(t), P = by.blade.pin;
      t.pin = 0;
      if (P) { this.hurt(t, (P.dmg * by.blade.atk) / t.blade.def, by, 'pin'); this.stun(t, P.stun); }
    }
    let dmg = 0;
    if (c.vn > 4) {
      dmg = ((c.vn - 4) * (t.launch > 0 ? 2.2 : 1.0)) / t.blade.def;
      dmg = this.hurt(t, dmg, t.launch > 0 ? this.lastBy(t) || this.other(t) : null, 'wall');
    }
    if (c.vn > 2) this.emit('wall', { top: t, x: t.x + c.nx, z: t.z + c.nz, nx: c.nx, nz: c.nz, power: c.vn, dmg, slam: t.launch > 0 });
  }

  // A thrown orb arriving: the field it carries opens there, and its key can now set it off.
  open(p) {
    const Z = SKILLS[p.skill.opens], o = p.owner, k = this.keyOf(o, Z.id);
    this.zone(o, Z, p.x, p.z);
    if (k && Z.re) o.re[k] = Z.dur;
  }

  // FLASH FROST going off: on the recast, or by itself at the end of its path.
  shatter(p) {
    p.dead = true;
    this.unre(p.owner, 'flashfrost');
    this.burst(p.owner, SKILLS.shatter, p.x, p.z, SKILLS.shatter.aoe);
  }

  // True if a wall stands where the shot is: ice stops all of them, a wind
  // wall only the other side's.
  // More chakrams (or none: one that struck has come back). Either way they are good for a while longer.
  gainChak(t, n) {
    const C = SKILLS.arsenal.chak;
    t.chak = Math.min(C.max, t.chak + n);
    t.chakT = C.dur;
  }

  // BACK TOSS: over the shoulder, so the target lands on the far side of the thrower.
  toss(t, opp) {
    const S = SKILLS.fling;
    let dx = t.x - opp.x, dz = t.z - opp.z;
    const d = Math.hypot(dx, dz) || 1;
    let x = t.x + (dx / d) * S.dist, z = t.z + (dz / d) * S.dist;
    opp.air = { t: 0, T: S.air, sx: opp.x, sz: opp.z, tx: x, tz: z, skill: S, by: t.side };
    opp.cmd = opp.dash = opp.cast = opp.chan = opp.charge = null; opp.vx = opp.vz = 0; opp.up = 0;
    this.emit('fling', { top: t, target: opp, tx: x, tz: z });
  }

  // A chakram that struck nothing does not come back.
  lostChak(p) {
    if (p.chakOf === undefined) return;
    const o = this.tops[p.chakOf];
    p.chakOf = undefined;
    if (o && o.chak > 0) o.chak--;
  }

  stopped(p) {
    for (const z of this.zones) {
      if (z.dead) continue;
      // A whirl of blades cuts down whatever flies into it.
      // (Nothing of another realm is in its way at all.)
      if (z.owner.realm !== p.owner.realm) continue;
      // A whirl of blades cuts down what the other side sends into it; its own side's shots pass.
      if (z.skill.eat && z.owner.team !== p.owner.team && Math.hypot(p.x - z.x, p.z - z.z) < z.r) return true;
      if (!(z.kind === 'icewall' || (z.kind === 'windwall' && z.owner.team !== p.owner.team))) continue;
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
    if (S.far) k *= 1 + S.far * clamp((S.range - p.left) / (S.farAt || S.range), 0, 1);
    // A share of the spin the target still has, if that is more.
    if (S.curPct) k = Math.max(k, (v.spin * S.curPct * v.blade.def) / p.dmg);
    if (S.id === 'threadrock') { if (o.stack > 0) k *= S.next; o.stack++; o.stackT = 1.5; }
    if (p.back && S.backMul) k *= S.backMul;
    if (p.back && S.backTrue) k *= v.blade.def; // the way back ignores defence
    // Caught out: struck by this top's own attacks a moment ago.
    // MICRO-ROCKETS: only the first of a volley hits in full, and each one charges the turrets' lasers.
    if (S.id === 'rockets') {
      if (o.stack > 0) k *= S.next;
      o.stack++; o.stackT = 1.5;
      for (const q of this.own(o, 'turret')) q.dz = Math.min(1, q.dz + S.charge);
    }
    // (Its own side's attacks count: a team mate's blow sets the target up as well.)
    const hb = v.lastHit && this.tops[v.lastHit.by];
    const marked = !!hb && hb.team === o.team && this.time - v.lastHit.time < (S.markT || 0);
    // Each quill after the first cuts a little less.
    if (S.id === 'quill') k *= Math.max(0.1, 1 - S.fall * (v.quillT > 0 ? v.quills : 0));
    const dmg = this.hurt(v, (p.dmg * k) / v.blade.def, o, S.id);
    // TIMEWINDER stops where it hits and hangs there as a slowing field.
    if (S.crawl && !p.back && !p.crawl) { p.crawl = true; p.speed = S.crawl; p.left = S.crawl * S.linger; }
    o.x2 = !!p.x2;
    this.affect(o, v, S, p.dx, p.dz);
    o.x2 = false;
    // A chakram that strikes is seen flying back to the hand that threw it.
    if (p.chakOf !== undefined) { const h = this.tops[p.chakOf]; p.chakOf = undefined; if (h && !h.gone) { this.gainChak(h, 0); this.emit('strike', { top: h, src: h, skill: S, x: h.x, z: h.z, dmg: 0, light: true, back: 1, fx: v.x, fz: v.z }); } }
    // LUNAR ARSENAL: the other hand follows up, or the weapon mounted on a sentry does.
    if (S.offhand) this.offhand(o, v, o.wo, true);
    if (p.off !== undefined) this.offhand(o, v, p.off);
    // Dragged in last, so a stun on the same hit does not stop the drag.
    if (S.chain) this.pull(v, o, S.pull, S.pullDist);
    if (S.id === 'galeq') { o.stack = Math.min(S.stacks, o.stack + 1); o.stackT = S.keep; }
    if (S.id === 'flourish' && marked) this.snare(v, S.root);
    if (S.tie) {
      o.tether = { t: 0, T: S.dur, skill: S, acc: 0, tick: 0, to: v.side };
      this.emit('say', { top: v, text: S.tie, tone: '' });
    }
    if (S.refund) for (const k of KEYS) o.cd[k] = Math.max(0, o.cd[k] - S.refund);
    // The further it flew, the longer the stun.
    if (S.stunFar) this.stun(v, S.stunFar[0] + (S.stunFar[1] - S.stunFar[0]) * clamp((S.range - p.left) / S.range, 0, 1));
    if (S.id === 'plasmafission') { this.splitPlasma(o, p.x, p.z, p.dx, p.dz, 1 << v.side); const k2 = this.keyOf(o, S.id); if (k2) o.re[k2] = 0; }
    if (S.flyTo && !o.air && !o.out) {
      // CERTAIN DEATH: nothing stops it getting there, and then the hunt is on.
      const L = SKILLS[S.flyTo];
      o.air = { t: 0, T: L.air, sx: o.x, sz: o.z, tx: v.x, tz: v.z, skill: L, by: o.side, to: v.side };
      o.cmd = o.dash = null; o.stun = o.snare = o.slow = o.up = 0;
      o.buff = S.frenzy; o.hema = true;
      this.emit('leap', { top: o, tx: v.x, tz: v.z, T: L.air, skill: L });
    }
    if (S.refundSelf) { const k2 = this.keyOf(o, S.id); if (k2) o.cd[k2] *= 1 - S.refundSelf; }
    if (S.refundKey) for (const k in S.refundKey) o.cd[k] = Math.max(0, o.cd[k] - S.refundKey[k]);
    // An overcharge is kept going by landing shots.
    if (o.buff > 0 && o.blade.buff && o.blade.buff.extendTo) o.buff = o.blade.buff.extendTo;
    if (S.reOnHit) { const k = this.keyOf(o, S.id); if (k) o.re[k] = S.reOnHit; }
    // GRAVITUM: while its slow lasts, the same key roots the target.
    if (S.eclipse) { const k = KEYS.find((q) => skillOf(o, q).weapons); if (k && o.wm === S.weapon) o.re[k] = S.eclipse; }
    // CALIBRUM: while its mark lasts, the same key fires the follow-up.
    if (S.again) { const k = KEYS.find((q) => skillOf(o, q).weapons); if (k && o.wm === S.weapon) o.re[k] = S.mark; }
    if (S.permHit && o.perm < S.permHit) { o.perm++; this.emit('say', { top: o, text: '+' + o.perm, tone: 'gold' }); }
    if (S.spawn) this.zone(o, SKILLS[S.spawn], v.x, v.z);
    // (One that bursts only on whoever it strikes bursts round that top, not round where the two met.)
    const bx = S.onHit ? v.x : p.x, bz = S.onHit ? v.z : p.z;
    if (S.splash) this.burst(o, S, bx, bz, S.splash, { dmg: S.splashDmg, as: {} });
    // KEEPER'S VERDICT: whoever stands close to the one it struck is sent flying with it.
    if (S.around) for (const q of this.foes(o)) {
      if (q === v || !targetable(q) || Math.hypot(q.x - v.x, q.z - v.z) > S.around) continue;
      const g = q.guard > 0 ? 0.3 : 1, d2 = this.hurt(q, (p.dmg * g) / q.blade.def, o, S.id);
      if (g === 1) this.affect(o, q, S, p.dx, p.dz);
      o.stats.skillHits++;
      this.emit('strike', { top: q, src: o, skill: S, x: q.x, z: q.z, dmg: d2 });
    }
    // MOONLIGHT VIGIL does something more for each weapon in hand.
    if (S.id === 'vigil') {
      // The weapon in hand follows up on everyone the burst caught, as it would from the other hand, and harder.
      // (The healing comes once.)
      const A = S.arm[o.wm], k = KEYS.find((q) => skillOf(o, q).weapons);
      if (A.heal) this.mend(o, A.heal);
      for (const q of this.foes(o)) {
        if (!targetable(q) || (q !== v && Math.hypot(q.x - bx, q.z - bz) >= S.splash + q.radius * 0.5)) continue;
        this.offhand(o, q, o.wm, 2);
        // (The rifle's lands twice.)
        if (A.twice) { o.echo = o.echo || { t: A.twice, wi: o.wm, to: [] }; o.echo.to.push(q.side); }
        if (A.slow) { this.slowBy(q, A.slow, A.slowPct); if (k) o.re[k] = A.slow; }
      }
    }
    // The third quill to land pins the target.
    if (S.id === 'quill') { v.quills = v.quillT > 0 ? v.quills + 1 : 1; v.quillT = 1.5; if (v.quills === 3) this.snare(v, S.root); }
    // Only one blade of a wind slash can land.
    if (S.id === 'windslash') for (const q of this.projectiles) if (q !== p && q.skill === S && q.owner === o) q.dead = true;
    o.stats.skillHits++;
    if (S.pierce) p.hit |= 1 << v.side; else p.dead = true;
    this.emit('projHit', { proj: p, top: v, x: p.x, z: p.z, dx: p.dx, dz: p.dz, dmg });
  }

  updateProjectiles(dt) {
    for (const p of this.projectiles) {
      if (p.dead) continue;
      const st = p.speed * dt, S = p.skill;
      SCOPE = p.owner.realm;
      if (p.back) {
        // On its way home: it steers at its owner and is caught on arrival.
        const o = p.owner, hx = o.x - p.x, hz = o.z - p.z, hd = Math.hypot(hx, hz);
        if (hd < 1.3 || o.out) { p.dead = true; if (S.shieldAdd && !o.out) this.shieldUp(o, S); continue; }
        p.dx = hx / hd; p.dz = hz / hd;
      }
      p.x += p.dx * st; p.z += p.dz * st; p.left -= st;
      // PRISMATIC BARRIER: team mates the wand passes are shielded too, once on the way out and once on the way back.
      if (S.shieldAdd) for (const q of this.mates(p.owner)) {
        if (p.hit & (1 << q.side) || !targetable(q) || Math.hypot(q.x - p.x, q.z - p.z) > p.r + q.radius) continue;
        p.hit |= 1 << q.side;
        this.shieldUp(q, S);
      }
      if (p.crawl) for (const q of this.foes(p.owner)) if (targetable(q) && Math.hypot(q.x - p.x, q.z - p.z) < S.field) this.slowBy(q, 0.3, S.fieldPct);
      // Whichever enemy it is touching and has not yet gone through.
      const v = this.foes(p.owner).find((q) => targetable(q) && !(p.hit & (1 << q.side)) && Math.hypot(q.x - p.x, q.z - p.z) < p.r + q.radius) || this.other(p.owner);
      // A shot strikes any keg it passes; the captain's own pistol shot stops there.
      const keg = this.zones.find((q) => q.kind === 'keg' && !q.dead && q.id !== p.keg && Math.hypot(q.x - p.x, q.z - p.z) < 1.2 + p.r);
      // And any turret of the other side's, once each (the shot goes on).
      if (!S.friendly && !p.back) for (const q of this.zones) {
        if (q.kind !== 'turret' || q.dead || q.owner.team === p.owner.team || q.owner.realm !== p.owner.realm || (p.tur && p.tur.includes(q.id)) || Math.hypot(q.x - p.x, q.z - p.z) > 1 + p.r) continue;
        (p.tur = p.tur || []).push(q.id);
        this.hitTurret(q, p.owner);
      }
      if (keg) {
        p.keg = keg.id;
        this.hitKeg(keg, p.owner);
        if (S.id === 'parrrley') { p.dead = true; continue; }
      }
      if (this.stopped(p)) {
        p.dead = true;
        this.lostChak(p);
        if (S.re) this.unre(p.owner, S.id);
        this.emit('projEnd', { proj: p, x: p.x, z: p.z });
      } else if (!this.result && !(p.hit & (1 << v.side)) && !S.friendly && !v.gone && (this.ff || v.team !== p.owner.team) && v !== p.owner && targetable(v) && Math.hypot(v.x - p.x, v.z - p.z) < p.r + v.radius) {
        if (v.guard > 0) {
          // Guard sends it straight back.
          this.lostChak(p);
          p.owner = v; p.dx = -p.dx; p.dz = -p.dz; p.left = S.range; p.dmg *= 1.2;
          v.stats.parries++;
          this.emit('reflect', { top: v, proj: p, x: p.x, z: p.z });
          continue;
        }
        this.projHit(p, v);
      } else if (p.left <= 0 || Math.hypot(p.x, p.z) > ARENA.R + 0.5) {
        if (S.id === 'flashfrost') this.shatter(p);
        else if (S.crawl && !p.crawl && !p.back) { p.crawl = true; p.speed = S.crawl; p.left = S.crawl * S.linger; }
        else if (S.ret && !p.back) { p.back = true; p.crawl = false; p.hit = 0; p.left = 60; p.speed = S.speed * 1.3; }
        else {
          p.dead = true;
          this.lostChak(p);
          // A star that met nothing waits where it stopped, to be sent on.
          // (Just inside the wall if it flew that far, so it can be seen waiting there.)
          if (S.rest) { const k = this.keyOf(p.owner, S.id), lim = ARENA.R - 0.6, pr = Math.hypot(p.x, p.z), f = pr > lim ? lim / pr : 1; this.zone(p.owner, SKILLS[S.rest], p.x * f, p.z * f, null, true); if (k) p.owner.re[k] = SKILLS[S.rest].dur; }
          // A bubble that met nothing settles as a trap.
          if (S.trap && Math.hypot(p.x, p.z) < ARENA.R) this.zone(p.owner, SKILLS[S.trap], p.x, p.z, null, true);
          if (S.feather && Math.hypot(p.x, p.z) < ARENA.R) this.zone(p.owner, SKILLS.feather, p.x, p.z, null, true);
          if (S.opens) this.open(p);
          // (Some only burst on whoever they strike: at the wall, or spent, they simply go out.)
          if (S.splash && !S.onHit) this.burst(p.owner, S, p.x, p.z, S.splash, { dmg: S.splashDmg, as: {} });
          this.emit('projEnd', { proj: p, x: p.x, z: p.z });
        }
      }
    }
    SCOPE = -1;
    if (this.projectiles.some((p) => p.dead)) this.projectiles = this.projectiles.filter((p) => !p.dead);
  }
}
