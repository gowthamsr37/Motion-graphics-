// SCENES 4–6 — one family each, as cheat-sheet rows (question → name + mini shape), every row on its spoken words.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneTitle } from "../components/Kit";
import { CheatRow, type Kind } from "../components/Pick";
import { type SceneId } from "../timing";
import { useScene } from "../timing";
import { COUNTS, MEAS, TEST } from "./S1Hook";

type RowSpec = { q: string; name: string; kind: Kind; tok: string };

const Family: React.FC<{ id: SceneId; label: string; pill: string; color: string; rows: RowSpec[]; y0: number; gap: number; h?: number; qSize?: number; nameSize?: number }> = ({ id, label, pill, color, rows, y0, gap, h, qSize, nameSize }) => {
  const s = useScene(id);
  return (
    <AbsoluteFill>
      <SceneTitle label={label} pill={pill} color={color} at={2} pillAt={s.sent(0).from} />
      {rows.map((r, i) => (
        <CheatRow key={r.name} y={y0 + i * gap} q={r.q} name={r.name} kind={r.kind} color={color} at={s.sent(i + 1).from} nameAt={s.cueS(i + 1, r.tok)} h={h} qSize={qSize} nameSize={nameSize} />
      ))}
    </AbsoluteFill>
  );
};

export const S4Counts: React.FC = () => (
  <Family
    id="s4"
    label="FAMILY 1"
    pill="COUNTS"
    color={COUNTS}
    y0={560}
    gap={132}
    rows={[
      { q: "One yes-or-no try?", name: "BERNOULLI", kind: "bernoulli", tok: "Bernoulli." },
      { q: "Successes in a fixed number of tries?", name: "BINOMIAL", kind: "binomial", tok: "Binomial." },
      { q: "Tries until the first success?", name: "GEOMETRIC", kind: "geometric", tok: "Geometric." },
      { q: "Events in a stretch of time?", name: "POISSON", kind: "poisson", tok: "Poisson." },
      { q: "Every outcome equally likely?", name: "UNIFORM", kind: "uniform", tok: "Uniform." },
    ]}
  />
);

export const S5Measurements: React.FC = () => (
  <Family
    id="s5"
    label="FAMILY 2"
    pill="MEASUREMENTS"
    color={MEAS}
    y0={580}
    gap={150}
    h={124}
    rows={[
      { q: "Values clustered around an average?", name: "NORMAL", kind: "normal", tok: "Normal." },
      { q: "Waiting time until the next event?", name: "EXPONENTIAL", kind: "exp", tok: "Exponential." },
      { q: "Positive values, skewed by growth?", name: "LOG-NORMAL", kind: "lognormal", tok: "Log-normal." },
      { q: "A few giants holding most of it?", name: "PARETO", kind: "pareto", tok: "Pareto." },
    ]}
  />
);

export const S6Testing: React.FC = () => (
  <Family
    id="s6"
    label="FAMILY 3"
    pill="TOOLS FOR TESTING"
    color={TEST}
    y0={640}
    gap={200}
    h={150}
    qSize={30}
    nameSize={44}
    rows={[
      { q: "The average of a small sample?", name: "t-DISTRIBUTION", kind: "t", tok: "t-distribution." },
      { q: "Do counts match what you expect?", name: "CHI-SQUARE", kind: "chisq", tok: "Chi-square." },
    ]}
  />
);
