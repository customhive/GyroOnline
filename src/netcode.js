// Wire formats for online play.
//
// Snapshots: the whole match state packed into ~100 bytes of quantised
// binary, sent many times a second over an unreliable channel. A lost one is
// simply replaced by the next.
// Events: one-off happenings (hits, casts, finishes) as small JSON, sent
// reliably, with object references swapped for ids.
import { SKILLS, KEYS } from './config.js';

export const PROTOCOL = 2;
export const PKT_SNAPSHOT = 1, PKT_PING = 2, PKT_PONG = 3;

const SKILL_IDS = Object.keys(SKILLS);
const KINDS = ['over', 'burst', 'spin', 'time'];
const ZONES = ['quake', 'sanctuary'];
const POS = 2000, VEL = 400, DIR = 30000;
const F_CMD = 1, F_DASH = 2, F_BLINK = 4, F_AIR = 8, F_OUT = 16, F_CHARGE = 32, F_ORBS = 64, F_TETHER = 128;
const TAU = Math.PI * 2;

const clampInt = (v, lo, hi) => { v = Math.round(v); return v < lo ? lo : v > hi ? hi : v; };

class Writer {
  constructor(size = 512) { this.view = new DataView(new ArrayBuffer(size)); this.o = 0; }
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
  w.u16(t.spin * 50); w.u8(Math.floor(t.ult * 2.55));
  w.u8(t.tumble * 100); w.u8(t.launch * 100); w.u8(t.guard * 100); w.u8(t.slow * 100); w.u8(t.hitCd * 1000); w.u8(t.empower * 50);
  w.f32(t.phase);
  for (const k of KEYS) w.u16(t.cd[k] * 1000);
  w.u16(t.projN);
  w.u8((t.cmd ? F_CMD : 0) | (t.dash ? F_DASH : 0) | (t.blink ? F_BLINK : 0) | (t.air ? F_AIR : 0) | (t.out ? F_OUT : 0)
    | (t.charge ? F_CHARGE : 0) | (t.orbs ? F_ORBS : 0) | (t.tether ? F_TETHER : 0));
  if (t.cmd) { w.i16(t.cmd.x * POS); w.i16(t.cmd.z * POS); w.u8(t.cmd.t * 100); }
  for (const d of [t.dash, t.blink]) if (d) { w.i16(d.dx * DIR); w.i16(d.dz * DIR); w.u8(d.t * 250); }
  if (t.air) { const a = t.air; w.u8(a.t * 200); w.i16(a.sx * POS); w.i16(a.sz * POS); w.i16(a.tx * POS); w.i16(a.tz * POS); }
  if (t.out) { w.u8(t.out.t * 50); w.i16(t.out.y * 100); w.i16(t.out.vy * 100); }
  if (t.charge) w.u8(t.charge.t * 200);
  if (t.orbs) { const o = t.orbs; w.u8(o.alive); w.u8(o.t * 40); w.u16((((o.ang % TAU) + TAU) % TAU) * 10000); w.u8(o.cd * 200); }
  if (t.tether) { const h = t.tether; w.u8(h.t * 80); w.u16(h.acc * 100); w.u8(h.tick * 200); }
}

function readDir(r) {
  const dx = r.i16() / DIR, dz = r.i16() / DIR, n = Math.hypot(dx, dz) || 1;
  return { dx: dx / n, dz: dz / n };
}

