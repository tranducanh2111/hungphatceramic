"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { ParallaxLayer, ParallaxSection, RevealOnView } from "@/components/common";
import { PARTNER_ROSTER } from "@/constants/about";
import { ABOUT_SECTION_IDS } from "@/constants/about-sections";

/** Height-first sizing: wide logos (e.g. Guocera) are not shrunk by a narrow box width. */
const PARTNER_LOGO_HEIGHT_CLASS = "h-11 w-auto sm:h-12 lg:h-14";

/** Recolors raster partner marks to brand champagne; brightens on row hover. */
const PARTNER_LOGO_COLOR_CLASS =
	"partner-logo-champagne transition-[filter] duration-500 ease-out group-hover:partner-logo-champagne-hover";

export function AboutPartners() {
	const t = useTranslations("pages.about.partners");

	return (
		<ParallaxSection
			id={ABOUT_SECTION_IDS.partners}
			className="bg-sapphire-deep relative scroll-mt-28 overflow-hidden py-24 lg:py-32"
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

				<ul className="mx-auto flex list-none flex-nowrap items-center justify-center gap-8 p-0 sm:gap-12 lg:gap-16">
					{PARTNER_ROSTER.map((partner, index) => (
						<li key={partner.id} className="w-fit shrink-0">
							<RevealOnView
								delay={0.1 + index * 0.1}
								className="group block w-fit opacity-60 transition-all duration-500 hover:scale-105 hover:opacity-100"
							>
								<Image
									src={`/assets/partners/${partner.id}.png`}
									alt={`${partner.name} logo`}
									width={partner.imageWidth}
									height={partner.imageHeight}
									sizes="(max-width: 640px) 28vw, 200px"
									className={`${PARTNER_LOGO_HEIGHT_CLASS} ${PARTNER_LOGO_COLOR_CLASS} object-contain object-center`}
								/>
							</RevealOnView>
						</li>
					))}
				</ul>
			</div>
		</ParallaxSection>
	);
}
