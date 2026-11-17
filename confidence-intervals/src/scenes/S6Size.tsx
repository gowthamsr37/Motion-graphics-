// SCENE 6 — SAMPLE SIZE. n = 100: 30 to 34 (±2). Four times the data, n = 400: 31 to 33 (±1, half the margin).
// Only n = 25: use the t-distribution → about 28 to 36 (±4.1).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Axis, Interval, type Line } from "../components/CI";
import { SceneTitle } from "../components/Kit";
import { ease, Pop } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { MISS, RANGE, TRUE } from "./S1Hook";

const C = theme.colors;
const G: Line = { x0: 250, x1: 910, vmin: 26, vmax: 38 };
const ROWS = [
  { n: "n = 100", lo: 30, hi: 34, lab: "± 2", y: 680, c: RANGE },
  { n: "n = 400", lo: 31, hi: 33, lab: "± 1", y: 850, c: TRUE },
  { n: "n = 25", lo: 27.9, hi: 36.1, lab: "± 4.1 (t)", y: 1020, c: MISS },
];

export const S6Size: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const N400 = s.cueS(1, "400,");
  const HALF = s.cueS(1, "half:");
  const N25 = s.cueS(2, "25");
  const at = [6, N400 - 4, N25 - 4];
  return (
    <AbsoluteFill>
      <SceneTitle label="SAMPLE SIZE" color={TRUE} at={2} />
      <Pop at={6} out={N25 - 6} x={540} y={460} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          MORE DATA, <span style={{ color: TRUE, textShadow: glowText(TRUE, 0.5) }}>NARROWER RANGE</span>
        </div>
      </Pop>
      <Pop at={N25 - 2} x={540} y={460} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          SMALL SAMPLE: <span style={{ color: MISS, textShadow: glowText(MISS, 0.5) }}>USE t, WIDER</span>
        </div>
      </Pop>
      {ROWS.map((r, i) => {
        const p = ease(frame, [at[i], at[i] + 16], [0, 1], theme.ease.out);
        if (p <= 0.001) return null;
        return (
          <React.Fragment key={r.n}>
            <div style={{ position: "absolute", left: 100, top: r.y, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: r.c }}>{r.n}</div>
            <Interval g={G} y={r.y} m={32} lo={r.lo} hi={r.hi} p={p} color={r.c} thick={10} />
            <div style={{ position: "absolute", left: (G.x0 + G.x1) / 2 + 40, top: r.y - 52, transform: "translate(-50%, -50%)", opacity: ease(p, [0.6, 1], [0, 1]), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>{r.lab}</div>
          </React.Fragment>
        );
      })}
      <Axis g={G} y={1150} ticks={[26, 28, 30, 32, 34, 36, 38]} p={ease(frame, [4, 16], [0, 1])} />
      <Pop at={HALF - 4} x={540} y={765} from="up" dist={10}>
        <div style={{ padding: "4px 16px", borderRadius: 12, background: alpha(TRUE, 0.2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: C.text, whiteSpace: "nowrap" }}>4× THE DATA = HALF THE MARGIN</div>
      </Pop>
    </AbsoluteFill>
  );
};
