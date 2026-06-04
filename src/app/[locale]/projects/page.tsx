import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageMediaPreload } from "@/components/media";
import { MEDIA_PATHS } from "@/constants/media";
import { ProjectsPageContent } from "@/page-sections/projects/ProjectsPageContent";

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

	return (
		<main>
			<PageMediaPreload
				imagePaths={[
					MEDIA_PATHS.images.featuredProjects.empireCity,
					MEDIA_PATHS.images.featuredProjects.ramadaHaLongBay,
				]}
			/>
			<ProjectsPageContent />
		</main>
	);
}
