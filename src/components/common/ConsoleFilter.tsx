"use client";

import { useEffect } from "react";

/**
 * ConsoleFilter (suppresses known, harmless warnings from external libraries).
 * Specifically filters out the THREE.Clock deprecation warning from @react-three/fiber
 * since it's an internal library detail and clutters the console.
 */
export function ConsoleFilter() {
	useEffect(() => {
		const originalWarn = console.warn;

		console.warn = (...args) => {
			if (
				args.length > 0 &&
				typeof args[0] === "string" &&
				(args[0].includes("THREE.Clock: This module has been deprecated") ||
					args[0].includes("Please ensure that the container has a non-static position"))
			) {
				// Suppress specific harmless warnings
				return;
			}
			originalWarn(...args);
		};

		return () => {
			console.warn = originalWarn;
		};
	}, []);

	return null;
}
