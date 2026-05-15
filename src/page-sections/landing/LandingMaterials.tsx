"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Text, Button } from "@/components/ui";
import { MATERIAL_CATEGORIES, type MaterialCategory } from "@/constants/landing";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/cn";
import { MaterialTilePreview } from "@/components/3d/MaterialTilePreview";
import { Link } from "@/i18n/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type TileSize = "60×120cm" | "80×80cm";

const SIZE_OPTIONS: { labelKey: "size60x120" | "size80x80"; value: TileSize }[] = [
	{ labelKey: "size60x120", value: "60×120cm" },
	{ labelKey: "size80x80", value: "80×80cm" },
];

const CARD_HOVER_TRANSITION_CLASS =
	"duration-[550ms] ease-[cubic-bezier(0.4,0,0.2,1)]";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Precomputed backdrops (no runtime color sampling) to avoid scroll jank.
 * Tones stay close to each tile palette while keeping the slab as the hero.
 */
const MATERIAL_BACKDROPS: Record<
	string,
	Partial<Record<TileSize, string>> & { default: string }
> = {
	inspire: {
		default: "linear-gradient(146deg, #102b45 0%, #0b2237 45%, #071a2b 100%)",
		"60×120cm": "linear-gradient(146deg, #15385a 0%, #0e2b46 46%, #071a2b 100%)",
	},
	travertine: {
		default: "linear-gradient(146deg, #2f2418 0%, #231a11 44%, #0f0b07 100%)",
		"60×120cm": "linear-gradient(146deg, #443222 0%, #2e2318 44%, #161008 100%)",
		"80×80cm": "linear-gradient(146deg, #3a2c1e 0%, #2a2117 44%, #130f0a 100%)",
	},
	"orient-star": {
		default: "linear-gradient(146deg, #2d2619 0%, #1f1a12 42%, #0c0906 100%)",
		"60×120cm": "linear-gradient(146deg, #383022 0%, #262015 44%, #0d0b07 100%)",
	},
	sunshine: {
		default: "linear-gradient(146deg, #183245 0%, #10293a 45%, #071a2b 100%)",
		"60×120cm": "linear-gradient(146deg, #214261 0%, #17344d 48%, #091f34 100%)",
		"80×80cm": "linear-gradient(146deg, #1b3b55 0%, #123049 46%, #081f35 100%)",
	},
	architectural: {
		default: "linear-gradient(146deg, #1a1f31 0%, #101526 44%, #080b15 100%)",
		"60×120cm": "linear-gradient(146deg, #262d43 0%, #1a2238 44%, #0c1323 100%)",
	},
};

function getMaterialBackdrop(categoryId: string, tileSize: TileSize): string {
	const config =
		MATERIAL_BACKDROPS[categoryId] ?? MATERIAL_BACKDROPS.inspire;
	return config[tileSize] ?? config.default;
}

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
	const activeIndex = activeSize === "60×120cm" ? 0 : 1;

	return (
		<div
			className="relative mx-auto grid min-w-[17.5rem] max-w-sm grid-cols-2 rounded-full border border-[#1A3D5C] bg-[#071A2B]/92 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
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
				if (dx < -40) onSizeChange("80×80cm");
				else if (dx > 40) onSizeChange("60×120cm");
			}}
			onPointerCancel={() => {
				swipeStartX.current = null;
			}}
		>
			<div
				className={cn(
					"pointer-events-none absolute top-1 bottom-1 rounded-full bg-[#D4B886] shadow-[0_2px_12px_rgba(0,0,0,0.28)] transition-[left] duration-300 ease-out",
					activeIndex === 0 ? "left-1" : "left-[calc(50%_+_2px)]",
				)}
				style={{ width: "calc(50% - 6px)" }}
			/>
			{SIZE_OPTIONS.map(({ labelKey, value }) => {
				const selected = activeSize === value;
				return (
					<button
						key={value}
						type="button"
						role="tab"
						aria-selected={selected}
						tabIndex={0}
						onClick={() => onSizeChange(value)}
						className={cn(
							"relative z-10 rounded-full px-5 py-2 font-sans text-sm tracking-[0.12em] uppercase transition-colors duration-200",
							selected
								? "text-[#071A2B]"
								: "text-[#F4F4F6]/45 hover:text-[#F4F4F6]/78",
						)}
					>
						{t(labelKey)}
					</button>
				);
			})}
		</div>
	);
}

