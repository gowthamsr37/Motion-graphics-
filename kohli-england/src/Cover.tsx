import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grain, Vignette } from "./components/Board";
import { Lettering, Panel } from "./components/Panel";
import { PhotoFrame } from "./components/Photo";
import { Plates } from "./components/Plates";
import { theme } from "./theme";

const C = theme.colors;

// Reel cover — the headline sits inside the profile-grid crop (centre 1080×1440, y 240–1680).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.board }}>
    <Backdrop lights={1.1} />
    <Panel x={60} y={258} w={960} h={128} delay={-30} seed={901}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <Lettering size={78}>VIRAT KOHLI</Lettering>
        <Lettering size={24} font="body" color={C.amber} spacing="0.36em">
          TESTS IN ENGLAND · 2014 / 2018
        </Lettering>
      </div>
    </Panel>
    <PhotoFrame id="otr-scoreboard-2014" x={60} y={402} w={470} h={430} delay={-30} warmth={0.1} focus="58% 45%" zoom={[1.12, 1.12]} label="2014" labelColor="#8E8A7C" compact seed={902} />
    <PhotoFrame id="kohli-century-tb-2018" x={550} y={402} w={470} h={430} delay={-30} warmth={1} focus="50% 38%" zoom={[1.12, 1.12]} label="2018" compact seed={903} glow={C.amberGlow} glowOn={0.5} />
    {[
      { n: "134", l: "RUNS.", col: C.red, glow: C.redGlow },
      { n: "10", l: "INNINGS.", col: C.cream, glow: undefined },
    ].map((r, i) => (
      <Panel key={r.l} x={60} y={850 + i * 222} w={960} h={206} delay={-30} seed={904 + i} glow={r.glow} glowOn={0.7}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", gap: 40, padding: "0 56px" }}>
          <Plates text={r.n} w={112} h={160} gap={10} color={r.col} glow={r.glow} />
          <Lettering size={140} color={r.col} style={r.glow ? { textShadow: `0 0 24px ${r.glow}` } : undefined}>
            {r.l}
          </Lettering>
        </div>
      </Panel>
    ))}
    <Panel x={60} y={1294} w={960} h={190} delay={-30} seed={906} glow={C.amberGlow} glowOn={0.8}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Lettering size={118} color={C.amber} style={{ textShadow: `0 0 26px ${C.amberGlow}` }}>
          THE ENGLAND NIGHTMARE
        </Lettering>
      </div>
    </Panel>
    <Panel x={60} y={1500} w={960} h={104} delay={-30} seed={907}>
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
