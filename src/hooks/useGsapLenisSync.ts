"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";
import { registerGsapPlugins, ScrollTrigger } from "@/lib/gsap";

/** Keeps ScrollTrigger in sync with Lenis smooth scroll (desktop). */
export function useGsapLenisSync(enabled = true): void {
	const lenis = useLenis();

	useEffect(() => {
		if (!enabled) {
			return;
		}

		registerGsapPlugins();

		if (!lenis) {
			return;
		}

		const handleScroll = () => {
			ScrollTrigger.update();
		};

		lenis.on("scroll", handleScroll);

		return () => {
			lenis.off("scroll", handleScroll);
		};
	}, [enabled, lenis]);
}
