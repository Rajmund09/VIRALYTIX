"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "./gsapPlugins";
import { HeroNavigation } from "./HeroNavigation";
import { HeroHeadline, HeroHeadlineRef } from "./HeroHeadline";
import Silk from "./Silk";

interface HeroProps {
  onLaunchApp: () => void;
}

const PARTY_POPPERS = [
  // 3D Social Stickers shooting upwards in an UPWARD V-SHAPE (\ /)
  // Left wing of the V (Facebook outer-top, Instagram mid)
  { src: "/stickers/sticker-facebook.png", x: -64, y: -114, rot: -26, scale: 1.05, delay: 0.05 },
  { src: "/stickers/sticker-instagram.png", x: -34, y: -86, rot: -14, scale: 1.15, delay: 0.02 },
  // Center base / vertex of the V
  { src: "/stickers/sticker-tiktok.png", x: 0, y: -58, rot: 8, scale: 1.25, delay: 0 },
  // Right wing of the V (YouTube mid, LinkedIn outer-top)
  { src: "/stickers/sticker-youtube.png", x: 34, y: -86, rot: 14, scale: 1.15, delay: 0.02 },
  { src: "/stickers/sticker-linkedin.png", x: 64, y: -114, rot: 26, scale: 1.05, delay: 0.05 },
  // Sparkles & confetti fanning upwards along the two wings of the V
  { color: "#38BDF8", x: -74, y: -130, size: 6, delay: 0.06 },
  { color: "#FFFFFF", x: -52, y: -140, size: 6, delay: 0.04 },
  { color: "#F59E0B", x: -24, y: -102, size: 7, delay: 0.03 },
  { color: "#A78BFA", x: 24, y: -102, size: 7, delay: 0.03 },
  { color: "#FFFFFF", x: 52, y: -140, size: 6, delay: 0.04 },
  { color: "#FF2E55", x: 74, y: -130, size: 6, delay: 0.06 },
  { color: "#E2E8F0", x: -12, y: -74, size: 5, delay: 0.01 },
  { color: "#60A5FA", x: 12, y: -74, size: 5, delay: 0.01 },
];

export const Hero: React.FC<HeroProps> = ({ onLaunchApp }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HeroHeadlineRef>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setBurstKey((k) => k + 1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Master Initial Page-Load Entrance Sequence (Silky Smooth GSAP Motion with Hydration Grace Delay)
      const entranceTl = gsap.timeline({
        defaults: { ease: "cinemaEase" },
        delay: 0.35,
      });

      // Unique Letter 3D Spatial Convergence & Assembly
      if (headlineRef.current) {
        entranceTl.add(headlineRef.current.getAssemblyTimeline(), 0.1);
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
      className="hero relative min-h-screen pt-28 pb-12 px-3 sm:px-6 lg:px-8 max-w-[92rem] mx-auto flex flex-col justify-between bg-[#0B0B0A] text-[#F5F1E6] overflow-hidden select-none"
    >
      {/* Pure Silk Background Canvas */}
      <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
        <Silk
          speed={12}
          scale={1.25}
          color="#1E1B4B"
          noiseIntensity={1.8}
          rotation={0}
        />
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
        className="z-10 pt-6 flex flex-col md:flex-row items-center md:items-center justify-between gap-5 text-center md:text-left"
      >
        {/* Bottom-Left Description matching user photo */}
        <div className="text-xs sm:text-sm md:text-base font-mono font-semibold tracking-wide text-[#E5E0D8] max-w-xl leading-relaxed">
          VIRALYTIX – Multimodal AI virality engine
        </div>

        {/* Bottom-Right 3D Metallic Pill CTA Button with Party Popper Burst from Gap */}
        <div className="relative">
          <button
            onClick={onLaunchApp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative cursor-pointer px-6 py-3 sm:px-8 sm:py-3.5 rounded-full text-[#F1F5F9] font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center transition-all duration-500 active:scale-[0.98] select-none"
            style={{
              background: "linear-gradient(180deg, rgba(45, 52, 66, 0.85) 0%, rgba(24, 28, 38, 0.92) 50%, rgba(12, 15, 22, 0.98) 100%)",
              border: "1px solid rgba(203, 213, 225, 0.32)",
              boxShadow: isHovered
                ? "inset 0 1px 2px rgba(255, 255, 255, 0.5), inset 0 -1px 2px rgba(0, 0, 0, 0.7), 0 10px 24px -4px rgba(0, 0, 0, 0.5), 0 0 12px rgba(180, 200, 230, 0.12)"
                : "inset 0 1px 1px rgba(255, 255, 255, 0.35), inset 0 -1px 2px rgba(0, 0, 0, 0.7), 0 6px 16px -2px rgba(0, 0, 0, 0.45)",
            }}
          >
            {/* Word: GET */}
            <span
              className={`transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isHovered ? "-translate-x-2.5 sm:-translate-x-4" : "translate-x-0"
              }`}
            >
              GET
            </span>

            {/* Gap in the middle that opens on hover - ORIGIN OF SPRINKLE */}
            <div
              className={`relative flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isHovered ? "w-8 sm:w-12" : "w-2"
              }`}
            >
              {/* NO green dot! Only the party popper burst shooting out from this exact gap */}
              <AnimatePresence>
                {isHovered && (
                  <div
                    key={burstKey}
                    className="absolute left-1/2 -top-1 -translate-x-1/2 pointer-events-none z-50 overflow-visible"
                  >
                    {PARTY_POPPERS.map((p, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ x: 0, y: 0, scale: 0.15, opacity: 0, rotate: 0 }}
                        animate={{
                          x: [0, p.x * 0.75, p.x],
                          y: [0, p.y, p.y + 10],
                          scale: [0.15, (p as any).scale || 1, ((p as any).scale || 1) * 0.9, 0],
                          opacity: [0, 1, 0.95, 0],
                          rotate: [0, (p as any).rot ? (p as any).rot * 0.5 : 90, (p as any).rot || 180],
                        }}
                        transition={{
                          duration: 1.5,
                          times: [0, 0.35, 0.75, 1],
                          ease: [0.16, 1, 0.3, 1],
                          delay: p.delay,
                        }}
                        className="absolute"
                        style={{
                          left: "0",
                          top: "0",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {"src" in p ? (
                          <div className="w-6 h-6 md:w-7 md:h-7 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                            <img src={p.src} alt="" width={28} height={28} className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div
                            className="rounded-full filter drop-shadow-[0_0_6px_currentColor]"
                            style={{
                              backgroundColor: p.color,
                              color: p.color,
                              width: `${p.size}px`,
                              height: `${p.size}px`,
                            }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Word: STARTED + Arrow moving together as one unit */}
            <span
              className={`flex items-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isHovered ? "translate-x-2.5 sm:translate-x-4" : "translate-x-0"
              }`}
            >
              <span>STARTED</span>
              <span className="text-base text-[#CBD5E1] transition-transform duration-300 group-hover:translate-y-0.5">
                ↓
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
