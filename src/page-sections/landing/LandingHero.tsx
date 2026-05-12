"use client";

import { useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delayIndex: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut", delay: delayIndex * 0.15 },
  }),
};

const scrollIndicatorVariants: Variants = {
  animate: {
    y: [0, 10, 0],
    opacity: [0.6, 1, 0.6],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

/**
 * LandingHero — Full-screen video hero with cinematic overlay.
 * Video source is wired via /videos/hero.mp4 — placeholder until asset is provided.
 */
export function LandingHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* ── Video Background ───────────────────────────────────────────── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        poster="/images/hero-poster.jpg"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* ── Placeholder gradient shown until video loads ───────────────── */}
      <div className="absolute inset-0 bg-[#071A2B]" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,#1A3D5C_0%,#071A2B_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#071A2B] to-transparent" />
      </div>

      {/* ── Cinematic overlay on top of video ─────────────────────────── */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#071A2B]/60 via-[#071A2B]/40 to-[#071A2B]/80"
        aria-hidden="true"
      />

      {/* ── Hero Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.span
          custom={0}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            "inline-block rounded-full border border-[#D4B886]/20 bg-[#D4B886]/5 px-5 py-2",
            "font-sans text-label-sm uppercase tracking-widest text-[#D4B886]",
          )}
        >
          Luxury Ceramic Interior
        </motion.span>

        <motion.h1
          custom={1}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 max-w-4xl font-serif text-display-xl font-light leading-tight text-[#F4F4F6]"
        >
          Where Stone
          <br />
          <span className="italic text-[#D4B886]">Tells a Story</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 max-w-xl font-sans text-body-lg text-[#F4F4F6]/60"
        >
          Bespoke ceramic interiors for discerning spaces. Crafted with precision,
          designed to endure.
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
      </div>

      {/* ── Scroll Indicator ──────────────────────────────────────────── */}
      <motion.div
        variants={scrollIndicatorVariants}
        animate="animate"
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="font-sans text-footnote uppercase tracking-widest text-[#D4B886]/50">
          Scroll
        </span>
        <div className="h-10 w-px bg-gradient-to-b from-[#D4B886]/50 to-transparent" />
      </motion.div>
    </section>
  );
}