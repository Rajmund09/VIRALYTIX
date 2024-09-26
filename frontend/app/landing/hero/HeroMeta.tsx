"use client";

import React, { useRef, useLayoutEffect } from "react";
import { scrambleText } from "./gsapPlugins";

export const HeroMeta: React.FC = () => {
  const metaRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Scramble technical stat on initialization
    if (statRef.current) {
      scrambleText(statRef.current, "XGBOOST R² = 0.912 • 100-AGENT SWARM", 1.4);
    }
  }, []);

  return (
    <div
      ref={metaRef}
      className="hero-meta z-10 flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/10 pb-4 gap-2 font-mono text-xs"
    >
      <div
        ref={eyebrowRef}
        className="flex items-center gap-2 text-[#111111] font-extrabold uppercase tracking-widest"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#00E83F] border border-black/20 animate-pulse shadow-[0_0_8px_rgba(0,232,63,0.8)]" />
        <span>MULTIMODAL CONTENT INTELLIGENCE // 01</span>
      </div>

      <div
        ref={statRef}
        className="hero-stat text-[11px] text-[#111111]/70 uppercase tracking-widest font-semibold"
      >
        XGBOOST R² = ---- • --- AGENT SWARM
      </div>
    </div>
  );
};
