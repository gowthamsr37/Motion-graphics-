// The ten scenes. Every beat is tied to the narration via timing.ts (sentence starts / word estimates).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import fixtures from "../fixtures.json";
import { Check, Code, Cell, Cross, Heading, Tag, typeFrames } from "../components/Lab";
import { HIST, NullHist, scaleLin, SIM_IN_BAND, Whisker } from "../components/Charts";
import { breathe, CLAMP, Entrance, float, Odometer, useSpring, WordReveal } from "../components/Motion";
import { theme } from "../theme";
import { scene, SceneId, sentence, wordAt } from "../timing";

const C = theme.colors;
const TOP = 300; // content zone starts under the step rail
const W = 984; // content width (48px gutters)

const seg = (fps: number, id: SceneId, i: number) => sentence(fps, id, i).from;

// Exit for a whole scene: everything slides up and fades over the last 10 frames.
const SceneShell: React.FC<{ id: SceneId; children: React.ReactNode; noExit?: boolean }> = ({ id, children, noExit }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = scene(fps, id).duration;
  const out = noExit ? 0 : interpolate(frame, [d - 10, d], [0, 1], { easing: theme.ease.in, ...CLAMP });
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${-out * 40}px)` }}>
      <div style={{ position: "absolute", left: 48, top: TOP, width: W }}>{children}</div>
    </AbsoluteFill>
  );
};

// Rolling number synced to a frame.
const useCount = (from: number, to: number, start: number, len: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + len], [from, to], { easing: theme.ease.out, ...CLAMP });
};

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

// =====================================================================================
// S1 — the question
// =====================================================================================
export const s1Beats = (fps: number) => ({ q: seg(fps, "s1", 1), ds: seg(fps, "s1", 2), flip: 6, land: 6 + Math.round(fps * 1.2) });

const Coin: React.FC<{ flip: number; land: number }> = ({ flip, land }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [flip, land], [0, 1], CLAMP);
  const spin = interpolate(t, [0, 1], [0, Math.PI * 9], { easing: theme.ease.out });
  const lift = Math.sin(t * Math.PI) * 220;
  const settle = spring({ frame: frame - land, fps, config: theme.spring.bouncy });
  const sx = t < 1 ? Math.cos(spin) : 1;
  const s = (t < 1 ? 1 : interpolate(settle, [0, 1], [1.12, 1])) * breathe(frame, 30, 0.012);
  return (
    <div style={{ width: 260, height: 260, transform: `translateY(${-lift + float(frame, 34, 5)}px) scale(${s})` }}>
      <svg width={260} height={260} viewBox="0 0 260 260" style={{ transform: `scaleX(${Math.abs(sx) < 0.06 ? 0.06 : sx})` }}>
        <defs>
          <radialGradient id="coin" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#FFE2A8" />
            <stop offset="55%" stopColor={C.amber} />
            <stop offset="100%" stopColor="#B9741A" />
          </radialGradient>
        </defs>
        <circle cx={130} cy={130} r={120} fill="url(#coin)" />
        <circle cx={130} cy={130} r={100} fill="none" stroke="#FFF1D2" strokeOpacity={0.5} strokeWidth={4} strokeDasharray="3 9" />
        <text x={130} y={162} textAnchor="middle" fontFamily={theme.fonts.mono} fontWeight={700} fontSize={92} fill="#5A3608">
          {sx >= 0 ? "H" : "T"}
        </text>
      </svg>
    </div>
  );
};

export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const pair = (delay: number, label: string, color: string, x: number) => {
    const p = spring({ frame: frame - delay, fps, config: theme.spring.snappy });
    return (
      <div style={{ opacity: p, transform: `translateX(${(1 - p) * x}px) scale(${interpolate(p, [0, 1], [0.85, 1])})` }}>
        <Tag color={color} size={34} style={{ padding: "14px 28px" }}>
          {label}
        </Tag>
      </div>
    );
  };
  const lines = ['result = test(toss_winner == match_winner)'];
  return (
    <SceneShell id="s1">
      <Cell n="" kind="md" delay={2}>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: 26, color: C.comment, marginBottom: 14 }}># research question</div>
        <WordReveal
          text="Does winning the toss win matches?"
          delay={8}
          per={4}
          gap={20}
          style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 84, lineHeight: 1.05, letterSpacing: "-0.02em", color: C.text }}
          wordStyle={(i) => (i === 3 ? { color: C.amber } : {})}
        />
      </Cell>
      <div style={{ height: 560, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <Coin flip={b.flip} land={b.land} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 455, display: "flex", justifyContent: "center", gap: 28, alignItems: "center" }}>
          {pair(b.q + 8, "SIGNAL?", C.amber, -80)}
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 30, color: C.dim, opacity: interpolate(frame, [b.q + 12, b.q + 20], [0, 1], CLAMP) }}>or</div>
          {pair(b.q + 18, "NOISE?", C.cyan, 80)}
        </div>
      </div>
      <Cell n={0} delay={b.ds - 6} style={{ marginTop: 10 }}>
        <Code lines={lines} start={b.ds} cps={2} size={27} cursorUntil={b.ds + 200} />
      </Cell>
    </SceneShell>
  );
};

// =====================================================================================
// S2 — the data
// =====================================================================================
export const s2Beats = (fps: number) => ({
  code: seg(fps, "s2", 0) + 4,
  src: seg(fps, "s2", 1),
  count: seg(fps, "s2", 2),
  drop: seg(fps, "s2", 3),
  left: seg(fps, "s2", 4),
  decided: wordAt(fps, "s2", "7,965", 2.4),
});

const FORMAT_N = [
  { f: "TEST", n: 730 },
  { f: "ODI", n: 2487 },
  { f: "T20I", n: 3530 },
  { f: "IPL", n: 1218 },
];

export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const code1 = ["import pandas as pd", 'df = load_matches("cricsheet/")', "df.shape"];
  const code2 = ['df = df[df.result == "decided"]', "len(df)"];
  const rows = (fixtures as { f: string; y: string; c: string }[]).slice(0, 6);
  const shape = useCount(0, 8408, b.count - 2, Math.round(fps * 1.4));
  const decided = useCount(8408, 7965, b.decided - 4, Math.round(fps * 1.1));
  const phaseB = b.drop - 4;
  return (
    <SceneShell id="s2">
      {/* phase A — load */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W }}>
        <Cell n={1} delay={0} exitAt={phaseB}>
          <Code lines={code1} start={b.code} cps={2.2} />
        </Cell>
        <Cell n={1} kind="Out" delay={b.count - 6} exitAt={phaseB + 2} style={{ marginTop: 26 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, fontFamily: theme.fonts.mono }}>
            <span style={{ fontSize: 34, color: C.dim }}>(</span>
            <span style={{ fontSize: 96, fontWeight: 700, color: C.amber, fontVariantNumeric: "tabular-nums" }}>{fmt(shape)}</span>
            <span style={{ fontSize: 34, color: C.dim }}>rows, 9 columns)</span>
          </div>
          <div style={{ marginTop: 18, fontFamily: theme.fonts.mono, fontSize: 24 }}>
            <div style={{ display: "flex", color: C.dim, borderBottom: `1.5px solid ${C.edge}`, paddingBottom: 10 }}>
              <span style={{ width: 70 }} />
              <span style={{ width: 360 }}>match</span>
              <span style={{ width: 200 }}>season</span>
              <span style={{ width: 200 }}>format</span>
            </div>
            {rows.map((r, i) => {
              const p = spring({ frame: frame - (b.src + 6 + i * 4), fps, config: theme.spring.snappy });
              return (
                <div key={i} style={{ display: "flex", padding: "9px 0", borderBottom: `1px solid ${C.grid}`, opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>
                  <span style={{ width: 70, color: C.comment }}>{i}</span>
                  <span style={{ width: 360, color: C.text }}>{r.f}</span>
                  <span style={{ width: 200, color: C.num }}>{r.y}</span>
                  <span style={{ width: 200, color: C.str }}>{`"${r.c}"`}</span>
                </div>
              );
            })}
            <div style={{ color: C.comment, paddingTop: 10, opacity: interpolate(frame, [b.src + 36, b.src + 44], [0, 1], CLAMP) }}>… 8,402 more rows</div>
          </div>
        </Cell>
        <div style={{ marginTop: 22, opacity: interpolate(frame, [b.src, b.src + 10], [0, 1], CLAMP) * interpolate(frame, [phaseB, phaseB + 8], [1, 0], CLAMP) }}>
          <Tag color={C.dim} size={20}>source: cricsheet.org · open data (ODC-BY)</Tag>
        </div>
      </div>
      {/* phase B — filter */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W }}>
        <Cell n={2} delay={phaseB + 6}>
          <Code lines={code2} start={phaseB + 12} cps={2.4} />
        </Cell>
        <Cell n={2} kind="Out" delay={b.left - 4} style={{ marginTop: 26 }} glowTone="amber">
          <div style={{ display: "flex", alignItems: "baseline", gap: 18, fontFamily: theme.fonts.mono }}>
            <span style={{ fontSize: 120, fontWeight: 700, color: C.amber, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{fmt(decided)}</span>
            <span style={{ fontSize: 30, color: C.dim }}>decided games</span>
          </div>
          <div style={{ marginTop: 34 }}>
            {FORMAT_N.map((r, i) => {
              const p = spring({ frame: frame - (b.decided + 10 + i * 5), fps, config: theme.spring.smooth });
              return (
                <div key={r.f} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 18, opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP) }}>
                  <span style={{ width: 110, fontFamily: theme.fonts.mono, fontSize: 26, color: C.dim }}>{r.f}</span>
                  <div style={{ width: (r.n / 3530) * 640 * p, height: 34, borderRadius: 6, background: C.cyan, opacity: 0.85 }} />
                  <span style={{ fontFamily: theme.fonts.mono, fontSize: 26, color: C.text }}>{fmt(r.n * Math.min(1, p))}</span>
                </div>
              );
            })}
          </div>
        </Cell>
        <div style={{ marginTop: 22, opacity: interpolate(frame, [b.drop + 6, b.drop + 16], [0, 1], CLAMP) }}>
          <Tag color={C.coral} size={22}>
            <Cross size={22} p={interpolate(frame, [b.drop + 6, b.drop + 16], [0, 1], CLAMP)} /> ties · draws · no-results
          </Tag>
        </div>
      </div>
    </SceneShell>
  );
};

// =====================================================================================
// S3 — the hypothesis
// =====================================================================================
export const s3Beats = (fps: number) => ({ h0: seg(fps, "s3", 1), fifty: seg(fps, "s3", 2), reject: seg(fps, "s3", 3) });

const Formula: React.FC<{ delay: number; sym: React.ReactNode; rel: string; val: string; note: string; color: string }> = ({ delay, sym, rel, val, note, color }) => (
  <Entrance delay={delay} y={30}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 22, fontFamily: theme.fonts.mono }}>
      <span style={{ fontSize: 64, fontWeight: 700, color, width: 120 }}>{sym}</span>
      <span style={{ fontSize: 60, color: C.text }}>
        p {rel} <span style={{ color }}>{val}</span>
      </span>
    </div>
    <div style={{ fontFamily: theme.fonts.body, fontSize: 30, color: C.dim, marginLeft: 142, marginTop: 4 }}>{note}</div>
  </Entrance>
);

export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  const pie = interpolate(frame, [b.fifty, b.fifty + fps * 0.9], [0, 0.5], { easing: theme.ease.out, ...CLAMP });
  const R = 150, CIRC = 2 * Math.PI * R;
  const rej = spring({ frame: frame - b.reject - 6, fps, config: theme.spring.bouncy });
  return (
    <SceneShell id="s3">
      <Cell n="" kind="md" delay={0}>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: 26, color: C.comment, marginBottom: 18 }}>## hypothesis test</div>
        <Entrance delay={6} y={20}>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 34, color: C.dim, marginBottom: 34 }}>
            p = P(<span style={{ color: C.text }}>toss winner wins the match</span>)
          </div>
        </Entrance>
        <Formula delay={b.h0 + 4} sym={<>H<sub style={{ fontSize: 34 }}>0</sub></>} rel="=" val="0.50" note="the toss is a coin flip" color={C.cyan} />
        <div style={{ height: 30 }} />
        <Formula delay={b.h0 + 22} sym={<>H<sub style={{ fontSize: 34 }}>1</sub></>} rel="≠" val="0.50" note="the toss gives a real edge" color={C.dim} />
        <div style={{ height: 30 }} />
        <Entrance delay={b.reject - 2} y={20}>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 34, color: C.dim }}>
            α = <span style={{ color: C.num }}>0.05</span> <span style={{ color: C.comment }}># 95% confidence</span>
          </div>
        </Entrance>
      </Cell>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 60, marginTop: 70 }}>
        <div style={{ position: "relative", width: 340, height: 340, transform: `scale(${breathe(frame, 28, 0.01)})`, opacity: interpolate(frame, [b.fifty - 6, b.fifty + 4], [0, 1], CLAMP) }}>
          <svg width={340} height={340}>
            <circle cx={170} cy={170} r={R} fill="none" stroke={C.grid} strokeWidth={34} />
            <circle cx={170} cy={170} r={R} fill="none" stroke={C.cyan} strokeWidth={34} strokeDasharray={`${CIRC * pie} ${CIRC}`} transform="rotate(-90 170 170)" strokeLinecap="butt" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 76, color: C.text }}>{Math.round(pie * 100)}%</div>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 24, color: C.dim }}>if H₀ is true</div>
          </div>
        </div>
        <div style={{ opacity: interpolate(rej, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(rej, [0, 1], [0.7, 1]) * breathe(frame, 12, 0.02)})` }}>
          <Tag color={C.amber} size={36} style={{ padding: "18px 30px" }}>
            reject H₀ ?
          </Tag>
        </div>
      </div>
    </SceneShell>
  );
};

