// SCENES 5–10 — the 6 encoding methods, each a CleanStep (THE TERM, BEFORE → AFTER mini tables, THE APPROACH on its
// words); SCENE 11 — the trap (target encoding fitted on train only, out of fold).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CleanStep, Mini } from "../components/CleanStep";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const W = 470;

export const S5Ord: React.FC = () => {
  const s = useScene("s5");
  return (
    <CleanStep i={0} termAt={s.cueS(0, "ordinal")} headAt={s.sent(0).from} head={<>ordered? <span style={{ color: C.red }}>you</span> set the order</>}
      beforeAt={s.sent(1).from - 4}
      before={<><Mini w={W} tone="bad" cols={["FURNISHING", "CODE"]} rows={[["fully", { v: "0", bad: true }], ["semi", { v: "1", bad: true }], ["unfurnished", { v: "2", bad: true }]]} /><Txt size={26} font="body">computer: <span style={{ color: C.red }}>A → Z</span></Txt></>}
      afterAt={s.cueS(1, "Unfurnished")}
      after={<><Mini w={W} tone="good" cols={["FURNISHING", "CODE"]} rows={[["unfurnished", { v: "0", good: true }], ["semi", { v: "1", good: true }], ["fully", { v: "2", good: true }]]} /><Txt size={26} font="body">you: <span style={{ color: C.green }}>low → high</span></Txt></>}
      steps={[
        { t: "only for categories with a real order", at: s.cueS(1, "ordered") },
        { t: "unfurnished 0 → semi 1 → fully 2", at: s.cueS(1, "Unfurnished") },
        { t: "never let it sort alphabetically", at: s.cueS(1, "alphabetically.") },
      ]} />
  );
};

export const S6OneHot: React.FC = () => {
  const s = useScene("s6");
  return (
    <CleanStep i={1} termAt={s.cueS(0, "encoding.")} headAt={s.sent(0).from} head={<>no order? <span style={{ color: C.orange }}>one column each</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<Mini w={W} tone="bad" cols={["LOCALITY"]} rows={[["HSR"], ["Whitefield"], ["Koramangala"], ["HSR"]]} />}
      afterAt={s.cueS(1, "matches,")}
      after={<Mini w={W} tone="good" cols={["HSR", "WFD", "KOR"]} rows={[[{ v: "1", good: true }, "0", "0"], ["0", { v: "1", good: true }, "0"], ["0", "0", { v: "1", good: true }], [{ v: "1", good: true }, "0", "0"]]} />}
      steps={[
        { t: "one column per locality", at: s.cueS(1, "column") },
        { t: "1 where it matches, 0 everywhere else", at: s.cueS(1, "matches,") },
        { t: "no fake order, no fake distances", at: s.cueS(1, "fake") },
      ]} />
  );
};

