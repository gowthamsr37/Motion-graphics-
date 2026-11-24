// SCENE 5 — STEP 3: THE 4 CHECKS. Step bar (3). Code window types one line per check on its sentence:
// df.isnull().sum() → price 37 missing · df.drop_duplicates() → 212 removed · df.describe() → max area 12000 (typo!) ·
// outliers → a Rs 50 crore villa; then the FIX row: fill median · drop dupes · fix/remove typos.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Code } from "../components/Code";
import { Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { StepBar } from "../components/Steps";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S5Clean: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const at = [s.sent(1).from, s.sent(2).from, s.sent(3).from, s.sent(4).from];
  const FIX = s.sent(5).from;
  const results = [
    { t: "price: 37 missing", c: C.red },
    { t: "212 duplicate rows removed", c: C.orange },
    { t: "max area: 12,000 sq ft, 1 bed?!", c: C.yellow },
    { t: "one villa: Rs 50 crore", c: C.violet },
  ];
  return (
    <AbsoluteFill>
      <StepBar cur={2} at={0} />
      <Pop x={540} y={400} at={s.sent(0).from}>
        <Txt size={62}>run these <span style={{ color: C.orange }}>4 checks</span></Txt>
      </Pop>
      <Pop x={540} y={480} at={s.cueS(0, "every") - 2}>
        <Txt size={32} font="body" color={C.dim}>every single time</Txt>
      </Pop>
      <Pop x={540} y={700} at={at[0] - 6}>
        <Code file="clean.py" lines={["df.isnull().sum()", "df = df.drop_duplicates()", "df.describe()", "df[df.price > 2000]   # outliers"]} at={at.map((a) => a - 2)} fs={34} />
      </Pop>
      <div style={{ position: "absolute", left: 60, right: 60, top: 920, display: "flex", flexDirection: "column", gap: 12 }}>
        {results.map((r, i) => (
          <div key={r.t} style={{ display: "flex", alignItems: "center", gap: 18, opacity: ease(frame, [at[i] + 14, at[i] + 22], [0, 1]) }}>
            <div style={{ width: 46, height: 46, borderRadius: 23, background: r.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.ink }}>{i + 1}</div>
            <Txt size={36}>{r.t}</Txt>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", justifyContent: "center", gap: 12, opacity: ease(frame, [FIX - 4, FIX + 6], [0, 1]) }}>
        <Pill color={C.green} size={28}>FILL WITH MEDIAN</Pill>
        <Pill color={C.green} size={28}>DROP DUPES</Pill>
        <Pill color={C.green} size={28}>FIX TYPOS</Pill>
      </div>
    </AbsoluteFill>
  );
};
