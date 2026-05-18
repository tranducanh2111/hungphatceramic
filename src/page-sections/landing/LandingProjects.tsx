"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
	motion,
	useScroll,
	useTransform,
	useSpring,
	useReducedMotion,
	useMotionValueEvent,
	type MotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Text, Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { FEATURED_PROJECTS, type FeaturedProject } from "@/constants/landing";
import { ROUTES, projectDetailPath } from "@/constants/routes";
import { Link } from "@/i18n/navigation";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Scroll budget per card in viewport-heights. Tune to control section length. */
const SCROLL_VH_PER_CARD = 90;

/** Spring config: absorbs wheel jitter without lagging. */
const SPRING_CONFIG = { stiffness: 80, damping: 22, mass: 0.6 } as const;

/**
 * 3D spiral face shell — avoids outer box-shadow / hairline borders that
 * produce bright fringes when rotateY is applied (common GPU compositor artefact).
 */
const SPIRAL_CARD_FACE_CLIP_CLASS =
	"absolute inset-0 overflow-hidden rounded-[1.75rem] bg-[#0E2A42] [transform:translateZ(0.1px)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [box-shadow:inset_0_0_0_1px_rgba(212,184,134,0.14)]";

const SPIRAL_CARD_ARTICLE_CLASS = "relative h-full w-full bg-[#0E2A42]";

type SpiralCardSize = "lg" | "md";

/** Compact overlay typography — spiral cards are smaller than the mobile grid. */
const SPIRAL_CARD_UI = {
	lg: {
		imageSizes: "(min-width: 1024px) 360px, 85vw",
		imageFade: "h-[26%]",
		overlay: "top-3 right-3 left-3 gap-2",
		titleBox: "rounded-lg px-2.5 py-1.5",
		titleVariant: "h6",
		year: "px-2 py-0.5 text-[10px] tracking-[0.12em]",
		bottom: "bottom-3 right-3 left-3",
		panel: "rounded-xl p-3",
		metaVariant: "footnote",
		stackGap: "mt-2",
		link: "text-[11px] gap-1.5",
		linkIcon: "h-3 w-3",
	},
	md: {
		imageSizes: "(min-width: 768px) 300px, 85vw",
		imageFade: "h-[20%]",
		overlay: "top-2 right-2 left-2 gap-1.5",
		titleBox: "rounded-md px-2 py-1",
		titleVariant: "body-sm",
		year: "px-1.5 py-0.5 text-[9px] tracking-[0.1em]",
		bottom: "bottom-2 right-2 left-2",
		panel: "rounded-lg p-2",
		metaVariant: "caption",
		stackGap: "mt-1.5",
		link: "text-[10px] gap-1",
		linkIcon: "h-2.5 w-2.5",
	},
} as const;

const SPIRAL_CARD_BACK_UI = {
	lg: {
		body: "gap-2.5 px-4",
		brand: "text-[11px] tracking-[0.28em]",
		divider: "w-12",
		titleVariant: "h6",
		year: "text-[11px]",
	},
	md: {
		body: "gap-2 px-3",
		brand: "text-[10px] tracking-[0.24em]",
		divider: "w-10",
		titleVariant: "body-sm",
		year: "text-[10px]",
	},
} as const;

function resolveSpiralCardSize(cardWidth: number): SpiralCardSize {
	return cardWidth >= 330 ? "lg" : "md";
}

// ─── SpiralGeometry ───────────────────────────────────────────────────────────

/**
 * Defines the shape of the 3D spiral.
 *
 * Cards are arranged in a corkscrew around the chandelier pole:
 * each card steps +angularStep° and +verticalPitch px relative to the previous.
 * The resulting shape is static — scroll only spins the whole structure (rotateY).
 */
interface SpiralGeometry {
	/** Orbit radius: distance from pole to each card centre (px). */
	radius: number;
	/** Vertical rise per card step (px). Controls spiral tightness. */
	verticalPitch: number;
	/** Angular step between adjacent cards (degrees). */
	angularStep: number;
	/** Card width (px). */
	cardWidth: number;
	/** Card height (px) — image + meta panel. Used for vertical centering. */
	cardHeight: number;
}

interface SpiralSlot {
	x: number;
	y: number;
	z: number;
	/** Card's own rotateY so its face points outward from the pole. */
	rotateY: number;
}

