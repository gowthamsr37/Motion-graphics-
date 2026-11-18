// The close-up world: the toss coin (struck relief generated in code) and a patch of pitch for it to land on.
// It is rendered over a defocused stadium, in "coin units" (coin radius = 1).
import * as THREE from "three";
import { LightRig } from "./env";
import { GrassPatch, Motes } from "./grass";
import { canvasTex, makeCanvas, noiseCanvas, normalFromHeight, rng } from "./util";

const FIELD = 84; // polished field
const RELIEF = 196; // raised design
const RIM = 232;

const arcText = (ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, r: number, mid: number, px: number, spacing: number, top: boolean) => {
  ctx.save();
  ctx.font = `700 ${px}px 'Barlow Condensed'`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const widths = [...text].map((ch) => ctx.measureText(ch).width + spacing);
  const total = widths.reduce((a, b) => a + b, 0);
  let a = mid - ((top ? 1 : -1) * total) / r / 2;
  [...text].forEach((ch, i) => {
    const w = widths[i];
    a += ((top ? 1 : -1) * w) / r / 2;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.rotate(a + (top ? Math.PI / 2 : -Math.PI / 2));
    ctx.fillText(ch, 0, 0);
    ctx.restore();
    a += ((top ? 1 : -1) * w) / r / 2;
  });
  ctx.restore();
};

