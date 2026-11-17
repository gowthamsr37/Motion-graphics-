// The match pitch: 22 yards of rolled clay whose surface is computed in the shader, so one number
// (wear: 0 = day-one fresh … 1 = day-five) drives colour, footmarks, dust and the crack network.
// Also the ball. A representative illustration of how a Test pitch ages, not a model of any venue.
import * as THREE from "three";
import { canvasTex, makeCanvas, noiseCanvas } from "./util";

export const PITCH_W = 3.05;
export const PITCH_L = 22.56;

const PRELUDE = /* glsl */ `
varying vec3 vWPos;
uniform sampler2D uNoise;
uniform float uWear, uPaint;
vec2 h2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
float vorEdge(vec2 x){
  vec2 n = floor(x), f = fract(x), mg, mr; float md = 8.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)); vec2 o = h2(n + g); vec2 r = g + o - f; float d = dot(r, r);
    if (d < md) { md = d; mr = r; mg = g; }
  }
  md = 8.0;
  for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) {
    vec2 g = mg + vec2(float(i), float(j)); vec2 o = h2(n + g); vec2 r = g + o - f;
    if (dot(mr - r, mr - r) > 0.00001) md = min(md, dot(0.5 * (mr + r), normalize(r - mr)));
  }
  return md;
}
float blob(vec2 p, vec2 c, vec2 s){ vec2 d = (p - c) / s; return exp(-dot(d, d) * 1.6); }
vec3 perturbN(vec3 pos, vec3 nrm, vec2 dH){
  vec3 sx = normalize(dFdx(pos)); vec3 sy = normalize(dFdy(pos));
  vec3 r1 = cross(sy, nrm); vec3 r2 = cross(nrm, sx);
  float det = dot(sx, r1);
  vec3 grad = sign(det) * (dH.x * r1 + dH.y * r2);
  return normalize(abs(det) * nrm - grad);
}`;

const SURFACE = /* glsl */ `
vec2 pp = vWPos.xz;
float n1 = texture2D(uNoise, pp * 0.9).r;
float n2 = texture2D(uNoise, pp * 0.14 + 0.3).r;
float n3 = texture2D(uNoise, pp * 5.5).r;
float n4 = texture2D(uNoise, pp * 19.0).r;
vec3 pcol = mix(vec3(0.50, 0.47, 0.28), vec3(0.64, 0.55, 0.38), smoothstep(0.0, 1.0, uWear));
// live grass still in the surface on day one
pcol = mix(pcol, vec3(0.30, 0.40, 0.18), (1.0 - uWear) * smoothstep(0.42, 0.72, n2) * 0.5);
pcol *= (0.80 + n1 * 0.28) * (0.9 + n3 * 0.2) * (0.92 + n4 * 0.16);
pcol *= 1.0 + 0.035 * sin(pp.x * 21.0); // roller lines
// footmarks: the bowlers' landing areas and the batters' guard, at both ends
float fm = 0.0;
for (int e = 0; e < 2; e++) {
  float sg = e == 0 ? 1.0 : -1.0;
  fm += blob(pp, vec2(0.62, sg * 7.7), vec2(0.34, 1.0)) + blob(pp, vec2(-0.62, sg * 7.7), vec2(0.34, 1.0));
  fm += 0.75 * blob(pp, vec2(0.0, sg * 8.75), vec2(0.5, 0.3));
  fm += 0.5 * blob(pp, vec2(0.45, sg * 5.2), vec2(0.5, 1.5)) + 0.5 * blob(pp, vec2(-0.5, sg * 4.6), vec2(0.45, 1.4)); // the rough outside off stump
}
fm *= smoothstep(0.12, 0.6, uWear) * (0.45 + 1.1 * n1);
float foot = clamp(fm, 0.0, 0.9);
pcol = mix(pcol, vec3(0.30, 0.22, 0.14) * (0.7 + n3 * 0.6), foot);
// dusting of the whole surface late in the match
pcol = mix(pcol, vec3(0.74, 0.66, 0.50), smoothstep(0.55, 1.0, uWear) * smoothstep(0.35, 0.8, n2) * 0.5);
// crack network: long irregular plates with finer cracks inside them, opening with wear; some areas stay sound
float open = smoothstep(0.3, 1.0, uWear);
vec2 wp = pp + (vec2(n1, texture2D(uNoise, pp * 0.9 + 0.5).r) - 0.5) * 0.5;
float e1 = vorEdge(wp * vec2(2.4, 1.5) + n2 * 0.6);
float e2 = vorEdge(wp * vec2(6.5, 5.0) + 3.1);
float sound = smoothstep(0.30, 0.52, texture2D(uNoise, pp * 0.23 + 0.71).r);
float w1 = 0.034 * open * (0.35 + n2 * 1.2) * (0.35 + sound);
float w2 = 0.03 * smoothstep(0.6, 1.0, uWear) * (0.2 + n1) * sound;
float f1 = fwidth(e1) * 1.2, f2 = fwidth(e2) * 1.2;
float c1 = (1.0 - smoothstep(0.0, max(w1, f1), e1)) * clamp(w1 / max(f1, 1e-5), 0.0, 1.0);
float c2 = (1.0 - smoothstep(0.0, max(w2, f2), e2)) * clamp(w2 / max(f2, 1e-5), 0.0, 1.0) * 0.55;
float crack = clamp(max(c1, c2), 0.0, 1.0);
// plates curl up slightly at their edges
float lip = smoothstep(0.0, 0.1, e1) * (1.0 - smoothstep(0.1, 0.3, e1)) * open * sound;
pcol = mix(pcol, vec3(0.07, 0.05, 0.035), crack * 0.9);
pcol *= 1.0 + lip * 0.045;
float pitchH = -crack * 0.9 + lip * 0.12 - foot * 0.35 * n3 + n4 * 0.05 + n3 * 0.06;
// crease markings
float ax = abs(pp.x), az = abs(pp.y);
float paint = 0.0;
paint = max(paint, (1.0 - smoothstep(0.022, 0.03, abs(az - 8.84))));
paint = max(paint, (1.0 - smoothstep(0.022, 0.03, abs(az - 10.06))) * step(ax, 1.32));
paint = max(paint, (1.0 - smoothstep(0.022, 0.03, abs(ax - 1.32))) * step(8.84, az) * step(az, 11.28));
paint *= uPaint * (0.75 + n3 * 0.3) * (1.0 - foot * 0.8) * (1.0 - crack);
pcol = mix(pcol, vec3(0.93, 0.92, 0.88), paint);
// fade into the square at the edges of the strip
float edge = smoothstep(1.525, 1.40, ax + (n1 - 0.5) * 0.08) * smoothstep(11.28, 11.1, az);
diffuseColor.rgb = pcol;
diffuseColor.a = edge;
`;

