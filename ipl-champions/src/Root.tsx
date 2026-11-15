import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { IPLChampions } from "./Main";
import { sections } from "./timing";

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <Composition
    id="IPLChampions"
    component={IPLChampions}
    durationInFrames={sections(FPS).total}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
