// SCENE 7 — WHY IT MATTERS. Past ±3 SD the curve is almost flat: only 0.27% of values (about 3 in 1,000) live there.
// A 1,000-dot grid with 3 orange dots makes it concrete. Uses: flag outliers, quality control in factories.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Axis, Bell, type BellGeo, vx } from "../components/Bell";
import { LensGlyph, SceneTitle, ShieldGlyph } from "../components/Kit";
import { Burst, ease, exitP, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { SD_COL } from "./S5Rule";

const C = theme.colors;
const O = kindColor.outlier;
const G: BellGeo = { x0: 110, x1: 970, vmin: -4.3, vmax: 4.3, base: 740, peakH: 250, sigmaRef: 1 };
const COLS = 40;
const ROWS = 25;
const STEP = 18;
const GX = 540 - ((COLS - 1) * STEP) / 2;
const GY = 830;
const RARE = [57, 498, 911]; // the 3 in 1,000

export const S7Rare: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const BEYOND = s.cueS(0, "beyond");
  const RAREW = s.cueS(0, "rare");
  const W3 = s.cueS(0, "3");
  const W1000 = s.cueS(0, "1000");
  const USE = s.sent(1).from;
  const FLAG = s.cueS(1, "flag");
  const QUAL = s.cueS(1, "quality");

  const lines = ease(frame, [BEYOND - 2, BEYOND + 12], [0, 1], theme.ease.inOut);
  const tails = ease(frame, [RAREW - 6, RAREW + 6], [0, 1]);
  const gridIn = (i: number) => {
    const r = Math.floor(i / COLS);
    const c = i % COLS;
    const d = Math.hypot(c - COLS / 2, (r - ROWS / 2) * 1.4) / 26;
    return ease(frame, [W3 - 8 + d * 14, W3 + d * 14], [0, 1]);
  };
  const gridOut = exitP(frame, USE - 6, 10);
  const hot = ease(frame, [W1000 - 4, W1000 + 6], [0, 1]);
  const pulse = 1 + Math.sin(frame / 4) * 0.25 * hot;

  return (
    <AbsoluteFill>
      <SceneTitle label="WHY IT MATTERS" color={O} at={2} />
      <Bell g={G} mu={0} sigma={1} color={C.text} fill={0.07} width={5} bands={[
        { a: -1, b: 1, color: SD_COL[0], opacity: 0.32 },
        { a: -2, b: -1, color: SD_COL[1], opacity: 0.3 },
        { a: 1, b: 2, color: SD_COL[1], opacity: 0.3 },
        { a: -3, b: -2, color: SD_COL[2], opacity: 0.3 },
        { a: 2, b: 3, color: SD_COL[2], opacity: 0.3 },
      ]} />
      <Axis g={G} ticks={[-3, 0, 3].map((v) => ({ v, label: v === 0 ? "MEAN" : `${v > 0 ? "+" : "-"}3 SD`, color: v ? (lines > 0.5 ? O : undefined) : undefined, big: v !== 0 && lines > 0.5 }))} />
      {/* beyond ±3 SD: almost nothing lives out there */}
      {[-1, 1].map((sg) => {
        const x3 = vx(G, 3 * sg);
        const xe = vx(G, 4.3 * sg);
        return (
          <React.Fragment key={sg}>
            <div style={{ position: "absolute", left: x3 - 2, top: G.base - 300 * lines, height: 300 * lines, borderLeft: `4px dashed ${O}` }} />
            <div style={{ position: "absolute", left: Math.min(x3, xe), top: G.base - 300, width: Math.abs(xe - x3) * tails, height: 300, marginLeft: sg < 0 ? Math.abs(xe - x3) * (1 - tails) : 0, background: `linear-gradient(${sg < 0 ? 270 : 90}deg, ${alpha(O, 0.3)}, ${alpha(O, 0.04)})`, borderRadius: 12 }} />
            <div style={{ position: "absolute", left: Math.min(x3, xe), top: G.base - 7, width: Math.abs(xe - x3), height: 14, borderRadius: 7, background: O, boxShadow: `0 0 16px ${O}`, opacity: tails }} />
          </React.Fragment>
        );
      })}
      {[-1, 1].map((sg) => (
        <Pop key={sg} at={RAREW - 2} x={(vx(G, 3 * sg) + vx(G, 4.3 * sg)) / 2} y={G.base - 150} from="down" dist={14} cfg={theme.spring.pop}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: O, textShadow: glowText(O, 0.5), whiteSpace: "nowrap" }}>RARE</div>
        </Pop>
      ))}
      <Pop at={BEYOND - 4} x={540} y={400} from="up" dist={16} cfg={theme.spring.bouncy}>
        <Tag color={O} size={30}>BEYOND 3 SD</Tag>
      </Pop>

      {/* 1,000 dots, 3 of them orange */}
      {gridOut < 1 && frame >= W3 - 10 ? (
        <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - gridOut }}>
          <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {Array.from({ length: COLS * ROWS }, (_, i) => {
              const q = gridIn(i);
              if (q <= 0.001) return null;
              const isRare = RARE.includes(i);
              const x = GX + (i % COLS) * STEP;
              const y = GY + Math.floor(i / COLS) * STEP;
              return <circle key={i} cx={x} cy={y} r={(isRare ? 6.5 * pulse : 5) * q} fill={isRare ? O : alpha("#E4EEFF", 0.42)} style={isRare && hot > 0 ? { filter: `drop-shadow(0 0 8px ${O})` } : undefined} />;
            })}
          </svg>
          {RARE.map((i) => (
            <div key={i} style={{ position: "absolute", left: GX + (i % COLS) * STEP - 20, top: GY + Math.floor(i / COLS) * STEP - 20, width: 40, height: 40, borderRadius: 20, border: `3px solid ${O}`, opacity: hot, transform: `scale(${interpolate(hot, [0, 1], [2, 1])})` }} />
          ))}
          <Pop at={W1000 - 2} x={540} y={GY + ROWS * STEP + 36} from="up" dist={14} cfg={theme.spring.bouncy}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: C.text, whiteSpace: "nowrap" }}>
              only <span style={{ color: O, textShadow: glowText(O, 0.6) }}>3 in 1,000</span>
            </div>
          </Pop>
        </div>
      ) : null}
      {RARE.map((i, k) => (
        <Burst key={i} at={W1000 + k * 2} x={GX + (i % COLS) * STEP} y={GY + Math.floor(i / COLS) * STEP} color={O} count={8} radius={60} seed={30 + k} />
      ))}

      {/* where it is used */}
      {[
        { at: FLAG, x: 300, label: "FLAG", label2: "OUTLIERS", sub: "past 3 SD? check it", c: O, icon: <LensGlyph size={96} color={O} /> },
        { at: QUAL, x: 780, label: "QUALITY", label2: "CONTROL", sub: "spot faulty products", c: C.green, icon: <ShieldGlyph size={96} color={C.green} /> },
      ].map((k) => {
        const p = spr(k.at - 6, theme.spring.bouncy);
        if (p <= 0.001) return null;
        return (
          <div key={k.label} style={{ position: "absolute", left: k.x, top: 1060, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(1, p * 2), width: 420, height: 330, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(180deg, ${alpha(k.c, 0.2)}, rgba(14,24,64,0.9))`, border: `3px solid ${k.c}`, boxShadow: `0 0 30px ${alpha(k.c, 0.3)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            {k.icon}
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, lineHeight: 1.02, color: C.text, textAlign: "center" }}>
              {k.label}
              <br />
              <span style={{ color: k.c }}>{k.label2}</span>
            </div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, color: C.dim, whiteSpace: "nowrap" }}>{k.sub}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
