// Day 8 reel cover on the 100 Days of ML cover template v2.
import React from "react";
import { MLCover2 } from "./components/MLCover2";

export const Cover: React.FC = () => (
  <MLCover2
    day={8}
    lines={["ENCODING", "CATEGORIES"]}
    sub={["Turn Text into Numbers", "the Right Way"]}
    left={{ head: "Text", good: false, rows: [["HSR"], ["Whitefield"], ["Hebbal"], ["HSR"]] }}
    right={{ head: "Numbers", good: true, rows: [["1", "0", "0"], ["0", "1", "0"], ["0", "0", "1"], ["1", "0", "0"]] }}
    bar={[{ t: ["Ordinal"], i: "layers" }, { t: ["One-Hot"], i: "hash" }, { t: ["Target"], i: "target" }, { t: ["Unseen", "Labels"], i: "question" }]}
  />
);
