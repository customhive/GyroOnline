// Turns the simulation into pictures: top models, camera, effects, and the
// floor indicators for aiming and for incoming enemy skills.
import * as THREE from 'three';
import { ARENA, SKILLS, ENEMY_COLOR, heightAt } from './config.js';
import { spinRatio, wallOf } from './sim.js';
import { createStage } from './stage.js';
import { buildTop, disposeTop } from './topmesh.js';
import { Particles, Shockwaves, Flashes, Trail, Ground, glowTexture, groundY } from './fx.js';

const AIM = 0x9fe8ff, LOCK = 0xffd84a, HOT = 0xfff1c0, HEAL = 0x8dffb0;
const PITCH = (54 * Math.PI) / 180;
const WHEEL_MIN = 0.45, WHEEL_MAX = 1.2; // how far the mouse wheel may zoom in and out
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
// Distance from (x, z) along (dx, dz) to the arena wall.
const toWall = (x, z, dx, dz) => {
  const b = x * dx + z * dz, c = x * x + z * z - ARENA.R * ARENA.R;
  return c >= 0 ? 0 : -b + Math.sqrt(b * b - c);
};
const MATE_COLOR = 0x7dffb0; // a team mate's skills: not a threat
const v3 = new THREE.Vector3();
// Zones that stand on the floor as an object, not only as a decal.
const OBJECTS = { shadow: 'clone', arise: 'clone', turret: 'turret', sentry: 'turret', keg: 'keg', icewall: 'wall', windwall: 'wall', divide: 'wall', weaverz: 'wall' };
const TOXIC = 0x9dff3a, BLOOD = 0xff3040, ICE = 0xcfefff;

export class View {
  constructor(canvas) {
    const st = (this.stage = createStage(canvas));
    this.scene = st.scene;
    this.camera = st.camera;
    this.glow = glowTexture();
    this.particles = new Particles(this.scene);
    this.waves = new Shockwaves(this.scene);
    this.flashes = new Flashes(this.scene, this.glow);
    this.ground = new Ground(this.scene);
    this.tops = [];
    this.projs = new Map();
    this.telegraphs = [];
    this.markers = [];
    this.scorch = [];
    this.world = null;
    this.playerSide = 0;
    this.time = 0;
    this.shake = 0;
    this.punch = 0;
    this.orbit = 0.6;
    this.orbiting = true;
    this.look = new THREE.Vector3(0, 0.6, 0.8);
    this.zoom = 1.12;
    this.wheel = 1;          // the player's own zoom, set with the mouse wheel
    this.wheelNow = 1;
    this.focus = null;
    this.raycaster = new THREE.Raycaster();

    this.pillars = [];
    const pg = new THREE.CylinderGeometry(1, 0.55, 34, 32, 1, true);
    pg.translate(0, 17, 0);
    for (let i = 0; i < 2; i++) {
      const m = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
      m.visible = false;
      this.scene.add(m);
      this.pillars.push({ m, t: 0, T: 0.7 });
    }
    const pm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    this.projGeoFlat = new THREE.RingGeometry(0.5, 1.05, 24, 1, -1.05, 2.1).rotateX(-Math.PI / 2);
    this.projGeoUp = new THREE.RingGeometry(0.45, 0.95, 24, 1, -1.05, 2.1);
    this.projMat = pm;
    this.orbGeo = new THREE.SphereGeometry(0.42, 16, 12);
    this.orbMat = new THREE.MeshBasicMaterial({ color: 0xfff3c4 });
    this.cones = [];
    this.beams = [];
    this.objs = new Map();   // zone id -> its model
    this.spare = [];         // clone models waiting to be reused
    this.wallGeo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
    this.turretGeo = [new THREE.CylinderGeometry(0.75, 0.95, 0.5, 8).translate(0, 0.25, 0), new THREE.SphereGeometry(0.5, 16, 12).translate(0, 0.95, 0), new THREE.BoxGeometry(1.1, 0.2, 0.2).translate(0.6, 0.95, 0)];
    this.turretMat = new THREE.MeshStandardMaterial({ color: 0x8a93a8, metalness: 0.9, roughness: 0.35 });
    window.addEventListener('resize', () => this.stage.resize());
  }

  setMatch(world, playerSide) {
    this.clearObjects();
    for (const c of this.spare) { this.scene.remove(c.group); disposeTop(c); }
    this.spare = [];
    for (const v of this.tops) {
      for (const g of v.ghosts || []) { this.scene.remove(g.group); disposeTop(g); }
      this.scene.remove(v.group, v.light, ...v.orbs);
      v.trail.dispose(this.scene);
      disposeTop(v);
    }
    this.tops = [];
    this.world = world;
    this.playerSide = playerSide;
    if (!world) return;
    for (const t of world.tops) {
      const v = buildTop(t.blade, this.glow);
      v.trail = new Trail(this.scene, t.blade.color);
      v.light = new THREE.PointLight(t.blade.color, 26, 13, 1.7);
      v.drop = 0; v.dropV = 0; v.fall = 0; v.hold = false; v.ox = 0; v.oz = 0; v.hover = 0; v.ghosts = [];
      // Satellite orbs, parked invisible until the skill is used.
      v.orbs = [];
      for (let i = 0; i < SKILLS.satellite.count; i++) {
        const o = new THREE.Group();
        o.add(new THREE.Mesh(this.orbGeo, this.orbMat));
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glow, color: t.blade.color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
        s.scale.setScalar(2.6);
        o.add(s);
        o.visible = false;
        this.scene.add(o);
        v.orbs.push(o);
      }
      this.scene.add(v.group, v.light);
      this.tops.push(v);
    }
    this.clearRound();
  }

  clearRound() {
    for (const p of this.projs.values()) this.scene.remove(p.group);
    this.projs.clear();
    this.telegraphs.length = 0;
    this.markers.length = 0;
    this.scorch.length = 0;
    this.cones.length = 0;
    this.beams.length = 0;
    this.clearObjects();
    this.focus = null;
    for (const v of this.tops) { v.trail.reset(); v.fall = 0; v.shieldAlpha = 0; v.group.visible = true; }
  }

  // Drops a top in from above for the launch.
  launch(side, height = 9) {
    const v = this.tops[side];
    v.drop = height; v.dropV = 0;
  }

  colorOf(t) { return t.blade.color; }
  // In another world than this player's (one of them is shut in a REALM OF DEATH): not drawn at all.
  hidden(t) { const me = this.world && this.world.tops[this.playerSide]; return !!me && t.realm !== me.realm; }
  // What a top is about to do is drawn as a threat unless it is ours, or a team mate's that cannot hurt us.
  dangerOf(t) {
    if (t.side === this.playerSide) return AIM;
    const me = this.world && this.world.tops[this.playerSide];
    return me && me.team === t.team && !this.world.ff ? MATE_COLOR : ENEMY_COLOR;
  }

  pick(cx, cy) {
    const st = this.stage;
    this.raycaster.setFromCamera(new THREE.Vector2((cx / st.width) * 2 - 1, -(cy / st.height) * 2 + 1), this.camera);
    const o = this.raycaster.ray.origin, d = this.raycaster.ray.direction;
    if (d.y > -0.01) return null;
    let y = 0, x = 0, z = 0;
    for (let i = 0; i < 5; i++) {
      const t = (y - o.y) / d.y;
      x = o.x + d.x * t; z = o.z + d.z * t;
      y = groundY(x, z);
    }
    return { x, z, inside: Math.hypot(x, z) <= ARENA.R };
  }

  toScreen(x, y, z) {
    v3.set(x, y, z).project(this.camera);
    return { x: (v3.x * 0.5 + 0.5) * this.stage.width, y: (-v3.y * 0.5 + 0.5) * this.stage.height };
  }

  addShake(a) { this.shake = Math.min(1.3, this.shake + a); }

