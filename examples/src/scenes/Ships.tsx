import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { SceneExit, Spark, WordReveal } from "../components/Motion";

const DESTINATIONS = [
  { icon: "📱", label: "phones" },
  { icon: "🖥", label: "servers" },
  { icon: "🌐", label: "browsers" },
  { icon: "", label: "inside Claude", hero: true },
];

const Card: React.FC<{
  icon: string;
  label: string;
  hero?: boolean;
  delay: number;
}> = ({ icon, label, hero, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  const breathe = 1 + Math.sin((frame + delay * 7) / 22) * 0.015;
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [70, 0])}px) scale(${
          interpolate(p, [0, 1], [0.85, 1]) * breathe
        })`,
        width: 330,
        height: 300,
        borderRadius: 32,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 26,
        background: theme.colors.bgAlt,
        border: hero
          ? `1px solid ${theme.colors.primary}`
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: hero
          ? `0 0 60px ${theme.colors.primary}66, 0 0 120px ${theme.colors.primary}33`
          : "0 40px 80px -20px rgba(0,0,0,0.6)",
      }}
    >
      {hero ? (
        <div
          style={{
            height: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spark size={88} delay={delay + 4} />
        </div>
      ) : (
        <div style={{ fontSize: 76, lineHeight: "96px", height: 96 }}>{icon}</div>
      )}
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontWeight: 600,
          fontSize: 42,
          letterSpacing: "-0.02em",
          color: hero ? theme.colors.primary : theme.colors.text,
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Ships: React.FC<{ duration: number }> = ({ duration }) => {
  const { fps } = useVideoConfig();
  const cardStart = Math.round(fps * 0.9);
  return (
    <SceneExit duration={duration}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 80,
        }}
      >
        <WordReveal
          text="My code ships on"
          delay={3}
          per={3}
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 700,
            fontSize: 96,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: theme.colors.text,
          }}
        />
        {/* pixel gap next to big type */}
        <div style={{ display: "flex", gap: 42 }}>
          {DESTINATIONS.map((d, i) => (
            <Card key={d.label} {...d} delay={cardStart + i * 6} />
          ))}
        </div>
      </AbsoluteFill>
    </SceneExit>
  );
};