// =====================================================================================
// S4 — what noise looks like
// =====================================================================================
export const s4Beats = (fps: number) => ({
  code: seg(fps, "s4", 0) + 6,
  grow: seg(fps, "s4", 1) + 4,
  band: wordAt(fps, "s4", "48", 3.0),
  luck: seg(fps, "s4", 3),
});

const NOISE_CODE = ["rng = np.random.default_rng(42)", "sims = rng.binomial(2487, 0.5, 10_000) / 2487"];

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  return (
    <SceneShell id="s4">
      <Cell n={3} delay={0}>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: 24, color: C.comment, marginBottom: 6 }}># 10,000 imaginary seasons of a fair coin</div>
        <Code lines={NOISE_CODE} start={b.code} cps={2.6} size={25} />
      </Cell>
      <Cell n={3} kind="Out" delay={b.grow - 8} style={{ marginTop: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.mono, fontSize: 24, color: C.dim, marginBottom: 6 }}>
          <span>toss-winner win rate · simulated</span>
          <span>n = 2,487</span>
        </div>
        <NullHist width={W - 64} height={560} grow={b.grow} band={b.band} />
        <div style={{ display: "flex", gap: 18, marginTop: 10, flexWrap: "wrap" }}>
          <div style={{ opacity: interpolate(frame, [b.band + 8, b.band + 18], [0, 1], CLAMP), transform: `translateY(${interpolate(frame, [b.band + 8, b.band + 18], [16, 0], { easing: theme.ease.out, ...CLAMP })}px)` }}>
            <Tag color={C.green} size={26}>
              coin-flip zone · 48–52%
            </Tag>
          </div>
          <div style={{ opacity: interpolate(frame, [b.band + 16, b.band + 26], [0, 1], CLAMP) }}>
            <Tag color={C.dim} size={26}>
              {(SIM_IN_BAND * 100).toFixed(1)}% of sims land here
            </Tag>
          </div>
        </div>
      </Cell>
      <Entrance delay={b.luck} y={30} style={{ marginTop: 34, textAlign: "center" }}>
        <Heading size={64} color={C.green}>
          = pure luck
        </Heading>
      </Entrance>
    </SceneShell>
  );
};

