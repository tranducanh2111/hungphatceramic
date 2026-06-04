import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			"font-size": [
				{
					text: [
						"display-2xl",
						"display-xl",
						"display-lg",
						"h1",
						"h2",
						"h3",
						"h4",
						"h5",
						"h6",
						"body-lg",
						"body",
						"body-sm",
						"label",
						"label-sm",
						"footnote",
						"caption",
					],
				},
			],
			"text-color": [
				{
					text: [
						"sapphire-deep",
						"sapphire-ocean",
						"sapphire-mist",
						"sapphire-faint",
						"champagne",
						"champagne-light",
						"champagne-deep",
						"linen",
						"linen-warm",
						"linen-dark",
						"brand-bg",
						"brand-surface",
						"brand-border",
						"brand-accent",
						"brand-accent-hover",
						"brand-text-primary",
						"brand-text-secondary",
						"brand-text-muted",
						"brand-text-inverse",
					],
				},
			],
		},
	},
});

/**
 * Merges Tailwind CSS classes with conflict resolution.
 * Uses clsx for conditional classes, then customTwMerge to deduplicate Tailwind utilities.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-champagne", className)
 */
export function cn(...inputs: ClassValue[]): string {
	return customTwMerge(clsx(inputs));
}