  // ---------------------------------------------------------------- events --
  handle(e) {
    const P = this.particles, W = this.waves, F = this.flashes;
    switch (e.type) {
      case 'clash': {
        const y = groundY(e.x, e.z) + 0.85, p = e.power;
        const n = Math.min(150, 14 + p * 4);
        const tx = -e.nz, tz = e.nx;
        P.burst(e.x, y, e.z, n * 0.4, HOT, 9 + p * 0.7, { dx: tx, dz: tz, bias: 0.6, up: 0.7, life: 0.55, size: 0.17 });
        P.burst(e.x, y, e.z, n * 0.4, HOT, 9 + p * 0.7, { dx: -tx, dz: -tz, bias: 0.6, up: 0.7, life: 0.55, size: 0.17 });
        P.burst(e.x, y, e.z, n * 0.2, this.colorOf(e.a), 6 + p * 0.4, { up: 1, life: 0.7, size: 0.2 });
        P.burst(e.x, y, e.z, n * 0.2, this.colorOf(e.b), 6 + p * 0.4, { up: 1, life: 0.7, size: 0.2 });
        W.spawn(e.x, y - 0.7, e.z, 0.4, 1.8 + p * 0.16, 0.32, 0xffffff, 0.8);
        F.flash(e.x, y, e.z, 2.2 + p * 0.16, 0.18, HOT, 0.8, 40 + p * 7);
        this.addShake(p * 0.014);
        if (p > 16) this.punch = Math.max(this.punch, Math.min(1, p / 34));
        if (e.kind === 'parry') {
          W.spawn(e.x, y - 0.7, e.z, 0.5, 7, 0.5, LOCK, 1);
          W.spawn(e.x, y - 0.6, e.z, 0.3, 4, 0.35, 0xffffff, 1);
          P.burst(e.x, y, e.z, 110, LOCK, 22, { up: 0.5, life: 0.7, size: 0.3, gravity: 8 });
          F.flash(e.x, y, e.z, 11, 0.35, 0xfff0b0, 1, 220);
          this.addShake(0.5);
        } else if (e.kind === 'dash' || e.kind === 'empower') {
          const src = e.src;
          const s = src === e.a ? 1 : -1;
          W.spawn(e.x, y - 0.7, e.z, 0.5, 6, 0.45, this.colorOf(src), 1);
          P.burst(e.x, y, e.z, 120, this.colorOf(src), 26, { dx: e.nx * s, dz: e.nz * s, bias: 0.65, up: 0.5, life: 0.6, size: 0.3, gravity: 6 });
          F.flash(e.x, y, e.z, 9, 0.3, this.colorOf(src), 1, 180);
          this.addShake(0.45);
        }
        break;
      }
      case 'wall': {
        const y = groundY(e.x, e.z) + 0.6, c = e.slam ? 0xff6a3a : this.colorOf(e.top);
        P.burst(e.x, y, e.z, 8 + e.power * 2.5, e.slam ? 0xffb07a : HOT, 7 + e.power * 0.6, { dx: -e.nx, dz: -e.nz, bias: 0.55, up: 0.8, life: 0.5 });
        F.flash(e.x, y, e.z, 2 + e.power * 0.2, 0.2, c, 0.9, e.slam ? 120 : 0);
        this.stage.pulseRim(c, Math.min(1, 0.25 + e.power / 14));
        this.addShake(e.power * (e.slam ? 0.03 : 0.012));
        break;
      }
      // Running into a wall that stands on the floor.
      case 'bump': {
        const y = groundY(e.x, e.z) + 0.7;
        P.burst(e.x, y, e.z, 10 + e.power * 2, HOT, 6 + e.power * 0.5, { dx: e.nx, dz: e.nz, bias: 0.5, up: 0.8, life: 0.4 });
        F.flash(e.x, y, e.z, 2 + e.power * 0.15, 0.18, ICE, 0.8, 0);
        this.addShake(e.power * 0.01);
        break;
      }
      case 'cast':
        if (e.windup > 0) this.telegraphs.push({ top: e.top, key: e.key, skill: e.skill, t: 0, T: e.windup, dx: e.dx, dz: e.dz, ax: e.ax, az: e.az });
        break;
      case 'blink': {
        const t = e.top, y = groundY(t.x, t.z), c = this.colorOf(t);
        W.spawn(t.x, y + 0.1, t.z, 0.6, 3.2, 0.3, c, 0.9);
        P.burst(t.x, y + 0.8, t.z, 50, c, 7, { up: 1, life: 0.5, gravity: -3, drag: 2 });
        P.burst(t.x, y + 0.8, t.z, 20, 0xffffff, 4, { up: 1, life: 0.35, gravity: 0 });
        break;
      }
      case 'blinkEnd': {
        const t = e.top, y = groundY(t.x, t.z), c = this.colorOf(t);
        W.spawn(t.x, y + 0.1, t.z, 3, 0.8, 0.25, 0xffffff, 0.9);
        P.burst(t.x, y + 0.8, t.z, 40, c, 9, { up: 0.8, life: 0.4, gravity: 2 });
        F.flash(t.x, y + 0.8, t.z, 5, 0.2, c, 1, 70);
        break;
      }
      case 'zone': {
        const z = e.zone, y = groundY(z.x, z.z), c = this.colorOf(e.top);
        if (z.kind === 'sanctuary') {
          W.spawn(z.x, y + 0.1, z.z, 0.5, z.r, 0.5, HEAL, 1);
          W.spawn(z.x, y + 0.12, z.z, 0.3, z.r * 0.6, 0.4, c, 1);
          P.burst(z.x, y + 0.3, z.z, 80, c, 9, { flat: true, life: 0.6, gravity: -5, drag: 2.5 });
          F.flash(z.x, y + 1, z.z, 9, 0.4, c, 0.9, 120);
        } else if (z.kind !== 'quake' && z.kind !== 'grenade' && z.kind !== 'lotus' && z.skill.kind !== 'blast') {
          // Something set down on the floor.
          W.spawn(z.x, y + 0.1, z.z, 0.4, Math.max(2, z.r), 0.4, c, 0.9);
          P.burst(z.x, y + 0.4, z.z, 40, c, 8, { up: 1, life: 0.5, gravity: 4 });
          if (z.skill.ult) { F.flash(z.x, y + 1, z.z, 12, 0.5, c, 1, 220); this.stage.pulseRim(c, 0.8); this.addShake(0.3); }
        }
        break;
      }
      // A delayed field has just become live: unmistakably different from before.
      case 'formed': {
        const z = e.zone, y = groundY(z.x, z.z), c = this.colorOf(e.top);
        W.spawn(z.x, y + 0.12, z.z, z.r * 0.2, z.r, 0.35, 0xffffff, 1);
        W.spawn(z.x, y + 0.14, z.z, z.r, z.r * 1.25, 0.5, c, 0.9);
        P.burst(z.x, y + 0.3, z.z, 90, c, 12, { flat: true, life: 0.5, gravity: 0, drag: 3 });
        F.flash(z.x, y + 1, z.z, z.r * 2.4, 0.35, 0xffffff, 1, 200);
        break;
      }
      case 'zoneEnd': {
        const z = e.zone;
        if (OBJECTS[z.kind]) {
          const w = wallOf(z), y = groundY(w.x, w.z);
          P.burst(w.x, y + 0.8, w.z, 36, this.colorOf(z.owner), 8, { up: 1, life: 0.5, gravity: 6 });
        }
        break;
      }
      // A burst around a point: most area skills end in one of these.
      case 'blast': {
        const y = groundY(e.x, e.z), c = this.colorOf(e.top), big = !!e.skill.ult, r = e.r;
        W.spawn(e.x, y + 0.12, e.z, 0.4, r * 1.2, 0.45, 0xffffff, 0.9);
        W.spawn(e.x, y + 0.14, e.z, 0.3, r, 0.4, c, 1);
        P.burst(e.x, y + 0.4, e.z, big ? 220 : 70 + r * 14, c, 10 + r * 3, { up: 0.7, life: 0.6, size: 0.28, gravity: 12 });
        P.burst(e.x, y + 0.3, e.z, 30 + r * 8, 0xffffff, 8 + r * 4, { flat: true, life: 0.35, gravity: 0, drag: 3 });
        F.flash(e.x, y + 1, e.z, 3 + r * 2.2, 0.3, c, 1, big ? 380 : 90 + r * 20);
        this.scorch.push({ x: e.x, z: e.z, t: 0, T: big ? 1.8 : 0.8, color: c, r });
        if (e.skill.inner) this.scorch.push({ x: e.x, z: e.z, t: 0, T: 0.8, color: 0xffffff, r: e.skill.inner });
        if (big) { this.stage.pulseRim(c, 1); this.punch = 1; }
        this.addShake(big ? 0.9 : e.hit ? 0.4 : 0.15);
        if (e.hit && !big) this.punch = Math.max(this.punch, 0.5);
        break;
      }
      // A single hit on a top that no projectile delivered.
      case 'strike': {
        const y = groundY(e.x, e.z) + 0.9, c = this.colorOf(e.src);
        P.burst(e.x, y, e.z, e.big ? 200 : 70, c, e.big ? 28 : 16, { up: 0.8, life: 0.5, size: 0.28, gravity: 8 });
        P.burst(e.x, y, e.z, 24, 0xffffff, 10, { up: 1, life: 0.35 });
        W.spawn(e.x, y - 0.8, e.z, 0.3, e.big ? 7 : 3.2, 0.35, c, 1);
        F.flash(e.x, y, e.z, e.big ? 14 : 5, 0.25, c, 1, e.big ? 320 : 90);
        this.addShake(e.big ? 0.9 : 0.22);
        if (e.big) { this.punch = 1; this.stage.pulseRim(c, 1); }
        break;
      }
      // Gone from one place, there in another.
      case 'warp': {
        const t = e.top, c = this.colorOf(t);
        for (const [x, z] of [[e.fx, e.fz], [t.x, t.z]]) {
          const y = groundY(x, z);
          W.spawn(x, y + 0.1, z, 0.5, 3, 0.3, c, 0.9);
          P.burst(x, y + 0.8, z, 46, Math.random() < 0.5 ? c : 0xffffff, 8, { up: 1, life: 0.45, gravity: -2, drag: 2 });
        }
        F.flash(t.x, groundY(t.x, t.z) + 0.8, t.z, 6, 0.22, c, 1, 90);
        this.tops[t.side].ox = this.tops[t.side].oz = 0;
        this.tops[t.side].trail.reset();
        break;
      }
      case 'buff': {
        const t = e.top, y = groundY(t.x, t.z), c = this.colorOf(t);
        W.spawn(t.x, y + 0.1, t.z, e.off ? 3 : 0.6, e.off ? 0.8 : 3.4, 0.4, c, 0.9);
        if (!e.off) P.burst(t.x, y + 0.6, t.z, e.skill.ult ? 120 : 40, c, 9, { up: 1, life: 0.6, gravity: -5, drag: 1.5 });
        if (e.skill.ult) { F.flash(t.x, y + 1, t.z, 10, 0.45, c, 1, 220); this.stage.pulseRim(c, 0.8); this.addShake(0.25); }
        break;
      }
      case 'cone': {
        const t = e.top, c = this.colorOf(t);
        if (e.skill.rapid) {
          // A continuous breath: a roaring stream, with a white-hot core and a lit floor under it.
          const a0 = Math.atan2(e.dz, e.dx), y = groundY(t.x, t.z) + 0.8, R = e.skill.range;
          this.cones.push({ x: t.x, z: t.z, dx: e.dx, dz: e.dz, t: 0, T: 0.2, color: c, skill: e.skill });
          this.beams.push({ x: t.x + e.dx * 1.2, z: t.z + e.dz * 1.2, dx: e.dx, dz: e.dz, len: R - 1.2, hw: 0.5, color: c, t: 0, T: 0.18 });
          for (let i = 0; i < 10; i++) { const k = 1.2 + Math.random() * (R - 1.2), w2 = (Math.random() - 0.5) * 0.6; P.emit(t.x + e.dx * k - e.dz * w2, y + (Math.random() - 0.5) * 0.5, t.z + e.dz * k + e.dx * w2, e.dx * 22, 1 + Math.random() * 3, e.dz * 22, 0.22, 0.36, 0xffffff, 0, 3); }
          F.flash(t.x + e.dx * 1.6, y, t.z + e.dz * 1.6, 3.4, 0.14, c, 0.9, e.hit ? 60 : 0);
          if (e.hit) { P.burst(e.target.x, groundY(e.target.x, e.target.z) + 0.9, e.target.z, e.hit >= 12 ? 70 : 14, c, e.hit >= 12 ? 18 : 9, { up: 0.9, life: 0.4, size: 0.28, gravity: 6 }); if (e.hit >= 12) { W.spawn(e.target.x, groundY(e.target.x, e.target.z) + 0.1, e.target.z, 0.4, 3.4, 0.35, c, 1); this.addShake(0.25); } }
          for (let i = 0; i < 26; i++) { const a = a0 + (Math.random() * 2 - 1) * e.skill.half, sp = e.skill.range * (2.5 + Math.random() * 2); P.emit(t.x + Math.cos(a) * 1.2, y, t.z + Math.sin(a) * 1.2, Math.cos(a) * sp, Math.random() * 2, Math.sin(a) * sp, 0.3, 0.3, Math.random() < 0.35 ? 0xffffff : c, 0, 2.5); }
          break;
        }
        this.cones.push({ x: e.x ?? t.x, z: e.z ?? t.z, dx: e.dx, dz: e.dz, t: 0, T: 0.35, color: c, skill: e.skill });
        if (e.hit) this.siphon(e.target, t, 24, c);
        this.addShake(e.hit ? 0.3 : 0.1);
        break;
      }
      case 'fling': {
        const t = e.top, y = groundY(t.x, t.z), c = this.colorOf(t);
        W.spawn(t.x, y + 0.1, t.z, 0.6, 4, 0.35, c, 1);
        P.burst(t.x, y + 0.8, t.z, 60, c, 14, { up: 1, life: 0.5, gravity: 6 });
        this.addShake(0.3);
        break;
      }
      case 'chan': {
        const t = e.top, y = groundY(t.x, t.z), c = this.colorOf(t);
        W.spawn(t.x, y + 0.1, t.z, 6, 1, 0.5, c, 0.9);
        F.flash(t.x, y + 1, t.z, 10, 0.4, c, 1, 200);
        this.stage.pulseRim(c, 0.8);
        break;
      }
      // A line that hits everything on it at once.
      case 'beam': {
        const S = e.skill, c = this.colorOf(e.top), big = !!S.ult;
        const len = Math.min(S.range, toWall(e.x, e.z, e.dx, e.dz));
        this.beams.push({ x: e.x, z: e.z, dx: e.dx, dz: e.dz, len, hw: S.radius, color: c, t: 0, T: big ? 0.55 : 0.35 });
        for (let i = 0; i < (big ? 160 : 60); i++) { const k = Math.random() * len; P.emit(e.x + e.dx * k + (Math.random() - 0.5) * S.radius * 2, groundY(e.x + e.dx * k, e.z + e.dz * k) + 0.4 + Math.random(), e.z + e.dz * k + (Math.random() - 0.5) * S.radius * 2, e.dx * 6, 2 + Math.random() * 5, e.dz * 6, 0.5, 0.3, Math.random() < 0.4 ? 0xffffff : c, 4, 1); }
        F.flash(e.x + e.dx * 2, groundY(e.x, e.z) + 1, e.z + e.dz * 2, big ? 16 : 8, 0.4, c, 1, big ? 420 : 160);
        if (big) { this.stage.pulseRim(c, 1); this.punch = 1; }
        this.addShake(big ? 0.9 : 0.4);
        break;
      }
      case 'egg': case 'rebirth': {
        const t = e.top, y = groundY(t.x, t.z), born = e.type === 'rebirth';
        W.spawn(t.x, y + 0.1, t.z, born ? 0.6 : 4, born ? 6 : 0.8, 0.6, ICE, 1);
        P.burst(t.x, y + 0.8, t.z, born ? 200 : 90, ICE, born ? 20 : 9, { up: 1, life: 0.8, size: 0.3, gravity: born ? 8 : -3 });
        F.flash(t.x, y + 1, t.z, born ? 16 : 8, 0.5, ICE, 1, born ? 360 : 160);
        if (born) { this.stage.pulseRim(this.colorOf(t), 1); this.addShake(0.5); }
        break;
      }
      case 'quake': {
        const y = groundY(e.x, e.z), c = this.colorOf(e.top);
        W.spawn(e.x, y + 0.12, e.z, 0.5, e.r * 1.35, 0.5, 0xffffff, 1);
        W.spawn(e.x, y + 0.14, e.z, 0.3, e.r, 0.4, c, 1);
        // Shards thrown straight up out of the floor.
        P.burst(e.x, y + 0.2, e.z, 150, c, 24, { dy: 1, bias: 0.75, up: 1, life: 0.8, size: 0.32, gravity: 30 });
        P.burst(e.x, y + 0.2, e.z, 70, 0xd8c8a0, 14, { dy: 1, bias: 0.5, up: 1, life: 0.9, size: 0.26, gravity: 24 });
        for (let i = 0; i < 40; i++) {
          const a = Math.random() * 6.283, r = Math.random() * e.r;
          P.emit(e.x + Math.cos(a) * r, y + 0.1, e.z + Math.sin(a) * r, 0, 9 + Math.random() * 14, 0, 0.5, 0.3, c, 26, 0.5);
        }
        F.flash(e.x, y + 1, e.z, e.r * 3.2, 0.3, c, 1, 200);
        const pl = this.pillars[0].m.visible ? this.pillars[1] : this.pillars[0];
        pl.t = 0; pl.T = 0.45; pl.r = e.r * 0.8; pl.m.scale.y = 0.22; pl.m.visible = true; pl.m.position.set(e.x, y, e.z); pl.m.material.color.set(c);
        this.scorch.push({ x: e.x, z: e.z, t: 0, T: 1.2, color: c, r: e.r });
        this.addShake(e.hit ? 0.6 : 0.3);
        if (e.hit) this.punch = Math.max(this.punch, 0.7);
        break;
      }
      case 'charge': {
        const t = e.top, y = groundY(t.x, t.z), c = this.colorOf(t);
        W.spawn(t.x, y + 0.1, t.z, e.skill.aoe || 4, 1, e.T, c, 0.8);
        F.flash(t.x, y + 1, t.z, 7, 0.4, c, 1, 120);
        this.addShake(0.2);
        break;
      }
      case 'nova': {
        const y = groundY(e.x, e.z), c = this.colorOf(e.top), A = SKILLS.nova.aoe;
        W.spawn(e.x, y + 0.12, e.z, 1, A * 1.15, 0.5, 0xffffff, 1);
        W.spawn(e.x, y + 0.14, e.z, 0.6, A, 0.65, c, 1);
        W.spawn(e.x, y + 0.16, e.z, 0.3, A * 1.7, 0.9, c, 0.5);
        P.burst(e.x, y + 0.5, e.z, 320, c, 42, { flat: true, life: 0.55, size: 0.36, gravity: 0, drag: 3.2 });
        P.burst(e.x, y + 0.5, e.z, 180, 0xffffff, 26, { up: 0.6, life: 0.8, size: 0.3, gravity: 12 });
        F.flash(e.x, y + 1, e.z, 28, 0.5, 0xffffff, 1, 520);
        F.flash(e.x, y + 1, e.z, 18, 0.8, c, 1, 0);
        this.scorch.push({ x: e.x, z: e.z, t: 0, T: 2, color: c, r: A });
        this.stage.pulseRim(c, 1);
        this.addShake(1.1);
        this.punch = 1;
        break;
      }
      case 'flare': {
        const t = e.top, y = groundY(t.x, t.z) + 0.8, S = SKILLS.flare;
        const a0 = Math.atan2(e.dz, e.dx);
        for (let i = 0; i < 170; i++) {
          const a = a0 + (Math.random() * 2 - 1) * S.half, sp = (0.35 + Math.random() * 0.65) * S.range * 3.4;
          const col = Math.random() < 0.3 ? 0xffffff : Math.random() < 0.5 ? this.colorOf(t) : 0xff6a2a;
          P.emit(t.x + Math.cos(a) * 1.2, y + (Math.random() - 0.5) * 0.6, t.z + Math.sin(a) * 1.2, Math.cos(a) * sp, Math.random() * 3, Math.sin(a) * sp, 0.3 + Math.random() * 0.25, 0.34, col, -3, 3.4);
        }
        this.cones.push({ x: t.x, z: t.z, dx: e.dx, dz: e.dz, t: 0, T: 0.35, color: this.colorOf(t), skill: S });
        F.flash(t.x + e.dx * 2, y, t.z + e.dz * 2, 8, 0.25, 0xffa040, 1, 140);
        this.addShake(e.hit ? 0.35 : 0.12);
        if (e.hit) this.siphon(e.target, t, 26, HEAL);
        break;
      }
      case 'orbs': {
        const t = e.top, y = groundY(t.x, t.z);
        W.spawn(t.x, y + 0.1, t.z, 0.6, (t.orbs ? t.orbs.skill.orbit : SKILLS.satellite.orbit) + 0.6, 0.35, this.colorOf(t), 1);
        P.burst(t.x, y + 0.8, t.z, 40, 0xfff3c4, 8, { up: 1, life: 0.5, gravity: 0, drag: 2 });
        break;
      }
      case 'orbHit': {
        const y = groundY(e.x, e.z) + 0.9, c = this.colorOf(e.top);
        P.burst(e.x, y, e.z, 70, c, 16, { up: 0.8, life: 0.5, size: 0.26, gravity: 8 });
        P.burst(e.x, y, e.z, 24, 0xffffff, 9, { up: 1, life: 0.35 });
        W.spawn(e.x, y - 0.8, e.z, 0.3, 3, 0.3, c, 1);
        F.flash(e.x, y, e.z, 5, 0.2, c, 1, 90);
        this.addShake(0.2);
        break;
      }
      case 'tether': {
        const t = e.top, y = groundY(t.x, t.z), c = this.colorOf(t);
        W.spawn(t.x, y + 0.1, t.z, 0.6, 5, 0.5, c, 1);
        W.spawn(e.target.x, groundY(e.target.x, e.target.z) + 0.1, e.target.z, 4, 0.8, 0.4, c, 1);
        F.flash(t.x, y + 1, t.z, 10, 0.4, c, 1, 200);
        this.stage.pulseRim(c, 0.8);
        this.addShake(0.3);
        break;
      }
      case 'tetherEnd': {
        const t = e.top, y = groundY(t.x, t.z);
        W.spawn(t.x, y + 0.1, t.z, 0.6, 3.5, 0.4, e.broke ? 0xffffff : HEAL, 0.9);
        break;
      }
      case 'heal': {
        const t = e.top;
        P.burst(t.x, groundY(t.x, t.z) + 0.6, t.z, 20, HEAL, 3, { up: 1, life: 0.7, gravity: -6, drag: 1 });
        break;
      }
      case 'shoot': {
        const p = e.proj, c = this.colorOf(e.top);
        const y = groundY(p.x, p.z) + 0.8;
        // A stream of small shots would drown the screen in muzzle flashes.
        if (p.skill.rapid) { P.burst(p.x, y, p.z, 5, c, 10, { dx: p.dx, dz: p.dz, bias: 0.8, up: 0.3, life: 0.2, gravity: 0 }); break; }
        P.burst(p.x, y, p.z, 40, c, 16, { dx: p.dx, dz: p.dz, bias: 0.7, up: 0.4, life: 0.35, gravity: 4 });
        F.flash(p.x, y, p.z, 5, 0.18, c, 1, 60);
        W.spawn(p.x - p.dx * 0.9, y - 0.7, p.z - p.dz * 0.9, 0.6, 2.6, 0.3, c, 0.7);
        break;
      }
      case 'reflect': {
        const c = this.colorOf(e.top);
        const y = groundY(e.x, e.z) + 0.8;
        P.burst(e.x, y, e.z, 70, LOCK, 18, { up: 0.6, life: 0.5, gravity: 6 });
        W.spawn(e.x, y - 0.6, e.z, 0.4, 5, 0.4, LOCK, 1);
        F.flash(e.x, y, e.z, 8, 0.28, 0xfff0b0, 1, 160);
        this.addShake(0.3);
        break;
      }
      case 'projHit': {
        const y = groundY(e.x, e.z) + 0.8, c = this.colorOf(e.proj.owner);
        if (e.proj.skill.rapid) { P.burst(e.x, y, e.z, 10, c, 12, { up: 0.7, life: 0.3, gravity: 8 }); this.addShake(0.04); break; }
        P.burst(e.x, y, e.z, 90, c, 22, { dx: e.dx, dz: e.dz, bias: 0.55, up: 0.6, life: 0.55, size: 0.28, gravity: 8 });
        P.burst(e.x, y, e.z, 30, 0xffffff, 12, { up: 1, life: 0.4 });
        W.spawn(e.x, y - 0.7, e.z, 0.4, 4.5, 0.4, c, 1);
        F.flash(e.x, y, e.z, 7, 0.25, c, 1, 150);
        this.addShake(0.32);
        this.punch = Math.max(this.punch, 0.5);
        break;
      }
      case 'projEnd': {
        P.burst(e.x, groundY(e.x, e.z) + 0.8, e.z, 18, this.colorOf(e.proj.owner), 6, { life: 0.35, gravity: 3 });
        break;
      }
      case 'guard': {
        const t = e.top, y = groundY(t.x, t.z);
        W.spawn(t.x, y + 0.1, t.z, 0.6, 3, 0.35, 0xffffff, 0.9);
        P.burst(t.x, y + 0.8, t.z, 40, this.colorOf(t), 8, { up: 1, life: 0.5, gravity: -4 });
        break;
      }
      case 'dash': {
        const t = e.top, y = groundY(t.x, t.z), c = this.colorOf(t);
        W.spawn(t.x, y + 0.1, t.z, 0.6, 4, 0.35, c, 1);
        P.burst(t.x, y + 0.6, t.z, 60, c, 18, { dx: -e.dx, dz: -e.dz, bias: 0.7, up: 0.4, life: 0.45, gravity: 4 });
        F.flash(t.x, y + 0.8, t.z, 5, 0.2, c, 1, 80);
        this.telegraphs = this.telegraphs.filter((g) => !(g.top === t && g.key === 'E'));
        break;
      }
      case 'leap': {
        const t = e.top, y = groundY(t.x, t.z), c = this.colorOf(t);
        W.spawn(t.x, y + 0.1, t.z, 0.6, 6, 0.5, c, 1);
        W.spawn(t.x, y + 0.15, t.z, 0.4, 3.5, 0.35, 0xffffff, 1);
        P.burst(t.x, y + 0.5, t.z, 120, c, 14, { up: 1, bias: 0.4, dy: 1, life: 0.8, gravity: 2 });
        F.flash(t.x, y + 1, t.z, 9, 0.35, c, 1, 200);
        this.addShake(0.3);
        if (!e.skill || e.skill.dmg) this.telegraphs.push({ top: t, key: 'R', skill: e.skill || SKILLS.meteor, t: 0, T: e.T, ax: e.tx, az: e.tz });
        break;
      }
      case 'meteor': {
        const y = groundY(e.x, e.z), c = this.colorOf(e.top), A = SKILLS.meteor.aoe;
        W.spawn(e.x, y + 0.12, e.z, 0.8, A * 1.5, 0.7, 0xffffff, 1);
        W.spawn(e.x, y + 0.14, e.z, 0.5, A * 1.15, 0.55, c, 1);
        W.spawn(e.x, y + 0.16, e.z, 0.3, A * 2.3, 1.0, 0xffa24a, 0.6);
        P.burst(e.x, y + 0.4, e.z, 320, c, 34, { up: 0.75, life: 0.9, size: 0.34, gravity: 14 });
        P.burst(e.x, y + 0.4, e.z, 160, 0xffd9a0, 22, { up: 1, life: 1.1, size: 0.3, gravity: 9 });
        P.burst(e.x, y + 0.2, e.z, 120, 0xffffff, 40, { flat: true, life: 0.4, size: 0.3, gravity: 0, drag: 3 });
        F.flash(e.x, y + 1, e.z, 26, 0.5, 0xffffff, 1, 520);
        F.flash(e.x, y + 1, e.z, 16, 0.8, c, 1, 0);
        const pl = this.pillars[0].m.visible ? this.pillars[1] : this.pillars[0];
        pl.t = 0; pl.T = 0.7; pl.r = A * 0.55; pl.m.scale.y = 1; pl.m.visible = true; pl.m.position.set(e.x, y, e.z); pl.m.material.color.set(c);
        this.scorch.push({ x: e.x, z: e.z, t: 0, T: 2.6, color: c, r: A });
        this.stage.pulseRim(c, 1);
        this.addShake(1.1);
        this.punch = 1;
        break;
      }
      // A realm closing round two tops, and letting them go again.
      case 'realm': case 'realmEnd': {
        const y = groundY(e.x, e.z), c = this.colorOf(e.top), open = e.type === 'realm', R = SKILLS.realmz.aoe;
        if (this.hidden(e.top) && open) break;
        W.spawn(e.x, y + 0.12, e.z, open ? R * 1.6 : 0.6, open ? R : R * 1.3, 0.55, c, 1);
        W.spawn(e.x, y + 0.14, e.z, open ? R * 1.2 : 0.4, open ? R * 0.2 : R, 0.45, 0xffffff, 0.8);
        P.burst(e.x, y + 0.5, e.z, 220, c, open ? 10 : 26, { flat: !open, up: 1, life: 0.9, size: 0.32, gravity: open ? -6 : 4, drag: 2 });
        F.flash(e.x, y + 1, e.z, R * 3, 0.5, c, 1, 320);
        this.stage.pulseRim(c, 1);
        this.addShake(0.6);
        this.punch = 1;
        break;
      }
      case 'ringout': {
        const y = heightAt(ARENA.R) + 0.8;
        const x = e.x + e.nx, z = e.z + e.nz;
        P.burst(x, y, z, 200, 0xff7a4a, 26, { dx: e.nx, dy: 0.7, dz: e.nz, bias: 0.5, up: 1, life: 0.9, size: 0.32, gravity: 12 });
        P.burst(x, y, z, 80, 0xffffff, 16, { up: 1, life: 0.6 });
        F.flash(x, y, z, 14, 0.5, 0xff8a5a, 1, 400);
        this.stage.pulseRim(0xff3b2a, 1.6);
        this.addShake(0.9);
        this.punch = 1;
        break;
      }
      case 'finish': {
        const t = e.loser;
        if (e.kind !== 'over' && e.kind !== 'time') {
          const y = groundY(t.x, t.z) + 0.8;
          P.burst(t.x, y, t.z, 220, this.colorOf(t), 24, { up: 1, life: 1.0, size: 0.32, gravity: 10 });
          P.burst(t.x, y, t.z, 90, 0xffffff, 30, { flat: true, life: 0.5, gravity: 0, drag: 3 });
          W.spawn(t.x, y - 0.7, t.z, 0.6, 9, 0.8, 0xffffff, 1);
          W.spawn(t.x, y - 0.65, t.z, 0.4, 5.5, 0.6, this.colorOf(e.winner), 1);
          F.flash(t.x, y, t.z, 18, 0.6, 0xffffff, 1, 420);
          this.addShake(0.8);
        }
        this.focus = { top: t, w: 0.6, zoom: 0.78 };
        break;
      }
    }
  }

