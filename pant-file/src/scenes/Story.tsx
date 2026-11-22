// THE PANT FILE — not the numbers, the impact: what happens to a Test when Rishabh Pant walks in.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BigGlyph, CLAMP, Cutout, Disp, fade, Label, Serif, Shell, useP } from "../components/Ed";
import { Cue } from "../components/Sound";
import { Brand, CaseFile, Crack, Footnote, Kicker, Lockup, Lollipop, Road, Slam, Stamp, StatRow } from "../components/Viz";
import { config } from "../config";
import data from "../data.json";
import impact from "../impact.json";
import { theme } from "../theme";
import { scene, sentence, totalFrames, wordAt } from "../timing";

const C = theme.colors;
const ease = (f: number, a: number, len: number) => interpolate(f, [a, a + len], [0, 1], { easing: theme.ease.out, ...CLAMP });
const window2 = (f: number, a: number, b: number, len = 8) => fade(f, a, len) * (1 - fade(f, b - len, len));

/* ================= S1 — WELLINGTON, THEN FORGET THE HUNDREDS ================= */
const s1Beats = (fps: number) => ({ n128: wordAt(fps, "s1", "128", 0.96), n153: wordAt(fps, "s1", "153", 2.66), ninth: wordAt(fps, "s1", "9th", 5.74), hundred: wordAt(fps, "s1", "100", 6.38), forget: wordAt(fps, "s1", "forget", 9.14), watch: sentence(fps, "s1", 2).from, walks: wordAt(fps, "s1", "walks", 12.82) });
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const draw = theme.ease.inOut(interpolate(frame, [b.ninth - 6, b.ninth + 24], [0, 1], CLAMP));
  const fill = ease(frame, b.hundred, 14) * (1 - ease(frame, b.forget, 18) * 0.85);
  const strike = ease(frame, b.forget + 4, 10);
  const step = 1 + 0.06 * ease(frame, b.walks - 6, 20);
  return (
    <Shell enter={false}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", opacity: fade(frame, 2) * (1 - fade(frame, b.ninth - 8, 8)) }}>
        <Label size={26} color={C.red} spacing="0.3em">
          Wellington · Nov 2026
        </Label>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - fade(frame, b.ninth - 8, 8) }}>
        <Slam text="128" at={b.n128 - 2} size={360} color={C.accent} />
        <div style={{ marginTop: 10, opacity: fade(frame, b.n153 - 2) }}>
          <Label size={30} color={C.ink2} weight={900}>
            off 153 balls
          </Label>
        </div>
      </div>
      <BigGlyph char="9" x={183} y={262} size={1150} draw={draw} fill={fill * 0.92} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${step})`, transformOrigin: "50% 75%" }}>
        <Cutout src="pant-raise-bat-cut.png" x={372} y={360} h={900} at={b.ninth + 4} />
      </div>
      {frame >= b.hundred && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 236, textAlign: "center" }}>
          <Lockup name="Rishabh Pant" at={b.hundred} top={0} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center", opacity: fade(frame, b.hundred + 6) * (1 - fade(frame, b.watch - 6, 8)) }}>
        <span style={{ position: "relative", background: C.ink, padding: "4px 22px 10px" }}>
          <Serif size={44} color={C.paperHi} weight={900}>
            9th Test hundred
          </Serif>
          <span style={{ position: "absolute", left: -8, top: "52%", width: `${strike * 106}%`, height: 6, background: C.red }} />
        </span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center", opacity: fade(frame, b.watch) }}>
        <span style={{ background: C.red, padding: "4px 22px 10px" }}>
          <Serif size={44} color={C.paperHi} weight={900}>
            Watch the match, not the score
          </Serif>
        </span>
      </div>
    </Shell>
  );
};

/* ================= S2 — THE TEMPO ================= */
const s2Beats = (fps: number) => ({ n53: wordAt(fps, "s2", "53", 3.96), n74: wordAt(fps, "s2", "74", 7.68), crease: wordAt(fps, "s2", "crease", 9.74), four: wordAt(fps, "s2", "four", 11.84), three: wordAt(fps, "s2", "three", 14.32) });
const SpeedBar: React.FC<{ y: number; label: string; v: number; at: number; color: string; big?: boolean }> = ({ y, label, v, at, color, big }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, 22);
  const W = (720 * v) / 80;
  return (
    <div style={{ position: "absolute", left: 70, top: y, opacity: fade(frame, at - 4) }}>
      <Label size={big ? 24 : 20} color={color} weight={900}>
        {label}
      </Label>
      <div style={{ position: "relative", marginTop: 10, height: big ? 84 : 64 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W * p, height: "100%", background: color }} />
        <div style={{ position: "absolute", left: W * p + 18, top: big ? -8 : -6 }}>
          <Disp size={big ? 100 : 76} color={color}>
            {(v * p).toFixed(1)}
          </Disp>
        </div>
      </div>
    </div>
  );
};
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const card = (x: number, label: string, v: string, color: string, at: number) => (
    <div style={{ position: "absolute", left: x, top: 850, width: 440, height: 300, background: C.paperHi, boxShadow: "0 18px 40px rgba(40,30,10,0.16)", borderTop: `10px solid ${color}`, padding: "26px 30px", boxSizing: "border-box", opacity: fade(frame, at - 4), transform: `translateY(${(1 - ease(frame, at - 4, 14)) * 40}px)` }}>
      <Label size={18} color={C.ink2}>
        {label}
      </Label>
      <div style={{ marginTop: 8 }}>
        <Disp size={150} color={color}>
          {v}
        </Disp>
      </div>
      <Label size={18} color={C.mute}>
        runs per over
      </Label>
    </div>
  );
  return (
    <Shell>
      <Kicker title="The tempo" sub="Runs per 100 balls · Tests since his debut, Aug 2018" />
      <SpeedBar y={430} label="Every top-order batter in Tests" v={impact.base_sr_top7} at={b.n53 - 8} color={C.mute} />
      <SpeedBar y={600} label="Rishabh Pant" v={impact.pant_sr} at={b.n74 - 6} color={C.accent} big />
      <div style={{ position: "absolute", left: 70, top: 800, opacity: fade(frame, b.crease - 6) }}>
        <Label size={22} color={C.ink} weight={900}>
          India's scoring rate
        </Label>
      </div>
      {card(70, "With Pant at the crease", impact.rr_with.toFixed(2), C.accent, b.four - 6)}
      {card(570, "The rest of the time", impact.rr_without.toFixed(2), C.ink, b.three - 8)}
      <Footnote text="Cricsheet ball-by-ball · top order = batting positions 1–7 · Pant's 89 innings to Aug 2026" at={b.three} top={1190} />
    </Shell>
  );
};

/* ================= S3 — SPEED IS TIME ================= */
const s3Beats = (fps: number) => ({ ordinary: wordAt(fps, "s3", "ordinary", 2.0), runs: wordAt(fps, "s3", "runs", 3.64), n300: wordAt(fps, "s3", "300", 5.26), days: wordAt(fps, "s3", "three", 7.9), handed: wordAt(fps, "s3", "handed", 10.12) });
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  const overs = Math.round(interpolate(frame, [b.ordinary, b.n300 + 10], [0, impact.overs_saved_vs_base], { easing: theme.ease.out, ...CLAMP }));
  const daysTotal = impact.overs_saved_vs_base / 90;
  const fillDays = interpolate(frame, [b.days - 4, b.days + 30], [0, daysTotal], { easing: theme.ease.out, ...CLAMP });
  const runs = data.all_balls.runs;
  const balls = impact.balls_saved_vs_base;
  return (
    <Shell>
      <Kicker title="That speed is time" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", opacity: fade(frame, b.ordinary - 4) }}>
        <Disp size={300} color={C.accent}>
          {String(overs)}
        </Disp>
        <div style={{ marginTop: -6 }}>
          <Label size={28} color={C.ink} weight={900}>
            extra overs, at an ordinary pace
          </Label>
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 760, textAlign: "center", opacity: fade(frame, b.runs) }}>
        <Label size={18} color={C.ink2} weight={700} spacing="0.06em">
          {`His ${runs.toLocaleString("en-US")} runs at the top-order rate of ${impact.base_sr_top7} per 100 balls would take ${(data.all_balls.balls + balls).toLocaleString("en-US")} balls. He needed ${data.all_balls.balls.toLocaleString("en-US")}.`}
        </Label>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 880, display: "flex", gap: 14, opacity: fade(frame, b.days - 6) }}>
        {[1, 2, 3, 4, 5].map((d) => {
          const f = Math.max(0, Math.min(1, fillDays - (d - 1)));
          return (
            <div key={d} style={{ flex: 1, height: 190, position: "relative", background: C.paperHi, boxShadow: `inset 0 0 0 2px ${C.line}` }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${f * 100}%`, background: C.accent }} />
              <div style={{ position: "absolute", left: 0, right: 0, top: 64, textAlign: "center" }}>
                <Disp size={44} color={f > 0.5 ? C.paperHi : C.mute}>{`Day ${d}`}</Disp>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1100, textAlign: "center", opacity: fade(frame, b.days + 10) }}>
        <Disp size={84} color={C.accent}>{`${daysTotal.toFixed(1)} days`}</Disp>
        <div style={{ opacity: fade(frame, b.handed - 4) }}>
          <Serif size={40} color={C.ink2}>
            handed back to India's bowlers
          </Serif>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S4 — WHEN THE MATCH IS SLIPPING ================= */
