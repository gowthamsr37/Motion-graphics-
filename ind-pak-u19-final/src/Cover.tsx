import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grain, Vignette } from "./components/Board";
import { Lettering, Panel } from "./components/Panel";
import { Plates } from "./components/Plates";
import { theme } from "./theme";

const C = theme.colors;
// Faint team colours, kept to thin painted rules so the aged board palette stays in charge.
const INDIA = ["#E8833A", "#EDE4CC", "#2E7D4F"];
const PAK = ["#1F6B3A", "#EDE4CC"];

const Rule: React.FC<{ cols: string[] }> = ({ cols }) => (
  <div style={{ display: "flex", height: 6, width: 180, borderRadius: 3, overflow: "hidden", opacity: 0.75 }}>
    {cols.map((c, i) => (
      <div key={i} style={{ flex: 1, background: c }} />
    ))}
  </div>
);

// Reel cover — headline sits inside the profile-grid crop (centre 1080×1440).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.board }}>
    <Backdrop lights={1.15} />
    <Panel x={60} y={262} w={960} h={180} delay={-30} seed={901}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Rule cols={INDIA} />
          <Lettering size={84}>INDIA vs PAKISTAN</Lettering>
          <Rule cols={PAK} />
        </div>
        <Lettering size={28} font="body" color={C.amber} spacing="0.32em">
          U19 ASIA CUP FINAL 2026
        </Lettering>
      </div>
    </Panel>
    {[
      ["3", "RUNS.", C.amber, C.amberGlow],
      ["1", "BALL.", C.cream, undefined],
      ["1", "WICKET.", C.red, C.redGlow],
    ].map(([n, l, col, glow], i) => (
      <Panel key={l} x={60} y={466 + i * 300} w={960} h={280} delay={-30} seed={902 + i} glow={glow} glowOn={0.8}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", gap: 46, padding: "0 70px" }}>
          <Plates text={n as string} w={170} h={236} color={col as string} glow={glow as string | undefined} />
          <Lettering size={170} color={col as string} style={glow ? { textShadow: `0 0 26px ${glow}` } : undefined}>
            {l}
          </Lettering>
        </div>
      </Panel>
    ))}
    <Panel x={60} y={1392} w={960} h={150} delay={-30} seed={905}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Lettering size={86} spacing="0.04em">
          BEYOND THE SCOREBOARD
        </Lettering>
      </div>
    </Panel>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
