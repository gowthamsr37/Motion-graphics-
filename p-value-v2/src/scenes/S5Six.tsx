// SCENE 5 — EXAMPLE 2: 6 HEADS. 6 or more heads (orange) happen 38% of the time (386/1024) → p = 0.38 ·
// NOT SURPRISING AT ALL.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { bxk, HeadsBars } from "../components/Coins";
import { Badge, Bracket } from "../components/Curve";
import { Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { Coin } from "../components/Prob";
import { ExampleTag } from "../components/Simple";
import { theme } from "../theme";
import { useScene } from "../timing";
import { EXT, NULLC, PPill, SIXROW } from "./S1Hook";
import { BG } from "./S4Nine";


export const S5Six: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const SIXW = s.cueS(1, "6");
  const P38 = s.cueS(1, "38%");
  const PW = s.cueS(1, "0.38.");
  const NOT = s.sent(2).from;
  const hi: Record<number, string> = frame >= SIXW - 4 ? { 6: EXT, 7: EXT, 8: EXT, 9: EXT, 10: EXT } : {};
  return (
    <AbsoluteFill>
      <ExampleTag n={2} at={s.sent(0).from} color={NULLC} label="6 HEADS" y={290} />
      {SIXROW.map((f, i) => {
        const p = spr(s.sent(0).from + 4 + i * 2, theme.spring.pop);
        if (p <= 0.001) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 540 + (i - 4.5) * 84, top: 410, transform: `translate(-50%, -50%) scale(${Math.min(1.2, p)})` }}>
            <Coin side={f} size={70} />
          </div>
        );
      })}
      <HeadsBars g={BG} growAt={s.sent(0).from + 10} hi={hi} />
      <Bracket x0={bxk(BG, 6) - 28} x1={bxk(BG, 10) + 28} y={620} p={spr(P38 - 8, theme.spring.bouncy)} color={EXT} />
      <Badge x={bxk(BG, 8)} y={550} p={spr(P38 - 2, theme.spring.pop)} color={EXT} size={36}>
        38%
      </Badge>
      <Pop at={SIXW + 4} x={bxk(BG, 8)} y={492} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: EXT, whiteSpace: "nowrap" }}>6 OR MORE HEADS</div>
      </Pop>
      <Pop at={PW - 4} x={540} y={1170} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <PPill v="0.38" color={NULLC} />
      </Pop>
      <Pop at={NOT - 4} x={540} y={1290} from="up" dist={12} cfg={theme.spring.bouncy}>
        <Tag color={NULLC} size={30}>
          NOT SURPRISING AT ALL
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
