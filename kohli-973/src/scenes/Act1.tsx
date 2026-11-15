// Scenes 1–2: the hook, the unbelievable season.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { rng } from "../components/Board";
import { CLAMP } from "../components/Motion";
import { Lettering, Panel } from "../components/Panel";
import { SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { season } from "../data";
import { theme } from "../theme";
import { sentence, voStart, wordAt } from "../timing";
import { Reveal, useAt, useFlip } from "./common";

const C = theme.colors;

// Digits that spin until `stopAt`, then land on `target` with a flip.
const Spinner: React.FC<{ target: string; stopAt: number; seed: number; w: number; h: number; color?: string; glow?: string }> = ({ target, stopAt, seed, w, h, color = C.cream, glow }) => {
  const frame = useCurrentFrame();
  const r = rng(Math.floor(frame / 2) * 7 + seed);
  const spinning = frame < stopAt;
  const text = spinning ? target.split("").map(() => String(Math.floor(r() * 10))).join("") : target;
  const flip = useFlip(stopAt, 2);
  const p = useAt(stopAt + 4, theme.spring.smooth);
  return (
    <Plates
      text={text}
      prev={spinning ? undefined : "0".repeat(target.length)}
      progress={spinning ? () => 1 : flip}
      w={w}
      h={h}
      gap={16}
      color={spinning ? C.cream : color}
      glow={spinning ? undefined : glow}
      glowOn={Math.min(1, p)}
      blur={spinning ? 2.2 : 0}
    />
  );
};

// ---------------- SCENE 1 — THE HOOK ----------------
export const S1: React.FC = () => {
  const { fps } = useVideoConfig();
  const stop27 = wordAt(fps, "s1", "from", 0.3); // as "twenty-seven" finishes
  const stop8 = wordAt(fps, "s1", "8", 1.74);
  return (
    <SceneShell turnIn={false} push={0.05}>
      <Panel x={60} y={228} w={960} h={112} delay={-30} seed={101}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={92} color={C.amber} style={{ textShadow: `0 0 22px ${C.amberGlow}` }}>
            IPL 2016
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={360} w={960} h={168} delay={stop8 + 2} seed={102}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={150} spacing="0.03em">
            VIRAT KOHLI
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={548} w={960} h={372} delay={-30} seed={103} glow={C.amberGlow} glowOn={0.5}>
        <div style={{ position: "absolute", left: 50, top: 42 }}>
          <Spinner target="27" stopAt={stop27} seed={3} w={200} h={288} color={C.amber} glow={C.amberGlow} />
        </div>
        <div style={{ position: "absolute", left: 500, top: 0, bottom: 0, right: 40, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
          <Lettering size={84}>RUNS SHORT</Lettering>
          <Lettering size={84}>OF 1,000</Lettering>
        </div>
      </Panel>
      <Panel x={60} y={940} w={960} h={372} delay={-30} seed={104} glow={C.redGlow} glowOn={0.45}>
        <div style={{ position: "absolute", left: 50, top: 42 }}>
          <Spinner target="8" stopAt={stop8} seed={11} w={200} h={288} color={C.red} glow={C.redGlow} />
        </div>
        <div style={{ position: "absolute", left: 300, top: 0, bottom: 0, right: 40, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
          <Lettering size={84}>RUNS SHORT OF</Lettering>
          <Lettering size={84}>THE TROPHY</Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

// ---------------- SCENE 2 — THE UNBELIEVABLE SEASON ----------------
export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const countFrom = wordAt(fps, "s2", "973", 0.86);
  const countTo = wordAt(fps, "s2", "runs", 2.54) + 4;
  const runs = Math.round(interpolate(frame, [countFrom, countTo], [0, season.runs], { easing: theme.ease.out, ...CLAMP }));
  const landed = frame >= countTo;
  const glow = useAt(countTo, theme.spring.smooth);
  const avg = sentence(fps, "s2", 1).from;
  const rows: { label: string; value: string; at: number; tone?: string }[] = [
    { label: "INNINGS", value: String(season.innings), at: wordAt(fps, "s2", "16", 3.4) },
    { label: "AVERAGE", value: season.average, at: avg },
    { label: "STRIKE RATE", value: season.strikeRate, at: avg + 12 },
    { label: "CENTURIES", value: season.hundreds, at: sentence(fps, "s2", 2).from, tone: C.amber },
    { label: "FIFTIES", value: season.fifties, at: sentence(fps, "s2", 3).from },
  ];
  const flips = [useFlip(rows[0].at, 2), useFlip(rows[1].at, 2), useFlip(rows[2].at, 2), useFlip(rows[3].at, 2), useFlip(rows[4].at, 2)];
  return (
    <SceneShell push={0.035}>
      <Panel x={60} y={228} w={960} h={118} delay={0} seed={201}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Lettering size={78}>VIRAT KOHLI — 2016</Lettering>
          <Lettering size={20} font="body" color={C.creamDim} spacing="0.3em">
            ROYAL CHALLENGERS BANGALORE
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={364} w={960} h={430} delay={2} seed={202} glow={C.amberGlow} glowOn={Math.min(1, glow)}>
        <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
          <Lettering size={28} font="body" color={C.creamDim} spacing="0.4em">
            RUNS
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 82, width: "100%", display: "flex", justifyContent: "center" }}>
          <Plates
            text={String(runs).padStart(3, "0")}
            w={226}
            h={318}
            gap={18}
            color={landed ? C.amber : C.cream}
            glow={landed ? C.amberGlow : undefined}
            glowOn={Math.min(1, glow)}
            blur={!landed && frame > countFrom ? 1.6 : 0}
          />
        </div>
      </Panel>
      <Panel x={60} y={812} w={960} h={528} delay={8} seed={203}>
        {rows.map((r, i) => (
          <Reveal key={r.label} at={r.at - 4} style={{ position: "absolute", top: 26 + i * 98, left: 56, right: 56 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 86 }}>
              <Lettering size={30} font="body" color={C.creamDim} spacing="0.24em">
                {r.label}
              </Lettering>
              <div style={{ flex: 1, margin: "0 28px", borderTop: `3px dotted ${C.creamFaint}` }} />
              <Plates text={r.value} prev={r.value.replace(/\d/g, "0")} progress={flips[i]} w={54} h={74} gap={6} color={r.tone ?? C.cream} glow={r.tone ? C.amberGlow : undefined} />
            </div>
          </Reveal>
        ))}
      </Panel>
    </SceneShell>
  );
};

export const s1Stops = (fps: number) => ({ stop27: wordAt(fps, "s1", "from", 0.3), stop8: wordAt(fps, "s1", "8", 1.74), vo: voStart(fps, "s1") });
