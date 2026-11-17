// SCENE 8 — REMEMBER. MOST VALUES ARE SMALL → A FEW ARE HUGE → A LONG TAIL. Then: TOP 20% → ABOUT 80%, and the
// chips 80/20 · 90/10 · 70/30: a rule of thumb, not a law.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { BarsIcon, CurveIcon, RecapFlow } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { AVG, FEW, MANY, MID } from "./S1Hook";

const C = theme.colors;

export const S8Remember: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s8");
  const TOP = s.sent(1).from;
  const RULE = s.cueS(1, "rule");
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="PARETO DISTRIBUTION" color={FEW} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={540}
        gap={160}
        size={38}
        items={[
          { t: "MOST VALUES ARE SMALL", c: MANY, at: s.cueS(0, "most"), icon: <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ width: 10, height: 14, borderRadius: 3, background: MANY }} />)}</div> },
          { t: "A FEW ARE HUGE", c: FEW, at: s.cueS(0, "few"), icon: <BarsIcon color={MANY} vals={[9, 2, 1, 1, 1, 1]} w={100} h={50} hi={[0]} hiColor={FEW} /> },
          { t: "A LONG TAIL", c: AVG, at: s.cueS(0, "tail"), icon: <CurveIcon color={AVG} f={(u) => Math.pow(0.08 / (u + 0.08), 1.6)} w={100} h={50} /> },
        ]}
      />
      <Pop at={TOP - 2} x={540} y={1060} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Pill label="TOP 20% OFTEN HOLD ABOUT 80%" color={FEW} size={32} glow={0.5} />
      </Pop>
      {["80/20", "90/10", "70/30"].map((t, i) => {
        const p = spr(RULE - 6 + i * 5, theme.spring.pop);
        if (p <= 0.01) return null;
        return (
          <div key={t} style={{ position: "absolute", left: 330 + i * 210, top: 1180, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), padding: "8px 22px", borderRadius: 999, border: `3px solid ${i === 0 ? MID : alpha(MID, 0.5)}`, background: alpha(MID, i === 0 ? 0.2 : 0.08), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: C.text }}>{t}</div>
        );
      })}
      <Pop at={RULE + 8} x={540} y={1260} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.16em", color: C.text, whiteSpace: "nowrap" }}>
          A <span style={{ color: MID }}>RULE OF THUMB</span>, NOT A LAW
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
