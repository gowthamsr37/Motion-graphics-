import React from "react";
import { AbsoluteFill, Composition, useCurrentFrame } from "remotion";
import "./fonts";
import { Film } from "./Main";
import { Stage3D } from "./Stage3D";
import { lookdev } from "./three/lookdev";
import { FPS, totalFrames } from "./timing";

const Look: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Stage3D time={frame / 30} direct={lookdev} />
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <>
    {/* Instagram Reel, 1080×1920 (9:16), 30 fps */}
    <Composition id="Film" component={Film} durationInFrames={totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="Look" component={Look} durationInFrames={20} fps={30} width={1080} height={1920} />
  </>
);
