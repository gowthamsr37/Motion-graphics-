// SCENE 2 — THE DEFINITION: only POSITIVE VALUES · SKEWED to the right · take the log: A NORMAL BELL ·
// the name = its logs are normal.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CurveIcon, DefCard } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";
import { GROW, LOG, RAW, ZERO } from "./S1Hook";

const C = theme.colors;
export const skew = (u: number) => {
  const x = Math.max(1e-3, u * 3.2);
  const z = Math.log(x / 0.9) / 0.55;
  return (Math.exp(-(z * z) / 2) / x) * 0.62;
};
export const bell = (u: number) => Math.exp(-(((u - 0.5) / 0.15) ** 2) / 2);

export const S2Definition: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s2");
  const doneAt = s.duration - 28;
  const NAME = s.sent(3).from;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" pill="IN SIMPLE WORDS" color={LOG} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={560}
        gap={160}
        doneAt={doneAt}
        size={36}
        rows={[
          { pre: "Only ", key: "POSITIVE VALUES", c: ZERO, at: s.cueS(1, "positive"), icon: <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: ZERO }}>&gt; 0</div> },
          { pre: "", key: "SKEWED", post: " to the right", c: RAW, at: s.cueS(1, "skewed"), icon: <CurveIcon color={RAW} f={skew} w={110} h={52} /> },
          { pre: "take the log: ", key: "A NORMAL BELL", c: LOG, at: s.cueS(2, "log"), icon: <CurveIcon color={LOG} f={bell} w={110} h={52} /> },
        ]}
      />
      <Pop at={NAME - 2} x={540} y={1130} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: LOG }}>LOG</span>-NORMAL = ITS <span style={{ color: LOG }}>LOGS</span> ARE <span style={{ color: GROW }}>NORMAL</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
