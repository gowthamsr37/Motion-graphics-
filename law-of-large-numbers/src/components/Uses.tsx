// CLT-uses kit: the five uses (polls, A/B tests, factories, insurance, ML) with colours and drawn icons, plus small chart
// helpers (a skewed "raw data" histogram and a bell) used by several scenes.
import React from "react";
import { interpolate } from "remotion";
import { useSpr } from "./Motion";
import { alpha, glowText, theme } from "../theme";

const C = theme.colors;
export const ML_PINK = "#F0ABFC";

export const Ballot: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    <rect x={16} y={42} width={68} height={46} rx={8} fill={alpha(color, 0.25)} stroke={color} strokeWidth={6} />
    <rect x={34} y={38} width={32} height={8} rx={3} fill={color} />
    <path d="M38 12 H66 V40 H38 Z" fill={alpha(C.text, 0.15)} stroke={C.text} strokeWidth={5} strokeLinejoin="round" />
    <path d="M44 26 L50 32 L60 20" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const ABIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    {[14, 56].map((x, i) => (
      <g key={x}>
        <rect x={x} y={14} width={30} height={72} rx={7} fill={alpha(i ? color : C.green, 0.2)} stroke={i ? color : C.green} strokeWidth={5} />
        <text x={x + 15} y={60} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={26} fill={C.text}>
          {i ? "B" : "A"}
        </text>
      </g>
    ))}
  </svg>
);
export const BottleIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    <path d="M42 8 H58 V22 Q58 28 68 34 Q74 38 74 46 V86 Q74 92 68 92 H32 Q26 92 26 86 V46 Q26 38 32 34 Q42 28 42 22 Z" fill={alpha(color, 0.25)} stroke={color} strokeWidth={5} strokeLinejoin="round" />
    <path d="M27 60 H73 V86 Q73 91 68 91 H32 Q27 91 27 86 Z" fill={alpha(color, 0.7)} />
    <rect x={40} y={2} width={20} height={8} rx={3} fill={C.cyan} />
  </svg>
);
export const Shield: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    <path d="M50 8 L84 20 V46 Q84 74 50 92 Q16 74 16 46 V20 Z" fill={alpha(color, 0.25)} stroke={color} strokeWidth={6} strokeLinejoin="round" />
    <path d="M36 50 L46 60 L66 38" fill="none" stroke={C.text} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const NetIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const L = [[20, [30, 70]], [50, [20, 50, 80]], [80, [50]]] as const;
  const pts = L.flatMap(([x, ys]) => ys.map((y) => [x, y] as const));
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
      {L[0][1].flatMap((y1) => L[1][1].map((y2) => <line key={`a${y1}${y2}`} x1={20} y1={y1} x2={50} y2={y2} stroke={alpha(color, 0.6)} strokeWidth={3} />))}
      {L[1][1].map((y1) => <line key={`b${y1}`} x1={50} y1={y1} x2={80} y2={50} stroke={alpha(color, 0.6)} strokeWidth={3} />)}
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill={alpha(color, 0.35)} stroke={color} strokeWidth={4} />)}
    </svg>
  );
};

export type Use = { n: number; title: string; short: string; c: string; Icon: React.FC<{ size: number; color: string }>; raw: string; avg: string; win: string };
export const USES: Use[] = [
  { n: 1, title: "ELECTION POLLS", short: "POLLS", c: C.cyan, Icon: Ballot, raw: "Each answer: yes / no", avg: "Share saying yes", win: "52% ±3% ranges" },
  { n: 2, title: "A/B TESTS", short: "A/B TESTS", c: C.orange, Icon: ABIcon, raw: "Spending: very skewed", avg: "Average spend per group", win: "Simple z / t tests" },
  { n: 3, title: "FACTORIES", short: "FACTORIES", c: C.green, Icon: BottleIcon, raw: "Single bottles vary", avg: "Hourly average of 5", win: "Control charts, ±3 SE" },
  { n: 4, title: "INSURANCE", short: "INSURANCE", c: C.violet, Icon: Shield, raw: "One customer: wild claims", avg: "Average of 100,000", win: "Predictable premiums" },
  { n: 5, title: "MACHINE LEARNING", short: "ML", c: ML_PINK, Icon: NetIcon, raw: "Each prediction: right / wrong", avg: "Accuracy on the test set", win: "88% to 92% range" },
];

// header for each use scene: big number badge + title + icon
export const UseHeader: React.FC<{ u: Use; at: number }> = ({ u, at }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.pop);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 540, top: 420, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", gap: 22, whiteSpace: "nowrap" }}>
      <div style={{ width: 84, height: 84, borderRadius: 42, background: u.c, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48 }}>{u.n}</div>
      <u.Icon size={90} color={u.c} />
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: u.title.length > 12 ? 58 : 66, color: C.text, textShadow: glowText(u.c, 0.5) }}>{u.title}</div>
    </div>
  );
};

// progress dots for uses 1–5
export const UseDots: React.FC<{ idx: number }> = ({ idx }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", gap: 14 }}>
    {USES.map((u, i) => (
      <div key={u.n} style={{ width: i === idx ? 70 : 40, height: 12, borderRadius: 6, background: i < idx ? alpha(u.c, 0.6) : i === idx ? u.c : alpha(C.text, 0.15), boxShadow: i === idx ? `0 0 12px ${u.c}` : "none" }} />
    ))}
  </div>
);

// raw-data → averages label pair
export const RawAvg: React.FC<{ y: number; rawAt: number; avgAt: number; raw: string; avg: string; c: string }> = ({ y, rawAt, avgAt, raw, avg, c }) => {
  const spr = useSpr();
  const a = spr(rawAt - 4, theme.spring.smooth);
  const b = spr(avgAt - 4, theme.spring.smooth);
  return (
    <>
      <div style={{ position: "absolute", left: 300, top: y, transform: "translateX(-50%)", opacity: Math.min(1, a * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.dim, whiteSpace: "nowrap" }}>{raw}</div>
      <div style={{ position: "absolute", left: 780, top: y, transform: "translateX(-50%)", opacity: Math.min(1, b * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: c, whiteSpace: "nowrap" }}>{avg}</div>
    </>
  );
};

export const skew = (v: number) => (v <= 0 ? 0 : v * Math.exp(-v * 1.6));
export const bell = (mu: number, sd: number) => (v: number) => Math.exp(-((v - mu) ** 2) / (2 * sd * sd));
