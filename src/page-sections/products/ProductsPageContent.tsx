"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { ProductsHero } from "./ProductsHero";
import { ProductsFilter } from "./ProductsFilter";
import { ProductsGrid } from "./ProductsGrid";
import { Input } from "@/components/ui";
import { applyTileSizeToListingItem } from "@/lib/products/asset-paths";
import {
	filterProductListingByCatalog,
	type CatalogFilterState,
	type CollectionListingMeta,
	type ProductListingItem,
	type TileSizeListingMeta,
} from "@/lib/products/listing";

interface ProductsPageContentProps {
	products: ProductListingItem[];
	collections: CollectionListingMeta[];
	tileSizes: TileSizeListingMeta[];
	initialFilter: CatalogFilterState;
}

export function ProductsPageContent({
	products,
	collections,
	tileSizes,
	initialFilter,
}: ProductsPageContentProps) {
	const t = useTranslations("pages.products");
	const router = useRouter();
	const pathname = usePathname();

	const [searchQuery, setSearchQuery] = useState("");
	const [activeCollectionId, setActiveCollectionId] = useState(initialFilter.collectionId);
	const [activeSizeId, setActiveSizeId] = useState(initialFilter.sizeId);

	const pushCatalogQuery = (nextParams: URLSearchParams) => {
		const search = nextParams.toString();
		const query = search ? `?${search}` : "";
		router.push(`${pathname}${query}`);
	};

	const handleSelectCollection = (id: string) => {
		setActiveCollectionId(id);
		const nextParams = new URLSearchParams();
		if (activeSizeId !== "all") {
			nextParams.set("size", activeSizeId);
		}
		if (id !== "all") {
			nextParams.set("collection", id);
		}
		pushCatalogQuery(nextParams);
	};

	const handleSelectSize = (id: string) => {
		setActiveSizeId(id);
		const nextParams = new URLSearchParams();
		if (activeCollectionId !== "all") {
			nextParams.set("collection", activeCollectionId);
		}
		if (id !== "all") {
			nextParams.set("size", id);
		}
		pushCatalogQuery(nextParams);
	};

	const filteredProducts = useMemo(() => {
		let result = filterProductListingByCatalog(products, {
			collectionId: activeCollectionId,
			sizeId: activeSizeId,
		});

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter(
				(product) =>
					product.title.toLowerCase().includes(query) ||
					product.skuCode.toLowerCase().includes(query) ||
					product.slug.toLowerCase().includes(query),
			);
		}

		return result.map((product) => applyTileSizeToListingItem(product, activeSizeId));
	}, [activeCollectionId, activeSizeId, products, searchQuery]);

	return (
		<div className="bg-sapphire-deep text-linen">
			<ProductsHero
				activeCollectionId={activeCollectionId}
				totalProductsCount={filteredProducts.length}
			/>

			<section
				className="mx-auto max-w-7xl px-6 pt-16 pb-16 lg:px-12 lg:pb-20"
				aria-labelledby="products-catalog-heading"
			>
				<h2 id="products-catalog-heading" className="sr-only">
					{t("heading")}
				</h2>

				<div className="grid grid-cols-1 gap-10 md:grid-cols-[240px_1fr] lg:gap-16">
					<aside
						className="w-full md:sticky md:top-28 md:h-fit"
						aria-label={t("filterLabel")}
					>
						<div className="mb-8">
							<Input
								type="search"
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								placeholder={t("searchPlaceholder")}
								className="border-sapphire-mist focus:border-champagne w-full"
							/>
						</div>

						<ProductsFilter
							activeCollectionId={activeCollectionId}
							onSelectCollection={handleSelectCollection}
							collections={collections}
							activeSizeId={activeSizeId}
							onSelectSize={handleSelectSize}
							tileSizes={tileSizes}
						/>
					</aside>

					<div className="flex flex-col gap-8 overflow-visible">
						<ProductsGrid
							products={filteredProducts}
							activeCollectionId={activeCollectionId}
							activeSizeId={activeSizeId}
						/>
					</div>
				</div>
			</section>
		</div>
	);
}
