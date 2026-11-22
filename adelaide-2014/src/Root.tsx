import React from "react";
import { Composition, Still } from "remotion";
import { Cover } from "./Cover";
import "./fonts";
import { Film } from "./Main";
import { totalFrames } from "./timing";

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
    {/* Instagram Reel, 1080×1920 (9:16), 30 fps */}
    <Composition id="Film" component={Film} durationInFrames={totalFrames(FPS)} fps={FPS} width={1080} height={1920} />
    <Still id="Cover" component={Cover} width={1080} height={1920} />
  </>
);
