"use client";

import { useTranslations } from "next-intl";
import { Text, Button } from "@/components/ui";
import { CONTACT_EMAIL } from "@/constants/contact";
import type { LocalizedProductDetail } from "@/lib/products/localizeCatalog";
import { ROUTES } from "@/constants/routes";

interface ProductDetailSpecsProps {
	product: LocalizedProductDetail;
}

/** ProductDetailSpecs (technical specifications and Call to Action, remapped to sapphire/champagne palette). */
export function ProductDetailSpecs({ product }: ProductDetailSpecsProps) {
	const tDetail = useTranslations("pages.productDetail");

	const isPolished = product.slug.includes("-gp") || product.skuCode.startsWith("GP");
	const surfaceFinish = isPolished ? tDetail("finishes.polished") : tDetail("finishes.matte");

	const thickness =
		product.collectionId === "architectural"
			? tDetail("specs.thicknessArchitectural")
			: tDetail("specs.thicknessStandard");

	const faceCount = product.faceImages?.length ?? 0;
	const facesValue =
		faceCount > 0
			? tDetail("specs.facesRandom", { count: faceCount })
			: tDetail("specs.facesSingle");

	const specs = [
		{ label: tDetail("surface"), value: surfaceFinish },
		{ label: tDetail("thickness"), value: thickness },
		{ label: tDetail("material"), value: tDetail("specs.materialValue") },
		{ label: tDetail("faces"), value: facesValue },
	];

	const quoteMailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
		tDetail("specs.quoteMailtoSubject", { productName: product.title, skuCode: product.skuCode }),
	)}`;

	return (
		<section className="bg-sapphire-deep text-linen relative px-6 py-24 lg:px-12">
			{/* Bottom divider border */}
			<div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-[#1A3D5C]/35 to-transparent" />

			<div className="mx-auto max-w-7xl">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
					{/* Left Panel: Specifications List (7 columns) */}
					<div className="space-y-10 lg:col-span-7">
						<div>
							<Text
								variant="label"
								className="text-champagne mb-4 font-sans font-medium tracking-[0.2em] uppercase"
							>
								{tDetail("specifications")}
							</Text>
							<h3 className="text-h2 font-serif font-light lining-nums">
								{product.title}
							</h3>
						</div>

						{/* Spec Attributes Grid */}
						<div className="border-sapphire-mist/30 grid grid-cols-1 gap-x-8 gap-y-4 border-t pt-8 sm:grid-cols-2">
							{specs.map((spec) => (
								<div
									key={spec.label}
									className="border-sapphire-mist/20 flex flex-col gap-1 border-b pb-4"
								>
									<span className="text-linen/30 font-sans text-[11px] font-semibold tracking-wider uppercase">
										{spec.label}
									</span>
									<span className="text-body-sm text-linen font-sans font-semibold">
										{spec.value}
									</span>
								</div>
							))}
						</div>

						{/* Available Sizes Visualization */}
						<div className="space-y-6 pt-4">
							<span className="text-linen/30 block font-sans text-[11px] font-semibold tracking-wider uppercase">
								{tDetail("availableSizes")}
							</span>
							<div className="flex flex-wrap gap-8">
								{product.sizes.map((size) => {
									const isLargeFormat = size.includes("60");
									const isCompactSquare =
										size.includes("100") || size.includes("120");
									const tilePreviewClassName = isLargeFormat
										? "h-20 w-10"
										: isCompactSquare
											? "h-14 w-14"
											: "h-16 w-16";
									const aspectLabel = isLargeFormat
										? tDetail("specs.aspectLarge")
										: tDetail("specs.aspectSquare");
									const formatLabel = isLargeFormat
										? tDetail("specs.formatLarge")
										: isCompactSquare
											? tDetail("specs.formatCompact")
											: tDetail("specs.formatStandard");

									return (
										<div key={size} className="flex items-center gap-4">
											<div
												className={`border-champagne/30 bg-sapphire-ocean hover:border-champagne/60 flex items-center justify-center rounded-lg border p-2 transition-all ${tilePreviewClassName}`}
											>
												<span className="text-champagne/80 font-sans text-[10px] font-bold">
													{aspectLabel}
												</span>
											</div>
											<div>
												<span className="text-body-sm text-linen block font-sans font-semibold">
													{size}
												</span>
												<span className="text-linen/40 block font-sans text-[11px] uppercase">
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
					<div className="shadow-luxury-md border-sapphire-mist/30 bg-sapphire-ocean flex flex-col justify-between rounded-2xl border p-8 lg:col-span-5">
						<div className="space-y-6">
							<Text
								variant="label"
								className="text-champagne font-sans font-medium tracking-[0.2em] uppercase"
							>
								{tDetail("requestQuote")}
							</Text>
							<p className="text-body-sm text-linen/55 font-sans leading-relaxed">
								{tDetail("requestQuoteDescription")}
							</p>
						</div>

						<div className="mt-8 flex flex-col gap-4">
							<Button
								href={ROUTES.contact}
								variant="primary"
								size="lg"
								withShimmer
								className="w-full text-center"
							>
								{tDetail("bookConsultation")}
							</Button>
							<Button
								href={quoteMailtoHref}
								variant="secondary"
								size="md"
								className="border-sapphire-mist hover:border-champagne w-full text-center"
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
