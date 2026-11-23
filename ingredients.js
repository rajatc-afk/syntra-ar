// Procedural 3D models of the nine ingredients. Each builder returns a THREE.Group;
// use normalise(group, size) to centre it and scale its longest side to `size`.
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

const V3 = THREE.Vector3;

function rng(seed){ let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
function n3(x, y, z){ return Math.sin(x * 1.7 + Math.sin(y * 2.3) + z * 0.9) * 0.5 + Math.sin(y * 2.9 + Math.sin(z * 1.3) + x * 1.1) * 0.3 + Math.sin(z * 3.3 + x * 2.1 + Math.sin(x * 0.7)) * 0.2; }

function blob(geo, f){
  const p = geo.attributes.position, v = new V3(), d = new V3();
  for (let i = 0; i < p.count; i++){ v.fromBufferAttribute(p, i); d.copy(v).normalize(); v.addScaledVector(d, f(v, d)); p.setXYZ(i, v.x, v.y, v.z); }
  p.needsUpdate = true; geo.computeVertexNormals(); return geo;
}
function noiseTex(base, spots, { size = 256, count = 900, rMin = 1, rMax = 6, alpha = 0.35, seed = 1, repeat = 1 } = {}){
  const R = rng(seed), c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, size, size);
  for (let i = 0; i < count; i++){ g.globalAlpha = alpha * (0.4 + R() * 0.6); g.fillStyle = spots[(R() * spots.length) | 0]; g.beginPath(); g.arc(R() * size, R() * size, rMin + R() * (rMax - rMin), 0, 7); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
const std = (o) => new THREE.MeshStandardMaterial(o);

/* ───────── Cardamom: three green ridged pods ───────── */
function cardamom(){
  const g = new THREE.Group();
  const tex = noiseTex('#a9b66c', ['#8d9b50', '#c7cc8c', '#7a8944', '#b5bd78'], { count: 1500, rMin: 1, rMax: 5, seed: 3, repeat: 2 });
  const mat = std({ map: tex, bumpMap: tex, bumpScale: 1.4, roughness: 0.68 });
  const geo = new THREE.SphereGeometry(1, 56, 36), p = geo.attributes.position, v = new V3();
  for (let i = 0; i < p.count; i++){
    v.fromBufferAttribute(p, i);
    const th = Math.atan2(v.z, v.x), taper = 1 - 0.3 * Math.pow(Math.abs(v.y), 2.4), ridge = 1 + 0.11 * Math.cos(3 * th) * (1 - v.y * v.y * 0.4);
    p.setXYZ(i, v.x * 0.26 * taper * ridge, v.y * 0.5, v.z * 0.26 * taper * ridge);
  }
  geo.computeVertexNormals();
  [[0, 0, 0, 0.22], [0.24, 0.03, 0.06, -0.4], [-0.22, -0.05, -0.05, 0.75]].forEach(([x, y, z, rz], i) => {
    const pod = new THREE.Group(); pod.add(new THREE.Mesh(geo, mat));
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.028, 0.12, 8), std({ color: 0x6d5b2f, roughness: 0.9 })); stem.position.y = 0.55; pod.add(stem);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.07, 8), std({ color: 0x7b6a3a, roughness: 0.9 })); tip.position.y = -0.52; tip.rotation.x = Math.PI; pod.add(tip);
    pod.position.set(x, y, z); pod.rotation.set(0.15 * i, i * 1.3, rz); g.add(pod);
  });
  return g;
}

