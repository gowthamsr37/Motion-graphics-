// SCENE 4 — VARIANCE. Batter A's distances from the average (-7, -1, +1, +7) become real squares (49, 1, 1, 49);
// the squares are averaged into one square of area 25 (the variance, in squared runs).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, exitP, Pop, useSpr } from "../components/Motion";
import { Arrow } from "../components/Icons";
import { Pill, TreeHeaderN } from "../components/Nodes";
import { A_SCORES, Axis, BatterChip, ScoreDot, sx, type Scale } from "../components/Runs";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { DISP_HEADER } from "./S3Range";

const C = theme.colors;
const G = C.green;
const ZSC: Scale = { lo: 30, hi: 50, x0: 140, x1: 940 };
const ROW = 700;
const DEVS = A_SCORES.map((v) => v - 40); // -7, -1, 1, 7
const ARROW_Y = [790, 840, 890, 940];
const U = 26; // px per run for the squares
const SQ_TOP = 1000;
const MERGE: [number, number] = [540, 1100];

const gridBg = (cell: number, col: string) =>
  `repeating-linear-gradient(0deg, ${alpha(col, 0.45)} 0 1.5px, transparent 1.5px ${cell}px), repeating-linear-gradient(90deg, ${alpha(col, 0.45)} 0 1.5px, transparent 1.5px ${cell}px)`;

