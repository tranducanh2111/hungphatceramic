"use client";

import { useTranslations } from "next-intl";
import { CinematicHero } from "@/components/common";
import { MEDIA_PATHS } from "@/constants/media";

/** ProjectsCinematicHero (full-viewport arrival with scroll-linked media reveal). */
export function ProjectsCinematicHero({ isMobileSSR }: { isMobileSSR?: boolean }) {
	const t = useTranslations("pages.projects.hero");

	return (
		<CinematicHero
			isDesktopSSR={!isMobileSSR}
			videoSrc={MEDIA_PATHS.video.hero}
			posterSrc={MEDIA_PATHS.images.landing.heroPoster}
			posterAlt={t("posterAlt")}
			eyebrow={t("label")}
			titleLine1={t("title")}
			titleLine2={t("titleEmphasis")}
			description={t("subtitle")}
			scrollLabel={t("scroll")}
			fadeContentOnScroll
			bottomBlend={false}
		/>
	);
}
