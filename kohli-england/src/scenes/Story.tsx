// Virat Kohli: The England Nightmare — eight scoreboard scenes, every beat timed to the narration.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { rng } from "../components/Board";
import { CompareRow, Corridor, CumulativeChart, InningsBars } from "../components/Charts";
import { CLAMP } from "../components/Motion";
import { Lamp, Lettering, Panel } from "../components/Panel";
import { PhotoFrame } from "../components/Photo";
import { SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { cumulative, tour2014, tour2018 } from "../data";
import { theme } from "../theme";
import { sentence, wordAt } from "../timing";
import { Divider, Reveal, useAt, useFlip } from "./common";

const C = theme.colors;
const GREY = "#8E8A7C";

// Mechanical counter: digits spin (blurred) until `stopAt`, then the real number flips into place.
const SpinCounter: React.FC<{ target: string; stopAt: number; seed: number; w: number; h: number; color: string; glow?: string }> = ({ target, stopAt, seed, w, h, color, glow }) => {
  const frame = useCurrentFrame();
  const spinning = frame < stopAt;
  const r = rng(seed + Math.floor(frame / 2) * 7);
  const text = spinning ? target.split("").map(() => String(Math.floor(r() * 10))).join("") : target;
  const flip = useFlip(stopAt, 3);
  const glowOn = interpolate(frame, [stopAt, stopAt + 10], [0, 1], CLAMP);
  return <Plates text={text} prev={spinning ? undefined : "000"} progress={spinning ? () => 1 : flip} w={w} h={h} gap={10} color={spinning ? C.creamDim : color} glow={spinning ? undefined : glow} glowOn={glowOn} blur={spinning ? 2.6 : 0} />;
};

// A stat tile whose value flips in from blank plates when the narrator says it.
const StatTile: React.FC<{ label: string; value: string; at: number; color?: string; glow?: string; plateW: number; plateH: number; lamp?: boolean }> = ({ label, value, at, color = C.cream, glow, plateW, plateH, lamp }) => {
  const frame = useCurrentFrame();
  const flip = useFlip(at, 3);
  const lit = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {lamp && <Lamp color={color} glow={glow ?? "transparent"} on={lit} size={18} />}
        <Lettering size={22} font="body" color={lit > 0.5 ? C.cream : C.creamDim} spacing="0.2em">
          {label}
        </Lettering>
      </div>
      <Plates text={value} prev={" ".repeat(value.length)} progress={flip} w={plateW} h={plateH} gap={6} color={color} glow={glow} glowOn={lit} />
    </div>
  );
};

/* ---------------- S1 — THE HOOK ---------------- */
export const s1Beats = (fps: number) => ({
  stop149: wordAt(fps, "s1", "his", 4.54) - 4, // as "…one hundred and forty-nine" ends
  stop134: wordAt(fps, "s1", "an", 11.4) - 4, // as "…one hundred and thirty-four" ends
});

