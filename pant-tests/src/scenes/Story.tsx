// Rishabh Pant in Tests: highs, lows, spin, overseas, and the nervous nineties. Nine scenes timed to the narration.
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Ball, Callout, idxOf, INN, Timeline } from "../components/Career";
import { CLAMP } from "../components/Motion";
import { Lamp, Lettering, Panel } from "../components/Panel";
import { SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { AMBER, GREEN, HBars, RED, Stamp } from "../components/Toss";
import { Framed } from "../components/Tribute";
import { theme } from "../theme";
import { sentence, wordAt } from "../timing";
import { useFlip } from "./common";

const C = theme.colors;
const fade = (f: number, at: number, len = 10) => interpolate(f, [at, at + len], [0, 1], CLAMP);

const Bar: React.FC<{ text: string; delay?: number; color?: string }> = ({ text, delay = -10, color = C.cream }) => (
  <Panel x={60} y={226} w={960} h={104} delay={delay} seed={60}>
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Lettering size={56} color={color}>
        {text}
      </Lettering>
    </div>
  </Panel>
);

const ChartPanel: React.FC<{ children: React.ReactNode; seed: number; delay?: number; h?: number }> = ({ children, seed, delay = -6, h = 600 }) => (
  <Panel x={60} y={346} w={960} h={h} delay={delay} seed={seed}>
    <div style={{ position: "absolute", left: 20, top: 16 }}>{children}</div>
  </Panel>
);
const CW = 920, CH = 570;
const LAST = INN.length - 1;

/* ================= S1 — WELLINGTON ================= */
export const s1Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s1", i));
  return { runs: wordAt(fps, "s1", "128", 0.92), balls: wordAt(fps, "s1", "153", 2.96), ninth: s[1].from, sena: s[2].from, countries: wordAt(fps, "s1", "countries", 14.3), stokes: wordAt(fps, "s1", "stokes", 16.18) };
};

export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const c = theme.ease.out(interpolate(frame, [b.runs - 16, b.runs + 8], [0, 1], CLAMP));
  const rows = [
    { c: "ENGLAND", g: "THE OVAL", y: "2018", s: "114" },
    { c: "AUSTRALIA", g: "SYDNEY", y: "2019", s: "159*" },
    { c: "SOUTH AFRICA", g: "CAPE TOWN", y: "2022", s: "100*" },
    { c: "NEW ZEALAND", g: "WELLINGTON", y: "2026", s: "128" },
  ];
  const stepF = Math.max(5, Math.round((b.countries - b.sena) / 4));
  return (
    <SceneShell push={0.02} turnIn={false}>
      <Bar text="WELLINGTON · BASIN RESERVE" delay={-14} />
      <Framed src="pant-raise-bat.jpg" x={60} y={346} w={960} h={470} at={-8} position="50% 27%" />
      <Panel x={60} y={830} w={960} h={124} delay={-4} seed={101} glow={C.amberGlow} glowOn={c >= 1 ? 0.7 : 0}>
        <div style={{ position: "absolute", left: 36, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 16 }}>
          <Plates text={String(Math.round(128 * c)).padStart(3, " ")} w={64} h={96} gap={6} color={AMBER} glow={C.amberGlow} blur={c > 0 && c < 0.9 ? 1 : 0} />
          <div style={{ opacity: fade(frame, b.balls - 4) }}>
            <Lettering size={40} color={C.creamDim}>
              (153)
            </Lettering>
          </div>
        </div>
        <div style={{ position: "absolute", right: 36, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 10 }}>
          <Lettering size={38} style={{ opacity: fade(frame, b.ninth) }}>
            9TH TEST HUNDRED · FIRST IN NZ
          </Lettering>
          <Lettering size={30} color={AMBER} style={{ opacity: fade(frame, b.stokes - 4) }}>
            108 TEST SIXES · ONLY STOKES HAS MORE
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={970} w={960} h={386} delay={b.sena - 8} seed={102}>
        <div style={{ position: "absolute", top: 18, width: "100%", textAlign: "center" }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
            FIRST TEST HUNDRED IN EACH SENA COUNTRY
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 50, right: 50, top: 58, display: "flex", flexDirection: "column", gap: 6 }}>
          {rows.map((r, i) => {
            const lit = frame >= b.sena + 10 + i * stepF;
            const last = i === 3;
            return (
              <div key={r.c} style={{ display: "flex", alignItems: "center", gap: 22, height: 70, opacity: lit ? 1 : 0.2 }}>
                <Lamp color={last ? AMBER : GREEN} glow={last ? C.amberGlow : C.greenGlow} on={lit ? 1 : 0} size={26} />
                <div style={{ width: 340 }}>
                  <Lettering size={46} color={last ? AMBER : C.cream}>
                    {r.c}
                  </Lettering>
                </div>
                <div style={{ flex: 1 }}>
                  <Lettering size={26} color={C.creamDim}>
                    {r.g} · {r.y}
                  </Lettering>
                </div>
                <Lettering size={50} color={last ? AMBER : C.cream}>
                  {r.s}
                </Lettering>
              </div>
            );
          })}
        </div>
      </Panel>
      <div style={{ position: "absolute", right: 90, top: 700 }}>
        <Stamp text="FIRST ASIAN KEEPER" at={b.countries + 4} color={AMBER} size={46} rotate={-4} />
      </div>
    </SceneShell>
  );
};

