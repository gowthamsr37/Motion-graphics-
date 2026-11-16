// SCENE 4 — TWO NUMBERS. MEAN and SD dials. Changing the mean slides the curve left and right; changing the SD
// makes it tall and narrow (small) or short and wide (big). The area under the curve stays the same.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo, curveY, vx } from "../components/Bell";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G: BellGeo = { x0: 120, x1: 960, vmin: -5, vmax: 5, base: 1180, peakH: 260, sigmaRef: 1 };

export const S4Params: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const TWO = s.cueS(0, "two");
  const MEANW = s.cueS(1, "mean");
  const SDW = s.cueS(2, "standard");
  const SMALL = s.cueS(3, "Small,");
  const BIGW = s.cueS(3, "Big,");
  const END = s.duration;

  // the mean wanders: 0 → −1.6 → +1.6 → 0
  const m1 = ease(frame, [MEANW + 2, MEANW + 18], [0, 1], theme.ease.inOut);
  const m2 = ease(frame, [MEANW + 22, MEANW + 42], [0, 1], theme.ease.inOut);
  const m3 = ease(frame, [SDW - 10, SDW + 4], [0, 1], theme.ease.inOut);
  const mu = interpolate(m1, [0, 1], [0, -1.6]) + interpolate(m2, [0, 1], [0, 3.2]) - interpolate(m3, [0, 1], [0, 1.6]);
  // the SD: 1 → 1.5 → 1 (while spoken), then 0.6 (small) and 1.7 (big)
  const s1 = ease(frame, [SDW + 8, SDW + 26], [0, 1], theme.ease.inOut) * (1 - ease(frame, [SDW + 32, SDW + 48], [0, 1], theme.ease.inOut));
  const sm = ease(frame, [SMALL - 4, SMALL + 12], [0, 1], theme.ease.inOut);
  const bg = ease(frame, [BIGW - 4, BIGW + 14], [0, 1], theme.ease.inOut);
  const sigma = interpolate(s1, [0, 1], [1, 1.5]) * interpolate(sm, [0, 1], [1, 0.6]) * interpolate(bg, [0, 1], [1, 1.7 / 0.6]);
  const mActive = frame >= MEANW - 4 && frame < SDW - 6;
  const sActive = frame >= SDW - 4;
  const dial = (on: boolean) => (on ? 1.12 : 1);
  const cx = vx(G, mu);

  return (
    <AbsoluteFill>
      <SceneTitle label="TWO NUMBERS DRAW IT" color={C.cyan} at={2} />
      <Pop at={TWO - 2} x={330} y={560} from="left" dist={24} cfg={theme.spring.bouncy}>
        <div style={{ transform: `scale(${dial(mActive)})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Pill label="MEAN" color={kindColor.mean} size={40} glow={mActive ? 0.9 : 0.2} />
          <div style={{ marginTop: 10, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: C.dim, whiteSpace: "nowrap" }}>WHERE IT SITS</div>
        </div>
      </Pop>
      <Pop at={TWO + 4} x={750} y={560} from="right" dist={24} cfg={theme.spring.bouncy}>
        <div style={{ transform: `scale(${dial(sActive)})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Pill label="SD" color={kindColor.spread} size={40} glow={sActive ? 0.9 : 0.2} />
          <div style={{ marginTop: 10, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: C.dim, whiteSpace: "nowrap" }}>HOW WIDE IT SPREADS</div>
        </div>
      </Pop>

      <Bell g={G} mu={mu} sigma={sigma} p={ease(frame, [4, 24], [0, 1], theme.ease.inOut)} color={C.cyan} fill={0.18} />
      <div style={{ position: "absolute", left: G.x0 - 10, top: G.base - 2, width: G.x1 - G.x0 + 20, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      {/* the mean marker */}
      <div style={{ position: "absolute", left: cx - 2.5, top: curveY(G, mu, sigma, mu) - 24, height: G.base - curveY(G, mu, sigma, mu) + 24, borderLeft: `5px solid ${kindColor.mean}`, opacity: ease(frame, [MEANW - 6, MEANW + 4], [0, 1]) }} />
      {/* ±1 SD arrows */}
      {sActive ? (
        <>
          <div style={{ position: "absolute", left: vx(G, mu - sigma), top: G.base + 30, width: vx(G, mu + sigma) - vx(G, mu - sigma), height: 0, borderTop: `5px solid ${kindColor.spread}` }} />
          <div style={{ position: "absolute", left: vx(G, mu - sigma) - 2, top: G.base + 16, width: 4, height: 30, background: kindColor.spread }} />
          <div style={{ position: "absolute", left: vx(G, mu + sigma) - 2, top: G.base + 16, width: 4, height: 30, background: kindColor.spread }} />
          <div style={{ position: "absolute", left: cx, top: G.base + 72, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: kindColor.spread, whiteSpace: "nowrap" }}>±1 SD</div>
        </>
      ) : null}
      <Pop at={SMALL - 2} out={BIGW - 4} x={540} y={680} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          SMALL SD: <span style={{ color: kindColor.spread }}>TALL &amp; NARROW</span>
        </div>
      </Pop>
      <Pop at={BIGW - 2} out={END - 8} x={540} y={680} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          BIG SD: <span style={{ color: kindColor.spread }}>SHORT &amp; WIDE</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
