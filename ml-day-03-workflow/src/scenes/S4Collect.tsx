// SCENE 4 — STEP 2: COLLECT DATA. Step bar (2). The sales table builds column by column on its words (area · bedrooms ·
// location · age · price), rows stream in; a counter climbs to 10,000 flats.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { StepBar, Table } from "../components/Steps";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const ROWS = [
  ["1,050", "2", "Hinjewadi", "4 yrs", "Rs 62L"],
  ["650", "1", "Wakad", "9 yrs", "Rs 38L"],
  ["1,400", "3", "Baner", "2 yrs", "Rs 98L"],
  ["900", "2", "Hadapsar", "12 yrs", "Rs 48L"],
  ["1,200", "2", "Kharadi", "6 yrs", "Rs 74L"],
];

export const S4Collect: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const G = s.sent(1).from;
  const TEN = s.cueS(1, "10,000");
  const n = Math.round(ease(frame, [G + 20, TEN + 10], [5, 10000]));
  return (
    <AbsoluteFill>
      <StepBar cur={1} at={0} />
      <Pop x={540} y={420} at={s.sent(0).from}>
        <Txt size={70}>collect <span style={{ color: C.violet }}>data</span></Txt>
      </Pop>
      <Pop x={540} y={780} at={G - 4}>
        <Table cols={["AREA (SQ FT)", "BEDROOMS", "LOCATION", "AGE", "PRICE"]} rows={ROWS.map((r) => r.map((v, i) => ({ v, c: i === 4 ? C.green : undefined })))} at={ROWS.map((_, i) => G + 6 + i * 8)} fs={30} />
      </Pop>
      <Pop x={540} y={1150} at={G + 20}>
        <Txt size={64} font="mono" color={C.violet} glow>
          {n.toLocaleString("en-IN")} <span style={{ fontFamily: theme.fonts.body, fontSize: 36, color: C.text }}>flats</span>
        </Txt>
      </Pop>
    </AbsoluteFill>
  );
};
