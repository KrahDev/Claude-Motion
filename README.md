# 🎬 Claude Motion — persönliche Motion-Graphics mit Claude & Remotion

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Agent Skill](https://img.shields.io/badge/Claude-Agent%20Skill-8A63D2)](https://docs.anthropic.com/en/docs/claude-code)
[![Remotion](https://img.shields.io/badge/Built%20for-Remotion-00C2A8)](https://remotion.dev)

Ein [Claude](https://claude.com)-Skill, der Claude Code / Claude Desktop zu einem
Motion-Designer macht, der **erst zuhört und dann animiert**. Videos werden mit
[Remotion](https://remotion.dev) (React + TypeScript) gerendert — mit Springs,
gestaffelten Einblendungen, Color Grading, Ken Burns, Captions und Sounddesign.

Basiert auf [haidrrrry/claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill)
(MIT). Die Motion-Regeln von dort sind erhalten; neu ist das **Discovery-Interview**.

## Was ist neu? Das Discovery-Interview

Generische KI-Videos scheitern selten an der Animation, sondern am Briefing:
Jede Frage, die nicht gestellt wird, füllt die KI mit dem Durchschnitt — drei
Sätze pro Szene, ein Schnitt pro Sekunde, lila Glow, „Unlock your potential“.
Deshalb stellt Claude **vor jeder Zeile Code** immer diese 8 Fragen — egal ob
das Video beruflich, privat oder für etwas anderes ist:

| # | Frage | Verhindert |
|---|---|---|
| 1 | **Anlass & Ziel** — Was soll der Zuschauer danach tun, fühlen oder wissen? | Falsches Ende (z. B. Werbe-CTA im Geburtstagsvideo) |
| 2 | **Publikum & Abspielort** — Wer schaut wo, mit Ton oder stumm, wie lang? | Falsches Format, Botschaft geht stumm verloren |
| 3 | **Eine Botschaft & Streichliste** — Welcher eine Satz bleibt hängen? Welche max. 3 Punkte sind unverzichtbar? | Zu viele Informationen |
| 4 | **Das Unverwechselbare** — Welche echte Zahl, welcher Name, welches Detail gibt es nur bei dir? | Austauschbare Floskeln, erfundene Fakten |
| 5 | **Text & Sprache im Bild** — Kein Text / Schlagworte / kurze Sätze / Untertitel? Voice-over? Du oder Sie? | Zu viel Text, unlesbare Sätze |
| 6 | **Tempo, Schnitt & Ton** — Ruhig / ausgewogen / energisch? Musik, Effekte, Stille? | Zu schnelle Schnitte |
| 7 | **Look, Marke & Material** — Logo, Farben, Schriften, Fotos, Footage — oder 3 Adjektive | Stock-Look, falsche Markenfarben |
| 8 | **No-Gos** — Was willst du auf keinen Fall sehen? (Neon, Glitch, Emojis, Floskeln …) | Effekt-Overkill |

Die Antworten werden in **harte Grenzen** übersetzt und als `brief.md` im
Projekt abgelegt, zum Beispiel:

- **Text:** max. Wörter pro Bild (0 / 5 / 10 / 7 je Untertitel) und eine
  Lesezeit-Untergrenze von `1 s + Wörter / 3` pro Textblock — wenn die Zeit nicht
  reicht, werden Wörter gestrichen, nicht Zeit.
- **Tempo:** Mindestlänge pro Einstellung (ruhig 3 s · ausgewogen 1,5 s ·
  energisch 0,5 s), Übergangs- und Haltezeiten als Presets in `theme.ts`.
- **Dichte:** Anzahl der Szenen-Beats = Anzahl unverzichtbarer Punkte (max. 3),
  eine Idee pro Szene.
- **No-Gos** überschreiben Stil-Defaults (Grain, Glow, Bounce …), aber nie die
  Handwerksregeln (Easing, Timing, Render-Kontrolle).

Vor dem Bauen zeigt Claude den Szenenplan mit den **exakten Texten** zur
Freigabe. Nach dem Rendern wird jedes geprüfte Frame auch gegen das Briefing
gecheckt (Wortanzahl, Schnittlängen, No-Gos, keine erfundenen Fakten). Zum
Schluss fragt Claude gezielt nach Tempo und Textmenge statt „Gefällt’s dir?“.

Details: [`remotion-motion-graphics/references/discovery-interview.md`](remotion-motion-graphics/references/discovery-interview.md)

## 🎥 Demo (aus dem Original-Repo)

[![Demo](demo.gif)](demo.mp4)

## 📦 Inhalt

```
remotion-motion-graphics/
├── SKILL.md                      # Workflow: Interview → Brief → Build → Render → Prüfen
├── references/
│   ├── discovery-interview.md    # NEU: 8 Fragen (DE/EN), Nachfragen, Übersetzungstabelle,
│   │                             #   Anti-Slop-Sprachregeln, brief.md-Vorlage
│   ├── motion-patterns.md        # 17 Copy-Paste-Komponenten
│   └── design-rules.md           # Paletten, Typo, Pacing, Sound, Checkliste (+ Brief-Check)
└── assets/
    └── theme.ts                  # Theme inkl. Tempo-Presets & Lesezeit-Helfer
```

## 🚀 Installation

**Claude Code (für alle Projekte):**
```bash
git clone https://github.com/KrahDev/Claude-Motion.git
mkdir -p ~/.claude/skills
cp -r Claude-Motion/remotion-motion-graphics ~/.claude/skills/
```

**Claude Code (nur für ein Projekt):**
```bash
git clone https://github.com/KrahDev/Claude-Motion.git
mkdir -p .claude/skills
cp -r Claude-Motion/remotion-motion-graphics .claude/skills/
```

**Claude Desktop / Claude.ai:** `remotion-motion-graphics.skill` unter
**Einstellungen → Capabilities → Skills** hochladen.

**Test:** Schreib *„Mach mir ein kurzes Video zum 60. Geburtstag meiner Mutter“*.
Claude sollte zuerst die 8 Fragen stellen — nicht sofort Code schreiben.

## 🧠 Die Regeln (Kurzfassung)

0. Kein Code vor dem Briefing — 8 Fragen, `brief.md`, Freigabe des Szenenplans
1. Nie lineare Interpolation — Springs/Bezier + Clamp
2. Einblendungen animieren 2–3 Eigenschaften gleichzeitig
3. Alles gestaffelt
4. Ausblendungen existieren und sind schneller als Einblendungen
5. Fünf-Ebenen-Stack: Hintergrund → Assets → Grafik → Grade → Grain/Vignette
6. Jedes Standbild bekommt Ken Burns; Footage nutzt `OffthreadVideo`
7. Ruhende Elemente „atmen“
8. Alle Timings aus `fps` abgeleitet
9. Ein `theme.ts` — keine Inline-Farben oder -Easings
10. Rendern → Frames prüfen → fixen → neu rendern. Nie ungeprüft ausliefern.

## Beispiele

[`examples/`](examples/) enthält das Remotion-Projekt des Originals mit vier
fertigen Kompositionen:

```bash
cd examples
npm install
npm run audio            # SFX und Musik synthetisieren
npm run render:selffix   # oder render:codeedit / render:profile / render:focuscat
```

Nach Änderungen am Skill-Ordner `scripts/build-skill.sh` ausführen, damit die
`.skill`-Datei für Claude Desktop aktuell bleibt.

## 📄 Lizenz

[MIT](LICENSE) — Original © 2025 haidrrrry.
