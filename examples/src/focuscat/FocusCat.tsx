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
import { wtheme as t } from "./theme2";
import { PixelCat } from "./PixelCat";

// ---------- timing (seconds) ----------
export const FT = { hook: 2.5, block: 3.2, focus: 3.5, grow: 3.5, cta: 2.8 };
export const FTOTAL_S = FT.hook + FT.block + FT.focus + FT.grow + FT.cta;

// ---------- layer stack, warm light variant ----------
export const WarmBg: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 40;
  const d2 = Math.cos(frame / 70) * 30;
  return (
    <AbsoluteFill style={{ background: t.colors.bg }}>
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          top: -520,
          left: -320 + d1,
          filter: "blur(70px)",
          background: `radial-gradient(circle, ${t.colors.primary}1E, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          bottom: -450,
          right: -280 - d2,
          filter: "blur(80px)",
          background: `radial-gradient(circle, #7FA99B22, transparent 65%)`,
        }}
      />
      {/* soft floor shadow, like a studio sweep */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 260,
          background:
            "linear-gradient(180deg, transparent, rgba(31,30,27,0.06))",
        }}
      />
    </AbsoluteFill>
  );
};

export const WarmGrade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        backgroundColor: t.colors.primary,
        mixBlendMode: "soft-light",
        opacity: 0.12,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.05), transparent 28%, transparent 72%, rgba(0,0,0,0.08))",
      }}
    />
  </AbsoluteFill>
);

export const WarmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.04,
        mixBlendMode: "multiply",
      }}
    />
  );
};

export const WarmVignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse at center, transparent 60%, rgba(31,30,27,0.10) 100%)",
    }}
  />
);

// ---------- shared motion ----------
const Rise: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: t.spring.smooth });
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

const Words: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  heroWord?: string;
  size: number;
  color?: string;
}> = ({ text, delay = 0, per = 4, heroWord, size, color = t.colors.ink }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.26em",
        justifyContent: "center",
        fontFamily: t.fonts.display,
        fontWeight: 600,
        fontSize: size,
        letterSpacing: "-0.02em",
        lineHeight: 1.08,
        color,
        maxWidth: 1500,
      }}
    >
      {text.split(" ").map((word, i) => {
        const p = spring({
          frame: frame - delay - i * per,
          fps,
          config: t.spring.snappy,
        });
        const hero = heroWord !== undefined && word === heroWord;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
              color: hero ? t.colors.primary : undefined,
              textShadow: hero ? `0 0 60px ${t.colors.glow}` : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

const Exit: React.FC<{ duration: number; children: React.ReactNode }> = ({
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [duration - 12, duration - 2], [0, -42], {
    easing: t.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const o = interpolate(frame, [duration - 12, duration - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: o, transform: `translateY(${y}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

// ---------- scene 1: hook ----------
const Hook: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Exit duration={duration}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 70,
        }}
      >
        <Words text="Your phone won't stop." delay={3} size={116} />
        {/* jittering notification badges */}
        <div style={{ display: "flex", gap: 40 }}>
          {t.colors.icons.map((c, i) => {
            const p = spring({
              frame: frame - 14 - i * 4,
              fps,
              config: t.spring.snappy,
            });
            const jitter =
              Math.sin((frame + i * 17) / 3.2) * 3 * (frame > 26 ? 1 : 0);
            return (
              <div
                key={i}
                style={{
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [36, 0])}px) translateX(${jitter}px) scale(${p})`,
                  width: 110,
                  height: 110,
                  borderRadius: 28,
                  background: c,
                  boxShadow: "0 18px 36px -12px rgba(31,30,27,0.25)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    right: -12,
                    minWidth: 40,
                    height: 40,
                    borderRadius: 20,
                    background: "#D2452F",
                    color: "#FFF",
                    fontFamily: t.fonts.body,
                    fontWeight: 700,
                    fontSize: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 8px",
                  }}
                >
                  {[12, 47, 9][i]}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Exit>
  );
};

// ---------- scene 2: block apps ----------
const Lock: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: t.spring.bouncy });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${p})`,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "rgba(255,255,255,0.92)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 18px rgba(31,30,27,0.25)",
        }}
      >
        {/* CSS padlock */}
        <div style={{ position: "relative", width: 26, height: 30 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 4,
              width: 18,
              height: 16,
              borderRadius: "9px 9px 0 0",
              border: "4px solid #2A2320",
              borderBottom: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: 26,
              height: 17,
              borderRadius: 5,
              background: "#2A2320",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const Block: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Exit duration={duration}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 80,
        }}
      >
        <Words text="Block apps." heroWord="Block" delay={3} size={128} />
        <div style={{ display: "flex", gap: 48 }}>
          {t.colors.icons.map((c, i) => {
            const p = spring({
              frame: frame - 10 - i * 5,
              fps,
              config: t.spring.snappy,
            });
            const settle = 1 + Math.sin((frame + i * 20) / 26) * 0.012;
            return (
              <div
                key={i}
                style={{
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) scale(${p * settle})`,
                  width: 150,
                  height: 150,
                  borderRadius: 36,
                  background: c,
                  position: "relative",
                  boxShadow: "0 24px 48px -16px rgba(31,30,27,0.3)",
                }}
              >
                <Lock delay={26 + i * 5} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Exit>
  );
};

