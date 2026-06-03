"use client";

import { motion } from "framer-motion";
import { useAppScroll } from "@/hooks/useAppScroll";

/**
 * ScrollProgressBar — Fixed right-edge vertical progress indicator.
 *
 * A thin champagne-gold line fills from top to bottom as the user
 * scrolls through the page. Desktop-only (hidden on mobile).
 */
export function ScrollProgressBar() {
	const { scrollYProgress } = useAppScroll();

	return (
		<div
			className="pointer-events-none fixed top-1/2 right-5 z-50 hidden -translate-y-1/2 lg:flex"
			aria-hidden="true"
		>
			{/* Track */}
			<div className="relative h-32 w-px overflow-hidden rounded-full bg-white/8">
				{/* Fill */}
				<motion.div
					className="absolute top-0 left-0 w-full rounded-full bg-[#D4B886]"
					style={{
						height: "100%",
						scaleY: scrollYProgress,
						transformOrigin: "top",
					}}
				/>
			</div>
		</div>
	);
}
