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

// ---------- Mean / Median / Mode props ----------
const TEA = "#C98A4B"; // illustration colour for tea (not a semantic accent)

// A "cutting chai" glass: tapered glass, tea, foam line, highlight.
export const ChaiCup: React.FC<{ w: number; glow?: string }> = ({ w, glow }) => (
  <svg width={w} height={w * 0.66} viewBox="0 0 60 40" style={{ display: "block", overflow: "visible", filter: glow ? `drop-shadow(0 0 6px ${glow})` : undefined }}>
    <path d="M6 3 H54 L48 38 H12 Z" fill="rgba(220,235,255,0.18)" stroke="rgba(230,240,255,0.75)" strokeWidth={2.4} strokeLinejoin="round" />
    <path d="M9.2 11 H50.8 L47.4 35.6 H12.6 Z" fill={TEA} />
    <path d="M9.2 11 H50.8 L50.2 14.5 H9.8 Z" fill="#F1D3A8" />
    <path d="M15 16 L17 33" stroke="rgba(255,255,255,0.45)" strokeWidth={3} strokeLinecap="round" />
  </svg>
);

export const Kettle: React.FC<{ size: number; fill?: number }> = ({ size, fill = 0 }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 200 180" style={{ display: "block", overflow: "visible" }}>
    <defs>
      <linearGradient id="kettle" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3B4A9C" />
        <stop offset="1" stopColor="#1C2560" />
      </linearGradient>
      <clipPath id="kettle-body">
        <path d="M40 60 C40 40 160 40 160 60 L170 150 C170 168 30 168 30 150 Z" />
      </clipPath>
    </defs>
    <path d="M160 80 C192 80 196 120 172 130" stroke="#5B6BC0" strokeWidth={10} fill="none" strokeLinecap="round" />
    <path d="M40 90 L6 52" stroke="#5B6BC0" strokeWidth={14} strokeLinecap="round" />
    <path d="M40 60 C40 40 160 40 160 60 L170 150 C170 168 30 168 30 150 Z" fill="url(#kettle)" stroke="rgba(170,200,255,0.5)" strokeWidth={3} />
    <g clipPath="url(#kettle-body)">
      <rect x={20} y={168 - 120 * fill} width={160} height={130} fill={TEA} opacity={0.9} />
      <rect x={20} y={168 - 120 * fill} width={160} height={6} fill="#F1D3A8" opacity={fill > 0.02 ? 1 : 0} />
    </g>
    <ellipse cx={100} cy={46} rx={46} ry={10} fill="#5B6BC0" />
    <circle cx={100} cy={34} r={9} fill="#7B8BE0" />
    <path d="M58 70 C60 62 70 58 80 58" stroke="rgba(255,255,255,0.4)" strokeWidth={6} strokeLinecap="round" fill="none" />
  </svg>
);

// Head-and-shoulders avatar for a "friend".
export const Avatar: React.FC<{ size: number; shirt: string; skin?: string; hair?: string; mood?: number }> = ({ size, shirt, skin = C.skin[0], hair = C.hair[0], mood = 0.6 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    <path d="M14 100 C14 74 30 64 50 64 C70 64 86 74 86 100 Z" fill={shirt} />
    <circle cx={50} cy={40} r={24} fill={skin} />
    <path d="M26 40 C25 20 37 13 50 13 C64 13 75 20 74 40 C68 31 60 28 50 28 C40 28 32 31 26 40 Z" fill={hair} />
    <circle cx={42} cy={43} r={2.8} fill={C.ink} />
    <circle cx={58} cy={43} r={2.8} fill={C.ink} />
    {mood > 1.5 ? (
      <ellipse cx={50} cy={53} rx={4.5} ry={5.5} fill={C.ink} />
    ) : (
      <path d={`M44 51 Q50 ${51 + mood * 6} 56 51`} stroke={C.ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />
    )}
  </svg>
);

export const Crown: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 100 70" style={{ display: "block", overflow: "visible", filter: `drop-shadow(0 0 10px ${alpha(color, 0.7)})` }}>
    <path d="M8 60 L14 18 L34 40 L50 8 L66 40 L86 18 L92 60 Z" fill={color} stroke="rgba(255,255,255,0.6)" strokeWidth={3} strokeLinejoin="round" />
    <rect x={8} y={56} width={84} height={10} rx={4} fill={color} />
    {[14, 50, 86].map((x, i) => (
      <circle key={i} cx={x} cy={i === 1 ? 8 : 18} r={6} fill="#FFFFFF" />
    ))}
  </svg>
);

export const ShoeBox: React.FC<{ w: number; color: string }> = ({ w, color }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 120 60" style={{ display: "block", overflow: "visible" }}>
    <rect x={2} y={10} width={116} height={48} rx={6} fill="#232A76" stroke={alpha(color, 0.6)} strokeWidth={2.5} />
    <rect x={0} y={4} width={120} height={14} rx={5} fill="#2E378E" stroke={alpha(color, 0.7)} strokeWidth={2.5} />
    <path d="M30 40 C46 46 70 44 90 32" stroke={alpha(color, 0.9)} strokeWidth={5} strokeLinecap="round" fill="none" />
  </svg>
);

// The rupee sign, drawn (the bundled latin font subsets have no ₹ glyph). Sized to sit inline with text.
export const Rupee: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size * 0.62} height={size} viewBox="0 0 62 100" style={{ display: "inline-block", verticalAlign: "-0.12em", overflow: "visible" }}>
    <path d="M8 14 H56 M8 34 H56 M14 14 C46 14 50 52 14 52 L48 92" stroke={color} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// "≠" drawn as SVG (not in the font subsets).
export const NotEqual: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    <path d="M16 38 H84 M16 62 H84 M64 14 L36 86" stroke={color} strokeWidth={10} strokeLinecap="round" />
  </svg>
);

// Glyphs for the three measures.
export const MeanGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    <path d="M6 34 V24 M14 34 V14 M22 34 V20 M30 34 V10" {...S(color)} />
    <path d="M3 20 H37" {...S(color)} strokeDasharray="3 3" />
  </Svg>
);
export const MedianGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    {[5, 12.5, 27.5, 35].map((x) => (
      <circle key={x} cx={x} cy={24} r={3} fill={color} opacity={0.5} />
    ))}
    <circle cx={20} cy={24} r={5} fill={color} />
    <path d="M20 6 V14" {...S(color)} />
  </Svg>
);
export const ModeGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    <path d="M7 30 L9 12 L16 20 L20 8 L24 20 L31 12 L33 30 Z" {...S(color)} />
  </Svg>
);
export const CupGlyph: React.FC<G> = ({ size, color }) => (
  <Svg size={size}>
    <path d="M8 8 H32 L29 34 H11 Z" {...S(color)} />
    <path d="M10 15 H30" {...S(color)} />
  </Svg>
);
