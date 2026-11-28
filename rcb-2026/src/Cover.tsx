// Reel cover. Edit COVER. Key content stays inside the 1080×1350 grid crop (y 285–1635).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Disp, Label, Seam, Serif } from "./components/Ed";
import { config } from "./config";
import { theme } from "./theme";

const C = theme.colors;


export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: "#0A0E1E" }}>
    <Img src={staticFile("photos/team-trophy.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%", transform: "scale(1.08)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,14,30,0.6) 0%, rgba(10,14,30,0.05) 28%, rgba(10,14,30,0.3) 50%, rgba(10,14,30,0.94) 75%, rgba(10,14,30,0.98) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
      <Label size={24} color="#C9A227" spacing="0.34em">
        {config.file}
      </Label>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center" }}>
      <Disp size={180} color={C.paperHi}>Back to</Disp>
      <br />
      <Disp size={180} color="#C9A227">back</Disp>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1384, textAlign: "center" }}>
      <Serif size={54} weight={900} color={C.paperHi}>
        Why RCB were the <span style={{ color: "#E5333F" }}>most complete team</span>
      </Serif>
    </div>
    <Seam x={180} y={1478} w={720} color="#C9A227" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1500, display: "flex", justifyContent: "center", gap: 60 }}>
      {[["30", "KPIs"], ["10", "TEAMS"], ["#1", "AVG RANK"]].map(([v, l]) => (
        <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Disp size={84} color={C.paperHi}>{v}</Disp>
          <Label size={16} color="rgba(255,255,255,0.6)">{l}</Label>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1700, textAlign: "center" }}>
      <Disp size={50} color={C.paperHi}>{config.series}</Disp>
    </div>
  </AbsoluteFill>
);
