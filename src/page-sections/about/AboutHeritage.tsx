"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { Text } from "@/components/ui";
import { BlueprintLine } from "@/components/common";
import { HERITAGE_MILESTONES } from "@/constants/about";
import { cn } from "@/lib/cn";

// ─── Connector path data (kaatdm-sourced organic curves) ──────────────────────

/** LTR: top-left → bottom-right (odd milestone above → even below). viewBox 769×320 */
const CONNECTOR_PATH_LTR =
	"M1 1C6.5 2.5 18 6.3 20 9.5C22.5 13.5 13 24 20 28.5C25.6 32.1 33.6667 31.6667 37 31C41.3333 32.6667 50 36.7 50 39.5C50 43 51 50 55.5 54C60 58 71 56 77 57C83 58 89.5 58.5 91 62C92.5 65.5 85.5 77.5 91 88.5C96.5 99.5 116 97.5 125 102C132.2 105.6 143 103.5 147.5 102C155.167 104.667 169.8 111 167 115C163.5 120 156 126 159 130.5C162 135 167 139 173.5 137C180 135 198.5 130.5 206 130.5C213.5 130.5 230.5 132.5 235.5 137C240.5 141.5 253.5 147.5 266 144.5C278.5 141.5 329.5 157 329 164C328.5 171 319.5 166.5 319 169.5C318.5 172.5 326.5 173 332 174.5C337.5 176 342 174.5 350 174.5C358 174.5 352.852 185 358 185C428.5 185 415.933 189.833 410.1 192C406.1 194.5 415.7 197.5 424.1 197.5C434.6 197.5 542.5 206 546 214.5C548.8 221.3 562.5 218.5 562.5 227.5L558.5 236C548.5 245 652.015 250 660.5 250C666 250 682 241.5 679 258C679.5 261 682.8 266.9 692 266.5C701.167 266.833 720.4 268.5 724 272.5C728.5 277.5 734 284 743 282.5C752 281 768.5 285.5 768.5 320";

/** RTL: top-right → bottom-left (even milestone above → odd below). viewBox 623×400 */
const CONNECTOR_PATH_RTL =
	"M622 1C619 7 611.1 19.2 603.5 20C595.9 20.8 588.667 29 586 33C582 33 573.1 33 569.5 33C565 33 566.5 22.5 554 33C541.5 43.5 518 44 505 42.5C492 41 489.5 47 493 50.5C496.5 54 516 50.5 510.5 55C505 59.5 500 67.5 493 66C486 64.5 434 57 429.5 66C425 75 389 103 379.5 95C370 87 355.593 95 350.547 95C339.569 95 345 101.5 345 109C345 110.446 405 129.5 364.5 138.5C336 129.5 329.776 174.752 313.5 180C303.5 187 292.136 173.744 273 180C251.266 187.105 224.398 180.013 204 187C190.731 191.545 198.084 198.791 186.5 203C174.967 207.191 156.489 199.365 147.5 203C126.28 211.582 128.368 222.602 129.5 226C110 248 72.223 257.5 69.954 257.5C60.954 257.5 19.954 267.5 24.454 278.5C28.954 289.5 81.5004 299.5 81.5004 310.5C81.5004 321.5 78.954 327.5 69.954 326C62.7539 324.8 42.2872 325.5 32.9539 326C25.7872 322.333 27.0472 321.5 14.0005 326C5.96367 328.772 -3.04608 329.5 2.45392 333C6.85392 335.8 18.954 338.167 24.454 339C30.1207 339.333 42.4541 340.7 46.4541 343.5C51.4541 347 78.9539 361.5 69.954 365.5C60.9541 369.5 46.4541 379 46.4541 383C46.4541 386.2 46.4541 395.333 46.4541 399.5";

interface MilestoneConnectorProps {
	connectorIndex: number;
}

