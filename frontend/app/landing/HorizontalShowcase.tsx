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
  const phrase5Ref = useRef<HTMLSpanElement>(null);
  const vectorTopologyRef = useRef<HTMLSpanElement>(null);
  const topGliderRef = useRef<HTMLDivElement>(null);
  const topGliderSpinnerRef = useRef<HTMLDivElement>(null);
  const superPlugRef = useRef<HTMLSpanElement>(null);
  const superStickerRef = useRef<HTMLSpanElement>(null);
  const plugBarRef = useRef<HTMLDivElement>(null);
  const phrase6Ref = useRef<HTMLSpanElement>(null);
  const phrase7Ref = useRef<HTMLSpanElement>(null);
  const starGliderRef = useRef<HTMLDivElement>(null);
  const starGliderSpinnerRef = useRef<HTMLDivElement>(null);
  const customCurveRef = useRef<HTMLDivElement>(null);
  const customPathRef = useRef<SVGPathElement>(null);
  const customAnchor1Ref = useRef<SVGRectElement>(null);
  const customAnchor2Ref = useRef<SVGRectElement>(null);
  const customHandle1Ref = useRef<SVGCircleElement>(null);
  const customHandle2Ref = useRef<SVGCircleElement>(null);
  const customLine1Ref = useRef<SVGLineElement>(null);
  const customLine2Ref = useRef<SVGLineElement>(null);
  const agentSwarmGroupRef = useRef<HTMLDivElement>(null);
  const sticker100AgentsRef = useRef<HTMLDivElement>(null);
  const letterGRef = useRef<HTMLSpanElement>(null);
  const letterSwarmSRef = useRef<HTMLSpanElement>(null);
  const stickerSyntheticSwarmRef = useRef<HTMLDivElement>(null);
  const stickerInASnapRef = useRef<HTMLDivElement>(null);
  const swarmBridgeElementRef = useRef<HTMLDivElement>(null);
  const swarmBridgeSpinnerRef = useRef<HTMLDivElement>(null);

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

        // a) Background Green Glowing Dome: Scales out dynamically with rotational torque & 3D tilt
        if (domeRef.current) {
          introTl.fromTo(
            domeRef.current,
            { scale: 0, rotateZ: -35, rotateX: 50, y: 220, x: 70, opacity: 0, transformOrigin: "bottom right" },
            { scale: 1, rotateZ: 0, rotateX: 0, y: 0, x: 0, opacity: 1, duration: 1.5, ease: "power4.out" },
            0
          );
        }

        // b) 3D Pink Bloom Flower: Dynamic multi-turn spin & blossoming scale-out over the dome
        if (flowerRef.current) {
          introTl.fromTo(
            flowerRef.current,
            { scale: 0, rotateZ: -420, rotateX: 55, y: 100, opacity: 0, transformOrigin: "50% 50%" },
            { scale: 1, rotateZ: 0, rotateX: 0, y: 0, opacity: 1, duration: 1.35, ease: "back.out(2.6)" },
            0.15
          );

          // Subtle ambient breathing float
          gsap.to(flowerRef.current, {
            rotation: 6,
            y: -5,
            duration: 3.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.6,
          });
        }

        // c) 3D Cyan Torus Ring: 3D Gyro orbital dive with ring scale-out & resonance
        if (torusRef.current) {
          introTl.fromTo(
            torusRef.current,
            { scale: 0, rotateX: 75, rotateY: -60, rotateZ: -180, y: -130, x: -50, opacity: 0, transformOrigin: "50% 50%" },
            { scale: 1, rotateX: 0, rotateY: 0, rotateZ: 0, y: 0, x: 0, opacity: 1, duration: 1.25, ease: "back.out(2.0)" },
            0.22
          );

          // Ambient hovering levitation
          gsap.to(torusRef.current, {
            y: -7,
            rotateZ: 5,
            duration: 4.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.7,
          });
        }

        // d) 3D Hourglass Prism: Geometric tumbling gyro-flip onto dome shoulder
        if (hourglassRef.current) {
          introTl.fromTo(
            hourglassRef.current,
            { scale: 0, rotateY: 270, rotateX: -70, rotateZ: -60, x: -90, y: 40, opacity: 0, transformOrigin: "center center" },
            { scale: 1, rotateY: 0, rotateX: 0, rotateZ: 0, x: 0, y: 0, opacity: 1, duration: 1.2, ease: "back.out(2.2)" },
            0.30
          );

          // Ambient subtle balance tilt
          gsap.to(hourglassRef.current, {
            rotateZ: -5,
            y: -4,
            duration: 3.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.8,
          });
        }

        // e) 3D Diamond Crystal Gem: Faceted sparkle & spring pop
        if (diamondRef.current) {
          introTl.fromTo(
            diamondRef.current,
            { scale: 0, rotateZ: 270, rotateY: 90, y: -70, x: 35, opacity: 0, transformOrigin: "center center" },
            { scale: 1, rotateZ: 0, rotateY: 0, y: 0, x: 0, opacity: 1, duration: 1.15, ease: "elastic.out(1.25, 0.4)" },
            0.36
          );

          // Ambient crystal shimmer float
          gsap.to(diamondRef.current, {
            y: -6,
            rotateZ: 8,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.9,
          });
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

        // 3.9. "into high-dimensional" - KINETIC 3D WAVE REVEAL & STAGGERED FLIP
        if (phrase5Ref.current) {
          const intoWord = phrase5Ref.current.querySelector(".into-word");
          const highLetters = phrase5Ref.current.querySelectorAll(".high-dimensional-letter");

          const phrase5Tl = gsap.timeline({
            scrollTrigger: {
              trigger: phrase5Ref.current,
              containerAnimation: horizontalTween,
              start: "left 85%",
              end: "left 20%",
              scrub: 1.2,
            },
          });

          // a) "into": Smooth 3D slide-in from top-left
          if (intoWord) {
            phrase5Tl.fromTo(
              intoWord,
              { opacity: 0, x: -35, y: -25, scale: 0.75 },
              {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.85,
                ease: "power3.out",
              },
              0
            );
          }

          // b) "high-dimensional": Alternating 3D letter wave flip-up
          if (highLetters.length) {
            highLetters.forEach((letterEl, idx) => {
              const isEven = idx % 2 === 0;
              const startY = isEven ? -30 : 35;
              const startRot = isEven ? -14 : 14;

              phrase5Tl.fromTo(
                letterEl,
                {
                  opacity: 0,
                  y: startY,
                  rotationX: -60,
                  rotationZ: startRot,
                  scale: 0.5,
                  transformOrigin: "center bottom",
                },
                {
                  opacity: 1,
                  y: 0,
                  rotationX: 0,
                  rotationZ: 0,
                  scale: 1,
                  duration: 0.9,
                  ease: "back.out(1.5)",
                },
                idx * 0.045
              );
            });
          }
        }

        // 3.10. "Vector Topology" - STROBE / ELECTRIC FLASH APPEARING ANIMATION
        if (vectorTopologyRef.current) {
          const strobeTl = gsap.timeline({
            scrollTrigger: {
              trigger: vectorTopologyRef.current,
              containerAnimation: horizontalTween,
              start: "left 85%",
              end: "left 35%",
              scrub: 1.2,
            },
          });

          strobeTl.fromTo(
            vectorTopologyRef.current,
            {
              opacity: 0,
              scale: 0.85,
            },
            {
              keyframes: [
                { opacity: 0, scale: 0.85, duration: 0.05 },
                { opacity: 1, scale: 1.08, duration: 0.08 },
                { opacity: 0, scale: 0.95, duration: 0.06 },
                { opacity: 1, scale: 1.05, duration: 0.1 },
                { opacity: 0.2, scale: 0.98, duration: 0.06 },
                { opacity: 1, scale: 1.02, duration: 0.1 },
                { opacity: 0.6, scale: 0.99, duration: 0.06 },
                { opacity: 1, scale: 1, duration: 0.2 },
              ],
              ease: "power2.out",
            }
          );
        }

        // 3.11. Metallic Diamond Cluster (Middle Element): Clean Top Stomp Drop (same as "Signals", no extra bounce) & In-Out Rotation
        if (topGliderRef.current) {
          const topGliderTl = gsap.timeline({
            scrollTrigger: {
              trigger: topGliderRef.current,
              containerAnimation: horizontalTween,
              start: "left 85%",
              end: "left 30%",
              scrub: 1.2,
            },
          });

          topGliderTl.fromTo(
            topGliderRef.current,
            {
              opacity: 0,
              y: -100,
              scale: 1.8,
              rotateX: 30,
              transformOrigin: "50% 100%",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              duration: 0.85,
              ease: "power3.out",
            }
          );
        }

        if (topGliderSpinnerRef.current) {
          gsap.to(topGliderSpinnerRef.current, {
            rotation: 360,
            duration: 1.5,
            repeat: -1,
            ease: "power2.inOut",
          });
        }

        // 3.12. "Super" (Backflip from Top) & "Plug-and-play" (Smooth Bar Expansion with Sequential Text Parts from Left)
        if (superPlugRef.current) {
          const superSticker = superStickerRef.current;
          const plugBar = plugBarRef.current;
          const plugPart = plugBar?.querySelector(".plug-part-plug");
          const hyphen1Part = plugBar?.querySelector(".plug-part-hyphen1");
          const andPart = plugBar?.querySelector(".plug-part-and");
          const hyphen2Part = plugBar?.querySelector(".plug-part-hyphen2");
          const playPart = plugBar?.querySelector(".plug-part-play");

          const superPlugTl = gsap.timeline({
            scrollTrigger: {
              trigger: superPlugRef.current,
              containerAnimation: horizontalTween,
              start: "left 85%",
              end: "left 20%",
              scrub: 1.2,
            },
          });

          // 1. "Super": Appears from top with slight 3D backflip
          if (superSticker) {
            superPlugTl.fromTo(
              superSticker,
              {
                opacity: 0,
                y: -90,
                rotationX: -70,
                rotationZ: -16,
                scale: 0.8,
                transformOrigin: "center bottom",
                transformPerspective: 800,
              },
              {
                opacity: 1,
                y: 0,
                rotationX: 0,
                rotationZ: -6,
                scale: 1,
                duration: 0.85,
                ease: "back.out(1.4)",
              },
              0
            );
          }

          // 2. "Plug-and-play": Stepped rhythmic expansion with micro-pauses & distinct ease-in-out effects
          if (plugBar) {
            // Initial state: hidden
            gsap.set(plugBar, { clipPath: "inset(0% 100% 0% 0% round 12px)" });

            // Stage 1: Bar expands to cover only "Plug" (~32% width)
            superPlugTl.to(
              plugBar,
              {
                clipPath: "inset(0% 68% 0% 0% round 12px)",
                duration: 0.5,
                ease: "power3.inOut",
              },
              0.3
            );
            if (plugPart) {
              superPlugTl.fromTo(
                plugPart,
                { opacity: 0, x: -35, rotationX: -45 },
                { opacity: 1, x: 0, rotationX: 0, duration: 0.5, ease: "back.out(1.4)" },
                0.35
              );
            }

            // [Micro-pause] Stage 2: Bar expands to cover first hyphen "-" (~42% width)
            superPlugTl.to(
              plugBar,
              {
                clipPath: "inset(0% 58% 0% 0% round 12px)",
                duration: 0.35,
                ease: "power3.inOut",
              },
              "+=0.16"
            );
            if (hyphen1Part) {
              superPlugTl.fromTo(
                hyphen1Part,
                { opacity: 0, scale: 0.2, y: -10 },
                { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(1.8)" },
                "<+=0.04"
              );
            }

            // [Micro-pause] Stage 3: Bar expands to cover "and" (~65% width)
            superPlugTl.to(
              plugBar,
              {
                clipPath: "inset(0% 35% 0% 0% round 12px)",
                duration: 0.5,
                ease: "power3.inOut",
              },
              "+=0.16"
            );
            if (andPart) {
              superPlugTl.fromTo(
                andPart,
                { opacity: 0, x: -30, rotationX: -45 },
                { opacity: 1, x: 0, rotationX: 0, duration: 0.5, ease: "back.out(1.4)" },
                "<+=0.06"
              );
            }

            // [Micro-pause] Stage 4: Bar expands to cover second hyphen "-" (~75% width)
            superPlugTl.to(
              plugBar,
              {
                clipPath: "inset(0% 25% 0% 0% round 12px)",
                duration: 0.35,
                ease: "power3.inOut",
              },
              "+=0.16"
            );
            if (hyphen2Part) {
              superPlugTl.fromTo(
                hyphen2Part,
                { opacity: 0, scale: 0.2, y: -10 },
                { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(1.8)" },
                "<+=0.04"
              );
            }

            // [Micro-pause] Stage 5: Bar expands to full 100% width to reveal "play"
            superPlugTl.to(
              plugBar,
              {
                clipPath: "inset(0% 0% 0% 0% round 12px)",
                duration: 0.55,
                ease: "power3.inOut",
              },
              "+=0.16"
            );
            if (playPart) {
              superPlugTl.fromTo(
                playPart,
                { opacity: 0, x: -35, rotationX: -45 },
                { opacity: 1, x: 0, rotationX: 0, duration: 0.55, ease: "back.out(1.4)" },
                "<+=0.08"
              );
            }
          }
        }

        // 3.13. "eases, or build your own custom virality curves." WITH FLOATING TOP 8-POINT STAR GLIDER
        if (phrase6Ref.current) {
          const starGlider = starGliderRef.current;
          const starSpinner = starGliderSpinnerRef.current;
          const easesLetters = phrase6Ref.current.querySelectorAll(".eases-letter");
          const orWord = phrase6Ref.current.querySelector(".or-word");
          const buildLetters = phrase6Ref.current.querySelectorAll(".build-letter");
          const yourOwnWord1 = phrase6Ref.current.querySelector(".your-own-word1");
          const yourOwnWord2 = phrase6Ref.current.querySelector(".your-own-word2");
          const customLetters = phrase6Ref.current.querySelectorAll(".custom-letter");
          const viralityLetters = phrase6Ref.current.querySelectorAll(".virality-letter");
          const curvesWord = phrase6Ref.current.querySelector(".curves-word");

          const phrase6Tl = gsap.timeline({
            scrollTrigger: {
              trigger: phrase6Ref.current,
              containerAnimation: horizontalTween,
              start: "left 80%",
              end: "left 15%",
              scrub: 1.2,
            },
          });

          // 1. Floating Top Star Glider: Pops up and glides in sync with words to settle right on "own"
          if (starGlider) {
            phrase6Tl.fromTo(
              starGlider,
              { opacity: 0, scale: 0, y: -15 },
              { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.8)" },
              0.1
            );

            phrase6Tl.to(
              starGlider,
              {
                x: () => {
                  if (yourOwnWord2 instanceof HTMLElement) {
                    return yourOwnWord2.offsetLeft + yourOwnWord2.offsetWidth * 0.15;
                  }
                  return 300;
                },
                duration: 1.4,
                ease: "power2.inOut",
              },
              0.35
            );
          }

          // Infinite rhythmic rotation on star spinner (just like parsing glider spinner)
          if (starSpinner) {
            gsap.to(starSpinner, {
              rotation: 360,
              duration: 2.0,
              repeat: -1,
              ease: "power2.inOut",
            });
          }

          // 2. "eases,": Letter-by-letter wave reveal from bottom
          if (easesLetters.length) {
            easesLetters.forEach((letterEl, idx) => {
              phrase6Tl.fromTo(
                letterEl,
                { opacity: 0, y: 35, rotateZ: 10, scale: 0.5 },
                { opacity: 1, y: 0, rotateZ: 0, scale: 1, duration: 0.75, ease: "back.out(1.6)" },
                idx * 0.06
              );
            });
          }

          // 3. "or": 3D Flip drop
          if (orWord) {
            phrase6Tl.fromTo(
              orWord,
              { opacity: 0, y: -30, rotateX: -60 },
              { opacity: 1, y: 0, rotateX: 0, duration: 0.65, ease: "power2.out" },
              0.35
            );
          }

          // 4. "build": Letter-by-letter kinetic slide-up
          if (buildLetters.length) {
            buildLetters.forEach((letterEl, idx) => {
              phrase6Tl.fromTo(
                letterEl,
                { opacity: 0, y: 40, scale: 0.5 },
                { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
                0.5 + idx * 0.05
              );
            });
          }

          // 5. "your" & "own": Dynamic Cross-Direction Swapping Entrance
          if (yourOwnWord1) {
            phrase6Tl.fromTo(
              yourOwnWord1,
              {
                opacity: 0,
                x: -45,
                y: -60,
                rotateZ: -18,
                rotateX: -45,
                scale: 0.65,
                transformOrigin: "center center",
              },
              {
                opacity: 1,
                x: 0,
                y: 0,
                rotateZ: 0,
                rotateX: 0,
                scale: 1,
                duration: 0.75,
                ease: "back.out(1.7)",
              },
              0.78
            );
          }
          if (yourOwnWord2) {
            phrase6Tl.fromTo(
              yourOwnWord2,
              {
                opacity: 0,
                x: 45,
                y: 60,
                rotateZ: 18,
                rotateX: 45,
                scale: 0.65,
                transformOrigin: "center center",
              },
              {
                opacity: 1,
                x: 0,
                y: 0,
                rotateZ: 0,
                rotateX: 0,
                scale: 1,
                duration: 0.75,
                ease: "back.out(1.7)",
              },
              0.88
            );
          }

          // 6. "custom": Letter-by-letter 3D wave reveal
          if (customLetters.length) {
            customLetters.forEach((letterEl, idx) => {
              phrase6Tl.fromTo(
                letterEl,
                { opacity: 0, y: 30, rotateX: -90 },
                { opacity: 1, y: 0, rotateX: 0, duration: 0.75, ease: "power2.out" },
                1.2 + idx * 0.06
              );
            });
          }

          // 8. "virality": Luminous emerald letter wave
          if (viralityLetters.length) {
            viralityLetters.forEach((letterEl, idx) => {
              phrase6Tl.fromTo(
                letterEl,
                { opacity: 0, y: 40, rotateZ: -12, scale: 0.6 },
                { opacity: 1, y: 0, rotateZ: 0, scale: 1, duration: 0.8, ease: "back.out(1.5)" },
                1.55 + idx * 0.05
              );
            });
          }

          // 9. "curves.": Smooth stomp drop
          if (curvesWord) {
            phrase6Tl.fromTo(
              curvesWord,
              { opacity: 0, y: -45, scale: 0.8 },
              { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "power3.out" },
              2.0
            );
          }
        }

        // 3.13b. DEDICATED SCROLL-DRIVEN S-TO-U BEZIER GLIDER & MORPH (1:1 Tied to User Scroll with Ease In-Out)
        if (customCurveRef.current && phrase6Ref.current) {
          const customWord = phrase6Ref.current.querySelector(".custom-word");
          const curvesWord = phrase6Ref.current.querySelector(".curves-word");

          if (customWord && curvesWord) {
            const bezierScrollTl = gsap.timeline({
              scrollTrigger: {
                trigger: customWord,
                containerAnimation: horizontalTween,
                start: "left 75%",
                endTrigger: curvesWord,
                end: "right 45%",
                scrub: 1.5,
              },
            });

            // 1. Initial fade & scale in as "custom" enters viewport
            bezierScrollTl.fromTo(
              customCurveRef.current,
              { opacity: 0, scale: 0.6 },
              { opacity: 1, scale: 1, duration: 0.15, ease: "power1.out" },
              0
            );

            // 2. Pure Scroll-Driven Forward Translation from "c" of custom to "." of curves.
            bezierScrollTl.fromTo(
              customCurveRef.current,
              {
                x: () => (customWord instanceof HTMLElement ? customWord.offsetLeft - 15 : 440),
              },
              {
                x: () => (curvesWord instanceof HTMLElement ? curvesWord.offsetLeft + curvesWord.offsetWidth - 65 : 880),
                duration: 1.0,
                ease: "power2.inOut",
              },
              0
            );

          // 3. Pure Scroll-Driven Geometry & Angle Morphing (S-Curve -> Asymmetric Bend -> Symmetrical U-Arc)
          const morphObj = { progress: 0 };
          bezierScrollTl.to(
            morphObj,
            {
              progress: 1,
              duration: 1.0,
              ease: "power2.inOut",
              onUpdate: () => {
                const p = morphObj.progress;

                // 1. Anchors
                // Left Anchor (a1): starts at (25, 125) at p=0 -> rises vertically to (25, 25) at p=1
                const a1_x = 25;
                const a1_y = 125 - p * 100;

                // Right Anchor (a2): sits at top-right (175, 25)
                const a2_x = 175;
                const a2_y = 25;

                // 2. Control Handles (Rotates with true angular kinematics)
                // Handle 1 (Control point for Anchor 1):
                // Rotates from 0 rad (pointing right at 175, 125) down to PI/2 rad (pointing down at 25, 125)
                const theta1 = p * (Math.PI / 2);
                const r1 = 150 - p * 50;
                const h1_x = a1_x + Math.cos(theta1) * r1;
                const h1_y = a1_y + Math.sin(theta1) * r1;

                // Handle 2 (Control point for Anchor 2):
                // Rotates from PI rad (pointing left at 25, 25) down to PI/2 rad (pointing down at 175, 125)
                const theta2 = Math.PI - p * (Math.PI / 2);
                const r2 = 150 - p * 50;
                const h2_x = a2_x + Math.cos(theta2) * r2;
                const h2_y = a2_y + Math.sin(theta2) * r2;

                // 3. Tangent Angles for Anchor Squares
                const a1_deg = theta1 * (180 / Math.PI);
                const a2_deg = (theta2 - Math.PI) * (180 / Math.PI);

                // Update Curve Path
                if (customPathRef.current) {
                  customPathRef.current.setAttribute(
                    "d",
                    `M ${a1_x.toFixed(1)} ${a1_y.toFixed(1)} C ${h1_x.toFixed(1)} ${h1_y.toFixed(1)}, ${h2_x.toFixed(1)} ${h2_y.toFixed(1)}, ${a2_x.toFixed(1)} ${a2_y.toFixed(1)}`
                  );
                }

                // Update Left Anchor Rect (centered at a1_x, a1_y, 18x18 size)
                if (customAnchor1Ref.current) {
                  customAnchor1Ref.current.setAttribute("x", (a1_x - 9).toFixed(1));
                  customAnchor1Ref.current.setAttribute("y", (a1_y - 9).toFixed(1));
                  customAnchor1Ref.current.setAttribute(
                    "transform",
                    `rotate(${a1_deg.toFixed(1)} ${a1_x.toFixed(1)} ${a1_y.toFixed(1)})`
                  );
                }

                // Update Right Anchor Rect (centered at a2_x, a2_y, 18x18 size)
                if (customAnchor2Ref.current) {
                  customAnchor2Ref.current.setAttribute("x", (a2_x - 9).toFixed(1));
                  customAnchor2Ref.current.setAttribute("y", (a2_y - 9).toFixed(1));
                  customAnchor2Ref.current.setAttribute(
                    "transform",
                    `rotate(${a2_deg.toFixed(1)} ${a2_x.toFixed(1)} ${a2_y.toFixed(1)})`
                  );
                }

                // Update Left Handle Circle
                if (customHandle1Ref.current) {
                  customHandle1Ref.current.setAttribute("cx", h1_x.toFixed(1));
                  customHandle1Ref.current.setAttribute("cy", h1_y.toFixed(1));
                }

                // Update Right Handle Circle
                if (customHandle2Ref.current) {
                  customHandle2Ref.current.setAttribute("cx", h2_x.toFixed(1));
                  customHandle2Ref.current.setAttribute("cy", h2_y.toFixed(1));
                }

                // Update Guideline 1 (Always strictly connected Anchor 1 to Handle 1)
                if (customLine1Ref.current) {
                  customLine1Ref.current.setAttribute("x1", a1_x.toFixed(1));
                  customLine1Ref.current.setAttribute("y1", a1_y.toFixed(1));
                  customLine1Ref.current.setAttribute("x2", h1_x.toFixed(1));
                  customLine1Ref.current.setAttribute("y2", h1_y.toFixed(1));
                }

                // Update Guideline 2 (Always strictly connected Anchor 2 to Handle 2)
                if (customLine2Ref.current) {
                  customLine2Ref.current.setAttribute("x1", a2_x.toFixed(1));
                  customLine2Ref.current.setAttribute("y1", a2_y.toFixed(1));
                  customLine2Ref.current.setAttribute("x2", h2_x.toFixed(1));
                  customLine2Ref.current.setAttribute("y2", h2_y.toFixed(1));
                }
              },
            },
            0
          );
        }
      }

        // 3.13c. SEQUENTIAL MULTI-BAR DROP & REVEAL FOR 100 AI AGENTS -> SYNTHETIC SWARM -> IN A SNAP
        if (agentSwarmGroupRef.current) {
          const bar100 = sticker100AgentsRef.current;
          const barSwarm = stickerSyntheticSwarmRef.current;
          const barSnap = stickerInASnapRef.current;

          const swarmTl = gsap.timeline({
            scrollTrigger: {
              trigger: agentSwarmGroupRef.current,
              containerAnimation: horizontalTween,
              start: "left 80%",
              end: "left 25%",
              scrub: 1.2,
            },
          });

          // 1. "100 AI Agents" appears smoothly from the RIGHT into position
          if (bar100) {
            swarmTl.fromTo(
              bar100,
              { opacity: 0, x: 120, y: 0, scale: 0.9 },
              { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.75, ease: "power3.out" },
              0
            );
          }

          // 2. "Synthetic Swarm" (Stage A: Slides straight down from behind 100 AI Agents to connected border)
          if (barSwarm) {
            swarmTl.fromTo(
              barSwarm,
              {
                opacity: 0,
                y: 0,
                x: () => (bar100 ? Math.round(bar100.offsetWidth * 0.28) : 135),
                scale: 0.96,
              },
              {
                opacity: 1,
                y: () => (bar100 ? bar100.offsetHeight - 2 : 110),
                x: () => (bar100 ? Math.round(bar100.offsetWidth * 0.28) : 135),
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
              },
              0.28
            );

            // (Stage B: After sliding down, it slides smoothly further to the RIGHT aligning exactly at the letter 'g' of Agents)
            swarmTl.to(
              barSwarm,
              {
                x: () => (letterGRef.current ? letterGRef.current.offsetLeft : bar100 ? Math.round(bar100.offsetWidth * 0.65) : 310),
                duration: 0.65,
                ease: "power3.out",
              },
              0.9
            );
          }

          // 3. "in a snap" appears from the first card (100 AI Agents) and smoothly glides from LEFT to RIGHT with ease-in-out, stopping at letter "S" of "Swarm"
          if (barSnap) {
            swarmTl.fromTo(
              barSnap,
              {
                opacity: 0,
                y: 0,
                x: 0,
                scale: 0.95,
              },
              {
                opacity: 1,
                y: 0,
                x: () => {
                  const swarmBaseX = letterGRef.current ? letterGRef.current.offsetLeft : bar100 ? Math.round(bar100.offsetWidth * 0.65) : 310;
                  const sOffset = letterSwarmSRef.current ? letterSwarmSRef.current.offsetLeft : 200;
                  return swarmBaseX + sOffset;
                },
                scale: 1,
                duration: 1.05,
                ease: "power2.inOut",
              },
              1.15
            );
          }

          // 4. AGENT KEYHOLE ELEMENT: Perfectly centered between 1st & 3rd bar and resting flush on top border of Synthetic Swarm
          const bridgeEl = swarmBridgeElementRef.current;
          if (bridgeEl) {
            const getBridgeX = () => {
              const bar100Right = bar100 ? bar100.offsetWidth : 380;
              const swarmBaseX = letterGRef.current ? letterGRef.current.offsetLeft : bar100 ? Math.round(bar100.offsetWidth * 0.65) : 310;
              const sOffset = letterSwarmSRef.current ? letterSwarmSRef.current.offsetLeft : 200;
              const snapLeft = swarmBaseX + sOffset;
              const halfElWidth = bridgeEl ? bridgeEl.offsetWidth / 2 : 28;
              return Math.round((bar100Right + snapLeft) / 2 - halfElWidth);
            };

            const getBridgeY = () => {
              const topOfSwarm = bar100 ? bar100.offsetHeight - 2 : 110;
              const elHeight = bridgeEl ? bridgeEl.offsetHeight : 70;
              // Lift slightly up so it floats cleanly in the notch above the orange Swarm bar
              const liftUp = typeof window !== "undefined" && window.innerWidth < 640 ? 8 : typeof window !== "undefined" && window.innerWidth < 1024 ? 12 : 14;
              return topOfSwarm - elHeight - liftUp;
            };

            swarmTl.fromTo(
              bridgeEl,
              {
                opacity: 0,
                scale: 0,
                rotation: 0,
                x: getBridgeX,
                y: getBridgeY,
              },
              {
                opacity: 1,
                scale: 1,
                rotation: 0,
                x: getBridgeX,
                y: getBridgeY,
                duration: 0.65,
                ease: "back.out(1.8)",
              },
              2.1
            );
          }

          // 5. Infinite Robotic Haptic Jitter / Micro-Vibration with 2s interval
          if (swarmBridgeSpinnerRef.current) {
            const vibrateTl = gsap.timeline({
              repeat: -1,
              repeatDelay: 2,
              delay: 2.7,
            });

            vibrateTl
              .to(swarmBridgeSpinnerRef.current, { x: -2.5, y: -1, rotate: -2, duration: 0.035, ease: "power1.inOut" })
              .to(swarmBridgeSpinnerRef.current, { x: 2.5, y: 1, rotate: 2, duration: 0.035, ease: "power1.inOut" })
              .to(swarmBridgeSpinnerRef.current, { x: -2, y: 0, rotate: -1.5, duration: 0.035, ease: "power1.inOut" })
              .to(swarmBridgeSpinnerRef.current, { x: 2, y: -0.5, rotate: 1.5, duration: 0.035, ease: "power1.inOut" })
              .to(swarmBridgeSpinnerRef.current, { x: -1, y: 0, rotate: -0.5, duration: 0.035, ease: "power1.inOut" })
              .to(swarmBridgeSpinnerRef.current, { x: 0, y: 0, rotate: 0, duration: 0.04, ease: "power1.out" });
          }
        }

        // 3.14. "before you publish." WITH KINETIC 3D WAVE REVEAL
        if (phrase7Ref.current) {
          const beforeWord = phrase7Ref.current.querySelector(".before-word");
          const youWord = phrase7Ref.current.querySelector(".you-word");
          const publishLetters = phrase7Ref.current.querySelectorAll(".publish-letter");

          const phrase7Tl = gsap.timeline({
            scrollTrigger: {
              trigger: phrase7Ref.current,
              containerAnimation: horizontalTween,
              start: "left 85%",
              end: "left 30%",
              scrub: 1.2,
            },
          });

          // a) Word "before": Smooth 3D rise
          if (beforeWord) {
            phrase7Tl.fromTo(
              beforeWord,
              { opacity: 0, y: 40, rotationX: -45, scale: 0.85 },
              { opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 0.75, ease: "power3.out" },
              0
            );
          }

          // b) Word "you": 3D pop flip
          if (youWord) {
            phrase7Tl.fromTo(
              youWord,
              { opacity: 0, y: 35, rotationY: 45, scale: 0.85 },
              { opacity: 1, y: 0, rotationY: 0, scale: 1, duration: 0.75, ease: "back.out(1.6)" },
              0.15
            );
          }

          // c) "publish.": Letter-by-letter kinetic 3D wave reveal
          if (publishLetters.length) {
            publishLetters.forEach((letterEl, idx) => {
              const tilt = idx % 2 === 0 ? -10 : 10;
              phrase7Tl.fromTo(
                letterEl,
                { opacity: 0, y: 45, rotateZ: tilt, scale: 0.6 },
                { opacity: 1, y: 0, rotateZ: 0, scale: 1, duration: 0.8, ease: "back.out(1.8)" },
                0.3 + idx * 0.05
              );
            });
          }
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

          {/* RIGHT COLUMN: 3D ARTWORKS COMPOSITION (Refined Proportions & 3D Spatial Staging) */}
          <div className="relative w-[320px] sm:w-[420px] md:w-[500px] lg:w-[560px] h-[380px] sm:h-[460px] md:h-[500px] flex items-center justify-center shrink-0 mr-4 sm:mr-10 lg:mr-16 [perspective:1400px] [transform-style:preserve-3d]">
            {/* 1. 3D CYAN TORUS RING (Top Left - Polished Metallic Cyan/Sky) */}
            <div ref={torusRef} className="intro-graphic absolute top-2 left-6 z-20 transform-gpu will-change-transform">
              <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-26 sm:h-26 lg:w-32 lg:h-32 overflow-visible">
                <defs>
                  <linearGradient id="introTorusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#A5F3FC" />
                    <stop offset="55%" stopColor="#00F0FF" />
                    <stop offset="85%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#0369A1" />
                  </linearGradient>
                </defs>
                <g filter="drop-shadow(0px 10px 24px rgba(0,240,255,0.45))">
                  <circle cx="50" cy="50" r="36" fill="none" stroke="url(#introTorusGrad)" strokeWidth="18" />
                  <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                </g>
              </svg>
            </div>

            {/* 2. 3D HOURGLASS PRISM (Mid Left - Metallic Lilac/Purple) */}
            <div ref={hourglassRef} className="intro-graphic absolute bottom-24 left-10 sm:left-14 z-20 transform-gpu will-change-transform">
              <svg viewBox="0 0 80 100" className="w-14 h-14 sm:w-18 sm:h-18 lg:w-22 lg:h-22 overflow-visible">
                <defs>
                  <linearGradient id="hourglassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="30%" stopColor="#F3E8FF" />
                    <stop offset="60%" stopColor="#C084FC" />
                    <stop offset="100%" stopColor="#581C87" />
                  </linearGradient>
                </defs>
                <g filter="drop-shadow(0px 8px 20px rgba(192,132,252,0.55))">
                  <path d="M 10 10 L 70 10 L 40 50 L 70 90 L 10 90 L 40 50 Z" fill="url(#hourglassGrad)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinejoin="round" />
                </g>
              </svg>
            </div>

            {/* 3. 3D GLOWING DIAMOND GEM (Top Right - Metallic Amber/Gold) */}
            <div ref={diamondRef} className="intro-graphic absolute top-10 right-6 sm:right-10 z-20 transform-gpu will-change-transform">
              <svg viewBox="0 0 60 60" className="w-10 h-10 sm:w-14 sm:h-14 lg:w-18 lg:h-18 overflow-visible">
                <defs>
                  <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="30%" stopColor="#FEF08A" />
                    <stop offset="60%" stopColor="#FF7A00" />
                    <stop offset="100%" stopColor="#9A3412" />
                  </linearGradient>
                </defs>
                <g filter="drop-shadow(0px 8px 20px rgba(255,122,0,0.55))">
                  <polygon points="30,5 55,30 30,55 5,30" fill="url(#diamondGrad)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
                </g>
              </svg>
            </div>

            {/* 4. 3D PINK 4-PETAL FLOWER BLOOM (Center resting on Dome - Metallic Rose Pink) */}
            <div ref={flowerRef} className="intro-graphic absolute bottom-24 sm:bottom-32 right-14 sm:right-20 z-30 transform-gpu will-change-transform">
              <svg viewBox="0 0 120 120" className="w-28 h-28 sm:w-44 sm:h-44 lg:w-52 lg:h-52 overflow-visible">
                <defs>
                  <linearGradient id="flowerGradIntro" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#FFF0FA" />
                    <stop offset="55%" stopColor="#F472B6" />
                    <stop offset="80%" stopColor="#E1147D" />
                    <stop offset="100%" stopColor="#701A75" />
                  </linearGradient>
                </defs>
                <g filter="drop-shadow(0px 16px 32px rgba(245,167,232,0.55))">
                  <path
                    d="M 60 60 C 40 25, 10 10, 60 5 C 110 10, 80 25, 60 60 C 95 40, 110 10, 115 60 C 110 110, 95 80, 60 60 C 80 95, 110 110, 60 115 C 10 110, 40 95, 60 60 C 25 80, 10 110, 5 60 C 10 10, 25 40, 60 60 Z"
                    fill="url(#flowerGradIntro)"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1.5"
                  />
                </g>
              </svg>
            </div>

            {/* 5. GIANT VIBRANT GREEN GLOWING DOME BASE (Bottom Right - Metallic Emerald Luster) */}
            <div ref={domeRef} className="absolute bottom-0 right-0 w-[220px] sm:w-[320px] md:w-[390px] lg:w-[440px] h-[140px] sm:h-[195px] md:h-[240px] lg:h-[270px] z-10 overflow-hidden rounded-t-full transform-gpu will-change-transform">
              <div className="w-full h-full bg-gradient-to-t from-[#00A832] via-[#00E83F] via-[#34D399] to-[#ECFDF5] border-t-2 border-white/50 shadow-[0_0_100px_rgba(0,232,63,0.6)]" />
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
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="20%" stopColor="#FFF0FA" />
                      <stop offset="50%" stopColor="#F472B6" />
                      <stop offset="80%" stopColor="#E1147D" />
                      <stop offset="100%" stopColor="#831843" />
                    </linearGradient>
                  </defs>
                  <g filter="drop-shadow(0px 14px 28px rgba(225,20,125,0.65))">
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
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="25%" stopColor="#A5F3FC" />
                      <stop offset="55%" stopColor="#00F0FF" />
                      <stop offset="85%" stopColor="#0284C7" />
                      <stop offset="100%" stopColor="#0369A1" />
                    </linearGradient>
                  </defs>
                  <g filter="drop-shadow(0px 8px 22px rgba(56,189,248,0.65))">
                    {/* Top-Left */}
                    <rect x="0" y="0" width="30" height="30" rx="4" fill="url(#cyanTileGrad)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                    {/* Top-Right */}
                    <rect x="60" y="0" width="30" height="30" rx="4" fill="url(#cyanTileGrad)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                    {/* Center */}
                    <rect x="30" y="30" width="30" height="30" rx="4" fill="url(#cyanTileGrad)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                    {/* Bottom-Left */}
                    <rect x="0" y="60" width="30" height="30" rx="4" fill="url(#cyanTileGrad)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                    {/* Bottom-Right */}
                    <rect x="60" y="60" width="30" height="30" rx="4" fill="url(#cyanTileGrad)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
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

          {/* PHRASE 5: "into high-dimensional" WITH "Vector Topology" FLOATING ON UPPER SIDE */}
          <span ref={phrase5Ref} className="phrase-high-dimensional relative inline-flex items-baseline gap-4 select-none align-baseline [perspective:900px] my-auto">
            {/* VECTOR TOPOLOGY FLOATING ABOVE THE SENTENCE */}
            <div className="vector-topology-wrapper absolute -top-16 sm:-top-24 lg:-top-28 right-0 sm:right-2 z-30 pointer-events-none">
              <span
                ref={vectorTopologyRef}
                className="vector-topology-card inline-block px-5 py-2 sm:px-7 sm:py-2.5 rounded-md sm:rounded-lg bg-[#FFE500] text-black font-extrabold text-2xl sm:text-4xl lg:text-5xl shadow-[0_12px_28px_rgba(255,229,0,0.45)] border-2 border-black rotate-0 transform-gpu opacity-0 select-none will-change-transform pointer-events-auto"
              >
                Vector Topology
              </span>
            </div>

            <span className="into-word inline-block opacity-0 transform-gpu will-change-transform">
              into
            </span>
            <span className="high-dimensional-word inline-flex overflow-hidden">
              {"high-dimensional".split("").map((letter, idx) => (
                <span
                  key={idx}
                  className="high-dimensional-letter inline-block transform-gpu origin-bottom opacity-0 will-change-transform"
                >
                  {letter}
                </span>
              ))}
            </span>
          </span>

          {/* 5-METALLIC-DIAMOND CLUSTER ELEMENT: METALLIC LILAC-TO-INDIGO GRADIENT MATCHING '&' DIAMOND */}
          <div ref={topGliderRef} className="metallic-top-glider relative inline-flex items-center justify-center mx-4 sm:mx-8 align-middle my-auto select-none opacity-0 transform-gpu [perspective:1000px]">
            <div ref={topGliderSpinnerRef} className="metallic-cluster-spinner w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 transform-gpu shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="metallicDiamondTileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#F3E8FF" />
                    <stop offset="55%" stopColor="#C084FC" />
                    <stop offset="85%" stopColor="#9333EA" />
                    <stop offset="100%" stopColor="#4338CA" />
                  </linearGradient>
                </defs>
                <g filter="drop-shadow(0px 8px 24px rgba(168,85,247,0.55))">
                  {/* Top-Left */}
                  <rect x="0" y="0" width="34" height="34" rx="4" fill="url(#metallicDiamondTileGrad)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                  {/* Top-Right */}
                  <rect x="66" y="0" width="34" height="34" rx="4" fill="url(#metallicDiamondTileGrad)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                  {/* Center */}
                  <rect x="33" y="33" width="34" height="34" rx="4" fill="url(#metallicDiamondTileGrad)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                  {/* Bottom-Left */}
                  <rect x="0" y="66" width="34" height="34" rx="4" fill="url(#metallicDiamondTileGrad)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                  {/* Bottom-Right */}
                  <rect x="66" y="66" width="34" height="34" rx="4" fill="url(#metallicDiamondTileGrad)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                </g>
              </svg>
            </div>
          </div>

          {/* STACKED STICKERS: "Super" (Same size as "Nice and" bar) + "Plug-and-play" (A very little smaller) */}
          <span ref={superPlugRef} className="relative inline-flex flex-col items-start align-middle mx-3 sm:mx-6 select-none">
            {/* SUPER: Appears from Top with a slight Back Flip */}
            <span
              ref={superStickerRef}
              className="inline-block px-6 py-2.5 sm:px-9 sm:py-3.5 lg:px-11 lg:py-4.5 rounded-md sm:rounded-lg lg:rounded-xl bg-[#00E83F] text-black font-bold text-4xl sm:text-6xl lg:text-7xl shadow-[0_16px_36px_rgba(0,0,0,0.85)] border-2 border-black -rotate-6 z-20 transform-gpu will-change-transform opacity-0 pointer-events-auto tracking-normal"
            >
              Super
            </span>

            {/* PLUG-AND-PLAY: Smoothly Spans Width from Left with Sequential Text Parts */}
            <div
              className="relative inline-block rotate-3 -mt-4 sm:-mt-6 lg:-mt-7 ml-4 sm:ml-7 lg:ml-9 z-10 transform-gpu will-change-transform"
            >
              <div
                ref={plugBarRef}
                className="inline-flex items-center px-5 py-2 sm:px-8 sm:py-3 lg:px-10 lg:py-4 rounded-md sm:rounded-lg lg:rounded-xl bg-[#F5A7E8] text-black font-bold text-3xl sm:text-5xl lg:text-6xl shadow-[0_14px_32px_rgba(0,0,0,0.85)] border-2 border-black transform-gpu will-change-transform overflow-hidden pointer-events-auto tracking-normal"
                style={{ clipPath: "inset(0% 100% 0% 0% round 12px)" }}
              >
                <span className="plug-part-plug inline-block opacity-0 will-change-transform">
                  Plug
                </span>
                <span className="plug-part-hyphen1 inline-block opacity-0 mx-[0.04em] will-change-transform">
                  -
                </span>
                <span className="plug-part-and inline-block opacity-0 will-change-transform">
                  and
                </span>
                <span className="plug-part-hyphen2 inline-block opacity-0 mx-[0.04em] will-change-transform">
                  -
                </span>
                <span className="plug-part-play inline-block opacity-0 will-change-transform">
                  play
                </span>
              </div>
            </div>
          </span>

          {/* PHRASE 6: "eases, or build your own custom virality curves." WITH FLOATING TOP 8-POINT STAR GLIDER */}
          <span ref={phrase6Ref} className="phrase-6 relative inline-flex items-center gap-[0.42em] shrink-0 mx-4 sm:mx-8">
            {/* FLOATING TOP 8-POINT STAR GLIDER: POPS UP AT TOP AND GLIDES ACROSS SENTENCE LIKE PARSING GLIDER */}
            <div ref={starGliderRef} className="star-top-glider absolute -top-14 sm:-top-20 lg:-top-24 left-0 z-20 pointer-events-none opacity-0 select-none">
              <div ref={starGliderSpinnerRef} className="star-spinner w-16 h-16 sm:w-22 sm:h-22 lg:w-28 lg:h-28 transform-gpu">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="25%" stopColor="#FED7AA" />
                      <stop offset="55%" stopColor="#FF7A00" />
                      <stop offset="85%" stopColor="#F472B6" />
                      <stop offset="100%" stopColor="#9D174D" />
                    </linearGradient>
                  </defs>
                  <g filter="drop-shadow(0px 10px 24px rgba(255,122,0,0.55))">
                    <path
                      d="M 50 0 L 57 33 L 85 15 L 67 43 L 100 50 L 67 57 L 85 85 L 57 67 L 50 100 L 43 67 L 15 85 L 33 57 L 0 50 L 33 43 L 15 15 L 43 33 Z"
                      fill="url(#starGrad)"
                      stroke="rgba(255,255,255,0.45)"
                      strokeWidth="1"
                    />
                  </g>
                </svg>
              </div>
            </div>

            {/* WORD "eases,": Letter by letter 3D wave reveal */}
            <span className="eases-word inline-flex overflow-hidden text-[#F5A7E8] font-bold">
              {"eases,".split("").map((letter, idx) => (
                <span
                  key={idx}
                  className="eases-letter inline-block transform-gpu origin-bottom opacity-0 will-change-transform"
                >
                  {letter}
                </span>
              ))}
            </span>

            {/* WORD "or": 3D Flip drop */}
            <span className="or-word inline-block transform-gpu opacity-0 will-change-transform text-[#F4F1EA]/80">
              or
            </span>

            {/* WORD "build": Kinetic slide-up reveal */}
            <span className="build-word inline-flex overflow-hidden font-bold text-[#00E83F]">
              {"build".split("").map((letter, idx) => (
                <span
                  key={idx}
                  className="build-letter inline-block transform-gpu origin-bottom opacity-0 will-change-transform"
                >
                  {letter}
                </span>
              ))}
            </span>

            {/* WORD "your": 3D tilt reveal */}
            <span className="your-own-word1 inline-block transform-gpu opacity-0 will-change-transform text-[#F4F1EA]">
              your
            </span>

            {/* WORD "own": 3D flip-up reveal */}
            <span className="your-own-word2 inline-block transform-gpu opacity-0 will-change-transform text-[#F4F1EA]">
              own
            </span>

            {/* FLOATING BOTTOM GEOMETRICAL S-TO-U BEZIER GLIDER: GLIDES FROM "c" OF "custom" TO "." OF "curves." */}
            <div
              ref={customCurveRef}
              className="custom-bezier-element absolute -bottom-36 sm:-bottom-46 lg:-bottom-56 left-0 z-20 pointer-events-none opacity-0 select-none transform-gpu"
            >
              <div className="w-38 h-28 sm:w-52 sm:h-38 lg:w-68 lg:h-50 transform-gpu">
                <svg viewBox="0 0 200 150" className="w-full h-full overflow-visible">
                  <defs>
                    {/* 1. Ultra-Refined High-Gloss Metallic Chrome Emerald Anchor Gradient */}
                    <linearGradient id="metallicEmeraldAnchorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="20%" stopColor="#E2E8F0" />
                      <stop offset="45%" stopColor="#34D399" />
                      <stop offset="75%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#022C22" />
                    </linearGradient>

                    {/* 2. Sleek Platinum Champagne Metallic Curve Line Gradient */}
                    <linearGradient id="metallicCurveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="30%" stopColor="#F8FAFC" />
                      <stop offset="60%" stopColor="#CBD5E1" />
                      <stop offset="85%" stopColor="#E2E8F0" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>

                    {/* 3. Metallic Chrome Handle Gradient */}
                    <linearGradient id="metallicHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="25%" stopColor="#A7F3D0" />
                      <stop offset="65%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>

                    {/* 4. Delicate Ambient Specular Sheen (No Fuzzy Neon Glow) */}
                    <filter id="subtleSpecular" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#00E83F" floodOpacity="0.35" />
                    </filter>
                  </defs>
                  <g>
                    {/* Guideline 1 (Delicate & Skinny) */}
                    <line
                      ref={customLine1Ref}
                      x1="25"
                      y1="25"
                      x2="175"
                      y2="25"
                      stroke="#FFFDE7"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                      strokeOpacity="0.75"
                    />
                    {/* Guideline 2 (Delicate & Skinny) */}
                    <line
                      ref={customLine2Ref}
                      x1="25"
                      y1="125"
                      x2="175"
                      y2="125"
                      stroke="#FFFDE7"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                      strokeOpacity="0.75"
                    />

                    {/* Skinny Metallic Cubic Bezier Curve */}
                    <path
                      ref={customPathRef}
                      d="M 25 125 C 175 125, 25 25, 175 25"
                      fill="none"
                      stroke="url(#metallicCurveGrad)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />

                    {/* Handle 1 (Skinny Chrome-Rimmed Circle) */}
                    <circle
                      ref={customHandle1Ref}
                      cx="25"
                      cy="25"
                      r="7.5"
                      fill="url(#metallicHandleGrad)"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      filter="url(#subtleSpecular)"
                    />

                    {/* Anchor 2 (Top Right - Skinny Metallic Square) */}
                    <rect
                      ref={customAnchor2Ref}
                      x="166"
                      y="16"
                      width="18"
                      height="18"
                      rx="3"
                      fill="url(#metallicEmeraldAnchorGrad)"
                      stroke="rgba(255,255,255,0.95)"
                      strokeWidth="1.2"
                      filter="url(#subtleSpecular)"
                    />

                    {/* Anchor 1 (Bottom Left -> Top Left - Skinny Metallic Square) */}
                    <rect
                      ref={customAnchor1Ref}
                      x="16"
                      y="116"
                      width="18"
                      height="18"
                      rx="3"
                      fill="url(#metallicEmeraldAnchorGrad)"
                      stroke="rgba(255,255,255,0.95)"
                      strokeWidth="1.2"
                      filter="url(#subtleSpecular)"
                    />

                    {/* Handle 2 (Skinny Chrome-Rimmed Circle) */}
                    <circle
                      ref={customHandle2Ref}
                      cx="175"
                      cy="125"
                      r="7.5"
                      fill="url(#metallicHandleGrad)"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      filter="url(#subtleSpecular)"
                    />
                  </g>
                </svg>
              </div>
            </div>

            {/* WORD "custom": Normal style like other sentence words */}
            <span className="custom-word inline-flex overflow-hidden text-[#F4F1EA]">
              {"custom".split("").map((letter, idx) => (
                <span
                  key={idx}
                  className="custom-letter inline-block transform-gpu origin-bottom opacity-0 will-change-transform"
                >
                  {letter}
                </span>
              ))}
            </span>

            {/* WORD "virality": Bold luminous emerald kinetic text */}
            <span className="virality-curve-word1 inline-flex overflow-hidden font-extrabold text-[#00E83F]">
              {"virality".split("").map((letter, idx) => (
                <span
                  key={idx}
                  className="virality-letter inline-block transform-gpu origin-bottom opacity-0 will-change-transform"
                >
                  {letter}
                </span>
              ))}
            </span>

            {/* WORD "curves.": Smooth stomp drop */}
            <span className="curves-word inline-block transform-gpu opacity-0 will-change-transform font-bold text-[#F4F1EA]">
              curves.
            </span>
          </span>

          {/* 3-BAR STACKED COMPOSITION: "100 AI Agents" + "Synthetic Swarm" + "in a snap" (White Outline Alignment, Straight, Normal Size, Decreased Radius) */}
          <div
            ref={agentSwarmGroupRef}
            className="agent-swarm-composition relative inline-flex items-center min-w-[540px] sm:min-w-[820px] lg:min-w-[1140px] h-36 sm:h-52 lg:h-64 mx-4 sm:mx-8 align-middle select-none [perspective:1000px]"
          >
            {/* 1. "100 AI Agents" (Emerald Bar - Base anchor, Straight, Rounded-2xl matching Predict Virality) */}
            <div
              ref={sticker100AgentsRef}
              className="sticker-100-agents absolute left-0 z-30 inline-block px-6 py-2.5 sm:px-9 sm:py-3.5 lg:px-11 lg:py-4.5 rounded-2xl bg-[#00E83F] text-black font-bold text-4xl sm:text-6xl lg:text-7xl shadow-[0_16px_36px_rgba(0,0,0,0.85)] border-2 border-black rotate-0 transform-gpu opacity-0 will-change-transform whitespace-nowrap tracking-normal pointer-events-auto"
            >
              100 AI A<span ref={letterGRef}>g</span>ents
            </div>

            {/* 2. "Synthetic Swarm" (Orange Bar - Slides down to exact white outline below the 'A' of AI Agents) */}
            <div
              ref={stickerSyntheticSwarmRef}
              className="sticker-synthetic-swarm absolute left-0 z-20 inline-block px-6 py-2.5 sm:px-9 sm:py-3.5 lg:px-11 lg:py-4.5 rounded-2xl bg-[#FF7A00] text-black font-bold text-4xl sm:text-6xl lg:text-7xl shadow-[0_16px_36px_rgba(0,0,0,0.85)] border-2 border-black rotate-0 transform-gpu opacity-0 will-change-transform whitespace-nowrap tracking-normal pointer-events-auto"
            >
              Synthetic <span ref={letterSwarmSRef}>S</span>warm
            </div>

            {/* 3. "in a snap" (Yellow Bar - Emerges from behind towards top right) */}
            <div
              ref={stickerInASnapRef}
              className="sticker-in-a-snap absolute left-0 z-10 inline-block px-6 py-2.5 sm:px-9 sm:py-3.5 lg:px-11 lg:py-4.5 rounded-2xl bg-[#FFE500] text-black font-bold text-4xl sm:text-6xl lg:text-7xl shadow-[0_16px_36px_rgba(0,0,0,0.85)] border-2 border-black rotate-0 transform-gpu opacity-0 will-change-transform whitespace-nowrap tracking-normal pointer-events-auto"
            >
              in a snap
            </div>

            {/* 4. AGENT KEYHOLE ELEMENT: Textured Metallic Pink Chrome with Specular Bevel */}
            <div
              ref={swarmBridgeElementRef}
              className="swarm-bridge-element absolute left-0 z-40 inline-flex items-center justify-center pointer-events-none opacity-0 transform-gpu"
            >
              <div
                ref={swarmBridgeSpinnerRef}
                className="w-10 h-12 sm:w-14 sm:h-16 lg:w-16 lg:h-20 shrink-0 transform-gpu"
              >
                <svg viewBox="0 0 60 70" className="w-full h-full overflow-visible">
                  <defs>
                    {/* Textured Metallic Pink Chrome Gradient */}
                    <linearGradient id="metallicPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="12%" stopColor="#FCE7F3" />
                      <stop offset="28%" stopColor="#F472B6" />
                      <stop offset="42%" stopColor="#FFFFFF" />
                      <stop offset="55%" stopColor="#EC4899" />
                      <stop offset="70%" stopColor="#BE185D" />
                      <stop offset="85%" stopColor="#F472B6" />
                      <stop offset="95%" stopColor="#831843" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>

                    {/* Radial Specular Highlight */}
                    <radialGradient id="metallicPinkCoreGlow" cx="50%" cy="30%" r="55%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#F472B6" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#9D174D" stopOpacity="0" />
                    </radialGradient>

                    {/* Specular Ambient Glow & Drop Shadow */}
                    <filter id="metallicPinkDrop" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.85" />
                      <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#F472B6" floodOpacity="0.5" />
                    </filter>
                  </defs>
                  <g filter="url(#metallicPinkDrop)">
                    {/* Metallic Pink Chrome Keyhole Body */}
                    <path
                      d="M 30 4 A 16 16 0 0 1 43.6 30.8 L 56 67 A 3 3 0 0 1 53 70 L 7 70 A 3 3 0 0 1 4 67 L 16.4 30.8 A 16 16 0 0 1 30 4 Z"
                      fill="url(#metallicPinkGrad)"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    {/* Radial Specular Overlay */}
                    <path
                      d="M 30 4 A 16 16 0 0 1 43.6 30.8 L 56 67 A 3 3 0 0 1 53 70 L 7 70 A 3 3 0 0 1 4 67 L 16.4 30.8 A 16 16 0 0 1 30 4 Z"
                      fill="url(#metallicPinkCoreGlow)"
                    />
                    {/* Inner Metallic Bevel Ridge (Textured Inner Seam) */}
                    <path
                      d="M 30 10 A 10 10 0 0 1 38.5 26.5 L 46 62 L 14 62 L 21.5 26.5 A 10 10 0 0 1 30 10 Z"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.75)"
                      strokeWidth="1.2"
                      strokeDasharray="4 2"
                    />
                    {/* Metallic Specular Core Pin */}
                    <circle cx="30" cy="20" r="4.5" fill="#FFFFFF" fillOpacity="0.95" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* PHRASE 7: "before you publish." (Normal Text Matching Sentence with Kinetic 3D Wave Reveal) */}
          <span ref={phrase7Ref} className="phrase-7 inline-flex items-baseline gap-[0.38em] shrink-0 ml-20 sm:ml-32 lg:ml-44 mr-8 sm:mr-14 select-none align-baseline [perspective:1000px]">
            <span className="before-word inline-block transform-gpu opacity-0 will-change-transform text-[#F4F1EA]">
              before
            </span>
            <span className="you-word inline-block transform-gpu opacity-0 will-change-transform text-[#F4F1EA]">
              you
            </span>
            <span className="publish-word inline-flex overflow-hidden text-[#F4F1EA]">
              {"publish.".split("").map((letter, idx) => (
                <span
                  key={idx}
                  className="publish-letter inline-block transform-gpu origin-bottom opacity-0 will-change-transform"
                >
                  {letter}
                </span>
              ))}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
