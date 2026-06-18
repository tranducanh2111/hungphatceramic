"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useAppScroll } from "@/hooks/useAppScroll";
import type { LucideIcon } from "lucide-react";
import { Text } from "@/components/ui";
import { DESKTOP_LAYOUT_QUERY } from "@/constants/breakpoints";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

interface PillarDefinition {
	id: string;
	icon: LucideIcon;
}

interface ValuesPrinciplesTimelineProps {
	pillars: readonly PillarDefinition[];
}

/** Maps shared timeline progress to per-node opacity when the fill line reaches each dot. */
function useNodeReveal(scrollYProgress: MotionValue<number>, nodeIndex: number, nodeCount: number) {
	const nodeCenter = (nodeIndex + 0.5) / nodeCount;

	return useTransform(scrollYProgress, (progress) => {
		const revealStart = Math.max(0, nodeCenter - 0.2);
		const revealEnd = nodeCenter - 0.05; // Ends exactly at center

		if (progress <= revealStart) return 0.15;
		if (progress >= revealEnd) return 1;

		const t = (progress - revealStart) / (revealEnd - revealStart);
		return 0.15 + t * 0.85;
	});
}

interface PillarRowProps {
	pillar: PillarDefinition;
	index: number;
	nodeCount: number;
	scrollYProgress: MotionValue<number>;
}

function PillarRow({ pillar, index, nodeCount, scrollYProgress }: PillarRowProps) {
	const t = useTranslations("pages.about.values");
	const Icon = pillar.icon;
	const isEven = index % 2 === 0;

	const iconOpacity = useNodeReveal(scrollYProgress, index, nodeCount);
	const contentOpacity = useTransform(scrollYProgress, (progress) => {
		const nodeCenter = (index + 0.5) / nodeCount;
		const revealStart = Math.max(0, nodeCenter - 0.15);
		const revealEnd = nodeCenter; // Ends exactly at center

		if (progress <= revealStart) return 0;
		if (progress >= revealEnd) return 1;

		return (progress - revealStart) / (revealEnd - revealStart);
	});

	const contentY = useTransform(scrollYProgress, (progress) => {
		const nodeCenter = (index + 0.5) / nodeCount;

		// Start with an offset of 24px and slide up to 0 at nodeCenter
		if (progress <= nodeCenter - 0.15) return 24;
		if (progress >= nodeCenter) return 0;

		const t = (progress - (nodeCenter - 0.15)) / 0.15;
		return 24 - t * 24;
	});

	return (
		<div
			className={cn(
				"relative flex flex-col sm:flex-row",
				isEven ? "sm:flex-row-reverse" : "",
			)}
		>
			<motion.div
				style={{ opacity: iconOpacity }}
				className="absolute left-0 z-10 sm:left-1/2 sm:-ml-7"
			>
				<div className="border-champagne/30 bg-sapphire-deep flex h-14 w-14 items-center justify-center rounded-full border shadow-[0_0_20px_rgba(7,26,43,0.8)]">
					<Icon className="text-champagne h-6 w-6" />
				</div>
			</motion.div>

			<motion.div
				style={{ opacity: contentOpacity, y: contentY }}
				className="mt-2 ml-20 w-auto sm:mt-0 sm:ml-0 sm:w-1/2 sm:px-12"
			>
				<div
					className={cn(
						"flex flex-col",
						isEven ? "sm:items-end sm:text-right" : "sm:items-start sm:text-left",
					)}
				>
					<span className="text-champagne font-sans text-lg font-light tracking-[0.25em] uppercase">
						{`0${index + 1}`}
					</span>
					<Text
						variant="h2"
						as="h3"
						className="text-linen mt-2 font-serif text-2xl leading-tight font-light sm:text-3xl lg:text-[32px]"
					>
						{t(`list.${pillar.id}.title`)}
					</Text>
					<Text variant="body" className="text-linen/55 mt-3 leading-relaxed">
						{t(`list.${pillar.id}.description`)}
					</Text>
				</div>
			</motion.div>

			<div className="hidden sm:block sm:w-1/2" />
		</div>
	);
}

