"use client";

import { useTranslations } from "next-intl";
import { ProductTile } from "@/components/common";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { ProductListingItem } from "@/lib/products/listing";

interface ProductsGridProps {
	products: ProductListingItem[];
	activeCollectionId: string;
}

/** Static offset for the middle column on large screens. */
const MIDDLE_COLUMN_STAGGER_CLASS = "lg:translate-y-[7.5rem]";

/**
 * ProductsGrid — Responsive catalog grid (no scroll-linked motion — keeps scroll smooth).
 */
export function ProductsGrid({ products, activeCollectionId }: ProductsGridProps) {
	const t = useTranslations("pages.products");

	if (products.length === 0) {
		return (
			<div className="flex min-h-[300px] flex-col items-center justify-center text-center">
				<Text variant="body-lg" className="text-[#F4F4F6]/45">
					{t("noProducts")}
				</Text>
			</div>
		);
	}

	return (
		<div className="relative min-h-[600px] w-full">
			<div
				className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
				aria-hidden="true"
			>
				<span className="font-serif text-[18vw] font-bold tracking-[0.2em] text-[#0E2A42]/10 uppercase">
					{activeCollectionId === "all" ? "PERLA" : activeCollectionId}
				</span>
			</div>

			<ul
				key={activeCollectionId}
				className="relative z-10 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3"
			>
				{products.map((product, index) => {
					const isMiddleColumn = index % 3 === 1;
					const shouldPrioritizeImage = index < 3;

					return (
						<li
							key={product.slug}
							className={cn(isMiddleColumn && MIDDLE_COLUMN_STAGGER_CLASS)}
						>
							<ProductTile
								product={product}
								priority={shouldPrioritizeImage}
								variant="catalog"
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
