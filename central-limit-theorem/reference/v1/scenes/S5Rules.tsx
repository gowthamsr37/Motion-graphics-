// SCENE 5 — TWO RULES. The bell of sample means is centred on the TRUE MEAN, and it narrows as n grows
// (n = 4 → 16 → 36: spread SD/2 → SD/4 → SD/6). Spread = SD ÷ √n, called the STANDARD ERROR.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo, vx } from "../components/Bell";
import { Radical } from "../components/Clt";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { MEANS, SE } from "./S1Hook";

const C = theme.colors;
const G: BellGeo = { x0: 110, x1: 970, vmin: -4, vmax: 4, base: 1160, peakH: 150, sigmaRef: 0.5 };

export const S5Rules: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const TRUE = s.cueS(0, "true");
  const BIG = s.sent(1).from;
  const NAR = s.cueS(1, "narrower.");
  const SPREAD = s.sent(2).from;
  const ROOT = s.cueS(2, "square");
  const SEW = s.sent(3).from;
  const k1 = ease(frame, [BIG + 4, BIG + 22], [0, 1], theme.ease.inOut);
  const k2 = ease(frame, [NAR - 4, NAR + 14], [0, 1], theme.ease.inOut);
  const n = k2 > 0.5 ? 36 : k1 > 0.5 ? 16 : 4;
  const sigma = interpolate(k1, [0, 1], [0.5, 0.25]) * interpolate(k2, [0, 1], [1, 2 / 3]);
  const se = ease(frame, [SPREAD + 4, SPREAD + 20], [0, 1]);

  return (
    <AbsoluteFill>
      <SceneTitle label="TWO RULES" color={MEANS} at={2} />
      {/* ghosts of the wider bells */}
      {k1 > 0.3 ? <Bell g={G} mu={0} sigma={0.5} color="#A3B0D6" fill={0} width={3} dashed /> : null}
      {k2 > 0.3 ? <Bell g={G} mu={0} sigma={0.25} color="#A3B0D6" fill={0} width={3} dashed /> : null}
      <Bell g={G} mu={0} sigma={sigma} p={ease(frame, [4, 22], [0, 1], theme.ease.inOut)} color={MEANS} fill={0.25} width={6} />
      <div style={{ position: "absolute", left: G.x0 - 10, top: G.base - 2, width: G.x1 - G.x0 + 20, height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
      {/* rule 1: centred on the true mean */}
      <div style={{ position: "absolute", left: vx(G, 0) - 2, top: 660, height: (G.base - 660) * ease(frame, [TRUE - 4, TRUE + 10], [0, 1]), borderLeft: `4px dashed ${C.text}` }} />
      <Pop at={TRUE - 2} x={vx(G, 0)} y={636} from="down" dist={12} cfg={theme.spring.pop}>
        <div style={{ padding: "4px 18px", borderRadius: 999, background: "#0A1440", border: `3px solid ${C.text}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.text, whiteSpace: "nowrap" }}>TRUE MEAN</div>
      </Pop>
      {/* rule 2: narrower with n */}
      <Pop at={BIG - 2} x={230} y={800} from="left" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ padding: "8px 22px", borderRadius: 18, background: "#0A1440", border: `3px solid ${MEANS}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          n = <span style={{ color: MEANS }}>{n}</span>
        </div>
      </Pop>
      {/* ±1 standard error under the axis */}
      {se > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: vx(G, -sigma), top: G.base + 40, width: (vx(G, sigma) - vx(G, -sigma)) * se, height: 5, borderRadius: 3, background: SE }} />
          <div style={{ position: "absolute", left: vx(G, -sigma) - 2, top: G.base + 26, width: 4, height: 32, background: SE }} />
          <div style={{ position: "absolute", left: vx(G, -sigma) + (vx(G, sigma) - vx(G, -sigma)) * se - 2, top: G.base + 26, width: 4, height: 32, background: SE }} />
          <div style={{ position: "absolute", left: vx(G, 0), top: G.base + 84, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: SE, whiteSpace: "nowrap", opacity: se }}>SPREAD</div>
        </>
      ) : null}
      <Pop at={SPREAD - 2} x={540} y={440} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 60, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: SE }}>SPREAD</span> = SD ÷{" "}
          <span style={{ opacity: ease(frame, [ROOT - 4, ROOT + 6], [0, 1]) }}>
            <Radical color={C.text} size={60}>
              n
            </Radical>
          </span>
        </div>
      </Pop>
      <Pop at={SEW - 2} x={540} y={540} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <Pill label="THE STANDARD ERROR" color={SE} size={36} glow={0.8} />
      </Pop>
      <Pop at={NAR + 16} x={850} y={800} from="right" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap", textShadow: glowText(MEANS, 0.4) }}>NARROWER</div>
      </Pop>
    </AbsoluteFill>
  );
};
