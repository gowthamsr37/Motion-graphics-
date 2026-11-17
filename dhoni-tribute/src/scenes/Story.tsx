// MS Dhoni — The End of an Era. Nine scenes timed to the narration.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "../components/Motion";
import { Lamp, Lettering, Panel } from "../components/Panel";
import { SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { AMBER, Stamp } from "../components/Toss";
import { Framed, Gavel, Glove, PhotoBg, SixBall, Spotlight, Stumps, Trophy, YELLOW } from "../components/Tribute";
import { theme } from "../theme";
import { sentence, wordAt } from "../timing";
import { useFlip } from "./common";

const C = theme.colors;
const fmt = (n: number) => n.toLocaleString("en-US");
const fade = (f: number, at: number, len = 10) => interpolate(f, [at, at + len], [0, 1], CLAMP);

const Bar: React.FC<{ text: string; delay?: number; color?: string }> = ({ text, delay = -10, color = C.cream }) => (
  <Panel x={60} y={226} w={960} h={104} delay={delay} seed={60}>
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Lettering size={56} color={color}>
        {text}
      </Lettering>
    </div>
  </Panel>
);

/* a stat that flips onto the board: plates + label */
const Stat: React.FC<{ value: string; label: string; at: number; h?: number; color?: string; sub?: string; count?: number; countLen?: number }> = ({ value, label, at, h = 116, color = C.cream, sub, count, countLen = 26 }) => {
  const frame = useCurrentFrame();
  const flip = useFlip(at, 3);
  let text = value;
  if (count !== undefined) {
    const p = theme.ease.out(interpolate(frame, [at, at + countLen], [0, 1], CLAMP));
    const decimals = value.includes(".") ? value.split(".")[1].length : 0;
    const v = count * p;
    text = decimals ? v.toFixed(decimals) : fmt(Math.round(v));
    text = text.padStart(value.length, " ");
  }
  const lit = frame >= at;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: lit ? 1 : 0.18 }}>
      <Plates text={lit ? text : value.replace(/[0-9]/g, " ")} prev={value.replace(/[0-9]/g, " ")} progress={count === undefined ? flip : () => 1} w={h * 0.62} h={h} gap={6} color={color} glow={lit && color !== C.cream ? C.amberGlow : undefined} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Lettering size={h * 0.42}>{label}</Lettering>
        {sub && (
          <Lettering size={18} font="body" color={C.creamDim} spacing="0.12em">
            {sub}
          </Lettering>
        )}
      </div>
    </div>
  );
};

/* ================= S1 — THE NEWS ================= */
export const s1Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s1", i));
  return { date: s[0].from, name: wordAt(fps, "s1", "ms", 3.14), retired: wordAt(fps, "s1", "retired", 4.38), photo: s[2].from, final: wordAt(fps, "s1", "final", 10.34) };
};

export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const name = useFlip(b.name, 2);
  const years = useFlip(b.retired + 6, 2);
  const spot = interpolate(frame, [4, 30], [0, 1], CLAMP);
  return (
    <SceneShell push={0.02} turnIn={false}>
      <Spotlight on={spot} />
      <Panel x={60} y={250} w={960} h={92} delay={b.date - 6} seed={101}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <Lamp color="#D9483B" glow="rgba(217,72,59,0.6)" on={0.6 + 0.4 * Math.sin(frame / 6)} size={20} />
          <Lettering size={44}>17 NOVEMBER 2026</Lettering>
        </div>
      </Panel>
      <Panel x={60} y={358} w={960} h={420} delay={b.name - 12} seed={102} glow={C.amberGlow} glowOn={frame >= b.final ? 0.7 : 0.2}>
        <div style={{ position: "absolute", top: 40, width: "100%", display: "flex", justifyContent: "center" }}>
          <Plates text="MS DHONI" prev="        " progress={name} w={98} h={150} gap={8} color={C.cream} />
        </div>
        <div style={{ position: "absolute", top: 220, width: "100%", display: "flex", justifyContent: "center", opacity: fade(frame, b.retired + 4, 6) }}>
          <Plates text="2008-2025" prev="         " progress={years} w={62} h={92} gap={6} color={C.creamDim} />
        </div>
        <div style={{ position: "absolute", bottom: 26, width: "100%", textAlign: "center", opacity: fade(frame, b.final - 4) }}>
          <Lettering size={58} color={AMBER} style={{ textShadow: `0 0 24px ${C.amberGlow}` }}>
            END OF AN ERA
          </Lettering>
        </div>
      </Panel>
      <Framed src="dhoni-portrait.jpg" x={190} y={796} w={700} h={560} at={b.photo - 6} position="50% 18%" />
    </SceneShell>
  );
};

