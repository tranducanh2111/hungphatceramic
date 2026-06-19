"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Text } from "@/components/ui";
import { RevealOnView, SectionBlendOverlay } from "@/components/common";
import {
	SECTION_BLEND_GRADIENTS,
	SECTION_BLEND_CONTENT_PAD_AFTER_MAJOR,
	SECTION_BLEND_CONTENT_PAD_MINOR,
	SECTION_BLEND_HEIGHT_COMPACT_MINOR,
} from "@/lib/section-blend-gradients";
import { PROJECT_REGIONS, getProjectsByRegion, type ProjectRegion } from "@/constants/projects";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const REGION_MESSAGE_KEYS: Record<ProjectRegion, "north" | "south" | "island"> = {
	north: "north",
	south: "south",
	island: "island",
};

/** Minimal Vietnam silhouette (champagne stroke on linen band). */
function VietnamOutlineDecor({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 120 200"
			className={cn("text-champagne-deep/35 pointer-events-none", className)}
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M62 8 L72 28 L88 42 L95 58 L90 78 L98 95 L92 115 L85 135 L78 155 L70 175 L58 192 L48 175 L42 155 L38 135 L32 115 L28 95 L35 78 L30 58 L38 42 L48 28 Z"
				stroke="currentColor"
				strokeWidth="0.75"
				vectorEffect="non-scaling-stroke"
			/>
			<circle cx="72" cy="52" r="2.5" fill="currentColor" opacity="0.55" />
			<circle cx="48" cy="118" r="2.5" fill="currentColor" opacity="0.55" />
			<circle cx="68" cy="168" r="2.5" fill="currentColor" opacity="0.55" />
		</svg>
	);
}

function RegionColumn({ region }: { region: ProjectRegion }) {
	const t = useTranslations("pages.projects.regions");
	const tHeritage = useTranslations("pages.projects.heritage");
	const projects = getProjectsByRegion(region);
	const regionKey = REGION_MESSAGE_KEYS[region];

	return (
		<RevealOnView className="flex flex-col">
			<span className="text-label text-champagne-deep font-sans font-medium tracking-[0.2em] uppercase">
				{t(`${regionKey}.title`)}
			</span>
			<p className="text-body-sm text-sapphire-deep/75 mt-3 font-sans leading-relaxed">
				{t(`${regionKey}.description`)}
			</p>
			<ul className="border-sapphire-mist/25 mt-6 flex flex-col gap-3 border-t pt-6">
				{projects.map((project) => (
					<li key={project.id}>
						<Link
							href={`#${project.id}`}
							className="group text-sapphire-deep hover:text-champagne-deep inline-flex items-center gap-2 font-serif text-lg font-medium transition-colors duration-300"
						>
							{tHeritage(`milestones.${project.id}.title`)}
							<ArrowRight className="text-champagne-deep h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
						</Link>
					</li>
				))}
			</ul>
		</RevealOnView>
	);
}

/** ProjectsRegionsMap (geographic chapter linking to timeline anchors). */
export function ProjectsRegionsMap() {
	const t = useTranslations("pages.projects.regions");

	return (
		<section
			className={cn(
				"bg-linen-warm relative overflow-x-hidden",
				/* Partial overlap: transition visible, heading clears the fade with room below heritage */
				"-mt-16 sm:-mt-24",
			)}
			aria-label={t("ariaLabel")}
		>
			<SectionBlendOverlay
				edge="bottom"
				gradient={SECTION_BLEND_GRADIENTS.linenWarmToSapphireDeep}
				heightClassName={SECTION_BLEND_HEIGHT_COMPACT_MINOR}
			/>

			<VietnamOutlineDecor className="absolute top-24 right-6 z-[2] hidden h-48 w-28 opacity-80 sm:top-28 lg:top-32 lg:block xl:right-12" />

			<div
				className={cn(
					"relative z-10 mx-auto max-w-6xl px-6 lg:px-12",
					SECTION_BLEND_CONTENT_PAD_AFTER_MAJOR,
					SECTION_BLEND_CONTENT_PAD_MINOR,
				)}
			>
				<div className="mb-10 text-center lg:mb-12">
					<RevealOnView>
						<span className="text-label text-champagne-deep font-sans font-medium tracking-widest uppercase">
							{t("label")}
						</span>
					</RevealOnView>
					<RevealOnView className="mt-3">
						<Text
							variant="h2"
							as="h2"
							className="!text-sapphire-deep font-serif font-medium"
						>
							{t("heading")}
						</Text>
					</RevealOnView>
				</div>

				<div
					className={cn(
						"grid gap-12 lg:grid-cols-3 lg:gap-8",
						"border-sapphire-mist/35 border-t pt-12",
					)}
				>
					{PROJECT_REGIONS.map((region) => (
						<RegionColumn key={region} region={region} />
					))}
				</div>
			</div>
		</section>
	);
}
