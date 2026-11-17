// SCENE 5 — THE SURPRISE: the average gap is 15 min, yet 63% of gaps are shorter (0–15 shaded green, 15–60 orange =
// 37% longer). A few very long gaps (orange dots out on the tail) pull the average up.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Arrow } from "../components/Icons";
import { ExpCurve, ey, MinAxis, tx } from "../components/Exp";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { glowText, theme } from "../theme";
import { useScene } from "../timing";
import { GAP, LONG, RATE, SHORT } from "./S1Hook";
import { Badge, G } from "./S4Shape";

const C = theme.colors;
const TAIL = [38, 47, 56];

export const S5Surprise: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const AVG = s.cueS(1, "average");
  const P63 = s.cueS(1, "63%");
  const FEW = s.sent(2).from;
  const PULL = s.cueS(2, "pull");
  const mark = spr(AVG - 2, theme.spring.bouncy);
  const short = ease(frame, [P63 - 4, P63 + 14], [0, 1]);
  const long = ease(frame, [P63 + 8, P63 + 26], [0, 1]);

  return (
    <AbsoluteFill>
      <SceneTitle label="THE SURPRISE" color={RATE} at={2} />
      <ExpCurve g={G} color={GAP} bands={[{ a: 0, b: 15, color: SHORT, p: short }, { a: 15, b: 60, color: LONG, p: long, opacity: 0.4 }]} />
      <MinAxis g={G} ticks={[0, 15, 30, 45, 60]} hi={{ 15: RATE }} />
      {/* the average line */}
      {mark > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: tx(G, 15) - 3, top: G.base - (G.base - (ey(G, 15, 15) - 200)) * Math.min(1, mark), width: 6, height: (G.base - (ey(G, 15, 15) - 200)) * Math.min(1, mark), background: RATE, boxShadow: `0 0 16px ${RATE}`, borderRadius: 3 }} />
          <div style={{ position: "absolute", left: tx(G, 15) + 18, top: ey(G, 15, 15) - 180, transform: "translateY(-50%)", opacity: Math.min(1, mark * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: RATE, whiteSpace: "nowrap", textShadow: glowText(RATE, 0.4) }}>AVERAGE 15 MIN</div>
        </>
      ) : null}
      <Badge x={tx(G, 6)} y={ey(G, 6, 15) + 150} p={spr(P63 + 2, theme.spring.pop)} color={SHORT} size={30}>63%</Badge>
      <Badge x={tx(G, 30)} y={ey(G, 30, 15) - 60} p={spr(P63 + 18, theme.spring.pop)} color={LONG} size={30}>37%</Badge>
      <Pop at={P63 - 4} out={FEW - 4} x={540} y={430} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: SHORT, textShadow: glowText(SHORT, 0.5) }}>63%</span> ARE SHORTER
        </div>
      </Pop>
      <Pop at={P63 + 4} out={FEW - 4} x={540} y={510} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.14em", color: C.dim, whiteSpace: "nowrap" }}>THAN THE AVERAGE GAP</div>
      </Pop>
      {/* long gaps out on the tail */}
      {TAIL.map((t, i) => {
        const p = spr(FEW + 2 + i * 5, theme.spring.pop);
        return p > 0.01 ? <div key={t} style={{ position: "absolute", left: tx(G, t) - 15, top: G.base - 15, width: 30, height: 30, borderRadius: 15, background: LONG, boxShadow: `0 0 16px ${LONG}`, transform: `scale(${p * (1 + 0.1 * Math.sin(frame / 4 + i))})` }} /> : null;
      })}
      <Pop at={FEW} x={540} y={430} from="up" dist={14}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          A FEW <span style={{ color: LONG, textShadow: glowText(LONG, 0.5) }}>LONG GAPS</span>
        </div>
      </Pop>
      <Pop at={PULL - 2} x={540} y={510} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          PULL THE <span style={{ color: RATE }}>AVERAGE</span> UP
          <div style={{ transform: `translateX(${Math.sin(frame / 5) * 6}px)` }}>
            <Arrow size={36} color={RATE} />
          </div>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
