"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Text } from "@/components/ui";
import { TESTIMONIALS } from "@/constants/landing";
import { cn } from "@/lib/cn";

/**
 * LandingTestimonials — Animated carousel of client quotes.
 * ⚠️ Placeholder content — replace with real client quotes when received.
 */
export function LandingTestimonials() {
	const [activeIndex, setActiveIndex] = useState(0);

	const goToPrev = () =>
		setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
	const goToNext = () => setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);

	const activeTestimonial = TESTIMONIALS[activeIndex];

	return (
		<section className="bg-[#071A2B] py-28 lg:py-36">
			<div className="mx-auto max-w-4xl px-6 text-center lg:px-12">
				{/* Label */}
				<motion.span
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-label font-sans tracking-widest text-[#D4B886] uppercase"
				>
					Client Voices
				</motion.span>

				{/* Large quote icon */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					viewport={{ once: true }}
					className="mt-8 flex justify-center"
				>
					<Quote className="h-12 w-12 text-[#D4B886]/25" />
				</motion.div>

				{/* Quote carousel 3D Stack */}
				<div className="relative mx-auto mt-12 h-[260px] w-full max-w-2xl [perspective:1200px]">
					{TESTIMONIALS.map((testimonial, i) => {
						const isActive = i === activeIndex;

						// Calculate wrapping distance
						let distance = i - activeIndex;
						if (distance < -1) distance += TESTIMONIALS.length;
						if (distance > 2) distance -= TESTIMONIALS.length;

						const isVisible = distance >= 0 && distance <= 2;
						const isPast = distance < 0;

						return (
							<motion.div
								key={testimonial.id}
								animate={{
									opacity: isActive ? 1 : isVisible ? 1 - distance * 0.4 : 0,
									y: isActive ? 0 : isPast ? -60 : distance * 25,
									z: isActive ? 0 : isPast ? 100 : distance * -100,
									rotateX: isActive ? 0 : isPast ? 5 : distance * -2,
									scale: isActive ? 1 : isPast ? 1.05 : 1 - distance * 0.05,
								}}
								transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
								className={cn(
									"absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-[#1A3D5C]/40 bg-[#0E2A42] p-8 shadow-2xl backdrop-blur-md",
									!isActive && "pointer-events-none",
								)}
								style={{
									zIndex: 10 - Math.max(0, distance),
									transformStyle: "preserve-3d",
								}}
							>
								<Text
									variant="h4"
									className="font-serif font-light text-[#F4F4F6]/90 italic"
								>
									&ldquo;{testimonial.quote}&rdquo;
								</Text>

								<div className="mt-8 flex flex-col items-center gap-1">
									<div className="h-px w-8 bg-[#D4B886]" />
									<Text
										variant="body"
										className="mt-4 font-medium text-[#F4F4F6]"
									>
										{testimonial.authorName}
									</Text>
									<Text variant="body-sm" className="text-[#F4F4F6]/50">
										{testimonial.authorTitle} — {testimonial.authorCompany}
									</Text>
								</div>
							</motion.div>
						);
					})}
				</div>

				{/* Controls */}
				<div className="mt-10 flex items-center justify-center gap-6">
					<button
						onClick={goToPrev}
						aria-label="Previous testimonial"
						className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1A3D5C] text-[#F4F4F6]/50 transition-all duration-300 hover:border-[#D4B886] hover:text-[#D4B886]"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>

					{/* Dot indicators */}
					<div className="flex gap-2">
						{TESTIMONIALS.map((_, i) => (
							<button
								key={i}
								onClick={() => setActiveIndex(i)}
								aria-label={`Go to testimonial ${i + 1}`}
								className={`h-1.5 rounded-full transition-all duration-300 ${
									i === activeIndex ? "w-6 bg-[#D4B886]" : "w-1.5 bg-[#1A3D5C]"
								}`}
							/>
						))}
					</div>

					<button
						onClick={goToNext}
						aria-label="Next testimonial"
						className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1A3D5C] text-[#F4F4F6]/50 transition-all duration-300 hover:border-[#D4B886] hover:text-[#D4B886]"
					>
						<ChevronRight className="h-5 w-5" />
					</button>
				</div>
			</div>
		</section>
	);
}
