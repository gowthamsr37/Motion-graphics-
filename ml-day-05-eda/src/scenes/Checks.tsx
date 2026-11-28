// SCENES 3–8 — the 6 EDA checks on the Bangalore flats, each a StepScene: THE TERM, the headline, THE REAL PROBLEM
// panel with its chart, WHAT YOU DO bullets on their words.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Hist } from "../components/Charts";
import { Chip, Row, StepScene } from "../components/StepScene";
import { Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

export const S3Dist: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s3");
  const AVG = s.cueS(0, "average");
  const MED = s.cueS(0, "median");
  return (
    <StepScene i={0} termAt={s.cueS(0, "distribution")} headAt={s.sent(0).from} head={<>plot the <span style={{ color: C.cyan }}>distribution</span> of your target</>}
      probAt={s.sent(0).from + 30} probH={460}
      problem={<>
        <Hist w={760} h={230} p={ease(frame, [s.sent(0).from + 30, s.sent(0).from + 60], [0, 1])} marks={ease(frame, [AVG, AVG + 8], [0, 1])} />
        <Row gap={30}>
          <Txt size={40} style={{ opacity: ease(frame, [AVG, AVG + 6], [0, 1]) }}><span style={{ color: C.red }}>average</span> Rs 1.2 Cr</Txt>
          <Txt size={40} style={{ opacity: ease(frame, [MED, MED + 6], [0, 1]) }}><span style={{ color: C.green }}>median</span> Rs 85 L</Txt>
        </Row>
        <Txt size={34} font="body" style={{ opacity: ease(frame, [s.sent(1).from - 2, s.sent(1).from + 6], [0, 1]) }}>a few costly flats drag the average up: <span style={{ color: C.yellow }}>skewed</span></Txt>
      </>}
      fixAt={s.sent(2).from - 4}
      fixes={[{ t: "report the median, not the average", at: s.cueS(2, "median,") }, { t: "consider a log scale for the model", at: s.cueS(2, "log") }]} />
  );
};

export const S4Spikes: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s4");
  const P = s.sent(1).from;
  const Y2K = s.cueS(1, "2000.");
  return (
    <StepScene i={1} termAt={s.cueS(0, "spikes.")} headAt={s.sent(0).from} head={<>look for <span style={{ color: C.orange }}>strange spikes</span></>}
      probAt={P - 4} probH={460}
      problem={<>
        <Hist w={760} h={200} spike={ease(frame, [P + 4, P + 20], [0, 1])} />
        <Txt size={36}>hundreds at <span style={{ color: C.orange }}>exactly Rs 1 Cr</span></Txt>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 70, opacity: ease(frame, [Y2K - 6, Y2K + 4], [0, 1]) }}>
          {[3, 4, 3, 5, 4, 18, 4, 5, 4, 6, 5, 6].map((v, i) => <div key={i} style={{ width: 34, height: v * 3.6, borderRadius: 4, background: i === 5 ? C.orange : alpha(C.violet, 0.8) }} />)}
          <Txt size={30} style={{ marginLeft: 14 }}>built in <span style={{ color: C.orange }}>2000</span>?</Txt>
        </div>
      </>}
      fixAt={s.sent(2).from - 4}
      fixes={[{ t: "rounding + default values, not real", at: s.cueS(2, "rounding,") }, { t: "treat them as uncertain", at: s.cueS(2, "uncertain,") }]} />
  );
};

const CLOUD = Array.from({ length: 44 }, (_, i) => {
  const villa = i % 4 === 0;
  const a = 600 + ((i * 137) % 1400);
  return { x: villa ? 2400 + ((i * 53) % 1400) : a, y: villa ? 300 + ((i * 71) % 260) : 20 + a * 0.08 + ((i * 29) % 30), villa };
});
export const S5Groups: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s5");
  const P = s.sent(1).from;
  const V = s.cueS(1, "villas,");
  const W = 760, H = 240;
  return (
    <StepScene i={2} termAt={s.cueS(0, "price")} headAt={s.sent(0).from} head={<>plot <span style={{ color: C.violet }}>price against area</span></>}
      probAt={s.sent(0).from + 20} probH={460}
      problem={<>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <line x1={20} y1={H - 14} x2={W - 10} y2={H - 14} stroke={alpha(C.text, 0.4)} strokeWidth={2} />
          <line x1={20} y1={10} x2={20} y2={H - 14} stroke={alpha(C.text, 0.4)} strokeWidth={2} />
          {CLOUD.map((d, i) => {
            const x = 20 + (d.x / 4000) * (W - 40), y = H - 14 - (d.y / 620) * (H - 30);
            const p = ease(frame, [s.sent(0).from + 24 + i * 0.6, s.sent(0).from + 30 + i * 0.6], [0, 1]);
            return <circle key={i} cx={x} cy={y} r={8 * p} fill={d.villa && frame > V ? C.violet : C.cyan} />;
          })}
        </svg>
        <Txt size={38} style={{ opacity: ease(frame, [P - 2, P + 6], [0, 1]) }}><span style={{ color: C.cyan }}>2 clouds</span>, not one</Txt>
        <Txt size={34} font="body" style={{ opacity: ease(frame, [V - 4, V + 4], [0, 1]) }}>the 2nd cloud = <span style={{ color: C.violet }}>villas</span> mixed with apartments</Txt>
      </>}
      fixAt={s.sent(2).from - 4}
      fixes={[{ t: "split them into separate models", at: s.cueS(2, "Split") }, { t: "or add a \"property type\" column", at: s.cueS(2, "property") }]} />
  );
};