// Grey-scale height map of one face.
const faceHeight = (side: "heads" | "tails") => {
  const S = 1024;
  const [c, ctx] = makeCanvas(S, S);
  const R = S / 2;
  const g = (v: number) => `rgb(${v},${v},${v})`;
  ctx.fillStyle = g(FIELD);
  ctx.fillRect(0, 0, S, S);
  // rim
  ctx.strokeStyle = g(RIM);
  ctx.lineWidth = R * 0.075;
  ctx.beginPath();
  ctx.arc(R, R, R * 0.955, 0, 7);
  ctx.stroke();
  // beading
  ctx.fillStyle = g(RELIEF);
  for (let i = 0; i < 84; i++) {
    const a = (i / 84) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(R + Math.cos(a) * R * 0.875, R + Math.sin(a) * R * 0.875, R * 0.014, 0, 7);
    ctx.fill();
  }
  ctx.fillStyle = g(RELIEF);
  ctx.strokeStyle = g(RELIEF);
  if (side === "heads") {
    arcText(ctx, "BEYOND THE SCOREBOARD", R, R, R * 0.7, -Math.PI / 2, R * 0.2, R * 0.022, true);
    arcText(ctx, "HEADS", R, R, R * 0.7, Math.PI / 2, R * 0.2, R * 0.05, false);
    // crossed bats
    for (const s of [-1, 1]) {
      ctx.save();
      ctx.translate(R, R * 1.02);
      ctx.rotate(s * 0.62);
      ctx.fillStyle = g(RELIEF - 34);
      ctx.beginPath();
      ctx.roundRect(-R * 0.062, -R * 0.2, R * 0.124, R * 0.6, R * 0.04); // blade
      ctx.fill();
      ctx.fillRect(-R * 0.022, -R * 0.47, R * 0.044, R * 0.28); // handle
      ctx.fillStyle = g(RELIEF - 8);
      ctx.fillRect(-R * 0.012, -R * 0.18, R * 0.024, R * 0.56); // spine
      ctx.restore();
    }
    // ball, in front
    const br = R * 0.2;
    const by = R * 0.98;
    const dome = ctx.createRadialGradient(R - br * 0.25, by - br * 0.3, br * 0.1, R, by, br);
    dome.addColorStop(0, g(250));
    dome.addColorStop(1, g(RELIEF - 6));
    ctx.fillStyle = dome;
    ctx.beginPath();
    ctx.arc(R, by, br, 0, 7);
    ctx.fill();
    ctx.strokeStyle = g(120);
    ctx.lineWidth = R * 0.012;
    for (const o of [-0.035, 0.035]) {
      ctx.beginPath();
      ctx.ellipse(R + o * R, by, br * 0.2, br * 0.98, 0.35, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    }
    ctx.fillStyle = g(120);
    for (let i = -5; i <= 5; i++) {
      const yy = by + (i / 5.6) * br;
      const xx = R + Math.cos((i / 5.6) * 1.35) * br * 0.21 + Math.sin(0.35) * (i / 5.6) * br * -0.33;
      ctx.fillRect(xx - R * 0.04, yy - R * 0.004, R * 0.08, R * 0.008);
    }
  } else {
    arcText(ctx, "THE TOSS", R, R, R * 0.7, -Math.PI / 2, R * 0.2, R * 0.06, true);
    arcText(ctx, "TAILS", R, R, R * 0.7, Math.PI / 2, R * 0.2, R * 0.05, false);
    // three stumps and two bails
    const base = R * 1.36;
    const top = R * 0.66;
    for (let i = -1; i <= 1; i++) {
      const x = R + i * R * 0.15;
      const st = ctx.createLinearGradient(x - R * 0.04, 0, x + R * 0.04, 0);
      st.addColorStop(0, g(RELIEF - 40));
      st.addColorStop(0.45, g(246));
      st.addColorStop(1, g(RELIEF - 40));
      ctx.fillStyle = st;
      ctx.beginPath();
      ctx.roundRect(x - R * 0.04, top, R * 0.08, base - top, R * 0.035);
      ctx.fill();
    }
    ctx.fillStyle = g(240);
    for (const o of [-0.075, 0.075]) {
      ctx.beginPath();
      ctx.roundRect(R + o * R - R * 0.085, top - R * 0.045, R * 0.17, R * 0.045, R * 0.02);
      ctx.fill();
    }
    ctx.fillStyle = g(RELIEF - 20);
    ctx.fillRect(R * 0.62, base, R * 0.76, R * 0.022); // ground line
    // a small star either side
    for (const s of [-1, 1]) {
      ctx.save();
      ctx.translate(R + s * R * 0.5, R * 1.02);
      ctx.beginPath();
      for (let k = 0; k < 10; k++) {
        const rr = k % 2 ? R * 0.028 : R * 0.066;
        const a = (k / 10) * Math.PI * 2 - Math.PI / 2;
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }
  // soften every edge so the relief has a bevel rather than a cliff
  const [b, bctx] = makeCanvas(S, S);
  bctx.filter = "blur(2.2px)";
  bctx.drawImage(c, 0, 0);
  return b;
};

// Mirror-polished field, frosted relief, plus hairline scratches: the "proof coin" look.
const faceMaps = (side: "heads" | "tails", seed: number) => {
  const h = faceHeight(side);
  const S = h.width;
  const hd = h.getContext("2d")!.getImageData(0, 0, S, S).data;
  const [rc, rctx] = makeCanvas(S, S);
  const [cc, cctx] = makeCanvas(S, S);
  const rimg = rctx.createImageData(S, S);
  const cimg = cctx.createImageData(S, S);
  const r = rng(seed);
  const scratch = new Float32Array(S * S);
  for (let k = 0; k < 70; k++) {
    let x = r() * S;
    let y = r() * S;
    const a = r() * Math.PI * 2;
    const len = 30 + r() * 220;
    const amt = 0.015 + r() * 0.045;
    for (let i = 0; i < len; i++) {
      x += Math.cos(a + i * 0.002);
      y += Math.sin(a + i * 0.002);
      if (x < 0 || y < 0 || x >= S || y >= S) break;
      scratch[Math.floor(y) * S + Math.floor(x)] += amt;
    }
  }
  for (let i = 0; i < S * S; i++) {
    const hv = hd[i * 4];
    const raised = Math.min(1, Math.max(0, (hv - FIELD - 12) / 70));
    const grain = (r() - 0.5) * 0.05;
    const rough = 0.13 + raised * 0.27 + grain * (0.4 + raised) + scratch[i];
    const v = Math.round(Math.min(1, Math.max(0.04, rough)) * 255);
    rimg.data[i * 4] = rimg.data[i * 4 + 1] = rimg.data[i * 4 + 2] = v;
    rimg.data[i * 4 + 3] = 255;
    // colour: recess edges slightly darker and redder (toning), high points bright
    const tone = 0.86 + raised * 0.14;
    cimg.data[i * 4] = 255 * Math.min(1, tone * 1.0);
    cimg.data[i * 4 + 1] = 255 * Math.min(1, tone * 0.985);
    cimg.data[i * 4 + 2] = 255 * Math.min(1, tone * 0.95);
    cimg.data[i * 4 + 3] = 255;
  }
  rctx.putImageData(rimg, 0, 0);
  cctx.putImageData(cimg, 0, 0);
  return { normal: canvasTex(normalFromHeight(h, 5.2), false), rough: canvasTex(rc, false), color: canvasTex(cc, true) };
};

export class Coin {
  group = new THREE.Group(); // position / spin this
  mats: THREE.MeshStandardMaterial[] = [];
  constructor() {
    const gold = new THREE.Color().setRGB(1.0, 0.72, 0.3);
    const T = 0.075; // half thickness
    for (const [side, y, seed] of [
      ["heads", T, 3],
      ["tails", -T, 9],
    ] as const) {
      const maps = faceMaps(side, seed);
      const m = new THREE.MeshStandardMaterial({ color: gold, map: maps.color, metalness: 1, roughness: 1, roughnessMap: maps.rough, normalMap: maps.normal, normalScale: new THREE.Vector2(1.0, 1.0), envMapIntensity: 1.25 });
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.986, 128), m);
      face.rotation.x = side === "heads" ? -Math.PI / 2 : Math.PI / 2;
      face.position.y = y;
      face.castShadow = true;
      this.group.add(face);
      this.mats.push(m);
    }
    // reeded edge with a small chamfer
    const [ec, ectx] = makeCanvas(256, 16);
    for (let i = 0; i < 256; i++) {
      const v = 128 + 110 * Math.sin((i / 256) * Math.PI * 2 * 4);
      ectx.fillStyle = `rgb(${v | 0},${v | 0},${v | 0})`;
      ectx.fillRect(i, 0, 1, 16);
    }
    const en = canvasTex(normalFromHeight(ec, 3.0), false, true);
    en.repeat.set(44, 1);
    const edgeMat = new THREE.MeshStandardMaterial({ color: gold, metalness: 1, roughness: 0.3, normalMap: en, envMapIntensity: 1.25 });
    const prof = [new THREE.Vector2(0.986, -T), new THREE.Vector2(1.0, -T + 0.016), new THREE.Vector2(1.0, T - 0.016), new THREE.Vector2(0.986, T)];
    const edge = new THREE.Mesh(new THREE.LatheGeometry(prof, 160), edgeMat);
    edge.castShadow = true;
    this.group.add(edge);
    this.mats.push(edgeMat);
    this.group.traverse((o) => o.layers.set(0));
  }
}

// A patch of pitch for the coin to land on: rolled clay, fine cracks, a few grass clippings.
const pitchPatch = () => {
  const S = 1024;
  const [h, hctx] = makeCanvas(S, S);
  hctx.drawImage(noiseCanvas(S, 41, 7), 0, 0);
  const r = rng(8);
  // hairline cracks
  hctx.strokeStyle = "rgba(0,0,0,0.75)";
  for (let k = 0; k < 12; k++) {
    let x = r() * S;
    let y = r() * S;
    let a = r() * Math.PI * 2;
    hctx.lineWidth = 0.5 + r() * 0.7;
    hctx.beginPath();
    hctx.moveTo(x, y);
    const n = 20 + r() * 60;
    for (let i = 0; i < n; i++) {
      a += (r() - 0.5) * 0.9;
      x += Math.cos(a) * 9;
      y += Math.sin(a) * 9;
      hctx.lineTo(x, y);
    }
    hctx.stroke();
  }
  // grit
  for (let k = 0; k < 2600; k++) {
    const v = r() < 0.5 ? 255 : 0;
    hctx.fillStyle = `rgba(${v},${v},${v},${0.12 + r() * 0.25})`;
    hctx.beginPath();
    hctx.arc(r() * S, r() * S, 0.6 + r() * 2.2, 0, 7);
    hctx.fill();
  }
  const [c, ctx] = makeCanvas(S, S);
  ctx.fillStyle = "#b99b6b";
  ctx.fillRect(0, 0, S, S);
  ctx.globalAlpha = 0.5;
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(noiseCanvas(S, 12, 6), 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 0.35;
  ctx.drawImage(h, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "soft-light";
  ctx.fillStyle = "#d8b47c";
  ctx.fillRect(0, 0, S, S);
  ctx.globalCompositeOperation = "source-over";
  // grass clippings
  for (let k = 0; k < 150; k++) {
    ctx.strokeStyle = `rgba(${70 + r() * 40},${110 + r() * 50},${50 + r() * 20},${0.5 + r() * 0.4})`;
    ctx.lineWidth = 1.2 + r();
    const x = r() * S;
    const y = r() * S;
    const a = r() * Math.PI * 2;
    const l = 5 + r() * 12;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    ctx.stroke();
  }
  return { color: canvasTex(c, true), normal: canvasTex(normalFromHeight(h, 2.4), false) };
};

export class Macro {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(30, 9 / 16, 0.05, 400);
  rig: LightRig;
  coin = new Coin();
  grass = new GrassPatch();
  motes = new Motes();
  ground: THREE.Mesh;
  groundMat: THREE.MeshStandardMaterial;
  constructor() {
    this.rig = new LightRig(this.scene, 2048, 1024);
    this.scene.add(this.coin.group, this.grass.group, this.motes.points);
    const maps = pitchPatch();
    // radial alpha so the sharp patch melts into the blurred stadium behind it
    const [a, actx] = makeCanvas(256, 256);
    const g = actx.createRadialGradient(128, 128, 30, 128, 128, 128);
    g.addColorStop(0, "#fff");
    g.addColorStop(0.72, "#fff");
    g.addColorStop(1, "#000");
    actx.fillStyle = g;
    actx.fillRect(0, 0, 256, 256);
    this.groundMat = new THREE.MeshStandardMaterial({ map: maps.color, normalMap: maps.normal, normalScale: new THREE.Vector2(0.9, 0.9), roughness: 0.92, metalness: 0, alphaMap: canvasTex(a, false), transparent: true, envMapIntensity: 0.35 });
    this.ground = new THREE.Mesh(new THREE.PlaneGeometry(64, 64), this.groundMat);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.ground.visible = false;
    this.scene.add(this.ground);
  }
}
