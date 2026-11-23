// Cover. Key content inside the 1080×1350 grid crop (y 285–1635).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BigGlyph, Disp, Grain, Label, Paper, Seam, Serif, Vignette } from "./components/Ed";
import { config } from "./config";
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
    <BigGlyph char="9" x={230} y={350} size={1000} draw={1} fill={0.92} />
    <Img src={staticFile("photos/pant-raise-bat-cut.png")} style={{ position: "absolute", left: 386, top: 410, height: 860, filter: "drop-shadow(0 24px 30px rgba(40,30,10,0.3))", WebkitMaskImage: "linear-gradient(to bottom, #000 86%, transparent 100%)", maskImage: "linear-gradient(to bottom, #000 86%, transparent 100%)" }} />
    <div style={{ position: "absolute", left: 40, right: 40, top: 1240, textAlign: "center" }}>
      <Disp size={96}>India's greatest</Disp>
      <div style={{ marginTop: -4 }}>
        <Disp size={96} color={C.accent}>
          keeper-batter?
        </Disp>
      </div>
    </div>
    <Seam x={200} y={1462} w={680} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", justifyContent: "center", gap: 44 }}>
      {[
        ["9", "HUNDREDS"],
        ["+25", "TEMPO GAP"],
        ["108", "SIXES"],
        ["7", "AWAY 100s"],
      ].map(([v, l]) => (
        <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Disp size={72}>{v}</Disp>
          <Label size={14} color={C.mute}>
            {l}
          </Label>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1610, textAlign: "center" }}>
      <Serif size={34} color={C.ink2}>
        Pant v Dhoni, Gilchrist & the world's keepers
      </Serif>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1720, textAlign: "center" }}>
      <Disp size={46}>{config.series}</Disp>
    </div>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
