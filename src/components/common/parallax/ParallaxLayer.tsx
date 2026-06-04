"use client";

import { ScrollParallax, type ScrollParallaxProps } from "./ScrollParallax";

type ParallaxLayerProps = ScrollParallaxProps & { withScrollFade?: boolean };

/** Decor or media layer with scroll-linked vertical parallax. */
export function ParallaxLayer({
	rangePx,
	invert,
	fadeIn,
	className,
	children,
}: ParallaxLayerProps) {
	return (
		<ScrollParallax rangePx={rangePx} invert={invert} fadeIn={fadeIn} className={className}>
			{children}
		</ScrollParallax>
	);
}
