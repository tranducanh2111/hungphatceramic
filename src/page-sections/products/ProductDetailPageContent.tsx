"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useLenisControls } from "@/components/common";
import { ProductDetailHero } from "./ProductDetailHero";
import { ProductDetail } from "@/types";

// Below-fold sections loaded dynamically to save initial bundle size
const ProductDetailGallery = dynamic(
	() => import("./ProductDetailGallery").then((m) => ({ default: m.ProductDetailGallery })),
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

/** Re-measure Lenis when product detail page is fully mounted and heights shift */
function useLenisResizeOnDetailMount() {
	const lenisControls = useLenisControls();

	useEffect(() => {
		if (!lenisControls) return;

		const resizeLenis = () => lenisControls.resize();
		resizeLenis();

		const rafId = requestAnimationFrame(() => {
			resizeLenis();
			requestAnimationFrame(resizeLenis);
		});

		window.addEventListener("load", resizeLenis, { once: true });

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener("load", resizeLenis);
		};
	}, [lenisControls]);
}

interface ProductDetailPageContentProps {
	product: ProductDetail;
}

/**
 * ProductDetailPageContent — Client shell hosting the detail page section components.
 */
export function ProductDetailPageContent({ product }: ProductDetailPageContentProps) {
	useLenisResizeOnDetailMount();

	return (
		<>
			{/* Static above-fold detail hero */}
			<ProductDetailHero product={product} />

			{/* Dynamically imported sub-sections */}
			<ProductDetailGallery product={product} />
			<ProductDetailSpecs product={product} />
			<ProductDetailRelated product={product} />
		</>
	);
}
