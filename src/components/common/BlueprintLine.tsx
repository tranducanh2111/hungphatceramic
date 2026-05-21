"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";
import {
	type BlueprintVariant,
	BLUEPRINT_META,
	BLUEPRINT_TOKENS as T,
	SURVEY_PATH,
	KEYSTONE_PATH,
	SIGNATURE_PATH,
	DATUM_PATH,
} from "@/constants/blueprint";

// ─── Types ─────────────────────────────────────────────────────────────────────

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

interface BlueprintLineProps {
	variant: BlueprintVariant;
	className?: string;
	/** Scale the base opacity of all strokes. Default 1. */
	opacity?: number;
	/** Scroll trigger window as [enter, exit] fractions (default: [0.05, 0.7]). */
	scrollRange?: [number, number];
	/** Framer scroll offset — override for footer/short sections. */
	scrollOffset?: ScrollOffset;
}

// ─── Per-variant SVG content renderers ────────────────────────────────────────

const S = T.color; // stroke colour shorthand

/**
 * survey — Long horizontal line with five triangular tick bumps.
 * Animation: pathLength (draws left to right).
 */
function SurveySvg({ draw }: { draw: MotionValue<number> }) {
	return (
		<>
			{/* Ghost track */}
			<path
				d={SURVEY_PATH}
				stroke={S}
				strokeWidth={T.strokeHairline}
				strokeOpacity={0.1}
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
				fill="none"
			/>
			{/* Scroll-revealed stroke */}
			<motion.path
				d={SURVEY_PATH}
				stroke={S}
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacitySketch}
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
				fill="none"
				style={{ pathLength: draw }}
			/>
		</>
	);
}

/**
 * foundation — Two L-shaped corner brackets with small dimension annotations.
 * Animation: opacity (whole group fades in).
 */
function FoundationSvg({ opacity }: { opacity: MotionValue<number> }) {
	return (
		<motion.g
			stroke={S}
			fill="none"
			strokeLinecap="round"
			vectorEffect="non-scaling-stroke"
			style={{ opacity }}
		>
			{/* Top-left bracket */}
			<path
				d="M 0 80 L 0 0 L 80 0"
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacityAnnotation}
			/>
			{/* Bottom-right bracket */}
			<path
				d="M 160 240 L 240 240 L 240 160"
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacityAnnotation}
			/>
			{/* Dimension extension ticks on top-left */}
			<path
				d="M 88 0 L 88 12 M 100 0 L 100 12"
				strokeWidth={T.strokeHairline}
				strokeOpacity={T.opacitySketch}
				strokeDasharray={T.dashDimension}
			/>
			{/* Dimension extension ticks on bottom-right */}
			<path
				d="M 240 152 L 228 152 M 240 140 L 228 140"
				strokeWidth={T.strokeHairline}
				strokeOpacity={T.opacitySketch}
				strokeDasharray={T.dashDimension}
			/>
		</motion.g>
	);
}

/**
 * joint — Structural rivet (circle) with horizontal rails and tick marks.
 * Animation: opacity (whole group fades in).
 */
function JointSvg({ opacity }: { opacity: MotionValue<number> }) {
	return (
		<motion.g
			stroke={S}
			fill="none"
			strokeLinecap="round"
			vectorEffect="non-scaling-stroke"
			style={{ opacity }}
		>
			{/* Left rail */}
			<path
				d="M 0 40 L 222 40"
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacitySketch}
			/>
			{/* Right rail */}
			<path
				d="M 278 40 L 500 40"
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacitySketch}
			/>
			{/* Rivet circle */}
			<circle
				cx="250"
				cy="40"
				r="28"
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacityAnnotation}
			/>
			{/* Crosshair inside rivet */}
			<path
				d="M 250 12 L 250 68 M 222 40 L 278 40"
				strokeWidth={T.strokeHairline}
				strokeOpacity={T.opacitySketch}
				strokeDasharray={T.dashSketch}
			/>
			{/* Dimension ticks on left rail */}
			<path
				d="M 80 34 L 80 46 M 150 34 L 150 46"
				strokeWidth={T.strokeHairline}
				strokeOpacity={T.opacitySketch}
			/>
			{/* Dimension ticks on right rail */}
			<path
				d="M 350 34 L 350 46 M 420 34 L 420 46"
				strokeWidth={T.strokeHairline}
				strokeOpacity={T.opacitySketch}
			/>
		</motion.g>
	);
}

/**
 * keystone — Shallow arc with a center-peak marker tick.
 * Animation: pathLength (draws as a single continuous stroke).
 */
function KeystoneSvg({ draw }: { draw: MotionValue<number> }) {
	return (
		<>
			{/* Ghost arc track */}
			<path
				d={KEYSTONE_PATH}
				stroke={S}
				strokeWidth={T.strokeHairline}
				strokeOpacity={0.1}
				strokeLinecap="round"
				fill="none"
				vectorEffect="non-scaling-stroke"
			/>
			{/* Scroll-revealed arc */}
			<motion.path
				d={KEYSTONE_PATH}
				stroke={S}
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacityAnnotation}
				strokeLinecap="round"
				fill="none"
				vectorEffect="non-scaling-stroke"
				style={{ pathLength: draw }}
			/>
		</>
	);
}

/**
 * grid — Orthogonal grid-paper pattern using SVG <pattern>.
 * Animation: opacity (whole pattern fades in as a background texture).
 */