export const S7DropOne: React.FC = () => {
  const s = useScene("s7");
  return (
    <CleanStep i={2} termAt={s.cueS(1, "trap.") - 8} headAt={s.sent(0).from} head={<>linear model? <span style={{ color: C.cyan }}>drop one column</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<Mini w={W} tone="bad" cols={["HSR", "WFD", "KOR"]} rows={[[{ v: "1", bad: true }, "0", "0"], [{ v: "0", bad: true }, "1", "0"], [{ v: "0", bad: true }, "0", "1"]]} />}
      afterAt={s.cueS(1, "minus")}
      after={<><Mini w={W} tone="good" cols={["WFD", "KOR"]} rows={[["0", "0"], ["1", "0"], ["0", "1"]]} /><Txt size={26} font="body">0 + 0 = <span style={{ color: C.green }}>it's HSR</span></Txt></>}
      steps={[
        { t: "all others 0 → it must be the last one", at: s.cueS(1, "already") },
        { t: "linear regression: keep k − 1 columns", at: s.cueS(1, "minus") },
        { t: "skip it → the dummy variable trap", at: s.cueS(1, "trap.") },
      ]} />
  );
};

export const S8Rare: React.FC = () => {
  const s = useScene("s8");
  return (
    <CleanStep i={3} termAt={s.cueS(0, "rare")} headAt={s.sent(0).from} head={<>too many? <span style={{ color: C.green }}>group the rare ones</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<Mini w={W} tone="bad" cols={["LOCALITY", "LISTINGS"]} rows={[["Whitefield", "1,240"], ["HSR", "980"], [{ v: "Kengeri", bad: true }, { v: "3", bad: true }], [{ v: "Anjanapura", bad: true }, { v: "2", bad: true }]]} />}
      afterAt={s.cueS(1, "OTHER.")}
      after={<Mini w={W} tone="good" cols={["LOCALITY", "LISTINGS"]} rows={[["Whitefield", "1,240"], ["HSR", "980"], [{ v: "OTHER", good: true }, { v: "5", good: true }], [{ v: "OTHER", good: true }, ""]]} />}
      steps={[
        { t: "200+ localities → 200 empty columns", at: s.cueS(1, "200") },
        { t: "keep the common ones", at: s.cueS(1, "common") },
        { t: "a few listings only → OTHER", at: s.cueS(1, "OTHER.") },
      ]} />
  );
};

export const S9Target: React.FC = () => {
  const s = useScene("s9");
  return (
    <CleanStep i={4} termAt={s.cueS(0, "target")} headAt={s.sent(0).from} head={<>replace it with <span style={{ color: C.violet }}>its average price</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<Mini w={W} tone="bad" cols={["LOCALITY"]} rows={[["Koramangala"], ["Whitefield"], ["HSR"], ["Kengeri (2)"]]} />}
      afterAt={s.cueS(1, "average")}
      after={<Mini w={W} tone="good" cols={["AVG RS / SQ FT"]} rows={[[{ v: "14,500", good: true }], [{ v: "7,800", good: true }], [{ v: "11,200", good: true }], [{ v: "smoothed", good: true }]]} />}
      steps={[
        { t: "locality → its average price / sq ft", at: s.cueS(1, "average") },
        { t: "1 powerful column instead of 200", at: s.cueS(1, "powerful") },
        { t: "smooth it for localities with few listings", at: s.cueS(1, "Smooth") },
      ]} />
  );
};

export const S10Unseen: React.FC = () => {
  const s = useScene("s10");
  return (
    <CleanStep i={5} termAt={s.cueS(0, "unseen")} headAt={s.sent(0).from} head={<>plan for <span style={{ color: C.yellow }}>new localities</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<><Mini w={W} tone="bad" cols={["NEW LISTING"]} rows={[[{ v: "Varthur ???", bad: true }]]} /><Txt size={26} font="body" color={C.red}>never seen → crash</Txt></>}
      afterAt={s.cueS(1, "Map")}
      after={<><Mini w={W} tone="good" cols={["NEW LISTING"]} rows={[[{ v: "→ OTHER", good: true }]]} /><Txt size={26} font="body" color={C.green}>model keeps running</Txt></>}
      pairH={300}
      steps={[
        { t: "next month: a brand-new locality", at: s.cueS(1, "brand") },
        { t: "map unknowns → OTHER", at: s.cueS(1, "Map") },
        { t: "or your code crashes in production", at: s.cueS(1, "crashes") },
      ]} />
  );
};

export const S11Trap: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s11");
  const P = s.cueS(1, "Calculate");
  const LEAK = s.cueS(1, "peeks");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Pill color={C.red} size={38} solid>THE TRAP THAT LEAKS YOUR ANSWERS</Pill>
      </Pop>
      <Pop x={540} y={380} at={s.cueS(1, "price,") - 4}>
        <Txt size={40} font="body">target encoding uses <span style={{ color: C.red }}>the price</span>: the answer!</Txt>
      </Pop>
      <Pop x={540} y={640} at={P - 4}>
        <Panel w={960} h={380} color={C.green} style={{ flexDirection: "row", gap: 40 }}>
          <div style={{ width: 360, height: 290, borderRadius: 18, background: "rgba(34,211,238,0.15)", border: `3px solid ${C.cyan}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Txt size={36} color={C.cyan}>TRAIN 80%</Txt>
            <Txt size={30} font="body">calculate the</Txt>
            <Txt size={30} font="body">locality averages</Txt>
          </div>
          <Txt size={60} color={C.yellow}>→</Txt>
          <div style={{ width: 300, height: 290, borderRadius: 18, background: "rgba(252,211,77,0.12)", border: `3px solid ${C.yellow}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: ease(frame, [P + 20, P + 30], [0, 1]) }}>
            <Txt size={36} color={C.yellow}>TEST 20%</Txt>
            <Txt size={30} font="body">only apply them</Txt>
          </div>
        </Panel>
      </Pop>
      <Pop x={540} y={900} at={s.cueS(1, "fold.") - 6}>
        <Pill color={C.green} size={32}>even better: OUT-OF-FOLD averages</Pill>
      </Pop>
      <Pop x={540} y={1110} at={LEAK - 10}>
        <Panel w={960} h={220} color={C.red}>
          <Txt size={36} font="body">averages from the <span style={{ color: C.red }}>whole dataset</span>?</Txt>
          <Txt size={46} color={C.red} glow>MODEL PEEKS AT TEST ANSWERS</Txt>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};
