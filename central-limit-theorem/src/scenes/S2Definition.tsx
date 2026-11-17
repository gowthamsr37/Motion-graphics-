// SCENE 2 — THE DEFINITION, in simple words, built line by line on the spoken words:
// 1 take MANY RANDOM SAMPLES · 2 find the AVERAGE of each · 3 the averages form a BELL CURVE ·
// 4 even if the data ISN'T A BELL · 5 big enough samples: 30 OR MORE.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { SceneTitle } from "../components/Kit";
import { ease, Mark, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { AVG, MiniShape, RAW, SAMP } from "./S1Hook";

const C = theme.colors;
const ROW_Y = [520, 665, 810, 955, 1100];

export const S2Definition: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const at = [s.cueS(1, "many"), s.cueS(1, "average"), s.cueS(2, "bell"), s.cueS(2, "even"), s.cueS(3, "30")];
  const rows: { pre: string; key: string; post: string; c: string }[] = [
    { pre: "Take ", key: "MANY RANDOM SAMPLES", post: "", c: SAMP },
    { pre: "Find the ", key: "AVERAGE", post: " of each", c: SAMP },
    { pre: "Averages form a ", key: "BELL CURVE", post: "", c: AVG },
    { pre: "Even if the data ", key: "ISN'T A BELL", post: "", c: RAW },
    { pre: "Samples of ", key: "30 OR MORE", post: "", c: C.violet },
  ];
  const lastDone = s.duration - 30;

  return (
    <AbsoluteFill>
      <SceneTitle label="THE DEFINITION" pill="IN SIMPLE WORDS" color={AVG} at={2} pillAt={s.sent(0).from} />
      {rows.map((r, i) => {
        const ghost = ease(frame, [6 + i * 4, 16 + i * 4], [0, 1]);
        const p = spr(at[i] - 6, theme.spring.bouncy);
        const active = frame >= at[i] - 4 && (i === 4 ? frame < lastDone : frame < at[i + 1] - 4);
        const y = ROW_Y[i];
        const g: BellGeo = { x0: 830, x1: 950, vmin: -3, vmax: 3, base: y + 34, peakH: 70, sigmaRef: 1 };
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 90, top: y - 62, width: 900, height: 124, boxSizing: "border-box", borderRadius: 26, background: p > 0.01 ? `linear-gradient(90deg, ${alpha(r.c, 0.18)}, rgba(14,24,64,0.9) 60%)` : "transparent", border: p > 0.01 ? `3px solid ${active ? r.c : alpha(r.c, 0.5)}` : `3px dashed ${alpha("#F3F7FF", 0.2)}`, boxShadow: active ? `0 0 28px ${alpha(r.c, 0.35)}` : "none", opacity: Math.max(ghost * 0.6, Math.min(1, p * 2)), transform: `translateX(${(1 - Math.min(1, p)) * -40}px) scale(${active ? 1.02 : 1})` }} />
            {p > 0.01 ? (
              <div style={{ position: "absolute", left: 120, top: y, transform: "translateY(-50%)", opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 54, height: 54, borderRadius: 27, flexShrink: 0, background: frame >= lastDone ? C.green : r.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.ink }}>
                  {frame >= lastDone ? <Mark kind="check" at={lastDone + i * 3} size={34} color={C.ink} width={8} /> : i + 1}
                </div>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
                  {r.pre}
                  <span style={{ fontWeight: 800, color: r.c, textShadow: active ? glowText(r.c, 0.6) : undefined }}>{r.key}</span>
                  {r.post}
                </div>
              </div>
            ) : null}
            {/* a small picture per line */}
            {p > 0.01 ? (
              <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 2) }}>
                {i === 0 ? (
                  [0, 1, 2].map((k) => (
                    <div key={k} style={{ position: "absolute", left: 806 + k * 50, top: y - 22, width: 44, height: 44, borderRadius: 22, border: `3px solid ${SAMP}`, background: alpha(SAMP, 0.2), transform: `scale(${spr(at[0] + k * 4, theme.spring.pop)})` }} />
                  ))
                ) : i === 1 ? (
                  <div style={{ position: "absolute", left: 890, top: y, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: AVG, whiteSpace: "nowrap" }}>46 · 36 · 40</div>
                ) : i === 2 ? (
                  <Bell g={g} mu={0} sigma={1} p={ease(frame, [at[2], at[2] + 18], [0, 1], theme.ease.inOut)} color={AVG} fill={0.3} width={4} />
                ) : i === 3 ? (
                  <MiniShape kind={0} x={890} y={y} w={120} h={70} color={RAW} p={ease(frame, [at[3], at[3] + 14], [0, 1])} />
                ) : (
                  <div style={{ position: "absolute", left: 890, top: y, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: C.violet, whiteSpace: "nowrap" }}>n = 30+</div>
                )}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      {(() => {
        const p = spr(lastDone, theme.spring.pop);
        if (p <= 0.001) return null;
        return (
          <div style={{ position: "absolute", left: 540, top: 1240, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: C.text, whiteSpace: "nowrap" }}>
            THAT&apos;S THE <span style={{ color: AVG }}>CENTRAL LIMIT THEOREM</span>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
