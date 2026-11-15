// DLS, explained — nine scenes timed to the narration.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AMBER, Curves, GREEN, RAIN, RED, resource, Stamp, Tank, WicketRow } from "../components/DLS";
import { CLAMP } from "../components/Motion";
import { Lamp, Lettering, Panel } from "../components/Panel";
import { SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { theme } from "../theme";
import { sentence, wordAt } from "../timing";
import { Reveal, useAt, useFlip } from "./common";

const C = theme.colors;

const Bar: React.FC<{ text: string; delay?: number; color?: string }> = ({ text, delay = 0, color = C.cream }) => (
  <Panel x={60} y={226} w={960} h={104} delay={delay} seed={60}>
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Lettering size={58} color={color}>
        {text}
      </Lettering>
    </div>
  </Panel>
);

/* ================= S1 — THE HOOK ================= */
export const s1Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s1", i));
  return { score: wordAt(fps, "s1", "250", 2.18), cut: wordAt(fps, "s1", "25", 6.04), half: s[2].from, wrong: s[3].from, target: wordAt(fps, "s1", "170", 11.4) };
};

export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s1Beats(fps);
  const score = Math.round(250 * theme.ease.out(interpolate(frame, [b.score - 20, b.score + 4], [0, 1], CLAMP)));
  const overs = useFlip(b.cut, 3);
  const half = interpolate(frame, [b.half, b.half + 10], [0, 1], CLAMP);
  const struck = interpolate(frame, [b.wrong, b.wrong + 6], [0, 1], CLAMP);
  return (
    <SceneShell push={0.03} turnIn={false}>
      <Bar text="RAIN STOPS PLAY" delay={-10} color={RAIN} />
      <Panel x={60} y={346} w={960} h={560} delay={-8} seed={101}>
        <div style={{ position: "absolute", left: 50, right: 50, top: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Lettering size={56}>TEAM 1</Lettering>
          <Plates text={String(score).padStart(3, " ")} w={110} h={150} gap={10} color={C.cream} />
        </div>
        <div style={{ position: "absolute", left: 40, right: 40, top: 230, height: 2, background: C.panelEdge }} />
        <div style={{ position: "absolute", left: 50, right: 50, top: 268, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Lettering size={56}>TEAM 2 GET</Lettering>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Plates text="25" prev="50" progress={overs} w={110} h={150} gap={10} color={frame >= b.cut ? RED : C.cream} />
            <Lettering size={56} color={C.creamDim}>
              OVERS
            </Lettering>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 26, width: "100%", textAlign: "center", opacity: interpolate(frame, [b.cut, b.cut + 10], [0, 1], CLAMP) }}>
          <Lettering size={30} font="body" color={RAIN} spacing="0.2em">
            HALF THE OVERS…
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={922} w={960} h={428} delay={b.half - 6} seed={102} glow={C.amberGlow} glowOn={frame >= b.target ? 0.7 : 0}>
        <div style={{ position: "absolute", top: 40, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 26, opacity: half }}>
          <Lettering size={50} color={C.creamDim}>
            TARGET
          </Lettering>
          <div style={{ position: "relative" }}>
            <Lettering size={120} color={struck > 0 ? C.creamDim : C.cream}>
              126?
            </Lettering>
            <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 10, background: RED, transform: `scaleX(${struck}) rotate(-8deg)`, transformOrigin: "0% 50%" }} />
          </div>
        </div>
        <div style={{ position: "absolute", top: 210, width: "100%", textAlign: "center" }}>
          {frame >= b.target - 2 && <Stamp text="≈ 170" at={b.target - 2} color={AMBER} size={140} rotate={-4} />}
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S2 — 1992 ================= */
export const s2Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s2", i));
  return { year: s[0].from, need: s[1].from, flip: wordAt(fps, "s2", "21", 7.66), names: s[2].from, duck: wordAt(fps, "s2", "duckworth", 11.78), lewis: wordAt(fps, "s2", "lewis", 12.78) };
};

