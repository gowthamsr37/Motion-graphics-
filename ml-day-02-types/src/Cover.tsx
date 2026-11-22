// Day 2 reel cover on the shared 100 Days of ML cover (series banner + giant day number, readable on the profile grid).
import React from "react";
import { getInputProps } from "remotion";
import { Clusters, Flashcards, RobotDog } from "./components/Doodles";
import { MLCover, usePal } from "./components/MLCover";
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
    day={2}
    topic={
      <>
        <div style={{ fontSize: 120 }}>THE 3 TYPES</div>
        <div style={{ fontSize: 120 }}>OF ML</div>
      </>
    }
    hook={<>Which one fits your problem?</>}
    hookY={1150}
    art={TILES.map((k, i) => (
      <div key={k.t} style={{ position: "absolute", left: 220 + i * 320, top: 1420, width: 290, height: 230, transform: "translate(-50%, -50%)", boxSizing: "border-box", borderRadius: 24, background: `linear-gradient(180deg, ${alpha(k.c, 0.18)}, ${P.panel})`, border: `3px solid ${alpha(k.c, 0.85)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <svg width={140} height={140} viewBox="0 0 140 140" style={{ overflow: "visible" }}>
          <k.I x={70} y={70} s={135} at={DONE} />
        </svg>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 27, color: k.c, whiteSpace: "nowrap" }}>{k.t}</div>
      </div>
    ))}
  />
  );
};
