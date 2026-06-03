"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useLenisControls } from "@/components/common";
import { ProjectsHero } from "@/page-sections/projects/ProjectsHero";

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

/** Client shell — below-fold heritage timeline code-split without SSR. */
export function ProjectsPageContent() {
	useLenisResizeOnProjectsMount();

	return (
		<>
			<ProjectsHero />
			<ProjectsHeritage />
		</>
	);
}