export const S1: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const verdict = b.stop134 + 18;
  return (
    <SceneShell push={0.03}>
      <Panel x={60} y={226} w={960} h={118} delay={0} seed={101}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Lettering size={64}>VIRAT KOHLI · TESTS IN ENGLAND</Lettering>
          <Lettering size={24} font="body" color={C.amber} spacing="0.34em">
            2014 vs 2018
          </Lettering>
        </div>
      </Panel>
      <PhotoFrame id="otr-scoreboard-2014" x={60} y={360} w={470} h={500} delay={2} warmth={0.1} focus="58% 45%" zoom={[1.1, 1.22]} life={440} label="2014" labelColor={GREY} compact seed={102} />
      <PhotoFrame id="kohli-batting-tb-2018" x={550} y={360} w={470} h={500} delay={6} warmth={1} focus="30% 52%" zoom={[1.3, 1.45]} life={480} label="2018" compact seed={103} glow={C.amberGlow} glowOn={0.4} />
      {[
        { x: 60, label: "2014 SERIES", target: "134", stop: b.stop134, col: C.red, glow: C.redGlow, seed: 5 },
        { x: 550, label: "2018 FIRST INNINGS", target: "149", stop: b.stop149, col: C.amber, glow: C.amberGlow, seed: 9 },
      ].map((c) => (
        <Panel key={c.label} x={c.x} y={876} w={470} h={290} delay={4} seed={104 + c.seed} glow={c.glow} glowOn={0}>
          <div style={{ position: "absolute", top: 24, width: "100%", textAlign: "center" }}>
            <Lettering size={26} font="body" color={C.cream} spacing="0.22em">
              {c.label}
            </Lettering>
          </div>
          <div style={{ position: "absolute", top: 70, width: "100%", display: "flex", justifyContent: "center" }}>
            <SpinCounter target={c.target} stopAt={c.stop} seed={c.seed} w={112} h={152} color={c.col} glow={c.glow} />
          </div>
          <div style={{ position: "absolute", top: 238, width: "100%", textAlign: "center" }}>
            <Lettering size={30} font="body" color={C.creamDim} spacing="0.3em">
              RUNS
            </Lettering>
          </div>
        </Panel>
      ))}
      <Panel x={60} y={1182} w={960} h={170} delay={verdict} seed={108} glow={C.amberGlow} glowOn={0.5}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Lettering size={48}>ONE INNINGS IN 2018 OUTSCORED</Lettering>
          <Lettering size={48} color={C.amber} style={{ textShadow: `0 0 18px ${C.amberGlow}` }}>
            HIS ENTIRE 2014 SERIES
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ---------------- S2 — THE NIGHTMARE ---------------- */
export const s2Beats = (fps: number) => ({
  rewind: wordAt(fps, "s2", "2014", 1.6),
  tests: sentence(fps, "s2", 1).from,
  innings: sentence(fps, "s2", 2).from,
  avg: wordAt(fps, "s2", "13", 6.4),
  ducks: sentence(fps, "s2", 4).from,
  fifties: sentence(fps, "s2", 5).from,
  highest: sentence(fps, "s2", 7).from,
});

export const S2: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const t = tour2014;
  const rewind = useFlip(b.rewind, 3);
  return (
    <SceneShell push={0.04}>
      <PhotoFrame id="kohli-leaves-tb-2018" x={60} y={226} w={960} h={560} delay={0} warmth={0} focus="57% 44%" zoom={[1.75, 1.95]} pan={[0, -24]} life={440} seed={201} />
      <Panel x={60} y={802} w={960} h={548} delay={6} seed={202}>
        <div style={{ position: "absolute", top: 14, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
          <Lettering size={24} font="body" color={C.amber} spacing="0.32em">
            ENGLAND
          </Lettering>
          <Plates text="2014" prev="2018" progress={(i) => (i < 3 ? 1 : rewind(0))} w={30} h={44} gap={4} color={C.amber} />
          <Lettering size={24} font="body" color={C.amber} spacing="0.32em">
            · TEST SERIES
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 72, left: 30, right: 30, display: "flex", justifyContent: "space-around" }}>
          <StatTile label="TESTS" value={String(t.tests)} at={b.tests} plateW={92} plateH={126} />
          <StatTile label="INNINGS" value={String(t.innings)} at={b.innings} plateW={92} plateH={126} />
          <StatTile label="RUNS" value={String(t.runs)} at={b.innings + 14} plateW={92} plateH={126} color={C.red} glow={C.redGlow} />
        </div>
        <Divider y={286} />
        <div style={{ position: "absolute", top: 312, left: 20, right: 20, display: "flex", justifyContent: "space-around" }}>
          <StatTile label="AVERAGE" value={t.average} at={b.avg} plateW={50} plateH={104} color={C.red} glow={C.redGlow} />
          <StatTile label="DUCKS" value={String(t.ducks)} at={b.ducks} plateW={70} plateH={104} color={C.red} glow={C.redGlow} lamp />
          <StatTile label="FIFTIES" value={String(t.fifties)} at={b.fifties} plateW={70} plateH={104} color={C.red} glow={C.redGlow} lamp />
          <StatTile label="HIGHEST" value={String(t.highest)} at={b.highest} plateW={70} plateH={104} color={C.amber} glow={C.amberGlow} lamp />
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ---------------- S3 — TEN INNINGS ---------------- */
export const s3Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4, 5].map((i) => sentence(fps, "s3", i));
  return { bars: s[0].from, fifty: s[1].from, never: s[2].from, tb: s[3].from, lords: s[4].from, otr: s[5].from, clear: s[5].to + 18 };
};

