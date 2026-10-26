import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { BgMesh, Grade, Grain, Vignette } from "../components/Layers";
import { Entrance, Spark, WordReveal } from "../components/Motion";

// ---------- timing (seconds — all frames derive from fps) ----------
export const T = { hookA: 2.3, hookB: 2.2, beats: 5.5, payoff: 2.7, cta: 2.3 };
export const TOTAL_S = T.hookA + T.hookB + T.beats + T.payoff + T.cta;

// ---------- whip-pan wrapper: slide+blur in, slide+blur out ----------
const Whip: React.FC<{
  duration: number;
  first?: boolean;
  last?: boolean;
  children: React.ReactNode;
}> = ({ duration, first, last, children }) => {
  const frame = useCurrentFrame();
  const inX = first
    ? 0
    : interpolate(frame, [0, 7], [1300, 0], {
        easing: theme.ease.out,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const outX = last
    ? 0
    : interpolate(frame, [duration - 7, duration - 1], [0, -1300], {
        easing: theme.ease.in,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const blurIn = first
    ? 0
    : interpolate(frame, [0, 7], [8, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const blurOut = last
    ? 0
    : interpolate(frame, [duration - 7, duration - 1], [0, 8], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${inX + outX}px)`,
        filter: `blur(${Math.max(blurIn, blurOut)}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ---------- scene 1: the claim ----------
const HookA: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  // scale-through exit: grows past camera while fading
  const exitS = interpolate(frame, [duration - 10, duration - 1], [1, 1.3], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitO = interpolate(frame, [duration - 10, duration - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: exitO,
        transform: `scale(${exitS})`,
      }}
    >
      <WordReveal
        text="AI videos all look the same."
        delay={3}
        per={4}
        style={{
          fontFamily: theme.fonts.display,
          fontWeight: 700,
          fontSize: 110,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          color: theme.colors.textDim,
          maxWidth: 1500,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- scene 2: the answer (scale-through entrance) ----------
const HookB: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: theme.spring.bouncy });
  const exitO = interpolate(frame, [duration - 10, duration - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const float = Math.sin(frame / 30) * 3;
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 54,
        opacity: exitO,
        transform: `translateY(${float}px) scale(${interpolate(enter, [0, 1], [0.8, 1])})`,
      }}
    >
      <Spark size={170} delay={0} />
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontWeight: 700,
          fontSize: 128,
          letterSpacing: "-0.03em",
          color: theme.colors.text,
        }}
      >
        One skill fixes{" "}
        <span
          style={{
            color: theme.colors.primary,
            textShadow: `0 0 60px ${theme.colors.primary}66, 0 0 120px ${theme.colors.primary}33`,
          }}
        >
          that.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- beat visuals: each demonstrates its own rule ----------

// beat 1 — a linear dot vs a spring dot, racing on loop
const SpringDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const loop = frame % Math.round(fps * 1.6);
  const track = 560;
  const linearX = interpolate(loop, [8, 40], [0, track], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const springX =
    spring({ frame: loop - 8, fps, config: theme.spring.bouncy }) * track;
  const row: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 40,
  };
  const lane: React.CSSProperties = {
    position: "relative",
    width: track + 60,
    height: 60,
    borderRadius: 60,
    background: theme.colors.bgAlt,
    border: "1px solid rgba(255,255,255,0.08)",
  };
  const dot: React.CSSProperties = {
    position: "absolute",
    top: 8,
    width: 44,
    height: 44,
    borderRadius: "50%",
  };
  const label: React.CSSProperties = {
    fontFamily: theme.fonts.mono,
    fontSize: 34,
    width: 180,
    textAlign: "right",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
      <div style={row}>
        <div style={{ ...label, color: theme.colors.textDim }}>linear</div>
        <div style={lane}>
          <div
            style={{
              ...dot,
              left: 8 + linearX,
              background: theme.colors.textDim,
            }}
          />
        </div>
      </div>
      <div style={row}>
        <div style={{ ...label, color: theme.colors.text }}>spring</div>
        <div style={lane}>
          <div
            style={{
              ...dot,
              left: 8 + springX,
              background: theme.colors.primary,
              boxShadow: `0 0 40px ${theme.colors.primary}88`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// beat 2 — the five layers stack themselves up
const LayersDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const names = ["background", "assets", "graphics", "grade", "grain"];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        gap: 18,
        alignItems: "center",
      }}
    >
      {names.map((n, i) => {
        const p = spring({
          frame: frame - 6 - i * 5,
          fps,
          config: theme.spring.snappy,
        });
        const isTop = i === 4;
        return (
          <div
            key={n}
            style={{
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [-40, 0])}px)`,
              width: 640 - i * 60,
              padding: "16px 0",
              textAlign: "center",
              borderRadius: 18,
              fontFamily: theme.fonts.mono,
              fontSize: 30,
              color: isTop ? theme.colors.primary : theme.colors.text,
              background: theme.colors.bgAlt,
              border: isTop
                ? `1px solid ${theme.colors.primary}`
                : "1px solid rgba(255,255,255,0.10)",
              boxShadow: isTop
                ? `0 0 50px ${theme.colors.primary}44`
                : "0 20px 40px -16px rgba(0,0,0,0.5)",
            }}
          >
            {n}
          </div>
        );
      })}
    </div>
  );
};

// beat 3 — a frame gets inspected and passes
const VerifyDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const box = spring({ frame: frame - 4, fps, config: theme.spring.smooth });
  const check = spring({
    frame: frame - Math.round(fps * 0.7),
    fps,
    config: theme.spring.bouncy,
  });
  return (
    <div
      style={{
        opacity: box,
        transform: `scale(${interpolate(box, [0, 1], [0.9, 1])})`,
        width: 620,
        height: 360,
        borderRadius: 24,
        border: "2px dashed rgba(255,255,255,0.25)",
        background: theme.colors.bgAlt,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 18,
      }}
    >
      <div
        style={{
          transform: `scale(${check})`,
          width: 110,
          height: 110,
          borderRadius: "50%",
          background: theme.colors.primary,
          color: theme.colors.text,
          fontSize: 64,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 60px ${theme.colors.primary}66`,
        }}
      >
        ✓
      </div>
      <div
        style={{
          fontFamily: theme.fonts.mono,
          fontSize: 28,
          color: theme.colors.textDim,
        }}
      >
        frame 270 — inspected
      </div>
    </div>
  );
};

const BEATS = [
  { n: "01", title: "Springs, not linear.", demo: <SpringDemo /> },
  { n: "02", title: "Five layers deep.", demo: <LayersDemo /> },
  { n: "03", title: "Every frame verified.", demo: <VerifyDemo /> },
];

const Beat: React.FC<{
  n: string;
  title: string;
  demo: React.ReactNode;
  duration: number;
  first: boolean;
  last: boolean;
}> = ({ n, title, demo, duration, first, last }) => {
  return (
    <Whip duration={duration} first={first} last={last}>
      <AbsoluteFill
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 120,
          padding: "0 140px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 30,
            width: 620,
          }}
        >
          <Entrance delay={4}>
            <div
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 40,
                color: theme.colors.textDim,
              }}
            >
              {n}
            </div>
          </Entrance>
          <WordReveal
            text={title}
            delay={7}
            per={3}
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: 88,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              color: theme.colors.text,
              justifyContent: "flex-start",
            }}
          />
        </div>
        <Entrance delay={10}>{demo}</Entrance>
      </AbsoluteFill>
    </Whip>
  );
};

// ---------- payoff: repo card + star counter ----------
const Payoff: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stars = interpolate(
    spring({
      frame: frame - Math.round(fps * 0.5),
      fps,
      config: { damping: 30, stiffness: 60 },
    }),
    [0, 1],
    [0, 41],
  );
  const exitO = interpolate(frame, [duration - 10, duration - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(frame, [duration - 10, duration - 2], [0, -42], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = 1 + Math.sin(frame / 22) * 0.012;
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: exitO,
        transform: `translateY(${exitY}px)`,
      }}
    >
      <Entrance delay={2}>
        <div
          style={{
            transform: `scale(${breathe})`,
            display: "flex",
            alignItems: "center",
            gap: 70,
            padding: "70px 100px",
            borderRadius: 40,
            background: theme.colors.bgAlt,
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 60px 120px -30px rgba(0,0,0,0.7)",
          }}
        >
          <Spark size={130} delay={4} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                fontFamily: theme.fonts.mono,
                fontWeight: 700,
                fontSize: 62,
                color: theme.colors.text,
              }}
            >
              claude-remotion-skill
            </div>
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontWeight: 700,
                fontSize: 96,
                fontVariantNumeric: "tabular-nums",
                color: theme.colors.primary,
                textShadow: `0 0 60px ${theme.colors.primary}66, 0 0 120px ${theme.colors.primary}33`,
              }}
            >
              {stars.toFixed(0)}★
            </div>
          </div>
        </div>
      </Entrance>
    </AbsoluteFill>
  );
};

