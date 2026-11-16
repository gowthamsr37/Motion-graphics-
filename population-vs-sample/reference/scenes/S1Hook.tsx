// SCENE 1 — HOOK. A dice tumbles: what will you get? You can't know for sure… but you can know the chance of every
// outcome: six faces, 1/6 each, rise into six equal bars → PROBABILITY DISTRIBUTION.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, exitP, Pop, useSpr } from "../components/Motion";
import { Die } from "../components/Prob";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const DISC = C.cyan;
export const CONT = C.green;
export const PROB = C.violet;
const FX = (i: number) => 540 + (i - 2.5) * 148;

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const WHAT = s.sent(0).from;
  const CANT = s.sent(1).from;
  const EVERY = s.sent(2).from;
  const OUT = s.cueS(2, "outcome.");
  const PD = s.sent(3).from;
  const PDW = s.cueS(3, "probability");
  // the tumbling die: value changes every 3 frames, slows, lands on 4 just before the faces appear
  const roll = Math.min(frame, EVERY - 12);
  const spin = ease(frame, [4, EVERY - 12], [0, 1], theme.ease.out);
  const value = frame < EVERY - 12 ? 1 + (Math.floor(roll / (3 + spin * 5)) * 5) % 6 : 4;
  const dieIn = spr(2, theme.spring.bouncy);
  const dieOut = exitP(frame, EVERY - 6, 10);
  const bars = ease(frame, [PD - 8, PD + 14], [0, 1], theme.ease.inOut);
  const title = spr(PDW - 3, theme.spring.pop);

  return (
    <AbsoluteFill>
      <Pop at={WHAT - 4} out={EVERY - 8} x={540} y={430} from="up" dist={18} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 70, color: C.text, whiteSpace: "nowrap" }}>
          WHAT WILL YOU GET<span style={{ color: C.yellow, textShadow: glowText(C.yellow, 0.6) }}>?</span>
        </div>
      </Pop>
      {dieOut < 1 ? (
        <div style={{ position: "absolute", left: 540, top: 800 + Math.abs(Math.sin(frame / 5)) * -60 * (1 - spin), transform: `translate(-50%, -50%) rotate(${(1 - spin) * frame * 14}deg) scale(${dieIn * (1 - dieOut * 0.4)})`, opacity: 1 - dieOut }}>
          <Die value={value} size={240} color={DISC} glow={0.8} />
        </div>
      ) : null}
      <Pop at={CANT - 2} out={EVERY - 8} x={540} y={1110} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.dim, whiteSpace: "nowrap" }}>
          can&apos;t know <span style={{ color: C.text }}>for sure</span>
        </div>
      </Pop>
      {/* every outcome and its chance */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const p = spr(EVERY + 2 + i * 4, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const chip = spr(OUT + i * 3, theme.spring.pop);
        const h = 230 * bars;
        return (
          <React.Fragment key={i}>
            {bars > 0.01 ? <div style={{ position: "absolute", left: FX(i) - 52, top: 1000 - h, width: 104, height: h, borderRadius: "16px 16px 4px 4px", background: `linear-gradient(180deg, ${alpha(DISC, 0.75)}, ${alpha(DISC, 0.25)})`, border: `3px solid ${DISC}`, boxShadow: `0 0 18px ${alpha(DISC, 0.35)}` }} /> : null}
            <div style={{ position: "absolute", left: FX(i), top: 1070, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.4, 1])}) rotate(${(1 - p) * 90}deg)`, opacity: Math.min(1, p * 2) }}>
              <Die value={i + 1} size={100} color={DISC} />
            </div>
            {chip > 0.01 ? (
              <div style={{ position: "absolute", left: FX(i), top: 1000 - h - 34, transform: `translate(-50%, -50%) scale(${interpolate(chip, [0, 1], [0.5, 1])})`, opacity: Math.min(1, chip * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>1/6</div>
            ) : null}
          </React.Fragment>
        );
      })}
      {bars > 0.01 ? <div style={{ position: "absolute", left: 90, top: 1000, width: 900, height: 4, borderRadius: 2, background: alpha(C.text, 0.4), opacity: bars }} /> : null}
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.6, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 96, color: C.text }}>PROBABILITY</div>
          <div style={{ fontSize: 96, background: `linear-gradient(90deg, ${DISC}, ${PROB})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(PROB, 0.5)})` }}>DISTRIBUTION</div>
        </div>
      ) : null}
      <Burst at={PDW} x={540} y={470} color={PROB} count={22} radius={340} seed={9} />
    </AbsoluteFill>
  );
};
