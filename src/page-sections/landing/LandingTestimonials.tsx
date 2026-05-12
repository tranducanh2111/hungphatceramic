"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Text } from "@/components/ui";
import { TESTIMONIALS } from "@/constants/landing";

/**
 * LandingTestimonials — Animated carousel of client quotes.
 * ⚠️ Placeholder content — replace with real client quotes when received.
 */
export function LandingTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrev = () =>
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const goToNext = () =>
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);

  const activeTestimonial = TESTIMONIALS[activeIndex];

  return (
    <section className="bg-[#071A2B] py-28 lg:py-36">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-12">
        {/* Label */}
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-sans text-label uppercase tracking-widest text-[#D4B886]"
        >
          Client Voices
        </motion.span>

        {/* Large quote icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mt-8 flex justify-center"
        >
          <Quote className="h-12 w-12 text-[#D4B886]/25" />
        </motion.div>

        {/* Quote carousel */}
        <div className="relative mt-6 min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Text variant="h4" className="font-serif font-light italic text-[#F4F4F6]/80">
                &ldquo;{activeTestimonial.quote}&rdquo;
              </Text>

              <div className="mt-8 flex flex-col items-center gap-1">
                <div className="h-px w-8 bg-[#D4B886]" />
                <Text variant="body" className="mt-4 font-medium text-[#F4F4F6]">
                  {activeTestimonial.authorName}
                </Text>
                <Text variant="body-sm" className="text-[#F4F4F6]/50">
                  {activeTestimonial.authorTitle} — {activeTestimonial.authorCompany}
                </Text>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            onClick={goToPrev}
            aria-label="Previous testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1A3D5C] text-[#F4F4F6]/50 transition-all duration-300 hover:border-[#D4B886] hover:text-[#D4B886]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-6 bg-[#D4B886]" : "w-1.5 bg-[#1A3D5C]"
                }`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            aria-label="Next testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1A3D5C] text-[#F4F4F6]/50 transition-all duration-300 hover:border-[#D4B886] hover:text-[#D4B886]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
