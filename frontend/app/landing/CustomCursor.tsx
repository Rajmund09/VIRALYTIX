"use client";

import React, { useEffect, useState } from "react";

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [lagPos, setLagPos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on non-touch fine pointer devices
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    document.body.classList.add("custom-cursor-active");
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if target has data-cursor label
      const target = e.target as HTMLElement | null;
      const cursorElement = target?.closest("[data-cursor]") as HTMLElement | null;
      if (cursorElement) {
        setCursorText(cursorElement.getAttribute("data-cursor") || "EXPLORE");
        setIsHovered(true);
      } else if (target?.closest("button, a")) {
        setCursorText("ANALYZE");
        setIsHovered(true);
      } else {
        setCursorText("");
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Smooth lerp loop for the lagging ring
    let animId: number;
    let currentLag = { x: -100, y: -100 };

    const loop = () => {
      currentLag.x += (pos.x - currentLag.x) * 0.18;
      currentLag.y += (pos.y - currentLag.y) * 0.18;
      setLagPos({ x: currentLag.x, y: currentLag.y });
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [pos.x, pos.y]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Central Precision Cursor Dot */}
      <div
        className="fixed w-2 h-2 rounded-full bg-[#00E83F] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      />

      {/* Lagging Ring & Context Badge */}
      <div
        className={`fixed rounded-full border border-[#00E83F]/60 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 flex items-center justify-center ${
          isHovered
            ? "w-24 h-24 bg-[#0A0A09]/90 backdrop-blur-md border-[#00E83F] scale-110 shadow-[0_0_30px_rgba(0,232,63,0.3)]"
            : "w-9 h-9 bg-transparent"
        }`}
        style={{ left: `${lagPos.x}px`, top: `${lagPos.y}px` }}
      >
        {isHovered && cursorText && (
          <span className="text-[10px] font-mono font-black text-[#00E83F] uppercase tracking-widest animate-in fade-in zoom-in duration-200">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
