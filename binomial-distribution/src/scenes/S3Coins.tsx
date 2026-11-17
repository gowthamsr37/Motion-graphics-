// SCENE 3 — THREE COIN FLIPS. Flip 3 times and count heads: the 8 possible results (a 4 × 2 grid) drop into bars by
// their number of heads on the spoken words → 1, 3, 3, 1 out of 8: a binomial shape.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Coin } from "../components/Prob";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { BARS } from "./S1Hook";

const C = theme.colors;
const RESULTS = ["HHH", "HHT", "HTH", "THH", "HTT", "THT", "TTH", "TTT"];
const heads = (r: string) => r.split("").filter((c) => c === "H").length;
const SLOT = (() => {
  const c: Record<number, number> = {};
  return RESULTS.map((r) => {
    const h = heads(r);
    c[h] = (c[h] ?? 0) + 1;
    return c[h] - 1;
  });
})();
const COLX = [225, 435, 645, 855];
const BASE = 1250;
const BH = 74;

export const S3Coins: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const FLIP = s.cueS(0, "Flip");
  const EIGHT = s.sent(1).from;
  // "one" and "three" are each spoken more than once in this sentence ("one way", "three ways"): pick the right ones
  const groupAt = [s.cueS(2, "Zero"), s.cueS(2, "One", 1), s.cueS(2, "Two"), s.cueS(2, "Three", 2)];
  const SHAPE = s.sent(3).from;
  const coinsOut = ease(frame, [EIGHT - 6, EIGHT + 4], [0, 1]);

  return (
    <AbsoluteFill>
      <SceneTitle label="START SMALL" pill="3 COIN FLIPS" color={BARS} at={2} pillAt={FLIP - 4} />
      {/* three coins flipping */}
      {coinsOut < 1
        ? [0, 1, 2].map((i) => {
            const p = spr(FLIP - 4 + i * 4, theme.spring.bouncy);
            const ang = (frame - FLIP) * 0.35 + i * 1.1;
            return (
              <div key={i} style={{ position: "absolute", left: 340 + i * 200, top: 700 - Math.abs(Math.sin(ang / 2)) * 60, transform: `translate(-50%, -50%) scale(${p * (1 - coinsOut * 0.4)})`, opacity: 1 - coinsOut }}>
                <Coin side={Math.floor(ang / Math.PI) % 2 === 0 ? "H" : "T"} size={150} squash={Math.cos(ang)} />
              </div>
            );
          })
        : null}
      <Pop at={FLIP + 10} out={EIGHT - 4} x={540} y={900} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
          COUNT THE <span style={{ color: C.cyan }}>HEADS</span>
        </div>
      </Pop>
      {/* the 8 results → bars */}
      {frame >= EIGHT - 4
        ? RESULTS.map((r, i) => {
            const p = spr(EIGHT - 2 + i * 3, theme.spring.pop);
            const h = heads(r);
            const f = ease(frame, [groupAt[h] - 2 + SLOT[i] * 3, groupAt[h] + 14 + SLOT[i] * 3], [0, 1], theme.ease.inOut);
            const gx = 210 + (i % 4) * 220;
            const gy = 620 + Math.floor(i / 4) * 130;
            const bx = COLX[h];
            const by = BASE - (SLOT[i] + 0.5) * (BH + 6);
            const x = interpolate(f, [0, 1], [gx, bx]);
            const y = interpolate(f, [0, 1], [gy, by]);
            return (
              <div key={r} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2), width: 190, height: interpolate(f, [0, 1], [110, BH]), boxSizing: "border-box", borderRadius: 18, background: f > 0.5 ? alpha(BARS, 0.4) : "rgba(14,24,64,0.92)", border: `3px solid ${f > 0.5 ? BARS : alpha("#F3F7FF", 0.3)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {r.split("").map((c, j) => (
                  <Coin key={j} side={c as "H" | "T"} size={interpolate(f, [0, 1], [50, 44])} />
                ))}
              </div>
            );
          })
        : null}
      <div style={{ position: "absolute", left: 100, top: BASE + 2, width: 880 * ease(frame, [groupAt[0] - 10, groupAt[0]], [0, 1]), height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
      {[0, 1, 2, 3].map((h) => (
        <div key={h} style={{ position: "absolute", left: COLX[h], top: BASE + 36, transform: "translate(-50%, -50%)", opacity: ease(frame, [groupAt[h] - 4, groupAt[h] + 6], [0, 1]), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.text, whiteSpace: "nowrap" }}>
          {h} {h === 1 ? "head" : "heads"}
        </div>
      ))}
      {[1, 3, 3, 1].map((n, h) => (
        <Pop key={h} at={SHAPE - 2 + h * 3} x={COLX[h]} y={BASE - n * (BH + 6) - 34} from="down" dist={10} cfg={theme.spring.pop}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 32, color: BARS, textShadow: glowText(BARS, 0.5), whiteSpace: "nowrap" }}>{n}/8</div>
        </Pop>
      ))}
      <Pop at={EIGHT - 2} out={groupAt[0] - 8} x={540} y={470} from="up" dist={12}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 48, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: BARS }}>8</span> POSSIBLE RESULTS
        </div>
      </Pop>
      <Pop at={SHAPE + 10} x={540} y={470} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.text, whiteSpace: "nowrap" }}>
          A <span style={{ color: BARS, textShadow: glowText(BARS, 0.5) }}>BINOMIAL</span> SHAPE
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
