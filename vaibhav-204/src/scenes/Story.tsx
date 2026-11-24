// Vaibhav Sooryavanshi, 204 off 53 v UAE (India A, Asia Cup Rising Stars, Doha, 24 Nov 2026).
// Every entrance is keyed to the spoken word: wordAt(fps, scene, "prefix", fallbackSec[, nth]) / sentence(fps, scene, i).
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Cue } from "../components/Sound";
import { BigGlyph, CLAMP, Cutout, Disp, fade, Label, Seam, Serif, Shell, useP } from "../components/Ed";
import { Brand, CaseFile, Stamp } from "../components/Viz";
import { config } from "../config";
import { theme } from "../theme";
import { scene, sentence, totalFrames, wordAt } from "../timing";

const C = theme.colors;
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: theme.ease.out, ...CLAMP });

/* ---------- small kit for this reel ---------- */
// Appears with a lift at `at`, optionally leaves at `out`.
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

// Cut-out that hands over to the next one.
const Swap: React.FC<{ src: string; x: number; y: number; h: number; at: number; out?: number; from?: "bottom" | "right" | "left" }> = ({ src, x, y, h, at, out, from = "right" }) => {
  const frame = useCurrentFrame();
  if (out !== undefined && frame > out + 10) return null;
  return (
    <div style={{ opacity: out === undefined ? 1 : 1 - fade(frame, out - 2, 8) }}>
      <Cutout src={src} x={x} y={y} h={h} at={at} from={from} fadeBottom={0.9} />
    </div>
  );
};

