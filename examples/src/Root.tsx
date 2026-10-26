import React from "react";
import { AbsoluteFill, Composition, Sequence, useVideoConfig } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/Fraunces";
import { FocusCatPromo, FTOTAL_S } from "./focuscat/FocusCat";
import { SkillPromo, TOTAL_S as SKILL_TOTAL_S } from "./skill/SkillPromo";
import { SelfFix, SELF_TOTAL_F } from "./selffix/SelfFix";
import { CodeEdit, CE_TOTAL_F } from "./codeedit/CodeEdit";
import { BgMesh, Grade, Grain, Vignette } from "./components/Layers";
import { Hook } from "./scenes/Hook";
import { Bio } from "./scenes/Bio";
import { Ships } from "./scenes/Ships";
import { CTA } from "./scenes/CTA";

loadDisplay();
loadBody();
loadMono();
loadSerif();

const FPS = 30;

// scene durations in seconds — all frame timing derives from fps
const SCENES = { hook: 2.7, bio: 3.7, ships: 3.2, cta: 2.4 };
const TOTAL_S = SCENES.hook + SCENES.bio + SCENES.ships + SCENES.cta;

const Promo: React.FC = () => {
  const { fps } = useVideoConfig();
  const hookF = Math.round(fps * SCENES.hook);
  const bioF = Math.round(fps * SCENES.bio);
  const shipsF = Math.round(fps * SCENES.ships);
  const ctaF = Math.round(fps * SCENES.cta);
  return (
    <AbsoluteFill>
      {/* layer 1: background mesh */}
      <BgMesh />
      {/* layers 2–3: content */}
      <Sequence durationInFrames={hookF}>
        <Hook duration={hookF} />
      </Sequence>
      <Sequence from={hookF} durationInFrames={bioF}>
        <Bio duration={bioF} />
      </Sequence>
      <Sequence from={hookF + bioF} durationInFrames={shipsF}>
        <Ships duration={shipsF} />
      </Sequence>
      <Sequence from={hookF + bioF + shipsF} durationInFrames={ctaF}>
        <CTA duration={ctaF} />
      </Sequence>
      {/* layer 4: grade — layer 5: grain + vignette on top */}
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <>
    <Composition
      id="HaidrrrryPromo"
      component={Promo}
      durationInFrames={Math.round(FPS * TOTAL_S)}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="SkillPromo"
      component={SkillPromo}
      durationInFrames={Math.round(FPS * SKILL_TOTAL_S)}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="CodeEdit"
      component={CodeEdit}
      durationInFrames={CE_TOTAL_F}
      fps={FPS}
      width={1080}
      height={1080}
    />
    <Composition
      id="SelfFix"
      component={SelfFix}
      durationInFrames={SELF_TOTAL_F}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="FocusCatPromo"
      component={FocusCatPromo}
      durationInFrames={Math.round(FPS * FTOTAL_S)}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
