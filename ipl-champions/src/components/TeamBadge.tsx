import React from "react";
import { Team, theme } from "../theme";

// Round franchise badge: identity color, secondary ring, short code. No official logos.
export const TeamBadge: React.FC<{ team: Team; size: number; style?: React.CSSProperties }> = ({ team, size, style }) => (
  <div
    style={{
      width: size,
      height: size,
      flex: "none",
      borderRadius: "50%",
      position: "relative",
      background: `radial-gradient(circle at 32% 26%, ${theme.colors.white}55 0%, transparent 42%), ${team.color}`,
      boxShadow: `0 ${size * 0.12}px ${size * 0.3}px -${size * 0.08}px ${theme.colors.shadow}, inset 0 0 0 ${size * 0.035}px ${team.alt}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: size * 0.075,
        borderRadius: "50%",
        border: `${Math.max(1, size * 0.01)}px solid ${team.on}`,
        opacity: 0.35,
      }}
    />
    <span
      style={{
        fontFamily: theme.fonts.display,
        fontWeight: 900,
        fontSize: size * (team.code.length > 2 ? 0.38 : 0.46),
        letterSpacing: "0.01em",
        color: team.on,
        lineHeight: 1,
        marginTop: size * 0.02,
      }}
    >
      {team.code}
    </span>
  </div>
);
