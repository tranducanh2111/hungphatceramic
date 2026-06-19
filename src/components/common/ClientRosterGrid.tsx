"use client";

import { RevealOnView } from "./RevealOnView";
import { cn } from "@/lib/cn";
import type { ClassNameProp } from "@/types";

export interface ClientRosterItem {
	id: string;
	name: string;
}

interface ClientRosterGridProps extends ClassNameProp {
	items: ClientRosterItem[];
	columns?: { sm: number; lg?: number };
	cellTone?: "ocean" | "deep";
	staggerBase?: number;
	staggerStep?: number;
}

const COLUMN_STYLES: Record<string, string> = {
	"2-3": "grid-cols-2 sm:grid-cols-3",
	"2-3-4": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
};

const CELL_TONE_STYLES = {
	ocean: "bg-sapphire-ocean hover:bg-sapphire-deep/60",
	deep: "bg-sapphire-deep hover:bg-sapphire-ocean/80",
} as const;

const CELL_TEXT_STYLES = {
	ocean: "text-linen/30 group-hover:text-champagne/80",
	deep: "text-linen/35 group-hover:text-champagne/85",
} as const;

/** Developer / brand name grid with champagne gap lines (champagne gap lines). */
export function ClientRosterGrid({
	items,
	columns = { sm: 3, lg: 4 },
	cellTone = "ocean",
	staggerBase = 0.05,
	staggerStep = 0.06,
	className,
}: ClientRosterGridProps) {
	const columnKey = columns.lg ? "2-3-4" : "2-3";

	return (
		<div className={cn("border-champagne/20 border", className)}>
			<div className={cn("bg-champagne/10 grid gap-px", COLUMN_STYLES[columnKey])}>
				{items.map((item, index) => (
					<RevealOnView
						key={item.id}
						delay={staggerBase + index * staggerStep}
						className={cn(
							"group flex items-center justify-center px-6 py-10 transition-colors duration-300",
							CELL_TONE_STYLES[cellTone],
							cellTone === "deep" && "px-4 py-8",
						)}
					>
						<span
							className={cn(
								"text-label text-center font-sans font-medium tracking-widest uppercase transition-colors duration-300",
								CELL_TEXT_STYLES[cellTone],
							)}
						>
							{item.name}
						</span>
					</RevealOnView>
				))}
			</div>
		</div>
	);
}
