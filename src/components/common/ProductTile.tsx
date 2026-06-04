"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductTileCard } from "@/components/ui";
import type { ProductListingItem } from "@/lib/products/listing";
import { ProductSummary, ProductDetail } from "@/types";
import { cn } from "@/lib/cn";

interface ProductTileProps {
	product: ProductSummary | ProductDetail | ProductListingItem;
	className?: string;
	priority?: boolean;
	imageSizes?: string;
}

/**
 * ProductTile — Linked catalog card for product listing and related grids.
 */
export function ProductTile({
	product,
	className,
	priority = false,
	imageSizes,
}: ProductTileProps) {
	const t = useTranslations("products.items");

	const productName = t.has(`${product.slug}.name`) ? t(`${product.slug}.name`) : product.name;

	return (
		<Link
			href={`/products/${product.slug}`}
			className={cn("group block focus:outline-none", className)}
		>
			<ProductTileCard
				imageSrc={product.thumbnailUrl}
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
