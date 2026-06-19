"use client";

import { motion } from "framer-motion";
import { FEATURED_PROJECTS } from "@/constants/landing";
import { ProjectCardVisual } from "./ProjectSpiralCard";

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
