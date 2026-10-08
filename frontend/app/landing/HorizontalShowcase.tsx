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

  // References for Panel 1 Intro Animated Elements
  const domeRef = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const torusRef = useRef<HTMLDivElement>(null);
  const hourglassRef = useRef<HTMLDivElement>(null);
  const diamondRef = useRef<HTMLDivElement>(null);
  const pillContainerRef = useRef<HTMLDivElement>(null);
  const pinkPillRef = useRef<HTMLDivElement>(null);
  const orangePillRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const phrase1Ref = useRef<HTMLDivElement>(null);
  const phrase2Ref = useRef<HTMLSpanElement>(null);
  const phrase3Ref = useRef<HTMLDivElement>(null);
  const phrase4Ref = useRef<HTMLDivElement>(null);

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

        // 2. PANEL 1 HERO ENTRANCE: UNIQUE INDIVIDUAL ANIMATIONS FOR ALL ELEMENTS
        const introTl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        // a) Background Green Glowing Dome: Scales out & rises with 3D rotation
        if (domeRef.current) {
          introTl.fromTo(
            domeRef.current,
            { scale: 0.15, rotation: -15, y: 160, opacity: 0, transformOrigin: "bottom right" },
            { scale: 1, rotation: 0, y: 0, opacity: 1, duration: 1.25, ease: "power3.out" },
            0
          );
        }

        // b) 3D Pink Bloom Flower: Unfolds & spins into place sitting on top of dome
        if (flowerRef.current) {
          introTl.fromTo(
            flowerRef.current,
            { scale: 0, rotation: -210, opacity: 0, y: 70, transformOrigin: "center center" },
            { scale: 1, rotation: 0, opacity: 1, y: 0, duration: 1.1, ease: "back.out(2.2)" },
            0.15
          );
        }

        // c) 3D Cyan Torus Ring: Floats down with 3D spin & ring scale-out
        if (torusRef.current) {
          introTl.fromTo(
            torusRef.current,
            { scale: 0.2, rotation: 140, y: -90, opacity: 0, transformOrigin: "center center" },
            { scale: 1, rotation: 0, y: 0, opacity: 1, duration: 1.05, ease: "back.out(1.8)" },
            0.22
          );
        }

        // d) 3D Hourglass Prism: 3D Flip-in from left
        if (hourglassRef.current) {
          introTl.fromTo(
            hourglassRef.current,
            { scale: 0.25, rotationY: 180, x: -70, opacity: 0, transformOrigin: "center center" },
            { scale: 1, rotationY: 0, x: 0, opacity: 1, duration: 0.95, ease: "power2.out" },
            0.32
          );
        }

        // e) 3D Diamond Crystal Gem: Elastic pop-in & pulse rotate from top right
        if (diamondRef.current) {
          introTl.fromTo(
            diamondRef.current,
            { scale: 0, rotation: 90, y: -45, opacity: 0, transformOrigin: "center center" },
            { scale: 1, rotation: 0, y: 0, opacity: 1, duration: 0.9, ease: "elastic.out(1.1, 0.45)" },
            0.38
          );
        }

        // f) Top Pink Pill Bar ("Predict Virality"): COMPLETELY STATIC & STRAIGHT
        if (pinkPillRef.current) {
          gsap.set(pinkPillRef.current, { opacity: 1, y: 0, rotateX: 0, rotateZ: 0 });
        }

        // g) Bottom Orange Pill Bar ("That's right, Multimodal AI"): MULTI-CYCLE SMOOTH 3D PENDULUM SWING
        if (orangePillRef.current) {
          introTl.fromTo(
            orangePillRef.current,
            { rotateX: -60, rotateZ: 0, opacity: 0, transformOrigin: "center top" },
            {
              rotateX: 0,
              opacity: 1,
              duration: 2.6,
              ease: "elastic.out(1.8, 0.28)",
            },
            0.05
          );
        }

        // h) Editorial Subtitle Paragraph
        if (subtitleRef.current) {
          introTl.fromTo(
            subtitleRef.current,
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.85, ease: "power2.out" },
            0.45
          );
        }

        // 3. CHOREOGRAPHED PHYSICAL STICKER POP ENTRANCES (Track items with scroll scrubbing)
        const stickers = track.querySelectorAll(".sticker-pop:not(.intro-pill)");
        stickers.forEach((sticker) => {
          const targetRot = parseFloat(sticker.getAttribute("data-rotation") || "0");
          gsap.fromTo(
            sticker,
            { scale: 0.5, opacity: 0, rotation: targetRot - 15, y: 40 },
            {
              scale: 1,
              opacity: 1,
              rotation: targetRot,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sticker,
                containerAnimation: horizontalTween,
                start: "left 90%",
                end: "left 50%",
                scrub: 0.8,
              },
            }
          );
        });

        // 3.5. DECONSTRUCTED SENTENCE ANIMATION WITH SILKY SCROLL SCRUBBING & CAMERA WIGGLE
        if (phrase1Ref.current) {
          const letters = phrase1Ref.current.querySelectorAll(".deconstruct-letter");
          const yourWord = phrase1Ref.current.querySelector(".your-word");
          const videoWord = phrase1Ref.current.querySelector(".video-word");
          const cameraStickerWrapper = phrase1Ref.current.querySelector(".camera-sticker-wrapper");
          const cameraStickerImg = phrase1Ref.current.querySelector(".camera-sticker-img");
          const withWord = phrase1Ref.current.querySelector(".with-word");

          // Scoreboard Counter elements
          const digit3El = phrase1Ref.current.querySelector(".digit-3");
          const digit2El = phrase1Ref.current.querySelector(".digit-2");

          // Signals Word & Pink Arc Ribbon
          const signalsWord = phrase1Ref.current.querySelector(".signals-word");
          const pinkArcRibbon = phrase1Ref.current.querySelector(".pink-arc-ribbon");

          // Frame-by-frame parts
          const fPartFrame1 = phrase1Ref.current.querySelector(".f-part-frame1");
          const fPartHyphen1 = phrase1Ref.current.querySelector(".f-part-hyphen1");
          const fPartB = phrase1Ref.current.querySelector(".f-part-b");
          const fPartY = phrase1Ref.current.querySelector(".f-part-y");
          const fPartHyphen2 = phrase1Ref.current.querySelector(".f-part-hyphen2");
          const fPartFrame2 = phrase1Ref.current.querySelector(".f-part-frame2");
          const fPartComma = phrase1Ref.current.querySelector(".f-part-comma");

          const phraseTl = gsap.timeline({
            scrollTrigger: {
              trigger: phrase1Ref.current,
              containerAnimation: horizontalTween,
              start: "left 80%",
              end: "left -120%",
              scrub: 1.6,
            },
          });

          // a) Each letter of "Deconstruct" appears alternating from TOP (up) and BOTTOM (down) at a smooth scroll pace
          if (letters.length) {
            letters.forEach((letterEl, idx) => {
              const isEven = idx % 2 === 0;
              const startY = isEven ? -40 : 40;
              const startRot = isEven ? -16 : 16;

              phraseTl.fromTo(
                letterEl,
                { opacity: 0, scale: 0.3, y: startY, rotation: startRot },
                {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  rotation: 0,
                  duration: 0.95,
                  ease: "power2.out",
                },
                idx * 0.12
              );
            });
          }

          // b) Word "your" appears with a smooth 3D tilt-up transition
          if (yourWord) {
            phraseTl.fromTo(
              yourWord,
              { opacity: 0, scale: 0.45, rotationX: -60, y: 35, transformOrigin: "center bottom" },
              { opacity: 1, scale: 1, rotationX: 0, y: 0, duration: 1.1, ease: "power2.out" },
              "+=0.08"
            );
          }

          // c) Word "video" appears with a smooth scale-up & rotation transition
          if (videoWord) {
            phraseTl.fromTo(
              videoWord,
              { opacity: 0, scale: 0.45, rotationY: -45, y: -20, transformOrigin: "center center" },
              { opacity: 1, scale: 1, rotationY: 0, y: 0, duration: 1.1, ease: "power2.out" },
              "+=0.08"
            );
          }

          // d) Camera Sticker appears smoothly via scroll scrub
          if (cameraStickerWrapper) {
            phraseTl.fromTo(
              cameraStickerWrapper,
              {
                opacity: 0,
                scale: 0.2,
                y: 45,
                rotation: -18,
                transformOrigin: "center bottom",
              },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                rotation: 0,
                duration: 1.25,
                ease: "power2.out",
              },
              "-=0.7"
            );
          }

          // e) Word "with" appears with smooth twist & float transition
          if (withWord) {
            phraseTl.fromTo(
              withWord,
              { opacity: 0, scale: 0.45, rotation: 16, y: 30 },
              { opacity: 1, scale: 1, rotation: 0, y: 0, duration: 1.0, ease: "power2.out" },
              "+=0.08"
            );
          }

          // f) "32" Mechanical Odometer Roll at Fixed Position (3 rolls UP on axis, 2 rolls DOWN on axis)
          const d3Seq = ["0", "1", "2", "3"];
          const d2Seq = ["8", "9", "0", "1", "2"];

          if (digit3El) {
            phraseTl.fromTo(
              digit3El,
              { opacity: 0, rotateX: -70, transformOrigin: "50% 50%" },
              {
                opacity: 1,
                rotateX: 0,
                duration: 2.0,
                ease: "none",
                onUpdate: function () {
                  const p = this.progress();
                  const idx = Math.min(d3Seq.length - 1, Math.floor(p * d3Seq.length));
                  if (digit3El) digit3El.textContent = d3Seq[idx];
                },
                onComplete: () => {
                  if (digit3El) digit3El.textContent = "3";
                },
              },
              "+=0.08"
            );
          }

          if (digit2El) {
            phraseTl.fromTo(
              digit2El,
              { opacity: 0, rotateX: 70, transformOrigin: "50% 50%" },
              {
                opacity: 1,
                rotateX: 0,
                duration: 2.0,
                ease: "none",
                onUpdate: function () {
                  const p = this.progress();
                  const idx = Math.min(d2Seq.length - 1, Math.floor(p * d2Seq.length));
                  if (digit2El) digit2El.textContent = d2Seq[idx];
                },
                onComplete: () => {
                  if (digit2El) digit2El.textContent = "2";
                },
              },
              "<"
            );
          }

          // Guaranteed resolution trigger when scrolled past
          ScrollTrigger.create({
            trigger: phrase1Ref.current,
            containerAnimation: horizontalTween,
            start: "left 60%",
            onEnter: () => {
              if (digit3El) digit3El.textContent = "3";
              if (digit2El) digit2El.textContent = "2";
            },
          });

          // g) "Signals" Word: HIGH-IMPACT PHYSICAL STOMP EFFECT
          if (signalsWord) {
            phraseTl
              .fromTo(
                signalsWord,
                { opacity: 0, y: -100, scale: 2.2, rotateX: 35 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotateX: 0,
                  duration: 0.7,
                  ease: "power4.in",
                },
                "+=0.1"
              )
              .to(signalsWord, {
                scaleY: 0.78,
                scaleX: 1.18,
                duration: 0.15,
                ease: "power1.out",
              })
              .to(signalsWord, {
                scaleY: 1.0,
                scaleX: 1.0,
                duration: 0.35,
                ease: "elastic.out(1.8, 0.3)",
              });
          }

          // g.2) Pink Curved Half-Ring Arc Ribbon: Ultra-smooth, slow 3D flip with gentle deceleration
          if (pinkArcRibbon) {
            phraseTl.fromTo(
              pinkArcRibbon,
              {
                opacity: 0,
                scale: 0.35,
                rotateX: -85,
                rotateZ: -140,
                y: 40,
                transformOrigin: "50% 50%",
              },
              {
                opacity: 1,
                scale: 1,
                rotateX: 0,
                rotateZ: 0,
                y: 0,
                duration: 1.5,
                ease: "power3.out",
              },
              "-=0.15"
            );
          }

          // h) "frame-by-frame," Sequential PURE Smooth Slide emerging from behind previous left text
          if (fPartFrame1) {
            phraseTl.fromTo(
              fPartFrame1,
              { opacity: 0, x: -60 },
              { opacity: 1, x: 0, duration: 0.9, ease: "power2.out" },
              "+=0.1"
            );
          }
          if (fPartHyphen1) {
            phraseTl.fromTo(
              fPartHyphen1,
              { opacity: 0, x: -30 },
              { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
              "+=0.04"
            );
          }
          if (fPartB) {
            phraseTl.fromTo(
              fPartB,
              { opacity: 0, x: -25 },
              { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
              "+=0.04"
            );
          }
          if (fPartY) {
            phraseTl.fromTo(
              fPartY,
              { opacity: 0, x: -25 },
              { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
              "+=0.04"
            );
          }
          if (fPartHyphen2) {
            phraseTl.fromTo(
              fPartHyphen2,
              { opacity: 0, x: -30 },
              { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
              "+=0.04"
            );
          }
          if (fPartFrame2) {
            phraseTl.fromTo(
              fPartFrame2,
              { opacity: 0, x: -60 },
              { opacity: 1, x: 0, duration: 0.9, ease: "power2.out" },
              "+=0.08"
            );
          }
          if (fPartComma) {
            phraseTl.fromTo(
              fPartComma,
              { opacity: 0, x: -15 },
              { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
              "+=0.04"
            );
          }

          // i) INFINITE PERIODIC WIGGLE ON CAMERA STICKER (fires every 2.8 seconds independently)
          if (cameraStickerImg) {
            const wiggleTl = gsap.timeline({ repeat: -1, repeatDelay: 2.8 });
            wiggleTl
              .to(cameraStickerImg, { rotation: -14, scale: 1.08, duration: 0.14, ease: "power1.out" })
              .to(cameraStickerImg, { rotation: 12, scale: 1.08, duration: 0.14, ease: "power1.inOut" })
              .to(cameraStickerImg, { rotation: -8, scale: 1.04, duration: 0.12, ease: "power1.inOut" })
              .to(cameraStickerImg, { rotation: 5, scale: 1.02, duration: 0.12, ease: "power1.inOut" })
              .to(cameraStickerImg, { rotation: 0, scale: 1, duration: 0.24, ease: "elastic.out(1.2, 0.4)" });
          }
        }

        // 3.6. "parsing optical motion," - KINETIC SCAN, LENS EXPANSION, INERTIA STREAM & FLOATING GLIDER
        if (phrase2Ref.current) {
          const parsingLetters = phrase2Ref.current.querySelectorAll(".parsing-letter");
          const opticalLetters = phrase2Ref.current.querySelectorAll(".optical-letter");
          const motionWord = phrase2Ref.current.querySelector(".motion-word");
          const orbitGlider = phrase2Ref.current.querySelector(".orbit-glider");
          const orbitSpinner = phrase2Ref.current.querySelector(".orbit-spinner");

          const phrase2Tl = gsap.timeline({
            scrollTrigger: {
              trigger: phrase2Ref.current,
              containerAnimation: horizontalTween,
              start: "left 82%",
              end: "left -45%",
              scrub: 1.2,
            },
          });

          // a) "parsing": Letter-by-letter kinetic wave reveal from bottom with subtle tilt
          if (parsingLetters.length) {
            parsingLetters.forEach((letterEl, idx) => {
              phrase2Tl.fromTo(
                letterEl,
                { opacity: 0, y: 35, rotateZ: 8, scale: 0.6 },
                {
                  opacity: 1,
                  y: 0,
                  rotateZ: 0,
                  scale: 1,
                  duration: 0.75,
                  ease: "power2.out",
                },
                idx * 0.07
              );
            });
          }

          // b) "optical": Letter-by-letter full 3D backward/flip-up reveal
          if (opticalLetters.length) {
            opticalLetters.forEach((letterEl, idx) => {
              phrase2Tl.fromTo(
                letterEl,
                { opacity: 0, rotateX: -180, y: 28, scale: 0.5 },
                {
                  opacity: 1,
                  rotateX: 0,
                  y: 0,
                  scale: 1,
                  duration: 0.85,
                  ease: "back.out(1.8)",
                },
                0.55 + idx * 0.07
              );
            });
          }

          // c) "motion,": Smooth, natural drop from top (appears right as optical settles)
          if (motionWord) {
            phrase2Tl.fromTo(
              motionWord,
              {
                opacity: 0,
                y: -40,
                scale: 0.9,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.85,
                ease: "power2.out",
              },
              1.15
            );
          }

          // d) Floating Glider element: Pop-up below 'p' & glides smoothly across to letter 'n' of "motion"
          if (orbitGlider) {
            phrase2Tl.fromTo(
              orbitGlider,
              { opacity: 0, scale: 0 },
              { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(2.0)" },
              0
            );

            // Glides continuously from parsing -> optical -> motion
            phrase2Tl.to(
              orbitGlider,
              {
                x: () => {
                  if (motionWord instanceof HTMLElement) {
                    return motionWord.offsetLeft + motionWord.offsetWidth * 0.72;
                  }
                  return 480;
                },
                duration: 1.8,
                ease: "power1.inOut",
              },
              0.25
            );
          }

          // Infinite ease-in-out 360 rotation on glider spinner (speeds up & slows down rhythmically)
          if (orbitSpinner) {
            gsap.to(orbitSpinner, {
              rotation: 360,
              duration: 1.5,
              repeat: -1,
              ease: "power2.inOut",
            });
          }
        }

        // 3.7. "Audio RMS", "&" (STATIC BIG), and "Whisper Cadence" (DIAMOND EDGE-ATTACHED ROTOR)
        if (phrase3Ref.current) {
          const audioRmsPill = phrase3Ref.current.querySelector(".audio-rms-pill");
          const rotorHub = phrase3Ref.current.querySelector(".diamond-rotor-hub");
          const diamondPlate = phrase3Ref.current.querySelector(".diamond-plate");
          const whisperAssembly = phrase3Ref.current.querySelector(".whisper-rotor-assembly");
          const stick1 = phrase3Ref.current.querySelector(".whisper-stick-1");
          const stick2 = phrase3Ref.current.querySelector(".whisper-stick-2");

          const phrase3Tl = gsap.timeline({
            scrollTrigger: {
              trigger: phrase3Ref.current,
              containerAnimation: horizontalTween,
              start: "left 85%",
              end: "left 30%",
              scrub: 1.2,
            },
          });

          // a) Audio RMS: Top sweep drop-in (straight & clean)
          if (audioRmsPill) {
            phrase3Tl.fromTo(
              audioRmsPill,
              { opacity: 0, y: -70, scale: 0.85 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.85,
                ease: "power3.out",
              },
              0
            );
          }

          // b) Diamond Rotor Hub: Entrance with half-rotation
          if (rotorHub && diamondPlate) {
            phrase3Tl.fromTo(
              rotorHub,
              { opacity: 0, scale: 0.2 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.85,
                ease: "power2.out",
              },
              "+=0.08"
            );

            phrase3Tl.fromTo(
              diamondPlate,
              { rotate: -135 },
              {
                rotate: 45,
                duration: 0.95,
                ease: "power2.out",
              },
              "<"
            );
          }

          // c) Whisper Cadence: Entrance in sync with diamond
          if (whisperAssembly) {
            phrase3Tl.fromTo(
              whisperAssembly,
              { opacity: 0, x: -30 },
              {
                opacity: 1,
                x: 0,
                duration: 0.85,
                ease: "power2.out",
              },
              "<+=0.04"
            );
          }

          // d) Synchronized In-Sync Mechanical Rotor: Diamond turns & attached text sticks swing along edges
          if (diamondPlate && stick1 && stick2) {
            gsap.set(diamondPlate, { transformOrigin: "50% 50%" });
            gsap.set([stick1, stick2], { transformOrigin: "0% 50%", transformPerspective: 800 });
            gsap.set(stick1, { rotateZ: 0, rotateX: 0, opacity: 1, y: 0 });
            gsap.set(stick2, { rotateZ: -45, rotateX: -8, opacity: 0, y: -25 });

            const cycleTl = gsap.timeline({ repeat: -1 });

            cycleTl
              // Phase 1: Diamond rotates +90, stick1 swings down along edge, stick2 swings into place
              .to(diamondPlate, {
                rotate: "+=90",
                duration: 0.85,
                ease: "power2.inOut",
              })
              .to(
                stick1,
                {
                  rotateZ: 45,
                  rotateX: 8,
                  opacity: 0,
                  y: 30,
                  duration: 0.85,
                  ease: "power2.inOut",
                },
                "<"
              )
              .to(
                stick2,
                {
                  rotateZ: 0,
                  rotateX: 0,
                  opacity: 1,
                  y: 0,
                  duration: 0.85,
                  ease: "power2.inOut",
                },
                "<"
              )
              // Hold crisp reading pose
              .to({}, { duration: 0.9 })
              // Reset stick1 to top incoming position
              .set(stick1, { rotateZ: -45, rotateX: -8, opacity: 0, y: -25 })
              // Phase 2: Diamond rotates +90, stick2 swings down along edge, stick1 swings into place
              .to(diamondPlate, {
                rotate: "+=90",
                duration: 0.85,
                ease: "power2.inOut",
              })
              .to(
                stick2,
                {
                  rotateZ: 45,
                  rotateX: 8,
                  opacity: 0,
                  y: 30,
                  duration: 0.85,
                  ease: "power2.inOut",
                },
                "<"
              )
              .to(
                stick1,
                {
                  rotateZ: 0,
                  rotateX: 0,
                  opacity: 1,
                  y: 0,
                  duration: 0.85,
                  ease: "power2.inOut",
                },
                "<"
              )
              // Hold crisp reading pose
              .to({}, { duration: 0.9 })
              // Reset stick2 to top incoming position
              .set(stick2, { rotateZ: -45, rotateX: -8, opacity: 0, y: -25 });
          }
        }

        // 3.8. "Nice and", "Easy", and "Easing" - SEQUENTIAL STAGGERED ENTRANCES
        if (phrase4Ref.current) {
          const niceAndPill = phrase4Ref.current.querySelector(".nice-and-pill");
          const easyPill = phrase4Ref.current.querySelector(".easy-pill");
          const easingPill = phrase4Ref.current.querySelector(".easing-pill");

          const phrase4Tl = gsap.timeline({
            scrollTrigger: {
              trigger: phrase4Ref.current,
              containerAnimation: horizontalTween,
              start: "left 85%",
              end: "left 20%",
              scrub: 1.2,
            },
          });

          // 1. "Nice and": Drops from top FIRST
          if (niceAndPill) {
            phrase4Tl.fromTo(
              niceAndPill,
              { opacity: 0, y: -100 },
              {
                opacity: 1,
                y: 0,
                duration: 0.85,
                ease: "power2.out",
              },
              0
            );
          }

          // 2. "Easy": Drops from top SECOND (after Nice and has landed)
          if (easyPill) {
            phrase4Tl.fromTo(
              easyPill,
              { opacity: 0, y: -100 },
              {
                opacity: 1,
                y: 0,
                duration: 0.85,
                ease: "power2.out",
              },
              "+=0.12"
            );
          }

          // 3. "Easing": Appears LAST from top with half-rotation and subtle slow bounce
          if (easingPill) {
            phrase4Tl.fromTo(
              easingPill,
              {
                opacity: 0,
                y: -110,
                rotation: -164,
                transformOrigin: "center center",
              },
              {
                opacity: 1,
                y: 0,
                rotation: 16,
                duration: 1.2,
                ease: "back.out(1.4)",
              },
              "+=0.12"
            );
          }
        }

        // 5. ANIMATED SVG BEZIER EASING CURVE 1 MORPH
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

        // 6. ANIMATED SVG BEZIER EASING CURVE 2 MORPH
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
      {/* Subtle Ambient Background Gradient Lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/3 left-1/4 w-[50rem] h-[28rem] bg-[#00E83F]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[50rem] h-[28rem] bg-[#F5A7E8]/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(244,241,234,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      {/* ── CONTINUOUS EDITORIAL KINETIC MOTION TRACK ── */}
      <div
        ref={trackRef}
        className="flex h-full items-center whitespace-nowrap will-change-transform relative z-10"
      >
        {/* ━━ PANEL 1: EDITORIAL COVER & 3D ART COMPOSITION ━━ */}
        <div className="w-[100vw] shrink-0 h-full flex items-center justify-between px-8 sm:px-16 md:px-24 relative overflow-hidden">
          {/* LEFT COLUMN: STACKED STICKERS & EDITORIAL SUBTITLE */}
          <div className="flex flex-col items-start gap-8 max-w-xl z-20">
            {/* STACKED STICKER BANNER CONTAINER WITH 3D PERSPECTIVE */}
            <div
              className="relative inline-flex flex-col items-start pt-2 pb-4 select-none [perspective:1000px]"
            >
              {/* TOP PINK PILL (COMPLETELY STATIC & STRAIGHT, 12PX TRANSPARENT BLACK BORDER) */}
              <div
                ref={pinkPillRef}
                className="intro-pill relative z-20 px-5 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-[#F7A8E5] bg-clip-padding text-black font-bold text-lg sm:text-2xl lg:text-3xl tracking-tight border-[12px] border-black/35 transform-gpu"
              >
                Predict Virality
              </div>

              {/* BOTTOM ORANGE PILL (3D FRONT & BACK HINGED SWING, STRAIGHT) */}
              <div
                ref={orangePillRef}
                className="intro-pill relative z-10 -mt-3.5 ml-7 sm:ml-9 px-6 py-2 sm:px-7 sm:py-2.5 rounded-xl bg-[#FF7A00] text-black font-bold text-lg sm:text-2xl lg:text-3xl tracking-tight border-[3px] border-black transform-gpu origin-top [transform-style:preserve-3d] [backface-visibility:hidden] will-change-transform"
              >
                <span>That&apos;s right, Multimodal AI</span>
              </div>
            </div>

            {/* EDITORIAL SUBTITLE PARAGRAPH */}
            <p
              ref={subtitleRef}
              className="text-lg sm:text-xl lg:text-2xl text-[#F4F1EA]/85 font-normal leading-relaxed tracking-tight max-w-lg whitespace-normal"
            >
              Whether you&apos;re analyzing optical motion, audio cadence, or predicting high-impact viral moments, VIRALYTIX has your back.
            </p>

            {/* INTRO BADGE & SCROLL HINT */}
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#00E83F]/10 border border-[#00E83F]/30 backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E83F] animate-ping" />
                <span className="text-xs sm:text-sm font-mono text-[#00E83F] font-extrabold uppercase tracking-widest">
                  03-05 // KINETIC REEL
                </span>
              </div>
              <span className="text-xs font-mono text-[#F4F1EA]/50 uppercase tracking-widest animate-pulse">
                Scroll to explore →
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D ARTWORKS COMPOSITION (Refined Proportions & Individual Animations) */}
          <div className="relative w-[320px] sm:w-[420px] md:w-[500px] lg:w-[560px] h-[380px] sm:h-[460px] md:h-[500px] flex items-center justify-center shrink-0 mr-4 sm:mr-10 lg:mr-16">
            {/* 1. 3D CYAN TORUS RING (Top Left) */}
            <div ref={torusRef} className="intro-graphic absolute top-2 left-6 z-20">
              <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-26 sm:h-26 lg:w-32 lg:h-32 overflow-visible">
                <defs>
                  <linearGradient id="introTorusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00F0FF" />
                    <stop offset="50%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#F5A7E8" />
                  </linearGradient>
                </defs>
                <g filter="drop-shadow(0px 10px 24px rgba(0,240,255,0.45))">
                  <circle cx="50" cy="50" r="36" fill="none" stroke="url(#introTorusGrad)" strokeWidth="18" />
                </g>
              </svg>
            </div>

            {/* 2. 3D HOURGLASS PRISM (Mid Left) */}
            <div ref={hourglassRef} className="intro-graphic absolute bottom-24 left-10 sm:left-14 z-20">
              <svg viewBox="0 0 80 100" className="w-14 h-14 sm:w-18 sm:h-18 lg:w-22 lg:h-22 overflow-visible">
                <defs>
                  <linearGradient id="hourglassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E9D5FF" />
                    <stop offset="50%" stopColor="#C084FC" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <g filter="drop-shadow(0px 8px 20px rgba(192,132,252,0.5))">
                  <path d="M 10 10 L 70 10 L 40 50 L 70 90 L 10 90 L 40 50 Z" fill="url(#hourglassGrad)" stroke="#070706" strokeWidth="2.5" strokeLinejoin="round" />
                </g>
              </svg>
            </div>

            {/* 3. 3D GLOWING DIAMOND GEM (Top Right) */}
            <div ref={diamondRef} className="intro-graphic absolute top-10 right-6 sm:right-10 z-20">
              <svg viewBox="0 0 60 60" className="w-10 h-10 sm:w-14 sm:h-14 lg:w-18 lg:h-18 overflow-visible">
                <defs>
                  <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FED7AA" />
                    <stop offset="50%" stopColor="#FF7A00" />
                    <stop offset="100%" stopColor="#EA580C" />
                  </linearGradient>
                </defs>
                <g filter="drop-shadow(0px 8px 20px rgba(255,122,0,0.55))">
                  <polygon points="30,5 55,30 30,55 5,30" fill="url(#diamondGrad)" stroke="#070706" strokeWidth="2" />
                </g>
              </svg>
            </div>

            {/* 4. 3D PINK 4-PETAL FLOWER BLOOM (Center resting on Dome) */}
            <div ref={flowerRef} className="intro-graphic absolute bottom-24 sm:bottom-32 right-14 sm:right-20 z-30">
              <svg viewBox="0 0 120 120" className="w-28 h-28 sm:w-44 sm:h-44 lg:w-52 lg:h-52 overflow-visible">
                <defs>
                  <linearGradient id="flowerGradIntro" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF0FA" />
                    <stop offset="35%" stopColor="#F5A7E8" />
                    <stop offset="75%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#9333EA" />
                  </linearGradient>
                </defs>
                <g filter="drop-shadow(0px 16px 32px rgba(245,167,232,0.55))">
                  <path
                    d="M 60 60 C 40 25, 10 10, 60 5 C 110 10, 80 25, 60 60 C 95 40, 110 10, 115 60 C 110 110, 95 80, 60 60 C 80 95, 110 110, 60 115 C 10 110, 40 95, 60 60 C 25 80, 10 110, 5 60 C 10 10, 25 40, 60 60 Z"
                    fill="url(#flowerGradIntro)"
                  />
                </g>
              </svg>
            </div>

            {/* 5. GIANT VIBRANT GREEN GLOWING DOME BASE (Bottom Right) */}
            <div ref={domeRef} className="absolute bottom-0 right-0 w-[220px] sm:w-[320px] md:w-[390px] lg:w-[440px] h-[140px] sm:h-[195px] md:h-[240px] lg:h-[270px] z-10 overflow-hidden rounded-t-full">
              <div className="w-full h-full bg-gradient-to-t from-[#00E83F] via-[#10B981] to-[#00E555] shadow-[0_0_100px_rgba(0,232,63,0.7)]" />
            </div>
          </div>
        </div>

        {/* ━━ PANEL 2: CONTINUOUS KINETIC TYPOGRAPHY SENTENCE ━━ */}
        <div className="flex items-center gap-6 md:gap-10 text-5xl sm:text-7xl lg:text-[7rem] font-medium tracking-tight leading-none text-[#F4F1EA] pl-2 sm:pl-4 pr-24">
          {/* PHRASE 1 WITH LETTER DECONSTRUCTION & CAMERA STICKER PNG */}
          <div ref={phrase1Ref} className="inline-flex items-center gap-[0.48em] shrink-0">
            {/* DECONSTRUCT: LETTER BY LETTER SPANS */}
            <span className="inline-flex overflow-hidden">
              {"Deconstruct".split("").map((letter, idx) => (
                <span
                  key={idx}
                  className="deconstruct-letter inline-block transform-gpu origin-bottom opacity-0"
                >
                  {letter}
                </span>
              ))}
            </span>

            {/* YOUR: APPEARS ALL AT ONCE */}
            <span className="your-word inline-block transform-gpu opacity-0">
              your
            </span>

            {/* VIDEO: APPEARS WITH USER'S EXACT CAMERA STICKER PNG FLOATING ABOVE */}
            <span className="relative inline-block my-auto">
              {/* USER'S EXACT CAMERA STICKER PNG FLOATING ABOVE THE WORD "video" */}
              <div className="camera-sticker-wrapper absolute -top-16 sm:-top-24 lg:-top-28 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-0">
                <img
                  src="/image.png"
                  alt="Camera Sticker"
                  className="camera-sticker-img w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain transform-gpu drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                />
              </div>
              <span className="video-word inline-block transform-gpu opacity-0">
                video
              </span>
            </span>

            {/* WITH: APPEARS LAST */}
            <span className="with-word inline-block transform-gpu opacity-0">
              with
            </span>

            {/* 32: MECHANICAL SCOREBOARD / SPEEDOMETER ODOMETER ROLLER */}
            <span className="scoreboard-32 inline-flex items-baseline font-bold text-[#00E83F] select-none [perspective:800px] align-baseline">
              {/* DIGIT 3: ROLLS UP ON AXIS (0 -> 1 -> 2 -> 3) */}
              <span className="digit-3 inline-block transform-gpu opacity-0 will-change-transform origin-center">
                3
              </span>
              {/* DIGIT 2: ROLLS DOWN ON AXIS (8 -> 9 -> 0 -> 1 -> 2) */}
              <span className="digit-2 inline-block transform-gpu opacity-0 will-change-transform origin-center ml-[0.02em]">
                2
              </span>
            </span>

            {/* SIGNALS: HIGH-IMPACT PHYSICAL STOMP EFFECT */}
            <span className="signals-word relative inline-block font-black text-[#00E83F] transform-gpu opacity-0 select-none origin-bottom [transform-style:preserve-3d]">
              Signals
              {/* PINK CURVED HALF-RING ARC RIBBON (Between last 's' of Signals and first 'f' of frame) */}
              <div className="pink-arc-ribbon absolute -bottom-36 sm:-bottom-52 lg:-bottom-64 -right-14 sm:-right-20 lg:-right-28 w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52 pointer-events-none opacity-0 transform-gpu select-none z-20 [perspective:1000px] [transform-style:preserve-3d]">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="pinkArcRibbonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FBCFE8" />
                      <stop offset="30%" stopColor="#F472B6" />
                      <stop offset="65%" stopColor="#E1147D" />
                      <stop offset="100%" stopColor="#D9166E" />
                    </linearGradient>
                  </defs>
                  <g filter="drop-shadow(0px 16px 30px rgba(225,20,125,0.7))">
                    <path
                      d="M 18 56 A 38 38 0 0 0 84 20"
                      fill="none"
                      stroke="url(#pinkArcRibbonGrad)"
                      strokeWidth="24"
                      strokeLinecap="butt"
                    />
                  </g>
                </svg>
              </div>
            </span>

            {/* FRAME-BY-FRAME: SEQUENTIAL SPAN-IN (frame -> hyphen -> b -> y -> hyphen -> frame -> comma) */}
            <span className="frame-phrase inline-flex items-baseline text-[#F5A7E8] font-bold select-none">
              <span className="f-part-frame1 inline-block transform-gpu opacity-0">
                frame
              </span>
              <span className="f-part-hyphen1 inline-block transform-gpu opacity-0 mx-[0.04em]">
                -
              </span>
              <span className="f-part-b inline-block transform-gpu opacity-0">
                b
              </span>
              <span className="f-part-y inline-block transform-gpu opacity-0">
                y
              </span>
              <span className="f-part-hyphen2 inline-block transform-gpu opacity-0 mx-[0.04em]">
                -
              </span>
              <span className="f-part-frame2 inline-block transform-gpu opacity-0">
                frame
              </span>
              <span className="f-part-comma inline-block transform-gpu opacity-0">
                ,
              </span>
            </span>
          </div>

          {/* PHRASE 2: PARSING OPTICAL MOTION */}
          <span ref={phrase2Ref} className="phrase-2 relative inline-flex items-center gap-[0.38em] shrink-0">
            {/* FLOATING DECORATIVE GLIDER ELEMENT BELOW PARSING -> GLIDES TO MOTION */}
            <div className="orbit-glider absolute -bottom-20 sm:-bottom-24 lg:-bottom-28 left-0 z-20 pointer-events-none opacity-0 select-none">
              <div className="orbit-spinner w-13 h-13 sm:w-16 sm:h-16 lg:w-20 lg:h-20 transform-gpu">
                <svg viewBox="0 0 90 90" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="cyanTileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E0F7FA" />
                      <stop offset="35%" stopColor="#A5F3FC" />
                      <stop offset="70%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#0EA5E9" />
                    </linearGradient>
                  </defs>
                  <g filter="drop-shadow(0px 8px 22px rgba(56,189,248,0.65))">
                    {/* Top-Left */}
                    <rect x="0" y="0" width="30" height="30" rx="4" fill="url(#cyanTileGrad)" />
                    {/* Top-Right */}
                    <rect x="60" y="0" width="30" height="30" rx="4" fill="url(#cyanTileGrad)" />
                    {/* Center */}
                    <rect x="30" y="30" width="30" height="30" rx="4" fill="url(#cyanTileGrad)" />
                    {/* Bottom-Left */}
                    <rect x="0" y="60" width="30" height="30" rx="4" fill="url(#cyanTileGrad)" />
                    {/* Bottom-Right */}
                    <rect x="60" y="60" width="30" height="30" rx="4" fill="url(#cyanTileGrad)" />
                  </g>
                </svg>
              </div>
            </div>

            {/* PARSING: Letter-by-letter kinetic wave reveal */}
            <span className="parsing-word inline-flex overflow-hidden">
              {"parsing".split("").map((letter, idx) => (
                <span
                  key={idx}
                  className="parsing-letter inline-block transform-gpu origin-bottom opacity-0"
                >
                  {letter}
                </span>
              ))}
            </span>

            {/* OPTICAL: Letter-by-letter full 3D flip-up reveal */}
            <span className="optical-word inline-flex font-bold text-[#67E8F9] [perspective:900px] select-none">
              {"optical".split("").map((letter, idx) => (
                <span
                  key={idx}
                  className="optical-letter inline-block transform-gpu origin-center opacity-0 [transform-style:preserve-3d] will-change-transform"
                >
                  {letter}
                </span>
              ))}
            </span>

            {/* MOTION,: Simple smooth transition from top */}
            <span className="motion-word inline-block transform-gpu opacity-0 will-change-transform">
              motion,
            </span>
          </span>

          {/* PHRASE 3: AUDIO RMS (STRAIGHT PILL) + '&' (STATIC BIG) + ROTATING DIAMOND + SMOOTH SYNCHRONIZED WHISPER CADENCE */}
          <div ref={phrase3Ref} className="phrase-audio-group relative inline-flex items-center shrink-0 [perspective:1000px] align-middle select-none mx-3 sm:mx-6">
            {/* 1. AUDIO RMS: Straight Pill with Less Border Radius */}
            <span className="audio-rms-pill inline-block px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-md sm:rounded-lg bg-[#FF7A00] text-black font-extrabold text-3xl sm:text-5xl lg:text-6xl shadow-[0_12px_28px_rgba(255,122,0,0.45)] border-2 border-black transform-gpu opacity-0 z-10 select-none mr-4 sm:mr-6 will-change-transform">
              Audio RMS
            </span>

            {/* 2. DIAMOND ROTOR HUB WITH STATIC BIG '&' */}
            <div className="diamond-rotor-hub relative inline-flex items-center justify-center z-20 opacity-0 transform-gpu mr-3 sm:mr-5">
              {/* STATIC SEPARATE BIG '&' (Does NOT rotate with card) */}
              <div className="ampersand-static-badge absolute inset-0 z-30 flex items-center justify-center pointer-events-none select-none">
                <span className="text-black font-black text-2xl sm:text-3xl lg:text-4xl drop-shadow-[0_1px_3px_rgba(255,255,255,0.7)] font-sans">
                  &
                </span>
              </div>

              {/* ROTATING CRISP DIAMOND CARD (Rotates with ease-in-out) */}
              <div className="diamond-plate w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-sm sm:rounded-[4px] bg-gradient-to-br from-[#F3E8FF] via-[#C084FC] to-[#4338CA] rotate-45 shadow-[0_8px_26px_rgba(168,85,247,0.55)] border border-white/40 shrink-0 transform-gpu will-change-transform" />
            </div>

            {/* 3. WHISPER CADENCE: Edge-Attached Rotating Sticks (Rotates in sync with diamond) */}
            <div className="whisper-rotor-assembly relative inline-block w-[8.4em] sm:w-[8.8em] h-[1.3em] align-middle opacity-0 transform-gpu [perspective:800px]">
              {/* STICK 1 */}
              <div className="whisper-stick-1 absolute left-0 top-1/2 -translate-y-1/2 font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#FFFDE7] tracking-tight whitespace-nowrap transform-gpu origin-left will-change-transform">
                Whisper Cadence
              </div>

              {/* STICK 2 */}
              <div className="whisper-stick-2 absolute left-0 top-1/2 -translate-y-1/2 font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#FFFDE7] tracking-tight whitespace-nowrap transform-gpu origin-left opacity-0 will-change-transform">
                Whisper Cadence
              </div>
            </div>
          </div>

          {/* PHRASE 4: "NICE AND" + OVERLAPPING "EASY" & "EASING" BADGE COMPOSITION */}
          <div ref={phrase4Ref} className="phrase-nice-easy relative inline-flex items-center shrink-0 ml-3 sm:ml-6 mr-32 sm:mr-44 lg:mr-56 select-none align-middle my-auto">
            {/* 1. "NICE AND" MAIN PILL */}
            <div className="nice-and-pill relative z-10 px-6 py-2.5 sm:px-10 sm:py-4 lg:px-12 lg:py-5 rounded-md sm:rounded-lg lg:rounded-xl bg-gradient-to-r from-[#00DF3D] via-[#4ADE80] to-[#98F87C] text-black font-bold text-4xl sm:text-6xl lg:text-7xl shadow-[0_16px_36px_rgba(0,0,0,0.95)] transform-gpu opacity-0 select-none tracking-normal">
              Nice and
            </div>

            {/* 2. "EASY" TOP-RIGHT OVERLAPPING PILL */}
            <div className="easy-pill absolute -top-5 sm:-top-7 lg:-top-9 -right-6 sm:-right-9 lg:-right-12 z-30 p-[8px] sm:p-[10px] lg:p-[12px] rounded-lg sm:rounded-xl lg:rounded-2xl bg-black/45 shadow-[0_12px_24px_rgba(0,0,0,0.55),0_4px_10px_rgba(0,0,0,0.35)] transform-gpu opacity-0 select-none">
              <div className="px-4 py-1.5 sm:px-6 sm:py-2.5 lg:px-7 lg:py-3 rounded-sm sm:rounded-md lg:rounded-lg bg-gradient-to-r from-[#E9D5FF] via-[#C084FC] to-[#4F46E5] text-black font-bold text-xl sm:text-3xl lg:text-4xl tracking-normal">
                Easy
              </div>
            </div>

            {/* 3. "EASING" RIGHT PEAKING PILL */}
            <div className="easing-pill absolute top-3 sm:top-5 lg:top-6 -right-28 sm:-right-38 lg:-right-48 z-0 px-5 py-2 sm:px-7 sm:py-2.5 lg:px-8 lg:py-3 rounded-sm sm:rounded-md lg:rounded-lg bg-gradient-to-r from-[#FF7A00] via-[#FB923C] to-[#FFB8EB] text-black font-bold text-xl sm:text-3xl lg:text-4xl shadow-[0_12px_28px_rgba(0,0,0,0.85)] rotate-[16deg] origin-left transform-gpu opacity-0 select-none tracking-normal">
              Easing
            </div>
          </div>

          {/* PHRASE 4 */}
          <span className="inline-block">into high-dimensional</span>

          {/* STICKER 5: "Vector Topology" */}
          <span
            className="sticker-pop inline-block px-7 py-3 rounded-3xl bg-[#FFE500] text-black font-extrabold text-4xl sm:text-6xl lg:text-[6.5rem] shadow-2xl border-2 border-black -rotate-4 transform-gpu"
            data-rotation="-4"
          >
            Vector Topology
          </span>

          {/* INTERACTIVE SVG BEZIER EASING CURVE DIAGRAM 1 (from photo 3 & 4) */}
          <div className="graphic-pop inline-block mx-8 align-middle">
            <div className="p-5 rounded-3xl bg-[#141416]/90 border border-[#F4F1EA]/20 shadow-2xl backdrop-blur-xl">
              <svg viewBox="0 0 240 140" className="w-52 h-32 md:w-72 md:h-40 overflow-visible">
                {/* Control Guide Lines */}
                <line ref={line1aRef} x1="20" y1="120" x2="60" y2="20" stroke="#00E83F" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
                <line ref={line1bRef} x1="220" y1="20" x2="180" y2="120" stroke="#00E83F" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />

                {/* Animated Cubic Bezier Path */}
                <path
                  ref={easingCurve1Ref}
                  d="M 20 120 C 60 20, 180 120, 220 20"
                  fill="none"
                  stroke="#F4F1EA"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />

                {/* Start & End Square Anchors */}
                <rect x="11" y="111" width="18" height="18" fill="#00E83F" rx="4" className="rotate-45 transform-gpu" />
                <rect x="211" y="11" width="18" height="18" fill="#00E83F" rx="4" className="rotate-45 transform-gpu" />

                {/* Animated Control Handle Circles */}
                <circle ref={handle1aRef} cx="60" cy="20" r="8" fill="#00E83F" />
                <circle ref={handle1bRef} cx="180" cy="120" r="8" fill="#00E83F" />
              </svg>
            </div>
          </div>

          {/* STACKED STICKERS: "Super" + "Plug-and-play" (from photo 3) */}
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

          {/* DECORATIVE 8-POINT GRADIENT STAR ASTERISK (from photo 3) */}
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

          {/* PHRASE 5 */}
          <span className="inline-block">eases, or build your own</span>

          {/* SECOND SVG BEZIER ARCH CURVE DIAGRAM (from photo 2) */}
          <div className="graphic-pop inline-block mx-8 align-middle">
            <div className="p-5 rounded-3xl bg-[#141416]/90 border border-[#F4F1EA]/20 shadow-2xl backdrop-blur-xl">
              <svg viewBox="0 0 240 140" className="w-52 h-32 md:w-72 md:h-40 overflow-visible">
                {/* Vertical Dashed Guide Lines */}
                <line ref={line2aRef} x1="20" y1="20" x2="20" y2="110" stroke="#00E83F" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
                <line ref={line2bRef} x1="220" y1="20" x2="220" y2="110" stroke="#00E83F" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />

                {/* Animated Bezier Arch Path */}
                <path
                  ref={easingCurve2Ref}
                  d="M 20 20 Q 120 110, 220 20"
                  fill="none"
                  stroke="#F4F1EA"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />

                {/* Start & End Square Anchors */}
                <rect x="11" y="11" width="18" height="18" fill="#00E83F" rx="4" />
                <rect x="211" y="11" width="18" height="18" fill="#00E83F" rx="4" />

                {/* Control Handle Circles */}
                <circle ref={handle2aRef} cx="20" cy="110" r="8" fill="#00E83F" />
                <circle ref={handle2bRef} cx="220" cy="110" r="8" fill="#00E83F" />
              </svg>
            </div>
          </div>

          {/* PHRASE 6 */}
          <span className="inline-block">custom virality curves.</span>

          {/* STACKED STICKERS: "100 AI Agents" + "Synthetic Swarm" */}
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

          {/* STICKER 10: "in a snap" */}
          <span
            className="sticker-pop inline-block px-7 py-3 rounded-3xl bg-[#FFE500] text-black font-extrabold text-4xl sm:text-6xl lg:text-[6.5rem] shadow-2xl border-2 border-black -rotate-2 transform-gpu"
            data-rotation="-2"
          >
            in a snap
          </span>

          {/* PHRASE 7 */}
          <span className="inline-block">before you publish.</span>
        </div>
      </div>
    </div>
  );
};
