// Cover. Key content inside the 1080×1350 grid crop (y 285–1635).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BigGlyph, Disp, Grain, Label, Paper, Seam, Serif, Vignette } from "./components/Ed";
import { config } from "./config";
import impact from "./impact.json";
import { theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Paper warm={0.6} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
      <Label size={24} color={C.red} spacing="0.34em">
        {config.file}
      </Label>
    </div>
    <BigGlyph char="6" x={230} y={350} size={1000} draw={1} fill={0.92} />
    <Img src={staticFile("photos/pant-hit-cut.png")} style={{ position: "absolute", left: 150, top: 420, width: 760, filter: "drop-shadow(0 24px 30px rgba(40,30,10,0.28))", WebkitMaskImage: "linear-gradient(to bottom, #000 86%, transparent 100%)", maskImage: "linear-gradient(to bottom, #000 86%, transparent 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1250, textAlign: "center" }}>
      <Disp size={112}>Rishabh Pant</Disp>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1384, textAlign: "center" }}>
      <Serif size={52} weight={900}>
        What happens when <span style={{ color: C.accent }}>he walks in</span>
      </Serif>
    </div>
    <Seam x={180} y={1474} w={720} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1492, display: "flex", justifyContent: "center", gap: 46 }}>
      {[
        [impact.pant_sr.toFixed(0), "PER 100 BALLS"],
        ["108", "TEST SIXES"],
        [(impact.overs_saved_vs_base / 90).toFixed(1), "DAYS BOUGHT"],
      ].map(([v, l]) => (
        <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Disp size={84}>{v}</Disp>
          <Label size={16} color={C.mute}>
            {l}
          </Label>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1700, textAlign: "center" }}>
      <Disp size={50}>{config.series}</Disp>
    </div>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
