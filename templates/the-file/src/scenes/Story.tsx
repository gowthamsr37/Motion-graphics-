// DEMO STORY — replace with your reel. One component per scene id in scripts/voiceover.json.
// Key every entrance to the spoken word: wordAt(fps, scene, "prefix", fallbackSec[, nth]) and sentence(fps, scene, i)
// return frames relative to the scene start. Sample data: Devdutt Padikkal at No.3 (Tests to 22 Nov 2026).
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cue } from "../components/Sound";
import { BigGlyph, CLAMP, Cutout, fade, Serif, Shell } from "../components/Ed";
import { Brand, CaseFile, Crack, DoorCard, DotColumn, FlyRow, Footnote, Kicker, Lockup, Lollipop, Road, ScoreStack, Stamp, StatRow, Tally, Versus } from "../components/Viz";
import { config } from "../config";
import { theme } from "../theme";
import { scene, sentence, totalFrames, wordAt } from "../timing";

const C = theme.colors;

/* ================= S1 — the hook: giant glyph, revolving door, the hero ================= */
const s1Beats = (fps: number) => ({
  giant: wordAt(fps, "s1", "giant", 3.94),
  door: wordAt(fps, "s1", "door", 5.48) - 6,
  hero: sentence(fps, "s1", 2).from,
});
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const draw = theme.ease.inOut(interpolate(frame, [b.giant - 10, b.giant + 30], [0, 1], CLAMP));
  const fill = interpolate(frame, [b.hero - 2, b.hero + 14], [0, 1], { easing: theme.ease.out, ...CLAMP });
  return (
    <Shell enter={false}>
      <BigGlyph x={183} y={250} size={1150} draw={draw} fill={fill * 0.92} />
      <DoorCard
        lead={{ name: "THE LEAD CARD", note: "Steady first, then the door spins" }}
        names={["SHUBMAN GILL", "VIRAT KOHLI", "KL RAHUL", "KARUN NAIR", "SAI SUDHARSAN", "WASHINGTON SUNDAR"]}
        start={b.door}
        end={b.hero - 4}
      />
      <Tally n={7} at={b.door} label="7 batters" extra="3 years" extraAt={b.door + 20} outAt={b.hero - 4} />
      <Cutout src="placeholder-cut.png" x={190} y={560} h={760} at={b.hero + 2} fadeBottom={0.85} />
      <Lockup name="The Hero" tag="India's new No.3" at={b.hero + 4} />
    </Shell>
  );
};

/* ================= S2 — numbers that slam ================= */
const s2Beats = (fps: number) => ({ a: wordAt(fps, "s2", "167", 1.16), b: wordAt(fps, "s2", "117", 4.38), c: wordAt(fps, "s2", "80", 5.12) });
const S2: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  return (
    <Shell>
      <Kicker title="His last three first innings" size={52} />
      <Cutout src="placeholder-cut.png" x={500} y={500} h={600} at={2} from="right" fadeBottom={0.8} />
      <ScoreStack
        rows={[
          { t: "167", label: "GALLE · AUG 2026", at: b.a - 2 },
          { t: "117", label: "COLOMBO · AUG 2026", at: b.b - 2 },
          { t: "80", label: "WELLINGTON · NOV 2026", at: b.c - 2, color: C.accent },
        ]}
      />
    </Shell>
  );
};

/* ================= S3 — lollipop ranking with a benchmark ================= */
const s3Beats = (fps: number) => ({ rank: wordAt(fps, "s3", "rank", 0.84), field: wordAt(fps, "s3", "field", 1.4), bench: wordAt(fps, "s3", "benchmark", 3.8) });
const S3: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  const r = b.rank - 8;
  return (
    <Shell>
      <Kicker title="The revolving door, in numbers" sub="Test average at No.3 · June 2023 – Nov 2026" size={54} />
      <Lollipop
        max={80}
        ticks={[20, 40, 60, 80]}
        benchmark={{ value: 44.4, label: "Pujara's career at No.3 · 44.4", at: b.bench - 6 }}
        rows={[
          { name: "SHUBMAN GILL", sub: "29 INNINGS", value: 37.4, at: r },
          { name: "SAI SUDHARSAN", sub: "12 INNINGS", value: 31.9, at: r + 4 },
          { name: "KARUN NAIR", sub: "4 INNINGS", value: 27.8, at: r + 8 },
          { name: "VIRAT KOHLI", sub: "2 INNINGS", value: 35.0, at: r + 12, tone: "muted" },
          { name: "WASHINGTON SUNDAR", sub: "2 INNINGS", value: 30.0, at: r + 16, tone: "muted" },
          { name: "KL RAHUL", sub: "2 INNINGS", value: 12.0, at: r + 20, tone: "muted" },
          { name: "DEVDUTT PADIKKAL", sub: "6 INNINGS", value: 72.2, at: b.field + 6, tone: "pick" },
        ]}
      />
    </Shell>
  );
};

