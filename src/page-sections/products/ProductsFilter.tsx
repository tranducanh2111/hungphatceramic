"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";

interface CollectionItem {
	id: string;
	count: number;
}

interface ProductsFilterProps {
	activeCollectionId: string;
	onSelectCollection: (id: string) => void;
	collections: CollectionItem[];
}

/**
 * ProductsFilter — Sidebar filters on desktop, horizontal scrollbar on mobile.
 */
export function ProductsFilter({
	activeCollectionId,
	onSelectCollection,
	collections,
}: ProductsFilterProps) {
	const t = useTranslations("pages.products");

	return (
		<div className="w-full">
			{/* Mobile Scrollable Pills */}
			<div className="flex w-full scrollbar-none items-center overflow-x-auto pb-4 md:hidden">
				<div className="flex gap-2.5 px-6">
					{/* "All" button */}
					<button
						type="button"
						onClick={() => onSelectCollection("all")}
						className={cn(
							"text-body-sm shrink-0 rounded-full px-5 py-2 font-sans tracking-wide transition-all duration-300",
							activeCollectionId === "all"
								? "bg-[#D4B886] font-medium text-[#071A2B]"
								: "border border-[#1A3D5C]/30 bg-[#0E2A42] text-[#F4F4F6]/55 hover:text-[#F4F4F6]",
						)}
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
								className={cn(
									"text-body-sm shrink-0 rounded-full px-5 py-2 font-sans tracking-wide transition-all duration-300",
									isSelected
										? "bg-[#D4B886] font-medium text-[#071A2B]"
										: "border border-[#1A3D5C]/30 bg-[#0E2A42] text-[#F4F4F6]/55 hover:text-[#F4F4F6]",
								)}
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

			{/* Desktop Vertical Sidebar */}
			<div className="hidden space-y-8 md:block">
				<div>
					<Text
						variant="label"
						className="mb-6 font-sans font-medium tracking-[0.2em] text-[#D4B886] uppercase"
					>
						{t("filterLabel")}
					</Text>

					<nav className="flex flex-col space-y-4" aria-label="Collections filter">
						{/* "All" Link */}
						<button
							type="button"
							onClick={() => onSelectCollection("all")}
							className="group relative flex w-full items-center justify-between py-2 text-left focus:outline-none"
						>
							<span
								className={cn(
									"font-serif text-lg tracking-wide transition-colors duration-300",
									activeCollectionId === "all"
										? "text-[#D4B886]"
										: "text-[#F4F4F6]/40 group-hover:text-[#F4F4F6]/85",
								)}
							>
								{t("allCollections")}
							</span>

							{/* Active underline */}
							{activeCollectionId === "all" && (
								<motion.div
									layoutId="activeFilterUnderline"
									className="absolute right-0 bottom-0 left-0 h-[2px] bg-[#D4B886]"
									transition={{ type: "spring", stiffness: 380, damping: 30 }}
								/>
							)}
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
									className="group relative flex w-full items-center justify-between py-2 text-left focus:outline-none"
								>
									<span
										className={cn(
											"font-serif text-lg tracking-wide transition-colors duration-300",
											isSelected
												? "text-[#D4B886]"
												: "text-[#F4F4F6]/40 group-hover:text-[#F4F4F6]/85",
										)}
									>
										{label}
									</span>

									<span
										className={cn(
											"font-sans text-xs tracking-wider transition-colors duration-300",
											isSelected ? "text-[#D4B886]" : "text-[#F4F4F6]/20",
										)}
									>
										{col.count}
									</span>

									{/* Active underline */}
									{isSelected && (
										<motion.div
											layoutId="activeFilterUnderline"
											className="absolute right-0 bottom-0 left-0 h-[2px] bg-[#D4B886]"
											transition={{
												type: "spring",
												stiffness: 380,
												damping: 30,
											}}
										/>
									)}
								</button>
							);
						})}
					</nav>
				</div>
			</div>
		</div>
	);
}
