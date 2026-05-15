"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useMotionTemplate, type Variants } from "framer-motion";
import { Button } from "@/components/ui";
import { MEDIA_PATHS } from "@/constants/media";
import { ROUTES } from "@/constants/routes";

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
	const sectionRef = useRef<HTMLElement>(null);

	// Scroll progress within the 150vh hero section
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});

	// Fade out text early as the user starts scrolling
	const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
	const textY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

	// Cinematic expansion: starts a touch more open + slightly zoomed; ends full-bleed
	const clipVertical = useTransform(scrollYProgress, [0, 0.6], [24, 0]);
	const clipHorizontal = useTransform(scrollYProgress, [0, 0.6], [11, 0]);
	const borderRadius = useTransform(scrollYProgress, [0, 0.6], [24, 0]);

	// Create a dynamic clip-path CSS string
	const clipPath = useMotionTemplate`inset(${clipVertical}% ${clipHorizontal}% round ${borderRadius}px)`;

	// Video becomes brighter as it expands; slight zoom-in at rest reads larger on first paint
	const videoOpacity = useTransform(scrollYProgress, [0, 0.6], [0.6, 1]);
	const videoScale = useTransform(scrollYProgress, [0, 0.6], [1.08, 1]);

	return (
		<section
			ref={sectionRef}
			className="relative h-[150vh] w-full"
			style={{ position: "relative" }}
		>
			{/* Sticky container stays pinned for 150vh of scrolling */}
			<div className="sticky top-0 h-screen w-full overflow-hidden bg-[#071A2B]">
				{/* ── Background gradient (behind the video) ── */}
				<div
					className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#1A3D5C_0%,#071A2B_70%)]"
					aria-hidden="true"
				/>

				{/* ── Expanding Cinematic Video ── */}
				<motion.div className="absolute inset-0 z-0 overflow-hidden" style={{ clipPath }}>
					<motion.div className="absolute inset-0 bg-[#071A2B]" /> {/* Base back */}
					<motion.video
						autoPlay
						muted
						loop
						playsInline
						className="absolute inset-0 h-full w-full origin-center object-cover"
						style={{ opacity: videoOpacity, scale: videoScale }}
						poster={MEDIA_PATHS.images.landing.heroPoster}
					>
						<source src={MEDIA_PATHS.video.hero} type="video/mp4" />
					</motion.video>
					{/* Subtle overlay on video to keep text readable */}
					<div
						className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/80 via-transparent to-[#071A2B]/30"
						aria-hidden="true"
					/>
				</motion.div>

				{/* ── Hero Content ── */}
				<motion.div
					style={{ opacity: textOpacity, y: textY }}
					className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
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
