"use client";

import { useTranslations } from "next-intl";
import {
	BlueprintLine,
	ClientRosterGrid,
	ParallaxLayer,
	ParallaxSection,
	SectionContainer,
	SectionHeader,
} from "@/components/common";
import { CLIENT_ROSTER } from "@/constants/about";
import { ABOUT_SECTION_IDS } from "@/constants/about-sections";

export function AboutClients() {
	const t = useTranslations("pages.about.clients");

	return (
		<ParallaxSection
			id={ABOUT_SECTION_IDS.clients}
			className="bg-sapphire-ocean relative scroll-mt-28 overflow-hidden py-24 lg:py-32"
			aria-label={t("ariaLabel")}
		>
			<ParallaxLayer rangePx={45} className="absolute inset-0">
				<BlueprintLine variant="grid" className="h-full w-full opacity-[0.07]" />
			</ParallaxLayer>

			<SectionContainer>
				<SectionHeader
					label={t("label")}
					heading={t("heading")}
					align="center"
					italic
					className="mb-12"
				/>

				<ClientRosterGrid
					items={CLIENT_ROSTER.map((client) => ({
						id: client.id,
						name: client.name,
					}))}
					cellTone="ocean"
				/>
			</SectionContainer>

			<div
				className="to-sapphire-deep pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent sm:h-36"
				aria-hidden="true"
			/>
		</ParallaxSection>
	);
}
