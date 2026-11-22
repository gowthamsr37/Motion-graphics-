// Cover: Kohli's day 5. Key content inside the 1080×1350 grid crop (y 285–1635).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BigGlyph, Disp, Grain, Label, Paper, Seam, Serif, Vignette } from "./components/Ed";
import { theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Paper warm={0.6} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
      <Label size={24} color={C.red} spacing="0.34em">
        Adelaide 2014 · Day 5
      </Label>
    </div>
    <BigGlyph char="364" x={40} y={360} size={560} width={1000} draw={1} fill={0} stroke={C.red} />
    <Img src={staticFile("photos/kohli-chest-cut.png")} style={{ position: "absolute", left: 330, top: 400, height: 900, filter: "drop-shadow(0 24px 30px rgba(40,30,10,0.3))", WebkitMaskImage: "linear-gradient(to bottom, #000 84%, transparent 100%)", maskImage: "linear-gradient(to bottom, #000 84%, transparent 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1250, textAlign: "center" }}>
      <Disp size={150} color={C.accent}>
        The Chase
      </Disp>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 1420, textAlign: "center" }}>
      <Serif size={44} weight={900}>
        364 to win. A 26-year-old captain. One day.
      </Serif>
    </div>
    <Seam x={200} y={1510} w={680} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1530, display: "flex", justifyContent: "center", gap: 50 }}>
      {[
        ["141", "KOHLI"],
        ["74", "OFF LYON"],
        ["48", "RUNS SHORT"],
      ].map(([v, l]) => (
        <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Disp size={74}>{v}</Disp>
          <Label size={15} color={C.mute}>
            {l}
          </Label>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1720, textAlign: "center" }}>
      <Disp size={46}>Beyond the Scoreboard</Disp>
    </div>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
