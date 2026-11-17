// Time of day. One number (tod: 0 = mid-afternoon … 0.55 = sunset … 1 = night) drives the sun, the sky,
// the haze and the exposure. Floodlight power is separate, so the director can switch towers on by hand.
import * as THREE from "three";
import { clamp01, lerp, smooth } from "./util";

type Key = {
  t: number;
  elev: number; // sun elevation, degrees
  az: number; // sun azimuth, degrees (0 = +x, 90 = +z)
  sun: [number, number, number, number]; // rgb + intensity
  hemiSky: [number, number, number, number];
  hemiGround: [number, number, number];
  zenith: [number, number, number];
  horizon: [number, number, number];
  glow: [number, number, number];
  cloudLight: [number, number, number];
  cloudDark: [number, number, number];
  fog: number;
  stars: number;
  exposure: number;
};

const KEYS: Key[] = [
  { t: 0.0, elev: 52, az: 205, sun: [1.0, 0.95, 0.86, 3.3], hemiSky: [0.5, 0.66, 1.0, 1.15], hemiGround: [0.22, 0.28, 0.13], zenith: [0.1, 0.27, 0.66], horizon: [0.5, 0.68, 0.9], glow: [0.6, 0.55, 0.42], cloudLight: [1.0, 1.0, 1.0], cloudDark: [0.52, 0.6, 0.74], fog: 0.0009, stars: 0, exposure: 0.92 },
  { t: 0.3, elev: 25, az: 222, sun: [1.0, 0.87, 0.68, 3.2], hemiSky: [0.52, 0.64, 0.95, 1.0], hemiGround: [0.22, 0.26, 0.13], zenith: [0.11, 0.26, 0.6], horizon: [0.66, 0.72, 0.8], glow: [0.9, 0.7, 0.42], cloudLight: [1.0, 0.95, 0.86], cloudDark: [0.5, 0.52, 0.66], fog: 0.001, stars: 0, exposure: 0.96 },
  { t: 0.45, elev: 9, az: 234, sun: [1.0, 0.64, 0.34, 2.9], hemiSky: [0.62, 0.58, 0.74, 0.82], hemiGround: [0.2, 0.2, 0.12], zenith: [0.13, 0.22, 0.5], horizon: [1.0, 0.62, 0.32], glow: [1.3, 0.72, 0.28], cloudLight: [1.1, 0.72, 0.42], cloudDark: [0.4, 0.3, 0.4], fog: 0.0011, stars: 0, exposure: 1.02 },
  { t: 0.55, elev: 0.8, az: 242, sun: [1.0, 0.4, 0.16, 1.5], hemiSky: [0.55, 0.42, 0.58, 0.6], hemiGround: [0.14, 0.12, 0.1], zenith: [0.09, 0.13, 0.36], horizon: [1.05, 0.42, 0.16], glow: [1.5, 0.45, 0.12], cloudLight: [1.1, 0.46, 0.26], cloudDark: [0.2, 0.14, 0.26], fog: 0.0012, stars: 0.0, exposure: 1.12 },
  { t: 0.68, elev: -7, az: 250, sun: [1.0, 0.4, 0.2, 0.0], hemiSky: [0.22, 0.26, 0.52, 0.34], hemiGround: [0.05, 0.05, 0.07], zenith: [0.022, 0.036, 0.12], horizon: [0.3, 0.15, 0.24], glow: [0.5, 0.14, 0.1], cloudLight: [0.24, 0.16, 0.26], cloudDark: [0.04, 0.045, 0.1], fog: 0.0013, stars: 0.3, exposure: 1.2 },
  { t: 1.0, elev: -25, az: 262, sun: [1.0, 0.4, 0.2, 0.0], hemiSky: [0.09, 0.12, 0.24, 0.24], hemiGround: [0.02, 0.025, 0.035], zenith: [0.004, 0.007, 0.02], horizon: [0.022, 0.032, 0.062], glow: [0.0, 0.0, 0.0], cloudLight: [0.035, 0.045, 0.075], cloudDark: [0.006, 0.008, 0.016], fog: 0.0014, stars: 1, exposure: 1.2 },
];

export type EnvState = {
  tod: number;
  sunDir: THREE.Vector3;
  sunColor: THREE.Color;
  sunI: number;
  hemiSky: THREE.Color;
  hemiGround: THREE.Color;
  hemiI: number;
  zenith: THREE.Color;
  horizon: THREE.Color;
  glow: THREE.Color;
  cloudLight: THREE.Color;
  cloudDark: THREE.Color;
  fogColor: THREE.Color;
  fog: number;
  stars: number;
  exposure: number;
  night: number; // 0 day … 1 night, for emissive things
};

const mix3 = (a: number[], b: number[], f: number) => new THREE.Color(lerp(a[0], b[0], f), lerp(a[1], b[1], f), lerp(a[2], b[2], f));

