// SCENE 7 — THREE CLASSIC MISTAKES. 1 STOPPING EARLY (peeking raises false alarms) · 2 NO SAMPLE-SIZE PLAN ·
// 3 CHANGING MANY THINGS AT ONCE. Each card gets a red cross.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { BC } from "../components/AB";
import { SceneTitle } from "../components/Kit";
import { Mark, Pop, useSpr } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Mistake: React.FC<{ y: number; at: number; n: number; title: string; sub: string; subAt: number }> = ({ y, at, n, title, sub, subAt }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  const q = spr(subAt - 4, theme.spring.pop);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 190, transform: `translateY(-50%) translateX(${(1 - Math.min(1, p)) * -40}px)`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(90deg, ${alpha(C.red, 0.16)}, rgba(14,24,64,0.92) 60%)`, border: `3px solid ${alpha(C.red, 0.8)}` }}>
      <div style={{ position: "absolute", left: 34, top: 95, transform: "translateY(-50%)", width: 64, height: 64, borderRadius: 32, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.ink }}>{n}</div>
      <div style={{ position: "absolute", left: 128, top: 44, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>{title}</div>
      <div style={{ position: "absolute", left: 128, top: 108, opacity: Math.min(1, q * 2), transform: `translateY(${interpolate(Math.min(1, q), [0, 1], [10, 0])}px)`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.1em", color: BC, whiteSpace: "nowrap" }}>{sub}</div>
      <div style={{ position: "absolute", right: 40, top: 95, transform: "translateY(-50%)" }}>
        <Mark kind="cross" at={at + 8} size={60} color={C.red} width={10} />
      </div>
    </div>
  );
};

export const S7Mistakes: React.FC = () => {
  const s = useScene("s7");
  return (
    <AbsoluteFill>
      <SceneTitle label="3 CLASSIC MISTAKES" color={C.red} at={2} />
      <Pop at={s.sent(0).from + 4} x={540} y={410} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          WATCH OUT FOR <span style={{ color: C.red }}>THESE</span>
        </div>
      </Pop>
      <Mistake y={600} at={s.sent(1).from} n={1} title="STOPPING EARLY" sub="PEEKING RAISES FALSE ALARMS" subAt={s.cueS(1, "Peeking")} />
      <Mistake y={830} at={s.sent(2).from} n={2} title="NO SAMPLE-SIZE PLAN" sub="DECIDE HOW MANY USERS FIRST" subAt={s.sent(2).from + 20} />
      <Mistake y={1060} at={s.cueS(2, "changing")} n={3} title="MANY CHANGES AT ONCE" sub="CHANGE ONE THING AT A TIME" subAt={s.cueS(2, "changing") + 20} />
    </AbsoluteFill>
  );
};
