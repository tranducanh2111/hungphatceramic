"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Text, Button } from "@/components/ui";
import { MATERIAL_CATEGORIES } from "@/constants/landing";
import { ROUTES } from "@/constants/routes";
import { MaterialCard } from "@/page-sections/landing/MaterialCard";

// ─── Section ─────────────────────────────────────────────────────────────────

/** LandingMaterials (showcase the material collections, shows the first three collections). */
export function LandingMaterials() {
	const t = useTranslations("landing.materials");
	const featuredCategories = MATERIAL_CATEGORIES.slice(0, 3);

	return (
		<section className="bg-sapphire-ocean py-28 lg:py-36">
			<div className="mx-auto max-w-7xl px-6 lg:px-12">
				{/* ── Header ── */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.55, ease: "easeOut" }}
					viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
					className="mb-10 text-center"
				>
					<span className="text-label text-champagne font-sans tracking-widest uppercase">
						{t("label")}
					</span>
					<Text variant="display-lg" className="text-linen mt-3">
						{t("heading")}
					</Text>
					<Text variant="body-lg" className="text-linen/55 mx-auto mt-5 max-w-xl">
						{t("description")}
					</Text>
				</motion.div>

				{/* ── Cards ── */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					viewport={{ once: true }}
				>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{featuredCategories.map((cat) => (
							<MaterialCard key={cat.id} category={cat} />
						))}
					</div>
				</motion.div>

				{/* ── CTA ── */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					viewport={{ once: true }}
					className="mt-12 text-center"
				>
					<Button href={ROUTES.products} variant="secondary" size="lg">
						{t("exploreFullCollection")}
					</Button>
				</motion.div>
			</div>
		</section>
	);
}

