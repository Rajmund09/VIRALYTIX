"use client";

import React from "react";

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
  // 24 tiles per set ensures 8,000px to 12,000px width per set,
  // completely eliminating any empty gaps or cutoffs across any 4K/Ultrawide display.
  const tilesPerSet = 24;
  const indices = Array.from({ length: tilesPerSet }, (_, i) => i);

  // Scale duration proportionally so moving 24 tiles maintains the exact same smooth drift speed
  const adjustedDuration = Math.round((tilesPerSet / 6) * speedSeconds);

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
            "--band-speed": `${adjustedDuration}s`,
            height: `${height}px`,
            width: "max-content",
            display: "flex",
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
              height={height}
              className="h-full w-auto object-contain shrink-0"
              style={{
                imageRendering: "auto",
                height: `${height}px`,
                maxWidth: "none",
                display: "block",
              }}
              decoding="async"
              loading={idx < 6 ? "eager" : "lazy"}
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
              height={height}
              className="h-full w-auto object-contain shrink-0"
              style={{
                imageRendering: "auto",
                height: `${height}px`,
                maxWidth: "none",
                display: "block",
              }}
              decoding="async"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteBand;
