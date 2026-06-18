"use client";

import { Link } from "@/i18n/navigation";
import { ProductTileCard } from "@/components/ui";
import { productDetailHref } from "@/lib/products/asset-paths";
import {
	encodePublicAssetPath,
	getPrimaryDemoWorkAssetPath,
	resolveListingDemoWorkHoverPath,
} from "@/lib/products/media";
import type { ProductListingItem } from "@/lib/products/listing";
import { ProductSummary, ProductDetail } from "@/types";
import { useCatalogTileMediaLifecycle } from "@/hooks/useCatalogTileMediaLifecycle";
import { cn } from "@/lib/cn";

function resolveDemoWorkThumbnailUrl(
	product: ProductSummary | ProductDetail | ProductListingItem,
): string | undefined {
	if ("demoWorkThumbnailUrl" in product) {
		return product.demoWorkThumbnailUrl;
	}

	if ("demoWorkImages" in product) {
		return getPrimaryDemoWorkAssetPath(product.demoWorkImages);
	}

	return undefined;
}

interface ProductTileProps {
	product: ProductSummary | ProductDetail | ProductListingItem;
	activeSizeId?: string;
	className?: string;
	priority?: boolean;
	imageSizes?: string;
	/** When true, tile photos mount near the viewport and unmount when scrolled away. */
	deferMediaUntilVisible?: boolean;
}

/**
 * ProductTile — Linked catalog card for product listing and related grids.
 */
export function ProductTile({
	product,
	activeSizeId,
	className,
	priority = false,
	imageSizes,
	deferMediaUntilVisible = false,
}: ProductTileProps) {
	const { containerRef, isMediaMounted } = useCatalogTileMediaLifecycle({
		isDeferred: deferMediaUntilVisible && !priority,
	});

	const hoverImageSrc = resolveListingDemoWorkHoverPath(resolveDemoWorkThumbnailUrl(product));
	const encodedHoverImageSrc = hoverImageSrc ? encodePublicAssetPath(hoverImageSrc) : undefined;

	return (
		<div ref={containerRef} className={cn("h-full", className)}>
			<Link
				href={productDetailHref(product.slug, activeSizeId)}
				className="group block h-full focus:outline-none"
			>
				<ProductTileCard
					imageSrc={encodePublicAssetPath(product.thumbnailUrl)}
					hoverImageSrc={encodedHoverImageSrc}
					imageAlt={product.name}
					productCode={product.skuCode}
					dimensions={product.category}
					productName={product.name}
					isMediaMounted={isMediaMounted}
					priority={priority}
					imageSizes={imageSizes}
				/>
			</Link>
		</div>
	);
}
