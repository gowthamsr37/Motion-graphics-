// SCENE 5 — THE 0.05 LINE. A p-value scale from 0 to 0.10 with the green 0.05 line: below it "statistically
// significant" by convention. A HABIT, NOT A LAW: 0.049 and 0.051 sit almost on top of each other → ALMOST THE SAME
// EVIDENCE.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { Tag } from "../components/Nodes";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EXT, LINE, PV } from "./S1Hook";

const C = theme.colors;
const X0 = 150;
const X1 = 930;
const VMAX = 0.1;
const px = (v: number) => X0 + (v / VMAX) * (X1 - X0);
const Y = 860;

export const S5Line: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const FIVE = s.cueS(0, "0.05");
  const SIG = s.cueS(0, "significant.");
  const HABIT = s.cueS(1, "habit,");
  const A = s.cueS(1, "0.049");
  const B = s.cueS(1, "0.051");
  const SAME = s.cueS(1, "almost");
  const axis = ease(frame, [6, 20], [0, 1]);
  const line = spr(FIVE - 4, theme.spring.bouncy);
  const zone = spr(SIG - 6, theme.spring.smooth);
  const dot = (v: number, at: number) => {
    const p = spr(at - 4, theme.spring.pop);
    return p > 0.01 ? <div style={{ position: "absolute", left: px(v) - 14, top: Y - 14, width: 28, height: 28, borderRadius: 14, background: PV, border: `3px solid ${C.text}`, boxShadow: `0 0 16px ${PV}`, transform: `scale(${p})` }} /> : null;
  };
  const label = (at: number, x: number, y: number, align: "left" | "right", v: string, verdict: string, vc: string) => {
    const p = spr(at - 2, theme.spring.pop);
    if (p <= 0.01) return null;
    return (
      <div style={{ position: "absolute", top: y, ...(align === "right" ? { right: 1080 - x } : { left: x }), transform: `translateY(-50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, transformOrigin: align === "right" ? "right center" : "left center", opacity: Math.min(1, p * 2), textAlign: align, whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 40, color: PV, textShadow: glowText(PV, 0.4) }}>{v}</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: vc }}>{verdict}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <SceneTitle label="THE 0.05 LINE" color={LINE} at={2} />
      {/* significant zone */}
      <div style={{ position: "absolute", left: X0, top: Y - 150, width: (px(0.05) - X0) * Math.min(1, zone), height: 300, borderRadius: "18px 0 0 18px", background: alpha(LINE, 0.1) }} />
      <div style={{ position: "absolute", left: X0, width: px(0.05) - X0, top: Y - 200, textAlign: "center", opacity: Math.min(1, zone), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: LINE, textShadow: glowText(LINE, 0.4), lineHeight: 1.05 }}>
        SIGNIFICANT
      </div>
      <div style={{ position: "absolute", left: px(0.05), width: X1 - px(0.05), top: Y - 200, textAlign: "center", opacity: Math.min(1, zone) * 0.85, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: C.dim, lineHeight: 1.05 }}>
        NOT SIGNIFICANT
      </div>
      {/* the scale */}
      <div style={{ position: "absolute", left: X0, top: Y - 5, width: (X1 - X0) * axis, height: 10, borderRadius: 5, background: alpha(C.text, 0.35) }} />
      {[0, 0.02, 0.04, 0.06, 0.08, 0.1].map((v) => (
        <div key={v} style={{ position: "absolute", left: px(v), top: Y + 215, transform: "translate(-50%, -50%)", opacity: axis, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: C.dim }}>{v === 0 ? "0" : v.toFixed(2)}</div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: Y + 255, textAlign: "center", opacity: axis, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: C.dim }}>p-VALUE</div>
      {/* the 0.05 line */}
      {line > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: px(0.05) - 3, top: Y - 150 * Math.min(1, line), width: 6, height: 300 * Math.min(1, line), borderRadius: 3, background: LINE, boxShadow: `0 0 14px ${LINE}` }} />
          <div style={{ position: "absolute", left: px(0.05), top: Y + 150, transform: "translate(-50%, -50%)", opacity: Math.min(1, line * 2), padding: "4px 14px", borderRadius: 999, background: alpha(LINE, 0.2), border: `2px solid ${LINE}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: C.text }}>0.05</div>
        </>
      ) : null}
      <Pop at={HABIT - 6} x={540} y={470} from="up" dist={14} cfg={theme.spring.bouncy}>
        <Tag color={EXT} size={32}>
          A HABIT, NOT A LAW OF NATURE
        </Tag>
      </Pop>
      {dot(0.049, A)}
      {dot(0.051, B)}
      {label(A, px(0.049) - 24, Y - 70, "right", "0.049", "SIGNIFICANT", LINE)}
      {label(B, px(0.051) + 24, Y + 70, "left", "0.051", "NOT SIGNIFICANT", C.dim)}
      {(() => {
        const r = spr(SAME - 6, theme.spring.bouncy);
        return r > 0.01 ? <div style={{ position: "absolute", left: 540, top: Y, width: 120, height: 76, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, r), [0, 1], [1.8, 1])})`, opacity: Math.min(1, r * 2), borderRadius: "50%", border: `4px solid ${PV}`, boxShadow: `0 0 18px ${alpha(PV, 0.6)}` }} /> : null;
      })()}
      <Pop at={SAME - 2} x={540} y={Y + 340} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 42, color: C.text, whiteSpace: "nowrap" }}>
          ALMOST THE <span style={{ color: PV, textShadow: glowText(PV, 0.5) }}>SAME EVIDENCE</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
