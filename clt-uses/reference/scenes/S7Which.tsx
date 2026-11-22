// SCENE 7 — WHICH ONE TO USE? A flowchart: DO YOU KNOW σ? → YES: z-TEST · NO: t-TEST (ANY SAMPLE SIZE); then BIG SAMPLE:
// ALMOST THE SAME ANSWER.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { Sigma } from "../components/ZKit";
import { TC, TL, ZC } from "../components/ZT";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Line: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number; c: string }> = ({ x1, y1, x2, y2, at, c }) => {
  const frame = useCurrentFrame();
  const k = ease(frame, [at - 6, at + 10], [0, 1]);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: k }}>
      <path d={`M${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`} fill="none" stroke={c} strokeWidth={5} strokeDasharray={600} strokeDashoffset={600 * (1 - k)} />
    </svg>
  );
};

export const S7Which: React.FC = () => {
  const s = useScene("s7");
  const Q = s.cueS(0, "sigma?");
  const YES = s.cueS(1, "Yes:");
  const NO = s.cueS(1, "No:");
  return (
    <AbsoluteFill>
      <SceneTitle label="WHICH ONE SHOULD YOU USE?" color={TL} at={2} />
      <Pop at={Q - 6} x={540} y={470} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 40px", borderRadius: 30, background: alpha(C.yellow, 0.14), border: `3px solid ${C.yellow}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
          DO YOU KNOW <Sigma size={60} color={C.yellow} />
          <span style={{ color: C.yellow }}>?</span>
        </div>
      </Pop>
      <Line x1={540} y1={530} x2={290} y2={720} at={YES - 4} c={ZC} />
      <Line x1={540} y1={530} x2={790} y2={720} at={NO - 4} c={TC} />
      <Pop at={YES - 4} x={290} y={790} from="up" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ width: 400, padding: "20px 0", borderRadius: 28, textAlign: "center", background: alpha(ZC, 0.18), border: `3px solid ${ZC}` }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.18em", color: ZC }}>YES</div>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, textShadow: glowText(ZC, 0.4) }}>z-TEST</div>
        </div>
      </Pop>
      <Pop at={NO - 4} x={790} y={790} from="up" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ width: 400, padding: "20px 0", borderRadius: 28, textAlign: "center", background: alpha(TC, 0.18), border: `3px solid ${TC}` }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.18em", color: TC }}>NO</div>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, textShadow: glowText(TC, 0.4) }}>
            <span style={{ fontStyle: "italic" }}>t</span>-TEST
          </div>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: C.dim }}>AT ANY SAMPLE SIZE</div>
        </div>
      </Pop>
      <Pop at={s.cueS(1, "big") - 4} x={540} y={1060} from="up" dist={12}>
        <div style={{ padding: "12px 30px", borderRadius: 999, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(C.text, 0.3)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
          BIG SAMPLE: <span style={{ color: TC }}>t</span> AND <span style={{ color: ZC }}>z</span> GIVE ALMOST THE SAME ANSWER
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
