"use client";

import Image from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { motion, type MotionStyle } from "framer-motion";
import { cn } from "@/lib/cn";

export interface CinematicHeroVideoProps {
	videoSrc: string;
	posterSrc: string;
	posterAlt: string;
	prefersReducedMotion: boolean;
	/** On mobile, skip the video entirely (show only the poster for optimal LCP). */
	isMobile?: boolean;
	className?: string;
	videoClassName?: string;
	videoStyle?: React.CSSProperties;
	/** Scroll-linked transforms (only used with `useMotionVideo`). */
	motionVideoStyle?: MotionStyle;
	/** When true, renders `motion.video` for scroll-linked transforms (landing hero). */
	useMotionVideo?: boolean;
}

/** Shared poster-only render path (used for reduced motion and mobile). */
function HeroPosterImage({
	posterSrc,
	posterAlt,
	className,
}: {
	posterSrc: string;
	posterAlt: string;
	className?: string;
}) {
	return (
		<div className={cn("absolute inset-0", className)}>
			<Image
				src={posterSrc}
				alt={posterAlt}
				fill
				priority
				suppressHydrationWarning
				sizes="100vw"
				className="object-cover object-center"
			/>
		</div>
	);
}

/**
 * Hero background video (metadata preload, IO pause off-screen, poster via next/image when reduced motion or mobile).
 * On mobile (`isMobile=true`) the video element is skipped to avoid downloading a large media file during LCP.
 */
export const CinematicHeroVideo = forwardRef<HTMLVideoElement, CinematicHeroVideoProps>(
	function CinematicHeroVideo(
		{
			videoSrc,
			posterSrc,
			posterAlt,
			prefersReducedMotion,
			isMobile = false,
			className,
			videoClassName,
			videoStyle,
			motionVideoStyle,
			useMotionVideo = false,
		},
		forwardedRef,
	) {
		const videoRef = useRef<HTMLVideoElement>(null);

		useImperativeHandle(forwardedRef, () => videoRef.current as HTMLVideoElement);

		useEffect(() => {
			const videoElement = videoRef.current;
			if (!videoElement || prefersReducedMotion || isMobile) return;

			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry?.isIntersecting) {
						void videoElement.play().catch(() => undefined);
					} else {
						videoElement.pause();
					}
				},
				{ threshold: 0.15 },
			);

			observer.observe(videoElement);
			return () => observer.disconnect();
		}, [prefersReducedMotion, isMobile]);

		// Mobile and reduced-motion share the same static poster path.
		if (prefersReducedMotion || isMobile) {
			return (
				<HeroPosterImage
					posterSrc={posterSrc}
					posterAlt={posterAlt}
					className={className}
				/>
			);
		}

		const source = <source src={videoSrc} type="video/mp4" />;

		if (useMotionVideo) {
			return (
				<div className={cn("absolute inset-0", className)}>
					<motion.video
						ref={videoRef}
						muted
						loop
						playsInline
						preload="metadata"
						poster={posterSrc}
						suppressHydrationWarning
						className={cn(
							"absolute inset-0 h-full w-full origin-center object-cover",
							videoClassName,
						)}
						style={motionVideoStyle}
					>
						{source}
					</motion.video>
				</div>
			);
		}

		return (
			<div className={cn("absolute inset-0", className)}>
				<video
					ref={videoRef}
					muted
					loop
					playsInline
					preload="metadata"
					poster={posterSrc}
					suppressHydrationWarning
					className={cn(
						"absolute inset-0 h-full w-full origin-center object-cover",
						videoClassName,
					)}
					style={videoStyle}
				>
					{source}
				</video>
			</div>
		);
	},
);
