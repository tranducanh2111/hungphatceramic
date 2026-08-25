"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { ProductTile } from "@/components/common";
import { applyTileSizeToListingItem } from "@/lib/products/asset-paths";
import {
	localizeListingCatalog,
	type LocalizedProductDetail,
} from "@/lib/products/localizeCatalog";
import { PRODUCTS } from "@/constants/products";

interface ProductDetailRelatedProps {
	product: LocalizedProductDetail;
	activeSizeId?: string;
}

/** ProductDetailRelated (showcases other tiles in the same collection, remapped to sapphire/champagne palette). */
export function ProductDetailRelated({ product, activeSizeId }: ProductDetailRelatedProps) {
	const tDetail = useTranslations("pages.productDetail");
	const tPage = useTranslations("pages.products");
	const tItems = useTranslations("products.items");

	const related = useMemo(() => {
		const peers = PRODUCTS.filter(
			(p) => p.collectionId === product.collectionId && p.slug !== product.slug,
		).slice(0, 3);
		return localizeListingCatalog(peers, tItems).map((item) =>
			applyTileSizeToListingItem(item, activeSizeId),
		);
	}, [product.collectionId, product.slug, activeSizeId, tItems]);

	if (related.length === 0) return null;

	const collectionName = tPage.has(`collections.${product.collectionId}`)
		? tPage(`collections.${product.collectionId}`)
		: product.collectionId;

	return (
		<section className="bg-sapphire-ocean text-linen relative px-6 py-24 lg:px-12">
			<div className="mx-auto max-w-7xl">
				{/* Section Header */}
				<div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between">
					<div>
						<Text
							variant="label"
							className="text-champagne mb-4 block font-sans font-medium tracking-[0.2em] uppercase"
						>
							{tDetail("relatedProducts", { collection: "" })}
						</Text>
						<h3 className="text-h3 font-serif font-light">Explore {collectionName}</h3>
					</div>
				</div>

				{/* Related Items Row */}
				<ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
					{related.map((item) => (
						<li key={item.slug}>
							<ProductTile
								product={item}
								activeSizeId={activeSizeId}
								deferMediaUntilVisible
							/>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
