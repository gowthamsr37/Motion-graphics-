// Abhishek Sharma vs KL Rahul — T20Is. Nine scenes; every reveal is tied to the narrator's words.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { rng } from "../components/Board";
import { CLAMP } from "../components/Motion";
import { Lamp, Lettering, Panel } from "../components/Panel";
import { CutoutFrame } from "../components/Cutout";
import { SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { BallRace, BatEmblem, Gauge, PairRow, PhaseChart, Ring, RunsBallsChart, SimBoard, SixStrip, Tag } from "../components/Viz";
import { A_COL, boundaryBallPct, career, model, R_COL, sample } from "../data";
import { theme } from "../theme";
import { sentence, wordAt } from "../timing";
import { Reveal, useAt, useFlip } from "./common";

const C = theme.colors;
const A = career.abhishek, R = career.rahul;

// digits spin (blurred) until `stopAt`, then the real number flips into place
const SpinCounter: React.FC<{ target: string; stopAt: number; seed: number; w: number; h: number; color: string; startAt?: number }> = ({ target, stopAt, seed, w, h, color, startAt = 0 }) => {
  const frame = useCurrentFrame();
  const spinning = frame >= startAt && frame < stopAt;
  const r = rng(seed + Math.floor(frame / 2) * 7);
  const text = frame < startAt ? "0".repeat(target.length) : spinning ? target.split("").map(() => String(Math.floor(r() * 10))).join("") : target;
  const flip = useFlip(stopAt, 3);
  return <Plates text={text} prev={spinning || frame < startAt ? undefined : "0".repeat(target.length)} progress={spinning || frame < startAt ? () => 1 : flip} w={w} h={h} gap={8} color={spinning ? C.creamDim : color} glow={spinning ? undefined : `${color}88`} blur={spinning ? 2.2 : 0} />;
};

// Abhishek has no freely licensed photograph: an original scoreboard player plate stands in (no likeness).
const PlayerPlate: React.FC<{ who: "abhishek" | "rahul"; x: number; y: number; w: number; h: number; delay?: number; closeAt?: number; lit?: number; seed?: number }> = ({ who, x, y, w, h, delay = 0, closeAt, lit = 1, seed = 900 }) => {
  const p = who === "abhishek" ? A : R;
  const col = who === "abhishek" ? A_COL : R_COL;
  return (
    <Panel x={x} y={y} w={w} h={h} delay={delay} closeAt={closeAt} seed={seed} glow={`${col}66`} glowOn={0.6 * lit}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: col, opacity: 0.85 }} />
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, opacity: 0.4 + 0.6 * lit }}>
        <BatEmblem size={Math.min(170, h * 0.42)} color={col} glow={lit} />
        <div style={{ textAlign: "center", lineHeight: 1 }}>
          <Lettering size={w > 600 ? 84 : 58} color={C.cream}>
            {p.name}
          </Lettering>
        </div>
        <Lettering size={20} font="body" color={col} spacing="0.24em">
          INDIA · {p.era}
        </Lettering>
      </div>
    </Panel>
  );
};

/* ================= S1 — THE IMPOSSIBLE COMPARISON ================= */
export const s1Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4].map((i) => sentence(fps, "s1", i));
  return { each: s[0].from, aStop: s[1].to - 4, rStop: s[2].to - 4, same: s[3].from, diff: s[4].from, graph: s[4].from + 6, bracket: s[4].to + 6 };
};

