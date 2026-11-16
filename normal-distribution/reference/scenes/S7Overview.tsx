// SCENE 7 — THE COMPLETE PICTURE. Three columns: SYMMETRIC (mean = median, no tail, heights) · RIGHT SKEW (mean > median,
// tail →, salaries) · LEFT SKEW (mean < median, ← tail, easy tests). Mean (cyan) and median (green) lines are computed.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bars, binX, type Geo, histStats, LEFT, RIGHT, SYM } from "../components/Hist";
import { Arrow } from "../components/Icons";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { SHAPE } from "./S3Shapes";

const C = theme.colors;
const MEAN = kindColor.mean;
const MED = kindColor.median;
const COLS = [
  { x: 200, title: "SYMMETRIC", col: SHAPE.sym, counts: SYM, rule: "=", tail: 0, ex: "heights", word: { i: 1, w: "Symmetric:" } },
  { x: 540, title: "RIGHT SKEW", col: SHAPE.right, counts: RIGHT, rule: ">", tail: 1, ex: "salaries", word: { i: 2, w: "Right" } },
  { x: 880, title: "LEFT SKEW", col: SHAPE.left, counts: LEFT, rule: "<", tail: -1, ex: "easy tests", word: { i: 3, w: "Left" } },
];

export const S7Overview: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const HERE = s.sent(0).from;
  const END = s.duration;
  const out = ease(frame, [END - 10, END], [0, 1], theme.ease.in);

  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 - out * 0.06})` }}>
      <Pop at={HERE - 4} x={540} y={300} from="up" dist={16}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.26em", color: C.dim, whiteSpace: "nowrap" }}>THE COMPLETE PICTURE</div>
      </Pop>
      {COLS.map((c) => {
        const at = s.cueS(c.word.i, c.word.w) - 4;
        const p = spr(at, theme.spring.smooth);
        if (p <= 0.001) return null;
        const g: Geo = { x0: c.x - 130, bw: 18, gap: 4, base: 900, maxH: 170, maxC: 13 };
        const st = histStats(c.counts);
        const lines = ease(frame, [at + 10, at + 22], [0, 1]);
        return (
          <div key={c.title} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 50}px)` }}>
            <div style={{ position: "absolute", left: c.x - 160, top: 600, width: 320, height: 600, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(180deg, ${alpha(c.col, 0.16)}, rgba(14,24,64,0.9) 55%)`, border: `2.5px solid ${alpha(c.col, 0.7)}` }} />
            <div style={{ position: "absolute", left: c.x, top: 650, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: c.col, textShadow: glowText(c.col, 0.35), whiteSpace: "nowrap" }}>{c.title}</div>
            <div style={{ position: "absolute", left: c.x - 136, top: 902, width: 272, height: 3, background: alpha(C.text, 0.35) }} />
            <Bars g={g} counts={c.counts} color={alpha("#E4EEFF", 0.75)} tailColor={c.tail ? c.col : undefined} tail={c.tail === 1 ? 6 : undefined} tailLeft={c.tail === -1 ? 5 : undefined} />
            {/* median and mean lines */}
            <div style={{ position: "absolute", left: binX(g, st.median) - 2, top: 900 - 200 * lines, height: 200 * lines, borderLeft: `4px solid ${MED}` }} />
            <div style={{ position: "absolute", left: binX(g, st.mean) - 2, top: 900 - 200 * lines, height: 200 * lines, borderLeft: `4px dashed ${MEAN}`, filter: `drop-shadow(0 0 4px ${MEAN})` }} />
            <div style={{ position: "absolute", left: c.x, top: 975, transform: `translate(-50%, -50%) scale(${interpolate(lines, [0, 1], [0.6, 1])})`, opacity: lines, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, whiteSpace: "nowrap" }}>
              <span style={{ color: MEAN }}>MEAN</span> <span style={{ color: C.text }}>{c.rule}</span> <span style={{ color: MED }}>MEDIAN</span>
            </div>
            <div style={{ position: "absolute", left: c.x, top: 1050, transform: "translate(-50%, -50%)", opacity: lines, display: "flex", alignItems: "center", gap: 8, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: c.tail ? c.col : C.dim, whiteSpace: "nowrap" }}>
              {c.tail === -1 ? <span style={{ display: "inline-block", transform: "rotate(180deg)" }}><Arrow size={26} color={c.col} /></span> : null}
              {c.tail ? "TAIL" : "NO TAIL"}
              {c.tail === 1 ? <Arrow size={26} color={c.col} /> : null}
            </div>
            <div style={{ position: "absolute", left: c.x, top: 1120, transform: "translate(-50%, -50%)", opacity: lines, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: C.dim, whiteSpace: "nowrap" }}>e.g. {c.ex}</div>
          </div>
        );
      })}
      <Pop at={s.sent(1).from + 20} x={540} y={1270} from="up" dist={12}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: C.dim, whiteSpace: "nowrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 30, borderTop: `4px dashed ${MEAN}` }} /> MEAN
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 30, borderTop: `4px solid ${MED}` }} /> MEDIAN
          </span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
