"use client";

import { motion } from "framer-motion";
import { useAppScroll } from "@/hooks/useAppScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const DESKTOP_SCROLL_QUERY = "(min-width: 1024px)";

function ScrollProgressBarTrack() {
	const { scrollYProgress } = useAppScroll();

	return (
		<div
			className="pointer-events-none fixed top-1/2 right-5 z-50 flex -translate-y-1/2"
			aria-hidden="true"
		>
			<div className="relative h-32 w-px overflow-hidden rounded-full bg-white/8">
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

/**
 * ScrollProgressBar (fixed right-edge vertical progress indicator).
 * Desktop-only (Framer scroll tracking is not mounted on mobile).
 */
export function ScrollProgressBar() {
	const isDesktop = useMediaQuery(DESKTOP_SCROLL_QUERY);

	if (!isDesktop) {
		return null;
	}

	return <ScrollProgressBarTrack />;
}
