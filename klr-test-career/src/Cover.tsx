import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grain, Vignette } from "./components/Board";
import { Timeline } from "./components/Career";
import { Lettering, Panel } from "./components/Panel";
import { Plates } from "./components/Plates";
import { AMBER, GREEN, RED } from "./components/Toss";
import { theme } from "./theme";

const C = theme.colors;

// Reel cover — inside the profile-grid crop (centre 1080×1440, y 240–1680).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.board }}>
    <Backdrop lights={1} />
    <Panel x={60} y={262} w={960} h={300} delay={-30} seed={901} glow={C.amberGlow} glowOn={0.4}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <Lettering size={34} font="body" color={C.creamDim} spacing="0.3em">
          THE TEST CAREER OF
        </Lettering>
        <Lettering size={150} color={AMBER} style={{ textShadow: `0 0 26px ${C.amberGlow}` }}>
          KL RAHUL
        </Lettering>
      </div>
    </Panel>
    <Panel x={60} y={578} w={960} h={600} delay={-30} seed={902}>
      <div style={{ position: "absolute", left: 20, top: 16 }}>
        <Timeline w={920} h={570} />
      </div>
    </Panel>
    <Panel x={60} y={1194} w={960} h={250} delay={-30} seed={903}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
        <Lettering size={84}>
          <span style={{ color: GREEN }}>HIGHS</span> · <span style={{ color: RED }}>LOWS</span> · <span style={{ color: AMBER }}>136</span>
        </Lettering>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Plates text="13" w={60} h={90} gap={6} color={AMBER} glow={C.amberGlow} />
          <Lettering size={40} color={C.creamDim}>
            TEST HUNDREDS · 4,424 RUNS
          </Lettering>
        </div>
      </div>
    </Panel>
    <Panel x={60} y={1460} w={960} h={110} delay={-30} seed={904}>
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
