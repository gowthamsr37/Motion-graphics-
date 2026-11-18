// Cover still: the null distribution with the observed value sitting dead centre.
import React from "react";
import { AbsoluteFill } from "remotion";
import { NullHist } from "./components/Charts";
import { Backdrop, Grade, Grain, Tag, Vignette } from "./components/Lab";
import { theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop />
    <div style={{ position: "absolute", left: 70, right: 70, top: 300 }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: 30, color: C.cyan, letterSpacing: "0.1em" }}>DATA LAB #01 · HYPOTHESIS TEST</div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 132, lineHeight: 0.98, letterSpacing: "-0.03em", color: C.text, marginTop: 26 }}>
        Does the
        <br />
        <span style={{ color: C.amber }}>toss</span> win
        <br />
        matches?
      </div>
      <div style={{ marginTop: 60, padding: "30px 30px 10px", borderRadius: 22, background: "rgba(15,23,38,0.7)", boxShadow: `inset 0 0 0 1.5px ${C.edge}` }}>
        <NullHist width={880} height={470} grow={-200} band={-200} instant observed={{ at: -200, value: 50.02 }} />
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 40 }}>
        <Tag color={C.amber} size={34}>7,965 matches</Tag>
        <Tag color={C.green} size={34}>p = ?</Tag>
      </div>
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
