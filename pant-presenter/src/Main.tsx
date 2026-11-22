// The film: paper → scenes → seam wipes → masthead → captions → grain/vignette → sound. Edit scenes/Story.tsx, not this.
import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions, CLAMP, Grain, Masthead, Paper, SeamWipe, Vignette } from "./components/Ed";
import { Presenter } from "./components/Presenter";
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
      <Masthead end={end} hideAfter={STORY.mastheadOffAt(fps)} />
      <Captions hiddenRanges={[[STORY.captionsOffFrom(fps), end + 1]]} left={318} right={52} size={50} />
      <Presenter sceneStarts={STORY.scenes.map(([id]) => scene(fps, id).from)} />
      <Grain />
      <Vignette />
      <AbsoluteFill style={{ background: theme.colors.paper, opacity: interpolate(frame, [end - 14, end], [0, 1], CLAMP) }} />
      <SoundTrack cues={STORY.sfx(fps)} />
    </AbsoluteFill>
  );
};
