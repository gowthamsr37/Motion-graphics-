// Scenes 5–6 (one continuous board): the final over and the last-ball miracle. Scene 7: the legacy.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { MilestoneRail } from "../components/Graphs";
import { CLAMP } from "../components/Motion";
import { Lamp, Lettering, Panel } from "../components/Panel";
import { SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { finalOver, india } from "../data";
import { theme } from "../theme";
import { scene, sentence, voStart, wordAt } from "../timing";
import { Reveal, useAt, useFlip } from "./common";

const C = theme.colors;

// Frames relative to the start of scene 5.
export const overBeats = (fps: number) => {
  const s6 = scene(fps, "s6").from - scene(fps, "s5").from;
  const four = wordAt(fps, "s5", "four", 6.7) + 15;
  return {
    rows: [
      6, // START: 8 off 6
      wordAt(fps, "s5", "dot", 3.8), // 49.1 dot
      wordAt(fps, "s5", "wide", 5.4), // wide
      four, four + 16, four + 31, four + 45, // four singles, accelerating
      s6 + sentence(fps, "s6", 1).from - 9, // 49.6: bat on ball, in the pause just before the call of "FOUR!"
    ],
    freeze: sentence(fps, "s5", 5).from - 10, // the hush settles just before "Now three needed…"
    charge: s6 + voStart(fps, "s6"),
    win: s6 + sentence(fps, "s6", 2).from,
    s6,
  };
};

const splitScore = (s: string) => s.split("/");

// Flat mechanical fold between board states (no perspective, so letters never skew).
const useFold = (at: number, len = 10) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at - len / 2, at + len / 2], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  return { before: t < 0.5, scale: t < 0.5 ? 1 - t * 2 : (t - 0.5) * 2 };
};

