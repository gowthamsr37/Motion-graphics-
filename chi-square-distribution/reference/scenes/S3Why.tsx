// SCENE 3 — WHY FATTER TAILS. Three samples of 5 values from the same population: their guessed spread (±1 SD bracket)
// comes out small, big, medium. Fatter tails (orange beyond ±2) leave room for that extra uncertainty.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FnCurve, type Geo } from "../components/Curve";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { npdf, tpdf } from "../components/TDist";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { NC, SAMPLE, TAIL, TC } from "./S1Hook";

const C = theme.colors;
const SAMPLES = [
  { v: [-0.4, -0.15, 0.05, 0.2, 0.35], lab: "SMALL" },
  { v: [-1.7, -0.5, 0.3, 1.1, 1.9], lab: "BIG" },
  { v: [-0.9, -0.3, 0.2, 0.6, 1.0], lab: "MEDIUM" },
];
const sd = (a: number[]) => {
  const m = a.reduce((x, y) => x + y, 0) / a.length;
  return { m, s: Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / (a.length - 1)) };
};
const RX0 = 190;
const RX1 = 780;
const rx = (v: number) => RX0 + ((v + 2.5) / 5) * (RX1 - RX0);
const G: Geo = { x0: 170, x1: 910, vmin: -4.5, vmax: 4.5, base: 1250, h: 280 };

export const S3Why: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const TAKE = s.sent(1).from;
  const SMALL = s.cueS(1, "small");
  const BIG = s.cueS(1, "big");
  const ROOM = s.sent(2).from;
  const at = [SMALL - 4, BIG - 4, BIG + 18];
  const draw = ease(frame, [ROOM - 4, ROOM + 20], [0, 1], theme.ease.inOut);
  const tails = ease(frame, [ROOM + 16, ROOM + 34], [0, 1]);

  return (
    <AbsoluteFill>
      <SceneTitle label="WHY FATTER TAILS?" color={TAIL} at={2} />
      <Pop at={6} out={TAKE - 4} x={540} y={450} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          FEW VALUES: <span style={{ color: TAIL, textShadow: glowText(TAIL, 0.5) }}>SHAKY SPREAD</span>
        </div>
      </Pop>
      <Pop at={TAKE - 2} x={540} y={450} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          3 SAMPLES OF <span style={{ color: SAMPLE }}>5 VALUES</span>
        </div>
      </Pop>
      {SAMPLES.map((smp, i) => {
        const p = spr(24 + i * 14, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const y = 580 + i * 125;
        const { m, s: d } = sd(smp.v);
        const b = ease(frame, [at[i], at[i] + 14], [0, 1]);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: RX0, top: y, width: (RX1 - RX0) * Math.min(1, p), height: 3, background: alpha(C.text, 0.35) }} />
            {smp.v.map((v, j) => (
              <div key={j} style={{ position: "absolute", left: rx(v) - 11, top: y - 11, width: 22, height: 22, borderRadius: 11, background: SAMPLE, boxShadow: `0 0 10px ${SAMPLE}`, transform: `scale(${spr(24 + i * 14 + j * 2, theme.spring.pop)})` }} />
            ))}
            {b > 0.01 ? <div style={{ position: "absolute", left: rx(m - d * b), top: y + 22, width: rx(m + d * b) - rx(m - d * b), height: 16, boxSizing: "border-box", borderBottom: `5px solid ${TAIL}`, borderLeft: `5px solid ${TAIL}`, borderRight: `5px solid ${TAIL}`, borderRadius: "0 0 6px 6px" }} /> : null}
            {b > 0.5 ? <div style={{ position: "absolute", left: 820, top: y + 12, transform: "translateY(-50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: TAIL, whiteSpace: "nowrap" }}>SPREAD: {smp.lab}</div> : null}
          </React.Fragment>
        );
      })}
      <FnCurve g={G} f={npdf} fmax={0.4} p={draw} color={NC} fill={0} dashed width={4} />
      <FnCurve g={G} f={(x) => tpdf(x, 3)} fmax={0.4} p={draw} color={TC} fill={0.12} bands={[{ a: -4.5, b: -2, color: TAIL, p: tails, opacity: 0.6 }, { a: 2, b: 4.5, color: TAIL, p: tails, opacity: 0.6 }]} />
      <Pop at={ROOM + 24} x={540} y={1300} from="up" dist={10} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
          FAT TAILS = <span style={{ color: TAIL, textShadow: glowText(TAIL, 0.5) }}>ROOM FOR SURPRISES</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
