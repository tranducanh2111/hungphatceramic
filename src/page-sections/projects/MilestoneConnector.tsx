"use client";

import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { CONNECTOR_PATH_LTR, CONNECTOR_PATH_RTL } from "@/data/projects/heritage-paths";
import { useAppScroll } from "@/hooks/useAppScroll";

interface MilestoneConnectorProps {
	connectorIndex: number;
}

/** Scroll-driven champagne stroke reveal between milestones (mask + pathLength, reverses naturally when scrolling back up). */
export function MilestoneConnector({ connectorIndex }: MilestoneConnectorProps) {
	const connectorRef = useRef<HTMLDivElement>(null);
	const isRtl = connectorIndex % 2 === 0;
	const pathData = isRtl ? CONNECTOR_PATH_RTL : CONNECTOR_PATH_LTR;
	const viewBox = isRtl ? "0 0 623 400" : "0 0 769 320";
	const maskId = `projects-heritage-connector-mask-${connectorIndex}`;

	const { scrollYProgress } = useAppScroll({
		target: connectorRef,
		offset: ["start end", "end start"],
	});

	const drawProgress = scrollYProgress;
	const tickOpacity = useTransform(scrollYProgress, [0.78, 1], [0, 1]);

	return (
		<div
			ref={connectorRef}
			className="relative col-span-2 hidden py-6 lg:block lg:py-10"
			aria-hidden="true"
		>
			<div className="relative ml-[25%] h-40 w-1/2 lg:h-48">
				<svg
					viewBox={viewBox}
					preserveAspectRatio="xMidYMid meet"
					className="h-full w-full overflow-visible"
					fill="none"
				>
					<defs>
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

					<path
						d={pathData}
						stroke="#1A3D5C"
						strokeWidth="0.8"
						strokeDasharray="5 10"
						strokeLinecap="round"
						strokeOpacity={0.6}
						vectorEffect="non-scaling-stroke"
					/>

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

					{!isRtl && (
						<motion.g
							stroke="#D4B886"
							strokeWidth="1"
							strokeLinecap="round"
							strokeOpacity={0.7}
							vectorEffect="non-scaling-stroke"
							style={{ opacity: tickOpacity }}
						>
							<line x1="-6" y1="1" x2="8" y2="1" />
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
							<line x1="616" y1="1" x2="630" y2="1" />
							<line x1="40" y1="399" x2="54" y2="399" />
						</motion.g>
					)}
				</svg>
			</div>
		</div>
	);
}
