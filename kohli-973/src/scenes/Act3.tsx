// Scenes 5–7: the unexpected zero, the eight-run heartbreak, the legacy.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "../components/Motion";
import { Lamp, Lettering, Panel } from "../components/Panel";
import { PhotoPlate, SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { RunsChart } from "../components/RunsChart";
import { centuryInnings, duckInnings, final, season } from "../data";
import { theme } from "../theme";
import { sentence, voStart, wordAt } from "../timing";
import { Divider, Reveal, useAt, useFlip } from "./common";

const C = theme.colors;

export const s5Beats = (fps: number) => ({ reach: wordAt(fps, "s5", "919", 1.7), duck: wordAt(fps, "s5", "duck", 4.38), q1: sentence(fps, "s5", 1).from });

// ---------------- SCENE 5 — THE UNEXPECTED ZERO ----------------
export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const climb = interpolate(frame, [4, b.reach], [0, 14], { easing: theme.ease.inOut, ...CLAMP });
  const flat = interpolate(frame, [b.duck, b.duck + 10], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const lbl919 = useAt(b.reach - 2, theme.spring.snappy);
  const duckFlip = useFlip(b.duck, 0);
  const duckP = useAt(b.duck + 2, theme.spring.smooth);
  return (
    <SceneShell push={0.03}>
      <Panel x={60} y={228} w={960} h={640} delay={0} seed={501}>
        <div style={{ position: "absolute", top: 26, left: 50, right: 50, display: "flex", justifyContent: "space-between" }}>
          <Lettering size={26} font="body" spacing="0.24em">
            CUMULATIVE RUNS · IPL 2016
          </Lettering>
          <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: Math.min(1, lbl919) }}>
            <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
              RUNS AFTER 14 INNINGS
            </Lettering>
            <Lettering size={44} color={C.amber}>
              919
            </Lettering>
          </div>
        </div>
        <div style={{ position: "absolute", top: 84, left: 0 }}>
          <RunsChart
            w={960}
            h={540}
            drawn={climb + flat}
            centuries={centuryInnings}
            duck={duckInnings}
            labels={[
              { innings: 14, text: "919", color: C.amber, on: lbl919, dy: -26 },
              { innings: 15, text: "+0", color: C.red, on: duckP, dy: 52 },
            ]}
          />
        </div>
      </Panel>
      <Panel x={60} y={888} w={960} h={452} delay={b.q1 - 6} seed={502} glow={C.redGlow} glowOn={Math.min(1, duckP) * 0.7}>
        <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
          <Lettering size={28} font="body" color={C.amber} spacing="0.3em">
            QUALIFIER 1 — 24 MAY 2016
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 76, width: "100%", textAlign: "center" }}>
          <Lettering size={84}>RCB v GUJARAT LIONS</Lettering>
        </div>
        <Divider y={180} />
        <div style={{ position: "absolute", top: 202, left: 50, right: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Lettering size={80}>VIRAT KOHLI</Lettering>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Plates text="0" prev=" " progress={duckFlip} w={96} h={130} color={C.red} glow={C.redGlow} glowOn={Math.min(1, duckP)} />
            <Lettering size={70}>(2)</Lettering>
          </div>
        </div>
        <Divider y={358} />
        <div style={{ position: "absolute", top: 378, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 14, opacity: interpolate(duckP, [0, 0.5], [0, 1], CLAMP) }}>
          <Lamp color={C.green} glow={C.greenGlow} on={1} size={20} />
          <Lettering size={30} font="body" color={C.cream} spacing="0.18em">
            RCB — QUALIFIED FOR THE FINAL
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

export const s6Beats = (fps: number) => ({
  kohli: wordAt(fps, "s6", "54", 2.32) - 4,
  srh: wordAt(fps, "s6", "208", 4.3),
  rcb: wordAt(fps, "s6", "many", 5.98) - 4,
  lost: wordAt(fps, "s6", "lost", 6.9),
});

// ---------------- SCENE 6 — THE EIGHT-RUN HEARTBREAK ----------------
export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const last = interpolate(frame, [b.kohli, b.kohli + 14], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const lbl = useAt(b.kohli + 10);
  const srhFlip = useFlip(b.srh, 2);
  const rcbFlip = useFlip(b.rcb, 2);
  const lost = useAt(b.lost, theme.spring.smooth);
  const barW = 600;
  const scale = (v: number) => (v / 220) * barW;
  const bars = [
    { name: "SRH", v: final.srh.runs, at: b.srh, col: C.cream },
    { name: "RCB", v: final.rcb.runs, at: b.rcb, col: C.creamDim },
  ];
  return (
    <SceneShell push={0.03}>
      {/* the season's line completes as he makes 54 in the final… */}
      <Panel x={60} y={228} w={960} h={300} delay={0} closeAt={b.lost - 4} seed={601}>
        <div style={{ position: "absolute", top: 18, left: 46 }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.24em">
            CUMULATIVE RUNS · INNINGS 16
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 40, left: 0 }}>
          <RunsChart w={960} h={250} drawn={15 + last} compact centuries={centuryInnings} duck={duckInnings} labels={[{ innings: 16, text: "973", color: C.amber, on: lbl, dy: 6 }]} />
        </div>
      </Panel>
      {/* …and the board shows what that final became: Sunrisers with the trophy, that night. */}
      {frame >= b.lost - 2 && (
        <div style={{ position: "absolute", left: 60, top: 228 }}>
          <PhotoPlate
            src="photos/final-2016-srh-trophy.jpg"
            w={960}
            h={260}
            position="50% 38%"
            warmth={0.75}
            delay={b.lost}
            credit="SUNRISERS WITH THE TROPHY · 29 MAY 2016 · PHOTO: MSNLALITHPREM, CC0"
          />
        </div>
      )}
      <Panel x={60} y={560} w={960} h={780} delay={2} seed={602}>
        <div style={{ position: "absolute", top: 28, width: "100%", textAlign: "center" }}>
          <Lettering size={30} font="body" color={C.amber} spacing="0.3em">
            IPL FINAL — {final.date}
          </Lettering>
        </div>
        {[
          { team: final.srh, flip: srhFlip },
          { team: final.rcb, flip: rcbFlip },
        ].map((r, i) => (
          <div key={r.team.name} style={{ position: "absolute", top: 82 + i * 128, left: 46, right: 46, display: "flex", alignItems: "center", justifyContent: "space-between", height: 116 }}>
            <Lettering size={i === 0 ? 62 : 52}>{r.team.name}</Lettering>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Plates text={String(r.team.runs)} prev="000" progress={r.flip} w={70} h={100} gap={6} color={C.cream} />
              <Lettering size={64} color={C.creamDim}>
                /{r.team.wkts}
              </Lettering>
            </div>
          </div>
        ))}
        {/* proportional comparison on a 0–220 scale; the red sliver is the margin */}
        <div style={{ position: "absolute", top: 352, left: 46, right: 46 }}>
          {bars.map((bar, i) => {
            const p = interpolate(frame, [bar.at, bar.at + 18], [0, 1], { easing: theme.ease.out, ...CLAMP });
            return (
              <div key={bar.name} style={{ display: "flex", alignItems: "center", gap: 18, height: 54, marginBottom: 14 }}>
                <span style={{ width: 70, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 24, letterSpacing: "0.16em", color: C.creamDim }}>{bar.name}</span>
                <div style={{ position: "relative", width: barW, height: 40 }}>
                  <div style={{ position: "absolute", left: 0, top: 0, height: 40, width: scale(bar.v) * p, borderRadius: 4, background: bar.col, opacity: 0.85 }} />
                  {i === 1 && (
                    <div
                      style={{
                        position: "absolute",
                        left: scale(final.rcb.runs),
                        top: -68,
                        width: scale(final.srh.runs) - scale(final.rcb.runs),
                        height: 108,
                        background: C.red,
                        opacity: 0.55 * Math.min(1, lost),
                        boxShadow: `0 0 18px ${C.redGlow}`,
                      }}
                    />
                  )}
                </div>
                <span style={{ fontFamily: theme.fonts.display, fontSize: 44, color: C.cream, opacity: p }}>{bar.v}</span>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 88 + scale(final.rcb.runs) - 70, top: 120, opacity: Math.min(1, lost) }}>
            <Lettering size={48} color={C.red} style={{ textShadow: `0 0 14px ${C.redGlow}` }}>
              {final.margin} RUNS
            </Lettering>
          </div>
        </div>
        <Divider y={540} />
        <Reveal at={b.kohli} style={{ position: "absolute", top: 560, left: 46, right: 46 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 80 }}>
            <Lettering size={60}>VIRAT KOHLI</Lettering>
            <Lettering size={72} color={C.amber} style={{ textShadow: `0 0 18px ${C.amberGlow}` }}>
              {final.kohli.runs} ({final.kohli.balls})
            </Lettering>
          </div>
        </Reveal>
        <Reveal at={b.lost} style={{ position: "absolute", top: 664, left: 46, right: 46 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 80 }}>
            <Lettering size={28} font="body" color={C.creamDim} spacing="0.24em">
              RESULT
            </Lettering>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Lettering size={64} color={C.red} style={{ textShadow: `0 0 16px ${C.redGlow}` }}>
                SRH WON BY {final.margin} RUNS
              </Lettering>
              <Lamp color={C.red} glow={C.redGlow} on={1} />
            </div>
          </div>
        </Reveal>
      </Panel>
    </SceneShell>
  );
};

export const s7Beats = (fps: number) => ({
  big: voStart(fps, "s7"),
  rows: sentence(fps, "s7", 1).from,
  m1: sentence(fps, "s7", 2).from - 2,
  m2: sentence(fps, "s7", 4).from - 2,
  brand: sentence(fps, "s7", 5).from - 4,
});

// ---------------- SCENE 7 — THE LEGACY ----------------
export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const flip = useFlip(b.big, 3);
  const glow = useAt(b.big + 8, theme.spring.smooth);
  const turn = interpolate(frame, [b.m1 - 6, b.m1 + 6], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const fold = turn < 0.5 ? 1 - turn * 2 : (turn - 0.5) * 2;
  const m2 = useAt(b.m2, theme.spring.smooth);
  const rows = [
    { label: "27 SHORT OF 1,000", color: C.cream, lamp: null },
    { label: "ORANGE CAP — WON", color: C.amber, lamp: [C.amber, C.amberGlow] },
    { label: "IPL FINAL — RUNNERS-UP", color: C.red, lamp: [C.red, C.redGlow] },
  ];
  return (
    <SceneShell push={0} pull={0.07} turnOut={false}>
      <Panel x={60} y={228} w={960} h={500} delay={0} seed={701} glow={C.amberGlow} glowOn={Math.min(1, glow)}>
        <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
          <Lettering size={28} font="body" color={C.creamDim} spacing="0.3em">
            VIRAT KOHLI · IPL 2016
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 80, width: "100%", display: "flex", justifyContent: "center" }}>
          <Plates text={String(season.runs)} prev="000" progress={flip} w={240} h={340} gap={20} color={C.amber} glow={C.amberGlow} glowOn={Math.min(1, glow)} />
        </div>
      </Panel>
      <Panel x={60} y={748} w={960} h={372} delay={b.rows - 6} seed={702}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%", transform: `scaleY(${Math.max(0.02, fold)})`, filter: `brightness(${0.55 + 0.45 * fold})` }}>
          {turn < 0.5 ? (
            rows.map((r, i) => (
              <Reveal key={r.label} at={b.rows + i * 5} style={{ position: "absolute", top: 34 + i * 108, left: 56, right: 56 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 96 }}>
                  <Lettering size={72} color={r.color}>
                    {r.label}
                  </Lettering>
                  {r.lamp && <Lamp color={r.lamp[0]} glow={r.lamp[1]} on={1} />}
                </div>
              </Reveal>
            ))
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
              <Lettering size={84}>SOME SEASONS WIN TROPHIES.</Lettering>
              <div style={{ opacity: interpolate(m2, [0, 0.5], [0, 1], CLAMP), transform: `translateY(${interpolate(m2, [0, 1], [18, 0])}px)` }}>
                <Lettering size={84} color={C.amber} style={{ textShadow: `0 0 24px ${C.amberGlow}` }}>
                  SOME SEASONS BECOME HISTORY.
                </Lettering>
              </div>
            </div>
          )}
        </div>
      </Panel>
      <Panel x={60} y={1140} w={960} h={200} delay={b.brand} seed={703}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Lettering size={96} spacing="0.04em">
            BEYOND THE SCOREBOARD
          </Lettering>
          <div style={{ width: 120, height: 3, background: C.amber, boxShadow: `0 0 14px ${C.amberGlow}` }} />
        </div>
      </Panel>
    </SceneShell>
  );
};
