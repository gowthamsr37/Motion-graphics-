// Myth Busters #01 — does winning the toss win matches? Ten scenes timed to the narration.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "../components/Motion";
import { Lamp, Lettering, Panel } from "../components/Panel";
import { SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { AMBER, Beam, Coin, Dew, DEW, Funnel, GREEN, HBars, Hundred, Pitch, RED, Slope, Stamp, Tiles, VBars, ZoneRow } from "../components/Toss";
import { theme } from "../theme";
import { sentence, voStart, wordAt } from "../timing";
import { Reveal, useAt } from "./common";

const C = theme.colors;
const fmt = (n: number) => n.toLocaleString("en-US");

const Bar: React.FC<{ text: string; delay?: number; color?: string; coin?: boolean }> = ({ text, delay = 0, color = C.cream, coin = false }) => {
  const frame = useCurrentFrame();
  return (
    <Panel x={60} y={226} w={960} h={104} delay={delay} seed={60}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
        {coin && <Coin size={64} angle={frame * 0.32} />}
        <Lettering size={58} color={color}>
          {text}
        </Lettering>
      </div>
    </Panel>
  );
};

const Foot: React.FC<{ children: React.ReactNode; bottom?: number; color?: string; on?: number }> = ({ children, bottom = 18, color = C.creamDim, on = 1 }) => (
  <div style={{ position: "absolute", left: 30, right: 30, bottom, textAlign: "center", opacity: on }}>
    <Lettering size={16} font="body" weight={500} color={color} spacing="0.1em">
      {children}
    </Lettering>
  </div>
);

const fade = (frame: number, at: number, len = 10) => interpolate(frame, [at, at + len], [0, 1], CLAMP);

/* ================= S1 — THE HOOK ================= */
export const s1Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s1", i));
  return { toss: voStart(fps, "s1") + 2, land: voStart(fps, "s1") + 44, captains: s[1].from, title: s[2].from, actually: wordAt(fps, "s1", "actually", 5.36) };
};