export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s2Beats(fps);
  const runs = useFlip(b.flip, 3);
  const balls = useFlip(b.flip + 8, 3);
  const flipped = frame >= b.flip;
  return (
    <SceneShell push={0.03}>
      <Bar text="WORLD CUP SEMI-FINAL · 1992" />
      <Panel x={60} y={346} w={960} h={520} delay={b.need - 14} seed={201} glow={C.redGlow} glowOn={flipped ? 0.6 : 0}>
        <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
          <Lettering size={44}>SOUTH AFRICA NEED</Lettering>
        </div>
        <div style={{ position: "absolute", top: 110, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
          <Plates text={flipped ? "21" : "22"} prev="22" progress={runs} w={120} h={170} gap={12} color={flipped ? RED : C.cream} glow={flipped ? C.redGlow : undefined} />
          <Lettering size={70} color={C.creamDim}>
            OFF
          </Lettering>
          <Plates text={flipped ? " 1" : "13"} prev="13" progress={balls} w={120} h={170} gap={12} color={flipped ? RED : C.cream} glow={flipped ? C.redGlow : undefined} />
        </div>
        <div style={{ position: "absolute", top: 310, width: "100%", textAlign: "center" }}>
          <Lettering size={44}>{flipped ? "BALL" : "BALLS"}</Lettering>
        </div>
        <div style={{ position: "absolute", bottom: 24, left: 30, right: 30, textAlign: "center", opacity: interpolate(frame, [b.flip + 20, b.flip + 30], [0, 1], CLAMP) }}>
          <Lettering size={18} font="body" color={C.creamDim} spacing="0.12em">
            AFTER A RAIN BREAK, UNDER THE OLD "MOST PRODUCTIVE OVERS" RULE · THE SCOREBOARD FAMOUSLY SHOWED 22
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={882} w={960} h={468} delay={b.names - 8} seed={202} glow={C.amberGlow} glowOn={0.4}>
        <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
          <Lettering size={26} font="body" color={AMBER} spacing="0.3em">
            TWO STATISTICIANS
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 90, left: 0, right: 0, display: "flex", justifyContent: "space-around" }}>
          {[
            { n: "FRANK", s: "DUCKWORTH", at: b.duck },
            { n: "TONY", s: "LEWIS", at: b.lewis },
          ].map((p) => (
            <Reveal key={p.s} at={p.at} x={0} y={20}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <Lettering size={40} color={C.creamDim}>
                  {p.n}
                </Lettering>
                <Lettering size={90}>{p.s}</Lettering>
              </div>
            </Reveal>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 40, width: "100%", textAlign: "center", opacity: interpolate(frame, [b.lewis + 30, b.lewis + 40], [0, 1], CLAMP) }}>
          <Lettering size={40} color={AMBER}>
            A FAIRER WAY · FIRST USED IN 1997
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S3 — TWO RESOURCES ================= */
export const s3Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s3", i));
  return { idea: s[0].from, overs: s[1].from, wickets: wordAt(fps, "s3", "wickets", 4.6), runs: s[2].from };
};

export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s3Beats(fps);
  const t1 = interpolate(frame, [b.overs, b.overs + 20], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const t2 = interpolate(frame, [b.wickets, b.wickets + 20], [0, 1], { easing: theme.ease.out, ...CLAMP });
  const sum = interpolate(frame, [b.runs, b.runs + 26], [0, 1], { easing: theme.ease.out, ...CLAMP });
  return (
    <SceneShell push={0.03}>
      <Bar text="A BATTING TEAM HAS 2 RESOURCES" />
      <Panel x={60} y={346} w={960} h={560} delay={b.overs - 10} seed={301}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 20px" }}>
          <div style={{ opacity: 0.25 + 0.75 * t1 }}>
            <Tank label="OVERS LEFT" fill={t1} color={RAIN} w={220} h={360}>
              <Lettering size={80} color={C.board}>
                50
              </Lettering>
            </Tank>
          </div>
          <Lettering size={110} color={C.creamDim}>
            +
          </Lettering>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: 0.25 + 0.75 * t2 }}>
            <div style={{ width: 300, height: 360, borderRadius: 18, background: C.plate, boxShadow: `inset 0 0 0 3px ${C.panelEdge}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <Lamp key={i} color={GREEN} glow={`${GREEN}88`} on={interpolate(frame, [b.wickets + i * 2, b.wickets + i * 2 + 4], [0, 1], CLAMP)} size={46} />
                ))}
              </div>
            </div>
            <Lettering size={40}>WICKETS IN HAND</Lettering>
          </div>
        </div>
      </Panel>
      <Panel x={60} y={922} w={960} h={428} delay={b.runs - 8} seed={302} glow={C.amberGlow} glowOn={0.5 * sum}>
        <div style={{ position: "absolute", top: 34, width: "100%", textAlign: "center" }}>
          <Lettering size={34} font="body" color={C.creamDim} spacing="0.2em">
            TOGETHER THEY DECIDE
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 80, right: 80, top: 120, height: 90, borderRadius: 12, background: C.plate, boxShadow: `inset 0 0 0 2px ${C.panelEdge}`, overflow: "hidden" }}>
          <div style={{ width: `${sum * 100}%`, height: "100%", background: `linear-gradient(90deg, ${RAIN}, ${GREEN}, ${AMBER})` }} />
        </div>
        <div style={{ position: "absolute", top: 250, width: "100%", textAlign: "center" }}>
          <Lettering size={66} color={AMBER}>
            RUNS YOU CAN STILL SCORE
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S4 — WICKETS MATTER ================= */
export const s4Beats = (fps: number) => {
  const s = [0, 1].map((i) => sentence(fps, "s4", i));
  return { a: s[0].from, b: wordAt(fps, "s4", "ten", 3.44, 1), attack: s[1].from };
};

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const card = (inHand: number, at: number, y: number, tag?: React.ReactNode) => {
    const r = resource(10, 10 - inHand);
    const g = interpolate(frame, [at + 14, at + 40], [0, 1], { easing: theme.ease.out, ...CLAMP });
    const good = inHand === 10;
    return (
      <Panel x={60} y={y} w={960} h={470} delay={at - 8} seed={400 + y} glow={good ? `${GREEN}55` : `${RED}44`} glowOn={0.5}>
        <div style={{ position: "absolute", left: 44, top: 32, display: "flex", alignItems: "baseline", gap: 18 }}>
          <Lettering size={72}>10 OVERS LEFT</Lettering>
          <Lettering size={34} color={C.creamDim}>
            ·
          </Lettering>
          <Lettering size={50} color={good ? GREEN : RED}>
            {inHand} WICKETS IN HAND
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 44, top: 140 }}>
          <WicketRow inHand={inHand} size={50} at={at} />
        </div>
        <div style={{ position: "absolute", left: 44, right: 44, top: 240 }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
            RESOURCES LEFT (ILLUSTRATIVE)
          </Lettering>
          <div style={{ marginTop: 12, height: 70, borderRadius: 10, background: C.plate, boxShadow: `inset 0 0 0 2px ${C.panelEdge}`, overflow: "hidden" }}>
            <div style={{ width: `${(r / 0.34) * 100 * g}%`, maxWidth: "100%", height: "100%", background: good ? GREEN : RED, boxShadow: `0 0 18px ${good ? GREEN : RED}88` }} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 44, bottom: 30 }}>{tag}</div>
      </Panel>
    );
  };
  return (
    <SceneShell push={0.025}>
      <Bar text="WICKETS CHANGE EVERYTHING" />
      {card(
        10,
        b.a,
        346,
        <Reveal at={b.attack} x={-20}>
          <Lettering size={50} color={GREEN}>
            ✓ CAN ATTACK WITHOUT FEAR
          </Lettering>
        </Reveal>,
      )}
      {card(2, b.b, 832, <Lettering size={44} color={RED} style={{ opacity: interpolate(frame, [b.b + 40, b.b + 50], [0, 1], CLAMP) }}>FAR LESS TO WORK WITH</Lettering>)}
    </SceneShell>
  );
};

/* ================= S5 — THE RESOURCE TABLE ================= */
export const s5Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s5", i));
  return { curves: s[0].from + 10, full: s[1].from, drop: s[2].from };
};

export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s5Beats(fps);
  const drop = interpolate(frame, [b.drop, b.drop + 10], [0, 1], CLAMP);
  return (
    <SceneShell push={0.02}>
      <Bar text="EVERY MIX HAS A RESOURCE %" />
      <Panel x={60} y={346} w={960} h={860} delay={2} seed={501}>
        <div style={{ position: "absolute", left: 20, top: 30 }}>
          <Curves w={920} h={720} at={[b.curves, b.curves + 14, b.curves + 28, b.curves + 42]} markAt={b.full} />
        </div>
        <div style={{ position: "absolute", left: 120, top: 330, opacity: drop, display: "flex", flexDirection: "column", gap: 10 }}>
          <Lettering size={38} color={RAIN}>
            ← LOSE OVERS: IT DROPS
          </Lettering>
          <Lettering size={38} color={RED}>
            ↓ LOSE WICKETS: IT DROPS
          </Lettering>
        </div>
        <div style={{ position: "absolute", bottom: 18, width: "100%", textAlign: "center" }}>
          <Lettering size={15} font="body" color={C.creamDim} spacing="0.14em">
            ILLUSTRATIVE SHAPE · REAL VALUES COME FROM THE OFFICIAL DLS TABLES AND SOFTWARE
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={1222} w={960} h={128} delay={b.full - 4} seed={502}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <Lettering size={52}>50 OVERS + 10 WICKETS =</Lettering>
          <Lettering size={70} color={GREEN}>
            100%
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S6 — BACK TO THE RAIN ================= */
export const s6Beats = (fps: number) => {
  const s = [0, 1, 2, 3].map((i) => sentence(fps, "s6", i));
  return { back: s[0].from, half: s[1].from, third: s[2].from, maths: s[3].from, target: wordAt(fps, "s6", "170", 13.7), not126: wordAt(fps, "s6", "126", 15.68) };
};

export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s6Beats(fps);
  const fill = interpolate(frame, [b.half + 10, b.half + 34, b.third, b.third + 24], [0, 0.5, 0.5, 0.665], { easing: theme.ease.inOut, ...CLAMP });
  const halfMark = interpolate(frame, [b.half + 30, b.half + 40], [0, 1], CLAMP);
  const maths = interpolate(frame, [b.maths, b.maths + 12], [0, 1], CLAMP);
  return (
    <SceneShell push={0.025}>
      <Bar text="BACK TO THE RAIN" color={RAIN} />
      <Panel x={60} y={346} w={960} h={460} delay={b.half - 10} seed={601}>
        <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
          <Lettering size={44}>25 OVERS + ALL 10 WICKETS</Lettering>
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 130, height: 130, borderRadius: 14, background: C.plate, boxShadow: `inset 0 0 0 3px ${C.panelEdge}`, overflow: "hidden" }}>
          <div style={{ width: `${fill * 100}%`, height: "100%", background: fill > 0.52 ? `linear-gradient(90deg, ${GREEN}, ${AMBER})` : GREEN, boxShadow: `0 0 20px ${AMBER}66` }} />
          {[1 / 3, 2 / 3].map((t) => (
            <div key={t} style={{ position: "absolute", left: `${t * 100}%`, top: 0, bottom: 0, width: 3, background: "rgba(0,0,0,0.45)" }} />
          ))}
          <div style={{ position: "absolute", left: "50%", top: -6, bottom: -6, width: 4, background: C.cream, opacity: halfMark }} />
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 280, display: "flex", justifyContent: "space-between" }}>
          <Lettering size={30} color={C.creamDim}>
            0%
          </Lettering>
          <Lettering size={30} color={C.cream} style={{ opacity: halfMark, marginLeft: 70 }}>
            HALF?
          </Lettering>
          <Lettering size={30} color={C.creamDim}>
            FULL INNINGS · 100%
          </Lettering>
        </div>
        <div style={{ position: "absolute", top: 340, width: "100%", textAlign: "center", opacity: interpolate(frame, [b.third, b.third + 10], [0, 1], CLAMP) }}>
          <Lettering size={66} color={AMBER}>
            ABOUT TWO-THIRDS
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={822} w={960} h={420} delay={b.maths - 8} seed={602} glow={C.amberGlow} glowOn={frame >= b.target ? 0.7 : 0.2}>
        <div style={{ position: "absolute", top: 40, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 22, opacity: maths }}>
          <Lettering size={84}>250 × ⅔ ≈ 167</Lettering>
        </div>
        <div style={{ position: "absolute", top: 170, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
          <div style={{ opacity: interpolate(frame, [b.target, b.target + 8], [0, 1], CLAMP), display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Lettering size={30} font="body" color={AMBER} spacing="0.2em">
              DLS TARGET
            </Lettering>
            <Lettering size={120} color={AMBER} style={{ textShadow: `0 0 22px ${C.amberGlow}` }}>
              ≈170
            </Lettering>
          </div>
          <div style={{ opacity: interpolate(frame, [b.not126, b.not126 + 8], [0, 1], CLAMP), display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
            <Lettering size={30} font="body" color={C.creamDim} spacing="0.2em">
              RUN-RATE MATHS
            </Lettering>
            <Lettering size={120} color={C.creamDim}>
              126
            </Lettering>
            <div style={{ position: "absolute", left: -10, right: -10, top: "58%", height: 10, background: RED, transform: "rotate(-8deg)" }} />
          </div>
        </div>
      </Panel>
      <Panel x={60} y={1258} w={960} h={92} delay={b.maths} seed={603}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
          <Lettering size={15} font="body" color={C.creamDim} spacing="0.12em">
            ILLUSTRATIVE · PUBLISHED TABLES PUT 25 OVERS, 10 WICKETS AT ABOUT 66–69% · THE OFFICIAL SOFTWARE SETS THE EXACT TARGET
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S7 — THE PAR SCORE ================= */
export const s7Beats = (fps: number) => {
  const s = [0, 1].map((i) => sentence(fps, "s7", i));
  return { par: s[0].from, a: wordAt(fps, "s7", "100", 6.72), b: wordAt(fps, "s7", "100", 9.3, 1) };
};

export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s7Beats(fps);
  const card = (score: string, inHand: number, ahead: boolean, at: number, y: number) => {
    const on = interpolate(frame, [at + 20, at + 28], [0, 1], CLAMP);
    const col = ahead ? GREEN : RED;
    return (
      <Panel x={60} y={y} w={960} h={330} delay={at - 8} seed={700 + y} glow={`${col}55`} glowOn={on * 0.6}>
        <div style={{ position: "absolute", left: 44, top: 30 }}>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.2em">
            SAME OVERS BOWLED · RAIN ENDS THE MATCH
          </Lettering>
        </div>
        <div style={{ position: "absolute", left: 44, top: 80, display: "flex", alignItems: "baseline", gap: 16 }}>
          <Lettering size={150}>{score}</Lettering>
        </div>
        <div style={{ position: "absolute", left: 44, bottom: 34 }}>
          <WicketRow inHand={inHand} size={30} at={at} />
        </div>
        <div style={{ position: "absolute", right: 44, top: 120, display: "flex", alignItems: "center", gap: 16, opacity: on }}>
          <Lamp color={col} glow={`${col}aa`} on={1} size={56} />
          <Lettering size={56} color={col}>
            {ahead ? "AHEAD OF PAR" : "BEHIND PAR"}
          </Lettering>
        </div>
      </Panel>
    );
  };
  return (
    <SceneShell push={0.025}>
      <Bar text="RAIN ENDS THE CHASE? CHECK THE PAR" color={RAIN} />
      <Panel x={60} y={346} w={960} h={150} delay={b.par} seed={701}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Lettering size={44}>PAR = WHERE YOU SHOULD BE</Lettering>
          <Lettering size={22} font="body" color={C.creamDim} spacing="0.16em">
            MORE WICKETS LOST → HIGHER PAR SCORE
          </Lettering>
        </div>
      </Panel>
      {card("100/2", 8, true, b.a, 512)}
      {card("100/6", 4, false, b.b, 858)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1200, textAlign: "center", opacity: interpolate(frame, [b.b + 30, b.b + 40], [0, 1], CLAMP) }}>
        <Lettering size={16} font="body" color={C.creamDim} spacing="0.14em">
          ILLUSTRATIVE · THE ACTUAL PAR DEPENDS ON THE TARGET AND OVERS REMAINING
        </Lettering>
      </div>
    </SceneShell>
  );
};

/* ================= S8 — STERN AND DLS ================= */
export const s8Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s8", i));
  return { stern: s[0].from, names: s[1].from, dls: s[2].from };
};

export const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s8Beats(fps);
  const dls = useAt(b.dls - 4, theme.spring.bouncy);
  const names = ["DUCKWORTH", "LEWIS", "STERN"];
  return (
    <SceneShell push={0.03}>
      <Bar text="2014 · AN UPDATE FOR MODERN CRICKET" />
      <Panel x={60} y={346} w={960} h={300} delay={b.stern} seed={801}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Lettering size={36} color={C.creamDim}>
            PROFESSOR
          </Lettering>
          <Lettering size={110}>STEVEN STERN</Lettering>
          <Lettering size={26} font="body" color={AMBER} spacing="0.2em">
            UPDATED FOR MODERN SCORING
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={662} w={960} h={688} delay={b.names - 6} seed={802} glow={C.amberGlow} glowOn={0.5}>
        <div style={{ position: "absolute", top: 50, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 30 }}>
          {names.map((n, i) => (
            <Reveal key={n} at={b.names + i * 10} x={0} y={18}>
              <Lettering size={70} color={i === 2 ? AMBER : C.cream}>
                {n}
              </Lettering>
            </Reveal>
          ))}
        </div>
        <div style={{ position: "absolute", top: 210, width: "100%", display: "flex", justifyContent: "center", opacity: interpolate(dls, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(dls, [0, 1], [1.4, 1])})` }}>
          <Plates text="DLS" w={170} h={260} gap={18} color={AMBER} glow={C.amberGlow} />
        </div>
        <div style={{ position: "absolute", bottom: 40, width: "100%", textAlign: "center", opacity: interpolate(frame, [b.dls + 10, b.dls + 20], [0, 1], CLAMP) }}>
          <Lettering size={32} font="body" color={C.creamDim} spacing="0.18em">
            USED IN RAIN-HIT ODIs AND T20s
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};

