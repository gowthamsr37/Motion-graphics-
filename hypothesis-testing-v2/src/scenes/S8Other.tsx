// SCENE 8 — THE OTHER OUTCOME. Same curve; OUR AVERAGE: 49.5 g → the tail at or below 49.5 g is about 27% (one-sided
// p = 0.27) → 27% > 5% → FAIL TO REJECT H0 → NOT PROOF THE PACKETS ARE FULL, JUST NOT ENOUGH EVIDENCE.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { LINE, NULLC } from "./S1Hook";
import { SampleCurve } from "./S7Decide";

const C = theme.colors;

export const S8Other: React.FC = () => {
  const s = useScene("s8");
  const PCT = s.cueS(1, "27%");
  const FAIL = s.cueS(1, "fail");
  const PROOF = s.sent(2).from;
  return (
    <AbsoluteFill>
      <SceneTitle label="THE OTHER OUTCOME" color={NULLC} at={2} />
      <Pop at={s.sent(0).from} x={540} y={400} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: C.text, whiteSpace: "nowrap" }}>
          WHAT IF THE AVERAGE WAS <span style={{ color: C.violet }}>49.5 g</span>?
        </div>
      </Pop>
      <SampleCurve at={4} mean={49.5} markAt={s.cueS(0, "49.5")} tailAt={PCT} tailColor={NULLC} pct="27%" markLabel="AVERAGE: 49.5 g" markSide="left" markTop={300} />
      <Pop at={FAIL - 4} x={540} y={1150} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          27% <span style={{ color: C.dim }}>&gt;</span> <span style={{ color: LINE }}>5%</span>
          <span style={{ color: C.dim, fontSize: 30 }}> : </span>
          <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>FAIL TO REJECT H0</span>
        </div>
      </Pop>
      <Pop at={PROOF - 4} x={540} y={1270} from="up" dist={12} cfg={theme.spring.bouncy}>
        <Tag color={C.red} size={28}>
          NOT PROOF THEY&apos;RE FULL: JUST NOT ENOUGH EVIDENCE
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
