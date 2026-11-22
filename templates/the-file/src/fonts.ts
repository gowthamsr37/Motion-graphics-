import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { theme } from "./theme";

// Anton (numerals, headlines) and Fraunces (editorial italics) via Fontsource, Inter Display for text — all OFL.
const faces: { family: string; file: string; weight: string; format: string; style?: string }[] = [
  { family: theme.fonts.display, file: "anton-latin-400-normal.woff2", weight: "400", format: "woff2" },
  { family: theme.fonts.body, file: "InterDisplay-SemiBold.otf", weight: "600", format: "opentype" },
  { family: theme.fonts.body, file: "InterDisplay-ExtraBold.otf", weight: "800", format: "opentype" },
  { family: theme.fonts.body, file: "InterDisplay-Black.otf", weight: "900", format: "opentype" },
  { family: theme.fonts.serif, file: "fraunces-latin-700-italic.woff2", weight: "700", format: "woff2", style: "italic" },
  { family: theme.fonts.serif, file: "fraunces-latin-900-italic.woff2", weight: "900", format: "woff2", style: "italic" },
];

const handle = delayRender("Loading fonts");
Promise.all(
  faces.map(async ({ family, file, weight, format, style }) => {
    const face = new FontFace(family, `url('${staticFile(`fonts/${file}`)}') format('${format}')`, { weight, style: style ?? "normal" });
    await face.load();
    document.fonts.add(face);
  }),
)
  .then(() => continueRender(handle))
  .catch((err) => cancelRender(err));