export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  // the toss: up, spinning, and down onto the board
  const u = interpolate(frame, [b.toss, b.land], [0, 1], CLAMP);
  const lift = 4 * u * (1 - u);
  const settle = spring({ frame: frame - b.land, fps, config: { damping: 9, stiffness: 200, mass: 0.6 } });
  const bounce = frame >= b.land ? (1 - settle) * 30 : 0;
  const angle = frame < b.land ? theme.ease.out(u) * Math.PI * 9 + Math.PI : Math.PI * 10 + Math.sin(frame / 18) * 0.12;
  const y = 520 - lift * 300 - bounce;
  const glow = frame >= b.land ? 0.6 + 0.3 * Math.sin(frame / 10) : 0;
  const toss = useAt(b.captains, theme.spring.flip);
  const q = interpolate(frame, [b.title, b.title + 8], [0, 1], CLAMP);
  return (
    <SceneShell push={0.03} turnIn={false}>
      {/* shadow on the board */}
      <div style={{ position: "absolute", left: 540 - 170 * (1 - lift * 0.5), top: 845, width: 340 * (1 - lift * 0.5), height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.55)", filter: "blur(10px)", opacity: 0.8 - lift * 0.4 }} />
      <div style={{ position: "absolute", left: 540 - 170, top: y }}>
        <Coin size={340} angle={angle} glow={glow} />
      </div>
      <Panel x={60} y={900} w={960} h={190} delay={b.captains - 6} seed={101} glow={C.greenGlow} glowOn={toss * 0.7}>
        <div style={{ position: "absolute", left: 50, right: 50, top: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Lettering size={60}>TOSS</Lettering>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Lamp color={GREEN} glow={C.greenGlow} on={toss} size={34} />
            <Lettering size={60} color={GREEN}>
              WON
            </Lettering>
          </div>
        </div>
        <div style={{ position: "absolute", left: 40, right: 40, top: 116, height: 2, background: C.panelEdge }} />
        <div style={{ position: "absolute", left: 50, right: 50, top: 126, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: q }}>
          <Lettering size={46} color={C.creamDim}>
            MATCH
          </Lettering>
          <Lettering size={52} color={AMBER}>
            WON?
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={1106} w={960} h={244} delay={b.title - 4} seed={102} glow={C.amberGlow} glowOn={0.45}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Lettering size={26} font="body" color={AMBER} spacing="0.34em">
            MYTH BUSTERS · #01
          </Lettering>
          <Lettering size={92}>“WIN THE TOSS, WIN THE MATCH”</Lettering>
          <Lettering size={30} font="body" color={C.creamDim} spacing="0.2em" style={{ opacity: fade(frame, b.actually) }}>
            TRUE… OR MYTH?
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S2 — THE EVIDENCE ================= */
export const s2Beats = (fps: number) => ({
  count: wordAt(fps, "s2", "8", 0.26),
  mens: wordAt(fps, "s2", "men", 2.28),
  format: wordAt(fps, "s2", "format", 4.42),
});

const FORMATS = [
  { k: "TESTS", n: 899, from: "SINCE 2002" },
  { k: "ODIs", n: 2617, from: "SINCE 2002" },
  { k: "T20Is", n: 3649, from: "SINCE 2005" },
  { k: "IPL", n: 1243, from: "SINCE 2008" },
];

export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const c = theme.ease.out(interpolate(frame, [b.count - 4, b.count + 48], [0, 1], CLAMP));
  const n = Math.round(8408 * c);
  return (
    <SceneShell push={0.03}>
      <Panel x={60} y={226} w={960} h={470} delay={-10} seed={201} glow={C.amberGlow} glowOn={c >= 1 ? 0.6 : 0}>
        <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center" }}>
          <Lettering size={30} font="body" color={C.creamDim} spacing="0.3em">
            WE CHECKED
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 110, width: "100%", display: "flex", justifyContent: "center" }}>
          <Plates text={fmt(n).padStart(5, " ")} w={130} h={190} gap={12} color={c >= 1 ? AMBER : C.cream} glow={c >= 1 ? C.amberGlow : undefined} blur={c > 0 && c < 0.9 ? 1.2 : 0} />
        </div>
        <div style={{ position: "absolute", top: 340, width: "100%", textAlign: "center" }}>
          <Lettering size={64}>MEN'S MATCHES</Lettering>
        </div>
      </Panel>
      <Panel x={60} y={712} w={960} h={470} delay={b.mens - 8} seed={202}>
        <div style={{ position: "absolute", left: 50, right: 50, top: 36, display: "flex", flexDirection: "column", gap: 26 }}>
          {FORMATS.map((f, i) => {
            const at = b.mens + i * Math.round((b.format - b.mens) / 4);
            const g = spring({ frame: frame - at, fps, config: theme.spring.snappy });
            return (
              <div key={f.k} style={{ display: "flex", alignItems: "center", gap: 24, opacity: interpolate(g, [0, 0.3], [0, 1], CLAMP) }}>
                <div style={{ width: 170 }}>
                  <Lettering size={56}>{f.k}</Lettering>
                </div>
                <div style={{ flex: 1, height: 40, borderRadius: 6, background: C.plate, overflow: "hidden" }}>
                  <div style={{ width: `${(f.n / 3649) * 100 * Math.min(1, g)}%`, height: "100%", background: `linear-gradient(90deg, ${C.trimGreen}, ${GREEN})` }} />
                </div>
                <div style={{ width: 150, textAlign: "right" }}>
                  <Lettering size={52} color={C.cream}>
                    {fmt(f.n)}
                  </Lettering>
                </div>
              </div>
            );
          })}
        </div>
        <Foot bottom={22}>TESTS & ODIs SINCE 2002 · T20 INTERNATIONALS SINCE 2005 · EVERY IPL SEASON SINCE 2008</Foot>
      </Panel>
      <Panel x={60} y={1198} w={960} h={152} delay={b.format - 4} seed={203}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Lettering size={22} font="body" color={C.cream} spacing="0.16em">
            DATA: CRICSHEET.ORG · OPEN DATA, BALL BY BALL · TO NOV 2026
          </Lettering>
          <Lettering size={16} font="body" weight={500} color={C.creamDim} spacing="0.1em">
            CRICSHEET WITHHOLDS MATCHES INVOLVING AFGHANISTAN'S MEN, SO THEY AREN'T IN THESE TOTALS
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S3 — WHAT LUCK LOOKS LIKE ================= */
export const s3Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s3", i));
  return { flip: wordAt(fps, "s3", "flip", 2.5), band: wordAt(fps, "s3", "48", 7.18), zone: wordAt(fps, "s3", "zone", 10.42), inside: wordAt(fps, "s3", "inside", 11.56), s0: s[0].from };
};

export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  return (
    <SceneShell push={0.025}>
      <Bar text="WHAT DOES PURE LUCK LOOK LIKE?" delay={-10} coin />
      <Panel x={60} y={346} w={960} h={850} delay={b.flip - 12} seed={301}>
        <div style={{ position: "absolute", left: 20, top: 40 }}>
          <Funnel w={920} h={780} drawAt={b.flip} drawLen={b.band - b.flip - 4} bandAt={b.band} zoneAt={b.zone} />
        </div>
      </Panel>
      <Panel x={60} y={1212} w={960} h={138} delay={b.inside - 6} seed={302} glow={C.greenGlow} glowOn={0.5}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <Lettering size={52} color={GREEN}>
            INSIDE THE ZONE
          </Lettering>
          <Lettering size={52} color={C.creamDim}>
            =
          </Lettering>
          <Lettering size={52}>THE TOSS MEANS NOTHING</Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S4 — THE RESULTS ================= */
export const s4Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4].map((i) => sentence(fps, "s4", i));
  return {
    odi: s[0].from,
    n: wordAt(fps, "s4", "2", 1.92),
    won: s[1].from,
    w: wordAt(fps, "s4", "244", 6.76),
    fifty: wordAt(fps, "s4", "50", 9.52),
    exactly: wordAt(fps, "s4", "exactly", 12.76),
    t20: wordAt(fps, "s4", "t20", 14.32),
    t20v: wordAt(fps, "s4", "50", 15.56, 1),
    ipl: wordAt(fps, "s4", "ipl", 17.28),
    iplv: wordAt(fps, "s4", "51", 18.02),
    all: wordAt(fps, "s4", "all", 20.12),
    except: wordAt(fps, "s4", "except", 21.6),
  };
};

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const cN = theme.ease.out(interpolate(frame, [b.n - 4, b.n + 36], [0, 1], CLAMP));
  const cW = theme.ease.out(interpolate(frame, [b.won + 4, b.w + 8], [0, 1], CLAMP));
  const pct = useAt(b.fifty, theme.spring.flip);
  return (
    <SceneShell push={0.02}>
      <Panel x={60} y={226} w={960} h={420} delay={-10} seed={401} glow={C.amberGlow} glowOn={frame >= b.exactly ? 0.7 : 0}>
        <div style={{ position: "absolute", left: 44, right: 44, top: 34, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Lettering size={76} color={AMBER}>
              ODIs
            </Lettering>
            <Lettering size={20} font="body" color={C.creamDim} spacing="0.16em">
              DECIDED MATCHES
            </Lettering>
          </div>
          <Plates text={fmt(Math.round(2487 * cN)).padStart(5, " ")} w={84} h={120} gap={8} blur={cN > 0 && cN < 0.9 ? 1 : 0} />
        </div>
        <div style={{ position: "absolute", left: 40, right: 40, top: 180, height: 2, background: C.panelEdge }} />
        <div style={{ position: "absolute", left: 44, right: 44, top: 200, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: fade(frame, b.won - 4) }}>
          <Lettering size={50}>TOSS WINNERS WON</Lettering>
          <Plates text={fmt(Math.round(1244 * cW)).padStart(5, " ")} w={84} h={120} gap={8} color={GREEN} blur={cW > 0 && cW < 0.9 ? 1 : 0} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 336, display: "flex", justifyContent: "center", alignItems: "center", gap: 30, opacity: interpolate(pct, [0, 0.4], [0, 1], CLAMP) }}>
          <Lettering size={62} color={C.cream}>
            = 50.0%
          </Lettering>
          <div style={{ marginTop: -10 }}>{frame >= b.exactly && <Stamp text="EXACTLY HALF" at={b.exactly} color={AMBER} size={50} rotate={-4} />}</div>
        </div>
      </Panel>
      <Panel x={60} y={662} w={960} h={688} delay={b.n} seed={402}>
        <div style={{ position: "absolute", left: 0, top: 14, display: "flex", flexDirection: "column" }}>
          <ZoneRow w={960} label="ODI" sub="2,487 DECIDED" band={[48.0, 52.0]} value={50.0} at={b.fifty} glowAt={b.all} />
          <Reveal at={b.t20 - 4} x={0} y={16}>
            <ZoneRow w={960} label="T20I" sub="3,530 DECIDED" band={[48.4, 51.6]} value={50.5} at={b.t20v} glowAt={b.all + 4} />
          </Reveal>
          <Reveal at={b.ipl - 4} x={0} y={16}>
            <ZoneRow w={960} label="IPL" sub="1,218 DECIDED" band={[47.2, 52.8]} value={51.6} at={b.iplv} glowAt={b.all + 8} />
          </Reveal>
          <Reveal at={b.except - 2} x={0} y={16}>
            <ZoneRow w={960} label="TEST" sub="730 DECIDED" band={[46.4, 53.6]} value={54.2} at={b.except} hidden />
          </Reveal>
        </div>
        <Foot bottom={16}>GREEN = WHERE A FAIR COIN LANDS 95% OF THE TIME OVER THE SAME NUMBER OF MATCHES · DECIDED = HAD A WINNER</Foot>
      </Panel>
    </SceneShell>
  );
};

