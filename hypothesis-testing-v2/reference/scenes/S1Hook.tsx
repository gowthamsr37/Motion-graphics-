// SCENE 1 — HOOK. EVERY DISTRIBUTION YOU NEED · IN ONE VIDEO, the twelve mini cards cascade into a grid, then the three
// promises (THE SHAPE · WHEN TO USE IT · PYTHON CODE) and a SAVE THIS bookmark pill.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BONUS, Bookmark, COUNTS, DIST, MEAS, MiniCard, TEST } from "../components/Guide";
import { Burst, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const T = s.sent(0).from;
  const ONE = s.cueS(0, "one");
  const LOOKS = s.cueS(1, "looks");
  const WHEN = s.cueS(1, "when");
  const PY = s.cueS(1, "Python");
  const SAVE = s.cueS(1, "Save");
  const title = spr(T - 4, theme.spring.pop);
  const promises = [
    { t: "THE SHAPE", at: LOOKS, c: COUNTS },
    { t: "WHEN TO USE IT", at: WHEN, c: MEAS },
    { t: "PYTHON CODE", at: PY, c: TEST },
  ];
  return (
    <AbsoluteFill>
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(Math.min(1, title), [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 70, color: C.text, whiteSpace: "nowrap" }}>EVERY DISTRIBUTION</div>
          <div style={{ fontSize: 86, whiteSpace: "nowrap" }}>
            <span style={{ background: `linear-gradient(90deg, ${COUNTS}, ${MEAS}, ${TEST})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(MEAS, 0.5)})` }}>YOU NEED</span>
          </div>
        </div>
      ) : null}
      <Burst at={T} x={540} y={360} color={MEAS} count={22} radius={340} seed={3} />
      {DIST.map((d, i) => {
        const at = T + 6 + i * 3;
        const wob = frame >= ONE - 4 && frame < ONE + 8 ? Math.sin(frame / 2 + i) * 3 : 0;
        return <MiniCard key={d.kind} d={d} x={230 + (i % 3) * 310} y={660 + Math.floor(i / 3) * 160} w={290} h={142} p={spr(at, theme.spring.bouncy)} wob={wob} />;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 522, display: "flex", justifyContent: "center", gap: 14 }}>
        {promises.map((p) => {
          const k = spr(p.at - 4, theme.spring.pop);
          return (
            <div key={p.t} style={{ opacity: Math.min(1, k * 2), transform: `scale(${interpolate(Math.min(1, k), [0, 1], [0.6, 1])})`, padding: "8px 18px", borderRadius: 999, background: alpha(p.c, 0.18), border: `2px solid ${p.c}`, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: C.text, whiteSpace: "nowrap" }}>{p.t}</div>
          );
        })}
      </div>
      <Pop at={SAVE - 4} x={540} y={1300} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 34px", borderRadius: 999, background: alpha(BONUS, 0.2), border: `3px solid ${BONUS}`, boxShadow: `0 0 30px ${alpha(BONUS, 0.45)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          <Bookmark size={44} color={BONUS} />
          SAVE <span style={{ color: BONUS, textShadow: glowText(BONUS, 0.5) }}>THIS ONE</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
