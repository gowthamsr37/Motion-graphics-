// SCENE 3 — EXPECTED vs OBSERVED. A fair dice rolled 60 times should give 10 of each face (dashed line). What we got:
// 8, 9, 12, 11, 4, 16 — each bar rises on its spoken number.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { OBS } from "../components/Chi";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { Faces } from "./Faces";
import { EXP, OBSC } from "./S1Hook";

const C = theme.colors;

export const S3Counts: React.FC = () => {
  const s = useScene("s3");
  const TEN = s.cueS(0, "10");
  const GOT = s.sent(1).from;
  const growAt = ["8,", "9,", "12,", "11,", "4,", "16."].map((t) => s.cueS(1, t) - 4);
  return (
    <AbsoluteFill>
      <SceneTitle label="SEEN vs EXPECTED" color={OBSC} at={2} />
      <Pop at={TEN - 4} x={540} y={450} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          EXPECTED: <span style={{ color: EXP, textShadow: glowText(EXP, 0.5) }}>10 OF EACH</span>
        </div>
      </Pop>
      <Pop at={GOT - 2} x={540} y={530} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          SEEN: <span style={{ color: OBSC, textShadow: glowText(OBSC, 0.5) }}>{OBS.join(" · ")}</span>
        </div>
      </Pop>
      <Faces g={{ base: 1130, h: 420, max: 18 }} vals={OBS} growAt={growAt} lineAt={TEN - 6} />
    </AbsoluteFill>
  );
};