const SPIRAL_PRESETS = {
	/**
	 * ≥ 1024px — loose, cinematic spiral.
	 * 6 cards × 60° = one full rotation; 6 × 200px = 1000px vertical spread.
	 */
	lg: {
		radius: 440,
		verticalPitch: 200,
		angularStep: 60,
		cardWidth: 360,
		cardHeight: 270,
	},
	/**
	 * 768–1023px — tighter spiral for narrower viewports.
	 */
	md: {
		radius: 280,
		verticalPitch: 160,
		angularStep: 60,
		cardWidth: 300,
		cardHeight: 225,
	},
} as const satisfies Record<string, SpiralGeometry>;

// ─── computeSpiralSlot ────────────────────────────────────────────────────────

/**
 * Computes the static 3D slot for card[index] on the spiral.
 *
 * The spiral is centred vertically: card 0 is at the top, card N-1 at the
 * bottom, and the midpoint card sits at y=0 (viewport centre). This keeps the
 * chandelier orb at the centre of the visible spiral mass.
 *
 * Scroll drives rotateY on the root motion.div — it spins this static shape.
 * At scrollYProgress = i/(N-1), the root has rotated exactly enough to bring
 * card i's face to the front of the cylinder.
 */
function computeSpiralSlot(
	index: number,
	totalCards: number,
	geo: SpiralGeometry,
): SpiralSlot {
	const angle = index * geo.angularStep;
	const angleRad = (angle * Math.PI) / 180;

	// Centre the spiral: offset all cards so the midpoint Y = 0
	const totalHeight = (totalCards - 1) * geo.verticalPitch;
	const centredY = index * geo.verticalPitch - totalHeight / 2;

	return {
		x: Math.sin(angleRad) * geo.radius - geo.cardWidth / 2,
		y: centredY - geo.cardHeight / 2,
		z: Math.cos(angleRad) * geo.radius,
		rotateY: angle,
	};
}

// ─── useSpiralGeometry ────────────────────────────────────────────────────────

/**
 * Returns the breakpoint-appropriate spiral geometry, or null on mobile /
 * reduced-motion. Starts as null (SSR = mobile path) and resolves on the first
 * client render to avoid hydration mismatch.
 */
function useSpiralGeometry(isReducedMotion: boolean): SpiralGeometry | null {
	const [geometry, setGeometry] = useState<SpiralGeometry | null>(null);

	useEffect(() => {
		function resolveGeometry() {
			if (isReducedMotion || window.innerWidth < 768) {
				setGeometry(null);
			} else if (window.innerWidth >= 1024) {
				setGeometry(SPIRAL_PRESETS.lg);
			} else {
				setGeometry(SPIRAL_PRESETS.md);
			}
		}

		resolveGeometry();
		if (isReducedMotion) return;

		const mqLg = window.matchMedia("(min-width: 1024px)");
		const mqMd = window.matchMedia("(min-width: 768px)");
		mqLg.addEventListener("change", resolveGeometry);
		mqMd.addEventListener("change", resolveGeometry);
		return () => {
			mqLg.removeEventListener("change", resolveGeometry);
			mqMd.removeEventListener("change", resolveGeometry);
		};
	}, [isReducedMotion]);

	return geometry;
}

// ─── ChandelierMarkup ────────────────────────────────────────────────────────

interface ChandelierMarkupProps {
	totalCards: number;
}

/**
 * Pure SVG content fragment for the kinetic chandelier.
 * Rendered inside ProjectsChandelierAxis so it inherits gradient defs.
 * viewBox y=0 = bobeche hub = exact centre of the -260…260 vertical range.
 */