/* ================= S2 — WHERE IT ALL BEGAN ================= */
export const s2Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s2", i));
  return { auction: wordAt(fps, "s2", "auction", 3.76), sign: s[1].from, million: wordAt(fps, "s2", "million", 8.76), crore: wordAt(fps, "s2", "crore", 10.88), csk: s[2].from, captain: s[3].from };
};

export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  // the bid climbs in three steps, landing on "million"
  const steps = [b.sign + 10, b.sign + Math.round((b.million - b.sign) * 0.55), b.million];
  const bid = frame >= steps[2] ? 1500000 : frame >= steps[1] ? 1000000 : frame >= steps[0] ? 500000 : 0;
  const prevBid = frame >= steps[2] ? 1000000 : frame >= steps[1] ? 500000 : 0;
  const stepAt = frame >= steps[2] ? steps[2] : frame >= steps[1] ? steps[1] : steps[0];
  const flip = useFlip(stepAt, 2);
  const swap = b.csk - 8;
  return (
    <SceneShell push={0.02}>
      <Bar text="2008 · THE FIRST IPL AUCTION" />
      <Panel x={60} y={346} w={960} h={560} delay={-4} seed={201} closeAt={swap} glow={C.amberGlow} glowOn={frame >= steps[2] ? 0.7 : 0}>
        <div style={{ position: "absolute", left: 50, top: 40 }}>
          <Gavel size={150} strikes={steps} />
        </div>
        <div style={{ position: "absolute", right: 50, top: 60, textAlign: "right" }}>
          <Lettering size={26} font="body" color={C.creamDim} spacing="0.24em">
            WINNING BID
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center", opacity: fade(frame, steps[0] - 2, 4) }}>
          <Plates text={`$${fmt(bid)}`.padStart(10, " ")} prev={`$${fmt(prevBid)}`.padStart(10, " ")} progress={flip} w={84} h={130} gap={6} color={frame >= steps[2] ? AMBER : C.cream} glow={frame >= steps[2] ? C.amberGlow : undefined} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 370, textAlign: "center", opacity: fade(frame, b.crore - 4) }}>
          <Lettering size={44} color={C.creamDim}>
            ≈ ₹6 CRORE AT THE TIME
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center" }}>
          <Stamp text="MOST EXPENSIVE SIGNING · 2008" at={steps[2] + 6} color={AMBER} size={44} rotate={-3} />
        </div>
      </Panel>
      <Framed src="dhoni-toss.jpg" x={150} y={360} w={780} h={790} at={swap + 4} position="50% 30%" />
      <Panel x={60} y={1166} w={960} h={190} delay={b.csk - 4} seed={202} glow="rgba(249,205,27,0.4)" glowOn={frame >= b.captain ? 0.7 : 0}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Lettering size={56} color={YELLOW}>
            CHENNAI SUPER KINGS
          </Lettering>
          <Lettering size={34} color={C.cream} style={{ opacity: fade(frame, b.captain - 2) }}>
            THEY FOUND THEIR CAPTAIN
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S3 — THE CAPTAIN ================= */
export const s3Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4].map((i) => sentence(fps, "s3", i));
  return { m: s[0].from, w: s[1].from, f: s[2].from, t: s[3].from, era: s[4].from, leader: wordAt(fps, "s3", "leader", 12.92) };
};

