import type { Metadata } from "next";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const productName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${productName} | Hùng Phát Ceramic`,
    description: `Discover the ${productName} — a premium ceramic solution from Hùng Phát Ceramic for luxury interior projects.`,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  return (
    <main>
      {/* Page sections will be added here — use slug to fetch product data */}
      <section className="flex min-h-screen items-center justify-center bg-sapphire-deep px-6">
        <h1 className="font-serif text-display-lg text-linen">Product: {slug}</h1>
      </section>
    </main>
  );
}