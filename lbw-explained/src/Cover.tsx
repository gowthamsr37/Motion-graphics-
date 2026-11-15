import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grain, Vignette } from "./components/Board";
import { Lamp, Lettering, Panel } from "./components/Panel";
import { GREEN, PitchView, RED } from "./components/Pitch";
import { theme } from "./theme";

const C = theme.colors;

// Reel cover — inside the profile-grid crop (centre 1080×1440, y 240–1680).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.board }}>
    <Backdrop lights={1.15} />
    <Panel x={60} y={262} w={960} h={600} delay={-30} seed={901}>
      <div style={{ position: "absolute", left: 0, top: -110, transform: "scale(1)", transformOrigin: "50% 0%" }}>
        <PitchView lanes={1} batterX={0.02} batterOn={0} />
      </div>
    </Panel>
    <Panel x={60} y={880} w={960} h={360} delay={-30} seed={902} glow={C.amberGlow} glowOn={0.8}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <Lettering size={150} color={C.amber} style={{ textShadow: `0 0 26px ${C.amberGlow}` }}>
          LBW
        </Lettering>
        <Lettering size={74}>EXPLAINED IN 3 LIGHTS</Lettering>
      </div>
    </Panel>
    <Panel x={60} y={1258} w={960} h={170} delay={-30} seed={903}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        {[["PITCH", GREEN], ["IMPACT", GREEN], ["WICKETS", RED]].map(([n, col]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Lamp color={col} glow={`${col}aa`} on={1} size={50} />
            <Lettering size={44}>{n}</Lettering>
          </div>
        ))}
      </div>
    </Panel>
    <Panel x={60} y={1446} w={960} h={110} delay={-30} seed={904}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Lettering size={60} spacing="0.04em">
          BEYOND THE SCOREBOARD
        </Lettering>
      </div>
    </Panel>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
