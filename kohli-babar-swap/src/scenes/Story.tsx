// THE SWAP — what if Virat Kohli played ODIs for Pakistan, and Babar Azam for India? (data: src/data.json, analysis/)
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BigGlyph, CLAMP, Disp, fade, Label, Seam, Serif, Shell, useP } from "../components/Ed";
import { Cue } from "../components/Sound";
import { Brand, Footnote, FlyRow, Kicker, Stamp, Versus } from "../components/Viz";
import { config } from "../config";
import data from "../data.json";
import { theme } from "../theme";
import { scene, sentence, totalFrames, wordAt } from "../timing";

const C = theme.colors;
const BLUE = C.accent, GREEN = C.green;
const K = data.tape["V Kohli"], B = data.tape["Babar Azam"];
const ease = (f: number, a: number, len: number) => interpolate(f, [a, a + len], [0, 1], { easing: theme.ease.out, ...CLAMP });
const CREDIT = "Photos: Kohli, WACA 2015 · Bahnfrend, CC BY-SA 4.0 | Babar, 2020 · BBC Urdu, CC BY 3.0 · via Wikimedia Commons";

/* ---------- a taped print with a team-coloured frame ---------- */
const Print: React.FC<{ src: string; pos: string; w: number; h: number; frame: string; rotate?: number; style?: React.CSSProperties }> = ({ src, pos, w, h, frame, rotate = 0, style }) => (
  <div style={{ position: "absolute", width: w, height: h, background: C.paperHi, padding: 14, boxSizing: "border-box", borderBottom: `16px solid ${frame}`, boxShadow: "0 26px 50px rgba(40,30,10,0.30), 0 3px 8px rgba(40,30,10,0.16)", transform: `rotate(${rotate}deg)`, ...style }}>
    <Img src={staticFile(`photos/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, display: "block" }} />
    <div style={{ position: "absolute", left: w / 2 - 70, top: -18, width: 140, height: 38, background: "rgba(251,246,232,0.8)", transform: "rotate(-3deg)", boxShadow: "0 2px 6px rgba(40,30,10,0.12)" }} />
  </div>
);

const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",")})`;
};

/* ================= S1 — TITLE CARD: 18 ⇄ 56 ================= */
const s1Beats = (fps: number) => ({
  n18: wordAt(fps, "s1", "18", 0),
  n56: wordAt(fps, "s1", "56", 0.56),
  kohli: wordAt(fps, "s1", "virat", 2.24),
  babar: wordAt(fps, "s1", "bob", 5.06),
  swap: wordAt(fps, "s1", "india", 6.16) + 4,
  replayed: sentence(fps, "s1", 2).from,
  tenk: wordAt(fps, "s1", "10", 11.42),
  title: sentence(fps, "s1", 3).from,
});
const SwapGroup: React.FC<{ glyph: string; src: string; pos: string; from: number; to: number; at: number; t: number; c0: string; c1: string; lift: number; tilt: [number, number]; drawAt: number }> = ({ glyph, src, pos, from, to, at, t, c0, c1, lift, tilt, drawAt }) => {
  const frame = useCurrentFrame();
  const draw = theme.ease.inOut(interpolate(frame, [drawAt, drawAt + 26], [0, 1], CLAMP));
  const pIn = useP(at, theme.spring.smooth);
  const x = interpolate(t, [0, 1], [from, to]);
  const y = -Math.sin(Math.PI * t) * lift;
  const col = mix(c0, c1, interpolate(t, [0.4, 0.7], [0, 1], CLAMP));
  return (
    <div style={{ position: "absolute", left: x - 250, top: 330 + y, width: 500, height: 640 }}>
      <BigGlyph char={glyph} x={10} y={0} size={500} width={480} draw={draw} fill={0} stroke={col} />
      {frame >= at && (
        <div style={{ position: "absolute", left: 70, top: 95, opacity: interpolate(pIn, [0, 0.3], [0, 1], CLAMP), transform: `translateY(${interpolate(pIn, [0, 1], [90, 0])}px)` }}>
          <Print src={src} pos={pos} w={360} h={440} frame={col} rotate={interpolate(t, [0, 1], tilt)} />
        </div>
      )}
    </div>
  );
};
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const t = interpolate(frame, [b.swap, b.swap + 26], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const title = spring({ frame: frame - b.title, fps, config: { damping: 12, stiffness: 220, mass: 0.8 } });
  const counters = fade(frame, b.replayed) * (1 - fade(frame, b.title - 8, 8));
  const tenk = Math.round(interpolate(frame, [b.tenk - 4, b.tenk + 22], [1, 10000], { easing: theme.ease.out, ...CLAMP }));
  return (
    <Shell enter={false}>
      {/* team columns */}
      {[
        { x: 290, name: "India", c: BLUE },
        { x: 790, name: "Pakistan", c: GREEN },
      ].map((s) => (
        <div key={s.name} style={{ position: "absolute", left: s.x - 220, width: 440, top: 252, textAlign: "center", opacity: fade(frame, 4) }}>
          <Disp size={46} color={s.c}>
            {s.name}
          </Disp>
          <div style={{ margin: "8px auto 0", width: 120, height: 5, background: s.c }} />
        </div>
      ))}
      <SwapGroup glyph="18" src="kohli-wc2015.jpg" pos="38% 30%" from={290} to={790} at={b.kohli} t={t} c0={BLUE} c1={GREEN} lift={120} tilt={[-3, 3]} drawAt={b.n18} />
      <SwapGroup glyph="56" src="babar-2020.jpg" pos="62% 35%" from={790} to={290} at={b.babar} t={t} c0={GREEN} c1={BLUE} lift={-60} tilt={[3, -3]} drawAt={b.n56} />
      {/* swap arrows between the columns */}
      <svg width={140} height={90} style={{ position: "absolute", left: 470, top: 600, opacity: fade(frame, b.swap - 6, 6) * (1 - fade(frame, b.swap + 30, 10)) }}>
        <path d="M10 30 H120 M100 12 L122 30 L100 48" stroke={C.red} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M130 64 H20 M40 46 L18 64 L40 82" stroke={C.red} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", left: 60, right: 60, top: 925, textAlign: "center", opacity: fade(frame, b.swap + 26, 12) }}>
        <Label size={13} color={C.mute} weight={600} spacing="0.06em">
          {CREDIT}
        </Label>
      </div>
      {/* the replay counters */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 990, display: "flex", justifyContent: "center", gap: 70, opacity: counters }}>
        <div style={{ textAlign: "center" }}>
          <Disp size={120}>{String(data.n_matches)}</Disp>
          <div>
            <Label size={20} color={C.mute}>
              ODIs since May 2015
            </Label>
          </div>
        </div>
        <div style={{ textAlign: "center", opacity: fade(frame, b.tenk - 4) }}>
          <Disp size={120} color={C.red}>
            {"× " + tenk.toLocaleString("en-US")}
          </Disp>
          <div>
            <Label size={20} color={C.mute}>
              Replays of each
            </Label>
          </div>
        </div>
      </div>
      {/* the title */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 985, textAlign: "center", opacity: interpolate(title, [0, 0.25], [0, 1], CLAMP), transform: `scale(${interpolate(title, [0, 1], [1.35, 1])})` }}>
        <Disp size={230}>
          The <span style={{ color: C.red }}>Swap</span>
        </Disp>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1212, textAlign: "center", opacity: fade(frame, b.title + 8) }}>
        <Serif size={40} color={C.ink2}>
          What if Kohli played for Pakistan,
          <br />
          and Babar for India?
        </Serif>
      </div>
    </Shell>
  );
};

