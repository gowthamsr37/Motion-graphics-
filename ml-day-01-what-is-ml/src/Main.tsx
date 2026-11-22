// 100 Days of ML, Day 1, in the NOTEBOOK look. Every scene is a page of the notebook; scenes change with a real page turn
// (the outgoing page, with its drawings, hinges at the left edge and swings away over the next page).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { ease } from "./components/Motion";
import { NBCaptions } from "./components/NBCaptions";
import { Paper } from "./components/NB";
import { S10Rule } from "./scenes/S10Rule";
import { S11Poll } from "./scenes/S11Poll";
import { S1Title } from "./scenes/S1Title";
import { S2Hook } from "./scenes/S2Hook";
import { S3OldWay } from "./scenes/S3OldWay";
import { S4Flip } from "./scenes/S4Flip";
import { S5Define } from "./scenes/S5Define";
import { S6Learn } from "./scenes/S6Learn";
import { S7Model } from "./scenes/S7Model";
import { S8Types } from "./scenes/S8Types";
import { S9Circles } from "./scenes/S9Circles";
import { SoundTrack } from "./SoundTrack";
import { nb, theme } from "./theme";
import { SCENE_IDS, sceneRange, totalFrames } from "./timing";

const SCENES: Record<string, React.FC> = { s1: S1Title, s2: S2Hook, s3: S3OldWay, s4: S4Flip, s5: S5Define, s6: S6Learn, s7: S7Model, s8: S8Types, s9: S9Circles, s10: S10Rule, s11: S11Poll };
export const TURN = 16; // frames a page turn takes (the outgoing page overlaps the next one)

const Page: React.FC<{ dur: number; seed: number; last: boolean; children: React.ReactNode }> = ({ dur, seed, last, children }) => {
  const frame = useCurrentFrame();
  const k = last ? 0 : ease(frame, [dur, dur + TURN], [0, 1], theme.ease.inOut);
  const ang = -k * 100;
  return (
    <AbsoluteFill style={{ perspective: 2600, perspectiveOrigin: "0% 50%" }}>
      <AbsoluteFill
        style={{
          transformOrigin: "0% 50%",
          transform: `rotateY(${ang}deg)`,
          boxShadow: k > 0 ? `${30 * k}px 0 ${60 * k}px rgba(60, 40, 10, ${0.35 * Math.sin(Math.PI * k)})` : "none",
          opacity: k > 0.92 ? 1 - (k - 0.92) / 0.08 : 1,
          overflow: "hidden",
        }}
      >
        <Paper seed={seed} />
        {children}
        {/* the page darkens as it lifts */}
        {k > 0 ? <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(40,25,5,${0.05 * k}) 0%, rgba(40,25,5,${0.28 * k}) 100%)` }} /> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MLDay01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = totalFrames(fps);
  const fadeOut = ease(frame, [total - 14, total - 1], [0, 1], theme.ease.in);
  const ids = [...SCENE_IDS];
  return (
    <AbsoluteFill style={{ background: nb.paper }}>
      <Paper seed={99} />
      {/* earlier pages sit on top, so the outgoing page turns over the incoming one */}
      {ids
        .map((id, i) => ({ id, i }))
        .reverse()
        .map(({ id, i }) => {
          const s = sceneRange(fps, id);
          const Comp = SCENES[id];
          const last = i === ids.length - 1;
          return (
            <Sequence key={id} from={s.from} durationInFrames={s.duration + (last ? 0 : TURN)} name={id}>
              <Page dur={s.duration} seed={i + 1} last={last}>
                {Comp ? <Comp /> : null}
              </Page>
            </Sequence>
          );
        })}
      <NBCaptions />
      <AbsoluteFill style={{ background: "#1A1408", opacity: fadeOut, pointerEvents: "none" }} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
