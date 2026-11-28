// Day 6 reel cover on the 100 Days of ML cover template v2.
import React from "react";
import { MLCover2 } from "./components/MLCover2";

export const Cover: React.FC = () => (
  <MLCover2
    day={6}
    lines={["FEATURES", "+ LABELS"]}
    sub={["The 6 Tests Every", "Feature Must Pass"]}
    left={{ head: "Leaky Data", good: false, rows: [["area", "price"], ["duty", "price"], ["ID", "price"], ["city", "price"]] }}
    right={{ head: "Good Data", good: true, rows: [["area", "price"], ["BHK", "price"], ["metro", "price"], ["age", "price"]] }}
    bar={[{ t: ["Data", "Leakage"], i: "key" }, { t: ["Relevance"], i: "target" }, { t: ["Redundancy"], i: "copy" }, { t: ["Fairness"], i: "shield" }]}
  />
);
