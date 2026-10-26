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

// ---------- "code edit" — camera lives inside a syntax-glow code world ----------
// 1080x1080, 30fps, 600 frames (20s), everything cut on 15-frame beats.

export const CE_TOTAL_F = 600;
const W = 1080;

const C = {
  bg: "#070B14",
  keyword: "#C792EA",
  string: "#8CE99A",
  func: "#82AAFF",
  number: "#F78C6C",
  punct: "#5C6B8A",
  ident: "#C9D8F0",
  comment: "#49567A",
  hl: "rgba(255,84,84,0.32)",
  tag: "#F4F6FB",
};

const FONT = 28;
const CH = FONT * 0.6; // JetBrains Mono advance
const LH = 44;
const PAD = 70;

// hidden messages live inside the strings, like the reference
const LINES = [
  'import { lane } from "nowhere";',
  "",
  "const engineer = await profile.load({",
  '  user: "haidrrrry", lane: null,',
  "});",
  "",
  "switch (engineer.prev = engineer.next) {",
  "  case 0:",
  '    return ship(apps), n.default.awrap("engineer without a lane");',
  "  case 1:",
  "    deploy(backends, { region: 0x2A });",
  '    z((0, x.take_the_next_step)(t.data));',
  "  case 2:",
  '    train(models).catch(function (t) {',
  '      console.log("I cannot be boxed in", t);',
  "    });",
  "  case 3:",
  "    publish(agent_skills, [",
  '      "ships on phones",',
  '      "runs on servers",',
  '      "lives inside claude",',
  "    ]);",
  '  case "end":',
  "    return t.stop();",
  "}",
  "",
  "process.on(\"exit\", () => {",
  '  console.log("github.com/haidrrrry");',
  "});",
];

// tokenizer: comments, strings, keywords, numbers, calls, idents
const KW =
  /^(import|from|const|await|switch|case|return|function|catch|null|new|process|on|async)$/;
const tokenize = (line: string) => {
  const out: { text: string; color: string }[] = [];
  const re = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(\b\d+x?[0-9A-Fa-f]*\b)|(\b[A-Za-z_$][\w$]*\b)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const [full, com, str, num, word, ws] = m;
    if (com) out.push({ text: com, color: C.comment });
    else if (str) out.push({ text: str, color: C.string });
    else if (num) out.push({ text: num, color: C.number });
    else if (word) {
      const next = line.slice(re.lastIndex).trimStart();
      out.push({
        text: word,
        color: KW.test(word)
          ? C.keyword
          : next.startsWith("(")
            ? C.func
            : C.ident,
      });
    } else if (ws) out.push({ text: ws, color: C.ident });
    else out.push({ text: full, color: C.punct });
  }
  return out;
};

const find = (needle: string) => {
  const line = LINES.findIndex((l) => l.includes(needle));
  return { line, col: LINES[line]?.indexOf(needle) ?? 0, len: needle.length };
};
const charPos = (line: number, col: number) => ({
  x: PAD + col * CH,
  y: PAD + line * LH + LH / 2,
});
const hash = (i: number) => {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};

// ---------- the code page ----------
const CodePage: React.FC<{ highlights?: { line: number; col: number; len: number }[] }> = ({
  highlights = [],
}) => (
  <div
    style={{
      position: "relative",
      width: 1900,
      fontFamily: "JetBrains Mono",
      fontSize: FONT,
      lineHeight: `${LH}px`,
      fontWeight: 500,
      whiteSpace: "pre",
      padding: PAD,
    }}
  >
    {highlights.map((h, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: PAD + h.col * CH - 6,
          top: PAD + h.line * LH + 4,
          width: h.len * CH + 12,
          height: LH - 8,
          background: C.hl,
          border: "1px solid rgba(255,84,84,0.6)",
          borderRadius: 6,
        }}
      />
    ))}
    {LINES.map((l, i) => (
      <div key={i} style={{ minHeight: LH }}>
        {tokenize(l === "" ? " " : l).map((tk, j) => (
          <span
            key={j}
            style={{
              color: tk.color,
              textShadow:
                tk.color === C.string
                  ? "0 0 18px rgba(140,233,154,0.55)"
                  : tk.color === C.keyword
                    ? "0 0 14px rgba(199,146,234,0.4)"
                    : undefined,
            }}
          >
            {tk.text}
          </span>
        ))}
      </div>
    ))}
  </div>
);

