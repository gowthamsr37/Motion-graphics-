// Thumbnail / cover frame for the Reel grid.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Coin } from "./components/Coin";
import { Grade, Grain, Sky, Vignette } from "./components/Layers";
import { Display, Label } from "./components/Type";
import { theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.sky }}>
    <Sky boost={1.2} />
    <div style={{ position: "absolute", left: 540 - 190, top: 300 }}>
      <Coin size={380} flip={0.35} glow={0.8} />
    </div>
    <div style={{ position: "absolute", left: 40, right: 40, top: 760, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <Display size={150} style={{ whiteSpace: "nowrap" }}>WIN THE TOSS</Display>
      <Display size={150} style={{ whiteSpace: "nowrap" }}>
        WIN THE MATCH<span style={{ color: C.red }}>?</span>
      </Display>
      <div style={{ height: 30 }} />
      <div style={{ padding: "16px 34px", borderRadius: 999, background: C.gold, boxShadow: `0 0 60px ${C.goldGlow}` }}>
        <span style={{ fontFamily: theme.fonts.body, fontWeight: 900, fontSize: 44, letterSpacing: "0.04em", color: C.sky }}>WE CHECKED 8,408 MATCHES</span>
      </div>
      <div style={{ height: 24 }} />
      <Label size={26} color={C.inkDim}>Beyond the scoreboard</Label>
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
