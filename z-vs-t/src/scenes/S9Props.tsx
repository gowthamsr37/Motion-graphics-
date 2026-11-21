// SCENE 9 — WHERE z REALLY LIVES: PROPORTIONS. An A/B card: version A 10% vs version B 12% conversion bars; A/B TESTS ·
// POLLS · CONVERSION RATES; the proportion standard error √(p(1 − p) / n) with NO σ NEEDED.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Radical } from "../components/Clt";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { TC, TL, ZC } from "../components/ZT";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Bar: React.FC<{ x: number; pct: number; label: string; c: string; at: number }> = ({ x, pct, label, c, at }) => {
  const frame = useCurrentFrame();
  const k = ease(frame, [at - 6, at + 16], [0, 1], theme.ease.out);
  const h = pct * 26 * k;
  return (
    <>
      <div style={{ position: "absolute", left: x - 70, top: 1010 - h, width: 140, height: h, borderRadius: "16px 16px 0 0", background: `linear-gradient(180deg, ${alpha(c, 0.8)}, ${alpha(c, 0.35)})`, border: `2px solid ${c}` }} />
      <div style={{ position: "absolute", left: x, top: 1010 - h - 54, transform: "translateX(-50%)", opacity: k, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: C.text, textShadow: glowText(c, 0.4) }}>{pct}%</div>
      <div style={{ position: "absolute", left: x, top: 1024, transform: "translateX(-50%)", opacity: k, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: c, whiteSpace: "nowrap" }}>{label}</div>
    </>
  );
};

export const S9Props: React.FC = () => {
  const spr = useSpr();
  const s = useScene("s9");
  const P = s.cueS(0, "Proportions.");
  const AB = s.cueS(1, "A/B");
  const TEN = s.cueS(1, "10%");
  return (
    <AbsoluteFill>
      <SceneTitle label="WHERE z REALLY LIVES" color={ZC} at={2} />
      <Pop at={P - 4} x={540} y={450} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 84, color: ZC, textShadow: glowText(ZC, 0.6), whiteSpace: "nowrap" }}>PROPORTIONS</div>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 540, display: "flex", justifyContent: "center", gap: 16 }}>
        {["A/B TESTS", "POLLS", "CONVERSION RATES"].map((t, i) => {
          const k = spr(AB - 4 + i * 6, theme.spring.pop);
          return (
            <div key={t} style={{ opacity: Math.min(1, k * 2), transform: `translateY(${(1 - Math.min(1, k)) * 14}px)`, padding: "8px 20px", borderRadius: 999, background: alpha(ZC, 0.16), border: `2px solid ${ZC}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: C.text, whiteSpace: "nowrap" }}>{t}</div>
          );
        })}
      </div>
      <Bar x={400} pct={10} label="VERSION A" c={TC} at={TEN} />
      <Bar x={680} pct={12} label="VERSION B" c={TL} at={TEN + 14} />
      <Pop at={s.cueS(1, "z-test.") - 6} x={540} y={1120} from="up" dist={12} cfg={theme.spring.bouncy}>
        <Tag color={ZC} size={30}>
          10% vs 12% CONVERSION: THAT&apos;S A z-TEST
        </Tag>
      </Pop>
      <Pop at={s.sent(2).from - 2} x={540} y={1250} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 30px", borderRadius: 22, background: "rgba(14,24,64,0.9)", border: `2px solid ${alpha(ZC, 0.7)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          SE =
          <Radical color={C.text} size={36}>
            p (1 − p) ÷ n
          </Radical>
          <span style={{ fontSize: 26, color: ZC }}>NO SIGMA NEEDED</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
