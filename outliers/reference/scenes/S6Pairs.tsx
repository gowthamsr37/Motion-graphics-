// SCENE 6 — PAIR THEM UP. MEAN + STD DEV both react when an outlier flies out (marker shifts, band widens);
// MEDIAN + IQR both resist (marker and box stay put).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { Pill, TreeHeader } from "../components/Nodes";
import { alpha, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { CVS_HEADER } from "./S3Centre";

const C = theme.colors;
const CY = kindColor.centre;
const V = kindColor.spread;
const BASE = [14, 20, 26, 32, 38, 44, 50]; // mean 32, SD 12; with the outlier at 96: mean 38.6, SD 25.3; median 32, IQR 20–44 unchanged
const X = (v: number) => 110 + v * 8.5;

const stats = (vals: number[]) => {
  const n = vals.length;
  const mean = vals.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const s = [...vals].sort((a, b) => a - b);
  return { mean, sd, median: s[3], q1: s[1], q3: s[5] }; // n = 7: median = 4th, Q1/Q3 = medians of the lower/upper three
};

const DotRow: React.FC<{ y: number; outlier: number; at: number }> = ({ y, outlier, at }) => {
  const spr = useSpr();
  const vals = [...BASE.slice(0, 6), outlier];
  return (
    <>
      <div style={{ position: "absolute", left: X(0) - 16, top: y - 2, width: X(100) - X(0) + 32, height: 4, borderRadius: 2, background: alpha(C.text, 0.3) }} />
      {vals.map((v, i) => {
        const p = spr(at + i * 2, theme.spring.pop);
        if (p <= 0.001) return null;
        const out = i === 6 && outlier > 60;
        return <div key={i} style={{ position: "absolute", left: X(v) - 16, top: y - 16, width: 32, height: 32, borderRadius: 16, background: out ? C.orange : "#E4EEFF", boxShadow: `0 0 12px ${alpha(out ? C.orange : "#E4EEFF", 0.8)}`, transform: `scale(${p})`, zIndex: 3 }} />;
      })}
    </>
  );
};

export const S6Pairs: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const PAIR = s.cueS(0, "pair");
  const MEANW = s.cueS(1, "Mean");
  const REACT = s.cueS(1, "react");
  const MEDW = s.cueS(2, "Median");
  const RESIST = s.cueS(2, "resist");

  const o1 = interpolate(ease(frame, [REACT - 6, REACT + 12], [0, 1], theme.ease.inOut), [0, 1], [50, 96]);
  const o2 = interpolate(ease(frame, [RESIST - 6, RESIST + 12], [0, 1], theme.ease.inOut), [0, 1], [50, 96]);
  const st1 = stats([...BASE.slice(0, 6), o1]);
  const st2 = stats([...BASE.slice(0, 6), o2]);
  const pairP = spr(PAIR - 2, theme.spring.bouncy);
  const row1 = spr(MEANW - 4, theme.spring.smooth);
  const row2 = spr(MEDW - 4, theme.spring.smooth);

  const pairPills = (y: number, a: string, b: string, at: number) => (
    <>
      <Pop at={at} x={330} y={y} from="left" dist={40} cfg={theme.spring.bouncy}>
        <Pill label={a} color={CY} size={36} glow={0.6} />
      </Pop>
      <Pop at={at + 6} x={540} y={y} from="scale" scaleFrom={0.3} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.text }}>+</div>
      </Pop>
      <Pop at={at + 10} x={750} y={y} from="right" dist={40} cfg={theme.spring.bouncy}>
        <Pill label={b} color={V} size={36} glow={0.6} />
      </Pop>
    </>
  );

  return (
    <AbsoluteFill>
      <TreeHeader {...CVS_HEADER} parentIn={-60} kidsIn={-60} activeAt={99999} activeIdx={1} prevIdx={null} />
      <Pop at={4} out={MEANW - 6} x={540} y={760} from="up" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, textAlign: "center", lineHeight: 1.05 }}>
          PRO TIP:
          <div style={{ opacity: Math.min(1, pairP * 2), transform: `scale(${interpolate(pairP, [0, 1], [0.6, 1])})` }}>
            <span style={{ color: CY }}>PAIR</span> THEM <span style={{ color: V }}>UP</span>
          </div>
        </div>
      </Pop>

      {/* pair 1: mean + SD react */}
      {pairPills(640, "MEAN", "STD DEV", MEANW - 2)}
      {row1 > 0.01 ? (
        <AbsoluteFill style={{ opacity: row1 }}>
          <div style={{ position: "absolute", left: X(st1.mean - st1.sd), top: 790 - 30, width: X(st1.mean + st1.sd) - X(st1.mean - st1.sd), height: 60, borderRadius: 16, background: alpha(V, 0.22), border: `3px solid ${alpha(V, 0.9)}` }} />
          <div style={{ position: "absolute", left: X(st1.mean) - 2, top: 790 - 50, height: 100, borderLeft: `5px solid ${CY}`, boxShadow: `0 0 12px ${CY}` }} />
          <DotRow y={790} outlier={o1} at={MEANW} />
        </AbsoluteFill>
      ) : null}
      <Pop at={REACT + 8} x={540} y={872} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ padding: "6px 16px", borderRadius: 999, background: alpha(C.orange, 0.16), border: `2.5px solid ${C.orange}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>BOTH SHIFT WITH OUTLIERS</div>
      </Pop>

      {/* pair 2: median + IQR resist */}
      {pairPills(1000, "MEDIAN", "IQR", MEDW - 2)}
      {row2 > 0.01 ? (
        <AbsoluteFill style={{ opacity: row2 }}>
          <div style={{ position: "absolute", left: X(st2.q1), top: 1150 - 30, width: X(st2.q3) - X(st2.q1), height: 60, borderRadius: 12, background: alpha(V, 0.22), border: `3px solid ${alpha(V, 0.9)}` }} />
          <div style={{ position: "absolute", left: X(st2.median) - 2, top: 1150 - 50, height: 100, borderLeft: `5px solid ${CY}`, boxShadow: `0 0 12px ${CY}` }} />
          <DotRow y={1150} outlier={o2} at={MEDW} />
        </AbsoluteFill>
      ) : null}
      <Pop at={RESIST + 8} x={540} y={1232} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: alpha(C.green, 0.16), border: `2.5px solid ${C.green}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
          <Mark kind="check" at={RESIST + 10} size={30} color={C.green} width={13} />
          BOTH STAY PUT
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
