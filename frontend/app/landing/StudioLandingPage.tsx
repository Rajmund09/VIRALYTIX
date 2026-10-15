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
  UploadCloud,
  Gauge,
  Cpu,
  AlertTriangle,
  TrendingDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LayeredText } from "./LayeredText";
import { Hero } from "./hero/Hero";
import { HorizontalShowcase } from "./HorizontalShowcase";
import { GlassTiles } from "@/components/ui/glass-tiles";
import { Beams } from "@/components/ui/beams";

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
  const [activeVectorTab, setActiveVectorTab] = useState<"all" | "positive" | "negative">("all");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

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
          {/* Editorial Header */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold tracking-widest text-[#00E83F] uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E83F] animate-pulse" />
              06 // SOTA ARCHITECTURAL BENCHMARK
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Four Architectures. <br />
              <span className="italic font-serif font-normal text-[#00E83F]">One Singular</span> Truth.
            </h2>
            <p className="text-sm md:text-base font-sans text-white/70 max-w-2xl leading-relaxed">
              Trained across 1,000,000 multimodal short-form videos with 32 synchronized sensory channels. Tree-based gradient boosting isolates non-linear retention dynamics with highest explained variance.
            </p>
          </div>

          {/* Bespoke Model Comparison Console */}
          <div className="space-y-6">
            {/* Featured SOTA Winner Card: XGBoost */}
            <div className="relative rounded-[32px] p-6 md:p-8 bg-gradient-to-b from-[#101416]/95 to-[#0A0D0E]/95 backdrop-blur-2xl border-2 border-[#00E83F]/50 shadow-[0_25px_60px_rgba(0,232,63,0.18)] overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E83F]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-[#00E83F]/20 text-[#00E83F] border border-[#00E83F]/50 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,232,63,0.4)]">
                      <Sparkles className="w-3 h-3 fill-current" />
                      RANK #1 • SOTA PRODUCTION STANDARD
                    </span>
                    <span className="text-[10px] font-mono text-white/40 tracking-wider">
                      LATENCY: 4.2ms / FRAME
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black font-sans text-white tracking-tight">
                    XGBoost Regressor <span className="text-[#00E83F] font-mono text-sm font-semibold">(v2.4 Tuned)</span>
                  </h3>
                  <p className="text-xs font-mono text-white/60 max-w-xl">
                    Gradient-boosted decision trees capture complex feature interactions between acoustic silence lags, hook velocity, and emotional valence curves.
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-black/40 border border-white/10 px-6 py-4 rounded-2xl">
                  <div className="space-y-0.5 text-right">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                      EXPLAINED VARIANCE
                    </div>
                    <div className="text-3xl md:text-4xl font-black font-mono text-[#00E83F] tracking-tight drop-shadow-[0_0_15px_rgba(0,232,63,0.5)]">
                      R² = 0.912
                    </div>
                    <div className="text-[11px] font-mono text-white/60">
                      MAE: 3.42 pts • 450 Trees
                    </div>
                  </div>
                </div>
              </div>

              {/* SOTA Energy Track with SVG Sparkline */}
              <div className="relative z-10 pt-6 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-white/60 uppercase tracking-widest text-[10px]">
                    PREDICTIVE CORRELATION ACCELERATION
                  </span>
                  <span className="text-[#00E83F] font-bold">91.2% CONVERGED</span>
                </div>
                <div className="w-full bg-white/5 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div className="ml-model-bar h-full rounded-full bg-gradient-to-r from-[#00E83F] via-[#00FF88] to-[#99FFCC] w-[91.2%] shadow-[0_0_20px_rgba(0,232,63,0.7)]" />
                </div>
              </div>
            </div>

            {/* 3 Challenger Architecture Pods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  rank: "#2 CHALLENGER",
                  model: "Random Forest",
                  type: "Bagged Ensemble",
                  r2: "0.845",
                  mae: "4.88",
                  delta: "-6.7 pts",
                  pct: "84.5%",
                  color: "from-blue-400 to-indigo-500",
                  tagColor: "text-blue-400 border-blue-400/30 bg-blue-400/10",
                },
                {
                  rank: "#3 DEEP LEARNING",
                  model: "MLP Neural Network",
                  type: "4-Layer Dense Perceptron",
                  r2: "0.810",
                  mae: "5.12",
                  delta: "-10.2 pts",
                  pct: "81.0%",
                  color: "from-purple-400 to-pink-500",
                  tagColor: "text-purple-400 border-purple-400/30 bg-purple-400/10",
                },
                {
                  rank: "#4 BASELINE",
                  model: "Linear Regression",
                  type: "Ordinary Least Squares",
                  r2: "0.624",
                  mae: "7.94",
                  delta: "-28.8 pts",
                  pct: "62.4%",
                  color: "from-zinc-400 to-zinc-500",
                  tagColor: "text-zinc-400 border-zinc-400/30 bg-zinc-400/10",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-white/20 transition-all space-y-4 group"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${item.tagColor}`}>
                      {item.rank}
                    </span>
                    <span className="text-[10px] font-mono text-rose-400/90 font-semibold">
                      {item.delta}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-white text-base group-hover:text-[#00E83F] transition-colors">
                      {item.model}
                    </div>
                    <div className="text-[10px] font-mono text-white/40">
                      {item.type}
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline font-mono pt-1">
                    <span className="text-xl font-bold text-white">
                      R² = {item.r2}
                    </span>
                    <span className="text-xs text-white/50">
                      MAE: {item.mae}
                    </span>
                  </div>

                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className={`ml-model-bar h-full rounded-full bg-gradient-to-r ${item.color}`}
                      style={{ width: item.pct }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 07 SHAP EXPLAINABILITY FORCE VECTORS SECTION WITH WOVEN CANVAS BG ─────── */}
      <section id="explainability" ref={shapRef} className="relative py-28 px-6 md:px-12 border-t border-black/15 canvas-woven-bg overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto space-y-12">
          {/* Editorial Header */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/[0.06] border border-black/10 text-xs font-mono font-bold tracking-widest text-[#008A20] uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008A20] animate-pulse" />
              07 // EXPLAINABLE AI ATTRIBUTION
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0D0D12] tracking-tight leading-[1.08]">
              Don't Just Get The Score. <br />
              <span className="italic font-serif font-normal text-[#008A20]">Deconstruct</span> The Hook.
            </h2>
            <p className="text-sm md:text-base font-sans text-[#2C2C34]/80 leading-relaxed">
              Our TreeSHAP attribution engine isolates each signal's exact marginal contribution in real-time, showing which elements drive audience retention and which trigger viewer drop-off.
            </p>
          </div>

          {/* Bespoke Obsidian Telemetry Console */}
          <div className="relative rounded-[36px] p-6 md:p-10 bg-[#0B0B10]/95 backdrop-blur-2xl text-[#F4F1EA] border border-white/12 shadow-[0_35px_90px_rgba(0,0,0,0.55)] overflow-hidden space-y-8">
            {/* Ambient Top Glow Line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-[#00E83F] to-transparent pointer-events-none" />

            {/* Console Header Bar with Interactive Tabs & Live Score Readout */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-white/10 gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00E83F] animate-ping" />
                  <div className="text-xs font-mono font-bold tracking-widest text-white uppercase">
                    SHAP FORCE VECTOR BALANCER
                  </div>
                </div>
                <div className="text-[11px] font-mono text-[#00E83F] tracking-wider opacity-90">
                  ENGINE: TREESHAP (LUNDBERG ET AL.) • 32 SENSORY SIGNALS SYNCHRONIZED
                </div>
              </div>

              {/* Interactive Vector Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10 text-xs font-mono">
                {[
                  { id: "all", label: "ALL VECTORS (32)" },
                  { id: "positive", label: "RETENTION DRIVERS (+38.4)" },
                  { id: "negative", label: "DROPOFF RISKS (-7.2)" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveVectorTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer text-[11px] font-bold ${
                      activeVectorTab === tab.id
                        ? "bg-[#00E83F] text-[#08080C] shadow-[0_0_12px_rgba(0,232,63,0.5)]"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Virality Score Badge */}
              <div className="flex items-baseline gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                  VIRALITY QUOTIENT:
                </span>
                <span className="text-3xl font-black font-sans text-white tracking-tight">
                  91.2
                </span>
                <span className="text-xs font-mono font-bold text-[#00E83F]">/ 100</span>
              </div>
            </div>

            {/* ── THE SHAP FORCE EQUILIBRIUM AXIS (Bidirectional Balance Diagram) ── */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <div className="flex items-center gap-2 text-white/50 text-[11px]">
                  <span>BASELINE E[f(x)]: 50.0 pts</span>
                </div>
                <div className="text-right text-[11px] font-mono text-[#00E83F] font-bold">
                  NET PREDICTION f(x) = 91.2 pts (+41.2 Lift)
                </div>
              </div>

              {/* Force Plot Visual Axis */}
              <div className="relative h-10 w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden flex items-center">
                {/* 50% Baseline Center Reference Marker */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/20 z-20 pointer-events-none" />

                {/* Positive Force Vector Block (Pushes Right from 50% to 91.2%) */}
                <div
                  className="h-full bg-gradient-to-r from-[#00E83F]/70 via-[#00FF88] to-[#00E83F] relative flex items-center justify-end px-3 transition-all duration-700"
                  style={{ width: "91.2%" }}
                >
                  <div className="text-[10px] font-mono font-black text-[#08080C] uppercase tracking-wider flex items-center gap-1">
                    <span>▲ +38.4 PTS MARGINAL POSITIVE FORCES</span>
                  </div>
                </div>

                {/* Counter Negative Drag Vector (Pulls Back) */}
                <div
                  className="absolute right-0 h-full bg-gradient-to-l from-rose-500/80 to-rose-600/90 flex items-center px-2 z-10"
                  style={{ width: "8.8%" }}
                >
                  <span className="text-[9px] font-mono font-black text-white uppercase tracking-tighter">
                    ▼ -7.2
                  </span>
                </div>

                {/* Target Convergence Pin at 91.2% */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_#ffffff] z-30"
                  style={{ left: "91.2%" }}
                >
                  <div className="absolute -top-1 -translate-x-1/2 w-3 h-3 rounded-full bg-[#00E83F] border-2 border-white shadow-[0_0_10px_#00E83F]" />
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-white/40 pt-1">
                <span>0.0 (Worst Possible Retention)</span>
                <span className="text-white/60">50.0 (Global Dataset Average)</span>
                <span className="text-[#00E83F] font-bold">100.0 (Maximum Algorithmic Virality)</span>
              </div>
            </div>

            {/* 4 Multi-Vector Telemetry Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Factor 1: Hook Power */}
              {(activeVectorTab === "all" || activeVectorTab === "positive") && (
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#00E83F]/50 transition-all duration-300 space-y-4 group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-[#00E83F] tracking-widest uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E83F]" />
                        SIG_01 // TEMPORAL HOOK DYNAMICS
                      </div>
                      <h4 className="font-sans font-bold text-white text-base group-hover:text-[#00E83F] transition-colors">
                        0-3s Hook Power & Velocity
                      </h4>
                    </div>
                    <span className="font-mono font-black text-[#00E83F] px-2.5 py-1 rounded-lg bg-[#00E83F]/15 border border-[#00E83F]/35 text-xs shadow-[0_0_15px_rgba(0,232,63,0.3)]">
                      ▲ +18.4 pts
                    </span>
                  </div>

                  {/* Telemetry Waveform Graphic */}
                  <div className="h-6 w-full flex items-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {[40, 75, 95, 88, 92, 100, 85, 70, 65, 80, 90, 85, 95, 100, 90, 80].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-[#00E83F] rounded-t-sm transition-all"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5">
                    <div className="bg-gradient-to-r from-[#00E83F] to-[#00FF88] h-full rounded-full w-[88%] shadow-[0_0_12px_rgba(0,232,63,0.6)]" />
                  </div>
                  <div className="text-[11px] font-mono text-white/60 leading-relaxed">
                    First 90 frames visual motion index &gt; 0.88; captions synced under 120ms with primary speaker eye contact.
                  </div>
                </div>
              )}

              {/* Factor 2: Optical Motion Vectors */}
              {(activeVectorTab === "all" || activeVectorTab === "positive") && (
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#00E83F]/50 transition-all duration-300 space-y-4 group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-[#00E83F] tracking-widest uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E83F]" />
                        SIG_02 // OPTICAL FLOW & SCENE CADENCE
                      </div>
                      <h4 className="font-sans font-bold text-white text-base group-hover:text-[#00E83F] transition-colors">
                        Optical Motion Flow & Cut Speed
                      </h4>
                    </div>
                    <span className="font-mono font-black text-[#00E83F] px-2.5 py-1 rounded-lg bg-[#00E83F]/15 border border-[#00E83F]/35 text-xs shadow-[0_0_15px_rgba(0,232,63,0.3)]">
                      ▲ +12.6 pts
                    </span>
                  </div>

                  {/* Telemetry Waveform Graphic */}
                  <div className="h-6 w-full flex items-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {[50, 60, 45, 80, 85, 70, 60, 75, 90, 65, 70, 85, 60, 80, 75, 70].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-[#00E83F] rounded-t-sm transition-all"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5">
                    <div className="bg-gradient-to-r from-[#00E83F] to-[#00FF88] h-full rounded-full w-[65%] shadow-[0_0_12px_rgba(0,232,63,0.6)]" />
                  </div>
                  <div className="text-[11px] font-mono text-white/60 leading-relaxed">
                    Scene cut cadence averages 1.8s interval; optical velocity vector stabilizes ocular engagement against swipe fatigue.
                  </div>
                </div>
              )}

              {/* Factor 3: Speech Silence Gap (Negative Hazard) */}
              {(activeVectorTab === "all" || activeVectorTab === "negative") && (
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-rose-500/50 transition-all duration-300 space-y-4 group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-rose-400 tracking-widest uppercase flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        SIG_03 // ACOUSTIC RETENTION HAZARD
                      </div>
                      <h4 className="font-sans font-bold text-white text-base group-hover:text-rose-400 transition-colors">
                        Speech Silence Gap & Audio Lag
                      </h4>
                    </div>
                    <span className="font-mono font-black text-rose-400 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/35 text-xs shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                      ▼ -7.2 pts
                    </span>
                  </div>

                  {/* Telemetry Waveform Graphic with Dead Gap */}
                  <div className="h-6 w-full flex items-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {[70, 65, 80, 75, 10, 5, 5, 10, 15, 60, 75, 80, 85, 70, 65, 70].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-sm transition-all ${
                          i >= 4 && i <= 8 ? "bg-rose-500" : "bg-white/30"
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5">
                    <div className="bg-gradient-to-r from-rose-500 to-rose-400 h-full rounded-full w-[38%] shadow-[0_0_12px_rgba(244,63,94,0.6)]" />
                  </div>
                  <div className="text-[11px] font-mono text-rose-300/80 leading-relaxed">
                    1.2s dead silence interval detected at 0:14; triggers 42% audience abandonment spike before narrative payoff.
                  </div>
                </div>
              )}

              {/* Factor 4: Narrative Emotional Peak */}
              {(activeVectorTab === "all" || activeVectorTab === "positive") && (
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/50 transition-all duration-300 space-y-4 group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-amber-400 tracking-widest uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        SIG_04 // SEMANTIC EMOTIONAL POLARITY
                      </div>
                      <h4 className="font-sans font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                        Narrative Climax & Affect Peak
                      </h4>
                    </div>
                    <span className="font-mono font-black text-amber-400 px-2.5 py-1 rounded-lg bg-amber-400/15 border border-amber-400/35 text-xs shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                      ▲ +7.4 pts
                    </span>
                  </div>

                  {/* Telemetry Waveform Graphic */}
                  <div className="h-6 w-full flex items-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {[30, 35, 40, 50, 55, 65, 75, 85, 95, 100, 90, 85, 70, 60, 50, 45].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-amber-400 rounded-t-sm transition-all"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5">
                    <div className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full w-[72%] shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
                  </div>
                  <div className="text-[11px] font-mono text-white/60 leading-relaxed">
                    Emotional sentiment crest at 0:28 synchronizes with music key change, lifting comment section velocity by 2.1x.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 09 LIVE PREDICTION INTERACTIVE UPLOAD EXPERIENCE ────────────── */}
      <section className="py-28 px-6 md:px-12 border-t border-black/15 canvas-woven-bg">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          {/* Editorial Header */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/[0.06] border border-black/10 text-xs font-mono font-bold tracking-widest text-[#008A20] uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008A20] animate-ping" />
              08 // LIVE SIMULATION STUDIO
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0D0D12] tracking-tight leading-[1.08]">
              Know Your Retention <br />
              <span className="italic font-serif font-normal text-[#008A20]">Before</span> You Publish.
            </h2>
            <p className="text-sm md:text-base font-sans text-[#2C2C34]/80 leading-relaxed">
              Drop any MP4 or short clip. 100 synthetic audience agents will watch, critique, and plot your retention drop-off in 8 seconds.
            </p>
          </div>

          {/* Bespoke Interactive Ingestion Vault Card */}
          <div className="relative rounded-[40px] p-8 md:p-14 bg-[#09090D]/95 backdrop-blur-3xl text-[#F4F1EA] border border-white/12 shadow-[0_45px_120px_rgba(0,0,0,0.65)] overflow-hidden space-y-8">
            {/* Top Laser Scanline Animation with Ambient Glow */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E83F] to-transparent animate-pulse" />
            <div className="absolute top-0 left-1/3 right-1/3 h-16 bg-[#00E83F]/10 blur-2xl pointer-events-none" />

            {/* Futuristic Targeting Reticle & Holographic Dropzone */}
            <div
              onClick={onLaunchApp}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                onLaunchApp();
              }}
              className={`group relative cursor-pointer p-10 md:p-14 rounded-3xl border-2 border-dashed transition-all duration-300 space-y-6 ${
                isDragOver
                  ? "border-[#00FF55] bg-[#00FF55]/10 shadow-[0_0_50px_rgba(0,255,85,0.3)] scale-[1.01]"
                  : "border-white/15 hover:border-[#00E83F]/70 bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              {/* Holographic Radar Scanner Graphic */}
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                {/* Concentric Rotating Radar Rings */}
                <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-[#00E83F]/40 group-hover:scale-125 transition-all duration-500" />
                <div className="absolute inset-2 rounded-full border border-dashed border-[#00E83F]/30 group-hover:border-[#00E83F]/80 group-hover:rotate-180 transition-all duration-700" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/25 flex items-center justify-center text-[#00E83F] group-hover:scale-110 group-hover:shadow-[0_0_35px_rgba(0,232,63,0.5)] transition-all duration-300">
                  <UploadCloud className="w-7 h-7 transition-transform group-hover:-translate-y-1" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-sans font-bold text-xl md:text-2xl text-white group-hover:text-[#00E83F] transition-colors">
                  Drop your video file here or click to browse
                </div>
                <div className="text-xs font-mono text-white/50 tracking-wider flex items-center justify-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/80">.MP4</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/80">.MOV</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/80">.WEBM</span>
                  <span className="text-white/40">• UP TO 500MB • 32 SENSORY SIGNALS EXTRACTED</span>
                </div>
              </div>
            </div>

            {/* Quick Benchmark Preset Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 text-xs font-mono">
              <span className="text-white/40 uppercase tracking-widest text-[10px]">Or test instant benchmark:</span>
              {[
                { name: "⚡ Fast TikTok Hook (0:15)" },
                { name: "📈 YouTube Shorts Explainer (0:45)" },
                { name: "🎬 Cinematic Brand Reel (1:00)" },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPreset(preset.name);
                    onLaunchApp();
                  }}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00E83F]/60 text-white/80 hover:text-white transition-all cursor-pointer text-xs flex items-center gap-2"
                >
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>

            {/* ── THE BESPOKE 3D CYBER-TACTILE IGNITION TRIGGER (THE BUTTON) ── */}
            <div className="pt-6 flex flex-col items-center justify-center space-y-3">
              <button
                onClick={onLaunchApp}
                className="group relative cursor-pointer overflow-hidden rounded-full p-[2.5px] bg-gradient-to-r from-white via-[#00FF66] to-[#009B29] shadow-[0_12px_45px_rgba(0,232,63,0.5)] hover:shadow-[0_18px_60px_rgba(0,255,102,0.75)] transition-all duration-300 active:scale-[0.98] active:translate-y-0.5"
              >
                <div className="relative px-9 md:px-14 py-4 md:py-5 rounded-full bg-gradient-to-r from-[#00FF66] via-[#00E83F] to-[#00B832] text-[#060609] font-mono font-black text-xs md:text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 md:gap-5">
                  {/* Specular Diagonal Light Flare Sweep */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transform duration-700 ease-in-out" />

                  {/* Recessed Obsidian Icon Orb with Pulsing Zap */}
                  <span className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#060609] text-[#00FF66] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <Zap className="w-4 h-4 md:w-4.5 md:h-4.5 fill-current animate-pulse" />
                  </span>

                  {/* Main Action Typography */}
                  <span className="relative z-10 drop-shadow-sm font-black">
                    LAUNCH VIRALITY ENGINE
                  </span>

                  {/* Spring-Loaded Interactive Arrow Capsule */}
                  <span className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#060609]/15 flex items-center justify-center group-hover:bg-[#060609] group-hover:text-[#00FF66] transition-all">
                    <ArrowRight className="w-4 h-4 md:w-4.5 md:h-4.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </button>

              {/* Status Ticker under button */}
              <div className="text-[10px] font-mono text-white/50 tracking-widest flex items-center gap-2 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E83F] animate-ping" />
                <span>100 SYNTHETIC AUDIENCE AGENTS LOADED IN VRAM • 8.2s COLD START</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10 FINAL EDITORIAL CTA & FOOTER ─────────────────────────────── */}
      <footer className="py-20 px-6 md:px-12 border-t border-black/15 canvas-woven-bg">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4">
            <div className="text-xs font-mono text-[#008A20] font-bold uppercase tracking-widest">
              VIRALYTIX INTELLIGENCE SYSTEM
            </div>
            <div className="text-6xl sm:text-8xl font-black tracking-tighter uppercase font-sans">
              <LayeredText text="SEE THE SIGNAL." topColor="#111111" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between border-t border-black/15 pt-8 text-xs font-mono text-[#141412]/60 gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#008A20]" />
              <span className="text-[#141412]/80">VIRALYTIX © 2026 • Built with ❤️ by Prabhu Shankar Mund (Raj)</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#signals" className="hover:text-[#008A20] transition-colors">Signals</a>
              <a href="#swarm" className="hover:text-[#008A20] transition-colors">Swarm</a>
              <a href="#models" className="hover:text-[#008A20] transition-colors">XGBoost</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#008A20] transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
