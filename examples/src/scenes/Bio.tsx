import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Entrance, SceneExit, WordReveal } from "../components/Motion";

const CRAFTS = ["apps", "backends", "models", "agent skills"];

export const Bio: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chipStart = Math.round(fps * 1.2);
  const float = Math.sin(frame / 30) * 3;
  return (
    <SceneExit duration={duration}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 72,
          transform: `translateY(${float}px)`,
        }}
      >
        <WordReveal
          text="Engineer without a lane."
          heroWord="lane."
          delay={4}
          per={4}
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 700,
            fontSize: 118,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: theme.colors.text,
            maxWidth: 1500,
          }}
        />
        {/* pixel gap, never em, next to big type */}
        <div style={{ display: "flex", gap: 36 }}>
          {CRAFTS.map((c, i) => (
            <Entrance key={c} delay={chipStart + i * 5}>
              <div
                style={{
                  fontFamily: theme.fonts.body,
                  fontWeight: 500,
                  fontSize: 38,
                  color: theme.colors.text,
                  padding: "18px 40px",
                  borderRadius: 480,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: theme.colors.bgAlt,
                }}
              >
                {c}
              </div>
            </Entrance>
          ))}
        </div>
      </AbsoluteFill>
    </SceneExit>
  );
};
