"use client";

import { useTranslations } from "next-intl";
import { Text, Button } from "@/components/ui";
import { ParallaxSection, RevealOnView } from "@/components/common";
import { ROUTES } from "@/constants/routes";

export function AboutCta() {
	const t = useTranslations("pages.about.cta");

	return (
		<ParallaxSection className="bg-sapphire-deep relative overflow-hidden py-20 lg:py-28">
			<div
				className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#1A3D5C_0%,#071A2B_65%)] opacity-60"
				aria-hidden="true"
			/>

			<div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
				<RevealOnView>
					<Text
						variant="display-lg"
						as="h2"
						className="lg:text-display-2xl text-linen font-serif font-light"
					>
						{t("titleLine1")}
						<br />
						<em className="text-champagne italic">{t("titleLine2")}</em>
					</Text>
				</RevealOnView>

				<RevealOnView className="mt-7">
					<Text variant="body-lg" className="text-linen/55">
						{t("description")}
					</Text>
				</RevealOnView>

				<RevealOnView delay={0.3} className="mt-12">
					<Button href={ROUTES.contact} variant="outline" size="lg">
						{t("primaryCta")}
					</Button>
				</RevealOnView>
			</div>
		</ParallaxSection>
	);
}