// =====================================================================================
// S5 — the ODI test
// =====================================================================================
export const s5Beats = (fps: number) => ({
  code: seg(fps, "s5", 0) + 2,
  won: seg(fps, "s5", 1),
  drop: seg(fps, "s5", 2) - 4,
  p: seg(fps, "s5", 3),
  none: seg(fps, "s5", 4),
});

export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const code = ["obs = 1244 / 2487        # ODI toss winners", "binomtest(1244, 2487, p=0.5).pvalue"];
  const pctP = spring({ frame: frame - b.drop - 6, fps, config: theme.spring.snappy });
  const pP = spring({ frame: frame - b.p - 2, fps, config: theme.spring.snappy });
  const nP = spring({ frame: frame - b.none, fps, config: theme.spring.bouncy });
  return (
    <SceneShell id="s5">
      <Cell n={4} delay={0}>
        <Code lines={code} start={b.code} cps={2.6} size={25} />
      </Cell>
      <Cell n={4} kind="Out" delay={b.won - 10} style={{ marginTop: 26 }}>
        <NullHist width={W - 64} height={520} grow={-200} band={-200} instant observed={{ at: b.drop, value: 50.02 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 6 }}>
          <div style={{ opacity: pctP, transform: `translateY(${(1 - pctP) * 30}px)` }}>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 24, color: C.dim }}>observed</div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 104, fontWeight: 700, color: C.amber, lineHeight: 1 }}>50.0%</div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 24, color: C.dim, marginTop: 6 }}>1,244 / 2,487</div>
          </div>
          <div style={{ opacity: pP, transform: `translateY(${(1 - pP) * 30}px)`, textAlign: "right" }}>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 24, color: C.dim }}>p-value</div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 104, fontWeight: 700, color: C.text, lineHeight: 1 }}>0.98</div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 24, color: C.dim, marginTop: 6 }}>≫ α = 0.05</div>
          </div>
        </div>
      </Cell>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 36, opacity: interpolate(nP, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(nP, [0, 1], [0.8, 1])})` }}>
        <Tag color={C.green} size={34} style={{ padding: "16px 30px" }}>
          <Check size={34} p={interpolate(frame, [b.none + 4, b.none + 16], [0, 1], CLAMP)} /> no signal · fail to reject H₀
        </Tag>
      </div>
    </SceneShell>
  );
};

// =====================================================================================
// S6 — every format (forest plot)
// =====================================================================================
export const s6Beats = (fps: number) => ({
  odi: seg(fps, "s6", 0) + 10,
  t20: seg(fps, "s6", 1),
  ipl: seg(fps, "s6", 2),
  inside: seg(fps, "s6", 3),
  test: seg(fps, "s6", 4),
  p: wordAt(fps, "s6", "p-value", 3.4),
});

const FOREST = [
  { f: "ODI", n: 2487, v: 50.0, lo: 48.1, hi: 52.0, band: [48.0, 52.0] },
  { f: "T20I", n: 3530, v: 50.5, lo: 48.9, hi: 52.2, band: [48.4, 51.6] },
  { f: "IPL", n: 1218, v: 51.6, lo: 48.8, hi: 54.4, band: [47.2, 52.8] },
  { f: "TEST", n: 730, v: 54.2, lo: 50.6, hi: 57.8, band: [46.4, 53.6] },
];

export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const code = ["for fmt in [\"ODI\", \"T20I\", \"IPL\", \"TEST\"]:", "    binomtest(wins[fmt], n[fmt], p=0.5)"];
  const width = W - 64;
  const x = scaleLin(44, 60, 210, width - 30);
  const rowH = 150;
  const starts = [b.odi, b.t20, b.ipl, b.test];
  const H = rowH * 4 + 90;
  return (
    <SceneShell id="s6">
      <Cell n={5} delay={0}>
        <Code lines={code} start={4} cps={3} size={25} />
      </Cell>
      <Cell n={5} kind="Out" delay={b.odi - 8} style={{ marginTop: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.mono, fontSize: 22, color: C.dim, marginBottom: 8 }}>
          <span>toss-winner win % · 95% CI</span>
          <span style={{ color: C.green }}>▮ coin-flip zone</span>
        </div>
        <svg width={width} height={H} style={{ overflow: "visible" }}>
          <line x1={x(50)} x2={x(50)} y1={0} y2={rowH * 4} stroke={C.gridHi} strokeWidth={2} strokeDasharray="5 7" />
          {[44, 48, 50, 52, 56, 60].map((t) => (
            <text key={t} x={x(t)} y={rowH * 4 + 46} fontFamily={theme.fonts.mono} fontSize={24} fill={C.dim} textAnchor="middle">
              {t}%
            </text>
          ))}
          {FOREST.map((r, i) => {
            const p = spring({ frame: frame - starts[i], fps, config: theme.spring.smooth });
            const cy = rowH * i + rowH / 2;
            const isTest = r.f === "TEST";
            const col = isTest ? C.coral : C.cyan;
            const ok = interpolate(frame, [b.inside + i * 5, b.inside + i * 5 + 12], [0, 1], CLAMP);
            return (
              <g key={r.f} opacity={interpolate(p, [0, 0.2], [0, 1], CLAMP)}>
                <rect x={x(r.band[0])} y={cy - 40} width={(x(r.band[1]) - x(r.band[0])) * p} height={80} rx={10} fill={C.green} opacity={0.12} />
                <text x={0} y={cy - 2} fontFamily={theme.fonts.mono} fontSize={34} fontWeight={700} fill={isTest ? C.coral : C.text}>
                  {r.f}
                </text>
                <text x={0} y={cy + 32} fontFamily={theme.fonts.mono} fontSize={21} fill={C.dim}>
                  n={r.n.toLocaleString("en-US")}
                </text>
                <Whisker x={x} y={cy} lo={r.lo} hi={r.hi} v={r.v} color={col} p={p} />
                <text x={x(r.v)} y={cy - 26} fontFamily={theme.fonts.mono} fontSize={28} fontWeight={700} fill={col} textAnchor="middle" opacity={interpolate(p, [0.5, 1], [0, 1], CLAMP)}>
                  {r.v.toFixed(1)}
                </text>
                {!isTest && i < 3 && (
                  <g transform={`translate(${width - 40}, ${cy - 17})`} opacity={ok}>
                    <path d="M4 18l9 9L32 6" fill="none" stroke={C.green} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={44} strokeDashoffset={44 * (1 - ok)} />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </Cell>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
        {(() => {
          const p = spring({ frame: frame - b.p, fps, config: theme.spring.bouncy });
          return (
            <div style={{ opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(p, [0, 1], [0.8, 1]) * breathe(frame, 14, 0.015)})` }}>
              <Tag color={C.coral} size={34} style={{ padding: "16px 30px" }}>
                TEST · p = 0.02 · outside the zone
              </Tag>
            </div>
          );
        })()}
      </div>
    </SceneShell>
  );
};