export class Pitch {
  mesh: THREE.Mesh;
  mat: THREE.MeshStandardMaterial;
  private u = { uWear: { value: 0 }, uPaint: { value: 1 }, uNoise: { value: canvasTex(noiseCanvas(512, 91, 6), false, true) } };
  constructor() {
    this.mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82, metalness: 0, transparent: true, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
    this.mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, this.u);
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vWPos;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;");
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", "#include <common>\n" + PRELUDE)
        .replace("#include <map_fragment>", SURFACE)
        .replace("#include <roughnessmap_fragment>", "float roughnessFactor = clamp(roughness + crack * 0.2 + foot * 0.12 - paint * 0.2, 0.0, 1.0);")
        .replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\nnormal = perturbN(-vViewPosition, normal, vec2(dFdx(pitchH), dFdy(pitchH)) * 0.9);");
    };
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(PITCH_W, PITCH_L), this.mat);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = 0.008;
    this.mesh.receiveShadow = true;
    this.mesh.renderOrder = 1;
  }
  set(wear: number, paint = 1) {
    this.u.uWear.value = wear;
    this.u.uPaint.value = paint;
    this.mat.roughness = 0.74 + wear * 0.2;
  }
}

// Cricket ball: lacquered leather with a raised, stitched seam. `white` for the limited-overs ball.
const ballTex = (white: boolean) => {
  const [c, ctx] = makeCanvas(1024, 512);
  ctx.fillStyle = white ? "#ebe8df" : "#8e1a1a";
  ctx.fillRect(0, 0, 1024, 512);
  ctx.globalAlpha = 0.22;
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(noiseCanvas(512, 7, 6), 0, 0, 1024, 512);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  // seam: a band around the equator (v = 0.5) with six rows of stitches
  ctx.fillStyle = white ? "#cfc9b8" : "#6f1414";
  ctx.fillRect(0, 232, 1024, 48);
  ctx.strokeStyle = white ? "#3d7a4a" : "#f0e6d0";
  ctx.lineWidth = 2.4;
  for (const y of [238, 246, 254, 258, 266, 274]) {
    ctx.setLineDash([7, 5]);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  return c;
};

export class Ball {
  group = new THREE.Group();
  private mats: Record<"red" | "white", THREE.MeshStandardMaterial>;
  private mesh: THREE.Mesh;
  static R = 0.0364;
  constructor() {
    const mk = (white: boolean) => new THREE.MeshStandardMaterial({ map: canvasTex(ballTex(white)), roughness: white ? 0.5 : 0.42, metalness: 0 });
    this.mats = { red: mk(false), white: mk(true) };
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(Ball.R, 40, 24), this.mats.red);
    this.mesh.castShadow = true;
    this.group.add(this.mesh);
    this.group.visible = false;
  }
  kind(k: "red" | "white") {
    this.mesh.material = this.mats[k];
  }
}
