import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ClassNameProp } from "@/types";

interface EyebrowProps extends ClassNameProp, HTMLAttributes<HTMLSpanElement> {
	children: ReactNode;
}

/** Section pre-header label (champagne uppercase tracking). */
export function Eyebrow({ children, className, ...rest }: EyebrowProps) {
	return (
		<span
			className={cn(
				"text-label text-champagne font-sans tracking-widest uppercase",
				className,
			)}
			{...rest}
		>
			{children}
		</span>
	);
}
