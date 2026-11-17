import React from "react";
import { AbsoluteFill } from "remotion";
import { Bg, Coin, Grain, Txt, Vignette } from "./components/Kit";
import { Meter } from "./components/Meter";
import { theme } from "./theme";

const C = theme.colors;

// Reel cover — key content inside the profile-grid crop (centre 1080×1440, y 240–1680).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg0 }}>
    <Bg />
    <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "10px 22px 8px", borderRadius: 10, background: C.red, boxShadow: `0 0 24px ${C.redGlow}` }}>
        <Txt size={34} font="body" weight={900} spacing="0.12em">
          MYTH BUSTERS #01
        </Txt>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      <Txt size={150} style={{ textShadow: "0 10px 0 rgba(0,0,0,0.5)" }}>
        DOES THE TOSS
      </Txt>
      <Txt size={210} color={C.gold} style={{ textShadow: `0 0 50px ${C.goldGlow}, 0 10px 0 rgba(0,0,0,0.5)` }}>
        WIN MATCHES?
      </Txt>
    </div>
    <div style={{ position: "absolute", left: 60, top: 840 }}>
      <Meter w={960} needles={[{ v: 50.9, color: C.green }]} zoneGlow={1} />
    </div>
    <div style={{ position: "absolute", left: 540 - 60, top: 1235 }}>
      <Coin size={120} angle={0.4} glow={0.8} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1390, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <Txt size={64}>8,408 MATCHES. ONE ANSWER.</Txt>
      <Txt size={30} font="body" weight={900} color={C.dim} spacing="0.16em">
        BEYOND THE SCOREBOARD
      </Txt>
    </div>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
