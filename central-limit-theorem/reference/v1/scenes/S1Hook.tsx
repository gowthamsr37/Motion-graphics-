// SCENE 1 — HOOK. One dice: every face equally likely → six equal bars (flat). Ten dice, average them, again and again:
// each average drops a dot into a histogram → the dots pile into a bell → A BELL! → CENTRAL LIMIT THEOREM.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { DICE_SD } from "../components/Clt";
import { Burst, ease, exitP, Pop, rng, useSpr } from "../components/Motion";
import { Die } from "../components/Prob";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const RAW = C.cyan; // the original data (dice)
export const MEANS = C.green; // sample means / the CLT bell
export const SE = C.violet; // spread / standard error
export const SKEW = C.orange; // skewed source data
const NS = 90;
// 90 samples of 10 dice, deterministic
const SAMPLES = (() => {
  const r = rng(233);
  return Array.from({ length: NS }, () => Array.from({ length: 10 }, () => 1 + Math.floor(r() * 6)));
})();
const AVGS = SAMPLES.map((s) => s.reduce((a, b) => a + b, 0) / 10);
const BIN = 0.25;
const binOf = (a: number) => Math.floor((a - 1) / BIN);
const HX0 = 140;
const HX1 = 940;
const NB = 20;
const BW = (HX1 - HX0) / NB;
const BASE = 1240;
const DOT = 17;
// stack position of each sample's dot in its bin
const SLOT = (() => {
  const c: Record<number, number> = {};
  return AVGS.map((a) => {
    const b = binOf(a);
    c[b] = (c[b] ?? 0) + 1;
    return c[b] - 1;
  });
})();

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const FLAT = s.cueS(0, "flat.");
  const TEN = s.sent(1).from;
  const AVGW = s.cueS(1, "average.");
  const BELLW = s.sent(2).from;
  const CLT = s.cueS(3, "Central");
  const flatIn = ease(frame, [FLAT - 6, FLAT + 10], [0, 1], theme.ease.inOut);
  const flatOut = exitP(frame, TEN - 6, 10);
  const oneDie = exitP(frame, TEN - 8, 10);
  const t0 = AVGW - 4;
  const t1 = BELLW - 6;
  const shown = Math.max(0, Math.min(NS, Math.floor(((frame - t0) / (t1 - t0)) * NS)));
  const cur = Math.max(0, Math.min(NS - 1, shown - 1));
  const rowOut = exitP(frame, BELLW - 4, 10);
  const g: BellGeo = { x0: HX0, x1: HX1, vmin: 1, vmax: 6, base: BASE, peakH: NS * BIN * (0.3989 / (DICE_SD / Math.sqrt(10))) * DOT, sigmaRef: 1 };
  const bell = ease(frame, [BELLW - 2, BELLW + 20], [0, 1], theme.ease.inOut);
  const slam = spr(BELLW, theme.spring.pop);
  const title = spr(CLT - 3, theme.spring.pop);

  return (
    <AbsoluteFill>
      {/* one dice, flat */}
      {oneDie < 1 ? (
        <div style={{ position: "absolute", left: 540, top: 560, transform: `translate(-50%, -50%) rotate(${frame < FLAT - 20 ? frame * 12 : 0}deg) scale(${spr(2, theme.spring.bouncy) * (1 - oneDie * 0.5)})`, opacity: 1 - oneDie }}>
          <Die value={frame < FLAT - 20 ? 1 + (Math.floor(frame / 3) * 5) % 6 : 5} size={200} color={RAW} glow={0.6} />
        </div>
      ) : null}
      {flatOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - flatOut }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: 540 + (i - 2.5) * 140 - 56, top: 1150 - 220 * flatIn, width: 112, height: 220 * flatIn, borderRadius: "14px 14px 4px 4px", background: alpha(RAW, 0.45), border: `3px solid ${RAW}`, boxSizing: "border-box" }} />
              <div style={{ position: "absolute", left: 540 + (i - 2.5) * 140, top: 1200, transform: `translate(-50%, -50%) scale(${spr(20 + i * 4, theme.spring.pop)})` }}>
                <Die value={i + 1} size={70} color={RAW} />
              </div>
            </React.Fragment>
          ))}
          <div style={{ position: "absolute", left: 110, top: 1150, width: 860, height: 4, background: alpha(C.text, 0.4) }} />
          <Pop at={FLAT - 2} x={540} y={830} from="up" dist={14} cfg={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
              ONE DICE: <span style={{ color: RAW, textShadow: glowText(RAW, 0.5) }}>FLAT</span>
            </div>
          </Pop>
        </AbsoluteFill>
      ) : null}

      {/* ten dice, averaged, again and again */}
      {frame >= TEN - 6 && rowOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - rowOut }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: 540 + (i - 4.5) * 88, top: 520, transform: `translate(-50%, -50%) scale(${spr(TEN - 4 + i * 2, theme.spring.bouncy)}) rotate(${shown > 0 ? 0 : frame * 10}deg)` }}>
              <Die value={shown > 0 ? SAMPLES[cur][i] : 1 + ((Math.floor(frame / 3) + i) * 5) % 6} size={74} color={RAW} />
            </div>
          ))}
          <Pop at={AVGW - 4} x={540} y={640} from="up" dist={12}>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
              average = <span style={{ color: MEANS, textShadow: glowText(MEANS, 0.5) }}>{AVGS[cur].toFixed(1)}</span>
            </div>
          </Pop>
          <Pop at={AVGW + 20} x={540} y={720} from="up" dist={10}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>
              SAMPLE <span style={{ fontFamily: theme.fonts.mono, color: C.text }}>{Math.max(1, shown)}</span> OF {NS}
            </div>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {frame >= TEN - 6 ? (
        <>
          <div style={{ position: "absolute", left: HX0 - 10, top: BASE + 2, width: (HX1 - HX0 + 20) * ease(frame, [TEN, TEN + 14], [0, 1]), height: 4, background: alpha(C.text, 0.4) }} />
          {[1, 2, 3, 4, 5, 6].map((v) => (
            <div key={v} style={{ position: "absolute", left: HX0 + ((v - 1) / 5) * (HX1 - HX0), top: BASE + 32, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: C.dim, opacity: ease(frame, [TEN + 4, TEN + 14], [0, 1]) }}>{v}</div>
          ))}
          {AVGS.slice(0, shown).map((a, i) => {
            const b = binOf(a);
            const x = HX0 + (b + 0.5) * BW;
            const y = BASE - (SLOT[i] + 0.5) * DOT;
            const tDrop = t0 + (i / NS) * (t1 - t0);
            const d = ease(frame, [tDrop, tDrop + 6], [0, 1], theme.ease.in);
            return <div key={i} style={{ position: "absolute", left: x - DOT / 2 + 1, top: interpolate(d, [0, 1], [770, y - DOT / 2]), width: DOT - 2, height: DOT - 2, borderRadius: DOT / 2, background: MEANS, boxShadow: `0 0 6px ${alpha(MEANS, 0.7)}` }} />;
          })}
          {bell > 0.01 ? <Bell g={g} mu={3.5} sigma={DICE_SD / Math.sqrt(10)} p={bell} color={C.text} fill={0} width={5} /> : null}
        </>
      ) : null}
      {slam > 0.001 && title < 0.5 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(slam, [0, 1], [1.7, 1])})`, opacity: Math.min(1, slam * 2) * (1 - title * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 150, letterSpacing: "-0.02em", lineHeight: 1 }}>
          <span style={{ background: `linear-gradient(180deg, #FFFFFF, ${MEANS})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 26px ${alpha(MEANS, 0.55)})` }}>A BELL!</span>
        </div>
      ) : null}
      <Burst at={BELLW} x={540} y={1000} color={MEANS} count={22} radius={340} seed={7} />
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 80, color: C.text }}>THE CENTRAL</div>
          <div style={{ fontSize: 96, background: `linear-gradient(90deg, ${MEANS}, ${RAW})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(MEANS, 0.5)})`, whiteSpace: "nowrap" }}>LIMIT THEOREM</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