// Balls-faced race: every bar grows at the same speed (one ball = `scale` px), so the shorter innings stops first.
const Race: React.FC<{ x: number; y: number; at: number; scale: number; dur: number; rows: { v: number; label: string; hero?: boolean; at?: number; killAt?: number }[]; rowH?: number }> = ({ x, y, at, scale, dur, rows, rowH = 78 }) => {
  const frame = useCurrentFrame();
  const max = Math.max(...rows.map((r) => r.v));
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {rows.map((r, i) => {
        const a = r.at ?? at;
        if (frame < a - 1) return null;
        const t = interpolate(frame, [a, a + dur], [0, max], { easing: theme.ease.soft, ...CLAMP });
        const w = Math.min(r.v, t) * scale;
        const done = fade(frame, a + (dur * r.v) / max - 2, 6);
        const kill = r.killAt === undefined ? 0 : ease(frame, r.killAt, r.killAt + 8);
        const col = r.hero ? C.accent : C.ink2;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: i * rowH, width: 700, opacity: fade(frame, a - 1, 6) }}>
            <Label size={16} color={r.hero ? C.accent : C.ink2} weight={900}>
              {r.label}
            </Label>
            <div style={{ position: "absolute", left: 0, top: 26, width: w, height: 34, background: col, opacity: r.hero ? 1 : 0.55 }} />
            <div style={{ position: "absolute", left: w + 12, top: 16, opacity: done, whiteSpace: "nowrap" }}>
              <Disp size={52} color={r.hero ? C.accent : C.ink2}>
                {r.v}
              </Disp>
              <div style={{ position: "absolute", left: -4, top: 25, height: 5, width: kill > 0 ? `calc(${kill * 100}% + 8px)` : 0, background: C.red, transform: "rotate(-8deg)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// A number that counts between keyframes [[frame, value], …] (holds between them).
const count = (f: number, keys: [number, number][]) => Math.round(interpolate(f, keys.map((k) => k[0]), keys.map((k) => k[1]), CLAMP));

/* ================= S1: the hook. 52 balls ================= */
const s1Beats = (fps: number) => ({
  balls: wordAt(fps, "s1", "balls", 0.36),
  shrink: sentence(fps, "s1", 1).from,
  fifteen: wordAt(fps, "s1", "15", 2.84),
  fastest: wordAt(fps, "s1", "fastest", 4.88),
  history: wordAt(fps, "s1", "history", 6.86),
  old: sentence(fps, "s1", 2).from,
  n103: wordAt(fps, "s1", "103", 9.86),
});
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const m = interpolate(frame, [b.shrink - 4, b.shrink + 14], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const draw = interpolate(frame, [1, 24], [0, 1], { easing: theme.ease.soft, ...CLAMP });
  const fill = interpolate(frame, [b.balls - 2, b.balls + 8], [0, 1], CLAMP);
  const bp = useP(b.balls);
  return (
    <Shell enter={false}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "70px 300px", transform: `translateY(${-50 * m}px) scale(${1 - 0.4 * m})` }}>
        <BigGlyph char="52" x={70} y={300} size={820} width={940} draw={draw} fill={fill * 0.94} />
        <div style={{ position: "absolute", left: 70, width: 940, top: 1030, textAlign: "center", opacity: interpolate(bp, [0, 0.3], [0, 1], CLAMP), transform: `translateY(${(1 - bp) * 30}px)` }}>
          <Disp size={170}>Balls</Disp>
        </div>
      </div>
      <Cutout src="vs-kiss-cut.png" x={600} y={420} h={910} at={b.fifteen - 4} from="right" fadeBottom={0.9} />
      <In at={b.fifteen} y={812}>
        <span style={{ display: "inline-block", background: C.ink, padding: "8px 22px 2px" }}>
          <Disp size={58} color={C.paperHi}>
            Age 15
          </Disp>
        </span>
      </In>
      <In at={b.fastest} y={906}>
        <Disp size={74}>The fastest</Disp>
        <br />
        <Disp size={74} color={C.accent}>
          double hundred
        </Disp>
      </In>
      <In at={b.history} y={1062}>
        <Label size={20} color={C.ink2}>
          In 50-over cricket · ever
        </Label>
      </In>
      <Race
        x={70}
        y={1120}
        at={b.old}
        scale={4}
        dur={34}
        rows={[
          { v: 52, label: "Sooryavanshi · 2026", hero: true },
          { v: 103, label: "Old record · Chad Bowes · 2024", killAt: b.n103 + 20 },
        ]}
      />
    </Shell>
  );
};

/* ================= S2: who he is. A file timeline, then Doha ================= */
const s2Beats = (fps: number) => ({
  name: wordAt(fps, "s2", "Vibhav", 0.72),
  born: wordAt(fps, "s2", "born", 2.46),
  six: wordAt(fps, "s2", "Six", 7.38),
  ipl: wordAt(fps, "s2", "youngest", 12.52),
  vht: wordAt(fps, "s2", "190", 19.56),
  doha: sentence(fps, "s2", 4).from,
  india: wordAt(fps, "s2", "India", 26.04, 1),
  uae: wordAt(fps, "s2", "UAE", 26.98),
  n250: wordAt(fps, "s2", "250", 28.04),
});
const ROWS2 = [
  { k: "27 Mar 2011", v: "Born, Bihar", s: "" },
  { k: "2 Apr 2011", v: "+6 days", s: "India win the World Cup" },
  { k: "Apr 2025 · age 14", v: "IPL's youngest", s: "35-ball hundred v Gujarat Titans" },
  { k: "Dec 2025", v: "190 off 84", s: "Vijay Hazare Trophy, for Bihar" },
];
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const ats = [b.born, b.six, b.ipl, b.vht];
  const out = b.doha - 4;
  const seamP = interpolate(frame, [b.born, b.vht + 16], [0, 1], CLAMP) * (1 - fade(frame, out, 8));
  return (
    <Shell>
      <In at={b.name - 4} y={236}>
        <Disp size={150}>Vaibhav</Disp>
        <br />
        <Disp size={150} color={C.accent}>
          Sooryavanshi
        </Disp>
      </In>
      <Cutout src="vs-smile-bat-cut.png" x={690} y={540} h={790} at={b.name + 6} from="right" fadeBottom={0.9} />
      <div style={{ position: "absolute", left: 84, top: 600, width: 3, height: 680 * seamP, background: C.red, opacity: 0.7 }} />
      {ROWS2.map((r, i) => (
        <In key={r.k} at={ats[i]} out={out} y={590 + i * 172} x={70}>
          <div style={{ position: "absolute", left: 6, top: 8, width: 18, height: 18, borderRadius: 9, background: C.red }} />
          <div style={{ marginLeft: 52 }}>
            <Label size={20} color={C.accent} weight={900}>
              {r.k}
            </Label>
            <div style={{ marginTop: 4 }}>
              <Disp size={82}>{r.v}</Disp>
            </div>
            {r.s && (
              <div style={{ marginTop: 4 }}>
                <Label size={18} color={C.ink2} weight={700} spacing="0.08em">
                  {r.s}
                </Label>
              </div>
            )}
          </div>
        </In>
      ))}
      <In at={b.doha} y={610}>
        <Label size={22} color={C.red} weight={900}>
          24 Nov 2026 · Doha
        </Label>
        <div style={{ marginTop: 6 }}>
          <Label size={18} color={C.ink2} weight={700} spacing="0.1em">
            Asia Cup Rising Stars · 50 overs
          </Label>
        </div>
      </In>
      <In at={b.india - 2} y={700}>
        <Disp size={136}>India A</Disp>
      </In>
      <In at={b.uae - 2} y={846}>
        <Serif size={60} color={C.mute}>
          v{" "}
        </Serif>
        <Disp size={136}>UAE</Disp>
      </In>
      <In at={b.n250 - 4} y={1010}>
        <Label size={20} color={C.ink2}>
          UAE 249/8 in 50 overs
        </Label>
        <div style={{ marginTop: 12 }}>
          <span style={{ display: "inline-block", background: C.ink, padding: "10px 26px 2px" }}>
            <Disp size={110} color={C.paperHi}>
              Target <span style={{ color: C.accent }}>250</span>
            </Disp>
          </span>
        </div>
      </In>
    </Shell>
  );
};

/* ================= S3: the innings. Live scoreboard + one race per record ================= */
const s3Beats = (fps: number) => ({
  n50: wordAt(fps, "s3", "50", 0),
  n100: wordAt(fps, "s3", "100", 2.3),
  jake: wordAt(fps, "s3", "Jake", 7.3),
  gone: wordAt(fps, "s3", "gone", 10.06),
  n150: wordAt(fps, "s3", "150", 11.56),
  own: wordAt(fps, "s3", "His", 13.5),
  n19: wordAt(fps, "s3", "19", 14.92),
  n200: wordAt(fps, "s3", "200", 16.82),
  chad: wordAt(fps, "s3", "Chad", 19.02),
  half: wordAt(fps, "s3", "half", 21.8),
  caught: wordAt(fps, "s3", "caught", 23.7),
  n204: wordAt(fps, "s3", "204", 24.62),
});
const Mile: React.FC<{ y: number; at: number; m: string; balls: number; old?: { v: number; who: string; at: number; kill: number } }> = ({ y, at, m, balls, old }) => {
  const frame = useCurrentFrame();
  const p = useP(at, { damping: 12, stiffness: 240, mass: 0.7 });
  if (frame < at - 1) return null;
  return (
    <div style={{ position: "absolute", left: 70, top: y, width: 620 }}>
      <div style={{ transform: `scale(${interpolate(p, [0, 1], [1.5, 1])})`, transformOrigin: "0% 60%", opacity: interpolate(p, [0, 0.2], [0, 1], CLAMP) }}>
        <Disp size={108} color={C.accent}>
          {m}
        </Disp>
      </div>
      {old && (
        <div style={{ position: "absolute", left: 0, top: 108, opacity: fade(frame, old.kill + 4, 6), transform: `rotate(-3deg) scale(${interpolate(fade(frame, old.kill + 4, 6), [0, 1], [1.6, 1])})`, transformOrigin: "0% 50%" }}>
          <span style={{ display: "inline-block", border: `3px solid ${C.red}`, padding: "3px 10px 1px" }}>
            <Label size={15} color={C.red} weight={900} spacing="0.18em">
              World record
            </Label>
          </span>
        </div>
      )}
      <Race
        x={200}
        y={old ? 2 : 10}
        at={at}
        scale={2.9}
        dur={old ? 18 + Math.round(old.v / 6) : 14}
        rowH={old ? 76 : 76}
        rows={[{ v: balls, label: "balls", hero: true }, ...(old ? [{ v: old.v, label: old.who, at: old.at, killAt: old.kill }] : [])]}
      />
    </div>
  );
};
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  const runs = count(frame, [
    [0, 0], [b.n50 + 6, 50], [b.n100 - 18, 50], [b.n100 + 4, 100], [b.n150 - 18, 100], [b.n150 + 4, 150], [b.n200 - 18, 150], [b.n200 + 4, 204],
  ]);
  const balls = count(frame, [
    [0, 0], [b.n50 + 6, 16], [b.n100 - 18, 16], [b.n100 + 4, 28], [b.n150 - 18, 28], [b.n150 + 4, 40], [b.n200 - 18, 40], [b.n200 + 4, 52], [b.caught - 2, 52], [b.caught + 2, 53],
  ]);
  const outP = fade(frame, b.caught, 6);
  return (
    <Shell>
      <div style={{ position: "absolute", left: 70, top: 236 }}>
        <Label size={20} color={C.ink2}>
          India A v UAE · chasing 250
        </Label>
      </div>
      <div style={{ position: "absolute", left: 66, top: 262, display: "flex", alignItems: "flex-end", gap: 34 }}>
        <div>
          <Disp size={250} color={C.accent} style={{ fontVariantNumeric: "tabular-nums" }}>
            {runs}
          </Disp>
          <div style={{ marginTop: 2 }}>
            <Label size={20} color={C.ink}>
              Runs
            </Label>
          </div>
        </div>
        <div style={{ paddingBottom: 0 }}>
          <Disp size={150} color={outP > 0.5 ? C.red : C.ink} style={{ fontVariantNumeric: "tabular-nums" }}>
            {balls}
          </Disp>
          <div style={{ marginTop: 2 }}>
            <Label size={20} color={C.ink}>
              Balls
            </Label>
          </div>
        </div>
      </div>
      <Swap src="vs-loft-cut.png" x={730} y={470} h={860} at={4} out={b.n100} />
      <Swap src="vs-look-bat-cut.png" x={750} y={470} h={860} at={b.n100} out={b.n150} />
      <Swap src="vs-pull-cut.png" x={590} y={530} h={800} at={b.n150} out={b.n200} />
      <Swap src="vs-raise-cut.png" x={690} y={470} h={860} at={b.n200} />
      <Mile y={626} at={b.n50} m="50" balls={16} />
      <Mile y={756} at={b.n100} m="100" balls={28} old={{ v: 29, who: "Old · J Fraser-McGurk", at: b.jake, kill: b.gone }} />
      <Mile y={932} at={b.n150} m="150" balls={40} old={{ v: 59, who: "Old · Sooryavanshi, Dec 2025", at: b.own, kill: b.n19 }} />
      <Mile y={1108} at={b.n200} m="200" balls={52} old={{ v: 103, who: "Old · Chad Bowes, 2024", at: b.chad, kill: b.half }} />
      <Stamp text="Out" sub="next ball" at={b.caught} x={640} y={262} rotate={-10} size={110} />
    </Shell>
  );
};

