"use client";

import { useEffect, useRef, useState } from "react";

export interface ViewportMediaLifecycleOptions {
	/** When false, media stays mounted (heroes, above-the-fold LCP). */
	isDeferred?: boolean;
	loadRootMargin?: string;
	unloadRootMargin?: string;
}

const DEFAULT_LOAD_ROOT_MARGIN = "320px 0px";
const DEFAULT_UNLOAD_ROOT_MARGIN = "720px 0px";

/**
 * Mounts media near the viewport and unmounts when scrolled away — limits decoded image memory.
 */
export function useViewportMediaLifecycle({
	isDeferred = true,
	loadRootMargin = DEFAULT_LOAD_ROOT_MARGIN,
	unloadRootMargin = DEFAULT_UNLOAD_ROOT_MARGIN,
}: ViewportMediaLifecycleOptions = {}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isObservedMounted, setIsObservedMounted] = useState(false);
	const isMediaMounted = !isDeferred || isObservedMounted;

	useEffect(() => {
		if (!isDeferred) {
			return;
		}

		const observedElement = containerRef.current;
		if (!observedElement) {
			return;
		}

		const loadObserver = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setIsObservedMounted(true);
				}
			},
			{ rootMargin: loadRootMargin, threshold: 0 },
		);

		const unloadObserver = new IntersectionObserver(
			([entry]) => {
				if (entry && !entry.isIntersecting) {
					setIsObservedMounted(false);
				}
			},
			{ rootMargin: unloadRootMargin, threshold: 0 },
		);

		loadObserver.observe(observedElement);
		unloadObserver.observe(observedElement);

		return () => {
			loadObserver.disconnect();
			unloadObserver.disconnect();
		};
	}, [isDeferred, loadRootMargin, unloadRootMargin]);

	return { containerRef, isMediaMounted };
}
