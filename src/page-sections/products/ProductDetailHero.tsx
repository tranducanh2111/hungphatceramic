"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Text } from "@/components/ui";
import {
	encodePublicAssetPath,
	shouldUseUnoptimizedProductImage,
} from "@/lib/products/media";
import { ProductDetail } from "@/types";

interface ProductDetailHeroProps {
	product: ProductDetail;
	onBack: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * ProductDetailHero — Split-screen product hero section (40% Info, 60% Image).
 * Remapped to sapphire/champagne palette.
 */
export function ProductDetailHero({ product, onBack }: ProductDetailHeroProps) {
	const tItems = useTranslations("products.items");
	const tPage = useTranslations("pages.products");
	const tDetail = useTranslations("pages.productDetail");

	// Localized name and description
	const name = tItems.has(`${product.slug}.name`) ? tItems(`${product.slug}.name`) : product.name;
	const description = tItems.has(`${product.slug}.description`)
		? tItems(`${product.slug}.description`)
		: product.shortDescription;

	// Localized collection name
	const collectionName = tPage.has(`collections.${product.collectionId}`)
		? tPage(`collections.${product.collectionId}`)
		: product.collectionId;

	return (
		<section className="relative min-h-[90vh] w-full bg-[#071A2B] text-[#F4F4F6]">
			{/* Top bar with back navigation and close button */}
			<div className="absolute top-24 right-0 left-0 z-30 flex items-center justify-between px-6 lg:px-12">
				<Link
					href={`/products?collection=${product.collectionId}`}
					onClick={onBack}
					className="group text-body-sm inline-flex items-center gap-2 font-sans tracking-widest text-[#F4F4F6]/45 transition-colors duration-300 hover:text-[#D4B886]"
				>
					<span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
						←
					</span>
					{tDetail("backToProducts")}
				</Link>

				<Link
					href={`/products?collection=${product.collectionId}`}
					onClick={onBack}
					className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#1A3D5C] bg-[#071A2B]/80 text-[#F4F4F6]/55 transition-all duration-300 hover:border-[#D4B886]/40 hover:text-[#D4B886]"
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
							<span className="h-px w-6 bg-[#D4B886]/50" />
							<span className="font-sans text-xs font-semibold tracking-[0.15em] text-[#D4B886] uppercase">
								{collectionName}
							</span>
						</div>

						{/* Product Title */}
						<h1 className="text-display-lg font-serif leading-tight font-light text-[#F4F4F6]">
							{name}
						</h1>

						{/* SKU Pill */}
						<div className="inline-block rounded-full border border-[#D4B886]/20 bg-[#D4B886]/5 px-4 py-1">
							<Text
								variant="footnote"
								className="font-sans font-medium tracking-widest text-[#D4B886]"
							>
								{tDetail("sku")}: {product.skuCode}
							</Text>
						</div>

						{/* Description */}
						<p className="text-body max-w-md font-sans leading-relaxed text-[#F4F4F6]/55">
							{description}
						</p>
					</motion.div>
				</div>

				{/* Right Panel: Hero Image (60% width on desktop) */}
				<div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden lg:h-auto lg:w-[60%]">
					<Image
						src={encodePublicAssetPath(product.thumbnailUrl)}
						alt={name}
						fill
						priority
						unoptimized={shouldUseUnoptimizedProductImage(product.slug)}
						sizes="(max-width: 1024px) 100vw, 60vw"
						className="object-cover object-center"
					/>
					<div
						className="absolute inset-0 hidden bg-gradient-to-r from-[#071A2B] via-transparent to-transparent opacity-80 lg:block"
						aria-hidden="true"
					/>
					<div
						className="absolute inset-0 bg-gradient-to-t from-[#071A2B] via-transparent to-transparent opacity-80 lg:hidden"
						aria-hidden="true"
					/>
				</div>
			</div>
		</section>
	);
}
