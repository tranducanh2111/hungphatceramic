"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useLenisControls } from "@/components/common";
import { ProductsHero } from "./ProductsHero";
import { ProductsFilter } from "./ProductsFilter";
import { ProductsGrid } from "./ProductsGrid";
import { PRODUCTS } from "@/constants/products";
import { Input } from "@/components/ui";

/** Re-measure Lenis after content updates or filters changes */
function useLenisResizeOnListingMount(triggerDependency: number) {
	const lenisControls = useLenisControls();

	useEffect(() => {
		if (!lenisControls) return;

		const resizeLenis = () => lenisControls.resize();
		resizeLenis();

		const rafId = requestAnimationFrame(() => {
			resizeLenis();
			requestAnimationFrame(resizeLenis);
		});

		return () => cancelAnimationFrame(rafId);
	}, [lenisControls, triggerDependency]);
}

function ProductsPageContentInner() {
	const t = useTranslations("pages.products");
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Search input state
	const [searchQuery, setSearchQuery] = useState("");

	// Active collection resolved from URL parameter "?collection="
	const activeCollectionId = searchParams.get("collection") || "all";

	// Handle collection selection by updating search params
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

	// 1. Resolve collections definition dynamically with counts matching the data
	const collectionsDef = useMemo(() => {
		const keys = ["inspire", "travertine", "orient-star", "sunshine", "architectural", "peace"];
		return keys.map((key) => {
			const count = PRODUCTS.filter((p) => p.collectionId === key).length;
			return { id: key, count };
		});
	}, []);

	// 2. Filter products based on active collection and search query
	const filteredProducts = useMemo(() => {
		// If there is an active search query, perform a global search (ignore collection filter)
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			return PRODUCTS.filter(
				(p) => p.skuCode.toLowerCase().includes(query) || p.name.toLowerCase().includes(query),
			);
		}

		// Otherwise, filter by the selected collection
		if (activeCollectionId !== "all") {
			return PRODUCTS.filter((p) => p.collectionId === activeCollectionId);
		}

		return PRODUCTS;
	}, [activeCollectionId, searchQuery]);

	// Automatically update scroll mapping when products list changes size
	useLenisResizeOnListingMount(filteredProducts.length);

	return (
		<main className="bg-[#071A2B] text-[#F4F4F6]">
			{/* Product Hero */}
			<ProductsHero
				activeCollectionId={activeCollectionId}
				totalProductsCount={filteredProducts.length}
			/>

			{/* Main Catalog Section */}
			<section className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
				<div className="grid grid-cols-1 gap-10 md:grid-cols-[240px_1fr] lg:gap-16">
					{/* Sidebar Filter & Search */}
					<aside className="w-full md:sticky md:top-28 md:h-fit">
						{/* Search Input */}
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
							className="mb-8"
						>
							<Input
								type="search"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder={t("searchPlaceholder")}
								className="border-[#1A3D5C] focus:border-[#D4B886] w-full"
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
						>
							<ProductsFilter
								activeCollectionId={activeCollectionId}
								onSelectCollection={handleSelectCollection}
								collections={collectionsDef}
							/>
						</motion.div>
					</aside>

					{/* Grid Panel */}
					<div className="flex flex-col gap-8">
						{/* Products List Staggered Grid */}
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
 * ProductsPageContent — The catalog container shell component.
 * Wrapped in Suspense to protect Next.js build and routing constraints.
 */
export function ProductsPageContent() {
	return (
		<Suspense fallback={<div className="min-h-screen bg-[#071A2B]" />}>
			<ProductsPageContentInner />
		</Suspense>
	);
}
