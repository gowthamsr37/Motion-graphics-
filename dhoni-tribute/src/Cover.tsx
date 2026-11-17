import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Grain, Vignette } from "./components/Board";
import { Lettering, Panel } from "./components/Panel";
import { AMBER } from "./components/Toss";
import { YELLOW } from "./components/Tribute";
import { theme } from "./theme";

const C = theme.colors;

// Reel cover — key content inside the profile-grid crop (centre 1080×1440, y 240–1680).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.board }}>
    <Img src={staticFile("photos/dhoni-portrait.jpg")} style={{ position: "absolute", left: 0, top: 120, width: 1080, height: 1350, objectFit: "cover", objectPosition: "50% 20%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,15,12,0.85) 0%, rgba(10,15,12,0.1) 22%, rgba(10,15,12,0.05) 50%, rgba(10,15,12,0.85) 72%, rgba(10,15,12,1) 85%)" }} />
    <Panel x={60} y={262} w={960} h={120} delay={-30} seed={901}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Lettering size={40} font="body" color={AMBER} spacing="0.34em">
          IPL 2008 — 2025
        </Lettering>
      </div>
    </Panel>
    <Panel x={60} y={1150} w={960} h={330} delay={-30} seed={902} glow={C.amberGlow} glowOn={0.4}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <Lettering size={150} color={YELLOW} style={{ textShadow: "0 0 30px rgba(249,205,27,0.35)" }}>
          MS DHONI
        </Lettering>
        <Lettering size={78}>THE END OF AN ERA</Lettering>
      </div>
    </Panel>
    <Panel x={60} y={1496} w={960} h={110} delay={-30} seed={903}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Lettering size={58} spacing="0.04em">
          BEYOND THE SCOREBOARD
        </Lettering>
      </div>
    </Panel>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