export const S4Variance: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const V0 = s.cueS(0, "Variance");
  const devAt = [s.cueS(2, "7", 0), s.cueS(2, "1", 0), s.cueS(2, "1", 1), s.cueS(2, "7", 1)];
  const SQ = s.sent(3).from;
  const sqAt = [s.cueS(4, "49", 0), s.cueS(4, "1", 0), s.cueS(4, "1", 1), s.cueS(4, "49", 1)];
  const AVGS = s.sent(5).from;
  const C100 = s.cueS(5, "100");
  const C25 = s.cueS(5, "25.");
  const SQR = s.cueS(6, "squared");

  const ax = ease(frame, [0, 14], [0, 1], theme.ease.inOut);
  const arrowsOut = exitP(frame, AVGS - 8, 10);
  const gather = ease(frame, [AVGS + 2, AVGS + 20], [0, 1], theme.ease.inOut);
  const morph = ease(frame, [C25 - 8, C25 + 6], [0, 1], theme.ease.inOut);
  const mean = ease(frame, [4, 16], [0, 1], theme.ease.inOut);

  return (
    <AbsoluteFill>
      <TreeHeaderN {...DISP_HEADER} parentIn={-60} kidsIn={-60} activeAt={V0} activeIdx={1} prevIdx={0} />

      <Pop at={2} out={C25 - 8} x={830} y={ROW - 95} from="right" dist={30}>
        <BatterChip who="A" />
      </Pop>
      <Pop at={6} out={AVGS - 6} x={sx(ZSC, 40)} y={604} from="down" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ padding: "6px 16px", borderRadius: 14, background: "rgba(8,14,44,0.9)", border: `2px solid ${alpha(C.text, 0.6)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text }}>AVG 40</div>
      </Pop>
      <Axis sc={ZSC} y={ROW} p={ax} step={1} labelEvery={5} />
      {mean > 0.01 ? <div style={{ position: "absolute", left: sx(ZSC, 40) - 2, top: 640, height: 330 * mean * (1 - arrowsOut * 0.6), borderLeft: `4px dashed ${alpha(C.text, 0.75)}` }} /> : null}
      {A_SCORES.map((v, i) => (
        <ScoreDot key={i} x={sx(ZSC, v)} y={ROW} at={2 + i * 3} who="A" label={String(v)} />
      ))}

      {/* distances from the average */}
      {arrowsOut < 1
        ? DEVS.map((d, i) => {
            const p = ease(frame, [devAt[i] - 4, devAt[i] + 8], [0, 1], theme.ease.out);
            if (p <= 0) return null;
            const x0 = sx(ZSC, 40);
            const x1 = sx(ZSC, 40 + d);
            const left = Math.min(x0, x0 + (x1 - x0) * p);
            const w = Math.abs(x1 - x0) * p;
            return (
              <div key={i} style={{ opacity: 1 - arrowsOut }}>
                <div style={{ position: "absolute", left: x1 - 1.5, top: ROW + 22, height: (ARROW_Y[i] - ROW - 22) * p, borderLeft: `3px dotted ${alpha(C.text, 0.5)}` }} />
                <div style={{ position: "absolute", left, top: ARROW_Y[i] - 3, width: w, height: 6, borderRadius: 3, background: C.text }} />
                <div style={{ position: "absolute", left: x0 + (x1 - x0) * p, top: ARROW_Y[i], transform: `translate(${d < 0 ? -34 : -6}px, -50%) scaleX(${d < 0 ? -1 : 1})` }}>
                  <Arrow size={40} color={C.text} />
                </div>
                <div style={{ position: "absolute", left: x1 + (d < 0 ? -78 : 46), top: ARROW_Y[i], transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: C.text, opacity: p }}>
                  {d > 0 ? `+${d}` : d}
                </div>
              </div>
            );
          })
        : null}

      {/* squares: each distance squared, drawn as a real square */}
      {DEVS.map((d, i) => {
        const p = spr(SQ + 6 + i * 3, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const side = Math.abs(d) * U;
        const cx0 = sx(ZSC, 40 + d);
        const cy0 = SQ_TOP + side / 2;
        const cx = interpolate(gather, [0, 1], [cx0, MERGE[0]]);
        const cy = interpolate(gather, [0, 1], [cy0, MERGE[1]]);
        const sideNow = interpolate(morph, [0, 1], [side, 5 * U]);
        const o = morph > 0 ? (i === 0 ? 1 : 1 - morph) : 1;
        const lab = spr(sqAt[i], theme.spring.pop);
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: cx - sideNow / 2,
                top: cy - sideNow / 2,
                width: sideNow,
                height: sideNow,
                transform: `scale(${p})`,
                opacity: o,
                background: `${gridBg(U, G)}, ${alpha(G, 0.22)}`,
                border: `3px solid ${G}`,
                boxShadow: `0 0 18px ${alpha(G, 0.5)}`,
                borderRadius: 4,
                zIndex: 2,
              }}
            />
            {lab > 0.01 && gather < 0.5 ? (
              <div style={{ position: "absolute", left: cx0, top: Math.abs(d) > 1 ? cy0 : SQ_TOP + 48, transform: `translate(-50%, -50%) scale(${lab})`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: Math.abs(d) > 1 ? 50 : 34, color: C.text, textShadow: "0 2px 8px rgba(0,0,0,0.6)", opacity: 1 - gather * 2, zIndex: 3 }}>
                {d * d}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      {morph > 0.5 ? (
        <div style={{ position: "absolute", left: MERGE[0], top: MERGE[1], transform: `translate(-50%, -50%) scale(${spr(C25, theme.spring.pop)})`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 46, color: C.text, zIndex: 3, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>25</div>
      ) : null}
      <Burst at={C25} x={MERGE[0]} y={MERGE[1]} color={G} count={16} radius={160} seed={4} />

      {/* the working */}
      <Pop at={AVGS + 2} out={C100 + 4} x={540} y={860} from="up" dist={20}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 50, color: C.text, whiteSpace: "nowrap" }}>
          49 + 1 + 1 + 49 = <span style={{ color: G }}>100</span>
        </div>
      </Pop>
      <Pop at={C100 + 6} x={540} y={860} from="up" dist={20}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 54, color: C.text, whiteSpace: "nowrap" }}>
          100 <span style={{ color: C.dim }}>÷</span> 4 <span style={{ color: G, textShadow: glowText(G, 0.6) }}>= 25</span>
        </div>
      </Pop>
      <Pop at={C25} x={540} y={574} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
        <Pill label="VARIANCE = 25" color={G} size={44} glow={1} />
      </Pop>
      <Pop at={SQR - 2} x={760} y={MERGE[1]} from="left" dist={24} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text }}>
          runs<sup style={{ fontSize: 24, marginLeft: -6 }}>2</sup>
          <div style={{ width: 46, height: 46, borderRadius: 23, background: C.yellow, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, transform: `rotate(${Math.sin(frame / 5) * 8}deg)` }}>?</div>
        </div>
      </Pop>
      <Pop at={C25 + 14} x={540} y={1272} from="up" dist={16}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 27, letterSpacing: "0.02em", color: C.dim, whiteSpace: "nowrap" }}>
          Whole group: divide by n · Sample: divide by n - 1
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