/* ================= S2 — TALE OF THE TAPE ================= */
const s2Beats = (fps: number) => ({ avg: wordAt(fps, "s2", "65", 2.74), odi: wordAt(fps, "s2", "odi", 4.0), h: wordAt(fps, "s2", "33", 5.38), b52: wordAt(fps, "s2", "52", 7.84), b20: wordAt(fps, "s2", "20", 8.96, 1), n13: wordAt(fps, "s2", "13", 10.44), faster: wordAt(fps, "s2", "faster", 12.96) });
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const badge = useP(b.n13, { damping: 11, stiffness: 240, mass: 0.7 });
  return (
    <Shell>
      <Versus a="Kohli" b="Babar" colorB={GREEN} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", opacity: fade(frame, 4) }}>
        <Serif size={44}>ODIs since Babar's debut</Serif>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 440 }}>
        <FlyRow label="INNINGS" a={K.all.inns} b={B.all.inns} max={170} at={6} fmtA={String(K.all.inns)} fmtB={String(B.all.inns)} colorB={GREEN} />
        <FlyRow label="AVERAGE" a={K.all.avg} b={B.all.avg} max={72} at={b.avg - 6} fmtA={K.all.avg.toFixed(1)} fmtB={B.all.avg.toFixed(1)} colorB={GREEN} />
        <FlyRow label="HUNDREDS" a={K.all.hundreds} b={B.all.hundreds} max={36} at={b.h - 4} fmtA={String(K.all.hundreds)} fmtB={String(B.all.hundreds)} colorB={GREEN} />
        <FlyRow label="STRIKE RATE" a={K.all.sr} b={B.all.sr} max={108} at={b.faster - 8} fmtA={K.all.sr.toFixed(1)} fmtB={B.all.sr.toFixed(1)} colorB={GREEN} />
      </div>
      {frame >= b.n13 - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", opacity: interpolate(badge, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(badge, [0, 1], [1.4, 1])})` }}>
          <div style={{ background: C.ink, padding: "18px 40px 14px", display: "flex", alignItems: "baseline", gap: 22, transform: "rotate(-2deg)" }}>
            <Disp size={120} color={C.paperHi}>
              +13
            </Disp>
            <Label size={26} color={C.paperHi} weight={900}>
              runs per innings
              <br />
              for Kohli
            </Label>
          </div>
        </div>
      )}
      <Footnote text={`ODIs ${data.window} · Cricsheet ball-by-ball · excludes matches v Afghanistan, which Cricsheet withholds`} at={b.n13} top={1110} />
    </Shell>
  );
};