export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  return (
    <SceneShell push={0.02}>
      <Bar text="THE CAPTAIN" color={YELLOW} />
      <Framed src="dhoni-cap-look.jpg" x={60} y={346} w={400} h={660} at={-2} position="38% 30%" />
      <Panel x={476} y={346} w={544} h={660} delay={-2} seed={301}>
        <div style={{ position: "absolute", left: 30, top: 34, display: "flex", flexDirection: "column", gap: 34 }}>
          <Stat value="235" label="AS CAPTAIN" sub="IPL MATCHES" at={b.m} h={110} />
          <Stat value="136" label="WINS" sub="57.9% WIN RATE" at={b.w} h={110} />
          <Stat value="10" label="FINALS" sub="ALL WITH CHENNAI" at={b.f} h={110} />
          <Stat value="5" label="IPL TITLES" at={b.t} h={110} color={AMBER} />
        </div>
      </Panel>
      <Panel x={60} y={1022} w={960} h={190} delay={b.t - 6} seed={302} glow={C.amberGlow} glowOn={0.4}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 46 }}>
          {[2010, 2011, 2018, 2021, 2023].map((y, i) => {
            const lit = spring({ frame: frame - b.t - 4 - i * 5, fps, config: theme.spring.bouncy });
            return (
              <div key={y} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `scale(${interpolate(lit, [0, 1], [0.7, 1])})` }}>
                <Trophy size={70} lit={Math.min(1, lit)} />
                <Lettering size={30} color={lit > 0.5 ? AMBER : C.creamDim}>
                  {y}
                </Lettering>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel x={60} y={1228} w={960} h={128} delay={b.era - 6} seed={303}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={50}>
            NOT JUST A CAPTAIN. <span style={{ color: AMBER, opacity: fade(frame, b.leader - 4) }}>A LEADER WHO BUILT AN ERA.</span>
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S4 — THE DYNASTY ================= */
export const s4Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s4", i));
  return {
    y10: wordAt(fps, "s4", "2010", 2.02),
    y11: wordAt(fps, "s4", "2011", 3.14),
    y18: wordAt(fps, "s4", "2018", 6.08),
    y21: wordAt(fps, "s4", "2021", 8.32),
    y23: wordAt(fps, "s4", "2023", 9.9),
    fifth: wordAt(fps, "s4", "fifth", 12.2),
    s0: s[0].from,
  };
};

const SEASONS: { y: number; r: "W" | "F" | "-" }[] = [
  { y: 2008, r: "F" }, { y: 2009, r: "-" }, { y: 2010, r: "W" }, { y: 2011, r: "W" }, { y: 2012, r: "F" }, { y: 2013, r: "F" }, { y: 2014, r: "-" }, { y: 2015, r: "F" },
  { y: 2018, r: "W" }, { y: 2019, r: "F" }, { y: 2020, r: "-" }, { y: 2021, r: "W" }, { y: 2022, r: "-" }, { y: 2023, r: "W" }, { y: 2024, r: "-" }, { y: 2025, r: "-" },
];

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const at: Record<number, number> = { 2010: b.y10, 2011: b.y11, 2018: b.y18, 2021: b.y21, 2023: b.y23 };
  const rows = [2010, 2011, 2018, 2021, 2023];
  return (
    <SceneShell push={0.02}>
      <Bar text="THE DYNASTY" color={AMBER} />
      <Panel x={60} y={346} w={960} h={760} delay={-4} seed={401}>
        <div style={{ position: "absolute", left: 70, right: 70, top: 34, display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.map((y, i) => {
            const p = spring({ frame: frame - at[y], fps, config: theme.spring.bouncy });
            const lit = frame >= at[y];
            const fifth = y === 2023;
            return (
              <div key={y} style={{ display: "flex", alignItems: "center", gap: 34, height: 104, opacity: lit ? 1 : 0.2 }}>
                <div style={{ transform: `scale(${interpolate(p, [0, 1], [0.5, 1])}) rotate(${interpolate(p, [0, 1], [-14, 0])}deg)` }}>
                  <Trophy size={78} lit={lit ? Math.min(1, p) : 0} />
                </div>
                <Plates text={String(y)} w={66} h={100} gap={6} color={lit ? AMBER : C.creamDim} glow={lit ? C.amberGlow : undefined} />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <Lettering size={58} color={lit ? C.cream : C.creamDim}>
                    CHAMPIONS
                  </Lettering>
                  <Lettering size={18} font="body" color={C.creamDim} spacing="0.16em">
                    {fifth ? "TITLE NUMBER FIVE" : `TITLE NUMBER ${i + 1}`}
                  </Lettering>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
      {/* every season, at a glance */}
      <Panel x={60} y={1122} w={960} h={234} delay={b.s0 + 6} seed={402}>
        <div style={{ position: "absolute", top: 24, width: "100%", textAlign: "center" }}>
          <Lettering size={20} font="body" color={C.creamDim} spacing="0.2em">
            CSK SEASONS WITH DHONI · ★ CHAMPIONS · ● RUNNERS-UP
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 70, display: "flex", justifyContent: "space-between" }}>
          {SEASONS.map((s, i) => {
            const on = fade(frame, b.s0 + 10 + i * 2, 6);
            const col = s.r === "W" ? AMBER : s.r === "F" ? C.cream : C.creamFaint;
            return (
              <div key={s.y} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: on }}>
                <Lettering size={s.r === "W" ? 38 : 30} color={col}>
                  {s.r === "W" ? "★" : s.r === "F" ? "●" : "·"}
                </Lettering>
                <Lettering size={22} color={s.r === "-" ? C.creamDim : col} style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                  {String(s.y)}
                </Lettering>
              </div>
            );
          })}
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 0, right: 0, top: 985, display: "flex", justifyContent: "center", zIndex: 5 }}>
        <Stamp text="5 × CHAMPIONS" at={b.fifth} color={AMBER} size={74} rotate={-4} />
      </div>
    </SceneShell>
  );
};

