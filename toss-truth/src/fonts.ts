import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Anton (display) and Inter (body), served locally so renders never depend on the network.
export const fontsReady = Promise.all([
  loadFont({ family: "Anton", url: staticFile("fonts/anton-latin-400-normal.woff2"), weight: "400" }),
  ...[500, 700, 800, 900].map((w) =>
    loadFont({ family: "Inter", url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: String(w) }),
  ),
]);
