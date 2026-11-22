// THE ADELAIDE TEST, 9–13 December 2014 — told like a film, day by day. Numbers from Cricsheet ball-by-ball (analysis/).
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BigGlyph, CLAMP, Cutout, Disp, fade, Label, Serif, Shell, useP } from "../components/Ed";
import { Cue } from "../components/Sound";
import { Brand, CaseFile, Crack, Lockup, Slam, StatRow } from "../components/Viz";
import { config } from "../config";
import data from "../data.json";
import { theme } from "../theme";
import { scene, sentence, totalFrames, wordAt } from "../timing";

const C = theme.colors;
const ease = (f: number, a: number, len: number) => interpolate(f, [a, a + len], [0, 1], { easing: theme.ease.out, ...CLAMP });
const win = (f: number, a: number, b: number, len = 8) => fade(f, a, len) * (1 - fade(f, b - len, len));

/* ---------- film pieces ---------- */
// "DAY 3" fills the frame for a beat, then slides up into the kicker position like a chapter title.
const DayCard: React.FC<{ day: string; date: string }> = ({ day, date }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 26, fps, config: theme.spring.smooth });
  const inP = ease(frame, 0, 10);
  const y = interpolate(p, [0, 1], [700, 250]);
  const s = interpolate(p, [0, 1], [1, 0.36]);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: y, opacity: inP, transform: `scale(${s})`, transformOrigin: "0% 0%", zIndex: 5 }}>
      <Disp size={240} color={C.ink}>
        {day}
      </Disp>
      <div style={{ marginTop: -6 }}>
        <Label size={44} color={C.red} spacing="0.24em">
          {date}
        </Label>
      </div>
    </div>
  );
};

// a respectful black-bordered card for Phillip Hughes
const TributeCard: React.FC<{ at: number; show63: number; age?: number; top?: number; scale?: number }> = ({ at, show63, age = 0, top = 380, scale = 1 }) => {
  const frame = useCurrentFrame();
  const p = useP(at, theme.spring.smooth);
  return (
    <div style={{ position: "absolute", left: 160, width: 760, top, transform: `scale(${scale * interpolate(p, [0, 1], [0.96, 1])})`, transformOrigin: "50% 0%", opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP) }}>
      <div style={{ background: C.paperHi, border: `10px solid ${C.ink}`, padding: "34px 40px 30px", textAlign: "center", boxShadow: "0 24px 50px rgba(40,30,10,0.22)" }}>
        <Label size={22} color={C.mute} spacing="0.3em">
          In memory
        </Label>
        <div style={{ marginTop: 10 }}>
          <Disp size={92}>Phillip Hughes</Disp>
        </div>
        <div style={{ marginTop: 4 }}>
          <Label size={22} color={C.ink2}>
            30 Nov 1988 – 27 Nov 2014 · Test cap 408
          </Label>
        </div>
        <div style={{ marginTop: 14, opacity: show63 }}>
          <Disp size={260} color={C.red}>
            63*
          </Disp>
        </div>
        <div style={{ opacity: age }}>
          <Label size={22} color={C.ink2} weight={900}>
            Struck while batting · Sydney · 25 Nov 2014
          </Label>
        </div>
      </div>
    </div>
  );
};