/* ================= S4: 28 sixes ================= */
const s4Beats = (fps: number) => ({
  n28: wordAt(fps, "s4", "28", 0),
  no: wordAt(fps, "s4", "no", 1.42),
  darcy: wordAt(fps, "s4", "Darcy", 4.68),
  gone: wordAt(fps, "s4", "gone", 5.78),
  fours: wordAt(fps, "s4", "4s", 7.58),
  n196: wordAt(fps, "s4", "196", 8.78),
  bound: wordAt(fps, "s4", "boundaries", 12.52),
});
const Ball: React.FC<{ d: number; color: string; filled: boolean }> = ({ d, color, filled }) => (
  <svg width={d} height={d}>
    <circle cx={d / 2} cy={d / 2} r={d / 2 - 2.5} fill={filled ? color : "none"} stroke={color} strokeWidth={3} />
    <path d={`M ${d * 0.32} ${d * 0.1} Q ${d * 0.47} ${d / 2} ${d * 0.32} ${d * 0.9}`} fill="none" stroke={filled ? C.paperHi : color} strokeWidth={2} strokeDasharray="3 3" />
    <path d={`M ${d * 0.68} ${d * 0.1} Q ${d * 0.53} ${d / 2} ${d * 0.68} ${d * 0.9}`} fill="none" stroke={filled ? C.paperHi : color} strokeWidth={2} strokeDasharray="3 3" />
  </svg>
);
const Grid: React.FC<{ n: number; x: number; y: number; at: number; step: number; color: string; filled: boolean; ringFrom?: number; ringAt?: number }> = ({ n, x, y, at, step, color, filled, ringFrom, ringAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = 50, G = 62;
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {Array.from({ length: n }).map((_, i) => {
        const s = spring({ frame: frame - (at + i * step), fps, config: theme.spring.pop });
        const ring = ringFrom !== undefined && ringAt !== undefined && i >= ringFrom ? fade(frame, ringAt + (i - ringFrom) * 3, 6) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: (i % 7) * G, top: Math.floor(i / 7) * G, transform: `scale(${s * (1 + 0.1 * ring)})`, opacity: Math.min(1, s * 2) }}>
            <Ball d={D} color={color} filled={filled} />
            {ring > 0 && <div style={{ position: "absolute", left: -6, top: -6, width: D + 12, height: D + 12, borderRadius: "50%", border: `3px solid ${C.red}`, opacity: ring }} />}
          </div>
        );
      })}
    </div>
  );
};
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const segP = (a: number) => ease(frame, a, a + 16);
  const BW = 940;
  const parts = [
    { v: 168, c: C.accent, l: "168 in sixes", at: b.n196 },
    { v: 28, c: C.ink, l: "28 in fours", at: b.n196 + 10 },
    { v: 8, c: C.mute, l: "8 run", at: b.n196 + 16 },
  ];
  let acc = 0;
  return (
    <Shell>
      <In at={b.n28 - 2} y={232}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <Disp size={300} color={C.accent}>
            28
          </Disp>
          <Disp size={150}>Sixes</Disp>
        </div>
      </In>
      <In at={b.no} y={530}>
        <Label size={22} color={C.ink}>
          The most ever in a List A innings
        </Label>
      </In>
      <In at={b.n28} y={598}>
        <Label size={17} color={C.accent} weight={900}>
          Sooryavanshi · 2026
        </Label>
      </In>
      <Grid n={28} x={70} y={636} at={b.n28 + 2} step={1.2} color={C.accent} filled ringFrom={23} ringAt={b.gone + 4} />
      <In at={b.darcy - 2} x={576} y={598}>
        <Label size={17} color={C.ink2} weight={900}>
          Old record · D'Arcy Short · 2018
        </Label>
      </In>
      <Grid n={23} x={576} y={636} at={b.darcy} step={0.9} color={C.ink2} filled={false} />
      <In at={b.gone + 10} x={760} y={812}>
        <Disp size={64} color={C.red}>
          +5
        </Disp>
      </In>
      <In at={b.fours - 4} y={928}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ width: 46, height: 46, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", opacity: fade(frame, b.fours - 4 + i * 2, 4) }}>
              <Disp size={34} color={C.paperHi}>
                4
              </Disp>
            </div>
          ))}
          <div style={{ marginLeft: 14 }}>
            <Label size={22} color={C.ink}>
              7 fours
            </Label>
          </div>
        </div>
      </In>
      <In at={b.n196 - 4} y={1010}>
        <Disp size={100} color={C.accent}>
          196
        </Disp>
        <Disp size={100} color={C.ink}>
          {" "}of 204
        </Disp>
        <span style={{ marginLeft: 20 }}>
          <Label size={20} color={C.ink2}>
            in boundaries · 96%
          </Label>
        </span>
      </In>
      <div style={{ position: "absolute", left: 70, top: 1140, width: BW, height: 50, opacity: fade(frame, b.n196 - 2, 6) }}>
        {parts.map((p) => {
          const left = (acc / 204) * BW;
          acc += p.v;
          return <div key={p.l} style={{ position: "absolute", left, top: 0, height: 50, width: ((p.v / 204) * BW - 3) * segP(p.at), background: p.c }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 70, top: 1204, width: BW, display: "flex", justifyContent: "space-between", opacity: fade(frame, b.n196 + 18, 8) }}>
        {parts.map((p) => (
          <Label key={p.l} size={17} color={p.c === C.mute ? C.ink2 : p.c} weight={900}>
            {p.l}
          </Label>
        ))}
      </div>
    </Shell>
  );
};

