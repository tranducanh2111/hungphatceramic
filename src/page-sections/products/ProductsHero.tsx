"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Text } from "@/components/ui";

interface ProductsHeroProps {
	activeCollectionId: string;
	totalProductsCount: number;
}

const COLLECTION_TRANSITION = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };
const COUNT_TRANSITION = { duration: 0.4 };

/** ProductsHero ( visual header for the products listing page, static on first paint, Framer Motion runs only for collection filter transitions). */
export function ProductsHero({ activeCollectionId, totalProductsCount }: ProductsHeroProps) {
	const t = useTranslations("pages.products");

	const collectionHeading =
		activeCollectionId === "all"
			? t("hero.defaultTitle")
			: t.has(`collections.${activeCollectionId}`)
				? t(`collections.${activeCollectionId}`)
				: t("hero.defaultTitle");

	return (
		<section className="relative flex min-h-[20vh] w-full flex-col justify-end overflow-hidden px-6 pt-44 pb-8 lg:px-12">
			<div
				className="absolute inset-0 z-0"
				style={{
					background: "radial-gradient(ellipse at center, #1A3D5C 0%, #071A2B 80%)",
				}}
				aria-hidden="true"
				suppressHydrationWarning
			/>

			<div className="via-champagne/20 absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />

			<div
				className="pointer-events-none absolute -bottom-10 left-12 font-serif text-[12vw] leading-none font-bold tracking-widest text-[#0E2A42]/20 uppercase select-none"
				aria-hidden="true"
			>
				{activeCollectionId === "all" ? "Perla" : activeCollectionId}
			</div>

			<div className="relative z-10 mx-auto w-full max-w-7xl">
				<div className="mb-4 inline-flex items-center gap-3">
					<span className="bg-champagne/60 h-px w-8" />
					<Text
						variant="label"
						className="text-champagne font-sans font-medium tracking-[0.2em] uppercase"
					>
						{t("hero.label")}
					</Text>
				</div>

				<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
					<div className="max-w-2xl">
						<AnimatePresence mode="wait" initial={false}>
							<motion.h1
								key={activeCollectionId}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={COLLECTION_TRANSITION}
								className="text-display-xl text-linen font-serif leading-none font-light"
							>
								{collectionHeading}
							</motion.h1>
						</AnimatePresence>
					</div>

					<AnimatePresence mode="wait" initial={false}>
						<motion.div
							key={`${activeCollectionId}-${totalProductsCount}`}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={COUNT_TRANSITION}
							className="text-body-sm text-linen/40 mt-4 shrink-0 font-sans md:mt-0 md:text-right"
						>
							<span className="text-champagne font-serif text-3xl font-light md:block md:leading-none">
								{totalProductsCount}
							</span>
							{totalProductsCount === 1 ? t("productCountSingle") : t("productCount")}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</section>
	);
}
