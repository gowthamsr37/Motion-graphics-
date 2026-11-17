// SCENE 4 — TWO SCALES. 100 house prices (lakh rupees) drop into 20-lakh bins: bunched on the left, a few far right
// (orange, ≥ 100 lakh). Switch to a log scale: every dot glides to its log bin → a symmetric bell; the expected
// normal curve traces over it.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bracket } from "../components/Curve";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { bellY, MorphAxis, PriceDots, type DotGeo } from "../components/PriceDots";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { LOG, RAW } from "./S1Hook";

const C = theme.colors;
const G: DotGeo = { x0: 150, x1: 930, base: 1150, dot: 16 };

export const S4Scales: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const NORMAL = s.sent(1).from;
  const BUNCH = s.cueS(1, "bunched");
  const FAR = s.cueS(1, "far");
  const SWITCH = s.cueS(2, "switch");
  const BELL = s.sent(3).from;
  const m = ease(frame, [SWITCH + 2, SWITCH + 36], [0, 1], theme.ease.inOut);
  const curve = ease(frame, [BELL + 4, BELL + 30], [0, 1], theme.ease.inOut);
  const left = spr(BUNCH - 4, theme.spring.bouncy) * (1 - m);
  const right = spr(FAR - 4, theme.spring.bouncy) * (1 - m);
  const lw = (G.x1 - G.x0) / 13;

  const n = Math.round(160 * curve);
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const x = G.x0 + (i / 160) * (G.x1 - G.x0);
    return `${i ? "L" : "M"}${x.toFixed(1)} ${bellY(G, x).toFixed(1)}`;
  }).join(" ");

  return (
    <AbsoluteFill>
      <SceneTitle label="TWO SCALES" color={LOG} at={2} />
      <PriceDots g={G} at={6} morphAt={SWITCH + 2} hiRight={FAR - 2} stagger={0.5} />
      <MorphAxis g={G} m={m} p={ease(frame, [2, 14], [0, 1])} />
      <Pop at={NORMAL - 2} out={SWITCH - 4} x={540} y={430} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text, whiteSpace: "nowrap" }}>
          ON A <span style={{ color: RAW, textShadow: glowText(RAW, 0.5) }}>NORMAL</span> SCALE
        </div>
      </Pop>
      <Bracket x0={G.x0 + 4} x1={G.x0 + 4 * lw - 4} y={880} p={left} color={RAW} size={28} label="BUNCHED ON THE LEFT" />
      <Bracket x0={G.x0 + 5 * lw + 4} x1={G.x0 + 12 * lw - 4} y={1010} p={right} color={RAW} size={28} label="A FEW FAR RIGHT" />
      <Pop at={SWITCH - 2} x={540} y={430} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
          ON A <span style={{ color: LOG, textShadow: glowText(LOG, 0.5) }}>LOG</span> SCALE
        </div>
      </Pop>
      {curve > 0.001 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d={pts} fill="none" stroke={C.green} strokeWidth={5} strokeDasharray="12 10" strokeLinecap="round" />
        </svg>
      ) : null}
      <Pop at={BELL + 8} x={540} y={560} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          A SYMMETRIC <span style={{ color: C.green, textShadow: glowText(C.green, 0.5) }}>BELL</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
