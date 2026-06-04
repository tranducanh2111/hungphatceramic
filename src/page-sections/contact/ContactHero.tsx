"use client";

import { useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useTransform, useMotionTemplate, type Variants } from "framer-motion";
import { useLenis } from "lenis/react";
import { CinematicHeroVideo } from "@/components/media";
import { Button } from "@/components/ui";
import { CONTACT_SECTION_IDS } from "@/constants/contact";
import { MEDIA_PATHS } from "@/constants/media";
import { useAppScroll } from "@/hooks/useAppScroll";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { scrollToAnchorElement } from "@/lib/scrollToAnchor";

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

export function ContactHero() {
	const t = useTranslations("pages.contact.hero");
	const sectionRef = useRef<HTMLElement>(null);
	const prefersReducedMotion = usePrefersReducedMotion();
	const lenis = useLenis();

	const handleInquiryClick = useCallback(() => {
		scrollToAnchorElement(CONTACT_SECTION_IDS.inquiry, lenis, { offset: -96 });
	}, [lenis]);

	const { scrollYProgress } = useAppScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});

	const clipVertical = useTransform(scrollYProgress, [0, 0.6], [24, 0]);
	const clipHorizontal = useTransform(scrollYProgress, [0, 0.6], [11, 0]);
	const borderRadius = useTransform(scrollYProgress, [0, 0.6], [24, 0]);
	const clipPath = useMotionTemplate`inset(${clipVertical}% ${clipHorizontal}% round ${borderRadius}px)`;

	const videoOpacity = useTransform(scrollYProgress, [0, 0.6], [0.55, 1]);
	const videoScale = useTransform(scrollYProgress, [0, 0.6], [1.08, 1]);

	return (
		<section ref={sectionRef} className="relative h-[150vh] w-full">
			<div className="bg-sapphire-deep sticky top-0 h-screen w-full overflow-hidden">
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
					<div
						className="from-sapphire-deep/80 to-sapphire-deep/30 absolute inset-0 bg-gradient-to-t via-transparent"
						aria-hidden="true"
					/>
				</motion.div>

				<div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
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
						{t("titleLine1")}
						<br />
						<em className="text-champagne italic">{t("titleLine2")}</em>
					</motion.h1>

					<motion.p
						custom={0.45}
						variants={contentVariants}
						initial="hidden"
						animate="visible"
						className="text-body-lg text-linen/60 mt-6 max-w-lg font-sans"
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
							variant="outline"
							size="lg"
							className="rounded-full"
							onClick={handleInquiryClick}
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
