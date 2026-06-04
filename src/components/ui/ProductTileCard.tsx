import Image from "next/image";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";
import type { ClassNameProp } from "@/types";

export interface ProductTileCardProps extends ClassNameProp {
	imageSrc: string;
	imageAlt: string;
	productCode: string;
	/** Display size label, e.g. `60×120cm`. */
	dimensions: string;
	productName: string;
	priority?: boolean;
	imageSizes?: string;
}

/**
 * ProductTileCard — Immersive porcelain tile card (texture hero + bottom metadata).
 * Presentational only; wrap with a link in catalog grids.
 */
export function ProductTileCard({
	imageSrc,
	imageAlt,
	productCode,
	dimensions,
	productName,
	priority = false,
	imageSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
	className,
}: ProductTileCardProps) {
	return (
		<article
			className={cn(
				"relative aspect-[3/4] overflow-hidden rounded-3xl",
				"bg-sapphire-deep shadow-luxury-sm ease-luxury border border-sapphire-mist/30",
				"transition-all duration-500",
				"group-hover:shadow-luxury-md group-focus-visible:shadow-luxury-md",
				"group-hover:border-champagne/40 group-focus-visible:border-champagne/40",
				"group-hover:-translate-y-1 group-focus-visible:-translate-y-1",
				className,
			)}
		>
			<Image
				src={imageSrc}
				alt={imageAlt}
				fill
				sizes={imageSizes}
				quality={55}
				loading={priority ? undefined : "lazy"}
				className="ease-luxury object-cover object-center transition-transform duration-700 group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
				priority={priority}
			/>

			<div
				className="from-sapphire-deep via-sapphire-deep/60 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent"
				aria-hidden="true"
			/>

			<div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 p-4 pt-20 sm:p-5 sm:pt-24">
				<div className="flex items-center justify-between gap-3">
					<Text
						variant="footnote"
						className="font-sans font-medium tracking-[0.15em] text-champagne/90 uppercase"
					>
						{productCode}
					</Text>
					<span className="shrink-0 font-sans text-[10px] font-semibold tracking-wider text-linen/50 uppercase">
						{dimensions}
					</span>
				</div>

				<Text
					variant="body-sm"
					className="line-clamp-2 font-sans font-semibold text-linen transition-colors duration-300 group-hover:text-champagne-light group-focus-visible:text-champagne-light"
				>
					{productName}
				</Text>
			</div>
		</article>
	);
}
