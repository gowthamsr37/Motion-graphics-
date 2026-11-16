// Reel cover: HOW TO TREAT OUTLIERS · explained in 2 minutes · the decision fork with all seven treatments · handle.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { TREATS } from "./components/Kit";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const O = C.orange;

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={O} b={C.cyan} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 100, color: C.text }}>HOW TO TREAT</div>
      <div style={{ marginTop: 14, fontSize: 176, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(C.violet, 0.45)})` }}>OUTLIERS</div>
      <div style={{ marginTop: 30, fontSize: 52, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>

    <div style={{ position: "absolute", left: 90, top: 960, width: 900, height: 480, boxSizing: "border-box", borderRadius: 36, background: "linear-gradient(180deg, rgba(26,40,98,0.9), rgba(14,24,64,0.9))", border: `2px solid ${C.edge}` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center" }}>
        <span style={{ display: "inline-block", padding: "8px 22px", borderRadius: 999, border: `3px solid ${O}`, background: alpha(O, 0.18), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, boxShadow: `0 0 20px ${alpha(O, 0.4)}` }}>ASK WHY FIRST</span>
      </div>
      {[
        { x: 230, label: "MISTAKE", col: C.violet, items: TREATS.slice(0, 3) },
        { x: 670, label: "REAL BUT RARE", col: C.cyan, items: TREATS.slice(3) },
      ].map((b) => (
        <div key={b.label} style={{ position: "absolute", left: b.x - 190, top: 110, width: 380, textAlign: "center" }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: b.col, textShadow: glowText(b.col, 0.4), letterSpacing: "0.04em" }}>{b.label}</div>
          {b.items.map((t, i) => {
            const G = t.glyph;
            return (
              <div key={t.label} style={{ margin: "14px auto 0", width: 330, display: "flex", alignItems: "center", gap: 14, padding: "10px 16px", borderRadius: 18, background: alpha(b.col, 0.12), border: `2px solid ${alpha(b.col, 0.55)}`, boxSizing: "border-box", marginTop: i === 0 ? 16 : 12 }}>
                <G size={30} color={b.col} />
                <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 24, color: C.text, whiteSpace: "nowrap" }}>{t.label}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>

    <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