/**
 * Organic SVG connector between two milestones — restyled as an architectural
 * elevation drawing: a dashed dimension line with blueprint-style tick caps at
 * both endpoints. The tick caps (perpendicular lines) mimic the annotation
 * marks on an architectural elevation drawing.
 *
 * Scroll-linked reveal:
 *   - The main path draws from `pathLength` 0→1 as the connector scrolls.
 *   - Tick caps fade in during the last 20% of the reveal range, so they
 *     "land" after the path has nearly completed — matching how a drafter
 *     adds the endpoint marks last.
 */
function MilestoneConnector({ connectorIndex }: MilestoneConnectorProps) {
	const connectorRef = useRef<HTMLDivElement>(null);
	const isRtl = connectorIndex % 2 === 0;
	const pathData = isRtl ? CONNECTOR_PATH_RTL : CONNECTOR_PATH_LTR;
	const viewBox = isRtl ? "0 0 623 400" : "0 0 769 320";
	const maskId = `hc-mask-${connectorIndex}`;

	const { scrollYProgress } = useScroll({
		target: connectorRef,
		offset: ["start end", "end start"],
	});

	// Main path draws from 0→1
	const drawProgress = scrollYProgress;
	// Tick caps appear in the last 20% of the reveal
	const tickOpacity = useTransform(scrollYProgress, [0.78, 1.0], [0, 1]);

	return (
		<div
			ref={connectorRef}
			className="relative col-span-2 hidden py-6 lg:block lg:py-10"
			aria-hidden="true"
		>
			{/* 50% band offset to 25% — centres path endpoints over text columns */}
			<div className="relative ml-[25%] h-40 w-1/2 lg:h-48">
				<svg
					viewBox={viewBox}
					preserveAspectRatio="xMidYMid meet"
					className="h-full w-full overflow-visible"
					fill="none"
				>
					<defs>
						{/* Mask controls where the champagne stroke is visible */}
						<mask id={maskId}>
							<motion.path
								d={pathData}
								fill="none"
								stroke="white"
								strokeWidth="8"
								strokeLinecap="round"
								strokeLinejoin="round"
								vectorEffect="non-scaling-stroke"
								pathLength={1}
								style={{ pathLength: drawProgress }}
							/>
						</mask>
					</defs>

					{/* Static ghost track — sapphire-mist, dimension-line dash */}
					<path
						d={pathData}
						stroke="#1A3D5C"
						strokeWidth="0.8"
						strokeDasharray="5 10"
						strokeLinecap="round"
						strokeOpacity={0.6}
						vectorEffect="non-scaling-stroke"
					/>

					{/* Champagne reveal — blueprint dimension-line style */}
					<g mask={`url(#${maskId})`}>
						<path
							d={pathData}
							stroke="#D4B886"
							strokeWidth="1"
							strokeOpacity={0.55}
							strokeDasharray="5 10"
							strokeLinecap="round"
							vectorEffect="non-scaling-stroke"
						/>
					</g>

					{/*
					 * Dimension tick caps — two short perpendicular lines at each endpoint.
					 * LTR: start near (1,1), end near (768,320).
					 * RTL: start near (622,1), end near (46,399).
					 * These are approximated; exact positions depend on viewBox.
					 */}
					{!isRtl && (
						<motion.g
							stroke="#D4B886"
							strokeWidth="1"
							strokeLinecap="round"
							strokeOpacity={0.7}
							vectorEffect="non-scaling-stroke"
							style={{ opacity: tickOpacity }}
						>
							{/* Start tick (top-left area of LTR path) */}
							<line x1="-6" y1="1" x2="8" y2="1" />
							{/* End tick (bottom-right area of LTR path) */}
							<line x1="762" y1="320" x2="776" y2="320" />
						</motion.g>
					)}
					{isRtl && (
						<motion.g
							stroke="#D4B886"
							strokeWidth="1"
							strokeLinecap="round"
							strokeOpacity={0.7}
							vectorEffect="non-scaling-stroke"
							style={{ opacity: tickOpacity }}
						>
							{/* Start tick (top-right of RTL path) */}
							<line x1="616" y1="1" x2="630" y2="1" />
							{/* End tick (bottom-left of RTL path) */}
							<line x1="40" y1="399" x2="54" y2="399" />
						</motion.g>
					)}
				</svg>
			</div>
		</div>
	);
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function AboutHeritage() {
	const t = useTranslations("pages.about.heritage");
	const milestoneCount = HERITAGE_MILESTONES.length;

	return (
		<section className="bg-sapphire-deep relative py-28 lg:py-36" aria-label={t("ariaLabel")}>
			{/* Blend from Origin (sapphire-ocean) */}
			<div
				className="from-sapphire-ocean pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent sm:h-32"
				aria-hidden="true"
			/>

			<div className="relative mx-auto max-w-6xl px-6 lg:px-12">
				<div className="mb-24 lg:mb-32">
					<motion.span
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.7 }}
						className="text-label font-sans tracking-widest text-[#D4B886] uppercase"
					>
						{t("label")}
					</motion.span>
					<motion.div
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.7, delay: 0.1 }}
					>
						<Text variant="h2" as="h2" className="mt-2 text-[#F4F4F6]">
							{t("heading")}
						</Text>
					</motion.div>
				</div>

				<div className="flex flex-col">
					{HERITAGE_MILESTONES.map((milestone, index) => {
						const isEven = index % 2 === 0;
						const isLast = index === milestoneCount - 1;

						return (
							<div key={milestone.id} className="lg:grid lg:grid-cols-2 lg:gap-x-20">
								<motion.article
									initial={{ opacity: 0.08, filter: "blur(12px)" }}
									whileInView={{ opacity: 1, filter: "blur(0px)" }}
									viewport={{ once: true, amount: 0.22 }}
									transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
									className="relative z-10 col-span-2 grid items-center gap-x-20 gap-y-10 lg:grid-cols-2"
								>
									<div
										className={cn(
											"relative h-[280px] overflow-hidden rounded-2xl sm:h-[340px] lg:h-[400px]",
											!isEven && "lg:order-2",
										)}
									>
										<Image
											src={milestone.imageUrl}
											alt={t(`milestones.${milestone.id}.imageAlt`)}
											fill
											className="object-cover object-center"
											sizes="(max-width: 1024px) 100vw, 50vw"
										/>
										<div className="absolute inset-0 rounded-2xl ring-1 ring-[#D4B886]/8" />
									</div>

									<div
										className={cn(
											"flex flex-col",
											isEven ? "lg:order-2" : "lg:order-1",
										)}
									>
										<p className="text-h2 font-sans leading-tight font-light tracking-wide text-[#D4B886]/55">
											{milestone.coordinates}
										</p>
										<p className="text-body-sm mt-2 font-sans text-[#F4F4F6]/40">
											{milestone.location}
										</p>
										<p className="text-label mt-1 font-sans tracking-widest text-[#D4B886]/30 uppercase">
											{milestone.year}
										</p>

										<div className="my-7 h-px w-10 bg-[#D4B886]/25" />

										<Text variant="h4" as="h3" className="text-[#F4F4F6]">
											{t(`milestones.${milestone.id}.title`)}
										</Text>
										<Text
											variant="body"
											className="mt-3 max-w-sm leading-relaxed text-[#F4F4F6]/55"
										>
											{t(`milestones.${milestone.id}.description`)}
										</Text>
									</div>
								</motion.article>

								{!isLast && <MilestoneConnector connectorIndex={index} />}
							</div>
						);
					})}
				</div>
			</div>

			{/* Datum — phase boundary: Heritage complete, Craft begins */}
			<BlueprintLine
				variant="datum"
				className="mt-20 h-5 w-full lg:mt-28"
				scrollRange={[0.6, 0.95]}
			/>
		</section>
	);
}
