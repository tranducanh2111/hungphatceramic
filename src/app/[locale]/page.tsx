import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageMediaPreload } from "@/components/media";
import { MEDIA_PATHS } from "@/constants/media";
import { LandingPageContent } from "@/page-sections/landing/LandingPageContent";

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
			<PageMediaPreload imagePaths={[MEDIA_PATHS.images.landing.heroPoster]} />
			<LandingPageContent />
		</main>
	);
}