export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const same = interpolate(frame, [b.same, b.same + 10], [0, 1], CLAMP);
  const balls = useFlip(b.diff + 4, 3);
  return (
    <SceneShell push={0.025} turnIn={false}>
      <CutoutFrame id="abhishek-cutout" x={60} y={226} w={470} h={380} delay={-6} label="ABHISHEK" labelColor={A_COL} seed={101} life={500} />
      <CutoutFrame id="rahul-cutout" x={550} y={226} w={470} h={380} delay={0} label="KL RAHUL" labelColor={R_COL} seed={102} life={500} />
      {[
        { x: 60, name: "ABHISHEK", runs: String(A.runs), balls: String(A.balls), stop: b.aStop, col: A_COL, seed: 4 },
        { x: 550, name: "RAHUL", runs: String(R.runs), balls: String(R.balls), stop: b.rStop, col: R_COL, seed: 9 },
      ].map((c) => (
        <Panel key={c.name} x={c.x} y={622} w={470} h={250} delay={4} seed={110 + c.seed} glow={`${c.col}55`} glowOn={same}>
          <div style={{ position: "absolute", top: 18, width: "100%", textAlign: "center" }}>
            <Lettering size={26} font="body" color={c.col} spacing="0.26em">
              {c.name} · RUNS
            </Lettering>
          </div>
          <div style={{ position: "absolute", top: 60, width: "100%", display: "flex", justifyContent: "center" }}>
            <SpinCounter target={c.runs} stopAt={c.stop} seed={c.seed} w={86} h={120} color={c.col} startAt={c.x === 60 ? sentence(fps, "s1", 1).from : sentence(fps, "s1", 2).from} />
          </div>
          <div style={{ position: "absolute", top: 196, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 12, opacity: interpolate(frame, [b.diff, b.diff + 8], [0, 1], CLAMP) }}>
            <Plates text={c.balls} prev="    " progress={balls} w={30} h={42} gap={4} color={C.cream} />
            <Lettering size={30} color={C.creamDim}>
              BALLS
            </Lettering>
          </div>
        </Panel>
      ))}
      <div style={{ position: "absolute", left: 340, top: 600, width: 400, textAlign: "center", opacity: interpolate(frame, [b.each, b.each + 8, b.diff - 4, b.diff + 6], [0, 1, 1, 0], CLAMP) }}>
        <Tag text={same > 0.5 ? "3 RUNS APART" : "72 T20Is EACH"} col={C.amber} size={20} />
      </div>
      <Panel x={60} y={888} w={960} h={462} delay={b.graph - 10} seed={120}>
        <div style={{ position: "absolute", left: 30, top: 18 }}>
          <Tag text="CAREER TOTALS · T20Is ONLY · STRAIGHT LINES SHOW AVERAGE RATE" col={C.creamDim} size={14} />
        </div>
        <div style={{ position: "absolute", left: 10, top: 56 }}>
          <RunsBallsChart w={940} h={390} at={b.graph} bracketAt={b.bracket} />
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S2 — THE SCORING SPEED ================= */
export const s2Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s2", i));
  return { a: s[0].from, r: s[1].from, race: s[0].from + 10, raceEnd: s[1].to + 10, gap: s[2].from + 10 };
};

export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const gap = useAt(b.gap, theme.spring.bouncy);
  return (
    <SceneShell push={0.03}>
      <Panel x={60} y={226} w={960} h={96} delay={0} seed={201}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
          <Lettering size={54}>STRIKE RATE</Lettering>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
            RUNS PER 100 BALLS · CAREER
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={338} w={960} h={430} delay={4} seed={202}>
        <div style={{ position: "absolute", left: 20, right: 20, top: 40, display: "flex", justifyContent: "space-around" }}>
          <Gauge value={A.sr} label="ABHISHEK" col={A_COL} at={b.a} size={420} />
          <Gauge value={R.sr} label="RAHUL" col={R_COL} at={b.r} size={420} />
        </div>
      </Panel>
      <Panel x={60} y={784} w={960} h={330} delay={b.race - 8} seed={203}>
        <div style={{ position: "absolute", left: 36, top: 26 }}>
          <BallRace from={b.race} to={b.raceEnd} w={888} />
        </div>
      </Panel>
      <Panel x={60} y={1130} w={960} h={220} delay={b.gap - 8} seed={204} glow={C.amberGlow} glowOn={0.5}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 28, transform: `scale(${interpolate(gap, [0, 1], [1.15, 1])})` }}>
          <Lettering size={120} color={A_COL} style={{ textShadow: `0 0 24px ${C.amberGlow}` }}>
            +57
          </Lettering>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Lettering size={40}>RUNS PER 100 BALLS</Lettering>
            <Lettering size={22} font="body" color={C.creamDim} spacing="0.16em">
              196.36 − 139.13 = 57.23
            </Lettering>
          </div>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S3 — THE BOUNDARY MACHINE ================= */
