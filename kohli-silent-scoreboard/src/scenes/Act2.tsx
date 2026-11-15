// Scenes 4–6: the weight of expectations, the twist, the first breakthrough.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "../components/Motion";
import { Lamp, Lettering, Panel } from "../components/Panel";
import { Clock, SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { formatCompare, verdicts } from "../data";
import { theme, toneColor, toneGlow } from "../theme";
import { sentence, wordAt } from "../timing";
import { Divider, Reveal, useAt, useFlip } from "./common";

const C = theme.colors;

// ---------------- SCENE 4 — THE WEIGHT OF EXPECTATIONS ----------------
export const S4: React.FC = () => {
  const { fps } = useVideoConfig();
  const greatness = wordAt(fps, "s4", "batter", 4.2);
  const wait = wordAt(fps, "s4", "silence", 6.0);
  const waitP = useAt(wait, theme.spring.smooth);
  return (
    <SceneShell push={0.03}>
      <Panel x={60} y={226} w={960} h={360} delay={0} seed={41}>
        <div style={{ position: "absolute", left: 44, top: 30 }}>
          <Clock size={300} />
        </div>
        <div style={{ position: "absolute", left: 400, top: 70, right: 40, display: "flex", flexDirection: "column", gap: 14 }}>
          <Lettering size={98}>TEST CENTURY</Lettering>
          <Lettering size={98}>COUNTER</Lettering>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.24em" style={{ marginTop: 8 }}>
            CALENDAR YEAR · HUNDREDS
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={606} w={960} h={384} delay={6} seed={42}>
        {[2020, 2021, 2022].map((y, i) => (
          <Reveal key={y} at={10 + i * 6} style={{ position: "absolute", top: 36 + i * 116, left: 80, right: 80 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 100 }}>
              <Lettering size={84}>{y}</Lettering>
              <div style={{ flex: 1, margin: "0 40px", borderTop: `3px dotted ${C.creamFaint}` }} />
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <Plates text="00" w={78} h={100} gap={8} color={C.cream} />
                <Lamp color={C.red} glow={C.redGlow} on={1} />
              </div>
            </div>
          </Reveal>
        ))}
      </Panel>
      <Panel x={60} y={1010} w={960} h={330} delay={greatness - 6} seed={43}>
        <div style={{ position: "absolute", top: 54, width: "100%", textAlign: "center" }}>
          <Lettering size={74}>GREATNESS CHANGES EXPECTATIONS</Lettering>
        </div>
        <Divider y={160} on={Math.min(1, waitP)} />
        <div
          style={{
            position: "absolute",
            top: 190,
            width: "100%",
            textAlign: "center",
            opacity: interpolate(waitP, [0, 0.5], [0, 1], CLAMP),
            transform: `translateY(${interpolate(waitP, [0, 1], [20, 0])}px)`,
          }}
        >
          <Lettering size={96} color={C.red} style={{ textShadow: `0 0 22px ${C.redGlow}` }}>
            THE WAIT CONTINUES
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

// ---------------- SCENE 5 — THE TWIST ----------------
export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rowsAt = [sentence(fps, "s5", 0).from + 10, sentence(fps, "s5", 1).from, wordAt(fps, "s5", "t20", 6.0)];
  const bars = wordAt(fps, "s5", "producing", 7.0) - 8;
  const maxW = 560;
  const barP = (i: number) => interpolate(frame, [bars + i * 5, bars + i * 5 + Math.round(fps * 0.8)], [0, 1], { easing: theme.ease.out, ...CLAMP });
  return (
    <SceneShell push={0.03}>
      <Panel x={60} y={226} w={960} h={440} delay={0} seed={51}>
        <div style={{ position: "absolute", top: 30, left: 60, right: 60, display: "flex", justifyContent: "space-between" }}>
          <Lettering size={24} font="body" color={C.creamDim} spacing="0.26em">
            FORMAT
          </Lettering>
          <Lettering size={24} font="body" color={C.creamDim} spacing="0.26em">
            VERDICT · 2020–22
          </Lettering>
        </div>
        {verdicts.map((v, i) => (
          <Reveal key={v.format} at={rowsAt[i]} style={{ position: "absolute", top: 80 + i * 116, left: 60, right: 60 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 100 }}>
              <Lettering size={86}>{v.format}</Lettering>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <Lettering size={66} color={toneColor(v.tone)} style={{ textShadow: `0 0 18px ${toneGlow(v.tone)}` }}>
                  {v.verdict}
                </Lettering>
                <Lamp color={toneColor(v.tone)} glow={toneGlow(v.tone)} on={1} />
              </div>
            </div>
          </Reveal>
        ))}
      </Panel>
      <Panel x={60} y={686} w={960} h={556} delay={bars - 10} seed={52}>
        <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
          <Lettering size={28} font="body" color={C.cream} spacing="0.2em">
            BATTING AVERAGE · TEST v T20I
          </Lettering>
        </div>
        {/* scale */}
        {[0, 20, 40, 60, 80].map((g) => (
          <div key={g} style={{ position: "absolute", top: 88, bottom: 60, left: 260 + (g / 80) * maxW, width: 1, background: C.creamFaint }}>
            <span style={{ position: "absolute", bottom: -36, left: -14, fontFamily: theme.fonts.body, fontSize: 20, color: C.creamDim }}>{g}</span>
          </div>
        ))}
        {formatCompare.map((row, gi) => (
          <div key={row.year} style={{ position: "absolute", top: 104 + gi * 196, left: 50, right: 40 }}>
            <Lettering size={70}>{row.year}</Lettering>
            {[
              { label: "TEST", v: row.test, tone: "red" as const },
              { label: "T20I", v: row.t20i, tone: "green" as const },
            ].map((b, bi) => {
              const p = barP(gi * 2 + bi);
              return (
                <div key={b.label} style={{ position: "absolute", left: 120, top: 6 + bi * 72, display: "flex", alignItems: "center" }}>
                  <span style={{ width: 90, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 24, letterSpacing: "0.14em", color: C.creamDim }}>{b.label}</span>
                  <div
                    style={{
                      width: (b.v / 80) * maxW * p,
                      height: 50,
                      borderRadius: 6,
                      background: `linear-gradient(180deg, ${toneColor(b.tone)}, ${toneColor(b.tone)}aa)`,
                      boxShadow: `0 0 18px ${toneGlow(b.tone)}`,
                    }}
                  />
                  <span style={{ marginLeft: 16, fontFamily: theme.fonts.display, fontSize: 52, color: toneColor(b.tone), opacity: interpolate(p, [0.6, 1], [0, 1], CLAMP) }}>
                    {b.v.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </Panel>
    </SceneShell>
  );
};

// ---------------- SCENE 6 — THE FIRST BREAKTHROUGH ----------------
export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hundred = wordAt(fps, "s6", "122", 3.6);
  const hit = sentence(fps, "s6", 1).to + 2;
  const spinStart = wordAt(fps, "s6", "drought", 8.0) - 6;
  const spinEnd = wordAt(fps, "s6", "over", 9.2) + 4;
  const flip = useFlip(hundred, 3);
  const notOut = useAt(hundred + 12);
  const days = Math.round(interpolate(frame, [spinStart, spinEnd], [1021, 0], { easing: theme.ease.inOut, ...CLAMP }));
  const speed = Math.abs(
    interpolate(frame + 1, [spinStart, spinEnd], [1021, 0], { easing: theme.ease.inOut, ...CLAMP }) -
      interpolate(frame, [spinStart, spinEnd], [1021, 0], { easing: theme.ease.inOut, ...CLAMP }),
  );
  const ended = useAt(spinEnd, theme.spring.smooth);
  const celebrate = interpolate(frame, [hundred, hundred + 10, hit, hit + 16], [0, 0.35, 0.35, 1], { easing: theme.ease.out, ...CLAMP });
  return (
    <SceneShell push={0.04}>
      {/* abstract floodlight beams — no fake footage */}
      {[-1, 1].map((side) => (
        <div
          key={side}
          style={{
            position: "absolute",
            left: side < 0 ? -200 : 680,
            top: -300,
            width: 600,
            height: 1800,
            background: `linear-gradient(180deg, ${C.amberGlow}, transparent 70%)`,
            opacity: 0.22 * celebrate,
            transformOrigin: "50% 0%",
            transform: `rotate(${side * (18 + Math.sin(frame / 40) * 6)}deg)`,
            filter: "blur(30px)",
          }}
        />
      ))}
      <Panel x={60} y={226} w={960} h={570} delay={0} seed={61} glow={C.amberGlow} glowOn={celebrate * 0.8}>
        <div style={{ position: "absolute", top: 36, width: "100%", textAlign: "center" }}>
          <Lettering size={30} font="body" color={C.amber} spacing="0.3em">
            ASIA CUP 2022
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 86, width: "100%", textAlign: "center" }}>
          <Lettering size={96}>INDIA v AFGHANISTAN</Lettering>
        </div>
        <div style={{ position: "absolute", top: 194, width: "100%", textAlign: "center" }}>
          <Lettering size={30} font="body" weight={500} color={C.creamDim}>
            08 SEP 2022 · DUBAI
          </Lettering>
        </div>
        <Divider y={250} />
        <div style={{ position: "absolute", top: 282, left: 50, right: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Lettering size={92}>VIRAT KOHLI</Lettering>
          <Plates text="122" prev="000" progress={flip} w={104} h={148} gap={10} color={C.amber} glow={C.amberGlow} glowOn={celebrate} />
        </div>
        <div style={{ position: "absolute", top: 450, left: 50, right: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <Lettering size={24} font="body" color={C.creamDim} spacing="0.24em">
              FORMAT
            </Lettering>
            <Lettering size={70}>T20I</Lettering>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: interpolate(notOut, [0, 0.4], [0, 1], CLAMP) }}>
            <Lettering size={66} color={C.green} style={{ textShadow: `0 0 20px ${C.greenGlow}` }}>
              NOT OUT
            </Lettering>
            <Lamp color={C.green} glow={C.greenGlow} on={Math.min(1, notOut)} />
          </div>
        </div>
      </Panel>
      <Panel x={60} y={816} w={960} h={430} delay={spinStart - 24} seed={62} glow={C.greenGlow} glowOn={Math.min(1, ended)}>
        <div style={{ position: "absolute", top: 32, width: "100%", textAlign: "center" }}>
          <Lettering size={28} font="body" color={C.creamDim} spacing="0.2em">
            DAYS WITHOUT AN INTERNATIONAL HUNDRED
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 90, width: "100%", display: "flex", justifyContent: "center" }}>
          <Plates
            text={String(days).padStart(4, "0")}
            w={168}
            h={232}
            gap={16}
            color={days === 0 ? C.green : C.cream}
            glow={days === 0 ? C.greenGlow : undefined}
            blur={Math.min(3, speed / 8)}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: 350,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            opacity: interpolate(ended, [0, 0.5], [0, 1], CLAMP),
          }}
        >
          <Lamp color={C.green} glow={C.greenGlow} on={Math.min(1, ended)} size={22} />
          <Lettering size={40} font="body" color={C.green} spacing="0.18em">
            DROUGHT OVER
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};
