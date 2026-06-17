"use client";

import { useTranslations } from "next-intl";
import { ClosingCtaSection } from "@/components/common";
import { ROUTES } from "@/constants/routes";

export function AboutCta() {
	const t = useTranslations("pages.about.cta");

	return (
		<ClosingCtaSection
			titleLine1={t("titleLine1")}
			titleLine2={t("titleLine2")}
			description={t("description")}
			actions={[
				{
					label: t("primaryCta"),
					href: ROUTES.contact,
					variant: "outline",
					withShimmer: true,
				},
			]}
			actionsDelay={0.3}
		/>
	);
}
