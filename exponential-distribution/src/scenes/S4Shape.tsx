// SCENE 4 — THE SHAPE (average wait 15 min): the curve starts highest at 0 and slides down → short waits are most
// common. Within 5 min: 28% (0–5 shaded green). Longer than 30 min: 14% (30–60 shaded orange).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ExpCurve, type ExpGeo, ey, MinAxis, tx } from "../components/Exp";
import { SceneTitle } from "../components/Kit";
import { ease, exitP, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { GAP, LONG, RATE, SHORT } from "./S1Hook";

const C = theme.colors;
export const G: ExpGeo = { x0: 130, x1: 950, tmax: 60, base: 1180, h: 500 };

export const Badge: React.FC<{ x: number; y: number; p: number; color: string; children: React.ReactNode; size?: number }> = ({ x, y, p, color, children, size = 30 }) =>
  p > 0.01 ? (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), padding: "6px 16px", borderRadius: 14, background: "#0A1440", border: `3px solid ${color}`, boxShadow: `0 0 18px ${alpha(color, 0.4)}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: size, color: C.text, whiteSpace: "nowrap" }}>{children}</div>
  ) : null;

export const S4Shape: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const HIGH = s.cueS(0, "highest");
  const SHORTW = s.sent(1).from;
  const FIVE = s.sent(2).from;
  const P28 = s.cueS(2, "28%.");
  const HALF = s.sent(3).from;
  const P14 = s.cueS(3, "14%.");
  const draw = ease(frame, [6, 40], [0, 1], theme.ease.inOut);
  const b1 = ease(frame, [FIVE + 4, FIVE + 22], [0, 1]);
  const b2 = ease(frame, [HALF + 4, HALF + 26], [0, 1]);
  const highOut = exitP(frame, FIVE - 2, 8);
  const dotP = spr(HIGH - 4, theme.spring.pop);
  const axisHi: Record<number, string> = {};
  if (frame >= FIVE) axisHi[0] = SHORT;
  if (frame >= HALF) axisHi[30] = LONG;

  return (
    <AbsoluteFill>
      <SceneTitle label="THE SHAPE" color={GAP} at={2} />
      <Pop at={4} x={540} y={420} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Pill label="AVERAGE WAIT = 15 MIN" color={RATE} size={32} glow={0.4} />
      </Pop>
      <ExpCurve g={G} p={draw} color={GAP} bands={[{ a: 0, b: 5, color: SHORT, p: b1 }, { a: 30, b: 60, color: LONG, p: b2 }]} />
      <MinAxis g={G} ticks={[0, 15, 30, 45, 60]} p={ease(frame, [2, 14], [0, 1])} hi={axisHi} />
      {/* highest at zero */}
      {dotP > 0.01 && highOut < 1 ? (
        <>
          <div style={{ position: "absolute", left: tx(G, 0) - 18, top: ey(G, 0, 15) - 18, width: 36, height: 36, borderRadius: 18, background: GAP, boxShadow: `0 0 24px ${GAP}`, transform: `scale(${dotP * (1 + 0.12 * Math.sin(frame / 4))})`, opacity: 1 - highOut }} />
          <div style={{ position: "absolute", left: tx(G, 0) + 40, top: ey(G, 0, 15) - 20, transform: "translateY(-50%)", opacity: Math.min(1, dotP * 2) * (1 - highOut), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
            HIGHEST AT <span style={{ color: GAP, textShadow: glowText(GAP, 0.5) }}>0</span>
          </div>
        </>
      ) : null}
      <Pop at={SHORTW - 2} out={FIVE - 4} x={540} y={530} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: SHORT, textShadow: glowText(SHORT, 0.5) }}>SHORT WAITS</span> ARE MOST COMMON
        </div>
      </Pop>
      {/* the question first ("within 5 minutes?"), the answer joins on the spoken number */}
      <Pop at={FIVE + 2} out={HALF - 4} x={540} y={530} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          WITHIN <span style={{ color: SHORT, textShadow: glowText(SHORT, 0.5) }}>5 MIN</span>
          {frame >= P28 - 4 ? ": ABOUT 28%" : <span style={{ color: C.yellow }}>?</span>}
        </div>
      </Pop>
      <Pop at={HALF + 2} x={540} y={530} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          OVER <span style={{ color: LONG, textShadow: glowText(LONG, 0.5) }}>30 MIN</span>
          {frame >= P14 - 4 ? ": ABOUT 14%" : <span style={{ color: C.yellow }}>?</span>}
        </div>
      </Pop>
      <Badge x={tx(G, 7.5) + 30} y={ey(G, 7.5, 15) - 70} p={spr(P28 - 2, theme.spring.pop)} color={SHORT}>28%</Badge>
      <Badge x={tx(G, 40)} y={ey(G, 40, 15) - 70} p={spr(P14 - 2, theme.spring.pop)} color={LONG}>14%</Badge>
    </AbsoluteFill>
  );
};
