// Pooled visual effects: sparks, shockwave rings, glows, trails and the
// decals that are draped over the bowl (skill indicators, telegraphs).
import * as THREE from 'three';
import { ARENA, heightAt } from './config.js';

export const groundY = (x, z) => heightAt(Math.hypot(x, z));

const tmpColor = new THREE.Color();

export function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  grad.addColorStop(0.6, 'rgba(255,255,255,0.12)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Particles {
  constructor(scene, max = 6000) {
    this.max = max;
    this.cursor = 0;
    this.pos = new Float32Array(max * 3);
    this.vel = new Float32Array(max * 3);
    this.base = new Float32Array(max * 3);
    this.col = new Float32Array(max * 3);
    this.size = new Float32Array(max);
    this.size0 = new Float32Array(max);
    this.life = new Float32Array(max);
    this.life0 = new Float32Array(max);
    this.grav = new Float32Array(max);
    this.drag = new Float32Array(max);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aColor', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    this.mat = new THREE.ShaderMaterial({
      uniforms: { uScale: { value: 600 } },
      vertexShader: `
        attribute float aSize; attribute vec3 aColor; varying vec3 vColor; uniform float uScale;
        void main(){ vColor = aColor; vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uScale / -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `
        varying vec3 vColor;
        void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.05, d);
          gl_FragColor = vec4(vColor * a * a, 1.0); }`,
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
    });
    this.points = new THREE.Points(geo, this.mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 20;
    scene.add(this.points);
  }

  emit(x, y, z, vx, vy, vz, life, size, color, gravity = 18, drag = 1.2) {
    const i = this.cursor;
    this.cursor = (i + 1) % this.max;
    const j = i * 3;
    this.pos[j] = x; this.pos[j + 1] = y; this.pos[j + 2] = z;
    this.vel[j] = vx; this.vel[j + 1] = vy; this.vel[j + 2] = vz;
    tmpColor.set(color);
    this.base[j] = tmpColor.r; this.base[j + 1] = tmpColor.g; this.base[j + 2] = tmpColor.b;
    this.life[i] = this.life0[i] = life;
    this.size0[i] = size;
    this.grav[i] = gravity; this.drag[i] = drag;
  }

  // Sparks thrown from a point. `dir` (unit, optional) biases them.
  burst(x, y, z, n, color, speed, o = {}) {
    const { dx = 0, dy = 0, dz = 0, bias = 0, up = 0.6, life = 0.5, size = 0.22, gravity = 18, drag = 1.2, flat = false } = o;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const e = flat ? 0 : (Math.random() * 0.9 + 0.05) * up;
      const s = speed * (0.35 + Math.random() * 0.65);
      const c = Math.cos(e * Math.PI * 0.5);
      let vx = Math.cos(a) * c, vy = Math.sin(e * Math.PI * 0.5), vz = Math.sin(a) * c;
      vx = vx * (1 - bias) + dx * bias; vy = vy * (1 - bias) + dy * bias; vz = vz * (1 - bias) + dz * bias;
      this.emit(x, y, z, vx * s, vy * s, vz * s, life * (0.5 + Math.random() * 0.7), size * (0.6 + Math.random() * 0.8), color, gravity, drag);
    }
  }

  update(dt) {
    const { pos, vel, base, col, size, size0, life, life0, grav, drag, max } = this;
    for (let i = 0; i < max; i++) {
      if (life[i] <= 0) { if (size[i] !== 0) size[i] = 0; continue; }
      life[i] -= dt;
      const j = i * 3;
      if (life[i] <= 0) { size[i] = 0; continue; }
      const f = Math.exp(-drag[i] * dt);
      vel[j] *= f; vel[j + 1] = vel[j + 1] * f - grav[i] * dt; vel[j + 2] *= f;
      pos[j] += vel[j] * dt; pos[j + 1] += vel[j + 1] * dt; pos[j + 2] += vel[j + 2] * dt;
      // Sparks skip off the bowl instead of sinking through it.
      if (grav[i] > 0) {
        const gy = groundY(pos[j], pos[j + 2]) + 0.03;
        if (pos[j + 1] < gy) { pos[j + 1] = gy; vel[j + 1] = Math.abs(vel[j + 1]) * 0.35; }
      }
      const k = life[i] / life0[i];
      const b = k < 0.7 ? k / 0.7 : 1;
      col[j] = base[j] * b; col[j + 1] = base[j + 1] * b; col[j + 2] = base[j + 2] * b;
      size[i] = size0[i] * (0.4 + 0.6 * k);
    }
    const g = this.points.geometry;
    g.attributes.position.needsUpdate = true;
    g.attributes.aColor.needsUpdate = true;
    g.attributes.aSize.needsUpdate = true;
  }
}

// Expanding flat rings lying on the floor.
export class Shockwaves {
  constructor(scene, n = 24) {
    this.items = [];
    const geo = new THREE.RingGeometry(0.82, 1, 72);
    geo.rotateX(-Math.PI / 2);
    for (let i = 0; i < n; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
      const m = new THREE.Mesh(geo, mat);
      m.visible = false; m.renderOrder = 12;
      scene.add(m);
      this.items.push({ m, t: 0, T: 0, r0: 0, r1: 0, a: 1 });
    }
    this.i = 0;
  }
  spawn(x, y, z, r0, r1, T, color, alpha = 1) {
    const it = this.items[this.i];
    this.i = (this.i + 1) % this.items.length;
    it.t = 0; it.T = T; it.r0 = r0; it.r1 = r1; it.a = alpha;
    it.m.material.color.set(color);
    it.m.position.set(x, y, z);
    it.m.visible = true;
  }
  update(dt) {
    for (const it of this.items) {
      if (!it.m.visible) continue;
      it.t += dt;
      const k = it.t / it.T;
      if (k >= 1) { it.m.visible = false; continue; }
      const e = 1 - (1 - k) * (1 - k) * (1 - k);
      it.m.scale.setScalar(it.r0 + (it.r1 - it.r0) * e);
      it.m.material.opacity = it.a * (1 - k) * (1 - k);
    }
  }
}

// Camera-facing glows and short-lived lights.
export class Flashes {
  constructor(scene, tex) {
    this.sprites = [];
    for (let i = 0; i < 16; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: 0xffffff, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
      s.visible = false; s.renderOrder = 21;
      scene.add(s);
      this.sprites.push({ s, t: 0, T: 1, size: 1, a: 1 });
    }
    this.lights = [];
    for (let i = 0; i < 3; i++) {
      const l = new THREE.PointLight(0xffffff, 0, 30, 1.6);
      scene.add(l);
      this.lights.push({ l, t: 0, T: 1, p: 0 });
    }
    this.si = 0; this.li = 0;
  }
  flash(x, y, z, size, T, color, alpha = 1, light = 0) {
    const it = this.sprites[this.si];
    this.si = (this.si + 1) % this.sprites.length;
    it.t = 0; it.T = T; it.size = size; it.a = alpha;
    it.s.material.color.set(color);
    it.s.position.set(x, y, z);
    it.s.visible = true;
    if (light > 0) {
      const li = this.lights[this.li];
      this.li = (this.li + 1) % this.lights.length;
      li.t = 0; li.T = T * 1.5; li.p = light * 0.1;
      li.l.color.set(color);
      li.l.position.set(x, y + 3, z);
    }
  }
  update(dt) {
    for (const it of this.sprites) {
      if (!it.s.visible) continue;
      it.t += dt;
      const k = it.t / it.T;
      if (k >= 1) { it.s.visible = false; continue; }
      it.s.scale.setScalar(it.size * (0.6 + 0.6 * k));
      it.s.material.opacity = it.a * 0.7 * (1 - k) * (1 - k);
    }
    for (const li of this.lights) {
      if (li.p <= 0) continue;
      li.t += dt;
      const k = Math.min(1, li.t / li.T);
      li.l.intensity = li.p * (1 - k) * (1 - k);
      if (k >= 1) li.p = 0;
    }
  }
}

// Ribbon left on the floor behind a top.
export class Trail {
  constructor(scene, color, n = 64) {
    this.n = n;
    this.pts = [];
    this.color = new THREE.Color(color);
    this.width = 0.2;
    this.boost = 0;
    this.posArr = new Float32Array(n * 2 * 3);
    this.colArr = new Float32Array(n * 2 * 3);
    const idx = [];
    for (let i = 0; i < n - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.posArr, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('color', new THREE.BufferAttribute(this.colArr, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setIndex(idx);
    this.mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 8;
    scene.add(this.mesh);
  }
  reset() { this.pts.length = 0; }
  // `lift` raises the ribbon off the floor (used while a top is airborne).
  push(x, z, lift = 0) {
    const p = this.pts[0];
    if (p && Math.hypot(p.x - x, p.z - z) < 0.16 && Math.abs(p.lift - lift) < 0.3) { p.x = x; p.z = z; p.lift = lift; }
    else {
      this.pts.unshift({ x, z, lift, w: this.width * (1 + this.boost * 1.6), b: 1 + this.boost * 1.5 });
      if (this.pts.length > this.n) this.pts.pop();
    }
    this.rebuild();
  }
  fade(dt) {
    // While nothing is pushed the ribbon is eaten from the tail.
    this.t = (this.t || 0) + dt;
    if (this.t > 0.03 && this.pts.length > 1) { this.pts.pop(); this.t = 0; this.rebuild(); }
  }
  rebuild() {
    const { pts, n, posArr, colArr, color } = this;
    for (let i = 0; i < n; i++) {
      const p = pts[Math.min(i, pts.length - 1)];
      const q = pts[Math.min(i + 1, pts.length - 1)] || p;
      const a = i * 6;
      if (!p || i >= pts.length) { for (let k = 0; k < 6; k++) colArr[a + k] = 0; if (p) { for (let k = 0; k < 2; k++) { posArr[a + k * 3] = p.x; posArr[a + k * 3 + 1] = 0; posArr[a + k * 3 + 2] = p.z; } } continue; }
      let dx = p.x - q.x, dz = p.z - q.z;
      const d = Math.hypot(dx, dz) || 1;
      dx /= d; dz /= d;
      const k = 1 - i / n;
      const w = p.w * (0.15 + 0.85 * k);
      const y = groundY(p.x, p.z) + 0.07 + p.lift;
      posArr[a] = p.x - dz * w; posArr[a + 1] = y; posArr[a + 2] = p.z + dx * w;
      posArr[a + 3] = p.x + dz * w; posArr[a + 4] = y; posArr[a + 5] = p.z - dx * w;
      const f = k * k * 0.85 * p.b;
      for (let s = 0; s < 2; s++) { colArr[a + s * 3] = color.r * f; colArr[a + s * 3 + 1] = color.g * f; colArr[a + s * 3 + 2] = color.b * f; }
    }
    const g = this.mesh.geometry;
    g.attributes.position.needsUpdate = true;
    g.attributes.color.needsUpdate = true;
  }
  dispose(scene) { scene.remove(this.mesh); this.mesh.geometry.dispose(); this.mesh.material.dispose(); }
}

const RECT_SEGS = 20, RING_SEGS = 64, RING_BANDS = 5, PATH_PTS = 40;

// Decals stop at the wall instead of spilling over the rim.
const spot = { x: 0, z: 0 };
function inside(x, z) {
  const r = Math.hypot(x, z);
  const k = r > ARENA.R ? ARENA.R / r : 1;
  spot.x = x * k; spot.z = z * k;
  return spot;
}

// Immediate-mode decals: call begin() each frame, then draw what is needed.
export class Ground {
  constructor(scene) {
    this.scene = scene;
    this.pools = { rect: [], ring: [], path: [] };
    this.used = { rect: 0, ring: 0, path: 0 };
  }
  begin() {
    for (const k in this.pools) {
      for (let i = 0; i < this.used[k]; i++) this.pools[k][i].visible = false;
      this.used[k] = 0;
    }
  }
  get(kind) {
    const pool = this.pools[kind];
    let m = pool[this.used[kind]++];
    if (!m) {
      const geo = new THREE.BufferGeometry();
      if (kind === 'path') {
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PATH_PTS * 3), 3));
        m = new THREE.Line(geo, new THREE.LineDashedMaterial({ transparent: true, depthWrite: false, dashSize: 0.35, gapSize: 0.3, blending: THREE.AdditiveBlending }));
      } else {
        const cols = kind === 'rect' ? RECT_SEGS : RING_SEGS, rows = kind === 'rect' ? 1 : RING_BANDS;
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((cols + 1) * (rows + 1) * 3), 3));
        const idx = [];
        for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
          const a = i * (rows + 1) + j, b = a + rows + 1;
          idx.push(a, b, a + 1, b, b + 1, a + 1);
        }
        geo.setIndex(idx);
        m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
      }
      m.frustumCulled = false;
      m.renderOrder = 6;
      this.scene.add(m);
      pool.push(m);
    }
    m.visible = true;
    return m;
  }

  rect(x, z, dx, dz, len, hw, color, opacity, lift = 0.08) {
    if (len <= 0.01) return;
    const m = this.get('rect');
    const p = m.geometry.attributes.position.array;
    for (let i = 0; i <= RECT_SEGS; i++) {
      const cx = x + dx * len * (i / RECT_SEGS), cz = z + dz * len * (i / RECT_SEGS);
      for (let s = 0; s < 2; s++) {
        const sg = s ? 1 : -1;
        const q = inside(cx - dz * hw * sg, cz + dx * hw * sg), o = (i * 2 + s) * 3;
        p[o] = q.x; p[o + 1] = groundY(q.x, q.z) + lift; p[o + 2] = q.z;
      }
    }
    m.geometry.attributes.position.needsUpdate = true;
    m.material.color.set(color); m.material.opacity = opacity;
  }

  // Filled rectangle with bright edges and an end cap.
  lane(x, z, dx, dz, len, hw, color, fill, edge) {
    this.rect(x, z, dx, dz, len, hw, color, fill);
    const e = 0.06;
    this.rect(x - dz * (hw - e), z + dx * (hw - e), dx, dz, len, e, color, edge, 0.1);
    this.rect(x + dz * (hw - e), z - dx * (hw - e), dx, dz, len, e, color, edge, 0.1);
    this.rect(x + dx * len + dz * hw, z + dz * len - dx * hw, -dz, dx, hw * 2, e, color, edge, 0.1);
  }

  // A full ring by default; pass a0/a1 (radians) for an arc or a pie slice.
  ring(cx, cz, r0, r1, color, opacity, lift = 0.08, a0 = 0, a1 = Math.PI * 2) {
    if (r1 <= 0.01) return;
    const m = this.get('ring');
    const p = m.geometry.attributes.position.array;
    for (let i = 0; i <= RING_SEGS; i++) {
      const a = a0 + (i / RING_SEGS) * (a1 - a0), c = Math.cos(a), s = Math.sin(a);
      for (let j = 0; j <= RING_BANDS; j++) {
        const r = r0 + (r1 - r0) * (j / RING_BANDS);
        const q = inside(cx + c * r, cz + s * r), o = (i * (RING_BANDS + 1) + j) * 3;
        p[o] = q.x; p[o + 1] = groundY(q.x, q.z) + lift; p[o + 2] = q.z;
      }
    }
    m.geometry.attributes.position.needsUpdate = true;
    m.material.color.set(color); m.material.opacity = opacity;
  }

  // Pie slice pointing along (dx, dz), with bright edges.
  sector(cx, cz, dx, dz, r, half, color, fill, edge) {
    const a = Math.atan2(dz, dx);
    this.ring(cx, cz, 0, r, color, fill, 0.08, a - half, a + half);
    this.ring(cx, cz, r - 0.1, r, color, edge, 0.1, a - half, a + half);
    for (const s of [-1, 1]) this.rect(cx, cz, Math.cos(a + half * s), Math.sin(a + half * s), r, 0.05, color, edge, 0.1);
  }

  path(pts, color, opacity) {
    if (pts.length < 2) return;
    const m = this.get('path');
    const p = m.geometry.attributes.position.array;
    for (let i = 0; i < PATH_PTS; i++) {
      const q = pts[Math.min(i, pts.length - 1)];
      p[i * 3] = q.x; p[i * 3 + 1] = groundY(q.x, q.z) + 0.12; p[i * 3 + 2] = q.z;
    }
    m.geometry.attributes.position.needsUpdate = true;
    m.computeLineDistances();
    m.material.color.set(color); m.material.opacity = opacity;
  }
}

export const arenaClamp = (x, z, margin = 0) => {
  const r = Math.hypot(x, z), lim = ARENA.R - margin;
  return r > lim ? { x: (x * lim) / r, z: (z * lim) / r } : { x, z };
};
