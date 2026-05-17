"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { Text } from "@/components/ui";
import { MEDIA_PATHS } from "@/constants/media";

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: (delay: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: "easeOut" as const, delay },
	}),
};

/**
 * AboutOrigin — Founding moment.
 *
 * Two-column: left has a champagne pull-quote + founding body copy;
 * right has an archival-toned origin photograph.
 * Layout reuses the LandingBrandStatement pattern.
 */
export function AboutOrigin() {
	const t = useTranslations("pages.about.origin");

	return (
		<section className="relative overflow-hidden bg-[#0E2A42] py-28 lg:py-36">
			<div className="mx-auto max-w-7xl px-6 lg:px-12">
				<div className="grid items-center gap-16 lg:grid-cols-2">
					{/* Left: Label, pull-quote, body */}
					<div>
						<motion.span
							custom={0}
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
							className="text-label font-sans tracking-widest text-[#D4B886] uppercase"
						>
							{t("label")}
						</motion.span>

						<motion.blockquote
							custom={0.15}
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
							className="mt-6 border-l-2 border-[#D4B886] pl-6"
						>
							<Text
								variant="display-lg"
								as="p"
								className="font-serif font-light italic text-[#D4B886]"
							>
								&ldquo;{t("pullQuote")}&rdquo;
							</Text>
						</motion.blockquote>

						<motion.div
							custom={0.25}
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
							className="my-8 h-px w-16 bg-[#D4B886]"
						/>

						<motion.div
							custom={0.35}
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
						>
							<Text variant="body-lg" className="leading-relaxed text-[#F4F4F6]/65">
								{t("body")}
							</Text>
						</motion.div>
					</div>

					{/* Right: Archival origin image */}
					<motion.div
						initial={{ opacity: 0, scale: 0.97 }}
						whileInView={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
						viewport={{ once: true, amount: 0.3 }}
						className="relative h-[520px] overflow-hidden rounded-2xl lg:h-[640px]"
					>
						<Image
							src={MEDIA_PATHS.images.about.origin}
							alt={t("imageAlt")}
							fill
							className="object-cover object-center grayscale"
							sizes="(max-width: 1024px) 100vw, 50vw"
						/>
						<div className="absolute inset-0 rounded-2xl ring-1 ring-[#D4B886]/10" />
					</motion.div>
				</div>
			</div>
		</section>
	);
}