// the day-five chase: India's score over by over, the 364 line, and every wicket
const ChaseChart: React.FC<{ ov: number; top?: number; height?: number; showTea?: number; showHundred?: number; collapse?: boolean }> = ({ ov, top = 430, height = 600, showTea = 0, showHundred = 0, collapse }) => {
  const X0 = 120, X1 = 980, MAXO = 90, MAXR = 400;
  const X = (o: number) => X0 + ((X1 - X0) * o) / MAXO;
  const Y = (r: number) => top + height - (height * r) / MAXR;
  const pts: [number, number][] = [[0, 0]];
  for (const p of data.chase) {
    if (p.o <= ov) pts.push([p.o, p.r]);
    else {
      const prev = pts[pts.length - 1];
      const t = (ov - prev[0]) / (p.o - prev[0]);
      if (t > 0) pts.push([ov, prev[1] + (p.r - prev[1]) * t]);
      break;
    }
  }
  const now = pts[pts.length - 1];
  const wk = data.wickets.filter((w) => w.o <= ov + 0.01).length;
  const d = pts.map(([o, r], i) => `${i ? "L" : "M"} ${X(o)} ${Y(r)}`).join(" ");
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={X0} y1={top + height} x2={X1} y2={top + height} stroke={C.ink} strokeWidth={2} />
        {[0, 15, 30, 45, 60, 75, 90].map((o) => (
          <text key={o} x={X(o)} y={top + height + 34} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={800} fontSize={18} fill={C.mute}>
            {o}
          </text>
        ))}
        <text x={X1} y={top + height + 64} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={800} fontSize={16} fill={C.mute} letterSpacing="2">
          OVERS ON DAY 5
        </text>
        <line x1={X0} y1={Y(364)} x2={X1} y2={Y(364)} stroke={C.red} strokeWidth={4} strokeDasharray="14 10" />
        <text x={X0} y={Y(364) - 14} fontFamily={theme.fonts.display} fontSize={40} fill={C.red}>
          TARGET 364
        </text>
        {showTea > 0 && (
          <g opacity={showTea}>
            <line x1={X(61)} y1={Y(0)} x2={X(61)} y2={Y(330)} stroke={C.ink2} strokeWidth={2} strokeDasharray="4 8" />
            <text x={X(61) - 10} y={Y(330) - 10} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={900} fontSize={20} fill={C.ink2}>
              TEA 205/2
            </text>
          </g>
        )}
        <path d={d} fill="none" stroke={C.accent} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
        {data.wickets
          .filter((w) => w.o <= ov + 0.01)
          .map((w) => (
            <circle key={w.n} cx={X(w.o)} cy={Y(w.at)} r={collapse && w.o > 69 ? 13 : 9} fill={C.red} stroke={C.paper} strokeWidth={4} />
          ))}
        {showHundred > 0 && (
          <g opacity={showHundred}>
            <circle cx={X(68)} cy={Y(234)} r={16} fill="none" stroke={C.accent} strokeWidth={4} />
            <text x={X(68) - 24} y={Y(234) + 6} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={900} fontSize={20} fill={C.accent}>
              KOHLI 100
            </text>
          </g>
        )}
        <circle cx={X(now[0])} cy={Y(now[1])} r={12} fill={C.accent} stroke={C.paperHi} strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", right: 70, top: top + 70, textAlign: "right" }}>
        <Label size={20} color={C.mute}>
          India
        </Label>
        <div>
          <Disp size={120} color={C.accent}>{`${Math.round(now[1])}/${wk}`}</Disp>
        </div>
        <Label size={22} color={C.red} weight={900}>{`Need ${Math.max(0, 364 - Math.round(now[1]))}`}</Label>
      </div>
    </>
  );
};

