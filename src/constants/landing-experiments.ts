/** Homepage layout experiments — set via Vercel env for A/B tests. */
export const LANDING_PROJECTS_LAYOUTS = ["grid", "spiral"] as const;

export type LandingProjectsLayout = (typeof LANDING_PROJECTS_LAYOUTS)[number];

function resolveLandingProjectsLayout(): LandingProjectsLayout {
	const raw = process.env.NEXT_PUBLIC_LANDING_PROJECTS_LAYOUT?.trim().toLowerCase();
	return raw === "spiral" ? "spiral" : "grid";
}

export const LANDING_PROJECTS_LAYOUT = resolveLandingProjectsLayout();

export const isSpiralProjectsLayout = LANDING_PROJECTS_LAYOUT === "spiral";
