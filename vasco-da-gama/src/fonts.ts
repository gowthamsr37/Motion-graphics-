import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { theme } from "./theme";

const faces = [
  ...["400", "600", "700"].map((weight) => ({ family: theme.fonts.title, file: `cinzel-latin-${weight}-normal.woff2`, weight, style: "normal" })),
  ...["400", "500", "600"].flatMap((weight) =>
    ["normal", "italic"].map((style) => ({ family: theme.fonts.body, file: `eb-garamond-latin-${weight}-${style}.woff2`, weight, style })),
  ),
  ...["normal", "italic"].map((style) => ({ family: theme.fonts.hand, file: `im-fell-english-latin-400-${style}.woff2`, weight: "400", style })),
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
