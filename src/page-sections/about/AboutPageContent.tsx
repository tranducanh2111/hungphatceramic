"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useLenis } from "lenis/react";
import { useLenisControls } from "@/components/common";
import { scrollToAnchorElement } from "@/lib/scrollToAnchor";
import { AboutHero } from "@/page-sections/about/AboutHero";
import { AboutOrigin } from "@/page-sections/about/AboutOrigin";

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
const AboutPartners = dynamic(
	() => import("@/page-sections/about/AboutPartners").then((m) => ({ default: m.AboutPartners })),
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

/** Scroll to hash targets after navigation (e.g. footer “Our Story”). */
function useAboutHashScroll() {
	const lenis = useLenis();

	useEffect(() => {
		const rawHash = window.location.hash.replace(/^#/, "");
		if (!rawHash) {
			return;
		}

		const scrollToHash = () => scrollToAnchorElement(rawHash, lenis, { offset: -96 });

		requestAnimationFrame(() => {
			scrollToHash();
			requestAnimationFrame(scrollToHash);
		});

		// Code-split sections (e.g. Values / Active Locations) mount after first paint.
		const retryTimer = window.setTimeout(scrollToHash, 900);
		return () => window.clearTimeout(retryTimer);
	}, [lenis]);
}

/** Client shell — below-fold sections code-split without SSR. */
export function AboutPageContent() {
	useLenisResizeOnAboutMount();
	useAboutHashScroll();

	return (
		<>
			<AboutHero />
			<AboutOrigin />
			<AboutPartners />
			<AboutCraft />
			<AboutCapabilities />
			<AboutValues />
			<AboutClients />
			<AboutCta />
		</>
	);
}
