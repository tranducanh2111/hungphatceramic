"use client";

import dynamic from "next/dynamic";
import { isSpiralProjectsLayout } from "@/constants/landing-experiments";
import { LandingProjectsGrid } from "@/page-sections/landing/LandingProjectsGrid";

const LandingProjectsSpiral = dynamic(
	() =>
		import("@/page-sections/landing/LandingProjectsSpiral").then((module) => ({
			default: module.LandingProjectsSpiral,
		})),
	{ ssr: false },
);

/** LandingProjects (A/B switchable featured projects section, set NEXT_PUBLIC_LANDING_PROJECTS_LAYOUT=spiral to enable the chandelier scroll variant). */
export function LandingProjects() {
	if (isSpiralProjectsLayout) {
		return <LandingProjectsSpiral />;
	}

	return <LandingProjectsGrid />;
}
