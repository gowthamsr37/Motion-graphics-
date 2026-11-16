// SCENE 8 — THE COMPLETE PICTURE. Three recap cards: distance in SDs (the formula) · sign = side, size = how unusual ·
// compare different scales and spot outliers.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { alpha, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { SUBJ } from "./S1Hook";
import { NEG, POS } from "./S6Reading";

const C = theme.colors;
const CARD_Y = [580, 850, 1120];

const MiniLine: React.FC<{ y: number; p: number }> = ({ y, p }) => (
  <>
    <div style={{ position: "absolute", left: 130, top: y + 30, width: 270, height: 4, background: alpha(C.text, 0.4) }} />
    <div style={{ position: "absolute", left: 160, top: y - 10, width: 6, height: 60, borderRadius: 3, background: kindColor.mean }} />
    {[0, 1].map((k) => (
      <div key={k} style={{ position: "absolute", left: 168 + k * 102, top: y - 34, width: 96 * Math.min(1, Math.max(0, p * 2 - k)), height: 40, borderRadius: 10, background: alpha(kindColor.sd, 0.3), border: `2px solid ${kindColor.sd}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 18, color: C.text }}>{k + 1} SD</div>
    ))}
    <div style={{ position: "absolute", left: 352, top: y + 18, width: 26, height: 26, borderRadius: 13, background: C.text }} />
  </>
);

const MiniSides: React.FC<{ y: number; p: number }> = ({ y, p }) => (
  <>
    <div style={{ position: "absolute", left: 130, top: y - 30, width: 135 * p, height: 70, marginLeft: 135 * (1 - p), borderRadius: "14px 0 0 14px", background: alpha(NEG, 0.35), border: `2px solid ${NEG}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: NEG, overflow: "hidden" }}>-</div>
    <div style={{ position: "absolute", left: 265, top: y - 30, width: 135 * p, height: 70, borderRadius: "0 14px 14px 0", background: alpha(POS, 0.35), border: `2px solid ${POS}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: POS, overflow: "hidden" }}>+</div>
    <div style={{ position: "absolute", left: 263, top: y - 44, width: 4, height: 98, background: C.text }} />
  </>
);

const MiniCompare: React.FC<{ y: number; p: number }> = ({ y, p }) => (
  <>
    {[
      { c: SUBJ.maths, w: 0.5 },
      { c: SUBJ.science, w: 1 },
    ].map((b, i) => (
      <div key={i} style={{ position: "absolute", left: 140, top: y - 38 + i * 46, width: 200 * b.w * p, height: 32, borderRadius: 8, background: alpha(b.c, 0.5), border: `2px solid ${b.c}` }} />
    ))}
    <div style={{ position: "absolute", left: 360, top: y - 30, width: 30, height: 30, borderRadius: 15, background: C.orange, boxShadow: `0 0 12px ${C.orange}`, opacity: p }} />
  </>
);

export const S8Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const at = [s.cueS(1, "distance"), s.cueS(2, "sign"), s.cueS(3, "compare")];
  const active = frame >= at[2] - 4 ? 2 : frame >= at[1] - 4 ? 1 : frame >= at[0] - 4 ? 0 : -1;
  const cards = [
    { c: C.green, t1: "DISTANCE IN SDs", t2: "z = (value - mean) ÷ SD", mono: true },
    { c: POS, t1: "SIGN = SIDE", t2: "size = how unusual", mono: false },
    { c: C.orange, t1: "COMPARE · SPOT OUTLIERS", t2: "different scales, one yardstick", mono: false },
  ];

  return (
    <AbsoluteFill>
      <SceneTitle label="THE COMPLETE PICTURE" color={C.green} at={2} pill="Z-SCORE" pillAt={s.sent(0).from} />
      {cards.map((k, i) => {
        const p = spr(at[i] - 6, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const y = CARD_Y[i];
        const on = active === i;
        const sw = spr(at[i] + 6, theme.spring.smooth);
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 2) * (on ? 1 : 0.72), transform: `translateX(${(1 - p) * -60}px)` }}>
            <div style={{ position: "absolute", left: 90, top: y - 115, width: 900, height: 230, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(k.c, 0.18)}, rgba(14,24,64,0.9) 50%)`, border: `3px solid ${on ? k.c : alpha(k.c, 0.5)}`, boxShadow: on ? `0 0 34px ${alpha(k.c, 0.35)}` : "none" }} />
            {i === 0 ? <MiniLine y={y} p={sw} /> : i === 1 ? <MiniSides y={y} p={sw} /> : <MiniCompare y={y} p={sw} />}
            <div style={{ position: "absolute", left: 440, top: y, transform: "translateY(-50%)" }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: i === 2 ? 36 : 42, color: k.c, whiteSpace: "nowrap", lineHeight: 1.1 }}>{k.t1}</div>
              <div style={{ marginTop: 8, fontFamily: k.mono ? theme.fonts.mono : theme.fonts.body, fontWeight: k.mono ? 800 : 700, fontSize: k.mono ? 28 : 26, color: k.mono ? C.text : C.dim, whiteSpace: "nowrap" }}>{k.t2}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
