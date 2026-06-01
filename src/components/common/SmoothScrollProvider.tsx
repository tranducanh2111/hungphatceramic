"use client";

import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
	type ReactNode,
} from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame } from "framer-motion";

interface SmoothScrollProviderProps {
	children: ReactNode;
}

interface LenisControls {
	resize: () => void;
}

const LenisContext = createContext<LenisControls | null>(null);

/** Call after dynamic layout changes (e.g. About page code-split sections). */
export function useLenisControls(): LenisControls | null {
	return useContext(LenisContext);
}

const LENIS_OPTIONS = {
	autoRaf: false,
	duration: 1.3,
	easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
	smoothWheel: true,
	wheelMultiplier: 1,
	touchMultiplier: 2,
	infinite: false,
} as const;

/**
 * Drives Lenis from Framer Motion's frame loop so scroll position and
 * useScroll stay on the same clock.
 */
function LenisFramerRaf({ lenisRef }: { lenisRef: React.RefObject<LenisRef | null> }) {
	useEffect(() => {
		function update(data: { timestamp: number }) {
			lenisRef.current?.lenis?.raf(data.timestamp);
		}

		frame.update(update, true);
		return () => cancelFrame(update);
	}, [lenisRef]);

	return null;
}

/**
 * SmoothScrollProvider — Lenis smooth scroll site-wide (including /about).
 * Exposes resize() for pages with late-hydrating scroll height.
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
	const lenisRef = useRef<LenisRef>(null);

	const lenisControls = useMemo<LenisControls>(
		() => ({
			resize: () => {
				lenisRef.current?.lenis?.resize();
			},
		}),
		[],
	);

	return (
		<LenisContext.Provider value={lenisControls}>
			<ReactLenis ref={lenisRef} root options={LENIS_OPTIONS}>
				<LenisFramerRaf lenisRef={lenisRef} />
				{children}
			</ReactLenis>
		</LenisContext.Provider>
	);
}
