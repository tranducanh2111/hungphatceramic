/**
 * Helpers for product images under `public/assets/**` (spaces, unicode path segments).
 */

/** Encode `/assets/...` paths for `next/image` while preserving slashes. */
export function encodePublicAssetPath(publicPath: string): string {
	return encodeURI(publicPath);
}

/**
 * Bypass `/_next/image` when a source is already web-sized or optimizer-unfriendly.
 * Catalog assets are pre-compressed via `pnpm optimize:product-images`.
 */
export function shouldUseUnoptimizedProductImage(_productSlug: string): boolean {
	return false;
}
