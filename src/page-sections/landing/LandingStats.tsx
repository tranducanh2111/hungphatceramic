"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Text } from "@/components/ui";
import { STATS, type StatItem } from "@/constants/landing";
import { OrbitalRingScene } from "@/components/3d/OrbitalRingScene";

function useCountUp(target: number, isActive: boolean, duration = 1800) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const startTime = performance.now();
    const startValue = 0;

    function tick(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(startValue + easedProgress * target));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [target, isActive, duration]);

  return displayValue;
}

function StatCounter({ stat }: { stat: StatItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useCountUp(stat.numericValue, isInView);

  const formattedValue =
    stat.numericValue >= 1000
      ? `${Math.floor(count / 1000)}k`
      : count.toString();

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <Text variant="display-xl" className="font-serif font-light text-[#D4B886]">
        {formattedValue}
        {stat.suffix}
      </Text>
      <Text variant="body-sm" className="mt-2 text-[#F4F4F6]/50">
        {stat.label}
      </Text>
    </div>
  );
}

/**
 * LandingStats — Credibility through scale. Numbers animate on scroll entry.
 */
export function LandingStats() {
  return (
    <section className="relative overflow-hidden bg-[#071A2B] py-28 lg:py-32">
      <OrbitalRingScene />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Decorative line */}
        <div className="mb-16 flex items-center gap-6">
          <div className="h-px flex-1 bg-[#1A3D5C]" />
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="font-sans text-label uppercase tracking-widest text-[#D4B886]"
          >
            By the Numbers
          </motion.span>
          <div className="h-px flex-1 bg-[#1A3D5C]" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-12 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatCounter key={stat.label} stat={stat} />
          ))}
        </div>

        {/* Supporting line */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Text variant="body-lg" className="italic text-[#F4F4F6]/40">
            "Every number is a space transformed, a client trusted, a detail perfected."
          </Text>
        </motion.div>
      </div>
    </section>
  );
}
