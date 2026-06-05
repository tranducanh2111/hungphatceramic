"use client";

import { useTranslations } from "next-intl";
import { Text, Button } from "@/components/ui";
import { ProductDetail } from "@/types";
import { ROUTES } from "@/constants/routes";

interface ProductDetailSpecsProps {
	product: ProductDetail;
}

/**
 * ProductDetailSpecs — Technical specifications and Call to Action.
 * Remapped to sapphire/champagne palette.
 */
export function ProductDetailSpecs({ product }: ProductDetailSpecsProps) {
	const tDetail = useTranslations("pages.productDetail");

	// Determine surface finish based on SKU prefix/slug content
	const isPolished = product.slug.includes("-gp") || product.skuCode.startsWith("GP");
	const surfaceFinish = isPolished ? tDetail("finishes.polished") : tDetail("finishes.matte");

	// Determine thickness
	const thickness = product.collectionId === "architectural" ? "20 mm" : "9.5 mm";

	// Technical spec attributes definition
	const specs = [
		{ label: tDetail("surface"), value: surfaceFinish },
		{ label: tDetail("thickness"), value: thickness },
		{ label: tDetail("material"), value: "Premium Porcelain Ceramic" },
		{
			label: tDetail("faces"),
			value: product.faceImages ? `${product.faceImages.length} random faces` : "1 face",
		},
	];

	return (
		<section className="relative bg-sapphire-deep px-6 py-24 text-linen lg:px-12">
			{/* Bottom divider border */}
			<div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-[#1A3D5C]/35 to-transparent" />

			<div className="mx-auto max-w-7xl">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
					{/* Left Panel: Specifications List (7 columns) */}
					<div className="space-y-10 lg:col-span-7">
						<div>
							<Text
								variant="label"
								className="mb-4 font-sans font-medium tracking-[0.2em] text-champagne uppercase"
							>
								{tDetail("specifications")}
							</Text>
							<h3 className="text-h2 font-serif lining-nums font-light">{product.name}</h3>
						</div>

						{/* Spec Attributes Grid */}
						<div className="grid grid-cols-1 gap-x-8 gap-y-4 border-t border-sapphire-mist/30 pt-8 sm:grid-cols-2">
							{specs.map((spec) => (
								<div
									key={spec.label}
									className="flex flex-col gap-1 border-b border-sapphire-mist/20 pb-4"
								>
									<span className="font-sans text-[11px] font-semibold tracking-wider text-linen/30 uppercase">
										{spec.label}
									</span>
									<span className="text-body-sm font-sans font-semibold text-linen">
										{spec.value}
									</span>
								</div>
							))}
						</div>

						{/* Available Sizes Visualization */}
						<div className="space-y-6 pt-4">
							<span className="block font-sans text-[11px] font-semibold tracking-wider text-linen/30 uppercase">
								{tDetail("availableSizes")}
							</span>
							<div className="flex flex-wrap gap-8">
								{product.sizes.map((size) => {
									const isLargeFormat = size.includes("60");
									const isCompactSquare = size.includes("100") || size.includes("120");
									const tilePreviewClassName = isLargeFormat
										? "h-20 w-10"
										: isCompactSquare
											? "h-14 w-14"
											: "h-16 w-16";
									const aspectLabel = isLargeFormat
										? "1:2"
										: isCompactSquare
											? "1:1"
											: "1:1";
									const formatLabel = isLargeFormat
										? "Large Format"
										: isCompactSquare
											? "Compact Square"
											: "Standard Format";

									return (
										<div key={size} className="flex items-center gap-4">
											<div
												className={`flex items-center justify-center rounded-lg border border-champagne/30 bg-sapphire-ocean p-2 transition-all hover:border-champagne/60 ${tilePreviewClassName}`}
											>
												<span className="font-sans text-[10px] font-bold text-champagne/80">
													{aspectLabel}
												</span>
											</div>
											<div>
												<span className="text-body-sm block font-sans font-semibold text-linen">
													{size}
												</span>
												<span className="block font-sans text-[11px] text-linen/40 uppercase">
													{formatLabel}
												</span>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>

					{/* Right Panel: Call to Action (5 columns) */}
					<div className="shadow-luxury-md flex flex-col justify-between rounded-2xl border border-sapphire-mist/30 bg-sapphire-ocean p-8 lg:col-span-5">
						<div className="space-y-6">
							<Text
								variant="label"
								className="font-sans font-medium tracking-[0.2em] text-champagne uppercase"
							>
								{tDetail("requestQuote")}
							</Text>
							<p className="text-body-sm font-sans leading-relaxed text-linen/55">
								{tDetail("requestQuoteDescription")}
							</p>
						</div>

						<div className="mt-8 flex flex-col gap-4">
							<Button
								href={ROUTES.contact}
								variant="primary"
								size="lg"
								className="w-full text-center"
							>
								{tDetail("bookConsultation")}
							</Button>
							<Button
								href={`mailto:congtyhungphat583@gmail.com?subject=Inquiry about ${product.name} (SKU: ${product.skuCode})`}
								variant="secondary"
								size="md"
								className="w-full border-sapphire-mist text-center hover:border-champagne"
							>
								{tDetail("requestQuote")}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
