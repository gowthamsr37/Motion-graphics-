// SCENE 5 — STEP 3: CLEAN THE DATA (the biggest one). Step bar (3). A messy table: a missing price (red ?), a duplicate
// row, a typo area 12,000; each problem gets flagged on its words, then fixed on "fill · delete · fix" (missing filled,
// duplicate struck out, 12,000 → 1,200); GARBAGE IN, GARBAGE OUT.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { StepBar, Table, Cell } from "../components/Steps";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S5Clean: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const MISS = s.cueS(1, "missing");
  const TWICE = s.cueS(1, "twice.");
  const TYPO = s.cueS(1, "12,000");
  const FIX = s.sent(2).from;
  const fixed = frame >= FIX + 10;
  const rows: Cell[][] = [
    [{ v: "1,050" }, { v: "2" }, { v: "Hinjewadi" }, { v: "Rs 62L", c: C.green }],
    [{ v: "650" }, { v: "1" }, { v: "Wakad" }, fixed ? { v: "Rs 38L*", c: C.yellow } : { v: "?", c: C.red, bad: frame >= MISS }],
    [{ v: "1,400" }, { v: "3" }, { v: "Baner" }, { v: "Rs 98L", c: C.green }],
    [{ v: "1,400", bad: frame >= TWICE && !fixed, strike: fixed }, { v: "3", bad: frame >= TWICE && !fixed, strike: fixed }, { v: "Baner", bad: frame >= TWICE && !fixed, strike: fixed }, { v: "Rs 98L", bad: frame >= TWICE && !fixed, strike: fixed }],
    [fixed ? { v: "1,200", c: C.yellow } : { v: "12,000", c: frame >= TYPO ? C.red : undefined, bad: frame >= TYPO }, { v: "2" }, { v: "Kharadi" }, { v: "Rs 74L", c: C.green }],
  ];
  return (
    <AbsoluteFill>
      <StepBar cur={2} at={0} />
      <Pop x={540} y={420} at={s.sent(0).from}>
        <Txt size={70}>clean the <span style={{ color: C.orange }}>data</span></Txt>
      </Pop>
      <Pop x={540} y={500} at={s.cueS(0, "biggest") - 2}>
        <Txt size={32} font="body" color={C.dim}>the biggest step: up to 80% of the time</Txt>
      </Pop>
      <Pop x={540} y={800} at={s.sent(1).from - 4}>
        <Table cols={["AREA", "BEDROOMS", "LOCATION", "PRICE"]} rows={rows} fs={32} />
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1090, display: "flex", justifyContent: "center", gap: 14 }}>
        {[
          { t: "MISSING", at: MISS },
          { t: "DUPLICATE", at: TWICE },
          { t: "TYPO", at: TYPO },
        ].map((k) => (
          <div key={k.t} style={{ opacity: ease(frame, [k.at, k.at + 6], [0, 1]) }}>
            <Pill color={fixed ? C.green : C.red} size={30}>{fixed ? "FIXED" : k.t}</Pill>
          </div>
        ))}
      </div>
      <Pop x={540} y={1260} at={s.cueS(2, "Garbage") - 4}>
        <Pill color={C.orange} size={46} solid>GARBAGE IN → GARBAGE OUT</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
