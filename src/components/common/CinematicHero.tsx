"use client";

import { useRef, type ReactNode } from "react";
import { motion, useTransform } from "framer-motion";
import { CinematicHeroVideo } from "@/components/media";
import {
	CINEMATIC_HERO_CONTENT_CLASS,
	CINEMATIC_HERO_RADIAL_CLASS,
	CINEMATIC_HERO_SCRIM_CLASS,
	CINEMATIC_HERO_SCROLL_INDICATOR_VARIANTS,
	CINEMATIC_HERO_STICKY_CLASS,
	SCROLL_INDICATOR_BOUNCE_CLASS,
} from "@/constants/hero";
import { DESKTOP_LAYOUT_QUERY } from "@/constants/breakpoints";
import { useAppScroll } from "@/hooks/useAppScroll";
import { useCinematicHeroClip } from "@/hooks/useCinematicHeroClip";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { CinematicHeroContent } from "@/components/common/CinematicHeroContent";

interface CinematicHeroProps {
	videoSrc: string;
	posterSrc: string;
	posterAlt: string;
	titleLine1: string;
	titleLine2?: string;
	eyebrow?: string;
	eyebrowVariant?: "default" | "hero-pill";
	description?: ReactNode;
	children?: ReactNode;
	childrenClassName?: string;
	scrollLabel?: string;
	/** Fade hero copy on scroll (landing page only). */
	fadeContentOnScroll?: boolean;
	className?: string;
	isDesktopSSR?: boolean;
}

const DESKTOP_HERO_QUERY = DESKTOP_LAYOUT_QUERY;

/** Full-viewport hero without scroll-linked clip (avoids mobile scroll jank). */
function CinematicHeroStatic({
	videoSrc,
	posterSrc,
	posterAlt,
	titleLine1,
	titleLine2,
	eyebrow,
	eyebrowVariant = "default",
	description,
	children,
	childrenClassName,
	scrollLabel,
	className,
	isDesktopHero = false,
}: CinematicHeroProps & { isDesktopHero?: boolean }) {
	const heroContent = (
		<CinematicHeroContent
			eyebrow={eyebrow}
			eyebrowVariant={eyebrowVariant}
			titleLine1={titleLine1}
			titleLine2={titleLine2}
			description={description}
			childrenClassName={childrenClassName}
			shouldAnimate={false}
		>
			{children}
		</CinematicHeroContent>
	);

	return (
		<section className={cn("bg-sapphire-deep relative min-h-[100dvh] w-full", className)}>
			<div className={CINEMATIC_HERO_RADIAL_CLASS} aria-hidden="true" />

			<div className="absolute inset-0 z-0 overflow-hidden">
				<div className="bg-sapphire-deep absolute inset-0" />
				<CinematicHeroVideo
					videoSrc={videoSrc}
					posterSrc={posterSrc}
					posterAlt={posterAlt}
					prefersReducedMotion={false}
					isMobile={!isDesktopHero}
					useMotionVideo={false}
				/>
				<div className={CINEMATIC_HERO_SCRIM_CLASS} aria-hidden="true" />
			</div>

			<div className={CINEMATIC_HERO_CONTENT_CLASS}>{heroContent}</div>

			{scrollLabel &&
				(isDesktopHero ? (
					<motion.div
						variants={CINEMATIC_HERO_SCROLL_INDICATOR_VARIANTS}
						animate="animate"
						className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
						aria-hidden="true"
					>
						<span className="text-footnote text-champagne/45 font-sans tracking-widest uppercase">
							{scrollLabel}
						</span>
						<div className="from-champagne/50 h-12 w-px bg-gradient-to-b to-transparent" />
					</motion.div>
				) : (
					<div
						className={cn(
							"absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2",
							SCROLL_INDICATOR_BOUNCE_CLASS,
						)}
						aria-hidden="true"
					>
						<span className="text-footnote text-champagne/45 font-sans tracking-widest uppercase">
							{scrollLabel}
						</span>
						<div className="from-champagne/50 h-12 w-px bg-gradient-to-b to-transparent" />
					</div>
				))}
		</section>
	);
}

/** Desktop scroll-clip hero (150vh sticky driver with letterbox expansion). */
function CinematicHeroScroll({
	videoSrc,
	posterSrc,
	posterAlt,
	titleLine1,
	titleLine2,
	eyebrow,
	eyebrowVariant = "default",
	description,
	children,
	childrenClassName,
	scrollLabel,
	fadeContentOnScroll = false,
	className,
}: CinematicHeroProps) {
	const sectionRef = useRef<HTMLElement>(null);
	const prefersReducedMotion = usePrefersReducedMotion();

	const { scrollYProgress } = useAppScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});

	const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
	const textY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
	const { clipPath, videoOpacity, videoScale } = useCinematicHeroClip(scrollYProgress);

	const heroContent = (
		<CinematicHeroContent
			eyebrow={eyebrow}
			eyebrowVariant={eyebrowVariant}
			titleLine1={titleLine1}
			titleLine2={titleLine2}
			description={description}
			childrenClassName={childrenClassName}
		>
			{children}
		</CinematicHeroContent>
	);

	return (
		<section ref={sectionRef} className={cn("relative h-[150vh] w-full", className)}>
			<div className={cn("bg-sapphire-deep", CINEMATIC_HERO_STICKY_CLASS)}>
				<div className={CINEMATIC_HERO_RADIAL_CLASS} aria-hidden="true" />

				<motion.div
					className="absolute inset-0 z-0 overflow-hidden"
					style={prefersReducedMotion ? undefined : { clipPath }}
				>
					<div className="bg-sapphire-deep absolute inset-0" />
					<CinematicHeroVideo
						videoSrc={videoSrc}
						posterSrc={posterSrc}
						posterAlt={posterAlt}
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

				{fadeContentOnScroll ? (
					<motion.div
						className={CINEMATIC_HERO_CONTENT_CLASS}
						style={{ opacity: textOpacity, y: textY }}
					>
						{heroContent}
					</motion.div>
				) : (
					<div className={CINEMATIC_HERO_CONTENT_CLASS}>{heroContent}</div>
				)}

				{scrollLabel && (
					<motion.div
						variants={CINEMATIC_HERO_SCROLL_INDICATOR_VARIANTS}
						animate="animate"
						style={fadeContentOnScroll ? { opacity: textOpacity } : undefined}
						className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
						aria-hidden="true"
					>
						<span className="text-footnote text-champagne/45 font-sans tracking-widest uppercase">
							{scrollLabel}
						</span>
						<div className="from-champagne/50 h-12 w-px bg-gradient-to-b to-transparent" />
					</motion.div>
				)}
			</div>
		</section>
	);
}

/** Shared cinematic hero shell for landing, about, contact, and projects page. */
export function CinematicHero(props: CinematicHeroProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	// Use the server-provided default to avoid hydrating static hero on desktop
	const isDesktopHero = useMediaQuery(DESKTOP_HERO_QUERY, props.isDesktopSSR);

	if (prefersReducedMotion || !isDesktopHero) {
		return <CinematicHeroStatic {...props} isDesktopHero={isDesktopHero} />;
	}

	return <CinematicHeroScroll {...props} />;
}
