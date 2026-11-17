import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { theme } from "./theme";

const faces: { family: string; file: string; weight: string }[] = [
  { family: theme.fonts.display, file: "league-gothic-latin-400-normal.woff2", weight: "400" },
  ...["400", "500", "600", "700"].map((weight) => ({ family: theme.fonts.body, file: `oswald-latin-${weight}-normal.woff2`, weight })),
];

const handle = delayRender("Loading fonts");
export const fontsReady = Promise.all(
  faces.map(async ({ family, file, weight }) => {
    const face = new FontFace(family, `url('${staticFile(`fonts/${file}`)}') format('woff2')`, { weight });
    await face.load();
    document.fonts.add(face);
  }),
);
fontsReady.then(() => continueRender(handle)).catch((err) => cancelRender(err));
