# DCMS Implementation Plan

Last updated: 2026-09-15

## Execution Order

The current codebase is a frontend-only mock prototype. Continue in this order:

1. Finish remaining approved MVP frontend screens.
2. Add tests for role visibility and critical UI workflows.
3. Improve cross-screen navigation and placeholder actions.
4. Only after explicit approval, design backend/database/API.
5. Replace mock services feature by feature.
6. Add integration/E2E tests for the full clinic workflow.

Do not start backend/schema/auth integration work until the user explicitly approves that phase.

## P0

No P0 blockers are currently known. Latest implemented frontend screens passed lint and type-check before this handoff.

## P1 Tasks

### TASK-001: Reports Screen ✅ COMPLETE

Priority: P1
Feature: Reports
Current state: **Implemented.** All acceptance criteria met.

Implemented files:

- `src/app/reports/page.tsx` — thin route wrapper.
- `src/features/reports/reports.types.ts` — domain types.
- `src/features/reports/services/mock-reports-service.ts` — mock fixtures.
- `src/features/reports/pages/reports-screen.tsx` — full screen component.
- `src/components/layout/app-shell.tsx` — Reports, Settings, Audit logs links wired; receptionist Reports link added.
- `src/app/globals.css` — `.reports-*` styles added.

Acceptance criteria:

- `/reports` → 200 ✅
- `/reports?role=receptionist` → 200 ✅
- `/reports?role=dentist` → 200 ✅
- Admin sees full report dashboard ✅
- Non-admin roles restricted appropriately ✅
- CSV export affordances visible but clearly mock ✅
- Responsive behavior ✅

### TASK-002: Settings Screen ✅ COMPLETE

Priority: P1
Feature: Settings
Current state: **Implemented.** All acceptance criteria met.

Implemented files:

- `src/app/settings/page.tsx` — thin route wrapper.
- `src/features/settings/settings.types.ts` — domain types for all 11 sections.
- `src/features/settings/services/mock-settings-service.ts` — mock fixture data.
- `src/features/settings/pages/settings-screen.tsx` — full screen component.
- `src/app/globals.css` — `.settings-*` styles added.

Acceptance criteria:

- `/settings` → 200 ✅
- `/settings?role=receptionist` → 200 ✅
- `/settings?role=dentist` → 200 ✅
- Admin sees full settings structure with all 11 sections ✅
- Non-admin roles see restricted/permission-state ✅
- Phase 2 features (Language, i18n, real auth, real tax) shown as informational panels only ✅
- Lint and tsc pass clean ✅

### TASK-003: Audit Logs Screen ✅ COMPLETE

Priority: P1
Feature: Audit Logs
Current state: **Implemented.** All acceptance criteria met.

Implemented files:

- `src/app/audit-logs/page.tsx` — thin route wrapper.
- `src/features/audit-logs/audit-logs.types.ts` — AuditEvent and filter types.
- `src/features/audit-logs/services/mock-audit-logs-service.ts` — 15 realistic mock events.
- `src/features/audit-logs/pages/audit-logs-screen.tsx` — full screen component.
- `src/app/globals.css` — `.audit-*` styles added.

Acceptance criteria:

- `/audit-logs` → 200 ✅
- `/audit-logs?role=receptionist` → 200 ✅
- `/audit-logs?role=dentist` → 200 ✅
- Admin can inspect mock audit events with search + module + result filters ✅
- All required event types covered: clinical view, attachment download, admin override, invoice void/write-off, payment, inventory adjustment, goods receipt, CSV export, login success/failure/lockout, RBAC denial ✅
- Selected-event detail panel shows all 6 columns plus narrative + immutability notice ✅
- Denied events show RBAC callout; Warning events show review callout ✅
- Non-admin roles see permission-state restricted view ✅
- Lint and tsc pass clean ✅

### TASK-004: Clinical Workspace / Current Visit ✅ COMPLETE

Priority: P1
Feature: Clinical Workspace
Current state: **Implemented.** All acceptance criteria met.

Implemented files:

- `src/app/clinical/current-visit/page.tsx` — thin route wrapper for current visit workspace.
- `src/features/clinical/clinical.types.ts` — domain types for visit records, SOAP notes, diagnoses, procedures, and amendments.
- `src/features/clinical/services/mock-clinical-service.ts` — mock visit data and clinical catalogs.
- `src/features/clinical/pages/clinical-workspace-screen.tsx` — interactive clinical workspace.
- `src/components/layout/app-shell.tsx` — connected dentist "Clinical records" navigation.
- `src/features/dashboard/components/dashboard-aside.tsx` — connected dentist "Start visit" action.
- `src/features/patients/pages/patient-profile-screen.tsx` — connected dentist "Open current visit" action.
- `src/app/globals.css` — `.clinical-*` styles added with responsive breakpoints.

