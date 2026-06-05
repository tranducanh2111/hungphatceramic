"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useLenisResizeOnMount } from "@/hooks/useLenisResizeOnMount";
import { applyTileSizeToProductDetail } from "@/lib/products/asset-paths";
import { ProductDetailHero } from "./ProductDetailHero";
import { ProductDetail } from "@/types";

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
}

// iOS App open/close scale-zoom transition physics
const pageVariants = {
	initial: {
		opacity: 0,
		scale: 0.94,
		y: 24,
	},
	animate: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: [0.16, 1, 0.3, 1] as const, // iOS spring cubic-bezier
		},
	},
	exit: {
		opacity: 0,
		scale: 0.94,
		y: 24,
		transition: {
			duration: 0.35,
			ease: [0.16, 1, 0.3, 1] as const,
		},
	},
};

/**
 * ProductDetailPageContent — Client shell hosting the detail page section components.
 */
export function ProductDetailPageContent({ product }: ProductDetailPageContentProps) {
	useLenisResizeOnMount();
	const router = useRouter();
	const lenis = useLenis();
	const searchParams = useSearchParams();
	const activeSizeId = searchParams.get("size") ?? undefined;
	const displayProduct = useMemo(
		() => applyTileSizeToProductDetail(product, activeSizeId),
		[product, activeSizeId],
	);
	const [isExiting, setIsExiting] = useState(false);

	// Reset scroll position to top instantly on mount to clear scroll memory from listing page
	useEffect(() => {
		if (lenis) {
			lenis.scrollTo(0, { immediate: true });
		}
	}, [lenis]);

	// Intercept back links to play iOS-style close animation first
	const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		setIsExiting(true);

		setTimeout(() => {
			router.push(`/products?collection=${product.collectionId}`);
		}, 350); // Matches transition exit duration
	};

	return (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate={isExiting ? "exit" : "animate"}
			className="origin-center"
		>
			{/* Static above-fold detail hero with custom click interceptor */}
			<ProductDetailHero product={displayProduct} onBack={handleBack} />

			{/* Dynamically imported sub-sections */}
			<ProductDetailGallery product={displayProduct} />
			<ProductDetailPanorama product={product} />
			<ProductDetailSpecs product={displayProduct} />
			<ProductDetailRelated product={displayProduct} activeSizeId={activeSizeId} />
		</motion.div>
	);
}