  // Projectile models follow the simulation's list rather than events, so they
  // stay correct when a network snapshot adds, removes or re-owns one.
  syncProjectiles() {
    const live = new Set();
    for (const p of this.world.projectiles) {
      if (this.hidden(p.owner)) continue;
      live.add(p.id);
      let v = this.projs.get(p.id);
      if (!v) {
        const group = new THREE.Group();
        const mat = this.projMat.clone();
        group.add(new THREE.Mesh(this.projGeoFlat, mat), new THREE.Mesh(this.projGeoUp, mat));
        // The chain's hook is a small head; the links are drawn every frame.
        if (p.skill.chain) { group.children[0].scale.setScalar(0.6); group.children[1].scale.setScalar(0.6); }
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glow, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
        sprite.scale.setScalar(4.5);
        group.add(sprite);
        this.scene.add(group);
        v = { proj: p, group, mat, sprite, side: -1 };
        this.projs.set(p.id, v);
      }
      v.proj = p;
      if (v.side !== p.owner.side) {
        v.side = p.owner.side;
        const c = this.colorOf(p.owner);
        v.mat.color.set(c).multiplyScalar(1.5); v.sprite.material.color.set(c);
      }
      v.group.rotation.y = Math.atan2(-p.dz, p.dx);
      v.group.scale.setScalar(Math.max(0.6, p.r / 0.85));
    }
    for (const id of [...this.projs.keys()]) if (!live.has(id)) this.dropProj(id);
  }

