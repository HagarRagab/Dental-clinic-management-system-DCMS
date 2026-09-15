"use client";

import {
  BadgeCheck,
  Building2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Globe,
  Info,
  Languages,
  Lock,
  ReceiptText,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/types";
import type { SettingsSection } from "@/features/settings/settings.types";
import { mockSettingsData } from "@/features/settings/services/mock-settings-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";

type NavEntry = { section: SettingsSection; icon: typeof Settings; label: string; description: string };

const navEntries: NavEntry[] = [
  { section: "Clinic", icon: Building2, label: "Clinic information", description: "Name, address, contact, registration" },
  { section: "Language", icon: Languages, label: "Language & region", description: "Display language, date format" },
  { section: "Appointment types", icon: CalendarDays, label: "Appointment types", description: "Types, durations, default prices" },
  { section: "Services", icon: ClipboardList, label: "Services & procedures", description: "Service catalogue and pricing" },
  { section: "Working hours", icon: CalendarClock, label: "Working hours", description: "Branch open hours and breaks" },
  { section: "Appointment rules", icon: CalendarDays, label: "Appointment rules", description: "Booking windows, conflicts, confirmations" },
  { section: "Billing", icon: ReceiptText, label: "Billing & tax", description: "Currency, tax, invoice numbering" },
  { section: "Notifications", icon: Globe, label: "Notification templates", description: "Email events and sender settings" },
  { section: "Users", icon: Users, label: "User management", description: "Staff accounts and roles" },
  { section: "Security", icon: Lock, label: "Security", description: "Passwords, MFA, session timeouts" },
  { section: "Audit", icon: ShieldCheck, label: "Audit settings", description: "Retention, export, compliance notes" },
];

const PHASE2_NOTE = "This section is available for configuration after the backend is implemented.";

export function SettingsScreen({ initialRole }: { initialRole: UserRole }) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [active, setActive] = useState<SettingsSection>("Clinic");
  const [feedback, setFeedback] = useState("");
  const [clinic, setClinic] = useState(mockSettingsData.clinic);
  const [rules, setRules] = useState(mockSettingsData.appointmentRules);
  const [billing, setBilling] = useState(mockSettingsData.billing);
  const [security, setSecurity] = useState(mockSettingsData.security);
  const [apptTypes, setApptTypes] = useState(mockSettingsData.appointmentTypes);
  const [services, setServices] = useState(mockSettingsData.services);
  const [workingHours] = useState(mockSettingsData.workingHours);
  const [users] = useState(mockSettingsData.users);

  function showSaved() {
    setFeedback("Settings saved (mock — changes are local only and reset on refresh).");
  }

  function handleClinicSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setClinic({
      name: String(fd.get("name") ?? clinic.name),
      specialty: String(fd.get("specialty") ?? clinic.specialty),
      address: String(fd.get("address") ?? clinic.address),
      phone: String(fd.get("phone") ?? clinic.phone),
      email: String(fd.get("email") ?? clinic.email),
      registrationNumber: String(fd.get("registrationNumber") ?? clinic.registrationNumber),
      taxId: String(fd.get("taxId") ?? clinic.taxId),
      website: String(fd.get("website") ?? clinic.website),
    });
    showSaved();
  }

  function handleRulesSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setRules({
      defaultSlotMinutes: Number(fd.get("defaultSlotMinutes")) || rules.defaultSlotMinutes,
      minAdvanceBookingHours: Number(fd.get("minAdvanceBookingHours")) || rules.minAdvanceBookingHours,
      maxAdvanceBookingDays: Number(fd.get("maxAdvanceBookingDays")) || rules.maxAdvanceBookingDays,
      allowDoubleBooking: fd.get("allowDoubleBooking") === "on",
      requireAdminOverrideReason: fd.get("requireAdminOverrideReason") === "on",
      autoConfirm: fd.get("autoConfirm") === "on",
      cancellationCutoffHours: Number(fd.get("cancellationCutoffHours")) || rules.cancellationCutoffHours,
    });
    showSaved();
  }

  function handleBillingSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBilling({
      currency: String(fd.get("currency") ?? billing.currency),
      taxRate: Number(fd.get("taxRate") ?? billing.taxRate),
      taxLabel: String(fd.get("taxLabel") ?? billing.taxLabel),
      invoicePrefix: String(fd.get("invoicePrefix") ?? billing.invoicePrefix),
      receiptPrefix: String(fd.get("receiptPrefix") ?? billing.receiptPrefix),
      paymentTermsDays: Number(fd.get("paymentTermsDays") ?? billing.paymentTermsDays),
      allowPartialPayments: fd.get("allowPartialPayments") === "on",
    });
    showSaved();
  }

  function handleSecuritySave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSecurity({
      sessionTimeoutMinutes: Number(fd.get("sessionTimeoutMinutes")) || security.sessionTimeoutMinutes,
      passwordMinLength: Number(fd.get("passwordMinLength")) || security.passwordMinLength,
      requireUppercase: fd.get("requireUppercase") === "on",
      requireSpecialChar: fd.get("requireSpecialChar") === "on",
      mfaRequiredForAdmin: fd.get("mfaRequiredForAdmin") === "on",
      loginAttemptLockout: Number(fd.get("loginAttemptLockout")) || security.loginAttemptLockout,
    });
    showSaved();
  }

  const activeEntry = navEntries.find((n) => n.section === active)!;

  if (role !== "admin") {
    return (
      <AppShell activeItem="Settings" role={role} userName={dashboardUsers[role]} onRoleChange={setRole}>
        <section className="permission-state" aria-labelledby="settings-access-title">
          <span className="permission-state__icon"><ShieldAlert aria-hidden="true" /></span>
          <p className="page-heading__eyebrow">Restricted workspace</p>
          <h1 id="settings-access-title">Settings are admin-only</h1>
          <p>Clinic configuration is available to Admins only. Contact your system administrator if you need a setting changed.</p>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell activeItem="Settings" role={role} userName={dashboardUsers[role]} onRoleChange={setRole}>
      <header className="page-heading">
        <div>
          <p className="page-heading__eyebrow">Clinic configuration</p>
          <h1>Settings</h1>
          <p>Manage clinic-wide configuration. Changes are local and reset on refresh until a backend is connected.</p>
        </div>
      </header>

      {feedback ? (
        <p className="settings-feedback" role="status">
          <CheckCircle2 aria-hidden="true" />
          {feedback}
          <button type="button" aria-label="Dismiss message" onClick={() => setFeedback("")}><X aria-hidden="true" /></button>
        </p>
      ) : null}

      <div className="settings-layout">
        {/* ── Sidebar nav ── */}
        <nav className="settings-nav" aria-label="Settings sections">
          {navEntries.map(({ section, icon: Icon, label, description }) => (
            <button
              key={section}
              type="button"
              className={`settings-nav__item${active === section ? " settings-nav__item--active" : ""}`}
              aria-current={active === section ? "page" : undefined}
              onClick={() => setActive(section)}
            >
              <span className="settings-nav__icon"><Icon aria-hidden="true" /></span>
              <span>
                <strong>{label}</strong>
                <small>{description}</small>
              </span>
              <ChevronRight aria-hidden="true" className="settings-nav__chevron" />
            </button>
          ))}
        </nav>

        {/* ── Detail panel ── */}
        <div className="settings-detail">
          <div className="settings-detail__header">
            <span className="settings-detail__icon">
              <activeEntry.icon aria-hidden="true" />
            </span>
            <div>
              <h2>{activeEntry.label}</h2>
              <p>{activeEntry.description}</p>
            </div>
          </div>

          {/* ── Clinic information ── */}
          {active === "Clinic" && (
            <form className="settings-form" onSubmit={handleClinicSave}>
              <div className="settings-form__grid">
                <label>
                  <span>Clinic name</span>
                  <input name="name" type="text" defaultValue={clinic.name} required />
                </label>
                <label>
                  <span>Specialty</span>
                  <input name="specialty" type="text" defaultValue={clinic.specialty} />
                </label>
                <label className="settings-form__full">
                  <span>Address</span>
                  <input name="address" type="text" defaultValue={clinic.address} />
                </label>
                <label>
                  <span>Phone</span>
                  <input name="phone" type="tel" defaultValue={clinic.phone} />
                </label>
                <label>
                  <span>Email</span>
                  <input name="email" type="email" defaultValue={clinic.email} />
                </label>
                <label>
                  <span>Registration number</span>
                  <input name="registrationNumber" type="text" defaultValue={clinic.registrationNumber} />
                </label>
                <label>
                  <span>Tax ID</span>
                  <input name="taxId" type="text" defaultValue={clinic.taxId} />
                </label>
                <label>
                  <span>Website</span>
                  <input name="website" type="url" defaultValue={clinic.website} />
                </label>
              </div>
              <div className="settings-form__actions">
                <button type="submit" className="button button--primary">Save clinic information</button>
              </div>
            </form>
          )}

          {/* ── Language ── */}
          {active === "Language" && (
            <div className="settings-phase2">
              <span className="settings-phase2__icon"><Info aria-hidden="true" /></span>
              <div>
                <strong>Full localisation is a Phase 2 feature</strong>
                <p>The prototype UI is in English. Arabic text appears in notification templates and RTL input fields. Full Arabic/English switching, RTL layout mirroring, and locale-aware date/number formatting will be implemented once the i18n strategy is approved.</p>
                <p className="settings-phase2__note">{PHASE2_NOTE}</p>
              </div>
            </div>
          )}

          {/* ── Appointment types ── */}
          {active === "Appointment types" && (
            <div className="settings-table-section">
              <p className="settings-section-note"><Info aria-hidden="true" /> Changes are local and reset on refresh. Real persistence requires backend integration.</p>
              <div className="settings-table-wrap">
                <table className="settings-table">
                  <thead>
                    <tr>
                      <th scope="col">Type</th>
                      <th scope="col">Duration</th>
                      <th scope="col">Default price</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apptTypes.map((apt) => (
                      <tr key={apt.id}>
                        <td>
                          <span className="settings-color-dot" style={{ background: apt.color }} aria-hidden="true" />
                          <strong>{apt.name}</strong>
                        </td>
                        <td>{apt.defaultDurationMinutes} min</td>
                        <td>EGP {apt.defaultPrice.toLocaleString()}</td>
                        <td>
                          <span className={`settings-status ${apt.active ? "settings-status--active" : "settings-status--inactive"}`}>
                            {apt.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="settings-text-action"
                            onClick={() => setApptTypes((prev) => prev.map((a) => a.id === apt.id ? { ...a, active: !a.active } : a))}
                          >
                            {apt.active ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Services ── */}
          {active === "Services" && (
            <div className="settings-table-section">
              <p className="settings-section-note"><Info aria-hidden="true" /> Changes are local and reset on refresh.</p>
              <div className="settings-table-wrap">
                <table className="settings-table">
                  <thead>
                    <tr>
                      <th scope="col">Service</th>
                      <th scope="col">Category</th>
                      <th scope="col">Default price</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((svc) => (
                      <tr key={svc.id}>
                        <td><strong>{svc.name}</strong></td>
                        <td>{svc.category}</td>
                        <td>EGP {svc.defaultPrice.toLocaleString()}</td>
                        <td>
                          <span className={`settings-status ${svc.active ? "settings-status--active" : "settings-status--inactive"}`}>
                            {svc.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="settings-text-action"
                            onClick={() => setServices((prev) => prev.map((s) => s.id === svc.id ? { ...s, active: !s.active } : s))}
                          >
                            {svc.active ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Working hours ── */}
          {active === "Working hours" && (
            <div className="settings-table-section">
              <p className="settings-section-note"><Info aria-hidden="true" /> Branch-level working hours. Dentist-specific availability is managed in the Doctors workspace. Changes here are local.</p>
              <div className="settings-table-wrap">
                <table className="settings-table">
                  <thead>
                    <tr>
                      <th scope="col">Day</th>
                      <th scope="col">Open</th>
                      <th scope="col">Start</th>
                      <th scope="col">End</th>
                      <th scope="col">Break</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workingHours.map((day) => (
                      <tr key={day.day} className={!day.open ? "settings-row--closed" : ""}>
                        <td><strong>{day.day}</strong></td>
                        <td>
                          <span className={`settings-status ${day.open ? "settings-status--active" : "settings-status--inactive"}`}>
                            {day.open ? "Open" : "Closed"}
                          </span>
                        </td>
                        <td>{day.open ? day.start : "—"}</td>
                        <td>{day.open ? day.end : "—"}</td>
                        <td>
                          {day.open && day.breakStart
                            ? `${day.breakStart} – ${day.breakEnd}`
                            : day.open ? "No break" : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="settings-phase2__note" style={{ marginTop: 14 }}>Editing working hours requires backend integration to prevent double-booking against existing appointments.</p>
            </div>
          )}

          {/* ── Appointment rules ── */}
          {active === "Appointment rules" && (
            <form className="settings-form" onSubmit={handleRulesSave}>
              <div className="settings-form__grid">
                <label>
                  <span>Default slot duration (minutes)</span>
                  <input name="defaultSlotMinutes" type="number" min={5} max={240} step={5} defaultValue={rules.defaultSlotMinutes} />
                </label>
                <label>
                  <span>Minimum advance booking (hours)</span>
                  <input name="minAdvanceBookingHours" type="number" min={0} defaultValue={rules.minAdvanceBookingHours} />
                </label>
                <label>
                  <span>Maximum advance booking (days)</span>
                  <input name="maxAdvanceBookingDays" type="number" min={1} defaultValue={rules.maxAdvanceBookingDays} />
                </label>
                <label>
                  <span>Cancellation cut-off (hours before appointment)</span>
                  <input name="cancellationCutoffHours" type="number" min={0} defaultValue={rules.cancellationCutoffHours} />
                </label>
              </div>
              <div className="settings-toggles">
                <label className="settings-toggle-row">
                  <span>
                    <strong>Allow double booking</strong>
                    <small>Permit two appointments in the same chair/dentist slot</small>
                  </span>
                  <input name="allowDoubleBooking" type="checkbox" role="switch" defaultChecked={rules.allowDoubleBooking} />
                </label>
                <label className="settings-toggle-row">
                  <span>
                    <strong>Require Admin override reason</strong>
                    <small>Force a written justification when Admin bypasses a conflict</small>
                  </span>
                  <input name="requireAdminOverrideReason" type="checkbox" role="switch" defaultChecked={rules.requireAdminOverrideReason} />
                </label>
                <label className="settings-toggle-row">
                  <span>
                    <strong>Auto-confirm new bookings</strong>
                    <small>Set appointments to Confirmed automatically on creation</small>
                  </span>
                  <input name="autoConfirm" type="checkbox" role="switch" defaultChecked={rules.autoConfirm} />
                </label>
              </div>
              <div className="settings-form__actions">
                <button type="submit" className="button button--primary">Save appointment rules</button>
              </div>
            </form>
          )}

          {/* ── Billing ── */}
          {active === "Billing" && (
            <form className="settings-form" onSubmit={handleBillingSave}>
              <div className="settings-form__grid">
                <label>
                  <span>Currency</span>
                  <select name="currency" defaultValue={billing.currency}>
                    <option value="EGP">EGP — Egyptian Pound</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                  </select>
                </label>
                <label>
                  <span>Tax rate (%)</span>
                  <input name="taxRate" type="number" min={0} max={100} step={0.01} defaultValue={billing.taxRate} />
                </label>
                <label>
                  <span>Tax label</span>
                  <input name="taxLabel" type="text" defaultValue={billing.taxLabel} placeholder="e.g. VAT" />
                </label>
                <label>
                  <span>Payment terms (days)</span>
                  <input name="paymentTermsDays" type="number" min={0} defaultValue={billing.paymentTermsDays} />
                </label>
                <label>
                  <span>Invoice prefix</span>
                  <input name="invoicePrefix" type="text" defaultValue={billing.invoicePrefix} />
                </label>
                <label>
                  <span>Receipt prefix</span>
                  <input name="receiptPrefix" type="text" defaultValue={billing.receiptPrefix} />
                </label>
              </div>
              <div className="settings-toggles">
                <label className="settings-toggle-row">
                  <span>
                    <strong>Allow partial payments</strong>
                    <small>Patients can pay invoices in instalments</small>
                  </span>
                  <input name="allowPartialPayments" type="checkbox" role="switch" defaultChecked={billing.allowPartialPayments} />
                </label>
              </div>
              <div className="settings-phase2 settings-phase2--inline">
                <Info aria-hidden="true" />
                <p>Egyptian e-invoicing and e-receipt obligations, credit notes, and formal tax compliance require a dedicated legal and backend review before activation.</p>
              </div>
              <div className="settings-form__actions">
                <button type="submit" className="button button--primary">Save billing settings</button>
              </div>
            </form>
          )}

          {/* ── Notifications ── */}
          {active === "Notifications" && (
            <div className="settings-phase2">
              <span className="settings-phase2__icon"><Globe aria-hidden="true" /></span>
              <div>
                <strong>Manage notification templates in the Notifications workspace</strong>
                <p>Email channel settings, sender configuration, reminder timing, and Arabic/English templates are managed in the dedicated Notifications screen.</p>
                <a href="/notifications" className="button button--secondary" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, textDecoration: "none", fontSize: 13 }}>
                  Go to Notifications <ChevronRight aria-hidden="true" style={{ width: 15 }} />
                </a>
              </div>
            </div>
          )}

          {/* ── Users ── */}
          {active === "Users" && (
            <div className="settings-table-section">
              <p className="settings-section-note"><Info aria-hidden="true" /> User accounts shown are mock data. Real account creation, password reset, and deactivation require backend and secure auth integration.</p>
              <div className="settings-table-wrap">
                <table className="settings-table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Role</th>
                      <th scope="col">MFA</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className={!user.active ? "settings-row--closed" : ""}>
                        <td><strong>{user.name}</strong></td>
                        <td>{user.email}</td>
                        <td>
                          <span className="settings-role-badge">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td>
                          {user.mfaEnabled
                            ? <span className="settings-mfa settings-mfa--on"><BadgeCheck aria-hidden="true" />Enabled</span>
                            : <span className="settings-mfa settings-mfa--off">—</span>}
                        </td>
                        <td>
                          <span className={`settings-status ${user.active ? "settings-status--active" : "settings-status--inactive"}`}>
                            {user.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="settings-phase2__note" style={{ marginTop: 14 }}>Invite, deactivate, and role-change actions will be available once the auth backend is implemented. Inactive users are preserved for audit history.</p>
            </div>
          )}

          {/* ── Security ── */}
          {active === "Security" && (
            <form className="settings-form" onSubmit={handleSecuritySave}>
              <div className="settings-form__grid">
                <label>
                  <span>Session timeout (minutes of inactivity)</span>
                  <input name="sessionTimeoutMinutes" type="number" min={5} max={480} defaultValue={security.sessionTimeoutMinutes} />
                </label>
                <label>
                  <span>Minimum password length</span>
                  <input name="passwordMinLength" type="number" min={8} max={32} defaultValue={security.passwordMinLength} />
                </label>
                <label>
                  <span>Failed login lockout (attempts)</span>
                  <input name="loginAttemptLockout" type="number" min={3} max={20} defaultValue={security.loginAttemptLockout} />
                </label>
              </div>
              <div className="settings-toggles">
                <label className="settings-toggle-row">
                  <span>
                    <strong>Require uppercase letter in passwords</strong>
                    <small>At least one A–Z character required</small>
                  </span>
                  <input name="requireUppercase" type="checkbox" role="switch" defaultChecked={security.requireUppercase} />
                </label>
                <label className="settings-toggle-row">
                  <span>
                    <strong>Require special character in passwords</strong>
                    <small>At least one symbol (!@#$…) required</small>
                  </span>
                  <input name="requireSpecialChar" type="checkbox" role="switch" defaultChecked={security.requireSpecialChar} />
                </label>
                <label className="settings-toggle-row">
                  <span>
                    <strong>MFA required for Admin accounts</strong>
                    <small>Admins must enrol TOTP before accessing the system</small>
                  </span>
                  <input name="mfaRequiredForAdmin" type="checkbox" role="switch" defaultChecked={security.mfaRequiredForAdmin} />
                </label>
              </div>
              <div className="settings-phase2 settings-phase2--inline">
                <Info aria-hidden="true" />
                <p>These settings are UI affordances only. Enforcement requires the backend auth layer. Do not rely on these controls for production security.</p>
              </div>
              <div className="settings-form__actions">
                <button type="submit" className="button button--primary">Save security settings</button>
              </div>
            </form>
          )}

          {/* ── Audit ── */}
          {active === "Audit" && (
            <div className="settings-table-section">
              <div className="settings-audit-info">
                <article>
                  <span className="settings-audit-info__icon"><ShieldCheck aria-hidden="true" /></span>
                  <div>
                    <strong>Audit log retention</strong>
                    <p>Target: 7 years for clinical events, 5 years for financial events. Configurable retention periods require backend implementation and Egyptian data-residency review.</p>
                  </div>
                </article>
                <article>
                  <span className="settings-audit-info__icon"><Stethoscope aria-hidden="true" /></span>
                  <div>
                    <strong>Clinical record access logging</strong>
                    <p>All clinical record views, attachment downloads, and admin overrides will be logged server-side. The Audit Logs screen provides the searchable view.</p>
                  </div>
                </article>
                <article>
                  <span className="settings-audit-info__icon"><ReceiptText aria-hidden="true" /></span>
                  <div>
                    <strong>Financial audit trail</strong>
                    <p>Invoice void, refund, and write-off actions are immutable. The financial audit feed is accessible in the Audit Logs screen.</p>
                  </div>
                </article>
                <article>
                  <span className="settings-audit-info__icon"><Globe aria-hidden="true" /></span>
                  <div>
                    <strong>Legal &amp; compliance boundary</strong>
                    <p>Egyptian data-residency, e-invoicing obligations, and consent requirements are open items. Technical controls do not imply legal compliance. A legal review is required before go-live.</p>
                  </div>
                </article>
              </div>
              <p className="settings-phase2__note" style={{ marginTop: 16 }}>Audit retention configuration, scheduled exports, and DSAR tooling will be available after the backend is implemented.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
