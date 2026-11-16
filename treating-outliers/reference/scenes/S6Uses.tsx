// SCENE 6 — WHERE IT'S USEFUL. Three cards, each with a tiny live demo:
// skewed data (the SD gets inflated, the IQR doesn't) · box plots (the box IS the IQR) · catching outliers (1.5 × IQR fences).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const V = kindColor.spread;
const O = kindColor.outlier;

const Mini: React.FC<{ kind: number; m: number }> = ({ kind, m }) => {
  const W = 260;
  const H = 140;
  const k = (a: number, b: number) => interpolate(m, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (kind === 0) {
    const hs = [46, 92, 120, 96, 70, 48, 30, 20];
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        <line x1={0} y1={132} x2={W} y2={132} stroke={alpha(C.text, 0.35)} strokeWidth={3} />
        {hs.map((h, i) => (
          <rect key={i} x={4 + i * 26} y={132 - h * k(0, 0.5)} width={20} height={h * k(0, 0.5)} rx={4} fill={i >= 1 && i <= 4 ? alpha(V, 0.8) : alpha("#E4EEFF", 0.6)} />
        ))}
        <rect x={234} y={132 - 26 * k(0.3, 0.7)} width={22} height={26 * k(0.3, 0.7)} rx={4} fill={O} style={{ filter: `drop-shadow(0 0 6px ${O})` }} />
        <path d={`M30 ${10 + (1 - k(0.5, 1)) * 10} L30 2 L130 2 L130 ${10 + (1 - k(0.5, 1)) * 10}`} stroke={V} strokeWidth={4} fill="none" opacity={k(0.5, 1)} />
      </svg>
    );
  }
  if (kind === 1) {
    const b = k(0, 0.5);
    const w = k(0.4, 1);
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        <line x1={96 - 70 * w} y1={70} x2={96} y2={70} stroke={V} strokeWidth={4} />
        <line x1={176} y1={70} x2={176 + 64 * w} y2={70} stroke={V} strokeWidth={4} />
        <rect x={96} y={40} width={80 * b} height={60} rx={8} fill={alpha(V, 0.25)} stroke={V} strokeWidth={4} />
        <line x1={128} y1={40} x2={128} y2={100} stroke={C.text} strokeWidth={4} opacity={b} />
        <text x={96} y={124} textAnchor="middle" fontFamily={theme.fonts.mono} fontWeight={800} fontSize={20} fill={C.cyan} opacity={b}>Q1</text>
        <text x={176} y={124} textAnchor="middle" fontFamily={theme.fonts.mono} fontWeight={800} fontSize={20} fill={C.cyan} opacity={b}>Q3</text>
        <text x={136} y={28} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={20} fill={V} opacity={w}>IQR</text>
      </svg>
    );
  }
  const f = k(0.3, 0.8);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <rect x={90} y={44} width={60} height={52} rx={8} fill={alpha(V, 0.25)} stroke={V} strokeWidth={4} opacity={k(0, 0.3)} />
      {[34, 206].map((x) => (
        <line key={x} x1={x} y1={20} x2={x} y2={20 + 100 * f} stroke={C.text} strokeWidth={3} strokeDasharray="7 6" />
      ))}
      <circle cx={244} cy={70} r={11 * k(0.7, 1)} fill={O} style={{ filter: `drop-shadow(0 0 6px ${O})` }} />
      <circle cx={244} cy={70} r={22 * k(0.8, 1)} fill="none" stroke={O} strokeWidth={3} />
    </svg>
  );
};

const CARDS = [
  { y: 640, n: 1, title: "SKEWED DATA", sub: "salaries, house prices", note: "huge values inflate the SD, not the IQR", col: O, word: { i: 1, w: "skewed" } },
  { y: 880, n: 2, title: "BOX PLOTS", sub: "the box IS the IQR", note: "Q1 to Q3, the median inside", col: V, word: { i: 2, w: "box" } },
  { y: 1120, n: 3, title: "CATCHING OUTLIERS", sub: "beyond 1.5 × IQR from the box", note: "commute fences: 10 and 42, so the jam is flagged", col: C.cyan, word: { i: 3, w: "outliers:" } },
];

export const S6Uses: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const Q = s.cueS(0, "IQR?");

  return (
    <AbsoluteFill>
      <Pop at={4} out={s.cueS(1, "skewed") - 8} x={540} y={800} from="up" dist={24} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 80, lineHeight: 1.05, color: C.text, whiteSpace: "nowrap" }}>
          WHEN SHOULD
          <br />
          YOU USE <span style={{ color: V, textShadow: glowText(V, 0.6) }}>IT?</span>
        </div>
      </Pop>
      <SceneTitle label="WHERE IT'S USEFUL" pill="WHEN TO USE THE IQR" color={V} at={2} pillAt={Q - 6} />
      {CARDS.map((c, i) => {
        const at = s.cueS(c.word.i, c.word.w) - 4;
        const p = spr(at, theme.spring.smooth);
        if (p <= 0.001) return null;
        const m = ease(frame, [at + 6, at + 34], [0, 1], theme.ease.inOut);
        return (
          <div key={c.title} style={{ position: "absolute", left: 90, top: c.y - 100, width: 900, height: 200, boxSizing: "border-box", padding: "26px 28px", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(c.col, 0.18)}, rgba(14,24,64,0.9) 55%)`, border: `2.5px solid ${alpha(c.col, 0.75)}`, boxShadow: `0 0 26px ${alpha(c.col, 0.18)}`, opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * 60}px)`, clipPath: `inset(0 ${(1 - p) * 100}% 0 0 round 30px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 46, height: 46, borderRadius: 23, background: c.col, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26 }}>{c.n}</div>
              <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: c.col, textShadow: glowText(c.col, 0.35), whiteSpace: "nowrap" }}>{c.title}</span>
            </div>
            <div style={{ marginTop: 12, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 27, color: C.text, whiteSpace: "nowrap" }}>{c.sub}</div>
            <div style={{ marginTop: 8, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 21, color: C.dim, whiteSpace: "nowrap", opacity: m }}>{c.note}</div>
            <div style={{ position: "absolute", right: 26, top: 30 }}>
              <Mini kind={i} m={m} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
