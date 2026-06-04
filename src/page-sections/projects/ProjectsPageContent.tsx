"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useLenisControls } from "@/components/common";
import { ProjectsCinematicHero } from "@/page-sections/projects/ProjectsCinematicHero";
import { ProjectsPrologue } from "@/page-sections/projects/ProjectsPrologue";
import { ProjectsRegionsMap } from "@/page-sections/projects/ProjectsRegionsMap";
import { ProjectsClientStrip } from "@/page-sections/projects/ProjectsClientStrip";
import { ProjectsCta } from "@/page-sections/projects/ProjectsCta";

const ProjectsHeritage = dynamic(
	() =>
		import("@/page-sections/projects/ProjectsHeritage").then((m) => ({
			default: m.ProjectsHeritage,
		})),
	{ ssr: false },
);

/** Re-measure Lenis after code-split sections mount and change document height. */
function useLenisResizeOnProjectsMount() {
	const lenisControls = useLenisControls();

	useEffect(() => {
		if (!lenisControls) return;

		const resizeLenis = () => lenisControls.resize();

		resizeLenis();

		const rafId = requestAnimationFrame(() => {
			resizeLenis();
			requestAnimationFrame(resizeLenis);
		});

		window.addEventListener("load", resizeLenis, { once: true });

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener("load", resizeLenis);
		};
	}, [lenisControls]);
}

/** Client shell — scroll narrative with code-split motion sections. */
export function ProjectsPageContent() {
	useLenisResizeOnProjectsMount();

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