// =====================================================================================
// S7 — pitfall 1: cherry-picking the 2021 World Cup
// =====================================================================================
export const s7Beats = (fps: number) => ({
  pit: seg(fps, "s7", 1),
  y21: seg(fps, "s7", 2),
  next: seg(fps, "s7", 3),
  trend: seg(fps, "s7", 4),
});

const WC = [
  { y: "2021", v: 66.7, k: "30/45" },
  { y: "2022", v: 39.5, k: "15/38" },
  { y: "2024", v: 56.1, k: "23/41" },
  { y: "2026", v: 42.9, k: "21/49" },
];

export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const width = W - 64, height = 700;
  const y = scaleLin(0, 80, height - 60, 20);
  const colW = 170, gap = (width - 80 - colW * 4) / 3;
  const starts = [b.y21 + 10, b.next + 12, b.next + 30, b.next + 48];
  const bandP = interpolate(frame, [b.trend, b.trend + fps * 0.6], [0, 1], { easing: theme.ease.out, ...CLAMP });
  return (
    <SceneShell id="s7">
      <Entrance delay={4} y={24}>
        <Heading size={60}>Why does the myth feel true?</Heading>
      </Entrance>
      <div style={{ marginTop: 22, opacity: interpolate(frame, [b.pit, b.pit + 8], [0, 1], CLAMP), transform: `translateX(${interpolate(frame, [b.pit, b.pit + 12], [-40, 0], { easing: theme.ease.out, ...CLAMP })}px)` }}>
        <Tag color={C.coral} size={30}>
          PITFALL 1 · cherry-picking
        </Tag>
      </div>
      <Cell n={6} kind="Out" delay={b.y21 - 6} style={{ marginTop: 30 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.mono, fontSize: 22, color: C.dim, marginBottom: 6 }}>
          <span>T20 World Cup · toss-winner win %</span>
          <span style={{ color: C.green, opacity: bandP }}>▮ 95% noise band, n ≈ 45</span>
        </div>
        <svg width={width} height={height} style={{ overflow: "visible" }}>
          {/* noise band for n≈45 */}
          <rect x={60} y={y(64.6)} width={(width - 60) * bandP} height={y(35.4) - y(64.6)} fill={C.green} opacity={0.1} rx={8} />
          <line x1={60} x2={width} y1={y(50)} y2={y(50)} stroke={C.gridHi} strokeWidth={2} strokeDasharray="6 8" />
          <text x={0} y={y(50) + 8} fontFamily={theme.fonts.mono} fontSize={22} fill={C.dim}>50%</text>
          {WC.map((d, i) => {
            const p = spring({ frame: frame - starts[i], fps, config: theme.spring.smooth });
            const bx = 80 + i * (colW + gap);
            const top = y(d.v * p);
            const hero = i === 0;
            return (
              <g key={d.y} opacity={interpolate(p, [0, 0.1], [0, 1], CLAMP)}>
                <rect x={bx} y={top} width={colW} height={y(0) - top} rx={10} fill={hero ? C.coral : C.cyan} opacity={hero ? 0.95 : 0.75} />
                <text x={bx + colW / 2} y={top - 50} fontFamily={theme.fonts.mono} fontSize={42} fontWeight={700} fill={hero ? C.coral : C.text} textAnchor="middle">
                  {Math.round(d.v * p)}%
                </text>
                <text x={bx + colW / 2} y={top - 16} fontFamily={theme.fonts.mono} fontSize={22} fill={C.dim} textAnchor="middle">
                  {d.k}
                </text>
                <text x={bx + colW / 2} y={y(0) + 44} fontFamily={theme.fonts.mono} fontSize={28} fill={hero ? C.coral : C.dim} textAnchor="middle" fontWeight={600}>
                  {d.y}
                </text>
              </g>
            );
          })}
        </svg>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 18, color: C.faint, marginTop: 16 }}>
          2021 includes 5 Afghanistan games from official scorecards; 2022–26 exclude Afghanistan (withheld by Cricsheet).
        </div>
      </Cell>
      <Entrance delay={b.trend + 6} y={24} style={{ marginTop: 30, textAlign: "center" }}>
        <Heading size={54} color={C.text}>
          one sample <span style={{ color: C.coral }}>≠</span> a trend
        </Heading>
      </Entrance>
    </SceneShell>
  );
};

