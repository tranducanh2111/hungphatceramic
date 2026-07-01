import { cn } from "@/lib/cn";

interface IconSvgProps {
	/** Path under `public/icons/**`, e.g. from `ICON_PATHS.ui.menu`. */
	src: string;
	/** Screen-reader label. Pass empty string for decorative icons. */
	alt: string;
	size?: number;
	className?: string;
}

/**
 * Renders an SVG from `public/icons/**` using CSS mask so the icon inherits
 * `color` from its parent (hover/focus transitions via Tailwind just work).
 *
 * Use `PublicIcon` instead when the icon has baked-in colors and no color inheritance is needed.
 */
export function IconSvg({ src, alt, size = 16, className }: IconSvgProps) {
	return (
		<span
			role={alt ? "img" : undefined}
			aria-label={alt || undefined}
			aria-hidden={!alt ? true : undefined}
			className={cn("icon-svg-mask inline-block shrink-0", className)}
			suppressHydrationWarning
			style={{
				width: size,
				height: size,
				["--icon-src" as string]: `url('${src}')`,
			}}
		/>
	);
}