/* ================= S5 — THE BATTER AND FINISHER ================= */
export const s5Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4, 5].map((i) => sentence(fps, "s5", i));
  return { batter: s[0].from, runs: s[1].from, avg: s[2].from, sr: s[3].from, fifties: s[4].from, sixes: s[5].from, sixWord: wordAt(fps, "s5", "sixes", 15.44) };
};

export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  return (
    <SceneShell push={0.02} shakeFrames={[b.sixWord]}>
      <Bar text="THE BATTER · THE FINISHER" />
      <Framed src="dhoni-bat.jpg" x={60} y={346} w={420} h={780} at={-2} position="45% 25%" />
      <Panel x={496} y={346} w={524} h={780} delay={-2} seed={501}>
        <div style={{ position: "absolute", left: 28, top: 30, display: "flex", flexDirection: "column", gap: 26 }}>
          <Stat value="278" label="MATCHES" at={b.batter} h={84} />
          <Stat value="5,439" label="RUNS" at={b.runs} h={84} count={5439} />
          <Stat value="38.30" label="AVERAGE" at={b.avg} h={84} count={38.3} />
          <Stat value="137.45" label="STRIKE RATE" at={b.sr} h={84} count={137.45} />
          <Stat value="24" label="FIFTIES" at={b.fifties} h={84} />
          <Stat value="264" label="SIXES" at={b.sixes} h={84} count={264} countLen={b.sixWord - b.sixes + 4} color={AMBER} />
        </div>
      </Panel>
      <Panel x={60} y={1142} w={960} h={214} delay={b.sixWord + 2} seed={502}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          {[
            { v: "375", l: "FOURS" },
            { v: "100", l: "NOT OUTS" },
            { v: "84*", l: "HIGHEST" },
          ].map((x, i) => (
            <div key={x.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: fade(frame, b.sixWord + 8 + i * 8) }}>
              <Lettering size={84} color={C.cream}>
                {x.v}
              </Lettering>
              <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
                {x.l}
              </Lettering>
            </div>
          ))}
        </div>
      </Panel>
      <SixBall at={b.sixWord - 2} />
    </SceneShell>
  );
};

