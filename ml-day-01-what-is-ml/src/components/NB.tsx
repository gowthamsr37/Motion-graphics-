// NOTEBOOK KIT (100 Days of ML). Everything looks hand-made on cream lined paper:
// - Paper: ruled lines, red margin, punched holes, fibre texture, soft vignette
// - Sketch: rough.js shapes (line, rect, ellipse, circle, path, polygon, arrow) that DRAW ON like a pen
// - Write: handwriting that writes itself left → right, with a pencil riding the tip
// - Hi: a marker highlight swiped behind words
// - Sticky: a sticky note dropped onto the page (with tape)
// All draw-ons take an `at` frame and a `dur` in frames.
import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import rough from "roughjs";
import { ease, useSpr } from "./Motion";
import { hand, nb, theme } from "../theme";

const gen = rough.generator();

// ---------------- paper ----------------
export const RULE_GAP = 64;
export const MARGIN_X = 118;

export const Paper: React.FC<{ seed?: number }> = ({ seed = 1 }) => (
  <div style={{ position: "absolute", inset: 0, background: nb.paper, overflow: "hidden" }}>
    {/* ruled lines */}
    <div style={{ position: "absolute", inset: 0, top: 150, backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${RULE_GAP - 2}px, ${nb.rule} ${RULE_GAP - 2}px ${RULE_GAP}px)` }} />
    {/* margin */}
    <div style={{ position: "absolute", top: 0, bottom: 0, left: MARGIN_X, width: 3, background: nb.margin, opacity: 0.85 }} />
    <div style={{ position: "absolute", top: 0, bottom: 0, left: MARGIN_X + 7, width: 1.5, background: nb.margin, opacity: 0.5 }} />
    {/* punched holes */}
    {[300, 960, 1620].map((y) => (
      <div key={y} style={{ position: "absolute", left: 38, top: y, width: 42, height: 42, borderRadius: 21, background: "#D9CFBA", boxShadow: "inset 2px 3px 5px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.7)" }} />
    ))}
    {/* fibre texture */}
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.32, mixBlendMode: "multiply" }}>
      <filter id={`fib${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0.35 0" />
      </filter>
      <rect width={1080} height={1920} filter={`url(#fib${seed})`} />
    </svg>
    {/* warm vignette */}
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(120, 90, 40, 0.20) 100%)" }} />
  </div>
);

// ---------------- sketch (rough.js) ----------------
type Shape =
  | { k: "line"; x1: number; y1: number; x2: number; y2: number }
  | { k: "rect"; x: number; y: number; w: number; h: number }
  | { k: "ellipse"; x: number; y: number; w: number; h: number }
  | { k: "circle"; x: number; y: number; d: number }
  | { k: "path"; d: string }
  | { k: "poly"; pts: [number, number][] }
  | { k: "lines"; pts: [number, number][] }
  | { k: "curve"; pts: [number, number][] };

export type SketchOpts = {
  color?: string;
  width?: number;
  fill?: string;
  fillStyle?: "hachure" | "solid" | "zigzag" | "cross-hatch" | "dots";
  hachureGap?: number;
  fillWeight?: number;
  rough?: number;
  bow?: number;
  seed?: number;
  single?: boolean;
};

const drawable = (s: Shape, o: SketchOpts) => {
  const opts = {
    seed: o.seed ?? 7,
    roughness: o.rough ?? 1.1,
    bowing: o.bow ?? 1,
    stroke: o.color ?? nb.ink,
    strokeWidth: o.width ?? 4,
    fill: o.fill,
    fillStyle: o.fillStyle ?? "hachure",
    hachureGap: o.hachureGap ?? 12,
    fillWeight: o.fillWeight ?? 2.5,
    disableMultiStroke: o.single ?? false,
    preserveVertices: true,
  };
  switch (s.k) {
    case "line":
      return gen.line(s.x1, s.y1, s.x2, s.y2, opts);
    case "rect":
      return gen.rectangle(s.x, s.y, s.w, s.h, opts);
    case "ellipse":
      return gen.ellipse(s.x, s.y, s.w, s.h, opts);
    case "circle":
      return gen.circle(s.x, s.y, s.d, opts);
    case "path":
      return gen.path(s.d, opts);
    case "poly":
      return gen.polygon(s.pts, opts);
    case "lines":
      return gen.linearPath(s.pts, opts);
    case "curve":
      return gen.curve(s.pts, opts);
  }
};

// one sketched shape, drawn on over `dur` frames from `at` (p overrides the timing)
export const Sketch: React.FC<{ s: Shape; at?: number; dur?: number; p?: number; o?: SketchOpts; opacity?: number }> = ({ s, at = 0, dur = 14, p, o = {}, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const key = JSON.stringify([s, o]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const paths = useMemo(() => gen.toPaths(drawable(s, o)), [key]);
  const prog = p ?? ease(frame, [at, at + dur], [0, 1], theme.ease.soft);
  if (prog <= 0.001) return null;
  const fills = paths.filter((x) => x.fill && x.fill !== "none" && (!x.stroke || x.stroke === "none"));
  const strokes = paths.filter((x) => !fills.includes(x));
  return (
    <g opacity={opacity}>
      {/* hachure / solid fill appears after the outline is half drawn */}
      {fills.map((x, i) => (
        <path key={`f${i}`} d={x.d} fill={x.fill} stroke="none" opacity={interpolate(prog, [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      ))}
      {strokes.map((x, i) => {
        const isHatch = !!o.fill && x.stroke === o.fill && (!x.fill || x.fill === "none");
        const pp = isHatch ? interpolate(prog, [0.35, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : prog;
        return (
          <path
            key={i}
            d={x.d}
            fill={x.fill && x.fill !== "none" ? x.fill : "none"}
            stroke={x.stroke}
            strokeWidth={x.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - pp}
          />
        );
      })}
    </g>
  );
};

// full-frame SVG layer for sketches
export const Layer: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none", ...style }}>
    {children}
  </svg>
);

// hand-drawn arrow (a gentle curve + two head strokes)
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; bend?: number; at: number; dur?: number; o?: SketchOpts }> = ({ x1, y1, x2, y2, bend = 0.15, at, dur = 12, o = {} }) => {
  const frame = useCurrentFrame();
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend;
  const my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const ang = Math.atan2(y2 - my, x2 - mx);
  const L = 26;
  const h1: [number, number] = [x2 - L * Math.cos(ang - 0.45), y2 - L * Math.sin(ang - 0.45)];
  const h2: [number, number] = [x2 - L * Math.cos(ang + 0.45), y2 - L * Math.sin(ang + 0.45)];
  const p = ease(frame, [at, at + dur], [0, 1], theme.ease.soft);
  const ph = ease(frame, [at + dur * 0.8, at + dur + 5], [0, 1], theme.ease.soft);
  return (
    <>
      <Sketch s={{ k: "path", d: `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}` }} p={p} o={{ width: 4, ...o }} />
      <Sketch s={{ k: "lines", pts: [h1, [x2, y2], h2] }} p={ph} o={{ width: 4, ...o, seed: (o.seed ?? 7) + 1 }} />
    </>
  );
};

// squiggly underline under a span of text
export const Squiggle: React.FC<{ x: number; y: number; w: number; at: number; dur?: number; color?: string; seed?: number }> = ({ x, y, w, at, dur = 12, color = nb.red, seed = 3 }) => {
  const n = Math.max(3, Math.round(w / 34));
  const pts: [number, number][] = Array.from({ length: n * 2 + 1 }, (_, i) => [x + (w * i) / (n * 2), y + (i % 2 ? 7 : -5)]);
  return <Sketch s={{ k: "curve", pts }} at={at} dur={dur} o={{ color, width: 5, rough: 0.6, seed }} />;
};

// a hand-drawn circle around something
export const CircleAround: React.FC<{ x: number; y: number; w: number; h: number; at: number; dur?: number; color?: string; seed?: number }> = ({ x, y, w, h, at, dur = 14, color = nb.red, seed = 5 }) => (
  <Sketch s={{ k: "ellipse", x, y, w, h }} at={at} dur={dur} o={{ color, width: 5, rough: 1.6, bow: 2, seed }} />
);

// tick / cross marks
export const Check: React.FC<{ x: number; y: number; s?: number; at: number; color?: string }> = ({ x, y, s = 40, at, color = nb.green }) => (
  <Sketch s={{ k: "lines", pts: [[x - s * 0.5, y], [x - s * 0.1, y + s * 0.4], [x + s * 0.6, y - s * 0.55]] }} at={at} dur={8} o={{ color, width: 6, rough: 0.8 }} />
);
export const Cross: React.FC<{ x: number; y: number; s?: number; at: number; color?: string }> = ({ x, y, s = 40, at, color = nb.red }) => (
  <>
    <Sketch s={{ k: "line", x1: x - s / 2, y1: y - s / 2, x2: x + s / 2, y2: y + s / 2 }} at={at} dur={6} o={{ color, width: 6 }} />
    <Sketch s={{ k: "line", x1: x + s / 2, y1: y - s / 2, x2: x - s / 2, y2: y + s / 2 }} at={at + 5} dur={6} o={{ color, width: 6, seed: 9 }} />
  </>
);

// ---------------- handwriting ----------------
const Pencil: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block" }}>
    <g transform="rotate(-38 20 20)">
      <rect x={14} y={-6} width={12} height={34} rx={2} fill="#F4B740" stroke={nb.ink} strokeWidth={2} />
      <rect x={14} y={-10} width={12} height={6} rx={2} fill="#F28FA5" stroke={nb.ink} strokeWidth={2} />
      <path d="M14 28 L20 40 L26 28 Z" fill="#F1D7A8" stroke={nb.ink} strokeWidth={2} strokeLinejoin="round" />
      <path d="M18.2 36.4 L20 40 L21.8 36.4 Z" fill={nb.ink} />
    </g>
  </svg>
);

// text that writes itself on: clip reveal left → right at ~cps characters per second, pencil at the tip
export const Write: React.FC<{
  at: number;
  children: React.ReactNode;
  chars?: number; // length used for the speed (defaults to the string length)
  cps?: number;
  dur?: number;
  size?: number;
  color?: string;
  font?: "title" | "body";
  weight?: number;
  pencil?: boolean;
  style?: React.CSSProperties;
}> = ({ at, children, chars, cps = 26, dur, size = 56, color = nb.ink, font = "title", weight = 700, pencil = true, style }) => {
  const frame = useCurrentFrame();
  const n = chars ?? (typeof children === "string" ? children.length : 16);
  const d = dur ?? Math.max(6, Math.round((n / cps) * 30));
  const p = ease(frame, [at, at + d], [0, 1], theme.ease.soft);
  if (p <= 0) return null;
  const writing = p < 1;
  return (
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap", ...style }}>
      <span
        style={{
          display: "inline-block",
          fontFamily: font === "title" ? hand.title : hand.body,
          fontWeight: font === "title" ? weight : 400,
          fontSize: size,
          lineHeight: 1.05,
          color,
          clipPath: p >= 1 ? "none" : `inset(-30% ${(1 - p) * 100}% -40% -8%)`,
        }}
      >
        {children}
      </span>
      {pencil && writing ? (
        <span style={{ position: "absolute", left: `${p * 100}%`, top: "52%", transform: "translate(-12%, -88%)", pointerEvents: "none" }}>
          <Pencil size={size * 0.95} />
        </span>
      ) : null}
    </span>
  );
};

// absolutely positioned handwriting (centred on x unless align says otherwise)
export const WriteAt: React.FC<React.ComponentProps<typeof Write> & { x: number; y: number; align?: "left" | "center" | "right"; rot?: number }> = ({ x, y, align = "center", rot = 0, ...w }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(${align === "center" ? "-50%" : align === "right" ? "-100%" : "0"}, -50%) rotate(${rot}deg)` }}>
    <Write {...w} />
  </div>
);

// marker highlight swiped behind inline content
export const Hi: React.FC<{ at: number; color?: string; dur?: number; children: React.ReactNode; pad?: number }> = ({ at, color = nb.yellow, dur = 9, children, pad = 6 }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [at, at + dur], [0, 1], theme.ease.out);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          position: "absolute",
          left: -pad,
          right: -pad,
          top: "22%",
          bottom: "6%",
          background: color,
          opacity: 0.85,
          borderRadius: "6px 12px 8px 14px",
          transform: `scaleX(${p}) rotate(-1.2deg)`,
          transformOrigin: "left center",
          mixBlendMode: "multiply",
        }}
      />
      <span style={{ position: "relative" }}>{children}</span>
    </span>
  );
};

// ---------------- sticky note ----------------
export const Sticky: React.FC<{ x: number; y: number; w: number; h: number; at: number; rot?: number; color?: string; tape?: boolean; children: React.ReactNode; out?: number }> = ({ x, y, w, h, at, rot = -3, color = nb.sticky, tape = true, children, out }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const p = spr(at, theme.spring.snappy);
  const e = out !== undefined ? ease(frame, [out, out + 8], [0, 1]) : 0;
  if (p <= 0.001 || e >= 0.999) return null;
  const k = Math.min(1, p);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `translate(-50%, -50%) rotate(${rot + (1 - k) * 8}deg) scale(${interpolate(k, [0, 1], [1.25, 1]) * (1 - e * 0.1)})`,
        opacity: Math.min(1, p * 2) * (1 - e),
        background: `linear-gradient(170deg, ${color} 0%, ${color} 82%, rgba(0,0,0,0.04) 100%)`,
        boxShadow: `0 ${18 * k}px ${30 * k}px -14px rgba(60, 40, 10, 0.45), 0 2px 4px rgba(60,40,10,0.15)`,
        borderRadius: "3px 3px 18px 3px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      {tape ? <div style={{ position: "absolute", top: -18, left: "50%", width: 120, height: 36, transform: "translateX(-50%) rotate(2deg)", background: "rgba(235, 228, 205, 0.75)", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }} /> : null}
      {children}
    </div>
  );
};

// rubber stamp (e.g. SPAM, YOUR TURN): thuds in, slightly rotated, ink texture
export const Stamp: React.FC<{ x: number; y: number; at: number; color?: string; rot?: number; size?: number; children: React.ReactNode }> = ({ x, y, at, color = nb.red, rot = -8, size = 44, children }) => {
  const spr = useSpr();
  const p = spr(at, theme.spring.pop);
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${interpolate(Math.min(1, p), [0, 1], [2.2, 1])})`,
        opacity: Math.min(1, p * 2) * 0.88,
        padding: "6px 22px",
        border: `5px solid ${color}`,
        borderRadius: 10,
        color,
        fontFamily: hand.body,
        fontSize: size,
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
        mixBlendMode: "multiply",
        maskImage: "radial-gradient(circle at 30% 40%, black 60%, rgba(0,0,0,0.7) 100%)",
      }}
    >
      {children}
    </div>
  );
};

// scene header: a small pen-written label with a wavy underline, top of the page
export const Header: React.FC<{ text: string; at?: number; color?: string; y?: number }> = ({ text, at = 2, color = nb.blue, y = 250 }) => (
  <>
    <WriteAt x={540} y={y} at={at} size={46} color={color} font="body" cps={40} pencil={false}>
      {text}
    </WriteAt>
    <Layer>
      <Squiggle x={540 - text.length * 10} y={y + 34} w={text.length * 20} at={at + 8} color={color} seed={text.length} />
    </Layer>
  </>
);