/* ================= S1 — COLD OPEN ================= */
const s1Beats = (fps: number) => ({ hughes: wordAt(fps, "s1", "hughes", 5.26) - 10, n63: wordAt(fps, "s1", "63", 6.56), bouncer: wordAt(fps, "s1", "bouncer", 8.04), gone: wordAt(fps, "s1", "gone", 11.34), home: sentence(fps, "s1", 2).from, clap: sentence(fps, "s1", 3).from, sec63: wordAt(fps, "s1", "63", 23.98, 1), title: sentence(fps, "s1", 4).from });
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const ring = interpolate(frame, [b.clap + 10, b.sec63 + 16], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const titleP = spring({ frame: frame - b.title, fps, config: { damping: 14, stiffness: 160, mass: 0.9 } });
  return (
    <Shell enter={false}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", opacity: win(frame, 4, b.hughes) }}>
        <Label size={34} color={C.ink} spacing="0.34em">
          Adelaide · December 2014
        </Label>
      </div>
      <div style={{ opacity: win(frame, b.hughes, b.clap) }}>
        <TributeCard at={b.hughes} show63={fade(frame, b.n63 - 4)} age={fade(frame, b.gone - 6)} />
        <Crack y={1070} at={b.bouncer - 2} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center", opacity: win(frame, b.home - 4, b.clap) }}>
        <Serif size={46} color={C.ink2}>
          Adelaide: the ground he called home
        </Serif>
      </div>
      {/* 63 seconds of applause */}
      <div style={{ opacity: win(frame, b.clap, b.title) }}>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <circle cx={540} cy={760} r={300} fill="none" stroke={C.line} strokeWidth={22} />
          <circle cx={540} cy={760} r={300} fill="none" stroke={C.ink} strokeWidth={22} strokeDasharray={2 * Math.PI * 300} strokeDashoffset={2 * Math.PI * 300 * (1 - ring)} transform="rotate(-90 540 760)" strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center" }}>
          <Disp size={260}>{String(Math.round(63 * ring))}</Disp>
          <div style={{ marginTop: -10 }}>
            <Label size={30} color={C.ink2} weight={900}>
              seconds of applause
            </Label>
          </div>
        </div>
      </div>
      {/* title card */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", opacity: interpolate(titleP, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(titleP, [0, 1], [1.25, 1])})` }}>
        <Label size={28} color={C.red} spacing="0.4em">
          Australia v India · 9–13 Dec 2014
        </Label>
        <div style={{ marginTop: 18 }}>
          <Disp size={200}>The</Disp>
        </div>
        <div style={{ marginTop: -14 }}>
          <Disp size={230} color={C.accent}>
            Adelaide
          </Disp>
        </div>
        <div style={{ marginTop: -14 }}>
          <Disp size={200}>Test</Disp>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S2 — DAY 1 ================= */
const s2Beats = (fps: number) => ({ armb: wordAt(fps, "s2", "black", 2.72), n408: wordAt(fps, "s2", "408", 3.88), warner: sentence(fps, "s2", 1).from, n63: wordAt(fps, "s2", "63", 10.32), sky: wordAt(fps, "s2", "sky", 11.9), n145: wordAt(fps, "s2", "145", 13.74), clarke: sentence(fps, "s2", 2).from, n60: wordAt(fps, "s2", "60", 19.48), hurt: wordAt(fps, "s2", "hurt", 21.02), stumps: sentence(fps, "s2", 3).from, n354: wordAt(fps, "s2", "354", 23.94) });
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const draw = theme.ease.inOut(interpolate(frame, [b.n408 - 10, b.n408 + 26], [0, 1], CLAMP));
  return (
    <Shell enter={false}>
      <DayCard day="Day 1" date="Tue 9 Dec" />
      {/* 408 */}
      <div style={{ opacity: win(frame, b.armb - 6, b.warner) }}>
        <BigGlyph char="408" x={90} y={520} size={560} width={900} draw={draw} fill={0} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center", opacity: fade(frame, b.n408 + 6) }}>
          <Label size={26} color={C.ink} weight={900}>
            Black armbands · Hughes's Test cap number on every shirt
          </Label>
        </div>
      </div>
      {/* Warner */}
      <div style={{ opacity: win(frame, b.warner - 4, b.clarke) }}>
        <Cutout src="warner-sky-cut.png" x={520} y={430} h={720} at={b.warner} from="right" />
        <div style={{ position: "absolute", left: 70, top: 470 }}>
          <Label size={22} color={C.mute}>
            David Warner
          </Label>
          <div style={{ height: 220 }}>
            <Slam text="63" at={b.n63 - 2} size={220} color={C.ink} />
          </div>
          <div style={{ opacity: fade(frame, b.sky - 4) }}>
            <Serif size={40} color={C.ink2}>
              ...and looks to the sky
            </Serif>
          </div>
          <div style={{ marginTop: 30, height: 230 }}>
            <Slam text="145" at={b.n145 - 2} size={220} color={C.ink} />
          </div>
        </div>
      </div>
      {/* Clarke */}
      <div style={{ opacity: win(frame, b.clarke - 4, b.stumps + 4) }}>
        <div style={{ position: "absolute", left: 70, right: 70, top: 470, textAlign: "center" }}>
          <Label size={24} color={C.mute}>
            Michael Clarke · captain
          </Label>
          <div style={{ marginTop: 10, height: 330 }}>
            <Disp size={320} color={C.ink}>{String(Math.round(interpolate(frame, [b.clarke + 10, b.n60], [0, 60], CLAMP)))}</Disp>
          </div>
          <div style={{ marginTop: 20, opacity: fade(frame, b.hurt - 6) }}>
            <span style={{ background: C.red, padding: "10px 26px 10px" }}>
              <Label size={34} color={C.paperHi} weight={900}>
                Retired hurt · back
              </Label>
            </span>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1100, textAlign: "center", opacity: fade(frame, b.n354 - 8) }}>
        <Label size={22} color={C.mute}>
          Stumps, day 1
        </Label>
        <div>
          <Disp size={120}>Australia 354/6</Disp>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S3 — DAY 2 ================= */
const s3Beats = (fps: number) => ({ call: wordAt(fps, "s3", "call", 2.88), n128: wordAt(fps, "s3", "128", 6.28), steve: wordAt(fps, "s3", "steve", 8.22), n162: wordAt(fps, "s3", "162", 9.52), n517: wordAt(fps, "s3", "517", 13.42) });
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  return (
    <Shell enter={false}>
      <DayCard day="Day 2" date="Wed 10 Dec" />
      <div style={{ position: "absolute", left: 80, right: 80, top: 440, opacity: win(frame, b.call - 6, b.steve) }}>
        <Serif size={64} weight={900}>
          “The most important Test of my career.”
        </Serif>
        <div style={{ marginTop: 16 }}>
          <Label size={22} color={C.mute}>
            Michael Clarke
          </Label>
        </div>
        <div style={{ marginTop: 40, height: 260 }}>
          <Slam text="128" at={b.n128 - 2} size={250} color={C.ink} />
        </div>
        <div style={{ opacity: fade(frame, b.n128 + 6) }}>
          <Label size={22} color={C.ink2} weight={900}>
            Clarke, back from retired hurt on 60
          </Label>
        </div>
      </div>
      <CaseFile src="smith-408.jpg" at={b.steve - 6} x={110} y={420} w={860} h={500} pos="50% 50%" tilt={-2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", gap: 60, opacity: fade(frame, b.n162 - 6) }}>
        <div style={{ textAlign: "center" }}>
          <Label size={20} color={C.mute}>
            Steve Smith
          </Label>
          <div>
            <Disp size={130}>162*</Disp>
          </div>
        </div>
        <div style={{ textAlign: "center", opacity: fade(frame, b.n517 - 8) }}>
          <Label size={20} color={C.mute}>
            Declared
          </Label>
          <div>
            <Disp size={130} color={C.red}>
              517/7
            </Disp>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", opacity: fade(frame, b.steve) }}>
        <Label size={16} color={C.mute} weight={600}>
          Smith beside the 408 painted on the Adelaide outfield
        </Label>
      </div>
    </Shell>
  );
};

/* ================= S4 — DAY 3: THE CAPTAIN AND THE BOUNCER ================= */
const s4Beats = (fps: number) => ({ dhoni: wordAt(fps, "s4", "doney", 1.1), kohli: wordAt(fps, "s4", "kohli", 4.88), n26: wordAt(fps, "s4", "26", 5.92), turned: wordAt(fps, "s4", "turned", 8.16), walks: sentence(fps, "s4", 1).from, n111: wordAt(fps, "s4", "111", 11.84), ball: wordAt(fps, "s4", "ball", 14.78), helmet: wordAt(fps, "s4", "helmet", 17.12), silent: sentence(fps, "s4", 2).from, rush: wordAt(fps, "s4", "rush", 21.42), shaken: wordAt(fps, "s4", "shaken", 23.2), shoulder: wordAt(fps, "s4", "shoulder", 25.54), up: sentence(fps, "s4", 3).from, n115: wordAt(fps, "s4", "115", 28.5), n444: wordAt(fps, "s4", "444", 31.32), n73: wordAt(fps, "s4", "73", 33.5), lyon: wordAt(fps, "s4", "lyon", 35.66) });
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const hit = b.helmet - 4;
  const shake = frame >= hit && frame < hit + 12 ? Math.sin((frame - hit) * 2.4) * 18 * (1 - (frame - hit) / 12) : 0;
  const flash = interpolate(frame, [hit, hit + 2, hit + 14], [0, 0.85, 0], CLAMP);
  const silentDim = win(frame, b.silent - 4, b.up, 10);
  return (
    <Shell enter={false}>
      <DayCard day="Day 3" date="Thu 11 Dec" />
      {/* the stand-in captain */}
      <div style={{ opacity: (1 - silentDim) * (1 - fade(frame, b.up - 6, 8)), transform: `translateX(${shake}px)` }}>
        <Cutout src="kohli-chest-cut.png" x={560} y={420} h={860} at={b.dhoni + 4} from="right" />
        <div style={{ position: "absolute", left: 70, top: 470, width: 520 }}>
          <div style={{ opacity: fade(frame, b.dhoni - 4) }}>
            <Label size={22} color={C.mute}>
              MS Dhoni injured · stand-in captain
            </Label>
          </div>
          <div style={{ marginTop: 8, opacity: fade(frame, b.kohli - 6) }}>
            <Disp size={120} color={C.accent}>
              Virat Kohli
            </Disp>
          </div>
          <div style={{ marginTop: 26, opacity: fade(frame, b.n26 - 4) }}>
            <Disp size={110}>26</Disp>
            <div style={{ opacity: fade(frame, b.turned - 6), marginTop: 4 }}>
              <Label size={18} color={C.ink2} weight={900}>
                The age Hughes would have turned · 30 Nov
              </Label>
            </div>
          </div>
          <div style={{ marginTop: 40, opacity: fade(frame, b.n111 - 6) }}>
            <Label size={20} color={C.mute}>
              Walks in at
            </Label>
            <div>
              <Disp size={100}>India 111/2</Disp>
            </div>
          </div>
          <div style={{ marginTop: 30, opacity: fade(frame, b.ball - 6) }}>
            <span style={{ background: C.red, padding: "8px 20px" }}>
              <Label size={28} color={C.paperHi} weight={900}>
                Ball 1 · Johnson · helmet
              </Label>
            </span>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: flash, pointerEvents: "none" }} />
      {/* the silence: three lines, one at a time */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 560, opacity: silentDim }}>
        {[
          { t: "The ground falls silent.", at: b.silent },
          { t: "Australia's players rush to him.", at: b.rush - 10 },
          { t: "Johnson looks shaken.", at: b.shaken - 10 },
          { t: "Clarke puts a hand on his shoulder.", at: b.shoulder - 16 },
        ].map((l) => (
          <div key={l.t} style={{ marginBottom: 34, opacity: fade(frame, l.at, 12) }}>
            <Serif size={58} color={C.ink}>
              {l.t}
            </Serif>
          </div>
        ))}
      </div>
      {/* he gets up */}
      <CaseFile src="kohli-sky.jpg" at={b.up} x={90} y={420} w={900} h={540} pos="50% 30%" tilt={2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 990, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 30, opacity: fade(frame, b.n115 - 6) }}>
        <Slam text="115" at={b.n115 - 2} size={160} color={C.accent} />
        <Label size={22} color={C.ink2} weight={900}>
          off 184 balls
        </Label>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center", gap: 46, opacity: fade(frame, b.n444 - 6) }}>
        <Label size={24} color={C.ink} weight={900}>
          India 444
        </Label>
        <Label size={24} color={C.red} weight={900} style={{ opacity: fade(frame, b.n73 - 6) }}>
          73 behind
        </Label>
        <Label size={24} color={C.ink} weight={900} style={{ opacity: fade(frame, b.lyon - 6) }}>
          Lyon 5/134
        </Label>
      </div>
    </Shell>
  );
};