/* ================= S5: strike rate 385 + the overs strip ================= */
const s5Beats = (fps: number) => ({
  strike: wordAt(fps, "s5", "strike", 0.08),
  n385: wordAt(fps, "s5", "385", 0.88),
  n50: wordAt(fps, "s5", "50", 3.08),
  uae: wordAt(fps, "s5", "UAE", 4.86),
  n249: wordAt(fps, "s5", "249", 6.96),
  made: wordAt(fps, "s5", "made", 9.24),
  under: wordAt(fps, "s5", "under", 10.8),
});
const Overs: React.FC<{ y: number; at: number; overs: number; dur: number; color: string; label: string; runs: string; note?: string }> = ({ y, at, overs, dur, color, label, runs }) => {
  const frame = useCurrentFrame();
  const W = 940, cell = W / 50;
  const t = interpolate(frame, [at, at + dur], [0, overs], { easing: theme.ease.soft, ...CLAMP });
  if (frame < at - 4) return null;
  const endX = Math.min(t, overs) * cell;
  return (
    <div style={{ position: "absolute", left: 70, top: y, width: W, opacity: fade(frame, at - 4, 6) }}>
      <Label size={18} color={color} weight={900}>
        {label}
      </Label>
      <div style={{ position: "absolute", left: 0, top: 34, width: W, height: 46 }}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: i * cell, top: 0, width: cell - 3, height: 46, background: C.line }} />
        ))}
        {Array.from({ length: Math.ceil(overs) }).map((_, i) => {
          const fillW = Math.max(0, Math.min(1, t - i)) * (cell - 3);
          return <div key={`f${i}`} style={{ position: "absolute", left: i * cell, top: 0, width: fillW, height: 46, background: color }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: overs > 40 ? undefined : endX + 14, right: overs > 40 ? 0 : undefined, top: overs > 40 ? -18 : 24, opacity: fade(frame, at + dur - 4, 6) }}>
        <Disp size={64} color={color}>
          {runs}
        </Disp>
      </div>
    </div>
  );
};
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const draw = interpolate(frame, [b.strike - 4, b.n385 + 4], [0, 1], { easing: theme.ease.soft, ...CLAMP });
  const fill = interpolate(frame, [b.n385, b.n385 + 10], [0, 1], CLAMP);
  return (
    <Shell>
      <BigGlyph char="385" x={60} y={236} size={560} width={960} draw={draw} fill={fill * 0.94} />
      <In at={b.n385 + 4} center y={752}>
        <Disp size={84}>Strike rate</Disp>
      </In>
      <In at={b.n50} center y={850}>
        <Serif size={46} color={C.ink2}>
          in a fifty-over match
        </Serif>
      </In>
      <Overs y={968} at={b.uae} overs={50} dur={40} color={C.ink} label="UAE · 50 overs" runs="249" />
      <Overs y={1092} at={b.made - 2} overs={53 / 6} dur={14} color={C.accent} label="Sooryavanshi · 8.5 overs" runs="204" />
      <In at={b.under + 6} y={1220}>
        <Label size={19} color={C.ink2}>
          82% of their runs · 18% of their balls
        </Label>
      </In>
    </Shell>
  );
};

