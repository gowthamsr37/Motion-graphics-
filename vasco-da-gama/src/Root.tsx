import React from "react";
import { Composition, Still } from "remotion";
import { Thumbnail } from "./Thumbnail";
import "./fonts";
import { VascoPilot } from "./Main";
import { totalFrames } from "./timing";

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
    {/* YouTube, 1920×1080 (16:9), 30 fps */}
    <Composition id="VascoPilot" component={VascoPilot} durationInFrames={totalFrames(FPS)} fps={FPS} width={1920} height={1080} />
    <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} />
  </>
);
