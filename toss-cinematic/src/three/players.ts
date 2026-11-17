// Stylised cricketers: jointed figures posed by a handful of angles, so every movement is a pure function of time.
// They are meant to be read at mid-distance and in silhouette, never as portraits of real players.
import * as THREE from "three";

export type Kit = { shirt: number; trousers: number; skin: number; head?: "cap" | "helmet" | "bare"; headColor?: number; pads?: boolean; bat?: boolean };
export type J = {
  y?: number; // hip height offset
  lean?: number; // torso forward lean
  twist?: number; // torso twist
  bend?: number; // torso side bend
  headX?: number;
  headY?: number;
  shL?: [number, number]; // shoulder: swing (forward +), abduction (out +)
  shR?: [number, number];
  elL?: number; // elbow bend
  elR?: number;
  hipL?: [number, number]; // hip: swing (forward +), abduction
  hipR?: [number, number];
  knL?: number; // knee bend
  knR?: number;
  bat?: [number, number, number]; // bat rotation relative to the right hand
};

const cap = (r: number, len: number) => {
  const g = new THREE.CapsuleGeometry(r, len, 4, 10);
  g.translate(0, -len / 2 - r * 0.2, 0); // hang from the joint
  return g;
};

export class Figure {
  root = new THREE.Group();
  private hips = new THREE.Group();
  private torso = new THREE.Group();
  private head = new THREE.Group();
  private shL = new THREE.Group();
  private shR = new THREE.Group();
  private elL = new THREE.Group();
  private elR = new THREE.Group();
  private hipL = new THREE.Group();
  private hipR = new THREE.Group();
  private knL = new THREE.Group();
  private knR = new THREE.Group();
  private batG = new THREE.Group();
  constructor(kit: Kit) {
    const mat = (c: number, rough = 0.75) => new THREE.MeshStandardMaterial({ color: c, roughness: rough });
    const shirt = mat(kit.shirt);
    const trousers = mat(kit.trousers);
    const skin = mat(kit.skin, 0.6);
    const white = mat(0xf0eee8);
    const add = (parent: THREE.Object3D, geo: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) => {
      const o = new THREE.Mesh(geo, m);
      o.position.set(x, y, z);
      o.castShadow = true;
      parent.add(o);
      return o;
    };
    this.root.add(this.hips);
    this.hips.position.y = 0.93;
    // pelvis
    const pel = add(this.hips, new THREE.SphereGeometry(0.16, 12, 10), trousers, 0, 0.02, 0);
    pel.scale.set(1.12, 0.8, 0.82);
    // torso
    this.hips.add(this.torso);
    this.torso.position.y = 0.06;
    const chest = add(this.torso, new THREE.CapsuleGeometry(0.155, 0.3, 4, 12), shirt, 0, 0.3, 0);
    chest.scale.set(1.22, 1, 0.8);
    add(this.torso, new THREE.CylinderGeometry(0.05, 0.06, 0.1, 8), skin, 0, 0.6, 0);
    // head
    this.torso.add(this.head);
    this.head.position.y = 0.66;
    add(this.head, new THREE.SphereGeometry(0.105, 14, 12), skin, 0, 0.09, 0).scale.set(0.92, 1.08, 1);
    const hc = mat(kit.headColor ?? kit.shirt, 0.5);
    if (kit.head === "helmet") {
      const sh = add(this.head, new THREE.SphereGeometry(0.128, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), hc, 0, 0.1, -0.005);
      sh.scale.set(1, 1.02, 1.08);
      add(this.head, new THREE.BoxGeometry(0.2, 0.016, 0.1), hc, 0, 0.115, 0.13); // peak
      const grill = mat(0xb9bec6, 0.35);
      for (const yy of [0.03, 0.06, 0.09]) add(this.head, new THREE.BoxGeometry(0.17, 0.008, 0.008), grill, 0, yy, 0.125);
    } else if (kit.head !== "bare") {
      const sh = add(this.head, new THREE.SphereGeometry(0.112, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), hc, 0, 0.105, 0);
      sh.scale.set(1, 0.9, 1.04);
      add(this.head, new THREE.BoxGeometry(0.15, 0.012, 0.1), hc, 0, 0.11, 0.13);
    } else {
      add(this.head, new THREE.SphereGeometry(0.108, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), mat(0x17120e, 0.9), 0, 0.1, -0.008);
    }
    // arms
    for (const [sh, el, s] of [
      [this.shL, this.elL, 1],
      [this.shR, this.elR, -1],
    ] as const) {
      this.torso.add(sh);
      sh.position.set(s * 0.215, 0.5, 0);
      add(sh, cap(0.05, 0.25), shirt);
      sh.add(el);
      el.position.y = -0.29;
      add(el, cap(0.042, 0.24), skin);
      add(el, new THREE.SphereGeometry(0.05, 8, 8), kit.pads ? white : skin, 0, -0.3, 0);
    }
    // legs
    for (const [hip, kn, s] of [
      [this.hipL, this.knL, 1],
      [this.hipR, this.knR, -1],
    ] as const) {
      this.hips.add(hip);
      hip.position.set(s * 0.095, -0.02, 0);
      add(hip, cap(0.078, 0.36), trousers);
      hip.add(kn);
      kn.position.y = -0.44;
      add(kn, cap(kit.pads ? 0.085 : 0.062, 0.36), kit.pads ? white : trousers);
      if (kit.pads) add(kn, new THREE.BoxGeometry(0.15, 0.2, 0.06), white, 0, 0.02, 0.06);
      const foot = add(kn, new THREE.BoxGeometry(0.1, 0.07, 0.26), white, 0, -0.455, 0.06);
      foot.geometry.translate(0, 0, 0);
    }
    if (kit.bat) {
      this.elR.add(this.batG);
      this.batG.position.set(0, -0.31, 0);
      const wood = mat(0xd9c08c, 0.6);
      add(this.batG, new THREE.CylinderGeometry(0.017, 0.017, 0.3, 8), mat(0x1d2430, 0.8), 0, -0.1, 0);
      add(this.batG, new THREE.BoxGeometry(0.108, 0.56, 0.045), wood, 0, -0.53, 0);
    }
  }
  pose(j: J) {
    this.hips.position.y = 0.93 + (j.y ?? 0);
    this.torso.rotation.set(j.lean ?? 0, j.twist ?? 0, j.bend ?? 0);
    this.head.rotation.set(j.headX ?? 0, j.headY ?? 0, 0);
    const sh = (g: THREE.Group, a: [number, number] | undefined, s: number) => g.rotation.set(-(a?.[0] ?? 0), 0, s * (a?.[1] ?? 0.08));
    sh(this.shL, j.shL, 1);
    sh(this.shR, j.shR, -1);
    this.elL.rotation.x = -(j.elL ?? 0.15);
    this.elR.rotation.x = -(j.elR ?? 0.15);
    const hp = (g: THREE.Group, a: [number, number] | undefined, s: number) => g.rotation.set(-(a?.[0] ?? 0), 0, s * (a?.[1] ?? 0.03));
    hp(this.hipL, j.hipL, 1);
    hp(this.hipR, j.hipR, -1);
    this.knL.rotation.x = j.knL ?? 0;
    this.knR.rotation.x = j.knR ?? 0;
    if (j.bat) this.batG.rotation.set(...j.bat);
  }
  at(x: number, z: number, facing: number, y = 0) {
    this.root.position.set(x, y, z);
    this.root.rotation.y = facing;
    return this;
  }
}

