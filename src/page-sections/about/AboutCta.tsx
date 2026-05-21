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
		<section className="relative min-h-[85vh] overflow-hidden bg-sapphire-deep py-32 lg:min-h-[90vh] lg:py-44">
			{/* Radial background glow */}
			<div
				className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#1A3D5C_0%,#071A2B_65%)] opacity-60"
				aria-hidden="true"
			/>

			{/* Signature — completes while section is in view (footer-safe scroll window) */}
			<BlueprintLine
				variant="signature"
				className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-28 w-full max-w-4xl -translate-y-1/2 sm:h-32"
				scrollRange={[0, 0.55]}
				scrollOffset={["start 0.92", "end 0.35"]}
				opacity={1}
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
						className="font-serif font-light text-[#F4F4F6] lg:text-display-2xl"
					>
						{t("titleLine1")}
						<br />
						<em className="italic text-[#D4B886]">{t("titleLine2")}</em>
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

				<motion.div
					custom={0.3}
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.4 }}
					className="mt-10"
				>
					<Button href={ROUTES.contact} variant="outline" size="lg">
						{t("primaryCta")}
					</Button>
				</motion.div>
			</div>
		</section>
	);
}
