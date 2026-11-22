// Devdutt Padikkal: has India found its No.3? Six scenes timed to the narration.
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "../components/Motion";
import { Lettering, Panel } from "../components/Panel";
import { SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { AMBER, GREEN, RED, Stamp } from "../components/Toss";
import { Framed } from "../components/Tribute";
import { theme } from "../theme";
import { sentence, wordAt } from "../timing";
import { useFlip } from "./common";

const C = theme.colors;
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

/* ================= S1 — THE SEARCH ================= */
export const s1Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s1", i));
  return { tried: wordAt(fps, "s1", "tried", 3.26), easy: s[1].from, name: s[2].from, a: wordAt(fps, "s1", "167", 12.64), b: wordAt(fps, "s1", "117", 14.52), c: wordAt(fps, "s1", "80", 15.7) };
};
const TRIED = ["SHUBMAN GILL", "VIRAT KOHLI", "DEVDUTT PADIKKAL", "KL RAHUL", "SAI SUDHARSAN", "KARUN NAIR", "WASHINGTON SUNDAR"];

export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const fa = useFlip(b.a - 2, 3), fb = useFlip(b.b - 2, 3), fc = useFlip(b.c - 2, 3);
  return (
    <SceneShell push={0.02} turnIn={false}>
      <Bar text="INDIA'S NEW No.3" delay={-14} color={AMBER} />
      <Framed src="pad-arms-wide.jpg" x={60} y={346} w={960} h={540} at={-8} position="50% 30%" />
      <Panel x={60} y={902} w={960} h={210} delay={b.tried - 8} seed={101}>
        <div style={{ position: "absolute", top: 18, width: "100%", textAlign: "center" }}>
          <Lettering size={20} font="body" color={C.creamDim} spacing="0.18em">
            INDIA'S No.3s SINCE PUJARA'S LAST TEST · JUNE 2023
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 58, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
          {TRIED.map((n, i) => {
            const on = fade(frame, b.tried + i * 3, 4);
            const pick = n === "DEVDUTT PADIKKAL";
            const lit = frame >= b.easy;
            return (
              <div key={n} style={{ padding: "8px 14px 6px", borderRadius: 6, background: pick && lit ? AMBER : C.plate, boxShadow: `inset 0 0 0 2px ${C.panelEdge}`, opacity: on * (lit && !pick ? 0.35 : 1) }}>
                <Lettering size={28} color={pick && lit ? C.board : C.cream}>
                  {n}
                </Lettering>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel x={60} y={1128} w={960} h={228} delay={b.name - 6} seed={102} glow={C.amberGlow} glowOn={frame >= b.c ? 0.7 : 0}>
        <div style={{ position: "absolute", top: 16, width: "100%", textAlign: "center" }}>
          <Lettering size={20} font="body" color={C.creamDim} spacing="0.18em">
            HIS LAST THREE FIRST-INNINGS SCORES
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 56, width: "100%", display: "flex", justifyContent: "center", gap: 40 }}>
          {[
            { t: "167", p: fa, w: "GALLE" },
            { t: "117", p: fb, w: "COLOMBO" },
            { t: " 80", p: fc, w: "WELLINGTON" },
          ].map((x) => (
            <div key={x.w} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <Plates text={x.t} prev="   " progress={x.p} w={62} h={96} gap={6} color={AMBER} glow={C.amberGlow} />
              <Lettering size={18} font="body" color={C.creamDim} spacing="0.14em">
                {x.w}
              </Lettering>
            </div>
          ))}
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S2 — THE NUMBER 3s SINCE PUJARA ================= */
export const s2Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s2", i));
  return { q: s[0].from, gill: wordAt(fps, "s2", "37", 4.36), sai: wordAt(fps, "s2", "32", 6.72), nair: wordAt(fps, "s2", "28", 8.4), pad: wordAt(fps, "s2", "72", 9.86), bench: wordAt(fps, "s2", "benchmark", 11.5), n44: wordAt(fps, "s2", "44", 14.64) };
};

export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const rows = [
    { n: "SHUBMAN GILL", s: "29 INNINGS · 3 HUNDREDS", v: 37.4, at: b.gill - 6 },
    { n: "SAI SUDHARSAN", s: "12 INNINGS · 0 HUNDREDS", v: 31.9, at: b.sai - 6 },
    { n: "KARUN NAIR", s: "4 INNINGS", v: 27.8, at: b.nair - 6 },
    { n: "DEVDUTT PADIKKAL", s: "6 INNINGS · 2 HUNDREDS", v: 72.2, at: b.pad - 6, pick: true },
  ];
  const MAX = 80;
  const benchO = fade(frame, b.bench, 10);
  return (
    <SceneShell push={0.015} shakeFrames={[b.pad + 6]}>
      <Bar text="No.3 SINCE PUJARA" />
      <Panel x={60} y={346} w={960} h={700} delay={b.q - 6} seed={201}>
        <div style={{ position: "absolute", top: 22, left: 40, right: 40, display: "flex", justifyContent: "space-between" }}>
          <Lettering size={20} font="body" color={C.creamDim} spacing="0.16em">
            TEST AVERAGE AT No.3 · JUNE 2023 – NOV 2026
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 40, right: 40, top: 130, bottom: 40 }}>
          {/* Pujara benchmark */}
          <div style={{ position: "absolute", left: 290 + (590 * 44.4) / MAX, top: -10, bottom: -10, width: 0, borderLeft: `3px dashed ${C.cream}`, opacity: benchO, zIndex: 3 }} />
          <div style={{ position: "absolute", left: 290 + (590 * 44.4) / MAX + 10, top: -44, opacity: benchO }}>
            <Lettering size={24} color={C.cream}>
              PUJARA'S CAREER AT No.3: 44.4
            </Lettering>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 38 }}>
            {rows.map((r) => {
              const p = theme.ease.out(interpolate(frame, [r.at, r.at + 18], [0, 1], CLAMP));
              const col = r.pick ? AMBER : C.creamDim;
              return (
                <div key={r.n} style={{ display: "flex", alignItems: "center", gap: 20, opacity: interpolate(p, [0, 0.2], [0.15, 1], CLAMP) }}>
                  <div style={{ width: 270, display: "flex", flexDirection: "column", gap: 4 }}>
                    <Lettering size={36} color={r.pick ? AMBER : C.cream}>
                      {r.n}
                    </Lettering>
                    <Lettering size={15} font="body" color={C.creamDim} spacing="0.12em">
                      {r.s}
                    </Lettering>
                  </div>
                  <div style={{ width: 590, height: 64, borderRadius: 6, background: C.plate, position: "relative" }}>
                    <div style={{ width: `${(r.v / MAX) * 100 * p}%`, height: "100%", borderRadius: 6, background: col, boxShadow: r.pick ? `0 0 18px ${C.amberGlow}` : undefined }} />
                    <div style={{ position: "absolute", left: 14, top: 8 }}>
                      <Lettering size={48} color={C.board}>
                        {(r.v * p).toFixed(1)}
                      </Lettering>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>
      <Framed src="pad-running.jpg" x={60} y={1062} w={960} h={294} at={b.pad - 10} position="50% 8%" />
      <div style={{ position: "absolute", left: 60, right: 60, top: 1012, textAlign: "center", opacity: fade(frame, b.nair) }}>
        <Lettering size={15} font="body" weight={500} color={C.creamDim} spacing="0.08em">
          ALSO AT No.3: KOHLI 35.0 · SUNDAR 30.0 · RAHUL 12.0 (2 INNINGS EACH) · PADIKKAL INCLUDES WELLINGTON 80 · SAI INCLUDES THE 2026 AFGHANISTAN TEST
        </Lettering>
      </div>
    </SceneShell>
  );
};

/* ================= S3 — THE ROAD TO No.3 ================= */
export const s3Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s3", i));
  return { debut: wordAt(fps, "s3", "65", 2.26), perth: wordAt(fps, "s3", "duck", 6.22), out: wordAt(fps, "s3", "almost", 7.36), galle: wordAt(fps, "s3", "167", 11.38), colombo: wordAt(fps, "s3", "117", 17.1), well: s[2].from, wadekar: wordAt(fps, "s3", "ajit", 26.44) };
};

export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  const cards = [
    { y: "MAR 2024", w: "DHARAMSALA v ENG", s: "65", note: "DEBUT · BATTING AT No.4", at: b.debut - 6, c: C.cream },
    { y: "NOV 2024", w: "PERTH v AUS", s: "0 & 25", note: "AT No.3 · HAZLEWOOD TWICE", at: b.perth - 6, c: RED },
    { y: "2025 – 26", w: "OUT OF THE TEST SIDE", s: "21 MONTHS", note: "", at: b.out - 4, c: C.creamDim },
    { y: "AUG 2026", w: "GALLE v SL", s: "167", note: "FIRST TEST HUNDRED", at: b.galle - 6, c: AMBER },
    { y: "AUG 2026", w: "COLOMBO v SL", s: "117", note: "BACK-TO-BACK HUNDREDS", at: b.colombo - 6, c: AMBER },
    { y: "NOV 2026", w: "WELLINGTON v NZ", s: "80", note: "ONLY WADEKAR (143, 1968) MORE AT No.3 THERE", at: b.well + 40, c: GREEN },
  ];
  const photo2 = frame >= b.colombo - 10;
  return (
    <SceneShell push={0.012}>
      <Bar text="THE ROAD TO No.3" />
      <div style={{ position: "absolute", left: 60, top: 346, width: 600, display: "flex", flexDirection: "column", gap: 12 }}>
        {cards.map((c, i) => {
          const p = spring({ frame: frame - c.at, fps, config: theme.spring.smooth });
          const lit = frame >= c.at;
          return (
            <div key={i} style={{ position: "relative", height: 156, borderRadius: 10, background: `linear-gradient(180deg, ${C.panelHi}, ${C.board})`, boxShadow: `inset 0 0 0 2px ${lit && c.c === AMBER ? AMBER + "88" : C.panelEdge}`, opacity: lit ? interpolate(p, [0, 0.3], [0.15, 1], CLAMP) : 0.12, transform: `translateX(${interpolate(p, [0, 1], [-30, 0])}px)` }}>
              <div style={{ position: "absolute", left: 24, top: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                <Lettering size={17} font="body" color={C.creamDim} spacing="0.16em">
                  {c.y}
                </Lettering>
                <Lettering size={36}>{c.w}</Lettering>
                {c.note && (
                  <Lettering size={15} font="body" color={c.c === C.creamDim ? C.creamDim : c.c} spacing="0.1em">
                    {c.note}
                  </Lettering>
                )}
              </div>
              <div style={{ position: "absolute", right: 24, top: 0, bottom: 0, display: "flex", alignItems: "center" }}>
                <Lettering size={c.s.length > 4 ? 44 : 80} color={c.c}>
                  {c.s}
                </Lettering>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ opacity: photo2 ? 0 : 1 }}>
        <Framed src="pad-celebrate-boards.jpg" x={676} y={346} w={344} h={1010} at={b.galle - 10} position="38% 40%" />
      </div>
      <div style={{ opacity: photo2 ? 1 : 0 }}>
        <Framed src="pad-raise-bat-trees.jpg" x={676} y={346} w={344} h={1010} at={b.colombo - 10} position="58% 40%" />
      </div>
    </SceneShell>
  );
};

/* ================= S4 — TIME AT THE CREASE ================= */
export const s4Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s4", i));
  return { time: s[0].from, puj: wordAt(fps, "s4", "101", 3.82), others: wordAt(fps, "s4", "61", 9.36), pad: wordAt(fps, "s4", "128", 11.26), faster: wordAt(fps, "s4", "faster", 15.72) };
};

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const bars = [
    { n: "PUJARA", s: "CAREER AT No.3", v: 101, at: b.puj - 6, c: C.cream },
    { n: "THE OTHERS", s: "No.3s SINCE PUJARA", v: 61, at: b.others - 6, c: RED },
    { n: "PADIKKAL", s: "AT No.3", v: 128, at: b.pad - 6, c: AMBER },
  ];
  const H = 560, MAX = 140;
  return (
    <SceneShell push={0.015} shakeFrames={[b.pad + 6]}>
      <Bar text="THE REAL CURRENCY: TIME" color={AMBER} />
      <Panel x={60} y={346} w={960} h={760} delay={b.time - 6} seed={401}>
        <div style={{ position: "absolute", top: 22, width: "100%", textAlign: "center" }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.16em">
            BALLS FACED PER DISMISSAL
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 70, height: H + 120, display: "flex", justifyContent: "space-around", alignItems: "flex-end" }}>
          {bars.map((x) => {
            const p = theme.ease.out(interpolate(frame, [x.at, x.at + 20], [0, 1], CLAMP));
            return (
              <div key={x.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: interpolate(p, [0, 0.15], [0.15, 1], CLAMP) }}>
                <Lettering size={72} color={x.c}>
                  {String(Math.round(x.v * p))}
                </Lettering>
                <div style={{ width: 200, height: (H * x.v * p) / MAX, borderRadius: 8, background: x.c, boxShadow: x.c === AMBER ? `0 0 20px ${C.amberGlow}` : undefined }} />
                <Lettering size={38}>{x.n}</Lettering>
                <Lettering size={16} font="body" color={C.creamDim} spacing="0.12em">
                  {x.s}
                </Lettering>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel x={60} y={1122} w={960} h={234} delay={b.pad + 10} seed={402} glow={C.amberGlow} glowOn={frame >= b.faster ? 0.6 : 0}>
        <div style={{ position: "absolute", top: 20, width: "100%", textAlign: "center" }}>
          <Lettering size={20} font="body" color={C.creamDim} spacing="0.16em">
            STRIKE RATE AT No.3 · RUNS PER 100 BALLS
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 64, width: "100%", display: "flex", justifyContent: "center", alignItems: "baseline", gap: 40 }}>
          <Lettering size={34} color={C.creamDim}>
            PUJARA
          </Lettering>
          <Lettering size={90}>43.9</Lettering>
          <Lettering size={34} color={C.creamDim} style={{ opacity: fade(frame, b.faster - 10) }}>
            PADIKKAL
          </Lettering>
          <Lettering size={90} color={AMBER} style={{ opacity: fade(frame, b.faster - 10) }}>
            56.5
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S5 — PADIKKAL v SAI SUDHARSAN ================= */
export const s5Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s5", i));
  return { cmp: s[0].from, fc: s[1].from, forties: wordAt(fps, "s5", "40s", 8.28), tens: wordAt(fps, "s5", "10", 9.66), tests: s[2].from, n71: wordAt(fps, "s5", "71", 11.96), none: wordAt(fps, "s5", "none", 15.04), sai: s[3].from, belongs: wordAt(fps, "s5", "belongs", 21.02) };
};

const Row: React.FC<{ l: string; a: string; b: string; at: number; win?: "a" | "b" | "tie" }> = ({ l, a, b, at, win }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", height: 66, opacity: fade(frame, at, 8) }}>
      <div style={{ width: 230, textAlign: "left" }}>
        <Lettering size={50} color={win === "a" ? AMBER : C.cream}>
          {a}
        </Lettering>
      </div>
      <Lettering size={20} font="body" color={C.creamDim} spacing="0.14em">
        {l}
      </Lettering>
      <div style={{ width: 230, textAlign: "right" }}>
        <Lettering size={50} color={win === "b" ? AMBER : C.cream}>
          {b}
        </Lettering>
      </div>
    </div>
  );
};

export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  return (
    <SceneShell push={0.012}>
      <Bar text="PADIKKAL v SAI SUDHARSAN" />
      <Panel x={60} y={346} w={960} h={130} delay={b.cmp - 4} seed={501}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 90, height: 90, borderRadius: 45, overflow: "hidden", boxShadow: `0 0 0 3px ${AMBER}` }}>
              <Img src={staticFile("photos/pad-bat-helmet.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 18%" }} />
            </div>
            <Lettering size={46} color={AMBER}>
              PADIKKAL
            </Lettering>
          </div>
          <Lettering size={30} color={C.creamDim}>
            v
          </Lettering>
          <Lettering size={46}>SAI SUDHARSAN</Lettering>
        </div>
      </Panel>
      <Panel x={60} y={492} w={960} h={420} delay={b.fc - 6} seed={502}>
        <div style={{ position: "absolute", top: 18, width: "100%", textAlign: "center" }}>
          <Lettering size={30} color={C.cream}>
            FIRST-CLASS
          </Lettering>
          <span style={{ marginLeft: 14 }}>
            <Lettering size={16} font="body" color={C.creamDim} spacing="0.12em">
              ALMOST IDENTICAL
            </Lettering>
          </span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 66 }}>
          <Row l="MATCHES" a="57" b="42" at={b.fc + 4} />
          <Row l="RUNS" a="4,011" b="3,004" at={b.fc + 10} />
          <Row l="AVERAGE" a="44.6" b="42.9" at={b.forties - 4} win="tie" />
          <Row l="HUNDREDS" a="10" b="10" at={b.tens - 2} win="tie" />
          <Row l="BEST" a="232" b="213" at={b.tens + 8} />
        </div>
      </Panel>
      <Panel x={60} y={928} w={960} h={428} delay={b.tests - 6} seed={503} glow={C.amberGlow} glowOn={frame >= b.n71 ? 0.6 : 0}>
        <div style={{ position: "absolute", top: 18, width: "100%", textAlign: "center" }}>
          <Lettering size={30} color={AMBER}>
            TESTS
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 66 }}>
          <Row l="INNINGS" a="7" b="12" at={b.tests + 2} />
          <Row l="AVERAGE" a="71.1" b="31.9" at={b.n71 - 4} win="a" />
          <Row l="HUNDREDS" a="2" b="0" at={b.none - 10} win="a" />
          <Row l="BALLS PER DISMISSAL" a="124" b="71" at={b.none + 6} win="a" />
          <Row l="BEST" a="167" b="87" at={b.none + 14} win="a" />
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S6 — THE VERDICT ================= */
export const s6Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s6", i));
  return { small: s[0].from, runs: s[1].from, found: s[2].from, three: wordAt(fps, "s6", "three", 11.1, 1), brand: s[3].from - 8 };
};

