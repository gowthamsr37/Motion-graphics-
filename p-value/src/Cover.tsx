// Reel cover: THE p-VALUE · explained in 2 minutes · "p < 0.05 … BUT WHAT DOES IT MEAN?" over the fair-coin bars with
// the 9-or-10-heads tail lit (p = 0.01), @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { type BarGeo, bxk, HeadsBars } from "./components/Coins";
import { Badge } from "./components/Curve";
import { EXT, LINE, PLess, PV } from "./scenes/S1Hook";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const G: BarGeo = { x0: 190, x1: 890, base: 1340, h: 280 };

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.violet} b={C.orange} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 96, color: C.text }}>THE</div>
      <div style={{ marginTop: 6, fontSize: 168, background: `linear-gradient(90deg, ${PV}, ${EXT})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(PV, 0.45)})` }}>
        <span style={{ fontStyle: "italic" }}>p</span>-VALUE
      </div>
      <div style={{ marginTop: 34, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 860, width: 900, height: 600, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center" }}>
      <PLess v="0.05" size={60} color={LINE} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 990, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text }}>
      BUT WHAT DOES IT <span style={{ color: EXT, textShadow: glowText(EXT, 0.5) }}>MEAN</span>
      <span style={{ color: C.yellow }}>?</span>
    </div>
    <HeadsBars g={G} growAt={-100} hi={{ 9: EXT, 10: EXT }} color={C.cyan} labels={false} />
    <Badge x={bxk(G, 9.5)} y={1250} p={1} color={EXT} size={30}>
      p = 0.01
    </Badge>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1516, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
