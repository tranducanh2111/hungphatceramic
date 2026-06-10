import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ClassNameProp } from "@/types";

type IconButtonVariant = "carousel" | "gallery" | "galleryOverlay";

interface IconButtonProps
	extends ClassNameProp, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
	children: ReactNode;
	variant?: IconButtonVariant;
}

const VARIANT_STYLES: Record<IconButtonVariant, string> = {
	carousel:
		"flex h-10 w-10 items-center justify-center rounded-full border border-sapphire-mist text-linen/50 transition-all duration-300 hover:border-champagne hover:text-champagne",
	gallery:
		"flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-linen/20 bg-sapphire-deep/55 text-linen backdrop-blur-sm transition-colors hover:border-champagne/50 hover:text-champagne sm:h-11 sm:w-11",
	galleryOverlay:
		"flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-linen/25 bg-sapphire-deep/90 text-linen backdrop-blur-sm transition-colors hover:border-champagne/50 hover:text-champagne",
};

/** Round icon control for carousels and lightbox navigation. */
export function IconButton({
	children,
	variant = "carousel",
	className,
	type = "button",
	...rest
}: IconButtonProps) {
	return (
		<button type={type} className={cn(VARIANT_STYLES[variant], className)} {...rest}>
			{children}
		</button>
	);
}
