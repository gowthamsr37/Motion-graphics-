// SCENE 6 — THE AVERAGE is right in the middle: the dice's six bars balance at 3.5; the bus wait (0–10) at 5 minutes.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { CONT, DISC } from "./S1Hook";

const C = theme.colors;
const BASE = 1080;

export const S6Average: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const DICE = s.cueS(1, "dice,");
  const W35 = s.cueS(1, "35.");
  const BUS = s.cueS(1, "bus,");
  const W5 = s.cueS(1, "5");
  const panels = [
    { x: 300, c: DISC, t: "DICE", at: DICE, mark: W35, label: "3.5", ticks: ["1", "6"] },
    { x: 780, c: CONT, t: "BUS WAIT", at: BUS, mark: W5, label: "5 min", ticks: ["0", "10"] },
  ];

  return (
    <AbsoluteFill>
      <SceneTitle label="THE AVERAGE" color={CONT} at={2} />
      <Pop at={s.sent(0).from + 4} x={540} y={430} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>
          RIGHT IN THE <span style={{ color: C.text, textShadow: glowText("#F3F7FF", 0.5) }}>MIDDLE</span>
        </div>
      </Pop>
      {panels.map((pn, i) => {
        const p = spr(6 + i * 6 + (pn.at > 1e9 ? 1 : 0), theme.spring.bouncy);
        if (p <= 0.001) return null;
        const x0 = pn.x - 170;
        const x1 = pn.x + 170;
        const line = ease(frame, [pn.mark - 4, pn.mark + 10], [0, 1]);
        return (
          <div key={pn.t} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 30}px)` }}>
            <div style={{ position: "absolute", left: pn.x - 220, top: 640, width: 440, height: 560, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(180deg, ${alpha(pn.c, 0.14)}, rgba(14,24,64,0.9))`, border: `3px solid ${alpha(pn.c, 0.7)}` }} />
            <div style={{ position: "absolute", left: pn.x, top: 700, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: pn.c }}>{pn.t}</div>
            {i === 0 ? (
              Array.from({ length: 6 }, (_, j) => <div key={j} style={{ position: "absolute", left: x0 + j * 57 + 4, top: BASE - 220, width: 49, height: 220, borderRadius: "8px 8px 2px 2px", background: alpha(DISC, 0.5), border: `2px solid ${DISC}`, boxSizing: "border-box" }} />)
            ) : (
              <div style={{ position: "absolute", left: x0, top: BASE - 220, width: x1 - x0, height: 220, borderRadius: "8px 8px 2px 2px", background: alpha(CONT, 0.3), border: `4px solid ${CONT}`, boxSizing: "border-box" }} />
            )}
            <div style={{ position: "absolute", left: x0 - 10, top: BASE + 1, width: x1 - x0 + 20, height: 3, background: alpha(C.text, 0.4) }} />
            {pn.ticks.map((t, k) => (
              <div key={t} style={{ position: "absolute", left: k === 0 ? x0 + (i === 0 ? 28 : 0) : x1 - (i === 0 ? 28 : 0), top: BASE + 28, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: C.dim }}>{t}</div>
            ))}
            {line > 0.01 ? (
              <>
                <div style={{ position: "absolute", left: pn.x - 3, top: BASE - 290 * line, width: 6, height: 290 * line, background: C.text, borderRadius: 3, boxShadow: `0 0 12px ${alpha("#F3F7FF", 0.8)}` }} />
                <div style={{ position: "absolute", left: pn.x, top: BASE - 320, transform: `translate(-50%, -50%) scale(${interpolate(line, [0, 1], [0.6, 1])})`, padding: "4px 16px", borderRadius: 999, background: "#0A1440", border: `3px solid ${C.text}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>{pn.label}</div>
              </>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
