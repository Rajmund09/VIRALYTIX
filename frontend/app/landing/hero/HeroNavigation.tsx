"use client";

import React, { useState, useEffect } from "react";
import { Zap, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "./gsapPlugins";

interface HeroNavigationProps {
  onLaunchApp: () => void;
}

export const HeroNavigation: React.FC<HeroNavigationProps> = ({ onLaunchApp }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsScrolled(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll listener: ONLY for desktop (>= 768px)
  useEffect(() => {
    if (isMobile) {
      setIsScrolled(false);
      return;
    }

    const handleScroll = () => {
      if (window.innerWidth < 768) {
        setIsScrolled(false);
        return;
      }
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

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

  // ── ON SMALL DEVICES (< 768px): COMPLETELY NORMAL, NO ANIMATION, NO SPRING, ZERO LAG ──
  if (isMobile) {
    return (
      <header className="fixed top-3 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none flex justify-center">
        <div className="pointer-events-auto relative flex items-center justify-between w-full max-w-7xl rounded-[14px] bg-[#0A0D14]/90 border border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)] px-3.5 py-2.5">
          {/* Brand Logo + Wordmark */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center cursor-pointer select-none shrink-0"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="VIRALYTIX Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,232,63,0.55)]"
              />
            </div>
            <span className="font-sans font-black text-base tracking-tight text-[#F4F1EA] ml-2.5">
              viralytix
            </span>
          </div>

          {/* Direct Action Button */}
          <button
            onClick={onLaunchApp}
            className="group relative cursor-pointer overflow-hidden rounded-lg px-3.5 py-2 bg-[#F5F1EA] text-[#0A0A0E] font-sans font-bold text-xs tracking-tight flex items-center gap-1.5 border border-white/20 shadow-sm active:scale-[0.98] transition-transform select-none"
          >
            <span className="w-4 h-4 rounded bg-[#0A0A0E] text-[#F5F1EA] flex items-center justify-center shrink-0">
              <Zap className="w-2.5 h-2.5 fill-current" />
            </span>
            <span className="text-[#0A0A0E]">Launch</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0A0A0E]" />
          </button>
        </div>
      </header>
    );
  }

  // ── ON DESKTOP (>= 768px): FULL CINEMATIC ANIMATIONS & MORPHING DOCK ──
  return (
    <motion.header
      initial={{ y: -60, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-3 md:top-5 left-0 right-0 z-50 px-3 sm:px-6 md:px-8 pointer-events-none flex transition-[justify-content] duration-500 ${
        isScrolled ? "justify-start" : "justify-center"
      }`}
    >
      {/* ── UNIFIED NAVBAR -> SMOOTHLY COLLAPSES EVERYTHING INWARDS INTO THE LOGO ON SCROLL ── */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 24,
          mass: 0.8,
        }}
        onClick={() => {
          if (isScrolled) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        className={`pointer-events-auto relative flex items-center transition-colors duration-500 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden ${
          isScrolled
            ? "w-11 h-11 md:w-14 md:h-14 rounded-2xl justify-center bg-[#090C12]/95 border-white/20 hover:border-[#00E83F]/70 hover:shadow-[0_0_25px_rgba(0,232,63,0.4)] cursor-pointer hover:scale-105 active:scale-95 p-2"
            : "w-full max-w-7xl justify-between rounded-[14px] bg-[#0A0D14]/85 px-3 sm:px-5 md:px-7 py-2.5 md:py-3"
        }`}
        title={isScrolled ? "VIRALYTIX • Click to return to top" : undefined}
      >
        {/* Subtle Top Specular Rim Reflection (Active in expanded bar) */}
        {!isScrolled && (
          <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
        )}

        {/* ── LEFT: BRAND LOGO + WORDMARK ── */}
        <div
          onClick={(e) => {
            if (!isScrolled) {
              e.stopPropagation();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center cursor-pointer select-none group shrink-0"
        >
          {/* Official VIRALYTIX Brand Logo */}
          <div className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <img
              src="/logo.png"
              alt="VIRALYTIX Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(0,232,63,0.55)]"
            />
          </div>

          {/* Wordmark (Smoothly gets pulled into the logo when scrolling down) */}
          <AnimatePresence>
            {!isScrolled && (
              <motion.div
                initial={{ opacity: 0, width: 0, x: -10 }}
                animate={{ opacity: 1, width: "auto", x: 0 }}
                exit={{
                  opacity: 0,
                  width: 0,
                  x: -25,
                  scale: 0.6,
                  filter: "blur(4px)",
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center overflow-hidden whitespace-nowrap"
              >
                <span className="font-sans font-black text-base md:text-lg tracking-tight text-[#F4F1EA] ml-3 group-hover:text-white transition-colors">
                  viralytix
                </span>
                <div className="h-4 w-[1px] bg-white/20 mx-4 hidden sm:block" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CENTER: NAVIGATION LINKS (Smoothly glide inwards into the logo when scrolling) ── */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.nav
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: -60,
                scale: 0.5,
                filter: "blur(6px)",
              }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:flex items-center gap-2 lg:gap-5 text-sm font-sans tracking-normal text-[#F4F1EA]/80 overflow-hidden whitespace-nowrap"
            >
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
                    className="relative px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer font-medium hover:text-white"
                  >
                    {isHovered && (
                      <motion.div
                        layoutId="navHoverIndicator"
                        className="absolute inset-0 rounded-lg bg-white/10 border border-white/15 transition-all shadow-sm"
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                );
              })}
            </motion.nav>
          )}
        </AnimatePresence>

        {/* ── RIGHT: DIRECT ACTION BUTTON (Smoothly gets pulled into the logo when scrolling) ── */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.div
              initial={{ opacity: 0, x: 25, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: -90,
                scale: 0.4,
                filter: "blur(8px)",
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden whitespace-nowrap shrink-0"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLaunchApp();
                }}
                className="group relative cursor-pointer overflow-hidden rounded-lg px-3 sm:px-4 md:px-5 py-2 bg-[#F5F1EA] text-[#0A0A0E] font-sans font-bold text-xs md:text-sm tracking-tight flex items-center gap-1.5 sm:gap-2 border border-white/20 shadow-sm active:scale-[0.98] transition-transform select-none"
              >
                {/* Smooth Metallic Color Fill Sliding in from the Side */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, #9FA8B4 0%, #DCE3EA 32%, #FFFFFF 50%, #B6C0CC 68%, #939EA9 100%)",
                  }}
                />

                <span className="relative z-10 w-4 h-4 rounded bg-[#0A0A0E] text-[#F5F1EA] flex items-center justify-center shrink-0">
                  <Zap className="w-2.5 h-2.5 fill-current" />
                </span>

                <span className="relative z-10 text-[#0A0A0E] hidden sm:inline">Launch Engine</span>
                <span className="relative z-10 text-[#0A0A0E] sm:hidden">Launch</span>

                <ArrowRight className="relative z-10 w-3.5 h-3.5 text-[#0A0A0E]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
};

export default HeroNavigation;