/* ───────── Bergamot: pear-shaped citrus with leaf and a cut slice ───────── */
function sliceTexture(){
  const s = 512, c = document.createElement('canvas'); c.width = c.height = s; const g = c.getContext('2d'), m = s / 2;
  g.fillStyle = '#d3cc2e'; g.beginPath(); g.arc(m, m, m - 2, 0, 7); g.fill();
  g.fillStyle = '#f4f0c4'; g.beginPath(); g.arc(m, m, m - 22, 0, 7); g.fill();
  const n = 10;
  for (let i = 0; i < n; i++){
    const a0 = i / n * Math.PI * 2 + 0.06, a1 = (i + 1) / n * Math.PI * 2 - 0.06;
    const gr = g.createRadialGradient(m, m, 10, m, m, m - 40); gr.addColorStop(0, '#f1ee8a'); gr.addColorStop(1, '#d9dc4c');
    g.fillStyle = gr; g.beginPath(); g.moveTo(m + Math.cos((a0 + a1) / 2) * 18, m + Math.sin((a0 + a1) / 2) * 18);
    g.arc(m, m, m - 40, a0, a1); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,255,220,.7)'; g.lineWidth = 3; g.beginPath(); g.arc(m, m, m - 60, a0 + 0.1, a1 - 0.1); g.stroke();
  }
  g.fillStyle = '#f7f4d2'; g.beginPath(); g.arc(m, m, 14, 0, 7); g.fill();
  const t = new THREE.CanvasTexture(g.canvas); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function bergamot(){
  const g = new THREE.Group();
  const tex = noiseTex('#cfd43c', ['#e5e05a', '#b6c230', '#a3b629', '#dcd84a'], { count: 1800, rMin: 1, rMax: 7, alpha: 0.3, seed: 8 });
  const geo = new THREE.SphereGeometry(0.5, 64, 44), p = geo.attributes.position, v = new V3();
  for (let i = 0; i < p.count; i++){
    v.fromBufferAttribute(p, i);
    const t = Math.max(0, v.y / 0.5), k = 1 - 0.22 * t * t, dimple = Math.sin(v.x * 75) * Math.sin(v.y * 75) * Math.sin(v.z * 75) * 0.007, f = 1 + dimple / Math.max(0.01, v.length());
    p.setXYZ(i, v.x * k * f, v.y * 0.92 * f, v.z * k * f);
  }
  geo.computeVertexNormals();
  const fruit = new THREE.Mesh(geo, std({ map: tex, bumpMap: tex, bumpScale: 0.8, roughness: 0.42 })); fruit.position.set(-0.22, 0, 0); g.add(fruit);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.026, 0.07, 8), std({ color: 0x6b6a2c, roughness: 0.8 })); stem.position.set(-0.22, 0.47, 0); g.add(stem);
  const leafShape = new THREE.Shape(); leafShape.moveTo(0, 0); leafShape.quadraticCurveTo(0.14, 0.12, 0, 0.38); leafShape.quadraticCurveTo(-0.14, 0.12, 0, 0);
  const leaf = new THREE.Mesh(new THREE.ShapeGeometry(leafShape, 8), std({ color: 0x4e8a2c, roughness: 0.6, side: THREE.DoubleSide })); leaf.position.set(-0.2, 0.48, 0.01); leaf.rotation.z = -0.95; g.add(leaf);
  const rind = std({ color: 0xd3cc2e, roughness: 0.5 }), face = std({ map: sliceTexture(), roughness: 0.35 });
  const slice = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.07, 56), [rind, face, face]);
  slice.rotation.set(Math.PI / 2, 0, 0); slice.rotation.y = -0.2; slice.position.set(0.52, -0.1, 0.14); g.add(slice);
  return g;
}

/* ───────── Black pepper: a heap of wrinkled peppercorns ───────── */
function pepper(){
  const g = new THREE.Group(), R = rng(21);
  const tex = noiseTex('#1f1c19', ['#34302b', '#0f0d0c', '#4a443d', '#2a2622'], { count: 1400, rMin: 1, rMax: 4, alpha: 0.5, seed: 4 });
  const mat = std({ map: tex, bumpMap: tex, bumpScale: 3, roughness: 0.85 });
  const spots = [[0, 0, 0], [0.27, 0.01, 0.04], [-0.26, 0, 0.08], [0.1, 0.26, 0], [-0.08, -0.25, 0.06], [0.24, -0.22, -0.04], [-0.2, 0.22, 0.1], [0.02, 0.02, 0.24]];
  spots.forEach((s, i) => {
    const geo = blob(new THREE.SphereGeometry(0.135, 28, 20), (v) => n3(v.x * 22 + i * 3, v.y * 22, v.z * 22) * 0.018 + n3(v.x * 55, v.y * 55 + i, v.z * 55) * 0.006);
    const m = new THREE.Mesh(geo, mat); m.position.set(...s); m.rotation.set(R() * 6, R() * 6, R() * 6); g.add(m);
  });
  return g;
}

