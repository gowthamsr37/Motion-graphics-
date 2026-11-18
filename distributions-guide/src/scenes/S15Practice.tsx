// SCENE 15 — IN PRACTICE, 3 STEPS. 1 PLOT A HISTOGRAM (a skewed sample) · 2 MATCH THE SHAPE (normal / exponential /
// log-normal, the log-normal lights up) · 3 FIT + CHECK: `stats.lognorm.fit(data)` and a Q-Q plot whose dots hug the line.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BONUS, COUNTS, MEAS, TEST } from "../components/Guide";
import { SceneTitle } from "../components/Kit";
import { ease, rng, useSpr } from "../components/Motion";
import { Shape } from "../components/Pick";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const HIST = [2, 9, 16, 18, 15, 11, 8, 6, 4, 3, 2, 1.5, 1, 0.6];
const QQ = (() => {
  const r = rng(5);
  return Array.from({ length: 14 }, (_, i) => {
    const u = i / 13;
    return { x: u, y: Math.min(1, Math.max(0, u + (r() - 0.5) * 0.08)) };
  });
})();

const Step: React.FC<{ y: number; at: number; n: number; t: string; c: string; children: React.ReactNode }> = ({ y, at, n, t, c, children }) => {
  const spr = useSpr();
  const p = spr(at - 6, theme.spring.bouncy);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 230, transform: `translateY(-50%) translateX(${(1 - Math.min(1, p)) * -40}px)`, opacity: Math.min(1, p * 2), boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(c, 0.18)}, rgba(14,24,64,0.92) 55%)`, border: `3px solid ${c}` }}>
      <div style={{ position: "absolute", left: 34, top: 34, width: 60, height: 60, borderRadius: 30, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.ink }}>{n}</div>
      <div style={{ position: "absolute", left: 34, top: 112, width: 330, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, lineHeight: 1.1, color: C.text }}>{t}</div>
      <div style={{ position: "absolute", left: 390, top: 20, width: 480, height: 190, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
};

export const S15Practice: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s15");
  const HISTW = s.cueS(1, "histogram");
  const MATCH = s.cueS(1, "match");
  const FIT = s.cueS(2, "fit");
  const QQW = s.cueS(2, "Q-Q");
  const grow = ease(frame, [HISTW - 6, HISTW + 20], [0, 1], theme.ease.out);
  const pick = frame >= MATCH + 14;
  const qq = ease(frame, [QQW - 6, QQW + 18], [0, 1]);
  return (
    <AbsoluteFill>
      <SceneTitle label="IN PRACTICE" pill="3 STEPS" color={BONUS} at={2} pillAt={s.sent(0).from} />
      <Step y={590} at={HISTW} n={1} t={"PLOT A\nHISTOGRAM"} c={COUNTS}>
        <svg width={420} height={170} viewBox="0 0 420 170" style={{ overflow: "visible" }}>
          {HIST.map((v, i) => {
            const h = (v / 18) * 150 * grow;
            return <rect key={i} x={i * 30 + 2} y={160 - h} width={26} height={h} rx={4} fill={alpha(COUNTS, 0.5)} stroke={COUNTS} strokeWidth={2.5} />;
          })}
          <line x1={0} y1={162} x2={420} y2={162} stroke={alpha(C.text, 0.45)} strokeWidth={3} />
        </svg>
      </Step>
      <Step y={850} at={MATCH} n={2} t={"MATCH\nTHE SHAPE"} c={MEAS}>
        <div style={{ display: "flex", gap: 16 }}>
          {(["normal", "exp", "lognormal"] as const).map((k) => {
            const on = pick && k === "lognormal";
            return (
              <div key={k} style={{ padding: 12, borderRadius: 18, border: `3px solid ${on ? MEAS : alpha(C.text, 0.25)}`, background: on ? alpha(MEAS, 0.25) : "transparent", boxShadow: on ? `0 0 24px ${alpha(MEAS, 0.6)}` : "none", opacity: pick && !on ? 0.45 : 1, transform: `scale(${on ? 1.08 : 1})` }}>
                <Shape kind={k} w={118} h={70} color={on ? MEAS : C.dim} p={Math.min(1, spr(MATCH - 2, theme.spring.smooth))} />
              </div>
            );
          })}
        </div>
      </Step>
      <Step y={1110} at={FIT} n={3} t={"FIT IT,\nCHECK IT"} c={TEST}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ padding: "10px 16px", borderRadius: 14, background: "rgba(4,10,32,0.85)", border: `2px solid ${alpha(C.text, 0.2)}`, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, color: C.green, lineHeight: 1.35, whiteSpace: "nowrap" }}>
            stats.lognorm
            <br />
            .fit(data)
          </div>
          <div style={{ position: "relative", width: 150, height: 150, opacity: Math.min(1, qq * 1.5) }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 150, height: 150, borderLeft: `3px solid ${alpha(C.text, 0.45)}`, borderBottom: `3px solid ${alpha(C.text, 0.45)}`, boxSizing: "border-box" }} />
            <svg width={150} height={150} viewBox="0 0 150 150" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <line x1={8} y1={142} x2={8 + 134 * qq} y2={142 - 134 * qq} stroke={TEST} strokeWidth={4} strokeLinecap="round" />
              {QQ.map((d, i) => (i / QQ.length <= qq ? <circle key={i} cx={8 + d.x * 134} cy={142 - d.y * 134} r={5} fill={C.text} /> : null))}
            </svg>
            <div style={{ position: "absolute", left: 0, right: 0, top: 156, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 16, letterSpacing: "0.14em", color: C.dim }}>Q-Q PLOT</div>
          </div>
        </div>
      </Step>
    </AbsoluteFill>
  );
};
