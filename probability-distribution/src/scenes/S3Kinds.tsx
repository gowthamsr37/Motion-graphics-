// SCENE 3 — TWO KINDS. PROBABILITY DISTRIBUTION splits into DISCRETE (things you count: dice → bars, cyan) and
// CONTINUOUS (things you measure: height → a smooth curve, green), the same colours as the series' data types.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { RulerGlyph } from "../components/Icons";
import { ease, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { Die, MiniBars } from "../components/Prob";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { CONT, DISC, PROB } from "./S1Hook";

const C = theme.colors;

export const S3Kinds: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const DW = s.cueS(1, "Discrete,");
  const CW = s.cueS(1, "continuous,");
  const COUNT = s.cueS(1, "count.");
  const MEAS = s.cueS(1, "measure.");
  const cards = [
    { x: 300, at: DW, c: DISC, t: "DISCRETE", sub: "THINGS YOU COUNT", hint: COUNT },
    { x: 780, at: CW, c: CONT, t: "CONTINUOUS", sub: "THINGS YOU MEASURE", hint: MEAS },
  ];
  const g: BellGeo = { x0: 650, x1: 910, vmin: -3.2, vmax: 3.2, base: 1010, peakH: 150, sigmaRef: 1 };

  return (
    <AbsoluteFill>
      <Pop at={4} x={540} y={380} from="scale" scaleFrom={0.5} cfg={theme.spring.bouncy}>
        <Pill label="PROBABILITY DISTRIBUTION" color={PROB} size={36} glow={0.6} />
      </Pop>
      <Pop at={s.sent(0).from + 4} x={540} y={1200} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.24em", color: C.dim, whiteSpace: "nowrap" }}>TWO KINDS</div>
      </Pop>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {cards.map((k) => {
          const p = ease(frame, [k.at - 10, k.at + 6], [0, 1], theme.ease.inOut);
          return <path key={k.t} d={`M540 420 C540 520 ${k.x} 520 ${k.x} 590`} stroke={k.c} strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${k.c})` }} />;
        })}
      </svg>
      {cards.map((k, i) => {
        const p = spr(k.at - 6, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const hint = spr(k.hint - 6, theme.spring.pop);
        return (
          <div key={k.t} style={{ position: "absolute", left: k.x, top: 860, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), width: 440, height: 540, boxSizing: "border-box", borderRadius: 34, background: `linear-gradient(180deg, ${alpha(k.c, 0.2)}, rgba(14,24,64,0.92) 55%)`, border: `3px solid ${k.c}`, boxShadow: `0 0 30px ${alpha(k.c, 0.3)}` }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: k.c, whiteSpace: "nowrap" }}>{k.t}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 102, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.text, whiteSpace: "nowrap", opacity: Math.min(1, hint * 2) }}>{k.sub}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 160, display: "flex", justifyContent: "center", gap: 14 }}>
              {i === 0 ? [2, 5, 3].map((v) => <Die key={v} value={v} size={78} color={DISC} />) : <RulerGlyph size={100} color={CONT} />}
            </div>
            {i === 0 ? (
              <div style={{ position: "absolute", left: 50, top: 300 }}>
                <MiniBars w={340} h={150} vals={[0.6, 0.6, 0.6, 0.6, 0.6, 0.6]} color={DISC} p={ease(frame, [k.at + 4, k.at + 20], [0, 1])} />
              </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, right: 0, top: 486, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: C.dim }}>{i === 0 ? "BARS" : "A SMOOTH CURVE"}</div>
          </div>
        );
      })}
      {spr(CW - 6, theme.spring.bouncy) > 0.3 ? <Bell g={g} mu={0} sigma={1} p={ease(frame, [CW + 4, CW + 22], [0, 1], theme.ease.inOut)} color={CONT} fill={0.25} width={5} /> : null}
    </AbsoluteFill>
  );
};
