import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { wtheme as t } from "../focuscat/theme2";
import {
  WarmBg,
  WarmGrade,
  WarmGrain,
  WarmVignette,
} from "../focuscat/FocusCat";

// "Watch this video fix itself" — one scene, upgraded live, rule by rule.
// Before each boundary the scene deliberately violates the skill; after it,
// that violation is fixed. The linear/flat/simultaneous code paths below are
// intentional — they are the "before".

const FPS_S = 30;
export const B = {
  r1: 75, // springs, not linear
  r2: 165, // never a flat background
  r3: 255, // stagger everything
  r4: 345, // one hero color + type
  payoff: 435,
  cta: 495,
  end: 555,
};
export const SELF_TOTAL_F = B.end;

const RULES = [
  { n: "01", label: "springs, not linear", at: B.r1 },
  { n: "02", label: "never a flat background", at: B.r2 },
  { n: "03", label: "stagger everything", at: B.r3 },
  { n: "04", label: "one hero color + type", at: B.r4 },
];

// ---------- the subject scene ----------
const Subject: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const springs = frame >= B.r1;
  const staggered = frame >= B.r3;
  const hero = frame >= B.r4;
  const lastRe = frame >= B.r3 ? B.r3 : frame >= B.r1 ? B.r1 : 0;

  // entrance progress for element i (0 title, 1-3 tiles, 4 badge)
  const enter = (i: number) => {
    const local = frame - lastRe - 5 - (staggered ? i * 5 : 0);
    if (!springs) {
      // the "before": linear, opacity only, everything at once
      return {
        opacity: interpolate(local, [0, 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        y: 0,
        scale: 1,
      };
    }
    const p = spring({ frame: local, fps, config: t.spring.smooth });
    return {
      opacity: p,
      y: interpolate(p, [0, 1], [40, 0]),
      scale: interpolate(p, [0, 1], [0.94, 1]),
    };
  };

  // hero-word pulse when rule 04 lands
  const p4 = spring({ frame: frame - B.r4, fps, config: t.spring.bouncy });
  const pulse = hero ? 1 + p4 * (1 - p4) * 4 * 0.05 : 1;

  // slow push-in during the payoff hold
  const push = interpolate(frame, [B.payoff, B.cta], [1, 1.05], {
    easing: t.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // exit at CTA
  const exitO = interpolate(frame, [B.cta, B.cta + 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(frame, [B.cta, B.cta + 12], [0, -42], {
    easing: t.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tileColors = hero ? t.colors.icons : ["#D9D5CD", "#D9D5CD", "#D9D5CD"];
  const e0 = enter(0);
  const e4 = enter(4);
  const titleWords = ["Meet", "Nova."];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 72,
        opacity: exitO,
        transform: `translateY(${exitY}px) scale(${push})`,
      }}
    >
      {/* headline */}
      <div
        style={{
          display: "flex",
          gap: "0.26em",
          fontFamily: hero ? t.fonts.display : t.fonts.body,
          fontWeight: hero ? 600 : 700,
          fontSize: 124,
          letterSpacing: hero ? "-0.02em" : "0em",
          color: t.colors.ink,
        }}
      >
        {titleWords.map((w, i) => {
          const we = staggered
            ? (() => {
                const p = spring({
                  frame: frame - lastRe - 5 - i * 4,
                  fps,
                  config: t.spring.snappy,
                });
                return {
                  opacity: p,
                  y: interpolate(p, [0, 1], [30, 0]),
                  scale: 1,
                };
              })()
            : e0;
          const isHero = hero && w === "Nova.";
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: we.opacity,
                transform: `translateY(${we.y}px) scale(${we.scale * (isHero ? pulse : 1)})`,
                color: isHero ? t.colors.primary : undefined,
                textShadow: isHero ? `0 0 60px ${t.colors.glow}` : undefined,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>

      {/* tiles */}
      <div style={{ display: "flex", gap: 48 }}>
        {tileColors.map((c, i) => {
          const e = enter(1 + i);
          const settle = hero ? 1 + Math.sin((frame + i * 20) / 26) * 0.012 : 1;
          return (
            <div
              key={i}
              style={{
                opacity: e.opacity,
                transform: `translateY(${e.y}px) scale(${e.scale * settle})`,
                width: 150,
                height: 150,
                borderRadius: 36,
                background: c,
                boxShadow: hero
                  ? "0 24px 48px -16px rgba(31,30,27,0.3)"
                  : "none",
              }}
            />
          );
        })}
      </div>

      {/* badge */}
      <div
        style={{
          opacity: e4.opacity,
          transform: `translateY(${e4.y}px) scale(${e4.scale})`,
          fontFamily: t.fonts.body,
          fontWeight: 600,
          fontSize: 36,
          color: t.colors.ink,
          background: hero ? t.colors.card : "transparent",
          border: hero ? `1px solid ${t.colors.bgAlt}` : "1px solid #C9C4BA",
          padding: "16px 40px",
          borderRadius: 999,
          boxShadow: hero ? "0 18px 40px -14px rgba(31,30,27,0.25)" : "none",
        }}
      >
        Launching today
      </div>
    </AbsoluteFill>
  );
};

// ---------- rule chips ----------
const Chips: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = interpolate(frame, [B.cta, B.cta + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 70,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 16,
        opacity: fade,
        padding: "0 60px",
      }}
    >
      {RULES.map((r, i) => {
        if (frame < r.at) return null;
        const p = spring({
          frame: frame - r.at,
          fps,
          config: t.spring.bouncy,
        });
        const done = i < RULES.length - 1 && frame >= RULES[i + 1].at;
        const isLast = i === RULES.length - 1 && frame >= B.payoff;
        const checked = done || isLast;
        return (
          <div
            key={r.n}
            style={{
              opacity: p * (checked ? 0.65 : 1),
              transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${p})`,
              fontFamily: t.fonts.mono,
              fontSize: 22,
              fontWeight: 700,
              whiteSpace: "nowrap",
              padding: "12px 24px",
              borderRadius: 999,
              background: checked ? "transparent" : "#2A2320",
              color: checked ? "#6B655B" : "#FAF7F2",
              border: checked ? "1px solid #C9C4BA" : "1px solid #2A2320",
            }}
          >
            {checked ? "✓ " : ""}
            {r.n} · {r.label}
          </div>
        );
      })}
    </div>
  );
};

// ---------- CTA ----------
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const float = Math.sin(frame / 30) * 3;
  const dur = B.end - B.cta;
  const endFade = interpolate(frame, [dur - 10, dur - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p1 = spring({ frame: frame - 4, fps, config: t.spring.smooth });
  const p2 = spring({
    frame: frame - Math.round(fps * 0.35),
    fps,
    config: t.spring.smooth,
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 46,
        opacity: endFade,
        transform: `translateY(${float}px)`,
      }}
    >
      <div
        style={{
          opacity: p1,
          transform: `translateY(${interpolate(p1, [0, 1], [40, 0])}px)`,
          fontFamily: t.fonts.display,
          fontWeight: 600,
          fontSize: 108,
          letterSpacing: "-0.02em",
          color: t.colors.ink,
        }}
      >
        Same tool. One{" "}
        <span
          style={{
            color: t.colors.primary,
            textShadow: `0 0 60px ${t.colors.glow}`,
          }}
        >
          skill.
        </span>
      </div>
      <div
        style={{
          opacity: p2,
          transform: `translateY(${interpolate(p2, [0, 1], [30, 0])}px)`,
          fontFamily: t.fonts.mono,
          fontWeight: 700,
          fontSize: 52,
          color: "#6B655B",
        }}
      >
        github.com/haidrrrry/claude-remotion-skill
      </div>
    </AbsoluteFill>
  );
};

// ---------- composition ----------
export const SelfFix: React.FC = () => {
  const frame = useCurrentFrame();
  // the flat "before" background — plain white, on purpose
  const bgRamp = interpolate(frame, [B.r2, B.r2 + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <div style={{ position: "absolute", inset: 0, opacity: bgRamp }}>
        <WarmBg />
      </div>

      <Sequence durationInFrames={B.cta + 12}>
        <Subject />
      </Sequence>
      <Chips />
      <Sequence from={B.cta} durationInFrames={B.end - B.cta}>
        <Cta />
      </Sequence>

      {/* sound */}
      <Audio src={staticFile("sfx/pad19.wav")} volume={0.28} />
      {[B.r1, B.r2, B.r3, B.r4, B.cta].map((s) => (
        <Sequence key={s} from={s - 2} durationInFrames={20}>
          <Audio src={staticFile("sfx/whoosh.wav")} volume={0.5} />
        </Sequence>
      ))}
      {[B.r1 + 6, B.r3 + 6, B.r3 + 11, B.r3 + 16, B.r4 + 4].map((s) => (
        <Sequence key={s} from={s} durationInFrames={10}>
          <Audio src={staticFile("sfx/pop.wav")} volume={0.5} />
        </Sequence>
      ))}
      <Sequence from={B.payoff + 2} durationInFrames={16}>
        <Audio src={staticFile("sfx/bass.wav")} volume={0.6} />
      </Sequence>

      {/* grade/grain/vignette arrive WITH rule 02 — they are part of the fix */}
      <div style={{ position: "absolute", inset: 0, opacity: bgRamp }}>
        <WarmGrade />
        <WarmGrain />
        <WarmVignette />
      </div>
    </AbsoluteFill>
  );
};