// ─── MaterialCard ─────────────────────────────────────────────────────────────

function MaterialCard({
	category,
	activeSize,
}: {
	category: MaterialCategory;
	activeSize: TileSize;
}) {
	const t = useTranslations("landing.materials");
	// Show only the tile that matches the active size filter.
	const matchedPreview = category.previews.find((p) => p.size === activeSize);
	const tilePreview = matchedPreview ? [matchedPreview] : [category.previews[0]];
	const backdrop = getMaterialBackdrop(category.id, activeSize);

	return (
		<div className="group relative min-h-56 overflow-hidden rounded-2xl">
			<div
				className="absolute inset-0 z-0 transition-[background] duration-700 ease-out"
				style={{ background: backdrop }}
			/>

			{/* Depth + text legibility */}
			<div
				className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#071A2B]/88 via-[#071A2B]/12 to-[#040F1A]/35"
				aria-hidden
			/>

			<MaterialTilePreview previews={tilePreview} />

			{/* Hover shimmer */}
			<div
				className={cn(
					"absolute inset-0 bg-[#D4B886]/0 transition-colors group-hover:bg-[#D4B886]/5",
					CARD_HOVER_TRANSITION_CLASS,
				)}
			/>

			{/* Border ring — no transition (ring = box-shadow; animating it is expensive). */}
			<div className="absolute inset-0 z-[8] rounded-2xl ring-1 ring-[#D4B886]/10 group-hover:ring-[#D4B886]/30" />

			{/* Content */}
			<div className="relative z-10 flex min-h-56 flex-col justify-between p-7">
				<div>
					<Text variant="label" className="tracking-widest text-[#D4B886] uppercase">
						{category.sizes.join(" · ")}
					</Text>
					<Text variant="h4" className="mt-3 text-[#F4F4F6]">
						{t(`categories.${category.id}.name`)}
					</Text>
					<Text variant="body-sm" className="mt-2 text-[#F4F4F6]/55">
						{t(`categories.${category.id}.tagline`)}
					</Text>
				</div>

				<Link
					href={category.href}
					className={cn(
						"text-body-sm inline-flex items-center gap-2 font-sans text-[#D4B886] opacity-0 transition-opacity group-hover:opacity-100",
						CARD_HOVER_TRANSITION_CLASS,
					)}
				>
					{t("discover")} <ArrowRight className="h-4 w-4" />
				</Link>
			</div>
		</div>
	);
}

// ─── Section ─────────────────────────────────────────────────────────────────

/**
 * LandingMaterials — Showcase the material collections.
 * A size toggle filters to collections available in 60×120 or 80×80 format,
 * and the spinning tile shard reflects the correct tile proportions.
 */
export function LandingMaterials() {
	const t = useTranslations("landing.materials");
	const [activeSize, setActiveSize] = useState<TileSize>("60×120cm");

	const visibleCategories = MATERIAL_CATEGORIES.filter((c) =>
		c.sizes.includes(activeSize),
	);

	// Preserve the 3-top / 2-bottom masonry feel regardless of count.
	const topRow = visibleCategories.slice(0, 3);
	const bottomRow = visibleCategories.slice(3);

	return (
		<section className="bg-[#0E2A42] py-28 lg:py-36">
			<div className="mx-auto max-w-7xl px-6 lg:px-12">
				{/* ── Header ── */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.55, ease: "easeOut" }}
					viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
					className="mb-10 text-center"
				>
					<span className="text-label font-sans tracking-widest text-[#D4B886] uppercase">
						{t("label")}
					</span>
					<Text variant="display-lg" className="mt-3 text-[#F4F4F6]">
						{t("heading")}
					</Text>
					<Text variant="body-lg" className="mx-auto mt-5 max-w-xl text-[#F4F4F6]/55">
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
							{topRow.map((cat) => (
							<MaterialCard
								key={cat.id}
								category={cat}
								activeSize={activeSize}
							/>
							))}
						</div>
						{bottomRow.length > 0 && (
							<div className="mt-4 grid gap-4 sm:grid-cols-2">
								{bottomRow.map((cat) => (
								<MaterialCard
									key={cat.id}
									category={cat}
									activeSize={activeSize}
								/>
								))}
							</div>
						)}
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
