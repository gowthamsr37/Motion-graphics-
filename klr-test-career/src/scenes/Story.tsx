// KL Rahul in Tests: highs, lows and everything in between. Eight scenes timed to the narration.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Ball, Callout, idxOf, INN, Timeline } from "../components/Career";
import { CLAMP } from "../components/Motion";
import { Lamp, Lettering, Panel } from "../components/Panel";
import { SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { AMBER, GREEN, HBars, RED, Stamp } from "../components/Toss";
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

const Foot: React.FC<{ children: React.ReactNode; bottom?: number }> = ({ children, bottom = 16 }) => (
  <div style={{ position: "absolute", left: 30, right: 30, bottom, textAlign: "center" }}>
    <Lettering size={16} font="body" weight={500} color={C.creamDim} spacing="0.1em">
      {children}
    </Lettering>
  </div>
);

/* the timeline lives in the same panel in scenes 2–6 */
const ChartPanel: React.FC<{ children: React.ReactNode; seed: number; delay?: number }> = ({ children, seed, delay = -6 }) => (
  <Panel x={60} y={346} w={960} h={600} delay={delay} seed={seed}>
    <div style={{ position: "absolute", left: 20, top: 16 }}>{children}</div>
  </Panel>
);
const CW = 920, CH = 570;

/* ================= S1 — WELLINGTON ================= */
export const s1Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s1", i));
  return { balls: wordAt(fps, "s1", "290", 0.7), runs: wordAt(fps, "s1", "136", 2.78), thirteenth: s[1].from, sena: s[2].from, four: wordAt(fps, "s1", "four", 14.64), countries: wordAt(fps, "s1", "countries", 15.48) };
};

export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const c = theme.ease.out(interpolate(frame, [b.runs - 14, b.runs + 10], [0, 1], CLAMP));
  const rows = [
    { c: "AUSTRALIA", g: "SYDNEY", y: "2015", s: "110" },
    { c: "ENGLAND", g: "THE OVAL", y: "2018", s: "149" },
    { c: "SOUTH AFRICA", g: "CENTURION", y: "2021", s: "123" },
    { c: "NEW ZEALAND", g: "WELLINGTON", y: "2026", s: "136" },
  ];
  const stepF = Math.max(5, Math.round((b.countries - b.sena) / 4));
  return (
    <SceneShell push={0.02} turnIn={false}>
      <Bar text="WELLINGTON · BASIN RESERVE" delay={-14} />
      <Panel x={60} y={346} w={960} h={390} delay={-8} seed={101} glow={C.amberGlow} glowOn={c >= 1 ? 0.7 : 0}>
        <div style={{ position: "absolute", top: 28, width: "100%", textAlign: "center" }}>
          <Lettering size={34} font="body" color={C.creamDim} spacing="0.3em">
            KL RAHUL · 1ST TEST v NZ
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 90, width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 26 }}>
          <Plates text={String(Math.round(136 * c)).padStart(3, " ")} w={120} h={180} gap={10} color={AMBER} glow={C.amberGlow} blur={c > 0 && c < 0.9 ? 1 : 0} />
          <div style={{ opacity: fade(frame, b.balls - 4), marginBottom: 14 }}>
            <Lettering size={56} color={C.creamDim}>
              (290)
            </Lettering>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 30, width: "100%", textAlign: "center", opacity: fade(frame, b.thirteenth) }}>
          <Lettering size={44}>13TH TEST HUNDRED · FIRST TEST IN NZ</Lettering>
        </div>
      </Panel>
      <Panel x={60} y={752} w={960} h={460} delay={b.sena - 8} seed={102}>
        <div style={{ position: "absolute", top: 22, width: "100%", textAlign: "center" }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
            FIRST TEST HUNDRED IN EACH SENA COUNTRY
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 50, right: 50, top: 70, display: "flex", flexDirection: "column", gap: 14 }}>
          {rows.map((r, i) => {
            const at = b.sena + 10 + i * stepF;
            const lit = frame >= at;
            const last = i === 3;
            return (
              <div key={r.c} style={{ display: "flex", alignItems: "center", gap: 22, height: 80, opacity: lit ? 1 : 0.2 }}>
                <Lamp color={last ? AMBER : GREEN} glow={last ? C.amberGlow : C.greenGlow} on={lit ? 1 : 0} size={28} />
                <div style={{ width: 360 }}>
                  <Lettering size={50} color={last ? AMBER : C.cream}>
                    {r.c}
                  </Lettering>
                </div>
                <div style={{ flex: 1 }}>
                  <Lettering size={28} color={C.creamDim}>
                    {r.g} · {r.y}
                  </Lettering>
                </div>
                <Lettering size={56} color={last ? AMBER : C.cream}>
                  {r.s}
                </Lettering>
              </div>
            );
          })}
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1236, display: "flex", justifyContent: "center" }}>
        <Stamp text="FIRST INDIAN OPENER TO DO IT" at={b.countries + 6} color={AMBER} size={54} rotate={-3} />
      </div>
    </SceneShell>
  );
};

