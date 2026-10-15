"use client";

import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Zap, ArrowUpRight, Sparkles } from "lucide-react";
import { gsap } from "./gsapPlugins";

interface HeroNavigationProps {
  onLaunchApp: () => void;
}

export const HeroNavigation: React.FC<HeroNavigationProps> = ({ onLaunchApp }) => {
  const containerRef = useRef<HTMLElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const leftFoldRef = useRef<HTMLDivElement>(null);
  const centerFoldRef = useRef<HTMLDivElement>(null);
  const rightFoldRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Optical illusion 3D interactive physics tracking
  const mouseState = useRef({
    targetRx: 0,
    targetRy: 0,
    targetRz: 0,
    currentRx: 0,
    currentRy: 0,
    currentRz: 0,
    mouseX: 0.5,
  });

  useEffect(() => {
    let rafId = 0;
    const animate = () => {
      const m = mouseState.current;
      m.currentRx += (m.targetRx - m.currentRx) * 0.1;
      m.currentRy += (m.targetRy - m.currentRy) * 0.1;
      m.currentRz += (m.targetRz - m.currentRz) * 0.1;

      if (ribbonRef.current) {
        ribbonRef.current.style.transform = `perspective(1100px) rotateX(${m.currentRx.toFixed(
          2
        )}deg) rotateY(${m.currentRy.toFixed(2)}deg) rotateZ(${m.currentRz.toFixed(2)}deg)`;
      }

      // Parallax fold depth between overlapping illusion planes
      if (leftFoldRef.current) {
        leftFoldRef.current.style.transform = `translateZ(26px) rotateY(${(
          m.currentRy * 0.7 - 4
        ).toFixed(2)}deg)`;
      }
      if (centerFoldRef.current) {
        centerFoldRef.current.style.transform = `translateZ(8px) rotateX(${(-m.currentRx * 0.3).toFixed(
          2
        )}deg)`;
      }
      if (rightFoldRef.current) {
        rightFoldRef.current.style.transform = `translateZ(30px) rotateY(${(
          m.currentRy * 0.8 + 5
        ).toFixed(2)}deg)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x / rect.width) * 2 - 1; // -1 to 1
    const normY = (y / rect.height) * 2 - 1; // -1 to 1

    mouseState.current.targetRx = -normY * 6; // Max 6 deg pitch
    mouseState.current.targetRy = normX * 8;  // Max 8 deg yaw
    mouseState.current.targetRz = normX * -1.2; // Subtle Dutch roll tilt
    mouseState.current.mouseX = x / rect.width;
  };

  const handleMouseLeave = () => {
    mouseState.current.targetRx = 0;
    mouseState.current.targetRy = 0;
    mouseState.current.targetRz = 0;
    mouseState.current.mouseX = 0.5;
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ribbonRef.current,
        { y: -40, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "viralytixEase" }
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
      className="fixed top-3 md:top-6 left-0 right-0 z-50 px-3 md:px-8 transition-transform pointer-events-none"
    >
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* ── 3D OPTICAL ILLUSION FOLDED RIBBON CONTAINER ─────────────────── */}
        <div
          ref={ribbonRef}
          className="relative transition-transform duration-75 ease-out will-change-transform filter drop-shadow-[0_24px_50px_rgba(0,0,0,0.92)] select-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ── BACKGROUND LAYER: OPTICAL ILLUSION CONTINUOUS FOLDED TAPE ─── */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-visible">
            <svg
              className="w-full h-full min-h-[72px]"
              viewBox="0 0 1200 84"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Ribbon Front Face: Metallic Graphite Obsidian */}
                <linearGradient id="ribbonFront" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#141419" />
                  <stop offset="30%" stopColor="#1C1C24" />
                  <stop offset="70%" stopColor="#181820" />
                  <stop offset="100%" stopColor="#0F0F14" />
                </linearGradient>

                {/* Left Fold Flap: Bright Origami Facet (Overlapping Front) */}
                <linearGradient id="origamiLeftTop" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#EDEDF5" />
                  <stop offset="100%" stopColor="#D5D5E2" />
                </linearGradient>

                {/* Origami Reverse Fold Under-Shadow */}
                <linearGradient id="origamiUnderShadow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B0B0E" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
                </linearGradient>

                {/* Optical Illusion Crease Line Specular */}
                <linearGradient id="creaseHighlight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#00E83F" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
                </linearGradient>

                {/* Right Fold Ribbon Terminal */}
                <linearGradient id="origamiRightTop" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00FF55" />
                  <stop offset="60%" stopColor="#00E83F" />
                  <stop offset="100%" stopColor="#00A82D" />
                </linearGradient>

                {/* Optical Illusion Drop Shadow on Fold Creases */}
                <filter id="foldShadow" x="-15%" y="-20%" width="130%" height="150%">
                  <feDropShadow dx="-8" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.75" />
                </filter>
              </defs>

              {/* ── 1. BOTTOM IMPOSSIBLE UNDER-FOLD (Underlayer Ribbon Bending Away) ── */}
              <polygon
                points="210,54 440,54 370,82 120,82"
                fill="url(#origamiUnderShadow)"
              />
              <polygon
                points="120,82 370,82 340,84 100,84"
                fill="#00E83F"
                opacity="0.3"
              />

              {/* ── 2. CENTER CONTINUOUS METALLIC RIBBON TRACK ─────────────── */}
              {/* Lower Bevel Strip */}
              <polygon
                points="220,52 1180,52 1150,68 180,68"
                fill="#0A0A0D"
              />
              {/* Main Body */}
              <polygon
                points="240,12 1195,12 1180,52 220,52"
                fill="url(#ribbonFront)"
              />
              {/* Top Bevel Highlight Strip */}
              <polygon
                points="260,0 1200,0 1195,12 240,12"
                fill="#2E2E3C"
              />
              {/* Fine Specular Hairline */}
              <line x1="260" y1="0.5" x2="1200" y2="0.5" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.6" />

              {/* ── 3. OPTICAL ILLUSION CREASE / DIAGONAL FOLD OVERLAY ──────── */}
              {/* Diagonal 45° Crease dividing center bar */}
              <line x1="250" y1="0" x2="210" y2="68" stroke="url(#creaseHighlight)" strokeWidth="2.5" />
              <polygon
                points="250,0 262,0 222,68 210,68"
                fill="#000000"
                opacity="0.5"
              />

              {/* ── 4. LEFT 3D OVERLAPPING ORIGAMI PLAQUE (Folds OUTWARD) ──── */}
              {/* Fold Under-Drop Shadow */}
              <polygon
                points="10,6 250,6 220,68 0,68"
                fill="#000000"
                filter="url(#foldShadow)"
                opacity="0.65"
              />
              {/* Leftmost Origami Ear / Reverse Facet */}
              <polygon
                points="0,32 36,6 30,64 0,52"
                fill="#8C8C9C"
              />
              {/* Main Origami Front Plate */}
              <polygon
                points="36,6 250,6 220,68 30,64"
                fill="url(#origamiLeftTop)"
              />
              {/* Top Bevel Edge on Plate */}
              <polygon
                points="36,6 80,0 262,0 250,6"
                fill="#FFFFFF"
              />
              {/* Bottom Cut Edge on Plate */}
              <polygon
                points="30,64 220,68 200,74 20,70"
                fill="#545464"
              />

              {/* ── 5. RIGHT OPTICAL FOLD ARROWHEAD (Folds INWARD/OUTWARD) ─── */}
              {/* Right Diamond Chevron Facets */}
              <polygon
                points="1195,12 1200,34 1175,54 1180,52"
                fill="#00CC44"
              />
            </svg>
          </div>

          {/* ── FOREGROUND INTERACTIVE CONTENT WITH 3D ISOMETRIC ELEVATION ──── */}
          <div className="relative z-10 flex items-center justify-between min-h-[72px] px-3 md:px-6 py-2">
            {/* ── 1. LEFT: 3D ORIGAMI LOGO PRISM (Elevated 26px in 3D Space) ─── */}
            <div
              ref={leftFoldRef}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3 cursor-pointer select-none group pr-6 md:pr-10 transition-transform duration-100 ease-out will-change-transform"
            >
              {/* 3D Kinetic Origami Emblem */}
              <div className="relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shrink-0">
                {/* 3D Multi-Layered Diamond Hex Core */}
                <div
                  className="absolute inset-0 rounded-md bg-gradient-to-br from-[#00FF55] via-[#00E83F] to-[#008A20] shadow-[0_0_20px_rgba(0,232,63,0.6)] group-hover:shadow-[0_0_32px_rgba(0,232,63,0.9)] transition-all duration-300"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    transform: "rotate(45deg)",
                  }}
                />
                <div
                  className="absolute inset-[2.5px] bg-[#0A0A0E] flex items-center justify-center transition-colors group-hover:bg-[#050508]"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    transform: "rotate(45deg)",
                  }}
                >
                  <Zap className="w-4 h-4 text-[#00E83F] fill-[#00E83F] filter drop-shadow-[0_0_8px_rgba(0,232,63,0.8)] transition-transform duration-300 group-hover:scale-115" />
                </div>
              </div>

              {/* Typography: Bold Architectural Sans with Emerald Accent */}
              <div className="flex flex-col justify-center">
                <div className="flex items-baseline leading-none">
                  <span className="font-sans font-black text-lg md:text-xl text-[#08080C] tracking-tighter">
                    VIRAL
                  </span>
                  <span className="font-sans font-black text-lg md:text-xl text-[#008A20] tracking-tighter ml-0.5">
                    YTIX
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E83F] ml-1 mb-0.5 inline-block animate-pulse shadow-[0_0_10px_#00E83F]" />
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-[#4A4A58] font-black">
                    AUDIENCE ILLUSION ENGINE
                  </span>
                  <span className="text-[7px] font-mono px-1 py-0.2 rounded bg-black/10 text-[#008A20] font-black border border-black/15">
                    3D
                  </span>
                </div>
              </div>
            </div>

            {/* ── 2. CENTER: FLOATING NAVIGATION RIBBON STRIP ───────────────── */}
            <nav
              ref={centerFoldRef}
              className="hidden md:flex items-center gap-1 lg:gap-3 text-xs font-mono tracking-widest uppercase font-bold transition-transform duration-100 ease-out will-change-transform"
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
                    className="relative px-3.5 py-1.5 rounded-md transition-all duration-200 flex items-center group cursor-pointer"
                    style={{
                      transform: isHovered ? "translateZ(14px) translateY(-2px)" : "translateZ(0px)",
                    }}
                  >
                    {/* Illusional Backlit Fold Pill */}
                    {isHovered && (
                      <div
                        className="absolute inset-0 bg-white/10 border-t border-l border-white/25 border-b border-r border-black/50 shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-all"
                        style={{
                          clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                        }}
                      />
                    )}

                    {/* Numeric Index Tag */}
                    <span className="text-[9px] font-mono text-[#00E83F] mr-1.5 opacity-75 group-hover:opacity-100 transition-opacity">
                      {item.num}
                    </span>

                    {/* Nav Label */}
                    <span
                      className={`relative z-10 transition-colors ${
                        isHovered ? "text-[#00E83F] drop-shadow-[0_0_10px_rgba(0,232,63,0.8)]" : "text-[#D8D8E2]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </nav>

            {/* ── 3. RIGHT: 3D FOLDED DIRECT BUTTON ("LAUNCH ENGINE") ──────── */}
            <div
              ref={rightFoldRef}
              className="flex items-center pl-2 md:pl-4 transition-transform duration-100 ease-out will-change-transform"
            >
              <button
                onClick={onLaunchApp}
                className="relative group cursor-pointer overflow-hidden transition-all duration-300 active:scale-95 filter drop-shadow-[0_8px_20px_rgba(0,232,63,0.35)] hover:drop-shadow-[0_12px_32px_rgba(0,232,63,0.65)]"
                style={{
                  clipPath: "polygon(14px 0%, 100% 0%, calc(100% - 14px) 100%, 0% 100%)",
                }}
              >
                {/* 3D Faceted Neon Bevel Edge */}
                <div className="p-[1.5px] bg-gradient-to-r from-white via-[#00FF55] to-[#009B29]">
                  {/* Button Core with Diagonal Origami Shading */}
                  <div className="relative px-5 md:px-7 py-2 md:py-2.5 bg-gradient-to-br from-[#00FF55] via-[#00E83F] to-[#00B832] text-[#08080C] font-mono font-black text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 md:gap-2.5">
                    {/* Animated Diagonal Specular Shine */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transform duration-700 ease-in-out" />

                    {/* Content */}
                    <span className="relative z-10 drop-shadow-sm font-extrabold text-[#08080C]">
                      LAUNCH ENGINE
                    </span>

                    {/* 3D Arrow Indicator with Interactive Lift */}
                    <span className="relative z-10 w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#08080C]/15 flex items-center justify-center group-hover:bg-[#08080C] transition-colors">
                      <ArrowUpRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#08080C] group-hover:text-[#00E83F] transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
