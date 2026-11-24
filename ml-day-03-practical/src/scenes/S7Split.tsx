// SCENE 7 — STEP 5: SPLIT. Step bar (5). Code: from sklearn.model_selection import train_test_split / X_train, X_test,
// y_train, y_test = train_test_split(X, y, test_size=0.2); out: 8,000 train · 2,000 test; a locked TEST box.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Code } from "../components/Code";
import { Panel, Pop, Txt } from "../components/D2";
import { StepBar } from "../components/Steps";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S7Split: React.FC = () => {
  const s = useScene("s7");
  const L = s.sent(1).from;
  return (
    <AbsoluteFill>
      <StepBar cur={4} at={0} />
      <Pop x={540} y={400} at={s.sent(0).from}>
        <Txt size={62}><span style={{ color: C.yellow }}>split</span> before you train</Txt>
      </Pop>
      <Pop x={540} y={700} at={L - 6}>
        <Code file="split.py" lines={["from sklearn.model_selection import train_test_split", "X_tr, X_te, y_tr, y_te = train_test_split(", "    X, y, test_size=0.2)"]} at={[L - 4, L + 6, s.cueS(1, "test_size") - 4]} fs={28} out={{ at: s.cueS(1, "test_size") + 8, text: <span>8,000 train · <span style={{ color: C.yellow }}>2,000 test</span></span> }} />
      </Pop>
      <Pop x={540} y={1080} at={s.cueS(1, "lock") - 4}>
        <Panel w={760} h={200} color={C.yellow}>
          <Txt size={50} color={C.yellow}>TEST SET: LOCKED</Txt>
          <Txt size={34} font="body">don&apos;t touch it until the very end</Txt>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};
