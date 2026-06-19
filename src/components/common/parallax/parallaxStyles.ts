import { cn } from "@/lib/cn";
import type { CSSProperties, ReactNode } from "react";

export interface ParallaxRangeProps {
	rangePx?: number;
	className?: string;
	children?: ReactNode;
	/** Opposite scroll direction (pairs image/text depth in Heritage & Values). */
	invert?: boolean;
	/** Scroll-linked opacity 0→1 while the element enters the viewport. */
	fadeIn?: boolean;
	/** Reserved for Craft (no-op, beat fades stay on Framer scroll story). */
	withScrollFade?: boolean;
}

export const DEFAULT_PARALLAX_RANGE_PX = 40;

export function parallaxRangeStyle(rangePx: number): CSSProperties {
	return { "--parallax-range": `${rangePx}px` } as CSSProperties;
}

export function parallaxMotionClassName(className?: string): string {
	return cn("parallax-y-scroll transform-gpu", className);
}
