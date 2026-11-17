// SCENE 5 — THE LONG TAIL. Heights: the shortest (152 cm) and tallest (188 cm) of 100 adults are ~1.2× apart.
// Spending: the smallest (₹200) and biggest (₹19,000) of 100 customers are ~100× apart. Then the 100 spends as a dot
// plot (₹1,000 bins): a pile on the left and a few dots far out to the right — the long tail.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Person } from "../components/Icons";
import { Money, SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { HEIGHTS, SPENDS } from "../data";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { FEW, MANY, MID } from "./S1Hook";

const C = theme.colors;
const H_MIN = Math.min(...HEIGHTS);
const H_MAX = Math.max(...HEIGHTS);
const S_MIN = Math.min(...SPENDS);
const S_MAX = Math.max(...SPENDS);
// dot plot geometry
const DX0 = 150;
const DX1 = 930;
const DBASE = 1270;
const BINW = (DX1 - DX0) / 20; // ₹1,000 per bin
const DOT = 8;
const PER_ROW = 4;
const SLOTS = (() => {
  const c: Record<number, number> = {};
  return SPENDS.map((v) => {
    const k = Math.min(19, Math.floor(v / 1000));
    c[k] = (c[k] ?? 0) + 1;
    return { k, i: c[k] - 1 };
  });
})();

export const S5Tail: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const HEIGHT = s.sent(1).from;
  const TEN = s.cueS(1, "ten");
  const SPEND = s.sent(2).from;
  const HUNDRED = s.cueS(2, "hundred");
  const TAIL = s.sent(3).from;
  const hp = spr(HEIGHT - 2, theme.spring.bouncy);
  const sp = ease(frame, [SPEND, SPEND + 24], [0, 1], theme.ease.out);
  const BASE = 940;

  return (
    <AbsoluteFill>
      <SceneTitle label="THE LONG TAIL" color={FEW} at={2} />
      {/* heights: shortest vs tallest */}
      <div style={{ position: "absolute", left: 160, top: 470, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: MID, opacity: Math.min(1, hp * 2) }}>HEIGHTS</div>
      {[H_MIN, H_MAX].map((h, i) => {
        const p = spr(HEIGHT + i * 5, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 220 + i * 150, top: BASE, transform: `translate(-50%, -100%) scale(${p})`, transformOrigin: "bottom center" }}>
              <Person height={(h / H_MAX) * 330} shirt={MID} />
            </div>
            <div style={{ position: "absolute", left: 220 + i * 150, top: BASE + 30, transform: "translate(-50%, -50%)", opacity: Math.min(1, p * 2), fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: C.text }}>{Math.round(h)} cm</div>
          </React.Fragment>
        );
      })}
      <Pop at={TEN - 4} x={295} y={1030} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
          only <span style={{ color: MID, textShadow: glowText(MID, 0.5) }}>1.2×</span>
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 540, top: 500, width: 3, height: 560, background: alpha("#F3F7FF", 0.15), opacity: Math.min(1, sp * 2) }} />
      {/* spending: smallest vs biggest */}
      <div style={{ position: "absolute", left: 600, top: 470, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: FEW, opacity: Math.min(1, sp * 2) }}>SPENDING</div>
      {[S_MIN, S_MAX].map((v, i) => {
        if (sp <= 0.001) return null;
        const h = Math.max(4, (v / S_MAX) * 380 * sp);
        const c = i ? FEW : MANY;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 680 + i * 160 - 40, top: BASE - h, width: 80, height: h, borderRadius: "10px 10px 3px 3px", background: alpha(c, 0.6), border: `3px solid ${c}`, boxSizing: "border-box", boxShadow: i ? `0 0 22px ${alpha(FEW, 0.5)}` : "none" }} />
            <div style={{ position: "absolute", left: 680 + i * 160, top: BASE + 30, transform: "translate(-50%, -50%)", opacity: Math.min(1, sp * 2) }}>
              <Money v={i ? "19,000" : "200"} size={24} color={C.text} />
            </div>
          </React.Fragment>
        );
      })}
      <Pop at={HUNDRED - 4} x={760} y={1030} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
          about <span style={{ color: FEW, textShadow: glowText(FEW, 0.5) }}>100×</span>
        </div>
      </Pop>
      {/* the long tail: 100 customers as a dot plot */}
      {frame >= TAIL - 6 ? (
        <>
          <div style={{ position: "absolute", left: DX0 - 10, top: DBASE + 1, width: (DX1 - DX0 + 20) * ease(frame, [TAIL - 6, TAIL + 6], [0, 1]), height: 4, background: alpha(C.text, 0.4) }} />
          {[0, 5000, 10000, 15000, 20000].map((v) => (
            <div key={v} style={{ position: "absolute", left: DX0 + (v / 20000) * (DX1 - DX0), top: DBASE + 28, transform: "translate(-50%, -50%)", opacity: ease(frame, [TAIL, TAIL + 10], [0, 1]) }}>
              <Money v={v === 0 ? "0" : `${v / 1000}K`} size={20} color={C.dim} />
            </div>
          ))}
          {SPENDS.map((v, j) => {
            const { k, i } = SLOTS[j];
            const t = TAIL - 4 + j * 0.35;
            const d = ease(frame, [t, t + 8], [0, 1], theme.ease.in);
            if (d <= 0.001) return null;
            const col = i % PER_ROW;
            const row = Math.floor(i / PER_ROW);
            const big = v >= 3000;
            const x = DX0 + k * BINW + 2 + col * (DOT + 1.5);
            const y = DBASE - 3 - (row + 1) * (DOT + 2);
            return <div key={j} style={{ position: "absolute", left: big ? DX0 + (v / 20000) * (DX1 - DX0) - 6 : x, top: interpolate(d, [0, 1], [1080, big ? DBASE - 16 : y]), width: big ? 12 : DOT, height: big ? 12 : DOT, borderRadius: 6, background: big ? FEW : MANY, boxShadow: big ? `0 0 14px ${FEW}` : "none" }} />;
          })}
          <Pop at={TAIL + 30} x={700} y={1200} from="up" dist={12} cfg={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>
              <span style={{ color: FEW, textShadow: glowText(FEW, 0.5) }}>RARE</span>, BUT <span style={{ color: FEW, textShadow: glowText(FEW, 0.5) }}>ENORMOUS</span>
            </div>
          </Pop>
          <div style={{ position: "absolute", left: 0, right: 0, top: DBASE + 62, textAlign: "center", opacity: ease(frame, [TAIL + 4, TAIL + 14], [0, 1]), fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.18em", color: C.dim }}>100 CUSTOMERS BY SPEND</div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
