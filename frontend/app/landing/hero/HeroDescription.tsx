"use client";

import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { Zap } from "lucide-react";
import { gsap } from "./gsapPlugins";

export interface HeroDescriptionRef {
  getDescElement: () => HTMLDivElement | null;
  getCTAsElement: () => HTMLDivElement | null;
}

interface HeroDescriptionProps {
  onLaunchApp: () => void;
}

export const HeroDescription = forwardRef<HeroDescriptionRef, HeroDescriptionProps>(
  ({ onLaunchApp }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const ctasRef = useRef<HTMLDivElement>(null);
    const descTextRef = useRef<HTMLParagraphElement>(null);

    useImperativeHandle(ref, () => ({
      getDescElement: () => containerRef.current,
      getCTAsElement: () => ctasRef.current,
    }));

    return (
      <div ref={containerRef} className="space-y-6 pt-2 z-10">
        <p
          ref={descTextRef}
          className="hero-description max-w-xl text-base md:text-lg text-[#222222] font-normal leading-relaxed"
        >
          VIRALYTIX extracts multimodal visual, audio, and speech signals from
          your video — then simulates how 100 AI viewer personas react before
          publication.
        </p>

        {/* Hero Bottom Bar & Dual CTAs */}
        <div
          ref={ctasRef}
          className="border-t border-black/10 pt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={onLaunchApp}
              className="px-8 py-4 rounded-full bg-[#111111] text-[#F5F1E6] font-mono font-black text-xs uppercase tracking-widest hover:bg-[#00E83F] hover:text-[#111111] transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.2)] active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>LAUNCH ENGINE →</span>
            </button>

            <a
              href="#signals"
              className="px-6 py-4 rounded-full border border-black/20 text-[#111111] font-mono text-xs uppercase tracking-widest hover:border-[#00E83F] hover:bg-[#00E83F]/10 transition-all text-center font-bold"
            >
              EXPLORE THE SYSTEM
            </a>
          </div>

          {/* System Spec Readout */}
          <div className="text-right text-[10px] font-mono text-[#111111]/60 space-y-0.5 hidden sm:block">
            <div>FRAME RATE: 60FPS • SIGNAL DIMENSIONS: 32-D</div>
            <div>SHAP EXPLAINABILITY ENGINE • FULLY ISOLATED RAM COMPUTE</div>
          </div>
        </div>
      </div>
    );
  }
);

HeroDescription.displayName = "HeroDescription";
