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

      // ML Model Comparison Line Progress
      if (mlRef.current) {
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

      {/* ── 03 KINETIC TYPOGRAPHY DISPLACEMENT SECTION ─────────────────── */}
      <section ref={kineticTextRef} className="py-24 px-6 md:px-12 border-t border-[#F4F1EA]/10 bg-[#0A0A09]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-xs font-mono text-[#F5A7E8] font-bold uppercase tracking-widest">
            02 // SIGNAL DECOMPOSITION
          </div>

          <div className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4F1EA] space-y-2 uppercase leading-none">
            <div className="kinetic-word">YOUR VIDEO IS</div>
            <div className="kinetic-word text-[#00E83F] italic">MORE THAN FRAMES.</div>
            <div className="kinetic-word text-4xl sm:text-6xl lg:text-7xl font-mono text-[#F5A7E8]">
              A VIDEO IS 32 SIGNALS DISGUISED AS ONE.
            </div>
          </div>
        </div>
      </section>

      {/* ── 03, 04 & 05 GSAP SIDEWAYS HORIZONTAL SCROLL SHOWCASE ────────── */}
      <HorizontalShowcase />

      {/* ── 07 MACHINE LEARNING MODEL RACE SECTION ─────────────────────── */}
      <section id="models" ref={mlRef} className="py-24 px-6 md:px-12 border-t border-[#F4F1EA]/10">
        <div className="max-w-7xl mx-auto space-y-12">
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

      {/* ── 08 SHAP EXPLAINABILITY FORCE VECTORS SECTION ───────────────── */}
      <section id="explainability" ref={shapRef} className="py-24 px-6 md:px-12 border-t border-[#F4F1EA]/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#F5A7E8] font-bold uppercase tracking-widest">
              07 // EXPLAINABLE AI ATTRIBUTION
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#F4F1EA]">
              Don't Just Get The Score. Understand It.
            </h2>
          </div>

          <div className="p-8 rounded-3xl bg-[#141412] border border-[#F4F1EA]/15 space-y-6 font-mono">
            <div className="flex justify-between items-center text-xs border-b border-[#F4F1EA]/10 pb-4">
              <span>SHAP FORCE VECTOR BALANCER</span>
              <span className="text-[#00E83F] font-extrabold">TOTAL SCORE: 91.2 / 100</span>
            </div>

            <div className="space-y-4">
              {/* Positive Factor */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#00E83F]">
                  <span>+ 0-3s Hook Power & Text Overlay</span>
                  <span>+18.4 pts</span>
                </div>
                <div className="w-full bg-[#0A0A09] h-3 rounded-full overflow-hidden border border-[#00E83F]/30">
                  <div className="bg-[#00E83F] h-full w-[85%]" />
                </div>
              </div>

              {/* Positive Factor */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#00E83F]">
                  <span>+ Optical Motion Vectors & Scene Cut Speed</span>
                  <span>+12.6 pts</span>
                </div>
                <div className="w-full bg-[#0A0A09] h-3 rounded-full overflow-hidden border border-[#00E83F]/30">
                  <div className="bg-[#00E83F] h-full w-[65%]" />
                </div>
              </div>

              {/* Negative Factor */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-rose-400">
                  <span>- Prolonged Speech Silence Gap</span>
                  <span>-7.2 pts</span>
                </div>
                <div className="w-full bg-[#0A0A09] h-3 rounded-full overflow-hidden border border-rose-500/30">
                  <div className="bg-rose-500 h-full w-[35%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 09 LIVE PREDICTION INTERACTIVE UPLOAD EXPERIENCE ────────────── */}
      <section className="py-24 px-6 md:px-12 border-t border-[#F4F1EA]/10 bg-[#0A0A09]">
        <div className="max-w-7xl mx-auto p-10 md:p-16 rounded-3xl bg-[#141412] border border-[#00E83F]/40 space-y-8 text-center relative overflow-hidden">
          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full bg-[#00E83F]/10 text-[#00E83F] border border-[#00E83F]/30 text-xs font-mono font-bold uppercase">
              LIVE PREDICTION INTERFACE
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#F4F1EA]">
              Test Your Next Video Now
            </h2>
            <p className="text-xs font-mono text-[#F4F1EA]/60 max-w-md mx-auto">
              Drop your video file to extract 32 signals and run the 100-agent audience simulation live.
            </p>
          </div>

          <button
            onClick={onLaunchApp}
            data-cursor="ANALYZE"
            className="px-10 py-5 rounded-full bg-[#00E83F] text-[#0A0A09] font-mono font-black text-sm uppercase tracking-widest hover:bg-[#F4F1EA] transition-all inline-flex items-center gap-3 shadow-[0_0_35px_rgba(0,232,63,0.5)]"
          >
            <Zap className="w-5 h-5 fill-[#0A0A09]" />
            <span>Launch Virality Engine →</span>
          </button>
        </div>
      </section>

      {/* ── 10 FINAL EDITORIAL CTA & FOOTER ─────────────────────────────── */}
      <footer className="py-20 px-6 md:px-12 border-t border-[#F4F1EA]/15 bg-[#0A0A09]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4">
            <div className="text-xs font-mono text-[#00E83F] font-bold uppercase tracking-widest">
              VIRALYTIX INTELLIGENCE SYSTEM
            </div>
            <div className="text-6xl sm:text-8xl font-black tracking-tighter uppercase font-sans">
              <LayeredText text="SEE THE SIGNAL." topColor="#111111" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between border-t border-[#F4F1EA]/15 pt-8 text-xs font-mono text-[#F4F1EA]/50 gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00E83F]" />
              <span>VIRALYTIX © 2026 • Built with ❤️ by Prabhu Shankar Mund (Raj)</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#signals" className="hover:text-[#F4F1EA]">Signals</a>
              <a href="#swarm" className="hover:text-[#F4F1EA]">Swarm</a>
              <a href="#models" className="hover:text-[#F4F1EA]">XGBoost</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#F4F1EA]">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
