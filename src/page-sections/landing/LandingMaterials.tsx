"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Text, Button } from "@/components/ui";
import { MATERIAL_CATEGORIES } from "@/constants/landing";
import { ROUTES } from "@/constants/routes";
import { type TileSize } from "@/data/landing/material-backdrops";
import { cn } from "@/lib/cn";
import { MaterialCard } from "@/page-sections/landing/MaterialCard";

// ─── Types ────────────────────────────────────────────────────────────────────

type TileSizeLabelKey = "size60x120" | "size80x80" | "size100x100" | "size120x120";

const SIZE_OPTIONS: { labelKey: TileSizeLabelKey; value: TileSize }[] = [
	{ labelKey: "size60x120", value: "60×120cm" },
	{ labelKey: "size80x80", value: "80×80cm" },
	{ labelKey: "size100x100", value: "100×100cm" },
	{ labelKey: "size120x120", value: "120×120cm" },
];

// ─── Tile size segmented control (iOS-style sliding thumb) ───────────────────

function TileSizeSegmentedControl({
	activeSize,
	onSizeChange,
}: {
	activeSize: TileSize;
	onSizeChange: (value: TileSize) => void;
}) {
	const t = useTranslations("landing.materials");
	const swipeStartX = useRef<number | null>(null);
	const activeIndex = Math.max(
		0,
		SIZE_OPTIONS.findIndex((option) => option.value === activeSize),
	);
	const segmentCount = SIZE_OPTIONS.length;
	const thumbWidthPercent = 100 / segmentCount;

	const selectAdjacentSize = (direction: -1 | 1) => {
		const nextIndex = (activeIndex + direction + segmentCount) % segmentCount;
		onSizeChange(SIZE_OPTIONS[nextIndex].value);
	};

	return (
		<div
			className="border-sapphire-mist bg-sapphire-deep/92 relative mx-auto grid w-full max-w-3xl min-w-[17.5rem] grid-cols-2 gap-1 rounded-2xl border p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:grid-cols-4 sm:gap-0 sm:rounded-full"
			role="tablist"
			aria-label={t("tileFormat")}
			onPointerDown={(event) => {
				if (event.pointerType === "mouse" && event.button !== 0) return;
				swipeStartX.current = event.clientX;
			}}
			onPointerUp={(event) => {
				if (swipeStartX.current == null) return;
				const dx = event.clientX - swipeStartX.current;
				swipeStartX.current = null;
				if (dx < -40) selectAdjacentSize(1);
				else if (dx > 40) selectAdjacentSize(-1);
			}}
			onPointerCancel={() => {
				swipeStartX.current = null;
			}}
		>
			{/* Single-row sliding thumb (sm+). Mobile uses per-button highlight — 2×2 + 50% thumb overlapped labels. */}
			<div
				aria-hidden
				className="bg-champagne pointer-events-none absolute top-1 bottom-1 hidden rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.28)] transition-[left,width] duration-300 ease-out sm:block"
				style={{
					left: `calc(${(activeIndex / segmentCount) * 100}% + 4px)`,
					width: `calc(${thumbWidthPercent}% - 8px)`,
				}}
			/>
			{SIZE_OPTIONS.map(({ labelKey, value }) => {
				const selected = activeSize === value;
				return (
					<button
						key={value}
						type="button"
						role="tab"
						aria-selected={selected}
						tabIndex={selected ? 0 : -1}
						onClick={() => onSizeChange(value)}
						className={cn(
							"relative z-10 rounded-full px-3 py-2.5 font-sans text-xs tracking-[0.08em] whitespace-nowrap uppercase transition-colors duration-200 sm:px-4 sm:py-2 sm:text-sm sm:tracking-[0.12em]",
							selected ? "text-[#071A2B]" : "text-linen/45 hover:text-linen/78",
							selected &&
								"bg-champagne shadow-[0_2px_12px_rgba(0,0,0,0.28)] sm:bg-transparent sm:shadow-none",
						)}
					>
						{t(labelKey)}
					</button>
				);
			})}
		</div>
	);
}

// ─── Section ─────────────────────────────────────────────────────────────────

/** LandingMaterials (showcase the material collections, shows the first three collections, the size toggle updates tile previews only). */
export function LandingMaterials() {
	const t = useTranslations("landing.materials");
	const [activeSize, setActiveSize] = useState<TileSize>("60×120cm");

	const featuredCategories = MATERIAL_CATEGORIES.slice(0, 3);

	return (
		<section className="bg-sapphire-ocean py-28 lg:py-36">
			<div className="mx-auto max-w-7xl px-6 lg:px-12">
				{/* ── Header ── */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.55, ease: "easeOut" }}
					viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
					className="mb-10 text-center"
				>
					<span className="text-label text-champagne font-sans tracking-widest uppercase">
						{t("label")}
					</span>
					<Text variant="display-lg" className="text-linen mt-3">
						{t("heading")}
					</Text>
					<Text variant="body-lg" className="text-linen/55 mx-auto mt-5 max-w-xl">
						{t("description")}
					</Text>
				</motion.div>

				{/* ── Size toggle ── */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.25 }}
					viewport={{ once: true }}
					className="mb-10 flex justify-center"
				>
					<TileSizeSegmentedControl
						activeSize={activeSize}
						onSizeChange={setActiveSize}
					/>
				</motion.div>

				{/* ── Cards — animate between size views ── */}
				<AnimatePresence mode="wait">
					<motion.div
						key={activeSize}
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -16 }}
						transition={{ duration: 0.35, ease: "easeInOut" }}
					>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{featuredCategories.map((cat) => (
								<MaterialCard key={cat.id} category={cat} activeSize={activeSize} />
							))}
						</div>
					</motion.div>
				</AnimatePresence>

				{/* ── CTA ── */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					viewport={{ once: true }}
					className="mt-12 text-center"
				>
					<Button href={ROUTES.products} variant="secondary" size="lg">
						{t("exploreFullCollection")}
					</Button>
				</motion.div>
			</div>
		</section>
	);
}
