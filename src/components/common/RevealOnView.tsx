"use client";

import {
	createElement,
	type ComponentPropsWithoutRef,
	type ElementType,
	type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

interface RevealOnViewProps<T extends ElementType = "div"> {
	as?: T;
	className?: string;
	/** Stagger delay in seconds (maps to `animation-delay` attribute). */
	delay?: number;
	children?: ReactNode;
}

export function RevealOnView<T extends ElementType = "div">({
	as,
	className,
	delay,
	children,
	style,
	...rest
}: RevealOnViewProps<T> &
	Omit<ComponentPropsWithoutRef<T>, keyof RevealOnViewProps<T> | "style"> & {
		style?: React.CSSProperties;
	}) {
	const Component = as ?? "div";

	return createElement(
		Component,
		{
			className: cn("reveal-on-view", className),
			style: {
				...style,
				...(delay !== undefined ? { animationDelay: `${delay}s` } : {}),
			},
			...rest,
		},
		children,
	);
}
