// Day 1 reel cover on the shared 100 Days of ML cover (series banner + giant day number, readable on the profile grid).
import React from "react";
import { Envelope, MapPin, PhoneFace, PlayBtn } from "./components/Doodles";
import { MLCover, usePal } from "./components/MLCover";
import { alpha, glowText, theme } from "./theme";

const C = theme.colors;
const DONE = -200;
const ICONS = [PhoneFace, Envelope, PlayBtn, MapPin];
const TINTS = [C.cyan, C.orange, "#F0ABFC", C.green];
const P = usePal();

export const Cover: React.FC = () => (
  <MLCover
    day={1}
    topic={
      <>
        <div style={{ fontSize: 120 }}>WHAT IS</div>
        <div style={{ fontSize: 120 }}>MACHINE</div>
        <div style={{ fontSize: 120 }}>LEARNING?</div>
      </>
    }
    hook={
      <>
        You use it <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>12× a day</span>
      </>
    }
    art={ICONS.map((Ic, i) => (
      <div key={i} style={{ position: "absolute", left: 180 + i * 240, top: 1445, width: 200, height: 170, transform: "translate(-50%, -50%)", boxSizing: "border-box", borderRadius: 24, background: `linear-gradient(180deg, ${alpha(TINTS[i], 0.18)}, ${P.panel})`, border: `3px solid ${alpha(TINTS[i], 0.8)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={120} height={120} viewBox="0 0 120 120" style={{ overflow: "visible" }}>
          <Ic x={60} y={60} s={112} at={DONE} />
        </svg>
      </div>
    ))}
  />
);
