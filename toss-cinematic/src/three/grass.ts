// Grass at blade level, with dew. Thousands of instanced blades in a wedge in front of the lens, and beads of
// water sitting on them that catch the floodlights. Lives in the close-up scene, in metres.
import * as THREE from "three";
import { canvasTex, makeCanvas, rng } from "./util";

const bladeGeo = () => {
  // a tapered, slightly folded ribbon: 4 segments
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const N = 4;
  for (let i = 0; i <= N; i++) {
    const v = i / N;
    const w = 0.5 * (1 - v * v * 0.92);
    const bend = v * v * 0.42;
    pos.push(-w, v, bend, w, v, bend);
    const g = 0.32 + v * 0.75;
    col.push(g, g, g, g, g, g);
  }
  for (let i = 0; i < N; i++) {
    const k = i * 2;
    idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};

export class GrassPatch {
  group = new THREE.Group();
  drops: THREE.InstancedMesh;
  dropMat: THREE.MeshStandardMaterial;
  bladeMat: THREE.MeshStandardMaterial;
  groundMat: THREE.MeshStandardMaterial;
  private dropBase: { p: THREE.Vector3; r: number }[] = [];
  constructor() {
    const r = rng(1234);
    const COUNT = 42000;
    this.bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, side: THREE.DoubleSide, roughness: 0.5, metalness: 0, envMapIntensity: 0.5 });
    const blades = new THREE.InstancedMesh(bladeGeo(), this.bladeMat, COUNT);
    blades.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(COUNT * 3), 3);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const c = new THREE.Color();
    const tips: { p: THREE.Vector3; h: number; q: THREE.Quaternion }[] = [];
    for (let i = 0; i < COUNT; i++) {
      // wedge opening away from the lens (which looks down -z from near the origin): dense close, sparser far
      const d = 0.1 + Math.pow(r(), 1.9) * 3.0;
      const a = (r() - 0.5) * 1.5;
      const x = Math.sin(a) * d * 1.15;
      const z = -Math.cos(a) * d + 0.25;
      const h = 0.03 + r() * 0.045;
      e.set((r() - 0.5) * 0.7, r() * Math.PI * 2, (r() - 0.5) * 0.5);
      q.setFromEuler(e);
      m.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(0.0026 + r() * 0.0022, h, h * 0.6));
      blades.setMatrixAt(i, m);
      const hue = 0.26 + (r() - 0.5) * 0.05;
      c.setHSL(hue, 0.5 + r() * 0.2, 0.2 + r() * 0.12);
      blades.setColorAt(i, c);
      if (d < 2.2 && r() < 0.42) tips.push({ p: new THREE.Vector3(x, 0, z), h, q: q.clone() });
    }
    blades.castShadow = false;
    blades.receiveShadow = true;
    blades.frustumCulled = false;
    this.group.add(blades);
    // soil / thatch under the blades, fading out at the rim
    const [gc, gctx] = makeCanvas(512, 512);
    gctx.fillStyle = "#1d3a1c";
    gctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) {
      gctx.strokeStyle = `rgba(${30 + r() * 50},${70 + r() * 70},${25 + r() * 30},${0.35 + r() * 0.4})`;
      gctx.lineWidth = 1 + r();
      const x = r() * 512;
      const y = r() * 512;
      const a = r() * 7;
      gctx.beginPath();
      gctx.moveTo(x, y);
      gctx.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9);
      gctx.stroke();
    }
    const [ac, actx] = makeCanvas(256, 256);
    const g = actx.createRadialGradient(128, 128, 20, 128, 128, 128);
    g.addColorStop(0, "#fff");
    g.addColorStop(0.6, "#fff");
    g.addColorStop(1, "#000");
    actx.fillStyle = g;
    actx.fillRect(0, 0, 256, 256);
    const gt = canvasTex(gc, true, true);
    gt.repeat.set(10, 10);
    this.groundMat = new THREE.MeshStandardMaterial({ map: gt, alphaMap: canvasTex(ac, false), transparent: true, roughness: 0.85, envMapIntensity: 0.2 });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), this.groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, -2.2);
    ground.receiveShadow = true;
    this.group.add(ground);
    // dew: beads along and at the tips of blades
    // water: almost clear, so what you see is the sharp reflection of the lights and a bright rim
    this.dropMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.75, 0.9, 0.85), metalness: 0.0, roughness: 0.03, envMapIntensity: 3.0, transparent: true, opacity: 0.42, depthWrite: false });
    const beads: { p: THREE.Vector3; r: number }[] = [];
    for (const t of tips) {
      const n = 1 + Math.floor(r() * 2.4);
      for (let k = 0; k < n; k++) {
        const v = 0.35 + r() * 0.65;
        const local = new THREE.Vector3((r() - 0.5) * 0.6 * 0.004, v * t.h, v * v * 0.42 * t.h * 0.6);
        local.applyQuaternion(t.q).add(t.p);
        beads.push({ p: local, r: 0.0009 + r() * r() * 0.0019 });
      }
    }
    this.dropBase = beads;
    this.drops = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 9), this.dropMat, beads.length);
    this.drops.renderOrder = 3;
    this.drops.frustumCulled = false;
    this.group.add(this.drops);
    this.setDew(1);
    this.group.visible = false;
  }
  // amount 0…1: beads swell from nothing
  setDew(amount: number) {
    const m = new THREE.Matrix4();
    const s = new THREE.Vector3();
    const q = new THREE.Quaternion();
    this.dropBase.forEach((b, i) => {
      const k = Math.max(0, Math.min(1, amount * 1.6 - ((i * 0.618) % 1) * 0.6));
      s.setScalar(Math.max(1e-6, b.r * k));
      m.compose(b.p, q, s);
      this.drops.setMatrixAt(i, m);
    });
    this.drops.instanceMatrix.needsUpdate = true;
    this.drops.visible = amount > 0.01;
    this.bladeMat.roughness = 0.62 - amount * 0.22;
  }
}

// Soft out-of-focus dust in front of the lens for the coin shots.
export class Motes {
  points: THREE.Points;
  mat: THREE.ShaderMaterial;
  constructor() {
    const r = rng(55);
    const pos: number[] = [];
    const seed: number[] = [];
    for (let i = 0; i < 70; i++) {
      pos.push((r() - 0.5) * 9, (r() - 0.5) * 14, (r() - 0.5) * 8);
      seed.push(r() * 100);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("seed", new THREE.Float32BufferAttribute(seed, 1));
    this.mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uAmt: { value: 1 }, uH: { value: 1440 } },
      vertexShader: `attribute float seed; uniform float uTime, uH; varying float vA;
        void main(){ vec3 p = position; p.x += sin(uTime * 0.21 + seed) * 0.5; p.y += mod(uTime * (0.05 + fract(seed) * 0.08) + seed, 14.0) - 7.0 - position.y; p.z += cos(uTime * 0.17 + seed * 1.7) * 0.4;
          vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
          float d = -mv.z; gl_PointSize = uH * (0.010 + 0.05 * abs(d - 6.0) / 6.0) / max(d, 0.4) * 2.0; vA = 0.25 + 0.75 * fract(seed * 7.3); }`,
      fragmentShader: `precision highp float; varying float vA; uniform float uAmt;
        void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.36, d) * (0.6 + 0.4 * smoothstep(0.2, 0.45, d)); gl_FragColor = vec4(vec3(1.0, 0.93, 0.78) * a * vA * uAmt * 0.11, 1.0); }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
    });
    this.points = new THREE.Points(g, this.mat);
    this.points.frustumCulled = false;
  }
}
