"use client";

import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { Text, Button } from "@/components/ui";
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
 * Full-bleed sapphire-deep band with a centered serif headline and two CTAs.
 * No form — keeps the About page focused on story. Conversion happens on
 * the contact page.
 */
export function AboutCta() {
	const t = useTranslations("pages.about.cta");

	return (
		<section className="relative overflow-hidden bg-[#071A2B] py-28 lg:py-36">
			{/* Subtle radial glow behind the text */}
			<div
				className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#1A3D5C_0%,#071A2B_65%)] opacity-60"
				aria-hidden="true"
			/>

			<div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
				<motion.span
					custom={0}
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.4 }}
					className="text-label font-sans tracking-widest text-[#D4B886] uppercase"
				>
					{t("label")}
				</motion.span>

				<motion.div
					custom={0.15}
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.4 }}
				>
					<Text
						variant="display-lg"
						as="h2"
						className="mt-5 font-serif font-light text-[#F4F4F6]"
					>
						{t("titleLine1")}
						<br />
						<em className="text-[#D4B886] italic">{t("titleLine2")}</em>
					</Text>
				</motion.div>

				<motion.div
					custom={0.25}
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.4 }}
				>
					<Text variant="body-lg" className="mt-6 text-[#F4F4F6]/60">
						{t("description")}
					</Text>
				</motion.div>

				<motion.div
					custom={0.35}
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.4 }}
					className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
				>
					<Button href={ROUTES.contact} size="lg">
						{t("primaryCta")}
					</Button>
					<Button href={ROUTES.projects} variant="secondary" size="lg">
						{t("secondaryCta")}
					</Button>
				</motion.div>
			</div>
		</section>
	);
}
