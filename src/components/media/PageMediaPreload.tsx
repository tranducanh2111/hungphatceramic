interface PageMediaPreloadProps {
	/** Paths to preload as images (hoisted to document head by Next.js App Router). */
	imagePaths: readonly string[];
}

/**
 * LCP resource hints — `<link rel="preload">` for critical hero posters.
 */
export function PageMediaPreload({ imagePaths }: PageMediaPreloadProps) {
	return (
		<>
			{imagePaths.map((href) => (
				<link key={href} rel="preload" as="image" href={href} />
			))}
		</>
	);
}
