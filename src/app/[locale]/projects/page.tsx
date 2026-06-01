import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface ProjectsPageProps {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "meta.projects" });

	return {
		title: t("title"),
		description: t("description"),
	};
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations({ locale, namespace: "pages.projects" });

	return (
		<main>
			<section className="bg-sapphire-deep flex min-h-screen items-center justify-center px-6">
				<h1 className="text-display-lg text-linen font-serif">{t("heading")}</h1>
			</section>
		</main>
	);
}
