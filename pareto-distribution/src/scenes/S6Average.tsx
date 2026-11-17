// SCENE 6 — THE AVERAGE TRAP (exact 80/20 Pareto, minimum ₹200): the curve on ₹0–3,000; the average ≈ ₹1,440 (violet);
// the typical (median) customer ≈ ₹363 (green); 90% of customers spend less than the average (band + 9 of 10 people);
// so use the median.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FnCurve, type Geo, gx, gy, Marker, ValueAxis } from "../components/Curve";
import { Person } from "../components/Icons";
import { Money, SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { ALPHA, MEAN, MEDIAN, XM } from "../data";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { AVG, FEW, MANY, MID } from "./S1Hook";

const C = theme.colors;
const G: Geo = { x0: 150, x1: 930, vmin: 0, vmax: 3000, base: 1130, h: 400 };
export const pareto = (v: number) => (v < XM ? 0 : Math.pow(XM / v, ALPHA + 1));

export const S6Average: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const AV = s.sent(1).from;
  const TYP = s.sent(2).from;
  const T360 = s.cueS(2, "360.");
  const NINE = s.sent(3).from;
  const MED = s.sent(4).from;
  const draw = ease(frame, [6, 34], [0, 1], theme.ease.inOut);
  const band = ease(frame, [NINE + 2, NINE + 22], [0, 1]);

  return (
    <AbsoluteFill>
      <SceneTitle label="THE AVERAGE TRAP" color={AVG} at={2} />
      <FnCurve g={G} f={pareto} fmax={1} p={draw} color={FEW} fill={0.16} bands={[{ a: XM, b: MEAN, color: MID, p: band, opacity: 0.45 }]} />
      <ValueAxis g={G} ticks={[{ v: 0, label: "0" }, { v: XM, label: "200", color: MANY }, ...[1000, 2000, 3000].map((v) => ({ v, label: `${v / 1000}K` }))]} p={ease(frame, [2, 14], [0, 1])} label="SPEND PER CUSTOMER (RUPEES)" />
      <div style={{ position: "absolute", left: gx(G, XM), top: G.base + 56, transform: "translate(-50%, -50%)", opacity: ease(frame, [20, 30], [0, 1]), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 16, letterSpacing: "0.12em", color: MANY, whiteSpace: "nowrap" }}>SMALLEST</div>
      <Marker x={gx(G, MEAN)} base={G.base} top={790} p={spr(AV + 2, theme.spring.bouncy)} color={AVG} label={<span style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>AVERAGE <Money v="1,400" size={30} color={AVG} /></span>} size={30} />
      <Marker x={gx(G, MEDIAN)} base={G.base} top={640} p={spr(TYP + 4, theme.spring.bouncy)} color={MID} label={<span style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>TYPICAL <Money v={360} size={30} color={MID} /></span>} side="right" size={30} />
      <Pop at={T360 + 4} x={gx(G, MEDIAN) + 20} y={690} from="up" dist={10}>
        <div style={{ transform: "translateX(50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color: C.dim, whiteSpace: "nowrap" }}>THE ONE IN THE MIDDLE</div>
      </Pop>
      {/* 9 in 10 spend less than the average */}
      {Array.from({ length: 10 }, (_, i) => {
        const p = spr(NINE + 4 + i * 3, theme.spring.bouncy);
        if (p <= 0.001) return null;
        const below = i < 9;
        return (
          <div key={i} style={{ position: "absolute", left: 300 + i * 54, top: 1330, transform: `translate(-50%, -100%) scale(${p})`, transformOrigin: "bottom center" }}>
            <Person height={84} shirt={below ? MID : FEW} />
          </div>
        );
      })}
      <Pop at={NINE + 34} x={190} y={1290} from="left" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: MID, textShadow: glowText(MID, 0.5), whiteSpace: "nowrap" }}>9 in 10</div>
      </Pop>
      <Pop at={NINE + 10} x={gx(G, 800)} y={1060} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: C.text, whiteSpace: "nowrap", padding: "4px 12px", borderRadius: 10, background: alpha(MID, 0.25) }}>SPEND LESS THAN AVERAGE</div>
      </Pop>
      <Pop at={MED - 2} x={540} y={470} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={MID} size={34}>
          LONG TAIL? USE THE <span style={{ color: MID }}>MEDIAN</span>
        </Tag>
      </Pop>
    </AbsoluteFill>
  );
};