  // Positions as currently simulated, taken just before a network correction.
  capture() { return this.world.tops.map((t) => ({ x: t.x, z: t.z })); }
  // After the correction: keep drawing each top where it was and ease the
  // difference away, so small corrections never show as a jump.
  absorb(before) {
    this.world.tops.forEach((t, i) => {
      const v = this.tops[i];
      const ex = before[i].x + v.ox - t.x, ez = before[i].z + v.oz - t.z;
      if (Math.hypot(ex, ez) > 3.5 || t.air || t.out) { v.ox = v.oz = 0; } else { v.ox = ex; v.oz = ez; }
    });
  }

  // The i-th faint copy of a top, made the first time it is asked for.
  // Holograms and phantoms are all drawn with these.
  ghost(v, i, t) {
    let g = v.ghosts[i];
    if (!g) {
      g = v.ghosts[i] = buildTop(t.blade, this.glow);
      g.shield.visible = false; g.aura.visible = false;
      g.group.traverse((m) => { if (m.material && m !== g.shield) { m.material.transparent = true; m.material.opacity = 0.14; m.material.depthWrite = false; m.castShadow = false; } });
      g.blurMat.opacity = 0.08;
      this.scene.add(g.group);
    }
    return g;
  }

  // The same for zones that have a body: clones, turrets and walls.
  syncObjects(dt) {
    const live = new Set();
    for (const z of this.world.zones) {
      const kind = OBJECTS[z.kind];
      if (!kind || z.dead || this.hidden(z.owner)) continue;
      live.add(z.id);
      let o = this.objs.get(z.id);
      if (!o) { o = this.makeObject(z, kind); this.objs.set(z.id, o); }
      const w = wallOf(z), y = groundY(w.x, w.z), c = this.colorOf(z.owner);
      // Flickers as it is about to go.
      const left = z.T - z.t, show = left > 0.8 || Math.sin(this.time * 34) > -0.3;
      o.group.visible = show;
      o.group.position.set(w.x, y, w.z);
      if (kind === 'clone') {
        o.top.spin.rotation.y -= 34 * dt;
        o.top.blur.rotation.z += 11 * dt;
        o.group.rotation.set(0.05 * Math.cos(this.time * 3 + z.id), 0, 0.05 * Math.sin(this.time * 3 + z.id));
      } else if (kind === 'keg') {
        o.group.scale.setScalar(1.25);
        o.mat.color.set(c).multiplyScalar(0.8 + 0.3 * Math.sin(this.time * 6 + z.id));
      } else if (kind === 'turret') {
        const foe = this.world.other(z.owner);
        o.group.rotation.y = Math.atan2(-(foe.z - z.z), foe.x - z.x);
        o.group.scale.setScalar(z.c ? 1.6 : 1);
        o.mat.color.set(c).multiplyScalar(z.a > 0 ? 2.4 + Math.sin(this.time * 40) : 1.4);
      } else {
        const S = z.skill;
        o.group.rotation.y = Math.atan2(w.nx, w.nz);
        o.group.scale.set((z.half ?? S.wall) * 2, z.kind === 'windwall' ? 3.2 : 2.3, z.kind === 'windwall' ? 0.25 : 0.7);
        o.mat.color.set(z.kind === 'icewall' ? ICE : c);
        o.mat.opacity = (z.kind === 'windwall' ? 0.14 : 0.26) * Math.min(1, z.t / 0.15) * (0.85 + 0.15 * Math.sin(this.time * 9));
      }
    }
    for (const [id, o] of this.objs) {
      if (live.has(id)) continue;
      this.dropObject(o);
      this.objs.delete(id);
    }
  }

