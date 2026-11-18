// Notebook building blocks: backdrop, grade/grain/vignette, header, step rail, cells, typed code, captions.
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, Tone, tone } from "../theme";
import { captionWords, captions } from "../timing";
import { CLAMP, useSpring } from "./Motion";

const C = theme.colors;

// ---------- layer 1: background ----------
export const Backdrop: React.FC<{ pulse?: number }> = ({ pulse = 0 }) => {
  const frame = useCurrentFrame();
  const bx = Math.sin(frame / 140) * 80;
  const by = Math.cos(frame / 170) * 60;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 700px at ${300 + bx}px ${420 + by}px, rgba(92,200,255,${0.1 + pulse * 0.08}), transparent 70%),
            radial-gradient(800px 800px at ${820 - bx}px ${1450 - by}px, rgba(183,155,255,0.08), transparent 70%),
            linear-gradient(180deg, ${C.bgHi} 0%, ${C.bg} 55%)`,
        }}
      />
      {/* dot grid, slowly drifting like graph paper under the notebook */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(rgba(148,170,205,0.16) 1.4px, transparent 1.6px)`,
          backgroundSize: "36px 36px",
          backgroundPosition: `${(frame * 0.12) % 36}px ${(frame * 0.2) % 36}px`,
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 30%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 30%, transparent 85%)",
        }}
      />
      <FloatingDigits />
    </AbsoluteFill>
  );
};

// Faint numbers drifting upward behind everything (data texture).
const FloatingDigits: React.FC = () => {
  const frame = useCurrentFrame();
  const items = Array.from({ length: 22 }, (_, i) => i);
  return (
    <AbsoluteFill style={{ fontFamily: theme.fonts.mono, color: C.cyan }}>
      {items.map((i) => {
        const x = random(`x${i}`) * 1040;
        const speed = 0.25 + random(`s${i}`) * 0.4;
        const y = 1960 - ((frame * speed + random(`y${i}`) * 2000) % 2100);
        const txt = ["0.50", "p<.05", "n=7965", "σ", "0.509", "H₀", "μ", "1244", "CI", "r=-.09", "0.98", "Σ"][i % 12];
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, fontSize: 18 + random(`f${i}`) * 10, opacity: 0.05 + random(`o${i}`) * 0.05 }}>
            {txt}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- layers 4–5: grade, grain, vignette ----------
export const Grade: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "linear-gradient(180deg, rgba(40,80,140,0.06), rgba(0,0,0,0) 40%, rgba(60,30,90,0.07))",
      mixBlendMode: "screen",
    }}
  />
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 8;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.07, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse 75% 65% at 50% 46%, transparent 55%, rgba(0,0,0,0.6) 100%)" }} />
);

export const FadeEdges: React.FC<{ fadeIn: number; fadeOut: number; total: number }> = ({ fadeIn, fadeOut, total }) => {
  const frame = useCurrentFrame();
  const o = Math.max(
    interpolate(frame, [0, fadeIn], [1, 0], { easing: theme.ease.out, ...CLAMP }),
    interpolate(frame, [total - fadeOut, total], [0, 1], { easing: theme.ease.in, ...CLAMP }),
  );
  return <AbsoluteFill style={{ background: C.black, opacity: o, pointerEvents: "none" }} />;
};

// ---------- header + step rail ----------
export const Header: React.FC<{ hideAt: number }> = ({ hideAt }) => {
  const frame = useCurrentFrame();
  const p = useSpring(4, theme.spring.smooth);
  const out = interpolate(frame, [hideAt, hideAt + 10], [1, 0], { easing: theme.ease.in, ...CLAMP });
  const dot = (c: string) => <div style={{ width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.85 }} />;
  return (
    <div
      style={{
        position: "absolute",
        left: 48,
        right: 48,
        top: 120,
        height: 72,
        borderRadius: 16,
        background: `linear-gradient(180deg, ${C.panelHi}, ${C.panel})`,
        boxShadow: `inset 0 0 0 1.5px ${C.edge}, 0 18px 40px rgba(0,0,0,0.35)`,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 12,
        opacity: p * out,
        transform: `translateY(${interpolate(p, [0, 1], [-30, 0])}px)`,
      }}
    >
      {dot(C.coral)}
      {dot(C.amber)}
      {dot(C.green)}
      <div style={{ marginLeft: 14, fontFamily: theme.fonts.mono, fontSize: 24, color: C.text, fontWeight: 500 }}>toss_analysis.ipynb</div>
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: theme.fonts.display, fontSize: 21, letterSpacing: "0.16em", color: C.dim, fontWeight: 600 }}>
        BEYOND THE SCOREBOARD <span style={{ color: C.cyan }}>· DATA LAB #01</span>
      </div>
    </div>
  );
};

