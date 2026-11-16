// Reel cover: WHAT IS THE IQR? · explained in 2 minutes · a box plot over four 25% quarters, IQR = Q3 − Q1 · handle.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const V = C.violet;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={V} b={C.cyan} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 104, color: C.text }}>WHAT IS THE</div>
      <div style={{ marginTop: 10, fontSize: 250, letterSpacing: "0.01em", background: `linear-gradient(90deg, ${C.cyan}, ${V})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(V, 0.5)})` }}>IQR?</div>
      <div style={{ marginTop: 26, fontSize: 52, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>

    <div style={{ position: "absolute", left: 90, top: 1020, width: 900, height: 420, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }}>
      <svg width={900} height={420} viewBox="0 0 900 420" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {/* box plot */}
        <line x1={110} y1={120} x2={285} y2={120} stroke={V} strokeWidth={5} />
        <line x1={615} y1={120} x2={790} y2={120} stroke={V} strokeWidth={5} />
        <line x1={110} y1={92} x2={110} y2={148} stroke={V} strokeWidth={5} />
        <line x1={790} y1={92} x2={790} y2={148} stroke={V} strokeWidth={5} />
        <rect x={285} y={78} width={330} height={84} rx={12} fill={alpha(V, 0.28)} stroke={V} strokeWidth={5} style={{ filter: `drop-shadow(0 0 14px ${alpha(V, 0.5)})` }} />
        <line x1={450} y1={78} x2={450} y2={162} stroke={C.green} strokeWidth={5} />
        <text x={285} y={56} textAnchor="middle" fontFamily={theme.fonts.mono} fontWeight={800} fontSize={30} fill={C.cyan}>Q1</text>
        <text x={615} y={56} textAnchor="middle" fontFamily={theme.fonts.mono} fontWeight={800} fontSize={30} fill={C.cyan}>Q3</text>
        {/* four quarters */}
        {[0, 1, 2, 3].map((q) => (
          <g key={q}>
            <rect x={110 + q * 170 + 4} y={210} width={162} height={70} rx={14} fill={q === 1 || q === 2 ? alpha(V, 0.45) : alpha("#E4EEFF", 0.15)} stroke={q === 1 || q === 2 ? V : alpha("#E4EEFF", 0.4)} strokeWidth={3} />
            <text x={110 + q * 170 + 85} y={255} textAnchor="middle" fontFamily={theme.fonts.mono} fontWeight={800} fontSize={28} fill={C.text}>25%</text>
          </g>
        ))}
        <path d="M280 300 L280 316 L620 316 L620 300" stroke={V} strokeWidth={5} fill="none" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 46, color: C.text }}>
        <span style={{ color: V, textShadow: glowText(V, 0.5) }}>IQR</span> = <span style={{ color: C.cyan }}>Q3</span> - <span style={{ color: C.cyan }}>Q1</span>
      </div>
    </div>

    <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
