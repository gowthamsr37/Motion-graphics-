import { B, FREEZE } from "../src/beats";
import { S, E, allScenes } from "../src/timing";
console.log("FREEZE", FREEZE.toFixed(3));
for (const id of allScenes) console.log(id, S(id).toFixed(2), E(id).toFixed(2));
console.log(JSON.stringify(B, (k, v) => (typeof v === "number" ? Math.round(v * 100) / 100 : v)));
