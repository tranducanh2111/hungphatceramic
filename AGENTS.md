# AGENTS.md — Perla powered by Hung Phat Project Rules

> **Read this file first before writing any code.** It defines every convention, pattern, and constraint for this codebase.

---

## 1. Project Overview

| Field             | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| **Product**       | Perla powered by Hung Phat — luxury ceramic interior design website   |
| **Target Audience** | High-class customers seeking premium interior design solutions |
| **Framework**     | Next.js 16 (App Router)                                       |
| **Language**      | TypeScript (strict — no `any`, no implicit types)             |
| **Styling**       | Tailwind CSS v4 + custom design tokens in `tailwind.config.ts` |
| **Animation**     | Framer Motion                                                |
| **Package Manager** | pnpm                                                       |
| **Bundler (dev)** | Webpack (`next dev --webpack`)                               |
| **Linting**       | ESLint (eslint-config-next)                                  |
| **Formatting**    | Prettier (with `prettier-plugin-tailwindcss` for class sorting) |

---

## 2. File & Directory Structure

```
src/
├── app/                          # Next.js App Router (pages + layouts)
│   ├── layout.tsx                # Root layout — fonts, metadata, global providers
│   ├── page.tsx                  # Landing page (Home)
│   ├── about/page.tsx            # About Us
│   ├── products/
│   │   ├── page.tsx              # Product listing
│   │   └── [slug]/page.tsx       # Product detail (dynamic)
│   └── projects/page.tsx         # Portfolio / past projects
│
├── components/
│   ├── ui/                       # Reusable UI primitives (Text, Button, Input)
│   │   ├── Text.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── index.ts              # Barrel export
│   └── common/                   # Shared composite components (Navbar, Footer)
│
├── page-sections/                # Page-specific section components
│   ├── landing/                  # Sections for the landing page
│   │   └── LandingHero.tsx
│   ├── about/
│   ├── products/
│   └── projects/
│
├── lib/                          # Utilities and helpers
│   └── cn.ts                     # className merge (clsx + tailwind-merge)
│
├── types/                        # Shared TypeScript type definitions
│   └── index.ts
│
└── constants/                    # Static data and configuration
    └── navigation.ts
```

---

## 3. Architecture Rules

### 3.1 Page ↔ Section Separation

- **Pages (`app/*/page.tsx`) contain NO direct UI logic.** They only:
  - Export `metadata` for SEO.
  - Import and compose `page-sections/*` components.
- **Page sections (`page-sections/*/`) hold all visual layout and logic** for that page.
- This keeps pages scannable and sections independently testable.

### 3.2 Component Hierarchy

```
Page (app/*/page.tsx)
  └── PageSection (page-sections/*/*.tsx)
        ├── UI Primitives (components/ui/*)
        └── Common Components (components/common/*)
```

- **UI Primitives** (`Text`, `Button`, `Input`): Atomic, stateless, highly reusable.
  - Every UI primitive **must** accept a `className` prop for style overrides.
  - Import via `@/components/ui` (barrel export).
- **Common Components** (`Navbar`, `Footer`, etc.): Composite, may hold internal state.
- **Page Sections**: Page-specific; never imported across different pages.

### 3.3 Import Alias

- Always use `@/` path alias (maps to `src/`). Never use relative paths that go more than one level up (`../../`).

### 3.4 Barrel Exports

- Each `components/ui/`, `components/common/`, and `constants/` directory should have an `index.ts` barrel export.
- **Do not** barrel-export page-sections (they are page-specific).

---

## 4. TypeScript Conventions

- **Strict mode.** No `any`, no `@ts-ignore` unless documented with a reason.
- **Interfaces over types** for object shapes (better error messages, extendability).
- **Shared types** go in `src/types/index.ts`. Component-local types live in the component file.
- **Naming:**
  - Interfaces: `PascalCase` with descriptive suffixes (`ButtonProps`, `ProductSummary`).
  - Constants: `SCREAMING_SNAKE_CASE` for module-level constants.
  - Functions / variables: `camelCase`, context-meaningful names.
  - Components: `PascalCase`, one component per file, filename matches export name.
- **Never use `enum`.** Use `as const` objects or union types instead.

---

## 5. Styling Conventions

### 5.1 Tailwind Usage

- Always use design tokens from `tailwind.config.ts`. Never hardcode raw hex/rgb values in components.
- Use the `cn()` utility from `@/lib/cn` for conditional and merged class names.
- Prefer Tailwind utilities over custom CSS. Only use `globals.css` for truly global resets / base styles.

### 5.2 Brand Palette (Imperial Sapphire & Champagne)

| Token              | Hex       | Usage                                           |
| ------------------- | --------- | ----------------------------------------------- |
| `sapphire-deep`    | `#071A2B` | Primary dark background, high-contrast text      |
| `sapphire-ocean`   | `#0E2A42` | Cards, elevated surfaces, secondary backgrounds  |
| `sapphire-mist`    | `#1A3D5C` | Borders, dividers                               |
| `champagne`        | `#D4B886` | Accent — icons, decorative lines, hover states   |
| `champagne-light`  | `#E8D5B0` | Subtle highlights                               |
| `champagne-deep`   | `#A88E60` | Pressed / active states                         |
| `linen`            | `#F4F4F6` | Light mode background, primary text on dark      |
| `linen-warm`       | `#EEEAE4` | Alternating sections                            |

**WCAG Rules:**
- ✅ `sapphire-deep` + `linen` text → 15.6:1 (AAA)
- ✅ `sapphire-deep` + `champagne` → 4.7:1 (AA large text, icons, UI)
- ❌ **Never** use `champagne` for small body text on `linen` background (insufficient contrast)

### 5.3 Typography