const s4Beats = (fps: number) => ({ syd: wordAt(fps, "s4", "sydney", 3.16) - 4, n407: wordAt(fps, "s4", "407", 6.08), crawl: wordAt(fps, "s4", "crawl", 8.92), n97: wordAt(fps, "s4", "97", 10.22), gabba: wordAt(fps, "s4", "gaba", 16.04) - 6, n89: wordAt(fps, "s4", "89", 17.02), series: wordAt(fps, "s4", "series", 19.4), ahm: sentence(fps, "s4", 3).from - 4, n80: wordAt(fps, "s4", "80", 21.9), n100: wordAt(fps, "s4", "100", 23.26), innings: wordAt(fps, "s4", "innings", 25.38) });
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  // Pant v his partners while he was in (ball-by-ball)
  const duel = (at: number, end: number, pant: string, partners: string) => (
    <div style={{ position: "absolute", left: 70, top: 360, width: 470, opacity: window2(frame, at, end) }}>
      <Label size={18} color={C.mute}>
        While he batted
      </Label>
      <div style={{ marginTop: 12, whiteSpace: "nowrap" }}>
        <Label size={18} color={C.accent} weight={900}>
          Pant
        </Label>
        <div>
          <Disp size={72} color={C.accent}>
            {pant}
          </Disp>
        </div>
      </div>
      <div style={{ marginTop: 14, whiteSpace: "nowrap" }}>
        <Label size={18} color={C.mute} weight={900}>
          His partners
        </Label>
        <div>
          <Disp size={72} color={C.mute}>
            {partners}
          </Disp>
        </div>
      </div>
    </div>
  );
  return (
    <Shell drift={0}>
      <Kicker title="When the match is slipping" outAt={b.syd + 30} />
      {duel(b.crawl - 6, b.gabba, "97 off 118", "45 off 146")}
      {duel(b.n100, 9999, "101 off 118", "70 off 162")}
      <div style={{ opacity: 1 - fade(frame, b.gabba - 6, 8) }}>
        <Cutout src="pant-hit-cut.png" x={540} y={330} h={460} at={b.syd + 6} from="right" />
      </div>
      <div style={{ opacity: window2(frame, b.gabba, b.ahm) }}>
        <Cutout src="pant-heart-cut.png" x={380} y={300} h={480} at={b.gabba + 4} fadeBottom={0.85} />
      </div>
      <Cutout src="pant-flick-cut.png" x={580} y={320} h={460} at={b.ahm + 4} from="right" />
      <Road
        width={1500}
        y={1070}
        stations={[
          { x: 300, value: "97", date: "Jan 2021 · chasing 407", place: "Sydney", note: "Test saved", at: b.n97 - 4, tone: "accent" },
          { x: 720, value: "89*", date: "Jan 2021 · chasing 328", place: "Brisbane", note: "Chase won · series won", at: b.n89 - 4, tone: "accent" },
          { x: 1140, value: "101", date: "Mar 2021 · in at 80/4", place: "Ahmedabad", note: "India win by an innings", at: b.n100 - 4, tone: "accent" },
        ]}
        camera={[
          { t: 0, x: 300 },
          { t: b.gabba + 8, x: 720 },
          { t: b.ahm + 10, x: 1140 },
        ]}
      />
    </Shell>
  );
};

