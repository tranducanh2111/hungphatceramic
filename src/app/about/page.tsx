import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About Us | Perla powered by Hung Phat",
	description:
		"Learn about Perla powered by Hung Phat — our heritage, craftsmanship philosophy, and commitment to luxury ceramic solutions for distinguished interiors.",
};

export default function AboutPage() {
	return (
		<main>
			{/* Page sections will be added here */}
			<section className="bg-sapphire-deep flex min-h-screen items-center justify-center px-6">
				<h1 className="text-display-lg text-linen font-serif">About Us</h1>
			</section>
		</main>
	);
}
