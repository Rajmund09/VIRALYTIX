"use client";

import React, { useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import { gsap } from "./gsapPlugins";

export interface HeroHeadlineRef {
  getAssemblyTimeline: () => gsap.core.Timeline;
  getMainElement: () => HTMLDivElement | null;
}

const LINE_1 = "Predict";
const LINE_2 = "virality";

export const HeroHeadline = forwardRef<HeroHeadlineRef, {}>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const cBadgeRef = useRef<HTMLDivElement>(null);
  const aBadgeRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);

  // GSAP continuous stepped rotation, cursor parallax, and ScrollTrigger scroll scrub
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Top Pinwheel Badge: ONLY rhythmic 90-degree step ease-in-out rotation
      if (flowerRef.current) {
        const flowerSvg = flowerRef.current.querySelector("svg");
        if (flowerSvg) {
          const rotTl = gsap.timeline({ repeat: -1 });
          rotTl
            .to(flowerSvg, { rotation: "+=90", duration: 0.75, ease: "power3.inOut" }, "+=0.55")
            .to(flowerSvg, { rotation: "+=90", duration: 0.75, ease: "power3.inOut" }, "+=0.55")
            .to(flowerSvg, { rotation: "+=90", duration: 0.75, ease: "power3.inOut" }, "+=0.55")
            .to(flowerSvg, { rotation: "+=90", duration: 0.75, ease: "power3.inOut" }, "+=0.55");
        }
      }

      // 2. Bottom Helical Coil Ribbon: Smooth float & subtle cursor interaction
      if (ribbonRef.current) {
        gsap.to(ribbonRef.current, {
          y: 10,
          scaleY: 1.06,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        const xTo = gsap.quickTo(ribbonRef.current, "x", { duration: 0.6, ease: "power2.out" });
        const rotTo = gsap.quickTo(ribbonRef.current, "rotation", { duration: 0.7, ease: "power2.out" });

        const handleMouseMove = (e: MouseEvent) => {
          const normX = (e.clientX / window.innerWidth - 0.5) * 2;
          xTo(normX * 16);
          rotTo(normX * 9);
        };

        window.addEventListener("mousemove", handleMouseMove);
      }

      // 3. GSAP ScrollTrigger: "Predict" moves left & "virality" moves right on scroll (Starts at x=0 at top=0)
      if (line1Ref.current && line2Ref.current && containerRef.current) {
        const initialTop = containerRef.current.getBoundingClientRect().top;
        gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top ${initialTop}px`,
            end: "bottom top",
            scrub: 1,
          },
        })
          .to(line1Ref.current, { x: -160, ease: "none" }, 0)
          .to(line2Ref.current, { x: 160, ease: "none" }, 0);
      }

      // 4. Subtle Periodic Micro-Pulse for 'i' letters in "virality"
      const iChars = containerRef.current?.querySelectorAll<HTMLElement>(".headline-char-i");
      if (iChars && iChars.length > 0) {
        const iTl = gsap.timeline({ repeat: -1, repeatDelay: 3.5, delay: 2.8 });
        iTl
          .to(iChars, {
            y: -8,
            scale: 1.15,
            rotationZ: 6,
            duration: 0.5,
            stagger: 0.18,
            ease: "power2.out",
          })
          .to(iChars, {
            y: 0,
            scale: 1,
            rotationZ: 0,
            duration: 0.7,
            stagger: 0.18,
            ease: "elastic.out(1.2, 0.4)",
          });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useImperativeHandle(ref, () => ({
    getMainElement: () => containerRef.current,

    getAssemblyTimeline: () => {
      const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (!containerRef.current) return masterTl;

      const mainChars = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(".headline-char")
      );

      if (mainChars.length < 6) return masterTl;

      if (mainChars.length < 15) return masterTl;

      // LINE 1: "Predict" (Indices 0..6)
      const p1 = mainChars[0];   // 'P'
      const r1 = mainChars[1];   // 'r'
      const e1 = mainChars[2];   // 'e'
      const d1 = mainChars[3];   // 'd'
      const i1 = mainChars[4];   // 'i'
      const c1 = mainChars[5];   // 'c'
      const t1 = mainChars[6];   // 't'

      // LINE 2: "virality" (Indices 7..14)
      const v2 = mainChars[7];   // 'v'
      const i2a = mainChars[8];  // 'i' (first)
      const r2 = mainChars[9];   // 'r'
      const a2 = mainChars[10];  // 'a'
      const l2 = mainChars[11];  // 'l'
      const i2b = mainChars[12]; // 'i' (second)
      const t2 = mainChars[13];  // 't'
      const y2 = mainChars[14];  // 'y'

      const flower = flowerRef.current;  // Green Pinwheel Badge for Line 1 'r'
      const cBadge = cBadgeRef.current;  // Purple 8-Point Star Badge for Line 1 'c'

      // --- INITIAL STATES: LINE 1 ("Predict") ---
      // 1. 'P' (3D Frontflip)
      gsap.set(p1, {
        y: 25,
        opacity: 0,
        rotationX: -180,
        scale: 0.8,
        transformPerspective: 800,
        transformOrigin: "50% 50% -20px",
      });

      // 2. 'r' (3D Side Flip)
      gsap.set(r1, {
        x: 0,
        y: 10,
        opacity: 0,
        rotationY: 180,
        scale: 0.8,
        transformPerspective: 800,
        transformOrigin: "50% 50%",
      });

      // 3. Pinwheel Flower Badge
      if (flower) {
        gsap.set(flower, {
          x: -70,
          y: 45,
          opacity: 0,
          scale: 0.5,
          rotation: -45,
        });
      }

      // 4. 'e' (360° Clockwise Rotation from Top)
      gsap.set(e1, {
        y: -50,
        opacity: 0,
        rotation: -360,
        scale: 0.8,
      });

      // 5. 'd' (Appears from bottom)
      gsap.set(d1, {
        y: 55,
        opacity: 0,
        scale: 0.85,
      });

      // 6. 'i' (Appears from top)
      gsap.set(i1, {
        y: -45,
        opacity: 0,
        scale: 0.85,
      });

      // 7. 't' (3D Flip + Vibration setup)
      if (t1) {
        gsap.set(t1, {
          y: -30,
          opacity: 0,
          rotationY: 180,
          scale: 0.8,
          transformPerspective: 800,
          transformOrigin: "50% 50%",
        });
      }

      // 8. Temp Sharp Purple 8-Point Star Badge for 'c' (Completely hidden offscreen left)
      if (cBadge && c1) {
        const cLeft = c1.offsetLeft;
        const cTop = c1.offsetTop;
        const cWidth = c1.offsetWidth;
        const cHeight = c1.offsetHeight;

        gsap.set(cBadge, {
          left: cLeft + cWidth / 2,
          top: cTop + cHeight / 2,
          xPercent: -50,
          yPercent: -50,
          x: -(cLeft + 450),
          y: 0,
          opacity: 0,
          scale: 0.85,
          rotation: -360,
        });
      }

      // 9. 'c' (Appears from bottom to push star badge upward)
      gsap.set(c1, {
        y: 85,
        opacity: 0,
        scale: 0.88,
      });


      // 10. 'v' (3D Drop & Bounce)
      gsap.set(v2, {
        y: -50,
        opacity: 0,
        rotationX: 90,
        scale: 0.8,
        transformPerspective: 800,
        transformOrigin: "50% 50%",
      });

      // 11. 'i' (first) - Clean drop entry (Flip occurs after gap)
      gsap.set(i2a, {
        y: -40,
        opacity: 0,
        scale: 0.85,
        rotationX: 0,
        transformPerspective: 800,
        transformOrigin: "50% 50%",
      });

      // 13. 'r' (3D Side Flip)
      gsap.set(r2, {
        y: 10,
        opacity: 0,
        rotationY: -180,
        scale: 0.8,
        transformPerspective: 800,
        transformOrigin: "50% 50%",
      });

      // 14. Emerald Clover Badge for 'a' (Completely hidden offscreen top)
      const aBadge = aBadgeRef.current;
      if (aBadge && a2) {
        const aLeft = a2.offsetLeft;
        const aTop = a2.offsetTop;
        const aWidth = a2.offsetWidth;
        const aHeight = a2.offsetHeight;

        gsap.set(aBadge, {
          left: aLeft + aWidth / 2,
          top: aTop + aHeight / 2,
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: -400, // Offscreen top!
          opacity: 0,
          scale: 0.85,
          rotation: -180,
        });
      }

      // 15. 'a' (Rises from below to push aBadge upward)
      gsap.set(a2, {
        y: 80,
        opacity: 0,
        scale: 0.88,
      });

      // 16. 'l' (Tall Vertical Spring Stretch)
      gsap.set(l2, {
        y: -60,
        opacity: 0,
        scaleY: 2.2,
        scaleX: 0.8,
      });

      // 17. 'i' (second) - Clean rise entry (Flip occurs after gap)
      gsap.set(i2b, {
        y: 40,
        opacity: 0,
        scale: 0.85,
        rotationX: 0,
        transformPerspective: 800,
        transformOrigin: "50% 50%",
      });

      // 18. 't' (3D Flip)
      gsap.set(t2, {
        y: -35,
        opacity: 0,
        rotationX: 180,
        scale: 0.8,
        transformPerspective: 800,
        transformOrigin: "50% 50%",
      });

      // 19. 'y' (3D Frontflip)
      gsap.set(y2, {
        y: 40,
        opacity: 0,
        rotationX: -180,
        scale: 0.8,
        transformPerspective: 800,
        transformOrigin: "50% 50%",
      });


      // --- PARALLEL OVERLAPPING REPLACEMENT CHOREOGRAPHY ---

      // T = 0.00s: Line 1 'P' arrives
      masterTl.to(p1, { y: 0, opacity: 1, rotationX: 0, scale: 1, duration: 0.95, ease: "back.out(1.4)" }, 0);

      // T = 0.15s: Line 2 'v' 3D drop & bounce
      masterTl.to(v2, { y: 0, opacity: 1, rotationX: 0, scale: 1, duration: 0.85, ease: "back.out(1.4)" }, 0.15);


      // T = 0.40s: Line 1 'r' arrives with Flower Badge
      if (flower) {
        masterTl.to(flower, { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.9, ease: "power2.out" }, 0.40);
      }
      masterTl.to(r1, { y: 0, opacity: 1, rotationY: 0, scale: 1, duration: 0.85, ease: "back.out(1.5)" }, 0.45);

      // Line 2 'i' (first) - Clean arrival at t = 0.45s
      masterTl.to(i2a, { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: "back.out(1.4)" }, 0.45);
      // Line 2 'i' (first) - 3D Downward Flip after Gap at t = 1.20s
      masterTl.to(i2a, { rotationX: -360, duration: 0.85, ease: "back.out(1.6)" }, 1.20);


      // T = 0.65s: Line 1 'e' arrives
      masterTl.to(e1, { y: 0, opacity: 1, rotation: 0, scale: 1, duration: 0.85, ease: "back.out(1.4)" }, 0.68);

      // Line 2 'r' 3D Side Flip
      masterTl.to(r2, { y: 0, opacity: 1, rotationY: 0, scale: 1, duration: 0.85, ease: "back.out(1.5)" }, 0.65);


      // T = 0.70s: Line 2 'aBadge' (Emerald Clover) drops from offscreen top to 'a' position
      if (aBadge) {
        masterTl.to(aBadge, { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.65, ease: "power3.out" }, 0.70);
        masterTl.to(aBadge, { rotation: 180, scale: 1.05, duration: 1.0, ease: "none" }, 1.35);
      }


      // T = 0.92s: Line 1 'd', 'i', 't' ALL 3 ARRIVE
      masterTl.to(d1, { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: "power2.out" }, 0.92);
      masterTl.to(i1, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }, 0.92);
      if (t1) {
        masterTl.to(t1, { y: 0, opacity: 1, rotationY: 0, scale: 1, duration: 0.85, ease: "back.out(1.5)" }, 0.92);
        masterTl.to(t1, { x: "+=5", rotationZ: 6, duration: 0.05, yoyo: true, repeat: 5, ease: "sine.inOut" }, 1.70);
        masterTl.to(t1, { x: 0, rotationZ: 0, duration: 0.12, ease: "power2.out" }, 2.00);
      }


      // T = 1.15s: Line 1 'cBadge' (Purple 8-Point Star) slides in from offscreen left
      if (cBadge) {
        masterTl.to(cBadge, { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.65, ease: "power3.out" }, 1.15);
        masterTl.to(cBadge, { rotation: 180, scale: 1.05, duration: 1.0, ease: "none" }, 1.80);
      }

      // Line 2 'l' tall vertical spring stretch
      masterTl.to(l2, { y: 0, opacity: 1, scaleY: 1, scaleX: 1, duration: 0.90, ease: "elastic.out(1.2, 0.4)" }, 1.15);


      // Line 2 'i' (second) - Clean arrival at t = 1.40s
      masterTl.to(i2b, { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: "back.out(1.4)" }, 1.40);
      // Line 2 'i' (second) - 3D Upward Flip after Gap (Vice Versa!) at t = 2.15s
      masterTl.to(i2b, { rotationX: 360, duration: 0.85, ease: "back.out(1.6)" }, 2.15);


      // T = 1.65s: Line 2 't' 3D Flip
      if (t2) {
        masterTl.to(t2, { y: 0, opacity: 1, rotationX: 0, scale: 1, duration: 0.80, ease: "back.out(1.5)" }, 1.65);
        masterTl.to(t2, { x: "+=4", rotationZ: 5, duration: 0.05, yoyo: true, repeat: 4, ease: "sine.inOut" }, 2.30);
      }


      // T = 1.90s: Line 2 'y' 3D Frontflip
      masterTl.to(y2, { y: 0, opacity: 1, rotationX: 0, scale: 1, duration: 0.85, ease: "back.out(1.4)" }, 1.90);


      // REPLACEMENT PUSH 3 (t = 2.35s): Letter 'a2' rises from below AND PUSHES aBadge UP off top screen!
      if (aBadge) {
        masterTl.to(aBadge, { y: -400, opacity: 0, scale: 0.4, rotation: 360, duration: 0.75, ease: "power3.out" }, 2.35);
      }
      masterTl.to(a2, { y: 0, opacity: 1, scale: 1, duration: 0.70, ease: "back.out(1.3)" }, 2.35);


      // REPLACEMENT PUSH 4 (t = 2.80s): Letter 'c' rises from below AND PUSHES cBadge UP off top screen!
      if (cBadge) {
        masterTl.to(cBadge, { y: -400, opacity: 0, scale: 0.4, rotation: 360, duration: 0.75, ease: "power3.out" }, 2.80);
      }
      masterTl.to(c1, { y: 0, opacity: 1, scale: 1, duration: 0.70, ease: "back.out(1.3)" }, 2.80);

      return masterTl;
    },
  }));

  const renderSplitText = (text: string, isLine2 = false) => {
    return text.split("").map((char, charIdx) => {
      if (char === " ") {
        return (
          <span key={charIdx} className="inline-block w-[0.28em]">
            &nbsp;
          </span>
        );
      }
      const isI = isLine2 && char.toLowerCase() === "i";
      return (
        <span
          key={charIdx}
          className={`headline-char ${isI ? "headline-char-i" : ""} inline-block transform-gpu will-change-transform`}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className="hero-title relative mx-auto max-w-[88rem] w-full text-[20vw] sm:text-[16vw] lg:text-[14.5vw] font-bold tracking-tighter leading-[0.82] font-sans select-none space-y-1 py-4 text-[#FFFDE7]"
    >
      {/* LINE 1: "Predict" */}
      <div className="relative flex items-center justify-start w-full pl-6 sm:pl-10 lg:pl-16">
        <div ref={line1Ref} className="relative inline-block will-change-transform">
          {/* GSAP Reference Exact 4-Petal Pinwheel Emblem */}
          <div
            ref={flowerRef}
            className="absolute -top-[58%] left-[16%] z-20 pointer-events-none"
          >
            <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-22 sm:h-22 md:w-28 md:h-28 overflow-visible">
              <defs>
                <linearGradient id="gsapPinwheelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E555" />
                  <stop offset="40%" stopColor="#10B981" />
                  <stop offset="75%" stopColor="#A7F3D0" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>

                {/* Subtle Grain Noise Texture Filter */}
                <filter id="badgeTexture">
                  <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" result="noise" />
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.16 0" in="noise" result="coloredNoise" />
                  <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
                  <feBlend mode="multiply" in="SourceGraphic" in2="composite" />
                </filter>
              </defs>

              <g filter="url(#badgeTexture)">
                {/* Petal 1: Top-Left Blade */}
                <path d="M 50 50 L 5 50 L 5 5 A 45 45 0 0 1 50 50 Z" fill="url(#gsapPinwheelGrad)" />
                {/* Petal 2: Top-Right Blade */}
                <path d="M 50 50 L 50 5 L 95 5 A 45 45 0 0 1 50 50 Z" fill="url(#gsapPinwheelGrad)" />
                {/* Petal 3: Bottom-Right Blade */}
                <path d="M 50 50 L 95 50 L 95 95 A 45 45 0 0 1 50 50 Z" fill="url(#gsapPinwheelGrad)" />
                {/* Petal 4: Bottom-Left Blade */}
                <path d="M 50 50 L 50 95 L 5 95 A 45 45 0 0 1 50 50 Z" fill="url(#gsapPinwheelGrad)" />
              </g>
            </svg>
          </div>

          {/* Temporary Sharp Purple 8-Point Star Badge for 'c' Replacement Effect */}
          <div
            ref={cBadgeRef}
            className="absolute z-30 pointer-events-none opacity-0"
          >
            <svg viewBox="0 0 100 100" className="w-[0.62em] h-[0.62em] overflow-visible">
              <defs>
                <linearGradient id="purpleStarburstGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="20%" stopColor="#F3E8FF" />
                  <stop offset="50%" stopColor="#C084FC" />
                  <stop offset="80%" stopColor="#9333EA" />
                  <stop offset="100%" stopColor="#4C1D95" />
                </linearGradient>
              </defs>
              <g filter="url(#badgeTexture)">
                {/* Razor-Sharp 8-Point Spike Star Polygon */}
                <path
                  d="M 50 0 L 57 33 L 85 15 L 67 43 L 100 50 L 67 57 L 85 85 L 57 67 L 50 100 L 43 67 L 15 85 L 33 57 L 0 50 L 33 43 L 15 15 L 43 33 Z"
                  fill="url(#purpleStarburstGrad)"
                />
                {/* Inner Sharp White 8-Point Star Nucleus */}
                <path
                  d="M 50 16 L 54 37 L 74 26 L 62 43 L 84 50 L 62 57 L 74 74 L 54 63 L 50 84 L 46 63 L 26 74 L 38 57 L 16 50 L 38 43 L 26 26 L 46 37 Z"
                  fill="#FFFFFF"
                  opacity="0.95"
                />
                {/* Inner Core Accent */}
                <path
                  d="M 50 28 L 52 44 L 66 36 L 58 46 L 72 50 L 58 54 L 66 64 L 52 56 L 50 72 L 48 56 L 34 64 L 42 54 L 28 50 L 42 46 L 34 36 L 48 44 Z"
                  fill="#6B21A8"
                />
              </g>
            </svg>
          </div>

          <span className="headline-main relative z-10 block">
            {renderSplitText(LINE_1)}
          </span>
        </div>
      </div>

      {/* LINE 2: "virality" */}
      <div className="relative flex items-center justify-end w-full pr-6 sm:pr-10 lg:pr-16">
        <div ref={line2Ref} className="relative inline-block will-change-transform">
          {/* Animated 3D Helical Coil Ribbon (Placed elegantly below text z-0) */}
          <div
            ref={ribbonRef}
            className="absolute -bottom-[42%] left-[38%] pointer-events-none z-0"
          >
            <svg viewBox="-16 -10 102 140" className="w-14 h-22 sm:w-18 sm:h-30 md:w-24 md:h-40 overflow-visible">
              <defs>
                {/* Centric/Radial Purple to White Gradient */}
                <radialGradient id="purpleWhiteGrad" cx="50%" cy="50%" r="55%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#F3E8FF" />
                  <stop offset="70%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#6B21A8" />
                </radialGradient>

                {/* Grain Noise Texture Filter */}
                <filter id="ribbonTexture">
                  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.18 0" in="noise" result="coloredNoise" />
                  <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
                  <feBlend mode="multiply" in="SourceGraphic" in2="composite" />
                </filter>
              </defs>

              <g filter="url(#ribbonTexture)">
                {/* Bold Compact 3D Helical Coil Spring Path */}
                <path
                  d="M 35 6 C 68 18, 68 34, 35 40 C 2 46, 2 62, 35 68 C 68 74, 68 90, 35 96 C 2 102, 2 114, 35 118"
                  fill="none"
                  stroke="url(#purpleWhiteGrad)"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>

          {/* Temporary Emerald Clover Gem for 'a' in virality */}
          <div
            ref={aBadgeRef}
            className="absolute z-30 pointer-events-none opacity-0"
          >
            <svg viewBox="0 0 100 100" className="w-[0.54em] h-[0.54em] overflow-visible">
              <defs>
                <linearGradient id="emeraldCloverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="25%" stopColor="#A7F3D0" />
                  <stop offset="60%" stopColor="#10B981" />
                  <stop offset="85%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>
              <g filter="url(#badgeTexture)">
                <path d="M 50 50 L 5 50 L 5 5 A 45 45 0 0 1 50 50 Z" fill="url(#emeraldCloverGrad)" />
                <path d="M 50 50 L 50 5 L 95 5 A 45 45 0 0 1 50 50 Z" fill="url(#emeraldCloverGrad)" />
                <path d="M 50 50 L 95 50 L 95 95 A 45 45 0 0 1 50 50 Z" fill="url(#emeraldCloverGrad)" />
                <path d="M 50 50 L 50 95 L 5 95 A 45 45 0 0 1 50 50 Z" fill="url(#emeraldCloverGrad)" />
                <circle cx="50" cy="50" r="11" fill="#FFFFFF" opacity="0.9" />
              </g>
            </svg>
          </div>

          <span className="headline-main relative z-10 block">
            {renderSplitText(LINE_2, true)}
          </span>
        </div>
      </div>
    </div>
  );
});

HeroHeadline.displayName = "HeroHeadline";
