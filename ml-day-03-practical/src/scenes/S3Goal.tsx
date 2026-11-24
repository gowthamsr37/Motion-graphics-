// SCENE 3 — STEP 1: ONE SENTENCE. Step bar (1). A fill-in-the-blanks card: "Predict [flat price, Rs lakh] using [area ·
// bedrooms · location · age]. Success = [off by < Rs 8 lakh]." — blanks fill on their words; then the rule pill.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { StepBar } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Blank: React.FC<{ at: number; c: string; children: React.ReactNode }> = ({ at, c, children }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [at - 2, at + 8], [0, 1]);
  return (
    <span style={{ display: "inline-block", padding: "2px 16px", margin: "0 6px", borderBottom: `5px solid ${c}`, background: alpha(c, 0.12 * p), color: p > 0.3 ? C.text : "transparent", minWidth: 120 }}>{children}</span>
  );
};

export const S3Goal: React.FC = () => {
  const s = useScene("s3");
  const L = s.sent(1).from;
  return (
    <AbsoluteFill>
      <StepBar cur={0} at={0} />
      <Pop x={540} y={420} at={s.sent(0).from}>
        <Txt size={66}>write <span style={{ color: C.cyan }}>one sentence</span></Txt>
      </Pop>
      <Pop x={540} y={760} at={L - 6}>
        <Panel w={980} h={500} color={C.cyan} style={{ alignItems: "flex-start", padding: "0 40px", gap: 26 }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, lineHeight: 1.4, whiteSpace: "normal" }}>
            Predict <Blank at={s.cueS(1, "price")} c={C.cyan}>flat price (Rs lakh)</Blank>
            <br />
            using <Blank at={s.cueS(1, "area,")} c={C.violet}>area · beds · location · age</Blank>
            <br />
            Success = <Blank at={s.cueS(1, "less")} c={C.green}>off by &lt; Rs 8 lakh</Blank>
          </div>
        </Panel>
      </Pop>
      <Pop x={540} y={1150} at={s.sent(2).from - 4}>
        <Pill color={C.red} size={38}>CAN&apos;T WRITE IT? DON&apos;T START CODING</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
