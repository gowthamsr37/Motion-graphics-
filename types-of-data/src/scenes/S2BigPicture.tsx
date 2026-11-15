// SCENE 2 — BIG PICTURE. The DATA particle splits into NUMERICAL (quantitative) and CATEGORICAL (qualitative).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, Pop, useSpr } from "../components/Motion";
import { DropGlyph, PeopleGlyph, PinGlyph, RulerGlyph, SwatchGlyph, ThermoGlyph } from "../components/Icons";
import { bezier, Chip, Orb, Pill, Wires } from "../components/Nodes";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const ROOT: [number, number] = [540, 470];
const NUM: [number, number] = [285, 780];
const CAT: [number, number] = [795, 780];

export const S2BigPicture: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const SPLIT = s.cue("splits");
  const N = s.sent(1).from;
  const K = s.sent(2).from;
  const L = s.sent(3).from;
  const END = s.duration;
  const ZOOM = Math.min(L + 16, END - 22);

  // orb: born from scene 1's merge flash, then rises to become the root
  const born = spr(0, theme.spring.pop);
  const lift = ease(frame, [SPLIT - 14, SPLIT + 6], [0, 1], theme.ease.inOut);
  const ox = ROOT[0];
  const oy = interpolate(lift, [0, 1], [930, ROOT[1]]);
  const osize = interpolate(lift, [0, 1], [200, 150]);
  const pulse = Math.max(0, 1 - Math.abs(frame - (SPLIT + 6)) / 8);

  // spotlight: numerical, then categorical, then both
  const numFocus = ease(frame, [N - 6, N + 6], [0, 1]) * (1 - ease(frame, [K - 6, K + 6], [0, 1]));
  const catFocus = ease(frame, [K - 6, K + 6], [0, 1]) * (1 - ease(frame, [L - 2, L + 8], [0, 1]));
  const numDim = 1 - 0.62 * catFocus;
  const catDim = 1 - 0.62 * numFocus;

  const travel = (delay: number) => ease(frame, [SPLIT + 4 + delay, SPLIT + 24 + delay], [0, 1], theme.ease.inOut);
  const wN = bezier([ROOT[0], ROOT[1] + 70], [NUM[0], NUM[1] - 40], 0.55);
  const wC = bezier([ROOT[0], ROOT[1] + 70], [CAT[0], CAT[1] - 40], 0.55);
  const tN = travel(0);
  const tC = travel(3);

  const zoom = ease(frame, [ZOOM, END], [0, 1], theme.ease.in);
  const zoomScale = 1 + zoom * 2.2;
  const fadeAll = ease(frame, [END - 9, END], [1, 0], theme.ease.in);

  const chipsN = [
    { at: s.cue("quantities:"), icon: <RulerGlyph size={36} color={C.cyan} />, text: "172 cm" },
    { at: s.cue("count"), icon: <PeopleGlyph size={36} color={C.cyan} />, text: "5 students" },
    { at: s.cue("measure."), icon: <ThermoGlyph size={36} color={C.cyan} />, text: "38.5 °C" },
  ];
  const chipsC = [
    { at: s.cue("labels:"), icon: <PinGlyph size={36} color={C.violet} />, text: "Mumbai" },
    { at: s.cue("names"), icon: <DropGlyph size={36} color={C.violet} />, text: "Blood type O" },
    { at: s.cue("groups."), icon: <SwatchGlyph size={36} color={C.violet} />, text: "Colour: Red" },
  ];

  return (
    <AbsoluteFill style={{ transformOrigin: `${NUM[0]}px ${NUM[1]}px`, transform: `scale(${zoomScale})`, opacity: fadeAll }}>
      <Wires
        wires={[
          { d: wN.d, at: wN.at, color: C.cyan, p: tN, pulseFrom: SPLIT + 40, dim: numDim },
          { d: wC.d, at: wC.at, color: C.violet, p: tC, pulseFrom: SPLIT + 52, dim: catDim * (1 - zoom) },
        ]}
      />
      {/* travelling sparks that become the two families */}
      {[
        { t: tN, w: wN, c: C.cyan },
        { t: tC, w: wC, c: C.violet },
      ].map((k, i) =>
        k.t > 0 && k.t < 1 ? (
          <div
            key={i}
            style={{
              position: "absolute",
              left: k.w.at(k.t)[0] - 16,
              top: k.w.at(k.t)[1] - 16,
              width: 32,
              height: 32,
              borderRadius: 16,
              background: "#FFFFFF",
              boxShadow: `0 0 26px 8px ${alpha(k.c, 0.8)}`,
            }}
          />
        ) : null,
      )}
      <Burst at={SPLIT + 23} x={NUM[0]} y={NUM[1]} color={C.cyan} seed={2} />
      <Burst at={SPLIT + 26} x={CAT[0]} y={CAT[1]} color={C.violet} seed={4} />

      <div style={{ position: "absolute", left: ox, top: oy, transform: `translate(-50%, -50%) scale(${interpolate(born, [0, 1], [0.3, 1])})`, opacity: (1 - zoom * 0.8) }}>
        <Orb size={osize} label="DATA" pulse={pulse} />
      </div>

      <Pop at={SPLIT + 20} x={NUM[0]} y={NUM[1]} from="scale" cfg={theme.spring.bouncy} scaleFrom={0.4} dim={numDim}>
        <Pill label="NUMERICAL" color={C.cyan} size={40} glow={numFocus} sub="Quantitative" subOn={ease(frame, [s.cue("quantitative,"), s.cue("quantitative,") + 8], [0, 1])} />
      </Pop>
      <Pop at={SPLIT + 24} x={CAT[0]} y={CAT[1]} from="scale" cfg={theme.spring.bouncy} scaleFrom={0.4} dim={catDim * (1 - zoom)}>
        <Pill label="CATEGORICAL" color={C.violet} size={40} glow={catFocus} sub="Qualitative" subOn={ease(frame, [s.cue("qualitative,"), s.cue("qualitative,") + 8], [0, 1])} />
      </Pop>

      {chipsN.map((c, i) => (
        <Pop key={c.text} at={c.at} x={NUM[0]} y={968 + i * 112 + Math.sin(frame / 26 + i) * 3} from="up" dist={36} dim={numDim}>
          <Chip icon={c.icon} text={c.text} color={C.cyan} width={380} />
        </Pop>
      ))}
      {chipsC.map((c, i) => (
        <Pop key={c.text} at={c.at} x={CAT[0]} y={968 + i * 112 + Math.sin(frame / 26 + i + 2) * 3} from="up" dist={36} dim={catDim * (1 - zoom)}>
          <Chip icon={c.icon} text={c.text} color={C.violet} width={380} />
        </Pop>
      ))}
    </AbsoluteFill>
  );
};
