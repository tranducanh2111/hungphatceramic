"use client";

import { useSyncExternalStore } from "react";

/** `false` during SSR and the hydration pass; `true` once the client has committed. */
export function useIsClient(): boolean {
	return useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	);
}
