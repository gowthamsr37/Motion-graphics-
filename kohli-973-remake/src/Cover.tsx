import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grain, Vignette } from "./components/Board";
import { Lettering, Panel } from "./components/Panel";
import { PhotoFrame } from "./components/Photo";
import { Plates } from "./components/Plates";
import { FullBleed, RCB_RED } from "./components/Season";
import { theme } from "./theme";

const C = theme.colors;

// Reel cover — "973 RUNS — VIRAT KOHLI — IPL 2016", inside the profile-grid crop (centre 1080×1440, y 240–1680).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.board }}>
    <Backdrop lights={1.15} />
    <FullBleed id="chin-fireworks-2014" y={0} h={900} inAt={-30} focus="50% 35%" zoom={[1.2, 1.2]} tint="red" dim={0.3} captionY={2000} />
    <PhotoFrame id="kohli-june-2016" x={300} y={262} w={480} h={560} delay={-30} warmth={1} focus="50% 0%" origin="52% 4%" zoom={[2.0, 2.0]} label="2016" compact seed={901} glow={C.amberGlow} glowOn={0.6} />
    <Panel x={60} y={846} w={960} h={330} delay={-30} seed={902} glow={C.amberGlow} glowOn={0.9}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 34 }}>
        <Plates text="973" w={170} h={240} gap={14} color={C.amber} glow={C.amberGlow} />
        <Lettering size={150} color={C.amber} style={{ textShadow: `0 0 26px ${C.amberGlow}` }}>
          RUNS
        </Lettering>
      </div>
    </Panel>
    <Panel x={60} y={1192} w={960} h={190} delay={-30} seed={903}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <Lettering size={120}>VIRAT KOHLI</Lettering>
      </div>
    </Panel>
    <Panel x={60} y={1398} w={960} h={130} delay={-30} seed={904} glow={C.redGlow} glowOn={0.5}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <div style={{ width: 14, height: 70, background: RCB_RED, borderRadius: 3 }} />
        <Lettering size={92} color={C.cream}>
          IPL 2016
        </Lettering>
      </div>
    </Panel>
    <Panel x={60} y={1544} w={960} h={100} delay={-30} seed={905}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Lettering size={56} spacing="0.04em">
          BEYOND THE SCOREBOARD
        </Lettering>
      </div>
    </Panel>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
