// SCENE 6 — USE 4: INSURANCE. One customer's claims over 10 years: zeros, then one huge spike; then 100,000 CUSTOMERS: the
// average claim is a very narrow bell; SE ÷ 316 (√100,000); PREMIUMS SET WITH CONFIDENCE.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FnCurve } from "../components/Curve";
import { ease, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { UseDots, UseHeader, USES } from "../components/Uses";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const U = USES[3];
const CLAIMS = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
const G = { x0: 160, x1: 920, vmin: -6, vmax: 6, base: 1170, h: 220 };

export const S6Insurance: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const NO = s.cueS(1, "nothing");
  const HUGE = s.cueS(1, "huge");
  const HK = s.cueS(2, "100,000");
  const bp = ease(frame, [HK - 4, HK + 22], [0, 1], theme.ease.inOut);
  const sd = 2.4 - 1.9 * ease(frame, [s.cueS(2, "300") - 8, s.cueS(2, "300") + 14], [0, 1]);
  return (
    <AbsoluteFill>
      <UseDots idx={3} />
      <UseHeader u={U} at={s.sent(0).from} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", opacity: ease(frame, [NO - 10, NO], [0, 1]), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.dim }}>ONE CUSTOMER&apos;S CLAIMS, YEAR BY YEAR</div>
      {CLAIMS.map((c, i) => {
        const at = c ? HUGE - 4 : NO + i * 3;
        const p = spr(at, theme.spring.pop);
        const h = c ? 220 : 8;
        return <div key={i} style={{ position: "absolute", left: 200 + i * 70, top: 800 - h * Math.min(1, p), width: 46, height: h * Math.min(1, p), borderRadius: 8, background: c ? C.red : alpha(U.c, 0.6), opacity: Math.min(1, p * 2) }} />;
      })}
      <Pop at={HUGE + 4} x={850} y={640} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.red, whiteSpace: "nowrap" }}>ONE HUGE CLAIM</div>
      </Pop>
      {bp > 0.001 ? <FnCurve g={G} f={(v) => Math.exp(-(v * v) / (2 * sd * sd))} fmax={1} p={bp} color={U.c} fill={0.22} /> : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: G.base + 14, textAlign: "center", opacity: bp, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: U.c }}>AVERAGE CLAIM OF 100,000 CUSTOMERS</div>
      <Pop at={s.cueS(2, "300") - 4} x={540} y={900} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
        <div style={{ padding: "10px 30px", borderRadius: 999, background: alpha(U.c, 0.2), border: `3px solid ${U.c}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          SE ÷ <span style={{ color: U.c, textShadow: glowText(U.c, 0.5) }}>316</span> <span style={{ fontFamily: theme.fonts.body, fontSize: 20, color: C.dim }}>(ROOT OF 100,000)</span>
        </div>
      </Pop>
      <Pop at={s.cueS(2, "premiums") - 6} x={540} y={1290} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={U.c} size={30}>
          THAT&apos;S HOW PREMIUMS ARE SET
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
