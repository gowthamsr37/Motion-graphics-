// SCENE 4 — SMALL vs BIG. 6 heads out of 10: 6 or more heads (orange) happen 38% of the time (386/1024 = 37.7%)
// → p = 0.38. Then side by side: p = 0.01 HARD TO EXPLAIN BY LUCK vs p = 0.38 EASILY LUCK.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { B10, bxk, HeadsBars } from "../components/Coins";
import { Badge, Bracket } from "../components/Curve";
import { BarsIcon } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { exitP, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { BG, CoinRow } from "./S3Coin";
import { EXT, NULLC, PLess, PV, SIXROW } from "./S1Hook";

const C = theme.colors;

const Verdict: React.FC<{ x: number; at: number; v: string; hi: number[]; color: string; head: string; l1: string; l2: string }> = ({ x, at, v, hi, color, head, l1, l2 }) => {
  const spr = useSpr();
  const p = spr(at - 4, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: 860, width: 420, height: 520, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.7, 1])})`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(180deg, ${alpha(color, 0.2)}, rgba(14,24,64,0.92) 70%)`, border: `3px solid ${color}`, boxShadow: `0 0 30px ${alpha(color, 0.3)}`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40, gap: 26 }}>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color }}>{head}</div>
      <PLess v={v} size={60} op="=" color={color} />
      <BarsIcon color={alpha(C.text, 0.55)} vals={B10} w={300} h={110} hi={hi} hiColor={EXT} />
      <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, lineHeight: 1.15, color: C.text }}>
        {l1}
        <br />
        <span style={{ color, textShadow: glowText(color, 0.5) }}>{l2}</span>
      </div>
    </div>
  );
};

export const S4Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const SIXW = s.cueS(1, "6");
  const P38 = s.cueS(1, "38%");
  const PVW = s.cueS(1, "p-value");
  const CMP = s.sent(2).from;
  const SMALL = s.cueS(2, "Small");
  const BIG = s.cueS(2, "Big");
  const out = exitP(frame, CMP - 8, 10);
  const hi: Record<number, string> = frame >= SIXW - 4 ? { 6: EXT, 7: EXT, 8: EXT, 9: EXT, 10: EXT } : {};
  return (
    <AbsoluteFill>
      <SceneTitle label="SMALL p vs BIG p" color={PV} at={2} />
      {out < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - out }}>
          <CoinRow flips={SIXROW} at={4} label="NOW: 6 HEADS IN 10" color={NULLC} />
          <HeadsBars g={BG} growAt={12} hi={hi} />
          <Bracket x0={bxk(BG, 6) - 28} x1={bxk(BG, 10) + 28} y={760} p={spr(P38 - 8, theme.spring.bouncy)} color={EXT} />
          <Badge x={bxk(BG, 8)} y={690} p={spr(P38 - 2, theme.spring.pop)} color={EXT} size={36}>
            38%
          </Badge>
          <Pop at={SIXW + 4} x={bxk(BG, 8)} y={628} from="up" dist={10}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: EXT, whiteSpace: "nowrap" }}>6 OR MORE HEADS</div>
          </Pop>
          <Pop at={PVW - 4} x={540} y={1270} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
            <div style={{ padding: "14px 40px", borderRadius: 999, background: alpha(PV, 0.2), border: `4px solid ${PV}`, boxShadow: `0 0 30px ${alpha(PV, 0.4)}` }}>
              <PLess v="0.38" size={64} op="=" />
            </div>
          </Pop>
        </AbsoluteFill>
      ) : null}
      <Verdict x={300} at={SMALL} v="0.01" hi={[9, 10]} color={EXT} head="9 HEADS" l1="HARD TO EXPLAIN" l2="BY LUCK" />
      <Verdict x={780} at={BIG} v="0.38" hi={[6, 7, 8, 9, 10]} color={NULLC} head="6 HEADS" l1="EASILY" l2="JUST LUCK" />
    </AbsoluteFill>
  );
};
