# DCMS Agent Instructions

This repository is the frontend MVP prototype for **DCMS**, a Dental Clinic Management System. It is currently a Next.js/React/TypeScript application with mock data only. There is no backend, database, real authentication, or external integration in the codebase yet.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Non-Negotiable Rules For Antigravity

- Do not restart, replace, or scaffold over the existing project.
- Do not redesign the architecture without a demonstrated need and explicit approval.
- Do not replace Next.js, React, TypeScript, lucide-react, or the current App Router structure just because another stack is preferred.
- Read the relevant local Next.js documentation in `node_modules/next/dist/docs/` before changing Next.js route/layout/server/client code.
- Preserve completed screens and role-based behavior unless a new requirement explicitly changes them.
- Preserve MVP scope. Do not add Phase 2 features just because the UI could support them.
- Keep using the current feature-folder pattern: `src/features/<domain>/{types,pages,components,services}` and route wrappers in `src/app/**/page.tsx`.
- Keep mock data isolated in `services/mock-*-service.ts` files until a real backend/API layer is intentionally introduced.
- Reuse existing components/utilities before adding new abstractions.
- Keep changes incremental and screen-specific. Avoid broad refactors while implementing unfinished functionality.
- Run `npm run lint` and `npx tsc --noEmit` after meaningful changes.
- Do not mark work complete without checking the affected route in the browser or at least verifying the route returns `200`.
- Do not remove role restrictions, audit messaging, immutable-record messaging, or least-privilege UI behavior.
- Do not silently change business rules around appointment status vs visit state, clinical/financial separation, finalized invoice immutability, finalized clinical-record immutability, or inventory movement history.
- Do not introduce backend, database, auth, payment, SMS, WhatsApp, insurance, accounting, or e-invoicing behavior without explicit scope approval.
- If documentation and code disagree, inspect the code and update the documentation or implementation deliberately.

## Coding Conventions

- Use TypeScript strict mode. Add exported union/object types in the feature's `*.types.ts` file.
- Use named exports for components, services, and helpers.
- Client-interactive screens must start with `"use client"`.
- Route files in `src/app/**/page.tsx` should be thin server components that parse `searchParams` and render the feature page.
- Role demo behavior uses `UserRole = "admin" | "receptionist" | "dentist"` from `src/types/index.ts`.
- The shared shell is `src/components/layout/app-shell.tsx`; update navigation there when adding real screens.
- Prefer local component state for mock UI interactions. Do not add global state management unless real cross-screen state needs it.
- CSS is currently centralized in `src/app/globals.css`. Follow the existing module-prefixed class naming pattern such as `.billing-*`, `.inventory-*`, `.doctor-*`, `.notifications-*`.
- Use `lucide-react` icons for UI affordances.
- Use semantic HTML, visible labels, `aria-label`, `aria-labelledby`, `role="status"`, and clear focusable controls.
- Preserve responsive behavior with explicit grids, wrapping, horizontal overflow for dense tables/lists, and mobile stacking.
- Keep cards at modest radius, restrained borders, calm colors, and no decorative gradient/orb-heavy UI.
- Keep text in English for current prototype copy. Arabic is currently represented inside notification templates and RTL text fields, not full app localization.

## Project-Specific MVP Boundaries

- MVP is one branch only; data structures should not block future branches, but no multi-branch management UI is required.
- Appointment lifecycle status is separate from visit/queue state.
- Dentist clinical access is simplified for MVP: dentist can view patients who have appointments with them and relevant history; do not build a separate authorization workflow yet.
- Receptionists must not access detailed clinical notes, diagnoses, odontogram details, X-rays, or clinical attachments.
- Inventory MVP is lightweight: items, stock levels, suppliers, goods receipts, manual adjustments, alerts, movement history. No automatic treatment consumption or unit-conversion UI.
- Notifications MVP is email-only. SMS, WhatsApp, delivery retry infrastructure, marketing, and advanced consent workflows are Phase 2.
- Billing MVP supports drafts, finalization, partial payments, discounts, refunds, write-offs, patient statements, and basic financial reporting later. Formal credit notes are Phase 2 unless legally required.
- Legal/compliance items remain open: Egyptian data residency, retention periods, e-invoicing/e-receipt obligations, and clinic-specific consent/privacy requirements. Do not claim legal compliance from technical controls alone.

## Environment Commands

- Install dependencies: `npm install`
- Run dev server: `npm run dev -- --hostname 127.0.0.1 --port 3000`
- Lint: `npm run lint`
- Type-check: `npx tsc --noEmit`
- Build: `npm run build`

If build fails on Windows/OneDrive due to `.next` file locks, stop the dev server and retry. Do not delete broad directories or reset git state without explicit approval.
