"use client";

import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { Text, Button } from "@/components/ui";
import { BlueprintLine } from "@/components/common";
import { ROUTES } from "@/constants/routes";

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: (delay: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: "easeOut" as const, delay },
	}),
};

/**
 * AboutCta — Project inquiry closer.
 *
 * Changes from v1:
 *   - Secondary CTA removed (single, focused action).
 *   - Headline bumped to `display-2xl`.
 *   - Single outline pill CTA "Book a Consultation".
 *   - Eyebrow label removed.
 *   - Decorative vein curve drawn behind the headline.
 */
export function AboutCta() {
	const t = useTranslations("pages.about.cta");

	return (
		<section className="bg-sapphire-deep relative min-h-[85vh] overflow-hidden py-32 lg:min-h-[90vh] lg:py-44">
			{/* Radial background glow */}
			<div
				className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#1A3D5C_0%,#071A2B_65%)] opacity-60"
				aria-hidden="true"
			/>

			<div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
				<motion.div
					custom={0.1}
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.4 }}
				>
					<Text
						variant="display-lg"
						as="h2"
						className="lg:text-display-2xl font-serif font-light text-[#F4F4F6]"
					>
						{t("titleLine1")}
						<br />
						<em className="text-[#D4B886] italic">{t("titleLine2")}</em>
					</Text>
				</motion.div>

				<motion.div
					custom={0.2}
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.4 }}
				>
					<Text variant="body-lg" className="mt-7 text-[#F4F4F6]/55">
						{t("description")}
					</Text>
				</motion.div>

				<div className="relative mt-12 flex justify-center py-8">
					<BlueprintLine
						variant="signature"
						className="pointer-events-none absolute inset-x-0 top-1/2 left-1/2 z-0 h-28 w-[100vw] max-w-4xl -translate-x-1/2 translate-y-24 sm:h-32 sm:translate-y-18"
						scrollRange={[0, 0.55]}
						scrollOffset={["start 0.92", "end 0.35"]}
						opacity={1}
					/>
					<motion.div
						custom={0.3}
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.4 }}
						className="relative z-10"
					>
						<Button href={ROUTES.contact} variant="outline" size="lg">
							{t("primaryCta")}
						</Button>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