/* ================= S5 — THE "TOSS WORLD CUP" ================= */
export const s5Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4].map((i) => sentence(fps, "s5", i));
  return {
    wc: s[1].from,
    dubai: wordAt(fps, "s5", "dubai", 5.86),
    twelve: wordAt(fps, "s5", "12", 8.04),
    thirteen: wordAt(fps, "s5", "13", 8.66),
    dew: s[3].from,
    chose: wordAt(fps, "s5", "chose", 13.08),
    they: s[4].from,
    thirty: wordAt(fps, "s5", "30", 14.92),
    final: wordAt(fps, "s5", "final", 17.96),
  };
};

export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const per = Math.max(4, Math.round((b.thirteen - b.dubai) / 12));
  const dew = interpolate(frame, [b.dew, b.dew + 40], [0, 1], CLAMP);
  const c30 = theme.ease.out(interpolate(frame, [b.thirty - 4, b.thirty + 20], [0, 1], CLAMP));
  return (
    <SceneShell push={0.02}>
      <Bar text="THE “TOSS WORLD CUP”" delay={-10} color={AMBER} />
      <Panel x={60} y={346} w={960} h={520} delay={b.wc - 8} seed={501}>
        <div style={{ position: "absolute", top: 26, width: "100%", textAlign: "center" }}>
          <Lettering size={44}>T20 WORLD CUP 2021 · EVERY GAME IN DUBAI</Lettering>
        </div>
        <div style={{ position: "absolute", left: 31, top: 92 }}>
          <Tiles at={b.dubai} per={per} />
        </div>
        <div style={{ position: "absolute", bottom: 24, width: "100%", textAlign: "center", opacity: fade(frame, b.twelve) }}>
          <Lettering size={50} color={GREEN}>
            TEAM BATTING SECOND WON 12 OF 13
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={882} w={960} h={196} delay={b.dew - 8} seed={502} glow="rgba(156,201,227,0.4)" glowOn={dew * 0.6}>
        <Dew on={dew} w={960} h={196} />
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <Lettering size={50} color={DEW}>
            EVENING DEW → WET BALL → HARD TO GRIP
          </Lettering>
          <Lettering size={30} font="body" color={C.cream} spacing="0.14em" style={{ opacity: fade(frame, b.chose) }}>
            SO TOSS WINNERS CHOSE TO BOWL FIRST
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={1094} w={960} h={256} delay={b.they - 8} seed={503} glow={C.amberGlow} glowOn={c30 >= 1 ? 0.6 : 0}>
        <div style={{ position: "absolute", left: 40, top: 26, display: "flex", flexDirection: "column", gap: 10 }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.18em">
            WHOLE TOURNAMENT · TOSS WINNERS WON
          </Lettering>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
            <Plates text={String(Math.round(30 * c30)).padStart(2, " ")} w={96} h={138} gap={8} color={AMBER} glow={c30 >= 1 ? C.amberGlow : undefined} />
            <Lettering size={66} color={C.creamDim} style={{ marginBottom: 14 }}>
              / 45
            </Lettering>
          </div>
        </div>
        <div style={{ position: "absolute", right: 40, top: 40, width: 400, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, opacity: fade(frame, b.final - 4) }}>
          <Lettering size={22} font="body" color={AMBER} spacing="0.2em">
            THE FINAL
          </Lettering>
          <Lettering size={40}>AUSTRALIA WON THE TOSS</Lettering>
          <Lettering size={40} color={C.creamDim}>
            BOWLED FIRST → CHAMPIONS
          </Lettering>
        </div>
        <Foot bottom={12}>ALL 45 RESULTS, INCLUDING AFGHANISTAN'S FIVE GAMES FROM OFFICIAL SCORECARDS</Foot>
      </Panel>
    </SceneShell>
  );
};