/* ================= S3 — THE CHASE (slope chart) ================= */
const s3Beats = (fps: number) => ({ first: wordAt(fps, "s3", "first", 2.5), k63: wordAt(fps, "s3", "63", 3.68), b56: wordAt(fps, "s3", "56", 5.58), chasing: wordAt(fps, "s3", "chasing", 7.1), k68: wordAt(fps, "s3", "68", 8.36), b49: wordAt(fps, "s3", "49", 10.4), better: wordAt(fps, "s3", "better", 12.1), worse: wordAt(fps, "s3", "worse", 13.32) });
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  const X1 = 290, X2 = 790;
  const Y = (v: number) => interpolate(v, [40, 75], [1150, 470]);
  const rows = [
    { who: "Kohli", c: BLUE, a: K.first.avg, z: K.chasing.avg, atA: b.k63 - 4, atZ: b.k68 - 6, tag: b.better },
    { who: "Babar", c: GREEN, a: B.first.avg, z: B.chasing.avg, atA: b.b56 - 4, atZ: b.b49 - 6, tag: b.worse },
  ];
  return (
    <Shell>
      <Kicker title="The gap is widest in a chase" sub="ODI batting average · since May 2015" subAt={b.first - 10} />
      {[
        { x: X1, t: "Batting first", at: b.first - 6 },
        { x: X2, t: "Chasing", at: b.chasing - 6 },
      ].map((c) => (
        <div key={c.t} style={{ opacity: fade(frame, c.at) }}>
          <div style={{ position: "absolute", left: c.x - 1, top: 440, width: 2, height: 740, background: C.line }} />
          <div style={{ position: "absolute", left: c.x - 200, width: 400, top: 1190, textAlign: "center" }}>
            <Disp size={46}>{c.t}</Disp>
          </div>
        </div>
      ))}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {rows.map((r) => {
          const p = ease(frame, r.atZ, 18);
          return <line key={r.who} x1={X1} y1={Y(r.a)} x2={X1 + (X2 - X1) * p} y2={Y(r.a) + (Y(r.z) - Y(r.a)) * p} stroke={r.c} strokeWidth={8} strokeLinecap="round" />;
        })}
      </svg>
      {rows.map((r) => {
        const pa = useP(r.atA);
        const pz = useP(r.atZ + 14);
        const d = r.z - r.a;
        return (
          <React.Fragment key={r.who}>
            <div style={{ position: "absolute", left: X1 - 20, top: Y(r.a) - 20, width: 40, height: 40, borderRadius: 40, background: r.c, transform: `scale(${pa})`, boxShadow: `0 0 0 8px ${C.paper}` }} />
            <div style={{ position: "absolute", right: 1080 - X1 + 40, top: Y(r.a) - 46, textAlign: "right", opacity: pa }}>
              <Disp size={84} color={r.c}>
                {r.a.toFixed(1)}
              </Disp>
              <div>
                <Label size={20} color={r.c}>
                  {r.who}
                </Label>
              </div>
            </div>
            <div style={{ position: "absolute", left: X2 - 20, top: Y(r.z) - 20, width: 40, height: 40, borderRadius: 40, background: r.c, transform: `scale(${pz})`, boxShadow: `0 0 0 8px ${C.paper}` }} />
            <div style={{ position: "absolute", left: X2 + 40, top: Y(r.z) - 46, opacity: pz }}>
              <Disp size={84} color={r.c}>
                {r.z.toFixed(1)}
              </Disp>
              <div style={{ opacity: fade(frame, r.tag - 4) }}>
                <Label size={22} color={r.c} weight={900}>
                  {(d > 0 ? "▲ +" : "▼ −") + Math.abs(d).toFixed(1)}
                </Label>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </Shell>
  );
};

/* ================= S4 — HOW THE REPLAY WORKS (Mohali 2016) ================= */
const s4Beats = (fps: number) => ({
  card: wordAt(fps, "s4", "mul", 2.06) - 4,
  k154: wordAt(fps, "s4", "154", 5.06),
  take: wordAt(fps, "s4", "take", 9.32),
  drop: wordAt(fps, "s4", "bobber", 11.14) - 6,
  land: wordAt(fps, "s4", "team", 15.34),
  mates: wordAt(fps, "s4", "teammates", 16.54),
  result: wordAt(fps, "s4", "leaves", 17.94) + 8,
  tenk: wordAt(fps, "s4", "replays", 19.58) - 8,
  twice: wordAt(fps, "s4", "twice", 21.92),
});
const ReceiptLine: React.FC<{ at: number; left: string; right: string; color?: string; strike?: number; big?: boolean }> = ({ at, left, right, color = C.ink, strike = 0, big }) => {
  const frame = useCurrentFrame();
  const p = useP(at);
  if (frame < at - 1) return <div style={{ height: big ? 78 : 62 }} />;
  return (
    <div style={{ position: "relative", height: big ? 78 : 62, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP), transform: `translateX(${interpolate(p, [0, 1], [40, 0])}px)` }}>
      <Label size={big ? 26 : 22} color={color} weight={900} spacing="0.08em">
        {left}
      </Label>
      <Disp size={big ? 64 : 50} color={color}>
        {right}
      </Disp>
      {strike > 0 && <div style={{ position: "absolute", left: -10, top: "50%", width: `${strike * 104}%`, height: 5, background: C.red }} />}
    </div>
  );
};
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const mo = data.mohali;
  const flickI = Math.min(mo.flicks.length - 1, Math.max(0, Math.floor((frame - b.drop) / 5)));
  const landed = frame >= b.land - 2;
  const draw = landed ? mo.landed : mo.flicks[flickI];
  const strike = ease(frame, b.take, 10);
  const pct = interpolate(frame, [b.tenk + 6, b.twice], [0, mo.p_swap * 100], { easing: theme.ease.out, ...CLAMP });
  const count = Math.round(interpolate(frame, [b.tenk, b.tenk + 40], [1, 10000], { easing: theme.ease.out, ...CLAMP }));
  return (
    <Shell>
      <Kicker title="How the replay works" sub="India v New Zealand · Mohali · 23 Oct 2016" subAt={b.card} />
      <div style={{ position: "absolute", left: 70, right: 70, top: 380, background: C.paperHi, padding: "26px 40px 22px", boxShadow: "0 22px 46px rgba(40,30,10,0.18)", opacity: fade(frame, b.card), transform: `translateY(${(1 - ease(frame, b.card, 14)) * 40}px)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `2px dashed ${C.line}`, paddingBottom: 14, marginBottom: 10 }}>
          <Label size={22} color={C.ink2}>
            India chasing
          </Label>
          <Disp size={56}>Target {mo.target}</Disp>
        </div>
        <ReceiptLine at={b.card + 8} left={`India finished ${mo.india}/${mo.wkts}, ${300 - mo.legal} balls spare*`} right={String(mo.potential)} />
        <ReceiptLine at={b.k154 - 2} left={`− Kohli ${mo.kohli.r}* (${mo.kohli.b} balls)`} right={`−${mo.kohli.r}`} color={BLUE} strike={strike} />
        <div style={{ position: "relative", height: 62 }}>
          {frame >= b.drop && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 62, opacity: fade(frame, b.drop, 4) }}>
              <Label size={22} color={GREEN} weight={900} spacing="0.08em">
                {`+ Babar ${draw.r} (${draw.b}) · v ${draw.opp} ${draw.year}`}
              </Label>
              <Disp size={50} color={GREEN}>{`+${draw.r}`}</Disp>
            </div>
          )}
          {frame >= b.drop && !landed && <div style={{ position: "absolute", right: -26, top: 20, width: 14, height: 14, borderRadius: 14, background: C.red, opacity: Math.floor(frame / 3) % 2 }} />}
        </div>
        <ReceiptLine at={b.mates} left={`+ teammates bat ${mo.extra_balls} more balls × ${mo.others.rpb}`} right={`+${mo.extra_runs}`} />
        <div style={{ borderTop: `3px solid ${C.ink}`, margin: "10px 0 6px", opacity: fade(frame, b.result - 4) }} />
        <ReceiptLine at={b.result} left={`New total ${mo.new_total} · short of ${mo.target}`} right="NZ win" color={C.red} big />
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 930, opacity: fade(frame, b.card + 14) }}>
        <Label size={16} color={C.mute} weight={600} spacing="0.06em">
          {`*Wickets and balls in hand are worth ${mo.in_hand} more runs (average from every completed ODI first innings since 2010). Babar's innings: one of ${mo.babar_pool} chases v top teams, drawn at random.`}
        </Label>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 1040, display: "flex", alignItems: "center", gap: 30, opacity: fade(frame, b.tenk) }}>
        <div style={{ width: 300 }}>
          <Disp size={84} color={C.red}>
            {"× " + count.toLocaleString("en-US")}
          </Disp>
        </div>
        <div style={{ flex: 1 }}>
          <Label size={20} color={C.ink2}>
            India win with Babar
          </Label>
          <div style={{ position: "relative", height: 26, background: C.line, marginTop: 8 }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: BLUE }} />
          </div>
        </div>
        <Disp size={84} color={BLUE}>
          {pct.toFixed(1) + "%"}
        </Disp>
      </div>
    </Shell>
  );
};

