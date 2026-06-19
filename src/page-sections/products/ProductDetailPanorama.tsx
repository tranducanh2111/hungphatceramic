"use client";

import { useRef } from "react";
import { ViewportDeferredImage } from "@/components/media";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useAppScroll } from "@/hooks/useAppScroll";
import { getProductPanoramaImage } from "@/lib/products/panorama";
import { encodePublicAssetPath, resolveDetailGalleryImagePath } from "@/lib/products/media";
import { SectionHeader } from "@/components/common";
import type { ProductDetail } from "@/types";

interface ProductDetailPanoramaProps {
	product: ProductDetail;
}

interface PanoramaContentProps {
	productName: string;
	panoramaSrc: string;
}

/** ProductDetailPanorama (scroll-driven wide interior panorama when available). */
export function ProductDetailPanorama({ product }: ProductDetailPanoramaProps) {
	const tItems = useTranslations("products.items");
	const shouldReduceMotion = useReducedMotion();
	const panoramaPath = getProductPanoramaImage(product);

	if (!panoramaPath) {
		return null;
	}

	const productName = tItems.has(`${product.slug}.name`)
		? tItems(`${product.slug}.name`)
		: product.name;

	const panoramaSrc = encodePublicAssetPath(resolveDetailGalleryImagePath(panoramaPath));

	if (shouldReduceMotion) {
		return <ProductDetailPanoramaStatic productName={productName} panoramaSrc={panoramaSrc} />;
	}

	return <ProductDetailPanoramaScroll productName={productName} panoramaSrc={panoramaSrc} />;
}

function ProductDetailPanoramaStatic({ productName, panoramaSrc }: PanoramaContentProps) {
	const tDetail = useTranslations("pages.productDetail");

	return (
		<section
			className="bg-sapphire-deep relative px-6 py-16 lg:px-12 lg:py-20"
			aria-label={tDetail("panorama.ariaLabel", { productName })}
		>
			<div className="mx-auto max-w-7xl">
				<PanoramaSectionHeader productName={productName} />

				<p className="text-body-sm text-linen/45 mb-4 font-sans">
					{tDetail("panorama.scrollHint")}
				</p>

				<div className="border-sapphire-mist/40 overflow-x-auto overscroll-x-contain rounded-none border">
					<div className="relative h-[min(50vh,28rem)] w-[min(320%,2400px)] min-w-[960px]">
						<ViewportDeferredImage
							src={panoramaSrc}
							alt={tDetail("panorama.imageAlt", { productName })}
							fill
							sizes="2400px"
							quality={60}
							className="object-cover object-left"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

function ProductDetailPanoramaScroll({ productName, panoramaSrc }: PanoramaContentProps) {
	const tDetail = useTranslations("pages.productDetail");
	const sectionRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useAppScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});
	const panoramaX = useTransform(scrollYProgress, [0, 1], ["0vw", "-220vw"]);
	const hintOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [1, 0.4, 0.4, 0]);

	return (
		<section
			ref={sectionRef}
			className="bg-sapphire-deep relative"
			aria-label={tDetail("panorama.ariaLabel", { productName })}
		>
			<div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-12 lg:pt-20">
				<PanoramaSectionHeader productName={productName} />
			</div>

			<div className="sticky top-0 h-screen overflow-hidden">
				<motion.div
					className="absolute top-0 left-0 h-full w-[320vw]"
					style={{ x: panoramaX }}
				>
					<ViewportDeferredImage
						src={panoramaSrc}
						alt={tDetail("panorama.imageAlt", { productName })}
						fill
						loading="lazy"
						quality={55}
						unloadWhenFar={false}
						sizes="(max-width: 1024px) 200vw, 320vw"
						className="object-cover object-center"
					/>
				</motion.div>

				<div
					className="bg-sapphire-deep/50 pointer-events-none absolute inset-0"
					aria-hidden="true"
				/>
				<div
					className="from-sapphire-deep/60 to-sapphire-deep/75 pointer-events-none absolute inset-0 bg-gradient-to-b via-transparent"
					aria-hidden="true"
				/>

				<motion.p
					style={{ opacity: hintOpacity }}
					className="text-label text-champagne/80 pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2 font-sans tracking-[0.2em] uppercase"
				>
					{tDetail("panorama.scrollHint")}
				</motion.p>
			</div>

			<div className="h-[220vh]" aria-hidden="true" />
		</section>
	);
}

function PanoramaSectionHeader({ productName }: { productName: string }) {
	const tDetail = useTranslations("pages.productDetail");

	return (
		<SectionHeader
			label={tDetail("panorama.label")}
			heading={tDetail("panorama.heading")}
			description={tDetail("panorama.description", { productName })}
			align="center"
			showDivider
			className="mb-10 lg:mb-12"
		/>
	);
}
