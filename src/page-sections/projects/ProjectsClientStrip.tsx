"use client";

import { useTranslations } from "next-intl";
import {
	ClientRosterGrid,
	ParallaxSection,
	SectionContainer,
	SectionHeader,
} from "@/components/common";
import { PROJECTS } from "@/constants/projects";
import {
	SECTION_BLEND_CONTENT_PAD_AFTER_MINOR,
	SECTION_BLEND_OVERLAP_AFTER_MINOR,
} from "@/lib/section-blend-gradients";
import { cn } from "@/lib/cn";

/** ProjectsClientStrip (developer and brand names from featured milestones). */
export function ProjectsClientStrip() {
	const t = useTranslations("pages.projects.clients");

	return (
		<ParallaxSection
			className={cn(
				"bg-sapphire-deep relative overflow-x-hidden",
				SECTION_BLEND_OVERLAP_AFTER_MINOR,
				SECTION_BLEND_CONTENT_PAD_AFTER_MINOR,
			)}
			aria-label={t("ariaLabel")}
		>
			<SectionContainer width="wide" className="relative z-10 text-center">
				<SectionHeader
					label={t("label")}
					heading={t("heading")}
					headingAs="h2"
					headingVariant="h3"
					align="center"
					italic
					className="mb-0"
				/>
			</SectionContainer>

			<SectionContainer className="relative z-10 mt-10 max-w-6xl">
				<ClientRosterGrid
					items={PROJECTS.map((project) => ({
						id: project.id,
						name: project.clientBrand,
					}))}
					columns={{ sm: 3 }}
					cellTone="deep"
					staggerBase={0.04}
					staggerStep={0.05}
				/>
			</SectionContainer>
		</ParallaxSection>
	);
}
