// The cricket ground: sky, outfield, square, rope, LED boards, two tiers of crowd, roof, four floodlight towers,
// sightscreens, a big screen and a hint of city outside. All geometry and every texture is generated here.
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { EnvState, TOWER_ANGLES, TOWER_COLOR } from "./env";
import { canvasTex, makeCanvas, noiseCanvas, rng } from "./util";

export const GROUND = { a: 66, b: 74 }; // boundary semi-axes: square (x) and straight (z). The pitch runs along z.
export const TOWER_H = 64;

// Point on the boundary ellipse pushed outwards by d metres.
export const ell = (th: number, d: number): [number, number, number, number] => {
  const c = Math.cos(th);
  const s = Math.sin(th);
  let nx = c / GROUND.a;
  let nz = s / GROUND.b;
  const nl = Math.hypot(nx, nz);
  nx /= nl;
  nz /= nl;
  return [GROUND.a * c + nx * d, GROUND.b * s + nz * d, nx, nz];
};

// A conical band following the ellipse: from (d0, y0) to (d1, y1) in the radial section.
const band = (d0: number, y0: number, d1: number, y1: number, segs: number, uRep: number, v0 = 0, v1 = 1) => {
  const pos: number[] = [];
  const nor: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const dd = d1 - d0;
  const dy = y1 - y0;
  const L = Math.hypot(dd, dy) || 1;
  for (let i = 0; i <= segs; i++) {
    const th = (i / segs) * Math.PI * 2;
    const [x0, z0, nx, nz] = ell(th, d0);
    const [x1, z1] = ell(th, d1);
    pos.push(x0, y0, z0, x1, y1, z1);
    const N = [(-dy / L) * nx, dd / L, (-dy / L) * nz];
    nor.push(...N, ...N);
    const u = (i / segs) * uRep;
    uv.push(u, v0, u, v1);
  }
  for (let i = 0; i < segs; i++) {
    const k = i * 2;
    idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
};

// ---------- textures ----------
const GRASS_A = [41, 99, 44];
const GRASS_B = [50, 112, 49];
const rgb = (c: number[], k = 1) => `rgb(${Math.round(c[0] * k)},${Math.round(c[1] * k)},${Math.round(c[2] * k)})`;

// Paint the outfield (mowing pattern, square, 30-yard circle) for a square of `size` metres centred on the pitch.
const paintField = (px: number, size: number) => {
  const [c, ctx] = makeCanvas(px, px);
  const s = px / size; // px per metre
  const X = (m: number) => (m + size / 2) * s;
  ctx.fillStyle = rgb(GRASS_A);
  ctx.fillRect(0, 0, px, px);
  // mowing: 5 m bands across, each cut the other way, then a second pass at right angles (the chequerboard you see from the stands)
  const bandM = 5;
  for (let m = -size / 2 - bandM; m < size / 2 + bandM; m += bandM) {
    const i = Math.round(m / bandM);
    if (i % 2 === 0) {
      ctx.fillStyle = rgb(GRASS_B);
      ctx.fillRect(X(m), 0, bandM * s, px);
    }
  }
  ctx.globalCompositeOperation = "soft-light";
  for (let m = -size / 2 - bandM; m < size / 2 + bandM; m += bandM) {
    const i = Math.round(m / bandM);
    ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.1)";
    ctx.fillRect(0, X(m), px, bandM * s);
  }
  ctx.globalCompositeOperation = "source-over";
  // the square: a paler, closer-mown block with several strips
  const sqW = 24;
  const sqL = 27;
  ctx.fillStyle = "rgb(74,128,58)";
  ctx.fillRect(X(-sqW / 2), X(-sqL / 2), sqW * s, sqL * s);
  const strips = 7;
  for (let i = 0; i < strips; i++) {
    const x = -sqW / 2 + 1.3 + i * 3.05;
    const tone = [
      [96, 136, 70],
      [118, 142, 80],
      [90, 132, 66],
      [150, 150, 96],
      [98, 136, 70],
      [124, 144, 84],
      [94, 134, 68],
    ][i];
    ctx.fillStyle = rgb(tone);
    ctx.fillRect(X(x), X(-11.3), 3.05 * s, 22.6 * s);
  }
  // 30-yard circle: two semicircles of radius 27.43 m centred on each middle stump, joined by straight lines
  ctx.fillStyle = "rgba(245,245,235,0.9)";
  const dot = (mx: number, mz: number) => {
    ctx.beginPath();
    ctx.arc(X(mx), X(mz), Math.max(1.2, 0.16 * s), 0, 7);
    ctx.fill();
  };
  const R = 27.43;
  for (let a = 0; a <= 180; a += 4.5) {
    const r = (a * Math.PI) / 180;
    dot(Math.cos(r) * R, 10.06 + Math.sin(r) * R);
    dot(Math.cos(r) * R, -10.06 - Math.sin(r) * R);
  }
  for (let z = -10.06; z <= 10.06; z += 2.2) {
    dot(R, z);
    dot(-R, z);
  }
  return c;
};

