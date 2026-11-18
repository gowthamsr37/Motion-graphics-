// SCENE 5 — THE TEST. NULL: BOTH BUTTONS CONVERT THE SAME. If so, the gap between two random groups of 5,000 would
// wobble around 0 with SE 0.56 points: a gap of 1.2 points or more (either way) happens about 3% of the time
// (z = 2.14, two-sided p = 0.032) → p = 0.03.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NULLC, PLess, PV, RES } from "../components/AB";
import { Badge, FnCurve, type Geo, gx, Marker, ValueAxis } from "../components/Curve";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G: Geo = { x0: 120, x1: 960, vmin: -2.2, vmax: 2.2, base: 1020, h: 340 };
const npdf = (x: number) => Math.exp(-(x * x) / 2) / Math.sqrt(2 * Math.PI);
const f = (v: number) => npdf(v / RES.se) / RES.se;
const FMAX = npdf(0) / RES.se;
const GAP = 1.2;

export const S5Test: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const NULLW = s.cueS(0, "null");
  const IF = s.sent(1).from;
  const BIG = s.cueS(1, "big");
  const PCT = s.cueS(1, "3%");
  const PVW = s.cueS(2, "p-value");
  const draw = ease(frame, [IF - 4, IF + 26], [0, 1], theme.ease.inOut);
  const tails = ease(frame, [PCT - 10, PCT + 8], [0, 1]);
  return (
    <AbsoluteFill>
      <SceneTitle label="THE TEST" color={PV} at={2} />
      <Pop at={NULLW - 6} x={540} y={410} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={NULLC} size={30}>
          NULL: BOTH BUTTONS CONVERT THE SAME
        </Tag>
      </Pop>
      <Pop at={IF - 2} x={540} y={540} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.dim, whiteSpace: "nowrap" }}>IF THAT WERE TRUE, THE GAP WOULD BE...</div>
      </Pop>
      <FnCurve g={G} f={f} fmax={FMAX} p={draw} color={NULLC} fill={0.12} bands={[
        { a: GAP, b: G.vmax, color: C.orange, opacity: 0.7, p: tails },
        { a: G.vmin, b: -GAP, color: C.orange, opacity: 0.7, p: tails },
      ]} />
      <ValueAxis g={G} p={draw} ticks={[-2, -1, 0, 1, 2].map((v) => ({ v, label: v > 0 ? `+${v}` : v < 0 ? `−${-v}` : "0" }))} label="GAP IN PURCHASE RATE (POINTS)" />
      <Marker x={gx(G, GAP)} base={G.base} top={G.base - 250} p={spr(BIG - 8, theme.spring.bouncy)} color={PV} label="OUR GAP: +1.2" />
      <Badge x={gx(G, 1.75)} y={G.base - 70} p={spr(PCT - 2, theme.spring.pop)} color={C.orange} size={28}>
        1.6%
      </Badge>
      <Badge x={gx(G, -1.75)} y={G.base - 70} p={spr(PCT - 2, theme.spring.pop)} color={C.orange} size={28}>
        1.6%
      </Badge>
      <Pop at={PCT + 6} x={540} y={1150} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.orange, whiteSpace: "nowrap" }}>A GAP THIS BIG, EITHER WAY: ABOUT 3%</div>
      </Pop>
      <Pop at={PVW - 4} x={540} y={1270} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ padding: "14px 40px", borderRadius: 999, background: alpha(PV, 0.2), border: `4px solid ${PV}`, boxShadow: `0 0 30px ${alpha(PV, 0.4)}` }}>
          <PLess v="0.03" size={64} />
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