export const S3: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  return (
    <SceneShell push={0.03}>
      <Panel x={60} y={226} w={960} h={110} delay={0} seed={301}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
          <Lettering size={62}>2014 · TEN INNINGS</Lettering>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
            RUNS PER INNINGS
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={352} w={960} h={640} delay={4} seed={302}>
        <div style={{ position: "absolute", left: 20, top: 26 }}>
          <InningsBars
            scores={tour2014.scores}
            grounds={tour2014.grounds}
            revealAt={[0, 1, 2, 3, 4].map((i) => b.bars + i * 7)}
            fiftyAt={b.fifty}
            neverAt={b.never}
            focus={[
              { at: b.tb, ground: 0 },
              { at: b.lords, ground: 1 },
              { at: b.otr, ground: 3 },
              { at: b.clear, ground: -1 },
            ]}
            w={920}
            h={596}
          />
        </div>
      </Panel>
      <PhotoFrame id="tb-2014-a" x={60} y={1008} w={470} h={344} delay={b.tb - 6} warmth={0.15} focus="50% 50%" zoom={[1.05, 1.16]} life={300} compact seed={303} />
      <PhotoFrame id="otr-covers-2014" x={550} y={1008} w={470} h={344} delay={b.otr - 6} warmth={0.05} focus="50% 50%" zoom={[1.05, 1.15]} life={200} compact seed={304} />
    </SceneShell>
  );
};

/* ---------------- S4 — ANDERSON'S TRAP ---------------- */
export const s4Beats = (fps: number) => ({
  four: wordAt(fps, "s4", "four", 1.52),
  corridor: sentence(fps, "s4", 1).from - 6,
  edge: wordAt(fps, "s4", "edge", 5.82) + 6,
  weakness: sentence(fps, "s4", 2).from,
});

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const weak = useAt(b.weakness, theme.spring.bouncy);
  const fourFlip = useFlip(b.four + 22, 2);
  return (
    <SceneShell push={0.035}>
      <PhotoFrame id="anderson-perth-2013" x={60} y={226} w={960} h={470} delay={0} warmth={0.2} focus="30% 40%" zoom={[1.12, 1.26]} pan={[30, -10]} life={300} label="THE OPPONENT" labelColor={C.cream} seed={401} />
      <Panel x={60} y={712} w={960} h={196} delay={b.four - 14} seed={402} glow={C.redGlow} glowOn={interpolate(frame, [b.four + 15, b.four + 30], [0, 0.6], CLAMP)}>
        <div style={{ position: "absolute", left: 44, top: 34 }}>
          <Lettering size={58}>JAMES ANDERSON</Lettering>
          <div style={{ height: 14 }} />
          <Lettering size={24} font="body" color={C.creamDim} spacing="0.2em">
            2014 DISMISSALS OF KOHLI
          </Lettering>
        </div>
        <div style={{ position: "absolute", right: 44, top: 40, display: "flex", alignItems: "center", gap: 18 }}>
          {[0, 1, 2, 3].map((i) => (
            <Lamp key={i} color={C.red} glow={C.redGlow} on={interpolate(frame, [b.four + i * 6, b.four + i * 6 + 4], [0, 1], CLAMP)} size={40} />
          ))}
          <div style={{ width: 10 }} />
          <Plates text={String(tour2014.andersonDismissals)} prev=" " progress={fourFlip} w={86} h={116} color={C.red} glow={C.redGlow} />
        </div>
      </Panel>
      <Panel x={60} y={924} w={960} h={428} delay={b.corridor - 8} seed={403}>
        <div style={{ position: "absolute", top: 18, width: "100%", textAlign: "center" }}>
          <Lettering size={26} font="body" color={C.amber} spacing="0.26em">
            OUTSIDE OFF-STUMP CHALLENGE
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 20, top: 58 }}>
          <Corridor at={b.corridor} edgeAt={b.edge} w={920} h={320} />
        </div>
        <div style={{ position: "absolute", bottom: 14, width: "100%", textAlign: "center" }}>
          <Lettering size={15} font="body" weight={500} color={C.creamDim} spacing="0.18em">
            ILLUSTRATION OF THE IDEA · NOT BALL-TRACKING DATA
          </Lettering>
        </div>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 190,
            padding: "10px 16px 8px",
            borderRadius: 6,
            background: "rgba(196,81,63,0.16)",
            boxShadow: `inset 0 0 0 2px ${C.red}`,
            opacity: interpolate(weak, [0, 0.4], [0, 1], CLAMP),
            transform: `scale(${interpolate(weak, [0, 1], [1.3, 1])}) rotate(-3deg)`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Lamp color={C.red} glow={C.redGlow} on={1} size={16} />
          <Lettering size={34} color={C.red}>
            WEAKNESS FOUND
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ---------------- S5 — FOUR YEARS LATER ---------------- */
export const s5Beats = (fps: number) => ({
  flip: wordAt(fps, "s5", "later", 0.42),
  photo: sentence(fps, "s5", 0).to - 14,
  tags: [wordAt(fps, "s5", "patient", 3.1), wordAt(fps, "s5", "leaving", 4.18), wordAt(fps, "s5", "waiting", 5.62)],
});

