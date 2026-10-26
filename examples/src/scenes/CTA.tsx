import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { Entrance } from "../components/Motion";

export const CTA: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const float = Math.sin(frame / 30) * 3;
  // calm end: fade whole scene to black over the last 10 frames
  const endFade = interpolate(frame, [duration - 10, duration - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 44,
        opacity: endFade,
        transform: `translateY(${float}px)`,
      }}
    >
      <Entrance delay={2}>
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontWeight: 500,
            fontSize: 42,
            color: theme.colors.textDim,
          }}
        >
          See it all at
        </div>
      </Entrance>
      <Entrance delay={Math.round(fps * 0.3)}>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontWeight: 700,
            fontSize: 92,
            letterSpacing: "-0.02em",
            color: theme.colors.text,
          }}
        >
          github.com/
          <span
            style={{
              color: theme.colors.primary,
              textShadow: `0 0 60px ${theme.colors.primary}66, 0 0 120px ${theme.colors.primary}33`,
            }}
          >
            haidrrrry
          </span>
        </div>
      </Entrance>
    </AbsoluteFill>
  );
};
