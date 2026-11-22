import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar } from "./components/Cast";
import { Backdrop, Grade, Grain, Vignette } from "./components/Stage";
import { theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop />
    <div style={{ position: "absolute", left: 60, right: 60, top: 260, textAlign: "center" }}>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 32, letterSpacing: "0.2em", color: C.dim }}>MONEY STORIES · EP 01</div>
      <div style={{ fontFamily: theme.fonts.story, fontWeight: 700, fontSize: 128, lineHeight: 1.02, color: C.text, marginTop: 30 }}>
        <span style={{ color: C.arjun }}>He bought.</span>
        <br />
        <span style={{ color: C.meera }}>She rented.</span>
      </div>
      <div style={{ fontFamily: theme.fonts.story, fontStyle: "italic", fontWeight: 600, fontSize: 66, color: C.text, marginTop: 40 }}>20 years later…</div>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 1000, display: "flex", justifyContent: "space-around" }}>
      <Avatar who="arjun" mood="smug" size={380} />
      <Avatar who="meera" mood="happy" size={380} />
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
