import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { theme } from "./theme";

const faces = [
  { family: theme.fonts.story, file: "fraunces-latin-600-normal.woff2", weight: "600", style: "normal" },
  { family: theme.fonts.story, file: "fraunces-latin-700-normal.woff2", weight: "700", style: "normal" },
  { family: theme.fonts.story, file: "fraunces-latin-600-italic.woff2", weight: "600", style: "italic" },
  ...["400", "500", "600", "700"].map((weight) => ({ family: theme.fonts.body, file: `inter-latin-${weight}-normal.woff2`, weight, style: "normal" })),
  ...["500", "700"].map((weight) => ({ family: theme.fonts.num, file: `space-grotesk-latin-${weight}-normal.woff2`, weight, style: "normal" })),
];
const handle = delayRender("Loading fonts");
Promise.all(
  faces.map(async ({ family, file, weight, style }) => {
    const face = new FontFace(family, `url('${staticFile(`fonts/${file}`)}') format('woff2')`, { weight, style });
    await face.load();
    document.fonts.add(face);
  }),
)
  .then(() => continueRender(handle))
  .catch((err) => cancelRender(err));
