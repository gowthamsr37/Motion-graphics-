// SCENES 3–10 — the 8 cleaning steps, each a CleanStep: BEFORE (messy rows) → AFTER (clean rows) + THE APPROACH bullets
// on their words. Same Bangalore flats dataset throughout.
import React from "react";
import { CleanStep, Mini } from "../components/CleanStep";
import { Txt } from "../components/D2";
import { theme } from "../theme";
import { useScene } from "../timing";

const C = theme.colors;
const Stat: React.FC<{ k: string; v: string; bad?: boolean; good?: boolean }> = ({ k, v, bad, good }) => (
  <div style={{ width: 460, display: "flex", justifyContent: "space-between", padding: "8px 14px", borderRadius: 10, background: bad ? "rgba(251,92,122,0.25)" : good ? "rgba(52,211,153,0.22)" : "rgba(255,255,255,0.06)", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 26, color: C.text }}>
    <span style={{ color: C.dim }}>{k}</span>
    <span>{v}</span>
  </div>
);

export const S3Profile: React.FC = () => {
  const s = useScene("s3");
  return (
    <CleanStep i={0} termAt={s.cueS(0, "data")} headAt={s.cueS(0, "Before")} head={<>before fixing anything: <span style={{ color: C.cyan }}>look</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<>
        <Txt size={30} font="body">the raw file</Txt>
        <Stat k="rows" v="10,000" /><Stat k="columns" v="8" /><Stat k="price type" v="text" bad /><Stat k="blanks" v="412" bad />
      </>}
      afterAt={s.sent(2).from - 4}
      after={<>
        <Txt size={30} font="body">your fix list</Txt>
        <Stat k="1." v="price → number" good /><Stat k="2." v="units" good /><Stat k="3." v="412 blanks" good /><Stat k="4." v="…" good />
      </>}
      steps={[
        { t: "count rows + columns", at: s.cueS(1, "Count") },
        { t: "check each column's type", at: s.cueS(1, "type,") },
        { t: "count the blanks per column", at: s.cueS(1, "blanks.") },
      ]} />
  );
};

export const S4Types: React.FC = () => {
  const s = useScene("s4");
  const T = s.sent(1).from;
  return (
    <CleanStep i={1} termAt={s.cueS(0, "types")} headAt={s.sent(0).from} head={<>one <span style={{ color: C.violet }}>unit</span> per column, always</>}
      beforeAt={s.sent(0).from + 6}
      before={<Mini w={470} tone="bad" cols={["PRICE", "AREA"]} rows={[[{ v: "1.2 Cr", bad: true }, "1,200 sqft"], [{ v: "98 L", bad: true }, { v: "79 sq m", bad: true }], ["Rs 74,00,000", "1,050"]]} />}
      afterAt={s.cueS(1, "Convert")}
      after={<Mini w={470} tone="good" cols={["PRICE (L)", "AREA (SQ FT)"]} rows={[[{ v: "120", good: true }, "1,200"], [{ v: "98", good: true }, { v: "850", good: true }], ["74", "1,050"]]} />}
      steps={[
        { t: "crore + lakh text → one number in lakh", at: T },
        { t: "sq m × 10.76 → sq ft", at: s.cueS(1, "Convert") },
        { t: "one unit per column", at: s.cueS(1, "One") },
      ]} />
  );
};

export const S5Labels: React.FC = () => {
  const s = useScene("s5");
  return (
    <CleanStep i={2} termAt={s.cueS(0, "standardise")} headAt={s.sent(0).from} head={<>same thing, <span style={{ color: C.orange }}>many spellings</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<Mini w={470} tone="bad" cols={["BHK", "LOCALITY"]} rows={[[{ v: "2 BHK", bad: true }, { v: "Koramangala", bad: true }], [{ v: "2bhk", bad: true }, { v: "Kormangala", bad: true }], [{ v: "two bedroom", bad: true }, { v: "KORAMANGALA", bad: true }], ["3 BHK", { v: "Koramangla", bad: true }]]} />}
      afterAt={s.cueS(1, "Koramangala,") + 10}
      after={<Mini w={470} tone="good" cols={["BHK", "LOCALITY"]} rows={[[{ v: "2", good: true }, { v: "Koramangala", good: true }], [{ v: "2", good: true }, { v: "Koramangala", good: true }], [{ v: "2", good: true }, { v: "Koramangala", good: true }], ["3", { v: "Koramangala", good: true }]]} />}
      steps={[
        { t: "list every unique value", at: s.sent(1).from },
        { t: "map variants to one label", at: s.cueS(1, "becomes") },
        { t: "else: \"different places\" to the model", at: s.cueS(1, "Otherwise") },
      ]} />
  );
};

export const S6Dupes: React.FC = () => {
  const s = useScene("s6");
  return (
    <CleanStep i={3} termAt={s.cueS(0, "duplicates.")} headAt={s.sent(0).from} head={<>one flat, <span style={{ color: C.green }}>three listings</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<Mini w={470} tone="bad" cols={["AREA", "FLOOR", "PRICE"]} rows={[[{ v: "1,200", bad: true }, { v: "5", bad: true }, { v: "98L", bad: true }], [{ v: "1,200", bad: true }, { v: "5", bad: true }, { v: "1Cr", bad: true }], [{ v: "1,200", bad: true }, { v: "5", bad: true }, { v: "96L", bad: true }], ["850", "2", "62L"]]} />}
      afterAt={s.cueS(1, "keep")}
      after={<Mini w={470} tone="good" cols={["AREA", "FLOOR", "PRICE"]} rows={[[{ v: "1,200", good: true }, { v: "5", good: true }, { v: "98L", good: true }], ["850", "2", "62L"]]} />}
      steps={[
        { t: "drop exact copies first", at: s.cueS(1, "Exact") },
        { t: "match area + locality + floor + building", at: s.cueS(1, "Match") },
        { t: "keep one listing per flat", at: s.cueS(1, "keep") },
      ]} />
  );
};