export const FinalOver: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const b = overBeats(fps);
  let cur = 0;
  while (cur + 1 < finalOver.length && frame >= b.rows[cur + 1]) cur++;
  const row = finalOver[cur];
  const prevRow = finalOver[Math.max(0, cur - 1)];
  const since = b.rows[cur];
  const scoreFlip = useFlip(since, 2);
  const needFlip = useFlip(since + 3, 2);
  const [sc, wk] = splitScore(row.score);
  const [psc] = splitScore(prevRow.score);
  const frozen = frame >= b.freeze && cur === 6;
  const won = cur === 7;
  const foldFreeze = useFold(b.freeze);
  const foldFour = useFold(b.rows[7], 8);
  const foldWin = useFold(b.win + 4);
  const fourFlip = useFlip(b.rows[7], 0);
  const celebrate = interpolate(frame, [b.rows[7], b.rows[7] + 14], [0, 1], { easing: theme.ease.out, ...CLAMP });
  // camera: slow push through the over, holds still on the freeze, pulls back on the four
  const push = interpolate(frame, [0, b.freeze], [0, 0.05], { easing: theme.ease.soft, ...CLAMP });
  const pull = interpolate(frame, [b.rows[7], b.rows[7] + Math.round(fps * 1.4)], [0, 0.08], { easing: theme.ease.out, ...CLAMP });
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [0, 1], { easing: theme.ease.in, ...CLAMP });

  // which state the live panel shows
  const state = won ? (frame >= b.win + 4 ? "result" : "four") : frozen ? "freeze" : "live";
  const fold = state === "result" ? foldWin : state === "four" ? foldFour : state === "freeze" ? foldFreeze : { scale: 1, before: false };

  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {/* floodlight bloom for the celebration — abstract light, no fabricated footage */}
      {[-1, 1].map((side) => (
        <div
          key={side}
          style={{
            position: "absolute",
            left: side < 0 ? -220 : 700,
            top: -300,
            width: 600,
            height: 1900,
            background: `linear-gradient(180deg, ${C.amberGlow}, transparent 70%)`,
            opacity: 0.3 * celebrate,
            transformOrigin: "50% 0%",
            transform: `rotate(${side * (16 + Math.sin(frame / 30) * 7)}deg)`,
            filter: "blur(30px)",
          }}
        />
      ))}
      <AbsoluteFill style={{ transformOrigin: "50% 45%", transform: `scale(${1 + push - pull})` }}>
        <Panel x={60} y={226} w={960} h={96} delay={0} seed={501}>
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px" }}>
            <Lettering size={56} color={C.amber}>
              50TH OVER
            </Lettering>
            <Lettering size={26} font="body" spacing="0.2em">
              BOWLER: AHMED HUSSAIN
            </Lettering>
          </div>
        </Panel>

        {/* the live equation panel */}
        <Panel x={60} y={340} w={960} h={270} delay={2} seed={502} glow={won ? C.amberGlow : frozen ? C.redGlow : undefined} glowOn={won ? celebrate : frozen ? 0.6 : 0}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%", transform: `scaleY(${Math.max(0.02, fold.scale)})`, filter: `brightness(${0.5 + 0.5 * fold.scale})` }}>
            {(state === "live" || (state === "freeze" && fold.before)) && (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Lettering size={24} font="body" color={C.creamDim} spacing="0.26em">
                    INDIA
                  </Lettering>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Plates text={sc} prev={psc} progress={scoreFlip} w={88} h={124} gap={8} />
                    <Lettering size={78} color={C.creamDim}>
                      /{wk}
                    </Lettering>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
                  <Lettering size={24} font="body" color={C.creamDim} spacing="0.26em">
                    NEED
                  </Lettering>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <Plates text={String(row.runs)} prev={String(prevRow.runs)} progress={needFlip} w={88} h={124} color={C.amber} glow={C.amberGlow} />
                    <Lettering size={44} color={C.creamDim}>
                      OFF
                    </Lettering>
                    <Plates text={String(row.balls)} prev={String(prevRow.balls)} progress={needFlip} w={88} h={124} />
                  </div>
                </div>
              </div>
            )}
            {((state === "freeze" && !fold.before) || (state === "four" && fold.before)) && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
                  {[
                    ["3", "RUNS", C.amber],
                    ["1", "BALL", C.cream],
                    ["1", "WICKET", C.red],
                  ].map(([n, l, col]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Plates text={n} w={84} h={118} color={col} />
                      <Lettering size={58}>{l}</Lettering>
                    </div>
                  ))}
                </div>
                <Lettering size={26} font="body" color={C.creamDim} spacing="0.2em">
                  MOHIT ULVA (BAT) v AHMED HUSSAIN (BOWL)
                </Lettering>
              </div>
            )}
            {((state === "four" && !fold.before) || (state === "result" && fold.before)) && (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 36 }}>
                <Plates text="4" prev="0" progress={fourFlip} w={150} h={210} color={C.amber} glow={C.amberGlow} glowOn={celebrate} />
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
                    49.6 — AHMED HUSSAIN TO MOHIT ULVA
                  </Lettering>
                  <Lettering size={130} color={C.amber} style={{ textShadow: `0 0 26px ${C.amberGlow}` }}>
                    FOUR!
                  </Lettering>
                </div>
              </div>
            )}
            {state === "result" && !fold.before && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <Lettering size={92} color={C.amber} style={{ textShadow: `0 0 24px ${C.amberGlow}` }}>
                  INDIA WIN BY 1 WICKET
                </Lettering>
                <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
                  <Lettering size={62}>INDIA {india.final.runs}/{india.final.wickets}</Lettering>
                  <Lettering size={62} color={C.amber}>
                    MOHIT ULVA {india.ulva.runs}* ({india.ulva.balls})
                  </Lettering>
                </div>
              </div>
            )}
          </div>
        </Panel>

        {/* Graph B — the final-over pressure table */}
        <Panel x={60} y={628} w={960} h={712} delay={4} seed={503} glow={C.amberGlow} glowOn={celebrate * 0.6}>
          <div style={{ position: "absolute", top: 18, left: 44, right: 44, display: "grid", gridTemplateColumns: "1.25fr 1fr 1.25fr" }}>
            {["DELIVERY", "SCORE", "NEEDED"].map((h, i) => (
              <div key={h} style={{ textAlign: i === 0 ? "left" : i === 1 ? "center" : "right" }}>
                <Lettering size={22} font="body" color={C.creamDim} spacing="0.26em">
                  {h}
                </Lettering>
              </div>
            ))}
          </div>
          {finalOver.map((r, i) => {
            const shown = frame >= b.rows[i] - 2;
            const active = i === cur;
            const dim = frozen && i < 6 ? 0.45 : !active && i < cur ? 0.7 : 1;
            const isWin = i === 7;
            const tone = isWin ? C.amber : r.label === "WIDE" ? C.creamDim : C.cream;
            if (!shown) {
              return <div key={r.label} style={{ position: "absolute", top: 62 + i * 80, left: 30, right: 30, height: 70, borderTop: `1px dashed ${C.creamFaint}`, opacity: 0.5 }} />;
            }
            return (
              <Reveal key={r.label} at={b.rows[i] - 2} x={-30} style={{ position: "absolute", top: 58 + i * 80, left: 30, right: 30 }}>
                <div
                  style={{
                    height: 72,
                    padding: "0 14px",
                    borderRadius: 6,
                    display: "grid",
                    gridTemplateColumns: "1.25fr 1fr 1.25fr",
                    alignItems: "center",
                    background: active ? (isWin ? "rgba(242,169,59,0.16)" : "rgba(237,228,204,0.06)") : "transparent",
                    boxShadow: active ? `inset 4px 0 0 ${isWin ? C.amber : frozen ? C.red : C.cream}` : undefined,
                    opacity: dim,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <Lettering size={44} color={tone}>
                      {r.label}
                    </Lettering>
                    {r.ball && (
                      <Lettering size={32} font="body" color={r.ball === "4" ? C.amber : r.ball === "WD" ? C.creamDim : C.cream} spacing="0.06em">
                        {r.ball === "WD" ? "+1 WIDE" : r.ball === "0" ? "DOT" : r.ball === "4" ? "FOUR" : `${r.ball} RUN`}
                      </Lettering>
                    )}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <Lettering size={48} color={tone}>
                      {r.score}
                    </Lettering>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Lettering size={isWin ? 50 : 46} color={isWin ? C.amber : i === 6 ? C.red : C.cream} style={isWin ? { textShadow: `0 0 16px ${C.amberGlow}` } : undefined}>
                      {r.need}
                    </Lettering>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </Panel>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const s7Beats = (fps: number) => ({
  ulva: voStart(fps, "s7"),
  title: sentence(fps, "s7", 1).from,
  heroes: sentence(fps, "s7", 1).from - 10,
  brand: sentence(fps, "s7", 2).from - 4,
});

// ---------------- SCENE 7 — THE LEGACY ----------------
export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const title = useAt(b.title, theme.spring.smooth);
  const lit = [0, 1, 2, 3, 4].map((i) => interpolate(frame, [4 + i * 5, 12 + i * 5], [0, 1], CLAMP));
  return (
    <SceneShell push={0} pull={0.06} turnOut={false}>
      <Panel x={60} y={226} w={960} h={222} delay={0} seed={701} glow={C.amberGlow} glowOn={0.7}>
        <div style={{ position: "absolute", top: 24, width: "100%", textAlign: "center" }}>
          <Lettering size={28} font="body" color={C.amber} spacing="0.32em">
            U19 ASIA CUP 2026 · INDIA {india.final.runs}/{india.final.wickets}
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 66, width: "100%", textAlign: "center" }}>
          <Lettering size={100}>INDIA — CHAMPIONS</Lettering>
        </div>
        <div style={{ position: "absolute", top: 170, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 14, opacity: interpolate(title, [0, 0.5], [0, 1], CLAMP) }}>
          <Lamp color={C.amber} glow={C.amberGlow} on={1} size={18} />
          <Lettering size={30} font="body" spacing="0.2em">
            9TH U19 ASIA CUP TITLE
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={466} w={960} h={232} delay={2} seed={702}>
        <div style={{ position: "absolute", top: 16, left: 0 }}>
          <MilestoneRail w={960} lit={lit} />
        </div>
      </Panel>
      <Panel x={60} y={716} w={960} h={130} delay={b.ulva - 4} seed={703}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 50px" }}>
          <Lettering size={70}>{india.ulva.name}</Lettering>
          <Lettering size={76} color={C.amber} style={{ textShadow: `0 0 18px ${C.amberGlow}` }}>
            {india.ulva.runs}* ({india.ulva.balls})
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={864} w={960} h={256} delay={b.heroes} seed={704}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Lettering size={76}>HEROES ARE NOT ALWAYS AT</Lettering>
          <Lettering size={76} color={C.amber} style={{ textShadow: `0 0 20px ${C.amberGlow}` }}>
            THE TOP OF THE SCORECARD.
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={1138} w={960} h={200} delay={b.brand} seed={705}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Lettering size={92} spacing="0.04em">
            BEYOND THE SCOREBOARD
          </Lettering>
          <Lettering size={24} font="body" weight={500} color={C.creamDim} spacing="0.16em">
            CRICKET HAS STORIES BEYOND NUMBERS.
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};
