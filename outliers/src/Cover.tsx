// Reel cover: WHAT ARE OUTLIERS? · explained in 2 minutes · a box plot over a dot plot (nine huddled values, one far away) · handle.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const O = C.orange;
const DOTS = [190, 228, 262, 262, 300, 334, 334, 370, 410];
const STACK = [0, 0, 0, 1, 0, 0, 1, 0, 0];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={O} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 340, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 112, color: C.text }}>WHAT ARE</div>
      <div style={{ marginTop: 18, fontSize: 168, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(C.violet, 0.45)})` }}>OUTLIERS?</div>
      <div style={{ marginTop: 34, fontSize: 52, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>

    {/* the picture: box plot over a dot plot, one value far from the rest */}
    <div style={{ position: "absolute", left: 90, top: 1010, width: 900, height: 420, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }}>
      <svg width={900} height={420} viewBox="0 0 900 420" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {/* box plot */}
        <line x1={190} y1={130} x2={262} y2={130} stroke={C.violet} strokeWidth={5} />
        <line x1={370} y1={130} x2={410} y2={130} stroke={C.violet} strokeWidth={5} />
        <line x1={190} y1={106} x2={190} y2={154} stroke={C.violet} strokeWidth={5} />
        <line x1={410} y1={106} x2={410} y2={154} stroke={C.violet} strokeWidth={5} />
        <rect x={262} y={92} width={108} height={76} rx={10} fill={alpha(C.violet, 0.25)} stroke={C.violet} strokeWidth={5} />
        <line x1={334} y1={92} x2={334} y2={168} stroke={C.text} strokeWidth={4} />
        <circle cx={760} cy={130} r={13} fill={O} style={{ filter: `drop-shadow(0 0 10px ${O})` }} />
        {/* dot plot */}
        <line x1={130} y1={300} x2={830} y2={300} stroke={alpha(C.text, 0.35)} strokeWidth={4} />
        {DOTS.map((x, i) => (
          <circle key={i} cx={x} cy={300 - STACK[i] * 34} r={15} fill="#E4EEFF" style={{ filter: `drop-shadow(0 0 8px ${alpha("#E4EEFF", 0.7)})` }} />
        ))}
        <circle cx={760} cy={300} r={19} fill={O} style={{ filter: `drop-shadow(0 0 14px ${O})` }} />
        <circle cx={760} cy={300} r={42} fill="none" stroke={O} strokeWidth={5} style={{ filter: `drop-shadow(0 0 10px ${alpha(O, 0.6)})` }} />
        <line x1={440} y1={350} x2={700} y2={350} stroke={O} strokeWidth={5} strokeDasharray="14 10" strokeLinecap="round" />
        <path d="M684 338 L702 350 L684 362" stroke={O} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", left: 760, top: 232, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: O, textShadow: glowText(O, 0.5), letterSpacing: "0.04em" }}>OUTLIER</div>
      <div style={{ position: "absolute", left: 300, top: 232, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, color: C.dim, letterSpacing: "0.22em" }}>THE REST</div>
      <div style={{ position: "absolute", left: 570, top: 384, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, color: alpha(O, 0.95), letterSpacing: "0.2em" }}>FAR AWAY</div>
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
