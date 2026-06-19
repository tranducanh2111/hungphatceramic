"use client";

import { useEffect, useRef, useState } from "react";
import { observeSharedViewportIntersection } from "@/lib/sharedViewportObserver";

export interface ViewportMediaLifecycleOptions {
	/** When false, media stays mounted (heroes, above-the-fold LCP). */
	isDeferred?: boolean;
	loadRootMargin?: string;
	unloadRootMargin?: string;
}

const DEFAULT_LOAD_ROOT_MARGIN = "320px 0px";
const DEFAULT_UNLOAD_ROOT_MARGIN = "720px 0px";

/** Mounts media near the viewport and unmounts when scrolled away (limits decoded image memory) */
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

		const unobserveLoad = observeSharedViewportIntersection(
			observedElement,
			loadRootMargin,
			(isIntersecting) => {
				if (isIntersecting) {
					setIsObservedMounted(true);
				}
			},
		);

		const unobserveUnload = observeSharedViewportIntersection(
			observedElement,
			unloadRootMargin,
			(isIntersecting) => {
				if (!isIntersecting) {
					setIsObservedMounted(false);
				}
			},
		);

		return () => {
			unobserveLoad();
			unobserveUnload();
		};
	}, [isDeferred, loadRootMargin, unloadRootMargin]);

	return { containerRef, isMediaMounted };
}
