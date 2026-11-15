// SCENE 2 — BIG PICTURE. Data piles up into a dot plot with a glowing centre (central tendency); the orb splits into MEAN, MEDIAN, MODE.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, Pop, rng, useSpr } from "../components/Motion";
import { bezier, Orb, Pill, Tag, Wires } from "../components/Nodes";
import { alpha, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const ROOT: [number, number] = [540, 430];
const KIDS = [
  { label: "MEAN", sub: "Fair share", color: kindColor.mean, at: [230, 740] as [number, number] },
  { label: "MEDIAN", sub: "The middle", color: kindColor.median, at: [540, 760] as [number, number] },
  { label: "MODE", sub: "Most common", color: kindColor.mode, at: [850, 740] as [number, number] },
];
const DX = [240, 340, 440, 540, 640, 740, 840];
const DC = [1, 2, 4, 6, 4, 2, 1];
const DOT_BASE = 1240;
const DOTS = (() => {
  const list: { col: number; j: number }[] = [];
  DC.forEach((n, col) => {
    for (let j = 0; j < n; j++) list.push({ col, j });
  });
  const r = rng(31);
  // drop order: random across columns but bottom-up within a column
  const order = list.map((d, i) => ({ d, k: r() + d.j * 0.35, i })).sort((a, b) => a.k - b.k);
  return order.map((o, n) => ({ ...o.d, n }));
})();

export const S2BigPicture: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const CENTRAL = s.cue("central");
  const at = [s.cueS(1, "mean,"), s.cueS(1, "median,"), s.cueS(1, "mode.")];
  const L = s.sent(2).from;
  const END = s.duration;
  const ZOOM = Math.min(L + 18, END - 20);

  const born = spr(0, theme.spring.pop);
  const lift = ease(frame, [6, 26], [0, 1], theme.ease.inOut);
  const oy = interpolate(lift, [0, 1], [930, ROOT[1]]);
  const osize = interpolate(lift, [0, 1], [200, 150]);
  const band = ease(frame, [CENTRAL - 4, CENTRAL + 10], [0, 1]);
  const zoom = ease(frame, [ZOOM, END], [0, 1], theme.ease.in);
  const fadeAll = ease(frame, [END - 9, END], [1, 0], theme.ease.in);

  const wires = KIDS.map((k, i) => {
    const b = bezier([ROOT[0], ROOT[1] + 70], [k.at[0], k.at[1] - 40], 0.55);
    return { d: b.d, at: b.at, color: k.color, p: ease(frame, [at[i] - 12, at[i] + 2], [0, 1], theme.ease.inOut), pulseFrom: at[i] + 14 };
  });

  return (
    <AbsoluteFill style={{ transformOrigin: `${KIDS[0].at[0]}px ${KIDS[0].at[1]}px`, transform: `scale(${1 + zoom * 2.2})`, opacity: fadeAll }}>
      <Wires wires={wires} />
      <div style={{ position: "absolute", left: ROOT[0], top: oy, transform: `translate(-50%, -50%) scale(${interpolate(born, [0, 1], [0.3, 1])})`, opacity: 1 - zoom * 0.8 }}>
        <Orb size={osize} label="DATA" pulse={Math.max(0, 1 - Math.abs(frame - CENTRAL) / 10)} />
      </div>

      {/* the dot plot: data piling up, with its centre glowing */}
      {band > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 540 - 55,
            top: 990,
            width: 110,
            height: DOT_BASE - 990 + 26,
            borderRadius: 28,
            background: `linear-gradient(180deg, ${alpha("#FFFFFF", 0.05)}, ${alpha(C.cyan, 0.28)})`,
            border: `2px solid ${alpha(C.cyan, 0.6 * band)}`,
            boxShadow: `0 0 ${40 * band}px ${alpha(C.cyan, 0.4)}`,
            opacity: band * (0.85 + 0.15 * Math.sin(frame / 6)) * (1 - zoom),
          }}
        />
      ) : null}
      <div style={{ position: "absolute", left: 200, top: DOT_BASE + 22, width: 680, height: 4, borderRadius: 2, background: alpha(C.text, 0.3), opacity: ease(frame, [10, 20], [0, 1]) * (1 - zoom) }} />
      {DOTS.map((d) => {
        const p = spr(14 + d.n * 1.8, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const centreCol = d.col === 3;
        return (
          <div
            key={`${d.col}-${d.j}`}
            style={{
              position: "absolute",
              left: DX[d.col] - 17,
              top: DOT_BASE - d.j * 38 - 17,
              width: 34,
              height: 34,
              borderRadius: 17,
              background: centreCol && band > 0.5 ? "#FFFFFF" : alpha(kindColor.data, 0.85),
              boxShadow: centreCol && band > 0.5 ? `0 0 16px ${alpha(C.cyan, 0.9)}` : "none",
              transform: `translateY(${(1 - p) * -420}px)`,
              opacity: Math.min(1, p * 3) * (1 - zoom),
            }}
          />
        );
      })}
      <Pop at={CENTRAL} x={540} y={940} from="up" dist={24} cfg={theme.spring.bouncy} dim={1 - zoom}>
        <Tag color={C.cyan} size={30}>
          CENTRAL TENDENCY
        </Tag>
      </Pop>

      {KIDS.map((k, i) => (
        <React.Fragment key={k.label}>
          <Pop at={at[i] - 2} x={k.at[0]} y={k.at[1]} from="scale" cfg={theme.spring.bouncy} scaleFrom={0.4} dim={i === 0 ? 1 : 1 - zoom}>
            <Pill label={k.label} color={k.color} size={40} glow={0.5} sub={k.sub} subOn={ease(frame, [at[i] + 4, at[i] + 12], [0, 1])} />
          </Pop>
          <Burst at={at[i]} x={k.at[0]} y={k.at[1]} color={k.color} seed={7 + i} count={12} radius={140} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