/* ================= S6 — BEHIND THE STUMPS ================= */
export const s6Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s6", i));
  return { d: s[1].from, c: wordAt(fps, "s6", "158", 6.86), st: wordAt(fps, "s6", "47", 8.86), rec: s[3].from };
};

export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const c205 = theme.ease.out(interpolate(frame, [b.d, b.d + 30], [0, 1], CLAMP));
  return (
    <SceneShell push={0.02} shakeFrames={[b.st + 4]}>
      <Bar text="BEHIND THE STUMPS" />
      <Panel x={60} y={346} w={960} h={420} delay={-4} seed={601}>
        <div style={{ position: "absolute", left: 120, top: 70 }}>
          <Glove size={260} catchAt={b.c + 2} />
        </div>
        <div style={{ position: "absolute", right: 160, top: 60 }}>
          <Stumps w={190} hit={b.st + 4} />
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, bottom: 22, display: "flex", justifyContent: "space-between" }}>
          <Lettering size={22} font="body" color={frame >= b.c ? AMBER : C.creamDim} spacing="0.2em">
            THE CATCH
          </Lettering>
          <Lettering size={22} font="body" color={frame >= b.st ? AMBER : C.creamDim} spacing="0.2em">
            THE STUMPING
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={782} w={960} h={400} delay={b.d - 6} seed={602} glow={C.amberGlow} glowOn={frame >= b.rec ? 0.6 : 0}>
        <div style={{ position: "absolute", top: 34, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
          <Plates text={String(Math.round(205 * c205)).padStart(3, " ")} w={110} h={170} gap={10} color={AMBER} glow={C.amberGlow} />
          <Lettering size={64}>DISMISSALS</Lettering>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 240, display: "flex", justifyContent: "center", gap: 90 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, opacity: fade(frame, b.c - 2) }}>
            <Lettering size={96}>158</Lettering>
            <Lettering size={40} color={C.creamDim}>
              CATCHES
            </Lettering>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, opacity: fade(frame, b.st - 2) }}>
            <Lettering size={96}>47</Lettering>
            <Lettering size={40} color={C.creamDim}>
              STUMPINGS
            </Lettering>
          </div>
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1214, display: "flex", justifyContent: "center" }}>
        <Stamp text="IPL WICKETKEEPING RECORD" at={b.rec} color={AMBER} size={72} rotate={-3} />
      </div>
    </SceneShell>
  );
};

/* ================= S7 — THE FINAL YEARS ================= */
export const s7Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s7", i));
  return { y24: wordAt(fps, "s7", "2024", 0.38), sr: wordAt(fps, "s7", "220", 4.36), rarer: s[1].from, crowd: s[2].from, walk: wordAt(fps, "s7", "walk", 12.18) };
};

