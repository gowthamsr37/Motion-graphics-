// SCENE 5 — DISCRETE: TWO DICE. Two dice land 3 + 4 = 7. The 6 × 6 grid of all 36 combinations (each cell shows its
// total); the six 7s light up. Then every cell drops into a bar for its total → the triangle: 7 is most likely
// (6/36), 2 and 12 are the rarest (1/36 each).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, exitP, Pop, useSpr } from "../components/Motion";
import { Die } from "../components/Prob";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { DISC, PROB } from "./S1Hook";

const C = theme.colors;
const O = C.orange;
const CELL = 64;
const GAP = 6;
const GX = 540 - (6 * CELL + 5 * GAP) / 2;
const GY = 560;
const BASE = 1300;
const BW = 72;
const BH = 44;
const colX = (sum: number) => 540 + (sum - 7) * 80;
// all 36 combinations, with their slot in their total's column
const CELLS = (() => {
  const out: { a: number; b: number; sum: number; k: number }[] = [];
  const seen: Record<number, number> = {};
  for (let a = 1; a <= 6; a++)
    for (let b = 1; b <= 6; b++) {
      const sum = a + b;
      seen[sum] = (seen[sum] ?? 0) + 1;
      out.push({ a, b, sum, k: seen[sum] - 1 });
    }
  return out;
})();

