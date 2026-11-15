// SCENE 6 — WHY IT MATTERS. Two bell curves on the same average: narrow (SD 5) and wide (SD 25). In both, about 68%
// (two-thirds) of values sit within one standard deviation of the average.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ease, Pop } from "../components/Motion";
import { TreeHeaderN } from "../components/Nodes";
import { alpha, BAT_A, BAT_B, theme } from "../theme";
import { useScene } from "../timing";
import { DISP_HEADER } from "./S3Range";

const C = theme.colors;
const V = C.violet;
const AX_Y = 1170;
const X0 = 120;
const X1 = 960;
const px = (runs: number) => X0 + (runs / 80) * (X1 - X0);
const MID = px(40);

const curve = (sigmaRuns: number, peak: number) => {
  const s = (sigmaRuns / 80) * (X1 - X0);
  const pts: [number, number][] = [];
  for (let x = X0; x <= X1; x += 6) pts.push([x, AX_Y - peak * Math.exp(-(((x - MID) / s) ** 2) / 2)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const band = pts.filter((p) => Math.abs(p[0] - MID) <= s);
  const bandPath = `M${(MID - s).toFixed(1)} ${AX_Y} ${band.map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ")} L${(MID + s).toFixed(1)} ${AX_Y} Z`;
  return { line, area: `${line} L${X1} ${AX_Y} L${X0} ${AX_Y} Z`, bandPath, s };
};
const NARROW = curve(5, 390);
const WIDE = curve(25, 160);

export const S6Bell: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const BELL = s.cueS(0, "bell-shaped");
  const TWO = s.cueS(0, "two-thirds");
  const WITHIN = s.cueS(0, "within");
  const END = s.duration;
  const B2 = s.voEnd + 4; // the wide curve after the sentence

  const dA = ease(frame, [BELL - 4, BELL + 16], [0, 1], theme.ease.inOut);
  const bandA = ease(frame, [TWO - 2, TWO + 10], [0, 1]);
  const ticks = ease(frame, [WITHIN - 2, WITHIN + 8], [0, 1]);
  const dB = ease(frame, [B2, B2 + 18], [0, 1], theme.ease.inOut);
  const bandB = ease(frame, [B2 + 12, B2 + 24], [0, 1]);
  const out = ease(frame, [END - 10, END], [0, 1], theme.ease.in);

  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <TreeHeaderN {...DISP_HEADER} parentIn={-60} kidsIn={-60} activeAt={-60} activeIdx={2} prevIdx={2} />
      <Pop at={2} x={540} y={600} from="up" dist={20}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: C.dim }}>BELL-SHAPED DATA</div>
      </Pop>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line x1={X0 - 20} y1={AX_Y} x2={X1 + 20} y2={AX_Y} stroke={alpha(C.text, 0.4)} strokeWidth={4} strokeLinecap="round" opacity={ease(frame, [0, 10], [0, 1])} />
        <line x1={MID} y1={AX_Y + 10} x2={MID} y2={AX_Y - 420} stroke={alpha(C.text, 0.6)} strokeWidth={3} strokeDasharray="8 8" opacity={ease(frame, [4, 14], [0, 1])} />
        {/* wide curve (B) */}
        <path d={WIDE.area} fill={alpha(BAT_B, 0.1 * dB)} />
        <path d={WIDE.bandPath} fill={alpha(V, 0.3 * bandB)} />
        <path d={WIDE.line} stroke={BAT_B} strokeWidth={6} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dB} style={{ filter: `drop-shadow(0 0 8px ${alpha(BAT_B, 0.7)})` }} />
        {/* narrow curve (A) */}
        <path d={NARROW.area} fill={alpha(BAT_A, 0.1 * dA)} />
        <path d={NARROW.bandPath} fill={alpha(V, 0.45 * bandA)} />
        <path d={NARROW.line} stroke={BAT_A} strokeWidth={6} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dA} style={{ filter: `drop-shadow(0 0 8px ${alpha(BAT_A, 0.7)})` }} />
        {/* ±1 SD ticks */}
        {[
          { x: MID - NARROW.s, t: "-1 SD", p: ticks },
          { x: MID + NARROW.s, t: "+1 SD", p: ticks },
        ].map((k) => (
          <g key={k.t} opacity={k.p}>
            <line x1={k.x} y1={AX_Y - 6} x2={k.x} y2={AX_Y + 18} stroke={V} strokeWidth={4} />
          </g>
        ))}
      </svg>
      {["-1 SD", "+1 SD"].map((t, i) => (
        <div key={t} style={{ position: "absolute", left: i ? MID + NARROW.s + 6 : MID - NARROW.s - 6, top: AX_Y + 42, transform: `translate(${i ? "0" : "-100%"}, -50%)`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: V, opacity: ticks }}>
          {t}
        </div>
      ))}
      <Pop at={TWO + 4} x={MID} y={AX_Y - 470} from="down" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, color: C.text, lineHeight: 1 }}>
          <div style={{ fontSize: 22, letterSpacing: "0.2em", color: C.dim, fontFamily: theme.fonts.body }}>ABOUT</div>
          <div style={{ fontSize: 58, color: V }}>68%</div>
          <div style={{ fontSize: 24, fontFamily: theme.fonts.body, color: C.dim, marginTop: 4 }}>within ±1 SD</div>
        </div>
      </Pop>
      <Pop at={BELL + 10} x={250} y={AX_Y - 300} from="left" dist={20}>
        <div style={{ padding: "6px 16px", borderRadius: 14, background: alpha(BAT_A, 0.14), border: `2px solid ${BAT_A}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: C.text }}>40 ± 5</div>
      </Pop>
      <Pop at={B2 + 10} x={830} y={AX_Y - 230} from="right" dist={20}>
        <div style={{ padding: "6px 16px", borderRadius: 14, background: alpha(BAT_B, 0.14), border: `2px solid ${BAT_B}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: C.text }}>40 ± 25</div>
      </Pop>
      <Pop at={B2 + 20} x={540} y={AX_Y + 100} from="up" dist={16}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: C.dim, whiteSpace: "nowrap" }}>SAME 68%, WIDER BAND</div>
      </Pop>
    </AbsoluteFill>
  );
};
