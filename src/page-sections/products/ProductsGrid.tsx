"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { ProductTile } from "@/components/common";
import { Text } from "@/components/ui";
import { DESKTOP_LAYOUT_QUERY } from "@/constants/breakpoints";
import { useAppScroll } from "@/hooks/useAppScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import type { ProductListingItem } from "@/lib/products/listing";

interface ProductsGridProps {
	products: ProductListingItem[];
	activeCollectionId: string;
	activeSizeId: string;
}

/** Pixels of page scroll over which the middle column reaches a half-card drop. */
const MIDDLE_COLUMN_SCROLL_RANGE_PX = 320;

function distributeProductsIntoColumns(
	products: ProductListingItem[],
	columnCount: number,
): ProductListingItem[][] {
	const columns = Array.from({ length: columnCount }, () => [] as ProductListingItem[]);
	products.forEach((product, index) => {
		columns[index % columnCount].push(product);
	});
	return columns;
}

interface CatalogTileListProps {
	products: ProductListingItem[];
	activeSizeId: string;
	columnIndex: number;
	middleColumnOffset?: MotionValue<string>;
	enableScrollStagger?: boolean;
	enableStaticStagger?: boolean;
}

function CatalogTileList({
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

interface ProductsGridLayoutProps {
	products: ProductListingItem[];
	activeCollectionId: string;
	activeSizeId: string;
	columnCount: 1 | 2 | 3;
	enableScrollStagger?: boolean;
	enableStaticStagger?: boolean;
	middleColumnOffset?: MotionValue<string>;
}

function ProductsGridWatermark({ activeCollectionId }: { activeCollectionId: string }) {
	return (
		<div
			className="pointer-events-none absolute inset-0 z-0 hidden items-center justify-center overflow-hidden select-none md:flex"
			aria-hidden="true"
		>
			<span className="text-sapphire-ocean/10 font-serif text-[18vw] font-bold tracking-[0.2em] uppercase">
				{activeCollectionId === "all" ? "PERLA" : activeCollectionId}
			</span>
		</div>
	);
}

function ProductsGridLayout({
	products,
	activeCollectionId,
	activeSizeId,
	columnCount,
	enableScrollStagger = false,
	enableStaticStagger = false,
	middleColumnOffset,
}: ProductsGridLayoutProps) {
	const staggeredColumns = useMemo(
		() => distributeProductsIntoColumns(products, columnCount),
		[products, columnCount],
	);

	if (columnCount === 3) {
		return (
			<div className="@container relative min-h-[600px] w-full overflow-visible pb-8 lg:pb-0">
				<ProductsGridWatermark activeCollectionId={activeCollectionId} />
				<div className="relative z-10 grid grid-cols-3 gap-6 overflow-visible">
					{staggeredColumns.map((columnProducts, columnIndex) => (
						<CatalogTileList
							key={columnIndex}
							products={columnProducts}
							activeSizeId={activeSizeId}
							columnIndex={columnIndex}
							middleColumnOffset={middleColumnOffset}
							enableScrollStagger={enableScrollStagger}
							enableStaticStagger={enableStaticStagger}
						/>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="relative min-h-[600px] w-full overflow-visible pb-8 lg:pb-0">
			<ProductsGridWatermark activeCollectionId={activeCollectionId} />
			<ul
				key={activeCollectionId}
				className={cn(
					"relative z-10 grid list-none gap-6 overflow-visible p-0",
					columnCount === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
				)}
			>
				{products.map((product, index) => (
					<li key={product.slug} className="overflow-visible">
						<ProductTile
							product={product}
							activeSizeId={activeSizeId}
							priority={index < 3}
							deferMediaUntilVisible
						/>
					</li>
				))}
			</ul>
		</div>
	);
}

/** Desktop three-column grid with scroll-linked middle-column stagger. */
function ProductsGridScrollStaggered({
	products,
	activeCollectionId,
	activeSizeId,
}: ProductsGridProps) {
	const { scrollY } = useAppScroll();
	const middleColumnOffset = useTransform(
		scrollY,
		[0, MIDDLE_COLUMN_SCROLL_RANGE_PX],
		["0%", "50%"],
	);

	return (
		<ProductsGridLayout
			products={products}
			activeCollectionId={activeCollectionId}
			activeSizeId={activeSizeId}
			columnCount={3}
			enableScrollStagger
			middleColumnOffset={middleColumnOffset}
		/>
	);
}

/**
 * ProductsGrid — Catalog grid with optional scroll-linked middle-column stagger (lg+).
 * Scroll subscriptions mount only when the staggered desktop layout is active.
 */
export function ProductsGrid({ products, activeCollectionId, activeSizeId }: ProductsGridProps) {
	const t = useTranslations("pages.products");
	const isThreeColumnGrid = useMediaQuery(DESKTOP_LAYOUT_QUERY);
	const prefersReducedMotion = usePrefersReducedMotion();

	if (products.length === 0) {
		return (
			<div className="flex min-h-[300px] flex-col items-center justify-center text-center">
				<Text variant="body-lg" className="text-linen/45">
					{t("noProducts")}
				</Text>
			</div>
		);
	}

	if (isThreeColumnGrid && !prefersReducedMotion) {
		return (
			<ProductsGridScrollStaggered
				products={products}
				activeCollectionId={activeCollectionId}
				activeSizeId={activeSizeId}
			/>
		);
	}

	return (
		<ProductsGridLayout
			products={products}
			activeCollectionId={activeCollectionId}
			activeSizeId={activeSizeId}
			columnCount={isThreeColumnGrid ? 3 : 2}
			enableStaticStagger={isThreeColumnGrid && prefersReducedMotion}
		/>
	);
}
