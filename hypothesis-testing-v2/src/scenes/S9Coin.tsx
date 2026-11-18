// SCENE 9 — EXAMPLE 2: A COIN. 9 heads in 10; H0: the coin is fair. If fair, 9 or more heads happens about 1% of the
// time (11/1024) → 1% < 5% → REJECT H0 → THE COIN IS PROBABLY BIASED.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { type BarGeo, bxk, HeadsBars } from "../components/Coins";
import { Badge, Bracket } from "../components/Curve";
import { Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Coin } from "../components/Prob";
import { ExampleTag } from "../components/Simple";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { ALT, FLIPS, LINE, NULLC } from "./S1Hook";

const C = theme.colors;
const BG: BarGeo = { x0: 150, x1: 930, base: 1010, h: 330 };

export const S9Coin: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s9");
  const FAIR = s.sent(1).from;
  const NINE = s.cueS(1, "9");
  const ONE = s.cueS(1, "1%");
  const DEC = s.sent(2).from;
  const BIAS = s.cueS(2, "biased.");
  const hi: Record<number, string> = frame >= NINE - 4 ? { 9: ALT, 10: ALT } : {};
  return (
    <AbsoluteFill>
      <ExampleTag n={2} at={s.sent(0).from} color={NULLC} label="A COIN" y={290} />
      {FLIPS.map((f, i) => {
        const p = spr(s.sent(0).from + 4 + i * 2, theme.spring.pop);
        if (p <= 0.001) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 540 + (i - 4.5) * 84, top: 410, transform: `translate(-50%, -50%) scale(${Math.min(1.2, p)})` }}>
            <Coin side={f} size={70} />
          </div>
        );
      })}
      <Pop at={FAIR - 2} x={540} y={510} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: NULLC }}>H0</span>: THE COIN IS <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>FAIR</span>
        </div>
      </Pop>
      <HeadsBars g={BG} growAt={FAIR + 4} hi={hi} />
      <Bracket x0={bxk(BG, 9) - 28} x1={bxk(BG, 10) + 28} y={840} p={spr(ONE - 8, theme.spring.bouncy)} color={ALT} />
      <Badge x={bxk(BG, 9.5)} y={770} p={spr(ONE - 2, theme.spring.pop)} color={ALT} size={36}>
        1%
      </Badge>
      <Pop at={DEC - 2} x={540} y={1160} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          1% <span style={{ color: C.dim }}>&lt;</span> <span style={{ color: LINE }}>5%</span>
          <span style={{ color: C.dim, fontSize: 30 }}> : </span>
          <span style={{ color: ALT, textShadow: glowText(ALT, 0.5) }}>REJECT H0</span>
        </div>
      </Pop>
      <Pop at={BIAS - 8} x={540} y={1275} from="up" dist={12} cfg={theme.spring.bouncy}>
        <Tag color={ALT} size={30}>
          THE COIN IS PROBABLY BIASED
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