/* ================= S5 — THE SIX ================= */
const s5Beats = (fps: number) => ({ six: wordAt(fps, "s5", "six", 1.12), n108: wordAt(fps, "s5", "108", 2.64), stokes: wordAt(fps, "s5", "stokes", 5.36), five: wordAt(fps, "s5", "five", 7.42), spin: sentence(fps, "s5", 1).from, n53: wordAt(fps, "s5", "53", 14.84), n86: wordAt(fps, "s5", "86", 16.38), lyon: sentence(fps, "s5", 2).from, times: wordAt(fps, "s5", "times", 20.76), n258: wordAt(fps, "s5", "258", 22.34), seven: wordAt(fps, "s5", "seven", 24.54) });
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const phaseA = 1 - fade(frame, b.spin - 8, 8);
  const shown = Math.floor(interpolate(frame, [b.spin, b.spin + 40], [0, 100], CLAMP));
  const sixP = useP(b.n108 - 2, { damping: 12, stiffness: 240, mass: 0.7 });
  return (
    <Shell>
      <Kicker title="The six" sub="His other weapon" subAt={b.six} />
      {/* phase A: 108, second only to Stokes, 1 in 5 of India's */}
      <div style={{ opacity: phaseA }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", opacity: interpolate(sixP, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(sixP, [0, 1], [1.4, 1])})` }}>
          <Disp size={330} color={C.accent}>
            108
          </Disp>
          <div style={{ marginTop: -8 }}>
            <Label size={30} color={C.ink} weight={900}>
              Test sixes
            </Label>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", opacity: fade(frame, b.stokes - 4) }}>
          <Label size={22} color={C.ink2} weight={900}>
            2nd all-time · only Ben Stokes (138) has more
          </Label>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 920, display: "flex", justifyContent: "center", gap: 22, opacity: fade(frame, b.five - 6) }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ width: 92, height: 92, borderRadius: 92, background: i === 0 ? C.accent : "transparent", boxShadow: i === 0 ? undefined : `inset 0 0 0 3px ${C.line}` }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1040, textAlign: "center", opacity: fade(frame, b.five) }}>
          <Label size={22} color={C.ink2} weight={900}>
            {`Almost 1 in 5 of India's Test sixes since 2018 · 99 of 552`}
          </Label>
        </div>
      </div>
      {/* phase B: the first 100 sixes, spin v pace */}
      <div style={{ opacity: fade(frame, b.spin - 4) }}>
        <div style={{ position: "absolute", left: 80, top: 400 }}>
          <Label size={18} color={C.mute}>
            His first 100 Test sixes
          </Label>
          <div style={{ position: "relative", marginTop: 14, width: 10 * 34, height: 10 * 34 }}>
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} style={{ position: "absolute", left: (i % 10) * 34, top: Math.floor(i / 10) * 34, width: 26, height: 26, borderRadius: 26, background: i < shown ? (i < 75 ? C.accent : C.ink) : "transparent", boxShadow: i < shown ? undefined : `inset 0 0 0 1.5px ${C.line}` }} />
            ))}
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 24 }}>
            <Label size={18} color={C.accent} weight={900}>
              75 off spin
            </Label>
            <Label size={18} color={C.ink} weight={900}>
              25 off pace
            </Label>
          </div>
        </div>
        {[
          { t: "v spin", avg: data.spin.avg, sr: data.spin.sr, c: C.accent, at: b.n53 - 8, y: 430 },
          { t: "v pace", avg: data.pace.avg, sr: data.pace.sr, c: C.ink, at: b.n86 - 4, y: 610 },
        ].map((r) => (
          <div key={r.t} style={{ position: "absolute", left: 500, top: r.y, opacity: fade(frame, r.at) }}>
            <Disp size={44} color={r.c}>
              {r.t}
            </Disp>
            <div style={{ display: "flex", gap: 36, marginTop: 6 }}>
              <div>
                <Disp size={84} color={r.c}>
                  {r.avg.toFixed(1)}
                </Disp>
                <div>
                  <Label size={16} color={C.mute}>
                    Average
                  </Label>
                </div>
              </div>
              <div>
                <Disp size={84} color={r.c}>
                  {r.sr.toFixed(0)}
                </Disp>
                <div>
                  <Label size={16} color={C.mute}>
                    Per 100 balls
                  </Label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* phase C: Lyon */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 930, background: C.paperHi, boxShadow: "0 18px 40px rgba(40,30,10,0.16)", padding: "22px 34px", opacity: fade(frame, b.lyon - 4), transform: `translateY(${(1 - ease(frame, b.lyon - 4, 14)) * 40}px)` }}>
        <Label size={20} color={C.ink2}>
          Pant v Nathan Lyon
        </Label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 8 }}>
          <div style={{ opacity: fade(frame, b.times - 6) }}>
            <Disp size={110} color={C.red}>
              6
            </Disp>
            <div>
              <Label size={16} color={C.red} weight={900}>
                Times out
              </Label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 40 }}>
            <div style={{ opacity: fade(frame, b.n258 - 4) }}>
              <Disp size={110} color={C.accent}>
                {String(data.lyon.runs)}
              </Disp>
              <div>
                <Label size={16} color={C.accent} weight={900}>
                  Runs
                </Label>
              </div>
            </div>
            <div style={{ opacity: fade(frame, b.seven - 4) }}>
              <Disp size={110} color={C.accent}>
                {String(data.lyon.sixes)}
              </Disp>
              <div>
                <Label size={16} color={C.accent} weight={900}>
                  Sixes
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S6 — THE COMEBACK ================= */
const s6Beats = (fps: number) => ({ date: wordAt(fps, "s6", "30th", 0.64), crash: wordAt(fps, "s6", "crash", 3.92), n637: wordAt(fps, "s6", "637", 6.72), n100: wordAt(fps, "s6", "100", 10.42), won: wordAt(fps, "s6", "india", 12.58), leeds: sentence(fps, "s6", 2).from, each: wordAt(fps, "s6", "each", 16.86), man: wordAt(fps, "s6", "manchester", 18.32), foot: wordAt(fps, "s6", "fractured", 20.08) });
const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const days = Math.round(interpolate(frame, [b.n637 - 6, b.n637 + 26], [0, 637], { easing: theme.ease.out, ...CLAMP }));
  return (
    <Shell>
      <Kicker title="The comeback" />
      {/* A: the crash */}
      <div style={{ opacity: window2(frame, 0, b.n637 - 4) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", opacity: fade(frame, b.date - 4) }}>
          <Disp size={170} color={C.red}>
            30 · 12 · 2022
          </Disp>
        </div>
        <Crack y={700} at={b.crash - 4} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 780, textAlign: "center", opacity: fade(frame, b.crash) }}>
          <Label size={26} color={C.red} weight={900}>
            Car crash
          </Label>
        </div>
      </div>
      {/* B: 637 days, then Chennai */}
      <div style={{ opacity: window2(frame, b.n637 - 6, b.leeds) }}>
        <div style={{ position: "absolute", left: 70, top: 380 }}>
          <Disp size={230} color={C.ink}>
            {String(days)}
          </Disp>
          <div style={{ marginTop: -6 }}>
            <Label size={26} color={C.ink2} weight={900}>
              days away
            </Label>
          </div>
        </div>
        <div style={{ position: "absolute", left: 70, top: 760 }}>
          <Slam text="109" at={b.n100 - 4} size={200} color={C.accent} />
          <div style={{ opacity: fade(frame, b.n100 + 4), marginTop: 6 }}>
            <Label size={22} color={C.ink2} weight={900}>
              Chennai · Sep 2024 · first Test back
            </Label>
          </div>
          <div style={{ opacity: fade(frame, b.won - 4), marginTop: 12 }}>
            <span style={{ background: C.accent, padding: "6px 16px 6px" }}>
              <Label size={22} color={C.paperHi} weight={900}>
                India won
              </Label>
            </span>
          </div>
        </div>
        <Cutout src="pant-lookup-cut.png" x={520} y={560} h={600} at={b.n637 + 6} from="right" fadeBottom={0.84} />
      </div>
      {/* C: Leeds and Manchester */}
      <div style={{ opacity: fade(frame, b.leeds - 4) }}>
        <Cutout src="pant-heart-cut.png" x={560} y={380} h={800} at={b.leeds} from="right" fadeBottom={0.85} />
        <div style={{ position: "absolute", left: 70, top: 440 }}>
          <Label size={20} color={C.mute}>
            Leeds · 2025
          </Label>
          <div style={{ marginTop: 6, height: 150 }}>
            <Slam text="134" at={b.leeds + 6} size={150} color={C.accent} />
          </div>
          <div style={{ marginTop: 14, height: 150 }}>
            <Slam text="118" at={b.each - 4} size={150} color={C.accent} />
          </div>
          <div style={{ opacity: fade(frame, b.each + 4), marginTop: 8 }}>
            <Label size={20} color={C.ink2} weight={900}>
              A hundred in each innings
            </Label>
          </div>
        </div>
        <div style={{ position: "absolute", left: 70, top: 980, opacity: fade(frame, b.man - 4) }}>
          <Label size={20} color={C.mute}>
            Manchester · 2025
          </Label>
          <div style={{ marginTop: 10 }}>
            <span style={{ background: C.red, padding: "8px 18px 8px", opacity: fade(frame, b.foot - 4) }}>
              <Label size={26} color={C.paperHi} weight={900}>
                Batted on a fractured foot
              </Label>
            </span>
          </div>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S7 — WHERE IT'S HARDEST ================= */
const s7Beats = (fps: number) => ({ away: sentence(fps, "s7", 1).from, keeper: wordAt(fps, "s7", "keeper", 3.92), averages: wordAt(fps, "s7", "averages", 5.66), hundreds: wordAt(fps, "s7", "hundreds", 7.62), faster: wordAt(fps, "s7", "faster", 8.68) });
const S7: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const r0 = b.keeper - 6;
  return (
    <Shell>
      <Kicker title="Where it's hardest" sub="Away Test average · keepers with 20+ away Tests since 2002" subAt={b.away - 6} />
      <Lollipop
        top={440}
        rowH={98}
        max={50}
        ticks={[10, 20, 30, 40, 50]}
        rows={data.keepers.map((k, i) => ({
          name: k.n,
          sub: `${k.tests} Tests · ${k.h} × 100 · SR ${k.sr}`,
          value: k.avg,
          at: i === 0 ? b.averages - 4 : r0 + (i - 1) * 3,
          tone: i === 0 ? ("pick" as const) : ("main" as const),
        }))}
      />
      <Footnote text="Cricsheet ball-by-ball from Dec 2001 · Pant includes Wellington 2026 · Gilchrist and Boucher began before the data" at={b.faster} top={1250} />
    </Shell>
  );
};

