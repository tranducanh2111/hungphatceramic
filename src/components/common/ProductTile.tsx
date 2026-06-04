"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductTileCard } from "@/components/ui";
import { productDetailHref } from "@/lib/products/asset-paths";
import { encodePublicAssetPath } from "@/lib/products/media";
import type { ProductListingItem } from "@/lib/products/listing";
import { ProductSummary, ProductDetail } from "@/types";
import { cn } from "@/lib/cn";

interface ProductTileProps {
	product: ProductSummary | ProductDetail | ProductListingItem;
	activeSizeId?: string;
	className?: string;
	priority?: boolean;
	imageSizes?: string;
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
}: ProductTileProps) {
	const t = useTranslations("products.items");

	const productName = t.has(`${product.slug}.name`) ? t(`${product.slug}.name`) : product.name;

	return (
		<Link
			href={productDetailHref(product.slug, activeSizeId)}
			className={cn("group block focus:outline-none", className)}
		>
			<ProductTileCard
				imageSrc={encodePublicAssetPath(product.thumbnailUrl)}
				imageAlt={productName}
				productCode={product.skuCode}
				dimensions={product.category}
				productName={productName}
				priority={priority}
				imageSizes={imageSizes}
			/>
		</Link>
	);
}
