"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useTransform, type Variants } from "framer-motion";
import { CinematicHeroVideo } from "@/components/media";
import {
	CINEMATIC_HERO_CONTENT_CLASS,
	CINEMATIC_HERO_SCRIM_CLASS,
	CINEMATIC_HERO_STICKY_CLASS,
} from "@/constants/hero";
import { useAppScroll } from "@/hooks/useAppScroll";
import { useCinematicHeroClip } from "@/hooks/useCinematicHeroClip";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Button } from "@/components/ui";
import { MEDIA_PATHS } from "@/constants/media";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/cn";

const contentVariants: Variants = {
	hidden: { opacity: 0, y: 32 },
	visible: (delay: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.9, ease: "easeOut" as const, delay },
	}),
};

const scrollIndicator: Variants = {
	animate: {
		y: [0, 10, 0],
		opacity: [0.5, 1, 0.5],
		transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const },
	},
};

/**
 * LandingHero — Cinematic Expansion.
 *
 * The video starts as a slightly larger letterbox in the center and smoothly expands
 * to fill the entire screen as the user scrolls, pulling them into the experience.
 */
export function LandingHero() {
	const t = useTranslations("landing.hero");
	const prefersReducedMotion = usePrefersReducedMotion();
	const sectionRef = useRef<HTMLElement>(null);

	// Scroll progress within the 150vh hero section
	const { scrollYProgress } = useAppScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});

	// Fade out text early as the user starts scrolling
	const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
	const textY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

	const { clipPath, videoOpacity, videoScale } = useCinematicHeroClip(scrollYProgress);

	return (
		<section
			ref={sectionRef}
			className="relative h-[150vh] w-full"
			style={{ position: "relative" }}
		>
			{/* Sticky container stays pinned for 150vh of scrolling */}
			<div className={cn(CINEMATIC_HERO_STICKY_CLASS, "bg-[#071A2B]")}>
				{/* ── Background gradient (behind the video) ── */}
				<div
					className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#1A3D5C_0%,#071A2B_70%)]"
					aria-hidden="true"
				/>

				{/* ── Expanding Cinematic Video ── */}
				<motion.div
					className="absolute inset-0 z-0 overflow-hidden"
					style={prefersReducedMotion ? undefined : { clipPath }}
				>
					<motion.div className="absolute inset-0 bg-[#071A2B]" /> {/* Base back */}
					<CinematicHeroVideo
						videoSrc={MEDIA_PATHS.video.hero}
						posterSrc={MEDIA_PATHS.images.landing.heroPoster}
						posterAlt={t("titleLine1")}
						prefersReducedMotion={prefersReducedMotion}
						useMotionVideo={!prefersReducedMotion}
						motionVideoStyle={
							prefersReducedMotion
								? undefined
								: { opacity: videoOpacity, scale: videoScale }
						}
					/>
					{/* Subtle overlay on video to keep text readable */}
					<div className={CINEMATIC_HERO_SCRIM_CLASS} aria-hidden="true" />
				</motion.div>

				{/* ── Hero Content ── */}
				<motion.div
					style={{ opacity: textOpacity, y: textY }}
					className={CINEMATIC_HERO_CONTENT_CLASS}
				>
					<motion.span
						custom={0}
						variants={contentVariants}
						initial="hidden"
						animate="visible"
						className="text-label-sm inline-block rounded-full border border-[#D4B886]/25 bg-[#D4B886]/6 px-5 py-2 font-sans tracking-widest text-[#D4B886] uppercase backdrop-blur-sm"
					>
						{t("label")}
					</motion.span>

					<motion.h1
						custom={1}
						variants={contentVariants}
						initial="hidden"
						animate="visible"
						className="text-display-xl mt-6 max-w-3xl font-serif leading-[1.1] font-light text-[#F4F4F6]"
					>
						{t("titleLine1")}
						<br />
						<em className="text-[#D4B886] italic">{t("titleLine2")}</em>
					</motion.h1>

					<motion.p
						custom={2}
						variants={contentVariants}
						initial="hidden"
						animate="visible"
						className="text-body-lg mt-6 max-w-md font-sans text-[#F4F4F6]/70"
					>
						{t("descriptionLine1")}
						<br />
						{t("descriptionLine2")}
					</motion.p>

					<motion.div
						custom={3}
						variants={contentVariants}
						initial="hidden"
						animate="visible"
						className="mt-10 flex flex-col gap-4 sm:flex-row"
					>
						<Button href={ROUTES.projects} size="lg">
							{t("primaryCta")}
						</Button>
						<Button href={ROUTES.products} variant="secondary" size="lg">
							{t("secondaryCta")}
						</Button>
					</motion.div>
				</motion.div>

				{/* ── Scroll Indicator ── */}
				<motion.div
					variants={scrollIndicator}
					animate="animate"
					style={{ opacity: textOpacity }}
					className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
					aria-hidden="true"
				>
					<span className="text-footnote font-sans tracking-widest text-[#D4B886]/45 uppercase">
						{t("scroll")}
					</span>
					<div className="h-12 w-px bg-gradient-to-b from-[#D4B886]/50 to-transparent" />
				</motion.div>
			</div>
		</section>
	);
}
