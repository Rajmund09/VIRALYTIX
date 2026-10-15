"use client";

import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Zap, ArrowUpRight } from "lucide-react";
import { gsap } from "./gsapPlugins";

interface HeroNavigationProps {
  onLaunchApp: () => void;
}

export const HeroNavigation: React.FC<HeroNavigationProps> = ({ onLaunchApp }) => {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Smooth 3D mouse parallax tracking
  const mouse = useRef({ currentRx: 0, currentRy: 0, targetRx: 0, targetRy: 0, px: 50 });

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const m = mouse.current;
      m.currentRx += (m.targetRx - m.currentRx) * 0.1;
      m.currentRy += (m.targetRy - m.currentRy) * 0.1;

      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1000px) rotateX(${m.currentRx.toFixed(2)}deg) rotateY(${m.currentRy.toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    mouse.current.targetRx = -normY * 4.5;
    mouse.current.targetRy = normX * 5.0;
    mouse.current.px = (x / rect.width) * 100;
  };

  const handleMouseLeave = () => {
    mouse.current.targetRx = 0;
    mouse.current.targetRy = 0;
  };

  // Smooth entrance
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: -30, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "viralytixEase" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 md:px-8 transition-transform pointer-events-none"
    >
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* ── 3D FLOATING FACETED HUD BAR ─────────────────────────────────── */}
        <div
          ref={cardRef}
          className="relative flex items-center justify-between p-1.5 md:p-2 transition-transform duration-75 ease-out will-change-transform filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ── 3D FACETED OBSIDIAN SHELL BACKGROUND ────────────────────────── */}
          <div
            className="absolute inset-0 z-0 bg-[#0A0A0E]/92 backdrop-blur-2xl border-t border-white/20 border-b border-black/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]"
            style={{
              clipPath:
                "polygon(0% 0%, calc(100% - 24px) 0%, 100% 50%, calc(100% - 24px) 100%, 0% 100%)",
            }}
          >
            {/* Top Specular Rim */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            {/* Subtle Neon Underline Glow */}
            <div className="absolute bottom-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-[#00E83F]/30 to-transparent" />
          </div>

          {/* ── SECONDARY ANGLED UNDER-SLIVER (Matching Ref Photo Under-Fold) ─── */}
          <div
            className="absolute -bottom-2 left-6 w-48 md:w-72 h-3.5 -z-10 bg-gradient-to-r from-[#D8D8E5] via-[#A0A0B0] to-transparent opacity-80 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, calc(100% - 30px) 100%, 0% 100%)",
            }}
          />

          {/* ── FOREGROUND CONTENT ─────────────────────────────────────────── */}
          <div className="relative z-10 w-full flex items-center justify-between px-3 md:px-5 py-1">
            {/* ── 1. LEFT: 3D FACETED ORIGAMI LOGO BADGE ───────────────────── */}
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-3.5 cursor-pointer select-none"
              style={{ transform: "translateZ(18px)" }}
            >
              {/* 3D Geometric Polygonal Prism Frame */}
              <div
                className="relative px-3.5 py-1.5 bg-gradient-to-br from-[#FFFFFF] via-[#E8E8F0] to-[#C8C8D8] text-[#0A0A0E] flex items-center gap-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.4)] group-hover:shadow-[0_6px_22px_rgba(0,232,63,0.35)] transition-all"
                style={{
                  clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
                }}
              >
                {/* 3D Faceted Emerald Crystal Icon */}
                <div
                  className="w-6 h-6 rounded-sm bg-gradient-to-br from-[#00FF55] via-[#00E83F] to-[#009928] flex items-center justify-center shadow-[0_0_12px_rgba(0,232,63,0.7)] group-hover:scale-105 transition-transform"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                >
                  <Zap className="w-3.5 h-3.5 text-[#0A0A0E] fill-[#0A0A0E]" />
                </div>

                {/* Typography: Bold, high-contrast, modern */}
                <div className="flex flex-col">
                  <div className="flex items-center leading-none">
                    <span className="font-sans font-black text-base md:text-lg text-[#08080C] tracking-tight">
                      VIRAL
                    </span>
                    <span className="font-sans font-extrabold text-base md:text-lg text-[#008A20] tracking-tight ml-0.5">
                      YTIX
                    </span>
                  </div>
                  <span className="font-mono text-[7px] md:text-[8px] uppercase tracking-widest text-[#555562] font-black -mt-0.5">
                    NEURAL HUD v2.4
                  </span>
                </div>
              </div>
            </div>

            {/* ── 2. CENTER: SLEEK HIGH-TECH NAVIGATION LINKS ──────────────── */}
            <nav
              className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-mono tracking-widest uppercase font-bold"
              style={{ transform: "translateZ(12px)" }}
            >
              {[
                { id: "#signals", num: "01", label: "SIGNALS" },
                { id: "#swarm", num: "02", label: "SWARM" },
                { id: "#models", num: "03", label: "MODELS" },
                { id: "#explainability", num: "04", label: "SHAP" },
              ].map((item) => {
                const isHovered = activeTab === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.id}
                    onClick={(e) => handleNavClick(e, item.id)}
                    onMouseEnter={() => setActiveTab(item.id)}
                    onMouseLeave={() => setActiveTab(null)}
                    className="relative px-3.5 py-1.5 transition-all duration-200 flex items-center group cursor-pointer"
                  >
                    {/* 3D Chamfered Hover Indicator */}
                    {isHovered && (
                      <div
                        className="absolute inset-0 bg-white/10 border-t border-l border-white/25 border-b border-r border-black/40 shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-all"
                        style={{
                          clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
                        }}
                      />
                    )}

                    <span className="text-[9px] font-mono text-[#00E83F] mr-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                      {item.num}
                    </span>

                    <span
                      className={`relative z-10 transition-colors ${
                        isHovered ? "text-[#00E83F] drop-shadow-[0_0_8px_rgba(0,232,63,0.6)]" : "text-[#D0D0DE]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </nav>

            {/* ── 3. RIGHT: 3D CYBER-PRISM DIRECT BUTTON ("LAUNCH ENGINE") ─── */}
            <div
              className="flex items-center pl-4"
              style={{ transform: "translateZ(20px)" }}
            >
              <button
                onClick={onLaunchApp}
                className="relative group cursor-pointer overflow-hidden transition-all duration-300 active:scale-95"
                style={{
                  clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
                }}
              >
                {/* 3D Chamfered Glowing Border Frame */}
                <div className="p-[1.5px] bg-gradient-to-r from-white via-[#00E83F] to-[#008A20] shadow-[0_0_20px_rgba(0,232,63,0.4)] group-hover:shadow-[0_0_35px_rgba(0,232,63,0.7)] transition-shadow">
                  {/* Button Core */}
                  <div className="relative px-5 md:px-7 py-2 bg-gradient-to-r from-[#00FF55] via-[#00E83F] to-[#00B832] text-[#0A0A0E] font-mono font-black text-xs md:text-sm uppercase tracking-wider flex items-center gap-2">
                    {/* Specular Light Sweep on Hover */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transform duration-700 ease-in-out" />

                    <span className="relative z-10 drop-shadow-sm font-extrabold text-[#08080C]">
                      LAUNCH ENGINE
                    </span>

                    <span className="relative z-10 w-4 h-4 rounded-full bg-[#0A0A0E]/15 flex items-center justify-center group-hover:bg-[#0A0A0E] transition-colors">
                      <ArrowUpRight className="w-3 h-3 text-[#0A0A0E] group-hover:text-[#00E83F] transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroNavigation;
