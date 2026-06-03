"use client";

import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { TileSizeListingMeta } from "@/lib/products/listing";

interface CollectionItem {
	id: string;
	count: number;
}

interface ProductsFilterProps {
	activeCollectionId: string;
	onSelectCollection: (id: string) => void;
	collections: CollectionItem[];
	activeSizeId: string;
	onSelectSize: (id: string) => void;
	tileSizes: TileSizeListingMeta[];
}

const COLLECTION_PILL_CLASS = (isSelected: boolean) =>
	cn(
		"text-body-sm shrink-0 rounded-full px-5 py-2 font-sans tracking-wide transition-all duration-300",
		isSelected
			? "bg-[#D4B886] font-medium text-[#071A2B]"
			: "border border-[#1A3D5C]/30 bg-[#0E2A42] text-[#F4F4F6]/55 hover:text-[#F4F4F6]",
	);

/**
 * ProductsFilter — Collection and tile-size filters (sidebar desktop, pills mobile).
 */
export function ProductsFilter({
	activeCollectionId,
	onSelectCollection,
	collections,
	activeSizeId,
	onSelectSize,
	tileSizes,
}: ProductsFilterProps) {
	const t = useTranslations("pages.products");

	return (
		<div className="w-full space-y-6 md:space-y-5">
			{/* Mobile — collections */}
			<div className="flex w-full scrollbar-none items-center overflow-x-auto pb-2 md:hidden">
				<div className="flex gap-2.5 px-6">
					<button
						type="button"
						onClick={() => onSelectCollection("all")}
						className={COLLECTION_PILL_CLASS(activeCollectionId === "all")}
					>
						{t("allCollections")}
					</button>

					{collections.map((col) => {
						const isSelected = activeCollectionId === col.id;
						const label = t.has(`collections.${col.id}`)
							? t(`collections.${col.id}`)
							: col.id;

						return (
							<button
								key={col.id}
								type="button"
								onClick={() => onSelectCollection(col.id)}
								className={COLLECTION_PILL_CLASS(isSelected)}
							>
								{label}{" "}
								<span
									className={cn(
										"ml-1.5 text-[10px] opacity-60",
										isSelected ? "text-[#071A2B]/80" : "text-[#D4B886]/80",
									)}
								>
									({col.count})
								</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Mobile — tile sizes */}
			<div className="flex w-full scrollbar-none items-center overflow-x-auto pb-4 md:hidden">
				<div className="flex gap-2.5 px-6">
					<button
						type="button"
						onClick={() => onSelectSize("all")}
						className={COLLECTION_PILL_CLASS(activeSizeId === "all")}
					>
						{t("allSizes")}
					</button>

					{tileSizes.map((size) => {
						const isSelected = activeSizeId === size.id;
						const label = t.has(`sizes.${size.id}`)
							? t(`sizes.${size.id}`)
							: size.dimension;

						return (
							<button
								key={size.id}
								type="button"
								onClick={() => onSelectSize(size.id)}
								className={COLLECTION_PILL_CLASS(isSelected)}
							>
								{label}{" "}
								<span
									className={cn(
										"ml-1.5 text-[10px] opacity-60",
										isSelected ? "text-[#071A2B]/80" : "text-[#D4B886]/80",
									)}
								>
									({size.count})
								</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Desktop — collections */}
			<div className="hidden md:block">
				<FilterSectionHeading label={t("filterLabel")} />

				<nav className="flex flex-col gap-1" aria-label={t("collectionsAriaLabel")}>
					<FilterNavButton
						label={t("allCollections")}
						isSelected={activeCollectionId === "all"}
						onSelect={() => onSelectCollection("all")}
					/>

					{collections.map((col) => {
						const label = t.has(`collections.${col.id}`)
							? t(`collections.${col.id}`)
							: col.id;

						return (
							<FilterNavButton
								key={col.id}
								label={label}
								count={col.count}
								isSelected={activeCollectionId === col.id}
								onSelect={() => onSelectCollection(col.id)}
							/>
						);
					})}
				</nav>
			</div>

			{/* Desktop — tile sizes */}
			<div className="hidden md:block">
				<FilterSectionHeading label={t("sizeFilterLabel")} />

				<nav className="flex flex-col gap-1" aria-label={t("sizesAriaLabel")}>
					<FilterNavButton
						label={t("allSizes")}
						isSelected={activeSizeId === "all"}
						onSelect={() => onSelectSize("all")}
					/>

					{tileSizes.map((size) => {
						const label = t.has(`sizes.${size.id}`)
							? t(`sizes.${size.id}`)
							: size.dimension;

						return (
							<FilterNavButton
								key={size.id}
								label={label}
								count={size.count}
								isSelected={activeSizeId === size.id}
								onSelect={() => onSelectSize(size.id)}
							/>
						);
					})}
				</nav>
			</div>
		</div>
	);
}

interface FilterSectionHeadingProps {
	label: string;
}

function FilterSectionHeading({ label }: FilterSectionHeadingProps) {
	return (
		<div className="mb-3 border-b border-champagne pb-2">
			<Text
				variant="label"
				className="font-sans font-medium tracking-[0.2em] text-champagne uppercase"
			>
				{label}
			</Text>
		</div>
	);
}

interface FilterNavButtonProps {
	label: string;
	count?: number;
	isSelected: boolean;
	onSelect: () => void;
}

function FilterNavButton({ label, count, isSelected, onSelect }: FilterNavButtonProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className="group flex w-full items-center justify-between py-1 text-left focus:outline-none"
		>
			<span
				className={cn(
					"font-serif text-lg tracking-wide transition-colors duration-300",
					isSelected
						? "text-champagne"
						: "text-linen/40 group-hover:text-linen/85",
				)}
			>
				{label}
			</span>

			{count !== undefined && (
				<span
					className={cn(
						"font-sans text-xs tracking-wider transition-colors duration-300",
						isSelected ? "text-linen/35" : "text-linen/20",
					)}
				>
					{count}
				</span>
			)}
		</button>
	);
}
