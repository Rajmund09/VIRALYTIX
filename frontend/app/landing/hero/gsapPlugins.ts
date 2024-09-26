"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { CustomEase } from "gsap/CustomEase";
import { Observer } from "gsap/Observer";

// Register available plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase, Observer);

  // Register custom signature ease curves for VIRALYTIX editorial motion
  try {
    CustomEase.create("viralytixEase", "M0,0 C0.16,1 0.3,1 1,1");
    CustomEase.create("heroPowerOut", "M0,0 C0.05,0.7 0.1,1 1,1");
    CustomEase.create("cinemaEase", "M0,0 C0.08,0.82 0.17,1 1,1");
    CustomEase.create("letterAssembly", "M0,0 C0.22,1 0.36,1 1,1");
  } catch (e) {
    console.warn("CustomEase init fallback", e);
  }
}

/**
 * Robust ScrambleText micro-interaction helper using GSAP ticker/timeline.
 * Scrambles numeric and technical string values into final text.
 */
export const scrambleText = (
  element: HTMLElement | null,
  finalText: string,
  duration = 1.0,
  chars = "0123456789ABCDEF#$/@%&*"
) => {
  if (!element) return;
  const length = finalText.length;
  const obj = { progress: 0 };

  gsap.to(obj, {
    progress: 1,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      const revealedLength = Math.floor(obj.progress * length);
      let scrambled = finalText.substring(0, revealedLength);
      for (let i = revealedLength; i < length; i++) {
        if (finalText[i] === " " || finalText[i] === "." || finalText[i] === "=" || finalText[i] === "•" || finalText[i] === "/") {
          scrambled += finalText[i];
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      element.innerText = scrambled;
    },
    onComplete: () => {
      element.innerText = finalText;
    },
  });
};

/**
 * Robust SVG path morphing interpolation helper when MorphSVGPlugin is omitted.
 * Interpolates between two SVG d attribute path strings with matching command lengths or via CSS/GSAP.
 */
export const morphSvgPath = (
  pathElement: SVGPathElement | null,
  targetD: string,
  duration = 1.2,
  ease = "power2.inOut"
) => {
  if (!pathElement) return;
  gsap.to(pathElement, {
    attr: { d: targetD },
    duration,
    ease,
  });
};

export { gsap, ScrollTrigger, ScrollToPlugin, CustomEase, Observer };
