// Reel cover. Edit COVER. Key content stays inside the 1080×1350 grid crop (y 285–1635).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BigGlyph, Disp, Grain, Label, Paper, Seam, Serif, Vignette } from "./components/Ed";
import { config } from "./config";
import { theme } from "./theme";

const C = theme.colors;

const COVER = {
  glyph: "3",
  cutout: "placeholder-cut.png", // a cut-out from scripts/cutout.py; the face should land around x 400–600, y 650–750
  cutoutLeft: 190,
  cutoutTop: 552,
  cutoutWidth: 700,
  name: "The Hero",
  line: ["India have found their ", "No.3"], // [ink part, accent part]
  scores: [
    ["167", "GALLE"],
    ["117", "COLOMBO"],
    ["80", "WELLINGTON"],
  ],
};

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Paper warm={0.6} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
      <Label size={24} color={C.red} spacing="0.34em">
        {config.file}
      </Label>
    </div>
    <BigGlyph char={COVER.glyph} x={230} y={356} size={1000} draw={1} fill={0.92} />
    <Img
      src={staticFile(`photos/${COVER.cutout}`)}
      style={{
        position: "absolute",
        left: COVER.cutoutLeft,
        top: COVER.cutoutTop,
        width: COVER.cutoutWidth,
        filter: "drop-shadow(0 24px 30px rgba(40,30,10,0.28))",
        WebkitMaskImage: "linear-gradient(to bottom, #000 84%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, #000 84%, transparent 100%)",
      }}
    />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1236, textAlign: "center" }}>
      <Disp size={112}>{COVER.name}</Disp>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1372, textAlign: "center" }}>
      <Serif size={56} weight={900}>
        {COVER.line[0]}
        <span style={{ color: C.accent }}>{COVER.line[1]}</span>
      </Serif>
    </div>
    <Seam x={180} y={1466} w={720} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1484, display: "flex", justifyContent: "center", gap: 50 }}>
      {COVER.scores.map(([v, l]) => (
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
