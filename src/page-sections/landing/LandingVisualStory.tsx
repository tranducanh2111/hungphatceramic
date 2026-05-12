"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Text } from "@/components/ui";

/**
 * LandingVisualStory — Emotional peak section.
 * Full-screen image with parallax scroll and text fading in at mid-scroll.
 * Inspired by pieterkoopt.nl: the scroll moves through the image.
 */
export function LandingVisualStory() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax: image moves slower than the viewport
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  // Text fades in when section is centered, fades out at end
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.8, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.3, 0.5], [24, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
      aria-label="Craftsmanship close-up"
    >
      {/* Parallax image */}
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image
          src="/images/visual-story.jpg"
          alt="Close-up of polished porcelain tile surface with golden light"
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#071A2B]/55" />

      {/* Centered text reveal */}
      <div className="absolute inset-0 flex items-center justify-center">
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
