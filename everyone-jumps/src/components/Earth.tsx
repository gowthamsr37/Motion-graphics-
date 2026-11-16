// Photoreal Earth: a single full-frame shader quad (ray–sphere per pixel) rendered with Three.js.
// NASA Blue Marble (day) + Black Marble (city lights) + ocean mask + procedural clouds.
// The sun sits where it really is at 12:00 UTC on 16 November (subsolar point ≈ 18.8°S, 3.8°W),
// so the day/night line and the lit cities are physically correct for "the moment of the jump".
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { continueRender, delayRender, staticFile, useVideoConfig } from "remotion";
import * as THREE from "three";

export type EarthView = {
  cx: number; // disc centre, px in the 1080×1920 frame
  cy: number;
  r: number; // disc radius, px
  lat: number; // latitude at disc centre (deg)
  lon: number; // longitude at disc centre (deg)
  roll?: number; // deg
  utc?: number; // hours on 16 Nov (sets the sun). Default 12.0
  clouds?: number; // cloud drift, deg of longitude
  exposure?: number;
  night?: number; // city light strength
  ghost?: number; // 0..1 desaturate + dim (for hypothetical / frozen looks)
  atmo?: number; // atmosphere strength
};

const D2R = Math.PI / 180;
export const DECL = -18.8; // solar declination, 16 Nov
export const subsolarLon = (utc: number) => -15 * (utc - 11.745); // equation of time ≈ +15.3 min

// view→earth rotation (row-major 3×3): Ry(lon) · Rx(−lat) · Rz(roll)
export const viewMatrix = (lat: number, lon: number, roll = 0) => {
  const a = -lat * D2R, b = lon * D2R, c = roll * D2R;
  const Rx = [1, 0, 0, 0, Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a)];
  const Ry = [Math.cos(b), 0, Math.sin(b), 0, 1, 0, -Math.sin(b), 0, Math.cos(b)];
  const Rz = [Math.cos(c), -Math.sin(c), 0, Math.sin(c), Math.cos(c), 0, 0, 0, 1];
  const mul = (A: number[], B: number[]) => {
    const o = new Array(9).fill(0);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) o[i * 3 + j] += A[i * 3 + k] * B[k * 3 + j];
    return o;
  };
  return mul(mul(Ry, Rx), Rz);
};

export const latLonVec = (lat: number, lon: number): [number, number, number] => [
  Math.cos(lat * D2R) * Math.sin(lon * D2R),
  Math.sin(lat * D2R),
  Math.cos(lat * D2R) * Math.cos(lon * D2R),
];

// Project a lat/lon onto the frame for overlays. z>0 means on the visible hemisphere.
export const project = (v: EarthView, lat: number, lon: number, altitude = 0) => {
  const M = viewMatrix(v.lat, v.lon, v.roll ?? 0);
  const p = latLonVec(lat, lon);
  // earth→view is the transpose
  const x = M[0] * p[0] + M[3] * p[1] + M[6] * p[2];
  const y = M[1] * p[0] + M[4] * p[1] + M[7] * p[2];
  const z = M[2] * p[0] + M[5] * p[1] + M[8] * p[2];
  const s = v.r * (1 + altitude);
  return { x: v.cx + x * s, y: v.cy - y * s, z, nx: x, ny: -y };
};

const vert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy * 2.0, 0.0, 1.0); }
`;

const frag = /* glsl */ `
precision highp float;
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uWater;
uniform sampler2D uClouds;
uniform vec2 uRes;
uniform vec2 uCenter;
uniform float uR;
uniform mat3 uM;
uniform vec3 uSun;
uniform float uCloudShift;
uniform float uExposure;
uniform float uNightK;
uniform float uGhost;
uniform float uAtmo;
varying vec2 vUv;
const float PI = 3.14159265359;

vec3 lin(vec3 c) { return pow(c, vec3(2.2)); }

