"use client";

import React from "react";

interface LayeredTextProps {
  text: string;
  className?: string;
  topColor?: string;
  darkTheme?: boolean;
}

export const LayeredText: React.FC<LayeredTextProps> = ({
  text,
  className = "",
  topColor = "#F5F1E6",
  darkTheme = true,
}) => {
  // Underlying 4 layers (positioned absolutely beneath top layer 1)
  // Shifted left & up by increments of 0.04em (-0.04em, -0.08em, -0.12em, -0.16em)
  const lightLayers = [
    { offset: "-0.16em", color: "#d9d9d9" },
    { offset: "-0.12em", color: "#d1d1d1" },
    { offset: "-0.08em", color: "#c9c9c9" },
    { offset: "-0.04em", color: "#bfbfbf" },
  ];

  const darkLayers = [
    { offset: "-0.16em", color: "#1c1c1a" },
    { offset: "-0.12em", color: "#282824" },
    { offset: "-0.08em", color: "#363630" },
    { offset: "-0.04em", color: "#484840" },
  ];

  const layers = darkTheme ? darkLayers : lightLayers;

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Layers 5 -> 2 (Absolute, pointer-events: none) */}
      {layers.map((layer, idx) => (
        <span
          key={idx}
          aria-hidden="true"
          className="absolute top-0 left-0 select-none pointer-events-none transition-transform duration-300"
          style={{
            transform: `translate(${layer.offset}, ${layer.offset})`,
            color: layer.color,
            zIndex: idx + 1,
          }}
        >
          {text}
        </span>
      ))}

      {/* Layer 1 (Top Layer) */}
      <span
        className="relative z-10"
        style={{ color: topColor }}
      >
        {text}
      </span>
    </span>
  );
};