/* ================= S5 — THE CONTROL ================= */
const s5Beats = (fps: number) => ({ fair: wordAt(fps, "s5", "fair", 0.72), replaces: wordAt(fps, "s5", "replaces", 2.32), luck: wordAt(fps, "s5", "luck", 7.22), ind: wordAt(fps, "s5", "154", 9.78) - 30, pak: wordAt(fps, "s5", "72", 13.12) - 6 });
const BigCount: React.FC<{ x: number; at: number; value: number; of: number; color: string; team: string; who: string; actual: number }> = ({ x, at, value, of, color, team, who, actual }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + 24], [0, value], { easing: theme.ease.out, ...CLAMP });
  return (
    <div style={{ position: "absolute", left: x - 230, width: 460, top: 560, textAlign: "center", opacity: fade(frame, at - 4) }}>
      <Disp size={46} color={color}>
        {team}
      </Disp>
      <div style={{ marginTop: 6 }}>
        <Label size={18} color={C.mute}>
          {who}
        </Label>
      </div>
      <div style={{ marginTop: 18 }}>
        <Disp size={250} color={color}>
          {Math.round(v)}
        </Disp>
      </div>
      <Label size={26} color={C.ink2} weight={900}>
        {`wins of ${of}`}
      </Label>
      <div style={{ marginTop: 22, opacity: fade(frame, at + 30) }}>
        <Label size={18} color={C.mute}>{`Real life: ${actual}`}</Label>
      </div>
    </div>
  );
};
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const ci = data.control.India, cp = data.control.Pakistan;
  return (
    <Shell>
      <Kicker title="First, a fair test" sub="Each man replaces himself · 10,000 replays" subAt={b.replaces} />
      <div style={{ position: "absolute", left: 539, top: 560, width: 2, height: 560, background: C.line, opacity: fade(frame, b.ind) }} />
      <BigCount x={290} at={b.ind} value={Math.round(ci.base)} of={ci.matches} color={BLUE} team="India" who="Kohli replaying himself" actual={ci.actual} />
      <BigCount x={790} at={b.pak} value={Math.round(cp.base)} of={cp.matches} color={GREEN} team="Pakistan" who="Babar replaying himself" actual={cp.actual} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", opacity: fade(frame, b.luck - 4) * (1 - fade(frame, b.ind - 6, 6)) }}>
        <Serif size={60} color={C.ink2}>
          Luck, taken out.
        </Serif>
      </div>
    </Shell>
  );
};