// =====================================================================================
// S8 — pitfall 2: regression to the mean (slope chart)
// =====================================================================================
export const s8Beats = (fps: number) => ({
  split: seg(fps, "s8", 1),
  top: seg(fps, "s8", 2),
  bottom: seg(fps, "s8", 3),
  r: seg(fps, "s8", 4),
  nothing: seg(fps, "s8", 5),
});

const TOP8 = [
  [71.0, 58.1], [67.9, 39.3], [65.0, 40.0], [64.0, 36.0], [63.6, 41.2], [61.5, 50.0], [60.7, 28.6], [59.1, 45.5],
];
const BOT8 = [
  [41.0, 32.5], [40.5, 53.5], [40.0, 53.8], [39.3, 60.7], [39.2, 41.2], [38.1, 57.1], [38.1, 33.3], [33.3, 40.9],
];

export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  const width = W - 64, height = 760;
  const y = scaleLin(25, 75, height - 50, 30);
  const xL = 190, xR = width - 190;
  const axisP = interpolate(frame, [b.split, b.split + fps * 0.6], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const group = (rows: number[][], start: number, color: string, mean: [number, number]) => (
    <g>
      {rows.map((r, i) => {
        const p = interpolate(frame, [start + i * 3, start + i * 3 + fps * 0.8], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
        const x2 = xL + (xR - xL) * p;
        const y2 = y(r[0] + (r[1] - r[0]) * p);
        return (
          <g key={i} opacity={interpolate(frame, [start + i * 3 - 4, start + i * 3], [0, 1], CLAMP)}>
            <line x1={xL} y1={y(r[0])} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} opacity={0.4} />
            <circle cx={xL} cy={y(r[0])} r={7} fill={color} opacity={0.6} />
            {p > 0.98 && <circle cx={xR} cy={y(r[1])} r={7} fill={color} opacity={0.6} />}
          </g>
        );
      })}
      {(() => {
        const p = interpolate(frame, [start + 30, start + 30 + fps * 0.8], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
        const on = interpolate(frame, [start + 26, start + 32], [0, 1], CLAMP);
        return (
          <g opacity={on}>
            <line x1={xL} y1={y(mean[0])} x2={xL + (xR - xL) * p} y2={y(mean[0] + (mean[1] - mean[0]) * p)} stroke={color} strokeWidth={8} strokeLinecap="round" />
            <circle cx={xL} cy={y(mean[0])} r={14} fill={color} />
            <text x={xL - 26} y={y(mean[0]) + 12} fontFamily={theme.fonts.mono} fontSize={36} fontWeight={700} fill={color} textAnchor="end">
              {Math.round(mean[0])}%
            </text>
            <g opacity={p > 0.95 ? 1 : 0}>
              <circle cx={xR} cy={y(mean[1])} r={14} fill={color} />
              <text x={xR + 26} y={y(mean[1]) + 12} fontFamily={theme.fonts.mono} fontSize={36} fontWeight={700} fill={color}>
                {Math.round(mean[1])}%
              </text>
            </g>
          </g>
        );
      })()}
    </g>
  );
  const rP = spring({ frame: frame - b.r - 4, fps, config: theme.spring.snappy });
  return (
    <SceneShell id="s8">
      <Tag color={C.coral} size={30}>
        PITFALL 2 · regression to the mean
      </Tag>
      <Cell n={7} kind="Out" delay={b.split - 8} style={{ marginTop: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.mono, fontSize: 22, color: C.dim }}>
          <span>toss-winner win % by ground</span>
          <span>
            <span style={{ color: C.coral }}>● top 8</span>  <span style={{ color: C.cyan }}>● bottom 8</span>
          </span>
        </div>
        <svg width={width} height={height} style={{ overflow: "visible" }}>
          <line x1={xL} x2={xL} y1={y(75)} y2={y(75) + (y(25) - y(75)) * axisP} stroke={C.gridHi} strokeWidth={2} />
          <line x1={xR} x2={xR} y1={y(75)} y2={y(75) + (y(25) - y(75)) * axisP} stroke={C.gridHi} strokeWidth={2} />
          <line x1={xL} x2={xL + (xR - xL) * axisP} y1={y(50)} y2={y(50)} stroke={C.gridHi} strokeWidth={2} strokeDasharray="6 8" />
          <text x={xL} y={height + 6} fontFamily={theme.fonts.mono} fontSize={26} fill={C.dim} textAnchor="middle" opacity={axisP}>1st half</text>
          <text x={xR} y={height + 6} fontFamily={theme.fonts.mono} fontSize={26} fill={C.dim} textAnchor="middle" opacity={axisP}>2nd half</text>
          <text x={(xL + xR) / 2} y={y(50) - 12} fontFamily={theme.fonts.mono} fontSize={22} fill={C.dim} textAnchor="middle" opacity={axisP}>50%</text>
          {group(TOP8, b.top + 4, C.coral, [64.1, 42.3])}
          {group(BOT8, b.bottom + 2, C.cyan, [38.7, 46.6])}
        </svg>
      </Cell>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 30 }}>
        <div style={{ opacity: interpolate(rP, [0, 0.3], [0, 1], CLAMP), transform: `translateY(${(1 - rP) * 30}px)` }}>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 24, color: C.dim }}>corr(1st, 2nd) · 52 grounds</div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 100, fontWeight: 700, color: C.amber, lineHeight: 1 }}>r = −0.09</div>
        </div>
        <Entrance delay={b.nothing} x={40} y={0}>
          <div style={{ textAlign: "right", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, color: C.text, lineHeight: 1.1 }}>
            past luck
            <br />
            <span style={{ color: C.dim }}>predicts nothing</span>
          </div>
        </Entrance>
      </div>
    </SceneShell>
  );
};

