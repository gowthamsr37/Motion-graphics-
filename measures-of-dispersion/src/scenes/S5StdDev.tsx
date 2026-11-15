// SCENE 5 — STANDARD DEVIATION. The square of area 25 has a side of 5: the square root. Then the ±1 SD bands for both batters:
// A = 5 runs, B = 25 runs — five times the spread.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, exitP, Pop, useSpr } from "../components/Motion";
import { Pill, TreeHeaderN } from "../components/Nodes";
import { A_SCORES, Axis, B_SCORES, BatterChip, FULL, ScoreDot, sx } from "../components/Runs";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { DISP_HEADER } from "./S3Range";

const C = theme.colors;
const V = C.violet;
const G = C.green;
const SQ: [number, number] = [540, 830];
const SIDE = 200; // 5 units of 40 px
const ROW_A = 900;
const ROW_B = 1130;

// A drawn radical sign around a number (the √ glyph isn't in the bundled font subsets).
export const Radical: React.FC<{ children: React.ReactNode; color: string; size: number }> = ({ children, color, size }) => (
  <span style={{ display: "inline-flex", alignItems: "stretch" }}>
    <svg width={size * 0.6} height={size * 1.15} viewBox="0 0 30 58" style={{ display: "block", overflow: "visible" }}>
      <path d="M2 34 L9 30 L16 54 L28 2" stroke={color} strokeWidth={4} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
    <span style={{ borderTop: `${Math.max(3, size * 0.07)}px solid ${color}`, paddingLeft: 4, paddingRight: 2, lineHeight: 1.1 }}>{children}</span>
  </span>
);

