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

  // References for SVG curve 2 (bezier inverted arch)
  const easingCurve2Ref = useRef<SVGPathElement>(null);
  const handle2aRef = useRef<SVGCircleElement>(null);
  const handle2bRef = useRef<SVGCircleElement>(null);
  const line2aRef = useRef<SVGLineElement>(null);
  const line2bRef = useRef<SVGLineElement>(null);

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

        // 3. HIGH-QUALITY GRAPHICS APPEARANCE ANIMATIONS (Torus, Hourglass, Flower, Star)
        const graphics = track.querySelectorAll(".graphic-pop");
        graphics.forEach((graphic) => {
          gsap.fromTo(
            graphic,
            { scale: 0.45, opacity: 0, rotation: -30, y: 20 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              y: 0,
              duration: 0.95,
              ease: "back.out(1.6)",
              scrollTrigger: {
                trigger: graphic,
                containerAnimation: horizontalTween,
                start: "left 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        // 4. ANIMATED SVG BEZIER EASING CURVE 1 CONTROL POINTS MORPH
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

        // 5. ANIMATED SVG BEZIER EASING CURVE 2 CONTROL POINTS MORPH (Arch curve)
        if (
          easingCurve2Ref.current &&
          handle2aRef.current &&
          handle2bRef.current &&
          line2aRef.current &&
          line2bRef.current
        ) {
          gsap.to(
            {},
            {
              duration: 1,
              scrollTrigger: {
                trigger: easingCurve2Ref.current,
                containerAnimation: horizontalTween,
                start: "left 85%",
                end: "right 15%",
                scrub: 1,
                onUpdate: (self) => {
                  const p = self.progress;
                  const cy = 20 + p * 90;

                  if (easingCurve2Ref.current) {
                    easingCurve2Ref.current.setAttribute(
                      "d",
                      `M 20 20 Q 120 ${cy.toFixed(1)}, 220 20`
                    );
                  }
                  if (handle2aRef.current) handle2aRef.current.setAttribute("cy", cy.toFixed(1));
                  if (handle2bRef.current) handle2bRef.current.setAttribute("cy", cy.toFixed(1));
                  if (line2aRef.current) line2aRef.current.setAttribute("y2", cy.toFixed(1));
                  if (line2bRef.current) line2bRef.current.setAttribute("y2", cy.toFixed(1));
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
        <div className="absolute inset-0 bg-[radial-gradient(rgba(244,241,234,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div
        ref={trackRef}
        className="flex h-full items-center whitespace-nowrap will-change-transform relative z-10 px-12 md:px-24"
      >
        <div className="flex items-center gap-6 md:gap-10 text-5xl sm:text-7xl lg:text-[7rem] font-medium tracking-tight leading-none text-[#F4F1EA]">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#00E83F]/10 border border-[#00E83F]/30 backdrop-blur-md mr-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E83F] animate-ping" />
            <span className="text-sm font-mono text-[#00E83F] font-extrabold uppercase tracking-widest">
              03-05 // KINETIC MOTION REEL
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

          <div className="graphic-pop inline-block mx-6 align-middle">
            <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-28 md:h-28 overflow-visible">
              <defs>
                <linearGradient id="pinkBloomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF0FA" />
                  <stop offset="35%" stopColor="#F5A7E8" />
                  <stop offset="75%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <g filter="drop-shadow(0px 12px 24px rgba(245,167,232,0.45))">
                <path
                  d="M 50 50 C 25 15, 10 35, 50 5 C 90 35, 75 15, 50 50 C 85 25, 65 85, 95 50 C 65 85, 85 65, 50 50 C 75 85, 90 65, 50 95 C 10 65, 25 85, 50 50 C 15 75, 35 15, 5 50 C 35 15, 15 25, 50 50 Z"
                  fill="url(#pinkBloomGrad)"
                />
              </g>
            </svg>
          </div>

          <div className="graphic-pop inline-block mx-4 align-middle">
            <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-22 md:h-22 overflow-visible">
              <defs>
                <linearGradient id="torusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#67E8F9" />
                  <stop offset="50%" stopColor="#C084FC" />
                  <stop offset="100%" stopColor="#F5A7E8" />
                </linearGradient>
              </defs>
              <g filter="drop-shadow(0px 8px 20px rgba(192,132,252,0.4))">
                <circle cx="50" cy="50" r="38" fill="none" stroke="url(#torusGrad)" strokeWidth="18" />
              </g>
            </svg>
          </div>

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

          <div className="graphic-pop inline-block mx-8 align-middle">
            <svg viewBox="0 0 100 100" className="w-18 h-18 md:w-26 md:h-26 overflow-visible">
              <path
                d="M 35 75 L 35 45 C 35 40, 30 40, 30 45 L 30 75 M 45 75 L 45 30 C 45 25, 40 25, 40 30 L 40 75 M 55 75 L 55 40 C 55 35, 50 35, 50 40 L 50 75 M 65 75 L 65 50 C 65 45, 60 45, 60 50 L 60 75 M 25 75 C 25 85, 75 85, 75 75 L 75 55 C 75 50, 70 50, 70 55 L 70 75"
                fill="none"
                stroke="#FFFDE7"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.5))"
              />
            </svg>
          </div>

          <div className="graphic-pop inline-block mx-4 align-middle">
            <svg viewBox="0 0 100 100" className="w-14 h-14 md:w-20 md:h-20 overflow-visible">
              <path
                d="M 20 80 A 40 40 0 0 1 80 20"
                fill="none"
                stroke="#F5A7E8"
                strokeWidth="16"
                strokeLinecap="round"
                filter="drop-shadow(0px 8px 16px rgba(245,167,232,0.4))"
              />
            </svg>
          </div>

          <span className="sticker-pop inline-block px-8 py-3 rounded-3xl bg-gradient-to-r from-[#00E555] to-[#10B981] text-black font-extrabold text-4xl sm:text-6xl lg:text-[6.5rem] shadow-2xl border-2 border-black transform-gpu" data-rotation="0">
            Nice and
          </span>

          <span className="inline-flex items-center -ml-4 align-middle">
            <span
              className="sticker-pop inline-block px-5 py-2 rounded-2xl bg-gradient-to-br from-[#E9D5FF] via-[#C084FC] to-[#9333EA] text-black font-extrabold text-2xl sm:text-4xl lg:text-5xl shadow-xl border-2 border-black -rotate-4 z-20 transform-gpu"
              data-rotation="-4"
            >
              Easy
            </span>
            <span
              className="sticker-pop inline-block px-5 py-2 rounded-2xl bg-gradient-to-br from-[#FED7AA] via-[#FF7A00] to-[#EA580C] text-black font-extrabold text-2xl sm:text-4xl lg:text-5xl shadow-xl border-2 border-black rotate-6 -ml-5 mt-4 z-10 transform-gpu"
              data-rotation="6"
            >
              Easing
            </span>
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

          <span className="inline-flex flex-col items-start align-middle mx-4">
            <span
              className="sticker-pop inline-block px-7 py-3 rounded-3xl bg-[#00E83F] text-black font-extrabold text-4xl sm:text-6xl lg:text-[6.5rem] shadow-2xl border-2 border-black -rotate-6 z-20 transform-gpu"
              data-rotation="-6"
            >
              Super
            </span>
            <span
              className="sticker-pop inline-block px-7 py-3 rounded-3xl bg-[#F5A7E8] text-black font-extrabold text-4xl sm:text-6xl lg:text-[6.5rem] shadow-2xl border-2 border-black rotate-3 -mt-6 ml-4 z-10 transform-gpu"
              data-rotation="3"
            >
              Plug-and-play
            </span>
          </span>

          <div className="graphic-pop inline-block mx-6 align-middle">
            <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-24 md:h-24 overflow-visible">
              <defs>
                <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF7A00" />
                  <stop offset="100%" stopColor="#F5A7E8" />
                </linearGradient>
              </defs>
              <g filter="drop-shadow(0px 10px 20px rgba(255,122,0,0.5))">
                <path
                  d="M 50 0 L 57 33 L 85 15 L 67 43 L 100 50 L 67 57 L 85 85 L 57 67 L 50 100 L 43 67 L 15 85 L 33 57 L 0 50 L 33 43 L 15 15 L 43 33 Z"
                  fill="url(#starGrad)"
                />
              </g>
            </svg>
          </div>

          <span className="inline-block">eases, or build your own</span>

          <div className="graphic-pop inline-block mx-8 align-middle">
            <div className="p-5 rounded-3xl bg-[#141416]/90 border border-[#F4F1EA]/20 shadow-2xl backdrop-blur-xl">
              <svg viewBox="0 0 240 140" className="w-52 h-32 md:w-72 md:h-40 overflow-visible">
                <line ref={line2aRef} x1="20" y1="20" x2="20" y2="110" stroke="#00E83F" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
                <line ref={line2bRef} x1="220" y1="20" x2="220" y2="110" stroke="#00E83F" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
                <path
                  ref={easingCurve2Ref}
                  d="M 20 20 Q 120 110, 220 20"
                  fill="none"
                  stroke="#F4F1EA"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <rect x="11" y="11" width="18" height="18" fill="#00E83F" rx="4" />
                <rect x="211" y="11" width="18" height="18" fill="#00E83F" rx="4" />
                <circle ref={handle2aRef} cx="20" cy="110" r="8" fill="#00E83F" />
                <circle ref={handle2bRef} cx="220" cy="110" r="8" fill="#00E83F" />
              </svg>
            </div>
          </div>

          <span className="inline-block">custom virality curves.</span>

          <span className="inline-flex items-center mx-4 align-middle">
            <span
              className="sticker-pop inline-block px-7 py-3 rounded-3xl bg-[#10B981] text-black font-extrabold text-4xl sm:text-6xl lg:text-[6.5rem] shadow-2xl border-2 border-black -rotate-3 z-20 transform-gpu"
              data-rotation="-3"
            >
              100 AI Agents
            </span>
            <span
              className="sticker-pop inline-block px-7 py-3 rounded-3xl bg-[#FF7A00] text-black font-extrabold text-4xl sm:text-6xl lg:text-[6.5rem] shadow-2xl border-2 border-black rotate-4 -ml-8 z-10 transform-gpu"
              data-rotation="4"
            >
              Synthetic Swarm
            </span>
          </span>

          <span
            className="sticker-pop inline-block px-7 py-3 rounded-3xl bg-[#FFE500] text-black font-extrabold text-4xl sm:text-6xl lg:text-[6.5rem] shadow-2xl border-2 border-black -rotate-2 transform-gpu"
            data-rotation="-2"
          >
            in a snap
          </span>

          <span className="inline-block">before you publish.</span>
        </div>
      </div>
    </div>
  );
};