// camera: bring world point (px,py) to frame center at scale s
const cam = (px: number, py: number, s: number) => ({
  transform: `translate(${W / 2 - px * s}px, ${W / 2 - py * s}px) scale(${s})`,
  transformOrigin: "0 0",
});

// ---------- scene 1: extreme close-up drift on the thesis line ----------
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const m = find("engineer without a lane");
  const p = charPos(m.line, m.col + m.len / 2);
  const drift = Math.sin(frame / 40) * 14;
  const s = 3.1 + frame * 0.004;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", ...cam(p.x + drift, p.y, s) }}>
        <CodePage />
      </div>
    </AbsoluteFill>
  );
};

// ---------- scene 2: whip zoom-out, slow diagonal pan ----------
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const m = find("engineer without a lane");
  const p0 = charPos(m.line, m.col + m.len / 2);
  const s = interpolate(frame, [0, 18], [3.1, 0.9], {
    easing: (x) => 1 - Math.pow(1 - x, 4),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cx = interpolate(frame, [0, 18, 75], [p0.x, 600, 630], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cy = interpolate(frame, [0, 18, 75], [p0.y, 690, 740], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(frame, [0, 9, 18], [0, 9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          ...cam(cx, cy, s),
          filter: `blur(${blur}px)`,
        }}
      >
        <CodePage />
      </div>
    </AbsoluteFill>
  );
};

// ---------- scene 3: beat-locked zoom punches on the four crafts ----------
const PUNCHES = ["apps", "backends", "models", "agent_skills"];
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = Math.min(PUNCHES.length - 1, Math.floor(frame / 30));
  const local = frame - idx * 30;
  const m = find(PUNCHES[idx]);
  const p = charPos(m.line, m.col + m.len / 2);
  const punch = spring({ frame: local, fps, config: { damping: 16, stiffness: 220, mass: 0.5 } });
  const s = 1.7 + punch * 0.5;
  const blur = interpolate(local, [0, 4], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          ...cam(p.x, p.y, s),
          filter: `blur(${blur}px)`,
        }}
      >
        <CodePage highlights={[m]} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- scene 4: glitch — sliced page, RGB split, invert flashes ----------
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = -80 - frame * 4.5;
  const slices = 9;
  const inv = hash(Math.floor(frame / 4)) > 0.72;
  const world = (extra: React.CSSProperties = {}) => (
    <div
      style={{
        position: "absolute",
        transform: `translate(-60px, ${scroll}px) scale(1)`,
        transformOrigin: "0 0",
        ...extra,
      }}
    >
      <CodePage
        highlights={[find("take_the_next_step"), find("I cannot be boxed in")]}
      />
    </div>
  );
  return (
    <AbsoluteFill style={{ filter: inv ? "invert(1) hue-rotate(180deg)" : undefined }}>
      {/* RGB ghost copies */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.55, mixBlendMode: "screen", filter: "hue-rotate(-70deg)", transform: `translateX(${(hash(frame) - 0.5) * 26}px)` }}>
        {world()}
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 0.55, mixBlendMode: "screen", filter: "hue-rotate(120deg)", transform: `translateX(${(hash(frame + 99) - 0.5) * -26}px)` }}>
        {world()}
      </div>
      {/* sliced main copy */}
      {Array.from({ length: slices }).map((_, i) => {
        const top = (i / slices) * 100;
        const bot = 100 - ((i + 1) / slices) * 100;
        const jolt =
          (hash(i * 31 + Math.floor(frame / 3)) - 0.5) *
          (hash(Math.floor(frame / 7)) > 0.4 ? 90 : 14);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `inset(${top}% 0 ${bot}% 0)`,
              transform: `translateX(${jolt}px)`,
            }}
          >
            {world()}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- scene 5/6: 3D code shatter finale + tag ----------
const FRAGS = [
  '"engineer without a lane"',
  "take_the_next_step()",
  '"lives inside claude"',
  'case "end":',
  "return t.stop()",
  "async(function(){",
  'console.log("haidrrrry")',
  '"ships on phones"',
  "awrap(u.default)",
  "agent_skills: [...]",
  "deploy(backends)",
  "train(models)",
  "ship(apps)",
  "0x2A",
  '"runs on servers"',
  "engineer.next",
];
const FRAG_COLORS = [C.string, C.keyword, C.func, C.number];
const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = 48;
  const grow = interpolate(frame, [0, 180], [0.7, 1.25], {
    easing: (x) => 1 - Math.pow(1 - x, 2),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagP = spring({ frame: frame - 18, fps, config: { damping: 12, stiffness: 150, mass: 0.7 } });
  const urlP = spring({ frame: frame - 40, fps, config: { damping: 16, stiffness: 120, mass: 0.8 } });
  const endFade = interpolate(frame, [166, 179], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        perspective: 1100,
        opacity: endFade,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `rotateY(${frame * 0.12}deg) rotateX(${Math.sin(frame / 90) * 4}deg) scale(${grow})`,
        }}
      >
        {Array.from({ length: n }).map((_, i) => {
          const theta = i * 2.39996;
          const r = 150 + (i % 16) * 34 + hash(i) * 60;
          const x = 540 + Math.cos(theta) * r * 1.35;
          const y = 540 + Math.sin(theta) * r;
          const z = (hash(i + 7) - 0.5) * 850;
          const rot = (hash(i + 3) - 0.5) * 50;
          const color = FRAG_COLORS[i % 4];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                opacity: enter * (0.45 + hash(i + 11) * 0.55),
                transform: `translate(-50%,-50%) translateZ(${z}px) rotate(${rot}deg)`,
                fontFamily: "JetBrains Mono",
                fontSize: 20 + hash(i + 5) * 14,
                fontWeight: 600,
                whiteSpace: "nowrap",
                color,
                textShadow: `0 0 16px ${color}88`,
              }}
            >
              {FRAGS[i % FRAGS.length]}
            </div>
          );
        })}
      </div>
      {/* dark halo so the tag reads over the fragment field */}
      <div
        style={{
          position: "absolute",
          width: 760,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(7,11,20,0.85), transparent 70%)",
          opacity: tagP,
        }}
      />
      {/* center tag — the one glowing element */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          transform: `scale(${tagP})`,
        }}
      >
        <div
          style={{
            fontFamily: "JetBrains Mono",
            fontWeight: 700,
            fontSize: 88,
            color: C.tag,
            textShadow:
              "0 0 30px rgba(244,246,251,0.5), 0 0 90px rgba(140,233,154,0.35)",
          }}
        >
          @haidrrrry
        </div>
        <div
          style={{
            opacity: urlP,
            transform: `translateY(${interpolate(urlP, [0, 1], [20, 0])}px)`,
            fontFamily: "JetBrains Mono",
            fontWeight: 500,
            fontSize: 34,
            color: C.string,
            textShadow: "0 0 18px rgba(140,233,154,0.5)",
          }}
        >
          github.com/haidrrrry
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- assembly ----------
export const CodeEdit: React.FC = () => {
  const frame = useCurrentFrame();
  // whip-transition blur into the finale
  const whip = interpolate(frame, [412, 420], [0, 14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const unwhip = interpolate(frame, [420, 428], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ filter: `blur(${frame < 420 ? whip : unwhip}px)` }}>
        <Sequence durationInFrames={75}>
          <S1 />
        </Sequence>
        <Sequence from={75} durationInFrames={75}>
          <S2 />
        </Sequence>
        <Sequence from={150} durationInFrames={105}>
          <S3 />
        </Sequence>
        <Sequence from={255} durationInFrames={75}>
          <S4 />
        </Sequence>
        <Sequence from={330} durationInFrames={90}>
          {/* drive section: slow push through the page, highlights breathing */}
          <S2 />
        </Sequence>
        <Sequence from={420} durationInFrames={180}>
          <S6 />
        </Sequence>
      </AbsoluteFill>

      <Audio src={staticFile("sfx/track.wav")} volume={0.85} />

      {/* CRT scanlines + vignette + grain, always on top */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(180deg, rgba(255,255,255,0.028) 0 1px, transparent 1px 4px)",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 46%, rgba(0,0,4,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