  makeObject(z, kind) {
    const c = this.colorOf(z.owner);
    if (kind === 'clone') {
      // A copy of the owner's blade. Shadows are the same model, darkened.
      const key = z.owner.side + z.kind;
      const i = this.spare.findIndex((s) => s.key === key);
      let top = i >= 0 ? this.spare.splice(i, 1)[0] : null;
      if (!top) {
        top = buildTop(z.owner.blade, this.glow);
        top.key = key;
        top.shield.visible = false;
        if (z.kind === 'shadow') top.group.traverse((m) => { if (m.material && m.material.color && m !== top.aura && m !== top.blur) m.material.color.multiplyScalar(0.22); });
        top.group.scale.setScalar(z.kind === 'shadow' ? 1 : 0.86);
        top.aura.material.opacity = 0.35;
        top.blurMat.opacity = 0.2;
        this.scene.add(top.group);
      }
      return { kind, group: top.group, top };
    }
    const group = new THREE.Group();
    if (kind === 'keg') {
      const mat = new THREE.MeshBasicMaterial({ color: c });
      group.add(new THREE.Mesh(this.turretGeo[0], this.turretMat), new THREE.Mesh(this.turretGeo[1], mat));
      this.scene.add(group);
      return { kind, group, mat };
    }
    if (kind === 'turret') {
      const head = new THREE.MeshBasicMaterial({ color: c });
      group.add(new THREE.Mesh(this.turretGeo[0], this.turretMat), new THREE.Mesh(this.turretGeo[1], head), new THREE.Mesh(this.turretGeo[2], this.turretMat));
      this.scene.add(group);
      return { kind, group, mat: head };
    }
    const mat = new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(this.wallGeo, mat));
    this.scene.add(group);
    return { kind, group, mat };
  }

  dropObject(o) {
    if (o.kind === 'clone') { o.group.visible = false; this.spare.push(o.top); return; }
    this.scene.remove(o.group);
    o.mat.dispose();
  }

  clearObjects() {
    for (const o of this.objs.values()) this.dropObject(o);
    this.objs.clear();
  }

  dropProj(id) {
    const v = this.projs.get(id);
    if (!v) return;
    this.scene.remove(v.group);
    v.mat.dispose(); v.sprite.material.dispose();
    this.projs.delete(id);
  }

  marker(x, z) { this.markers.push({ x, z, t: 0 }); }

  // ---------------------------------------------------------------- update --
  // dt follows game time (slow motion, hit stop); rdt is wall-clock.
  update(dt, rdt, aim) {
    this.time += rdt;
    const G = this.ground, P = this.particles, w = this.world;
    G.begin();

    if (w) {
      for (const t of w.tops) this.updateTop(t, this.tops[t.side], dt, rdt);
      this.syncProjectiles();
      this.syncObjects(dt);
      for (const v of this.projs.values()) {
        const p = v.proj, y = groundY(p.x, p.z) + 0.85;
        v.group.position.set(p.x, y, p.z);
        if (p.skill.chain) this.chain(p.owner.x, p.owner.z, p.x, p.z, this.colorOf(p.owner), 1);
        // Where a recast would go off.
        if (p.crawl) { G.ring(p.x, p.z, 0, p.skill.field, this.colorOf(p.owner), 0.1); G.ring(p.x, p.z, p.skill.field - 0.1, p.skill.field, this.dangerOf(p.owner), 0.7); }
        if (p.skill.re && SKILLS[p.skill.re].aoe) { const A = SKILLS[p.skill.re].aoe; G.ring(p.x, p.z, A - 0.1, A, this.dangerOf(p.owner), 0.55); G.ring(p.x, p.z, 0, A, this.dangerOf(p.owner), 0.06); }
        v.group.children[1].rotation.x += dt * 22;
        // A phantom is its copy, not a bolt.
        v.group.children[0].visible = v.group.children[1].visible = !p.skill.ghost;
        if (dt > 0) for (let i = 0; i < 3; i++) {
          P.emit(p.x - p.dx * Math.random() * 1.2 + (Math.random() - 0.5) * 0.9, y + (Math.random() - 0.5) * 0.8, p.z - p.dz * Math.random() * 1.2 + (Math.random() - 0.5) * 0.9,
            -p.dx * 4, Math.random() * 2, -p.dz * 4, 0.3, 0.3, this.colorOf(p.owner), 0, 1);
        }
      }
      // Phantoms: zones and shots that are shown as a faint copy of their owner.
      for (const t of w.tops) {
        const v = this.tops[t.side], spots = [], seen = !this.hidden(t);
        if (seen) for (const z of w.zones) if (z.skill.ghost && z.owner === t && !z.dead) spots.push(z);
        if (seen) for (const p of w.projectiles) if (p.skill.ghost && p.owner === t) spots.push(p);
        // The place a jump can still be undone to.
        if (seen && t.blade.ghostRet) { if (t.ret) spots.push(t.ret); if (t.ret2) spots.push(t.ret2); }
        const first = t.blade.rewind ? 1 : 0;
        spots.forEach((s, i) => { const g = this.ghost(v, first + i, t); g.group.visible = true; g.group.position.set(s.x, groundY(s.x, s.z), s.z); g.spin.rotation.y -= 30 * dt; });
        for (let i = first + spots.length; i < v.ghosts.length; i++) if (v.ghosts[i]) v.ghosts[i].group.visible = false;
      }
      this.drawTelegraphs(dt);
      this.drawOngoing(dt);
      const me = w.tops[this.playerSide];
      if (!w.result && !me.out) {
        // Selection ring and the standing move order.
        if (!me.air) G.ring(me.x, me.z, 1.55, 1.63, 0xffffff, 0.45);
        if (me.cmd) {
          const pulse = 0.5 + 0.5 * Math.sin(this.time * 10);
          G.ring(me.cmd.x, me.cmd.z, 0.25 + pulse * 0.1, 0.42 + pulse * 0.1, AIM, 0.8);
          const dx = me.cmd.x - me.x, dz = me.cmd.z - me.z, d = Math.hypot(dx, dz);
          if (d > 1.6) G.rect(me.x + (dx / d) * 1.4, me.z + (dz / d) * 1.4, dx / d, dz / d, d - 1.8, 0.035, AIM, 0.35);
        }
        if (aim) this.drawAim(aim, me, w);
      }
    }

    for (const m of this.markers) {
      m.t += rdt;
      const k = m.t / 0.45;
      if (k < 1) { const r = 1.5 - 1.1 * k; G.ring(m.x, m.z, r - 0.12, r, AIM, 1 - k); G.ring(m.x, m.z, 0, 0.18, 0xffffff, 1 - k); }
    }
    if (this.markers.length && this.markers[0].t > 0.45) this.markers.shift();
    for (const s of this.scorch) {
      s.t += dt;
      const k = s.t / s.T;
      if (k < 1) { G.ring(s.x, s.z, 0, s.r * (0.9 + 0.1 * k), 0xff7a2a, 0.22 * (1 - k) * (1 - k)); G.ring(s.x, s.z, s.r * 0.92, s.r, s.color, 0.6 * (1 - k)); }
    }
    if (this.scorch.length && this.scorch[0].t > this.scorch[0].T) this.scorch.shift();
    for (const pl of this.pillars) {
      if (!pl.m.visible) continue;
      pl.t += rdt;
      const k = pl.t / pl.T;
      if (k >= 1) { pl.m.visible = false; continue; }
      pl.m.material.opacity = 0.75 * (1 - k) * (1 - k);
      pl.m.scale.x = pl.m.scale.z = pl.r * (1 - 0.6 * k);
    }

    // Effects keep moving a little during hit stop so the freeze still sparkles.
    const fdt = Math.max(dt, rdt * 0.12);
    P.update(fdt);
    this.waves.update(fdt);
    this.flashes.update(fdt);
    this.stage.update(rdt, this.time);
    this.updateCamera(rdt);
  }

  updateTop(t, v, dt, rdt) {
    const P = this.particles;
    const gy = groundY(t.x, t.z);
    const egg = t.egg > 0, sr = egg ? 0.06 : spinRatio(t), c = this.colorOf(t);
    let lift = 0;
    if (v.hold) {
      // Hovering over the start position until the countdown ends.
      v.drop = 7 + Math.sin(this.time * 3 + t.side * 2) * 0.18;
    } else if (v.drop > 0) {
      v.dropV += 60 * rdt; v.drop -= v.dropV * rdt;
      if (v.drop <= 0) {
        v.drop = 0;
        this.waves.spawn(t.x, gy + 0.1, t.z, 0.5, 4.5, 0.45, c, 1);
        P.burst(t.x, gy + 0.3, t.z, 70, c, 13, { up: 0.6, life: 0.6 });
        P.burst(t.x, gy + 0.3, t.z, 30, HOT, 9, { up: 0.9, life: 0.5 });
        this.flashes.flash(t.x, gy + 0.6, t.z, 6, 0.25, c, 1, 120);
        this.addShake(0.28);
        this.landed = (this.landed || 0) + 1;
      }
    }
    if (t.out) lift = heightAt(ARENA.R) - gy + t.out.y;
    else if (t.air) lift = Math.sin(Math.PI * Math.min(1, t.air.t / t.air.T)) * (t.air.skill.height ?? 5);
    // Knocked up: it hangs in the air until the timer runs out.
    v.hover += ((t.up > 0 || (t.charge && t.charge.skill.veil) ? 1 : 0) - v.hover) * Math.min(1, rdt * 16);
    lift += v.drop + v.hover * (2.1 + 0.25 * Math.sin(this.time * 11));
    const y = gy + lift;
    // Network smoothing offset, fading out quickly.
    const fade = Math.exp(-rdt * 14);
    v.ox *= fade; v.oz *= fade;
    v.group.position.set(t.x + v.ox, y, t.z + v.oz);
    const hid = this.hidden(t);
    v.group.visible = !hid && !(t.out && t.out.t > 2.2);
    v.light.position.set(t.x + v.ox, y + 3.2, t.z + v.oz);
    v.light.intensity = v.group.visible ? 2 + 4 * sr + (t.dash || t.air ? 8 : 0) : 0;

    const dead = t.spin <= 0 && !t.out;
    v.fall = dead ? Math.min(1, v.fall + rdt * 1.6) : 0;
    const rate = (5 + 42 * sr) * (1 - v.fall);
    v.spin.rotation.y -= t.dir * rate * dt;
    v.blur.rotation.z += 11 * dt;
    v.blurMat.opacity = (0.05 + 0.2 * sr) * (1 - v.fall);
    v.wobble += (2.4 + 7 * (1 - sr)) * dt;
    let amp = egg ? 0 : 0.03 + 0.4 * Math.pow(1 - sr, 2.2) + (t.tumble > 0 || t.up > 0 || t.stun > 0 ? 0.14 : 0);
    if (t.frost > 0 && !hid) this.ground.ring(t.x, t.z, 0, 1.5, ICE, 0.22);
    if (t.snare > 0 && !hid) this.ground.ring(t.x, t.z, 1.5, 1.75, 0xffffff, 0.5 + 0.3 * Math.sin(this.time * 14));
    amp = amp * (1 - v.fall) + 0.62 * v.fall;
    if (t.out) {
      v.group.rotation.x += rdt * 7; v.group.rotation.z += rdt * 5;
    } else {
      v.group.rotation.set(amp * Math.cos(v.wobble) + t.vz * 0.006, 0, amp * Math.sin(v.wobble) - t.vx * 0.006);
    }
    v.group.scale.setScalar(t.air ? 1 + 0.35 * Math.sin(Math.PI * Math.min(1, t.air.t / t.air.T)) : egg ? 0.8 : 1);
    // Mid-blink the body is gone; only the streak of light is left.
    v.spin.visible = v.blur.visible = !t.blink;

    const ready = t.ult >= 100 && !this.world.result && !!t.blade.hasUlt;
    v.aura.material.opacity = (0.1 + 0.16 * sr + (ready ? 0.22 + 0.14 * Math.sin(this.time * 9) : 0)) * (1 - v.fall);
    v.aura.visible = lift < 0.5;
    v.aura.scale.setScalar(ready ? 7.5 : 5.5);
    v.body.emissiveIntensity = 0.14 + (ready ? 0.25 + 0.15 * Math.sin(this.time * 9) : 0) + (t.dash ? 0.8 : 0) + (t.empower > 0 ? 0.5 + 0.3 * Math.sin(this.time * 30) : 0) + (t.charge || t.chan ? 1.2 : 0) + (t.buff > 0 ? 0.45 + 0.2 * Math.sin(this.time * 14) : 0);

    const target = t.guard > 0 || egg ? 1 : t.shield > 0 ? 0.5 : 0;
    v.shieldAlpha += (target - v.shieldAlpha) * Math.min(1, rdt * 14);
    v.shield.visible = v.shieldAlpha > 0.02;
    if (v.shield.visible) {
      v.shieldMat.uniforms.uTime.value = this.time;
      // Flickers as it is about to run out.
      const warn = t.guard > 0 && t.guard < 0.35 ? 0.5 + 0.5 * Math.sin(this.time * 50) : 1;
      v.shieldMat.uniforms.uAlpha.value = v.shieldAlpha * warn;
      v.shield.rotation.y += rdt * 2;
    }

    if (t.blade.rewind) {
      // The hologram: where this top stood a few seconds ago, and where its ultimate returns to.
      const h = t.hist[0], holo = this.ghost(v, 0, t);
      holo.group.visible = !!h && !t.out && !t.air && !this.world.result && !hid;
      if (h) {
        // Eased, so it glides rather than hopping from sample to sample.
        const g = holo.group.position, k = Math.min(1, rdt * 10);
        g.set(g.x + (h.x - g.x) * k, groundY(h.x, h.z), g.z + (h.z - g.z) * k);
        holo.spin.rotation.y -= 30 * dt;
      }
    }
    v.trail.boost = t.dash || t.blink ? 1 : t.air ? 0.6 : t.empower > 0 ? 0.5 : 0;
    if (hid) v.trail.reset(); else if (!t.out && v.drop <= 0) v.trail.push(t.x + v.ox, t.z + v.oz, lift);
    v.trail.update(rdt);

    if (dt <= 0 || t.out || hid) return;
    const sp = Math.hypot(t.vx, t.vz);
    const mote = (col, vy, n) => { for (let i = 0; i < n; i++) P.emit(t.x + (Math.random() - 0.5) * 1.8, y + 0.3 + Math.random() * 1.2, t.z + (Math.random() - 0.5) * 1.8, 0, vy, 0, 0.5, 0.2, col, vy < 0 ? 6 : -2, 1); };
    if (t.bleed > 0 && Math.random() < 0.12 * t.bleed) mote(BLOOD, -1, 1);
    if (t.poison > 0 && Math.random() < 0.5) mote(TOXIC, 1.5, 1);
    if (t.buff > 0 && Math.random() < 0.5) mote(c, 3, 1);
    if (t.toggle && Math.random() < 0.7) mote(TOXIC, 0.5, 1);
    if (t.haste > 0 && Math.random() < 0.5) mote(0xffffff, 2, 1);
    if (t.charm > 0) mote(t.charmDir > 0 ? 0xff7ad0 : 0x9a6aff, 2, 2);
    if (t.blink) {
      for (let i = 0; i < 8; i++) P.emit(t.x + (Math.random() - 0.5) * 1.2, gy + 0.3 + Math.random() * 1.2, t.z + (Math.random() - 0.5) * 1.2, 0, Math.random(), 0, 0.4, 0.4, Math.random() < 0.3 ? 0xffffff : c, 0, 2);
      return;
    }
    if (t.empower > 0 && Math.random() < 0.8) {
      const a = Math.random() * 6.283;
      P.emit(t.x + Math.cos(a) * 1.3, gy + 0.4 + Math.random() * 0.9, t.z + Math.sin(a) * 1.3, -Math.sin(a) * 6, 1, Math.cos(a) * 6, 0.25, 0.26, Math.random() < 0.5 ? 0xffffff : c, 0, 1);
    }
    if (t.dash) {
      for (let i = 0; i < 6; i++) P.emit(t.x + (Math.random() - 0.5) * 1.6, y + 0.3 + Math.random() * 0.9, t.z + (Math.random() - 0.5) * 1.6, -t.vx * 0.1, Math.random() * 2, -t.vz * 0.1, 0.35, 0.34, c, 0, 2);
    } else if (t.air) {
      for (let i = 0; i < 5; i++) P.emit(t.x + (Math.random() - 0.5) * 1.4, y + Math.random(), t.z + (Math.random() - 0.5) * 1.4, (Math.random() - 0.5) * 3, -4, (Math.random() - 0.5) * 3, 0.5, 0.36, Math.random() < 0.5 ? c : 0xffc27a, 4, 1);
    } else {
      // Grinding sparks from the tip: more of them the faster it scrapes along.
      if (Math.random() < sp * 0.03 * (dead ? 0 : 1)) P.emit(t.x, gy + 0.08, t.z, -t.vx * 0.2 + (Math.random() - 0.5) * 3, 1.5 + Math.random() * 2.5, -t.vz * 0.2 + (Math.random() - 0.5) * 3, 0.35, 0.14, HOT, 14, 1);
      if (ready && Math.random() < 0.5) {
        const a = Math.random() * 6.283;
        P.emit(t.x + Math.cos(a) * 1.2, gy + 0.2, t.z + Math.sin(a) * 1.2, 0, 3 + Math.random() * 3, 0, 0.6, 0.2, c, -2, 0.5);
      }
      if (t.slow > 0 && Math.random() < 0.4) P.emit(t.x + (Math.random() - 0.5) * 1.6, gy + 1.4, t.z + (Math.random() - 0.5) * 1.6, 0, -1.5, 0, 0.5, 0.2, 0x9ab4ff, 0, 0.5);
      if (sr < 0.25 && !dead && Math.random() < 0.3) P.emit(t.x + (Math.random() - 0.5), gy + 0.1, t.z + (Math.random() - 0.5), (Math.random() - 0.5) * 4, 2 + Math.random() * 2, (Math.random() - 0.5) * 4, 0.4, 0.16, 0xff8a4a, 12, 1);
    }
  }

  // A taut line of links between two points, floating just above the floor.
  chain(x0, z0, x1, z1, color, alpha) {
    const dx = x1 - x0, dz = z1 - z0, d = Math.hypot(dx, dz);
    if (d < 0.5) return;
    this.ground.rect(x0, z0, dx / d, dz / d, d, 0.07, color, 0.9 * alpha, 0.85);
    this.ground.rect(x0, z0, dx / d, dz / d, d, 0.2, color, 0.22 * alpha, 0.84);
  }

  // Motes that fly from one top into another (drain, life steal).
  siphon(from, to, n, color) {
    const y0 = groundY(from.x, from.z) + 0.9;
    for (let i = 0; i < n; i++) {
      const life = 0.3 + Math.random() * 0.3;
      const sx = from.x + (Math.random() - 0.5) * 1.6, sz = from.z + (Math.random() - 0.5) * 1.6;
      this.particles.emit(sx, y0 + (Math.random() - 0.5), sz, (to.x - sx) / life, (Math.random() - 0.5) * 2, (to.z - sz) / life, life, 0.3, color, 0, 0);
    }
  }

  // Effects that last a while: zones, charging, orbs, the drain link, fading cones.
  drawOngoing(dt) {
    const G = this.ground, P = this.particles, w = this.world;
    for (const z of w.zones) {
      const k = Math.min(1, z.t / z.T);
      // (The ring of a realm is the one thing of it that shows from outside, faintly.)
      if (z.kind !== 'realmz' && this.hidden(z.owner)) continue;
      if (this.drawZone(z, k, dt)) continue;
      if (z.kind === 'quake' || z.kind === 'grenade' || z.skill.kind === 'blast') {
        const col = this.dangerOf(z.owner), pulse = 0.5 + 0.5 * Math.sin(this.time * 20);
        G.ring(z.x, z.z, 0, z.r, col, 0.1 + 0.08 * pulse);
        G.ring(z.x, z.z, 0, z.r * k, col, 0.26);
        G.ring(z.x, z.z, z.r - 0.13, z.r, col, 0.95);
        if (dt > 0 && Math.random() < 0.6) {
          const a = Math.random() * 6.283, r = Math.random() * z.r;
          P.emit(z.x + Math.cos(a) * r, groundY(z.x, z.z) + 0.1, z.z + Math.sin(a) * r, 0, 2 + Math.random() * 3, 0, 0.3, 0.16, 0xd8c8a0, 10, 1);
        }
      } else {
        const c = this.colorOf(z.owner), fade = Math.min(1, (z.T - z.t) / 0.5, z.t / 0.2);
        const breath = 0.5 + 0.5 * Math.sin(this.time * 3);
        G.ring(z.x, z.z, 0, z.r, c, (0.1 + 0.05 * breath) * fade);
        G.ring(z.x, z.z, 0, z.r * 0.55, HEAL, 0.07 * fade);
        G.ring(z.x, z.z, z.r - 0.12, z.r, c, 0.85 * fade);
        // Remaining time, as an arc just inside the rim.
        G.ring(z.x, z.z, z.r - 0.42, z.r - 0.28, 0xffffff, 0.7 * fade, 0.1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - k));
        if (dt > 0) for (let i = 0; i < 2; i++) {
          const a = Math.random() * 6.283, r = Math.sqrt(Math.random()) * z.r;
          P.emit(z.x + Math.cos(a) * r, groundY(z.x, z.z) + 0.1, z.z + Math.sin(a) * r, 0, 1.5 + Math.random() * 2.5, 0, 0.9, 0.16, Math.random() < 0.5 ? HEAL : c, -1, 0.4);
        }
      }
    }
    for (const t of w.tops) {
      const v = this.tops[t.side], c = this.colorOf(t), gy = groundY(t.x, t.z);
      if (this.hidden(t)) { for (const o of v.orbs) o.visible = false; continue; }
      // DARKNESS RISE: the blows counted so far, then the aura itself.
      const AU = t.blade.aura;
      if (AU && t.stack >= AU.hits && !t.out) {
        const pulse = 0.5 + 0.5 * Math.sin(this.time * 7);
        G.ring(t.x, t.z, 0, AU.r, c, 0.1 + 0.06 * pulse);
        G.ring(t.x, t.z, AU.r - 0.14, AU.r, this.dangerOf(t), 0.75);
        if (dt > 0) for (let i = 0; i < 3; i++) { const a = Math.random() * 6.283, r = Math.sqrt(Math.random()) * AU.r; P.emit(t.x + Math.cos(a) * r, gy + 0.1, t.z + Math.sin(a) * r, 0, 1.5 + Math.random() * 2, 0, 0.6, 0.2, c, -2, 0.6); }
      } else if (AU && t.stack > 0 && !t.out) {
        for (let i = 0; i < t.stack; i++) { const a = -Math.PI / 2 + (i - (t.stack - 1) / 2) * 0.5; G.ring(t.x + Math.cos(a) * 1.9, t.z + Math.sin(a) * 1.9, 0, 0.18, c, 0.95, 0.12); }
      }
      if (t.charge && t.charge.skill.id === 'realm') {
        // Opening a realm: the reach of it, and the one it is opening for.
        const S = t.charge.skill, k = Math.min(1, t.charge.t / t.charge.T), col = this.dangerOf(t), o = w.tops[t.prey];
        G.ring(t.x, t.z, S.range - 0.1, S.range, col, 0.5);
        if (o && !o.gone) { G.ring(o.x, o.z, 1.6, 1.6 + 1.6 * (1 - k), col, 0.9); this.chain(t.x, t.z, o.x, o.z, col, 0.6 + 0.4 * k); }
      } else if (t.charge && t.charge.skill.kind === 'cone') {
        const S = t.charge.skill, ch = t.charge, col = this.dangerOf(t), a = Math.atan2(ch.dz, ch.dx);
        G.sector(t.x, t.z, ch.dx, ch.dz, S.range, S.half, col, 0.12, 0.85);
        G.ring(t.x, t.z, 0, S.range * Math.min(1, ch.t / ch.T), col, 0.25, 0.09, a - S.half, a + S.half);
        // The edge of the blade, where it bites deepest.
        if (S.tip) G.ring(t.x, t.z, S.tip, S.range, 0xffffff, 0.22 + 0.1 * Math.sin(this.time * 18), 0.1, a - S.half, a + S.half);
      } else if (t.charge && t.charge.skill.ahead) {
        // A slam just in front: the middle is the sweet spot.
        const S = t.charge.skill, ch = t.charge, k = Math.min(1, ch.t / ch.T), col = this.dangerOf(t), cx = t.x + ch.dx * S.ahead, cz = t.z + ch.dz * S.ahead;
        G.ring(cx, cz, 0, S.aoe, col, 0.12);
        G.ring(cx, cz, 0, S.aoe * k, col, 0.22);
        G.ring(cx, cz, S.aoe - 0.14, S.aoe, col, 0.95);
        G.ring(cx, cz, 0, S.tip, 0xffffff, 0.22 + 0.1 * Math.sin(this.time * 18));
      } else if (t.charge && (t.charge.skill.kind === 'beam' || t.charge.skill.kind === 'shot')) {
        // The lane a beam is about to fill.
        const S = t.charge.skill, ch = t.charge, k = Math.min(1, ch.t / ch.T), col = this.dangerOf(t);
        const len = Math.min(S.range, toWall(t.x, t.z, ch.dx, ch.dz));
        G.lane(t.x, t.z, ch.dx, ch.dz, len, S.radius, col, 0.1 + 0.06 * Math.sin(this.time * 22), 0.85);
        G.rect(t.x, t.z, ch.dx, ch.dz, len, S.radius * k, col, 0.28);
        if (S.tip && len > S.tip) G.rect(t.x + ch.dx * S.tip, t.z + ch.dz * S.tip, ch.dx, ch.dz, len - S.tip, S.radius, 0xffffff, 0.22 + 0.1 * Math.sin(this.time * 18));
      } else if (t.charge) {
        const S = t.charge.skill, k = Math.min(1, t.charge.t / t.charge.T), col = this.dangerOf(t);
        const pulse = 0.5 + 0.5 * Math.sin(this.time * 22), in0 = S.inner || 0;
        G.ring(t.x, t.z, in0, S.aoe, col, 0.08 + 0.07 * pulse);
        G.ring(t.x, t.z, in0, in0 + (S.aoe - in0) * k, col, 0.22);
        G.ring(t.x, t.z, S.aoe - 0.14, S.aoe, col, 0.95);
        if (in0) G.ring(t.x, t.z, in0 - 0.08, in0, col, 0.6);
        // Energy drawn in from all around.
        if (dt > 0) for (let i = 0; i < 6; i++) {
          const a = Math.random() * 6.283, r = 3 + Math.random() * 4, life = 0.3;
          P.emit(t.x + Math.cos(a) * r, gy + 0.3 + Math.random() * 1.5, t.z + Math.sin(a) * r, (-Math.cos(a) * r) / life, 0, (-Math.sin(a) * r) / life, life, 0.3, c, 0, 0);
        }
      }
      for (let i = 0; i < v.orbs.length; i++) {
        const o = v.orbs[i];
        o.visible = !!(t.orbs && t.orbs.alive & (1 << i));
        if (!o.visible) continue;
        const p = w.orbPos(t, i), y = groundY(p.x, p.z) + 0.95;
        o.position.set(p.x, y, p.z);
        // Blink out as the skill is about to expire.
        o.children[1].material.opacity = t.orbs.t < 1 ? 0.5 + 0.5 * Math.sin(this.time * 30) : 1;
        if (dt > 0) P.emit(p.x, y, p.z, (Math.random() - 0.5) * 2, Math.random() * 1.5, (Math.random() - 0.5) * 2, 0.35, 0.3, c, 0, 1);
      }
      if (t.tether) {
        const o = w.tops[t.tether.to] || w.other(t), wob = 0.5 + 0.5 * Math.sin(this.time * 26);
        const dx = o.x - t.x, dz = o.z - t.z, d = Math.hypot(dx, dz) || 1;
        const TS = t.tether.skill, safe = TS.safe ?? TS.range;
        const strain = clamp((d - safe) / (TS.breakRange - safe), 0, 1);
        G.rect(t.x, t.z, dx / d, dz / d, d, 0.12 + 0.08 * wob, strain > 0.5 ? 0xffffff : c, 0.95, 0.9);
        G.rect(t.x, t.z, dx / d, dz / d, d, 0.5 + 0.2 * wob, c, 0.2 * (1 - strain * 0.7), 0.88);
        G.ring(o.x, o.z, 1.5, 1.7, c, 0.5 + 0.4 * wob);
        if (dt > 0 && TS.drain) this.siphon(o, t, 2, Math.random() < 0.5 ? c : HEAL);
        // A chain that pays off when its time is up: show how long is left.
        if (!TS.drain) G.ring(o.x, o.z, 1.8, 2.0, 0xffffff, 0.8, 0.1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (t.tether.t / t.tether.T));
      }
      // The death mark shows on whoever carries it.
      const foe = (t.dmark > 0 && w.tops[t.dmarkTo]) || w.other(t);
      // Winding something up: the other side sees how far it reaches by now.
      if (t.hold && t.side !== this.playerSide) {
        const H = t.hold, S = w.aimSkill(t, H.key), R = w.holdRange(t, H.key, true), col = this.dangerOf(t), pulse = 0.5 + 0.3 * Math.sin(this.time * 18);
        G.ring(t.x, t.z, R - 0.08, R, col, pulse);
        // And, once it is known, which way: the lane or fan it would fill if let go now.
        if (H.dx || H.dz) {
          if (S.aim === 'cone') G.sector(t.x, t.z, H.dx, H.dz, R, S.half, col, 0.1 + 0.06 * pulse, 0.85);
          else { const len = Math.min(R, toWall(t.x, t.z, H.dx, H.dz)); if (len > 1.5) G.lane(t.x + H.dx * 1.4, t.z + H.dz * 1.4, H.dx, H.dz, len - 1.4, S.aim === 'dash' ? 1.25 : S.radius, col, 0.1 + 0.06 * pulse, 0.85); }
        }
      }
      // Low enough to be executed: marked for all to see.
      const X = SKILLS[t.blade.kit.R];
      if (X.line && !X.per && foe.egg <= 0 && !foe.out && spinRatio(foe) < X.line) {
        const pulse = 0.6 + 0.4 * Math.sin(this.time * 12);
        for (const [dx, dz] of [[0.707, 0.707], [0.707, -0.707]]) G.rect(foe.x - dx * 1.5, foe.z - dz * 1.5, dx, dz, 3, 0.1, BLOOD, pulse, 0.12);
        G.ring(foe.x, foe.z, 2.0, 2.15, BLOOD, pulse);
      }
      if (t.chan) {
        // The cone a barrage can turn within, and the beat of its shots.
        const S = t.chan.skill, col = this.dangerOf(t), a = Math.atan2(t.chan.dz, t.chan.dx);
        const beat = clamp(1 - t.cd.R / S.every, 0, 1);
        if (S.half >= 3) {
          // It can turn anywhere: just the stance, and the beat of its shots.
          G.ring(t.x, t.z, 2.2, 2.4, col, 0.8);
          G.ring(t.x, t.z, 0, 2.2 * beat, col, 0.18);
        } else {
          G.sector(t.x, t.z, t.chan.dx, t.chan.dz, S.range, S.half, col, 0.07, 0.6);
          G.ring(t.x, t.z, 0, S.range * beat, col, 0.1, 0.09, a - S.half, a + S.half);
        }
      }
      // Marks on the other top.
      if (t.dmark > 0) {
        const pulse = 0.5 + 0.5 * Math.sin(this.time * 16), k = t.dmark / SKILLS.deathmark.dur;
        for (const [dx, dz] of [[0.707, 0.707], [0.707, -0.707]]) G.rect(foe.x - dx * 1.9, foe.z - dz * 1.9, dx, dz, 3.8, 0.12, BLOOD, 0.7 + 0.3 * pulse, 0.12);
        G.ring(foe.x, foe.z, 2.0, 2.2, BLOOD, 0.9, 0.1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k);
      }
      if (foe.mark > 0) G.ring(foe.x, foe.z, 1.6, 1.85, c, 0.6 + 0.3 * Math.sin(this.time * 12));
      // Marked for execution: the ring drains with the time left.
      if (foe.shred > 0) G.ring(foe.x, foe.z, 1.45, 1.6, 0xffc060, 0.5 + 0.3 * Math.sin(this.time * 9));
      if (foe.doom > 0) { G.ring(foe.x, foe.z, 2.0, 2.2, BLOOD, 0.9, 0.1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (foe.doom / 5)); G.ring(foe.x, foe.z, 0, 0.3, BLOOD, 0.9, 0.12); }
      for (let i = 0; i < foe.tag; i++) { const a = -Math.PI / 2 + (i - (foe.tag - 1) / 2) * 0.42; G.ring(foe.x + Math.cos(a) * 2.1, foe.z + Math.sin(a) * 2.1, 0, 0.2, 0xffffff, 0.95, 0.12); }
      if (foe.bleed > 0) for (let i = 0; i < foe.bleed; i++) { const a = -Math.PI / 2 + (i - (foe.bleed - 1) / 2) * 0.42; G.ring(foe.x + Math.cos(a) * 2.1, foe.z + Math.sin(a) * 2.1, 0, 0.2, BLOOD, 0.95, 0.12); }
      // Where a return trip would end.
      if (t.ret && t.side === this.playerSide) { G.ring(t.ret.x, t.ret.z, 1.1, 1.25, c, 0.7); G.ring(t.ret.x, t.ret.z, 0, 1.1, c, 0.1); }
    }
    for (const cn of this.cones) {
      cn.t += dt;
      const k = cn.t / cn.T;
      if (k < 1) G.sector(cn.x, cn.z, cn.dx, cn.dz, cn.skill.range, cn.skill.half, cn.color, 0.5 * (1 - k) * (1 - k), 0.9 * (1 - k));
    }
    if (this.cones.length && this.cones[0].t > this.cones[0].T) this.cones.shift();
    for (const b of this.beams) {
      b.t += dt;
      const k = b.t / b.T;
      if (k < 1) { G.rect(b.x, b.z, b.dx, b.dz, b.len, b.hw * (1 - 0.5 * k), b.color, 0.6 * (1 - k), 0.14); G.rect(b.x, b.z, b.dx, b.dz, b.len, b.hw * 0.35 * (1 - k), 0xffffff, 0.9 * (1 - k), 0.16); }
    }
    if (this.beams.length && this.beams[0].t > this.beams[0].T) this.beams.shift();
  }

  // Floor decals for the zones the newer blades place. Returns false for the
  // kinds drawn by the caller.
  drawZone(z, k, dt) {
    const G = this.ground, P = this.particles, S = z.skill;
    const c = this.colorOf(z.owner), col = this.dangerOf(z.owner), mine = z.owner.side === this.playerSide;
    const fade = Math.min(1, (z.T - z.t) / 0.5, z.t / 0.2), gy = groundY(z.x, z.z);
    const speck = (color, vy, grav) => { const a = Math.random() * 6.283, r = Math.sqrt(Math.random()) * z.r; P.emit(z.x + Math.cos(a) * r, gy + 0.1, z.z + Math.sin(a) * r, 0, vy, 0, 0.8, 0.18, color, grav, 0.5); };
    const timer = () => G.ring(z.x, z.z, z.r - 0.42, z.r - 0.28, 0xffffff, 0.6 * fade, 0.1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - k));
    switch (z.kind) {
      case 'realmz': {
        // From inside: a dark floor walled by a burning ring, with the time left on it.
        // From outside: only a faint mark of where the two went.
        if (this.hidden(z.owner)) { G.ring(z.x, z.z, z.r - 0.1, z.r, c, 0.16 + 0.06 * Math.sin(this.time * 3)); return true; }
        const flick = 0.75 + 0.25 * Math.sin(this.time * 9);
        G.ring(z.x, z.z, 0, z.r, 0x020806, 0.42 * fade, 0.05);
        G.ring(z.x, z.z, z.r - 1.6, z.r, c, 0.14 * fade);
        G.ring(z.x, z.z, z.r - 0.3, z.r, c, 0.95 * flick);
        G.ring(z.x, z.z, z.r, z.r + 0.5, 0xffffff, 0.16 * flick);
        G.ring(z.x, z.z, z.r - 0.75, z.r - 0.55, 0xffffff, 0.7 * fade, 0.1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - k));
        if (dt > 0) for (let i = 0; i < 6; i++) { const a = Math.random() * 6.283; P.emit(z.x + Math.cos(a) * z.r, groundY(z.x + Math.cos(a) * z.r, z.z + Math.sin(a) * z.r) + 0.1, z.z + Math.sin(a) * z.r, 0, 3 + Math.random() * 5, 0, 0.9, 0.3, Math.random() < 0.3 ? 0xffffff : c, -3, 0.4); }
        return true;
      }
      case 'lotus':
        if (z.c) {
          // Sprung: a blast is coming.
          const kk = Math.min(1, (z.t - z.a) / S.fuse), pulse = 0.5 + 0.5 * Math.sin(this.time * 22);
          G.ring(z.x, z.z, 0, z.r, col, 0.1 + 0.08 * pulse);
          G.ring(z.x, z.z, 0, z.r * kk, col, 0.26);
          G.ring(z.x, z.z, z.r - 0.13, z.r, col, 0.95);
        } else {
          // Hard to see from the other side until it is stepped on.
          const a = (mine ? 0.8 : 0.16) * Math.min(1, z.t / S.arm);
          G.ring(z.x, z.z, S.trig - 0.1, S.trig, c, a);
          G.ring(z.x, z.z, 0, 0.35, c, a);
          for (let i = 0; i < 4; i++) { const an = this.time * 0.8 + i * 1.571; G.ring(z.x + Math.cos(an) * 0.8, z.z + Math.sin(an) * 0.8, 0, 0.28, c, a * 0.8); }
        }
        return true;
      case 'blizzard':
        G.ring(z.x, z.z, 0, z.r, ICE, (0.05 + 0.02 * Math.sin(this.time * 5)) * fade);
        G.ring(z.x, z.z, z.r - 0.14, z.r, col, 0.9 * fade);
        timer();
        if (dt > 0) for (let i = 0; i < 5; i++) { const a = Math.random() * 6.283, r = Math.sqrt(Math.random()) * z.r; P.emit(z.x + Math.cos(a) * r, gy + 2 + Math.random() * 2.5, z.z + Math.sin(a) * r, 5, -5, 2, 0.7, 0.2, Math.random() < 0.5 ? 0xffffff : ICE, 0, 0.2); }
        return true;
      case 'poison':
        G.ring(z.x, z.z, 0, z.r, TOXIC, 0.2 * Math.min(1, (z.T - z.t) / 1.2));
        if (dt > 0 && Math.random() < 0.06) speck(TOXIC, 1 + Math.random() * 2, -1);
        return true;
      case 'glue':
        G.ring(z.x, z.z, 0, z.r, 0xffe9a8, 0.13 * fade);
        G.ring(z.x, z.z, z.r - 0.14, z.r, col, 0.85 * fade);
        G.ring(z.x, z.z, z.r * 0.45, z.r * 0.5, 0xffe9a8, 0.3 * fade);
        timer();
        return true;
      case 'turret': case 'sentry':
        if (mine) G.ring(z.x, z.z, S.reach - 0.05, S.reach, c, 0.12);
        G.ring(z.x, z.z, 1.2, 1.35, col, 0.7);
        return true;
      case 'arise': {
        const idle = !(z.c & 1) && Math.hypot(z.owner.x - z.x, z.owner.z - z.z) > S.leash;
        G.ring(z.x, z.z, S.reach - 0.1, S.reach, col, idle ? 0.2 : 0.7);
        G.ring(z.x, z.z, 0, S.reach, col, idle ? 0.02 : 0.06);
        if (z.c & 1) G.ring(z.dx, z.dz, 0.5, 0.65, col, 0.8);
        return true;
      }
      case 'shadow':
        G.ring(z.x, z.z, 1.3, 1.45, c, 0.5 * fade);
        if (dt > 0 && Math.random() < 0.4) speck(0x30304a, 2, -2);
        return true;
      case 'icewall': case 'windwall': case 'divide': case 'weaverz': {
        const w = wallOf(z);
        const WH = z.half ?? S.wall;
        G.rect(w.x + w.nz * WH, w.z - w.nx * WH, -w.nz, w.nx, WH * 2, z.kind === 'windwall' ? 0.15 : 0.4, z.kind === 'icewall' ? ICE : c, 0.5 * fade, 0.1);
        if (w.moving) G.lane(w.x, w.z, w.nx, w.nz, S.travel - Math.min(z.t * S.speed, S.travel), S.wall, col, 0.08, 0.7);
        return true;
      }
    }
    if (z.kind === 'parallel') {
      // Its owner sees it from the start; the other side only just before it forms.
      if (!mine && z.t < S.reveal) return true;
      const formed = z.t >= S.arm;
      if (!formed) {
        // Not live yet: only a thin outline and a clock running round it.
        G.ring(z.x, z.z, z.r - 0.06, z.r, c, 0.3);
        G.ring(z.x, z.z, z.r - 0.4, z.r - 0.22, 0xffffff, 0.55, 0.1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (z.t / S.arm));
        return true;
      }
      // Live: filled, bright-rimmed and pulsing, with its remaining time draining away.
      const beat = 0.5 + 0.5 * Math.sin(this.time * 16), left = (z.T - z.t) / (z.T - S.arm);
      G.ring(z.x, z.z, 0, z.r, 0xffffff, (0.1 + 0.08 * beat) * fade);
      G.ring(z.x, z.z, 0, z.r, c, 0.16 * fade);
      G.ring(z.x, z.z, z.r - 0.22, z.r, 0xffffff, 0.95 * fade);
      G.ring(z.x, z.z, z.r + 0.1, z.r + 0.28, col, 0.9 * fade, 0.1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * left);
      for (const k2 of [0.35, 0.7]) G.ring(z.x, z.z, z.r * ((k2 + this.time * 0.9) % 1) - 0.06, z.r * ((k2 + this.time * 0.9) % 1), 0xffffff, 0.35 * fade);
      return true;
    }
    if (z.kind === 'deathbelow') {
      const s = Math.SQRT1_2, pulse = 0.5 + 0.5 * Math.sin(this.time * 22);
      for (const [dx, dz] of [[(z.dx - z.dz) * s, (z.dz + z.dx) * s], [(z.dx + z.dz) * s, (z.dz - z.dx) * s]]) {
        G.lane(z.x - dx * S.arm, z.z - dz * S.arm, dx, dz, S.arm * 2, S.width, col, 0.12 + 0.08 * pulse, 0.9);
        G.rect(z.x - dx * S.arm, z.z - dz * S.arm, dx, dz, S.arm * 2 * k, S.width, col, 0.25);
      }
      return true;
    }
    if (z.kind === 'undertowz') { G.ring(z.x, z.z, 0.9, 1.05, c, 0.7); G.ring(z.x, z.z, 0, 0.9 * k, c, 0.25); if (dt > 0 && Math.random() < 0.5) speck(c, 2, -2); return true; }
    if (z.kind === 'riftz') { G.lane(z.x, z.z, z.dx, z.dz, S.range + 1.2, S.radius, col, 0.12 + 0.1 * Math.sin(this.time * 30), 0.9); return true; }
    if (z.kind === 'boulders') {
      // Scattered stones over a fan: slow to cross, and they go off under anything thrown across.
      G.sector(z.x, z.z, z.dx, z.dz, S.range, S.half, c, 0.1 * fade, 0.7 * fade);
      const a0 = Math.atan2(z.dz, z.dx);
      for (let i = 0; i < 14; i++) { const r = 1.6 + ((i * 37) % 60) / 60 * (S.range - 2.2), a = a0 + (((i * 53) % 100) / 100 - 0.5) * 2 * S.half * 0.85; G.ring(z.x + Math.cos(a) * r, z.z + Math.sin(a) * r, 0, 0.32, 0xd9b48a, 0.8 * fade); }
      timer();
      return true;
    }
    if (z.kind === 'canister') { const p2 = 0.5 + 0.5 * Math.sin(this.time * 8); G.ring(z.x, z.z, 0, 0.55, 0x9be04a, 0.5 + 0.4 * p2); G.ring(z.x, z.z, 0.75 + 0.15 * p2, 0.9 + 0.15 * p2, 0xffffff, 0.8); return true; }
    if (z.kind === 'workedground') { G.ring(z.x, z.z, 0, z.r, 0xc98a4a, 0.07 * fade); G.ring(z.x, z.z, z.r - 0.1, z.r, 0xc98a4a, 0.5 * fade, 0.1); return true; }
    if (z.kind === 'shovez') { G.ring(z.x, z.z, 0, z.r * k, col, 0.22); G.ring(z.x, z.z, z.r - 0.12, z.r, col, 0.95); G.rect(z.x, z.z, z.dx, z.dz, z.r + 4, 0.2, col, 0.8); return true; }
    if (z.kind === 'hshock') { G.lane(z.x, z.z, z.dx, z.dz, S.range + 1.2, S.radius, col, 0.1 + 0.08 * Math.sin(this.time * 20), 0.85); G.rect(z.x, z.z, z.dx, z.dz, (S.range + 1.2) * k, S.radius, col, 0.25); return true; }
    if (z.kind === 'feather') { G.ring(z.x, z.z, 0, 0.3, c, 0.95 * fade, 0.12); G.ring(z.x, z.z, 0.5, 0.6, c, 0.45 * fade); return true; }
    if (z.kind === 'keg') {
      G.ring(z.x, z.z, S.aoe - 0.06, S.aoe, col, mine ? 0.35 : 0.2);
      G.ring(z.x, z.z, 1.3, 1.45, col, 0.7);
      // What it can still take: one bright arc for each blow.
      for (let i = 0; i < z.c; i++) { const a0 = -Math.PI / 2 + (i - z.c / 2) * 0.75 + 0.08; G.ring(z.x, z.z, 1.6, 1.85, 0xffffff, 0.9, 0.1, a0, a0 + 0.59); }
      return true;
    }
    if (z.kind === 'purgatory') {
      G.ring(z.x, z.z, 0, z.r, 0xffffff, 0.05 * fade); G.ring(z.x, z.z, z.r - 0.14, z.r, col, 0.85 * fade);
      for (const [dx, dz] of [[1, 0], [0, 1]]) G.rect(z.x - dx * 1.2, z.z - dz * 1.2, dx, dz, 2.4, 0.16, 0xffffff, 0.9 * fade, 0.12);
      timer();
      return true;
    }
    if (S.kind === 'field') {
      if (S.cage) { G.ring(z.x, z.z, z.r - 0.28, z.r + 0.28, col, (z.t > S.arm ? 0.85 : 0.35) * fade); G.ring(z.x, z.z, 0, z.r, c, 0.04 * fade); timer(); return true; }
      G.ring(z.x, z.z, 0, z.r, S.regen ? HEAL : c, (S.follow ? 0.06 : 0.1) * fade);
      G.ring(z.x, z.z, z.r - 0.13, z.r, S.regen ? c : col, 0.85 * fade);
      // One that ends in a blast fills up as the moment comes.
      if (S.endDmg) G.ring(z.x, z.z, 0, z.r * k, col, 0.2);
      if (!S.follow) timer();
      if (dt > 0 && (S.dps || S.regen) && Math.random() < 0.5) speck(S.regen ? HEAL : c, 2 + Math.random() * 3, -1);
      return true;
    }
    return false;
  }

  // Enemy wind-ups and incoming meteors, drawn on the floor so they can be dodged.
  drawTelegraphs(dt) {
    const G = this.ground;
    for (const g of this.telegraphs) {
      g.t += dt;
      const t = g.top, k = Math.min(1, g.t / g.T), col = this.dangerOf(t);
      if (this.hidden(t)) continue;
      const S = g.skill;
      if (S.aim === 'leap') {
        if (!t.air) { g.done = true; continue; }
        const A = S.aoe, pulse = 0.5 + 0.5 * Math.sin(this.time * 18);
        G.ring(g.ax, g.az, 0, A, col, 0.1 + 0.08 * pulse);
        G.ring(g.ax, g.az, 0, A * k, col, 0.22);
        G.ring(g.ax, g.az, A - 0.14, A, col, 0.95);
        G.ring(g.ax, g.az, 1.9, 2.0, col, 0.5);
      } else {
        if (!t.cast || t.cast.key !== g.key) { g.done = true; continue; }
        if (S.tip) this.swingGuide(t, S, g.dx, g.dz, col, k);
        else if (S.aim === 'cone') {
          G.sector(t.x, t.z, g.dx, g.dz, S.range, S.half, col, 0.12, 0.85);
          G.ring(t.x, t.z, 0, S.range * k, col, 0.25, 0.09, Math.atan2(g.dz, g.dx) - S.half, Math.atan2(g.dz, g.dx) + S.half);
        } else if (S.wall && S.aim !== 'line') {
          G.rect(g.ax + g.dz * S.wall, g.az - g.dx * S.wall, -g.dz, g.dx, S.wall * 2, 0.4, col, 0.7);
        } else if (S.aim === 'ground') {
          G.ring(g.ax, g.az, S.aoe - 0.13, S.aoe, col, 0.9);
          G.ring(g.ax, g.az, 0, S.aoe, col, 0.1);
        } else if (S.aim === 'line' || S.aim === 'dash') {
          const line = S.aim === 'line';
          const len = Math.min(toWall(t.x, t.z, g.dx, g.dz), line ? S.range : clamp(t.cast.dist, S.minDist, S.dist) + 1);
          const hw = line ? S.radius : 1.25;
          G.lane(t.x, t.z, g.dx, g.dz, len, hw, col, 0.1, 0.8);
          G.rect(t.x, t.z, g.dx, g.dz, len * k, hw, col, 0.28);
        }
      }
    }
    if (this.telegraphs.some((g) => g.done)) this.telegraphs = this.telegraphs.filter((g) => !g.done);
  }

  // THE DARKIN BLADE's three shapes (line, fan, slam just ahead), each with its
  // sweet spot picked out in white. `k` fills it in as a wind-up runs.
  swingGuide(t, S, dx, dz, col, k = 0, a = 1) {
    const G = this.ground, glow = (0.22 + 0.1 * Math.sin(this.time * 18)) * a, ang = Math.atan2(dz, dx);
    if (S.ahead) {
      const cx = t.x + dx * S.ahead, cz = t.z + dz * S.ahead;
      G.ring(cx, cz, 0, S.aoe, col, 0.14 * a);
      if (k > 0) G.ring(cx, cz, 0, S.aoe * k, col, 0.22);
      G.ring(cx, cz, S.aoe - 0.14, S.aoe, col, 0.95 * a);
      G.ring(cx, cz, 0, S.tip, 0xffffff, glow);
    } else if (S.kind === 'cone') {
      G.sector(t.x, t.z, dx, dz, S.range, S.half, col, 0.14 * a, 0.85 * a);
      if (k > 0) G.ring(t.x, t.z, 0, S.range * k, col, 0.25, 0.09, ang - S.half, ang + S.half);
      G.ring(t.x, t.z, S.tip, S.range, 0xffffff, glow, 0.1, ang - S.half, ang + S.half);
    } else {
      const len = Math.min(S.range, toWall(t.x, t.z, dx, dz));
      G.lane(t.x, t.z, dx, dz, len, S.radius, col, 0.14 * a, 0.85 * a);
      if (k > 0) G.rect(t.x, t.z, dx, dz, len, S.radius * k, col, 0.28);
      if (len > S.tip) G.rect(t.x + dx * S.tip, t.z + dz * S.tip, dx, dz, len - S.tip, S.radius, 0xffffff, glow);
    }
  }

  // The player's aiming indicator. It shows only what the skill will cover:
  // reading where the enemy is headed is left to the player.
  drawAim(aim, me, w) {
    const G = this.ground, key = aim.key, S = w.aimSkill(me, key);
    let dx = aim.x - me.x, dz = aim.z - me.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.01) { dx = 0; dz = -1; } else { dx /= d; dz /= d; }
    const ok = w.ready(me, key, 0.25);
    const col = ok ? AIM : 0x8088a0;
    if (S.tip) { this.swingGuide(me, S, dx, dz, col, 0, ok ? 1 : 0.45); return; }
    if (S.aim === 'blink') {
      const len = Math.min(toWall(me.x, me.z, dx, dz) - me.radius, clamp(d, 2, S.range));
      G.lane(me.x + dx * 1.4, me.z + dz * 1.4, dx, dz, Math.max(0, len - 1.4), 0.5, col, 0.1, 0.6);
      G.ring(me.x + dx * len, me.z + dz * len, 1.2, 1.33, col, 0.9);
      G.ring(me.x + dx * len, me.z + dz * len, 0, 1.2, col, 0.12);
      G.ring(me.x, me.z, S.range - 0.05, S.range, AIM, 0.25);
    } else if (S.aim === 'cone') {
      G.sector(me.x, me.z, dx, dz, S.range, S.half, col, ok ? 0.16 : 0.07, ok ? 0.9 : 0.4);
    } else if (S.wall && !S.travel) {
      // A wall across the aim: ahead of the top, or at the chosen spot.
      const tg = S.aim === 'line' ? { x: me.x + dx * S.ahead, z: me.z + dz * S.ahead } : w.groundTarget(me, S, aim.x, aim.z);
      if (S.aim !== 'line') G.ring(me.x, me.z, S.range - 0.06, S.range, AIM, 0.35);
      G.rect(tg.x + dz * S.wall, tg.z - dx * S.wall, -dz, dx, S.wall * 2, 0.4, col, ok ? 0.8 : 0.35);
    } else if (S.aim === 'line' || S.aim === 'dash') {
      const line = S.aim === 'line';
      const len = Math.min(toWall(me.x, me.z, dx, dz), line || S.wind ? w.holdRange(me, key) : clamp(d, S.minDist, S.dist));
      const hw = line ? S.radius : 1.25;
      // A wound-up skill: its full stretch as a ring, and the reach of the
      // long throw growing from the moment the key goes down, so the jump
      // from tap to throw is seen coming.
      if (S.wind) {
        G.ring(me.x, me.z, S.range - 0.05, S.range, AIM, 0.2);
        const far = Math.min(toWall(me.x, me.z, dx, dz), w.holdRange(me, key, true));
        if (far > len + 0.05) G.lane(me.x + dx * 1.4, me.z + dz * 1.4, dx, dz, far - 1.4, hw, col, 0.04, 0.35);
      }
      G.lane(me.x + dx * 1.4, me.z + dz * 1.4, dx, dz, len - 1.4, hw, col, ok ? 0.16 : 0.07, ok ? 0.9 : 0.4);
      if (!line) G.ring(me.x + dx * len, me.z + dz * len, 1.2, 1.33, col, 0.8);
      if (!line && S.aoe) G.ring(me.x + dx * len, me.z + dz * len, S.aoe - 0.1, S.aoe, col, 0.5);
      if (S.id === 'shuriken') for (const q of w.own(me, 'shadow')) this.chain(q.x, q.z, aim.x, aim.z, col, 0.5);
    } else if (S.drag && aim.from) {
      // Two points: where it will come up, and which way it will throw.
      const tg = w.groundTarget(me, S, aim.from.x, aim.from.z);
      let dx = aim.x - tg.x, dz = aim.z - tg.z;
      const d = Math.hypot(dx, dz);
      if (d < 0.3) { dx = tg.x - me.x; dz = tg.z - me.z; const m = Math.hypot(dx, dz) || 1; dx /= m; dz /= m; } else { dx /= d; dz /= d; }
      G.ring(me.x, me.z, S.range - 0.06, S.range, AIM, 0.35);
      G.ring(tg.x, tg.z, 0, S.aoe, col, ok ? 0.14 : 0.06);
      G.ring(tg.x, tg.z, S.aoe - 0.12, S.aoe, col, 0.95);
      G.rect(tg.x, tg.z, dx, dz, S.aoe + S.push, 0.22, col, 0.85);
      G.ring(tg.x + dx * (S.aoe + S.push), tg.z + dz * (S.aoe + S.push), 0, 0.45, col, 0.9);
    } else if (S.aim === 'leap' || S.aim === 'ground') {
      const tg = w.groundTarget(me, S, aim.x, aim.z);
      G.ring(me.x, me.z, S.range - 0.06, S.range, AIM, 0.35);
      G.ring(tg.x, tg.z, 0, S.aoe, col, ok ? 0.14 : 0.06);
      G.ring(tg.x, tg.z, S.aoe - 0.12, S.aoe, col, 0.95);
      if (S.aim === 'leap') G.ring(tg.x, tg.z, 1.9, 2.0, col, 0.55);
      // Shadows throw too: show their lines to the same spot.
      if (S.id === 'shadow' || S.id === 'conquer') for (const q of w.own(me, S.id === 'shadow' ? 'shadow' : 'arise')) this.chain(q.x, q.z, tg.x, tg.z, col, 0.5);
    }
  }

  // One step of the mouse wheel: positive pulls back, negative moves in.
  zoomBy(delta) { this.wheel = clamp(this.wheel * Math.exp(delta * 0.0012), WHEEL_MIN, WHEEL_MAX); }

  updateCamera(rdt) {
    const cam = this.camera, st = this.stage, w = this.world;
    const k = 1 - Math.exp(-rdt * 3.5);
    let tx = 0, tz = 0.3, zoom = 1, wheel = 1;
    if (this.orbiting) {
      this.orbit += rdt * 0.12; zoom = 1.12;
    } else {
      // Unwind to the fixed battle angle the short way round.
      // Each player looks down the arena from their own end.
      const home = this.playerSide ? Math.PI : 0;
      this.orbit = home + Math.atan2(Math.sin(this.orbit - home), Math.cos(this.orbit - home)) * Math.exp(-rdt * 3);
      tz = this.playerSide ? -0.3 : 0.3;
      if (w) {
        const [a, b] = w.tops;
        const ax = a.out ? 0 : a.x, az = a.out ? 0 : a.z, bx = b.out ? 0 : b.x, bz = b.out ? 0 : b.z;
        tx = (ax + bx) * 0.08; tz += (az + bz) * 0.08;
        const f = this.focus;
        if (f) { tx += (f.top.x - tx) * f.w; tz += (clamp(f.top.z, -ARENA.R, ARENA.R) - tz) * f.w; zoom = f.zoom; }
        else {
          // Zoomed in, the whole arena no longer fits: stay on the player's own top.
          wheel = this.wheel;
          const me = w.tops[this.playerSide], near = clamp((1 - wheel) / (1 - WHEEL_MIN), 0, 1);
          if (me && !me.out) { tx += (me.x - tx) * near; tz += (clamp(me.z, -ARENA.R, ARENA.R) - tz) * near; }
        }
      }
    }
    this.look.x += (tx - this.look.x) * k; this.look.z += (tz - this.look.z) * k;
    this.zoom += (zoom - this.zoom) * k;
    this.wheelNow += (wheel - this.wheelNow) * (1 - Math.exp(-rdt * 12));
    this.punch = Math.max(0, this.punch - rdt * 3.2);
    this.shake *= Math.exp(-rdt * 7.5);

    const half = Math.tan((cam.fov * Math.PI) / 360), r = ARENA.R + 2.2;
    const fit = Math.max((r * Math.sin(PITCH) * 1.26) / half, (r * 1.04) / (half * cam.aspect));
    const dist = fit * this.zoom * this.wheelNow * (1 - this.punch * 0.035);
    const oy = Math.sin(PITCH) * dist, oz = Math.cos(PITCH) * dist;
    const s = this.shake * 0.55;
    cam.position.set(
      this.look.x + Math.sin(this.orbit) * oz + (Math.random() - 0.5) * s,
      this.look.y + oy + (Math.random() - 0.5) * s,
      this.look.z + Math.cos(this.orbit) * oz + (Math.random() - 0.5) * s,
    );
    cam.lookAt(this.look);
    this.particles.mat.uniforms.uScale.value = (st.height * st.renderer.getPixelRatio()) / (2 * half);
  }

  render() { this.stage.render(); }
}
