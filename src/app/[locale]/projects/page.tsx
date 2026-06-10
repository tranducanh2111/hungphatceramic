import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageMediaPreload } from "@/components/media";
import { MEDIA_PATHS } from "@/constants/media";
import { PROJECTS } from "@/constants/projects";
import { ProjectsPageContent } from "@/page-sections/projects/ProjectsPageContent";
import { buildAlternatesForLocale, buildOpenGraphForLocale, SITE_URL } from "@/constants/seo";

interface ProjectsPageProps {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "meta.projects" });
	const alternates = buildAlternatesForLocale("/projects", locale);

	return {
		title: t("title"),
		description: t("description"),
		alternates,
		openGraph: buildOpenGraphForLocale({
			title: t("title"),
			description: t("description"),
			url: alternates.canonical,
			ogLocale: locale === "vi" ? "vi_VN" : "en_US",
		}),
	};
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations({ locale, namespace: "meta.projects" });
	const tItems = await getTranslations({ locale, namespace: "landing.projects.items" });

	const alternates = buildAlternatesForLocale("/projects", locale);

	const collectionSchema = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: t("title"),
		description: t("description"),
		url: alternates.canonical,
		about: {
			"@type": "Thing",
			name: "Luxury interior design projects using porcelain and ceramic materials",
		},
		hasPart: PROJECTS.map((project) => {
			const projectTitle = tItems.has(`${project.id}.title`)
				? tItems(`${project.id}.title`)
				: project.id;

			return {
				"@type": "CreativeWork",
				name: projectTitle,
				locationCreated: {
					"@type": "Place",
					name: project.location,
				},
				image: `${SITE_URL}${project.imageUrl}`,
			};
		}),
	};

	const tNavbar = await getTranslations({ locale, namespace: "navbar.links" });
	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: tNavbar("home"),
				item: `${SITE_URL}/${locale}`,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: tNavbar("projects"),
				item: `${SITE_URL}/${locale}/projects`,
			},
		],
	};

	const schemas = [collectionSchema, breadcrumbSchema];

	return (
		<main>
			<PageMediaPreload
				imagePaths={[
					MEDIA_PATHS.images.featuredProjects.empireCity,
					MEDIA_PATHS.images.featuredProjects.ramadaHaLongBay,
				]}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
			/>
			<ProjectsPageContent />
		</main>
	);
}
