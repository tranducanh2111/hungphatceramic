"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui";
import { CINEMATIC_HERO_CONTENT_VARIANTS } from "@/constants/hero";
import { cn } from "@/lib/cn";

export interface CinematicHeroContentProps {
	eyebrow?: string;
	eyebrowVariant: "default" | "hero-pill";
	titleLine1: string;
	titleLine2?: string;
	description?: ReactNode;
	children?: ReactNode;
	childrenClassName?: string;
	shouldAnimate?: boolean;
}

export function CinematicHeroContent({
	eyebrow,
	eyebrowVariant,
	titleLine1,
	titleLine2,
	description,
	children,
	childrenClassName,
	shouldAnimate = true,
}: CinematicHeroContentProps) {
	if (!shouldAnimate) {
		return (
			<>
				{eyebrow &&
					(eyebrowVariant === "hero-pill" ? (
						<div>
							<Badge variant="hero">{eyebrow}</Badge>
						</div>
					) : (
						<span className="text-label text-champagne font-sans tracking-widest uppercase">
							{eyebrow}
						</span>
					))}

				<h1
					className={cn(
						"text-display-xl lg:text-display-2xl text-linen font-serif leading-[1.05] font-light",
						eyebrowVariant === "hero-pill" && "mt-6 max-w-3xl leading-[1.1]",
						eyebrow && eyebrowVariant !== "hero-pill" && "mt-4",
					)}
				>
					{titleLine1}
					{titleLine2 && (
						<>
							<br />
							<em className="text-champagne italic">{titleLine2}</em>
						</>
					)}
				</h1>

				{description && (
					<div className="text-body-lg text-linen/60 mt-6 max-w-lg font-sans">
						{description}
					</div>
				)}

				{children && <div className={cn("mt-9", childrenClassName)}>{children}</div>}
			</>
		);
	}

	return (
		<>
			{eyebrow &&
				(eyebrowVariant === "hero-pill" ? (
					<motion.div
						custom={0}
						variants={CINEMATIC_HERO_CONTENT_VARIANTS}
						initial="hidden"
						animate="visible"
					>
						<Badge variant="hero">{eyebrow}</Badge>
					</motion.div>
				) : (
					<motion.span
						custom={0.1}
						variants={CINEMATIC_HERO_CONTENT_VARIANTS}
						initial="hidden"
						animate="visible"
						className="text-label text-champagne font-sans tracking-widest uppercase"
					>
						{eyebrow}
					</motion.span>
				))}

			<motion.h1
				custom={0.2}
				variants={CINEMATIC_HERO_CONTENT_VARIANTS}
				initial="hidden"
				animate="visible"
				className={cn(
					"text-display-xl lg:text-display-2xl text-linen font-serif leading-[1.05] font-light",
					eyebrowVariant === "hero-pill" && "mt-6 max-w-3xl leading-[1.1]",
					eyebrow && eyebrowVariant !== "hero-pill" && "mt-4",
				)}
			>
				{titleLine1}
				{titleLine2 && (
					<>
						<br />
						<em className="text-champagne italic">{titleLine2}</em>
					</>
				)}
			</motion.h1>

			{description && (
				<motion.div
					custom={0.45}
					variants={CINEMATIC_HERO_CONTENT_VARIANTS}
					initial="hidden"
					animate="visible"
					className="text-body-lg text-linen/60 mt-6 max-w-lg font-sans"
				>
					{description}
				</motion.div>
			)}

			{children && (
				<motion.div
					custom={0.65}
					variants={CINEMATIC_HERO_CONTENT_VARIANTS}
					initial="hidden"
					animate="visible"
					className={cn("mt-9", childrenClassName)}
				>
					{children}
				</motion.div>
			)}
		</>
	);
}
