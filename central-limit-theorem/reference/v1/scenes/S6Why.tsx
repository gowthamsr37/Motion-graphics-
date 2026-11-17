// SCENE 6 — WHY IT MATTERS. The normal distribution shows up everywhere because so much of what we measure is an average.
// Polls: a result with a margin of error (48% ± 3%). Science: testing whether a result is real.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { LensGlyph } from "../components/Kit";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { MEANS, RAW, SE } from "./S1Hook";

const C = theme.colors;
const G: BellGeo = { x0: 160, x1: 920, vmin: -3.4, vmax: 3.4, base: 860, peakH: 290, sigmaRef: 1 };

export const S6Why: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const EVERY = s.cueS(0, "everywhere.");
  const POLLS = s.cueS(1, "polls");
  const MARGIN = s.cueS(1, "margin");
  const SCI = s.cueS(1, "scientists");
  const REAL = s.cueS(1, "real.");
  const cards = [
    { at: POLLS, x: 300, c: RAW, t: "POLLS", sub: "margin of error" },
    { at: SCI, x: 780, c: SE, t: "SCIENCE", sub: "is the result real?" },
  ];
  const bar = ease(frame, [POLLS + 4, POLLS + 18], [0, 1]);
  const whisk = ease(frame, [MARGIN - 4, MARGIN + 8], [0, 1]);

  return (
    <AbsoluteFill>
      <Pop at={s.sent(0).from - 2} x={540} y={430} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
          WHY THE <span style={{ color: MEANS, textShadow: glowText(MEANS, 0.5) }}>BELL</span> IS EVERYWHERE
        </div>
      </Pop>
      <Bell g={G} mu={0} sigma={1} p={ease(frame, [6, 26], [0, 1], theme.ease.inOut)} color={MEANS} fill={0.2} width={6} />
      <div style={{ position: "absolute", left: G.x0 - 10, top: G.base - 2, width: G.x1 - G.x0 + 20, height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
      <Pop at={EVERY - 2} x={540} y={910} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.18em", color: C.dim, whiteSpace: "nowrap" }}>SO MUCH OF WHAT WE MEASURE IS AN AVERAGE</div>
      </Pop>
      {cards.map((k, i) => {
        const p = spr(k.at - 6, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <div key={k.t} style={{ position: "absolute", left: k.x, top: 1130, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), width: 430, height: 300, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(180deg, ${alpha(k.c, 0.2)}, rgba(14,24,64,0.9))`, border: `3px solid ${k.c}`, boxShadow: `0 0 26px ${alpha(k.c, 0.3)}` }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 28, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: k.c }}>{k.t}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 78, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, color: C.dim }}>{k.sub}</div>
            {i === 0 ? (
              <>
                <div style={{ position: "absolute", left: 40, top: 160, width: 300 * 0.48 * 2 * bar, height: 50, borderRadius: 10, background: alpha(RAW, 0.5), border: `3px solid ${RAW}` }} />
                {whisk > 0.01 ? (
                  <>
                    <div style={{ position: "absolute", left: 40 + 288 - 18 * whisk, top: 183, width: 36 * whisk, height: 4, background: C.text }} />
                    <div style={{ position: "absolute", left: 40 + 288 - 18 * whisk - 2, top: 168, width: 4, height: 34, background: C.text }} />
                    <div style={{ position: "absolute", left: 40 + 288 + 18 * whisk - 2, top: 168, width: 4, height: 34, background: C.text }} />
                  </>
                ) : null}
                <div style={{ position: "absolute", left: 0, right: 0, top: 236, textAlign: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: C.text, opacity: whisk }}>48% ± 3%</div>
              </>
            ) : (
              <div style={{ position: "absolute", left: 0, right: 0, top: 130, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
                <LensGlyph size={110} color={SE} />
                {frame >= REAL - 4 ? <Mark kind="check" at={REAL - 4} size={70} color={C.green} /> : <div style={{ width: 70 }} />}
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
