import React from "react";
import { Img, staticFile } from "remotion";
import { Team, theme } from "../theme";

// Official franchise logo, fitted into a box. A hairline light outline keeps dark logos readable on the black board;
// logos drawn for white backgrounds sit on a cream disc so their negative space reads correctly.
export const TeamLogo: React.FC<{ team: Team; w: number; h: number; outline?: boolean; style?: React.CSSProperties }> = ({
  team,
  w,
  h,
  outline = true,
  style,
}) => {
  const img = (
    <Img
      src={staticFile(`logos/${team.logo}`)}
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        filter:
          outline && !team.plate
            ? `drop-shadow(0 0 1.5px ${theme.colors.outline}) drop-shadow(0 ${h * 0.05}px ${h * 0.1}px ${theme.colors.shadow})`
            : undefined,
      }}
    />
  );
  const d = Math.min(w, h);
  return (
    <div style={{ width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", ...style }}>
      {team.plate ? (
        <div
          style={{
            width: d,
            height: d,
            borderRadius: "50%",
            background: theme.colors.text,
            boxShadow: outline ? `0 ${d * 0.06}px ${d * 0.14}px ${theme.colors.shadow}` : undefined,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: d * 0.1,
            boxSizing: "border-box",
          }}
        >
          {img}
        </div>
      ) : (
        img
      )}
    </div>
  );
};
