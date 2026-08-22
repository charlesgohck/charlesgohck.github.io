# Changelog

## 2026-08-22

### Changed
- Enabled static generation (SSG) for the blog routes, which were previously rendering dynamically (`ƒ`) on every request.
  - `/blog/[slug]`: added `generateStaticParams` so all post pages are prerendered at build time (`●`), with hourly ISR revalidation via the existing `revalidate = 3600`.
  - `/blog`: removed the server-side dependency on `searchParams` so the route itself prerenders as static (`○`). Tag filtering was moved to a new client component (`app/blog/BlogList.tsx`) that reads the `?tags=` query param in the browser and filters the already-fetched posts client-side.
- Removed the Umami analytics `<Script>` integration from `app/layout.tsx` and restored `@vercel/analytics` + `@vercel/speed-insights` (the pre-umami setup), since Umami's raw script tag wasn't the desired long-term analytics approach.
