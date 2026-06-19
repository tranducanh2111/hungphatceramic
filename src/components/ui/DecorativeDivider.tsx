import { cn } from "@/lib/cn";
import type { ClassNameProp } from "@/types";

type DecorativeDividerVariant = "centered" | "inline" | "gradient" | "section";

interface DecorativeDividerProps extends ClassNameProp {
	variant?: DecorativeDividerVariant;
}

const VARIANT_STYLES: Record<DecorativeDividerVariant, string> = {
	centered: "mx-auto mt-4 h-px w-16 bg-champagne/30",
	inline: "h-px w-8 bg-champagne/60",
	gradient: "h-px bg-gradient-to-r from-transparent via-champagne/30 to-transparent",
	section: "my-8 h-px w-16 bg-champagne",
};

/** Champagne horizontal rule (size variants for section headers and CTAs). */
export function DecorativeDivider({ variant = "centered", className }: DecorativeDividerProps) {
	return <div className={cn(VARIANT_STYLES[variant], className)} aria-hidden="true" />;
}
