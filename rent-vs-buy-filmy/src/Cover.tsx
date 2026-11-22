// Movie-poster cover.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Character } from "./components/Cast";
import { Backdrop, Film, PosterText } from "./components/Stage";
import { theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop />
    <div style={{ position: "absolute", left: 110, right: 110, top: 200, textAlign: "center" }}>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, letterSpacing: "0.2em", color: C.gold }}>MONEY STORIES · EPISODE 1</div>
      <div style={{ marginTop: 30 }}>
        <PosterText size={150}>RENT</PosterText>
        <div style={{ fontFamily: theme.fonts.filmy, fontSize: 70, color: C.cream, textShadow: `0 3px 0 ${C.ink}` }}>or</div>
        <PosterText size={150}>BUY?</PosterText>
      </div>
      <div style={{ fontFamily: theme.fonts.filmy, fontSize: 52, color: C.cream, marginTop: 24, textShadow: `0 3px 0 ${C.ink}` }}>20 years. ₹1.7 crore gap.</div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 980 }}>
      <Character who="arjun" mood="smug" size={450} delay={-60} glow />
    </div>
    <div style={{ position: "absolute", left: 540, top: 980 }}>
      <Character who="meera" mood="happy" size={450} delay={-60} glow />
    </div>
    <Film />
  </AbsoluteFill>
);