Acceptance criteria:

- `/clinical/current-visit` → 200 ✅
- `/clinical/current-visit?role=dentist` → 200 ✅
- `/clinical/current-visit?role=admin` → 200 ✅
- `/clinical/current-visit?role=receptionist` → 200 ✅
- Dentist can open and document a current visit with SOAP notes, diagnosis, performed procedures, and odontogram interaction ✅
- Admin sees supervisory audit banner ✅
- Receptionist is blocked with permission-state restricted screen ✅
- Finalization permanently locks the clinical record into an immutable document with Add Addendum / amendment support ✅
- Lint and tsc pass clean ✅

## P2 Tasks

### TASK-005: Services / Appointment Types ✅ COMPLETE

Priority: P2
Current state: **Implemented.** All acceptance criteria met.

Implemented files:
- `src/app/services/page.tsx` — thin route wrapper.
- `src/features/services/services.types.ts` — domain types for procedures, categories, and appointment templates.
- `src/features/services/services/mock-services-service.ts` — CDT codes, procedure catalog, and appointment types.
- `src/features/services/pages/services-screen.tsx` — full tabbed management screen with search, category/status filters, active toggles, and add/edit modals.
- `src/styles/services.css` — modular stylesheet imported in `src/app/globals.css`.
- `src/components/layout/app-shell.tsx` — wired admin sidebar link to `/services`.

Acceptance criteria:
- `/services` → 200 ✅
- `/services?role=admin` → 200 ✅
- `/services?role=receptionist` → 200 ✅ (permission-state restricted)
- `/services?role=dentist` → 200 ✅ (permission-state restricted)
- Admin can view, search, filter by category, and mock-edit services and appointment types ✅
- Add procedure modal with CDT code, name, category, default fee, and duration ✅
- Add appointment template modal with duration, fee, and calendar color badge ✅
- Active/inactive toggle with instant UI feedback ✅
- Non-admin roles properly restricted ✅
- Lint and tsc pass clean ✅

### TASK-006: Patient List

Priority: P2  
Current state: Only `/patients/mariam-adel` exists.  
Expected behavior: Patient list/search route.

Remaining:

- Add `/patients` route.
- Add patient list mock service.
- Update AppShell Patients link from hard-coded profile to `/patients`.
- Link list rows to `/patients/mariam-adel` until dynamic routing exists.
- Include search/filter and patient columns: name, mobile, DOB, last visit, next appointment, balance, status.

Acceptance criteria:

- Role-appropriate columns/actions.
- Global patient workflow no longer depends only on direct Mariam Adel link.

### TASK-007: CSV Patient Import

Priority: P2  
Current state: Not implemented. Optional MVP feature.  
Expected behavior: Admin-only import UI if confirmed for launch.

Remaining:

- Upload -> validate -> preview -> duplicate detection -> Admin approval -> commit.
- Show invalid rows, warnings, duplicate handling, import progress, failed-row reporting.
- Keep commit mock-only until backend exists.

Acceptance criteria:

- Admin-only.
- No direct production import behavior.

### TASK-008: Invoice/Receipt PDF Affordance

Priority: P2  
Current state: Billing has no PDF print/download UI.  
Expected behavior: Add invoice/receipt print/download affordances and preview layout.

Remaining:

- Add buttons for finalized invoices/receipts.
- Add print-friendly invoice/receipt preview surface.
- Do not claim Egyptian e-invoice/e-receipt compliance.
- Real PDF generation should be approved before adding a dependency.

Acceptance criteria:

- Users can see where invoice/receipt PDF actions will live.
- Compliance boundary remains clear.

### TASK-009: Frontend Tests

Priority: P2  
Current state: No test framework.  
Expected behavior: Add tests after user approves framework/dependency choice.

Remaining:

- Choose testing approach.
- Add test command to `package.json`.
- Test role-restricted screens.
- Test key form validation:
  - Login missing credentials.
  - Appointment conflict.
  - Billing payment amount validation.
  - Inventory negative stock block.
  - Notifications template save validation.

Acceptance criteria:

- Tests run locally.
- No false completion without test verification.

## P3 Tasks

### TASK-010: CSS Maintainability ✅ COMPLETE

