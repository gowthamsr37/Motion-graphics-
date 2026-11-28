// RCB, IPL 2026: back-to-back champions, and the most complete team in the league.
// 30 phase KPIs (run rate, dot %, boundary %, sixes and wickets per innings × PP / middle / death × bat / bowl),
// ranked across all ten teams. Data: Cricsheet IPL ball-by-ball, all 74 matches of 2026 (analysis/phase.py).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Cue } from "../components/Sound";
import { CLAMP, Cutout, Disp, fade, Label, Serif, Shell, useP } from "../components/Ed";
import { config } from "../config";
import { theme } from "../theme";
import { scene, sentence, totalFrames, wordAt } from "../timing";
import ranks from "../data/ranks.json";

const C = theme.colors;
const GOLD = "#C9A227";
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: theme.ease.out, ...CLAMP });

/* ---------- kit ---------- */
const In: React.FC<{ at: number; out?: number; x?: number; y: number; w?: number; center?: boolean; children: React.ReactNode }> = ({ at, out, x = 70, y, w, center, children }) => {
  const frame = useCurrentFrame();
  const p = useP(at, theme.spring.heavy);
  if (frame < at - 1) return null;
  const o = interpolate(p, [0, 0.3], [0, 1], CLAMP) * (out === undefined ? 1 : 1 - fade(frame, out, 8));
  return (
    <div style={{ position: "absolute", left: center ? 0 : x, right: center ? 0 : undefined, width: center ? undefined : w, top: y, textAlign: center ? "center" : "left", opacity: o, transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)` }}>
      {children}
    </div>
  );
};

// Full-bleed photo with a slow push-in. dark=true for the cinematic scenes, otherwise washed into the paper.
const Photo: React.FC<{ src: string; pos?: string; dark?: boolean; o?: number; from?: number }> = ({ src, pos = "50% 30%", dark, o = 0.16, from = 1.06 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const z = interpolate(frame, [0, durationInFrames], [from, from + 0.12]);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(`photos/${src}`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${z})`, ...(dark ? {} : { filter: "grayscale(1) contrast(1.15)", opacity: o, mixBlendMode: "multiply" as const }) }} />
      {dark ? (
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,14,30,0.55) 0%, rgba(10,14,30,0.05) 30%, rgba(10,14,30,0.35) 55%, rgba(10,14,30,0.92) 80%, rgba(10,14,30,0.98) 100%)" }} />
      ) : (
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(242,237,227,0.8) 0%, rgba(242,237,227,0.25) 45%, rgba(242,237,227,0.9) 100%)" }} />
      )}
    </AbsoluteFill>
  );
};

const Burst: React.FC<{ at: number; x: number; y: number; r?: number }> = ({ at, x, y, r = 260 }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / 22;
  if (t < 0 || t > 1) return null;
  const e = theme.ease.out(t);
  return (
    <svg width={2 * r} height={2 * r} style={{ position: "absolute", left: x - r, top: y - r, overflow: "visible", pointerEvents: "none", zIndex: 25 }}>
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const r0 = r * 0.25 + r * 0.55 * e, r1 = r * 0.35 + r * 0.75 * e;
        return <line key={i} x1={r + Math.cos(a) * r0} y1={r + Math.sin(a) * r0} x2={r + Math.cos(a) * r1} y2={r + Math.sin(a) * r1} stroke={i % 2 ? C.accent : GOLD} strokeWidth={i % 2 ? 8 : 4} strokeLinecap="round" opacity={1 - t} />;
      })}
      <circle cx={r} cy={r} r={r * 0.9 * e} fill="none" stroke={GOLD} strokeWidth={6 * (1 - t)} opacity={1 - t} />
    </svg>
  );
};

const Flash: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 2, at + 10], [0, 0.8, 0], CLAMP);
  return o > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: o, zIndex: 50, pointerEvents: "none" }} /> : null;
};

// A rank pill: "#2 of 10"
const Rank: React.FC<{ n: number; at: number; label: string; bad?: boolean }> = ({ n, at, label, bad }) => {
  const frame = useCurrentFrame();
  const p = useP(at, { damping: 12, stiffness: 240, mass: 0.7 });
  if (frame < at - 1) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, transform: `scale(${interpolate(p, [0, 1], [1.3, 1])})`, transformOrigin: "0% 50%", opacity: interpolate(p, [0, 0.2], [0, 1], CLAMP) }}>
      <div style={{ width: 120, height: 120, borderRadius: 60, background: bad ? C.mute : C.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 24px rgba(40,30,10,0.22)" }}>
        <Disp size={70} color={C.paperHi}>
          #{n}
        </Disp>
      </div>
      <Label size={24} color={C.ink} weight={900}>
        {label}
      </Label>
    </div>
  );
};

