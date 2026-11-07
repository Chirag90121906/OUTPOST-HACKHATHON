# GRANTLY — Architecture (Current Implementation)

## Stack (as implemented)
- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling/UI:** Tailwind CSS v4, Lucide React, custom UI primitives (`src/components/ui/*`), Framer Motion/Recharts installed
- **Data/API:** Prisma ORM, Vercel Postgres datasource (`prisma/schema.prisma`), Next.js Route Handlers (`src/app/api/*`)
- **Auth:** JWT session cookie (`httpOnly`) via `jose`, bcrypt password hashing, server-side role checks/middleware
- **Validation:** Zod on key flows

## High-level structure
```text
src/
  app/
    (public)/         # Landing + public pages
    (auth)/           # Login/register/forgot-password
    student/          # Student portal
    provider/         # Provider portal
    admin/            # Admin portal
    api/              # Route handlers (auth, scholarships, profile, saved, applications, provider/admin, etc.)
  components/         # UI, layout, dashboard, scholarships, home
  lib/                # db, auth, matching, provider scope, utils
prisma/               # schema, migrations/seed (project history)
```

## Data flow
1. UI (Server/Client Components) calls server actions/route handlers or reads via server components with Prisma.
2. Route handlers validate input (Zod where implemented), enforce session/role authorization, query/mutate via Prisma.
3. Prisma connects to Postgres using `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING`.
4. Matching/eligibility logic is implemented in `src/lib/matching.ts` (transparent, rule-based; explainable states).

## Roles
- **Guest:** public browsing.
- **Student:** profile, discovery, save/apply tracking, documents/notifications (as implemented).
- **Provider:** scoped scholarship/application management.
- **Admin:** oversight/verification/reporting foundations.

## Hackathon rule constraint (user-reported)
The user reported: *“backend development is not allowed.”* The current architecture **includes backend/API/database components**. If the competition requires frontend-only implementation, GRANTLY needs an explicit migration plan (seed data + browser persistence + simulated flows) and honest labeling. This document describes the **actual** codebase, not a claim of rule compliance.

## Security notes (current design intent)
- Server-side authorization for protected routes/APIs; passwords hashed; no secrets in repo.
- Demo accounts/seed data must be labeled and restricted to demo environments.
- Private document handling and production hardening require managed storage, rate limits, audit logging, and deployment-specific controls.
