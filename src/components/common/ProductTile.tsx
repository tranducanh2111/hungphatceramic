"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Text } from "@/components/ui";
import { ProductSummary, ProductDetail } from "@/types";
import { cn } from "@/lib/cn";

interface ProductTileProps {
	product: ProductSummary | ProductDetail;
	className?: string;
	priority?: boolean;
}

/**
 * ProductTile — A premium gallery-style card displaying a product.
 * Remapped to use Perla's brand palette (Sapphire & Champagne).
 */
export function ProductTile({ product, className, priority = false }: ProductTileProps) {
	const t = useTranslations("products.items");

	// Safely fetch translated name and description, defaulting to fallback product values
	const name = t.has(`${product.slug}.name`) ? t(`${product.slug}.name`) : product.name;

	return (
		<Link href={`/products/${product.slug}`} className="group block focus:outline-none">
			<motion.div
				className={cn(
					"relative overflow-hidden rounded-2xl bg-[#0E2A42] p-4",
					"shadow-luxury-sm ease-luxury border border-[#1A3D5C]/30 transition-all duration-500",
					"group-hover:shadow-luxury-md group-focus:shadow-luxury-md group-hover:border-[#D4B886]/40 group-focus:border-[#D4B886]/40",
					className,
				)}
				whileHover={{ y: -4 }}
				transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
			>
				{/* Aspect ratio frame for image */}
				<div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#071A2B]">
					<Image
						src={product.thumbnailUrl}
						alt={name}
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						className="ease-luxury object-cover object-center transition-transform duration-700 group-hover:scale-105 group-focus:scale-105"
						priority={priority}
					/>

					{/* Soft vignette overlay */}
					<div
						className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/85 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80"
						aria-hidden="true"
					/>
				</div>

				{/* Product metadata block */}
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