// Horizontal comparison bars: RCB vs others, value labels at bar ends.
const Bars: React.FC<{ x: number; y: number; w: number; at: number; max: number; rows: { l: string; v: number; fmt: string; hero?: boolean }[]; rowH?: number }> = ({ x, y, w, at, max, rows, rowH = 92 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {rows.map((r, i) => {
        const p = ease(frame, at + i * 6, at + i * 6 + 20);
        const bw = (r.v / max) * w * p;
        return (
          <div key={r.l} style={{ position: "absolute", top: i * rowH, left: 0, width: w + 200, opacity: fade(frame, at + i * 6 - 2, 6) }}>
            <Label size={17} color={r.hero ? C.accent : C.ink2} weight={900}>
              {r.l}
            </Label>
            <div style={{ position: "absolute", top: 28, left: 0, width: bw, height: 40, background: r.hero ? C.accent : C.ink2, opacity: r.hero ? 1 : 0.45 }} />
            <div style={{ position: "absolute", top: 18, left: bw + 14, opacity: fade(frame, at + i * 6 + 14, 6), whiteSpace: "nowrap" }}>
              <Disp size={58} color={r.hero ? C.accent : C.ink2}>
                {r.fmt}
              </Disp>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ================= S1: the hook. Back to back ================= */
const s1Beats = (fps: number) => ({
  champs: sentence(fps, "s1", 1).from,
  numbers: wordAt(fps, "s1", "numbers", 3.9),
  acc: wordAt(fps, "s1", "accident", 5.26),
});
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const hit = spring({ frame: frame - 1, fps, config: { damping: 11, stiffness: 240, mass: 0.8 } });
  const shake = frame < 12 ? Math.sin(frame * 2.7) * (12 - frame) * 1.5 : 0;
  return (
    <Shell enter={false}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${shake}px, ${shake * 0.5}px)` }}>
        <Photo src="team-trophy.jpg" pos="50% 40%" dark from={1.12} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1010, textAlign: "center", transform: `scale(${interpolate(hit, [0, 1], [1.8, 1])})`, opacity: interpolate(hit, [0, 0.15], [0, 1], CLAMP) }}>
        <Disp size={190} color={C.paperHi} style={{ textShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
          Back to
        </Disp>
        <br />
        <Disp size={190} color={GOLD} style={{ textShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
          back
        </Disp>
      </div>
      <In at={b.champs} center y={1400}>
        <span style={{ display: "inline-block", background: C.accent, padding: "8px 26px 2px" }}>
          <Disp size={64} color={C.paperHi}>
            IPL champions · 2025 · 2026
          </Disp>
        </span>
      </In>
      <In at={b.numbers} center y={1500}>
        <Serif size={50} color={C.paperHi} weight={900}>
          …and it was <span style={{ color: GOLD }}>no accident.</span>
        </Serif>
      </In>
      <Burst at={1} x={540} y={1180} r={520} />
      <Flash at={0} />
    </Shell>
  );
};

/* ================= S2: 30 KPIs × 10 teams heatmap → RCB on top ================= */
const s2Beats = (fps: number) => ({
  thirty: wordAt(fps, "s2", "30", 1.62),
  run: wordAt(fps, "s2", "Run", 3.14),
  power: wordAt(fps, "s2", "power", 7.38),
  bat: wordAt(fps, "s2", "bat", 10.54),
  most: sentence(fps, "s2", 1).from,
  rcb: wordAt(fps, "s2", "RCB", 15.98),
  half: wordAt(fps, "s2", "half", 17.3),
});
const CODE: Record<string, string> = {
  "Royal Challengers Bengaluru": "RCB", "Rajasthan Royals": "RR", "Sunrisers Hyderabad": "SRH", "Punjab Kings": "PBKS", "Gujarat Titans": "GT",
  "Kolkata Knight Riders": "KKR", "Chennai Super Kings": "CSK", "Delhi Capitals": "DC", "Lucknow Super Giants": "LSG", "Mumbai Indians": "MI",
};
const AVG = ranks.avg as Record<string, number>;
const RK = ranks.ranks as Record<string, number[]>;
const BYAVG = Object.keys(AVG).sort((a, b) => AVG[a] - AVG[b]);
const ALPHA = Object.keys(AVG).sort((a, b) => CODE[a].localeCompare(CODE[b]));
const heat = (r: number) => {
  // rank 1 → RCB red, rank 10 → pale paper
  const t = (r - 1) / 9;
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `rgb(${mix(209, 236)}, ${mix(31, 228)}, ${mix(46, 214)})`;
};
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const sortP = interpolate(frame, [b.most - 4, b.most + 26], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const X0 = 190, CW = 20, GAP = 2, GRP = 10, RH = 62, Y0 = 470;
  const colX = (i: number) => X0 + i * (CW + GAP) + Math.floor(i / 5) * GRP;
  const groups = ["Bat · PP", "Bat · Mid", "Bat · Death", "Bowl · PP", "Bowl · Mid", "Bowl · Death"];
  return (
    <Shell>
      <In at={2} y={236}>
        <Disp size={96}>
          10 teams. <span style={{ color: C.accent }}>30 numbers.</span>
        </Disp>
      </In>
      <In at={b.run} y={340}>
        <Label size={18} color={C.ink2} weight={800} spacing="0.1em">
          Run rate · dot % · boundary % · sixes · wickets — every phase, bat and ball
        </Label>
      </In>
      {groups.map((g, k) => (
        <div key={g} style={{ position: "absolute", left: colX(k * 5), top: 420, width: 5 * (CW + GAP), textAlign: "center", opacity: fade(frame, (k < 3 ? b.power : b.bat) + (k % 3) * 4, 8) }}>
          <Label size={13} color={k === 4 ? C.accent : C.ink2} weight={900} spacing="0.04em">
            {g}
          </Label>
        </div>
      ))}
      {ALPHA.map((t) => {
        const iA = ALPHA.indexOf(t), iS = BYAVG.indexOf(t);
        const y = Y0 + interpolate(sortP, [0, 1], [iA, iS]) * RH;
        const isR = t === "Royal Challengers Bengaluru";
        const hl = isR ? fade(frame, b.rcb - 4, 10) : 0;
        return (
          <div key={t} style={{ position: "absolute", left: 0, top: y, width: 1080, height: RH - 8 }}>
            {hl > 0 && <div style={{ position: "absolute", left: 56, right: 40, top: -6, bottom: -6, border: `4px solid ${C.accent}`, opacity: hl, borderRadius: 6 }} />}
            <div style={{ position: "absolute", left: 70, top: 10, width: 110, opacity: fade(frame, 4 + iA * 2, 6) }}>
              <Disp size={40} color={isR ? C.accent : C.ink}>
                {CODE[t]}
              </Disp>
            </div>
            {RK[t].map((r, i) => {
              const at = b.thirty + i * 1.2 + iA * 0.8;
              return <div key={i} style={{ position: "absolute", left: colX(i), top: 4, width: CW, height: RH - 16, background: heat(r), opacity: fade(frame, at, 5), borderRadius: 3 }} />;
            })}
            <div style={{ position: "absolute", left: colX(29) + CW + 20, top: 6, opacity: fade(frame, b.most + 10 + iS * 2, 6), whiteSpace: "nowrap" }}>
              <Disp size={46} color={isR ? C.accent : C.ink2}>
                {AVG[t].toFixed(2)}
              </Disp>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: colX(29) + CW + 12, top: 430, opacity: fade(frame, b.most + 6, 8) }}>
        <Label size={13} color={C.ink2} weight={900}>
          Avg rank
        </Label>
      </div>
      <div style={{ position: "absolute", left: 190, top: 1112, display: "flex", alignItems: "center", gap: 10, opacity: fade(frame, b.thirty + 30, 10) }}>
        <Label size={14} color={C.ink2}>Rank 1</Label>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ width: 26, height: 16, background: heat(i + 1), borderRadius: 2 }} />
        ))}
        <Label size={14} color={C.ink2}>Rank 10</Label>
      </div>
      <In at={b.half - 2} y={1162}>
        <Serif size={50} weight={900}>
          Next best: <span style={{ color: C.ink2 }}>5.07.</span> <span style={{ color: C.accent }}>Nobody was close.</span>
        </Serif>
      </In>
    </Shell>
  );
};

/* ================= S3: powerplay batting. Few sixes, fewest dots ================= */
const s3Beats = (fps: number) => ({
  two: wordAt(fps, "s3", "two", 1.98),
  but: sentence(fps, "s3", 1).from,
  dot: wordAt(fps, "s3", "dot", 6.84),
  one: wordAt(fps, "s3", "One", 8.6),
  avg: wordAt(fps, "s3", "average", 10.18),
  four: wordAt(fps, "s3", "four", 11.88),
  board: sentence(fps, "s3", 2).from,
});
// 10×10 balls: `dots` of them dark (no run), the rest red (scoring)
const DotGrid: React.FC<{ x: number; y: number; dots: number; at: number; label: string; hero?: boolean }> = ({ x, y, dots, at, label, hero }) => {
  const frame = useCurrentFrame();
  const S = 34;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: fade(frame, at - 2, 6) }}>
      <Label size={18} color={hero ? C.accent : C.ink2} weight={900}>
        {label}
      </Label>
      <div style={{ position: "relative", marginTop: 14, width: 10 * S, height: 10 * S }}>
        {Array.from({ length: 100 }).map((_, i) => {
          const isDot = i < dots;
          const on = fade(frame, at + i * 0.35, 4);
          return <div key={i} style={{ position: "absolute", left: (i % 10) * S, top: Math.floor(i / 10) * S, width: S - 6, height: S - 6, borderRadius: "50%", background: isDot ? C.ink : hero ? C.accent : C.mute, opacity: on * (isDot ? 0.9 : hero ? 1 : 0.55) }} />;
        })}
      </div>
      <div style={{ marginTop: 10, opacity: fade(frame, at + 36, 6) }}>
        <Disp size={84} color={hero ? C.accent : C.ink2}>
          {dots}% dots
        </Disp>
      </div>
    </div>
  );
};
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  return (
    <Shell>
      <Photo src="kohli-bat.jpg" pos="50% 25%" />
      <In at={2} y={236}>
        <Label size={22} color={C.accent} weight={900} spacing="0.24em">
          Batting · Powerplay · overs 1–6
        </Label>
      </In>
      <In at={b.two - 2} y={290} out={b.but - 4}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <Disp size={240} color={C.mute}>
            8th
          </Disp>
          <div>
            <Disp size={70}>for sixes</Disp>
            <br />
            <Label size={20} color={C.ink2}>
              2.5 a powerplay · RR hit 4.7
            </Label>
          </div>
        </div>
      </In>
      <div style={{ opacity: 1 - fade(frame, b.but - 4, 8) }}>
        <Cutout src="kohli-bat-cut.png" x={600} y={560} h={760} at={4} from="right" fadeBottom={0.9} />
      </div>
      <In at={b.but} y={300}>
        <Disp size={120} color={C.accent}>
          Fewest dots
        </Disp>
        <br />
        <Disp size={70}>in the league</Disp>
      </In>
      <DotGrid x={70} y={560} dots={33} at={b.one - 6} label="RCB" hero />
      <DotGrid x={600} y={560} dots={42} at={b.avg + 2} label="League average" />
      <In at={b.board - 2} y={1210}>
        <Serif size={46} weight={900}>
          The scoreboard <span style={{ color: C.accent }}>never stopped.</span>
        </Serif>
      </In>
    </Shell>
  );
};

/* ================= S4: middle + death batting, wickets in hand, Kohli ================= */
const s4Beats = (fps: number) => ({
  mid: wordAt(fps, "s4", "second", 1.7, 0),
  dth: wordAt(fps, "s4", "second", 4.28, 1),
  secret: sentence(fps, "s4", 1).from,
  n13: wordAt(fps, "s4", "1", 8.9),
  league: wordAt(fps, "s4", "league", 11.64),
  kohli: sentence(fps, "s4", 2).from,
  n675: wordAt(fps, "s4", "675", 17.74),
  n166: wordAt(fps, "s4", "166", 20.96),
  n37: wordAt(fps, "s4", "37", 22.82),
});
const KSR: [number, number][] = [[2016, 152.0], [2017, 122.2], [2018, 139.1], [2019, 141.5], [2020, 122.0], [2021, 119.5], [2022, 116.0], [2023, 139.8], [2024, 154.7], [2025, 144.7], [2026, 165.8]];
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const kOut = b.kohli - 4;
  // Kohli SR line
  const W = 440, H = 280, X = 70, Y = 840;
  const px = (i: number) => X + (i / (KSR.length - 1)) * W;
  const py = (v: number) => Y + H - ((v - 110) / 60) * H;
  const lp = ease(frame, b.n166 - 30, b.n166 + 10);
  const path = KSR.map(([, v], i) => `${i ? "L" : "M"} ${px(i)} ${py(v)}`).join(" ");
  return (
    <Shell>
      <Photo src="kohli-gesture.jpg" pos="50% 20%" />
      <In at={2} y={236} out={kOut}>
        <Label size={22} color={C.accent} weight={900} spacing="0.24em">
          Batting · middle overs & death
        </Label>
      </In>
      <div style={{ position: "absolute", left: 70, top: 310, opacity: 1 - fade(frame, kOut, 8) }}>
        <Rank n={2} at={b.mid} label="Run rate · middle overs" />
        <div style={{ height: 30 }} />
        <Rank n={2} at={b.dth} label="Run rate · death overs" />
      </div>
      <In at={b.secret} y={640} out={kOut}>
        <Label size={22} color={C.ink} weight={900}>
          Wickets lost per innings · death overs
        </Label>
      </In>
      {frame < kOut + 10 && (
        <div style={{ opacity: 1 - fade(frame, kOut, 8) }}>
          <Bars x={70} y={700} w={560} at={b.n13 - 4} max={2.6} rows={[
            { l: "RCB", v: 1.31, fmt: "1.31", hero: true },
            { l: "League average", v: 1.93, fmt: "1.93" },
            { l: "Most · SRH", v: 2.53, fmt: "2.53" },
          ]} />
          <In at={b.league + 30} y={1000}>
            <Serif size={44} weight={900}>
              Still there <span style={{ color: C.accent }}>when it mattered.</span>
            </Serif>
          </In>
        </div>
      )}
      {/* Kohli */}
      <Cutout src="kohli-gesture-cut.png" x={540} y={640} h={600} at={b.kohli} from="right" fadeBottom={0.92} />
      <In at={b.kohli + 2} y={240}>
        <Disp size={110}>Virat Kohli</Disp>
      </In>
      <In at={b.n675 - 2} y={370}>
        <div style={{ display: "flex", gap: 40, alignItems: "flex-end" }}>
          <div>
            <Disp size={150} color={C.accent}>
              675
            </Disp>
            <br />
            <Label size={18}>Runs</Label>
          </div>
          <div style={{ opacity: fade(frame, b.n166 - 4, 6) }}>
            <Disp size={150} color={C.accent}>
              166
            </Disp>
            <br />
            <Label size={18}>Strike rate</Label>
          </div>
        </div>
      </In>
      {frame >= b.n166 - 30 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <text x={X} y={Y - 30} fontFamily={theme.fonts.body} fontWeight={900} fontSize={17} letterSpacing="2" fill={C.ink2}>
            KOHLI'S IPL STRIKE RATE, 2016–2026
          </text>
          <path d={path} fill="none" stroke={C.ink2} strokeWidth={4} strokeDasharray="2000" strokeDashoffset={2000 * (1 - lp)} />
          {KSR.map(([y, v], i) => (
            <g key={y} opacity={fade(frame, b.n166 - 30 + i * 3, 4)}>
              <circle cx={px(i)} cy={py(v)} r={i === KSR.length - 1 ? 14 : 6} fill={i === KSR.length - 1 ? C.accent : C.ink2} />
              {(i === 0 || i === KSR.length - 1 || y === 2024) && (
                <text x={px(i)} y={py(v) + 44} textAnchor="middle" fontFamily={theme.fonts.display} fontSize={30} fill={i === KSR.length - 1 ? C.accent : C.ink2}>
                  {`${y}`}
                </text>
              )}
            </g>
          ))}
        </svg>
      )}
      <In at={b.n37 + 4} y={1180}>
        <Serif size={46} weight={900}>
          At 37, his <span style={{ color: C.accent }}>fastest season ever.</span>
        </Serif>
      </In>
      <Burst at={b.n166} x={px(10)} y={py(165.8)} r={180} />
    </Shell>
  );
};

/* ================= S5: powerplay bowling, Bhuvi ================= */
const s5Beats = (fps: number) => ({
  n225: wordAt(fps, "s5", "2", 2.58),
  most: wordAt(fps, "s5", "most", 5.78),
  bhuvi: sentence(fps, "s5", 1).from,
  n28: wordAt(fps, "s5", "28", 9.36),
  eight: wordAt(fps, "s5", "eight", 10.74),
});
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  return (
    <Shell>
      <Photo src="bhuvi-cap.jpg" pos="50% 25%" />
      <In at={2} y={236}>
        <Label size={22} color={C.accent} weight={900} spacing="0.24em">
          Bowling · Powerplay
        </Label>
      </In>
      <In at={b.n225 - 2} y={280}>
        <Disp size={250} color={C.accent}>
          2.25
        </Disp>
        <div>
          <Label size={22}>Wickets per powerplay · #1</Label>
        </div>
      </In>
      <Burst at={b.n225} x={260} y={400} r={260} />
      <Bars x={70} y={640} w={480} at={b.most - 6} max={2.4} rows={[
        { l: "RCB", v: 2.25, fmt: "2.25", hero: true },
        { l: "Next · GT", v: 2.06, fmt: "2.06" },
        { l: "League average", v: 1.58, fmt: "1.58" },
        { l: "Fewest · DC", v: 1.0, fmt: "1.00" },
      ]} />
      <Cutout src="bhuvi-run-cut.png" x={620} y={560} h={760} at={b.bhuvi - 4} from="right" fadeBottom={0.95} />
      <In at={b.bhuvi} y={1040}>
        <Disp size={64}>Bhuvneshwar Kumar</Disp>
      </In>
      <In at={b.n28 - 2} y={1120}>
        <div style={{ display: "flex", gap: 34, alignItems: "baseline" }}>
          <Disp size={110} color={C.accent}>
            28
          </Disp>
          <Label size={20}>wickets</Label>
          <span style={{ opacity: fade(frame, b.eight - 4, 6) }}>
            <Disp size={110} color={C.accent}>
              7.95
            </Disp>
          </span>
          <span style={{ opacity: fade(frame, b.eight - 4, 6) }}>
            <Label size={20}>economy</Label>
          </span>
        </div>
      </In>
    </Shell>
  );
};

/* ================= S6: death bowling + the one weak spot ================= */
const s6Beats = (fps: number) => ({
  door: wordAt(fps, "s6", "door", 1.38),
  five: wordAt(fps, "s6", "five", 3.42),
  harder: wordAt(fps, "s6", "harder", 6.2),
  weak: sentence(fps, "s6", 1).from,
  seventh: wordAt(fps, "s6", "seventh", 10.4),
  but: sentence(fps, "s6", 2).from,
});
const PHASES = [
  { l: "Bat · PP", r: 4.2 }, { l: "Bat · Mid", r: 3.2 }, { l: "Bat · Death", r: 2.2 },
  { l: "Bowl · PP", r: 2.2 }, { l: "Bowl · Mid", r: 5.8 }, { l: "Bowl · Death", r: 3.6 },
];
const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const out = b.weak - 4;
  return (
    <Shell>
      <Photo src="hazlewood.jpg" pos="50% 30%" />
      <In at={2} y={236} out={out}>
        <Label size={22} color={C.accent} weight={900} spacing="0.24em">
          Bowling · death overs
        </Label>
      </In>
      <In at={b.door - 4} y={280} out={out}>
        <Disp size={120}>Door</Disp>
        <Disp size={120} color={C.accent}>
          {" "}slammed
        </Disp>
      </In>
      {frame < out + 10 && (
        <div style={{ opacity: 1 - fade(frame, out, 8) }}>
          <div style={{ position: "absolute", left: 70, top: 460, display: "flex", gap: 22 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ width: 120, height: 120, borderRadius: 60, background: i === 4 ? C.accent : C.ink, opacity: fade(frame, b.five - 10 + i * 4, 5), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Disp size={48} color={C.paperHi}>
                  {i === 4 ? "4/6" : "·"}
                </Disp>
              </div>
            ))}
          </div>
          <In at={b.five + 6} y={610}>
            <Label size={20} color={C.ink}>
              1 ball in 5 went for a boundary · #1 in the league
            </Label>
          </In>
          <Bars x={70} y={690} w={420} at={b.harder - 8} max={30} rows={[
            { l: "RCB", v: 20.98, fmt: "21.0%", hero: true },
            { l: "League average", v: 24.1, fmt: "24.1%" },
            { l: "Most · PBKS", v: 28.04, fmt: "28.0%" },
          ]} />
          <Cutout src="hazlewood-cut.png" x={560} y={760} h={520} at={6} from="right" fadeBottom={0.95} />
        </div>
      )}
      {/* the six phases, one weak spot */}
      <In at={b.weak} y={250}>
        <Disp size={100}>
          One <span style={{ color: C.mute }}>weak</span> spot
        </Disp>
        <div style={{ marginTop: 6 }}>
          <Label size={18} color={C.ink2}>
            RCB's average rank in each phase (5 KPIs each)
          </Label>
        </div>
      </In>
      {PHASES.map((p, i) => {
        const at = b.weak + 6 + i * 4;
        const bad = p.l === "Bowl · Mid";
        const p2 = ease(frame, at, at + 16);
        const w = ((10 - p.r) / 9) * 640 * p2;
        return frame >= at - 1 ? (
          <div key={p.l} style={{ position: "absolute", left: 70, top: 440 + i * 116, width: 940, opacity: fade(frame, at - 1, 5) }}>
            <Label size={20} color={bad ? C.ink2 : C.ink} weight={900}>
              {p.l}
            </Label>
            <div style={{ position: "absolute", left: 0, top: 32, height: 54, width: w, background: bad ? C.mute : C.accent }} />
            <div style={{ position: "absolute", left: w + 16, top: 26, whiteSpace: "nowrap" }}>
              <Disp size={60} color={bad ? C.ink2 : C.accent}>
                {p.r.toFixed(1)}
              </Disp>
            </div>
            {bad && (
              <div style={{ position: "absolute", left: w + 140, top: 36, opacity: fade(frame, b.seventh - 2, 6) }}>
                <span style={{ display: "inline-block", border: `3px solid ${C.ink2}`, padding: "4px 12px 2px" }}>
                  <Label size={16} color={C.ink2} weight={900}>
                    7th for wickets
                  </Label>
                </span>
              </div>
            )}
          </div>
        ) : null;
      })}
      <In at={b.but + 4} y={1150}>
        <Serif size={44} weight={900}>
          Strike early. Finish strong. <span style={{ color: C.accent }}>The middle stops mattering.</span>
        </Serif>
      </In>
    </Shell>
  );
};

/* ================= S7: chasing + the playoffs ================= */
const s7Beats = (fps: number) => ({
  seven: wordAt(fps, "s7", "Seven", 0),
  q1: sentence(fps, "s7", 1).from,
  n92: wordAt(fps, "s7", "92", 3.82),
  final: wordAt(fps, "s7", "final", 7.96),
});
const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  return (
    <Shell>
      <Photo src="celebrate.jpg" pos="50% 30%" dark from={1.04} />
      <In at={b.seven} y={260}>
        <Label size={22} color={GOLD} weight={900} spacing="0.24em">
          Chasing
        </Label>
      </In>
      <div style={{ position: "absolute", left: 70, top: 310, display: "flex", gap: 14 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ width: 92, height: 92, borderRadius: 46, background: i < 7 ? C.accent : "rgba(255,255,255,0.18)", border: "3px solid rgba(255,255,255,0.7)", opacity: fade(frame, b.seven + i * 3, 4), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Disp size={40} color={C.paperHi}>
              {i < 7 ? "W" : "L"}
            </Disp>
          </div>
        ))}
      </div>
      <In at={b.seven + 30} y={430}>
        <Disp size={84} color={C.paperHi}>
          7 of 9 chases won
        </Disp>
      </In>
      <In at={b.q1} y={600}>
        <Label size={20} color={GOLD} weight={900}>
          Qualifier 1 · v Gujarat Titans
        </Label>
        <div>
          <Disp size={130} color={C.paperHi}>
            Won by <span style={{ color: GOLD }}>92 runs</span>
          </Disp>
        </div>
      </In>
      <In at={b.final - 6} y={820}>
        <Label size={20} color={GOLD} weight={900}>
          Final · 31 May · v Gujarat Titans
        </Label>
        <div>
          <Disp size={100} color={C.paperHi}>
            Won by 5 wickets
          </Disp>
        </div>
      </In>
      <Burst at={b.n92} x={540} y={700} r={360} />
    </Shell>
  );
};

/* ================= S8: the close ================= */
const s8Beats = (fps: number) => ({
  just: sentence(fps, "s8", 1).from,
  twice: wordAt(fps, "s8", "twice", 6.78),
  brand: wordAt(fps, "s8", "Beyond", 8.18),
});
const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  return (
    <Shell exit={false}>
      <Photo src="trophy.jpg" pos="50% 40%" dark from={1.05} />
      <In at={4} center y={1000}>
        <Serif size={58} color="rgba(255,255,255,0.75)" weight={700}>
          Not the biggest hitters.
          <br />
          Not the deadliest bowlers.
        </Serif>
      </In>
      <In at={b.just} center y={1170}>
        <Disp size={96} color={C.paperHi}>
          No weak phase.
        </Disp>
      </In>
      <In at={b.twice - 8} center y={1270}>
        <Serif size={60} color={GOLD} weight={900}>
          That's how you win it twice.
        </Serif>
      </In>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1400, textAlign: "center", opacity: fade(frame, b.brand, 10) }}>
        <Label size={20} color={GOLD} spacing="0.3em">
          {config.tagline}
        </Label>
        <div style={{ marginTop: 6 }}>
          <Disp size={84} color={C.paperHi}>
            {config.series}
          </Disp>
        </div>
        <div style={{ marginTop: 18 }}>
          <Label size={14} color="rgba(255,255,255,0.55)" weight={600} spacing="0.08em">
            Data: Cricsheet ball-by-ball, all 74 IPL 2026 matches · Photos: RCB / IPL
          </Label>
        </div>
      </div>
      <Burst at={b.twice} x={540} y={1300} r={420} />
    </Shell>
  );
};

/* ================= the contract ================= */
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
  warmFrom: (fps: number) => totalFrames(fps) + 1000,
  mastheadOffAt: (fps: number) => scene(fps, "s7").from,
  captionsOffFrom: (fps: number) => scene(fps, "s8").from,
  sfx: (fps: number): Cue[] => {
    const S = (id: string) => scene(fps, id).from;
    const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps), b8 = s8Beats(fps);
    const c: Cue[] = [];
    const add = (id: string, at: number, file: string, volume: number) => c.push({ at: S(id) + at, file, volume });
    ["s2", "s3", "s4", "s5", "s6", "s7", "s8"].forEach((id) => c.push({ at: S(id) - 9, file: "swoosh.wav", volume: 0.24 }));
    add("s1", 0, "slam.wav", 0.6);
    add("s1", 0, "impact.wav", 0.6);
    add("s1", 0, "crowd.wav", 0.3);
    add("s1", b1.champs - 2, "pop.wav", 0.3);
    add("s1", b1.numbers - 2, "whip.wav", 0.25);
    add("s2", b2.thirty, "ticks.wav", 0.3);
    add("s2", b2.most - 4, "rise.wav", 0.25);
    add("s2", b2.rcb - 4, "slam.wav", 0.45);
    add("s3", b3.two - 4, "pop.wav", 0.28);
    add("s3", b3.one - 6, "ticks.wav", 0.28);
    add("s3", b3.avg, "ticks.wav", 0.2);
    add("s3", b3.board - 2, "whip.wav", 0.25);
    add("s4", b4.mid - 2, "pop.wav", 0.3);
    add("s4", b4.dth - 2, "pop.wav", 0.3);
    add("s4", b4.n13 - 4, "ticks.wav", 0.22);
    add("s4", b4.kohli - 4, "whip.wav", 0.3);
    add("s4", b4.n675 - 2, "slam.wav", 0.45);
    add("s4", b4.n166 - 2, "impact.wav", 0.5);
    add("s4", b4.n166, "crowd.wav", 0.24);
    add("s5", b5.n225 - 2, "slam.wav", 0.5);
    add("s5", b5.n225 - 2, "impact.wav", 0.45);
    add("s5", b5.most - 6, "ticks.wav", 0.22);
    add("s5", b5.n28 - 2, "pop.wav", 0.3);
    add("s6", b6.door - 2, "slam.wav", 0.5);
    add("s6", b6.five - 10, "ticks.wav", 0.24);
    add("s6", b6.weak - 4, "whip.wav", 0.28);
    add("s6", b6.seventh - 2, "crack.wav", 0.3);
    add("s7", b7.seven, "ticks.wav", 0.3);
    add("s7", b7.n92 - 2, "slam.wav", 0.5);
    add("s7", b7.n92, "crowd.wav", 0.3);
    add("s7", b7.final - 4, "impact.wav", 0.45);
    add("s8", b8.just - 2, "impact.wav", 0.4);
    add("s8", b8.twice - 2, "slam.wav", 0.5);
    add("s8", b8.twice, "crowd.wav", 0.3);
    c.push({ at: totalFrames(fps) - Math.round(fps * 1.2), file: "pen.wav", volume: 0.25 });
    return c;
  },
};
