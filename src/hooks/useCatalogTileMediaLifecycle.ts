"use client";

import {
	useViewportMediaLifecycle,
	type ViewportMediaLifecycleOptions,
} from "@/hooks/useViewportMediaLifecycle";

interface CatalogTileMediaLifecycleOptions {
	isDeferred: boolean;
}

/** Catalog grid tuning (slightly tighter margins than the site-wide defaults) */
export function useCatalogTileMediaLifecycle({ isDeferred }: CatalogTileMediaLifecycleOptions) {
	const options: ViewportMediaLifecycleOptions = {
		isDeferred,
		loadRootMargin: "280px 0px",
		unloadRootMargin: "640px 0px",
	};

	return useViewportMediaLifecycle(options);
}
