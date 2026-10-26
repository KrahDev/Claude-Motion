// theme.ts — single source of truth for every Remotion project.
// NEVER inline colors, easings, spring configs, or timings in components.
import { Easing } from "remotion";

// Pace presets — chosen in discovery question Q6 (see brief.md).
// All values in seconds; convert with `fps` from useVideoConfig().
const PACES = {
  calm: {
    // "Ruhig" — weddings, memories, premium brands, institutions
    minShot: 3.0,
    typicalShot: 5.0,
    transitionFrames: 20,
    holdFrames: 30,
    springs: ["smooth"],
  },
  balanced: {
    // "Ausgewogen" — explainers, recruiting
    minShot: 1.5,
    typicalShot: 3.0,
    transitionFrames: 12,
    holdFrames: 18,
    springs: ["smooth", "snappy"],
  },
  energetic: {
    // "Energisch" — launches, sport, event teasers; cut on the beat
    minShot: 0.5,
    typicalShot: 1.2,
    transitionFrames: 4,
    holdFrames: 10,
    springs: ["snappy", "bouncy"],
  },
} as const;

// Set from brief.md: Q6 pace and Q5 text option (A=0, B=5, C=10, D=7 per caption).
const PACE: keyof typeof PACES = "balanced";
const MAX_WORDS = 5;

export const theme = {
  colors: {
    // Adjust to the user's brand (Q7). Defaults: dark tech.
    bg: "#0A0A0F",
    bgAlt: "#12121A",
    primary: "#7C3AED", // THE hero color — max one element per frame
    accent: "#22D3EE",
    text: "#F4F4F5",
    textDim: "#A1A1AA",
    glow: "rgba(124, 58, 237, 0.4)",
  },
  fonts: {
    display: "Clash Display", // load via @font-face + staticFile, or google-fonts
    body: "Inter",
    mono: "JetBrains Mono",
  },
  // THE easing curves. Linear is forbidden.
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1), // easeOutExpo — entrances
    inOut: Easing.bezier(0.83, 0, 0.17, 1), // easeInOutQuint — moves, Ken Burns
    in: Easing.bezier(0.7, 0, 0.84, 0), // exits only
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 }, // UI pops, words
    smooth: { damping: 20, stiffness: 90, mass: 1 }, // big elements
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 }, // playful accents, logos
  },
  pace: PACES[PACE],
  text: {
    maxWordsPerScreen: MAX_WORDS, // hard cap from Q5 — cut words, never time
  },
} as const;

// Reading-time floor: 1 s orientation + ~3 words per second.
// A text block must stay fully visible at least this many frames.
export const textHoldFrames = (words: number, fps: number) =>
  Math.ceil(fps * (1 + words / 3));
