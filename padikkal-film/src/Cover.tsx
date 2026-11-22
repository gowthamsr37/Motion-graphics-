import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Big3, Disp, Grain, Label, Paper, Seam, Serif, Vignette } from "./components/Ed";
import { theme } from "./theme";

const C = theme.colors;

// Reel cover. Key content sits inside the 1080×1350 grid crop (y 285–1635).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Paper warm={0.6} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
      <Label size={24} color={C.red} spacing="0.34em">
        The No.3 File
      </Label>
    </div>
    <Big3 x={230} y={356} size={1000} draw={1} fill={0.92} fillColor={C.saffron} />
    <Img
      src={staticFile("photos/pad-smile-cut.png")}
      style={{
        position: "absolute",
        left: 0,
        top: 552,
        width: 1080,
        filter: "drop-shadow(0 24px 30px rgba(40,30,10,0.28))",
        WebkitMaskImage: "linear-gradient(to bottom, #000 84%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, #000 84%, transparent 100%)",
      }}
    />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1236, textAlign: "center" }}>
      <Disp size={112}>Devdutt Padikkal</Disp>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1372, textAlign: "center" }}>
      <Serif size={56} weight={900}>
        India have found their <span style={{ color: C.saffron }}>No.3</span>
      </Serif>
    </div>
    <Seam x={180} y={1466} w={720} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1484, display: "flex", justifyContent: "center", gap: 50 }}>
      {[
        ["167", "GALLE"],
        ["117", "COLOMBO"],
        ["80", "WELLINGTON"],
      ].map(([v, l]) => (
        <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          <Disp size={84} color={C.ink}>
            {v}
          </Disp>
          <Label size={16} color={C.mute}>
            {l}
          </Label>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1700, textAlign: "center" }}>
      <Disp size={50} color={C.ink}>
        Beyond the Scoreboard
      </Disp>
    </div>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
