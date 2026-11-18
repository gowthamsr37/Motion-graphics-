import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { theme } from "./theme";

const W = ["400", "500", "600", "700"];
const faces = [
  ...W.map((weight) => ({ family: theme.fonts.body, file: `inter-latin-${weight}-normal.woff2`, weight })),
  ...W.map((weight) => ({ family: theme.fonts.mono, file: `jetbrains-mono-latin-${weight}-normal.woff2`, weight })),
  ...W.map((weight) => ({ family: theme.fonts.display, file: `space-grotesk-latin-${weight}-normal.woff2`, weight })),
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
