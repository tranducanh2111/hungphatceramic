"use client";

import { Suspense, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { ProductsHero } from "./ProductsHero";
import { ProductsFilter } from "./ProductsFilter";
import { ProductsGrid } from "./ProductsGrid";
import { Input } from "@/components/ui";
import { applyTileSizeToListingItem } from "@/lib/products/asset-paths";
import {
	isTileSizeSlug,
	productMatchesTileSize,
	type CollectionListingMeta,
	type ProductListingItem,
	type TileSizeListingMeta,
} from "@/lib/products/listing";

interface ProductsPageContentProps {
	products: ProductListingItem[];
	collections: CollectionListingMeta[];
	tileSizes: TileSizeListingMeta[];
}

function ProductsPageContentInner({
	products,
	collections,
	tileSizes,
}: ProductsPageContentProps) {
	const t = useTranslations("pages.products");
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [searchQuery, setSearchQuery] = useState("");

	const rawCollectionId = searchParams.get("collection") || "all";
	const activeCollectionId =
		rawCollectionId === "all" ||
		collections.some((collection) => collection.id === rawCollectionId)
			? rawCollectionId
			: "all";

	const rawSizeId = searchParams.get("size") || "all";
	const activeSizeId = isTileSizeSlug(rawSizeId) ? rawSizeId : "all";

	const pushCatalogQuery = (nextParams: URLSearchParams) => {
		const search = nextParams.toString();
		const query = search ? `?${search}` : "";
		router.push(`${pathname}${query}`);
	};

	const handleSelectCollection = (id: string) => {
		const nextParams = new URLSearchParams(Array.from(searchParams.entries()));
		if (id === "all") {
			nextParams.delete("collection");
		} else {
			nextParams.set("collection", id);
		}
		pushCatalogQuery(nextParams);
	};

	const handleSelectSize = (id: string) => {
		const nextParams = new URLSearchParams(Array.from(searchParams.entries()));
		if (id === "all") {
			nextParams.delete("size");
		} else {
			nextParams.set("size", id);
		}
		pushCatalogQuery(nextParams);
	};

	const filteredProducts = useMemo(() => {
		let result = products;

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter(
				(product) =>
					product.skuCode.toLowerCase().includes(query) ||
					product.name.toLowerCase().includes(query),
			);
		} else if (activeCollectionId !== "all") {
			result = result.filter((product) => product.collectionId === activeCollectionId);
		}

		if (activeSizeId !== "all") {
			result = result.filter((product) => productMatchesTileSize(product, activeSizeId));
		}

		return result.map((product) => applyTileSizeToListingItem(product, activeSizeId));
	}, [activeCollectionId, activeSizeId, products, searchQuery]);

	return (
		<main className="bg-sapphire-deep text-linen">
			<ProductsHero
				activeCollectionId={activeCollectionId}
				totalProductsCount={filteredProducts.length}
			/>

			<section className="mx-auto max-w-7xl px-6 pt-16 pb-16 lg:px-12 lg:pb-20">
				<div className="grid grid-cols-1 gap-10 md:grid-cols-[240px_1fr] lg:gap-16">
					<aside className="w-full md:sticky md:top-28 md:h-fit">
						<div className="mb-8">
							<Input
								type="search"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder={t("searchPlaceholder")}
								className="w-full border-sapphire-mist focus:border-champagne"
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
		</main>
	);
}

/**
 * ProductsPageContent — Client shell for catalog filtering; product data is passed from the server page.
 */
export function ProductsPageContent(props: ProductsPageContentProps) {
	return (
		<Suspense fallback={<div className="min-h-screen bg-sapphire-deep" />}>
			<ProductsPageContentInner {...props} />
		</Suspense>
	);
}
