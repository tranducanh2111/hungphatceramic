import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Hưng Phát Ceramic",
  description:
    "Explore completed interior design projects by Hưng Phát Ceramic. See how our luxury ceramics elevate residential and commercial spaces.",
};

export default function ProjectsPage() {
  return (
    <main>
      {/* Page sections will be added here */}
      <section className="flex min-h-screen items-center justify-center bg-sapphire-deep px-6">
        <h1 className="font-serif text-display-lg text-linen">Our Projects</h1>
      </section>
    </main>
  );
}