// SCENE 4 — STEPS 1 AND 2. H0: µ = 200 ml · H1: µ ≠ 200 ml; ALPHA = 5%, a standard normal curve with both tails
// shaded 2.5% each (two-tailed).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Badge, FnCurve, gx } from "../components/Curve";
import { NotEqual } from "../components/Icons";
import { ease, Pop, useSpr } from "../components/Motion";
import { CLAIM, StepTracker, TAIL, zf, ZFMAX, zGeo } from "../components/ZKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G = zGeo(1230, 230, 150, 930);

const Hyp: React.FC<{ y: number; at: number; h: string; c: string; children: React.ReactNode }> = ({ y, at, h, c, children }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y - 55, width: 900, height: 110, boxSizing: "border-box", borderRadius: 26, background: `linear-gradient(90deg, ${alpha(c, 0.2)}, rgba(14,24,64,0.9) 60%)`, border: `3px solid ${c}`, opacity: Math.min(1, p * 2), transform: `scale(${interpolate(Math.min(1, p), [0, 1], [0.9, 1])})`, display: "flex", alignItems: "center", gap: 26, paddingLeft: 32 }}>
      <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: c }}>{h}</span>
      <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 50, color: C.text, display: "flex", alignItems: "center", gap: 16 }}>{children}</span>
    </div>
  );
};

export const S4Setup: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const AL = s.cueS(1, "alpha");
  const TAILS = s.cueS(1, "tails,");
  const draw = ease(frame, [AL, AL + 26], [0, 1], theme.ease.inOut);
  const tails = ease(frame, [TAILS - 8, TAILS + 10], [0, 1]);
  return (
    <AbsoluteFill>
      <StepTracker active={s.sent(1).from <= frame ? 1 : 0} />
      <Hyp y={450} at={s.cueS(0, "H0")} h="H0" c={CLAIM}>
        <span style={{ color: CLAIM }}>µ</span> = <span style={{ fontFamily: theme.fonts.mono }}>200 ml</span>
      </Hyp>
      <Hyp y={590} at={s.cueS(0, "H1")} h="H1" c={TAIL}>
        <span style={{ color: TAIL }}>µ</span> <NotEqual size={44} color={C.text} /> <span style={{ fontFamily: theme.fonts.mono }}>200 ml</span>
      </Hyp>
      <Pop at={AL - 4} x={540} y={760} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>
          ALPHA = <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>5%</span>
        </div>
      </Pop>
      <FnCurve g={G} f={zf} fmax={ZFMAX} p={draw} color={CLAIM} fill={0.1} bands={[{ a: -3.6, b: -1.96, color: TAIL, opacity: 0.75, p: tails }, { a: 1.96, b: 3.6, color: TAIL, opacity: 0.75, p: tails }]} />
      <div style={{ position: "absolute", left: G.x0 - 10, top: G.base, width: (G.x1 - G.x0 + 20) * draw, height: 4, background: alpha(C.text, 0.4), borderRadius: 2 }} />
      <Badge x={gx(G, -2.6)} y={G.base - 70} p={spr(TAILS, theme.spring.pop)} color={TAIL} size={28}>
        2.5%
      </Badge>
      <Badge x={gx(G, 2.6)} y={G.base - 70} p={spr(TAILS + 4, theme.spring.pop)} color={TAIL} size={28}>
        2.5%
      </Badge>
      <div style={{ position: "absolute", left: 0, right: 0, top: G.base + 26, textAlign: "center", opacity: tails, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.18em", color: C.dim }}>TWO-TAILED: OFF IN EITHER DIRECTION</div>
    </AbsoluteFill>
  );
};
