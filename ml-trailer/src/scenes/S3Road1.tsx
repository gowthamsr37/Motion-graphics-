// SCENE 3 — THE ROADMAP, DAYS 1–44: FOUNDATIONS · DATA PREP · REGRESSION · CLASSIFICATION · MODEL SELECTION, each row
// lighting up as it is named.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneTitle } from "../components/Kit";
import { RoadRow } from "../components/ML";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S3Road1: React.FC = () => {
  const s = useScene("s3");
  const at = [s.cueS(1, "foundations:"), s.sent(2).from, s.cueS(3, "Regression"), s.cueS(3, "classification,"), s.sent(4).from];
  const rows = [
    { days: "1–10", name: "FOUNDATIONS", topics: "How machines learn · Overfitting · Gradient descent", c: C.cyan },
    { days: "11–18", name: "DATA PREP", topics: "Missing values · Encoding · Scaling · Leakage", c: C.cyan },
    { days: "19–26", name: "REGRESSION", topics: "Linear · Polynomial · Ridge and Lasso", c: C.violet },
    { days: "27–40", name: "CLASSIFICATION", topics: "Logistic · KNN · Decision trees · SVM · Metrics", c: C.violet },
    { days: "41–44", name: "MODEL SELECTION", topics: "Cross-validation · Hyperparameter tuning", c: C.green },
  ];
  return (
    <AbsoluteFill>
      <SceneTitle label="THE ROADMAP" pill="DAYS 1–44" color={C.cyan} at={2} pillAt={s.sent(0).from} />
      {rows.map((r, i) => (
        <RoadRow key={r.name} y={540 + i * 178} days={r.days} name={r.name} topics={r.topics} c={r.c} at={at[i]} next={at[i + 1] ?? s.duration} />
      ))}
    </AbsoluteFill>
  );
};
