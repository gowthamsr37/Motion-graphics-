// SCENE 9 — STEP 7: BEAT THE BASELINE. Step bar (7). Two bars: GUESS THE AVERAGE → off by Rs 22L vs OUR MODEL → off by
// Rs 7L, the Rs 8L target line; IT WORKS!; the code line mean_absolute_error → 7.1 and "MAE = average distance from the
// real price"; then deploy: free Streamlit app · retrain when new sales come in.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Code } from "../components/Code";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { StepBar } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const W = 800 / 25; // px per lakh

export const S9Baseline: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s9");
  const B22 = s.cueS(1, "22");
  const M7 = s.cueS(1, "7.");
  const WORKS = s.cueS(1, "works!");
  const MAE = s.sent(2).from;
  const DEP = s.sent(3).from;
  const top = 1 - ease(frame, [DEP - 8, DEP], [0, 1]);
  const b1 = ease(frame, [B22 - 8, B22 + 6], [0, 22]);
  const b2 = ease(frame, [M7 - 8, M7 + 6], [0, 7]);
  return (
    <AbsoluteFill>
      <StepBar cur={6} at={0} />
      <Pop x={540} y={400} at={s.sent(0).from}>
        <Txt size={62}>beat the <span style={{ color: C.green }}>baseline</span></Txt>
      </Pop>
      <div style={{ position: "absolute", inset: 0, opacity: top }}>
        <div style={{ position: "absolute", left: 140, top: 520, width: 800 }}>
          <div style={{ position: "absolute", left: 8 * W, top: 40, height: 300, width: 0, borderLeft: `4px dashed ${C.yellow}`, opacity: ease(frame, [s.cueS(1, "target") - 4, s.cueS(1, "target") + 4], [0, 1]) }} />
          <div style={{ position: "absolute", left: 8 * W - 70, top: 350, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.yellow, opacity: ease(frame, [s.cueS(1, "target") - 4, s.cueS(1, "target") + 4], [0, 1]), whiteSpace: "nowrap" }}>target Rs 8L</div>
          {[
            { l: "guess the average", v: b1, c: C.red, at: B22 },
            { l: "our model", v: b2, c: C.green, at: M7 },
          ].map((r, i) => (
            <div key={r.l} style={{ position: "relative", marginBottom: 40, opacity: ease(frame, [r.at - 10, r.at - 4], [0, 1]) }}>
              <Txt size={36} font="body">{r.l}</Txt>
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 10 }}>
                <div style={{ width: r.v * W, height: 70, borderRadius: 14, background: r.c, boxShadow: `0 0 18px ${alpha(r.c, 0.6)}`, position: "relative", zIndex: 1 }} />
                <Txt size={50} style={{ position: "absolute", left: 22.5 * W, zIndex: 1 }}>Rs {Math.round(r.v)}L</Txt>
              </div>
            </div>
          ))}
        </div>
        <Pop x={540} y={1000} at={WORKS - 4}>
          <Pill color={C.green} size={56} solid>IT WORKS!</Pill>
        </Pop>
        <Pop x={540} y={1200} at={MAE - 4}>
          <Code file="evaluate.py" lines={["mean_absolute_error(y_te, preds)"]} at={[MAE]} fs={32} out={{ at: MAE + 16, text: <span>7.1  <span style={{ color: C.dim }}>← off by ~Rs 7L on average</span></span> }} />
        </Pop>
      </div>
      {frame >= DEP - 8 ? (
        <AbsoluteFill style={{ opacity: 1 - top }}>
          <Pop x={540} y={700} at={DEP}>
            <Panel w={960} h={360} color={C.violet}>
              <Txt size={34} color={C.dim} font="body" style={{ letterSpacing: "0.12em" }}>LET OTHERS USE IT</Txt>
              <Txt size={60}>free <span style={{ color: C.violet }}>Streamlit</span> app</Txt>
              <div style={{ padding: "14px 26px", borderRadius: 16, background: "#0B1020", border: `2px solid ${alpha(C.text, 0.2)}`, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 30, color: C.text }}>
                1,200 sq ft · 2 BHK · HSR → <span style={{ color: C.green }}>Rs 1.1 Cr</span>
              </div>
            </Panel>
          </Pop>
          <Pop x={540} y={1020} at={s.cueS(3, "retrain") - 4}>
            <Pill color={C.orange} size={40}>RETRAIN WHEN NEW SALES COME IN</Pill>
          </Pop>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
