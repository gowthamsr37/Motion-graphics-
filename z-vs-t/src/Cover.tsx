// Reel cover: THE COMPLETE COMPARISON tag · Z-TEST vs t-TEST · SAME −2, WHO'S RIGHT? with the two verdicts, a mini cut-off
// ladder (2.571 → 1.96: "t BECOMES z"), SAVE THIS FOR YOUR INTERVIEW, @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Bookmark } from "./components/Guide";
import { SEc, TC, TL, ZC } from "./components/ZT";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const LAD: [string, number][] = [["df 5", 2.571], ["df 10", 2.228], ["df 30", 2.042], ["df 100", 1.984], ["z", 1.96]];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 540, top: 290, transform: "translate(-50%, -50%)", padding: "10px 26px", borderRadius: 999, background: alpha(SEc, 0.18), border: `2px solid ${SEc}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.2em", color: C.text, whiteSpace: "nowrap" }}>THE COMPLETE COMPARISON</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 150, color: ZC, textShadow: glowText(ZC, 0.5) }}>Z-TEST</div>
      <div style={{ fontSize: 60, color: C.dim, margin: "6px 0" }}>vs</div>
      <div style={{ fontSize: 150, color: TC, textShadow: glowText(TC, 0.5) }}>
        <span style={{ fontStyle: "italic" }}>t</span>-TEST
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 820, width: 900, height: 520, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text }}>
      SAME −2. <span style={{ color: TL, textShadow: glowText(TL, 0.5) }}>WHO&apos;S RIGHT</span>
      <span style={{ color: C.yellow }}>?</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 950, display: "flex", justifyContent: "center", gap: 20 }}>
      <div style={{ padding: "10px 22px", borderRadius: 18, background: alpha(ZC, 0.16), border: `2px solid ${ZC}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text }}>
        z: <span style={{ color: TL }}>REJECT</span>
      </div>
      <div style={{ padding: "10px 22px", borderRadius: 18, background: alpha(TC, 0.16), border: `2px solid ${TC}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text }}>
        t: <span style={{ color: SEc }}>FAIL TO REJECT</span>
      </div>
    </div>
    {LAD.map(([l, v], i) => (
      <div key={l} style={{ position: "absolute", left: 200, top: 1050 + i * 52, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 110, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: l === "z" ? ZC : C.dim, textAlign: "right" }}>{l}</div>
        <div style={{ width: (v - 1.9) * 700, height: 30, borderRadius: 8, background: alpha(l === "z" ? ZC : TC, 0.6), border: `2px solid ${l === "z" ? ZC : TC}` }} />
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: C.text }}>{v === 1.96 ? "1.96" : v.toFixed(3)}</div>
      </div>
    ))}
    <div style={{ position: "absolute", left: 790, top: 1170, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, textAlign: "center", lineHeight: 1.1 }}>
      <span style={{ color: TC }}>t</span> BECOMES
      <br />
      <span style={{ color: ZC, textShadow: glowText(ZC, 0.5) }}>z</span>
    </div>
    <div style={{ position: "absolute", left: 540, top: 1410, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 14, padding: "10px 28px", borderRadius: 999, background: alpha(SEc, 0.2), border: `3px solid ${SEc}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
      <Bookmark size={32} color={SEc} />
      SAVE THIS FOR YOUR INTERVIEW
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1490, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