export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const flip = useFlip(b.flip, 4);
  const warm = interpolate(frame, [b.flip, b.flip + 40], [0, 1], CLAMP);
  const approach = useAt(b.flip + 26, theme.spring.smooth);
  return (
    <SceneShell push={0.03}>
      <Panel x={60} y={226} w={960} h={420} delay={0} seed={501} glow={C.amberGlow} glowOn={warm * 0.7}>
        <div style={{ position: "absolute", top: 26, width: "100%", textAlign: "center" }}>
          <Lettering size={26} font="body" color={C.creamDim} spacing="0.4em">
            ENGLAND
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 74, width: "100%", display: "flex", justifyContent: "center" }}>
          <Plates text="2018" prev="2014" progress={(i) => (i < 3 ? 1 : flip(0))} w={150} h={210} gap={14} color={warm > 0.5 ? C.amber : C.cream} glow={C.amberGlow} glowOn={warm} />
        </div>
        <div style={{ position: "absolute", top: 318, width: "100%", textAlign: "center", opacity: interpolate(approach, [0, 0.5], [0, 1], CLAMP), transform: `translateY(${interpolate(approach, [0, 1], [20, 0])}px)` }}>
          <Lettering size={66} color={C.amber} style={{ textShadow: `0 0 20px ${C.amberGlow}` }}>
            A NEW APPROACH
          </Lettering>
        </div>
      </Panel>
      <PhotoFrame id="kohli-batting-tb-2018" x={60} y={662} w={960} h={530} delay={b.photo} warmth={1} focus="40% 45%" zoom={[1.18, 1.3]} pan={[0, -30]} life={260} label="2018" seed={502} glow={C.amberGlow} glowOn={0.35} />
      <Panel x={60} y={1208} w={960} h={144} delay={b.tags[0] - 10} seed={503}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 20px" }}>
          {["PATIENCE", "LEAVING WELL", "THE RIGHT BALL"].map((tag, i) => {
            const on = interpolate(frame, [b.tags[i], b.tags[i] + 8], [0, 1], CLAMP);
            return (
              <div key={tag} style={{ display: "flex", alignItems: "center", gap: 12, opacity: 0.35 + 0.65 * on }}>
                <Lamp color={C.amber} glow={C.amberGlow} on={on} size={22} />
                <Lettering size={40} color={on > 0.5 ? C.cream : C.creamDim}>
                  {tag}
                </Lettering>
              </div>
            );
          })}
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ---------------- S6 — THE INCREDIBLE 149 ---------------- */
export const s6Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4, 5, 6].map((i) => sentence(fps, "s6", i));
  return {
    header: s[1].from,
    countFrom: s[1].from + 4,
    red: s[2].from,
    redEnd: s[2].to,
    pass: wordAt(fps, "s6", "past", 7.6) + 4, // the counter crosses 134 on "…went past it"
    keep: s[4].to,
    land: s[5].to - 2,
    diff: s[6].from,
  };
};

