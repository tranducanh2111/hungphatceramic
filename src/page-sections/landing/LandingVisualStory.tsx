"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { Text } from "@/components/ui";
import { MEDIA_PATHS } from "@/constants/media";

const VISUAL_STORY_PANORAMA = {
	src: encodeURI(MEDIA_PATHS.images.panorama.orientStarGp12w05j),
} as const;

/**
 * LandingVisualStory — Emotional peak section.
 * Scroll-linked panorama reveal with centered story copy.
 */
export function LandingVisualStory() {
	const t = useTranslations("landing.visualStory");
	const sectionRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});

	const panoramaX = useTransform(scrollYProgress, [0, 1], ["0vw", "-220vw"]);

	// Text fades in when section is centered, fades out at end.
	const textOpacity = useTransform(scrollYProgress, [0.08, 0.2, 0.78, 0.92], [0, 1, 1, 0]);
	const textY = useTransform(scrollYProgress, [0.08, 0.2], [24, 0]);

	return (
		<section ref={sectionRef} className="bg-sapphire-deep relative" aria-label={t("ariaLabel")}>
			<div className="sticky top-0 h-screen overflow-hidden">
				<motion.div
					className="absolute top-0 left-0 h-full w-[320vw]"
					style={{ x: panoramaX }}
				>
					<Image
						src={VISUAL_STORY_PANORAMA.src}
						alt={t("imageAlt")}
						fill
						sizes="320vw"
						className="object-cover object-center"
					/>
				</motion.div>

				{/* Dark overlay for text readability */}
				<div className="bg-sapphire-deep/55 pointer-events-none absolute inset-0" />
				<div className="from-sapphire-deep/45 to-sapphire-deep/70 pointer-events-none absolute inset-0 bg-gradient-to-b via-transparent" />

				{/* Centered text reveal */}
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<motion.div
						style={{ opacity: textOpacity, y: textY }}
						className="max-w-2xl px-6 text-center"
					>
						<div className="bg-champagne mx-auto mb-6 h-px w-12" />
						<Text
							variant="display-lg"
							className="text-linen font-serif font-light italic"
						>
							{t("title")}
						</Text>
						<Text variant="h3" className="text-champagne mt-3 font-serif font-light">
							{t("subtitle")}
						</Text>
					</motion.div>
				</div>
			</div>
			<div className="h-[300vh]" aria-hidden="true" />
		</section>
	);
}
