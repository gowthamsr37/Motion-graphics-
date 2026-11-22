// The cast and props, drawn as flat SVG illustrations: Arjun, Meera, Dad, Mom, the flat, speech bubbles.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { CLAMP } from "./Motion";

const C = theme.colors;
export type Who = "arjun" | "meera" | "dad" | "mom" | "friend";
export type Mood = "happy" | "neutral" | "worried" | "smug" | "calm" | "shocked";

const LOOK: Record<Who, { shirt: string; skin: string; hair: string }> = {
  arjun: { shirt: C.arjun, skin: C.skin1, hair: C.hair },
  meera: { shirt: C.meera, skin: C.skin2, hair: C.hair },
  dad: { shirt: "#8E7CC3", skin: C.skin1, hair: "#CFC8C0" },
  mom: { shirt: "#E0607E", skin: C.skin2, hair: "#5A4A44" },
  friend: { shirt: "#6D6A86", skin: C.skin1, hair: C.hair },
};

export const Avatar: React.FC<{ who: Who; mood?: Mood; size?: number; delay?: number; bob?: number; style?: React.CSSProperties }> = ({
  who,
  mood = "neutral",
  size = 260,
  delay = 0,
  bob = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  const L = LOOK[who];
  const blink = (frame + bob * 37) % 110 < 4 ? 0.15 : 1;
  const breathe = Math.sin((frame + bob * 20) / 18) * 2;
  const brow = mood === "worried" || mood === "shocked" ? -8 : mood === "smug" ? 6 : 0;
  const mouth =
    mood === "happy" ? "M84,150 Q100,166 116,150" :
    mood === "smug" ? "M86,152 Q104,160 116,146" :
    mood === "worried" ? "M86,158 Q100,148 114,158" :
    mood === "shocked" ? "" :
    mood === "calm" ? "M88,153 Q100,159 112,153" : "M88,154 L112,154";
  return (
    <div style={{ width: size, height: size * 1.25, opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP), transform: `translateY(${(1 - p) * 60}px) scale(${interpolate(p, [0, 1], [0.8, 1])})`, ...style }}>
      <svg viewBox="0 0 200 250" width={size} height={size * 1.25}>
        {/* long hair behind (Meera) */}
        {who === "meera" && <path d="M46,110 Q40,40 100,38 Q160,40 154,110 L160,190 Q100,205 40,190 Z" fill={L.hair} />}
        {/* body */}
        <g transform={`translate(0, ${breathe * 0.5})`}>
          <path d="M30,250 Q30,190 100,182 Q170,190 170,250 Z" fill={L.shirt} />
          {who === "mom" && <path d="M60,250 Q90,200 150,192 L170,250 Z" fill="#F4C04E" opacity={0.85} />}
          {who === "arjun" && <path d="M88,186 L100,206 L112,186" fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={0.8} />}
          <rect x={88} y={164} width={24} height={24} rx={8} fill={L.skin} />
        </g>
        {/* head */}
        <g transform={`translate(0, ${breathe})`}>
          <ellipse cx={100} cy={118} rx={50} ry={56} fill={L.skin} />
          <ellipse cx={52} cy={122} rx={7} ry={11} fill={L.skin} />
          <ellipse cx={148} cy={122} rx={7} ry={11} fill={L.skin} />
          {/* hair on top */}
          {who === "arjun" && <path d="M50,108 Q48,58 100,56 Q150,56 152,104 Q140,82 112,80 Q84,92 60,86 Z" fill={L.hair} />}
          {who === "friend" && <path d="M52,104 Q54,60 100,58 Q146,60 150,102 Q130,74 100,76 Q72,76 52,104 Z" fill={L.hair} />}
          {who === "meera" && (
            <>
              <path d="M50,112 Q50,58 100,58 Q150,58 150,112 Q130,80 100,84 Q72,80 50,112 Z" fill={L.hair} />
              <circle cx={100} cy={102} r={3.5} fill="#D9364F" />
            </>
          )}
          {who === "dad" && (
            <>
              <path d="M50,112 Q48,84 62,74 Q60,96 56,112 Z M150,112 Q152,84 138,74 Q140,96 144,112 Z" fill={L.hair} />
              <path d="M82,140 Q100,132 118,140 Q100,146 82,140 Z" fill="#9B948C" />
              <g fill="none" stroke="#2B2420" strokeWidth={3}>
                <circle cx={80} cy={118} r={13} />
                <circle cx={120} cy={118} r={13} />
                <path d="M93,118 L107,118" />
              </g>
            </>
          )}
          {who === "mom" && (
            <>
              <path d="M50,114 Q50,60 100,60 Q150,60 150,114 Q136,78 100,80 Q64,78 50,114 Z" fill={L.hair} />
              <circle cx={100} cy={56} r={18} fill={L.hair} />
              <path d="M70,66 Q100,60 128,70" fill="none" stroke="#CFC8C0" strokeWidth={4} />
              <circle cx={100} cy={102} r={4} fill="#D9364F" />
            </>
          )}
          {/* brows */}
          <path d={`M72,${100 - brow / 2} L90,${100 + brow / 2}`} stroke="#2B2420" strokeWidth={4} strokeLinecap="round" />
          <path d={`M110,${100 + brow / 2} L128,${100 - brow / 2}`} stroke="#2B2420" strokeWidth={4} strokeLinecap="round" />
          {/* eyes */}
          <ellipse cx={80} cy={118} rx={5} ry={6 * blink * (mood === "shocked" ? 1.4 : 1)} fill="#2B2420" />
          <ellipse cx={120} cy={118} rx={5} ry={6 * blink * (mood === "shocked" ? 1.4 : 1)} fill="#2B2420" />
          {/* mouth */}
          {mood === "shocked" ? <ellipse cx={100} cy={154} rx={8} ry={10} fill="#5A2A2A" /> : <path d={mouth} fill="none" stroke="#5A2A2A" strokeWidth={4.5} strokeLinecap="round" />}
          {(mood === "happy" || mood === "smug") && (
            <>
              <circle cx={68} cy={140} r={8} fill="#FF7A7A" opacity={0.3} />
              <circle cx={132} cy={140} r={8} fill="#FF7A7A" opacity={0.3} />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

export const NameTag: React.FC<{ name: string; sub?: string; color: string; delay: number }> = ({ name, sub, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.snappy });
  return (
    <div style={{ textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ fontFamily: theme.fonts.story, fontWeight: 700, fontSize: 64, color, lineHeight: 1 }}>{name}</div>
      {sub && <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 30, color: C.dim, marginTop: 10 }}>{sub}</div>}
    </div>
  );
};

// Speech bubble with a tail; pops in, wobbles slightly while shown.
export const Bubble: React.FC<{ text: string; delay: number; exit?: number; tail?: "left" | "right" | "down"; color?: string; textColor?: string; size?: number; style?: React.CSSProperties }> = ({
  text,
  delay,
  exit,
  tail = "left",
  color = C.text,
  textColor = C.bg,
  size = 40,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  const out = exit === undefined ? 0 : interpolate(frame, [exit, exit + 8], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const tailStyle: React.CSSProperties =
    tail === "left" ? { left: 30, bottom: -22, borderWidth: "24px 22px 0 0", borderColor: `${color} transparent transparent transparent` } :
    tail === "right" ? { right: 30, bottom: -22, borderWidth: "24px 0 0 22px", borderColor: `${color} transparent transparent transparent` } :
    { left: "50%", bottom: -22, marginLeft: -14, borderWidth: "24px 14px 0 14px", borderColor: `${color} transparent transparent transparent` };
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        background: color,
        color: textColor,
        borderRadius: 34,
        padding: "22px 34px",
        fontFamily: theme.fonts.story,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.2,
        boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
        opacity: interpolate(p, [0, 0.25], [0, 1], CLAMP) * (1 - out),
        transform: `scale(${interpolate(p, [0, 1], [0.6, 1]) * (1 - out * 0.2)}) rotate(${Math.sin(frame / 20) * 1.2}deg)`,
        transformOrigin: tail === "right" ? "90% 100%" : tail === "down" ? "50% 100%" : "10% 100%",
        ...style,
      }}
    >
      {text}
      <div style={{ position: "absolute", width: 0, height: 0, borderStyle: "solid", ...tailStyle }} />
    </div>
  );
};

