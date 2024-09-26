"use client";

import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { morphSvgPath } from "./gsapPlugins";
import { Activity, Radio, Cpu, Sparkles } from "lucide-react";

export interface HeroVisualRef {
  getVisualElement: () => HTMLDivElement | null;
  morphToStateB: () => void;
  morphToStateA: () => void;
}

const SVG_PATH_STATE_A =
  "M 20 80 C 60 20, 100 140, 140 80 C 180 20, 220 140, 260 80";
const SVG_PATH_STATE_B =
  "M 20 80 C 80 140, 120 20, 160 80 C 200 140, 240 20, 260 80";

export const HeroVisual = forwardRef<HeroVisualRef, {}>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);

  useImperativeHandle(ref, () => ({
    getVisualElement: () => containerRef.current,
    morphToStateB: () => {
      morphSvgPath(svgPathRef.current, SVG_PATH_STATE_B, 1.4);
    },
    morphToStateA: () => {
      morphSvgPath(svgPathRef.current, SVG_PATH_STATE_A, 1.4);
    },
  }));

  return (
    <div
      ref={containerRef}
      className="hero-visual w-full relative flex flex-col items-center justify-center pointer-events-none space-y-6"
    >
      {/* Editorial Vector Signal Telemetry Card */}
      <div className="w-full max-w-sm p-6 rounded-3xl bg-[#111111] text-[#F5F1E6] border border-black/10 shadow-2xl space-y-5 font-mono">
        <div className="flex items-center justify-between border-b border-[#F5F1E6]/15 pb-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#00E83F]">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>SIGNAL STREAM // ONLINE</span>
          </div>
          <span className="text-[10px] text-[#F5F1E6]/50">32-D MATRIX</span>
        </div>

        {/* Morphing SVG Abstract Signal Waveform */}
        <div className="w-full py-2">
          <svg viewBox="0 0 280 120" className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="heroSignalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E83F" />
                <stop offset="50%" stopColor="#FF1493" />
                <stop offset="100%" stopColor="#8A2BE2" />
              </linearGradient>
            </defs>
            <path
              ref={svgPathRef}
              d={SVG_PATH_STATE_A}
              fill="none"
              stroke="url(#heroSignalGrad)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F5F1E6]/15 text-[11px]">
          <div className="p-2.5 rounded-xl bg-[#1C1C1A] space-y-1">
            <div className="text-[9px] text-[#F5F1E6]/50 uppercase">Visual Motion</div>
            <div className="text-[#00E83F] font-bold">14.8 px/f</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#1C1C1A] space-y-1">
            <div className="text-[9px] text-[#F5F1E6]/50 uppercase">Audio RMS</div>
            <div className="text-[#FF1493] font-bold">-14.2 dB</div>
          </div>
        </div>
      </div>
    </div>
  );
});

HeroVisual.displayName = "HeroVisual";
