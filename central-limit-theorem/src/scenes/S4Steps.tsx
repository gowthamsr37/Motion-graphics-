// SCENE 4 — STEP BY STEP. Step 1: pick 30 people at random (30 dots light up on the salary axis), find their average
// (₹46K) → it drops into the "averages" chart. Step 2: another 30 → ₹36K. Step 3: repeat 140 times → the averages
// pile up into a bell curve (even though salaries are skewed).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bell, type BellGeo } from "../components/Bell";
import { ease, exitP, Mark, Pop, useSpr } from "../components/Motion";
import { AVGS, AxisLabels, ax, K, NSAMP, PopBars, POP_SD, px, SAMPLES, TRUE_MEAN } from "../components/Salary";
import { alpha, glowText, theme } from "../theme";
import { useScene } from "../timing";
import { AVG, RAW, SAMP } from "./S1Hook";

const C = theme.colors;
const PBASE = 760;
const STRIP = 812;
const ABASE = 1300;
const DOT = 15;
const binOf = (a: number) => Math.floor((a - 20) / 2);
const SLOT = (() => {
  const c: Record<number, number> = {};
  return AVGS.map((a) => {
    const b = binOf(a);
    c[b] = (c[b] ?? 0) + 1;
    return c[b] - 1;
  });
})();
const SE = POP_SD / Math.sqrt(30);

const StripDots: React.FC<{ vals: number[]; at: number; out: number }> = ({ vals, at, out }) => {
  const frame = useCurrentFrame();
  const o = exitP(frame, out, 8);
  if (o >= 1 || frame < at - 2) return null;
  return (
    <>
      {vals.map((v, j) => {
        const p = ease(frame, [at + j * 0.8, at + 6 + j * 0.8], [0, 1]);
        const big = v > 90;
        return <div key={j} style={{ position: "absolute", left: px(v) - 8, top: STRIP - 8 + (j % 3) * 12 - 12, width: 16, height: 16, borderRadius: 8, background: big ? RAW : SAMP, boxShadow: `0 0 8px ${big ? RAW : SAMP}`, opacity: p * (1 - o), transform: `scale(${p})` }} />;
      })}
    </>
  );
};

