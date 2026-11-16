// SCENE 3 — WHY SAMPLE. Why not measure everyone? Too slow · too costly · impossible. Testing how long every bulb
// lasts burns out every bulb: a row of bulbs flickers and dies one by one → nothing left to sell.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ClockGlyph, Rupee } from "../components/Icons";
import { ease, Pop, useSpr } from "../components/Motion";
import { BulbGlyph } from "../components/Sampling";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { BIAS, POP, SAMP } from "./S1Hook";

const C = theme.colors;
const BX = (i: number) => 540 + (i - 3.5) * 118;

export const S3Why: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const WHY = s.sent(0).from;
  const SLOW = s.cueS(1, "slow,");
  const COST = s.cueS(1, "costly,");
  const IMP = s.cueS(1, "impossible.");
  const BULB = s.sent(2).from;
  const BURN = s.cueS(2, "burn");
  const reasons = [
    { at: SLOW, t: "TOO SLOW", c: SAMP, icon: <ClockGlyph size={64} color={SAMP} /> },
    { at: COST, t: "TOO COSTLY", c: POP, icon: <Rupee size={64} color={POP} /> },
    { at: IMP, t: "IMPOSSIBLE", c: BIAS, icon: <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: BIAS, lineHeight: 1 }}>!</div> },
  ];

  return (
    <AbsoluteFill>
      <Pop at={WHY - 4} x={540} y={430} from="up" dist={18} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 58, color: C.text, whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.1 }}>
          WHY NOT MEASURE
          <br />
          <span style={{ color: POP, textShadow: glowText(POP, 0.5) }}>EVERYONE?</span>
        </div>
      </Pop>
      {reasons.map((r, i) => {
        const ghost = ease(frame, [6 + i * 4, 16 + i * 4], [0, 1]);
        const p = spr(r.at - 6, theme.spring.bouncy);
        return (
          <div key={r.t} style={{ position: "absolute", left: 220 + i * 320, top: 700, transform: `translate(-50%, -50%) scale(${p > 0.01 ? interpolate(p, [0, 1], [0.6, 1]) : 1})`, width: 290, height: 200, boxSizing: "border-box", borderRadius: 28, background: p > 0.01 ? `linear-gradient(180deg, ${alpha(r.c, 0.2)}, rgba(14,24,64,0.9))` : "transparent", border: p > 0.01 ? `3px solid ${r.c}` : `3px dashed ${alpha("#F3F7FF", 0.22)}`, opacity: Math.max(ghost * 0.6, Math.min(1, p * 2)), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ opacity: Math.min(1, p * 2) }}>{r.icon}</div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap", opacity: Math.min(1, p * 2) }}>{r.t}</div>
          </div>
        );
      })}
      {/* the bulb test */}
      {Array.from({ length: 8 }, (_, i) => {
        const p = spr(BULB - 4 + i * 3, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const t0 = BURN + 2 + i * 6;
        const flick = frame >= t0 - 8 && frame < t0 ? (Math.floor(frame / 2) % 2 === 0 ? 0.3 : 1) : 1;
        const on = frame < t0 ? flick : 0;
        const smoke = ease(frame, [t0, t0 + 20], [0, 1]);
        return (
          <div key={i} style={{ position: "absolute", left: BX(i), top: 1040, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2) }}>
            <BulbGlyph size={104} on={on} />
            {smoke > 0.01 && smoke < 1 ? <div style={{ position: "absolute", left: 40, top: -20 - smoke * 40, width: 24, height: 24, borderRadius: 12, background: alpha("#A3B0D6", 0.5 * (1 - smoke)), transform: `scale(${1 + smoke})` }} /> : null}
          </div>
        );
      })}
      <Pop at={BURN + 50} x={540} y={1220} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          NOTHING LEFT <span style={{ color: BIAS, textShadow: glowText(BIAS, 0.5) }}>TO SELL!</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
