"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Text } from "@/components/ui";
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

	// Lightbox active image state
	const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

	const hasFaces = product.faceImages && product.faceImages.length > 0;

	return (
		<section className="relative bg-[#0E2A42] px-6 py-24 text-[#F4F4F6] lg:px-12">
			{/* Bottom divider border */}
			<div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-[#1A3D5C]/35 to-transparent" />

			<div className="mx-auto max-w-7xl">
				{/* Section Heading */}
				<div className="mb-16 text-center">
					<Text
						variant="label"
						className="mb-4 font-sans font-medium tracking-[0.2em] text-[#D4B886] uppercase"
					>
						{tDetail("faceVariations")}
					</Text>
					<h2 className="text-h2 font-serif font-light text-[#F4F4F6]">{product.name}</h2>
					<div className="mx-auto mt-4 h-px w-16 bg-[#D4B886]/30" />
				</div>

				{/* Composite All-Faces Sheet View (if available) */}
				{product.allFacesImage && (
					<div className="shadow-luxury-md mb-16 overflow-hidden rounded-2xl border border-[#1A3D5C]/40 bg-[#071A2B] p-6">
						<Text
							variant="label-sm"
							className="mb-4 block text-center font-sans font-medium tracking-[0.1em] text-[#D4B886]/60 uppercase"
						>
							{tDetail("faces")} Overview (Composite)
						</Text>
						<div
							className="relative aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-xl"
							onClick={() => setLightboxSrc(product.allFacesImage!)}
						>
							<Image
								src={product.allFacesImage}
								alt={`${product.name} - Composite sheet`}
								fill
								sizes="100vw"
								className="ease-luxury object-cover transition-transform duration-700 hover:scale-[1.02]"
							/>
						</div>
					</div>
				)}

				{/* Faces Grid */}
				{hasFaces && (
					<div>
						{product.allFacesImage && (
							<Text
								variant="label-sm"
								className="mb-6 block text-center font-sans font-medium tracking-[0.1em] text-[#D4B886]/60 uppercase lg:text-left"
							>
								Individual Faces ({product.faceImages.length})
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
									className="group shadow-luxury-sm relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-xl border border-[#1A3D5C]/30 bg-[#071A2B]"
									onClick={() => setLightboxSrc(face)}
								>
									<Image
										src={face}
										alt={`${product.name} Face ${index + 1}`}
										fill
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 15vw"
										className="ease-luxury object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									{/* Hover Overlay */}
									<div className="absolute inset-0 flex items-center justify-center bg-[#071A2B]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
										<span className="rounded-full bg-[#D4B886] p-2 text-xs font-semibold text-[#071A2B] shadow-md">
											🔎
										</span>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Interactive Lightbox Portal */}
			<AnimatePresence>
				{lightboxSrc && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setLightboxSrc(null)}
						className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-[#071A2B]/95 p-6 backdrop-blur-md"
					>
						<button
							type="button"
							onClick={() => setLightboxSrc(null)}
							className="absolute top-6 right-6 text-3xl font-light text-[#F4F4F6] transition-colors hover:text-[#D4B886]"
						>
							✕
						</button>
						<motion.div
							initial={{ scale: 0.95 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0.95 }}
							className="relative aspect-[3/4] h-full max-h-[85vh] w-full max-w-[90vw] sm:aspect-auto"
						>
							<Image
								src={lightboxSrc}
								alt="Expanded view"
								fill
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
