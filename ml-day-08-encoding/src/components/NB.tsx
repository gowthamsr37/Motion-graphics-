// NOTEBOOK KIT (100 Days of ML). Everything looks hand-made on cream lined paper:
// - Paper: ruled lines, red margin, punched holes, fibre texture, soft vignette
// - Sketch: rough.js shapes (line, rect, ellipse, circle, path, polygon, arrow) that DRAW ON like a pen
// - Write: handwriting that writes itself left → right, with a pencil riding the tip
// - Hi: a marker highlight swiped behind words
// - Sticky: a sticky note dropped onto the page (with tape)
// All draw-ons take an `at` frame and a `dur` in frames.
import React, { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import rough from "roughjs";
import { ease, useSpr } from "./Motion";
import { alpha, glowText, hand, nb, STYLE, theme } from "../theme";

const TS = (hand as { titleScale?: number }).titleScale ?? 1;
const BS = (hand as { bodyScale?: number }).bodyScale ?? 1;
const TW = (hand as { titleWeight?: number }).titleWeight ?? 700;
const BW = (hand as { bodyWeight?: number }).bodyWeight ?? 400;

const gen = rough.generator();

// ---------------- paper ----------------
export const RULE_GAP = 64;
export const MARGIN_X = 118;

const NotebookPaper: React.FC<{ seed?: number }> = ({ seed = 1 }) => (
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

// green slate board: chalk-dust texture, faint ghosts of erased writing, a wooden frame and the chalk tray
const ChalkBoard: React.FC<{ seed?: number }> = ({ seed = 1 }) => (
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 45% 35%, #2E4A3A 0%, #23392C 55%, #19291F 100%)", overflow: "hidden" }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.5, mixBlendMode: "screen" }}>
      <filter id={`dust${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={3} seed={seed} />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.22 -0.05" />
      </filter>
      <rect width={1080} height={1920} filter={`url(#dust${seed})`} />
    </svg>
    {/* ghosts of erased chalk */}
    {[0, 1, 2, 3].map((i) => {
      const x = ((seed * 271 + i * 389) % 900) + 90;
      const y = ((seed * 193 + i * 457) % 1500) + 200;
      return <div key={i} style={{ position: "absolute", left: x - 260, top: y - 90, width: 520, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.045)", filter: "blur(28px)", transform: `rotate(${(i * 37 + seed * 11) % 30 - 15}deg)` }} />;
    })}
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.38) 100%)" }} />
    {/* wooden frame + tray */}
    <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 16px #6E4523, inset 0 0 0 20px #4E2F16, inset 0 0 30px 22px rgba(0,0,0,0.45)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 46, background: "linear-gradient(#8A5A2E, #5E3B1A)", boxShadow: "0 -6px 12px rgba(0,0,0,0.45)" }} />
    <div style={{ position: "absolute", left: 120, bottom: 28, width: 84, height: 16, borderRadius: 5, background: "#F4F1E8", transform: "rotate(-6deg)", boxShadow: "0 2px 3px rgba(0,0,0,0.4)" }} />
    <div style={{ position: "absolute", left: 240, bottom: 26, width: 60, height: 15, borderRadius: 5, background: "#FFB3D1", transform: "rotate(4deg)" }} />
    <div style={{ position: "absolute", left: 760, bottom: 22, width: 140, height: 34, borderRadius: 6, background: "#3A3A3A", boxShadow: "inset 0 -12px #D6C6A8, 0 3px 4px rgba(0,0,0,0.5)" }} />
  </div>
);

// comic page: cream paper with halftone dots and one big thick-bordered panel
export const PANEL = { x: 28, y: 168, w: 1024, h: 1210 };
const ComicPage: React.FC<{ seed?: number }> = () => (
  <div style={{ position: "absolute", inset: 0, background: nb.paper, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(246,170,40,0.45) 2.4px, transparent 2.9px)", backgroundSize: "16px 16px", opacity: 0.5 }} />
    <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, background: "#FFFDF4", border: "7px solid #111", boxSizing: "border-box", boxShadow: "10px 10px 0 #111" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(25,113,194,0.10) 2px, transparent 2.6px)", backgroundSize: "14px 14px" }} />
    </div>
    <div style={{ position: "absolute", left: 40, top: 70, padding: "6px 18px", background: nb.yellow, border: "5px solid #111", boxShadow: "6px 6px 0 #111", fontFamily: hand.title, fontSize: 40, letterSpacing: "0.06em", color: "#111", transform: "rotate(-2deg)" }}>100 DAYS OF ML</div>
    <div style={{ position: "absolute", right: 40, top: 76, fontFamily: hand.title, fontSize: 40, letterSpacing: "0.06em", color: "#111" }}>ISSUE #1</div>
  </div>
);

export const Paper: React.FC<{ seed?: number }> = ({ seed = 1 }) => (STYLE === "navy" ? null : STYLE === "chalk" ? <ChalkBoard seed={seed} /> : STYLE === "comic" ? <ComicPage seed={seed} /> : <NotebookPaper seed={seed} />);

// chalk grain filter (referenced by url(#chalkfx) from strokes and letters); render once per frame
export const ChalkDefs: React.FC = () =>
  STYLE === "chalk" ? (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <filter id="chalktext" x="-5%" y="-20%" width="110%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves={2} seed={9} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -0.7 1.3" result="m" />
        <feComposite in="SourceGraphic" in2="m" operator="in" />
      </filter>
      <filter id="chalkfx" x="-5%" y="-20%" width="110%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="1.35" numOctaves={2} seed={4} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.7 1.6" result="m" />
        <feComposite in="SourceGraphic" in2="m" operator="in" result="g" />
        <feGaussianBlur in="g" stdDeviation="0.5" />
      </filter>
    </svg>
  ) : null;

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
    roughness: STYLE === "comic" || STYLE === "navy" ? Math.min(0.45, (o.rough ?? 1.1) * 0.35) : STYLE === "chalk" ? (o.rough ?? 1.1) * 1.15 : o.rough ?? 1.1,
    bowing: STYLE === "comic" || STYLE === "navy" ? 0.4 : o.bow ?? 1,
    stroke: o.color ?? nb.ink,
    strokeWidth: STYLE === "navy" ? Math.max(3.5, (o.width ?? 4) * 1.15) : STYLE === "comic" ? Math.max(4, (o.width ?? 4) * 1.5) : STYLE === "chalk" ? (o.width ?? 4) + 1 : o.width ?? 4,
    fill: o.fill,
    fillStyle: STYLE === "comic" || STYLE === "navy" ? "solid" : o.fillStyle ?? "hachure",
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
  const prog = p ?? ease(frame, [at, at + (STYLE === "comic" || STYLE === "navy" ? Math.max(4, dur * 0.7) : dur)], [0, 1], theme.ease.soft);
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
    {STYLE === "chalk" ? <g filter="url(#chalkfx)">{children}</g> : STYLE === "navy" ? <g style={{ filter: "drop-shadow(0 0 6px rgba(120,170,255,0.25))" }}>{children}</g> : children}
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
const ChalkStick: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block" }}>
    <g transform="rotate(-38 20 20)">
      <rect x={15} y={0} width={10} height={36} rx={3} fill="#F4F1E8" stroke="rgba(0,0,0,0.25)" strokeWidth={1} />
      <rect x={15} y={30} width={10} height={6} rx={2} fill="#E6E1D3" />
    </g>
  </svg>
);
const Pencil0: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block" }}>
    <g transform="rotate(-38 20 20)">
      <rect x={14} y={-6} width={12} height={34} rx={2} fill="#F4B740" stroke={nb.ink} strokeWidth={2} />
      <rect x={14} y={-10} width={12} height={6} rx={2} fill="#F28FA5" stroke={nb.ink} strokeWidth={2} />
      <path d="M14 28 L20 40 L26 28 Z" fill="#F1D7A8" stroke={nb.ink} strokeWidth={2} strokeLinejoin="round" />
      <path d="M18.2 36.4 L20 40 L21.8 36.4 Z" fill={nb.ink} />
    </g>
  </svg>
);

const Pencil: React.FC<{ size: number }> = ({ size }) => (STYLE === "chalk" ? <ChalkStick size={size} /> : <Pencil0 size={size} />);

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
}> = ({ at, children, chars, cps = 26, dur, size = 56, color = nb.ink, font = "title", pencil = true, style }) => {
  const frame = useCurrentFrame();
  const n = chars ?? (typeof children === "string" ? children.length : 16);
  const d = dur ?? Math.max(6, Math.round((n / cps) * 30));
  const fs = size * (font === "title" ? TS : BS);
  const base: React.CSSProperties = {
    display: "inline-block",
    fontFamily: font === "title" ? hand.title : hand.body,
    fontWeight: font === "title" ? TW : BW,
    fontSize: fs,
    lineHeight: 1.05,
    color,
    letterSpacing: STYLE === "comic" && font === "title" ? "0.03em" : undefined,
  };
  if (STYLE === "comic" || STYLE === "navy") {
    // comic lettering pops in (overshoot) instead of being written
    const p = ease(frame, [at, at + Math.min(10, Math.max(6, d * 0.5))], [0, 1], Easing.bezier(0.34, 1.7, 0.64, 1));
    if (p <= 0) return null;
    const colored = font === "title" && color !== nb.ink;
    return (
      <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap", transform: `scale(${0.5 + 0.5 * p}) rotate(${(1 - p) * -6}deg)`, opacity: Math.min(1, p * 2), transformOrigin: "30% 60%", ...style }}>
        <span style={{ ...base, letterSpacing: STYLE === "navy" && font === "title" ? "-0.02em" : base.letterSpacing, WebkitTextStroke: STYLE === "comic" && colored ? `${Math.max(2, fs * 0.035)}px #111` : undefined, textShadow: STYLE === "navy" ? (font === "title" && color !== nb.ink ? glowText(color, 0.55) : "0 2px 10px rgba(0,0,0,0.45)") : colored ? `${fs * 0.05}px ${fs * 0.05}px 0 #111` : undefined, paintOrder: "stroke fill" }}>{children}</span>
      </span>
    );
  }
  const p = ease(frame, [at, at + d], [0, 1], theme.ease.soft);
  if (p <= 0) return null;
  const writing = p < 1;
  return (
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap", ...style }}>
      <span
        style={{
          ...base,
          clipPath: p >= 1 ? "none" : `inset(-30% ${(1 - p) * 100}% -40% -8%)`,
          filter: STYLE === "chalk" ? "url(#chalktext)" : undefined,
          textShadow: STYLE === "chalk" ? "0 0 2px rgba(255,255,255,0.5), 0 2px 6px rgba(0,0,0,0.75), 0 0 16px rgba(0,0,0,0.45)" : undefined,
        }}
      >
        {children}
      </span>
      {pencil && writing ? (
        <span style={{ position: "absolute", left: `${p * 100}%`, top: "52%", transform: "translate(-12%, -88%)", pointerEvents: "none" }}>
          <Pencil size={fs * 0.95} />
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
          top: STYLE === "chalk" || STYLE === "navy" ? "96%" : "22%",
          bottom: STYLE === "chalk" ? "-6%" : STYLE === "navy" ? "-5%" : "6%",
          background: color,
          opacity: STYLE === "chalk" ? 0.95 : STYLE === "comic" || STYLE === "navy" ? 1 : 0.85,
          borderRadius: STYLE === "comic" ? 2 : "6px 12px 8px 14px",
          transform: `scaleX(${p}) rotate(${STYLE === "comic" ? -1 : -1.2}deg)`,
          transformOrigin: "left center",
          mixBlendMode: STYLE === "chalk" || STYLE === "navy" ? "normal" : "multiply",
          boxShadow: STYLE === "navy" ? `0 0 12px ${alpha(color, 0.8)}` : undefined,
          filter: STYLE === "chalk" ? "url(#chalkfx)" : undefined,
          border: STYLE === "comic" ? "3px solid #111" : undefined,
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
        background: STYLE === "navy" ? `linear-gradient(180deg, ${alpha(color, 0.16)}, rgba(14,24,64,0.92))` : STYLE === "chalk" ? "rgba(255,255,255,0.045)" : STYLE === "comic" ? color : `linear-gradient(170deg, ${color} 0%, ${color} 82%, rgba(0,0,0,0.04) 100%)`,
        boxShadow: STYLE === "navy" ? `0 0 26px ${alpha(color, 0.28)}, 0 18px 40px -20px rgba(0,0,0,0.8)` : STYLE === "chalk" ? "none" : STYLE === "comic" ? "8px 8px 0 #111" : `0 ${18 * k}px ${30 * k}px -14px rgba(60, 40, 10, 0.45), 0 2px 4px rgba(60,40,10,0.15)`,
        border: STYLE === "navy" ? `3px solid ${alpha(color, 0.85)}` : STYLE === "comic" ? "5px solid #111" : undefined,
        borderRadius: STYLE === "navy" ? 24 : STYLE === "comic" ? 4 : "3px 3px 18px 3px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      {STYLE === "chalk" ? (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: "url(#chalkfx)" }}>
          <Sketch s={{ k: "rect", x: 4, y: 4, w: w - 8, h: h - 8 }} p={Math.min(1, p * 1.3)} o={{ color, width: 4, seed: Math.round(w + h) }} />
        </svg>
      ) : null}
      {STYLE === "chalk" && tape ? <div style={{ position: "absolute", top: -14, left: "50%", width: 30, height: 30, borderRadius: 15, transform: "translateX(-50%)", background: `radial-gradient(circle at 35% 35%, #fff, ${color} 45%, rgba(0,0,0,0.5) 100%)`, boxShadow: "0 3px 5px rgba(0,0,0,0.5)" }} /> : null}
      {STYLE === "notebook" && tape ? <div style={{ position: "absolute", top: -18, left: "50%", width: 120, height: 36, transform: "translateX(-50%) rotate(2deg)", background: "rgba(235, 228, 205, 0.75)", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }} /> : null}
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
        border: STYLE === "comic" ? "6px solid #111" : STYLE === "navy" ? `3px solid ${color}` : `5px solid ${color}`,
        borderRadius: STYLE === "comic" ? 6 : STYLE === "navy" ? 999 : 10,
        background: STYLE === "comic" ? "#FFFFFF" : STYLE === "navy" ? alpha(color, 0.16) : undefined,
        boxShadow: STYLE === "comic" ? "6px 6px 0 #111" : STYLE === "navy" ? `0 0 22px ${alpha(color, 0.45)}` : undefined,
        fontWeight: STYLE === "navy" ? 800 : undefined,
        filter: STYLE === "chalk" ? "url(#chalktext)" : undefined,
        color,
        fontFamily: STYLE === "comic" || STYLE === "navy" ? hand.title : hand.body,
        fontSize: size * (STYLE === "comic" ? 1.05 : STYLE === "navy" ? 0.72 : BS),
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
        mixBlendMode: STYLE === "notebook" ? "multiply" : "normal",
        maskImage: STYLE === "notebook" ? "radial-gradient(circle at 30% 40%, black 60%, rgba(0,0,0,0.7) 100%)" : undefined,
      }}
    >
      {children}
    </div>
  );
};

