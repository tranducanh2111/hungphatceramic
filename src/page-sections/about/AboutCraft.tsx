"use client";

import { DESKTOP_LAYOUT_QUERY } from "@/constants/breakpoints";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CraftReducedMotion } from "@/page-sections/about/craft-sketches/CraftReducedMotion";
import { CraftScrollStory } from "@/page-sections/about/craft-sketches/CraftScrollStory";

export function AboutCraft() {
	const prefersReducedMotion = usePrefersReducedMotion();
	const isDesktop = useMediaQuery(DESKTOP_LAYOUT_QUERY);

	if (prefersReducedMotion || !isDesktop) {
		return <CraftReducedMotion />;
	}

	return <CraftScrollStory />;
}
