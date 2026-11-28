// Day 7 reel cover on the 100 Days of ML cover template v2.
import React from "react";
import { MLCover2 } from "./components/MLCover2";

export const Cover: React.FC = () => (
  <MLCover2
    day={7}
    lines={["MISSING", "VALUES"]}
    sub={["3 Types · 6 Fixes", "1 Golden Rule"]}
    left={{ head: "Missing", good: false, rows: [["2", "1,150"], ["3", "—"], ["4", "—"], ["2", "1,050"]] }}
    right={{ head: "Filled", good: true, rows: [["2", "1,150"], ["3", "1,800"], ["4", "2,600"], ["2", "1,050"]] }}
    bar={[{ t: ["Drop", "Rows"], i: "trash" }, { t: ["Median"], i: "bars" }, { t: ["Fill by", "Group"], i: "grid" }, { t: ["Missing", "Flag"], i: "flag" }]}
  />
);
