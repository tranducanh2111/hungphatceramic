import Image from "next/image";
import { cn } from "@/lib/cn";

interface PublicIconProps {
	/** Path under `public/`, e.g. from `ICON_PATHS`. */
	src: string;
	/** Decorative when parent provides `aria-label`, use empty for decorative icons. */
	alt: string;
	className?: string;
	size?: number;
}

/** Renders a small SVG from `public/icons/**` via `next/image` (fixed dimensions, no layout shift). */
export function PublicIcon({ src, alt, className, size = 16 }: PublicIconProps) {
	return (
		<Image
			src={src}
			alt={alt}
			width={size}
			height={size}
			className={cn("shrink-0", className)}
			unoptimized
			suppressHydrationWarning
		/>
	);
}
