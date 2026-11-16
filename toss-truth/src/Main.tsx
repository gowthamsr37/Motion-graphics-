import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions } from "./components/Captions";
import { Brand, Grade, Grain, Progress, Sky, Vignette, Whip } from "./components/Layers";
import { After, afterBeats, Dubai, dubaiBeats, Formats, formatsBeats } from "./scenes/Middle";
import { Ipl, iplBeats, Tests, testsBeats, Verdict, verdictBeats } from "./scenes/End";
import { Answer, answerBeats, Hook, hookBeats, Proof, proofBeats } from "./scenes/Open";
import { CLAMP, theme } from "./theme";
import { SCENE_IDS, SceneId, span, totalFrames, voCues } from "./timing";

const SCENES: Record<SceneId, React.FC> = { hook: Hook, proof: Proof, answer: Answer, formats: Formats, dubai: Dubai, after: After, tests: Tests, ipl: Ipl, verdict: Verdict };

const Sfx: React.FC<{ at: number; file: string; vol: number }> = ({ at, file, vol }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`sfx/${file}.wav`)} volume={vol} />
  </Sequence>
);

// music ducks under the narration with short eased ramps
const useDuck = (open: number, low: number) => {
  const { fps } = useVideoConfig();
  const cues = voCues(fps);
  const ramp = Math.round(fps * 0.18);
  return (f: number) => {
    let d = 0;
    for (const c of cues) {
      const a = c.from - 2;
      const b = c.from + c.duration + 2;
      if (f < a - ramp || f > b + ramp) continue;
      d = Math.max(d, interpolate(f, [a - ramp, a, b, b + ramp], [0, 1, 1, 0], { easing: theme.ease.soft, ...CLAMP }));
    }
    return open + (low - open) * d;
  };
};

const SoundTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const at = (id: SceneId, rel: number) => span(fps, id).from + rel;
  const music = useDuck(0.5, 0.14);
  const h = hookBeats(fps), p = proofBeats(fps), a = answerBeats(fps), f = formatsBeats(fps), d = dubaiBeats(fps), n = afterBeats(fps), t = testsBeats(fps), i = iplBeats(fps), v = verdictBeats(fps);
  const tilePer = (d.thirteen - d.chasing) / 12;
  const dayStep = (t.day5 - t.because) / 4;
  return (
    <>
      <Audio src={staticFile("sfx/music.wav")} volume={music} />
      {voCues(fps).map((c) => (
        <Sequence key={c.id} from={c.from} layout="none">
          <Audio src={staticFile(`vo/${c.id}.wav`)} volume={1} />
        </Sequence>
      ))}
      {SCENE_IDS.slice(1).map((id) => <Sfx key={id} at={span(fps, id).from - 4} file="whip" vol={0.32} />)}
      {/* hook */}
      <Sfx at={0} file="coin-flick" vol={0.6} />
      <Sfx at={2} file="whoosh" vol={0.28} />
      <Sfx at={h.w1 - 2} file="pop" vol={0.3} />
      <Sfx at={h.land} file="coin-land" vol={0.55} />
      <Sfx at={h.w2} file="impact" vol={0.55} />
      <Sfx at={h.capt} file="tile" vol={0.4} />
      <Sfx at={h.data + 3} file="buzz" vol={0.28} />
      {/* proof */}
      <Sfx at={at("proof", p.n - 2)} file="tally" vol={0.34} />
      {[0, 1, 2, 3].map((k) => <Sfx key={k} at={at("proof", p.mens + 6 + k * 5)} file="pop" vol={0.22} />)}
      {/* answer */}
      <Sfx at={at("answer", a.won)} file="tally" vol={0.26} />
      <Sfx at={at("answer", a.pct - 1)} file="impact" vol={0.6} />
      <Sfx at={at("answer", a.coin - 2)} file="coin-flick" vol={0.38} />
      {/* formats */}
      {[f.odiV, f.t20V, f.iplV].map((x, k) => <Sfx key={k} at={at("formats", x - 4)} file="pop" vol={0.36} />)}
      <Sfx at={at("formats", f.odiV + 5)} file="stamp" vol={0.32} />
      <Sfx at={at("formats", f.iplV + 16)} file="tile" vol={0.25} />
      <Sfx at={at("formats", f.breaks - 1)} file="buzz" vol={0.36} />
      {/* dubai */}
      <Sfx at={at("dubai", d.yr - 4)} file="whoosh" vol={0.4} />
      {Array.from({ length: 13 }).map((_, k) => <Sfx key={k} at={at("dubai", d.chasing + k * tilePer)} file="tile" vol={0.26} />)}
      <Sfx at={at("dubai", d.twelve - 1)} file="stamp" vol={0.4} />
      <Sfx at={at("dubai", d.across + 18)} file="tally" vol={0.3} />
      <Sfx at={at("dubai", d.thirty - 1)} file="impact" vol={0.5} />
      <Sfx at={at("dubai", d.incl)} file="ding" vol={0.32} />
      {/* after */}
      {[n.v39, n.v56, n.v43].map((x, k) => <Sfx key={k} at={at("after", x - 3)} file="pop" vol={0.32} />)}
      <Sfx at={at("after", n.back - 2)} file="whoosh" vol={0.2} />
      {/* tests */}
      <Sfx at={at("tests", t.one - 1)} file="ding" vol={0.45} />
      <Sfx at={at("tests", t.inT)} file="whoosh" vol={0.26} />
      <Sfx at={at("tests", t.v57)} file="tally" vol={0.3} />
      {[1, 2, 3, 4].map((k) => <Sfx key={k} at={at("tests", t.because + k * dayStep)} file="tick" vol={0.35} />)}
      <Sfx at={at("tests", t.because + dayStep)} file="crack" vol={0.3} />
      <Sfx at={at("tests", t.day5 - 2)} file="crack" vol={0.5} />
      {/* ipl */}
      <Sfx at={at("ipl", i.ipl - 1)} file="impact" vol={0.32} />
      <Sfx at={at("ipl", i.v55 - 8)} file="tally" vol={0.3} />
      <Sfx at={at("ipl", i.v45 - 8)} file="tally" vol={0.24} />
      {/* verdict */}
      <Sfx at={at("verdict", 0)} file="coin-flick" vol={0.3} />
      <Sfx at={at("verdict", v.no - Math.round(fps * 1.3))} file="swell" vol={0.42} />
      <Sfx at={at("verdict", v.no - 1)} file="impact" vol={0.7} />
      <Sfx at={at("verdict", v.no - 1)} file="stamp" vol={0.6} />
      <Sfx at={at("verdict", v.but - 2)} file="whoosh" vol={0.22} />
      <Sfx at={at("verdict", v.call - 1)} file="pop" vol={0.4} />
      <Sfx at={at("verdict", v.whats - 3)} file="whoosh" vol={0.26} />
      <Sfx at={at("verdict", v.tell - 2)} file="pop" vol={0.36} />
    </>
  );
};

export const TossTruth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = (id: SceneId) => span(fps, id).from;
  const total = totalFrames(fps);
  const flare = (x: number, k: number) => interpolate(frame, [x - 2, x + 3, x + 26], [0, k, 0], CLAMP);
  const boost = 1 + flare(S("answer") + answerBeats(fps).pct, 0.5) + flare(S("dubai") + dubaiBeats(fps).thirty, 0.35) + flare(S("verdict") + verdictBeats(fps).no, 0.6);
  return (
    <AbsoluteFill style={{ background: theme.colors.sky, fontFamily: theme.fonts.body }}>
      <Sky boost={boost} />
      {SCENE_IDS.map((id) => {
        const s = span(fps, id);
        const Comp = SCENES[id];
        return (
          <Sequence key={id} from={s.from} durationInFrames={s.duration} name={id}>
            <Comp />
          </Sequence>
        );
      })}
      <Whip at={SCENE_IDS.slice(1).map(S)} />
      <Captions />
      <Brand hideFrom={total + 100} />
      <Grade />
      <Grain />
      <Vignette />
      <Progress total={total} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
