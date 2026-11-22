// Reel cover (v2, puzzle hook): PART 2 · FULL CALCULATION + t TABLE · TWO-SAMPLE t-TEST · BRAND B LASTS 3 HOURS LONGER.
// REAL, OR JUST LUCK? · the real data as dots (A: 6 8 7 5 9, B: 9 10 8 11 12) with the two averages and the overlap
// highlighted · FORMULA · STANDARD ERROR · t TABLE · p-VALUE · SAVE THIS FOR YOUR INTERVIEW · @curious_datascientist.
// No "df" anywhere (viewers read it as "data frame").
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Bookmark } from "./components/Guide";
import { BatteryGlyph } from "./components/Prob";
import { BA, BB, SE, TAIL } from "./components/TKit";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const X0 = 250, X1 = 950, V0 = 4, V1 = 13;
const px = (v: number) => X0 + ((v - V0) / (V1 - V0)) * (X1 - X0);
const ROWS = [
  { n: "A", c: BA, y: 930, d: [6, 8, 7, 5, 9], avg: 7, lvl: 7 / 12 },
  { n: "B", c: BB, y: 1050, d: [9, 10, 8, 11, 12], avg: 10, lvl: 10 / 12 },
];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.violet} />
    <div style={{ position: "absolute", left: 540, top: 270, transform: "translate(-50%, -50%)", padding: "10px 26px", borderRadius: 999, background: alpha(SE, 0.18), border: `2px solid ${SE}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>PART 2 · FULL CALCULATION + t TABLE</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
      <div style={{ fontSize: 86, color: C.text }}>TWO-SAMPLE</div>
      <div style={{ fontSize: 190, background: `linear-gradient(90deg, ${BA}, ${BB})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(BB, 0.5)})` }}>
        <span style={{ fontStyle: "italic" }}>t</span>-TEST
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.12, whiteSpace: "nowrap" }}>
      <div style={{ fontSize: 46, color: C.text }}>
        BRAND B LASTS <span style={{ color: BB, textShadow: glowText(BB, 0.5) }}>3 HOURS</span> LONGER.
      </div>
      <div style={{ fontSize: 60, color: C.yellow, textShadow: glowText(C.yellow, 0.45) }}>REAL, OR JUST LUCK?</div>
    </div>
    {/* the data */}
    <div style={{ position: "absolute", left: 90, top: 830, width: 900, height: 380, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }} />
    <div style={{ position: "absolute", left: px(8) - 24, width: px(9) - px(8) + 48, top: 870, height: 250, borderRadius: 18, background: alpha(TAIL, 0.12), border: `2px dashed ${alpha(TAIL, 0.8)}` }} />
    <div style={{ position: "absolute", left: (px(8) + px(9)) / 2, top: 852, transform: "translateX(-50%)", padding: "2px 12px", borderRadius: 8, background: "rgba(14,24,64,0.95)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: TAIL, whiteSpace: "nowrap" }}>OVERLAP</div>
    {ROWS.map((r) => (
      <React.Fragment key={r.n}>
        <div style={{ position: "absolute", left: 120, top: r.y, transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 10 }}>
          <BatteryGlyph size={64} color={r.c} level={r.lvl} />
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: r.c }}>{r.n}</span>
        </div>
        {r.d.map((v, i) => (
          <div key={i} style={{ position: "absolute", left: px(v) - 20, top: r.y - 20, width: 40, height: 40, borderRadius: 20, background: alpha(r.c, 0.85), border: `3px solid ${C.text}`, boxShadow: `0 0 14px ${alpha(r.c, 0.7)}` }} />
        ))}
        <div style={{ position: "absolute", left: px(r.avg) - 3, top: r.y - 44, width: 6, height: 88, borderRadius: 3, background: C.yellow, boxShadow: `0 0 10px ${C.yellow}` }} />
        <div style={{ position: "absolute", left: px(r.avg) + (r.n === "A" ? -14 : 14), top: r.y + (r.n === "A" ? -74 : 42), transform: r.n === "A" ? "translateX(-100%)" : "none", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: C.yellow, whiteSpace: "nowrap" }}>AVG {r.avg} h</div>
      </React.Fragment>
    ))}
    <div style={{ position: "absolute", left: X0, width: X1 - X0, top: 1140, height: 4, background: alpha(C.text, 0.4) }} />
    {[4, 6, 8, 10, 12].map((v) => (
      <div key={v} style={{ position: "absolute", left: px(v), top: 1152, transform: "translateX(-50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, color: C.dim }}>{v} h</div>
    ))}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", justifyContent: "center", gap: 12 }}>
      {["FORMULA", "STANDARD ERROR", "t TABLE", "p-VALUE"].map((t, i) => (
        <div key={t} style={{ padding: "8px 16px", borderRadius: 14, border: `2px solid ${[SE, BA, TAIL, BB][i]}`, background: alpha([SE, BA, TAIL, BB][i], 0.14), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 21, letterSpacing: "0.08em", color: C.text, whiteSpace: "nowrap" }}>{t}</div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 540, top: 1370, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 14, padding: "10px 28px", borderRadius: 999, background: alpha(SE, 0.2), border: `3px solid ${SE}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
      <Bookmark size={32} color={SE} />
      SAVE THIS FOR YOUR INTERVIEW
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1450, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
