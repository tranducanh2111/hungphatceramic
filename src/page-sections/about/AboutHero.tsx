"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
	motion,
	useScroll,
	useTransform,
	useMotionTemplate,
	type Variants,
} from "framer-motion";
import { MEDIA_PATHS } from "@/constants/media";

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
 * AboutHero — Manifesto opener.
 *
 * Reuses the cinematic clip-path expansion pattern from LandingHero with a
 * stronger editorial tone: no CTA buttons, manifesto headline, minimal copy.
 * The `<h1>` lives here — all other About sections use h2 and below.
 */
export function AboutHero() {
	const t = useTranslations("pages.about.hero");
	const sectionRef = useRef<HTMLElement>(null);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});

	const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
	const textY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

	const clipVertical = useTransform(scrollYProgress, [0, 0.6], [24, 0]);
	const clipHorizontal = useTransform(scrollYProgress, [0, 0.6], [11, 0]);
	const borderRadius = useTransform(scrollYProgress, [0, 0.6], [24, 0]);
	const clipPath = useMotionTemplate`inset(${clipVertical}% ${clipHorizontal}% round ${borderRadius}px)`;

	const videoOpacity = useTransform(scrollYProgress, [0, 0.6], [0.55, 1]);
	const videoScale = useTransform(scrollYProgress, [0, 0.6], [1.08, 1]);

	return (
		<section ref={sectionRef} className="relative h-[150vh] w-full">
			<div className="sticky top-0 h-screen w-full overflow-hidden bg-[#071A2B]">
				{/* Radial background gradient */}
				<div
					className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#1A3D5C_0%,#071A2B_70%)]"
					aria-hidden="true"
				/>

				{/* Expanding cinematic video */}
				<motion.div className="absolute inset-0 z-0 overflow-hidden" style={{ clipPath }}>
					<motion.div className="absolute inset-0 bg-[#071A2B]" />
					<motion.video
						autoPlay
						muted
						loop
						playsInline
						className="absolute inset-0 h-full w-full origin-center object-cover"
						style={{ opacity: videoOpacity, scale: videoScale }}
						poster={MEDIA_PATHS.images.landing.heroPoster}
					>
						<source src={MEDIA_PATHS.video.aboutHero} type="video/mp4" />
					</motion.video>
					<div
						className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/80 via-transparent to-[#071A2B]/30"
						aria-hidden="true"
					/>
				</motion.div>

				{/* Manifesto content — h1 lives here */}
				<motion.div
					style={{ opacity: textOpacity, y: textY }}
					className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
				>
					<motion.span
						custom={0}
						variants={contentVariants}
						initial="hidden"
						animate="visible"
						className="text-label inline-block rounded-full border border-[#D4B886]/25 bg-[#D4B886]/6 px-5 py-2 font-sans tracking-widest text-[#D4B886] uppercase backdrop-blur-sm"
					>
						{t("label")}
					</motion.span>

					<motion.h1
						custom={0.3}
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
						custom={0.6}
						variants={contentVariants}
						initial="hidden"
						animate="visible"
						className="text-body-lg mt-6 max-w-md font-sans text-[#F4F4F6]/60"
					>
						{t("description")}
					</motion.p>
				</motion.div>

				{/* Scroll indicator */}
				<motion.div
					variants={scrollIndicatorVariants}
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