// ---------- pose library (all pure functions) ----------
const TAU = Math.PI * 2;
export const P = {
  stand: (t: number, seed = 0): J => {
    const s = Math.sin(t * 1.1 + seed * 3);
    return { lean: 0.03 + s * 0.012, headY: Math.sin(t * 0.5 + seed) * 0.25, shL: [0.03 + s * 0.02, 0.1], shR: [-0.02 - s * 0.02, 0.1], elL: 0.2, elR: 0.2, hipL: [0.02, 0.06], hipR: [-0.02, 0.06] };
  },
  handsOnHips: (t: number, seed = 0): J => ({ lean: 0.02 + Math.sin(t * 1.2 + seed) * 0.01, headY: Math.sin(t * 0.6 + seed) * 0.3, shL: [-0.25, 0.55], shR: [-0.25, 0.55], elL: 1.75, elR: 1.75, hipL: [0, 0.1], hipR: [0, 0.1] }),
  armsCrossed: (t: number, seed = 0): J => ({ lean: 0.04, headY: Math.sin(t * 0.5 + seed) * 0.2, shL: [0.55, -0.25], shR: [0.55, -0.25], elL: 1.9, elR: 1.9, hipL: [0, 0.08], hipR: [0, 0.08] }),
  // locomotion: ph is the stride phase in turns
  walk: (ph: number, amp = 0.45): J => {
    const s = Math.sin(ph * TAU);
    const c = Math.cos(ph * TAU);
    return { y: -0.01 + Math.abs(c) * 0.02, lean: 0.06, twist: s * 0.08, shL: [-s * amp * 0.8, 0.08], shR: [s * amp * 0.8, 0.08], elL: 0.3 + Math.max(0, -s) * 0.3, elR: 0.3 + Math.max(0, s) * 0.3, hipL: [s * amp, 0.03], hipR: [-s * amp, 0.03], knL: Math.max(0, -c) * amp * 1.4 + 0.05, knR: Math.max(0, c) * amp * 1.4 + 0.05 };
  },
  run: (ph: number): J => {
    const s = Math.sin(ph * TAU);
    const c = Math.cos(ph * TAU);
    return { y: 0.0 + Math.abs(s) * 0.05, lean: 0.24, twist: s * 0.16, shL: [-s * 0.95, 0.12], shR: [s * 0.95, 0.12], elL: 1.4, elR: 1.4, hipL: [s * 0.95, 0.02], hipR: [-s * 0.95, 0.02], knL: 0.25 + Math.max(0, -c) * 1.5, knR: 0.25 + Math.max(0, c) * 1.5 };
  },
  // fast bowler's delivery: u 0…1 through gather → bound → release → follow-through (right-arm)
  deliver: (u: number): J => {
    const k = Math.min(1, Math.max(0, u));
    const arm = -2.6 + k * 6.6; // bowling arm goes right round
    const front = k < 0.55 ? 1.9 - k * 1.2 : 1.9 - 0.66 - (k - 0.55) * 4; // front arm reaches up, then pulls down
    return {
      y: Math.sin(Math.min(1, k * 1.8) * Math.PI) * 0.16 - (k > 0.6 ? (k - 0.6) * 0.25 : 0),
      lean: -0.2 + k * 0.95,
      twist: 0.7 - k * 1.5,
      shR: [arm, 0.12],
      elR: 0.06,
      shL: [Math.max(-0.6, front), 0.15],
      elL: 0.5,
      hipL: [0.75 - k * 0.5, 0.05],
      knL: 0.1 + Math.max(0, 0.5 - k) * 0.8,
      hipR: [-0.5 + k * 1.3, 0.05],
      knR: 0.5 + k * 0.7,
      headX: -0.1,
    };
  },
  batStance: (t: number): J => {
    const tap = Math.max(0, Math.sin(t * 5.2)) * 0.12;
    return { y: -0.09, lean: 0.52, twist: -1.1, headY: 1.05, headX: -0.35, shL: [0.75, -0.1], shR: [0.5, 0.05], elL: 0.5, elR: 0.75, hipL: [0.42, 0.14], hipR: [0.42, 0.14], knL: 0.75, knR: 0.75, bat: [0.55 - tap, 0, 0.1] };
  },
  // front-foot drive: u 0…1 (backlift → stride → swing through → hold the pose)
  drive: (u: number): J => {
    const k = Math.min(1, Math.max(0, u));
    const lift = Math.sin(Math.min(1, k / 0.35) * Math.PI * 0.5);
    const swing = Math.min(1, Math.max(0, (k - 0.35) / 0.3));
    const sw = swing * swing * (3 - 2 * swing);
    return {
      y: -0.09 - sw * 0.05,
      lean: 0.52 + sw * 0.12,
      twist: -1.1 + sw * 1.25,
      headY: 1.05 - sw * 1.0,
      headX: -0.3,
      shL: [0.75 + sw * 1.2, -0.1],
      shR: [0.5 - lift * (1 - sw) * 1.5 + sw * 1.5, 0.05 + lift * (1 - sw) * 0.5],
      elL: 0.5 - sw * 0.3,
      elR: 0.75 + lift * (1 - sw) * 0.9 - sw * 0.4,
      hipL: [0.42 + sw * 0.55, 0.14],
      knL: 0.75 + sw * 0.15,
      hipR: [0.42 - sw * 0.65, 0.14],
      knR: 0.75 - sw * 0.4,
      bat: [0.55 - lift * (1 - sw) * 2.0 + sw * 2.0, 0, 0.1],
    };
  },
  crouch: (t: number): J => ({ y: -0.5, lean: 0.75, headX: 0.25, shL: [0.35, 0.1], shR: [1.25 + Math.sin(t * 2.2) * 0.05, 0.05], elL: 0.9, elR: 0.2, hipL: [1.75, 0.18], hipR: [1.75, 0.18], knL: 2.2, knR: 2.2 }),
  tossFlick: (u: number): J => {
    const k = Math.min(1, Math.max(0, u));
    const up = Math.sin(k * Math.PI);
    return { lean: 0.02, headX: -0.25 * up, shR: [0.9 + up * 0.5, 0.1], elR: 1.2 - up * 0.9, shL: [0.0, 0.1], elL: 0.2, hipL: [0, 0.08], hipR: [0, 0.08] };
  },
  huddle: (t: number, seed = 0): J => ({ lean: 0.38, headX: 0.1 + Math.sin(t * 1.4 + seed * 2) * 0.06, headY: Math.sin(t * 0.9 + seed) * 0.2, shL: [0.5, 1.1], shR: [0.5, 1.1], elL: 0.35, elR: 0.35, hipL: [0.2, 0.14], hipR: [0.2, 0.14], knL: 0.25, knR: 0.25 }),
  point: (t: number): J => ({ lean: 0.05, twist: 0.3, headY: 0.4, shR: [1.35 + Math.sin(t * 1.5) * 0.05, 0.25], elR: 0.08, shL: [-0.1, 0.4], elL: 1.5, hipL: [0, 0.08], hipR: [0, 0.08] }),
  stretch: (t: number): J => ({ lean: 0.1, bend: Math.sin(t * 1.3) * 0.35, shL: [0, 2.6], shR: [0, 2.6], elL: 0.2, elR: 0.2, hipL: [0, 0.2], hipR: [0, 0.2] }),
  catching: (t: number): J => {
    const k = (Math.sin(t * 2.4) + 1) / 2;
    return { lean: 0.15, headX: -0.3 * k, shL: [0.9 + k * 1.2, 0.15], shR: [0.9 + k * 1.2, 0.15], elL: 0.9 - k * 0.5, elR: 0.9 - k * 0.5, hipL: [0.15, 0.12], hipR: [0.15, 0.12], knL: 0.3, knR: 0.3 };
  },
};

