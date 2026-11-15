// Scenes 3–4: four centuries, nine stitches.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "../components/Motion";
import { Lamp, Lettering, Panel } from "../components/Panel";
import { SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { centuries } from "../data";
import { theme } from "../theme";
import { wordAt } from "../timing";
import { Divider, Reveal, useAt, useFlip } from "./common";

const C = theme.colors;

export const centuryBeats = (fps: number) => [
  wordAt(fps, "s3", "100", 0.0),
  wordAt(fps, "s3", "108", 2.02),
  wordAt(fps, "s3", "109", 4.34),
  wordAt(fps, "s3", "113", 7.3),
];

// ---------------- SCENE 3 — FOUR CENTURIES (the century register) ----------------
export const S3: React.FC = () => {
  const { fps } = useVideoConfig();
  const at = centuryBeats(fps);
  const flips = [useFlip(at[0], 2), useFlip(at[1], 2), useFlip(at[2], 2), useFlip(at[3], 2)];
  const done = at[3] + 10; // lands with the fourth hundred
  return (
    <SceneShell push={0.035}>
      <Panel x={60} y={228} w={960} h={112} delay={0} seed={301}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={80}>IPL 2016 — FOUR HUNDREDS</Lettering>
        </div>
      </Panel>
      {centuries.map((c, i) => (
        <Panel key={c.date} x={60} y={358 + i * 196} w={960} h={180} delay={at[i] - 7} seed={310 + i} glow={C.amberGlow} glowOn={i === 3 ? 0.8 : 0.35}>
          <div style={{ position: "absolute", left: 44, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 16 }}>
            <Plates
              text={c.score + (c.notOut ? "*" : " ")}
              prev={"000" + (c.notOut ? "*" : " ")}
              progress={flips[i]}
              w={92}
              h={128}
              gap={8}
              color={C.amber}
              glow={C.amberGlow}
            />
            <Lettering size={50} color={C.cream} style={{ marginLeft: 6 }}>
              ({c.balls})
            </Lettering>
          </div>
          <div style={{ position: "absolute", right: 44, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 10 }}>
            <Lettering size={c.opponent.length > 16 ? 46 : 56}>{c.opponent}</Lettering>
            <Lettering size={22} font="body" weight={500} color={C.creamDim} spacing="0.22em">
              {c.date}
            </Lettering>
          </div>
        </Panel>
      ))}
      <Panel x={60} y={1144} w={960} h={130} delay={done} seed={320} glow={C.amberGlow} glowOn={1}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <Lamp color={C.amber} glow={C.amberGlow} on={1} />
          <Lettering size={70} color={C.amber} style={{ textShadow: `0 0 22px ${C.amberGlow}` }}>
            04 CENTURIES — ONE SEASON
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

export const s4Beats = (fps: number) => ({
  balls: wordAt(fps, "s4", "50", 0.0),
  stitches: wordAt(fps, "s4", "stitches", 1.3),
  century: wordAt(fps, "s4", "century", 3.34),
  unreal: wordAt(fps, "s4", "scorecard", 4.7),
});

// ---------------- SCENE 4 — NINE STITCHES, ONE HUNDRED ----------------
export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  // The counter climbs to 100 on "century", then on to 113.
  const runs = Math.round(
    frame < b.century
      ? interpolate(frame, [b.balls + 6, b.century], [0, 99], { easing: theme.ease.soft, ...CLAMP })
      : interpolate(frame, [b.century, b.century + 4, b.century + 22], [99, 100, 113], { easing: theme.ease.out, ...CLAMP }),
  );
  const ballsP = useAt(b.balls, theme.spring.snappy);
  const hundred = useAt(b.century, theme.spring.smooth);
  return (
    <SceneShell push={0.08}>
      <Panel x={60} y={228} w={960} h={318} delay={0} seed={401}>
        <div style={{ position: "absolute", top: 32, width: "100%", textAlign: "center" }}>
          <Lettering size={28} font="body" color={C.amber} spacing="0.32em">
            18 MAY 2016
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 82, width: "100%", textAlign: "center" }}>
          <Lettering size={92}>RCB v KINGS XI PUNJAB</Lettering>
        </div>
        <Divider y={196} />
        <div style={{ position: "absolute", top: 222, left: 50, right: 50, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Lettering size={26} font="body" color={C.creamDim} spacing="0.24em">
            MATCH
          </Lettering>
          <Lettering size={56}>15 OVERS PER SIDE · RAIN</Lettering>
        </div>
      </Panel>
      <Panel x={60} y={566} w={960} h={430} delay={2} seed={402} glow={C.amberGlow} glowOn={Math.min(1, hundred)}>
        <div style={{ position: "absolute", top: 32, width: "100%", textAlign: "center" }}>
          <Lettering size={64}>VIRAT KOHLI</Lettering>
        </div>
        <div style={{ position: "absolute", top: 120, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
          <Plates text={String(runs).padStart(3, "0")} w={176} h={250} gap={14} color={runs >= 100 ? C.amber : C.cream} glow={runs >= 100 ? C.amberGlow : undefined} glowOn={Math.min(1, hundred)} />
          <div style={{ opacity: interpolate(ballsP, [0, 0.5], [0, 1], CLAMP), transform: `scale(${interpolate(ballsP, [0, 1], [0.8, 1])})` }}>
            <Lettering size={96} color={C.cream}>
              (50)
            </Lettering>
          </div>
        </div>
      </Panel>
      <Panel x={60} y={1016} w={960} h={290} delay={b.stitches - 6} seed={403}>
        <Reveal at={b.stitches} style={{ position: "absolute", top: 34, left: 50, right: 50 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 96 }}>
            <Lettering size={30} font="body" color={C.creamDim} spacing="0.22em">
              HAND INJURY
            </Lettering>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Lettering size={76} color={C.red} style={{ textShadow: `0 0 18px ${C.redGlow}` }}>
                9 STITCHES
              </Lettering>
              <Lamp color={C.red} glow={C.redGlow} on={1} />
            </div>
          </div>
        </Reveal>
        <Divider y={146} />
        <Reveal at={b.unreal} style={{ position: "absolute", top: 166, left: 50, right: 50 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 96 }}>
            <Lettering size={30} font="body" color={C.creamDim} spacing="0.22em">
              STRIKE RATE
            </Lettering>
            <Lettering size={76} color={C.amber} style={{ textShadow: `0 0 18px ${C.amberGlow}` }}>
              226.00
            </Lettering>
          </div>
        </Reveal>
      </Panel>
    </SceneShell>
  );
};
