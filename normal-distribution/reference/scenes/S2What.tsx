// SCENE 2 — WHAT SKEW IS. A balanced histogram tips over into a lopsided one: most values pile up on the left,
// a long orange tail stretches right → "the tail's direction names the skew": TAIL RIGHT = RIGHT-SKEWED.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bars, binX, type Geo, RIGHT, SYM } from "../components/Hist";
import { Arrow } from "../components/Icons";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const O = kindColor.outlier;
const G: Geo = { x0: 156, bw: 56, gap: 8, base: 1140, maxH: 400, maxC: 13 };

export const S2What: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s2");
  const LOP = s.cueS(0, "lopsided.");
  const PILE = s.cueS(1, "pile");
  const TAIL = s.cueS(1, "tail");
  const NAME = s.sent(2).from;

  const m = ease(frame, [LOP - 6, LOP + 14], [0, 1], theme.ease.inOut);
  const counts = SYM.map((c, i) => interpolate(m, [0, 1], [c, RIGHT[i]]));
  const grow = SYM.map((_, i) => spr(4 + i * 2, theme.spring.smooth));
  const pile = ease(frame, [PILE - 4, PILE + 10], [0, 1], theme.ease.inOut);
  const tail = ease(frame, [TAIL - 4, TAIL + 14], [0, 1], theme.ease.inOut);
  const tipped = m > 0.5;

  return (
    <AbsoluteFill>
      <SceneTitle label="WHAT IS SKEW?" color={O} at={2} />
      <Pop at={6} out={LOP - 4} x={540} y={520} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: "#E4EEFF", whiteSpace: "nowrap" }}>BALANCED</div>
      </Pop>
      <Pop at={LOP - 2} x={540} y={520} from="scale" scaleFrom={1.6} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: O, textShadow: glowText(O, 0.6), transform: "skewX(-10deg)", whiteSpace: "nowrap" }}>LOPSIDED!</div>
      </Pop>

      <div style={{ position: "absolute", left: 130, top: G.base + 2, width: 820 * ease(frame, [2, 16], [0, 1]), height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      <Bars g={G} counts={counts} p={grow} color={C.cyan} tailColor={tipped && tail > 0.3 ? O : undefined} tail={6} />

      {/* most values pile up here */}
      {pile > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: binX(G, 2) - 30, top: 640, width: (binX(G, 5) - binX(G, 2) + 60) * pile, height: 18, borderLeft: `4px solid ${C.cyan}`, borderRight: pile > 0.97 ? `4px solid ${C.cyan}` : undefined, borderTop: `4px solid ${C.cyan}`, borderRadius: "8px 8px 0 0" }} />
          <div style={{ position: "absolute", left: (binX(G, 2) + binX(G, 5)) / 2, top: 612, transform: "translate(-50%, -50%)", opacity: pile, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.cyan, whiteSpace: "nowrap" }}>MOST VALUES PILE UP</div>
        </>
      ) : null}
      {/* the long tail */}
      {tail > 0.01 ? (
        <>
          <svg width={1080} height={200} viewBox="0 0 1080 200" style={{ position: "absolute", left: 0, top: 820, overflow: "visible" }}>
            <path d={`M${binX(G, 7) - 10} 60 L${binX(G, 7) - 10 + (binX(G, 12) - binX(G, 7) + 30) * tail} 60`} stroke={O} strokeWidth={6} strokeLinecap="round" />
            {tail > 0.9 ? <path d={`M${binX(G, 12) + 4} 44 L${binX(G, 12) + 22} 60 L${binX(G, 12) + 4} 76`} stroke={O} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          </svg>
          <div style={{ position: "absolute", left: (binX(G, 7) + binX(G, 12)) / 2, top: 840, transform: "translate(-50%, -50%)", opacity: tail, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: O, textShadow: glowText(O, 0.5), whiteSpace: "nowrap" }}>A LONG TAIL</div>
        </>
      ) : null}

      <Pop at={NAME + 4} x={540} y={1260} from="up" dist={20} cfg={theme.spring.bouncy}>
        <Tag color={O} size={30} icon={<Arrow size={30} color={O} />}>
          TAIL TO THE RIGHT = RIGHT-SKEWED
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
