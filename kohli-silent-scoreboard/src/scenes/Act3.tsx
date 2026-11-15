// Scenes 7–9: one wait remained, the comeback in numbers, the ending.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { LineChart } from "../components/Chart";
import { CLAMP } from "../components/Motion";
import { Lamp, Lettering, Panel } from "../components/Panel";
import { PhotoPlate, SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { averages } from "../data";
import { theme, toneColor, toneGlow } from "../theme";
import { sentence, wordAt } from "../timing";
import { Arrow, Divider, Reveal, useAt, useFlip } from "./common";

const C = theme.colors;

// ---------------- SCENE 7 — ONE WAIT STILL REMAINED ----------------
export const S7: React.FC = () => {
  const { fps } = useVideoConfig();
  const until = wordAt(fps, "s7", "until", 3.0);
  const runs = wordAt(fps, "s7", "186", 6.2);
  const flip186 = useFlip(runs, 3);
  const flipCounter = useFlip(runs + 8, 0);
  const ended = useAt(runs + 10, theme.spring.smooth);
  return (
    <SceneShell push={0.035}>
      <Panel x={60} y={226} w={960} h={300} delay={2} seed={71}>
        <div style={{ position: "absolute", top: 34, width: "100%", textAlign: "center" }}>
          <Lettering size={84}>TEST CENTURY DROUGHT</Lettering>
        </div>
        <div style={{ position: "absolute", top: 138, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
          <Lettering size={72} color={C.cream}>
            NOV 2019
          </Lettering>
          <Arrow w={86} />
          <Lettering size={72} color={C.cream}>
            MAR 2023
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 236, width: "100%", textAlign: "center" }}>
          <Lettering size={28} font="body" color={C.creamDim} spacing="0.3em">
            OVER THREE YEARS
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={546} w={960} h={486} delay={until - 8} seed={72} glow={C.amberGlow} glowOn={Math.min(1, ended) * 0.7}>
        <div style={{ position: "absolute", left: 24, top: 24 }}>
          <PhotoPlate
            src="photos/ahmedabad-2023.jpg"
            w={330}
            h={392}
            position="50% 20%"
            delay={until}
            credit={"AHMEDABAD TEST, 9 MAR 2023\nPHOTO: PMO · GODL-INDIA"}
          />
        </div>
        <div style={{ position: "absolute", left: 386, right: 34, top: 36, display: "flex", flexDirection: "column", gap: 10 }}>
          <Lettering size={66}>INDIA v AUSTRALIA</Lettering>
          <Lettering size={28} font="body" weight={500} color={C.creamDim}>
            AHMEDABAD · 12 MAR 2023
          </Lettering>
          <div style={{ height: 2, background: C.panelEdge, margin: "16px 0" }} />
          <Lettering size={70}>VIRAT KOHLI</Lettering>
          <div style={{ marginTop: 14 }}>
            <Plates text="186" prev="000" progress={flip186} w={100} h={142} gap={10} color={C.amber} glow={C.amberGlow} glowOn={Math.min(1, ended)} />
          </div>
          <Lettering size={24} font="body" color={C.creamDim} spacing="0.24em" style={{ marginTop: 8 }}>
            FORMAT · TEST
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={1052} w={960} h={288} delay={until} seed={73} glow={C.greenGlow} glowOn={Math.min(1, ended)}>
        <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
          <Lettering size={26} font="body" color={C.creamDim} spacing="0.24em">
            TEST CENTURY COUNTER · SINCE NOV 2019
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 78, width: "100%", display: "flex", justifyContent: "center" }}>
          <Plates text="01" prev="00" progress={flipCounter} w={90} h={116} gap={10} color={C.green} glow={C.greenGlow} glowOn={Math.min(1, ended)} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 222,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
            opacity: interpolate(ended, [0, 0.5], [0, 1], CLAMP),
          }}
        >
          <Lamp color={C.green} glow={C.greenGlow} on={Math.min(1, ended)} size={20} />
          <Lettering size={34} font="body" color={C.green} spacing="0.16em">
            TEST CENTURY DROUGHT — ENDED
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