/* ================= S6: age 15, and his report card ================= */
const s6Beats = (fps: number) => ({
  n15: wordAt(fps, "s6", "15", 0.2),
  days: wordAt(fps, "s6", "242", 1.66),
  boys: sentence(fps, "s6", 1).from,
  board: wordAt(fps, "s6", "board", 7.44),
  f100: wordAt(fps, "s6", "fastest", 9.3, 0),
  f150: wordAt(fps, "s6", "fastest", 10.42, 1),
  f200: wordAt(fps, "s6", "fastest", 12.18, 2),
  six: wordAt(fps, "s6", "most", 13.84, 1),
  four: wordAt(fps, "s6", "four", 15.34),
});
const CARD = [
  { sub: "Fastest 100", score: "28 balls" },
  { sub: "Fastest 150", score: "40 balls" },
  { sub: "Fastest 200", score: "52 balls" },
  { sub: "Most sixes", score: "28" },
];
const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const ats = [b.f100, b.f150, b.f200, b.six];
  const ageOut = fade(frame, b.boys - 6, 10);
  const draw = interpolate(frame, [0, 22], [0, 1], { easing: theme.ease.soft, ...CLAMP });
  const fill = interpolate(frame, [b.n15 - 2, b.n15 + 8], [0, 1], CLAMP);
  const cp = spring({ frame: frame - b.boys, fps, config: theme.spring.smooth });
  return (
    <Shell>
      <div style={{ opacity: 1 - ageOut, transform: `translateY(${-60 * ageOut}px)` }}>
        <BigGlyph char="15" x={60} y={236} size={560} width={600} draw={draw} fill={fill * 0.94} />
        <In at={b.n15 + 4} y={752}>
          <Disp size={112}>Years</Disp>
        </In>
        <In at={b.days - 2} y={866}>
          <Disp size={112} color={C.accent}>
            242 days
          </Disp>
        </In>
        <In at={b.days + 10} y={1000}>
          <Label size={20} color={C.ink2}>
            Born 27 March 2011
          </Label>
        </In>
        <Cutout src="vs-smile-helmet-cut.png" x={630} y={450} h={880} at={4} from="right" fadeBottom={0.9} />
      </div>
      {frame >= b.boys && (
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 262,
            width: 920,
            height: 1020,
            background: C.paperHi,
            boxShadow: "0 30px 60px rgba(40,30,10,0.28), 0 4px 10px rgba(40,30,10,0.16)",
            transform: `translateY(${interpolate(cp, [0, 1], [140, 0])}px) rotate(${interpolate(cp, [0, 1], [-6, -1.5])}deg)`,
            opacity: interpolate(cp, [0, 0.25], [0, 1], CLAMP),
            backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 63px, rgba(15,26,51,0.08) 63px, rgba(15,26,51,0.08) 65px)`,
          }}
        >
          <div style={{ position: "absolute", left: 96, top: 0, bottom: 0, width: 2, background: C.red, opacity: 0.45 }} />
          <div style={{ position: "absolute", left: 130, top: 44 }}>
            <Label size={20} color={C.red} weight={900} spacing="0.24em">
              Class X · board exams
            </Label>
            <div style={{ marginTop: 6 }}>
              <Disp size={92}>Report card</Disp>
            </div>
            <div style={{ marginTop: 8 }}>
              <Label size={18} color={C.ink2} weight={800}>
                Name: Vaibhav Sooryavanshi · Age 15
              </Label>
            </div>
          </div>
          <div style={{ position: "absolute", left: 130, right: 60, top: 290, display: "flex", justifyContent: "space-between", borderBottom: `2px solid ${C.ink}`, paddingBottom: 8 }}>
            <Label size={16} color={C.mute}>Subject</Label>
            <Label size={16} color={C.mute}>Score</Label>
            <Label size={16} color={C.mute}>Grade</Label>
          </div>
          {CARD.map((r, i) => {
            const a = ats[i];
            const p = fade(frame, a - 2, 6);
            const g = interpolate(frame, [a + 6, a + 12], [0, 1], { easing: theme.ease.in, ...CLAMP });
            return (
              <div key={r.sub} style={{ position: "absolute", left: 130, right: 60, top: 336 + i * 124, height: 110, opacity: p }}>
                <div style={{ position: "absolute", left: 0, top: 18 }}>
                  <Disp size={62}>{r.sub}</Disp>
                </div>
                <div style={{ position: "absolute", left: 400, top: 18 }}>
                  <Disp size={62} color={C.accent}>
                    {r.score}
                  </Disp>
                </div>
                <div style={{ position: "absolute", right: 0, top: 8, width: 92, height: 92, borderRadius: "50%", border: `5px solid ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: g, transform: `rotate(-12deg) scale(${interpolate(g, [0, 1], [2, 1])})`, mixBlendMode: "multiply" }}>
                  <Disp size={44} color={C.red}>
                    WR
                  </Disp>
                </div>
              </div>
            );
          })}
          <Stamp text="4 world records" sub="one innings" at={b.four} x={150} y={840} rotate={-6} size={84} />
        </div>
      )}
    </Shell>
  );
};

