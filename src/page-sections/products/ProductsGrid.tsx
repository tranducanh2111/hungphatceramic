"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ProductTile } from "@/components/common";
import { ProductDetail } from "@/types";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";

interface ProductsGridProps {
	products: ProductDetail[];
	activeCollectionId: string;
}

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.06,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 30 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: [0.16, 1, 0.3, 1] as const,
		},
	},
};

/** Static offset for the middle column — replaces scroll-linked transforms that thrashed layout with popLayout. */
const MIDDLE_COLUMN_STAGGER_CLASS = "lg:translate-y-[7.5rem]";

/**
 * ProductsGrid — Staggered responsive grid displaying catalog products.
 * Remapped to sapphire/champagne palette.
 */
export function ProductsGrid({ products, activeCollectionId }: ProductsGridProps) {
	const t = useTranslations("pages.products");

	if (products.length === 0) {
		return (
			<div className="flex min-h-[300px] flex-col items-center justify-center text-center">
				<Text variant="body-lg" className="text-[#F4F4F6]/45">
					{t("noProducts")}
				</Text>
			</div>
		);
	}

	return (
		<div className="relative min-h-[600px] w-full">
			{/* Large decorative background text */}
			<div
				className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
				aria-hidden="true"
			>
				<span className="font-serif text-[18vw] font-bold tracking-[0.2em] text-[#0E2A42]/10 uppercase">
					{activeCollectionId === "all" ? "PERLA" : activeCollectionId}
				</span>
			</div>

			{/* Staggered Grid Container */}
			<motion.div
				key={activeCollectionId}
				variants={containerVariants}
				initial="hidden"
				animate="show"
				className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
			>
				{products.map((product, index) => {
					const isMiddleColumn = index % 3 === 1;

					return (
						<motion.div
							key={product.slug}
							variants={itemVariants}
							className={cn(isMiddleColumn && MIDDLE_COLUMN_STAGGER_CLASS)}
						>
							<ProductTile product={product} />
						</motion.div>
					);
				})}
			</motion.div>
		</div>
	);
}