export const KITS = {
  home: { shirt: 0x1f4fbf, trousers: 0x183f9a, skin: 0x9a643f, head: "cap", headColor: 0x16388a } as Kit,
  away: { shirt: 0xd8a326, trousers: 0xc8921c, skin: 0xb07a50, head: "cap", headColor: 0xb8860f } as Kit,
  homeBat: { shirt: 0x1f4fbf, trousers: 0x183f9a, skin: 0x9a643f, head: "helmet", headColor: 0x16388a, pads: true, bat: true } as Kit,
  awayBat: { shirt: 0xd8a326, trousers: 0xc8921c, skin: 0xb07a50, head: "helmet", headColor: 0xb8860f, pads: true, bat: true } as Kit,
  whites: { shirt: 0xf1eee6, trousers: 0xeeeae0, skin: 0xa26b45, head: "cap", headColor: 0x1c2a52 } as Kit,
  umpire: { shirt: 0x23262b, trousers: 0x17191d, skin: 0xb88660, head: "cap", headColor: 0xf0eee8 } as Kit,
  referee: { shirt: 0x2a2f3a, trousers: 0x1c1f26, skin: 0xa87850, head: "bare" } as Kit,
};

// The cast: created once, placed and posed by the director each frame.
export class Cast {
  group = new THREE.Group();
  home: Figure[] = [];
  away: Figure[] = [];
  whites: Figure[] = [];
  homeBat = new Figure(KITS.homeBat);
  awayBat = new Figure(KITS.awayBat);
  umpire = new Figure(KITS.umpire);
  referee = new Figure(KITS.referee);
  all: Figure[] = [];
  constructor() {
    const skins = [0x9a643f, 0xb07a50, 0x7d4f31, 0xc08a60, 0x8c5a3a, 0xa87048];
    for (let i = 0; i < 9; i++) this.home.push(new Figure({ ...KITS.home, skin: skins[i % 6] }));
    for (let i = 0; i < 4; i++) this.away.push(new Figure({ ...KITS.away, skin: skins[(i + 2) % 6] }));
    for (let i = 0; i < 2; i++) this.whites.push(new Figure({ ...KITS.whites, skin: skins[(i + 1) % 6] }));
    this.all = [...this.home, ...this.away, ...this.whites, this.homeBat, this.awayBat, this.umpire, this.referee];
    for (const f of this.all) {
      f.root.visible = false;
      this.group.add(f.root);
    }
  }
  hideAll() {
    for (const f of this.all) f.root.visible = false;
  }
  show(f: Figure, x: number, z: number, facing: number, j: J, y = 0) {
    f.root.visible = true;
    f.at(x, z, facing, y).pose(j);
    return f;
  }
}