function ChandelierMarkup({ totalCards }: ChandelierMarkupProps) {
	const armAngles = Array.from({ length: totalCards }, (_, i) => i * (360 / totalCards));

	return (
		<>
			{/* ── Top mounting bracket ── */}
			<circle cx="0" cy="-252" r="4" fill="#D4B886" fillOpacity="0.6" />
			<ellipse
				cx="0"
				cy="-242"
				rx="14"
				ry="4"
				stroke="#D4B886"
				strokeWidth="0.7"
				strokeOpacity="0.4"
				fill="none"
			/>
			{[0, 60, 120, 180, 240, 300].map((deg) => {
				const r = (deg * Math.PI) / 180;
				return (
					<line
						key={deg}
						x1={0}
						y1={-252}
						x2={Math.sin(r) * 14}
						y2={-242 + Math.cos(r) * 4}
						stroke="#D4B886"
						strokeWidth="0.45"
						strokeOpacity="0.3"
					/>
				);
			})}

			{/* ── Main shaft ── */}
			<line x1="0" y1="-242" x2="0" y2="195" stroke="url(#shaft-fade)" strokeWidth="1" />

			{/* ── Upper tier ring ── */}
			<ellipse
				cx="0"
				cy="-130"
				rx="40"
				ry="9"
				stroke="#D4B886"
				strokeWidth="0.7"
				strokeOpacity="0.32"
				fill="none"
			/>
			{[0, 72, 144, 216, 288].map((deg) => {
				const r = (deg * Math.PI) / 180;
				return (
					<line
						key={deg}
						x1={0}
						y1={-130}
						x2={Math.sin(r) * 40}
						y2={-130 + Math.cos(r) * 9}
						stroke="#D4B886"
						strokeWidth="0.5"
						strokeOpacity="0.25"
					/>
				);
			})}
			{[0, 72, 144, 216, 288].map((deg) => {
				const r = (deg * Math.PI) / 180;
				const hx = Math.sin(r) * 40;
				const hy = -130 + Math.cos(r) * 9;
				return (
					<g key={deg}>
						<line
							x1={hx}
							y1={hy}
							x2={hx}
							y2={hy + 14}
							stroke="#D4B886"
							strokeWidth="0.4"
							strokeOpacity="0.25"
						/>
						<circle cx={hx} cy={hy + 16} r="1.8" fill="#D4B886" fillOpacity="0.32" />
					</g>
				);
			})}

			{/* ── Centre bobeche ── */}
			<ellipse
				cx="0"
				cy="0"
				rx="20"
				ry="5.5"
				stroke="#D4B886"
				strokeWidth="1"
				strokeOpacity="0.55"
				fill="none"
			/>
			<ellipse
				cx="0"
				cy="-1.5"
				rx="12"
				ry="3.5"
				stroke="#D4B886"
				strokeWidth="0.55"
				strokeOpacity="0.3"
				fill="none"
			/>

			{/* ── Radiating arms ── */}
			{armAngles.map((deg, i) => {
				const r = (deg * Math.PI) / 180;
				const armLen = 58;
				const tipX = Math.sin(r) * armLen;
				const tipY = Math.cos(r) * 12;
				const opacity = 0.3 + Math.cos(r) * 0.2;
				return (
					<g key={i}>
						<line
							x1={Math.sin(r) * 12}
							y1={Math.cos(r) * 3.5}
							x2={tipX}
							y2={tipY}
							stroke="#D4B886"
							strokeWidth="0.75"
							strokeOpacity={Math.max(0.12, opacity)}
						/>
						<line
							x1={tipX}
							y1={tipY}
							x2={tipX * 0.88}
							y2={tipY + 22}
							stroke="#D4B886"
							strokeWidth="0.45"
							strokeOpacity={Math.max(0.1, opacity - 0.05)}
						/>
						<circle
							cx={tipX * 0.88}
							cy={tipY + 25}
							r="2.2"
							fill="#D4B886"
							fillOpacity={Math.max(0.12, opacity + 0.05)}
						/>
						<circle
							cx={tipX * 0.88}
							cy={tipY + 30}
							r="1.3"
							fill="#D4B886"
							fillOpacity={Math.max(0.08, opacity - 0.05)}
						/>
					</g>
				);
			})}

			{/* ── Central orb ── */}
			<circle cx="0" cy="0" r="18" fill="url(#orb-glow)" />
			<circle cx="0" cy="0" r="8" fill="#D4B886" fillOpacity="0.1" />
			<circle cx="0" cy="0" r="4.5" fill="#D4B886" fillOpacity="0.32" />
			<circle cx="0" cy="0" r="2" fill="#D4B886" fillOpacity="0.72" />
			{[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
				const r = (deg * Math.PI) / 180;
				const long = i % 2 === 0;
				return (
					<line
						key={deg}
						x1={Math.sin(r) * 7}
						y1={-Math.cos(r) * 7}
						x2={Math.sin(r) * (long ? 19 : 13)}
						y2={-Math.cos(r) * (long ? 19 : 13)}
						stroke="#D4B886"
						strokeWidth="0.45"
						strokeOpacity={long ? 0.32 : 0.18}
					/>
				);
			})}

			{/* ── Crystal chains ── */}
			{[0, 72, 144, 216, 288].map((deg, chainIdx) => {
				const r = (deg * Math.PI) / 180;
				const sx = Math.sin(r) * 18;
				const sy = Math.cos(r) * 4.5;
				return [16, 32, 48, 62, 73].map((dy, j) => {
					const fade = j / 4;
					return (
						<circle
							key={`${chainIdx}-${j}`}
							cx={sx * (1 - fade * 0.35)}
							cy={sy + dy}
							r={1.7 - j * 0.2}
							fill="#D4B886"
							fillOpacity={0.42 - j * 0.065}
						/>
					);
				});
			})}

			{/* ── Lower tier ring ── */}
			<ellipse
				cx="0"
				cy="78"
				rx="26"
				ry="6"
				stroke="#D4B886"
				strokeWidth="0.55"
				strokeOpacity="0.22"
				fill="none"
			/>
			{[0, 60, 120, 180, 240, 300].map((deg) => {
				const r = (deg * Math.PI) / 180;
				return (
					<line
						key={deg}
						x1={0}
						y1={78}
						x2={Math.sin(r) * 26}
						y2={78 + Math.cos(r) * 6}
						stroke="#D4B886"
						strokeWidth="0.4"
						strokeOpacity="0.18"
					/>
				);
			})}

			{/* ── Bottom finial ── */}
			<line x1="0" y1="78" x2="0" y2="170" stroke="#D4B886" strokeWidth="0.75" strokeOpacity="0.28" />
			<ellipse
				cx="0"
				cy="178"
				rx="4.5"
				ry="7"
				stroke="#D4B886"
				strokeWidth="0.7"
				strokeOpacity="0.35"
				fill="none"
			/>
			<ellipse cx="0" cy="180" rx="2" ry="3.5" fill="#D4B886" fillOpacity="0.22" />
		</>
	);
}

