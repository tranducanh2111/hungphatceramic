"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Text } from "@/components/ui";
import { encodePublicAssetPath } from "@/lib/products/media";
import { ProductDetail } from "@/types";

interface ProductDetailGalleryProps {
	product: ProductDetail;
}

/**
 * ProductDetailGallery — Visual showcase of the different faces/textures of the tile.
 * Displays face variations and composite sheets. Includes an interactive lightbox.
 */
export function ProductDetailGallery({ product }: ProductDetailGalleryProps) {
	const tDetail = useTranslations("pages.productDetail");
	const tItems = useTranslations("products.items");

	const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
	const [isCompositeImageVisible, setIsCompositeImageVisible] = useState(true);

	const productName = tItems.has(`${product.slug}.name`)
		? tItems(`${product.slug}.name`)
		: product.name;

	const hasFaces = product.faceImages.length > 0;
	const showCompositeOverview = Boolean(product.allFacesImage) && isCompositeImageVisible;

	return (
		<section className="relative bg-sapphire-ocean px-6 py-24 text-linen lg:px-12">
			<div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-sapphire-mist/35 to-transparent" />

			<div className="mx-auto max-w-7xl">
				<div className="mb-16 text-center">
					<Text
						variant="label"
						className="mb-4 font-sans font-medium tracking-[0.2em] text-champagne uppercase"
					>
						{tDetail("faceVariations")}
					</Text>
					<h2 className="text-h2 font-serif font-light text-linen">{productName}</h2>
					<div className="mx-auto mt-4 h-px w-16 bg-champagne/30" />
				</div>

				{showCompositeOverview && product.allFacesImage && (
					<div className="shadow-luxury-md mb-16 overflow-hidden rounded-2xl border border-sapphire-mist/40 bg-sapphire-deep p-6">
						<Text
							variant="label-sm"
							className="mb-4 block text-center font-sans font-medium tracking-[0.1em] text-champagne/60 uppercase"
						>
							{tDetail("facesOverviewComposite")}
						</Text>
						<div
							className="relative min-h-[12rem] w-full cursor-zoom-in overflow-hidden rounded-xl bg-sapphire-deep sm:min-h-[16rem] lg:min-h-[20rem]"
							onClick={() =>
								setLightboxSrc(encodePublicAssetPath(product.allFacesImage!))
							}
						>
							<Image
								src={encodePublicAssetPath(product.allFacesImage)}
								alt={tDetail("facesOverviewCompositeAlt", { productName })}
								fill
								unoptimized
								sizes="100vw"
								className="ease-luxury object-contain object-center transition-transform duration-700 hover:scale-[1.01]"
								onError={() => setIsCompositeImageVisible(false)}
							/>
						</div>
					</div>
				)}

				{hasFaces && (
					<div>
						{showCompositeOverview && (
							<Text
								variant="label-sm"
								className="mb-6 block text-center font-sans font-medium tracking-[0.1em] text-champagne/60 uppercase lg:text-left"
							>
								{tDetail("individualFaces", { count: product.faceImages.length })}
							</Text>
						)}

						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
							{product.faceImages.map((face, index) => (
								<motion.div
									key={face}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: "-50px" }}
									transition={{ duration: 0.6, delay: index * 0.05 }}
									className="group shadow-luxury-sm relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-xl border border-sapphire-mist/30 bg-sapphire-deep"
									onClick={() => setLightboxSrc(encodePublicAssetPath(face))}
								>
									<Image
										src={encodePublicAssetPath(face)}
										alt={tDetail("faceImageAlt", {
											productName,
											faceNumber: index + 1,
										})}
										fill
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 15vw"
										className="ease-luxury object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									<div className="absolute inset-0 flex items-center justify-center bg-sapphire-deep/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
										<span className="rounded-full bg-champagne p-2 text-xs font-semibold text-sapphire-deep shadow-md">
											🔎
										</span>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				)}
			</div>

			<AnimatePresence>
				{lightboxSrc && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setLightboxSrc(null)}
						className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-sapphire-deep/95 p-6 backdrop-blur-md"
					>
						<button
							type="button"
							onClick={() => setLightboxSrc(null)}
							className="absolute top-6 right-6 text-3xl font-light text-linen transition-colors hover:text-champagne"
						>
							✕
						</button>
						<motion.div
							initial={{ scale: 0.95 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0.95 }}
							className="relative h-full max-h-[85vh] w-full max-w-[90vw]"
						>
							<Image
								src={lightboxSrc}
								alt={tDetail("lightboxAlt")}
								fill
								unoptimized={lightboxSrc === product.allFacesImage}
								sizes="90vw"
								className="object-contain"
							/>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
}
