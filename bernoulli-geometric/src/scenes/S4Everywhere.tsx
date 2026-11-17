// SCENE 4 — YES OR NO, EVERYWHERE. Three cards (CLICK? SPAM? BUY?) with YES / NO; a model outputs the chance of a yes
// (72%); then many tries counted → the binomial (10 tries, 3 yeses; binomial bars).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BarsIcon } from "../components/Explain";
import { Arrow } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { ease, Mark, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { AVG, NO, TRY, YES } from "./S1Hook";

const C = theme.colors;
const CARDS = [
  { q: "CLICKED?", tok: "click?", x: 220 },
  { q: "SPAM?", tok: "spam?", x: 540 },
  { q: "WILL BUY?", tok: "buy?", x: 860 },
];
const TRIES = [0, 1, 0, 0, 1, 0, 0, 0, 1, 0];

export const S4Everywhere: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const MODEL = s.sent(2).from;
  const CHANCE = s.cueS(2, "chance");
  const REPEAT = s.sent(3).from;
  const BIN = s.cueS(3, "binomial");
  const meter = ease(frame, [CHANCE - 4, CHANCE + 20], [0, 0.72], theme.ease.out);
  return (
    <AbsoluteFill>
      <SceneTitle label="YES OR NO, EVERYWHERE" color={YES} at={2} />
      {CARDS.map((c, i) => {
        const p = spr(s.cueS(1, c.tok) - 8, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <div key={c.q} style={{ position: "absolute", left: c.x, top: 520, width: 280, height: 180, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 24, background: "rgba(14,24,64,0.92)", border: `3px solid ${alpha(TRY, 0.7)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text }}>{c.q}</div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ padding: "6px 18px", borderRadius: 999, background: alpha(YES, 0.25), border: `2px solid ${YES}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, color: C.text }}>YES = 1</div>
              <div style={{ padding: "6px 18px", borderRadius: 999, background: alpha(NO, 0.2), border: `2px solid ${NO}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, color: C.text }}>NO = 0</div>
            </div>
          </div>
        );
      })}
      {/* a model predicts the chance of a yes */}
      <Pop at={MODEL - 2} x={540} y={800} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ padding: "16px 30px", borderRadius: 20, background: alpha(AVG, 0.2), border: `3px solid ${AVG}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text }}>ML MODEL</div>
          <Arrow size={50} color={C.dim} />
          <div style={{ width: 300 }}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: C.dim }}>CHANCE OF A YES</div>
            <div style={{ marginTop: 8, height: 30, borderRadius: 15, background: alpha(C.text, 0.12), overflow: "hidden" }}>
              <div style={{ width: `${meter * 100}%`, height: "100%", borderRadius: 15, background: YES, boxShadow: `0 0 16px ${YES}` }} />
            </div>
            <div style={{ marginTop: 6, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: YES, textShadow: glowText(YES, 0.4) }}>{Math.round(meter * 100)}%</div>
          </div>
        </div>
      </Pop>
      {/* many tries, counted → binomial */}
      {TRIES.map((t, i) => {
        const p = spr(REPEAT + 2 + i * 3, theme.spring.pop);
        if (p <= 0.001) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 175 + i * 64, top: 1050, transform: `translate(-50%, -50%) scale(${p})`, width: 52, height: 52, borderRadius: 14, background: alpha(t ? YES : NO, 0.2), border: `3px solid ${t ? YES : NO}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Mark kind={t ? "check" : "cross"} at={REPEAT + 4 + i * 3} size={28} color={t ? YES : NO} width={6} />
          </div>
        );
      })}
      <Pop at={BIN - 6} x={540} y={1170} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
          COUNT THE YESES <Arrow size={36} color={C.dim} /> <span style={{ color: AVG }}>BINOMIAL</span>
          <BarsIcon color={AVG} vals={[1, 4, 9, 13, 11, 6, 2]} w={110} h={50} />
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