export const S7Missing: React.FC = () => {
  const s = useScene("s7");
  return (
    <CleanStep i={4} termAt={s.cueS(0, "missing")} headAt={s.cueS(0, "why")} head={<>first ask: <span style={{ color: C.yellow }}>why is it missing?</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<Mini w={470} tone="bad" cols={["FLOOR", "PRICE"]} rows={[["5", { v: "—", bad: true }], [{ v: "—", bad: true }, "74L"], ["2", "62L"]]} />}
      afterAt={s.cueS(1, "median")}
      after={<Mini w={470} tone="good" cols={["FLOOR", "PRICE", "WAS_MISSING"]} rows={[[{ v: "row dropped", gone: true }, { v: "", gone: true }, { v: "", gone: true }], [{ v: "6", good: true }, "74L", { v: "yes", good: true }], ["2", "62L", "no"]]} />}
      steps={[
        { t: "target (price) missing → drop the row", at: s.cueS(1, "drop") },
        { t: "floor missing → median of that building", at: s.cueS(1, "median") },
        { t: "add a \"was missing\" flag column", at: s.cueS(1, "add") },
      ]} />
  );
};

export const S8Rules: React.FC = () => {
  const s = useScene("s8");
  return (
    <CleanStep i={5} termAt={s.cueS(0, "validity")} headAt={s.cueS(0, "rules.")} head={<>write <span style={{ color: C.cyan }}>simple rules</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<Mini w={470} tone="bad" cols={["AREA", "BHK", "BUILT"]} rows={[[{ v: "12,000", bad: true }, "1", "2015"], ["1,100", "2", { v: "2031", bad: true }], ["950", "2", "2012"]]} />}
      afterAt={s.cueS(1, "fix")}
      after={<Mini w={470} tone="good" cols={["AREA", "BHK", "BUILT"]} rows={[[{ v: "1,200", good: true }, "1", "2015"], [{ v: "removed", gone: true }, { v: "", gone: true }, { v: "", gone: true }], ["950", "2", "2012"]]} />}
      steps={[
        { t: "area 200 – 10,000 sq ft · year ≤ today", at: s.cueS(1, "Area") },
        { t: "obvious typo → fix it (12,000 → 1,200)", at: s.cueS(1, "fix") },
        { t: "can't tell → remove the row", at: s.cueS(1, "remove") },
      ]} />
  );
};

export const S9Outliers: React.FC = () => {
  const s = useScene("s9");
  return (
    <CleanStep i={6} termAt={s.cueS(0, "outliers.")} headAt={s.cueS(0, "Not")} head={<>not errors, just <span style={{ color: C.green }}>extreme</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<Mini w={470} tone="bad" cols={["TYPE", "PRICE"]} rows={[["2 BHK", "98L"], ["3 BHK", "1.4Cr"], [{ v: "villa", bad: true }, { v: "50 Cr", bad: true }]]} />}
      afterAt={s.cueS(1, "Keep")}
      after={<><Txt size={30} font="body">pick one:</Txt><Mini w={470} tone="good" rows={[[{ v: "KEEP it", good: true }], [{ v: "CAP it", good: true }], [{ v: "SEPARATE model", good: true }]]} /></>}
      steps={[
        { t: "real, but pulls the model off course", at: s.cueS(1, "real,") },
        { t: "keep · cap · or model villas separately", at: s.cueS(1, "Keep") },
        { t: "see our outlier treatment video", at: s.cueS(1, "covered") },
      ]} />
  );
};

export const S10Log: React.FC = () => {
  const s = useScene("s10");
  return (
    <CleanStep i={7} termAt={s.cueS(0, "log")} headAt={s.sent(0).from} head={<>log everything, then <span style={{ color: C.violet }}>re-check</span></>}
      beforeAt={s.sent(1).from - 4}
      before={<><Txt size={30} font="body">the change log</Txt>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 21, color: C.text, width: 440 }}>
          {["price text → lakh", "sq m → sq ft", "212 duplicates dropped", "37 no-price rows dropped", "1 typo fixed, 9 removed"].map((l) => <div key={l} style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(255,255,255,0.06)" }}>{l}</div>)}
        </div></>}
      afterAt={s.cueS(1, "went")}
      after={<><Txt size={30} font="body">profile again</Txt>
        <Stat k="rows" v="9,300" good /><Stat k="price type" v="number" good /><Stat k="blanks" v="0" good /><Stat k="status" v="READY" good /></>}
      steps={[
        { t: "write down every change", at: s.cueS(1, "Write") },
        { t: "run the profile again", at: s.cueS(1, "run") },
        { t: "10,000 → 9,300 clean rows: ready", at: s.cueS(1, "went") },
      ]} />
  );
};
