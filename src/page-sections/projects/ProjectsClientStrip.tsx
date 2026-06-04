"use client";

import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { ParallaxSection, RevealOnView } from "@/components/common";
import { PROJECTS } from "@/constants/projects";
import {
	SECTION_BLEND_CONTENT_PAD_AFTER_MINOR,
	SECTION_BLEND_OVERLAP_AFTER_MINOR,
} from "@/lib/section-blend-gradients";
import { cn } from "@/lib/cn";

/**
 * ProjectsClientStrip — Developer and brand names from featured milestones.
 */
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
			<div className="relative z-10 mx-auto max-w-5xl px-6 text-center lg:px-12">
				<RevealOnView>
					<span className="text-label font-sans tracking-widest text-champagne uppercase">
						{t("label")}
					</span>
				</RevealOnView>
				<RevealOnView className="mt-4">
					<Text variant="h3" as="h2" className="text-linen/70 font-serif font-light italic">
						{t("heading")}
					</Text>
				</RevealOnView>
			</div>

			<div className="relative z-10 mx-auto mt-10 max-w-6xl px-6 lg:px-12">
				<div className="border-champagne/20 border">
					<div className="grid grid-cols-2 gap-px bg-champagne/10 sm:grid-cols-3">
						{PROJECTS.map((project, index) => (
							<RevealOnView
								key={project.id}
								delay={0.04 + index * 0.05}
								className="group bg-sapphire-deep hover:bg-sapphire-ocean/80 flex items-center justify-center px-4 py-8 transition-colors duration-300"
							>
								<span className="text-label text-center font-sans font-medium tracking-widest text-linen/35 uppercase transition-colors duration-300 group-hover:text-champagne/85">
									{project.clientBrand}
								</span>
							</RevealOnView>
						))}
					</div>
				</div>
			</div>
		</ParallaxSection>
	);
}