import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grain, Vignette } from "./components/Board";
import { Lettering, Panel } from "./components/Panel";
import { Plates } from "./components/Plates";
import { AMBER, Coin, GREEN } from "./components/Toss";
import { theme } from "./theme";

const C = theme.colors;

// Reel cover — inside the profile-grid crop (centre 1080×1440, y 240–1680).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.board }}>
    <Backdrop lights={0.95} />
    <Panel x={60} y={262} w={960} h={130} delay={-30} seed={901}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <Lettering size={34} font="body" color={AMBER} spacing="0.34em">
          MYTH BUSTERS · #01
        </Lettering>
      </div>
    </Panel>
    <div style={{ position: "absolute", left: 540 - 190, top: 430 }}>
      <Coin size={380} angle={0.5} glow={0.8} />
    </div>
    <Panel x={60} y={850} w={960} h={330} delay={-30} seed={902} glow={C.amberGlow} glowOn={0.4}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <Lettering size={112}>DOES WINNING THE TOSS</Lettering>
        <Lettering size={150} color={AMBER} style={{ textShadow: `0 0 26px ${C.amberGlow}` }}>
          WIN MATCHES?
        </Lettering>
      </div>
    </Panel>
    <Panel x={60} y={1198} w={960} h={250} delay={-30} seed={903}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
        <Plates text="8,408" w={92} h={132} gap={8} color={GREEN} glow={C.greenGlow} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Lettering size={64}>MATCHES</Lettering>
          <Lettering size={64} color={C.creamDim}>
            ANALYSED
          </Lettering>
        </div>
      </div>
    </Panel>
    <Panel x={60} y={1466} w={960} h={110} delay={-30} seed={904}>
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
