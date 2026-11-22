// The No.3 File — Devdutt Padikkal. Seven scenes, editorial style, timed to the narration.
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Big3, CLAMP, Cutout, Disp, fade, Label, Seam, Serif, Shell, useP } from "../components/Ed";
import { theme } from "../theme";
import { sentence, voStart, wordAt } from "../timing";

const C = theme.colors;
const fmt = (n: number) => n.toLocaleString("en-US");

/* ================= S1 — THE REVOLVING DOOR ================= */
export const s1Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s1", i));
  const door = wordAt(fps, "s1", "revolving", 4.92), then = s[2].from;
  const doorStart = door - 6, per = Math.max(10, Math.floor((then - 4 - doorStart) / DOOR.length));
  return { v: voStart(fps, "s1"), door, doorStart, per, seven: s[1].from, years: wordAt(fps, "s1", "three", 7.36), then, walked: wordAt(fps, "s1", "walked", 9.84) };
};
const DOOR = ["SHUBMAN GILL", "VIRAT KOHLI", "KL RAHUL", "KARUN NAIR", "SAI SUDHARSAN", "WASHINGTON SUNDAR", "SHUBMAN GILL", "SAI SUDHARSAN"];

export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const draw = theme.ease.inOut(interpolate(frame, [2, 50], [0, 1], CLAMP));
  const fill = interpolate(frame, [b.then - 2, b.then + 14], [0, 1], { easing: theme.ease.out, ...CLAMP });
  // first Pujara, steady; then on "revolving" the door spins: a name every ~18 frames on a vertical axis
  const { doorStart, per } = b;
  const pre = frame < doorStart;
  const k = Math.floor((frame - doorStart) / per);
  const local = ((frame - doorStart) % per) / per;
  const showDoor = frame >= 14 && frame < b.then - 4;
  const name = pre ? "CHETESHWAR PUJARA" : DOOR[Math.max(0, Math.min(DOOR.length - 1, k))];
  const rot = pre ? interpolate(frame, [14, 22, doorStart - 6, doorStart], [-80, 0, 0, 80], CLAMP) : interpolate(local, [0, 0.25, 0.75, 1], [-80, 0, 0, 80]);
  const tally = Math.min(7, Math.max(0, Math.floor((frame - b.seven) / 3)));
  const lock = useP(b.then + 4, theme.spring.heavy);
  return (
    <Shell enter={false}>
      <Big3 x={183} y={250} size={1150} draw={draw} fill={fill * 0.92} fillColor={C.saffron} />
      {showDoor && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center", perspective: 900 }}>
          <div style={{ transform: `rotateY(${rot}deg)`, opacity: interpolate(Math.abs(rot), [0, 80], [1, 0]), background: C.paper, padding: "14px 30px 6px", boxShadow: "0 18px 40px rgba(40,30,10,0.18)" }}>
            <Disp size={name.length > 14 ? 92 : 110}>{name}</Disp>
            {pre && (
              <div style={{ textAlign: "center", paddingBottom: 8 }}>
                <Label size={20} color={C.red}>
                  Last Test · June 2023
                </Label>
              </div>
            )}
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, opacity: fade(frame, b.seven - 2) * (1 - fade(frame, b.then - 4, 6)) }}>
        <div style={{ display: "flex", gap: 10 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ width: 8, height: 70, background: i < tally ? C.ink : C.line, transform: i === 4 || i === 6 ? "rotate(18deg)" : undefined }} />
          ))}
        </div>
        <Label size={40} color={C.ink} weight={900}>
          7 batters
        </Label>
        <Serif size={44} color={C.saffron} style={{ opacity: fade(frame, b.years - 2) }}>
          3 years
        </Serif>
      </div>
      {/* the answer */}
      <Cutout src="pad-arms-wide-cut.png" x={222} y={340} h={980} at={b.then + 2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 236, textAlign: "center", opacity: interpolate(lock, [0, 0.3], [0, 1], CLAMP), transform: `translateY(${interpolate(lock, [0, 1], [-30, 0])}px)` }}>
        <Disp size={104}>Devdutt Padikkal</Disp>
        <div style={{ marginTop: 10 }}>
          <span style={{ background: C.ink, padding: "4px 22px 10px" }}>
            <Serif size={44} color={C.paperHi} weight={900}>
              India's new No.3
            </Serif>
          </span>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S2 — THREE SCORES ================= */