/* ================= S7: the close ================= */
const s7Beats = (fps: number) => ({
  close: sentence(fps, "s7", 1).from,
  chasing: wordAt(fps, "s7", "records", 4.3, 1),
  brand: wordAt(fps, "s7", "Beyond", 6.34),
});
const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const up = ease(frame, b.brand - 6, b.brand + 14);
  return (
    <Shell exit={false}>
      <div style={{ transform: `translateY(${-90 * up}px)` }}>
        <CaseFile src="vs-sky.jpg" at={4} x={170} y={244} w={740} h={780} pos="50% 30%" tilt={-3} />
        <In at={b.close} center y={1064}>
          <Serif size={78} weight={900}>
            At 15, the records
          </Serif>
        </In>
        <In at={b.chasing} center y={1150}>
          <Serif size={78} weight={900}>
            are chasing <span style={{ color: C.accent }}>him.</span>
          </Serif>
        </In>
      </div>
      <Seam x={240} y={1184} w={600} p={up} />
      <Brand at={b.brand} top={1214} series={config.series} tagline={config.tagline} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1400, textAlign: "center", opacity: fade(frame, b.brand + 12, 10) }}>
        <Label size={15} color={C.mute} weight={600} spacing="0.08em">
          Photos: BCCI / Team India · Data: match reports, 24 Nov 2026
        </Label>
      </div>
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
  ] as [string, React.FC][],
  warmFrom: (fps: number) => scene(fps, "s7").from,
  mastheadOffAt: (fps: number) => scene(fps, "s7").from + s7Beats(fps).brand,
  captionsOffFrom: (fps: number) => scene(fps, "s7").from + s7Beats(fps).close - 2,
  sfx: (fps: number): Cue[] => {
    const S = (id: string) => scene(fps, id).from;
    const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps);
    const c: Cue[] = [];
    const add = (id: string, at: number, file: string, volume: number) => c.push({ at: S(id) + at, file, volume });
    ["s2", "s3", "s4", "s5", "s6", "s7"].forEach((id) => c.push({ at: S(id) - 9, file: "swoosh.wav", volume: 0.24 }));
    add("s1", 1, "pen.wav", 0.35);
    add("s1", b1.balls - 2, "impact.wav", 0.55);
    add("s1", b1.fifteen - 6, "whip.wav", 0.25);
    add("s1", b1.fastest - 4, "pop.wav", 0.28);
    add("s1", b1.old, "ticks.wav", 0.25);
    add("s1", b1.n103 + 18, "crack.wav", 0.3);
    [b2.born, b2.six, b2.ipl, b2.vht].forEach((x) => add("s2", x - 4, "pop.wav", 0.26));
    add("s2", b2.doha - 6, "whip.wav", 0.3);
    add("s2", b2.n250 - 6, "slam.wav", 0.45);
    add("s3", 0, "ticks.wav", 0.25);
    add("s3", b3.n50 - 2, "pop.wav", 0.3);
    [b3.n100, b3.n150, b3.n200].forEach((x) => {
      add("s3", x - 18, "ticks.wav", 0.22);
      add("s3", x - 2, "slam.wav", 0.45);
    });
    add("s3", b3.n200, "crowd.wav", 0.24);
    [b3.gone, b3.n19, b3.half].forEach((x) => add("s3", x + 2, "crack.wav", 0.3));
    add("s3", b3.caught - 2, "slam.wav", 0.5);
    add("s3", b3.caught - 2, "impact.wav", 0.4);
    add("s4", b4.n28, "ticks.wav", 0.3);
    add("s4", b4.n28 - 2, "impact.wav", 0.45);
    add("s4", b4.darcy, "ticks.wav", 0.2);
    add("s4", b4.gone + 4, "slam.wav", 0.4);
    add("s4", b4.fours - 4, "pop.wav", 0.26);
    add("s4", b4.n196 - 4, "rise.wav", 0.22);
    add("s4", b4.n196 + 14, "pop.wav", 0.28);
    add("s5", b5.strike - 4, "pen.wav", 0.3);
    add("s5", b5.n385 - 2, "impact.wav", 0.5);
    add("s5", b5.uae, "ticks.wav", 0.24);
    add("s5", b5.made - 2, "whip.wav", 0.3);
    add("s5", b5.made + 12, "slam.wav", 0.4);
    add("s6", 1, "pen.wav", 0.3);
    add("s6", b6.n15 - 2, "impact.wav", 0.45);
    add("s6", b6.days - 4, "pop.wav", 0.26);
    add("s6", b6.boys - 4, "whip.wav", 0.28);
    [b6.f100, b6.f150, b6.f200, b6.six].forEach((x) => add("s6", x + 10, "slam.wav", 0.32));
    add("s6", b6.four - 2, "slam.wav", 0.55);
    add("s6", b6.four - 2, "impact.wav", 0.45);
    add("s6", b6.four + 4, "crowd.wav", 0.2);
    add("s7", 6, "swoosh.wav", 0.22);
    add("s7", b7.close - 2, "impact.wav", 0.45);
    add("s7", b7.brand - 2, "slam.wav", 0.4);
    c.push({ at: totalFrames(fps) - Math.round(fps * 1.2), file: "pen.wav", volume: 0.25 });
    return c;
  },
};
