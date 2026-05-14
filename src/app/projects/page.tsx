import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Projects | Perla powered by Hung Phat",
	description:
		"Explore completed interior design projects by Perla powered by Hung Phat. See how our luxury ceramics elevate residential and commercial spaces.",
};

export default function ProjectsPage() {
	return (
		<main>
			{/* Page sections will be added here */}
			<section className="bg-sapphire-deep flex min-h-screen items-center justify-center px-6">
				<h1 className="text-display-lg text-linen font-serif">Our Projects</h1>
			</section>
		</main>
	);
}
