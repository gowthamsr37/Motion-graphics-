// SCENE 10 — YOUR TURN + TEASER + CTA. ONE CUSTOMER'S SPEND: SKEWED · AVERAGE OF 500: NORMAL? with YES / NO chips and the bouncing VOTE IN
// THE CAPTION POLL hint; teaser: ANOVA (three or more groups); end card.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cta } from "../components/Cta";
import { Teaser } from "../components/Explain";
import { exitP, Pop, useSpr } from "../components/Motion";
import { PollHint } from "../components/Quiz";
import { TestViz } from "../components/Tests";
import { skew } from "../components/Uses";
import { CurveIcon } from "../components/Explain";
import { alpha, glowBox, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S10Poll: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s10");
  const P0 = s.sent(0).from;
  const N = s.cueS(0, "skewed.");
  const ZT = s.cueS(0, "500");
  const VOTE = s.cueS(0, "Vote");
  const TZ = s.sent(1).from;
  const FOL = s.sent(2).from;
  const clear = exitP(frame, TZ - 10, 10);
  const teaseOut = exitP(frame, FOL - 10, 10);
  const badge = spr(P0 - 6, theme.spring.pop);
  return (
    <AbsoluteFill>
      {clear < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - clear, transform: `scale(${1 - clear * 0.06})` }}>
          {badge > 0.001 ? (
            <div style={{ position: "absolute", left: 540, top: 320, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, badge), [0, 1], [0.4, 1])}) rotate(${Math.sin(frame / 10) * 2}deg)`, padding: "14px 34px", borderRadius: 999, background: `linear-gradient(180deg, ${C.yellow}, #F59E0B)`, boxShadow: glowBox(C.yellow, 0.7), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 50, color: C.ink, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>YOUR TURN</div>
          ) : null}
          <Pop at={N - 10} x={540} y={540} from="up" dist={12} cfg={theme.spring.bouncy}>
            <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "18px 40px", borderRadius: 28, background: "rgba(14,24,64,0.92)", border: `3px solid ${alpha(C.text, 0.3)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text, whiteSpace: "nowrap" }}>
              <CurveIcon color={C.orange} f={(x) => skew(x * 4) * 4} w={110} h={56} /> ONE CUSTOMER&apos;S SPEND: <span style={{ color: C.orange }}>SKEWED</span>
            </div>
          </Pop>
          {[
            { x: 330, t: "YES", c: C.green, l: "A" },
            { x: 750, t: "NO", c: C.red, l: "B" },
          ].map((o, i) => {
            const k = spr(ZT - 4 + i * 8, theme.spring.bouncy);
            return k > 0.001 ? (
              <div key={o.t} style={{ position: "absolute", left: o.x, top: 820, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, k), [0, 1], [0.5, 1]) * (1 + Math.sin(frame / 8 + i * 2) * 0.02)})`, opacity: Math.min(1, k * 2), display: "flex", alignItems: "center", gap: 18, padding: "22px 40px", borderRadius: 30, background: alpha(o.c, 0.18), border: `4px solid ${o.c}`, boxShadow: `0 0 30px ${alpha(o.c, 0.35)}` }}>
                <span style={{ width: 56, height: 56, borderRadius: 28, background: o.c, color: C.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34 }}>{o.l}</span>
                <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, textShadow: glowText(o.c, 0.5), whiteSpace: "nowrap" }}>{o.t}</span>
              </div>
            ) : null;
          })}
          <Pop at={ZT + 16} x={540} y={1000} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
              AVERAGE OF 500: NORMAL<span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.6) }}>?</span>
            </div>
          </Pop>
          <div style={{ transform: "scale(1.35)", transformOrigin: "540px 1180px", position: "absolute", inset: 0 }}>
            <PollHint at={VOTE - 2} out={TZ - 4} y={1180} />
          </div>
        </AbsoluteFill>
      ) : null}
      {frame >= TZ - 6 && teaseOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - teaseOut }}>
          <Teaser
            at={TZ}
            titleAt={s.cueS(1, "ANOVA.")}
            label="NEXT: THREE OR MORE GROUPS"
            title="ANOVA"
            color={C.green}
            icon={
              <div style={{ width: 520 }}>
                <TestViz kind="anova" w={520} h={186} color={C.green} p={interpolate(frame, [TZ, TZ + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} tiny />
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
          next="ANOVA"
          chips={[
            { l: "Polls", c: C.cyan },
            { l: "A/B tests", c: C.orange },
            { l: "Factories", c: C.green },
            { l: "Insurance + ML", c: C.violet },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};