/* ================= S6 — THE SWAP (waffles) ================= */
const s6Beats = (fps: number) => ({ swap: wordAt(fps, "s6", "swap", 0.48), i95: wordAt(fps, "s6", "ninety", 3.44), chases: wordAt(fps, "s6", "chases", 7.04), pak: wordAt(fps, "s6", "pakistan", 7.6), p76: wordAt(fps, "s6", "seventy", 9.9), four: wordAt(fps, "s6", "four", 11.28), thirty: wordAt(fps, "s6", "thirty", 14.46) });
const Waffle: React.FC<{ n: number; cols: number; base: number; after: number; color: string; flipAt: number; x: number; y: number; inAt: number }> = ({ n, cols, base, after, color, flipAt, x, y, inAt }) => {
  const frame = useCurrentFrame();
  const cell = 24, gap = 5;
  const lo = Math.min(base, after), hi = Math.max(base, after);
  const flipping = (i: number) => i >= Math.floor(lo) && i < Math.ceil(hi);
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        const show = fade(frame, inAt + Math.floor(i / 6), 4);
        let fill = i < base ? 1 : 0;
        let ring = 0;
        if (flipping(i)) {
          const k = i - Math.floor(lo);
          const p = ease(frame, flipAt + k * 4, 8);
          const target = Math.max(0, Math.min(1, after - i));
          fill = fill + (target - fill) * p;
          ring = interpolate(frame, [flipAt + k * 4, flipAt + k * 4 + 6, flipAt + k * 4 + 40], [0, 1, 0.65], CLAMP);
        }
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c * (cell + gap),
              top: r * (cell + gap),
              width: cell,
              height: cell,
              borderRadius: 4,
              opacity: show,
              background: `linear-gradient(90deg, ${color} ${fill * 100}%, rgba(15,26,51,0.08) ${fill * 100}%)`,
              boxShadow: ring > 0 ? `0 0 0 ${2 + ring * 2}px ${C.red}` : `inset 0 0 0 1px ${C.line}`,
            }}
          />
        );
      })}
    </div>
  );
};
const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const ci = data.control.India, cp = data.control.Pakistan;
  const iv = interpolate(frame, [b.i95, b.i95 + 30], [Math.round(ci.base), ci.swap], { easing: theme.ease.out, ...CLAMP });
  const pv = interpolate(frame, [b.p76, b.p76 + 24], [Math.round(cp.base), cp.swap], { easing: theme.ease.out, ...CLAMP });
  const cols = 10;
  const side = (x: number, team: string, sub: string, color: string, v: number, eff: string, effAt: number, base: number, after: number, n: number, flipAt: number, inAt: number, note: string, noteAt: number) => (
    <>
      <div style={{ position: "absolute", left: x, width: 420, top: 360, opacity: fade(frame, inAt) }}>
        <Disp size={44} color={color}>
          {team}
        </Disp>
        <div>
          <Label size={18} color={C.mute}>
            {sub}
          </Label>
        </div>
        <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", gap: 14 }}>
          <Disp size={110} color={color}>
            {Number.isInteger(Math.round(v * 2) / 2) ? String(Math.round(v)) : (Math.round(v * 2) / 2).toFixed(1)}
          </Disp>
          <Label size={20} color={C.ink2} weight={900}>{`wins of ${n}`}</Label>
        </div>
      </div>
      <Waffle n={n} cols={cols} base={Math.round(base)} after={after} color={color} flipAt={flipAt} x={x} y={600} inAt={inAt} />
      <div style={{ position: "absolute", left: x, top: 600 + Math.ceil(n / cols) * 29 + 18, opacity: fade(frame, effAt) }}>
        <div style={{ display: "inline-block", background: color === BLUE ? C.red : GREEN, padding: "10px 20px 6px" }}>
          <Disp size={54} color={C.paperHi}>
            {eff}
          </Disp>
        </div>
        <div style={{ marginTop: 16, opacity: fade(frame, noteAt), width: 400 }}>
          <Label size={17} color={C.ink2}>
            {note}
          </Label>
        </div>
      </div>
    </>
  );
  return (
    <Shell>
      <Kicker title="Now, the swap" size={56} />
      {side(90, "India", "with Babar at No.3", BLUE, iv, `${ci.effect.toFixed(1)} wins`, b.i95 + 20, ci.base, ci.swap, ci.matches, b.i95 - 4, 4, `${(ci.chasing.swap - ci.chasing.base).toFixed(1)} of them chasing`, b.chases - 4)}
      {side(600, "Pakistan", "with Kohli at No.3", GREEN, pv, `+${cp.effect.toFixed(1)} wins`, b.p76 + 16, cp.base, cp.swap, cp.matches, b.p76 - 4, b.pak - 10, "≈ one extra win every 30 games", b.thirty - 6)}
    </Shell>
  );
};

