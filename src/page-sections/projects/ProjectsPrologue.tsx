"use client";

import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { BlueprintLine, ParallaxLayer, ParallaxSection, RevealOnView } from "@/components/common";

/**
 * ProjectsPrologue — Short narrative chapter before the heritage timeline.
 */
export function ProjectsPrologue() {
	const t = useTranslations("pages.projects.prologue");

	return (
		<ParallaxSection
			className="bg-sapphire-ocean relative overflow-hidden py-24 lg:py-32"
			aria-label={t("ariaLabel")}
		>
			<ParallaxLayer rangePx={40} className="absolute inset-0">
				<BlueprintLine variant="grid" className="h-full w-full opacity-[0.07]" />
			</ParallaxLayer>

			<div
				className="to-sapphire-deep pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent sm:h-36"
				aria-hidden="true"
			/>

			<div className="relative mx-auto max-w-3xl px-6 text-center lg:px-12">
				<RevealOnView>
					<span className="text-label font-sans tracking-widest text-champagne uppercase">
						{t("label")}
					</span>
				</RevealOnView>

				<RevealOnView className="mt-4">
					<Text variant="h2" as="h2" className="text-linen font-serif font-light italic">
						{t("heading")}
					</Text>
				</RevealOnView>

				<RevealOnView className="mt-6">
					<Text variant="body-lg" className="text-linen/55 leading-relaxed">
						{t("body")}
					</Text>
				</RevealOnView>

				<RevealOnView className="mt-10">
					<p className="text-body-sm font-sans tracking-wide text-linen/35">
						{t("statDevelopments")}
						<span className="text-champagne/40 mx-3" aria-hidden="true">
							·
						</span>
						{t("statRegions")}
						<span className="text-champagne/40 mx-3" aria-hidden="true">
							·
						</span>
						{t("statSpan")}
					</p>
				</RevealOnView>
			</div>
		</ParallaxSection>
	);
}
