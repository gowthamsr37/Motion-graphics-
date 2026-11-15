// SCENE 2 — BIG PICTURE. A cloud of data breathes in and out (dispersion = how spread out it is); the orb splits into RANGE, VARIANCE, STD DEV.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, Pop, rng, useSpr } from "../components/Motion";
import { Arrow } from "../components/Icons";
import { bezier, Orb, Pill, Tag, Wires } from "../components/Nodes";
import { alpha, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const ROOT: [number, number] = [540, 430];
const KIDS = [
  { label: "RANGE", sub: "High - low", color: kindColor.range, at: [230, 740] as [number, number] },
  { label: "VARIANCE", sub: "Squared distance", color: kindColor.variance, at: [540, 760] as [number, number] },
  { label: "STD DEV", sub: "Typical distance", color: kindColor.sd, at: [850, 740] as [number, number] },
];
const CLOUD = (() => {
  const r = rng(77);
  return Array.from({ length: 22 }).map(() => {
    const g = (r() + r() + r() - 1.5) / 1.5; // bell-ish in [-1, 1]
    return { x: g * 380, y: 1080 + (r() - 0.5) * 120, n: r() };
  });
})();

export const S2BigPicture: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const DISP = s.cueS(0, "dispersion:");
  const SPREAD = s.cueS(0, "spread");
  const at = [s.cueS(1, "range,"), s.cueS(1, "variance,"), s.cueS(1, "standard")];
  const L = s.sent(2).from;
  const END = s.duration;
  const ZOOM = Math.min(L + 18, END - 20);

  const born = spr(0, theme.spring.pop);
  const lift = ease(frame, [6, 26], [0, 1], theme.ease.inOut);
  const oy = interpolate(lift, [0, 1], [930, ROOT[1]]);
  const osize = interpolate(lift, [0, 1], [200, 150]);
  const open = spr(SPREAD - 2, theme.spring.bouncy);
  const f = interpolate(open, [0, 1], [0.22, 1]) * (1 + (frame > SPREAD + 20 ? Math.sin((frame - SPREAD - 20) / 12) * 0.16 : 0));
  const zoom = ease(frame, [ZOOM, END], [0, 1], theme.ease.in);
  const fadeAll = ease(frame, [END - 9, END], [1, 0], theme.ease.in);
  const xs = CLOUD.map((d) => 540 + d.x * f);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const arrowOn = ease(frame, [SPREAD, SPREAD + 10], [0, 1]);

  const wires = KIDS.map((k, i) => {
    const b = bezier([ROOT[0], ROOT[1] + 70], [k.at[0], k.at[1] - 40], 0.55);
    return { d: b.d, at: b.at, color: k.color, p: ease(frame, [at[i] - 12, at[i] + 2], [0, 1], theme.ease.inOut), pulseFrom: at[i] + 14 };
  });

  return (
    <AbsoluteFill style={{ transformOrigin: `${KIDS[0].at[0]}px ${KIDS[0].at[1]}px`, transform: `scale(${1 + zoom * 2.2})`, opacity: fadeAll }}>
      <Wires wires={wires} />
      <div style={{ position: "absolute", left: ROOT[0], top: oy, transform: `translate(-50%, -50%) scale(${interpolate(born, [0, 1], [0.3, 1])})`, opacity: 1 - zoom * 0.8 }}>
        <Orb size={osize} label="DATA" pulse={Math.max(0, 1 - Math.abs(frame - DISP) / 10)} />
      </div>

      {/* the data cloud: tight, then spread out, breathing */}
      {CLOUD.map((d, i) => {
        const p = spr(12 + d.n * 24, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const x = xs[i];
        const far = Math.abs(d.x) > 200;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 16,
              top: d.y - 16,
              width: 32,
              height: 32,
              borderRadius: 16,
              background: far && open > 0.5 ? C.orange : alpha("#E4EEFF", 0.9),
              boxShadow: far && open > 0.5 ? `0 0 14px ${alpha(C.orange, 0.8)}` : "none",
              transform: `translateY(${(1 - p) * -400}px)`,
              opacity: Math.min(1, p * 3) * (1 - zoom),
            }}
          />
        );
      })}
      {arrowOn > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: minX, top: 1228, width: maxX - minX, height: 5, borderRadius: 3, background: C.text, opacity: arrowOn * (1 - zoom) }} />
          <div style={{ position: "absolute", left: minX - 30, top: 1230, transform: "translate(0, -50%) scaleX(-1)", opacity: arrowOn * (1 - zoom) }}>
            <Arrow size={40} color={C.text} />
          </div>
          <div style={{ position: "absolute", left: maxX - 10, top: 1230, transform: "translate(0, -50%)", opacity: arrowOn * (1 - zoom) }}>
            <Arrow size={40} color={C.text} />
          </div>
          <div style={{ position: "absolute", left: 540, top: 1272, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.24em", color: C.text, opacity: arrowOn * (1 - zoom) }}>SPREAD</div>
        </>
      ) : null}
      <Pop at={DISP - 2} x={540} y={950} from="up" dist={24} cfg={theme.spring.bouncy} dim={1 - zoom}>
        <Tag color={C.cyan} size={30}>
          DISPERSION
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
