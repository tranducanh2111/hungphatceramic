"use client";

import { useTranslations } from "next-intl";
import { CinematicHero } from "@/components/common";
import { Button } from "@/components/ui";
import { CONTACT_SECTION_IDS } from "@/constants/contact";
import { MEDIA_PATHS } from "@/constants/media";

export function ContactHero({ isMobileSSR }: { isMobileSSR?: boolean }) {
	const t = useTranslations("pages.contact.hero");

	return (
		<CinematicHero
			isDesktopSSR={!isMobileSSR}
			videoSrc={MEDIA_PATHS.video.hero}
			posterSrc={MEDIA_PATHS.images.landing.heroPoster}
			posterAlt={t("titleLine1")}
			eyebrow={t("label")}
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
				href={`#${CONTACT_SECTION_IDS.inquiry}`}
			>
				{t("cta")}
			</Button>
		</CinematicHero>
	);
}
