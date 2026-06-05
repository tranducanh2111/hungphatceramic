"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { CinematicHeroVideo } from "@/components/media";
import { Text } from "@/components/ui";
import {
	CINEMATIC_HERO_CONTENT_CLASS,
	CINEMATIC_HERO_SCRIM_CLASS,
	CINEMATIC_HERO_STICKY_CLASS,
} from "@/constants/hero";
import { MEDIA_PATHS } from "@/constants/media";
import { useAppScroll } from "@/hooks/useAppScroll";
import { useCinematicHeroClip } from "@/hooks/useCinematicHeroClip";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

const contentVariants: Variants = {
	hidden: { opacity: 0, y: 32 },
	visible: (delay: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.9, ease: "easeOut" as const, delay },
	}),
};

const scrollIndicatorVariants: Variants = {
	animate: {
		y: [0, 10, 0],
		opacity: [0.5, 1, 0.5],
		transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const },
	},
};

/**
 * ProjectsCinematicHero — Full-viewport arrival with scroll-linked media reveal.
 */
export function ProjectsCinematicHero() {
	const t = useTranslations("pages.projects.hero");
	const sectionRef = useRef<HTMLElement>(null);
	const prefersReducedMotion = usePrefersReducedMotion();

	const { scrollYProgress } = useAppScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});

	const { clipPath, videoOpacity, videoScale } = useCinematicHeroClip(scrollYProgress);

	return (
		<section ref={sectionRef} className="relative h-[150vh] w-full">
			<div className={cn("bg-sapphire-deep", CINEMATIC_HERO_STICKY_CLASS)}>
				<div
					className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#1A3D5C_0%,#071A2B_70%)]"
					aria-hidden="true"
				/>

				<motion.div
					className="absolute inset-0 z-0 overflow-hidden"
					style={prefersReducedMotion ? undefined : { clipPath }}
				>
					<div className="bg-sapphire-deep absolute inset-0" />
					<CinematicHeroVideo
						videoSrc={MEDIA_PATHS.video.hero}
						posterSrc={MEDIA_PATHS.images.featuredProjects.empireCity}
						posterAlt={t("posterAlt")}
						prefersReducedMotion={prefersReducedMotion}
						useMotionVideo={!prefersReducedMotion}
						motionVideoStyle={
							prefersReducedMotion
								? undefined
								: { opacity: videoOpacity, scale: videoScale }
						}
					/>
					<div className={CINEMATIC_HERO_SCRIM_CLASS} aria-hidden="true" />
				</motion.div>

				<div className={CINEMATIC_HERO_CONTENT_CLASS}>
					<motion.span
						custom={0.1}
						variants={contentVariants}
						initial="hidden"
						animate="visible"
						className="text-label font-sans tracking-widest text-champagne uppercase"
					>
						{t("label")}
					</motion.span>

					<motion.h1
						custom={0.2}
						variants={contentVariants}
						initial="hidden"
						animate="visible"
						className="text-display-xl lg:text-display-2xl text-linen mt-4 font-serif leading-[1.05] font-light"
					>
						{t("title")}
						<br />
						<em className="text-champagne italic">{t("titleEmphasis")}</em>
					</motion.h1>

					<motion.div
						custom={0.45}
						variants={contentVariants}
						initial="hidden"
						animate="visible"
						className="mt-6 max-w-xl"
					>
						<Text variant="body-lg" className="text-linen/60 font-sans">
							{t("subtitle")}
						</Text>
					</motion.div>
				</div>

				<motion.div
					variants={scrollIndicatorVariants}
					animate="animate"
					className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
					aria-hidden="true"
				>
					<span className="text-footnote font-sans tracking-widest text-champagne/45 uppercase">
						{t("scroll")}
					</span>
					<div className="h-12 w-px bg-gradient-to-b from-champagne/50 to-transparent" />
				</motion.div>
			</div>
		</section>
	);
}
