// Scene 2: four statistical pillars rising out of the outfield.
// Scale is honest and shared: every pillar starts at 0% on the turf and K metres of height = 1 percentage point,
// with one 50% reference plane cutting through all four. The etched ticks on each face are that same scale.
import * as THREE from "three";
import { FORMATS } from "../data";
import { canvasTex, makeCanvas } from "./util";

export const K = 0.5; // metres per percentage point
export const PILLAR_W = 3.6;
export const PILLAR_Z = 24;
export const PILLAR_X = [9.9, 3.3, -3.3, -9.9]; // left → right as the camera (looking +z) sees them
const MAX = 60; // the face texture covers 0…60%

const faceCanvas = () => {
  const H = 2048;
  const [c, ctx] = makeCanvas(256, H);
  const g = ctx.createLinearGradient(0, H, 0, 0);
  g.addColorStop(0, "#0a1322");
  g.addColorStop(1, "#16263f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, H);
  // edge light
  for (const x of [0, 248]) {
    const e = ctx.createLinearGradient(x, 0, x + 8, 0);
    e.addColorStop(x === 0 ? 0 : 1, "rgba(154,216,255,0.55)");
    e.addColorStop(x === 0 ? 1 : 0, "rgba(154,216,255,0)");
    ctx.fillStyle = e;
    ctx.fillRect(x, 0, 8, H);
  }
  // ticks: every 2% fine, every 10% bold with its value
  for (let p = 2; p < MAX; p += 2) {
    const y = H - (p / MAX) * H;
    const major = p % 10 === 0;
    ctx.fillStyle = major ? "rgba(246,242,232,0.85)" : "rgba(246,242,232,0.26)";
    ctx.fillRect(major ? 20 : 150, y - (major ? 3 : 1.5), major ? 216 : 86, major ? 6 : 3);
    if (major) {
      ctx.fillStyle = "rgba(246,242,232,0.8)";
      ctx.font = "600 44px 'Barlow Condensed'";
      ctx.textBaseline = "bottom";
      ctx.fillText(`${p}%`, 24, y - 8);
    }
  }
  return c;
};

export class Pillars {
  group = new THREE.Group();
  private bodies: THREE.Mesh[] = [];
  private caps: THREE.Mesh[] = [];
  private gaps: THREE.Mesh[] = [];
  private texs: THREE.Texture[] = [];
  private line: THREE.Mesh;
  private plane: THREE.Mesh;
  private lineMat: THREE.MeshBasicMaterial;
  private planeMat: THREE.MeshBasicMaterial;
  constructor() {
    const fc = faceCanvas();
    const box = new THREE.BoxGeometry(PILLAR_W, 1, PILLAR_W);
    box.translate(0, 0.5, 0);
    FORMATS.forEach((f, i) => {
      const t = canvasTex(fc, true);
      t.wrapT = THREE.ClampToEdgeWrapping;
      this.texs.push(t);
      const side = new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: 0xffffff, emissiveIntensity: 0.55, roughness: 0.35, metalness: 0.3 });
      const top = new THREE.MeshStandardMaterial({ color: 0x1a2a44, roughness: 0.4, metalness: 0.3, emissive: 0x16263f, emissiveIntensity: 0.6 });
      const body = new THREE.Mesh(box, [side, side, top, top, side, side]);
      body.position.set(PILLAR_X[i], 0, PILLAR_Z);
      body.castShadow = true;
      body.receiveShadow = true;
      this.bodies.push(body);
      // the part above 50%: gold
      const cap = new THREE.Mesh(box, new THREE.MeshStandardMaterial({ color: 0xf6bc45, emissive: 0xc98b1f, emissiveIntensity: 0.32, roughness: 0.32, metalness: 0.75 }));
      cap.position.set(PILLAR_X[i], 50 * K, PILLAR_Z);
      cap.scale.set(1.012, 0.001, 1.012);
      cap.castShadow = true;
      this.caps.push(cap);
      // the shortfall below 50%: a faint coral ghost
      const gap = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color: 0xff7a62, transparent: true, opacity: 0.0, depthWrite: false, toneMapped: false }));
      gap.position.set(PILLAR_X[i], f.pct * K, PILLAR_Z);
      gap.scale.set(1.0, Math.max(0.001, (50 - f.pct) * K), 1.0);
      gap.visible = f.pct < 50;
      this.gaps.push(gap);
      this.group.add(body, cap, gap);
    });
    // the 50% reference: a bright line along the front face and a faint plane through the row
    const span = Math.abs(PILLAR_X[3] - PILLAR_X[0]) + PILLAR_W + 9;
    this.lineMat = new THREE.MeshBasicMaterial({ color: 0x9ad8ff, toneMapped: false, transparent: true, opacity: 0 });
    this.line = new THREE.Mesh(new THREE.BoxGeometry(span, 0.09, 0.09), this.lineMat);
    this.line.position.set(0, 50 * K, PILLAR_Z - PILLAR_W / 2 - 0.08);
    this.planeMat = new THREE.MeshBasicMaterial({ color: 0x9ad8ff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, toneMapped: false });
    this.plane = new THREE.Mesh(new THREE.PlaneGeometry(span, PILLAR_W + 3), this.planeMat);
    this.plane.rotation.x = -Math.PI / 2;
    this.plane.position.set(0, 50 * K, PILLAR_Z);
    this.plane.renderOrder = 5;
    this.group.add(this.line, this.plane);
    this.group.visible = false;
  }
  // grow[i]: 0…1 rise of each pillar; ref: 0…1 reveal of the 50% line; day: brighten faces in sunlight
  set(grow: number[], ref: number, night: number) {
    FORMATS.forEach((f, i) => {
      const pct = f.pct * grow[i];
      const h = Math.max(0.001, Math.min(pct, 50) * K);
      this.bodies[i].scale.y = h;
      this.bodies[i].visible = grow[i] > 0.001;
      const t = this.texs[i];
      t.repeat.set(1, Math.min(pct, 50) / MAX);
      const over = Math.max(0, pct - 50);
      this.caps[i].visible = over > 0.0005;
      this.caps[i].scale.y = Math.max(0.001, over * K);
      (this.gaps[i].material as THREE.MeshBasicMaterial).opacity = f.pct < 50 ? 0.32 * ref * (grow[i] > 0.98 ? 1 : 0) : 0;
      const side = (this.bodies[i].material as THREE.MeshStandardMaterial[])[0];
      side.emissiveIntensity = 0.35 + night * 0.5;
    });
    this.lineMat.opacity = ref;
    this.lineMat.color.setRGB(0.6, 0.85, 1.0).multiplyScalar(1 + ref * 2.4);
    this.planeMat.opacity = ref * 0.1;
    this.line.scale.x = Math.max(0.001, ref);
  }
}
