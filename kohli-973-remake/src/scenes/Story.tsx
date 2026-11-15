// Virat Kohli — IPL 2016: 973. Eight scenes; every reveal is tied to the narrator's word.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { rng } from "../components/Board";
import { CLAMP } from "../components/Motion";
import { Lamp, Lettering, Panel } from "../components/Panel";
import { PhotoFrame } from "../components/Photo";
import { SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { Chip, FinalBars, FullBleed, GREY, HandStitches, Leaderboard, RaisedBat, RCB_RED, SeasonGraph } from "../components/Season";
import { centuries, final2016, orangeCap, season } from "../data";
import { theme } from "../theme";
import { sentence, wordAt } from "../timing";
import { Reveal, useAt, useFlip } from "./common";

const C = theme.colors;

// digits spin (blurred) until `stopAt`, then the real number flips into place
const SpinCounter: React.FC<{ target: string; stopAt: number; seed: number; w: number; h: number; color: string; glow?: string; startAt?: number }> = ({ target, stopAt, seed, w, h, color, glow, startAt = 0 }) => {
  const frame = useCurrentFrame();
  const spinning = frame >= startAt && frame < stopAt;
  const r = rng(seed + Math.floor(frame / 2) * 7);
  const text = frame < startAt ? "0".repeat(target.length) : spinning ? target.split("").map((c) => (/\d/.test(c) ? String(Math.floor(r() * 10)) : c)).join("") : target;
  const flip = useFlip(stopAt, 3);
  const glowOn = interpolate(frame, [stopAt, stopAt + 10], [0, 1], CLAMP);
  return <Plates text={text} prev={spinning || frame < startAt ? undefined : "0".repeat(target.length)} progress={spinning || frame < startAt ? () => 1 : flip} w={w} h={h} gap={10} color={spinning ? C.creamDim : color} glow={spinning ? undefined : glow} glowOn={glowOn} blur={spinning ? 2.4 : 0} />;
};

// a mechanical count from 0 to `to` between two frames
const useCount = (to: number, a: number, z: number) => {
  const frame = useCurrentFrame();
  return Math.round(to * theme.ease.out(interpolate(frame, [a, z], [0, 1], CLAMP)));
};

/* ================= S1 — THE HOOK ================= */
export const s1Beats = (fps: number) => ({
  land973: wordAt(fps, "s1", "1,000", 1.66) + 6,
  short27: sentence(fps, "s1", 0).to - 6,
  final8: sentence(fps, "s1", 1).from,
  title: sentence(fps, "s1", 2).from - 6,
});

export const S1: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const title = useAt(b.title + 8, theme.spring.heavy);
  return (
    <SceneShell push={0.04} turnIn={false}>
      <FullBleed id="chin-fireworks-2014" y={0} h={1180} inAt={-12} outAt={b.title - 4} focus="50% 35%" zoom={[1.18, 1.3]} pan={[20, -30]} life={200} tint="red" dim={0.15} captionY={640} />
      <FullBleed id="chin-night-2014" y={0} h={1180} inAt={b.title - 6} focus="50% 40%" zoom={[1.25, 1.35]} life={160} tint="amber" dim={0.35} captionY={640} />
      <Panel x={60} y={720} w={960} h={240} delay={0} closeAt={b.title - 6} seed={101} glow={C.amberGlow} glowOn={0.5}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
          <SpinCounter target="973" stopAt={b.land973} seed={3} w={130} h={180} color={C.amber} glow={C.amberGlow} />
          <Lettering size={92} color={C.cream}>
            RUNS
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={976} w={470} h={176} delay={b.short27} closeAt={b.title - 6} seed={102}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <Plates text="27" prev="  " progress={useFlip(b.short27 + 6, 3)} w={72} h={102} color={C.amber} glow={C.amberGlow} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Lettering size={40}>SHORT OF</Lettering>
            <Lettering size={40} color={C.amber}>
              1,000
            </Lettering>
          </div>
        </div>
      </Panel>
      <Panel x={550} y={976} w={470} h={176} delay={b.final8} closeAt={b.title - 6} seed={103} glow={C.redGlow} glowOn={0.4}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <Plates text="8" prev=" " progress={useFlip(b.final8 + 6, 3)} w={72} h={102} color={C.red} glow={C.redGlow} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Lettering size={40}>RUN FINAL</Lettering>
            <Lettering size={40} color={C.red}>
              DEFEAT
            </Lettering>
          </div>
        </div>
      </Panel>
      {/* title: the name arrives on "Virat Kohli's 2016 season…" */}
      <div style={{ position: "absolute", left: 60, top: 720, width: 960, opacity: interpolate(title, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(title, [0, 1], [1.08, 1])})` }}>
        <Panel x={0} y={0} w={960} h={430} delay={b.title + 8} seed={104} glow={C.amberGlow} glowOn={0.7}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <Lettering size={30} font="body" color={RCB_RED} spacing="0.4em">
              ROYAL CHALLENGERS BANGALORE
            </Lettering>
            <Lettering size={140}>VIRAT KOHLI</Lettering>
            <Lettering size={66} color={C.amber} style={{ textShadow: `0 0 22px ${C.amberGlow}` }}>
              IPL 2016
            </Lettering>
            <Lettering size={24} font="body" color={C.creamDim} spacing="0.26em">
              THE SEASON THAT ALMOST HAD EVERYTHING
            </Lettering>
          </div>
        </Panel>
      </div>
    </SceneShell>
  );
};

/* ================= S2 — THE IMPOSSIBLE SEASON ================= */
export const s2Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4, 5].map((i) => sentence(fps, "s2", i));
  return { innings: s[0].from, runsFrom: s[1].from, runsTo: s[1].to, avg: s[2].from, tons: s[3].from, fifties: s[4].from, board: s[5].from - 14 };
};

export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const runs = useCount(973, b.runsFrom, b.runsTo);
  const tile = (label: string, value: string, at: number, col: string = C.cream, glow?: string) => {
    const on = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: 0.25 + 0.75 * on }}>
        <Lettering size={22} font="body" color={on > 0.5 ? C.cream : C.creamDim} spacing="0.2em">
          {label}
        </Lettering>
        <Plates text={value} prev={" ".repeat(value.length)} progress={(i) => interpolate(frame, [at + i * 3, at + i * 3 + 8], [0, 1], CLAMP)} w={value.length > 3 ? 46 : 70} h={100} gap={6} color={col} glow={glow} glowOn={on} />
      </div>
    );
  };
  return (
    <SceneShell push={0.035}>
      <PhotoFrame id="kohli-june-2016" x={60} y={226} w={440} h={600} delay={0} closeAt={b.board - 6} warmth={1} focus="50% 0%" origin="52% 3%" zoom={[2.65, 2.75]} life={300} label="2016" compact seed={201} />
      <Panel x={516} y={226} w={504} h={600} delay={4} closeAt={b.board - 6} seed={202} glow={C.amberGlow} glowOn={interpolate(frame, [b.runsTo - 4, b.runsTo + 6], [0, 0.7], CLAMP)}>
        <div style={{ position: "absolute", top: 34, width: "100%", textAlign: "center" }}>
          <Lettering size={24} font="body" color={RCB_RED} spacing="0.3em">
            RCB · IPL 2016
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 120, width: "100%", display: "flex", justifyContent: "center" }}>
          <Plates text={String(runs).padStart(3, "0")} w={128} h={186} gap={12} color={runs >= 973 ? C.amber : C.cream} glow={C.amberGlow} glowOn={runs >= 973 ? 1 : 0} blur={frame > b.runsFrom && runs < 973 ? 1.2 : 0} />
        </div>
        <div style={{ position: "absolute", top: 330, width: "100%", textAlign: "center" }}>
          <Lettering size={70}>RUNS</Lettering>
        </div>
        <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Chip on={interpolate(frame, [b.innings, b.innings + 8], [0, 1], CLAMP)} size={30}>
            16 INNINGS
          </Chip>
        </div>
        <div style={{ position: "absolute", top: 500, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Chip on={interpolate(frame, [b.fifties + 24, b.fifties + 32], [0, 1], CLAMP)} size={22}>
            STRIKE RATE 152.03
          </Chip>
        </div>
      </Panel>
      <Panel x={60} y={842} w={960} h={300} delay={b.innings} closeAt={b.board - 6} seed={203}>
        <div style={{ position: "absolute", top: 30, left: 20, right: 20, display: "flex", justifyContent: "space-around" }}>
          {tile("INNINGS", "16", b.innings)}
          {tile("AVERAGE", season.average, b.avg, C.amber, C.amberGlow)}
          {tile("100s", "4", b.tons, C.amber, C.amberGlow)}
          {tile("50s", "7", b.fifties)}
        </div>
        <div style={{ position: "absolute", bottom: 26, width: "100%", textAlign: "center", opacity: interpolate(frame, [b.fifties + 20, b.fifties + 30], [0, 1], CLAMP) }}>
          <Lettering size={24} font="body" color={C.creamDim} spacing="0.2em">
            {season.sixes} SIXES · {season.fours} FOURS · {season.matches} MATCHES
          </Lettering>
        </div>
      </Panel>
      {/* Orange Cap: "Nobody in the tournament scored more." */}
      <FullBleed id="chin-stand-2014" y={190} h={560} inAt={b.board - 8} focus="50% 40%" zoom={[1.08, 1.16]} pan={[-20, 10]} life={120} tint="red" dim={0.3} captionY={660} />
      <Panel x={60} y={760} w={960} h={420} delay={b.board} seed={204} glow={C.amberGlow} glowOn={0.4}>
        <div style={{ position: "absolute", top: 22, width: "100%", textAlign: "center" }}>
          <Lettering size={26} font="body" color={C.amber} spacing="0.3em">
            ORANGE CAP · MOST RUNS IN IPL 2016
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 30, top: 70 }}>
          <Leaderboard rows={orangeCap} at={b.board + 8} w={900} />
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S3 — FOUR CENTURIES ================= */
export const s3Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s3", i));
  const words = ["100", "108", "109", "113"].map((w, i) => wordAt(fps, "s3", w, [0.48, 2.98, 6.04, 10.1][i]));
  return { cards: s.map((x) => x.from), runs: words, end: s[3].to };
};

const SLOTS = [
  { x: 60, y: 236 },
  { x: 554, y: 236 },
  { x: 60, y: 776 },
  { x: 554, y: 776 },
];
const CARD_W = 466, CARD_H = 524;

const CenturyCard: React.FC<{ i: number; at: number; runsAt: number; finale: number }> = ({ i, at, runsAt, finale }) => {
  const frame = useCurrentFrame();
  const c = centuries[i];
  const enter = interpolate(frame, [at, at + 10], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const settle = interpolate(frame, [at + 34, at + 54], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const flip = useFlip(runsAt, 3);
  if (enter <= 0) return null;
  // hero position: centred and large; then it drops into its slot in the 2×2 montage
  const heroX = 540 - CARD_W / 2, heroY = 780 - CARD_H / 2;
  const x = interpolate(settle, [0, 1], [heroX, SLOTS[i].x]);
  const y = interpolate(settle, [0, 1], [heroY, SLOTS[i].y]);
  const sc = interpolate(settle, [0, 1], [1.45, 1]) * interpolate(enter, [0, 1], [1.25, 1]);
  const glow = interpolate(frame, [runsAt, runsAt + 8, runsAt + 40], [0, 1, 0.5], CLAMP) + (frame >= finale ? 0.4 + 0.3 * Math.sin((frame - finale) / 5) : 0);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: CARD_W, height: CARD_H, transform: `scale(${sc})`, transformOrigin: "50% 50%", opacity: enter, zIndex: settle < 1 ? 10 : i }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          background: `linear-gradient(170deg, ${C.panelHi} 0%, ${C.panel} 55%, #1a0d0c 100%)`,
          boxShadow: `inset 0 0 0 2px ${C.panelEdge}, 0 24px 50px -14px ${C.shadow}, 0 0 ${40 * glow}px ${C.amberGlow}`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, width: 10, bottom: 0, background: c.col, opacity: 0.85 }} />
        <div style={{ position: "absolute", left: 30, right: 22, top: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Lamp color={C.amber} glow={C.amberGlow} on={Math.min(1, glow + 0.3)} size={18} />
            <Lettering size={30} color={C.amber}>
              CENTURY {c.n}
            </Lettering>
          </div>
          <Lettering size={20} font="body" color={C.creamDim} spacing="0.14em">
            {c.date}
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 66, display: "flex", justifyContent: "center", opacity: 0.9 }}>
          <RaisedBat size={150} burst={Math.min(1, glow)} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 226, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 12 }}>
          <Plates text={c.runs} prev={" ".repeat(c.runs.length)} progress={flip} w={78} h={124} gap={8} color={C.amber} glow={C.amberGlow} glowOn={Math.min(1, glow)} />
          <div style={{ paddingBottom: 10 }}>
            <Lettering size={44} color={C.creamDim}>
              ({c.balls})
            </Lettering>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 370, textAlign: "center" }}>
          <Lettering size={20} font="body" color={C.creamDim} spacing="0.24em">
            VS
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 20, right: 20, top: 400, textAlign: "center", lineHeight: 1 }}>
          <Lettering size={c.opp.length > 16 ? 40 : 48} color={C.cream}>
            {c.opp}
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center" }}>
          <Lettering size={17} font="body" color={C.creamDim} spacing="0.16em">
            {c.balls} BALLS · {c.runs.includes("*") ? "NOT OUT" : "OUT"}
          </Lettering>
        </div>
      </div>
    </div>
  );
};

