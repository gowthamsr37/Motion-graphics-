import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Backdrop, Grain, Vignette } from "./components/Board";
import { Lettering, Panel } from "./components/Panel";
import { Plates } from "./components/Plates";
import { AMBER, GREEN, RED } from "./components/Toss";
import { theme } from "./theme";

const C = theme.colors;

// Reel cover — inside the profile-grid crop (centre 1080×1440, y 240–1680).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.board }}>
    <Backdrop lights={1} />
    <Panel x={60} y={262} w={960} h={290} delay={-30} seed={901} glow={C.amberGlow} glowOn={0.4}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <Lettering size={34} font="body" color={C.creamDim} spacing="0.3em">
          THE TEST CAREER OF
        </Lettering>
        <Lettering size={140} color={AMBER} style={{ textShadow: `0 0 26px ${C.amberGlow}` }}>
          RISHABH PANT
        </Lettering>
      </div>
    </Panel>
    <div style={{ position: "absolute", left: 60, top: 570, width: 960, height: 560, padding: 10, boxSizing: "border-box", borderRadius: 10, background: `linear-gradient(180deg, ${C.panelHi}, ${C.board})`, boxShadow: `inset 0 0 0 2px ${C.panelEdge}` }}>
      <Img src={staticFile("photos/pant-oval-2018.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "38% 60%", borderRadius: 4 }} />
    </div>
    <Panel x={60} y={1146} w={960} h={300} delay={-30} seed={902}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <Lettering size={72}>
          <span style={{ color: GREEN }}>SPIN</span> · <span style={{ color: AMBER }}>OVERSEAS</span> · <span style={{ color: RED }}>THE 90s</span>
        </Lettering>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <Plates text="7" w={60} h={90} gap={6} color={RED} />
          <Lettering size={38} color={C.creamDim}>
            NINETIES ·
          </Lettering>
          <Plates text="9" w={60} h={90} gap={6} color={AMBER} glow={C.amberGlow} />
          <Lettering size={38} color={C.creamDim}>
            HUNDREDS
          </Lettering>
        </div>
      </div>
    </Panel>
    <Panel x={60} y={1462} w={960} h={110} delay={-30} seed={903}>
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
