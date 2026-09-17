# DCMS Project Status

Last updated: 2026-09-15 (Antigravity handoff — TASK-001 Reports complete)

## Project Overview

DCMS is a Dental Clinic Management System MVP for one clinic branch. Target users are Admins, Receptionists, and Dentists. The approved MVP workflow is:

Patient Registration -> Appointment Booking -> Check-in -> Waiting Queue -> Dentist Visit -> Clinical Record -> Treatment -> Invoice -> Payment -> Receipt -> Patient History

The repository is currently an advanced **frontend prototype**. It demonstrates the approved UI/UX and major business rules with typed mock data and local React state. It does **not** yet include a backend, database, real authentication, real RBAC enforcement, API calls, email delivery, payments, file storage, deployment, or automated tests.

Approximate state: the frontend screen prototype is about **65-70% complete** for the approved MVP screens; the production system is much earlier because persistence, security, integrations, tests, and deployment are not implemented.

## Technology Stack

| Area | Current State |
| --- | --- |
| Language | TypeScript |
| Framework | Next.js `^16.0.0` App Router |
| UI | React `^19.0.0` |
| Icons | `lucide-react ^0.468.0` |
| Styling | Plain CSS in `src/app/globals.css` |
| Linting | ESLint `^9.0.0`, `eslint-config-next ^16.0.0` |
| Type Checking | TypeScript `^5.0.0`, strict mode |
| Backend | Not implemented |
| Database | Not implemented |
| Authentication | Mock email/password and mock Admin MFA UI only |
| External Services | None implemented |
| Tests | None |

## Architecture

The app uses Next.js App Router. Route files under `src/app/**/page.tsx` are thin server components that parse `searchParams` and render feature-level screen components.

Feature code is organized under `src/features/<domain>`:

- `*.types.ts` for domain types.
- `pages/*-screen.tsx` for main interactive screens.
- `components/*.tsx` for feature-specific UI pieces.
- `services/mock-*-service.ts` for mock fixtures and small helpers.

Shared code:

- `src/components/layout/app-shell.tsx`: shared shell, sidebar, header, global search placeholder, demo role switcher.
- `src/components/ui/button.tsx`: button wrapper.
- `src/components/ui/text-input.tsx`: input wrapper with error display.
- `src/lib/utils.ts`: `classNames`.
- `src/types/index.ts`: `UserRole = "admin" | "receptionist" | "dentist"`.

State and data flow:

- Local React state only.
- Mock data imported from feature services.
- No API calls.
- No persistence. Refreshing resets local changes.
- Role behavior is demo-only through query string and the role switcher.

## Important Decisions To Preserve

| Decision | Why | Where |
| --- | --- | --- |
| Feature-folder structure | Keeps modules isolated and reviewable | `src/features/*` |
| Thin route wrappers | Keeps routing separate from UI logic | `src/app/**/page.tsx` |
| Mock data isolated in services | Makes later API replacement easier | `services/mock-*-service.ts` |
| Shared role-aware shell | Consistent layout and RBAC navigation | `src/components/layout/app-shell.tsx` |
| Appointment status separated from visit state | Approved MVP correction | `src/features/appointments/appointment.types.ts` |
| Receptionists blocked from detailed clinical data | Least privilege | Patient profile tabs |
| Dentists blocked from financial/inventory/admin screens | Least privilege | Billing, Inventory, Doctors, Notifications |
| Finalized records/invoices represented as immutable | Auditability | Patient Profile and Billing copy |
| Inventory excludes treatment-based consumption | MVP scope correction | Inventory screen |
| Notifications are email-only | MVP scope correction | Notifications screen |
| Module-prefixed global CSS | Prevents collisions in a single CSS file | `src/app/globals.css` |

## Current Git State

Before this handoff task:

- Branch: `dev`
- `git status --short --branch`: clean
- Recent commits:
  - `28f1807 Finalize notifications screen UI`
  - `b142892 Finalize doctors screen UI`
  - `77a96b8 Finalize inventory UI`
  - `1b90061 Finalize billing UI`
  - `0f80064 Finalize patient profile screen IU`

