// SCENE 7 — OPTION 4: KEEP IT AND STUDY IT. Card payments by time of day: everyday spending hugs the bottom
// (₹100–₹900), one ₹2,00,000 payment at 3:07 AM sits far above → FRAUD? → flag it · dig in · report it separately.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { LensGlyph, Money, TREATS, TreatPill } from "../components/Kit";
import { ease, Mark, Pop, Ripple, useSpr } from "../components/Motion";
import { Tag, TreeHeader } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";
import { OUT_HEADER } from "./S2Why";

const C = theme.colors;
const O = kindColor.outlier;
const RV = kindColor.rare;
const GR = kindColor.median;
const PX = (h: number) => 170 + (h / 24) * 760;
const PY = (amt: number) => 1170 - (amt / 200000) * 430;
const EVERYDAY: [number, number][] = [
  [8.5, 320], [9.2, 150], [9.8, 640], [10.4, 220], [11.4, 480], [12.5, 900], [13.1, 260], [13.8, 410], [15, 180],
  [16.2, 720], [17.5, 350], [18.4, 560], [19, 240], [19.6, 830], [20.3, 300], [21, 450], [21.8, 200], [22.4, 610],
];
const ODD: [number, number] = [3.1, 200000];

export const S7Keep: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s7");
  const KEEP = s.sent(0).from;
  const PAY = s.sent(1).from;
  const FRAUD = s.cueS(1, "fraud.");
  const STORY = s.cueS(2, "story!");
  const steps = [s.cueS(2, "Flag"), s.cueS(2, "dig"), s.cueS(2, "report")];

  const ax = ease(frame, [KEEP, KEEP + 14], [0, 1], theme.ease.inOut);
  const odd = spr(PAY - 4, theme.spring.bouncy);
  const lens = ease(frame, [FRAUD - 8, FRAUD + 8], [0, 1], theme.ease.out);

  return (
    <AbsoluteFill>
      <TreeHeader {...OUT_HEADER} parentIn={-60} kidsIn={-60} activeAt={-60} activeIdx={1} prevIdx={1} />
      <TreatPill t={TREATS[6]} color={RV} at={KEEP - 2} />

      {/* axes */}
      <div style={{ position: "absolute", left: PX(0), top: PY(0), width: (PX(24) - PX(0)) * ax, height: 4, borderRadius: 2, background: alpha(C.text, 0.4) }} />
      <div style={{ position: "absolute", left: PX(0) - 2, top: PY(200000) - 20 + (PY(0) - PY(200000) + 20) * (1 - ax), width: 4, height: (PY(0) - PY(200000) + 20) * ax, borderRadius: 2, background: alpha(C.text, 0.4) }} />
      {[0, 6, 12, 18, 24].map((h) => (
        <div key={h} style={{ position: "absolute", left: PX(h), top: PY(0) + 30, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, color: C.dim, opacity: ax }}>{h}h</div>
      ))}
      <div style={{ position: "absolute", left: (PX(0) + PX(24)) / 2, top: PY(0) + 66, transform: "translate(-50%, -50%)", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.2em", color: C.dim, opacity: ax, whiteSpace: "nowrap" }}>TIME OF DAY · CARD PAYMENTS</div>
      {[
        { v: "0", a: 0 },
        { v: "1L", a: 100000 },
        { v: "2L", a: 200000 },
      ].map((t) => (
        <div key={t.v} style={{ position: "absolute", left: PX(0) - 16, top: PY(t.a), transform: "translate(-100%, -50%)", opacity: ax }}>
          <Money v={t.v} size={22} color={C.dim} weight={700} />
        </div>
      ))}

      {/* everyday spending */}
      {EVERYDAY.map(([h, a], i) => {
        const p = spr(KEEP + 6 + i, theme.spring.pop);
        if (p <= 0.001) return null;
        return <div key={i} style={{ position: "absolute", left: PX(h) - 11, top: PY(a) - 11 - 10 - (i % 3) * 6, width: 22, height: 22, borderRadius: 11, background: kindColor.data, boxShadow: `0 0 10px ${alpha(kindColor.data, 0.7)}`, transform: `scale(${p})` }} />;
      })}
      <Pop at={KEEP + 26} x={PX(15.5)} y={PY(0) - 70} from="down" dist={12}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: C.dim, whiteSpace: "nowrap" }}>
          EVERYDAY: <Money v="100" size={20} color={C.dim} weight={700} /> TO <Money v="900" size={20} color={C.dim} weight={700} />
        </div>
      </Pop>

      {/* the 3 AM payment */}
      {odd > 0.001 ? (
        <>
          <div style={{ position: "absolute", left: PX(ODD[0]) - 20, top: PY(ODD[1]) - 20, width: 40, height: 40, borderRadius: 20, background: O, boxShadow: `0 0 26px ${alpha(O, 0.95)}`, transform: `scale(${odd})`, zIndex: 4 }} />
          <div style={{ position: "absolute", left: PX(ODD[0]) + 74, top: PY(ODD[1]), transform: "translateY(-50%)", opacity: Math.min(1, odd * 2), whiteSpace: "nowrap" }}>
            <Money v={200000} size={34} color={O} />
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: C.text }}>3:07 AM</div>
          </div>
        </>
      ) : null}
      <Ripple at={PAY} x={PX(ODD[0])} y={PY(ODD[1])} color={O} size={300} rings={2} flat={0.6} />
      {lens > 0.01 ? (
        <div style={{ position: "absolute", left: PX(ODD[0]) - 64 + Math.sin(frame / 8) * 6 * lens, top: PY(ODD[1]) - 64 + Math.cos(frame / 8) * 6 * lens, opacity: lens, transform: `scale(${0.6 + lens * 0.4})` }}>
          <LensGlyph size={150} color={C.text} />
        </div>
      ) : null}
      <Pop at={FRAUD - 4} x={PX(ODD[0]) + 430} y={PY(ODD[1]) + 4} from="left" dist={20} cfg={theme.spring.pop}>
        <div style={{ padding: "8px 18px", borderRadius: 999, background: C.red, color: C.white, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap", boxShadow: `0 0 24px ${alpha(C.red, 0.6)}` }}>FRAUD?</div>
      </Pop>

      {/* what to do with it */}
      <Pop at={STORY - 6} x={540} y={660} from="up" dist={16} cfg={theme.spring.bouncy}>
        <Tag color={O} size={28}>
          THE OUTLIER IS THE STORY
        </Tag>
      </Pop>
      {steps.map((at, i) => (
        <Pop key={i} at={at - 4} x={720} y={880 + i * 74} from="right" dist={30} cfg={theme.spring.bouncy}>
          <div style={{ width: 380, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", borderRadius: 18, background: `linear-gradient(180deg, ${C.panelHi}, ${C.panel})`, border: `2.5px solid ${alpha(GR, 0.7)}` }}>
            <Mark kind="check" at={at} size={30} color={GR} width={13} />
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 26, color: C.text, whiteSpace: "nowrap" }}>{["FLAG IT", "DIG IN", "REPORT IT SEPARATELY"][i]}</span>
          </div>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};