export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  const finale = b.cards[3] + 56;
  const banner = interpolate(frame, [finale, finale + 10], [0, 1], CLAMP);
  return (
    <SceneShell push={0.02} drift={0}>
      <FullBleed id="chin-night-2014" y={190} h={1190} inAt={-8} focus="50% 40%" zoom={[1.5, 1.7]} pan={[-40, 40]} life={430} tint="amber" dim={0.75} captionY={1312} />
      {[0, 1, 2, 3].map((i) => (
        <CenturyCard key={i} i={i} at={b.cards[i] - 4} runsAt={b.runs[i]} finale={finale} />
      ))}
      <div style={{ position: "absolute", left: 340, top: 740, width: 400, height: 56, display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 8, background: "rgba(10,15,12,0.92)", boxShadow: `inset 0 0 0 2px ${C.amber}, 0 0 30px ${C.amberGlow}`, opacity: banner, transform: `scale(${interpolate(banner, [0, 1], [1.2, 1])})`, zIndex: 20 }}>
        <Lettering size={34} color={C.amber}>
          FOUR CENTURIES · ONE SEASON
        </Lettering>
      </div>
    </SceneShell>
  );
};

/* ================= S4 — THE CENTURY WITH NINE STITCHES ================= */
export const s4Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s4", i));
  return { intro: s[0].from, countFrom: s[1].from, land: s[1].to - 4, balls: wordAt(fps, "s4", "50", 3.38), overs: s[2].from, stitches: wordAt(fps, "s4", "nine", 6.7) };
};

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const runs = useCount(113, b.countFrom, b.land);
  const landed = frame >= b.land;
  const land = useAt(b.land, theme.spring.bouncy);
  const sr = useFlip(b.land + 10, 2);
  const overs = useFlip(b.overs + 4, 3);
  const nine = useFlip(b.stitches + 40, 3);
  return (
    <SceneShell push={0.05}>
      <FullBleed id="rcb-flag-2014" y={190} h={1190} inAt={-8} focus="60% 50%" zoom={[1.15, 1.32]} pan={[30, 0]} life={320} tint="red" dim={0.7} captionY={1312} />
      <Panel x={60} y={226} w={960} h={112} delay={0} seed={401}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Lettering size={48}>RCB v KINGS XI PUNJAB · 18 MAY 2016</Lettering>
          <Lettering size={22} font="body" color={C.amber} spacing="0.3em">
            CENTURY NO. 4 · BENGALURU
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={354} w={960} h={330} delay={b.countFrom - 12} seed={402} glow={C.amberGlow} glowOn={landed ? 0.6 + 0.4 * Math.min(1, land) : 0.2}>
        <div style={{ position: "absolute", top: 24, width: "100%", textAlign: "center" }}>
          <Lettering size={28} font="body" color={C.cream} spacing="0.3em">
            VIRAT KOHLI
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 74, width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 22, transform: `scale(${landed ? interpolate(land, [0, 1], [1.12, 1]) : 1})` }}>
          <Plates text={String(runs).padStart(3, " ")} w={150} h={210} gap={12} color={landed ? C.amber : C.cream} glow={C.amberGlow} glowOn={landed ? 1 : 0} blur={!landed && frame > b.countFrom ? 1.2 : 0} />
          <div style={{ paddingBottom: 16, opacity: interpolate(frame, [b.balls, b.balls + 8], [0, 1], CLAMP) }}>
            <Lettering size={66} color={C.creamDim}>
              (50)
            </Lettering>
          </div>
        </div>
      </Panel>
      <Panel x={60} y={700} w={470} h={170} delay={b.land + 4} seed={403}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
            STRIKE RATE
          </Lettering>
          <Plates text="226.00" prev="      " progress={sr} w={46} h={78} gap={5} color={C.amber} glow={C.amberGlow} />
        </div>
      </Panel>
      <Panel x={550} y={700} w={470} h={170} delay={b.overs - 4} seed={404}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
            RAIN-SHORTENED
          </Lettering>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Plates text="15" prev="  " progress={overs} w={56} h={78} gap={6} color={C.cream} />
            <Lettering size={50}>-OVER MATCH</Lettering>
          </div>
        </div>
      </Panel>
      <Panel x={60} y={886} w={960} h={462} delay={b.stitches - 24} seed={405} glow={C.redGlow} glowOn={interpolate(frame, [b.stitches + 40, b.stitches + 50], [0, 0.6], CLAMP)}>
        <div style={{ position: "absolute", left: 40, top: 40 }}>
          <HandStitches at={b.stitches} w={360} h={360} />
        </div>
        <div style={{ position: "absolute", left: 470, top: 80, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Plates text="9" prev=" " progress={nine} w={110} h={156} color={C.red} glow={C.redGlow} />
            <Lettering size={80}>STITCHES</Lettering>
          </div>
          <Lettering size={46} color={C.creamDim}>
            IN HIS LEFT HAND
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 470, bottom: 26 }}>
          <Lettering size={15} font="body" color={C.creamDim} spacing="0.18em">
            ILLUSTRATION · NOT A PHOTOGRAPH
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S5 — THE ROAD TO 973 ================= */
export const s5Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s5", i));
  return { fifty: s[0].from, tons: s[1].from, lineAt: s[1].from - 6, lineEnd: s[2].from + 40, playoffs: s[2].from + 50 };
};

