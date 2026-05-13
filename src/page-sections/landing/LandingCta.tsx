"use client";

import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { Text, Button } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

const OFFICE_ADDRESS = "Số 583 Giải Phóng, Phường Giáp Bát, Quận Hoàng Mai, Hà Nội";
const GOOGLE_MAPS_URL = "https://maps.google.com/?q=583+Giải+Phóng,+Giáp+Bát,+Hoàng+Mai,+Hà+Nội";

/**
 * LandingCta — Final conversion section with exclusive framing.
 */
export function LandingCta() {
	return (
		<section className="relative overflow-hidden bg-[#0E2A42] py-28 lg:py-36">
			{/* Background glow */}
			<div
				className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4B886]/5 blur-[120px]"
				aria-hidden="true"
			/>

			{/* Decorative top border */}
			<div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#D4B886]/30 to-transparent" />

			<div className="relative mx-auto max-w-3xl px-6 text-center lg:px-12">
				<motion.span
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-label font-sans tracking-widest text-[#D4B886] uppercase"
				>
					Begin Your Project
				</motion.span>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.1 }}
					viewport={{ once: true }}
				>
					<Text variant="display-lg" className="mt-4 text-[#F4F4F6]">
						Ready to Define
						<br />
						<em className="text-[#D4B886] italic">Your Space?</em>
					</Text>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.2 }}
					viewport={{ once: true }}
				>
					<Text variant="body-lg" className="mx-auto mt-6 max-w-xl text-[#F4F4F6]/60">
						Our team works with a limited number of projects each season to ensure every
						detail is perfect. Private showroom available by appointment.
					</Text>
				</motion.div>

				{/* CTAs */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.3 }}
					viewport={{ once: true }}
					className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
				>
					<Button href={ROUTES.contact} size="lg">
						Book a Consultation
					</Button>
					<Button href={ROUTES.products} variant="secondary" size="lg">
						Browse the Collection
					</Button>
				</motion.div>

				{/* Office details */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.45 }}
					viewport={{ once: true }}
					className="mt-14 flex flex-col items-center gap-4 border-t border-[#1A3D5C] pt-10 sm:flex-row sm:justify-center"
				>
					<a
						href={GOOGLE_MAPS_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 text-[#F4F4F6]/45 transition-colors duration-300 hover:text-[#D4B886]"
					>
						<MapPin className="h-4 w-4 shrink-0 text-[#D4B886]" />
						<Text variant="body-sm">{OFFICE_ADDRESS}</Text>
					</a>
				</motion.div>
			</div>
		</section>
	);
}