/* ───────── Lavender: three flowering stems ───────── */
function lavender(){
  const g = new THREE.Group(), R = rng(5), stemMat = std({ color: 0x70894b, roughness: 0.8 });
  const budGeo = new THREE.SphereGeometry(1, 10, 8);
  [{ x: -0.13, lean: -0.14, h: 1.0 }, { x: 0, lean: 0.04, h: 1.12 }, { x: 0.13, lean: 0.16, h: 0.96 }].forEach((s) => {
    const curve = new THREE.CatmullRomCurve3([new V3(s.x * 0.2, -0.55, 0), new V3(s.x * 0.6 + s.lean * 0.1, -0.1, 0.02), new V3(s.x + s.lean * 0.5, 0.3, 0), new V3(s.x + s.lean, 0.5 * s.h, 0.01)]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 22, 0.013, 6), stemMat));
    const whorls = 12, per = 6, inst = new THREE.InstancedMesh(budGeo, std({ roughness: 0.6 }), whorls * per + 1);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), pos = new V3(), sc = new V3(), col = new THREE.Color(), axis = new V3(); let k = 0;
    for (let w = 0; w < whorls; w++){
      const t = 0.55 + (w / (whorls - 1)) * 0.45, c = curve.getPointAt(Math.min(t, 1)), fall = w / (whorls - 1), taper = 1 - 0.55 * fall;
      for (let j = 0; j < per; j++){
        const a = w * 0.55 + (j / per) * Math.PI * 2, r = 0.032 * taper;
        pos.set(c.x + Math.cos(a) * r, c.y, c.z + Math.sin(a) * r);
        axis.set(Math.sin(a), 0, -Math.cos(a)); q.setFromAxisAngle(axis, 0.6);
        sc.set(0.021 * taper + 0.004, 0.044 * taper + 0.008, 0.021 * taper + 0.004);
        m.compose(pos, q, sc); inst.setMatrixAt(k, m); col.setHSL(0.73 + R() * 0.04, 0.48, 0.48 + R() * 0.14 + fall * 0.04); inst.setColorAt(k, col); k++;
      }
    }
    const tp = curve.getPointAt(1); m.compose(new V3(tp.x, tp.y + 0.02, tp.z), new THREE.Quaternion(), new V3(0.012, 0.03, 0.012)); inst.setMatrixAt(k, m); inst.setColorAt(k, col.setHSL(0.74, 0.5, 0.6));
    g.add(inst);
  });
  const tie = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 20), std({ color: 0x8a6a3a, roughness: 0.9 })); tie.rotation.x = Math.PI / 2; tie.position.y = -0.28; g.add(tie);
  return g;
}

/* ───────── Cinnamon: rolled bark quills tied with twine ───────── */
function cinnamon(){
  const g = new THREE.Group();
  const tex = noiseTex('#9a5b2d', ['#7e4521', '#b6773f', '#6a3a1b', '#c28850'], { count: 1800, rMin: 1, rMax: 4, alpha: 0.4, seed: 9, repeat: 1 });
  const mat = std({ map: tex, bumpMap: tex, bumpScale: 2, roughness: 0.85 });
  function quill(len, r0, r1, turns){
    const N = 64, outer = [], inner = [];
    for (let i = 0; i <= N; i++){ const t = i / N, a = t * turns * Math.PI * 2, r = r0 + (r1 - r0) * t; outer.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r)); }
    for (let i = N; i >= 0; i--){ const t = i / N, a = t * turns * Math.PI * 2, r = r0 + (r1 - r0) * t - 0.024; inner.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r)); }
    const geo = new THREE.ExtrudeGeometry(new THREE.Shape([...outer, ...inner]), { depth: len, bevelEnabled: false, steps: 1 });
    geo.rotateX(-Math.PI / 2); geo.translate(0, -len / 2, 0); return new THREE.Mesh(geo, mat);
  }
  [[0, 0, 0, 1.0, 0.1], [0.19, 0.02, 0.05, 0.9, 0.2], [-0.12, 0, -0.16, 1.05, -0.15]].forEach(([x, y, z, len, tilt], i) => {
    const q = quill(len, 0.07, 0.15, 1.75 + i * 0.1); q.position.set(x, y, z); q.rotation.set(tilt * 0.4, i * 1.9, tilt); g.add(q);
  });
  const twine = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.014, 8, 36), std({ color: 0xcdb27a, roughness: 0.9 })); twine.rotation.x = Math.PI / 2; twine.position.set(0.03, 0.05, -0.02); g.add(twine);
  return g;
}

