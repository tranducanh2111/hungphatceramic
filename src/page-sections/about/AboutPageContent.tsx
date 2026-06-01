"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useLenisControls } from "@/components/common";
import { AboutHero } from "@/page-sections/about/AboutHero";
import { AboutOrigin } from "@/page-sections/about/AboutOrigin";

const AboutHeritage = dynamic(
	() => import("@/page-sections/about/AboutHeritage").then((m) => ({ default: m.AboutHeritage })),
	{ ssr: false },
);
const AboutCraft = dynamic(
	() => import("@/page-sections/about/AboutCraft").then((m) => ({ default: m.AboutCraft })),
	{ ssr: false },
);
const AboutCapabilities = dynamic(
	() =>
		import("@/page-sections/about/AboutCapabilities").then((m) => ({
			default: m.AboutCapabilities,
		})),
	{ ssr: false },
);
const AboutValues = dynamic(
	() => import("@/page-sections/about/AboutValues").then((m) => ({ default: m.AboutValues })),
	{ ssr: false },
);
const AboutClients = dynamic(
	() => import("@/page-sections/about/AboutClients").then((m) => ({ default: m.AboutClients })),
	{ ssr: false },
);
const AboutCta = dynamic(
	() => import("@/page-sections/about/AboutCta").then((m) => ({ default: m.AboutCta })),
	{ ssr: false },
);

/** Re-measure Lenis after code-split sections mount and change document height. */
function useLenisResizeOnAboutMount() {
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

/** Client shell — below-fold sections code-split without SSR. */
export function AboutPageContent() {
	useLenisResizeOnAboutMount();

	return (
		<>
			<AboutHero />
			<AboutOrigin />
			<AboutHeritage />
			<AboutCraft />
			<AboutCapabilities />
			<AboutValues />
			<AboutClients />
			<AboutCta />
		</>
	);
}
