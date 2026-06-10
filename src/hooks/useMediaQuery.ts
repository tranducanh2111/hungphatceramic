"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a media query with a stable `false` snapshot during SSR/hydration.
 */
export function useMediaQuery(query: string): boolean {
	return useSyncExternalStore(
		(onStoreChange) => {
			const mediaQueryList = window.matchMedia(query);
			mediaQueryList.addEventListener("change", onStoreChange);
			return () => mediaQueryList.removeEventListener("change", onStoreChange);
		},
		() => window.matchMedia(query).matches,
		() => false,
	);
}
