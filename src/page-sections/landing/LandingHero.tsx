"use client";

import { useTranslations } from "next-intl";
import { CinematicHero } from "@/components/common";
import { Button } from "@/components/ui";
import { MEDIA_PATHS } from "@/constants/media";
import { ROUTES } from "@/constants/routes";

/** LandingHero (background video expands to fill viewport on scroll) */
export function LandingHero({ isMobileSSR }: { isMobileSSR?: boolean }) {
	const t = useTranslations("landing.hero");

	return (
		<CinematicHero
			isDesktopSSR={!isMobileSSR}
			videoSrc={MEDIA_PATHS.video.hero}
			posterSrc={MEDIA_PATHS.images.landing.heroPoster}
			posterAlt={t("titleLine1")}
			eyebrow={t("label")}
			eyebrowVariant="hero-pill"
			titleLine1={t("titleLine1")}
			titleLine2={t("titleLine2")}
			description={
				<>
					{t("descriptionLine1")}
					<br />
					{t("descriptionLine2")}
				</>
			}
			scrollLabel={t("scroll")}
			fadeContentOnScroll
			bottomBlend={false}
			childrenClassName="mt-10 flex flex-col gap-4 sm:flex-row"
		>
			<Button href={ROUTES.projects} size="lg">
				{t("primaryCta")}
			</Button>
			<Button href={ROUTES.products} variant="secondary" size="lg">
				{t("secondaryCta")}
			</Button>
		</CinematicHero>
	);
}