export const s2Beats = (fps: number) => ({ intro: sentence(fps, "s2", 0).from, a: wordAt(fps, "s2", "167", 2.86), b: wordAt(fps, "s2", "117", 4.84), c: wordAt(fps, "s2", "80", 5.62) });

const Slam: React.FC<{ text: string; at: number; color?: string; size?: number }> = ({ text, at, color = C.ink, size = 300 }) => {
  const frame = useCurrentFrame();
  const p = useP(at, { damping: 12, stiffness: 260, mass: 0.7 });
  if (frame < at - 1) return null;
  return (
    <div style={{ transform: `scale(${interpolate(p, [0, 1], [1.5, 1])})`, transformOrigin: "0% 60%", opacity: interpolate(p, [0, 0.2], [0, 1], CLAMP) }}>
      <Disp size={size} color={color}>
        {text}
      </Disp>
    </div>
  );
};

export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const rows = [
    { t: "167", w: "GALLE · AUG 2026", at: b.a - 2, c: C.ink },
    { t: "117", w: "COLOMBO · AUG 2026", at: b.b - 2, c: C.ink },
    { t: "80", w: "WELLINGTON · NOV 2026", at: b.c - 2, c: C.saffron },
  ];
  return (
    <Shell>
      <div style={{ position: "absolute", left: 70, top: 250 }}>
        <Serif size={52}>His last three first innings</Serif>
      </div>
      <Cutout src="pad-raise-bat-trees-cut.png" x={600} y={330} h={1000} at={2} from="right" fadeBottom={0.8} />
      <div style={{ position: "absolute", left: 70, top: 360, display: "flex", flexDirection: "column", gap: 18 }}>
        {rows.map((r) => (
          <div key={r.t} style={{ height: 300 }}>
            <Slam text={r.t} at={r.at} color={r.c} size={280} />
            <div style={{ opacity: fade(frame, r.at + 4), marginTop: 4 }}>
              <Label size={24} color={C.ink2}>
                {r.w}
              </Label>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
};

/* ================= S3 — THE DOOR, IN NUMBERS ================= */
export const s3Beats = (fps: number) => {
  const s = [0, 1].map((i) => sentence(fps, "s3", i));
  return { gill: wordAt(fps, "s3", "37", 1.84), sai: wordAt(fps, "s3", "32", 5.1), nair: wordAt(fps, "s3", "28", 6.94), pad: wordAt(fps, "s3", "72", 8.48), puj: wordAt(fps, "s3", "pajara", 10.04, 1), n44: wordAt(fps, "s3", "44", 12.0), s1: s[1].from };
};

export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  const X0 = 360, X1 = 870, MAX = 80;
  const X = (v: number) => X0 + ((X1 - X0) * v) / MAX;
  const rows = [
    { n: "SHUBMAN GILL", s: "29 INNINGS", v: 37.4, at: b.gill - 6, big: true },
    { n: "SAI SUDHARSAN", s: "12 INNINGS", v: 31.9, at: b.sai - 6, big: true },
    { n: "KARUN NAIR", s: "4 INNINGS", v: 27.8, at: b.nair - 6, big: true },
    { n: "VIRAT KOHLI", s: "2 INNINGS", v: 35.0, at: b.nair + 4 },
    { n: "WASHINGTON SUNDAR", s: "2 INNINGS", v: 30.0, at: b.nair + 8 },
    { n: "KL RAHUL", s: "2 INNINGS", v: 12.0, at: b.nair + 12 },
    { n: "DEVDUTT PADIKKAL", s: "6 INNINGS", v: 72.2, at: b.pad - 6, pick: true },
  ];
  const pj = fade(frame, b.puj, 12);
  return (
    <Shell>
      <div style={{ position: "absolute", left: 70, top: 248 }}>
        <Serif size={54}>The revolving door, in numbers</Serif>
        <div style={{ marginTop: 10 }}>
          <Label size={22}>Test average at No.3 · June 2023 – Nov 2026</Label>
        </div>
      </div>
      {/* axis */}
      <div style={{ position: "absolute", left: X0, top: 400, width: X1 - X0, height: 820, borderLeft: `2px solid ${C.ink}` }} />
      {[20, 40, 60, 80].map((v) => (
        <div key={v} style={{ position: "absolute", left: X(v), top: 400, height: 820, borderLeft: `1px solid ${C.line}` }}>
          <div style={{ position: "absolute", top: 828, left: -18 }}>
            <Label size={18} color={C.mute}>
              {String(v)}
            </Label>
          </div>
        </div>
      ))}
      {/* Pujara benchmark */}
      <div style={{ position: "absolute", left: X(44.4), top: 392, height: 836, borderLeft: `3px dashed ${C.red}`, opacity: pj }} />
      <div style={{ position: "absolute", right: 1080 - X(44.4) + 12, top: 362, opacity: pj, textAlign: "right" }}>
        <Label size={20} color={C.red} weight={900}>
          Pujara's career at No.3 · 44.4
        </Label>
      </div>
      <div style={{ position: "absolute", left: 70, top: 420, width: 940, display: "flex", flexDirection: "column", gap: 0 }}>
        {rows.map((r) => {
          const p = theme.ease.out(interpolate(frame, [r.at, r.at + 16], [0, 1], CLAMP));
          const v = r.v * p;
          const col = r.pick ? C.saffron : r.big ? C.ink : C.mute;
          return (
            <div key={r.n} style={{ position: "relative", height: 114, opacity: interpolate(p, [0, 0.15], [0.12, 1], CLAMP) }}>
              <div style={{ position: "absolute", left: 0, top: 26, width: 280 }}>
                <Label size={r.pick ? 26 : 22} color={col} weight={900} spacing="0.06em">
                  {r.n}
                </Label>
                <div>
                  <Label size={15} color={C.mute}>
                    {r.s}
                  </Label>
                </div>
              </div>
              <div style={{ position: "absolute", left: X0 - 70, top: 44, width: X(v) - X0, height: r.pick ? 8 : 4, background: col }} />
              <div style={{ position: "absolute", left: X(v) - 70 - (r.pick ? 18 : 11), top: 44 - (r.pick ? 14 : 9) + (r.pick ? 4 : 2), width: r.pick ? 36 : 22, height: r.pick ? 36 : 22, borderRadius: 40, background: col, boxShadow: r.pick ? `0 0 0 8px ${C.saffronSoft}` : undefined }} />
              <div style={{ position: "absolute", left: X(v) - 70 + (r.pick ? 30 : 20), top: r.pick ? 8 : 22 }}>
                <Disp size={r.pick ? 84 : 44} color={col}>
                  {v.toFixed(1)}
                </Disp>
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
};

/* ================= S4 — THE ROAD ================= */
export const s4Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s4", i));
  return {
    debut: wordAt(fps, "s4", "65", 1.64),
    perth: wordAt(fps, "s4", "duck", 3.72),
    gap: wordAt(fps, "s4", "21", 5.16),
    galle: wordAt(fps, "s4", "167", 8.98),
    returned: s[1].from,
    colombo: wordAt(fps, "s4", "117", 13.58),
    well: wordAt(fps, "s4", "80", 17.86),
    wadekar: wordAt(fps, "s4", "ajit", 22.24),
  };
};

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const ST = [
    { x: 260, n: "65", d: "MAR 2024", w: "DHARAMSALA", note: "DEBUT · AT No.4", at: b.debut - 4, c: C.ink },
    { x: 640, n: "0", d: "NOV 2024", w: "PERTH", note: "THEN 25 · HAZLEWOOD TWICE", at: b.perth - 4, c: C.red },
    { x: 1500, n: "167", d: "AUG 2026", w: "GALLE", note: "FIRST TEST HUNDRED", at: b.galle - 4, c: C.saffron },
    { x: 1900, n: "117", d: "AUG 2026", w: "COLOMBO", note: "BACK-TO-BACK", at: b.colombo - 4, c: C.saffron },
    { x: 2300, n: "80", d: "NOV 2026", w: "WELLINGTON", note: "ONLY WADEKAR MORE AT No.3", at: b.well - 4, c: C.ink },
  ];
  const keys = [
    { t: 0, x: 260 },
    { t: b.perth - 6, x: 640 },
    { t: b.gap, x: 1070 },
    { t: b.galle - 8, x: 1500 },
    { t: b.colombo - 8, x: 1900 },
    { t: b.well - 8, x: 2300 },
  ];
  let camX = keys[0].x;
  for (let i = 0; i < keys.length - 1; i++) {
    if (frame >= keys[i].t) camX = interpolate(frame, [keys[i + 1].t - 14, keys[i + 1].t], [keys[i].x, keys[i + 1].x], { easing: theme.ease.inOut, ...CLAMP });
  }
  const shift = 540 - camX;
  const SY = 1070;
  const wadekar = fade(frame, b.wadekar - 4);
  return (
    <Shell drift={0}>
      <div style={{ position: "absolute", left: 70, top: 248, opacity: 1 - fade(frame, b.galle - 20, 10) }}>
        <Serif size={56}>It wasn't a straight road</Serif>
      </div>
      {/* photos: Galle, then the run */}
      <div style={{ opacity: 1 - fade(frame, b.perth - 8, 8) }}>
        <Cutout src="pad-bat-helmet-cut.png" x={292} y={330} h={460} at={b.debut - 8} fadeBottom={0.82} />
      </div>
      <div style={{ opacity: 1 - fade(frame, b.colombo - 10, 10) }}>
        <Cutout src="pad-celebrate-boards-cut.png" x={230} y={260} h={560} at={b.galle - 10} fadeBottom={0.82} />
      </div>
      <Cutout src="pad-running-cut.png" x={310} y={250} h={580} at={b.colombo - 10} fadeBottom={0.85} />
      <div style={{ position: "absolute", left: shift, top: 0, width: 2600, height: 1920 }}>
        <Seam x={0} y={SY} w={2600} dotted={[860, 1290]} />
        <div style={{ position: "absolute", left: 860, top: SY - 92, width: 430, textAlign: "center", opacity: fade(frame, b.gap - 4) }}>
          <Serif size={50} color={C.ink2}>
            21 months away
          </Serif>
        </div>
        {ST.map((s) => {
          const p = useP(s.at);
          const lit = frame >= s.at;
          return (
            <div key={s.w} style={{ position: "absolute", left: s.x - 200, top: SY - 270, width: 400, display: "flex", flexDirection: "column", alignItems: "center", opacity: lit ? interpolate(p, [0, 0.3], [0, 1], CLAMP) : 0.12 }}>
              <div style={{ transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)` }}>
                <Disp size={210} color={s.c}>
                  {s.n}
                </Disp>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: 22, background: s.c, marginTop: 10, boxShadow: `0 0 0 6px ${C.paper}` }} />
              <div style={{ marginTop: 26, textAlign: "center", display: "flex", flexDirection: "column", gap: 6 }}>
                <Label size={20} color={C.mute}>
                  {s.d}
                </Label>
                <Disp size={50}>{s.w}</Disp>
                <Label size={16} color={s.c === C.ink ? C.ink2 : s.c}>
                  {s.note}
                </Label>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1270, textAlign: "center", opacity: wadekar }}>
        <Label size={20} color={C.ink2}>
          India at No.3 at the Basin Reserve: Wadekar 143 (1968) · Padikkal 80 (2026)
        </Label>
      </div>
    </Shell>
  );
};

/* ================= S5 — MEASURED IN TIME ================= */
export const s5Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s5", i));
  return { time: s[0].from, dot: s[1].from, puj: wordAt(fps, "s5", "101", 6.34), oth: wordAt(fps, "s5", "61", 9.4), pad: wordAt(fps, "s5", "128", 11.32), faster: wordAt(fps, "s5", "faster", 13.4) };
};

const DotCol: React.FC<{ n: number; at: number; color: string; x: number; label: string; sub: string; big?: boolean }> = ({ n, at, color, x, label, sub, big }) => {
  const frame = useCurrentFrame();
  const per = 8, d = 22, g = 6;
  const rows = Math.ceil(n / per);
  const BOTTOM = 1130;
  const shown = Math.floor(interpolate(frame, [at, at + 26], [0, n], { easing: theme.ease.out, ...CLAMP }));
  const w = per * (d + g) - g;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: 0, width: w }}>
      <div style={{ position: "absolute", left: 0, top: BOTTOM - rows * (d + g) - 110, width: w, textAlign: "center", opacity: fade(frame, at) }}>
        <Disp size={big ? 110 : 84} color={color}>
          {String(shown)}
        </Disp>
      </div>
      {Array.from({ length: n }).map((_, i) => {
        const r = Math.floor(i / per), c = i % per;
        return <div key={i} style={{ position: "absolute", left: c * (d + g), top: BOTTOM - (r + 1) * (d + g), width: d, height: d, borderRadius: d, background: i < shown ? color : "transparent", boxShadow: i < shown ? undefined : `inset 0 0 0 1.5px ${C.line}` }} />;
      })}
      <div style={{ position: "absolute", left: -40, width: w + 80, top: BOTTOM + 20, textAlign: "center", display: "flex", flexDirection: "column", gap: 4, opacity: fade(frame, at - 6) }}>
        <Disp size={44} color={big ? C.saffron : C.ink}>
          {label}
        </Disp>
        <Label size={16} color={C.mute}>
          {sub}
        </Label>
      </div>
    </div>
  );
};

export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  return (
    <Shell>
      <div style={{ position: "absolute", left: 70, top: 248 }}>
        <Serif size={60}>Measured in time</Serif>
        <div style={{ marginTop: 10, opacity: fade(frame, b.dot) }}>
          <Label size={22}>One dot = one ball faced per dismissal, at No.3</Label>
        </div>
      </div>
      <DotCol n={101} at={b.puj - 8} color={C.ink} x={200} label="PUJARA" sub="CAREER" />
      <DotCol n={61} at={b.oth - 8} color={C.mute} x={540} label="THE OTHERS" sub="No.3s SINCE 2023" />
      <DotCol n={128} at={b.pad - 8} color={C.saffron} x={880} label="PADIKKAL" sub="AT No.3" big />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1236, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 22, opacity: fade(frame, b.faster - 8) }}>
        <Label size={22} color={C.ink2}>
          Strike rate
        </Label>
        <Disp size={56} color={C.ink}>
          43.9
        </Disp>
        <Label size={22} color={C.ink2}>
          Pujara
        </Label>
        <Serif size={40} color={C.mute}>
          vs
        </Serif>
        <Disp size={56} color={C.saffron}>
          56.5
        </Disp>
        <Label size={22} color={C.saffron}>
          Padikkal
        </Label>
      </div>
    </Shell>
  );
};

/* ================= S6 — THE MIRROR ================= */
export const s6Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s6", i));
  return { sai: s[0].from, fc: s[1].from, forties: wordAt(fps, "s6", "40s", 7.0), tens: wordAt(fps, "s6", "10", 7.9), tests: s[2].from, breaks: wordAt(fps, "s6", "breaks", 10.5), n71: wordAt(fps, "s6", "71", 11.54), none: wordAt(fps, "s6", "none", 14.58), young: s[3].from };
};

const Fly: React.FC<{ label: string; a: number; b: number; max: number; at: number; fmtA: string; fmtB: string; winA?: boolean }> = ({ label, a, b, max, at, fmtA, fmtB, winA }) => {
  const frame = useCurrentFrame();
  const p = theme.ease.out(interpolate(frame, [at, at + 18], [0, 1], CLAMP));
  const W = 270;
  return (
    <div style={{ position: "relative", height: 92, opacity: interpolate(p, [0, 0.15], [0.12, 1], CLAMP) }}>
      <div style={{ position: "absolute", left: 540 - 120 - W * (a / max) * p, top: 26, width: W * (a / max) * p, height: 40, background: C.saffron }} />
      <div style={{ position: "absolute", left: 540 + 120, top: 26, width: W * (b / max) * p, height: 40, background: winA ? C.mute : C.ink }} />
      <div style={{ position: "absolute", right: 1080 - (540 - 120 - W * (a / max) * p - 12), top: 10, textAlign: "right" }}>
        <Disp size={64} color={C.saffron}>
          {fmtA}
        </Disp>
      </div>
      <div style={{ position: "absolute", left: 540 + 130 + W * (b / max) * p, top: 10, width: 160 }}>
        <Disp size={64} color={winA ? C.mute : C.ink}>
          {fmtB}
        </Disp>
      </div>
      <div style={{ position: "absolute", left: 540 - 116, width: 232, top: 32, textAlign: "center" }}>
        <Label size={17} color={C.ink2}>
          {label}
        </Label>
      </div>
    </div>
  );
};

export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const crack = interpolate(frame, [b.breaks - 4, b.breaks + 8], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const pts = Array.from({ length: 19 }, (_, i) => `${i * 60},${i % 2 ? 6 : -6}`).join(" ");
  return (
    <Shell>
      <div style={{ position: "absolute", left: 60, right: 60, top: 250, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Disp size={86} color={C.saffron}>
          Padikkal
        </Disp>
        <Serif size={44} color={C.mute}>
          vs
        </Serif>
        <Disp size={86}>Sai Sudharsan</Disp>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", opacity: fade(frame, b.fc - 4) }}>
        <Serif size={48}>First-class: mirror images</Serif>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 450 }}>
        <Fly label="AVERAGE" a={44.6} b={42.9} max={75} at={b.forties - 6} fmtA="44.6" fmtB="42.9" />
        <Fly label="HUNDREDS" a={10} b={10} max={12} at={b.tens - 4} fmtA="10" fmtB="10" />
        <Fly label="RUNS" a={4011} b={3004} max={5000} at={b.tens + 8} fmtA="4,011" fmtB="3,004" />
      </div>
      <svg width={1080} height={40} style={{ position: "absolute", left: 0, top: 750, overflow: "visible" }}>
        <polyline points={pts} transform="translate(0,20)" fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="1300" strokeDashoffset={1300 * (1 - crack)} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 810, textAlign: "center", opacity: fade(frame, b.tests) }}>
        <Serif size={48}>Tests: the mirror breaks</Serif>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 880 }}>
        <Fly label="AVERAGE" a={71.1} b={31.9} max={75} at={b.n71 - 6} fmtA="71.1" fmtB="31.9" winA />
        <Fly label="HUNDREDS" a={2} b={0} max={2.4} at={b.none - 10} fmtA="2" fmtB="0" winA />
        <Fly label="BALLS / DISMISSAL" a={124} b={71} max={135} at={b.none + 4} fmtA="124" fmtB="71" winA />
        <Fly label="BEST" a={167} b={87} max={180} at={b.none + 12} fmtA="167" fmtB="87" winA />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1262, textAlign: "center", opacity: fade(frame, b.young) }}>
        <Label size={15} color={C.mute} weight={600} spacing="0.08em">
          First-class: ESPNcricinfo via Wikipedia (Aug / Jul 2026) · Tests to 22 Nov 2026 · Sai's balls per dismissal from ball-by-ball innings
        </Label>
      </div>
    </Shell>
  );
};

/* ================= S7 — THE VERDICT ================= */
export const s7Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s7", i));
  return { small: s[0].from, every: wordAt(fps, "s7", "every", 2.48), found: s[1].from, three: wordAt(fps, "s7", "three", 8.1, 1), brand: s[2].from - 6 };
};

export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const fill = interpolate(frame, [2, 26], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const print = spring({ frame: frame - 6, fps, config: theme.spring.smooth });
  // the stamp falls and lands on "three"
  const st = interpolate(frame, [b.three - 7, b.three - 1], [0, 1], { easing: theme.ease.in, ...CLAMP });
  const settle = spring({ frame: frame - (b.three - 1), fps, config: { damping: 10, stiffness: 300, mass: 0.6 } });
  const brand = spring({ frame: frame - (b.brand + 2), fps, config: theme.spring.heavy });
  const statsOut = fade(frame, b.found - 6, 8);
  const PW = 900, PH = 524;
  return (
    <Shell exit={false} drift={0.025}>
      <Big3 x={199} y={196} size={1100} draw={1} fill={fill * 0.92} fillColor={C.saffron} />
      {/* the case file photo */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 384,
          width: PW,
          height: PH,
          background: C.paperHi,
          padding: 20,
          boxSizing: "border-box",
          boxShadow: "0 30px 60px rgba(40,30,10,0.32), 0 4px 10px rgba(40,30,10,0.18)",
          transform: `translateY(${interpolate(print, [0, 1], [120, 0])}px) rotate(${interpolate(print, [0, 1], [-10, -3])}deg)`,
          opacity: interpolate(print, [0, 0.25], [0, 1], CLAMP),
        }}
      >
        <Img src={staticFile("photos/pad-smile.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "40% 30%", display: "block" }} />
        <div style={{ position: "absolute", left: PW / 2 - 90, top: -22, width: 180, height: 46, background: "rgba(251,246,232,0.78)", transform: "rotate(3deg)", boxShadow: "0 2px 6px rgba(40,30,10,0.12)" }} />
        {/* stamp */}
        {frame >= b.three - 7 && (
          <div
            style={{
              position: "absolute",
              left: 470,
              top: 296,
              transform: `rotate(-11deg) scale(${interpolate(st, [0, 1], [2.4, 1]) * interpolate(settle, [0, 1], [0.94, 1])})`,
              opacity: interpolate(st, [0, 0.4], [0, 0.92], CLAMP),
              border: `7px solid ${C.red}`,
              outline: `3px solid ${C.red}`,
              outlineOffset: 6,
              padding: "6px 26px 0",
              textAlign: "center",
              mixBlendMode: "multiply",
              background: "rgba(255,255,255,0.08)",
            }}
          >
            <Disp size={118} color={C.red}>
              Found
            </Disp>
            <div style={{ marginTop: -10, paddingBottom: 8 }}>
              <Label size={20} color={C.red} weight={900} spacing="0.3em">
                India's No.3
              </Label>
            </div>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1196, display: "flex", justifyContent: "center", gap: 40, opacity: fade(frame, b.small) * (1 - statsOut) }}>
        {[
          { v: "7", l: "INNINGS" },
          { v: "498", l: "RUNS" },
          { v: "71.1", l: "AVERAGE" },
          { v: "2", l: "HUNDREDS" },
        ].map((x, i) => (
          <div key={x.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: fade(frame, b.small + i * 5) }}>
            <Disp size={72} color={i >= 2 ? C.saffron : C.ink}>
              {x.v}
            </Disp>
            <Label size={16} color={C.mute}>
              {x.l}
            </Label>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 30, right: 30, top: 1206, textAlign: "center", opacity: statsOut * (1 - fade(frame, b.brand - 8, 8)) }}>
        <Serif size={66} weight={900}>
          India have found their <span style={{ color: C.saffron }}>No.3.</span>
        </Serif>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1196, textAlign: "center", opacity: interpolate(brand, [0, 0.3], [0, 1], CLAMP), transform: `translateY(${interpolate(brand, [0, 1], [24, 0])}px)` }}>
        <Label size={22} color={C.mute} spacing="0.3em">
          Stories told with data
        </Label>
        <div style={{ marginTop: 8 }}>
          <Disp size={92}>Beyond the Scoreboard</Disp>
        </div>
      </div>
    </Shell>
  );
};

export const fmtN = fmt;
