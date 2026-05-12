"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Button } from "@/components/ui";

// Dynamically import the 3D scene — no SSR, only loaded on desktop
const CeramicTileScene = dynamic(
  () => import("@/components/3d/CeramicTileScene").then((m) => m.CeramicTileScene),
  { ssr: false },
);

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" as const, delay },
  }),
};

const scrollIndicator: Variants = {
  animate: {
    y: [0, 10, 0],
    opacity: [0.5, 1, 0.5],
    transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const },
  },
};

/** Detect if we're on a desktop device to conditionally load 3D */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.matchMedia("(min-width: 1024px)").matches);
  }, []);
  return isDesktop;
}

/**
 * LandingHero — Full-screen cinematic hero.
 *
 * Desktop: 3D floating ceramic tile (React Three Fiber) + mouse parallax + SVG frame.
 * Mobile: gradient background only — no Three.js loaded.
 */
export function LandingHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();

  // Normalized mouse position [-1, 1]
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll progress within the hero section [0 → 1]
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Text fades and moves up as user exits the hero
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden" style={{ position: "relative" }}>
      {/* ── Gradient background (always shown) ───────────────────────── */}
      <div className="absolute inset-0 bg-[#071A2B]" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,#1A3D5C_0%,#071A2B_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,#0E2A42_0%,transparent_60%)]" />
      </div>

      {/* ── Video (when provided) ─────────────────────────────────────── */}
      {/* 
        TODO: Uncomment and replace with the real video when provided by the client.
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      */}

      {/* ── Cinematic overlay ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#071A2B]/50 via-transparent to-[#071A2B]/90"
        aria-hidden="true"
      />

      {/* ── 3D Tile Scene (desktop only) ─────────────────────────────── */}
      {isDesktop && (
        <div className="absolute inset-0 z-[1]" aria-hidden="true">
          <CeramicTileScene
            mouseX={mousePos.x}
            mouseY={mousePos.y}
            scrollProgress={scrollYProgress.get()}
          />
        </div>
      )}

      {/* ── Animated SVG frame border around the tile area (desktop) ──── */}
      {isDesktop && (
        <div
          className="pointer-events-none absolute right-[8%] top-1/2 z-[2] hidden h-[55%] w-[48%] -translate-y-1/2 lg:block"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            stroke="#D4B886"
            strokeWidth="0.4"
            className="h-full w-full opacity-40"
            preserveAspectRatio="none"
          >
            <motion.rect
              x="2"
              y="2"
              width="96"
              height="96"
              rx="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.5, ease: "easeInOut" as const, delay: 1 }}
            />
          </svg>
        </div>
      )}

      {/* ── Hero Content ──────────────────────────────────────────────── */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center lg:items-start lg:px-24"
      >
        <motion.span
          custom={0}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="inline-block rounded-full border border-[#D4B886]/25 bg-[#D4B886]/6 px-5 py-2 font-sans text-label-sm uppercase tracking-widest text-[#D4B886] backdrop-blur-sm"
        >
          Luxury Ceramic Interior
        </motion.span>

        <motion.h1
          custom={1}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 max-w-2xl font-serif text-display-xl font-light leading-[1.1] text-[#F4F4F6]"
        >
          Where Stone
          <br />
          <em className="italic text-[#D4B886]">Tells a Story</em>
        </motion.h1>

        <motion.p
          custom={2}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 max-w-md font-sans text-body-lg text-[#F4F4F6]/55"
        >
          Bespoke ceramic interiors for discerning spaces.
          <br />
          Crafted with precision, designed to endure.
        </motion.p>

        <motion.div
          custom={3}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button href="/projects" size="lg">
            Explore Our Work
          </Button>
          <Button href="/products" variant="secondary" size="lg">
            View Collection
          </Button>
        </motion.div>
      </motion.div>

      {/* ── Scroll Indicator ──────────────────────────────────────────── */}
      <motion.div
        variants={scrollIndicator}
        animate="animate"
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="font-sans text-footnote uppercase tracking-widest text-[#D4B886]/45">
          Scroll
        </span>
        <div className="h-12 w-px bg-gradient-to-b from-[#D4B886]/50 to-transparent" />
      </motion.div>
    </section>
  );
}