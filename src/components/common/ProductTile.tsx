"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Text } from "@/components/ui";
import type { ProductListingItem } from "@/lib/products/listing";
import { ProductSummary, ProductDetail } from "@/types";
import { cn } from "@/lib/cn";

interface ProductTileProps {
	product: ProductSummary | ProductDetail | ProductListingItem;
	className?: string;
	priority?: boolean;
	/** Immersive full-bleed image with overlaid copy for catalog grids. */
	variant?: "default" | "catalog";
}

/**
 * ProductTile — A premium gallery-style card displaying a product.
 * Remapped to use Perla's brand palette (Sapphire & Champagne).
 */
export function ProductTile({
	product,
	className,
	priority = false,
	variant = "default",
}: ProductTileProps) {
	const t = useTranslations("products.items");
	const isCatalogTile = variant === "catalog";

	const name = t.has(`${product.slug}.name`) ? t(`${product.slug}.name`) : product.name;

	if (isCatalogTile) {
		const catalogCardClassName = cn(
			"relative aspect-[3/4] overflow-hidden rounded-2xl",
			"shadow-luxury-sm ease-luxury border border-[#1A3D5C]/30 transition-all duration-500",
			"group-hover:shadow-luxury-md group-focus:shadow-luxury-md group-hover:border-[#D4B886]/40 group-focus:border-[#D4B886]/40",
			"group-hover:-translate-y-1 group-focus:-translate-y-1",
			className,
		);

		return (
			<Link href={`/products/${product.slug}`} className="group block focus:outline-none">
				<div className={catalogCardClassName}>
					<Image
						src={product.thumbnailUrl}
						alt={name}
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						quality={55}
						loading={priority ? undefined : "lazy"}
						className="ease-luxury object-cover object-center transition-transform duration-700 group-hover:scale-105 group-focus:scale-105"
						priority={priority}
					/>

					<div
						className="from-sapphire-deep via-sapphire-deep/55 absolute inset-0 bg-gradient-to-t to-transparent"
						aria-hidden="true"
					/>

					<div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 p-4 pt-16 sm:p-5">
						<div className="flex items-center justify-between gap-3">
							<Text
								variant="footnote"
								className="font-sans font-medium tracking-[0.15em] text-champagne/90 uppercase"
							>
								{product.skuCode}
							</Text>
							<span className="shrink-0 font-sans text-[10px] font-semibold tracking-wider text-linen/50 uppercase">
								{product.category}
							</span>
						</div>

						<Text
							variant="body-sm"
							className="line-clamp-2 font-sans font-semibold text-linen transition-colors duration-300 group-hover:text-champagne-light group-focus:text-champagne-light"
						>
							{name}
						</Text>
					</div>
				</div>
			</Link>
		);
	}

	const cardClassName = cn(
		"relative overflow-hidden rounded-2xl bg-[#0E2A42] p-4",
		"shadow-luxury-sm ease-luxury border border-[#1A3D5C]/30 transition-all duration-500",
		"group-hover:shadow-luxury-md group-focus:shadow-luxury-md group-hover:border-[#D4B886]/40 group-focus:border-[#D4B886]/40",
		className,
	);

	return (
		<Link href={`/products/${product.slug}`} className="group block focus:outline-none">
			<motion.div
				className={cardClassName}
				whileHover={{ y: -4 }}
				transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
			>
				<div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#071A2B]">
					<Image
						src={product.thumbnailUrl}
						alt={name}
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						quality={75}
						loading={priority ? undefined : "lazy"}
						className="ease-luxury object-cover object-center transition-transform duration-700 group-hover:scale-105 group-focus:scale-105"
						priority={priority}
					/>

					<div
						className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/85 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80"
						aria-hidden="true"
					/>
				</div>

				<div className="mt-4 flex flex-col gap-1.5 px-1">
					<div className="flex items-center justify-between">
						<Text
							variant="footnote"
							className="font-sans font-medium tracking-[0.15em] text-[#D4B886]/70 uppercase"
						>
							{product.skuCode}
						</Text>
						<span className="font-sans text-[10px] font-semibold tracking-wider text-[#F4F4F6]/30 uppercase">
							{product.category}
						</span>
					</div>

					<Text
						variant="body-sm"
						className="truncate font-sans font-semibold text-[#F4F4F6] transition-colors duration-300 group-hover:text-[#D4B886]/90"
					>
						{name}
					</Text>
				</div>
			</motion.div>
		</Link>
	);
}
