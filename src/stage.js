// Renderer, post-processing, the stadium and everything around it.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { STAGES, wallArcs, ARENA, heightAt } from './config.js';

const EXTENT = ARENA.R + 2.2; // half-size of the square the floor textures cover

function floorCanvas(size, draw) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const s = size / (EXTENT * 2);
  g.translate(size / 2, size / 2);
  g.scale(s, s);
  draw(g);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function circle(g, r) { g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); }

function paintFloor(g) {
  const R = ARENA.R;
  g.fillStyle = '#0a0e1c'; g.fillRect(-EXTENT, -EXTENT, EXTENT * 2, EXTENT * 2);
  const grad = g.createRadialGradient(0, 0, 0, 0, 0, R);
  grad.addColorStop(0, '#2b3a63'); grad.addColorStop(0.45, '#1a2442'); grad.addColorStop(1, '#0d1326');
  g.fillStyle = grad; circle(g, R); g.fill();
  // Machined bands.
  for (const [r0, r1, col] of [[9.6, 12.4, 'rgba(120,160,255,0.05)'], [5.8, 6.6, 'rgba(120,160,255,0.08)'], [0, 2.6, 'rgba(140,190,255,0.09)']]) {
    g.fillStyle = col; g.beginPath(); g.arc(0, 0, r1, 0, Math.PI * 2); g.arc(0, 0, r0, 0, Math.PI * 2, true); g.fill();
  }
  // Brushed-metal scratches.
  for (let i = 0; i < 900; i++) {
    const r = Math.random() * R, a = Math.random() * Math.PI * 2, l = 0.1 + Math.random() * 0.5;
    g.strokeStyle = `rgba(${Math.random() < 0.5 ? '255,255,255' : '0,0,0'},${0.02 + Math.random() * 0.05})`;
    g.lineWidth = 0.02 + Math.random() * 0.03;
    g.beginPath(); g.arc(0, 0, r, a, a + l); g.stroke();
  }
  g.strokeStyle = 'rgba(255,255,255,0.05)'; g.lineWidth = 0.05;
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    g.beginPath(); g.moveTo(Math.cos(a) * 2.8, Math.sin(a) * 2.8); g.lineTo(Math.cos(a) * R, Math.sin(a) * R); g.stroke();
  }
  // Rim top.
  g.fillStyle = '#161d33'; g.beginPath(); g.arc(0, 0, EXTENT, 0, Math.PI * 2); g.arc(0, 0, R, 0, Math.PI * 2, true); g.fill();
}

function paintGlow(g, stage = STAGES[0]) {
  const R = ARENA.R;
  g.fillStyle = '#000'; g.fillRect(-EXTENT, -EXTENT, EXTENT * 2, EXTENT * 2);
  g.lineCap = 'butt';
  const line = (r, w, col, dash) => { g.strokeStyle = col; g.lineWidth = w; g.setLineDash(dash || []); circle(g, r); g.stroke(); g.setLineDash([]); };
  line(2.6, 0.07, '#57d8ff');
  line(6.2, 0.05, '#2f7fd0', [0.5, 0.35]);
  line(9.6, 0.07, '#3aa8ff');
  // Danger band by the wall: this is where launched tops fly out.
  // Only where there is a wall to be thrown against; an open edge has none.
  // (On the canvas a screen angle runs the other way round.)
  g.strokeStyle = '#ff5a2a'; g.lineWidth = 0.5; g.setLineDash([0.9, 0.6]);
  for (const [a0, a1] of wallArcs(stage)) { g.beginPath(); g.arc(0, 0, 12.35, -a1, -a0); g.stroke(); }
  g.setLineDash([]);
  line(11.95, 0.05, '#ff9a4a');
  g.strokeStyle = '#2c8fe0'; g.lineWidth = 0.05;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + Math.PI / 12;
    g.beginPath(); g.moveTo(Math.cos(a) * 9.6, Math.sin(a) * 9.6); g.lineTo(Math.cos(a) * 11.9, Math.sin(a) * 11.9); g.stroke();
  }
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2, r0 = i % 6 === 0 ? 5.7 : 6.0;
    g.beginPath(); g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); g.lineTo(Math.cos(a) * 6.2, Math.sin(a) * 6.2); g.stroke();
  }
  // Centre emblem.
  g.strokeStyle = '#7fe4ff'; g.lineWidth = 0.08;
  g.beginPath();
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; g[i ? 'lineTo' : 'moveTo'](Math.cos(a) * 1.7, Math.sin(a) * 1.7); }
  g.closePath(); g.stroke();
  g.beginPath();
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2 - Math.PI / 2; g[i ? 'lineTo' : 'moveTo'](Math.cos(a) * 1.1, Math.sin(a) * 1.1); }
  g.closePath(); g.stroke();
  g.fillStyle = '#bff2ff'; circle(g, 0.22); g.fill();
}