/* ================= S8 — THE PRICE: THE NINETIES ================= */
const s8Beats = (fps: number) => ({ price: wordAt(fps, "s8", "price", 1.16), seven: wordAt(fps, "s8", "seven", 2.52), n90s: wordAt(fps, "s8", "90s", 3.92), hundreds: wordAt(fps, "s8", "900s", 5.04), five: wordAt(fps, "s8", "five", 8.86), half: wordAt(fps, "s8", "half", 12.8) });
const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  const pAll = ease(frame, b.five - 8, 20), pPant = ease(frame, b.half - 10, 20);
  return (
    <Shell>
      <Kicker title="The price" sub="Every score of 90 or more, in order" subAt={b.price} />
      <div style={{ position: "absolute", left: 70, top: 400, width: 940, display: "flex", flexWrap: "wrap", gap: 14 }}>
        {data.tiles.map((t, i) => {
          const at = b.price + i * 2;
          const lit = t.nine ? fade(frame, b.n90s - 4) : fade(frame, b.hundreds - 4);
          return (
            <div key={i} style={{ width: 223, height: 118, position: "relative", background: !t.nine && lit > 0.5 ? C.accent : C.paperHi, boxShadow: t.nine && lit > 0.5 ? `inset 0 0 0 4px ${C.red}` : "0 6px 16px rgba(40,30,10,0.10)", opacity: fade(frame, at, 6), padding: "12px 16px", boxSizing: "border-box" }}>
              <Disp size={62} color={!t.nine && lit > 0.5 ? C.paperHi : t.nine && lit > 0.5 ? C.red : C.ink}>{`${t.runs}${t.out ? "" : "*"}`}</Disp>
              <div>
                <Label size={14} color={!t.nine && lit > 0.5 ? C.paperHi : C.mute}>{`${t.venue} · ${t.date.slice(0, 4)}`}</Label>
              </div>
            </div>
          );
        })}
      </div>
      {[
        { y: 1000, label: "All Test batters since 2002", v: data.nineties_share.all, p: pAll, c: C.ink, at: b.five - 8 },
        { y: 1120, label: "Rishabh Pant", v: data.nineties_share.pant, p: pPant, c: C.red, at: b.half - 10 },
      ].map((r) => (
        <div key={r.label} style={{ position: "absolute", left: 70, top: r.y, width: 940, opacity: fade(frame, r.at) }}>
          <Label size={18} color={r.c} weight={900}>
            {`${r.label} · 90+ scores that stopped short`}
          </Label>
          <div style={{ position: "relative", marginTop: 8, height: 48 }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 760 * r.v * 1.9 * r.p, height: "100%", background: r.c }} />
            <div style={{ position: "absolute", left: 760 * r.v * 1.9 * r.p + 16, top: -10 }}>
              <Disp size={64} color={r.c}>{`${Math.round(r.v * 100 * r.p)}%`}</Disp>
            </div>
          </div>
        </div>
      ))}
    </Shell>
  );
};

