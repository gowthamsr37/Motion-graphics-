// SCENE 6 — THE RULE. SMALL p: SURPRISING → EVIDENCE AGAINST THE NULL. BIG p: NOT SURPRISING → NO EVIDENCE. A p-value
// scale (0 to 0.5) with our two coins (0.01, 0.38), then the green 0.05 line: BELOW IT = STATISTICALLY SIGNIFICANT.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneTitle } from "../components/Kit";
import { ease, Pop, useSpr } from "../components/Motion";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { EXT, LINE, NULLC } from "./S1Hook";

const C = theme.colors;
const X0 = 150;
const X1 = 930;
const px = (v: number) => X0 + (v / 0.5) * (X1 - X0);
const Y = 1010;

const RuleRow: React.FC<{ y: number; at: number; p: string; a: string; b: string; c: string }> = ({ y, at, p, a, b, c }) => {
  const spr = useSpr();
  const k = spr(at - 6, theme.spring.bouncy);
  if (k <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 150, transform: `translateY(-50%) translateX(${(1 - Math.min(1, k)) * -40}px)`, opacity: Math.min(1, k * 2), boxSizing: "border-box", borderRadius: 28, background: `linear-gradient(90deg, ${alpha(c, 0.2)}, rgba(14,24,64,0.92) 60%)`, border: `3px solid ${c}`, display: "flex", alignItems: "center", paddingLeft: 34, gap: 28 }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: c, textShadow: glowText(c, 0.45), whiteSpace: "nowrap", width: 230 }}>{p}</div>
      <div>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 38, color: C.text }}>{a}</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: C.dim, marginTop: 4 }}>{b}</div>
      </div>
    </div>
  );
};

export const S6Rule: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s6");
  const SMALL = s.cueS(1, "Small");
  const BIG = s.cueS(1, "Big");
  const LINEW = s.cueS(2, "0.05.");
  const SIG = s.cueS(2, "significant.");
  const axis = ease(frame, [SMALL - 10, SMALL + 6], [0, 1]);
  const line = spr(LINEW - 4, theme.spring.bouncy);
  const zone = spr(SIG - 6, theme.spring.smooth);
  const dot = (v: number, at: number, color: string, label: string) => {
    const p = spr(at, theme.spring.pop);
    if (p <= 0.01) return null;
    return (
      <>
        <div style={{ position: "absolute", left: px(v) - 16, top: Y - 16, width: 32, height: 32, borderRadius: 16, background: color, border: `3px solid ${C.text}`, boxShadow: `0 0 16px ${color}`, transform: `scale(${p})` }} />
        <div style={{ position: "absolute", left: Math.max(px(v), 200), top: Y - 62, transform: `translate(-50%, -50%) scale(${interpolate(Math.min(1, p), [0, 1], [0.6, 1])})`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color, whiteSpace: "nowrap" }}>{label}</div>
      </>
    );
  };
  return (
    <AbsoluteFill>
      <SceneTitle label="THE RULE" color={LINE} at={2} />
      <RuleRow y={470} at={SMALL} p="SMALL p" a="Surprising" b="EVIDENCE AGAINST THE NULL" c={EXT} />
      <RuleRow y={650} at={BIG} p="BIG p" a="Not surprising" b="NO EVIDENCE" c={NULLC} />
      {/* scale */}
      {zone > 0.01 ? <div style={{ position: "absolute", left: X0, top: Y - 110, width: (px(0.05) - X0) * Math.min(1, zone), height: 220, background: alpha(LINE, 0.14), borderRadius: "16px 0 0 16px" }} /> : null}
      <div style={{ position: "absolute", left: X0, top: Y - 5, width: (X1 - X0) * axis, height: 10, borderRadius: 5, background: `linear-gradient(90deg, ${alpha(EXT, 0.8)}, ${alpha(NULLC, 0.5)} 30%, ${alpha(NULLC, 0.3)})` }} />
      {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v) => (
        <div key={v} style={{ position: "absolute", left: px(v), top: Y + 46, transform: "translate(-50%, -50%)", opacity: axis, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: C.dim }}>{v === 0 ? "0" : v.toFixed(1)}</div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: Y + 80, textAlign: "center", opacity: axis, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: C.dim }}>p-VALUE</div>
      {dot(0.01, SMALL + 10, EXT, "9 HEADS: 0.01")}
      {dot(0.38, BIG + 10, NULLC, "6 HEADS: 0.38")}
      {line > 0.01 ? (
        <>
          <div style={{ position: "absolute", left: px(0.05) - 3, top: Y - 36 * Math.min(1, line), width: 8, height: 72 * Math.min(1, line), borderRadius: 3, background: LINE, boxShadow: `0 0 14px ${LINE}` }} />
          <div style={{ position: "absolute", left: px(0.05) + 16, top: Y - 150, opacity: Math.min(1, line * 2), fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: LINE, whiteSpace: "nowrap" }}>THE 0.05 LINE</div>
        </>
      ) : null}
      <Pop at={SIG - 4} x={540} y={1230} from="up" dist={12} cfg={theme.spring.bouncy}>
        <div style={{ padding: "12px 30px", borderRadius: 999, background: alpha(LINE, 0.18), border: `3px solid ${LINE}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: C.text, whiteSpace: "nowrap" }}>
          BELOW 0.05 = <span style={{ color: LINE }}>STATISTICALLY SIGNIFICANT</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
