"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { Text } from "@/components/ui";
import { ParallaxLayer } from "@/components/common";
import { useAppScroll } from "@/hooks/useAppScroll";
import { CRAFT_BEATS } from "@/constants/about";
import { BLUEPRINT_TOKENS as T } from "@/constants/blueprint";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const BEAT_COUNT = CRAFT_BEATS.length;
const NUMERALS = ["01", "02", "03"] as const;

interface SketchProps {
	captionOpacity: MotionValue<number>;
}

function KilnSketch({ captionOpacity }: SketchProps) {
	const sketchOpacity = useTransform(captionOpacity, [0, 0.45, 1], [0.06, 0.06, 1]);
	return (
		<motion.div className="w-full" style={{ opacity: sketchOpacity }} aria-hidden="true">
			<svg viewBox="0 0 200 120" fill="none" className="w-full">
				<rect
					x="30"
					y="15"
					width="140"
					height="80"
					stroke={T.color}
					strokeWidth={T.strokeRegular}
					strokeOpacity={T.opacityAnnotation}
					strokeDasharray={T.dashSketch}
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M 30 15 Q 100 0 170 15"
					stroke={T.color}
					strokeWidth={T.strokeRegular}
					strokeOpacity={T.opacityAnnotation}
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M 80 75 L 80 45 M 74 52 L 80 45 L 86 52"
					stroke={T.color}
					strokeWidth={T.strokeHairline}
					strokeOpacity={T.opacitySketch}
					strokeLinecap="round"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M 100 80 L 100 45 M 94 52 L 100 45 L 106 52"
					stroke={T.color}
					strokeWidth={T.strokeHairline}
					strokeOpacity={T.opacitySketch}
					strokeLinecap="round"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M 120 75 L 120 45 M 114 52 L 120 45 L 126 52"
					stroke={T.color}
					strokeWidth={T.strokeHairline}
					strokeOpacity={T.opacitySketch}
					strokeLinecap="round"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M 30 105 L 170 105 M 30 101 L 30 109 M 170 101 L 170 109"
					stroke={T.color}
					strokeWidth={T.strokeHairline}
					strokeOpacity={T.opacitySketch}
					vectorEffect="non-scaling-stroke"
				/>
				<text
					x="100"
					y="115"
					textAnchor="middle"
					fontSize="8"
					fontFamily="serif"
					fill={T.color}
					fillOpacity={T.opacitySketch}
				>
					1200°C
				</text>
			</svg>
		</motion.div>
	);
}

function TileSketch({ captionOpacity }: SketchProps) {
	const sketchOpacity = useTransform(captionOpacity, [0, 0.45, 1], [0.06, 0.06, 1]);
	return (
		<motion.div className="w-full" style={{ opacity: sketchOpacity }} aria-hidden="true">
			<svg viewBox="0 0 200 120" fill="none" className="w-full">
				<rect
					x="20"
					y="30"
					width="160"
					height="50"
					stroke={T.color}
					strokeWidth={T.strokeRegular}
					strokeOpacity={T.opacityAnnotation}
					vectorEffect="non-scaling-stroke"
				/>
				<rect
					x="20"
					y="22"
					width="160"
					height="10"
					stroke={T.color}
					strokeWidth={T.strokeHairline}
					strokeOpacity={T.opacityAnnotation}
					strokeDasharray={T.dashSketch}
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M 40 22 L 40 80 M 80 22 L 80 80 M 120 22 L 120 80 M 160 22 L 160 80"
					stroke={T.color}
					strokeWidth={T.strokeHairline}
					strokeOpacity="0.12"
					strokeDasharray={T.dashSketch}
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M 185 27 L 195 27 M 185 57 L 195 57 M 185 80 L 195 80"
					stroke={T.color}
					strokeWidth={T.strokeHairline}
					strokeOpacity={T.opacitySketch}
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M 10 22 L 10 80 M 5 28 L 10 22 L 15 28 M 5 74 L 10 80 L 15 74"
					stroke={T.color}
					strokeWidth={T.strokeHairline}
					strokeOpacity={T.opacitySketch}
					strokeLinecap="round"
					vectorEffect="non-scaling-stroke"
				/>
			</svg>
		</motion.div>
	);
}

