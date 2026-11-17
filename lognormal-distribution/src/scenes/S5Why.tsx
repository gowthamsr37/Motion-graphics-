// SCENE 5 — WHY IT HAPPENS: prices grow by percentages. +10% adds 2 lakh to a 20-lakh flat but 20 lakh to a 2-crore
// villa. Then 5 years of 10% growth: the flat 20 → 32 lakh (+12), the villa 200 → 322 lakh (+122): big values stretch out.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { House } from "../components/Icons";
import { Money, SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { GROW, RAW } from "./S1Hook";

const C = theme.colors;
const BASE = 1180;
const PX = 1.35; // pixels per lakh
const COL = [330, 760];
const START = [20, 200];

export const S5Why: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const PCT = s.cueS(0, "percentages.");
  const FLAT = s.cueS(1, "flat,");
  const VILLA = s.cueS(1, "villa.");
  const PLUS2 = s.cueS(1, "2");
  const PLUS20 = s.cueS(1, "20", 1);
  const MULT = s.cueS(2, "multiplies,");
  const STRETCH = s.cueS(2, "stretches");
  // year 1 (+10%) during sentence 1, then years 2–5 on "multiplies"
  const y1 = [ease(frame, [PLUS2 - 4, PLUS2 + 10], [0, 1]), ease(frame, [PLUS20 - 4, PLUS20 + 10], [0, 1])];
  const more = ease(frame, [MULT, MULT + 40], [0, 4]);
  const value = (i: number) => START[i] * Math.pow(1.1, y1[i] + more);
  const year = Math.min(5, Math.floor(1 + more + 0.0001));

  return (
    <AbsoluteFill>
      <SceneTitle label="WHY IT HAPPENS" color={GROW} at={2} />
      <Pop at={PCT - 6} x={540} y={430} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Pill label="PRICES GROW BY PERCENTAGES" color={GROW} size={32} glow={0.4} />
      </Pop>
      {[0, 1].map((i) => {
        const p = spr((i ? VILLA : FLAT) - 8, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const v = value(i);
        const h = v * PX * Math.min(1, p);
        const base0 = START[i] * PX;
        const c = i ? RAW : C.cyan;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: COL[i] - 70, top: BASE - h, width: 140, height: h, borderRadius: "12px 12px 3px 3px", background: alpha(c, 0.35), border: `3px solid ${c}`, boxSizing: "border-box" }} />
            {/* the growth part */}
            {h > base0 ? <div style={{ position: "absolute", left: COL[i] - 70, top: BASE - h, width: 140, height: h - base0, borderRadius: "12px 12px 0 0", background: alpha(GROW, 0.65), boxShadow: `0 0 16px ${alpha(GROW, 0.6)}` }} /> : null}
            <div style={{ position: "absolute", left: COL[i], top: BASE + 46, transform: "translate(-50%, -50%) scale(1)", opacity: Math.min(1, p * 2), display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <House w={i ? 110 : 64} color={c} big={i === 1} />
            </div>
            <div style={{ position: "absolute", left: COL[i], top: BASE + 120, transform: "translate(-50%, -50%)", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.dim, whiteSpace: "nowrap" }}>{i ? "2 CRORE VILLA" : "20 LAKH FLAT"}</div>
            <div style={{ position: "absolute", left: COL[i], top: BASE - h - 34, transform: "translate(-50%, -50%)", opacity: Math.min(1, p * 2) }}>
              <Money v={`${Math.round(v)} L`} size={30} color={C.text} />
            </div>
          </React.Fragment>
        );
      })}
      <Pop at={PLUS2 - 2} out={MULT - 2} x={COL[0] + 130} y={BASE - 60} from="left" dist={10}>
        <div style={{ transform: "translateX(50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: GROW, textShadow: glowText(GROW, 0.5), whiteSpace: "nowrap" }}>+2 L</div>
      </Pop>
      <Pop at={PLUS20 - 2} out={MULT - 2} x={COL[1] - 120} y={BASE - 300} from="right" dist={10}>
        <div style={{ transform: "translateX(-50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: GROW, textShadow: glowText(GROW, 0.5), whiteSpace: "nowrap" }}>+20 L</div>
      </Pop>
      <Pop at={MULT + 42} x={COL[0] + 130} y={BASE - 80} from="left" dist={10} cfg={theme.spring.bouncy}>
        <div style={{ transform: "translateX(50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: GROW, textShadow: glowText(GROW, 0.5), whiteSpace: "nowrap" }}>+12 L</div>
      </Pop>
      <Pop at={MULT + 46} x={COL[1] - 120} y={BASE - 360} from="right" dist={10} cfg={theme.spring.bouncy}>
        <div style={{ transform: "translateX(-50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: GROW, textShadow: glowText(GROW, 0.5), whiteSpace: "nowrap" }}>+122 L</div>
      </Pop>
      {frame >= MULT ? (
        <div style={{ position: "absolute", left: 540, top: 530, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.dim, opacity: ease(frame, [MULT, MULT + 6], [0, 1]) }}>
          +10% A YEAR · YEAR <span style={{ color: GROW }}>{year}</span>
        </div>
      ) : null}
      <Pop at={STRETCH - 2} x={540} y={600} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          BIG VALUES <span style={{ color: RAW, textShadow: glowText(RAW, 0.5) }}>STRETCH OUT</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