This handoff task intentionally changes documentation only:

- `AGENTS.md`
- `PROJECT_STATUS.md`
- `IMPLEMENTATION_PLAN.md`

## Completed Frontend Screens

### Login

Files:

- `src/app/page.tsx`
- `src/features/auth/pages/login-screen.tsx`
- `src/features/auth/components/login-form.tsx`
- `src/features/auth/hooks/use-login-form.ts`
- `src/features/auth/services/mock-auth-service.ts`
- `src/features/auth/auth.types.ts`

Implemented:

- Email/password UI.
- Demo accounts.
- Mock credential validation.
- Mock Admin MFA-required UI.
- TOTP and recovery-code UI affordances.

Limitations:

- No real auth.
- TOTP code is not validated.
- Forgot password and recovery-code flows are not implemented.
- No session persistence.

Tests: none.

### Dashboard

Files:

- `src/app/dashboard/page.tsx`
- `src/features/dashboard/*`

Implemented:

- Role-specific Admin, Receptionist, and Dentist dashboards.
- Metrics, appointment list, quick actions, attention panels, dentist current patient section.

Limitations:

- Static dates and mock data.
- Quick-action buttons mostly do not navigate.

Tests: none.

### Appointment Calendar

Files:

- `src/app/calendar/page.tsx`
- `src/features/appointments/pages/calendar-screen.tsx`
- `src/features/appointments/components/*`
- `src/features/appointments/services/mock-calendar-service.ts`
- `src/features/appointments/appointment.types.ts`

Implemented:

- Day/week toggle.
- Dentist and appointment-type filters.
- Appointment cards with lifecycle status and visit state.
- Detail panel with role-based actions.
- New appointment link for non-dentists.

Limitations:

- No real scheduler engine.
- No drag/drop.
- Status actions are visual only.
- Week view is a visual variant, not a true week calendar.

Tests: none.

### New Appointment Form

Files:

- `src/app/appointments/new/page.tsx`
- `src/features/appointments/pages/new-appointment-screen.tsx`
- `src/features/appointments/components/patient-selector.tsx`
- `src/features/appointments/components/slot-picker.tsx`
- `src/features/appointments/services/mock-booking-service.ts`

Implemented:

- Three-step booking flow.
- Patient search/select and create-new-patient UI.
- Dentist/type/date/duration/chair/notes/slot fields.
- Mock conflict warning and Admin override toggle.
- Success state.

Limitations:

- Submitted appointments are not persisted or reflected on calendar.
- Override reason/audit is not persisted.
- Validation is basic.

Tests: none.

### Patient Profile

Files:

- `src/app/patients/mariam-adel/page.tsx`
- `src/features/patients/*`

Implemented:

- Single patient profile for Mariam Adel.
- Role-specific tabs.
- Receptionist sees operational/financial tabs only.
- Dentist sees clinical tabs and attachments, not financial tabs.
- Basic odontogram preview.

Limitations:

- Only one hard-coded patient route.
- No real clinical workspace/editor.
- No upload/download.
- No audit logging.

Tests: none.

### Billing

Files:

- `src/app/billing/page.tsx`
- `src/features/billing/*`

Implemented:

- Admin/Receptionist billing workspace.
- Dentist restricted state.
- Invoice list/detail.
- Draft invoices, add mock services, discount toggle, finalization.
- Payment collection with Cash/Card/Bank transfer.
- Partial payment and balance updates.
- Admin-only void/refund/write-off mock actions.

Limitations:

- No invoice/receipt PDF yet.
- No patient selector for new invoice.
- No tax configuration.
- Financial corrections are local-only and not audited.

Tests: none.

### Inventory

Files:

- `src/app/inventory/page.tsx`
- `src/features/inventory/*`

Implemented:

- Admin-only inventory workspace.
- Stock table/search/detail.
- Low-stock/out-of-stock/expiry alerts.
- Suppliers, goods receipts, stock movements tabs.
- Goods receipt form.
- Manual adjustment form with negative-stock block.

Limitations:

