// 100 DAYS OF ML · DAY 1 — What is machine learning? Told in "The File" editorial template (from the Pant presenter reel):
// warm paper, navy ink, Anton headlines, Fraunces italic voice, ML blue as the one accent, the red seam as the thread,
// the illustrated host bottom-left. Same script and voice as the other Day 1 versions.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, Disp, fade, Label, Seam, Serif, Shell, useP } from "../components/Ed";
import { Cue } from "../components/Sound";
import { Crack, Kicker, Slam, Stamp, Tally } from "../components/Viz";
import { config } from "../config";
import { Bank, ChatBubble, Checkers, Clusters, Computer, Envelope, Flashcards, Gamepad, House, MapPin, Person, PhoneFace, PlayBtn, Robot, Trophy } from "../components/Doodles";
import { Cross, Layer } from "../components/NB";
import { theme } from "../theme";
import { scene, sentence, wordAt } from "../timing";

const C = theme.colors;
const ease = (f: number, a: number, len: number) => interpolate(f, [a, a + len], [0, 1], { easing: theme.ease.out, ...CLAMP });
const win = (f: number, a: number, b: number, len = 8) => fade(f, a, len) * (1 - fade(f, b - len, len));
const W = (id: string, p: string, fb: number, nth = 0) => (fps: number) => wordAt(fps, id, p, fb, nth);

// small helpers in the house style ---------------------------------------------------------------
const Rise: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; out?: number }> = ({ at, children, style, out }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, 12);
  const o = out === undefined ? 0 : fade(frame, out, 8);
  return <div style={{ opacity: p * (1 - o), transform: `translateY(${(1 - p) * 26}px)`, ...style }}>{children}</div>;
};
const Band: React.FC<{ at: number; color?: string; text: string; size?: number; out?: number }> = ({ at, color = C.ink, text, size = 46, out }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, 10);
  const o = out === undefined ? 0 : fade(frame, out, 8);
  return (
    <span style={{ display: "inline-block", background: color, padding: "4px 24px 12px", opacity: p * (1 - o), transform: `scaleX(${0.6 + 0.4 * p})`, transformOrigin: "0% 50%" }}>
      <Serif size={size} color={C.paperHi} weight={900}>
        {text}
      </Serif>
    </span>
  );
};
// a short red arrow on the seam (→), drawn on at `at`
const SeamArrow: React.FC<{ x: number; y: number; w: number; at: number; color?: string; down?: boolean }> = ({ x, y, w, at, color = C.red, down }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, 10);
  if (p <= 0) return null;
  const L = w * p;
  return (
    <svg width={down ? 40 : w + 30} height={down ? w + 30 : 40} style={{ position: "absolute", left: down ? x - 20 : x, top: down ? y : y - 20, overflow: "visible" }}>
      {down ? (
        <>
          <line x1={20} y1={0} x2={20} y2={L} stroke={color} strokeWidth={5} strokeLinecap="round" />
          {p > 0.8 ? <path d={`M8 ${L - 12} L20 ${L + 2} L32 ${L - 12}`} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
        </>
      ) : (
        <>
          <line x1={0} y1={20} x2={L} y2={20} stroke={color} strokeWidth={5} strokeLinecap="round" />
          {p > 0.8 ? <path d={`M${L - 12} 8 L${L + 2} 20 L${L - 12} 32`} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
        </>
      )}
    </svg>
  );
};
const InArrow: React.FC<{ color?: string; w?: number }> = ({ color = C.red, w = 64 }) => (
  <svg width={w} height={36} style={{ display: "inline-block", alignSelf: "center", overflow: "visible" }}>
    <line x1={2} y1={18} x2={w - 6} y2={18} stroke={color} strokeWidth={6} strokeLinecap="round" />
    <path d={`M${w - 20} 6 L${w - 4} 18 L${w - 20} 30`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Tick: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, 8);
  if (p <= 0) return null;
  return (
    <svg width={60} height={50} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
      <path d="M6 26 L22 42 L54 6" fill="none" stroke={C.red} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="90" strokeDashoffset={90 * (1 - p)} />
    </svg>
  );
};
const Print: React.FC<{ x: number; y: number; w: number; h: number; at: number; tilt?: number; children: React.ReactNode }> = ({ x, y, w, h, at, tilt = -2, children }) => {
  const p = useP(at, theme.spring.smooth);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: C.paperHi, boxShadow: "0 24px 50px rgba(40,30,10,0.25), 0 3px 8px rgba(40,30,10,0.15)", transform: `translateY(${(1 - p) * 90}px) rotate(${tilt - (1 - p) * 5}deg)`, opacity: interpolate(p, [0, 0.25], [0, 1], CLAMP), padding: "26px 34px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", left: w / 2 - 80, top: -20, width: 160, height: 40, background: "rgba(251,246,232,0.8)", transform: "rotate(3deg)", boxShadow: "0 2px 6px rgba(40,30,10,0.12)" }} />
      {children}
    </div>
  );
};

