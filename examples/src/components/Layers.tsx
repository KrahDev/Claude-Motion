import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

// Layer 1 — background mesh, never a flat solid
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 50;
  const d2 = Math.cos(frame / 70) * 40;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          borderRadius: "50%",
          top: -550,
          left: -350 + d1,
          filter: "blur(60px)",
          background: `radial-gradient(circle, ${theme.colors.primary}33, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          bottom: -500,
          right: -300 - d2,
          filter: "blur(80px)",
          background: `radial-gradient(circle, ${theme.colors.accent}22, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Layer 4 — color grade, above content, below grain
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.primary,
        mixBlendMode: "soft-light",
        opacity: 0.18,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.10), transparent 28%, transparent 72%, rgba(0,0,0,0.2))",
      }}
    />
  </AbsoluteFill>
);

// Layer 5a — procedural grain with film flicker
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.05,
        mixBlendMode: "overlay",
      }}
    />
  );
};

// Layer 5b — vignette, topmost
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse at center, transparent 56%, rgba(0,0,0,0.22) 100%)",
    }}
  />
);
