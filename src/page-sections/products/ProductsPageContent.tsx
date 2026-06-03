"use client";

import { Suspense, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { ProductsHero } from "./ProductsHero";
import { ProductsFilter } from "./ProductsFilter";
import { ProductsGrid } from "./ProductsGrid";
import { Input } from "@/components/ui";
import type { CollectionListingMeta, ProductListingItem } from "@/lib/products/listing";

interface ProductsPageContentProps {
	products: ProductListingItem[];
	collections: CollectionListingMeta[];
}

function ProductsPageContentInner({ products, collections }: ProductsPageContentProps) {
	const t = useTranslations("pages.products");
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [searchQuery, setSearchQuery] = useState("");
	const activeCollectionId = searchParams.get("collection") || "all";

	const handleSelectCollection = (id: string) => {
		const current = new URLSearchParams(Array.from(searchParams.entries()));
		if (id === "all") {
			current.delete("collection");
		} else {
			current.set("collection", id);
		}
		const search = current.toString();
		const query = search ? `?${search}` : "";
		router.push(`${pathname}${query}`);
	};

	const filteredProducts = useMemo(() => {
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			return products.filter(
				(product) =>
					product.skuCode.toLowerCase().includes(query) ||
					product.name.toLowerCase().includes(query),
			);
		}

		if (activeCollectionId !== "all") {
			return products.filter((product) => product.collectionId === activeCollectionId);
		}

		return products;
	}, [activeCollectionId, products, searchQuery]);

	return (
		<main className="bg-[#071A2B] text-[#F4F4F6]">
			<ProductsHero
				activeCollectionId={activeCollectionId}
				totalProductsCount={filteredProducts.length}
			/>

			<section className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
				<div className="grid grid-cols-1 gap-10 md:grid-cols-[240px_1fr] lg:gap-16">
					<aside className="w-full md:sticky md:top-28 md:h-fit">
						<div className="mb-8">
							<Input
								type="search"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder={t("searchPlaceholder")}
								className="w-full border-[#1A3D5C] focus:border-[#D4B886]"
							/>
						</div>

						<ProductsFilter
							activeCollectionId={activeCollectionId}
							onSelectCollection={handleSelectCollection}
							collections={collections}
						/>
					</aside>

					<div className="flex flex-col gap-8">
						<ProductsGrid
							products={filteredProducts}
							activeCollectionId={activeCollectionId}
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
		<Suspense fallback={<div className="min-h-screen bg-[#071A2B]" />}>
			<ProductsPageContentInner {...props} />
		</Suspense>
	);
}