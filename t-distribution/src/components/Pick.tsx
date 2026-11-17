// Cheat-sheet kit: the six shapes (uniform, binomial, Poisson, exponential, normal, bimodal) as one chart component,
// and the QuestionScene template used by scenes 3–8: question → everyday example → the shape draws → the name lands.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "./Kit";
import { Burst, ease, Pop, useSpr } from "./Motion";
import { pois } from "./Pois";
import { alpha, glowText, theme } from "../theme";
import { type SceneId } from "../timing";
import { useScene } from "../timing";

const C = theme.colors;

export type Kind = "uniform" | "binomial" | "poisson" | "exp" | "normal" | "bimodal";

const choose = (n: number, k: number) => {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
};
export const BINOM10 = Array.from({ length: 11 }, (_, k) => choose(10, k) / 1024);
export const POIS4 = Array.from({ length: 13 }, (_, k) => pois(4, k));
export const UNIF6 = [1, 1, 1, 1, 1, 1];
const bell = (u: number, m: number, s: number) => Math.exp(-((u - m) ** 2) / (2 * s * s));
export const CURVES: Record<"exp" | "normal" | "bimodal", (u: number) => number> = {
  exp: (u) => Math.exp(-u * 4.5),
  normal: (u) => bell(u, 0.5, 0.14),
  // lunch and dinner rushes: two humps (12:30-ish and 19:30-ish on a 9:00–23:00 day)
  bimodal: (u) => Math.max(0, 0.95 * bell(u, 0.27, 0.085) + 1.0 * bell(u, 0.75, 0.09)),
};

