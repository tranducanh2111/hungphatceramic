"use client";

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
import { RevealOnView } from "./RevealOnView";

const S = T.color;

const DRAW_PATH_CLASS =
	"blueprint-draw-on-view [stroke-dasharray:1] [stroke-dashoffset:1] motion-reduce:[stroke-dashoffset:0]";

interface BlueprintLineProps {
	variant: BlueprintVariant;
	className?: string;
	/** Scales fade-in peak opacity for opacity-based variants. */
	opacity?: number;
}

function SurveySvg() {
	return (
		<>
			<path
				d={SURVEY_PATH}
				stroke={S}
				strokeWidth={T.strokeHairline}
				strokeOpacity={0.1}
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
				fill="none"
			/>
			<path
				d={SURVEY_PATH}
				stroke={S}
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacitySketch}
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
				fill="none"
				pathLength={1}
				className={DRAW_PATH_CLASS}
			/>
		</>
	);
}

function FoundationSvg() {
	return (
		<g
			stroke={S}
			fill="none"
			strokeLinecap="round"
			vectorEffect="non-scaling-stroke"
			className="opacity-90"
		>
			<path
				d="M 0 80 L 0 0 L 80 0"
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacityAnnotation}
			/>
			<path
				d="M 160 240 L 240 240 L 240 160"
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacityAnnotation}
			/>
			<path
				d="M 88 0 L 88 12 M 100 0 L 100 12"
				strokeWidth={T.strokeHairline}
				strokeOpacity={T.opacitySketch}
				strokeDasharray={T.dashDimension}
			/>
			<path
				d="M 240 152 L 228 152 M 240 140 L 228 140"
				strokeWidth={T.strokeHairline}
				strokeOpacity={T.opacitySketch}
				strokeDasharray={T.dashDimension}
			/>
		</g>
	);
}

function JointSvg() {
	return (
		<g stroke={S} fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke">
			<path
				d="M 0 40 L 222 40"
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacitySketch}
			/>
			<path
				d="M 278 40 L 500 40"
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacitySketch}
			/>
			<circle
				cx="250"
				cy="40"
				r="28"
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacityAnnotation}
			/>
			<path
				d="M 250 12 L 250 68 M 222 40 L 278 40"
				strokeWidth={T.strokeHairline}
				strokeOpacity={T.opacitySketch}
				strokeDasharray={T.dashSketch}
			/>
			<path
				d="M 80 34 L 80 46 M 150 34 L 150 46"
				strokeWidth={T.strokeHairline}
				strokeOpacity={T.opacitySketch}
			/>
			<path
				d="M 350 34 L 350 46 M 420 34 L 420 46"
				strokeWidth={T.strokeHairline}
				strokeOpacity={T.opacitySketch}
			/>
		</g>
	);
}

function KeystoneSvg() {
	return (
		<>
			<path
				d={KEYSTONE_PATH}
				stroke={S}
				strokeWidth={T.strokeHairline}
				strokeOpacity={0.1}
				strokeLinecap="round"
				fill="none"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d={KEYSTONE_PATH}
				stroke={S}
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacityAnnotation}
				strokeLinecap="round"
				fill="none"
				vectorEffect="non-scaling-stroke"
				pathLength={1}
				className={DRAW_PATH_CLASS}
			/>
		</>
	);
}

function GridSvg({ opacityMultiplier }: { opacityMultiplier: number }) {
	return (
		<g style={{ opacity: opacityMultiplier }}>
			<defs>
				<pattern
					id="blueprint-grid-pattern"
					x="0"
					y="0"
					width="40"
					height="40"
					patternUnits="userSpaceOnUse"
				>
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
		</g>
	);
}

function DatumSvg() {
	return (
		<>
			<path
				d={DATUM_PATH}
				stroke={S}
				strokeWidth={T.strokeHairline}
				strokeOpacity={0.08}
				strokeLinecap="round"
				fill="none"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d={DATUM_PATH}
				stroke={S}
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacityAnnotation}
				strokeLinecap="round"
				fill="none"
				vectorEffect="non-scaling-stroke"
				pathLength={1}
				className={DRAW_PATH_CLASS}
			/>
		</>
	);
}

function SignatureSvg() {
	return (
		<>
			<path
				d={SIGNATURE_PATH}
				stroke={S}
				strokeWidth={T.strokeHairline}
				strokeOpacity={0.08}
				strokeLinecap="round"
				fill="none"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d={SIGNATURE_PATH}
				stroke={S}
				strokeWidth={T.strokeRegular}
				strokeOpacity={T.opacityAnnotation}
				strokeLinecap="round"
				fill="none"
				vectorEffect="non-scaling-stroke"
				pathLength={1}
				className={DRAW_PATH_CLASS}
			/>
			<path
				d={SIGNATURE_PATH}
				stroke={S}
				strokeWidth={T.strokeEmphasis}
				strokeOpacity={0.55}
				strokeLinecap="round"
				fill="none"
				vectorEffect="non-scaling-stroke"
				pathLength={1}
				className={cn(DRAW_PATH_CLASS, "opacity-70")}
			/>
		</>
	);
}

/**
 * BlueprintLine — architectural pen-line motif with Tailwind view-timeline draw/fade.
 */
export function BlueprintLine({
	variant,
	className,
	opacity: opacityMultiplier = 1,
}: BlueprintLineProps) {
	const { viewBox } = BLUEPRINT_META[variant];
	const isDatum = variant === "datum";

	return (
		<RevealOnView className={cn("pointer-events-none", className)} aria-hidden={true}>
			<svg
				viewBox={viewBox}
				fill="none"
				preserveAspectRatio={
					variant === "grid" ? "xMidYMid slice" : isDatum ? "none" : "xMidYMid meet"
				}
				className="h-full w-full overflow-visible"
			>
				{variant === "survey" && <SurveySvg />}
				{variant === "foundation" && <FoundationSvg />}
				{variant === "joint" && <JointSvg />}
				{variant === "keystone" && <KeystoneSvg />}
				{variant === "grid" && <GridSvg opacityMultiplier={opacityMultiplier} />}
				{variant === "signature" && <SignatureSvg />}
				{variant === "datum" && <DatumSvg />}
			</svg>
		</RevealOnView>
	);
}