// =====================================================================================
// S9 — segment the data
// =====================================================================================
export const s9Beats = (fps: number) => ({
  code: seg(fps, "s9", 0) + 4,
  test: seg(fps, "s9", 1),
  ipl: seg(fps, "s9", 2),
  bowl: seg(fps, "s9", 3),
  decision: seg(fps, "s9", 4),
  does: wordAt(fps, "s9", "decision", 1.6),
});

const SEG = [
  { f: "TEST", bars: [{ k: "bat 1st", v: 57.1, lo: 52.7, hi: 61.3, hero: true }, { k: "bowl 1st", v: 48.3, lo: 42.0, hi: 54.7, hero: false }] },
  { f: "IPL", bars: [{ k: "bowl 1st", v: 54.7, lo: 51.2, hi: 58.1, hero: true }, { k: "bat 1st", v: 45.3, lo: 40.6, hi: 50.2, hero: false }] },
];

export const S9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s9Beats(fps);
  const code = ['df.groupby(["format", "toss_decision"])', "  .toss_winner_won.mean()"];
  const pw = (W - 64 - 30) / 2, ph = 640;
  const y = scaleLin(35, 65, ph - 70, 60);
  const starts = [b.test + 6, b.bowl - 4];
  const coinP = interpolate(frame, [b.decision, b.decision + 14], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const decP = interpolate(frame, [b.does, b.does + 14], [0, 1], { easing: theme.ease.out, ...CLAMP });
  return (
    <SceneShell id="s9">
      <Cell n={8} delay={0}>
        <Code lines={code} start={b.code} cps={2.8} size={25} />
      </Cell>
      <Cell n={8} kind="Out" delay={b.test - 8} style={{ marginTop: 26 }}>
        <div style={{ display: "flex", gap: 30 }}>
          {SEG.map((s, si) => {
            const on = spring({ frame: frame - starts[si] + 6, fps, config: theme.spring.smooth });
            return (
              <div key={s.f} style={{ width: pw, opacity: interpolate(on, [0, 0.3], [0, 1], CLAMP), transform: `translateY(${(1 - on) * 40}px)` }}>
                <div style={{ fontFamily: theme.fonts.mono, fontSize: 34, fontWeight: 700, color: C.text, textAlign: "center" }}>{s.f}</div>
                <svg width={pw} height={ph} style={{ overflow: "visible" }}>
                  <line x1={0} x2={pw} y1={y(50)} y2={y(50)} stroke={C.gridHi} strokeWidth={2} strokeDasharray="6 8" />
                  <text x={pw} y={y(50) - 10} fontFamily={theme.fonts.mono} fontSize={20} fill={C.dim} textAnchor="end">50%</text>
                  {s.bars.map((bar, bi) => {
                    const p = spring({ frame: frame - starts[si] - bi * 8, fps, config: theme.spring.smooth });
                    const cx = pw * (bi === 0 ? 0.29 : 0.71);
                    const bw = 120;
                    const top = y(35 + (bar.v - 35) * p);
                    const col = bar.hero ? C.amber : C.dim;
                    return (
                      <g key={bar.k}>
                        <rect x={cx - bw / 2} y={top} width={bw} height={y(35) - top} rx={10} fill={col} opacity={bar.hero ? 0.9 : 0.35} />
                        <g opacity={interpolate(p, [0.6, 1], [0, 1], CLAMP)}>
                          <line x1={cx} x2={cx} y1={y(bar.hi)} y2={y(bar.lo)} stroke={C.text} strokeWidth={3} opacity={0.8} />
                          <line x1={cx - 16} x2={cx + 16} y1={y(bar.hi)} y2={y(bar.hi)} stroke={C.text} strokeWidth={3} opacity={0.8} />
                          <line x1={cx - 16} x2={cx + 16} y1={y(bar.lo)} y2={y(bar.lo)} stroke={C.text} strokeWidth={3} opacity={0.8} />
                        </g>
                        <text x={cx} y={y(bar.hi) - 18} fontFamily={theme.fonts.mono} fontSize={40} fontWeight={700} fill={bar.hero ? C.amber : C.text} textAnchor="middle" opacity={interpolate(p, [0.5, 1], [0, 1], CLAMP)}>
                          {bar.v.toFixed(1)}
                        </text>
                        <text x={cx} y={y(35) + 40} fontFamily={theme.fonts.mono} fontSize={24} fill={bar.hero ? C.amber : C.dim} textAnchor="middle">
                          {bar.k}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: 20, color: C.faint, marginTop: 4 }}>whiskers = 95% CI · win % of toss winners by their decision</div>
      </Cell>
      <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 34 }}>
        <div style={{ opacity: coinP, transform: `translateY(${(1 - coinP) * 20}px)`, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, color: C.dim }}>coin</span>
          <Cross size={50} p={coinP} />
        </div>
        <div style={{ opacity: decP, transform: `translateY(${(1 - decP) * 20}px) scale(${breathe(frame, 16, 0.015)})`, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, color: C.text }}>decision</span>
          <Check size={50} p={decP} />
        </div>
      </div>
    </SceneShell>
  );
};

// =====================================================================================
// S10 — conclusion
// =====================================================================================
export const s10Beats = (fps: number) => ({
  code: seg(fps, "s10", 0) + 2,
  all: seg(fps, "s10", 1),
  ci: seg(fps, "s10", 2),
  fail: seg(fps, "s10", 3),
  verdict: seg(fps, "s10", 4),
  stamp: wordAt(fps, "s10", "mostly", 0.9),
  cta: seg(fps, "s10", 5),
});

export const S10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s10Beats(fps);
  const width = W - 64;
  const x = scaleLin(47, 54, 40, width - 40);
  const ciP = spring({ frame: frame - b.ci - 4, fps, config: theme.spring.smooth });
  const stampP = spring({ frame: frame - b.stamp, fps, config: theme.spring.stamp });
  const ctaStart = b.cta - 6;
  const body = interpolate(frame, [ctaStart, ctaStart + 10], [1, 0], { easing: theme.ease.in, ...CLAMP });
  const code = ["binomtest(4051, 7965, p=0.5)   # all formats"];
  return (
    <SceneShell id="s10" noExit>
      <div style={{ opacity: body, transform: `translateY(${(1 - body) * -40}px)` }}>
        <Cell n={9} delay={0}>
          <Code lines={code} start={b.code} cps={3} size={25} />
        </Cell>
        <Cell n={9} kind="Out" delay={b.all - 6} style={{ marginTop: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: 24, color: C.dim }}>estimate</div>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: 104, fontWeight: 700, color: C.amber, lineHeight: 1 }}>50.9%</div>
            </div>
            <div style={{ textAlign: "right", fontFamily: theme.fonts.mono, fontSize: 30, color: C.dim, lineHeight: 1.5, opacity: interpolate(ciP, [0, 0.4], [0, 1], CLAMP) }}>
              95% CI <span style={{ color: C.text }}>[49.8, 52.0]</span>
              <br />p = <span style={{ color: C.text }}>0.12</span>
            </div>
          </div>
          <svg width={width} height={230} style={{ overflow: "visible", marginTop: 20 }}>
            <line x1={x(50)} x2={x(50)} y1={10} y2={150} stroke={C.green} strokeWidth={3} strokeDasharray="6 7" opacity={interpolate(ciP, [0, 0.3], [0, 1], CLAMP)} />
            <text x={x(50)} y={190} fontFamily={theme.fonts.mono} fontSize={24} fill={C.green} textAnchor="middle" opacity={interpolate(ciP, [0, 0.3], [0, 1], CLAMP)}>
              H₀: 50%
            </text>
            <Whisker x={x} y={80} lo={49.8} hi={52.0} v={50.9} color={C.amber} p={ciP} r={16} />
            {[48, 50, 52, 54].map((t) => (
              <text key={t} x={x(t)} y={226} fontFamily={theme.fonts.mono} fontSize={20} fill={C.faint} textAnchor="middle">
                {t}%
              </text>
            ))}
          </svg>
        </Cell>
        <Entrance delay={b.fail} y={30} style={{ marginTop: 40, textAlign: "center" }}>
          <Heading size={70} color={C.green}>
            Fail to reject H₀
          </Heading>
        </Entrance>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 50, height: 170 }}>
          <div
            style={{
              opacity: interpolate(stampP, [0, 0.2], [0, 1], CLAMP),
              transform: `rotate(-6deg) scale(${interpolate(stampP, [0, 1], [2.2, 1])})`,
              border: `6px solid ${C.coral}`,
              borderRadius: 18,
              padding: "14px 40px",
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: 96,
              letterSpacing: "0.04em",
              color: C.coral,
              boxShadow: `0 0 50px ${C.coralGlow}`,
            }}
          >
            MOSTLY NOISE
          </div>
        </div>
      </div>
      {/* CTA + lockup */}
      <div style={{ position: "absolute", left: 0, top: 220, width: W, textAlign: "center" }}>
        <Entrance delay={b.cta} y={40}>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 30, color: C.comment, marginBottom: 20 }}># next experiment</div>
          <Heading size={82}>
            Which cricket belief
            <br />
            should we <span style={{ color: C.amber }}>test next?</span>
          </Heading>
        </Entrance>
        <Entrance delay={b.cta + 16} y={30} style={{ marginTop: 50 }}>
          <Tag color={C.cyan} size={32} style={{ padding: "16px 32px" }}>
            drop it in the comments ↓
          </Tag>
        </Entrance>
        <Entrance delay={b.cta + 30} y={30} style={{ marginTop: 160 }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, letterSpacing: "0.18em", color: C.text }}>BEYOND THE SCOREBOARD</div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 26, color: C.cyan, marginTop: 12, letterSpacing: "0.1em" }}>DATA LAB · #01</div>
          <div style={{ fontFamily: theme.fonts.body, fontSize: 20, color: C.faint, marginTop: 34 }}>Data: Cricsheet.org (ODC-BY) · men's Tests, ODIs, T20Is, IPL · decided matches</div>
        </Entrance>
      </div>
    </SceneShell>
  );
};
