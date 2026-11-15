// Scene 4: the unlikely hero.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { MilestoneRail, WicketLamps } from "../components/Graphs";
import { CLAMP } from "../components/Motion";
import { Lettering, Panel } from "../components/Panel";
import { SceneShell } from "../components/Pieces";
import { Plates } from "../components/Plates";
import { india } from "../data";
import { theme } from "../theme";
import { sentence, wordAt } from "../timing";
import { Divider, Reveal, useAt } from "./common";

const C = theme.colors;

export const s4Beats = (fps: number) => ({
  ulva: wordAt(fps, "s4", "mohit", 1.44),
  stand: sentence(fps, "s4", 1).from,
  standEnd: sentence(fps, "s4", 1).to,
  fell: wordAt(fps, "s4", "fell", 6.5),
  remain: sentence(fps, "s4", 3).from,
});

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s4Beats(fps);
  const p = interpolate(frame, [b.stand, b.standEnd + 6], [0, 1], { easing: theme.ease.inOut, ...CLAMP });
  const partnership = Math.round(p * india.ninthStand);
  const score = india.collapse.runs + partnership;
  const down = frame >= b.fell;
  const fallen = 8 + interpolate(frame, [b.fell, b.fell + 4], [0, 1], CLAMP);
  const hero = useAt(b.ulva, theme.spring.bouncy);
  const remain = useAt(b.remain, theme.spring.smooth);
  return (
    <SceneShell push={0.04}>
      <Panel x={60} y={226} w={960} h={232} delay={0} seed={401}>
        <div style={{ position: "absolute", top: 16, left: 0 }}>
          <MilestoneRail w={960} lit={[1, interpolate(frame, [b.fell, b.fell + 10], [0, 1], CLAMP), 0, 0, 0]} />
        </div>
      </Panel>
      {/* camera finds the number-ten slot on the card */}
      <Panel x={60} y={476} w={960} h={250} delay={b.ulva - 10} seed={402} glow={C.amberGlow} glowOn={Math.min(1, hero) * 0.7}>
        <div style={{ position: "absolute", top: 28, width: "100%", textAlign: "center" }}>
          <Lettering size={28} font="body" color={C.amber} spacing="0.34em">
            BATTING AT NO. 10
          </Lettering>
        </div>
        <div
          style={{
            position: "absolute",
            top: 82,
            width: "100%",
            textAlign: "center",
            opacity: interpolate(hero, [0, 0.4], [0, 1], CLAMP),
            transform: `scale(${interpolate(hero, [0, 1], [1.25, 1])})`,
          }}
        >
          <Lettering size={140} spacing="0.03em">
            {india.ulva.name}
          </Lettering>
        </div>
      </Panel>
      <Panel x={60} y={744} w={960} h={350} delay={b.stand - 8} seed={403} glow={C.amberGlow} glowOn={p * 0.6}>
        <Reveal at={b.stand} style={{ position: "absolute", top: 24, left: 50, right: 50 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 80 }}>
            <Lettering size={56} color={down ? C.creamDim : C.cream}>
              {india.manal.name}
            </Lettering>
            <Lettering size={60} color={down ? C.creamDim : C.cream}>
              {india.manal.runs} ({india.manal.balls})
            </Lettering>
          </div>
        </Reveal>
        <Divider y={118} />
        <div style={{ position: "absolute", top: 140, left: 50, right: 50, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Lettering size={22} font="body" color={C.creamDim} spacing="0.22em">
              9TH-WICKET PARTNERSHIP
            </Lettering>
            <Plates text={String(partnership).padStart(2, "0")} w={92} h={128} gap={8} color={C.amber} glow={C.amberGlow} glowOn={p} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <Lettering size={22} font="body" color={C.creamDim} spacing="0.22em">
              INDIA
            </Lettering>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Plates text={String(score)} w={92} h={128} gap={8} color={down ? C.red : C.cream} glow={down ? C.redGlow : undefined} />
              <Lettering size={80} color={down ? C.red : C.creamDim}>
                /{Math.floor(fallen)}
              </Lettering>
            </div>
          </div>
        </div>
      </Panel>
      <Panel x={60} y={1112} w={960} h={228} delay={b.fell - 8} seed={404}>
        <div style={{ position: "absolute", top: 28, width: "100%" }}>
          <WicketLamps fallen={fallen} pulseLast={frame >= b.remain} size={50} />
        </div>
        <div style={{ position: "absolute", top: 130, width: "100%", textAlign: "center", opacity: interpolate(remain, [0, 0.5], [0, 1], CLAMP) }}>
          <Lettering size={70} color={C.amber} style={{ textShadow: `0 0 18px ${C.amberGlow}` }}>
            ONE WICKET REMAINING
          </Lettering>
        </div>
      </Panel>
    </SceneShell>
  );
};
