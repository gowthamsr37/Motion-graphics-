// Graphics for the Dhoni tribute: photo backdrops, spotlight, trophy, glove, stumps, gavel, ball.
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { CLAMP } from "./Motion";

const C = theme.colors;
export const GOLD = "#F2C14E";
export const YELLOW = "#F9CD1B"; // CSK yellow, used sparingly

/* full-bleed photo with a slow push, darkened so scoreboard panels read on top */
export const PhotoBg: React.FC<{ src: string; on?: number; position?: string; dark?: number; blur?: number; from?: number; zoom?: [number, number]; len?: number }> = ({ src, on = 1, position = "50% 30%", dark = 0.55, blur = 0, from = 0, zoom = [1.04, 1.14], len = 400 }) => {
  const frame = useCurrentFrame();
  if (on <= 0.001) return null;
  const k = interpolate(frame, [from, from + len], zoom, { easing: theme.ease.soft, ...CLAMP });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: on }}>
      <Img src={staticFile(`photos/${src}`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: position, transform: `scale(${k})`, filter: `blur(${blur}px) saturate(1.05) contrast(1.05)` }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(6,10,8,${dark + 0.15}) 0%, rgba(6,10,8,${dark * 0.6}) 40%, rgba(6,10,8,${dark}) 70%, rgba(6,10,8,${Math.min(1, dark + 0.3)}) 100%)` }} />
    </div>
  );
};

/* a framed photo on the board */
export const Framed: React.FC<{ src: string; x: number; y: number; w: number; h: number; at: number; position?: string; credit?: string; closeAt?: number }> = ({ src, x, y, w, h, at, position = "50% 25%", credit, closeAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.heavy });
  const close = closeAt === undefined ? 0 : interpolate(frame, [closeAt, closeAt + 10], [0, 1], CLAMP);
  if (frame < at) return null;
  const k = interpolate(frame, [at, at + 300], [1.02, 1.1], CLAMP);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, padding: 10, boxSizing: "border-box", borderRadius: 10, background: `linear-gradient(180deg, ${C.panelHi}, ${C.board})`, boxShadow: `inset 0 0 0 2px ${C.panelEdge}, 0 24px 50px -14px ${C.shadow}`, opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP) * (1 - close), transform: `translateY(${interpolate(p, [0, 1], [40, 0]) - close * 30}px)` }}>
      <div style={{ width: "100%", height: credit ? h - 52 : h - 20, overflow: "hidden", borderRadius: 4, boxShadow: `inset 0 0 0 2px ${C.trimCream}55` }}>
        <Img src={staticFile(`photos/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position, transform: `scale(${k})`, filter: "contrast(1.04) saturate(1.04)" }} />
      </div>
      {credit && (
        <div style={{ marginTop: 8, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 17, letterSpacing: "0.14em", color: C.creamDim }}>
          {credit}
        </div>
      )}
    </div>
  );
};

/* one spotlight from the roof */
export const Spotlight: React.FC<{ on: number; x?: number; w?: number }> = ({ on, x = 540, w = 760 }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: on }}>
    <div style={{ position: "absolute", left: x - w / 2, top: -200, width: w, height: 1500, background: "linear-gradient(180deg, rgba(255,244,214,0.30), rgba(255,244,214,0.06) 70%, rgba(255,244,214,0))", clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)", filter: "blur(18px)" }} />
    <div style={{ position: "absolute", left: x - 420, top: 1140, width: 840, height: 160, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,244,214,0.22), rgba(255,244,214,0))" }} />
  </div>
);

/* a generic championship cup */
export const Trophy: React.FC<{ size: number; lit: number }> = ({ size, lit }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 100 125" style={{ overflow: "visible", filter: lit > 0.5 ? `drop-shadow(0 0 ${14 * lit}px ${C.amberGlow})` : undefined }}>
    <defs>
      <linearGradient id="tg" x1="0" x2="1">
        <stop offset="0" stopColor="#B07A1A" />
        <stop offset="0.45" stopColor="#FCE29A" />
        <stop offset="1" stopColor="#B9821F" />
      </linearGradient>
    </defs>
    <g opacity={0.25 + 0.75 * lit}>
      <path d="M22 10 H78 V30 C78 58 62 70 50 72 C38 70 22 58 22 30 Z" fill={lit > 0.05 ? "url(#tg)" : C.plateHi} />
      <path d="M22 18 C6 18 6 44 26 48" fill="none" stroke={lit > 0.05 ? "#D9A53A" : C.plateHi} strokeWidth={6} />
      <path d="M78 18 C94 18 94 44 74 48" fill="none" stroke={lit > 0.05 ? "#D9A53A" : C.plateHi} strokeWidth={6} />
      <rect x={44} y={70} width={12} height={22} fill={lit > 0.05 ? "#C8922B" : C.plateHi} />
      <path d="M30 92 H70 L74 108 H26 Z" fill={lit > 0.05 ? "url(#tg)" : C.plateHi} />
      <rect x={22} y={108} width={56} height={10} rx={2} fill={lit > 0.05 ? "#8A5E14" : C.plate} />
    </g>
  </svg>
);

