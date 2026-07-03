"use client";

import { useEffect, useState } from "react";

interface UseCountUpOptions {
	duration?: number;
}

/** Eased count-up from 0 → target while `isActive` is true. */
export function useCountUp(
	target: number,
	isActive: boolean,
	{ duration = 1800 }: UseCountUpOptions = {},
): number {
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		if (!isActive) {
			return;
		}

		const startTime = performance.now();
		let rafId = 0;

		function tick(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easedProgress = 1 - Math.pow(1 - progress, 3);
			setDisplayValue(Math.floor(easedProgress * target));
			if (progress < 1) {
				rafId = requestAnimationFrame(tick);
			}
		}

		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
	}, [target, isActive, duration]);

	return displayValue;
}
