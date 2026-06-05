"use client";

import { useTranslations } from "next-intl";
import { motion, useTransform } from "framer-motion";
import { ProductTile } from "@/components/common";
import { Text } from "@/components/ui";
import { useAppScroll } from "@/hooks/useAppScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import type { ProductListingItem } from "@/lib/products/listing";

interface ProductsGridProps {
	products: ProductListingItem[];
	activeCollectionId: string;
	activeSizeId: string;
}

/** Pixels of page scroll over which the middle column reaches a half-card drop. */
const MIDDLE_COLUMN_SCROLL_RANGE_PX = 320;

const LARGE_GRID_MEDIA_QUERY = "(min-width: 1024px)";
const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * ProductsGrid — Catalog grid with scroll-linked middle-column stagger (lg+).
 * Middle tiles translate by up to 50% of their own height so their top meets the row midpoint.
 */
export function ProductsGrid({ products, activeCollectionId, activeSizeId }: ProductsGridProps) {
	const t = useTranslations("pages.products");
	const isThreeColumnGrid = useMediaQuery(LARGE_GRID_MEDIA_QUERY);
	const prefersReducedMotion = useMediaQuery(REDUCED_MOTION_MEDIA_QUERY);

	const { scrollY } = useAppScroll();
	const middleColumnOffset = useTransform(
		scrollY,
		[0, MIDDLE_COLUMN_SCROLL_RANGE_PX],
		["0%", "50%"],
	);

	const enableScrollStagger = isThreeColumnGrid && !prefersReducedMotion;
	const enableStaticStagger = isThreeColumnGrid && prefersReducedMotion;

	if (products.length === 0) {
		return (
			<div className="flex min-h-[300px] flex-col items-center justify-center text-center">
				<Text variant="body-lg" className="text-linen/45">
					{t("noProducts")}
				</Text>
			</div>
		);
	}

	return (
		<div className="relative min-h-[600px] w-full overflow-visible pb-8 lg:pb-0">
			<div
				className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
				aria-hidden="true"
			>
				<span className="font-serif text-[18vw] font-bold tracking-[0.2em] text-sapphire-ocean/10 uppercase">
					{activeCollectionId === "all" ? "PERLA" : activeCollectionId}
				</span>
			</div>

			<ul
				key={activeCollectionId}
				className="catalog-grid-stagger-reserve catalog-grid-stagger-gap relative z-10 grid list-none grid-cols-1 gap-6 overflow-visible p-0 sm:grid-cols-2 lg:grid-cols-3"
			>
				{products.map((product, index) => {
					const isMiddleColumn = index % 3 === 1;
					const shouldPrioritizeImage = index < 3;
					const useScrollStagger = enableScrollStagger && isMiddleColumn;
					const useStaticStagger = enableStaticStagger && isMiddleColumn;
					const useStagger = useScrollStagger || useStaticStagger;

					const tile = (
						<ProductTile
							product={product}
							activeSizeId={activeSizeId}
							priority={shouldPrioritizeImage}
							deferMediaUntilVisible
						/>
					);

					return (
						<li key={product.slug} className="overflow-visible">
							{useStagger ? (
								<motion.div
									className={cn(
										useScrollStagger && "will-change-transform",
										useStaticStagger && "translate-y-1/2",
									)}
									style={useScrollStagger ? { y: middleColumnOffset } : undefined}
								>
									{tile}
								</motion.div>
							) : (
								tile
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
