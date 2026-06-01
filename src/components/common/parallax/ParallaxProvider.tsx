"use client";

import type { MotionValue } from "framer-motion";
import type { ReactNode } from "react";

interface ParallaxProviderProps {
	children: ReactNode;
	/** AboutCraft beat crossfades — parallax layers use CSS; this is a passthrough only. */
	scrollYProgress?: MotionValue<number>;
}

/** Groups Craft scroll-story children; does not register extra scroll listeners. */
export function ParallaxProvider({ children }: ParallaxProviderProps) {
	return <>{children}</>;
}
