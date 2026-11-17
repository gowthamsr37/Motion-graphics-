// SCENE 2 — THE DEFINITION: most values are SMALL · a few are HUGE · a LONG TAIL to the right · behind the 80/20 RULE.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BarsIcon, CurveIcon, DefCard } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";
import { AVG, FEW, MANY, MID } from "./S1Hook";

const C = theme.colors;
const tail = (u: number) => Math.pow(0.08 / (u + 0.08), 1.6);

export const S2Definition: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s2");
  const doneAt = s.duration - 28;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" pill="IN SIMPLE WORDS" color={FEW} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={540}
        gap={150}
        doneAt={doneAt}
        size={36}
        rows={[
          { pre: "Most values are ", key: "SMALL", c: MANY, at: s.cueS(1, "most"), icon: <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>{[0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i} style={{ width: 10, height: 14, borderRadius: 3, background: MANY }} />)}</div> },
          { pre: "a few are ", key: "HUGE", c: FEW, at: s.cueS(2, "few"), icon: <BarsIcon color={MANY} vals={[9, 2, 1, 1, 1, 1, 1]} w={110} h={52} hi={[0]} hiColor={FEW} /> },
          { pre: "a ", key: "LONG TAIL", post: " to the right", c: AVG, at: s.cueS(3, "long"), icon: <CurveIcon color={AVG} f={tail} w={110} h={52} /> },
          { pre: "behind the ", key: "80/20 RULE", c: MID, at: s.cueS(4, "80/20"), icon: <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: MID, whiteSpace: "nowrap" }}>80/20</div> },
        ]}
      />
      <Pop at={doneAt} x={540} y={1150} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
          THAT&apos;S THE <span style={{ color: FEW }}>PARETO DISTRIBUTION</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
