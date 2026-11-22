// ADELAIDE 2014 — KOHLI'S DAY 5. Opens on the climax, rewinds, then lives in the final day. Numbers: Cricsheet ball-by-ball.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, Cutout, Disp, fade, Label, Serif, Shell, useP } from "../components/Ed";
import { Cue } from "../components/Sound";
import { Brand, CaseFile, Lockup, Slam } from "../components/Viz";
import { config } from "../config";
import data from "../data.json";
import { theme } from "../theme";
import { scene, sentence, totalFrames, wordAt } from "../timing";

const C = theme.colors;
const ease = (f: number, a: number, len: number) => interpolate(f, [a, a + len], [0, 1], { easing: theme.ease.out, ...CLAMP });
const win = (f: number, a: number, b: number, len = 8) => fade(f, a, len) * (1 - fade(f, b - len, len));
const overAt = (frame: number, keys: [number, number][]) => {
  let o = keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (frame >= keys[i][0]) o = interpolate(frame, [keys[i][0], keys[i + 1][0]], [keys[i][1], keys[i + 1][1]], { easing: theme.ease.inOut, ...CLAMP });
  }
  return o;
};
// Kohli's own score at a given over on day 5 (ball-by-ball checkpoints)
const KOHLI = [[19.6, 0], [45, 50], [61, 82], [69, 100], [77.9, 128], [79.9, 137], [81.9, 141], [90, 141]];
const kohliAt = (ov: number) => {
  for (let i = 0; i < KOHLI.length - 1; i++) {
    const [o0, r0] = KOHLI[i], [o1, r1] = KOHLI[i + 1];
    if (ov <= o1) return ov < o0 ? 0 : r0 + ((r1 - r0) * (ov - o0)) / (o1 - o0);
  }
  return 141;
};

/* ---------- pieces ---------- */
const DayCard: React.FC<{ day: string; date: string }> = ({ day, date }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 22, fps, config: theme.spring.smooth });
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: interpolate(p, [0, 1], [700, 250]), opacity: ease(frame, 0, 8), transform: `scale(${interpolate(p, [0, 1], [1, 0.36])})`, transformOrigin: "0% 0%", zIndex: 5 }}>
      <Disp size={240}>{day}</Disp>
      <div style={{ marginTop: -6 }}>
        <Label size={44} color={C.red} spacing="0.24em">
          {date}
        </Label>
      </div>
    </div>
  );
};

const Tag: React.FC<{ text: string; color?: string; size?: number; style?: React.CSSProperties }> = ({ text, color = C.red, size = 26, style }) => (
  <span style={{ background: color, padding: "8px 18px", display: "inline-block", ...style }}>
    <Label size={size} color={C.paperHi} weight={900}>
      {text}
    </Label>
  </span>
);

