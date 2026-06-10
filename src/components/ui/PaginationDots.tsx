import { cn } from "@/lib/cn";
import type { ClassNameProp } from "@/types";

type PaginationDotsTone = "dark" | "light";

interface PaginationDotsProps extends ClassNameProp {
	count: number;
	activeIndex: number;
	onSelect: (index: number) => void;
	getAriaLabel: (index: number) => string;
	tone?: PaginationDotsTone;
}

const INACTIVE_DOT_STYLES: Record<PaginationDotsTone, string> = {
	dark: "w-1.5 bg-sapphire-mist hover:bg-champagne/60",
	light: "w-1.5 bg-linen/40 hover:bg-champagne/60",
};

/** Pill-style dot indicators for carousels and galleries. */
export function PaginationDots({
	count,
	activeIndex,
	onSelect,
	getAriaLabel,
	tone = "dark",
	className,
}: PaginationDotsProps) {
	return (
		<div className={cn("flex gap-2", className)}>
			{Array.from({ length: count }, (_, index) => (
				<button
					key={index}
					type="button"
					onClick={() => onSelect(index)}
					aria-label={getAriaLabel(index)}
					aria-current={index === activeIndex ? "true" : undefined}
					className={cn(
						"h-1.5 rounded-full transition-all duration-300",
						index === activeIndex ? "bg-champagne w-6" : INACTIVE_DOT_STYLES[tone],
					)}
				/>
			))}
		</div>
	);
}