export const S4Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const spr = useSpr();
  const s = useScene("s4");
  const S1 = s.sent(0).from;
  const PICK1 = s.cueS(0, "pick");
  const AV1 = s.cueS(0, "average");
  const S2 = s.sent(1).from;
  const AV2 = s.cueS(1, "average.");
  const S3 = s.sent(2).from;
  const PLOT = s.cueS(2, "plot");
  const LOOK = s.sent(3).from;
  const step = frame >= S3 - 4 ? 3 : frame >= S2 - 4 ? 2 : 1;
  const drop = (i: number) => (i === 0 ? S2 - 22 : i === 1 ? S3 - 22 : S3 + 16 + ((i - 2) / (NSAMP - 2)) * Math.max(30, PLOT + 40 - S3 - 16));
  const bell = ease(frame, [LOOK - 2, LOOK + 20], [0, 1], theme.ease.inOut);
  const g: BellGeo = { x0: ax(20), x1: ax(68), vmin: 20, vmax: 68, base: ABASE, peakH: NSAMP * 2 * (0.3989 / SE) * DOT, sigmaRef: SE };
  const avgLine = (i: number, at: number, out: number) => {
    const p = ease(frame, [at - 4, at + 8], [0, 1]);
    const o = exitP(frame, out, 8);
    if (p <= 0.01 || o >= 1) return null;
    return (
      <>
        <div style={{ position: "absolute", left: px(AVGS[i]) - 3, top: PBASE - 230 * p, width: 6, height: 230 * p + 70, background: AVG, borderRadius: 3, boxShadow: `0 0 12px ${AVG}`, opacity: 1 - o }} />
        <div style={{ position: "absolute", left: px(AVGS[i]) + 14, top: PBASE - 230, padding: "4px 14px", borderRadius: 12, background: "#0A1440", border: `3px solid ${AVG}`, opacity: p * (1 - o), display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: AVG }}>AVERAGE</span>
          <K v={AVGS[i]} size={28} color={C.text} />
        </div>
      </>
    );
  };

  return (
    <AbsoluteFill>
      {/* step tracker */}
      {["PICK 30", "AGAIN", "REPEAT"].map((t, i) => {
        const p = spr(4 + i * 4, theme.spring.bouncy);
        const on = step === i + 1;
        const done = step > i + 1 || frame >= LOOK - 4;
        const c = i === 2 ? AVG : SAMP;
        return (
          <div key={t} style={{ position: "absolute", left: 230 + i * 310, top: 330, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1]) * (on ? 1.08 : 1)})`, opacity: Math.min(1, p * 2) * (on || done ? 1 : 0.5), display: "flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 999, background: on ? alpha(c, 0.22) : "rgba(14,24,64,0.85)", border: `3px solid ${on ? c : alpha(c, 0.45)}`, boxShadow: on ? `0 0 22px ${alpha(c, 0.45)}` : "none", whiteSpace: "nowrap" }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: done ? C.green : c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 22, color: C.ink }}>{done ? <Mark kind="check" at={i === 2 ? LOOK - 4 : i === 0 ? S2 - 4 : S3 - 4} size={24} color={C.ink} width={7} /> : i + 1}</div>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text }}>{t}</span>
          </div>
        );
      })}
      {/* the city's salaries, small (fades for the reveal) */}
      <div style={{ opacity: 1 - 0.85 * ease(frame, [LOOK - 6, LOOK + 6], [0, 1]) }}>
      <div style={{ position: "absolute", left: 140, top: 440, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: RAW }}>CITY SALARIES (SKEWED)</div>
      <PopBars base={PBASE} h={220} color={RAW} dim={0.7} />
      <div style={{ position: "absolute", left: px(0) - 10, top: PBASE + 1, width: px(160) - px(0) + 20, height: 3, background: alpha(C.text, 0.4) }} />
      <AxisLabels base={PBASE + 64} vals={[0, 40, 80, 120, 160]} at={px} />
      </div>
      {/* step 1 and step 2: one sample each */}
      <StripDots vals={SAMPLES[0]} at={PICK1} out={S2 - 6} />
      {avgLine(0, AV1, S2 - 6)}
      <StripDots vals={SAMPLES[1]} at={S2 + 6} out={S3 - 6} />
      {avgLine(1, AV2, S3 - 6)}
      <Pop at={PICK1 + 4} out={S2 - 6} x={860} y={STRIP + 54} from="up" dist={10}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: SAMP, whiteSpace: "nowrap" }}>30 PEOPLE</div>
      </Pop>
      {/* the averages chart */}
      <div style={{ position: "absolute", left: 140, top: 930, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: AVG, opacity: ease(frame, [S1, S1 + 10], [0, 1]) }}>THE AVERAGES (ZOOMED IN)</div>
      <div style={{ position: "absolute", left: ax(20) - 10, top: ABASE + 1, width: ax(68) - ax(20) + 20, height: 3, background: alpha(C.text, 0.4), opacity: ease(frame, [S1, S1 + 10], [0, 1]) }} />
      <AxisLabels base={ABASE} vals={[20, 30, 40, 50, 60]} at={ax} p={ease(frame, [S1, S1 + 10], [0, 1])} />
      {AVGS.map((a, i) => {
        const t = drop(i);
        if (frame < t - 1) return null;
        const d = ease(frame, [t, t + (i < 2 ? 14 : 8)], [0, 1], theme.ease.in);
        const b = binOf(a);
        const x = ax(20 + (b + 0.5) * 2);
        const y = ABASE - (SLOT[i] + 0.5) * DOT;
        const x0 = px(a);
        return <div key={i} style={{ position: "absolute", left: interpolate(d, [0, 1], [x0, x]) - DOT / 2 + 1, top: interpolate(d, [0, 1], [STRIP + 30, y]) - DOT / 2 + 1, width: DOT - 2, height: DOT - 2, borderRadius: DOT / 2, background: AVG, boxShadow: `0 0 6px ${alpha(AVG, 0.8)}` }} />;
      })}
      {frame >= S3 + 10 && frame < LOOK + 20 ? (
        <div style={{ position: "absolute", right: 120, top: 930, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: C.text, whiteSpace: "nowrap", opacity: 1 - ease(frame, [LOOK + 8, LOOK + 20], [0, 1]) }}>
          samples: <span style={{ color: AVG }}>{Math.min(NSAMP, Math.max(2, Math.round(2 + ((frame - S3 - 16) / Math.max(30, PLOT + 40 - S3 - 16)) * (NSAMP - 2))))}</span>
        </div>
      ) : null}
      {bell > 0.01 ? <Bell g={g} mu={TRUE_MEAN} sigma={SE} p={bell} color={C.text} fill={0} width={5} /> : null}
      <Pop at={LOOK - 2} x={540} y={600} from="scale" scaleFrom={0.5} cfg={theme.spring.pop}>
        <div style={{ textAlign: "center", whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 84, color: C.text, textShadow: glowText(AVG, 0.8) }}>
            A <span style={{ color: AVG }}>BELL CURVE!</span>
          </div>
          <div style={{ marginTop: 8, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.18em", color: C.text }}>
            FROM <span style={{ color: RAW }}>SKEWED</span> SALARIES
          </div>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};
