// SCENE 6 — AVERAGES AND VARIANCES. x̄A = 7 · x̄B = 10 · GAP = 3 on their words; brand A's worksheet fills row by row
// (distance from 7, squared: 1 1 0 4 4, sum 10, ÷ 4 = 2.5); brand B's fills quickly on "the same" (2.5).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Pop } from "../components/Motion";
import { A, B, BA, BB, StepTracker, VarSheet } from "../components/TKit";
import { XBar } from "../components/ZKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const Sub: React.FC<{ children: React.ReactNode }> = ({ children }) => <sub style={{ fontSize: "0.5em", verticalAlign: "-0.25em" }}>{children}</sub>;

const Chip: React.FC<{ x: number; at: number; c: string; children: React.ReactNode }> = ({ x, at, c, children }) => (
  <Pop at={at - 4} x={x} y={410} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
    <div style={{ padding: "10px 26px", borderRadius: 999, background: alpha(c, 0.18), border: `3px solid ${c}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>{children}</div>
  </Pop>
);

export const S6Vars: React.FC = () => {
  const s = useScene("s6");
  const r = [s.cueS(1, "1", 0), s.cueS(1, "1", 1), s.cueS(1, "0"), s.cueS(1, "4", 0), s.cueS(1, "4", 1)];
  const BS = s.cueS(2, "Brand");
  return (
    <AbsoluteFill>
      <StepTracker active={2} />
      <Chip x={220} at={s.cueS(0, "7")} c={BA}>
        <XBar color={BA} />
        <Sub>A</Sub> = 7
      </Chip>
      <Chip x={540} at={s.cueS(0, "10.")} c={BB}>
        <XBar color={BB} />
        <Sub>B</Sub> = 10
      </Chip>
      <Chip x={860} at={s.cueS(0, "3.")} c={C.orange}>
        GAP = <span style={{ color: C.orange, textShadow: glowText(C.orange, 0.5) }}>3</span>
      </Chip>
      <VarSheet x={300} y={510} vals={A} mean={7} c={BA} label="BRAND A" rowAt={r} sumAt={s.cueS(1, "10.")} divAt={s.cueS(2, "2.5.", 0)} />
      <VarSheet x={780} y={510} vals={B} mean={10} c={BB} label="BRAND B" rowAt={[0, 1, 2, 3, 4].map((i) => BS + i * 4)} sumAt={BS + 22} divAt={s.cueS(2, "2.5.", 1)} />
    </AbsoluteFill>
  );
};
