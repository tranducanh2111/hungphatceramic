"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import { useLenisResizeOnMount } from "@/hooks/useLenisResizeOnMount";
import { applyTileSizeToProductDetail } from "@/lib/products/asset-paths";
import type { LocalizedProductDetail } from "@/lib/products/localizeCatalog";
import { ProductDetailHero } from "./ProductDetailHero";
import { ProductDetailGallery } from "./ProductDetailGallery";
import { ProductDetailSpecs } from "./ProductDetailSpecs";
import { ProductDetailRelated } from "./ProductDetailRelated";

interface ProductDetailPageContentProps {
	product: LocalizedProductDetail;
	activeSizeId?: string;
	heroMedia: ReactNode;
}

/** Below-fold entrance (hero stays visible immediately, LCP must not wait on opacity fade). */
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

/** ProductDetailPageContent (client shell hosting the detail page section components). */
export function ProductDetailPageContent({
	product,
	activeSizeId,
	heroMedia,
}: ProductDetailPageContentProps) {
	useLenisResizeOnMount();
	const router = useRouter();
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

	return (
		<>
			<ProductDetailHero product={displayProduct} heroMedia={heroMedia} onBack={handleBack} />

			<motion.div
				variants={belowFoldVariants}
				initial="initial"
				animate={isExiting ? "exit" : "animate"}
			>
				<ProductDetailGallery key={displayProduct.slug} product={displayProduct} />
				<ProductDetailSpecs product={displayProduct} />
				<ProductDetailRelated product={displayProduct} activeSizeId={activeSizeId} />
			</motion.div>
		</>
	);
}
