// SCENE 5 — USE 3: FACTORIES. A control chart: hourly averages of 5 bottles plotted left to right around the 200 ml centre
// line, with UCL / LCL at ±3 SE (99.7%); the last point jumps outside, flashes red: STOP THE MACHINE.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ease, Pop, rng, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { UseDots, UseHeader, USES } from "../components/Uses";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const U = USES[2];
const r = rng(5);
const PTS = Array.from({ length: 13 }, (_, i) => (i === 12 ? 3.6 : (r() + r() + r() - 1.5) * 1.3));
const X0 = 150, X1 = 930, YC = 840, SCALE = 70; // 1 SE = 70 px

export const S5Factory: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const CH = s.cueS(1, "control");
  const LIM = s.cueS(2, "3");
  const OUT = s.cueS(2, "outside");
  const lines = ease(frame, [LIM - 8, LIM + 10], [0, 1]);
  const flash = frame >= OUT - 4 ? 0.5 + 0.5 * Math.sin((frame - OUT) / 2.5) : 0;
  return (
    <AbsoluteFill>
      <UseDots idx={2} />
      <UseHeader u={U} at={s.sent(0).from} />
      <div style={{ position: "absolute", left: X0, top: YC, width: (X1 - X0) * ease(frame, [CH - 10, CH + 10], [0, 1]), height: 4, background: alpha(C.text, 0.6) }} />
      <div style={{ position: "absolute", left: X1 + 10, top: YC - 14, opacity: ease(frame, [CH, CH + 10], [0, 1]), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.text }}>200</div>
      {[-1, 1].map((d) => (
        <React.Fragment key={d}>
          <div style={{ position: "absolute", left: X0, top: YC - d * 3 * SCALE, width: (X1 - X0) * lines, height: 0, borderTop: `4px dashed ${C.red}` }} />
          <div style={{ position: "absolute", left: X1 + 10, top: YC - d * 3 * SCALE - 14, opacity: lines, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 20, color: C.red }}>{d > 0 ? "+3 SE" : "−3 SE"}</div>
        </React.Fragment>
      ))}
      {PTS.map((v, i) => {
        const at = CH + i * 5 + (i === 12 ? 40 : 0);
        const p = spr(i === 12 ? OUT - 8 : at, theme.spring.pop);
        if (p <= 0.001) return null;
        const x = X0 + 30 + i * ((X1 - X0 - 60) / 12);
        const bad = i === 12;
        return <div key={i} style={{ position: "absolute", left: x - 13, top: YC - v * SCALE - 13, width: 26, height: 26, borderRadius: 13, background: bad ? C.red : U.c, transform: `scale(${Math.min(1.2, p) * (bad ? 1 + flash * 0.4 : 1)})`, boxShadow: bad ? `0 0 ${20 + 20 * flash}px ${C.red}` : `0 0 10px ${alpha(U.c, 0.6)}` }} />;
      })}
      <Pop at={s.cueS(1, "5") - 4} x={540} y={560} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.dim, whiteSpace: "nowrap" }}>EACH DOT = AVERAGE OF 5 BOTTLES, EVERY HOUR</div>
      </Pop>
      <Pop at={s.cueS(2, "99.7%") - 4} x={540} y={1130} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          INSIDE ±3 SE: <span style={{ color: U.c, textShadow: glowText(U.c, 0.5) }}>99.7%</span> OF THE TIME
        </div>
      </Pop>
      <Pop at={s.cueS(2, "stop") - 4} x={540} y={1240} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <Tag color={C.red} size={32}>
          POINT OUTSIDE THE LINES: STOP THE MACHINE
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