/* ================= S6 — WHAT NOBODY REMEMBERS ================= */
export const s6Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s6", i));
  return {
    s1: s[1].from,
    y22: wordAt(fps, "s6", "39", 3.88),
    y24: wordAt(fps, "s6", "56", 4.92),
    y26: wordAt(fps, "s6", "43", 5.64),
    dubai: s[2].from,
    v: wordAt(fps, "s6", "50", 10.14),
    place: wordAt(fps, "s6", "place", 12.12),
    season: wordAt(fps, "s6", "season", 13.0),
    cond: wordAt(fps, "s6", "conditions", 14.26),
  };
};

export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const v = useAt(b.v, theme.spring.flip);
  const words = [
    { t: "ONE PLACE", at: b.place - 6 },
    { t: "ONE SEASON", at: b.season - 6 },
    { t: "ONE SET OF CONDITIONS", at: b.cond - 8 },
  ];
  return (
    <SceneShell push={0.02}>
      <Bar text="WHAT NOBODY REMEMBERS" delay={-10} />
      <Panel x={60} y={346} w={960} h={652} delay={-6} seed={601}>
        <div style={{ position: "absolute", top: 24, width: "100%", textAlign: "center" }}>
          <Lettering size={26} font="body" color={C.creamDim} spacing="0.2em">
            T20 WORLD CUPS · HOW OFTEN THE TOSS WINNER WON
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 20, top: 40 }}>
          <VBars
            w={920}
            h={570}
            lineAt={4}
            items={[
              { label: "2021", sub: "30 OF 45", value: (100 * 30) / 45, at: 2, color: AMBER },
              { label: "2022", sub: "15 OF 38*", value: (100 * 15) / 38, at: b.y22 - 4, color: C.cream },
              { label: "2024", sub: "23 OF 41*", value: (100 * 23) / 41, at: b.y24 - 4, color: C.cream },
              { label: "2026", sub: "21 OF 49*", value: (100 * 21) / 49, at: b.y26 - 4, color: C.cream },
            ]}
          />
        </div>
        <Foot bottom={12}>*CRICSHEET DATA: AFGHANISTAN'S GAMES ARE WITHHELD · DECIDED MATCHES ONLY</Foot>
      </Panel>
      <Panel x={60} y={1014} w={960} h={180} delay={b.dubai - 6} seed={602}>
        <div style={{ position: "absolute", left: 44, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
          <Lettering size={46}>DUBAI · EVERY OTHER T20I</Lettering>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.14em">
            TOSS WINNER WON 63 OF 124*
          </Lettering>
        </div>
        <div style={{ position: "absolute", right: 44, top: 0, bottom: 0, display: "flex", alignItems: "center", opacity: interpolate(v, [0, 0.4], [0, 1], CLAMP), transform: `scale(${interpolate(v, [0, 1], [1.3, 1])})` }}>
          <Lettering size={110} color={GREEN} style={{ textShadow: `0 0 24px ${C.greenGlow}` }}>
            50.8%
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={1210} w={960} h={140} delay={b.place - 10} seed={603}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
          {words.map((w, i) => (
            <React.Fragment key={w.t}>
              {i > 0 && (
                <Lettering size={40} color={C.creamDim} style={{ opacity: fade(frame, w.at) }}>
                  ·
                </Lettering>
              )}
              <Lettering size={i === 2 ? 46 : 46} color={i === 2 ? AMBER : C.cream} style={{ opacity: fade(frame, w.at, 6) }}>
                {w.t}
              </Lettering>
            </React.Fragment>
          ))}
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S7 — "TOSS GROUNDS" ================= */
export const s7Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4, 5].map((i) => sentence(fps, "s7", i));
  return {
    split: s[1].from,
    halves: wordAt(fps, "s7", "halves", 4.82),
    where: s[2].from,
    first: wordAt(fps, "s7", "first", 7.34),
    a: wordAt(fps, "s7", "64", 9.36),
    second: wordAt(fps, "s7", "second", 11.28),
    b: wordAt(fps, "s7", "42", 12.24),
    eden: wordAt(fps, "s7", "eden", 13.52),
    small: s[5].from,
  };
};

