// SCENE 7 — HOW BIG IS BIG ENOUGH? The distribution of the mean of n waiting times morphs as n climbs from 1 to 30:
// from a skewed decay to a bell. Rule of thumb: 30. Very skewed data may need more.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AreaChart, meanOfExpPdf } from "../components/Clt";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { MEANS, SKEW } from "./S1Hook";

const C = theme.colors;
const X0 = 140;
const X1 = 940;
const MAXT = 15;
const XS = Array.from({ length: 151 }, (_, i) => i / 150);

export const S7Enough: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s7");
  const THIRTY = s.cueS(0, "30.");
  const SKEWED = s.sent(1).from;
  const n = Math.max(1, Math.round(ease(frame, [s.sent(0).from, THIRTY], [1, 30], theme.ease.inOut)));
  const vals = XS.map((u) => meanOfExpPdf(n, 5, Math.max(0.02, u * MAXT)));
  const col = n >= 30 ? MEANS : SKEW;
  const BASE = 1130;

  return (
    <AbsoluteFill>
      <SceneTitle label="HOW BIG IS BIG ENOUGH?" color={MEANS} at={2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 96, color: C.text, opacity: ease(frame, [4, 14], [0, 1]) }}>
        n = <span style={{ color: col, textShadow: glowText(col, 0.6) }}>{n}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 580, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: C.dim, opacity: ease(frame, [6, 16], [0, 1]) }}>AVERAGES OF n WAITING TIMES</div>
      <AreaChart x0={X0} x1={X1} base={BASE} h={400} xs={XS} vals={vals} color={col} p={ease(frame, [4, 18], [0, 1])} />
      <div style={{ position: "absolute", left: X0 - 10, top: BASE + 1, width: X1 - X0 + 20, height: 3, background: alpha(C.text, 0.4) }} />
      {[0, 5, 10, 15].map((t) => (
        <div key={t} style={{ position: "absolute", left: X0 + (t / MAXT) * (X1 - X0), top: BASE + 26, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.dim }}>{t}</div>
      ))}
      <Pop at={THIRTY - 2} x={540} y={1240} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <Pill label="RULE OF THUMB: 30" color={MEANS} size={38} glow={0.8} />
      </Pop>
      <Pop at={SKEWED - 2} x={540} y={1330} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
          VERY <span style={{ color: SKEW }}>SKEWED</span>? NEED MORE
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
