"use client";

import dynamic from "next/dynamic";
import { useLenisResizeOnMount } from "@/hooks/useLenisResizeOnMount";
import { ProjectsCinematicHero } from "@/page-sections/projects/ProjectsCinematicHero";
import { ProjectsPrologue } from "@/page-sections/projects/ProjectsPrologue";
import { ProjectsRegionsMap } from "@/page-sections/projects/ProjectsRegionsMap";
import { ProjectsClientStrip } from "@/page-sections/projects/ProjectsClientStrip";
import { ProjectsCta } from "@/page-sections/projects/ProjectsCta";

const ProjectsHeritage = dynamic(() =>
	import("@/page-sections/projects/ProjectsHeritage").then((m) => ({
		default: m.ProjectsHeritage,
	})),
);

/** Client shell — scroll narrative with code-split motion sections. */
export function ProjectsPageContent() {
	useLenisResizeOnMount();

	return (
		<>
			<ProjectsCinematicHero />
			<ProjectsPrologue />
			<ProjectsHeritage />
			<ProjectsRegionsMap />
			<ProjectsClientStrip />
			<ProjectsCta />
		</>
	);
}
