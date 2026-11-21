// SCENE 4 — STEPS 1 AND 2: ONE TAIL OR TWO. H0: µ = 200 ml. Two H1 cards side by side, each with its own zone curve:
// TWO-TAILED (µ ≠ 200, "either direction") and ONE-TAILED (µ < 200, "one direction"). On "alpha" the critical regions
// shade: 2.5% + 2.5% vs all 5% in the left tail. WE'LL WORK OUT BOTH.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { NotEqual } from "../components/Icons";
import { ease, Pop, useSpr } from "../components/Motion";
import { CLAIM, StepTracker, TAIL, zGeo } from "../components/ZKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { ZoneCurve } from "./S9Critical";

const C = theme.colors;
const GL = zGeo(1030, 150, 110, 520);
const GR = zGeo(1030, 150, 560, 970);

const Card: React.FC<{ x: number; at: number; c: string; title: string; h1: React.ReactNode; note: string }> = ({ x, at, c, title, h1, note }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: 620, width: 430, height: 560, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(180deg, ${alpha(c, 0.18)}, rgba(14,24,64,0.92) 50%)`, border: `3px solid ${c}`, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * 40}px) scale(${interpolate(Math.min(1, p), [0, 1], [0.9, 1])})`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 26, gap: 12 }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: c, textShadow: glowText(c, 0.4) }}>{title}</div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: C.text, display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap" }}>{h1}</div>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: C.dim }}>{note}</div>
    </div>
  );
};

export const S4Setup: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const TWO = s.cueS(1, "two-tailed");
  const ONE = s.cueS(1, "one-tailed");
  const AL = s.sent(2).from;
  const zL = ease(frame, [s.cueS(2, "splits") - 6, s.cueS(2, "splits") + 12], [0, 1]);
  const zR = ease(frame, [s.cueS(2, "One-tailed") - 6, s.cueS(2, "One-tailed") + 12], [0, 1]);
  const dL = ease(frame, [TWO + 6, TWO + 30], [0, 1], theme.ease.inOut);
  const dR = ease(frame, [ONE + 6, ONE + 30], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <StepTracker active={frame >= AL ? 1 : 0} />
      <Pop at={s.cueS(0, "H0") - 4} x={540} y={430} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ padding: "14px 40px", borderRadius: 26, background: alpha(CLAIM, 0.16), border: `3px solid ${CLAIM}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 50, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: CLAIM }}>H0</span>: µ = <span style={{ fontFamily: theme.fonts.mono }}>200 ml</span>
        </div>
      </Pop>
      <Pop at={TWO - 6} x={540} y={540} from="up" dist={8}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.dim }}>H1 CAN BE…</div>
      </Pop>
      <Card x={90} at={TWO} c={CLAIM} title="TWO-TAILED" h1={<>H1: µ <NotEqual size={38} color={C.text} /> 200</>} note="EITHER DIRECTION" />
      <Card x={560} at={ONE} c={TAIL} title="ONE-TAILED" h1={<>H1: µ &lt; 200</>} note="ONE DIRECTION ONLY" />
      {frame >= TWO ? <ZoneCurve g={GL} p={dL} zones={zL} labels={false} /> : null}
      {frame >= ONE ? <ZoneCurve g={GR} p={dR} zones={zR} oneTail labels={false} /> : null}
      <Pop at={AL - 2} x={540} y={1240} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          ALPHA = <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>5%</span>
        </div>
      </Pop>
      {[
        { x: 305, at: s.cueS(2, "splits"), t: "2.5% + 2.5%" },
        { x: 775, at: s.cueS(2, "One-tailed"), t: "ALL 5% ON THE LEFT" },
      ].map((k, i) => (
        <Pop key={i} at={k.at + 4} x={k.x} y={1135} from="up" dist={10}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: TAIL, whiteSpace: "nowrap" }}>{k.t}</div>
        </Pop>
      ))}
      <Pop at={s.cueS(2, "both.") - 4} x={540} y={1320} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>WE'LL WORK OUT BOTH</div>
      </Pop>
    </AbsoluteFill>
  );
};