const LOCS = [{ n: "Koramangala", v: 1.6, c: 412 }, { n: "Indiranagar", v: 1.5, c: 380 }, { n: "Whitefield", v: 1.1, c: 655 }, { n: "Sadashivnagar", v: 2.4, c: 3 }];
export const S6Counts: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s6");
  const P = s.sent(1).from;
  const THREE = s.cueS(1, "three");
  return (
    <StepScene i={3} termAt={s.cueS(0, "count")} headAt={s.sent(0).from} head={<>compare groups, but <span style={{ color: C.yellow }}>count them first</span></>}
      probAt={P - 4} probH={460}
      problem={<div style={{ display: "flex", flexDirection: "column", gap: 14, width: 880 }}>
        {LOCS.map((l, i) => {
          const tiny = l.c < 10;
          const p = ease(frame, [P + i * 5, P + 10 + i * 5], [0, 1]);
          return (
            <div key={l.n} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 240, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>{l.n}</div>
              <div style={{ width: 115 * l.v * p, height: 44, borderRadius: 8, background: tiny ? C.red : C.cyan }} />
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: "nowrap" }}>Rs {l.v} Cr</div>
              <div style={{ marginLeft: "auto", padding: "4px 12px", borderRadius: 8, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 24, color: tiny ? C.red : C.dim, whiteSpace: "nowrap", border: `2px solid ${tiny ? C.red : alpha(C.text, 0.2)}`, opacity: tiny ? ease(frame, [THREE - 4, THREE + 4], [0, 1]) : p }}>n = {l.c}</div>
            </div>
          );
        })}
        <Txt size={36} style={{ opacity: ease(frame, [s.cueS(1, "luck.") - 4, s.cueS(1, "luck.") + 4], [0, 1]), alignSelf: "center" }}>3 listings = <span style={{ color: C.red }}>luck, not a pattern</span></Txt>
      </div>}
      fixAt={s.sent(2).from - 4}
      fixes={[{ t: "show the count next to every average", at: s.cueS(2, "count") }, { t: "ignore groups that are too small", at: s.cueS(2, "average.") }]} />
  );
};

export const S7Corr: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s7");
  const P = s.sent(1).from;
  const MET = s.cueS(1, "metro");
  return (
    <StepScene i={4} termAt={s.cueS(0, "correlations.")} headAt={s.sent(0).from} head={<>check <span style={{ color: C.green }}>correlations</span></>}
      probAt={P - 4} probH={460}
      problem={<>
        <Row>
          <Chip c={C.cyan} at={P}>AREA</Chip>
          <Txt size={34} color={C.dim}>↔</Txt>
          <Chip c={C.cyan} at={P + 4}>BEDROOMS</Chip>
          <Chip c={C.yellow} at={P + 10}>r = 0.92</Chip>
        </Row>
        <Txt size={32} font="body" style={{ opacity: ease(frame, [P + 20, P + 28], [0, 1]) }}>mostly the <span style={{ color: C.yellow }}>same information</span></Txt>
        <Row>
          <Chip c={C.green} at={MET - 2}>NEAR METRO</Chip>
          <Txt size={34} color={C.dim}>→</Txt>
          <Chip c={C.green} at={MET + 4}>PRICIER</Chip>
        </Row>
        <Txt size={32} font="body" style={{ opacity: ease(frame, [s.cueS(1, "already") - 4, s.cueS(1, "already") + 4], [0, 1]) }}>but those areas were <span style={{ color: C.red }}>already popular</span></Txt>
      </>}
      fixAt={s.sent(2).from - 4}
      fixes={[{ t: "correlation is not causation", at: s.cueS(2, "Correlation") }, { t: "never sell it as one", at: s.cueS(2, "Never") }]} />
  );
};

export const S8Time: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s8");
  const P = s.sent(1).from;
  const d = ease(frame, [s.sent(0).from + 20, P + 30], [0, 1]);
  const pts = Array.from({ length: 25 }, (_, i) => [30 + i * 30, 190 - i * 5.5 - Math.sin(i * 1.3) * 8] as [number, number]).slice(0, Math.max(2, Math.ceil(d * 25)));
  return (
    <StepScene i={5} termAt={s.cueS(0, "time.")} headAt={s.sent(0).from} head={<>plot everything <span style={{ color: C.red }}>over time</span></>}
      probAt={s.sent(0).from + 16} probH={460}
      problem={<>
        <svg width={780} height={230} viewBox="0 0 780 230">
          <line x1={20} y1={210} x2={770} y2={210} stroke={alpha(C.text, 0.4)} strokeWidth={2} />
          <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.red} strokeWidth={6} strokeLinejoin="round" />
          <text x={30} y={228} fontFamily={theme.fonts.body} fontWeight={700} fontSize={20} fill={C.dim}>2023</text>
          <text x={720} y={228} fontFamily={theme.fonts.body} fontWeight={700} fontSize={20} fill={C.dim}>2025</text>
        </svg>
        <Txt size={42}>prices rose <span style={{ color: C.red }}>+20%</span> in 2 years</Txt>
        <Txt size={32} font="body" style={{ opacity: ease(frame, [s.cueS(1, "Mix") - 4, s.cueS(1, "Mix") + 4], [0, 1]) }}>mix old + new blindly = <span style={{ color: C.red }}>out of date</span> on day one</Txt>
      </>}
      fixAt={s.sent(2).from - 4}
      fixes={[{ t: "adjust for time", at: s.cueS(2, "adjust") }, { t: "test on recent data", at: s.cueS(2, "test") }]} />
  );
};
