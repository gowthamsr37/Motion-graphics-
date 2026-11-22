// SCENE 8 — THE COMMON THREAD. Five mini panels (one per use): a skewed / yes-no RAW shape morphing into a BELL; MESSY DATA,
// BUT AVERAGES BEHAVE; then z-TEST · t-TEST · CONFIDENCE INTERVALS chips: ALL LEAN ON THE CLT.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CurveIcon } from "../components/Explain";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { USES } from "../components/Uses";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S8Thread: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s8");
  const AV = s.cueS(0, "averages");
  const morph = ease(frame, [AV - 10, AV + 20], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <SceneTitle label="THE COMMON THREAD" color={C.violet} at={2} />
      {USES.map((u, i) => {
        const p = spr(4 + i * 4, theme.spring.bouncy);
        const y = 450 + i * 110;
        const raw = (x: number) => (i % 2 === 0 ? (x < 0.25 ? 0.9 : x > 0.75 ? 0.7 : 0.05) : Math.max(0, x * 4 * Math.exp(-x * 7) * 2.2));
        const bell = (x: number) => Math.exp(-((x - 0.5) ** 2) / 0.02);
        return p > 0.001 ? (
          <div key={u.n} style={{ position: "absolute", left: 90, top: y, width: 900, height: 92, boxSizing: "border-box", borderRadius: 22, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(u.c, 0.6)}`, display: "flex", alignItems: "center", gap: 24, paddingLeft: 24, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * -40}px)` }}>
            <u.Icon size={60} color={u.c} />
            <div style={{ width: 280, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text }}>{u.short}</div>
            <CurveIcon color={C.dim} f={(x) => raw(x) * (1 - morph) + bell(x) * morph} w={200} h={60} />
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: morph > 0.5 ? u.c : C.dim }}>{morph > 0.5 ? "AVERAGE: BELL" : "RAW: MESSY"}</div>
          </div>
        ) : null;
      })}
      <Pop at={AV - 4} x={540} y={1050} from="scale" scaleFrom={0.6} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text, whiteSpace: "nowrap" }}>
          MESSY DATA, BUT <span style={{ color: C.violet, textShadow: glowText(C.violet, 0.6) }}>AVERAGES BEHAVE</span>
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1160, display: "flex", justifyContent: "center", gap: 16 }}>
        {["z-TEST", "t-TEST", "CONFIDENCE INTERVALS"].map((t, i) => {
          const k = spr(s.sent(1).from + 10 + i * 8, theme.spring.pop);
          return (
            <div key={t} style={{ opacity: Math.min(1, k * 2), transform: `scale(${interpolate(Math.min(1, k), [0, 1], [0.5, 1])})`, padding: "10px 22px", borderRadius: 999, background: alpha(C.cyan, 0.16), border: `2px solid ${C.cyan}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>{t}</div>
          );
        })}
      </div>
      <Pop at={s.cueS(1, "theorem.") - 6} x={540} y={1270} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.cyan, whiteSpace: "nowrap" }}>ALL OF THEM LEAN ON THE CLT</div>
      </Pop>
    </AbsoluteFill>
  );
};
