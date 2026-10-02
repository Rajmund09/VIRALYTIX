"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface HorizontalShowcaseProps {
  onLaunchApp?: () => void;
}

export const HorizontalShowcase: React.FC<HorizontalShowcaseProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // References for SVG curve 1 (bezier S-curve)
  const easingCurve1Ref = useRef<SVGPathElement>(null);
  const handle1aRef = useRef<SVGCircleElement>(null);
  const handle1bRef = useRef<SVGCircleElement>(null);
  const line1aRef = useRef<SVGLineElement>(null);
  const line1bRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      const container = containerRef.current;
      const track = trackRef.current;

      if (!container || !track) return;

      const totalWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const xTranslate = -(totalWidth - viewportWidth);

      const ctx = gsap.context(() => {
        // 1. MASTER PINNED HORIZONTAL EDITORIAL REEL SCRUB
        const horizontalTween = gsap.to(track, {
          x: xTranslate,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // 2. CHOREOGRAPHED PHYSICAL STICKER POP ENTRANCES
        const stickers = track.querySelectorAll(".sticker-pop");
        stickers.forEach((sticker) => {
          const targetRot = parseFloat(sticker.getAttribute("data-rotation") || "0");
          gsap.fromTo(
            sticker,
            { scale: 0.6, opacity: 0, rotation: targetRot - 12, y: 35 },
            {
              scale: 1,
              opacity: 1,
              rotation: targetRot,
              y: 0,
              duration: 0.85,
              ease: "back.out(1.8)",
              scrollTrigger: {
                trigger: sticker,
                containerAnimation: horizontalTween,
                start: "left 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        // 3. ANIMATED SVG BEZIER EASING CURVE 1 CONTROL POINTS MORPH
        if (
          easingCurve1Ref.current &&
          handle1aRef.current &&
          handle1bRef.current &&
          line1aRef.current &&
          line1bRef.current
        ) {
          gsap.to(
            {},
            {
              duration: 1,
              scrollTrigger: {
                trigger: easingCurve1Ref.current,
                containerAnimation: horizontalTween,
                start: "left 80%",
                end: "right 20%",
                scrub: 1,
                onUpdate: (self) => {
                  const p = self.progress;
                  const c1y = 20 + p * 80;
                  const c2y = 120 - p * 80;

                  if (easingCurve1Ref.current) {
                    easingCurve1Ref.current.setAttribute(
                      "d",
                      `M 20 120 C 60 ${c1y.toFixed(1)}, 180 ${c2y.toFixed(1)}, 220 20`
                    );
                  }
                  if (handle1aRef.current) handle1aRef.current.setAttribute("cy", c1y.toFixed(1));
                  if (handle1bRef.current) handle1bRef.current.setAttribute("cy", c2y.toFixed(1));
                  if (line1aRef.current) line1aRef.current.setAttribute("y2", c1y.toFixed(1));
                  if (line1bRef.current) line1bRef.current.setAttribute("y2", c2y.toFixed(1));
                },
              },
            }
          );
        }
      }, container);

      return () => ctx.revert();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#070706] text-[#F4F1EA] overflow-hidden border-t border-[#F4F1EA]/10 font-sans select-none"
    >
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/3 left-1/4 w-[50rem] h-[28rem] bg-[#00E83F]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[50rem] h-[28rem] bg-[#F5A7E8]/10 rounded-full blur-[140px]" />
      </div>

      <div
        ref={trackRef}
        className="flex h-full items-center whitespace-nowrap will-change-transform relative z-10 px-12 md:px-24"
      >
        <div className="flex items-center gap-6 md:gap-10 text-5xl sm:text-7xl lg:text-[7rem] font-medium tracking-tight leading-none text-[#F4F1EA]">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#00E83F]/10 border border-[#00E83F]/30 backdrop-blur-md mr-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E83F] animate-ping" />
            <span className="text-sm font-mono text-[#00E83F] font-extrabold uppercase tracking-widest">
              03-05 // KINETIC REEL
            </span>
          </div>

          <span className="inline-block">Deconstruct your video with</span>

          <span
            className="sticker-pop inline-block px-7 py-3 rounded-3xl bg-[#00E83F] text-black font-extrabold text-4xl sm:text-6xl lg:text-[6.5rem] shadow-2xl border-2 border-black -rotate-3 transform-gpu"
            data-rotation="-3"
          >
            32 Signals
          </span>

          <span
            className="sticker-pop inline-block px-7 py-3 rounded-3xl bg-[#F5A7E8] text-black font-extrabold text-4xl sm:text-6xl lg:text-[6.5rem] shadow-2xl border-2 border-black rotate-4 -ml-10 transform-gpu"
            data-rotation="4"
          >
            Frame-by-frame
          </span>

          <span className="inline-block">parsing optical motion,</span>

          <span
            className="sticker-pop inline-block px-7 py-3 rounded-3xl bg-[#FF7A00] text-black font-extrabold text-4xl sm:text-6xl lg:text-[6.5rem] shadow-2xl border-2 border-black -rotate-2 transform-gpu"
            data-rotation="-2"
          >
            Audio RMS
          </span>

          <span className="inline-block">and</span>

          <span
            className="sticker-pop inline-block px-7 py-3 rounded-3xl bg-[#A855F7] text-white font-extrabold text-4xl sm:text-6xl lg:text-[6.5rem] shadow-2xl border-2 border-black rotate-3 transform-gpu"
            data-rotation="3"
          >
            Whisper Cadence
          </span>

          <span className="inline-block">into high-dimensional</span>

          <span
            className="sticker-pop inline-block px-7 py-3 rounded-3xl bg-[#FFE500] text-black font-extrabold text-4xl sm:text-6xl lg:text-[6.5rem] shadow-2xl border-2 border-black -rotate-4 transform-gpu"
            data-rotation="-4"
          >
            Vector Topology
          </span>

          <div className="graphic-pop inline-block mx-8 align-middle">
            <div className="p-5 rounded-3xl bg-[#141416]/90 border border-[#F4F1EA]/20 shadow-2xl backdrop-blur-xl">
              <svg viewBox="0 0 240 140" className="w-52 h-32 md:w-72 md:h-40 overflow-visible">
                <line ref={line1aRef} x1="20" y1="120" x2="60" y2="20" stroke="#00E83F" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
                <line ref={line1bRef} x1="220" y1="20" x2="180" y2="120" stroke="#00E83F" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
                <path
                  ref={easingCurve1Ref}
                  d="M 20 120 C 60 20, 180 120, 220 20"
                  fill="none"
                  stroke="#F4F1EA"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <rect x="11" y="111" width="18" height="18" fill="#00E83F" rx="4" className="rotate-45 transform-gpu" />
                <rect x="211" y="11" width="18" height="18" fill="#00E83F" rx="4" className="rotate-45 transform-gpu" />
                <circle ref={handle1aRef} cx="60" cy="20" r="8" fill="#00E83F" />
                <circle ref={handle1bRef} cx="180" cy="120" r="8" fill="#00E83F" />
              </svg>
            </div>
          </div>

          <span className="inline-block">before you publish.</span>
        </div>
      </div>
    </div>
  );
};
