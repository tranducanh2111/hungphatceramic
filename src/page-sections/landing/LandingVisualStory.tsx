"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Text } from "@/components/ui";
import { VisualStoryRoomScene } from "@/components/3d/VisualStoryRoomScene";

/**
 * LandingVisualStory — Emotional peak section.
 * 3D Room Walkthrough driven by scroll.
 */
export function LandingVisualStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
  });

  // Text fades in when section is centered, fades out at end
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.8, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.3, 0.5], [24, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-[#071A2B] overflow-hidden"
      aria-label="3D Interior walkthrough"
    >
      {/* 3D Room Background */}
      <div className="absolute inset-0">
        <VisualStoryRoomScene scrollProgress={scrollProgress} />
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-[#071A2B]/40 pointer-events-none" />

      {/* Centered text reveal */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="max-w-2xl px-6 text-center"
        >
          <div className="mx-auto mb-6 h-px w-12 bg-[#D4B886]" />
          <Text variant="display-lg" className="font-serif font-light italic text-[#F4F4F6]">
            Details others overlook.
          </Text>
          <Text variant="h3" className="mt-3 font-serif font-light text-[#D4B886]">
            Craftsmanship that defines the whole.
          </Text>
        </motion.div>
      </div>
    </section>
  );
}
