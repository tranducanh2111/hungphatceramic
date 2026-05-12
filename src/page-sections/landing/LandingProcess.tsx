"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Text } from "@/components/ui";
import { PROCESS_STEPS } from "@/constants/landing";
import { cn } from "@/lib/cn";

/**
 * LandingProcess — Scroll-driven 4-step timeline.
 * Inspired by kaatdm.com: the section is pinned while scroll drives the active step.
 */
export function LandingProcess() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(
      Math.floor(latest * PROCESS_STEPS.length),
      PROCESS_STEPS.length - 1,
    );
    setActiveStepIndex(index);
  });

  const activeStep = PROCESS_STEPS[activeStepIndex];

  return (
    /* Tall section — 400vh gives 100vh per step */
    <div ref={sectionRef} className="relative bg-[#0E2A42]" style={{ height: "400vh" }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <span className="font-sans text-label uppercase tracking-widest text-[#D4B886]">
              Our Process
            </span>
            <Text variant="h2" className="mt-3 text-[#F4F4F6]">
              How We Work
            </Text>
          </div>

          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* ── Left: Step list ─────────────────────────────────────── */}
            <div className="flex flex-col gap-0">
              {/* Vertical progress line */}
              <div className="relative mb-2 ml-6 h-px w-px">
                <div className="absolute left-0 top-0 h-full w-px bg-[#1A3D5C]" />
              </div>

              {PROCESS_STEPS.map((step, index) => {
                const isActive = index === activeStepIndex;
                const isPast = index < activeStepIndex;

                return (
                  <div key={step.id} className="relative flex items-start gap-5 py-5">
                    {/* Connector line */}
                    <div className="absolute left-5 top-0 h-full w-px bg-[#1A3D5C]" />

                    {/* Step number circle */}
                    <div
                      className={cn(
                        "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-sans text-body-sm font-medium transition-all duration-500",
                        isActive
                          ? "border-[#D4B886] bg-[#D4B886] text-[#071A2B]"
                          : isPast
                            ? "border-[#D4B886]/40 bg-[#D4B886]/10 text-[#D4B886]"
                            : "border-[#1A3D5C] bg-transparent text-[#F4F4F6]/30",
                      )}
                    >
                      {step.number}
                    </div>

                    {/* Step title */}
                    <Text
                      variant="h5"
                      className={cn(
                        "mt-2 transition-colors duration-500",
                        isActive ? "text-[#F4F4F6]" : "text-[#F4F4F6]/35",
                      )}
                    >
                      {step.title}
                    </Text>
                  </div>
                );
              })}
            </div>

            {/* ── Right: Active step detail ──────────────────────────── */}
            <motion.div
              key={activeStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="rounded-2xl border border-[#1A3D5C] bg-[#071A2B]/50 p-8 backdrop-blur-sm lg:p-10"
            >
              <Text
                variant="display-lg"
                className="font-serif font-light text-[#D4B886]/20 select-none"
              >
                {activeStep.number}
              </Text>
              <Text variant="h3" className="mt-2 text-[#F4F4F6]">
                {activeStep.title}
              </Text>
              <div className="my-5 h-px w-12 bg-[#D4B886]" />
              <Text variant="body-lg" className="text-[#F4F4F6]/65 leading-relaxed">
                {activeStep.description}
              </Text>

              {/* Progress dots */}
              <div className="mt-8 flex gap-2">
                {PROCESS_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 rounded-full transition-all duration-500",
                      i === activeStepIndex
                        ? "w-8 bg-[#D4B886]"
                        : i < activeStepIndex
                          ? "w-4 bg-[#D4B886]/40"
                          : "w-4 bg-[#1A3D5C]",
                    )}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