/* ================= S2 — THE LINE ================= */
export const s2Beats = (fps: number) => {
  const s = [0, 1].map((i) => sentence(fps, "s2", i));
  return { tests: s[0].from, every: s[1].from, line: wordAt(fps, "s2", "line", 9.88), calm: wordAt(fps, "s2", "calm", 13.38) };
};

export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const draw = theme.ease.inOut(interpolate(frame, [b.tests + 4, b.every + 30], [0, 1], CLAMP));
  const line = theme.ease.inOut(interpolate(frame, [b.line - 4, b.line + 56], [0, 1], CLAMP));
  const stats = [
    { v: "53", l: "TESTS" },
    { v: "3,853", l: "RUNS" },
    { v: "44.8", l: "AVERAGE" },
    { v: "9", l: "HUNDREDS" },
  ];
  return (
    <SceneShell push={0.015}>
      <Bar text="NEVER A CALM RIDE" />
      <ChartPanel seed={201}>
        <Timeline w={CW} h={CH} draw={draw} lineDraw={line} gapAt={b.calm - 10} />
      </ChartPanel>
      <Panel x={60} y={962} w={960} h={250} delay={b.tests - 8} seed={202}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          {stats.map((s, i) => (
            <div key={s.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: fade(frame, b.tests + i * 12) }}>
              <Lettering size={84} color={i >= 2 ? AMBER : C.cream}>
                {s.v}
              </Lettering>
              <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
                {s.l}
              </Lettering>
            </div>
          ))}
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1232, textAlign: "center", opacity: fade(frame, b.every) }}>
        <Lettering size={16} font="body" weight={500} color={C.creamDim} spacing="0.08em">
          GOLD BAR = 100+ · CREAM = 50+ · LINE = AVERAGE OVER HIS LAST 10 INNINGS · TO WELLINGTON, 22 NOV 2026
        </Lettering>
      </div>
    </SceneShell>
  );
};

/* ================= S3 — THE HIGHS ================= */
const iOval = idxOf((x) => x.runs === 114);
const iSyd = idxOf((x) => x.runs === 159);
const iGabba = idxOf((x) => x.date === "2021-01-15" && x.runs === 89);
export const s3Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s3", i));
  return { six: s[0].from, oval: wordAt(fps, "s3", "oval", 3.76), syd: wordAt(fps, "s3", "159", 6.46), gabba: s[2].from, n89: wordAt(fps, "s3", "89", 10.68), years: wordAt(fps, "s3", "32", 15.2) };
};