void main() {
  vec2 px = vec2(vUv.x * uRes.x, (1.0 - vUv.y) * uRes.y);
  vec2 d = (px - uCenter) / uR;
  d.y = -d.y;
  float rr = dot(d, d);
  float r = sqrt(rr);
  float aa = 1.2 / uR;

  // Surface coordinates are computed for every pixel (derivatives need uniform control flow).
  float z = sqrt(max(0.0, 1.0 - rr));
  vec3 nv = r < 1.0 ? vec3(d, z) : vec3(d / max(r, 1e-5), 0.0);
  vec3 p = normalize(uM * nv);
  float lon = atan(p.x, p.z);
  float lat = asin(clamp(p.y, -1.0, 1.0));
  vec2 uv = vec2(lon / (2.0 * PI) + 0.5, lat / PI + 0.5);
  float u2 = fract(uv.x + 0.5);
  float dux = dFdx(uv.x), duy = dFdy(uv.x);
  float dux2 = dFdx(u2), duy2 = dFdy(u2);
  if (abs(dux2) < abs(dux)) dux = dux2;
  if (abs(duy2) < abs(duy)) duy = duy2;
  vec2 gx = vec2(dux, dFdx(uv.y));
  vec2 gy = vec2(duy, dFdy(uv.y));

  vec3 viewE = uM * vec3(0.0, 0.0, 1.0);
  vec4 outc = vec4(0.0);

  if (r < 1.0 + 0.16) {
    float ndl = dot(p, uSun);
    float dayMix = smoothstep(-0.10, 0.16, ndl);

    vec3 day = lin(textureGrad(uDay, uv, gx, gy).rgb);
    float water = textureGrad(uWater, uv, gx, gy).r;
    // city lights live in the red channel (the terrain underneath is tinted blue)
    vec3 nightTex = textureGrad(uNight, uv, gx, gy).rgb;
    float lightsK = pow(smoothstep(0.02, 0.55, nightTex.r), 1.25);
    float bloomK = smoothstep(0.01, 0.30, textureGrad(uNight, uv, gx * 10.0, gy * 10.0).r);
    vec2 cuv = vec2(fract(uv.x - uCloudShift / 360.0), uv.y);
    float cloud = textureGrad(uClouds, cuv, gx, gy).r;
    cloud = smoothstep(0.08, 0.85, cloud) * 0.92;

    // oceans a touch deeper and bluer, land a touch richer
    day = mix(day * vec3(1.05, 1.02, 0.95), day * vec3(0.78, 0.92, 1.18), water);

    float diff = clamp(ndl * 1.05 + 0.04, 0.0, 1.0);
    vec3 lit = day * diff * 1.35;
    vec3 h = normalize(uSun + viewE);
    float spec = pow(max(dot(p, h), 0.0), 70.0) * water * (1.0 - cloud) * smoothstep(0.0, 0.25, ndl);
    lit += vec3(1.0, 0.93, 0.80) * spec * 0.55;
    // clouds: bright on the day side, a soft self-shadowed underside
    vec3 cloudC = vec3(1.0, 0.99, 0.97) * (diff * 1.3 + 0.015);
    lit = mix(lit, cloudC, cloud);

    vec3 lights = (vec3(1.0, 0.74, 0.40) * lightsK * 2.6 + vec3(1.0, 0.55, 0.22) * bloomK * 0.22) * uNightK * (1.0 - 0.7 * cloud);
    vec3 dark = lights + day * 0.008 + lin(nightTex) * vec3(0.10, 0.12, 0.16) + cloud * 0.005;
    vec3 col = mix(dark, lit, dayMix);
    // warm scattering along the terminator
    col += vec3(1.0, 0.45, 0.15) * 0.018 * exp(-pow((ndl + 0.02) / 0.05, 2.0)) * (0.3 + cloud);

    // atmospheric haze toward the limb (fresnel), brighter on the sunlit side
    float fres = pow(1.0 - z, 2.2);
    vec3 skyC = vec3(0.30, 0.56, 1.0);
    col = mix(col, skyC * clamp(ndl * 1.2 + 0.18, 0.0, 1.2), fres * 0.62 * uAtmo);

    // outer glow
    float hgt = max(r - 1.0, 0.0);
    float sunL = dot(p, uSun);
    float glow = exp(-hgt * 26.0) * (smoothstep(-0.4, 0.3, sunL) * 0.95 + 0.06);
    vec3 glowC = mix(vec3(0.18, 0.40, 1.0), vec3(0.45, 0.72, 1.0), smoothstep(0.0, 0.6, sunL)) * glow * uAtmo;

    // tone map + gamma
    col = vec3(1.0) - exp(-col * uExposure);
    glowC = vec3(1.0) - exp(-glowC * uExposure * 1.1);
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(col, vec3(lum) * 0.75, uGhost);
    glowC *= 1.0 - 0.6 * uGhost;
    col = pow(col, vec3(1.0 / 2.2));
    glowC = pow(glowC, vec3(1.0 / 2.2));

    float disc = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, r);
    vec3 g = r > 1.0 ? glowC : vec3(0.0);
    float ga = clamp(max(g.r, max(g.g, g.b)), 0.0, 1.0);
    outc = vec4(col * disc + g * (1.0 - disc), max(disc, ga * (1.0 - disc)));
  }
  gl_FragColor = outc;
}
`;

type Tex = { day: THREE.Texture; night: THREE.Texture; water: THREE.Texture; clouds: THREE.Texture };

const FILES = { day: "tex/earth-blue-marble.jpg", night: "tex/earth-night.jpg", water: "tex/earth-water.png", clouds: "tex/clouds.png" };

const loadTextures = (renderer: THREE.WebGLRenderer) => {
  const loader = new THREE.TextureLoader();
  const entries = Object.entries(FILES);
  return Promise.all(
    entries.map(
      ([, f]) =>
        new Promise<THREE.Texture>((res, rej) =>
          loader.load(
            staticFile(f),
            (t) => {
              t.wrapS = THREE.RepeatWrapping;
              t.wrapT = THREE.ClampToEdgeWrapping;
              t.minFilter = THREE.LinearMipmapLinearFilter;
              t.magFilter = THREE.LinearFilter;
              t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
              t.generateMipmaps = true;
              t.colorSpace = THREE.NoColorSpace;
              res(t);
            },
            undefined,
            rej,
          ),
        ),
    ),
  ).then((ts) => Object.fromEntries(entries.map(([k], i) => [k, ts[i]])) as Tex);
};

type GL = { renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.Camera; mat: THREE.ShaderMaterial };

const draw = (g: GL, view: EarthView) => {
  const u = g.mat.uniforms;
  const M = viewMatrix(view.lat, view.lon, view.roll ?? 0);
  (u.uM.value as THREE.Matrix3).set(M[0], M[1], M[2], M[3], M[4], M[5], M[6], M[7], M[8]);
  (u.uCenter.value as THREE.Vector2).set(view.cx, view.cy);
  u.uR.value = view.r;
  const sv = latLonVec(DECL, subsolarLon(view.utc ?? 12));
  (u.uSun.value as THREE.Vector3).set(sv[0], sv[1], sv[2]);
  u.uCloudShift.value = view.clouds ?? 0;
  u.uExposure.value = view.exposure ?? 1.6;
  u.uNightK.value = view.night ?? 1;
  u.uGhost.value = view.ghost ?? 0;
  u.uAtmo.value = view.atmo ?? 1;
  g.renderer.render(g.scene, g.camera);
};

// Plain Three.js (no react-three-fiber): the frame is drawn synchronously in a layout effect on every
// Remotion frame, so the captured image always matches the current frame during sequential rendering.
export const Earth: React.FC<{ view: EarthView; style?: React.CSSProperties }> = ({ view, style }) => {
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<GL | null>(null);
  const viewRef = useRef(view);
  const [handle] = useState(() => delayRender("Loading Earth textures"));

  useEffect(() => {
    const canvas = canvasRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, premultipliedAlpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    let cancelled = false;
    loadTextures(renderer)
      .then((tex) => {
        if (cancelled) return;
        const mat = new THREE.ShaderMaterial({
          vertexShader: vert,
          fragmentShader: frag,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          uniforms: {
            uDay: { value: tex.day },
            uNight: { value: tex.night },
            uWater: { value: tex.water },
            uClouds: { value: tex.clouds },
            uRes: { value: new THREE.Vector2(width, height) },
            uCenter: { value: new THREE.Vector2() },
            uR: { value: 100 },
            uM: { value: new THREE.Matrix3() },
            uSun: { value: new THREE.Vector3() },
            uCloudShift: { value: 0 },
            uExposure: { value: 1.6 },
            uNightK: { value: 1 },
            uGhost: { value: 0 },
            uAtmo: { value: 1 },
          },
        });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
        mesh.frustumCulled = false;
        const scene = new THREE.Scene();
        scene.add(mesh);
        glRef.current = { renderer, scene, camera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), mat };
        draw(glRef.current, viewRef.current); // first frame drawn before the render is released
        continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
        continueRender(handle);
      });
    return () => {
      cancelled = true;
      const g = glRef.current;
      if (g) {
        g.mat.dispose();
        Object.values(g.mat.uniforms).forEach((u) => (u.value instanceof THREE.Texture ? u.value.dispose() : null));
      }
      renderer.dispose();
      renderer.forceContextLoss();
      glRef.current = null;
    };
  }, [handle, width, height]);

  useLayoutEffect(() => {
    viewRef.current = view;
    if (glRef.current) draw(glRef.current, view);
  });

  return <canvas ref={canvasRef} width={width} height={height} style={{ position: "absolute", left: 0, top: 0, width, height, ...style }} />;
};
