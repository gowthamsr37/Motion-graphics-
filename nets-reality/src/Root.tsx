import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import S from "./schedule.json";

export const Root: React.FC = () => (
  <Composition id="Film" component={Film} durationInFrames={S.total} fps={30} width={1080} height={1920} />
);
