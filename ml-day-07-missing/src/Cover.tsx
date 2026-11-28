// ADAPT FOR THIS VIDEO: copied from the reference project (house style). Keep the layer stack, look and mix; replace scene list, cues and cover text.
// Day 3 reel cover on the shared 100 Days of ML cover (series banner + giant day number, readable on the profile grid).
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
    day={7}
    topic={
      <>
        <div style={{ fontSize: 110 }}>MISSING</div>
        <div style={{ fontSize: 110 }}>VALUES</div>
      </>
    }
    hook={<>the complete guide · 3 types · 6 fixes</>}
    hookY={1150}
    art={
      <div style={{ position: "absolute", left: 60, right: 60, top: 1290, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
        {["DROP ROWS", "DROP COLUMN", "MEDIAN", "BY GROUP", "PREDICT", "FLAG"].map((t, i) => (
          <div key={t} style={{ padding: "10px 20px", borderRadius: 16, background: P.panel, border: `3px solid ${alpha(C.yellow, 0.85)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: "#FFFFFF" }}>
            <span style={{ color: C.yellow }}>{i + 1}</span> {t}
          </div>
        ))}
      </div>
    }
  />
  );
};
