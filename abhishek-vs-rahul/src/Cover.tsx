import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grain, Vignette } from "./components/Board";
import { Lettering, Panel } from "./components/Panel";
import { PhotoFrame } from "./components/Photo";
import { BatEmblem } from "./components/Viz";
import { A_COL, R_COL } from "./data";
import { theme } from "./theme";

const C = theme.colors;

// Reel cover — headline inside the profile-grid crop (centre 1080×1440, y 240–1680).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.board }}>
    <Backdrop lights={1.15} />
    <Panel x={60} y={262} w={470} h={470} delay={-30} seed={901} glow={`${A_COL}66`} glowOn={0.7}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: A_COL }} />
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <BatEmblem size={200} color={A_COL} glow={1} />
        <Lettering size={56}>ABHISHEK SHARMA</Lettering>
        <Lettering size={22} font="body" color={A_COL} spacing="0.24em">
          2268 RUNS · 1155 BALLS
        </Lettering>
      </div>
    </Panel>
    <PhotoFrame id="rahul-t20wc-2022" x={550} y={262} w={470} h={470} delay={-30} warmth={0.85} focus="50% 28%" zoom={[1.3, 1.3]} label="KL RAHUL" labelColor={R_COL} compact seed={902} />
    <Panel x={60} y={752} w={960} h={420} delay={-30} seed={903} glow={C.amberGlow} glowOn={0.8}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
        <Lettering size={130}>SAME RUNS.</Lettering>
        <Lettering size={118} color={C.amber} style={{ textShadow: `0 0 26px ${C.amberGlow}` }}>
          473 BALLS APART.
        </Lettering>
      </div>
    </Panel>
    <Panel x={60} y={1192} w={960} h={150} delay={-30} seed={904}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
        <Lettering size={72} color={A_COL}>
          ABHISHEK SHARMA
        </Lettering>
        <Lettering size={44} color={C.creamDim}>
          vs
        </Lettering>
        <Lettering size={72} color={R_COL}>
          KL RAHUL
        </Lettering>
      </div>
    </Panel>
    <Panel x={60} y={1362} w={960} h={110} delay={-30} seed={905}>
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
