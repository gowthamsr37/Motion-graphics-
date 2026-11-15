import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { SilentScoreboard } from "./Main";
import { totalFrames } from "./timing";

const FPS = 30;

// Instagram Reel, 1080×1920 (9:16), 30 fps.
export const RemotionRoot: React.FC = () => (
  <Composition id="SilentScoreboard" component={SilentScoreboard} durationInFrames={totalFrames(FPS)} fps={FPS} width={1080} height={1920} />
);
