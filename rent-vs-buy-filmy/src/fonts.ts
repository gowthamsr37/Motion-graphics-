import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { theme } from "./theme";

const faces = [
  { family: theme.fonts.poster, file: "rozha-one-latin-400-normal.woff2", weight: "400" },
  { family: theme.fonts.filmy, file: "yatra-one-latin-400-normal.woff2", weight: "400" },
  ...["500", "600", "700", "800"].map((weight) => ({ family: theme.fonts.body, file: `poppins-latin-${weight}-normal.woff2`, weight })),
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