export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const c = theme.ease.out(interpolate(frame, [b.sr - 16, b.sr + 6], [0, 1], CLAMP));
  return (
    <SceneShell push={0.015}>
      <PhotoBg src="dhoni-back-7.jpg" position="50% 30%" dark={0.35} from={0} len={420} zoom={[1.02, 1.12]} />
      <Panel x={60} y={250} w={960} h={300} delay={b.y24 - 6} seed={701} glow={C.amberGlow} glowOn={c >= 1 ? 0.6 : 0}>
        <div style={{ position: "absolute", left: 40, top: 30, display: "flex", flexDirection: "column", gap: 8 }}>
          <Lettering size={56} color={YELLOW}>
            IPL 2024
          </Lettering>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.16em">
            AGE 42 · STRIKE RATE
          </Lettering>
        </div>
        <div style={{ position: "absolute", right: 40, top: 40, opacity: fade(frame, b.sr - 18, 6) }}>
          <Plates text={(220.55 * c).toFixed(2).padStart(6, " ")} w={80} h={124} gap={6} color={AMBER} glow={C.amberGlow} />
        </div>
        <div style={{ position: "absolute", left: 40, bottom: 26, opacity: fade(frame, b.sr + 8) }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.12em">
            161 RUNS OFF 73 BALLS
          </Lettering>
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1180, textAlign: "center", opacity: fade(frame, b.walk - 6, 14) }}>
        <Lettering size={66} color={C.cream} style={{ textShadow: "0 4px 18px rgba(0,0,0,0.8)" }}>
          ONE MAN. ONE WALK OUT.
        </Lettering>
      </div>
    </SceneShell>
  );
};

/* ================= S8 — THE FINAL CHAPTER ================= */
export const s8Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s8", i));
  return { y25: s[0].from, y26: s[1].from, mentor: wordAt(fps, "s8", "mentor", 10.5), end: wordAt(fps, "s8", "end", 14.12) };
};

