// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
// Day 3 reel cover on the shared 100 Days of ML cover (series banner + giant day number, readable on the profile grid).
import React from "react";
import { getInputProps } from "remotion";
import { Clusters, Flashcards, RobotDog } from "./components/Doodles";
import { MLCover, usePal } from "./components/MLCover";
import { ANSCOMBE, Scatter } from "./components/Charts";
import { alpha, theme } from "./theme";

const C = theme.colors;
const DONE = -200;
const TILES = [
  { I: Flashcards, t: "SUPERVISED", c: C.cyan },
  { I: Clusters, t: "UNSUPERVISED", c: C.orange },
  { I: RobotDog, t: "REINFORCEMENT", c: C.violet },
];

export const Cover: React.FC = () => {
  const pal = (getInputProps() as { pal?: string }).pal;
  const P = usePal(pal);
  return (
  <MLCover
    pal={pal}
    day={5}
    topic={
      <>
        <div style={{ fontSize: 96 }}>EXPLORATORY</div>
        <div style={{ fontSize: 96 }}>DATA ANALYSIS</div>
      </>
    }
    hook={<>EDA · the 6 problems it catches</>}
    hookY={1150}
    art={
      <div style={{ position: "absolute", left: 0, right: 0, top: 1270, display: "flex", justifyContent: "center", gap: 18 }}>
        {ANSCOMBE.map((pts, i) => (
          <div key={i} style={{ padding: 8, borderRadius: 18, background: P.panel, border: `3px solid ${alpha(C.yellow, 0.8)}` }}>
            <Scatter pts={pts} w={200} h={150} color={[C.cyan, C.green, C.orange, C.violet][i]} />
          </div>
        ))}
      </div>
    }
  />
  );
};
