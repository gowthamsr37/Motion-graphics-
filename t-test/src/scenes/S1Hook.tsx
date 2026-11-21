// SCENE 1 — HOOK. Brand A and brand B phones: five battery readings each pop in (6 8 7 5 9 / 9 10 8 11 12), the
// batteries drain to their averages (7 h vs 10 h); REAL, OR JUST LUCK?; THE t-TEST title with FORMULA · CALCULATION ·
// t TABLE chips.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, Pop, useSpr } from "../components/Motion";
import { BatteryGlyph } from "../components/Prob";
import { A, B, BA, BB, SE, TAIL } from "../components/TKit";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const Brand: React.FC<{ y: number; name: string; c: string; vals: number[]; at: number; avgAt: number; avg: number }> = ({ y, name, c, vals, at, avgAt, avg }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  const lvl = ease(frame, [at, avgAt + 10], [1, avg / 12], theme.ease.inOut);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 230, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(c, 0.2)}, rgba(14,24,64,0.9) 60%)`, border: `3px solid ${c}`, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * -60}px)`, display: "flex", alignItems: "center", gap: 30, padding: "0 34px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <BatteryGlyph size={110} color={c} level={lvl} />
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: c }}>{name}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 12 }}>
          {vals.map((v, i) => {
            const k = spr(at + 4 + i * 4, theme.spring.pop);
            return (
              <div key={i} style={{ width: 82, height: 62, borderRadius: 16, background: "rgba(10,18,52,0.9)", border: `2px solid ${alpha(c, 0.7)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: C.text, opacity: Math.min(1, k * 2), transform: `scale(${Math.min(1.1, k)})` }}>{v}h</div>
            );
          })}
        </div>
        <div style={{ opacity: Math.min(1, spr(avgAt - 4, theme.spring.pop) * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text }}>
          AVERAGE: <span style={{ fontFamily: theme.fonts.mono, color: c, textShadow: glowText(c, 0.5) }}>{avg} hours</span>
        </div>
      </div>
    </div>
  );
};

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const FIVE = s.cueS(0, "5");
  const AV = s.cueS(0, "7");
  const BV = s.cueS(0, "10.");
  const Q = s.sent(1).from;
  const TT = s.cueS(1, "t-test.");
  const out = ease(frame, [TT - 10, TT], [0, 1]);
  const title = spr(TT - 4, theme.spring.pop);
  const chips = [
    { t: "FORMULA", at: TT + 16, c: BB },
    { t: "CALCULATION", at: TT + 24, c: SE },
    { t: "t TABLE", at: TT + 32, c: TAIL },
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${out * 40}px)` }}>
        <Pop at={s.sent(0).from} x={540} y={380} from="up" dist={10}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
            &ldquo;BRAND B&apos;S BATTERY <span style={{ color: BB }}>LASTS LONGER</span>&rdquo;
          </div>
        </Pop>
        <Brand y={470} name="BRAND A" c={BA} vals={A} at={FIVE} avgAt={AV} avg={7} />
        <Brand y={740} name="BRAND B" c={BB} vals={B} at={FIVE + 14} avgAt={BV} avg={10} />
        <Pop at={Q - 2} x={540} y={1110} from="up" dist={14} cfg={theme.spring.bouncy}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>
            <span style={{ color: BB }}>REAL</span>, OR JUST <span style={{ color: BA }}>LUCK</span>
            <span style={{ color: C.yellow }}>?</span>
          </div>
        </Pop>
      </AbsoluteFill>
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(Math.min(1, title), [0, 1], [1.6, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
          <div style={{ fontSize: 70, color: C.text }}>THE</div>
          <div style={{ fontSize: 190, background: `linear-gradient(90deg, ${BA}, ${BB})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${alpha(BB, 0.5)})` }}>
            <span style={{ fontStyle: "italic" }}>t</span>-TEST
          </div>
        </div>
      ) : null}
      <Burst at={TT} x={540} y={680} color={BB} count={24} radius={380} seed={7} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, display: "flex", justifyContent: "center", gap: 18 }}>
        {chips.map((c) => {
          const k = spr(c.at - 4, theme.spring.pop);
          return (
            <div key={c.t} style={{ opacity: Math.min(1, k * 2), transform: `scale(${interpolate(Math.min(1, k), [0, 1], [0.5, 1])})`, padding: "12px 26px", borderRadius: 999, background: alpha(c.c, 0.2), border: `3px solid ${c.c}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>{c.t}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
