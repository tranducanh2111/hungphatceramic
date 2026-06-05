"use client";

import { useTransform, useMotionTemplate, type MotionValue } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const SCROLL_EXPAND_END = 0.6;

function interpolateHeroProgress(progress: number, start: number, end: number): number {
	if (progress >= SCROLL_EXPAND_END) {
		return end;
	}
	const t = progress / SCROLL_EXPAND_END;
	return start + (end - start) * t;
}

interface CinematicHeroClipInsets {
	vertical: number;
	horizontal: number;
	radius: number;
	videoOpacity: number;
}

function resolveClipInsets(isPhone: boolean, isTablet: boolean): CinematicHeroClipInsets {
	if (isPhone) {
		return { vertical: 0, horizontal: 0, radius: 0, videoOpacity: 0.88 };
	}
	if (isTablet) {
		return { vertical: 8, horizontal: 5, radius: 18, videoOpacity: 0.72 };
	}
	return { vertical: 24, horizontal: 11, radius: 24, videoOpacity: 0.55 };
}

/**
 * Scroll-linked letterbox clip for cinematic heroes — tighter insets on narrow viewports
 * so background video stays behind headline, body, and CTAs.
 */
export function useCinematicHeroClip(scrollYProgress: MotionValue<number>) {
	const isPhone = useMediaQuery("(max-width: 639px)");
	const isTablet = useMediaQuery("(max-width: 1023px)");

	const clipVertical = useTransform(scrollYProgress, (progress) => {
		const { vertical } = resolveClipInsets(isPhone, isTablet);
		return interpolateHeroProgress(progress, vertical, 0);
	});

	const clipHorizontal = useTransform(scrollYProgress, (progress) => {
		const { horizontal } = resolveClipInsets(isPhone, isTablet);
		return interpolateHeroProgress(progress, horizontal, 0);
	});

	const borderRadius = useTransform(scrollYProgress, (progress) => {
		const { radius } = resolveClipInsets(isPhone, isTablet);
		return interpolateHeroProgress(progress, radius, 0);
	});

	const clipPath = useMotionTemplate`inset(${clipVertical}% ${clipHorizontal}% round ${borderRadius}px)`;

	const videoOpacity = useTransform(scrollYProgress, (progress) => {
		const { videoOpacity } = resolveClipInsets(isPhone, isTablet);
		return interpolateHeroProgress(progress, videoOpacity, 1);
	});

	const videoScale = useTransform(scrollYProgress, (progress) =>
		interpolateHeroProgress(progress, 1.08, 1),
	);

	return { clipPath, videoOpacity, videoScale };
}
