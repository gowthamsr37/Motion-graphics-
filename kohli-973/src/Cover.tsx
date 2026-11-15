import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grain, Vignette } from "./components/Board";
import { Lamp, Lettering, Panel } from "./components/Panel";
import { Plates } from "./components/Plates";
import { theme } from "./theme";

const C = theme.colors;

// Reel cover: the same Adelaide board, frozen on the season's number.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.board }}>
    <Backdrop lights={1} />
    <Panel x={60} y={236} w={960} h={128} delay={-30} seed={801}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Lettering size={90} spacing="0.04em">
          BEYOND THE SCOREBOARD
        </Lettering>
      </div>
    </Panel>
    <Panel x={60} y={392} w={960} h={700} delay={-30} seed={802} glow={C.amberGlow} glowOn={1}>
      <div style={{ position: "absolute", top: 56, width: "100%", display: "flex", justifyContent: "center" }}>
        <Plates text="973" w={262} h={372} gap={22} color={C.amber} glow={C.amberGlow} glowOn={1} />
      </div>
      <div style={{ position: "absolute", top: 470, width: "100%", textAlign: "center" }}>
        <Lettering size={170} color={C.amber} style={{ textShadow: `0 0 30px ${C.amberGlow}` }}>
          RUNS
        </Lettering>
      </div>
    </Panel>
    <Panel x={60} y={1120} w={960} h={150} delay={-30} seed={803}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
        <Lamp color={C.red} glow={C.redGlow} on={1} />
        <Lettering size={96}>27 SHORT OF 1,000</Lettering>
      </div>
    </Panel>
    <Panel x={60} y={1298} w={960} h={130} delay={-30} seed={804}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Lettering size={80} color={C.cream}>
          VIRAT KOHLI — IPL 2016
        </Lettering>
      </div>
    </Panel>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
