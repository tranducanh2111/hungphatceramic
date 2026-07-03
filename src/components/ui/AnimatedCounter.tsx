"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

export interface AnimatedCounterProps {
	value: number;
	suffix?: string;
	duration?: number;
	className?: string;
	/** Formats values ≥ 1000 as `Nk` while counting (e.g. 50000 → 50k). */
	formatThousandsAsK?: boolean;
	inViewAmount?: number;
}

function formatCount(value: number, formatThousandsAsK: boolean): string {
	if (formatThousandsAsK && value >= 1000) {
		return `${Math.floor(value / 1000)}k`;
	}
	return value.toString();
}

/** Scroll-triggered count-up for highlight stats (reusable across pages). */
export function AnimatedCounter({
	value,
	suffix = "",
	duration = 1800,
	className,
	formatThousandsAsK = false,
	inViewAmount = 0.5,
}: AnimatedCounterProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true, amount: inViewAmount });
	const prefersReducedMotion = usePrefersReducedMotion();
	const shouldAnimate = isInView && !prefersReducedMotion;
	const count = useCountUp(value, shouldAnimate, { duration });
	const displayValue = prefersReducedMotion && isInView ? value : count;
	return (
		<span ref={ref} className={cn("tabular-nums", className)}>
			{formatCount(displayValue, formatThousandsAsK)}
			{suffix}
		</span>
	);
}
