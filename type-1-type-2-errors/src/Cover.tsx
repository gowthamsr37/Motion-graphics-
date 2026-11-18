// Reel cover: TYPE 1 & TYPE 2 ERRORS · explained in 2 minutes · "2 WAYS A TEST CAN BE WRONG": FALSE ALARM (ringing
// alarm, no fire) vs A MISS (silent alarm, real fire), @curious_datascientist.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Grade, Grain, Vignette } from "./components/Backdrop";
import { Flame, SmokeAlarm, T1C, T2C } from "./components/Errors";
import { alpha, glowText, HANDLE, theme } from "./theme";

const C = theme.colors;

const Card: React.FC<{ x: number; tag: string; name: string; color: string; children: React.ReactNode }> = ({ x, tag, name, color, children }) => (
  <div style={{ position: "absolute", left: x, top: 1210, width: 380, height: 400, transform: "translate(-50%, -50%)", boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(180deg, ${alpha(color, 0.22)}, rgba(14,24,64,0.9) 70%)`, border: `3px solid ${color}`, boxShadow: `0 0 30px ${alpha(color, 0.3)}` }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 28, textAlign: "center" }}>
      <span style={{ padding: "6px 18px", borderRadius: 999, background: color, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.ink }}>{tag}</span>
    </div>
    <div style={{ position: "absolute", left: 190, top: 190, transform: "translate(-50%, -50%)" }}>{children}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, textShadow: glowText(color, 0.5), whiteSpace: "nowrap" }}>{name}</div>
  </div>
);

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Backdrop a={C.orange} b={C.violet} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
      <div style={{ fontSize: 104, whiteSpace: "nowrap" }}>
        <span style={{ color: T1C, textShadow: glowText(T1C, 0.45) }}>TYPE 1</span> <span style={{ color: C.text }}>&amp;</span> <span style={{ color: T2C, textShadow: glowText(T2C, 0.45) }}>TYPE 2</span>
      </div>
      <div style={{ marginTop: 14, fontSize: 140, color: C.text }}>ERRORS</div>
      <div style={{ marginTop: 34, fontSize: 50, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
        explained in <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>2 minutes</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text }}>
      2 WAYS A TEST CAN BE <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>WRONG</span>
    </div>
    <Card x={320} tag="TYPE 1" name="FALSE ALARM" color={T1C}>
      <SmokeAlarm size={170} ring={0.35} />
    </Card>
    <Card x={760} tag="TYPE 2" name="A MISS" color={T2C}>
      <div style={{ position: "relative", width: 200, height: 190 }}>
        <div style={{ position: "absolute", left: 0, top: -10 }}>
          <SmokeAlarm size={120} />
        </div>
        <div style={{ position: "absolute", left: 86, top: 64 }}>
          <Flame size={120} flick={0.5} />
        </div>
      </div>
    </Card>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1480, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text }}>
      <span style={{ color: C.cyan }}>@</span>
      {HANDLE.slice(1)}
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
