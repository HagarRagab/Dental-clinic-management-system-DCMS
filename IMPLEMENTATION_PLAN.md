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

### TASK-004: Clinical Workspace / Current Visit

Priority: P1  
Feature: Clinical Workspace  
Current state: Patient profile has clinical tabs, but there is no dedicated dentist visit workspace.  
Expected behavior: Dentist-focused current visit workflow.

Remaining:

- Add route after confirming path, e.g. `/clinical/current-visit`.
- Add `src/features/clinical/*`.
- Include patient summary, appointment information, medical flags, notes, diagnosis, performed treatment, treatment plan reference, attachments, and basic odontogram access.
- Add save draft/finalize actions.
- Make finalized clinical records immutable in UI.
- Provide amendment affordance.
- Block receptionist detailed clinical access.

Acceptance criteria:

- Dentist can open a current visit mock workspace.
- Admin may see with audited-override framing if included.
- Receptionist cannot see detailed clinical notes/diagnosis/attachments.
- Finalization/amendment behavior is clear.

Testing:

- `npm run lint`
- `npx tsc --noEmit`
- Browser preview for all roles.

## P2 Tasks

### TASK-005: Services / Appointment Types

Priority: P2  
Current state: Sidebar placeholder only; appointment types are hard-coded in mock arrays.  
Expected behavior: Admin UI for configurable appointment types and services.

Remaining:

- Add `/services` route and `src/features/services/*`.
- Wire sidebar link.
- Display appointment type name, default duration, default price, active/inactive status.
- Display service/procedure entries for later billing/treatment use.
- Add mock create/edit/activate/deactivate controls.

Acceptance criteria:

- Admin can view and mock-edit services/appointment types.
- Non-admin roles restricted.

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

### TASK-010: CSS Maintainability

Priority: P3  
Current state: `src/app/globals.css` is large and monolithic.  
Expected behavior: Keep it stable for now; split only after approval.

Remaining:

- Continue module-prefixed CSS additions.
- Avoid global refactor unless visual regression testing is possible.

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

**TASK-001, TASK-002, TASK-003 all complete.** Continue with **TASK-004 Clinical Workspace / Current Visit**.

Before coding:

1. Read `AGENTS.md`.
2. Read `PROJECT_STATUS.md`.
3. Run `npm run lint`.
4. Run `npx tsc --noEmit`.
5. Inspect `src/features/patients/*` for existing clinical tab patterns.
6. Implement `/clinical/current-visit` using the existing route + feature-folder + mock-service pattern.
