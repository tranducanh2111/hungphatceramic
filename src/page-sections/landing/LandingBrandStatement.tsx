"use client";

import { ViewportDeferredImage } from "@/components/media";
import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { Text } from "@/components/ui";
import { MEDIA_PATHS } from "@/constants/media";

const BRAND_STATS = [
	{ id: "craftsmanshipYears", value: "12+" },
	{ id: "projectsCompleted", value: "200+" },
	{ id: "materialCollections", value: "35+" },
];

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: (delay: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: "easeOut" as const, delay },
	}),
};

/**
 * LandingBrandStatement — Identity declaration with manifesto copy and key stats.
 */
export function LandingBrandStatement() {
	const t = useTranslations("landing.brandStatement");

	return (
		<section className="relative overflow-hidden bg-sapphire-deep py-28 lg:py-36">
			<div className="mx-auto max-w-7xl px-6 lg:px-12">
				<div className="grid items-center gap-16 lg:grid-cols-2">
					{/* ── Left: Text ─────────────────────────────────────────────── */}
					<div>
						<motion.span
							custom={0}
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
							className="text-label font-sans tracking-widest text-champagne uppercase"
						>
							{t("label")}
						</motion.span>

						<motion.div
							custom={0.1}
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
						>
							<Text variant="display-lg" className="mt-4 text-linen">
								{t("titleLine1")}
								<br />
								<em className="font-light text-champagne italic">
									{t("titleLine2")}
								</em>
							</Text>
						</motion.div>

						{/* Champagne divider */}
						<motion.div
							custom={0.2}
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
							className="my-8 h-px w-16 bg-champagne"
						/>

						<motion.div
							custom={0.3}
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
						>
							<Text variant="body-lg" className="text-linen/65">
								{t("descriptionPrefix")}
								<em className="text-linen/90 not-italic">
									{" "}
									{t("descriptionEmphasis")}
								</em>
								{t("descriptionSuffix")}
							</Text>
						</motion.div>

						{/* Stats row */}
						<motion.div
							custom={0.45}
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
							className="mt-12 grid grid-cols-3 gap-6 border-t border-sapphire-mist pt-10"
						>
							{BRAND_STATS.map(({ id, value }) => (
								<div key={id}>
									<Text
										variant="display-lg"
										className="font-serif text-champagne"
									>
										{value}
									</Text>
									<Text variant="body-sm" className="mt-1 text-linen/50">
										{t(`stats.${id}`)}
									</Text>
								</div>
							))}
						</motion.div>
					</div>

					{/* ── Right: Image ───────────────────────────────────────────── */}
					<motion.div
						initial={{ opacity: 0, scale: 0.97 }}
						whileInView={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
						viewport={{ once: true, amount: 0.3 }}
						className="relative h-[520px] overflow-hidden rounded-2xl lg:h-[640px]"
					>
						<ViewportDeferredImage
							src={MEDIA_PATHS.images.landing.brandStatement}
							alt={t("imageAlt")}
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 50vw"
						/>
						{/* Subtle champagne overlay on image edges */}
						<div className="absolute inset-0 rounded-2xl ring-1 ring-[#D4B886]/10" />
					</motion.div>
				</div>
			</div>
		</section>
	);
}
