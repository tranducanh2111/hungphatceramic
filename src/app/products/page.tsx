import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Products | Perla powered by Hung Phat",
	description:
		"Browse our curated collection of premium ceramic tiles, surfaces, and custom interior solutions for luxury residential and commercial spaces.",
};

export default function ProductsPage() {
	return (
		<main>
			{/* Page sections will be added here */}
			<section className="bg-sapphire-deep flex min-h-screen items-center justify-center px-6">
				<h1 className="text-display-lg text-linen font-serif">Our Products</h1>
			</section>
		</main>
	);
}
