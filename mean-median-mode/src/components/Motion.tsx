import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";

export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type EaseFn = (t: number) => number;
export const ease = (f: number, input: number[], output: number[], easing: EaseFn = theme.ease.out) =>
  interpolate(f, input, output, { easing, ...CLAMP });

type SpringCfg = { damping: number; stiffness: number; mass: number };
export const useSpr = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (at: number, cfg: SpringCfg = theme.spring.smooth) => spring({ frame: frame - at, fps, config: cfg });
};

// Exit progress 0 → 1 over `dur` frames starting at `at` (ease-in: exits accelerate away).
export const exitP = (frame: number, at: number | undefined, dur = 10) =>
  at === undefined ? 0 : ease(frame, [at, at + dur], [0, 1], theme.ease.in);

// Deterministic PRNG.
export const rng = (seed: number) => {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Decaying camera shake.
export const shake = (frame: number, at: number, dur: number, amp: number) => {
  const t = frame - at;
  if (t < 0 || t > dur) return { x: 0, y: 0 };
  const k = amp * (1 - t / dur) ** 2;
  return { x: Math.sin(t * 2.9) * k, y: Math.cos(t * 3.7) * k * 0.8 };
};

type Dir = "up" | "down" | "left" | "right" | "scale" | "none";
const offset = (dir: Dir, d: number) =>
  dir === "up" ? [0, d] : dir === "down" ? [0, -d] : dir === "left" ? [d, 0] : dir === "right" ? [-d, 0] : [0, 0];

// Absolutely positioned, centred at (x, y): springs in (opacity + travel + scale), exits faster than it entered.
export const Pop: React.FC<{
  at: number;
  out?: number;
  x: number;
  y: number;
  from?: Dir;
  dist?: number;
  scaleFrom?: number;
  cfg?: SpringCfg;
  outDur?: number;
  z?: number;
  dim?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, out, x, y, from = "up", dist = 40, scaleFrom = 0.86, cfg = theme.spring.snappy, outDur = 10, z, dim = 1, style, children }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const p = spr(at, cfg);
  const e = exitP(frame, out, outDur);
  if (p <= 0.001 || e >= 0.999) return null;
  const [ox, oy] = offset(from, dist);
  const s = interpolate(p, [0, 1], [scaleFrom, 1]) * (1 - 0.08 * e);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: z,
        opacity: Math.min(1, p * 1.4) * (1 - e) * dim,
        transform: `translate(-50%, -50%) translate(${ox * (1 - p)}px, ${oy * (1 - p) - 24 * e}px) scale(${s})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Idle micro-motion for anything that stays on screen.
export const useBreathe = (speed = 1, amp = 1, phase = 0) => {
  const frame = useCurrentFrame();
  return { y: Math.sin(frame / (30 / speed) + phase) * 4 * amp, s: 1 + Math.sin(frame / (24 / speed) + phase) * 0.012 * amp };
};

// Radial particle burst.
export const Burst: React.FC<{ at: number; x: number; y: number; color: string; count?: number; radius?: number; seed?: number; size?: number }> = ({
  at,
  x,
  y,
  color,
  count = 16,
  radius = 170,
  seed = 1,
  size = 10,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 34) return null;
  const r = rng(seed);
  const p = ease(t, [0, 30], [0, 1], theme.ease.out);
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + r() * 0.4;
        const d = radius * (0.55 + r() * 0.6) * p;
        const s = size * (0.5 + r()) * (1 - p * 0.8);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(a) * d - s / 2,
              top: y + Math.sin(a) * d - s / 2,
              width: s,
              height: s,
              borderRadius: s,
              background: i % 3 === 0 ? theme.colors.white : color,
              boxShadow: `0 0 ${s * 1.5}px ${alpha(color, 0.8)}`,
              opacity: 1 - p,
            }}
          />
        );
      })}
    </>
  );
};

// Expanding rings.
export const Ripple: React.FC<{ at: number; x: number; y: number; color: string; size?: number; rings?: number; flat?: number }> = ({
  at,
  x,
  y,
  color,
  size = 260,
  rings = 2,
  flat = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: rings }).map((_, i) => {
        const t = frame - at - i * 7;
        if (t < 0 || t > 30) return null;
        const p = ease(t, [0, 30], [0, 1], theme.ease.out);
        const w = size * (0.2 + p);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - w / 2,
              top: y - (w * flat) / 2,
              width: w,
              height: w * flat,
              borderRadius: "50%",
              border: `${4 - p * 2.5}px solid ${alpha(color, 0.85 * (1 - p))}`,
            }}
          />
        );
      })}
    </>
  );
};

// Confetti: tumbling ribbons with gravity.
export const Confetti: React.FC<{ at: number; x: number; y: number; colors: string[]; count?: number; seed?: number; spread?: number }> = ({
  at,
  x,
  y,
  colors,
  count = 34,
  seed = 7,
  spread = 1,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 75) return null;
  const r = rng(seed);
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const a = -Math.PI / 2 + (r() - 0.5) * Math.PI * 1.25 * spread;
        const v = 15 + r() * 15;
        const px = x + Math.cos(a) * v * t * 0.9;
        const py = y + Math.sin(a) * v * t * 0.9 + 0.45 * t * t;
        const rot = t * (8 + r() * 14) * (i % 2 ? 1 : -1);
        const w = 10 + r() * 10;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: w,
              height: w * 0.45,
              borderRadius: 2,
              background: colors[i % colors.length],
              transform: `rotate(${rot}deg) scaleX(${Math.cos(t * 0.3 + i)})`,
              opacity: ease(t, [55, 75], [1, 0]),
            }}
          />
        );
      })}
    </>
  );
};

const FADE = "linear-gradient(180deg, transparent 0%, black 22%, black 78%, transparent 100%)";

// Odometer-style number: the lowest digit rolls continuously, higher digits roll only while carrying.
export const Rolling: React.FC<{ value: number; decimals: number; height: number; color: string; size: number; font?: string; weight?: number }> = ({
  value,
  decimals,
  height,
  color,
  size,
  font = theme.fonts.mono,
  weight = 800,
}) => {
  const intDigits = Math.max(1, Math.floor(Math.abs(value)).toString().length);
  const places: number[] = [];
  for (let p = intDigits - 1; p >= -decimals; p--) places.push(p);
  const low = -decimals;
  const cell = (p: number) => {
    const P = 10 ** p;
    const x = value / P;
    let pos: number;
    if (p === low) pos = x % 10;
    else {
      const r = (value % P) / P;
      pos = (Math.floor(x) % 10) + (r >= 0.9 ? (r - 0.9) * 10 : 0);
    }
    return pos;
  };
  return (
    <div style={{ display: "flex", alignItems: "flex-start", fontFamily: font, fontWeight: weight, fontSize: size, color, lineHeight: `${height}px`, height, overflow: "hidden" }}>
      {places.map((p) => {
        const pos = cell(p);
        return (
          <React.Fragment key={p}>
            {p === -1 ? <span style={{ height }}>.</span> : null}
            <span style={{ display: "inline-block", height, overflow: "hidden", width: size * 0.62, textAlign: "center", WebkitMaskImage: FADE, maskImage: FADE }}>
              <span style={{ display: "block", transform: `translateY(${-pos * height}px)` }}>
                {Array.from({ length: 11 }).map((_, d) => (
                  <span key={d} style={{ display: "block", height }}>
                    {d % 10}
                  </span>
                ))}
              </span>
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Hand-drawn style check / cross that stroke on.
export const Mark: React.FC<{ kind: "check" | "cross"; at: number; size: number; color: string; width?: number }> = ({ kind, at, size, color, width = 10 }) => {
  const frame = useCurrentFrame();
  const p1 = ease(frame, [at, at + 8], [0, 1]);
  const p2 = ease(frame, [at + 5, at + 13], [0, 1]);
  const common = { fill: "none", stroke: color, strokeWidth: width, strokeLinecap: "round" as const, pathLength: 1, strokeDasharray: 1 };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: `drop-shadow(0 0 10px ${alpha(color, 0.6)})` }}>
      {kind === "check" ? (
        <path d="M18 54 L42 76 L84 26" {...common} strokeDashoffset={1 - ease(frame, [at, at + 12], [0, 1])} />
      ) : (
        <>
          <path d="M20 20 L80 80" {...common} strokeDashoffset={1 - p1} />
          <path d="M80 20 L20 80" {...common} strokeDashoffset={1 - p2} />
        </>
      )}
    </svg>
  );
};
