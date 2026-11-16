// SCENE 6 — READING A Z-SCORE. The sign is the side: right half (positive, above the mean) and left half (negative, below).
// Zero is exactly average. The bigger the size, the more unusual: the dot steps out to 1, 2, 3 (common → unusual → rare).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Axis, Bell, type BellGeo, curveY, vx } from "../components/Bell";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const G: BellGeo = { x0: 110, x1: 970, vmin: -3.6, vmax: 3.6, base: 920, peakH: 270, sigmaRef: 1 };
export const POS = C.green;
export const NEG = C.cyan;

export const S6Reading: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const SIGN = s.sent(0).from;
  const POSW = s.cueS(1, "Positive");
  const NEGW = s.cueS(1, "Negative");
  const ZERO = s.sent(2).from;
  const SIZE = s.sent(3).from;
  const BIG = s.cueS(3, "bigger");
  const UNU = s.cueS(3, "unusual");
  const pos = ease(frame, [POSW - 4, POSW + 10], [0, 1]);
  const neg = ease(frame, [NEGW - 4, NEGW + 10], [0, 1]);
  const halves = 1 - 0.55 * ease(frame, [ZERO - 4, ZERO + 10], [0, 1]);
  // the dot: +1.5 → −1.5 → 0 → 1 → 2 → 3
  const keys: [number, number][] = [
    [0, 0.6],
    [POSW, 1.5],
    [NEGW, -1.5],
    [ZERO, 0],
    [BIG - 2, 1],
    [BIG + 14, 2],
    [UNU - 2, 3],
  ];
  let z = keys[0][1];
  for (let i = 1; i < keys.length; i++) z = interpolate(ease(frame, [keys[i][0] - 4, keys[i][0] + 10], [0, 1], theme.ease.inOut), [0, 1], [z, keys[i][1]]);
  const dotC = z > 0.25 ? POS : z < -0.25 ? NEG : C.text;
  const rare = Math.max(0, Math.abs(z) - 1.6) / 1.4;
  const word = frame >= SIZE ? (Math.abs(z) > 2.5 ? "RARE!" : Math.abs(z) > 1.5 ? "UNUSUAL" : "COMMON") : null;
  const wordC = Math.abs(z) > 2.5 ? C.orange : Math.abs(z) > 1.5 ? C.violet : C.text;
  const y = curveY(G, 0, 1, z);

  return (
    <AbsoluteFill>
      <SceneTitle label="READING A Z-SCORE" color={C.green} at={2} />
      <Pop at={SIGN - 2} out={SIZE - 6} x={540} y={420} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 64, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: POS }}>SIGN</span> = SIDE
        </div>
      </Pop>
      <Pop at={SIZE - 2} x={540} y={420} from="up" dist={16} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap" }}>
          <span style={{ color: C.orange }}>SIZE</span> = HOW UNUSUAL
        </div>
      </Pop>
      <Bell g={G} mu={0} sigma={1} p={ease(frame, [2, 20], [0, 1], theme.ease.inOut)} color={C.text} fill={0.06} width={5} bands={[
        ...(pos > 0.01 ? [{ a: 0, b: 3.6 * pos, color: POS, opacity: 0.42 * halves }] : []),
        ...(neg > 0.01 ? [{ a: -3.6 * neg, b: 0, color: NEG, opacity: 0.42 * halves }] : []),
      ]} />
      <Axis g={G} ticks={[-3, -2, -1, 0, 1, 2, 3].map((v) => ({ v, label: v === 0 ? "0" : `${v > 0 ? "+" : "-"}${Math.abs(v)}`, big: true, color: v > 0 && pos > 0.5 ? POS : v < 0 && neg > 0.5 ? NEG : undefined }))} />
      <div style={{ position: "absolute", left: vx(G, 3.6) + 6, top: G.base + 34, transform: "translateY(-50%)", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, color: C.green }}>z</div>
      <Pop at={POSW - 2} x={vx(G, 1.9)} y={G.base - 330} from="down" dist={14} cfg={theme.spring.pop}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, color: POS, whiteSpace: "nowrap", textShadow: glowText(POS, 0.4) }}>
          <div style={{ fontSize: 64, lineHeight: 1 }}>+</div>
          <div style={{ fontSize: 30 }}>ABOVE THE MEAN</div>
        </div>
      </Pop>
      <Pop at={NEGW - 2} x={vx(G, -1.9)} y={G.base - 330} from="down" dist={14} cfg={theme.spring.pop}>
        <div style={{ textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, color: NEG, whiteSpace: "nowrap", textShadow: glowText(NEG, 0.4) }}>
          <div style={{ fontSize: 64, lineHeight: 1 }}>-</div>
          <div style={{ fontSize: 30 }}>BELOW THE MEAN</div>
        </div>
      </Pop>
      {/* the moving dot */}
      <div style={{ position: "absolute", left: vx(G, z) - 3, top: y, height: G.base - y, width: 6, borderRadius: 3, background: dotC, opacity: ease(frame, [4, 12], [0, 1]) }} />
      <div style={{ position: "absolute", left: vx(G, z) - 20, top: y - 20, width: 40, height: 40, borderRadius: 20, background: dotC, opacity: ease(frame, [4, 12], [0, 1]), boxShadow: `0 0 ${18 + rare * 30}px ${rare > 0.3 ? C.orange : dotC}` }} />
      <div style={{ position: "absolute", left: vx(G, z), top: G.base + 110, transform: "translate(-50%, -50%)", opacity: ease(frame, [4, 12], [0, 1]), padding: "6px 20px", borderRadius: 999, background: "#0A1440", border: `3px solid ${dotC}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
        z = {z >= 0 ? (z > 0.05 ? "+" : "") : "-"}
        {Math.abs(z).toFixed(1)}
      </div>
      <Pop at={ZERO - 2} out={SIZE - 4} x={540} y={G.base + 200} from="up" dist={14} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text, whiteSpace: "nowrap" }}>
          0 = <span style={{ color: C.text, textShadow: glowText("#F3F7FF", 0.5) }}>EXACTLY AVERAGE</span>
        </div>
      </Pop>
      {word ? (
        <div style={{ position: "absolute", left: 540, top: G.base + 210, transform: `translate(-50%, -50%) scale(${1 + rare * 0.15})`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: wordC, textShadow: glowText(wordC, 0.6), whiteSpace: "nowrap", opacity: spr(SIZE, theme.spring.snappy) }}>
          {word}
        </div>
      ) : null}
      {word ? (
        <div style={{ position: "absolute", left: 240, top: G.base + 290, width: 600, height: 18, borderRadius: 9, background: alpha("#F3F7FF", 0.12), overflow: "hidden" }}>
          <div style={{ width: `${(Math.abs(z) / 3) * 100}%`, height: "100%", borderRadius: 9, background: `linear-gradient(90deg, ${C.text}, ${C.violet}, ${C.orange})`, backgroundSize: "600px 100%" }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
