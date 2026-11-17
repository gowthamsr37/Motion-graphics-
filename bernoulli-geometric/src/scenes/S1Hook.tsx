// SCENE 1 — HOOK. A dice tumbles and lands on 6: IS IT A SIX? YES / NO → BERNOULLI. Then a run of rolls until the
// first six (3, 1, 5, 6) → & GEOMETRIC.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, Pop, useSpr } from "../components/Motion";
import { Die } from "../components/Prob";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const YES = C.green; // success (1)
export const NO = C.orange; // failure (0)
export const TRY = C.cyan; // tries / the geometric bars
export const AVG = C.violet; // the average

export const RUN = [3, 1, 5, 6];

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const SIX = s.cueS(0, "six?");
  const YN = s.cueS(0, "yes");
  const BER = s.cueS(1, "Bernoulli.");
  const UNTIL = s.cueS(2, "until");
  const GEO = s.cueS(2, "geometric");
  const land = SIX - 4;
  const rolling = frame < land;
  const face = rolling ? 1 + (Math.floor(frame / 3) % 6) : 6;
  const dieIn = spr(4, theme.spring.bouncy);
  const t1 = spr(BER - 3, theme.spring.pop);
  const t2 = spr(GEO - 3, theme.spring.pop);
  const ynOut = ease(frame, [UNTIL - 6, UNTIL + 4], [0, 1]);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540, top: 740, transform: `translate(-50%, -50%) scale(${dieIn}) rotate(${rolling ? Math.sin(frame / 2) * 18 : 0}deg)` }}>
        <Die value={face} size={230} color={rolling ? TRY : YES} glow={rolling ? 0.3 : 1} />
      </div>
      <Pop at={SIX - 4} out={BER - 6} x={540} y={430} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, whiteSpace: "nowrap" }}>
          IS IT A <span style={{ color: YES, textShadow: glowText(YES, 0.5) }}>SIX</span>
          <span style={{ color: C.yellow }}>?</span>
        </div>
      </Pop>
      {[0, 1].map((i) => {
        const p = spr(YN - 4 + i * 6, theme.spring.bouncy);
        if (p <= 0.001 || ynOut >= 1) return null;
        const c = i ? NO : YES;
        return (
          <div key={i} style={{ position: "absolute", left: 380 + i * 320, top: 1010, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2) * (1 - ynOut), padding: "18px 46px", borderRadius: 999, background: alpha(c, 0.22), border: `4px solid ${c}`, boxShadow: `0 0 24px ${alpha(c, 0.4)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text }}>
            {i ? "NO" : "YES"}
          </div>
        );
      })}
      {/* rolling until the first six */}
      {RUN.map((v, i) => {
        const p = spr(UNTIL - 2 + i * 7, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const six = v === 6;
        return (
          <div key={i} style={{ position: "absolute", left: 270 + i * 180, top: 1050, transform: `translate(-50%, -50%) scale(${p})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Die value={v} size={110} color={six ? YES : NO} glow={six ? 1 : 0} />
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: six ? YES : C.dim }}>TRY {i + 1}</div>
          </div>
        );
      })}
      {t1 > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(t1, [0, 1], [1.5, 1])})`, opacity: Math.min(1, t1 * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 104, letterSpacing: "-0.02em", lineHeight: 1 }}>
          <span style={{ background: `linear-gradient(90deg, ${YES}, ${TRY})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(YES, 0.5)})` }}>BERNOULLI</span>
        </div>
      ) : null}
      {t2 > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 510, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(t2, [0, 1], [1.5, 1])})`, opacity: Math.min(1, t2 * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 76, color: C.text, letterSpacing: "-0.02em" }}>
          &amp; <span style={{ color: TRY, textShadow: glowText(TRY, 0.5) }}>GEOMETRIC</span>
        </div>
      ) : null}
      <Burst at={BER} x={540} y={400} color={YES} count={20} radius={320} seed={7} />
      <Burst at={GEO} x={540} y={510} color={TRY} count={16} radius={260} seed={9} />
    </AbsoluteFill>
  );
};
