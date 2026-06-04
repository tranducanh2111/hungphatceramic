import { useEffect, useState } from "react";
import { SPIRAL_PRESETS, type SpiralGeometry } from "./constants";

export function useSpiralGeometry(isReducedMotion: boolean): SpiralGeometry | null {
	const [geometry, setGeometry] = useState<SpiralGeometry | null>(null);

	useEffect(() => {
		function resolveGeometry() {
			if (isReducedMotion || window.innerWidth < 768) {
				setGeometry(null);
				return;
			}

			setGeometry(window.innerWidth >= 1024 ? SPIRAL_PRESETS.lg : SPIRAL_PRESETS.md);
		}

		resolveGeometry();
		if (isReducedMotion) return;

		const mediumQuery = window.matchMedia("(min-width: 768px)");
		const largeQuery = window.matchMedia("(min-width: 1024px)");
		mediumQuery.addEventListener("change", resolveGeometry);
		largeQuery.addEventListener("change", resolveGeometry);

		return () => {
			mediumQuery.removeEventListener("change", resolveGeometry);
			largeQuery.removeEventListener("change", resolveGeometry);
		};
	}, [isReducedMotion]);

	return geometry;
}
