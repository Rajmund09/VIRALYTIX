"use client";

import React from "react";
import Image from "next/image";

interface InfiniteBandProps {
  image: string;
  height?: number;
  direction?: "left" | "right";
  speedSeconds?: number;
  alt?: string;
  className?: string;
}

export const InfiniteBand: React.FC<InfiniteBandProps> = ({
  image,
  height = 46,
  direction = "left",
  speedSeconds = 30,
  alt = "Decorative moving band",
  className = "",
}) => {
  // We generate 2 identical sets of repeated images (6 per set) to ensure seamless infinite looping
  const tilesPerSet = 6;
  const indices = Array.from({ length: tilesPerSet }, (_, i) => i);

  const animationClass =
    direction === "left" ? "animate-band-left" : "animate-band-right";

  return (
    <div
      className={`relative w-full overflow-hidden select-none pointer-events-none z-20 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4),inset_0_-2px_8px_rgba(0,0,0,0.4)] border-y border-white/10 ${className}`}
      style={{ height: `${height}px` }}
    >
      {/* Subtle Specular Overlay Sheen */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-black/15 via-transparent to-black/35" />

      {/* Moving Track */}
      <div
        className={animationClass}
        style={
          {
            "--band-speed": `${speedSeconds}s`,
            height: `${height}px`,
          } as React.CSSProperties
        }
      >
        {/* Set 1 */}
        <div className="flex shrink-0 items-center h-full">
          {indices.map((idx) => (
            <img
              key={`set1-${idx}`}
              src={image}
              alt={alt}
              className="h-full w-auto object-contain shrink-0"
              style={{
                imageRendering: "auto",
                height: `${height}px`,
                maxWidth: "none",
              }}
              loading="eager"
            />
          ))}
        </div>

        {/* Set 2 (Identical Clone for Seamless Wrap) */}
        <div className="flex shrink-0 items-center h-full" aria-hidden="true">
          {indices.map((idx) => (
            <img
              key={`set2-${idx}`}
              src={image}
              alt=""
              className="h-full w-auto object-contain shrink-0"
              style={{
                imageRendering: "auto",
                height: `${height}px`,
                maxWidth: "none",
              }}
              loading="eager"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteBand;
