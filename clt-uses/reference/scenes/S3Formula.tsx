// SCENE 3 — ONE LETTER OF DIFFERENCE. The z and t formulas stacked; σ glows (TRUE POPULATION SPREAD) then s glows
// (ESTIMATED FROM THE SAMPLE); + EXTRA UNCERTAINTY, ESPECIALLY FOR SMALL n.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Formula } from "../components/ZKit";
import { TC, TL, ZC } from "../components/ZT";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S3Formula: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s3");
  const SIG = s.cueS(1, "sigma,");
  const S = s.cueS(1, "s,");
  return (
    <AbsoluteFill>
      <SceneTitle label="ONE LETTER OF DIFFERENCE" color={TL} at={2} />
      <Pop at={s.sent(0).from} x={540} y={540} from="left" dist={40} cfg={theme.spring.bouncy}>
        <div style={{ padding: "10px 30px", borderRadius: 28, border: `3px solid ${alpha(ZC, 0.7)}`, background: alpha(ZC, 0.08) }}>
          <Formula size={66} hiBot={ease(frame, [SIG - 6, SIG + 6], [0, 1]) * (1 - ease(frame, [S - 6, S + 4], [0, 0.6]))} />
        </div>
      </Pop>
      <Pop at={s.sent(0).from + 10} x={540} y={830} from="right" dist={40} cfg={theme.spring.bouncy}>
        <div style={{ padding: "10px 30px", borderRadius: 28, border: `3px solid ${alpha(TC, 0.7)}`, background: alpha(TC, 0.08) }}>
          <Formula size={66} lhs="t" useS hiBot={ease(frame, [S - 6, S + 6], [0, 1])} />
        </div>
      </Pop>
      <Pop at={SIG} x={540} y={1010} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: ZC, whiteSpace: "nowrap" }}>z: σ = THE TRUE POPULATION SPREAD</div>
      </Pop>
      <Pop at={S} x={540} y={1070} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: TC, whiteSpace: "nowrap" }}>t: s = ESTIMATED FROM THE SAMPLE</div>
      </Pop>
      <Pop at={s.cueS(2, "extra") - 4} x={540} y={1190} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={TL} size={30}>
          + EXTRA UNCERTAINTY, ESPECIALLY FOR SMALL n
        </Tag>
      </Pop>
      <div style={{ display: "none", color: C.text }} />
    </AbsoluteFill>
  );
};
