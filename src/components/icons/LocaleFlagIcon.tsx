import Image from "next/image";
import {cn} from "@/lib/cn";
import {ICON_PATHS} from "@/constants/media";
import type {AppLocale} from "@/i18n/routing";

interface LocaleFlagIconProps {
	locale: AppLocale;
	className?: string;
}

const FLAG_PIXEL_SIZE: Record<AppLocale, {width: number; height: number}> = {
	vi: {width: 22, height: 15},
	en: {width: 22, height: 12},
};

/**
 * Locale flags from `public/icons/flags/*.svg` (rasterized by `next/image`).
 * SVG files avoid Windows emoji flag rendering issues.
 */
export function LocaleFlagIcon({locale, className}: LocaleFlagIconProps) {
	const src = ICON_PATHS.flags[locale];
	const {width, height} = FLAG_PIXEL_SIZE[locale];

	return (
		<span className={cn("inline-flex shrink-0", className)} aria-hidden>
			<Image
				src={src}
				alt=""
				width={width}
				height={height}
				className="overflow-hidden rounded-[2px] ring-1 ring-white/15"
				unoptimized
			/>
		</span>
	);
}
