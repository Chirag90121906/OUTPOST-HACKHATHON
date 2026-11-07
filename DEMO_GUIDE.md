# GRANTLY — Demo Guide (~3 minutes)

> **Demo data only.** Listings, accounts, and statuses may be sample/simulated for demonstration. Always verify real scholarships on official provider sources.  
> **Architecture note:** Current app uses Next.js + Prisma/Postgres APIs. If the evaluated deployment lacks database/env configuration, data-dependent features may appear empty. The hackathon-rule constraint reported by the user (“no backend allowed”) conflicts with this architecture and must be resolved with organizers/implementation strategy.

## Judge walkthrough (target flow)
1. **Home** (`/`): understand value prop, search scholarships, review alternating navy/gold UI and readiness/featured section.
2. **Get Started** (`/get-started`): choose Student / Provider / Admin or continue as Guest.
3. **Explore** (`/explore`): search/filter (as available), open a scholarship detail.
4. **Scholarship detail** (`/scholarships/[id]`): review eligibility/status labels, trust signals, report listing, save/apply actions (auth/data dependent).
5. **Login** (`/login?role=STUDENT`): use demo account **only in configured demo environment** (see README; do not treat as production-secure).
6. **Student dashboard** (`/student`): profile/readiness, recommendations/match explanations, saved/applications/documents/notifications (where data exists).
7. **Provider/Admin**: view role-specific portals (restricted by RBAC).

## Demo accounts (seeded demo environments only)
| Role | Email | Password |
|---|---|---|
| Student | `student@grantly.demo` | `Demo@12345` |
| Admin | `admin@grantly.demo` | `Demo@12345` |
| Provider | `provider@grantly.demo` | `Demo@12345` |

## If the live site shows empty data
The UI is designed to avoid exposing developer commands. Empty states mean the deployment needs valid Postgres/env configuration and schema/seed (for demo) — or a frontend-only demo data layer if required by hackathon rules.

## Evidence to capture for scoring
- Route screenshots (desktop/mobile), working filter/eligibility explanations, role-based access, console/Lighthouse/a11y outputs, `tsc`/build logs, and this repo’s architecture/feature/plan docs.
