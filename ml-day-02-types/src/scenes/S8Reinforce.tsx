// SCENE 8 — TYPE 3: REINFORCEMENT. Header; "no answer key · no dataset · learns by DOING". The loop: AGENT (robot dog)
// → ACTION → WORLD → REWARD / PENALTY → back to the agent. The dog steps forward (+1, green) then topples (−10, red).
// Then a learning curve, "reward per try", climbing as the try counter races to 5,000. Finally two proof cards:
// GO (beat the world champion) and CHATGPT (fine-tuned with reinforcement learning from human feedback).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RobotDog, Robot } from "../components/Doodles";
import { Arrow, Header, Layer, Sketch } from "../components/NB";
import { Fade, Icon, Panel, Pill, Pop, T3, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { alpha, theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;

const GoBoard: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <rect x={6} y={6} width={88} height={88} rx={6} fill="#D9A55B" stroke={C.text} strokeWidth={3} />
    {[20, 35, 50, 65, 80].map((v) => (
      <React.Fragment key={v}>
        <line x1={v} y1={14} x2={v} y2={86} stroke="#4A2E12" strokeWidth={2} />
        <line x1={14} y1={v} x2={86} y2={v} stroke="#4A2E12" strokeWidth={2} />
      </React.Fragment>
    ))}
    {[[35, 35, 0], [50, 35, 1], [50, 50, 0], [65, 50, 1], [35, 65, 1], [65, 65, 0]].map(([x, y, w], i) => (
      <circle key={i} cx={x} cy={y} r={6.5} fill={w ? "#F8FAFC" : "#0B0B12"} stroke="#0B0B12" strokeWidth={1.5} />
    ))}
  </svg>
);

export const S8Reinforce: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s8");
  const NOKEY = s.cueS(0, "No");
  const DOING = s.cueS(0, "doing.");
  const L = s.sent(1).from;
  const ACT = s.cueS(1, "action.");
  const REW = s.cueS(1, "reward");
  const PLUS = s.cueS(1, "plus");
  const MINUS = s.cueS(1, "minus");
  const TRY = s.sent(2).from;
  const PROOF = s.sent(3).from;
  const GO = s.cueS(3, "Go,");
  const GPT = s.cueS(3, "ChatGPT.");
  // dog motion: steps right on "step forward", topples on "falling over"
  const step = ease(frame, [PLUS - 14, PLUS], [0, 1]);
  const fall = ease(frame, [MINUS - 12, MINUS - 2], [0, 1], theme.ease.in);
  const reset = ease(frame, [TRY - 10, TRY], [0, 1]);
  const dx = step * 60 * (1 - reset);
  const tilt = fall * 70 * (1 - reset);
  const lift = Math.abs(Math.sin(step * Math.PI * 2)) * (1 - fall);
  // learning curve
  const prog = ease(frame, [TRY + 4, PROOF - 10], [0, 1], theme.ease.soft);
  const tries = Math.round(interpolate(prog, [0, 1], [1, 5000]));
  const curve = Array.from({ length: 41 }, (_, i) => {
    const u = i / 40;
    const v = 1 - Math.exp(-u * 4) + Math.sin(i * 1.7) * 0.06 * (1 - u);
    return [190 + u * 720, 1290 - v * 230] as [number, number];
  });
  const shown = curve.slice(0, Math.max(2, Math.round(prog * 41)));
  return (
    <AbsoluteFill>
      <Header text="type 3 · reinforcement learning" at={s.sent(0).from - 4} color={T3} y={230} />
      <Fade out={PROOF - 8}>
        <Pop x={540} y={350} at={NOKEY - 4}>
          <Txt size={40} font="body">
            <span style={{ color: C.red }}>no</span> answer key · <span style={{ color: C.red }}>no</span> dataset
          </Txt>
        </Pop>
        <Pop x={540} y={425} at={DOING - 8}>
          <Txt size={58}>
            it learns by <span style={{ color: T3 }}>DOING</span>
          </Txt>
        </Pop>
        {/* the loop */}
        <Pop x={270} y={700} at={L - 6}>
          <Panel w={330} h={300} color={T3}>
            <Txt size={28} color={C.dim} font="body" style={{ letterSpacing: "0.16em" }}>AGENT</Txt>
            <div style={{ transform: `translateX(${dx}px)` }}>
              <Icon size={170}>
                <RobotDog x={85} y={85} s={170} at={-100} lift={lift} tilt={tilt} />
              </Icon>
            </div>
          </Panel>
        </Pop>
        <Pop x={810} y={700} at={ACT - 2}>
          <Panel w={330} h={300} color={C.green}>
            <Txt size={28} color={C.dim} font="body" style={{ letterSpacing: "0.16em" }}>WORLD</Txt>
            <svg width={240} height={150} viewBox="0 0 240 150">
              <path d="M0 120 Q60 100 120 118 T240 112" fill="none" stroke={C.green} strokeWidth={6} />
              <path d="M30 120 L30 70 M22 80 L30 70 L38 80" stroke={C.text} strokeWidth={4} fill="none" />
              <circle cx={190} cy={40} r={20} fill={C.yellow} />
            </svg>
          </Panel>
        </Pop>
        <Layer>
          <Arrow x1={450} y1={600} x2={630} y2={600} at={ACT} bend={-0.3} o={{ color: T3, width: 5 }} />
          <Arrow x1={630} y1={800} x2={450} y2={800} at={REW} bend={-0.3} o={{ color: C.yellow, width: 5 }} />
        </Layer>
        <Pop x={540} y={540} at={ACT + 2}>
          <Txt size={32} color={T3} glow>action</Txt>
        </Pop>
        <Pop x={540} y={870} at={REW + 2}>
          <Txt size={32} color={C.yellow} glow>reward / penalty</Txt>
        </Pop>
        {/* +1 / -10 */}
        <Fade out={TRY - 6}>
          <Pop x={330} y={1010} at={PLUS - 2}>
            <Pill color={C.green} size={40}>+1 step forward</Pill>
          </Pop>
          <Pop x={760} y={1010} at={MINUS - 2}>
            <Pill color={C.red} size={40}>−10 fell over</Pill>
          </Pop>
        </Fade>
        {/* learning curve */}
        {frame >= TRY - 4 ? (
          <>
            <Layer>
              <Sketch s={{ k: "line", x1: 190, y1: 1300, x2: 920, y2: 1300 }} at={TRY - 4} dur={8} o={{ color: C.dim, width: 3, seed: 5 }} />
              <Sketch s={{ k: "line", x1: 190, y1: 1300, x2: 190, y2: 1030 }} at={TRY - 4} dur={8} o={{ color: C.dim, width: 3, seed: 6 }} />
              <polyline points={shown.map((p) => p.join(",")).join(" ")} fill="none" stroke={T3} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${T3})` }} />
            </Layer>
            <Pop x={200} y={1000} at={TRY} anchor="left">
              <Txt size={28} color={C.dim} font="body">reward per try</Txt>
            </Pop>
            <Pop x={800} y={1340} at={TRY}>
              <Txt size={32} font="mono" color={C.text}>try #{tries.toLocaleString("en-IN")}</Txt>
            </Pop>
          </>
        ) : null}
      </Fade>
      {/* proof */}
      <Pop x={540} y={520} at={GO - 8}>
        <Panel w={900} h={330} color={C.yellow} style={{ flexDirection: "row", gap: 40, padding: "0 40px", justifyContent: "flex-start" }}>
          <GoBoard s={200} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Txt size={30} color={C.dim} font="body" style={{ letterSpacing: "0.14em" }}>THE GAME OF GO</Txt>
            <Txt size={46}>beat the</Txt>
            <Txt size={46} color={C.yellow} glow>world champion</Txt>
          </div>
        </Panel>
      </Pop>
      <Pop x={540} y={950} at={GPT - 10}>
        <Panel w={900} h={330} color={T3} style={{ flexDirection: "row", gap: 40, padding: "0 40px", justifyContent: "flex-start" }}>
          <Icon size={200}>
            <Robot x={100} y={100} s={190} at={GPT - 10} />
          </Icon>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Txt size={30} color={C.dim} font="body" style={{ letterSpacing: "0.14em" }}>CHATBOTS LIKE CHATGPT</Txt>
            <Txt size={46}>fine-tuned with</Txt>
            <Txt size={46} color={T3} glow>human feedback</Txt>
          </div>
        </Panel>
      </Pop>
      <Pop x={540} y={1250} at={GPT + 10}>
        <Txt size={34} font="body" color={C.dim}>
          both: <span style={{ color: C.text }}>trial, error and rewards</span>
        </Txt>
      </Pop>
    </AbsoluteFill>
  );
};