/* ================= S9 — VERDICT: JUDGE HIM BY THE MATCH ================= */
const s9Beats = (fps: number) => ({ average: wordAt(fps, "s9", "average", 1.76), match: wordAt(fps, "s9", "match", 3.6), walks: wordAt(fps, "s9", "walks", 4.84), moving: wordAt(fps, "s9", "moving", 6.44), brand: sentence(fps, "s9", 2).from - 6 });
const S9: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s9Beats(fps);
  return (
    <Shell exit={false} drift={0.02}>
      <CaseFile src="pant-portrait.jpg" at={4} x={250} y={300} w={580} h={680} pos="50% 18%" tilt={-3} />
      <div style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap" }}>
        <Stamp text="Game changer" sub="Judge him by the match" at={b.match} x={262} y={968} rotate={-5} size={84} />
      </div>
      <StatRow
        top={1168}
        at={b.walks}
        outAt={b.brand - 6}
        size={66}
        stats={[
          { v: impact.pant_sr.toFixed(0), l: "Per 100 balls", accent: true },
          { v: "108", l: "Test sixes", accent: true },
          { v: String(impact.overs_saved_vs_base), l: "Overs bought" },
          { v: "9", l: "Hundreds" },
        ]}
      />
      <Brand at={b.brand + 2} top={1160} series={config.series} tagline={config.tagline} />
    </Shell>
  );
};

