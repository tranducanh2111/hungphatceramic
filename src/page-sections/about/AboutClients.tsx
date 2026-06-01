"use client";

import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { BlueprintLine, ParallaxLayer, ParallaxSection, RevealOnView } from "@/components/common";
import { CLIENT_ROSTER } from "@/constants/about";

export function AboutClients() {
	const t = useTranslations("pages.about.clients");

	return (
		<ParallaxSection
			className="bg-sapphire-ocean relative overflow-hidden py-24 lg:py-32"
			aria-label={t("ariaLabel")}
		>
			<ParallaxLayer rangePx={45} className="absolute inset-0">
				<BlueprintLine variant="grid" className="h-full w-full opacity-[0.07]" />
			</ParallaxLayer>

			<div className="relative mx-auto max-w-7xl px-6 lg:px-12">
				<div className="mb-12 text-center">
					<RevealOnView>
						<span className="text-label font-sans tracking-widest text-champagne uppercase">
							{t("label")}
						</span>
					</RevealOnView>
					<RevealOnView className="mx-auto mt-3 max-w-2xl">
						<Text
							variant="h2"
							as="h2"
							className="text-linen font-serif font-light italic"
						>
							{t("heading")}
						</Text>
					</RevealOnView>
				</div>

				<div className="border-champagne/20 border">
					<div className="bg-champagne/10 grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-4">
						{CLIENT_ROSTER.map((client, index) => (
							<RevealOnView
								key={client.id}
								delay={0.05 + index * 0.06}
								className="group bg-sapphire-ocean hover:bg-sapphire-deep/60 flex items-center justify-center px-6 py-10 transition-colors duration-300"
							>
								<span className="text-label text-linen/30 group-hover:text-champagne/80 text-center font-sans font-medium tracking-widest uppercase transition-colors duration-300">
									{client.name}
								</span>
							</RevealOnView>
						))}
					</div>
				</div>
			</div>

			<div
				className="to-sapphire-deep pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent sm:h-36"
				aria-hidden="true"
			/>
		</ParallaxSection>
	);
}
