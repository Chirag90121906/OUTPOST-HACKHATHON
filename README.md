# GRANTLY — Discover Opportunities. Unlock Your Future.

GRANTLY is a unified scholarship discovery and management platform that helps students discover relevant scholarship opportunities, understand eligibility, manage applications, organize documents, receive deadline reminders, and track progress through a single platform.

> **Hackathon note:** This repository was built as a premium, demo-ready product implementation. Scholarship listings seeded in development are **sample/demo data** and are clearly labeled in the UI. Always verify official eligibility, deadlines, and application links on provider websites.

## Problem Statement

Students often face fragmented scholarship information, unclear eligibility, deadline pressure, and difficult application tracking across multiple sources. GRANTLY addresses this by combining discovery, explainable matching, application workflows, and role-based administration in one experience.

## Solution

- **Discovery:** Search, filter, and sort scholarship opportunities.
- **Explainable matching:** Rule-based eligibility engine returns `Eligible`, `Potentially Eligible`, `Not Eligible`, or `Insufficient Information` with reasons and missing fields.
- **Application tracking:** Draft/submit flow with status history and notifications (demo workflow).
- **Student workspace:** Profile, saved scholarships, recommendations, applications, notifications, and support pages.
- **Admin workspace:** Dashboard aggregates and scholarship/application management views (role-protected).
- **Provider structure:** Role and dashboard scaffold for provider workflows (extensible).

## Implemented Core Features

- Premium responsive UI with GRANTLY design system (Midnight Navy/Royal Blue/Electric Violet palette), Tailwind CSS v4, and accessible focus states.
- Public pages: landing, explore, scholarship details, about, how-it-works, contact, FAQ, privacy, terms, 404.
- Authentication: registration, login, logout, JWT session cookie (`httpOnly`, `sameSite=lax`, secure in production), password hashing with bcrypt, backend role checks.
- Role-based route protection via middleware + server-side session checks (`STUDENT`, `ADMIN`, `PROVIDER`).
- Student portal: dashboard, profile editor, recommendations (matching engine), saved scholarships, applications (draft/submit), notifications, documents checklist, settings/support placeholders with consistent UX.
- Admin portal: dashboard with real Prisma aggregates, scholarship list, and protected management scaffolds.
- APIs: auth, scholarships list/details, profile, saved, applications, notifications, and supporting lib utilities.
- Prisma + SQLite local dev schema covering users/profiles/scholarships/applications/documents/notifications/providers/support/audit entities.
- Seed script with **demo** scholarships, categories, and demo accounts.

## Tech Stack

- **Framework:** Next.js 15 (App Router), TypeScript
- **UI:** React 19, Tailwind CSS v4, Lucide React, custom component primitives
- **Backend:** Next.js Route Handlers / Server Components
- **Database/ORM:** Prisma + SQLite (local); configurable via `DATABASE_URL` for production databases
- **Auth/Security:** `jose` JWT sessions, `bcryptjs`, Zod validation, server-side authorization
- **Charts/animation libraries installed:** Recharts, Framer Motion (available for extension)

## Architecture

```text
src/
  app/
    (public)/         # Landing + public pages
    (auth)/           # Login/register/forgot-password
    student/          # Student portal (protected)
    admin/            # Admin portal (protected)
    provider/         # Provider portal (protected)
    api/              # REST-style route handlers
  components/
    ui/               # Design-system primitives
    layout/           # Site nav/footer/app shell
    scholarships/     # Scholarship cards
  lib/
    db.ts             # Prisma client
    auth.ts           # Session + password helpers
    matching.ts       # Explainable eligibility matching
    utils.ts          # Formatting/helpers
prisma/
  schema.prisma
  seed.ts
```

## Setup

### Prerequisites
- Node.js 20+ (tested with Node 26 in this environment)
- npm

### Install
```bash
npm install
```

### Environment variables
Copy `.env.example` to `.env` and set values:
```bash
cp .env.example .env
```

