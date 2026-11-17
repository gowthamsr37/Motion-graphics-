// SCENE 2 — THE DEFINITION: counts EVENTS · in a FIXED TIME OR SPACE · at a STEADY RATE, at random · needs just THE AVERAGE.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DefCard } from "../components/Explain";
import { ClockGlyph } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";
import { EVT, HI, RATE } from "./S1Hook";

const C = theme.colors;

export const S2Definition: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s2");
  const doneAt = s.duration - 28;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" pill="IN SIMPLE WORDS" color={EVT} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={540}
        gap={150}
        doneAt={doneAt}
        size={36}
        rows={[
          { pre: "Counts ", key: "EVENTS", c: EVT, at: s.cueS(1, "counts"), icon: <div style={{ display: "flex", gap: 8 }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 8, height: 44, borderRadius: 4, background: EVT }} />)}</div> },
          { pre: "in a ", key: "FIXED TIME OR SPACE", c: RATE, at: s.cueS(1, "fixed"), icon: <ClockGlyph size={54} color={RATE} /> },
          { pre: "at a ", key: "STEADY RATE", post: ", at random", c: HI, at: s.cueS(2, "random,"), icon: undefined },
          { pre: "needs just ", key: "THE AVERAGE", c: C.orange, at: s.cueS(3, "one"), icon: <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.orange, whiteSpace: "nowrap" }}>avg = 4</div> },
        ]}
      />
      <Pop at={doneAt} x={540} y={1150} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
          THAT&apos;S THE <span style={{ color: EVT }}>POISSON DISTRIBUTION</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
