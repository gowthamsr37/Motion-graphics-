// SCENE 4 — A MEDICAL TEST. The null: the patient is healthy. Test says sick, patient healthy → TYPE 1 (false alarm);
// test says healthy, patient sick → TYPE 2 (a miss).
import React from "react";
import { AbsoluteFill } from "remotion";
import { type Cell, Grid, NULLC, OKC, T1C, T2C } from "../components/Errors";
import { SceneTitle } from "../components/Kit";
import { Pop } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { useScene } from "../timing";

const CELLS: Cell[][] = [
  [
    { t: "TYPE 1", sub: "FALSE ALARM", color: T1C, err: true },
    { t: "CORRECT", color: OKC, err: false },
  ],
  [
    { t: "CORRECT", color: OKC, err: false },
    { t: "TYPE 2", sub: "A MISS", color: T2C, err: true },
  ],
];

export const S4Medical: React.FC = () => {
  const s = useScene("s4");
  const T1 = s.cueS(1, "Type");
  const T2 = s.cueS(2, "Type");
  return (
    <AbsoluteFill>
      <SceneTitle label="A MEDICAL TEST" color={T2C} at={2} />
      <Pop at={s.sent(0).from + 4} x={540} y={410} from="up" dist={12}>
        <Tag color={NULLC} size={28}>
          NULL: THE PATIENT IS HEALTHY
        </Tag>
      </Pop>
      <Grid
        y={660}
        colHead="THE PATIENT IS"
        cols={["HEALTHY", "SICK"]}
        rows={["TEST SAYS\nSICK", "TEST SAYS\nHEALTHY"]}
        cells={CELLS}
        headAt={s.sent(0).from + 10}
        cellAt={[
          [T1 - 6, s.sent(0).from + 16],
          [s.sent(0).from + 20, T2 - 6],
        ]}
      />
    </AbsoluteFill>
  );
};
