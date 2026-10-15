'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled to prevent Three.js SSR canvas issues
const DynamicFluidGlass = dynamic(() => import('./FluidGlass'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-[#120F17]/90 to-[#070709]/90 backdrop-blur-xl animate-pulse" />
  ),
});

export default DynamicFluidGlass;
