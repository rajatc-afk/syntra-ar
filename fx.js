// Gold sparkle particles and a shock ring for the pop-out moment.
import * as THREE from 'three';

function starTexture(){
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,230,160,.7)'); gr.addColorStop(1, 'rgba(255,200,80,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  g.fillStyle = 'rgba(255,245,210,.85)'; g.fillRect(31, 6, 2, 52); g.fillRect(6, 31, 52, 2);
  return new THREE.CanvasTexture(c);
}

export function makeSparkles(max = 260){
  const pos = new Float32Array(max * 3), col = new Float32Array(max * 3);
  const vel = new Float32Array(max * 3), age = new Float32Array(max).fill(99), life = new Float32Array(max).fill(1), sz = new Float32Array(max);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({ map: starTexture(), size: 0.045, sizeAttenuation: true, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const points = new THREE.Points(geo, mat); points.frustumCulled = false; let head = 0;
  return {
    points,
    burst(n, origin, speed, up = 0.6, spread = 0.5){
      for (let i = 0; i < n; i++){
        const k = head = (head + 1) % max, a = Math.random() * Math.PI * 2, s = speed * (0.4 + Math.random() * 0.8);
        pos.set([origin.x + Math.cos(a) * spread * 0.1, origin.y + Math.sin(a) * spread * 0.1, origin.z], k * 3);
        vel.set([Math.cos(a) * s, Math.sin(a) * s, s * up * (0.5 + Math.random())], k * 3);
        age[k] = 0; life[k] = 1.1 + Math.random() * 1.4; sz[k] = 1;
      }
    },
    update(dt){
      for (let k = 0; k < max; k++){
        if (age[k] >= life[k]){ col[k * 3] = col[k * 3 + 1] = col[k * 3 + 2] = 0; continue; }
        age[k] += dt; const t = age[k] / life[k], i = k * 3, drag = Math.pow(0.18, dt);
        vel[i] *= drag; vel[i + 1] *= drag; vel[i + 2] = vel[i + 2] * drag + 0.05 * dt;
        pos[i] += vel[i] * dt; pos[i + 1] += vel[i + 1] * dt; pos[i + 2] += vel[i + 2] * dt;
        const f = Math.max(0, Math.sin(Math.PI * Math.min(1, t * 1.15))) * (0.6 + 0.4 * Math.sin(age[k] * 18 + k));
        col[i] = 1.0 * f; col[i + 1] = 0.78 * f; col[i + 2] = 0.38 * f;
      }
      geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
    }
  };
}

export function makeShockRing(){
  const m = new THREE.Mesh(new THREE.RingGeometry(0.94, 1, 96), new THREE.MeshBasicMaterial({ color: 0xf0b840, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  m.position.z = 0.004; m.scale.setScalar(0.01); return m;
}
