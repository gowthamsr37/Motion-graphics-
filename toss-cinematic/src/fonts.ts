import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { theme } from "./theme";

const faces: { family: string; file: string; weight: string; style?: string }[] = [
  ...["500", "600", "700", "800"].map((weight) => ({ family: theme.fonts.display, file: `barlow-condensed-latin-${weight}-normal.woff2`, weight })),
  ...["400", "500", "600", "700"].map((weight) => ({ family: theme.fonts.body, file: `inter-latin-${weight}-normal.woff2`, weight })),
  { family: theme.fonts.serif, file: "instrument-serif-latin-400-normal.woff2", weight: "400" },
  { family: theme.fonts.serif, file: "instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
];

const handle = delayRender("Loading fonts");

// The 3D layer also draws type into textures (coin, LED boards), so it waits on this promise too.
export const fontsReady: Promise<void> = Promise.all(
  faces.map(async ({ family, file, weight, style }) => {
    const face = new FontFace(family, `url('${staticFile(`fonts/${file}`)}') format('woff2')`, { weight, style: style ?? "normal" });
    await face.load();
    document.fonts.add(face);
  }),
).then(() => undefined);

fontsReady.then(() => continueRender(handle)).catch((err) => cancelRender(err));
