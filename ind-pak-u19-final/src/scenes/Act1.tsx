// Scenes 1–3: the impossible equation, Pakistan set the challenge, India fight back.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { rng } from "../components/Board";
import { WicketLamps } from "../components/Graphs";
import { CLAMP } from "../components/Motion";
import { Lamp, Lettering, Panel } from "../components/Panel";
import { SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { india, match, pakistan } from "../data";
import { theme } from "../theme";
import { sentence, wordAt } from "../timing";
import { Divider, Reveal, useAt, useFlip } from "./common";

const C = theme.colors;

// A number that spins until `stopAt`, lands with a flip, and spins again for the rewind.
const Counter: React.FC<{ target: string; stopAt: number; rewindAt: number; seed: number; w: number; h: number; color?: string; glow?: string }> = ({ target, stopAt, rewindAt, seed, w, h, color = C.cream, glow }) => {
  const frame = useCurrentFrame();
  const r = rng(Math.floor(frame / 2) * 13 + seed);
  const spinning = frame < stopAt || frame >= rewindAt;
  const text = spinning ? target.split("").map(() => String(Math.floor(r() * 10))).join("") : target;
  const flip = useFlip(stopAt, 2);
  return (
    <Plates text={text} prev={spinning ? undefined : "0".repeat(target.length)} progress={spinning ? () => 1 : flip} w={w} h={h} gap={12} color={spinning ? C.cream : color} glow={spinning ? undefined : glow} blur={spinning ? 2.4 : 0} />
  );
};

export const s1Beats = (fps: number, dur: number) => ({
  runs: wordAt(fps, "s1", "runs", 0.24),
  ball: wordAt(fps, "s1", "ball", 1.66),
  wicket: wordAt(fps, "s1", "wick", 3.0),
  teams: sentence(fps, "s1", 3).from,
  rewind: dur - Math.round(fps * 0.6),
});

// ---------------- SCENE 1 — THE IMPOSSIBLE EQUATION ----------------
export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const b = s1Beats(fps, durationInFrames);
  const teams = useAt(b.teams, theme.spring.snappy);
  // scoreboard lights flicker once the equation is complete
  const fl = frame - (b.wicket + 6);
  const flicker = fl >= 0 && fl < 8 ? [0.55, 1, 0.4, 0.9, 0.7, 1, 0.85, 1][fl] : 1;
  const rows = [
    { t: "3", label: ["RUNS", "NEEDED"], at: b.runs, col: C.amber, glow: C.amberGlow },
    { t: "1", label: ["BALL", "REMAINING"], at: b.ball, col: C.cream, glow: undefined },
    { t: "1", label: ["WICKET", "LEFT"], at: b.wicket, col: C.red, glow: C.redGlow },
  ];
  return (
    <SceneShell turnIn={false} push={0.05}>
      <div style={{ position: "absolute", inset: 0, filter: `brightness(${flicker})` }}>
        <Panel x={60} y={226} w={960} h={170} delay={-30} seed={101}>
          <div style={{ position: "absolute", top: 26, width: "100%", textAlign: "center" }}>
            <Lettering size={30} font="body" color={C.amber} spacing="0.32em">
              {match.title}
            </Lettering>
          </div>
          <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", opacity: interpolate(teams, [0, 0.5], [0.12, 1], CLAMP) }}>
            <Lettering size={84}>INDIA vs PAKISTAN</Lettering>
          </div>
        </Panel>
        <Panel x={60} y={414} w={960} h={118} delay={-30} seed={102}>
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 50px" }}>
            <Lettering size={66}>INDIA</Lettering>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Plates text="335" w={60} h={84} gap={6} />
              <Lettering size={60} color={C.creamDim}>
                /9
              </Lettering>
            </div>
          </div>
        </Panel>
        {rows.map((r, i) => (
          <Panel key={i} x={60} y={552 + i * 262} w={960} h={246} delay={-30} seed={103 + i} glow={r.glow} glowOn={frame >= r.at && frame < b.rewind ? 0.7 : 0}>
            <div style={{ position: "absolute", left: 60, top: 22 }}>
              <Counter target={r.t} stopAt={r.at} rewindAt={b.rewind} seed={i * 7 + 3} w={150} h={202} color={r.col} glow={r.glow} />
            </div>
            <div style={{ position: "absolute", left: 270, right: 40, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
              {r.label.map((l) => (
                <Lettering key={l} size={84}>
                  {l}
                </Lettering>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </SceneShell>
  );
};

// the count lands as the narrator finishes saying "337"
export const s2Beats = (fps: number) => ({ total: sentence(fps, "s2", 0).to, target: wordAt(fps, "s2", "338", 3.88) });

// ---------------- SCENE 2 — PAKISTAN SET THE CHALLENGE ----------------
export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const runs = Math.round(interpolate(frame, [10, b.total], [0, pakistan.total], { easing: theme.ease.out, ...CLAMP }));
  const targetFlip = useFlip(b.target, 3);
  const big = useAt(b.target, theme.spring.smooth);
  return (
    <SceneShell push={0.035}>
      <Panel x={60} y={226} w={960} h={100} delay={0} seed={201}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={30} font="body" spacing="0.3em">
            PAKISTAN U19 · 1ST INNINGS · 50 OVERS
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={344} w={960} h={262} delay={2} seed={202}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 54px" }}>
          <Lettering size={84}>PAKISTAN</Lettering>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Plates text={String(runs).padStart(3, "0")} w={118} h={168} gap={10} blur={frame < b.total && frame > 10 ? 1.5 : 0} />
            <Lettering size={96} color={C.creamDim}>
              /{pakistan.wickets}
            </Lettering>
          </div>
        </div>
      </Panel>
      <Panel x={60} y={624} w={960} h={316} delay={8} seed={203}>
        {pakistan.batters.map((p, i) => (
          <Reveal key={p.name} at={12 + i * 8} style={{ position: "absolute", top: 26 + i * 94, left: 54, right: 54 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 86 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {p.hundred && <Lamp color={C.amber} glow={C.amberGlow} on={1} size={20} />}
                <Lettering size={58} color={p.hundred ? C.amber : C.cream}>
                  {p.name}
                </Lettering>
              </div>
              <Lettering size={62} color={p.hundred ? C.amber : C.cream} style={p.hundred ? { textShadow: `0 0 16px ${C.amberGlow}` } : undefined}>
                {p.runs} ({p.balls})
              </Lettering>
            </div>
          </Reveal>
        ))}
      </Panel>
      <Panel x={60} y={958} w={960} h={382} delay={sentence(fps, "s2", 1).from - 10} seed={204} glow={C.redGlow} glowOn={Math.min(1, big)}>
        <div style={{ position: "absolute", top: 28, width: "100%", textAlign: "center" }}>
          <Lettering size={34} font="body" color={C.creamDim} spacing="0.34em">
            INDIA TARGET
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 82, width: "100%", display: "flex", justifyContent: "center" }}>
          <Plates text={String(india.target)} prev="000" progress={targetFlip} w={196} h={270} gap={18} color={C.cream} glow={C.redGlow} glowOn={Math.min(1, big)} />
        </div>
      </Panel>
    </SceneShell>
  );
};

export const s3Beats = (fps: number) => ({
  sehwag: sentence(fps, "s3", 0).from,
  lakshya: sentence(fps, "s3", 1).from,
  collapse: sentence(fps, "s3", 2).from,
  at252: wordAt(fps, "s3", "252", 5.04),
  need: sentence(fps, "s3", 2).to - 4,
});

// ---------------- SCENE 3 — INDIA FIGHT BACK (then collapse) ----------------
export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  const runs = Math.round(interpolate(frame, [b.sehwag, b.at252], [0, india.collapse.runs], { easing: theme.ease.inOut, ...CLAMP }));
  const fallen = interpolate(frame, [b.collapse + 4, b.collapse + 4 + 8 * 3], [0, 8], CLAMP);
  const frozen = frame >= b.at252;
  const need = useAt(b.need, theme.spring.smooth);
  return (
    <SceneShell push={0.035}>
      <Panel x={60} y={226} w={960} h={100} delay={0} seed={301}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={30} font="body" spacing="0.3em">
            INDIA RUN CHASE · TARGET {india.target}
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={344} w={960} h={230} delay={2} seed={302}>
        {india.chase.map((p, i) => (
          <Reveal key={p.name} at={i === 0 ? b.sehwag : b.lakshya} style={{ position: "absolute", top: 24 + i * 96, left: 54, right: 54 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 88 }}>
              <Lettering size={i === 1 ? 52 : 58}>{p.name}</Lettering>
              <Lettering size={62} color={C.amber}>
                {p.runs} ({p.balls})
              </Lettering>
            </div>
          </Reveal>
        ))}
      </Panel>
      <Panel x={60} y={592} w={960} h={280} delay={4} seed={303} glow={C.redGlow} glowOn={frozen ? 0.8 : 0}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 54px" }}>
          <Lettering size={84}>INDIA</Lettering>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Plates text={String(runs).padStart(3, "0")} w={118} h={168} gap={10} color={frozen ? C.red : C.cream} glow={frozen ? C.redGlow : undefined} blur={!frozen && frame > b.sehwag ? 1.4 : 0} />
            <Lettering size={96} color={frozen ? C.red : C.creamDim}>
              /{Math.floor(fallen)}
            </Lettering>
          </div>
        </div>
      </Panel>
      <Panel x={60} y={890} w={960} h={170} delay={6} seed={304}>
        <div style={{ position: "absolute", top: 20, width: "100%", textAlign: "center" }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.3em">
            WICKETS
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 70, width: "100%" }}>
          <WicketLamps fallen={fallen} size={50} />
        </div>
      </Panel>
      <Panel x={60} y={1078} w={960} h={262} delay={b.need - 8} seed={305} glow={C.redGlow} glowOn={Math.min(1, need) * 0.6}>
        <div style={{ position: "absolute", top: 36, width: "100%", textAlign: "center" }}>
          <Lettering size={30} font="body" color={C.creamDim} spacing="0.3em">
            TARGET {india.target}
          </Lettering>
        </div>
        <Divider y={90} />
        <div style={{ position: "absolute", top: 116, width: "100%", textAlign: "center" }}>
          <Lettering size={110} color={C.red} style={{ textShadow: `0 0 20px ${C.redGlow}` }}>
            {india.target - india.collapse.runs} RUNS NEEDED
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};
