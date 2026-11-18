// SCENE 3 — FOUR OUTCOMES. The truth (null true / null false) × your decision (reject / keep): two correct boxes and
// the two errors, TYPE 1 (false alarm: reject a true null) and TYPE 2 (miss: keep a false null).
import React from "react";
import { AbsoluteFill } from "remotion";
import { type Cell, Grid, OKC, T1C, T2C } from "../components/Errors";
import { SceneTitle } from "../components/Kit";
import { useScene } from "../timing";

export const CELLS: Cell[][] = [
  [
    { t: "TYPE 1", sub: "FALSE ALARM", color: T1C, err: true },
    { t: "CORRECT", color: OKC, err: false },
  ],
  [
    { t: "CORRECT", color: OKC, err: false },
    { t: "TYPE 2", sub: "MISS", color: T2C, err: true },
  ],
];

export const S3Grid: React.FC = () => {
  const s = useScene("s3");
  const OK = s.cueS(2, "correct.");
  const ERR = s.cueS(2, "errors.");
  return (
    <AbsoluteFill>
      <SceneTitle label="FOUR OUTCOMES" color={T1C} at={2} />
      <Grid
        y={640}
        cols={["NULL TRUE", "NULL FALSE"]}
        rows={["REJECT\nTHE NULL", "KEEP\nTHE NULL"]}
        cells={CELLS}
        headAt={s.sent(1).from}
        cellAt={[
          [ERR - 4, OK - 4],
          [OK + 2, ERR + 4],
        ]}
      />
    </AbsoluteFill>
  );
};
