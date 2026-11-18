// SCENE 4 — THE ROADMAP, DAYS 45–100: ENSEMBLES · UNSUPERVISED · REAL-WORLD ML · DEEP LEARNING · PROJECTS.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneTitle } from "../components/Kit";
import { RoadRow } from "../components/ML";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S4Road2: React.FC = () => {
  const s = useScene("s4");
  const at = [s.cueS(0, "power"), s.sent(1).from, s.sent(2).from, s.cueS(3, "deep"), s.sent(3).to - 4];
  const rows = [
    { days: "45–52", name: "ENSEMBLES", topics: "Random forest · Boosting · XGBoost", c: C.orange },
    { days: "53–62", name: "UNSUPERVISED", topics: "K-means · Clustering · PCA · Anomalies", c: C.cyan },
    { days: "63–70", name: "REAL-WORLD ML", topics: "Forecasting · Recommenders · Deployment", c: C.green },
    { days: "71–90", name: "DEEP LEARNING", topics: "Neural nets · CNNs · Transformers · LLMs", c: C.violet },
    { days: "91–100", name: "PROJECTS", topics: "4 end-to-end builds · Interview prep", c: C.yellow },
  ];
  return (
    <AbsoluteFill>
      <SceneTitle label="THE ROADMAP" pill="DAYS 45–100" color={C.violet} at={2} pillAt={s.sent(0).from} />
      {rows.map((r, i) => (
        <RoadRow key={r.name} y={540 + i * 178} days={r.days} name={r.name} topics={r.topics} c={r.c} at={at[i]} next={at[i + 1] ?? s.duration} />
      ))}
    </AbsoluteFill>
  );
};