/* ───────── Iris: violet bearded iris on its stem ───────── */
function petalGeo(len, wid, curl, cup, c0, c1, beard){
  const g = new THREE.PlaneGeometry(1, 1, 12, 18), p = g.attributes.position, cols = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++){
    const s = p.getX(i) * 2, u = p.getY(i) + 0.5, prof = Math.pow(Math.sin(Math.PI * Math.pow(u, 0.72)), 0.85);
    p.setXYZ(i, s * wid * 0.5 * prof, u * len, curl * u * u * len + cup * s * s * prof * wid);
    const edge = Math.abs(s) * Math.abs(s);
    let r = c0[0] + (c1[0] - c0[0]) * u, gg = c0[1] + (c1[1] - c0[1]) * u, b = c0[2] + (c1[2] - c0[2]) * u;
    r += 0.12 * edge; gg += 0.1 * edge; b += 0.06 * edge;
    if (beard){ const w = Math.exp(-s * s * 26) * Math.max(0, Math.min(1, (u - 0.1) * 6)) * Math.max(0, Math.min(1, (0.62 - u) * 8)); r += (1 - r) * w * 0.95; gg += (0.8 - gg) * w * 0.95; b += (0.18 - b) * w * 0.95; }
    cols[i * 3] = r; cols[i * 3 + 1] = gg; cols[i * 3 + 2] = b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(cols, 3)); g.computeVertexNormals(); return g;
}
function iris(){
  const g = new THREE.Group(), mat = std({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.55 });
  const stdGeo = petalGeo(0.55, 0.42, -0.28, 0.14, [0.3, 0.2, 0.68], [0.6, 0.48, 0.92], false);
  const fallGeo = petalGeo(0.66, 0.4, 0.12, 0.12, [0.26, 0.17, 0.62], [0.46, 0.34, 0.82], true);
  for (let k = 0; k < 3; k++){
    const a = k * Math.PI * 2 / 3, ps = new THREE.Group(); ps.rotation.y = a; const m = new THREE.Mesh(stdGeo, mat); m.rotation.x = 0.28; m.position.z = 0.02; ps.add(m); g.add(ps);
    const pf = new THREE.Group(); pf.rotation.y = a + Math.PI / 3; const f = new THREE.Mesh(fallGeo, mat); f.rotation.x = 1.9; f.position.z = 0.03; pf.add(f); g.add(pf);
  }
  const stemMat = std({ color: 0x5f8a3e, roughness: 0.7 });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.03, 0.8, 10), stemMat); stem.position.y = -0.4; g.add(stem);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), stemMat); bulb.scale.set(1, 1.6, 1); bulb.position.y = -0.02; g.add(bulb);
  const ls = new THREE.Shape(); ls.moveTo(0, 0); ls.quadraticCurveTo(0.09, 0.45, 0.03, 1.0); ls.quadraticCurveTo(-0.01, 0.45, -0.03, 0);
  const leaf = new THREE.Mesh(new THREE.ShapeGeometry(ls, 10), std({ color: 0x4f8a35, roughness: 0.6, side: THREE.DoubleSide })); leaf.position.set(0.04, -0.78, 0.02); leaf.rotation.set(0, 0.5, 0.12); g.add(leaf);
  g.rotation.x = 0.0; return g;
}

/* ───────── Amber: raw glowing resin nuggets ───────── */
function amberGeo(r, seed){
  let geo = new THREE.IcosahedronGeometry(r, 4); geo.deleteAttribute('normal'); geo.deleteAttribute('uv'); geo = mergeVertices(geo, 1e-4);
  return blob(geo, (v) => (n3(v.x * 4.2 + seed, v.y * 4.2, v.z * 4.2) * 0.2 + n3(v.x * 11 + seed, v.y * 11, v.z * 11) * 0.03) * r * 1.0);
}
function amber(){
  const g = new THREE.Group(), R = rng(12);
  const shellMat = new THREE.MeshPhysicalMaterial({ color: 0xf2a31d, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.06, transparent: true, opacity: 0.8, emissive: 0x8d3d00, emissiveIntensity: 0.4 });
  const coreMat = std({ color: 0xc4620a, roughness: 0.4, emissive: 0x7a2a00, emissiveIntensity: 0.5 });
  [[0, 0, 0, 0.42, 1], [0.46, -0.16, 0.1, 0.24, 2], [-0.38, -0.2, 0.12, 0.2, 3]].forEach(([x, y, z, r, sd]) => {
    const n = new THREE.Group(), shell = new THREE.Mesh(amberGeo(r, sd), shellMat), core = new THREE.Mesh(amberGeo(r * 0.62, sd + 5), coreMat);
    shell.scale.set(1, 0.84, 0.9); core.scale.copy(shell.scale); n.add(core, shell);
    for (let i = 0; i < 9; i++){ const f = new THREE.Mesh(new THREE.SphereGeometry(r * 0.04, 6, 5), std({ color: 0x3a1c05, roughness: 0.7 })); f.position.set((R() - 0.5) * r, (R() - 0.5) * r * 0.7, (R() - 0.5) * r * 0.7); n.add(f); }
    n.position.set(x, y, z); n.rotation.set(R() * 3, R() * 3, R() * 3); g.add(n);
  });
  return g;
}