export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  const callouts: Callout[] = [
    { i: iOval, text: "114 THE OVAL", at: b.oval, color: AMBER, side: "right", dy: 92 },
    { i: iSyd, text: "159* SYDNEY", at: b.syd - 4, color: AMBER, side: "right", dy: 46 },
    { i: iGabba, text: "89* GABBA", at: b.n89 - 4, color: GREEN, side: "right", dy: 0 },
  ];
  return (
    <SceneShell push={0.015}>
      <Bar text="2018–2022 · THE HIGHS" color={GREEN} />
      <ChartPanel seed={301} h={520}>
        <Timeline w={CW} h={490} bands={[{ from: 0, to: idxOf((x) => x.date >= "2022-01-01") - 1, color: GREEN, at: 4 }]} dimOutside={{ from: 0, to: idxOf((x) => x.date >= "2022-01-01") - 1, color: GREEN, at: 4 }} callouts={callouts} />
      </ChartPanel>
      <Framed src="pant-oval-2018.jpg" x={60} y={882} w={600} h={474} at={b.oval - 6} position="45% 55%" credit="THE OVAL, 11 SEPT 2018 · PHOTO: BEN SUTHERLAND (CC BY 2.0)" />
      <Panel x={676} y={882} w={344} h={474} delay={b.six - 6} seed={302} glow={C.greenGlow} glowOn={frame >= b.years ? 0.6 : 0}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Lettering size={18} font="body" color={C.creamDim} spacing="0.14em">
            FIRST SCORING SHOT
          </Lettering>
          <Lettering size={88} color={AMBER}>
            6
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: fade(frame, b.n89 - 4) }}>
          <Lettering size={18} font="body" color={C.creamDim} spacing="0.14em">
            GABBA 2021 · CHASE WON
          </Lettering>
          <Lettering size={88} color={GREEN}>
            89*
          </Lettering>
          <Lettering size={18} font="body" color={C.cream} spacing="0.1em" style={{ opacity: fade(frame, b.years - 4) }}>
            AUSTRALIA'S FIRST GABBA
          </Lettering>
          <Lettering size={18} font="body" color={C.cream} spacing="0.1em" style={{ opacity: fade(frame, b.years - 4) }}>
            DEFEAT IN 32 YEARS
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S4 — THE LOWS, THE CRASH, THE COMEBACK ================= */
const i2020a = idxOf((x) => x.date >= "2020-01-01");
const i2020b = idxOf((x) => x.date >= "2021-01-01") - 1;
const iBack = idxOf((x) => x.runs === 109);
export const s4Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s4", i));
  return { lows: s[0].from, n18: wordAt(fps, "s4", "18", 3.92), crash: s[1].from, car: wordAt(fps, "s4", "car", 8.54), days: s[2].from, chennai: wordAt(fps, "s4", "chennai", 16.44) };
};

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const days = Math.round(637 * theme.ease.out(interpolate(frame, [b.days - 4, b.days + 30], [0, 1], CLAMP)));
  return (
    <SceneShell push={0.015} shakeFrames={[b.car]}>
      <Bar text="THE LOWS" color={RED} />
      <ChartPanel seed={401}>
        <Timeline
          w={CW}
          h={CH}
          gapAt={b.car}
          bands={[{ from: i2020a, to: i2020b, color: RED, at: b.lows + 10, label: "2020: AVG 17.8" }]}
          callouts={[{ i: iBack, text: "109 CHENNAI", at: b.chennai - 6, color: GREEN, side: "left", dy: 0 }]}
        />
      </ChartPanel>
      <Panel x={60} y={962} w={560} h={394} delay={b.crash - 8} seed={402} glow={C.redGlow} glowOn={frame >= b.car && frame < b.days ? 0.6 : 0}>
        <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
          <Lettering size={24} font="body" color={C.creamDim} spacing="0.18em">
            30 DEC 2022 · THE CAR CRASH
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 86, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: fade(frame, b.days - 6) }}>
          <Plates text={String(days).padStart(3, " ")} w={90} h={136} gap={8} color={C.cream} />
          <Lettering size={40} color={C.creamDim}>
            DAYS BETWEEN TESTS
          </Lettering>
        </div>
        <div style={{ position: "absolute", bottom: 28, width: "100%", textAlign: "center", opacity: fade(frame, b.chennai - 4) }}>
          <Lettering size={40} color={GREEN}>
            COMEBACK TEST: 109
          </Lettering>
        </div>
      </Panel>
      <Framed src="pant-lookup.jpg" x={636} y={962} w={384} h={394} at={b.chennai - 14} position="38% 30%" />
    </SceneShell>
  );
};

