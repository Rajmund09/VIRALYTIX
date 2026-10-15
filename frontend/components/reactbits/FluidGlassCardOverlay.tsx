'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const FluidGlass = dynamic(() => import('./FluidGlass'), {
  ssr: false,
  loading: () => null,
});

interface FluidGlassCardOverlayProps {
  mode?: 'lens' | 'bar' | 'cube';
  className?: string;
  opacity?: number;
  interactive?: boolean;
}

export default function FluidGlassCardOverlay({
  mode = 'lens',
  className = '',
  opacity = 0.85,
  interactive = true,
}: FluidGlassCardOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-20 ${className}`}
      style={{ opacity }}
    >
      <FluidGlass
        mode={mode}
        disableScroll={true}
        backgroundColor="transparent"
        interactivePointer={interactive}
        lensProps={{
          scale: 0.32,
          ior: 1.25,
          thickness: 4.5,
          chromaticAberration: 0.16,
          anisotropy: 0.02,
          roughness: 0.05,
          transmission: 0.98,
        }}
        barProps={{
          scale: 0.35,
          ior: 1.2,
          thickness: 6,
          chromaticAberration: 0.14,
          anisotropy: 0.01,
          transmission: 0.98,
        }}
      />
    </div>
  );
}