// Floor of the hall around the stadium: lit near the platform, fading to black.
function hallTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 2048;
  const g = c.getContext('2d');
  const u = 2048 / 180; // pixels per unit, plane is 180 across
  g.fillStyle = '#04060d'; g.fillRect(0, 0, 2048, 2048);
  g.translate(1024, 1024); g.scale(u, u);
  const grad = g.createRadialGradient(0, 0, 14, 0, 0, 70);
  grad.addColorStop(0, 'rgba(46,104,255,0.55)'); grad.addColorStop(0.25, 'rgba(30,60,170,0.26)'); grad.addColorStop(0.6, 'rgba(20,30,90,0.1)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad; g.fillRect(-90, -90, 180, 180);
  for (const [r, w, a, dash] of [[21.5, 0.22, 0.9, null], [24, 0.08, 0.5, [1.2, 0.8]], [31, 0.12, 0.45, null], [33, 1.2, 0.07, [4, 2]], [42, 0.1, 0.3, [0.6, 2.4]], [54, 0.14, 0.22, null], [70, 0.1, 0.14, null]]) {
    g.strokeStyle = `rgba(90,150,255,${a})`; g.lineWidth = w; g.setLineDash(dash || []);
    g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.stroke();
  }
  g.setLineDash([]);
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2, major = i % 3 === 0;
    g.strokeStyle = `rgba(90,150,255,${major ? 0.3 : 0.1})`; g.lineWidth = major ? 0.12 : 0.06;
    g.beginPath(); g.moveTo(Math.cos(a) * (major ? 24 : 31), Math.sin(a) * (major ? 24 : 31)); g.lineTo(Math.cos(a) * 88, Math.sin(a) * 88); g.stroke();
  }
  // Floor plates.
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + 0.09;
    g.fillStyle = `rgba(70,130,255,${i % 2 ? 0.05 : 0.1})`;
    g.beginPath(); g.arc(0, 0, 30.4, a, a + 0.17); g.arc(0, 0, 25, a + 0.17, a, true); g.closePath(); g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function createStage(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x04060d);
  scene.fog = new THREE.FogExp2(0x04060d, 0.011);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(40, 1, 0.5, 400);

  // --- lights ---------------------------------------------------------------
  scene.add(new THREE.HemisphereLight(0x9fc4ff, 0x0b0d18, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(9, 26, 12);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const sc = key.shadow.camera;
  sc.left = -17; sc.right = 17; sc.top = 17; sc.bottom = -17; sc.near = 5; sc.far = 60;
  key.shadow.bias = -0.0006; key.shadow.normalBias = 0.03;
  scene.add(key);
  const rimLight = new THREE.DirectionalLight(0x6a8cff, 0.9);
  rimLight.position.set(-14, 10, -16);
  scene.add(rimLight);

  // --- bowl -----------------------------------------------------------------
  const { R, H } = ARENA;
  // The floor of the bowl, with a lip that drops away where there is no wall.
  const prof = [];
  for (let i = 0; i <= 48; i++) { const r = (R * i) / 48; prof.push(new THREE.Vector2(r, heightAt(r))); }
  prof.push(new THREE.Vector2(R + 0.12, H - 0.02), new THREE.Vector2(R + 0.3, H - 0.5), new THREE.Vector2(R + 0.45, -2.5));
  const mapUv = (geo) => {
    const pos = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / (EXTENT * 2) + 0.5, 0.5 - pos.getZ(i) / (EXTENT * 2));
    return geo;
  };
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorCanvas(2048, paintFloor), emissiveMap: floorCanvas(2048, (g) => paintGlow(g)), emissive: 0xffffff, emissiveIntensity: 0.85,
    metalness: 0.82, roughness: 0.36, side: THREE.DoubleSide,
  });
  const bowl = new THREE.Mesh(mapUv(new THREE.LatheGeometry(prof, 128)), floorMat);
  bowl.receiveShadow = true;
  scene.add(bowl);

  // The rim wall is built for whichever stage is being played: all the way
  // round, in stretches with gaps between them, or not at all.
  const rimProf = [new THREE.Vector2(R, H), new THREE.Vector2(R + 0.02, H + 0.15), new THREE.Vector2(R + 0.3, H + 1.0), new THREE.Vector2(R + 1.25, H + 1.0),
    new THREE.Vector2(R + 1.7, H + 0.35), new THREE.Vector2(R + 2.1, -2.5)];
  const rimMat = new THREE.MeshBasicMaterial({ color: 0x35c8ff });
  const rim2Mat = new THREE.MeshBasicMaterial({ color: 0x2244aa });
  const edgeMat = new THREE.MeshBasicMaterial({ color: 0xff5a2a });
  const capMat = new THREE.MeshStandardMaterial({ color: 0x161d33, metalness: 0.8, roughness: 0.4, side: THREE.DoubleSide });
  const walls = new THREE.Group();
  scene.add(walls);
  const buildWalls = (g) => {
    // The glowing floor markings follow the stage too.
    paintGlow(floorMat.emissiveMap.image.getContext('2d'), g);
    floorMat.emissiveMap.needsUpdate = true;
    for (const m of [...walls.children]) { walls.remove(m); m.geometry.dispose(); }
    for (const [a0, a1] of wallArcs(g)) {
      const len = a1 - a0, segs = Math.max(8, Math.round((128 * len) / (Math.PI * 2)));
      // A lathe turns from +z toward +x; screen angle a sits at a + 90 degrees.
      const wall = new THREE.Mesh(mapUv(new THREE.LatheGeometry(rimProf, segs, a0 + Math.PI / 2, len)), floorMat);
      wall.receiveShadow = true;
      walls.add(wall);
      for (const [r, tube, mat, y] of [[R + 0.34, 0.07, rimMat, H + 1.04], [R + 1.22, 0.05, rim2Mat, H + 1.03]]) {
        const line = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 10, Math.max(12, segs), len), mat);
        line.rotation.set(Math.PI / 2, 0, -a1); line.position.y = y;
        walls.add(line);
      }
      if (len < Math.PI * 2 - 0.01) {
        // Where the wall stops: a glowing post, so a gap reads as a gap.
        for (const a of [a0, a1]) {
          const cap = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0.16), capMat);
          cap.position.set(Math.cos(a) * (R + 1.05), H + 0.3, -Math.sin(a) * (R + 1.05));
          cap.rotation.y = a;
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.5, 10), edgeMat);
          post.position.set(Math.cos(a) * (R + 0.2), H + 0.6, -Math.sin(a) * (R + 0.2));
          walls.add(cap, post);
        }
      }
    }
    // Where there is no wall, the edge itself is lit as a warning.
    const open = g.wall ? g.gaps.map(([c, h]) => [c - h, c + h]) : [[0, Math.PI * 2]];
    if (g.wall && !g.gaps.length) open.length = 0;
    for (const [a0, a1] of open) {
      const len = a1 - a0;
      const lip = new THREE.Mesh(new THREE.TorusGeometry(R + 0.06, 0.06, 8, Math.max(12, Math.round((160 * len) / (Math.PI * 2))), len), edgeMat);
      lip.rotation.set(Math.PI / 2, 0, -a1); lip.position.y = H + 0.03;
      walls.add(lip);
    }
  };
  buildWalls(STAGES[0]);

  // --- surroundings ---------------------------------------------------------
  const plat = new THREE.Mesh(new THREE.CylinderGeometry(R + 4.5, R + 6, 1.6, 64),
    new THREE.MeshStandardMaterial({ color: 0x0c1122, metalness: 0.7, roughness: 0.5 }));
  plat.position.y = -1.7; plat.receiveShadow = true;
  scene.add(plat);
  const platRing = new THREE.Mesh(new THREE.TorusGeometry(R + 4.5, 0.06, 8, 128), new THREE.MeshBasicMaterial({ color: 0x1d56c8 }));
  platRing.rotation.x = Math.PI / 2; platRing.position.y = -0.88;
  scene.add(platRing);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(180, 180), new THREE.MeshBasicMaterial({ map: hallTexture(), fog: false }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -2.5;
  scene.add(ground);

  // Stage light beams.
  const beams = [];
  const beamGeo = new THREE.CylinderGeometry(0.15, 1.5, 46, 20, 1, true);
  beamGeo.translate(0, 23, 0);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.4;
    const m = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({
      color: i % 2 ? 0x2a6cff : 0x8a3cff, transparent: true, opacity: 0.018, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false,
    }));
    m.position.set(Math.cos(a) * 34, -2.5, Math.sin(a) * 34);
    scene.add(m);
    beams.push({ m, a, ph: i * 1.7 });
  }
  // Crowd lights far out in the dark.
  const N = 1400, cp = new Float32Array(N * 3), cc = new Float32Array(N * 3);
  const palette = [new THREE.Color(0x3a8cff), new THREE.Color(0xff4a8a), new THREE.Color(0xffd27a), new THREE.Color(0x8affea)];
  for (let i = 0; i < N; i++) {
    const a = Math.random() * Math.PI * 2, r = 34 + Math.random() * 46;
    cp[i * 3] = Math.cos(a) * r; cp[i * 3 + 1] = -1 + (r - 34) * 0.55 + Math.random() * 3; cp[i * 3 + 2] = Math.sin(a) * r;
    const c = palette[(Math.random() * palette.length) | 0], b = 0.25 + Math.random() * 0.75;
    cc[i * 3] = c.r * b; cc[i * 3 + 1] = c.g * b; cc[i * 3 + 2] = c.b * b;
  }
  const crowdGeo = new THREE.BufferGeometry();
  crowdGeo.setAttribute('position', new THREE.BufferAttribute(cp, 3));
  crowdGeo.setAttribute('color', new THREE.BufferAttribute(cc, 3));
  const crowd = new THREE.Points(crowdGeo, new THREE.PointsMaterial({ size: 0.55, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  scene.add(crowd);

  // --- post -----------------------------------------------------------------
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.6, 0.5, 0.9);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const stage = {
    renderer, scene, camera, composer, bloom, floorMat, rimMat, beams, crowd, key,
    rimColor: new THREE.Color(0x35c8ff), rimPulse: 0, rimPulseColor: new THREE.Color(0xffffff),
    stageId: STAGES[0].id,
    // Rebuilds the rim for a stage (nothing to do if it is already that one).
    setStage(g) { if (g.id !== stage.stageId) { stage.stageId = g.id; buildWalls(g); } },
    width: 1, height: 1,
    resize() {
      const w = window.innerWidth, h = window.innerHeight;
      stage.width = w; stage.height = h;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
    update(dt, time) {
      for (const b of beams) {
        b.m.rotation.z = Math.sin(time * 0.35 + b.ph) * 0.28 - Math.cos(b.a) * 0.45;
        b.m.rotation.x = Math.cos(time * 0.3 + b.ph) * 0.28 + Math.sin(b.a) * 0.45;
      }
      crowd.rotation.y = time * 0.01;
      crowd.material.opacity = 0.75 + Math.sin(time * 7) * 0.08;
      stage.rimPulse = Math.max(0, stage.rimPulse - dt * 2.2);
      rimMat.color.copy(stage.rimColor).lerp(stage.rimPulseColor, Math.min(1, stage.rimPulse));
      rimMat.color.multiplyScalar(1.1 + stage.rimPulse * 0.7);
      floorMat.emissiveIntensity = 0.85 + stage.rimPulse * 0.25 + Math.sin(time * 2) * 0.05;
    },
    pulseRim(color, amount = 1) { stage.rimPulseColor.set(color); stage.rimPulse = Math.max(stage.rimPulse, amount); },
    render() { composer.render(); },
  };
  stage.resize();
  return stage;
}
