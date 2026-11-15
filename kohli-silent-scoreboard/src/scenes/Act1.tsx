// Scenes 1–3: the hook, before the silence, three years of struggle.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { rng } from "../components/Board";
import { LineChart } from "../components/Chart";
import { CLAMP } from "../components/Motion";
import { Lamp, Lettering, Panel } from "../components/Panel";
import { PhotoPlate, SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { averages } from "../data";
import { theme } from "../theme";
import { sentence, voStart, wordAt } from "../timing";
import { Divider, Reveal, useAt, useFlip } from "./common";

const C = theme.colors;

// ---------------- SCENE 1 — THE HOOK ----------------
export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const land = voStart(fps, "s1"); // 1021 lands as the voice says it
  const without = wordAt(fps, "s1", "without", 3.6);
  const r = rng(Math.floor(frame / 2) + 17);
  const spinning = frame < land;
  const shown = spinning ? Array.from({ length: 4 }).map(() => Math.floor(r() * 10)).join("") : "1021";
  const flip = useFlip(land, 2);
  return (
    <SceneShell turnIn={false} push={0.05}>
      <Panel x={60} y={226} w={960} h={124} delay={3} seed={11}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={86} spacing="0.04em">
            BEYOND THE SCOREBOARD
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={372} w={960} h={196} delay={9} seed={12}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={172} spacing="0.03em">
            VIRAT KOHLI
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={590} w={960} h={520} delay={0} seed={13} glow={C.amberGlow} glowOn={spinning ? 0 : 0.6}>
        <div style={{ position: "absolute", top: 46, width: "100%", display: "flex", justifyContent: "center" }}>
          <Plates text={shown} prev={spinning ? undefined : "0000"} progress={spinning ? () => 1 : flip} w={192} h={286} gap={18} blur={spinning ? 2.5 : 0} />
        </div>
        <div style={{ position: "absolute", top: 360, width: "100%", textAlign: "center", opacity: spinning ? 0.15 : 1 }}>
          <Lettering size={128} color={C.amber} style={{ textShadow: `0 0 26px ${C.amberGlow}` }}>
            DAYS
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={1132} w={960} h={150} delay={without - 6} seed={14}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={44} font="body" spacing="0.14em">
            WITHOUT AN INTERNATIONAL CENTURY
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

// ---------------- SCENE 2 — BEFORE THE SILENCE ----------------
export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scored = wordAt(fps, "s2", "scored", 1.8);
  const fadeAt = sentence(fps, "s2", 1).from;
  const warm = 1 - interpolate(frame, [fadeAt - 4, fadeAt + Math.round(fps * 1.6)], [0, 1], { easing: theme.ease.soft, ...CLAMP });
  const flip = useFlip(scored, 3);
  const lamp = useAt(scored + 10);
  return (
    <SceneShell>
      <Panel x={60} y={226} w={960} h={640} delay={2} seed={21} glow={C.amberGlow} glowOn={Math.min(1, lamp) * warm}>
        <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center" }}>
          <Lettering size={30} font="body" color={C.creamDim} spacing="0.3em">
            TEST MATCH · SCORECARD
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 92, width: "100%", textAlign: "center" }}>
          <Lettering size={100}>INDIA v BANGLADESH</Lettering>
        </div>
        <div style={{ position: "absolute", top: 204, width: "100%", textAlign: "center" }}>
          <Lettering size={30} font="body" weight={500} color={C.creamDim}>
            23 NOV 2019 · EDEN GARDENS, KOLKATA
          </Lettering>
        </div>
        <Divider y={262} />
        <div style={{ position: "absolute", top: 300, left: 50, right: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Lettering size={92}>VIRAT KOHLI</Lettering>
          <Plates text="136" prev="000" progress={flip} w={104} h={148} gap={10} color={C.amber} glow={C.amberGlow} glowOn={warm} />
        </div>
        <Divider y={486} />
        <div style={{ position: "absolute", top: 516, left: 50, right: 50, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <Lettering size={24} font="body" color={C.creamDim} spacing="0.24em">
              FORMAT
            </Lettering>
            <Lettering size={70}>TEST</Lettering>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Lettering size={24} font="body" color={C.creamDim} spacing="0.24em">
              RESULT
            </Lettering>
            <Lettering size={70} color={warm > 0.5 ? C.amber : C.cream} style={{ opacity: interpolate(lamp, [0, 0.5], [0.12, 1], CLAMP) }}>
              CENTURY
            </Lettering>
            <Lamp color={C.amber} glow={C.amberGlow} on={Math.min(1, lamp) * warm} />
          </div>
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 60, top: 890 }}>
        <PhotoPlate
          src="photos/trent-bridge-2018.jpg"
          w={960}
          h={400}
          position="50% 18%"
          warmth={0.15 + 0.85 * warm}
          delay={8}
          credit="KOHLI AFTER A TEST HUNDRED · TRENT BRIDGE, AUG 2018 · PHOTO: DUN.CAN, CC BY 2.0"
        />
      </div>
    </SceneShell>
  );
};

// ---------------- SCENE 3 — THREE YEARS OF STRUGGLE ----------------
export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const rows = averages.slice(0, 4);
  const at = [
    wordAt(fps, "s3", "68", 1.6),
    wordAt(fps, "s3", "19", 3.6),
    wordAt(fps, "s3", "28", 6.6),
    wordAt(fps, "s3", "26", 9.6),
  ];
  const caption = Math.min(at[3] + Math.round(fps * 0.8), durationInFrames - Math.round(fps * 2));
  const frameOf = (i: number) => useFlip(at[i] + 2, 2);
  const flips = [frameOf(0), frameOf(1), frameOf(2), frameOf(3)];
  const reveal = rows.map((_, i) => interpolate(frame, [at[i], at[i] + Math.round(fps * 0.6)], [0, 1], { easing: theme.ease.out, ...CLAMP }));
  const thr = interpolate(frame, [caption - 10, caption + 10], [0, 1], { easing: theme.ease.out, ...CLAMP });
  return (
    <SceneShell>
      <Panel x={60} y={226} w={960} h={112} delay={0} seed={31}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
          <Lettering size={82}>TEST BATTING AVERAGE</Lettering>
        </div>
      </Panel>
      <Panel x={60} y={356} w={960} h={404} delay={4} seed={32}>
        <div style={{ position: "absolute", top: 26, left: 60, right: 60, display: "grid", gridTemplateColumns: "200px 150px 1fr 60px", alignItems: "center" }}>
          {["YEAR", "TESTS", "AVERAGE", ""].map((h) => (
            <Lettering key={h} size={22} font="body" color={C.creamDim} spacing="0.24em">
              {h}
            </Lettering>
          ))}
        </div>
        {rows.map((r, i) => (
          <Reveal key={r.year} at={at[i] - 2} style={{ position: "absolute", top: 70 + i * 82, left: 60, right: 60 }}>
            <div style={{ display: "grid", gridTemplateColumns: "200px 150px 1fr 60px", alignItems: "center", height: 76 }}>
              <Lettering size={64}>{r.year}</Lettering>
              <Lettering size={36} font="body" weight={500} color={C.creamDim}>
                {r.tests}
              </Lettering>
              <Plates
                text={r.avg.toFixed(2)}
                prev="00.00"
                progress={flips[i]}
                w={54}
                h={70}
                gap={6}
                color={r.tone === "amber" ? C.amber : C.red}
                glow={r.tone === "amber" ? C.amberGlow : C.redGlow}
                glowOn={0.7}
              />
              <Lamp color={r.tone === "amber" ? C.amber : C.red} glow={r.tone === "amber" ? C.amberGlow : C.redGlow} on={1} />
            </div>
          </Reveal>
        ))}
      </Panel>
      <Panel x={60} y={778} w={960} h={436} delay={8} seed={33}>
        <div style={{ position: "absolute", top: 10, left: 0 }}>
          <LineChart
            w={960}
            h={420}
            points={rows.map((r) => ({ year: r.year, value: r.avg, color: r.tone === "amber" ? C.amber : C.red, glow: r.tone === "amber" ? C.amberGlow : C.redGlow }))}
            reveal={reveal}
            slots={4}
            threshold={{ value: 30, on: thr, label: "BELOW 30" }}
          />
        </div>
      </Panel>
      <Panel x={60} y={1232} w={960} h={108} delay={caption} seed={34}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <Lamp color={C.red} glow={C.redGlow} on={1} size={22} />
          <Lettering size={33} font="body" spacing="0.1em">
            THREE CONSECUTIVE CALENDAR YEARS BELOW 30
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

