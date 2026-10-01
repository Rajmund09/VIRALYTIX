"use client";

import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "./gsapPlugins";
import { HeroNavigation } from "./HeroNavigation";
import { HeroHeadline, HeroHeadlineRef } from "./HeroHeadline";
import Silk from "./Silk";

interface HeroProps {
  onLaunchApp: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLaunchApp }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HeroHeadlineRef>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Master Initial Page-Load Entrance Sequence (Silky Smooth GSAP Motion)
      const entranceTl = gsap.timeline({
        defaults: { ease: "cinemaEase" },
      });

      // 0.20: Unique Letter 3D Spatial Convergence & Assembly
      if (headlineRef.current) {
        entranceTl.add(headlineRef.current.getAssemblyTimeline(), 0.2);
      }

      // 1.80: Bottom Bar (Curly brace & Green pill CTA) reveal
      if (bottomBarRef.current) {
        entranceTl.fromTo(
          bottomBarRef.current,
          { opacity: 0, y: 35, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "cinemaEase" },
          1.8
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero relative min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-[92rem] mx-auto flex flex-col justify-between bg-[#0B0C10] text-[#F5F1E6] rounded-b-[3.5rem] border-b border-x border-[#F5F1E6]/15 shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden select-none z-10"
    >
      {/* 1. Deep Midnight Silk Background Canvas */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <Silk
          speed={6}
          scale={1.3}
          color="#1E1B4B"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {/* 2. High-Tech Dot Matrix Grid Overlay */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(rgba(245,241,230,0.12)_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />

      {/* 3. Rich Ambient Glow Accents */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[28rem] bg-gradient-to-br from-[#00E83F]/15 via-[#1E1B4B]/35 to-transparent rounded-full blur-[130px]" />
        <div className="absolute bottom-6 right-8 w-[35rem] h-[20rem] bg-gradient-to-t from-[#F5A7E8]/15 via-[#1E1B4B]/20 to-transparent rounded-full blur-[110px]" />
      </div>

      {/* Navigation Bar */}
      <HeroNavigation onLaunchApp={onLaunchApp} />

      {/* Hero Main Layout: Staggered Headline matching GSAP Reference Photo */}
      <div className="z-10 my-auto py-8 w-full flex flex-col justify-center">
        <HeroHeadline ref={headlineRef} />
      </div>

      {/* Hero Bottom Bar */}
      <div
        ref={bottomBarRef}
        className="z-10 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        {/* Bottom-Left Description matching user photo */}
        <div className="text-sm md:text-base font-mono font-semibold tracking-wide text-[#E5E0D8] max-w-xl leading-relaxed">
          VIRALYTIX – Multimodal AI virality engine
        </div>

        {/* Bottom-Right Green Outline Pill CTA Button */}
        <button
          onClick={onLaunchApp}
          className="group px-8 py-3.5 rounded-full border border-[#00E83F] text-[#F5F1E6] font-mono text-xs font-extrabold uppercase tracking-widest hover:bg-[#00E83F] hover:text-[#0B0B0A] transition-all flex items-center gap-3 shadow-[0_0_25px_rgba(0,232,63,0.3)] hover:shadow-[0_0_35px_rgba(0,232,63,0.6)] active:scale-95"
        >
          <span>Get Started</span>
          <span className="text-base group-hover:translate-y-0.5 transition-transform">↓</span>
        </button>
      </div>
    </section>
  );
};
