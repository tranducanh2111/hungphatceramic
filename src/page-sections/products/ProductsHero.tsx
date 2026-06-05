"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Text } from "@/components/ui";

interface ProductsHeroProps {
	activeCollectionId: string;
	totalProductsCount: number;
}

/**
 * ProductsHero — Immersive visual header for the products listing page.
 * Features a dynamic radial background and smooth layout animations.
 */
export function ProductsHero({ activeCollectionId, totalProductsCount }: ProductsHeroProps) {
	const t = useTranslations("pages.products");

	// Determine collection heading translation
	const collectionHeading =
		activeCollectionId === "all"
			? t("hero.defaultTitle")
			: t.has(`collections.${activeCollectionId}`)
				? t(`collections.${activeCollectionId}`)
				: t("hero.defaultTitle");

	return (
		<section className="relative flex min-h-[20vh] w-full flex-col justify-end overflow-hidden px-6 pt-44 pb-8 lg:px-12">
			{/* Brand Radial Background */}
			<div
				className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--color-sapphire-mist)_0%,_var(--color-sapphire-deep)_80%)]"
				style={{
					// Fallback to hex values if CSS v4 color tokens aren't parsed in inline style
					background: "radial-gradient(ellipse at center, #1A3D5C 0%, #071A2B 80%)",
				}}
				aria-hidden="true"
			/>

			{/* Top champagne border decoration */}
			<div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-champagne/20 to-transparent" />

			{/* Decorative background typography */}
			<div
				className="pointer-events-none absolute -bottom-10 left-12 font-serif text-[12vw] leading-none font-bold tracking-widest text-[#0E2A42]/20 uppercase select-none"
				aria-hidden="true"
			>
				{activeCollectionId === "all" ? "Perla" : activeCollectionId}
			</div>

			<div className="relative z-10 mx-auto w-full max-w-7xl">
				{/* Category Tag */}
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					className="mb-4 inline-flex items-center gap-3"
				>
					<span className="h-px w-8 bg-champagne/60" />
					<Text
						variant="label"
						className="font-sans font-medium tracking-[0.2em] text-champagne uppercase"
					>
						{t("hero.label")}
					</Text>
				</motion.div>

				{/* Title and Count section with Cross-fade transition */}
				<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
					<div className="max-w-2xl">
						<AnimatePresence mode="wait">
							<motion.h1
								key={activeCollectionId}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
								className="text-display-xl font-serif leading-none font-light text-linen"
							>
								{collectionHeading}
							</motion.h1>
						</AnimatePresence>
					</div>

					<AnimatePresence mode="wait">
						<motion.div
							key={`${activeCollectionId}-${totalProductsCount}`}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.4 }}
							className="text-body-sm mt-4 shrink-0 font-sans text-linen/40 md:mt-0 md:text-right"
						>
							<span className="font-serif text-3xl font-light text-champagne md:block md:leading-none">
								{totalProductsCount}
							</span>
							{totalProductsCount === 1
								? t("productCountSingle")
								: t("productCount")}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</section>
	);
}
