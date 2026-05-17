"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { Text } from "@/components/ui";
import { CRAFT_BEATS } from "@/constants/about";

/**
 * AboutCraft — Ceramic craft story told in three beats.
 *
 * Reuses LandingVisualStory's sticky-scroll pattern, but with three full-bleed
 * images that cross-fade as the user scrolls, and three caption overlays that
 * fade in/out independently at their respective scroll positions.
 *
 * Scroll positions per beat (out of 300vh total):
 *   Beat 0 (kiln)        → 0 – 33%
 *   Beat 1 (polishing)   → 33 – 66%
 *   Beat 2 (installation)→ 66 – 100%
 */
export function AboutCraft() {
	const t = useTranslations("pages.about.craft");
	const sectionRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});

	// Image opacity ranges: each image holds for its beat and cross-fades at boundaries
	const imageOpacities = [
		useTransform(scrollYProgress, [0, 0.28, 0.38, 0.5], [1, 1, 0, 0]),
		useTransform(scrollYProgress, [0.28, 0.38, 0.62, 0.72], [0, 1, 1, 0]),
		useTransform(scrollYProgress, [0.62, 0.72, 1.0, 1.0], [0, 1, 1, 1]),
	] as const;

	// Caption opacity ranges: fade in early in beat, fade out before transition
	const captionOpacities = [
		useTransform(scrollYProgress, [0, 0.08, 0.28, 0.36], [0, 1, 1, 0]),
		useTransform(scrollYProgress, [0.30, 0.40, 0.60, 0.68], [0, 1, 1, 0]),
		useTransform(scrollYProgress, [0.62, 0.72, 0.92, 1.0], [0, 1, 1, 0]),
	] as const;

	const captionY = [
		useTransform(scrollYProgress, [0, 0.08], [16, 0]),
		useTransform(scrollYProgress, [0.30, 0.40], [16, 0]),
		useTransform(scrollYProgress, [0.62, 0.72], [16, 0]),
	] as const;

	return (
		<section
			ref={sectionRef}
			className="relative bg-[#071A2B]"
			aria-label={t("ariaLabel")}
		>
			<div className="sticky top-0 h-screen overflow-hidden">
				{/* Background images — layered and cross-fading */}
				{CRAFT_BEATS.map((beat, index) => (
					<motion.div
						key={beat.id}
						className="absolute inset-0"
						style={{ opacity: imageOpacities[index] }}
					>
						<Image
							src={beat.imageUrl}
							alt={t(`beats.${beat.id}.imageAlt`)}
							fill
							className="object-cover object-center"
							sizes="100vw"
							priority={index === 0}
						/>
					</motion.div>
				))}

				{/* Dark overlays for caption legibility */}
				<div
					className="pointer-events-none absolute inset-0 bg-[#071A2B]/50"
					aria-hidden="true"
				/>
				<div
					className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#071A2B]/40 via-transparent to-[#071A2B]/65"
					aria-hidden="true"
				/>

				{/* Caption beats — centered overlay */}
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					{CRAFT_BEATS.map((beat, index) => (
						<motion.div
							key={beat.id}
							style={{ opacity: captionOpacities[index], y: captionY[index] }}
							className="absolute max-w-xl px-6 text-center"
						>
							<span className="text-label font-sans tracking-widest text-[#D4B886]/70 uppercase">
								{t(`beats.${beat.id}.label`)}
							</span>
							<div className="mx-auto my-5 h-px w-10 bg-[#D4B886]" />
							<Text
								variant="display-lg"
								as="h2"
								className="font-serif font-light italic text-[#F4F4F6]"
							>
								{t(`beats.${beat.id}.title`)}
							</Text>
							<Text variant="body-lg" className="mt-4 leading-relaxed text-[#F4F4F6]/65">
								{t(`beats.${beat.id}.body`)}
							</Text>
						</motion.div>
					))}
				</div>
			</div>

			{/* Scroll driver — 300vh gives 100vh per beat */}
			<div className="h-[300vh]" aria-hidden="true" />
		</section>
	);
}
