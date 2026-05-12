"use client";

import { useScroll, motion, useSpring } from "framer-motion";

/**
 * ScrollProgressBar — Fixed right-edge vertical progress indicator.
 *
 * A thin champagne-gold line fills from top to bottom as the user
 * scrolls through the page. Desktop-only (hidden on mobile).
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <div
      className="pointer-events-none fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 lg:flex"
      aria-hidden="true"
    >
      {/* Track */}
      <div className="relative h-32 w-px overflow-hidden rounded-full bg-white/8">
        {/* Fill */}
        <motion.div
          className="absolute left-0 top-0 w-full rounded-full bg-[#D4B886]"
          style={{
            height: "100%",
            scaleY: smoothProgress,
            transformOrigin: "top",
          }}
        />
      </div>
    </div>
  );
}