/* ================= S7 — WHY SO FEW? (margin strip) ================= */
const s7Beats = (fps: number) => ({ dot: wordAt(fps, "s7", "dot", 3.48), margin: wordAt(fps, "s7", "margin", 5.66), n13: wordAt(fps, "s7", "13", 7.32), band: wordAt(fps, "s7", "band", 10.24), n44: wordAt(fps, "s7", "44", 11.66) });
const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const X0 = 110, X1 = 970, MAX = 240, BASE = 1110, DOT = 14, STEP = 16, BIN = 5;
  const X = (m: number) => X0 + ((X1 - X0) * m) / MAX;
  const bins: { m: number; t: string }[][] = [];
  [...data.margins].sort((p, q) => p.m - q.m).forEach((d) => {
    const k = Math.min(Math.floor(d.m / BIN), MAX / BIN - 1);
    (bins[k] = bins[k] || []).push(d);
  });
  const band = ease(frame, b.band - 8, 14);
  const close = Math.round(interpolate(frame, [b.n44 - 4, b.n44 + 16], [0, data.close13], { easing: theme.ease.out, ...CLAMP }));
  return (
    <Shell>
      <Kicker title="Why not more?" sub="Every dot is one match, placed by its winning margin" subAt={b.dot - 6} />
      {/* band */}
      <div style={{ position: "absolute", left: X0 - 4, top: 560, width: (X(13.1) - X0 + 4) * band, height: BASE - 560 + 4, background: "rgba(179,32,44,0.12)", borderRight: band > 0.95 ? `3px solid ${C.red}` : undefined }} />
      <div style={{ position: "absolute", left: X(13.1) + 18, top: 590, opacity: fade(frame, b.band - 2) }}>
        <Disp size={64} color={C.red}>
          13 runs
        </Disp>
        <div>
          <Label size={18} color={C.red}>
            Kohli's edge per innings
          </Label>
        </div>
      </div>
      {bins.map((col, k) =>
        (col || []).map((d, j) => {
          const at = b.dot + Math.floor(k * 0.9) + j;
          const inBand = d.m < 13.1;
          return (
            <div
              key={`${k}-${j}`}
              style={{
                position: "absolute",
                left: X(k * BIN) + 2,
                top: BASE - (j + 1) * STEP,
                width: DOT,
                height: DOT,
                borderRadius: DOT,
                background: d.t === "I" ? BLUE : GREEN,
                opacity: fade(frame, at, 4) * (band > 0.5 && !inBand ? 0.35 : 1),
              }}
            />
          );
        }),
      )}
      <div style={{ position: "absolute", left: X0, top: BASE + 8, width: X1 - X0, height: 2, background: C.ink }} />
      {[0, 50, 100, 150, 200].map((v) => (
        <div key={v} style={{ position: "absolute", left: X(v) - 30, width: 60, top: BASE + 20, textAlign: "center", opacity: fade(frame, b.dot) }}>
          <Label size={18} color={C.mute}>
            {v === 200 ? "200+" : String(v)}
          </Label>
        </div>
      ))}
      <div style={{ position: "absolute", left: X0, top: BASE + 56, opacity: fade(frame, b.dot) }}>
        <Label size={16} color={C.mute} weight={600}>
          Winning margin, in runs (chases converted from balls and wickets in hand)
        </Label>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1200, display: "flex", justifyContent: "center", gap: 40, opacity: fade(frame, b.n44 - 4) }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <Disp size={84} color={C.red}>
            {String(close)}
          </Disp>
          <Label size={24} color={C.ink2} weight={900}>
            {`of ${data.n_matches} games`}
          </Label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 16, height: 16, borderRadius: 16, background: BLUE }} />
          <Label size={18}>India</Label>
          <div style={{ width: 16, height: 16, borderRadius: 16, background: GREEN }} />
          <Label size={18}>Pakistan</Label>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S8 — SLIDING DOORS ================= */
const s8Beats = (fps: number) => ({ colombo: wordAt(fps, "s8", "colombo", 2.36) - 4, final: wordAt(fps, "s8", "final", 8.68), two: wordAt(fps, "s8", "two", 11.1), man: wordAt(fps, "s8", "manchester", 13.6) - 4, makes: wordAt(fps, "s8", "makes", 17.96), five: wordAt(fps, "s8", "five", 21.16) });
const Ticket: React.FC<{ at: number; top: number; kicker: string; title: string; lines: string[]; result: string; resultAt: number; meterLabel: string; p: number; meterAt: number; color: string }> = ({ at, top, kicker, title, lines, result, resultAt, meterLabel, p, meterAt, color }) => {
  const frame = useCurrentFrame();
  const pin = useP(at, theme.spring.smooth);
  const pct = interpolate(frame, [meterAt, meterAt + 24], [0, p * 100], { easing: theme.ease.out, ...CLAMP });
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top, background: C.paperHi, boxShadow: "0 22px 46px rgba(40,30,10,0.18)", borderLeft: `14px solid ${color}`, padding: "24px 36px 26px", opacity: interpolate(pin, [0, 0.3], [0, 1], CLAMP), transform: `translateY(${interpolate(pin, [0, 1], [60, 0])}px) rotate(${interpolate(pin, [0, 1], [-2, -0.6])}deg)` }}>
      <Label size={18} color={C.mute}>
        {kicker}
      </Label>
      <div style={{ marginTop: 4 }}>
        <Disp size={70}>{title}</Disp>
      </div>
      {lines.map((l) => (
        <div key={l} style={{ marginTop: 6 }}>
          <Label size={22} color={C.ink2} weight={800} spacing="0.06em">
            {l}
          </Label>
        </div>
      ))}
      <div style={{ marginTop: 10, opacity: fade(frame, resultAt) }}>
        <Serif size={36} color={C.red}>
          {result}
        </Serif>
      </div>
      <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 24, opacity: fade(frame, meterAt - 4) }}>
        <div style={{ flex: 1 }}>
          <Label size={20} color={color} weight={900}>
            {meterLabel}
          </Label>
          <div style={{ position: "relative", height: 24, background: C.line, marginTop: 8 }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: color }} />
          </div>
        </div>
        <Disp size={92} color={color}>
          {Math.round(pct) + "%"}
        </Disp>
      </div>
    </div>
  );
};
const S8: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  const co = data.doors.colombo, ma = data.doors.manchester;
  return (
    <Shell>
      <Kicker title="Sliding doors" sub="Real result · and the replay" subAt={b.colombo} />
      <Ticket at={b.colombo} top={370} kicker="Asia Cup 2023 · Super Four · Colombo" title="Pakistan v Sri Lanka" lines={["Pakistan 252/7 · Sri Lanka 252/8 (42 overs)", "Babar 29 (35)"]} result="Sri Lanka win off the last ball. Pakistan miss the final." resultAt={b.final - 10} meterLabel="Pakistan win, with Kohli" p={co.p_swap} meterAt={b.two - 6} color={GREEN} />
      <Ticket at={b.man} top={800} kicker="World Cup 2019 · Semi-final · Manchester" title="India v New Zealand" lines={["New Zealand 239/8 · India 221 (49.3 overs)", "Kohli 1 (6)"]} result="New Zealand win by 18 runs." resultAt={b.makes} meterLabel="India win, with Babar" p={ma.p_swap} meterAt={b.five - 10} color={BLUE} />
    </Shell>
  );
};