const crowdCanvas = (seed: number) => {
  const W = 2048;
  const H = 512;
  const [c, ctx] = makeCanvas(W, H);
  const r = rng(seed);
  ctx.fillStyle = "#16233d";
  ctx.fillRect(0, 0, W, H);
  const rows = 24;
  const rh = H / rows;
  const sw = 16;
  const shirts = ["#2a5bd0", "#1c3f9e", "#f0c02e", "#ece8de", "#c93a2f", "#e87a2c", "#5aa7e6", "#23262e", "#2f8f4e", "#d76b9a", "#f2f2f2", "#7b4fd0", "#e8d7a8"];
  const skins = ["#c68e62", "#a56b43", "#8a5a3a", "#dba77a", "#74492e"];
  for (let row = 0; row < rows; row++) {
    const y = H - (row + 1) * rh; // row 0 at the bottom of the texture = front of the stand
    ctx.fillStyle = row % 2 ? "#1a2a48" : "#152340";
    ctx.fillRect(0, y, W, rh);
    for (let i = 0; i < W / sw; i++) {
      const x = i * sw;
      if (i % 18 === 0) {
        ctx.fillStyle = "#9097a3";
        ctx.fillRect(x, y, sw, rh); // stairs
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(x, y + rh * 0.55, sw, rh * 0.45);
        continue;
      }
      ctx.fillStyle = "#22355c";
      ctx.fillRect(x + 2, y + rh * 0.42, sw - 4, rh * 0.5); // seat back
      if (r() < 0.9) {
        const sh = shirts[Math.floor(r() * r() * shirts.length * 1.0)] ?? shirts[0];
        ctx.fillStyle = sh;
        const bw = sw - 4 - Math.floor(r() * 2);
        ctx.beginPath();
        ctx.roundRect(x + (sw - bw) / 2, y + rh * 0.42, bw, rh * 0.56, 3);
        ctx.fill();
        ctx.fillStyle = skins[Math.floor(r() * skins.length)];
        ctx.beginPath();
        ctx.arc(x + sw / 2 + (r() - 0.5) * 2, y + rh * 0.28, 3.3, 0, 7);
        ctx.fill();
        ctx.fillStyle = "rgba(20,14,10,0.85)";
        ctx.beginPath();
        ctx.arc(x + sw / 2, y + rh * 0.2, 3.1, Math.PI, 0);
        ctx.fill(); // hair / cap
        if (r() < 0.08) {
          ctx.fillStyle = sh;
          ctx.fillRect(x + 1, y + rh * 0.05, 3, rh * 0.4); // an arm in the air
        }
      }
    }
    const g = ctx.createLinearGradient(0, y, 0, y + rh);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.28)");
    ctx.fillStyle = g;
    ctx.fillRect(0, y, W, rh);
  }
  return c;
};

const ledCanvas = () => {
  const [c, ctx] = makeCanvas(2048, 64);
  const cols = ["#0e2a66", "#f6bc45", "#0b3d2e", "#7a1630"];
  const w = 2048 / 4;
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = cols[i];
    ctx.fillRect(i * w, 0, w, 64);
    ctx.fillStyle = i === 1 ? "#0a1220" : "#f6f2e8";
    ctx.font = "700 44px 'Barlow Condensed'";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    const txt = ["BEYOND THE SCOREBOARD", "THE TOSS", "BEYOND THE SCOREBOARD", "DOES IT MATTER?"][i];
    ctx.fillText(txt, i * w + w / 2, 34);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillRect(i * w, 0, 4, 64);
  }
  return c;
};

