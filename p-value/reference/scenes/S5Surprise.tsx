// SCENE 5 — HOW SURPRISING? If the coin were fair: the exact chances of 0–10 heads in 10 flips. 9 or 10 heads
// (orange) together happen about 1% of the time (11/1024).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { type BarGeo, bxk, HeadsBars } from "../components/Coins";
import { Badge, Bracket } from "../components/Curve";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { ALT, DATA, NULLC } from "./S1Hook";

const C = theme.colors;
export const BG: BarGeo = { x0: 150, x1: 930, base: 1160, h: 440 };

export const S5Surprise: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const PICTURE = s.sent(1).from;
  const NINE = s.sent(2).from;
  const ONE = s.cueS(2, "1%");
  const hi: Record<number, string> = frame >= NINE - 4 ? { 9: ALT, 10: ALT } : {};
  return (
    <AbsoluteFill>
      <SceneTitle label="HOW SURPRISING?" color={DATA} at={2} />
      <Pop at={6} x={540} y={450} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: C.text, whiteSpace: "nowrap" }}>
          IF THE COIN WERE <span style={{ color: NULLC, textShadow: glowText(NULLC, 0.5) }}>FAIR</span>...
        </div>
      </Pop>
      <HeadsBars g={BG} growAt={PICTURE} hi={hi} />
      <Bracket x0={bxk(BG, 9) - 28} x1={bxk(BG, 10) + 28} y={1000} p={spr(ONE - 6, theme.spring.bouncy)} color={ALT} />
      <Badge x={bxk(BG, 9.5)} y={930} p={spr(ONE - 2, theme.spring.pop)} color={ALT} size={36}>
        1%
      </Badge>
      <Pop at={ONE + 6} x={540} y={540} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          9 OR MORE HEADS: <span style={{ color: ALT, textShadow: glowText(ALT, 0.5) }}>ABOUT 1 IN 100</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
