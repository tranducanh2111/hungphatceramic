interface PageMediaPreloadProps {
	/** Paths to preload as images (hoisted to document head by Next.js App Router). */
	imagePaths: readonly string[];
}

/**
 * LCP resource hints — `<link rel="preload">` for critical hero posters.
 * The `type` attribute tells browsers the format upfront so they can prioritize
 * decoding without a round-trip Content-Type sniff.
 */
export function PageMediaPreload({ imagePaths }: PageMediaPreloadProps) {
	return (
		<>
			{imagePaths.map((href) => {
				const isWebP = href.endsWith(".webp");
				const isAvif = href.endsWith(".avif");
				const mimeType = isAvif ? "image/avif" : isWebP ? "image/webp" : undefined;

				return (
					<link
						key={href}
						rel="preload"
						as="image"
						href={href}
						fetchPriority="high"
						{...(mimeType ? { type: mimeType } : {})}
					/>
				);
			})}
		</>
	);
}