// ---------------- SCENE 8 — THE COMEBACK IN NUMBERS ----------------
export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const extend = wordAt(fps, "s8", "2023", 0.6);
  const climb = wordAt(fps, "s8", "climbed", 2.2);
  const value = wordAt(fps, "s8", "55", 3.6);
  const m1 = sentence(fps, "s8", 1).from;
  const m2 = wordAt(fps, "s8", "different", 6.6);
  const slots = interpolate(frame, [extend - 6, extend + 14], [4, 5], { easing: theme.ease.inOut, ...CLAMP });
  const reveal = averages.map((_, i) =>
    i < 4 ? interpolate(frame, [4 + i * 5, 4 + i * 5 + 16], [0, 1], { easing: theme.ease.out, ...CLAMP }) : interpolate(frame, [climb, climb + Math.round(fps * 0.9)], [0, 1], { easing: theme.ease.out, ...CLAMP }),
  );
  const thr = 1 - interpolate(frame, [climb, climb + 20], [0, 1], CLAMP);
  const flip23 = useFlip(value, 2);
  const glow = interpolate(frame, [climb, climb + 30], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const m2P = useAt(m2, theme.spring.smooth);
  return (
    <SceneShell push={0.03}>
      <Panel x={60} y={226} w={960} h={112} delay={0} seed={81}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={82}>TEST BATTING AVERAGE</Lettering>
        </div>
      </Panel>
      <Panel x={60} y={356} w={960} h={520} delay={2} seed={82} glow={C.greenGlow} glowOn={glow * 0.8}>
        <div style={{ position: "absolute", top: 18, left: 0 }}>
          <LineChart
            w={960}
            h={500}
            points={averages.map((r) => ({ year: r.year, value: r.avg, color: toneColor(r.tone), glow: toneGlow(r.tone) }))}
            reveal={reveal}
            slots={slots}
            threshold={{ value: 30, on: thr * 0.8, label: "BELOW 30" }}
          />
        </div>
      </Panel>
      <Panel x={60} y={894} w={960} h={160} delay={6} seed={83}>
        <div style={{ position: "absolute", inset: "22px 24px", display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>
          {averages.map((r, i) => (
            <div key={r.year} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: i < 4 ? 1 : interpolate(frame, [value - 4, value + 4], [0, 1], CLAMP) }}>
              <Lettering size={24} font="body" weight={500} color={C.creamDim}>
                {r.year}
              </Lettering>
              {i < 4 ? (
                <Lettering size={58} color={toneColor(r.tone)}>
                  {r.avg.toFixed(2)}
                </Lettering>
              ) : (
                <Plates text="55.92" prev="00.00" progress={flip23} w={34} h={60} gap={3} color={C.green} glow={C.greenGlow} />
              )}
            </div>
          ))}
        </div>
      </Panel>
      <Panel x={60} y={1074} w={960} h={266} delay={m1 - 6} seed={84}>
        <div style={{ position: "absolute", top: 46, width: "100%", textAlign: "center" }}>
          <Lettering size={66}>THE NUMBERS TELL THE STRUGGLE.</Lettering>
        </div>
        <Divider y={136} on={Math.min(1, m2P)} />
        <div style={{ position: "absolute", top: 160, width: "100%", textAlign: "center", opacity: interpolate(m2P, [0, 0.5], [0, 1], CLAMP), transform: `translateY(${interpolate(m2P, [0, 1], [18, 0])}px)` }}>
          <Lettering size={66} color={C.green} style={{ textShadow: `0 0 20px ${C.greenGlow}` }}>
            THE COMEBACK TELLS THE REST.
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

// ---------------- SCENE 9 — THE EMOTIONAL ENDING ----------------
const MESSAGES = [
  ["EVEN THE GREATEST", "STRUGGLE."],
  ["FORM CAN FADE."],
  ["GREATNESS IS TESTED", "IN THE COMEBACK."],
];

// The whole message board turns over mechanically: the old line folds away as the new one swings up.
const MessageBoard: React.FC<{ changes: number[]; closeAt: number }> = ({ changes, closeAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let idx = 0;
  while (idx + 1 < changes.length && frame >= changes[idx + 1]) idx++;
  const turn = idx === 0 ? 1 : interpolate(frame - changes[idx], [0, Math.round(fps * 0.4)], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const showing = turn < 0.5 ? idx - 1 : idx;
  const fold = turn < 0.5 ? 1 - turn * 2 : (turn - 0.5) * 2; // flat fold: no perspective, so letters never skew
  const lines = MESSAGES[showing];
  return (
    <Panel x={60} y={640} w={960} h={380} delay={changes[0] - 10} closeAt={closeAt} seed={91}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          transformOrigin: "50% 50%",
          transform: `scaleY(${Math.max(0.02, fold)})`,
          filter: `brightness(${0.55 + 0.45 * fold})`,
        }}
      >
        {lines.map((l) => (
          <Lettering key={l} size={lines.length === 1 ? 128 : 104} color={showing === 2 ? C.amber : C.cream} style={showing === 2 ? { textShadow: `0 0 26px ${C.amberGlow}` } : undefined}>
            {l}
          </Lettering>
        ))}
      </div>
    </Panel>
  );
};

export const s9Beats = (fps: number) => ({
  m1: sentence(fps, "s9", 0).from - 4,
  m2: sentence(fps, "s9", 1).from - 2,
  m3: sentence(fps, "s9", 2).from - 2,
  brand: sentence(fps, "s9", 3).from - 4,
});

export const S9: React.FC = () => {
  const { fps } = useVideoConfig();
  const b = s9Beats(fps);
  const brand = useAt(b.brand + 6, theme.spring.smooth);
  return (
    <SceneShell push={0} pull={0.06} turnOut={false}>
      <MessageBoard changes={[b.m1, b.m2, b.m3]} closeAt={b.brand - 8} />
      <Panel x={60} y={690} w={960} h={300} delay={b.brand} seed={92}>
        <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center" }}>
          <Lettering size={116} spacing="0.04em">
            BEYOND THE SCOREBOARD
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 182, left: "50%", width: 120, height: 3, marginLeft: -60, background: C.amber, boxShadow: `0 0 14px ${C.amberGlow}`, transform: `scaleX(${Math.min(1, brand)})` }} />
        <Reveal at={b.brand + 14} x={0} y={14} style={{ position: "absolute", top: 210, width: "100%", textAlign: "center" }}>
          <Lettering size={32} font="body" weight={500} color={C.creamDim} spacing="0.14em">
            CRICKET HAS STORIES BEYOND NUMBERS.
          </Lettering>
        </Reveal>
      </Panel>
    </SceneShell>
  );
};