// scene header: a small pen-written label with a wavy underline, top of the page
export const Header: React.FC<{ text: string; at?: number; color?: string; y?: number }> = ({ text, at = 2, color = nb.blue, y = 250 }) =>
  STYLE === "navy" ? <NavyHeader text={text} at={at} color={color} y={y} /> : STYLE === "comic" ? <ComicHeader text={text} at={at} color={color} y={y} /> : <PenHeader text={text} at={at} color={color} y={y} />;

// house scene label: small caps, letter-spaced, with a short glowing bar under it
const NavyHeader: React.FC<{ text: string; at: number; color: string; y: number }> = ({ text, at, color, y }) => {
  const spr = useSpr();
  const p = spr(at, theme.spring.smooth);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y - 10, textAlign: "center", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - Math.min(1, p)) * 20}px)` }}>
      <div style={{ fontFamily: hand.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.24em", color: nb.pencil, textTransform: "uppercase" }}>{text}</div>
      <div style={{ margin: "14px auto 0", width: 90 * Math.min(1, p), height: 5, borderRadius: 3, background: color, boxShadow: `0 0 14px ${color}` }} />
    </div>
  );
};

// comic narration box, top-left of the panel
const ComicHeader: React.FC<{ text: string; at: number; color: string; y: number }> = ({ text, at, y }) => {
  const spr = useSpr();
  const p = spr(at, theme.spring.pop);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 60, top: y - 30, transform: `scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, transformOrigin: "left center", opacity: Math.min(1, p * 2), padding: "6px 20px", background: nb.yellow, border: "5px solid #111", boxShadow: "6px 6px 0 #111", fontFamily: hand.title, fontSize: 44, letterSpacing: "0.05em", color: "#111", whiteSpace: "nowrap", textTransform: "uppercase" }}>
      {text}
    </div>
  );
};

