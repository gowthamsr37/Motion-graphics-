// SCENE 1 — HOOK. A street of houses: most moderate, two very expensive. Their prices as dots lean left with a long
// tail to the right; change the scale and the dots fly into a bell → THE LOG-NORMAL DISTRIBUTION.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { House } from "../components/Icons";
import { Burst, ease, Pop, useSpr } from "../components/Motion";
import { MorphAxis, PriceDots, type DotGeo } from "../components/PriceDots";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const RAW = C.orange; // prices on a normal scale (skewed)
export const LOG = C.violet; // the log scale (bell)
export const ZERO = C.cyan; // counting zeros
export const GROW = C.green; // percentage growth

const G: DotGeo = { x0: 150, x1: 930, base: 1200, dot: 14 };
const HOUSES = [0.8, 0.9, 1, 0.85, 1.9, 0.95, 0.8, 2.3, 0.9];

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const FEW = s.cueS(0, "few");
  const PLOT = s.sent(1).from;
  const SCALE = s.cueS(2, "scale,");
  const TITLE = s.cueS(3, "log-normal");
  const m = ease(frame, [SCALE, SCALE + 30], [0, 1], theme.ease.inOut);
  const title = spr(TITLE - 3, theme.spring.pop);
  const housesOut = ease(frame, [TITLE - 10, TITLE], [0, 1]);

  return (
    <AbsoluteFill>
      {/* the street */}
      {HOUSES.map((k, i) => {
        const p = spr(4 + i * 3, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const big = k > 1.5;
        const glow = big && frame >= FEW - 4;
        return (
          <div key={i} style={{ position: "absolute", left: 130 + i * 102, top: 840, transform: `translate(-50%, -100%) scale(${p})`, transformOrigin: "bottom center", opacity: 1 - housesOut * 0.85, filter: glow ? `drop-shadow(0 0 16px ${alpha(RAW, 0.8)})` : undefined }}>
            <House w={70 * k} color={glow ? RAW : [C.cyan, C.violet, C.green][i % 3]} big={big} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 80, top: 842, width: 920, height: 4, borderRadius: 2, background: alpha(C.text, 0.35), opacity: spr(6, theme.spring.smooth) * (1 - housesOut * 0.85) }} />
      <Pop at={FEW - 2} out={PLOT - 4} x={540} y={420} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text, whiteSpace: "nowrap" }}>
          MOST MODERATE, <span style={{ color: RAW, textShadow: glowText(RAW, 0.5) }}>A FEW HUGE</span>
        </div>
      </Pop>
      {frame >= PLOT - 4 ? (
        <>
          <PriceDots g={G} at={PLOT} morphAt={SCALE} stagger={0.4} />
          <MorphAxis g={G} m={m} p={ease(frame, [PLOT, PLOT + 10], [0, 1])} label={["PRICE", "PRICE, LOG SCALE"]} />
        </>
      ) : null}
      <Pop at={PLOT + 20} out={SCALE - 4} x={540} y={420} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text, whiteSpace: "nowrap" }}>
          A <span style={{ color: RAW, textShadow: glowText(RAW, 0.5) }}>LONG TAIL</span> TO THE RIGHT
        </div>
      </Pop>
      <Pop at={SCALE + 24} out={TITLE - 6} x={540} y={420} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 60, color: C.text, whiteSpace: "nowrap" }}>
          A PERFECT <span style={{ color: LOG, textShadow: glowText(LOG, 0.5) }}>BELL</span>
        </div>
      </Pop>
      {title > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(title, [0, 1], [1.5, 1])})`, opacity: Math.min(1, title * 2), fontFamily: theme.fonts.display, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          <div style={{ fontSize: 76, color: C.text }}>THE LOG-NORMAL</div>
          <div style={{ fontSize: 96, background: `linear-gradient(90deg, ${RAW}, ${LOG})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 24px ${alpha(LOG, 0.5)})`, whiteSpace: "nowrap" }}>DISTRIBUTION</div>
        </div>
      ) : null}
      <Burst at={TITLE} x={540} y={440} color={LOG} count={22} radius={340} seed={7} />
    </AbsoluteFill>
  );
};
