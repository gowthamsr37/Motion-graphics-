// SCENE 4 — EXAMPLE 1: 9 HEADS. ASSUME THE COIN IS FAIR, flip it 10 times again and again: the exact chances of 0–10
// heads. 9 or 10 heads (orange) happen about 1% of the time (11/1024) → p = 0.01 · VERY SURPRISING.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { type BarGeo, bxk, HeadsBars } from "../components/Coins";
import { Badge, Bracket } from "../components/Curve";
import { Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { ExampleTag } from "../components/Simple";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EXT, NULLC, PPill } from "./S1Hook";

const C = theme.colors;
export const BG: BarGeo = { x0: 150, x1: 930, base: 1000, h: 340 };

export const S4Nine: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const FAIR = s.cueS(0, "fair,");
  const GROW = s.cueS(0, "again");
  const NINE = s.sent(1).from;
  const ONE = s.cueS(1, "1%");
  const PVW = s.cueS(2, "p-value");
  const SURP = s.cueS(2, "surprising");
  const hi: Record<number, string> = frame >= NINE - 4 ? { 9: EXT, 10: EXT } : {};
  return (
    <AbsoluteFill>
      <ExampleTag n={1} at={s.sent(0).from} color={NULLC} label="9 HEADS" y={290} />
      <Pop at={FAIR - 6} x={540} y={420} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 44, color: C.text }}>
            ASSUME THE COIN IS <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>FAIR</span>
          </div>
          <div style={{ fontSize: 24, color: C.dim, marginTop: 8, letterSpacing: "0.1em" }}>FLIP 10 TIMES, AGAIN AND AGAIN</div>
        </div>
      </Pop>
      <HeadsBars g={BG} growAt={GROW} hi={hi} />
      <Bracket x0={bxk(BG, 9) - 28} x1={bxk(BG, 10) + 28} y={820} p={spr(ONE - 8, theme.spring.bouncy)} color={EXT} />
      <Badge x={bxk(BG, 9.5)} y={750} p={spr(ONE - 2, theme.spring.pop)} color={EXT} size={36}>
        1%
      </Badge>
      <Pop at={NINE + 4} x={bxk(BG, 8.6)} y={680} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: EXT, whiteSpace: "nowrap" }}>9 OR MORE HEADS</div>
      </Pop>
      <Pop at={PVW - 4} x={540} y={1170} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <PPill v="0.01" />
      </Pop>
      <Pop at={SURP - 6} x={540} y={1290} from="up" dist={12} cfg={theme.spring.bouncy}>
        <Tag color={EXT} size={30}>
          VERY SURPRISING FOR A FAIR COIN
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
