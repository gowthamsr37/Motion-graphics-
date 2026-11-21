// KL Rahul in Tests: highs, lows and everything in between. Eight scenes timed to the narration.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Ball, Callout, EraBars, EraDots, idxOf, INN, Timeline } from "../components/Career";
import deep from "../data/deep.json";
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

/* ================= S7 — WHAT CHANGED ================= */
export const s7Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s7", i));
  return { q: s[0].from, sr: s[1].from, n57: wordAt(fps, "s7", "57", 5.72), n50: wordAt(fps, "s7", "50", 6.66), longer: s[2].from, n41: wordAt(fps, "s7", "41", 9.98), n112: wordAt(fps, "s7", "112", 12.84) };
};
const eraVals = (k: "sr" | "bpd") => ["2014-17", "2018-19", "2021-24", "2025-26"].map((e) => (deep.eras as Record<string, { sr: number; bpd: number }>)[e][k]);

export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const srAt = [b.n57 - 10, b.n57 - 4, b.n50 - 8, b.n50 - 2];
  const bpdAt = [b.longer + 6, b.n41 - 4, b.n41 + 8, b.n112 - 4];
  return (
    <SceneShell push={0.015} shakeFrames={[b.n112 + 10]}>
      <Bar text="SO WHAT CHANGED?" color={AMBER} />
      <Panel x={60} y={346} w={960} h={470} delay={b.sr - 8} seed={701}>
        <div style={{ position: "absolute", left: 50, top: 26 }}>
          <EraBars w={860} h={410} values={eraVals("sr")} max={70} at={srAt} colors={[C.creamDim, C.creamDim, C.creamDim, C.cream]} title="STRIKE RATE · RUNS PER 100 BALLS" />
        </div>
        <div style={{ position: "absolute", right: 40, top: 22, opacity: fade(frame, b.n50 + 10) }}>
          <Lettering size={30} color={C.creamDim}>
            BARELY MOVED
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={832} w={960} h={524} delay={b.longer - 8} seed={702} glow={C.amberGlow} glowOn={frame >= b.n112 ? 0.7 : 0}>
        <div style={{ position: "absolute", left: 50, top: 26 }}>
          <EraBars w={860} h={460} values={eraVals("bpd")} max={120} at={bpdAt} colors={[C.cream, RED, C.cream, AMBER]} fmt={(v) => String(Math.round(v))} title="BALLS FACED PER DISMISSAL" />
        </div>
        <div style={{ position: "absolute", right: 40, top: 22, opacity: fade(frame, b.n112 + 10) }}>
          <Lettering size={34} color={AMBER}>
            STAYING LONGER
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S8 — THE FIRST 20 BALLS ================= */
export const s8Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s8", i));
  return { start: s[0].from, until: s[1].from, balls: wordAt(fps, "s8", "balls", 7.4), since: s[2].from, once: wordAt(fps, "s8", "once", 10.08) };
};

export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  const dots = deep.dots as Record<string, boolean[]>;
  const rows = ["2014-17", "2018-19", "2021-24", "2025-26"].map((k) => dots[k]);
  return (
    <SceneShell push={0.015}>
      <Bar text="THE FIRST 20 BALLS" color={RED} />
      <Panel x={60} y={346} w={960} h={700} delay={b.start - 6} seed={801}>
        <div style={{ position: "absolute", top: 26, width: "100%", textAlign: "center" }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.16em">
            ONE DOT PER INNINGS · <span style={{ color: RED }}>RED = OUT INSIDE HIS FIRST 20 BALLS</span>
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 40, top: 100 }}>
          <EraDots w={880} rows={rows} at={[b.until, b.until + 24, b.balls + 10, b.since]} />
        </div>
      </Panel>
      <Panel x={60} y={1062} w={960} h={294} delay={b.balls - 10} seed={802} glow={C.greenGlow} glowOn={frame >= b.once ? 0.6 : 0}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: fade(frame, b.balls - 4) }}>
            <Lettering size={110} color={RED}>
              2 IN 5
            </Lettering>
            <Lettering size={22} font="body" color={C.creamDim} spacing="0.14em">
              UNTIL 2019 · 23 OF 60 INNINGS
            </Lettering>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: fade(frame, b.once - 4) }}>
            <Lettering size={110} color={GREEN}>
              1 IN 22
            </Lettering>
            <Lettering size={22} font="body" color={C.creamDim} spacing="0.14em">
              SINCE LEEDS 2025
            </Lettering>
          </div>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S9 — THE NEW BALL ================= */
export const s9Beats = (fps: number) => {
  const s = [0, 1].map((i) => sentence(fps, "s9", i));
  return { nb: s[0].from, first: s[1].from, n25: wordAt(fps, "s9", "25", 6.0), n58: wordAt(fps, "s9", "58", 8.5) };
};

