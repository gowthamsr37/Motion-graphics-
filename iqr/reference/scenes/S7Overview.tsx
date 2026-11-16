// SCENE 7 — THE COMPLETE PICTURE. Four ways outliers hurt an analysis, each with a tiny live demo:
// drag the average · inflate the spread · tilt trend lines · squash charts. Then "Just delete them?" → NOT SO FAST!
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Arrow, MeanGlyph, Rupee, SpreadGlyph } from "../components/Icons";
import { BarsGlyph, Stamp, TrashGlyph, TrendGlyph } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Orb, Wires } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const O = kindColor.outlier;
type Pt = [number, number];
const poly = (pts: Pt[]) => {
  const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  const at = (t: number): Pt => {
    let d = t * total;
    for (let i = 0; i < segs.length; i++) {
      if (d <= segs[i] || i === segs.length - 1) {
        const k = segs[i] ? Math.min(1, d / segs[i]) : 0;
        return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
      }
      d -= segs[i];
    }
    return pts[pts.length - 1];
  };
  return { d: pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" "), at };
};

const ROOT: Pt = [150, 430];
const TRUNK_X = 150;
const CARD_X = 228;
const CARD_W = 752;
const CARD_H = 166;
const R = (n: number) => <Rupee size={n} color={C.text} />;
const AR = <span style={{ display: "inline-block", margin: "0 6px", verticalAlign: "-0.1em" }}><Arrow size={22} color={C.dim} /></span>;
const LEAVES = [
  { y: 625, name: "DRAG THE AVERAGE", color: C.cyan, glyph: MeanGlyph, word: "drag", ex: <>mean {R(24)}40K {AR} {R(24)}1 crore</> },
  { y: 810, name: "INFLATE THE SPREAD", color: C.violet, glyph: SpreadGlyph, word: "inflate", ex: <>range {R(24)}18K {AR} {R(24)}10 crore</> },
  { y: 995, name: "TILT TREND LINES", color: C.green, glyph: TrendGlyph, word: "tilt", ex: <>+6.6 {AR} +0.6 marks per hour</> },
  { y: 1180, name: "SQUASH YOUR CHARTS", color: O, glyph: BarsGlyph, word: "squash", ex: <>one giant bar flattens the rest</> },
];

