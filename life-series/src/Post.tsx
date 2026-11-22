import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useVideoConfig } from "remotion";
import { ACCENTS } from "./lib/theme";
import { Finish, FontFaces, Ground } from "./lib/ui";
import { FormatModule, Post as PostT } from "./types";
import { pile } from "./formats/pile";
import { squiggle } from "./formats/squiggle";
import { iceberg } from "./formats/iceberg";
import { compound } from "./formats/compound";
import { valley } from "./formats/valley";
import { bamboo } from "./formats/bamboo";
import { domino } from "./formats/domino";

export const FORMATS: Record<PostT["format"], FormatModule> = { pile, squiggle, iceberg, compound, valley, bamboo, domino };

export const PostFilm: React.FC<{ p: PostT }> = ({ p }) => {
  const { durationInFrames } = useVideoConfig();
  const M = FORMATS[p.format];
  const accent = ACCENTS[p.accent % ACCENTS.length];
  return (
    <AbsoluteFill>
      <FontFaces />
      <Ground />
      <Audio src={staticFile(`audio/music/m${p.music % 6}.wav`)} volume={(f) => 0.42 * interpolate(f, [durationInFrames - 40, durationInFrames - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <M.Comp p={p} accent={accent} />
      <Finish />
    </AbsoluteFill>
  );
};