- Local-only state.
- Expiry status is hard-coded for one mock date.
- No unit conversion.
- No treatment-based consumption.
- No full procurement/AP workflow.

Tests: none.

### Doctor Schedule

Files:

- `src/app/doctors/page.tsx`
- `src/features/doctors/*`

Implemented:

- Admin-only doctor schedule settings.
- Doctor list/profile.
- Working hours and breaks.
- Availability preview.
- Leave/blocked slots.
- Persistent blocked-time form.

Limitations:

- Local-only state.
- Added blocked time does not update availability slots.
- No staff account management.
- No conflict engine.

Tests: none.

### Notifications

Files:

- `src/app/notifications/page.tsx`
- `src/features/notifications/*`

Implemented:

- Admin-only email notification settings.
- Email channel toggle.
- Reminder timing.
- Sender/reply-to settings.
- Upcoming email queue preview.
- Arabic/English template editor with RTL fields for Arabic.

Limitations:

- No real email provider.
- Template edits are local-only.
- "Appointment confirmation" and "Appointment rescheduling" have zero mock templates and currently fall back to the first template.
- No delivery tracking/retry/SMS/WhatsApp by design for MVP.

Tests: none.

### Reports

Files:

- `src/app/reports/page.tsx`
- `src/features/reports/reports.types.ts`
- `src/features/reports/services/mock-reports-service.ts`
- `src/features/reports/pages/reports-screen.tsx`

Implemented:

- Admin full reports dashboard with tabbed sections: Overview, Appointments, Revenue, Balances, Inventory.
- Today's metrics: appointments, revenue, outstanding balances, inventory alerts.
- Appointment status breakdown table with visual percentage bars.
- Payment method summary with share calculations.
- Revenue by dentist and revenue by treatment tables.
- Outstanding patient balances with totals.
- Inventory alert table (low stock, out of stock, expiring).
- CSV export buttons (mock UI affordances; alert explains backend is required).
- Receptionist limited view: appointment summary only.
- Dentist restricted state.
- Admin sidebar "Reports" link wired to `/reports`.
- Admin sidebar "Settings" and "Audit logs" links pre-wired to `/settings` and `/audit-logs`.
- Receptionist sidebar now includes "Reports" link.
- `/reports`, `/reports?role=receptionist`, `/reports?role=dentist` all return 200.

Limitations:

- Mock data only; no date filters or historical range queries.
- CSV export is a UI affordance only.

Tests: none.

### Settings

Files:

- `src/app/settings/page.tsx`
- `src/features/settings/settings.types.ts`
- `src/features/settings/services/mock-settings-service.ts`
- `src/features/settings/pages/settings-screen.tsx`

Implemented:

- Admin-only two-column settings workspace (sidebar nav + detail panel).
- 11 sections: Clinic information, Language, Appointment types, Services, Working hours, Appointment rules, Billing/tax, Notification templates link, User management, Security, Audit settings.
- Clinic information: editable form saved to local state.
- Appointment types: table with inline activate/deactivate toggles.
- Services: table with inline activate/deactivate toggles.
- Working hours: read-only table (editing requires backend to avoid booking conflicts).
- Appointment rules: editable form with numeric fields and toggle switches.
- Billing/tax: editable form for currency, tax rate, prefix, payment terms; e-invoicing compliance boundary clearly noted.
- Notifications: redirects to the dedicated Notifications workspace.
- User management: read-only table with role badges and MFA status; edit actions deferred to backend phase.
- Security: editable form for session timeout, password policy, MFA requirements; enforcement boundary clearly noted.
- Audit settings: informational panel with retention, access logging, and compliance boundary notes.
- Language and i18n shown as Phase 2 informational panel.
- Receptionist and Dentist roles see restricted/permission-state.
- `/settings`, `/settings?role=receptionist`, `/settings?role=dentist` all return 200.

Limitations:

- All saves are local state only — reset on refresh.
- No real user invite/deactivate/password-reset flows.
- No real tax, compliance, or i18n enforcement.

Tests: none.

### Audit Logs

Files:

