// SCENE 7 — STEPS 3 AND 4 (chips). IF H0 IS TRUE (average 50 g): the spread of possible sample averages (t, df 24,
// SE 0.8 g). OUR AVERAGE: 48 g → the tail at or below 48 g is about 1% (one-sided p = 0.0098) → p = 0.01 → 1% < 5%
// → REJECT H0 → THE PACKETS REALLY ARE UNDERFILLED.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Badge, FnCurve, type Geo, gx, Marker, ValueAxis } from "../components/Curve";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { tpdf } from "../components/TDist";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { ALT, DATA, LINE, NULLC } from "./S1Hook";

const C = theme.colors;
export const SG: Geo = { x0: 120, x1: 960, vmin: 46.6, vmax: 53.4, base: 1000, h: 330 };
const SE = 0.8;
const f = (v: number) => tpdf((v - 50) / SE, 24) / SE;
const FMAX = tpdf(0, 24) / SE;

export const SampleCurve: React.FC<{ at: number; mean: number; markAt: number; tailAt: number; tailColor: string; pct: string; markLabel: string; markSide?: "up" | "left"; markTop?: number }> = ({ at, mean, markAt, tailAt, tailColor, pct, markLabel, markSide = "up", markTop = 250 }) => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const draw = ease(frame, [at - 4, at + 26], [0, 1], theme.ease.inOut);
  const tail = ease(frame, [tailAt - 10, tailAt + 8], [0, 1]);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: SG.base - SG.h - 70, textAlign: "center", opacity: draw, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: NULLC }}>IF H0 IS TRUE (AVERAGE 50 g)</div>
      <FnCurve g={SG} f={f} fmax={FMAX} p={draw} color={NULLC} fill={0.12} bands={[{ a: SG.vmin, b: mean, color: tailColor, opacity: 0.7, p: tail }]} />
      <ValueAxis g={SG} p={draw} ticks={[47, 48, 49, 50, 51, 52, 53].map((v) => ({ v, label: `${v}` }))} label="AVERAGE WEIGHT OF 25 PACKETS (g)" />
      <Marker x={gx(SG, mean)} base={SG.base} top={SG.base - markTop} p={spr(markAt - 6, theme.spring.bouncy)} color={DATA} label={markLabel} side={markSide} />
      <Badge x={gx(SG, mean) - 70} y={SG.base - 60} p={spr(tailAt - 2, theme.spring.pop)} color={tailColor} size={30}>
        {pct}
      </Badge>
    </>
  );
};

export const S7Decide: React.FC = () => {
  const s = useScene("s7");
  const IF = s.sent(1).from;
  const PCT = s.cueS(1, "1%");
  const DEC = s.sent(2).from;
  const UNDER = s.cueS(2, "underfilled.");
  return (
    <AbsoluteFill>
      <SceneTitle label="STEPS 3 AND 4" color={DATA} at={2} />
      <Pop at={s.sent(0).from} x={540} y={400} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ width: 54, height: 54, borderRadius: 27, background: DATA, display: "inline-flex", alignItems: "center", justifyContent: "center", color: C.ink, fontSize: 30 }}>3</span>
          CALCULATE THE p-VALUE
        </div>
      </Pop>
      <SampleCurve at={IF} mean={48} markAt={IF + 20} tailAt={PCT} tailColor={ALT} pct="1%" markLabel="OUR AVERAGE: 48 g" />
      <Pop at={DEC - 2} x={540} y={1150} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ width: 54, height: 54, borderRadius: 27, background: ALT, display: "inline-flex", alignItems: "center", justifyContent: "center", color: C.ink, fontSize: 30 }}>4</span>
          1% <span style={{ color: C.dim }}>&lt;</span> <span style={{ color: LINE }}>5%</span>
          <span style={{ color: C.dim, fontSize: 30 }}>:</span>
          <span style={{ color: ALT, textShadow: glowText(ALT, 0.5) }}>REJECT H0</span>
        </div>
      </Pop>
      <Pop at={UNDER - 8} x={540} y={1270} from="up" dist={12} cfg={theme.spring.bouncy}>
        <Tag color={ALT} size={30}>
          THE PACKETS REALLY ARE UNDERFILLED
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
