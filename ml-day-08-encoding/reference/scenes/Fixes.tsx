// SCENES 5–10 — the 6 fixes, each a CleanStep (THE TERM, BEFORE → AFTER mini tables, THE APPROACH on its words);
// SCENE 11 — the golden rule (fit on train only).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CleanStep, Mini } from "../components/CleanStep";
import { Panel, Pill, Pop, Txt } from "../components/D2";
import { ease } from "../components/Motion";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const W = 470;

export const S5Rows: React.FC = () => {
  const s = useScene("s5");
  return (
    <CleanStep i={0} termAt={s.cueS(0, "drop")} headAt={s.sent(0).from} head={<>drop the <span style={{ color: C.red }}>rows</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<Mini w={W} tone="bad" cols={["BHK", "AREA", "PRICE"]} rows={[["2", "1,150", "98L"], ["3", { v: "—", bad: true }, "1.4Cr"], ["2", "1,050", "88L"], ["1", "650", "52L"]]} />}
      afterAt={s.cueS(1, "random.")}
      after={<Mini w={W} tone="good" cols={["BHK", "AREA", "PRICE"]} rows={[["2", "1,150", "98L"], [{ v: "row dropped", gone: true }, { v: "", gone: true }, { v: "", gone: true }], ["2", "1,050", "88L"], ["1", "650", "52L"]]} />}
      steps={[
        { t: "only a few rows missing (< 5%)", at: s.cueS(1, "few") },
        { t: "and the gaps are random", at: s.cueS(1, "random.") },
        { t: "missing for a reason? you delete a group", at: s.cueS(1, "reason,") },
      ]} />
  );
};

export const S6Col: React.FC = () => {
  const s = useScene("s6");
  return (
    <CleanStep i={1} termAt={s.cueS(0, "drop")} headAt={s.sent(0).from} head={<>drop the <span style={{ color: C.orange }}>column</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<Mini w={W} tone="bad" cols={["AREA", "PARKING"]} rows={[["1,150", { v: "—", bad: true }], ["1,050", { v: "—", bad: true }], ["650", "covered"], ["1,600", { v: "—", bad: true }]]} />}
      afterAt={s.cueS(1, "Let")}
      after={<Mini w={W} tone="good" cols={["AREA"]} rows={[["1,150"], ["1,050"], ["650"], ["1,600"]]} />}
      steps={[
        { t: "mostly empty (e.g. 70%)", at: s.cueS(1, "70%,") },
        { t: "and not important", at: s.cueS(1, "important,") },
        { t: "filling = guessing → let it go", at: s.cueS(1, "guessing.") },
      ]} />
  );
};

export const S7Median: React.FC = () => {
  const s = useScene("s7");
  return (
    <CleanStep i={2} termAt={s.cueS(0, "median,")} headAt={s.sent(0).from} head={<>fill with the <span style={{ color: C.cyan }}>median</span>, not the mean</>}
      beforeAt={s.sent(1).from - 4}
      before={<Mini w={W} tone="bad" cols={["AREA (SQ FT)"]} rows={[["850"], ["1,100"], ["1,200"], [{ v: "9,000 villa", bad: true }], [{ v: "—", bad: true }]]} />}
      afterAt={s.cueS(1, "median")}
      after={<><Mini w={W} tone="good" cols={["MEAN", "MEDIAN"]} rows={[[{ v: "3,038", bad: true }, { v: "1,150", good: true }]]} /><Txt size={28} font="body">the blank gets <span style={{ color: C.green }}>1,150</span></Txt></>}
      steps={[
        { t: "prices + areas are skewed", at: s.cueS(1, "skewed.") },
        { t: "a few huge villas pull the mean up", at: s.cueS(1, "villas") },
        { t: "the median stays typical", at: s.cueS(1, "median") },
      ]} />
  );
};

export const S8Group: React.FC = () => {
  const s = useScene("s8");
  return (
    <CleanStep i={3} termAt={s.cueS(0, "fill")} headAt={s.sent(0).from} head={<>much better: fill <span style={{ color: C.green }}>by group</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<Mini w={W} tone="bad" cols={["BHK", "LOCALITY", "AREA"]} rows={[["3", "Koramangala", "1,750"], ["3", "Koramangala", "1,850"], ["3", "Koramangala", { v: "—", bad: true }], ["2", "Whitefield", "1,050"]]} />}
      afterAt={s.cueS(1, "median")}
      after={<Mini w={W} tone="good" cols={["BHK", "LOCALITY", "AREA"]} rows={[["3", "Koramangala", "1,750"], ["3", "Koramangala", "1,850"], ["3", "Koramangala", { v: "1,800", good: true }], ["2", "Whitefield", "1,050"]]} />}
      steps={[
        { t: "same BHK + same locality", at: s.cueS(1, "3") },
        { t: "use that group's median (1,800)", at: s.cueS(1, "median") },
        { t: "not the whole city's (1,150)", at: s.cueS(1, "whole") },
      ]} />
  );
};

