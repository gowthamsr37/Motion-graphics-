import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { EveryoneJumps } from "./Main";
import { totalFrames } from "./timing";

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
    {/* YouTube Short, 1080×1920 (9:16), 30 fps */}
    <Composition id="EveryoneJumps" component={EveryoneJumps} durationInFrames={totalFrames(FPS)} fps={FPS} width={1080} height={1920} />
  </>
);
