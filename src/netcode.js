// Wire formats for online play.
//
// Snapshots: the whole match state packed into a few hundred bytes of quantised
// binary, sent many times a second over an unreliable channel. A lost one is
// simply replaced by the next.
// Events: one-off happenings (hits, casts, finishes) as small JSON, sent
// reliably, with object references swapped for ids.
import { SKILLS, KEYS } from './config.js';
import { initZone } from './sim.js';

export const PROTOCOL = 9;
export const PKT_SNAPSHOT = 1, PKT_PING = 2, PKT_PONG = 3;

const SKILL_IDS = Object.keys(SKILLS);
const KINDS = ['over', 'burst', 'spin', 'time'];
const POS = 2000, VEL = 400, DIR = 30000;
const F_CMD = 1, F_DASH = 2, F_BLINK = 4, F_AIR = 8, F_OUT = 16, F_CHARGE = 32, F_ORBS = 64, F_TETHER = 128;
const G_TOGGLE = 1, G_EGGUSED = 2, G_CHAN = 4, G_RET = 8, G_DASHHIT = 16, G_FEAR = 32, G_HOLD = 64, G_RET2 = 128;
const TAU = Math.PI * 2;
// The gauge travels as one byte. "Full" gets a value of its own: scaling 100
// into a byte and back lands a hair under 100, and the skill needs exactly 100.
const ULT_FULL = 255;

const skillAt = (i) => SKILLS[SKILL_IDS[i]];
const skillNo = (S) => SKILL_IDS.indexOf(S.id);
const clampInt = (v, lo, hi) => { v = Math.round(v); return v < lo ? lo : v > hi ? hi : v; };

class Writer {
  constructor(size = 4096) { this.view = new DataView(new ArrayBuffer(size)); this.o = 0; }
  u8(v) { this.view.setUint8(this.o, clampInt(v, 0, 255)); this.o += 1; }
  u16(v) { this.view.setUint16(this.o, clampInt(v, 0, 65535)); this.o += 2; }
  i16(v) { this.view.setInt16(this.o, clampInt(v, -32768, 32767)); this.o += 2; }
  f32(v) { this.view.setFloat32(this.o, v); this.o += 4; }
  done() { return this.view.buffer.slice(0, this.o); }
}

class Reader {
  constructor(buf) { this.view = new DataView(buf); this.o = 0; }
  u8() { const v = this.view.getUint8(this.o); this.o += 1; return v; }
  u16() { const v = this.view.getUint16(this.o); this.o += 2; return v; }
  i16() { const v = this.view.getInt16(this.o); this.o += 2; return v; }
  f32() { const v = this.view.getFloat32(this.o); this.o += 4; return v; }
}

