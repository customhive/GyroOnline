// Turns the simulation into pictures: top models, camera, effects, and the
// floor indicators for aiming and for incoming enemy skills.
import * as THREE from 'three';
import { ARENA, SKILLS, ENEMY_COLOR, heightAt, skillOf } from './config.js';
import { spinRatio, intercept, predictAt, predictPath, targetable } from './sim.js';
import { createStage } from './stage.js';
import { buildTop, disposeTop } from './topmesh.js';
import { Particles, Shockwaves, Flashes, Trail, Ground, glowTexture, groundY } from './fx.js';

const AIM = 0x9fe8ff, LOCK = 0xffd84a, HOT = 0xfff1c0, HEAL = 0x8dffb0;
const PITCH = (54 * Math.PI) / 180;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
// Distance from (x, z) along (dx, dz) to the arena wall.
const toWall = (x, z, dx, dz) => {
  const b = x * dx + z * dz, c = x * x + z * z - ARENA.R * ARENA.R;
  return c >= 0 ? 0 : -b + Math.sqrt(b * b - c);
};
const v3 = new THREE.Vector3();

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
    this.focus = null;
    this.aimInfo = null;
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
    window.addEventListener('resize', () => this.stage.resize());
  }

  setMatch(world, playerSide) {
    for (const v of this.tops) {
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
      v.drop = 0; v.dropV = 0; v.fall = 0; v.hold = false; v.ox = 0; v.oz = 0;
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
    this.focus = null;
    for (const v of this.tops) { v.trail.reset(); v.fall = 0; v.shieldAlpha = 0; v.group.visible = true; }
  }

  // Drops a top in from above for the launch.
  launch(side, height = 9) {
    const v = this.tops[side];
    v.drop = height; v.dropV = 0;
  }

  colorOf(t) { return t.blade.color; }
  dangerOf(t) { return t.side === this.playerSide ? AIM : ENEMY_COLOR; }

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
        }
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
        W.spawn(t.x, y + 0.1, t.z, SKILLS.nova.aoe, 1, e.T, c, 0.8);
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
        this.cones.push({ x: t.x, z: t.z, dx: e.dx, dz: e.dz, t: 0, T: 0.35, color: this.colorOf(t) });
        F.flash(t.x + e.dx * 2, y, t.z + e.dz * 2, 8, 0.25, 0xffa040, 1, 140);
        this.addShake(e.hit ? 0.35 : 0.12);
        if (e.hit) this.siphon(e.target, t, 26, HEAL);
        break;
      }
      case 'orbs': {
        const t = e.top, y = groundY(t.x, t.z);
        W.spawn(t.x, y + 0.1, t.z, 0.6, SKILLS.satellite.orbit + 0.6, 0.35, this.colorOf(t), 1);
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
        P.burst(p.x, y, p.z, 40, c, 16, { dx: p.dx, dz: p.dz, bias: 0.7, up: 0.4, life: 0.35, gravity: 4 });
        F.flash(p.x, y, p.z, 5, 0.18, c, 1, 60);
        W.spawn(e.top.x, groundY(e.top.x, e.top.z) + 0.1, e.top.z, 0.6, 2.6, 0.3, c, 0.7);
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
        this.telegraphs.push({ top: t, key: 'R', skill: SKILLS.meteor, t: 0, T: e.T, ax: e.tx, az: e.tz });
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
    this.aimInfo = null;

    if (w) {
      for (const t of w.tops) this.updateTop(t, this.tops[t.side], dt, rdt);
      this.syncProjectiles();
      for (const v of this.projs.values()) {
        const p = v.proj, y = groundY(p.x, p.z) + 0.85;
        v.group.position.set(p.x, y, p.z);
        if (p.skill.chain) this.chain(p.owner.x, p.owner.z, p.x, p.z, this.colorOf(p.owner), 1);
        v.group.children[1].rotation.x += dt * 22;
        if (dt > 0) for (let i = 0; i < 3; i++) {
          P.emit(p.x - p.dx * Math.random() * 1.2 + (Math.random() - 0.5) * 0.9, y + (Math.random() - 0.5) * 0.8, p.z - p.dz * Math.random() * 1.2 + (Math.random() - 0.5) * 0.9,
            -p.dx * 4, Math.random() * 2, -p.dz * 4, 0.3, 0.3, this.colorOf(p.owner), 0, 1);
        }
      }
      this.drawTelegraphs(dt);
      this.drawOngoing(dt);
      const me = w.tops[this.playerSide], foe = w.other(me);
      if (!w.result && !me.out) {
        // Selection ring and the standing move order.
        if (!me.air) G.ring(me.x, me.z, 1.55, 1.63, 0xffffff, 0.45);
        if (me.cmd) {
          const pulse = 0.5 + 0.5 * Math.sin(this.time * 10);
          G.ring(me.cmd.x, me.cmd.z, 0.25 + pulse * 0.1, 0.42 + pulse * 0.1, AIM, 0.8);
          const dx = me.cmd.x - me.x, dz = me.cmd.z - me.z, d = Math.hypot(dx, dz);
          if (d > 1.6) G.rect(me.x + (dx / d) * 1.4, me.z + (dz / d) * 1.4, dx / d, dz / d, d - 1.8, 0.035, AIM, 0.35);
        }
        if (aim) this.drawAim(aim, me, foe, w);
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
    const sr = spinRatio(t), c = this.colorOf(t);
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
    else if (t.air) lift = Math.sin(Math.PI * Math.min(1, t.air.t / t.air.T)) * 7.5;
    lift += v.drop;
    const y = gy + lift;
    // Network smoothing offset, fading out quickly.
    const fade = Math.exp(-rdt * 14);
    v.ox *= fade; v.oz *= fade;
    v.group.position.set(t.x + v.ox, y, t.z + v.oz);
    v.group.visible = !(t.out && t.out.t > 2.2);
    v.light.position.set(t.x + v.ox, y + 3.2, t.z + v.oz);
    v.light.intensity = v.group.visible ? 2 + 4 * sr + (t.dash || t.air ? 8 : 0) : 0;

    const dead = t.spin <= 0 && !t.out;
    v.fall = dead ? Math.min(1, v.fall + rdt * 1.6) : 0;
    const rate = (5 + 42 * sr) * (1 - v.fall);
    v.spin.rotation.y -= t.dir * rate * dt;
    v.blur.rotation.z += 11 * dt;
    v.blurMat.opacity = (0.05 + 0.2 * sr) * (1 - v.fall);
    v.wobble += (2.4 + 7 * (1 - sr)) * dt;
    let amp = 0.03 + 0.4 * Math.pow(1 - sr, 2.2) + (t.tumble > 0 ? 0.14 : 0);
    amp = amp * (1 - v.fall) + 0.62 * v.fall;
    if (t.out) {
      v.group.rotation.x += rdt * 7; v.group.rotation.z += rdt * 5;
    } else {
      v.group.rotation.set(amp * Math.cos(v.wobble) + t.vz * 0.006, 0, amp * Math.sin(v.wobble) - t.vx * 0.006);
    }
    v.group.scale.setScalar(t.air ? 1 + 0.35 * Math.sin(Math.PI * Math.min(1, t.air.t / t.air.T)) : 1);
    // Mid-blink the body is gone; only the streak of light is left.
    v.spin.visible = v.blur.visible = !t.blink;

    const ready = t.ult >= 100 && !this.world.result;
    v.aura.material.opacity = (0.1 + 0.16 * sr + (ready ? 0.22 + 0.14 * Math.sin(this.time * 9) : 0)) * (1 - v.fall);
    v.aura.visible = lift < 0.5;
    v.aura.scale.setScalar(ready ? 7.5 : 5.5);
    v.body.emissiveIntensity = 0.14 + (ready ? 0.25 + 0.15 * Math.sin(this.time * 9) : 0) + (t.dash ? 0.8 : 0) + (t.empower > 0 ? 0.5 + 0.3 * Math.sin(this.time * 30) : 0) + (t.charge ? 1.2 : 0);

    const target = t.guard > 0 ? 1 : 0;
    v.shieldAlpha += (target - v.shieldAlpha) * Math.min(1, rdt * 14);
    v.shield.visible = v.shieldAlpha > 0.02;
    if (v.shield.visible) {
      v.shieldMat.uniforms.uTime.value = this.time;
      // Flickers as it is about to run out.
      const warn = t.guard > 0 && t.guard < 0.35 ? 0.5 + 0.5 * Math.sin(this.time * 50) : 1;
      v.shieldMat.uniforms.uAlpha.value = v.shieldAlpha * warn;
      v.shield.rotation.y += rdt * 2;
    }

    v.trail.boost = t.dash || t.blink ? 1 : t.air ? 0.6 : t.empower > 0 ? 0.5 : 0;
    if (!t.out && v.drop <= 0) v.trail.push(t.x + v.ox, t.z + v.oz, lift);

    if (dt <= 0 || t.out) return;
    const sp = Math.hypot(t.vx, t.vz);
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
      if (z.kind === 'quake') {
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
      if (t.charge) {
        const S = t.charge.skill, k = Math.min(1, t.charge.t / t.charge.T), col = this.dangerOf(t);
        const pulse = 0.5 + 0.5 * Math.sin(this.time * 22);
        G.ring(t.x, t.z, 0, S.aoe, col, 0.08 + 0.07 * pulse);
        G.ring(t.x, t.z, 0, S.aoe * k, col, 0.22);
        G.ring(t.x, t.z, S.aoe - 0.14, S.aoe, col, 0.95);
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
        const o = w.other(t), wob = 0.5 + 0.5 * Math.sin(this.time * 26);
        const dx = o.x - t.x, dz = o.z - t.z, d = Math.hypot(dx, dz) || 1;
        const strain = clamp((d - t.tether.skill.range) / (t.tether.skill.breakRange - t.tether.skill.range), 0, 1);
        G.rect(t.x, t.z, dx / d, dz / d, d, 0.12 + 0.08 * wob, strain > 0.5 ? 0xffffff : c, 0.95, 0.9);
        G.rect(t.x, t.z, dx / d, dz / d, d, 0.5 + 0.2 * wob, c, 0.2 * (1 - strain * 0.7), 0.88);
        G.ring(o.x, o.z, 1.5, 1.7, c, 0.5 + 0.4 * wob);
        if (dt > 0) this.siphon(o, t, 2, Math.random() < 0.5 ? c : HEAL);
      }
    }
    for (const cn of this.cones) {
      cn.t += dt;
      const k = cn.t / cn.T;
      if (k < 1) G.sector(cn.x, cn.z, cn.dx, cn.dz, SKILLS.flare.range, SKILLS.flare.half, cn.color, 0.5 * (1 - k) * (1 - k), 0.9 * (1 - k));
    }
    if (this.cones.length && this.cones[0].t > this.cones[0].T) this.cones.shift();
  }

  // Enemy wind-ups and incoming meteors, drawn on the floor so they can be dodged.
  drawTelegraphs(dt) {
    const G = this.ground;
    for (const g of this.telegraphs) {
      g.t += dt;
      const t = g.top, k = Math.min(1, g.t / g.T), col = this.dangerOf(t);
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
        if (S.aim === 'cone') {
          G.sector(t.x, t.z, g.dx, g.dz, S.range, S.half, col, 0.12, 0.85);
          G.ring(t.x, t.z, 0, S.range * k, col, 0.25, 0.09, Math.atan2(g.dz, g.dx) - S.half, Math.atan2(g.dz, g.dx) + S.half);
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

  // The player's aiming indicator, plus where the enemy is predicted to be
  // when the skill would arrive. Turns gold when the two line up.
  drawAim(aim, me, foe, w) {
    const G = this.ground, key = aim.key, S = skillOf(me, key);
    let dx = aim.x - me.x, dz = aim.z - me.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.01) { dx = 0; dz = -1; } else { dx /= d; dz /= d; }
    const ok = me.cd[key] <= 0.25 && (!S.ult || me.ult >= 100);
    const can = targetable(foe);
    const grey = 0x8088a0;
    let lock = false, ghost = null, T = 0;
    if (S.aim === 'blink') {
      // No target needed: just show where the step ends.
      const len = Math.min(toWall(me.x, me.z, dx, dz) - me.radius, clamp(d, 2, S.range));
      const col = ok ? AIM : grey;
      G.lane(me.x + dx * 1.4, me.z + dz * 1.4, dx, dz, Math.max(0, len - 1.4), 0.5, col, 0.1, 0.6);
      G.ring(me.x + dx * len, me.z + dz * len, 1.2, 1.33, col, 0.9);
      G.ring(me.x + dx * len, me.z + dz * len, 0, 1.2, col, 0.12);
      G.ring(me.x, me.z, S.range - 0.05, S.range, AIM, 0.25);
      return;
    }
    if (S.aim === 'cone') {
      if (can) {
        const p = predictAt(foe, me, 0.08);
        ghost = { x: p.x, z: p.z };
        const gx = p.x - me.x, gz = p.z - me.z, gd = Math.hypot(gx, gz) || 1;
        const ang = Math.acos(clamp((gx * dx + gz * dz) / gd, -1, 1));
        lock = gd < S.range + foe.radius * 0.6 && ang < S.half + Math.atan2(foe.radius * 0.8, Math.max(gd, 0.5));
      }
      const col = !ok ? grey : lock ? LOCK : AIM;
      G.sector(me.x, me.z, dx, dz, S.range, S.half, col, ok ? 0.16 : 0.07, ok ? 0.9 : 0.4);
    } else if (S.aim === 'line' || S.aim === 'dash') {
      const line = S.aim === 'line';
      const len = Math.min(toWall(me.x, me.z, dx, dz), line ? S.range : clamp(d, S.minDist, S.dist));
      const hw = line ? S.radius : 1.25;
      if (can) {
        ghost = intercept(me.x, me.z, foe, me, S.speed);
        T = ghost.t;
        const gx = ghost.x - me.x, gz = ghost.z - me.z;
        const along = gx * dx + gz * dz, side = Math.abs(gx * -dz + gz * dx);
        lock = along > 0 && along < len + (line ? 0.5 : 1.6) && side < hw + foe.radius * 0.8;
      }
      const col = !ok ? grey : lock ? LOCK : AIM;
      G.lane(me.x + dx * 1.4, me.z + dz * 1.4, dx, dz, len - 1.4, hw, col, ok ? 0.16 : 0.07, ok ? 0.9 : 0.4);
      if (!line) G.ring(me.x + dx * len, me.z + dz * len, 1.2, 1.33, col, 0.8);
    } else if (S.aim === 'leap' || S.aim === 'ground') {
      const tg = w.groundTarget(me, S, aim.x, aim.z);
      const delay = S.aim === 'leap' ? S.air : S.delay;
      if (can) {
        const p = predictAt(foe, me, delay);
        ghost = { x: p.x, z: p.z };
        T = delay;
        lock = Math.hypot(p.x - tg.x, p.z - tg.z) < S.aoe + foe.radius * 0.3;
      }
      const col = !ok ? grey : lock ? LOCK : AIM;
      G.ring(me.x, me.z, S.range - 0.06, S.range, AIM, 0.35);
      G.ring(tg.x, tg.z, 0, S.aoe, col, ok ? 0.14 : 0.06);
      G.ring(tg.x, tg.z, S.aoe - 0.12, S.aoe, col, 0.95);
      if (S.aim === 'leap') G.ring(tg.x, tg.z, 1.9, 2.0, col, 0.55);
    } else {
      return;
    }
    if (ghost && ok) {
      const col = lock ? LOCK : 0xffffff;
      const n = 24;
      G.path([{ x: foe.x, z: foe.z }, ...predictPath(foe, me, Math.min(T, 1.4), n)], col, lock ? 0.95 : 0.55);
      const pulse = lock ? 0.5 + 0.5 * Math.sin(this.time * 16) : 0;
      G.ring(ghost.x, ghost.z, 1.15 + pulse * 0.1, 1.3 + pulse * 0.1, col, lock ? 1 : 0.6);
      G.ring(ghost.x, ghost.z, 0, 0.16, col, lock ? 1 : 0.6);
      const s = this.toScreen(ghost.x, groundY(ghost.x, ghost.z) + 1.6, ghost.z);
      this.aimInfo = { lock, x: s.x, y: s.y };
    }
  }

  updateCamera(rdt) {
    const cam = this.camera, st = this.stage, w = this.world;
    const k = 1 - Math.exp(-rdt * 3.5);
    let tx = 0, tz = 0.3, zoom = 1;
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
      }
    }
    this.look.x += (tx - this.look.x) * k; this.look.z += (tz - this.look.z) * k;
    this.zoom += (zoom - this.zoom) * k;
    this.punch = Math.max(0, this.punch - rdt * 3.2);
    this.shake *= Math.exp(-rdt * 7.5);

    const half = Math.tan((cam.fov * Math.PI) / 360), r = ARENA.R + 2.2;
    const fit = Math.max((r * Math.sin(PITCH) * 1.26) / half, (r * 1.04) / (half * cam.aspect));
    const dist = fit * this.zoom * (1 - this.punch * 0.035);
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
