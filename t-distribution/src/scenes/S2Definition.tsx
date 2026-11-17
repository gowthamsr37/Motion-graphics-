// SCENE 2 — THE DEFINITION: looks like THE NORMAL BELL · but with FATTER TAILS · for SMALL SAMPLES (spread guessed from
// the data) · smaller sample → fatter tails.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CurveIcon, DefCard } from "../components/Explain";
import { Arrow } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { npdf, tpdf } from "../components/TDist";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { NC, SAMPLE, TAIL, TC } from "./S1Hook";

const C = theme.colors;

export const S2Definition: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s2");
  const doneAt = s.duration - 28;
  const SMALLER = s.sent(3).from;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" pill="IN SIMPLE WORDS" color={TC} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={560}
        gap={160}
        doneAt={doneAt}
        size={36}
        rows={[
          { pre: "looks like ", key: "THE NORMAL BELL", c: NC, at: s.cueS(1, "looks"), icon: <CurveIcon color={NC} f={(u) => npdf((u - 0.5) * 8) / 0.4} w={110} h={52} /> },
          { pre: "but with ", key: "FATTER TAILS", c: TAIL, at: s.cueS(1, "fatter"), icon: <CurveIcon color={TAIL} f={(u) => tpdf((u - 0.5) * 8, 1.5) / 0.4} w={110} h={52} /> },
          { pre: "for ", key: "SMALL SAMPLES", c: SAMPLE, at: s.cueS(2, "small,"), icon: <div style={{ display: "flex", gap: 7 }}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: SAMPLE }} />)}</div> },
        ]}
      />
      <Pop at={SMALLER - 2} x={540} y={1110} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: SAMPLE }}>SMALLER SAMPLE</span>
          <Arrow size={44} color={C.dim} />
          <span style={{ color: TAIL, textShadow: glowText(TAIL, 0.5) }}>FATTER TAILS</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