export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const cut = interpolate(frame, [b.halves - 4, b.halves + 8], [0, 1], CLAMP);
  return (
    <SceneShell push={0.02}>
      <Bar text="SO-CALLED “TOSS GROUNDS”" delay={-10} />
      <Panel x={60} y={346} w={960} h={190} delay={b.split - 8} seed={701}>
        <div style={{ position: "absolute", top: 22, width: "100%", textAlign: "center" }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.18em">
            ONE GROUND'S MATCHES, IN DATE ORDER
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 70, display: "flex", gap: 6 }}>
          {Array.from({ length: 40 }).map((_, i) => {
            const o = fade(frame, b.split + i * 0.6, 4);
            const second = i >= 20;
            return <div key={i} style={{ flex: 1, height: 44, borderRadius: 4, background: second ? C.creamDim : C.cream, opacity: o * (second ? 0.45 + 0.4 * cut : 0.85), marginLeft: i === 20 ? 30 * cut : 0 }} />;
          })}
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 132, display: "flex", justifyContent: "space-around", opacity: cut }}>
          <Lettering size={34}>FIRST HALF</Lettering>
          <Lettering size={34}>SECOND HALF</Lettering>
        </div>
      </Panel>
      <Panel x={60} y={552} w={960} h={644} delay={b.where - 8} seed={702}>
        <div style={{ position: "absolute", left: 20, top: 16 }}>
          <Slope w={920} h={590} leftAt={b.first} lineAt={b.second - 4} avgAAt={b.a} avgBAt={b.b} hiAt={b.eden} hiIdx={6} />
        </div>
        <Foot bottom={12}>THE 8 GROUNDS WITH THE HIGHEST FIRST-HALF TOSS-WIN % · OUT OF 52 WITH 40+ DECIDED ODI, T20I & IPL GAMES</Foot>
      </Panel>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1222, display: "flex", justifyContent: "center" }}>
        <Stamp text="SMALL SAMPLES TELL BIG LIES" at={b.small} color={AMBER} size={66} rotate={-3} />
      </div>
    </SceneShell>
  );
};

