"use client";

import { useTranslations } from "next-intl";
import { RevealOnView } from "@/components/common";
import { Text } from "@/components/ui";

/**
 * ProjectsHero — Page title (h1) for SEO; heritage timeline follows below.
 */
export function ProjectsHero() {
	const t = useTranslations("pages.projects");

	return (
		<section className="bg-sapphire-deep pt-32 pb-16 lg:pt-40 lg:pb-20">
			<div className="mx-auto max-w-6xl px-6 lg:px-12">
				<RevealOnView>
					<Text variant="display-lg" as="h1" className="text-linen">
						{t("heading")}
					</Text>
				</RevealOnView>
			</div>
		</section>
	);
}