// The climb: steady through the 2014 explanation, over the red line on "past it", easing onto 149.
const countAt = (f: number, b: ReturnType<typeof s6Beats>) =>
  Math.round(interpolate(f, [b.countFrom, b.redEnd, b.pass, b.keep, b.land], [0, 118, 134, 142, 149], { easing: theme.ease.soft, ...CLAMP }));

export const s6Pass134 = (fps: number) => s6Beats(fps).pass;

export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const runs = countAt(frame, b);
  const landed = frame >= b.land;
  const land = useAt(b.land, theme.spring.bouncy);
  const passed = runs >= 134;
  const passFlash = interpolate(frame, [b.pass, b.pass + 4, b.pass + 26], [0, 1, 0], CLAMP);
  const redCall = interpolate(frame, [b.red, b.red + 6, b.redEnd + 10, b.redEnd + 24], [0, 1, 1, 0], CLAMP);
  const diff = useFlip(b.diff + 10, 3);
  const RAIL = 150; // rail scale 0–150 runs, linear
  const railW = 820;
  const markX = (railW * 134) / RAIL;
  return (
    <SceneShell push={0.05}>
      <Panel x={60} y={226} w={960} h={120} delay={0} seed={601} glow={C.amberGlow} glowOn={0.4}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Lettering size={68}>EDGBASTON — 2018</Lettering>
          <Reveal at={b.header} x={0} y={10}>
            <Lettering size={24} font="body" color={C.amber} spacing="0.32em">
              FIRST TEST · FIRST INNINGS
            </Lettering>
          </Reveal>
        </div>
      </Panel>
      <Panel x={60} y={362} w={960} h={340} delay={b.countFrom - 14} seed={603} glow={C.amberGlow} glowOn={landed ? 0.6 + 0.4 * Math.min(1, land) : 0.25}>
        <div style={{ position: "absolute", top: 24, width: "100%", textAlign: "center" }}>
          <Lettering size={30} font="body" color={C.cream} spacing="0.3em">
            VIRAT KOHLI
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 76, width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 24, transform: `scale(${landed ? interpolate(land, [0, 1], [1.12, 1]) : 1})` }}>
          <Plates text={String(runs).padStart(3, " ")} w={160} h={220} gap={14} color={passed ? C.amber : C.cream} glow={C.amberGlow} glowOn={landed ? 1 : passed ? 0.6 : 0} blur={!landed && frame > b.countFrom ? 1 : 0} />
          <div style={{ paddingBottom: 18, opacity: interpolate(land, [0, 0.5], [0, 1], CLAMP) }}>
            <Lettering size={64} color={C.creamDim}>
              ({tour2018.edgbaston.balls})
            </Lettering>
          </div>
        </div>
      </Panel>
      <Panel x={60} y={718} w={960} h={130} delay={b.countFrom - 8} seed={604} glow={C.redGlow} glowOn={redCall * 0.7}>
        <div style={{ position: "absolute", left: 70, top: 66, width: railW, height: 18, borderRadius: 9, background: C.plate, boxShadow: `inset 0 0 0 1px ${C.panelEdge}` }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (railW * runs) / RAIL, borderRadius: 9, background: passed ? C.amber : C.cream, boxShadow: passed ? `0 0 16px ${C.amberGlow}` : undefined }} />
          {/* marker: the whole 2014 series */}
          <div style={{ position: "absolute", left: markX - 3, top: -18, width: 6, height: 54, background: C.red, boxShadow: `0 0 ${10 + 30 * Math.max(passFlash, redCall)}px ${C.redGlow}` }} />
        </div>
        <div style={{ position: "absolute", left: 70 + markX - 420, top: 14, width: 410, textAlign: "right", transform: `scale(${1 + 0.12 * redCall})`, transformOrigin: "100% 50%" }}>
          <Lettering size={22} font="body" color={C.red} spacing="0.14em">
            WHOLE 2014 SERIES · 134
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 70, top: 96 }}>
          <Lettering size={20} color={C.creamDim}>
            0
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 70 + railW - 30, top: 96 }}>
          <Lettering size={20} color={C.creamDim}>
            150
          </Lettering>
        </div>
      </Panel>
      {/* what he is chasing: all ten 2014 innings — the board swings away to the celebration as 149 lands */}
      <Panel x={60} y={864} w={960} h={388} delay={b.red - 6} closeAt={b.land - 10} seed={606}>
        <div style={{ position: "absolute", top: 22, width: "100%", textAlign: "center" }}>
          <Lettering size={24} font="body" color={C.red} spacing="0.26em">
            THE TARGET: HIS WHOLE 2014 SERIES
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 70, height: 220, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          {tour2014.scores.map((v, i) => {
            const g = interpolate(frame, [b.red + i * 3, b.red + i * 3 + 12], [0, 1], { easing: theme.ease.out, ...CLAMP });
            return (
              <div key={i} style={{ width: 62, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <Lettering size={30} color={v === 0 ? C.red : C.creamDim} style={{ opacity: g }}>
                  {v}
                </Lettering>
                <div style={{ width: 46, height: Math.max(3, (180 * v) / 50) * g, background: v === 0 ? C.red : "#8E8A7C", borderRadius: "3px 3px 0 0" }} />
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", bottom: 24, width: "100%", textAlign: "center" }}>
          <Lettering size={40} color={C.cream}>
            10 INNINGS = <span style={{ color: C.red }}>134 RUNS</span>
          </Lettering>
        </div>
      </Panel>
      <PhotoFrame id="kohli-century-tb-2018" x={60} y={864} w={960} h={388} delay={b.land - 2} warmth={1} focus="50% 38%" zoom={[1.0, 1.1]} life={200} label="2018" seed={602} glow={C.amberGlow} glowOn={0.6} />
      <Panel x={60} y={1268} w={960} h={88} delay={b.diff - 6} seed={605} glow={C.amberGlow} glowOn={0.5}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
              2014 TOTAL
            </Lettering>
            <Lettering size={50} color={GREY}>
              134
            </Lettering>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Lettering size={22} font="body" color={C.cream} spacing="0.2em">
              DIFFERENCE
            </Lettering>
            <Plates text="+15" prev="   " progress={diff} w={44} h={64} gap={6} color={C.amber} glow={C.amberGlow} />
          </div>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ---------------- S7 — COMPLETE TRANSFORMATION ---------------- */
export const s7Beats = (fps: number) => ({
  legend: sentence(fps, "s7", 0).from,
  runs: sentence(fps, "s7", 1).from,
  avg: sentence(fps, "s7", 2).from,
  tons: sentence(fps, "s7", 3).from,
  fifties: wordAt(fps, "s7", "three", 10.9),
  anderson: sentence(fps, "s7", 4).from,
});

export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const tons = useFlip(b.tons, 3);
  const fifties = useFlip(b.fifties, 3);
  const grey = interpolate(frame, [wordAt(fps, "s7", "grey", 1.6), wordAt(fps, "s7", "grey", 1.6) + 8], [0, 1], CLAMP);
  const gold = interpolate(frame, [wordAt(fps, "s7", "gold", 3.0), wordAt(fps, "s7", "gold", 3.0) + 8], [0, 1], CLAMP);
  const zero = useFlip(wordAt(fps, "s7", "once", 11.0), 2);
  const fourLit = useFlip(b.anderson + 18, 2);
  return (
    <SceneShell push={0.03}>
      <Panel x={60} y={226} w={960} h={96} delay={0} seed={701}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
          <Lettering size={62}>
            <span style={{ color: GREY }}>2014</span> vs <span style={{ color: C.amber }}>2018</span>
          </Lettering>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            {[
              { k: "2014", col: GREY, on: grey },
              { k: "2018", col: C.amber, on: gold },
            ].map((l) => (
              <div key={l.k} style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.3 + 0.7 * l.on, transform: `scale(${1 + 0.15 * l.on * (1 - l.on) * 4})` }}>
                <div style={{ width: 34, height: 18, borderRadius: 3, background: l.col, boxShadow: l.k === "2018" ? `0 0 ${12 * l.on}px ${C.amberGlow}` : undefined }} />
                <Lettering size={26} font="body" color={l.col} spacing="0.14em">
                  {l.k}
                </Lettering>
              </div>
            ))}
          </div>
        </div>
      </Panel>
      <PhotoFrame id="otr-ground-2014" x={60} y={338} w={470} h={282} delay={4} warmth={0.1} focus="50% 50%" zoom={[1.05, 1.14]} life={380} label="2014" labelColor={GREY} compact seed={702} />
      <PhotoFrame id="kohli-fielding-tb-2018" x={550} y={338} w={470} h={282} delay={8} warmth={1} focus="50% 4%" zoom={[1.0, 1.06]} life={420} label="2018" compact seed={703} />
      <Panel x={60} y={636} w={960} h={556} delay={b.runs - 14} seed={704}>
        <div style={{ position: "absolute", left: 36, right: 36, top: 26 }}>
          <CompareRow label="RUNS" a={tour2014.runs} b={tour2018.runs} max={600} at={b.runs} w={888} />
          <div style={{ height: 22 }} />
          <CompareRow label="AVERAGE" a={13.4} b={59.3} max={60} fmt={(v) => v.toFixed(2)} at={b.avg} w={888} />
        </div>
        <Divider y={330} />
        <div style={{ position: "absolute", left: 36, right: 36, top: 352, display: "flex", justifyContent: "space-around" }}>
          {[
            { label: "CENTURIES", a: tour2014.hundreds, b: tour2018.hundreds, p: tons, at: b.tons },
            { label: "FIFTIES", a: tour2014.fifties, b: tour2018.fifties, p: fifties, at: b.fifties },
          ].map((r) => (
            <div key={r.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: interpolate(frame, [r.at - 6, r.at + 4], [0.25, 1], CLAMP) }}>
              <Lettering size={24} font="body" color={C.cream} spacing="0.22em">
                {r.label}
              </Lettering>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <Plates text={String(r.a)} prev=" " progress={r.p} w={82} h={112} color={GREY} />
                  <Lettering size={20} font="body" color={C.creamDim} spacing="0.16em">
                    2014
                  </Lettering>
                </div>
                <Lettering size={40} color={C.creamDim}>
                  →
                </Lettering>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <Plates text={String(r.b)} prev=" " progress={(i) => r.p(i + 1)} w={82} h={112} color={C.amber} glow={C.amberGlow} />
                  <Lettering size={20} font="body" color={C.amber} spacing="0.16em">
                    2018
                  </Lettering>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel x={60} y={1208} w={960} h={144} delay={b.anderson - 10} seed={705} glow={C.amberGlow} glowOn={interpolate(frame, [b.anderson + 40, b.anderson + 60], [0, 0.5], CLAMP)}>
        <div style={{ position: "absolute", left: 36, top: 22 }}>
          <Lettering size={24} font="body" color={C.cream} spacing="0.2em">
            ANDERSON DISMISSALS
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 36, right: 36, top: 62, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {[
            { year: "2014", n: 4, col: C.red, glow: C.redGlow },
            { year: "2018", n: 0, col: C.amber, glow: C.amberGlow },
          ].map((r) => (
            <div key={r.year} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Lettering size={30} color={r.year === "2018" ? C.amber : GREY}>
                {r.year}
              </Lettering>
              {[0, 1, 2, 3].map((i) => (
                <Lamp key={i} color={C.red} glow={C.redGlow} on={i < r.n ? interpolate(frame, [b.anderson + i * 4, b.anderson + i * 4 + 4], [0, 1], CLAMP) : 0} size={30} />
              ))}
              <Plates text={String(r.n)} prev=" " progress={r.n === 0 ? zero : fourLit} w={50} h={68} color={r.col} glow={r.glow} />
            </div>
          ))}
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ---------------- S8 — THE LEGACY ---------------- */
export const s8Beats = (fps: number) => ({
  chart: sentence(fps, "s8", 0).from,
  grey: sentence(fps, "s8", 1).from,
  gold: sentence(fps, "s8", 2).from,
  series: sentence(fps, "s8", 3).from,
  lines: [sentence(fps, "s8", 5).from, sentence(fps, "s8", 6).from, sentence(fps, "s8", 7).from],
  brand: sentence(fps, "s8", 8).from - 8,
});

export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  const close = b.brand;
  const brand = useAt(b.brand + 6, theme.spring.heavy);
  return (
    <SceneShell push={0} pull={0.06} turnOut={false}>
      <PhotoFrame id="otr-rain-2014" x={60} y={226} w={470} h={330} delay={0} closeAt={close} warmth={0} focus="50% 55%" zoom={[1.1, 1.2]} life={400} label="2014 — 134 RUNS" labelColor={C.cream} compact seed={801} />
      <PhotoFrame id="kohli-century-tb-2018" x={550} y={226} w={470} h={330} delay={4} closeAt={close} warmth={1} focus="50% 35%" zoom={[1.15, 1.25]} life={400} label="2018 — 593 RUNS" compact seed={802} />
      <Panel x={60} y={572} w={960} h={402} delay={b.chart - 4} closeAt={close} seed={803}>
        <div style={{ position: "absolute", top: 18, width: "100%", textAlign: "center" }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.26em">
            CUMULATIVE RUNS · INNINGS BY INNINGS
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 20, top: 56 }}>
          <CumulativeChart a={cumulative(tour2014.scores)} b={cumulative(tour2018.scores)} atA={b.grey} atB={b.gold} w={920} h={300} drawLen={42} />
        </div>
      </Panel>
      <Panel x={60} y={990} w={960} h={96} delay={b.series} closeAt={close} seed={804}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.24em">
            SERIES
          </Lettering>
          <Lettering size={38} color={GREY}>
            2014 · {tour2014.series}
          </Lettering>
          <Lettering size={38} color={C.cream}>
            2018 · {tour2018.series}
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={1102} w={960} h={250} delay={b.lines[0] - 8} closeAt={close} seed={805}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          {["SAME COUNTRY.", "SAME CHALLENGE.", "A DIFFERENT BATTER."].map((l, i) => (
            <Reveal key={l} at={b.lines[i]} x={0} y={16}>
              <Lettering size={i === 2 ? 66 : 56} color={i === 2 ? C.amber : C.cream} style={i === 2 ? { textShadow: `0 0 20px ${C.amberGlow}` } : undefined}>
                {l}
              </Lettering>
            </Reveal>
          ))}
        </div>
      </Panel>
      {/* final lockup — the board clears, one message remains */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 640,
          width: 960,
          height: 420,
          opacity: interpolate(brand, [0, 0.3], [0, 1], CLAMP),
          transform: `scale(${interpolate(brand, [0, 1], [0.94, 1])})`,
        }}
      >
        <Panel x={0} y={0} w={960} h={420} delay={b.brand + 6} seed={806} glow={C.amberGlow} glowOn={0.6}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <Lettering size={30} font="body" color={C.creamDim} spacing="0.3em">
              SAME COUNTRY · SAME CHALLENGE
            </Lettering>
            <Lettering size={44} color={C.amber}>
              A DIFFERENT BATTER.
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
