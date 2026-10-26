---
name: remotion-motion-graphics
description: Create and edit professional, deeply personalized motion graphics videos with Remotion (React-based video). Before any code it runs a mandatory 8-question discovery interview (goal, audience, one message, unique detail, text amount, pace, look, no-gos) so the video fits the person and never looks like generic AI slop. Use this skill EVERY time the user wants to create a video, edit a video, animate something, build an intro/outro/logo animation, make a Reel/Short/promo/launch video, add text animations or captions to footage, composite images and B-roll into a video, or mentions Remotion, motion graphics, video rendering, or "make this video look better/less generic". Also trigger when editing an existing Remotion project or when the user complains their video looks basic, generic, or amateur — this skill contains the exact fixes. Always read this skill BEFORE writing any Remotion code.
---

# Remotion Motion Graphics

Remotion renders React components frame-by-frame into video. Code quality is not the
bottleneck — **motion design craft is**. Untrained generation produces linear easing,
opacity-only fades, simultaneous entrances, flat colors, and no texture. That is the
"generic AI video" look. This skill exists to prevent it.

But craft alone is not enough. A perfectly eased video with three sentences per
scene, a cut every second, and invented marketing claims is still slop. The
other half of generic output is **missing information**: every question you
don't ask gets answered by the statistical average. So every video starts with
the discovery interview (Step 0) and is verified against the resulting brief.

## Non-negotiable rules (apply to EVERY composition)

0. **No code before the brief.** Run the 8-question discovery interview
   (`references/discovery-interview.md`), write `brief.md`, get the user's OK on
   the scene plan and exact on-screen texts. Its caps (words per screen,
   min shot length, number of beats, no-gos) are as binding as rules 1–10.
1. **NEVER use linear interpolation.** Every `interpolate()` gets an easing curve;
   every entrance prefers `spring()`. Always `extrapolateLeft/Right: "clamp"`.
2. **Entrances animate 2–3 properties together** (opacity + translateY + scale).
   A lone fade is forbidden.
3. **Stagger everything.** Lists, words, rays, cards: 3–6 frame offsets. Nothing
   enters simultaneously.
4. **Exits exist and are faster than entrances** (~10 frames vs ~20).
5. **Five-layer stack in every scene**, bottom to top: background mesh → assets →
   graphics/type → color grade → grain + vignette. Never a flat solid background.
6. **Every still image gets Ken Burns** (slow scale 1→1.08 + pan). Every video asset
   uses `<OffthreadVideo>`, never `<Video>`.
7. **Idle elements breathe**: anything on screen >2s gets sin-wave micro-motion.
8. **All timing derives from `fps`** via `useVideoConfig()`. No magic frame numbers.
9. **One theme object** at the top of the project (colors, easings, spring presets,
   fonts). Never inline a hex color or easing in a component.
10. **Render, extract frames, LOOK at them, fix, re-render.** Never deliver an
    unverified render. This loop is mandatory — see Verification below.

## Workflow

### Step 0 — Discovery interview (mandatory, every new video or edit)
Read `references/discovery-interview.md` and ask the user ALL 8 questions, in
their language — whether the video is for work, private life, or anything else:

1. **Anlass & Ziel** — what should the viewer do, feel, or know afterwards?
2. **Publikum & Abspielort** — who, where, sound on or muted, how long?
3. **Eine Botschaft & Streichliste** — the one sentence to remember; max 3 essentials, rest is cut.
4. **Das Unverwechselbare** — the real number/name/detail that exists only for them.
5. **Text & Sprache im Bild** — none / keywords / short sentences / subtitles; voice-over; Du/Sie.
6. **Tempo, Schnitt & Ton** — calm / balanced / energetic; music, SFX, silence.
7. **Look, Marke & Material** — logo, colors, fonts, photos, footage — or 3 adjectives.
8. **No-Gos** — what they never want to see (neon, glitch, emojis, clichés, …).

Pre-fill answers the request already implies and let the user confirm — never
silently skip. In Claude Code use `AskUserQuestion` (two calls: Q1–4, Q5–8).
Max one follow-up round for vague answers. Then translate the answers with the
table in the reference file into hard limits, write `brief.md` (template in the
reference) into the project root, show the scene plan with the **exact
on-screen texts**, and wait for the user's OK. Only an explicit "skip the
questions" bypasses this — then use the safe defaults and state them as
assumptions.