function GridSvg({ opacity }: { opacity: MotionValue<number> }) {
	return (
		<motion.g style={{ opacity }}>
			<defs>
				<pattern id="blueprint-grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
					<path
						d="M 40 0 L 0 0 0 40"
						fill="none"
						stroke={S}
						strokeWidth={T.strokeHairline}
						strokeOpacity={T.opacitySketch}
						vectorEffect="non-scaling-stroke"
					/>
				</pattern>
			</defs>
			<rect width="400" height="300" fill="url(#blueprint-grid-pattern)" />
		</motion.g>
	);
}

/**
 * datum — Full-width section-cut line: diamond ends + 3 station ticks.
 * Use `preserveAspectRatio="none"` on the parent SVG for full-width stretch.
 * Animation: pathLength (draws the cut line from left to right).
 */
function DatumSvg({ draw }: { draw: MotionValue<number> }) {
	return (
		<>
			{/* Ghost track — always visible at near-zero opacity */}
			<path
				d={DATUM_PATH}
				stroke={S}
				strokeWidth={T.strokeHairline}
				strokeOpacity={0.08}
				strokeLinecap="round"
				fill="none"
				vectorEffect="non-scaling-stroke"
			/>
			{/* Scroll-revealed datum stroke */}
			<motion.path
				d={DATUM_PATH}
				stroke={S}
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacityAnnotation}
				strokeLinecap="round"
				fill="none"
				vectorEffect="non-scaling-stroke"
				style={{ pathLength: draw }}
			/>
		</>
	);
}

/**
 * signature — Flowing S-curve ending in an architect's approval cross-mark.
 * Animation: pathLength (draws as a single continuous stroke from left to right).
 */
function SignatureSvg({ draw }: { draw: MotionValue<number> }) {
	const glowOpacity = useTransform(draw, [0.55, 1], [0, 0.85]);

	return (
		<>
			<defs>
				<filter id="blueprint-signature-glow" x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur stdDeviation="2.5" result="blur" />
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>
			{/* Ghost track */}
			<path
				d={SIGNATURE_PATH}
				stroke={S}
				strokeWidth={T.strokeHairline}
				strokeOpacity={0.08}
				strokeLinecap="round"
				fill="none"
				vectorEffect="non-scaling-stroke"
			/>
			{/* Scroll-revealed stroke */}
			<motion.path
				d={SIGNATURE_PATH}
				stroke={S}
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacityAnnotation}
				strokeLinecap="round"
				fill="none"
				vectorEffect="non-scaling-stroke"
				style={{ pathLength: draw }}
			/>
			{/* Champagne glow layer — peaks when draw completes */}
			<motion.path
				d={SIGNATURE_PATH}
				stroke={S}
				strokeWidth={T.strokeEmphasis}
				strokeLinecap="round"
				fill="none"
				vectorEffect="non-scaling-stroke"
				filter="url(#blueprint-signature-glow)"
				style={{ pathLength: draw, strokeOpacity: glowOpacity }}
			/>
		</>
	);
}

// ─── Main component ────────────────────────────────────────────────────────────

/**
 * BlueprintLine — Shared architectural pen-line motif.
 *
 * Each variant is a scroll-linked SVG fragment that progressively reveals on
 * scroll entry, building the "Blueprint to Built" narrative across the page.
 *
 * - pathLength variants (survey, keystone, signature): stroke draws itself.
 * - opacity variants (foundation, joint, grid): element fades in as a group.
 *
 * @example
 * <BlueprintLine variant="survey" className="absolute bottom-12 inset-x-0" />
 */
export function BlueprintLine({
	variant,
	className,
	opacity: opacityMultiplier = 1,
	scrollRange = [0.05, 0.7],
	scrollOffset = ["start end", "end start"],
}: BlueprintLineProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const { viewBox, animation } = BLUEPRINT_META[variant];

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: scrollOffset,
	});

	// pathLength: 0 → 1 as section scrolls into view
	const drawProgress = useTransform(scrollYProgress, scrollRange, [0, 1]);
	// opacity: 0 → opacityMultiplier for fade-in variants
	const fadeProgress = useTransform(
		scrollYProgress,
		scrollRange,
		[0, opacityMultiplier],
	);

	const isPathLength = animation === "pathLength";

	const isDatum = variant === "datum";

	return (
		<div ref={containerRef} className={cn("pointer-events-none", className)} aria-hidden="true">
			<svg
				viewBox={viewBox}
				fill="none"
				preserveAspectRatio={
					variant === "grid" ? "xMidYMid slice"
					: isDatum ? "none"
					: "xMidYMid meet"
				}
				className="h-full w-full overflow-visible"
			>
				{variant === "survey" && <SurveySvg draw={drawProgress} />}
				{variant === "foundation" && <FoundationSvg opacity={isPathLength ? drawProgress : fadeProgress} />}
				{variant === "joint" && <JointSvg opacity={fadeProgress} />}
				{variant === "keystone" && <KeystoneSvg draw={drawProgress} />}
				{variant === "grid" && <GridSvg opacity={fadeProgress} />}
				{variant === "signature" && <SignatureSvg draw={drawProgress} />}
				{variant === "datum" && <DatumSvg draw={drawProgress} />}
			</svg>
		</div>
	);
}
