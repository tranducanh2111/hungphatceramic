"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useLenis } from "lenis/react";
import { useLenisResizeOnMount } from "@/hooks/useLenisResizeOnMount";
import { scrollToAnchorElement } from "@/lib/scrollToAnchor";
import { AboutHero } from "@/page-sections/about/AboutHero";
import { AboutOrigin } from "@/page-sections/about/AboutOrigin";
import { AboutPartners } from "@/page-sections/about/AboutPartners";

const AboutCraft = dynamic(() =>
	import("@/page-sections/about/AboutCraft").then((m) => ({ default: m.AboutCraft })),
);
const AboutCapabilities = dynamic(() =>
	import("@/page-sections/about/AboutCapabilities").then((m) => ({
		default: m.AboutCapabilities,
	})),
);
const AboutValues = dynamic(() =>
	import("@/page-sections/about/AboutValues").then((m) => ({ default: m.AboutValues })),
);
const AboutClients = dynamic(() =>
	import("@/page-sections/about/AboutClients").then((m) => ({ default: m.AboutClients })),
);
const AboutCta = dynamic(() =>
	import("@/page-sections/about/AboutCta").then((m) => ({ default: m.AboutCta })),
);

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

/** Client shell (below-fold sections code-split without SSR). */
export function AboutPageContent() {
	useLenisResizeOnMount();
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