// a shape drawn in a w × h box; p = draw progress (bars grow, curves sweep left → right)
export const Shape: React.FC<{ kind: Kind; w: number; h: number; color: string; p?: number; color2?: string; axis?: boolean }> = ({ kind, w, h, color, p = 1, color2, axis = true }) => {
  const discrete = kind === "uniform" || kind === "binomial" || kind === "poisson";
  if (discrete) {
    const vals = kind === "uniform" ? UNIF6 : kind === "binomial" ? BINOM10 : POIS4;
    const max = kind === "uniform" ? 1.6 : Math.max(...vals);
    const bw = w / vals.length;
    return (
      <svg width={w} height={h + 6} viewBox={`0 0 ${w} ${h + 6}`} style={{ display: "block", overflow: "visible" }}>
        {vals.map((v, i) => {
          const g = ease(p, [i / vals.length / 2, i / vals.length / 2 + 0.5], [0, 1]);
          const bh = (v / max) * h * g;
          return <rect key={i} x={i * bw + bw * 0.13} y={h - bh} width={bw * 0.74} height={Math.max(0, bh)} rx={Math.min(8, bw * 0.15)} fill={alpha(color, 0.5)} stroke={color} strokeWidth={3} />;
        })}
        {axis ? <line x1={-8} y1={h + 2} x2={w + 8} y2={h + 2} stroke={alpha("#F3F7FF", 0.45)} strokeWidth={4} /> : null}
      </svg>
    );
  }
  const f = CURVES[kind];
  const n = 90;
  const end = Math.max(1, Math.round(n * Math.min(1, p)));
  const pts = Array.from({ length: end + 1 }, (_, i) => [(i / n) * w, h - Math.min(1, f(i / n)) * h * 0.96] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const xe = pts[pts.length - 1][0];
  const gid = `g${kind}${w}`;
  return (
    <svg width={w} height={h + 6} viewBox={`0 0 ${w} ${h + 6}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={color2 ?? color} />
        </linearGradient>
      </defs>
      {p > 0.01 ? (
        <>
          <path d={`${d} L${xe.toFixed(1)} ${h} L0 ${h} Z`} fill={`url(#${gid})`} opacity={0.3} />
          <path d={d} fill="none" stroke={`url(#${gid})`} strokeWidth={Math.max(3, w / 120)} strokeLinejoin="round" strokeLinecap="round" />
        </>
      ) : null}
      {axis ? <line x1={-8} y1={h + 2} x2={w + 8} y2={h + 2} stroke={alpha("#F3F7FF", 0.45)} strokeWidth={4} /> : null}
    </svg>
  );
};

export type QuestionSpec = {
  id: SceneId;
  label: string; // "QUESTION 1"
  q: [string, string]; // two question lines (line 2 in colour)
  exampleAt?: [number, string]; // [sentence, token] for the example card; default: sentence 0 + 14 frames
  example: React.ReactNode;
  nameAt: [number, string]; // [sentence, token] where the name is spoken
  name: string;
  color: string;
  color2?: string;
  kind: Kind;
  tag?: { at: [number, string]; text: string };
  overlay?: (frame: number, cue: (i: number, t: string) => number) => React.ReactNode; // drawn over the chart (x 160–920, y 840–1110)
};

export const CHART = { x: 160, y: 840, w: 760, h: 270 };

export const QuestionScene: React.FC<{ spec: QuestionSpec }> = ({ spec }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene(spec.id);
  const Q = s.sent(0).from;
  const EX = spec.exampleAt ? s.cueS(spec.exampleAt[0], spec.exampleAt[1]) : Q + 14;
  const NAME = s.cueS(spec.nameAt[0], spec.nameAt[1]);
  const draw = ease(frame, [NAME - 16, NAME + 14], [0, 1], theme.ease.inOut);
  const nm = spr(NAME - 3, theme.spring.pop);
  const ghost = ease(frame, [6, 16], [0, 1]) * (1 - ease(frame, [NAME - 16, NAME - 6], [0, 1]));
  return (
    <AbsoluteFill>
      <SceneTitle label={spec.label} color={spec.color} at={2} />
      <Pop at={Q - 2} x={540} y={420} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>{spec.q[0]}</div>
      </Pop>
      <Pop at={Q + 6} x={540} y={490} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: spec.color, textShadow: glowText(spec.color, 0.5), whiteSpace: "nowrap" }}>{spec.q[1]}</div>
      </Pop>
      <Pop at={EX - 4} x={540} y={660} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 30px 12px 20px", borderRadius: 999, background: "rgba(12,22,66,0.92)", border: `3px solid ${alpha(spec.color, 0.6)}` }}>{spec.example}</div>
      </Pop>
      {/* the chart: a dashed placeholder until the name, then the shape draws */}
      <div style={{ position: "absolute", left: CHART.x - 20, top: CHART.y - 30, width: CHART.w + 40, height: CHART.h + 60, boxSizing: "border-box", borderRadius: 28, border: `3px dashed ${alpha("#F3F7FF", 0.2)}`, opacity: ghost * 0.8 }} />
      {ghost > 0.05 ? <div style={{ position: "absolute", left: 540, top: CHART.y + CHART.h / 2, transform: "translate(-50%, -50%)", opacity: ghost, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 90, color: alpha(C.yellow, 0.75) }}>?</div> : null}
      <div style={{ position: "absolute", left: CHART.x, top: CHART.y }}>
        <Shape kind={spec.kind} w={CHART.w} h={CHART.h} color={spec.color} color2={spec.color2} p={draw} />
      </div>
      {spec.overlay ? spec.overlay(frame, s.cueS) : null}
      {nm > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1215, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(nm, [0, 1], [1.6, 1])})`, opacity: Math.min(1, nm * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 92, letterSpacing: "-0.01em", lineHeight: 1, whiteSpace: "nowrap" }}>
          <span style={{ background: `linear-gradient(90deg, ${spec.color}, ${spec.color2 ?? spec.color})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 22px ${alpha(spec.color, 0.55)})` }}>{spec.name}</span>
        </div>
      ) : null}
      <Burst at={NAME} x={540} y={1215} color={spec.color} count={18} radius={300} seed={spec.label.length * 7} />
      {spec.tag ? (
        <Pop at={s.cueS(spec.tag.at[0], spec.tag.at[1]) - 4} x={540} y={1310} from="up" dist={12}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.16em", color: C.text, whiteSpace: "nowrap" }}>{spec.tag.text}</div>
        </Pop>
      ) : null}
    </AbsoluteFill>
  );
};

// an envelope icon (for the quiz)
export const Envelope: React.FC<{ w: number; color: string }> = ({ w, color }) => (
  <svg width={w} height={w * 0.7} viewBox="0 0 100 70" style={{ display: "block", overflow: "visible" }}>
    <rect x={3} y={3} width={94} height={64} rx={8} fill={alpha(color, 0.25)} stroke={color} strokeWidth={5} />
    <path d="M6 8 L50 40 L94 8" fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);
