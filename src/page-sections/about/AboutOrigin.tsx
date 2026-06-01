"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { Text } from "@/components/ui";
import { BlueprintLine } from "@/components/common";
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
 * AboutOrigin — Founding moment (flyward mission pattern, balanced layout).
 *
 * Full-width heading, then equal columns: visual anchor left, narrative right.
 * Bottom gradient bridges into Heritage (sapphire-ocean → sapphire-deep).
 */
export function AboutOrigin() {
	const t = useTranslations("pages.about.origin");

	return (
		<section
			id="our-story"
			className="bg-sapphire-ocean relative overflow-hidden py-20 sm:py-28 lg:py-36"
		>
			{/* Transition into Heritage */}
			<div
				className="to-sapphire-deep pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent sm:h-36"
				aria-hidden="true"
			/>

			<div className="relative mx-auto max-w-7xl px-6 lg:px-12">
				{/* Full-width heading — anchors the section */}
				<motion.div
					custom={0.05}
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.25 }}
					className="max-w-4xl"
				>
					<Text
						variant="display-xl"
						as="h2"
						className="text-linen font-serif leading-[1.08] font-light"
					>
						{t("heading")}
					</Text>
				</motion.div>

				{/* Balanced two-column body */}
				<div className="mt-12 grid items-start gap-10 lg:mt-16 lg:grid-cols-2 lg:gap-16 xl:gap-20">
					{/* Left — visual column (below body on mobile) */}
					<div className="order-2 flex flex-col lg:order-1">
						<motion.span
							custom={0.12}
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.2 }}
							className="font-serif text-[72px] leading-none font-light text-transparent select-none sm:text-[88px] lg:text-[110px]"
							style={{ WebkitTextStroke: "1px rgba(212,184,134,0.2)" }}
							aria-hidden="true"
						>
							01
						</motion.span>

						<motion.div
							initial={{ opacity: 0, scale: 0.97 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
							viewport={{ once: true, amount: 0.2 }}
							className="relative mt-4 aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10] lg:mt-6"
						>
							<Image
								src={MEDIA_PATHS.images.about.origin}
								alt={t("imageAlt")}
								fill
								className="object-cover object-center grayscale"
								sizes="(max-width: 1024px) 100vw, 50vw"
							/>
							<div className="ring-champagne/10 absolute inset-0 ring-1" />
						</motion.div>

						<motion.blockquote
							custom={0.22}
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.2 }}
							className="border-champagne mt-6 border-l-2 pl-5 lg:mt-8"
						>
							<Text
								variant="body-lg"
								as="p"
								className="text-champagne font-serif font-light italic"
							>
								&ldquo;{t("pullQuote")}&rdquo;
							</Text>
						</motion.blockquote>
					</div>

					{/* Right — narrative column (fills vertical space) */}
					<motion.div
						custom={0.18}
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.25 }}
						className="relative order-1 flex min-h-0 flex-col justify-between lg:order-2 lg:min-h-[320px] lg:pt-2"
					>
						<Text
							variant="body-lg"
							className="text-linen/65 leading-relaxed whitespace-pre-line lg:ml-auto lg:max-w-md lg:text-right"
						>
							{t("body")}
						</Text>

						<BlueprintLine
							variant="foundation"
							className="mt-10 h-40 w-40 self-end opacity-90 lg:absolute lg:right-0 lg:bottom-0 lg:mt-0 lg:h-48 lg:w-48"
							scrollRange={[0.15, 0.75]}
						/>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
