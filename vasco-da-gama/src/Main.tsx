import React from "react";
import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BaseMap, camAt, CompassRose, MapProvider, Parchment } from "./components/Map";
import { CLAMP } from "./components/Motion";
import { FadeEdges, Grade, Grain, Vignette } from "./components/Overlays";
import { cameraKeys, S1, S2, S3, S4, S5 } from "./scenes/Story";
import { theme } from "./theme";
import { scene, SceneId, sentence, totalFrames, voCues } from "./timing";

const SCENES: [SceneId, React.FC][] = [["s1", S1], ["s2", S2], ["s3", S3], ["s4", S4], ["s5", S5]];

const Sfx: React.FC<{ at: number; file: string; volume: number }> = ({ at, file, volume }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`audio/${file}`)} volume={volume} />
  </Sequence>
);

const useDuck = (open: number, ducked: number) => {
  const { fps } = useVideoConfig();
  const cues = voCues(fps);
  const ramp = Math.round(fps / 3);
  return (f: number) => {
    let d = 0;
    for (const c of cues) {
      const a = c.from - 4, b = c.from + c.duration + 4;
      if (f < a - ramp || f > b + ramp) continue;
      d = Math.max(d, interpolate(f, [a - ramp, a, b, b + ramp], [0, 1, 1, 0], { easing: theme.ease.inOut, ...CLAMP }));
    }
    return interpolate(d, [0, 1], [open, ducked]);
  };
};

const SoundTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const A = (id: SceneId, i: number, rel = 0) => scene(fps, id).from + sentence(fps, id, i).from + rel;
  const music = useDuck(0.6, 0.2);
  const sea = useDuck(0.5, 0.3);
  const noVo = Boolean(getInputProps().noVo);
  return (
    <>
      <Audio src={staticFile("audio/score.wav")} volume={music} />
      <Audio src={staticFile("audio/sea.wav")} volume={sea} />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={noVo ? 0 : 1} />
        </Sequence>
      ))}
      {/* s1 */}
      <Sfx at={A("s1", 0, 2)} file="parchment.wav" volume={0.35} />
      <Sfx at={A("s1", 0, 20)} file="creak.wav" volume={0.3} />
      <Sfx at={A("s1", 1, 40)} file="whoosh.wav" volume={0.25} />
      <Sfx at={A("s1", 1, 50)} file="quill.wav" volume={0.3} />
      <Sfx at={A("s1", 3, 30)} file="thud.wav" volume={0.4} />
      {/* s2 */}
      <Sfx at={A("s2", 0, -4)} file="parchment.wav" volume={0.35} />
      <Sfx at={A("s2", 0, 22)} file="seeds.wav" volume={0.35} />
      <Sfx at={A("s2", 2, 60)} file="chime.wav" volume={0.22} />
      <Sfx at={A("s2", 2, 90)} file="chime.wav" volume={0.18} />
      <Sfx at={A("s2", 3, 0)} file="whoosh.wav" volume={0.22} />
      {/* s3 */}
      {[1, 2, 3].map((i) => <Sfx key={`q${i}`} at={A("s3", i, 4)} file="quill.wav" volume={0.26} />)}
      {[8, 22, 36, 50].map((d, i) => <Sfx key={`c${i}`} at={A("s3", 4, d)} file="coin.wav" volume={0.32} />)}
      <Sfx at={A("s3", 5, 20)} file="coins.wav" volume={0.35} />
      <Sfx at={A("s3", 6, 8)} file="seal.wav" volume={0.35} />
      <Sfx at={A("s3", 6, 26)} file="seal.wav" volume={0.3} />
      <Sfx at={A("s3", 7, 30)} file="drum.wav" volume={0.4} />
      {/* s4 */}
      <Sfx at={A("s4", 0, 0)} file="whoosh.wav" volume={0.22} />
      <Sfx at={A("s4", 1, 10)} file="wind.wav" volume={0.3} />
      <Sfx at={A("s4", 2, 40)} file="quill.wav" volume={0.26} />
      <Sfx at={A("s4", 3, 6)} file="thud.wav" volume={0.3} />
      <Sfx at={A("s4", 4, 10)} file="thud.wav" volume={0.3} />
      <Sfx at={A("s4", 5, 10)} file="creak.wav" volume={0.28} />
      <Sfx at={A("s4", 6, 0)} file="swell.wav" volume={0.4} />
      {/* s5 */}
      <Sfx at={A("s5", 0, 20)} file="creak.wav" volume={0.3} />
      <Sfx at={A("s5", 2, 30)} file="wind.wav" volume={0.32} />
      <Sfx at={A("s5", 3, 4)} file="thud.wav" volume={0.4} />
      <Sfx at={A("s5", 4, 70)} file="swell.wav" volume={0.45} />
    </>
  );
};

export const VascoPilot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = camAt(cameraKeys(fps), frame);
  const A = (id: SceneId, i: number) => scene(fps, id).from + sentence(fps, id, i).from;
  // Portugal highlighted when the story is about it
  const pt =
    interpolate(frame, [A("s1", 3), A("s1", 3) + 15, A("s1", 4), A("s1", 4) + 15], [0, 1, 1, 0], CLAMP) +
    interpolate(frame, [A("s4", 0) + 40, A("s4", 0) + 60, A("s4", 2) + 40, A("s4", 2) + 60], [0, 1, 1, 0.35], CLAMP) * (frame < scene(fps, "s5").from ? 1 : 0);
  const rose = interpolate(frame, [A("s4", 1) + 20, A("s4", 1) + 60], [0.35, 0.9], CLAMP);
  return (
    <AbsoluteFill style={{ background: theme.colors.parchment }}>
      <Parchment />
      <MapProvider cam={cam}>
        <BaseMap highlight={[{ id: "620", color: theme.colors.red, p: pt }]} />
        <CompassRose at={[-32, 22]} size={130} opacity={rose} />
        {SCENES.map(([id, Comp]) => {
          const s = scene(fps, id);
          return (
            <Sequence key={id} from={s.from} durationInFrames={s.duration} name={id}>
              <Comp />
            </Sequence>
          );
        })}
      </MapProvider>
      <Grade />
      <Vignette />
      <Grain />
      <FadeEdges fadeIn={Math.round(fps * 1.2)} fadeOut={Math.round(fps * 1.5)} total={totalFrames(fps)} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