/* ================= S4 — the road (tracking camera) ================= */
const s4Beats = (fps: number) => ({ road: wordAt(fps, "s4", "road", 0.08), stop: wordAt(fps, "s4", "stop", 1.8), gaps: wordAt(fps, "s4", "gaps", 3.26), map: wordAt(fps, "s4", "map", 4.1) });
const S4: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  return (
    <Shell drift={0}>
      <Kicker title="It wasn't a straight road" outAt={b.gaps} />
      <Road
        width={1900}
        stations={[
          { x: 260, value: "65", date: "MAR 2024", place: "DHARAMSALA", note: "DEBUT · AT No.4", at: b.road },
          { x: 640, value: "0", date: "NOV 2024", place: "PERTH", note: "THEN 25", at: b.stop, tone: "red" },
          { x: 1500, value: "167", date: "AUG 2026", place: "GALLE", note: "FIRST TEST HUNDRED", at: b.map + 4, tone: "accent" },
        ]}
        gaps={[{ from: 860, to: 1290, label: "21 months away", at: b.gaps }]}
        camera={[
          { t: 0, x: 260 },
          { t: b.stop + 4, x: 640 },
          { t: b.gaps + 8, x: 1070 },
          { t: b.map + 8, x: 1500 },
        ]}
      />
    </Shell>
  );
};

/* ================= S5 — dot columns ================= */
const s5Beats = (fps: number) => ({ dot: wordAt(fps, "s5", "dot", 0), time: wordAt(fps, "s5", "time", 1.08), crease: wordAt(fps, "s5", "crease", 1.78), count: wordAt(fps, "s5", "count", 3.42) });
const S5: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  return (
    <Shell>
      <Kicker title="Measured in time" sub="One dot = one ball faced per dismissal, at No.3" subAt={b.dot} size={60} />
      <DotColumn n={101} at={b.time - 8} x={200} label="PUJARA" sub="CAREER" />
      <DotColumn n={61} at={b.crease - 4} x={540} label="THE OTHERS" sub="No.3s SINCE 2023" tone="muted" />
      <DotColumn n={128} at={b.count - 14} x={880} label="PADIKKAL" sub="AT No.3" tone="pick" />
    </Shell>
  );
};

/* ================= S6 — the mirror (butterfly + crack) ================= */
const s6Beats = (fps: number) => ({ players: wordAt(fps, "s6", "players", 1.34), side: wordAt(fps, "s6", "side", 1.6), side2: wordAt(fps, "s6", "side", 2.3, 1), breaks: wordAt(fps, "s6", "breaks", 3.94) });
const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  return (
    <Shell>
      <Versus a="Padikkal" b="Sai Sudharsan" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", opacity: fade(frame, b.players - 10) }}>
        <Serif size={48}>First-class: mirror images</Serif>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 450 }}>
        <FlyRow label="AVERAGE" a={44.6} b={42.9} max={75} at={b.players - 6} fmtA="44.6" fmtB="42.9" />
        <FlyRow label="HUNDREDS" a={10} b={10} max={12} at={b.side - 2} fmtA="10" fmtB="10" />
        <FlyRow label="RUNS" a={4011} b={3004} max={5000} at={b.side2} fmtA="4,011" fmtB="3,004" />
      </div>
      <Crack y={750} at={b.breaks - 4} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 810, textAlign: "center", opacity: fade(frame, b.breaks) }}>
        <Serif size={48}>Tests: the mirror breaks</Serif>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 880 }}>
        <FlyRow label="AVERAGE" a={71.1} b={31.9} max={75} at={b.breaks + 4} fmtA="71.1" fmtB="31.9" winA />
        <FlyRow label="HUNDREDS" a={2} b={0} max={2.4} at={b.breaks + 10} fmtA="2" fmtB="0" winA />
        <FlyRow label="BALLS / DISMISSAL" a={124} b={71} max={135} at={b.breaks + 16} fmtA="124" fmtB="71" winA />
        <FlyRow label="BEST" a={167} b={87} max={180} at={b.breaks + 22} fmtA="167" fmtB="87" winA />
      </div>
      <Footnote text="First-class: ESPNcricinfo via Wikipedia · Tests to 22 Nov 2026" at={b.breaks + 30} />
    </Shell>
  );
};

