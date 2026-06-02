"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Text, Button } from "@/components/ui";
import { FEATURED_PROJECTS, type FeaturedProject } from "@/constants/landing";
import { ROUTES, projectDetailPath } from "@/constants/routes";
import { Link } from "@/i18n/navigation";

function ProjectCard({
	project,
	index,
	translationNamespace,
}: {
	project: FeaturedProject;
	index: number;
	translationNamespace: string;
}) {
	const t = useTranslations("landing.projects");

	return (
		<motion.article
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
			viewport={{ once: true, amount: 0.12 }}
			className="group relative transform-gpu overflow-hidden rounded-[1.75rem] border border-[#D4B886]/15 bg-[#0E2A42] shadow-[0_12px_42px_rgba(4,15,26,0.36)]"
			style={{ willChange: "transform, opacity" }}
		>
			<div className="relative h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.01]">
				<div className="relative aspect-[4/3] overflow-hidden">
					<Image
						src={project.imageUrl}
						alt={t(`${translationNamespace}.imageAlt`)}
						fill
						className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
						sizes="(max-width: 768px) 100vw, 50vw"
					/>
					<div className="to-[#071A2B]/08 absolute inset-0 bg-gradient-to-t from-[#071A2B]/72 via-[#071A2B]/28" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(212,184,134,0.12),transparent_40%)]" />
					<div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[42%] bg-gradient-to-t from-[#071A2B]/55 via-[#071A2B]/18 to-transparent" />
				</div>

				<div className="pointer-events-none absolute top-5 right-5 left-5 z-10 flex items-start justify-between gap-4">
					<div className="max-w-[min(100%,calc(100%-5.5rem))] rounded-xl border border-white/10 bg-[#071A2B]/28 px-4 py-3 backdrop-blur-md backdrop-saturate-150">
						<Text
							variant="h4"
							className="line-clamp-2 text-[#F4F4F6] [text-shadow:0_1px_2px_rgba(7,26,43,0.95),0_2px_24px_rgba(7,26,43,0.7)]"
						>
							{t(`${translationNamespace}.title`)}
						</Text>
					</div>
					<span className="text-footnote shrink-0 rounded-full border border-[#D4B886]/28 bg-[#071A2B]/45 px-3 py-1.5 font-sans tracking-[0.14em] text-[#D4B886] uppercase backdrop-blur-md backdrop-saturate-150">
						{project.year}
					</span>
				</div>

				<div className="absolute right-5 bottom-5 left-5 z-10">
					<div className="rounded-2xl border border-white/12 bg-[#071A2B]/22 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-md backdrop-saturate-150 transition-all duration-500 group-hover:border-white/18 group-hover:bg-[#071A2B]/30">
						<Text
							variant="body-sm"
							className="text-[#F4F4F6]/78 [text-shadow:0_1px_2px_rgba(7,26,43,0.92),0_2px_20px_rgba(7,26,43,0.65)]"
						>
							{t(`${translationNamespace}.area`)}
						</Text>
						<div className="mt-4 h-px bg-gradient-to-r from-white/22 via-white/10 to-transparent" />
						<div className="mt-4 flex items-center justify-between gap-4">
							<Text
								variant="body-sm"
								className="min-w-0 flex-1 truncate font-sans text-[#F4F4F6]/82 [text-shadow:0_1px_2px_rgba(7,26,43,0.92),0_2px_18px_rgba(7,26,43,0.62)]"
							>
								{t(`${translationNamespace}.location`)}
							</Text>
							<Link
								href={projectDetailPath(project.id)}
								className="text-body-sm inline-flex shrink-0 items-center gap-2 font-sans tracking-[0.08em] text-[#E8D5B0] transition-all duration-300 [text-shadow:0_1px_2px_rgba(7,26,43,0.95),0_2px_18px_rgba(7,26,43,0.7)] group-hover:gap-3"
							>
								{t("viewProject")} <ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</motion.article>
	);
}

/**
 * LandingProjects — Portfolio preview showcasing 4 featured projects.
 */
export function LandingProjects() {
	const t = useTranslations("landing.projects");

	return (
		<section className="bg-[#071A2B] py-28 lg:py-36">
			<div className="mx-auto max-w-7xl px-6 lg:px-12">
				{/* Header */}
				<div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<motion.span
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="text-label font-sans tracking-widest text-[#D4B886] uppercase"
						>
							{t("label")}
						</motion.span>
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							viewport={{ once: true }}
						>
							<Text variant="display-lg" className="mt-3 text-[#F4F4F6]">
								{t("heading")}
							</Text>
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
					>
						<Button href={ROUTES.projects} variant="outline" size="md">
							{t("viewAll")}
						</Button>
					</motion.div>
				</div>

				{/* Project grid */}
				<div className="grid gap-6 md:grid-cols-2">
					{FEATURED_PROJECTS.map((project, index) => (
						<ProjectCard
							key={project.id}
							project={project}
							index={index}
							translationNamespace={`items.${project.id}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
