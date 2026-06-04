"use client";

import { useMemo } from "react";
import { useScroll, type UseScrollOptions } from "framer-motion";
import { useLenis } from "lenis/react";

/**
 * Scroll progress tied to Lenis root when available, so Framer scroll
 * animations stay in sync with smooth scroll.
 */
export function useAppScroll(options: UseScrollOptions = {}) {
	const lenis = useLenis();

	const container = useMemo(() => {
		const root = lenis?.rootElement;
		if (!root || root === document.documentElement || root === document.body) {
			return undefined;
		}
		return { current: root };
	}, [lenis]);

	return useScroll({
		...options,
		...(container ? { container } : {}),
	});
}