/* ================= S1 — TITLE CARD FROM FRAME 0 ================= */
const s1B = (fps: number) => ({ rules: W("s1", "rules", 4.8)(fps), learns: W("s1", "learns", 6.8)(fps), three: W("s1", "three", 7.5)(fps), save: W("s1", "save", 8.7)(fps) });
const ITEMS = ["Rules vs learning", "How a machine learns", "The 3 types", "AI vs ML vs deep learning"];
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1B(fps);
  const ticks = [b.rules, b.learns, b.three, b.save - 6];
  return (
    <Shell enter={false}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 252, textAlign: "center", opacity: fade(frame, 0, 4) }}>
        <Label size={28} color={C.red} spacing="0.34em">
          Day 1 of 100
        </Label>
      </div>
      <div style={{ position: "absolute", left: 70, top: 312 }}>
        <Slam text="What is" at={0} size={150} />
      </div>
      <div style={{ position: "absolute", left: 70, top: 470 }}>
        <Slam text="Machine" at={3} size={196} color={C.accent} />
      </div>
      <div style={{ position: "absolute", left: 70, top: 668 }}>
        <Slam text="Learning?" at={6} size={196} color={C.accent} />
      </div>
      <Layer>
        <Robot x={860} y={395} s={190} at={2} />
      </Layer>
      <Seam x={70} y={892} w={940} p={ease(frame, 6, 24)} />
      <div style={{ position: "absolute", left: 70, top: 918, opacity: fade(frame, 10, 6) }}>
        <Label size={22} color={C.ink2} spacing="0.3em">
          In this one
        </Label>
      </div>
      {ITEMS.map((t, i) => (
        <div key={t} style={{ position: "absolute", left: 70, top: 966 + i * 72, display: "flex", alignItems: "baseline", gap: 24, opacity: fade(frame, 12 + i * 4, 6), transform: `translateX(${(1 - ease(frame, 12 + i * 4, 10)) * -30}px)` }}>
          <Disp size={50} color={C.accent}>
            {`0${i + 1}`}
          </Disp>
          <Serif size={50} weight={700}>
            {t}
          </Serif>
        </div>
      ))}
      {ticks.map((t, i) => (
        <Tick key={i} x={930} y={970 + i * 72} at={t} />
      ))}
      <div style={{ position: "absolute", right: 70, top: 250, opacity: fade(frame, b.save - 4) }}>
        <Band at={b.save - 4} color={C.red} text="Save this" size={40} />
      </div>
    </Shell>
  );
};

/* ================= S2 — THE HOOK ================= */
const s2B = (fps: number) => ({ dozen: W("s2", "dozen", 1.7)(fps), face: W("s2", "face", 4.8)(fps), gmail: W("s2", "gmail", 6.1)(fps), yt: W("s2", "youtube", 7.7)(fps), maps: W("s2", "google", 9.5)(fps), nobody: sentence(fps, "s2", 2).from, learned: W("s2", "learned", 14.1)(fps) });
const USES: [string, string][] = [
  ["Face unlock", "your phone"],
  ["Spam filter", "gmail"],
  ["Your next video", "youtube"],
  ["Live traffic", "google maps"],
];
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2B(fps);
  const at = [b.face, b.gmail, b.yt, b.maps];
  const strike = ease(frame, b.learned - 10, 10);
  return (
    <Shell>
      <Kicker title="You've used it today" sub="Without noticing" subAt={6} />
      <div style={{ position: "absolute", left: 70, top: 380 }}>
        <Slam text="12" at={b.dozen - 2} size={320} color={C.accent} />
      </div>
      <div style={{ position: "absolute", left: 330, top: 520, opacity: fade(frame, b.dozen + 4) }}>
        <Disp size={72}>times</Disp>
        <div style={{ marginTop: 4 }}>
          <Label size={24} color={C.ink2}>
            before you opened this reel
          </Label>
        </div>
      </div>
      <Layer>
        {[PhoneFace, Envelope, PlayBtn, MapPin].map((Ic, i) => (
          <Ic key={i} x={112} y={800 + i * 92} s={74} at={at[i] - 8} />
        ))}
      </Layer>
      {USES.map(([t, l], i) => (
        <Rise key={t} at={at[i] - 6} style={{ position: "absolute", left: 175, right: 70, top: 760 + i * 92, display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: `2px solid ${C.line}`, paddingBottom: 8 }}>
          <Disp size={68}>{t}</Disp>
          <Label size={22} color={C.mute}>
            {l}
          </Label>
        </Rise>
      ))}
      <div style={{ position: "absolute", left: 70, top: 1160 }}>
        <span style={{ position: "relative", display: "inline-block", opacity: fade(frame, b.nobody - 2) * (1 - fade(frame, b.learned - 2, 6)) }}>
          <Band at={b.nobody - 2} text="Nobody wrote the rules" size={46} />
          <span style={{ position: "absolute", left: -8, top: "48%", width: `${strike * 106}%`, height: 6, background: C.red }} />
        </span>
      </div>
      <div style={{ position: "absolute", left: 70, top: 1160 }}>
        <Band at={b.learned - 2} color={C.accent} text="They learned." size={46} />
      </div>
    </Shell>
  );
};

/* ================= S3 — THE OLD WAY ================= */
const s3B = (fps: number) => ({ prog: W("s3", "programmer", 2.1)(fps), rule: W("s3", "if", 6.5)(fps), data: sentence(fps, "s3", 2).from, ans: W("s3", "answers", 10.7)(fps), spam: W("s3", "spammers", 11.9)(fps), breaks: W("s3", "breaks", 15.3)(fps), mil: W("s3", "millions", 16.6)(fps) });
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3B(fps);
  return (
    <Shell>
      <Kicker title="The old way" sub="Normal programming · a human writes every rule" subAt={b.prog - 4} />
      <Layer>
        <Person x={160} y={545} s={170} at={b.prog - 6} />
      </Layer>
      <Print x={270} y={420} w={740} h={250} at={b.rule - 8} tilt={-2}>
        <Label size={20} color={C.red} spacing="0.3em">
          Rule #1
        </Label>
        <div style={{ marginTop: 10 }}>
          <Serif size={44} weight={700} style={{ whiteSpace: "nowrap" }}>
            If an email says &ldquo;free money&rdquo;
          </Serif>
        </div>
        <div style={{ marginTop: 6 }}>
          <Disp size={64}>
            Mark it <span style={{ color: C.red }}>spam</span>
          </Disp>
        </div>
      </Print>
      <Crack y={700} at={b.breaks - 4} />
      {/* the classic diagram */}
      <div style={{ position: "absolute", left: 70, top: 760, display: "flex", alignItems: "baseline", gap: 22 }}>
        <Rise at={b.data - 4}>
          <Disp size={84}>Data</Disp>
        </Rise>
        <Rise at={b.data + 2}>
          <Disp size={60} color={C.mute}>
            +
          </Disp>
        </Rise>
        <Rise at={b.data + 6}>
          <Disp size={84} color={C.red}>
            Rules
          </Disp>
        </Rise>
      </div>
      <SeamArrow x={515} y={812} w={40} at={b.ans - 12} />
      <Layer>
        <Computer x={613} y={815} s={84} at={b.ans - 10} />
      </Layer>
      <SeamArrow x={660} y={812} w={40} at={b.ans - 6} />
      <div style={{ position: "absolute", left: 735, top: 760 }}>
        <Rise at={b.ans - 4}>
          <Disp size={84}>Answers</Disp>
        </Rise>
      </div>
      <div style={{ position: "absolute", left: 70, top: 920, opacity: fade(frame, b.spam + 6) }}>
        <Slam text="fr3e m0ney!!!" at={b.spam + 6} size={130} color={C.red} />
      </div>
      <Layer>
        <Envelope x={935} y={985} s={110} at={b.spam + 8} />
        <Cross x={935} y={985} s={84} at={b.breaks} />
      </Layer>
      <div style={{ position: "absolute", left: 70, top: 1070, opacity: fade(frame, b.breaks) }}>
        <Label size={24} color={C.red} weight={900}>
          Rule broken · straight to the inbox
        </Label>
      </div>
      <Tally n={15} at={b.mil - 4} label="Millions of rules?" top={1140} />
    </Shell>
  );
};

