import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Backdrop, Grain, Vignette } from "./components/Board";
import { Lettering, Panel } from "./components/Panel";
import { Plates } from "./components/Plates";
import { AMBER } from "./components/Toss";
import { theme } from "./theme";

const C = theme.colors;

// Reel cover — inside the profile-grid crop (centre 1080×1440, y 240–1680).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.board }}>
    <Backdrop lights={1} />
    <Panel x={60} y={262} w={960} h={250} delay={-30} seed={901} glow={C.amberGlow} glowOn={0.4}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <Lettering size={36} font="body" color={C.creamDim} spacing="0.3em">
          INDIA'S NEW No.3
        </Lettering>
        <Lettering size={124} color={AMBER} style={{ textShadow: `0 0 26px ${C.amberGlow}` }}>
          DEVDUTT PADIKKAL
        </Lettering>
      </div>
    </Panel>
    <div style={{ position: "absolute", left: 60, top: 528, width: 960, height: 640, padding: 10, boxSizing: "border-box", borderRadius: 10, background: `linear-gradient(180deg, ${C.panelHi}, ${C.board})`, boxShadow: `inset 0 0 0 2px ${C.panelEdge}` }}>
      <Img src={staticFile("photos/pad-smile.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "45% 25%", borderRadius: 4 }} />
    </div>
    <Panel x={60} y={1184} w={960} h={260} delay={-30} seed={902}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <Plates text="167" w={58} h={88} gap={5} color={AMBER} glow={C.amberGlow} />
          <Plates text="117" w={58} h={88} gap={5} color={AMBER} glow={C.amberGlow} />
          <Plates text=" 80" w={58} h={88} gap={5} color={AMBER} glow={C.amberGlow} />
        </div>
        <Lettering size={52}>HAS INDIA FOUND ITS No.3?</Lettering>
      </div>
    </Panel>
    <Panel x={60} y={1460} w={960} h={110} delay={-30} seed={903}>
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
