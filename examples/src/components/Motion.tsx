import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";

// Premium entrance: fade + rise + scale (never a lone fade)
export const Entrance: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Word-by-word reveal
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  heroWord?: string;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, per = 3, heroWord, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.26em",
        justifyContent: "center",
        ...style,
      }}
    >
      {text.split(" ").map((word, i) => {
        const p = spring({
          frame: frame - delay - i * per,
          fps,
          config: theme.spring.snappy,
        });
        const isHero = heroWord !== undefined && word === heroWord;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
              color: isHero ? theme.colors.primary : undefined,
              textShadow: isHero
                ? `0 0 60px ${theme.colors.primary}66, 0 0 120px ${theme.colors.primary}33`
                : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Scene exit wrapper — exits are faster than entrances (~10 frames vs ~20)
export const SceneExit: React.FC<{
  duration: number;
  children: React.ReactNode;
}> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const exitY = interpolate(frame, [duration - 12, duration - 2], [0, -42], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitO = interpolate(frame, [duration - 12, duration - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity: exitO,
        transform: `translateY(${exitY}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Radial spark mark with staggered rays
export const Spark: React.FC<{ size?: number; delay?: number }> = ({
  size = 220,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rays = 12;
  const container = spring({
    frame: frame - delay,
    fps,
    config: theme.spring.bouncy,
  });
  const rot = spring({
    frame: frame - delay,
    fps,
    config: theme.spring.smooth,
  });
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        transform: `scale(${container}) rotate(${interpolate(rot, [0, 1], [-120, 0])}deg)`,
        filter: `drop-shadow(0 0 ${size * 0.25}px ${theme.colors.glow})`,
      }}
    >
      {Array.from({ length: rays }).map((_, i) => {
        const p = spring({
          frame: frame - delay - i * 1.2,
          fps,
          config: theme.spring.snappy,
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: size * 0.085,
              height: size * 0.46 * p,
              background: theme.colors.primary,
              borderRadius: size,
              transformOrigin: "50% 0%",
              transform: `translateX(-50%) rotate(${(360 / rays) * i}deg) translateY(${size * 0.07}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