// ---------- scene 3: focus ring + countdown + cat ----------
const Focus: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const R = 240;
  const C = 2 * Math.PI * R;
  const ring = interpolate(frame, [8, Math.round(fps * 2.4)], [0, 0.78], {
    easing: t.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const secsLeft = 1500 - Math.min(3, Math.floor(frame / fps)); // 25:00 ticking
  const mm = String(Math.floor(secsLeft / 60)).padStart(2, "0");
  const ss = String(secsLeft % 60).padStart(2, "0");
  return (
    <Exit duration={duration}>
      <AbsoluteFill
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 140,
        }}
      >
        <div style={{ width: 560 }}>
          <Words text="Then just… focus." heroWord="focus." delay={4} size={104} />
        </div>
        <Rise delay={6}>
          <div
            style={{
              position: "relative",
              width: 560,
              height: 560,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={560} height={560} style={{ position: "absolute" }}>
              <circle
                cx={280}
                cy={280}
                r={R}
                fill="none"
                stroke={t.colors.bgAlt}
                strokeWidth={26}
              />
              <circle
                cx={280}
                cy={280}
                r={R}
                fill="none"
                stroke={t.colors.primary}
                strokeWidth={26}
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - ring)}
                transform="rotate(-90 280 280)"
                style={{ filter: `drop-shadow(0 0 24px ${t.colors.glow})` }}
              />
            </svg>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontFamily: t.fonts.mono,
                  fontWeight: 700,
                  fontSize: 96,
                  fontVariantNumeric: "tabular-nums",
                  color: t.colors.ink,
                }}
              >
                {mm}:{ss}
              </div>
              <PixelCat px={9} />
            </div>
          </div>
        </Rise>
      </AbsoluteFill>
    </Exit>
  );
};

// ---------- scene 4: cat walks, streak ----------
const Grow: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width } = useVideoConfig();
  const x = interpolate(frame, [0, duration], [-360, width * 0.62], {
    easing: t.ease.inOut,
  });
  const pill = spring({
    frame: frame - Math.round(fps * 1.1),
    fps,
    config: t.spring.bouncy,
  });
  return (
    <Exit duration={duration}>
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            top: 220,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 44,
          }}
        >
          <Words
            text="Your cat thrives while you do."
            heroWord="thrives"
            delay={3}
            size={96}
          />
          <div
            style={{
              opacity: pill,
              transform: `scale(${pill})`,
              fontFamily: t.fonts.body,
              fontWeight: 600,
              fontSize: 40,
              color: t.colors.ink,
              background: t.colors.card,
              border: `1px solid ${t.colors.bgAlt}`,
              padding: "18px 44px",
              borderRadius: 999,
              boxShadow: "0 18px 40px -14px rgba(31,30,27,0.25)",
            }}
          >
            12-day focus streak
          </div>
        </div>
        {/* walking cat crosses the floor */}
        <div style={{ position: "absolute", bottom: 200, left: x }}>
          <PixelCat px={19} walking facing="right" />
        </div>
      </AbsoluteFill>
    </Exit>
  );
};

// ---------- scene 5: CTA ----------
const Cta: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const endFade = interpolate(frame, [duration - 10, duration - 1], [1, 0], {
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
        gap: 48,
        opacity: endFade,
        transform: `translateY(${float}px)`,
      }}
    >
      <Rise delay={2}>
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: 52,
            background: "#2A2320",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 60px ${t.colors.glow}, 0 40px 80px -20px rgba(31,30,27,0.35)`,
          }}
        >
          <PixelCat px={9} facing="left" />
        </div>
      </Rise>
      <Words text="Focus Cat" delay={Math.round(fps * 0.35)} size={120} />
      <Rise delay={Math.round(fps * 0.6)}>
        <div
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 500,
            fontSize: 34,
            color: t.colors.inkDim,
          }}
        >
          made with Remotion × Claude
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

// ---------- composition ----------
export const FocusCatPromo: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(fps * s);
  const starts = {
    block: f(FT.hook),
    focus: f(FT.hook) + f(FT.block),
    grow: f(FT.hook) + f(FT.block) + f(FT.focus),
    cta: f(FT.hook) + f(FT.block) + f(FT.focus) + f(FT.grow),
  };
  return (
    <AbsoluteFill>
      <WarmBg />
      <Sequence durationInFrames={f(FT.hook)}>
        <Hook duration={f(FT.hook)} />
      </Sequence>
      <Sequence from={starts.block} durationInFrames={f(FT.block)}>
        <Block duration={f(FT.block)} />
      </Sequence>
      <Sequence from={starts.focus} durationInFrames={f(FT.focus)}>
        <Focus duration={f(FT.focus)} />
      </Sequence>
      <Sequence from={starts.grow} durationInFrames={f(FT.grow)}>
        <Grow duration={f(FT.grow)} />
      </Sequence>
      <Sequence from={starts.cta} durationInFrames={f(FT.cta)}>
        <Cta duration={f(FT.cta)} />
      </Sequence>

      {/* ---------- sound: pad bed + hits 2-3 frames before visuals land ---------- */}
      <Audio src={staticFile("sfx/pad.wav")} volume={0.28} />
      {[starts.block, starts.focus, starts.grow, starts.cta].map((s) => (
        <Sequence key={s} from={s - 2} durationInFrames={20}>
          <Audio src={staticFile("sfx/whoosh.wav")} volume={0.5} />
        </Sequence>
      ))}
      {[0, 1, 2].map((i) => (
        <Sequence
          key={i}
          from={starts.block + 24 + i * 5}
          durationInFrames={10}
        >
          <Audio src={staticFile("sfx/pop.wav")} volume={0.55} />
        </Sequence>
      ))}
      {[1, 2, 3].map((i) => (
        <Sequence key={i} from={starts.focus + i * fps - 2} durationInFrames={6}>
          <Audio src={staticFile("sfx/tick.wav")} volume={0.35} />
        </Sequence>
      ))}
      <Sequence from={starts.cta + 4} durationInFrames={16}>
        <Audio src={staticFile("sfx/bass.wav")} volume={0.6} />
      </Sequence>

      <WarmGrade />
      <WarmGrain />
      <WarmVignette />
    </AbsoluteFill>
  );
};
