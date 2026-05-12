/**
 * Landing page static data.
 * All section content lives here — never hardcoded inside components.
 */

// ─── Featured Projects ────────────────────────────────────────────────────────

export interface FeaturedProject {
  id: string;
  title: string;
  location: string;
  year: number;
  area: string;
  imageUrl: string;
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: "aria-penthouse",
    title: "Aria Penthouse",
    location: "Vinhomes Metropolis, Hà Nội",
    year: 2023,
    area: "Full-floor ceramic installation, 680m²",
    imageUrl: "/images/project-1.jpg",
  },
  {
    id: "grand-hotel-lobby",
    title: "The Grand Hotel Lobby",
    location: "Aria Boutique Hotel, Hải Phòng",
    year: 2023,
    area: "Lobby & corridor installation, 320m²",
    imageUrl: "/images/project-2.jpg",
  },
  {
    id: "villa-thao-dien",
    title: "Villa Thảo Điền",
    location: "Thảo Điền, Hồ Chí Minh",
    year: 2022,
    area: "Full-villa interior surfaces, 450m²",
    imageUrl: "/images/project-3.jpg",
  },
  {
    id: "tu-liem-residence",
    title: "Từ Liêm Private Residence",
    location: "Từ Liêm, Hà Nội",
    year: 2022,
    area: "Master suite & bathrooms, 180m²",
    imageUrl: "/images/project-4.jpg",
  },
];

// ─── Material Categories ──────────────────────────────────────────────────────

export interface MaterialCategory {
  id: string;
  name: string;
  tagline: string;
  sizes: string[];
  href: string;
}

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  {
    id: "inspire",
    name: "Inspire Series",
    tagline: "Bold patterns. Enduring character.",
    sizes: ["60×120cm"],
    href: "/products?collection=inspire",
  },
  {
    id: "travertine",
    name: "Travertine Series",
    tagline: "The warmth of natural stone, refined.",
    sizes: ["60×120cm", "80×80cm"],
    href: "/products?collection=travertine",
  },
  {
    id: "orient-star",
    name: "Orient Star Series",
    tagline: "Ivory luminance. Timeless interiors.",
    sizes: ["60×120cm"],
    href: "/products?collection=orient-star",
  },
  {
    id: "sunshine",
    name: "Sunshine Series",
    tagline: "Open, airy, luminous surfaces.",
    sizes: ["60×120cm", "80×80cm"],
    href: "/products?collection=sunshine",
  },
  {
    id: "architectural",
    name: "20mm Architectural",
    tagline: "Engineered for demanding spaces.",
    sizes: ["60×120cm"],
    href: "/products?collection=architectural",
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface StatItem {
  numericValue: number;
  suffix: string;
  label: string;
}

export const STATS: StatItem[] = [
  { numericValue: 12, suffix: "+", label: "Years of Craftsmanship" },
  { numericValue: 200, suffix: "+", label: "Projects Completed" },
  { numericValue: 50000, suffix: "+", label: "m² Installed" },
  { numericValue: 35, suffix: "+", label: "Material Collections" },
];

// ─── Process Steps ────────────────────────────────────────────────────────────

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "consultation",
    number: "01",
    title: "Consultation",
    description:
      "We listen before we design. In a dedicated session, we explore your vision, lifestyle, and the architectural intent of your space — ensuring every material choice is deliberate.",
  },
  {
    id: "curation",
    number: "02",
    title: "Curation",
    description:
      "From our collections of 35+ series, we handpick surfaces that align with your aesthetic and structural requirements. Every recommendation is considered, never arbitrary.",
  },
  {
    id: "installation",
    number: "03",
    title: "Installation",
    description:
      "Expert craftsmen. Precise execution. Every joint, every edge placed with deliberate care. We treat your space with the same reverence as a master artisan treats their medium.",
  },
  {
    id: "aftercare",
    number: "04",
    title: "Aftercare",
    description:
      "Our relationship does not end at handover. We provide full documentation, care guidance, and a guarantee on every surface we install. Your investment is protected.",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  authorCompany: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "minh-chau",
    quote:
      "Hưng Phát Ceramic transformed our penthouse from a construction site into a sanctuary. Every tile, every joint — executed with a precision I've rarely seen. They don't just install ceramics, they sculpt spaces.",
    authorName: "Bà Minh Châu",
    authorTitle: "Villa Owner",
    authorCompany: "Vinhomes Riverside, Hà Nội",
  },
  {
    id: "tran-quoc-hung",
    quote:
      "We engaged Hưng Phát for our boutique hotel lobby — a space that needed to feel both imposing and welcoming. The Travertine collection they curated was perfect. Our guests comment on it daily.",
    authorName: "Ông Trần Quốc Hùng",
    authorTitle: "Director",
    authorCompany: "Aria Boutique Hotel, Hải Phòng",
  },
  {
    id: "nguyen-lan-anh",
    quote:
      "Working with a ceramics supplier who truly understands interior design intent is rare. Hưng Phát understood our architect's vision and sourced materials that exceeded the specification. Exceptional.",
    authorName: "KTS. Nguyễn Lan Anh",
    authorTitle: "Principal Architect",
    authorCompany: "Studio Lân, Hà Nội",
  },
];