export const S9Predict: React.FC = () => {
  const s = useScene("s9");
  return (
    <CleanStep i={4} termAt={s.cueS(0, "predict")} headAt={s.sent(0).from} head={<><span style={{ color: C.violet }}>predict</span> the missing value</>}
      beforeAt={s.sent(1).from - 4}
      before={<Mini w={W} tone="bad" cols={["BHK", "BATH", "FLOOR", "AREA"]} rows={[["4", "4", "12", { v: "—", bad: true }], ["2", "2", "3", "1,100"], ["3", "3", "7", "1,700"]]} />}
      afterAt={s.cueS(1, "KNN")}
      after={<Mini w={W} tone="good" cols={["BHK", "BATH", "FLOOR", "AREA"]} rows={[["4", "4", "12", { v: "2,600", good: true }], ["2", "2", "3", "1,100"], ["3", "3", "7", "1,700"]]} />}
      steps={[
        { t: "use the other columns (not price!)", at: s.cueS(1, "other") },
        { t: "bedrooms · bathrooms · floor", at: s.cueS(1, "bedrooms,") },
        { t: "KNN or iterative imputation", at: s.cueS(1, "KNN") },
      ]} />
  );
};

export const S10Flag: React.FC = () => {
  const s = useScene("s10");
  return (
    <CleanStep i={5} termAt={s.cueS(0, "flag.")} headAt={s.sent(0).from} head={<>the secret weapon: <span style={{ color: C.yellow }}>add a flag</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<Mini w={W} tone="bad" cols={["TYPE", "AREA"]} rows={[["villa", { v: "—", bad: true }], ["2 BHK", "1,150"], ["penthouse", { v: "—", bad: true }]]} />}
      afterAt={s.cueS(1, "yes")}
      after={<Mini w={W} tone="good" cols={["AREA", "AREA_MISSING"]} rows={[[{ v: "filled", good: true }, { v: "1", good: true }], ["1,150", "0"], [{ v: "filled", good: true }, { v: "1", good: true }]]} />}
      steps={[
        { t: "a column: \"area was missing\" 1 / 0", at: s.cueS(1, "Create") },
        { t: "remember the luxury sellers?", at: s.cueS(1, "Remember") },
        { t: "the flag says: probably BIG", at: s.cueS(1, "big.") },
      ]} />
  );
};

export const S11Rule: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScene("s11");
  const P = s.sent(1).from;
  const LEAK = s.cueS(1, "leak");
  return (
    <AbsoluteFill>
      <Pop x={540} y={250} at={s.sent(0).from - 4}>
        <Pill color={C.red} size={40} solid>THE RULE MOST BEGINNERS BREAK</Pill>
      </Pop>
      <Pop x={540} y={540} at={P - 4}>
        <Panel w={960} h={400} color={C.green} style={{ flexDirection: "row", gap: 40 }}>
          <div style={{ width: 360, height: 300, borderRadius: 18, background: "rgba(34,211,238,0.15)", border: `3px solid ${C.cyan}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Txt size={36} color={C.cyan}>TRAIN 80%</Txt>
            <Txt size={30} font="body">calculate medians</Txt>
            <Txt size={30} font="body">+ group values</Txt>
          </div>
          <Txt size={60} color={C.yellow}>→</Txt>
          <div style={{ width: 300, height: 300, borderRadius: 18, background: "rgba(252,211,77,0.12)", border: `3px solid ${C.yellow}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: ease(frame, [s.cueS(1, "apply") - 4, s.cueS(1, "apply") + 6], [0, 1]) }}>
            <Txt size={36} color={C.yellow}>TEST 20%</Txt>
            <Txt size={30} font="body">only apply them</Txt>
          </div>
        </Panel>
      </Pop>
      <Pop x={540} y={950} at={LEAK - 8}>
        <Panel w={960} h={220} color={C.red}>
          <Txt size={36} font="body">medians from the <span style={{ color: C.red }}>whole dataset</span>?</Txt>
          <Txt size={50} color={C.red} glow>TEST ANSWERS LEAK IN</Txt>
        </Panel>
      </Pop>
    </AbsoluteFill>
  );
};