/* ================= S9 — THE RIVALRY ================= */
const s9Beats = (fps: number) => ({ six: wordAt(fps, "s9", "six", 3.06) - 10, five: wordAt(fps, "s9", "five", 4.78), swapped: wordAt(fps, "s9", "swapped", 5.76), still: wordAt(fps, "s9", "still", 6.84), rivalry: wordAt(fps, "s9", "rivalry", 8.7) });
const H2H_NAMES = ["Champions Trophy 2017 · Birmingham", "Champions Trophy 2017 Final · The Oval", "World Cup 2019 · Manchester", "Asia Cup 2023 · Colombo", "World Cup 2023 · Ahmedabad", "Champions Trophy 2025 · Dubai"];
const S9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s9Beats(fps);
  const swapTot = data.h2h.reduce((s, r) => s + r.p_swap, 0);
  return (
    <Shell>
      <Kicker title="India v Pakistan" sub="The six ODIs both men played" subAt={b.six} />
      <div style={{ position: "absolute", left: 70, right: 70, top: 400, display: "flex", justifyContent: "space-between", opacity: fade(frame, b.six) }}>
        <Label size={16} color={C.mute}>
          Match
        </Label>
        <div style={{ display: "flex", gap: 60 }}>
          <Label size={16} color={C.mute}>
            Real winner
          </Label>
          <div style={{ width: 230, textAlign: "right" }}>
            <Label size={16} color={C.mute}>
              India win, swapped
            </Label>
          </div>
        </div>
      </div>
      {data.h2h.map((r, i) => {
        const at = b.six + i * 4;
        const sw = ease(frame, b.swapped + i * 3, 16);
        const ind = r.result === "W";
        return (
          <div key={r.date} style={{ position: "absolute", left: 70, right: 70, top: 440 + i * 112, height: 100, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: fade(frame, at) }}>
            <div style={{ width: 400 }}>
              <Label size={20} color={C.ink} weight={900} spacing="0.06em">
                {H2H_NAMES[i]}
              </Label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
              <span style={{ background: ind ? BLUE : GREEN, padding: "6px 14px 6px", width: 100, textAlign: "center" }}>
                <Label size={18} color={C.paperHi} weight={900}>
                  {ind ? "India" : "Pakistan"}
                </Label>
              </span>
              <div style={{ width: 230, display: "flex", alignItems: "center", gap: 14, opacity: fade(frame, b.swapped + i * 3) }}>
                <div style={{ position: "relative", flex: 1, height: 18, background: C.greenSoft }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${r.p_swap * 100 * sw}%`, background: BLUE }} />
                </div>
                <div style={{ width: 92, textAlign: "right" }}>
                  <Disp size={44} color={r.p_swap > 0.5 ? BLUE : GREEN}>
                    {Math.round(r.p_swap * 100 * sw) + "%"}
                  </Disp>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1130, display: "flex", justifyContent: "center", gap: 60, opacity: fade(frame, b.still) }}>
        <div style={{ textAlign: "center" }}>
          <Label size={18} color={C.mute}>
            Real
          </Label>
          <div>
            <Disp size={70} color={BLUE}>
              India 5–1
            </Disp>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <Label size={18} color={C.mute}>
            Swapped
          </Label>
          <div>
            <Disp size={70} color={BLUE}>{`India ${swapTot.toFixed(1)}–${(data.h2h.length - swapTot).toFixed(1)}`}</Disp>
          </div>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S10 — THE VERDICT ================= */
const s10Beats = (fps: number) => ({ verdict: wordAt(fps, "s10", "verdict", 0.38), five: wordAt(fps, "s10", "five", 3.84), chase: wordAt(fps, "s10", "chase", 8.2), shirts: wordAt(fps, "s10", "shirts", 9.88), narrows: wordAt(fps, "s10", "narrows", 11.76), brand: sentence(fps, "s10", 3).from - 6 });
const S10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s10Beats(fps);
  const pin = spring({ frame: frame - 4, fps, config: theme.spring.smooth });
  const ci = data.control.India, cp = data.control.Pakistan;
  const out = fade(frame, b.brand - 8, 8);
  return (
    <Shell exit={false} drift={0.02}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 252, textAlign: "center", opacity: fade(frame, 2) }}>
        <Label size={22} color={C.red} spacing="0.3em">
          The verdict
        </Label>
      </div>
      {/* the swapped pair: Babar in India's frame, Kohli in Pakistan's */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: interpolate(pin, [0, 0.3], [0, 1], CLAMP), transform: `translateY(${interpolate(pin, [0, 1], [80, 0])}px)` }}>
        <div style={{ position: "absolute", left: 140, top: 330 }}>
          <Print src="babar-2020.jpg" pos="62% 35%" w={360} h={440} frame={BLUE} rotate={-4} />
        </div>
        <div style={{ position: "absolute", left: 580, top: 330 }}>
          <Print src="kohli-wc2015.jpg" pos="38% 30%" w={360} h={440} frame={GREEN} rotate={4} />
        </div>
        <div style={{ position: "absolute", left: 140, width: 360, top: 800, textAlign: "center" }}>
          <Label size={18} color={BLUE} weight={900}>
            Babar for India
          </Label>
        </div>
        <div style={{ position: "absolute", left: 580, width: 360, top: 800, textAlign: "center" }}>
          <Label size={18} color={GREEN} weight={900}>
            Kohli for Pakistan
          </Label>
        </div>
      </div>
      <Stamp text="+5 wins" sub="Kohli over Babar · a decade" at={b.five} x={318} y={845} rotate={-6} size={110} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1048, display: "flex", justifyContent: "center", gap: 50, opacity: fade(frame, b.five + 10) * (1 - out) }}>
        {[
          { v: ci.effect.toFixed(1), l: "India wins", c: BLUE },
          { v: "+" + cp.effect.toFixed(1), l: "Pakistan wins", c: GREEN },
          { v: `${(ci.chasing.swap - ci.chasing.base).toFixed(1)}`, l: "India, in chases", c: C.ink },
        ].map((s, i) => (
          <div key={s.l} style={{ textAlign: "center", opacity: fade(frame, b.five + 10 + i * 5) }}>
            <Disp size={84} color={s.c}>
              {s.v}
            </Disp>
            <div>
              <Label size={16} color={C.mute}>
                {s.l}
              </Label>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 1190, textAlign: "center", opacity: fade(frame, b.narrows - 6) * (1 - out) }}>
        <Serif size={60} weight={900}>
          The gap narrows.
          <br />
          <span style={{ color: C.red }}>It doesn't close.</span>
        </Serif>
      </div>
      <Brand at={b.brand + 2} top={1070} series={config.series} tagline={config.tagline} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 1290, textAlign: "center", opacity: fade(frame, b.brand + 6) }}>
        <Label size={13} color={C.mute} weight={600} spacing="0.06em">
          {CREDIT}
        </Label>
      </div>
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
    ["s10", S10],
  ] as [string, React.FC][],
  warmFrom: (fps: number) => totalFrames(fps) + 1000, // no tint: the blue accent would grey the paper
  mastheadOffAt: (fps: number) => scene(fps, "s10").from + s10Beats(fps).brand,
  captionsOffFrom: (fps: number) => scene(fps, "s10").from + sentence(fps, "s10", 3).from - 2,
  sfx: (fps: number): Cue[] => {
    const S = (id: string) => scene(fps, id).from;
    const b1 = s1Beats(fps), b2 = s2Beats(fps), b3 = s3Beats(fps), b4 = s4Beats(fps), b5 = s5Beats(fps), b6 = s6Beats(fps), b7 = s7Beats(fps), b8 = s8Beats(fps), b9 = s9Beats(fps), b10 = s10Beats(fps);
    const c: Cue[] = [];
    const add = (id: string, at: number, file: string, volume: number) => c.push({ at: S(id) + at, file, volume });
    ["s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"].forEach((id) => c.push({ at: S(id) - 9, file: "swoosh.wav", volume: 0.26 }));
    // s1
    add("s1", b1.n18, "pen.wav", 0.35);
    add("s1", b1.n56, "pen.wav", 0.3);
    add("s1", b1.kohli, "pop.wav", 0.3);
    add("s1", b1.babar, "pop.wav", 0.3);
    add("s1", b1.swap - 4, "whip.wav", 0.4);
    add("s1", b1.swap + 2, "swoosh.wav", 0.35);
    add("s1", b1.swap + 24, "impact.wav", 0.55);
    add("s1", b1.tenk - 4, "ticks.wav", 0.3);
    add("s1", b1.title - 2, "slam.wav", 0.55);
    add("s1", b1.title - 2, "impact.wav", 0.45);
    // s2
    [6, b2.avg - 6, b2.h - 4, b2.faster - 8].forEach((x) => add("s2", x, "pop.wav", 0.22));
    add("s2", b2.n13 - 2, "slam.wav", 0.5);
    // s3
    [b3.k63 - 4, b3.b56 - 4].forEach((x) => add("s3", x, "pop.wav", 0.26));
    add("s3", b3.k68 - 6, "rise.wav", 0.22);
    add("s3", b3.k68 + 8, "pop.wav", 0.3);
    add("s3", b3.b49 + 8, "pop.wav", 0.3);
    // s4
    add("s4", b4.card, "pop.wav", 0.25);
    add("s4", b4.k154 - 2, "slam.wav", 0.4);
    add("s4", b4.take, "pen.wav", 0.4);
    add("s4", b4.drop, "ticks.wav", 0.32);
    add("s4", b4.land - 2, "pop.wav", 0.4);
    add("s4", b4.mates, "pop.wav", 0.25);
    add("s4", b4.result - 2, "impact.wav", 0.5);
    add("s4", b4.tenk, "ticks.wav", 0.3);
    add("s4", b4.twice - 2, "slam.wav", 0.35);
    // s5
    add("s5", b5.ind - 2, "slam.wav", 0.4);
    add("s5", b5.pak - 2, "slam.wav", 0.4);
    // s6
    add("s6", b6.i95 - 4, "crack.wav", 0.35);
    add("s6", b6.i95 + 18, "impact.wav", 0.45);
    add("s6", b6.p76 - 4, "rise.wav", 0.25);
    add("s6", b6.p76 + 14, "impact.wav", 0.45);
    // s7
    add("s7", b7.dot, "ticks.wav", 0.28);
    add("s7", b7.band - 8, "pen.wav", 0.35);
    add("s7", b7.n44 - 2, "slam.wav", 0.4);
    // s8
    add("s8", b8.colombo, "pop.wav", 0.3);
    add("s8", b8.two - 6, "rise.wav", 0.25);
    add("s8", b8.two + 16, "impact.wav", 0.4);
    add("s8", b8.man, "pop.wav", 0.3);
    add("s8", b8.five - 10, "rise.wav", 0.22);
    add("s8", b8.five + 12, "impact.wav", 0.35);
    // s9
    for (let i = 0; i < 6; i++) add("s9", b9.six + i * 4, "pop.wav", 0.16);
    add("s9", b9.swapped, "ticks.wav", 0.22);
    add("s9", b9.still - 2, "slam.wav", 0.4);
    // s10
    add("s10", 6, "swoosh.wav", 0.22);
    add("s10", b10.five - 2, "slam.wav", 0.55);
    add("s10", b10.five - 2, "impact.wav", 0.55);
    add("s10", b10.five, "crowd.wav", 0.18);
    c.push({ at: totalFrames(fps) - Math.round(fps * 1.2), file: "pen.wav", volume: 0.3 });
    return c;
  },
};
