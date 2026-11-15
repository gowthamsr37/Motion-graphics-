import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { CLAMP } from "./Motion";
import { Lamp, Lettering, Panel } from "./Panel";
import { AMBER, GREEN, RED } from "./Pitch";

const C = theme.colors;
export type LampState = "off" | "ok" | "bad" | "maybe";
const col = (s: LampState) => (s === "ok" ? GREEN : s === "bad" ? RED : s === "maybe" ? AMBER : C.plate);

// state of a lamp at this frame from a list of timed changes
export const useLamp = (changes: { at: number; s: LampState }[]) => {
  const frame = useCurrentFrame();
  let cur: LampState = "off";
  let since = -1e9;
  for (const c of changes) if (frame >= c.at) { cur = c.s; since = c.at; }
  return { s: cur, pop: interpolate(frame - since, [0, 4, 14], [1.35, 1.15, 1], CLAMP) };
};

// the signature device: three scoreboard lamps — PITCH · IMPACT · WICKETS
export const LampBoard: React.FC<{ x: number; y: number; w: number; h: number; delay?: number; lamps: { at: number; s: LampState }[][]; big?: boolean; closeAt?: number }> = ({ x, y, w, h, delay = 0, lamps, big = false, closeAt }) => {
  const names = ["PITCH", "IMPACT", "WICKETS"];
  return (
    <Panel x={x} y={y} w={w} h={h} delay={delay} seed={77} closeAt={closeAt}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        {names.map((n, i) => (
          <LampCell key={n} n={i + 1} name={n} changes={lamps[i] ?? []} big={big} />
        ))}
      </div>
    </Panel>
  );
};

const LampCell: React.FC<{ n: number; name: string; changes: { at: number; s: LampState }[]; big: boolean }> = ({ n, name, changes, big }) => {
  const { s, pop } = useLamp(changes);
  const size = big ? 120 : 52;
  return (
    <div style={{ display: "flex", flexDirection: big ? "column" : "row", alignItems: "center", gap: big ? 18 : 14 }}>
      <div style={{ transform: `scale(${s === "off" ? 1 : pop})` }}>
        <Lamp color={col(s)} glow={s === "off" ? "transparent" : `${col(s)}aa`} on={s === "off" ? 0 : 1} size={size} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: big ? "center" : "flex-start", gap: 4 }}>
        <Lettering size={big ? 26 : 16} font="body" color={C.creamDim} spacing="0.2em">
          {n}
        </Lettering>
        <Lettering size={big ? 64 : 38} color={s === "off" ? C.creamDim : C.cream}>
          {name}
        </Lettering>
      </div>
    </div>
  );
};

// verdict stamp
export const Stamp: React.FC<{ text: string; at: number; color?: string; size?: number; rotate?: number }> = ({ text, at, color = C.cream, size = 150, rotate = -6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 220, mass: 0.7 } });
  if (frame < at) return null;
  return (
    <div style={{ display: "inline-block", padding: `${size * 0.1}px ${size * 0.22}px ${size * 0.06}px`, border: `${Math.max(5, size * 0.05)}px solid ${color}`, borderRadius: size * 0.1, background: "rgba(10,15,12,0.88)", boxShadow: `0 0 40px ${color}66`, transform: `scale(${interpolate(p, [0, 1], [2.2, 1])}) rotate(${rotate}deg)`, opacity: interpolate(p, [0, 0.2], [0, 1], CLAMP) }}>
      <Lettering size={size} color={color}>
        {text}
      </Lettering>
    </div>
  );
};

// the umpire's raised finger (simple original icon)
export const Finger: React.FC<{ size: number; at: number }> = ({ size, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 160, mass: 0.8 } });
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 200 260" style={{ transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px)`, opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP) }}>
      <rect x={82} y={20} width={38} height={120} rx={19} fill={C.cream} />
      <path d="M48 120 Q48 100 66 100 L150 100 Q168 100 168 122 L168 190 Q168 240 118 244 L92 244 Q48 240 48 196 Z" fill={C.cream} />
      <path d="M66 140 L150 140 M66 170 L150 170" stroke={C.creamDim} strokeWidth={4} />
      <rect x={30} y={236} width={150} height={24} rx={8} fill={AMBER} />
    </svg>
  );
};

// small icons for the two extra rules
export const BatFirstIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <g transform="rotate(-35 100 100)">
      <rect x={93} y={20} width={14} height={50} rx={6} fill={C.creamDim} />
      <path d="M78 70 L122 70 L124 170 Q100 186 76 170 Z" fill={C.cream} />
    </g>
    <circle cx={150} cy={86} r={18} fill={RED} />
    <path d="M140 80 Q150 88 160 80" stroke={C.cream} strokeWidth={3} fill="none" />
    <path d="M128 98 L112 110" stroke={AMBER} strokeWidth={6} strokeLinecap="round" />
    <path d="M136 108 L126 124" stroke={AMBER} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

export const NoBallIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    {/* umpire signalling a no-ball: one arm held out horizontally */}
    <circle cx={70} cy={50} r={20} fill={C.cream} />
    <rect x={54} y={74} width={34} height={70} rx={10} fill={C.cream} />
    <rect x={86} y={80} width={96} height={18} rx={9} fill={C.cream} />
    <rect x={40} y={80} width={16} height={56} rx={8} fill={C.creamDim} />
    <rect x={56} y={142} width={13} height={48} rx={6} fill={C.creamDim} />
    <rect x={73} y={142} width={13} height={48} rx={6} fill={C.creamDim} />
  </svg>
);

export const QuestionBar: React.FC<{ n?: number; text: string; delay?: number; color?: string }> = ({ n, text, delay = 0, color = AMBER }) => (
  <Panel x={60} y={226} w={960} h={104} delay={delay} seed={60}>
    <div style={{ height: "100%", display: "flex", alignItems: "center", gap: 22, padding: "0 30px" }}>
      {n !== undefined && (
        <div style={{ width: 70, height: 70, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={58} color={C.board}>
            {n}
          </Lettering>
        </div>
      )}
      <Lettering size={56}>{text}</Lettering>
    </div>
  </Panel>
);
