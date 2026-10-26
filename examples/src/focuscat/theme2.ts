// Warm editorial palette (design-rules.md) — the Focus Cat brand look.
import { Easing } from "remotion";

export const wtheme = {
  colors: {
    bg: "#FAF7F2",
    bgAlt: "#F1EBE1",
    primary: "#D97757", // hero orange — max one element per frame
    ink: "#1F1E1B",
    inkDim: "#8A8378",
    card: "#FFFFFF",
    glow: "rgba(217, 119, 87, 0.35)",
    // pastel app-icon colors (from the reference)
    icons: ["#7FA99B", "#B48E86", "#8B8FB8"],
  },
  fonts: {
    display: "Fraunces",
    body: "Inter",
    mono: "JetBrains Mono",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
  },
} as const;