export const S5TwoDice: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const ROLL = s.sent(0).from;
  const COMB = s.sent(1).from;
  const W36 = s.cueS(1, "36");
  const W7 = s.cueS(1, "7.");
  const MOST = s.sent(2).from;
  const LIKELY = s.cueS(2, "likely");
  const RARE = s.sent(3).from;
  const land = ROLL + 40;
  const rolling = frame < land;
  const d1 = rolling ? 1 + (Math.floor(frame / 3) * 5) % 6 : 3;
  const d2 = rolling ? 1 + (Math.floor(frame / 3 + 2) * 7) % 6 : 4;
  const diceOut = exitP(frame, COMB - 4, 10);
  const fly = (c: { sum: number; k: number }) => ease(frame, [MOST - 16 + (c.sum - 2) * 2 + c.k, MOST + 4 + (c.sum - 2) * 2 + c.k], [0, 1], theme.ease.inOut);
  const hi7 = ease(frame, [W7 - 4, W7 + 6], [0, 1]);
  const hiMost = ease(frame, [LIKELY - 4, LIKELY + 6], [0, 1]);
  const hiRare = ease(frame, [RARE - 4, RARE + 8], [0, 1]);
  const headerOut = ease(frame, [MOST - 18, MOST - 8], [0, 1]);

  return (
    <AbsoluteFill>
      <SceneTitle label="DISCRETE · TWO DICE" color={DISC} at={2} />
      {/* roll two dice */}
      {diceOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - diceOut }}>
          {[d1, d2].map((v, i) => (
            <div key={i} style={{ position: "absolute", left: 420 + i * 240, top: 640 - (rolling ? Math.abs(Math.sin((frame + i * 7) / 5)) * 80 : 0), transform: `translate(-50%, -50%) rotate(${rolling ? frame * (14 + i * 4) : 0}deg) scale(${spr(ROLL - 4 + i * 3, theme.spring.bouncy)})` }}>
              <Die value={v} size={170} color={DISC} glow={0.6} />
            </div>
          ))}
          <Pop at={land} x={540} y={860} from="up" dist={16} cfg={theme.spring.pop}>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 80, color: C.text, whiteSpace: "nowrap" }}>
              3 + 4 = <span style={{ color: PROB, textShadow: glowText(PROB, 0.6) }}>7</span>
            </div>
          </Pop>
        </AbsoluteFill>
      ) : null}

      {/* the grid of 36, then the bars */}
      {frame >= COMB - 6 ? (
        <>
          <Pop at={W36 - 4} out={MOST - 10} x={540} y={430} from="up" dist={14} cfg={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text, whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: theme.fonts.mono, color: DISC }}>36</span> COMBINATIONS
            </div>
          </Pop>
          {[1, 2, 3, 4, 5, 6].map((v, i) => (
            <React.Fragment key={v}>
              <div style={{ position: "absolute", left: GX + i * (CELL + GAP) + CELL / 2, top: GY - 44, transform: `translate(-50%, -50%) scale(${spr(COMB + i * 2, theme.spring.pop)})`, opacity: 1 - headerOut }}>
                <Die value={v} size={44} color={DISC} />
              </div>
              <div style={{ position: "absolute", left: GX - 44, top: GY + i * (CELL + GAP) + CELL / 2, transform: `translate(-50%, -50%) scale(${spr(COMB + i * 2, theme.spring.pop)})`, opacity: 1 - headerOut }}>
                <Die value={v} size={44} color={DISC} />
              </div>
            </React.Fragment>
          ))}
          {CELLS.map((c, i) => {
            const p = spr(COMB + 4 + (c.a + c.b) * 2, theme.spring.pop);
            if (p <= 0.001) return null;
            const f = fly(c);
            const gx = GX + (c.b - 1) * (CELL + GAP);
            const gy = GY + (c.a - 1) * (CELL + GAP);
            const bx = colX(c.sum) - BW / 2;
            const by = BASE - (c.k + 1) * (BH + 4);
            const is7 = c.sum === 7;
            const rare = c.sum === 2 || c.sum === 12;
            const col = rare && hiRare > 0.5 ? O : is7 ? (f < 0.5 ? (hi7 > 0.5 ? PROB : DISC) : hiMost > 0.5 ? PROB : DISC) : DISC;
            const glow = (is7 && (f < 0.5 ? hi7 : hiMost)) || (rare ? hiRare : 0);
            return (
              <div key={i} style={{ position: "absolute", left: interpolate(f, [0, 1], [gx, bx]), top: interpolate(f, [0, 1], [gy, by]), width: interpolate(f, [0, 1], [CELL, BW]), height: interpolate(f, [0, 1], [CELL, BH]), boxSizing: "border-box", borderRadius: interpolate(f, [0, 1], [14, 8]), background: alpha(col, 0.22 + glow * 0.35), border: `2px solid ${alpha(col, 0.6 + glow * 0.4)}`, boxShadow: glow > 0.3 ? `0 0 16px ${alpha(col, 0.6)}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: interpolate(f, [0, 1], [28, 0.1]), color: C.text, transform: `scale(${interpolate(p, [0, 1], [0.4, 1])})`, opacity: Math.min(1, p * 2), overflow: "hidden" }}>
                {f < 0.6 ? c.sum : ""}
              </div>
            );
          })}
          <Pop at={W7 + 4} out={MOST - 12} x={540} y={1060} from="up" dist={14} cfg={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
              <span style={{ color: PROB, textShadow: glowText(PROB, 0.5) }}>6</span> of them make <span style={{ color: PROB }}>7</span>
            </div>
          </Pop>
          {/* the bars' axis and totals */}
          <div style={{ position: "absolute", left: 100, top: BASE + 2, width: 880 * ease(frame, [MOST - 18, MOST - 4], [0, 1]), height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
          {Array.from({ length: 11 }, (_, i) => i + 2).map((sum) => (
            <div key={sum} style={{ position: "absolute", left: colX(sum), top: BASE + 32, transform: "translate(-50%, -50%)", opacity: ease(frame, [MOST - 10, MOST + 2], [0, 1]), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: sum === 7 || ((sum === 2 || sum === 12) && hiRare > 0.5) ? 30 : 24, color: sum === 7 && hiMost > 0.5 ? PROB : (sum === 2 || sum === 12) && hiRare > 0.5 ? O : C.dim }}>{sum}</div>
          ))}
          <Pop at={LIKELY - 2} x={colX(7)} y={BASE - 6 * (BH + 4) - 40} from="down" dist={12} cfg={theme.spring.pop}>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: PROB, textShadow: glowText(PROB, 0.5), whiteSpace: "nowrap" }}>6/36</div>
          </Pop>
          {[2, 12].map((sum) => (
            <Pop key={sum} at={RARE + (sum === 12 ? 6 : 0)} x={colX(sum)} y={BASE - (BH + 4) - 40} from="down" dist={12} cfg={theme.spring.pop}>
              <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, color: O, whiteSpace: "nowrap" }}>1/36</div>
            </Pop>
          ))}
          <Pop at={MOST + 8} x={540} y={600} from="up" dist={16} cfg={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
              <span style={{ color: PROB, textShadow: glowText(PROB, 0.6) }}>7</span> IS THE MOST LIKELY
            </div>
          </Pop>
          <Pop at={RARE - 2} x={540} y={690} from="up" dist={14} cfg={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
              <span style={{ color: O }}>2</span> and <span style={{ color: O }}>12</span> are the rarest
            </div>
          </Pop>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
