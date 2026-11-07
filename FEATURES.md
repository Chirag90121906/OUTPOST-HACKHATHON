# GRANTLY — Features (Current Implementation)

> Features vary by deployment configuration (database/env). Demo/sample data must be labeled; never present simulated states as official provider decisions.

## Public / Guest
- Premium landing page with Royal Navy + Champagne Gold alternating sections, scholarship search CTA, featured listings (real DB data when available), scholarship readiness/empty state, FAQ, trust/verification messaging.
- Explore scholarships, filters/search foundations, scholarship details with eligibility display, save intent, report listing.
- Role selection (`/get-started`), login/register, forbidden handling.

## Student (authenticated, role-protected)
- Dashboard with match/radar visual, overview cards, readiness/planner/calendar/funding/document/activity/notification foundations (data-dependent).
- Profile, recommendations (explainable matching), saved, applications (draft/submit workflow), compare, documents (private/validated design), notifications, location settings foundations, copilot (rule-based fallback; no fabricated LLM responses).

## Provider (authenticated, scoped)
- Overview, My Scholarships, Create Scholarship, Applications Received, status updates with history/notification; additional pages as functional summaries/foundations.

## Admin (authenticated)
- Overview aggregates, manage students/providers, scholarship management foundations, verification/reported/categories/notifications pages.

## Cross-cutting
- Responsive UI, reduced-motion-aware animations, accessible focus patterns (improvements ongoing).
- Transparent rule-based eligibility states: Eligible / Potentially Eligible / Not Eligible / Insufficient Information (where implemented).
- No exposed developer setup commands in public UI.

## Known gaps (honest)
- Full end-to-end workflows, complete CRUD for every role, real LLM/OCR/i18n, full persistence in evaluated environments, Lighthouse/axe matrices, and frontend-only hackathon-rule compliance (if required) are not fully complete. See `SCORE_IMPROVEMENT_PLAN.md`.
