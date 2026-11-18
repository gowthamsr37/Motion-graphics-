// Reel cover: A/B TESTING · explained in 2 minutes · "WHICH BUTTON SELLS MORE?" with phone A (green, 8%) vs phone B
// (orange, 9.2%), @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { AC, BC, Phone } from "./components/AB";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.green} b={C.orange} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 280, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 190, whiteSpace: "nowrap", filter: `drop-shadow(0 0 30px ${alpha(BC, 0.4)})` }}>
        <span style={{ color: AC }}>A</span>
        <span style={{ color: C.text }}>/</span>
        <span style={{ color: BC }}>B</span>
      </div>
      <div style={{ marginTop: 6, fontSize: 124, color: C.text }}>TESTING</div>
      <div style={{ marginTop: 34, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 870, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text }}>
      WHICH BUTTON <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>SELLS MORE?</span>
    </div>
    {[
      { x: 320, c: AC, t: "A", v: "8%", r: -4 },
      { x: 760, c: BC, t: "B", v: "9.2%", r: 4 },
    ].map((p) => (
      <React.Fragment key={p.t}>
        <div style={{ position: "absolute", left: p.x, top: 1210, transform: `translate(-50%, -50%) rotate(${p.r}deg)` }}>
          <Phone color={p.c} w={230} tag={p.t} glow={0.8} />
        </div>
      </React.Fragment>
    ))}
    <div style={{ position: "absolute", left: 540, top: 1210, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.dim }}>VS</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1560, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
