"use client";

import { useRef, type ReactNode } from "react";
import { motion, useTransform } from "framer-motion";
import { DESKTOP_LAYOUT_QUERY } from "@/constants/breakpoints";
import { cn } from "@/lib/cn";
import { useAppScroll } from "@/hooks/useAppScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DEFAULT_PARALLAX_RANGE_PX } from "./parallaxStyles";

/** Scroll progress window where opacity eases from 0 to 1 (slow reveal). */
const FADE_IN_PROGRESS_END = 0.55;

export interface ScrollParallaxProps {
	rangePx?: number;
	invert?: boolean;
	fadeIn?: boolean;
	className?: string;
	children?: ReactNode;
}

function ScrollParallaxAnimated({
	rangePx = DEFAULT_PARALLAX_RANGE_PX,
	invert = false,
	fadeIn = false,
	className,
	children,
}: ScrollParallaxProps) {
	const parallaxRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useAppScroll({
		target: parallaxRef,
		offset: ["start end", "end start"],
	});

	const parallaxY = useTransform(
		scrollYProgress,
		[0, 1],
		invert ? [rangePx, -rangePx] : [-rangePx, rangePx],
	);

	const scrollOpacity = useTransform(scrollYProgress, [0, FADE_IN_PROGRESS_END, 1], [0, 1, 1]);

	return (
		<motion.div
			ref={parallaxRef}
			style={{
				y: parallaxY,
				...(fadeIn ? { opacity: scrollOpacity } : {}),
			}}
			className={cn("transform-gpu", className)}
		>
			{children}
		</motion.div>
	);
}

/**
 * Per-element vertical parallax driven by the element's scroll through the viewport.
 * Optional `fadeIn` adds a scroll-linked 0→1 opacity reveal on the same timeline.
 */
export function ScrollParallax({
	rangePx = DEFAULT_PARALLAX_RANGE_PX,
	invert = false,
	fadeIn = false,
	className,
	children,
}: ScrollParallaxProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const isDesktop = useMediaQuery(DESKTOP_LAYOUT_QUERY);

	if (prefersReducedMotion || !isDesktop) {
		return <div className={className}>{children}</div>;
	}

	return (
		<ScrollParallaxAnimated
			rangePx={rangePx}
			invert={invert}
			fadeIn={fadeIn}
			className={className}
		>
			{children}
		</ScrollParallaxAnimated>
	);
}
