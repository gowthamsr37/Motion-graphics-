// SCENE 11 — THE EDA CHECKLIST (save moment), in the house navy style (no white card): a navy panel "THE REAL ML
// CHECKLIST" with 8 rows, each = the step's term + the habit, ticking on its spoken habit; SAVE THIS pill.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bookmark } from "../components/Guide";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { STEPS, STEP_C } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const ITEMS = [
  { t: "Available at prediction time", w: "available" },
  { t: "Really related to the label", w: "related," },
  { t: "Not a duplicate", w: "duplicate," },
  { t: "Filled in enough", w: "filled" },
  { t: "Actually varies", w: "varies," },
  { t: "Fair + legal", w: "fair." },
];

export const S10List: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s10");
  return (
    <AbsoluteFill>
      <Pop x={540} y={260} at={s.sent(0).from - 4}>
        <Txt size={46}>the best features are <span style={{ color: C.green }}>built, not found</span></Txt>
      </Pop>
      <Pop x={540} y={370} at={s.cueS(0, "Build")}>
        <div style={{ display: "flex", gap: 16 }}>
          <Pill color={C.green} size={28}>BUILD YEAR → AGE</Pill>
          <Pill color={C.green} size={28}>ADDRESS → METRO DISTANCE</Pill>
        </div>
      </Pop>
      <Pop x={540} y={790} at={s.sent(1).from - 4}>
        <Panel w={980} h={600} color={C.cyan} style={{ gap: 4 }}>
          {ITEMS.map((it, i) => {
            const at = s.cueS(1, it.w);
            const p = ease(frame, [at - 2, at + 6], [0, 1]);
            return (
              <div key={it.t} style={{ width: 880, display: "flex", alignItems: "center", gap: 20, padding: "14px 0", borderTop: i ? `2px solid ${alpha(C.text, 0.08)}` : undefined, opacity: 0.35 + 0.65 * p }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, border: `4px solid ${STEP_C[i]}`, background: p > 0.5 ? STEP_C[i] : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {p > 0.5 ? <svg width={30} height={30} viewBox="0 0 30 30"><path d="M5 16 L12 23 L26 7" fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
                </div>
                <div style={{ width: 200, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.1em", color: STEP_C[i] }}>{STEPS[i]}</div>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>{it.t}</div>
              </div>
            );
          })}
        </Panel>
      </Pop>
      <Pop x={540} y={1180} at={s.cueS(2, "Save") - 4}>
        <Pill color={C.green} size={36}>
          <Bookmark size={36} color={C.green} />
          SAVE THIS · run every feature through it
        </Pill>
      </Pop>
    </AbsoluteFill>
  );
};
