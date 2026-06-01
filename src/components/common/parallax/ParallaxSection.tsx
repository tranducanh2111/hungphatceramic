"use client";

import { cn } from "@/lib/cn";
import type { ComponentProps } from "react";

export type ParallaxSectionProps = ComponentProps<"section">;

/** Scroll container for CSS `parallax-y-scroll` children (page scroll). */
export function ParallaxSection({ className, children, ...rest }: ParallaxSectionProps) {
	return (
		<section className={cn("relative", className)} {...rest}>
			{children}
		</section>
	);
}