// ─── ProjectCardVisual ────────────────────────────────────────────────────────

interface ProjectCardVisualProps {
	project: FeaturedProject;
	index: number;
	translationNamespace: string;
	/** Spiral cards use a fixed slot height instead of intrinsic aspect ratio. */
	layout?: "default" | "fill";
	spiralSize?: SpiralCardSize;
}

/** Stateless card UI — shared by the carousel and the mobile grid. */
function ProjectCardVisual({
	project,
	index,
	translationNamespace,
	layout = "default",
	spiralSize = "lg",
}: ProjectCardVisualProps) {
	const t = useTranslations("landing.projects");
	const isFillLayout = layout === "fill";
	const spiralUi = isFillLayout ? SPIRAL_CARD_UI[spiralSize] : null;

	return (
		<article
			className={cn(
				"group relative h-full",
				isFillLayout
					? SPIRAL_CARD_ARTICLE_CLASS
					: "overflow-hidden rounded-[1.75rem] border border-[#D4B886]/15 bg-[#0E2A42] shadow-[0_12px_42px_rgba(4,15,26,0.36)]",
			)}
		>
			<div
				className={cn(
					"relative h-full w-full",
					isFillLayout ? "flex flex-col" : "transition-transform duration-500 ease-out group-hover:scale-[1.01]",
				)}
			>
				<div
					className={cn(
						"relative overflow-hidden",
						isFillLayout ? "min-h-0 flex-1" : "aspect-[4/3]",
					)}
				>
					<Image
						src={project.imageUrl}
						alt={t(`${translationNamespace}.imageAlt`)}
						fill
						priority={index < 2}
						className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
						sizes={
							spiralUi?.imageSizes ??
							"(min-width: 1024px) 420px, (min-width: 768px) 310px, 85vw"
						}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/72 via-[#071A2B]/28 to-[#071A2B]/08" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(212,184,134,0.12),transparent_40%)]" />
					<div
						className={cn(
							"pointer-events-none absolute inset-x-0 bottom-0 z-[5] bg-gradient-to-t from-[#071A2B]/55 via-[#071A2B]/18 to-transparent",
							spiralUi?.imageFade ?? "h-[42%]",
						)}
					/>
				</div>

				<div
					className={cn(
						"pointer-events-none absolute z-10 flex items-start justify-between",
						spiralUi?.overlay ?? "top-5 right-5 left-5 gap-4",
					)}
				>
					<div
						className={cn(
							"max-w-[min(100%,calc(100%-4.5rem))] border border-white/10",
							spiralUi?.titleBox ?? "rounded-xl px-4 py-3",
							isFillLayout
								? "bg-[#071A2B]/88"
								: "bg-[#071A2B]/28 backdrop-blur-md backdrop-saturate-150",
						)}
					>
						<Text
							variant={spiralUi ? spiralUi.titleVariant : "h4"}
							className={cn(
								"line-clamp-2 text-[#F4F4F6] [text-shadow:0_1px_2px_rgba(7,26,43,0.95),0_2px_24px_rgba(7,26,43,0.7)]",
								spiralSize === "md" && isFillLayout && "font-serif leading-snug",
							)}
						>
							{t(`${translationNamespace}.title`)}
						</Text>
					</div>
					<span
						className={cn(
							"shrink-0 rounded-full border border-[#D4B886]/28 font-sans text-[#D4B886] uppercase",
							spiralUi?.year ?? "text-footnote px-3 py-1.5 tracking-[0.14em]",
							isFillLayout
								? "bg-[#071A2B]/90"
								: "bg-[#071A2B]/45 backdrop-blur-md backdrop-saturate-150",
						)}
					>
						{project.year}
					</span>
				</div>

				<div className={cn("absolute z-10", spiralUi?.bottom ?? "right-5 bottom-5 left-5")}>
					<div
						className={cn(
							"border border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]",
							spiralUi?.panel ?? "rounded-2xl p-5",
							isFillLayout
								? "bg-[#071A2B]/88"
								: "rounded-2xl bg-[#071A2B]/22 p-5 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 group-hover:border-white/18 group-hover:bg-[#071A2B]/30",
						)}
					>
						<Text
							variant={spiralUi ? spiralUi.metaVariant : "body-sm"}
							className="text-[#F4F4F6]/78 [text-shadow:0_1px_2px_rgba(7,26,43,0.92),0_2px_20px_rgba(7,26,43,0.65)]"
						>
							{t(`${translationNamespace}.area`)}
						</Text>
						<div
							className={cn(
								"h-px bg-gradient-to-r from-white/22 via-white/10 to-transparent",
								spiralUi?.stackGap ?? "mt-4",
							)}
						/>
						<div
							className={cn(
								"flex items-center justify-between gap-3",
								spiralUi?.stackGap ?? "mt-4",
							)}
						>
							<Text
								variant={spiralUi ? spiralUi.metaVariant : "body-sm"}
								className="min-w-0 flex-1 truncate font-sans text-[#F4F4F6]/82 [text-shadow:0_1px_2px_rgba(7,26,43,0.92),0_2px_18px_rgba(7,26,43,0.62)]"
							>
								{t(`${translationNamespace}.location`)}
							</Text>
							<Link
								href={projectDetailPath(project.id)}
								className={cn(
									"inline-flex shrink-0 items-center font-sans tracking-[0.08em] text-[#E8D5B0] transition-all duration-300 [text-shadow:0_1px_2px_rgba(7,26,43,0.95),0_2px_18px_rgba(7,26,43,0.7)] group-hover:gap-3",
									spiralUi?.link ?? "text-body-sm gap-2",
								)}
							>
								{t("viewProject")}{" "}
								<ArrowRight className={spiralUi?.linkIcon ?? "h-4 w-4"} />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
}

interface ProjectCardBackProps {
	project: FeaturedProject;
	index: number;
	translationNamespace: string;
	spiralSize: SpiralCardSize;
}

/** Rear face for 3D spiral cards — visible when a card passes behind the chandelier. */
function ProjectCardBack({
	project,
	index,
	translationNamespace,
	spiralSize,
}: ProjectCardBackProps) {
	const t = useTranslations("landing.projects");
	const backUi = SPIRAL_CARD_BACK_UI[spiralSize];

	return (
		<article className={SPIRAL_CARD_ARTICLE_CLASS}>
			<div className="relative h-full w-full">
				<div className="absolute inset-0 bg-[#0E2A42]" aria-hidden="true" />
				<Image
					src={project.imageUrl}
					alt=""
					aria-hidden
					fill
					priority={index < 2}
					className="object-cover opacity-30 saturate-50"
					sizes={SPIRAL_CARD_UI[spiralSize].imageSizes}
				/>
				<div className="absolute inset-0 bg-gradient-to-br from-[#071A2B] via-[#0E2A42]/95 to-[#1A3D5C]/90" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,184,134,0.12),transparent_50%)]" />
				<div
					className={cn(
						"flex h-full flex-col items-center justify-center text-center",
						backUi.body,
					)}
				>
					<span
						className={cn(
							"font-sans text-[#D4B886]/70 uppercase",
							backUi.brand,
						)}
					>
						Perla
					</span>
					<div
						className={cn(
							"h-px bg-gradient-to-r from-transparent via-[#D4B886]/50 to-transparent",
							backUi.divider,
						)}
					/>
					<Text variant={backUi.titleVariant} className="line-clamp-2 text-[#F4F4F6]/88">
						{t(`${translationNamespace}.title`)}
					</Text>
					<span
						className={cn(
							"font-sans tracking-[0.16em] text-[#F4F4F6]/35 uppercase tabular-nums",
							backUi.year,
						)}
					>
						{project.year}
					</span>
				</div>
			</div>
		</article>
	);
}

