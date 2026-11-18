// SCENE 7 — THE RECIPE. ESTIMATE ± MARGIN OF ERROR · MARGIN = 1.96 × SE (about 2) · SE = SPREAD ÷ √n ·
// here SE = 10 ÷ √100 = 1, MARGIN = 2 → 32 ± 2 = 30 TO 34.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Radical } from "../components/Clt";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EST, RANGE } from "./S1Hook";

const C = theme.colors;

const Row: React.FC<{ y: number; at: number; n: number; c: string; children: React.ReactNode; big?: boolean }> = ({ y, at, n, c, children, big }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: big ? 170 : 150, transform: `translateY(-50%) translateX(${(1 - Math.min(1, p)) * -40}px)`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(90deg, ${alpha(c, 0.18)}, rgba(14,24,64,0.92) 60%)`, border: `3px solid ${alpha(c, 0.8)}`, display: "flex", alignItems: "center", gap: 26, paddingLeft: 30 }}>
      <div style={{ width: 56, height: 56, borderRadius: 28, flexShrink: 0, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.ink }}>{n}</div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: big ? 46 : 40, color: C.text, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 10 }}>{children}</div>
    </div>
  );
};

export const S7Recipe: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s7");
  const R4 = s.sent(3).from;
  const res = spr(s.cueS(3, "margin") - 4, theme.spring.pop);
  return (
    <AbsoluteFill>
      <SceneTitle label="THE RECIPE" pill="ALWAYS THE SAME" color={RANGE} at={2} pillAt={s.sent(0).from} />
      <Row y={530} at={s.cueS(0, "estimate,")} n={1} c={EST} big>
        <span style={{ color: EST }}>ESTIMATE</span> ± <span style={{ color: RANGE }}>MARGIN OF ERROR</span>
      </Row>
      <Row y={720} at={s.sent(1).from} n={2} c={RANGE}>
        MARGIN = <span style={{ fontFamily: theme.fonts.mono, color: RANGE }}>2</span> × STANDARD ERROR
      </Row>
      <Row y={900} at={s.sent(2).from} n={3} c={C.green}>
        STANDARD ERROR = SPREAD ÷ <Radical color={C.text} size={40}>n</Radical>
      </Row>
      <Row y={1080} at={R4} n={4} c={C.orange}>
        <span style={{ fontFamily: theme.fonts.mono }}>
          10 ÷ <Radical color={C.text} size={36}>100</Radical> = 1
        </span>
        <span style={{ color: C.dim, fontSize: 30 }}> · </span>
        MARGIN = <span style={{ fontFamily: theme.fonts.mono, color: C.orange }}>2</span>
      </Row>
      {res > 0.001 ? (
        <div style={{ position: "absolute", left: 540, top: 1270, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, res), [0, 1], [0.6, 1])})`, opacity: Math.min(1, res * 2), padding: "12px 32px", borderRadius: 999, background: alpha(RANGE, 0.2), border: `3px solid ${RANGE}`, boxShadow: `0 0 26px ${alpha(RANGE, 0.4)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          32 ± 2 = <span style={{ color: RANGE, textShadow: glowText(RANGE, 0.5) }}>30 TO 34 MIN</span>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", opacity: Math.min(1, spr(s.sent(1).from + 12, theme.spring.smooth)), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color: C.dim }}>FOR 95%: 1.96 TO BE EXACT</div>
    </AbsoluteFill>
  );
};
