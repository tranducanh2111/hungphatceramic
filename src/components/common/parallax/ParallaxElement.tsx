"use client";

import { ScrollParallax, type ScrollParallaxProps } from "./ScrollParallax";

/** Inline element with scroll-linked vertical parallax. */
export function ParallaxElement(props: ScrollParallaxProps) {
	return <ScrollParallax {...props} />;
}
