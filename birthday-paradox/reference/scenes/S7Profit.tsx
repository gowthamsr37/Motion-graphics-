// SCENE 7 — BACK TO THE CASINO. 10,00,000 bets × Rs 100 = Rs 10 crore bet; × 2.7% edge = Rs 27 lakh expected; a profit
// scale Rs 0 → Rs 50 lakh where the real profit lands in a narrow green band Rs 25–29 lakh (≈ ±2 SD: per-bet SD ≈ Rs 100,
// so the total's SD ≈ Rs 100 × √10,00,000 = Rs 1 lakh); then SHORT TERM: LUCK · LONG TERM: MATHS.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Chip } from "../components/Casino";
import { Panel, Pill, Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const SX = 120, SW = 840; // scale 0..50 lakh
const X = (l: number) => SX + (l / 50) * SW;

export const S7Profit: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s7");
  const BETS = s.cueS(0, "10", 0);
  const CR = s.cueS(0, "crore");
  const EDGE = s.sent(1).from;
  const L27 = s.cueS(1, "27");
  const BAND = s.sent(2).from;
  const B25 = s.cueS(2, "25");
  const ST = s.sent(3).from;
  const LT = s.cueS(3, "Long");
  const band = ease(frame, [B25 - 6, B25 + 14], [0, 1]);
  // jittering "this year's profit" marker inside the band
  const jit = 27 + Math.sin(frame / 5) * 1.2 + Math.sin(frame / 2.3) * 0.5;
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Txt size={40} color={C.dim} font="body" style={{ letterSpacing: "0.12em" }}>THE CASINO&apos;S YEAR</Txt>
      </Pop>
      <Pop x={540} y={420} at={BETS - 4}>
        <Panel w={960} h={200} color={C.cyan} style={{ flexDirection: "row", gap: 26 }}>
          <Chip size={110} label="100" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Txt size={46}>10,00,000 bets × Rs 100</Txt>
            <Txt size={46} color={C.cyan} glow style={{ opacity: ease(frame, [CR - 6, CR + 4], [0, 1]) }}>= Rs 10 crore bet</Txt>
          </div>
        </Panel>
      </Pop>
      <Pop x={540} y={640} at={EDGE - 4}>
        <Panel w={960} h={160} color={C.green} style={{ flexDirection: "row", gap: 20 }}>
          <Txt size={44}>× 2.7% edge</Txt>
          <Txt size={44} style={{ opacity: ease(frame, [L27 - 4, L27 + 4], [0, 1]) }}>
            = <span style={{ color: C.green }}>Rs 27 lakh</span> expected
          </Txt>
        </Panel>
      </Pop>
      {/* the scale */}
      <div style={{ position: "absolute", inset: 0, opacity: ease(frame, [BAND - 8, BAND + 4], [0, 1]) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, color: C.dim }}>its real profit, year after year</div>
        <svg width={1080} height={300} viewBox="0 0 1080 300" style={{ position: "absolute", left: 0, top: 840 }}>
          <rect x={SX} y={90} width={SW} height={16} rx={8} fill={alpha(C.text, 0.18)} />
          <rect x={X(27 - 2 * band)} y={70} width={X(27 + 2 * band) - X(27 - 2 * band)} height={56} rx={14} fill={alpha(C.green, 0.35)} stroke={C.green} strokeWidth={3} />
          <line x1={X(jit)} y1={58} x2={X(jit)} y2={138} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${C.yellow})` }} />
          {[0, 10, 20, 30, 40, 50].map((l) => (
            <text key={l} x={X(l)} y={178} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={700} fontSize={26} fill={C.dim}>{l === 0 ? "Rs 0" : `${l}L`}</text>
          ))}
          <text x={X(27)} y={40} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={36} fill={C.text} opacity={band}>Rs 25L – 29L</text>
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.green, opacity: band }}>almost every time</div>
      </div>
      <Pop x={300} y={1240} at={ST - 2}>
        <Pill color={C.red} size={34}>SHORT TERM: LUCK</Pill>
      </Pop>
      <Pop x={790} y={1240} at={LT - 2}>
        <Pill color={C.green} size={34} solid>LONG TERM: MATHS</Pill>
      </Pop>
    </AbsoluteFill>
  );
};
