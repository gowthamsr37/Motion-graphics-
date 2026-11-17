// SCENE 8 — REMEMBER: the full cheat sheet. Three columns by family (COUNTS · MEASUREMENTS · TESTING + BONUS), every
// card with its mini shape; "ask what you're measuring, then match the shape" → SAVE THIS CHEAT SHEET.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { theme } from "../theme";
import { useScene } from "../timing";
import { ALL, BONUS, COUNTS, MEAS, MiniCard, TEST } from "./S1Hook";

const C = theme.colors;
const COLS: { t: string; c: string; names: string[] }[] = [
  { t: "COUNTS", c: COUNTS, names: ["BERNOULLI", "BINOMIAL", "GEOMETRIC", "POISSON", "UNIFORM"] },
  { t: "MEASUREMENTS", c: MEAS, names: ["NORMAL", "EXPONENTIAL", "LOG-NORMAL", "PARETO"] },
  { t: "TESTING", c: TEST, names: ["t", "CHI-SQUARE", "BIMODAL"] },
];

export const S8Remember: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s8");
  const SAVE = s.sent(1).from;
  return (
    <AbsoluteFill>
      <SceneTitle label="REMEMBER" pill="ASK, THEN MATCH THE SHAPE" color={BONUS} at={2} pillAt={s.sent(0).from} />
      {COLS.map((col, ci) => (
        <React.Fragment key={col.t}>
          <Pop at={s.sent(0).from + 4 + ci * 6} x={230 + ci * 310} y={470} from="up" dist={10}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: col.c, whiteSpace: "nowrap" }}>{col.t}</div>
          </Pop>
          {col.names.map((n, ri) => {
            const card = ALL.find((a) => a.name === n)!;
            const c = n === "BIMODAL" ? { ...card, name: "BIMODAL" } : card;
            return <MiniCard key={n} c={c} x={230 + ci * 310} y={560 + ri * 138} w={286} h={122} p={spr(s.sent(0).from + 8 + ci * 6 + ri * 4, theme.spring.bouncy)} />;
          })}
        </React.Fragment>
      ))}
      <Pop at={SAVE - 2} x={540} y={1300} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Pill label="SAVE THIS CHEAT SHEET" color={BONUS} size={36} glow={0.6} />
      </Pop>
    </AbsoluteFill>
  );
};
