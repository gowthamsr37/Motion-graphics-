// The File — editorial kit: type helpers, paper, grain, masthead, captions, scene shell, seam, the giant glyph, cut-outs, seam wipe.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { config } from "../config";
import { theme } from "../theme";
import { captionWords } from "../timing";

const C = theme.colors;
export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const fade = (f: number, at: number, len = 10) => interpolate(f, [at, at + len], [0, 1], CLAMP);
export const useP = (at: number, cfg: { damping: number; stiffness: number; mass: number } = theme.spring.pop) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: cfg });
};

/* ---------- type ---------- */
export const Disp: React.FC<{ size: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ size, color = C.ink, style, children }) => (
  <span style={{ fontFamily: theme.fonts.display, fontSize: size, lineHeight: 0.92, color, textTransform: "uppercase", letterSpacing: "0.005em", ...style }}>{children}</span>
);
export const Serif: React.FC<{ size: number; color?: string; weight?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ size, color = C.ink, weight = 700, style, children }) => (
  <span style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontWeight: weight, fontSize: size, lineHeight: 1.05, color, ...style }}>{children}</span>
);
export const Label: React.FC<{ size?: number; color?: string; weight?: number; spacing?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ size = 22, color = C.ink2, weight = 800, spacing = "0.16em", style, children }) => (
  <span style={{ fontFamily: theme.fonts.body, fontWeight: weight, fontSize: size, letterSpacing: spacing, textTransform: "uppercase", color, lineHeight: 1.15, ...style }}>{children}</span>
);

