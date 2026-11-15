// Flat, Kurzgesagt-style vector props. Everything is SVG drawn in theme colours (no emoji, no bitmaps).
import React from "react";
import { alpha, theme } from "../theme";

const C = theme.colors;

export const Person: React.FC<{
  height: number;
  shirt: string;
  skin?: string;
  hair?: string;
  swing?: number; // leg/arm swing in degrees (walking)
  blink?: boolean;
  backpack?: string;
  smile?: number; // -1..1
  armsUp?: number; // 0..1 celebrate
}> = ({ height, shirt, skin = C.skin[0], hair = C.hair[0], swing = 0, blink = false, backpack, smile = 0.6, armsUp = 0 }) => {
  const mouth = 46 + smile * 4;
  return (
    <svg width={height / 2} height={height} viewBox="0 0 100 200" style={{ overflow: "visible", display: "block" }}>
      <ellipse cx={50} cy={197} rx={30} ry={5} fill="rgba(0,0,0,0.35)" />
      {backpack ? <rect x={18} y={70} width={30} height={52} rx={10} fill={backpack} /> : null}
      <g transform={`rotate(${swing} 43 128)`}>
        <rect x={36} y={122} width={14} height={68} rx={7} fill={C.trousers} />
        <ellipse cx={44} cy={191} rx={10} ry={5} fill="#0E1433" />
      </g>
      <g transform={`rotate(${-swing} 57 128)`}>
        <rect x={50} y={122} width={14} height={68} rx={7} fill={C.trousers} />
        <ellipse cx={58} cy={191} rx={10} ry={5} fill="#0E1433" />
      </g>
      <g transform={`rotate(${-swing * 0.8 - armsUp * 150} 27 74)`}>
        <rect x={20} y={70} width={13} height={54} rx={6.5} fill={shirt} style={{ filter: "brightness(0.82)" }} />
        <circle cx={26.5} cy={124} r={6.5} fill={skin} />
      </g>
      <g transform={`rotate(${swing * 0.8 + armsUp * 150} 73 74)`}>
        <rect x={67} y={70} width={13} height={54} rx={6.5} fill={shirt} style={{ filter: "brightness(0.82)" }} />
        <circle cx={73.5} cy={124} r={6.5} fill={skin} />
      </g>
      <rect x={26} y={62} width={48} height={72} rx={20} fill={shirt} />
      <rect x={26} y={62} width={48} height={20} rx={10} fill="rgba(255,255,255,0.14)" />
      <circle cx={50} cy={36} r={23} fill={skin} />
      <path d="M27 36 C26 17 38 10 50 10 C63 10 74 17 73 36 C67 27 59 24 50 24 C41 24 33 27 27 36 Z" fill={hair} />
      <g transform={`translate(0 40) scale(1 ${blink ? 0.12 : 1}) translate(0 -40)`}>
        <circle cx={42} cy={39} r={2.8} fill={C.ink} />
        <circle cx={58} cy={39} r={2.8} fill={C.ink} />
      </g>
      <path d={`M44 ${46} Q50 ${mouth + 1} 56 ${46}`} stroke={C.ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </svg>
  );
};

export const MapPin: React.FC<{ size: number; color: string; dot?: string }> = ({ size, color, dot = C.bg }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130" style={{ overflow: "visible", display: "block" }}>
    <defs>
      <linearGradient id={`pin-${color}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={color} />
        <stop offset="1" stopColor={color} stopOpacity={0.75} />
      </linearGradient>
    </defs>
    <path d="M50 4 C26 4 8 22 8 46 C8 78 50 124 50 124 C50 124 92 78 92 46 C92 22 74 4 50 4 Z" fill={`url(#pin-${color})`} />
    <path d="M30 22 C36 14 44 12 52 12" stroke="rgba(255,255,255,0.5)" strokeWidth={5} strokeLinecap="round" fill="none" />
    <circle cx={50} cy={46} r={17} fill={dot} />
  </svg>
);

export const BloodDrop: React.FC<{ size: number; color?: string; children?: React.ReactNode }> = ({ size, color = C.blood, children }) => (
  <div style={{ position: "relative", width: size, height: size * 1.25 }}>
    <svg width={size} height={size * 1.25} viewBox="0 0 100 125" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <radialGradient id="drop" cx="0.35" cy="0.55" r="0.75">
          <stop offset="0" stopColor="#FF8FA8" />
          <stop offset="0.55" stopColor={color} />
          <stop offset="1" stopColor="#B32456" />
        </radialGradient>
      </defs>
      <path d="M50 4 C50 4 12 52 12 82 C12 105 29 121 50 121 C71 121 88 105 88 82 C88 52 50 4 50 4 Z" fill="url(#drop)" />
      <path d="M30 78 C30 66 36 56 42 48" stroke="rgba(255,255,255,0.55)" strokeWidth={6} strokeLinecap="round" fill="none" />
    </svg>
    <div style={{ position: "absolute", left: 0, right: 0, top: size * 0.48, display: "flex", justifyContent: "center" }}>{children}</div>
  </div>
);

export const Face: React.FC<{ size: number; mood: -1 | 0 | 1; color: string }> = ({ size, mood, color }) => {
  const mouth = mood === 1 ? "M32 60 Q50 78 68 60" : mood === 0 ? "M34 64 L66 64" : "M32 70 Q50 54 68 70";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
      <circle cx={50} cy={50} r={46} fill={color} />
      <circle cx={50} cy={50} r={46} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={3} />
      <circle cx={36} cy={42} r={5.5} fill={C.ink} />
      <circle cx={64} cy={42} r={5.5} fill={C.ink} />
      {mood === -1 ? <path d="M28 30 L42 35 M72 30 L58 35" stroke={C.ink} strokeWidth={4} strokeLinecap="round" /> : null}
      <path d={mouth} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
    </svg>
  );
};

export const Jersey: React.FC<{ size: number; number: string; color?: string; trim?: string }> = ({ size, number, color = "#2563EB", trim = C.cyan }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ display: "block", overflow: "visible" }}>
    <defs>
      <linearGradient id={`jer-${number}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} />
        <stop offset="1" stopColor={color} stopOpacity={0.78} />
      </linearGradient>
    </defs>
    <path
      d="M62 18 L38 28 L6 60 L30 92 L48 80 L48 188 L152 188 L152 80 L170 92 L194 60 L162 28 L138 18 C130 34 116 42 100 42 C84 42 70 34 62 18 Z"
      fill={`url(#jer-${number})`}
      stroke="rgba(255,255,255,0.25)"
      strokeWidth={2}
    />
    <path d="M62 18 C70 34 84 42 100 42 C116 42 130 34 138 18" stroke={trim} strokeWidth={6} fill="none" />
    <path d="M14 54 L36 82 M186 54 L164 82" stroke={trim} strokeWidth={7} strokeLinecap="round" />
    <text x={100} y={150} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={number.length > 1 ? 86 : 96} fill={C.white} stroke={alpha(C.ink, 0.35)} strokeWidth={2}>
      {number}
    </text>
  </svg>
);

export const Thermometer: React.FC<{ height: number; level: number; color: string }> = ({ height, level, color }) => {
  // viewBox 0 0 120 400: tube from y 20 to 320, bulb centred at y 345
  const top = 40;
  const bottom = 318;
  const y = bottom - (bottom - top) * level;
  return (
    <svg width={height * 0.3} height={height} viewBox="0 0 120 400" style={{ display: "block", overflow: "visible" }}>
      <rect x={34} y={10} width={52} height={330} rx={26} fill={alpha("#FFFFFF", 0.08)} stroke={alpha("#FFFFFF", 0.35)} strokeWidth={4} />
      <circle cx={60} cy={350} r={44} fill={alpha("#FFFFFF", 0.08)} stroke={alpha("#FFFFFF", 0.35)} strokeWidth={4} />
      <rect x={47} y={y} width={26} height={340 - y} rx={13} fill={color} />
      <circle cx={60} cy={350} r={32} fill={color} />
      <rect x={52} y={y + 6} width={6} height={Math.max(0, 320 - y)} rx={3} fill="rgba(255,255,255,0.35)" />
      <circle cx={50} cy={340} r={8} fill="rgba(255,255,255,0.35)" />
    </svg>
  );
};

// ---------- small glyphs for chips and the summary tree ----------
type G = { size: number; color: string };
const Svg: React.FC<{ size: number; children: React.ReactNode }> = ({ size, children }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block", overflow: "visible" }}>
    {children}
  </svg>
);
const S = (color: string) => ({ stroke: color, strokeWidth: 3.2, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const });

export const RulerGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    <rect x={13} y={3} width={14} height={34} rx={3} {...S(color)} />
    <path d="M13 10 h6 M13 16 h4 M13 22 h6 M13 28 h4" {...S(color)} />
  </Svg>
);
export const PeopleGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    <circle cx={14} cy={13} r={5} {...S(color)} />
    <circle cx={27} cy={13} r={5} {...S(color)} />
    <path d="M5 34 c0-8 4-12 9-12 s9 4 9 12 M19 34 c0-8 3-12 8-12 s8 4 8 12" {...S(color)} />
  </Svg>
);
export const ThermoGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    <path d="M16 24 V8 a4 4 0 0 1 8 0 V24 a7 7 0 1 1 -8 0 Z" {...S(color)} />
    <circle cx={20} cy={29} r={3} fill={color} />
  </Svg>
);
export const PinGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    <path d="M20 36 C20 36 8 23 8 15 a12 12 0 0 1 24 0 C32 23 20 36 20 36 Z" {...S(color)} />
    <circle cx={20} cy={15} r={4} {...S(color)} />
  </Svg>
);
export const DropGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    <path d="M20 4 C20 4 9 18 9 26 a11 11 0 0 0 22 0 C31 18 20 4 20 4 Z" {...S(color)} />
  </Svg>
);
export const SwatchGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    <circle cx={14} cy={16} r={8} fill="#F87171" />
    <circle cx={26} cy={16} r={8} fill="#60A5FA" opacity={0.9} />
    <circle cx={20} cy={26} r={8} fill="#FCD34D" opacity={0.9} />
    <circle cx={20} cy={20} r={17} {...S(color)} strokeWidth={2} opacity={0.5} />
  </Svg>
);
export const DotsGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    {[6, 13, 20, 27, 34].map((x) => (
      <circle key={x} cx={x} cy={20} r={3} fill={color} />
    ))}
  </Svg>
);
export const WaveGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    <path d="M3 28 C10 28 12 12 20 12 S30 28 37 18" {...S(color)} />
  </Svg>
);
export const StairsGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    <path d="M4 34 H14 V24 H24 V14 H34 V6" {...S(color)} />
  </Svg>
);
export const TagGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    <path d="M6 20 L20 6 H34 V20 L20 34 Z" {...S(color)} />
    <circle cx={27} cy={13} r={2.5} fill={color} />
  </Svg>
);
export const HashGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    <path d="M15 6 L12 34 M27 6 L24 34 M7 15 H34 M6 26 H33" {...S(color)} />
  </Svg>
);
export const MedalGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    <path d="M13 4 L18 16 M27 4 L22 16" {...S(color)} />
    <circle cx={20} cy={26} r={10} {...S(color)} />
    <path d="M20 21 V31" {...S(color)} />
  </Svg>
);

// Solid arrow pointing right (rotate as needed).
export const Arrow: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 100 60" style={{ display: "block", overflow: "visible" }}>
    <path d="M6 30 H70" stroke={color} strokeWidth={12} strokeLinecap="round" />
    <path d="M58 8 L92 30 L58 52 Z" fill={color} stroke={color} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);
