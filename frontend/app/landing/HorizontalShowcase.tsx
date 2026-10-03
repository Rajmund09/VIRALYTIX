"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FileVideo,
  Activity,
  Sparkles,
  Zap,
  Layers,
  Users,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface HorizontalShowcaseProps {
  onLaunchApp?: () => void;
}

// Motion Design Helper Component: Splits text into 3D flippable kinetic words & characters
const KineticText: React.FC<{
  text: string;
  className?: string;
  highlightIndices?: number[];
  highlightColor?: string;
}> = ({ text, className = "", highlightIndices = [], highlightColor = "#00E83F" }) => {
  return (
    <span className={`inline-block perspective-[1000px] ${className}`}>
      {text.split(" ").map((word, wordIdx) => (
        <span
          key={wordIdx}
          className="kinetic-word inline-block transform-gpu will-change-transform mr-[0.25em]"
        >
          {word.split("").map((char, charIdx) => {
            const globalIdx = wordIdx * 10 + charIdx;
            const isHighlighted = highlightIndices.includes(globalIdx);
            return (
              <span
                key={charIdx}
                className="kinetic-char inline-block transform-gpu will-change-transform"
                style={isHighlighted ? { color: highlightColor } : undefined}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

export const HorizontalShowcase: React.FC<HorizontalShowcaseProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // References for 3 Horizontal Panels
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      const container = containerRef.current;
      const track = trackRef.current;

      if (!container || !track) return;

      const totalWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const xTranslate = -(totalWidth - viewportWidth);

      const ctx = gsap.context(() => {
        // 1. MASTER HORIZONTAL SCROLL TRACK SCRUB
        const horizontalTween = gsap.to(track, {
          x: xTranslate,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // 2. PANEL 01: 3D FORWARD FLIP ENTRANCE FOR CARDS & KINETIC TEXT
        if (panel1Ref.current) {
          // 3D Character Flip
          const chars1 = panel1Ref.current.querySelectorAll(".kinetic-char");
          gsap.fromTo(
            chars1,
            { rotationX: -120, rotationY: 45, opacity: 0, y: 30, z: -100 },
            {
              rotationX: 0,
              rotationY: 0,
              opacity: 1,
              y: 0,
              z: 0,
              duration: 0.8,
              stagger: 0.03,
              ease: "back.out(1.6)",
              scrollTrigger: {
                trigger: panel1Ref.current,
                containerAnimation: horizontalTween,
                start: "left 85%",
                toggleActions: "play none none reverse",
              },
            }
          );

          // 3D Forward Flip for 3 Signal Stream Cards
          const cards1 = panel1Ref.current.querySelectorAll(".flip-card-3d");
          gsap.fromTo(
            cards1,
            { rotationY: -65, rotationX: 30, opacity: 0, z: -180, scale: 0.8 },
            {
              rotationY: 0,
              rotationX: 0,
              opacity: 1,
              z: 0,
              scale: 1,
              duration: 1.0,
              stagger: 0.18,
              ease: "back.out(1.5)",
              scrollTrigger: {
                trigger: panel1Ref.current,
                containerAnimation: horizontalTween,
                start: "left 70%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // 3. PANEL 02: 3D BACKWARD FLIP ENTRANCE FOR VECTOR CLUSTER CHIPS
        if (panel2Ref.current) {
          // 3D Character Flip for Title
          const chars2 = panel2Ref.current.querySelectorAll(".kinetic-char");
          gsap.fromTo(
            chars2,
            { rotationX: 120, rotationY: -45, opacity: 0, y: -30, z: -120 },
            {
              rotationX: 0,
              rotationY: 0,
              opacity: 1,
              y: 0,
              z: 0,
              duration: 0.8,
              stagger: 0.03,
              ease: "back.out(1.6)",
              scrollTrigger: {
                trigger: panel2Ref.current,
                containerAnimation: horizontalTween,
                start: "left 80%",
                toggleActions: "play none none reverse",
              },
            }
          );

          // 3D Alternating Flip for Vector Dimension Badges
          const badges2 = panel2Ref.current.querySelectorAll(".vector-badge-3d");
          gsap.fromTo(
            badges2,
            {
              rotationX: (i) => (i % 2 === 0 ? -140 : 140),
              rotationY: (i) => (i % 2 === 0 ? 60 : -60),
              opacity: 0,
              scale: 0.4,
              z: -150,
            },
            {
              rotationX: 0,
              rotationY: 0,
              opacity: 1,
              scale: 1,
              z: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: "elastic.out(1.1, 0.5)",
              scrollTrigger: {
                trigger: panel2Ref.current,
                containerAnimation: horizontalTween,
                start: "left 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // 4. PANEL 03: 3D SPATIAL SWARM FLIP FOR PERSONA CARDS
        if (panel3Ref.current) {
          // 3D Character Flip for Title
          const chars3 = panel3Ref.current.querySelectorAll(".kinetic-char");
          gsap.fromTo(
            chars3,
            { rotationX: -90, opacity: 0, z: -80 },
            {
              rotationX: 0,
              opacity: 1,
              z: 0,
              duration: 0.7,
              stagger: 0.025,
              ease: "power3.out",
              scrollTrigger: {
                trigger: panel3Ref.current,
                containerAnimation: horizontalTween,
                start: "left 80%",
                toggleActions: "play none none reverse",
              },
            }
          );

          // 3D Swarm Flip for 6 Viewer Persona Cards
          const personas3 = panel3Ref.current.querySelectorAll(".persona-card-3d");
          gsap.fromTo(
            personas3,
            {
              rotationY: (i) => (i % 2 === 0 ? 85 : -85),
              rotationX: -45,
              opacity: 0,
              scale: 0.65,
              z: -160,
            },
            {
              rotationY: 0,
              rotationX: 0,
              opacity: 1,
              scale: 1,
              z: 0,
              duration: 1.0,
              stagger: 0.12,
              ease: "back.out(1.4)",
              scrollTrigger: {
                trigger: panel3Ref.current,
                containerAnimation: horizontalTween,
                start: "left 70%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // 5. Floating Badge Micro-Tilt Oscillations
        const floatingBadges = track.querySelectorAll(".floating-badge");
        floatingBadges.forEach((badge, idx) => {
          gsap.to(badge, {
            y: idx % 2 === 0 ? -8 : 8,
            rotation: idx % 2 === 0 ? "+=2" : "-=2",
            duration: 2 + (idx % 3) * 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });
      }, container);

      return () => ctx.revert();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#0A0A09] text-[#F4F1EA] overflow-hidden border-t border-[#F4F1EA]/10 font-sans select-none"
    >
      {/* ── SEAMLESS CONNECTING MOTION TRACK LINE ACROSS ALL 3 PANELS ────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <svg
          className="w-[300vw] h-full opacity-30"
          viewBox="0 0 3000 800"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="seamlessPipelineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00E83F" />
              <stop offset="45%" stopColor="#F5A7E8" />
              <stop offset="90%" stopColor="#FF7A00" />
            </linearGradient>
            <filter id="trackGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Continuous Glowing Signal Cable Path bridging Section 03 -> 04 -> 05 */}
          <path
            d="M 100 400 C 400 150, 700 650, 1000 400 C 1300 150, 1700 650, 2000 400 C 2300 150, 2700 650, 2900 400"
            fill="none"
            stroke="url(#seamlessPipelineGrad)"
            strokeWidth="4"
            filter="url(#trackGlow)"
            strokeDasharray="16 10"
            className="animate-[pulse_4s_ease-in-out_infinite]"
          />
        </svg>

        {/* Ambient Grid Matrix Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(244,241,234,0.08)_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      {/* Scroll Track Container (300vw Horizontal Layout) */}
      <div
        ref={trackRef}
        className="flex h-full w-[300vw] will-change-transform relative z-10"
      >
        {/* ════════════════════════════════════════════════════════════════════
            PANEL 01: 03 // THREE INDEPENDENT SIGNAL STREAMS
           ════════════════════════════════════════════════════════════════════ */}
        <div
          ref={panel1Ref}
          className="w-[100vw] h-full flex-shrink-0 p-8 sm:p-12 md:p-16 flex flex-col justify-between border-r border-[#F4F1EA]/10 bg-gradient-to-r from-[#0A0A09] via-[#0D0D12] to-[#120E14] relative overflow-hidden perspective-[1200px]"
        >
          {/* Subtle Ambient Radial Green Glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00E83F]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Panel Header & Kinetic Motion Title */}
          <div className="space-y-6 max-w-5xl z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#00E83F] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#00E83F]/10 border border-[#00E83F]/30">
                03 // THREE INDEPENDENT SIGNAL STREAMS
              </span>
              <span className="text-xs font-mono text-[#F4F1EA]/50">
                FRAME-BY-FRAME MULTIMODAL PARSING
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-[#F4F1EA]">
              <KineticText
                text="MULTIMODAL FEATURE"
                highlightIndices={[0, 10]}
                highlightColor="#00E83F"
              />{" "}
              <span className="floating-badge inline-block px-4 py-1 sm:px-6 sm:py-2 rounded-2xl bg-[#00E83F] text-black font-extrabold text-3xl sm:text-5xl lg:text-6xl -rotate-3 shadow-2xl shadow-[#00E83F]/30 border-2 border-black transform-gpu will-change-transform">
                EXTRACTOR
              </span>
            </h2>

            <p className="text-sm sm:text-base font-mono text-[#F4F1EA]/70 max-w-2xl leading-relaxed">
              Extracted frame-by-frame using FFmpeg, OpenCV optical flow, and Wav2Vec acoustic frequency mapping.
            </p>
          </div>

          {/* 3 Signal Stream Cards Grid with 3D Forward Flip Entrance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto z-10 perspective-[1200px]">
            {/* Stream 01: Visual Signals */}
            <div className="flip-card-3d p-6 sm:p-8 rounded-3xl bg-[#181816]/90 border border-[#00E83F]/30 space-y-5 hover:border-[#00E83F] transition-all shadow-2xl hover:shadow-[#00E83F]/20 group relative transform-gpu will-change-transform">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#00E83F]/15 border border-[#00E83F]/40 flex items-center justify-center text-[#00E83F]">
                  <FileVideo className="w-6 h-6" />
                </div>
                <span className="floating-badge px-3 py-1 rounded-full bg-[#00E83F] text-black font-mono font-bold text-[11px] -rotate-2">
                  STREAM 01
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#F4F1EA] group-hover:text-[#00E83F] transition-colors">
                  Visual Signals
                </h3>
                <p className="text-xs text-[#F4F1EA]/70 leading-relaxed mt-1">
                  Optical motion vectors, scene cut velocity, contrast delta, frame brightness variance, and text density overlay.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F4F1EA]/10 font-mono text-xs text-[#00E83F] space-y-1.5 bg-[#0A0A09]/60 p-3 rounded-xl">
                <div className="flex justify-between">
                  <span>▸ Motion Delta</span>
                  <span className="font-bold">14.8px/frame</span>
                </div>
                <div className="flex justify-between text-[#F4F1EA]/80">
                  <span>▸ Scene Cuts</span>
                  <span className="font-bold">1.8 cuts/sec</span>
                </div>
              </div>
            </div>

            {/* Stream 02: Audio Dynamics */}
            <div className="flip-card-3d p-6 sm:p-8 rounded-3xl bg-[#181816]/90 border border-[#F5A7E8]/30 space-y-5 hover:border-[#F5A7E8] transition-all shadow-2xl hover:shadow-[#F5A7E8]/20 group relative transform-gpu will-change-transform">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#F5A7E8]/15 border border-[#F5A7E8]/40 flex items-center justify-center text-[#F5A7E8]">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="floating-badge px-3 py-1 rounded-full bg-[#F5A7E8] text-black font-mono font-bold text-[11px] rotate-3">
                  STREAM 02
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#F4F1EA] group-hover:text-[#F5A7E8] transition-colors">
                  Audio Dynamics
                </h3>
                <p className="text-xs text-[#F4F1EA]/70 leading-relaxed mt-1">
                  16kHz bandpass RMS loudness, spectral centroid frequency, acoustic energy peaks, and musical tension mapping.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F4F1EA]/10 font-mono text-xs text-[#F5A7E8] space-y-1.5 bg-[#0A0A09]/60 p-3 rounded-xl">
                <div className="flex justify-between">
                  <span>▸ RMS Loudness</span>
                  <span className="font-bold">-14.2 dB</span>
                </div>
                <div className="flex justify-between text-[#F4F1EA]/80">
                  <span>▸ Silence Ratio</span>
                  <span className="font-bold">4.2%</span>
                </div>
              </div>
            </div>

            {/* Stream 03: Speech & Hook */}
            <div className="flip-card-3d p-6 sm:p-8 rounded-3xl bg-[#181816]/90 border border-[#FF7A00]/30 space-y-5 hover:border-[#FF7A00] transition-all shadow-2xl hover:shadow-[#FF7A00]/20 group relative transform-gpu will-change-transform">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/15 border border-[#FF7A00]/40 flex items-center justify-center text-[#FF7A00]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="floating-badge px-3 py-1 rounded-full bg-[#FF7A00] text-black font-mono font-bold text-[11px] -rotate-3">
                  STREAM 03
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#F4F1EA] group-hover:text-[#FF7A00] transition-colors">
                  Speech & Hook
                </h3>
                <p className="text-xs text-[#F4F1EA]/70 leading-relaxed mt-1">
                  Whisper transcript analysis, 0-3s hook score, word delivery cadence, sentiment polarity, and CTA detection.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F4F1EA]/10 font-mono text-xs text-[#FF7A00] space-y-1.5 bg-[#0A0A09]/60 p-3 rounded-xl">
                <div className="flex justify-between">
                  <span>▸ Hook Score</span>
                  <span className="font-bold">8.8 / 10</span>
                </div>
                <div className="flex justify-between text-[#F4F1EA]/80">
                  <span>▸ Speech Pace</span>
                  <span className="font-bold">154 WPM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#F4F1EA]/40 z-10">
            <span>SCROLL RIGHT TO EXPLORE TOPOLOGY</span>
            <ArrowRight className="w-4 h-4 text-[#00E83F]" />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            PANEL 02: 04 // VECTOR CLUSTER TOPOLOGY
           ════════════════════════════════════════════════════════════════════ */}
        <div
          ref={panel2Ref}
          className="w-[100vw] h-full flex-shrink-0 p-8 sm:p-12 md:p-16 flex flex-col justify-between border-r border-[#F4F1EA]/10 bg-gradient-to-r from-[#120E14] via-[#101018] to-[#15121B] relative overflow-hidden perspective-[1200px]"
        >
          {/* Subtle Ambient Purple Glow */}
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F5A7E8]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="space-y-6 max-w-5xl z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#F5A7E8] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#F5A7E8]/10 border border-[#F5A7E8]/30">
                04 // VECTOR CLUSTER TOPOLOGY
              </span>
              <span className="text-xs font-mono text-[#F4F1EA]/50">
                32-DIMENSIONAL EMBEDDINGS
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-[#F4F1EA]">
              <KineticText
                text="32-DIMENSIONAL"
                highlightIndices={[0, 10]}
                highlightColor="#F5A7E8"
              />{" "}
              <span className="floating-badge inline-block px-4 py-1 sm:px-6 sm:py-2 rounded-2xl bg-[#F5A7E8] text-black font-extrabold text-3xl sm:text-5xl lg:text-6xl rotate-3 shadow-2xl shadow-[#F5A7E8]/30 border-2 border-black transform-gpu will-change-transform">
                FEATURE SPACE
              </span>
            </h2>
          </div>

          {/* Floating GSAP 3D Backward/Forward Flip Badges */}
          <div className="my-auto z-10 max-w-5xl space-y-8 perspective-[1200px]">
            <p className="text-sm font-mono text-[#F4F1EA]/60">
              High-dimensional video feature vectors mapped into non-linear attraction clusters:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { label: "MOTION DENSITY", bg: "#00E83F", rot: "-rotate-6", text: "black" },
                { label: "HOOK INTENSITY", bg: "#F5A7E8", rot: "rotate-4", text: "black" },
                { label: "AUDIO PACING", bg: "#FF7A00", rot: "-rotate-3", text: "black" },
                { label: "CUT RATE", bg: "#FFE500", rot: "rotate-6", text: "black" },
                { label: "PITCH VARIATION", bg: "#A855F7", rot: "-rotate-4", text: "white" },
                { label: "SENTIMENT", bg: "#10B981", rot: "rotate-3", text: "black" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`vector-badge-3d floating-badge ${item.rot} p-4 rounded-2xl font-mono font-extrabold text-xs text-center border-2 border-black shadow-2xl transition-transform hover:scale-110 cursor-pointer transform-gpu will-change-transform`}
                  style={{ backgroundColor: item.bg, color: item.text }}
                >
                  <div className="text-[10px] opacity-75 mb-0.5">DIM 0{idx + 1}</div>
                  <div>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Decorative Vector Topology Curve Graphic */}
            <div className="relative p-6 rounded-3xl bg-[#141416]/80 border border-[#F4F1EA]/15 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Layers className="w-8 h-8 text-[#F5A7E8]" />
                <div>
                  <div className="font-mono font-bold text-sm text-[#F4F1EA]">
                    LATENT VIRALITY CLUSTER
                  </div>
                  <div className="text-xs text-[#F4F1EA]/60 font-mono">
                    Euclidean Distance Metric: 0.942 (High Resonance)
                  </div>
                </div>
              </div>
              <div className="font-mono text-xs font-bold px-4 py-2 rounded-xl bg-[#00E83F]/20 text-[#00E83F] border border-[#00E83F]/30">
                ACTIVE PIPELINE
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#F4F1EA]/40 z-10">
            <span>SCROLL RIGHT TO BEHAVIORAL SIMULATION</span>
            <ArrowRight className="w-4 h-4 text-[#F5A7E8]" />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            PANEL 03: 05 // AUDIENCE BEHAVIORAL SIMULATION
           ════════════════════════════════════════════════════════════════════ */}
        <div
          ref={panel3Ref}
          className="w-[100vw] h-full flex-shrink-0 p-8 sm:p-12 md:p-16 flex flex-col justify-between bg-gradient-to-r from-[#15121B] via-[#14100C] to-[#1A140E] relative overflow-hidden perspective-[1200px]"
        >
          {/* Subtle Ambient Orange Glow */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FF7A00]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="space-y-6 max-w-5xl z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#FF7A00] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30">
                05 // AUDIENCE BEHAVIORAL SIMULATION
              </span>
              <span className="text-xs font-mono text-[#F4F1EA]/50">
                100 AI AGENTS SWARM
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-[#F4F1EA]">
              <KineticText
                text="THE AUDIENCE ISN'T"
                highlightIndices={[0, 10]}
                highlightColor="#FF7A00"
              />{" "}
              <span className="floating-badge inline-block px-4 py-1 sm:px-6 sm:py-2 rounded-2xl bg-[#FF7A00] text-black font-extrabold text-3xl sm:text-5xl lg:text-6xl -rotate-3 shadow-2xl shadow-[#FF7A00]/30 border-2 border-black transform-gpu will-change-transform">
                ONE PERSON.
              </span>
            </h2>

            <p className="text-sm sm:text-base font-mono text-[#F4F1EA]/70 max-w-2xl leading-relaxed">
              100 AI agents grouped into 6 distinct viewer personas simulate watch time, skip triggers, likes, comments, and shares.
            </p>
          </div>

          {/* 6 Viewer Persona Cards Grid with Alternating 3D Swarm Flip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-auto z-10 perspective-[1200px]">
            {[
              { name: "ALEX", role: "Tech Enthusiast", icon: "⚡", bg: "#00E83F", rot: "-rotate-2" },
              { name: "SAM", role: "Student", icon: "🎓", bg: "#F5A7E8", rot: "rotate-3" },
              { name: "JORDAN", role: "Founder", icon: "🚀", bg: "#FF7A00", rot: "-rotate-3" },
              { name: "CASEY", role: "Creator", icon: "🎨", bg: "#FFE500", rot: "rotate-2" },
              { name: "MORGAN", role: "Designer", icon: "📐", bg: "#A855F7", rot: "-rotate-4" },
              { name: "RILEY", role: "General Public", icon: "👥", bg: "#10B981", rot: "rotate-3" },
            ].map((p, idx) => (
              <div
                key={idx}
                className="persona-card-3d p-5 rounded-3xl bg-[#1A1816] border border-[#F4F1EA]/15 space-y-3 hover:border-[#FF7A00] transition-all shadow-2xl group relative overflow-hidden transform-gpu will-change-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="text-3xl">{p.icon}</div>
                  <span
                    className={`floating-badge ${p.rot} text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md text-black border border-black`}
                    style={{ backgroundColor: p.bg }}
                  >
                    PERSONA
                  </span>
                </div>
                <div>
                  <div className="text-base font-bold font-mono text-[#F4F1EA] group-hover:text-[#FF7A00] transition-colors">
                    {p.name}
                  </div>
                  <div className="text-xs text-[#F4F1EA]/60 font-mono mt-0.5">
                    {p.role}
                  </div>
                </div>
                <div className="pt-2 border-t border-[#F4F1EA]/10 font-mono text-[10px] text-[#FF7A00]">
                  ▸ Retention: 89.4%
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-between z-10 pt-4 border-t border-[#F4F1EA]/10">
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF7A00]">
              <ShieldCheck className="w-4 h-4" />
              <span>SYNTHETIC BEHAVIORAL RESONANCE COMPLETE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
