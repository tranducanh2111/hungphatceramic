import type { Metadata } from "next";
import { LandingHero } from "@/page-sections/landing/LandingHero";
import { LandingBrandStatement } from "@/page-sections/landing/LandingBrandStatement";
import { LandingProjects } from "@/page-sections/landing/LandingProjects";
import { LandingMaterials } from "@/page-sections/landing/LandingMaterials";
import { LandingStats } from "@/page-sections/landing/LandingStats";
import { LandingProcess } from "@/page-sections/landing/LandingProcess";
import { LandingTestimonials } from "@/page-sections/landing/LandingTestimonials";
import { LandingVisualStory } from "@/page-sections/landing/LandingVisualStory";
import { LandingCta } from "@/page-sections/landing/LandingCta";

export const metadata: Metadata = {
  title: "Hưng Phát Ceramic | Luxury Ceramic Interior Design",
  description:
    "Premium bespoke ceramic surfaces for discerning interiors. Hưng Phát Ceramic — where artistry meets architectural precision. Serving luxury residential and commercial projects across Vietnam.",
  openGraph: {
    title: "Hưng Phát Ceramic | Luxury Ceramic Interior Design",
    description:
      "Bespoke ceramic surfaces for high-end interiors. 12+ years of craftsmanship, 200+ projects completed.",
    url: "https://hungphatceramic.vn",
    siteName: "Hưng Phát Ceramic",
    locale: "vi_VN",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main className="relative" style={{ position: "relative" }}>
      <LandingHero />
      <LandingBrandStatement />
      <LandingProjects />
      <LandingMaterials />
      <LandingStats />
      <LandingProcess />
      <LandingTestimonials />
      <LandingVisualStory />
      <LandingCta />
    </main>
  );
}