// SCENE 5 — EFFECT 1: SUMMARY NUMBERS. Back to the café (9 friends + the billionaire):
// MEAN ₹40,000 → ₹1,00,36,000 (over 250×), MEDIAN ₹40,000 → ₹41,000 (barely moves), RANGE ₹18,000 → ₹9,99,70,000.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Arrow, Avatar, Crown } from "../components/Icons";
import { Money, SceneTitle } from "../components/Kit";
import { ease, Mark, Pop, Ripple, shake, useSpr } from "../components/Motion";
import { Pill } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { BILLIONAIRE, FRIENDS, MEAN_AFTER } from "./S1Hook";

const C = theme.colors;
const O = kindColor.outlier;
const SHIRTS = ["#60A5FA", "#F472B6", "#A3E635", "#E879F9", "#FDE68A", "#5EEAD4", "#93C5FD", "#FCA5A5", "#C4B5FD"];
const sorted = [...FRIENDS].sort((a, b) => a - b);
const RANGE_BEFORE = (sorted[8] - sorted[0]) * 1000; // 18,000
const RANGE_AFTER = (BILLIONAIRE - sorted[0]) * 1000; // 9,99,70,000
const MEDIAN_AFTER = ((sorted[4] + sorted[5]) / 2) * 1000; // 41,000 (10 values: average of the 5th and 6th)

export const S5Summary: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s5");
  const rows = [
    { label: "MEAN", color: kindColor.mean, at: s.sent(1).from, hit: s.cueS(1, "crore!"), before: 40000, after: MEAN_AFTER, verdict: "OVER 250× HIGHER", bad: true },
    { label: "MEDIAN", color: kindColor.median, at: s.sent(2).from, hit: s.cueS(2, "41,000."), before: 40000, after: MEDIAN_AFTER, verdict: "BARELY MOVES", bad: false },
    { label: "RANGE", color: kindColor.spread, at: s.sent(3).from, hit: s.cueS(3, "crore!"), before: RANGE_BEFORE, after: RANGE_AFTER, verdict: "EXPLODES", bad: true },
  ];
  const sh = shake(frame, rows[0].hit, 12, 8);
  const sh3 = shake(frame, rows[2].hit, 12, 10);

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x + sh3.x}px, ${sh.y + sh3.y}px)` }}>
      <SceneTitle label="HOW OUTLIERS AFFECT ANALYSIS" pill="1 · SUMMARY NUMBERS" color={O} at={2} pillAt={6} />

      {/* the café, in miniature */}
      {FRIENDS.map((v, i) => {
        const p = spr(8 + i * 2, theme.spring.pop);
        if (p <= 0.001) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 128 + i * 60 - 26, top: 548 - 26, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 20 + Math.sin(frame / 18 + i) * 2}px)` }}>
            <Avatar size={52} shirt={SHIRTS[i]} skin={C.skin[i % 4]} hair={C.hair[(i + 1) % 4]} />
          </div>
        );
      })}
      <Pop at={30} x={720} y={556} from="scale" scaleFrom={0.3} cfg={theme.spring.pop}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44, color: C.text }}>+</div>
      </Pop>
      <Pop at={34} x={850} y={540} from="right" dist={30} cfg={theme.spring.bouncy}>
        <div style={{ position: "relative", width: 76, height: 76 }}>
          <Avatar size={76} shirt={O} skin={C.skin[1]} hair={C.hair[0]} mood={0.9} />
          <div style={{ position: "absolute", left: 20, top: -22 }}>
            <Crown size={36} color={O} />
          </div>
        </div>
      </Pop>

      {rows.map((r, i) => {
        const y = 730 + i * 210;
        const p = spr(r.at - 4, theme.spring.smooth);
        if (p <= 0.001) return null;
        const count = ease(frame, [r.hit - 14, r.hit + 4], [0, 1], theme.ease.inOut);
        const v = interpolate(count, [0, 1], [r.before, r.after]);
        const done = count >= 0.99;
        const col = done ? (r.bad ? O : kindColor.median) : C.text;
        const verdict = spr(r.hit + 4, theme.spring.bouncy);
        return (
          <div key={r.label} style={{ position: "absolute", left: 90, top: y - 90, width: 900, height: 180, boxSizing: "border-box", borderRadius: 30, background: `linear-gradient(90deg, ${alpha(r.color, 0.16)}, rgba(14,24,64,0.88) 45%)`, border: `2.5px solid ${done ? alpha(col, 0.8) : C.edge}`, boxShadow: done ? `0 0 26px ${alpha(col, 0.25)}` : "0 20px 40px -22px rgba(0,0,0,0.8)", opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * 60}px)` }}>
            <div style={{ position: "absolute", left: 120, top: 90, transform: "translate(-50%, -50%)" }}>
              <Pill label={r.label} color={r.color} size={30} glow={0.4} />
            </div>
            <div style={{ position: "absolute", left: 350, top: 72, transform: "translate(-50%, -50%)", opacity: 0.8 }}>
              <Money v={r.before} size={38} color={C.dim} weight={700} />
            </div>
            <div style={{ position: "absolute", left: 350, top: 122, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.2em", color: C.dim }}>9 FRIENDS</div>
            <div style={{ position: "absolute", left: 490, top: 72, transform: "translate(-50%, -50%)", opacity: count > 0.02 ? 1 : 0.3 }}>
              <Arrow size={44} color={col} />
            </div>
            <div style={{ position: "absolute", left: 700, top: 72, transform: `translate(-50%, -50%) scale(${1 + (count > 0 && count < 1 ? 0.06 : 0)})`, filter: done ? `drop-shadow(0 0 14px ${alpha(col, 0.7)})` : undefined }}>
              <Money v={count > 0.001 ? v : r.before} size={44} color={col} />
            </div>
            {verdict > 0.01 ? (
              <div style={{ position: "absolute", left: 700, top: 128, transform: `translate(-50%, -50%) scale(${interpolate(verdict, [0, 1], [0.5, 1])})`, opacity: Math.min(1, verdict * 2), display: "flex", alignItems: "center", gap: 8, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: col, textShadow: glowText(col, 0.4), whiteSpace: "nowrap" }}>
                {!r.bad ? <Mark kind="check" at={r.hit + 6} size={30} color={col} width={13} /> : null}
                {r.verdict}
              </div>
            ) : null}
          </div>
        );
      })}
      {rows.map((r, i) => (
        <Ripple key={r.label} at={r.hit + 4} x={790} y={730 + i * 210 - 18} color={r.bad ? O : kindColor.median} size={300} rings={1} flat={0.4} />
      ))}
    </AbsoluteFill>
  );
};
