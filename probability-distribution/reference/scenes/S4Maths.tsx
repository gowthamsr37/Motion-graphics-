// SCENE 4 — MATHS. Mean 75, SD 10, you scored 80: (80 − 75) ÷ 10 = 0.5 → just half an SD above the mean.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { type BellGeo } from "../components/Bell";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { SUBJ } from "./S1Hook";
import { Worked } from "./Worked";

const C = theme.colors;
const G: BellGeo = { x0: 110, x1: 970, vmin: 37, vmax: 113, base: 930, peakH: 270, sigmaRef: 10 };

export const S4Maths: React.FC = () => {
  useCurrentFrame();
  const s = useScene("s4");
  return (
    <AbsoluteFill>
      <SceneTitle label="WORKED EXAMPLE 1" pill="MATHS" color={SUBJ.maths} at={2} />
      <Worked
        g={G}
        mu={75}
        sd={10}
        x={80}
        color={SUBJ.maths}
        ticks={[45, 55, 65, 75, 85, 95, 105]}
        tMean={s.cueS(0, "75,")}
        tSD={s.cueS(0, "10.")}
        tScore={s.cueS(1, "80")}
        tMinus={s.cueS(1, "minus")}
        tDiff={s.cueS(1, "5.")}
        tDivide={s.cueS(2, "Divided")}
        tResult={s.cueS(2, "05")}
        hops={1}
        zText="0.5"
      />
      <Pop at={s.sent(3).from - 2} x={540} y={600} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          JUST <span style={{ color: C.green, textShadow: glowText(C.green, 0.5) }}>HALF AN SD</span> ABOVE
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
