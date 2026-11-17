// SCENE 6 — THE VERDICT. The 5-df chi-square curve: below 11.1 = the fair zone (95%, green); beyond = the 5% tail
// (orange). Our score 8.2 sits inside the fair zone; a fair dice scores 8.2 or more about 15% of the time → could be luck.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { chiPdf, CRIT95, SCORE } from "../components/Chi";
import { FnCurve, type Geo, gx, gy, Marker, ValueAxis } from "../components/Curve";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { FAIR, GAP, OBSC } from "./S1Hook";

const C = theme.colors;
export const GV: Geo = { x0: 150, x1: 930, vmin: 0, vmax: 25, base: 1130, h: 460 };
export const chi5 = (x: number) => chiPdf(x, 5);
const FMAX = 0.16;

export const S6Verdict: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const P95 = s.cueS(0, "95%");
  const OURS = s.sent(1).from;
  const P15 = s.cueS(1, "15%");
  const LUCK = s.sent(2).from;
  const fairBand = ease(frame, [P95 - 4, P95 + 16], [0, 1]);
  const tailBand = ease(frame, [P95 + 10, P95 + 26], [0, 1]);
  const over = ease(frame, [P15 - 6, P15 + 14], [0, 1]);
  return (
    <AbsoluteFill>
      <SceneTitle label="THE VERDICT" color={FAIR} at={2} />
      <FnCurve
        g={GV}
        f={chi5}
        fmax={FMAX}
        p={ease(frame, [4, 26], [0, 1], theme.ease.inOut)}
        color={OBSC}
        fill={0.08}
        bands={[
          { a: 0, b: CRIT95, color: FAIR, p: fairBand * (1 - over * 0.6), opacity: 0.4 },
          { a: CRIT95, b: 25, color: GAP, p: tailBand, opacity: 0.7 },
          { a: SCORE, b: CRIT95, color: FAIR, p: over, opacity: 0.75 },
        ]}
      />
      <ValueAxis g={GV} ticks={[0, 5, 10, 15, 20, 25].map((v) => ({ v, label: `${v}` }))} p={ease(frame, [2, 14], [0, 1])} label="CHI-SQUARE SCORE (5 DF)" />
      <Marker x={gx(GV, CRIT95)} base={GV.base} top={gy(GV, chi5(CRIT95), FMAX) - 140} p={spr(P95 - 2, theme.spring.bouncy)} color={GAP} label="11.1" size={32} />
      <Pop at={P95 + 6} x={gx(GV, 5)} y={GV.base - 520} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: FAIR, textShadow: glowText(FAIR, 0.5), whiteSpace: "nowrap" }}>FAIR ZONE: 95%</div>
      </Pop>
      <Pop at={P95 + 18} x={gx(GV, 18)} y={GV.base - 120} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: GAP, textShadow: glowText(GAP, 0.5), whiteSpace: "nowrap" }}>5% TAIL</div>
      </Pop>
      <Marker x={gx(GV, SCORE)} base={GV.base} top={gy(GV, chi5(SCORE), FMAX) - 230} p={spr(OURS + 4, theme.spring.bouncy)} color={C.text} label={<span>OUR SCORE <span style={{ color: FAIR }}>8.2</span></span>} side="right" size={30} />
      <Pop at={P15 + 2} x={gx(GV, SCORE) + 250} y={gy(GV, chi5(SCORE), FMAX) - 160} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.08em", color: C.text, whiteSpace: "nowrap" }}>
          FAIR DICE SCORE THIS HIGH: <span style={{ color: FAIR }}>15%</span>
        </div>
      </Pop>
      <Pop at={LUCK - 2} x={540} y={450} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={FAIR} size={36}>
          COULD EASILY BE <span style={{ color: FAIR }}>LUCK</span>
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
