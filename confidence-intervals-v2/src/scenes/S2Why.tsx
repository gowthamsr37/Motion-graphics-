// SCENE 2 — WHY A RANGE. WE CAN'T ASK EVERYONE: a crowd of voters, 1,000 of them circled as the sample. A different
// 1,000 gives a different answer: SAMPLE 1 52% · SAMPLE 2 51% · SAMPLE 3 54% → ONE NUMBER CAN MISLEAD.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, rng, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";
import { EST, MISS } from "./S1Hook";

const C = theme.colors;
const CROWD = (() => {
  const r = rng(21);
  return Array.from({ length: 160 }, (_, i) => ({ x: 130 + (i % 16) * 55 + (r() - 0.5) * 14, y: 470 + Math.floor(i / 16) * 38 + (r() - 0.5) * 10 }));
})();
const SAMPLES = [
  { k: 0, v: "52%", cx: 300, cy: 560 },
  { k: 1, v: "51%", cx: 760, cy: 640 },
  { k: 2, v: "54%", cx: 480, cy: 760 },
];

export const S2Why: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const ASK = s.cueS(0, "sample");
  const ANOTHER = s.sent(1).from;
  const C51 = s.cueS(1, "51,");
  const C54 = s.cueS(1, "54.");
  const MIS = s.sent(2).from;
  const at = [ASK, C51, C54];
  const crowd = ease(frame, [4, 24], [0, 1]);
  return (
    <AbsoluteFill>
      <SceneTitle label="WHY A RANGE?" color={EST} at={2} />
      <Pop at={4} x={540} y={400} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          WE CAN&apos;T ASK <span style={{ color: MISS }}>EVERYONE</span>
        </div>
      </Pop>
      {CROWD.map((d, i) => (
        <div key={i} style={{ position: "absolute", left: d.x - 9, top: d.y - 9, width: 18, height: 18, borderRadius: 9, background: alpha(C.text, 0.35), opacity: crowd > i / 160 ? 1 : 0 }} />
      ))}
      {SAMPLES.map((sm, i) => {
        const p = spr(at[i] - 6, theme.spring.bouncy);
        if (p <= 0.01) return null;
        const past = i < 2 && frame > at[i + 1] - 6;
        return (
          <React.Fragment key={sm.k}>
            <div style={{ position: "absolute", left: sm.cx - 110, top: sm.cy - 90, width: 220, height: 180, borderRadius: "50%", border: `4px solid ${past ? alpha(EST, 0.4) : EST}`, background: alpha(EST, past ? 0.05 : 0.12), transform: `scale(${interpolate(Math.min(1, p), [0, 1], [0.4, 1])})`, opacity: Math.min(1, p * 2) }} />
            <div style={{ position: "absolute", left: sm.cx, top: sm.cy, transform: `translate(-50%, -50%) scale(${Math.min(1.1, p)})`, padding: "6px 14px", borderRadius: 12, background: "rgba(8,14,44,0.9)", border: `2px solid ${EST}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, color: C.text, opacity: past ? 0.6 : 1 }}>{sm.v}</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 920, display: "flex", justifyContent: "center", gap: 20 }}>
        {SAMPLES.map((sm, i) => {
          const p = spr(at[i] + 6, theme.spring.pop);
          return (
            <div key={sm.k} style={{ opacity: Math.min(1, p * 2), transform: `scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, padding: "12px 22px", borderRadius: 18, background: alpha(EST, 0.14), border: `2px solid ${alpha(EST, 0.8)}`, textAlign: "center" }}>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color: C.dim }}>SAMPLE {i + 1}</div>
              <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 44, color: C.text }}>{sm.v}</div>
            </div>
          );
        })}
      </div>
      <Pop at={ANOTHER + 2} x={540} y={1100} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.14em", color: C.dim, whiteSpace: "nowrap" }}>DIFFERENT 1,000 PEOPLE: DIFFERENT ANSWER</div>
      </Pop>
      <Pop at={MIS - 4} x={540} y={1230} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={MISS} size={32}>
          ONE NUMBER CAN MISLEAD
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
