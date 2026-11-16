// SCENE 5 — THE 68-95-99.7 RULE. The bell on a standard-deviation axis. The ±1 SD band sweeps out (cyan, 68%),
// then ±2 (violet, 95%), then ±3 (green, 99.7%). Brackets under the axis stack up the three ranges.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Axis, Bell, type Band, type BellGeo, vx } from "../components/Bell";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const G5: BellGeo = { x0: 110, x1: 970, vmin: -3.7, vmax: 3.7, base: 1010, peakH: 340, sigmaRef: 1 };
export const SD_COL = [C.cyan, C.violet, C.green];
export const SD_TICKS = [-3, -2, -1, 0, 1, 2, 3].map((v) => ({ v, label: v === 0 ? "MEAN" : `${v > 0 ? "+" : "-"}${Math.abs(v)} SD` }));

// non-overlapping rings: [-1,1] cyan, the 1–2 SD ring violet, the 2–3 SD ring green; each sweeps out from the centre
export const ruleBands = (p: number[]): Band[] => {
  const out: Band[] = [];
  p.forEach((q, k) => {
    if (q <= 0.001) return;
    const inner = k;
    const outer = k + q;
    if (k === 0) out.push({ a: -outer, b: outer, color: SD_COL[0], opacity: 0.5 });
    else {
      out.push({ a: -outer, b: -inner, color: SD_COL[k], opacity: 0.45 });
      out.push({ a: inner, b: outer, color: SD_COL[k], opacity: 0.45 });
    }
  });
  return out;
};

export const Bracket: React.FC<{ g: BellGeo; a: number; b: number; y: number; p: number; color: string; label: string }> = ({ g, a, b, y, p, color, label }) => {
  if (p <= 0.001) return null;
  const xa = vx(g, a);
  const xb = vx(g, b);
  const mid = (xa + xb) / 2;
  const half = ((xb - xa) / 2) * p;
  return (
    <>
      <div style={{ position: "absolute", left: mid - half, top: y - 2.5, width: half * 2, height: 5, borderRadius: 3, background: color, boxShadow: `0 0 10px ${alpha(color, 0.6)}` }} />
      <div style={{ position: "absolute", left: mid - half - 2.5, top: y - 16, width: 5, height: 32, borderRadius: 3, background: color }} />
      <div style={{ position: "absolute", left: mid + half - 2.5, top: y - 16, width: 5, height: 32, borderRadius: 3, background: color }} />
      <div style={{ position: "absolute", left: mid, top: y, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), padding: "3px 16px", borderRadius: 999, background: "#0A1440", border: `3px solid ${color}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>{label}</div>
    </>
  );
};

export const S5Rule: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const RULE = s.sent(0).from;
  const W68 = s.cueS(1, "68");
  const W95 = s.cueS(2, "95");
  const W997 = s.cueS(3, "997");
  const END = s.duration;
  const at = [W68, W95, W997];
  const p = at.map((t) => ease(frame, [t - 4, t + 16], [0, 1], theme.ease.inOut));
  const BIGS = [
    { v: "68%", sub: "WITHIN 1 SD", c: SD_COL[0], at: W68, out: W95 - 4 },
    { v: "95%", sub: "WITHIN 2 SD", c: SD_COL[1], at: W95, out: W997 - 4 },
    { v: "99.7%", sub: "WITHIN 3 SD", c: SD_COL[2], at: W997, out: END - 6 },
  ];

  return (
    <AbsoluteFill>
      <SceneTitle label="THE 68-95-99.7 RULE" color={C.cyan} at={2} />
      <Bell g={G5} mu={0} sigma={1} p={ease(frame, [2, 22], [0, 1], theme.ease.inOut)} color={C.text} fill={0.08} width={5} bands={ruleBands(p)} />
      <Axis g={G5} ticks={SD_TICKS.map((t) => ({ ...t, color: Math.abs(t.v) >= 1 && p[Math.abs(t.v) - 1] > 0.5 ? SD_COL[Math.abs(t.v) - 1] : undefined }))} p={ease(frame, [4, 18], [0, 1])} />
      {[1, 2, 3].map((k) => (
        <div key={k} style={{ position: "absolute", left: 0, top: 0 }}>
          {[-k, k].map((v) => (
            <div key={v} style={{ position: "absolute", left: vx(G5, v) - 1.5, top: G5.base - 300, height: 300, borderLeft: `3px dashed ${alpha(SD_COL[k - 1], 0.7)}`, opacity: p[k - 1] }} />
          ))}
        </div>
      ))}
      <Pop at={RULE - 2} out={W68 - 6} x={540} y={500} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 86, color: C.text, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
          <span style={{ color: SD_COL[0] }}>68</span> · <span style={{ color: SD_COL[1] }}>95</span> · <span style={{ color: SD_COL[2] }}>99.7</span>
        </div>
      </Pop>
      {BIGS.map((b) => (
        <Pop key={b.v} at={b.at - 3} out={b.out} x={540} y={500} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 112, lineHeight: 1, color: b.c, textShadow: glowText(b.c, 0.7), whiteSpace: "nowrap" }}>{b.v}</div>
            <div style={{ marginTop: 6, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.22em", color: C.text, whiteSpace: "nowrap" }}>{b.sub}</div>
          </div>
        </Pop>
      ))}
      {[0, 1, 2].map((k) => (
        <Bracket key={k} g={G5} a={-(k + 1)} b={k + 1} y={G5.base + 92 + k * 72} p={spr(at[k] + 4, theme.spring.smooth)} color={SD_COL[k]} label={BIGS[k].v} />
      ))}
    </AbsoluteFill>
  );
};
