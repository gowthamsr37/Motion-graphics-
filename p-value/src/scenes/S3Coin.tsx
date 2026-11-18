// SCENE 3 — THE COIN. Heads 9 times out of 10. If the coin were fair: the exact chances of 0–10 heads; 9 or 10 heads
// (at least as extreme, orange) happen about 1% of the time (11/1024 = 1.07%) → p = 0.01.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { type BarGeo, bxk, HeadsBars } from "../components/Coins";
import { Badge, Bracket } from "../components/Curve";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { Coin } from "../components/Prob";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EXT, FLIPS, NULLC, PLess, PV } from "./S1Hook";

const C = theme.colors;
export const BG: BarGeo = { x0: 150, x1: 930, base: 1080, h: 340 };

export const CoinRow: React.FC<{ flips: ("H" | "T")[]; at: number; label: string; color: string; y?: number }> = ({ flips, at, label, color, y = 380 }) => {
  const spr = useSpr();
  return (
    <>
      {flips.map((f, i) => {
        const p = spr(at + i * 2, theme.spring.pop);
        if (p <= 0.001) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 540 + (i - 4.5) * 84, top: y, transform: `translate(-50%, -50%) scale(${Math.min(1.2, p)})` }}>
            <Coin side={f} size={70} />
          </div>
        );
      })}
      <Pop at={at + 10} x={540} y={y + 72} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color, whiteSpace: "nowrap" }}>{label}</div>
      </Pop>
    </>
  );
};

export const S3Coin: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const FAIR = s.sent(1).from;
  const NINE = s.cueS(1, "9");
  const ONE = s.cueS(1, "1%");
  const PVW = s.cueS(2, "p-value");
  const hi: Record<number, string> = frame >= NINE - 4 ? { 9: EXT, 10: EXT } : {};
  return (
    <AbsoluteFill>
      <SceneTitle label="BACK TO THE COIN" color={PV} at={2} />
      <CoinRow flips={FLIPS} at={6} label="9 HEADS IN 10" color={EXT} />
      <Pop at={FAIR - 2} x={540} y={560} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          IF THE COIN WERE <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>FAIR</span>...
        </div>
      </Pop>
      <HeadsBars g={BG} growAt={FAIR + 4} hi={hi} />
      <Bracket x0={bxk(BG, 9) - 28} x1={bxk(BG, 10) + 28} y={900} p={spr(ONE - 8, theme.spring.bouncy)} color={EXT} />
      <Badge x={bxk(BG, 9.5)} y={830} p={spr(ONE - 2, theme.spring.pop)} color={EXT} size={36}>
        1%
      </Badge>
      <Pop at={ONE + 4} x={800} y={760} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: EXT, whiteSpace: "nowrap" }}>AT LEAST AS EXTREME</div>
      </Pop>
      <Pop at={PVW - 4} x={540} y={1270} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ padding: "14px 40px", borderRadius: 999, background: alpha(PV, 0.2), border: `4px solid ${PV}`, boxShadow: `0 0 30px ${alpha(PV, 0.4)}` }}>
          <PLess v="0.01" size={64} op="=" />
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
