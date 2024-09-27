"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

const PHASES = ["VISUAL", "AUDIO", "SPEECH", "PERSONA", "FEATURES", "PREDICTION"];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(onComplete, 600);
          }, 300);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 3;
        const bounded = Math.min(next, 100);
        setPhaseIndex(Math.floor((bounded / 100) * (PHASES.length - 1)));
        return bounded;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-[10000] bg-[#0A0A09] flex flex-col justify-between p-8 md:p-16 select-none font-mono"
        >
          {/* Top Metadata */}
          <div className="flex items-center justify-between text-xs text-[#F4F1EA]/60 font-bold border-b border-[#F4F1EA]/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E83F] animate-ping" />
              <span>VIRALYTIX // MULTIMODAL PREDICTION ENGINE</span>
            </div>
            <span>SYS_VER_2026.1</span>
          </div>

          {/* Center Brand Sequence */}
          <div className="my-auto space-y-6 text-center">
            <div className="text-4xl md:text-7xl font-extrabold tracking-tighter text-[#F4F1EA] font-sans">
              VIRALYTIX
            </div>

            <div className="flex items-center justify-center gap-3 text-xs md:text-sm text-[#00E83F]">
              <span className="text-[#F4F1EA]/40">INITIALIZING:</span>
              <motion.span key={PHASES[phaseIndex]} className="font-extrabold tracking-widest">
                [{PHASES[phaseIndex]}]
              </motion.span>
            </div>
          </div>

          {/* Bottom Progress Indicator */}
          <div className="space-y-3 border-t border-[#F4F1EA]/10 pt-4">
            <div className="flex justify-between items-baseline text-xs">
              <span className="text-[#F4F1EA]/50 font-medium">LOADING NEURAL FEATURE SPACE</span>
              <span className="text-3xl font-black text-[#F4F1EA]">
                {progress < 10 ? `0${progress}` : progress}
                <span className="text-xs text-[#00E83F] font-bold ml-1">%</span>
              </span>
            </div>

            {/* Precision Loading Line */}
            <div className="w-full h-1 bg-[#F4F1EA]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00E83F] via-[#F5A7E8] to-[#FF7A00] transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