/* ================= S5 — LEEDS AND MANCHESTER ================= */
const iLeeds = idxOf((x) => x.runs === 134);
export const s5Beats = (fps: number) => {
  const s = [0, 1].map((i) => sentence(fps, "s5", i));
  return { leeds: s[0].from, each: wordAt(fps, "s5", "each", 3.26), flower: wordAt(fps, "s5", "flower", 7.28), man: s[1].from, foot: wordAt(fps, "s5", "foot", 11.64), n54: wordAt(fps, "s5", "54", 12.68) };
};

export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const flip1 = useFlip(b.each - 10, 3);
  const flip2 = useFlip(b.each, 3);
  return (
    <SceneShell push={0.015}>
      <Bar text="2025 · LEEDS & MANCHESTER" color={AMBER} />
      <Framed src="pant-heart.jpg" x={60} y={346} w={420} h={560} at={b.leeds - 8} position="50% 18%" />
      <Panel x={496} y={346} w={524} h={560} delay={b.leeds - 6} seed={501} glow={C.amberGlow} glowOn={frame >= b.flower ? 0.7 : 0}>
        <div style={{ position: "absolute", top: 26, width: "100%", textAlign: "center" }}>
          <Lettering size={24} font="body" color={C.creamDim} spacing="0.2em">
            HEADINGLEY · ENG v IND
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 76, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          {[
            { t: "134", l: "1ST INNINGS", f: flip1 },
            { t: "118", l: "2ND INNINGS", f: flip2 },
          ].map((x) => (
            <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Plates text={x.t} prev="   " progress={x.f} w={78} h={118} gap={6} color={AMBER} glow={C.amberGlow} />
              <Lettering size={28} color={C.creamDim}>
                {x.l}
              </Lettering>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, display: "flex", justifyContent: "center" }}>
          <Stamp text="ONLY ANDY FLOWER BEFORE" at={b.flower - 4} color={AMBER} size={40} rotate={-3} />
        </div>
      </Panel>
      <Panel x={60} y={922} w={960} h={434} delay={b.man - 6} seed={502}>
        <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
          <Lettering size={30} font="body" color={C.creamDim} spacing="0.22em">
            OLD TRAFFORD · WEEKS LATER
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 100, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
          <svg width={150} height={150} viewBox="0 0 100 100" style={{ opacity: fade(frame, b.foot - 6) }}>
            <path d="M30 10 H52 V60 C52 70 60 74 76 76 C88 78 90 92 80 94 H30 Z" fill={C.plateHi} stroke={C.cream} strokeWidth={3} />
            <path d="M44 62 L52 70 L46 76 L56 84" fill="none" stroke={RED} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Lettering size={44} color={RED} style={{ opacity: fade(frame, b.foot - 4) }}>
              FRACTURED FOOT
            </Lettering>
            <Lettering size={110} color={C.cream} style={{ opacity: fade(frame, b.n54 - 4) }}>
              54
            </Lettering>
          </div>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S6 — THE SPIN STORY ================= */
export const s6Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s6", i));
  return { spin: s[0].from, pace: wordAt(fps, "s6", "39", 2.82), n53: wordAt(fps, "s6", "53", 5.36), n86: wordAt(fps, "s6", "86", 6.36), sixes: s[2].from, home: wordAt(fps, "s6", "home", 13.64), ball: wordAt(fps, "s6", "ball", 17.34), lyon: s[3].from, six6: wordAt(fps, "s6", "six", 21.48), n258: wordAt(fps, "s6", "258", 23.82) };
};

export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const cols = [
    { k: "v PACE", avg: "39.0", sr: "65", at: b.pace - 6, color: C.cream },
    { k: "v SPIN", avg: "52.8", sr: "86", at: b.n53 - 6, color: AMBER },
  ];
  const lyonPhase = fade(frame, b.lyon - 8, 8);
  return (
    <SceneShell push={0.015}>
      <Bar text="THE SPIN STORY" color={AMBER} />
      <div style={{ position: "absolute", left: 60, top: 346, width: 960, display: "flex", gap: 16, opacity: 1 - lyonPhase * 0.0 }}>
        {cols.map((c, i) => (
          <div key={c.k} style={{ position: "relative", width: 472, height: 330 }}>
            <Panel x={0} y={0} w={472} h={330} delay={c.at - 4} seed={601 + i} glow={C.amberGlow} glowOn={i === 1 && frame >= b.n86 ? 0.6 : 0}>
              {i === 1 && (
                <Img src={staticFile("photos/pant-flick.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 25%", opacity: 0.22, filter: "grayscale(0.3)" }} />
              )}
              <div style={{ position: "absolute", top: 24, width: "100%", textAlign: "center" }}>
                <Lettering size={56} color={c.color}>
                  {c.k}
                </Lettering>
              </div>
              <div style={{ position: "absolute", top: 100, width: "100%", display: "flex", justifyContent: "center" }}>
                <Plates text={c.avg} w={70} h={108} gap={6} color={c.color} />
              </div>
              <div style={{ position: "absolute", bottom: 26, width: "100%", textAlign: "center", opacity: fade(frame, i === 1 ? b.n86 - 4 : b.pace + 6) }}>
                <Lettering size={22} font="body" color={C.creamDim} spacing="0.14em">
                  AVERAGE · STRIKE RATE {c.sr}
                </Lettering>
              </div>
            </Panel>
          </div>
        ))}
      </div>
      {/* 100 sixes: amber = off spinners */}
      <Panel x={60} y={692} w={960} h={330} delay={b.sixes - 6} seed={603} closeAt={b.lyon - 10}>
        <div style={{ position: "absolute", top: 22, width: "100%", textAlign: "center" }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.16em">
            HIS FIRST 100 TEST SIXES · <span style={{ color: AMBER }}>■ OFF SPIN 75</span> · ■ OFF PACE 25
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 80, right: 80, top: 66, display: "grid", gridTemplateColumns: "repeat(25, 1fr)", gap: 6 }}>
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} style={{ height: 40, borderRadius: 4, background: frame >= b.sixes + i * 0.3 ? (i < 75 ? AMBER : C.creamDim) : C.plateHi, boxShadow: i < 75 && frame >= b.sixes + i * 0.3 ? `0 0 6px ${C.amberGlow}` : undefined }} />
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 24, width: "100%", textAlign: "center", opacity: fade(frame, b.home - 4) }}>
          <Lettering size={40}>
            AT HOME v SPIN: <span style={{ color: AMBER }}>99 RUNS PER 100 BALLS</span> · AVG 62
          </Lettering>
        </div>
      </Panel>
      <Framed src="pant-hit.jpg" x={60} y={692} w={400} h={664} at={b.lyon - 6} position="40% 20%" />
      <Panel x={476} y={692} w={544} h={664} delay={b.lyon - 4} seed={604}>
        <div style={{ position: "absolute", top: 26, width: "100%", textAlign: "center" }}>
          <Lettering size={44}>PANT v NATHAN LYON</Lettering>
        </div>
        <div style={{ position: "absolute", left: 24, right: 24, top: 96, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { v: "6", l: "DISMISSALS · MOST BY ANY BOWLER", at: b.six6 - 6, c: RED },
            { v: "404", l: "BALLS FACED", at: b.n258 - 10, c: C.cream },
            { v: "258", l: "RUNS", at: b.n258 - 4, c: AMBER },
            { v: "7", l: "SIXES", at: b.n258 + 20, c: AMBER },
          ].map((x) => (
            <div key={x.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "26px 8px", borderRadius: 10, background: C.plate, opacity: fade(frame, x.at) }}>
              <Lettering size={100} color={x.c}>
                {x.v}
              </Lettering>
              <Lettering size={18} font="body" color={C.creamDim} spacing="0.12em">
                {x.l}
              </Lettering>
            </div>
          ))}
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S7 — OVERSEAS, v OTHER KEEPERS ================= */
export const s7Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s7", i));
  return { cmp: s[0].from, best: s[1].from, n43: wordAt(fps, "s7", "43", 7.8), most: wordAt(fps, "s7", "most", 9.2), faster: s[2].from };
};