- `src/app/audit-logs/page.tsx`
- `src/features/audit-logs/audit-logs.types.ts`
- `src/features/audit-logs/services/mock-audit-logs-service.ts`
- `src/features/audit-logs/pages/audit-logs-screen.tsx`

Implemented:

- Admin-only audit log workspace.
- 15 mock events covering: clinical record view, attachment download, admin override, invoice void, write-off, partial payment, inventory adjustment, goods receipt, CSV export, login success, login lockout, login by receptionist, clinical record finalization, settings change, and RBAC denial.
- Summary chips (Success / Warning / Denied / Total) — clickable to filter by result.
- Search bar filtering by action, user, entity, or module text.
- Module dropdown filter (Clinical, Billing, Inventory, Appointments, Auth, Reports, Settings).
- Result dropdown filter (All, Success, Warning, Denied).
- Clear-filters button when filters are active.
- Filterable event list with module colour-coded icons and result badges.
- Selected-event detail panel: module, timestamp, user + role badge, entity, IP address, full narrative, result callout (RBAC blocked / Admin review), and immutability notice.
- Non-admin roles see permission-state restricted view.
- `/audit-logs`, `?role=receptionist`, `?role=dentist` all return 200.

Limitations:

- Mock data only — 15 static events, no real-time ingestion.
- No date-range filter (requires backend).
- No export of audit log itself.

Tests: none.

### Clinical Workspace / Current Visit

Files:

- `src/app/clinical/current-visit/page.tsx`
- `src/features/clinical/clinical.types.ts`
- `src/features/clinical/services/mock-clinical-service.ts`
- `src/features/clinical/pages/clinical-workspace-screen.tsx`
- `src/components/layout/app-shell.tsx`
- `src/features/dashboard/components/dashboard-aside.tsx`
- `src/features/patients/pages/patient-profile-screen.tsx`

Implemented:

- Dedicated dentist current visit workspace for active visits.
- Patient identity & summary banner with prominent medical alerts / Penicillin allergy warnings.
- Appointment metadata: chair, time, visit state, arrival duration.
- Clinical Chief Complaint and SOAP examination notes (Subjective, Objective, Assessment, Plan).
- Diagnosis selection with ICD codes and affected tooth tag.
- Performed treatment documentation with procedure catalog, tooth targeting, administered materials/anesthesia, notes, and procedure removal.
- Treatment plan reference card showing plan ID, progress bar, and next planned clinical step.
- Interactive 32-adult-tooth Odontogram chart with active tooth highlight and tooth click targeting.
- Radiographs & attachments viewer cards with mock diagnostic viewer modal.
- Post-op instructions, prescriptions, and next visit recommendations.
- Finalization workflow: confirmation modal with legal/audit warning; permanently locks the clinical record into an immutable document.
- Audited Addendum / Amendment workflow: append timestamped, clinician-attributed addenda with audit justification to finalized records without altering original clinical documentation.
- Role-based security:
  - Receptionists are blocked with a `permission-state` screen in compliance with medical privacy rules.
  - Admins view with a supervisory audit notification banner.
- Seamless navigation links connected:
  - AppShell dentist navigation: "Clinical records" -> `/clinical/current-visit?role=dentist`
  - Dentist dashboard: "Start visit" -> `/clinical/current-visit?role=dentist`
  - Patient profile: "Open current visit" -> `/clinical/current-visit?role=dentist`
- All route variations (`/clinical/current-visit`, `?role=dentist`, `?role=admin`, `?role=receptionist`) return 200.

Limitations:

- Mock data only — local state resets on refresh.
- Real attachment storage and image processing require backend.

Tests: none.

## Partially Completed Or Prototype-Only Areas

- Authentication and Admin MFA: UI only.
- RBAC: UI simulation only, no server enforcement.
- Clinical workflow: dedicated current visit workspace and patient profile tabs exist; multi-visit timeline editor is Phase 2.
- Odontogram: visual charting and tooth selector exist, advanced restorative graphic editor is Phase 2.
- Billing: no PDFs, compliance layer, numbering, backend, or persistence.
- Inventory: no persistence or advanced stock rules.
- Notifications: no sending.
- Services, Patient List, CSV Import: not implemented.