Required:
- `DATABASE_URL` — SQLite local default: `file:./dev.db`
- `AUTH_SECRET` — long random secret (32+ chars) for JWT signing
- `APP_URL` — e.g. `http://localhost:3000`

Optional (future LLM assistant integration, backend only):
- `OPENAI_API_KEY` or other provider key (never use `NEXT_PUBLIC_` for secrets)

### Database
```bash
npx prisma migrate dev
npm run prisma:seed
```

### Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts (non-sensitive, local seed)

| Role | Email | Password |
|---|---|---|
| Student | `student@grantly.demo` | `Demo@12345` |
| Admin | `admin@grantly.demo` | `Demo@12345` |
| Provider | `provider@grantly.demo` | `Demo@12345` |

> Use only for local/demo environments. Change/remove for production.

## Scripts

- `npm run dev` — development server
- `npm run build` — Prisma generate + Next.js production build
- `npm run start` — start production build
- `npm run lint` — lint
- `npm run typecheck` — TypeScript check
- `npm run prisma:seed` — seed demo data
- `npm run db:reset` — reset DB and reseed (destructive)

## API Overview (selected)

- `POST /api/auth/register` — create account
- `POST /api/auth/login` — login
- `POST /api/auth/logout` — logout
- `GET /api/auth/me` — current session
- `GET /api/scholarships` — list/filter scholarships
- `GET /api/scholarships/:id` — details
- `GET/POST /api/profile` — student profile
- `GET/POST/DELETE /api/saved` — bookmarks
- `GET/POST /api/applications` — list/create draft or submit (demo workflow)
- `GET/POST /api/notifications` — list / mark read

All protected operations enforce server-side authorization.

## Security Notes

- Passwords are hashed (bcrypt); plaintext passwords are never stored.
- Sessions use signed JWT in `httpOnly` cookies.
- Role checks are enforced on server (middleware + route handlers/pages).
- Input validation via Zod on auth flows; extend validators across all APIs for production.
- Do not commit `.env`, DB files, uploads, or secrets. `.env.example` contains placeholders only.
- Production recommendations: rate limiting, CSRF strategy appropriate to auth model, strict CORS, secure headers, private file storage with signed URLs, audit logging expansion, and managed Postgres.

## Testing / Verification

Executed in this environment:
- `npx prisma migrate dev --name init`
- `npm run prisma:seed`
- `npx tsc --noEmit`
- `npm run build` (Next.js production build completed)

Recommended additional checks before production: ESLint full pass, unit/integration tests (Vitest scaffold available), accessibility audits (Lighthouse/axe), responsive QA at required breakpoints, API negative tests, and deployment smoke tests.

## Vercel Deployment

1. Push repository to GitHub.
2. Import project in Vercel.
3. Set environment variables (`DATABASE_URL`, `AUTH_SECRET`, `APP_URL`). For production, use a managed database (e.g., Vercel Postgres/Neon/Supabase) instead of local SQLite.
4. Build command: `npm run build` (default).
5. Ensure Prisma migrations are applied for the production database (`prisma migrate deploy`) in your release process.
6. Verify CORS/cookies/auth behavior on the deployed domain.

**Important:** SQLite (`file:./dev.db`) is suitable for local development; serverless production environments require a hosted database.

## Known Limitations / Next Improvements

- Some modules are scaffolded with consistent UI and role protection but need deeper CRUD/workflow implementation (advanced admin/provider operations, full document upload storage pipeline, calendar exports, email provider integration).
- Forgot-password requires a configured email delivery provider.
- AI assistant is currently explainable rule-based matching; an LLM-backed assistant can be added via a secure server-side integration when keys are configured.
- Add comprehensive automated tests, accessibility audits, and Lighthouse evidence for all critical pages.
- Replace demo listings with verified provider data and verification workflows for production.

## License

For hackathon/demo use unless otherwise specified by the repository owner.