function ValuesPrinciplesTimelineStatic({ pillars }: ValuesPrinciplesTimelineProps) {
	const t = useTranslations("pages.about.values");

	return (
		<div className="relative mx-auto max-w-4xl">
			<div className="from-champagne/35 via-sapphire-mist absolute top-0 bottom-0 left-[27px] w-px bg-gradient-to-b to-transparent sm:left-1/2" />
			<div className="flex flex-col gap-16 lg:gap-20">
				{pillars.map((pillar, index) => {
					const Icon = pillar.icon;
					const isEven = index % 2 === 0;

					return (
						<div
							key={pillar.id}
							className={cn(
								"relative flex flex-col sm:flex-row",
								isEven ? "sm:flex-row-reverse" : "",
							)}
						>
							<div className="absolute left-0 z-10 sm:left-1/2 sm:-ml-7">
								<div className="border-champagne/30 bg-sapphire-deep flex h-14 w-14 items-center justify-center rounded-full border">
									<Icon className="text-champagne h-6 w-6" />
								</div>
							</div>
							<div className="mt-2 ml-20 w-auto sm:mt-0 sm:ml-0 sm:w-1/2 sm:px-12">
								<div
									className={cn(
										"flex flex-col",
										isEven
											? "sm:items-end sm:text-right"
											: "sm:items-start sm:text-left",
									)}
								>
									<span className="text-champagne font-sans text-lg font-light tracking-[0.25em] uppercase">
										{`0${index + 1}`}
									</span>
									<Text
										variant="h2"
										as="h3"
										className="text-linen mt-2 font-serif text-2xl leading-tight font-light"
									>
										{t(`list.${pillar.id}.title`)}
									</Text>
									<Text
										variant="body"
										className="text-linen/55 mt-3 leading-relaxed"
									>
										{t(`list.${pillar.id}.description`)}
									</Text>
								</div>
							</div>
							<div className="hidden sm:block sm:w-1/2" />
						</div>
					);
				})}
			</div>
		</div>
	);
}

function ValuesPrinciplesTimelineAnimated({ pillars }: ValuesPrinciplesTimelineProps) {
	const timelineRef = useRef<HTMLDivElement>(null);
	const nodeCount = pillars.length;

	const { scrollYProgress } = useAppScroll({
		target: timelineRef,
		offset: ["start 0.9", "end 0.15"],
	});

	const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

	return (
		<div ref={timelineRef} className="relative mx-auto max-w-4xl">
			{/* Timeline track + scroll-driven champagne fill */}
			<div
				className="absolute top-0 bottom-0 left-[27px] w-px -translate-x-1/2 sm:left-1/2"
				aria-hidden="true"
			>
				<div className="via-sapphire-mist/80 from-champagne/20 absolute inset-0 w-px bg-gradient-to-b to-transparent" />
				<motion.div
					className="from-champagne/50 via-champagne to-champagne/70 absolute inset-x-0 top-0 h-full w-px origin-top bg-gradient-to-b"
					style={{ scaleY: lineScaleY }}
				/>
			</div>

			<div className="flex flex-col gap-16 lg:gap-20">
				{pillars.map((pillar, index) => (
					<PillarRow
						key={pillar.id}
						pillar={pillar}
						index={index}
						nodeCount={nodeCount}
						scrollYProgress={scrollYProgress}
					/>
				))}
			</div>
		</div>
	);
}

export function ValuesPrinciplesTimeline({ pillars }: ValuesPrinciplesTimelineProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const isDesktop = useMediaQuery(DESKTOP_LAYOUT_QUERY);

	if (prefersReducedMotion || !isDesktop) {
		return <ValuesPrinciplesTimelineStatic pillars={pillars} />;
	}

	return <ValuesPrinciplesTimelineAnimated pillars={pillars} />;
}