const Band: React.FC<{ y: number; lo: number; hi: number; p: number; label: string }> = ({ y, lo, hi, p, label }) => {
  if (p <= 0.001) return null;
  const x0 = sx(FULL, lo);
  const x1 = sx(FULL, hi);
  const mid = sx(FULL, 40);
  const half = ((x1 - x0) / 2) * p;
  return (
    <>
      <div style={{ position: "absolute", left: mid - half, top: y - 34, width: half * 2, height: 68, borderRadius: 18, background: alpha(V, 0.22), border: `3px solid ${alpha(V, 0.9)}`, boxShadow: `0 0 26px ${alpha(V, 0.4)}` }} />
      <div style={{ position: "absolute", left: mid, top: y - 66, transform: "translate(-50%, -50%)", opacity: p, padding: "6px 14px", borderRadius: 14, background: alpha(V, 0.2), border: `2px solid ${V}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>{label}</div>
    </>
  );
};

export const S5StdDev: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const ROOT = s.cueS(0, "root:");
  const FIVE = s.cueS(0, "5.");
  const TYP = s.cueS(1, "typical");
  const A5 = s.cueS(2, "5");
  const B25 = s.cueS(2, "25.");
  const X5 = s.sent(3).from;

  const sqIn = spr(0, theme.spring.smooth);
  const sqOut = exitP(frame, TYP - 8, 10);
  const edge = ease(frame, [ROOT - 2, ROOT + 12], [0, 1], theme.ease.inOut);
  const rowsIn = ease(frame, [TYP - 4, TYP + 10], [0, 1], theme.ease.inOut);
  const bandA = spr(A5 - 2, theme.spring.bouncy);
  const bandB = spr(B25 - 2, theme.spring.bouncy);

  return (
    <AbsoluteFill>
      <TreeHeaderN {...DISP_HEADER} parentIn={-60} kidsIn={-60} activeAt={ROOT} activeIdx={2} prevIdx={1} />

      {/* the variance square and its side */}
      {sqOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - sqOut, transform: `scale(${1 - sqOut * 0.1})` }}>
          <div
            style={{
              position: "absolute",
              left: SQ[0] - SIDE / 2,
              top: SQ[1] - SIDE / 2,
              width: SIDE,
              height: SIDE,
              transform: `scale(${sqIn})`,
              background: `repeating-linear-gradient(0deg, ${alpha(G, 0.45)} 0 1.5px, transparent 1.5px 40px), repeating-linear-gradient(90deg, ${alpha(G, 0.45)} 0 1.5px, transparent 1.5px 40px), ${alpha(G, 0.22)}`,
              border: `3px solid ${G}`,
              boxShadow: `0 0 22px ${alpha(G, 0.5)}`,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.fonts.mono,
              fontWeight: 800,
              fontSize: 56,
              color: C.text,
            }}
          >
            25
          </div>
          <div style={{ position: "absolute", left: SQ[0] + SIDE / 2 + 20, top: SQ[1] - 20, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.dim, opacity: sqIn }}>
            runs<sup style={{ fontSize: 18 }}>2</sup>
          </div>
          {/* the side, traced in violet */}
          <div style={{ position: "absolute", left: SQ[0] - SIDE / 2, top: SQ[1] + SIDE / 2 + 14, width: SIDE * edge, height: 8, borderRadius: 4, background: V, boxShadow: `0 0 16px ${alpha(V, 0.9)}` }} />
          <div style={{ position: "absolute", left: SQ[0] - SIDE / 2 - 22, top: SQ[1] + SIDE / 2 - SIDE * edge, width: 8, height: SIDE * edge, borderRadius: 4, background: alpha(V, 0.6) }} />
          <Pop at={ROOT + 8} x={SQ[0]} y={SQ[1] + SIDE / 2 + 62} from="up" dist={16} cfg={theme.spring.pop}>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 48, color: V, textShadow: glowText(V, 0.6) }}>5</div>
          </Pop>
          <Pop at={ROOT + 4} x={540} y={1180} from="up" dist={20}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 54, color: C.text }}>
              <Radical color={C.text} size={54}>
                25
              </Radical>
              <span>
                = <span style={{ color: V, textShadow: glowText(V, 0.6) }}>5</span>
              </span>
            </div>
          </Pop>
        </AbsoluteFill>
      ) : null}
      <Pop at={FIVE - 2} x={540} y={574} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
        <Pill label="STD DEV = 5" color={V} size={44} glow={1} />
      </Pop>

      {/* typical distance from the average, for both batters */}
      {rowsIn > 0.01 ? (
        <AbsoluteFill style={{ opacity: rowsIn }}>
          <Pop at={TYP - 2} x={230} y={ROW_A - 100} from="left" dist={30}>
            <BatterChip who="A" />
          </Pop>
          <Pop at={TYP + 4} x={230} y={ROW_B - 100} from="left" dist={30}>
            <BatterChip who="B" />
          </Pop>
          <Axis sc={FULL} y={ROW_A} p={rowsIn} step={10} />
          <Axis sc={FULL} y={ROW_B} p={rowsIn} step={10} />
          <div style={{ position: "absolute", left: sx(FULL, 40) - 2, top: ROW_A - 70, height: ROW_B - ROW_A + 110, borderLeft: `4px dashed ${alpha(C.text, 0.7)}` }} />
          <Band y={ROW_A} lo={35} hi={45} p={bandA} label="SD 5" />
          <Band y={ROW_B} lo={15} hi={65} p={bandB} label="SD 25" />
          {A_SCORES.map((v, i) => (
            <ScoreDot key={`a${i}`} x={sx(FULL, v)} y={ROW_A} at={TYP + i * 2} who="A" />
          ))}
          {B_SCORES.map((v, i) => (
            <ScoreDot key={`b${i}`} x={sx(FULL, v)} y={ROW_B} at={TYP + 6 + i * 2} who="B" />
          ))}
          <Pop at={X5 - 2} x={800} y={(ROW_A + ROW_B) / 2 - 4} from="scale" scaleFrom={0.3} cfg={theme.spring.bouncy}>
            <div style={{ padding: "8px 22px", borderRadius: 999, background: V, color: C.ink, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, boxShadow: `0 0 30px ${alpha(V, 0.7)}`, whiteSpace: "nowrap" }}>×5 THE SPREAD</div>
          </Pop>
          <Burst at={X5} x={800} y={(ROW_A + ROW_B) / 2} color={V} count={16} radius={180} seed={8} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
