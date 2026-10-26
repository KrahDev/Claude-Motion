import React from "react";
import { useCurrentFrame } from "remotion";

// Pixel-art cat, drawn as a CSS grid of cells. Head faces LEFT in the data;
// flip with scaleX(-1) to walk right. Two leg frames = walk cycle.
// legend: o orange, O dark-orange shade, w white, k dark, p pink, . empty
const HEAD_BODY = [
  ".oo..oo.........",
  ".opo.opo........",
  ".oooooo.....oo..",
  ".okooko....oo...",
  ".oooooo...oo....",
  ".owwoo...oo.....",
  "..ooooooooo.....",
  ".owooooooooo....",
  ".owoooooooooo...",
  ".owoooooooooo...",
  ".ooooooooooooo..",
];
const LEGS_A = ["..ow...ow...oo..", "..ww...ww...ww.."];
const LEGS_B = ["...ow...ow..oo..", "...ww...ww..ww.."];

const COLORS: Record<string, string> = {
  o: "#E8934A",
  O: "#C9722E",
  w: "#FFF6EC",
  k: "#2A2320",
  p: "#E88A8A",
};

export const PixelCat: React.FC<{
  px?: number; // pixel cell size
  walking?: boolean;
  facing?: "left" | "right";
}> = ({ px = 14, walking = false, facing = "right" }) => {
  const frame = useCurrentFrame();
  const legs = walking && Math.floor(frame / 6) % 2 === 0 ? LEGS_A : LEGS_B;
  const rows = [...HEAD_BODY, ...legs];
  const bob = walking ? (Math.floor(frame / 6) % 2 === 0 ? 0 : px * 0.4) : 0;
  const breathe = walking ? 1 : 1 + Math.sin(frame / 24) * 0.012;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        transform: `${facing === "right" ? "scaleX(-1)" : ""} translateY(${bob}px) scale(${breathe})`,
      }}
    >
      {rows.map((row, r) => (
        <div key={r} style={{ display: "flex", height: px }}>
          {row.split("").map((c, i) => (
            <div
              key={i}
              style={{
                width: px,
                height: px,
                background: COLORS[c] ?? "transparent",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
