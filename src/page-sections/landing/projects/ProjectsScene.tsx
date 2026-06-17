"use client";

import { ViewportDeferredImage } from "@/components/media";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
	motion,
	useMotionValueEvent,
	useScroll,
	useSpring,
	useTransform,
	type MotionValue,
} from "framer-motion";
import { Text } from "@/components/ui";
import { FEATURED_PROJECTS, type FeaturedProject } from "@/constants/landing";
import { cn } from "@/lib/cn";
import {
	SCROLL_VH_PER_CARD,
	SPIRAL_CARD_ARTICLE_CLASS,
	SPIRAL_CARD_BACK_UI,
	SPIRAL_CARD_FACE_CLIP_CLASS,
	SPIRAL_CARD_UI,
	SPRING_CONFIG,
	resolveSpiralCardSize,
	type SpiralCardSize,
	type SpiralGeometry,
} from "./constants";
import { computeSpiralSlot } from "./geometry";

interface ChandelierMarkupProps {
	totalCards: number;
}

function ChandelierMarkup({ totalCards }: ChandelierMarkupProps) {
	const armAngles = Array.from({ length: totalCards }, (_, index) => index * (360 / totalCards));

	return (
		<>
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
			{[0, 60, 120, 180, 240, 300].map((degree) => {
				const radian = (degree * Math.PI) / 180;
				return (
					<line
						key={degree}
						x1={0}
						y1={-252}
						x2={Math.sin(radian) * 14}
						y2={-242 + Math.cos(radian) * 4}
						stroke="#D4B886"
						strokeWidth="0.45"
						strokeOpacity="0.3"
					/>
				);
			})}

			<line x1="0" y1="-242" x2="0" y2="195" stroke="url(#shaft-fade)" strokeWidth="1" />

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
			{[0, 72, 144, 216, 288].map((degree) => {
				const radian = (degree * Math.PI) / 180;
				return (
					<line
						key={degree}
						x1={0}
						y1={-130}
						x2={Math.sin(radian) * 40}
						y2={-130 + Math.cos(radian) * 9}
						stroke="#D4B886"
						strokeWidth="0.5"
						strokeOpacity="0.25"
					/>
				);
			})}
			{[0, 72, 144, 216, 288].map((degree) => {
				const radian = (degree * Math.PI) / 180;
				const hangerX = Math.sin(radian) * 40;
				const hangerY = -130 + Math.cos(radian) * 9;
				return (
					<g key={degree}>
						<line
							x1={hangerX}
							y1={hangerY}
							x2={hangerX}
							y2={hangerY + 14}
							stroke="#D4B886"
							strokeWidth="0.4"
							strokeOpacity="0.25"
						/>
						<circle
							cx={hangerX}
							cy={hangerY + 16}
							r="1.8"
							fill="#D4B886"
							fillOpacity="0.32"
						/>
					</g>
				);
			})}

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

			{armAngles.map((degree, index) => {
				const radian = (degree * Math.PI) / 180;
				const armLength = 58;
				const tipX = Math.sin(radian) * armLength;
				const tipY = Math.cos(radian) * 12;
				const opacity = 0.3 + Math.cos(radian) * 0.2;
				return (
					<g key={index}>
						<line
							x1={Math.sin(radian) * 12}
							y1={Math.cos(radian) * 3.5}
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

			<circle cx="0" cy="0" r="18" fill="url(#orb-glow)" />
			<circle cx="0" cy="0" r="8" fill="#D4B886" fillOpacity="0.1" />
			<circle cx="0" cy="0" r="4.5" fill="#D4B886" fillOpacity="0.32" />
			<circle cx="0" cy="0" r="2" fill="#D4B886" fillOpacity="0.72" />
			{[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((degree, index) => {
				const radian = (degree * Math.PI) / 180;
				const longRay = index % 2 === 0;
				return (
					<line
						key={degree}
						x1={Math.sin(radian) * 7}
						y1={-Math.cos(radian) * 7}
						x2={Math.sin(radian) * (longRay ? 19 : 13)}
						y2={-Math.cos(radian) * (longRay ? 19 : 13)}
						stroke="#D4B886"
						strokeWidth="0.45"
						strokeOpacity={longRay ? 0.32 : 0.18}
					/>
				);
			})}

			{[0, 72, 144, 216, 288].map((degree, chainIndex) => {
				const radian = (degree * Math.PI) / 180;
				const sourceX = Math.sin(radian) * 18;
				const sourceY = Math.cos(radian) * 4.5;

				return [16, 32, 48, 62, 73].map((distanceY, index) => {
					const fade = index / 4;
					return (
						<circle
							key={`${chainIndex}-${index}`}
							cx={sourceX * (1 - fade * 0.35)}
							cy={sourceY + distanceY}
							r={1.7 - index * 0.2}
							fill="#D4B886"
							fillOpacity={0.42 - index * 0.065}
						/>
					);
				});
			})}

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
			{[0, 60, 120, 180, 240, 300].map((degree) => {
				const radian = (degree * Math.PI) / 180;
				return (
					<line
						key={degree}
						x1={0}
						y1={78}
						x2={Math.sin(radian) * 26}
						y2={78 + Math.cos(radian) * 6}
						stroke="#D4B886"
						strokeWidth="0.4"
						strokeOpacity="0.18"
					/>
				);
			})}

			<line
				x1="0"
				y1="78"
				x2="0"
				y2="170"
				stroke="#D4B886"
				strokeWidth="0.75"
				strokeOpacity="0.28"
			/>
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

interface ProjectCardVisualProps {
	project: FeaturedProject;
	index: number;
	translationNamespace: string;
	layout?: "default" | "fill";
	spiralSize?: SpiralCardSize;
}

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
					: "border-champagne/15 bg-sapphire-ocean overflow-hidden rounded-[1.75rem] border shadow-[0_12px_42px_rgba(4,15,26,0.36)]",
			)}
		>
			<div
				className={cn(
					"relative h-full w-full",
					isFillLayout
						? "flex flex-col"
						: "transition-transform duration-500 ease-out group-hover:scale-[1.01]",
				)}
			>
				<div
					className={cn(
						"relative overflow-hidden",
						isFillLayout ? "min-h-0 flex-1" : "aspect-[4/3]",
					)}
				>
					<ViewportDeferredImage
						src={project.imageUrl}
						alt={t(`${translationNamespace}.imageAlt`)}
						fill
						quality={55}
						eager={index < 2}
						unloadWhenFar={!isFillLayout}
						className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
						sizes={
							spiralUi?.imageSizes ??
							"(min-width: 1024px) 420px, (min-width: 768px) 310px, 85vw"
						}
					/>
					<div className="to-[#071A2B]/08 absolute inset-0 bg-gradient-to-t from-[#071A2B]/72 via-[#071A2B]/28" />
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
						<Text
							variant={spiralUi ? spiralUi.metaVariant : "body-sm"}
							className={cn(
								"truncate font-sans text-[#F4F4F6]/82 [text-shadow:0_1px_2px_rgba(7,26,43,0.92),0_2px_18px_rgba(7,26,43,0.62)]",
								spiralUi?.stackGap ?? "mt-4",
							)}
						>
							{t(`${translationNamespace}.location`)}
						</Text>
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
				<ViewportDeferredImage
					src={project.imageUrl}
					alt=""
					aria-hidden
					fill
					quality={55}
					eager={index < 2}
					unloadWhenFar={false}
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
					<span className={cn("font-sans text-[#D4B886]/70 uppercase", backUi.brand)}>
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

interface ProjectSpiralCardProps {
	project: FeaturedProject;
	index: number;
	geometry: SpiralGeometry;
}

function ProjectSpiralCard({ project, index, geometry }: ProjectSpiralCardProps) {
	const translationNamespace = `items.${project.id}`;
	const spiralSize = resolveSpiralCardSize(geometry.cardWidth);
	const slot = computeSpiralSlot(index, FEATURED_PROJECTS.length, geometry);

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
			<div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
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

interface ProjectsChandelierAxisProps {
	totalCards: number;
}

function ProjectsChandelierAxis({ totalCards }: ProjectsChandelierAxisProps) {
	return (
		<div
			className="pointer-events-none absolute top-0 left-0"
			aria-hidden="true"
			style={{ transform: "translate3d(0, 0, 0)", transformStyle: "preserve-3d" }}
		>
			<svg
				viewBox="-70 -260 140 520"
				preserveAspectRatio="xMidYMid meet"
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
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

interface ProjectsSpiralStageProps {
	geometry: SpiralGeometry;
	scrollYProgress: MotionValue<number>;
	translateY: MotionValue<number>;
	totalCards: number;
	onActiveIndexChange: (index: number) => void;
}

function ProjectsSpiralStage({
	geometry,
	scrollYProgress,
	translateY,
	totalCards,
	onActiveIndexChange,
}: ProjectsSpiralStageProps) {
	const totalSpin = -(totalCards - 1) * geometry.angularStep;
	const rotateY = useSpring(useTransform(scrollYProgress, [0, 1], [0, totalSpin]), SPRING_CONFIG);
	const rotateX = useSpring(useTransform(scrollYProgress, [0, 1], [8, 3]), SPRING_CONFIG);
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
				{FEATURED_PROJECTS.map((project, index) => (
					<ProjectSpiralCard
						key={project.id}
						project={project}
						index={index}
						geometry={geometry}
					/>
				))}
			</motion.div>
		</motion.div>
	);
}

interface ProjectsActiveOverlayProps {
	activeIndex: number;
	totalCards: number;
}

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

export function ProjectsMobileGrid() {
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

interface ProjectsSpiralExperienceProps {
	geometry: SpiralGeometry;
}

export function ProjectsSpiralExperience({ geometry }: ProjectsSpiralExperienceProps) {
	const spiralZoneRef = useRef<HTMLDivElement>(null);
	const totalCards = FEATURED_PROJECTS.length;
	const scrollDriverHeight = `${totalCards * SCROLL_VH_PER_CARD}vh`;
	const [activeIndex, setActiveIndex] = useState(0);

	const { scrollYProgress } = useScroll({
		target: spiralZoneRef,
		offset: ["start start", "end end"],
	});

	const totalHeight = (totalCards - 1) * geometry.verticalPitch;
	const translateY = useSpring(
		useTransform(scrollYProgress, [0, 1], [totalHeight / 2, -totalHeight / 2]),
		SPRING_CONFIG,
	);

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
			<div style={{ height: scrollDriverHeight }} aria-hidden="true" />
		</div>
	);
}
