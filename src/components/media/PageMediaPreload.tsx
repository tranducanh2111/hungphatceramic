interface PageMediaPreloadProps {
	/** Paths to preload as images (hoisted to document head by Next.js App Router). */
	imagePaths: readonly string[];
	/** Optional mobile-only preloads — use when desktop needs more LCP candidates than mobile. */
	mobileImagePaths?: readonly string[];
	/** When true, restricts preloading to desktop viewports (min-width: 1024px). */
	desktopOnly?: boolean;
}

/**
 * LCP resource hints — `<link rel="preload">` for critical hero posters.
 * The `type` attribute tells browsers the format upfront so they can prioritize
 * decoding without a round-trip Content-Type sniff.
 */
export function PageMediaPreload({
	imagePaths,
	mobileImagePaths,
	desktopOnly = false,
}: PageMediaPreloadProps) {
	const renderPreloadLink = (href: string, media?: string) => {
		const isWebP = href.endsWith(".webp");
		const isAvif = href.endsWith(".avif");
		const mimeType = isAvif ? "image/avif" : isWebP ? "image/webp" : undefined;

		return (
			<link
				key={media ? `${media}:${href}` : href}
				rel="preload"
				as="image"
				href={href}
				fetchPriority="high"
				{...(media ? { media } : {})}
				{...(mimeType ? { type: mimeType } : {})}
			/>
		);
	};

	return (
		<>
			{mobileImagePaths?.map((href) => renderPreloadLink(href, "(max-width: 1023px)"))}
			{imagePaths.map((href) =>
				renderPreloadLink(
					href,
					desktopOnly
						? "(min-width: 1024px)"
						: mobileImagePaths && mobileImagePaths.length > 0
						? "(min-width: 1024px)"
						: undefined,
				),
			)}
		</>
	);
}
