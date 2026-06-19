# Data layer (`src/data/`)

Locale agnostic records live here. Display copy is keyed by stable IDs in `src/messages/`.

## Pattern

1. **Data file** exports records with `id` or `slug` only (plus media paths, counts, coordinates).
2. **Messages** hold human readable strings under namespaces that mirror those IDs.
3. **Page boundaries** call `localizeListingCatalog` or `localizeProductDetail` once, then UI reads `product.title` and `product.description`.

## Examples

| Data | Message namespace | Consumer |
|------|-------------------|----------|
| `data/catalog/products.ts` (`slug`) | `products.items.{slug}.name` / `.description` | Product pages, tiles |
| `data/shared/collection-ids.ts` | `collections.{id}.name` | Footer, filters, hero |
| `data/projects/projects.ts` (`id`) | `landing.projects.items.{id}.*`, `pages.projects.heritage.milestones.{id}.*` | Landing, projects page |
| `data/landing/process-steps.ts` | `landing.process.steps.{id}.*` | Process sections |
| `data/landing/testimonials.ts` | `landing.testimonials.items.{id}.*` | Testimonials carousel |

## Validation

```bash
pnpm validate:data-i18n
```

Checks that every catalog slug, collection ID, project ID, process step, and testimonial in `src/data/` has matching keys in both `en.json` and `vi.json`.

## Migration

During refactors, `src/constants/` may re-export from `src/data/` so existing `@/constants/*` imports keep working. Prefer `@/data/*` for new code.
