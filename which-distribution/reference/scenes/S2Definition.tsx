// SCENE 2 — THE DEFINITION: measures WAITING TIME · until THE NEXT EVENT · events at a STEADY RATE, at random ·
// short waits are MOST COMMON.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CurveIcon, DefCard } from "../components/Explain";
import { GapIcon, Stopwatch } from "../components/Exp";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";
import { GAP, LONG, RATE, SHORT } from "./S1Hook";

const C = theme.colors;

export const S2Definition: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s2");
  const doneAt = s.duration - 28;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" pill="IN SIMPLE WORDS" color={GAP} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={540}
        gap={150}
        doneAt={doneAt}
        size={36}
        rows={[
          { pre: "Measures ", key: "WAITING TIME", c: GAP, at: s.cueS(1, "measures"), icon: <Stopwatch size={56} color={GAP} frac={0.3} /> },
          { pre: "until ", key: "THE NEXT EVENT", c: LONG, at: s.cueS(1, "next"), icon: <GapIcon color={LONG} w={120} /> },
          { pre: "at a ", key: "STEADY RATE", post: ", at random", c: RATE, at: s.cueS(2, "random,"), icon: undefined },
          { pre: "short waits: ", key: "MOST COMMON", c: SHORT, at: s.cueS(3, "Short"), icon: <CurveIcon color={SHORT} f={(u) => Math.exp(-u * 3.5)} w={110} h={52} /> },
        ]}
      />
      <Pop at={doneAt} x={540} y={1150} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
          THAT&apos;S THE <span style={{ color: GAP }}>EXPONENTIAL DISTRIBUTION</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
