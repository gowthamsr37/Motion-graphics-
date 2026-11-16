// SCENE 5 — WHAT IT MEANS. The commute on a 10–100 min axis: the middle half sits in an 8-minute window (22 to 30).
// A worse jam (60 → 90) stretches the range from 42 to 72, but the IQR stays 8.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Mark, Pop, Ripple, useSpr } from "../components/Motion";
import { COMMUTE, JAM, Q1, Q3, stackIdx } from "../data";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const V = kindColor.spread;
const O = kindColor.outlier;
const AXY = 1070;
// broken axis: 15–42 wide (so the everyday commutes don't overlap), then 55–95 compressed for the jam
const X = (v: number) => (v <= 42 ? 110 + (v - 15) * 16 : 640 + (v - 55) * 8);

export const S5Means: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const W22 = s.cueS(0, "22");
  const WIN = s.cueS(0, "window.");
  const WORSE = s.cueS(1, "worse");
  const MOVE = s.cueS(1, "move");

  const ax = ease(frame, [2, 16], [0, 1], theme.ease.inOut);
  const box = spr(W22 - 4, theme.spring.bouncy);
  const fly = ease(frame, [WORSE - 4, WORSE + 14], [0, 1], theme.ease.inOut);
  const jamV = interpolate(fly, [0, 1], [JAM, 90]);
  const rangeIn = ease(frame, [8, 22], [0, 1], theme.ease.inOut);

  return (
    <AbsoluteFill>
      <SceneTitle label="WHAT IT MEANS" color={V} at={2} />
      <Pop at={W22 - 4} x={540} y={560} from="up" dist={20} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 84, color: C.text, whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>
          <span style={{ color: C.cyan }}>22</span> TO <span style={{ color: C.cyan }}>30</span> <span style={{ fontSize: 40, color: C.dim }}>MIN</span>
        </div>
      </Pop>
      <Pop at={WIN - 6} x={540} y={656} from="up" dist={16}>
        <div style={{ textAlign: "center", whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: V, textShadow: glowText(V, 0.5) }}>AN 8-MINUTE WINDOW</div>
          <div style={{ marginTop: 6, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: C.dim }}>for the middle half of your days</div>
        </div>
      </Pop>

      {/* axis */}
      <div style={{ position: "absolute", left: X(15) - 10, top: AXY - 2, width: (X(42) - X(15) + 20) * ax, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      <div style={{ position: "absolute", left: X(55) - 10, top: AXY - 2, width: (X(95) - X(55) + 20) * ax, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
      {[0, 16].map((d) => (
        <div key={d} style={{ position: "absolute", left: 580 + d, top: AXY - 16, width: 4, height: 32, background: alpha(C.text, 0.6), transform: "skewX(-25deg)", opacity: ax }} />
      ))}
      {[20, 30, 40, 60, 70, 80, 90].map((v) => (
        <div key={v} style={{ position: "absolute", left: X(v), top: AXY + 32, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, color: C.dim, opacity: ax }}>{v}</div>
      ))}

      {/* the IQR box */}
      {box > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: X(Q1) - 16, top: AXY - 72, width: (X(Q3) - X(Q1) + 32) * Math.min(1, box), height: 100, boxSizing: "border-box", borderRadius: 14, background: alpha(V, 0.2), border: `4px solid ${V}`, boxShadow: `0 0 26px ${alpha(V, 0.45)}`, opacity: Math.min(1, box * 2) }} />
          <div style={{ position: "absolute", left: (X(Q1) + X(Q3)) / 2, top: AXY - 108, transform: "translate(-50%, -50%)", opacity: Math.min(1, box * 2), display: "flex", alignItems: "center", gap: 8, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: frame >= MOVE ? kindColor.median : V, textShadow: glowText(frame >= MOVE ? kindColor.median : V, 0.5), whiteSpace: "nowrap" }}>
            {frame >= MOVE ? <Mark kind="check" at={MOVE} size={34} color={kindColor.median} width={13} /> : null}
            {frame >= MOVE ? "IQR STILL 8" : "IQR 8"}
          </div>
        </>
      ) : null}

      {/* the range, dragged out by the jam */}
      {rangeIn > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: X(18), top: AXY + 58, width: (X(jamV) - X(18)) * rangeIn, height: 16, borderLeft: `4px dashed ${O}`, borderRight: `4px dashed ${O}`, borderBottom: `4px dashed ${O}`, borderRadius: "0 0 8px 8px" }} />
          <div style={{ position: "absolute", left: (X(18) + X(jamV)) / 2, top: AXY + 106, transform: "translate(-50%, -50%)", opacity: rangeIn, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, color: O, whiteSpace: "nowrap" }}>RANGE {Math.round(jamV - 18)}</div>
        </>
      ) : null}

      {/* the days */}
      {COMMUTE.map((v, i) => {
        const p = spr(4 + i * 2, theme.spring.pop);
        if (p <= 0.001) return null;
        const isJam = v === JAM;
        const x = X(isJam ? jamV : v);
        const y = AXY - stackIdx(COMMUTE, i) * 34 - (isJam ? 60 * Math.sin(Math.PI * fly) : 0);
        const col = isJam ? O : kindColor.data;
        return <div key={i} style={{ position: "absolute", left: x - 15, top: y - 15, width: 30, height: 30, borderRadius: 15, background: col, boxShadow: `0 0 12px ${alpha(col, 0.8)}`, transform: `scale(${p})`, zIndex: 3 }} />;
      })}
      <Pop at={WORSE + 6} x={X(90)} y={AXY - 74} from="down" dist={14} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: O, whiteSpace: "nowrap" }}>90 MIN JAM</div>
      </Pop>
      <Ripple at={MOVE} x={(X(Q1) + X(Q3)) / 2} y={AXY - 20} color={kindColor.median} size={260} rings={1} flat={0.5} />
    </AbsoluteFill>
  );
};
