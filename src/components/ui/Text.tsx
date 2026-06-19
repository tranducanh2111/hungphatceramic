import { createElement } from "react";
import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Available typography size variants. */
type TextVariant =
	| "display-2xl"
	| "display-xl"
	| "display-lg"
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "body-lg"
	| "body"
	| "body-sm"
	| "label"
	| "label-sm"
	| "footnote"
	| "caption";

/** Semantic text element mapping (maps visual variants to their default HTML tags). */
const DEFAULT_TAG_MAP: Record<TextVariant, ElementType> = {
	"display-2xl": "h1",
	"display-xl": "h1",
	"display-lg": "h2",
	h1: "h1",
	h2: "h2",
	h3: "h3",
	h4: "h4",
	h5: "h5",
	h6: "h6",
	"body-lg": "p",
	body: "p",
	"body-sm": "p",
	label: "span",
	"label-sm": "span",
	footnote: "span",
	caption: "span",
};

interface TextProps extends HTMLAttributes<HTMLElement> {
	/** Visual size variant — determines font size, weight, and line height. */
	variant?: TextVariant;

	/** Override the rendered HTML element. Defaults based on variant. */
	as?: ElementType;

	/** Transform text to uppercase (useful for labels). */
	uppercase?: boolean;

	children: ReactNode;
	className?: string;
}

/**
 * Text (Unified typography component).
 *
 * Renders the correct HTML tag with design-system font sizing (uses createElement instead of JSX to avoid polymorphic tag type errors).
 * Pass `as` to override the default tag (e.g., render an h2 visually as h3).
 *
 * @example
 * <Text variant="h1">Section Title</Text>
 * <Text variant="label" uppercase>Category</Text>
 * <Text variant="body" as="span" className="text-champagne">Accent copy</Text>
 */
const VARIANT_CLASS_MAP: Record<TextVariant, string> = {
	"display-2xl": "text-display-2xl",
	"display-xl": "text-display-xl",
	"display-lg": "text-display-lg",
	h1: "text-h1",
	h2: "text-h2",
	h3: "text-h3",
	h4: "text-h4",
	h5: "text-h5",
	h6: "text-h6",
	"body-lg": "text-body-lg",
	body: "text-body",
	"body-sm": "text-body-sm",
	label: "text-label",
	"label-sm": "text-label-sm",
	footnote: "text-footnote",
	caption: "text-caption",
};

export function Text({
	variant = "body",
	as,
	uppercase = false,
	className,
	children,
	...rest
}: TextProps) {
	const Tag = as ?? DEFAULT_TAG_MAP[variant];
	const isHeading = variant.startsWith("display") || variant.startsWith("h");

	return createElement(
		Tag,
		{
			className: cn(
				VARIANT_CLASS_MAP[variant],
				isHeading ? "font-serif text-balance" : "font-sans",
				uppercase && "uppercase",
				className,
			),
			...rest,
		},
		children,
	);
}
