// Renderer + post chain. One WebGL context for the whole film:
//   stadium pass  →  (optional) lens-blurred background + close-up pass  →  bloom  →  tone-map / grade / grain.
// The 3D layer renders at RES × 1080×1920 and is scaled up by the page; type and graphs stay 2D at full resolution.
import * as THREE from "three";
import { envAt, EnvState, LightRig } from "./env";
import { Macro } from "./macro";
import { Pillars } from "./pillars";
import { Ball, Pitch } from "./pitch";
import { Cast } from "./players";
import { Stadium } from "./stadium";
import { applyPose, Pose } from "./util";

export const RES = 0.75;
export const RW = Math.round(1080 * RES);
export const RH = Math.round(1920 * RES);

const QUAD_VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const BRIGHT_FRAG = /* glsl */ `
varying vec2 vUv; uniform sampler2D tDiffuse; uniform vec2 uTexel; uniform float uThreshold;
void main(){
  vec3 c = vec3(0.0);
  c += texture2D(tDiffuse, vUv + uTexel * vec2(-1.0, -1.0)).rgb;
  c += texture2D(tDiffuse, vUv + uTexel * vec2( 1.0, -1.0)).rgb;
  c += texture2D(tDiffuse, vUv + uTexel * vec2(-1.0,  1.0)).rgb;
  c += texture2D(tDiffuse, vUv + uTexel * vec2( 1.0,  1.0)).rgb;
  c *= 0.25;
  c = min(c, vec3(60.0));
  float l = max(c.r, max(c.g, c.b));
  float k = max(l - uThreshold, 0.0) / max(l, 1e-4);
  gl_FragColor = vec4(c * k, 1.0);
}`;
const BLUR_FRAG = /* glsl */ `
varying vec2 vUv; uniform sampler2D tDiffuse; uniform vec2 uDir;
void main(){
  vec3 c = texture2D(tDiffuse, vUv).rgb * 0.227027;
  c += (texture2D(tDiffuse, vUv + uDir * 1.3846).rgb + texture2D(tDiffuse, vUv - uDir * 1.3846).rgb) * 0.316216;
  c += (texture2D(tDiffuse, vUv + uDir * 3.2308).rgb + texture2D(tDiffuse, vUv - uDir * 3.2308).rgb) * 0.070270;
  gl_FragColor = vec4(c, 1.0);
}`;
// Lens blur: a disc kernel, so out-of-focus floodlights become discs rather than smudges.
const BOKEH_FRAG = /* glsl */ `
varying vec2 vUv; uniform sampler2D tDiffuse; uniform vec2 uRadius;
void main(){
  vec3 acc = vec3(0.0); float wsum = 0.0;
  const float GA = 2.39996323;
  for (int i = 0; i < 56; i++) {
    float fi = float(i);
    float r = sqrt((fi + 0.5) / 56.0);
    vec2 o = vec2(cos(fi * GA), sin(fi * GA)) * r * uRadius;
    vec3 s = min(texture2D(tDiffuse, vUv + o).rgb, vec3(40.0));
    float w = 1.0 + dot(s, vec3(0.3333)) * 1.6;
    acc += s * w; wsum += w;
  }
  gl_FragColor = vec4(acc / wsum, 1.0);
}`;
const COPY_FRAG = /* glsl */ `varying vec2 vUv; uniform sampler2D tDiffuse; uniform float uGain; void main(){ gl_FragColor = vec4(texture2D(tDiffuse, vUv).rgb * uGain, 1.0); }`;
const COMP_FRAG = /* glsl */ `
varying vec2 vUv;
uniform sampler2D tScene, tB0, tB1, tB2, tB3;
uniform float uBloom, uExposure, uVignette, uGrain, uTime, uSat, uContrast, uFade, uFlash, uChroma;
uniform vec3 uShadowTint, uHighTint;
uniform vec2 uRes;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec3 aces(vec3 x){ return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
void main(){
  vec2 c = vUv - 0.5;
  vec2 off = c * uChroma * dot(c, c) * 4.0;
  vec3 col = vec3(texture2D(tScene, vUv + off).r, texture2D(tScene, vUv).g, texture2D(tScene, vUv - off).b);
  vec3 bloom = texture2D(tB0, vUv).rgb * 0.35 + texture2D(tB1, vUv).rgb * 0.3 + texture2D(tB2, vUv).rgb * 0.22 + texture2D(tB3, vUv).rgb * 0.22;
  col += bloom * uBloom;
  col *= uExposure;
  col = aces(col);
  col = pow(col, vec3(1.0 / 2.2));
  float l = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(l), col, uSat);
  col = (col - 0.5) * uContrast + 0.5;
  col *= mix(uShadowTint, uHighTint, smoothstep(0.0, 0.75, l));
  float r = length(c * vec2(1.0, uRes.y / uRes.x * 0.62));
  col *= 1.0 - uVignette * smoothstep(0.38, 1.02, r);
  float g = hash(floor(vUv * uRes) + floor(uTime * 30.0) * 17.0) - 0.5;
  col += g * uGrain * (1.0 - l * 0.6);
  col = mix(col, vec3(1.0), uFlash);
  col *= 1.0 - uFade;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

export type Grade = {
  exposure?: number;
  bloom?: number;
  sat?: number;
  contrast?: number;
  shadowTint?: [number, number, number];
  highTint?: [number, number, number];
  vignette?: number;
  grain?: number;
  fade?: number;
  flash?: number;
  chroma?: number;
};

export type WorldState = {
  tod: number;
  lamps: number[]; // floodlight power per tower, 0…1
  time: number; // seconds, for twinkle / stars
  cloudTime: number;
  cloudAmt?: number;
  dew?: number;
  dry?: number;
  beams?: number;
  focus: THREE.Vector3; // where the shadow maps should look
  shadowR: number;
  towerShadows?: boolean;
};

export type MacroView = {
  cam: Pose; // in coin units
  blur: number; // background lens blur radius, as a fraction of frame width
  anchor: THREE.Vector3; // where in the stadium the close-up is happening
  envKey: string; // reflections are captured once per key
  ground?: boolean;
  shadowR?: number;
  bgGain?: number;
  set?: "coin" | "grass"; // which close-up set is on stage (default coin)
  scale?: number; // metres per macro unit (coin: 0.0135; grass is built in metres: 1)
  bgYaw?: number; // turn the stadium behind the close-up (radians about the vertical)
  grassGrow?: number; // 0…1: blades rise out of the turf as the lens comes down
  motes?: number; // floating dust in front of the lens
  time?: number;
};

const rt = (w: number, h: number, depth = false, samples = 0) => {
  const t = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, depthBuffer: depth, samples, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
  t.texture.wrapS = t.texture.wrapT = THREE.ClampToEdgeWrapping;
  return t;
};

export class Engine {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, RW / RH, 0.3, 6000);
  rig: LightRig;
  stadium = new Stadium();
  macro = new Macro();
  pitch = new Pitch();
  ball = new Ball();
  pillars = new Pillars();
  cast = new Cast();
  tossCoin = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.005, 24), new THREE.MeshStandardMaterial({ color: 0xf6bc45, metalness: 1, roughness: 0.3, emissive: 0xf6a01f, emissiveIntensity: 0.35 }));
  trail = new THREE.InstancedMesh(new THREE.SphereGeometry(0.012, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, toneMapped: false }), 48);
  env: EnvState = envAt(0);
  private hdr = rt(RW, RH, true, 4);
  private bg = rt(RW / 2, RH / 2, true, 0);
  private bgA = rt(RW / 2, RH / 2);
  private bgB = rt(RW / 2, RH / 2);
  private levels = [2, 4, 8, 16].map((d) => [rt(Math.round(RW / d), Math.round(RH / d)), rt(Math.round(RW / d), Math.round(RH / d))]);
  private quadScene = new THREE.Scene();
  private quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private quad: THREE.Mesh;
  private mats: Record<"bright" | "blur" | "bokeh" | "copy" | "comp", THREE.ShaderMaterial>;
  private pmrem: THREE.PMREMGenerator;
  private cubeRT = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
  private cubeCam: THREE.CubeCamera;
  private envs = new Map<string, THREE.WebGLRenderTarget>();
  private fog = new THREE.FogExp2(0x000000, 0.001);
  private mfog = new THREE.FogExp2(0x000000, 0.0);

  constructor(canvas: HTMLCanvasElement) {
    const r = (this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, preserveDrawingBuffer: true, powerPreference: "high-performance" }));
    r.setPixelRatio(1);
    r.setSize(RW, RH, false);
    r.autoClear = false;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.toneMapping = THREE.NoToneMapping;
    r.outputColorSpace = THREE.LinearSRGBColorSpace; // the composite pass does its own display transform
    this.scene.fog = this.fog;
    this.macro.scene.fog = this.mfog;
    this.scene.add(this.stadium.group, this.pitch.mesh, this.ball.group, this.pillars.group, this.cast.group, this.tossCoin, this.trail);
    this.tossCoin.visible = false;
    this.tossCoin.castShadow = true;
    this.trail.visible = false;
    this.trail.frustumCulled = false;
    this.rig = new LightRig(this.scene, 4096, 1024);
    const mk = (frag: string, uniforms: Record<string, THREE.IUniform>) => new THREE.ShaderMaterial({ vertexShader: QUAD_VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false, toneMapped: false, fog: false });
    this.mats = {
      bright: mk(BRIGHT_FRAG, { tDiffuse: { value: null }, uTexel: { value: new THREE.Vector2() }, uThreshold: { value: 1.0 } }),
      blur: mk(BLUR_FRAG, { tDiffuse: { value: null }, uDir: { value: new THREE.Vector2() } }),
      bokeh: mk(BOKEH_FRAG, { tDiffuse: { value: null }, uRadius: { value: new THREE.Vector2() } }),
      copy: mk(COPY_FRAG, { tDiffuse: { value: null }, uGain: { value: 1 } }),
      comp: mk(COMP_FRAG, {
        tScene: { value: null },
        tB0: { value: null },
        tB1: { value: null },
        tB2: { value: null },
        tB3: { value: null },
        uBloom: { value: 1 },
        uExposure: { value: 1 },
        uVignette: { value: 0.4 },
        uGrain: { value: 0.04 },
        uTime: { value: 0 },
        uSat: { value: 1 },
        uContrast: { value: 1 },
        uFade: { value: 0 },
        uFlash: { value: 0 },
        uChroma: { value: 0.002 },
        uShadowTint: { value: new THREE.Vector3(1, 1, 1) },
        uHighTint: { value: new THREE.Vector3(1, 1, 1) },
        uRes: { value: new THREE.Vector2(RW, RH) },
      }),
    };
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mats.copy);
    this.quad.frustumCulled = false;
    this.quadScene.add(this.quad);
    this.pmrem = new THREE.PMREMGenerator(r);
    this.cubeCam = new THREE.CubeCamera(1, 5000, this.cubeRT);
  }

  private pass(mat: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget | null, clear = true) {
    this.quad.material = mat;
    this.renderer.setRenderTarget(target);
    if (clear) this.renderer.clear(true, true, false);
    this.renderer.render(this.quadScene, this.quadCam);
  }

  // Set the stadium to a moment: lighting, sky, floodlights.
  setWorld(w: WorldState, cam?: THREE.Camera) {
    const env = (this.env = envAt(w.tod));
    this.fog.color.copy(env.fogColor);
    this.fog.density = env.fog;
    this.stadium.update(env, w.lamps, { time: w.time, cloudTime: w.cloudTime, cloudAmt: w.cloudAmt, dew: w.dew, dry: w.dry, beams: w.beams, camera: cam });
    this.rig.apply(env, w.lamps, w.focus, w.shadowR, { towerShadows: w.towerShadows });
  }

  begin() {
    this.hdr.scissorTest = false;
    this.hdr.viewport.set(0, 0, RW, RH);
    this.renderer.setRenderTarget(this.hdr);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.clear(true, true, true);
  }

  // Draw the stadium through `cam` into a region of the frame (default: all of it).
  drawWorld(w: WorldState, cam: Pose, o: { near?: number; view?: [number, number, number, number] } = {}) {
    const [vx, vy, vw, vh] = o.view ?? [0, 0, 1, 1];
    const c = this.camera;
    c.aspect = (vw * RW) / (vh * RH);
    c.near = o.near ?? 0.3;
    c.far = 6000;
    c.fov = cam.fov;
    c.updateProjectionMatrix();
    applyPose(c, cam);
    this.setWorld(w, c);
    this.hdr.viewport.set(vx * RW, vy * RH, vw * RW, vh * RH);
    this.hdr.scissor.set(vx * RW, vy * RH, vw * RW, vh * RH);
    this.hdr.scissorTest = Boolean(o.view);
    this.renderer.setRenderTarget(this.hdr);
    this.renderer.render(this.scene, c);
  }

  // Reflections for the close-up scene: capture the stadium around `anchor` once per key.
  private envFor(key: string, anchor: THREE.Vector3) {
    let t = this.envs.get(key);
    if (!t) {
      const beams = this.stadium.beams.map((b) => b.visible);
      this.stadium.beams.forEach((b) => (b.visible = false));
      this.cubeCam.position.copy(anchor);
      this.cubeCam.update(this.renderer, this.scene);
      this.stadium.beams.forEach((b, i) => (b.visible = beams[i]));
      t = this.pmrem.fromCubemap(this.cubeRT.texture);
      this.envs.set(key, t);
    }
    return t.texture;
  }

  // Close-up: the stadium goes out of focus behind, the macro scene is drawn sharp in front.
  drawMacro(w: WorldState, m: MacroView) {
    const c = this.camera;
    c.aspect = RW / RH;
    c.near = 0.5;
    c.far = 6000;
    c.fov = m.cam.fov;
    c.updateProjectionMatrix();
    // the stadium camera sits at the anchor and turns with the close-up camera
    const yaw = m.bgYaw ?? 0;
    const UP = new THREE.Vector3(0, 1, 0);
    const dir = m.cam.l.clone().sub(m.cam.p).applyAxisAngle(UP, yaw);
    const sc = m.scale ?? 0.0135;
    const bp = m.anchor.clone().addScaledVector(m.cam.p.clone().applyAxisAngle(UP, yaw), sc);
    applyPose(c, { p: bp, l: bp.clone().add(dir), fov: m.cam.fov, roll: m.cam.roll });
    this.setWorld(w, c);
    const envTex = this.envFor(m.envKey, m.anchor);
    this.renderer.setRenderTarget(this.bg);
    this.renderer.clear(true, true, true);
    this.renderer.render(this.scene, c);
    const aspect = RW / RH;
    if (m.blur > 0.0005) {
      this.mats.bokeh.uniforms.tDiffuse.value = this.bg.texture;
      this.mats.bokeh.uniforms.uRadius.value.set(m.blur, m.blur * aspect);
      this.pass(this.mats.bokeh, this.bgA);
      // one light gaussian to hide the sample pattern
      const tx = (1 / (RW / 2)) * Math.min(2.2, 0.6 + m.blur * 60);
      this.mats.blur.uniforms.tDiffuse.value = this.bgA.texture;
      this.mats.blur.uniforms.uDir.value.set(tx, 0);
      this.pass(this.mats.blur, this.bgB);
      this.mats.blur.uniforms.tDiffuse.value = this.bgB.texture;
      this.mats.blur.uniforms.uDir.value.set(0, tx / aspect);
      this.pass(this.mats.blur, this.bgA);
    }
    this.mats.copy.uniforms.tDiffuse.value = m.blur > 0.0005 ? this.bgA.texture : this.bg.texture;
    this.mats.copy.uniforms.uGain.value = m.bgGain ?? 1;
    this.hdr.scissorTest = false;
    this.hdr.viewport.set(0, 0, RW, RH);
    this.pass(this.mats.copy, this.hdr, false);
    // foreground
    const mc = this.macro.camera;
    const grass = m.set === "grass";
    mc.aspect = RW / RH;
    mc.fov = m.cam.fov;
    mc.near = grass ? 0.012 : 0.05;
    mc.far = grass ? 40 : 400;
    mc.updateProjectionMatrix();
    this.macro.coin.group.visible = !grass;
    this.macro.grass.group.visible = grass;
    this.macro.motes.points.visible = (m.motes ?? 0) > 0.001;
    this.macro.motes.mat.uniforms.uAmt.value = m.motes ?? 0;
    this.macro.motes.mat.uniforms.uTime.value = m.time ?? w.time;
    applyPose(mc, m.cam);
    this.macro.scene.environment = envTex;
    this.macro.scene.environmentRotation.set(0, -yaw, 0);
    const gg = m.grassGrow ?? 1;
    this.macro.grass.group.scale.set(1, Math.max(0.001, gg), 1);
    this.macro.grass.groundMat.opacity = gg;
    this.macro.ground.visible = Boolean(m.ground);
    this.mfog.color.copy(this.env.fogColor);
    this.macro.rig.apply(this.env, w.lamps, new THREE.Vector3(0, 0, grass ? -1.2 : 0), m.shadowR ?? (grass ? 3 : 6), { towerShadows: true, scale: grass ? 0.06 : 0.2, yaw });
    this.renderer.setRenderTarget(this.hdr);
    this.renderer.clearDepth();
    this.renderer.render(this.macro.scene, mc);
  }

  finish(g: Grade, time: number) {
    const m = this.mats;
    m.bright.uniforms.tDiffuse.value = this.hdr.texture;
    m.bright.uniforms.uTexel.value.set(0.5 / RW, 0.5 / RH);
    this.pass(m.bright, this.levels[0][0]);
    for (let i = 0; i < this.levels.length; i++) {
      const [a, b] = this.levels[i];
      if (i > 0) {
        m.copy.uniforms.tDiffuse.value = this.levels[i - 1][0].texture;
        m.copy.uniforms.uGain.value = 1;
        this.pass(m.copy, a);
      }
      m.blur.uniforms.tDiffuse.value = a.texture;
      m.blur.uniforms.uDir.value.set(1 / a.width, 0);
      this.pass(m.blur, b);
      m.blur.uniforms.tDiffuse.value = b.texture;
      m.blur.uniforms.uDir.value.set(0, 1 / a.height);
      this.pass(m.blur, a);
    }
    const u = m.comp.uniforms;
    u.tScene.value = this.hdr.texture;
    u.tB0.value = this.levels[0][0].texture;
    u.tB1.value = this.levels[1][0].texture;
    u.tB2.value = this.levels[2][0].texture;
    u.tB3.value = this.levels[3][0].texture;
    u.uBloom.value = g.bloom ?? 1;
    u.uExposure.value = (g.exposure ?? 1) * this.env.exposure;
    u.uVignette.value = g.vignette ?? 0.42;
    u.uGrain.value = g.grain ?? 0.045;
    u.uTime.value = time;
    u.uSat.value = g.sat ?? 1.05;
    u.uContrast.value = g.contrast ?? 1.06;
    u.uFade.value = g.fade ?? 0;
    u.uFlash.value = g.flash ?? 0;
    u.uChroma.value = g.chroma ?? 0.002;
    u.uShadowTint.value.set(...(g.shadowTint ?? [0.94, 0.99, 1.06]));
    u.uHighTint.value.set(...(g.highTint ?? [1.03, 1.0, 0.96]));
    this.renderer.setRenderTarget(null);
    this.renderer.setViewport(0, 0, RW, RH);
    this.pass(m.comp, null);
    this.renderer.getContext().flush();
  }
}
