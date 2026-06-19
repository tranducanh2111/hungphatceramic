"use client";

import { useState } from "react";
import {
	motion,
	useMotionValueEvent,
	useSpring,
	useTransform,
	type MotionValue,
} from "framer-motion";
import { FEATURED_PROJECTS } from "@/constants/landing";
import { SPRING_CONFIG, type SpiralGeometry } from "./constants";
import { ChandelierMarkup } from "./ChandelierMarkup";
import { ProjectSpiralCard } from "./ProjectSpiralCard";

interface ProjectsChandelierAxisProps {
	totalCards: number;
}

export function ProjectsChandelierAxis({ totalCards }: ProjectsChandelierAxisProps) {
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

export function ProjectsSpiralStage({
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