/* ───────── Tonka: wrinkled almond-shaped beans ───────── */
function tonka(){
  const g = new THREE.Group();
  const tex = noiseTex('#33211a', ['#4f3224', '#26150e', '#62402b'], { count: 1700, rMin: 1, rMax: 4, alpha: 0.4, seed: 6 });
  const mat = std({ map: tex, bumpMap: tex, bumpScale: 3, roughness: 0.5 });
  const geo = new THREE.SphereGeometry(1, 56, 40), p = geo.attributes.position, v = new V3();
  for (let i = 0; i < p.count; i++){
    v.fromBufferAttribute(p, i);
    const taper = 1 - 0.32 * Math.pow(Math.max(0, v.y), 2), ridge = 1 + Math.sin(v.y * 24 + Math.sin(v.x * 7 + v.z * 6) * 2.2) * 0.05 + n3(v.x * 9, v.y * 9, v.z * 9) * 0.03;
    p.setXYZ(i, v.x * 0.17 * taper * ridge, v.y * 0.5, v.z * 0.12 * taper * ridge);
  }
  geo.computeVertexNormals();
  [[0, 0, 0, 0.25], [0.26, -0.04, 0.05, -0.5], [-0.24, 0.05, -0.04, 0.9]].forEach(([x, y, z, rz], i) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(0.2 * i, i * 1.4, rz); g.add(m); });
  return g;
}

/* ───────── Vetiver: a bundle of long earthy roots ───────── */
function vetiver(){
  const g = new THREE.Group(), R = rng(17);
  for (let i = 0; i < 24; i++){
    const a = i * 2.4, s = 0.05 + R() * 0.1, w = (R() - 0.5) * 0.12;
    const pts = [new V3(Math.cos(a) * 0.02, -0.06, Math.sin(a) * 0.02), new V3(Math.cos(a) * s * 1.5 + w, -0.4, Math.sin(a) * s * 1.5), new V3(Math.cos(a) * s * 3 - w, -0.8, Math.sin(a) * s * 3), new V3(Math.cos(a) * s * 3.6 + w * 0.6, -1.1 - R() * 0.25, Math.sin(a) * s * 3.6)];
    const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.011 + R() * 0.006, 5), std({ color: new THREE.Color().setHSL(0.09 + R() * 0.02, 0.38, 0.32 + R() * 0.16), roughness: 0.9 }));
    g.add(m);
  }
  for (let i = 0; i < 7; i++){ const a = i * 0.9, h = 0.28 + (i % 3) * 0.06, s = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.014, h, 5), std({ color: 0xb59a5a, roughness: 0.9 })); s.position.set(Math.cos(a) * 0.035, 0.1 + h / 2 - 0.1, Math.sin(a) * 0.035); s.rotation.set(Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25); g.add(s); }
  const twine = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.013, 8, 20), std({ color: 0x6b4a2a, roughness: 0.9 })); twine.rotation.x = Math.PI / 2; twine.position.y = -0.04; g.add(twine);
  return g;
}

export const MODELS = { Cardamom: cardamom, Bergamot: bergamot, 'Black Pepper': pepper, Lavender: lavender, Cinnamon: cinnamon, Iris: iris, Amber: amber, Tonka: tonka, Vetiver: vetiver };

/** Centre a group and scale its longest side to `size`. */
export function normalise(group, size){
  const box = new THREE.Box3().setFromObject(group), c = box.getCenter(new V3()), s = box.getSize(new V3()), k = size / Math.max(s.x, s.y, s.z, 1e-6);
  const w = new THREE.Group(); group.position.sub(c); w.add(group); w.scale.setScalar(k); return w;
}