export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const brand = spring({ frame: frame - b.brand, fps, config: theme.spring.heavy });
  return (
    <SceneShell push={0} pull={0.03} turnOut={false}>
      <Bar text="THE VERDICT" />
      <Framed src="pad-smile.jpg" x={60} y={346} w={960} h={520} at={-6} position="50% 22%" />
      <Panel x={60} y={882} w={960} h={170} delay={b.small - 4} seed={601}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          {[
            { v: "7", l: "INNINGS" },
            { v: "498", l: "RUNS" },
            { v: "71.1", l: "AVERAGE" },
            { v: "2", l: "HUNDREDS" },
          ].map((x, i) => (
            <div key={x.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: fade(frame, b.small + i * 6) }}>
              <Lettering size={70} color={i >= 2 ? AMBER : C.cream}>
                {x.v}
              </Lettering>
              <Lettering size={18} font="body" color={C.creamDim} spacing="0.18em">
                {x.l}
              </Lettering>
            </div>
          ))}
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1076, display: "flex", justifyContent: "center" }}>
        <Stamp text="INDIA HAVE FOUND THEIR No.3" at={b.three - 6} color={AMBER} size={58} rotate={-3} />
      </div>
      <div style={{ position: "absolute", left: 60, top: 1196, width: 960, opacity: interpolate(brand, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(brand, [0, 1], [0.94, 1])})` }}>
        <Panel x={0} y={0} w={960} h={160} delay={b.brand} seed={603}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Lettering size={22} font="body" color={C.creamDim} spacing="0.3em">
              STORIES TOLD WITH DATA
            </Lettering>
            <Lettering size={72} spacing="0.03em">
              BEYOND THE SCOREBOARD
            </Lettering>
          </div>
        </Panel>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1366, textAlign: "center", opacity: fade(frame, b.brand + 10) }}>
        <Lettering size={14} font="body" weight={500} color={C.creamDim} spacing="0.06em">
          TESTS TO 22 NOV 2026 INCL. WELLINGTON 80 · CRICSHEET BALL-BY-BALL DATA · FIRST-CLASS: ESPNCRICINFO VIA WIKIPEDIA (PADIKKAL AUG 2026, SAI JUL 2026) · BALLS/DISMISSAL FROM BALL-BY-BALL INNINGS
        </Lettering>
      </div>
    </SceneShell>
  );
};
