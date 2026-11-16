// SCENE 5 — SCIENCE. Mean 60, SD 5, you scored 70: (70 − 60) ÷ 5 = 2 → two whole SDs above the mean.
// Then a fair comparison on one z-axis: Maths z = 0.5, Science z = 2 → Science is the stronger result.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Axis, Bell, type BellGeo, curveY, vx } from "../components/Bell";
import { Crown } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { Burst, ease, exitP, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { SUBJ } from "./S1Hook";
import { Worked } from "./Worked";

const C = theme.colors;
const G: BellGeo = { x0: 110, x1: 970, vmin: 41, vmax: 79, base: 930, peakH: 270, sigmaRef: 5 };
const GZ: BellGeo = { x0: 110, x1: 970, vmin: -3.6, vmax: 3.6, base: 930, peakH: 270, sigmaRef: 1 };

export const S5Science: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const TWO = s.sent(3).from;
  const FAIR = s.sent(4).from;
  const STRONG = s.cueS(4, "stronger");
  const out = exitP(frame, FAIR - 10, 10);
  const cmp = ease(frame, [FAIR - 4, FAIR + 12], [0, 1]);
  const marks = [
    { z: 0.5, label: "MATHS", c: SUBJ.maths, at: FAIR + 4, up: 115 },
    { z: 2, label: "SCIENCE", c: SUBJ.science, at: FAIR + 12, up: 110 },
  ];

  return (
    <AbsoluteFill>
      {out < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - out }}>
          <SceneTitle label="WORKED EXAMPLE 2" pill="SCIENCE" color={SUBJ.science} at={2} />
          <Worked
            g={G}
            mu={60}
            sd={5}
            x={70}
            color={SUBJ.science}
            ticks={[45, 50, 55, 60, 65, 70, 75]}
            tMean={s.cueS(0, "60,")}
            tSD={s.cueS(0, "5.")}
            tScore={s.cueS(1, "70")}
            tMinus={s.cueS(1, "minus")}
            tDiff={s.cueS(1, "10.")}
            tDivide={s.cueS(2, "Divided")}
            tResult={s.cueS(2, "2")}
            hops={2}
            zText="2"
          />
          <Pop at={TWO - 2} x={540} y={600} from="up" dist={14} cfg={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
              <span style={{ color: C.green, textShadow: glowText(C.green, 0.5) }}>TWO WHOLE SDs</span> ABOVE
            </div>
          </Pop>
        </AbsoluteFill>
      ) : null}

      {/* the fair comparison: both scores on one z-axis */}
      {cmp > 0.01 ? (
        <AbsoluteFill style={{ opacity: cmp }}>
          <SceneTitle label="COMPARED FAIRLY" color={C.green} at={FAIR - 4} />
          <Bell g={GZ} mu={0} sigma={1} p={1} color={C.text} fill={0.07} width={5} />
          <Axis g={GZ} ticks={[-3, -2, -1, 0, 1, 2, 3].map((v) => ({ v, label: v === 0 ? "0" : `${v > 0 ? "+" : "-"}${Math.abs(v)}`, big: true, color: v === 0.5 || v === 2 ? SUBJ.science : undefined }))} />
          <div style={{ position: "absolute", left: vx(GZ, 3.6) + 6, top: GZ.base + 34, transform: "translateY(-50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.green }}>z</div>
          {marks.map((m) => {
            const p = spr(m.at, theme.spring.pop);
            if (p <= 0.001) return null;
            const y = curveY(GZ, 0, 1, m.z);
            return (
              <React.Fragment key={m.label}>
                <div style={{ position: "absolute", left: vx(GZ, m.z) - 3, top: y, height: (GZ.base - y) * p, width: 6, background: m.c, borderRadius: 3, boxShadow: `0 0 12px ${m.c}` }} />
                <div style={{ position: "absolute", left: vx(GZ, m.z) - 18, top: y - 18, width: 36, height: 36, borderRadius: 18, background: m.c, transform: `scale(${p})`, boxShadow: `0 0 20px ${m.c}` }} />
                <div style={{ position: "absolute", left: vx(GZ, m.z), top: y - m.up, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), padding: "6px 18px", borderRadius: 16, background: "#0A1440", border: `3px solid ${m.c}`, textAlign: "center", whiteSpace: "nowrap" }}>
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: m.c }}>{m.label}</div>
                  <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: C.text }}>z = {m.z}</div>
                </div>
              </React.Fragment>
            );
          })}
          <Pop at={STRONG - 4} x={vx(GZ, 2)} y={curveY(GZ, 0, 1, 2) - 220} from="down" dist={20} cfg={theme.spring.pop}>
            <Crown size={74} color={C.yellow} />
          </Pop>
          <Burst at={STRONG - 2} x={vx(GZ, 2)} y={curveY(GZ, 0, 1, 2) - 110} color={SUBJ.science} count={16} radius={200} seed={21} />
          <Pop at={STRONG - 2} x={540} y={1140} from="up" dist={20} cfg={theme.spring.bouncy}>
            <Tag color={C.green} size={34}>SCIENCE IS THE STRONGER RESULT</Tag>
          </Pop>
          <div style={{ position: "absolute", left: 0, right: 0, top: 390, textAlign: "center", opacity: ease(frame, [FAIR + 2, FAIR + 14], [0, 1]), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
            <span style={{ color: SUBJ.maths }}>80</span> <span style={{ color: C.dim }}>is</span> <span style={{ color: SUBJ.maths }}>0.5 SD</span> <span style={{ color: C.dim }}>·</span> <span style={{ color: SUBJ.science }}>70</span> <span style={{ color: C.dim }}>is</span> <span style={{ color: SUBJ.science }}>2 SD</span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 444, textAlign: "center", opacity: ease(frame, [FAIR + 8, FAIR + 20], [0, 1]), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: alpha("#A3B0D6", 1) }}>ABOVE THEIR CLASS MEAN</div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
