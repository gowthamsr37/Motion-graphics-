// SCENE 6 — OPTION 3: ROBUST TOOLS. Leave the data alone. Top row (use): MEDIAN + IQR. Bottom row (instead of): MEAN ± SD.
// The outlier moves out (50 → 96): the median and IQR box stay put, the mean slides and the SD band balloons.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { TREATS, TreatPill } from "../components/Kit";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { Pill, TreeHeader } from "../components/Nodes";
import { alpha, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { OUT_HEADER } from "./S2Why";

const C = theme.colors;
const O = kindColor.outlier;
const RV = kindColor.rare;
const GR = kindColor.median;
const V = kindColor.spread;
const BASE = [14, 20, 26, 32, 38, 44, 50]; // mean 32, SD 12, median 32, Q1 20, Q3 44; with 96: mean 38.6, SD 25.3, median/quartiles unchanged
const X = (v: number) => 110 + v * 8.5;
const stats = (vals: number[]) => {
  const n = vals.length;
  const mean = vals.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const s = [...vals].sort((a, b) => a - b);
  return { mean, sd, median: s[3], q1: s[1], q3: s[5] };
};

const Dots: React.FC<{ y: number; out: number; at: number }> = ({ y, out, at }) => {
  const spr = useSpr();
  const vals = [...BASE.slice(0, 6), out];
  return (
    <>
      <div style={{ position: "absolute", left: X(0) - 16, top: y - 2, width: X(100) - X(0) + 32, height: 4, borderRadius: 2, background: alpha(C.text, 0.3) }} />
      {vals.map((v, i) => {
        const p = spr(at + i * 2, theme.spring.pop);
        if (p <= 0.001) return null;
        const isOut = i === 6 && out > 60;
        const col = isOut ? O : "#E4EEFF";
        return <div key={i} style={{ position: "absolute", left: X(v) - 16, top: y - 16, width: 32, height: 32, borderRadius: 16, background: col, boxShadow: `0 0 12px ${alpha(col, 0.8)}`, transform: `scale(${p})`, zIndex: 3 }} />;
      })}
    </>
  );
};

export const S6Robust: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const ROB = s.sent(0).from;
  const BAR = s.cueS(0, "barely");
  const MEDW = s.cueS(1, "median");
  const MEANW = s.cueS(1, "mean");
  const STAYS = s.cueS(2, "stays.");
  const DRAG = s.cueS(2, "drag");

  const o = interpolate(ease(frame, [STAYS - 6, STAYS + 14], [0, 1], theme.ease.inOut), [0, 1], [50, 96]);
  const st = stats([...BASE.slice(0, 6), o]);
  const rowA = spr(MEDW - 4, theme.spring.smooth);
  const rowB = spr(MEANW - 4, theme.spring.smooth);
  const YA = 860;
  const YB = 1150;

  return (
    <AbsoluteFill>
      <TreeHeader {...OUT_HEADER} parentIn={-60} kidsIn={-60} activeAt={-60} activeIdx={1} prevIdx={1} />
      <TreatPill t={TREATS[5]} color={RV} at={ROB - 2} />
      <Pop at={6} out={BAR - 6} x={540} y={760} from="up" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, lineHeight: 1.1, color: C.text, whiteSpace: "nowrap" }}>
          LEAVE THE DATA
          <br />
          <span style={{ color: RV }}>ALONE</span>
        </div>
      </Pop>
      <Pop at={BAR - 4} out={MEDW - 6} x={540} y={760} from="up" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 58, lineHeight: 1.1, color: C.text, whiteSpace: "nowrap" }}>
          TOOLS THAT BARELY
          <br />
          REACT TO <span style={{ color: O }}>EXTREMES</span>
        </div>
      </Pop>

      {/* use: median + IQR */}
      {rowA > 0.01 ? (
        <AbsoluteFill style={{ opacity: rowA }}>
          <div style={{ position: "absolute", left: 120, top: YA - 120, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.2em", color: GR }}>USE</span>
            <Pill label="MEDIAN + IQR" color={GR} size={30} glow={0.6} />
          </div>
          <div style={{ position: "absolute", left: X(st.q1), top: YA - 30, width: X(st.q3) - X(st.q1), height: 60, boxSizing: "border-box", borderRadius: 12, background: alpha(V, 0.22), border: `3px solid ${V}` }} />
          <div style={{ position: "absolute", left: X(st.median) - 2, top: YA - 48, height: 96, borderLeft: `5px solid ${GR}`, filter: `drop-shadow(0 0 8px ${GR})` }} />
          <Dots y={YA} out={o} at={MEDW} />
        </AbsoluteFill>
      ) : null}
      <Pop at={STAYS + 10} x={830} y={YA - 102} from="right" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: alpha(GR, 0.16), border: `2.5px solid ${GR}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.text }}>
          <Mark kind="check" at={STAYS + 12} size={28} color={GR} width={13} />
          STEADY
        </div>
      </Pop>

      {/* instead of: mean ± SD */}
      {rowB > 0.01 ? (
        <AbsoluteFill style={{ opacity: rowB }}>
          <div style={{ position: "absolute", left: 120, top: YB - 120, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.2em", color: C.dim }}>INSTEAD OF</span>
            <Pill label="MEAN ± SD" color={C.cyan} size={30} />
          </div>
          <div style={{ position: "absolute", left: X(st.mean - st.sd), top: YB - 30, width: X(st.mean + st.sd) - X(st.mean - st.sd), height: 60, boxSizing: "border-box", borderRadius: 16, background: alpha(C.cyan, 0.16), border: `3px solid ${alpha(C.cyan, 0.8)}` }} />
          <div style={{ position: "absolute", left: X(st.mean) - 2, top: YB - 48, height: 96, borderLeft: `5px solid ${C.cyan}`, filter: `drop-shadow(0 0 8px ${C.cyan})` }} />
          <Dots y={YB} out={o} at={MEANW} />
        </AbsoluteFill>
      ) : null}
      <Pop at={DRAG - 4} x={830} y={YB - 102} from="right" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: alpha(O, 0.16), border: `2.5px solid ${O}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.text }}>
          <Mark kind="cross" at={DRAG - 2} size={26} color={C.red} width={13} />
          DRAGGED
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
