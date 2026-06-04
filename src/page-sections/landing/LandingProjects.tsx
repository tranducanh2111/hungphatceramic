"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button, Text } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/cn";
import { ProjectsMobileGrid, ProjectsSpiralExperience } from "./projects/ProjectsScene";
import { useSpiralGeometry } from "./projects/useSpiralGeometry";

export function LandingProjects() {
	const t = useTranslations("landing.projects");
	const isReducedMotion = useReducedMotion() ?? false;
	const geometry = useSpiralGeometry(isReducedMotion);

	return (
		<section className="bg-[#071A2B]" aria-label={t("label")}>
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

			{geometry !== null && <ProjectsSpiralExperience geometry={geometry} />}

			<div className={cn("mx-auto max-w-7xl px-6 pb-24 lg:px-12", geometry !== null && "md:hidden")}>
				<ProjectsMobileGrid />
			</div>
		</section>
	);
}
