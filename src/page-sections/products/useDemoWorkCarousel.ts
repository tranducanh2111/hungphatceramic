import { useCallback, useEffect, useRef, useState } from "react";

/** Demo carousel index autoplay pause and lightbox state for install renders */
const DEMO_WORK_AUTO_ADVANCE_MS = 5000;

interface UseDemoWorkCarouselOptions {
	demoWorkCount: number;
	hasMultipleDemoWork: boolean;
}

interface UseDemoWorkCarouselResult {
	activeDemoIndex: number;
	isDemoLightboxOpen: boolean;
	goToPreviousDemo: () => void;
	goToNextDemo: () => void;
	goToDemoByIndex: (index: number) => void;
	openDemoLightbox: () => void;
	closeDemoLightbox: () => void;
	pauseDemoAutoPlay: () => void;
	resumeDemoAutoPlay: () => void;
}

export function useDemoWorkCarousel({
	demoWorkCount,
	hasMultipleDemoWork,
}: UseDemoWorkCarouselOptions): UseDemoWorkCarouselResult {
	const [activeDemoIndex, setActiveDemoIndex] = useState(0);
	const [isDemoAutoPlayPaused, setIsDemoAutoPlayPaused] = useState(false);
	const [isDemoLightboxOpen, setIsDemoLightboxOpen] = useState(false);

	const carouselPauseRef = useRef({
		isAutoPlayPaused: isDemoAutoPlayPaused,
		isLightboxOpen: isDemoLightboxOpen,
	});

	useEffect(() => {
		carouselPauseRef.current = {
			isAutoPlayPaused: isDemoAutoPlayPaused,
			isLightboxOpen: isDemoLightboxOpen,
		};
	}, [isDemoAutoPlayPaused, isDemoLightboxOpen]);

	const goToPreviousDemo = useCallback(() => {
		setActiveDemoIndex((previousIndex) => (previousIndex - 1 + demoWorkCount) % demoWorkCount);
	}, [demoWorkCount]);

	const goToNextDemo = useCallback(() => {
		setActiveDemoIndex((previousIndex) => (previousIndex + 1) % demoWorkCount);
	}, [demoWorkCount]);

	const goToDemoByIndex = useCallback((index: number) => {
		setActiveDemoIndex(index);
	}, []);

	const pauseDemoAutoPlay = useCallback(() => {
		setIsDemoAutoPlayPaused(true);
	}, []);

	const resumeDemoAutoPlay = useCallback(() => {
		setIsDemoAutoPlayPaused(false);
	}, []);

	const openDemoLightbox = useCallback(() => {
		setIsDemoLightboxOpen(true);
		setIsDemoAutoPlayPaused(true);
	}, []);

	const closeDemoLightbox = useCallback(() => {
		setIsDemoLightboxOpen(false);
		setIsDemoAutoPlayPaused(false);
	}, []);

	useEffect(() => {
		if (!hasMultipleDemoWork) {
			return;
		}

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (prefersReducedMotion.matches) {
			return;
		}

		const intervalId = window.setInterval(() => {
			const { isAutoPlayPaused, isLightboxOpen } = carouselPauseRef.current;
			if (isAutoPlayPaused || isLightboxOpen) {
				return;
			}

			setActiveDemoIndex((previousIndex) => (previousIndex + 1) % demoWorkCount);
		}, DEMO_WORK_AUTO_ADVANCE_MS);

		return () => window.clearInterval(intervalId);
	}, [activeDemoIndex, demoWorkCount, hasMultipleDemoWork]);

	return {
		activeDemoIndex,
		isDemoLightboxOpen,
		goToPreviousDemo,
		goToNextDemo,
		goToDemoByIndex,
		openDemoLightbox,
		closeDemoLightbox,
		pauseDemoAutoPlay,
		resumeDemoAutoPlay,
	};
}