const screenCanvas = () => {
  const [c, ctx] = makeCanvas(1024, 512);
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#0b1b3a");
  g.addColorStop(1, "#050b18");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 512);
  ctx.strokeStyle = "#f6bc45";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(512, 190, 92, 0, 7);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(512, 190, 70, 0, 7);
  ctx.stroke();
  ctx.fillStyle = "#f6bc45";
  ctx.font = "800 96px 'Barlow Condensed'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("?", 512, 196);
  ctx.fillStyle = "#f6f2e8";
  ctx.font = "700 76px 'Barlow Condensed'";
  ctx.fillText("BEYOND THE SCOREBOARD", 512, 360);
  ctx.fillStyle = "rgba(246,242,232,0.7)";
  ctx.font = "600 40px 'Barlow Condensed'";
  ctx.fillText("THE  TOSS  ·  TESTS  ·  ODIs  ·  T20Is  ·  IPL", 512, 440);
  return c;
};

const radialCanvas = (inner: string, outer: string, streak = false) => {
  const [c, ctx] = makeCanvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(0.18, "rgba(255,255,255,0.55)");
  g.addColorStop(0.45, "rgba(200,225,255,0.14)");
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  if (streak) {
    const s = ctx.createLinearGradient(0, 0, 256, 0);
    s.addColorStop(0, "rgba(180,210,255,0)");
    s.addColorStop(0.5, "rgba(210,230,255,0.75)");
    s.addColorStop(1, "rgba(180,210,255,0)");
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = s;
    ctx.fillRect(0, 124, 256, 8);
    ctx.fillRect(0, 126.5, 256, 3);
  }
  return c;
};

// ---------- sky ----------
const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 p = projectionMatrix * mat4(mat3(modelViewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}`;
const SKY_FRAG = /* glsl */ `
precision highp float;
varying vec3 vDir;
uniform vec3 uSunDir, uZenith, uHorizon, uGlow, uSunCol, uCloudLight, uCloudDark;
uniform float uStars, uCloudAmt, uCloudTime, uSunDisc, uTime;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(17.0, 5.0); a *= 0.5; }
  return v;
}
void main() {
  vec3 d = normalize(vDir);
  float h = max(d.y, 0.0);
  vec3 col = mix(uHorizon, uZenith, pow(h, 0.42));
  col = mix(col, uHorizon * 0.55, smoothstep(0.0, -0.25, d.y));
  float sd = max(dot(d, uSunDir), 0.0);
  float low = 1.0 - smoothstep(0.0, 0.5, d.y);
  col += uGlow * (pow(sd, 6.0) * 0.22 * (0.4 + low) + pow(sd, 48.0) * 0.7);
  col += uSunCol * smoothstep(0.99935, 0.99975, sd) * uSunDisc;
  if (d.y > 0.01) {
    vec2 p = d.xz / (d.y + 0.11) * 0.9 + vec2(uCloudTime * 0.06, uCloudTime * 0.022);
    float c = fbm(p * 1.25);
    float cov = smoothstep(1.0 - uCloudAmt, 1.0 - uCloudAmt + 0.3, c);
    float shade = fbm(p * 1.25 + uSunDir.xz * 0.22);
    vec3 cc = mix(uCloudDark, uCloudLight, clamp(0.55 + (c - shade) * 2.2, 0.0, 1.0));
    cc += uGlow * pow(sd, 3.0) * 0.5;
    col = mix(col, cc, cov * smoothstep(0.01, 0.2, d.y) * 0.92);
    // stars
    vec2 uv = vec2(atan(d.z, d.x), asin(clamp(d.y, -1.0, 1.0))) * 120.0;
    vec2 id = floor(uv);
    vec2 f = fract(uv) - 0.5;
    float r = hash(id);
    vec2 o = (vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5) * 0.7;
    float tw = 0.7 + 0.3 * sin(uTime * 2.3 + r * 60.0);
    float st = smoothstep(0.07, 0.0, length(f - o)) * step(0.93, r) * tw * (0.25 + 0.75 * hash(id + 1.7));
    col += vec3(0.85, 0.92, 1.0) * st * uStars * (1.0 - cov) * smoothstep(0.04, 0.35, d.y) * 0.5;
  }
  gl_FragColor = vec4(col, 1.0);
}`;

const BEAM_VERT = /* glsl */ `
varying vec3 vN; varying vec3 vV; varying float vAlong;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vN = normalize(mat3(modelMatrix) * normal);
  vV = normalize(cameraPosition - wp.xyz);
  vAlong = uv.y;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;
