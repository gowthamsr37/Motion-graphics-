// SCENE 7 — THE COMPLETE PICTURE. Which pair to use: balanced numbers → mean ± SD, skewed/outliers → median + IQR, categories → mode + counts.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, Pop, useSpr } from "../components/Motion";
import { ModeGlyph, SDGlyph, SpreadGlyph } from "../components/Icons";
import { Orb, Wires } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
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
const CARD_W = 742;
const CARD_H = 196;
const LEAVES = [
  { y: 664, name: "BALANCED NUMBERS", color: theme.colors.green, glyph: SDGlyph, what: "heights, test scores", how: "", best: "NO EXTREME VALUES", c1: "MEAN", c2: "± STD DEV", word: "Balanced", bestWord: "mean" },
  { y: 890, name: "SKEWED / OUTLIERS", color: theme.colors.orange, glyph: SpreadGlyph, what: "salaries, house prices", how: "", best: "A FEW EXTREME VALUES", c1: "MEDIAN", c2: "+ IQR", word: "Skewed", bestWord: "median" },
  { y: 1116, name: "CATEGORIES", color: "#60A5FA", glyph: ModeGlyph, what: "phone brands, cities", how: "", best: "LABELS, NOT NUMBERS", c1: "MODE", c2: "+ COUNTS", word: "Categories:", bestWord: "mode," },
];

const Leaf: React.FC<{ leaf: (typeof LEAVES)[number]; at: number; bestAt: number; shineAt: number }> = ({ leaf, at, bestAt, shineAt }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const p = spr(at, theme.spring.smooth);
  const b = spr(bestAt, theme.spring.pop);
  const shine = ease(frame, [shineAt, shineAt + 22], [-0.3, 1.3], theme.ease.inOut);
  if (p <= 0.001) return null;
  const G = leaf.glyph;
  return (
    <div
      style={{
        position: "absolute",
        left: CARD_X,
        top: leaf.y - CARD_H / 2,
        width: CARD_W,
        height: CARD_H,
        boxSizing: "border-box",
        padding: "22px 28px",
        borderRadius: 30,
        background: `linear-gradient(90deg, ${alpha(leaf.color, 0.2)}, ${alpha("#101A4A", 0.88)} 62%)`,
        border: `2.5px solid ${alpha(leaf.color, 0.7)}`,
        boxShadow: `0 20px 40px -22px rgba(0,0,0,0.8), 0 0 24px ${alpha(leaf.color, 0.18)}`,
        overflow: "hidden",
        opacity: Math.min(1, p * 1.5),
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0 round 30px)`,
        transform: `translateX(${(1 - p) * 40}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <G size={40} color={leaf.color} />
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: leaf.color, textShadow: glowText(leaf.color, 0.35), whiteSpace: "nowrap" }}>{leaf.name}</span>
      </div>
      <div style={{ marginTop: 8, maxWidth: 520, whiteSpace: "nowrap", fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 28, color: C.text }}>
        e.g. {leaf.what}
      </div>
      <div
        style={{
          position: "absolute",
          left: 28,
          bottom: 20,
          padding: "6px 14px",
          borderRadius: 12,
          background: alpha(leaf.color, 0.18),
          border: `1.5px solid ${alpha(leaf.color, 0.6)}`,
          fontFamily: theme.fonts.body,
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: "0.14em",
          color: C.text,
          opacity: b,
          transform: `scale(${interpolate(b, [0, 1], [0.7, 1])})`,
          transformOrigin: "0% 50%",
        }}
      >
        {leaf.best}
      </div>
      <div style={{ position: "absolute", right: 28, top: "50%", transform: `translateY(-50%) scale(${interpolate(b, [0, 1], [0.6, 1])})`, opacity: b, textAlign: "right", lineHeight: 1.05 }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: kindColor.centre, textShadow: glowText(kindColor.centre, 0.5) }}>{leaf.c1}</div>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: kindColor.spread, textShadow: glowText(kindColor.spread, 0.5) }}>{leaf.c2}</div>
      </div>
      {shine > -0.3 && shine < 1.3 ? (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${shine * 100}%`, width: 120, transform: "translateX(-50%) skewX(-20deg)", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />
      ) : null}
    </div>
  );
};

export const S7Overview: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const HERE = s.sent(0).from;
  const at = LEAVES.map((l, i) => s.cueS(i + 1, l.word));
  const bestAt = LEAVES.map((l, i) => s.cueS(i + 1, l.bestWord));
  const END = s.duration;
  const OUT = END - 12;
  const SHINE = bestAt[2] + 16;

  const push = interpolate(frame, [0, END], [1, 1.03], { easing: theme.ease.soft });
  const out = ease(frame, [OUT, END], [0, 1], theme.ease.in);
  const draw = (a: number, b: number) => ease(frame, [a, b], [0, 1], theme.ease.inOut);
  const wires = LEAVES.map((l, i) => {
    const w = poly([[TRUNK_X, i === 0 ? ROOT[1] + 56 : LEAVES[i - 1].y], [TRUNK_X, l.y], [CARD_X - 4, l.y]]);
    return { d: w.d, at: w.at, color: l.color, p: draw(at[i] - 10, at[i] + 1), pulseFrom: at[i] + 10 };
  });
  const rootIn = spr(0, theme.spring.pop);
  const pulse = Math.max(0, 1 - Math.abs(frame - SHINE) / 10);

  return (
    <AbsoluteFill style={{ transformOrigin: "540px 860px", transform: `scale(${push * (1 - out * 0.12)})`, opacity: 1 - out }}>
      <Pop at={HERE - 4} x={540} y={300} from="up" dist={20}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.26em", color: C.dim, whiteSpace: "nowrap" }}>THE COMPLETE PICTURE</div>
      </Pop>
      <Wires wires={wires} />
      <div style={{ position: "absolute", left: ROOT[0], top: ROOT[1], transform: `translate(-50%, -50%) scale(${rootIn})` }}>
        <Orb size={104} pulse={pulse} />
      </div>
      <Pop at={4} x={540} y={ROOT[1]} from="left" dist={30}>
        <div style={{ width: 620, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, lineHeight: 1.02, color: C.text, letterSpacing: "-0.01em", textShadow: glowText(C.cyan, 0.3 + pulse) }}>
          WHEN TO
          <br />
          USE WHAT
        </div>
      </Pop>
      {LEAVES.map((l, i) => (
        <Leaf key={l.name} leaf={l} at={at[i] - 2} bestAt={bestAt[i] - 2} shineAt={SHINE + i * 4} />
      ))}
    </AbsoluteFill>
  );
};