// ─── ProjectSpiralCard ────────────────────────────────────────────────────────

interface ProjectSpiralCardProps {
	project: FeaturedProject;
	index: number;
	geometry: SpiralGeometry;
	slot: SpiralSlot;
}

/** Double-sided card in the 3D spiral — rear face visible behind the chandelier pole. */
function ProjectSpiralCard({ project, index, geometry, slot }: ProjectSpiralCardProps) {
	const translationNamespace = `items.${project.id}`;
	const spiralSize = resolveSpiralCardSize(geometry.cardWidth);

	return (
		<div
			style={{
				position: "absolute",
				width: geometry.cardWidth,
				height: geometry.cardHeight,
				transform: `translate3d(${slot.x}px, ${slot.y}px, ${slot.z}px) rotateY(${slot.rotateY}deg)`,
				transformStyle: "preserve-3d",
			}}
		>
			<div
				className="relative h-full w-full"
				style={{ transformStyle: "preserve-3d" }}
			>
				<div className={SPIRAL_CARD_FACE_CLIP_CLASS}>
					<ProjectCardVisual
						project={project}
						index={index}
						translationNamespace={translationNamespace}
						layout="fill"
						spiralSize={spiralSize}
					/>
				</div>
				<div
					className={cn(
						SPIRAL_CARD_FACE_CLIP_CLASS,
						"[transform:rotateY(180deg)_translateZ(0.1px)]",
					)}
				>
					<div
						className="h-full w-full [transform:rotateY(180deg)]"
						style={{ transformStyle: "flat" }}
					>
						<ProjectCardBack
							project={project}
							index={index}
							translationNamespace={translationNamespace}
							spiralSize={spiralSize}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

// ─── ProjectsChandelierAxis ───────────────────────────────────────────────────

interface ProjectsChandelierAxisProps {
	totalCards: number;
}

/**
 * Kinetic chandelier at z=0 inside the 3D scene — does not rotate with the spiral.
 * Cards with z &lt; 0 (after root rotation) paint behind; cards with z &gt; 0 in front.
 */
function ProjectsChandelierAxis({ totalCards }: ProjectsChandelierAxisProps) {
	return (
		<div
			className="pointer-events-none absolute left-0 top-0"
			aria-hidden="true"
			style={{
				transform: "translate3d(0, 0, 0)",
				transformStyle: "preserve-3d",
			}}
		>
			<svg
				viewBox="-70 -260 140 520"
				preserveAspectRatio="xMidYMid meet"
				className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
				style={{ height: "220vh", width: "auto", display: "block" }}
			>
				<defs>
					<radialGradient id="orb-glow" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#D4B886" stopOpacity="0.55" />
						<stop offset="60%" stopColor="#D4B886" stopOpacity="0.08" />
						<stop offset="100%" stopColor="#D4B886" stopOpacity="0" />
					</radialGradient>
					<linearGradient
						id="shaft-fade"
						x1="0"
						y1="-260"
						x2="0"
						y2="260"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="#D4B886" stopOpacity="0.05" />
						<stop offset="25%" stopColor="#D4B886" stopOpacity="0.5" />
						<stop offset="50%" stopColor="#D4B886" stopOpacity="0.65" />
						<stop offset="75%" stopColor="#D4B886" stopOpacity="0.45" />
						<stop offset="100%" stopColor="#D4B886" stopOpacity="0.05" />
					</linearGradient>
				</defs>
				<ChandelierMarkup totalCards={totalCards} />
			</svg>
		</div>
	);
}

// ─── ProjectsMobileGrid ───────────────────────────────────────────────────────

/** Staggered 2-column grid — shown on mobile and for reduced-motion users. */
function ProjectsMobileGrid() {
	return (
		<div className="mt-10 grid gap-6 sm:grid-cols-2">
			{FEATURED_PROJECTS.map((project, index) => (
				<motion.div
					key={project.id}
					initial={{ opacity: 0, y: 32 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
					viewport={{ once: true, amount: 0.15 }}
				>
					<ProjectCardVisual
						project={project}
						index={index}
						translationNamespace={`items.${project.id}`}
					/>
				</motion.div>
			))}
		</div>
	);
}

// ─── ProjectsSpiralStage ──────────────────────────────────────────────────────

interface ProjectsSpiralStageProps {
	geometry: SpiralGeometry;
	scrollYProgress: MotionValue<number>;
	/** Vertical compensation so the active card stays viewport-centred. */
	translateY: MotionValue<number>;
	totalCards: number;
	onActiveIndexChange: (index: number) => void;
}

/**
 * 3D spiral scene — positioned at stage centre (top/left 50%).
 *
 *   Outer motion.div — translateY only (vertical scroll track).
 *   ProjectsChandelierAxis — fixed pole at z=0; does not spin.
 *   Inner motion.div — rotateY / rotateX; double-sided cards orbit the pole.
 *
 * Depth sorting: cards with negative Z paint behind the chandelier; positive Z in front.
 *
 * Vertical centering proof (for card i at scrollYProgress = i/(N-1)):
 *   card.y (in root space)   = i*pitch - totalHeight/2 - cardHeight/2
 *   root.translateY          = totalHeight/2 - i*pitch
 *   → card top in viewport   = 50vh + root.tY + card.y
 *                            = 50vh + (totalHeight/2 - i*pitch)
 *                                   + (i*pitch - totalHeight/2 - cardHeight/2)
 *                            = 50vh - cardHeight/2          ← always centred ✓
 *
 * Performance:
 * - ONE element subscribes to scrollYProgress — O(1) per frame.
 * - Card slots computed once at render — O(N) on mount.
 * - will-change toggled only while in view.
 */
function ProjectsSpiralStage({
	geometry,
	scrollYProgress,
	translateY,
	totalCards,
	onActiveIndexChange,
}: ProjectsSpiralStageProps) {
	const totalSpin = -(totalCards - 1) * geometry.angularStep;

	const rawRotateY = useTransform(scrollYProgress, [0, 1], [0, totalSpin]);
	// Slight viewer tilt: looking just above the equator of the spiral.
	const rawRotateX = useTransform(scrollYProgress, [0, 1], [8, 3]);

	const rotateY = useSpring(rawRotateY, SPRING_CONFIG);
	const rotateX = useSpring(rawRotateX, SPRING_CONFIG);
	// translateY is provided by the parent — shared with the chandelier axis.

	const [isInView, setIsInView] = useState(false);

	useMotionValueEvent(scrollYProgress, "change", (progress) => {
		const activeIndex = Math.max(
			0,
			Math.min(Math.round(progress * (totalCards - 1)), totalCards - 1),
		);
		onActiveIndexChange(activeIndex);
	});

	return (
		<motion.div
			onViewportEnter={() => setIsInView(true)}
			onViewportLeave={() => setIsInView(false)}
			className="z-[1]"
			style={{
				position: "absolute",
				top: "50%",
				left: "50%",
				translateY,
				transformStyle: "preserve-3d",
				willChange: isInView ? "transform" : "auto",
			}}
		>
			<ProjectsChandelierAxis totalCards={totalCards} />

			<motion.div
				style={{
					rotateY,
					rotateX,
					transformStyle: "preserve-3d",
					willChange: isInView ? "transform" : "auto",
				}}
			>
				{FEATURED_PROJECTS.map((project, index) => {
					const slot = computeSpiralSlot(index, totalCards, geometry);
					return (
						<ProjectSpiralCard
							key={project.id}
							project={project}
							index={index}
							geometry={geometry}
							slot={slot}
						/>
					);
				})}
			</motion.div>
		</motion.div>
	);
}

// ─── ProjectsActiveOverlay ────────────────────────────────────────────────────

interface ProjectsActiveOverlayProps {
	activeIndex: number;
	totalCards: number;
}

/** Champagne card counter pinned to the right edge of the sticky stage. */
function ProjectsActiveOverlay({ activeIndex, totalCards }: ProjectsActiveOverlayProps) {
	const displayCurrent = String(activeIndex + 1).padStart(2, "0");
	const displayTotal = String(totalCards).padStart(2, "0");

	return (
		<div
			className="pointer-events-none absolute top-1/2 right-6 z-10 flex -translate-y-1/2 flex-col items-center gap-2 lg:right-10"
			aria-hidden="true"
		>
			<span className="font-sans text-[11px] tracking-[0.22em] text-[#D4B886] uppercase tabular-nums">
				{displayCurrent}
			</span>
			<div className="h-14 w-px bg-gradient-to-b from-[#D4B886]/70 via-[#D4B886]/30 to-transparent" />
			<span className="font-sans text-[11px] tracking-[0.22em] text-[#F4F4F6]/30 uppercase tabular-nums">
				{displayTotal}
			</span>
		</div>
	);
}

// ─── ProjectsSpiralExperience ─────────────────────────────────────────────────

interface ProjectsSpiralExperienceProps {
	geometry: SpiralGeometry;
}

/**
 * Scroll-driven 3D spiral — mounted only after geometry resolves (tablet+).
 * Ref and useScroll live in the same component to guarantee the target is
 * always hydrated before Framer Motion reads it.
 *
 * Layer order inside sticky stage:
 *   1. ProjectsSpiralStage   — unified 3D scene (chandelier at z=0, cards orbit)
 *   2. Edge softener           — z-[8]
 *   3. ProjectsActiveOverlay   — z-10
 *
 * Vignette deliberately omitted: the spiral should be visible top-to-bottom.
 * A very shallow edge-only fade (top/bottom 6%) is kept to soften the hard
 * clip from overflow:hidden without hiding any cards.
 */
function ProjectsSpiralExperience({ geometry }: ProjectsSpiralExperienceProps) {
	const spiralZoneRef = useRef<HTMLDivElement>(null);
	const totalCards = FEATURED_PROJECTS.length;
	const scrollDriverHeight = `${totalCards * SCROLL_VH_PER_CARD}vh`;
	const [activeIndex, setActiveIndex] = useState(0);

	const { scrollYProgress } = useScroll({
		target: spiralZoneRef,
		offset: ["start start", "end end"],
	});

	// Vertical compensation so the active card stays viewport-centred.
	const totalHeight = (totalCards - 1) * geometry.verticalPitch;
	const rawTranslateY = useTransform(
		scrollYProgress,
		[0, 1],
		[totalHeight / 2, -totalHeight / 2],
	);
	const translateY = useSpring(rawTranslateY, SPRING_CONFIG);

	return (
		<div ref={spiralZoneRef} className="relative hidden md:block">
			<div
				className="sticky top-0 h-screen overflow-hidden"
				style={{
					perspective: "1400px",
					perspectiveOrigin: "50% 45%",
					transformStyle: "preserve-3d",
				}}
			>
				<ProjectsSpiralStage
					geometry={geometry}
					scrollYProgress={scrollYProgress}
					translateY={translateY}
					totalCards={totalCards}
					onActiveIndexChange={setActiveIndex}
				/>

				{/*
				 * Shallow edge softener — only 6% at each edge so the hard clip
				 * from overflow:hidden is invisible without hiding spiral cards.
				 */}
				<div
					className="pointer-events-none absolute inset-0 z-[8]"
					style={{
						background:
							"linear-gradient(to bottom, #071A2B 0%, transparent 6%, transparent 94%, #071A2B 100%)",
					}}
					aria-hidden="true"
				/>

				<ProjectsActiveOverlay activeIndex={activeIndex} totalCards={totalCards} />
			</div>

			{/* Scroll driver — total budget = N cards × SCROLL_VH_PER_CARD */}
			<div style={{ height: scrollDriverHeight }} aria-hidden="true" />
		</div>
	);
}

// ─── LandingProjects ─────────────────────────────────────────────────────────

/**
 * LandingProjects — Portfolio preview section.
 *
 * Tablet/Desktop (≥768px, no reduced-motion):
 *   Scroll-driven 3D carousel. Cards orbit a vertical axis marked by a
 *   kinetic chandelier SVG. Scrolling spins the carousel (rotateY) so each
 *   card rotates to the front in sequence. CSS 3D perspective via Framer Motion
 *   — no WebGL, cards remain real <article>/<a> elements for SEO.
 *
 * Mobile (<768px) + reduced-motion:
 *   Staggered 2-column grid — same card UI, no sticky scroll.
 */
export function LandingProjects() {
	const t = useTranslations("landing.projects");
	const isReducedMotion = useReducedMotion() ?? false;
	const geometry = useSpiralGeometry(isReducedMotion);

	return (
		<section className="bg-[#071A2B]" aria-label={t("label")}>
			{/* Section header — always in normal document flow */}
			<div className="mx-auto max-w-7xl px-6 pt-24 pb-14 lg:px-12 lg:pt-32">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<motion.span
							initial={{ opacity: 0, y: 14 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.55 }}
							viewport={{ once: true }}
							className="text-label font-sans tracking-widest text-[#D4B886] uppercase"
						>
							{t("label")}
						</motion.span>
						<motion.div
							initial={{ opacity: 0, y: 14 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.55, delay: 0.1 }}
							viewport={{ once: true }}
						>
							<Text variant="display-lg" as="h2" className="mt-3 text-[#F4F4F6]">
								{t("heading")}
							</Text>
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.55, delay: 0.18 }}
						viewport={{ once: true }}
					>
						<Button href={ROUTES.projects} variant="outline" size="md">
							{t("viewAll")}
						</Button>
					</motion.div>
				</div>
			</div>

		{/* Spiral (tablet+) — mounted only after geometry resolves client-side */}
		{geometry !== null && <ProjectsSpiralExperience geometry={geometry} />}

			{/* Mobile grid — hidden on md+ when carousel is active */}
			<div
				className={cn(
					"mx-auto max-w-7xl px-6 pb-24 lg:px-12",
					geometry !== null && "md:hidden",
				)}
			>
				<ProjectsMobileGrid />
			</div>
		</section>
	);
}
