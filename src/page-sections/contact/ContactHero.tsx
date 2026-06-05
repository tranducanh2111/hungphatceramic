"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useLenis } from "lenis/react";
import { CinematicHero } from "@/components/common";
import { Button } from "@/components/ui";
import { CONTACT_SECTION_IDS } from "@/constants/contact";
import { MEDIA_PATHS } from "@/constants/media";
import { scrollToAnchorElement } from "@/lib/scrollToAnchor";

export function ContactHero() {
	const t = useTranslations("pages.contact.hero");
	const lenis = useLenis();

	const handleInquiryClick = useCallback(() => {
		scrollToAnchorElement(CONTACT_SECTION_IDS.inquiry, lenis, { offset: -96 });
	}, [lenis]);

	return (
		<CinematicHero
			videoSrc={MEDIA_PATHS.video.hero}
			posterSrc={MEDIA_PATHS.images.landing.heroPoster}
			posterAlt={t("titleLine1")}
			eyebrow={t("label")}
			titleLine1={t("titleLine1")}
			titleLine2={t("titleLine2")}
			description={t("description")}
			scrollLabel={t("scroll")}
		>
			<Button
				variant="outline"
				size="lg"
				className="rounded-full"
				onClick={handleInquiryClick}
			>
				{t("cta")}
			</Button>
		</CinematicHero>
	);
}