## Known Bugs / Problems

Confirmed:

- No automated tests.
- No backend/API/database.
- No production security.
- `src/app/globals.css` is large and monolithic.
- Navigation placeholder without route: Services.
- Global search is visual only.
- Notification events with no template fallback incorrectly show an unrelated template.
- Inventory expiry logic is hard-coded.
- Dashboard quick actions mostly do nothing.
- Patient route is hard-coded to `/patients/mariam-adel`.

Risks:

- Many dates are static mock dates around September 2026.
- Windows/OneDrive may lock `.next` during builds if dev server is running.
- Several existing files use compressed JSX formatting. Avoid broad formatting-only diffs unless approved.

## Not Started

- Services/appointment types screen.
- Patient list and generic patient routing.
- Dedicated odontogram editor.
- CSV patient import.
- Invoice/receipt PDF generation.
- Backend/API/database/auth.
- Secure attachment storage.
- Real email integration.
- Automated tests.
- Deployment configuration.

## Important Files Map

| Area | Path | Purpose | Importance |
| --- | --- | --- | --- |
| Agent rules | `AGENTS.md` | Permanent coding-agent instructions | Critical |
| Project status | `PROJECT_STATUS.md` | Current repo state | Critical |
| Plan | `IMPLEMENTATION_PLAN.md` | Remaining work | Critical |
| Package config | `package.json` | Scripts/dependencies | Critical |
| TS config | `tsconfig.json` | Strict TS and path aliases | Critical |
| ESLint | `eslint.config.mjs` | Lint config | High |
| Root layout | `src/app/layout.tsx` | Metadata/global CSS | High |
| Global CSS | `src/app/globals.css` | All screen styling | Critical |
| App shell | `src/components/layout/app-shell.tsx` | Sidebar/header/roles | Critical |
| Shared UI | `src/components/ui/*` | Button/TextInput | Medium |
| Global types | `src/types/index.ts` | UserRole | Critical |
| Auth | `src/features/auth/*` | Login/MFA mock | High |
| Dashboard | `src/features/dashboard/*` | Role dashboards | High |
| Appointments | `src/features/appointments/*` | Calendar/booking | Critical |
| Patients | `src/features/patients/*` | Patient profile | Critical |
| Billing | `src/features/billing/*` | Invoices/payments | Critical |
| Inventory | `src/features/inventory/*` | Stock/supplies | High |
| Doctors | `src/features/doctors/*` | Schedule settings | High |
| Notifications | `src/features/notifications/*` | Email templates/settings | High |

## APIs And Data Contracts

No API routes exist.

Current contracts are TypeScript mock/UI contracts:

- `src/types/index.ts`
- `src/features/appointments/appointment.types.ts`
- `src/features/patients/patient.types.ts`
- `src/features/billing/billing.types.ts`
- `src/features/inventory/inventory.types.ts`
- `src/features/doctors/doctor-schedule.types.ts`
- `src/features/notifications/notification.types.ts`

Do not treat mock types as final database schema without a separate backend/database design phase.

## Database / Data Model

No database, ORM, migrations, seed scripts, or schemas exist. Mock data files are UI fixtures only.

## Testing Status

Existing test framework: none.

Current validation commands:

```bash
npm run lint
npx tsc --noEmit
```

Manual route smoke checks have been used with `Invoke-WebRequest` and browser preview.

## Environment And Commands

```bash
npm install
npm run dev -- --hostname 127.0.0.1 --port 3000
npm run lint
npx tsc --noEmit
npm run build
```

No environment variables are currently required.

## Antigravity Startup Procedure

1. Read `AGENTS.md`.
2. Read `PROJECT_STATUS.md`.
3. Read `IMPLEMENTATION_PLAN.md`.
4. Run `git status --short --branch`.
5. Run `npm run lint`.
6. Run `npx tsc --noEmit`.
7. Start the dev server.
8. Inspect existing implementation for the next task before editing.
9. Implement one task at a time.
10. Verify route behavior and responsive UI.
11. Re-run lint/type-check.
12. Update documentation if the project state changes materially.
