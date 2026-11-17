// Small deterministic maths kit for the 3D director. Everything is a pure function of film time.
import * as THREE from "three";

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// Progress of t through [a, b], clamped.
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const smooth = (x: number) => x * x * (3 - 2 * x);
export const smoother = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
export const easeOutQuint = (x: number) => 1 - Math.pow(1 - x, 5);
export const easeIn = (x: number) => x * x * x;
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOutBack = (x: number, k = 1.70158) => 1 + (k + 1) * Math.pow(x - 1, 3) + k * Math.pow(x - 1, 2);
// Eased progress helpers
export const sseg = (t: number, a: number, b: number) => smoother(seg(t, a, b));
export const oseg = (t: number, a: number, b: number) => easeOut(seg(t, a, b));
export const ioseg = (t: number, a: number, b: number) => easeInOut(seg(t, a, b));
// Critically damped settle: 0 → 1 with a little overshoot, for physical things that arrive.
export const settle = (x: number, freq = 2.2, damp = 5) => (x <= 0 ? 0 : 1 - Math.exp(-damp * x) * Math.cos(freq * Math.PI * 2 * x * 0.5));

export const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export const hash1 = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
// Smooth 1D value noise, for hand-held drift and flicker.
export const noise1 = (x: number) => {
  const i = Math.floor(x);
  const f = x - i;
  return lerp(hash1(i), hash1(i + 1), smooth(f)) * 2 - 1;
};

export const v3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const lerpV = (a: THREE.Vector3, b: THREE.Vector3, t: number, out = new THREE.Vector3()) => out.copy(a).lerp(b, t);

// A camera pose and a smooth path through several of them.
export type Pose = { p: THREE.Vector3; l: THREE.Vector3; fov: number; roll?: number };
export const pose = (px: number, py: number, pz: number, lx: number, ly: number, lz: number, fov = 40, roll = 0): Pose => ({ p: v3(px, py, pz), l: v3(lx, ly, lz), fov, roll });

export class Path {
  private pc: THREE.CatmullRomCurve3;
  private lc: THREE.CatmullRomCurve3;
  constructor(private poses: Pose[]) {
    this.pc = new THREE.CatmullRomCurve3(poses.map((q) => q.p), false, "catmullrom", 0.5);
    this.lc = new THREE.CatmullRomCurve3(poses.map((q) => q.l), false, "catmullrom", 0.5);
  }
  // u in [0, 1] across the whole path (uniform in key index).
  at(u: number): Pose {
    const n = this.poses.length - 1;
    const x = clamp01(u) * n;
    const i = Math.min(n - 1, Math.floor(x));
    const f = x - i;
    return {
      p: this.pc.getPoint(clamp01(u)),
      l: this.lc.getPoint(clamp01(u)),
      fov: lerp(this.poses[i].fov, this.poses[i + 1].fov, smooth(f)),
      roll: lerp(this.poses[i].roll ?? 0, this.poses[i + 1].roll ?? 0, smooth(f)),
    };
  }
}
export const mixPose = (a: Pose, b: Pose, t: number): Pose => ({ p: lerpV(a.p, b.p, t), l: lerpV(a.l, b.l, t), fov: lerp(a.fov, b.fov, t), roll: lerp(a.roll ?? 0, b.roll ?? 0, t) });

export const applyPose = (cam: THREE.PerspectiveCamera, q: Pose) => {
  cam.position.copy(q.p);
  cam.up.set(0, 1, 0);
  cam.lookAt(q.l);
  if (q.roll) cam.rotateZ(q.roll);
  if (cam.fov !== q.fov) {
    cam.fov = q.fov;
    cam.updateProjectionMatrix();
  }
  cam.updateMatrixWorld(true);
};

// Canvas helper
export const makeCanvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
};
export const canvasTex = (c: HTMLCanvasElement, srgb = true, repeat = false) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
};

// Height canvas (grey = height) → tangent-space normal map.
export const normalFromHeight = (src: HTMLCanvasElement, strength: number) => {
  const w = src.width;
  const h = src.height;
  const d = src.getContext("2d")!.getImageData(0, 0, w, h).data;
  const [c, ctx] = makeCanvas(w, h);
  const out = ctx.createImageData(w, h);
  const H = (x: number, y: number) => d[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (H(x + 1, y) - H(x - 1, y)) * strength;
      const dy = (H(x, y + 1) - H(x, y - 1)) * strength;
      const l = Math.hypot(dx, dy, 1);
      const i = (y * w + x) * 4;
      out.data[i] = (-dx / l) * 127.5 + 127.5;
      out.data[i + 1] = (dy / l) * 127.5 + 127.5;
      out.data[i + 2] = (1 / l) * 127.5 + 127.5;
      out.data[i + 3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);
  return c;
};

// Tileable grey noise texture (for detail, dust, haze).
export const noiseCanvas = (size: number, seed: number, octaves = 4) => {
  const [c, ctx] = makeCanvas(size, size);
  const img = ctx.createImageData(size, size);
  const r = rng(seed);
  const grids: Float32Array[] = [];
  for (let o = 0; o < octaves; o++) {
    const n = 4 << o;
    const g = new Float32Array(n * n);
    for (let i = 0; i < g.length; i++) g[i] = r();
    grids.push(g);
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let v = 0;
      let amp = 0.5;
      let tot = 0;
      for (let o = 0; o < octaves; o++) {
        const n = 4 << o;
        const fx = (x / size) * n;
        const fy = (y / size) * n;
        const x0 = Math.floor(fx);
        const y0 = Math.floor(fy);
        const tx = smooth(fx - x0);
        const ty = smooth(fy - y0);
        const g = grids[o];
        const a = g[(y0 % n) * n + (x0 % n)];
        const b = g[(y0 % n) * n + ((x0 + 1) % n)];
        const cc = g[((y0 + 1) % n) * n + (x0 % n)];
        const dd = g[((y0 + 1) % n) * n + ((x0 + 1) % n)];
        v += amp * lerp(lerp(a, b, tx), lerp(cc, dd, tx), ty);
        tot += amp;
        amp *= 0.5;
      }
      const k = Math.round((v / tot) * 255);
      const i = (y * size + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = k;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
};
