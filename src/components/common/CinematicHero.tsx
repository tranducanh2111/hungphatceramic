"use client";

import { useRef, type ReactNode } from "react";
import { motion, useTransform } from "framer-motion";
import { CinematicHeroVideo } from "@/components/media";
import { Badge } from "@/components/ui";
import {
	CINEMATIC_HERO_CONTENT_CLASS,
	CINEMATIC_HERO_CONTENT_VARIANTS,
	CINEMATIC_HERO_RADIAL_CLASS,
	CINEMATIC_HERO_SCRIM_CLASS,
	CINEMATIC_HERO_SCROLL_INDICATOR_VARIANTS,
	CINEMATIC_HERO_STICKY_CLASS,
} from "@/constants/hero";
import { useAppScroll } from "@/hooks/useAppScroll";
import { useCinematicHeroClip } from "@/hooks/useCinematicHeroClip";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

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
	/** Fade hero copy on scroll — landing page only. */
	fadeContentOnScroll?: boolean;
	className?: string;
}

interface CinematicHeroContentProps {
	eyebrow?: string;
	eyebrowVariant: "default" | "hero-pill";
	titleLine1: string;
	titleLine2?: string;
	description?: ReactNode;
	children?: ReactNode;
	childrenClassName?: string;
	shouldAnimate?: boolean;
}

const DESKTOP_HERO_QUERY = "(min-width: 1024px)";

function CinematicHeroContent({
	eyebrow,
	eyebrowVariant,
	titleLine1,
	titleLine2,
	description,
	children,
	childrenClassName,
	shouldAnimate = true,
}: CinematicHeroContentProps) {
	if (!shouldAnimate) {
		return (
			<>
				{eyebrow &&
					(eyebrowVariant === "hero-pill" ? (
						<div>
							<Badge variant="hero">{eyebrow}</Badge>
						</div>
					) : (
						<span className="text-label text-champagne font-sans tracking-widest uppercase">
							{eyebrow}
						</span>
					))}

				<h1
					className={cn(
						"text-display-xl lg:text-display-2xl text-linen font-serif leading-[1.05] font-light",
						eyebrowVariant === "hero-pill" && "mt-6 max-w-3xl leading-[1.1]",
						eyebrow && eyebrowVariant !== "hero-pill" && "mt-4",
					)}
				>
					{titleLine1}
					{titleLine2 && (
						<>
							<br />
							<em className="text-champagne italic">{titleLine2}</em>
						</>
					)}
				</h1>

				{description && (
					<div className="text-body-lg text-linen/60 mt-6 max-w-lg font-sans">
						{description}
					</div>
				)}

				{children && <div className={cn("mt-9", childrenClassName)}>{children}</div>}
			</>
		);
	}

	return (
		<>
			{eyebrow &&
				(eyebrowVariant === "hero-pill" ? (
					<motion.div
						custom={0}
						variants={CINEMATIC_HERO_CONTENT_VARIANTS}
						initial="hidden"
						animate="visible"
					>
						<Badge variant="hero">{eyebrow}</Badge>
					</motion.div>
				) : (
					<motion.span
						custom={0.1}
						variants={CINEMATIC_HERO_CONTENT_VARIANTS}
						initial="hidden"
						animate="visible"
						className="text-label text-champagne font-sans tracking-widest uppercase"
					>
						{eyebrow}
					</motion.span>
				))}

			<motion.h1
				custom={0.2}
				variants={CINEMATIC_HERO_CONTENT_VARIANTS}
				initial="hidden"
				animate="visible"
				className={cn(
					"text-display-xl lg:text-display-2xl text-linen font-serif leading-[1.05] font-light",
					eyebrowVariant === "hero-pill" && "mt-6 max-w-3xl leading-[1.1]",
					eyebrow && eyebrowVariant !== "hero-pill" && "mt-4",
				)}
			>
				{titleLine1}
				{titleLine2 && (
					<>
						<br />
						<em className="text-champagne italic">{titleLine2}</em>
					</>
				)}
			</motion.h1>

			{description && (
				<motion.div
					custom={0.45}
					variants={CINEMATIC_HERO_CONTENT_VARIANTS}
					initial="hidden"
					animate="visible"
					className="text-body-lg text-linen/60 mt-6 max-w-lg font-sans"
				>
					{description}
				</motion.div>
			)}

			{children && (
				<motion.div
					custom={0.65}
					variants={CINEMATIC_HERO_CONTENT_VARIANTS}
					initial="hidden"
					animate="visible"
					className={cn("mt-9", childrenClassName)}
				>
					{children}
				</motion.div>
			)}
		</>
	);
}

/** Full-viewport hero without scroll-linked clip — avoids mobile scroll jank. */
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
}: CinematicHeroProps) {
	// On mobile (non-desktop hero), skip the video entirely for LCP.
	const isDesktopHero = useMediaQuery(DESKTOP_HERO_QUERY);

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

			{scrollLabel && (
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
			)}
		</section>
	);
}

/** Desktop scroll-clip hero — 150vh sticky driver with letterbox expansion. */
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

/** Shared cinematic hero shell for landing, about, contact, and projects. */
export function CinematicHero(props: CinematicHeroProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	// Mobile-first SSR default (false) — avoids hydrating 150vh scroll hero on phones.
	const isDesktopHero = useMediaQuery(DESKTOP_HERO_QUERY);

	if (prefersReducedMotion || !isDesktopHero) {
		return <CinematicHeroStatic {...props} />;
	}

	return <CinematicHeroScroll {...props} />;
}
