"use client";

import { useEffect, useRef, useState } from "react";

/** Prefetch media shortly before a tile enters the viewport. */
const CATALOG_TILE_LOAD_ROOT_MARGIN = "280px 0px";
/** Drop decoded bitmaps once a tile is well outside the viewport. */
const CATALOG_TILE_UNLOAD_ROOT_MARGIN = "640px 0px";

interface CatalogTileMediaLifecycleOptions {
	isDeferred: boolean;
}

/**
 * Mounts catalog tile images only near the viewport and unmounts them when far away
 * to limit DOM nodes and decoded image memory on long product grids.
 */
export function useCatalogTileMediaLifecycle({ isDeferred }: CatalogTileMediaLifecycleOptions) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isMediaMounted, setIsMediaMounted] = useState(!isDeferred);

	useEffect(() => {
		if (!isDeferred) {
			setIsMediaMounted(true);
			return;
		}

		const tileElement = containerRef.current;
		if (!tileElement) {
			return;
		}

		const loadObserver = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setIsMediaMounted(true);
				}
			},
			{ rootMargin: CATALOG_TILE_LOAD_ROOT_MARGIN, threshold: 0 },
		);

		const unloadObserver = new IntersectionObserver(
			([entry]) => {
				if (entry && !entry.isIntersecting) {
					setIsMediaMounted(false);
				}
			},
			{ rootMargin: CATALOG_TILE_UNLOAD_ROOT_MARGIN, threshold: 0 },
		);

		loadObserver.observe(tileElement);
		unloadObserver.observe(tileElement);

		return () => {
			loadObserver.disconnect();
			unloadObserver.disconnect();
		};
	}, [isDeferred]);

	return { containerRef, isMediaMounted };
}