/* ================= S5 — DAY 4: THE DARE ================= */
const s5Beats = (fps: number) => ({ n100: wordAt(fps, "s5", "100", 2.04), overnight: wordAt(fps, "s5", "overnight", 4.4), n364: wordAt(fps, "s5", "364", 6.6), pitch: wordAt(fps, "s5", "pitch", 10.44), block: wordAt(fps, "s5", "block", 12.5), go: wordAt(fps, "s5", "go", 14.2) });
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const goP = useP(b.go - 4, { damping: 11, stiffness: 240, mass: 0.7 });
  return (
    <Shell enter={false}>
      <DayCard day="Day 4" date="Fri 12 Dec" />
      <div style={{ opacity: win(frame, 10, b.n364 - 4) }}>
        <Cutout src="warner-leap-cut.png" x={540} y={460} h={640} at={18} from="right" />
        <div style={{ position: "absolute", left: 70, top: 500 }}>
          <Label size={22} color={C.mute}>
            David Warner
          </Label>
          <div style={{ height: 230 }}>
            <Slam text="102" at={b.n100 - 4} size={220} color={C.ink} />
          </div>
          <div style={{ opacity: fade(frame, b.n100 + 6) }}>
            <Label size={22} color={C.ink2} weight={900}>
              145 & 102 · a hundred in each innings
            </Label>
          </div>
          <div style={{ marginTop: 34, opacity: fade(frame, b.overnight - 6) }}>
            <span style={{ background: C.ink, padding: "8px 18px" }}>
              <Label size={26} color={C.paperHi} weight={900}>
                290/5 · declared overnight
              </Label>
            </span>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", opacity: fade(frame, b.n364 - 4) }}>
        <Label size={26} color={C.mute}>
          India need
        </Label>
        <div>
          <Disp size={380} color={C.red}>
            364
          </Disp>
        </div>
        <div style={{ opacity: fade(frame, b.pitch - 8) }}>
          <Label size={24} color={C.ink2} weight={900}>
            On day 5 · on a turning pitch
          </Label>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1050, display: "flex", justifyContent: "center", gap: 40, opacity: fade(frame, b.block - 8) }}>
        <div style={{ position: "relative", padding: "12px 24px", border: `3px solid ${C.mute}` }}>
          <Label size={28} color={C.mute} weight={900}>
            Block for a draw
          </Label>
          <div style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 5, background: C.red, transform: `scaleX(${ease(frame, b.go - 8, 10)})`, transformOrigin: "0% 50%" }} />
        </div>
        <div style={{ padding: "12px 24px", background: C.accent, opacity: interpolate(goP, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(goP, [0, 1], [1.3, 1])})` }}>
          <Label size={28} color={C.paperHi} weight={900}>
            Go for it
          </Label>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S6 — DAY 5: THE CHASE ================= */
const s6Beats = (fps: number) => ({ n57: wordAt(fps, "s6", "57", 4.96), believe: wordAt(fps, "s6", "believe", 9.22), tea: wordAt(fps, "s6", "tea", 11.38), n205: wordAt(fps, "s6", "205", 11.8), n159: wordAt(fps, "s6", "159", 14.86), second: wordAt(fps, "s6", "second", 18.86), chappell: wordAt(fps, "s6", "chappell", 20.74), n185: wordAt(fps, "s6", "185", 26.02), n242: wordAt(fps, "s6", "242", 29.36), n122: wordAt(fps, "s6", "122", 31.44), hand: wordAt(fps, "s6", "hand", 34.04) });
const overAt = (frame: number, keys: [number, number][]) => {
  let o = keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (frame >= keys[i][0]) o = interpolate(frame, [keys[i][0], keys[i + 1][0]], [keys[i][1], keys[i + 1][1]], { easing: theme.ease.inOut, ...CLAMP });
  }
  return o;
};
const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const ov = overAt(frame, [
    [24, 0],
    [b.n57 - 6, 20],
    [b.believe, 40],
    [b.n205 - 4, 61],
    [b.second - 4, 68],
    [b.n242 - 4, 69.15],
  ]);
  const stand = Math.round(interpolate(frame, [b.n185 - 20, b.n185], [0, 185], { easing: theme.ease.out, ...CLAMP }));
  return (
    <Shell enter={false}>
      <DayCard day="Day 5" date="Sat 13 Dec" />
      <div style={{ opacity: fade(frame, 20) }}>
        <ChaseChart ov={ov} showTea={fade(frame, b.tea - 6)} showHundred={fade(frame, b.second - 4)} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 1140, right: 70, display: "flex", gap: 40, alignItems: "flex-start" }}>
        <div style={{ opacity: win(frame, b.chappell - 10, 99999) }}>
          <Label size={18} color={C.mute}>
            Twin hundreds on captaincy debut
          </Label>
          <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
            <Label size={24} color={C.ink} weight={900}>
              Greg Chappell 1975
            </Label>
            <Label size={24} color={C.accent} weight={900}>
              Virat Kohli 2014
            </Label>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 130, top: 560, opacity: fade(frame, b.n185 - 20) }}>
        <Label size={18} color={C.mute}>
          Kohli–Vijay stand
        </Label>
        <div>
          <Disp size={84} color={C.ink}>
            {String(stand)}
          </Disp>
        </div>
      </div>
      <div style={{ position: "absolute", left: 130, top: 690, opacity: fade(frame, b.hand - 12) }}>
        <Label size={22} color={C.ink} weight={900}>
          8 wickets in hand
        </Label>
      </div>
    </Shell>
  );
};

/* ================= S7 — THEN, NATHAN LYON ================= */
const s7Beats = (fps: number) => ({ lyon: wordAt(fps, "s7", "lyon", 0.66), n99: wordAt(fps, "s7", "99", 3.84), rahane: wordAt(fps, "s7", "rahane", 7.06), pad: wordAt(fps, "s7", "pad", 9.14), review: wordAt(fps, "s7", "review", 10.62), rohit: wordAt(fps, "s7", "rohit", 13.22), saha: wordAt(fps, "s7", "saha", 15.1), bowled: wordAt(fps, "s7", "bold", 16.4), n141: wordAt(fps, "s7", "141", 17.88), marsh: wordAt(fps, "s7", "marsh", 23.46), eight: wordAt(fps, "s7", "eight", 27.74), n73: wordAt(fps, "s7", "73", 28.66), stumped: wordAt(fps, "s7", "stumped", 30.94) });
const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const ov = overAt(frame, [
    [0, 69.15],
    [b.n99 - 4, 69.3],
    [b.pad - 6, 69.95],
    [b.rohit - 4, 77.9],
    [b.bowled - 4, 79.9],
    [b.marsh - 6, 81.9],
    [b.eight + 10, 86.9],
    [b.stumped - 4, 87.2],
  ]);
  const rows = [
    { n: "Vijay", r: "99", how: "lbw", at: b.n99 - 4 },
    { n: "Rahane", r: "0", how: "c Rogers · off the pad", at: b.pad - 8 },
    { n: "Rohit", r: "6", how: "c Warner", at: b.rohit - 4 },
    { n: "Saha", r: "13", how: "bowled", at: b.bowled - 4 },
    { n: "Kohli", r: "141", how: "c Marsh", at: b.marsh - 8 },
    { n: "Shami", r: "5", how: "c Johnson b Harris", at: b.eight },
    { n: "Aaron", r: "1", how: "lbw b Johnson", at: b.eight + 6 },
    { n: "Ishant", r: "1", how: "st Haddin", at: b.stumped - 4 },
  ];
  return (
    <Shell enter={false}>
      {/* Lyon steps in */}
      <div style={{ opacity: 1 - fade(frame, b.n99 - 14, 10) }}>
        <CaseFile src="lyon-prayer.jpg" at={2} x={90} y={420} w={900} h={520} pos="50% 40%" tilt={-2} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 990, textAlign: "center", opacity: fade(frame, 6) }}>
          <Disp size={130}>Nathan Lyon</Disp>
        </div>
      </div>
      <div style={{ opacity: fade(frame, b.n99 - 10) }}>
        <ChaseChart ov={ov} top={300} height={470} showTea={1} showHundred={1} collapse />
        <div style={{ position: "absolute", left: 70, right: 70, top: 870, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 30, rowGap: 6 }}>
          {rows.map((r) => {
            const p = useP(r.at);
            return (
              <div key={r.n} style={{ display: "flex", alignItems: "baseline", gap: 12, height: 74, borderBottom: `1px solid ${C.line}`, opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP), transform: `translateX(${interpolate(p, [0, 1], [30, 0])}px)` }}>
                <Disp size={56} color={r.n === "Kohli" ? C.accent : C.red}>
                  {r.r}
                </Disp>
                <div>
                  <Label size={20} color={C.ink} weight={900}>
                    {r.n}
                  </Label>
                  <div>
                    <Label size={14} color={C.mute}>
                      {r.how}
                    </Label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 70, top: 800, opacity: win(frame, b.review - 6, b.rohit + 20) }}>
          <span style={{ background: C.red, padding: "6px 16px" }}>
            <Label size={22} color={C.paperHi} weight={900}>
              No DRS in this series
            </Label>
          </span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1210, textAlign: "center", opacity: fade(frame, b.eight - 4) }}>
          <Disp size={110} color={C.red}>
            8 for 73
          </Disp>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S8 — THE ENDING ================= */
const s8Beats = (fps: number) => ({ n48: wordAt(fps, "s8", "48", 1.16), seven: wordAt(fps, "s8", "seven", 3.62), n12: wordAt(fps, "s8", "12", 6.3), n256: wordAt(fps, "s8", "256", 8.58), month: wordAt(fps, "s8", "month", 14.78), lose: sentence(fps, "s8", 2).from, some: sentence(fps, "s8", 3).from, n63: sentence(fps, "s8", 4).from, brand: sentence(fps, "s8", 5).from - 6 });
const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  return (
    <Shell exit={false} drift={0.015}>
      {/* A: the result */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", opacity: win(frame, 2, b.seven - 4) }}>
        <Label size={26} color={C.mute}>
          Australia win by
        </Label>
        <div>
          <Disp size={340}>48</Disp>
        </div>
        <Label size={40} color={C.ink} weight={900}>
          runs
        </Label>
        <div style={{ marginTop: 50 }}>
          <Label size={22} color={C.ink2} weight={900}>
            Australia 517/7d & 290/5d · India 444 & 315
          </Label>
        </div>
      </div>
      {/* B: Lyon's twelve */}
      <div style={{ opacity: win(frame, b.seven - 6, b.n256 - 4) }}>
        <BigGlyph char="12" x={160} y={300} size={900} width={760} draw={1} fill={0.9} fillColor={C.ink} stroke={C.ink} />
        <Cutout src="lyon-stump-cut.png" x={380} y={380} h={860} at={b.seven - 4} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1190, textAlign: "center" }}>
          <Label size={26} color={C.ink} weight={900}>
            Lyon · 7/152 · 12/286 in the match · player of the match
          </Label>
        </div>
      </div>
      {/* C: Kohli's 256 */}
      <div style={{ opacity: win(frame, b.n256 - 4, b.lose) }}>
        <Cutout src="kohli-chest-cut.png" x={600} y={400} h={860} at={b.n256 - 4} from="right" />
        <div style={{ position: "absolute", left: 70, top: 500 }}>
          <Label size={22} color={C.mute}>
            Kohli in his first Test as captain
          </Label>
          <div style={{ height: 270 }}>
            <Slam text="256" at={b.n256 - 2} size={260} color={C.accent} />
          </div>
          <Label size={26} color={C.ink2} weight={900}>
            115 + 141 · most by an Indian
          </Label>
          <div style={{ marginTop: 40, opacity: fade(frame, b.month - 6) }}>
            <span style={{ background: C.accent, padding: "8px 18px" }}>
              <Label size={24} color={C.paperHi} weight={900}>
                Full-time captain within a month
              </Label>
            </span>
          </div>
        </div>
      </div>
      {/* D: the lines */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 640, textAlign: "center", opacity: win(frame, b.lose, b.n63) }}>
        <Serif size={66} weight={900}>
          India lose the Test.
        </Serif>
        <div style={{ opacity: fade(frame, b.lose + 40) }}>
          <Serif size={66} weight={900} color={C.accent}>
            But they find their captain.
          </Serif>
        </div>
        <div style={{ marginTop: 70, opacity: fade(frame, b.some) }}>
          <Serif size={56} color={C.ink2}>
            Some Tests are won. This one is remembered.
          </Serif>
        </div>
      </div>
      {/* E: dedication + brand */}
      <div style={{ opacity: fade(frame, b.n63 - 4) }}>
        <TributeCard at={b.n63 - 4} show63={1} age={0} top={330} scale={0.9} />
      </div>
      <Brand at={b.brand + 2} top={1110} series={config.series} tagline={config.tagline} />
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
  ] as [string, React.FC][],
  warmFrom: (fps: number) => scene(fps, "s8").from,
  mastheadOffAt: (fps: number) => scene(fps, "s8").from + s8Beats(fps).brand,
  captionsOffFrom: (fps: number) => scene(fps, "s8").from + sentence(fps, "s8", 5).from - 2,
  sfx: (fps: number): Cue[] => {
    const S = (id: string) => scene(fps, id).from;
    const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps), b8 = s8Beats(fps);
    const c: Cue[] = [];
    const add = (id: string, at: number, file: string, volume: number) => c.push({ at: S(id) + at, file, volume });
    ["s2", "s3", "s4", "s5", "s6", "s7", "s8"].forEach((id) => {
      c.push({ at: S(id) - 9, file: "swoosh.wav", volume: 0.24 });
      if (id !== "s7" && id !== "s8") c.push({ at: S(id) + 2, file: "slam.wav", volume: 0.3 });
    });
    // s1
    add("s1", b1.n63 - 4, "pen.wav", 0.3);
    add("s1", b1.bouncer - 2, "crack.wav", 0.4);
    add("s1", b1.clap + 6, "crowd.wav", 0.35);
    add("s1", b1.clap + 60, "crowd.wav", 0.3);
    add("s1", b1.title - 2, "impact.wav", 0.55);
    // s2
    add("s2", b2.n408 - 10, "pen.wav", 0.35);
    add("s2", b2.n63 - 2, "slam.wav", 0.35);
    add("s2", b2.n145 - 2, "slam.wav", 0.45);
    add("s2", b2.n145, "crowd.wav", 0.2);
    add("s2", b2.hurt - 6, "pop.wav", 0.3);
    // s3
    add("s3", b3.n128 - 2, "slam.wav", 0.4);
    add("s3", b3.steve - 6, "swoosh.wav", 0.2);
    add("s3", b3.n517 - 8, "slam.wav", 0.4);
    // s4
    add("s4", b4.kohli - 6, "rise.wav", 0.2);
    add("s4", b4.helmet - 4, "impact.wav", 0.7);
    add("s4", b4.n115 - 2, "slam.wav", 0.5);
    add("s4", b4.n115, "crowd.wav", 0.25);
    // s5
    add("s5", b5.n100 - 4, "slam.wav", 0.4);
    add("s5", b5.n364 - 4, "impact.wav", 0.5);
    add("s5", b5.go - 4, "slam.wav", 0.45);
    // s6
    add("s6", b6.n57 - 6, "pop.wav", 0.25);
    add("s6", b6.n205 - 4, "pop.wav", 0.3);
    add("s6", b6.second - 4, "slam.wav", 0.4);
    add("s6", b6.second, "crowd.wav", 0.22);
    add("s6", b6.n242 - 4, "rise.wav", 0.25);
    // s7 — every wicket cracks
    add("s7", 2, "whip.wav", 0.3);
    [b7.n99 - 4, b7.pad - 8, b7.rohit - 4, b7.bowled - 4, b7.marsh - 8, b7.eight, b7.eight + 6, b7.stumped - 4].forEach((x, i) => add("s7", x, i === 4 ? "impact.wav" : "crack.wav", i === 4 ? 0.55 : 0.4));
    add("s7", b7.eight - 4, "slam.wav", 0.4);
    // s8
    add("s8", b8.n48 - 4, "impact.wav", 0.5);
    add("s8", b8.seven - 4, "slam.wav", 0.4);
    add("s8", b8.n256 - 2, "slam.wav", 0.45);
    add("s8", b8.n63 - 4, "pen.wav", 0.3);
    c.push({ at: totalFrames(fps) - Math.round(fps * 1.2), file: "pen.wav", volume: 0.25 });
    return c;
  },
};