| Class              | Size   | Use Case                      |
| ------------------- | ------ | ----------------------------- |
| `text-display-2xl` | 72px   | Hero splash                   |
| `text-display-xl`  | 60px   | Landing hero headline         |
| `text-display-lg`  | 48px   | Section hero                  |
| `text-h1` – `h6`  | 40–16px| Section headings              |
| `text-body-lg`     | 18px   | Featured body copy            |
| `text-body`        | 16px   | Default body text             |
| `text-body-sm`     | 14px   | Compact body, button text     |
| `text-label`       | 13px   | Category tags, form labels    |
| `text-footnote`    | 12px   | Legal, timestamps             |

### 5.4 Fonts

| Font                | Variable             | Role                |
| ------------------- | -------------------- | ------------------- |
| Cormorant Garamond  | `--font-cormorant`   | Headings, display   |
| Jost                | `--font-jost`        | Body, UI elements   |

---

## 6. Design & Animation Philosophy

The website must be designed with a strong emphasis on **storytelling**, guiding the user through a narrative as they navigate.

- **Scroll-Based Content & Animation**: Content should progressively reveal and animate based on the user's scroll position. Use Framer Motion for highly interactive, performant scroll-based animations.
- **Video Integration**: Liberally use high-quality video backgrounds and interactive video elements tied to scroll progress to create an immersive experience.
- **Inspiration References**:
  - **Complex Landing Pages**: 
    - [Pieter Koopt](https://www.pieterkoopt.nl/) — for storytelling, rich animations, and interactive elements.
    - [Ayocin](https://ayocin.com/) — for immersive media use and dynamic layouts.
  - **Simple Landing Page**:
    - [Warwick Acoustics](https://warwickacoustics.com/) — for clean, elegant scroll-based transitions and premium feel.
    - [Flyward](https://www.flyward.com/about).
    - [Flyward](https://www.flyward.com/).
  - **Timeline Components**:
    - [Kaatdm](https://kaatdm.com/) — for scroll-linked timeline narrative design.
  - **Spiral Effect**:
    - [Pacomepertant](https://pacomepertant.com/).
    - [Active Theory](https://activetheory.net/work).

---

## 7. Coding Standards

### 7.1 Principles

- **SOLID** — Single responsibility per file. Open for extension, closed for modification.
- **DRY** — Extract repeated logic into utilities or shared components.
- **KISS** — Prefer the simplest solution. No over-engineering. No abstraction until there are 3+ use cases.
- **Big-O awareness** — Avoid nested loops on large datasets. Prefer `Map`/`Set` for lookups.

### 7.2 Naming

- Variables and functions: `camelCase`, descriptive enough that you don't need a comment.
  - ✅ `productCategories`, `handleFormSubmit`, `isNavigationOpen`
  - ❌ `data`, `arr`, `temp`, `x`, `handler`
- Boolean variables: prefix with `is`, `has`, `should`, `can`.
- Event handlers: prefix with `handle` (component-side) or `on` (prop-side).

### 7.3 Security

- Never trust user input. Sanitize and validate all dynamic content.
- Never expose API keys, secrets, or credentials in client-side code.
- Use `rel="noopener noreferrer"` on all external links.
- Use `next/image` for all images (prevents XSS via SVG injection, optimizes format/size).

### 7.4 Performance

- Use React Server Components by default. Only add `"use client"` when the component needs browser APIs, state, or event handlers.
- Lazy-load below-the-fold sections with `dynamic()` or `React.lazy()`.
- Avoid layout shifts — always set explicit `width`/`height` on images.

### 7.5 Before Creating a New Function or Component

1. **Search the codebase first** — does this utility, hook, or component already exist?
2. If a similar one exists, extend it rather than creating a duplicate.
3. Follow the existing naming and file-location patterns exactly.

---

## 8. SEO Requirements (Mandatory Per Page)

Every page **must** implement the following:

- **Title tag**: Unique per page, 50–60 characters, format: `Page Name | Perla powered by Hung Phat`
- **Meta description**: Unique per page, 150–160 characters, includes primary keyword
- **Single `<h1>` per page**: Matches the page's primary topic
- **Heading hierarchy**: `H1 > H2 > H3` — never skip levels (no H1 → H3)
- **Semantic HTML5**: Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- **Alt text**: Every `<img>` / `next/image` must have descriptive `alt` text
- **Open Graph tags**: `og:title`, `og:description`, `og:image`, `og:url` (via Next.js `metadata`)
- **Canonical URL**: Self-referencing canonical via metadata
- **Structured data (JSON-LD)**: Organization schema on homepage, Product schema on product pages
- **Mobile-first responsive**: Viewport meta (automatic in Next.js), responsive breakpoints
- **Core Web Vitals targets**: LCP < 2.5s, INP < 200ms, CLS < 0.1
- **`next/image`**: All images use Next.js Image component (auto WebP/AVIF, lazy loading)
- **Internal linking**: Every page reachable within 3 clicks from homepage
- **Clean URLs**: `/products/marble-elegance` not `/products?id=123`
- **`robots.txt`**: Allow all crawlers for public pages
- **`sitemap.xml`**: Auto-generated via Next.js `sitemap.ts`
- **No render-blocking resources**: Fonts loaded with `display: swap`

---

## 9. Git Conventions

- **Commit message format**: `type(scope): description`
  - Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`
  - Example: `feat(products): add product detail page`
- **Branch naming**: `feature/product-listing`, `fix/navbar-mobile`

---

## 10. Commands Reference

| Command             | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `pnpm dev`          | Start dev server (webpack)                    |
| `pnpm build`        | Production build                              |
| `pnpm start`        | Start production server                       |
| `pnpm lint`         | Run ESLint                                    |
| `pnpm format`       | Auto-format all source files with Prettier    |
| `pnpm format:check` | Check formatting without writing changes      |