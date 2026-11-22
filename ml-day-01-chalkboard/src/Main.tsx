// 100 Days of ML, Day 1, in the NOTEBOOK look. Every scene is a page of the notebook; scenes change with a real page turn
// (the outgoing page, with its drawings, hinges at the left edge and swings away over the next page).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { ease } from "./components/Motion";
import { NBCaptions } from "./components/NBCaptions";
import { ChalkDefs, Paper } from "./components/NB";
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
import { nb, STYLE, theme } from "./theme";
import { SCENE_IDS, sceneRange, totalFrames } from "./timing";

const SCENES: Record<string, React.FC> = { s1: S1Title, s2: S2Hook, s3: S3OldWay, s4: S4Flip, s5: S5Define, s6: S6Learn, s7: S7Model, s8: S8Types, s9: S9Circles, s10: S10Rule, s11: S11Poll };
export const TURN = STYLE === "chalk" ? 20 : STYLE === "comic" ? 12 : 16; // frames a scene transition takes (the outgoing page overlaps the next one)

// chalk: the outgoing board is wiped away by an eraser sweeping left → right, leaving a dusty smear
const ChalkWipe: React.FC<{ dur: number; seed: number; last: boolean; children: React.ReactNode }> = ({ dur, last, children }) => {
  const frame = useCurrentFrame();
  const k = last ? 0 : ease(frame, [dur, dur + TURN], [0, 1], theme.ease.inOut);
  const edge = -12 + k * 124; // % across
  const ex = (edge / 100) * 1080;
  const ey = 860 + Math.sin(k * Math.PI * 7) * 520;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={k > 0 ? { WebkitMaskImage: `linear-gradient(90deg, transparent ${edge}%, black ${edge + 9}%)`, maskImage: `linear-gradient(90deg, transparent ${edge}%, black ${edge + 9}%)` } : undefined}>
        <Paper seed={1} />
        {children}
      </AbsoluteFill>
      {k > 0 && k < 1 ? (
        <>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: Math.max(0, ex), background: "linear-gradient(90deg, rgba(255,255,255,0.0), rgba(255,255,255,0.10))", filter: "blur(18px)", opacity: 1 - k * 0.6 }} />
          <div style={{ position: "absolute", left: ex - 45, top: ey - 110, width: 90, height: 220, transform: `rotate(${Math.cos(k * Math.PI * 7) * 10}deg)`, borderRadius: 10, background: "linear-gradient(90deg, #D9CBB0 0 38%, #6B4423 38% 100%)", boxShadow: "6px 10px 18px rgba(0,0,0,0.5)" }} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// comic: the outgoing panel slides off to the left with a skew and speed lines
const ComicSlide: React.FC<{ dur: number; seed: number; last: boolean; children: React.ReactNode }> = ({ dur, last, children }) => {
  const frame = useCurrentFrame();
  const k = last ? 0 : ease(frame, [dur, dur + TURN], [0, 1], theme.ease.in);
  return (
    <AbsoluteFill style={{ transform: k > 0 ? `translateX(${-k * 1250}px) skewX(${-k * 10}deg)` : undefined }}>
      <Paper seed={1} />
      {children}
      {k > 0
        ? Array.from({ length: 22 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: 1080 - ((i * 97) % 300), top: 120 + ((i * 173) % 1700), width: 300 + ((i * 61) % 400), height: i % 3 ? 5 : 9, background: i % 2 ? "#111" : "#FFFFFF", opacity: Math.sin(Math.PI * k), borderRadius: 4 }} />
          ))
        : null}
    </AbsoluteFill>
  );
};

const Page: React.FC<{ dur: number; seed: number; last: boolean; children: React.ReactNode }> = (props) => (STYLE === "chalk" ? <ChalkWipe {...props} /> : <ComicSlide {...props} />);

export const MLDay01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = totalFrames(fps);
  const fadeOut = ease(frame, [total - 14, total - 1], [0, 1], theme.ease.in);
  const ids = [...SCENE_IDS];
  return (
    <AbsoluteFill style={{ background: nb.paper }}>
      <ChalkDefs />
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
