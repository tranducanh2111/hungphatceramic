"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useTransform } from "framer-motion";
import { ProductTile } from "@/components/common";
import { ProductDetail } from "@/types";
import { Text } from "@/components/ui";
import { useAppScroll } from "@/hooks/useAppScroll";

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

/**
 * ProductsGrid — Staggered responsive grid displaying catalog products.
 * Remapped to sapphire/champagne palette.
 */
export function ProductsGrid({ products, activeCollectionId }: ProductsGridProps) {
	const t = useTranslations("pages.products");

	// Sync with Lenis smooth scroll using our custom useAppScroll hook
	const { scrollY } = useAppScroll();

	// Map absolute scroll position so it starts perfectly flat (0%)
	// and shifts down to exactly 50% as the user scrolls the first 300px.
	const middleColumnY = useTransform(scrollY, [0, 300], ["0%", "50%"]);

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
		<motion.div 
			className="relative min-h-[600px] w-full"
			style={{ "--middle-y": middleColumnY } as React.CSSProperties}
		>
			{/* Large decorative background text */}
			<div
				className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none overflow-hidden"
				aria-hidden="true"
			>
				<span className="font-serif text-[18vw] font-bold text-[#0E2A42]/10 uppercase tracking-[0.2em]">
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
				<AnimatePresence mode="popLayout">
					{products.map((product, index) => {
						// Apply dynamic staggered offset on desktop columns using CSS variable
						const isMiddleColumn = index % 3 === 1;
						const staggerClass = isMiddleColumn 
							? "lg:translate-y-[var(--middle-y)] will-change-transform" 
							: "";

						return (
							<motion.div
								key={product.slug}
								variants={itemVariants}
								layout
							>
								<div className={staggerClass}>
									<ProductTile product={product} />
								</div>
							</motion.div>
						);
					})}
				</AnimatePresence>
			</motion.div>
		</motion.div>
	);
}
