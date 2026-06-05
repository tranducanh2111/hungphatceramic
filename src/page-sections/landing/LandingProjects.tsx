"use client";

import { useTranslations } from "next-intl";
import { Text, Button } from "@/components/ui";
import {
	FeaturedProjectCard,
	RevealOnView,
	SectionContainer,
} from "@/components/common";
import { Eyebrow } from "@/components/ui";
import { FEATURED_PROJECTS } from "@/constants/landing";
import { ROUTES } from "@/constants/routes";

/** LandingProjects — Portfolio preview showcasing 4 featured projects. */
export function LandingProjects() {
	const t = useTranslations("landing.projects");

	return (
		<section className="bg-sapphire-deep py-28 lg:py-36">
			<SectionContainer>
				<div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<RevealOnView>
							<Eyebrow>{t("label")}</Eyebrow>
						</RevealOnView>
						<RevealOnView delay={0.1}>
							<Text variant="display-lg" className="mt-3 text-linen">
								{t("heading")}
							</Text>
						</RevealOnView>
					</div>

					<RevealOnView delay={0.2}>
						<Button href={ROUTES.projects} variant="outline" size="md">
							{t("viewAll")}
						</Button>
					</RevealOnView>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					{FEATURED_PROJECTS.map((project, index) => {
						const itemNamespace = `items.${project.id}`;
						return (
							<FeaturedProjectCard
								key={project.id}
								index={index}
								content={{
									imageSrc: project.imageUrl,
									imageAlt: t(`${itemNamespace}.imageAlt`),
									title: t(`${itemNamespace}.title`),
									year: String(project.year),
									area: t(`${itemNamespace}.area`),
									location: t(`${itemNamespace}.location`),
								}}
							/>
						);
					})}
				</div>
			</SectionContainer>
		</section>
	);
}
