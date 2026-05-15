"use client";

import { useEffect } from "react";
import Lenis from "lenis";

interface SmoothScrollProviderProps {
	children: React.ReactNode;
}

/**
 * SmoothScrollProvider — Wraps the page in Lenis smooth scroll.
 *
 * Uses an expo-out easing for a buttery, premium feel.
 * All Framer Motion useScroll hooks continue to work correctly
 * since Lenis operates through native scroll position.
 */
if (typeof window !== "undefined") {
	const originalWarn = console.warn;
	console.warn = (...args) => {
		if (
			args.length > 0 &&
			typeof args[0] === "string" &&
			(args[0].includes("THREE.Clock: This module has been deprecated") ||
				args[0].includes("Please ensure that the container has a non-static position") ||
				args[0].includes("THREE.WebGLRenderer: Context Lost"))
		) {
			return;
		}
		originalWarn(...args);
	};
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.3,
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2,
			infinite: false,
		});

		let rafId: number;

		function raf(time: number) {
			lenis.raf(time);
			rafId = requestAnimationFrame(raf);
		}

		rafId = requestAnimationFrame(raf);

		return () => {
			cancelAnimationFrame(rafId);
			lenis.destroy();
		};
	}, []);

	return <>{children}</>;
}