/* ================= S8 — TESTS: THE EXCEPTION ================= */
export const s8Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s8", i));
  return {
    v: wordAt(fps, "s8", "54", 3.18),
    outside: wordAt(fps, "s8", "outside", 4.2),
    but: s[2].from,
    bat: wordAt(fps, "s8", "bat", 6.88),
    bowl: wordAt(fps, "s8", "bowl", 9.14),
    over: s[3].from,
    up: wordAt(fps, "s8", "up", 12.46),
    nobody: wordAt(fps, "s8", "nobody", 13.28),
  };
};

export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  const wear = interpolate(frame, [b.over, b.up + 10], [0, 1], { easing: theme.ease.soft, ...CLAMP });
  const day = Math.min(5, 1 + Math.floor(wear * 5));
  return (
    <SceneShell push={0.02}>
      <Bar text="THE EXCEPTION: TEST CRICKET" delay={-10} color={AMBER} />
      <Panel x={60} y={346} w={960} h={226} delay={-4} seed={801} glow={C.amberGlow} glowOn={frame >= b.outside ? 0.5 : 0}>
        <div style={{ position: "absolute", left: 0, top: 24 }}>
          <ZoneRow w={960} label="TEST" sub="730 DECIDED" band={[46.4, 53.6]} value={54.2} at={b.v} />
        </div>
        <div style={{ position: "absolute", right: 40, top: 186, opacity: fade(frame, b.outside) }}>
          <Lettering size={30} font="body" color={AMBER} spacing="0.18em">
            OUTSIDE THE ZONE
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={588} w={960} h={340} delay={b.but - 8} seed={802}>
        <div style={{ position: "absolute", left: 20, top: 22 }}>
          <HBars
            w={920}
            items={[
              { label: "WON TOSS, BATTED FIRST", sub: "283 OF 496 WON", value: 57.1, at: b.bat, color: AMBER },
              { label: "WON TOSS, BOWLED FIRST", sub: "113 OF 234 WON", value: 48.3, at: b.bowl, color: C.creamDim },
            ]}
          />
        </div>
      </Panel>
      <Panel x={60} y={944} w={960} h={406} delay={b.over - 8} seed={803} glow={C.amberGlow} glowOn={frame >= b.nobody ? 0.5 : 0}>
        <div style={{ position: "absolute", top: 24, width: "100%", textAlign: "center" }}>
          <Lettering size={24} font="body" color={C.creamDim} spacing="0.2em">
            THE PITCH OVER FIVE DAYS
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 30, top: 64 }}>
          <Pitch w={900} wear={wear} day={day} />
        </div>
        <div style={{ position: "absolute", bottom: 16, width: "100%", textAlign: "center", opacity: fade(frame, b.nobody - 2) }}>
          <Lettering size={46} color={AMBER}>
            BATTING LAST = THE WORST OF THE PITCH
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S9 — IPL: THE DECISION ================= */
export const s9Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s9", i));
  return {
    toss: s[1].from,
    bowl: wordAt(fps, "s9", "bowl", 2.4),
    bat: wordAt(fps, "s9", "bat", 5.4),
    coin: s[2].from,
    decision: wordAt(fps, "s9", "decision", 9.88),
    tilt: wordAt(fps, "s9", "tilt", 10.54),
  };
};