function readTop(r, t) {
  t.x = r.i16() / POS; t.z = r.i16() / POS; t.vx = r.i16() / VEL; t.vz = r.i16() / VEL;
  t.spin = r.u16() / 50; t.ult = Math.min(100, r.u8() / 2.55);
  t.tumble = r.u8() / 100; t.launch = r.u8() / 100; t.guard = r.u8() / 100; t.slow = r.u8() / 100; t.hitCd = r.u8() / 1000; t.empower = r.u8() / 50;
  t.phase = r.f32();
  for (const k of KEYS) t.cd[k] = r.u16() / 1000;
  t.projN = r.u16();
  const f = r.u8();
  t.cast = null;
  t.cmd = f & F_CMD ? { x: r.i16() / POS, z: r.i16() / POS, t: r.u8() / 100 } : null;
  t.dash = f & F_DASH ? { ...readDir(r), speed: SKILLS.blitz.speed, t: r.u8() / 250 } : null;
  t.blink = f & F_BLINK ? { ...readDir(r), speed: SKILLS.phantom.speed, t: r.u8() / 250 } : null;
  t.air = f & F_AIR ? { t: r.u8() / 200, T: SKILLS.meteor.air, sx: r.i16() / POS, sz: r.i16() / POS, tx: r.i16() / POS, tz: r.i16() / POS } : null;
  t.out = f & F_OUT ? { t: r.u8() / 50, y: r.i16() / 100, vy: r.i16() / 100 } : null;
  t.charge = f & F_CHARGE ? { t: r.u8() / 200, T: SKILLS.nova.charge, skill: SKILLS.nova } : null;
  if (f & F_ORBS) {
    const alive = r.u8();
    let n = 0;
    for (let i = 0; i < 8; i++) if (alive & (1 << i)) n++;
    t.orbs = { alive, n, t: r.u8() / 40, ang: r.u16() / 10000, cd: r.u8() / 200, skill: SKILLS.satellite };
  } else t.orbs = null;
  t.tether = f & F_TETHER ? { t: r.u8() / 80, T: SKILLS.eclipse.dur, skill: SKILLS.eclipse, acc: r.u16() / 100, tick: r.u8() / 200 } : null;
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
    w.u16(p.id); w.u8(p.owner.side | (SKILL_IDS.indexOf(p.skill.id) << 1));
    w.i16(p.x * POS); w.i16(p.z * POS); w.i16(p.dx * DIR); w.i16(p.dz * DIR); w.u16(p.left * 1000); w.u16(p.dmg * 100);
  }
  w.u8(world.zones.length);
  for (const z of world.zones) {
    w.u8(z.owner.side | (ZONES.indexOf(z.kind) << 1));
    w.i16(z.x * POS); w.i16(z.z * POS); w.u8(z.t * 40); w.u16((z.healed || 0) * 100); w.u8((z.tick || 0) * 200);
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
    const id = r.u16(), b = r.u8();
    const p = old.get(id) || { id, dead: false };
    p.owner = world.tops[b & 1]; p.skill = SKILLS[SKILL_IDS[b >> 1]];
    p.x = r.i16() / POS; p.z = r.i16() / POS;
    Object.assign(p, readDir(r));
    p.left = r.u16() / 1000; p.dmg = r.u16() / 100;
    p.speed = p.skill.speed; p.r = p.skill.radius; p.dead = false;
    world.projectiles.push(p);
  }
  const zn = r.u8();
  world.zones = [];
  for (let i = 0; i < zn; i++) {
    const b = r.u8(), kind = ZONES[b >> 1], skill = SKILLS[kind];
    world.zones.push({
      kind, skill, owner: world.tops[b & 1], x: r.i16() / POS, z: r.i16() / POS, t: r.u8() / 40, healed: r.u16() / 100, tick: r.u8() / 200,
      r: kind === 'quake' ? skill.aoe : skill.radius, T: kind === 'quake' ? skill.delay : skill.dur,
    });
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
    else if ('kind' in v && 'owner' in v) o[k] = { $z: [v.kind, v.owner.side, round2(v.x), round2(v.z)] };
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
      const [kind, side, x, z] = v.$z, skill = SKILLS[kind];
      e[k] = { kind, skill, owner: world.tops[side & 1], x, z, t: 0, r: kind === 'quake' ? skill.aoe : skill.radius, T: kind === 'quake' ? skill.delay : skill.dur };
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
