"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Zap,
  TrendingUp,
  Activity,
  Play,
  ArrowRight,
  Shield,
  Sparkles,
  Users,
  BarChart3,
  CheckCircle2,
  Cpu,
  Layers,
  Sliders,
  Share2,
  Lock,
  ChevronRight,
  Globe,
  Radio,
  FileVideo,
  Eye,
  Award,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
} from "recharts";

interface LandingPageProps {
  onLaunchApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const simulatorRef = useRef<HTMLDivElement>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);

  // Live Interactive Simulator State inside Landing Page
  const [hookScore, setHookScore] = useState(8.5);
  const [sceneCuts, setSceneCuts] = useState(14);
  const [audioEnergy, setAudioEnergy] = useState(78);
  const [motionScore, setMotionScore] = useState(82);

  // Calculated Virality Score formula
  const calculatedVirality = Math.min(
    99,
    Math.round(
      hookScore * 5.2 +
        (sceneCuts / 20) * 22 +
        (audioEnergy / 100) * 18 +
        (motionScore / 100) * 15 +
        5
    )
  );

  // Tilt Effect on Hero Preview Card
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (y / rect.height) * -16,
      y: (x / rect.width) * 16,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // GSAP Animations setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // Hero Text Animation
      if (heroTextRef.current) {
        gsap.fromTo(
          heroTextRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
          }
        );
      }

      // Hero Card Entrance
      if (heroCardRef.current) {
        gsap.fromTo(
          heroCardRef.current,
          { scale: 0.9, opacity: 0, y: 60 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: 0.3,
            ease: "back.out(1.4)",
          }
        );
      }

      // Feature Cards ScrollTrigger Stagger
      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll(".feature-card");
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.18,
            ease: "power2.out",
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Pipeline Steps ScrollTrigger
      if (pipelineRef.current) {
        const steps = pipelineRef.current.querySelectorAll(".pipeline-step");
        gsap.fromTo(
          steps,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: pipelineRef.current,
              start: "top 75%",
            },
          }
        );
      }
    }
  }, []);

  // Simulated Retention Curve for Hero Card
  const mockRetention = [
    { second: 0, retention: 100 },
    { second: 2, retention: 94 },
    { second: 4, retention: 89 },
    { second: 6, retention: 85 },
    { second: 8, retention: 82 },
    { second: 10, retention: 79 },
    { second: 12, retention: 76 },
    { second: 15, retention: 74 },
  ];

  return (
    <div className="min-h-screen text-slate-100 relative overflow-x-hidden">
      {/* ── TOP STICKY NAVIGATION BAR ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#061c10]/85 border-b border-emerald-500/20 px-4 md:px-8 py-3.5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-emerald-300/40">
              <Zap className="w-5 h-5 text-white fill-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-mono">
                  VIRALYTIX
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  AI v1.0 LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Predictive Virality Engine & Swarm Simulator
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a
              href="#features"
              className="hover:text-emerald-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#simulator"
              className="hover:text-emerald-400 transition-colors"
            >
              Live Simulator
            </a>
            <a
              href="#pipeline"
              className="hover:text-emerald-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#tech"
              className="hover:text-emerald-400 transition-colors"
            >
              Architecture
            </a>
          </nav>

          {/* Launch App Action Button */}
          <button
            onClick={onLaunchApp}
            className="group relative px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 border border-emerald-300/40"
          >
            <span>Launch Engine</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative pt-16 pb-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12"
      >
        {/* Ambient Glow Orbs */}
        <div className="ambient-blob blob-emerald w-[450px] h-[450px] -top-20 -left-20" />
        <div className="ambient-blob blob-cyan w-[380px] h-[380px] top-40 right-10" />

        {/* Hero Left Column Text */}
        <div ref={heroTextRef} className="flex-1 space-y-6 z-10 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI-POWERED MULTI-MODAL VIRALITY FORECASTING</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
            Predict & Engineer <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Viral Videos
            </span>{" "}
            Before Publishing.
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-2xl font-normal leading-relaxed">
            Stop guessing what the algorithm wants. VIRALYTIX extracts frame-by-frame hook quality, visual motion flow, audio dynamics, and runs a <strong>100-Agent AI Audience Swarm</strong> to forecast reach and retention before you post.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onLaunchApp}
              className="px-7 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_45px_rgba(16,185,129,0.8)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-emerald-300/40"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Launch Virality Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#simulator"
              className="px-7 py-4 rounded-xl font-bold text-sm bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-500 transition-all flex items-center justify-center gap-2"
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Try Live Calculator</span>
            </a>
          </div>

          {/* Social Proof Key Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-left">
            <div>
              <div className="text-2xl font-black text-emerald-400">94.8%</div>
              <div className="text-xs text-slate-400 font-medium">XGBoost Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-black text-cyan-400">100 AI</div>
              <div className="text-xs text-slate-400 font-medium">Swarm Audience Agents</div>
            </div>
            <div>
              <div className="text-2xl font-black text-teal-400">&lt; 1.2s</div>
              <div className="text-xs text-slate-400 font-medium">Feature Extraction Speed</div>
            </div>
          </div>
        </div>

        {/* Hero Right Column: 3D Interactive Card Preview */}
        <div
          ref={heroCardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="flex-1 w-full max-w-lg z-10 perspective-1000"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative space-y-5">
            {/* Top Badge Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileVideo className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-slate-200 font-bold">
                  VIRAL_ANALYSIS_PREVIEW.MP4
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                HIGH VIRAL POTENTIAL
              </span>
            </div>

            {/* Virality Score Big Gauge */}
            <div className="flex items-center justify-between bg-gradient-to-br from-slate-950 to-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Predicted Virality Score
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-4xl font-black text-emerald-400 font-mono">
                    94
                  </span>
                  <span className="text-slate-400 text-sm font-bold">/ 100</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold">
                  Est. Organic Reach
                </span>
                <div className="text-lg font-extrabold text-cyan-300 font-mono">
                  1.4M - 2.8M
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">
                  ↑ 480% vs baseline
                </div>
              </div>
            </div>

            {/* Retention Curve Mini Chart */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>PREDICTED RETENTION CURVE (15s)</span>
                <span className="text-emerald-400">74% Completion</span>
              </div>
              <div className="h-28 w-full bg-slate-950/60 rounded-xl p-2 border border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockRetention}>
                    <defs>
                      <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="second" hide />
                    <YAxis domain={[0, 100]} hide />
                    <Area
                      type="monotone"
                      dataKey="retention"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fill="url(#heroArea)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Swarm Live Indicator */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200 font-medium">
                  Swarm Simulation: <strong>100/100 Agents Finished</strong>
                </span>
              </div>
              <span className="text-emerald-400 font-mono font-bold">
                84 Likes • 42 Shares
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS GRID ────────────────────────────────────────── */}
      <section id="features" ref={featuresRef} className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>CORE ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Built for Modern Video Algorithms
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Combining computer vision signal processing, acoustic dynamics, and multi-agent persona simulations into a unified forecasting pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: FileVideo,
              color: "from-emerald-500 to-teal-500",
              title: "Signal Extractor",
              desc: "FFmpeg frame sampling & OpenCV optical flow tracking frame-level motion, brightness, and scene cuts.",
            },
            {
              icon: Users,
              color: "from-teal-500 to-cyan-500",
              title: "100-Agent Swarm",
              desc: "Simulate 100 AI viewer personas to model attention spans, skip triggers, and share tendencies.",
            },
            {
              icon: BarChart3,
              color: "from-cyan-500 to-blue-500",
              title: "XGBoost & SHAP",
              desc: "Explainable Machine Learning giving granular attribution on why a clip will perform or drop off.",
            },
            {
              icon: Sparkles,
              color: "from-purple-500 to-indigo-500",
              title: "Script Optimizer",
              desc: "Actionable recommendations on hook timing, audio energy boosts, and CTA placement to maximize reach.",
            },
          ].map((feat, idx) => (
            <div
              key={idx}
              className="feature-card p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(16,185,129,0.15)] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center shadow-lg`}
                >
                  <feat.icon className="w-6 h-6 text-slate-950" />
                </div>
                <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 flex items-center text-xs text-emerald-400 font-semibold gap-1 mt-6">
                <span>Explore Component</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE INTERACTIVE CALCULATOR SIMULATOR ─────────────────────── */}
      <section id="simulator" ref={simulatorRef} className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="p-8 md:p-12 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Controls */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold">
                  INTERACTIVE PREVIEW
                </span>
                <h2 className="text-3xl font-extrabold text-white">
                  Test Your Clip's Virality Factors
                </h2>
                <p className="text-xs text-slate-400">
                  Adjust video parameters below to observe real-time score calculation:
                </p>
              </div>

              {/* Slider 1: Hook Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">0-3s Hook Power</span>
                  <span className="text-emerald-400 font-bold">{hookScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={hookScore}
                  onChange={(e) => setHookScore(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Scene Cut Frequency */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Scene Cut Pace</span>
                  <span className="text-cyan-400 font-bold">{sceneCuts} cuts / min</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={sceneCuts}
                  onChange={(e) => setSceneCuts(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 3: Audio Energy */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Audio & Voice Energy</span>
                  <span className="text-teal-400 font-bold">{audioEnergy}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={audioEnergy}
                  onChange={(e) => setAudioEnergy(parseInt(e.target.value))}
                  className="w-full accent-teal-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 4: Motion Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Visual Dynamics & Motion</span>
                  <span className="text-purple-400 font-bold">{motionScore}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={motionScore}
                  onChange={(e) => setMotionScore(parseInt(e.target.value))}
                  className="w-full accent-purple-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Right Calculated Display */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 space-y-6 text-center lg:text-left">
              <div className="space-y-1">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  Calculated Virality Score
                </span>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-mono">
                  {calculatedVirality} <span className="text-2xl text-slate-500">/100</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Forecasted Performance:</span>
                  <strong className="text-emerald-400">
                    {calculatedVirality > 85
                      ? "🔥 Viral Breakout"
                      : calculatedVirality > 65
                      ? "⚡ Solid Organic Reach"
                      : "⚠️ Below Average Reach"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Est. Completion Rate:</span>
                  <strong className="text-cyan-300">
                    {Math.round(calculatedVirality * 0.82)}%
                  </strong>
                </div>
              </div>

              <button
                onClick={onLaunchApp}
                className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] transition-all flex items-center justify-center gap-2 border border-emerald-300/40"
              >
                <span>Upload Video to Analyze Full Features</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4-STEP PIPELINE WALKTHROUGH ───────────────────────────────── */}
      <section id="pipeline" ref={pipelineRef} className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>EXECUTION PIPELINE</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            From Raw Video to Viral Insight in 4 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              num: "01",
              title: "Upload & Probe",
              desc: "Drag and drop any MP4 or MOV. FFmpeg demuxer extracts resolution, bitrate, audio track, and keyframes.",
            },
            {
              num: "02",
              title: "Signal Processing",
              desc: "OpenCV measures frame optical flow delta. Wav2Vec & Whisper analyze speech speed, text density, and silence ratio.",
            },
            {
              num: "03",
              title: "Swarm Simulation",
              desc: "100 AI viewer agents simulate attention spans and decision loops (watch, skip, like, comment, share).",
            },
            {
              num: "04",
              title: "SHAP Virality Report",
              desc: "Get an explainable virality score, frame retention curve, and precise script edit recommendations.",
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className="pipeline-step p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-teal-500/40 transition-colors"
            >
              <div className="text-3xl font-black font-mono text-emerald-400/40">
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER & CALL TO ACTION BANNER ───────────────────────────── */}
      <footer className="border-t border-slate-800/80 pt-16 pb-12 px-4 md:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Banner */}
          <div className="p-10 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 text-center space-y-6">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">
              Ready to engineer your next viral hit?
            </h3>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Launch the VIRALYTIX engine now to analyze your clips and simulate viewer reaction before publishing.
            </p>
            <button
              onClick={onLaunchApp}
              className="px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all inline-flex items-center gap-2 border border-emerald-300/40"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Launch Virality Engine Now</span>
            </button>
          </div>

          {/* Bottom Footer Credits */}
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-900 pt-8 gap-4">
            <div className="flex items-center gap-2 font-mono">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>VIRALYTIX © 2026 • Open Source Virality Prediction System</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="hover:text-slate-300">
                Documentation
              </a>
              <a href="#tech" className="hover:text-slate-300">
                API Docs
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-300">
                GitHub Repo
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
