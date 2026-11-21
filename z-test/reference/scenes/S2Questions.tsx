// SCENE 2 — TWO QUESTIONS. 1 WHAT KIND OF DATA? NUMBERS (you AVERAGE them: weight, time) vs CATEGORIES (you COUNT
// them: tea, coffee). 2 HOW MANY GROUPS? 1 · 2 · 3+ dot clusters.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stopwatch } from "../components/Exp";
import { ChaiCup } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { Pop, useSpr } from "../components/Motion";
import { CAT, G1, G2, G3 } from "../components/Tests";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Q: React.FC<{ n: number; t: string; y: number; at: number }> = ({ n, t, y, at }) => (
  <Pop at={at - 4} x={540} y={y} from="up" dist={12} cfg={theme.spring.bouncy}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
      <span style={{ width: 62, height: 62, borderRadius: 31, background: C.text, color: C.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{n}</span>
      {t}
    </div>
  </Pop>
);

const Kind: React.FC<{ x: number; at: number; c: string; title: string; verb: string; ex: string; icon: React.ReactNode }> = ({ x, at, c, title, verb, ex, icon }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: 640, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), width: 410, height: 270, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(180deg, ${alpha(c, 0.2)}, rgba(14,24,64,0.92))`, border: `3px solid ${c}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      {icon}
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: c }}>{title}</div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 28, color: C.text }}>
        you <span style={{ color: c }}>{verb}</span> them
      </div>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", color: C.dim }}>{ex}</div>
    </div>
  );
};

const Group: React.FC<{ x: number; at: number; n: number; label: string; c: string }> = ({ x, at, n, label, c }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const p = spr(at - 4, theme.spring.pop);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: 1080, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), width: 260, height: 190, boxSizing: "border-box", borderRadius: 26, background: "rgba(14,24,64,0.88)", border: `3px solid ${alpha(c, 0.8)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
      <div style={{ display: "flex", gap: 14 }}>
        {Array.from({ length: n }, (_, g) => (
          <div key={g} style={{ display: "grid", gridTemplateColumns: "repeat(2, 14px)", gap: 5, transform: `translateY(${Math.sin(frame / 10 + g) * 3}px)` }}>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.55 + 0.15 * g }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text }}>{label}</div>
    </div>
  );
};

export const S2Questions: React.FC = () => {
  const s = useScene("s2");
  return (
    <AbsoluteFill>
      <SceneTitle label="TWO QUESTIONS" color={G1} at={2} />
      <Q n={1} t="WHAT KIND OF DATA?" y={430} at={s.cueS(1, "One:")} />
      <Kind x={315} at={s.cueS(1, "Numbers")} c={G1} title="NUMBERS" verb="AVERAGE" ex="WEIGHT · TIME" icon={<Stopwatch size={84} color={G1} frac={0.35} />} />
      <Kind x={765} at={s.cueS(1, "categories")} c={CAT} title="CATEGORIES" verb="COUNT" ex="TEA · COFFEE" icon={<ChaiCup w={96} />} />
      <Q n={2} t="HOW MANY GROUPS?" y={880} at={s.sent(2).from} />
      <Group x={240} at={s.cueS(2, "groups")} n={1} label="1" c={G1} />
      <Group x={540} at={s.cueS(2, "groups") + 6} n={2} label="2" c={G2} />
      <Group x={840} at={s.cueS(2, "groups") + 12} n={3} label="3+" c={G3} />
    </AbsoluteFill>
  );
};
