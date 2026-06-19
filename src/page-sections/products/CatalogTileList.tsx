"use client";

import { motion, type MotionValue } from "framer-motion";
import { ProductTile } from "@/components/common";
import { cn } from "@/lib/cn";
import type { ProductListingItem } from "@/lib/products/listing";

interface CatalogTileListProps {
	products: ProductListingItem[];
	activeSizeId: string;
	columnIndex: number;
	middleColumnOffset?: MotionValue<string>;
	enableScrollStagger?: boolean;
	enableStaticStagger?: boolean;
}

export function CatalogTileList({
	products,
	activeSizeId,
	columnIndex,
	middleColumnOffset,
	enableScrollStagger = false,
	enableStaticStagger = false,
}: CatalogTileListProps) {
	const isMiddleColumn = columnIndex === 1;

	return (
		<ul
			className={cn(
				"flex list-none flex-col gap-6 overflow-visible p-0",
				isMiddleColumn && "catalog-grid-stagger-reserve",
			)}
		>
			{products.map((product, index) => {
				const globalIndex = columnIndex + index * 3;
				const shouldPrioritizeImage = globalIndex < 3;
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
					<li
						key={product.slug}
						className={cn("overflow-visible", isMiddleColumn && "relative z-10")}
					>
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
	);
}
