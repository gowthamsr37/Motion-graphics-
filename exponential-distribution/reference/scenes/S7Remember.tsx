// SCENE 7 — REMEMBER. COUNTS EVENTS → IN A FIXED TIME OR SPACE → AT RANDOM, AT A STEADY RATE.
// Then: give it the average → it gives the chance of any count.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BarsIcon, RecapFlow } from "../components/Explain";
import { Arrow, ClockGlyph } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { poisDist } from "../components/Pois";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EVT, HI, RATE } from "./S1Hook";

const C = theme.colors;

export const S7Remember: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s7");
  const GIVE = s.sent(1).from;
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="POISSON DISTRIBUTION" color={EVT} at={2} pillAt={s.sent(0).from} />
      <RecapFlow
        y0={560}
        gap={170}
        size={36}
        items={[
          { t: "COUNTS EVENTS", c: EVT, at: s.cueS(0, "counts"), icon: <div style={{ display: "flex", gap: 7 }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 8, height: 40, borderRadius: 4, background: EVT }} />)}</div> },
          { t: "IN A FIXED TIME OR SPACE", c: RATE, at: s.cueS(0, "fixed"), icon: <ClockGlyph size={50} color={RATE} /> },
          { t: "AT RANDOM, STEADY RATE", c: HI, at: s.cueS(0, "random"), icon: <BarsIcon color={HI} vals={poisDist(4, 10)} w={110} h={50} /> },
        ]}
      />
      <Pop at={GIVE - 2} x={540} y={1150} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: C.orange }}>THE AVERAGE</span>
          <Arrow size={40} color={C.text} />
          <span style={{ color: EVT, textShadow: glowText(EVT, 0.5) }}>CHANCE OF ANY COUNT</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
