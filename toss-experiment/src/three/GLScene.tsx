// A Three.js canvas that is drawn synchronously on every Remotion frame.
// setup() builds the scene once (async allowed, gated by delayRender); draw() runs in a layout
// effect on every render, so the captured frame always matches the current frame number.
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cancelRender, continueRender, delayRender, useVideoConfig } from "remotion";
import * as THREE from "three";

export type GLState = { scene: THREE.Scene; dispose?: () => void };

export function GLScene<S extends GLState>({
  setup,
  draw,
  scale = 1,
  shadows = false,
  transparent = false,
  antialias = true,
  exposure = 1,
  style,
}: {
  setup: (r: THREE.WebGLRenderer, w: number, h: number) => Promise<S> | S;
  draw: (s: S, r: THREE.WebGLRenderer) => void;
  scale?: number;
  shadows?: boolean;
  transparent?: boolean;
  antialias?: boolean;
  exposure?: number;
  style?: React.CSSProperties;
}) {
  const { width, height } = useVideoConfig();
  const w = Math.round(width * scale), h = Math.round(height * scale);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<S | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;
  const [handle] = useState(() => delayRender("GL scene setup", { timeoutInMilliseconds: 110000 }));

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      alpha: transparent,
      antialias,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(1);
    renderer.setSize(w, h, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = exposure;
    if (transparent) renderer.setClearColor(0x000000, 0);
    if (shadows) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    let alive = true;
    Promise.resolve(setup(renderer, w, h))
      .then((s) => {
        if (!alive) return;
        stateRef.current = s;
        rendererRef.current = renderer;
        drawRef.current(s, renderer);
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
    return () => {
      alive = false;
      const s = stateRef.current;
      if (s) {
        s.dispose?.();
        s.scene.traverse((o) => {
          const m = o as THREE.Mesh;
          m.geometry?.dispose?.();
          const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
          mats.forEach((mt) => {
            Object.values(mt).forEach((v) => (v instanceof THREE.Texture ? v.dispose() : null));
            mt.dispose();
          });
        });
      }
      renderer.dispose();
      renderer.forceContextLoss();
      stateRef.current = null;
      rendererRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (stateRef.current && rendererRef.current) drawRef.current(stateRef.current, rendererRef.current);
  });

  return <canvas ref={canvasRef} width={w} height={h} style={{ position: "absolute", left: 0, top: 0, width, height, ...style }} />;
}

// Deterministic RNG for procedural content.
export const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const canvasTex = (w: number, h: number, paint: (g: CanvasRenderingContext2D) => void, srgb = true) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  paint(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
};

// Height map (canvas luminance) → tangent-space normal map (tight typed-array loop).
export const normalFromHeight = (src: HTMLCanvasElement, strength = 4) => {
  const w = src.width, h = src.height;
  const d = src.getContext("2d")!.getImageData(0, 0, w, h).data;
  const hv = new Float32Array(w * h);
  for (let i = 0, j = 0; i < hv.length; i++, j += 4) hv[i] = d[j] / 255;
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const g = out.getContext("2d")!;
  const img = g.createImageData(w, h);
  const o = img.data;
  for (let y = 0; y < h; y++) {
    const ym = ((y - 1 + h) % h) * w, yp = ((y + 1) % h) * w, yr = y * w;
    for (let x = 0; x < w; x++) {
      const xm = (x - 1 + w) % w, xp = (x + 1) % w;
      const dx = (hv[yr + xp] - hv[yr + xm]) * strength;
      const dy = (hv[yp + x] - hv[ym + x]) * strength;
      const inv = 1 / Math.sqrt(dx * dx + dy * dy + 1);
      const i = (yr + x) * 4;
      o[i] = (-dx * inv * 0.5 + 0.5) * 255;
      o[i + 1] = (dy * inv * 0.5 + 0.5) * 255;
      o[i + 2] = (inv * 0.5 + 0.5) * 255;
      o[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(out);
  t.colorSpace = THREE.NoColorSpace;
  t.anisotropy = 8;
  return t;
};
