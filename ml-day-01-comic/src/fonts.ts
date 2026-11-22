import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { theme } from "./theme";

const faces: { family: string; file: string; weight: string }[] = [
  ...["600", "700", "800"].map((weight) => ({ family: theme.fonts.display, file: `sora-latin-${weight}-normal.woff2`, weight })),
  ...["500", "600", "700", "800"].map((weight) => ({ family: theme.fonts.body, file: `inter-latin-${weight}-normal.woff2`, weight })),
  ...["500", "700", "800"].map((weight) => ({ family: theme.fonts.mono, file: `jetbrains-mono-latin-${weight}-normal.woff2`, weight })),
  // ml-day-01-comic
  { family: "Bangers", file: "bangers-latin-400-normal.woff2", weight: "400" },
  { family: "Comic Neue", file: "comic-neue-latin-700-normal.woff2", weight: "700" },
];

const handle = delayRender("Loading fonts");

Promise.all(
  faces.map(async ({ family, file, weight }) => {
    const face = new FontFace(family, `url('${staticFile(`fonts/${file}`)}') format('woff2')`, { weight });
    await face.load();
    document.fonts.add(face);
  }),
)
  .then(() => continueRender(handle))
  .catch((err) => cancelRender(err));
