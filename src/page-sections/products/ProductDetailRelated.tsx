"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ProductTile, RevealOnView, SectionHeader } from "@/components/common";
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
	}, [product.collectionId, product.slug, activeSizeId]);

	if (related.length === 0) return null;

	const collectionName = tPage.has(`collections.${product.collectionId}`)
		? tPage(`collections.${product.collectionId}`)
		: product.collectionId;

	return (
		<section className="bg-sapphire-ocean text-linen relative px-6 py-24 lg:px-12">
			<div className="mx-auto max-w-7xl">
				<SectionHeader
					label={tDetail("relatedProducts", { collection: "" })}
					heading={`Explore ${collectionName}`}
					headingAs="h3"
					headingVariant="h3"
					className="mb-12"
				/>

				<ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
					{related.map((item, index) => (
						<RevealOnView key={item.slug} as="li" delay={0.08 + index * 0.08}>
							<ProductTile
								product={item}
								activeSizeId={activeSizeId}
								deferMediaUntilVisible
							/>
						</RevealOnView>
					))}
				</ul>
			</div>
		</section>
	);
}