export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const lineLen = b.lineEnd - b.lineAt;
  // the cumulative line reaches innings 13 (865) and 14 (919) at these frames
  const at13 = b.lineAt + Math.round((lineLen * 12) / 13) - 4;
  return (
    <SceneShell push={0.025}>
      <Panel x={60} y={226} w={960} h={936} delay={0} seed={501}>
        <div style={{ position: "absolute", left: 36, right: 36, top: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Lettering size={50}>THE ROAD TO 973</Lettering>
          <div style={{ display: "flex", gap: 22 }}>
            <Chip on={interpolate(frame, [b.fifty, b.fifty + 8], [0, 1], CLAMP)} color={C.amber} size={20}>
              11 × 50+
            </Chip>
            <Chip on={interpolate(frame, [b.tons, b.tons + 8], [0, 1], CLAMP)} color={C.amber} size={20}>
              4 × 100
            </Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 20, top: 104 }}>
          <SeasonGraph
            scores={season.scores}
            w={920}
            h={800}
            barsAt={6}
            fiftyAt={b.fifty}
            tonsAt={b.tons}
            lineAt={b.lineAt}
            lineLen={lineLen}
            lineTo={13}
            markers={[
              { i: 12, at: at13, label: "865 AFTER 13", dy: 44 },
              { i: 13, at: b.lineEnd, label: "919 AFTER 14", dy: 96 },
            ]}
          />
        </div>
      </Panel>
      <FullBleed id="chin-crowd-2014" y={1166} h={196} inAt={b.playoffs - 30} focus="50% 50%" zoom={[1.0, 1.06]} life={120} tint="red" dim={0.2} captionY={1300} />
      <div style={{ position: "absolute", left: 600, top: 1196, opacity: interpolate(frame, [b.playoffs, b.playoffs + 10], [0, 1], CLAMP), transform: `translateY(${interpolate(frame, [b.playoffs, b.playoffs + 10], [16, 0], CLAMP)}px)` }}>
        <div style={{ padding: "12px 22px 10px", borderRadius: 8, background: "rgba(10,15,12,0.9)", boxShadow: `inset 0 0 0 2px ${C.amber}` }}>
          <Lettering size={44} color={C.amber}>
            INTO THE PLAYOFFS
          </Lettering>
        </div>
      </div>
    </SceneShell>
  );
};

