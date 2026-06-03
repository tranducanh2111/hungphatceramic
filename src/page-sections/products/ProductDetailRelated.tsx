"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { ProductTile } from "@/components/common";
import { PRODUCTS } from "@/constants/products";
import { ProductDetail } from "@/types";

interface ProductDetailRelatedProps {
	product: ProductDetail;
}

/**
 * ProductDetailRelated — Showcases other tiles in the same collection.
 * Remapped to sapphire/champagne palette.
 */
export function ProductDetailRelated({ product }: ProductDetailRelatedProps) {
	const tDetail = useTranslations("pages.productDetail");
	const tPage = useTranslations("pages.products");

	// Resolve dynamic related products
	const related = useMemo(() => {
		return PRODUCTS.filter(
			(p) => p.collectionId === product.collectionId && p.slug !== product.slug,
		).slice(0, 3); // Max 3 items
	}, [product.collectionId, product.slug]);

	if (related.length === 0) return null;

	const collectionName = tPage.has(`collections.${product.collectionId}`)
		? tPage(`collections.${product.collectionId}`)
		: product.collectionId;

	return (
		<section className="relative bg-[#0E2A42] px-6 py-24 text-[#F4F4F6] lg:px-12">
			<div className="mx-auto max-w-7xl">
				{/* Section Header */}
				<div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between">
					<div>
						<Text
							variant="label"
							className="mb-4 block font-sans font-medium tracking-[0.2em] text-[#D4B886] uppercase"
						>
							{tDetail("relatedProducts", { collection: "" })}
						</Text>
						<h3 className="text-h3 font-serif font-light">Explore {collectionName}</h3>
					</div>
				</div>

				{/* Related Items Row */}
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{related.map((item) => (
						<div key={item.slug}>
							<ProductTile product={item} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
