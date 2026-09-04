"use client";

import { useTranslations } from "next-intl";
import { Text, Button } from "@/components/ui";
import { CONTACT_EMAIL } from "@/constants/contact";
import type { LocalizedProductDetail } from "@/lib/products/localizeCatalog";
import { PRODUCTS } from "@/constants/products";
import { ROUTES } from "@/constants/routes";
import { getAvailableSizesForProduct } from "@/lib/products/listing";
import { Link } from "@/i18n/navigation";

interface FinishTranslations {
	matte: string;
	polished: string;
}

function getSurfaceFinish(skuCode: string, slug: string, finishes: FinishTranslations) {
	if (skuCode.startsWith("SS")) return finishes.matte;
	if (skuCode.startsWith("GS")) return finishes.polished;
	const isPolished = slug.includes("-gp") || skuCode.startsWith("GP");
	return isPolished ? finishes.polished : finishes.matte;
}

interface ProductDetailSpecsProps {
	product: LocalizedProductDetail;
}

/** ProductDetailSpecs (technical specifications and Call to Action, remapped to sapphire/champagne palette). */
export function ProductDetailSpecs({ product }: ProductDetailSpecsProps) {
	const tDetail = useTranslations("pages.productDetail");

	const finishes = {
		matte: tDetail("finishes.matte"),
		polished: tDetail("finishes.polished"),
	};

	const surfaceFinish = getSurfaceFinish(product.skuCode, product.slug, finishes);

	const collectionProducts = PRODUCTS.filter((p) => p.collectionId === product.collectionId);
	const availableSurfaces = Array.from(
		new Set(collectionProducts.map((p) => getSurfaceFinish(p.skuCode, p.slug, finishes))),
	).join(" / ");

	const thickness =
		product.collectionId === "architectural"
			? tDetail("specs.thicknessArchitectural")
			: tDetail("specs.thicknessStandard");

	const faceCount =
		product.faceCount ??
		(product.faceImages && product.faceImages.length > 1 ? product.faceImages.length : 1);
	const facesValue =
		faceCount > 1
			? tDetail("specs.facesRandom", { count: faceCount })
			: tDetail("specs.facesSingle");

	const bodyValue =
		product.bodyType === "standard" || product.collectionId === "architectural"
			? tDetail("specs.bodyStandard")
			: tDetail("specs.bodyWhite");

	const specs = [
		{ label: tDetail("surface"), value: surfaceFinish },
		{ label: tDetail("size"), value: product.category },
		{ label: tDetail("body"), value: bodyValue },
		{ label: tDetail("thickness"), value: thickness },
		{ label: tDetail("material"), value: product.material },
		{ label: tDetail("faces"), value: facesValue },
	];

	const quoteMailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
		tDetail("specs.quoteMailtoSubject", {
			productName: product.title,
			skuCode: product.skuCode,
		}),
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
						<div className="border-sapphire-mist/30 grid grid-cols-1 gap-y-4 border-t pt-8">
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

						{/* Available Options Grid */}
						<div className="grid grid-cols-2 gap-8 pt-4">
							{/* Available Sizes (only if > 1 size exists in design family) */}
							{(() => {
								const sizeSiblings = getAvailableSizesForProduct(
									product.skuCode,
									PRODUCTS,
								);
								if (sizeSiblings.length <= 1) return null;

								return (
									<div className="space-y-4">
										<span className="text-linen/30 block font-sans text-[11px] font-semibold tracking-wider uppercase">
											{tDetail("availableSizes")}
										</span>
										<ul className="space-y-2">
											{sizeSiblings.map(({ size, slug }) => {
												const isCurrent = size === product.category;
												return (
													<li
														key={size}
														className="text-body-sm font-sans font-semibold"
													>
														{isCurrent ? (
															<span className="text-champagne">
																{size}
															</span>
														) : (
															<Link
																href={`/products/${slug}`}
																className="text-linen hover:text-champagne-light transition-colors duration-300"
															>
																{size}
															</Link>
														)}
													</li>
												);
											})}
										</ul>
									</div>
								);
							})()}

							{/* Available Surfaces */}
							<div className="space-y-4">
								<span className="text-linen/30 block font-sans text-[11px] font-semibold tracking-wider uppercase">
									{tDetail("availableSurfaces")}
								</span>
								<ul className="space-y-2">
									{availableSurfaces.split(" / ").map((surf) => (
										<li
											key={surf}
											className="text-body-sm text-linen font-sans font-semibold"
										>
											{surf}
										</li>
									))}
								</ul>
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