// A flat block with lit windows; `owned` adds a key tag.
export const FlatBlock: React.FC<{ color: string; width?: number; delay?: number; floors?: number; lit?: number }> = ({ color, width = 300, delay = 0, floors = 7, lit = 0.6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  const h = floors * 56 + 40;
  return (
    <svg width={width} height={h + 20} viewBox={`0 0 ${width} ${h + 20}`} style={{ overflow: "visible" }}>
      <g transform={`translate(0, ${(1 - p) * (h + 20)})`} opacity={interpolate(p, [0, 0.2], [0, 1], CLAMP)}>
        <rect x={10} y={20} width={width - 20} height={h} rx={14} fill={C.cardHi} stroke={color} strokeWidth={4} />
        <rect x={0} y={8} width={width} height={24} rx={8} fill={color} />
        {Array.from({ length: floors }).map((_, f) =>
          Array.from({ length: 4 }).map((__, c) => {
            const on = ((f * 7 + c * 3 + Math.floor(frame / 40)) % 10) / 10 < lit;
            return <rect key={`${f}-${c}`} x={34 + c * ((width - 68) / 4)} y={48 + f * 56} width={(width - 68) / 4 - 18} height={34} rx={5} fill={on ? "#FFE3A3" : "#3B3466"} opacity={on ? 0.9 : 1} />;
          }),
        )}
        <rect x={width / 2 - 30} y={h - 40} width={60} height={60} rx={8} fill={color} opacity={0.8} />
      </g>
    </svg>
  );
};

export const Key: React.FC<{ size?: number; color?: string }> = ({ size = 90, color = C.meera }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={30} cy={50} r={20} fill="none" stroke={color} strokeWidth={10} />
    <path d="M50,50 L92,50 M78,50 L78,66 M90,50 L90,62" stroke={color} strokeWidth={10} strokeLinecap="round" />
  </svg>
);

export const Gift: React.FC<{ size?: number; color: string }> = ({ size = 120, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x={12} y={40} width={76} height={54} rx={6} fill={color} />
    <rect x={6} y={28} width={88} height={18} rx={5} fill={color} />
    <rect x={44} y={28} width={12} height={66} fill={C.text} opacity={0.9} />
    <path d="M50,28 C30,6 14,22 34,28 Z M50,28 C70,6 86,22 66,28 Z" fill={C.text} opacity={0.9} />
  </svg>
);
