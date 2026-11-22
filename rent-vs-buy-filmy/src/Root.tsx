import React from "react";
import { Composition, Still } from "remotion";
import { Cover } from "./Cover";
import "./fonts";
import { RentVsBuyFilmy } from "./Main";
import { totalFrames } from "./timing";

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
    {/* Instagram Reel / YouTube Short, 1080×1920, 30 fps */}
    <Composition id="RentVsBuyFilmy" component={RentVsBuyFilmy} durationInFrames={totalFrames(FPS)} fps={FPS} width={1080} height={1920} />
    <Still id="Cover" component={Cover} width={1080} height={1920} />
  </>
);