function InstallSketch({ captionOpacity }: SketchProps) {
	const sketchOpacity = useTransform(captionOpacity, [0, 0.45, 1], [0.06, 0.06, 1]);
	return (
		<motion.div className="w-full" style={{ opacity: sketchOpacity }} aria-hidden="true">
			<svg viewBox="0 0 200 120" fill="none" className="w-full">
				<rect
					x="10"
					y="20"
					width="80"
					height="40"
					stroke={T.color}
					strokeWidth={T.strokeRegular}
					strokeOpacity={T.opacityAnnotation}
					vectorEffect="non-scaling-stroke"
				/>
				<rect
					x="110"
					y="20"
					width="80"
					height="40"
					stroke={T.color}
					strokeWidth={T.strokeRegular}
					strokeOpacity={T.opacityAnnotation}
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M 90 20 L 90 60 M 110 20 L 110 60"
					stroke={T.color}
					strokeWidth={T.strokeHairline}
					strokeOpacity={T.opacityAnnotation}
					strokeDasharray={T.dashDimension}
					vectorEffect="non-scaling-stroke"
				/>
				<rect
					x="10"
					y="60"
					width="180"
					height="16"
					stroke={T.color}
					strokeWidth={T.strokeHairline}
					strokeOpacity={T.opacitySketch}
					strokeDasharray={T.dashSketch}
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M 10 76 L 190 76"
					stroke={T.color}
					strokeWidth={T.strokeRegular}
					strokeOpacity={T.opacityAnnotation}
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M 20 76 L 10 86 M 40 76 L 20 96 M 60 76 L 40 96 M 80 76 L 60 96 M 100 76 L 80 96 M 120 76 L 100 96 M 140 76 L 120 96 M 160 76 L 140 96 M 180 76 L 160 96 M 190 80 L 180 90"
					stroke={T.color}
					strokeWidth={T.strokeHairline}
					strokeOpacity="0.15"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d="M 90 10 L 110 10 M 90 6 L 90 14 M 110 6 L 110 14"
					stroke={T.color}
					strokeWidth={T.strokeHairline}
					strokeOpacity={T.opacitySketch}
					vectorEffect="non-scaling-stroke"
				/>
				<text
					x="100"
					y="8"
					textAnchor="middle"
					fontSize="7"
					fontFamily="serif"
					fill={T.color}
					fillOpacity={T.opacitySketch}
				>
					3mm
				</text>
			</svg>
		</motion.div>
	);
}

const BEAT_SKETCHES = [KilnSketch, TileSketch, InstallSketch] as const;

function CraftBeatPanel({
	beatIndex,
	captionOpacity,
}: {
	beatIndex: number;
	captionOpacity: MotionValue<number>;
}) {
	const t = useTranslations("pages.about.craft");
	const beat = CRAFT_BEATS[beatIndex];
	const Sketch = BEAT_SKETCHES[beatIndex];

	return (
		<motion.div
			style={{ opacity: captionOpacity }}
			className="absolute inset-0 flex flex-col justify-center py-2 lg:py-0"
		>
			<span
				className="block font-serif text-[32px] leading-none font-light text-transparent sm:text-[38px] lg:text-[48px]"
				style={{ WebkitTextStroke: "1px rgba(212,184,134,0.25)" }}
				aria-hidden="true"
			>
				{NUMERALS[beatIndex]}
			</span>

			<span className="text-label text-champagne/65 -mt-1 block font-sans tracking-widest uppercase">
				{t(`beats.${beat.id}.label`)}
			</span>

			<Text
				variant="h2"
				as="h2"
				className="sm:text-display-lg text-linen mt-3 font-serif text-[28px] leading-tight font-light italic sm:mt-4 lg:mt-5"
			>
				{t(`beats.${beat.id}.title`)}
			</Text>

			<Text
				variant="body"
				className="sm:text-body-lg text-linen/60 mt-3 max-w-none leading-relaxed sm:mt-4 sm:max-w-sm"
			>
				{t(`beats.${beat.id}.body`)}
			</Text>

			<div className="mt-5 w-full max-w-[200px] sm:mt-6 sm:max-w-[240px]">
				<Sketch captionOpacity={captionOpacity} />
			</div>
		</motion.div>
	);
}