function writeTop(w, t) {
  w.i16(t.x * POS); w.i16(t.z * POS); w.i16(t.vx * VEL); w.i16(t.vz * VEL);
  w.u16(t.spin * 50); w.u8(t.ult >= 100 ? ULT_FULL : Math.min(ULT_FULL - 1, Math.floor(t.ult * 2.5)));
  w.u8(t.tumble * 100); w.u8(t.launch * 100); w.u8(t.guard * 100); w.u8(t.slow * 50); w.u8(t.hitCd * 1000); w.u8(t.empower * 50);
  w.f32(t.phase);
  for (const k of KEYS) w.u16(t.cd[k] * 1000);
  w.u16(t.projN); w.u16(t.zoneN);
  w.u8(t.frost * 50); w.u8(t.up * 100); w.u8(t.ground * 100); w.u8(t.mark * 50); w.u8(t.scar * 80); w.u8(t.poison * 100);
  w.u8(t.bleed | (t.last << 4)); w.u8(t.bleedT * 25); w.u8(t.shield); w.u8(t.shieldT * 50); w.u8(t.buff * 20);
  w.u8(t.stack); w.u8(t.stackT * 20); w.u8(t.dmark * 60); w.u16(t.dacc * 50); w.u8(t.egg * 60); w.u8(t.eggHp);
  for (const k of KEYS) w.u8(Math.ceil(t.re[k] * 20)); // rounded up: an open window must not arrive closed
  w.u8(Math.ceil(t.stun * 100)); w.u8(Math.ceil(t.snare * 100)); w.u8(t.slowK * 100);
  w.u8(t.haste * 50); w.u8(Math.ceil(t.charm * 100)); w.u8(t.pin * 100); w.u8(t.store); w.u8(t.tag); w.u8(t.tagT * 25); w.u8(t.perm);
  w.u8((t.toggle ? G_TOGGLE : 0) | (t.eggUsed ? G_EGGUSED : 0) | (t.chan ? G_CHAN : 0) | (t.ret ? G_RET : 0) | (t.dash && t.dash.hit ? G_DASHHIT : 0) | (t.charmDir < 0 ? G_FEAR : 0) | (t.hold ? G_HOLD : 0) | (t.ret2 ? G_RET2 : 0));
  w.u8((t.cmd ? F_CMD : 0) | (t.dash ? F_DASH : 0) | (t.blink ? F_BLINK : 0) | (t.air ? F_AIR : 0) | (t.out ? F_OUT : 0)
    | (t.charge ? F_CHARGE : 0) | (t.orbs ? F_ORBS : 0) | (t.tether ? F_TETHER : 0));
  if (t.cmd) { w.i16(t.cmd.x * POS); w.i16(t.cmd.z * POS); w.u8(t.cmd.t * 100); }
  for (const d of [t.dash, t.blink]) if (d) { w.u8(skillNo(d.skill)); w.i16(d.dx * DIR); w.i16(d.dz * DIR); w.u8(d.t * 250); }
  if (t.air) { const a = t.air; w.u8(skillNo(a.skill)); w.u8(a.by); w.u8(a.t * 200); w.i16(a.sx * POS); w.i16(a.sz * POS); w.i16(a.tx * POS); w.i16(a.tz * POS); }
  if (t.out) { w.u8(t.out.t * 50); w.i16(t.out.y * 100); w.i16(t.out.vy * 100); }
  if (t.charge) { const c = t.charge; w.u8(skillNo(c.skill)); w.u8(c.t * 200); w.i16((c.dx || 0) * DIR); w.i16((c.dz || 0) * DIR); }
  if (t.orbs) { const o = t.orbs; w.u8(skillNo(o.skill)); w.u8(o.alive); w.u8(o.t * 40); w.u16((((o.ang % TAU) + TAU) % TAU) * 10000); w.u8(o.cd * 200); }
  if (t.tether) { const h = t.tether; w.u8(skillNo(h.skill)); w.u8(h.t * 80); w.u16(h.acc * 100); w.u8(h.tick * 200); }
  if (t.chan) { const c = t.chan; w.u8(c.t * 60); w.u8(c.n); w.i16(c.dx * DIR); w.i16(c.dz * DIR); }
  if (t.ret) { w.i16(t.ret.x * POS); w.i16(t.ret.z * POS); }
  if (t.ret2) { w.i16(t.ret2.x * POS); w.i16(t.ret2.z * POS); }
  if (t.hold) { w.u8(KEYS.indexOf(t.hold.key)); w.u8(t.hold.t * 50); }
}

function readDir(r) {
  const dx = r.i16() / DIR, dz = r.i16() / DIR, n = Math.hypot(dx, dz) || 1;
  return { dx: dx / n, dz: dz / n };
}

function readDash(r) {
  const skill = skillAt(r.u8());
  return { skill, ...readDir(r), speed: skill.speed, t: r.u8() / 250, hit: false };
}

