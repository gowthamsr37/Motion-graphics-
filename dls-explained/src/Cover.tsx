import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grain, Vignette } from "./components/Board";
import { AMBER, Rain, RAIN, RED } from "./components/DLS";
import { Lettering, Panel } from "./components/Panel";
import { Plates } from "./components/Plates";
import { theme } from "./theme";

const C = theme.colors;

// Reel cover — inside the profile-grid crop (centre 1080×1440, y 240–1680).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.board }}>
    <Backdrop lights={0.9} />
    <Panel x={60} y={262} w={960} h={240} delay={-30} seed={901}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <Lettering size={34} font="body" color={RAIN} spacing="0.3em">
          THE RAIN RULE, EXPLAINED
        </Lettering>
        <Lettering size={150} color={AMBER} style={{ textShadow: `0 0 26px ${C.amberGlow}` }}>
          DLS
        </Lettering>
      </div>
    </Panel>
    <Panel x={60} y={520} w={960} h={520} delay={-30} seed={902}>
      <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center" }}>
        <Lettering size={56}>250 IN 50 OVERS → CHASE IN 25</Lettering>
      </div>
      <div style={{ position: "absolute", top: 150, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 70 }}>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Lettering size={30} font="body" color={C.creamDim} spacing="0.2em">
            HALF?
          </Lettering>
          <Plates text="126" w={92} h={130} gap={8} color={C.creamDim} />
          <div style={{ position: "absolute", left: -16, right: -16, top: "58%", height: 12, background: RED, transform: "rotate(-10deg)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Lettering size={30} font="body" color={AMBER} spacing="0.2em">
            DLS TARGET
          </Lettering>
          <Plates text="170" w={92} h={130} gap={8} color={AMBER} glow={C.amberGlow} />
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 40, width: "100%", textAlign: "center" }}>
        <Lettering size={58} color={AMBER}>
          HALF THE OVERS ≠ HALF THE TARGET
        </Lettering>
      </div>
    </Panel>
    <Panel x={60} y={1058} w={960} h={190} delay={-30} seed={903}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <Lettering size={70} color={RAIN}>
          OVERS
        </Lettering>
        <Lettering size={70} color={C.creamDim}>
          +
        </Lettering>
        <Lettering size={70} color="#38B47A">
          WICKETS
        </Lettering>
        <Lettering size={70} color={C.creamDim}>
          =
        </Lettering>
        <Lettering size={70} color={AMBER}>
          RESOURCES
        </Lettering>
      </div>
    </Panel>
    <Panel x={60} y={1266} w={960} h={110} delay={-30} seed={904}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Lettering size={60} spacing="0.04em">
          BEYOND THE SCOREBOARD
        </Lettering>
      </div>
    </Panel>
    <Rain on={0.7} />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
