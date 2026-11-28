// Day 6 (remake) reel cover on the 100 Days of ML cover template v2.
import React from "react";
import { MLCover2 } from "./components/MLCover2";

export const Cover: React.FC = () => (
  <MLCover2
    day={6}
    lines={["FEATURES", "& LABELS"]}
    sub={["The Clues & The Answer", "Explained Simply"]}
    left={{ head: "Features", good: true, hc: "#2563EB", rows: [["hours", "6"], ["attend.", "90%"], ["hours", "1"], ["attend.", "40%"]] }}
    right={{ head: "Label", good: true, rows: [["PASS"], ["PASS"], ["FAIL"], ["FAIL"]] }}
    bar={[{ t: ["Data", "Leakage"], i: "key" }, { t: ["Relevance"], i: "target" }, { t: ["Duplicates"], i: "copy" }, { t: ["Fairness"], i: "shield" }]}
  />
);