function readTop(r, t) {
  t.x = r.i16() / POS; t.z = r.i16() / POS; t.vx = r.i16() / VEL; t.vz = r.i16() / VEL;
  t.spin = r.u16() / 50;
  const ult = r.u8();
  t.ult = ult === ULT_FULL ? 100 : ult / 2.5;
  t.tumble = r.u8() / 100; t.launch = r.u8() / 100; t.guard = r.u8() / 100; t.slow = r.u8() / 50; t.hitCd = r.u8() / 1000; t.empower = r.u8() / 50;
  t.phase = r.f32();
  for (const k of KEYS) t.cd[k] = r.u16() / 1000;
  t.projN = r.u16(); t.zoneN = r.u16();
  t.frost = r.u8() / 50; t.up = r.u8() / 100; t.ground = r.u8() / 100; t.mark = r.u8() / 50; t.scar = r.u8() / 80; t.poison = r.u8() / 100;
  const bl = r.u8();
  t.bleed = bl & 15; t.last = bl >> 4;
  t.bleedT = r.u8() / 25; t.shield = r.u8(); t.shieldT = r.u8() / 50; t.buff = r.u8() / 20;
  t.stack = r.u8(); t.stackT = r.u8() / 20; t.dmark = r.u8() / 60; t.dacc = r.u16() / 50; t.egg = r.u8() / 60; t.eggHp = r.u8();
  for (const k of KEYS) t.re[k] = r.u8() / 20;
  t.stun = r.u8() / 100; t.snare = r.u8() / 100; t.slowK = r.u8() / 100;
  t.haste = r.u8() / 50; t.charm = r.u8() / 100; t.pin = r.u8() / 100; t.store = r.u8(); t.tag = r.u8(); t.tagT = r.u8() / 25; t.perm = r.u8();
  const g = r.u8();
  t.toggle = !!(g & G_TOGGLE); t.eggUsed = !!(g & G_EGGUSED); t.charmDir = g & G_FEAR ? -1 : 1;
  const f = r.u8();
  t.cast = null;
  t.cmd = f & F_CMD ? { x: r.i16() / POS, z: r.i16() / POS, t: r.u8() / 100 } : null;
  t.dash = f & F_DASH ? readDash(r) : null;
  if (t.dash) t.dash.hit = !!(g & G_DASHHIT);
  t.blink = f & F_BLINK ? readDash(r) : null;
  if (f & F_AIR) {
    const skill = skillAt(r.u8());
    t.air = { skill, by: r.u8() & 1, t: r.u8() / 200, T: skill.air, sx: r.i16() / POS, sz: r.i16() / POS, tx: r.i16() / POS, tz: r.i16() / POS };
  } else t.air = null;
  t.out = f & F_OUT ? { t: r.u8() / 50, y: r.i16() / 100, vy: r.i16() / 100 } : null;
  if (f & F_CHARGE) { const skill = skillAt(r.u8()); t.charge = { t: r.u8() / 200, T: skill.charge, skill, ...readDir(r) }; } else t.charge = null;
  if (f & F_ORBS) {
    const skill = skillAt(r.u8()), alive = r.u8();
    let n = 0;
    for (let i = 0; i < 8; i++) if (alive & (1 << i)) n++;
    t.orbs = { alive, n, t: r.u8() / 40, ang: r.u16() / 10000, cd: r.u8() / 200, skill };
  } else t.orbs = null;
  if (f & F_TETHER) { const skill = skillAt(r.u8()); t.tether = { t: r.u8() / 80, T: skill.dur, skill, acc: r.u16() / 100, tick: r.u8() / 200 }; } else t.tether = null;
  t.chan = g & G_CHAN ? { t: r.u8() / 60, n: r.u8(), ...readDir(r), skill: SKILLS.curtaincall } : null;
  t.ret = g & G_RET ? { x: r.i16() / POS, z: r.i16() / POS } : null;
  t.ret2 = g & G_RET2 ? { x: r.i16() / POS, z: r.i16() / POS } : null;
  t.hold = g & G_HOLD ? { key: KEYS[r.u8() & 3], t: r.u8() / 50 } : null;
}

// meta: { seq, ack, timeLeft }
export function encodeSnapshot(world, meta) {
  const w = new Writer();
  w.u8(PKT_SNAPSHOT); w.u16(meta.seq & 0xffff); w.u16(meta.ack & 0xffff); w.u16(Math.max(0, meta.timeLeft) * 100);
  const res = world.result;
  w.u8(res ? 1 + res.winner.side + 2 * KINDS.indexOf(res.kind) : 0);
  for (const t of world.tops) writeTop(w, t);
  w.u8(world.projectiles.length);
  for (const p of world.projectiles) {
    w.u16(p.id); w.u8(skillNo(p.skill)); w.u8(p.owner.side | (p.hit ? 2 : 0) | (p.back ? 4 : 0) | (p.crawl ? 8 : 0));
    w.i16(p.x * POS); w.i16(p.z * POS); w.i16(p.dx * DIR); w.i16(p.dz * DIR); w.u16(p.left * 1000); w.u16(p.dmg * 100);
  }
  w.u8(world.zones.length);
  for (const z of world.zones) {
    w.u16(z.id); w.u8(skillNo(z.skill)); w.u8(z.owner.side);
    w.i16(z.x * POS); w.i16(z.z * POS); w.i16(z.dx * POS); w.i16(z.dz * POS); w.u16(z.t * 1000); w.u16(z.a * 100); w.u8(z.b * 50); w.u8(z.c);
  }
  return w.done();
}

export function snapshotHeader(buf) {
  const r = new Reader(buf);
  r.u8();
  return { seq: r.u16(), ack: r.u16(), timeLeft: r.u16() / 100 };
}

