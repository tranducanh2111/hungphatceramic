/**
 * Helpers for product images under `public/assets/**` (spaces, unicode path segments).
 */

import type { ProductCatalogEntry, ProductDetail } from "@/types";

/** Encode `/assets/...` paths for `next/image` while preserving slashes. */
export function encodePublicAssetPath(publicPath: string): string {
	return encodeURI(publicPath);
}

/** Interior install/showcase renders — not tile faces or panoramas. */
export function isProductDemoWorkImage(assetPath: string): boolean {
	const fileName = assetPath.split("/").pop() ?? "";
	if (/^PC/i.test(fileName)) {
		return true;
	}
	if (/_PhoiCanh/i.test(fileName)) {
		return true;
	}
	// Architectural 20 mm line uses a shared room render name.
	if (/^Venora\./i.test(fileName)) {
		return true;
	}
	return false;
}

/** Order: base PC file first, then numeric suffixes (`-1`, `PC1-`, `PC2-`, …). */
function compareDemoWorkAssetPaths(pathA: string, pathB: string): number {
	const fileNameA = pathA.split("/").pop() ?? "";
	const fileNameB = pathB.split("/").pop() ?? "";
	const suffixA = extractDemoWorkSortKey(fileNameA);
	const suffixB = extractDemoWorkSortKey(fileNameB);

	if (suffixA !== suffixB) {
		return suffixA - suffixB;
	}

	return fileNameA.localeCompare(fileNameB, undefined, { numeric: true, sensitivity: "base" });
}

function extractDemoWorkSortKey(fileName: string): number {
	const phoiCanhMatch = fileName.match(/_PhoiCanh(?:_(\d+))?/i);
	if (phoiCanhMatch) {
		return phoiCanhMatch[1] ? Number.parseInt(phoiCanhMatch[1], 10) : 0;
	}

	const hyphenMatch = fileName.match(/-(\d+)(?=\.[^.]+$)/);
	if (hyphenMatch) {
		return Number.parseInt(hyphenMatch[1], 10) + 1;
	}

	const prefixMatch = fileName.match(/^PC(\d+)/i);
	if (prefixMatch) {
		return Number.parseInt(prefixMatch[1], 10) + 1;
	}

	return 0;
}

export function sortDemoWorkAssetPaths(assetPaths: string[]): string[] {
	return [...assetPaths].sort(compareDemoWorkAssetPaths);
}

/** Splits install/showcase paths into `demoWorkImages`; keeps panoramas separate. */
export function normalizeProductMedia(catalogEntry: ProductCatalogEntry): ProductDetail {
	const seen = new Set<string>();
	const demoWorkImages: string[] = [];

	for (const assetPath of [...catalogEntry.sceneImages, ...catalogEntry.faceImages]) {
		if (!isProductDemoWorkImage(assetPath) || seen.has(assetPath)) {
			continue;
		}
		seen.add(assetPath);
		demoWorkImages.push(assetPath);
	}

	const sceneImages = catalogEntry.sceneImages.filter(
		(assetPath) => !isProductDemoWorkImage(assetPath),
	);

	return {
		...catalogEntry,
		demoWorkImages: sortDemoWorkAssetPaths(demoWorkImages),
		sceneImages,
	};
}

export function collectProductDemoWorkImages(product: ProductDetail): string[] {
	return product.demoWorkImages;
}

/** Primary install render for listing-card hover (first sorted PC-* path). */
export function getPrimaryDemoWorkAssetPath(demoWorkImages: string[]): string | undefined {
	return demoWorkImages[0];
}

/** Lightweight WebP beside the source PC file — safe for `next/image` on the catalog grid. */
export function getListingDemoWorkPreviewPath(assetPath: string): string {
	if (assetPath.endsWith(".listing.webp")) {
		return assetPath;
	}

	return assetPath.replace(/\.(jpe?g|png|webp)$/i, ".listing.webp");
}

/** Resolves gallery/panorama paths to `.detail.webp` sidecars; registry keeps canonical JPG/PNG. */
export function resolveDetailGalleryImagePath(assetPath: string): string {
	if (assetPath.endsWith(".detail.webp")) {
		return assetPath;
	}

	return assetPath.replace(/\.(jpe?g|png|webp)$/i, ".detail.webp");
}

export function resolveListingDemoWorkHoverPath(demoWorkAssetPath: string | undefined): string | undefined {
	if (!demoWorkAssetPath) {
		return undefined;
	}

	return getListingDemoWorkPreviewPath(demoWorkAssetPath);
}

