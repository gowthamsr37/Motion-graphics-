// SCENE 2 — HOOK: the raw Bangalore flats table (10,000 rows, straight from the websites) full of red problem cells;
// "feed this to a model → GARBAGE"; then the 8 steps lined up "in order".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Mini } from "../components/CleanStep";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { STEPS, STEP_C } from "../components/Steps";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S2Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s2");
  const G = s.cueS(1, "garbage.");
  const ORDER = s.cueS(1, "order.");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={50}>our Bangalore flats: <span style={{ color: C.cyan }}>10,000 rows</span></Txt>
      </Pop>
      <Pop x={540} y={560} at={s.cueS(0, "straight") - 6}>
        <Panel w={980} h={440} color={C.red}>
          <Mini w={900} tone="bad" cols={["AREA", "BHK", "LOCALITY", "PRICE"]} rows={[
            [{ v: "79 sq m", bad: true }, "2 BHK", "Koramangala", { v: "1.2 Cr", bad: true }],
            ["1,200", { v: "2bhk", bad: true }, { v: "Kormangala", bad: true }, { v: "—", bad: true }],
            [{ v: "12,000", bad: true }, "1", "HSR", "98 L"],
            ["1,200", "2 BHK", "Koramangala", "1.2 Cr"],
            ["850", { v: "two bed", bad: true }, "Whitefield", { v: "50 Cr", bad: true }],
          ]} />
        </Panel>
      </Pop>
      <Pop x={540} y={890} at={G - 6}>
        <Txt size={48}>model on this = <span style={{ color: C.red }}>garbage</span></Txt>
      </Pop>
      <div style={{ position: "absolute", left: 40, right: 40, top: 990, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
        {STEPS.map((t, i) => {
          const p = ease(frame, [ORDER - 10 + i * 2, ORDER - 4 + i * 2], [0, 1]);
          return (
            <div key={t} style={{ opacity: p, transform: `scale(${0.6 + 0.4 * p})`, display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 14, background: alpha(STEP_C[i], 0.14), border: `3px solid ${STEP_C[i]}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text }}>
              <span style={{ color: STEP_C[i] }}>{i + 1}</span> {t}
            </div>
          );
        })}
      </div>
      <Pop x={540} y={1250} at={ORDER}>
        <Pill color={C.green} size={40} solid>LET&apos;S CLEAN IT, IN ORDER</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
