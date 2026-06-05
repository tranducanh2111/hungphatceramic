/**
 * Helpers for product images under `public/assets/**` (spaces, unicode path segments).
 */

import type { ProductCatalogEntry, ProductDetail } from "@/types";

/** Encode `/assets/...` paths for `next/image` while preserving slashes. */
export function encodePublicAssetPath(publicPath: string): string {
	return encodeURI(publicPath);
}

/** Room / install renders in product folders (e.g. `PC-G12962J.jpg`, `PC1-GP12962J.jpg`). */
export function isProductDemoWorkImage(assetPath: string): boolean {
	const fileName = assetPath.split("/").pop() ?? "";
	return /^PC/i.test(fileName);
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

/** Splits PC-* paths into `demoWorkImages`; keeps panoramas and other scenes separate. */
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

/** Responsive grid for 1–N demo renders (e.g. Inspire GP12964J ×2, Peace ×3). */
export function getDemoWorkGridClassName(imageCount: number): string {
	if (imageCount <= 1) {
		return "mx-auto grid max-w-3xl grid-cols-1 gap-6";
	}
	if (imageCount === 2) {
		return "grid grid-cols-1 gap-6 sm:grid-cols-2";
	}
	return "grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3";
}

/**
 * Bypass `/_next/image` when a source is already web-sized or optimizer-unfriendly.
 * Catalog assets are pre-compressed via `pnpm optimize:product-images`.
 */
export function shouldUseUnoptimizedProductImage(_productSlug: string): boolean {
	return false;
}