const BEAM_FRAG = /* glsl */ `
precision highp float;
varying vec3 vN; varying vec3 vV; varying float vAlong;
uniform float uPower; uniform vec3 uColor;
void main() {
  float edge = pow(abs(dot(normalize(vN), normalize(vV))), 2.2);
  float a = edge * smoothstep(0.0, 0.25, vAlong) * pow(vAlong, 0.6) * smoothstep(0.0, 0.03, 1.0 - vAlong);
  gl_FragColor = vec4(uColor * a * uPower, 1.0);
}`;

export class Stadium {
  group = new THREE.Group();
  sky: THREE.Mesh;
  skyMat: THREE.ShaderMaterial;
  fieldMat: THREE.MeshStandardMaterial;
  squareMat: THREE.MeshStandardMaterial;
  crowdMats: THREE.MeshStandardMaterial[] = [];
  ledMat: THREE.MeshBasicMaterial;
  screenMat: THREE.MeshBasicMaterial;
  roofLightMat: THREE.MeshBasicMaterial;
  roofMat!: THREE.MeshStandardMaterial;
  lamps: THREE.InstancedMesh;
  lampTower: number[] = [];
  glows: THREE.Sprite[] = [];
  beams: THREE.Mesh[] = [];
  towerHeads: THREE.Vector3[] = [];
  twinkle: THREE.Points;
  twinkleMat: THREE.ShaderMaterial;
  city: THREE.Points;
  cityMat: THREE.PointsMaterial;
  sightMat: THREE.MeshStandardMaterial;
  rope: THREE.Mesh;
  stumps = new THREE.Group();
  structure: THREE.Object3D[] = [];

