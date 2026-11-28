// Reel cover. Edit COVER. Key content stays inside the 1080×1350 grid crop (y 285–1635).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Disp, Label, Seam, Serif } from "./components/Ed";
import { config } from "./config";
import { theme } from "./theme";

const C = theme.colors;


export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: "#0A0D1A" }}>
    <Img src={staticFile("photos/team-trophy.jpg")} style={{ position: "absolute", inset: -60, width: "calc(100% + 120px)", height: "calc(100% + 120px)", objectFit: "cover", filter: "blur(36px) brightness(0.4) saturate(1.3)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(70% 45% at 50% 35%, rgba(232,40,59,0.25), rgba(10,13,26,0) 70%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
      <Label size={24} color="#D9B23A" spacing="0.34em">{config.file}</Label>
    </div>
    <div style={{ position: "absolute", left: 40, right: 40, top: 360, height: 560, overflow: "hidden", borderRadius: 18, border: "3px solid #D9B23A", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
      <Img src={staticFile("photos/team-trophy.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%" }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center" }}>
      <Disp size={190} color="#fff">Back to <span style={{ color: "#D9B23A" }}>back</span></Disp>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1170, textAlign: "center" }}>
      <span style={{ display: "inline-block", background: "#E8283B", padding: "10px 30px 4px", transform: "skewX(-8deg)" }}>
        <Disp size={66} color="#fff">Why RCB were unbeatable</Disp>
      </span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1330, display: "flex", justifyContent: "center", gap: 60 }}>
      {[["30", "KPIs"], ["10", "TEAMS"], ["#1", "AVG RANK"]].map(([v, l]) => (
        <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Disp size={90} color="#D9B23A">{v}</Disp>
          <Label size={16} color="rgba(255,255,255,0.65)">{l}</Label>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1540, textAlign: "center" }}>
      <Disp size={50} color="#fff">{config.series}</Disp>
    </div>
  </AbsoluteFill>
);