### Step 1 — Scope
Derive from `brief.md`: duration, fps (30 default; 60 only for heavy fast motion),
dimensions (1080×1920 Reels/Shorts, 1920×1080 landscape/presentation), which
real assets to use (copy them to `public/`), and whether this is a new composition
or an edit to an existing project. If the requested duration can't hold the
essential beats at the chosen pace and reading-time floor, say so now — never
solve it by cutting faster or shrinking text.
If editing an existing project: read `src/` fully first, find the theme (or create one),
and refactor violations of the rules above before adding features.

### Step 2 — Setup
New project:
```bash
npm install remotion @remotion/cli react react-dom
# optional: @remotion/transitions @remotion/motion-blur @remotion/google-fonts
```
Copy `assets/theme.ts` from this skill into `src/theme.ts`, adjust the palette to
the user's brand (Q7), and set `PACE` to the preset chosen in Q6 and
`MAX_WORDS` to the cap from Q5. Drop stylistic defaults the user listed as
no-gos (Q8) — e.g. grain, glow, bouncy springs. Structure: `src/index.ts` (registerRoot) → `src/Root.tsx`
(Composition, duration/fps/size) → `src/scenes/*.tsx` → `src/components/*.tsx`.
User assets go in `public/`, loaded via `staticFile()`.

### Step 3 — Build
Read `references/motion-patterns.md` for the reusable component implementations
(BgMesh, Grade, Grain, Vignette, KenBurns, WordReveal, Stagger, Counter, Spark,
transitions, parallax). Compose scenes from those patterns. For pacing, rhythm,
typography, color palettes, and sound design rules, read
`references/design-rules.md`.

