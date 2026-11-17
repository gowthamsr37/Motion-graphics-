// SCENE 2 — THE DEFINITION, in simple words: every possible OUTCOME · gets the SAME CHANCE · so the shape is FLAT.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DefCard, FlatIcon } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";
import { AREA, CONT, DISC } from "./S1Hook";

const C = theme.colors;

export const S2Definition: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s2");
  const doneAt = s.duration - 28;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" pill="IN SIMPLE WORDS" color={CONT} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={580}
        gap={160}
        doneAt={doneAt}
        size={40}
        rows={[
          { pre: "Every possible ", key: "OUTCOME", c: DISC, at: s.cueS(1, "every"), icon: <div style={{ display: "flex", gap: 6 }}>{Array.from({ length: 6 }, (_, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: DISC }} />)}</div> },
          { pre: "gets the ", key: "SAME CHANCE", c: AREA, at: s.cueS(1, "same"), icon: <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: AREA, whiteSpace: "nowrap" }}>1/6 · 1/6</div> },
          { pre: "so the shape is ", key: "FLAT", c: CONT, at: s.cueS(2, "flat,"), icon: <FlatIcon color={CONT} /> },
        ]}
      />
      <Pop at={doneAt} x={540} y={1100} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
          THAT&apos;S THE <span style={{ color: CONT }}>UNIFORM DISTRIBUTION</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