// India's chase, over by over, with the 364 line, wickets and a live readout (Kohli's own score included)
const ChaseChart: React.FC<{ ov: number; top?: number; height?: number; tea?: number; hundred?: number; dim?: number; fix?: { r: number; w: number; k: number; out?: boolean } }> = ({ ov, top = 430, height = 600, tea = 0, hundred = 0, dim = 1, fix }) => {
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
  const k = fix ? fix.k : Math.round(kohliAt(ov));
  const kohliOut = fix ? Boolean(fix.out) : ov >= 81.9;
  const shownR = fix ? fix.r : Math.round(now[1]);
  const shownW = fix ? fix.w : wk;
  return (
    <div style={{ opacity: dim }}>
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
        {tea > 0 && (
          <g opacity={tea}>
            <line x1={X(61)} y1={Y(0)} x2={X(61)} y2={Y(330)} stroke={C.ink2} strokeWidth={2} strokeDasharray="4 8" />
            <text x={X(61) - 10} y={Y(330) - 10} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={900} fontSize={20} fill={C.ink2}>
              TEA 205/2
            </text>
          </g>
        )}
        <path d={pts.map(([o, r], i) => `${i ? "L" : "M"} ${X(o)} ${Y(r)}`).join(" ")} fill="none" stroke={C.accent} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
        {data.wickets
          .filter((w) => w.o <= ov + 0.01)
          .map((w) => (
            <circle key={w.n} cx={X(w.o)} cy={Y(w.at)} r={w.n === "Kohli" ? 16 : 10} fill={w.n === "Kohli" ? C.accent : C.red} stroke={C.paper} strokeWidth={4} />
          ))}
        {hundred > 0 && (
          <g opacity={hundred}>
            <circle cx={X(68.5)} cy={Y(237)} r={18} fill="none" stroke={C.accent} strokeWidth={4} />
            <text x={X(68.5) - 26} y={Y(237) + 7} textAnchor="end" fontFamily={theme.fonts.body} fontWeight={900} fontSize={20} fill={C.accent}>
              KOHLI 100
            </text>
          </g>
        )}
        <circle cx={X(now[0])} cy={Y(now[1])} r={12} fill={C.accent} stroke={C.paperHi} strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", right: 70, top: top + 66, textAlign: "right" }}>
        <Label size={20} color={C.mute}>
          India
        </Label>
        <div>
          <Disp size={120} color={C.accent}>{`${shownR}/${shownW}`}</Disp>
        </div>
        <Label size={24} color={C.red} weight={900}>{`Need ${Math.max(0, 364 - shownR)}`}</Label>
        {ov >= 19 && (
          <div style={{ marginTop: 10 }}>
            <Label size={22} color={kohliOut ? C.mute : C.ink} weight={900}>{`Kohli ${k}${kohliOut ? "" : "*"}`}</Label>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= S1 — THE HOOK ================= */
const s1Beats = (fps: number) => ({ n122: wordAt(fps, "s1", "122", 4.24), eight: wordAt(fps, "s1", "8", 5.92), captain: sentence(fps, "s1", 1).from, n26: wordAt(fps, "s1", "26", 8.5), first: wordAt(fps, "s1", "first", 9.8), rewind: sentence(fps, "s1", 2).from });
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const ov = interpolate(frame, [0, 26, b.rewind, b.rewind + 22], [55, 69.15, 69.15, 0], { easing: theme.ease.inOut, ...CLAMP });
  const jitter = frame >= b.rewind && frame < b.rewind + 24 ? (frame % 2 ? 6 : -6) : 0;
  return (
    <Shell enter={false}>
      <div style={{ position: "absolute", left: 70, top: 250, opacity: fade(frame, 2) }}>
        <Label size={26} color={C.red} spacing="0.26em">
          Adelaide · Day 5 · final session
        </Label>
      </div>
      <div style={{ transform: `translateX(${jitter}px)` }}>
        <ChaseChart ov={ov} dim={interpolate(frame, [b.captain - 6, b.captain + 6, b.rewind - 4, b.rewind], [1, 0.22, 0.22, 1], CLAMP)} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 560, opacity: win(frame, b.eight - 4, b.captain) }}>
        <Tag text="8 wickets in hand" color={C.ink} size={30} />
      </div>
      {/* the captain */}
      <div style={{ opacity: win(frame, b.captain - 4, b.rewind) }}>
        <Cutout src="kohli-chest-cut.png" x={590} y={430} h={860} at={b.captain} from="right" />
        <div style={{ position: "absolute", left: 70, top: 560 }}>
          <Disp size={130} color={C.accent}>
            Virat
          </Disp>
          <div style={{ marginTop: -8 }}>
            <Disp size={130} color={C.accent}>
              Kohli
            </Disp>
          </div>
          <div style={{ marginTop: 24, opacity: fade(frame, b.n26 - 4) }}>
            <Disp size={120}>26</Disp>
          </div>
          <div style={{ marginTop: 14, opacity: fade(frame, b.first - 6) }}>
            <Tag text="1st Test as captain" color={C.accent} />
          </div>
        </div>
      </div>
      {/* rewind */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", opacity: win(frame, b.rewind - 2, b.rewind + 60, 4) }}>
        <Tag text="◀◀  Rewind 4 days" color={C.ink} size={34} />
      </div>
    </Shell>
  );
};

/* ================= S2 — FOUR DAYS EARLIER ================= */
const s2Beats = (fps: number) => ({ aus: sentence(fps, "s2", 1).from, n517: wordAt(fps, "s2", "517", 6.32), hundreds: wordAt(fps, "s2", "hundreds", 10.68), dhoni: sentence(fps, "s2", 2).from, kohli: wordAt(fps, "s2", "kohli", 14.04), ball: sentence(fps, "s2", 3).from, helmet: wordAt(fps, "s2", "helmet", 19.3), up: wordAt(fps, "s2", "gets", 20.36), n115: wordAt(fps, "s2", "115", 21.52), warner: sentence(fps, "s2", 4).from, n364: wordAt(fps, "s2", "364", 27.72), draw: sentence(fps, "s2", 5).from, win: wordAt(fps, "s2", "win", 34.72) });
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const hit = b.helmet - 4;
  const shake = frame >= hit && frame < hit + 12 ? Math.sin((frame - hit) * 2.4) * 20 * (1 - (frame - hit) / 12) : 0;
  const flash = interpolate(frame, [hit, hit + 2, hit + 14], [0, 0.85, 0], CLAMP);
  const winP = useP(b.win - 6, { damping: 11, stiffness: 240, mass: 0.7 });
  return (
    <Shell>
      <div style={{ position: "absolute", left: 70, top: 250, opacity: fade(frame, 2) }}>
        <Label size={26} color={C.mute} spacing="0.26em">
          Four days earlier
        </Label>
      </div>
      {/* in grief (the one mention) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", opacity: win(frame, 6, b.aus) }}>
        <div style={{ width: 120, height: 14, background: C.ink, margin: "0 auto 26px" }} />
        <Serif size={54} color={C.ink}>
          A Test played in grief
        </Serif>
        <div style={{ marginTop: 14 }}>
          <Label size={22} color={C.mute}>
            Two weeks after Phillip Hughes's death
          </Label>
        </div>
      </div>
      {/* Australia 517 */}
      <div style={{ opacity: win(frame, b.aus - 4, b.dhoni) }}>
        <Cutout src="warner-leap-cut.png" x={560} y={460} h={600} at={b.aus} from="right" />
        <div style={{ position: "absolute", left: 70, top: 470 }}>
          <Label size={22} color={C.mute}>
            Australia bat first
          </Label>
          <div style={{ height: 250 }}>
            <Slam text="517" at={b.n517 - 4} size={240} color={C.ink} />
          </div>
          {[
            ["Warner", "145"],
            ["Clarke", "128"],
            ["Smith", "162*"],
          ].map(([n, r], i) => (
            <div key={n} style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 6, opacity: fade(frame, b.hundreds - 18 + i * 6) }}>
              <Disp size={64}>{r}</Disp>
              <Label size={20} color={C.ink2} weight={900}>
                {n}
              </Label>
            </div>
          ))}
        </div>
      </div>
      {/* Kohli takes charge, the helmet, the 115 */}
      <div style={{ opacity: win(frame, b.dhoni - 4, b.warner), transform: `translateX(${shake}px)` }}>
        <Cutout src="kohli-chest-cut.png" x={590} y={420} h={880} at={b.dhoni} from="right" />
        <div style={{ position: "absolute", left: 70, top: 470, width: 540 }}>
          <Label size={22} color={C.mute}>
            MS Dhoni injured
          </Label>
          <div style={{ marginTop: 6, opacity: fade(frame, b.kohli - 8) }}>
            <Disp size={120} color={C.accent}>
              Kohli leads
            </Disp>
          </div>
          <div style={{ marginTop: 40, opacity: fade(frame, b.ball - 4) }}>
            <Tag text="Ball 1 · Johnson · helmet" size={28} />
          </div>
          <div style={{ marginTop: 40, opacity: fade(frame, b.up - 4) }}>
            <Label size={22} color={C.ink2} weight={900}>
              He gets up
            </Label>
            <div style={{ height: 230 }}>
              <Slam text="115" at={b.n115 - 2} size={220} color={C.accent} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: flash, pointerEvents: "none" }} />
      {/* the target, the choice */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", opacity: fade(frame, b.warner + 20) }}>
        <Label size={22} color={C.mute}>
          Warner 102 · Australia declare
        </Label>
        <div style={{ marginTop: 20, opacity: fade(frame, b.n364 - 6) }}>
          <Label size={26} color={C.mute}>
            India need
          </Label>
          <div>
            <Disp size={360} color={C.red}>
              364
            </Disp>
          </div>
          <Label size={24} color={C.ink2} weight={900}>
            On the final day
          </Label>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, display: "flex", justifyContent: "center", gap: 40, opacity: fade(frame, b.draw - 6) }}>
        <div style={{ position: "relative", padding: "12px 26px", border: `3px solid ${C.mute}` }}>
          <Label size={30} color={C.mute} weight={900}>
            Settle for a draw
          </Label>
          <div style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 5, background: C.red, transform: `scaleX(${ease(frame, b.win - 14, 10)})`, transformOrigin: "0% 50%" }} />
        </div>
        <div style={{ padding: "12px 26px", background: C.accent, opacity: interpolate(winP, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(winP, [0, 1], [1.35, 1])})` }}>
          <Label size={30} color={C.paperHi} weight={900}>
            Go for the win
          </Label>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S3 — DAY 5 MORNING ================= */
const s3Beats = (fps: number) => ({ dhawan: wordAt(fps, "s3", "9", 1.9), pujara: wordAt(fps, "s3", "21", 3.1), n57: wordAt(fps, "s3", "57", 4.2), walks: sentence(fps, "s3", 1).from, n307: wordAt(fps, "s3", "307", 7.52) });
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  const ov = overAt(frame, [
    [18, 0],
    [b.dhawan, 5],
    [b.pujara, 19.6],
    [b.n57, 19.9],
  ]);
  return (
    <Shell enter={false}>
      <DayCard day="Day 5" date="Sat 13 Dec · 364 to win" />
      <div style={{ opacity: fade(frame, 18) }}>
        <ChaseChart ov={ov} fix={frame >= b.pujara - 4 ? { r: 57, w: 2, k: 0 } : undefined} />
      </div>
      <div style={{ position: "absolute", left: 140, top: 820, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ opacity: fade(frame, b.dhawan - 4) }}>
          <Tag text="Dhawan 9" size={24} />
        </div>
        <div style={{ opacity: fade(frame, b.pujara - 4) }}>
          <Tag text="Pujara 21" size={24} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", opacity: fade(frame, b.walks - 4) }}>
        <Tag text="Kohli walks in at 57/2" color={C.accent} size={34} />
      </div>
    </Shell>
  );
};

/* ================= S4 — KOHLI v LYON, TO TEA ================= */
const s4Beats = (fps: number) => ({ lyon: wordAt(fps, "s4", "lyon", 2.22), against: sentence(fps, "s4", 1).from, n74: wordAt(fps, "s4", "74", 7.7), n82: wordAt(fps, "s4", "82", 9.1), vijay: sentence(fps, "s4", 2).from, tea: wordAt(fps, "s4", "205", 14.82), n159: wordAt(fps, "s4", "159", 17.9) });
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const ov = overAt(frame, [
    [b.vijay - 4, 19.9],
    [b.tea - 4, 61],
  ]);
  return (
    <Shell>
      {/* the duel */}
      <div style={{ opacity: win(frame, 4, b.vijay) }}>
        <Cutout src="lyon-bowl-cut.png" x={70} y={440} h={760} at={4} from="left" />
        <div style={{ position: "absolute", left: 400, top: 470, right: 70 }}>
          <Label size={22} color={C.mute}>
            Australia's weapon on a turning pitch
          </Label>
          <div style={{ marginTop: 6 }}>
            <Disp size={110}>Nathan Lyon</Disp>
          </div>
          <div style={{ marginTop: 40, opacity: fade(frame, b.against - 4) }}>
            <Label size={24} color={C.accent} weight={900}>
              Kohli against Lyon, day 5
            </Label>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 6 }}>
              <Slam text="74" at={b.n74 - 2} size={200} color={C.accent} />
              <div style={{ opacity: fade(frame, b.n82 - 4) }}>
                <Disp size={70} color={C.ink}>
                  off 82
                </Disp>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 14, opacity: fade(frame, b.n82 + 6) }}>
              <Tag text="9 fours" color={C.ink} size={22} />
              <Tag text="1 six" color={C.ink} size={22} />
            </div>
          </div>
        </div>
      </div>
      {/* to tea */}
      <div style={{ opacity: fade(frame, b.vijay - 4) }}>
        <ChaseChart ov={ov} tea={fade(frame, b.tea - 6)} />
        <div style={{ position: "absolute", left: 140, top: 760, display: "flex", gap: 14, opacity: fade(frame, b.tea) }}>
          <Tag text="Kohli 82*" color={C.accent} size={26} />
          <Tag text="Vijay 85*" color={C.ink} size={26} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", opacity: fade(frame, b.n159 - 6) }}>
          <Serif size={52} weight={900}>
            159 to win. <span style={{ color: C.red }}>One session.</span>
          </Serif>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S5 — THE HUNDRED, THE CHASE IS ON ================= */
const s5Beats = (fps: number) => ({ n100: wordAt(fps, "s5", "100", 0.88), n135: wordAt(fps, "s5", "135", 1.88), second: wordAt(fps, "s5", "second", 4.8), chappell: wordAt(fps, "s5", "chappell", 8.5), n242: sentence(fps, "s5", 1).from, n122: wordAt(fps, "s5", "122", 13.6), on: wordAt(fps, "s5", "impossible", 15.5) });
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const ov = overAt(frame, [
    [b.n242 - 30, 61],
    [b.n242 + 10, 69.15],
  ]);
  return (
    <Shell>
      <div style={{ opacity: win(frame, 0, b.n242 - 10) }}>
        <CaseFile src="kohli-sky.jpg" at={2} x={90} y={410} w={900} h={540} pos="50% 30%" tilt={-2} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 990, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 26 }}>
          <Slam text="100" at={b.n100 - 4} size={170} color={C.accent} />
          <div style={{ opacity: fade(frame, b.n135 - 4) }}>
            <Label size={24} color={C.ink2} weight={900}>
              off 135 balls
            </Label>
          </div>
        </div>
        <div style={{ position: "absolute", left: 70, right: 70, top: 1190, textAlign: "center", opacity: fade(frame, b.second - 6) }}>
          <Label size={20} color={C.mute}>
            Twin hundreds in a first Test as captain
          </Label>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 6, opacity: fade(frame, b.chappell - 8) }}>
            <Label size={26} color={C.ink} weight={900}>
              Greg Chappell 1975
            </Label>
            <Label size={26} color={C.accent} weight={900}>
              Virat Kohli 2014
            </Label>
          </div>
        </div>
      </div>
      <div style={{ opacity: fade(frame, b.n242 - 12) }}>
        <ChaseChart ov={ov} tea={1} hundred={1} />
        <div style={{ position: "absolute", left: 140, top: 700, opacity: fade(frame, b.n122) }}>
          <Tag text="8 wickets in hand" color={C.ink} size={28} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", opacity: fade(frame, b.on - 4) }}>
          <Serif size={58} weight={900} color={C.accent}>
            The impossible chase is on.
          </Serif>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S6 — THEN LYON FINDS A WAY ================= */
const s6Beats = (fps: number) => ({ way: wordAt(fps, "s6", "way", 1.1), n99: wordAt(fps, "s6", "99", 3.52), pad: wordAt(fps, "s6", "pad", 8.12), drs: wordAt(fps, "s6", "drs", 9.56), rohit: wordAt(fps, "s6", "rohit", 11.9), bowled: wordAt(fps, "s6", "bold", 14.38), swinging: wordAt(fps, "s6", "swinging", 17.46), n41: wordAt(fps, "s6", "41", 18.84), n141: wordAt(fps, "s6", "141", 21.62), n60: wordAt(fps, "s6", "60", 24.38), pulls: wordAt(fps, "s6", "pulls", 25.62), boundary: wordAt(fps, "s6", "boundary", 28.5) });
const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const ov = overAt(frame, [
    [0, 69.15],
    [b.n99 - 4, 69.3],
    [b.pad - 6, 69.95],
    [b.rohit - 4, 77.9],
    [b.bowled - 4, 79.9],
    [b.n60, 81.6],
    [b.pulls + 10, 81.95],
  ]);
  const rows = [
    { n: "Vijay", r: "99", how: "lbw b Lyon", at: b.n99 - 4 },
    { n: "Rahane", r: "0", how: "c Rogers b Lyon · off the pad", at: b.pad - 8 },
    { n: "Rohit", r: "6", how: "c Warner b Lyon", at: b.rohit - 4 },
    { n: "Saha", r: "13", how: "b Lyon", at: b.bowled - 4 },
    { n: "Kohli", r: "141", how: "c Marsh b Lyon · on the boundary", at: b.pulls + 12 },
  ];
  return (
    <Shell>
      <div style={{ opacity: 1 - fade(frame, b.n99 - 12, 8) }}>
        <CaseFile src="lyon-appeal.jpg" at={2} x={90} y={420} w={900} h={560} pos="50% 50%" tilt={-2} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1030, textAlign: "center" }}>
          <Serif size={64} weight={900}>
            Then Lyon finds a way.
          </Serif>
        </div>
      </div>
      <div style={{ opacity: fade(frame, b.n99 - 10) }}>
        <ChaseChart ov={ov} top={300} height={470} tea={1} hundred={1} fix={frame >= b.pulls + 10 ? { r: 304, w: 7, k: 141, out: true } : frame >= b.n141 - 6 ? { r: 304, w: 6, k: 141 } : undefined} />
        <div style={{ position: "absolute", left: 140, top: 640, opacity: win(frame, b.drs - 6, b.rohit + 20) }}>
          <Tag text="No DRS in this series" size={24} />
        </div>
        <div style={{ position: "absolute", left: 140, top: 640, opacity: win(frame, b.n41 - 4, b.n60 - 4) }}>
          <Tag text="Kohli: 41 off 40 as wickets fall" color={C.accent} size={24} />
        </div>
        <div style={{ position: "absolute", left: 140, top: 640, opacity: fade(frame, b.n60 - 4) }}>
          <Tag text="India need 60 · 3 wickets left" color={C.ink} size={24} />
        </div>
        <div style={{ position: "absolute", left: 70, right: 70, top: 880 }}>
          {rows.map((r) => {
            const p = useP(r.at);
            const kohli = r.n === "Kohli";
            return (
              <div key={r.n} style={{ display: "flex", alignItems: "baseline", gap: 18, height: kohli ? 110 : 72, borderBottom: `1px solid ${C.line}`, opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP), transform: `translateX(${interpolate(p, [0, 1], [40, 0])}px)` }}>
                <div style={{ width: kohli ? 200 : 110 }}>
                  <Disp size={kohli ? 96 : 56} color={kohli ? C.accent : C.red}>
                    {r.r}
                  </Disp>
                </div>
                <Label size={kohli ? 28 : 22} color={C.ink} weight={900}>
                  {r.n}
                </Label>
                <Label size={16} color={C.mute}>
                  {r.how}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
};

/* ================= S7 — THE ENDING ================= */
const s7Beats = (fps: number) => ({ n73: wordAt(fps, "s7", "73", 1.46), n48: wordAt(fps, "s7", "48", 3.84), n12: wordAt(fps, "s7", "12", 5.64), n256: wordAt(fps, "s7", "256", 8.02), month: wordAt(fps, "s7", "month", 14.08), lost: sentence(fps, "s7", 2).from, found: wordAt(fps, "s7", "found", 18.92), brand: sentence(fps, "s7", 3).from - 6 });
const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  return (
    <Shell exit={false} drift={0.015}>
      {/* the result */}
      <div style={{ opacity: win(frame, 2, b.n256 - 6) }}>
        <Cutout src="lyon-stump-cut.png" x={620} y={360} h={900} at={b.n12 - 8} from="right" />
        <div style={{ position: "absolute", left: 70, top: 440 }}>
          <Label size={22} color={C.mute}>
            India lose 8 for 73
          </Label>
          <div style={{ marginTop: 20, opacity: fade(frame, b.n48 - 6) }}>
            <Label size={24} color={C.mute}>
              Australia win by
            </Label>
            <div>
              <Disp size={280}>48</Disp>
            </div>
            <Label size={30} color={C.ink} weight={900}>
              runs
            </Label>
          </div>
          <div style={{ marginTop: 40, opacity: fade(frame, b.n12 - 6) }}>
            <Tag text="Lyon: 12 in the match" color={C.ink} size={26} />
          </div>
        </div>
      </div>
      {/* the hero */}
      <div style={{ opacity: win(frame, b.n256 - 6, b.lost) }}>
        <Cutout src="kohli-chest-cut.png" x={590} y={400} h={880} at={b.n256 - 6} from="right" />
        <div style={{ position: "absolute", left: 70, top: 460 }}>
          <Label size={22} color={C.mute}>
            Kohli, first Test as captain
          </Label>
          <div style={{ height: 270 }}>
            <Slam text="256" at={b.n256 - 2} size={260} color={C.accent} />
          </div>
          <Label size={26} color={C.ink2} weight={900}>
            115 + 141 · most by an Indian
          </Label>
          <div style={{ marginTop: 40, opacity: fade(frame, b.month - 6) }}>
            <Tag text="Full-time captain within a month" color={C.accent} size={24} />
          </div>
        </div>
      </div>
      {/* the line */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 560, textAlign: "center", opacity: win(frame, b.lost - 2, b.brand + 2) }}>
        <Serif size={66} weight={900}>
          India lost a Test that day.
        </Serif>
        <div style={{ marginTop: 30, opacity: fade(frame, b.found - 8) }}>
          <Serif size={92} weight={900} color={C.accent}>
            They found a captain.
          </Serif>
        </div>
      </div>
      <Brand at={b.brand + 2} top={980} series={config.series} tagline={config.tagline} />
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
  ] as [string, React.FC][],
  warmFrom: (fps: number) => scene(fps, "s7").from,
  mastheadOffAt: (fps: number) => scene(fps, "s7").from + s7Beats(fps).brand,
  captionsOffFrom: (fps: number) => scene(fps, "s7").from + sentence(fps, "s7", 3).from - 2,
  sfx: (fps: number): Cue[] => {
    const S = (id: string) => scene(fps, id).from;
    const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps);
    const c: Cue[] = [];
    const add = (id: string, at: number, file: string, volume: number) => c.push({ at: S(id) + at, file, volume });
    ["s2", "s3", "s4", "s5", "s6", "s7"].forEach((id) => c.push({ at: S(id) - 9, file: "swoosh.wav", volume: 0.24 }));
    // s1
    add("s1", 2, "rise.wav", 0.2);
    add("s1", b1.n122 - 4, "slam.wav", 0.4);
    add("s1", b1.captain, "whip.wav", 0.3);
    add("s1", b1.first - 6, "pop.wav", 0.3);
    add("s1", b1.rewind - 2, "ticks.wav", 0.45);
    add("s1", b1.rewind, "whip.wav", 0.35);
    // s2
    add("s2", b2.n517 - 4, "slam.wav", 0.4);
    add("s2", b2.kohli - 8, "rise.wav", 0.2);
    add("s2", b2.helmet - 4, "impact.wav", 0.7);
    add("s2", b2.n115 - 2, "slam.wav", 0.5);
    add("s2", b2.n115, "crowd.wav", 0.22);
    add("s2", b2.n364 - 6, "impact.wav", 0.45);
    add("s2", b2.win - 6, "slam.wav", 0.45);
    // s3
    add("s3", 2, "slam.wav", 0.35);
    add("s3", b3.dhawan - 4, "crack.wav", 0.35);
    add("s3", b3.pujara - 4, "crack.wav", 0.35);
    add("s3", b3.walks - 4, "rise.wav", 0.25);
    // s4
    add("s4", 4, "whip.wav", 0.3);
    add("s4", b4.n74 - 2, "slam.wav", 0.45);
    add("s4", b4.tea - 4, "pop.wav", 0.3);
    // s5
    add("s5", b5.n100 - 4, "slam.wav", 0.5);
    add("s5", b5.n100, "crowd.wav", 0.3);
    add("s5", b5.n242 - 4, "rise.wav", 0.3);
    add("s5", b5.on - 4, "impact.wav", 0.45);
    // s6 — every wicket cracks; Kohli's lands hardest
    add("s6", 2, "whip.wav", 0.3);
    [b6.n99 - 4, b6.pad - 8, b6.rohit - 4, b6.bowled - 4].forEach((x) => add("s6", x, "crack.wav", 0.42));
    add("s6", b6.n41 - 4, "pop.wav", 0.3);
    add("s6", b6.pulls + 10, "impact.wav", 0.65);
    add("s6", b6.pulls + 10, "crack.wav", 0.4);
    // s7
    add("s7", b7.n48 - 6, "slam.wav", 0.4);
    add("s7", b7.n256 - 2, "slam.wav", 0.5);
    add("s7", b7.found - 8, "impact.wav", 0.5);
    c.push({ at: totalFrames(fps) - Math.round(fps * 1.2), file: "pen.wav", volume: 0.25 });
    return c;
  },
};
