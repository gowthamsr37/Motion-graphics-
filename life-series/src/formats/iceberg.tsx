// The iceberg: what people see (the tip) vs everything under the water.
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme as T } from "../lib/theme";
import { Arrow, ease, EndCard, Hand, Sfx, StageExit, Title, Wobble } from "../lib/ui";
import { FormatModule, Post } from "../types";

const WL = 300; // water line inside the scene svg
const ITEM0 = 150, GAP = 24;
const endAt = (p: Post) => ITEM0 + p.iceberg!.hidden.length * GAP + 70;

const TIP = "M380,300 L430,215 L455,232 L492,150 L530,205 L552,190 L600,300 Z";
const BODY = "M380,300 L300,360 L250,470 L170,560 L150,700 L110,820 L170,930 L260,1010 L400,1070 L560,1060 L700,1010 L800,920 L850,790 L820,640 L770,520 L700,420 L640,350 L600,300 Z";

const Comp: React.FC<{ p: Post; accent: string }> = ({ p, accent }) => {
  const f = useCurrentFrame();
  const d = p.iceberg!;
  const E = endAt(p);
  const bob = Math.sin(f / 16) * 4;
  const body = ease(f, 96, 128, 0, 1, T.ease.inOut);
  const n = d.hidden.length;
  const step = Math.min(110, 760 / n);
  return (
    <>
      <StageExit at={E}>
        <Title text={p.title} />
        <svg viewBox="0 0 960 1120" width={960} height={1120} style={{ position: "absolute", top: 420, left: 60, overflow: "visible" }}>
          <defs><Wobble id="wi" /></defs>
          <g filter="url(#wi)">
            <rect x={0} y={WL} width={960} height={820} fill={T.water} opacity={ease(f, 16, 34, 0, 1)} />
            <rect x={0} y={WL + 500} width={960} height={320} fill={T.waterDeep} opacity={ease(f, 16, 34, 0, 0.6)} />
            <g transform={`translate(0 ${bob})`}>
              <path d={BODY} fill="#ffffff" stroke={T.ink} strokeWidth={5} strokeLinejoin="round" opacity={0.25 + 0.75 * body} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - body} fillOpacity={body} />
              <path d={TIP} fill="#ffffff" stroke={T.ink} strokeWidth={5} strokeLinejoin="round" opacity={ease(f, 26, 40, 0, 1)} transform={`translate(0 ${ease(f, 26, 44, 60, 0)})`} />
            </g>
            <path d={`M0,${WL} ${Array.from({ length: 25 }, (_, i) => `Q${i * 40 + 20},${WL + 8 * Math.sin(f / 8 + i)} ${(i + 1) * 40},${WL}`).join(" ")}`} fill="none" stroke={T.ink} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, 14, 34, 0, 1, T.ease.inOut)} />
            <Hand x={490} y={110 + bob} size={54} anchor="middle" color={accent} show={ease(f, 44, 56, 0, 1)} weight="script">{d.see}</Hand>
            <Hand x={60} y={190} size={40} show={ease(f, 52, 64, 0, 1)} rot={-5}>What people see</Hand>
            <Arrow from={{ x: 210, y: 210 }} to={{ x: 400, y: 250 }} bend={-0.25} draw={ease(f, 56, 70, 0, 1)} />
            <Hand x={60} y={WL + 60} size={40} show={ease(f, 90, 102, 0, 1)} rot={-4}>What they don't</Hand>
            {d.hidden.map((h, k) => {
              const t = f - (ITEM0 + k * GAP);
              const s = ease(t, 0, 10, 0, 1);
              const y = WL + 160 + k * step + bob;
              return s <= 0 ? null : (
                <g key={k} opacity={Math.min(1, s * 1.4)} transform={`translate(0 ${(1 - s) * 16})`}>
                  <circle cx={480 - 12 - h.length * 9.5} cy={y - 14} r={7} fill={accent} stroke={T.ink} strokeWidth={2} />
                  <text x={480} y={y} textAnchor="middle" fontFamily={T.fonts.hand} fontSize={50} fill={T.ink}>{h}</text>
                </g>
              );
            })}
          </g>
        </svg>
      </StageExit>
      <EndCard at={E} lines={p.end} accent={accent} />
      <Sfx at={0} name="whoosh" vol={0.3} />
      <Sfx at={14} name="whoosh" vol={0.25} />
      <Sfx at={44} name="ding" vol={0.45} />
      <Sfx at={92} name="riser" vol={0.35} />
      <Sfx at={120} name="boom" vol={0.5} />
      {d.hidden.map((_, k) => <Sfx key={k} at={ITEM0 + k * GAP} name="pop" vol={0.45} />)}
      <Sfx at={E - 4} name="whoosh" vol={0.3} />
    </>
  );
};

export const iceberg: FormatModule = { duration: (p) => endAt(p) + 120, cover: (p) => endAt(p) - 15, Comp };
