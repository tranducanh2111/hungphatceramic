"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { CinematicHeroVideo } from "@/components/media";
import { Button } from "@/components/ui";
import { MEDIA_PATHS } from "@/constants/media";
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

export function AboutHero() {
	const t = useTranslations("pages.about.hero");
	const sectionRef = useRef<HTMLElement>(null);
	const prefersReducedMotion = usePrefersReducedMotion();

	return (
		<section
			ref={sectionRef}
			className={cn("relative h-[150vh] w-full", !prefersReducedMotion && "about-hero-scroll")}
		>
			<div className="bg-sapphire-deep sticky top-0 h-screen w-full overflow-hidden">
				<div
					className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#1A3D5C_0%,#071A2B_70%)]"
					aria-hidden="true"
				/>

				<div
					className={cn(
						"absolute inset-0 z-0 overflow-hidden",
						!prefersReducedMotion && "about-hero-media-scroll",
					)}
				>
					<div className="bg-sapphire-deep absolute inset-0" />
					<CinematicHeroVideo
						videoSrc={MEDIA_PATHS.video.aboutHero}
						posterSrc={MEDIA_PATHS.images.landing.heroPoster}
						posterAlt={t("titleLine1")}
						prefersReducedMotion={prefersReducedMotion}
						videoClassName="about-hero-video-scroll transform-gpu"
					/>
					<div
						className="from-sapphire-deep/80 to-sapphire-deep/30 absolute inset-0 bg-gradient-to-t via-transparent"
						aria-hidden="true"
					/>
				</div>

				<div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
					<motion.h1
						custom={0.2}
						variants={contentVariants}
						initial="hidden"
						animate="visible"
						className="text-display-xl lg:text-display-2xl text-linen font-serif leading-[1.05] font-light"
					>
						{t("titleLine1")}
						<br />
						<em className="text-champagne italic">{t("titleLine2")}</em>
					</motion.h1>

					<motion.p
						custom={0.45}
						variants={contentVariants}
						initial="hidden"
						animate="visible"
						className="text-body-lg text-linen/60 mt-6 max-w-md font-sans"
					>
						{t("description")}
					</motion.p>

					<motion.div
						custom={0.65}
						variants={contentVariants}
						initial="hidden"
						animate="visible"
						className="mt-9"
					>
						<Button
							href="#our-story"
							variant="outline"
							size="lg"
							className="rounded-full"
						>
							{t("cta")}
						</Button>
					</motion.div>
				</div>

				<motion.div
					variants={scrollIndicatorVariants}
					animate="animate"
					className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
					aria-hidden="true"
				>
					<span className="text-footnote text-champagne/45 font-sans tracking-widest uppercase">
						{t("scroll")}
					</span>
					<div className="from-champagne/50 h-12 w-px bg-gradient-to-b to-transparent" />
				</motion.div>
			</div>
		</section>
	);
}
