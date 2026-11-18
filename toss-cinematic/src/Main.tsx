import React from "react";
import { AbsoluteFill, Audio, getInputProps, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { O1, O2, O3, O4, O5, O6, O7, O8, O9 } from "./overlay/Scenes";
import { Subtitles } from "./overlay/Subtitles";
import { Stage3D } from "./Stage3D";
import { direct } from "./three/director";
import { theme } from "./theme";
import { sceneAt } from "./timing";

const OVERLAYS = { s1: O1, s2: O2, s3: O3, s4: O4, s5: O5, s6: O6, s7: O7, s8: O8, s9: O9 };

// Layers, bottom to top: 3D world (with its own grade, bloom and grain) → statistics & type → subtitles.
// Audio stems are attached for preview in Remotion Studio; the delivered mix is mastered by scripts/build.sh.
export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const Overlay = OVERLAYS[sceneAt(t)];
  const preview = Boolean(getInputProps().audio);
  return (
    <AbsoluteFill style={{ background: theme.colors.night, fontFamily: theme.fonts.body }}>
      <Stage3D time={t} direct={direct} />
      <Overlay />
      <Subtitles />
      {preview && (
        <>
          <Audio src={staticFile("vo/narration.wav")} />
          <Audio src={staticFile("audio/music.wav")} />
          <Audio src={staticFile("audio/sfx.wav")} />
        </>
      )}
    </AbsoluteFill>
  );
};
