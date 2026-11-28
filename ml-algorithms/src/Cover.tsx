// Reel cover (stats house style, navy): EVERY ML ALGORITHM · EXPLAINED IN 3 MINUTES · 12 numbered tiles coloured by
// family · 12 ALGORITHMS · 3 QUESTIONS · @curious_datascientist (all inside the 3:4 grid crop).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Bookmark } from "./components/Guide";
import { REI, SUP, UNS } from "./components/Algos";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;
const N = ["Linear Regression", "Logistic Regression", "Decision Tree", "Random Forest", "Gradient Boosting", "KNN", "Naive Bayes", "SVM", "K-Means", "PCA", "Neural Networks", "Reinforcement"];
const FC = [SUP, SUP, SUP, SUP, SUP, SUP, SUP, SUP, UNS, UNS, C.green, REI];

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.cyan} b={C.orange} />
    <div style={{ position: "absolute", left: 540, top: 300, transform: "translate(-50%, -50%)", padding: "10px 26px", borderRadius: 999, background: C.red, border: `2px solid ${C.red}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.text, whiteSpace: "nowrap" }}>INTERVIEW QUESTION</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 132, color: C.text }}>WHICH ML</div>
      <div style={{ fontSize: 124, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.orange})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(C.violet, 0.45)})` }}>ALGORITHM<span style={{ WebkitTextFillColor: C.yellow }}>?</span></div>
      <div style={{ marginTop: 18, fontSize: 52, color: C.text }}>would you use, <span style={{ color: C.yellow }}>and why?</span></div>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 760, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
      {N.map((n, i) => (
        <div key={n} style={{ height: 112, borderRadius: 20, background: `linear-gradient(180deg, ${alpha(FC[i], 0.22)}, rgba(14,24,64,0.94))`, border: `3px solid ${FC[i]}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: FC[i], textShadow: glowText(FC[i], 0.3) }}>{i + 1}</div>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: n.length > 15 ? 24 : 28, color: C.text, whiteSpace: "nowrap" }}>{n}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 540, top: 1400, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 16, padding: "12px 30px", borderRadius: 999, background: alpha(C.green, 0.2), border: `3px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
      <Bookmark size={38} color={C.green} />
      12 ALGORITHMS · 3 QUESTIONS
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1490, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 38, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
