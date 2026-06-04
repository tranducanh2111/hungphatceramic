import { cn } from "@/lib/cn";

interface SectionBlendOverlayProps {
	/** CSS `background-image` value (multi-stop linear-gradient). */
	gradient: string;
	edge: "top" | "bottom";
	className?: string;
	heightClassName?: string;
}

/**
 * Absolute section seam — multi-stop gradient for high-contrast background handoffs.
 */
export function SectionBlendOverlay({
	gradient,
	edge,
	className,
	heightClassName,
}: SectionBlendOverlayProps) {
	return (
		<div
			className={cn(
				"pointer-events-none absolute inset-x-0 z-[1]",
				edge === "top" ? "top-0" : "bottom-0",
				heightClassName,
				className,
			)}
			style={{ backgroundImage: gradient }}
			aria-hidden="true"
		/>
	);
}
