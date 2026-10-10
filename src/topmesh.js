// Procedural model of a spinning top. The origin is the tip that touches the floor.
import * as THREE from 'three';

function ringShape(teeth, type) {
  const s = new THREE.Shape();
  const seg = (Math.PI * 2) / teeth;
  const pt = (r, a, first) => s[first ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r);
  for (let i = 0; i < teeth; i++) {
    const a = i * seg;
    if (type === 'ATTACK') {
      // Long swept blades.
      pt(0.62, a, i === 0); pt(1.04, a + seg * 0.1); pt(1.0, a + seg * 0.22); pt(0.84, a + seg * 0.5); pt(0.7, a + seg * 0.78);
    } else if (type === 'DEFENSE') {
      // Blunt, almost round.
      pt(0.9, a, i === 0); pt(1.0, a + seg * 0.12); pt(1.0, a + seg * 0.62); pt(0.9, a + seg * 0.76); pt(0.84, a + seg * 0.88);
    } else {
      pt(0.74, a, i === 0); pt(0.98, a + seg * 0.16); pt(0.98, a + seg * 0.5); pt(0.86, a + seg * 0.74); pt(0.74, a + seg * 0.86);
    }
  }
  s.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.4, 0, Math.PI * 2, true);
  s.holes.push(hole);
  return s;
}

function blurTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.translate(128, 128);
  for (let i = 0; i < 90; i++) {
    const r = 84 + Math.random() * 40, a = Math.random() * Math.PI * 2, l = 0.5 + Math.random() * 1.6;
    g.strokeStyle = `rgba(255,255,255,${0.05 + Math.random() * 0.22})`;
    g.lineWidth = 1 + Math.random() * 4;
    g.beginPath(); g.arc(0, 0, r, a, a + l); g.stroke();
  }
  const grad = g.createRadialGradient(0, 0, 90, 0, 0, 128);
  grad.addColorStop(0, 'rgba(255,255,255,0)'); grad.addColorStop(0.7, 'rgba(255,255,255,0.35)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad; g.beginPath(); g.arc(0, 0, 128, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

let sharedBlur = null;

export function buildTop(blade, glowTex) {
  const color = new THREE.Color(blade.color);
  const group = new THREE.Group();      // position + tilt
  const spin = new THREE.Group();       // rotates around the axis
  group.add(spin);
  const add = (geo, mat, y = 0, parent = spin) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.y = y; m.castShadow = true;
    parent.add(m);
    return m;
  };

  const chrome = new THREE.MeshStandardMaterial({ color: 0xb9c2d6, metalness: 1, roughness: 0.2, envMapIntensity: 1.0 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x141a2a, metalness: 0.9, roughness: 0.32 });
  const body = new THREE.MeshPhysicalMaterial({ color: color.clone().multiplyScalar(0.42), metalness: 0.5, roughness: 0.34, clearcoat: 0.5, clearcoatRoughness: 0.2, envMapIntensity: 0.6, emissive: color, emissiveIntensity: 0.14 });
  const deep = new THREE.MeshPhysicalMaterial({ color: color.clone().multiplyScalar(0.16), metalness: 0.7, roughness: 0.32, clearcoat: 0.5, clearcoatRoughness: 0.2, envMapIntensity: 0.7 });
  const energy = new THREE.MeshBasicMaterial({ color: color.clone().lerp(new THREE.Color(0xffffff), 0.2).multiplyScalar(1.2) });

  const tip = add(new THREE.ConeGeometry(0.17, 0.36, 16), chrome, 0.18);
  tip.rotation.x = Math.PI;
  add(new THREE.CylinderGeometry(0.44, 0.2, 0.2, 24), dark, 0.44);
  add(new THREE.CylinderGeometry(0.9, 0.78, 0.13, 64), chrome, 0.59);
  add(new THREE.CylinderGeometry(0.8, 0.8, 0.05, 64), energy, 0.68);

  const extrude = { depth: 0.18, bevelEnabled: true, bevelThickness: 0.045, bevelSize: 0.04, bevelSegments: 3, curveSegments: 24 };
  const ringGeo = new THREE.ExtrudeGeometry(ringShape(blade.teeth, blade.type), extrude);
  ringGeo.rotateX(-Math.PI / 2);
  add(ringGeo, body, 0.75);
  // A smaller, darker plate on top, turned half a tooth, for a layered look.
  const upper = add(ringGeo, deep, 0.93);
  upper.scale.set(0.7, 0.55, 0.7);
  upper.rotation.y = Math.PI / blade.teeth;
  const seg = (Math.PI * 2) / blade.teeth;
  for (let i = 0; i < blade.teeth; i++) {
    // Chrome stud and a glowing slit on each blade so the spin reads at a glance.
    const a = (i + 0.3) * seg;
    const stud = add(new THREE.CylinderGeometry(0.065, 0.065, 0.06, 12), chrome, 1.0);
    stud.position.x = Math.cos(a) * 0.86; stud.position.z = -Math.sin(a) * 0.86;
    const slit = add(new THREE.BoxGeometry(0.2, 0.03, 0.045), energy, 0.985);
    const b = (i + 0.52) * seg;
    slit.position.x = Math.cos(b) * 0.8; slit.position.z = -Math.sin(b) * 0.8;
    slit.rotation.y = b;
    slit.castShadow = false;
  }
  add(new THREE.CylinderGeometry(0.4, 0.44, 0.1, 40), chrome, 1.07);
  add(new THREE.CylinderGeometry(0.3, 0.34, 0.1, 6), deep, 1.14);
  add(new THREE.CylinderGeometry(0.13, 0.15, 0.06, 20), energy, 1.2);

  if (!sharedBlur) sharedBlur = blurTexture();
  const blurMat = new THREE.MeshBasicMaterial({ map: sharedBlur, color, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const blur = new THREE.Mesh(new THREE.CircleGeometry(1.12, 48), blurMat);
  blur.rotation.x = -Math.PI / 2; blur.position.y = 0.9;
  group.add(blur);

  // Glow pooled on the floor under the top.
  const aura = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: glowTex, color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
  aura.rotation.x = -Math.PI / 2; aura.position.y = 0.06; aura.scale.setScalar(5);
  aura.renderOrder = 5;
  group.add(aura);

  // Guard barrier.
  const shieldMat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: color.clone().lerp(new THREE.Color(0xffffff), 0.35) }, uTime: { value: 0 }, uAlpha: { value: 0 } },
    vertexShader: `varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); vP = position; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uTime; uniform float uAlpha; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        float band = 0.5 + 0.5 * sin(vP.y * 9.0 - uTime * 9.0);
        float hex = smoothstep(0.86, 1.0, abs(sin(atan(vP.z, vP.x) * 6.0 + vP.y * 3.0)));
        gl_FragColor = vec4(uColor * (f * 1.5 + band * 0.12 + hex * 0.35) * uAlpha, 1.0); }`,
    blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, side: THREE.DoubleSide,
  });
  const shield = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 20), shieldMat);
  shield.position.y = 0.7; shield.visible = false;
  group.add(shield);

  spin.scale.setScalar(1.25); blur.scale.setScalar(1.25); blur.position.y = 1.12; shield.scale.setScalar(1.25); shield.position.y = 0.85;
  return { group, spin, blur, blurMat, aura, shield, shieldMat, body, color, wobble: Math.random() * 6, shieldAlpha: 0 };
}

export function disposeTop(v) {
  v.group.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) o.material.dispose();
  });
}