  constructor() {
    const G = this.group;
    // --- sky
    this.skyMat = new THREE.ShaderMaterial({
      vertexShader: SKY_VERT,
      fragmentShader: SKY_FRAG,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: true,
      fog: false,
      uniforms: {
        uSunDir: { value: new THREE.Vector3(0, 1, 0) },
        uZenith: { value: new THREE.Color() },
        uHorizon: { value: new THREE.Color() },
        uGlow: { value: new THREE.Color() },
        uSunCol: { value: new THREE.Color() },
        uCloudLight: { value: new THREE.Color() },
        uCloudDark: { value: new THREE.Color() },
        uStars: { value: 0 },
        uCloudAmt: { value: 0.5 },
        uCloudTime: { value: 0 },
        uSunDisc: { value: 1 },
        uTime: { value: 0 },
      },
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(10, 48, 24), this.skyMat);
    this.sky.frustumCulled = false;
    this.sky.renderOrder = -10;
    G.add(this.sky);

    // --- outside world
    const outer = new THREE.Mesh(new THREE.CircleGeometry(3200, 64), new THREE.MeshStandardMaterial({ color: 0x20262a, roughness: 1 }));
    outer.rotation.x = -Math.PI / 2;
    outer.position.y = -0.4;
    G.add(outer);
    {
      const r = rng(77);
      const pos: number[] = [];
      const col: number[] = [];
      for (let i = 0; i < 1400; i++) {
        const a = r() * Math.PI * 2;
        const d = 260 + Math.pow(r(), 1.6) * 2200;
        pos.push(Math.cos(a) * d, 2 + r() * r() * 70, Math.sin(a) * d);
        const warm = r();
        col.push(1, 0.72 + warm * 0.25, 0.4 + warm * 0.5);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
      this.cityMat = new THREE.PointsMaterial({ size: 2.2, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0, fog: false, toneMapped: false, depthWrite: false });
      this.city = new THREE.Points(g, this.cityMat);
      G.add(this.city);
    }

    // --- outfield
    const detail = canvasTex(noiseCanvas(512, 5, 6), false, true);
    const addDetail = (m: THREE.MeshStandardMaterial, scale: number) => {
      m.onBeforeCompile = (sh) => {
        sh.uniforms.uDetail = { value: detail };
        sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vWPos;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;");
        sh.fragmentShader = sh.fragmentShader
          .replace("#include <common>", "#include <common>\nvarying vec3 vWPos;\nuniform sampler2D uDetail;")
          .replace(
            "#include <map_fragment>",
            `#include <map_fragment>
             float dn = texture2D(uDetail, vWPos.xz * ${scale.toFixed(3)}).r;
             float dn2 = texture2D(uDetail, vWPos.xz * 0.021 + 0.37).r;
             float dn3 = texture2D(uDetail, vWPos.xz * 4.7 + 0.11).r;
             diffuseColor.rgb *= (0.74 + dn * 0.52) * (0.86 + dn2 * 0.3) * (0.8 + dn3 * 0.42);`,
          );
      };
    };
    const SIZE = 190;
    this.fieldMat = new THREE.MeshStandardMaterial({ map: canvasTex(paintField(2048, SIZE)), roughness: 0.9, metalness: 0 });
    addDetail(this.fieldMat, 0.9);
    const field = new THREE.Mesh(new THREE.PlaneGeometry(SIZE, SIZE), this.fieldMat);
    field.rotation.x = -Math.PI / 2;
    field.receiveShadow = true;
    G.add(field);
    // a sharper inset for the middle, where the camera gets close
    const INSET = 60;
    this.squareMat = new THREE.MeshStandardMaterial({ map: canvasTex(paintField(2048, INSET)), roughness: 0.9, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    addDetail(this.squareMat, 0.9);
    const sq = new THREE.Mesh(new THREE.PlaneGeometry(INSET, INSET), this.squareMat);
    sq.rotation.x = -Math.PI / 2;
    sq.position.y = 0.004;
    sq.receiveShadow = true;
    G.add(sq);

    // --- boundary rope
    {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < 160; i++) {
        const [x, z] = ell((i / 160) * Math.PI * 2, 0);
        pts.push(new THREE.Vector3(x, 0.12, z));
      }
      this.rope = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 320, 0.13, 6, true), new THREE.MeshStandardMaterial({ color: 0xf2f0e8, roughness: 0.7 }));
      G.add(this.rope);
    }

    // --- perimeter: apron, LED boards, front wall
    const concrete = new THREE.MeshStandardMaterial({ color: 0x565d66, roughness: 0.95, side: THREE.DoubleSide });
    const dark = new THREE.MeshStandardMaterial({ color: 0x141a24, roughness: 0.9, side: THREE.DoubleSide });
    const SEG = 180;
    const apron = new THREE.Mesh(band(4.2, 0.02, 9.2, 0.02, SEG, 1), new THREE.MeshStandardMaterial({ color: 0x3d5a45, roughness: 1, side: THREE.DoubleSide }));
    apron.receiveShadow = true;
    G.add(apron);
    this.ledMat = new THREE.MeshBasicMaterial({ map: canvasTex(ledCanvas(), true, true), side: THREE.DoubleSide, toneMapped: false });
    const led = new THREE.Mesh(band(5.2, 0.05, 5.2, 1.05, SEG, 10), this.ledMat);
    G.add(led);

    // --- stands
    const lowerTex = canvasTex(crowdCanvas(11), true, true);
    const upperTex = canvasTex(crowdCanvas(29), true, true);
    const crowd = (tex: THREE.Texture) => {
      const m = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.02, roughness: 0.95, side: THREE.DoubleSide });
      this.crowdMats.push(m);
      return m;
    };
    const lower = new THREE.Mesh(band(9.6, 2.6, 31, 14.5, SEG, 14), crowd(lowerTex));
    const upper = new THREE.Mesh(band(28.5, 18.2, 52, 37.5, SEG, 16), crowd(upperTex));
    lower.castShadow = upper.castShadow = true;
    lower.receiveShadow = upper.receiveShadow = true;
    G.add(lower, upper);
    const walls = new THREE.Mesh(
      mergeGeometries([
        band(9.2, 0, 9.2, 2.6, SEG, 1), // front wall
        band(9.2, 2.6, 9.6, 2.6, SEG, 1),
        band(31, 14.5, 31, 16.2, SEG, 1), // concourse back
        band(28.5, 16.2, 28.5, 18.2, SEG, 1), // upper parapet
        band(28.5, 16.2, 31, 16.2, SEG, 1),
        band(52, 37.5, 54, 37.5, SEG, 1),
        band(54, 0, 54, 44, SEG, 1), // outer wall
      ])!,
      dark,
    );
    walls.castShadow = true;
    G.add(walls);
    const fascia = new THREE.Mesh(band(28.4, 16.3, 28.4, 18.1, SEG, 14), this.ledMat);
    G.add(fascia);
    // roof: a pale cantilever, with a ring of lights under its leading edge
    // underside: pale panels between radial trusses, washed by the ring of lights at its lip
    const [rc, rctx] = makeCanvas(1024, 256);
    rctx.fillStyle = "#c9ced6";
    rctx.fillRect(0, 0, 1024, 256);
    for (let i = 0; i < 16; i++) {
      rctx.fillStyle = "#59616d";
      rctx.fillRect(i * 64, 0, 7, 256);
      rctx.fillStyle = "rgba(0,0,0,0.10)";
      rctx.fillRect(i * 64 + 7, 0, 10, 256);
    }
    for (const y of [40, 120, 200]) {
      rctx.fillStyle = "#6c7480";
      rctx.fillRect(0, y, 1024, 5);
    }
    const lipGlow = rctx.createLinearGradient(0, 0, 0, 256);
    lipGlow.addColorStop(0, "rgba(0,0,0,0.45)");
    lipGlow.addColorStop(1, "rgba(0,0,0,0)");
    rctx.fillStyle = lipGlow;
    rctx.fillRect(0, 0, 1024, 256);
    const roofTex = canvasTex(rc, true, true);
    const roofMat = new THREE.MeshStandardMaterial({ map: roofTex, emissiveMap: roofTex, emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.85, side: THREE.DoubleSide });
    this.roofMat = roofMat;
    const roof = new THREE.Mesh(mergeGeometries([band(22, 45.5, 55.5, 41, SEG, 9), band(22, 45.5, 22, 44.3, SEG, 9), band(22, 44.3, 55.5, 40.2, SEG, 9)])!, roofMat);
    roof.castShadow = true;
    G.add(roof);
    this.roofLightMat = new THREE.MeshBasicMaterial({ color: 0x000000, toneMapped: false, side: THREE.DoubleSide });
    G.add(new THREE.Mesh(band(22.02, 44.25, 23.1, 44.12, SEG, 1), this.roofLightMat));
    this.structure.push(lower, upper, walls, roof, fascia, led);
    // roof columns
    {
      const col = new THREE.CylinderGeometry(0.45, 0.45, 44, 6);
      const im = new THREE.InstancedMesh(col, concrete, 60);
      const m = new THREE.Matrix4();
      for (let i = 0; i < 60; i++) {
        const [x, z] = ell((i / 60) * Math.PI * 2, 54.6);
        m.setPosition(x, 22, z);
        im.setMatrixAt(i, m);
      }
      G.add(im);
    }

