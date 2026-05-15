# Content Editing Guide (i18n)

This project uses `next-intl` with locale JSON files.

## Where to edit content

- Vietnamese: `src/messages/vi.json`
- English: `src/messages/en.json`

## Safe editing rules

- Edit only values on the right side. Do not rename or delete keys.
- Keep placeholders exactly as-is, for example `{year}`, `{companyName}`, `{productName}`, `{slug}`.
- Keep JSON valid: commas, quotes, and brackets must be correct.

## Common sections

- Navbar text: `navbar.*`
- Footer text: `footer.*`
- Landing page text: `landing.*`
- Page metadata (SEO): `meta.*`
- Static page headings: `pages.*`

## Language dropdown labels

- Change language names in:
  - `navbar.locale.options.vi`
  - `navbar.locale.options.en`

## After editing

Run:

```bash
pnpm lint
pnpm build
```

If both pass, content changes are ready.