export const S9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s9Beats(fps);
  const nb = deep.newball as Record<string, { avg: number }>;
  const vals = ["2014-17", "2018-19", "2021-24", "2025-26"].map((k) => nb[k].avg);
  return (
    <SceneShell push={0.015} shakeFrames={[b.n58]}>
      <Bar text="THE NEW BALL" />
      <Panel x={60} y={346} w={960} h={740} delay={b.nb - 6} seed={901} glow={C.amberGlow} glowOn={frame >= b.n58 ? 0.7 : 0}>
        <div style={{ position: "absolute", left: 50, top: 30 }}>
          <EraBars w={860} h={660} values={vals} max={65} at={[b.first, b.n25 - 14, b.n25 - 6, b.n58 - 6]} colors={[C.cream, RED, RED, AMBER]} title="AVERAGE IN THE FIRST 20 OVERS · AS OPENER" />
        </div>
      </Panel>
      <Panel x={60} y={1102} w={960} h={254} delay={b.n25 - 10} seed={902}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: fade(frame, b.n25 - 6) }}>
            <Lettering size={90} color={RED}>
              24.6
            </Lettering>
            <Lettering size={20} font="body" color={C.creamDim} spacing="0.14em">
              2018–2024
            </Lettering>
          </div>
          <Lettering size={70} color={C.creamDim} style={{ opacity: fade(frame, b.n58 - 8) }}>
            →
          </Lettering>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: fade(frame, b.n58 - 4) }}>
            <Lettering size={90} color={AMBER}>
              57.8
            </Lettering>
            <Lettering size={20} font="body" color={C.creamDim} spacing="0.14em">
              SINCE LEEDS · 8 DISMISSALS IN 981 BALLS
            </Lettering>
          </div>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S10 — THE PARADOX ================= */
export const s10Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s10", i));
  return { part: s[0].from, home: wordAt(fps, "s10", "42", 2.32), away: wordAt(fps, "s10", "35", 4.16), yet: wordAt(fps, "s10", "yet", 6.14), conv: s[2].from, h3: wordAt(fps, "s10", "three", 11.48), a10: wordAt(fps, "s10", "away", 15.14, 2) };
};