/* auction gavel that strikes at `at` */
export const Gavel: React.FC<{ size: number; strikes: number[] }> = ({ size, strikes }) => {
  const frame = useCurrentFrame();
  let a = -35;
  for (const s of strikes) {
    const k = frame - s;
    if (k >= -8 && k < 0) a = interpolate(k, [-8, 0], [-35, 8]);
    else if (k >= 0 && k < 10) a = interpolate(k, [0, 10], [8, -35]);
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <rect x={18} y={82} width={64} height={10} rx={3} fill="#6B4A2A" />
      <g transform={`rotate(${a}, 78, 70)`}>
        <rect x={20} y={46} width={60} height={8} rx={4} fill="#8A6038" transform="rotate(-20 50 50)" />
        <rect x={6} y={26} width={30} height={26} rx={5} fill="#A87443" transform="rotate(-20 21 39)" />
      </g>
    </svg>
  );
};

/* three stumps; bails fly off at `hit` */
export const Stumps: React.FC<{ w: number; hit: number }> = ({ w, hit }) => {
  const frame = useCurrentFrame();
  const k = Math.max(0, frame - hit);
  const fly = frame >= hit ? 1 : 0;
  const h = w * 1.4;
  return (
    <svg width={w} height={h} viewBox="0 0 100 140" style={{ overflow: "visible" }}>
      {[22, 50, 78].map((x) => (
        <rect key={x} x={x - 4} y={22} width={8} height={116} rx={3} fill="#EDE4CC" stroke="#A39D8A" strokeWidth={1} />
      ))}
      {[
        [36, -1],
        [64, 1],
      ].map(([x, d]) => (
        <rect key={x} x={x - 13 + fly * d * k * 3.2} y={14 - fly * (k * 5 - k * k * 0.18)} width={26} height={6} rx={3} fill="#D9C79A" transform={`rotate(${fly * d * k * 18}, ${x + fly * d * k * 3.2}, ${17 - fly * (k * 5 - k * k * 0.18)})`} />
      ))}
    </svg>
  );
};

/* a keeping glove that snaps shut on the catch */
export const Glove: React.FC<{ size: number; catchAt: number }> = ({ size, catchAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - catchAt, fps, config: { damping: 10, stiffness: 260, mass: 0.5 } });
  const ballX = interpolate(frame, [catchAt - 14, catchAt], [-260, 0], CLAMP);
  const ballY = interpolate(frame, [catchAt - 14, catchAt], [-60, 0], CLAMP);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: "visible" }}>
      {frame < catchAt + 2 && <circle cx={64 + ballX} cy={52 + ballY} r={9} fill="#B3261E" stroke="#F4E6D0" strokeWidth={1.5} />}
      <g transform={`translate(60 60) scale(${1 - 0.08 * p}) translate(-60 -60)`}>
        {/* four fingers that curl on the catch, a thumb, the palm and the cuff */}
        {[32, 46, 60, 74].map((x, i) => (
          <rect key={x} x={x - 6} y={14 + (i === 0 || i === 3 ? 8 : 0) + 10 * p} width={13} height={40 - 8 * p} rx={6.5} fill="#EFE7D4" stroke="#8C7E62" strokeWidth={2.5} />
        ))}
        <rect x={86} y={52} width={14} height={34} rx={7} fill="#EFE7D4" stroke="#8C7E62" strokeWidth={2.5} transform={`rotate(${35 - 20 * p} 93 69)`} />
        <path d="M24 50 H88 V78 C88 94 76 102 56 102 C36 102 24 94 24 78 Z" fill="#EFE7D4" stroke="#8C7E62" strokeWidth={3} />
        <path d="M34 66 C46 74 66 74 80 66" fill="none" stroke="#8C7E62" strokeWidth={3} strokeLinecap="round" />
        <path d="M34 96 H78 V114 H34 Z" fill="#2C4A8A" stroke="#1C2F5A" strokeWidth={2} />
      </g>
      {p > 0.3 && <circle cx={60} cy={56} r={40 * p} fill="none" stroke={C.amber} strokeOpacity={Math.max(0, 1 - p)} strokeWidth={4} />}
    </svg>
  );
};

/* a six: the ball arcs up and away into the crowd */
export const SixBall: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const u = interpolate(frame, [at, at + 34], [0, 1], CLAMP);
  if (frame < at || u >= 1) return null;
  const x = 540 + u * 380 - u * u * 60;
  const y = 1150 - u * 1050 + u * u * 120;
  const s = 1 - u * 0.75;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, pointerEvents: "none", zIndex: 30 }}>
      {Array.from({ length: 8 }).map((_, i) => {
        const v = Math.max(0, u - i * 0.03);
        return <div key={i} style={{ position: "absolute", left: 540 + v * 380 - v * v * 60 - 10, top: 1150 - v * 1050 + v * v * 120 - 10, width: 20, height: 20, borderRadius: 20, background: C.amber, opacity: 0.25 * (1 - i / 8), filter: "blur(4px)" }} />;
      })}
      <div style={{ position: "absolute", left: x - 22 * s, top: y - 22 * s, width: 44 * s, height: 44 * s, borderRadius: 44, background: "radial-gradient(circle at 35% 30%, #F06A5E, #B3261E 60%, #6E140F)", boxShadow: "0 0 30px rgba(255,120,90,0.7)" }} />
    </div>
  );
};
