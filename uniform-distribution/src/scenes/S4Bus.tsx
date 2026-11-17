// SCENE 4 — CONTINUOUS: WAITING FOR A BUS. A bus every 10 minutes; you arrive at a random moment. Your wait jumps
// around (7.2, 1.5, 9.1, 4.4 min…): anything from 0 to 10, all equally likely → a flat rectangle from 0 to 10.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bus, Person } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { CONT } from "./S1Hook";

const C = theme.colors;
export const TX0 = 190;
export const TX1 = 890;
export const tx = (m: number) => TX0 + (m / 10) * (TX1 - TX0);
const LINE_Y = 640;
const WAITS = [7.2, 1.5, 9.1, 4.4, 2.8, 6.3];

export const Rect: React.FC<{ base: number; h: number; p: number; color: string; x0?: number; x1?: number }> = ({ base, h, p, color, x0 = TX0, x1 = TX1 }) => (
  <>
    <div style={{ position: "absolute", left: x0, top: base - h * p, width: x1 - x0, height: h * p, boxSizing: "border-box", borderRadius: "10px 10px 2px 2px", background: alpha(color, 0.3), border: `4px solid ${color}`, boxShadow: `0 0 24px ${alpha(color, 0.35)}` }} />
  </>
);

export const MinAxis: React.FC<{ base: number; max?: number; step?: number; p?: number; at?: (m: number) => number }> = ({ base, max = 10, step = 2, p = 1, at = tx }) => (
  <>
    <div style={{ position: "absolute", left: at(0) - 20, top: base + 1, width: at(max) - at(0) + 40, height: 4, borderRadius: 2, background: alpha(C.text, 0.4), opacity: p }} />
    {Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step).map((m) => (
      <div key={m} style={{ position: "absolute", left: at(m), top: base + 30, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: C.dim, opacity: p }}>{m}</div>
    ))}
    <div style={{ position: "absolute", left: at(max) + 40, top: base + 30, transform: "translateY(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, color: C.dim, opacity: p }}>min</div>
  </>
);

export const S4Bus: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const BUS = 10; // the timeline is on screen from the start; its label comes with "A bus comes every 10 minutes"
  const BUSW = s.sent(1).from;
  const RANDOM = s.cueS(1, "random");
  const WAIT = s.sent(2).from;
  const RECT = s.sent(3).from;
  const k = Math.max(0, Math.min(WAITS.length - 1, Math.floor((frame - WAIT) / 18)));
  const wait = frame >= WAIT ? WAITS[k] : 6.3;
  const arrive = 10 - wait;
  const arrIn = spr(RANDOM - 4, theme.spring.bouncy);
  const rect = ease(frame, [RECT - 4, RECT + 14], [0, 1], theme.ease.out);

  return (
    <AbsoluteFill>
      <SceneTitle label="CONTINUOUS" pill="WAITING FOR A BUS" color={CONT} at={2} pillAt={s.sent(0).from} />
      {/* the timeline: a bus at 0 and at 10 */}
      {frame >= BUS - 6 ? (
        <>
          <div style={{ position: "absolute", left: TX0, top: LINE_Y - 2, width: (TX1 - TX0) * ease(frame, [BUS - 4, BUS + 10], [0, 1]), height: 5, borderRadius: 3, background: alpha(C.text, 0.45) }} />
          {[0, 10].map((m, i) => (
            <div key={m} style={{ position: "absolute", left: tx(m), top: LINE_Y - 60, transform: `translate(-50%, -50%) scale(${spr(BUS + i * 6, theme.spring.bouncy)})` }}>
              <Bus w={110} color={CONT} />
            </div>
          ))}
          {[0, 10].map((m) => (
            <div key={`l${m}`} style={{ position: "absolute", left: tx(m), top: LINE_Y + 30, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: C.dim, opacity: ease(frame, [BUS + 4, BUS + 14], [0, 1]) }}>{m} min</div>
          ))}
          <Pop at={BUSW + 4} x={540} y={LINE_Y - 150} from="up" dist={12}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: CONT, whiteSpace: "nowrap" }}>A BUS EVERY 10 MINUTES</div>
          </Pop>
        </>
      ) : null}
      {/* you arrive at a random moment */}
      {arrIn > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: tx(arrive), top: LINE_Y - 4, transform: `translate(-50%, -100%) scale(${arrIn})`, transformOrigin: "bottom center" }}>
            <Person height={90} shirt={C.cyan} />
          </div>
          {frame >= WAIT - 4 ? (
            <>
              <div style={{ position: "absolute", left: tx(arrive), top: LINE_Y + 70, width: tx(10) - tx(arrive), height: 6, borderRadius: 3, background: C.orange, boxShadow: `0 0 10px ${C.orange}` }} />
              <div style={{ position: "absolute", left: (tx(arrive) + tx(10)) / 2, top: LINE_Y + 110, transform: "translate(-50%, -50%)", padding: "4px 16px", borderRadius: 12, background: C.orange, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.ink, whiteSpace: "nowrap" }}>wait {wait.toFixed(1)}</div>
            </>
          ) : null}
        </>
      ) : null}
      <Pop at={WAIT + 10} out={RECT - 4} x={540} y={900} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          ANYWHERE FROM <span style={{ color: CONT, textShadow: glowText(CONT, 0.5) }}>0 TO 10</span>
        </div>
      </Pop>
      {/* the flat rectangle */}
      {rect > 0.01 ? (
        <>
          <Rect base={1210} h={240} p={rect} color={CONT} />
          <MinAxis base={1210} p={rect} />
          <Pop at={RECT + 8} x={540} y={900} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
            <Pill label="A FLAT RECTANGLE" color={CONT} size={40} glow={0.8} />
          </Pop>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
