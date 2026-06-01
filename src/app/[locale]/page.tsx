import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LandingHero } from "@/page-sections/landing/LandingHero";
import { LandingBrandStatement } from "@/page-sections/landing/LandingBrandStatement";
import { LandingProjects } from "@/page-sections/landing/LandingProjects";
import { LandingMaterials } from "@/page-sections/landing/LandingMaterials";
import { LandingStats } from "@/page-sections/landing/LandingStats";
import { LandingProcess } from "@/page-sections/landing/LandingProcess";
import { LandingTestimonials } from "@/page-sections/landing/LandingTestimonials";
import { LandingVisualStory } from "@/page-sections/landing/LandingVisualStory";
import { LandingCta } from "@/page-sections/landing/LandingCta";

interface HomePageProps {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "meta.home" });

	return {
		title: t("title"),
		description: t("description"),
		openGraph: {
			title: t("ogTitle"),
			description: t("ogDescription"),
			url: "https://hungphatceramic.vn",
			siteName: t("siteName"),
			locale: t("ogLocale"),
			type: "website",
		},
	};
}

export default async function HomePage({ params }: HomePageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<main className="relative" style={{ position: "relative" }}>
			<LandingHero />
			<LandingBrandStatement />
			<LandingProjects />
			<LandingMaterials />
			<LandingStats />
			<LandingProcess />
			<LandingTestimonials />
			<LandingVisualStory />
			<LandingCta />
		</main>
	);
}
