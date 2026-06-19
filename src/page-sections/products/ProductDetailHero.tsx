"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Text } from "@/components/ui";
import type { LocalizedProductDetail } from "@/lib/products/localizeCatalog";

interface ProductDetailHeroProps {
	product: LocalizedProductDetail;
	heroMedia: ReactNode;
	onBack: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/** ProductDetailHero (split-screen product hero section, 40% Info, 60% Image, remapped to sapphire/champagne palette). */
export function ProductDetailHero({ product, heroMedia, onBack }: ProductDetailHeroProps) {
	const collectionsT = useTranslations("collections");
	const tDetail = useTranslations("pages.productDetail");

	const collectionName = collectionsT.has(`${product.collectionId}.name`)
		? collectionsT(`${product.collectionId}.name`)
		: product.collectionId;

	return (
		<section className="bg-sapphire-deep text-linen relative min-h-[90vh] w-full">
			{/* Top bar with back navigation and close button */}
			<div className="absolute top-24 right-0 left-0 z-30 flex items-center justify-between px-6 lg:px-12">
				<Link
					href={`/products?collection=${product.collectionId}`}
					onClick={onBack}
					className="group text-body-sm text-linen/45 hover:text-champagne inline-flex items-center gap-2 font-sans tracking-widest transition-colors duration-300"
				>
					<span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
						←
					</span>
					{tDetail("backToProducts")}
				</Link>

				<Link
					href={`/products?collection=${product.collectionId}`}
					onClick={onBack}
					className="group border-sapphire-mist bg-sapphire-deep/80 text-linen/55 hover:border-champagne/40 hover:text-champagne flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300"
					aria-label="Close details"
				>
					<span className="font-sans text-xl leading-none transition-transform duration-500 group-hover:rotate-90">
						✕
					</span>
				</Link>
			</div>

			<div className="flex min-h-[90vh] flex-col lg:flex-row">
				{/* Left Panel: Info (40% width on desktop) */}
				<div className="relative flex flex-col justify-center px-6 pt-44 pb-16 md:px-12 lg:w-[40%] lg:pt-32">
					{/* Grid layout decoration lines */}
					<div className="absolute top-0 right-0 bottom-0 hidden w-px bg-gradient-to-b from-transparent via-[#1A3D5C]/35 to-transparent lg:block" />

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
						className="space-y-6"
					>
						{/* Collection Badge */}
						<div className="inline-flex items-center gap-3">
							<span className="bg-champagne/50 h-px w-6" />
							<span className="text-champagne font-sans text-xs font-semibold tracking-[0.15em] uppercase">
								{collectionName}
							</span>
						</div>

						{/* Product Title */}
						<h1 className="text-display-lg text-linen font-serif leading-tight font-light lining-nums">
							{product.title}
						</h1>

						{/* SKU Pill */}
						<div className="border-champagne/20 bg-champagne/5 inline-block rounded-full border px-4 py-1">
							<Text
								variant="footnote"
								className="text-champagne font-sans font-medium tracking-widest"
							>
								{tDetail("sku")}: {product.skuCode}
							</Text>
						</div>

						{/* Description */}
						<p className="text-body text-linen/55 max-w-md font-sans leading-relaxed">
							{product.description}
						</p>
					</motion.div>
				</div>

				{/* Right panel (server-rendered LCP image passed from page.tsx) */}
				{heroMedia}
			</div>
		</section>
	);
}