const PenHeader: React.FC<{ text: string; at: number; color: string; y: number }> = ({ text, at, color, y }) => (

  <>
    <WriteAt x={540} y={y} at={at} size={46} color={color} font="body" cps={40} pencil={false}>
      {text}
    </WriteAt>
    <Layer>
      <Squiggle x={540 - text.length * 10} y={y + 34} w={text.length * 20} at={at + 8} color={color} seed={text.length} />
    </Layer>
  </>
);

// a puff of chalk dust (e.g. when the title hits the board on frame 0)
export const ChalkDust: React.FC<{ x: number; y: number; at: number; count?: number; spread?: number; w?: number; seed?: number }> = ({ x, y, at, count = 46, spread = 220, w = 500, seed = 3 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 40) return null;
  let a = seed * 9301 + 49297;
  const r = () => {
    a = (a * 16807) % 2147483647;
    return a / 2147483647;
  };
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const ox = (r() - 0.5) * w;
        const ang = r() * Math.PI * 2;
        const dist = (0.3 + r()) * spread;
        const sz = 3 + r() * 9;
        const delay = r() * 6;
        const k = Math.max(0, Math.min(1, (t - delay) / 34));
        const e = 1 - Math.pow(1 - k, 3);
        const px = x + ox + Math.cos(ang) * dist * e;
        const py = y + Math.sin(ang) * dist * e * 0.6 - 30 * e;
        return <div key={i} style={{ position: "absolute", left: px, top: py, width: sz, height: sz, borderRadius: "50%", background: "#FFFFFF", opacity: (k > 0 ? 1 - k : 0) * 0.7, filter: `blur(${1 + sz * 0.15}px)` }} />;
      })}
      <div style={{ position: "absolute", left: x - w * 0.6, top: y - 90, width: w * 1.2, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.16)", filter: "blur(30px)", opacity: Math.max(0, 1 - t / 30) }} />
    </>
  );
};
