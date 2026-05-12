import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Hùng Phát Ceramic",
  description:
    "Browse our curated collection of premium ceramic tiles, surfaces, and custom interior solutions for luxury residential and commercial spaces.",
};

export default function ProductsPage() {
  return (
    <main>
      {/* Page sections will be added here */}
      <section className="flex min-h-screen items-center justify-center bg-sapphire-deep px-6">
        <h1 className="font-serif text-display-lg text-linen">Our Products</h1>
      </section>
    </main>
  );
}