    // --- sightscreens at both ends, big screen on the square boundary
    this.sightMat = new THREE.MeshStandardMaterial({ color: 0x0c0f14, roughness: 0.6 });
    for (const s of [1, -1]) {
      const sc = new THREE.Mesh(new THREE.BoxGeometry(12.5, 6, 0.5), this.sightMat);
      sc.position.set(0, 5.8, s * (GROUND.b + 9.4));
      G.add(sc);
    }
    this.screenMat = new THREE.MeshBasicMaterial({ map: canvasTex(screenCanvas()), toneMapped: false });
    for (const s of [1, -1]) {
      const [x, z] = ell(s > 0 ? 0 : Math.PI, 53);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 15, 30), dark);
      frame.position.set(x, 49, z);
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(28.5, 13.8), this.screenMat);
      scr.position.set(x - s * 0.65, 49, z);
      scr.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2;
      G.add(frame, scr);
    }

    // --- floodlight towers
    const lampGeo = new THREE.CircleGeometry(0.62, 14);
    const COLS = 9;
    const ROWS = 6;
    this.lamps = new THREE.InstancedMesh(lampGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, side: THREE.DoubleSide, fog: false }), 4 * COLS * ROWS);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x8a9099, roughness: 0.6, metalness: 0.4 });
    const glowTex = canvasTex(radialCanvas("rgba(255,255,255,1)", "rgba(160,200,255,0)", true));
    let li = 0;
    TOWER_ANGLES.forEach((a, ti) => {
      const [x, z] = ell(a, 60);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.5, TOWER_H, 10), mastMat);
      mast.position.set(x, TOWER_H / 2, z);
      mast.castShadow = true;
      G.add(mast);
      const head = new THREE.Group();
      head.position.set(x, TOWER_H + 3, z);
      head.lookAt(0, -34, 0); // tilt the panel down at the middle
      const panel = new THREE.Mesh(new THREE.BoxGeometry(17.5, 11.5, 0.9), new THREE.MeshStandardMaterial({ color: 0x1a1f27, roughness: 0.7 }));
      panel.position.z = -0.5;
      head.add(panel);
      G.add(head);
      head.updateMatrixWorld(true);
      const m = new THREE.Matrix4();
      for (let cx = 0; cx < COLS; cx++) {
        for (let ry = 0; ry < ROWS; ry++) {
          m.makeTranslation((cx - (COLS - 1) / 2) * 1.85, (ry - (ROWS - 1) / 2) * 1.75, 0.02);
          m.premultiply(head.matrixWorld);
          this.lamps.setMatrixAt(li, m);
          this.lampTower[li] = ti;
          li++;
        }
      }
      const hp = new THREE.Vector3(0, 0, 1.5).applyMatrix4(head.matrixWorld);
      this.towerHeads.push(hp);
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false, toneMapped: false, opacity: 0 }));
      glow.position.copy(hp);
      G.add(glow);
      this.glows.push(glow);
      // haze beam: an open cone from the head down to the outfield
      const L = hp.length() * 0.92;
      const cone = new THREE.ConeGeometry(34, L, 40, 1, true);
      cone.translate(0, -L / 2, 0);
      const beam = new THREE.Mesh(
        cone,
        new THREE.ShaderMaterial({ vertexShader: BEAM_VERT, fragmentShader: BEAM_FRAG, uniforms: { uPower: { value: 0 }, uColor: { value: new THREE.Color(0.6, 0.72, 1.0) } }, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }),
      );
      beam.position.copy(hp);
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), hp.clone().multiplyScalar(-1).setY(-hp.y).normalize());
      beam.renderOrder = 20;
      G.add(beam);
      this.beams.push(beam);
    });
    this.lamps.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(this.lamps.count * 3), 3);
    this.lamps.frustumCulled = false;
    G.add(this.lamps);

    // --- phone lights in the crowd
    {
      const r = rng(303);
      const pos: number[] = [];
      const ph: number[] = [];
      for (let i = 0; i < 2600; i++) {
        const th = r() * Math.PI * 2;
        const up = r() < 0.5;
        const f = r();
        const d = up ? 28.8 + f * 23 : 9.9 + f * 21;
        const y = up ? 18.4 + f * 19 : 2.8 + f * 11.8;
        const [x, z] = ell(th, d);
        pos.push(x, y + 0.7, z);
        ph.push(r() * 100);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute("phase", new THREE.Float32BufferAttribute(ph, 1));
      this.twinkleMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uAmt: { value: 0 }, uSize: { value: 3.2 } },
        vertexShader: `attribute float phase; uniform float uTime, uAmt, uSize; varying float vA;
          void main(){ float s = sin(uTime * (1.3 + fract(phase) * 2.2) + phase * 7.0); vA = pow(max(s, 0.0), 10.0) * uAmt;
            vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = uSize * (0.6 + vA); }`,
        fragmentShader: `precision highp float; varying float vA; void main(){ vec2 p = gl_PointCoord - 0.5; float d = smoothstep(0.5, 0.0, length(p)); gl_FragColor = vec4(vec3(1.0, 0.97, 0.9) * d * vA * 5.0, 1.0); }`,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      });
      this.twinkle = new THREE.Points(g, this.twinkleMat);
      G.add(this.twinkle);
    }

    // --- stumps at both ends
    {
      const wood = new THREE.MeshStandardMaterial({ color: 0xe9d9a8, roughness: 0.55 });
      const sg = new THREE.CylinderGeometry(0.019, 0.019, 0.71, 10);
      for (const s of [1, -1]) {
        for (let i = -1; i <= 1; i++) {
          const st = new THREE.Mesh(sg, wood);
          st.position.set(i * 0.114, 0.355, s * 10.06);
          st.castShadow = true;
          this.stumps.add(st);
        }
        for (const o of [-0.057, 0.057]) {
          const bail = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.11, 8), wood);
          bail.rotation.z = Math.PI / 2;
          bail.position.set(o, 0.72, s * 10.06);
          this.stumps.add(bail);
        }
      }
      G.add(this.stumps);
    }
  }

  // Apply a moment of the day, the floodlight powers (0…1 per tower) and a few art-direction knobs.
  update(env: EnvState, lamps: number[], o: { time: number; cloudTime: number; cloudAmt?: number; dew?: number; dry?: number; beams?: number; camera?: THREE.Camera }) {
    const u = this.skyMat.uniforms;
    u.uSunDir.value.copy(env.sunDir);
    u.uZenith.value.copy(env.zenith);
    u.uHorizon.value.copy(env.horizon);
    u.uGlow.value.copy(env.glow);
    u.uSunCol.value.copy(env.sunColor).multiplyScalar(env.sunI > 0.02 ? 60 : 0);
    u.uCloudLight.value.copy(env.cloudLight);
    u.uCloudDark.value.copy(env.cloudDark);
    u.uStars.value = env.stars;
    u.uCloudAmt.value = o.cloudAmt ?? 0.4;
    u.uCloudTime.value = o.cloudTime;
    u.uTime.value = o.time;
    const avg = (lamps[0] + lamps[1] + lamps[2] + lamps[3]) / 4;
    const dew = o.dew ?? 0;
    const dry = o.dry ?? 0;
    for (const m of [this.fieldMat, this.squareMat]) {
      m.roughness = 0.9 - dew * 0.32;
      m.color.setRGB(1 + dry * 0.32, 1 - dry * 0.02, 1 - dry * 0.42);
    }
    const spill = 0.012 + env.night * 0.05 + avg * 0.1;
    for (const m of this.crowdMats) m.emissiveIntensity = spill;
    const ledK = 0.55 + env.night * 1.5;
    this.ledMat.color.setScalar(ledK);
    this.screenMat.color.setScalar(0.6 + env.night * 1.6);
    this.roofLightMat.color.setRGB(1, 0.96, 0.9).multiplyScalar(avg * 9);
    this.roofMat.emissiveIntensity = avg * 0.16 + env.night * 0.012;
    this.twinkleMat.uniforms.uTime.value = o.time;
    this.twinkleMat.uniforms.uAmt.value = env.night;
    this.cityMat.opacity = env.night * 0.9;
    this.city.visible = env.night > 0.02;
    this.sightMat.color.set(env.night > 0.5 ? 0x0c0f14 : 0xe9e7df);
    const c = new THREE.Color();
    for (let i = 0; i < this.lamps.count; i++) {
      const p = lamps[this.lampTower[i]];
      // a cold lamp is dark glass; a hot one is far brighter than white
      c.copy(TOWER_COLOR).multiplyScalar(0.035 + Math.pow(p, 1.5) * 26);
      this.lamps.setColorAt(i, c);
    }
    this.lamps.instanceColor!.needsUpdate = true;
    this.glows.forEach((g, i) => {
      const p = lamps[i];
      g.visible = p > 0.01;
      g.scale.setScalar(46 + p * 44);
      (g.material as THREE.SpriteMaterial).opacity = Math.pow(p, 1.3) * 0.75;
    });
    this.beams.forEach((b, i) => {
      const p = lamps[i] * (o.beams ?? 1) * env.night;
      b.visible = p > 0.01;
      (b.material as THREE.ShaderMaterial).uniforms.uPower.value = p * 0.05;
    });
    if (o.camera) this.sky.position.copy(o.camera.position);
  }
}