// tiny live demos (220 × 110), m = 0 → 1
const Mini: React.FC<{ kind: number; m: number; color: string }> = ({ kind, m, color }) => {
  const W = 220;
  const H = 110;
  const base = [24, 44, 60, 76, 96];
  if (kind === 0 || kind === 1) {
    const out = interpolate(m, [0, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const k = interpolate(m, [0.3, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        <line x1={6} y1={70} x2={W - 6} y2={70} stroke={alpha(C.text, 0.35)} strokeWidth={3} />
        {kind === 1 ? <rect x={interpolate(k, [0, 1], [24, 18])} y={50} width={interpolate(k, [0, 1], [72, 192])} height={40} rx={10} fill={alpha(color, 0.25)} stroke={color} strokeWidth={3} /> : null}
        {base.map((x) => (
          <circle key={x} cx={x} cy={70} r={8} fill="#E4EEFF" />
        ))}
        <circle cx={204} cy={70} r={10 * out} fill={O} style={{ filter: `drop-shadow(0 0 6px ${O})` }} />
        {kind === 0 ? (
          <>
            <line x1={interpolate(k, [0, 1], [60, 118])} y1={30} x2={interpolate(k, [0, 1], [60, 118])} y2={96} stroke={color} strokeWidth={5} strokeLinecap="round" />
            <text x={interpolate(k, [0, 1], [60, 118])} y={20} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={800} fontSize={16} letterSpacing="2" fill={color}>MEAN</text>
          </>
        ) : null}
      </svg>
    );
  }
  if (kind === 2) {
    const k = interpolate(m, [0.3, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const y2 = interpolate(k, [0, 1], [14, 52]);
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        {[
          [24, 86],
          [56, 70],
          [88, 58],
          [120, 44],
          [152, 30],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r={7} fill="#E4EEFF" />
        ))}
        <line x1={10} y1={interpolate(k, [0, 1], [94, 62])} x2={210} y2={y2} stroke={color} strokeWidth={5} strokeLinecap="round" />
        <circle cx={196} cy={100} r={9 * interpolate(m, [0, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} fill={O} style={{ filter: `drop-shadow(0 0 6px ${O})` }} />
      </svg>
    );
  }
  const k = interpolate(m, [0.2, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hs = [62, 80, 54, 72, 66];
  const sc = interpolate(k, [0, 1], [1, 0.12]);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <line x1={4} y1={104} x2={W - 4} y2={104} stroke={alpha(C.text, 0.35)} strokeWidth={3} />
      {hs.map((h, i) => (
        <rect key={i} x={10 + i * 34} y={104 - h * sc} width={24} height={h * sc} rx={4} fill="#E4EEFF" opacity={0.75} />
      ))}
      <rect x={182} y={104 - 100 * k} width={28} height={100 * k} rx={4} fill={O} style={{ filter: `drop-shadow(0 0 6px ${O})` }} />
    </svg>
  );
};

const Leaf: React.FC<{ leaf: (typeof LEAVES)[number]; idx: number; at: number; dim: number }> = ({ leaf, idx, at, dim }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const p = spr(at, theme.spring.smooth);
  if (p <= 0.001) return null;
  const G = leaf.glyph;
  const m = ease(frame, [at + 6, at + 30], [0, 1], theme.ease.inOut);
  return (
    <div
      style={{
        position: "absolute",
        left: CARD_X,
        top: leaf.y - CARD_H / 2,
        width: CARD_W,
        height: CARD_H,
        boxSizing: "border-box",
        padding: "24px 26px",
        borderRadius: 30,
        background: `linear-gradient(90deg, ${alpha(leaf.color, 0.2)}, ${alpha("#101A4A", 0.88)} 62%)`,
        border: `2.5px solid ${alpha(leaf.color, 0.7)}`,
        boxShadow: `0 20px 40px -22px rgba(0,0,0,0.8), 0 0 24px ${alpha(leaf.color, 0.18)}`,
        overflow: "hidden",
        opacity: Math.min(1, p * 1.5) * dim,
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0 round 30px)`,
        transform: `translateX(${(1 - p) * 40}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <G size={38} color={leaf.color} />
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 33, color: leaf.color, textShadow: glowText(leaf.color, 0.35), whiteSpace: "nowrap" }}>{leaf.name}</span>
      </div>
      <div style={{ marginTop: 16, whiteSpace: "nowrap", fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 26, color: C.text }}>{leaf.ex}</div>
      <div style={{ position: "absolute", right: 22, top: (CARD_H - 110) / 2 }}>
        <Mini kind={idx} m={m} color={leaf.color} />
      </div>
    </div>
  );
};

export const S7Overview: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const HERE = s.sent(0).from;
  const at = LEAVES.map((l, i) => s.cueS(i + 1, l.word));
  const DEL = s.sent(5).from;
  const DELW = s.cueS(5, "delete");
  const NOT = s.cueS(5, "Not");
  const END = s.duration;
  const OUT = END - 12;

  const push = interpolate(frame, [0, END], [1, 1.03], { easing: theme.ease.soft });
  const out = ease(frame, [OUT, END], [0, 1], theme.ease.in);
  const draw = (a: number, b: number) => ease(frame, [a, b], [0, 1], theme.ease.inOut);
  const wires = LEAVES.map((l, i) => {
    const w = poly([[TRUNK_X, i === 0 ? ROOT[1] + 56 : LEAVES[i - 1].y], [TRUNK_X, l.y], [CARD_X - 4, l.y]]);
    return { d: w.d, at: w.at, color: l.color, p: draw(at[i] - 10, at[i] + 1), pulseFrom: at[i] + 10 };
  });
  const rootIn = spr(0, theme.spring.pop);
  const dim = 1 - 0.72 * ease(frame, [DEL - 4, DEL + 8], [0, 1]);
  const del = spr(DELW - 6, theme.spring.bouncy);

  return (
    <AbsoluteFill style={{ transformOrigin: "540px 860px", transform: `scale(${push * (1 - out * 0.12)})`, opacity: 1 - out }}>
      <Pop at={HERE - 4} x={540} y={300} from="up" dist={20}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.26em", color: C.dim, whiteSpace: "nowrap" }}>THE COMPLETE PICTURE</div>
      </Pop>
      <AbsoluteFill style={{ opacity: dim }}>
        <Wires wires={wires} />
        <div style={{ position: "absolute", left: ROOT[0], top: ROOT[1], transform: `translate(-50%, -50%) scale(${rootIn})` }}>
          <Orb size={104} />
        </div>
        <Pop at={4} x={560} y={ROOT[1]} from="left" dist={30}>
          <div style={{ width: 640, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, lineHeight: 1.02, color: C.text, letterSpacing: "-0.01em" }}>
            WHAT <span style={{ color: O, textShadow: glowText(O, 0.5) }}>OUTLIERS</span>
            <br />
            DO TO ANALYSIS
          </div>
        </Pop>
      </AbsoluteFill>
      {LEAVES.map((l, i) => (
        <Leaf key={l.name} leaf={l} idx={i} at={at[i] - 2} dim={dim} />
      ))}

      {/* just delete them? not so fast */}
      {del > 0.01 ? (
        <div style={{ position: "absolute", left: 540, top: 860, transform: `translate(-50%, -50%) scale(${interpolate(del, [0, 1], [0.6, 1])})`, opacity: Math.min(1, del * 2), display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "34px 50px", borderRadius: 34, background: alpha("#060B2A", 0.9), border: `3px solid ${alpha(C.text, 0.25)}`, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.8)" }}>
          <div style={{ transform: `rotate(${Math.sin(frame / 4) * 4 * (frame < NOT ? 1 : 0)}deg)` }}>
            <TrashGlyph size={110} color={C.text} />
          </div>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 58, color: C.text, whiteSpace: "nowrap" }}>JUST DELETE THEM?</div>
        </div>
      ) : null}
      <Stamp at={NOT - 3} x={560} y={1050} color={O} size={54} rot={-5}>
        NOT SO FAST!
      </Stamp>
    </AbsoluteFill>
  );
};
