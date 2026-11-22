// SCENE 3 — IT'S AN AVERAGE. A counter rolls to 520 / 1,000 = 52%; then a row of 1s (yes) and 0s (no) slides in and
// collapses into (1 + 0 + 1 + 1 + 0 …) ÷ 1,000 = 0.52 = 52%: THE POLL RESULT IS AN AVERAGE.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, rng, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { USES } from "../components/Uses";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const U = USES[0];
const r = rng(14);
const BITS = Array.from({ length: 14 }, () => (r() < 0.55 ? 1 : 0));

export const S3Average: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const CNT = s.sent(0).from;
  const P52 = s.cueS(0, "52%.");
  const ONE = s.cueS(1, "1,");
  const AVG = s.cueS(1, "average.");
  const n = Math.round(interpolate(ease(frame, [CNT, CNT + 40], [0, 1]), [0, 1], [0, 520]));
  return (
    <AbsoluteFill>
      <SceneTitle label="THE POLL RESULT" color={U.c} at={2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 90, color: C.text, opacity: ease(frame, [CNT - 6, CNT + 4], [0, 1]) }}>
        <span style={{ color: U.c, textShadow: glowText(U.c, 0.5) }}>{n}</span>
        <span style={{ color: C.dim, fontSize: 60 }}> / 1,000 YES</span>
      </div>
      <Pop at={P52 - 6} x={540} y={660} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 100, color: U.c, textShadow: glowText(U.c, 0.7) }}>= 52%</div>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 840, display: "flex", justifyContent: "center", gap: 10 }}>
        {BITS.map((b, i) => {
          const p = spr(ONE - 6 + i * 2, theme.spring.pop);
          return (
            <div key={i} style={{ width: 56, height: 70, borderRadius: 12, background: b ? alpha(U.c, 0.3) : alpha(C.text, 0.1), border: `2px solid ${b ? U.c : alpha(C.text, 0.4)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: b ? U.c : C.dim, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * -30}px)` }}>{b}</div>
          );
        })}
      </div>
      <Pop at={ONE + 6} x={540} y={960} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.14em", color: C.dim, whiteSpace: "nowrap" }}>
          YES = <span style={{ color: U.c }}>1</span> · NO = 0
        </div>
      </Pop>
      <Pop at={AVG - 8} x={540} y={1080} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          AVERAGE = 520 ÷ 1,000 = <span style={{ color: U.c, textShadow: glowText(U.c, 0.5) }}>0.52</span>
        </div>
      </Pop>
      <Pop at={AVG + 4} x={540} y={1210} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={U.c} size={30}>
          A POLL RESULT IS JUST AN AVERAGE
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
