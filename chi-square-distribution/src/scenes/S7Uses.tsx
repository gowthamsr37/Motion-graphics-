// SCENE 7 — WHERE IT'S USED: testing counts. Sales across the week (7 bars vs an even line) and what different groups
// of customers choose (two groups, three products).
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { EXP, FAIR, GAP, OBSC } from "./S1Hook";

const C = theme.colors;

export const S7Uses: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s7");
  const a = spr(s.cueS(0, "sales") - 8, theme.spring.bouncy);
  const b = spr(s.cueS(0, "groups") - 8, theme.spring.bouncy);
  const card = (p: number, y: number, title: string, body: React.ReactNode) =>
    p > 0.001 ? (
      <div style={{ position: "absolute", left: 540, top: y, width: 860, height: 340, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.8, 1])})`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 30, background: "rgba(14,24,64,0.92)", border: `3px solid ${alpha(OBSC, 0.6)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text }}>{title}</div>
        {body}
      </div>
    ) : null;
  return (
    <AbsoluteFill>
      <SceneTitle label="WHERE IT'S USED" color={OBSC} at={2} />
      {card(
        a,
        620,
        "SALES ACROSS THE WEEK",
        <div style={{ position: "relative", display: "flex", gap: 22, alignItems: "flex-end", height: 160 }}>
          {[80, 95, 70, 110, 120, 150, 140].map((v, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 60, height: v, borderRadius: "8px 8px 2px 2px", background: alpha(i >= 5 ? GAP : OBSC, 0.55), border: `3px solid ${i >= 5 ? GAP : OBSC}`, boxSizing: "border-box" }} />
              <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 18, color: C.dim }}>{"MTWTFSS"[i]}</div>
            </div>
          ))}
          <div style={{ position: "absolute", left: -10, right: -10, bottom: 133, borderTop: `4px dashed ${EXP}` }} />
        </div>,
      )}
      {card(
        b,
        1010,
        "WHAT DIFFERENT GROUPS CHOOSE",
        <div style={{ display: "flex", gap: 60, alignItems: "flex-end", height: 160 }}>
          {[
            [120, 60, 40],
            [50, 70, 110],
          ].map((grp, g) => (
            <div key={g} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                {grp.map((v, i) => <div key={i} style={{ width: 50, height: v, borderRadius: "8px 8px 2px 2px", background: alpha([OBSC, FAIR, GAP][i], 0.6), border: `3px solid ${[OBSC, FAIR, GAP][i]}`, boxSizing: "border-box" }} />)}
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: C.dim }}>GROUP {g ? "B" : "A"}</div>
            </div>
          ))}
        </div>,
      )}
    </AbsoluteFill>
  );
};
