// SCENE 7 — USE 5: MACHINE LEARNING. 1,000 test predictions as a 40 × 25 grid of ✓ (90%) / ✗ squares filling; ACCURACY 90%;
// then the bell of accuracy with SE ≈ 1% and the 88% – 92% range.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bracket, FnCurve, gx, ValueAxis } from "../components/Curve";
import { ease, Pop, rng, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { UseDots, UseHeader, USES } from "../components/Uses";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const U = USES[4];
const r = rng(77);
const PRED = Array.from({ length: 400 }, () => r() < 0.9);
const G = { x0: 160, x1: 920, vmin: 86, vmax: 94, base: 1190, h: 200 };

export const S7ML: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const K = s.cueS(1, "1,000");
  const AV = s.cueS(2, "average,");
  const RNG = s.cueS(2, "88");
  const fill = ease(frame, [K - 6, K + 40], [0, 1]);
  const bp = ease(frame, [AV, AV + 24], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <UseDots idx={4} />
      <UseHeader u={U} at={s.sent(0).from} />
      <div style={{ position: "absolute", left: 160, top: 520, width: 500, display: "grid", gridTemplateColumns: "repeat(25, 1fr)", gap: 4 }}>
        {PRED.map((ok, i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: 4, background: ok ? alpha(C.green, 0.85) : C.red, opacity: i / PRED.length < fill ? 1 : 0 }} />
        ))}
      </div>
      <Pop at={s.cueS(1, "90%") - 4} x={830} y={600} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, color: C.text, lineHeight: 1.1, whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 22, letterSpacing: "0.14em", color: C.dim }}>ACCURACY</div>
          <div style={{ fontSize: 76, color: U.c, textShadow: glowText(U.c, 0.5) }}>90%</div>
        </div>
      </Pop>
      <Pop at={s.cueS(1, "right") - 4} x={830} y={760} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: C.text, whiteSpace: "nowrap" }}>
          EACH: <span style={{ color: C.green }}>RIGHT</span> / <span style={{ color: C.red }}>WRONG</span>
        </div>
      </Pop>
      {bp > 0.001 ? (
        <>
          <FnCurve g={G} f={(v) => Math.exp(-((v - 90) ** 2) / (2 * 0.95 * 0.95))} fmax={1} p={bp} color={U.c} fill={0.2} bands={[{ a: 88.1, b: 91.9, color: U.c, opacity: 0.35, p: ease(frame, [RNG - 8, RNG + 8], [0, 1]) }]} />
          <ValueAxis g={G} p={bp} ticks={[87, 88, 90, 92, 93].map((v) => ({ v, label: `${v}%`, color: v === 90 ? U.c : undefined, big: v === 90 }))} label="ACCURACY ON A NEW TEST SET" />
          <Bracket x0={gx(G, 88.1)} x1={gx(G, 91.9)} y={G.base - G.h - 10} p={spr(RNG - 6, theme.spring.bouncy)} color={U.c} />
          <div style={{ position: "absolute", left: 0, right: 0, top: G.base - G.h - 52, textAlign: "center", opacity: bp, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: U.c }}>ACCURACY IS AN AVERAGE: SE ABOUT 1%</div>
        </>
      ) : null}
      {frame < s.sent(3).from ? (
        <Pop at={RNG - 4} x={540} y={1340} from="up" dist={14} cfg={theme.spring.bouncy}>
          <Tag color={U.c} size={30}>
            TRUE ACCURACY: ABOUT 88% TO 92%
          </Tag>
        </Pop>
      ) : (
        <Pop at={s.sent(3).from} x={540} y={1340} from="up" dist={14} cfg={theme.spring.bouncy}>
          <Tag color={C.yellow} size={30}>
            10,000 TEST EXAMPLES: ±0.6%
          </Tag>
        </Pop>
      )}
    </AbsoluteFill>
  );
};
