// Reel cover for the 100 DAYS OF MACHINE LEARNING series: a deep PLUM background (ML covers only; the statistics
// covers stay navy) with magenta and orange glows, NEW SERIES tag, 100 DAYS OF / MACHINE LEARNING, six topic tiles that
// show the whole range of the series (regression, classification, decision trees, clustering, random forest, deep
// learning), COMING SOON, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Grade, Grain, Vignette } from "./components/Backdrop";
import { ML } from "./components/ML";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

const PINK = "#F0ABFC";
const W = 150;
const H = 84;
const svg = (children: React.ReactNode) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
    {children}
  </svg>
);
const REG = [[10, 70], [26, 62], [38, 64], [52, 50], [66, 52], [80, 40], [94, 36], [108, 28], [122, 22], [138, 14]];
const Regression = () => svg(<>{REG.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5} fill={C.cyan} />)}<line x1={4} y1={76} x2={146} y2={10} stroke={C.yellow} strokeWidth={4} strokeLinecap="round" /></>);
const Classification = () =>
  svg(
    <>
      {[[16, 20], [30, 36], [20, 52], [42, 18], [48, 44], [60, 26]].map(([x, y], i) => <circle key={`a${i}`} cx={x} cy={y} r={6} fill={C.cyan} />)}
      {[[92, 58], [108, 40], [122, 66], [134, 48], [100, 74], [128, 24]].map(([x, y], i) => <rect key={`b${i}`} x={x - 6} y={y - 6} width={12} height={12} rx={2} fill={ML.glowB} />)}
      <line x1={58} y1={84} x2={104} y2={0} stroke={C.text} strokeWidth={3} strokeDasharray="6 6" />
    </>,
  );
const Tree = () =>
  svg(
    <>
      <path d="M75 14 L40 44 M75 14 L110 44 M40 44 L22 74 M40 44 L58 74 M110 44 L92 74 M110 44 L128 74" stroke={alpha(C.text, 0.6)} strokeWidth={3} fill="none" />
      <rect x={63} y={4} width={24} height={18} rx={5} fill={C.green} />
      {[40, 110].map((x) => <rect key={x} x={x - 12} y={36} width={24} height={16} rx={5} fill={PINK} />)}
      {[22, 58, 92, 128].map((x, i) => <circle key={x} cx={x} cy={74} r={8} fill={i % 2 ? ML.glowB : C.cyan} />)}
    </>,
  );
const Clusters = () =>
  svg(
    <>
      {[
        { cx: 32, cy: 30, c: C.cyan },
        { cx: 112, cy: 26, c: ML.glowB },
        { cx: 74, cy: 64, c: C.green },
      ].map((g) => (
        <g key={g.c}>
          <circle cx={g.cx} cy={g.cy} r={22} fill={alpha(g.c, 0.14)} stroke={alpha(g.c, 0.7)} strokeWidth={2} strokeDasharray="4 4" />
          {[[-8, -6], [6, -9], [-3, 7], [9, 5], [0, -1]].map(([dx, dy], i) => <circle key={i} cx={g.cx + dx} cy={g.cy + dy} r={4.5} fill={g.c} />)}
        </g>
      ))}
    </>,
  );