/* ================= S7 — the verdict: case file + stamp + brand ================= */
const s7Beats = (fps: number) => ({ stamp: wordAt(fps, "s7", "stamp", 2.02), brand: sentence(fps, "s7", 1).from - 6 });
const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const fill = interpolate(frame, [2, 26], [0, 1], { easing: theme.ease.out, ...CLAMP });
  return (
    <Shell exit={false} drift={0.025}>
      <BigGlyph x={199} y={196} size={1100} draw={1} fill={fill * 0.92} />
      <CaseFile src="placeholder.jpg" at={6} pos="40% 30%">
        <Stamp text="Found" sub="India's No.3" at={b.stamp} x={470} y={296} />
      </CaseFile>
      <StatRow
        at={10}
        outAt={b.brand - 8}
        stats={[
          { v: "7", l: "INNINGS" },
          { v: "498", l: "RUNS" },
          { v: "71.1", l: "AVERAGE", accent: true },
          { v: "2", l: "HUNDREDS", accent: true },
        ]}
      />
      <Brand at={b.brand + 2} series={config.series} tagline={config.tagline} />
    </Shell>
  );
};

/* ================= wiring ================= */
export const STORY = {
  scenes: [
    ["s1", S1],
    ["s2", S2],
    ["s3", S3],
    ["s4", S4],
    ["s5", S5],
    ["s6", S6],
    ["s7", S7],
  ] as [string, React.FC][],
  // the paper warms (accent tint) from here
  warmFrom: (fps: number) => scene(fps, "s7").from,
  // masthead and captions bow out for the brand lockup
  mastheadOffAt: (fps: number) => scene(fps, "s7").from + s7Beats(fps).brand,
  captionsOffFrom: (fps: number) => scene(fps, "s7").from + sentence(fps, "s7", 1).from - 2,
  // SFX in absolute frames. Files: swoosh whip pen tick ticks impact slam pop rise crack crowd
  sfx: (fps: number): Cue[] => {
    const S = (id: string) => scene(fps, id).from;
    const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps);
    const cues: Cue[] = [];
    ["s2", "s3", "s4", "s5", "s6", "s7"].forEach((id) => cues.push({ at: S(id) - 9, file: "swoosh.wav", volume: 0.28 }));
    cues.push({ at: S("s1") + b1.giant - 10, file: "pen.wav", volume: 0.35 }, { at: 12, file: "whip.wav", volume: 0.14 });
    for (let i = 0; i < 6; i++) cues.push({ at: S("s1") + b1.door + i * Math.floor((b1.hero - 4 - b1.door) / 6), file: "whip.wav", volume: 0.18 });
    cues.push({ at: S("s1") + b1.hero, file: "impact.wav", volume: 0.6 });
    [b2.a, b2.b, b2.c].forEach((x, i) => cues.push({ at: S("s2") + x - 2, file: "slam.wav", volume: i === 2 ? 0.55 : 0.45 }));
    cues.push({ at: S("s3") + b3.field, file: "rise.wav", volume: 0.3 }, { at: S("s3") + b3.field + 12, file: "impact.wav", volume: 0.4 }, { at: S("s3") + b3.bench - 6, file: "pen.wav", volume: 0.25 });
    [b4.road, b4.stop, b4.map + 4].forEach((x, i) => cues.push({ at: S("s4") + x - 4, file: i === 2 ? "slam.wav" : "pop.wav", volume: i === 2 ? 0.4 : 0.26 }));
    cues.push({ at: S("s5") + b5.time - 8, file: "ticks.wav", volume: 0.3 }, { at: S("s5") + b5.count - 14, file: "ticks.wav", volume: 0.34 });
    cues.push({ at: S("s6") + b6.breaks - 4, file: "crack.wav", volume: 0.5 }, { at: S("s6") + b6.breaks + 4, file: "slam.wav", volume: 0.35 });
    cues.push({ at: S("s7") + 6, file: "swoosh.wav", volume: 0.22 }, { at: S("s7") + b7.stamp - 2, file: "slam.wav", volume: 0.55 }, { at: S("s7") + b7.stamp - 2, file: "impact.wav", volume: 0.55 });
    cues.push({ at: S("s7") + b7.stamp, file: "crowd.wav", volume: 0.22 }, { at: totalFrames(fps) - Math.round(fps * 1.2), file: "pen.wav", volume: 0.3 });
    return cues;
  },
};
