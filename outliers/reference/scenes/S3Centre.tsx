// SCENE 3 — WHICH CENTRE? Categories → MODE, balanced numbers → MEAN, outliers → MEDIAN.
// Then the city: mean ₹50K is dragged up by one ₹2L earner; the typical (median) salary is ₹30K.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, exitP, Mark, Pop, useSpr } from "../components/Motion";
import { Crown, Rupee } from "../components/Icons";
import { Pill, TreeHeader } from "../components/Nodes";
import { alpha, glowText, kindColor, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
export const CVS_HEADER = {
  parent: { label: "YOUR DATA", color: kindColor.data },
  kids: [
    { label: "CENTRE", color: kindColor.centre },
    { label: "SPREAD", color: kindColor.spread },
  ],
};
const ROWS = [640, 880, 1120];
const CY = kindColor.centre;

const MiniBars: React.FC = () => (
  <div style={{ position: "relative", width: 220, height: 120 }}>
    {[56, 100, 44].map((h, i) => (
      <div key={i} style={{ position: "absolute", left: 20 + i * 70, bottom: 0, width: 46, height: h, borderRadius: "8px 8px 2px 2px", background: i === 1 ? alpha(CY, 0.8) : alpha("#E4EEFF", 0.5) }} />
    ))}
    <div style={{ position: "absolute", left: 20 + 70 + 3, top: -44 }}>
      <Crown size={40} color={CY} />
    </div>
  </div>
);
const MiniBell: React.FC = () => {
  const pts: string[] = [];
  for (let x = 0; x <= 220; x += 5) pts.push(`${x ? "L" : "M"}${x} ${(116 - 96 * Math.exp(-(((x - 110) / 34) ** 2) / 2)).toFixed(1)}`);
  return (
    <svg width={220} height={120} viewBox="0 0 220 120" style={{ display: "block", overflow: "visible" }}>
      <path d={`${pts.join(" ")} L220 116 L0 116 Z`} fill={alpha("#E4EEFF", 0.14)} />
      <path d={pts.join(" ")} stroke="#E4EEFF" strokeWidth={4} fill="none" />
      <line x1={110} y1={8} x2={110} y2={118} stroke={CY} strokeWidth={4} strokeDasharray="6 6" />
    </svg>
  );
};
const MiniSkew: React.FC = () => (
  <div style={{ position: "relative", width: 220, height: 120 }}>
    {[22, 30, 34, 40, 46, 54].map((h, i) => (
      <div key={i} style={{ position: "absolute", left: i * 27, bottom: 0, width: 20, height: h, borderRadius: "5px 5px 1px 1px", background: i === 2 || i === 3 ? alpha(CY, 0.85) : alpha("#E4EEFF", 0.5) }} />
    ))}
    <div style={{ position: "absolute", left: 186, bottom: 0, width: 26, height: 118, borderRadius: "5px 5px 1px 1px", background: C.orange, boxShadow: `0 0 14px ${alpha(C.orange, 0.7)}` }} />
  </div>
);

const PAY = [18, 22, 25, 28, 30, 33, 38, 56, 200]; // mean 50, median 30 (thousand ₹)
const BX = (i: number) => 160 + i * 95;
const BASE = 1220;
const BH = (v: number) => Math.min(v, 120) * 3.2;

export const S3Centre: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s3");
  const CENW = s.cueS(0, "centre");
  const rowAt = [s.sent(1).from, s.sent(2).from, s.sent(3).from];
  const verdictAt = [s.cueS(1, "mode."), s.cueS(2, "mean."), s.cueS(3, "median.")];
  const CITY = s.sent(4).from;
  const C30 = s.cueS(4, "30,000,");
  const C50 = s.cueS(4, "50.");
  const rowsOut = exitP(frame, CITY - 8, 10);
  const chartIn = ease(frame, [CITY - 2, CITY + 14], [0, 1], theme.ease.inOut);
  const meanLine = ease(frame, [CITY + 6, CITY + 18], [0, 1], theme.ease.inOut);
  const med = spr(C30 - 2, theme.spring.pop);

  const rows = [
    { title: "CATEGORIES", ex: "favourite phone brand", vis: <MiniBars />, verdict: "MODE" },
    { title: "BALANCED NUMBERS", ex: "heights in a class", vis: <MiniBell />, verdict: "MEAN" },
    { title: "OUTLIERS / SKEWED", ex: "salaries", vis: <MiniSkew />, verdict: "MEDIAN" },
  ];

  return (
    <AbsoluteFill>
      <TreeHeader {...CVS_HEADER} parentIn={0} zoomFrom={1.8} kidsIn={2} activeAt={CENW} activeIdx={0} />

      {rowsOut < 1
        ? rows.map((r, i) => {
            const p = spr(rowAt[i] - 4, theme.spring.smooth);
            if (p <= 0.001) return null;
            const v = spr(verdictAt[i] - 3, theme.spring.bouncy);
            return (
              <div
                key={r.title}
                style={{
                  position: "absolute",
                  left: 80,
                  top: ROWS[i] - 100,
                  width: 920,
                  height: 200,
                  boxSizing: "border-box",
                  borderRadius: 30,
                  background: `linear-gradient(90deg, rgba(26,40,98,0.9), rgba(14,24,64,0.85))`,
                  border: `2px solid ${v > 0.5 ? alpha(CY, 0.6) : C.edge}`,
                  boxShadow: v > 0.5 ? `0 0 24px ${alpha(CY, 0.2)}` : "0 20px 40px -22px rgba(0,0,0,0.8)",
                  opacity: Math.min(1, p * 1.5) * (1 - rowsOut),
                  transform: `translateX(${(1 - p) * 60}px) scale(${1 - rowsOut * 0.05})`,
                }}
              >
                <div style={{ position: "absolute", left: 30, top: 54 }}>
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 31, color: C.text, whiteSpace: "nowrap" }}>{r.title}</div>
                  <div style={{ marginTop: 8, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 25, color: C.dim, whiteSpace: "nowrap" }}>e.g. {r.ex}</div>
                </div>
                <div style={{ position: "absolute", left: 400, top: 52 }}>{r.vis}</div>
                {v > 0.01 ? (
                  <div style={{ position: "absolute", right: 30, top: 100, transform: `translateY(-50%) scale(${interpolate(v, [0, 1], [0.5, 1])})`, opacity: Math.min(1, v * 2), display: "flex", alignItems: "center", gap: 8 }}>
                    <Pill label={r.verdict} color={CY} size={32} glow={0.8} />
                  </div>
                ) : null}
              </div>
            );
          })
        : null}

      {/* the city's salaries: the average is dragged up, the median is typical */}
      {chartIn > 0.01 ? (
        <AbsoluteFill style={{ opacity: chartIn }}>
          <div style={{ position: "absolute", left: 110, top: BASE + 2, width: 860, height: 4, borderRadius: 2, background: alpha(C.text, 0.35) }} />
          {PAY.map((v, i) => {
            const p = spr(CITY + i * 2, theme.spring.smooth);
            const h = BH(v) * p;
            const isMed = i === 4;
            const rich = i === 8;
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: BX(i) - 30, top: BASE - h, width: 60, height: h, borderRadius: "10px 10px 2px 2px", background: rich ? `linear-gradient(180deg, ${C.orange}, ${alpha(C.orange, 0.35)})` : isMed && med > 0.5 ? `linear-gradient(180deg, ${CY}, ${alpha(CY, 0.35)})` : `linear-gradient(180deg, ${alpha("#E4EEFF", 0.7)}, ${alpha("#E4EEFF", 0.2)})`, boxShadow: isMed && med > 0.5 ? `0 0 22px ${alpha(CY, 0.6)}` : rich ? `0 0 18px ${alpha(C.orange, 0.6)}` : "none" }} />
                {rich ? <div style={{ position: "absolute", left: BX(i) - 38, top: BASE - h + 80, width: 76, height: 14, background: C.bg, transform: "skewY(-12deg)", opacity: p }} /> : null}
                <div style={{ position: "absolute", left: BX(i), top: BASE + 30, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: rich ? 24 : 20, color: rich ? C.orange : isMed && med > 0.5 ? CY : C.dim, opacity: p }}>
                  <Rupee size={rich ? 22 : 18} color={rich ? C.orange : isMed && med > 0.5 ? CY : C.dim} />
                  {rich ? "2L" : `${v}K`}
                </div>
              </React.Fragment>
            );
          })}
          {meanLine > 0.01 ? <div style={{ position: "absolute", left: 110, top: BASE - BH(50) - 3, width: 860 * meanLine, borderTop: `6px dashed ${C.orange}`, filter: `drop-shadow(0 0 6px ${alpha(C.orange, 0.7)})` }} /> : null}
          <Pop at={CITY + 14} x={300} y={BASE - BH(50) - 44} from="down" dist={14}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 14, background: alpha(C.orange, 0.16), border: `2px solid ${C.orange}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>
              AVERAGE <Rupee size={26} color={C.text} />
              50K
              {frame >= C50 ? <Mark kind="cross" at={C50} size={30} color={C.red} width={14} /> : null}
            </div>
          </Pop>
          {med > 0.01 ? (
            <>
              <div style={{ position: "absolute", left: BX(4) - 2, top: 900, height: (BASE - BH(30) - 900) * med, borderLeft: `3px dotted ${alpha(CY, 0.8)}` }} />
              <div style={{ position: "absolute", left: BX(4), top: 868, transform: `translate(-50%, -50%) scale(${interpolate(med, [0, 1], [0.5, 1])})`, opacity: Math.min(1, med * 2), display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 999, background: alpha(CY, 0.2), border: `3px solid ${CY}`, boxShadow: `0 0 26px ${alpha(CY, 0.5)}`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>
                TYPICAL (MEDIAN) <Rupee size={32} color={CY} />
                <span style={{ color: CY, textShadow: glowText(CY, 0.5) }}>30K</span>
              </div>
            </>
          ) : null}
          <Pop at={CITY - 2} x={540} y={640} from="up" dist={20}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.22em", color: C.dim }}>THAT CITY&apos;S SALARIES</div>
          </Pop>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