// ---------- CTA ----------
const Cta: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const float = Math.sin(frame / 30) * 3;
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
            fontSize: 44,
            color: theme.colors.textDim,
          }}
        >
          Teach your Claude motion design
        </div>
      </Entrance>
      <Entrance delay={Math.round(fps * 0.3)}>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontWeight: 700,
            fontSize: 66,
            color: theme.colors.text,
          }}
        >
          github.com/haidrrrry/
          <span
            style={{
              color: theme.colors.primary,
              textShadow: `0 0 60px ${theme.colors.primary}66`,
            }}
          >
            claude-remotion-skill
          </span>
        </div>
      </Entrance>
    </AbsoluteFill>
  );
};

// ---------- composition ----------
export const SkillPromo: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(fps * s);
  const beatF = Math.round(f(T.beats) / 3);
  const starts = {
    hookB: f(T.hookA),
    beats: f(T.hookA) + f(T.hookB),
    payoff: f(T.hookA) + f(T.hookB) + f(T.beats),
    cta: f(T.hookA) + f(T.hookB) + f(T.beats) + f(T.payoff),
  };
  return (
    <AbsoluteFill>
      <BgMesh />
      <Sequence durationInFrames={f(T.hookA)}>
        <HookA duration={f(T.hookA)} />
      </Sequence>
      <Sequence from={starts.hookB} durationInFrames={f(T.hookB)}>
        <HookB duration={f(T.hookB)} />
      </Sequence>
      {BEATS.map((b, i) => (
        <Sequence
          key={b.n}
          from={starts.beats + i * beatF}
          durationInFrames={beatF}
        >
          <Beat
            {...b}
            duration={beatF}
            first={false}
            last={i === BEATS.length - 1}
          />
        </Sequence>
      ))}
      <Sequence from={starts.payoff} durationInFrames={f(T.payoff)}>
        <Payoff duration={f(T.payoff)} />
      </Sequence>
      <Sequence from={starts.cta} durationInFrames={f(T.cta)}>
        <Cta duration={f(T.cta)} />
      </Sequence>
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
