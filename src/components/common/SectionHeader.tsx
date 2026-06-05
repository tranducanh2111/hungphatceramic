"use client";

import { Text } from "@/components/ui";
import { Eyebrow, DecorativeDivider } from "@/components/ui";
import { RevealOnView } from "./RevealOnView";
import { cn } from "@/lib/cn";
import type { ClassNameProp } from "@/types";

type SectionHeaderAlign = "left" | "center";
type SectionHeadingVariant = "h2" | "h3" | "display-lg";

interface SectionHeaderProps extends ClassNameProp {
	label: string;
	heading: string;
	headingAs?: "h2" | "h3";
	headingVariant?: SectionHeadingVariant;
	align?: SectionHeaderAlign;
	italic?: boolean;
	description?: string;
	showDivider?: boolean;
	labelDelay?: number;
	headingDelay?: number;
	descriptionDelay?: number;
}

/** Eyebrow + heading block with scroll reveal — used across about, projects, landing. */
export function SectionHeader({
	label,
	heading,
	headingAs = "h2",
	headingVariant = "h2",
	align = "left",
	italic = false,
	description,
	showDivider = false,
	labelDelay,
	headingDelay = 0.1,
	descriptionDelay = 0.15,
	className,
}: SectionHeaderProps) {
	const isCentered = align === "center";

	return (
		<div
			className={cn(
				isCentered ? "text-center" : "mb-16",
				!isCentered && "mb-12",
				className,
			)}
		>
			<RevealOnView delay={labelDelay}>
				<Eyebrow>{label}</Eyebrow>
			</RevealOnView>

			<RevealOnView
				className={cn("mt-3", isCentered ? "mx-auto max-w-2xl" : "max-w-xl")}
				delay={headingDelay}
			>
				<Text
					variant={headingVariant}
					as={headingAs}
					className={cn(
						"text-linen",
						italic && "font-serif font-light italic",
					)}
				>
					{heading}
				</Text>
			</RevealOnView>

			{description && (
				<RevealOnView
					className={cn("mt-4", isCentered && "mx-auto max-w-xl")}
					delay={descriptionDelay}
				>
					<Text variant="body-lg" className="text-linen/55">
						{description}
					</Text>
				</RevealOnView>
			)}

			{showDivider && <DecorativeDivider variant="centered" className="mt-6" />}
		</div>
	);
}
