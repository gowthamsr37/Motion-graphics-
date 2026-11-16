// SCENE 8 — THE COMPLETE PICTURE. Population = everyone, sample = who you measure · the sample mean estimates the truth
// and steadies as the sample grows · keep it random, and use n − 1 for the spread.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { pick } from "../components/Sampling";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { POP, SAMP, TRUTH } from "./S1Hook";

const C = theme.colors;
const CARD_Y = [580, 850, 1120];
const RND = pick(36, 7, 5);

const MiniCircles: React.FC<{ y: number; p: number }> = ({ y, p }) => (
  <>
    <div style={{ position: "absolute", left: 140, top: y - 70, width: 140, height: 140, borderRadius: 70, border: `3px solid ${POP}`, background: alpha(POP, 0.15) }} />
    <div style={{ position: "absolute", left: 300, top: y - 10, width: 70 * p, height: 70 * p, marginLeft: 35 * (1 - p), marginTop: 35 * (1 - p), borderRadius: 35, border: `3px solid ${SAMP}`, background: alpha(SAMP, 0.2) }} />
  </>
);

const MiniTicks: React.FC<{ y: number; p: number }> = ({ y, p }) => (
  <>
    <div style={{ position: "absolute", left: 255, top: y - 70, height: 140, borderLeft: `3px dashed ${TRUTH}` }} />
    {[
      { yy: y - 30, xs: [-80, 60, -40, 100, 20], c: C.orange },
      { yy: y + 40, xs: [-14, 10, -6, 16, 4], c: TRUTH },
    ].map((r, i) => (
      <React.Fragment key={i}>
        <div style={{ position: "absolute", left: 130, top: r.yy, width: 250, height: 3, background: alpha(C.text, 0.35) }} />
        {r.xs.map((x, j) => (
          <div key={j} style={{ position: "absolute", left: 255 + x * p - 3, top: r.yy - 22, width: 6, height: 22, borderRadius: 3, background: SAMP }} />
        ))}
      </React.Fragment>
    ))}
  </>
);

const MiniRandom: React.FC<{ y: number; p: number }> = ({ y, p }) => (
  <>
    {Array.from({ length: 36 }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: 150 + (i % 6) * 22, top: y - 60 + Math.floor(i / 6) * 22, width: 12, height: 12, borderRadius: 6, background: RND.includes(i) && p > 0.5 ? SAMP : alpha("#B9A8FF", 0.5) }} />
    ))}
    <div style={{ position: "absolute", left: 300, top: y - 20, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: TRUTH, opacity: p, whiteSpace: "nowrap" }}>n-1</div>
  </>
);

export const S8Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const at = [s.sent(1).from, s.sent(2).from, s.sent(3).from];
  const active = frame >= at[2] - 4 ? 2 : frame >= at[1] - 4 ? 1 : frame >= at[0] - 4 ? 0 : -1;
  const cards = [
    { c: POP, t1: "POPULATION vs SAMPLE", t2: "everyone · who you measure" },
    { c: SAMP, t1: "SAMPLE MEAN = GUESS", t2: "steadier as the sample grows" },
    { c: TRUTH, t1: "RANDOM · n - 1", t2: "no bias · a fair spread" },
  ];

  return (
    <AbsoluteFill>
      <SceneTitle label="THE COMPLETE PICTURE" color={SAMP} at={2} pill="SAMPLING" pillAt={s.sent(0).from} />
      {cards.map((k, i) => {
        const p = spr(at[i] - 6, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const y = CARD_Y[i];
        const on = active === i;
        const sw = spr(at[i] + 6, theme.spring.smooth);
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 2) * (on ? 1 : 0.72), transform: `translateX(${(1 - p) * -60}px)` }}>
            <div style={{ position: "absolute", left: 90, top: y - 115, width: 900, height: 230, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(k.c, 0.18)}, rgba(14,24,64,0.9) 50%)`, border: `3px solid ${on ? k.c : alpha(k.c, 0.5)}`, boxShadow: on ? `0 0 34px ${alpha(k.c, 0.35)}` : "none" }} />
            {i === 0 ? <MiniCircles y={y} p={sw} /> : i === 1 ? <MiniTicks y={y} p={sw} /> : <MiniRandom y={y} p={sw} />}
            <div style={{ position: "absolute", left: 440, top: y, transform: "translateY(-50%)" }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: i === 0 ? 36 : 40, color: k.c, whiteSpace: "nowrap", lineHeight: 1.1 }}>{k.t1}</div>
              <div style={{ marginTop: 8, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 26, color: C.dim, whiteSpace: "nowrap" }}>{k.t2}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
