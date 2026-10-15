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

        <div className="relative z-10 max-w-7xl mx-auto space-y-12">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#00E83F] font-bold uppercase tracking-widest">
              06 // LABORATORY EVALUATION BENCHMARK
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#F4F1EA]">
              Four Models. One Prediction.
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { model: "XGBoost Regressor", r2: "0.912", mae: "3.42", selected: true },
              { model: "Random Forest", r2: "0.845", mae: "4.88", selected: false },
              { model: "MLP Neural Network", r2: "0.810", mae: "5.12", selected: false },
              { model: "Linear Regression", r2: "0.624", mae: "7.94", selected: false },
            ].map((m, idx) => (
              <div key={idx} className="space-y-2 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#F4F1EA]">{m.model}</span>
                    {m.selected && (
                      <span className="px-2 py-0.5 rounded bg-[#00E83F]/20 text-[#00E83F] border border-[#00E83F]/40 text-[9px] font-bold">
                        SELECTED PRODUCTION MODEL
                      </span>
                    )}
                  </div>
                  <span className={m.selected ? "text-[#00E83F] font-black text-sm" : "text-[#F4F1EA]/60 text-xs"}>
                    R² = {m.r2} (MAE: {m.mae})
                  </span>
                </div>

                <div className="w-full bg-[#141412] h-4 rounded-full overflow-hidden border border-[#F4F1EA]/15 p-0.5">
                  <div
                    className={`ml-model-bar h-full rounded-full origin-left transition-all ${
                      m.selected ? "bg-gradient-to-r from-[#00E83F] to-[#F5A7E8]" : "bg-[#F4F1EA]/30"
                    }`}
                    style={{ width: `${parseFloat(m.r2) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07 SHAP EXPLAINABILITY FORCE VECTORS SECTION WITH WOVEN CANVAS BG ─────── */}
      <section id="explainability" ref={shapRef} className="relative py-28 px-6 md:px-12 border-t border-black/15 canvas-woven-bg overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto space-y-10">
          {/* Editorial Poster Header (Image 3 Style: Towering Ultra-Condensed Typography) */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/[0.06] border border-black/10 text-xs font-mono font-bold tracking-widest text-[#008A20] uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008A20] animate-pulse" />
              07 // EXPLAINABLE AI ATTRIBUTION
            </div>
            <h2 className="font-poster text-5xl sm:text-7xl lg:text-8xl text-[#0D0D12] tracking-tight leading-[0.88] uppercase">
              Don't Just Get The Score. <br />
              <span className="text-[#008A20]">Understand It.</span>
            </h2>
            <p className="text-xs md:text-sm font-mono text-[#2C2C34]/80 tracking-wide leading-relaxed">
              TreeSHAP neural attribution decomposes every millisecond of footage into 32 marginal retention vectors.
            </p>
          </div>

          {/* Bespoke Real Glass Refractive Telemetry Console */}
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={28}
            distortionScale={-150}
            redOffset={0}
            greenOffset={10}
            blueOffset={20}
            blur={12}
            displace={0.4}
            backgroundOpacity={0.14}
            saturation={1.25}
            className="chromatic-rim relative shadow-[0_30px_80px_-15px_rgba(0,0,0,0.65)]"
          >
            <div className="relative p-6 md:p-8 text-[#F4F1EA] w-full space-y-6">
              {/* Precision Laser Crosshairs at Corners */}
              <div className="absolute top-3 left-3 text-white/30 font-mono text-xs select-none pointer-events-none">+</div>
              <div className="absolute top-3 right-3 text-white/30 font-mono text-xs select-none pointer-events-none">+</div>
              <div className="absolute bottom-3 left-3 text-white/30 font-mono text-xs select-none pointer-events-none">+</div>
              <div className="absolute bottom-3 right-3 text-white/30 font-mono text-xs select-none pointer-events-none">+</div>

              {/* Console Header Bar */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/10 gap-4">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E83F] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00E83F]"></span>
                  </span>
                  <div>
                    <div className="text-xs font-mono font-bold tracking-widest text-white uppercase flex items-center gap-2">
                      <span>SHAP FORCE VECTOR BALANCER</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">LIVE</span>
                    </div>
                    <div className="text-[10px] font-mono text-[#00E83F] tracking-wider opacity-85">
                      MODEL: XGBOOST REGRESSOR • 32 COGNITIVE SIGNALS
                    </div>
                  </div>
                </div>

                {/* Condensed Poster Score Readout */}
                <div className="flex items-center gap-3 bg-white/[0.04] border border-white/15 px-4 py-2 rounded-2xl backdrop-blur-md">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                    TOTAL SCORE:
                  </span>
                  <span className="font-poster text-3xl md:text-4xl text-white tracking-tight leading-none">
                    91.2
                  </span>
                  <span className="text-xs font-mono font-bold text-[#00E83F]">/ 100</span>
                </div>
              </div>

              {/* Precision Telemetry Vector Channels */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {/* Channel 1 */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00E83F]/50 transition-all space-y-2.5 group">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-semibold text-white/90 flex items-center gap-1.5">
                      <span className="text-[#00E83F] font-bold">+</span> 0-3s Hook Power & Text Overlay
                    </span>
                    <span className="font-mono font-bold text-[#00E83F] px-2 py-0.5 rounded bg-[#00E83F]/15 border border-[#00E83F]/30 text-[11px] shadow-[0_0_10px_rgba(0,232,63,0.2)]">
                      +18.4 pts
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden p-[1px]">
                    <div className="bg-gradient-to-r from-[#00E83F] to-[#00FF88] h-full rounded-full w-[88%] shadow-[0_0_10px_rgba(0,232,63,0.8)]" />
                  </div>
                  <div className="text-[10px] font-mono text-white/50 flex justify-between">
                    <span>MOTION INDEX: 0.88</span>
                    <span>SYNC: &lt;120ms</span>
                  </div>
                </div>

                {/* Channel 2 */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00E83F]/50 transition-all space-y-2.5 group">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-semibold text-white/90 flex items-center gap-1.5">
                      <span className="text-[#00E83F] font-bold">+</span> Optical Motion Vectors & Scene Cut Speed
                    </span>
                    <span className="font-mono font-bold text-[#00E83F] px-2 py-0.5 rounded bg-[#00E83F]/15 border border-[#00E83F]/30 text-[11px] shadow-[0_0_10px_rgba(0,232,63,0.2)]">
                      +12.6 pts
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden p-[1px]">
                    <div className="bg-gradient-to-r from-[#00E83F] to-[#00FF88] h-full rounded-full w-[65%] shadow-[0_0_10px_rgba(0,232,63,0.8)]" />
                  </div>
                  <div className="text-[10px] font-mono text-white/50 flex justify-between">
                    <span>CADENCE: 1.8s AVG</span>
                    <span>ABANDONMENT: MINIMAL</span>
                  </div>
                </div>

                {/* Channel 3 */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-rose-400/50 transition-all space-y-2.5 group">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-semibold text-white/90 flex items-center gap-1.5">
                      <span className="text-rose-400 font-bold">-</span> Prolonged Speech Silence Gap
                    </span>
                    <span className="font-mono font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-[11px] shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                      -7.2 pts
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden p-[1px]">
                    <div className="bg-gradient-to-r from-rose-500 to-rose-400 h-full rounded-full w-[38%] shadow-[0_0_10px_rgba(244,63,94,0.7)]" />
                  </div>
                  <div className="text-[10px] font-mono text-white/50 flex justify-between">
                    <span>SILENCE: 1.2s AT 0:14</span>
                    <span>DROP-OFF RISK: HIGH</span>
                  </div>
                </div>

                {/* Channel 4 */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-400/50 transition-all space-y-2.5 group">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-semibold text-white/90 flex items-center gap-1.5">
                      <span className="text-amber-400 font-bold">+</span> Semantic Climax & Narrative Peak
                    </span>
                    <span className="font-mono font-black text-amber-400 px-2 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-[11px] shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                      +7.4 pts
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden p-[1px]">
                    <div className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full w-[72%] shadow-[0_0_10px_rgba(251,191,36,0.7)]" />
                  </div>
                  <div className="text-[10px] font-mono text-white/50 flex justify-between">
                    <span>POLARITY SPIKE: 0:28</span>
                    <span>COMMENT VELOCITY: HIGH</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassSurface>
        </div>
      </section>

      {/* ── 09 LIVE PREDICTION INTERACTIVE UPLOAD EXPERIENCE ────────────── */}
      <section className="py-28 px-6 md:px-12 border-t border-black/15 canvas-woven-bg">
        <div className="max-w-4xl mx-auto space-y-10 text-center">
          {/* Editorial Poster Header (Image 3 Style: Towering Ultra-Condensed Typography) */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/[0.06] border border-black/10 text-xs font-mono font-bold tracking-widest text-[#008A20] uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008A20] animate-ping" />
              LIVE PREDICTION INTERFACE
            </div>
            <h2 className="font-poster text-5xl sm:text-7xl lg:text-8xl text-[#0D0D12] tracking-tight leading-[0.88] uppercase">
              Test Your Next Video Now
            </h2>
            <p className="text-xs md:text-sm font-mono text-[#2C2C34]/80 tracking-wide max-w-xl mx-auto leading-relaxed">
              Drop your video file to extract 32 signals and run the 100-agent audience simulation live.
            </p>
          </div>

          {/* Bespoke Interactive Real Glass Dropzone Card */}
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={28}
            distortionScale={-150}
            redOffset={0}
            greenOffset={10}
            blueOffset={20}
            blur={12}
            displace={0.4}
            backgroundOpacity={0.14}
            saturation={1.25}
            className="chromatic-rim relative shadow-[0_30px_80px_-15px_rgba(0,0,0,0.65)]"
          >
            <div className="relative p-6 md:p-10 text-[#F4F1EA] w-full space-y-6">
              {/* Precision Corner Alignment Brackets */}
              <div className="absolute top-3 left-3 text-white/30 font-mono text-xs select-none pointer-events-none">+</div>
              <div className="absolute top-3 right-3 text-white/30 font-mono text-xs select-none pointer-events-none">+</div>
              <div className="absolute bottom-3 left-3 text-white/30 font-mono text-xs select-none pointer-events-none">+</div>
              <div className="absolute bottom-3 right-3 text-white/30 font-mono text-xs select-none pointer-events-none">+</div>

              {/* Animated Laser Scanline at Top */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00E83F] to-transparent animate-pulse" />

              {/* Dropzone Inner Target Box */}
              <div
                onClick={onLaunchApp}
                className="group relative cursor-pointer p-6 md:p-8 rounded-2xl border border-dashed border-white/20 hover:border-[#00E83F]/80 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 space-y-3"
              >
                {/* Prismatic Radar Beacon */}
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.05] border border-white/20 flex items-center justify-center text-[#00E83F] group-hover:scale-110 group-hover:border-[#00E83F]/80 group-hover:shadow-[0_0_25px_rgba(0,232,63,0.5)] transition-all duration-300">
                  <Zap className="w-6 h-6 transition-transform group-hover:-translate-y-0.5 fill-current" />
                </div>

                <div className="space-y-1">
                  <div className="font-condensed-slab text-xl md:text-2xl text-white group-hover:text-[#00E83F] transition-colors tracking-wide">
                    DROP VIDEO FOOTAGE OR BROWSE
                  </div>
                  <div className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
                    MP4 • MOV • WEBM UP TO 500MB • 32 SENSORS EXTRACTED LIVE
                  </div>
                </div>
              </div>

              {/* Quick Benchmark Preset Tags */}
              <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-mono">
                <span className="text-white/40 uppercase tracking-widest text-[10px]">Or test benchmark:</span>
                {[
                  { name: "⚡ 0:15 TikTok Hook" },
                  { name: "📈 0:45 YT Shorts" },
                  { name: "🎬 1:00 Brand Reel" },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={onLaunchApp}
                    className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00E83F]/60 text-white/80 hover:text-white transition-all cursor-pointer text-[11px]"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Unique Aesthetic Fluid-Glass Tactile Button */}
              <div className="relative z-10 pt-2 flex justify-center">
                <button
                  onClick={onLaunchApp}
                  className="fluid-glass-button group cursor-pointer"
                >
                  {/* Diagonal Specular Light Glint Sweep */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transform duration-700 ease-in-out" />

                  <span className="w-7 h-7 rounded-full bg-[#00E83F]/20 border border-[#00E83F]/60 flex items-center justify-center text-[#00E83F] shadow-[0_0_15px_rgba(0,232,63,0.5)] group-hover:scale-110 transition-transform">
                    <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
                  </span>

                  <span className="font-condensed-slab text-base md:text-lg tracking-wider text-white drop-shadow-md">
                    LAUNCH VIRALITY ENGINE
                  </span>

                  <span className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 group-hover:bg-[#00E83F] group-hover:text-black group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </div>
            </div>
          </GlassSurface>
        </div>
      </section>

      {/* ── 10 FINAL EDITORIAL CTA & FOOTER ─────────────────────────────── */}
      <footer className="py-20 px-6 md:px-12 border-t border-black/15 canvas-woven-bg">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Real Glass Surface Footer Intelligence Console */}
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={28}
            distortionScale={-130}
            redOffset={0}
            greenOffset={8}
            blueOffset={16}
            blur={10}
            displace={0.4}
            backgroundOpacity={0.14}
            saturation={1.2}
            className="chromatic-rim relative shadow-[0_25px_70px_-15px_rgba(0,0,0,0.6)]"
          >
            <div className="p-8 md:p-12 space-y-12 w-full">
              <div className="space-y-4">
                <div className="text-xs font-mono text-[#00E83F] font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E83F] animate-pulse" />
                  VIRALYTIX INTELLIGENCE SYSTEM
                </div>
                <div className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter uppercase font-sans text-white">
                  <LayeredText text="SEE THE SIGNAL." topColor="#FFFFFF" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 text-xs font-mono text-[#F4F1EA]/70 gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#00E83F]" />
                  <span className="text-white/90">VIRALYTIX © 2026 • Built with ❤️ by Prabhu Shankar Mund (Raj)</span>
                </div>
                <div className="flex items-center gap-6">
                  <a href="#signals" className="hover:text-[#00E83F] transition-colors">Signals</a>
                  <a href="#swarm" className="hover:text-[#00E83F] transition-colors">Swarm</a>
                  <a href="#models" className="hover:text-[#00E83F] transition-colors">XGBoost</a>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#00E83F] transition-colors">GitHub</a>
                </div>
              </div>
            </div>
          </GlassSurface>
        </div>
      </footer>
    </div>
  );
};