function CraftScrollStory() {
	const t = useTranslations("pages.about.craft");
	const sectionRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useAppScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});

	const imageOpacities = [
		useTransform(scrollYProgress, [0, 0.28, 0.38, 0.5], [1, 1, 0, 0]),
		useTransform(scrollYProgress, [0.28, 0.38, 0.62, 0.72], [0, 1, 1, 0]),
		useTransform(scrollYProgress, [0.62, 0.72, 1.0, 1.0], [0, 1, 1, 1]),
	] as const;

	const captionOpacities = [
		useTransform(scrollYProgress, [0, 0.08, 0.28, 0.36], [0, 1, 1, 0]),
		useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.68], [0, 1, 1, 0]),
		useTransform(scrollYProgress, [0.62, 0.72, 0.92, 1.0], [0, 1, 1, 0]),
	] as const;

	const segmentProgress = [
		useTransform(scrollYProgress, [0, 0.33], [0, 1]),
		useTransform(scrollYProgress, [0.33, 0.66], [0, 1]),
		useTransform(scrollYProgress, [0.66, 1.0], [0, 1]),
	] as const;

	return (
		<section ref={sectionRef} className="bg-sapphire-deep relative" aria-label={t("ariaLabel")}>
			<div className="sticky top-0 flex h-[100dvh] min-h-[600px] flex-col overflow-hidden lg:h-screen lg:flex-row">
				<div className="relative h-[38vh] min-h-[220px] shrink-0 overflow-hidden sm:h-[42vh] lg:h-full lg:min-h-0 lg:w-1/2">
					{CRAFT_BEATS.map((beat, index) => (
						<motion.div
							key={beat.id}
							className="absolute inset-0 scale-[1.05]"
							style={{ opacity: imageOpacities[index] }}
						>
							<Image
								src={beat.imageUrl}
								alt={t(`beats.${beat.id}.imageAlt`)}
								fill
								className="object-cover object-center"
								sizes="(max-width: 1024px) 100vw, 50vw"
								priority={index === 0}
							/>
						</motion.div>
					))}
					<div
						className="to-sapphire-deep pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent lg:inset-y-0 lg:right-0 lg:left-auto lg:h-full lg:w-16 lg:bg-gradient-to-r lg:from-transparent"
						aria-hidden="true"
					/>
				</div>

					<div className="bg-sapphire-deep relative flex min-h-0 flex-1 flex-col px-6 py-6 sm:px-8 sm:py-8 lg:h-full lg:w-1/2 lg:px-14 lg:py-20">
						{CRAFT_BEATS.map((beat, index) => (
							<motion.div
								key={`chapter-${beat.id}`}
								style={{ opacity: captionOpacities[index] }}
								className="pointer-events-none absolute top-5 right-6 text-right sm:top-6 sm:right-8 lg:top-14 lg:right-12"
								aria-hidden="true"
							>
								<span className="text-footnote text-champagne/55 font-sans tracking-widest uppercase">
									{NUMERALS[index]} / {String(BEAT_COUNT).padStart(2, "0")}
								</span>
							</motion.div>
						))}

						<div className="relative flex min-h-0 flex-1 flex-col justify-center overflow-y-clip">
							{CRAFT_BEATS.map((beat, index) => (
								<CraftBeatPanel
									key={beat.id}
									beatIndex={index}
									captionOpacity={captionOpacities[index]}
								/>
							))}
						</div>

						<div className="flex items-center gap-3 pb-2" aria-hidden="true">
							{CRAFT_BEATS.map((beat, index) => (
								<div
									key={`seg-${beat.id}`}
									className="bg-champagne/15 relative h-px flex-1"
								>
									<motion.div
										className="bg-champagne absolute inset-y-0 left-0"
										style={{
											scaleX: segmentProgress[index],
											transformOrigin: "left",
										}}
									/>
								</div>
							))}
						</div>
					</div>
			</div>

			<div className="h-[300vh]" aria-hidden="true" />
		</section>
	);
}

function CraftReducedMotion() {
	const t = useTranslations("pages.about.craft");
	const beat = CRAFT_BEATS[0];

	return (
		<section className="bg-sapphire-deep relative" aria-label={t("ariaLabel")}>
			<div className="flex min-h-[100dvh] flex-col lg:flex-row">
				<div className="relative h-[42vh] min-h-[220px] shrink-0 overflow-hidden lg:h-auto lg:min-h-[600px] lg:w-1/2">
					<ParallaxLayer rangePx={40} className="absolute inset-0">
						<Image
							src={beat.imageUrl}
							alt={t(`beats.${beat.id}.imageAlt`)}
							fill
							className="object-cover object-center"
							sizes="(max-width: 1024px) 100vw, 50vw"
							priority
						/>
					</ParallaxLayer>
				</div>
				<div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-8 lg:px-14">
					<span className="text-label text-champagne/65 font-sans tracking-widest uppercase">
						{t(`beats.${beat.id}.label`)}
					</span>
					<Text
						variant="h2"
						as="h2"
						className="text-linen mt-3 font-serif text-3xl font-light italic"
					>
						{t(`beats.${beat.id}.title`)}
					</Text>
					<Text variant="body" className="text-linen/60 mt-4 leading-relaxed">
						{t(`beats.${beat.id}.body`)}
					</Text>
				</div>
			</div>
		</section>
	);
}

export function AboutCraft() {
	const prefersReducedMotion = usePrefersReducedMotion();

	if (prefersReducedMotion) {
		return <CraftReducedMotion />;
	}

	return <CraftScrollStory />;
}
