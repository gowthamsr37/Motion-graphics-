import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { OrangeCapReel } from "./Main";
import { sections } from "./timing";

const FPS = 30;

// Instagram Reel: 1080×1920, 9:16.
export const RemotionRoot: React.FC = () => (
  <Composition
    id="OrangeCapReel"
    component={OrangeCapReel}
    durationInFrames={sections(FPS).total}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
