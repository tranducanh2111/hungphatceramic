"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useLenisResizeOnMount } from "@/hooks/useLenisResizeOnMount";
import {
	applyTileSizeToProductDetail,
	getCollectionCatalogPath,
	getCollectionCatalogDownloadName,
} from "@/lib/products/asset-paths";
import { ProductDetailHero } from "./ProductDetailHero";
import { ProductDetail } from "@/types";
import { CatalogPdfCard } from "./CatalogPdfCard";

// Below-fold sections loaded dynamically to save initial bundle size
const ProductDetailGallery = dynamic(
	() => import("./ProductDetailGallery").then((m) => ({ default: m.ProductDetailGallery })),
	{ ssr: false },
);

const ProductDetailPanorama = dynamic(
	() => import("./ProductDetailPanorama").then((m) => ({ default: m.ProductDetailPanorama })),
	{ ssr: false },
);

const ProductDetailSpecs = dynamic(
	() => import("./ProductDetailSpecs").then((m) => ({ default: m.ProductDetailSpecs })),
	{ ssr: false },
);

const ProductDetailRelated = dynamic(
	() => import("./ProductDetailRelated").then((m) => ({ default: m.ProductDetailRelated })),
	{ ssr: false },
);

interface ProductDetailPageContentProps {
	product: ProductDetail;
	activeSizeId?: string;
	heroMedia: ReactNode;
}

// Below-fold entrance — hero stays visible immediately (LCP must not wait on opacity fade).
const belowFoldVariants = {
	initial: {
		opacity: 0,
		y: 16,
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.45,
			ease: [0.16, 1, 0.3, 1] as const,
		},
	},
	exit: {
		opacity: 0,
		y: 16,
		transition: {
			duration: 0.3,
			ease: [0.16, 1, 0.3, 1] as const,
		},
	},
};

/**
 * ProductDetailPageContent — Client shell hosting the detail page section components.
 */
export function ProductDetailPageContent({
	product,
	activeSizeId,
	heroMedia,
}: ProductDetailPageContentProps) {
	useLenisResizeOnMount();
	const router = useRouter();
	const tPage = useTranslations("pages.products");
	const tDetail = useTranslations("pages.productDetail");

	const displayProduct = useMemo(
		() => applyTileSizeToProductDetail(product, activeSizeId),
		[product, activeSizeId],
	);
	const [isExiting, setIsExiting] = useState(false);

	// Intercept back links to play iOS-style close animation first
	const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		setIsExiting(true);

		setTimeout(() => {
			router.push(`/products?collection=${product.collectionId}`);
		}, 350); // Matches transition exit duration
	};

	const collectionName = tPage.has(`collections.${product.collectionId}`)
		? tPage(`collections.${product.collectionId}`)
		: product.collectionId;

	const catalogPdfUrl = getCollectionCatalogPath(product.collectionId);
	const catalogDownloadName = getCollectionCatalogDownloadName(product.collectionId);

	return (
		<>
			<ProductDetailHero product={displayProduct} heroMedia={heroMedia} onBack={handleBack} />

			<motion.div
				variants={belowFoldVariants}
				initial="initial"
				animate={isExiting ? "exit" : "animate"}
			>
				<ProductDetailGallery key={displayProduct.slug} product={displayProduct} />
				<ProductDetailPanorama product={product} />
				<ProductDetailSpecs product={displayProduct} />

				{/* Collection Catalog Section */}
				<section className="bg-sapphire-deep relative px-6 py-12 lg:px-12">
					<div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-[#1A3D5C]/35 to-transparent" />
					<div className="mx-auto max-w-7xl">
						<CatalogPdfCard
							pdfUrl={catalogPdfUrl}
							downloadFileName={catalogDownloadName}
							title={tDetail("catalogSection.title", { collection: collectionName })}
							description={tDetail("catalogSection.description", {
								collection: collectionName,
							})}
						/>
					</div>
				</section>

				<ProductDetailRelated product={displayProduct} activeSizeId={activeSizeId} />
			</motion.div>
		</>
	);
}