const KEEPERS = [
  { n: "RISHABH PANT", c: "IND", avg: 42.9, h: 7, sr: 69, tests: 37 },
  { n: "MATT PRIOR", c: "ENG", avg: 42.8, h: 3, sr: 57, tests: 35 },
  { n: "MOHAMMAD RIZWAN", c: "PAK", avg: 36.5, h: 0, sr: 54, tests: 27 },
  { n: "ALEX CAREY", c: "AUS", avg: 36.2, h: 1, sr: 63, tests: 26 },
  { n: "BJ WATLING", c: "NZ", avg: 35.8, h: 4, sr: 42, tests: 36 },
  { n: "QUINTON DE KOCK", c: "SA", avg: 35.2, h: 3, sr: 68, tests: 23 },
  { n: "TOM BLUNDELL", c: "NZ", avg: 33.6, h: 3, sr: 49, tests: 23 },
  { n: "MS DHONI", c: "IND", avg: 32.8, h: 1, sr: 59, tests: 47 },
];

export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const showH = fade(frame, b.most - 4);
  const showSR = fade(frame, b.faster - 4);
  return (
    <SceneShell push={0.015}>
      <Bar text="OVERSEAS · v THE KEEPERS" />
      <Panel x={60} y={346} w={960} h={1010} delay={b.cmp - 4} seed={701}>
        <div style={{ position: "absolute", top: 22, left: 40, right: 40, display: "flex", justifyContent: "space-between" }}>
          <Lettering size={20} font="body" color={C.creamDim} spacing="0.16em">
            AWAY FROM HOME · TESTS SINCE 2002
          </Lettering>
          <div style={{ display: "flex", gap: 30 }}>
            <Lettering size={20} font="body" color={C.creamDim} spacing="0.16em" style={{ opacity: showH }}>
              100s
            </Lettering>
            <Lettering size={20} font="body" color={C.creamDim} spacing="0.16em" style={{ opacity: showSR }}>
              SR
            </Lettering>
          </div>
        </div>
        <div style={{ position: "absolute", left: 40, right: 40, top: 70, display: "flex", flexDirection: "column", gap: 18 }}>
          {KEEPERS.map((k, i) => {
            const at = b.cmp + 10 + i * 4;
            const p = theme.ease.out(interpolate(frame, [at, at + 16], [0, 1], CLAMP));
            const pant = i === 0;
            const col = pant ? AMBER : C.creamDim;
            return (
              <div key={k.n} style={{ display: "flex", alignItems: "center", gap: 18, opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP) }}>
                <div style={{ width: 270, display: "flex", flexDirection: "column", gap: 2 }}>
                  <Lettering size={34} color={pant ? AMBER : C.cream}>
                    {k.n}
                  </Lettering>
                  <Lettering size={15} font="body" color={C.creamDim} spacing="0.12em">
                    {k.c} · {k.tests} AWAY TESTS
                  </Lettering>
                </div>
                <div style={{ flex: 1, height: 46, borderRadius: 6, background: C.plate, position: "relative" }}>
                  <div style={{ width: `${(k.avg / 46) * 100 * p}%`, height: "100%", borderRadius: 6, background: col, boxShadow: pant ? `0 0 14px ${C.amberGlow}` : undefined }} />
                  <div style={{ position: "absolute", left: 14, top: 4 }}>
                    <Lettering size={38} color={C.board}>
                      {k.avg.toFixed(1)}
                    </Lettering>
                  </div>
                </div>
                <div style={{ width: 60, textAlign: "center", opacity: showH }}>
                  <Lettering size={40} color={pant ? AMBER : C.cream}>
                    {String(k.h)}
                  </Lettering>
                </div>
                <div style={{ width: 60, textAlign: "center", opacity: showSR }}>
                  <Lettering size={40} color={pant ? AMBER : C.cream}>
                    {String(k.sr)}
                  </Lettering>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 18, textAlign: "center" }}>
          <Lettering size={15} font="body" weight={500} color={C.creamDim} spacing="0.08em">
            MAIN KEEPERS WITH 20+ AWAY TESTS IN CRICSHEET DATA (DEC 2001–NOV 2026) · PANT INCLUDES WELLINGTON · AVG = BATTING AVERAGE AWAY
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S8 — THE NERVOUS NINETIES ================= */
export const s8Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4].map((i) => sentence(fps, "s8", i));
  return { solve: s[0].from, seven: s[1].from, nine: wordAt(fps, "s8", "nine", 5.78), across: s[2].from, half: wordAt(fps, "s8", "half", 14.58), since: s[3].from, nerves: s[4].from, n105: wordAt(fps, "s8", "105", 28.76), n73: wordAt(fps, "s8", "73", 33.14) };
};

