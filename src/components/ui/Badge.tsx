import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ClassNameProp } from "@/types";

type BadgeVariant = "outline" | "glass" | "hero";

interface BadgeProps extends ClassNameProp, HTMLAttributes<HTMLSpanElement> {
	children: ReactNode;
	variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
	outline:
		"rounded-full border border-champagne/28 bg-sapphire-deep/45 px-3 py-1.5 font-sans tracking-[0.14em] text-champagne uppercase backdrop-blur-md backdrop-saturate-150",
	glass:
		"rounded-full border border-white/10 bg-sapphire-deep/28 px-4 py-2 font-sans tracking-widest text-champagne uppercase backdrop-blur-md backdrop-saturate-150",
	hero:
		"inline-block rounded-full border border-champagne/25 bg-champagne/6 px-5 py-2 font-sans tracking-widest text-champagne uppercase backdrop-blur-sm",
};

/** Champagne pill label for years, collections, and hero badges. */
export function Badge({
	children,
	variant = "outline",
	className,
	...rest
}: BadgeProps) {
	return (
		<span className={cn("text-footnote shrink-0", VARIANT_STYLES[variant], className)} {...rest}>
			{children}
		</span>
	);
}