const Forest = () =>
  svg(
    <>
      {[30, 75, 120].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 6 L${x - 22} 50 L${x + 22} 50 Z`} fill={alpha([C.green, PINK, C.cyan][i], 0.45)} stroke={[C.green, PINK, C.cyan][i]} strokeWidth={3} strokeLinejoin="round" />
          <rect x={x - 4} y={50} width={8} height={20} fill={alpha(C.text, 0.6)} />
        </g>
      ))}
      <line x1={10} y1={78} x2={140} y2={78} stroke={C.yellow} strokeWidth={3} strokeLinecap="round" />
    </>,
  );
const Net = () => {
  const L = [[20, 42], [75, 42], [130, 42]].map(([x], li) => (li === 1 ? [10, 32, 54, 76] : [20, 42, 64]).map((y) => [x, y]));
  return svg(
    <>
      {L[0].flatMap(([x1, y1]) => L[1].map(([x2, y2]) => <line key={`${x1}${y1}${x2}${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={alpha(C.text, 0.22)} strokeWidth={2} />))}
      {L[1].flatMap(([x1, y1]) => L[2].map(([x2, y2]) => <line key={`${x1}${y1}${x2}${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={alpha(C.text, 0.22)} strokeWidth={2} />))}
      {L.map((layer, li) => layer.map(([x, y]) => <circle key={`${li}${y}`} cx={x} cy={y} r={7} fill={[C.cyan, PINK, ML.glowB][li]} />))}
    </>,
  );
};
const TILES: { t: string; c: string; Icon: React.FC }[] = [
  { t: "REGRESSION", c: C.cyan, Icon: Regression },
  { t: "CLASSIFICATION", c: ML.glowB, Icon: Classification },
  { t: "DECISION TREES", c: C.green, Icon: Tree },
  { t: "CLUSTERING", c: C.cyan, Icon: Clusters },
  { t: "RANDOM FOREST", c: PINK, Icon: Forest },
  { t: "DEEP LEARNING", c: ML.glowB, Icon: Net },
];

export const MLBackdrop: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 75% at 50% 30%, ${ML.bg2} 0%, ${ML.bg} 58%, #07020D 100%)` }}>
    <div style={{ position: "absolute", width: 1500, height: 1500, left: -700, top: -520, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(ML.glowA, 0.3)} 0%, ${alpha(ML.glowA, 0.08)} 38%, transparent 62%)` }} />
    <div style={{ position: "absolute", width: 1500, height: 1500, right: -720, bottom: -420, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(ML.glowB, 0.24)} 0%, ${alpha(ML.glowB, 0.06)} 40%, transparent 62%)` }} />
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${alpha("#F5C2FF", 0.14)} 1.6px, transparent 1.9px)`, backgroundSize: "54px 54px", WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, black 20%, transparent 78%)", maskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, black 20%, transparent 78%)" }} />
  </AbsoluteFill>
);

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: ML.bg }}>
    <MLBackdrop />
    <div style={{ position: "absolute", left: 540, top: 250, transform: "translate(-50%, -50%)", padding: "10px 28px", borderRadius: 999, background: alpha(ML.glowA, 0.2), border: `2px solid ${ML.glowA}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.24em", color: ML.ink, whiteSpace: "nowrap" }}>NEW SERIES</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 250, lineHeight: 0.95, color: C.yellow, textShadow: glowText(C.yellow, 0.6) }}>100</div>
      <div style={{ marginTop: 4, fontSize: 76, letterSpacing: "0.06em", color: ML.ink }}>DAYS OF</div>
      <div style={{ marginTop: 18, fontSize: 112, background: `linear-gradient(90deg, ${C.cyan}, #F0ABFC, ${ML.glowB})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 28px ${alpha(ML.glowA, 0.55)})` }}>MACHINE</div>
      <div style={{ fontSize: 112, background: `linear-gradient(90deg, ${C.cyan}, #F0ABFC, ${ML.glowB})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 28px ${alpha(ML.glowA, 0.55)})` }}>LEARNING</div>
    </div>
    {TILES.map((tile, i) => (
      <div key={tile.t} style={{ position: "absolute", left: 230 + (i % 3) * 310, top: 1030 + Math.floor(i / 3) * 196, width: 288, height: 178, transform: "translate(-50%, -50%)", boxSizing: "border-box", borderRadius: 24, background: `linear-gradient(180deg, ${alpha(tile.c, 0.16)}, rgba(18,5,31,0.9))`, border: `2px solid ${alpha(tile.c, 0.75)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <tile.Icon />
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: tile.t.length > 12 ? 19 : 21, letterSpacing: "0.12em", color: ML.ink, whiteSpace: "nowrap" }}>{tile.t}</div>
      </div>
    ))}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1342, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: alpha(ML.ink, 0.8) }}>...AND 90+ MORE TOPICS</div>
    <div style={{ position: "absolute", left: 540, top: 1440, transform: "translate(-50%, -50%)", padding: "14px 40px", borderRadius: 999, background: alpha(C.yellow, 0.16), border: `3px solid ${C.yellow}`, boxShadow: `0 0 30px ${alpha(C.yellow, 0.4)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, letterSpacing: "0.04em", color: C.yellow, whiteSpace: "nowrap" }}>COMING SOON</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1530, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: ML.ink }}>
      <span style={{ color: "#F0ABFC" }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
