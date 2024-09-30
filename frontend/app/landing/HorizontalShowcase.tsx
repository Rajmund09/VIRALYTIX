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

export const HorizontalShowcase: React.FC<HorizontalShowcaseProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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
        gsap.to(track, {
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

        // Micro-animations for badge floating tilt effects
        const badges = track.querySelectorAll(".floating-badge");
        badges.forEach((badge, idx) => {
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
      className="relative w-full h-screen bg-[#0A0A09] text-[#F4F1EA] overflow-hidden border-t border-[#F4F1EA]/10 font-sans"
    >
      {/* Scroll Track */}
      <div
        ref={trackRef}
        className="flex h-full w-[300vw] will-change-transform"
      >
        {/* ════════════════════════════════════════════════════════════════════
            PANEL 01: 03 // THREE INDEPENDENT SIGNAL STREAMS
           ════════════════════════════════════════════════════════════════════ */}
        <div className="w-[100vw] h-full flex-shrink-0 p-8 sm:p-12 md:p-16 flex flex-col justify-between border-r border-[#F4F1EA]/10 bg-gradient-to-b from-[#0A0A09] via-[#0E0E0C] to-[#141412] relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00E83F]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Panel Header & Giant Title with GSAP Tilted Badge Pills */}
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
              MULTIMODAL FEATURE{" "}
              <span className="floating-badge inline-block px-4 py-1 sm:px-6 sm:py-2 rounded-2xl bg-[#00E83F] text-black font-extrabold text-3xl sm:text-5xl lg:text-6xl -rotate-3 shadow-2xl shadow-[#00E83F]/30 border-2 border-black">
                EXTRACTOR
              </span>
            </h2>

            <p className="text-sm sm:text-base font-mono text-[#F4F1EA]/70 max-w-2xl leading-relaxed">
              Extracted frame-by-frame using FFmpeg, OpenCV optical flow, and Wav2Vec acoustic frequency mapping.
            </p>
          </div>

          {/* 3 Signal Stream Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto z-10">
            {/* Stream 01: Visual Signals */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#181816]/90 border border-[#00E83F]/30 space-y-5 hover:border-[#00E83F] transition-all shadow-xl hover:shadow-[#00E83F]/10 group relative">
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
            <div className="p-6 sm:p-8 rounded-3xl bg-[#181816]/90 border border-[#F5A7E8]/30 space-y-5 hover:border-[#F5A7E8] transition-all shadow-xl hover:shadow-[#F5A7E8]/10 group relative">
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
            <div className="p-6 sm:p-8 rounded-3xl bg-[#181816]/90 border border-[#FF7A00]/30 space-y-5 hover:border-[#FF7A00] transition-all shadow-xl hover:shadow-[#FF7A00]/10 group relative">
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
            <span>SCROLL DOWN TO EXPLORE TOPOLOGY</span>
            <ArrowRight className="w-4 h-4 text-[#00E83F]" />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            PANEL 02: 04 // VECTOR CLUSTER TOPOLOGY
           ════════════════════════════════════════════════════════════════════ */}
        <div className="w-[100vw] h-full flex-shrink-0 p-8 sm:p-12 md:p-16 flex flex-col justify-between border-r border-[#F4F1EA]/10 bg-gradient-to-b from-[#0A0A09] via-[#101018] to-[#161420] relative overflow-hidden">
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
              32-DIMENSIONAL{" "}
              <span className="floating-badge inline-block px-4 py-1 sm:px-6 sm:py-2 rounded-2xl bg-[#F5A7E8] text-black font-extrabold text-3xl sm:text-5xl lg:text-6xl rotate-3 shadow-2xl shadow-[#F5A7E8]/30 border-2 border-black">
                FEATURE SPACE
              </span>
            </h2>
          </div>

          {/* Floating GSAP Badge Stickers Grid (Inspired by photos) */}
          <div className="my-auto z-10 max-w-5xl space-y-8">
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
                  className={`floating-badge ${item.rot} p-4 rounded-2xl font-mono font-extrabold text-xs text-center border-2 border-black shadow-2xl transition-transform hover:scale-110 cursor-pointer`}
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
            <span>SCROLL DOWN TO BEHAVIORAL SIMULATION</span>
            <ArrowRight className="w-4 h-4 text-[#F5A7E8]" />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            PANEL 03: 05 // AUDIENCE BEHAVIORAL SIMULATION
           ════════════════════════════════════════════════════════════════════ */}
        <div className="w-[100vw] h-full flex-shrink-0 p-8 sm:p-12 md:p-16 flex flex-col justify-between bg-gradient-to-b from-[#0A0A09] via-[#120E0A] to-[#1A140E] relative overflow-hidden">
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
              THE AUDIENCE ISN'T{" "}
              <span className="floating-badge inline-block px-4 py-1 sm:px-6 sm:py-2 rounded-2xl bg-[#FF7A00] text-black font-extrabold text-3xl sm:text-5xl lg:text-6xl -rotate-3 shadow-2xl shadow-[#FF7A00]/30 border-2 border-black">
                ONE PERSON.
              </span>
            </h2>

            <p className="text-sm sm:text-base font-mono text-[#F4F1EA]/70 max-w-2xl leading-relaxed">
              100 AI agents grouped into 6 distinct viewer personas simulate watch time, skip triggers, likes, comments, and shares.
            </p>
          </div>

          {/* 6 Viewer Persona Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-auto z-10">
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
                className="p-5 rounded-3xl bg-[#1A1816] border border-[#F4F1EA]/15 space-y-3 hover:border-[#FF7A00] transition-all shadow-xl group relative overflow-hidden"
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