/* ================= S6 — THE UNEXPECTED DUCK ================= */
export const s6Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s6", i));
  return { duck: wordAt(fps, "s6", "duck", 2.6), won: s[1].from, final: s[2].from + 20 };
};

export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const zero = useFlip(b.duck, 3);
  const lamp = interpolate(frame, [b.duck + 4, b.duck + 10], [0, 1], CLAMP);
  const q = useAt(b.final, theme.spring.bouncy);
  return (
    <SceneShell push={0.03}>
      <Panel x={60} y={226} w={960} h={112} delay={0} seed={601}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Lettering size={56}>QUALIFIER 1</Lettering>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.3em">
            RCB vs GUJARAT LIONS
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={354} w={960} h={250} delay={4} seed={602} glow={C.redGlow} glowOn={lamp * 0.6}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 60px" }}>
          <Lettering size={84}>KOHLI</Lettering>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
            <Plates text="0" prev=" " progress={zero} w={110} h={156} color={C.red} glow={C.redGlow} />
            <div style={{ paddingBottom: 12 }}>
              <Lettering size={56} color={C.creamDim}>
                (2)
              </Lettering>
            </div>
          </div>
          <Lamp color={C.red} glow={C.redGlow} on={lamp * 0.8} size={46} />
        </div>
      </Panel>
      <Panel x={60} y={620} w={960} h={410} delay={8} seed={603}>
        <div style={{ position: "absolute", top: 18, width: "100%", textAlign: "center" }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.24em">
            SEASON TOTAL · AFTER 15 INNINGS
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 20, top: 52 }}>
          <SeasonGraph scores={season.scores} w={920} h={330} barsAt={1e9} lineAt={6} lineLen={b.duck - 6} lineTo={14} compact markers={[{ i: 14, at: b.duck + 6, label: "919 → 919" }]} />
        </div>
      </Panel>
      <FullBleed id="chin-flags-2014" y={1036} h={330} inAt={b.won - 6} focus="50% 50%" zoom={[1.05, 1.12]} life={160} tint="red" dim={0.25} captionY={1300} />
      <div style={{ position: "absolute", left: 160, top: 1080, width: 760, opacity: interpolate(q, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(q, [0, 1], [1.2, 1])})` }}>
        <div style={{ padding: "18px 0 14px", textAlign: "center", borderRadius: 10, background: "rgba(10,15,12,0.92)", boxShadow: `inset 0 0 0 2px ${C.amber}, 0 0 30px ${C.amberGlow}` }}>
          <Lettering size={62} color={C.amber}>
            RCB QUALIFY FOR FINAL
          </Lettering>
        </div>
      </div>
    </SceneShell>
  );
};

/* ================= S7 — THE FINAL HEARTBREAK ================= */
export const s7Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s7", i));
  return { kohli: s[0].from, srh: s[1].from, rcb: s[2].from, end: s[3].from };
};

export const S7: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const k = useFlip(b.kohli + 30, 3);
  return (
    <SceneShell push={0.03}>
      <PhotoFrame id="final-2016-watson" x={60} y={226} w={960} h={520} delay={0} closeAt={b.end - 8} warmth={0.75} focus="50% 40%" zoom={[1.05, 1.15]} life={300} label="FINAL 2016" seed={701} />
      <PhotoFrame id="final-2016-trophy" x={60} y={226} w={960} h={520} delay={b.end - 2} warmth={0.4} focus="50% 42%" zoom={[1.1, 1.18]} life={150} seed={705} />
      <Panel x={60} y={762} w={960} h={118} delay={b.kohli} seed={702}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 10, height: 60, background: RCB_RED, borderRadius: 3 }} />
            <Lettering size={56}>KOHLI</Lettering>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
            <Plates text="54" prev="  " progress={k} w={62} h={88} color={C.amber} glow={C.amberGlow} />
            <Lettering size={44} color={C.creamDim}>
              ({final2016.kohli.balls})
            </Lettering>
          </div>
        </div>
      </Panel>
      <Panel x={60} y={896} w={960} h={330} delay={b.srh - 8} seed={703}>
        <div style={{ position: "absolute", top: 18, width: "100%", textAlign: "center" }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.3em">
            IPL 2016 FINAL · 29 MAY · BENGALURU
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 36, top: 58 }}>
          <FinalBars srhAt={b.srh + 10} rcbAt={b.rcb + 6} gapAt={b.end} w={888} />
        </div>
      </Panel>
      <Panel x={60} y={1242} w={960} h={110} delay={b.end + 12} seed={704}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={58} color={C.cream}>
            SRH WON BY 8 RUNS
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S8 — THE LEGACY ================= */
export const s8Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4, 5, 6].map((i) => sentence(fps, "s8", i));
  return { runs: s[0].from, runsTo: s[0].to, tons: s[1].from, cap: s[2].from, noTrophy: s[3].from, linesAt: s[4].from - 10, win: s[4].from, history: s[5].from, brand: s[6].from - 8 };
};

export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  const runs = useCount(973, b.runs - 4, b.runsTo - 4);
  const brand = useAt(b.brand + 6, theme.spring.heavy);
  const stat = (label: string, value: string, at: number, col: string = C.amber) => {
    const on = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: 0.2 + 0.8 * on }}>
        <Plates text={value} prev={" ".repeat(value.length)} progress={(i) => interpolate(frame, [at + i * 3, at + i * 3 + 8], [0, 1], CLAMP)} w={52} h={74} gap={6} color={col} glow={col === C.amber ? C.amberGlow : undefined} glowOn={on} />
        <Lettering size={40} color={on > 0.5 ? C.cream : C.creamDim}>
          {label}
        </Lettering>
      </div>
    );
  };
  return (
    <SceneShell push={0} pull={0.05} turnOut={false}>
      <PhotoFrame id="kohli-june-2016" x={60} y={226} w={440} h={640} delay={0} closeAt={b.linesAt - 6} warmth={1} focus="50% 0%" origin="52% 3%" zoom={[2.9, 3.0]} life={260} label="2016" compact seed={801} glow={C.amberGlow} glowOn={0.5} />
      <Panel x={516} y={226} w={504} h={640} delay={4} closeAt={b.linesAt - 6} seed={802} glow={C.amberGlow} glowOn={0.6}>
        <div style={{ position: "absolute", top: 36, width: "100%", textAlign: "center" }}>
          <Lettering size={24} font="body" color={RCB_RED} spacing="0.3em">
            VIRAT KOHLI · IPL 2016
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 110, width: "100%", display: "flex", justifyContent: "center" }}>
          <Plates text={String(runs).padStart(3, "0")} w={128} h={186} gap={12} color={C.amber} glow={C.amberGlow} glowOn={runs >= 973 ? 1 : 0.3} />
        </div>
        <div style={{ position: "absolute", top: 318, width: "100%", textAlign: "center" }}>
          <Lettering size={70}>RUNS</Lettering>
        </div>
        <div style={{ position: "absolute", top: 430, left: 46, display: "flex", flexDirection: "column", gap: 20 }}>
          {stat("CENTURIES", "04", b.tons)}
          {stat("FIFTIES", "07", b.tons + 12, C.cream)}
        </div>
      </Panel>
      <Panel x={60} y={882} w={960} h={250} delay={b.cap - 4} closeAt={b.linesAt - 6} seed={803}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 54, height: 34, borderRadius: "27px 27px 6px 6px", background: "#F07A2B", boxShadow: "0 0 18px rgba(240,122,43,0.6)" }} />
            <Lettering size={64} color="#F5A25B">
              ORANGE CAP 2016
            </Lettering>
          </div>
          <div style={{ opacity: interpolate(frame, [b.noTrophy, b.noTrophy + 10], [0, 1], CLAMP), display: "flex", alignItems: "center", gap: 14 }}>
            <Lamp color={GREY} glow="transparent" on={0.3} size={20} />
            <Lettering size={34} color={C.creamDim}>
              NO TROPHY THAT YEAR
            </Lettering>
          </div>
        </div>
      </Panel>
      {/* the two lines, over the Chinnaswamy under fireworks */}
      <FullBleed id="chin-fireworks-2014" y={190} h={1190} inAt={b.linesAt - 8} outAt={b.brand} focus="50% 35%" zoom={[1.1, 1.22]} life={200} tint="amber" dim={0.55} captionY={1312} />
      <Panel x={60} y={600} w={960} h={330} delay={b.linesAt} closeAt={b.brand} seed={804} glow={C.amberGlow} glowOn={0.4}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
          <Reveal at={b.win} x={0} y={18}>
            <Lettering size={70}>SOME SEASONS WIN TROPHIES.</Lettering>
          </Reveal>
          <Reveal at={b.history} x={0} y={18}>
            <Lettering size={70} color={C.amber} style={{ textShadow: `0 0 22px ${C.amberGlow}` }}>
              SOME SEASONS BECOME HISTORY.
            </Lettering>
          </Reveal>
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 60, top: 600, width: 960, height: 460, opacity: interpolate(brand, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(brand, [0, 1], [0.94, 1])})` }}>
        <Panel x={0} y={0} w={960} h={460} delay={b.brand + 6} seed={806} glow={C.amberGlow} glowOn={0.6}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <Lettering size={30} font="body" color={C.creamDim} spacing="0.3em">
              973 RUNS · FOUR CENTURIES
            </Lettering>
            <Lettering size={44} color={C.amber}>
              ONE EXTRAORDINARY SEASON
            </Lettering>
            <div style={{ width: 640, height: 2, background: C.panelEdge, margin: "8px 0" }} />
            <Lettering size={104} spacing="0.03em">
              BEYOND THE SCOREBOARD
            </Lettering>
          </div>
        </Panel>
      </div>
    </SceneShell>
  );
};
