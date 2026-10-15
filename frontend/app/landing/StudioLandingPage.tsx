"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  BarChart3,
  Users,
  Shield,
  FileVideo,
  Play,
  Sparkles,
  Sliders,
  CheckCircle2,
  Lock,
  Globe,
  Radio,
  ChevronRight,
  Terminal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LayeredText } from "./LayeredText";
import { Hero } from "./hero/Hero";
import { HorizontalShowcase } from "./HorizontalShowcase";
import { GlassTiles } from "@/components/ui/glass-tiles";
import { Beams } from "@/components/ui/beams";
import { GlassSurface } from "@/components/ui/glass-surface";

interface StudioLandingPageProps {
  onLaunchApp: () => void;
}

export const StudioLandingPage: React.FC<StudioLandingPageProps> = ({ onLaunchApp }) => {

  // References for GSAP ScrollTrigger Animations
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const kineticTextRef = useRef<HTMLDivElement>(null);
  const multimodalRef = useRef<HTMLDivElement>(null);
  const personaRef = useRef<HTMLDivElement>(null);
  const mlRef = useRef<HTMLDivElement>(null);
  const shapRef = useRef<HTMLDivElement>(null);
  const abRef = useRef<HTMLDivElement>(null);

  // ScrambleText / Computation status state
  const [computeStatus, setComputeStatus] = useState("SYSTEM READY // IDLE");

  // GSAP Animations setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // Hero Title Character/Word Reveal
      if (heroTitleRef.current) {
        gsap.fromTo(
          heroTitleRef.current.children,
          { y: 60, opacity: 0, rotationX: -15 },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 1.1,
            stagger: 0.15,
            ease: "power4.out",
          }
        );
      }

      // Kinetic Typography Scroll Split
      if (kineticTextRef.current) {
        const words = kineticTextRef.current.querySelectorAll(".kinetic-word");
        gsap.fromTo(
          words,
          { x: (i) => (i % 2 === 0 ? -80 : 80), opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: kineticTextRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Multimodal Streams Entrance
      if (multimodalRef.current) {
        const streams = multimodalRef.current.querySelectorAll(".signal-stream-card");
        gsap.fromTo(
          streams,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: multimodalRef.current,
              start: "top 75%",
            },
          }
        );
      }

      // ML Model Comparison Line Progress & Section 06 Beams Background Appearance
      if (mlRef.current) {
        const beamsBg = mlRef.current.querySelector(".beams-bg-wrapper");
        if (beamsBg) {
          gsap.fromTo(
            beamsBg,
            { opacity: 0, scale: 1.08, filter: "brightness(0.15) contrast(1.5)" },
            {
              opacity: 1,
              scale: 1,
              filter: "brightness(1) contrast(1)",
              duration: 1.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: mlRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        const bars = mlRef.current.querySelectorAll(".ml-model-bar");
        gsap.fromTo(
          bars,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: mlRef.current,
              start: "top 75%",
            },
          }
        );
      }
    }
  }, []);

  return (
    <div className="bg-[#0A0A09] text-[#F4F1EA] min-h-screen relative overflow-x-hidden font-sans selection:bg-[#00E83F] selection:text-[#0A0A09]">
      {/* ── 02 MASTER GSAP HERO EXPERIENCE (Modular Architecture) ────────────────── */}
      <Hero onLaunchApp={onLaunchApp} />

      {/* ── 02 KINETIC TYPOGRAPHY DISPLACEMENT SECTION WITH GLASS TILES ─── */}
      <section ref={kineticTextRef} className="relative py-28 px-6 md:px-12 border-t border-[#F4F1EA]/10 bg-black overflow-hidden">
        {/* Shimmering Glass Tiles Background */}
        <div className="absolute inset-0 pointer-events-none z-0 w-full h-full">
          <GlassTiles
            className="w-full h-full"
            speed={1.0}
            opacity={1.0}
            chromaticSpread={0.0}
            tileDensity={4.0}
            rippleLayers={6}
            warpStrength={0.33}
            bandSharpness={3.0}
            colorA="#1E00FF"
            colorB="#D765E6"
            backgroundColor="#000000"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          <div className="text-xs font-mono text-[#F5A7E8] font-bold uppercase tracking-widest">
            02 // SIGNAL DECOMPOSITION
          </div>

          <div className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4F1EA] space-y-2 uppercase leading-none">
            <div className="kinetic-word drop-shadow-md">YOUR VIDEO IS</div>
            <div className="kinetic-word text-[#00E83F] italic drop-shadow-md">MORE THAN FRAMES.</div>
            <div className="kinetic-word text-4xl sm:text-6xl lg:text-7xl font-mono text-[#F5A7E8] drop-shadow-lg">
              A VIDEO IS 32 SIGNALS DISGUISED AS ONE.
            </div>
          </div>
        </div>
      </section>

      {/* ── 03, 04 & 05 GSAP SIDEWAYS HORIZONTAL SCROLL SHOWCASE ────────── */}
      <HorizontalShowcase />

      {/* ── 06 MACHINE LEARNING MODEL RACE SECTION WITH BEAMS ─────────── */}
      <section id="models" ref={mlRef} className="relative py-28 px-6 md:px-12 border-t border-[#F4F1EA]/10 bg-black overflow-hidden">
        {/* Shimmering Metallic Beams Canvas Background with Cinematic Appearing Entrance */}
        <div className="beams-bg-wrapper absolute inset-0 pointer-events-none z-0 w-full h-full will-change-transform">
          <Beams
            className="w-full h-full"
            color="#ffffff"
            backgroundColor="#000000"
            beamWidth={140}
            rotation={28}
            waveLength={337}
            depth={1}
            sharpness={0.6}
            twist={0}
            fillLight={0.3}
            speed={1}
            brightness={1.6}
            glow={0.6}
            grain={0.35}
            variation={0}
            mouseStrength={1}
            fade={0.2}
            opacity={1}
            mouseInteraction={false}
            intro={true}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#00E83F]/10 border-l-2 border-[#00E83F] text-xs font-mono font-bold tracking-widest text-[#00E83F] uppercase">
              <span className="w-1.5 h-1.5 bg-[#00E83F] animate-pulse" />
              06 // LABORATORY EVALUATION BENCHMARK • SERIES 03
            </div>
            <h2 className="font-poster text-5xl sm:text-7xl lg:text-8xl text-[#F4F1EA] tracking-tight leading-[0.88] uppercase">
              Four Models. <br />
              <span className="text-[#00E83F]">One Prediction.</span>
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[#F4F1EA]/60 tracking-wider max-w-xl">
              Benchmarked across 100,000+ short-form videos with 32 cognitive and acoustic sensors.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { id: "01", model: "XGBoost Regressor", r2: "0.912", mae: "3.42", selected: true, latency: "1.2ms" },
              { id: "02", model: "Random Forest", r2: "0.845", mae: "4.88", selected: false, latency: "8.4ms" },
              { id: "03", model: "MLP Neural Network", r2: "0.810", mae: "5.12", selected: false, latency: "14.1ms" },
              { id: "04", model: "Linear Regression", r2: "0.624", mae: "7.94", selected: false, latency: "0.3ms" },
            ].map((m) => (
              <div
                key={m.id}
                className={`p-4 md:p-5 transition-all duration-300 rounded-none border ${
                  m.selected
                    ? "bg-[#0A0D14]/90 border-l-4 border-l-[#00E83F] border-t-white/15 border-r-white/15 border-b-white/15 shadow-[0_10px_30px_rgba(0,232,63,0.12)]"
                    : "bg-[#07090E]/60 border-l-2 border-l-white/20 border-t-white/10 border-r-white/10 border-b-white/10 hover:border-l-[#38BDF8]"
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-bold text-white/40 tracking-wider">[{m.id}]</span>
                    <span className="font-condensed-slab text-xl md:text-2xl text-[#F4F1EA] tracking-wide uppercase">
                      {m.model}
                    </span>
                    {m.selected && (
                      <span className="px-2.5 py-0.5 rounded-none bg-[#00E83F]/15 border border-[#00E83F]/50 text-[#00E83F] font-mono text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,232,63,0.3)]">
                        <span className="w-1.5 h-1.5 bg-[#00E83F] animate-ping" />
                        SELECTED PRODUCTION MODEL
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 font-mono text-xs">
                    <span className="text-white/40 text-[11px] hidden md:inline">
                      LATENCY: <span className="text-white/80 font-bold">{m.latency}</span>
                    </span>
                    <span className="text-white/40 text-[11px]">
                      MAE: <span className="text-white/80 font-bold">{m.mae}</span>
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-white/40 text-[10px] uppercase tracking-wider">R² ACCURACY:</span>
                      <span className={`text-base font-bold font-mono tracking-tight ${m.selected ? "text-[#00E83F]" : "text-white/80"}`}>
                        {m.r2}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Precision Architectural Rectangular Bar Track */}
                <div className="relative w-full h-5 bg-[#030508] border border-white/15 rounded-none overflow-hidden p-0.5">
                  {/* Laboratory Ruler Tick Grid */}
                  <div className="absolute inset-0 flex justify-between pointer-events-none px-2 z-10">
                    <div className="w-[1px] h-full bg-white/10" style={{ marginLeft: "25%" }} />
                    <div className="w-[1px] h-full bg-white/10" style={{ marginLeft: "25%" }} />
                    <div className="w-[1px] h-full bg-white/10" style={{ marginLeft: "25%" }} />
                  </div>

                  {/* Architectural Rectangular Fill with Angled Slant on Single Leading Edge */}
                  <div
                    className={`ml-model-bar h-full rounded-none origin-left transition-all duration-700 relative ${
                      m.selected
                        ? "bg-gradient-to-r from-[#00A82F] via-[#00E83F] to-[#38BDF8]"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                    style={{
                      width: `${parseFloat(m.r2) * 100}%`,
                      clipPath: "polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)",
                    }}
                  >
                    {/* Laser Tip Highlight on Leading Edge */}
                    {m.selected && (
                      <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-white shadow-[0_0_12px_#00E83F]" />
                    )}
                  </div>
                </div>

                {/* Metric Ruler Scale Labels */}
                <div className="flex justify-between text-[9px] font-mono text-white/30 pt-1.5 uppercase tracking-widest">
                  <span>0.0 BASELINE</span>
                  <span>0.25</span>
                  <span>0.50</span>
                  <span>0.75</span>
                  <span className={m.selected ? "text-[#00E83F] font-bold" : ""}>1.0 PERFECT CORRELATION</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07 SHAP EXPLAINABILITY FORCE VECTORS SECTION WITH STUDIO GLASS THEME ─────── */}
      <section id="explainability" ref={shapRef} className="relative py-28 px-6 md:px-12 border-t border-[#CBD4E2] studio-glass-bg overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto space-y-10">
          {/* Editorial Poster Header (Image 3 Poster Aesthetic: Cool Periwinkle Studio & Towering Black Typography) */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-xs font-mono font-bold tracking-widest text-[#008A20] uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008A20] animate-pulse" />
              07 // 3D GLASS ATTRIBUTION • SERIES 03
            </div>
            <h2 className="font-poster text-5xl sm:text-7xl lg:text-8xl text-[#0B0D12] tracking-tight leading-[0.88] uppercase">
              Don't Just Get The Score. <br />
              <span className="text-[#008A20]">Understand It.</span>
            </h2>
            <p className="text-xs md:text-sm font-mono text-[#2C3342] tracking-wide leading-relaxed max-w-2xl">
              TreeSHAP neural attribution decomposes every millisecond of footage into 32 marginal retention vectors through optical glass dispersion.
            </p>
          </div>

          {/* Bespoke 3D Optical Glass Slab Console (Image 3 Reference Style) */}
          <div className="poster-glass-card poster-chromatic-rim relative rounded-3xl p-6 md:p-10 overflow-hidden space-y-6">
            {/* Diagonal Specular Cylinder Highlight */}
            <div className="poster-glass-sheen" />

            {/* Precision Laser Crosshairs at Corners */}
            <div className="absolute top-3 left-3 text-[#0B0D12]/30 font-mono text-xs select-none pointer-events-none">+</div>
            <div className="absolute top-3 right-3 text-[#0B0D12]/30 font-mono text-xs select-none pointer-events-none">+</div>
            <div className="absolute bottom-3 left-3 text-[#0B0D12]/30 font-mono text-xs select-none pointer-events-none">+</div>
            <div className="absolute bottom-3 right-3 text-[#0B0D12]/30 font-mono text-xs select-none pointer-events-none">+</div>

            {/* Console Header Bar */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#0B0D12]/10 gap-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008A20] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#008A20]"></span>
                </span>
                <div>
                  <div className="text-xs font-mono font-bold tracking-widest text-[#0B0D12] uppercase flex items-center gap-2">
                    <span>SHAP FORCE VECTOR BALANCER</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0B0D12]/10 text-[#0B0D12] font-semibold">LIVE</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#008A20] font-semibold tracking-wider">
                    MODEL: XGBOOST REGRESSOR • 32 COGNITIVE SIGNALS
                  </div>
                </div>
              </div>

              {/* Condensed Poster Score Readout */}
              <div className="flex items-center gap-3 bg-white/70 border border-white/90 px-4 py-2 rounded-2xl shadow-sm backdrop-blur-md">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#0B0D12]/60 font-semibold">
                  TOTAL SCORE:
                </span>
                <span className="font-poster text-3xl md:text-4xl text-[#0B0D12] tracking-tight leading-none">
                  91.2
                </span>
                <span className="text-xs font-mono font-bold text-[#008A20]">/ 100</span>
              </div>
            </div>

            {/* Precision Telemetry Vector Channels (Frosted Glass Modules) */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {/* Channel 1 */}
              <div className="p-4 rounded-xl bg-white/65 hover:bg-white/90 border border-white/80 shadow-[0_4px_16px_rgba(20,30,50,0.06)] transition-all space-y-2.5 group">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-semibold text-[#0B0D12] flex items-center gap-1.5">
                    <span className="text-[#008A20] font-bold">+</span> 0-3s Hook Power & Text Overlay
                  </span>
                  <span className="font-mono font-bold text-[#008A20] px-2 py-0.5 rounded bg-[#008A20]/10 border border-[#008A20]/25 text-[11px]">
                    +18.4 pts
                  </span>
                </div>
                <div className="w-full bg-[#0B0D12]/10 h-1.5 rounded-full overflow-hidden p-[1px]">
                  <div className="bg-gradient-to-r from-[#00A82F] to-[#00E83F] h-full rounded-full w-[88%] shadow-sm" />
                </div>
                <div className="text-[10px] font-mono text-[#0B0D12]/60 flex justify-between">
                  <span>MOTION INDEX: 0.88</span>
                  <span>SYNC: &lt;120ms</span>
                </div>
              </div>

              {/* Channel 2 */}
              <div className="p-4 rounded-xl bg-white/65 hover:bg-white/90 border border-white/80 shadow-[0_4px_16px_rgba(20,30,50,0.06)] transition-all space-y-2.5 group">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-semibold text-[#0B0D12] flex items-center gap-1.5">
                    <span className="text-[#0066FF] font-bold">+</span> Optical Motion Vectors & Scene Cut Speed
                  </span>
                  <span className="font-mono font-bold text-[#0066FF] px-2 py-0.5 rounded bg-[#0066FF]/10 border border-[#0066FF]/25 text-[11px]">
                    +12.6 pts
                  </span>
                </div>
                <div className="w-full bg-[#0B0D12]/10 h-1.5 rounded-full overflow-hidden p-[1px]">
                  <div className="bg-gradient-to-r from-[#0066FF] to-[#38BDF8] h-full rounded-full w-[65%] shadow-sm" />
                </div>
                <div className="text-[10px] font-mono text-[#0B0D12]/60 flex justify-between">
                  <span>CADENCE: 1.8s AVG</span>
                  <span>ABANDONMENT: MINIMAL</span>
                </div>
              </div>

              {/* Channel 3 */}
              <div className="p-4 rounded-xl bg-white/65 hover:bg-white/90 border border-white/80 shadow-[0_4px_16px_rgba(20,30,50,0.06)] transition-all space-y-2.5 group">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-semibold text-[#0B0D12] flex items-center gap-1.5">
                    <span className="text-[#E11D48] font-bold">-</span> Prolonged Speech Silence Gap
                  </span>
                  <span className="font-mono font-bold text-[#E11D48] px-2 py-0.5 rounded bg-[#E11D48]/10 border border-[#E11D48]/25 text-[11px]">
                    -7.2 pts
                  </span>
                </div>
                <div className="w-full bg-[#0B0D12]/10 h-1.5 rounded-full overflow-hidden p-[1px]">
                  <div className="bg-gradient-to-r from-[#E11D48] to-[#FB7185] h-full rounded-full w-[38%] shadow-sm" />
                </div>
                <div className="text-[10px] font-mono text-[#0B0D12]/60 flex justify-between">
                  <span>SILENCE: 1.2s AT 0:14</span>
                  <span>DROP-OFF RISK: HIGH</span>
                </div>
              </div>

              {/* Channel 4 */}
              <div className="p-4 rounded-xl bg-white/65 hover:bg-white/90 border border-white/80 shadow-[0_4px_16px_rgba(20,30,50,0.06)] transition-all space-y-2.5 group">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-semibold text-[#0B0D12] flex items-center gap-1.5">
                    <span className="text-[#D97706] font-bold">+</span> Semantic Climax & Narrative Peak
                  </span>
                  <span className="font-mono font-bold text-[#D97706] px-2 py-0.5 rounded bg-[#D97706]/10 border border-[#D97706]/25 text-[11px]">
                    +7.4 pts
                  </span>
                </div>
                <div className="w-full bg-[#0B0D12]/10 h-1.5 rounded-full overflow-hidden p-[1px]">
                  <div className="bg-gradient-to-r from-[#D97706] to-[#FBBF24] h-full rounded-full w-[72%] shadow-sm" />
                </div>
                <div className="text-[10px] font-mono text-[#0B0D12]/60 flex justify-between">
                  <span>POLARITY SPIKE: 0:28</span>
                  <span>COMMENT VELOCITY: HIGH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 08 / 09 LIVE PREDICTION INTERACTIVE UPLOAD EXPERIENCE ────────────── */}
      <section className="py-28 px-6 md:px-12 border-t border-[#CBD4E2] studio-glass-bg">
        <div className="max-w-4xl mx-auto space-y-10 text-center">
          {/* Editorial Poster Header (Image 3 Poster Aesthetic) */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-xs font-mono font-bold tracking-widest text-[#008A20] uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008A20] animate-ping" />
              08 // LIVE PREDICTION STUDIO • SERIES 03
            </div>
            <h2 className="font-poster text-5xl sm:text-7xl lg:text-8xl text-[#0B0D12] tracking-tight leading-[0.88] uppercase">
              Test Your Next Video Now
            </h2>
            <p className="text-xs md:text-sm font-mono text-[#2C3342] tracking-wide max-w-xl mx-auto leading-relaxed">
              Drop your video file to extract 32 signals and run the 100-agent audience simulation live.
            </p>
          </div>

          {/* Direct Interactive Dropzone Area (Big outer card removed) */}
          <div className="space-y-6 max-w-2xl mx-auto">
            {/* Dropzone Target Box */}
            <div
              onClick={onLaunchApp}
              className="group relative cursor-pointer p-8 md:p-12 rounded-3xl border-2 border-dashed border-[#0B0D12]/20 hover:border-[#008A20] bg-white/60 hover:bg-white/90 backdrop-blur-md transition-all duration-300 space-y-4 shadow-[0_10px_30px_rgba(25,35,60,0.06)] hover:shadow-[0_20px_45px_rgba(0,138,32,0.15)] active:scale-[0.99]"
            >
              {/* Prismatic Radar Beacon */}
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-[#CBD4E2] flex items-center justify-center text-[#008A20] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(0,138,32,0.25)] transition-all duration-300">
                <Zap className="w-7 h-7 transition-transform group-hover:-translate-y-0.5 fill-current" />
              </div>

              <div className="space-y-1.5 text-center">
                <div className="font-condensed-slab text-2xl md:text-3xl text-[#0B0D12] group-hover:text-[#008A20] transition-colors tracking-wide">
                  DROP VIDEO FOOTAGE OR BROWSE
                </div>
                <div className="text-[11px] font-mono text-[#0B0D12]/60 tracking-widest uppercase font-semibold">
                  MP4 • MOV • WEBM UP TO 500MB • 32 SENSORS EXTRACTED LIVE
                </div>
              </div>
            </div>

            {/* Quick Benchmark Preset Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-mono">
              <span className="text-[#0B0D12]/60 uppercase tracking-widest text-[10px] font-bold">Or test benchmark:</span>
              {[
                { name: "⚡ 0:15 TikTok Hook" },
                { name: "📈 0:45 YT Shorts" },
                { name: "🎬 1:00 Brand Reel" },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={onLaunchApp}
                  className="px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white border border-white/90 hover:border-[#008A20]/60 text-[#0B0D12]/80 hover:text-[#0B0D12] transition-all cursor-pointer text-[11px] font-medium shadow-sm hover:shadow-md"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* High-End Tactile Obsidian Glass Cyber-Button */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={onLaunchApp}
                className="group relative cursor-pointer overflow-hidden rounded-full p-[2px] bg-gradient-to-r from-[#FF1E40] via-[#0070FF] to-[#00E83F] shadow-[0_12px_35px_rgba(0,112,255,0.25)] hover:shadow-[0_16px_45px_rgba(0,232,63,0.4)] transition-all duration-300 active:scale-[0.98]"
              >
                <div className="relative px-8 md:px-10 py-3.5 md:py-4 rounded-full bg-[#0A0C12] text-white flex items-center justify-center gap-3">
                  {/* Diagonal Specular Light Glint Sweep */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transform duration-700 ease-in-out" />

                  <span className="w-7 h-7 rounded-full bg-[#00E83F]/20 border border-[#00E83F]/60 flex items-center justify-center text-[#00E83F] shadow-[0_0_15px_rgba(0,232,63,0.5)] group-hover:scale-110 transition-transform">
                    <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
                  </span>

                  <span className="font-condensed-slab text-base md:text-lg tracking-wider text-white drop-shadow-md">
                    LAUNCH VIRALITY ENGINE
                  </span>

                  <span className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/90 group-hover:bg-[#00E83F] group-hover:text-black group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10 FINAL EDITORIAL CTA & FOOTER (STUDIO GLASS POSTER THEME) ─────── */}
      <footer className="py-20 px-6 md:px-12 border-t border-[#CBD4E2] studio-glass-bg">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Real Optical Glass Surface Footer Intelligence Console */}
          <div className="poster-glass-card poster-chromatic-rim relative rounded-3xl p-8 md:p-14 overflow-hidden space-y-10 shadow-[0_30px_85px_-15px_rgba(25,35,60,0.18)]">
            <div className="poster-glass-sheen" />

            <div className="relative z-10 space-y-4">
              <div className="text-xs font-mono text-[#008A20] font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#008A20] animate-pulse" />
                VIRALYTIX INTELLIGENCE SYSTEM • SERIES 03
              </div>
              <div className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter uppercase font-sans text-[#0B0D12]">
                <LayeredText text="SEE THE SIGNAL." topColor="#0B0D12" />
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between border-t border-[#0B0D12]/10 pt-8 text-xs font-mono text-[#0B0D12]/70 gap-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#008A20]" />
                <span className="text-[#0B0D12] font-semibold">VIRALYTIX © 2026 • Built with ❤️ by Prabhu Shankar Mund (Raj)</span>
              </div>
              <div className="flex items-center gap-6 font-medium">
                <a href="#signals" className="hover:text-[#008A20] transition-colors">Signals</a>
                <a href="#swarm" className="hover:text-[#008A20] transition-colors">Swarm</a>
                <a href="#models" className="hover:text-[#008A20] transition-colors">XGBoost</a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#008A20] transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