/* ================= S4 — MACHINE LEARNING FLIPS IT ================= */
const s4B = (fps: number) => ({ thou: W("s4", "thousands", 2.7)(fps), lab: W("s4", "labeled", 4.7)(fps), not: W("s4", "not", 6.5)(fps), self: sentence(fps, "s4", 2).from, itself: W("s4", "itself", 8.8)(fps), r1: sentence(fps, "s4", 3).from, out: sentence(fps, "s4", 3).to });
const MAILS: [string, string, boolean][] = [
  ["“You won a free phone!!”", "Spam", true],
  ["“Team meeting at 3 pm”", "Not spam", false],
  ["“fr3e m0ney, click now”", "Spam", true],
];
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4B(fps);
  const swap = ease(frame, b.out - 16, 14);
  return (
    <Shell>
      <Kicker title="Machine learning flips it" sub="10,000 emails · each one already labelled" subAt={b.thou} />
      {MAILS.map(([m, tag, spam], i) => (
        <Rise key={m} at={b.thou - 6 + i * 5} style={{ position: "absolute", left: 70, right: 70, top: 400 + i * 96, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.paperHi, padding: "14px 24px", boxShadow: "0 8px 20px rgba(40,30,10,0.12)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width={56} height={44} viewBox="0 0 56 44" style={{ overflow: "visible" }}>
              <rect x={2} y={4} width={52} height={36} rx={3} fill={spam ? "#F6D5DA" : "#D8E6F6"} stroke={C.ink} strokeWidth={3} />
              <path d="M3 6 L28 26 L53 6" fill="none" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
            </svg>
            <Serif size={40} weight={700}>
              {m}
            </Serif>
          </span>
          <span style={{ opacity: fade(frame, (i === 1 ? b.not : b.lab) + i * 3), border: `4px solid ${spam ? C.red : C.ink}`, padding: "2px 14px 0" }}>
            <Disp size={34} color={spam ? C.red : C.ink}>
              {tag}
            </Disp>
          </span>
        </Rise>
      ))}
      <Layer>
        <Robot x={935} y={862} s={96} at={b.self - 8} />
      </Layer>
      <div style={{ position: "absolute", left: 70, top: 712, opacity: fade(frame, b.self - 4) }}>
        <Label size={22} color={C.ink2} spacing="0.3em">
          The machine works out the rules itself
        </Label>
      </div>
      <div style={{ position: "absolute", left: 70, top: 752, display: "flex", gap: 18, flexWrap: "wrap", width: 940 }}>
        {["Weird spelling", "Lots of $$$", "Unknown sender", "“Urgent!!!”"].map((t, i) => (
          <Rise key={t} at={b.itself - 4 + i * 4}>
            <span style={{ display: "inline-block", border: `3px solid ${C.accent}`, padding: "4px 16px 0" }}>
              <Disp size={42} color={C.accent}>
                {t}
              </Disp>
            </span>
          </Rise>
        ))}
      </div>
      {/* the flip, side by side */}
      <Seam x={70} y={930} w={940} p={ease(frame, b.r1 - 10, 16)} />
      <div style={{ position: "absolute", left: 70, top: 966, opacity: fade(frame, b.r1 - 6) }}>
        <Label size={22} color={C.mute}>
          Normal
        </Label>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <Disp size={64} color={C.mute}>
            Data + Rules
          </Disp>
          <InArrow color={C.mute} />
          <Disp size={64} color={C.mute}>
            Answers
          </Disp>
        </div>
      </div>
      <div style={{ position: "absolute", left: 70, top: 1100, opacity: fade(frame, b.r1 + 4) }}>
        <Label size={22} color={C.accent}>
          Machine learning
        </Label>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <Disp size={72}>Data + Answers</Disp>
          <InArrow color={C.red} w={72} />
          <span style={{ position: "relative", display: "inline-block", transform: `scale(${1 + 0.12 * swap})`, transformOrigin: "0% 70%" }}>
            <Disp size={72} color={C.accent}>
              Rules
            </Disp>
            <span style={{ position: "absolute", left: 0, bottom: -4, height: 6, width: `${swap * 100}%`, background: C.red }} />
          </span>
        </div>
      </div>
    </Shell>
  );
};

/* ================= S5 — THE TEXTBOOK DEFINITION ================= */
const s5B = (fps: number) => ({ l1: sentence(fps, "s5", 1).from, art: W("s5", "artificial", 3.5)(fps), comp: W("s5", "computers", 5.3)(fps), pat: W("s5", "patterns", 6.0)(fps), inst: W("s5", "instead", 7.1)(fps), exp: W("s5", "explicitly", 8.1)(fps), q: sentence(fps, "s5", 2).from });
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5B(fps);
  const U: React.FC<{ at: number; color: string; children: React.ReactNode }> = ({ at, color, children }) => (
    <span style={{ position: "relative", color }}>
      {children}
      <span style={{ position: "absolute", left: 0, bottom: -2, height: 5, width: `${ease(frame, at, 10) * 100}%`, background: color }} />
    </span>
  );
  const lines: [number, React.ReactNode][] = [
    [b.l1, <>Machine learning is a branch of</>],
    [b.art, <>artificial intelligence where</>],
    [b.comp, <>computers <U at={b.pat} color={C.accent}>learn patterns from data</U>,</>],
    [b.inst, <>instead of being <U at={b.exp} color={C.red}>explicitly programmed.</U></>],
  ];
  return (
    <Shell>
      <Kicker title="The textbook definition" sub="Machine learning (noun)" subAt={4} />
      {lines.map(([at, ln], i) => (
        <Rise key={i} at={at - 4} style={{ position: "absolute", left: 70, right: 30, top: 400 + i * 84, whiteSpace: "nowrap" }}>
          <Serif size={50} weight={700}>
            {ln}
          </Serif>
        </Rise>
      ))}
      <Print x={90} y={810} w={900} h={380} at={b.q - 4} tilt={2}>
        <svg width={170} height={170} viewBox="0 0 170 170" style={{ position: "absolute", right: 26, bottom: 22, overflow: "visible" }}>
          <Checkers x={85} y={85} s={150} at={b.q + 8} />
        </svg>
        <Serif size={120} color={C.accent} weight={900} style={{ position: "absolute", left: 24, top: -18, opacity: 0.35 }}>
          &ldquo;
        </Serif>
        <div style={{ marginTop: 40, padding: "0 20px" }}>
          <Serif size={50} weight={900} style={{ display: "block", maxWidth: 680 }}>
            The ability to learn without being explicitly programmed.
          </Serif>
        </div>
        <div style={{ marginTop: 18, padding: "0 20px" }}>
          <Label size={22} color={C.red} spacing="0.3em">
            Arthur Samuel · 1959
          </Label>
          <div style={{ marginTop: 6 }}>
            <Label size={17} color={C.ink2}>
              His checkers program taught itself to play
            </Label>
          </div>
        </div>
      </Print>
    </Shell>
  );
};