export const s3Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s3", i));
  return { a: s[0].from, r: s[1].from, rows: s[1].to - 6, share: s[2].from };
};

export const S3: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  return (
    <SceneShell push={0.025}>
      <Panel x={60} y={226} w={960} h={330} delay={0} seed={301}>
        <div style={{ position: "absolute", left: 36, right: 36, top: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Lettering size={44}>ONE SIX EVERY…</Lettering>
          <Lettering size={18} font="body" color={C.creamDim} spacing="0.16em">
            AT CAREER RATE · 33 BALLS SHOWN
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 36, top: 100 }}>
          <SixStrip every={A.bp6} col={A_COL} at={b.a + 6} n={33} w={888} label="7.26 BALLS" />
        </div>
        <div style={{ position: "absolute", left: 36, top: 206 }}>
          <SixStrip every={R.bp6} col={R_COL} at={b.r} n={33} w={888} label="16.44 BALLS" />
        </div>
      </Panel>
      <Panel x={60} y={572} w={960} h={420} delay={b.rows - 8} seed={302}>
        <div style={{ position: "absolute", left: 36, right: 36, top: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          <PairRow label="SIXES" a={A.sixes} r={R.sixes} max={240} at={b.rows} w={888} />
          <PairRow label="FOURS" a={A.fours} r={R.fours} max={240} at={b.rows + 6} w={888} />
          <PairRow label="BALLS PER SIX" note="FEWER = MORE OFTEN" a={A.bp6} r={R.bp6} max={18} at={b.rows + 12} w={888} fmt={(v) => v.toFixed(2)} />
          <PairRow label="BALLS / BOUNDARY" note="FEWER = MORE OFTEN" a={A.bpb} r={R.bpb} max={18} at={b.rows + 18} w={888} fmt={(v) => v.toFixed(2)} />
        </div>
      </Panel>
      <Panel x={60} y={1008} w={960} h={342} delay={b.share - 8} seed={303} glow={C.amberGlow} glowOn={0.4}>
        <div style={{ position: "absolute", top: 18, width: "100%", textAlign: "center" }}>
          <Lettering size={24} font="body" color={C.cream} spacing="0.24em">
            SHARE OF RUNS FROM BOUNDARIES
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 56, display: "flex", justifyContent: "space-around" }}>
          <Ring pct={A.boundaryShare} col={A_COL} at={b.share + 4} size={220} label="ABHISHEK" />
          <Ring pct={R.boundaryShare} col={R_COL} at={b.share + 12} size={220} label="RAHUL" />
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S4 — THE FIRST TEN BALLS (SAMPLE) ================= */
export const s4Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s4", i));
  return { start: s[0].from, a: s[1].from + 10, aCall: wordAt(fps, "s4", "180", 6.26), r: s[1].from + 40, rCall: s[2].from };
};

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const tile = (name: string, v: number, col: string, at: number) => {
    const on = interpolate(frame, [at, at + 10], [0, 1], CLAMP);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.25 + 0.75 * on, transform: `scale(${0.95 + 0.05 * on})` }}>
        <Lettering size={26} font="body" color={col} spacing="0.2em">
          {name}
        </Lettering>
        <Lettering size={96} color={col} style={{ textShadow: `0 0 ${18 * on}px ${col}88` }}>
          ~{v.toFixed(1)}
        </Lettering>
      </div>
    );
  };
  return (
    <SceneShell push={0.025}>
      <Panel x={60} y={226} w={960} h={96} delay={0} seed={401}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 36px" }}>
          <Lettering size={50}>STRIKE RATE BY BALLS FACED</Lettering>
          <Tag text="SAMPLE" col={C.amber} size={18} />
        </div>
      </Panel>
      <Panel x={60} y={338} w={960} h={700} delay={4} seed={402}>
        <div style={{ position: "absolute", left: 10, top: 24 }}>
          <PhaseChart a={sample.phaseSR.abhishek} r={sample.phaseSR.rahul} labels={sample.phases} atA={b.a} atR={b.r} focusAt={b.aCall} w={940} h={600} />
        </div>
        <div style={{ position: "absolute", right: 36, top: 26, display: "flex", gap: 18 }}>
          <Tag text="ABHISHEK" col={A_COL} size={16} />
          <Tag text="RAHUL" col={R_COL} size={16} />
        </div>
      </Panel>
      <Panel x={60} y={1054} w={960} h={296} delay={b.aCall - 10} seed={403} glow={C.amberGlow} glowOn={0.4}>
        <div style={{ position: "absolute", top: 16, width: "100%", textAlign: "center" }}>
          <Lettering size={22} font="body" color={C.amber} spacing="0.24em">
            FIRST 10 BALLS · POOLED STRIKE RATE
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 54, display: "flex", justifyContent: "space-around" }}>
          {tile("ABHISHEK", sample.firstTen.abhishek, A_COL, b.aCall)}
          {tile("RAHUL", sample.firstTen.rahul, R_COL, b.rCall)}
        </div>
        <div style={{ position: "absolute", bottom: 14, width: "100%", textAlign: "center" }}>
          <Lettering size={14} font="body" color={C.creamDim} spacing="0.14em">
            AVAILABLE-MATCH BALL-BY-BALL SAMPLE · POOLED RATES, NOT RUNS PER INNINGS · NOT EVERY INNINGS REACHES 10 BALLS
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S5 — THE POWERPLAY EFFECT ================= */
export const s5Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s5", i));
  return { overs: s[0].from, a: wordAt(fps, "s5", "191", 3.02), r: s[1].from, team: s[2].from };
};

