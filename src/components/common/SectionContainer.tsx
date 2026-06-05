import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ClassNameProp } from "@/types";

type SectionContainerWidth = "default" | "narrow" | "wide" | "content";

const WIDTH_STYLES: Record<SectionContainerWidth, string> = {
	default: "mx-auto max-w-7xl px-6 lg:px-12",
	narrow: "mx-auto max-w-3xl px-6 text-center lg:px-12",
	wide: "mx-auto max-w-5xl px-6 lg:px-12",
	content: "mx-auto max-w-4xl px-6 lg:px-12",
};

interface SectionContainerProps extends ClassNameProp {
	children: ReactNode;
	width?: SectionContainerWidth;
}

/** Standard horizontal padding and max-width for page sections. */
export function SectionContainer({
	children,
	width = "default",
	className,
}: SectionContainerProps) {
	return <div className={cn(WIDTH_STYLES[width], className)}>{children}</div>;
}