/* ================= S6 — WATCH A MACHINE LEARN ================= */
const DATA: [number, number][] = [
  [700, 175], [900, 160], [1100, 230], [1250, 219.5], [1400, 268],
  [1600, 298], [1750, 294.5], [1900, 350], [2100, 340], [2300, 415],
];
const FIT = { b: 50, m: 0.15 };
const START = { b: 330, m: -0.06 };
const X0 = 150, X1 = 760, Y0 = 1000, Y1 = 470;
const sx = (s: number) => X0 + ((s - 500) / 2000) * (X1 - X0);
const py = (p: number) => Y0 - (p / 450) * (Y0 - Y1);
const params = (r: number) => {
  const f = Math.pow(0.6, r - 1);
  return { b: FIT.b + (START.b - FIT.b) * f, m: FIT.m + (START.m - FIT.m) * f };
};
const mae = (q: { b: number; m: number }) => DATA.reduce((a, [s, p]) => a + Math.abs(p - (q.b + q.m * s)), 0) / DATA.length;
const MAE0 = mae(START);
const s6B = (fps: number) => ({ hou: W("s6", "houses", 3.7)(fps), guess: W("s6", "random", 7.3)(fps), ter: W("s6", "terrible", 9.4)(fps), err: W("s6", "error", 12.3)(fps), steps: [W("s6", "nudges", 13.2)(fps), W("s6", "again", 15.6)(fps), W("s6", "again", 16.3, 1)(fps)], af: sentence(fps, "s6", 5).from, tiny: W("s6", "tiny", 18.6)(fps), loop: [W("s6", "gue", 19.8, 1)(fps), W("s6", "measure", 19.8, 1)(fps) + 6, W("s6", "adjust", 20.7)(fps), W("s6", "repeat", 21.2)(fps)], learn: W("s6", "learning", 22.1)(fps) });
const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6B(fps);
  let r = 1;
  b.steps.forEach((t) => (r += ease(frame, t - 2, 10)));
  r += interpolate(frame, [b.af, b.tiny], [0, 46], { easing: theme.ease.inOut, ...CLAMP });
  const q = params(r);
  const err = mae(q);
  const lineOn = ease(frame, b.guess - 4, 12);
  const resP = ease(frame, b.err - 10, 14);
  const done = frame >= b.tiny;
  const lineCol = done ? C.accent : C.red;
  const meter = Math.min(1, err / MAE0) * ease(frame, b.err - 4, 14);
  return (
    <Shell>
      <Kicker title="Watch a machine learn" sub="10 houses · size against price" subAt={b.hou - 4} />
      <Layer>
        <House x={950} y={300} s={100} at={b.hou - 8} />
      </Layer>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* axes */}
        <line x1={X0} y1={Y1 - 30} x2={X0} y2={Y0} stroke={C.ink} strokeWidth={3} opacity={fade(frame, b.hou - 10)} />
        <line x1={X0} y1={Y0} x2={X1 + 20} y2={Y0} stroke={C.ink} strokeWidth={3} opacity={fade(frame, b.hou - 8)} />
        {[100, 200, 300, 400].map((v) => (
          <line key={v} x1={X0} y1={py(v)} x2={X1 + 20} y2={py(v)} stroke={C.line} strokeWidth={2} opacity={fade(frame, b.hou - 6)} />
        ))}
        {/* residuals */}
        {resP > 0 ? DATA.map(([s, p], i) => <line key={i} x1={sx(s)} y1={py(p)} x2={sx(s)} y2={py(p) + (py(q.b + q.m * s) - py(p)) * resP} stroke={C.mute} strokeWidth={3} strokeDasharray="6 7" />) : null}
        {/* ghosts of earlier guesses */}
        {b.steps.map((t, i) => (frame >= t + 8 && frame < b.af + 20 ? <line key={i} x1={sx(500)} y1={py(params(i + 1).b + params(i + 1).m * 500)} x2={sx(2500)} y2={py(params(i + 1).b + params(i + 1).m * 2500)} stroke={C.mute} strokeWidth={3} strokeDasharray="3 9" opacity={0.6} /> : null))}
        {lineOn > 0 ? <line x1={sx(500)} y1={py(q.b + q.m * 500)} x2={sx(500 + 2000 * lineOn)} y2={py(q.b + q.m * (500 + 2000 * lineOn))} stroke={lineCol} strokeWidth={8} strokeLinecap="round" /> : null}
        {/* houses */}
        {DATA.map(([s, p], i) => {
          const k = ease(frame, b.hou + 2 + i * 3, 8);
          if (k <= 0) return null;
          const x = sx(s), y = py(p);
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${k})`}>
              <path d="M-15 -2 L0 -16 L15 -2" fill={C.accent} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
              <rect x={-11} y={-2} width={22} height={17} fill={C.paperHi} stroke={C.ink} strokeWidth={3} />
              <rect x={-3} y={5} width={6} height={10} fill={C.ink} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: X0, top: Y0 + 16, width: X1 - X0, textAlign: "center", opacity: fade(frame, b.hou) }}>
        <Label size={20} color={C.ink2}>
          Size (sq ft) →
        </Label>
      </div>
      <div style={{ position: "absolute", left: 92, top: 735, transform: "translate(-50%, -50%) rotate(-90deg)", opacity: fade(frame, b.hou) }}>
        <Label size={20} color={C.ink2}>
          Price ($k) →
        </Label>
      </div>
      {frame >= b.guess - 4 ? (
        <div style={{ position: "absolute", left: X0 + 24, top: Y1 - 40 }}>
          <Disp size={56} color={done ? C.accent : C.red}>{`Round ${Math.max(1, Math.round(r))}`}</Disp>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 470, top: 905, opacity: win(frame, b.ter - 4, b.err - 8) }}>
        <Serif size={54} color={C.red} weight={900}>
          terrible!
        </Serif>
      </div>
      {/* error meter */}
      <div style={{ position: "absolute", left: 830, top: 470, width: 170, opacity: fade(frame, b.err - 6) }}>
        <Label size={18} color={C.ink2}>
          Average miss
        </Label>
        <div style={{ position: "relative", marginTop: 12, width: 90, height: 420, borderLeft: `3px solid ${C.ink}`, borderBottom: `3px solid ${C.ink}` }}>
          <div style={{ position: "absolute", left: 10, bottom: 0, width: 70, height: 420 * meter, background: done ? C.accent : C.red }} />
        </div>
        <div style={{ marginTop: 10 }}>
          <Disp size={60} color={done ? C.accent : C.red}>{`$${Math.round(err)}k`}</Disp>
        </div>
      </div>
      {/* the loop */}
      {["Guess", "Error", "Adjust", "Repeat"].map((w, i) => (
        <div key={w} style={{ position: "absolute", left: [70, 300, 550, 815][i], top: 1112, opacity: fade(frame, b.loop[i] - 4) }}>
          <Disp size={58} color={i === 3 ? C.accent : C.ink}>
            {w}
          </Disp>
        </div>
      ))}
      {[0, 1, 2].map((i) => (
        <SeamArrow key={i} x={[218, 468, 733][i]} y={1150} w={44} at={b.loop[i + 1] - 8} />
      ))}
      <div style={{ position: "absolute", left: 70, top: 1206 }}>
        <Band at={b.learn - 4} color={C.accent} text="= that's learning" size={42} />
      </div>
    </Shell>
  );
};

/* ================= S7 — THE MODEL ================= */
const s7B = (fps: number) => ({ model: W("s7", "model", 1.3)(fps), recipe: W("s7", "recipe", 2.5)(fps), never: W("s7", "never", 6.2)(fps), n1500: W("s7", "1500", 7.4)(fps), pred: W("s7", "predicts", 9.2)(fps), feat: W("s7", "features", 11.5)(fps), label: W("s7", "label", 14.1)(fps), t0: sentence(fps, "s7", 2).from });
const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7B(fps);
  const box = useP(b.model - 6, theme.spring.heavy);
  const rows: [string, string, boolean][] = [
    ["800", "$170k", false],
    ["1,200", "$230k", false],
    ["2,000", "$350k", false],
    ["1,500", "$275k", true],
  ];
  return (
    <Shell>
      <Kicker title="What it learned: a model" sub="A learned recipe · inputs in, predictions out" subAt={b.recipe - 4} />
      {/* input → model → output, top to bottom */}
      <Rise at={b.never - 4} style={{ position: "absolute", left: 70, top: 400 }}>
        <div>
          <Label size={20} color={C.ink2}>
            A house it has never seen
          </Label>
        </div>
        <div>
          <Disp size={84}>1,500 sq ft</Disp>
        </div>
      </Rise>
      <div style={{ position: "absolute", left: 600, top: 452, opacity: fade(frame, b.feat - 4) }}>
        <Band at={-100} color={C.ink} text="feature = input" size={40} />
      </div>
      <Layer>
        <House x={560} y={630} s={120} at={b.never - 6} />
      </Layer>
      <SeamArrow x={180} y={545} w={45} at={b.n1500} down />
      <div style={{ position: "absolute", left: 70, top: 610, width: 420, height: 130, border: `6px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: interpolate(box, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(box, [0, 1], [0.8, 1])})`, transformOrigin: "0% 50%" }}>
        <Disp size={84} color={C.accent}>
          Model
        </Disp>
      </div>
      <SeamArrow x={180} y={745} w={50} at={b.pred - 6} down />
      <div style={{ position: "absolute", left: 70, top: 810 }}>
        <Slam text="$275k" at={b.pred + 4} size={130} color={C.accent} />
      </div>
      <div style={{ position: "absolute", left: 600, top: 868, opacity: fade(frame, b.label - 4) }}>
        <Band at={-100} color={C.red} text="label = answer" size={40} />
      </div>
      {/* the table */}
      <div style={{ position: "absolute", left: 560, top: 980, width: 450, opacity: fade(frame, b.t0 - 6) }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `3px solid ${C.ink}`, paddingBottom: 6 }}>
          <Label size={18} color={C.ink2}>
            Size · feature
          </Label>
          <Label size={18} color={C.red}>
            Price · label
          </Label>
        </div>
        {rows.map(([a, p, hero], i) => (
          <div key={a} style={{ display: "flex", justifyContent: "space-between", borderBottom: `2px solid ${C.line}`, padding: "4px 0", opacity: fade(frame, (hero ? b.label : b.t0) + i * 4) }}>
            <Disp size={44} color={hero ? C.accent : C.ink}>
              {a}
            </Disp>
            <Disp size={44} color={hero ? C.accent : C.ink}>
              {p}
            </Disp>
          </div>
        ))}
      </div>
    </Shell>
  );
};

/* ================= S8 — THE 3 TYPES ================= */
const s8B = (fps: number) => ({ a: W("s8", "supervised", 2.7)(fps), b: W("s8", "unsupervised", 7.9)(fps), c: W("s8", "reinforcement", 13.8)(fps) });
const TYPES: [string, string, string][] = [
  ["Supervised", "learns from examples with answers", "e.g. spam / not spam"],
  ["Unsupervised", "no answers: finds hidden groups", "e.g. types of customers"],
  ["Reinforcement", "trial and error, with rewards", "e.g. mastering a video game"],
];
const S8: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s8B(fps);
  const at = [b.a, b.b, b.c];
  return (
    <Shell>
      <Kicker title="The 3 types of machine learning" />
      <Layer>
        <Flashcards x={955} y={450} s={104} at={at[0] - 4} />
        <Clusters x={955} y={740} s={110} at={at[1] - 4} />
        <Gamepad x={950} y={1035} s={104} at={at[2] - 4} />
        <Trophy x={985} y={980} s={50} at={at[2] + 10} />
      </Layer>
      {TYPES.map(([t, d, e], i) => (
        <Rise key={t} at={at[i] - 6} style={{ position: "absolute", left: 70, right: 70, top: 380 + i * 290, height: 260, borderTop: `3px solid ${i === 0 ? C.ink : C.line}`, paddingTop: 22, display: "flex", gap: 34 }}>
          <Disp size={190} color={C.accent} style={{ lineHeight: 0.9 }}>
            {`${i + 1}`}
          </Disp>
          <div>
            <Disp size={88}>{t}</Disp>
            <div style={{ marginTop: 6 }}>
              <Serif size={42} weight={700}>
                {d}
              </Serif>
            </div>
            <div style={{ marginTop: 10 }}>
              <Label size={22} color={C.red}>
                {e}
              </Label>
            </div>
          </div>
        </Rise>
      ))}
    </Shell>
  );
};

/* ================= S9 — WHERE IT FITS ================= */
const s9B = (fps: number) => ({ ai: W("s9", "artificial", 1.8)(fps), smart: W("s9", "smart", 4.6)(fps), ml: sentence(fps, "s9", 1).from, dl: W("s9", "deep", 8.1)(fps), gpt: W("s9", "chat", 9.6)(fps) });
const Ring: React.FC<{ cy: number; r: number; at: number; color: string; fill?: string }> = ({ cy, r, at, color, fill }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, 20);
  if (p <= 0) return null;
  const L = 2 * Math.PI * r;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <circle cx={540} cy={cy} r={r} fill={fill ?? "none"} fillOpacity={fill ? p : 0} stroke={color} strokeWidth={6} strokeDasharray={L} strokeDashoffset={L * (1 - p)} transform={`rotate(-90 540 ${cy})`} />
    </svg>
  );
};
const S9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s9B(fps);
  const T: React.FC<{ y: number; at: number; children: React.ReactNode }> = ({ y, at, children }) => <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: fade(frame, at) }}>{children}</div>;
  return (
    <Shell>
      <Kicker title="Where does it all fit?" />
      <Ring cy={790} r={420} at={b.ai - 6} color={C.ink} />
      <Ring cy={890} r={310} at={b.ml - 4} color={C.accent} />
      <Ring cy={1010} r={180} at={b.dl - 4} color={C.red} fill={C.accentSoft} />
      <T y={470} at={b.ai}>
        <Disp size={52}>Artificial intelligence</Disp>
      </T>
      <T y={538} at={b.smart - 2}>
        <Label size={20} color={C.ink2}>
          Machines doing smart things
        </Label>
      </T>
      <T y={680} at={b.ml + 4}>
        <Disp size={52} color={C.accent}>
          Machine learning
        </Disp>
      </T>
      <T y={748} at={b.ml + 10}>
        <Label size={20} color={C.ink2}>
          Learns from data
        </Label>
      </T>
      <T y={930} at={b.dl}>
        <Disp size={46} color={C.red}>
          Deep learning
        </Disp>
      </T>
      <T y={1010} at={b.gpt - 2}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
          <svg width={64} height={64} viewBox="0 0 64 64" style={{ overflow: "visible" }}>
            <ChatBubble x={32} y={32} s={60} at={b.gpt - 4} />
          </svg>
          <Band at={-100} color={C.ink} text="ChatGPT lives here" size={34} />
        </span>
      </T>
    </Shell>
  );
};

/* ================= S10 — REMEMBER THIS: THE CASE FILE + STAMP + SAVE ================= */
const s10B = (fps: number) => ({ normal: W("s10", "normal", 1.1)(fps), mach: sentence(fps, "s10", 0).from + Math.round(3.6 * 30), data: W("s10", "data", 6.1)(fps), save: sentence(fps, "s10", 1).from, send: W("s10", "send", 7.8)(fps) });
const S10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s10B(fps);
  return (
    <Shell>
      <Kicker title="Remember this" />
      <Print x={80} y={390} w={920} h={600} at={b.normal - 8} tilt={-2}>
        <div>
          <Label size={20} color={C.red} spacing="0.3em">
            Case file · Day 1
          </Label>
        </div>
        <div style={{ marginTop: 26, opacity: fade(frame, b.normal - 2) }}>
          <div>
            <Label size={22} color={C.mute}>
              Normal programming
            </Label>
          </div>
          <div>
            <Disp size={78} color={C.mute}>
              We write the rules
            </Disp>
          </div>
        </div>
        <div style={{ marginTop: 26, opacity: fade(frame, b.mach - 2) }}>
          <div>
            <Label size={22} color={C.accent}>
              Machine learning
            </Label>
          </div>
          <div>
            <Disp size={78}>The machine</Disp>
          </div>
          <div>
            <Disp size={78} color={C.accent}>
              learns them
            </Disp>
          </div>
        </div>
        <svg width={150} height={150} viewBox="0 0 150 150" style={{ position: "absolute", left: 740, top: 70, overflow: "visible" }}>
          <Person x={75} y={75} s={130} at={b.normal - 2} />
        </svg>
        <svg width={150} height={150} viewBox="0 0 150 150" style={{ position: "absolute", left: 740, top: 245, overflow: "visible" }}>
          <Robot x={75} y={75} s={130} at={b.mach - 2} />
        </svg>
        <Stamp text="From data" at={b.data} x={500} y={420} rotate={-9} size={78} />
      </Print>
      <div style={{ position: "absolute", left: 70, top: 1060 }}>
        <Band at={b.save - 4} color={C.ink} text="Save this" size={48} />
      </div>
      <div style={{ position: "absolute", left: 70, top: 1156, opacity: fade(frame, b.send - 2) }}>
        <Label size={24} color={C.red} weight={900}>
          Send it to a friend starting ML
        </Label>
      </div>
    </Shell>
  );
};

/* ================= S11 — YOUR TURN, TEASER, BRAND ================= */
const s11B = (fps: number) => ({ q: sentence(fps, "s11", 0).from, lab: W("s11", "labeled", 3.9)(fps), which: W("s11", "which", 6.3)(fps), vote: W("s11", "vote", 7.7)(fps), tease: sentence(fps, "s11", 1).from, fol: sentence(fps, "s11", 2).from, simple: W("s11", "simple", 14.5)(fps) });
const OPTS = ["Supervised", "Unsupervised", "Reinforcement", "Not ML"];
const S11: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s11B(fps);
  const pollOut = fade(frame, b.tease - 10, 10);
  const teaseOut = fade(frame, b.fol - 8, 8);
  const brand = useP(b.fol, theme.spring.heavy);
  return (
    <Shell exit={false}>
      {pollOut < 1 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - pollOut }}>
          <Kicker title="Your turn" sub="Vote in the caption poll" subAt={b.vote - 4} />
          <Rise at={b.q} style={{ position: "absolute", left: 70, right: 70, top: 410 }}>
            <Serif size={52} weight={700}>
              A bank learns to catch fraud from past transactions, each labelled <span style={{ color: C.red }}>fraud</span> or <span style={{ color: C.accent }}>not fraud</span>.
            </Serif>
          </Rise>
          <Layer>
            <Bank x={905} y={680} s={150} at={b.q} />
          </Layer>
          <div style={{ position: "absolute", left: 70, top: 640, opacity: fade(frame, b.which - 4) }}>
            <Disp size={84}>Which type is it?</Disp>
          </div>
          {OPTS.map((o, i) => (
            <Rise key={o} at={b.which + 2 + i * 4} style={{ position: "absolute", left: 70 + (i % 2) * 480, top: 780 + Math.floor(i / 2) * 130, display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ width: 76, height: 76, borderRadius: 38, border: `5px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Disp size={48} color={C.accent}>
                  {"ABCD"[i]}
                </Disp>
              </span>
              <Disp size={56}>{o}</Disp>
            </Rise>
          ))}
          <div style={{ position: "absolute", left: 70, top: 1060 }}>
            <Band at={b.vote - 4} color={C.red} text="Vote in the caption poll" size={44} />
          </div>
        </div>
      ) : null}
      {frame >= b.tease - 6 && teaseOut < 1 ? (
        <div style={{ position: "absolute", inset: 0, opacity: fade(frame, b.tease - 6) * (1 - teaseOut) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center" }}>
            <Label size={26} color={C.red} spacing="0.34em">
              Tomorrow · Day 2
            </Label>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center" }}>
            <div>
              <Disp size={130}>The 3 types</Disp>
            </div>
            <div>
              <Disp size={130} color={C.accent}>
                of ML
              </Disp>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center" }}>
            <Serif size={48} weight={900}>
              in depth
            </Serif>
          </div>
          <Layer>
            <Flashcards x={330} y={1060} s={130} at={b.tease + 4} />
            <Clusters x={540} y={1060} s={140} at={b.tease + 10} />
            <Gamepad x={750} y={1070} s={130} at={b.tease + 16} />
          </Layer>
        </div>
      ) : null}
      {frame >= b.fol ? (
        <Layer>
          <Robot x={540} y={370} s={160} at={b.fol} />
        </Layer>
      ) : null}
      {frame >= b.fol ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", opacity: interpolate(brand, [0, 0.3], [0, 1], CLAMP), transform: `translateY(${interpolate(brand, [0, 1], [24, 0])}px)` }}>
          <div>
            <Label size={26} color={C.mute} spacing="0.3em">
              Follow for
            </Label>
          </div>
          <div style={{ marginTop: 14 }}>
            <div>
              <Disp size={120}>Data science</Disp>
            </div>
            <div>
              <Disp size={120} color={C.accent}>
                made simple
              </Disp>
            </div>
          </div>
          <div style={{ position: "relative", height: 40, marginTop: 18 }}>
            <Seam x={240} y={18} w={600} p={ease(frame, b.fol + 6, 16)} />
          </div>
          <div style={{ marginTop: 10 }}>
            <Serif size={56} weight={900}>
              {config.handle}
            </Serif>
          </div>
          <div style={{ marginTop: 18 }}>
            <Label size={22} color={C.red} spacing="0.3em">
              {config.series}
            </Label>
          </div>
        </div>
      ) : null}
    </Shell>
  );
};

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
    ["s11", S11],
  ] as [string, React.FC][],
  warmFrom: (fps: number) => scene(fps, "s10").from,
  mastheadOffAt: (fps: number) => scene(fps, "s11").from + s11B(fps).fol,
  captionsOffFrom: (fps: number) => scene(fps, "s11").from + scene(fps, "s11").duration + 30,
  sfx: (fps: number): Cue[] => {
    const S = (id: string) => scene(fps, id).from;
    const c: Cue[] = [];
    const add = (id: string, at: number, file: string, volume: number) => c.push({ at: S(id) + at, file, volume });
    ["s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11"].forEach((id) => c.push({ at: S(id) - 9, file: "swoosh.wav", volume: 0.26 }));
    const b1 = s1B(fps), b2 = s2B(fps), b3 = s3B(fps), b4 = s4B(fps), b5 = s5B(fps), b6 = s6B(fps), b7 = s7B(fps), b8 = s8B(fps), b9 = s9B(fps), b10 = s10B(fps), b11 = s11B(fps);
    // s1: title slams from frame 0, ticks as items are named
    add("s1", 0, "slam.wav", 0.5);
    add("s1", 0, "impact.wav", 0.4);
    add("s1", 6, "whip.wav", 0.25);
    [12, 16, 20, 24].forEach((f) => add("s1", f, "tick.wav", 0.2));
    [b1.rules, b1.learns, b1.three, b1.save - 6].forEach((f) => add("s1", f, "pen.wav", 0.3));
    add("s1", b1.save - 4, "pop.wav", 0.3);
    // s2
    add("s2", b2.dozen - 2, "slam.wav", 0.5);
    [b2.face, b2.gmail, b2.yt, b2.maps].forEach((f) => add("s2", f - 6, "whip.wav", 0.22));
    add("s2", b2.nobody - 2, "pop.wav", 0.25);
    add("s2", b2.learned - 10, "pen.wav", 0.35);
    add("s2", b2.learned - 2, "impact.wav", 0.4);
    // s3
    add("s3", b3.rule - 8, "whip.wav", 0.25);
    add("s3", b3.data - 4, "tick.wav", 0.2);
    add("s3", b3.ans - 10, "pen.wav", 0.3);
    add("s3", b3.spam + 6, "slam.wav", 0.45);
    add("s3", b3.breaks - 4, "crack.wav", 0.45);
    add("s3", b3.mil - 4, "ticks.wav", 0.3);
    // s4
    [0, 5, 10].forEach((d) => add("s4", b4.thou - 6 + d, "whip.wav", 0.18));
    add("s4", b4.lab, "pop.wav", 0.25);
    add("s4", b4.not + 3, "pop.wav", 0.25);
    [0, 4, 8, 12].forEach((d) => add("s4", b4.itself - 4 + d, "tick.wav", 0.18));
    add("s4", b4.r1 - 10, "pen.wav", 0.3);
    add("s4", b4.out - 16, "rise.wav", 0.25);
    add("s4", b4.out - 2, "impact.wav", 0.4);
    // s5
    [b5.l1, b5.art, b5.comp, b5.inst].forEach((f) => add("s5", f - 4, "tick.wav", 0.15));
    add("s5", b5.pat, "pen.wav", 0.3);
    add("s5", b5.exp, "pen.wav", 0.3);
    add("s5", b5.q - 4, "whip.wav", 0.25);
    // s6
    for (let i = 0; i < 10; i++) add("s6", b6.hou + 2 + i * 3, "tick.wav", 0.14);
    add("s6", b6.guess - 4, "pen.wav", 0.3);
    add("s6", b6.err - 10, "rise.wav", 0.2);
    b6.steps.forEach((f) => add("s6", f - 2, "pop.wav", 0.25));
    add("s6", b6.af, "ticks.wav", 0.3);
    add("s6", b6.tiny, "impact.wav", 0.4);
    b6.loop.forEach((f) => add("s6", f - 4, "tick.wav", 0.2));
    add("s6", b6.learn - 4, "slam.wav", 0.35);
    // s7
    add("s7", b7.model - 6, "slam.wav", 0.4);
    add("s7", b7.n1500, "pen.wav", 0.25);
    add("s7", b7.pred + 4, "slam.wav", 0.45);
    add("s7", b7.feat - 4, "pop.wav", 0.25);
    add("s7", b7.label - 4, "pop.wav", 0.25);
    // s8
    [b8.a, b8.b, b8.c].forEach((f) => add("s8", f - 6, "slam.wav", 0.35));
    // s9
    add("s9", b9.ai - 6, "pen.wav", 0.3);
    add("s9", b9.ml - 4, "pen.wav", 0.3);
    add("s9", b9.dl - 4, "pen.wav", 0.3);
    add("s9", b9.gpt - 2, "pop.wav", 0.28);
    // s10: the stamp
    add("s10", b10.normal - 8, "whip.wav", 0.25);
    add("s10", b10.data - 2, "slam.wav", 0.55);
    add("s10", b10.data - 2, "impact.wav", 0.5);
    add("s10", b10.save - 4, "pop.wav", 0.3);
    // s11
    add("s11", b11.q, "pop.wav", 0.3);
    [0, 4, 8, 12].forEach((d) => add("s11", b11.which + 2 + d, "tick.wav", 0.2));
    add("s11", b11.vote - 4, "slam.wav", 0.4);
    add("s11", b11.tease - 6, "rise.wav", 0.25);
    add("s11", b11.fol, "impact.wav", 0.5);
    add("s11", b11.simple, "pop.wav", 0.3);
    return c;
  },
};
