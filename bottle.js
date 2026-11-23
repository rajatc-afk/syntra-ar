// ZARA Man Gold: matte black rectangular flask, short dark collar, glossy black cap, soft gold lettering.
// Proportions are measured from the product photo (body 505 x 760 px, cap 210 x 218 px).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const BOTTLE = { W: 1.0, H: 1.5, D: 0.6, CAP_H: 0.43, CAP_R: 0.21 };

function drawSpaced(g, text, cx, cy, size, spacing){
  g.font = `500 ${size}px Montserrat, "Helvetica Neue", Arial, sans-serif`;
  const ws = [...text].map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + spacing * (text.length - 1);
  let x = cx - total / 2; [...text].forEach((ch, i) => { g.fillText(ch, x, cy); x += ws[i] + spacing; });
  return total;
}
function fitSize(g, text, target, spacingRatio){
  g.font = '500 100px Montserrat, "Helvetica Neue", Arial, sans-serif';
  const raw = [...text].reduce((a, ch) => a + g.measureText(ch).width, 0), n = text.length - 1;
  return 100 * target / (raw + 100 * spacingRatio * n);
}
async function labelTexture(lines){
  try { await document.fonts.load('500 80px Montserrat'); } catch (e) { /* falls back to Helvetica */ }
  const c = document.createElement('canvas'); c.width = 2048; c.height = 1024; const g = c.getContext('2d');
  g.fillStyle = '#d7c18d'; g.textBaseline = 'middle'; g.textAlign = 'left';
  const s1 = fitSize(g, lines[0], 0.36 * 2048, 0.1), s2 = fitSize(g, lines[1], 0.285 * 2048, 0.14);
  drawSpaced(g, lines[0], 1024, 450, s1, s1 * 0.1); drawSpaced(g, lines[1], 1024, 648, s2, s2 * 0.14);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function grain(){
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#808080'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 9000; i++){ const v = 110 + Math.random() * 60; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(Math.random() * 256, Math.random() * 256, 1.5, 1.5); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 4); return t;
}

export async function makeBottle(labelLines){
  const { W, H, D, CAP_H, CAP_R } = BOTTLE, group = new THREE.Group();
  const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x0c0c0d, roughness: 0.6, metalness: 0.0, clearcoat: 0.12, clearcoatRoughness: 0.55, sheen: 0.5, sheenRoughness: 0.5, sheenColor: new THREE.Color(0x2a2a2c), bumpMap: grain(), bumpScale: 0.25 });
  const body = new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 10, 0.075), bodyMat); body.position.y = H / 2; group.add(body);

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.18, 0.06, 48), new THREE.MeshStandardMaterial({ color: 0x151517, roughness: 0.35, metalness: 0.6 })); collar.position.y = H + 0.01; group.add(collar);

  // cap: lathe profile with a soft bevel on the top edge
  const pts = [new THREE.Vector2(0, 0), new THREE.Vector2(CAP_R - 0.004, 0), new THREE.Vector2(CAP_R, 0.008), new THREE.Vector2(CAP_R, CAP_H - 0.045)];
  for (let i = 1; i <= 8; i++){ const a = (i / 8) * Math.PI / 2; pts.push(new THREE.Vector2(CAP_R - 0.045 + Math.cos(a) * 0.045, CAP_H - 0.045 + Math.sin(a) * 0.045)); }
  pts.push(new THREE.Vector2(0, CAP_H));
  const capMat = new THREE.MeshPhysicalMaterial({ color: 0x050506, roughness: 0.14, metalness: 0.25, clearcoat: 1, clearcoatRoughness: 0.04 });
  const cap = new THREE.Mesh(new THREE.LatheGeometry(pts, 72), capMat); cap.position.y = H + 0.035; group.add(cap);

  const label = new THREE.Mesh(new THREE.PlaneGeometry(W, W * 0.5), new THREE.MeshBasicMaterial({ map: await labelTexture(labelLines), transparent: true, toneMapped: false }));
  label.position.set(0, 1.055, D / 2 + 0.0015); group.add(label);

  return { group, cap, capRest: cap.position.y, body };
}