export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  const rows = [
    { y: "2008", t: "THE BEGINNING", s: "FIRST IPL SEASON", at: 2 },
    { y: "2025", t: "FINAL IPL APPEARANCE", s: "25 MAY 2025 · CSK v GT, AHMEDABAD", at: b.y25 },
    { y: "2026", t: "RETIREMENT ANNOUNCED", s: "MISSED THE SEASON INJURED · RETIRED 17 NOV", at: b.y26 },
    { y: "2027", t: "CSK TEAM MENTOR", s: "A NEW ROLE BEGINS", at: b.mentor - 8 },
  ];
  const seven = fade(frame, b.end + 12, 24);
  return (
    <SceneShell push={0.01} turnOut={false}>
      <Bar text="THE FINAL CHAPTER" />
      <Panel x={60} y={346} w={960} h={860} delay={-4} seed={801} closeAt={b.end + 6}>
        <div style={{ position: "absolute", left: 70, top: 50, bottom: 50, width: 4, background: C.panelEdge }} />
        <div style={{ position: "absolute", left: 40, right: 40, top: 40, display: "flex", flexDirection: "column", gap: 54 }}>
          {rows.map((r, i) => {
            const p = spring({ frame: frame - r.at, fps, config: theme.spring.smooth });
            const lit = frame >= r.at;
            return (
              <div key={r.y} style={{ display: "flex", alignItems: "center", gap: 34, opacity: lit ? interpolate(p, [0, 0.4], [0.2, 1], CLAMP) : 0.15, transform: `translateX(${interpolate(p, [0, 1], [30, 0])}px)` }}>
                <div style={{ width: 64, display: "flex", justifyContent: "center" }}>
                  <Lamp color={i === 3 ? YELLOW : AMBER} glow={C.amberGlow} on={lit ? 1 : 0} size={28} />
                </div>
                <Plates text={r.y} w={60} h={92} gap={6} color={lit ? (i === 3 ? YELLOW : C.cream) : C.creamDim} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Lettering size={50}>{r.t}</Lettering>
                  <Lettering size={18} font="body" color={C.creamDim} spacing="0.12em">
                    {r.s}
                  </Lettering>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
      {/* the empty ground, one number lit */}
      <div style={{ position: "absolute", inset: 0, opacity: seven * 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spotlight on={seven} />
        <div style={{ transform: `scale(${interpolate(seven, [0, 1], [0.9, 1])})`, marginTop: -80 }}>
          <Lettering size={520} color={YELLOW} style={{ textShadow: `0 0 80px rgba(249,205,27,${0.5 * seven}), 0 0 160px rgba(249,205,27,${0.3 * seven})` }}>
            7
          </Lettering>
        </div>
      </div>
    </SceneShell>
  );
};

/* ================= S9 — THE TRIBUTE ================= */
export const s9Beats = (fps: number) => {
  const s = [0, 1, 2, 3, 4].map((i) => sentence(fps, "s9", i));
  return { a: s[0].from, legacy: s[1].from, emotion: s[2].from, thanks: s[3].from, brand: s[4].from - 6 };
};

export const S9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s9Beats(fps);
  // montage: each photo holds ~2.2 s and cross-fades
  const shots = [
    { src: "dhoni-toss.jpg", pos: "50% 30%" },
    { src: "dhoni-bat.jpg", pos: "50% 25%" },
    { src: "dhoni-cap-look.jpg", pos: "40% 30%" },
    { src: "dhoni-back-7.jpg", pos: "50% 30%" },
  ];
  const seg = Math.round(fps * 2.1);
  const montageEnd = b.emotion;
  const finalOn = fade(frame, montageEnd - 10, 24);
  const statsOn = fade(frame, b.legacy - 6, 12) * (1 - fade(frame, b.thanks - 16, 14));
  const thanks = spring({ frame: frame - b.thanks, fps, config: theme.spring.heavy });
  return (
    <SceneShell push={0} turnOut={false}>
      {shots.map((s, i) => {
        const t0 = i * seg;
        const on = interpolate(frame, [t0 - 10, t0 + 6, t0 + seg, t0 + seg + 14], [0, 1, 1, 0], CLAMP) * (frame < montageEnd + 10 ? 1 : 0);
        return <PhotoBg key={s.src} src={s.src} position={s.pos} on={on} dark={0.4} from={t0} len={seg + 20} zoom={[1.03, 1.1]} />;
      })}
      <PhotoBg src="dhoni-portrait.jpg" position="50% 20%" on={finalOn} dark={0.32} from={montageEnd} len={500} zoom={[1.0, 1.08]} />
      <div style={{ position: "absolute", left: 60, top: 240, width: 960, opacity: statsOn }}>
        <Panel x={0} y={0} w={960} h={600} delay={b.legacy - 6} seed={901}>
          <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
            <Lettering size={84} color={YELLOW}>
              MS DHONI
            </Lettering>
          </div>
          <div style={{ position: "absolute", left: 80, right: 80, top: 140, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["278", "MATCHES"],
              ["5,439", "RUNS"],
              ["136", "CAPTAINCY WINS"],
              ["205", "WICKETKEEPING DISMISSALS"],
              ["5", "IPL TITLES"],
            ].map(([v, l], i) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: fade(frame, b.legacy + i * 7, 8), borderBottom: `2px solid ${C.panelEdge}`, paddingBottom: 6 }}>
                <Lettering size={54} color={i === 4 ? AMBER : C.cream}>
                  {v}
                </Lettering>
                <Lettering size={36} color={C.creamDim}>
                  {l}
                </Lettering>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, height: 300, background: "linear-gradient(180deg, rgba(8,12,10,0), rgba(8,12,10,0.82) 30%, rgba(8,12,10,0.82) 70%, rgba(8,12,10,0))", opacity: interpolate(thanks, [0, 0.4], [0, 1], CLAMP) }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: interpolate(thanks, [0, 0.4], [0, 1], CLAMP), transform: `translateY(${interpolate(thanks, [0, 1], [30, 0])}px)` }}>
        <Lettering size={120} color={YELLOW} style={{ textShadow: "0 6px 30px rgba(0,0,0,0.85), 0 0 40px rgba(249,205,27,0.35)" }}>
          THANK YOU, THALA 💛
        </Lettering>
        <div style={{ opacity: fade(frame, b.brand, 14) }}>
          <Lettering size={40} font="body" color={C.cream} spacing="0.3em" style={{ textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}>
            BEYOND THE SCOREBOARD
          </Lettering>
        </div>
      </div>
    </SceneShell>
  );
};