const NINETIES = [
  { r: "92", w: "RAJKOT 2018" },
  { r: "92", w: "HYDERABAD 2018" },
  { r: "97", w: "SYDNEY 2021" },
  { r: "91", w: "CHENNAI 2021" },
  { r: "96", w: "MOHALI 2022" },
  { r: "93", w: "MIRPUR 2022" },
  { r: "99", w: "BENGALURU 2024" },
];

export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  const phase2 = b.since - 10;
  return (
    <SceneShell push={0.012}>
      <Bar text="THE NERVOUS NINETIES" color={RED} />
      <Panel x={60} y={346} w={960} h={540} delay={b.solve} seed={801}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 30, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {NINETIES.map((n, i) => {
            const at = b.seven + 6 + i * 5;
            const p = spring({ frame: frame - at, fps, config: theme.spring.flip });
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "10px 0", borderRadius: 10, background: C.plate, opacity: interpolate(p, [0, 0.3], [0.15, 1], CLAMP), transform: `perspective(500px) rotateX(${interpolate(p, [0, 1], [80, 0], CLAMP)}deg)` }}>
                <Lettering size={80} color={RED}>
                  {n.r}
                </Lettering>
                <Lettering size={15} font="body" color={C.creamDim} spacing="0.1em">
                  {n.w}
                </Lettering>
              </div>
            );
          })}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 10, background: C.plate, boxShadow: `inset 0 0 0 2px ${AMBER}`, opacity: fade(frame, b.nine - 4) }}>
            <Lettering size={80} color={AMBER}>
              9
            </Lettering>
            <Lettering size={15} font="body" color={C.creamDim} spacing="0.1em">
              HUNDREDS
            </Lettering>
          </div>
        </div>
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: fade(frame, b.across) }}>
          <Lettering size={20} font="body" color={C.creamDim} spacing="0.12em">
            90+ SCORES THAT STOPPED SHORT
          </Lettering>
          <div style={{ display: "flex", gap: 28, alignItems: "baseline" }}>
            <Lettering size={24} color={C.creamDim}>
              ALL TEST BATTERS
            </Lettering>
            <Lettering size={56} color={C.cream}>
              18%
            </Lettering>
            <Lettering size={24} color={C.creamDim} style={{ opacity: fade(frame, b.half - 8) }}>
              PANT
            </Lettering>
            <Lettering size={56} color={RED} style={{ opacity: fade(frame, b.half - 8) }}>
              44%
            </Lettering>
          </div>
        </div>
      </Panel>
      <Panel x={60} y={902} w={960} h={454} delay={phase2} seed={802}>
        <div style={{ position: "absolute", top: 24, width: "100%", textAlign: "center", opacity: 1 - fade(frame, b.nerves - 8, 6) }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.16em">
            MOST SCORES IN THE NINETIES · TESTS SINCE 2002
          </Lettering>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
            {[
              { n: "RISHABH PANT", t: "53 TESTS", c: AMBER },
              { n: "AB DE VILLIERS", t: "114 TESTS", c: C.cream },
              { n: "ALASTAIR COOK", t: "161 TESTS", c: C.cream },
            ].map((x, i) => (
              <div key={x.n} style={{ display: "flex", alignItems: "baseline", gap: 30, width: 760, justifyContent: "space-between", opacity: fade(frame, b.since + 10 + i * 12) }}>
                <Lettering size={48} color={x.c}>
                  {x.n}
                </Lettering>
                <Lettering size={30} color={C.creamDim}>
                  {x.t}
                </Lettering>
                <Lettering size={60} color={x.c}>
                  7
                </Lettering>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 20, top: 30, opacity: fade(frame, b.nerves - 2, 6) }}>
          <HBars
            w={920}
            hi={120}
            rowH={150}
            ref50={false}
            items={[
              { label: "SCORE 70–89 · STRIKE RATE", sub: "BALL-BY-BALL INNINGS", value: 104.9, at: b.n105 - 4, color: GREEN },
              { label: "IN THE NINETIES · STRIKE RATE", sub: "SLOWS BY A THIRD", value: 73.4, at: b.n73 - 6, color: RED },
            ]}
          />
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S9 — THE VERDICT ================= */
export const s9Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s9", i));
  return { nine: s[0].from, overseas: wordAt(fps, "s9", "overseas", 4.76), fix: s[1].from, brand: s[2].from - 8 };
};

export const S9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s9Beats(fps);
  const brand = spring({ frame: frame - b.brand, fps, config: theme.spring.heavy });
  return (
    <SceneShell push={0} pull={0.03} turnOut={false}>
      <Bar text="RISHABH PANT · TESTS" />
      <Framed src="pant-portrait.jpg" x={60} y={346} w={400} h={606} at={b.nine - 10} position="50% 20%" />
      <Panel x={476} y={346} w={544} h={420} delay={b.nine - 8} seed={901} glow={C.amberGlow} glowOn={0.5}>
        <div style={{ position: "absolute", top: 26, left: 20, right: 20, textAlign: "center" }}>
          <Lettering size={20} font="body" color={C.creamDim} spacing="0.14em">
            MOST TEST HUNDREDS BY AN INDIAN KEEPER
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 70, left: 20, right: 20, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ opacity: fade(frame, b.nine + 4 + i * 3, 4) }}>
              <Ball size={50} lit={1} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", top: 196, width: "100%", display: "flex", justifyContent: "center", alignItems: "baseline", gap: 18 }}>
          <Lettering size={66} color={AMBER}>
            PANT 9
          </Lettering>
          <Lettering size={40} color={C.creamDim}>
            · DHONI 6
          </Lettering>
        </div>
        <div style={{ position: "absolute", bottom: 30, width: "100%", textAlign: "center", opacity: fade(frame, b.overseas - 4) }}>
          <Lettering size={42}>7 OF THEM OVERSEAS</Lettering>
        </div>
      </Panel>
      <Panel x={476} y={782} w={544} h={170} delay={b.fix - 6} seed={902}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={46} color={AMBER}>
            FIX THE NINETIES…
          </Lettering>
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 60, top: 970, width: 960, opacity: interpolate(brand, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(brand, [0, 1], [0.94, 1])})` }}>
        <Panel x={0} y={0} w={960} h={300} delay={b.brand} seed={903}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <Lettering size={26} font="body" color={C.creamDim} spacing="0.3em">
              STORIES TOLD WITH DATA
            </Lettering>
            <Lettering size={100} spacing="0.03em">
              BEYOND THE SCOREBOARD
            </Lettering>
          </div>
        </Panel>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1290, textAlign: "center", opacity: fade(frame, b.brand + 10) }}>
        <Lettering size={15} font="body" weight={500} color={C.creamDim} spacing="0.08em">
          TESTS TO 22 NOV 2026 INCL. WELLINGTON 128 · CRICSHEET BALL-BY-BALL DATA · SPIN/PACE SPLITS EXCLUDE THE 2026 AFGHANISTAN TEST AND WELLINGTON (NO BALL DATA)
        </Lettering>
      </div>
    </SceneShell>
  );
};