export const envAt = (todIn: number): EnvState => {
  const tod = clamp01(todIn);
  let i = 0;
  while (i < KEYS.length - 2 && tod > KEYS[i + 1].t) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const f = smooth(clamp01((tod - a.t) / (b.t - a.t)));
  const elev = (lerp(a.elev, b.elev, f) * Math.PI) / 180;
  const az = (lerp(a.az, b.az, f) * Math.PI) / 180;
  const horizon = mix3(a.horizon, b.horizon, f);
  const hemiSky = mix3(a.hemiSky, b.hemiSky, f);
  return {
    tod,
    sunDir: new THREE.Vector3(Math.cos(elev) * Math.cos(az), Math.sin(elev), Math.cos(elev) * Math.sin(az)).normalize(),
    sunColor: mix3(a.sun, b.sun, f),
    sunI: lerp(a.sun[3], b.sun[3], f),
    hemiSky,
    hemiGround: mix3(a.hemiGround, b.hemiGround, f),
    hemiI: lerp(a.hemiSky[3], b.hemiSky[3], f),
    zenith: mix3(a.zenith, b.zenith, f),
    horizon,
    glow: mix3(a.glow, b.glow, f),
    cloudLight: mix3(a.cloudLight, b.cloudLight, f),
    cloudDark: mix3(a.cloudDark, b.cloudDark, f),
    fogColor: horizon.clone().lerp(hemiSky, 0.35).multiplyScalar(0.92),
    fog: lerp(a.fog, b.fog, f),
    stars: lerp(a.stars, b.stars, f),
    exposure: lerp(a.exposure, b.exposure, f),
    night: smooth(clamp01((tod - 0.42) / 0.3)),
  };
};

// Where the four floodlight towers stand (unit directions from the middle, y is the head height in metres).
export const TOWER_ANGLES = [45, 135, 225, 315].map((d) => (d * Math.PI) / 180);
export const TOWER_COLOR = new THREE.Color(0.9, 0.95, 1.0);

// The same lights are needed in the stadium scene and in the close-up (macro) scene, so they come as a rig.
export class LightRig {
  sun = new THREE.DirectionalLight(0xffffff, 1);
  hemi = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
  towers: THREE.DirectionalLight[] = [];
  private sunR = 0;
  private towerR = 0;
  constructor(scene: THREE.Scene, sunMap = 2048, towerMap = 1024) {
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(sunMap, sunMap);
    this.sun.shadow.bias = -0.0004;
    scene.add(this.sun, this.sun.target, this.hemi);
    for (let i = 0; i < 4; i++) {
      const l = new THREE.DirectionalLight(0xffffff, 0);
      l.castShadow = true;
      l.shadow.mapSize.set(towerMap, towerMap);
      l.shadow.bias = -0.0005;
      scene.add(l, l.target);
      this.towers.push(l);
    }
    for (const l of [this.sun, this.hemi, ...this.towers]) l.layers.enableAll();
  }
  private fit(l: THREE.DirectionalLight, focus: THREE.Vector3, r: number, dist: number, key: "sunR" | "towerR" | null) {
    const c = l.shadow.camera;
    if (c.right !== r) {
      c.left = -r;
      c.right = r;
      c.top = r;
      c.bottom = -r;
      c.near = 1;
      c.far = dist * 2 + r * 2;
      c.updateProjectionMatrix();
      l.shadow.normalBias = (r / (l.shadow.mapSize.x / 2)) * 1.6;
    }
    if (key) this[key] = r;
    l.target.position.copy(focus);
    l.target.updateMatrixWorld();
  }
  // focus / radius: the patch of world the shadow maps should cover (small radius = crisp shadows).
  apply(env: EnvState, lamps: number[], focus: THREE.Vector3, radius: number, opts: { towerShadows?: boolean; towerGain?: number; scale?: number; yaw?: number } = {}) {
    const yaw = opts.yaw ?? 0; // the close-up stage is the stadium turned by -yaw about the vertical
    const UP = new THREE.Vector3(0, 1, 0);
    const k = opts.scale ?? 1; // macro scene works in its own units
    const sunOn = env.sunI > 0.02 && env.sunDir.y > -0.02;
    this.sun.visible = sunOn;
    this.sun.color.copy(env.sunColor);
    this.sun.intensity = env.sunI;
    this.sun.position.copy(focus).addScaledVector(env.sunDir.clone().applyAxisAngle(UP, -yaw), 320 * k);
    this.fit(this.sun, focus, radius, 320 * k, "sunR");
    this.sun.castShadow = sunOn;
    this.hemi.color.copy(env.hemiSky);
    this.hemi.groundColor.copy(env.hemiGround);
    this.hemi.intensity = env.hemiI;
    const gain = opts.towerGain ?? 1;
    this.towers.forEach((l, i) => {
      const a = TOWER_ANGLES[i];
      const dir = new THREE.Vector3(Math.cos(a) * 0.86, 0.5, Math.sin(a) * 0.86).normalize().applyAxisAngle(UP, -yaw);
      const p = lamps[i] ?? 0;
      l.visible = p > 0.004;
      l.color.copy(TOWER_COLOR);
      l.intensity = 1.05 * p * gain;
      l.position.copy(focus).addScaledVector(dir, 200 * k);
      l.castShadow = Boolean(opts.towerShadows) && p > 0.05;
      this.fit(l, focus, radius, 200 * k, "towerR");
    });
  }
}