/* ================= wiring ================= */
export const STORY = {
  scenes: [
    ["s1", S1],
    ["s2", S2],
    ["s3", S3],
    ["s4", S4],
    ["s5", S5],
    ["s6", S6],
    ["s7", S7],
    ["s8", S8],
    ["s9", S9],
  ] as [string, React.FC][],
  warmFrom: (fps: number) => scene(fps, "s9").from,
  mastheadOffAt: (fps: number) => scene(fps, "s9").from + s9Beats(fps).brand,
  captionsOffFrom: (fps: number) => scene(fps, "s9").from + sentence(fps, "s9", 2).from - 2,
  sfx: (fps: number): Cue[] => {
    const S = (id: string) => scene(fps, id).from;
    const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps), b8 = s8Beats(fps), b9 = s9Beats(fps);
    const c: Cue[] = [];
    const add = (id: string, at: number, file: string, volume: number) => c.push({ at: S(id) + at, file, volume });
    ["s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9"].forEach((id) => c.push({ at: S(id) - 9, file: "swoosh.wav", volume: 0.26 }));
    // s1
    add("s1", b1.n128 - 2, "slam.wav", 0.55);
    add("s1", b1.n128 - 2, "crowd.wav", 0.2);
    add("s1", b1.ninth - 6, "pen.wav", 0.35);
    add("s1", b1.hundred, "impact.wav", 0.55);
    add("s1", b1.forget + 4, "pen.wav", 0.4);
    add("s1", b1.walks - 6, "rise.wav", 0.22);
    // s2
    add("s2", b2.n53 - 8, "whip.wav", 0.25);
    add("s2", b2.n74 - 6, "whip.wav", 0.35);
    add("s2", b2.n74 + 14, "pop.wav", 0.3);
    add("s2", b2.four - 6, "pop.wav", 0.25);
    add("s2", b2.three - 8, "pop.wav", 0.25);
    // s3
    add("s3", b3.ordinary, "ticks.wav", 0.3);
    add("s3", b3.n300 + 8, "slam.wav", 0.4);
    add("s3", b3.days - 4, "rise.wav", 0.25);
    add("s3", b3.days + 28, "impact.wav", 0.4);
    // s4
    add("s4", b4.syd + 6, "whip.wav", 0.3);
    add("s4", b4.n97 - 4, "slam.wav", 0.45);
    add("s4", b4.n89 - 4, "slam.wav", 0.5);
    add("s4", b4.n89 - 4, "crowd.wav", 0.25);
    add("s4", b4.n100 - 4, "slam.wav", 0.45);
    add("s4", b4.innings - 4, "impact.wav", 0.4);
    // s5
    add("s5", b5.n108 - 2, "slam.wav", 0.55);
    add("s5", b5.n108 - 2, "crowd.wav", 0.22);
    add("s5", b5.five - 6, "pop.wav", 0.3);
    add("s5", b5.spin, "ticks.wav", 0.3);
    add("s5", b5.lyon - 4, "whip.wav", 0.3);
    add("s5", b5.n258 - 4, "slam.wav", 0.4);
    // s6
    add("s6", b6.crash - 4, "crack.wav", 0.5);
    add("s6", b6.n637 - 6, "ticks.wav", 0.3);
    add("s6", b6.n100 - 4, "slam.wav", 0.45);
    add("s6", b6.won - 4, "impact.wav", 0.4);
    add("s6", b6.each - 4, "slam.wav", 0.35);
    add("s6", b6.foot - 4, "pen.wav", 0.3);
    // s7
    add("s7", b7.averages - 4, "rise.wav", 0.25);
    add("s7", b7.averages + 10, "impact.wav", 0.4);
    // s8
    add("s8", b8.n90s - 4, "crack.wav", 0.3);
    add("s8", b8.hundreds - 4, "pop.wav", 0.3);
    add("s8", b8.half - 10, "slam.wav", 0.4);
    // s9
    add("s9", 6, "swoosh.wav", 0.22);
    add("s9", b9.match - 2, "slam.wav", 0.55);
    add("s9", b9.match - 2, "impact.wav", 0.55);
    add("s9", b9.match, "crowd.wav", 0.2);
    c.push({ at: totalFrames(fps) - Math.round(fps * 1.2), file: "pen.wav", volume: 0.3 });
    return c;
  },
};
