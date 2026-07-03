"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useLenis } from "lenis/react";
import { CinematicHero } from "@/components/common";
import { Button } from "@/components/ui";
import { MEDIA_PATHS } from "@/constants/media";
import { ABOUT_SECTION_IDS } from "@/constants/about-sections";
import { scrollToAnchorElement } from "@/lib/scrollToAnchor";

export function AboutHero({ isMobileSSR }: { isMobileSSR?: boolean }) {
	const t = useTranslations("pages.about.hero");
	const lenis = useLenis();

	const handleActiveLocationsClick = useCallback(() => {
		scrollToAnchorElement(ABOUT_SECTION_IDS.activeLocations, lenis, { offset: -96 });
	}, [lenis]);

	return (
		<CinematicHero
			isDesktopSSR={!isMobileSSR}
			videoSrc={MEDIA_PATHS.video.hero}
			posterSrc={MEDIA_PATHS.images.landing.heroPoster}
			posterAlt={t("titleLine1")}
			titleLine1={t("titleLine1")}
			titleLine2={t("titleLine2")}
			description={t("description")}
			scrollLabel={t("scroll")}
			fadeContentOnScroll
			bottomBlend={false}
		>
			<Button
				variant="outline"
				size="lg"
				className="rounded-full"
				onClick={handleActiveLocationsClick}
			>
				{t("cta")}
			</Button>
		</CinematicHero>
	);
}
