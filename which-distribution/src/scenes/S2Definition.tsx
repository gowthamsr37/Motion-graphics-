// SCENE 2 — THE DEFINITION (a reminder): a probability distribution shows HOW LIKELY · each POSSIBLE VALUE is ·
// each question needs ITS OWN SHAPE · so ask: WHAT AM I MEASURING?
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BarsIcon, DefCard } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { Shape } from "../components/Pick";
import { theme } from "../theme";
import { useScene } from "../timing";
import { EXP, NOR, POI, UNI } from "./S1Hook";

const C = theme.colors;

export const S2Definition: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s2");
  const doneAt = s.duration - 28;
  return (
    <AbsoluteFill>
      <SceneTitle label="FIRST, A REMINDER" pill="IN SIMPLE WORDS" color={UNI} at={2} pillAt={s.sent(0).from} />
      <DefCard
        y0={540}
        gap={150}
        doneAt={doneAt}
        size={36}
        rows={[
          { pre: "Shows ", key: "HOW LIKELY", c: UNI, at: s.cueS(1, "how"), icon: <BarsIcon color={UNI} vals={[2, 5, 8, 6, 3, 1]} w={110} h={50} /> },
          { pre: "each ", key: "POSSIBLE VALUE", post: " is", c: NOR, at: s.cueS(1, "possible") },
          { pre: "each question: ", key: "ITS OWN SHAPE", c: POI, at: s.cueS(2, "Different"), icon: <Shape kind="exp" w={90} h={44} color={POI} axis={false} /> },
          { pre: "so ask: ", key: "WHAT AM I MEASURING?", c: EXP, at: s.cueS(3, "what") },
        ]}
      />
      <Pop at={doneAt} x={540} y={1150} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
          ONE QUESTION, <span style={{ color: POI }}>ONE SHAPE</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
