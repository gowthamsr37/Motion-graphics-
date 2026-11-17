import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage3D } from "./Stage3D";
import { direct } from "./three/director";
import { theme } from "./theme";

export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: theme.colors.night, fontFamily: theme.fonts.body }}>
      <Stage3D time={frame / fps} direct={direct} />
    </AbsoluteFill>
  );
};
