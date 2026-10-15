"use client";

import React, { useRef, useState, useLayoutEffect } from "react";
import { Zap, ArrowRight, Sun, Moon, Sparkles } from "lucide-react";
import { gsap, ScrollToPlugin } from "./gsapPlugins";

interface HeroNavigationProps {
  onLaunchApp: () => void;
}

export const HeroNavigation: React.FC<HeroNavigationProps> = ({ onLaunchApp }) => {
  const containerRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Entrance animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pillRef.current,
        { y: -30, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "viralytixEase" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (typeof window === "undefined") return;
    const target = document.querySelector(targetId);
    if (target) {
      gsap.to(window, {
        duration: 1.1,
        scrollTo: { y: target, offsetY: 90 },
        ease: "viralytixEase",
      });
    }
  };

  return (
    <header
      ref={containerRef}
      className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 md:px-8 transition-transform pointer-events-none flex justify-center"
    >
      <div className="w-full max-w-5xl pointer-events-auto">
        {/* ── HYBRID FROSTED GLASS CAPSULE (Mixture of Tourera Glass Pill + Illoca Geometric Structure) ── */}
        <div
          ref={pillRef}
          className="relative flex items-center justify-between px-3 md:px-5 py-2 md:py-2.5 rounded-full bg-[#0A0A0E]/80 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.25)] transition-all duration-300"
        >
          {/* Subtle Top Specular Rim Reflection */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          {/* ── LEFT: BRAND BLOCK (Tourera Pill Header + Illoca Geometric Icon Badge) ── */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center cursor-pointer select-none group"
          >
            {/* Illoca-Inspired 4-Quadrant Geometric Icon Badge */}
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 flex items-center justify-center p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.3)] group-hover:border-[#00E83F]/60 group-hover:shadow-[0_0_20px_rgba(0,232,63,0.35)] transition-all duration-300">
              <div className="w-full h-full grid grid-cols-2 gap-0.5">
                {/* Quadrant 1: Horizontal Signal Bars */}
                <div className="bg-[#00E83F] rounded-tl-sm flex flex-col justify-between p-[1px]">
                  <div className="w-full h-[1px] bg-black/40" />
                  <div className="w-full h-[1px] bg-black/40" />
                </div>
                {/* Quadrant 2: Growth Arrow / Chevron */}
                <div className="bg-white rounded-tr-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 border-t-2 border-r-2 border-[#0A0A0E] rotate-45" />
                </div>
                {/* Quadrant 3: Target Eye / Focus Circle */}
                <div className="bg-white/80 rounded-bl-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0A0A0E]" />
                </div>
                {/* Quadrant 4: Curved Radial Sector */}
                <div className="bg-[#00E83F] rounded-br-lg" />
              </div>
            </div>

            {/* Wordmark (Clean Architectural Typography) */}
            <span className="font-sans font-black text-base md:text-lg tracking-tight text-[#F4F1EA] ml-3 group-hover:text-white transition-colors">
              viralytix
            </span>

            {/* Tourera-Inspired Vertical Divider */}
            <div className="h-4 w-[1px] bg-white/20 mx-3.5 hidden sm:block" />
          </div>

          {/* ── CENTER: NAVIGATION LINKS (Tourera Horizontal Flow) ─────────── */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs md:text-sm font-sans tracking-tight text-[#F4F1EA]/75">
            {[
              { id: "#signals", label: "Signals" },
              { id: "#swarm", label: "Swarm" },
              { id: "#models", label: "Models" },
              { id: "#explainability", label: "Attribution" },
            ].map((item) => {
              const isHovered = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.id}
                  onClick={(e) => handleNavClick(e, item.id)}
                  onMouseEnter={() => setActiveTab(item.id)}
                  onMouseLeave={() => setActiveTab(null)}
                  className="relative px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer font-medium hover:text-white"
                >
                  {isHovered && (
                    <div className="absolute inset-0 rounded-full bg-white/10 border border-white/15 transition-all shadow-sm" />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* ── RIGHT: TOGGLE & DIRECT BUTTON ──────────────────────────────── */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Tourera-Inspired Ambient Toggle Pill (Sun / Moon) */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-[#F4F1EA]/80 transition-all cursor-pointer shadow-inner"
              title="Toggle Environment Mode"
            >
              <Sun
                className={`w-3.5 h-3.5 transition-colors ${
                  !isDarkMode ? "text-amber-300 fill-amber-300" : "text-[#F4F1EA]/40"
                }`}
              />
              <Moon
                className={`w-3.5 h-3.5 transition-colors ${
                  isDarkMode ? "text-[#00E83F] fill-[#00E83F]" : "text-[#F4F1EA]/40"
                }`}
              />
            </button>

            {/* Direct Button: Mixture of Tourera Pill + Illoca Block Accent */}
            <button
              onClick={onLaunchApp}
              className="group relative cursor-pointer overflow-hidden rounded-full px-5 md:px-6 py-2 md:py-2.5 bg-[#F5F1EA] text-[#0A0A0E] hover:bg-[#00E83F] font-sans font-bold text-xs md:text-sm tracking-tight transition-all duration-300 flex items-center gap-2 shadow-[0_4px_16px_rgba(245,241,234,0.2)] hover:shadow-[0_4px_24px_rgba(0,232,63,0.45)] active:scale-95"
            >
              {/* Illoca-Inspired Icon Box inside the Button */}
              <span className="w-4 h-4 rounded-md bg-[#0A0A0E] text-[#F5F1EA] group-hover:bg-[#0A0A0E] group-hover:text-[#00E83F] flex items-center justify-center transition-colors">
                <Zap className="w-2.5 h-2.5 fill-current" />
              </span>

              <span>Launch Engine</span>

              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroNavigation;
