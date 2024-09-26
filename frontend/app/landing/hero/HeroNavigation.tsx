"use client";

import React, { useRef, useLayoutEffect } from "react";
import { Zap, ArrowRight } from "lucide-react";
import { gsap, ScrollToPlugin } from "./gsapPlugins";

interface HeroNavigationProps {
  onLaunchApp: () => void;
}

export const HeroNavigation: React.FC<HeroNavigationProps> = ({ onLaunchApp }) => {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  // Entrance animation for header elements
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "viralytixEase" } });

      tl.fromTo(
        logoRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
        .fromTo(
          itemsRef.current ? itemsRef.current.children : [],
          { y: -15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          "-=0.3"
        )
        .fromTo(
          btnRef.current,
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 },
          "-=0.2"
        );
    }, navRef);

    return () => ctx.revert();
  }, []);

  // ScrollToPlugin Handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (typeof window === "undefined") return;

    const target = document.querySelector(targetId);
    if (target) {
      gsap.to(window, {
        duration: 1.1,
        scrollTo: {
          y: target,
          offsetY: 80,
        },
        ease: "viralytixEase",
      });
    }
  };

  // Button Hover Micro-interactions using GSAP
  const handleMouseEnter = () => {
    if (btnRef.current && arrowRef.current) {
      gsap.to(btnRef.current, {
        scale: 1.02,
        backgroundColor: "#00E83F",
        color: "#111111",
        boxShadow: "0 8px 24px rgba(0, 232, 63, 0.35)",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(arrowRef.current, {
        x: 5,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (btnRef.current && arrowRef.current) {
      gsap.to(btnRef.current, {
        scale: 1,
        backgroundColor: "#111111",
        color: "#F5F1E6",
        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(arrowRef.current, {
        x: 0,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0B0B0A]/90 border-b border-[#F5F1E6]/10 px-6 md:px-12 py-4 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div ref={logoRef} className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="w-8 h-8 rounded-lg bg-[#00E83F] flex items-center justify-center shadow-[0_0_15px_rgba(0,232,63,0.4)]">
            <Zap className="w-4 h-4 text-[#0B0B0A] fill-[#0B0B0A]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#F5F1E6] font-mono">
            VIRALYTIX
          </span>
        </div>

        {/* Navigation Links with ScrollToPlugin */}
        <nav ref={itemsRef} className="hidden md:flex items-center gap-10 text-xs font-mono tracking-widest text-[#F5F1E6]/70 uppercase font-semibold">
          <a
            href="#signals"
            onClick={(e) => handleNavClick(e, "#signals")}
            className="hover:text-[#00E83F] transition-colors"
          >
            SIGNALS
          </a>
          <a
            href="#swarm"
            onClick={(e) => handleNavClick(e, "#swarm")}
            className="hover:text-[#00E83F] transition-colors"
          >
            SWARM
          </a>
          <a
            href="#models"
            onClick={(e) => handleNavClick(e, "#models")}
            className="hover:text-[#00E83F] transition-colors"
          >
            MODELS
          </a>
          <a
            href="#explainability"
            onClick={(e) => handleNavClick(e, "#explainability")}
            className="hover:text-[#00E83F] transition-colors"
          >
            SHAP
          </a>
        </nav>

        {/* Action Button */}
        <button
          ref={btnRef}
          onClick={onLaunchApp}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="group px-6 py-2.5 rounded-full bg-[#F5F1E6] text-[#0B0B0A] font-mono font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-[0_4px_14px_rgba(245,241,230,0.15)] active:scale-95"
        >
          <span>LAUNCH ENGINE</span>
          <ArrowRight ref={arrowRef} className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
