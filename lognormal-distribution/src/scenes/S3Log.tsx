// SCENE 3 — WHAT'S A LOG? A log counts the zeros: 10 → 1, 100 → 2, 1,000 → 3 (zeros lit cyan). Then a log axis
// 1 · 10 · 100 · 1,000 · 10,000 with equal steps, each hop labelled ×10.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Arrow } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { LOG, ZERO } from "./S1Hook";

const C = theme.colors;
const ROWS = [
  { n: "1", z: "0", log: 1, tok: "10" },
  { n: "1", z: "00", log: 2, tok: "100" },
  { n: "1,", z: "000", log: 3, tok: "1,000" },
];
const AX = { x0: 170, x1: 910, y: 1190 };
const TICKS = ["1", "10", "100", "1,000", "10,000"];

export const S3Log: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const COUNT = s.cueS(1, "zeros.");
  const STEP = s.sent(2).from;
  const TIMES = s.cueS(2, "times");
  const axis = ease(frame, [STEP - 4, STEP + 12], [0, 1]);

  return (
    <AbsoluteFill>
      <SceneTitle label="WHAT'S A LOG?" color={ZERO} at={2} />
      <Pop at={COUNT - 4} x={540} y={450} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>
          A LOG <span style={{ color: ZERO, textShadow: glowText(ZERO, 0.5) }}>COUNTS THE ZEROS</span>
        </div>
      </Pop>
      {ROWS.map((r, i) => {
        const at = s.cueS(1, r.tok);
        const p = spr(at - 6, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const y = 600 + i * 130;
        const res = spr(at + 10, theme.spring.pop);
        return (
          <div key={i} style={{ position: "absolute", left: 540, top: y, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.7, 1])})`, opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", gap: 30, padding: "14px 36px", borderRadius: 26, background: "rgba(14,24,64,0.9)", border: `3px solid ${alpha(ZERO, 0.5)}` }}>
            <div style={{ width: 230, textAlign: "right", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 60, color: C.text }}>
              {r.n}
              <span style={{ color: ZERO, textShadow: glowText(ZERO, 0.6) }}>{r.z}</span>
            </div>
            <Arrow size={50} color={C.dim} />
            <div style={{ width: 230, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, opacity: Math.min(1, res * 2) }}>
              log = <span style={{ color: ZERO }}>{r.log}</span>
            </div>
          </div>
        );
      })}
      {/* the log scale: equal steps, each one ×10 */}
      {axis > 0.001 ? (
        <>
          <div style={{ position: "absolute", left: AX.x0, top: AX.y, width: (AX.x1 - AX.x0) * axis, height: 5, borderRadius: 3, background: alpha(C.text, 0.5) }} />
          {TICKS.map((t, i) => {
            const x = AX.x0 + (i / 4) * (AX.x1 - AX.x0);
            const p = spr(STEP + i * 4, theme.spring.pop);
            return (
              <React.Fragment key={t}>
                <div style={{ position: "absolute", left: x - 3, top: AX.y - 14, width: 6, height: 32, background: LOG, borderRadius: 3, opacity: Math.min(1, p * 2) }} />
                <div style={{ position: "absolute", left: x, top: AX.y + 50, transform: `translate(-50%, -50%) scale(${Math.min(1, p)})`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>{t}</div>
              </React.Fragment>
            );
          })}
          {[0, 1, 2, 3].map((i) => {
            const x0 = AX.x0 + (i / 4) * (AX.x1 - AX.x0);
            const x1 = AX.x0 + ((i + 1) / 4) * (AX.x1 - AX.x0);
            const p = spr(TIMES - 4 + i * 5, theme.spring.pop);
            if (p <= 0.01) return null;
            return (
              <React.Fragment key={i}>
                <svg width={x1 - x0} height={60} style={{ position: "absolute", left: x0, top: AX.y - 70, overflow: "visible", opacity: Math.min(1, p * 2) }}>
                  <path d={`M8 56 Q ${(x1 - x0) / 2} ${-10} ${x1 - x0 - 8} 56`} fill="none" stroke={LOG} strokeWidth={4} strokeDasharray={`${(x1 - x0) * 1.3 * Math.min(1, p)} 999`} />
                </svg>
                <div style={{ position: "absolute", left: (x0 + x1) / 2, top: AX.y - 96, transform: `translate(-50%, -50%) scale(${Math.min(1, p)})`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: LOG, textShadow: glowText(LOG, 0.4) }}>×10</div>
              </React.Fragment>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: AX.y + 96, textAlign: "center", opacity: axis, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.18em", color: LOG }}>A LOG SCALE: EVERY STEP IS ×10</div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