/* ================= S9 — OUTRO ================= */
export const s9Beats = (fps: number) => {
  const s = [0, 1, 2].map((i) => sentence(fps, "s9", i));
  return { alone: s[0].from, eq: s[1].from, brand: s[2].from - 8 };
};

export const S9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s9Beats(fps);
  const brand = useAt(b.brand, theme.spring.heavy);
  const parts = [
    { t: "OVERS", c: RAIN, at: b.eq },
    { t: "+", c: C.creamDim, at: b.eq + 6 },
    { t: "WICKETS", c: GREEN, at: b.eq + 12 },
    { t: "=", c: C.creamDim, at: b.eq + 18 },
    { t: "RESOURCES", c: AMBER, at: b.eq + 24 },
  ];
  return (
    <SceneShell push={0} pull={0.04} turnOut={false}>
      <Panel x={60} y={300} w={960} h={260} delay={b.alone} seed={901}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
          {parts.map((p) => (
            <Lettering key={p.t} size={p.t.length > 1 ? 74 : 74} color={p.c} style={{ opacity: interpolate(frame, [p.at, p.at + 8], [0, 1], CLAMP) }}>
              {p.t}
            </Lettering>
          ))}
        </div>
      </Panel>
      <Panel x={60} y={580} w={960} h={180} delay={b.eq + 20} seed={902} glow={C.amberGlow} glowOn={0.4}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lettering size={58} color={AMBER}>
            SAVE THIS FOR THE NEXT RAIN DELAY
          </Lettering>
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 60, top: 790, width: 960, opacity: interpolate(brand, [0, 0.3], [0, 1], CLAMP), transform: `scale(${interpolate(brand, [0, 1], [0.94, 1])})` }}>
        <Panel x={0} y={0} w={960} h={300} delay={b.brand} seed={903}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <Lettering size={28} font="body" color={C.creamDim} spacing="0.3em">
              CRICKET RULES, MADE SIMPLE
            </Lettering>
            <Lettering size={100} spacing="0.03em">
              BEYOND THE SCOREBOARD
            </Lettering>
          </div>
        </Panel>
      </div>
    </SceneShell>
  );
};