/* ---------- paper ---------- */
export const Paper: React.FC<{ warm?: number }> = ({ warm = 0 }) => {
  const frame = useCurrentFrame();
  const lx = 50 + Math.sin(frame / 160) * 8;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(90% 70% at ${lx}% 35%, ${C.paperHi} 0%, ${C.paper} 55%, ${C.paperLo} 100%)` }}>
      <AbsoluteFill style={{ opacity: 0.35, mixBlendMode: "multiply" }}>
        <svg width="1080" height="1920">
          <filter id="fib">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.18" numOctaves="2" seed="7" />
            <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.5  0 0 0 0 0.42  0 0 0 0.35 0" />
          </filter>
          <rect width="1080" height="1920" filter="url(#fib)" />
        </svg>
      </AbsoluteFill>
      {warm > 0 && <AbsoluteFill style={{ background: C.accent, opacity: warm * 0.08, mixBlendMode: "multiply" }} />}
    </AbsoluteFill>
  );
};

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.07, mixBlendMode: "multiply" }}>
      <svg width="1080" height="1920">
        <filter id="gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 9} />
        </filter>
        <rect width="1080" height="1920" filter="url(#gr)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(120% 85% at 50% 45%, rgba(0,0,0,0) 60%, rgba(60,45,20,0.18) 100%)" }} />;

/* ---------- the seam: a red-ball seam line, stitched ---------- */
export const Seam: React.FC<{ x: number; y: number; w: number; p?: number; dotted?: [number, number]; color?: string }> = ({ x, y, w, p = 1, dotted, color = C.red }) => {
  const n = Math.floor(w / 18);
  return (
    <svg width={w} height={30} style={{ position: "absolute", left: x, top: y - 15, overflow: "visible" }}>
      <line x1={0} x2={w * p} y1={15} y2={15} stroke={color} strokeWidth={3} strokeDasharray={dotted ? "2 10" : undefined} />
      {Array.from({ length: n }).map((_, i) => {
        const xx = i * 18 + 9;
        if (xx > w * p) return null;
        if (dotted && xx > dotted[0] && xx < dotted[1]) return null;
        return (
          <g key={i} stroke={color} strokeWidth={2.2} strokeLinecap="round">
            <line x1={xx - 4} y1={6} x2={xx + 4} y2={12} />
            <line x1={xx - 4} y1={24} x2={xx + 4} y2={18} />
          </g>
        );
      })}
    </svg>
  );
};

/* ---------- masthead with a progress seam ---------- */
export const Masthead: React.FC<{ end: number; hideAfter: number }> = ({ end, hideAfter }) => {
  const frame = useCurrentFrame();
  const on = interpolate(frame, [0, 10, hideAfter - 8, hideAfter], [0, 1, 1, 0], CLAMP);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 150, opacity: on, zIndex: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Label size={22} color={C.ink} weight={900} spacing="0.2em">
          {config.series}
        </Label>
        <Serif size={30} color={C.accent} weight={900}>
          {config.file}
        </Serif>
      </div>
      <div style={{ position: "relative", height: 24, marginTop: 8 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 11, height: 2, background: C.line }} />
        <Seam x={0} y={12} w={960} p={interpolate(frame, [0, end], [0, 1], CLAMP)} />
      </div>
    </div>
  );
};

/* ---------- editorial karaoke captions ---------- */
export const Captions: React.FC<{ hiddenRanges: [number, number][]; top?: number; left?: number; right?: number; size?: number }> = ({ hiddenRanges, top = 1340, left = 70, right = 70, size = 56 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = captionWords(fps);
  const chunks: { words: typeof words; from: number; to: number }[] = [];
  let cur: typeof words = [];
  words.forEach((w, i) => {
    cur.push(w);
    const nxt = words[i + 1];
    if (/[.,?:!]$/.test(w.t) || cur.length >= 5 || !nxt || nxt.seg !== w.seg) {
      chunks.push({ words: cur, from: cur[0].from, to: nxt && nxt.seg === w.seg ? nxt.from : cur[cur.length - 1].to + 6 });
      cur = [];
    }
  });
  const ch = chunks.find((c) => frame >= c.from - 1 && frame < c.to);
  if (!ch || hiddenRanges.some(([a, b]) => ch.from >= a && ch.from < b)) return null;
  const pop = spring({ frame: frame - ch.from + 1, fps, config: theme.spring.pop });
  return (
    <div style={{ position: "absolute", left, right, top, height: 140, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 45 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 14px", transform: `translateY(${interpolate(pop, [0, 1], [18, 0])}px)`, opacity: interpolate(pop, [0, 0.3], [0, 1], CLAMP) }}>
        {ch.words.map((w, i) => {
          const active = frame >= w.from && (i + 1 < ch.words.length ? frame < ch.words[i + 1].from : true);
          const hl = interpolate(frame, [w.from, w.from + 4], [0, 1], CLAMP) * (active ? 1 : 0);
          const num = /\d/.test(w.t);
          return (
            <span key={i} style={{ position: "relative", display: "inline-block", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, lineHeight: 1.15, letterSpacing: "-0.01em", color: num ? C.accent : C.ink }}>
              <span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: "42%", background: C.accentSoft, transformOrigin: "0% 50%", transform: `scaleX(${hl})`, borderRadius: 4, zIndex: -1 }} />
              {w.t}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- scene shell ---------- */
export const Shell: React.FC<{ children: React.ReactNode; enter?: boolean; exit?: boolean; drift?: number }> = ({ children, enter = true, exit = true, drift = 0.02 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = enter ? interpolate(frame, [0, 12], [0, 1], { easing: theme.ease.out, ...CLAMP }) : 1;
  const outP = exit ? interpolate(frame, [durationInFrames - 8, durationInFrames], [0, 1], { easing: theme.ease.in, ...CLAMP }) : 0;
  const t = interpolate(frame, [0, durationInFrames], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{ opacity: inP * (1 - outP), transform: `translateY(${(1 - inP) * 50 - outP * 30}px) scale(${1 + drift * t})` }}>
      {children}
    </AbsoluteFill>
  );
};

/* ---------- the giant glyph: outline draws on, then fills with colour or a photo ---------- */
// The box is size×0.62 wide (one Anton numeral); the glyph spans roughly y → y + 0.88×size. Use `width` for wider strings.
export const BigGlyph: React.FC<{ char?: string; x: number; y: number; size: number; draw: number; fill?: number; fillColor?: string; stroke?: string; photo?: string; photoPos?: string; width?: number }> = ({ char = "3", x, y, size, draw, fill = 0, fillColor = C.accent, stroke = C.ink, photo, photoPos = "50% 30%", width }) => {
  const w = width ?? size * 0.62, h = size * 1.0;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {photo && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            fontFamily: theme.fonts.display,
            fontSize: size,
            lineHeight: `${h}px`,
            textAlign: "center",
            color: "transparent",
            backgroundImage: `url(${staticFile(`photos/${photo}`)})`,
            backgroundSize: "cover",
            backgroundPosition: photoPos,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            opacity: fill,
          }}
        >
          {char}
        </div>
      )}
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <text x={w / 2} y={h * 0.86} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={size} fill={photo ? "none" : fillColor} fillOpacity={photo ? 0 : fill} stroke={stroke} strokeWidth={4} strokeDasharray="9000" strokeDashoffset={9000 * (1 - draw)} strokeLinejoin="round">
          {char}
        </text>
      </svg>
    </div>
  );
};

export const Big3 = BigGlyph;

/* ---------- cut-out photo with a soft shadow. fadeBottom (0–1) softens a waist-cropped edge ---------- */
export const Cutout: React.FC<{ src: string; x: number; y: number; h: number; at: number; from?: "bottom" | "right" | "left"; fadeBottom?: number; style?: React.CSSProperties }> = ({ src, x, y, h, at, from = "bottom", fadeBottom, style }) => {
  const frame = useCurrentFrame();
  const p = useP(at, theme.spring.heavy);
  if (frame < at) return null;
  const dx = from === "right" ? (1 - p) * 160 : from === "left" ? -(1 - p) * 160 : 0;
  const dy = from === "bottom" ? (1 - p) * 140 : 0;
  return (
    <Img
      src={staticFile(`photos/${src}`)}
      style={{ position: "absolute", left: x, top: y, height: h, transform: `translate(${dx}px, ${dy}px)`, opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP), filter: "drop-shadow(0 24px 30px rgba(40,30,10,0.28))", ...(fadeBottom !== undefined ? { WebkitMaskImage: `linear-gradient(to bottom, #000 ${fadeBottom * 100}%, transparent 100%)`, maskImage: `linear-gradient(to bottom, #000 ${fadeBottom * 100}%, transparent 100%)` } : {}), ...style }}
    />
  );
};

/* ---------- a red seam sweeping across the cut between scenes ---------- */
export const SeamWipe: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const u = (frame - (at - 8)) / 16;
  if (u < 0 || u > 1) return null;
  const x = interpolate(u, [0, 1], [-1200, 1200], { easing: theme.ease.inOut });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 60 }}>
      <div style={{ position: "absolute", left: x, top: 0, width: 1080, height: 1920, background: `linear-gradient(90deg, rgba(242,237,227,0) 0%, ${C.paper} 30%, ${C.paper} 70%, rgba(242,237,227,0) 100%)` }} />
      <div style={{ position: "absolute", left: x + 540, top: 0, width: 4, height: 1920, background: C.red }} />
    </AbsoluteFill>
  );
};
