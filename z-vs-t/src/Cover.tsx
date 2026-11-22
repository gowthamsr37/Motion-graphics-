// Reel cover (v2): MOST ASKED IN INTERVIEWS · Z-TEST OR t-TEST? · hero chart (thin-tailed z bell, dashed, vs the fat-tailed
// t bell with its tails shaded) · SAME DATA, OPPOSITE ANSWERS with the two verdicts · THE ONE QUESTION: IS σ KNOWN? ·
// SAVE THIS FOR YOUR INTERVIEW · @curious_datascientist. No "df" anywhere (viewers read it as "data frame").
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { FnCurve } from "./components/Curve";
import { Bookmark } from "./components/Guide";
import { npdf, tpdf } from "./components/TDist";
import { Sigma } from "./components/ZKit";
import { SEc, TC, TL, ZC } from "./components/ZT";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const G = { x0: 120, x1: 960, vmin: -4.2, vmax: 4.2, base: 1010, h: 300 };
const FM = npdf(0);
const t2 = (v: number) => tpdf(v, 2);

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 540, top: 270, transform: "translate(-50%, -50%)", padding: "10px 28px", borderRadius: 999, background: alpha(C.yellow, 0.16), border: `2px solid ${C.yellow}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.2em", color: C.text, whiteSpace: "nowrap" }}>MOST ASKED IN INTERVIEWS</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
      <div style={{ fontSize: 140, color: ZC, textShadow: glowText(ZC, 0.55) }}>Z-TEST</div>
      <div style={{ fontSize: 56, color: C.dim, margin: "8px 0" }}>OR</div>
      <div style={{ fontSize: 140, color: TC, textShadow: glowText(TC, 0.55) }}>
        <span style={{ fontStyle: "italic" }}>t</span>-TEST<span style={{ color: C.yellow }}>?</span>
      </div>
    </div>
    {/* hero: two bells */}
    <FnCurve g={G} f={t2} fmax={FM} color={TC} fill={0.16} width={7} bands={[{ a: -4.2, b: -2, color: TL, opacity: 0.6 }, { a: 2, b: 4.2, color: TL, opacity: 0.6 }]} />
    <FnCurve g={G} f={npdf} fmax={FM} color={ZC} fill={0} dashed width={6} />
    <div style={{ position: "absolute", left: G.x0, width: G.x1 - G.x0, top: G.base, height: 4, background: alpha(C.text, 0.4) }} />
    <div style={{ position: "absolute", left: 640, top: 735, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.1em", color: ZC, whiteSpace: "nowrap" }}>z: THIN TAILS</div>
    <div style={{ position: "absolute", left: 720, top: 905, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.1em", color: TL, whiteSpace: "nowrap" }}>t: FAT TAILS</div>
    {/* the puzzle */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1050, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 50, color: C.text, whiteSpace: "nowrap" }}>
      SAME DATA. <span style={{ color: TL, textShadow: glowText(TL, 0.5) }}>OPPOSITE ANSWERS.</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1135, display: "flex", justifyContent: "center", gap: 22 }}>
      <div style={{ padding: "12px 26px", borderRadius: 20, background: alpha(ZC, 0.16), border: `3px solid ${ZC}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
        z: <span style={{ color: TL }}>REJECT</span>
      </div>
      <div style={{ padding: "12px 26px", borderRadius: 20, background: alpha(TC, 0.16), border: `3px solid ${TC}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
        t: <span style={{ color: SEc }}>FAIL TO REJECT</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 540, top: 1290, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 14, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: C.text, whiteSpace: "nowrap" }}>
      THE ONE QUESTION: IS <Sigma size={62} color={C.yellow} /> <span>KNOWN<span style={{ color: C.yellow }}>?</span></span>
    </div>
    <div style={{ position: "absolute", left: 540, top: 1400, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 14, padding: "10px 28px", borderRadius: 999, background: alpha(SEc, 0.2), border: `3px solid ${SEc}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
      <Bookmark size={32} color={SEc} />
      SAVE THIS FOR YOUR INTERVIEW
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1480, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