export const STEPS = ["QUESTION", "DATA", "HYPOTHESIS", "NOISE", "TEST", "PITFALLS", "SEGMENTS", "VERDICT"] as const;

export const StepRail: React.FC<{ marks: number[]; hideAt: number }> = ({ marks, hideAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSpring(10, theme.spring.smooth);
  const out = interpolate(frame, [hideAt, hideAt + 10], [1, 0], { easing: theme.ease.in, ...CLAMP });
  let active = 0;
  marks.forEach((m, i) => {
    if (frame >= m) active = i;
  });
  return (
    <div style={{ position: "absolute", left: 48, right: 48, top: 212, display: "flex", gap: 8, opacity: p * out }}>
      {STEPS.map((s, i) => {
        const on = i === active;
        const done = i < active;
        const t = interpolate(frame, [marks[i], marks[i] + fps * 0.4], [0, 1], { easing: theme.ease.out, ...CLAMP });
        return (
          <div key={s} style={{ flex: on ? 2.4 : 1, transition: "none" }}>
            <div style={{ height: 6, borderRadius: 3, background: C.grid, overflow: "hidden" }}>
              <div style={{ width: `${(done ? 1 : on ? t : 0) * 100}%`, height: "100%", background: on ? C.cyan : C.dim }} />
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: theme.fonts.mono,
                fontSize: 17,
                letterSpacing: "0.08em",
                color: on ? C.cyan : done ? C.dim : C.faint,
                fontWeight: on ? 700 : 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {on ? `${String(i).padStart(2, "0")} ${s}` : String(i).padStart(2, "0")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------- cells ----------
export const Cell: React.FC<{
  n: number | string;
  delay?: number;
  exitAt?: number;
  kind?: "In" | "Out" | "md";
  style?: React.CSSProperties;
  glowTone?: Tone;
  children: React.ReactNode;
}> = ({ n, delay = 0, exitAt, kind = "In", style, glowTone, children }) => {
  const frame = useCurrentFrame();
  const p = useSpring(delay, theme.spring.smooth);
  const out = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 10], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const label = kind === "md" ? "" : `${kind} [${n}]:`;
  return (
    <div
      style={{
        position: "relative",
        opacity: interpolate(p, [0, 1], [0, 1], CLAMP) * (1 - out),
        transform: `translateY(${interpolate(p, [0, 1], [50, 0]) - out * 30}px) scale(${interpolate(p, [0, 1], [0.96, 1]) - out * 0.03})`,
        ...style,
      }}
    >
      {label && (
        <div style={{ fontFamily: theme.fonts.mono, fontSize: 21, color: kind === "Out" ? C.coral : C.fn, marginBottom: 10, opacity: 0.85 }}>{label}</div>
      )}
      <div
        style={{
          borderRadius: 18,
          background: kind === "Out" ? "rgba(15,23,38,0.72)" : `linear-gradient(180deg, ${C.panelHi}, ${C.panel})`,
          boxShadow: `inset 0 0 0 1.5px ${glowTone ? tone(glowTone) : C.edge}, 0 24px 60px rgba(0,0,0,0.4)`,
          borderLeft: kind === "In" ? `5px solid ${C.cyan}` : undefined,
          padding: "26px 30px",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ---------- syntax-highlighted typed code ----------
const KW = new Set(["import", "as", "from", "def", "return", "for", "in", "and", "or", "not", "True", "False", "None", "lambda"]);

const tokenize = (line: string) => {
  const re = /(#.*$)|("[^"]*"|'[^']*')|(\b\d[\d_]*\.?\d*\b)|([A-Za-z_][A-Za-z0-9_]*)(?=\s*\()|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g;
  const out: { t: string; c: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1]) out.push({ t: m[1], c: C.comment });
    else if (m[2]) out.push({ t: m[2], c: C.str });
    else if (m[3]) out.push({ t: m[3], c: C.num });
    else if (m[4]) out.push({ t: m[4], c: C.fn });
    else if (m[5]) out.push({ t: m[5], c: KW.has(m[5]) ? C.kw : C.text });
    else out.push({ t: m[0], c: m[6] ? C.text : C.dim });
  }
  return out;
};

export const Code: React.FC<{ lines: string[]; start: number; cps?: number; size?: number; cursorUntil?: number }> = ({
  lines,
  start,
  cps = 1.6,
  size = 27,
  cursorUntil,
}) => {
  const frame = useCurrentFrame();
  const typed = Math.max(0, (frame - start) * cps);
  let budget = typed;
  const total = lines.reduce((a, l) => a + l.length, 0);
  const typing = typed < total;
  const showCursor = (typing || (cursorUntil !== undefined && frame < cursorUntil)) && frame >= start;
  let cursorPlaced = false;
  return (
    <div style={{ fontFamily: theme.fonts.mono, fontSize: size, lineHeight: 1.55, whiteSpace: "pre" }}>
      {lines.map((line, li) => {
        const visible = Math.max(0, Math.min(line.length, Math.floor(budget)));
        budget -= line.length;
        const toks = tokenize(line);
        let used = 0;
        const isCursorLine = !cursorPlaced && (visible < line.length || li === lines.length - 1);
        if (isCursorLine) cursorPlaced = true;
        return (
          <div key={li} style={{ minHeight: size * 1.55 }}>
            {toks.map((tk, ti) => {
              const room = visible - used;
              used += tk.t.length;
              if (room <= 0) return null;
              return (
                <span key={ti} style={{ color: tk.c }}>
                  {tk.t.slice(0, room)}
                </span>
              );
            })}
            {isCursorLine && showCursor && (
              <span style={{ display: "inline-block", width: size * 0.55, height: size * 1.1, verticalAlign: "-0.2em", background: C.cyan, opacity: Math.floor(frame / 8) % 2 ? 0.9 : 0.25, marginLeft: 2 }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Frames needed to type `lines` at `cps`.
export const typeFrames = (lines: string[], cps = 1.6) => Math.ceil(lines.reduce((a, l) => a + l.length, 0) / cps);

// ---------- karaoke captions ----------
export const Captions: React.FC<{ hideAfter: number }> = ({ hideAfter }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const caps = captions(fps);
  const words = captionWords(fps);
  const cur = caps.find((c) => frame >= c.from - 2 && frame <= c.to + 8);
  if (!cur || frame > hideAfter) return null;
  const ws = words.filter((w) => w.from >= cur.from - 1 && w.from <= cur.to);
  const inP = interpolate(frame, [cur.from - 2, cur.from + 5], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const outP = interpolate(frame, [cur.to + 2, cur.to + 8], [0, 1], { easing: theme.ease.in, ...CLAMP });
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1530, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 14,
          rowGap: 4,
          padding: "16px 26px",
          borderRadius: 16,
          background: "rgba(8,12,20,0.72)",
          boxShadow: `inset 0 0 0 1px ${C.edge}`,
          opacity: inP * (1 - outP),
          transform: `translateY(${(1 - inP) * 16}px)`,
          fontFamily: theme.fonts.body,
          fontWeight: 600,
          fontSize: 40,
          lineHeight: 1.3,
          textAlign: "center",
        }}
      >
        {ws.map((w, i) => {
          const said = frame >= w.from;
          const now = said && (i === ws.length - 1 || frame < ws[i + 1].from);
          return (
            <span key={i} style={{ color: now ? C.cyan : said ? C.text : C.faint }}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------- small shared bits ----------
export const Tag: React.FC<{ color: string; children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ color, children, size = 24, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 16px",
      borderRadius: 999,
      fontFamily: theme.fonts.mono,
      fontSize: size,
      fontWeight: 600,
      color,
      background: `${color}1A`,
      boxShadow: `inset 0 0 0 1.5px ${color}66`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Heading: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 64, color = C.text, style }) => (
  <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.08, letterSpacing: "-0.02em", color, ...style }}>{children}</div>
);

// Check and cross glyphs drawn in SVG (no emoji).
export const Check: React.FC<{ size?: number; color?: string; p?: number }> = ({ size = 34, color = C.green, p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M4 12.5l5 5L20 6.5" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={24 * (1 - p)} />
  </svg>
);
export const Cross: React.FC<{ size?: number; color?: string; p?: number }> = ({ size = 34, color = C.coral, p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M6 6l12 12M18 6L6 18" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeDasharray={34} strokeDashoffset={34 * (1 - p)} />
  </svg>
);
