"use client";

import { useId, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { TileSizeListingMeta, SurfaceListingMeta } from "@/lib/products/listing";

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
	activeSurfaceId: string;
	onSelectSurface: (id: string) => void;
	surfaces: SurfaceListingMeta[];
}

/** ProductsFilter (collection and tile-size filters, expandable accordions on all breakpoints). */
export function ProductsFilter({
	activeCollectionId,
	onSelectCollection,
	collections,
	activeSizeId,
	onSelectSize,
	tileSizes,
	activeSurfaceId,
	onSelectSurface,
	surfaces,
}: ProductsFilterProps) {
	const t = useTranslations("pages.products");
	const collectionsT = useTranslations("collections");
	const tDetail = useTranslations("pages.productDetail");

	return (
		<div className="flex w-full flex-col gap-2.5">
			<FilterAccordionSection
				headingLabel={t("filterLabel")}
				ariaLabel={t("collectionsAriaLabel")}
				defaultExpanded
			>
				<FilterNavButton
					label={t("allCollections")}
					isSelected={activeCollectionId === "all"}
					onSelect={() => onSelectCollection("all")}
				/>

				{collections.map((col) => {
					const label = collectionsT.has(`${col.id}.name`)
						? collectionsT(`${col.id}.name`)
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
			</FilterAccordionSection>

			<FilterAccordionSection
				headingLabel={t("sizeFilterLabel")}
				ariaLabel={t("sizesAriaLabel")}
			>
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
			</FilterAccordionSection>

			<FilterAccordionSection
				headingLabel={t("surfaceFilterLabel")}
				ariaLabel={t("surfacesAriaLabel")}
			>
				<FilterNavButton
					label={t("allSurfaces")}
					isSelected={activeSurfaceId === "all"}
					onSelect={() => onSelectSurface("all")}
				/>

				{surfaces.map((surface) => {
					const label = tDetail.has(`finishes.${surface.id}`)
						? tDetail(`finishes.${surface.id}`)
						: surface.id;

					return (
						<FilterNavButton
							key={surface.id}
							label={label}
							count={surface.count}
							isSelected={activeSurfaceId === surface.id}
							onSelect={() => onSelectSurface(surface.id)}
						/>
					);
				})}
			</FilterAccordionSection>
		</div>
	);
}

interface FilterAccordionSectionProps {
	headingLabel: string;
	ariaLabel: string;
	defaultExpanded?: boolean;
	children: ReactNode;
}

function FilterAccordionSection({
	headingLabel,
	ariaLabel,
	defaultExpanded = false,
	children,
}: FilterAccordionSectionProps) {
	const panelId = useId();
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);

	return (
		<div className={cn(isExpanded ? "pb-4" : "pb-3")}>
			<button
				type="button"
				onClick={() => setIsExpanded((previous) => !previous)}
				aria-expanded={isExpanded}
				aria-controls={panelId}
				className="group border-champagne focus-visible:ring-champagne/50 flex w-full items-center justify-between gap-3 border-b pb-2 text-left focus:outline-none focus-visible:ring-2"
			>
				<Text
					variant="label"
					as="span"
					className="text-champagne font-sans font-medium tracking-[0.2em] uppercase"
				>
					{headingLabel}
				</Text>
				<FilterAccordionChevron isExpanded={isExpanded} />
			</button>

			<div
				id={panelId}
				className={cn(
					"grid transition-[grid-template-rows] duration-300 ease-out",
					isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
				)}
			>
				<nav
					className={cn(
						"flex min-h-0 flex-col gap-1 overflow-hidden",
						isExpanded && "pt-2",
					)}
					aria-label={ariaLabel}
					aria-hidden={!isExpanded}
					inert={!isExpanded ? true : undefined}
				>
					{children}
				</nav>
			</div>
		</div>
	);
}

interface FilterAccordionChevronProps {
	isExpanded: boolean;
}

function FilterAccordionChevron({ isExpanded }: FilterAccordionChevronProps) {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			className={cn(
				"text-champagne/80 shrink-0 transition-transform duration-300 ease-out",
				isExpanded ? "rotate-180" : "rotate-0",
			)}
		>
			<path
				d="M3 5.5L7 9.5L11 5.5"
				stroke="currentColor"
				strokeWidth="1.25"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
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
			className="group focus-visible:text-champagne flex w-full items-center justify-between py-1 text-left focus:outline-none"
		>
			<span
				className={cn(
					"font-serif text-lg tracking-wide transition-colors duration-300",
					isSelected ? "text-champagne" : "text-linen/40 group-hover:text-linen/85",
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
