// The film: paper → scenes → seam wipes → masthead → captions → grain/vignette → sound. Edit scenes/Story.tsx, not this.
import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions, CLAMP, Grain, Masthead, Paper, SeamWipe, Vignette } from "./components/Ed";
import { SoundTrack } from "./components/Sound";
import { STORY } from "./scenes/Story";
import { theme } from "./theme";
import { scene, totalFrames } from "./timing";

export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = totalFrames(fps);
  const warmAt = STORY.warmFrom(fps);
  const warm = interpolate(frame, [warmAt, warmAt + 40], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{ background: theme.colors.paper }}>
      <Paper warm={warm} />
      {STORY.scenes.map(([id, Comp]) => {
        const s = scene(fps, id);
        return (
          <Sequence key={id} from={s.from} durationInFrames={s.duration} name={id}>
            <Comp />
          </Sequence>
        );
      })}
      {STORY.scenes.slice(1).map(([id]) => (
        <SeamWipe key={id} at={scene(fps, id).from} />
      ))}
      {frame >= scene(fps, "s2").from && <Masthead end={end} hideAfter={STORY.mastheadOffAt(fps)} />}
      <Captions hiddenRanges={[[0, scene(fps, "s2").from], [STORY.captionsOffFrom(fps), end + 1]]} />
      <Grain />
      <Vignette />
      <AbsoluteFill style={{ background: theme.colors.paper, opacity: interpolate(frame, [end - 14, end], [0, 1], CLAMP) }} />
      <SoundTrack cues={STORY.sfx(fps)} />
    </AbsoluteFill>
  );
};
