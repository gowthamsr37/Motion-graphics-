// SCENE 8 — STEP 6: START SIMPLE. Step bar (6). Code: LinearRegression in 3 lines (create · fit · predict), each
// highlighted on its word; "fancy models can wait" with crossed-out chips (neural net · XGBoost) for later.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Code } from "../components/Code";
import { Pill, Pop, Txt } from "../components/D2";
import { JargonTag, StepBar } from "../components/Steps";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S8Model: React.FC = () => {
  const s = useScene("s8");
  return (
    <AbsoluteFill>
      <StepBar cur={5} at={0} />
      <JargonTag i={5} at={s.cueS(0, "model")} />
      <Pop x={540} y={440} at={s.sent(0).from}>
        <Txt size={62}>start <span style={{ color: C.cyan }}>simple</span></Txt>
      </Pop>
      <Pop x={540} y={720} at={s.sent(1).from - 4}>
        <Code file="model.py" lines={["from sklearn.linear_model import LinearRegression", "model = LinearRegression()", "model.fit(X_tr, y_tr)", "preds = model.predict(X_te)"]} at={[s.sent(1).from, s.cueS(1, "create"), s.cueS(1, "fit"), s.cueS(1, "predict.")]} fs={30} />
      </Pop>
      <Pop x={540} y={1040} at={s.cueS(1, "Fancy") - 4}>
        <Txt size={40} font="body">fancy models can wait</Txt>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center", gap: 16 }}>
        <Pop x={0} y={0} at={s.cueS(1, "Fancy")} anchor="left" style={{ position: "relative", transform: "none" }}>
          <Pill color={C.dim} size={30}>NEURAL NETS → LATER</Pill>
        </Pop>
        <Pop x={0} y={0} at={s.cueS(1, "Fancy") + 6} anchor="left" style={{ position: "relative", transform: "none" }}>
          <Pill color={C.dim} size={30}>XGBOOST → LATER</Pill>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};
