// SCENE 5 — THE COIN EXPERIMENT. A coin flips; TRUE CHANCE 50% dashed line; the running share of heads is drawn on a
// log scale of flips and stops at each milestone on its words: 10 flips → 70% (way off, red), 100 → 54% (closer,
// orange), 1,000 → 50.8%, 10,000 → 50.1% (green). Data: mulberry32(222211), cumulative.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Coin, graphX, graphY, RunGraph } from "../components/Casino";
import { Pop, Txt } from "../components/L";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const GX = 170, GY = 560, GW = 800, GH = 560;

export const S5Coin: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const TRUE = s.cueS(0, "50%.");
  const m = [
    { n: 10, p: 70, t: "70%", c: C.red, at: s.cueS(1, "10"), note: "way off" },
    { n: 100, p: 54, t: "54%", c: C.orange, at: s.cueS(2, "100"), note: "closer" },
    { n: 1000, p: 50.8, t: "50.8%", c: C.green, at: s.cueS(3, "1,000:"), note: "" },
    { n: 10000, p: 50.1, t: "50.1%", c: C.green, at: s.cueS(3, "10,000:"), note: "" },
  ];
  let upTo = 0;
  for (let i = 0; i < m.length; i++) {
    const t = ease(frame, [m[i].at - 10, m[i].at + 8], [0, 1]);
    if (t <= 0) break;
    const prev = i === 0 ? 0 : Math.log10(m[i - 1].n);
    upTo = prev + (Math.log10(m[i].n) - prev) * t;
  }
  const flip = frame / 9;
  return (
    <AbsoluteFill>
      <Pop x={200} y={330} at={s.sent(0).from - 6}>
        <Coin size={150} flip={flip} />
      </Pop>
      <Pop x={340} y={300} at={s.sent(0).from} anchor="left">
        <Txt size={48}>flip a fair coin</Txt>
      </Pop>
      <Pop x={340} y={365} at={TRUE - 4} anchor="left">
        <Txt size={40} font="body">
          true chance of heads: <span style={{ color: C.green }}>50%</span>
        </Txt>
      </Pop>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: ease(frame, [s.sent(0).from + 10, s.sent(0).from + 20], [0, 1]) }}>
        <RunGraph x={GX} y={GY} w={GW} h={GH} upTo={upTo} />
        {m.map((k) => {
          const p = ease(frame, [k.at + 4, k.at + 12], [0, 1]);
          if (p <= 0) return null;
          return <circle key={k.n} cx={graphX(GX, GW, k.n)} cy={graphY(GY, GH, k.p)} r={14 * p} fill={k.c} stroke={C.text} strokeWidth={3} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: GX + 10, top: GY - 40, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 28, color: C.dim, opacity: ease(frame, [s.sent(0).from + 10, s.sent(0).from + 20], [0, 1]) }}>% heads so far</div>
      <div style={{ position: "absolute", right: 110, top: GY + GH * 0.5 - 52, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.green, opacity: ease(frame, [TRUE, TRUE + 8], [0, 1]) }}>TRUE 50%</div>
      {/* milestone readouts */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1230, display: "flex", justifyContent: "center", gap: 14 }}>
        {m.map((k) => (
          <div key={k.n} style={{ opacity: ease(frame, [k.at, k.at + 6], [0, 1]), transform: `scale(${ease(frame, [k.at, k.at + 8], [0.6, 1])})`, width: 220, padding: "12px 0", boxSizing: "border-box", borderRadius: 18, textAlign: "center", background: alpha(k.c, 0.14), border: `3px solid ${k.c}` }}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: C.dim }}>{k.n.toLocaleString("en-IN")} flips</div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text }}>{k.t}</div>
            {k.note ? <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, color: k.c }}>{k.note}</div> : null}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
