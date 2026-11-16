// SCENE 5 — MEET THE IQR. Scattered values drop onto a number line in order; the middle half is boxed (Q1 to Q3);
// the biggest value flies out to an extreme — the range stretches, the IQR box doesn't move.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, Mark, Pop, rng, useSpr } from "../components/Motion";
import { Pill, TreeHeader } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { CVS_HEADER } from "./S3Centre";

const C = theme.colors;
const V = kindColor.spread;
const VALUES = [10, 16, 22, 28, 33, 38, 42, 47, 52, 58, 64, 72]; // Q1 = 25, median = 40, Q3 = 55 (medians of each half)
const Q1 = 25;
const MED = 40;
const Q3 = 55;
const LINE = 1000;
const X = (v: number) => 110 + v * 8.5;
const START = (() => {
  const r = rng(5);
  return VALUES.map(() => ({ x: 160 + r() * 760, y: 710 + r() * 190 }));
})();

export const S5IQR: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const IQRW = s.cueS(0, "interquartile");
  const SORT = s.sent(1).from;
  const HALF = s.cueS(1, "middle");
  const WIDTH = s.cueS(1, "IQR.");
  const EXT = s.sent(2).from;

  const ax = ease(frame, [SORT - 6, SORT + 8], [0, 1], theme.ease.inOut);
  const box = spr(HALF - 2, theme.spring.bouncy);
  const fly = ease(frame, [EXT + 2, EXT + 20], [0, 1], theme.ease.inOut);
  const maxV = interpolate(fly, [0, 1], [72, 97]);
  const rangeP = ease(frame, [EXT - 4, EXT + 6], [0, 1]);

  return (
    <AbsoluteFill>
      <TreeHeader {...CVS_HEADER} parentIn={-60} kidsIn={-60} activeAt={-60} activeIdx={1} prevIdx={1} />
      <Pop at={IQRW - 2} x={540} y={600} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
        <Pill label="INTERQUARTILE RANGE" color={V} size={36} glow={0.7} />
      </Pop>

      {/* number line */}
      <div style={{ position: "absolute", left: X(0) - 20, top: LINE - 2, width: (X(100) - X(0) + 40) * ax, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      {[0, 25, 50, 75, 100].map((v) => (
        <div key={v} style={{ position: "absolute", left: X(v), top: LINE + 66, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: C.dim, opacity: ax }}>{v}</div>
      ))}

      {/* the IQR box: the middle half */}
      {box > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: (X(Q1) + X(Q3)) / 2 - ((X(Q3) - X(Q1)) / 2) * box, top: LINE - 42, width: (X(Q3) - X(Q1)) * box, height: 84, borderRadius: 14, background: alpha(V, 0.22), border: `4px solid ${V}`, boxShadow: `0 0 30px ${alpha(V, 0.5)}` }} />
          <div style={{ position: "absolute", left: X(MED) - 2, top: LINE - 42, height: 84 * box, borderLeft: `4px solid ${alpha(V, 0.9)}` }} />
        </>
      ) : null}
      <Pop at={HALF + 4} x={(X(Q1) + X(Q3)) / 2} y={LINE - 100} from="down" dist={16}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: V, whiteSpace: "nowrap" }}>MIDDLE HALF</div>
      </Pop>
      <Pop at={WIDTH - 2} x={(X(Q1) + X(Q3)) / 2} y={LINE + 126} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: X(Q3) - X(Q1), height: 16, borderLeft: `4px solid ${V}`, borderRight: `4px solid ${V}`, borderBottom: `4px solid ${V}`, borderRadius: "0 0 8px 8px", margin: "0 auto" }} />
          <div style={{ marginTop: 8, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: V, textShadow: glowText(V, 0.6) }}>IQR</div>
        </div>
      </Pop>

      {/* the values: scattered, then sorted onto the line */}
      {VALUES.map((v, i) => {
        const p = spr(4 + i * 2, theme.spring.pop);
        if (p <= 0.001) return null;
        const e = ease(frame, [SORT + i * 1.5, SORT + 16 + i * 1.5], [0, 1], theme.ease.inOut);
        const isMax = i === VALUES.length - 1;
        const tx = isMax ? X(maxV) : X(v);
        const x = interpolate(e, [0, 1], [START[i].x, tx]);
        const y = interpolate(e, [0, 1], [START[i].y, LINE]);
        const inMiddle = i >= 3 && i <= 8;
        const dim = box > 0.5 && !inMiddle ? 0.45 : 1;
        const col = isMax && fly > 0.05 ? C.orange : inMiddle && box > 0.5 ? "#FFFFFF" : "#E4EEFF";
        return <div key={i} style={{ position: "absolute", left: x - 15, top: y - 15, width: 30, height: 30, borderRadius: 15, background: col, boxShadow: `0 0 14px ${alpha(col, 0.8)}`, transform: `scale(${p})`, opacity: dim, zIndex: 3 }} />;
      })}

      {/* range stretches, IQR stays */}
      {rangeP > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: X(10), top: LINE + 200, width: (X(maxV) - X(10)) * rangeP, height: 16, borderLeft: `4px dashed ${C.orange}`, borderRight: `4px dashed ${C.orange}`, borderBottom: `4px dashed ${C.orange}`, borderRadius: "0 0 8px 8px" }} />
          <div style={{ position: "absolute", left: (X(10) + X(maxV)) / 2, top: LINE + 248, transform: "translate(-50%, -50%)", opacity: rangeP, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.orange, whiteSpace: "nowrap" }}>
            RANGE STRETCHES
          </div>
        </>
      ) : null}
      <Pop at={EXT + 22} x={(X(Q1) + X(Q3)) / 2} y={LINE - 160} from="down" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: alpha(C.green, 0.18), border: `2.5px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>
          <Mark kind="check" at={EXT + 24} size={30} color={C.green} width={13} />
          IQR STAYS PUT
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
