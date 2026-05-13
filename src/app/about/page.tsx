import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Hùng Phát Ceramic",
  description:
    "Learn about Hùng Phát Ceramic — our heritage, craftsmanship philosophy, and commitment to luxury ceramic solutions for distinguished interiors.",
};

export default function AboutPage() {
  return (
    <main>
      {/* Page sections will be added here */}
      <section className="flex min-h-screen items-center justify-center bg-sapphire-deep px-6">
        <h1 className="font-serif text-display-lg text-linen">About Us</h1>
      </section>
    </main>
  );
}