Scene rhythm: HIT → hold → build → HIT, with hold and shot lengths from
`theme.pace`. Something must move in the first 15 frames. Never >90 frames
without a new visual element (for the "calm" pace, slow camera drift or Ken
Burns counts as new motion — don't add elements just to hit a quota).
Build exactly the scenes in the approved scene plan — one idea per scene, the
approved texts verbatim. The unique detail from Q4 is the hero of the PAYOFF.
Every text block stays on screen for at least `textHoldFrames(words, fps)`
frames (exported from the theme).

### Step 4 — Render
```bash
npx remotion render src/index.ts <CompId> out/video.mp4 --codec h264 --crf 17
```
Remotion needs a Chromium binary. If its auto-download fails (sandboxes, offline CI),
find one and pass it explicitly:
```bash
which chromium chromium-browser google-chrome 2>/dev/null
ls /opt/pw-browsers 2>/dev/null   # Playwright installs live here
npx remotion render ... --browser-executable=<path>
```
If full Chrome errors with "Old Headless mode has been removed", use a
`headless_shell` binary instead (Playwright ships one as
`chromium_headless_shell-*/chrome-linux/headless_shell`).

### Step 5 — VERIFY (mandatory, never skip)
Extract frames at key moments and visually inspect each one. The portable
method — works on machines with no system ffmpeg, renders the exact frame:
```bash
for f in 15 45 90 150; do
  npx remotion still src/index.ts <CompId> out/check_$f.png --frame $f --overwrite
done
```
If system ffmpeg IS available, extracting from the finished mp4 also verifies
the encode itself (`-ss` seeking is more portable than `select=` filters, whose
quoting breaks in some shells and in Remotion's bundled ffmpeg):
```bash
ffmpeg -v error -ss 1.5 -i out/video.mp4 -frames:v 1 check_1.png
```
Look for, and fix, in order of frequency:
- **Spacing bugs**: `gap`/`margin` in `em` resolves against the PARENT font-size
  (often 16px), not the text size — use px values in flex containers around big type.
- Text overflowing or touching frame edges (keep critical content in middle 75%
  vertically for 9:16 — platform UI covers top/bottom).
- Elements visible before their entrance or after their exit (missing clamp).
- Color/contrast failures: hero color on >1 element per frame, dim text unreadable
  over the grade.
- Layer order mistakes (grain/vignette must be on top, grade above content).
Then check the frames **against `brief.md`** — this is where slop gets caught:
- Count words on every extracted frame: none above the Q5 cap.
- Every text block visible ≥ its reading-time floor; every shot ≥ the pace's
  min shot length (check the scene timings in code, not just frames).
- Nothing from the NO-GO list visible or audible.
- Number of BODY beats = approved essentials; nothing cut in Q3 crept back in.
- On-screen texts match the approved plan verbatim — no added claims, numbers,
  or filler phrases.
- Muted playback (Q2): does the message still land with the sound off?

Fix → re-render → re-extract → re-inspect. Only deliver after a clean pass.
Then run the final checklist at the bottom of `references/design-rules.md`.

### Step 6 — Deliver and ask two targeted questions
Deliver with a short recap of the brief (goal, message, pace, text option).
Then ask exactly two precise questions instead of "do you like it?" — in the
user's language, e.g. *"Ist das Tempo richtig, oder soll es ruhiger / schneller
sein?"* and *"Ist die Textmenge richtig, oder soll etwas raus?"* Update
`brief.md` with the answers before changing code, so the next iteration stays
consistent.

### Editing the user's existing footage
To enhance an existing mp4 (captions, grade, intro/outro) rather than build from
scratch: put the file in `public/`, render it as the asset layer with
`<OffthreadVideo src={staticFile("clip.mp4")} />`, set composition duration from the
clip length, and stack graphics/grade/grain above it. Get the clip's duration and fps
with `ffprobe` before setting up the composition. For word-synced captions over
speech, see the captions section of `references/motion-patterns.md`.

## Reference files
- `references/discovery-interview.md` — the 8 questions (DE/EN), follow-ups for
  vague answers, the answers → constraints translation table, anti-slop
  language rules, `brief.md` template. Read FIRST, before anything else.
- `references/motion-patterns.md` — copy-paste component library: backgrounds,
  grade/grain/vignette, Ken Burns, text reveals, counters, transitions, parallax,
  audio sync, captions. Read before writing components.
- `references/design-rules.md` — palettes, typography rules, scene architecture,
  sound design, pre-delivery checklist. Read before designing scenes and before
  final delivery.
- `assets/theme.ts` — the theme template to copy into every project
  (includes the pace presets and the reading-time helper).

## Common failure modes to actively avoid
- **Building before asking.** Starting code from a one-line request and
  "filling in" purpose, audience, text, and pace yourself. That is how the
  average — and the slop — gets in.
- **Too much text.** Squeezing every point the user mentioned onto the screen.
  Cut to the essentials from Q3; respect the word cap and reading-time floor.
- **Cutting too fast.** Treating speed as quality. Pace comes from Q6, and text
  on screen always wins over cut speed.
- **Invented content.** Made-up statistics, testimonials, or slogans. Use only
  facts the user provided (Q4); missing fact → ask or omit.
- **Applying every effect because the skill knows it.** Grain, glow, particles,
  and bounces are options, not obligations — the brief decides.
- **Emoji as icons.** Emoji render as full-color platform glyphs (green ✳️,
  blue 🌐) that ignore your palette and silently break the one-hero-color rule,
  and they sit on whatever background you gave them (orange mascot on orange
  tile = invisible). Draw glyphs with CSS/SVG in theme colors, or verify every
  emoji against the extracted frames.
- **No SFX assets is not a reason to ship silent.** Synthesize a minimal kit as
  16-bit WAVs from a Node script (noise-burst whoosh, pitch-drop pop, sine-thump
  kick/bass, detuned-sine pad) into `public/sfx/` — see `examples/scripts/` in
  the repo. Zero downloads, fully deterministic.
- Generating one giant component instead of themed, reusable pieces.
- `durationInFrames` mismatch between Composition and scene content (dead air).
- Forgetting `--overwrite` on re-renders, then inspecting the stale file.
- Fonts: never rely on system defaults for hero text; load a display font via
  `@remotion/google-fonts` or `@font-face` + `staticFile`.
- Trying to "describe" the result to the user instead of rendering and verifying it.