export const S9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s9Beats(fps);
  const tiltP = spring({ frame: frame - b.decision, fps, config: { damping: 10, stiffness: 90, mass: 1.1 } });
  return (
    <SceneShell push={0.02}>
      <Bar text="THE IPL FLIPS IT" delay={-10} />
      <Panel x={60} y={346} w={960} h={360} delay={b.toss - 10} seed={901}>
        <div style={{ position: "absolute", left: 20, top: 30 }}>
          <HBars
            w={920}
            items={[
              { label: "WON TOSS, BOWLED FIRST", sub: "443 OF 810 WON", value: 54.7, at: b.bowl, color: GREEN },
              { label: "WON TOSS, BATTED FIRST", sub: "185 OF 408 WON", value: 45.3, at: b.bat, color: RED },
            ]}
          />
        </div>
      </Panel>
      <Panel x={60} y={722} w={960} h={628} delay={b.coin - 8} seed={902}>
        <div style={{ position: "absolute", top: 34, width: "100%", textAlign: "center" }}>
          <Lettering size={56}>THE COIN DOESN'T WIN THE MATCH</Lettering>
        </div>
        <div style={{ position: "absolute", left: 30, top: 130 }}>
          <Beam w={900} tilt={7 * tiltP} on={fade(frame, b.coin + 6)} />
        </div>
        <div style={{ position: "absolute", bottom: 40, width: "100%", textAlign: "center", opacity: fade(frame, b.tilt - 4) }}>
          <Lettering size={66} color={AMBER}>
            THE DECISION CAN TILT IT
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S10 — THE VERDICT ================= */
export const s10Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4].map((i) => sentence(fps, "s10", i));
  return {
    across: s[1].from,
    v: wordAt(fps, "s10", "50", 3.8),
    less: wordAt(fps, "s10", "less", 5.32),
    extra: wordAt(fps, "s10", "extra", 6.44),
    myth: s[2].from,
    mostly: wordAt(fps, "s10", "mostly", 9.34),
    coin: s[3].from,
    players: wordAt(fps, "s10", "players", 13.44),
    conditions: wordAt(fps, "s10", "conditions", 14.04),
    decisions: wordAt(fps, "s10", "decisions", 14.9),
    brand: s[4].from - 8,
  };
};

