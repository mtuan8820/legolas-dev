# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev          # Vite dev server with vue-devtools
npm run build        # type-check + production build (runs in parallel via npm-run-all2)
npm run build-only   # vite build without type-check
npm run type-check   # vue-tsc --build (incremental; .tsbuildinfo in node_modules/.tmp)
npm run lint         # runs lint:oxlint then lint:eslint, both with --fix
npm run format       # prettier --write on src/
npm run preview      # serve the production build
```

No test runner is configured. Requires Node `^22.18.0 || >=24.12.0`.

## Architecture

Vue 3 + TypeScript SPA scaffolded from `create-vue`, with Supabase as the backend. **Personal portfolio site** featuring dynamic content (projects, blog posts, TIL entries) and hardcoded static content (about me, social links).

- `src/main.ts` creates the app, installs the router, mounts to `#app`.
- `src/router/index.ts` uses `createWebHistory(import.meta.env.BASE_URL)` with routes for `/`, `/blogs`, `/blogs/:slug`, `/about`, `/til`.
- `src/util/supabase.ts` exports a single shared `supabase` client built from `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Components fetch data directly (no store/data-access layer yet).
- Persistent sidebar navigation with hardcoded social links and portfolio branding.

### Database Schema

Supabase table schemas (SQL) are documented in `.claude/supabase-schema.md` .

## Project Specification

### Portfolio Pages & Routes

| Page            | Route          | Content                                       | Source                 |
| --------------- | -------------- | --------------------------------------------- | ---------------------- |
| About           | `/`            | Bio and portfolio info                        | Hardcoded in component |
| Projects        | `/projects`    | Listing of projects with descriptions & links | `projects` table       |
| Blogs           | `/blogs`       | Blog post listing                             | `blogs` table          |
| Blog Post       | `/blogs/:slug` | Full blog post (markdown rendered)            | `blogs` table          |
| Today I Learned | `/til`         | TIL entries listing                           | `til` table            |

### Data Model & Content Format

**Markdown rendering**: Blog posts, TIL entries, and project descriptions are stored as **Markdown** in the database. Use a markdown parser (e.g., `marked` or `markdown-it`) on the frontend to render.

**Images**: Embedded in markdown content using standard markdown image syntax, hosted on Supabase Storage (URLs referenced in markdown).

**Hardcoded content**: Social links and about-me bio are hardcoded in Vue components (no DB queries). Update by editing component code; deploy for changes.

### Environment

Vite env vars live in `.env.local` (gitignored via the `*.local` pattern). Only `VITE_`-prefixed vars reach client code. `env.d.ts` just references `vite/client`; add an `ImportMetaEnv` interface there if you want typed env access.

**Required env vars for Supabase:**

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase public anon key

## Conventions

- Path alias `@/*` → `src/*`, configured in both `vite.config.ts` (resolve.alias) and `tsconfig.app.json` (paths). Keep them in sync.
- `noUncheckedIndexedAccess` is on — indexed reads are `T | undefined`.
- Prettier: no semicolons, single quotes, 100-char width. `eslint-config-prettier` disables formatting rules in ESLint, so formatting is Prettier's job alone.
- Two linters run in sequence: oxlint (fast, `correctness` category as errors, config in `.oxlintrc.json`) and ESLint (flat config in `eslint.config.ts`, loaded via jiti). `eslint-plugin-oxlint` reads `.oxlintrc.json` to turn off rules oxlint already covers — add oxlint rule changes there, not in the ESLint config.
- `tsconfig.json` is a solution file referencing `tsconfig.app.json` (browser code) and `tsconfig.node.json` (Vite/ESLint configs). New build-tooling files belong in the node project's include list.
