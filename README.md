# World Population

Historical population data browser powered by an Umbraco headless CMS backend.

**Repository:** https://github.com/suedeapple/world-population.git

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | SCSS (Sass) with CSS custom properties |
| CMS | [Umbraco](https://umbraco.com) via the Delivery API |
| API client | [orval](https://orval.dev) — generated from Umbraco's OpenAPI spec |
| Charts | [Recharts](https://recharts.org) |
| Icons | [Font Awesome](https://fontawesome.com) |

---

## Prerequisites

- Node.js 20+
- A running Umbraco instance with the Delivery API enabled

---

## Environment variables

Copy `.env.local` and fill in the values:

```
NEXT_PUBLIC_UMBRACO_BASE_URL="https://localhost:44341"   # Umbraco base URL, no trailing slash
UMBRACO_REVALIDATE_SECRET="your-secret"                  # Shared secret for the revalidation webhook
UMBRACO_REVALIDATE_ACCESS_CONTROL_ORIGIN="*"             # CORS origin allowed to call /revalidate
NODE_TLS_REJECT_UNAUTHORIZED=0                           # Disable TLS verification for local dev (self-signed cert)
```

> **Note:** `NODE_TLS_REJECT_UNAUTHORIZED=0` is set automatically by the `dev` and `generate` scripts. Do not set it in production.

---

## Install

```bash
npm install
```

---

## Development

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000). TLS certificate validation is disabled automatically so the dev server can reach a local Umbraco instance running on a self-signed cert.

---

## Regenerating the API client

The TypeScript client under `src/api/` is generated from Umbraco's live OpenAPI spec. Re-run whenever the Umbraco content model changes:

```bash
npm run generate
```

This calls orval, which fetches the spec from `NEXT_PUBLIC_UMBRACO_BASE_URL/umbraco/swagger/delivery/swagger.json` and writes typed models to `src/api/model/` and fetch functions to `src/api/`.

> Do not edit files in `src/api/` by hand — they will be overwritten on the next generate.

---

## Production build

```bash
npm run build
npm run start
```

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                        # Home — lists all continents and their countries
│   ├── [continent]/
│   │   ├── page.tsx                    # Continent page
│   │   └── [country]/
│   │       └── page.tsx                # Country page — flag, description, population table and chart
│   └── revalidate/
│       └── route.ts                    # POST endpoint called by Umbraco to bust the Next.js data cache
├── api/                                # orval-generated — do not edit
│   ├── model/                          # TypeScript types from the OpenAPI spec
│   ├── content/                        # Content Delivery API fetch functions
│   └── media/                          # Media Delivery API fetch functions
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CountryList.tsx
│   └── PopulationChart.tsx
├── umbraco/
│   └── index.ts                        # All data-fetching functions (getContinentPages, getSettings, etc.)
├── lib/
│   └── utils.ts                        # Shared utilities (toSlug, etc.)
├── styles/
│   ├── globals.scss                    # Design tokens (CSS custom properties) and all component styles
│   └── reset.scss
└── custom-fetch.ts                     # orval fetch mutator — rewrites URLs to NEXT_PUBLIC_UMBRACO_BASE_URL
```

---

## Umbraco content model

| Content type | Key properties |
|---|---|
| `settings` | `siteName`, `disclaimer` |
| `continent` | — |
| `country` | `capital`, `description`, `iso2Code`, `iso3Code` |
| `year` | `population` |

The expected tree structure is:

```
Home
└── Settings
Continents
└── [Continent]
    └── [Country]
        └── [Year]
```

---

## External data sources

- **Flags** — served from [flagcdn.com](https://flagcdn.com) using the country's `iso2Code` property. No API key required.
- **Population figures** — sourced from the [World Bank public API](https://data.worldbank.org) and stored as `year` content nodes in Umbraco. The site does not call the World Bank API at runtime.

## Cache revalidation

Next.js caches all Umbraco responses with the `content` tag. When content is published in Umbraco, it should POST to `/api/revalidate` with the header `x-revalidate-secret` matching `UMBRACO_REVALIDATE_SECRET`. This triggers an on-demand revalidation of all cached content.
