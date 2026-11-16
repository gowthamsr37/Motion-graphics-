// SCENE 7 — WHY IT MATTERS. Uncertainty → numbers you can plan with. Three cards, each with its own distribution:
// customers per hour (a count → bars), battery life (a measurement → a curve), rain tomorrow (two outcomes).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { Arrow, Person } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { BatteryGlyph, CloudGlyph, MiniBars } from "../components/Prob";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { CONT, DISC, PROB } from "./S1Hook";

const C = theme.colors;
// Poisson(4) shape for customers per hour, scaled to its peak
export const POIS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => {
  let f = 1;
  for (let i = 2; i <= k; i++) f *= i;
  return (Math.exp(-4) * 4 ** k) / f;
});
const POIS_N = POIS.map((v) => v / Math.max(...POIS));

export const S7Uses: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const at = [s.sent(1).from, s.sent(2).from, s.sent(3).from];
  const rows = [
    { y: 650, c: DISC, t: "CUSTOMERS PER HOUR", sub: "a count: bars", icon: <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>{[0, 1, 2].map((i) => <Person key={i} height={70 - i * 6} shirt={[C.cyan, C.violet, C.green][i]} />)}</div> },
    { y: 890, c: CONT, t: "BATTERY LIFE", sub: "a measurement: a curve", icon: <BatteryGlyph size={100} color={CONT} level={0.55 + 0.25 * Math.sin(frame / 12)} /> },
    { y: 1130, c: PROB, t: "RAIN TOMORROW?", sub: "two outcomes", icon: <CloudGlyph size={100} color={PROB} rain /> },
  ];

  return (
    <AbsoluteFill>
      <SceneTitle label="WHY IT MATTERS" color={PROB} at={2} />
      <Pop at={s.sent(0).from + 2} x={540} y={430} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 50, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: C.dim }}>UNCERTAINTY</span>
          <Arrow size={50} color={PROB} />
          <span style={{ color: PROB, textShadow: glowText(PROB, 0.5) }}>NUMBERS</span>
        </div>
      </Pop>
      {rows.map((r, i) => (
        <div key={`slot${i}`} style={{ position: "absolute", left: 90, top: r.y - 105, width: 900, height: 210, boxSizing: "border-box", borderRadius: 30, border: `3px dashed ${alpha("#F3F7FF", 0.22)}`, opacity: ease(frame, [4 + i * 4, 14 + i * 4], [0, 1]) * (1 - spr(at[i] - 6, theme.spring.bouncy)) }} />
      ))}
      {rows.map((r, i) => {
        const p = spr(at[i] - 6, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const g: BellGeo = { x0: 700, x1: 950, vmin: -3, vmax: 3, base: r.y + 70, peakH: 130, sigmaRef: 1 };
        const chart = ease(frame, [at[i] + 4, at[i] + 22], [0, 1], theme.ease.inOut);
        return (
          <div key={r.t} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * 70}px)` }}>
            <div style={{ position: "absolute", left: 90, top: r.y - 105, width: 900, height: 210, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(r.c, 0.18)}, rgba(14,24,64,0.9) 55%)`, border: `3px solid ${alpha(r.c, 0.7)}` }} />
            <div style={{ position: "absolute", left: 130, top: r.y, transform: "translateY(-50%)", width: 120, display: "flex", justifyContent: "center" }}>{r.icon}</div>
            <div style={{ position: "absolute", left: 270, top: r.y, transform: "translateY(-50%)" }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>{r.t}</div>
              <div style={{ marginTop: 6, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, color: r.c, whiteSpace: "nowrap" }}>{r.sub}</div>
            </div>
            {i === 0 ? (
              <div style={{ position: "absolute", left: 690, top: r.y - 64 }}>
                <MiniBars w={260} h={130} vals={POIS_N} color={DISC} p={chart} />
              </div>
            ) : i === 1 ? (
              <Bell g={g} mu={0} sigma={1} p={chart} color={CONT} fill={0.3} width={4} />
            ) : (
              <div style={{ position: "absolute", left: 720, top: r.y - 70, display: "flex", gap: 26, alignItems: "flex-end", height: 140 }}>
                {[
                  { l: "RAIN", v: 0.3 },
                  { l: "NO RAIN", v: 0.7 },
                ].map((b) => (
                  <div key={b.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.text }}>{b.v}</div>
                    <div style={{ width: 70, height: 110 * b.v * chart, borderRadius: 8, background: alpha(PROB, 0.55), border: `2px solid ${PROB}` }} />
                    <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 15, letterSpacing: "0.08em", color: C.dim, whiteSpace: "nowrap" }}>{b.l}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

