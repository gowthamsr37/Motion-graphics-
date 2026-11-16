// SCENE 1 — HOOK. Three rows fill up dot by dot: heights in a class, marks in an exam, coffee poured by a machine.
// Each pile grows into the same shape; a bell outline traces over all three → "A BELL!" and they merge into one big bell.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { ChaiCup, Person } from "../components/Icons";
import { FormGlyph } from "../components/Kit";
import { Burst, ease, exitP, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const ROWS = [
  { y: 660, label: "HEIGHTS", unit: "cm", counts: [1, 2, 4, 7, 10, 12, 10, 7, 4, 2, 1], col: C.cyan },
  { y: 900, label: "EXAM MARKS", unit: "out of 100", counts: [1, 2, 5, 7, 9, 12, 11, 7, 4, 2, 1], col: C.violet },
  { y: 1140, label: "COFFEE POURS", unit: "ml", counts: [1, 3, 4, 7, 11, 12, 10, 6, 4, 2, 1], col: C.green },
];
const DX = 34;
const DOT = 14;
const COL_X = (i: number) => 480 + i * DX;
const BASE_OFF = 92;

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s1");
  const rowAt = [s.sent(0).from, s.sent(1).from, s.sent(2).from];
  const SAME = s.sent(3).from;
  const BELL = s.sent(4).from;
  const END = s.duration;

  const trace = ease(frame, [SAME + 6, SAME + 30], [0, 1], theme.ease.inOut);
  const merge = ease(frame, [BELL - 6, BELL + 12], [0, 1], theme.ease.inOut);
  const big: BellGeo = { x0: 140, x1: 940, vmin: -3.6, vmax: 3.6, base: 1160, peakH: 380, sigmaRef: 1 };
  const slam = spr(BELL - 2, theme.spring.pop);
  const endOut = exitP(frame, END - 8, 8);

  return (
    <AbsoluteFill>
      {merge < 1
        ? ROWS.map((r, k) => {
            const at = rowAt[k];
            const p = spr(at - 4, theme.spring.smooth);
            if (p <= 0.001) return null;
            const base = r.y + BASE_OFF;
            const total = r.counts.reduce((a, b) => a + b, 0);
            // drop the dots in a pseudo-random order over ~30 frames
            const order: [number, number][] = [];
            r.counts.forEach((c, i) => {
              for (let j = 0; j < c; j++) order.push([i, j]);
            });
            order.sort((a, b) => ((a[0] * 7 + a[1] * 13 + k * 5) % 17) - ((b[0] * 7 + b[1] * 13 + k * 5) % 17) || a[1] - b[1]);
            const g: BellGeo = { x0: COL_X(0) - DX * 0.5, x1: COL_X(10) + DX * 0.5, vmin: -2.75, vmax: 2.75, base, peakH: 12 * (DOT + 1), sigmaRef: 1 };
            return (
              <div key={r.label} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 1.5) * (1 - merge), transform: `translateY(${(1 - p) * 40}px)` }}>
                <div style={{ position: "absolute", left: 90, top: r.y - 100, width: 900, height: 210, boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(90deg, ${alpha(r.col, 0.16)}, rgba(14,24,64,0.88) 45%)`, border: `2px solid ${alpha(r.col, 0.55)}` }} />
                <div style={{ position: "absolute", left: 130, top: r.y - 48, display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ width: 70, height: 96, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                    {k === 0 ? <Person height={96} shirt={r.col} /> : k === 1 ? <FormGlyph size={70} color={r.col} /> : <ChaiCup w={66} />}
                  </div>
                  <div>
                    <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>{r.label}</div>
                    <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 20, color: alpha(r.col, 0.95), letterSpacing: "0.12em" }}>{r.unit.toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ position: "absolute", left: COL_X(0) - 20, top: base + 2, width: DX * 10 + 40, height: 3, background: alpha(C.text, 0.35) }} />
                {order.map(([i, j], n) => {
                  const t = at + 2 + (n / total) * 30;
                  const d = ease(frame, [t, t + 6], [0, 1], theme.ease.in);
                  if (d <= 0.001) return null;
                  const y = base - (j + 0.5) * (DOT + 1);
                  return <div key={n} style={{ position: "absolute", left: COL_X(i) - DOT / 2, top: interpolate(d, [0, 1], [r.y - 110, y]) - DOT / 2, width: DOT, height: DOT, borderRadius: DOT / 2, background: r.col, boxShadow: `0 0 6px ${alpha(r.col, 0.7)}`, opacity: Math.min(1, d * 2) }} />;
                })}
                {trace > 0.01 ? <Bell g={g} mu={0} sigma={1} p={trace} color={C.text} fill={0} width={4} /> : null}
              </div>
            );
          })
        : null}

      {/* they all become one bell */}
      {merge > 0.01 ? (
        <AbsoluteFill style={{ opacity: merge * (1 - endOut * 0) }}>
          <Bell g={big} mu={0} sigma={1} p={1} color={C.cyan} fill={0.18} />
        </AbsoluteFill>
      ) : null}
      {slam > 0.001 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", transform: `translateY(-50%) scale(${interpolate(slam, [0, 1], [1.7, 1])})`, opacity: Math.min(1, slam * 2) * (1 - endOut), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 150, letterSpacing: "-0.02em", lineHeight: 1 }}>
          <span style={{ background: `linear-gradient(180deg, #FFFFFF, ${C.cyan})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 26px ${alpha(C.cyan, 0.55)})` }}>A BELL!</span>
        </div>
      ) : null}
      <Burst at={BELL} x={540} y={900} color={C.cyan} count={22} radius={340} seed={7} />
      {frame < SAME + 40 && frame > SAME - 10 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", opacity: ease(frame, [SAME - 4, SAME + 6], [0, 1]) * (1 - ease(frame, [BELL - 8, BELL - 2], [0, 1])), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 56, color: C.text, whiteSpace: "nowrap", textShadow: glowText(C.text, 0.2) }}>
          SAME <span style={{ color: C.cyan }}>SHAPE</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
