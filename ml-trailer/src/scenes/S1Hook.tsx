// SCENE 1 — HOOK. STATISTICS ✓ (bell curve, histogram, p < 0.05 cards tick green) → NOW: MACHINES THAT LEARN as a
// neural network builds node by node with pulses running through it.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { NeuralNet } from "../components/ML";
import { exitP, Mark, Pop, useSpr } from "../components/Motion";
import { type Kind, Shape } from "../components/Pick";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const STATS = s.cueS(0, "statistics.");
  const NOW = s.sent(1).from;
  const MACH = s.cueS(1, "machines");
  const out = exitP(frame, NOW - 2, 10);
  const cards: { k: Kind; c: string }[] = [
    { k: "normal", c: C.violet },
    { k: "binomial", c: C.cyan },
    { k: "chisq", c: C.orange },
  ];
  return (
    <AbsoluteFill>
      {out < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${-out * 60}px) scale(${1 - out * 0.1})` }}>
          <Pop at={4} x={540} y={430} from="up" dist={12}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.22em", color: C.dim, whiteSpace: "nowrap" }}>YOU HAVE LEARNED</div>
          </Pop>
          {cards.map((c, i) => {
            const p = spr(6 + i * 4, theme.spring.bouncy);
            if (p <= 0.01) return null;
            return (
              <div key={c.k} style={{ position: "absolute", left: 230 + i * 310, top: 760, width: 270, height: 230, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 26, background: `linear-gradient(180deg, ${alpha(c.c, 0.16)}, rgba(14,24,64,0.92))`, border: `3px solid ${alpha(c.c, 0.8)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shape kind={c.k} w={180} h={90} color={c.c} p={Math.min(1, p)} />
                <div style={{ position: "absolute", right: 14, top: 14 }}>
                  <Mark kind="check" at={STATS - 6 + i * 3} size={44} color={C.green} width={9} />
                </div>
              </div>
            );
          })}
          <Pop at={STATS - 4} x={540} y={1010} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, whiteSpace: "nowrap" }}>
              STATISTICS <span style={{ color: C.green, textShadow: glowText(C.green, 0.5) }}>DONE</span>
            </div>
          </Pop>
        </AbsoluteFill>
      ) : null}
      <Pop at={MACH - 4} x={540} y={430} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.05, whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 44, color: C.dim }}>NOW:</div>
          <div style={{ fontSize: 74, color: C.text }}>
            MACHINES THAT <span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.5) }}>LEARN</span>
          </div>
        </div>
      </Pop>
      <NeuralNet x={540} y={860} w={720} h={520} at={NOW + 2} />
    </AbsoluteFill>
  );
};