export const S10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s10Beats(fps);
  const swap = b.coin - 10;
  const v = useAt(b.v, theme.spring.flip);
  const stampOut = interpolate(frame, [swap, swap + 8], [1, 0], CLAMP);
  const brand = useAt(b.brand, theme.spring.heavy);
  const who = [
    { t: "PLAYERS", at: b.players - 4, c: C.cream },
    { t: "CONDITIONS", at: b.conditions - 4, c: DEW },
    { t: "DECISIONS", at: b.decisions - 4, c: AMBER },
  ];
  return (
    <SceneShell push={0} pull={0.03} turnOut={false}>
      <Bar text="THE VERDICT" delay={-10} />
      {/* phase A — the number */}
      <Panel x={60} y={346} w={960} h={300} delay={b.across - 8} closeAt={swap} seed={1001} glow={C.amberGlow} glowOn={0.5}>
        <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
          <Lettering size={26} font="body" color={C.creamDim} spacing="0.24em">
            EVERY FORMAT · TOSS WINNERS WON
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 82, width: "100%", display: "flex", justifyContent: "center", opacity: interpolate(v, [0, 0.4], [0, 1], CLAMP) }}>
          <Plates text="50.9%" w={110} h={160} gap={10} color={AMBER} glow={C.amberGlow} />
        </div>
        <Foot bottom={18}>4,051 OF 7,965 DECIDED MATCHES</Foot>
      </Panel>
      <Panel x={60} y={662} w={960} h={560} delay={b.less - 8} closeAt={swap} seed={1002}>
        <div style={{ position: "absolute", left: 60, top: 50 }}>
          <Hundred at={b.less} extraAt={b.extra} />
        </div>
        <div style={{ position: "absolute", left: 600, right: 40, top: 110, display: "flex", flexDirection: "column", gap: 40 }}>
          <div style={{ opacity: fade(frame, b.less + 6), display: "flex", flexDirection: "column", gap: 8 }}>
            <Lettering size={60}>50 WINS</Lettering>
            <Lettering size={20} font="body" color={C.creamDim} spacing="0.14em">
              WHAT A COIN FLIP GIVES YOU
            </Lettering>
          </div>
          <div style={{ opacity: fade(frame, b.extra), display: "flex", flexDirection: "column", gap: 8 }}>
            <Lettering size={60} color={AMBER}>
              + 0.9
            </Lettering>
            <Lettering size={20} font="body" color={C.creamDim} spacing="0.14em">
              WHAT WINNING THE TOSS ADDS
            </Lettering>
          </div>
          <Lettering size={20} font="body" color={C.creamDim} spacing="0.14em" style={{ opacity: fade(frame, b.less + 6) }}>
            PER 100 DECIDED MATCHES
          </Lettering>
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 60, top: 346, width: 960, height: 876, borderRadius: 10, background: "rgba(8,12,10,0.78)", opacity: fade(frame, b.myth - 2, 6) * stampOut }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: stampOut }}>
        <Stamp text="MYTH BUSTED" at={b.myth} color={RED} size={150} rotate={-7} />
        <div style={{ opacity: fade(frame, b.mostly, 6) }}>
          <Lettering size={56} color={C.cream} style={{ background: "rgba(10,15,12,0.9)", padding: "8px 26px", borderRadius: 8 }}>
            (MOSTLY)
          </Lettering>
        </div>
      </div>
      {/* phase B — what actually wins */}
      <Panel x={60} y={346} w={960} h={220} delay={b.coin - 2} seed={1003}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
          <Coin size={120} angle={(frame - b.coin) * 0.18} />
          <Lettering size={60}>THE COIN DECIDES WHO GOES FIRST</Lettering>
        </div>
      </Panel>
      <Panel x={60} y={582} w={960} h={250} delay={b.players - 10} seed={1004}>
        <div style={{ position: "absolute", top: 28, width: "100%", textAlign: "center" }}>
          <Lettering size={24} font="body" color={C.creamDim} spacing="0.24em">
            WHAT DECIDES WHO WINS
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 92, width: "100%", display: "flex", justifyContent: "center", gap: 22 }}>
          {who.map((w) => {
            const p = spring({ frame: frame - w.at, fps, config: theme.spring.flip });
            return (
              <div key={w.t} style={{ width: 280, height: 116, borderRadius: 10, background: C.plate, boxShadow: `inset 0 0 0 2px ${C.panelEdge}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `perspective(500px) rotateX(${interpolate(p, [0, 1], [90, 0], CLAMP)}deg)`, opacity: interpolate(p, [0, 0.2], [0, 1], CLAMP) }}>
                <Lettering size={56} color={w.c}>
                  {w.t}
                </Lettering>
              </div>
            );
          })}
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 60, top: 852, width: 960, opacity: interpolate(brand, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(brand, [0, 1], [0.94, 1])})` }}>
        <Panel x={0} y={0} w={960} h={498} delay={b.brand} seed={1005} glow={C.amberGlow} glowOn={0.35}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <Lettering size={64} color={AMBER}>
              GOT A MYTH FOR US TO TEST?
            </Lettering>
            <Lettering size={30} font="body" color={C.cream} spacing="0.22em">
              DROP IT IN THE COMMENTS ↓
            </Lettering>
            <div style={{ width: 760, height: 2, background: C.panelEdge, margin: "18px 0" }} />
            <Lettering size={26} font="body" color={C.creamDim} spacing="0.34em">
              MYTH BUSTERS · #01
            </Lettering>
            <Lettering size={100} spacing="0.03em">
              BEYOND THE SCOREBOARD
            </Lettering>
          </div>
        </Panel>
      </div>
    </SceneShell>
  );
};