/* ================= S2 — THE LINE ================= */
export const s2Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s2", i));
  return { tests: s[1].from, every: wordAt(fps, "s2", "every", 6.94), gold: s[2].from, rise: wordAt(fps, "s2", "rise", 12.92), crash: wordAt(fps, "s2", "crash", 13.78), again: wordAt(fps, "s2", "again", 14.64) };
};

export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const draw = theme.ease.inOut(interpolate(frame, [b.tests, b.every + 20], [0, 1], CLAMP));
  const line = theme.ease.inOut(interpolate(frame, [b.gold + 6, b.gold + 70], [0, 1], CLAMP));
  const stats = [
    { v: "71", l: "TESTS" },
    { v: "123", l: "INNINGS" },
    { v: "4,424", l: "RUNS" },
    { v: "37.49", l: "AVERAGE" },
  ];
  return (
    <SceneShell push={0.015}>
      <Bar text="NEVER A STRAIGHT LINE" />
      <ChartPanel seed={201}>
        <Timeline w={CW} h={CH} draw={draw} lineDraw={line} />
      </ChartPanel>
      <Panel x={60} y={962} w={960} h={250} delay={b.tests - 8} seed={202}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          {stats.map((s, i) => (
            <div key={s.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: fade(frame, b.tests + i * 10) }}>
              <Lettering size={84} color={i === 3 ? AMBER : C.cream}>
                {s.v}
              </Lettering>
              <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
                {s.l}
              </Lettering>
            </div>
          ))}
        </div>
      </Panel>
      <Panel x={60} y={1228} w={960} h={128} delay={b.gold - 6} seed={203}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
          {[
            { t: "RISE", at: b.rise, c: GREEN },
            { t: "CRASH", at: b.crash, c: RED },
            { t: "RISE AGAIN", at: b.again, c: AMBER },
          ].map((w, i) => (
            <React.Fragment key={w.t}>
              {i > 0 && (
                <Lettering size={44} color={C.creamDim} style={{ opacity: fade(frame, w.at - 2) }}>
                  →
                </Lettering>
              )}
              <Lettering size={58} color={w.c} style={{ opacity: fade(frame, w.at - 4, 6) }}>
                {w.t}
              </Lettering>
            </React.Fragment>
          ))}
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S3 — THE RISE ================= */
const iStreak0 = idxOf((x) => x.date === "2017-03-04");
const i199 = idxOf((x) => x.runs === 199);
export const s3Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s3", i));
  return { debut: s[0].from, sydney: s[1].from, seven: s[2].from, record: wordAt(fps, "s3", "record", 10.14), chennai: s[3].from, n199: wordAt(fps, "s3", "199", 13.04) };
};