// Overwrites `world` with the snapshot. Existing objects are reused where
// possible so anything holding a reference (the view) stays valid.
export function applySnapshot(world, buf) {
  const r = new Reader(buf);
  r.u8();
  const meta = { seq: r.u16(), ack: r.u16(), timeLeft: r.u16() / 100 };
  const res = r.u8();
  if (res) {
    const winner = world.tops[(res - 1) & 1];
    world.result = { winner, loser: world.other(winner), kind: KINDS[(res - 1) >> 1] };
  } else world.result = null;
  for (const t of world.tops) readTop(r, t);

  const old = new Map(world.projectiles.map((p) => [p.id, p]));
  const n = r.u8();
  world.projectiles = [];
  for (let i = 0; i < n; i++) {
    const id = r.u16(), sk = r.u8(), b = r.u8();
    const p = old.get(id) || { id, dead: false };
    p.owner = world.tops[b & 1]; p.skill = skillAt(sk); p.hit = !!(b & 2); p.back = !!(b & 4); p.crawl = !!(b & 8);
    p.x = r.i16() / POS; p.z = r.i16() / POS;
    Object.assign(p, readDir(r));
    p.left = r.u16() / 1000; p.dmg = r.u16() / 100;
    p.speed = p.crawl ? p.skill.crawl : p.skill.speed * (p.back ? 1.3 : 1); p.r = p.skill.radius; p.dead = false;
    world.projectiles.push(p);
  }
  const zones = new Map(world.zones.map((z) => [z.id, z]));
  const zn = r.u8();
  world.zones = [];
  for (let i = 0; i < zn; i++) {
    const id = r.u16(), sk = r.u8(), b = r.u8();
    const z = zones.get(id) || { id };
    z.kind = SKILL_IDS[sk]; z.owner = world.tops[b & 1]; z.dead = false;
    z.x = r.i16() / POS; z.z = r.i16() / POS; z.dx = r.i16() / POS; z.dz = r.i16() / POS;
    z.t = r.u16() / 1000; z.a = r.u16() / 100; z.b = r.u8() / 50; z.c = r.u8();
    world.zones.push(initZone(z));
  }
  return meta;
}

const round2 = (v) => Math.round(v * 100) / 100;

// Events carry references to tops, skills, projectiles and zones. Those are
// replaced by small tagged ids here and looked up again on the other side.
export function packEvent(e) {
  const o = {};
  for (const k in e) {
    const v = e[k];
    if (v == null) continue;
    if (typeof v === 'number') o[k] = round2(v);
    else if (typeof v !== 'object') o[k] = v;
    else if ('blade' in v) o[k] = { $t: v.side };
    else if ('aim' in v) o[k] = { $s: v.id };
    else if ('left' in v) o[k] = { $p: [v.id, v.owner.side, v.skill.id, round2(v.x), round2(v.z), Math.round(v.dx * 1000) / 1000, Math.round(v.dz * 1000) / 1000] };
    else if ('kind' in v && 'owner' in v) o[k] = { $z: [v.kind, v.owner.side, round2(v.x), round2(v.z), v.id, round2(v.dx), round2(v.dz), v.c] };
  }
  return o;
}

export function reviveEvent(o, world) {
  const e = {};
  for (const k in o) {
    const v = o[k];
    if (v == null || typeof v !== 'object') { e[k] = v; continue; }
    if ('$t' in v) e[k] = world.tops[v.$t & 1];
    else if ('$s' in v) e[k] = SKILLS[v.$s];
    else if ('$p' in v) {
      const [id, side, skill, x, z, dx, dz] = v.$p;
      e[k] = world.projectiles.find((p) => p.id === id) || { id, owner: world.tops[side & 1], skill: SKILLS[skill], x, z, dx, dz, left: 0 };
    } else if ('$z' in v) {
      const [kind, side, x, z, id, dx, dz, c] = v.$z;
      e[k] = world.zones.find((q) => q.id === id) || initZone({ id, kind, owner: world.tops[side & 1], x, z, dx, dz, t: 0, a: 0, b: 0, c });
    }
  }
  return e;
}

export function encodePing(type, time) {
  const v = new DataView(new ArrayBuffer(9));
  v.setUint8(0, type); v.setFloat64(1, time);
  return v.buffer;
}
export const packetType = (buf) => new DataView(buf).getUint8(0);
export const pingTime = (buf) => new DataView(buf).getFloat64(1);

export function toBase64(buf) {
  let s = '';
  const b = new Uint8Array(buf);
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s);
}
export function fromBase64(str) {
  const s = atob(str), b = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
  return b.buffer;
}
