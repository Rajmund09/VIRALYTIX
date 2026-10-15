'use client';

import React from 'react';

interface FluidGlassCardFilterProps {
  className?: string;
  glowColor?: string;
}

export default function FluidGlassCardFilter({
  className = '',
  glowColor = '#00E83F',
}: FluidGlassCardFilterProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] ${className}`}>
      {/* ── 1. Fluid Liquid Glass Caustics (Ambient refraction, no cursor) ── */}
      <div 
        className="absolute inset-0 opacity-25 mix-blend-screen"
        style={{
          background: `
            radial-gradient(ellipse 65% 55% at 20% 15%, rgba(0, 232, 63, 0.18), transparent 60%),
            radial-gradient(ellipse 55% 45% at 85% 85%, rgba(59, 130, 246, 0.14), transparent 60%),
            radial-gradient(ellipse 40% 60% at 50% 50%, rgba(168, 85, 247, 0.12), transparent 70%)
          `,
          filter: 'blur(24px)',
        }}
      />

      {/* ── 2. Diagonal Specular Glass Reflection Sheen ── */}
      <div 
        className="absolute -inset-full opacity-15 rotate-12"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
          animation: 'glass-sheen-sweep 12s ease-in-out infinite alternate',
        }}
      />

      {/* ── 3. Prismatic Top Edge Refraction Highlight ── */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      
      {/* ── 4. Chromatic Dispersion Bottom Accent ── */}
      <div 
        className="absolute bottom-0 left-10 right-10 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 60, 90, 0.4) 25%, rgba(0, 232, 63, 0.5) 50%, rgba(60, 180, 255, 0.4) 75%, transparent 100%)',
          filter: 'blur(0.5px)',
        }}
      />
    </div>
  );
}
