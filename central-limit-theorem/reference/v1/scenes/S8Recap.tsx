// SCENE 8 — THE COMPLETE PICTURE. Many samples → their means · a bell around the true mean, whatever the original shape ·
// bigger samples, a narrower bell.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { SceneTitle } from "../components/Kit";
import { useSpr } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { MEANS, RAW, SKEW } from "./S1Hook";

const C = theme.colors;
const CARD_Y = [580, 850, 1120];

export const S8Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const at = [s.sent(1).from, s.sent(2).from, s.sent(3).from];
  const active = frame >= at[2] - 4 ? 2 : frame >= at[1] - 4 ? 1 : frame >= at[0] - 4 ? 0 : -1;
  const cards = [
    { c: RAW, t1: "MANY SAMPLES · MEANS", t2: "average each sample" },
    { c: MEANS, t1: "A BELL, ANY SHAPE IN", t2: "centred on the true mean" },
    { c: C.violet, t1: "BIGGER n = NARROWER", t2: "spread = the standard error" },
  ];

  return (
    <AbsoluteFill>
      <SceneTitle label="THE COMPLETE PICTURE" color={MEANS} at={2} pill="CENTRAL LIMIT THEOREM" pillAt={s.sent(0).from} />
      {cards.map((k, i) => {
        const p = spr(at[i] - 6, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const y = CARD_Y[i];
        const on = active === i;
        const sw = spr(at[i] + 6, theme.spring.smooth);
        const g: BellGeo = { x0: 130, x1: 400, vmin: -3.2, vmax: 3.2, base: y + 70, peakH: 110, sigmaRef: 1 };
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 2) * (on ? 1 : 0.72), transform: `translateX(${(1 - p) * -60}px)` }}>
            <div style={{ position: "absolute", left: 90, top: y - 115, width: 900, height: 230, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(k.c, 0.18)}, rgba(14,24,64,0.9) 50%)`, border: `3px solid ${on ? k.c : alpha(k.c, 0.5)}`, boxShadow: on ? `0 0 34px ${alpha(k.c, 0.35)}` : "none" }} />
            {i === 0 ? (
              <>
                {[0, 1, 2].map((j) => (
                  <div key={j} style={{ position: "absolute", left: 140 + j * 86, top: y - 60, width: 66, height: 66, borderRadius: 33, border: `3px solid ${RAW}`, background: alpha(RAW, 0.15) }} />
                ))}
                {["3.4", "3.7", "3.2"].map((v, j) => (
                  <div key={v} style={{ position: "absolute", left: 173 + j * 86, top: y + 40, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: MEANS, opacity: sw }}>{v}</div>
                ))}
              </>
            ) : i === 1 ? (
              <>
                <svg width={130} height={90} viewBox="0 0 130 90" style={{ position: "absolute", left: 120, top: y - 30 }}>
                  <path d={`M0 88 ${Array.from({ length: 30 }, (_, j) => `L${(j / 29) * 130} ${88 - Math.exp(-j / 6) * 80}`).join(" ")} L130 88 Z`} fill={alpha(SKEW, 0.35)} stroke={SKEW} strokeWidth={3} />
                </svg>
                <Bell g={{ ...g, x0: 270, x1: 410 }} mu={0} sigma={1} p={sw} color={MEANS} fill={0.3} width={4} />
              </>
            ) : (
              <>
                <Bell g={g} mu={0} sigma={1} color="#A3B0D6" fill={0} width={3} dashed />
                <Bell g={{ ...g, peakH: 110 }} mu={0} sigma={1 - 0.6 * sw} color={C.violet} fill={0.25} width={4} />
              </>
            )}
            <div style={{ position: "absolute", left: 450, top: y, transform: "translateY(-50%)" }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: k.c, whiteSpace: "nowrap", lineHeight: 1.1 }}>{k.t1}</div>
              <div style={{ marginTop: 8, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 26, color: C.dim, whiteSpace: "nowrap" }}>{k.t2}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
