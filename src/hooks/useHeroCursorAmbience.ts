"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";

interface CursorQuickToHandlers {
	setGlowX: (value: number) => void;
	setGlowY: (value: number) => void;
	setGlowOpacity: (value: number) => void;
	setContentX: (value: number) => void;
}

interface UseHeroCursorAmbienceOptions {
	enabled: boolean;
	pinRef: React.RefObject<HTMLDivElement | null>;
	coordinateRef?: React.RefObject<HTMLElement | null>;
	cursorGlowRef: React.RefObject<HTMLDivElement | null>;
	contentRef: React.RefObject<HTMLDivElement | null>;
	mouseRef: React.RefObject<{ x: number; y: number }>;
	scrollProgressRef: React.RefObject<number>;
	introCompleteRef: React.RefObject<boolean>;
}

/** Subtle spotlight + copy parallax for the landing hero (desktop pointer only). */
export function useHeroCursorAmbience({
	enabled,
	pinRef,
	coordinateRef,
	cursorGlowRef,
	contentRef,
	mouseRef,
	scrollProgressRef,
	introCompleteRef,
}: UseHeroCursorAmbienceOptions) {
	const quickToRef = useRef<CursorQuickToHandlers | null>(null);

	useEffect(() => {
		if (!enabled) {
			quickToRef.current = null;
			return;
		}

		registerGsapPlugins();

		const glow = cursorGlowRef.current;
		const content = contentRef.current;
		if (!glow || !content) {
			return;
		}

		gsap.set(glow, { opacity: 0, x: 0, y: 0, force3D: true });
		gsap.set(content, { x: 0, force3D: true });

		quickToRef.current = {
			setGlowX: gsap.quickTo(glow, "x", { duration: 0.85, ease: "power3.out" }),
			setGlowY: gsap.quickTo(glow, "y", { duration: 0.85, ease: "power3.out" }),
			setGlowOpacity: gsap.quickTo(glow, "opacity", { duration: 0.35, ease: "power2.out" }),
			setContentX: gsap.quickTo(content, "x", { duration: 0.7, ease: "power3.out" }),
		};

		return () => {
			gsap.set([glow, content], { clearProps: "transform,opacity" });
			quickToRef.current = null;
		};
	}, [enabled, contentRef, cursorGlowRef]);

	const resetVisualAmbience = useCallback(() => {
		const handlers = quickToRef.current;
		if (!handlers) {
			return;
		}
		handlers.setGlowOpacity(0);
		handlers.setContentX(0);
	}, []);

	const resetAmbience = useCallback(() => {
		mouseRef.current = { x: 0, y: 0 };
		resetVisualAmbience();
	}, [mouseRef, resetVisualAmbience]);

	const handlePointerMove = useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
			const measureTarget = coordinateRef?.current ?? pinRef.current;
			if (!measureTarget) {
				return;
			}

			const rect = measureTarget.getBoundingClientRect();
			const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			const normalizedY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
			mouseRef.current = { x: normalizedX, y: normalizedY };

			const pin = pinRef.current;
			if (!pin) {
				return;
			}
			if (!enabled || !introCompleteRef.current || (scrollProgressRef.current ?? 0) > 0.1) {
				return;
			}

			const handlers = quickToRef.current;
			if (!handlers) {
				return;
			}

			const pinRect = pin.getBoundingClientRect();
			const localX = event.clientX - pinRect.left;
			const localY = event.clientY - pinRect.top;

			handlers.setGlowX(localX);
			handlers.setGlowY(localY);
			handlers.setGlowOpacity(0.75);
			handlers.setContentX(normalizedX * 8);
		},
		[coordinateRef, enabled, introCompleteRef, mouseRef, pinRef, scrollProgressRef],
	);

	const handlePointerLeave = useCallback(() => {
		resetVisualAmbience();
	}, [resetVisualAmbience]);

	return { handlePointerMove, handlePointerLeave, resetAmbience };
}
