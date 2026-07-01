import { ProductTileCardMedia } from "@/components/ui/ProductTileCardMedia";
import { Text } from "@/components/ui/Text";
import { TileFinishOverlay } from "@/components/media";
import { cn } from "@/lib/cn";
import { inferTileFinish } from "@/lib/products/inferTileFinish";
import type { ClassNameProp } from "@/types";

/** Multi-stop scrim (smoother than a two-stop Tailwind gradient). */
const TILE_CARD_BOTTOM_SCRIM =
	"linear-gradient(to top, #071A2B 0%, rgba(7, 26, 43, 0.96) 14%, rgba(7, 26, 43, 0.78) 32%, rgba(7, 26, 43, 0.48) 52%, rgba(7, 26, 43, 0.2) 72%, rgba(7, 26, 43, 0.06) 88%, transparent 100%)";

export interface ProductTileCardProps extends ClassNameProp {
	imageSrc: string;
	/** Install render shown on hover when available. */
	hoverImageSrc?: string;
	imageAlt: string;
	productCode: string;
	/** Display size label, e.g. `60×120cm`. */
	dimensions: string;
	productName: string;
	isMediaMounted?: boolean;
	priority?: boolean;
	imageSizes?: string;
}

/**
 * ProductTileCard (Porcelain tile catalog card with texture hero and bottom metadata).
 * Presentational only; wrap with a link in catalog grids.
 */
export function ProductTileCard({
	imageSrc,
	hoverImageSrc,
	imageAlt,
	productCode,
	dimensions,
	productName,
	isMediaMounted = true,
	priority = false,
	imageSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
	className,
}: ProductTileCardProps) {
	const tileFinish = inferTileFinish(productCode);

	return (
		<article
			className={cn(
				"relative aspect-[3/4] overflow-hidden rounded-none",
				"bg-sapphire-deep shadow-luxury-sm ease-luxury border-sapphire-mist/30 border",
				"transition-all duration-500",
				"group-hover:shadow-luxury-md group-focus-visible:shadow-luxury-md",
				"group-hover:border-champagne/40 group-focus-visible:border-champagne/40",
				"group-hover:-translate-y-1 group-focus-visible:-translate-y-1",
				className,
			)}
		>
			<ProductTileCardMedia
				imageSrc={imageSrc}
				hoverImageSrc={hoverImageSrc}
				imageAlt={imageAlt}
				isMediaMounted={isMediaMounted}
				priority={priority}
				imageSizes={imageSizes}
			/>

			<TileFinishOverlay finish={tileFinish} />

			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[42%] max-h-[10rem] min-h-[6.75rem] sm:min-h-[7.25rem]"
				style={{ backgroundImage: TILE_CARD_BOTTOM_SCRIM }}
				suppressHydrationWarning
			/>

			<div
				className={cn(
					"absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1.5",
					"px-4 pt-3 pb-3.5 sm:px-5 sm:pt-3.5 sm:pb-4",
				)}
			>
				<div className="flex items-center justify-between gap-3">
					<Text
						variant="footnote"
						className="text-champagne/90 font-sans font-medium tracking-[0.15em] uppercase"
					>
						{productCode}
					</Text>
					<span className="text-linen/50 shrink-0 font-sans text-[10px] font-semibold tracking-wider uppercase">
						{dimensions}
					</span>
				</div>

				<Text
					variant="h3"
					as="h3"
					className="text-body-sm text-linen group-hover:text-champagne-light group-focus-visible:text-champagne-light line-clamp-2 font-sans font-semibold transition-colors duration-300"
				>
					{productName}
				</Text>
			</div>
		</article>
	);
}