export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  const callouts: Callout[] = [
    { i: 2, text: "110 SYDNEY", at: b.sydney + 4, color: AMBER, side: "right", dy: -4 },
    { i: i199, text: "199 CHENNAI", at: b.n199 - 4, color: AMBER, side: "right", dy: 40 },
  ];
  return (
    <SceneShell push={0.015}>
      <Bar text="2014–2017 · THE RISE" color={GREEN} />
      <ChartPanel seed={301}>
        <Timeline w={CW} h={CH} bands={[{ from: 0, to: iStreak0 + 7, color: GREEN, at: 4, label: "THE RISE" }]} dimOutside={{ from: 0, to: iStreak0 + 7, color: GREEN, at: 4 }} callouts={callouts} />
      </ChartPanel>
      <Panel x={60} y={962} w={960} h={394} delay={b.debut - 8} seed={302} glow={C.amberGlow} glowOn={frame >= b.n199 ? 0.6 : 0}>
        <div style={{ position: "absolute", top: 26, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 18, opacity: 1 - fade(frame, b.seven - 8, 6) }}>
          <Lettering size={26} font="body" color={C.creamDim} spacing="0.16em">
            DEBUT · MELBOURNE 2014
          </Lettering>
          <Lettering size={64} color={RED} style={{ opacity: fade(frame, b.debut + 8) }}>
            3 & 1
          </Lettering>
          <Lettering size={40} color={C.creamDim} style={{ opacity: fade(frame, b.sydney) }}>
            →
          </Lettering>
          <Lettering size={26} font="body" color={C.creamDim} spacing="0.16em" style={{ opacity: fade(frame, b.sydney) }}>
            NEXT TEST · SYDNEY
          </Lettering>
          <Lettering size={64} color={AMBER} style={{ opacity: fade(frame, b.sydney + 4) }}>
            110
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 26, width: "100%", textAlign: "center", opacity: fade(frame, b.seven - 2, 6) }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
            2017 · SEVEN FIFTIES IN A ROW · EQUALLED THE WORLD RECORD
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 70, width: "100%", display: "flex", justifyContent: "center", gap: 18, opacity: fade(frame, b.seven - 2, 6) }}>
          {[90, 51, 67, 60, 51, 57, 85].map((r, i) => {
            const at = b.seven + 8 + i * 5;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <Lamp color={AMBER} glow={C.amberGlow} on={frame >= at ? 1 : 0} size={46} />
                <Lettering size={34} color={frame >= at ? C.cream : C.creamDim}>
                  {String(r)}
                </Lettering>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center", alignItems: "center", gap: 30, opacity: fade(frame, b.chennai) }}>
          <Lettering size={44} color={C.creamDim}>
            CHENNAI 2016
          </Lettering>
          <Plates text="199" w={84} h={128} gap={8} color={AMBER} glow={C.amberGlow} />
          <Lettering size={36} color={RED} style={{ opacity: fade(frame, b.n199 + 10) }}>
            ONE SHORT OF 200
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S4 — THE CRASH ================= */
const iSlump0 = idxOf((x) => x.date >= "2018-08-01");
const iSlump1 = idxOf((x) => x.date >= "2021-01-01") - 1;
const iOval = idxOf((x) => x.runs === 149);
export const s4Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s4", i));
  return { cliff: s[0].from, from: s[1].from, avg23: wordAt(fps, "s4", "23", 5.98), oval: s[2].from, n17: wordAt(fps, "s4", "17", 10.68), dropped: wordAt(fps, "s4", "dropped", 13.14), years: wordAt(fps, "s4", "years", 16.22) };
};

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  return (
    <SceneShell push={0.015} shakeFrames={[b.dropped]}>
      <Bar text="2018–2019 · THE CRASH" color={RED} />
      <ChartPanel seed={401}>
        <Timeline w={CW} h={CH} bands={[{ from: iSlump0, to: iSlump1, color: RED, at: b.cliff + 4, label: "22 INNINGS" }]} dimOutside={{ from: iSlump0, to: iSlump1, color: RED, at: b.cliff + 4 }} callouts={[{ i: iOval, text: "149 THE OVAL", at: b.oval + 6, color: AMBER, dy: 0 }]} gapAt={b.dropped} />
      </ChartPanel>
      <Panel x={60} y={962} w={960} h={394} delay={b.from - 8} seed={402}>
        <div style={{ position: "absolute", left: 50, right: 50, top: 34, display: "flex", justifyContent: "space-between" }}>
          {[
            { v: "23.5", l: "AVERAGE", s: "AUG 2018 – AUG 2019", at: b.avg23 - 6, c: RED },
            { v: "17.3", l: "WITHOUT THE 149", s: "21 OTHER INNINGS", at: b.n17 - 6, c: RED },
            { v: "14", l: "SCORES UNDER 20", s: "OUT OF 22", at: b.n17 + 14, c: C.cream },
          ].map((x) => (
            <div key={x.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: fade(frame, x.at) }}>
              <Lettering size={96} color={x.c}>
                {x.v}
              </Lettering>
              <Lettering size={24} color={C.cream}>
                {x.l}
              </Lettering>
              <Lettering size={16} font="body" color={C.creamDim} spacing="0.12em">
                {x.s}
              </Lettering>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center" }}>
          <Stamp text="DROPPED · 2 YEARS OUT" at={b.dropped} color={RED} size={70} rotate={-4} />
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S5 — COMEBACK, AND THE MIDDLE-ORDER DETOUR ================= */
const iLords = idxOf((x) => x.runs === 129);
const iCent1 = idxOf((x) => x.runs === 123);
const iCent2 = idxOf((x) => x.runs === 101);
const iBack0 = idxOf((x) => x.date >= "2021-08-01");
const iBack1 = idxOf((x) => x.date >= "2024-11-01") - 1;
export const s5Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s5", i));
  return { lords: wordAt(fps, "s5", "lord", 2.36), cent: wordAt(fps, "s5", "centurion", 4.2), down: s[1].from, six: wordAt(fps, "s5", "six", 10.02), middle: s[2].from, n27: wordAt(fps, "s5", "27", 13.9), n39: wordAt(fps, "s5", "39", 14.98) };
};

export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  return (
    <SceneShell push={0.015}>
      <Bar text="2021–2024 · THE COMEBACK" />
      <ChartPanel seed={501}>
        <Timeline
          w={CW}
          h={CH}
          gapAt={-30}
          bands={[{ from: iBack0, to: iBack1, color: C.cream, at: 4 }]}
          dimOutside={{ from: iBack0, to: iBack1, color: C.cream, at: 4 }}
          callouts={[
            { i: iLords, text: "129 LORD'S", at: b.lords - 2, color: AMBER, side: "left", dy: 64 },
            { i: iCent1, text: "123 CENTURION", at: b.cent - 2, color: AMBER, side: "left", dy: 4 },
            { i: iCent2, text: "101 AT No.6", at: b.six - 4, color: AMBER, side: "right", dy: 64 },
          ]}
        />
      </ChartPanel>
      <Panel x={60} y={962} w={960} h={394} delay={b.middle - 8} seed={502}>
        <div style={{ position: "absolute", top: 24, width: "100%", textAlign: "center" }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
            CAREER AVERAGE BY BATTING POSITION
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 20, top: 70 }}>
          <HBars
            w={920}
            hi={50}
            rowH={130}
            ref50={false}
            items={[
              { label: "OPENING", sub: "105 INNINGS · 12 HUNDREDS", value: 39.3, at: b.n39 - 4, color: AMBER },
              { label: "No.3 OR LOWER", sub: "18 INNINGS · 1 HUNDRED", value: 26.7, at: b.n27 - 4, color: C.creamDim },
            ]}
          />
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S6 — THE RENAISSANCE ================= */
const iLeeds = idxOf((x) => x.date >= "2025-06-20");
export const s6Beats = (fps: number) => {
  const s = [0, 1].map((i) => sentence(fps, "s6", i));
  return { top: s[0].from, since: s[1].from, n55: wordAt(fps, "s6", "55", 7.42) };
};

export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const c = theme.ease.out(interpolate(frame, [b.n55 - 20, b.n55 + 6], [0, 1], CLAMP));
  const hundreds = INN.filter((x) => x.i >= iLeeds && x.runs >= 100);
  return (
    <SceneShell push={0.015} shakeFrames={[b.n55 + 6]}>
      <Bar text="2025– · THE RENAISSANCE" color={AMBER} />
      <ChartPanel seed={601}>
        <Timeline w={CW} h={CH} gapAt={-30} bands={[{ from: iLeeds, to: INN.length - 1, color: AMBER, at: b.top + 6, label: "SINCE LEEDS" }]} dimOutside={{ from: iLeeds, to: INN.length - 1, color: AMBER, at: b.top + 6 }} />
      </ChartPanel>
      <Panel x={60} y={962} w={960} h={394} delay={b.since - 8} seed={602} glow={C.amberGlow} glowOn={c >= 1 ? 0.7 : 0}>
        <div style={{ position: "absolute", left: 50, top: 40, display: "flex", flexDirection: "column", gap: 6 }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
            AVERAGE SINCE LEEDS 2025
          </Lettering>
          <Plates text={(55.57 * c).toFixed(1).padStart(4, " ")} w={96} h={150} gap={8} color={AMBER} glow={C.amberGlow} />
        </div>
        <div style={{ position: "absolute", right: 50, top: 46, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 18 }}>
          <Lettering size={50} style={{ opacity: fade(frame, b.since + 20) }}>
            22 INNINGS
          </Lettering>
          <Lettering size={50} style={{ opacity: fade(frame, b.since + 34) }}>
            1,167 RUNS
          </Lettering>
          <div style={{ display: "flex", gap: 10, opacity: fade(frame, b.since + 48) }}>
            {hundreds.map((h, i) => (
              <Ball key={h.i} size={40} lit={frame >= b.since + 48 + i * 4 ? 1 : 0} />
            ))}
          </div>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.16em" style={{ opacity: fade(frame, b.since + 60) }}>
            5 HUNDREDS
          </Lettering>
        </div>
        <Foot>LEEDS 137 · LORD'S 100 · AHMEDABAD 100 · MULLANPUR 100 · WELLINGTON 136</Foot>
      </Panel>
    </SceneShell>
  );
};

/* ================= S7 — THE PARADOX ================= */
export const s7Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s7", i));
  return { part: s[0].from, home: wordAt(fps, "s7", "42", 2.66), away: wordAt(fps, "s7", "35", 4.4), yet: s[2].from, england: wordAt(fps, "s7", "england", 10.48) };
};

export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const cols = [
    { k: "HOME", avg: "42.0", n: 3, at: b.home - 4, sub: "40 INNINGS" },
    { k: "AWAY", avg: "35.5", n: 10, at: b.away - 4, sub: "83 INNINGS" },
  ];
  const tally = [
    { c: "ENGLAND", n: 4 },
    { c: "SOUTH AFRICA", n: 2 },
    { c: "AUSTRALIA", n: 1 },
    { c: "NEW ZEALAND", n: 1 },
    { c: "SRI LANKA", n: 1 },
    { c: "WEST INDIES", n: 1 },
  ];
  return (
    <SceneShell push={0.015}>
      <Bar text="THE PARADOX" color={AMBER} />
      <div style={{ position: "absolute", left: 60, top: 346, width: 960, display: "flex", gap: 16 }}>
        {cols.map((c, ci) => (
          <div key={c.k} style={{ position: "relative", width: 472, height: 560 }}>
            <Panel x={0} y={0} w={472} h={560} delay={c.at - 6} seed={701 + ci} glow={C.amberGlow} glowOn={ci === 1 && frame >= b.yet ? 0.7 : 0}>
              <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
                <Lettering size={64}>{c.k}</Lettering>
              </div>
              <div style={{ position: "absolute", top: 120, width: "100%", display: "flex", justifyContent: "center" }}>
                <Plates text={c.avg} w={80} h={124} gap={6} color={ci === 0 ? GREEN : C.cream} />
              </div>
              <div style={{ position: "absolute", top: 260, width: "100%", textAlign: "center" }}>
                <Lettering size={20} font="body" color={C.creamDim} spacing="0.18em">
                  AVERAGE · {c.sub}
                </Lettering>
              </div>
              <div style={{ position: "absolute", left: 40, right: 40, top: 320, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
                {Array.from({ length: c.n }).map((_, i) => {
                  const at = b.yet + 6 + (ci === 0 ? i * 4 : 14 + i * 3);
                  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
                  return (
                    <div key={i} style={{ transform: `scale(${interpolate(p, [0, 1], [0.3, 1])})`, opacity: interpolate(p, [0, 0.2], [0, 1], CLAMP) }}>
                      <Ball size={56} lit={1} />
                    </div>
                  );
                })}
              </div>
              <div style={{ position: "absolute", bottom: 26, width: "100%", textAlign: "center", opacity: fade(frame, b.yet + (ci === 0 ? 10 : 46)) }}>
                <Lettering size={48} color={ci === 1 ? AMBER : C.cream}>
                  {c.n} HUNDREDS
                </Lettering>
              </div>
            </Panel>
          </div>
        ))}
      </div>
      <Panel x={60} y={922} w={960} h={290} delay={b.england - 14} seed={703}>
        <div style={{ position: "absolute", top: 22, width: "100%", textAlign: "center" }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
            AWAY HUNDREDS, BY COUNTRY
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 50, right: 50, top: 70, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 40px" }}>
          {tally.map((t, i) => (
            <div key={t.c} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: fade(frame, b.england - 10 + i * 3) }}>
              <Lettering size={38} color={i === 0 ? AMBER : C.cream}>
                {t.c}
              </Lettering>
              <Lettering size={50} color={i === 0 ? AMBER : C.cream}>
                {String(t.n)}
              </Lettering>
            </div>
          ))}
        </div>
      </Panel>
      <Panel x={60} y={1228} w={960} h={128} delay={b.yet + 30} seed={704}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={44}>
            SAFER AT HOME. <span style={{ color: AMBER }}>BIGGER AWAY.</span>
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S8 — THE VERDICT ================= */
export const s8Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s8", i));
  return { runs: s[0].from, crash: wordAt(fps, "s8", "crashes", 3.92), best: s[1].from, now: wordAt(fps, "s8", "now", 10.76), brand: s[2].from - 8 };
};

export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  const runs = useFlip(b.runs, 3);
  const brand = spring({ frame: frame - b.brand, fps, config: theme.spring.heavy });
  return (
    <SceneShell push={0} pull={0.03} turnOut={false}>
      <Bar text="KL RAHUL · TESTS" />
      <Panel x={60} y={346} w={960} h={400} delay={b.runs - 8} seed={801} glow={C.amberGlow} glowOn={0.4}>
        <div style={{ position: "absolute", top: 34, width: "100%", display: "flex", justifyContent: "center" }}>
          <Plates text="4,424" prev="     " progress={runs} w={104} h={160} gap={10} color={AMBER} glow={C.amberGlow} />
        </div>
        <div style={{ position: "absolute", top: 220, width: "100%", textAlign: "center" }}>
          <Lettering size={40} color={C.creamDim}>
            RUNS · 13 HUNDREDS · AVERAGE 37.49
          </Lettering>
        </div>
        <div style={{ position: "absolute", bottom: 30, width: "100%", textAlign: "center", opacity: fade(frame, b.crash - 4) }}>
          <Lettering size={52}>
            <span style={{ color: RED }}>CRASHES</span> & <span style={{ color: GREEN }}>COMEBACKS</span>
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={762} w={960} h={190} delay={b.best - 6} seed={802}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Lettering size={30} font="body" color={C.creamDim} spacing="0.2em">
            AGE 34 · AVERAGING 55.6 SINCE 2025
          </Lettering>
          <Lettering size={58} color={AMBER} style={{ opacity: fade(frame, b.now - 10) }}>
            THE BEST VERSION, RIGHT NOW?
          </Lettering>
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 60, top: 970, width: 960, opacity: interpolate(brand, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(brand, [0, 1], [0.94, 1])})` }}>
        <Panel x={0} y={0} w={960} h={300} delay={b.brand} seed={803}>
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
        <Lettering size={16} font="body" weight={500} color={C.creamDim} spacing="0.08em">
          TESTS TO 21 NOV 2026, INCLUDING WELLINGTON 1ST INNINGS · CRICSHEET BALL-BY-BALL DATA + SCORECARDS FOR THE TWO AFGHANISTAN TESTS
        </Lettering>
      </div>
    </SceneShell>
  );
};
