// SCENE 7 — REMEMBER. EVERY OUTCOME EQUALLY LIKELY → A FLAT SHAPE → AVERAGE IN THE MIDDLE.
// Then: it's how computers make random numbers (a phone screen rolling 0.73, 0.12, 0.58…).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BarsIcon, FlatIcon, RecapFlow } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { CONT, DISC } from "./S1Hook";

const C = theme.colors;

export const S7Remember: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s7");
  const COMP = s.sent(2).from;
  const r = (k: number) => (Math.abs(Math.sin((Math.floor(frame / 5) + k * 7) * 12.9898)) % 1).toFixed(2);

  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="UNIFORM DISTRIBUTION" color={CONT} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={560}
        gap={170}
        size={33}
        items={[
          { t: "EVERY OUTCOME EQUALLY LIKELY", c: DISC, at: s.cueS(0, "every"), icon: <BarsIcon color={DISC} vals={[1, 1, 1, 1, 1, 1]} w={100} h={50} /> },
          { t: "A FLAT SHAPE", c: CONT, at: s.cueS(1, "flat"), icon: <FlatIcon color={CONT} w={100} h={50} /> },
          { t: "AVERAGE IN THE MIDDLE", c: C.violet, at: s.cueS(1, "average"), icon: <div style={{ width: 100, height: 54, position: "relative" }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 36, borderRadius: 4, background: alpha(C.violet, 0.3), border: `3px solid ${C.violet}` }} /><div style={{ position: "absolute", left: 48, bottom: 0, width: 4, height: 54, background: C.text }} /></div> },
        ]}
      />
      <Pop at={COMP - 2} x={540} y={1150} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ width: 120, height: 190, borderRadius: 22, border: `4px solid ${CONT}`, background: alpha(CONT, 0.12), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: C.text }}>
            <span>{r(1)}</span>
            <span style={{ color: CONT }}>{r(2)}</span>
            <span>{r(3)}</span>
          </div>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap", lineHeight: 1.15 }}>
            HOW COMPUTERS MAKE
            <br />
            <span style={{ color: CONT, textShadow: glowText(CONT, 0.5) }}>RANDOM NUMBERS</span>
          </div>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
