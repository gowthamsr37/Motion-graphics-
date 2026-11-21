// SCENE 7 — WHAT z = −2 MEANS. IF H0 IS TRUE: the standard normal curve (−3…3), a z = −2 marker drops into the left
// tail, the tail shades; FAR ENOUGH TO REJECT H0? and the two methods (p-value, critical value).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Badge, FnCurve, gx, Marker, ValueAxis } from "../components/Curve";
import { ease, Pop, useSpr } from "../components/Motion";
import { CLAIM, StepTracker, TAIL, zf, ZFMAX, zGeo } from "../components/ZKit";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G = zGeo(1050, 400);

export const S7Picture: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const draw = ease(frame, [2, 30], [0, 1], theme.ease.inOut);
  const LEFT = s.cueS(0, "below");
  const RARE = s.cueS(0, "far");
  const TWO = s.cueS(0, "Two");
  const tail = ease(frame, [LEFT - 8, LEFT + 10], [0, 1]);
  return (
    <AbsoluteFill>
      <StepTracker active={3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", opacity: draw, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: CLAIM }}>IF H0 IS TRUE: THE STANDARD NORMAL CURVE</div>
      <FnCurve g={G} f={zf} fmax={ZFMAX} p={draw} color={CLAIM} fill={0.12} bands={[{ a: -3.6, b: -2, color: TAIL, opacity: 0.8, p: tail }]} />
      <ValueAxis g={G} p={draw} ticks={[-3, -2, -1, 0, 1, 2, 3].map((v) => ({ v, label: `${v === 0 ? "0" : v > 0 ? `+${v}` : `−${-v}`}`, color: v === -2 ? TAIL : undefined, big: v === -2 }))} label="z (STANDARD ERRORS FROM THE CLAIM)" />
      <Marker x={gx(G, 0)} base={G.base} top={G.base - 440} p={spr(8, theme.spring.smooth) * 0.999} color={CLAIM} label="CLAIM: 200 ml" size={24} />
      <Marker x={gx(G, -2)} base={G.base} top={G.base - 230} p={spr(s.sent(0).from + 6, theme.spring.bouncy)} color={TAIL} label="z = −2 (198 ml)" size={28} />
      <Badge x={gx(G, -2.75)} y={G.base - 60} p={spr(RARE - 4, theme.spring.pop)} color={TAIL} size={30}>
        ?
      </Badge>
      <Pop at={RARE - 4} x={540} y={1190} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 50, color: C.text, whiteSpace: "nowrap" }}>
          FAR ENOUGH TO REJECT H0<span style={{ color: C.yellow }}>?</span>
        </div>
      </Pop>
      {[
        { t: "METHOD 1: p-VALUE", c: C.violet, x: 300 },
        { t: "METHOD 2: CRITICAL VALUE", c: C.orange, x: 760 },
      ].map((m, i) => (
        <Pop key={i} at={TWO + 4 + i * 8} x={m.x} y={1290} from="up" dist={12} cfg={theme.spring.pop}>
          <div style={{ padding: "10px 22px", borderRadius: 999, background: `${m.c}33`, border: `3px solid ${m.c}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>{m.t}</div>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};
