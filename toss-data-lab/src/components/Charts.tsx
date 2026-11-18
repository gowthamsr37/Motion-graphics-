// Chart primitives drawn in SVG: axes, a simulated null distribution, CI whiskers.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { theme } from "../theme";
import { CLAMP } from "./Motion";

const C = theme.colors;

export const scaleLin = (d0: number, d1: number, r0: number, r1: number) => (v: number) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

// Seeded RNG + normal draws, so the "simulation" is a real simulation and identical every render.
const mulberry = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// 10,000 simulated seasons of n=2,487 fair-coin tosses (normal approximation to the binomial), in %.
const N_ODI = 2487;
const SD = Math.sqrt(0.25 / N_ODI) * 100;
export const SIM = (() => {
  const r = mulberry(2487);
  const out: number[] = [];
  for (let i = 0; i < 10000; i++) {
    const u = Math.max(1e-9, r()), v = r();
    out.push(50 + SD * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v));
  }
  return out;
})();
export const SIM_IN_BAND = SIM.filter((x) => x >= 48 && x <= 52).length / SIM.length;

export const HIST = (() => {
  const lo = 46.6, hi = 53.4, w = 0.2;
  const bins = Array.from({ length: Math.round((hi - lo) / w) }, (_, i) => ({ x0: lo + i * w, x1: lo + (i + 1) * w, n: 0 }));
  for (const v of SIM) {
    const k = Math.floor((v - lo) / w);
    if (k >= 0 && k < bins.length) bins[k].n++;
  }
  return { lo, hi, bins, max: Math.max(...bins.map((b) => b.n)) };
})();

// Null-distribution histogram with optional coin-flip band and observed marker.
export const NullHist: React.FC<{
  width: number;
  height: number;
  grow: number; // frame the bars start growing (relative)
  band?: number; // frame the 48–52 band appears
  observed?: { at: number; value: number };
  instant?: boolean;
}> = ({ width, height, grow, band, observed, instant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const padL = 20, padR = 20, padB = 70, padT = 30;
  const x = scaleLin(HIST.lo, HIST.hi, padL, width - padR);
  const y = scaleLin(0, HIST.max * 1.08, height - padB, padT);
  const bandP = band === undefined ? 0 : interpolate(frame, [band, band + fps * 0.6], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const obsP = observed ? spring({ frame: frame - observed.at, fps, config: theme.spring.bouncy }) : 0;
  const ticks = [47, 48, 49, 50, 51, 52, 53];
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* band */}
      {band !== undefined && (
        <g opacity={bandP}>
          <rect x={x(48)} y={padT - 10} width={(x(52) - x(48)) * bandP} height={height - padB - padT + 10} fill={C.green} opacity={0.1} rx={8} />
          <line x1={x(48)} x2={x(48)} y1={padT - 10} y2={height - padB} stroke={C.green} strokeWidth={2} strokeDasharray="6 6" />
          <line x1={x(52)} x2={x(52)} y1={padT - 10} y2={height - padB} stroke={C.green} strokeWidth={2} strokeDasharray="6 6" opacity={bandP > 0.95 ? 1 : 0} />
        </g>
      )}
      {/* bars */}
      {HIST.bins.map((b, i) => {
        const centre = Math.abs(i - HIST.bins.length / 2);
        const p = instant ? 1 : spring({ frame: frame - grow - centre * 1.2, fps, config: theme.spring.smooth });
        const h = (y(0) - y(b.n)) * p;
        const inBand = b.x0 >= 48 - 1e-6 && b.x1 <= 52 + 1e-6;
        return (
          <rect
            key={i}
            x={x(b.x0) + 2}
            y={y(0) - h}
            width={x(b.x1) - x(b.x0) - 4}
            height={Math.max(0, h)}
            rx={3}
            fill={bandP > 0.5 && inBand ? C.green : C.cyan}
            opacity={bandP > 0.5 && !inBand ? 0.35 : 0.8}
          />
        );
      })}
      {/* axis */}
      <line x1={padL} x2={width - padR} y1={y(0)} y2={y(0)} stroke={C.gridHi} strokeWidth={2} />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={y(0)} y2={y(0) + 10} stroke={C.gridHi} strokeWidth={2} />
          <text x={x(t)} y={y(0) + 44} fill={t === 48 || t === 52 ? (bandP > 0.5 ? C.green : C.dim) : C.dim} fontFamily={theme.fonts.mono} fontSize={26} textAnchor="middle">
            {t}%
          </text>
        </g>
      ))}
      {/* observed marker */}
      {observed && (
        <g transform={`translate(${x(observed.value)}, 0)`} opacity={interpolate(obsP, [0, 0.2], [0, 1], CLAMP)}>
          <line x1={0} x2={0} y1={interpolate(obsP, [0, 1], [-200, padT - 24])} y2={y(0)} stroke={C.amber} strokeWidth={5} strokeLinecap="round" />
          <circle cx={0} cy={interpolate(obsP, [0, 1], [-200, padT - 24])} r={14} fill={C.amber} />
          <circle cx={0} cy={interpolate(obsP, [0, 1], [-200, padT - 24])} r={26} fill="none" stroke={C.amber} strokeWidth={2} opacity={0.5 + Math.sin(frame / 6) * 0.3} />
        </g>
      )}
    </svg>
  );
};

// Horizontal CI whisker with point.
export const Whisker: React.FC<{ x: (v: number) => number; y: number; lo: number; hi: number; v: number; color: string; p: number; r?: number }> = ({ x, y, lo, hi, v, color, p, r = 13 }) => {
  const mid = x(v);
  return (
    <g opacity={interpolate(p, [0, 0.15], [0, 1], CLAMP)}>
      <line x1={mid - (mid - x(lo)) * p} x2={mid + (x(hi) - mid) * p} y1={y} y2={y} stroke={color} strokeWidth={5} strokeLinecap="round" />
      <line x1={mid - (mid - x(lo)) * p} x2={mid - (mid - x(lo)) * p} y1={y - 14} y2={y + 14} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <line x1={mid + (x(hi) - mid) * p} x2={mid + (x(hi) - mid) * p} y1={y - 14} y2={y + 14} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <circle cx={mid} cy={y} r={r * Math.min(1, p * 1.4)} fill={color} />
    </g>
  );
};
