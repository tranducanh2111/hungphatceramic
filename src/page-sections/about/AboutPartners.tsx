"use client";

import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { ParallaxLayer, ParallaxSection, RevealOnView } from "@/components/common";
import { PARTNER_ROSTER } from "@/constants/about";

export function AboutPartners() {
	const t = useTranslations("pages.about.partners");

	return (
		<ParallaxSection
			className="bg-sapphire-deep relative overflow-hidden py-24 lg:py-32"
			aria-label={t("ariaLabel")}
		>
			<ParallaxLayer rangePx={30} className="absolute inset-0">
				<svg
					className="text-champagne h-full w-full opacity-[0.03]"
					xmlns="http://www.w3.org/2000/svg"
				>
					<defs>
						<pattern
							id="ceramic-hex"
							width="60"
							height="103.92"
							patternUnits="userSpaceOnUse"
							patternTransform="scale(1)"
						>
							<path
								d="M30 0L60 17.32v34.64L30 69.28L0 51.96V17.32zM0 51.96l30 17.32v34.64l-30 17.32l-30-17.32v-34.64zM60 51.96l30 17.32v34.64l-30 17.32L60 103.92v-34.64z"
								fill="none"
								stroke="currentColor"
								strokeWidth="1"
							/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#ceramic-hex)" />
				</svg>
			</ParallaxLayer>

			<div className="relative mx-auto max-w-7xl px-6 lg:px-12">
				<div className="mb-16 text-center">
					<RevealOnView>
						<span className="text-label text-champagne font-sans tracking-widest uppercase">
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

				<div className="mx-auto flex flex-row items-center justify-center lg:gap-16 gap-6">
					{PARTNER_ROSTER.map((partner, index) => (
						<RevealOnView
							key={partner.id}
							delay={0.1 + index * 0.1}
							className="group opacity-60 transition-all duration-500 hover:scale-105 hover:opacity-100"
						>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={`/assets/partners/${partner.id}.png`}
								alt={`${partner.name} logo`}
								className="h-12 w-auto object-contain drop-shadow-md sm:h-16 lg:h-24"
							/>
						</RevealOnView>
					))}
				</div>
			</div>
		</ParallaxSection>
	);
}