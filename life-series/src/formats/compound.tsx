// 1% better every day: 1.01^365 = 37.8 vs 0.99^365 = 0.03, then what the habit adds up to in a year.
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme as T } from "../lib/theme";
import { ease, EndCard, fmt, Hand, Sfx, StageExit, Title, Wobble } from "../lib/ui";
import { FormatModule, Post } from "../types";

const D0 = 70, D1 = 250, STAT = 280, END = 380;
const X0 = 110, X1 = 880, Y0 = 760, Y1 = 120, VMAX = 40;
const X = (d: number) => X0 + ((X1 - X0) * d) / 365;
const Y = (v: number) => Y0 - ((Y0 - Y1) * v) / VMAX;
const line = (base: number, upTo: number) => {
  const pts: string[] = [];
  for (let d = 0; d <= upTo; d += 2) pts.push(`${d ? "L" : "M"}${X(d).toFixed(1)},${Y(base ** d).toFixed(1)}`);
  return pts.join(" ");
};

const Comp: React.FC<{ p: Post; accent: string }> = ({ p, accent }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = p.compound!;
  const day = Math.round(ease(f, D0, D1, 0, 365, (t) => t * t * (3 - 2 * t)));
  const st = spring({ frame: f - STAT, fps, config: T.spring.pop });
  const axes = ease(f, 30, 50, 0, 1, T.ease.inOut);
  return (
    <>
      <StageExit at={END}>
        <Title text={p.title} />
        <div style={{ position: "absolute", top: 470, left: 60, right: 60, fontFamily: T.fonts.hand, fontSize: 50, color: T.inkSoft, opacity: ease(f, 18, 30, 0, 1) }}>{d.habit}</div>
        <svg viewBox="0 0 960 860" width={960} height={860} style={{ position: "absolute", top: 560, left: 60, overflow: "visible" }}>
          <defs><Wobble id="wc" scale={2.6} /></defs>
          <g filter="url(#wc)">
            <path d={`M${X0},${Y1 - 30} L${X0},${Y0} L${X1 + 20},${Y0}`} fill="none" stroke={T.ink} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - axes} />
            <Hand x={X1} y={Y0 + 50} size={38} anchor="end" show={axes}>days</Hand>
            <Hand x={X0} y={Y0 + 50} size={38} anchor="middle" show={axes}>0</Hand>
            {day > 0 && <path d={line(0.99, day)} fill="none" stroke={T.inkSoft} strokeWidth={5} strokeLinecap="round" strokeDasharray="12 10" />}
            {day > 0 && <path d={line(1.01, day)} fill="none" stroke={accent} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />}
            {day > 0 && <circle cx={X(day)} cy={Y(1.01 ** day)} r={10} fill={accent} stroke={T.ink} strokeWidth={3} />}
            {day > 0 && day < 340 && (
              <text x={Math.min(X(day) - 18, 760)} y={Y(1.01 ** day) - 22} textAnchor="end" fontFamily={T.fonts.hand} fontSize={48} fill={accent} stroke={T.card} strokeWidth={8} paintOrder="stroke">{(1.01 ** day).toFixed(day > 200 ? 1 : 2)}×</text>
            )}
            <text x={X0 + 30} y={170} fontFamily={T.fonts.title} fontSize={64} fill={T.ink} opacity={ease(f, D0 - 10, D0, 0, 1)}>Day {day}</text>
            <Hand x={X1 - 10} y={Y0 - 30} size={36} anchor="end" color={T.inkSoft} show={ease(f, D1, D1 + 12, 0, 1)}>1% worse every day: 0.03×</Hand>
            <Hand x={X1 - 10} y={Y1 - 30} size={40} anchor="end" color={accent} show={ease(f, D1, D1 + 12, 0, 1)}>1% better every day: 37.8×</Hand>
          </g>
        </svg>
        <div style={{ position: "absolute", top: 1450, left: 60, right: 60, textAlign: "center", opacity: Math.min(1, st * 1.3), transform: `translateY(${(1 - st) * 30}px) scale(${0.85 + 0.15 * st})` }}>
          <div style={{ display: "inline-block", background: T.card, border: `5px solid ${T.ink}`, borderRadius: 18, padding: "18px 34px", fontFamily: T.fonts.hand, fontSize: 52, color: T.ink, transform: "rotate(-1.5deg)" }}>
            {fmt(d.perDay)} {d.perDay === 1 ? d.unitOne : d.unit} a day = <span style={{ color: accent }}>{fmt(d.perDay * 365)} {d.unit}</span> a year
          </div>
        </div>
      </StageExit>
      <EndCard at={END} lines={p.end} accent={accent} />
      <Sfx at={0} name="whoosh" vol={0.3} />
      <Sfx at={30} name="scribble" vol={0.25} />
      <Sfx at={D0} name="riser" vol={0.25} />
      {Array.from({ length: 6 }, (_, i) => <Sfx key={i} at={D0 + i * 30} name="tock" vol={0.25} />)}
      <Sfx at={D1} name="success" vol={0.6} />
      <Sfx at={STAT} name="pop" vol={0.6} />
      <Sfx at={STAT} name="ding" vol={0.4} />
      <Sfx at={END - 4} name="whoosh" vol={0.3} />
    </>
  );
};

export const compound: FormatModule = { duration: () => END + 120, cover: () => END - 15, Comp };