Priority: P3
Current state: **Implemented.** `src/app/globals.css` split into 15 domain modules under `src/styles/` with clean `@import` manifest.

Implemented files:
- `src/styles/variables.css` — CSS custom properties (:root design tokens)
- `src/styles/base.css` — resets, typography, button utilities, shared form controls, and permission-state
- `src/styles/layout.css` — app shell, navigation, header, search bar, role switcher, mobile nav
- `src/styles/auth.css` — login, brand banner, MFA card, demo credentials
- `src/styles/dashboard.css` — metrics, queue list, attention panel, quick actions, current patient
- `src/styles/appointments.css` — calendar boards, day/week view, booking wizard, slot picker
- `src/styles/patients.css` — profile header, clinical timeline, tooth chart preview, ledger
- `src/styles/billing.css` — invoices, payment collection, write-offs, totals
- `src/styles/inventory.css` — stock tables, movement history, goods receipts, adjustments
- `src/styles/doctors.css` — doctor schedule, working hours, availability slots
- `src/styles/notifications.css` — email settings, template editor, RTL text fields
- `src/styles/reports.css` — operational & financial reports, breakdown tables
- `src/styles/settings.css` — 11-section settings workspace, forms, audit info
- `src/styles/audit-logs.css` — event summary chips, filter toolbar, event list, detail inspector
- `src/styles/clinical.css` — SOAP examination notes, diagnosis selector, procedure list, odontogram, attachments
- `src/app/globals.css` — central manifest importing all 15 modular stylesheets in strict cascade order

Verification:
- `npm run lint`: passed (0 errors)
- `npx tsc --noEmit`: passed (0 errors)
- `npm run build`: passed (all 15 routes compiled & static pages generated)
- Route HTTP checks: all 12 major routes return 200 OK

### TASK-011: Full Arabic/English Localization

Priority: P3  
Current state: UI is English; Arabic appears only in notification templates and RTL fields.  
Expected behavior: Full i18n/RTL support in a later phase.

Remaining:

- Choose i18n strategy.
- Replace hard-coded strings.
- Add language switch behavior.
- Mirror layouts with logical CSS properties.
- Localize dates/numbers/currency.

## Backend / Production Phase Tasks

These require explicit approval before starting.

### TASK-012: Real Authentication/RBAC

Priority: P1 after backend approval  
Current state: Mock auth only.  
Expected behavior: Email/password, secure reset, Admin mandatory TOTP, recovery codes, inactive-user preservation, server-enforced RBAC.

### TASK-013: Database/API

Priority: P1 after backend approval  
Current state: None.  
Expected behavior: Production data model and API for patients, appointments, clinical records, billing, inventory, notifications, and audit logs.

### TASK-014: Audit Persistence

Priority: P1 after backend approval  
Current state: UI copy and future audit screen only.  
Expected behavior: Persist access/mutation audit events, including clinical view/download/export and Admin overrides.

### TASK-015: Secure File Storage

Priority: P1 after backend approval  
Current state: Attachment UI only.  
Expected behavior: Private storage for X-rays/documents/images with controlled access.

### TASK-016: Email Provider Integration

Priority: P2 after backend approval  
Current state: Notification settings/templates UI only.  
Expected behavior: Send booking/confirmation/rescheduling/cancellation/reminder emails.

## Explicitly Out Of Scope Unless Reapproved

- Multiple active branches UI.
- Cross-branch dentist assignments.
- Patient portal.
- Patient self-booking.
- WhatsApp.
- SMS.
- Online payments.
- Insurance.
- Accounting integration.
- Advanced analytics.
- Advanced odontogram.
- Primary teeth support.
- Automatic treatment-based inventory consumption.
- Advanced unit conversions.
- Inventory valuation/profit margins.
- Full procurement workflow.
- Supplier accounts payable.
- Credit notes unless legal/tax review requires them for launch.
- Excel/PDF report exports.
- Custom report builder.
- Automated waiting-list offers.
- Advanced notification delivery infrastructure.

## Next Action For Antigravity

**TASK-001, TASK-002, TASK-003, TASK-004, TASK-005, and TASK-010 all complete.** Continue with **TASK-006 Patient List (P2)**.

Before coding:

1. Read `AGENTS.md`.
2. Read `PROJECT_STATUS.md`.
3. Run `npm run lint`.
4. Run `npx tsc --noEmit`.
5. Inspect `src/features/patients/*` for patient structure and table patterns.
6. Implement `/patients` using the existing route + feature-folder + mock-service pattern.
