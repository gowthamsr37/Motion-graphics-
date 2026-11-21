// SCENE 12 — YOUR TURN (poll prompt, no in-video quiz) + TEASER + CTA. YOUR TURN · TWO-TAILED z = 1.5 · the zone curve
// (no marker: the answer lives in the pinned comment) · REJECT H0, OR NOT? · a big bouncing VOTE IN THE CAPTION POLL.
// Teaser: the t-test.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { Teaser } from "../components/Explain";
import { ease, exitP, Pop, useSpr } from "../components/Motion";
import { PollHint } from "../components/Quiz";
import { TestViz } from "../components/Tests";
import { CLAIM, MEAN, SE, TAIL, zGeo } from "../components/ZKit";
import { alpha, glowBox, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { ZoneCurve } from "./S9Critical";

const C = theme.colors;
const G = zGeo(1010, 260, 160, 920);

export const S12Poll: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s12");
  const P0 = s.sent(0).from;
  const Z = s.cueS(0, "1.5.");
  const REJ = s.cueS(0, "Reject");
  const VOTE = s.cueS(0, "Vote");
  const TZ = s.sent(1).from;
  const FOL = s.sent(2).from;
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const badge = spr(P0 - 6, theme.spring.pop);
  const zp = spr(Z - 4, theme.spring.pop);
  const draw = ease(frame, [Z, Z + 24], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          {badge > 0.001 ? (
            <div style={{ position: "absolute", left: 540, top: 320, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, badge), [0, 1], [0.4, 1])}) rotate(${Math.sin(frame / 10) * 2}deg)`, padding: "14px 34px", borderRadius: 999, background: `linear-gradient(180deg, ${C.yellow}, #F59E0B)`, boxShadow: glowBox(C.yellow, 0.7), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 50, color: C.ink, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>YOUR TURN</div>
          ) : null}
          {zp > 0.001 ? (
            <div style={{ position: "absolute", left: 540, top: 500, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, zp), [0, 1], [0.5, 1])})`, opacity: Math.min(1, zp * 2), display: "flex", alignItems: "center", gap: 24, whiteSpace: "nowrap" }}>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.dim }}>TWO-TAILED</div>
              <div style={{ padding: "12px 34px", borderRadius: 999, background: alpha(MEAN, 0.2), border: `3px solid ${MEAN}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 60, color: C.text }}>
                <span style={{ fontFamily: theme.fonts.display, fontStyle: "italic" }}>z</span> = <span style={{ color: MEAN, textShadow: glowText(MEAN, 0.5) }}>1.5</span>
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.dim }}>ALPHA 5%</div>
            </div>
          ) : null}
          {frame >= Z - 4 ? <ZoneCurve g={G} p={draw} zones={draw} /> : null}
          <Pop at={REJ - 4} x={540} y={1150} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.text, whiteSpace: "nowrap" }}>
              REJECT H0, OR NOT<span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.6) }}>?</span>
            </div>
          </Pop>
          <div style={{ transform: "scale(1.35)", transformOrigin: "540px 1270px", position: "absolute", inset: 0 }}>
            <PollHint at={VOTE - 2} out={TZ - 4} y={1270} />
          </div>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser
            at={TZ}
            titleAt={s.cueS(1, "t-test.")}
            label="NEXT: WHAT IF SIGMA IS UNKNOWN?"
            title="THE t-TEST"
            color={C.violet}
            icon={
              <div style={{ width: 520 }}>
                <TestViz kind="t1" w={520} h={186} color={C.violet} p={interpolate(frame, [TZ, TZ + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} tiny />
              </div>
            }
          />
        </AbsoluteFill>
      ) : null}
      {frame >= FOL - 6 ? (
        <Cta
          FOL={FOL}
          FOLW={s.cueS(2, "Follow")}
          DATAW={s.cueS(2, "data")}
          SIMPLE={s.cueS(2, "simple!")}
          next="THE t-TEST"
          chips={[
            { l: "z = gap ÷ SE", c: SE },
            { l: "Critical value ±1.96", c: TAIL },
            { l: "Critical region = alpha", c: TAIL },
            { l: "p < alpha: reject", c: CLAIM },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
