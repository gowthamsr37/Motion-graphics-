// SCENE 1 — HOOK. Three research papers fan in, each stamped "p < 0.05" → BUT WHAT DOES IT MEAN? → THE p-VALUE.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, exitP, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const NULLC = C.cyan; // "if nothing were going on" (the fair coin, the null)
export const PV = C.violet; // the p-value itself
export const EXT = C.orange; // extreme / surprising results (the tail)
export const LINE = C.green; // the 0.05 line, the right reading

export const FLIPS: ("H" | "T")[] = ["H", "H", "H", "T", "H", "H", "H", "H", "H", "H"];
export const SIXROW: ("H" | "T")[] = ["H", "T", "H", "H", "T", "H", "T", "H", "H", "T"];

// "p < 0.05" in the series fonts: italic p, mono number
export const PLess: React.FC<{ v: string; size: number; color?: string; op?: string }> = ({ v, size, color = PV, op = "<" }) => (
  <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size, color: C.text, whiteSpace: "nowrap" }}>
    <span style={{ fontStyle: "italic", color, textShadow: glowText(color, 0.5) }}>p</span> {op} <span style={{ fontFamily: theme.fonts.mono }}>{v}</span>
  </span>
);

const Paper: React.FC<{ title: string; stamp: number }> = ({ title, stamp }) => (
  <div style={{ position: "relative", width: 280, height: 360, borderRadius: 18, background: "linear-gradient(180deg, rgba(36,52,120,0.95), rgba(18,30,78,0.95))", border: `2px solid ${C.edge}`, boxShadow: "0 18px 40px rgba(0,0,0,0.35)" }}>
    <div style={{ position: "absolute", left: 24, top: 26, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color: C.dim }}>{title}</div>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} style={{ position: "absolute", left: 24, top: 70 + i * 26, width: i === 6 ? 120 : i % 3 === 2 ? 190 : 230, height: 9, borderRadius: 5, background: alpha(C.text, 0.18) }} />
    ))}
    {stamp > 0.01 ? (
      <div style={{ position: "absolute", left: 140, top: 290, transform: `translate(-50%, -50%) rotate(-8deg) scale(${interpolate(Math.min(1, stamp), [0, 1], [1.8, 1])})`, opacity: Math.min(1, stamp * 2), padding: "6px 16px", borderRadius: 12, border: `4px solid ${LINE}`, background: alpha(LINE, 0.16) }}>
        <PLess v="0.05" size={38} color={LINE} />
      </div>
    ) : null}
  </div>
);

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const PAPERS = s.cueS(0, "papers");
  const P = s.cueS(0, "p");
  const BUT = s.sent(1).from;
  const PVW = s.cueS(1, "p-value");
  const ACT = s.cueS(1, "actually");
  const SIMPLE = s.cueS(1, "simple.");
  const out = exitP(frame, BUT - 4, 10);
  const title = spr(PVW - 3, theme.spring.pop);
  const papers = [
    { t: "MEDICINE", x: 270, r: -8 },
    { t: "PSYCHOLOGY", x: 540, r: 0 },
    { t: "MARKETING", x: 810, r: 8 },
  ];
  return (
    <AbsoluteFill>
      {out < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 - out * 0.08})` }}>
          {papers.map((pp, i) => {
            const p = spr(PAPERS - 10 + i * 5, theme.spring.bouncy);
            if (p <= 0.001) return null;
            return (
              <div key={pp.t} style={{ position: "absolute", left: pp.x, top: 760 + (i === 1 ? -30 : 0), transform: `translate(-50%, -50%) rotate(${pp.r}deg) translateY(${(1 - Math.min(1, p)) * 120}px)`, opacity: Math.min(1, p * 2) }}>
                <Paper title={pp.t} stamp={spr(P - 2 + i * 5, theme.spring.pop)} />
              </div>
            );
          })}
          <Pop at={P + 16} x={540} y={420} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
              EVERY PAPER SAYS <PLess v="0.05" size={58} color={LINE} />
            </div>
          </Pop>
        </AbsoluteFill>
      ) : null}
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 80, color: C.text }}>THE</div>
          <div style={{ fontSize: 130, background: `linear-gradient(90deg, ${PV}, ${EXT})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(PV, 0.5)})`, whiteSpace: "nowrap" }}>
            <span style={{ fontStyle: "italic" }}>p</span>-VALUE
          </div>
        </div>
      ) : null}
      <Burst at={PVW} x={540} y={470} color={PV} count={22} radius={340} seed={5} />
      <Pop at={BUT + 4} x={540} y={790} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ padding: "12px 28px", borderRadius: 999, border: `3px solid ${LINE}`, background: alpha(LINE, 0.14) }}>
          <PLess v="0.05" size={56} color={LINE} />
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.yellow }}> ?</span>
        </div>
      </Pop>
      <Pop at={ACT - 4} x={540} y={960} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          WHAT DOES IT <span style={{ color: EXT, textShadow: glowText(EXT, 0.5) }}>ACTUALLY</span> MEAN?
        </div>
      </Pop>
      <Pop at={SIMPLE - 6} x={540} y={1130} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: C.dim, whiteSpace: "nowrap" }}>EXPLAINED SIMPLY</div>
      </Pop>
    </AbsoluteFill>
  );
};
