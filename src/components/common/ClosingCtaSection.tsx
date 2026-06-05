"use client";

import type { ReactNode } from "react";
import { Text, Button } from "@/components/ui";
import type { ButtonProps } from "@/components/ui";
import { ParallaxSection } from "./parallax";
import { RevealOnView } from "./RevealOnView";
import { CTA_RADIAL_CLASS } from "@/constants/hero";
import { cn } from "@/lib/cn";
import type { ClassNameProp } from "@/types";

export interface ClosingCtaAction {
	label: string;
	href: string;
	variant?: ButtonProps["variant"];
	size?: ButtonProps["size"];
}

interface ClosingCtaSectionProps extends ClassNameProp {
	titleLine1: string;
	titleLine2: string;
	description: string;
	actions: ClosingCtaAction[];
	footer?: ReactNode;
	actionsDelay?: number;
	/** Skip ParallaxSection shell — for landing CTA with custom background. */
	bare?: boolean;
}

/** Closing invitation block — shared by about, projects, and landing CTAs. */
export function ClosingCtaSection({
	titleLine1,
	titleLine2,
	description,
	actions,
	footer,
	actionsDelay = 0.2,
	bare = false,
	className,
}: ClosingCtaSectionProps) {
	const content = (
			<div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
				<RevealOnView>
					<Text
						variant="display-lg"
						as="h2"
						className="lg:text-display-2xl text-linen font-serif font-light"
					>
						{titleLine1}
						<br />
						<em className="text-champagne italic">{titleLine2}</em>
					</Text>
				</RevealOnView>

				<RevealOnView className="mt-7">
					<Text variant="body-lg" className="text-linen/55">
						{description}
					</Text>
				</RevealOnView>

				<RevealOnView
					delay={actionsDelay}
					className={cn(
						"mt-12",
						actions.length > 1
							? "flex flex-col items-center justify-center gap-4 sm:flex-row"
							: undefined,
					)}
				>
					{actions.map((action) => (
						<Button
							key={action.href + action.label}
							href={action.href}
							variant={action.variant ?? "outline"}
							size={action.size ?? "lg"}
						>
							{action.label}
						</Button>
					))}
				</RevealOnView>

				{footer && <RevealOnView delay={0.35}>{footer}</RevealOnView>}
			</div>
	);

	if (bare) {
		return <div className={className}>{content}</div>;
	}

	return (
		<ParallaxSection
			className={cn(
				"bg-sapphire-deep relative overflow-hidden py-20 lg:py-28",
				className,
			)}
		>
			<div className={CTA_RADIAL_CLASS} aria-hidden="true" />
			{content}
		</ParallaxSection>
	);
}