export const S10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s10Beats(fps);
  const cols = [
    { k: "HOME", avg: "42.0", n: 3, f: 14, at: b.home - 4, convAt: b.h3 - 2, color: C.creamDim },
    { k: "AWAY", avg: "35.5", n: 10, f: 20, at: b.away - 4, convAt: b.a10 - 2, color: AMBER },
  ];
  return (
    <SceneShell push={0.015}>
      <Bar text="THE PARADOX" color={AMBER} />
      <div style={{ position: "absolute", left: 60, top: 346, width: 960, display: "flex", gap: 16 }}>
        {cols.map((c, ci) => (
          <div key={c.k} style={{ position: "relative", width: 472, height: 470 }}>
            <Panel x={0} y={0} w={472} h={470} delay={c.at - 6} seed={1001 + ci} glow={C.amberGlow} glowOn={ci === 1 && frame >= b.yet ? 0.6 : 0}>
              <div style={{ position: "absolute", top: 26, width: "100%", textAlign: "center" }}>
                <Lettering size={60}>{c.k}</Lettering>
              </div>
              <div style={{ position: "absolute", top: 106, width: "100%", display: "flex", justifyContent: "center" }}>
                <Plates text={c.avg} w={72} h={110} gap={6} color={ci === 0 ? GREEN : C.cream} />
              </div>
              <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center" }}>
                <Lettering size={20} font="body" color={C.creamDim} spacing="0.18em">
                  AVERAGE
                </Lettering>
              </div>
              <div style={{ position: "absolute", left: 30, right: 30, top: 280, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
                {Array.from({ length: c.n }).map((_, i) => {
                  const at = b.yet + 4 + (ci === 0 ? i * 4 : 14 + i * 3);
                  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
                  return (
                    <div key={i} style={{ transform: `scale(${interpolate(p, [0, 1], [0.3, 1])})`, opacity: interpolate(p, [0, 0.2], [0, 1], CLAMP) }}>
                      <Ball size={48} lit={1} />
                    </div>
                  );
                })}
              </div>
              <div style={{ position: "absolute", bottom: 22, width: "100%", textAlign: "center", opacity: fade(frame, b.yet + (ci === 0 ? 8 : 40)) }}>
                <Lettering size={44} color={ci === 1 ? AMBER : C.cream}>
                  {c.n} HUNDREDS
                </Lettering>
              </div>
            </Panel>
          </div>
        ))}
      </div>
      <Panel x={60} y={832} w={960} h={524} delay={b.conv - 8} seed={1003} glow={C.amberGlow} glowOn={frame >= b.a10 ? 0.6 : 0}>
        <div style={{ position: "absolute", top: 24, width: "100%", textAlign: "center" }}>
          <Lettering size={40} color={AMBER}>
            CONVERSION
          </Lettering>
          <div style={{ marginTop: 8 }}>
            <Lettering size={18} font="body" color={C.creamDim} spacing="0.16em">
              FIFTY-PLUS SCORES THAT BECAME HUNDREDS
            </Lettering>
          </div>
        </div>
        <div style={{ position: "absolute", left: 50, right: 50, top: 130, display: "flex", flexDirection: "column", gap: 40 }}>
          {cols.map((c) => {
            const p = theme.ease.out(interpolate(frame, [c.convAt, c.convAt + 18], [0, 1], CLAMP));
            return (
              <div key={c.k} style={{ display: "flex", flexDirection: "column", gap: 10, opacity: fade(frame, c.convAt - 4) }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Lettering size={44}>{c.k}</Lettering>
                  <Lettering size={50} color={c.color}>
                    {c.n} OF {c.f} · {Math.round((100 * c.n) / c.f)}%
                  </Lettering>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {Array.from({ length: c.f }).map((_, i) => (
                    <div key={i} style={{ flex: 1, height: 34, borderRadius: 4, background: i < c.n && i < c.f * p ? c.color : i < c.f * p ? C.plateHi : "rgba(255,255,255,0.04)", boxShadow: `inset 0 0 0 1px ${C.panelEdge}` }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S11 — FIRST INNINGS MAN ================= */
export const s11Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s11", i));
  return { more: s[0].from, first: s[1].from, n43: wordAt(fps, "s11", "43", 4.4), n11: wordAt(fps, "s11", "11", 5.92), second: s[2].from, n29: wordAt(fps, "s11", "29", 9.04) };
};

export const S11: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s11Beats(fps);
  const sides = [
    { k: "INDIA'S FIRST INNINGS", sub: "70 INNINGS · 3,031 RUNS", avg: "43.3", n: 11, at: b.n43 - 6, ballsAt: b.n11 - 2, color: AMBER },
    { k: "INDIA'S SECOND INNINGS", sub: "53 INNINGS · 1,393 RUNS", avg: "29.0", n: 2, at: b.n29 - 6, ballsAt: b.n29 + 4, color: C.creamDim },
  ];
  return (
    <SceneShell push={0.015}>
      <Bar text="ONE MORE PATTERN" />
      {sides.map((s, i) => (
        <Panel key={s.k} x={60} y={346 + i * 512} w={960} h={496} delay={s.at - 6} seed={1101 + i} glow={C.amberGlow} glowOn={i === 0 && frame >= b.n11 ? 0.5 : 0}>
          <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
            <Lettering size={52}>{s.k}</Lettering>
            <div style={{ marginTop: 6 }}>
              <Lettering size={18} font="body" color={C.creamDim} spacing="0.16em">
                {s.sub}
              </Lettering>
            </div>
          </div>
          <div style={{ position: "absolute", top: 140, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
            <Plates text={s.avg} w={86} h={132} gap={8} color={s.color} glow={i === 0 ? C.amberGlow : undefined} />
            <Lettering size={30} color={C.creamDim}>
              AVERAGE
            </Lettering>
          </div>
          <div style={{ position: "absolute", left: 60, right: 60, top: 320, display: "flex", justifyContent: "center", gap: 8 }}>
            {Array.from({ length: s.n }).map((_, k) => (
              <div key={k} style={{ opacity: fade(frame, s.ballsAt + k * 3, 4) }}>
                <Ball size={52} lit={1} />
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", bottom: 26, width: "100%", textAlign: "center", opacity: fade(frame, s.ballsAt + s.n * 3) }}>
            <Lettering size={40} color={s.color}>
              {s.n} OF HIS 13 HUNDREDS
            </Lettering>
          </div>
        </Panel>
      ))}
    </SceneShell>
  );
};

/* ================= S12 — THE VERDICT ================= */
export const s12Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s12", i));
  return { runs: s[0].from, crash: wordAt(fps, "s12", "crashes", 3.92), best: s[1].from, now: wordAt(fps, "s12", "now", 10.76), brand: s[2].from - 8 };
};

export const S12: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s12Beats(fps);
  const runs = useFlip(b.runs, 3);
  const brand = spring({ frame: frame - b.brand, fps, config: theme.spring.heavy });
  return (
    <SceneShell push={0} pull={0.03} turnOut={false}>
      <Bar text="KL RAHUL · TESTS" />
      <Panel x={60} y={346} w={960} h={400} delay={b.runs - 8} seed={1201} glow={C.amberGlow} glowOn={0.4}>
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
      <Panel x={60} y={762} w={960} h={190} delay={b.best - 6} seed={1202}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Lettering size={26} font="body" color={C.creamDim} spacing="0.16em">
            AGE 34 · SINCE LEEDS: AVG 55.6 · 112 BALLS PER DISMISSAL
          </Lettering>
          <Lettering size={58} color={AMBER} style={{ opacity: fade(frame, b.now - 10) }}>
            THE BEST VERSION, RIGHT NOW?
          </Lettering>
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 60, top: 970, width: 960, opacity: interpolate(brand, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(brand, [0, 1], [0.94, 1])})` }}>
        <Panel x={0} y={0} w={960} h={300} delay={b.brand} seed={1203}>
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
          TESTS TO 21 NOV 2026, INCLUDING WELLINGTON 1ST INNINGS · CRICSHEET BALL-BY-BALL DATA + SCORECARDS FOR THE AFGHANISTAN TESTS · NEW-BALL FIGURES USE BALL-BY-BALL INNINGS ONLY
        </Lettering>
      </div>
    </SceneShell>
  );
};
