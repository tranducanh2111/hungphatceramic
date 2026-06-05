"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { useLenis } from "lenis/react";

/**
 * Lenis owns scroll position separately from the Next.js router.
 * Without resetting on route change, the next page opens at the previous scroll offset.
 */
export function ScrollToTopOnNavigate() {
	const pathname = usePathname();
	const lenis = useLenis();
	const isInitialRender = useRef(true);

	useEffect(() => {
		if ("scrollRestoration" in history) {
			history.scrollRestoration = "manual";
		}
	}, []);

	useEffect(() => {
		if (isInitialRender.current) {
			isInitialRender.current = false;
			return;
		}

		// In-page anchors (e.g. /about#our-story) are handled by the destination page.
		if (window.location.hash) {
			return;
		}

		const resetScroll = () => {
			if (lenis) {
				lenis.scrollTo(0, { immediate: true, force: true });
				return;
			}

			window.scrollTo({ top: 0, left: 0, behavior: "instant" });
		};

		resetScroll();
		requestAnimationFrame(resetScroll);
	}, [pathname, lenis]);

	return null;
}