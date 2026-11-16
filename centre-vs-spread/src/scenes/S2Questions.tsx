// SCENE 2 — TWO QUESTIONS. The DATA orb branches into CENTRE (where's the middle? mean, median, mode)
// and SPREAD (how scattered? range, variance, standard deviation).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst, ease, Pop, useSpr } from "../components/Motion";
import { MeanGlyph, MedianGlyph, ModeGlyph, RangeGlyph, SDGlyph, VarianceGlyph } from "../components/Icons";
import { bezier, Chip, Orb, Pill, Wires } from "../components/Nodes";
import { kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const ROOT: [number, number] = [540, 430];
const CEN: [number, number] = [285, 760];
const SPR: [number, number] = [795, 760];

export const S2Questions: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const CENW = s.cueS(1, "centre?");
  const CENT = s.cueS(1, "central");
  const SPRW = s.cueS(2, "spread");
  const DISP = s.cueS(2, "dispersion:");
  const chipsC = [
    { at: s.cueS(1, "mean,"), G: MeanGlyph, t: "Mean" },
    { at: s.cueS(1, "median"), G: MedianGlyph, t: "Median" },
    { at: s.cueS(1, "mode."), G: ModeGlyph, t: "Mode" },
  ];
  const chipsS = [
    { at: s.cueS(2, "range,"), G: RangeGlyph, t: "Range" },
    { at: s.cueS(2, "variance"), G: VarianceGlyph, t: "Variance" },
    { at: s.cueS(2, "standard"), G: SDGlyph, t: "Std Dev" },
  ];
  const END = s.duration;
  const ZOOM = END - 20;

  const born = spr(0, theme.spring.pop);
  const lift = ease(frame, [6, 26], [0, 1], theme.ease.inOut);
  const oy = interpolate(lift, [0, 1], [930, ROOT[1]]);
  const osize = interpolate(lift, [0, 1], [200, 150]);
  const zoom = ease(frame, [ZOOM, END], [0, 1], theme.ease.in);
  const fadeAll = ease(frame, [END - 9, END], [1, 0], theme.ease.in);
  const focusS = ease(frame, [SPRW - 6, SPRW + 6], [0, 1]);
  const cenDim = 1 - 0.55 * focusS;
  const sprDim = 1 - 0.55 * (1 - focusS) * ease(frame, [CENW - 6, CENW + 6], [0, 1]);

  const wC = bezier([ROOT[0], ROOT[1] + 70], [CEN[0], CEN[1] - 40], 0.55);
  const wS = bezier([ROOT[0], ROOT[1] + 70], [SPR[0], SPR[1] - 40], 0.55);

  return (
    <AbsoluteFill style={{ transformOrigin: `${CEN[0]}px ${CEN[1]}px`, transform: `scale(${1 + zoom * 2.2})`, opacity: fadeAll }}>
      <Wires
        wires={[
          { d: wC.d, at: wC.at, color: kindColor.centre, p: ease(frame, [CENW - 12, CENW + 4], [0, 1], theme.ease.inOut), pulseFrom: CENW + 20, dim: cenDim },
          { d: wS.d, at: wS.at, color: kindColor.spread, p: ease(frame, [SPRW - 12, SPRW + 4], [0, 1], theme.ease.inOut), pulseFrom: SPRW + 20, dim: sprDim * (1 - zoom) },
        ]}
      />
      <div style={{ position: "absolute", left: ROOT[0], top: oy, transform: `translate(-50%, -50%) scale(${interpolate(born, [0, 1], [0.3, 1])})`, opacity: 1 - zoom * 0.8 }}>
        <Orb size={osize} label="DATA" pulse={Math.max(0, 1 - Math.abs(frame - 18) / 10)} />
      </div>
      <Pop at={4} out={CENW - 8} x={540} y={640} from="up" dist={20}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.24em", color: C.dim }}>TWO QUESTIONS</div>
      </Pop>
      <Pop at={CENW - 2} x={CEN[0]} y={CEN[1]} from="scale" cfg={theme.spring.bouncy} scaleFrom={0.4} dim={cenDim}>
        <Pill label="CENTRE" color={kindColor.centre} size={42} glow={0.7 * (1 - focusS)} sub="Where's the middle?" subOn={ease(frame, [CENT - 4, CENT + 6], [0, 1])} />
      </Pop>
      <Pop at={SPRW - 2} x={SPR[0]} y={SPR[1]} from="scale" cfg={theme.spring.bouncy} scaleFrom={0.4} dim={sprDim * (1 - zoom)}>
        <Pill label="SPREAD" color={kindColor.spread} size={42} glow={0.7 * focusS} sub="How scattered?" subOn={ease(frame, [DISP - 4, DISP + 6], [0, 1])} />
      </Pop>
      <Burst at={CENW} x={CEN[0]} y={CEN[1]} color={kindColor.centre} seed={2} />
      <Burst at={SPRW} x={SPR[0]} y={SPR[1]} color={kindColor.spread} seed={4} />
      {chipsC.map((c, i) => (
        <Pop key={c.t} at={c.at - 2} x={CEN[0]} y={968 + i * 112 + Math.sin(frame / 26 + i) * 3} from="up" dist={36} dim={cenDim}>
          <Chip icon={<c.G size={36} color={kindColor.centre} />} text={c.t} color={kindColor.centre} width={340} />
        </Pop>
      ))}
      {chipsS.map((c, i) => (
        <Pop key={c.t} at={c.at - 2} x={SPR[0]} y={968 + i * 112 + Math.sin(frame / 26 + i + 2) * 3} from="up" dist={36} dim={sprDim * (1 - zoom)}>
          <Chip icon={<c.G size={36} color={kindColor.spread} />} text={c.t} color={kindColor.spread} width={340} />
        </Pop>
      ))}
    </AbsoluteFill>
  );
};
