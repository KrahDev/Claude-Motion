import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Entrance, SceneExit, Spark } from "../components/Motion";

export const HOOK_DURATION_IN_SECONDS = 2.7;

export const Hook: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // idle breathing once the lockup has landed
  const float = Math.sin(frame / 30) * 3;
  return (
    <SceneExit duration={duration}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 48,
          transform: `translateY(${float}px)`,
        }}
      >
        <Spark size={200} delay={0} />
        <Entrance delay={Math.round(fps * 0.35)}>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: 130,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: theme.colors.text,
            }}
          >
            haidrrrry
          </div>
        </Entrance>
        <Entrance delay={Math.round(fps * 0.6)}>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontWeight: 500,
              fontSize: 40,
              color: theme.colors.textDim,
            }}
          >
            Haider Ali khan
          </div>
        </Entrance>
      </AbsoluteFill>
    </SceneExit>
  );
};
