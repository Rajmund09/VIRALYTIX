"use client";

import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { Sparkles } from "lucide-react";
import { gsap, scrambleText } from "./gsapPlugins";

export interface HeroSignalBadgeRef {
  getBadgeElement: () => HTMLDivElement | null;
  animateIn: () => void;
}

export const HeroSignalBadge = forwardRef<HeroSignalBadgeRef, {}>((_, ref) => {
  const badgeWrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useImperativeHandle(ref, () => ({
    getBadgeElement: () => badgeWrapRef.current,
    animateIn: () => {
      if (!badgeWrapRef.current) return;
      gsap.fromTo(
        badgeWrapRef.current,
        { scale: 0.6, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.7)" }
      );
      if (textRef.current) {
        scrambleText(textRef.current, "~ 32 SIGNALS ~", 1.0);
      }
    },
  }));

  return (
    <div
      ref={badgeWrapRef}
      className="hero-signal-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#8A2BE2] via-[#FF1493] to-[#00E83F] text-white shadow-md text-xs font-mono font-extrabold tracking-widest uppercase select-none pointer-events-auto"
    >
      <Sparkles className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: "8s" }} />
      <span ref={textRef}>~ 32 SIGNALS ~</span>
    </div>
  );
});

HeroSignalBadge.displayName = "HeroSignalBadge";
