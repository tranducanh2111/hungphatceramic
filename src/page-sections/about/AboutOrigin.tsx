"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useSpring, type Variants } from "framer-motion";
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
	const sectionRef = useRef<HTMLElement>(null);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	const rawNumberY = useTransform(scrollYProgress, [0, 1], [-45, 45]);
	const rawImageY = useTransform(scrollYProgress, [0, 1], [-25, 25]);

	const numberY = useSpring(rawNumberY, { stiffness: 100, damping: 30, mass: 0.2 });
	const imageY = useSpring(rawImageY, { stiffness: 100, damping: 30, mass: 0.2 });

	return (
		<section
			ref={sectionRef}
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
					viewport={{ once: false, amount: 0.15 }}
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
							viewport={{ once: false, amount: 0.1 }}
							className="font-serif text-[72px] leading-none font-light text-transparent select-none sm:text-[88px] lg:text-[110px]"
							style={{ y: numberY, WebkitTextStroke: "1px rgba(212,184,134,0.2)" }}
							aria-hidden="true"
						>
							01
						</motion.span>

						<motion.div
							initial={{ opacity: 0, scale: 0.97 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
							viewport={{ once: false, amount: 0.1 }}
							className="relative mt-4 aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10] lg:mt-6"
						>
							<motion.div
								style={{ y: imageY, scale: 1.08 }}
								className="absolute inset-0"
							>
								<Image
									src={MEDIA_PATHS.images.about.origin}
									alt={t("imageAlt")}
									fill
									className="object-cover object-center grayscale"
									sizes="(max-width: 1024px) 100vw, 50vw"
									priority
								/>
							</motion.div>
							<div className="ring-champagne/10 absolute inset-0 ring-1" />
						</motion.div>

						<motion.blockquote
							custom={0.22}
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: false, amount: 0.1 }}
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
						viewport={{ once: false, amount: 0.1 }}
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