export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const bar = (name: string, v: number, col: string, at: number) => {
    const p = interpolate(frame, [at, at + 24], [0, 1], { easing: theme.ease.out, ...CLAMP });
    return (
      <div style={{ display: "flex", alignItems: "center", height: 120 }}>
        <div style={{ width: 200 }}>
          <Lettering size={44} color={col}>
            {name}
          </Lettering>
        </div>
        <div style={{ position: "relative", width: 520, height: 70, background: C.plate, borderRadius: 6, boxShadow: `inset 0 0 0 1px ${C.panelEdge}` }}>
          {[50, 100, 150].map((t) => (
            <div key={t} style={{ position: "absolute", left: (520 * t) / 200, top: -8, bottom: -8, width: 1, background: C.panelEdge }} />
          ))}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (520 * v * p) / 200, borderRadius: 6, background: col, boxShadow: `0 0 18px ${col}88` }} />
        </div>
        <div style={{ width: 168, textAlign: "right" }}>
          <Lettering size={76} color={col}>
            {(v * p).toFixed(1)}
          </Lettering>
        </div>
      </div>
    );
  };
  return (
    <SceneShell push={0.03}>
      <Panel x={60} y={226} w={960} h={196} delay={0} seed={501}>
        <div style={{ position: "absolute", left: 36, top: 22 }}>
          <Lettering size={50}>POWERPLAY · OVERS 1–6</Lettering>
        </div>
        <div style={{ position: "absolute", left: 36, right: 36, top: 100, display: "flex", gap: 6 }}>
          {Array.from({ length: 20 }).map((_, i) => {
            const on = i < 6 ? interpolate(frame, [b.overs + i * 5, b.overs + i * 5 + 5], [0, 1], CLAMP) : 0;
            return (
              <div key={i} style={{ flex: 1, height: 58, borderRadius: 5, background: i < 6 ? `rgba(242,169,59,${0.15 + 0.6 * on})` : C.plate, boxShadow: `inset 0 0 0 1px ${C.panelEdge}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: theme.fonts.display, fontSize: 26, color: i < 6 ? C.cream : C.creamDim }}>{i + 1}</span>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel x={60} y={438} w={960} h={400} delay={b.a - 12} seed={502}>
        <div style={{ position: "absolute", left: 36, right: 36, top: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Lettering size={26} font="body" color={C.cream} spacing="0.22em">
            POWERPLAY STRIKE RATE
          </Lettering>
          <Tag text="INDIVIDUAL BATTER · SAMPLE" col={C.amber} size={14} />
        </div>
        <div style={{ position: "absolute", left: 36, top: 92 }}>
          {bar("ABHISHEK", sample.powerplaySR.abhishek, A_COL, b.a)}
          {bar("RAHUL", sample.powerplaySR.rahul, R_COL, b.r)}
        </div>
        <div style={{ position: "absolute", left: 236, top: 352, width: 520, display: "flex", justifyContent: "space-between" }}>
          {[0, 50, 100, 150, 200].map((t) => (
            <Lettering key={t} size={18} color={C.creamDim}>
              {t}
            </Lettering>
          ))}
        </div>
      </Panel>
      <Panel x={60} y={854} w={960} h={300} delay={b.team - 10} seed={503}>
        <div style={{ position: "absolute", left: 36, right: 36, top: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Lettering size={24} font="body" color={C.cream} spacing="0.2em">
            POWERPLAY RUNS IN THE SAMPLE
          </Lettering>
          <Tag text="INCOMPLETE · NOT ALL 72 MATCHES" col={C.creamDim} size={14} />
        </div>
        <div style={{ position: "absolute", left: 36, top: 76 }}>
          <PairRow label="SAMPLE RUNS" a={sample.powerplayRuns.abhishek} r={sample.powerplayRuns.rahul} max={1600} at={b.team + 4} w={888} />
        </div>
        <div style={{ position: "absolute", left: 36, right: 36, bottom: 22 }}>
          <Lettering size={15} font="body" color={C.creamDim} spacing="0.12em">
            BATTER STRIKE RATES, NOT TEAM RUN RATES · RUN TOTALS ALSO REFLECT HOW MANY POWERPLAY BALLS EACH FACED IN THE SAMPLE
          </Lettering>
        </div>
      </Panel>
      <PlayerPlate who="abhishek" x={60} y={1170} w={470} h={180} delay={b.team} seed={504} />
      <PlayerPlate who="rahul" x={550} y={1170} w={470} h={180} delay={b.team + 4} seed={505} />
    </SceneShell>
  );
};

/* ================= S6 — THE DOT-BALL TWIST ================= */
export const s6Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s6", i));
  return { twist: s[0].from, dots: s[1].from, split: s[2].from, bdry: s[3].from };
};

export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const twist = useAt(b.twist, theme.spring.bouncy);
  return (
    <SceneShell push={0.025}>
      <Panel x={60} y={226} w={960} h={96} delay={0} seed={601}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 18, transform: `scale(${interpolate(twist, [0, 1], [1.1, 1])})` }}>
          <Lettering size={54}>THE DOT-BALL TWIST</Lettering>
        </div>
      </Panel>
      <Panel x={60} y={338} w={960} h={470} delay={b.dots - 10} seed={602}>
        <div style={{ position: "absolute", left: 36, right: 36, top: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Lettering size={26} font="body" color={C.cream} spacing="0.2em">
            DOT BALLS · % OF BALLS FACED
          </Lettering>
          <Tag text="APPROX. ESTIMATE · INCOMPLETE SAMPLE" col={C.amber} size={14} />
        </div>
        <div style={{ position: "absolute", left: 36, top: 80, display: "flex", flexDirection: "column", gap: 22 }}>
          <PairRow label="OVERALL" note="WEIGHTED ESTIMATE" a={sample.dot.overall.abhishek} r={sample.dot.overall.rahul} max={50} at={b.dots + 6} w={888} fmt={(v) => `~${Math.round(v)}%`} />
          <div style={{ opacity: interpolate(frame, [b.split, b.split + 10], [0.15, 1], CLAMP), display: "flex", flexDirection: "column", gap: 22 }}>
            <PairRow label="V PACE" a={sample.dot.pace.abhishek} r={sample.dot.pace.rahul} max={50} at={b.split} w={888} fmt={(v) => `${Math.round(v)}%`} />
            <PairRow label="V SPIN" a={sample.dot.spin.abhishek} r={sample.dot.spin.rahul} max={50} at={b.split + 8} w={888} fmt={(v) => `${Math.round(v)}%`} />
          </div>
        </div>
      </Panel>
      <Panel x={60} y={824} w={960} h={526} delay={b.bdry - 10} seed={603} glow={C.amberGlow} glowOn={0.4}>
        <div style={{ position: "absolute", left: 36, right: 36, top: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Lettering size={26} font="body" color={C.cream} spacing="0.2em">
            WHAT HAPPENS TO THE OTHER BALLS
          </Lettering>
          <Tag text="CAREER TOTALS" col={C.creamDim} size={14} />
        </div>
        {[
          { name: "ABHISHEK", col: A_COL, pct: boundaryBallPct.abhishek, every: A.bpb, at: b.bdry + 4 },
          { name: "RAHUL", col: R_COL, pct: boundaryBallPct.rahul, every: R.bpb, at: b.bdry + 14 },
        ].map((row, k) => {
          const p = interpolate(frame, [row.at, row.at + 24], [0, 1], { easing: theme.ease.out, ...CLAMP });
          return (
            <div key={row.name} style={{ position: "absolute", left: 36, right: 36, top: 90 + k * 200 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Lettering size={42} color={row.col}>
                  {row.name}
                </Lettering>
                <Lettering size={22} font="body" color={C.cream} spacing="0.14em">
                  A BOUNDARY EVERY {row.every.toFixed(2)} BALLS
                </Lettering>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
                {Array.from({ length: 20 }).map((_, i) => {
                  const lit = i < Math.round((row.pct / 100) * 20 * p);
                  return <div key={i} style={{ flex: 1, height: 46, borderRadius: 6, background: lit ? row.col : C.plate, boxShadow: lit ? `0 0 10px ${row.col}77` : `inset 0 0 0 1px ${C.panelEdge}` }} />;
                })}
              </div>
              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
                <Lettering size={18} font="body" color={C.creamDim} spacing="0.14em">
                  BOUNDARY BALLS, OUT OF EVERY 20 FACED (ROUNDED)
                </Lettering>
                <Lettering size={34} color={row.col}>
                  {(row.pct * p).toFixed(1)}%
                </Lettering>
              </div>
            </div>
          );
        })}
      </Panel>
    </SceneShell>
  );
};

/* ================= S7 — THE PRICE OF AGGRESSION ================= */
export const s7Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s7", i));
  return { cost: s[0].from, dismissed: s[1].from, rahul: s[2].from, fifties: s[2].from + 40 };
};

export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const lamps = (n: number, col: string, at: number) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, width: 420 }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <Lamp key={i} color={col} glow={`${col}66`} on={i < n ? interpolate(frame, [at + i * 1.5, at + i * 1.5 + 4], [0, 1], CLAMP) : 0} size={26} />
      ))}
    </div>
  );
  return (
    <SceneShell push={0.03}>
      <CutoutFrame id="abhishek-cutout" x={60} y={226} w={470} h={300} delay={0} label="ABHISHEK" labelColor={A_COL} seed={701} life={340} />
      <CutoutFrame id="rahul-cutout" x={550} y={226} w={470} h={300} delay={4} label="KL RAHUL" labelColor={R_COL} seed={702} life={340} />
      <Panel x={60} y={542} w={960} h={540} delay={b.dismissed - 10} seed={703}>
        <div style={{ position: "absolute", left: 36, right: 36, top: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Lettering size={26} font="body" color={C.cream} spacing="0.2em">
            THE OTHER SIDE OF THE LEDGER
          </Lettering>
          <Tag text="CAREER TOTALS" col={C.creamDim} size={14} />
        </div>
        <div style={{ position: "absolute", left: 36, top: 84, display: "flex", flexDirection: "column", gap: 34 }}>
          <PairRow label="BALLS PER DISMISSAL" note="MORE = STAYS IN LONGER" a={A.ballsPerDismissal} r={R.ballsPerDismissal} max={30} at={b.dismissed + 4} w={888} fmt={(v) => v.toFixed(1)} />
          <PairRow label="BATTING AVERAGE" note="RUNS PER DISMISSAL" a={A.average} r={R.average} max={40} at={b.rahul + 4} w={888} fmt={(v) => v.toFixed(2)} />
          <PairRow label="STRIKE RATE" note="THE TRADE-OFF" a={A.sr} r={R.sr} max={200} at={b.rahul + 30} w={888} fmt={(v) => v.toFixed(2)} />
        </div>
      </Panel>
      <Panel x={60} y={1098} w={960} h={252} delay={b.fifties - 8} seed={704}>
        <div style={{ position: "absolute", left: 36, top: 18 }}>
          <Lettering size={24} font="body" color={C.cream} spacing="0.2em">
            50-PLUS SCORES
          </Lettering>
        </div>
        {[
          { name: "ABHISHEK", n: A.hundreds + A.fifties, col: A_COL, y: 62 },
          { name: "RAHUL", n: R.hundreds + R.fifties, col: R_COL, y: 150 },
        ].map((r) => (
          <div key={r.name} style={{ position: "absolute", left: 36, right: 36, top: r.y, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 200 }}>
              <Lettering size={36} color={r.col}>
                {r.name}
              </Lettering>
            </div>
            {lamps(r.n, r.col, b.fifties)}
            <div style={{ flex: 1, textAlign: "right" }}>
              <Lettering size={60} color={r.col}>
                {r.n}
              </Lettering>
            </div>
          </div>
        ))}
      </Panel>
    </SceneShell>
  );
};

/* ================= S8 — WHAT DOES IT MEAN FOR A TEAM SCORE? (HYPOTHETICAL) ================= */
export const s8Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s8", i));
  return { model: s[0].from, simFrom: s[1].from + 6, simTo: s[2].from + 10, diff: wordAt(fps, "s8", "11", 9.32), team: s[2].to - 10, risk: s[3].from };
};

export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  const diff = useAt(b.diff, theme.spring.bouncy);
  const team = Math.round(interpolate(frame, [b.team, b.team + 30], [model.teamFrom, model.teamTo], { easing: theme.ease.out, ...CLAMP }));
  const risk = interpolate(frame, [b.risk, b.risk + 10], [0, 1], CLAMP);
  return (
    <SceneShell push={0.025}>
      <Panel x={60} y={226} w={960} h={110} delay={0} seed={801} glow={C.amberGlow} glowOn={0.3}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Lettering size={44} color={C.amber}>
            HYPOTHETICAL SCORING-RATE MODEL
          </Lettering>
          <Lettering size={18} font="body" color={C.creamDim} spacing="0.2em">
            AN ILLUSTRATION · NOT A PREDICTION OF ANY MATCH
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={352} w={470} h={440} delay={b.simFrom - 12} seed={802} glow={`${A_COL}55`} glowOn={0.4}>
        <SimBoard name="ABHISHEK" col={A_COL} target={model.abhishek} from={b.simFrom} to={b.simTo} w={470} h={440} />
      </Panel>
      <Panel x={550} y={352} w={470} h={440} delay={b.simFrom - 8} seed={803} glow={`${R_COL}55`} glowOn={0.4}>
        <SimBoard name="RAHUL" col={R_COL} target={model.rahul} from={b.simFrom} to={b.simTo} w={470} h={440} />
      </Panel>
      <Panel x={60} y={808} w={960} h={130} delay={b.diff - 6} seed={804}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 24, transform: `scale(${interpolate(diff, [0, 1], [1.2, 1])})` }}>
          <Lettering size={30} font="body" color={C.cream} spacing="0.2em">
            DIFFERENCE
          </Lettering>
          <Lettering size={92} color={A_COL} style={{ textShadow: `0 0 20px ${C.amberGlow}` }}>
            +11.3 RUNS
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={954} w={960} h={200} delay={b.team - 8} seed={805}>
        <div style={{ position: "absolute", top: 18, width: "100%", textAlign: "center" }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.22em">
            ILLUSTRATIVE TEAM TOTAL
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 54, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
          <Lettering size={96} color={C.creamDim}>
            180
          </Lettering>
          <Lettering size={70} color={C.creamDim}>
            →
          </Lettering>
          <Lettering size={96} color={C.cream}>
            {team}
          </Lettering>
          <Lettering size={36} color={C.creamDim}>
            APPROX.
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={1170} w={960} h={180} delay={b.team} seed={806} glow={C.redGlow} glowOn={risk * 0.5}>
        <div style={{ position: "absolute", left: 36, right: 36, top: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          <Lettering size={16} font="body" color={C.creamDim} spacing="0.12em">
            ASSUMES: 18 BALLS EACH AT POWERPLAY STRIKE RATE (191.4 v 128.9) · SAME CONDITIONS, TEAMMATES AND OTHER RUNS
          </Lettering>
          <Lettering size={16} font="body" color={C.creamDim} spacing="0.12em">
            IGNORES DISMISSALS: ABHISHEK IS OUT EVERY ~16.7 BALLS, RAHUL EVERY ~27.1
          </Lettering>
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 12, opacity: risk }}>
            <Lamp color={C.red} glow={C.redGlow} on={risk} size={20} />
            <Lettering size={40} color={C.red}>
              BEFORE WICKET RISK
            </Lettering>
          </div>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S9 — THE VERDICT ================= */
export const s9Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4].map((i) => sentence(fps, "s9", i));
  return { a: s[0].from, r: s[1].from, q: s[2].from, runs: wordAt(fps, "s9", "runs", 8.0), balls: wordAt(fps, "s9", "balls", 10.4), risk: wordAt(fps, "s9", "risk", 12.3), final: s[4].from - 10 };
};

export const S9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s9Beats(fps);
  const fin = useAt(b.final + 6, theme.spring.heavy);
  const close = b.final;
  const side = (lines: string[], col: string, at: number) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      {lines.map((l, i) => (
        <Reveal key={l} at={at + i * 8} x={0} y={14}>
          <Lettering size={i === 0 ? 40 : 30} color={i === 0 ? col : C.cream}>
            {l}
          </Lettering>
        </Reveal>
      ))}
    </div>
  );
  return (
    <SceneShell push={0} pull={0.05} turnOut={false}>
      <CutoutFrame id="abhishek-cutout" x={60} y={226} w={470} h={500} delay={0} closeAt={close} label="ABHISHEK" labelColor={A_COL} seed={901} glow={`${A_COL}55`} glowOn={interpolate(frame, [b.a, b.a + 10], [0, 0.6], CLAMP)} life={400} />
      <CutoutFrame id="rahul-cutout" x={550} y={226} w={470} h={500} delay={4} closeAt={close} label="KL RAHUL" labelColor={R_COL} seed={902} life={400} />
      <Panel x={60} y={742} w={470} h={270} delay={b.a - 6} closeAt={close} seed={903} glow={`${A_COL}55`} glowOn={0.5}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>{side(["ABHISHEK", "EXPLOSIVE SCORING", "HIGHER WICKET RISK"], A_COL, b.a)}</div>
      </Panel>
      <Panel x={550} y={742} w={470} h={270} delay={b.r - 6} closeAt={close} seed={904} glow={`${R_COL}55`} glowOn={0.5}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>{side(["KL RAHUL", "GREATER STABILITY", "SLOWER INITIAL SCORING"], R_COL, b.r)}</div>
      </Panel>
      <Panel x={60} y={1028} w={960} h={180} delay={b.q - 6} closeAt={close} seed={905}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          {[
            { k: "RUNS", at: b.runs },
            { k: "BALLS", at: b.balls },
            { k: "RISK", at: b.risk },
          ].map((x) => {
            const on = interpolate(frame, [x.at, x.at + 8], [0, 1], CLAMP);
            return (
              <div key={x.k} style={{ display: "flex", alignItems: "center", gap: 12, opacity: 0.25 + 0.75 * on }}>
                <Lamp color={C.amber} glow={C.amberGlow} on={on} size={26} />
                <Lettering size={60} color={on > 0.5 ? C.cream : C.creamDim}>
                  {x.k}
                </Lettering>
              </div>
            );
          })}
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 60, top: 520, width: 960, height: 560, opacity: interpolate(fin, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(fin, [0, 1], [0.94, 1])})` }}>
        <Panel x={0} y={0} w={960} h={560} delay={b.final + 6} seed={906} glow={C.amberGlow} glowOn={0.6}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <Lettering size={72}>SAME RUNS.</Lettering>
            <Lettering size={72} color={C.amber} style={{ textShadow: `0 0 22px ${C.amberGlow}` }}>
              473 BALLS APART.
            </Lettering>
            <Lettering size={44} color={C.creamDim}>
              TWO DIFFERENT APPROACHES.
            </Lettering>
            <div style={{ width: 640, height: 2, background: C.panelEdge, margin: "10px 0" }} />
            <Lettering size={96} spacing="0.03em">
              BEYOND THE SCOREBOARD
            </Lettering>
          </div>
        </Panel>
      </div>
    </SceneShell>
  );
};
