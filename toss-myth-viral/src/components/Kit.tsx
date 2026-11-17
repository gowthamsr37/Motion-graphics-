// Shared look: floodlit background, header with chapter progress, karaoke captions, coin, stamp, cards.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { captionWords } from "../timing";
import { CLAMP } from "./Motion";

const C = theme.colors;

export const Txt: React.FC<{ size: number; color?: string; font?: "display" | "body"; weight?: number; spacing?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size,
  color = C.white,
  font = "display",
  weight = 800,
  spacing,
  style,
  children,
}) => (
  <span
    style={{
      fontFamily: font === "display" ? theme.fonts.display : theme.fonts.body,
      fontWeight: font === "display" ? 400 : weight,
      fontSize: size,
      lineHeight: 1.02,
      letterSpacing: spacing ?? (font === "display" ? "0.01em" : "0.02em"),
      color,
      textTransform: font === "display" ? "uppercase" : undefined,
      ...style,
    }}
  >
    {children}
  </span>
);

/* ---------- floodlit night background ---------- */
export const Bg: React.FC<{ flash?: number; tint?: string }> = ({ flash = 0, tint }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 70) * 30;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 38%, ${C.bg1} 0%, ${C.bg0} 70%)` }}>
      {/* floodlight beams */}
      {[-1, 1].map((s) => (
        <div
          key={s}
          style={{
            position: "absolute",
            left: s < 0 ? -260 + sway : undefined,
            right: s > 0 ? -260 - sway : undefined,
            top: -220,
            width: 900,
            height: 1500,
            background: "linear-gradient(180deg, rgba(190,215,255,0.16), rgba(190,215,255,0) 75%)",
            transform: `rotate(${s * -24}deg)`,
            transformOrigin: s < 0 ? "0% 0%" : "100% 0%",
            filter: "blur(30px)",
          }}
        />
      ))}
      {/* light rig glow */}
      {[-1, 1].map((s) => (
        <div key={`g${s}`} style={{ position: "absolute", top: 40, left: s < 0 ? 40 : undefined, right: s > 0 ? 40 : undefined, width: 120, height: 60, borderRadius: 30, background: "rgba(230,240,255,0.55)", filter: "blur(26px)" }} />
      ))}
      {/* pitch glow at the bottom */}
      <div style={{ position: "absolute", left: -200, right: -200, bottom: -420, height: 900, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(43,229,154,0.10), rgba(43,229,154,0))" }} />
      {tint && <AbsoluteFill style={{ background: tint }} />}
      {flash > 0 && <AbsoluteFill style={{ background: "radial-gradient(60% 40% at 50% 45%, rgba(255,236,190,0.9), rgba(255,236,190,0))", opacity: flash * 0.35, mixBlendMode: "screen" }} />}
    </AbsoluteFill>
  );
};

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.06, mixBlendMode: "overlay" }}>
      <svg width="1080" height="1920">
        <filter id="g">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 12} />
        </filter>
        <rect width="1080" height="1920" filter="url(#g)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(110% 75% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />;

/* ---------- header: brand + chapter progress ---------- */
export const Header: React.FC<{ chapters: { label: string; from: number }[]; end: number; hideAfter: number }> = ({ chapters, end, hideAfter }) => {
  const frame = useCurrentFrame();
  const on = interpolate(frame, [hideAfter - 8, hideAfter], [1, 0], CLAMP) * interpolate(frame, [0, 8], [0, 1], CLAMP);
  const cur = chapters.reduce((k, c, i) => (frame >= c.from ? i : k), 0);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 150, opacity: on, zIndex: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 22, height: 22, borderRadius: 22, background: `radial-gradient(circle at 35% 30%, #FFF1B8, ${C.gold} 55%, #B27C12)`, boxShadow: `0 0 12px ${C.goldGlow}` }} />
          <Txt size={24} font="body" weight={900} spacing="0.14em">
            BEYOND THE SCOREBOARD
          </Txt>
        </div>
        <div style={{ padding: "7px 14px 6px", borderRadius: 8, background: C.red, boxShadow: `0 0 18px ${C.redGlow}` }}>
          <Txt size={20} font="body" weight={900} spacing="0.12em">
            MYTH BUSTERS #01
          </Txt>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
        {chapters.map((c, i) => {
          const next = i + 1 < chapters.length ? chapters[i + 1].from : end;
          const p = interpolate(frame, [c.from, next], [0, 1], CLAMP);
          return (
            <div key={c.label} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ height: 6, borderRadius: 3, background: C.faint, overflow: "hidden" }}>
                <div style={{ width: `${p * 100}%`, height: "100%", background: i === cur ? C.gold : C.white, opacity: i === cur ? 1 : 0.7 }} />
              </div>
              <Txt size={15} font="body" weight={800} spacing="0.14em" color={i === cur ? C.gold : C.dim}>
                {c.label}
              </Txt>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- karaoke captions: chunks of up to 4 words, the spoken word lights up ---------- */
export const Captions: React.FC<{ hiddenRanges: [number, number][]; top?: number }> = ({ hiddenRanges, top = 1330 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = captionWords(fps);
  // chunking
  const chunks: { words: typeof words; from: number; to: number }[] = [];
  let cur: typeof words = [];
  words.forEach((w, i) => {
    cur.push(w);
    const nxt = words[i + 1];
    const brk = /[.,?:!]$/.test(w.t) || cur.length >= 4 || !nxt || nxt.seg !== w.seg;
    if (brk) {
      chunks.push({ words: cur, from: cur[0].from, to: nxt && nxt.seg === w.seg ? nxt.from : cur[cur.length - 1].to + 6 });
      cur = [];
    }
  });
  const ch = chunks.find((c) => frame >= c.from - 1 && frame < c.to);
  if (!ch || hiddenRanges.some(([a, b]) => ch.from >= a && ch.from < b)) return null;
  const pop = spring({ frame: frame - ch.from + 1, fps, config: theme.spring.pop });
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top, height: 150, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 45 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 18px", transform: `scale(${interpolate(pop, [0, 1], [0.86, 1])})`, opacity: interpolate(pop, [0, 0.3], [0, 1], CLAMP) }}>
        {ch.words.map((w, i) => {
          const active = frame >= w.from && (i + 1 < ch.words.length ? frame < ch.words[i + 1].from : true);
          const said = frame >= w.from;
          const num = /\d/.test(w.t);
          return (
            <span
              key={i}
              style={{
                fontFamily: theme.fonts.body,
                fontWeight: 900,
                fontSize: 66,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                textTransform: "uppercase",
                color: active || num ? C.gold : said ? C.white : "rgba(244,246,251,0.55)",
                transform: active ? "scale(1.08)" : undefined,
                display: "inline-block",
                textShadow: "0 4px 0 rgba(0,0,0,0.55), 0 0 24px rgba(0,0,0,0.6)",
                WebkitTextStroke: "2px rgba(0,0,0,0.35)",
              }}
            >
              {w.t}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- scene container: whip in, quick zoom out ---------- */
export const Shell: React.FC<{ children: React.ReactNode; enter?: boolean; exit?: boolean; push?: number; shakeAt?: number[] }> = ({ children, enter = true, exit = true, push = 0.03, shakeAt = [] }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = enter ? interpolate(frame, [0, 9], [0, 1], { easing: theme.ease.out, ...CLAMP }) : 1;
  const outP = exit ? interpolate(frame, [durationInFrames - 7, durationInFrames], [0, 1], { easing: theme.ease.in, ...CLAMP }) : 0;
  const t = interpolate(frame, [0, durationInFrames], [0, 1], CLAMP);
  let sx = 0, sy = 0;
  for (const s of shakeAt) {
    const k = frame - s;
    if (k >= 0 && k < 14) {
      const a = (1 - k / 14) * 16;
      sx += Math.sin(k * 2.7) * a;
      sy += Math.cos(k * 3.3) * a * 0.6;
    }
  }
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${(1 - inP) * 90 + sx}px, ${sy}px) scale(${1 + push * t + outP * 0.06})`,
        filter: inP < 1 || outP > 0 ? `blur(${(1 - inP) * 10 + outP * 8}px)` : undefined,
        opacity: inP * (1 - outP),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* ---------- the coin ---------- */
const CoinFace: React.FC<{ size: number; side: "H" | "T" }> = ({ size, side }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ display: "block" }}>
    <defs>
      <radialGradient id="coinG2" cx="36%" cy="30%" r="80%">
        <stop offset="0" stopColor="#FFF3C4" />
        <stop offset="0.4" stopColor="#FFC83D" />
        <stop offset="1" stopColor="#A86E0C" />
      </radialGradient>
      <path id="coinRing2" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
    </defs>
    <circle cx={100} cy={100} r={98} fill="url(#coinG2)" stroke="#7A4E08" strokeWidth={3} />
    <circle cx={100} cy={100} r={88} fill="none" stroke="#9A6610" strokeWidth={2.5} opacity={0.8} />
    <text fontFamily={theme.fonts.body} fontWeight={900} fontSize={12} letterSpacing={4.2} fill="#6E4506">
      <textPath href="#coinRing2">BEYOND THE SCOREBOARD · MYTH BUSTERS ·</textPath>
    </text>
    <text x={100} y={134} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={96} fill="#6E4506">
      {side}
    </text>
  </svg>
);

export const Coin: React.FC<{ size: number; angle: number; glow?: number }> = ({ size, angle, glow = 0 }) => {
  const c = Math.cos(angle);
  const sy = Math.max(0.035, Math.abs(c));
  const thick = size * 0.075 * Math.abs(Math.sin(angle)) + size * 0.012;
  return (
    <div style={{ position: "relative", width: size, height: size, filter: glow > 0 ? `drop-shadow(0 0 ${36 * glow}px ${C.goldGlow})` : undefined }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 0, top: (size - size * sy) / 2 + (thick * (i + 1)) / 7, width: size, height: size * sy, borderRadius: "50%", background: i === 6 ? "#5E3B06" : "#9A6610" }} />
      ))}
      <div style={{ position: "absolute", inset: 0, transform: `scaleY(${sy})` }}>
        <CoinFace size={size} side={c >= 0 ? "H" : "T"} />
      </div>
    </div>
  );
};

/* ---------- stamp ---------- */
export const Stamp: React.FC<{ text: string; at: number; color?: string; size?: number; rotate?: number }> = ({ text, at, color = C.red, size = 120, rotate = -6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 240, mass: 0.7 } });
  if (frame < at) return null;
  return (
    <div style={{ display: "inline-block", padding: `${size * 0.1}px ${size * 0.24}px ${size * 0.06}px`, border: `${Math.max(6, size * 0.06)}px solid ${color}`, borderRadius: size * 0.12, background: "rgba(5,8,15,0.88)", boxShadow: `0 0 60px ${color}88, inset 0 0 30px ${color}33`, transform: `scale(${interpolate(p, [0, 1], [2.6, 1])}) rotate(${rotate}deg)`, opacity: interpolate(p, [0, 0.15], [0, 1], CLAMP) }}>
      <Txt size={size} color={color}>
        {text}
      </Txt>
    </div>
  );
};

/* ---------- glass card ---------- */
export const Card: React.FC<{ x: number; y: number; w: number; h: number; at: number; glow?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, at, glow, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 28,
        background: `linear-gradient(180deg, ${C.cardHi}, ${C.card})`,
        border: `2px solid ${C.line}`,
        boxShadow: `0 30px 60px -20px rgba(0,0,0,0.7)${glow ? `, 0 0 40px ${glow}` : ""}`,
        overflow: "hidden",
        opacity: interpolate(p, [0, 0.4], [0, 1], CLAMP),
        transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Chip: React.FC<{ text: string; color?: string; bg?: string; size?: number }> = ({ text, color = C.white, bg = C.cardHi, size = 26 }) => (
  <div style={{ display: "inline-flex", padding: `${size * 0.4}px ${size * 0.7}px ${size * 0.34}px`, borderRadius: size * 0.5, background: bg, border: `2px solid ${C.line}` }}>
    <Txt size={size} font="body" weight={900} color={color} spacing="0.06em">
      {text}
    </Txt>
  </div>
);
