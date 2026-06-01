"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useLenisControls } from "@/components/common";
import { LandingHero } from "@/page-sections/landing/LandingHero";
import { LandingBrandStatement } from "@/page-sections/landing/LandingBrandStatement";

const LandingProjects = dynamic(
	() => import("@/page-sections/landing/LandingProjects").then((m) => ({ default: m.LandingProjects })),
	{ ssr: false },
);
const LandingMaterials = dynamic(
	() =>
		import("@/page-sections/landing/LandingMaterials").then((m) => ({
			default: m.LandingMaterials,
		})),
	{ ssr: false },
);
const LandingStats = dynamic(
	() => import("@/page-sections/landing/LandingStats").then((m) => ({ default: m.LandingStats })),
	{ ssr: false },
);
const LandingProcess = dynamic(
	() => import("@/page-sections/landing/LandingProcess").then((m) => ({ default: m.LandingProcess })),
	{ ssr: false },
);
const LandingTestimonials = dynamic(
	() =>
		import("@/page-sections/landing/LandingTestimonials").then((m) => ({
			default: m.LandingTestimonials,
		})),
	{ ssr: false },
);
const LandingVisualStory = dynamic(
	() =>
		import("@/page-sections/landing/LandingVisualStory").then((m) => ({
			default: m.LandingVisualStory,
		})),
	{ ssr: false },
);
const LandingCta = dynamic(
	() => import("@/page-sections/landing/LandingCta").then((m) => ({ default: m.LandingCta })),
	{ ssr: false },
);

/** Re-measure Lenis after code-split sections mount and change document height. */
function useLenisResizeOnLandingMount() {
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

/** Client shell — hero + brand statement sync; below-fold sections code-split. */
export function LandingPageContent() {
	useLenisResizeOnLandingMount();

	return (
		<>
			<LandingHero />
			<LandingBrandStatement />
			<LandingProjects />
			<LandingMaterials />
			<LandingStats />
			<LandingProcess />
			<LandingTestimonials />
			<LandingVisualStory />
			<LandingCta />
		</>
	);
}
